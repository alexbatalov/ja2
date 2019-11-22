namespace ja2 {

const MAX_PROGRESSBARS = 4;

export interface PROGRESSBAR {
  ubProgressBarID: UINT8;

  usBarLeft: UINT16;
  usBarTop: UINT16;
  usBarRight: UINT16;
  usBarBottom: UINT16;

  fPanel: boolean;

  usPanelLeft: UINT16;
  usPanelTop: UINT16;
  usPanelRight: UINT16;
  usPanelBottom: UINT16;

  usColor: UINT16;
  usLtColor: UINT16;
  usDkColor: UINT16;

  swzTitle: string /* Pointer<UINT16> */;
  usTitleFont: UINT16;

  ubTitleFontForeColor: UINT8;
  ubTitleFontShadowColor: UINT8;

  usMsgFont: UINT16;

  ubMsgFontForeColor: UINT8;
  ubMsgFontShadowColor: UINT8;

  ubRelativeStartPercentage: UINT8;
  ubRelativeEndPercentage: UINT8;

  ubColorFillRed: UINT8;
  ubColorFillGreen: UINT8;
  ubColorFillBlue: UINT8;

  rStart: DOUBLE;
  rEnd: DOUBLE;

  fDisplayText: boolean;
  fUseSaveBuffer: boolean; // use the save buffer when display the text
  rLastActual: DOUBLE;
}

export function createProgressBar(): PROGRESSBAR {
  return {
    ubProgressBarID: 0,

    usBarLeft: 0,
    usBarTop: 0,
    usBarRight: 0,
    usBarBottom: 0,

    fPanel: false,

    usPanelLeft: 0,
    usPanelTop: 0,
    usPanelRight: 0,
    usPanelBottom: 0,

    usColor: 0,
    usLtColor: 0,
    usDkColor: 0,

    swzTitle: '',
    usTitleFont: 0,

    ubTitleFontForeColor: 0,
    ubTitleFontShadowColor: 0,

    usMsgFont: 0,

    ubMsgFontForeColor: 0,
    ubMsgFontShadowColor: 0,

    ubRelativeStartPercentage: 0,
    ubRelativeEndPercentage: 0,

    ubColorFillRed: 0,
    ubColorFillGreen: 0,
    ubColorFillBlue: 0,

    rStart: 0,
    rEnd: 0,

    fDisplayText: false,
    fUseSaveBuffer: false,
    rLastActual: 0,
  };
}

}
