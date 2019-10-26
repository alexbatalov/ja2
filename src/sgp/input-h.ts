export const SCAN_CODE_MASK = 0xff0000;
export const EXT_CODE_MASK = 0x01000000;
export const TRANSITION_MASK = 0x80000000;

export const KEY_DOWN = 0x0001;
export const KEY_UP = 0x0002;
export const KEY_REPEAT = 0x0004;
export const LEFT_BUTTON_DOWN = 0x0008;
export const LEFT_BUTTON_UP = 0x0010;
export const LEFT_BUTTON_DBL_CLK = 0x0020;
export const LEFT_BUTTON_REPEAT = 0x0040;
export const RIGHT_BUTTON_DOWN = 0x0080;
export const RIGHT_BUTTON_UP = 0x0100;
export const RIGHT_BUTTON_REPEAT = 0x0200;
export const MOUSE_POS = 0x0400;
export const MOUSE_WHEEL = 0x0800;

export const SHIFT_DOWN = 0x01;
export const CTRL_DOWN = 0x02;
export const ALT_DOWN = 0x04;

const MAX_STRING_INPUT = 64;
export const DBL_CLK_TIME = 300; // Increased by Alex, Jun-10-97, 200 felt too short
export const BUTTON_REPEAT_TIMEOUT = 250;
export const BUTTON_REPEAT_TIME = 50;

export interface InputAtom {
  uiTimeStamp: UINT32;
  usKeyState: UINT16;
  usEvent: UINT16;
  usParam: UINT32;
  uiParam: UINT32;
}

// Mouse pos extracting macros from InputAtom
const GETYPOS = (a) => HIWORD(((a).value.uiParam));
const GETXPOS = (a) => LOWORD(((a).value.uiParam));

export interface StringInput {
  pString: Pointer<UINT16>;
  pOriginalString: Pointer<UINT16>;
  pFilter: Pointer<UINT16>;
  usMaxStringLength: UINT16;
  usCurrentStringLength: UINT16;
  usStringOffset: UINT16;
  usLastCharacter: UINT16;
  fInsertMode: boolean;
  fFocus: boolean;
  pPreviousString: Pointer<StringInput>;
  pNextString: Pointer<StringInput>;
}

export const _KeyDown = (a) => gfKeyState[(a)];
export const _LeftButtonDown = () => gfLeftButtonState;
export const _RightButtonDown = () => gfRightButtonState;
const _MouseXPos = () => gusMouseXPos;
const _MouseYPos = () => gusMouseYPos;

// NOTE: this may not be the absolute most-latest current mouse co-ordinates, use GetCursorPos for that
const _gusMouseInside = (x1, y1, x2, y2) => ((gusMouseXPos >= x1) && (gusMouseXPos <= x2) && (gusMouseYPos >= y1) && (gusMouseYPos <= y2));

const _EvType = (a) => ((a)).value.usEvent;
const _EvTimeStamp = (a) => ((a)).value.uiTimeStamp;
const _EvKey = (a) => ((a)).value.usParam;
export const _EvMouseX = (a) => (((a)).value.uiParam & 0x0000ffff);
export const _EvMouseY = (a) => ((((a)).value.uiParam & 0xffff0000) >> 16);
const _EvShiftDown = (a) => (((a)).value.usKeyState & SHIFT_DOWN);
const _EvCtrlDown = (a) => (((a)).value.usKeyState & CTRL_DOWN);
const _EvAltDown = (a) => (((a)).value.usKeyState & ALT_DOWN);
