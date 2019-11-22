namespace ja2 {

let rStart: DOUBLE;
let rEnd: DOUBLE;
let rActual: DOUBLE;

const MAX_PROGRESSBARS = 4;

let pBar: (PROGRESSBAR | null)[] /* Pointer<PROGRESSBAR>[MAX_PROGRESSBARS] */ = createArray(MAX_PROGRESSBARS, <PROGRESSBAR><unknown>null);

let gfUseLoadScreenProgressBar: boolean = false;
let gusLeftmostShaded: UINT16 = 0;

export function CreateLoadingScreenProgressBar(): void {
  gusLeftmostShaded = 162;
  gfUseLoadScreenProgressBar = true;
  CreateProgressBar(0, 162, 427, 480, 443);
}

export function RemoveLoadingScreenProgressBar(): void {
  gfUseLoadScreenProgressBar = false;
  RemoveProgressBar(0);
  SetFontShadow(DEFAULT_SHADOW);
}

// This creates a single progress bar given the coordinates without a panel (containing a title and background).
// A panel is automatically created if you specify a title using SetProgressBarTitle
export function CreateProgressBar(ubProgressBarID: UINT8, usLeft: UINT16, usTop: UINT16, usRight: UINT16, usBottom: UINT16): boolean {
  let pNew: PROGRESSBAR;
  // Allocate new progress bar
  pNew = createProgressBar();
  Assert(pNew);

  if (pBar[ubProgressBarID])
    RemoveProgressBar(ubProgressBarID);

  pBar[ubProgressBarID] = pNew;
  pNew.ubProgressBarID = ubProgressBarID;
  // Assign coordinates
  pNew.usBarLeft = usLeft;
  pNew.usBarTop = usTop;
  pNew.usBarRight = usRight;
  pNew.usBarBottom = usBottom;
  // Init default data
  pNew.fPanel = false;
  pNew.usMsgFont = FONT12POINT1();
  pNew.ubMsgFontForeColor = FONT_BLACK;
  pNew.ubMsgFontShadowColor = 0;
  SetRelativeStartAndEndPercentage(pNew.ubProgressBarID, 0, 100, '');
  pNew.swzTitle = '';

  // Default the progress bar's color to be red
  pNew.ubColorFillRed = 150;
  pNew.ubColorFillGreen = 0;
  pNew.ubColorFillBlue = 0;

  pNew.fDisplayText = false;

  return true;
}

// You may also define a panel to go in behind the progress bar.  You can now assign a title to go with
// the panel.
export function DefineProgressBarPanel(ubID: UINT32, r: UINT8, g: UINT8, b: UINT8, usLeft: UINT16, usTop: UINT16, usRight: UINT16, usBottom: UINT16): void {
  let pCurr: PROGRESSBAR | null;
  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];
  if (!pCurr)
    return;

  pCurr.fPanel = true;
  pCurr.usPanelLeft = usLeft;
  pCurr.usPanelTop = usTop;
  pCurr.usPanelRight = usRight;
  pCurr.usPanelBottom = usBottom;
  pCurr.usColor = Get16BPPColor(FROMRGB(r, g, b));
  // Calculate the slightly lighter and darker versions of the same rgb color
  pCurr.usLtColor = Get16BPPColor(FROMRGB(Math.min(255, (r * 1.33)), Math.min(255, (g * 1.33)), Math.min(255, (b * 1.33))));
  pCurr.usDkColor = Get16BPPColor(FROMRGB((r * 0.75), (g * 0.75), (b * 0.75)));
}

// Assigning a title for the panel will automatically position the text horizontally centered on the
// panel and vertically centered from the top of the panel, to the top of the progress bar.
export function SetProgressBarTitle(ubID: UINT32, pString: string /* Pointer<UINT16> */, usFont: UINT32, ubForeColor: UINT8, ubShadowColor: UINT8): void {
  let pCurr: PROGRESSBAR | null;
  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];
  if (!pCurr)
    return;
  if (pCurr.swzTitle) {
    pCurr.swzTitle = '';
  }
  if (pString && pString.length) {
    pCurr.swzTitle = pString;
  }
  pCurr.usTitleFont = usFont;
  pCurr.ubTitleFontForeColor = ubForeColor;
  pCurr.ubTitleFontShadowColor = ubShadowColor;
}

