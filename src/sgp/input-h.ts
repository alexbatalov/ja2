namespace ja2 {

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

export function createInputAtom(): InputAtom {
  return {
    uiTimeStamp: 0,
    usKeyState: 0,
    usEvent: 0,
    usParam: 0,
    uiParam: 0,
  };
}

export function copyInputAtom(destination: InputAtom, source: InputAtom) {
  destination.uiTimeStamp = source.uiTimeStamp;
  destination.usKeyState = source.usKeyState;
  destination.usEvent = source.usEvent;
  destination.usParam = source.usParam;
  destination.uiParam = source.uiParam;
}

export const HIWORD = (n: number) => (n >> 16) & 0xFFFF;
export const LOWORD = (n: number) => n & 0xFFFF;

// Mouse pos extracting macros from InputAtom
const GETYPOS = (a: InputAtom) => HIWORD(a.uiParam);
const GETXPOS = (a: InputAtom) => LOWORD(a.uiParam);

export interface StringInput {
  pString: string /* Pointer<UINT16> */;
  pOriginalString: string /* Pointer<UINT16> */;
  pFilter: string /* Pointer<UINT16> */;
  usMaxStringLength: UINT16;
  usCurrentStringLength: UINT16;
  usStringOffset: UINT16;
  usLastCharacter: UINT16;
  fInsertMode: boolean;
  fFocus: boolean;
  pPreviousString: StringInput | null;
  pNextString: StringInput | null;
}

export function createStringInput(): StringInput {
  return {
    pString: '',
    pOriginalString: '',
    pFilter: '',
    usMaxStringLength: 0,
    usCurrentStringLength: 0,
    usStringOffset: 0,
    usLastCharacter: 0,
    fInsertMode: false,
    fFocus: false,
    pPreviousString: null,
    pNextString: null,
  };
}

export const _KeyDown = (a: number) => gfKeyState[(a)];
export const _LeftButtonDown = () => gfLeftButtonState;
export const _RightButtonDown = () => gfRightButtonState;
const _MouseXPos = () => gusMouseXPos;
const _MouseYPos = () => gusMouseYPos;

// NOTE: this may not be the absolute most-latest current mouse co-ordinates, use GetCursorPos for that
const _gusMouseInside = (x1: number, y1: number, x2: number, y2: number) => ((gusMouseXPos >= x1) && (gusMouseXPos <= x2) && (gusMouseYPos >= y1) && (gusMouseYPos <= y2));

const _EvType = (a: InputAtom) => a.usEvent;
const _EvTimeStamp = (a: InputAtom) => a.uiTimeStamp;
const _EvKey = (a: InputAtom) => a.usParam;
export const _EvMouseX = (a: InputAtom) => (a.uiParam & 0x0000ffff);
export const _EvMouseY = (a: InputAtom) => ((a.uiParam & 0xffff0000) >> 16);
const _EvShiftDown = (a: InputAtom) => (a.usKeyState & SHIFT_DOWN);
const _EvCtrlDown = (a: InputAtom) => (a.usKeyState & CTRL_DOWN);
const _EvAltDown = (a: InputAtom) => (a.usKeyState & ALT_DOWN);

}
