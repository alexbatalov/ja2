let szClipboard: Pointer<UINT16>;
let gfNoScroll: BOOLEAN = FALSE;

interface TextInputColors {
  // internal values that contain all of the colors for the text editing fields.
  usFont: UINT16;
  usTextFieldColor: UINT16;

  ubForeColor: UINT8;
  ubShadowColor: UINT8;

  ubHiForeColor: UINT8;
  ubHiShadowColor: UINT8;
  ubHiBackColor: UINT8;

  // optional -- no bevelling by default
  fBevelling: BOOLEAN;

  usBrighterColor: UINT16;
  usDarkerColor: UINT16;

  // optional -- cursor color defaults to black
  usCursorColor: UINT16;
  // optional colors for disabled fields (defaults to 25% darker shading)
  fUseDisabledAutoShade: BOOLEAN;
  ubDisabledForeColor: UINT8;
  ubDisabledShadowColor: UINT8;
  usDisabledTextFieldColor: UINT16;
}

let pColors: Pointer<TextInputColors> = NULL;

// Internal nodes for keeping track of the text and user defined fields.
interface TEXTINPUTNODE {
  ubID: UINT8;
  usInputType: UINT16;
  ubMaxChars: UINT8;
  szString: Pointer<UINT16>;
  ubStrLen: UINT8;
  fEnabled: BOOLEAN;
  fUserField: BOOLEAN;
  region: MOUSE_REGION;
  InputCallback: INPUT_CALLBACK;

  next: Pointer<TEXTINPUTNODE>;
  prev: Pointer<TEXTINPUTNODE>;
}

// Stack list containing the head nodes of each level.  Only the top level is the active level.
interface STACKTEXTINPUTNODE {
  head: Pointer<TEXTINPUTNODE>;
  pColors: Pointer<TextInputColors>;
  next: Pointer<STACKTEXTINPUTNODE>;
}

let pInputStack: Pointer<STACKTEXTINPUTNODE> = NULL;

// Internal list vars.  active always points to the currently edited field.
let gpTextInputHead: Pointer<TEXTINPUTNODE> = NULL;
let gpTextInputTail: Pointer<TEXTINPUTNODE> = NULL;
let gpActive: Pointer<TEXTINPUTNODE> = NULL;

// Saving current mode
let pSavedHead: Pointer<TEXTINPUTNODE> = NULL;
let pSavedColors: Pointer<TextInputColors> = NULL;
let gusTextInputCursor: UINT16 = Enum317.CURSOR_IBEAM;

// Saves the current text input mode by pushing it onto our stack, then starts a new
// one.
function PushTextInputLevel(): void {
  let pNewLevel: Pointer<STACKTEXTINPUTNODE>;
  pNewLevel = MemAlloc(sizeof(STACKTEXTINPUTNODE));
  Assert(pNewLevel);
  pNewLevel.value.head = gpTextInputHead;
  pNewLevel.value.pColors = pColors;
  pNewLevel.value.next = pInputStack;
  pInputStack = pNewLevel;
  DisableAllTextFields();
}

// After the currently text input mode is removed, we then restore the previous one
// automatically.  Assert failure in this function will expose cases where you are trigger
// happy with killing non-existant text input modes.
function PopTextInputLevel(): void {
  let pLevel: Pointer<STACKTEXTINPUTNODE>;
  gpTextInputHead = pInputStack.value.head;
  pColors = pInputStack.value.pColors;
  pLevel = pInputStack;
  pInputStack = pInputStack.value.next;
  MemFree(pLevel);
  pLevel = NULL;
  EnableAllTextFields();
}

// flags for determining various editing modes.
let gfEditingText: BOOLEAN = FALSE;
let gfTextInputMode: BOOLEAN = FALSE;
let gfHiliteMode: BOOLEAN = FALSE;

// values that contain the hiliting positions and the cursor position.
let gubCursorPos: UINT8 = 0;
let gubStartHilite: UINT8 = 0;
let gubEndHilite: UINT8 = 0;

// allow the user to cut, copy, and paste just like windows.
let gszClipboardString: UINT16[] /* [256] */;

// Simply initiates that you wish to begin inputting text.  This should only apply to screen
// initializations that contain fields that edit text.  It also verifies and clears any existing
// fields.  Your input loop must contain the function HandleTextInput and processed if the gfTextInputMode
// flag is set else process your regular input handler.  Note that this doesn't mean you are necessarily typing,
// just that there are text fields in your screen and may be inactive.  The TAB key cycles through your text fields,
// and special fields can be defined which will call a void functionName( UINT16 usFieldNum )
function InitTextInputMode(): void {
  if (gpTextInputHead) {
    // Instead of killing all of the currently existing text input fields, they will now (Jan16 '97)
    // be pushed onto a stack, and preserved until we are finished with the new mode when they will
    // automatically be re-instated when the new text input mode is killed.
    PushTextInputLevel();
    // KillTextInputMode();
  }
  gpTextInputHead = NULL;
  pColors = MemAlloc(sizeof(TextInputColors));
  Assert(pColors);
  gfTextInputMode = TRUE;
  gfEditingText = FALSE;
  pColors.value.fBevelling = FALSE;
  pColors.value.fUseDisabledAutoShade = TRUE;
  pColors.value.usCursorColor = 0;
}

// A hybrid version of InitTextInput() which uses a specific scheme.  JA2's editor uses scheme 1, so
// feel free to add new schemes.
function InitTextInputModeWithScheme(ubSchemeID: UINT8): void {
  InitTextInputMode();
  switch (ubSchemeID) {
    case Enum384.DEFAULT_SCHEME: // yellow boxes with black text, with bluish bevelling
      SetTextInputFont(FONT12POINT1());
      Set16BPPTextFieldColor(Get16BPPColor(FROMRGB(250, 240, 188)));
      SetBevelColors(Get16BPPColor(FROMRGB(136, 138, 135)), Get16BPPColor(FROMRGB(24, 61, 81)));
      SetTextInputRegularColors(FONT_BLACK, FONT_BLACK);
      SetTextInputHilitedColors(FONT_GRAY2, FONT_GRAY2, FONT_METALGRAY);
      break;
  }
}

// Clears any existing fields, and ends text input mode.
function KillTextInputMode(): void {
  let curr: Pointer<TEXTINPUTNODE>;
  if (!gpTextInputHead)
    //		AssertMsg( 0, "Called KillTextInputMode() without any text input mode defined.");
    return;
  curr = gpTextInputHead;
  while (curr) {
    gpTextInputHead = gpTextInputHead.value.next;
    if (curr.value.szString) {
      MemFree(curr.value.szString);
      curr.value.szString = NULL;
      MSYS_RemoveRegion(addressof(curr.value.region));
    }
    MemFree(curr);
    curr = gpTextInputHead;
  }
  MemFree(pColors);
  pColors = NULL;
  gpTextInputHead = NULL;
  if (pInputStack) {
    PopTextInputLevel();
    SetActiveField(0);
  } else {
    gfTextInputMode = FALSE;
    gfEditingText = FALSE;
  }

  if (!gpTextInputHead)
    gpActive = NULL;
}

