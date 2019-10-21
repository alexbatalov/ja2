const MAX_DEBUG_PAGES = 4;

// GLOBAL FOR PAL EDITOR
UINT8 CurrentPalette = 0;
UINT32 guiBackgroundRect;
BOOLEAN gfExitPalEditScreen = FALSE;
BOOLEAN gfExitDebugScreen = FALSE;
BOOLEAN gfInitRect = TRUE;
static BOOLEAN FirstTime = TRUE;
BOOLEAN gfDoneWithSplashScreen = FALSE;

INT8 gCurDebugPage = 0;

HVSURFACE hVAnims[7];
INT8 bTitleAnimFrame = 0;
UINT32 uiTitleAnimTime = 0;
UINT32 uiDoTitleAnimTime = 0;
BOOLEAN gfDoTitleAnimation = FALSE;
BOOLEAN gfStartTitleAnimation = FALSE;

RENDER_HOOK gDebugRenderOverride[MAX_DEBUG_PAGES] = {
  (RENDER_HOOK)DefaultDebugPage1,
  (RENDER_HOOK)DefaultDebugPage2,
  (RENDER_HOOK)DefaultDebugPage3,
  (RENDER_HOOK)DefaultDebugPage4,
};

function DisplayFrameRate(): void {
  static UINT32 uiFPS = 0;
  static UINT32 uiFrameCount = 0;
  UINT16 usMapPos;
  VIDEO_OVERLAY_DESC VideoOverlayDesc;

  // Increment frame count
  uiFrameCount++;

  if (COUNTERDONE(FPSCOUNTER)) {
    // Reset counter
    RESETCOUNTER(FPSCOUNTER);

    uiFPS = uiFrameCount;
    uiFrameCount = 0;
  }

  // Create string
  SetFont(SMALLFONT1);

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
    memset(&VideoOverlayDesc, 0, sizeof(VideoOverlayDesc));
    swprintf(VideoOverlayDesc.pzText, L"%ld", __min(uiFPS, 1000));
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_TEXT;
    UpdateVideoOverlay(&VideoOverlayDesc, giFPSOverlay, FALSE);

    // TIMER COUNTER
    swprintf(VideoOverlayDesc.pzText, L"%ld", __min(giTimerDiag, 1000));
    VideoOverlayDesc.uiFlags = VOVERLAY_DESC_TEXT;
    UpdateVideoOverlay(&VideoOverlayDesc, giCounterPeriodOverlay, FALSE);

    if (GetMouseMapPos(&usMapPos)) {
      // gprintfdirty( 0, 315, L"(%d)",usMapPos);
      // mprintf( 0,315,L"(%d)",usMapPos);
    } else {
      // gprintfdirty( 0, 315, L"(%d %d)",gusMouseXPos, gusMouseYPos - INTERFACE_START_Y );
      // mprintf( 0,315,L"(%d %d)",gusMouseXPos, gusMouseYPos - INTERFACE_START_Y );
    }
  }

  if ((gTacticalStatus.uiFlags & GODMODE)) {
    SetFont(SMALLFONT1);
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_DKRED);
    // gprintfdirty( 0, 0, L"GOD MODE" );
    // mprintf( 0, 0, L"GOD MODE" );
  }

  if ((gTacticalStatus.uiFlags & DEMOMODE)) {
    SetFont(SMALLFONT1);
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_DKGRAY);
    // gprintfdirty( 0, 0, L"DEMO MODE" );
    // mprintf( 0, 0, L"DEMO MODE" );
  }
}

// USELESS!!!!!!!!!!!!!!!!!!
function SavingScreenInitialize(): UINT32 {
  return TRUE;
}
function SavingScreenHandle(): UINT32 {
  return SAVING_SCREEN;
}
function SavingScreenShutdown(): UINT32 {
  return TRUE;
}

function LoadingScreenInitialize(): UINT32 {
  return TRUE;
}
function LoadingScreenHandle(): UINT32 {
  return LOADING_SCREEN;
}
function LoadingScreenShutdown(): UINT32 {
  return TRUE;
}

function ErrorScreenInitialize(): UINT32 {
  return TRUE;
}

