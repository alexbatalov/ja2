namespace ja2 {

//=================================================================================================
//	MouseSystem.c
//
//	Routines for handling prioritized mouse regions. The system as setup below allows the use of
//	callback functions for each region, as well as allowing a different cursor to be defined for
//	each region.
//
//	Written by Bret Rowdon, Jan 30 '97
//  Re-Written by Kris Morness, since...
//
//=================================================================================================

const BASE_REGION_FLAGS = (MSYS_REGION_ENABLED | MSYS_SET_CURSOR);

// Kris:	Nov 31, 1999 -- Added support for double clicking
//
// Max double click delay (in milliseconds) to be considered a double click
const MSYS_DOUBLECLICK_DELAY = 400;
//
// Records and stores the last place the user clicked.  These values are compared to the current
// click to determine if a double click event has been detected.
let gpRegionLastLButtonDown: MOUSE_REGION | null = null;
let gpRegionLastLButtonUp: MOUSE_REGION | null = null;
let guiRegionLastLButtonDownTime: UINT32 = 0;

let MSYS_ScanForID: boolean = false;
let MSYS_CurrentID: INT32 = MSYS_ID_SYSTEM;

let MSYS_CurrentMX: INT16 = 0;
let MSYS_CurrentMY: INT16 = 0;
let MSYS_CurrentButtons: INT16 = 0;
let MSYS_Action: INT16 = 0;

let MSYS_SystemInitialized: boolean = false;
let MSYS_UseMouseHandlerHook: boolean = false;

let MSYS_Mouse_Grabbed: boolean = false;
let MSYS_GrabRegion: MOUSE_REGION | null = null;

let gusClickedIDNumber: UINT16;
let gfClickedModeOn: boolean = false;

let MSYS_RegList: MOUSE_REGION | null = null;

export let MSYS_PrevRegion: MOUSE_REGION | null = null;
let MSYS_CurrRegion: MOUSE_REGION | null = null;

// When set, the fast help text will be instantaneous, if consecutive regions with help text are
// hilighted.  It is set, whenever the timer for the first help button expires, and the mode is
// cleared as soon as the cursor moves into no region or a region with no helptext.
let gfPersistantFastHelpMode: boolean;

let gsFastHelpDelay: INT16 = 600; // In timer ticks
let gfShowFastHelp: boolean = true;

// Kris:
// NOTE:  This doesn't really need to be here, however, it is a good indication that
// when an error appears here, that you need to go below to the init code and initialize the
// values there as well.  That's the only reason why I left this here.
let MSYS_SystemBaseRegion: MOUSE_REGION = createMouseRegionFrom(MSYS_ID_SYSTEM, MSYS_PRIORITY_SYSTEM, BASE_REGION_FLAGS, -32767, -32767, 32767, 32767, 0, 0, 0, 0, 0, 0, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK, [ 0, 0, 0, 0 ], 0, "", -1, MSYS_NO_CALLBACK, null, null);

let gfRefreshUpdate: boolean = false;

// Kris:  December 3, 1997
// Special internal debugging utilities that will ensure that you don't attempt to delete
// an already deleted region.  It will also ensure that you don't create an identical region
// that already exists.
// TO REMOVE ALL DEBUG FUNCTIONALITY:  simply comment out MOUSESYSTEM_DEBUGGING definition

//======================================================================================================
//	MSYS_Init
//
//	Initialize the mouse system.
//
export function MSYS_Init(): INT32 {
  RegisterDebugTopic(TOPIC_MOUSE_SYSTEM, "Mouse Region System");

  if (MSYS_RegList != null)
    MSYS_TrashRegList();

  MSYS_CurrentID = MSYS_ID_SYSTEM;
  MSYS_ScanForID = false;

  MSYS_CurrentMX = 0;
  MSYS_CurrentMY = 0;
  MSYS_CurrentButtons = 0;
  MSYS_Action = MSYS_NO_ACTION;

  MSYS_PrevRegion = null;
  MSYS_SystemInitialized = true;
  MSYS_UseMouseHandlerHook = false;

  MSYS_Mouse_Grabbed = false;
  MSYS_GrabRegion = null;

  // Setup the system's background region
  MSYS_SystemBaseRegion.IDNumber = MSYS_ID_SYSTEM;
  MSYS_SystemBaseRegion.PriorityLevel = MSYS_PRIORITY_SYSTEM;
  MSYS_SystemBaseRegion.uiFlags = BASE_REGION_FLAGS;
  MSYS_SystemBaseRegion.RegionTopLeftX = -32767;
  MSYS_SystemBaseRegion.RegionTopLeftY = -32767;
  MSYS_SystemBaseRegion.RegionBottomRightX = 32767;
  MSYS_SystemBaseRegion.RegionBottomRightY = 32767;
  MSYS_SystemBaseRegion.MouseXPos = 0;
  MSYS_SystemBaseRegion.MouseYPos = 0;
  MSYS_SystemBaseRegion.RelativeXPos = 0;
  MSYS_SystemBaseRegion.RelativeYPos = 0;
  MSYS_SystemBaseRegion.ButtonState = 0;
  MSYS_SystemBaseRegion.Cursor = 0;
  MSYS_SystemBaseRegion.UserData[0] = 0;
  MSYS_SystemBaseRegion.UserData[1] = 0;
  MSYS_SystemBaseRegion.UserData[2] = 0;
  MSYS_SystemBaseRegion.UserData[3] = 0;
  MSYS_SystemBaseRegion.MovementCallback = MSYS_NO_CALLBACK;
  MSYS_SystemBaseRegion.ButtonCallback = MSYS_NO_CALLBACK;

  MSYS_SystemBaseRegion.FastHelpTimer = 0;
  MSYS_SystemBaseRegion.FastHelpText = "";
  MSYS_SystemBaseRegion.FastHelpRect = -1;

  MSYS_SystemBaseRegion.next = null;
  MSYS_SystemBaseRegion.prev = null;

  // Add the base region to the list
  MSYS_AddRegionToList(MSYS_SystemBaseRegion);

  MSYS_UseMouseHandlerHook = true;

  return 1;
}

//======================================================================================================
//	MSYS_Shutdown
//
//	De-inits the "mousesystem" mouse region handling code.
//
export function MSYS_Shutdown(): void {
  MSYS_SystemInitialized = false;
  MSYS_UseMouseHandlerHook = false;
  MSYS_TrashRegList();
  UnRegisterDebugTopic(TOPIC_MOUSE_SYSTEM, "Mouse Region System");
}

//======================================================================================================
//	MSYS_SGP_Mouse_Handler_Hook
//
//	Hook to the SGP's mouse handler
//
export function MSYS_SGP_Mouse_Handler_Hook(Type: UINT16, Xcoord: UINT16, Ycoord: UINT16, LeftButton: boolean, RightButton: boolean): void {
  // If the mouse system isn't initialized, get out o' here
  if (!MSYS_SystemInitialized)
    return;

  // If we're not using the handler stuff, ignore this call
  if (!MSYS_UseMouseHandlerHook)
    return;

  MSYS_Action = MSYS_NO_ACTION;
  switch (Type) {
    case LEFT_BUTTON_DOWN:
    case LEFT_BUTTON_UP:
    case RIGHT_BUTTON_DOWN:
    case RIGHT_BUTTON_UP:
      // MSYS_Action|=MSYS_DO_BUTTONS;
      if (Type == LEFT_BUTTON_DOWN)
        MSYS_Action |= MSYS_DO_LBUTTON_DWN;
      else if (Type == LEFT_BUTTON_UP) {
        MSYS_Action |= MSYS_DO_LBUTTON_UP;
// Kris:
// Used only if applicable.  This is used for that special button that is locked with the
// mouse press -- just like windows.  When you release the button, the previous state
// of the button is restored if you released the mouse outside of it's boundaries.  If
// you release inside of the button, the action is selected -- but later in the code.
// NOTE:  It has to be here, because the mouse can be released anywhere regardless of
// regions, buttons, etc.
        ReleaseAnchorMode();
      } else if (Type == RIGHT_BUTTON_DOWN)
        MSYS_Action |= MSYS_DO_RBUTTON_DWN;
      else if (Type == RIGHT_BUTTON_UP)
        MSYS_Action |= MSYS_DO_RBUTTON_UP;

      if (LeftButton)
        MSYS_CurrentButtons |= MSYS_LEFT_BUTTON;
      else
        MSYS_CurrentButtons &= (~MSYS_LEFT_BUTTON);

      if (RightButton)
        MSYS_CurrentButtons |= MSYS_RIGHT_BUTTON;
      else
        MSYS_CurrentButtons &= (~MSYS_RIGHT_BUTTON);

      if ((Xcoord != MSYS_CurrentMX) || (Ycoord != MSYS_CurrentMY)) {
        MSYS_Action |= MSYS_DO_MOVE;
        MSYS_CurrentMX = Xcoord;
        MSYS_CurrentMY = Ycoord;
      }

      MSYS_UpdateMouseRegion();
      break;

    // ATE: Checks here for mouse button repeats.....
    // Call mouse region with new reason
    case LEFT_BUTTON_REPEAT:
    case RIGHT_BUTTON_REPEAT:

      if (Type == LEFT_BUTTON_REPEAT)
        MSYS_Action |= MSYS_DO_LBUTTON_REPEAT;
      else if (Type == RIGHT_BUTTON_REPEAT)
        MSYS_Action |= MSYS_DO_RBUTTON_REPEAT;

      if ((Xcoord != MSYS_CurrentMX) || (Ycoord != MSYS_CurrentMY)) {
        MSYS_Action |= MSYS_DO_MOVE;
        MSYS_CurrentMX = Xcoord;
        MSYS_CurrentMY = Ycoord;
      }

      MSYS_UpdateMouseRegion();
      break;

    case MOUSE_POS:
      if ((Xcoord != MSYS_CurrentMX) || (Ycoord != MSYS_CurrentMY) || gfRefreshUpdate) {
        MSYS_Action |= MSYS_DO_MOVE;
        MSYS_CurrentMX = Xcoord;
        MSYS_CurrentMY = Ycoord;

        gfRefreshUpdate = false;

        MSYS_UpdateMouseRegion();
      }
      break;

    default:
      DbgMessage(TOPIC_MOUSE_SYSTEM, DBG_LEVEL_0, "ERROR -- MSYS 2 SGP Mouse Hook got bad type");
      break;
  }
}

//======================================================================================================
//	MSYS_GetNewID
//
//	Returns a unique ID number for region nodes. If no new ID numbers can be found, the MAX value
//	is returned.
//
function MSYS_GetNewID(): INT32 {
  let retID: INT32;
  let Current: INT32;
  let found: boolean;
  let done: boolean;
  let node: MOUSE_REGION | null;

  retID = MSYS_CurrentID;
  MSYS_CurrentID++;

  // Crapy scan for an unused ID
  if ((MSYS_CurrentID >= MSYS_ID_MAX) || MSYS_ScanForID) {
    MSYS_ScanForID = true;
    Current = MSYS_ID_BASE;
    done = found = false;
    while (!done) {
      found = false;
      node = MSYS_RegList;
      while (node != null && !found) {
        if (node.IDNumber == Current)
          found = true;
      }

      if (found && Current < MSYS_ID_MAX) // Current ID is in use, and their are more to scan
        Current++;
      else {
        done = true; // Got an ID to use.
        if (found)
          Current = MSYS_ID_MAX; // Ooops, ran out of IDs, use MAX value!
      }
    }
    MSYS_CurrentID = Current;
  }

  return retID;
}

//======================================================================================================
//	MSYS_TrashRegList
//
//	Deletes the entire region list.
//
function MSYS_TrashRegList(): void {
  while (MSYS_RegList) {
    if (MSYS_RegList.uiFlags & MSYS_REGION_EXISTS) {
      MSYS_RemoveRegion(MSYS_RegList);
    } else {
      MSYS_RegList = MSYS_RegList.next;
    }
  }
}

//======================================================================================================
//	MSYS_AddRegionToList
//
//	Add a region struct to the current list. The list is sorted by priority levels. If two entries
//	have the same priority level, then the latest to enter the list gets the higher priority.
//
function MSYS_AddRegionToList(region: MOUSE_REGION): void {
  let curr: MOUSE_REGION;
  let done: boolean;

  // If region seems to already be in list, delete it so we can
  // re-insert the region.
  if (region.next || region.prev) {
    // if it wasn't actually there, then call does nothing!
    MSYS_DeleteRegionFromList(region);
  }

  // Set an ID number!
  region.IDNumber = MSYS_GetNewID();

  region.next = null;
  region.prev = null;

  if (!MSYS_RegList) {
    // Null list, so add it straight up.
    MSYS_RegList = region;
  } else {
    // Walk down list until we find place to insert (or at end of list)
    curr = MSYS_RegList;
    done = false;
    while ((curr.next != null) && !done) {
      if (curr.PriorityLevel <= region.PriorityLevel)
        done = true;
      else
        curr = curr.next;
    }

    if (curr.PriorityLevel > region.PriorityLevel) {
      // Add after curr node
      region.next = curr.next;
      curr.next = region;
      region.prev = curr;
      if (region.next != null)
        region.next.prev = region;
    } else {
      // Add before curr node
      region.next = curr;
      region.prev = curr.prev;

      curr.prev = region;
      if (region.prev != null)
        region.prev.next = region;

      if (MSYS_RegList == curr) // Make sure if adding at start, to adjust the list pointer
        MSYS_RegList = region;
    }
  }
}

//======================================================================================================
//	MSYS_RegionInList
//
//	Scan region list for presence of a node with the same region ID number
//
function MSYS_RegionInList(region: MOUSE_REGION): boolean {
  let Current: MOUSE_REGION | null;
  let found: boolean;

  found = false;
  Current = MSYS_RegList;
  while (Current && !found) {
    if (Current.IDNumber == region.IDNumber)
      found = true;
    Current = Current.next;
  }
  return found;
}

//======================================================================================================
//	MSYS_DeleteRegionFromList
//
//	Removes a region from the current list.
//
function MSYS_DeleteRegionFromList(region: MOUSE_REGION): void {
  // If no list present, there's nothin' to do.
  if (!MSYS_RegList)
    return;

  // Check if region in list
  if (!MSYS_RegionInList(region))
    return;

  // Remove a node from the list
  if (MSYS_RegList == region) {
    // First node on list, adjust main pointer.
    MSYS_RegList = region.next;
    if (MSYS_RegList != null)
      MSYS_RegList.prev = null;
    region.next = region.prev = null;
  } else {
    if (region.prev)
      region.prev.next = region.next;
    // If not last node in list, adjust following node's ->prev entry.
    if (region.next)
      region.next.prev = region.prev;
    region.prev = region.next = null;
  }

  // Did we delete a grabbed region?
  if (MSYS_Mouse_Grabbed) {
    if (MSYS_GrabRegion == region) {
      MSYS_Mouse_Grabbed = false;
      MSYS_GrabRegion = null;
    }
  }

  // Is only the system background region remaining?
  if (MSYS_RegList == MSYS_SystemBaseRegion) {
    // Yup, so let's reset the ID values!
    MSYS_CurrentID = MSYS_ID_BASE;
    MSYS_ScanForID = false;
  } else if (MSYS_RegList == null) {
    // Ack, we actually emptied the list, so let's reset for re-init possibilities
    MSYS_CurrentID = MSYS_ID_SYSTEM;
    MSYS_ScanForID = false;
  }
}

//======================================================================================================
//	MSYS_UpdateMouseRegion
//
//	Searches the list for the highest priority region and updates it's info. It also dispatches
//	the callback functions
//
function MSYS_UpdateMouseRegion(): void {
  let found: boolean;
  let ButtonReason: UINT32;
  let pTempRegion: MOUSE_REGION | null;
  let fFound: boolean = false;
  found = false;

  // Check previous region!
  if (MSYS_Mouse_Grabbed) {
    MSYS_CurrRegion = MSYS_GrabRegion;
    found = true;
  }
  if (!found)
    MSYS_CurrRegion = MSYS_RegList;

  while (!found && MSYS_CurrRegion) {
    if (MSYS_CurrRegion.uiFlags & (MSYS_REGION_ENABLED | MSYS_ALLOW_DISABLED_FASTHELP) && (MSYS_CurrRegion.RegionTopLeftX <= MSYS_CurrentMX) && // Check boundaries
        (MSYS_CurrRegion.RegionTopLeftY <= MSYS_CurrentMY) && (MSYS_CurrRegion.RegionBottomRightX >= MSYS_CurrentMX) && (MSYS_CurrRegion.RegionBottomRightY >= MSYS_CurrentMY)) {
      // We got the right region. We don't need to check for priorities 'cause
      // the whole list is sorted the right way!
      found = true;
    } else
      MSYS_CurrRegion = MSYS_CurrRegion.next;
  }

  if (MSYS_PrevRegion) {
    MSYS_PrevRegion.uiFlags &= (~MSYS_MOUSE_IN_AREA);

    if (MSYS_PrevRegion != MSYS_CurrRegion) {
      // Remove the help text for the previous region if one is currently being displayed.
      if (MSYS_PrevRegion.FastHelpText) {
        // ExecuteMouseHelpEndCallBack( MSYS_PrevRegion );

        if (MSYS_PrevRegion.uiFlags & MSYS_GOT_BACKGROUND)
          FreeBackgroundRectPending(MSYS_PrevRegion.FastHelpRect);
        MSYS_PrevRegion.uiFlags &= (~MSYS_GOT_BACKGROUND);
        MSYS_PrevRegion.uiFlags &= (~MSYS_FASTHELP_RESET);

        // if( region->uiFlags & MSYS_REGION_ENABLED )
        //	region->uiFlags |= BUTTON_DIRTY;
      }

      (<MOUSE_REGION>MSYS_CurrRegion).FastHelpTimer = gsFastHelpDelay;

      // Force a callbacks to happen on previous region to indicate that
      // the mouse has left the old region
      if (MSYS_PrevRegion.uiFlags & MSYS_MOVE_CALLBACK && MSYS_PrevRegion.uiFlags & MSYS_REGION_ENABLED)
        (<MOUSE_CALLBACK>MSYS_PrevRegion.MovementCallback)(MSYS_PrevRegion, MSYS_CALLBACK_REASON_LOST_MOUSE);
    }
  }

  // If a region was found in the list, update it's data
  if (found) {
    MSYS_CurrRegion = <MOUSE_REGION>MSYS_CurrRegion;
    if (MSYS_CurrRegion != MSYS_PrevRegion) {
      // Kris -- October 27, 1997
      // Implemented gain mouse region
      if (MSYS_CurrRegion.uiFlags & MSYS_MOVE_CALLBACK) {
        if (MSYS_CurrRegion.FastHelpText && !(MSYS_CurrRegion.uiFlags & MSYS_FASTHELP_RESET)) {
          // ExecuteMouseHelpEndCallBack( MSYS_CurrRegion );
          MSYS_CurrRegion.FastHelpTimer = gsFastHelpDelay;
          if (MSYS_CurrRegion.uiFlags & MSYS_GOT_BACKGROUND)
            FreeBackgroundRectPending(MSYS_CurrRegion.FastHelpRect);
          MSYS_CurrRegion.uiFlags &= (~MSYS_GOT_BACKGROUND);
          MSYS_CurrRegion.uiFlags |= MSYS_FASTHELP_RESET;

          // if( b->uiFlags & BUTTON_ENABLED )
          //	b->uiFlags |= BUTTON_DIRTY;
        }
        if (MSYS_CurrRegion.uiFlags & MSYS_REGION_ENABLED) {
          (<MOUSE_CALLBACK>MSYS_CurrRegion.MovementCallback)(MSYS_CurrRegion, MSYS_CALLBACK_REASON_GAIN_MOUSE);
        }
      }

      // if the cursor is set and is not set to no cursor
      if (MSYS_CurrRegion.uiFlags & MSYS_REGION_ENABLED && MSYS_CurrRegion.uiFlags & MSYS_SET_CURSOR && MSYS_CurrRegion.Cursor != MSYS_NO_CURSOR) {
        MSYS_SetCurrentCursor(MSYS_CurrRegion.Cursor);
      } else {
        // Addition Oct 10/1997 Carter, patch for mouse cursor
        // start at region and find another region encompassing
        pTempRegion = MSYS_CurrRegion.next;
        while ((pTempRegion != null) && (!fFound)) {
          if ((pTempRegion.uiFlags & MSYS_REGION_ENABLED) && (pTempRegion.RegionTopLeftX <= MSYS_CurrentMX) && (pTempRegion.RegionTopLeftY <= MSYS_CurrentMY) && (pTempRegion.RegionBottomRightX >= MSYS_CurrentMX) && (pTempRegion.RegionBottomRightY >= MSYS_CurrentMY) && (pTempRegion.uiFlags & MSYS_SET_CURSOR)) {
            fFound = true;
            if (pTempRegion.Cursor != MSYS_NO_CURSOR) {
              MSYS_SetCurrentCursor(pTempRegion.Cursor);
            }
          }
          pTempRegion = pTempRegion.next;
        }
      }
    }

    // OK, if we do not have a button down, any button is game!
    if (!gfClickedModeOn || (gfClickedModeOn && gusClickedIDNumber == MSYS_CurrRegion.IDNumber)) {
      MSYS_CurrRegion.uiFlags |= MSYS_MOUSE_IN_AREA;

      MSYS_CurrRegion.MouseXPos = MSYS_CurrentMX;
      MSYS_CurrRegion.MouseYPos = MSYS_CurrentMY;
      MSYS_CurrRegion.RelativeXPos = MSYS_CurrentMX - MSYS_CurrRegion.RegionTopLeftX;
      MSYS_CurrRegion.RelativeYPos = MSYS_CurrentMY - MSYS_CurrRegion.RegionTopLeftY;

      MSYS_CurrRegion.ButtonState = MSYS_CurrentButtons;

      if (MSYS_CurrRegion.uiFlags & MSYS_REGION_ENABLED && MSYS_CurrRegion.uiFlags & MSYS_MOVE_CALLBACK && MSYS_Action & MSYS_DO_MOVE) {
        (<MOUSE_CALLBACK>MSYS_CurrRegion.MovementCallback)(MSYS_CurrRegion, MSYS_CALLBACK_REASON_MOVE);
      }

      // ExecuteMouseHelpEndCallBack( MSYS_CurrRegion );
      // MSYS_CurrRegion->FastHelpTimer = gsFastHelpDelay;

      MSYS_Action &= (~MSYS_DO_MOVE);

      if ((MSYS_CurrRegion.uiFlags & MSYS_BUTTON_CALLBACK) && (MSYS_Action & MSYS_DO_BUTTONS)) {
        if (MSYS_CurrRegion.uiFlags & MSYS_REGION_ENABLED) {
          ButtonReason = MSYS_CALLBACK_REASON_NONE;
          if (MSYS_Action & MSYS_DO_LBUTTON_DWN) {
            ButtonReason |= MSYS_CALLBACK_REASON_LBUTTON_DWN;
            gfClickedModeOn = true;
            // Set global ID
            gusClickedIDNumber = MSYS_CurrRegion.IDNumber;
          }

          if (MSYS_Action & MSYS_DO_LBUTTON_UP) {
            ButtonReason |= MSYS_CALLBACK_REASON_LBUTTON_UP;
            gfClickedModeOn = false;
          }

          if (MSYS_Action & MSYS_DO_RBUTTON_DWN) {
            ButtonReason |= MSYS_CALLBACK_REASON_RBUTTON_DWN;
            gfClickedModeOn = true;
            // Set global ID
            gusClickedIDNumber = MSYS_CurrRegion.IDNumber;
          }

          if (MSYS_Action & MSYS_DO_RBUTTON_UP) {
            ButtonReason |= MSYS_CALLBACK_REASON_RBUTTON_UP;
            gfClickedModeOn = false;
          }

          // ATE: Added repeat resons....
          if (MSYS_Action & MSYS_DO_LBUTTON_REPEAT) {
            ButtonReason |= MSYS_CALLBACK_REASON_LBUTTON_REPEAT;
          }

          if (MSYS_Action & MSYS_DO_RBUTTON_REPEAT) {
            ButtonReason |= MSYS_CALLBACK_REASON_RBUTTON_REPEAT;
          }

          if (ButtonReason != MSYS_CALLBACK_REASON_NONE) {
            if (MSYS_CurrRegion.uiFlags & MSYS_FASTHELP) {
              // Button was clicked so remove any FastHelp text
              MSYS_CurrRegion.uiFlags &= (~MSYS_FASTHELP);
              if (MSYS_CurrRegion.uiFlags & MSYS_GOT_BACKGROUND)
                FreeBackgroundRectPending(MSYS_CurrRegion.FastHelpRect);
              MSYS_CurrRegion.uiFlags &= (~MSYS_GOT_BACKGROUND);

              // ExecuteMouseHelpEndCallBack( MSYS_CurrRegion );
              MSYS_CurrRegion.FastHelpTimer = gsFastHelpDelay;
              MSYS_CurrRegion.uiFlags &= (~MSYS_FASTHELP_RESET);

              // if( b->uiFlags & BUTTON_ENABLED )
              //	b->uiFlags |= BUTTON_DIRTY;
            }

            // Kris: Nov 31, 1999 -- Added support for double click events.
            // This is where double clicks are checked and passed down.
            if (ButtonReason == MSYS_CALLBACK_REASON_LBUTTON_DWN) {
              let uiCurrTime: UINT32 = GetClock();
              if (gpRegionLastLButtonDown == MSYS_CurrRegion && gpRegionLastLButtonUp == MSYS_CurrRegion && uiCurrTime <= guiRegionLastLButtonDownTime + MSYS_DOUBLECLICK_DELAY) {
                // Sequential left click on same button within the maximum time allowed for a double click
                // Double click check succeeded, set flag and reset double click globals.
                ButtonReason |= MSYS_CALLBACK_REASON_LBUTTON_DOUBLECLICK;
                gpRegionLastLButtonDown = null;
                gpRegionLastLButtonUp = null;
                guiRegionLastLButtonDownTime = 0;
              } else {
                // First click, record time and region pointer (to check if 2nd click detected later)
                gpRegionLastLButtonDown = MSYS_CurrRegion;
                guiRegionLastLButtonDownTime = GetClock();
              }
            } else if (ButtonReason == MSYS_CALLBACK_REASON_LBUTTON_UP) {
              let uiCurrTime: UINT32 = GetClock();
              if (gpRegionLastLButtonDown == MSYS_CurrRegion && uiCurrTime <= guiRegionLastLButtonDownTime + MSYS_DOUBLECLICK_DELAY) {
                // Double click is Left down, then left up, then left down.  We have just detected the left up here (step 2).
                gpRegionLastLButtonUp = MSYS_CurrRegion;
              } else {
                // User released mouse outside of current button, so kill any chance of a double click happening.
                gpRegionLastLButtonDown = null;
                gpRegionLastLButtonUp = null;
                guiRegionLastLButtonDownTime = 0;
              }
            }

            (<MOUSE_CALLBACK>MSYS_CurrRegion.ButtonCallback)(MSYS_CurrRegion, ButtonReason);
          }
        }
      }

      MSYS_Action &= (~MSYS_DO_BUTTONS);
    } else if (MSYS_CurrRegion.uiFlags & MSYS_REGION_ENABLED) {
      // OK here, if we have release a button, UNSET LOCK wherever you are....
      // Just don't give this button the message....
      if (MSYS_Action & MSYS_DO_RBUTTON_UP) {
        gfClickedModeOn = false;
      }
      if (MSYS_Action & MSYS_DO_LBUTTON_UP) {
        gfClickedModeOn = false;
      }

      // OK, you still want move messages however....
      MSYS_CurrRegion.uiFlags |= MSYS_MOUSE_IN_AREA;
      MSYS_CurrRegion.MouseXPos = MSYS_CurrentMX;
      MSYS_CurrRegion.MouseYPos = MSYS_CurrentMY;
      MSYS_CurrRegion.RelativeXPos = MSYS_CurrentMX - MSYS_CurrRegion.RegionTopLeftX;
      MSYS_CurrRegion.RelativeYPos = MSYS_CurrentMY - MSYS_CurrRegion.RegionTopLeftY;

      if ((MSYS_CurrRegion.uiFlags & MSYS_MOVE_CALLBACK) && (MSYS_Action & MSYS_DO_MOVE)) {
        (<MOUSE_CALLBACK>MSYS_CurrRegion.MovementCallback)(MSYS_CurrRegion, MSYS_CALLBACK_REASON_MOVE);
      }

      MSYS_Action &= (~MSYS_DO_MOVE);
    }
    MSYS_PrevRegion = MSYS_CurrRegion;
  } else
    MSYS_PrevRegion = null;
}

//=================================================================================================
//	MSYS_DefineRegion
//
//	Inits a MOUSE_REGION structure for use with the mouse system
//
export function MSYS_DefineRegion(region: MOUSE_REGION, tlx: UINT16, tly: UINT16, brx: UINT16, bry: UINT16, priority: INT8, crsr: UINT16, movecallback: MOUSE_CALLBACK | null, buttoncallback: MOUSE_CALLBACK | null): void {
  region.IDNumber = MSYS_ID_BASE;

  if (priority == MSYS_PRIORITY_AUTO)
    priority = MSYS_PRIORITY_BASE;
  else if (priority <= MSYS_PRIORITY_LOWEST)
    priority = MSYS_PRIORITY_LOWEST;
  else if (priority >= MSYS_PRIORITY_HIGHEST)
    priority = MSYS_PRIORITY_HIGHEST;

  region.PriorityLevel = priority;

  region.uiFlags = MSYS_NO_FLAGS;

  region.MovementCallback = movecallback;
  if (movecallback != MSYS_NO_CALLBACK)
    region.uiFlags |= MSYS_MOVE_CALLBACK;

  region.ButtonCallback = buttoncallback;
  if (buttoncallback != MSYS_NO_CALLBACK)
    region.uiFlags |= MSYS_BUTTON_CALLBACK;

  region.Cursor = crsr;
  if (crsr != MSYS_NO_CURSOR)
    region.uiFlags |= MSYS_SET_CURSOR;

  region.RegionTopLeftX = tlx;
  region.RegionTopLeftY = tly;
  region.RegionBottomRightX = brx;
  region.RegionBottomRightY = bry;

  region.MouseXPos = 0;
  region.MouseYPos = 0;
  region.RelativeXPos = 0;
  region.RelativeYPos = 0;
  region.ButtonState = 0;

  // Init fasthelp
  region.FastHelpText = "";
  region.FastHelpTimer = 0;

  region.next = null;
  region.prev = null;
  region.HelpDoneCallback = null;

  // Add region to system list
  MSYS_AddRegionToList(region);
  region.uiFlags |= MSYS_REGION_ENABLED | MSYS_REGION_EXISTS;

  // Dirty our update flag
  gfRefreshUpdate = true;
}

//=================================================================================================
//	MSYS_ChangeRegionCursor
//
export function MSYS_ChangeRegionCursor(region: MOUSE_REGION, crsr: UINT16): void {
  region.uiFlags &= (~MSYS_SET_CURSOR);
  region.Cursor = crsr;
  if (crsr != MSYS_NO_CURSOR) {
    region.uiFlags |= MSYS_SET_CURSOR;

    // If we are not in the region, donot update!
    if (!(region.uiFlags & MSYS_MOUSE_IN_AREA)) {
      return;
    }

    // Update cursor
    MSYS_SetCurrentCursor(crsr);
  }
}

//=================================================================================================
//	MSYS_AddRegion
//
//	Adds a defined mouse region to the system list. Once inserted, it enables the region then
//	calls the callback functions, if any, for initialization.
//
export function MSYS_AddRegion(region: MOUSE_REGION): INT32 {
  return 1;
}

//=================================================================================================
//	MSYS_RemoveRegion
//
//	Removes a region from the list, disables it, then calls the callback functions for
//	de-initialization.
//
export function MSYS_RemoveRegion(region: MOUSE_REGION | null): void {
  if (!region) {
      return;
    AssertMsg(0, "Attempting to remove a NULL region.");
  }

  if (region.uiFlags & MSYS_HAS_BACKRECT) {
    FreeBackgroundRectPending(region.FastHelpRect);
    region.uiFlags &= (~MSYS_HAS_BACKRECT);
  }

  // Get rid of the FastHelp text (if applicable)
  region.FastHelpText = "";

  MSYS_DeleteRegionFromList(region);

  // if the previous region is the one that we are deleting, reset the previous region
  if (MSYS_PrevRegion == region)
    MSYS_PrevRegion = null;
  // if the current region is the one that we are deleting, then clear it.
  if (MSYS_CurrRegion == region)
    MSYS_CurrRegion = null;

  // dirty our update flag
  gfRefreshUpdate = true;

  // Check if this is a locked region, and unlock if so
  if (gfClickedModeOn) {
    // Set global ID
    if (gusClickedIDNumber == region.IDNumber) {
      gfClickedModeOn = false;
    }
  }

  // clear all internal values (including the region exists flag)
  resetMouseRegion(region);
}

//=================================================================================================
//	MSYS_EnableRegion
//
//	Enables a mouse region.
//
export function MSYS_EnableRegion(region: MOUSE_REGION): void {
  region.uiFlags |= MSYS_REGION_ENABLED;
}

//=================================================================================================
//	MSYS_DisableRegion
//
//	Disables a mouse region without removing it from the system list.
//
export function MSYS_DisableRegion(region: MOUSE_REGION): void {
  region.uiFlags &= (~MSYS_REGION_ENABLED);
}

//=================================================================================================
//	MSYS_SetCurrentCursor
//
//	Sets the mouse cursor to the regions defined value.
//
export function MSYS_SetCurrentCursor(Cursor: UINT16): void {
  SetCurrentCursorFromDatabase(Cursor);
}

//=================================================================================================
//	MSYS_ChangeRegionPriority
//
//	Set the priority of a mouse region
//
function MSYS_ChangeRegionPriority(region: MOUSE_REGION, priority: INT8): void {
  if (priority == MSYS_PRIORITY_AUTO)
    priority = MSYS_PRIORITY_NORMAL;

  region.PriorityLevel = priority;
}

//=================================================================================================
//	MSYS_SetRegionUserData
//
//	Sets one of the four user data entries in a mouse region
//
export function MSYS_SetRegionUserData(region: MOUSE_REGION, index: INT32, userdata: INT32): void {
  if (index < 0 || index > 3) {
    let str: string /* UINT8[80] */;
      return;
    str = sprintf("Attempting MSYS_SetRegionUserData() with out of range index %d.", index);
    AssertMsg(0, str);
  }
  region.UserData[index] = userdata;
}

//=================================================================================================
//	MSYS_GetRegionUserData
//
//	Retrieves one of the four user data entries in a mouse region
//
export function MSYS_GetRegionUserData(region: MOUSE_REGION, index: INT32): INT32 {
  if (index < 0 || index > 3) {
    let str: string /* UINT8[80] */;
      return 0;
    str = sprintf("Attempting MSYS_GetRegionUserData() with out of range index %d", index);
    AssertMsg(0, str);
  }
  return region.UserData[index];
}

//=================================================================================================
//	MSYS_GrabMouse
//
//	Assigns all mouse activity to a region, effectively blocking any other region from having
//	control.
//
function MSYS_GrabMouse(region: MOUSE_REGION): INT32 {
  if (!MSYS_RegionInList(region))
    return MSYS_REGION_NOT_IN_LIST;

  if (MSYS_Mouse_Grabbed == true)
    return MSYS_ALREADY_GRABBED;

  MSYS_Mouse_Grabbed = true;
  MSYS_GrabRegion = region;
  return MSYS_GRABBED_OK;
}

//=================================================================================================
//	MSYS_ReleaseMouse
//
//	Releases a previously grabbed mouse region
//
function MSYS_ReleaseMouse(region: MOUSE_REGION): void {
  if (MSYS_GrabRegion != region)
    return;

  if (MSYS_Mouse_Grabbed == true) {
    MSYS_Mouse_Grabbed = false;
    MSYS_GrabRegion = null;
    MSYS_UpdateMouseRegion();
  }
}

/* ==================================================================================
   MSYS_MoveMouseRegionTo( MOUSE_REGION *region, INT16 sX, INT16 sY)

         Moves a Mouse region to X Y on the screen

*/

export function MSYS_MoveMouseRegionTo(region: MOUSE_REGION, sX: INT16, sY: INT16): void {
  let sWidth: INT16;
  let sHeight: INT16;

  sWidth = region.RegionBottomRightX - region.RegionTopLeftX;
  sHeight = region.RegionBottomRightY - region.RegionTopLeftY;

  // move top left
  region.RegionTopLeftX = sX;
  region.RegionTopLeftY = sY;

  // now move bottom right based on topleft + width or height
  region.RegionBottomRightX = sX + sWidth;
  region.RegionBottomRightY = sY + sHeight;

  return;
}

/* ==================================================================================
   MSYS_MoveMouseRegionBy( MOUSE_REGION *region, INT16 sDeltaX, INT16 sDeltaY)

         Moves a Mouse region by sDeltaX sDeltaY on the screen

*/

function MSYS_MoveMouseRegionBy(region: MOUSE_REGION, sDeltaX: INT16, sDeltaY: INT16): void {
  // move top left
  region.RegionTopLeftX = region.RegionTopLeftX + sDeltaX;
  region.RegionTopLeftY = region.RegionTopLeftY + sDeltaY;

  // now move bottom right
  region.RegionBottomRightX = region.RegionBottomRightX + sDeltaX;
  region.RegionBottomRightY = region.RegionBottomRightY + sDeltaY;

  return;
}

// This function will force a re-evaluation of mouse regions
// Usually used to force change of mouse cursor if panels switch, etc
export function RefreshMouseRegions(): void {
  MSYS_Action |= MSYS_DO_MOVE;

  MSYS_UpdateMouseRegion();
}

export function SetRegionFastHelpText(region: MOUSE_REGION, szText: string /* Pointer<UINT16> */): void {
  Assert(region);

  region.FastHelpText = "";
  //	region->FastHelpTimer = 0;
  if (!(region.uiFlags & MSYS_REGION_EXISTS)) {
    return;
    // AssertMsg( 0, String( "Attempting to set fast help text, \"%S\" to an inactive region.", szText ) );
  }

  if (!szText || !szText.length)
    return; // blank (or clear)

  region.FastHelpText = szText;

  // ATE: We could be replacing already existing, active text
  // so let's remove the region so it be rebuilt...

  if (guiCurrentScreen != Enum26.MAP_SCREEN) {
    if (region.uiFlags & MSYS_GOT_BACKGROUND)
      FreeBackgroundRectPending(region.FastHelpRect);

    region.uiFlags &= (~MSYS_GOT_BACKGROUND);
    region.uiFlags &= (~MSYS_FASTHELP_RESET);
  }

  // region->FastHelpTimer = gsFastHelpDelay;
}

function GetNumberOfLinesInHeight(pStringA: string /* STR16 */): INT16 {
  let sCounter: INT16 = 0;
  let pString: string /* CHAR16[512] */;

  pString = pStringA;

  if (pString.charCodeAt(pString.length - 1) !== 13) {
    pString += '\n';
  }

  // tokenize
  let start = 0;
  let pos = pString.indexOf("\n");

  while (pos !== -1) {
    start = pos + 1;
    pos = pString.indexOf("\n", start);
    sCounter++;
  }

  return sCounter;
}

//=============================================================================
//	DisplayFastHelp
//
//
function DisplayFastHelp(region: MOUSE_REGION): void {
  let usFillColor: UINT16;
  let iX: INT32;
  let iY: INT32;
  let iW: INT32;
  let iH: INT32;
  let iNumberOfLines: INT32 = 1;

  if (region.uiFlags & MSYS_FASTHELP) {
    usFillColor = Get16BPPColor(FROMRGB(250, 240, 188));

    iW = GetWidthOfString(region.FastHelpText) + 10;
    iH = (GetNumberOfLinesInHeight(region.FastHelpText) * (GetFontHeight(FONT10ARIAL()) + 1) + 8);

    iX = region.RegionTopLeftX + 10;

    if (iX < 0)
      iX = 0;

    if ((iX + iW) >= SCREEN_WIDTH)
      iX = (SCREEN_WIDTH - iW - 4);

    iY = region.RegionTopLeftY - Math.trunc(iH * 3 / 4);
    if (iY < 0)
      iY = 0;

    if ((iY + iH) >= SCREEN_HEIGHT)
      iY = (SCREEN_HEIGHT - iH - 15);

    if (!(region.uiFlags & MSYS_GOT_BACKGROUND)) {
      region.FastHelpRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT | BGND_FLAG_SAVERECT, null, iX, iY, (iX + iW), (iY + iH));
      region.uiFlags |= MSYS_GOT_BACKGROUND;
      region.uiFlags |= MSYS_HAS_BACKRECT;
    } else {
      let pDestBuf: Uint8ClampedArray;
      let uiDestPitchBYTES: UINT32 = 0;
      pDestBuf = LockVideoSurface(FRAME_BUFFER, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));
      SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);
      RectangleDraw(true, iX + 1, iY + 1, iX + iW - 1, iY + iH - 1, Get16BPPColor(FROMRGB(65, 57, 15)), pDestBuf);
      RectangleDraw(true, iX, iY, iX + iW - 2, iY + iH - 2, Get16BPPColor(FROMRGB(227, 198, 88)), pDestBuf);
      UnLockVideoSurface(FRAME_BUFFER);
      ShadowVideoSurfaceRect(FRAME_BUFFER, iX + 2, iY + 2, iX + iW - 3, iY + iH - 3);
      ShadowVideoSurfaceRect(FRAME_BUFFER, iX + 2, iY + 2, iX + iW - 3, iY + iH - 3);

      SetFont(FONT10ARIAL());
      SetFontShadow(FONT_NEARBLACK);
      DisplayHelpTokenizedString(region.FastHelpText, (iX + 5), (iY + 5));
      InvalidateRegion(iX, iY, (iX + iW), (iY + iH));
    }
  }
}

