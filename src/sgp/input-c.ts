namespace ja2 {

// Make sure to refer to the translation table which is within one of the following files (depending
// on the language used). ENGLISH.C, JAPANESE.C, FRENCH.C, GERMAN.C, SPANISH.C, etc...

// The gfKeyState table is used to track which of the keys is up or down at any one time. This is used while polling
// the interface.

const WM_MOUSEMOVE = 0x0200;
const WM_LBUTTONDOWN = 0x0201;
const WM_LBUTTONUP = 0x0202;
const WM_RBUTTONDOWN = 0x0204;
const WM_RBUTTONUP = 0x0205;

export let gfKeyState: boolean[] /* [256] */ = createArray(256, false); // TRUE = Pressed, FALSE = Not Pressed
let fCursorWasClipped: boolean = false;
let gCursorClipRect: RECT = createRect();

// The gsKeyTranslationTables basically translates scan codes to our own key value table. Please note that the table is 2 bytes
// wide per entry. This will be used since we will use 2 byte characters for translation purposes.

let gfShiftState: UINT16; // TRUE = Pressed, FALSE = Not Pressed
let gfAltState: UINT16; // TRUE = Pressed, FALSE = Not Pressed
let gfCtrlState: UINT16; // TRUE = Pressed, FALSE = Not Pressed

// These data structure are used to track the mouse while polling

let gfTrackDblClick: boolean;
let guiDoubleClkDelay: UINT32; // Current delay in milliseconds for a delay
let guiSingleClickTimer: UINT32;
let guiRecordedWParam: UINT32;
let guiRecordedLParam: UINT32;
let gusRecordedKeyState: UINT16;
let gfRecordedLeftButtonUp: boolean;

let guiLeftButtonRepeatTimer: UINT32;
let guiRightButtonRepeatTimer: UINT32;

let gfTrackMousePos: boolean; // TRUE = queue mouse movement events, FALSE = don't
export let gfLeftButtonState: boolean; // TRUE = Pressed, FALSE = Not Pressed
export let gfRightButtonState: boolean; // TRUE = Pressed, FALSE = Not Pressed
export let gusMouseXPos: UINT16; // X position of the mouse on screen
export let gusMouseYPos: UINT16; // y position of the mouse on screen

// The queue structures are used to track input events using queued events

let gEventQueue: InputAtom[] /* [256] */ = createArrayFrom(256, createInputAtom);
let gusQueueCount: UINT16;
let gusHeadIndex: UINT16;
let gusTailIndex: UINT16;

// ATE: Added to signal if we have had input this frame - cleared by the SGP main loop
export let gfSGPInputReceived: boolean = false;

// This is the WIN95 hook specific data and defines used to handle the keyboard and
// mouse hook

// If the following pointer is non NULL then input characters are redirected to
// the related string

let gfCurrentStringInputState: boolean;
let gpCurrentStringDescriptor: StringInput | null;

// Local function headers

export function ClipCursor(pos: RECT | null): void {
}

export function GetCursorPos(pos: POINT): void {
  pos.x = gusMouseXPos;
  pos.y = gusMouseYPos;
}

export function ShowCursor(show: boolean): void {
  ghInstance.style.cursor = show ? '' : 'none';
}

// These are the hook functions for both keyboard and mouse

function KeyboardHandler(Code: number, wParam: number, lParam: number): boolean {
  if (lParam & TRANSITION_MASK) {
    // The key has been released
    KeyUp(wParam, lParam);
    // gfSGPInputReceived =  TRUE;
  } else {
    // Key was up
    KeyDown(wParam, lParam);
    gfSGPInputReceived = true;
  }

  return true;
}

function MouseHandler(Code: number, wParam: number, lParam: number): boolean {
  let uiParam: UINT32;

  switch (wParam) {
    case WM_LBUTTONDOWN: // Update the current mouse position
      gusMouseXPos = lParam & 0xFFFF;
      gusMouseYPos = (lParam >> 16) & 0xFFFF;
      uiParam = gusMouseYPos;
      uiParam = uiParam << 16;
      uiParam = uiParam | gusMouseXPos;
      // Update the button state
      gfLeftButtonState = true;
      // Set that we have input
      gfSGPInputReceived = true;
      // Trigger an input event
      QueueEvent(LEFT_BUTTON_DOWN, 0, uiParam);
      break;
    case WM_LBUTTONUP: // Update the current mouse position
      gusMouseXPos = lParam & 0xFFFF;
      gusMouseYPos = (lParam >> 16) & 0xFFFF;
      uiParam = gusMouseYPos;
      uiParam = uiParam << 16;
      uiParam = uiParam | gusMouseXPos;
      // Update the button state
      gfLeftButtonState = false;
      // Set that we have input
      gfSGPInputReceived = true;
      // Trigger an input event
      QueueEvent(LEFT_BUTTON_UP, 0, uiParam);
      break;
    case WM_RBUTTONDOWN: // Update the current mouse position
      gusMouseXPos = lParam & 0xFFFF;
      gusMouseYPos = (lParam >> 16) & 0xFFFF;
      uiParam = gusMouseYPos;
      uiParam = uiParam << 16;
      uiParam = uiParam | gusMouseXPos;
      // Update the button state
      gfRightButtonState = true;
      // Set that we have input
      gfSGPInputReceived = true;
      // Trigger an input event
      QueueEvent(RIGHT_BUTTON_DOWN, 0, uiParam);
      break;
    case WM_RBUTTONUP: // Update the current mouse position
      gusMouseXPos = lParam & 0xFFFF;
      gusMouseYPos = (lParam >> 16) & 0xFFFF;
      uiParam = gusMouseYPos;
      uiParam = uiParam << 16;
      uiParam = uiParam | gusMouseXPos;
      // Update the button state
      gfRightButtonState = false;
      // Set that we have input
      gfSGPInputReceived = true;
      // Trigger an input event
      QueueEvent(RIGHT_BUTTON_UP, 0, uiParam);
      break;
    case WM_MOUSEMOVE: // Update the current mouse position
      gusMouseXPos = lParam & 0xFFFF;
      gusMouseYPos = (lParam >> 16) & 0xFFFF;
      uiParam = gusMouseYPos;
      uiParam = uiParam << 16;
      uiParam = uiParam | gusMouseXPos;
      // Trigger an input event
      if (gfTrackMousePos == true) {
        QueueEvent(MOUSE_POS, 0, uiParam);
      }
      // Set that we have input
      gfSGPInputReceived = true;
      break;
  }
  return true;
}

export function InitializeInputManager(): boolean {
  // Link to debugger
  RegisterDebugTopic(TOPIC_INPUT, "Input Manager");
  // Initialize the gfKeyState table to FALSE everywhere
  gfKeyState.fill(false);
  // Initialize the Event Queue
  gusQueueCount = 0;
  gusHeadIndex = 0;
  gusTailIndex = 0;
  // By default, we will not queue mousemove events
  gfTrackMousePos = false;
  // Initialize other variables
  gfShiftState = 0;
  gfAltState = 0;
  gfCtrlState = 0;
  // Initialize variables pertaining to DOUBLE CLIK stuff
  gfTrackDblClick = true;
  guiDoubleClkDelay = DBL_CLK_TIME;
  guiSingleClickTimer = 0;
  gfRecordedLeftButtonUp = false;
  // Initialize variables pertaining to the button states
  gfLeftButtonState = false;
  gfRightButtonState = false;
  // Initialize variables pertaining to the repeat mechanism
  guiLeftButtonRepeatTimer = 0;
  guiRightButtonRepeatTimer = 0;
  // Set the mouse to the center of the screen
  gusMouseXPos = 320;
  gusMouseYPos = 240;
  // Initialize the string input mechanism
  gfCurrentStringInputState = false;
  gpCurrentStringDescriptor = null;

  window.addEventListener('keyup', (ev) => {
    KeyboardHandler(0, ev.keyCode, TRANSITION_MASK);
  });

  window.addEventListener('keydown', (ev) => {
    KeyboardHandler(0, ev.keyCode, 0);
  });

  ghInstance.addEventListener('mousemove', (ev) => {
    MouseHandler(0, WM_MOUSEMOVE, (ev.offsetY << 16) | ev.offsetX);
  });

  ghInstance.addEventListener('mousedown', (ev) => {
    MouseHandler(0, ev.button === 0 ? WM_LBUTTONDOWN : WM_RBUTTONDOWN, (ev.offsetY << 16) | ev.offsetX);
  });

  ghInstance.addEventListener('mouseup', (ev) => {
    MouseHandler(0, ev.button === 0 ? WM_LBUTTONUP : WM_RBUTTONUP, (ev.offsetY << 16) | ev.offsetX);
  });

  return true;
}

export function ShutdownInputManager(): void {
  // There's very little to do when shutting down the input manager. In the future, this is where the keyboard and
  // mouse hooks will be destroyed
  UnRegisterDebugTopic(TOPIC_INPUT, "Input Manager");
}

function QueuePureEvent(ubInputEvent: UINT16, usParam: UINT32, uiParam: UINT32): void {
  let uiTimer: UINT32;
  let usKeyState: UINT16;

  uiTimer = GetTickCount();
  usKeyState = gfShiftState | gfCtrlState | gfAltState;

  // Can we queue up one more event, if not, the event is lost forever
  if (gusQueueCount == 256) {
    // No more queue space
    return;
  }

  // Okey Dokey, we can queue up the event, so we do it
  gEventQueue[gusTailIndex].uiTimeStamp = uiTimer;
  gEventQueue[gusTailIndex].usKeyState = usKeyState;
  gEventQueue[gusTailIndex].usEvent = ubInputEvent;
  gEventQueue[gusTailIndex].usParam = usParam;
  gEventQueue[gusTailIndex].uiParam = uiParam;

  // Increment the number of items on the input queue
  gusQueueCount++;

  // Increment the gusTailIndex pointer
  if (gusTailIndex == 255) {
    // The gusTailIndex is about to wrap around the queue ring
    gusTailIndex = 0;
  } else {
    // We simply increment the gusTailIndex
    gusTailIndex++;
  }
}

export function QueueEvent(ubInputEvent: UINT16, usParam: UINT32, uiParam: UINT32): void {
  let uiTimer: UINT32;
  let usKeyState: UINT16;

  uiTimer = GetTickCount();
  usKeyState = gfShiftState | gfCtrlState | gfAltState;

  // Can we queue up one more event, if not, the event is lost forever
  if (gusQueueCount == 256) {
    // No more queue space
    return;
  }

  if (ubInputEvent == LEFT_BUTTON_DOWN) {
    guiLeftButtonRepeatTimer = uiTimer + BUTTON_REPEAT_TIMEOUT;
  }

  if (ubInputEvent == RIGHT_BUTTON_DOWN) {
    guiRightButtonRepeatTimer = uiTimer + BUTTON_REPEAT_TIMEOUT;
  }

  if (ubInputEvent == LEFT_BUTTON_UP) {
    guiLeftButtonRepeatTimer = 0;
  }

  if (ubInputEvent == RIGHT_BUTTON_UP) {
    guiRightButtonRepeatTimer = 0;
  }

  if ((ubInputEvent == LEFT_BUTTON_UP)) {
    // Do we have a double click
    if ((uiTimer - guiSingleClickTimer) < DBL_CLK_TIME) {
      guiSingleClickTimer = 0;

      // Add a button up first...
      gEventQueue[gusTailIndex].uiTimeStamp = uiTimer;
      gEventQueue[gusTailIndex].usKeyState = gusRecordedKeyState;
      gEventQueue[gusTailIndex].usEvent = LEFT_BUTTON_UP;
      gEventQueue[gusTailIndex].usParam = usParam;
      gEventQueue[gusTailIndex].uiParam = uiParam;

      // Increment the number of items on the input queue
      gusQueueCount++;

      // Increment the gusTailIndex pointer
      if (gusTailIndex == 255) {
        // The gusTailIndex is about to wrap around the queue ring
        gusTailIndex = 0;
      } else {
        // We simply increment the gusTailIndex
        gusTailIndex++;
      }

      // Now do double click
      gEventQueue[gusTailIndex].uiTimeStamp = uiTimer;
      gEventQueue[gusTailIndex].usKeyState = gusRecordedKeyState;
      gEventQueue[gusTailIndex].usEvent = LEFT_BUTTON_DBL_CLK;
      gEventQueue[gusTailIndex].usParam = usParam;
      gEventQueue[gusTailIndex].uiParam = uiParam;

      // Increment the number of items on the input queue
      gusQueueCount++;

      // Increment the gusTailIndex pointer
      if (gusTailIndex == 255) {
        // The gusTailIndex is about to wrap around the queue ring
        gusTailIndex = 0;
      } else {
        // We simply increment the gusTailIndex
        gusTailIndex++;
      }

      return;
    } else {
      // Save time
      guiSingleClickTimer = uiTimer;
    }
  }

  // Okey Dokey, we can queue up the event, so we do it
  gEventQueue[gusTailIndex].uiTimeStamp = uiTimer;
  gEventQueue[gusTailIndex].usKeyState = usKeyState;
  gEventQueue[gusTailIndex].usEvent = ubInputEvent;
  gEventQueue[gusTailIndex].usParam = usParam;
  gEventQueue[gusTailIndex].uiParam = uiParam;

  // Increment the number of items on the input queue
  gusQueueCount++;

  // Increment the gusTailIndex pointer
  if (gusTailIndex == 255) {
    // The gusTailIndex is about to wrap around the queue ring
    gusTailIndex = 0;
  } else {
    // We simply increment the gusTailIndex
    gusTailIndex++;
  }
}

export function DequeueSpecificEvent(Event: InputAtom, uiMaskFlags: UINT32): boolean {
  // Is there an event to dequeue
  if (gusQueueCount > 0) {
    copyInputAtom(Event, gEventQueue[gusHeadIndex]);

    // Check if it has the masks!
    if ((Event.usEvent & uiMaskFlags)) {
      return DequeueEvent(Event);
    }
  }

  return false;
}

export function DequeueEvent(Event: InputAtom): boolean {
  HandleSingleClicksAndButtonRepeats();

  // Is there an event to dequeue
  if (gusQueueCount > 0) {
    // We have an event, so we dequeue it
    copyInputAtom(Event, gEventQueue[gusHeadIndex]);

    if (gusHeadIndex == 255) {
      gusHeadIndex = 0;
    } else {
      gusHeadIndex++;
    }

    // Decrement the number of items on the input queue
    gusQueueCount--;

    // dequeued an event, return TRUE
    return true;
  } else {
    // No events to dequeue, return FALSE
    return false;
  }
}

function KeyChange(usParam: UINT32, uiParam: UINT32, ufKeyState: boolean /* UINT8 */): void {
  let ubKey: UINT32;
  let ubChar: UINT16;
  let MousePos: POINT = createPoint();
  let uiTmpLParam: UINT32;

  if ((usParam >= 96) && (usParam <= 110)) {
    // Well this could be a NUMPAD character imitating the center console characters (when NUMLOCK is OFF). Well we
    // gotta find out what was pressed and translate it to the actual physical key (i.e. if we think that HOME was
    // pressed but NUM_7 was pressed, the we translate the key into NUM_7
    switch (usParam) {
      case 96 // NUM_0
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 82) {
          // Well its the NUM_9 key and not actually the PGUP key
          ubKey = 223;
        } else {
          // NOP, its the PGUP key all right
          ubKey = usParam;
        }
        break;
      case 110 // NUM_PERIOD
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 83) {
          // Well its the NUM_3 key and not actually the PGDN key
          ubKey = 224;
        } else {
          // NOP, its the PGDN key all right
          ubKey = usParam;
        }
        break;
      case 97 // NUM_1
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 79) {
          // Well its the NUM_1 key and not actually the END key
          ubKey = 225;
        } else {
          // NOP, its the END key all right
          ubKey = usParam;
        }
        break;
      case 98 // NUM_2
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 80) {
          // Well its the NUM_7 key and not actually the HOME key
          ubKey = 226;
        } else {
          // NOP, its the HOME key all right
          ubKey = usParam;
        }
        break;
      case 99 // NUM_3
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 81) {
          // Well its the NUM_4 key and not actually the LARROW key
          ubKey = 227;
        } else {
          // NOP, it's the LARROW key all right
          ubKey = usParam;
        }
        break;
      case 100 // NUM_4
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 75) {
          // Well its the NUM_8 key and not actually the UPARROW key
          ubKey = 228;
        } else {
          // NOP, it's the UPARROW key all right
          ubKey = usParam;
        }
        break;
      case 101 // NUM_5
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 76) {
          // Well its the NUM_6 key and not actually the RARROW key
          ubKey = 229;
        } else {
          // NOP, it's the RARROW key all right
          ubKey = usParam;
        }
        break;
      case 102 // NUM_6
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 77) {
          // Well its the NUM_2 key and not actually the DNARROW key
          ubKey = 230;
        } else {
          // NOP, it's the DNARROW key all right
          ubKey = usParam;
        }
        break;
      case 103 // NUM_7
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 71) {
          // Well its the NUM_0 key and not actually the INSERT key
          ubKey = 231;
        } else {
          // NOP, it's the INSERT key all right
          ubKey = usParam;
        }
        break;
      case 104 // NUM_8
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 72) {
          // Well its the NUM_PERIOD key and not actually the DELETE key
          ubKey = 232;
        } else {
          // NOP, it's the DELETE key all right
          ubKey = usParam;
        }
        break;
      case 105 // NUM_9
          :
        if (((uiParam & SCAN_CODE_MASK) >> 16) == 73) {
          // Well its the NUM_PERIOD key and not actually the DELETE key
          ubKey = 233;
        } else {
          // NOP, it's the DELETE key all right
          ubKey = usParam;
        }
        break;
      default:
        ubKey = usParam;
        break;
    }
  } else {
    if ((usParam >= 33) && (usParam <= 46)) {
      // Well this could be a NUMPAD character imitating the center console characters (when NUMLOCK is OFF). Well we
      // gotta find out what was pressed and translate it to the actual physical key (i.e. if we think that HOME was
      // pressed but NUM_7 was pressed, the we translate the key into NUM_7
      switch (usParam) {
        case 45 // NUM_0
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 82) {
            // Is it the NUM_0 key or the INSERT key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the INSERT key
              ubKey = 245;
            } else {
              // Is the NUM_0 key with NUM lock off
              ubKey = 234;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 46 // NUM_PERIOD
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 83) {
            // Is it the NUM_PERIOD key or the DEL key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the DELETE key
              ubKey = 246;
            } else {
              // Is the NUM_PERIOD key with NUM lock off
              ubKey = 235;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 35 // NUM_1
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 79) {
            // Is it the NUM_1 key or the END key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the END key
              ubKey = 247;
            } else {
              // Is the NUM_1 key with NUM lock off
              ubKey = 236;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 40 // NUM_2
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 80) {
            // Is it the NUM_2 key or the DOWN key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the DOWN key
              ubKey = 248;
            } else {
              // Is the NUM_2 key with NUM lock off
              ubKey = 237;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 34 // NUM_3
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 81) {
            // Is it the NUM_3 key or the PGDN key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the PGDN key
              ubKey = 249;
            } else {
              // Is the NUM_3 key with NUM lock off
              ubKey = 238;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 37 // NUM_4
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 75) {
            // Is it the NUM_4 key or the LEFT key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the LEFT key
              ubKey = 250;
            } else {
              // Is the NUM_4 key with NUM lock off
              ubKey = 239;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 39 // NUM_6
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 77) {
            // Is it the NUM_6 key or the RIGHT key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the RIGHT key
              ubKey = 251;
            } else {
              // Is the NUM_6 key with NUM lock off
              ubKey = 241;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 36 // NUM_7
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 71) {
            // Is it the NUM_7 key or the HOME key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the HOME key
              ubKey = 252;
            } else {
              // Is the NUM_7 key with NUM lock off
              ubKey = 242;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 38 // NUM_8
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 72) {
            // Is it the NUM_8 key or the UP key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the UP key
              ubKey = 253;
            } else {
              // Is the NUM_8 key with NUM lock off
              ubKey = 243;
            }
          } else {
            ubKey = usParam;
          }
          break;
        case 33 // NUM_9
            :
          if (((uiParam & SCAN_CODE_MASK) >> 16) == 73) {
            // Is it the NUM_9 key or the PGUP key
            if (((uiParam & EXT_CODE_MASK) >> 17) != 0) {
              // It's the PGUP key
              ubKey = 254;
            } else {
              // Is the NUM_9 key with NUM lock off
              ubKey = 244;
            }
          } else {
            ubKey = usParam;
          }
          break;
        default:
          ubKey = usParam;
          break;
      }
    } else {
      if (usParam == 12) {
        // NUM_5 with NUM_LOCK off
        ubKey = 240;
      } else {
        // Normal key
        ubKey = usParam;
      }
    }
  }

  // Find ucChar by translating ubKey using the gsKeyTranslationTable. If the SHIFT, ALT or CTRL key are down, then
  // the index into the translation table us changed from ubKey to ubKey+256, ubKey+512 and ubKey+768 respectively
  if (gfShiftState == 1) {
    // SHIFT is pressed, hence we add 256 to ubKey before translation to ubChar
    ubChar = gsKeyTranslationTable[ubKey + 256];
  } else {
    //
    // Even though gfAltState is checked as if it was a BOOLEAN, it really contains 0x02, which
    // is NOT == to true.  This is broken, however to fix it would break Ja2 and Wizardry.
    // The same thing goes for gfCtrlState and gfShiftState, howver gfShiftState is assigned 0x01 which IS == to TRUE.
    // Just something i found, and thought u should know about.  DF.
    //

    if (gfAltState == 1) {
      // ALT is pressed, hence ubKey is multiplied by 3 before translation to ubChar
      ubChar = gsKeyTranslationTable[ubKey + 512];
    } else {
      if (gfCtrlState == 1) {
        // CTRL is pressed, hence ubKey is multiplied by 4 before translation to ubChar
        ubChar = gsKeyTranslationTable[ubKey + 768];
      } else {
        // None of the SHIFT, ALT or CTRL are pressed hence we have a default translation of ubKey
        ubChar = gsKeyTranslationTable[ubKey];
      }
    }
  }

  GetCursorPos(MousePos);
  uiTmpLParam = ((MousePos.y << 16) & 0xffff0000) | (MousePos.x & 0x0000ffff);

  if (ufKeyState == true) {
    // Key has been PRESSED
    // Find out if the key is already pressed and if not, queue an event and update the gfKeyState array
    if (gfKeyState[ubKey] == false) {
      // Well the key has just been pressed, therefore we queue up and event and update the gsKeyState
      if (gfCurrentStringInputState == false) {
        // There is no string input going on right now, so we queue up the event
        gfKeyState[ubKey] = true;
        QueueEvent(KEY_DOWN, ubChar, uiTmpLParam);
      } else {
        // There is a current input string which will capture this event
        RedirectToString(ubChar);
        DbgMessage(TOPIC_INPUT, DBG_LEVEL_0, FormatString("Pressed character %d (%d)", ubChar, ubKey));
      }
    } else {
      // Well the key gets repeated
      if (gfCurrentStringInputState == false) {
        // There is no string input going on right now, so we queue up the event
        QueueEvent(KEY_REPEAT, ubChar, uiTmpLParam);
      } else {
        // There is a current input string which will capture this event
        RedirectToString(ubChar);
      }
    }
  } else {
    // Key has been RELEASED
    // Find out if the key is already pressed and if so, queue an event and update the gfKeyState array
    if (gfKeyState[ubKey] == true) {
      // Well the key has just been pressed, therefore we queue up and event and update the gsKeyState
      gfKeyState[ubKey] = false;
      QueueEvent(KEY_UP, ubChar, uiTmpLParam);
    }
    // else if the alt tab key was pressed
    else if (ubChar == TAB && gfAltState) {
      // therefore minimize the application
      gfKeyState[ALT] = false;
      gfAltState = 0;
    }
  }
}

