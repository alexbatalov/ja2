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

export function DisplayFrameRate(): void {
  /* static */ let uiFPS: UINT32 = 0;
  /* static */ let uiFrameCount: UINT32 = 0;
  let usMapPos: UINT16;
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC = createVideoOverlayDesc();

  // Increment frame count
  uiFrameCount++;

  if (COUNTERDONE(Enum386.FPSCOUNTER)) {
    // Reset counter
    RESETCOUNTER(Enum386.FPSCOUNTER);

    uiFPS = uiFrameCount;
    uiFrameCount = 0;
  }

  // Create string
  SetFont(SMALLFONT1());

  // DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String( "FPS: %d ", __min( uiFPS, 1000 ) ) );

  if (uiFPS < 20) {
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_LTRED);
  } else {
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_DKGRAY);
  }

  if (gbFPSDisplay == SHOW_FULL_FPS) {
    // FRAME RATE
    memset(addressof(VideoOverlayDesc), 0, sizeof(VideoOverlayDesc));
    VideoOverlayDesc.pzText = swprintf("%ld", Math.min(uiFPS, 1000));
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_TEXT;
    UpdateVideoOverlay(addressof(VideoOverlayDesc), giFPSOverlay, false);

    // TIMER COUNTER
    VideoOverlayDesc.pzText = swprintf("%ld", Math.min(giTimerDiag, 1000));
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_TEXT;
    UpdateVideoOverlay(addressof(VideoOverlayDesc), giCounterPeriodOverlay, false);

    if (GetMouseMapPos(addressof(usMapPos))) {
      // gprintfdirty( 0, 315, L"(%d)",usMapPos);
      // mprintf( 0,315,L"(%d)",usMapPos);
    } else {
      // gprintfdirty( 0, 315, L"(%d %d)",gusMouseXPos, gusMouseYPos - INTERFACE_START_Y );
      // mprintf( 0,315,L"(%d %d)",gusMouseXPos, gusMouseYPos - INTERFACE_START_Y );
    }
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
  mprintf(50, 255, "%S", gubErrorText);
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
      if (InputEvent.usParam == ESC || InputEvent.usParam == 'x' && InputEvent.usKeyState & ALT_DOWN) {
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

export function InitScreenHandle(): UINT32 {
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
  /* static */ let hVSurface: HVSURFACE;
  /* static */ let ubCurrentScreen: UINT8 = 255;

  if (ubCurrentScreen == 255) {
// FIXME: Language-specific code
// #ifdef ENGLISH
    if (gfDoneWithSplashScreen) {
      ubCurrentScreen = 0;
    } else {
      SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
      return Enum26.INTRO_SCREEN;
    }
// #else
//     ubCurrentScreen = 0;
// #endif
  }

  if (ubCurrentScreen == 0) {
    if (strcmp(gzCommandLine, "-NODD") == 0) {
      gfDontUseDDBlits = true;
    }

    // Load version number....
    // HandleLimitedNumExecutions( );

    // Load init screen and blit!
    vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;

    vs_desc.ImageFile = "ja2_logo.STI";

    hVSurface = CreateVideoSurface(addressof(vs_desc));
    if (!hVSurface)
      AssertMsg(0, "Failed to load ja2_logo.sti!");

    // BltVideoSurfaceToVideoSurface( ghFrameBuffer, hVSurface, 0, 0, 0, VS_BLT_FAST, NULL );
    ubCurrentScreen = 1;

    // Init screen

    // Set Font
    SetFont(TINYFONT1());
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_WHITE);

    // mprintf( 10, 420, zVersionLabel );

    mprintf(10, 430, "%s: %s (%S)", pMessageStrings[Enum333.MSG_VERSION], zVersionLabel, czVersionNumber);

    if (gfDontUseDDBlits) {
      mprintf(10, 440, "Using software blitters");
    }

    InvalidateScreen();

    // Delete video Surface
    DeleteVideoSurface(hVSurface);
    // ATE: Set to true to reset before going into main screen!

    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

    return Enum26.INIT_SCREEN;
  }

  if (ubCurrentScreen == 1) {
    ubCurrentScreen = 2;
    return InitializeJA2();
  }

  if (ubCurrentScreen == 2) {
    InitMainMenu();
    ubCurrentScreen = 3;
    return Enum26.INIT_SCREEN;
  }

  // Let one frame pass....
  if (ubCurrentScreen == 3) {
    ubCurrentScreen = 4;
    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
    return Enum26.INIT_SCREEN;
  }

  if (ubCurrentScreen == 4) {
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

export function PalEditScreenHandle(): UINT32 {
  /* static */ let FirstTime: boolean = true;

  if (gfExitPalEditScreen) {
    gfExitPalEditScreen = false;
    FirstTime = true;
    FreeBackgroundRect(guiBackgroundRect);
    SetRenderHook(null);
    SetUIKeyboardHook(null);
    return Enum26.GAME_SCREEN;
  }

  if (FirstTime) {
    FirstTime = false;

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
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (gusSelectedSoldier != NO_SOLDIER) {
    // Set to current
    GetSoldier(addressof(pSoldier), gusSelectedSoldier);

    DisplayPaletteRep(pSoldier.value.HeadPal, 50, 10, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier.value.PantsPal, 50, 50, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier.value.VestPal, 50, 90, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier.value.SkinPal, 50, 130, FRAME_BUFFER);
  }
}

function PalEditKeyboardHook(pInputEvent: Pointer<InputAtom>): boolean {
  let ubType: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubPaletteRep: UINT8;
  let cnt: UINT32;
  let ubStartRep: UINT8 = 0;
  let ubEndRep: UINT8 = 0;

  if (gusSelectedSoldier == NO_SOLDIER) {
    return false;
  }

  if ((pInputEvent.value.usEvent == KEY_DOWN) && (pInputEvent.value.usParam == ESC)) {
    gfExitPalEditScreen = true;
    return true;
  }

  if ((pInputEvent.value.usEvent == KEY_DOWN) && (pInputEvent.value.usParam == 'h')) {
    // Get Soldier
    GetSoldier(addressof(pSoldier), gusSelectedSoldier);

    // Get index of current
    if (!GetPaletteRepIndexFromID(pSoldier.value.HeadPal, addressof(ubPaletteRep))) {
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
    SET_PALETTEREP_ID(pSoldier.value.HeadPal, gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return true;
  }

  if ((pInputEvent.value.usEvent == KEY_DOWN) && (pInputEvent.value.usParam == 'v')) {
    // Get Soldier
    GetSoldier(addressof(pSoldier), gusSelectedSoldier);

    // Get index of current
    if (!GetPaletteRepIndexFromID(pSoldier.value.VestPal, addressof(ubPaletteRep))) {
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
    SET_PALETTEREP_ID(pSoldier.value.VestPal, gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return true;
  }

  if ((pInputEvent.value.usEvent == KEY_DOWN) && (pInputEvent.value.usParam == 'p')) {
    // Get Soldier
    GetSoldier(addressof(pSoldier), gusSelectedSoldier);

    // Get index of current
    if (!GetPaletteRepIndexFromID(pSoldier.value.PantsPal, addressof(ubPaletteRep))) {
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
    SET_PALETTEREP_ID(pSoldier.value.PantsPal, gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return true;
  }

  if ((pInputEvent.value.usEvent == KEY_DOWN) && (pInputEvent.value.usParam == 's')) {
    // Get Soldier
    GetSoldier(addressof(pSoldier), gusSelectedSoldier);

    // Get index of current
    if (!GetPaletteRepIndexFromID(pSoldier.value.SkinPal, addressof(ubPaletteRep))) {
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
    SET_PALETTEREP_ID(pSoldier.value.SkinPal, gpPalRep[ubPaletteRep].ID);

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

function DebugKeyboardHook(pInputEvent: Pointer<InputAtom>): boolean {
  if ((pInputEvent.value.usEvent == KEY_UP) && (pInputEvent.value.usParam == 'q')) {
    gfExitDebugScreen = true;
    return true;
  }

  if ((pInputEvent.value.usEvent == KEY_UP) && (pInputEvent.value.usParam == PGUP)) {
    // Page down
    gCurDebugPage++;

    if (gCurDebugPage == MAX_DEBUG_PAGES) {
      gCurDebugPage = 0;
    }

    FreeBackgroundRect(guiBackgroundRect);
    gfInitRect = true;
  }

  if ((pInputEvent.value.usEvent == KEY_UP) && (pInputEvent.value.usParam == PGDN)) {
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

export function SexScreenHandle(): UINT32 {
  /* static */ let ubCurrentScreen: UINT8 = 0;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  /* static */ let guiSMILY: UINT32;
  /* static */ let bCurFrame: INT8 = 0;
  /* static */ let uiTimeOfLastUpdate: UINT32 = 0;
  /* static */ let uiTime: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let hVObject: HVOBJECT;
  let sX: INT16;
  let sY: INT16;

  // OK, Clear screen and show smily face....
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  InvalidateScreen();
  // Remove cursor....
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  if (ubCurrentScreen == 0) {
    // Load face....
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\luckysmile.sti");
    if (!(guiSMILY = AddVideoObject(VObjectDesc)))
      AssertMsg(0, "Missing INTERFACE\\luckysmile.sti");

    // Init screen
    bCurFrame = 0;

    ubCurrentScreen = 1;

    uiTimeOfLastUpdate = GetJA2Clock();

    return Enum26.SEX_SCREEN;
  }

  // Update frame
  uiTime = GetJA2Clock();

  // if we are animation smile...
  if (ubCurrentScreen == 1) {
    PlayJA2StreamingSampleFromFile("Sounds\\Sex.wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN, null);
    if ((uiTime - uiTimeOfLastUpdate) > SMILY_DELAY) {
      uiTimeOfLastUpdate = uiTime;

      bCurFrame++;

      if (bCurFrame == 32) {
        // Start end delay
        ubCurrentScreen = 2;
      }
    }
  }

  if (ubCurrentScreen == 2) {
    if ((uiTime - uiTimeOfLastUpdate) > SMILY_END_DELAY) {
      uiTimeOfLastUpdate = uiTime;

      ubCurrentScreen = 0;

      // Remove video object...
      DeleteVideoObjectFromIndex(guiSMILY);

      FadeInGameScreen();

      // Advance time...
      // Chris.... do this based on stats?
      WarpGameTime(((5 + Random(20)) * NUM_SEC_IN_MIN), Enum131.WARPTIME_NO_PROCESSING_OF_EVENTS);

      return Enum26.GAME_SCREEN;
    }
  }

  // Calculate smily face positions...
  hVObject = GetVideoObject(guiSMILY);
  pTrav = addressof(hVObject.value.pETRLEObject[0]);

  sX = ((640 - pTrav.value.usWidth) / 2);
  sY = ((480 - pTrav.value.usHeight) / 2);

  if (bCurFrame < 24) {
    BltVideoObjectFromIndex(FRAME_BUFFER, guiSMILY, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    BltVideoObjectFromIndex(FRAME_BUFFER, guiSMILY, (bCurFrame % 8), sX, sY, VO_BLT_SRCTRANSPARENCY, null);
  }

  InvalidateRegion(sX, sY, (sX + pTrav.value.usWidth), (sY + pTrav.value.usHeight));

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
