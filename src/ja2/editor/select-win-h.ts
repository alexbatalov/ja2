namespace ja2 {

export const CANCEL_ICON = 0;
export const UP_ICON = 1;
export const DOWN_ICON = 2;
export const OK_ICON = 3;

// defines for DisplaySpec.ubType

const DISPLAY_TEXT = 1;
export const DISPLAY_GRAPHIC = 2;

export const ONE_COLUMN = 0x0001;
export const ONE_ROW = 0x0002;
export const CLEAR_BACKGROUND = 0x0004;

export const DISPLAY_ALL_OBJECTS = 0xffff;

export const MAX_SELECTIONS = 120;

export const enum Enum59 {
  SELWIN_SINGLEWALL,
  SELWIN_SINGLEDOOR,
  SELWIN_SINGLEWINDOW,
  SELWIN_SINGLEROOF,
  SELWIN_SINGLENEWROOF,
  SELWIN_SINGLEBROKENWALL,
  SELWIN_SINGLEDECOR,
  SELWIN_SINGLEDECAL,
  SELWIN_SINGLEFLOOR,
  SELWIN_SINGLETOILET,

  SELWIN_ROOM,
  SELWIN_BANKS,
  SELWIN_ROADS,
  SELWIN_DEBRIS,
  SELWIN_OSTRUCTS,
  SELWIN_OSTRUCTS1,
  SELWIN_OSTRUCTS2,
}

export interface DisplaySpec {
  ubType: UINT8;
  /* union { */
  /*   struct { */
  hVObject: HVOBJECT;
  usStart: UINT16;
  usEnd: UINT16;
  uiObjIndx: UINT32;
  /*   } */
  /*   struct { */
  pString: string /* Pointer<UINT16> */;
  /*   } */
  /* } */
}

export interface DisplayList {
  hObj: HVOBJECT;
  uiIndex: UINT16;
  iX: INT16;
  iY: INT16;
  iWidth: INT16;
  iHeight: INT16;
  uiObjIndx: UINT32;
  fChosen: boolean;
  pNext: DisplayList | null /* Pointer<DisplayList> */;
}

export interface Selections {
  uiObject: UINT32;
  usIndex: UINT16;
  sCount: INT16;
}

export function createSelectionsFrom(uiObject: UINT32, usIndex: UINT16, sCount: INT16): Selections {
  return {
    uiObject,
    usIndex,
    sCount,
  };
}

}