function KeyDown(usParam: UINT32, uiParam: UINT32): void {
  // Are we PRESSING down one of SHIFT, ALT or CTRL ???
  if (usParam == 16) {
    // SHIFT key is PRESSED
    gfShiftState = SHIFT_DOWN;
    gfKeyState[16] = true;
  } else {
    if (usParam == 17) {
      // CTRL key is PRESSED
      gfCtrlState = CTRL_DOWN;
      gfKeyState[17] = true;
    } else {
      if (usParam == 18) {
        // ALT key is pressed
        gfAltState = ALT_DOWN;
        gfKeyState[18] = true;
      } else {
        if (usParam == SNAPSHOT) {
          // PrintScreen();
          // DB Done in the KeyUp function
          // this used to be keyed to SCRL_LOCK
          // which I believe Luis gave the wrong value
        } else {
          // No special keys have been pressed
          // Call KeyChange() and pass TRUE to indicate key has been PRESSED and not RELEASED
          KeyChange(usParam, uiParam, true);
        }
      }
    }
  }
}

function KeyUp(usParam: UINT32, uiParam: UINT32): void {
  // Are we RELEASING one of SHIFT, ALT or CTRL ???
  if (usParam == 16) {
    // SHIFT key is RELEASED
    gfShiftState = 0;
    gfKeyState[16] = false;
  } else {
    if (usParam == 17) {
      // CTRL key is RELEASED
      gfCtrlState = 0;
      gfKeyState[17] = false;
    } else {
      if (usParam == 18) {
        // ALT key is RELEASED
        gfAltState = 0;
        gfKeyState[18] = false;
      } else {
        if (usParam == SNAPSHOT) {
          // DB this used to be keyed to SCRL_LOCK
          // which I believe Luis gave the wrong value
          //#ifndef JA2
          PrintScreen();
        } else {
          // No special keys have been pressed
          // Call KeyChange() and pass FALSE to indicate key has been PRESSED and not RELEASED
          KeyChange(usParam, uiParam, false);
        }
      }
    }
  }
}