function ErrorScreenHandle(): UINT32 {
  InputAtom InputEvent;
  static BOOLEAN fFirstTime = FALSE;

  // For quick setting of new video stuff / to be changed
  StartFrameBufferRender();

  // Create string
  SetFont(LARGEFONT1);
  SetFontBackground(FONT_MCOLOR_BLACK);
  SetFontForeground(FONT_MCOLOR_LTGRAY);
  mprintf(50, 200, L"RUNTIME ERROR");

  mprintf(50, 225, L"PRESS <ESC> TO EXIT");

  SetFont(FONT12ARIAL);
  SetFontForeground(FONT_YELLOW);
  SetFontShadow(60); // 60 is near black
  mprintf(50, 255, L"%S", gubErrorText);
  SetFontForeground(FONT_LTRED);

  if (!fFirstTime) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_0, String("Runtime Error: %s ", gubErrorText));
    fFirstTime = TRUE;
  }

  // For quick setting of new video stuff / to be changed
  InvalidateScreen();
  EndFrameBufferRender();

  // Check for esc
  while (DequeueEvent(&InputEvent) == TRUE) {
    if (InputEvent.usEvent == KEY_DOWN) {
      if (InputEvent.usParam == ESC || InputEvent.usParam == 'x' && InputEvent.usKeyState & ALT_DOWN) {
        // Exit the program
        DebugMsg(TOPIC_GAME, DBG_LEVEL_0, "GameLoop: User pressed ESCape, TERMINATING");

        // handle shortcut exit
        HandleShortCutExitState();
      }
    }
  }

  return ERROR_SCREEN;
}

function ErrorScreenShutdown(): UINT32 {
  return TRUE;
}

function InitScreenInitialize(): UINT32 {
  return TRUE;
}

function InitScreenHandle(): UINT32 {
  VSURFACE_DESC vs_desc;
  static HVSURFACE hVSurface;
  static UINT8 ubCurrentScreen = 255;

  if (ubCurrentScreen == 255) {
// FIXME: Language-specific code
// #ifdef ENGLISH
    if (gfDoneWithSplashScreen) {
      ubCurrentScreen = 0;
    } else {
      SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
      return INTRO_SCREEN;
    }
// #else
//     ubCurrentScreen = 0;
// #endif
  }

  if (ubCurrentScreen == 0) {
    if (strcmp(gzCommandLine, "-NODD") == 0) {
      gfDontUseDDBlits = TRUE;
    }

    // Load version number....
    // HandleLimitedNumExecutions( );

    // Load init screen and blit!
    vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;

    strcpy(vs_desc.ImageFile, "ja2_logo.STI");

    hVSurface = CreateVideoSurface(&vs_desc);
    if (!hVSurface)
      AssertMsg(0, "Failed to load ja2_logo.sti!");

    // BltVideoSurfaceToVideoSurface( ghFrameBuffer, hVSurface, 0, 0, 0, VS_BLT_FAST, NULL );
    ubCurrentScreen = 1;

    // Init screen

    // Set Font
    SetFont(TINYFONT1);
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_WHITE);

    // mprintf( 10, 420, zVersionLabel );

    mprintf(10, 430, L"%s: %s (%S)", pMessageStrings[MSG_VERSION], zVersionLabel, czVersionNumber);

    if (gfDontUseDDBlits) {
      mprintf(10, 440, L"Using software blitters");
    }

    InvalidateScreen();

    // Delete video Surface
    DeleteVideoSurface(hVSurface);
    // ATE: Set to true to reset before going into main screen!

    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

    return INIT_SCREEN;
  }

  if (ubCurrentScreen == 1) {
    ubCurrentScreen = 2;
    return InitializeJA2();
  }

  if (ubCurrentScreen == 2) {
    InitMainMenu();
    ubCurrentScreen = 3;
    return INIT_SCREEN;
  }

  // Let one frame pass....
  if (ubCurrentScreen == 3) {
    ubCurrentScreen = 4;
    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
    return INIT_SCREEN;
  }

  if (ubCurrentScreen == 4) {
    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
    InitNewGame(FALSE);
  }
  return INIT_SCREEN;
}

function InitScreenShutdown(): UINT32 {
  return TRUE;
}

