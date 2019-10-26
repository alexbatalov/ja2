namespace ja2 {

export const MERC_POPUP_PREPARE_FLAGS_TRANS_BACK = 0x00000001;
export const MERC_POPUP_PREPARE_FLAGS_MARGINS = 0x00000002;
export const MERC_POPUP_PREPARE_FLAGS_STOPICON = 0x00000004;
export const MERC_POPUP_PREPARE_FLAGS_SKULLICON = 0x00000008;

export interface MercPopUpBox {
  uiSourceBufferIndex: UINT32;
  sWidth: UINT16;
  sHeight: UINT16;
  ubBackgroundIndex: UINT8;
  ubBorderIndex: UINT8;
  uiMercTextPopUpBackground: UINT32;
  uiMercTextPopUpBorder: UINT32;
  fMercTextPopupInitialized: boolean;
  fMercTextPopupSurfaceInitialized: boolean;
  uiFlags: UINT32;
}

// background enumeration
export const enum Enum324 {
  BASIC_MERC_POPUP_BACKGROUND = 0,
  WHITE_MERC_POPUP_BACKGROUND,
  GREY_MERC_POPUP_BACKGROUND,
  DIALOG_MERC_POPUP_BACKGROUND,
  LAPTOP_POPUP_BACKGROUND,
  IMP_POPUP_BACKGROUND,
}

// border enumeration
export const enum Enum325 {
  BASIC_MERC_POPUP_BORDER = 0,
  RED_MERC_POPUP_BORDER,
  BLUE_MERC_POPUP_BORDER,
  DIALOG_MERC_POPUP_BORDER,
  LAPTOP_POP_BORDER,
}

}