export function GetMousePos(Point: SGPPoint): void {
  let MousePos: POINT = createPoint();

  GetCursorPos(MousePos);

  Point.iX = MousePos.x;
  Point.iY = MousePos.y;

  return;
}

function CharacterIsValid(usCharacter: UINT16, pFilter: string /* Pointer<UINT16> */): boolean {
  let uiIndex: UINT32;
  let uiEndIndex: UINT32;

  if (pFilter != null) {
    uiEndIndex = pFilter.value;
    for (uiIndex = 1; uiIndex <= pFilter.value; uiIndex++) {
      if (usCharacter == (pFilter + uiIndex).value) {
        return true;
      }
    }
    return false;
  }

  return true;
}

function RedirectToString(usInputCharacter: UINT16): void {
  let usIndex: UINT16;

  if (gpCurrentStringDescriptor != null) {
    // Handle the new character input
    switch (usInputCharacter) {
      case ENTER: // ENTER is pressed, the last character field should be set to ENTER
        if (gpCurrentStringDescriptor.pNextString != null) {
          gpCurrentStringDescriptor.fFocus = false;
          gpCurrentStringDescriptor = gpCurrentStringDescriptor.pNextString;
          gpCurrentStringDescriptor.fFocus = true;
          gpCurrentStringDescriptor.usLastCharacter = 0;
        } else {
          gpCurrentStringDescriptor.fFocus = false;
          gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
          gfCurrentStringInputState = false;
        }
        break;
      case ESC: // ESC was pressed, the last character field should be set to ESC
        gpCurrentStringDescriptor.fFocus = false;
        gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
        gfCurrentStringInputState = false;
        break;
      case SHIFT_TAB: // TAB was pressed, the last character field should be set to TAB
        if (gpCurrentStringDescriptor.pPreviousString != null) {
          gpCurrentStringDescriptor.fFocus = false;
          gpCurrentStringDescriptor = gpCurrentStringDescriptor.pPreviousString;
          gpCurrentStringDescriptor.fFocus = true;
          gpCurrentStringDescriptor.usLastCharacter = 0;
        }
        break;
      case TAB: // TAB was pressed, the last character field should be set to TAB
        if (gpCurrentStringDescriptor.pNextString != null) {
          gpCurrentStringDescriptor.fFocus = false;
          gpCurrentStringDescriptor = gpCurrentStringDescriptor.pNextString;
          gpCurrentStringDescriptor.fFocus = true;
          gpCurrentStringDescriptor.usLastCharacter = 0;
        }
        break;
      case UPARROW: // The UPARROW was pressed, the last character field should be set to UPARROW
        if (gpCurrentStringDescriptor.pPreviousString != null) {
          gpCurrentStringDescriptor.fFocus = false;
          gpCurrentStringDescriptor = gpCurrentStringDescriptor.pPreviousString;
          gpCurrentStringDescriptor.fFocus = true;
          gpCurrentStringDescriptor.usLastCharacter = 0;
        }
        break;
      case DNARROW: // The DNARROW was pressed, the last character field should be set to DNARROW
        if (gpCurrentStringDescriptor.pNextString != null) {
          gpCurrentStringDescriptor.fFocus = false;
          gpCurrentStringDescriptor = gpCurrentStringDescriptor.pNextString;
          gpCurrentStringDescriptor.fFocus = true;
          gpCurrentStringDescriptor.usLastCharacter = 0;
        }
        break;
      case LEFTARROW: // The LEFTARROW was pressed, move one character to the left
        if (gpCurrentStringDescriptor.usStringOffset > 0) {
          // Decrement the offset
          gpCurrentStringDescriptor.usStringOffset--;
        }
        gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
        break;
      case RIGHTARROW: // The RIGHTARROW was pressed, move one character to the right
        if (gpCurrentStringDescriptor.usStringOffset < gpCurrentStringDescriptor.usCurrentStringLength) {
          // Ok we can move the cursor one up without going past the end of string
          gpCurrentStringDescriptor.usStringOffset++;
        }
        gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
        break;
      case BACKSPACE: // Delete the character preceding the cursor
        if (gpCurrentStringDescriptor.usStringOffset > 0) {
          // Ok, we are not at the beginning of the string, so we may proceed
          for (usIndex = gpCurrentStringDescriptor.usStringOffset; usIndex <= gpCurrentStringDescriptor.usCurrentStringLength; usIndex++) {
            // Shift the characters one at a time
            (gpCurrentStringDescriptor.pString + usIndex - 1).value = (gpCurrentStringDescriptor.pString + usIndex).value;
          }
          gpCurrentStringDescriptor.usStringOffset--;
          gpCurrentStringDescriptor.usCurrentStringLength--;
        }

        break;
      case DEL: // Delete the character which follows the cursor
        if (gpCurrentStringDescriptor.usStringOffset < gpCurrentStringDescriptor.usCurrentStringLength) {
          // Ok we are not at the end of the string, so we may proceed
          for (usIndex = gpCurrentStringDescriptor.usStringOffset; usIndex < gpCurrentStringDescriptor.usCurrentStringLength; usIndex++) {
            // Shift the characters one at a time
            (gpCurrentStringDescriptor.pString + usIndex).value = (gpCurrentStringDescriptor.pString + usIndex + 1).value;
          }
          gpCurrentStringDescriptor.usCurrentStringLength--;
        }
        gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
        break;
      case INSERT: // Toggle insert mode
        if (gpCurrentStringDescriptor.fInsertMode == true) {
          gpCurrentStringDescriptor.fInsertMode = false;
        } else {
          gpCurrentStringDescriptor.fInsertMode = true;
        }
        gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
        break;
      case HOME: // Go to the beginning of the input string
        gpCurrentStringDescriptor.usStringOffset = 0;
        gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
        break;
      case END
          : // Go to the end of the input string
        gpCurrentStringDescriptor.usStringOffset = gpCurrentStringDescriptor.usCurrentStringLength;
        gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
        break;
      default: //
        // normal input
        //
        if (CharacterIsValid(usInputCharacter, gpCurrentStringDescriptor.pFilter) == true) {
          if (gpCurrentStringDescriptor.fInsertMode == true) {
            // Before we can shift characters for the insert, we must make sure we have the space
            if (gpCurrentStringDescriptor.usCurrentStringLength < (gpCurrentStringDescriptor.usMaxStringLength - 1)) {
              // Before we can add a new character we must shift existing ones to for the insert
              for (usIndex = gpCurrentStringDescriptor.usCurrentStringLength; usIndex > gpCurrentStringDescriptor.usStringOffset; usIndex--) {
                // Shift the characters one at a time
                (gpCurrentStringDescriptor.pString + usIndex).value = (gpCurrentStringDescriptor.pString + usIndex - 1).value;
              }
              // Ok now we introduce the new character
              (gpCurrentStringDescriptor.pString + usIndex).value = usInputCharacter;
              gpCurrentStringDescriptor.usStringOffset++;
              gpCurrentStringDescriptor.usCurrentStringLength++;
            }
          } else {
            // Ok, add character to string (by overwriting)
            if (gpCurrentStringDescriptor.usStringOffset < (gpCurrentStringDescriptor.usMaxStringLength - 1)) {
              // Ok, we have not exceeded the maximum number of characters yet
              (gpCurrentStringDescriptor.pString + gpCurrentStringDescriptor.usStringOffset).value = usInputCharacter;
              gpCurrentStringDescriptor.usStringOffset++;
            }
            // Did we push back the current string length (i.e. add character to end of string)
            if (gpCurrentStringDescriptor.usStringOffset > gpCurrentStringDescriptor.usCurrentStringLength) {
              // Add a NULL character
              (gpCurrentStringDescriptor.pString + gpCurrentStringDescriptor.usStringOffset).value = 0;
              gpCurrentStringDescriptor.usCurrentStringLength++;
            }
          }
          gpCurrentStringDescriptor.usLastCharacter = usInputCharacter;
        }
        break;
    }
  }
}