function GetWidthOfString(pStringA: string /* STR16 */): INT16 {
  let pString: string /* CHAR16[512] */;
  let pToken: string /* STR16 */;
  let sWidth: INT16 = 0;
  pString = pStringA;

  if (pString.charCodeAt(pString.length - 1) !== 13) {
    pString += '\n';
  }

  // tokenize
  let start = 0;
  let pos = pString.indexOf("\n");

  while (pos !== -1) {
    pToken = pString.substring(start, pos);
    if (sWidth < StringPixLength(pToken, FONT10ARIAL())) {
      sWidth = StringPixLength(pToken, FONT10ARIAL());
    }

    start = pos + 1;
    pos = pString.indexOf("\n", start);
  }

  return sWidth;
}

function DisplayHelpTokenizedString(pStringA: string /* STR16 */, sX: INT16, sY: INT16): void {
  let pToken: string /* STR16 */;
  let iCounter: INT32 = 0;
  let i: INT32;
  let uiCursorXPos: UINT32;
  let pString: string /* CHAR16[512] */;
  let iLength: INT32;

  pString = pStringA;

  if (pString.charCodeAt(pString.length - 1) !== 13) {
    pString += '\n';
  }

  // tokenize
  let start = 0;
  let pos = pString.indexOf("\n");

  while (pos !== -1) {
    pToken = pString.substring(start, pos);
    iLength = pToken.length;
    for (i = 0; i < iLength; i++) {
      uiCursorXPos = StringPixLengthArgFastHelp(FONT10ARIAL(), FONT10ARIALBOLD(), i, pToken);
      if (pToken[i] == '|') {
        i++;
        SetFont(FONT10ARIALBOLD());
        SetFontForeground(146);
      } else {
        SetFont(FONT10ARIAL());
        SetFontForeground(FONT_BEIGE);
      }
      mprintf(sX + uiCursorXPos, sY + iCounter * (GetFontHeight(FONT10ARIAL()) + 1), "%s", pToken[i]);
    }
    start = pos + 1;
    pos = pString.indexOf("\n", start);
    iCounter++;
  }
}

