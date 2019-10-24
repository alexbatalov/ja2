let rStart: double;
let rEnd: double;
let rActual: double;

const MAX_PROGRESSBARS = 4;

let pBar: Pointer<PROGRESSBAR>[] /* [MAX_PROGRESSBARS] */;

let gfUseLoadScreenProgressBar: BOOLEAN = FALSE;
let gusLeftmostShaded: UINT16 = 0;

function CreateLoadingScreenProgressBar(): void {
  gusLeftmostShaded = 162;
  gfUseLoadScreenProgressBar = TRUE;
  CreateProgressBar(0, 162, 427, 480, 443);
}

function RemoveLoadingScreenProgressBar(): void {
  gfUseLoadScreenProgressBar = FALSE;
  RemoveProgressBar(0);
  SetFontShadow(DEFAULT_SHADOW);
}

// This creates a single progress bar given the coordinates without a panel (containing a title and background).
// A panel is automatically created if you specify a title using SetProgressBarTitle
function CreateProgressBar(ubProgressBarID: UINT8, usLeft: UINT16, usTop: UINT16, usRight: UINT16, usBottom: UINT16): BOOLEAN {
  let pNew: Pointer<PROGRESSBAR>;
  // Allocate new progress bar
  pNew = MemAlloc(sizeof(PROGRESSBAR));
  Assert(pNew);

  if (pBar[ubProgressBarID])
    RemoveProgressBar(ubProgressBarID);

  memset(pNew, 0, sizeof(PROGRESSBAR));

  pBar[ubProgressBarID] = pNew;
  pNew.value.ubProgressBarID = ubProgressBarID;
  // Assign coordinates
  pNew.value.usBarLeft = usLeft;
  pNew.value.usBarTop = usTop;
  pNew.value.usBarRight = usRight;
  pNew.value.usBarBottom = usBottom;
  // Init default data
  pNew.value.fPanel = FALSE;
  pNew.value.usMsgFont = FONT12POINT1();
  pNew.value.ubMsgFontForeColor = FONT_BLACK;
  pNew.value.ubMsgFontShadowColor = 0;
  SetRelativeStartAndEndPercentage(pNew.value.ubProgressBarID, 0, 100, NULL);
  pNew.value.swzTitle = NULL;

  // Default the progress bar's color to be red
  pNew.value.ubColorFillRed = 150;
  pNew.value.ubColorFillGreen = 0;
  pNew.value.ubColorFillBlue = 0;

  pNew.value.fDisplayText = FALSE;

  return TRUE;
}

// You may also define a panel to go in behind the progress bar.  You can now assign a title to go with
// the panel.
function DefineProgressBarPanel(ubID: UINT32, r: UINT8, g: UINT8, b: UINT8, usLeft: UINT16, usTop: UINT16, usRight: UINT16, usBottom: UINT16): void {
  let pCurr: Pointer<PROGRESSBAR>;
  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];
  if (!pCurr)
    return;

  pCurr.value.fPanel = TRUE;
  pCurr.value.usPanelLeft = usLeft;
  pCurr.value.usPanelTop = usTop;
  pCurr.value.usPanelRight = usRight;
  pCurr.value.usPanelBottom = usBottom;
  pCurr.value.usColor = Get16BPPColor(FROMRGB(r, g, b));
  // Calculate the slightly lighter and darker versions of the same rgb color
  pCurr.value.usLtColor = Get16BPPColor(FROMRGB(min(255, (r * 1.33)), min(255, (g * 1.33)), min(255, (b * 1.33))));
  pCurr.value.usDkColor = Get16BPPColor(FROMRGB((r * 0.75), (g * 0.75), (b * 0.75)));
}

// Assigning a title for the panel will automatically position the text horizontally centered on the
// panel and vertically centered from the top of the panel, to the top of the progress bar.
function SetProgressBarTitle(ubID: UINT32, pString: Pointer<UINT16>, usFont: UINT32, ubForeColor: UINT8, ubShadowColor: UINT8): void {
  let pCurr: Pointer<PROGRESSBAR>;
  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];
  if (!pCurr)
    return;
  if (pCurr.value.swzTitle) {
    MemFree(pCurr.value.swzTitle);
    pCurr.value.swzTitle = NULL;
  }
  if (pString && wcslen(pString)) {
    pCurr.value.swzTitle = MemAlloc(sizeof(UINT16) * (wcslen(pString) + 1));
    swprintf(pCurr.value.swzTitle, pString);
  }
  pCurr.value.usTitleFont = usFont;
  pCurr.value.ubTitleFontForeColor = ubForeColor;
  pCurr.value.ubTitleFontShadowColor = ubShadowColor;
}

