const ARE_IN_FADE_IN = () => (gfFadeIn || gfFadeInitialized);

let fDirtyRectangleMode: BOOLEAN = FALSE;
let gpFPSBuffer: Pointer<UINT16> = NULL;
// MarkNote
// extern ScrollStringStPtr pStringS=NULL;
let counter: UINT32 = 0;
let count: UINT32 = 0;
let gfTacticalDoHeliRun: BOOLEAN = FALSE;
let gfPlayAttnAfterMapLoad: BOOLEAN = FALSE;

// VIDEO OVERLAYS
let giFPSOverlay: INT32 = 0;
let giCounterPeriodOverlay: INT32 = 0;

let gfExitToNewSector: BOOLEAN = FALSE;
// UINT8		gubNewSectorExitDirection;

let gfGameScreenLocateToSoldier: BOOLEAN = FALSE;
let gfEnteringMapScreen: BOOLEAN = FALSE;
let uiOldMouseCursor: UINT32;
let gubPreferredInitialSelectedGuy: UINT8 = NOBODY;

let gfTacticalIsModal: BOOLEAN = FALSE;
let gTacticalDisableRegion: MOUSE_REGION;
let gfTacticalDisableRegionActive: BOOLEAN = FALSE;
let gbTacticalDisableMode: INT8 = FALSE;
let gModalDoneCallback: MODAL_HOOK;
let gfBeginEndTurn: BOOLEAN = FALSE;

// The InitializeGame function is responsible for setting up all data and Gaming Engine
// tasks which will run the game
let gRenderOverride: RENDER_HOOK = NULL;

const NOINPUT_DELAY = 60000;
const DEMOPLAY_DELAY = 40000;
const RESTART_DELAY = 6000;

let guiTacticalLeaveScreenID: UINT32;
let guiTacticalLeaveScreen: BOOLEAN = FALSE;

function MainGameScreenInit(): UINT32 {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC;

  gpZBuffer = InitZBuffer(1280, 480);
  InitializeBackgroundRects();

  // EnvSetTimeInHours(ENV_TIME_12);

  SetRenderFlags(RENDER_FLAG_FULL);

  // Init Video Overlays
  // FIRST, FRAMERATE
  VideoOverlayDesc.sLeft = 0;
  VideoOverlayDesc.sTop = 0;
  VideoOverlayDesc.uiFontID = SMALLFONT1;
  VideoOverlayDesc.ubFontBack = FONT_MCOLOR_BLACK;
  VideoOverlayDesc.ubFontFore = FONT_MCOLOR_DKGRAY;
  VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
  VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
  swprintf(VideoOverlayDesc.pzText, "90");
  VideoOverlayDesc.BltCallback = BlitMFont;
  giFPSOverlay = RegisterVideoOverlay((VOVERLAY_STARTDISABLED | VOVERLAY_DIRTYBYTEXT), &VideoOverlayDesc);

  // SECOND, PERIOD COUNTER
  VideoOverlayDesc.sLeft = 30;
  VideoOverlayDesc.sTop = 0;
  VideoOverlayDesc.sX = VideoOverlayDesc.sLeft;
  VideoOverlayDesc.sY = VideoOverlayDesc.sTop;
  swprintf(VideoOverlayDesc.pzText, "Levelnodes: 100000");
  VideoOverlayDesc.BltCallback = BlitMFont;
  giCounterPeriodOverlay = RegisterVideoOverlay((VOVERLAY_STARTDISABLED | VOVERLAY_DIRTYBYTEXT), &VideoOverlayDesc);

  // register debug topics
  RegisterJA2DebugTopic(TOPIC_JA2, "Reg JA2 Debug");
  // MarkNote

  return TRUE;
}

// The ShutdownGame function will free up/undo all things that were started in InitializeGame()
// It will also be responsible to making sure that all Gaming Engine tasks exit properly

function MainGameScreenShutdown(): UINT32 {
  ShutdownZBuffer(gpZBuffer);
  ShutdownBackgroundRects();

  // Remove video Overlays
  RemoveVideoOverlay(giFPSOverlay);

  return TRUE;
}