// Kills all levels of text input modes.  When you init a second consecutive text input mode, without
// first removing them, the existing mode will be preserved.  This function removes all of them in one
// call, though doing so "may" reflect poor coding style, though I haven't thought about any really
// just uses for it :(
function KillAllTextInputModes(): void {
  while (gpTextInputHead)
    KillTextInputMode();
}

// After calling InitTextInputMode, you want to define one or more text input fields.  The order
// of calls to this function dictate the TAB order from traversing from one field to the next.  This
// function adds mouse regions and processes them for you, as well as deleting them when you are done.
function AddTextInputField(sLeft: INT16, sTop: INT16, sWidth: INT16, sHeight: INT16, bPriority: INT8, szInitText: Pointer<UINT16>, ubMaxChars: UINT8, usInputType: UINT16): void {
  let pNode: Pointer<TEXTINPUTNODE>;
  pNode = MemAlloc(sizeof(TEXTINPUTNODE));
  Assert(pNode);
  memset(pNode, 0, sizeof(TEXTINPUTNODE));
  pNode.value.next = NULL;
  if (!gpTextInputHead) // first entry, so we start with text input.
  {
    gfEditingText = TRUE;
    gpTextInputHead = gpTextInputTail = pNode;
    pNode.value.prev = NULL;
    pNode.value.ubID = 0;
    gpActive = pNode;
  } else // add to the end of the list.
  {
    gpTextInputTail.value.next = pNode;
    pNode.value.prev = gpTextInputTail;
    pNode.value.ubID = (gpTextInputTail.value.ubID + 1);
    gpTextInputTail = gpTextInputTail.value.next;
  }
  // Setup the information for the node
  pNode.value.usInputType = usInputType; // setup the filter type
  // All 24hourclock inputtypes have 6 characters.  01:23 (null terminated)
  if (usInputType == Enum383.INPUTTYPE_EXCLUSIVE_24HOURCLOCK)
    ubMaxChars = 6;
  // Allocate and copy the string.
  pNode.value.szString = MemAlloc((ubMaxChars + 1) * sizeof(UINT16));
  Assert(pNode.value.szString);
  if (szInitText) {
    pNode.value.ubStrLen = wcslen(szInitText);
    Assert(pNode.value.ubStrLen <= ubMaxChars);
    swprintf(pNode.value.szString, szInitText);
  } else {
    pNode.value.ubStrLen = 0;
    swprintf(pNode.value.szString, "");
  }
  pNode.value.ubMaxChars = ubMaxChars; // max string length

  // if this is the first field, then hilight it.
  if (gpTextInputHead == pNode) {
    gubStartHilite = 0;
    gubEndHilite = pNode.value.ubStrLen;
    gubCursorPos = pNode.value.ubStrLen;
    gfHiliteMode = TRUE;
  }
  pNode.value.fUserField = FALSE;
  pNode.value.fEnabled = TRUE;
  // Setup the region.
  MSYS_DefineRegion(addressof(pNode.value.region), sLeft, sTop, (sLeft + sWidth), (sTop + sHeight), bPriority, gusTextInputCursor, MouseMovedInTextRegionCallback, MouseClickedInTextRegionCallback);
  MSYS_SetRegionUserData(addressof(pNode.value.region), 0, pNode.value.ubID);
}

// This allows you to insert special processing functions and modes that can't be determined here.  An example
// would be a file dialog where there would be a file list.  This file list would be accessed using the Win95
// convention by pressing TAB.  In there, your key presses would be handled differently and by adding a userinput
// field, you can make this hook into your function to accomplish this.  In a filedialog, alpha characters
// would be used to jump to the file starting with that letter, and setting the field in the text input
// field.  Pressing TAB again would place you back in the text input field.  All of that stuff would be handled
// externally, except for the TAB keys.
function AddUserInputField(userFunction: INPUT_CALLBACK): void {
  let pNode: Pointer<TEXTINPUTNODE>;
  pNode = MemAlloc(sizeof(TEXTINPUTNODE));
  Assert(pNode);
  pNode.value.next = NULL;
  if (!gpTextInputHead) // first entry, so we don't start with text input.
  {
    gfEditingText = FALSE;
    gpTextInputHead = gpTextInputTail = pNode;
    pNode.value.prev = NULL;
    pNode.value.ubID = 0;
    gpActive = pNode;
  } else // add to the end of the list.
  {
    gpTextInputTail.value.next = pNode;
    pNode.value.prev = gpTextInputTail;
    pNode.value.ubID = (gpTextInputTail.value.ubID + 1);
    gpTextInputTail = gpTextInputTail.value.next;
  }
  // Setup the information for the node
  pNode.value.fUserField = TRUE;
  pNode.value.szString = NULL;
  pNode.value.fEnabled = TRUE;
  // Setup the callback
  pNode.value.InputCallback = userFunction;
}

// Removes the specified field from the existing fields.  If it doesn't exist, then there will be an
// assertion failure.
function RemoveTextInputField(ubField: UINT8): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubField) {
      if (curr == gpActive)
        SelectNextField();
      if (curr == gpTextInputHead)
        gpTextInputHead = gpTextInputHead.value.next;
      // Detach the node.
      if (curr.value.next)
        curr.value.next.value.prev = curr.value.prev;
      if (curr.value.prev)
        curr.value.prev.value.next = curr.value.next;
      if (curr.value.szString) {
        MemFree(curr.value.szString);
        curr.value.szString = NULL;
        MSYS_RemoveRegion(addressof(curr.value.region));
      }
      MemFree(curr);
      curr = NULL;
      if (!gpTextInputHead) {
        gfTextInputMode = FALSE;
        gfEditingText = FALSE;
      }
      return;
    }
    curr = curr.value.next;
  }
  AssertMsg(0, "Attempt to remove a text input field that doesn't exist.  Check your IDs.");
}

// Returns the gpActive field ID number.  It'll return -1 if no field is active.
function GetActiveFieldID(): INT16 {
  if (gpActive)
    return gpActive.value.ubID;
  return -1;
}

// This is a useful call made from an external user input field.  Using the previous file dialog example, this
// call would be made when the user selected a different filename in the list via clicking or scrolling with
// the arrows, or even using alpha chars to jump to the appropriate filename.
function SetInputFieldStringWith16BitString(ubField: UINT8, szNewText: Pointer<UINT16>): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubField) {
      if (szNewText) {
        curr.value.ubStrLen = wcslen(szNewText);
        Assert(curr.value.ubStrLen <= curr.value.ubMaxChars);
        swprintf(curr.value.szString, szNewText);
      } else if (!curr.value.fUserField) {
        curr.value.ubStrLen = 0;
        swprintf(curr.value.szString, "");
      } else {
        AssertMsg(0, String("Attempting to illegally set text into user field %d", curr.value.ubID));
      }
      return;
    }
    curr = curr.value.next;
  }
}

