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

type MOUSE_CALLBACK = (a: Pointer<MOUSE_REGION>, b: INT32) => void; // Define MOUSE_CALLBACK type as pointer to void
type MOUSE_HELPTEXT_DONE_CALLBACK = () => void; // the help is done callback

interface MOUSE_REGION {
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
  MovementCallback: MOUSE_CALLBACK; // Pointer to callback function if movement occured in this region
  ButtonCallback: MOUSE_CALLBACK; // Pointer to callback function if button action occured in this region
  UserData: INT32[] /* [4] */; // User Data, can be set to anything!

  // Fast help vars.
  FastHelpTimer: INT16; // Countdown timer for FastHelp text
  FastHelpText: Pointer<UINT16>; // Text string for the FastHelp (describes buttons if left there a while)
  FastHelpRect: INT32;
  HelpDoneCallback: MOUSE_HELPTEXT_DONE_CALLBACK;

  next: Pointer<MOUSE_REGION>; // List maintenance, do NOT touch these entries
  prev: Pointer<MOUSE_REGION>;
}

// *****************************************************************************
//
//				Defines
//
// *****************************************************************************

// Mouse Region Flags
const MSYS_NO_FLAGS = 0x00000000;
const MSYS_MOUSE_IN_AREA = 0x00000001;
const MSYS_SET_CURSOR = 0x00000002;
const MSYS_MOVE_CALLBACK = 0x00000004;
const MSYS_BUTTON_CALLBACK = 0x00000008;
const MSYS_REGION_EXISTS = 0x00000010;
const MSYS_SYSTEM_INIT = 0x00000020;
const MSYS_REGION_ENABLED = 0x00000040;
const MSYS_FASTHELP = 0x00000080;
const MSYS_GOT_BACKGROUND = 0x00000100;
const MSYS_HAS_BACKRECT = 0x00000200;
const MSYS_FASTHELP_RESET = 0x00000400;
const MSYS_ALLOW_DISABLED_FASTHELP = 0x00000800;

// Mouse region IDs
const MSYS_ID_BASE = 1;
const MSYS_ID_MAX = 0xfffffff; // ( INT32 max )
const MSYS_ID_SYSTEM = 0;

// Mouse region priorities
const MSYS_PRIORITY_LOWEST = 0;
const MSYS_PRIORITY_LOW = 15;
const MSYS_PRIORITY_BASE = 31;
const MSYS_PRIORITY_NORMAL = 31;
const MSYS_PRIORITY_HIGH = 63;
const MSYS_PRIORITY_HIGHEST = 127;
const MSYS_PRIORITY_SYSTEM = -1;
const MSYS_PRIORITY_AUTO = -1;

// Mouse system defines used during updates
const MSYS_NO_ACTION = 0;
const MSYS_DO_MOVE = 1;
const MSYS_DO_LBUTTON_DWN = 2;
const MSYS_DO_LBUTTON_UP = 4;
const MSYS_DO_RBUTTON_DWN = 8;
const MSYS_DO_RBUTTON_UP = 16;
const MSYS_DO_LBUTTON_REPEAT = 32;
const MSYS_DO_RBUTTON_REPEAT = 64;

const MSYS_DO_BUTTONS = (MSYS_DO_LBUTTON_DWN | MSYS_DO_LBUTTON_UP | MSYS_DO_RBUTTON_DWN | MSYS_DO_RBUTTON_UP | MSYS_DO_RBUTTON_REPEAT | MSYS_DO_LBUTTON_REPEAT);

// Mouse system button masks
const MSYS_LEFT_BUTTON = 1;
const MSYS_RIGHT_BUTTON = 2;

// Mouse system special values
const MSYS_NO_CALLBACK = NULL;
const MSYS_NO_CURSOR = 65534;

// Mouse system callback reasons
const MSYS_CALLBACK_REASON_NONE = 0;
const MSYS_CALLBACK_REASON_INIT = 1;
const MSYS_CALLBACK_REASON_MOVE = 2;
const MSYS_CALLBACK_REASON_LBUTTON_DWN = 4;
const MSYS_CALLBACK_REASON_LBUTTON_UP = 8;
const MSYS_CALLBACK_REASON_RBUTTON_DWN = 16;
const MSYS_CALLBACK_REASON_RBUTTON_UP = 32;
const MSYS_CALLBACK_REASON_BUTTONS = (MSYS_CALLBACK_REASON_LBUTTON_DWN | MSYS_CALLBACK_REASON_LBUTTON_UP | MSYS_CALLBACK_REASON_RBUTTON_DWN | MSYS_CALLBACK_REASON_RBUTTON_UP);
const MSYS_CALLBACK_REASON_LOST_MOUSE = 64;
const MSYS_CALLBACK_REASON_GAIN_MOUSE = 128;

