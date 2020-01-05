namespace ja2 {

const MAX_DEBUG_PAGES = 4;

// GLOBAL FOR PAL EDITOR
let CurrentPalette: UINT8 = 0;
let guiBackgroundRect: UINT32;
let gfExitPalEditScreen: boolean = false;
export let gfExitDebugScreen: boolean = false;
let gfInitRect: boolean = true;
/* static */ let FirstTime: boolean = true;
export let gfDoneWithSplashScreen: boolean = false;

export let gCurDebugPage: INT8 = 0;

let hVAnims: HVSURFACE[] /* [7] */;
let bTitleAnimFrame: INT8 = 0;
let uiTitleAnimTime: UINT32 = 0;
let uiDoTitleAnimTime: UINT32 = 0;
let gfDoTitleAnimation: boolean = false;
let gfStartTitleAnimation: boolean = false;

let gDebugRenderOverride: RENDER_HOOK[] /* [MAX_DEBUG_PAGES] */ = [
  DefaultDebugPage1,
  DefaultDebugPage2,
  DefaultDebugPage3,
  DefaultDebugPage4,
];

/* static */ let DisplayFrameRate__uiFPS: UINT32 = 0;
/* static */ let DisplayFrameRate__uiFrameCount: UINT32 = 0;
export function DisplayFrameRate(): void {
  let usMapPos: UINT16;
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();

  // Increment frame count
  DisplayFrameRate__uiFrameCount++;

  if (COUNTERDONE(Enum386.FPSCOUNTER)) {
    // Reset counter
    RESETCOUNTER(Enum386.FPSCOUNTER);

    DisplayFrameRate__uiFPS = DisplayFrameRate__uiFrameCount;
    DisplayFrameRate__uiFrameCount = 0;
  }

  // Create string
  SetFont(SMALLFONT1());

  // DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String( "FPS: %d ", __min( uiFPS, 1000 ) ) );

  if (DisplayFrameRate__uiFPS < 20) {
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_LTRED);
  } else {
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_DKGRAY);
  }

  if (gbFPSDisplay == SHOW_FULL_FPS) {
    // FRAME RATE
    VideoOverlayDesc.pzText = swprintf("%ld", Math.min(DisplayFrameRate__uiFPS, 1000));
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_TEXT;
    UpdateVideoOverlay(VideoOverlayDesc, giFPSOverlay, false);

    // TIMER COUNTER
    VideoOverlayDesc.pzText = swprintf("%ld", Math.min(giTimerDiag, 1000));
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_TEXT;
    UpdateVideoOverlay(VideoOverlayDesc, giCounterPeriodOverlay, false);
  }

  if ((gTacticalStatus.uiFlags & GODMODE)) {
    SetFont(SMALLFONT1());
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_DKRED);
    // gprintfdirty( 0, 0, L"GOD MODE" );
    // mprintf( 0, 0, L"GOD MODE" );
  }

  if ((gTacticalStatus.uiFlags & DEMOMODE)) {
    SetFont(SMALLFONT1());
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_DKGRAY);
    // gprintfdirty( 0, 0, L"DEMO MODE" );
    // mprintf( 0, 0, L"DEMO MODE" );
  }
}

// USELESS!!!!!!!!!!!!!!!!!!
export function SavingScreenInitialize(): boolean {
  return true;
}
export function SavingScreenHandle(): UINT32 {
  return Enum26.SAVING_SCREEN;
}
export function SavingScreenShutdown(): boolean {
  return true;
}

export function LoadingScreenInitialize(): boolean {
  return true;
}
export function LoadingScreenHandle(): UINT32 {
  return Enum26.LOADING_SCREEN;
}
export function LoadingScreenShutdown(): boolean {
  return true;
}

export function ErrorScreenInitialize(): boolean {
  return true;
}