function SetInputFieldStringWith8BitString(ubField: UINT8, szNewText: Pointer<UINT8>): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubField) {
      if (szNewText) {
        curr.value.ubStrLen = strlen(szNewText);
        Assert(curr.value.ubStrLen <= curr.value.ubMaxChars);
        swprintf(curr.value.szString, "%S", szNewText);
      } else if (!curr.value.fUserField) {
        curr.value.ubStrLen = 0;
        swprintf(curr.value.szString, "");
      } else {
        AssertMsg(0, String("Attempting to illegally set text into user field %d", curr.value.ubID));
      }
      return;
    }
    curr = curr.value.next;
  }
}

// Allows external functions to access the strings within the fields at anytime.
function Get8BitStringFromField(ubField: UINT8, szString: Pointer<UINT8>): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubField) {
      sprintf(szString, "%S", curr.value.szString);
      return;
    }
    curr = curr.value.next;
  }
  szString[0] = '\0';
}

function Get16BitStringFromField(ubField: UINT8, szString: Pointer<UINT16>): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubField) {
      swprintf(szString, curr.value.szString);
      return;
    }
    curr = curr.value.next;
  }
  szString[0] = '\0';
}

// Converts the field's string into a number, then returns that number
// returns -1 if blank or invalid.  Only works for positive numbers.
function GetNumericStrictValueFromField(ubField: UINT8): INT32 {
  let ptr: Pointer<UINT16>;
  let str: UINT16[] /* [20] */;
  let total: INT32;
  Get16BitStringFromField(ubField, str);
  // Blank string, so return -1
  if (str[0] == '\0')
    return -1;
  // Convert the string to a number.  Don't trust other functions.  This will
  // ensure that nonnumeric values automatically return -1.
  total = 0;
  ptr = str;
  while (ptr.value != '\0') // if char is a valid char...
  {
    if (ptr.value >= '0' && ptr.value <= '9') //...make sure it is numeric...
    {
      // Multiply prev total by 10 and add converted char digit value.
      total = total * 10 + (ptr.value - '0');
    } else //...else the string is invalid.
      return -1;
    ptr++; // point to next char in string.
  }
  return total; // if we made it this far, then we have a valid number.
}

// Converts a number to a numeric strict value.  If the number is negative, the
// field will be blank.
function SetInputFieldStringWithNumericStrictValue(ubField: UINT8, iNumber: INT32): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubField) {
      if (curr.value.fUserField)
        AssertMsg(0, String("Attempting to illegally set text into user field %d", curr.value.ubID));
      if (iNumber < 0) // negative number converts to blank string
        swprintf(curr.value.szString, "");
      else {
        let iMax: INT32 = pow(10.0, curr.value.ubMaxChars);
        if (iNumber > iMax) // set string to max value based on number of chars.
          swprintf(curr.value.szString, "%d", iMax - 1);
        else // set string to the number given
          swprintf(curr.value.szString, "%d", iNumber);
      }
      curr.value.ubStrLen = wcslen(curr.value.szString);
      return;
    }
    curr = curr.value.next;
  }
}

// Sets the active field to the specified ID passed.
function SetActiveField(ubField: UINT8): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr != gpActive && curr.value.ubID == ubField && curr.value.fEnabled) {
      gpActive = curr;
      if (gpActive.value.szString) {
        gubStartHilite = 0;
        gubEndHilite = gpActive.value.ubStrLen;
        gubCursorPos = gpActive.value.ubStrLen;
        gfHiliteMode = TRUE;
        gfEditingText = TRUE;
      } else {
        gfHiliteMode = FALSE;
        gfEditingText = FALSE;
        if (gpActive.value.InputCallback)
          (gpActive.value.InputCallback)(gpActive.value.ubID, TRUE);
      }
      return;
    }
    curr = curr.value.next;
  }
}

function SelectNextField(): void {
  let fDone: BOOLEAN = FALSE;
  let pStart: Pointer<TEXTINPUTNODE>;

  if (!gpActive)
    return;
  if (gpActive.value.szString)
    RenderInactiveTextFieldNode(gpActive);
  else if (gpActive.value.InputCallback)
    (gpActive.value.InputCallback)(gpActive.value.ubID, FALSE);
  pStart = gpActive;
  while (!fDone) {
    gpActive = gpActive.value.next;
    if (!gpActive)
      gpActive = gpTextInputHead;
    if (gpActive.value.fEnabled) {
      fDone = TRUE;
      if (gpActive.value.szString) {
        gubStartHilite = 0;
        gubEndHilite = gpActive.value.ubStrLen;
        gubCursorPos = gpActive.value.ubStrLen;
        gfHiliteMode = TRUE;
        gfEditingText = TRUE;
      } else {
        gfHiliteMode = FALSE;
        gfEditingText = FALSE;
        if (gpActive.value.InputCallback)
          (gpActive.value.InputCallback)(gpActive.value.ubID, TRUE);
      }
    }
    if (gpActive == pStart) {
      gfEditingText = FALSE;
      return;
    }
  }
}

function SelectPrevField(): void {
  let fDone: BOOLEAN = FALSE;
  let pStart: Pointer<TEXTINPUTNODE>;

  if (!gpActive)
    return;
  if (gpActive.value.szString)
    RenderInactiveTextFieldNode(gpActive);
  else if (gpActive.value.InputCallback)
    (gpActive.value.InputCallback)(gpActive.value.ubID, FALSE);
  pStart = gpActive;
  while (!fDone) {
    gpActive = gpActive.value.prev;
    if (!gpActive)
      gpActive = gpTextInputTail;
    if (gpActive.value.fEnabled) {
      fDone = TRUE;
      if (gpActive.value.szString) {
        gubStartHilite = 0;
        gubEndHilite = gpActive.value.ubStrLen;
        gubCursorPos = gpActive.value.ubStrLen;
        gfHiliteMode = TRUE;
        gfEditingText = TRUE;
      } else {
        gfHiliteMode = FALSE;
        gfEditingText = FALSE;
        if (gpActive.value.InputCallback)
          (gpActive.value.InputCallback)(gpActive.value.ubID, TRUE);
      }
    }
    if (gpActive == pStart) {
      gfEditingText = FALSE;
      return;
    }
  }
}

// These allow you to customize the general color scheme of your text input boxes.  I am assuming that
// under no circumstances would a user want a different color for each field.  It follows the Win95 convention
// that all text input boxes are exactly the same color scheme.  However, these colors can be set at anytime,
// but will effect all of the colors.
function SetTextInputFont(usFont: UINT16): void {
  pColors.value.usFont = usFont;
}

function Set16BPPTextFieldColor(usTextFieldColor: UINT16): void {
  pColors.value.usTextFieldColor = usTextFieldColor;
}

function SetTextInputRegularColors(ubForeColor: UINT8, ubShadowColor: UINT8): void {
  pColors.value.ubForeColor = ubForeColor;
  pColors.value.ubShadowColor = ubShadowColor;
}

function SetTextInputHilitedColors(ubForeColor: UINT8, ubShadowColor: UINT8, ubBackColor: UINT8): void {
  pColors.value.ubHiForeColor = ubForeColor;
  pColors.value.ubHiShadowColor = ubShadowColor;
  pColors.value.ubHiBackColor = ubBackColor;
}