// Unless you set up the attributes, any text you pass to SetRelativeStartAndEndPercentage will
// default to FONT12POINT1 in a black color.
export function SetProgressBarMsgAttributes(ubID: UINT32, usFont: UINT32, ubForeColor: UINT8, ubShadowColor: UINT8): void {
  let pCurr: PROGRESSBAR | null;
  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];
  if (!pCurr)
    return;
  pCurr.usMsgFont = usFont;
  pCurr.ubMsgFontForeColor = ubForeColor;
  pCurr.ubMsgFontShadowColor = ubShadowColor;
}

// When finished, the progress bar needs to be removed.
export function RemoveProgressBar(ubID: UINT8): void {
  Assert(ubID < MAX_PROGRESSBARS);
  if (pBar[ubID]) {
    pBar[ubID] = null;
    return;
  }
}

// An important setup function.  The best explanation is through example.  The example being the loading
// of a file -- there are many stages of the map loading.  In JA2, the first step is to load the tileset.
// Because it is a large chunk of the total loading of the map, we may gauge that it takes up 30% of the
// total load.  Because it is also at the beginning, we would pass in the arguments ( 0, 30, "text" ).
// As the process animates using UpdateProgressBar( 0 to 100 ), the total progress bar will only reach 30%
// at the 100% mark within UpdateProgressBar.  At that time, you would go onto the next step, resetting the
// relative start and end percentage from 30 to whatever, until your done.
export function SetRelativeStartAndEndPercentage(ubID: UINT8, uiRelStartPerc: UINT32, uiRelEndPerc: UINT32, str: string /* Pointer<UINT16> */): void {
  let pCurr: PROGRESSBAR | null;
  let usStartX: UINT16;
  let usStartY: UINT16;

  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];
  if (!pCurr)
    return;

  pCurr.rStart = uiRelStartPerc * 0.01;
  pCurr.rEnd = uiRelEndPerc * 0.01;

  // Render the entire panel now, as it doesn't need update during the normal rendering
  if (pCurr.fPanel) {
    // Draw panel
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.usPanelLeft, pCurr.usPanelTop, pCurr.usPanelRight, pCurr.usPanelBottom, pCurr.usLtColor);
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.usPanelLeft + 1, pCurr.usPanelTop + 1, pCurr.usPanelRight, pCurr.usPanelBottom, pCurr.usDkColor);
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.usPanelLeft + 1, pCurr.usPanelTop + 1, pCurr.usPanelRight - 1, pCurr.usPanelBottom - 1, pCurr.usColor);
    InvalidateRegion(pCurr.usPanelLeft, pCurr.usPanelTop, pCurr.usPanelRight, pCurr.usPanelBottom);
    // Draw title

    if (pCurr.swzTitle) {
      usStartX = pCurr.usPanelLeft + // left position
                 (pCurr.usPanelRight - pCurr.usPanelLeft) / 2 - // + half width
                 StringPixLength(pCurr.swzTitle, pCurr.usTitleFont) / 2; // - half string width
      usStartY = pCurr.usPanelTop + 3;
      SetFont(pCurr.usTitleFont);
      SetFontForeground(pCurr.ubTitleFontForeColor);
      SetFontShadow(pCurr.ubTitleFontShadowColor);
      SetFontBackground(0);
      mprintf(usStartX, usStartY, pCurr.swzTitle);
    }
  }

  if (pCurr.fDisplayText) {
    // Draw message
    if (str) {
      if (pCurr.fUseSaveBuffer) {
        let usFontHeight: UINT16 = GetFontHeight(pCurr.usMsgFont);

        RestoreExternBackgroundRect(pCurr.usBarLeft, pCurr.usBarBottom, (pCurr.usBarRight - pCurr.usBarLeft), (usFontHeight + 3));
      }

      SetFont(pCurr.usMsgFont);
      SetFontForeground(pCurr.ubMsgFontForeColor);
      SetFontShadow(pCurr.ubMsgFontShadowColor);
      SetFontBackground(0);
      mprintf(pCurr.usBarLeft, pCurr.usBarBottom + 3, str);
    }
  }
}

