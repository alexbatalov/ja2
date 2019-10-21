const MAX_POPUP_BOX_COUNT = 20;
const MAX_POPUP_BOX_STRING_COUNT = 50; // worst case = 45: move menu with 20 soldiers, each on different squad + overhead

// PopUpBox Flags
const POPUP_BOX_FLAG_CLIP_TEXT = 1;
const POPUP_BOX_FLAG_CENTER_TEXT = 2;
const POPUP_BOX_FLAG_RESIZE = 4;
const POPUP_BOX_FLAG_CAN_HIGHLIGHT_SHADED_LINES = 8;
interface POPUPSTRING {
  pString: STR16;
  ubForegroundColor: UINT8;
  ubBackgroundColor: UINT8;
  ubHighLight: UINT8;
  ubShade: UINT8;
  ubSecondaryShade: UINT8;
  uiFont: UINT32;
  fColorFlag: BOOLEAN;
  fHighLightFlag: BOOLEAN;
  fShadeFlag: BOOLEAN;
  fSecondaryShadeFlag: BOOLEAN;
}

type POPUPSTRINGPTR = Pointer<POPUPSTRING>;

interface PopUpBo {
  Dimensions: SGPRect;
  Position: SGPPoint;
  uiLeftMargin: UINT32;
  uiRightMargin: UINT32;
  uiBottomMargin: UINT32;
  uiTopMargin: UINT32;
  uiLineSpace: UINT32;
  iBorderObjectIndex: INT32;
  iBackGroundSurface: INT32;
  uiFlags: UINT32;
  uiBuffer: UINT32;
  uiSecondColumnMinimunOffset: UINT32;
  uiSecondColumnCurrentOffset: UINT32;
  uiBoxMinWidth: UINT32;
  fUpdated: BOOLEAN;
  fShowBox: BOOLEAN;

  Text: POPUPSTRINGPTR[] /* [MAX_POPUP_BOX_STRING_COUNT] */;
  pSecondColumnString: POPUPSTRINGPTR[] /* [MAX_POPUP_BOX_STRING_COUNT] */;
}

type PopUpBoxPt = Pointer<PopUpBo>;

static PopUpBoxPt PopUpBoxList[MAX_POPUP_BOX_COUNT];
static UINT32 guiCurrentBox;