function SetDisabledTextFieldColors(ubForeColor: UINT8, ubShadowColor: UINT8, usTextFieldColor: UINT16): void {
  pColors.value.fUseDisabledAutoShade = FALSE;
  pColors.value.ubDisabledForeColor = ubForeColor;
  pColors.value.ubDisabledShadowColor = ubShadowColor;
  pColors.value.usDisabledTextFieldColor = usTextFieldColor;
}

function SetBevelColors(usBrighterColor: UINT16, usDarkerColor: UINT16): void {
  pColors.value.fBevelling = TRUE;
  pColors.value.usBrighterColor = usBrighterColor;
  pColors.value.usDarkerColor = usDarkerColor;
}

function SetCursorColor(usCursorColor: UINT16): void {
  pColors.value.usCursorColor = usCursorColor;
}

// All CTRL and ALT keys combinations, F1-F12 keys, ENTER and ESC are ignored allowing
// processing to be done with your own input handler.  Otherwise, the keyboard event
// is absorbed by this input handler, if used in the appropriate manner.
// This call must be added at the beginning of your input handler in this format:
// while( DequeueEvent(&Event) )
//{
//	if(	!HandleTextInput( &Event ) && (your conditions...ex:  Event.usEvent == KEY_DOWN ) )
//  {
//		switch( Event.usParam )
//		{
//			//Normal key cases here.
//		}
//	}
//}
// It is only necessary for event loops that contain text input fields.
function HandleTextInput(Event: Pointer<InputAtom>): BOOLEAN {
  // Check the multitude of terminating conditions...

  // not in text input mode
  gfNoScroll = FALSE;
  if (!gfTextInputMode)
    return FALSE;
  // currently in a user field, so return unless TAB or SHIFT_TAB are pressed.
  if (!gfEditingText && Event.value.usParam != TAB && Event.value.usParam != SHIFT_TAB)
    return FALSE;
  // unless we are psycho typers, we only want to process these key events.
  if (Event.value.usEvent != KEY_DOWN && Event.value.usEvent != KEY_REPEAT)
    return FALSE;
  // ESC and ENTER must be handled externally, due to the infinite uses for it.
  // When editing text, ESC is equivalent to cancel, and ENTER is to confirm.
  if (Event.value.usParam == ESC)
    return FALSE;
  if (Event.value.usParam == ENTER) {
    PlayJA2Sample(Enum330.REMOVING_TEXT, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
    return FALSE;
  }
  if (Event.value.usKeyState & ALT_DOWN || Event.value.usKeyState & CTRL_DOWN && Event.value.usParam != DEL)
    return FALSE;
  // F1-F12 regardless of state are processed externally as well.
  if (Event.value.usParam >= F1 && Event.value.usParam <= F12 || Event.value.usParam >= SHIFT_F1 && Event.value.usParam <= SHIFT_F12) {
    return FALSE;
  }
  if (Event.value.usParam == '%' || Event.value.usParam == '\\') {
    // Input system doesn't support strings that are format specifiers.
    return FALSE;
  }
  // If we have met all of the conditions, we then have a valid key press
  // which will be handled universally for all text input fields
  switch (Event.value.usParam) {
    case TAB:
      // Always selects the next field, even when a user defined field is currently selected.
      // The order in which you add your text and user fields dictates the cycling order when
      // TAB is pressed.
      SelectNextField();
      break;
    case SHIFT_TAB:
      // Same as TAB, but selects fields in reverse order.
      SelectPrevField();
      break;
    case LEFTARROW:
      // Move the cursor to the left one position.  If there is selected text,
      // the cursor moves to the left of the block, and clears the block.
      gfNoScroll = TRUE;
      if (gfHiliteMode) {
        gfHiliteMode = FALSE;
        gubCursorPos = gubStartHilite;
        break;
      }
      if (gubCursorPos)
        gubCursorPos--;
      break;
    case RIGHTARROW:
      // Move the cursor to the right one position.  If there is selected text,
      // the block is cleared.
      gfNoScroll = TRUE;
      if (gfHiliteMode) {
        gfHiliteMode = FALSE;
        gubCursorPos = gubEndHilite;
        break;
      }
      if (gubCursorPos < gpActive.value.ubStrLen)
        gubCursorPos++;
      break;
    case END:
      // Any hilighting is cleared and the cursor moves to the end of the text.
      gfHiliteMode = FALSE;
      gubCursorPos = gpActive.value.ubStrLen;
      break;
    case HOME:
      // Any hilighting is cleared and the cursor moves to the beginning of the line.
      gfHiliteMode = FALSE;
      gubCursorPos = 0;
      break;
    case SHIFT_LEFTARROW:
      // Initiates or continues hilighting to the left one position.  If the cursor
      // is at the left end of the block, then the block decreases one position.
      gfNoScroll = TRUE;
      if (!gfHiliteMode) {
        gfHiliteMode = TRUE;
        gubStartHilite = gubCursorPos;
      }
      if (gubCursorPos)
        gubCursorPos--;
      gubEndHilite = gubCursorPos;
      break;
    case SHIFT_RIGHTARROW:
      // Initiates or continues hilighting to the right one position.  If the cursor
      // is at the right end of the block, then the block decreases one position.
      gfNoScroll = TRUE;
      if (!gfHiliteMode) {
        gfHiliteMode = TRUE;
        gubStartHilite = gubCursorPos;
      }
      if (gubCursorPos < gpActive.value.ubStrLen)
        gubCursorPos++;
      gubEndHilite = gubCursorPos;
      break;
    case SHIFT_END:
      // From the location of the anchored cursor for hilighting, the cursor goes to
      // the end of the text, selecting all text from the anchor to the end of the text.
      if (!gfHiliteMode) {
        gfHiliteMode = TRUE;
        gubStartHilite = gubCursorPos;
      }
      gubCursorPos = gpActive.value.ubStrLen;
      gubEndHilite = gubCursorPos;
      break;
    case SHIFT_HOME:
      // From the location of the anchored cursor for hilighting, the cursor goes to
      // the beginning of the text, selecting all text from the anchor to the beginning
      // of the text.
      if (!gfHiliteMode) {
        gfHiliteMode = TRUE;
        gubStartHilite = gubCursorPos;
      }
      gubCursorPos = 0;
      gubEndHilite = gubCursorPos;
      break;
    case DEL:
      // CTRL+DEL will delete the entire text field, regardless of hilighting.
      // DEL will either delete the selected text, or the character to the right
      // of the cursor if applicable.
      PlayJA2Sample(Enum330.ENTERING_TEXT, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
      if (Event.value.usKeyState & CTRL_DOWN) {
        gubStartHilite = 0;
        gubEndHilite = gpActive.value.ubStrLen;
        gfHiliteMode = TRUE;
        DeleteHilitedText();
      } else if (gfHiliteMode)
        PlayJA2Sample(Enum330.ENTERING_TEXT, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
      else
        RemoveChar(gubCursorPos);
      break;
    case BACKSPACE:
      // Will delete the selected text, or the character to the left of the cursor if applicable.
      if (gfHiliteMode) {
        PlayJA2Sample(Enum330.ENTERING_TEXT, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
        DeleteHilitedText();
      } else if (gubCursorPos > 0) {
        PlayJA2Sample(Enum330.ENTERING_TEXT, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
        RemoveChar(--gubCursorPos);
      }
      break;
    default: // check for typing keys
      if (gfHiliteMode)
        DeleteHilitedText();
      if (gpActive.value.usInputType >= INPUTTYPE_EXCLUSIVE_BASEVALUE)
        HandleExclusiveInput(Event.value.usParam);
      else {
        // Use abbreviations
        let key: UINT32 = Event.value.usParam;
        let type: UINT16 = gpActive.value.usInputType;
        // Handle space key
        if (key == SPACE && type & INPUTTYPE_SPACES) {
          AddChar(key);
          return TRUE;
        }
        // Handle allowing minus key only at the beginning of a field.
        if (key == '-' && type & INPUTTYPE_FIRSTPOSMINUS && !gubCursorPos) {
          AddChar(key);
          return TRUE;
        }
        // Handle numerics
        if (key >= '0' && key <= '9' && type & INPUTTYPE_NUMERICSTRICT) {
          AddChar(key);
          return TRUE;
        }
        // Handle alphas
        if (type & INPUTTYPE_ALPHA) {
          if (key >= 'A' && key <= 'Z') {
            if (type & INPUTTYPE_LOWERCASE)
              key -= 32;
            AddChar(key);
            return TRUE;
          }
          if (key >= 'a' && key <= 'z') {
            if (type & INPUTTYPE_UPPERCASE)
              key += 32;
            AddChar(key);
            return TRUE;
          }
        }
        // Handle special characters
        if (type & INPUTTYPE_SPECIAL) {
          // More can be added, but not all of the fonts support these
          if (key >= 0x21 && key <= 0x2f || // ! " # $ % & ' ( ) * + , - . /
              key >= 0x3a && key <= 0x40 || // : ; < = > ? @
              key >= 0x5b && key <= 0x5f || // [ \ ] ^ _
              key >= 0x7b && key <= 0x7d) // { | }
          {
            AddChar(key);
            return TRUE;
          }
        }
      }
      return TRUE;
  }
  return TRUE;
}

function HandleExclusiveInput(uiKey: UINT32): void {
  switch (gpActive.value.usInputType) {
    case Enum383.INPUTTYPE_EXCLUSIVE_DOSFILENAME: // dos file names
      if (uiKey >= 'A' && uiKey <= 'Z' || uiKey >= 'a' && uiKey <= 'z' || uiKey >= '0' && uiKey <= '9' || uiKey == '_' || uiKey == '.') {
        if (!gubCursorPos && uiKey >= '0' && uiKey <= '9') {
          // can't begin a new filename with a number
          return;
        }
        AddChar(uiKey);
      }
      break;
    case Enum383.INPUTTYPE_EXCLUSIVE_COORDINATE: // coordinates such as a9, z78, etc.
      if (!gubCursorPos) // first char is an lower case alpha
      {
        if (uiKey >= 'a' && uiKey <= 'z')
          AddChar(uiKey);
        else if (uiKey >= 'A' && uiKey <= 'Z')
          AddChar(uiKey + 32); // convert to lowercase
      } else // subsequent chars are numeric
      {
        if (uiKey >= '0' && uiKey <= '9')
          AddChar(uiKey);
      }
      break;
    case Enum383.INPUTTYPE_EXCLUSIVE_24HOURCLOCK:
      if (!gubCursorPos) {
        if (uiKey >= '0' && uiKey <= '2')
          AddChar(uiKey);
      } else if (gubCursorPos == 1) {
        if (uiKey >= '0' && uiKey <= '9') {
          if (gpActive.value.szString[0] == '2' && uiKey > '3')
            break;
          AddChar(uiKey);
        }
        if (!gpActive.value.szString[2])
          AddChar(':');
        else
          gubCursorPos++;
      } else if (gubCursorPos == 2) {
        if (uiKey == ':')
          AddChar(uiKey);
        else if (uiKey >= '0' && uiKey <= '9') {
          AddChar(':');
          AddChar(uiKey);
        }
      } else if (gubCursorPos == 3) {
        if (uiKey >= '0' && uiKey <= '5')
          AddChar(uiKey);
      } else if (gubCursorPos == 4) {
        if (uiKey >= '0' && uiKey <= '9')
          AddChar(uiKey);
      }
      break;
  }
}

function AddChar(uiKey: UINT32): void {
  PlayJA2Sample(Enum330.ENTERING_TEXT, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
  if (gpActive.value.ubStrLen >= gpActive.value.ubMaxChars) {
    // max length reached.  Just replace the last character with new one.
    gpActive.value.ubStrLen = gpActive.value.ubMaxChars;
    gpActive.value.szString[gpActive.value.ubStrLen - 1] = uiKey;
    gpActive.value.szString[gpActive.value.ubStrLen] = '\0';
    return;
  } else if (gubCursorPos == gpActive.value.ubStrLen) {
    // add character to end
    gpActive.value.szString[gpActive.value.ubStrLen] = uiKey;
    gpActive.value.szString[gpActive.value.ubStrLen + 1] = '\0';
    gpActive.value.ubStrLen++;
    gubCursorPos = gpActive.value.ubStrLen;
  } else {
    // insert character after cursor
    let sChar: INT16;
    sChar = (gpActive.value.ubStrLen + 1);
    while (sChar >= gubCursorPos) {
      gpActive.value.szString[sChar + 1] = gpActive.value.szString[sChar];
      sChar--;
    }
    gpActive.value.szString[gubCursorPos] = uiKey;
    gpActive.value.ubStrLen++;
    gubCursorPos++;
  }
}

function DeleteHilitedText(): void {
  let ubCount: UINT8;
  let ubStart: UINT8;
  let ubEnd: UINT8;
  gfHiliteMode = FALSE;
  if (gubStartHilite != gubEndHilite) {
    if (gubStartHilite < gubEndHilite) {
      ubStart = gubStartHilite;
      ubEnd = gubEndHilite;
    } else {
      ubStart = gubEndHilite;
      ubEnd = gubStartHilite;
    }
    ubCount = (ubEnd - ubStart);
    while (ubCount--) {
      RemoveChar(ubStart);
    }
    gubStartHilite = gubEndHilite = 0;
    gubCursorPos = ubStart;
    gfHiliteMode = FALSE;
  }
}

function RemoveChar(ubArrayIndex: UINT8): void {
  let fDeleting: BOOLEAN = FALSE;
  while (ubArrayIndex < gpActive.value.ubStrLen) {
    gpActive.value.szString[ubArrayIndex] = gpActive.value.szString[ubArrayIndex + 1];
    ubArrayIndex++;
    fDeleting = TRUE;
  }
  // if we deleted a char, then decrement the strlen.
  if (fDeleting)
    gpActive.value.ubStrLen--;
}

// Internally used to continue highlighting text
function MouseMovedInTextRegionCallback(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  let curr: Pointer<TEXTINPUTNODE>;
  if (gfLeftButtonState) {
    if (reason & MSYS_CALLBACK_REASON_MOVE || reason & MSYS_CALLBACK_REASON_LOST_MOUSE || reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
      let iClickX: INT32;
      let iCurrCharPos: INT32;
      let iNextCharPos: INT32;
      let ubNewID: UINT8;
      ubNewID = MSYS_GetRegionUserData(reg, 0);
      if (ubNewID != gpActive.value.ubID) {
        // deselect the current text edit region if applicable, then find the new one.
        RenderInactiveTextFieldNode(gpActive);
        curr = gpTextInputHead;
        while (curr) {
          if (curr.value.ubID == ubNewID) {
            gpActive = curr;
            break;
          }
          curr = curr.value.next;
        }
      }
      if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
        if (gusMouseYPos < reg.value.RegionTopLeftY) {
          gubEndHilite = 0;
          gfHiliteMode = TRUE;
          return;
        } else if (gusMouseYPos > reg.value.RegionBottomRightY) {
          gubEndHilite = gpActive.value.ubStrLen;
          gfHiliteMode = TRUE;
          return;
        }
      }

      // Calculate the cursor position.
      iClickX = gusMouseXPos - reg.value.RegionTopLeftX;
      iCurrCharPos = 0;
      gubCursorPos = 0;
      iNextCharPos = StringPixLengthArg(pColors.value.usFont, 1, gpActive.value.szString) / 2;
      while (iCurrCharPos + (iNextCharPos - iCurrCharPos) / 2 < iClickX && gubCursorPos < gpActive.value.ubStrLen) {
        gubCursorPos++;
        iCurrCharPos = iNextCharPos;
        iNextCharPos = StringPixLengthArg(pColors.value.usFont, gubCursorPos + 1, gpActive.value.szString);
      }
      gubEndHilite = gubCursorPos;
      if (gubEndHilite != gubStartHilite)
        gfHiliteMode = TRUE;
    }
  }
}

// Internally used to calculate where to place the cursor.
function MouseClickedInTextRegionCallback(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  let curr: Pointer<TEXTINPUTNODE>;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    let iClickX: INT32;
    let iCurrCharPos: INT32;
    let iNextCharPos: INT32;
    let ubNewID: UINT8;
    ubNewID = MSYS_GetRegionUserData(reg, 0);
    if (ubNewID != gpActive.value.ubID) {
      // deselect the current text edit region if applicable, then find the new one.
      RenderInactiveTextFieldNode(gpActive);
      curr = gpTextInputHead;
      while (curr) {
        if (curr.value.ubID == ubNewID) {
          gpActive = curr;
          break;
        }
        curr = curr.value.next;
      }
    }
    // Signifies that we are typing text now.
    gfEditingText = TRUE;
    // Calculate the cursor position.
    iClickX = gusMouseXPos - reg.value.RegionTopLeftX;
    iCurrCharPos = 0;
    gubCursorPos = 0;
    iNextCharPos = StringPixLengthArg(pColors.value.usFont, 1, gpActive.value.szString) / 2;
    while (iCurrCharPos + (iNextCharPos - iCurrCharPos) / 2 < iClickX && gubCursorPos < gpActive.value.ubStrLen) {
      gubCursorPos++;
      iCurrCharPos = iNextCharPos;
      iNextCharPos = StringPixLengthArg(pColors.value.usFont, gubCursorPos + 1, gpActive.value.szString);
    }
    gubStartHilite = gubCursorPos; // This value is the anchor
    gubEndHilite = gubCursorPos; // The end will move with the cursor as long as it's down.
    gfHiliteMode = FALSE;
  }
}

function RenderBackgroundField(pNode: Pointer<TEXTINPUTNODE>): void {
  let usColor: UINT16;
  if (pColors.value.fBevelling) {
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pNode.value.region.RegionTopLeftX, pNode.value.region.RegionTopLeftY, pNode.value.region.RegionBottomRightX, pNode.value.region.RegionBottomRightY, pColors.value.usDarkerColor);
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pNode.value.region.RegionTopLeftX + 1, pNode.value.region.RegionTopLeftY + 1, pNode.value.region.RegionBottomRightX, pNode.value.region.RegionBottomRightY, pColors.value.usBrighterColor);
  }
  if (!pNode.value.fEnabled && !pColors.value.fUseDisabledAutoShade)
    usColor = pColors.value.usDisabledTextFieldColor;
  else
    usColor = pColors.value.usTextFieldColor;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, pNode.value.region.RegionTopLeftX + 1, pNode.value.region.RegionTopLeftY + 1, pNode.value.region.RegionBottomRightX - 1, pNode.value.region.RegionBottomRightY - 1, usColor);

  InvalidateRegion(pNode.value.region.RegionTopLeftX, pNode.value.region.RegionTopLeftY, pNode.value.region.RegionBottomRightX, pNode.value.region.RegionBottomRightY);
}

function RenderActiveTextField(): void {
  let uiCursorXPos: UINT32;
  let usOffset: UINT16;
  let str: UINT16[] /* [256] */;
  if (!gpActive || !gpActive.value.szString)
    return;

  SaveFontSettings();
  SetFont(pColors.value.usFont);
  usOffset = ((gpActive.value.region.RegionBottomRightY - gpActive.value.region.RegionTopLeftY - GetFontHeight(pColors.value.usFont)) / 2);
  RenderBackgroundField(gpActive);
  if (gfHiliteMode && gubStartHilite != gubEndHilite) {
    // Some or all of the text is hilighted, so we will use a different method.
    let i: UINT16;
    let usStart: UINT16;
    let usEnd: UINT16;
    // sort the hilite order.
    if (gubStartHilite < gubEndHilite) {
      usStart = gubStartHilite;
      usEnd = gubEndHilite;
    } else {
      usStart = gubEndHilite;
      usEnd = gubStartHilite;
    }
    // Traverse the string one character at a time, and draw the highlited part differently.
    for (i = 0; i < gpActive.value.ubStrLen; i++) {
      uiCursorXPos = StringPixLengthArg(pColors.value.usFont, i, gpActive.value.szString) + 3;
      if (i >= usStart && i < usEnd) {
        // in highlighted part of text
        SetFontForeground(pColors.value.ubHiForeColor);
        SetFontShadow(pColors.value.ubHiShadowColor);
        SetFontBackground(pColors.value.ubHiBackColor);
      } else {
        // in regular part of text
        SetFontForeground(pColors.value.ubForeColor);
        SetFontShadow(pColors.value.ubShadowColor);
        SetFontBackground(0);
      }
      if (gpActive.value.szString[i] != '%') {
        mprintf(uiCursorXPos + gpActive.value.region.RegionTopLeftX, gpActive.value.region.RegionTopLeftY + usOffset, "%c", gpActive.value.szString[i]);
      } else {
        mprintf(uiCursorXPos + gpActive.value.region.RegionTopLeftX, gpActive.value.region.RegionTopLeftY + usOffset, "%%");
      }
    }
  } else {
    SetFontForeground(pColors.value.ubForeColor);
    SetFontShadow(pColors.value.ubShadowColor);
    SetFontBackground(0);
    DoublePercentileCharacterFromStringIntoString(gpActive.value.szString, str);
    mprintf(gpActive.value.region.RegionTopLeftX + 3, gpActive.value.region.RegionTopLeftY + usOffset, str);
  }
  // Draw the cursor in the correct position.
  if (gfEditingText && gpActive.value.szString) {
    DoublePercentileCharacterFromStringIntoString(gpActive.value.szString, str);
    uiCursorXPos = StringPixLengthArg(pColors.value.usFont, gubCursorPos, str) + 2;
    if (GetJA2Clock() % 1000 < 500) {
      // draw the blinking ibeam cursor during the on blink period.
      ColorFillVideoSurfaceArea(FRAME_BUFFER, gpActive.value.region.RegionTopLeftX + uiCursorXPos, gpActive.value.region.RegionTopLeftY + usOffset, gpActive.value.region.RegionTopLeftX + uiCursorXPos + 1, gpActive.value.region.RegionTopLeftY + usOffset + GetFontHeight(pColors.value.usFont), pColors.value.usCursorColor);
    }
  }
  RestoreFontSettings();
}

function RenderInactiveTextField(ubID: UINT8): void {
  let usOffset: UINT16;
  let pNode: Pointer<TEXTINPUTNODE>;
  let curr: Pointer<TEXTINPUTNODE>;
  let str: UINT16[] /* [256] */;
  curr = gpTextInputHead;
  pNode = NULL;
  while (curr) {
    if (curr.value.ubID == ubID) {
      pNode = curr;
      break;
    }
  }
  if (!pNode || !pNode.value.szString)
    return;
  SaveFontSettings();
  SetFont(pColors.value.usFont);
  usOffset = ((pNode.value.region.RegionBottomRightY - pNode.value.region.RegionTopLeftY - GetFontHeight(pColors.value.usFont)) / 2);
  SetFontForeground(pColors.value.ubForeColor);
  SetFontShadow(pColors.value.ubShadowColor);
  SetFontBackground(0);
  RenderBackgroundField(pNode);
  DoublePercentileCharacterFromStringIntoString(pNode.value.szString, str);
  mprintf(pNode.value.region.RegionTopLeftX + 3, pNode.value.region.RegionTopLeftY + usOffset, str);
  RestoreFontSettings();
}

function RenderInactiveTextFieldNode(pNode: Pointer<TEXTINPUTNODE>): void {
  let usOffset: UINT16;
  let str: UINT16[] /* [256] */;
  if (!pNode || !pNode.value.szString)
    return;
  SaveFontSettings();
  SetFont(pColors.value.usFont);
  if (!pNode.value.fEnabled && pColors.value.fUseDisabledAutoShade) {
    // use the color scheme specified by the user.
    SetFontForeground(pColors.value.ubDisabledForeColor);
    SetFontShadow(pColors.value.ubDisabledShadowColor);
  } else {
    SetFontForeground(pColors.value.ubForeColor);
    SetFontShadow(pColors.value.ubShadowColor);
  }
  usOffset = ((pNode.value.region.RegionBottomRightY - pNode.value.region.RegionTopLeftY - GetFontHeight(pColors.value.usFont)) / 2);
  SetFontBackground(0);
  RenderBackgroundField(pNode);
  DoublePercentileCharacterFromStringIntoString(pNode.value.szString, str);
  mprintf(pNode.value.region.RegionTopLeftX + 3, pNode.value.region.RegionTopLeftY + usOffset, str);
  RestoreFontSettings();
  if (!pNode.value.fEnabled && pColors.value.fUseDisabledAutoShade) {
    let pDestBuf: Pointer<UINT8>;
    let uiDestPitchBYTES: UINT32;
    let ClipRect: SGPRect;
    ClipRect.iLeft = pNode.value.region.RegionTopLeftX;
    ClipRect.iRight = pNode.value.region.RegionBottomRightX;
    ClipRect.iTop = pNode.value.region.RegionTopLeftY;
    ClipRect.iBottom = pNode.value.region.RegionBottomRightY;
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    Blt16BPPBufferShadowRect(pDestBuf, uiDestPitchBYTES, addressof(ClipRect));
    UnLockVideoSurface(FRAME_BUFFER);
  }
}

// Use when you do a full interface update.
function RenderAllTextFields(): void {
  let stackCurr: Pointer<STACKTEXTINPUTNODE>;
  let curr: Pointer<TEXTINPUTNODE>;
  // Render all of the other text input levels first,
  // if they exist at all.
  stackCurr = pInputStack;
  while (stackCurr) {
    curr = stackCurr.value.head;
    while (curr) {
      RenderInactiveTextFieldNode(curr);
      curr = curr.value.next;
    }
    stackCurr = stackCurr.value.next;
  }
  // Render the current text input level
  curr = gpTextInputHead;
  while (curr) {
    if (curr != gpActive)
      RenderInactiveTextFieldNode(curr);
    else
      RenderActiveTextField();
    curr = curr.value.next;
  }
}

function EnableTextField(ubID: UINT8): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubID) {
      if (!curr.value.fEnabled) {
        if (!gpActive)
          gpActive = curr;
        MSYS_EnableRegion(addressof(curr.value.region));
        curr.value.fEnabled = TRUE;
      } else
        return;
    }
    curr = curr.value.next;
  }
}