function FadeInGameScreen(): void {
  fFirstTimeInGameScreen = TRUE;

  FadeInNextFrame();
}

function FadeOutGameScreen(): void {
  FadeOutNextFrame();
}

function EnterTacticalScreen(): void {
  guiTacticalLeaveScreen = FALSE;

  SetPositionSndsActive();

  // Set pending screen
  SetPendingNewScreen(GAME_SCREEN);

  // Set as active...
  gTacticalStatus.uiFlags |= ACTIVE;

  fInterfacePanelDirty = DIRTYLEVEL2;

  // Disable all faces
  SetAllAutoFacesInactive();

  // CHECK IF OURGUY IS NOW OFF DUTY
  if (gusSelectedSoldier != NOBODY) {
    if (!OK_CONTROLLABLE_MERC(MercPtrs[gusSelectedSoldier])) {
      SelectNextAvailSoldier(MercPtrs[gusSelectedSoldier]);
    }
    // ATE: If the current guy is sleeping, change....
    if (MercPtrs[gusSelectedSoldier]->fMercAsleep) {
      SelectNextAvailSoldier(MercPtrs[gusSelectedSoldier]);
    }
  } else {
    // otherwise, make sure interface is team panel...
    SetCurrentInterfacePanel(TEAM_PANEL);
  }

  if (!gfTacticalPlacementGUIActive) {
    MSYS_EnableRegion(&gRadarRegion);
  }
  MSYS_EnableRegion(&gViewportRegion);

  // set default squad on sector entry
  // ATE: moved these 2 call after initalizing the interface!
  // SetDefaultSquadOnSectorEntry( FALSE );
  // ExamineCurrentSquadLights( );

  // UpdateMercsInSector( gWorldSectorX, gWorldSectorY, gbWorldSectorZ );

  // Init interface ( ALWAYS TO TEAM PANEL.  DEF changed it to go back to the previous panel )
  if (!gfTacticalPlacementGUIActive) {
    // make sure the gsCurInterfacePanel is valid
    if (gsCurInterfacePanel < 0 || gsCurInterfacePanel >= NUM_UI_PANELS)
      gsCurInterfacePanel = TEAM_PANEL;

    SetCurrentInterfacePanel(gsCurInterfacePanel);
  }

  SetTacticalInterfaceFlags(0);

  // set default squad on sector entry
  SetDefaultSquadOnSectorEntry(FALSE);
  ExamineCurrentSquadLights();

  fFirstTimeInGameScreen = FALSE;

  // Make sure it gets re-created....
  DirtyTopMessage();

  // Set compression to normal!
  // SetGameTimeCompressionLevel( TIME_COMPRESS_X1 );

  // Select current guy...
  // gfGameScreenLocateToSoldier = TRUE;

  // Locate if in meanwhile...
  if (AreInMeanwhile()) {
    LocateToMeanwhileCharacter();
  }

  if (gTacticalStatus.uiFlags & IN_DEIDRANNA_ENDGAME) {
    InternalLocateGridNo(4561, TRUE);
  }

  // Clear tactical message q
  ClearTacticalMessageQueue();

  // ATE: Enable messages again...
  EnableScrollMessages();
}

function LeaveTacticalScreen(uiNewScreen: UINT32): void {
  guiTacticalLeaveScreenID = uiNewScreen;
  guiTacticalLeaveScreen = TRUE;
}

function InternalLeaveTacticalScreen(uiNewScreen: UINT32): void {
  gpCustomizableTimerCallback = NULL;

  // unload the sector they teleported out of
  if (!gfAutomaticallyStartAutoResolve) {
    CheckAndHandleUnloadingOfCurrentWorld();
  }

  SetPositionSndsInActive();

  // Turn off active flag
  gTacticalStatus.uiFlags &= (~ACTIVE);

  fFirstTimeInGameScreen = TRUE;

  SetPendingNewScreen(uiNewScreen);

  // Disable all faces
  SetAllAutoFacesInactive();

  ResetInterfaceAndUI();

  // Remove cursor and reset height....
  gsGlobalCursorYOffset = 0;
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  // Shutdown panel
  ShutdownCurrentPanel();

  // disable the radar map
  MSYS_DisableRegion(&gRadarRegion);
  // MSYS_DisableRegion( &gViewportRegion );

  // We are leaving... turn off pedning autobadage...
  SetAutoBandagePending(FALSE);

  // ATE: Disable messages....
  DisableScrollMessages();

  if (uiNewScreen == MAINMENU_SCREEN) {
    // We want to reinitialize the game
    ReStartingGame();
  }

  if (uiNewScreen != MAP_SCREEN) {
    StopAnyCurrentlyTalkingSpeech();
  }

  // If we have some disabled screens up.....remove...
  CheckForDisabledRegionRemove();

  // ATE: Record last time we were in tactical....
  gTacticalStatus.uiTimeSinceLastInTactical = GetWorldTotalMin();

  FinishAnySkullPanelAnimations();
}

