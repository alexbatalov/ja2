const MAX_PROGRESSBARS = 4;

interface PROGRESSBAR {
  ubProgressBarID: UINT8;

  usBarLeft: UINT16;
  usBarTop: UINT16;
  usBarRight: UINT16;
  usBarBottom: UINT16;

  fPanel: BOOLEAN;

  usPanelLeft: UINT16;
  usPanelTop: UINT16;
  usPanelRight: UINT16;
  usPanelBottom: UINT16;

  usColor: UINT16;
  usLtColor: UINT16;
  usDkColor: UINT16;

  swzTitle: Pointer<UINT16>;
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

  rStart: double;
  rEnd: double;

  fDisplayText: BOOLEAN;
  fUseSaveBuffer: BOOLEAN; // use the save buffer when display the text
  rLastActual: double;
}