export function ErrorScreenHandle(): UINT32 {
  let InputEvent: InputAtom = createInputAtom();
  /* static */ let fFirstTime: boolean = false;

  // For quick setting of new video stuff / to be changed
  StartFrameBufferRender();

  // Create string
  SetFont(LARGEFONT1());
  SetFontBackground(FONT_MCOLOR_BLACK);
  SetFontForeground(FONT_MCOLOR_LTGRAY);
  mprintf(50, 200, "RUNTIME ERROR");

  mprintf(50, 225, "PRESS <ESC> TO EXIT");

  SetFont(FONT12ARIAL());
  SetFontForeground(FONT_YELLOW);
  SetFontShadow(60); // 60 is near black
  mprintf(50, 255, "%s", gubErrorText);
  SetFontForeground(FONT_LTRED);

  if (!fFirstTime) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_0, FormatString("Runtime Error: %s ", gubErrorText));
    fFirstTime = true;
  }

  // For quick setting of new video stuff / to be changed
  InvalidateScreen();
  EndFrameBufferRender();

  // Check for esc
  while (DequeueEvent(InputEvent) == true) {
    if (InputEvent.usEvent == KEY_DOWN) {
      if (InputEvent.usParam == ESC || InputEvent.usParam == 'x'.charCodeAt(0) && InputEvent.usKeyState & ALT_DOWN) {
        // Exit the program
        DebugMsg(TOPIC_GAME, DBG_LEVEL_0, "GameLoop: User pressed ESCape, TERMINATING");

        // handle shortcut exit
        HandleShortCutExitState();
      }
    }
  }

  return Enum26.ERROR_SCREEN;
}

export function ErrorScreenShutdown(): boolean {
  return true;
}

export function InitScreenInitialize(): boolean {
  return true;
}

/* static */ let InitScreenHandle__hVSurface: SGPVSurface;
/* static */ let InitScreenHandle__ubCurrentScreen: UINT8 = 255;
export function InitScreenHandle(): UINT32 {
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();

  if (InitScreenHandle__ubCurrentScreen == 255) {
// FIXME: Language-specific code
// #ifdef ENGLISH
    if (gfDoneWithSplashScreen) {
      InitScreenHandle__ubCurrentScreen = 0;
    } else {
      SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
      return Enum26.INTRO_SCREEN;
    }
// #else
//     ubCurrentScreen = 0;
// #endif
  }

  if (InitScreenHandle__ubCurrentScreen == 0) {
    if (gzCommandLine === "-NODD") {
      gfDontUseDDBlits = true;
    }

    // Load version number....
    // HandleLimitedNumExecutions( );

    // Load init screen and blit!
    vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;

    vs_desc.ImageFile = "ja2_logo.STI";

    InitScreenHandle__hVSurface = CreateVideoSurface(vs_desc);
    if (!InitScreenHandle__hVSurface)
      AssertMsg(false, "Failed to load ja2_logo.sti!");

    // BltVideoSurfaceToVideoSurface( ghFrameBuffer, hVSurface, 0, 0, 0, VS_BLT_FAST, NULL );
    InitScreenHandle__ubCurrentScreen = 1;

    // Init screen

    // Set Font
    SetFont(TINYFONT1());
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_WHITE);

    // mprintf( 10, 420, zVersionLabel );

    mprintf(10, 430, "%s: %s (%s)", pMessageStrings[Enum333.MSG_VERSION], zVersionLabel, czVersionNumber);

    if (gfDontUseDDBlits) {
      mprintf(10, 440, "Using software blitters");
    }

    InvalidateScreen();

    // Delete video Surface
    DeleteVideoSurface(InitScreenHandle__hVSurface);
    // ATE: Set to true to reset before going into main screen!

    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

    return Enum26.INIT_SCREEN;
  }

  if (InitScreenHandle__ubCurrentScreen == 1) {
    InitScreenHandle__ubCurrentScreen = 2;
    return InitializeJA2();
  }

  if (InitScreenHandle__ubCurrentScreen == 2) {
    InitMainMenu();
    InitScreenHandle__ubCurrentScreen = 3;
    return Enum26.INIT_SCREEN;
  }

  // Let one frame pass....
  if (InitScreenHandle__ubCurrentScreen == 3) {
    InitScreenHandle__ubCurrentScreen = 4;
    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
    return Enum26.INIT_SCREEN;
  }

  if (InitScreenHandle__ubCurrentScreen == 4) {
    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
    InitNewGame(false);
  }
  return Enum26.INIT_SCREEN;
}