function PalEditScreenInit(): UINT32 {
  return TRUE;
}

function PalEditScreenHandle(): UINT32 {
  static BOOLEAN FirstTime = TRUE;

  if (gfExitPalEditScreen) {
    gfExitPalEditScreen = FALSE;
    FirstTime = TRUE;
    FreeBackgroundRect(guiBackgroundRect);
    SetRenderHook((RENDER_HOOK)NULL);
    SetUIKeyboardHook((UIKEYBOARD_HOOK)NULL);
    return GAME_SCREEN;
  }

  if (FirstTime) {
    FirstTime = FALSE;

    SetRenderHook((RENDER_HOOK)PalEditRenderHook);
    SetUIKeyboardHook((UIKEYBOARD_HOOK)PalEditKeyboardHook);

    guiBackgroundRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT, NULL, 50, 10, 600, 400);
  } else {
    (*(GameScreens[GAME_SCREEN].HandleScreen))();
  }

  return PALEDIT_SCREEN;
}

function PalEditScreenShutdown(): UINT32 {
  return TRUE;
}

function PalEditRenderHook(): void {
  SOLDIERTYPE *pSoldier;

  if (gusSelectedSoldier != NO_SOLDIER) {
    // Set to current
    GetSoldier(&pSoldier, gusSelectedSoldier);

    DisplayPaletteRep(pSoldier->HeadPal, 50, 10, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier->PantsPal, 50, 50, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier->VestPal, 50, 90, FRAME_BUFFER);
    DisplayPaletteRep(pSoldier->SkinPal, 50, 130, FRAME_BUFFER);
  }
}