//
// Miscellaneous input-related utility functions:
//

export function RestrictMouseToXYXY(usX1: UINT16, usY1: UINT16, usX2: UINT16, usY2: UINT16): void {
  let TempRect: SGPRect = createSGPRect();

  TempRect.iLeft = usX1;
  TempRect.iTop = usY1;
  TempRect.iRight = usX2;
  TempRect.iBottom = usY2;

  RestrictMouseCursor(TempRect);
}

export function RestrictMouseCursor(pRectangle: SGPRect): void {
  // Make a copy of our rect....
  gCursorClipRect.left = pRectangle.iLeft;
  gCursorClipRect.top = pRectangle.iTop;
  gCursorClipRect.right = pRectangle.iRight;
  gCursorClipRect.bottom = pRectangle.iBottom;
  ClipCursor(gCursorClipRect);
  fCursorWasClipped = true;
}

export function FreeMouseCursor(): void {
  ClipCursor(null);
  fCursorWasClipped = false;
}

export function RestoreCursorClipRect(): void {
  if (fCursorWasClipped) {
    ClipCursor(gCursorClipRect);
  }
}

export function GetRestrictedClipCursor(pRectangle: SGPRect): void {
  pRectangle.iLeft = gCursorClipRect.left;
  pRectangle.iTop = gCursorClipRect.top;
  pRectangle.iRight = gCursorClipRect.right;
  pRectangle.iBottom = gCursorClipRect.bottom;
}