export function InitScreenShutdown(): boolean {
  return true;
}

export function PalEditScreenInit(): boolean {
  return true;
}

/* static */ let PalEditScreenHandle__FirstTime: boolean = true;
export function PalEditScreenHandle(): UINT32 {
  if (gfExitPalEditScreen) {
    gfExitPalEditScreen = false;
    PalEditScreenHandle__FirstTime = true;
    FreeBackgroundRect(guiBackgroundRect);
    SetRenderHook(null);
    SetUIKeyboardHook(null);
    return Enum26.GAME_SCREEN;
  }

  if (PalEditScreenHandle__FirstTime) {
    PalEditScreenHandle__FirstTime = false;

    SetRenderHook(PalEditRenderHook);
    SetUIKeyboardHook(PalEditKeyboardHook);

    guiBackgroundRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT, null, 50, 10, 600, 400);
  } else {
    GameScreens[Enum26.GAME_SCREEN].HandleScreen();
  }

  return Enum26.PALEDIT_SCREEN;
}

export function PalEditScreenShutdown(): boolean {
  return true;
}

function PalEditRenderHook(): void {
  let pSoldier: SOLDIERTYPE;

  if (gusSelectedSoldier != NO_SOLDIER) {
    // Set to current
    pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);

    DisplayPaletteRep(pSoldier.HeadPal, 50, 10, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier.PantsPal, 50, 50, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier.VestPal, 50, 90, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier.SkinPal, 50, 130, FRAME_BUFFER);
  }
}

