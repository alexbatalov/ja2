namespace ja2 {

// *****************************************************************************
//
// Filename :	MouseSystem.h
//
// Purpose :	Defines and typedefs for the "mousesystem" mouse region handler
//
// Modification history :
//
//		30jan97:Bret	-> Creation
//
// *****************************************************************************

// *****************************************************************************
//
//				Includes
//
// *****************************************************************************

// *****************************************************************************
//
//				Typedefs
//
// *****************************************************************************

export type MOUSE_CALLBACK = (mouseRegion: MOUSE_REGION, reason: INT32) => void; // Define MOUSE_CALLBACK type as pointer to void
export type MOUSE_HELPTEXT_DONE_CALLBACK = () => void; // the help is done callback

export interface MOUSE_REGION {
  IDNumber: UINT16; // Region's ID number, set by mouse system
  PriorityLevel: INT8; // Region's Priority, set by system and/or caller
  uiFlags: UINT32; // Region's state flags
  RegionTopLeftX: INT16; // Screen area affected by this region (absolute coordinates)
  RegionTopLeftY: INT16;
  RegionBottomRightX: INT16;
  RegionBottomRightY: INT16;
  MouseXPos: INT16; // Mouse's Coordinates in absolute screen coordinates
  MouseYPos: INT16;
  RelativeXPos: INT16; // Mouse's Coordinates relative to the Top-Left corner of the region
  RelativeYPos: INT16;
  ButtonState: UINT16; // Current state of the mouse buttons
  Cursor: UINT16; // Cursor to use when mouse in this region (see flags)
  MovementCallback: MOUSE_CALLBACK | null; // Pointer to callback function if movement occured in this region
  ButtonCallback: MOUSE_CALLBACK | null; // Pointer to callback function if button action occured in this region
  UserData: INT32[] /* [4] */; // User Data, can be set to anything!

  // Fast help vars.
  FastHelpTimer: INT16; // Countdown timer for FastHelp text
  FastHelpText: string /* Pointer<UINT16> */; // Text string for the FastHelp (describes buttons if left there a while)
  FastHelpRect: INT32;
  HelpDoneCallback: MOUSE_HELPTEXT_DONE_CALLBACK | null;

  next: MOUSE_REGION | null; // List maintenance, do NOT touch these entries
  prev: MOUSE_REGION | null;
}

export function createMouseRegion(): MOUSE_REGION {
  return {
    IDNumber: 0,
    PriorityLevel: 0,
    uiFlags: 0,
    RegionTopLeftX: 0,
    RegionTopLeftY: 0,
    RegionBottomRightX: 0,
    RegionBottomRightY: 0,
    MouseXPos: 0,
    MouseYPos: 0,
    RelativeXPos: 0,
    RelativeYPos: 0,
    ButtonState: 0,
    Cursor: 0,
    MovementCallback: null,
    ButtonCallback: null,
    UserData: createArray(4, 0),
    FastHelpTimer: 0,
    FastHelpText: "",
    FastHelpRect: 0,
    HelpDoneCallback: null,
    next: null,
    prev: null,
  };
}

export function createMouseRegionFrom(IDNumber: UINT16, PriorityLevel: INT8, uiFlags: UINT32, RegionTopLeftX: INT16, RegionTopLeftY: INT16, RegionBottomRightX: INT16, RegionBottomRightY: INT16, MouseXPos: INT16, MouseYPos: INT16, RelativeXPos: INT16, RelativeYPos: INT16, ButtonState: UINT16, Cursor: UINT16, MovementCallback: MOUSE_CALLBACK | null, ButtonCallback: MOUSE_CALLBACK | null, UserData: INT32[] /* [4] */, FastHelpTimer: INT16, FastHelpText: string /* Pointer<UINT16> */, FastHelpRect: INT32, HelpDoneCallback: MOUSE_HELPTEXT_DONE_CALLBACK | null, next: MOUSE_REGION | null, prev: MOUSE_REGION | null): MOUSE_REGION {
  return {
    IDNumber,
    PriorityLevel,
    uiFlags,
    RegionTopLeftX,
    RegionTopLeftY,
    RegionBottomRightX,
    RegionBottomRightY,
    MouseXPos,
    MouseYPos,
    RelativeXPos,
    RelativeYPos,
    ButtonState,
    Cursor,
    MovementCallback,
    ButtonCallback,
    UserData,
    FastHelpTimer,
    FastHelpText,
    FastHelpRect,
    HelpDoneCallback,
    next,
    prev,
  };
}

export function resetMouseRegion(mouseRegion: MOUSE_REGION) {
  mouseRegion.IDNumber = 0;
  mouseRegion.PriorityLevel = 0;
  mouseRegion.uiFlags = 0;
  mouseRegion.RegionTopLeftX = 0;
  mouseRegion.RegionTopLeftY = 0;
  mouseRegion.RegionBottomRightX = 0;
  mouseRegion.RegionBottomRightY = 0;
  mouseRegion.MouseXPos = 0;
  mouseRegion.MouseYPos = 0;
  mouseRegion.RelativeXPos = 0;
  mouseRegion.RelativeYPos = 0;
  mouseRegion.ButtonState = 0;
  mouseRegion.Cursor = 0;
  mouseRegion.MovementCallback = null;
  mouseRegion.ButtonCallback = null;
  mouseRegion.UserData.fill(0);
  mouseRegion.FastHelpTimer = 0;
  mouseRegion.FastHelpText = "";
  mouseRegion.FastHelpRect = 0;
  mouseRegion.HelpDoneCallback = null;
  mouseRegion.next = null;
  mouseRegion.prev = null;
}

// *****************************************************************************
//
//				Defines
//
// *****************************************************************************

// Mouse Region Flags
export const MSYS_NO_FLAGS = 0x00000000;
export const MSYS_MOUSE_IN_AREA = 0x00000001;
export const MSYS_SET_CURSOR = 0x00000002;
export const MSYS_MOVE_CALLBACK = 0x00000004;
export const MSYS_BUTTON_CALLBACK = 0x00000008;
export const MSYS_REGION_EXISTS = 0x00000010;
const MSYS_SYSTEM_INIT = 0x00000020;
export const MSYS_REGION_ENABLED = 0x00000040;
export const MSYS_FASTHELP = 0x00000080;
export const MSYS_GOT_BACKGROUND = 0x00000100;
export const MSYS_HAS_BACKRECT = 0x00000200;
export const MSYS_FASTHELP_RESET = 0x00000400;
export const MSYS_ALLOW_DISABLED_FASTHELP = 0x00000800;

// Mouse region IDs
export const MSYS_ID_BASE = 1;
export const MSYS_ID_MAX = 0xfffffff; // ( INT32 max )
export const MSYS_ID_SYSTEM = 0;

// Mouse region priorities
export const MSYS_PRIORITY_LOWEST = 0;
export const MSYS_PRIORITY_LOW = 15;
export const MSYS_PRIORITY_BASE = 31;
export const MSYS_PRIORITY_NORMAL = 31;
export const MSYS_PRIORITY_HIGH = 63;
export const MSYS_PRIORITY_HIGHEST = 127;
export const MSYS_PRIORITY_SYSTEM = -1;
export const MSYS_PRIORITY_AUTO = -1;

// Mouse system defines used during updates
export const MSYS_NO_ACTION = 0;
export const MSYS_DO_MOVE = 1;
export const MSYS_DO_LBUTTON_DWN = 2;
export const MSYS_DO_LBUTTON_UP = 4;
export const MSYS_DO_RBUTTON_DWN = 8;
export const MSYS_DO_RBUTTON_UP = 16;
export const MSYS_DO_LBUTTON_REPEAT = 32;
export const MSYS_DO_RBUTTON_REPEAT = 64;

export const MSYS_DO_BUTTONS = (MSYS_DO_LBUTTON_DWN | MSYS_DO_LBUTTON_UP | MSYS_DO_RBUTTON_DWN | MSYS_DO_RBUTTON_UP | MSYS_DO_RBUTTON_REPEAT | MSYS_DO_LBUTTON_REPEAT);

// Mouse system button masks
export const MSYS_LEFT_BUTTON = 1;
export const MSYS_RIGHT_BUTTON = 2;

// Mouse system special values
export const MSYS_NO_CALLBACK = null;
export const MSYS_NO_CURSOR = 65534;

// Mouse system callback reasons
export const MSYS_CALLBACK_REASON_NONE = 0;
export const MSYS_CALLBACK_REASON_INIT = 1;
export const MSYS_CALLBACK_REASON_MOVE = 2;
export const MSYS_CALLBACK_REASON_LBUTTON_DWN = 4;
export const MSYS_CALLBACK_REASON_LBUTTON_UP = 8;
export const MSYS_CALLBACK_REASON_RBUTTON_DWN = 16;
export const MSYS_CALLBACK_REASON_RBUTTON_UP = 32;
const MSYS_CALLBACK_REASON_BUTTONS = (MSYS_CALLBACK_REASON_LBUTTON_DWN | MSYS_CALLBACK_REASON_LBUTTON_UP | MSYS_CALLBACK_REASON_RBUTTON_DWN | MSYS_CALLBACK_REASON_RBUTTON_UP);
export const MSYS_CALLBACK_REASON_LOST_MOUSE = 64;
export const MSYS_CALLBACK_REASON_GAIN_MOUSE = 128;

export const MSYS_CALLBACK_REASON_LBUTTON_REPEAT = 256;
export const MSYS_CALLBACK_REASON_RBUTTON_REPEAT = 512;

// Kris:  Nov 31, 1999
// Added support for double clicks.  The DOUBLECLICK event is passed combined with
// the LBUTTON_DWN event if two LBUTTON_DWN events are detected on the same button/region
// within the delay defined by MSYS_DOUBLECLICK_DELAY (in milliseconds).  If your button/region
// supports double clicks and single clicks, make sure the DOUBLECLICK event is checked first (rejecting
// the LBUTTON_DWN event if detected)
export const MSYS_CALLBACK_REASON_LBUTTON_DOUBLECLICK = 1024;

// Mouse grabbing return codes
export const MSYS_GRABBED_OK = 0;
export const MSYS_ALREADY_GRABBED = 1;
export const MSYS_REGION_NOT_IN_LIST = 2;

// *****************************************************************************
//
//				Prototypes
//
// *****************************************************************************

// *****************************************************************************

// Note:
//		The prototype for MSYS_SGP_Mouse_Handler_Hook() is defined in mousesystem_macros.h

// *****************************************************************************

// EOF *************************************************************************

}