function PalEditKeyboardHook(pInputEvent: Pointer<InputAtom>): BOOLEAN {
  UINT8 ubType;
  SOLDIERTYPE *pSoldier;
  UINT8 ubPaletteRep;
  UINT32 cnt;
  UINT8 ubStartRep = 0;
  UINT8 ubEndRep = 0;

  if (gusSelectedSoldier == NO_SOLDIER) {
    return FALSE;
  }

  if ((pInputEvent->usEvent == KEY_DOWN) && (pInputEvent->usParam == ESC)) {
    gfExitPalEditScreen = TRUE;
    return TRUE;
  }

  if ((pInputEvent->usEvent == KEY_DOWN) && (pInputEvent->usParam == 'h')) {
    // Get Soldier
    GetSoldier(&pSoldier, gusSelectedSoldier);

    // Get index of current
    CHECKF(GetPaletteRepIndexFromID(pSoldier->HeadPal, &ubPaletteRep));
    ubType = gpPalRep[ubPaletteRep].ubType;

    ubPaletteRep++;

    // Count start and end index
    for (cnt = 0; cnt < ubType; cnt++) {
      ubStartRep = (UINT8)(ubStartRep + gubpNumReplacementsPerRange[cnt]);
    }

    ubEndRep = (UINT8)(ubStartRep + gubpNumReplacementsPerRange[ubType]);

    if (ubPaletteRep == ubEndRep) {
      ubPaletteRep = ubStartRep;
    }
    SET_PALETTEREP_ID(pSoldier->HeadPal, gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return TRUE;
  }

  if ((pInputEvent->usEvent == KEY_DOWN) && (pInputEvent->usParam == 'v')) {
    // Get Soldier
    GetSoldier(&pSoldier, gusSelectedSoldier);

    // Get index of current
    CHECKF(GetPaletteRepIndexFromID(pSoldier->VestPal, &ubPaletteRep));
    ubType = gpPalRep[ubPaletteRep].ubType;

    ubPaletteRep++;

    // Count start and end index
    for (cnt = 0; cnt < ubType; cnt++) {
      ubStartRep = (UINT8)(ubStartRep + gubpNumReplacementsPerRange[cnt]);
    }

    ubEndRep = (UINT8)(ubStartRep + gubpNumReplacementsPerRange[ubType]);

    if (ubPaletteRep == ubEndRep) {
      ubPaletteRep = ubStartRep;
    }
    SET_PALETTEREP_ID(pSoldier->VestPal, gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return TRUE;
  }

  if ((pInputEvent->usEvent == KEY_DOWN) && (pInputEvent->usParam == 'p')) {
    // Get Soldier
    GetSoldier(&pSoldier, gusSelectedSoldier);

    // Get index of current
    CHECKF(GetPaletteRepIndexFromID(pSoldier->PantsPal, &ubPaletteRep));
    ubType = gpPalRep[ubPaletteRep].ubType;

    ubPaletteRep++;

    // Count start and end index
    for (cnt = 0; cnt < ubType; cnt++) {
      ubStartRep = (UINT8)(ubStartRep + gubpNumReplacementsPerRange[cnt]);
    }

    ubEndRep = (UINT8)(ubStartRep + gubpNumReplacementsPerRange[ubType]);

    if (ubPaletteRep == ubEndRep) {
      ubPaletteRep = ubStartRep;
    }
    SET_PALETTEREP_ID(pSoldier->PantsPal, gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return TRUE;
  }

  if ((pInputEvent->usEvent == KEY_DOWN) && (pInputEvent->usParam == 's')) {
    // Get Soldier
    GetSoldier(&pSoldier, gusSelectedSoldier);

    // Get index of current
    CHECKF(GetPaletteRepIndexFromID(pSoldier->SkinPal, &ubPaletteRep));
    ubType = gpPalRep[ubPaletteRep].ubType;

    ubPaletteRep++;

    // Count start and end index
    for (cnt = 0; cnt < ubType; cnt++) {
      ubStartRep = (UINT8)(ubStartRep + gubpNumReplacementsPerRange[cnt]);
    }

    ubEndRep = (UINT8)(ubStartRep + gubpNumReplacementsPerRange[ubType]);

    if (ubPaletteRep == ubEndRep) {
      ubPaletteRep = ubStartRep;
    }
    SET_PALETTEREP_ID(pSoldier->SkinPal, gpPalRep[ubPaletteRep].ID);

    CreateSoldierPalettes(pSoldier);

    return TRUE;
  }

  return FALSE;
}

function DebugScreenInit(): UINT32 {
  return TRUE;
}

function CheckForAndExitTacticalDebug(): BOOLEAN {
  if (gfExitDebugScreen) {
    FirstTime = TRUE;
    gfInitRect = TRUE;
    gfExitDebugScreen = FALSE;
    FreeBackgroundRect(guiBackgroundRect);
    SetRenderHook((RENDER_HOOK)NULL);
    SetUIKeyboardHook((UIKEYBOARD_HOOK)NULL);

    return TRUE;
  }

  return FALSE;
}

function ExitDebugScreen(): void {
  if (guiCurrentScreen == DEBUG_SCREEN) {
    gfExitDebugScreen = TRUE;
  }

  CheckForAndExitTacticalDebug();
}

function DebugScreenHandle(): UINT32 {
  if (CheckForAndExitTacticalDebug()) {
    return GAME_SCREEN;
  }

  if (gfInitRect) {
    guiBackgroundRect = RegisterBackgroundRect(BGND_FLAG_PERMANENT, NULL, 0, 0, 600, 360);
    gfInitRect = FALSE;
  }

  if (FirstTime) {
    FirstTime = FALSE;

    SetRenderHook((RENDER_HOOK)DebugRenderHook);
    SetUIKeyboardHook((UIKEYBOARD_HOOK)DebugKeyboardHook);
  } else {
    (*(GameScreens[GAME_SCREEN].HandleScreen))();
  }

  return DEBUG_SCREEN;
}

function DebugScreenShutdown(): UINT32 {
  return TRUE;
}

function DebugRenderHook(): void {
  gDebugRenderOverride[gCurDebugPage]();
}

function DebugKeyboardHook(pInputEvent: Pointer<InputAtom>): BOOLEAN {
  if ((pInputEvent->usEvent == KEY_UP) && (pInputEvent->usParam == 'q')) {
    gfExitDebugScreen = TRUE;
    return TRUE;
  }

  if ((pInputEvent->usEvent == KEY_UP) && (pInputEvent->usParam == PGUP)) {
    // Page down
    gCurDebugPage++;

    if (gCurDebugPage == MAX_DEBUG_PAGES) {
      gCurDebugPage = 0;
    }

    FreeBackgroundRect(guiBackgroundRect);
    gfInitRect = TRUE;
  }

  if ((pInputEvent->usEvent == KEY_UP) && (pInputEvent->usParam == PGDN)) {
    // Page down
    gCurDebugPage--;

    if (gCurDebugPage < 0) {
      gCurDebugPage = MAX_DEBUG_PAGES - 1;
    }

    FreeBackgroundRect(guiBackgroundRect);
    gfInitRect = TRUE;
  }

  return FALSE;
}

function SetDebugRenderHook(pDebugRenderOverride: RENDER_HOOK, ubPage: INT8): void {
  gDebugRenderOverride[ubPage] = pDebugRenderOverride;
}

function DefaultDebugPage1(): void {
  SetFont(LARGEFONT1);
  gprintf(0, 0, L"DEBUG PAGE ONE");
}

function DefaultDebugPage2(): void {
  SetFont(LARGEFONT1);
  gprintf(0, 0, L"DEBUG PAGE TWO");
}

function DefaultDebugPage3(): void {
  SetFont(LARGEFONT1);
  gprintf(0, 0, L"DEBUG PAGE THREE");
}

function DefaultDebugPage4(): void {
  SetFont(LARGEFONT1);
  gprintf(0, 0, L"DEBUG PAGE FOUR");
}

function SexScreenInit(): UINT32 {
  return TRUE;
}

const SMILY_DELAY = 100;
const SMILY_END_DELAY = 1000;

function SexScreenHandle(): UINT32 {
  static UINT8 ubCurrentScreen = 0;
  VOBJECT_DESC VObjectDesc;
  static UINT32 guiSMILY;
  static INT8 bCurFrame = 0;
  static UINT32 uiTimeOfLastUpdate = 0, uiTime;
  ETRLEObject *pTrav;
  HVOBJECT hVObject;
  INT16 sX, sY;

  // OK, Clear screen and show smily face....
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  InvalidateScreen();
  // Remove cursor....
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  if (ubCurrentScreen == 0) {
    // Load face....
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("INTERFACE\\luckysmile.sti", VObjectDesc.ImageFile);
    if (!AddVideoObject(&VObjectDesc, &guiSMILY))
      AssertMsg(0, "Missing INTERFACE\\luckysmile.sti");

    // Init screen
    bCurFrame = 0;

    ubCurrentScreen = 1;

    uiTimeOfLastUpdate = GetJA2Clock();

    return SEX_SCREEN;
  }

  // Update frame
  uiTime = GetJA2Clock();

  // if we are animation smile...
  if (ubCurrentScreen == 1) {
    PlayJA2StreamingSampleFromFile("Sounds\\Sex.wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN, NULL);
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
      WarpGameTime(((5 + Random(20)) * NUM_SEC_IN_MIN), WARPTIME_NO_PROCESSING_OF_EVENTS);

      return GAME_SCREEN;
    }
  }

  // Calculate smily face positions...
  GetVideoObject(&hVObject, guiSMILY);
  pTrav = &(hVObject->pETRLEObject[0]);

  sX = (INT16)((640 - pTrav->usWidth) / 2);
  sY = (INT16)((480 - pTrav->usHeight) / 2);

  if (bCurFrame < 24) {
    BltVideoObjectFromIndex(FRAME_BUFFER, guiSMILY, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, NULL);
  } else {
    BltVideoObjectFromIndex(FRAME_BUFFER, guiSMILY, (INT8)(bCurFrame % 8), sX, sY, VO_BLT_SRCTRANSPARENCY, NULL);
  }

  InvalidateRegion(sX, sY, (INT16)(sX + pTrav->usWidth), (INT16)(sY + pTrav->usHeight));

  return SEX_SCREEN;
}

function SexScreenShutdown(): UINT32 {
  return TRUE;
}

function DemoExitScreenInit(): UINT32 {
  return TRUE;
}

function DoneFadeOutForDemoExitScreen(): void {
  gfProgramIsRunning = FALSE;
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

function DemoExitScreenHandle(): UINT32 {
  gfProgramIsRunning = FALSE;
  return DEMO_EXIT_SCREEN;
}

function DemoExitScreenShutdown(): UINT32 {
  return TRUE;
}