/* static */ let RenderFastHelp_iLastClock: INT32 = 0;
export function RenderFastHelp(): void {
  let iTimeDifferential: INT32;
  let iCurrentClock: INT32;

  if (!gfRenderHilights)
    return;

  iCurrentClock = GetClock();
  iTimeDifferential = iCurrentClock - RenderFastHelp_iLastClock;
  if (iTimeDifferential < 0)
    iTimeDifferential += 0x7fffffff;
  RenderFastHelp_iLastClock = iCurrentClock;

  if (MSYS_CurrRegion && MSYS_CurrRegion.FastHelpText) {
    if (!MSYS_CurrRegion.FastHelpTimer) {
      if (MSYS_CurrRegion.uiFlags & (MSYS_ALLOW_DISABLED_FASTHELP | MSYS_REGION_ENABLED)) {
        if (MSYS_CurrRegion.uiFlags & MSYS_MOUSE_IN_AREA)
          MSYS_CurrRegion.uiFlags |= MSYS_FASTHELP;
        else {
          MSYS_CurrRegion.uiFlags &= (~(MSYS_FASTHELP | MSYS_FASTHELP_RESET));
        }
        // Do I really need this?
        // MSYS_CurrRegion->uiFlags |= REGION_DIRTY;
        DisplayFastHelp(MSYS_CurrRegion);
      }
    } else {
      if (MSYS_CurrRegion.uiFlags & (MSYS_ALLOW_DISABLED_FASTHELP | MSYS_REGION_ENABLED)) {
        if (MSYS_CurrRegion.uiFlags & MSYS_MOUSE_IN_AREA && !MSYS_CurrRegion.ButtonState) // & (MSYS_LEFT_BUTTON|MSYS_RIGHT_BUTTON)) )
        {
          MSYS_CurrRegion.FastHelpTimer -= Math.max(iTimeDifferential, 0);

          if (MSYS_CurrRegion.FastHelpTimer < 0) {
            MSYS_CurrRegion.FastHelpTimer = 0;
          }
        }
      }
    }
  }
}