function DisableTextField(ubID: UINT8): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubID) {
      if (gpActive == curr)
        SelectNextField();
      if (curr.value.fEnabled) {
        MSYS_DisableRegion(addressof(curr.value.region));
        curr.value.fEnabled = FALSE;
      } else
        return;
    }
    curr = curr.value.next;
  }
}

function EnableTextFields(ubFirstID: UINT8, ubLastID: UINT8): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID >= ubFirstID && curr.value.ubID <= ubLastID) {
      if (gpActive == curr)
        SelectNextField();
      if (!curr.value.fEnabled) {
        MSYS_EnableRegion(addressof(curr.value.region));
        curr.value.fEnabled = TRUE;
      }
    }
    curr = curr.value.next;
  }
}

function DisableTextFields(ubFirstID: UINT8, ubLastID: UINT8): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID >= ubFirstID && curr.value.ubID <= ubLastID) {
      if (gpActive == curr)
        SelectNextField();
      if (curr.value.fEnabled) {
        MSYS_DisableRegion(addressof(curr.value.region));
        curr.value.fEnabled = FALSE;
      }
    }
    curr = curr.value.next;
  }
}

function EnableAllTextFields(): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (!curr.value.fEnabled) {
      MSYS_EnableRegion(addressof(curr.value.region));
      curr.value.fEnabled = TRUE;
    }
    curr = curr.value.next;
  }
  if (!gpActive)
    gpActive = gpTextInputHead;
}

