namespace ja2 {

export const MAX_POPUP_BOX_COUNT = 20;
export const MAX_POPUP_BOX_STRING_COUNT = 50; // worst case = 45: move menu with 20 soldiers, each on different squad + overhead

// PopUpBox Flags
export const POPUP_BOX_FLAG_CLIP_TEXT = 1;
export const POPUP_BOX_FLAG_CENTER_TEXT = 2;
export const POPUP_BOX_FLAG_RESIZE = 4;
const POPUP_BOX_FLAG_CAN_HIGHLIGHT_SHADED_LINES = 8;
export interface POPUPSTRING {
  pString: string /* STR16 */;
  ubForegroundColor: UINT8;
  ubBackgroundColor: UINT8;
  ubHighLight: UINT8;
  ubShade: UINT8;
  ubSecondaryShade: UINT8;
  uiFont: UINT32;
  fColorFlag: boolean;
  fHighLightFlag: boolean;
  fShadeFlag: boolean;
  fSecondaryShadeFlag: boolean;
}

export function createPopUpString(): POPUPSTRING {
  return {
    pString: '',
    ubForegroundColor: 0,
    ubBackgroundColor: 0,
    ubHighLight: 0,
    ubShade: 0,
    ubSecondaryShade: 0,
    uiFont: 0,
    fColorFlag: false,
    fHighLightFlag: false,
    fShadeFlag: false,
    fSecondaryShadeFlag: false,
  };
}

export interface PopUpBo {
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
  fUpdated: boolean;
  fShowBox: boolean;

  Text: POPUPSTRING[] /* POPUPSTRINGPTR[MAX_POPUP_BOX_STRING_COUNT] */;
  pSecondColumnString: POPUPSTRING[] /* POPUPSTRINGPTR[MAX_POPUP_BOX_STRING_COUNT] */;
}

export function createPopUpBo(): PopUpBo {
  return {
    Dimensions: createSGPRect(),
    Position: createSGPPoint(),
    uiLeftMargin: 0,
    uiRightMargin: 0,
    uiBottomMargin: 0,
    uiTopMargin: 0,
    uiLineSpace: 0,
    iBorderObjectIndex: 0,
    iBackGroundSurface: 0,
    uiFlags: 0,
    uiBuffer: 0,
    uiSecondColumnMinimunOffset: 0,
    uiSecondColumnCurrentOffset: 0,
    uiBoxMinWidth: 0,
    fUpdated: false,
    fShowBox: false,
    Text: createArray(MAX_POPUP_BOX_STRING_COUNT, <POPUPSTRING><unknown>null),
    pSecondColumnString: createArray(MAX_POPUP_BOX_STRING_COUNT, <POPUPSTRING><unknown>null),
  };
}

}