function PalEditKeyboardHook(pInputEvent: InputAtom): boolean {
  let ubType: UINT8;
  let pSoldier: SOLDIERTYPE;
  let ubPaletteRep: UINT8;
  let cnt: UINT32;
  let ubStartRep: UINT8 = 0;
  let ubEndRep: UINT8 = 0;

  if (gusSelectedSoldier == NO_SOLDIER) {
    return false;
  }

  if ((pInputEvent.usEvent == KEY_DOWN) && (pInputEvent.usParam == ESC)) {
    gfExitPalEditScreen = true;
    return true;
  }

  if ((pInputEvent.usEvent == KEY_DOWN) && (pInputEvent.usParam == 'h'.charCodeAt(0))) {
    // Get Soldier
    pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);

    // Get index of current
    if ((ubPaletteRep = GetPaletteRepIndexFromID(pSoldier.HeadPal)) === -1) {
      return false;
    }
    ubType = gpPalRep[ubPaletteRep].ubType;

    ubPaletteRep++;

    // Count start and end index
    for (cnt = 0; cnt < ubType; cnt++) {
      ubStartRep = (ubStartRep + gubpNumReplacementsPerRange[cnt]);
    }

    ubEndRep = (ubStartRep + gubpNumReplacementsPerRange[ubType]);

    if (ubPaletteRep == ubEndRep) {
      ubPaletteRep = ubStartRep;
    }
    pSoldier.HeadPal = SET_PALETTEREP_ID(gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return true;
  }

  if ((pInputEvent.usEvent == KEY_DOWN) && (pInputEvent.usParam == 'v'.charCodeAt(0))) {
    // Get Soldier
    pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);

    // Get index of current
    if ((ubPaletteRep = GetPaletteRepIndexFromID(pSoldier.VestPal)) === -1) {
      return false;
    }
    ubType = gpPalRep[ubPaletteRep].ubType;

    ubPaletteRep++;

    // Count start and end index
    for (cnt = 0; cnt < ubType; cnt++) {
      ubStartRep = (ubStartRep + gubpNumReplacementsPerRange[cnt]);
    }

    ubEndRep = (ubStartRep + gubpNumReplacementsPerRange[ubType]);

    if (ubPaletteRep == ubEndRep) {
      ubPaletteRep = ubStartRep;
    }
    pSoldier.VestPal = SET_PALETTEREP_ID(gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return true;
  }

  if ((pInputEvent.usEvent == KEY_DOWN) && (pInputEvent.usParam == 'p'.charCodeAt(0))) {
    // Get Soldier
    pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);

    // Get index of current
    if ((ubPaletteRep = GetPaletteRepIndexFromID(pSoldier.PantsPal)) === -1) {
      return false;
    }
    ubType = gpPalRep[ubPaletteRep].ubType;

    ubPaletteRep++;

    // Count start and end index
    for (cnt = 0; cnt < ubType; cnt++) {
      ubStartRep = (ubStartRep + gubpNumReplacementsPerRange[cnt]);
    }

    ubEndRep = (ubStartRep + gubpNumReplacementsPerRange[ubType]);

    if (ubPaletteRep == ubEndRep) {
      ubPaletteRep = ubStartRep;
    }
    pSoldier.PantsPal = SET_PALETTEREP_ID(gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return true;
  }

  if ((pInputEvent.usEvent == KEY_DOWN) && (pInputEvent.usParam == 's'.charCodeAt(0))) {
    // Get Soldier
    pSoldier = <SOLDIERTYPE>GetSoldier(gusSelectedSoldier);

    // Get index of current
    if ((ubPaletteRep = GetPaletteRepIndexFromID(pSoldier.SkinPal)) === -1) {
      return false;
    }
    ubType = gpPalRep[ubPaletteRep].ubType;

    ubPaletteRep++;

    // Count start and end index
    for (cnt = 0; cnt < ubType; cnt++) {
      ubStartRep = (ubStartRep + gubpNumReplacementsPerRange[cnt]);
    }

    ubEndRep = (ubStartRep + gubpNumReplacementsPerRange[ubType]);

    if (ubPaletteRep == ubEndRep) {
      ubPaletteRep = ubStartRep;
    }
    pSoldier.SkinPal = SET_PALETTEREP_ID(gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return true;
  }

  return false;
}

export function DebugScreenInit(): boolean {
  return true;
}

function CheckForAndExitTacticalDebug(): boolean {
  if (gfExitDebugScreen) {
    FirstTime = true;
    gfInitRect = true;
    gfExitDebugScreen = false;
    FreeBackgroundRect(guiBackgroundRect);
    SetRenderHook(null);
    SetUIKeyboardHook(null);

    return true;
  }

  return false;
}

function ExitDebugScreen(): void {
  if (guiCurrentScreen == Enum26.DEBUG_SCREEN) {
    gfExitDebugScreen = true;
  }

  CheckForAndExitTacticalDebug();
}

export function DebugScreenHandle(): UINT32 {
  if (CheckForAndExitTacticalDebug()) {
    return Enum26.GAME_SCREEN;
  }

  if (gfInitRect) {
    guiBackgroundRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT, null, 0, 0, 600, 360);
    gfInitRect = false;
  }

  if (FirstTime) {
    FirstTime = false;

    SetRenderHook(DebugRenderHook);
    SetUIKeyboardHook(DebugKeyboardHook);
  } else {
    GameScreens[Enum26.GAME_SCREEN].HandleScreen();
  }

  return Enum26.DEBUG_SCREEN;
}

export function DebugScreenShutdown(): boolean {
  return true;
}

function DebugRenderHook(): void {
  gDebugRenderOverride[gCurDebugPage]();
}