// Unless you set up the attributes, any text you pass to SetRelativeStartAndEndPercentage will
// default to FONT12POINT1 in a black color.
function SetProgressBarMsgAttributes(ubID: UINT32, usFont: UINT32, ubForeColor: UINT8, ubShadowColor: UINT8): void {
  let pCurr: Pointer<PROGRESSBAR>;
  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];
  if (!pCurr)
    return;
  pCurr.value.usMsgFont = usFont;
  pCurr.value.ubMsgFontForeColor = ubForeColor;
  pCurr.value.ubMsgFontShadowColor = ubShadowColor;
}

// When finished, the progress bar needs to be removed.
function RemoveProgressBar(ubID: UINT8): void {
  Assert(ubID < MAX_PROGRESSBARS);
  if (pBar[ubID]) {
    if (pBar[ubID].value.swzTitle)
      MemFree(pBar[ubID].value.swzTitle);
    MemFree(pBar[ubID]);
    pBar[ubID] = NULL;
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
function SetRelativeStartAndEndPercentage(ubID: UINT8, uiRelStartPerc: UINT32, uiRelEndPerc: UINT32, str: Pointer<UINT16>): void {
  let pCurr: Pointer<PROGRESSBAR>;
  let usStartX: UINT16;
  let usStartY: UINT16;

  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];
  if (!pCurr)
    return;

  pCurr.value.rStart = uiRelStartPerc * 0.01;
  pCurr.value.rEnd = uiRelEndPerc * 0.01;

  // Render the entire panel now, as it doesn't need update during the normal rendering
  if (pCurr.value.fPanel) {
    // Draw panel
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.value.usPanelLeft, pCurr.value.usPanelTop, pCurr.value.usPanelRight, pCurr.value.usPanelBottom, pCurr.value.usLtColor);
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.value.usPanelLeft + 1, pCurr.value.usPanelTop + 1, pCurr.value.usPanelRight, pCurr.value.usPanelBottom, pCurr.value.usDkColor);
    ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.value.usPanelLeft + 1, pCurr.value.usPanelTop + 1, pCurr.value.usPanelRight - 1, pCurr.value.usPanelBottom - 1, pCurr.value.usColor);
    InvalidateRegion(pCurr.value.usPanelLeft, pCurr.value.usPanelTop, pCurr.value.usPanelRight, pCurr.value.usPanelBottom);
    // Draw title

    if (pCurr.value.swzTitle) {
      usStartX = pCurr.value.usPanelLeft + // left position
                 (pCurr.value.usPanelRight - pCurr.value.usPanelLeft) / 2 - // + half width
                 StringPixLength(pCurr.value.swzTitle, pCurr.value.usTitleFont) / 2; // - half string width
      usStartY = pCurr.value.usPanelTop + 3;
      SetFont(pCurr.value.usTitleFont);
      SetFontForeground(pCurr.value.ubTitleFontForeColor);
      SetFontShadow(pCurr.value.ubTitleFontShadowColor);
      SetFontBackground(0);
      mprintf(usStartX, usStartY, pCurr.value.swzTitle);
    }
  }

  if (pCurr.value.fDisplayText) {
    // Draw message
    if (str) {
      if (pCurr.value.fUseSaveBuffer) {
        let usFontHeight: UINT16 = GetFontHeight(pCurr.value.usMsgFont);

        RestoreExternBackgroundRect(pCurr.value.usBarLeft, pCurr.value.usBarBottom, (pCurr.value.usBarRight - pCurr.value.usBarLeft), (usFontHeight + 3));
      }

      SetFont(pCurr.value.usMsgFont);
      SetFontForeground(pCurr.value.ubMsgFontForeColor);
      SetFontShadow(pCurr.value.ubMsgFontShadowColor);
      SetFontBackground(0);
      mprintf(pCurr.value.usBarLeft, pCurr.value.usBarBottom + 3, str);
    }
  }
}