function DisableAllTextFields(): void {
  let curr: Pointer<TEXTINPUTNODE>;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.fEnabled) {
      MSYS_DisableRegion(addressof(curr.value.region));
      curr.value.fEnabled = FALSE;
    }
    curr = curr.value.next;
  }
  gpActive = NULL;
}

function EditingText(): BOOLEAN {
  return gfEditingText;
}

function TextInputMode(): BOOLEAN {
  return gfTextInputMode;
}

// copy, cut, and paste hilighted text code
function InitClipboard(): void {
  szClipboard = NULL;
}

function KillClipboard(): void {
  if (szClipboard) {
    MemFree(szClipboard);
    szClipboard = NULL;
  }
}

function ExecuteCopyCommand(): void {
  let ubCount: UINT8;
  let ubStart: UINT8;
  let ubEnd: UINT8;
  if (!gpActive || !gpActive.value.szString)
    return;
  // Delete the current contents in the clipboard
  KillClipboard();
  // Calculate the start and end of the hilight
  if (gubStartHilite != gubEndHilite) {
    if (gubStartHilite < gubEndHilite) {
      ubStart = gubStartHilite;
      ubEnd = gubEndHilite;
    } else {
      ubStart = gubEndHilite;
      ubEnd = gubStartHilite;
    }
    ubCount = (ubEnd - ubStart);
    szClipboard = MemAlloc((ubCount + 1) * 2);
    Assert(szClipboard);
    for (ubCount = ubStart; ubCount < ubEnd; ubCount++) {
      szClipboard[ubCount - ubStart] = gpActive.value.szString[ubCount];
    }
    szClipboard[ubCount - ubStart] = '\0';
  }
}