export function IsCursorRestricted(): boolean {
  return fCursorWasClipped;
}

export function SimulateMouseMovement(uiNewXPos: UINT32, uiNewYPos: UINT32): void {
  let flNewXPos: FLOAT;
  let flNewYPos: FLOAT;

  // Wizardry NOTE: This function currently doesn't quite work right for in any Windows resolution other than 640x480.
  // mouse_event() uses your current Windows resolution to calculate the resulting x,y coordinates.  So in order to get
  // the right coordinates, you'd have to find out the current Windows resolution through a system call, and then do:
  //		uiNewXPos = uiNewXPos * SCREEN_WIDTH  / WinScreenResX;
  //		uiNewYPos = uiNewYPos * SCREEN_HEIGHT / WinScreenResY;
  //
  // JA2 doesn't have this problem, 'cause they use DirectDraw calls that change the Windows resolution properly.
  //
  // Alex Meduna, Dec. 3, 1997

  // Adjust coords based on our resolution
  flNewXPos = (uiNewXPos / SCREEN_WIDTH) * 65536;
  flNewYPos = (uiNewYPos / SCREEN_HEIGHT) * 65536;
}

function InputEventInside(Event: InputAtom, uiX1: UINT32, uiY1: UINT32, uiX2: UINT32, uiY2: UINT32): boolean {
  let uiEventX: UINT32;
  let uiEventY: UINT32;

  uiEventX = _EvMouseX(Event);
  uiEventY = _EvMouseY(Event);

  return (uiEventX >= uiX1) && (uiEventX <= uiX2) && (uiEventY >= uiY1) && (uiEventY <= uiY2);
}