const MSYS_CALLBACK_REASON_LBUTTON_REPEAT = 256;
const MSYS_CALLBACK_REASON_RBUTTON_REPEAT = 512;

// Kris:  Nov 31, 1999
// Added support for double clicks.  The DOUBLECLICK event is passed combined with
// the LBUTTON_DWN event if two LBUTTON_DWN events are detected on the same button/region
// within the delay defined by MSYS_DOUBLECLICK_DELAY (in milliseconds).  If your button/region
// supports double clicks and single clicks, make sure the DOUBLECLICK event is checked first (rejecting
// the LBUTTON_DWN event if detected)
const MSYS_CALLBACK_REASON_LBUTTON_DOUBLECLICK = 1024;

// Mouse grabbing return codes
const MSYS_GRABBED_OK = 0;
const MSYS_ALREADY_GRABBED = 1;
const MSYS_REGION_NOT_IN_LIST = 2;

// *****************************************************************************
//
//				Prototypes
//
// *****************************************************************************

// *****************************************************************************

// Note:
//		The prototype for MSYS_SGP_Mouse_Handler_Hook() is defined in mousesystem_macros.h

// Internal Functions
INT32 MSYS_GetNewID(void);
void MSYS_TrashRegList(void);
void MSYS_AddRegionToList(MOUSE_REGION *region);
INT32 MSYS_RegionInList(MOUSE_REGION *region);
void MSYS_DeleteRegionFromList(MOUSE_REGION *region);
void MSYS_UpdateMouseRegion(void);
void MSYS_SetCurrentCursor(UINT16 Cursor);

// External
INT32 MSYS_Init(void);
void MSYS_Shutdown(void);
void MSYS_DefineRegion(MOUSE_REGION *region, UINT16 tlx, UINT16 tly, UINT16 brx, UINT16 bry, INT8 priority, UINT16 crsr, MOUSE_CALLBACK movecallback, MOUSE_CALLBACK buttoncallback);
void MSYS_ChangeRegionCursor(MOUSE_REGION *region, UINT16 crsr);
INT32 MSYS_AddRegion(MOUSE_REGION *region);
void MSYS_RemoveRegion(MOUSE_REGION *region);
void MSYS_EnableRegion(MOUSE_REGION *region);
void MSYS_DisableRegion(MOUSE_REGION *region);
void MSYS_ChangeRegionPriority(MOUSE_REGION *region, INT8 priority);
void MSYS_SetRegionUserData(MOUSE_REGION *region, INT32 index, INT32 userdata);
INT32 MSYS_GetRegionUserData(MOUSE_REGION *region, INT32 index);

INT32 MSYS_GrabMouse(MOUSE_REGION *region);
void MSYS_ReleaseMouse(MOUSE_REGION *region);
void MSYS_MoveMouseRegionBy(MOUSE_REGION *region, INT16 sDeltaX, INT16 sDeltaY);
void MSYS_MoveMouseRegionTo(MOUSE_REGION *region, INT16 sX, INT16 sY);

void MSYS_AllowDisabledRegionFastHelp(MOUSE_REGION *region, BOOLEAN fAllow);

// This function will force a re-evaluation of mous regions
// Usually used to force change of mouse cursor if panels switch, etc
void RefreshMouseRegions();

void SetRegionFastHelpText(MOUSE_REGION *region, UINT16 *szText);

void SetRegionHelpEndCallback(MOUSE_REGION *region, MOUSE_HELPTEXT_DONE_CALLBACK CallbackFxn);

// Now also used by Wizardry -- DB
void DisplayFastHelp(MOUSE_REGION *region);
void RenderFastHelp();

void SetFastHelpDelay(INT16 sFastHelpDelay);
void EnableMouseFastHelp(void);
void DisableMouseFastHelp(void);

void ResetClickedMode(void);

BOOLEAN SetRegionSavedRect(MOUSE_REGION *region);
void FreeRegionSavedRect(MOUSE_REGION *region);

// *****************************************************************************

// EOF *************************************************************************