function ExecutePasteCommand(): void {
  let ubCount: UINT8;
  if (!gpActive || !szClipboard)
    return;
  DeleteHilitedText();

  ubCount = 0;
  while (szClipboard[ubCount]) {
    AddChar(szClipboard[ubCount]);
    ubCount++;
  }
}

function ExecuteCutCommand(): void {
  ExecuteCopyCommand();
  DeleteHilitedText();
}

// Saves the current text input mode, then removes it and activates the previous text input mode,
// if applicable.  The second function restores the settings.  Doesn't currently support nested
// calls.
function SaveAndRemoveCurrentTextInputMode(): void {
  if (pSavedHead)
    AssertMsg(0, "Attempting to save text input stack head, when one already exists.");
  pSavedHead = gpTextInputHead;
  pSavedColors = pColors;
  if (pInputStack) {
    gpTextInputHead = pInputStack.value.head;
    pColors = pInputStack.value.pColors;
  } else {
    gpTextInputHead = NULL;
    pColors = NULL;
  }
}

function RestoreSavedTextInputMode(): void {
  if (!pSavedHead)
    AssertMsg(0, "Attempting to restore saved text input stack head, when one doesn't exist.");
  gpTextInputHead = pSavedHead;
  pColors = pSavedColors;
  pSavedHead = NULL;
  pSavedColors = NULL;
}