function DebugKeyboardHook(pInputEvent: InputAtom): boolean {
  if ((pInputEvent.usEvent == KEY_UP) && (pInputEvent.usParam == 'q'.charCodeAt(0))) {
    gfExitDebugScreen = true;
    return true;
  }

  if ((pInputEvent.usEvent == KEY_UP) && (pInputEvent.usParam == PGUP)) {
    // Page down
    gCurDebugPage++;

    if (gCurDebugPage == MAX_DEBUG_PAGES) {
      gCurDebugPage = 0;
    }

    FreeBackgroundRect(guiBackgroundRect);
    gfInitRect = true;
  }

  if ((pInputEvent.usEvent == KEY_UP) && (pInputEvent.usParam == PGDN)) {
    // Page down
    gCurDebugPage--;

    if (gCurDebugPage < 0) {
      gCurDebugPage = MAX_DEBUG_PAGES - 1;
    }

    FreeBackgroundRect(guiBackgroundRect);
    gfInitRect = true;
  }

  return false;
}

export function SetDebugRenderHook(pDebugRenderOverride: RENDER_HOOK, ubPage: INT8): void {
  gDebugRenderOverride[ubPage] = pDebugRenderOverride;
}

function DefaultDebugPage1(): void {
  SetFont(LARGEFONT1());
  gprintf(0, 0, "DEBUG PAGE ONE");
}

function DefaultDebugPage2(): void {
  SetFont(LARGEFONT1());
  gprintf(0, 0, "DEBUG PAGE TWO");
}

function DefaultDebugPage3(): void {
  SetFont(LARGEFONT1());
  gprintf(0, 0, "DEBUG PAGE THREE");
}

function DefaultDebugPage4(): void {
  SetFont(LARGEFONT1());
  gprintf(0, 0, "DEBUG PAGE FOUR");
}

export function SexScreenInit(): boolean {
  return true;
}

const SMILY_DELAY = 100;
const SMILY_END_DELAY = 1000;