function MainGameScreenHandle(): UINT32 {
  let uiNewScreen: UINT32 = GAME_SCREEN;
  let fEnterDemoMode: BOOLEAN = FALSE;

  // DO NOT MOVE THIS FUNCTION CALL!!!
  // This determines if the help screen should be active
  //	if( ( !gfTacticalDoHeliRun && !gfFirstHeliRun ) && ShouldTheHelpScreenComeUp( HELP_SCREEN_TACTICAL, FALSE ) )
  if (!gfPreBattleInterfaceActive && ShouldTheHelpScreenComeUp(HELP_SCREEN_TACTICAL, FALSE)) {
    // handle the help screen
    HelpScreenHandler();
    return GAME_SCREEN;
  }

  if (HandleAutoBandage()) {
    return GAME_SCREEN;
  }

  if (gfBeginEndTurn) {
    UIHandleEndTurn(NULL);
    gfBeginEndTurn = FALSE;
  }

  /*
          if ( gfExitToNewSector )
          {
                  // Shade screen one frame
                  if ( gfExitToNewSector == 1 )
                  {
                          // Disable any saved regions!
                          EmptyBackgroundRects( );

                          // Remove cursor
                          uiOldMouseCursor = gViewportRegion.Cursor;
                          SetCurrentCursorFromDatabase( VIDEO_NO_CURSOR );

                          //Shadow area
                          ShadowVideoSurfaceRect( FRAME_BUFFER, 0, 0, 640, 480 );
                          InvalidateScreen( );

                          // Next frame please
                          gfExitToNewSector++;

                          return( GAME_SCREEN );
                  }
                  else
                  {
                          // Go into sector
                          JumpIntoAdjacentSector( gubNewSectorExitDirection );
                          gfExitToNewSector = FALSE;

                          // Restore mouse
                          SetCurrentCursorFromDatabase( uiOldMouseCursor );
                  }
          }
  */

  // The gfFailedToSaveGameWhenInsideAMessageBox flag will only be set at this point if the game fails to save during
  // a quick save and when the game was already in a message box.
  // If the game failed to save when in a message box, pop up a message box stating an error occured
  if (gfFailedToSaveGameWhenInsideAMessageBox) {
    gfFailedToSaveGameWhenInsideAMessageBox = FALSE;

    DoMessageBox(MSG_BOX_BASIC_STYLE, zSaveLoadText[SLG_SAVE_GAME_ERROR], GAME_SCREEN, MSG_BOX_FLAG_OK, NULL, NULL);

    return GAME_SCREEN;
  }

  // Check if we are in bar animation...
  if (InTopMessageBarAnimation()) {
    ExecuteBaseDirtyRectQueue();

    EndFrameBufferRender();

    return GAME_SCREEN;
  }

  if (gfTacticalIsModal) {
    if (gfTacticalIsModal == 1) {
      gfTacticalIsModal++;
    } else {
      HandleModalTactical();

      return GAME_SCREEN;
    }
  }

  // OK, this is the pause system for when we see a guy...
  if (!ARE_IN_FADE_IN()) {
    if (gTacticalStatus.fEnemySightingOnTheirTurn) {
      if ((GetJA2Clock() - gTacticalStatus.uiTimeSinceDemoOn) > 3000) {
        if (gTacticalStatus.ubCurrentTeam != gbPlayerNum) {
          AdjustNoAPToFinishMove(MercPtrs[gTacticalStatus.ubEnemySightingOnTheirTurnEnemyID], FALSE);
        }
        MercPtrs[gTacticalStatus.ubEnemySightingOnTheirTurnEnemyID]->fPauseAllAnimation = FALSE;

        gTacticalStatus.fEnemySightingOnTheirTurn = FALSE;
      }
    }
  }

  // see if the helicopter is coming in this time for the initial entrance by the mercs
  InitHelicopterEntranceByMercs();

  // Handle Environment controller here
  EnvironmentController(TRUE);

  if (!ARE_IN_FADE_IN()) {
    HandleWaitTimerForNPCTrigger();

    // Check timer that could have been set to do anything
    CheckCustomizableTimer();

    // HAndle physics engine
    SimulateWorld();

    // Handle strategic engine
    HandleStrategicTurn();
  }

  if (gfTacticalDoHeliRun) {
    gfGameScreenLocateToSoldier = FALSE;
    InternalLocateGridNo(gMapInformation.sNorthGridNo, TRUE);

    // Start heli Run...
    StartHelicopterRun(gMapInformation.sNorthGridNo);

    // Update clock by one so that our DidGameJustStatrt() returns now false for things like LAPTOP, etc...
    SetGameTimeCompressionLevel(TIME_COMPRESS_X1);
    // UpdateClock( 1 );

    gfTacticalDoHeliRun = FALSE;
    // SetMusicMode( MUSIC_TACTICAL_NOTHING );
  }

  if (InOverheadMap()) {
    HandleOverheadMap();
    return GAME_SCREEN;
  }

  if (!ARE_IN_FADE_IN()) {
    HandleAirRaid();
  }

  if (gfGameScreenLocateToSoldier) {
    TacticalScreenLocateToSoldier();
    gfGameScreenLocateToSoldier = FALSE;
  }

  if (fFirstTimeInGameScreen) {
    EnterTacticalScreen();

    // Select a guy if he hasn;'
    if (!gfTacticalPlacementGUIActive) {
      if (gusSelectedSoldier != NOBODY && OK_INTERRUPT_MERC(MercPtrs[gusSelectedSoldier])) {
        SelectSoldier(gusSelectedSoldier, FALSE, TRUE);
      }
    }
  }

  // ATE: check that this flag is not set.... display message if so
  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    // Unset
    guiTacticalInterfaceFlags &= (~INTERFACE_MAPSCREEN);
  }

  if (HandleFadeOutCallback()) {
    return GAME_SCREEN;
  }

  if (guiCurrentScreen != MSG_BOX_SCREEN) {
    if (HandleBeginFadeOut(GAME_SCREEN)) {
      return GAME_SCREEN;
    }
  }

  HandleHeliDrop();

  if (!ARE_IN_FADE_IN()) {
    HandleAutoBandagePending();
  }

  // ATE: CHRIS_C LOOK HERE FOR GETTING AI CONSTANTLY GOING
  // if ( gTacticalStatus.uiFlags & TURNBASED )
  //{
  //	if ( !(gTacticalStatus.uiFlags & ENEMYS_TURN) )
  //	{
  //		EndTurn( );
  //	}
  //}

  //	if ( gfScrollInertia == FALSE )
  {
    if (!ARE_IN_FADE_IN()) {
      UpdateBullets();

      // Execute Tactical Overhead
      ExecuteOverhead();
    }

    // Handle animated cursors
    if (gfWorldLoaded) {
      HandleAnimatedCursors();

      // Handle Interface
      uiNewScreen = HandleTacticalUI();

      // called to handle things like face panels changeing due to team panel, squad changes, etc
      // To be done AFTER HandleUI and before ExecuteOverlays( )
      HandleDialogueUIAdjustments();

      HandleTalkingAutoFaces();
    }
    else if (gfIntendOnEnteringEditor) {
      OutputDebugString("Aborting normal game mode and entering editor mode...\n");
      SetPendingNewScreen(0xffff); // NO_SCREEN
      return EDIT_SCREEN;
    }
    else if (!gfEnteringMapScreen) {
      gfEnteringMapScreen = TRUE;
    }

    if (uiNewScreen != GAME_SCREEN) {
      return uiNewScreen;
    }

    // Deque all game events
    if (!ARE_IN_FADE_IN()) {
      DequeAllGameEvents(TRUE);
    }
  }

  /////////////////////////////////////////////////////
  StartFrameBufferRender();

  HandleTopMessages();

  if (gfScrollPending || gfScrollInertia) {
  } else {
    // Handle Interface Stuff
    SetUpInterface();
    HandleTacticalPanelSwitch();
  }

  // Handle Scroll Of World
  ScrollWorld();

  // SetRenderFlags( RENDER_FLAG_FULL );

  RenderWorld();

  if (gRenderOverride != NULL) {
    gRenderOverride();
  }

  if (gfScrollPending || gfScrollInertia) {
    RenderTacticalInterfaceWhileScrolling();
  } else {
    // Handle Interface Stuff
    // RenderTacticalInterface( );
  }

  // Render Interface
  RenderTopmostTacticalInterface();

  // Render view window
  RenderRadarScreen();

  ResetInterface();

  if (gfScrollPending) {
    AllocateVideoOverlaysArea();
    SaveVideoOverlaysArea(FRAME_BUFFER);
    ExecuteVideoOverlays();
  } else {
    ExecuteVideoOverlays();
  }

  // Adding/deleting of video overlays needs to be done below
  // ExecuteVideoOverlays( )....

  // Handle dialogue queue system
  if (!ARE_IN_FADE_IN()) {
    if (gfPlayAttnAfterMapLoad) {
      gfPlayAttnAfterMapLoad = FALSE;

      if (gusSelectedSoldier != NOBODY) {
        if (!gGameSettings.fOptions[TOPTION_MUTE_CONFIRMATIONS])
          DoMercBattleSound(MercPtrs[gusSelectedSoldier], BATTLE_SOUND_ATTN1);
      }
    }

    HandleDialogue();
  }

  // Don't render if we have a scroll pending!
  if (!gfScrollPending && !gfScrollInertia && !gfRenderFullThisFrame) {
    RenderButtonsFastHelp();
  }

  // Display Framerate
  DisplayFrameRate();

  CheckForMeanwhileOKStart();

  ScrollString();

  ExecuteBaseDirtyRectQueue();

  // KillBackgroundRects( );

  /////////////////////////////////////////////////////
  EndFrameBufferRender();

  if (HandleFadeInCallback()) {
    // Re-render the scene!
    SetRenderFlags(RENDER_FLAG_FULL);
    fInterfacePanelDirty = DIRTYLEVEL2;
  }

  if (HandleBeginFadeIn(GAME_SCREEN)) {
    guiTacticalLeaveScreenID = FADE_SCREEN;
  }

  if (guiTacticalLeaveScreen) {
    guiTacticalLeaveScreen = FALSE;

    InternalLeaveTacticalScreen(guiTacticalLeaveScreenID);
  }

  // Check if we are to enter map screen
  if (gfEnteringMapScreen == 2) {
    gfEnteringMapScreen = FALSE;
    EnterMapScreen();
  }

  // Are we entering map screen? if so, wait a frame!
  if (gfEnteringMapScreen > 0) {
    gfEnteringMapScreen++;
  }

  return GAME_SCREEN;
}