function SetRegionSavedRect(region: MOUSE_REGION): boolean {
  return false;
}

function FreeRegionSavedRect(region: MOUSE_REGION): void {
}

export function MSYS_AllowDisabledRegionFastHelp(region: MOUSE_REGION, fAllow: boolean): void {
  if (fAllow) {
    region.uiFlags |= MSYS_ALLOW_DISABLED_FASTHELP;
  } else {
    region.uiFlags &= ~MSYS_ALLOW_DISABLED_FASTHELP;
  }
}

// new stuff to allow mouse callbacks when help text finishes displaying

export function SetRegionHelpEndCallback(region: MOUSE_REGION, CallbackFxn: MOUSE_HELPTEXT_DONE_CALLBACK): void {
  // make sure region is non null
  if (region == null) {
    return;
  }

  // now set the region help text
  region.HelpDoneCallback = CallbackFxn;

  return;
}

function ExecuteMouseHelpEndCallBack(region: MOUSE_REGION): void {
  if (region == null) {
    return;
  }

  if (region.FastHelpTimer) {
    return;
  }
  // check if callback is non null
  if (region.HelpDoneCallback == null) {
    return;
  }

  // we have a callback, excecute
  // ATE: Disable these!
  //( *( region->HelpDoneCallback ) )( );

  return;
}

function SetFastHelpDelay(sFastHelpDelay: INT16): void {
  gsFastHelpDelay = sFastHelpDelay;
}

function EnableMouseFastHelp(): void {
  gfShowFastHelp = true;
}

function DisableMouseFastHelp(): void {
  gfShowFastHelp = false;
}

function ResetClickedMode(): void {
  gfClickedModeOn = false;
}

}