// This part renders the progress bar at the percentage level that you specify.  If you have set relative
// percentage values in the above function, then the uiPercentage will be reflected based off of the relative
// percentages.
export function RenderProgressBar(ubID: UINT8, uiPercentage: UINT32): void {
  /* static */ let uiLastTime: UINT32 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();
  let rActual: DOUBLE;
  let pCurr: PROGRESSBAR | null = null;
  // UINT32 r, g;
  let end: INT32;

  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];

  if (pCurr == null)
    return;

  if (pCurr) {
    rActual = pCurr.rStart + (pCurr.rEnd - pCurr.rStart) * uiPercentage * 0.01;

    if (rActual - pCurr.rLastActual < 0.01) {
      return;
    }

    pCurr.rLastActual = ((rActual * 100) * 0.01);

    end = (pCurr.usBarLeft + 2.0 + rActual * (pCurr.usBarRight - pCurr.usBarLeft - 4));
    if (end < pCurr.usBarLeft + 2 || end > pCurr.usBarRight - 2) {
      return;
    }
    if (gfUseLoadScreenProgressBar) {
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.usBarLeft, pCurr.usBarTop, end, pCurr.usBarBottom, Get16BPPColor(FROMRGB(pCurr.ubColorFillRed, pCurr.ubColorFillGreen, pCurr.ubColorFillBlue)));
      // if( pCurr->usBarRight > gusLeftmostShaded )
      //{
      //	ShadowVideoSurfaceRect( FRAME_BUFFER, gusLeftmostShaded+1, pCurr->usBarTop, end, pCurr->usBarBottom );
      //	gusLeftmostShaded = (UINT16)end;
      //}
    } else {
      // Border edge of the progress bar itself in gray
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.usBarLeft, pCurr.usBarTop, pCurr.usBarRight, pCurr.usBarBottom, Get16BPPColor(FROMRGB(160, 160, 160)));
      // Interior of progress bar in black
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.usBarLeft + 2, pCurr.usBarTop + 2, pCurr.usBarRight - 2, pCurr.usBarBottom - 2, Get16BPPColor(FROMRGB(0, 0, 0)));
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.usBarLeft + 2, pCurr.usBarTop + 2, end, pCurr.usBarBottom - 2, Get16BPPColor(FROMRGB(72, 155, 24)));
    }
    InvalidateRegion(pCurr.usBarLeft, pCurr.usBarTop, pCurr.usBarRight, pCurr.usBarBottom);
    ExecuteBaseDirtyRectQueue();
    EndFrameBufferRender();
    RefreshScreen(null);
  }

  // update music here
  if (uiCurTime > (uiLastTime + 200)) {
    MusicPoll(true);
    uiLastTime = GetJA2Clock();
  }
}

export function SetProgressBarColor(ubID: UINT8, ubColorFillRed: UINT8, ubColorFillGreen: UINT8, ubColorFillBlue: UINT8): void {
  let pCurr: PROGRESSBAR | null = null;

  Assert(ubID < MAX_PROGRESSBARS);

  pCurr = pBar[ubID];
  if (pCurr == null)
    return;

  pCurr.ubColorFillRed = ubColorFillRed;
  pCurr.ubColorFillGreen = ubColorFillGreen;
  pCurr.ubColorFillBlue = ubColorFillBlue;
}

function SetProgressBarTextDisplayFlag(ubID: UINT8, fDisplayText: boolean, fUseSaveBuffer: boolean, fSaveScreenToFrameBuffer: boolean): void {
  let pCurr: PROGRESSBAR | null = null;

  Assert(ubID < MAX_PROGRESSBARS);

  pCurr = pBar[ubID];
  if (pCurr == null)
    return;

  pCurr.fDisplayText = fDisplayText;

  pCurr.fUseSaveBuffer = fUseSaveBuffer;

  // if we are to use the save buffer, blit the portion of the screen to the save buffer
  if (fSaveScreenToFrameBuffer) {
    let usFontHeight: UINT16 = GetFontHeight(pCurr.usMsgFont) + 3;

    // blit everything to the save buffer ( cause the save buffer can bleed through )
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, pCurr.usBarLeft, pCurr.usBarBottom, (pCurr.usBarRight - pCurr.usBarLeft), usFontHeight);
  }
}

}