function SetRenderHook(pRenderOverride: RENDER_HOOK): void {
  gRenderOverride = pRenderOverride;
}

function DisableFPSOverlay(fEnable: BOOLEAN): void {
  let VideoOverlayDesc: VIDEO_OVERLAY_DESC;

  memset(&VideoOverlayDesc, 0, sizeof(VideoOverlayDesc));

  VideoOverlayDesc.fDisabled = fEnable;
  VideoOverlayDesc.uiFlags = VOVERLAY_DESC_DISABLED;

  UpdateVideoOverlay(&VideoOverlayDesc, giFPSOverlay, FALSE);
  UpdateVideoOverlay(&VideoOverlayDesc, giCounterPeriodOverlay, FALSE);
}

function TacticalScreenLocateToSoldier(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bLastTeamID: INT16;
  let fPreferedGuyUsed: BOOLEAN = FALSE;

  if (gubPreferredInitialSelectedGuy != NOBODY) {
    // ATE: Put condition here...
    if (OK_CONTROLLABLE_MERC(MercPtrs[gubPreferredInitialSelectedGuy]) && OK_INTERRUPT_MERC(MercPtrs[gubPreferredInitialSelectedGuy])) {
      LocateSoldier(gubPreferredInitialSelectedGuy, 10);
      SelectSoldier(gubPreferredInitialSelectedGuy, FALSE, TRUE);
      fPreferedGuyUsed = TRUE;
    }
    gubPreferredInitialSelectedGuy = NOBODY;
  }

  if (!fPreferedGuyUsed) {
    // Set locator to first merc
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;
    for (pSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pSoldier++) {
      if (OK_CONTROLLABLE_MERC(pSoldier) && OK_INTERRUPT_MERC(pSoldier)) {
        LocateSoldier(pSoldier->ubID, 10);
        SelectSoldier(pSoldier->ubID, FALSE, TRUE);
        break;
      }
    }
  }
}