export function DequeueAllKeyBoardEvents(): void {
  let InputEvent: InputAtom = createInputAtom();

  // Deque all the events waiting in the SGP queue
  while (DequeueEvent(InputEvent) == true) {
    // dont do anything
  }
}

function HandleSingleClicksAndButtonRepeats(): void {
  let uiTimer: UINT32;

  uiTimer = GetTickCount();

  // Is there a LEFT mouse button repeat
  if (gfLeftButtonState) {
    if ((guiLeftButtonRepeatTimer > 0) && (guiLeftButtonRepeatTimer <= uiTimer)) {
      let uiTmpLParam: UINT32;
      let MousePos: POINT = createPoint();

      GetCursorPos(MousePos);
      uiTmpLParam = ((MousePos.y << 16) & 0xffff0000) | (MousePos.x & 0x0000ffff);
      QueueEvent(LEFT_BUTTON_REPEAT, 0, uiTmpLParam);
      guiLeftButtonRepeatTimer = uiTimer + BUTTON_REPEAT_TIME;
    }
  } else {
    guiLeftButtonRepeatTimer = 0;
  }

  // Is there a RIGHT mouse button repeat
  if (gfRightButtonState) {
    if ((guiRightButtonRepeatTimer > 0) && (guiRightButtonRepeatTimer <= uiTimer)) {
      let uiTmpLParam: UINT32;
      let MousePos: POINT = createPoint();

      GetCursorPos(MousePos);
      uiTmpLParam = ((MousePos.y << 16) & 0xffff0000) | (MousePos.x & 0x0000ffff);
      QueueEvent(RIGHT_BUTTON_REPEAT, 0, uiTmpLParam);
      guiRightButtonRepeatTimer = uiTimer + BUTTON_REPEAT_TIME;
    }
  } else {
    guiRightButtonRepeatTimer = 0;
  }
}

}
