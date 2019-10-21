const CANCEL_ICON = 0;
const UP_ICON = 1;
const DOWN_ICON = 2;
const OK_ICON = 3;

extern INT32 iButtonIcons[4];
extern INT32 iSelectWin, iCancelWin, iScrollUp, iScrollDown;

extern BOOLEAN fAllDone;

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

extern INT32 iCurBank;
extern Selections *pSelList;
extern INT32 *pNumSelList;

extern Selections SelOStructs[MAX_SELECTIONS];
extern Selections SelOStructs1[MAX_SELECTIONS];
extern Selections SelOStructs2[MAX_SELECTIONS];
extern Selections SelBanks[MAX_SELECTIONS];
extern Selections SelRoads[MAX_SELECTIONS];
extern Selections SelDebris[MAX_SELECTIONS];

extern Selections SelSingleWall[MAX_SELECTIONS];
extern Selections SelSingleDoor[MAX_SELECTIONS];
extern Selections SelSingleWindow[MAX_SELECTIONS];
extern Selections SelSingleRoof[MAX_SELECTIONS];
extern Selections SelSingleNewRoof[MAX_SELECTIONS];
extern Selections SelSingleBrokenWall[MAX_SELECTIONS];
extern Selections SelSingleDecor[MAX_SELECTIONS];
extern Selections SelSingleDecal[MAX_SELECTIONS];
extern Selections SelSingleFloor[MAX_SELECTIONS];
extern Selections SelSingleToilet[MAX_SELECTIONS];

extern Selections SelRoom[MAX_SELECTIONS];

extern INT32 iNumOStructsSelected;
extern INT32 iNumOStructs1Selected;
extern INT32 iNumOStructs2Selected;
extern INT32 iNumBanksSelected;
extern INT32 iNumRoadsSelected;
extern INT32 iNumDebrisSelected;
extern INT32 iNumWallsSelected;
extern INT32 iNumDoorsSelected;
extern INT32 iNumWindowsSelected;
extern INT32 iNumDecorSelected;
extern INT32 iNumDecalsSelected;
extern INT32 iNumBrokenWallsSelected;
extern INT32 iNumFloorsSelected;
extern INT32 iNumToiletsSelected;
extern INT32 iNumRoofsSelected;
extern INT32 iNumNewRoofsSelected;
extern INT32 iNumRoomsSelected;

extern INT32 iDrawMode;