function GetTextInputCursor(): UINT16 {
  return gusTextInputCursor;
}

function SetTextInputCursor(usNewCursor: UINT16): void {
  let stackCurr: Pointer<STACKTEXTINPUTNODE>;
  let curr: Pointer<TEXTINPUTNODE>;
  if (gusTextInputCursor == usNewCursor) {
    return;
  }
  gusTextInputCursor = usNewCursor;
  // Render all of the other text input levels first,
  // if they exist at all.
  stackCurr = pInputStack;
  while (stackCurr) {
    curr = stackCurr.value.head;
    while (curr) {
      MSYS_SetCurrentCursor(usNewCursor);
      curr = curr.value.next;
    }
    stackCurr = stackCurr.value.next;
  }
  // Render the current text input level
  curr = gpTextInputHead;
  while (curr) {
    MSYS_SetCurrentCursor(usNewCursor);
    curr = curr.value.next;
  }
}

// Utility functions for the INPUTTYPE_EXCLUSIVE_24HOURCLOCK input type.
function GetExclusive24HourTimeValueFromField(ubField: UINT8): UINT16 {
  let curr: Pointer<TEXTINPUTNODE>;
  let usTime: UINT16;
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubField) {
      if (curr.value.usInputType != Enum383.INPUTTYPE_EXCLUSIVE_24HOURCLOCK)
        return 0xffff; // illegal!
      // First validate the hours 00-23
      if (curr.value.szString[0] == '2' && curr.value.szString[1] >= '0' && // 20-23
              curr.value.szString[1] <= '3' ||
          curr.value.szString[0] >= '0' && curr.value.szString[0] <= '1' && // 00-19
              curr.value.szString[1] >= '0' && curr.value.szString[1] <= '9') {
                // Next, validate the colon, and the minutes 00-59
        if (curr.value.szString[2] == ':' && curr.value.szString[5] == 0 && //	:
            curr.value.szString[3] >= '0' && curr.value.szString[3] <= '5' && // 0-5
            curr.value.szString[4] >= '0' && curr.value.szString[4] <= '9') // 0-9
        {
          // Hours
          usTime = ((curr.value.szString[0] - 0x30) * 10 + curr.value.szString[1] - 0x30) * 60;
          // Minutes
          usTime += (curr.value.szString[3] - 0x30) * 10 + curr.value.szString[4] - 0x30;
          return usTime;
        }
      }
      // invalid
      return 0xffff;
    }
    curr = curr.value.next;
  }

  AssertMsg(FALSE, String("GetExclusive24HourTimeValueFromField: Invalid field %d", ubField));
  return 0xffff;
}

// Utility functions for the INPUTTYPE_EXCLUSIVE_24HOURCLOCK input type.
function SetExclusive24HourTimeValue(ubField: UINT8, usTime: UINT16): void {
  let curr: Pointer<TEXTINPUTNODE>;
  // First make sure the time is a valid time.  If not, then use 23:59
  if (usTime == 0xffff) {
    SetInputFieldStringWith16BitString(ubField, "");
    return;
  }
  usTime = min(1439, usTime);
  curr = gpTextInputHead;
  while (curr) {
    if (curr.value.ubID == ubField) {
      if (curr.value.fUserField)
        AssertMsg(0, String("Attempting to illegally set text into user field %d", curr.value.ubID));
      curr.value.szString[0] = (usTime / 600) + 0x30; // 10 hours
      curr.value.szString[1] = (usTime / 60 % 10) + 0x30; // 1 hour
      usTime %= 60; // truncate the hours
      curr.value.szString[2] = ':';
      curr.value.szString[3] = (usTime / 10) + 0x30; // 10 minutes
      curr.value.szString[4] = (usTime % 10) + 0x30; // 1 minute;
      curr.value.szString[5] = 0;
      return;
    }
    curr = curr.value.next;
  }
}

function DoublePercentileCharacterFromStringIntoString(pSrcString: Pointer<UINT16>, pDstString: Pointer<UINT16>): void {
  let iSrcIndex: INT32 = 0;
  let iDstIndex: INT32 = 0;
  while (pSrcString[iSrcIndex] != 0) {
    if (pSrcString[iSrcIndex] == '%') {
      pDstString[iDstIndex] = '%';
      iDstIndex++;
    }
    pDstString[iDstIndex] = pSrcString[iSrcIndex];
    iSrcIndex++, iDstIndex++;
  }
  pDstString[iDstIndex] = 0;
}
