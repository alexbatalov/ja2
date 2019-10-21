const CANCEL_ICON = 0;
const UP_ICON = 1;
const DOWN_ICON = 2;
const OK_ICON = 3;

// defines for DisplaySpec.ubType

const DISPLAY_TEXT = 1;
const DISPLAY_GRAPHIC = 2;

const ONE_COLUMN = 0x0001;
const ONE_ROW = 0x0002;
const CLEAR_BACKGROUND = 0x0004;

const DISPLAY_ALL_OBJECTS = 0xffff;

const MAX_SELECTIONS = 120;

const enum Enum59 {
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

interface DisplaySpec {
  ubType: UINT8;
  /* union { */
  /*   struct { */
  hVObject: HVOBJECT;
  usStart: UINT16;
  usEnd: UINT16;
  uiObjIndx: UINT32;
  /*   } */
  /*   struct { */
  pString: Pointer<UINT16>;
  /*   } */
  /* } */
}

interface DisplayList {
  hObj: HVOBJECT;
  uiIndex: UINT16;
  iX: INT16;
  iY: INT16;
  iWidth: INT16;
  iHeight: INT16;
  uiObjIndx: UINT32;
  fChosen: BOOLEAN;
  pNext: Pointer<DisplayList>;
}

interface Selections {
  uiObject: UINT32;
  usIndex: UINT16;
  sCount: INT16;
}
