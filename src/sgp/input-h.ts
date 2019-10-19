const SCAN_CODE_MASK = 0xff0000;
const EXT_CODE_MASK = 0x01000000;
const TRANSITION_MASK = 0x80000000;

const KEY_DOWN = 0x0001;
const KEY_UP = 0x0002;
const KEY_REPEAT = 0x0004;
const LEFT_BUTTON_DOWN = 0x0008;
const LEFT_BUTTON_UP = 0x0010;
const LEFT_BUTTON_DBL_CLK = 0x0020;
const LEFT_BUTTON_REPEAT = 0x0040;
const RIGHT_BUTTON_DOWN = 0x0080;
const RIGHT_BUTTON_UP = 0x0100;
const RIGHT_BUTTON_REPEAT = 0x0200;
const MOUSE_POS = 0x0400;
const MOUSE_WHEEL = 0x0800;

const SHIFT_DOWN = 0x01;
const CTRL_DOWN = 0x02;
const ALT_DOWN = 0x04;

const MAX_STRING_INPUT = 64;
const DBL_CLK_TIME = 300; // Increased by Alex, Jun-10-97, 200 felt too short
const BUTTON_REPEAT_TIMEOUT = 250;
const BUTTON_REPEAT_TIME = 50;

typedef struct {
  UINT32 uiTimeStamp;
  UINT16 usKeyState;
  UINT16 usEvent;
  UINT32 usParam;
  UINT32 uiParam;
} InputAtom;

// Mouse pos extracting macros from InputAtom
const GETYPOS = (a) => HIWORD(((a)->uiParam));
const GETXPOS = (a) => LOWORD(((a)->uiParam));

typedef struct StringInput {
  UINT16 *pString;
  UINT16 *pOriginalString;
  UINT16 *pFilter;
  UINT16 usMaxStringLength;
  UINT16 usCurrentStringLength;
  UINT16 usStringOffset;
  UINT16 usLastCharacter;
  BOOLEAN fInsertMode;
  BOOLEAN fFocus;
  struct StringInput *pPreviousString;
  struct StringInput *pNextString;
} StringInput;

extern BOOLEAN InitializeInputManager(void);
extern void ShutdownInputManager(void);
extern BOOLEAN DequeueEvent(InputAtom *Event);
extern void QueueEvent(UINT16 ubInputEvent, UINT32 usParam, UINT32 uiParam);

extern void KeyDown(UINT32 usParam, UINT32 uiParam);
extern void KeyUp(UINT32 usParam, UINT32 uiParam);

extern void EnableDoubleClk(void);
extern void DisableDoubleClk(void);
extern void GetMousePos(SGPPoint *Point);

extern StringInput *InitStringInput(UINT16 *pInputString, UINT16 usLength, UINT16 *pFilter);
extern void LinkPreviousString(StringInput *pCurrentString, StringInput *pPreviousString);
extern void LinkNextString(StringInput *pCurrentString, StringInput *pNextString);
extern UINT16 GetStringLastInput(void);
extern BOOLEAN StringInputHasFocus(void);
extern BOOLEAN SetStringFocus(StringInput *pStringDescriptor);
extern UINT16 GetCursorPositionInString(StringInput *pStringDescriptor);
extern UINT16 GetStringInputState(void);
extern BOOLEAN StringHasFocus(StringInput *pStringDescriptor);
extern UINT16 *GetString(StringInput *pStringDescriptor);
extern void EndStringInput(StringInput *pStringDescriptor);
extern BOOLEAN DequeueSpecificEvent(InputAtom *Event, UINT32 uiMaskFlags);

extern void RestrictMouseToXYXY(UINT16 usX1, UINT16 usY1, UINT16 usX2, UINT16 usY2);
extern void RestrictMouseCursor(SGPRect *pRectangle);
extern void FreeMouseCursor(void);
extern BOOLEAN IsCursorRestricted(void);
extern void GetRestrictedClipCursor(SGPRect *pRectangle);
extern void RestoreCursorClipRect(void);

void SimulateMouseMovement(UINT32 uiNewXPos, UINT32 uiNewYPos);
BOOLEAN InputEventInside(InputAtom *Event, UINT32 uiX1, UINT32 uiY1, UINT32 uiX2, UINT32 uiY2);

INT16 GetMouseWheelDeltaValue(UINT32 wParam);

extern void DequeueAllKeyBoardEvents();

extern BOOLEAN gfKeyState[256]; // TRUE = Pressed, FALSE = Not Pressed

extern UINT16 gusMouseXPos; // X position of the mouse on screen
extern UINT16 gusMouseYPos; // y position of the mouse on screen
extern BOOLEAN gfLeftButtonState; // TRUE = Pressed, FALSE = Not Pressed
extern BOOLEAN gfRightButtonState; // TRUE = Pressed, FALSE = Not Pressed

extern BOOLEAN gfSGPInputReceived;

const _KeyDown = (a) => gfKeyState[(a)];
const _LeftButtonDown = () => gfLeftButtonState;
const _RightButtonDown = () => gfRightButtonState;
const _MouseXPos = () => gusMouseXPos;
const _MouseYPos = () => gusMouseYPos;

// NOTE: this may not be the absolute most-latest current mouse co-ordinates, use GetCursorPos for that
const _gusMouseInside = (x1, y1, x2, y2) => ((gusMouseXPos >= x1) && (gusMouseXPos <= x2) && (gusMouseYPos >= y1) && (gusMouseYPos <= y2));

const _EvType = (a) => ((InputAtom *)(a))->usEvent;
const _EvTimeStamp = (a) => ((InputAtom *)(a))->uiTimeStamp;
const _EvKey = (a) => ((InputAtom *)(a))->usParam;
const _EvMouseX = (a) => (UINT16)(((InputAtom *)(a))->uiParam & 0x0000ffff);
const _EvMouseY = (a) => (UINT16)((((InputAtom *)(a))->uiParam & 0xffff0000) >> 16);
const _EvShiftDown = (a) => (((InputAtom *)(a))->usKeyState & SHIFT_DOWN);
const _EvCtrlDown = (a) => (((InputAtom *)(a))->usKeyState & CTRL_DOWN);
const _EvAltDown = (a) => (((InputAtom *)(a))->usKeyState & ALT_DOWN);