// This part renders the progress bar at the percentage level that you specify.  If you have set relative
// percentage values in the above function, then the uiPercentage will be reflected based off of the relative
// percentages.
function RenderProgressBar(ubID: UINT8, uiPercentage: UINT32): void {
  /* static */ let uiLastTime: UINT32 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();
  let rActual: double;
  let pCurr: Pointer<PROGRESSBAR> = NULL;
  // UINT32 r, g;
  let end: INT32;

  Assert(ubID < MAX_PROGRESSBARS);
  pCurr = pBar[ubID];

  if (pCurr == NULL)
    return;

  if (pCurr) {
    rActual = pCurr.value.rStart + (pCurr.value.rEnd - pCurr.value.rStart) * uiPercentage * 0.01;

    if (rActual - pCurr.value.rLastActual < 0.01) {
      return;
    }

    pCurr.value.rLastActual = ((rActual * 100) * 0.01);

    end = (pCurr.value.usBarLeft + 2.0 + rActual * (pCurr.value.usBarRight - pCurr.value.usBarLeft - 4));
    if (end < pCurr.value.usBarLeft + 2 || end > pCurr.value.usBarRight - 2) {
      return;
    }
    if (gfUseLoadScreenProgressBar) {
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.value.usBarLeft, pCurr.value.usBarTop, end, pCurr.value.usBarBottom, Get16BPPColor(FROMRGB(pCurr.value.ubColorFillRed, pCurr.value.ubColorFillGreen, pCurr.value.ubColorFillBlue)));
      // if( pCurr->usBarRight > gusLeftmostShaded )
      //{
      //	ShadowVideoSurfaceRect( FRAME_BUFFER, gusLeftmostShaded+1, pCurr->usBarTop, end, pCurr->usBarBottom );
      //	gusLeftmostShaded = (UINT16)end;
      //}
    } else {
      // Border edge of the progress bar itself in gray
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.value.usBarLeft, pCurr.value.usBarTop, pCurr.value.usBarRight, pCurr.value.usBarBottom, Get16BPPColor(FROMRGB(160, 160, 160)));
      // Interior of progress bar in black
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.value.usBarLeft + 2, pCurr.value.usBarTop + 2, pCurr.value.usBarRight - 2, pCurr.value.usBarBottom - 2, Get16BPPColor(FROMRGB(0, 0, 0)));
      ColorFillVideoSurfaceArea(FRAME_BUFFER, pCurr.value.usBarLeft + 2, pCurr.value.usBarTop + 2, end, pCurr.value.usBarBottom - 2, Get16BPPColor(FROMRGB(72, 155, 24)));
    }
    InvalidateRegion(pCurr.value.usBarLeft, pCurr.value.usBarTop, pCurr.value.usBarRight, pCurr.value.usBarBottom);
    ExecuteBaseDirtyRectQueue();
    EndFrameBufferRender();
    RefreshScreen(NULL);
  }

  // update music here
  if (uiCurTime > (uiLastTime + 200)) {
    MusicPoll(TRUE);
    uiLastTime = GetJA2Clock();
  }
}

function SetProgressBarColor(ubID: UINT8, ubColorFillRed: UINT8, ubColorFillGreen: UINT8, ubColorFillBlue: UINT8): void {
  let pCurr: Pointer<PROGRESSBAR> = NULL;

  Assert(ubID < MAX_PROGRESSBARS);

  pCurr = pBar[ubID];
  if (pCurr == NULL)
    return;

  pCurr.value.ubColorFillRed = ubColorFillRed;
  pCurr.value.ubColorFillGreen = ubColorFillGreen;
  pCurr.value.ubColorFillBlue = ubColorFillBlue;
}

function SetProgressBarTextDisplayFlag(ubID: UINT8, fDisplayText: BOOLEAN, fUseSaveBuffer: BOOLEAN, fSaveScreenToFrameBuffer: BOOLEAN): void {
  let pCurr: Pointer<PROGRESSBAR> = NULL;

  Assert(ubID < MAX_PROGRESSBARS);

  pCurr = pBar[ubID];
  if (pCurr == NULL)
    return;

  pCurr.value.fDisplayText = fDisplayText;

  pCurr.value.fUseSaveBuffer = fUseSaveBuffer;

  // if we are to use the save buffer, blit the portion of the screen to the save buffer
  if (fSaveScreenToFrameBuffer) {
    let usFontHeight: UINT16 = GetFontHeight(pCurr.value.usMsgFont) + 3;

    // blit everything to the save buffer ( cause the save buffer can bleed through )
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, pCurr.value.usBarLeft, pCurr.value.usBarBottom, (pCurr.value.usBarRight - pCurr.value.usBarLeft), usFontHeight);
  }
}