function EnterMapScreen(): void {
  // ATE: These flags well get set later on in mapscreen....
  // SetTacticalInterfaceFlags( INTERFACE_MAPSCREEN );
  // fInterfacePanelDirty = DIRTYLEVEL2;
  LeaveTacticalScreen(MAP_SCREEN);
}

function UpdateTeamPanelAssignments(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bLastTeamID: INT16;

  // Remove all players
  RemoveAllPlayersFromSlot();

  // Set locator to first merc
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;
  for (pSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pSoldier++) {
    // Setup team interface
    CheckForAndAddMercToTeamPanel(pSoldier);
  }
}

function EnterModalTactical(bMode: INT8): void {
  gbTacticalDisableMode = bMode;
  gfTacticalIsModal = TRUE;

  if (gbTacticalDisableMode == TACTICAL_MODAL_NOMOUSE) {
    if (!gfTacticalDisableRegionActive) {
      gfTacticalDisableRegionActive = TRUE;

      MSYS_DefineRegion(&gTacticalDisableRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGH, VIDEO_NO_CURSOR, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
      // Add region
      MSYS_AddRegion(&gTacticalDisableRegion);
    }
  }

  UpdateSaveBuffer();
}

function EndModalTactical(): void {
  if (gfTacticalDisableRegionActive) {
    MSYS_RemoveRegion(&gTacticalDisableRegion);

    gfTacticalDisableRegionActive = FALSE;
  }

  if (gModalDoneCallback != NULL) {
    gModalDoneCallback();

    gModalDoneCallback = NULL;
  }

  gfTacticalIsModal = FALSE;

  SetRenderFlags(RENDER_FLAG_FULL);
}

function HandleModalTactical(): void {
  StartFrameBufferRender();

  RestoreBackgroundRects();

  RenderWorld();
  RenderRadarScreen();
  ExecuteVideoOverlays();

  // Handle dialogue queue system
  HandleDialogue();

  HandleTalkingAutoFaces();

  // Handle faces
  HandleAutoFaces();

  if (gfInSectorExitMenu) {
    RenderSectorExitMenu();
  }
  RenderButtons();

  SaveBackgroundRects();
  RenderButtonsFastHelp();
  RenderPausedGameBox();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();
}

function InitHelicopterEntranceByMercs(): void {
  if (DidGameJustStart()) {
    let AirRaidDef: AIR_RAID_DEFINITION;

    // Update clock ahead from STARTING_TIME to make mercs arrive!
    WarpGameTime(FIRST_ARRIVAL_DELAY, WARPTIME_PROCESS_EVENTS_NORMALLY);

    AirRaidDef.sSectorX = 9;
    AirRaidDef.sSectorY = 1;
    AirRaidDef.sSectorZ = 0;
    AirRaidDef.bIntensity = 2;
    AirRaidDef.uiFlags = AIR_RAID_BEGINNING_GAME;
    AirRaidDef.ubNumMinsFromCurrentTime = 1;

    //	ScheduleAirRaid( &AirRaidDef );

    gfTacticalDoHeliRun = TRUE;
    gfFirstHeliRun = TRUE;

    gTacticalStatus.fDidGameJustStart = FALSE;
  }
}