/* static */ let SexScreenHandle__ubCurrentScreen: UINT8 = 0;
/* static */ let SexScreenHandle__guiSMILY: UINT32;
/* static */ let SexScreenHandle__bCurFrame: INT8 = 0;
/* static */ let SexScreenHandle__uiTimeOfLastUpdate: UINT32 = 0;
/* static */ let SexScreenHandle__uiTime: UINT32;
export function SexScreenHandle(): UINT32 {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let pTrav: ETRLEObject;
  let hVObject: SGPVObject;
  let sX: INT16;
  let sY: INT16;

  // OK, Clear screen and show smily face....
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  InvalidateScreen();
  // Remove cursor....
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  if (SexScreenHandle__ubCurrentScreen == 0) {
    // Load face....
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\luckysmile.sti");
    if (!(SexScreenHandle__guiSMILY = AddVideoObject(VObjectDesc)))
      AssertMsg(0, "Missing INTERFACE\\luckysmile.sti");

    // Init screen
    SexScreenHandle__bCurFrame = 0;

    SexScreenHandle__ubCurrentScreen = 1;

    SexScreenHandle__uiTimeOfLastUpdate = GetJA2Clock();

    return Enum26.SEX_SCREEN;
  }

  // Update frame
  SexScreenHandle__uiTime = GetJA2Clock();

  // if we are animation smile...
  if (SexScreenHandle__ubCurrentScreen == 1) {
    PlayJA2StreamingSampleFromFile("Sounds\\Sex.wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN, null);
    if ((SexScreenHandle__uiTime - SexScreenHandle__uiTimeOfLastUpdate) > SMILY_DELAY) {
      SexScreenHandle__uiTimeOfLastUpdate = SexScreenHandle__uiTime;

      SexScreenHandle__bCurFrame++;

      if (SexScreenHandle__bCurFrame == 32) {
        // Start end delay
        SexScreenHandle__ubCurrentScreen = 2;
      }
    }
  }

  if (SexScreenHandle__ubCurrentScreen == 2) {
    if ((SexScreenHandle__uiTime - SexScreenHandle__uiTimeOfLastUpdate) > SMILY_END_DELAY) {
      SexScreenHandle__uiTimeOfLastUpdate = SexScreenHandle__uiTime;

      SexScreenHandle__ubCurrentScreen = 0;

      // Remove video object...
      DeleteVideoObjectFromIndex(SexScreenHandle__guiSMILY);

      FadeInGameScreen();

      // Advance time...
      // Chris.... do this based on stats?
      WarpGameTime(((5 + Random(20)) * NUM_SEC_IN_MIN), Enum131.WARPTIME_NO_PROCESSING_OF_EVENTS);

      return Enum26.GAME_SCREEN;
    }
  }

  // Calculate smily face positions...
  hVObject = GetVideoObject(SexScreenHandle__guiSMILY);
  pTrav = hVObject.pETRLEObject[0];

  sX = Math.trunc((640 - pTrav.usWidth) / 2);
  sY = Math.trunc((480 - pTrav.usHeight) / 2);

  if (SexScreenHandle__bCurFrame < 24) {
    BltVideoObjectFromIndex(FRAME_BUFFER, SexScreenHandle__guiSMILY, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    BltVideoObjectFromIndex(FRAME_BUFFER, SexScreenHandle__guiSMILY, (SexScreenHandle__bCurFrame % 8), sX, sY, VO_BLT_SRCTRANSPARENCY, null);
  }

  InvalidateRegion(sX, sY, (sX + pTrav.usWidth), (sY + pTrav.usHeight));

  return Enum26.SEX_SCREEN;
}

export function SexScreenShutdown(): boolean {
  return true;
}

export function DemoExitScreenInit(): boolean {
  return true;
}

function DoneFadeOutForDemoExitScreen(): void {
  gfProgramIsRunning = false;
}

// FIXME: Language-specific code
// #ifdef GERMAN
// void DisplayTopwareGermanyAddress() {
//   VOBJECT_DESC vo_desc;
//   UINT32 uiTempID;
//   UINT8 *pDestBuf;
//   UINT32 uiDestPitchBYTES;
//   SGPRect ClipRect;
//
//   // bring up the Topware address screen
//   vo_desc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
//   sprintf(vo_desc.ImageFile, "German\\topware_germany.sti");
//   if (!AddVideoObject(&vo_desc, &uiTempID)) {
//     AssertMsg(0, "Failed to load German\\topware_germany.sti");
//     return;
//   }
//
//   // Shade out a background piece to emphasize the German address.
//   ClipRect.iLeft = 208;
//   ClipRect.iRight = 431;
//   ClipRect.iTop = 390;
//   ClipRect.iBottom = 475;
//   pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);
//   Blt16BPPBufferShadowRect((UINT16 *)pDestBuf, uiDestPitchBYTES, &ClipRect);
//   UnLockVideoSurface(FRAME_BUFFER);
//
//   // Draw the anti-aliased address now.
//   BltVideoObjectFromIndex(FRAME_BUFFER, uiTempID, 0, 218, 400, VO_BLT_SRCTRANSPARENCY, NULL);
//   BltVideoObjectFromIndex(FRAME_BUFFER, uiTempID, 0, 218, 400, VO_BLT_SRCTRANSPARENCY, NULL);
//   InvalidateRegion(208, 390, 431, 475);
//   DeleteVideoObjectFromIndex(uiTempID);
//   ExecuteBaseDirtyRectQueue();
//   EndFrameBufferRender();
// }
// #endif

export function DemoExitScreenHandle(): UINT32 {
  gfProgramIsRunning = false;
  return Enum26.DEMO_EXIT_SCREEN;
}

export function DemoExitScreenShutdown(): boolean {
  return true;
}

}
