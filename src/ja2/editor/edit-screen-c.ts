let gfCorruptMap: BOOLEAN = FALSE;
let gfCorruptSchedules: BOOLEAN = FALSE;
let gfProfileDataLoaded: BOOLEAN = FALSE;

let gpPersistantButton: Pointer<GUI_BUTTON>;

// These are global variables used by the main game loop

let guiSaveTacticalStatusFlags: UINT32; // saves the tactical status flags when entering the editor.

let gfAutoLoadA9: BOOLEAN = FALSE;
// new vars added by Kris
let gfRenderWorld: BOOLEAN = FALSE;
let gfRenderTaskbar: BOOLEAN = FALSE;
let gfRenderDrawingMode: BOOLEAN = FALSE;
let gfFirstPlacement: BOOLEAN = TRUE;
let gfPendingBasement: BOOLEAN = FALSE;
let gfPendingCaves: BOOLEAN = FALSE;
let gfNeedToInitGame: BOOLEAN = FALSE;
let gfScheduleReversalPending: BOOLEAN = FALSE;
let gfRemoveLightsPending: BOOLEAN = FALSE;
let gfScheduleClearPending: BOOLEAN = FALSE;
let gfConfirmExitFirst: BOOLEAN = TRUE;
let gfConfirmExitPending: BOOLEAN = FALSE;
let gfIntendOnEnteringEditor: BOOLEAN = FALSE;

// original
let gubFilename: UINT8[] /* [200] */;
let gsBanksSubIndex: INT16 = 0;
let gsOldBanksSubIndex: INT16 = 1;
let gsCliffsSubIndex: INT16 = 0;
let gsOldCliffsSubIndex: INT16 = 1;
let gfSwitchScreen: BOOLEAN = FALSE;
let gDoTest: BOOLEAN = FALSE;
let gDoTest2: BOOLEAN = FALSE;
let gShadePercent: FLOAT = 0.65;
let gusCurrentRoofType: INT16 = ONELEVELTYPEONEROOF;

let gusLightLevel: UINT16 = 0;
let gusGameLightLevel: UINT16 = 0;
let gusSavedLightLevel: UINT16 = 0;
let gfFakeLights: BOOLEAN = FALSE;

let gsLightRadius: INT16 = 5;

let gfOldDoVideoScroll: BOOLEAN; // Saved for returning to previous settings
let gubOldCurScrollSpeedID: UINT8; // Saved for returning to previous settings

let iOldTaskMode: INT32 = TASK_OPTIONS;

let iTaskMode: INT32 = TASK_NONE;

let iEditorTBarButton: INT32[] /* [NUMBER_EDITOR_BUTTONS] */; // For Toolbars

let gfMercResetUponEditorEntry: BOOLEAN;

let fHelpScreen: BOOLEAN = FALSE;

let fDontUseRandom: BOOLEAN = FALSE;

let TestButtons: INT32[] /* [10] */;

let gCursorNode: Pointer<LEVELNODE> = NULL;
// LEVELNODE *gBasicCursorNode = NULL;
let gsCursorGridNo: INT16;

let giMusicID: INT32 = 0;

let gfEditorDirty: BOOLEAN = TRUE;

let fRaiseHeight: BOOLEAN = FALSE;

let iDrawMode: INT32 = DRAW_MODE_NOTHING;
let iCurrentAction: INT32;
let iActionParam: INT32;
let iEditAction: INT32 = ACTION_NULL;

let iEditorButton: INT32[] /* [NUMBER_EDITOR_BUTTONS] */;
let iEditorToolbarState: INT32;
let iJA2ToolbarLastWallState: INT32;

let iCurrentTaskbar: INT32;

let iCurBankMapIndex: UINT16;

let EditorInputEvent: InputAtom;
let fBeenWarned: BOOLEAN = FALSE;
let fEditModeFirstTime: BOOLEAN = TRUE;
let fFirstTimeInEditModeInit: BOOLEAN = TRUE;
let fSelectionWindow: BOOLEAN = FALSE;
let gfRealGunNut: BOOLEAN = TRUE;

let sGridX: INT16;
let sGridY: INT16;
let iMapIndex: UINT32;
let fNewMap: BOOLEAN = FALSE;

let iPrevDrawMode: INT32 = DRAW_MODE_NOTHING;
let PrevCurrentPaste: UINT16 = FIRSTTEXTURE;
let gPrevCurrentBackground: INT32 = FIRSTTEXTURE;
let iPrevJA2ToolbarState: INT32 = TBAR_MODE_NONE;
let PrevTerrainTileDrawMode: INT32 = TERRAIN_TILES_NODRAW;

let gusEditorTaskbarColor: UINT16;
let gusEditorTaskbarHiColor: UINT16;
let gusEditorTaskbarLoColor: UINT16;

let gfGotoGridNoUI: BOOLEAN = FALSE;
let guiGotoGridNoUIButtonID: INT32;
let GotoGridNoUIRegion: MOUSE_REGION;

//----------------------------------------------------------------------------------------------
//	EditScreenInit
//
//	This function is called once at SGP (and game) startup
//
function EditScreenInit(): UINT32 {
  gfFakeLights = FALSE;

  eInfo.fGameInit = TRUE;
  GameInitEditorBuildingInfo();
  GameInitEditorMercsInfo();

  // Set the editor colors.
  // gusEditorTaskbarColor = 9581;
  // gusEditorTaskbarColor =		Get16BPPColor( FROMRGB(  72,  88, 104 ) );
  // gusEditorTaskbarHiColor = Get16BPPColor( FROMRGB( 136, 138, 135 ) );
  // gusEditorTaskbarLoColor = Get16BPPColor( FROMRGB(  24,  61,  81 ) );

  gusEditorTaskbarColor = Get16BPPColor(FROMRGB(65, 79, 94));
  gusEditorTaskbarHiColor = Get16BPPColor(FROMRGB(122, 124, 121));
  gusEditorTaskbarLoColor = Get16BPPColor(FROMRGB(22, 55, 73));

  InitClipboard();

  InitializeRoadMacros();

  InitArmyGunTypes();

  return TRUE;
}

//----------------------------------------------------------------------------------------------
//	EditScreenShutdown
//
//	This function is called once at shutdown of the game
//
function EditScreenShutdown(): UINT32 {
  GameShutdownEditorMercsInfo();
  RemoveAllFromUndoList();
  KillClipboard();
  return TRUE;
}

//----------------------------------------------------------------------------------------------
//	EditModeInit
//
//	Editor's Init code. Called each time we enter edit mode from the game.
//
function EditModeInit(): BOOLEAN {
  let x: UINT32;
  let i: INT32;
  let LColors: SGPPaletteEntry[] /* [2] */;

  OutputDebugString("Entering editor mode...\n");

  gfRealGunNut = gGameOptions.fGunNut;
  gGameOptions.fGunNut = TRUE;

  if (!gfProfileDataLoaded)
    LoadMercProfiles();

  ClearTacticalMessageQueue();

  PauseGame();
  fEditModeFirstTime = FALSE;

  DisableButtonHelpTextRestore();

  if (fFirstTimeInEditModeInit) {
    if (gfWorldLoaded)
      InitJA2SelectionWindow();
    fFirstTimeInEditModeInit = FALSE;
  }

  // Initialize editor specific stuff for each Taskbar.
  EntryInitEditorTerrainInfo();
  EntryInitEditorItemsInfo();
  EntryInitEditorMercsInfo();

  LightGetColors(LColors);
  gEditorLightColor = LColors[0];

  // essentially, we are turning the game off so the game doesn't process in conjunction with the
  // editor.
  guiSaveTacticalStatusFlags = (gTacticalStatus.uiFlags & ~DEMOMODE);
  gTacticalStatus.uiFlags &= ~REALTIME;
  gTacticalStatus.uiFlags |= TURNBASED | SHOW_ALL_ITEMS;
  gTacticalStatus.uiTimeOfLastInput = GetJA2Clock();
  gTacticalStatus.uiTimeSinceDemoOn = gTacticalStatus.uiTimeOfLastInput;
  gTacticalStatus.fGoingToEnterDemo = FALSE;

  // Remove the radar from the interface.
  RemoveCurrentTacticalPanelButtons();
  MSYS_DisableRegion(&gRadarRegion);

  CreateEditorTaskbar();

  // Hide all of the buttons here.  DoTaskbar() will handle the
  // showing and hiding of the buttons.
  for (x = LAST_EDITORTAB_BUTTON + 1; x < NUMBER_EDITOR_BUTTONS; x++)
    HideButton(iEditorButton[x]);

  iEditorToolbarState = iPrevJA2ToolbarState;
  iDrawMode = iPrevDrawMode;
  CurrentPaste = PrevCurrentPaste;
  gCurrentBackground = gPrevCurrentBackground;

  iCurrentTaskbar = TASK_NONE;
  iTaskMode = iOldTaskMode;

  DoTaskbar();

  fDontUseRandom = FALSE;
  fSelectionWindow = FALSE;

  // Set renderer to ignore redundency
  gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;

  fHelpScreen = FALSE;

  gfEditMode = TRUE;
  fNewMap = FALSE;

  gfEditingDoor = FALSE;

  gusGameLightLevel = LightGetAmbient();
  if (!gfBasement && !gfCaves)
    gusLightLevel = 12; // EDITOR_LIGHT_MAX - (UINT16)LightGetAmbient();
  else
    gusLightLevel = EDITOR_LIGHT_MAX - LightGetAmbient();

  if (gfFakeLights) {
    gusSavedLightLevel = gusLightLevel;
    gusLightLevel = EDITOR_LIGHT_FAKE;
    ClickEditorButton(MAPINFO_TOGGLE_FAKE_LIGHTS);
  }

  gfRenderWorld = TRUE;
  gfRenderTaskbar = TRUE;

  // Reset the corruption detection flags.
  gfCorruptMap = FALSE;
  gfCorruptSchedules = FALSE;

  // save old scrolling mode, set renderer to not use video scroll
  gfOldDoVideoScroll = gfDoVideoScroll;
  gubOldCurScrollSpeedID = gubCurScrollSpeedID;
  /// set new ones

  gfRoofPlacement = FALSE;

  EnableUndo();

  RemoveMercsInSector();
  if (gfWorldLoaded) {
    gfConfirmExitFirst = TRUE;
    ShowEntryPoints();
    PrepareSchedulesForEditorEntry();
    if (gfMercResetUponEditorEntry) {
      UseEditorOriginalList();
      ResetAllMercPositions();
    } else
      UseEditorAlternateList();
    BuildItemPoolList();
    SetEditorSmoothingMode(gMapInformation.ubEditorSmoothingType);
    AddLockedDoorCursors();

    for (i = 0; i < MAX_LIGHT_SPRITES; i++) {
      if (LightSprites[i].uiFlags & LIGHT_SPR_ACTIVE && !(LightSprites[i].uiFlags & (LIGHT_SPR_ON | MERC_LIGHT))) {
        LightSpritePower(i, TRUE);
      }
    }

    if (gfShowPits) {
      AddAllPits();
    }

    LightSetBaseLevel((EDITOR_LIGHT_MAX - gusLightLevel));
    ShowLightPositionHandles();
    LightSpriteRenderAll();
  } else {
    OutputDebugString("Creating summary window...\n");
    CreateSummaryWindow();
    gfNeedToInitGame = TRUE;
  }

  SetMercTeamVisibility(ENEMY_TEAM, gfShowEnemies);
  SetMercTeamVisibility(CREATURE_TEAM, gfShowCreatures);
  SetMercTeamVisibility(MILITIA_TEAM, gfShowRebels);
  SetMercTeamVisibility(CIV_TEAM, gfShowCivilians);

  // remove mouse region for pause of game
  RemoveMouseRegionForPauseOfClock();

  gfIntendOnEnteringEditor = FALSE;

  OutputDebugString("Finished entering editor mode...\n");

  return TRUE;
}

//----------------------------------------------------------------------------------------------
//	EditModeShutdown
//
//	The above function's counterpart. Called when exiting the editor back to the game.
function EditModeShutdown(): BOOLEAN {
  if (gfConfirmExitFirst) {
    gfConfirmExitPending = TRUE;
    CreateMessageBox("Exit editor?");
    return FALSE;
  }

  gfEditMode = FALSE;
  fEditModeFirstTime = TRUE;

  UpdateLastActionBeforeLeaving();

  DeleteEditorTaskbar();

  // create clock mouse region for clock pause
  CreateMouseRegionForPauseOfClock(CLOCK_REGION_START_X, CLOCK_REGION_START_Y);

  iOldTaskMode = iCurrentTaskbar;
  gTacticalStatus.uiFlags = guiSaveTacticalStatusFlags;

  RemoveLightPositionHandles();

  MapOptimize();

  RemoveCursors();

  fHelpScreen = FALSE;
  // Set render back to normal mode
  gTacticalStatus.uiFlags &= ~(NOHIDE_REDUNDENCY | SHOW_ALL_ITEMS);
  UpdateRoofsView();
  UpdateWallsView();
  // Invalidate all redundency checks
  InvalidateWorldRedundency();

  // If false lighting is on in the editor, turn it off!
  if (gfFakeLights) {
    gusLightLevel = gusSavedLightLevel;
  }

  LightSpriteRenderAll();

  if (gfWorldLoaded) {
    ClearRenderFlags(RENDER_FLAG_SAVEOFF);
    MarkWorldDirty();
    RenderWorld();
  }

  InvalidateScreen();
  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  MSYS_EnableRegion(&gRadarRegion);
  CreateCurrentTacticalPanelButtons();

  // Make sure to turn off demo mode!
  gTacticalStatus.uiTimeOfLastInput = GetJA2Clock();
  gTacticalStatus.uiTimeSinceDemoOn = GetJA2Clock();
  gTacticalStatus.fGoingToEnterDemo = FALSE;

  // RETURN TO PREVIOUS SCROLL MODE
  gfDoVideoScroll = gfOldDoVideoScroll;
  gubCurScrollSpeedID = gubOldCurScrollSpeedID;

  DisableUndo();

  SetFontShadow(DEFAULT_SHADOW);

  if (gfWorldLoaded) {
    CompileWorldMovementCosts();
    RaiseWorldLand();
    CompileInteractiveTiles();
    HideEntryPoints();
    KillItemPoolList();
    PrepareSchedulesForEditorExit();
    RemoveAllObjectsOfTypeRange(gsSelectedMercGridNo, CONFIRMMOVE, CONFIRMMOVE);
    RemoveLockedDoorCursors();
    if (gfShowPits) {
      RemoveAllPits();
    }
  }

  EnableButtonHelpTextRestore();

  if (gfNeedToInitGame) {
    InitStrategicLayer();
    WarpGameTime(1, WARPTIME_PROCESS_EVENTS_NORMALLY); // to avoid helicopter setup
    gfNeedToInitGame = FALSE;
  } else {
    if (!gfBasement && !gfCaves)
      LightSetBaseLevel(gusGameLightLevel);
    UpdateMercsInSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
  }

  gGameOptions.fGunNut = gfRealGunNut;

  DeleteBuildingLayout();

  HideExitGrids();

  UnPauseGame();

  return TRUE;
}

//----------------------------------------------------------------------------------------------
//	SetBackgroundTexture
//
//	Forces all land on the map to have the same ground texture.
//
function SetBackgroundTexture(): void {
  let cnt: int;
  let usIndex: UINT16;
  let Dummy: UINT16;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Erase old layers
    RemoveAllLandsOfTypeRange(cnt, FIRSTTEXTURE, DEEPWATERTEXTURE);

    // Add level
    usIndex = (rand() % 10);

    // Adjust for type
    usIndex += gTileTypeStartIndex[gCurrentBackground];

    // Set land index
    if (TypeRangeExistsInLandLayer(cnt, FIRSTFLOOR, LASTFLOOR, &Dummy))
      AddLandToTail(cnt, usIndex); // show the land below the floor.
    else
      AddLandToHead(cnt, usIndex); // no floor so no worries.
  }
}

//----------------------------------------------------------------------------------------------
//	DoWindowSelection
//
//	Displays the selection window and handles it's exit condition. Used by WaitForSelectionWindow
//
function DoWindowSelection(): BOOLEAN {
  RenderSelectionWindow();
  RenderButtonsFastHelp();
  if (fAllDone) {
    switch (iDrawMode) {
      case DRAW_MODE_WALLS:
      case DRAW_MODE_DOORS:
      case DRAW_MODE_WINDOWS:
      case DRAW_MODE_ROOFS:
      case DRAW_MODE_BROKEN_WALLS:
      case DRAW_MODE_DECOR:
      case DRAW_MODE_DECALS:
      case DRAW_MODE_FLOORS:
      case DRAW_MODE_TOILET:
      case DRAW_MODE_ROOM:
      case DRAW_MODE_NEWROOF:
      case DRAW_MODE_OSTRUCTS:
      case DRAW_MODE_OSTRUCTS1:
      case DRAW_MODE_OSTRUCTS2:
      case DRAW_MODE_DEBRIS:
      case DRAW_MODE_BANKS:
      case DRAW_MODE_ROADS:
        break;
      default:
        iDrawMode = DRAW_MODE_NOTHING;
        break;
    }
    RemoveJA2SelectionWindow();
    return TRUE;
  }
  return FALSE;
}

// Whenever the mouse attaches an object to the cursor, it has to be removed, so it doesn't stay
// in the world.
function RemoveTempMouseCursorObject(): void {
  if (iCurBankMapIndex < 0x8000) {
    ForceRemoveStructFromTail(iCurBankMapIndex);
    gCursorNode = NULL;
  }
}

// Whenever the editor wishes to show an object in the world, it will temporarily attach it to
// the mouse cursor, to indicate what is about to be drawn.
function DrawTempMouseCursorObject(): BOOLEAN {
  let sMouseX_M: INT16;
  let sMouseY_M: INT16;
  let usUseIndex: UINT16;
  let usUseObjIndex: UINT16;

  switch (iDrawMode) {
    case DRAW_MODE_ROOM:
      pSelList = SelRoom;
      pNumSelList = &iNumRoomsSelected;
      return FALSE; // a special case where we just want to get the info and not display a cursor.
    case DRAW_MODE_NEWROOF:
      pSelList = SelSingleNewRoof;
      pNumSelList = &iNumNewRoofsSelected;
      break;
    case DRAW_MODE_WALLS:
      pSelList = SelSingleWall;
      pNumSelList = &iNumWallsSelected;
      break;
    case DRAW_MODE_DOORS:
      pSelList = SelSingleDoor;
      pNumSelList = &iNumDoorsSelected;
      break;
    case DRAW_MODE_WINDOWS:
      pSelList = SelSingleWindow;
      pNumSelList = &iNumWindowsSelected;
      break;
    case DRAW_MODE_ROOFS:
      pSelList = SelSingleRoof;
      pNumSelList = &iNumRoofsSelected;
      break;
    case DRAW_MODE_BROKEN_WALLS:
      pSelList = SelSingleBrokenWall;
      pNumSelList = &iNumBrokenWallsSelected;
      break;
    case DRAW_MODE_DECOR:
      pSelList = SelSingleDecor;
      pNumSelList = &iNumDecorSelected;
      break;
    case DRAW_MODE_DECALS:
      pSelList = SelSingleDecal;
      pNumSelList = &iNumDecalsSelected;
      break;
    case DRAW_MODE_FLOORS:
      pSelList = SelSingleFloor;
      pNumSelList = &iNumFloorsSelected;
      break;
    case DRAW_MODE_TOILET:
      pSelList = SelSingleToilet;
      pNumSelList = &iNumToiletsSelected;
      break;
    case DRAW_MODE_BANKS:
      pSelList = SelBanks;
      pNumSelList = &iNumBanksSelected;
      break;
    case DRAW_MODE_ROADS:
      pSelList = SelRoads;
      pNumSelList = &iNumRoadsSelected;
      break;
    case DRAW_MODE_OSTRUCTS:
      pSelList = SelOStructs;
      pNumSelList = &iNumOStructsSelected;
      break;
    case DRAW_MODE_OSTRUCTS1:
      pSelList = SelOStructs1;
      pNumSelList = &iNumOStructs1Selected;
      break;
    case DRAW_MODE_OSTRUCTS2:
      pSelList = SelOStructs2;
      pNumSelList = &iNumOStructs2Selected;
      break;
    case DRAW_MODE_DEBRIS:
      pSelList = SelDebris;
      pNumSelList = &iNumDebrisSelected;
      break;
  }

  if (GetMouseXY(&sMouseX_M, &sMouseY_M)) {
    if ((iCurBankMapIndex = MAPROWCOLTOPOS(sMouseY_M, sMouseX_M)) < 0x8000) {
      // Hook into the smart methods to override the selection window methods.
      if (iDrawMode == DRAW_MODE_SMART_WALLS) {
        if (!CalcWallInfoUsingSmartMethod(iCurBankMapIndex, &usUseObjIndex, &usUseIndex)) {
          return FALSE;
        }
      } else if (iDrawMode == DRAW_MODE_SMART_DOORS) {
        if (!CalcDoorInfoUsingSmartMethod(iCurBankMapIndex, &usUseObjIndex, &usUseIndex)) {
          return FALSE;
        }
      } else if (iDrawMode == DRAW_MODE_SMART_WINDOWS) {
        if (!CalcWindowInfoUsingSmartMethod(iCurBankMapIndex, &usUseObjIndex, &usUseIndex)) {
          return FALSE;
        }
      } else if (iDrawMode == DRAW_MODE_SMART_BROKEN_WALLS) {
        if (!CalcBrokenWallInfoUsingSmartMethod(iCurBankMapIndex, &usUseObjIndex, &usUseIndex)) {
          return FALSE;
        }
        if (usUseObjIndex == 0xffff || usUseIndex == 0xffff) {
          return FALSE;
        }
      } else {
        usUseIndex = pSelList[iCurBank].usIndex;
        usUseObjIndex = pSelList[iCurBank].uiObject;
      }
      gCursorNode = ForceStructToTail(iCurBankMapIndex, (gTileTypeStartIndex[usUseObjIndex] + usUseIndex));
      // ATE: Set this levelnode as dynamic!
      gCursorNode.value.uiFlags |= LEVELNODE_DYNAMIC;
      return TRUE;
    } else
      return FALSE;
  }

  return FALSE;
}

// Displays the current drawing object in the small, lower left window of the editor's toolbar.
function ShowCurrentDrawingMode(): void {
  let ClipRect: SGPRect;
  let NewRect: SGPRect;
  let iShowMode: INT32;
  let usUseIndex: UINT16;
  let usObjIndex: UINT16;
  let iStartX: INT32 = 50;
  let iStartY: INT32 = 440;
  let iPicHeight: INT32;
  let iPicWidth: INT32;
  let sTempOffsetX: INT16;
  let sTempOffsetY: INT16;
  let pETRLEObject: Pointer<ETRLEObject>;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usFillColor: UINT16;
  let iIndexToUse: INT32;

  // Set up a clipping rectangle for the display window.
  NewRect.iLeft = 0;
  NewRect.iTop = 400;
  NewRect.iRight = 100;
  NewRect.iBottom = 458;

  GetClippingRect(&ClipRect);
  SetClippingRect(&NewRect);

  // Clear it out
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 400, 100, 458, 0);

  iShowMode = iDrawMode;
  if (iDrawMode >= DRAW_MODE_ERASE)
    iShowMode -= DRAW_MODE_ERASE;

  usUseIndex = usObjIndex = 0xffff;

  iIndexToUse = 0;
  if (fDontUseRandom)
    iIndexToUse = iCurBank;

  // Select object to be displayed depending on the current editing mode.
  switch (iShowMode) {
    case DRAW_MODE_ROOM:
    case DRAW_MODE_SLANTED_ROOF:
      if (iNumWallsSelected > 0) {
        usUseIndex = SelRoom[0].usIndex;
        usObjIndex = SelRoom[0].uiObject;
      }
      break;

    case DRAW_MODE_GROUND:
    case (DRAW_MODE_GROUND + DRAW_MODE_FILL_AREA):
      usUseIndex = 0;
      usObjIndex = CurrentPaste;
      break;

    case DRAW_MODE_OSTRUCTS:
      if (iNumOStructsSelected > 0) {
        usUseIndex = SelOStructs[iIndexToUse].usIndex;
        usObjIndex = SelOStructs[iIndexToUse].uiObject;
      }
      break;

    case DRAW_MODE_OSTRUCTS1:
      if (iNumOStructs1Selected > 0) {
        usUseIndex = SelOStructs1[iIndexToUse].usIndex;
        usObjIndex = SelOStructs1[iIndexToUse].uiObject;
      }
      break;

    case DRAW_MODE_OSTRUCTS2:
      if (iNumOStructs2Selected > 0) {
        usUseIndex = SelOStructs2[iIndexToUse].usIndex;
        usObjIndex = SelOStructs2[iIndexToUse].uiObject;
      }
      break;

    case DRAW_MODE_DEBRIS:
      if (iNumDebrisSelected > 0) {
        usUseIndex = SelDebris[iIndexToUse].usIndex;
        usObjIndex = SelDebris[iIndexToUse].uiObject;
      }
      break;

    case DRAW_MODE_BANKS:
      if (iNumBanksSelected > 0) {
        usUseIndex = SelBanks[iCurBank].usIndex;
        usObjIndex = SelBanks[iCurBank].uiObject;
      }
      break;

    case DRAW_MODE_ROADS:
      if (iNumRoadsSelected > 0) {
        usUseIndex = SelRoads[iCurBank].usIndex;
        usObjIndex = SelRoads[iCurBank].uiObject;
      }
      break;

    case DRAW_MODE_WALLS:
      if (iNumWallsSelected > 0) {
        usUseIndex = SelSingleWall[iCurBank].usIndex;
        usObjIndex = SelSingleWall[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_DOORS:
      if (iNumDoorsSelected > 0) {
        usUseIndex = SelSingleDoor[iCurBank].usIndex;
        usObjIndex = SelSingleDoor[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_WINDOWS:
      if (iNumWindowsSelected > 0) {
        usUseIndex = SelSingleWindow[iCurBank].usIndex;
        usObjIndex = SelSingleWindow[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_ROOFS:
      if (iNumRoofsSelected > 0) {
        usUseIndex = SelSingleRoof[iCurBank].usIndex;
        usObjIndex = SelSingleRoof[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_NEWROOF:
      if (iNumNewRoofsSelected > 0) {
        usUseIndex = SelSingleNewRoof[iCurBank].usIndex;
        usObjIndex = SelSingleNewRoof[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_BROKEN_WALLS:
      if (iNumBrokenWallsSelected > 0) {
        usUseIndex = SelSingleBrokenWall[iCurBank].usIndex;
        usObjIndex = SelSingleBrokenWall[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_DECOR:
      if (iNumDecorSelected > 0) {
        usUseIndex = SelSingleDecor[iCurBank].usIndex;
        usObjIndex = SelSingleDecor[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_DECALS:
      if (iNumDecalsSelected > 0) {
        usUseIndex = SelSingleDecal[iCurBank].usIndex;
        usObjIndex = SelSingleDecal[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_FLOORS:
      if (iNumFloorsSelected > 0) {
        usUseIndex = SelSingleFloor[iCurBank].usIndex;
        usObjIndex = SelSingleFloor[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_TOILET:
      if (iNumToiletsSelected > 0) {
        usUseIndex = SelSingleToilet[iCurBank].usIndex;
        usObjIndex = SelSingleToilet[iCurBank].uiObject;
      }
      break;
    case DRAW_MODE_SMART_WALLS:
      if (GetMouseXY(&sGridX, &sGridY)) {
        iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);
        if (CalcWallInfoUsingSmartMethod(iMapIndex, &usObjIndex, &usUseIndex))
          break;
      }
      CalcSmartWallDefault(&usObjIndex, &usUseIndex);
      break;
    case DRAW_MODE_SMART_DOORS:
      if (GetMouseXY(&sGridX, &sGridY)) {
        iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);
        if (CalcDoorInfoUsingSmartMethod(iMapIndex, &usObjIndex, &usUseIndex))
          break;
      }
      CalcSmartDoorDefault(&usObjIndex, &usUseIndex);
      break;
    case DRAW_MODE_SMART_WINDOWS:
      if (GetMouseXY(&sGridX, &sGridY)) {
        iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);
        if (CalcWindowInfoUsingSmartMethod(iMapIndex, &usObjIndex, &usUseIndex))
          break;
      }
      CalcSmartWindowDefault(&usObjIndex, &usUseIndex);
      break;
    case DRAW_MODE_SMART_BROKEN_WALLS:
      if (GetMouseXY(&sGridX, &sGridY)) {
        iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);
        if (CalcBrokenWallInfoUsingSmartMethod(iMapIndex, &usObjIndex, &usUseIndex))
          break;
      }
      CalcSmartBrokenWallDefault(&usObjIndex, &usUseIndex);
      break;

    case DRAW_MODE_PLACE_ITEM:
      DisplayItemStatistics();
      break;
  }

  // If we actually have something to draw, draw it
  if ((usUseIndex != 0xffff) && (usObjIndex != 0xffff)) {
    pETRLEObject = &(gTileDatabase[gTileTypeStartIndex[usObjIndex]].hTileSurface.value.pETRLEObject[usUseIndex]);

    iPicWidth = pETRLEObject.value.usWidth;
    iPicHeight = pETRLEObject.value.usHeight;

    // Center the picture in the display window.
    iStartX = (100 - iPicWidth) / 2;
    iStartY = (60 - iPicHeight) / 2;

    // We have to store the offset data in temp variables before zeroing them and blitting
    sTempOffsetX = pETRLEObject.value.sOffsetX;
    sTempOffsetY = pETRLEObject.value.sOffsetY;

    // Set the offsets used for blitting to 0
    pETRLEObject.value.sOffsetX = 0;
    pETRLEObject.value.sOffsetY = 0;

    SetObjectShade(gTileDatabase[gTileTypeStartIndex[usObjIndex]].hTileSurface, DEFAULT_SHADE_LEVEL);
    BltVideoObject(FRAME_BUFFER, gTileDatabase[gTileTypeStartIndex[usObjIndex]].hTileSurface, usUseIndex, (0 + iStartX), (400 + iStartY), VO_BLT_SRCTRANSPARENCY, NULL);

    pETRLEObject.value.sOffsetX = sTempOffsetX;
    pETRLEObject.value.sOffsetY = sTempOffsetY;
  }

  // Set the color for the window's border. Blueish color = Normal, Red = Fake lighting is turned on
  usFillColor = GenericButtonFillColors[0];
  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);
  if (gbPixelDepth == 16)
    RectangleDraw(FALSE, 0, 400, 99, 458, usFillColor, pDestBuf);
  else if (gbPixelDepth == 8)
    RectangleDraw8(FALSE, 0, 400, 99, 458, usFillColor, pDestBuf);

  UnLockVideoSurface(FRAME_BUFFER);

  InvalidateRegion(0, 400, 100, 458);
  SetClippingRect(&ClipRect);
}

//----------------------------------------------------------------------------------------------
//	HandleJA2ToolbarSelection
//
//	Select action to be taken based on user's toolbar selection.
//
function HandleJA2ToolbarSelection(): void {
  let fPrevState: BOOLEAN;

  fPrevState = gfRenderTaskbar;
  gfRenderTaskbar = TRUE;

  switch (iEditorToolbarState) {
    case TBAR_MODE_SET_BGRND:
      iCurrentAction = ACTION_SET_NEW_BACKGROUND;
      break;

    case TBAR_MODE_DENS_DWN:
      iCurrentAction = ACTION_DENSITY_DOWN;
      break;

    case TBAR_MODE_DENS_UP:
      iCurrentAction = ACTION_DENSITY_UP;
      break;

    case TBAR_MODE_RAISE_LAND:
      iCurrentAction = ACTION_RAISE_LAND;
      break;

    case TBAR_MODE_LOWER_LAND:
      iCurrentAction = ACTION_LOWER_LAND;
      break;

    case TBAR_MODE_DEC_DIFF:
      if (sCurBaseDiff > 0)
        sCurBaseDiff--;
      break;

    case TBAR_MODE_INC_DIFF:
      if (sCurBaseDiff < 4)
        sCurBaseDiff++;
      break;

    case TBAR_MODE_FAKE_LIGHTING:
      gfFakeLights ^= TRUE;
      if (gfFakeLights) {
        gusSavedLightLevel = gusLightLevel;
        gusLightLevel = EDITOR_LIGHT_FAKE;
      } else
        gusLightLevel = gusSavedLightLevel;
      LightSetBaseLevel((EDITOR_LIGHT_MAX - gusLightLevel));
      LightSpriteRenderAll();
      break;

    case TBAR_MODE_CHANGE_TILESET:
      InitPopupMenu(iEditorButton[OPTIONS_CHANGE_TILESET], CHANGETSET_POPUP, DIR_UPRIGHT);
      break;

    case TBAR_MODE_CIVILIAN_GROUP:
      InitPopupMenu(iEditorButton[MERCS_CIVILIAN_GROUP], CHANGECIVGROUP_POPUP, DIR_UPLEFT);
      break;

    case TBAR_MODE_GET_WALL:
      iCurrentAction = ACTION_GET_WALL;
      iDrawMode = DRAW_MODE_WALLS;
      break;
    case TBAR_MODE_GET_DOOR:
      iCurrentAction = ACTION_GET_DOOR;
      iDrawMode = DRAW_MODE_DOORS;
      break;
    case TBAR_MODE_GET_WINDOW:
      iCurrentAction = ACTION_GET_WINDOW;
      iDrawMode = DRAW_MODE_WINDOWS;
      break;
    case TBAR_MODE_GET_ROOF:
      iCurrentAction = ACTION_GET_ROOF;
      iDrawMode = DRAW_MODE_ROOFS;
      break;
    case TBAR_MODE_GET_BROKEN_WALL:
      iCurrentAction = ACTION_GET_BROKEN_WALL;
      iDrawMode = DRAW_MODE_BROKEN_WALLS;
      break;
    case TBAR_MODE_GET_DECOR:
      iCurrentAction = ACTION_GET_DECOR;
      iDrawMode = DRAW_MODE_DECOR;
      break;
    case TBAR_MODE_GET_DECAL:
      iCurrentAction = ACTION_GET_DECAL;
      iDrawMode = DRAW_MODE_DECALS;
      break;
    case TBAR_MODE_GET_FLOOR:
      iCurrentAction = ACTION_GET_FLOOR;
      iDrawMode = DRAW_MODE_FLOORS;
      break;
    case TBAR_MODE_GET_TOILET:
      iCurrentAction = ACTION_GET_TOILET;
      iDrawMode = DRAW_MODE_TOILET;
      break;
    case TBAR_MODE_GET_ROOM:
      iCurrentAction = ACTION_GET_ROOM;
      break;
    case TBAR_MODE_GET_NEW_ROOF:
      iCurrentAction = ACTION_GET_NEW_ROOF;
      iDrawMode = DRAW_MODE_NEWROOF;
      break;

    case TBAR_MODE_FILL_AREA:
      iDrawMode = DRAW_MODE_GROUND + DRAW_MODE_FILL_AREA;
      ClickEditorButton(TERRAIN_FGROUND_TEXTURES);
      TerrainTileDrawMode = TERRAIN_TILES_FOREGROUND;
      break;

    case TBAR_MODE_FILL_AREA_OFF:
      iDrawMode = DRAW_MODE_GROUND;
      ClickEditorButton(TERRAIN_FGROUND_TEXTURES);
      TerrainTileDrawMode = TERRAIN_TILES_FOREGROUND;
      break;

    case TBAR_MODE_GET_BANKS:
      iCurrentAction = ACTION_NEXT_BANK;
      iDrawMode = DRAW_MODE_BANKS;
      break;

    case TBAR_MODE_GET_ROADS:
      iCurrentAction = ACTION_NEXT_ROAD;
      iDrawMode = DRAW_MODE_ROADS;
      break;

    case TBAR_MODE_DRAW_BANKS:
      iCurrentAction = ACTION_NULL;
      iDrawMode = DRAW_MODE_BANKS;
      break;

    case TBAR_MODE_GET_DEBRIS:
      iCurrentAction = ACTION_NEXT_DEBRIS;
      iDrawMode = DRAW_MODE_DEBRIS;
      break;

    case TBAR_MODE_DRAW_DEBRIS:
      iCurrentAction = ACTION_NULL;
      iDrawMode = DRAW_MODE_DEBRIS;
      break;

    case TBAR_MODE_GET_OSTRUCTS:
      iCurrentAction = ACTION_NEXT_STRUCT;
      iDrawMode = DRAW_MODE_OSTRUCTS;
      break;

    case TBAR_MODE_DRAW_OSTRUCTS:
      iCurrentAction = ACTION_NULL;
      iDrawMode = DRAW_MODE_OSTRUCTS;
      break;

    case TBAR_MODE_GET_OSTRUCTS1:
      iCurrentAction = ACTION_NEXT_STRUCT1;
      iDrawMode = DRAW_MODE_OSTRUCTS1;
      break;

    case TBAR_MODE_DRAW_OSTRUCTS1:
      iCurrentAction = ACTION_NULL;
      iDrawMode = DRAW_MODE_OSTRUCTS1;
      break;

    case TBAR_MODE_GET_OSTRUCTS2:
      iCurrentAction = ACTION_NEXT_STRUCT2;
      iDrawMode = DRAW_MODE_OSTRUCTS2;
      break;

    case TBAR_MODE_DRAW_OSTRUCTS2:
      iCurrentAction = ACTION_NULL;
      iDrawMode = DRAW_MODE_OSTRUCTS2;
      break;

    case TBAR_MODE_EXIT_EDIT:
      iCurrentAction = ACTION_EXIT_EDITOR;
      break;

    case TBAR_MODE_QUIT_GAME:
      iCurrentAction = ACTION_QUIT_GAME;
      break;

    case TBAR_MODE_SAVE:
      iCurrentAction = ACTION_SAVE_MAP;
      break;

    case TBAR_MODE_LOAD:
      iCurrentAction = ACTION_LOAD_MAP;
      break;

    case TBAR_MODE_UNDO:
      iCurrentAction = ACTION_UNDO;
      break;

    case TBAR_MODE_CHANGE_BRUSH:
      iCurrentAction = ACTION_NEXT_SELECTIONTYPE;
      break;

    case TBAR_MODE_ERASE:
      switch (iDrawMode) {
        case DRAW_MODE_EXITGRID:
        case DRAW_MODE_LIGHT:
        case DRAW_MODE_GROUND:
        case DRAW_MODE_OSTRUCTS:
        case DRAW_MODE_OSTRUCTS1:
        case DRAW_MODE_OSTRUCTS2:
        case DRAW_MODE_DEBRIS:
        case DRAW_MODE_BANKS:
        case DRAW_MODE_ROADS:

        case DRAW_MODE_WALLS:
        case DRAW_MODE_DOORS:
        case DRAW_MODE_WINDOWS:
        case DRAW_MODE_ROOFS:
        case DRAW_MODE_BROKEN_WALLS:
        case DRAW_MODE_DECALS:
        case DRAW_MODE_DECOR:
        case DRAW_MODE_FLOORS:
        case DRAW_MODE_TOILET:

        case DRAW_MODE_ROOM:
        case DRAW_MODE_SLANTED_ROOF:
        case DRAW_MODE_ROOMNUM:
          iDrawMode += DRAW_MODE_ERASE;
          break;
      }
      break;

    case TBAR_MODE_ERASE_OFF:
      if (iDrawMode >= DRAW_MODE_ERASE)
        iDrawMode -= DRAW_MODE_ERASE;
      break;

    case TBAR_MODE_NEW_MAP:
      iCurrentAction = ACTION_NEW_MAP;
      break;

    case TBAR_MODE_ITEM_WEAPONS:
    case TBAR_MODE_ITEM_AMMO:
    case TBAR_MODE_ITEM_ARMOUR:
    case TBAR_MODE_ITEM_EXPLOSIVES:
    case TBAR_MODE_ITEM_EQUIPMENT1:
    case TBAR_MODE_ITEM_EQUIPMENT2:
    case TBAR_MODE_ITEM_EQUIPMENT3:
    case TBAR_MODE_ITEM_TRIGGERS:
    case TBAR_MODE_ITEM_KEYS:
      // Set up the items by type.
      InitEditorItemsInfo(iEditorToolbarState);
      if (gubCurrMercMode != MERC_GETITEMMODE)
        iDrawMode = DRAW_MODE_PLACE_ITEM;
      break;
    case TBAR_MODE_NONE:
      iCurrentAction = ACTION_NULL;
      gfRenderTaskbar = fPrevState;
      break;
    default:
      iCurrentAction = ACTION_NULL;
      iDrawMode = DRAW_MODE_NOTHING;
      gfRenderTaskbar = fPrevState;
      break;
  }
  iEditorToolbarState = TBAR_MODE_NONE;
}

//----------------------------------------------------------------------------------------------
//	HandleKeyboardShortcuts
//
//	Select action to be taken based on the user's current key press (if any)
//

function HandleKeyboardShortcuts(): void {
  /* static */ let iSavedMode: INT32;
  /* static */ let fShowTrees: BOOLEAN = TRUE;
  while (DequeueEvent(&EditorInputEvent)) {
    if (!HandleSummaryInput(&EditorInputEvent) && !HandleTextInput(&EditorInputEvent) && EditorInputEvent.usEvent == KEY_DOWN) {
      if (gfGotoGridNoUI) {
        switch (EditorInputEvent.usParam) {
          case ESC:
            SetInputFieldStringWith16BitString(0, "");
            RemoveGotoGridNoUI();
            break;
          case ENTER:
            RemoveGotoGridNoUI();
            break;
          case 'x':
            if (EditorInputEvent.usKeyState & ALT_DOWN) {
              SetInputFieldStringWith16BitString(0, "");
              RemoveGotoGridNoUI();
              iCurrentAction = ACTION_QUIT_GAME;
            }
            break;
        }
      } else
        switch (EditorInputEvent.usParam) {
          case HOME:
            gfFakeLights ^= TRUE;
            if (gfFakeLights) {
              gusSavedLightLevel = gusLightLevel;
              gusLightLevel = EDITOR_LIGHT_FAKE;
              ClickEditorButton(MAPINFO_TOGGLE_FAKE_LIGHTS);
            } else {
              gusLightLevel = gusSavedLightLevel;
              UnclickEditorButton(MAPINFO_TOGGLE_FAKE_LIGHTS);
            }
            LightSetBaseLevel((EDITOR_LIGHT_MAX - gusLightLevel));
            LightSpriteRenderAll();
            break;

          case SPACE:
            if (iCurrentTaskbar == TASK_MERCS)
              IndicateSelectedMerc(SELECT_NEXT_MERC);
            else if (iCurrentTaskbar == TASK_ITEMS)
              SelectNextItemPool();
            else if (gfShowTerrainTileButtons && fUseTerrainWeights)
              ResetTerrainTileWeights();
            else
              LightSpriteRenderAll();
            break;

          case INSERT:
            if (iDrawMode == DRAW_MODE_GROUND) {
              iDrawMode += DRAW_MODE_FILL_AREA;
              ClickEditorButton(TERRAIN_FILL_AREA);
              iEditorToolbarState = TBAR_MODE_FILL_AREA;
            } else if (iDrawMode == (DRAW_MODE_GROUND + DRAW_MODE_FILL_AREA)) {
              iDrawMode -= DRAW_MODE_FILL_AREA;
              UnclickEditorButton(TERRAIN_FILL_AREA);
              iEditorToolbarState = TBAR_MODE_FILL_AREA_OFF;
            }
            break;
          case ENTER:
            if (gfEditingDoor) {
              ExtractAndUpdateDoorInfo();
              KillDoorEditing();
            } else if (iCurrentTaskbar == TASK_MERCS && gsSelectedMercID != -1)
              ExtractCurrentMercModeInfo(FALSE);
            else if (iCurrentTaskbar == TASK_MAPINFO)
              ExtractAndUpdateMapInfo();
            else if (iCurrentTaskbar == TASK_BUILDINGS)
              ExtractAndUpdateBuildingInfo();
            else if (gfShowItemStatsPanel && EditingText())
              ExecuteItemStatsCmd(ITEMSTATS_APPLY);
            break;

          case BACKSPACE:
            iCurrentAction = ACTION_UNDO;
            break;

          case DEL:
            if (iCurrentTaskbar == TASK_ITEMS)
              DeleteSelectedItem();
            else if (gsSelectedMercID != -1) {
              if (gubCurrMercMode == MERC_INVENTORYMODE && gbCurrSelect != -1) {
                DeleteSelectedMercsItem();
                gbCurrSelect = -1;
                gfRenderTaskbar = TRUE;
              } else
                DeleteSelectedMerc();
            } else
              iCurrentAction = ACTION_QUICK_ERASE;
            break;

          case ESC:
            if (InOverheadMap()) {
              KillOverheadMap();
            }
            if (iDrawMode == DRAW_MODE_SCHEDULEACTION) {
              CancelCurrentScheduleAction();
            } else if (gfMercGetItem) {
              // cancel getting an item for the merc.
              gfMercGetItem = FALSE;
              gusMercsNewItemIndex = 0xffff;
              SetMercEditingMode(MERC_INVENTORYMODE);
              ClearEditorItemsInfo();
            } else if (gfShowItemStatsPanel && EditingText())
              ExecuteItemStatsCmd(ITEMSTATS_CANCEL);
            else if (gfEditingDoor)
              KillDoorEditing();
            else
              iCurrentAction = ACTION_EXIT_EDITOR;
            break;

          // Select next/prev terrain tile to draw with.
          case SHIFT_LEFTARROW:
            CurrentPaste -= (gfShowTerrainTileButtons && CurrentPaste > 0) ? 1 : 0;
            break;
          case SHIFT_RIGHTARROW:
            CurrentPaste += (gfShowTerrainTileButtons && CurrentPaste < 8) ? 1 : 0;
            break;

          case PGUP:
            if (iCurrentTaskbar == TASK_MERCS && !fBuildingShowRoofs) {
              gfRoofPlacement = TRUE;
              fBuildingShowRoofs = TRUE;
              UpdateRoofsView();
              gfRenderWorld = TRUE;
            } else
              switch (iDrawMode) {
                case DRAW_MODE_SMART_WALLS:
                  DecSmartWallUIValue();
                  break;
                case DRAW_MODE_SMART_DOORS:
                  DecSmartDoorUIValue();
                  break;
                case DRAW_MODE_SMART_WINDOWS:
                  DecSmartWindowUIValue();
                  break;
                case DRAW_MODE_SMART_BROKEN_WALLS:
                  DecSmartBrokenWallUIValue();
                  break;
                case DRAW_MODE_PLACE_ITEM:
                  SelectPrevItemInPool();
                  break;
                default:
                  iCurrentAction = ACTION_SUB_INDEX_UP;
                  break;
              }
            gfRenderDrawingMode = TRUE;
            break;
          case PGDN:
            if (iCurrentTaskbar == TASK_MERCS && fBuildingShowRoofs) {
              gfRoofPlacement = FALSE;
              fBuildingShowRoofs = FALSE;
              UpdateRoofsView();
              gfRenderWorld = TRUE;
            } else
              switch (iDrawMode) {
                case DRAW_MODE_SMART_WALLS:
                  IncSmartWallUIValue();
                  break;
                case DRAW_MODE_SMART_DOORS:
                  IncSmartDoorUIValue();
                  break;
                case DRAW_MODE_SMART_WINDOWS:
                  IncSmartWindowUIValue();
                  break;
                case DRAW_MODE_SMART_BROKEN_WALLS:
                  IncSmartBrokenWallUIValue();
                  break;
                case DRAW_MODE_PLACE_ITEM:
                  SelectNextItemInPool();
                  break;
                default:
                  iCurrentAction = ACTION_SUB_INDEX_DWN;
                  break;
              }
            gfRenderDrawingMode = TRUE;
            break;

          case F1:
            gfRenderWorld = TRUE;
            gfRenderTaskbar = TRUE;
            break;

          case F2:
            if (EditorInputEvent.usKeyState & ALT_DOWN) {
              ReloadMap();
            }
            break;

          case F3:
            if (EditorInputEvent.usKeyState & CTRL_DOWN) {
              ReplaceObsoleteRoads();
              MarkWorldDirty();
            }
            break;

          case F4:
            MusicPlay(giMusicID);
            ScreenMsg(FONT_YELLOW, MSG_DEBUG, "%S", szMusicList[giMusicID]);
            giMusicID++;
            if (giMusicID >= NUM_MUSIC)
              giMusicID = 0;
            break;

          case F5:
            UpdateLastActionBeforeLeaving();
            CreateSummaryWindow();
            break;

          case F6:
            break;

          case F7:
            if (gfBasement) {
              let i: INT32;
              let usRoofIndex: UINT16;
              let usRoofType: UINT16;
              let usTileIndex: UINT16;
              pSelList = SelSingleRoof;
              pNumSelList = &iNumRoofsSelected;
              usRoofType = GetRandomIndexByRange(FIRSTROOF, LASTROOF);
              if (usRoofType == 0xffff)
                usRoofType = FIRSTROOF;
              for (i = 0; i < WORLD_MAX; i++) {
                if (gubWorldRoomInfo[i]) {
                  AddToUndoList(i);
                  RemoveAllRoofsOfTypeRange(i, FIRSTTEXTURE, LASTITEM);
                  RemoveAllOnRoofsOfTypeRange(i, FIRSTTEXTURE, LASTITEM);
                  RemoveAllShadowsOfTypeRange(i, FIRSTROOF, LASTSLANTROOF);
                  usRoofIndex = 9 + (rand() % 3);
                  GetTileIndexFromTypeSubIndex(usRoofType, usRoofIndex, &usTileIndex);
                  AddRoofToHead(i, usTileIndex);
                }
              }
              MarkWorldDirty();
            }
            break;

          case F8:
            SmoothAllTerrainWorld();
            break;

          case F9:
            break;
          case F10:
            CreateMessageBox("Are you sure you wish to remove all lights?");
            gfRemoveLightsPending = TRUE;
            break;
          case F11:
            CreateMessageBox("Are you sure you wish to reverse the schedules?");
            gfScheduleReversalPending = TRUE;
            break;
          case F12:
            CreateMessageBox("Are you sure you wish to clear all of the schedules?");
            gfScheduleClearPending = TRUE;
            break;

          case '[':
            iCurrentAction = ACTION_DENSITY_DOWN;
            break;

          case ']':
            iCurrentAction = ACTION_DENSITY_UP;
            break;

          case '+':
            // if ( iDrawMode == DRAW_MODE_SHOW_TILESET )
            //	iCurrentAction = ACTION_MLIST_DWN;
            // else
            iCurrentAction = ACTION_SHADE_UP;
            break;

          case '-':
            // if ( iDrawMode == DRAW_MODE_SHOW_TILESET )
            //	iCurrentAction = ACTION_MLIST_UP;
            iCurrentAction = ACTION_SHADE_DWN;
            break;

          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            if (iCurrentTaskbar == TASK_MERCS) {
              if (iDrawMode >= DRAW_MODE_ERASE)
                iCurrentAction = ACTION_ERASE_WAYPOINT;
              else
                iCurrentAction = ACTION_SET_WAYPOINT;
              iActionParam = EditorInputEvent.usParam - '0';
            } else {
              iCurrentAction = ACTION_SET_FNAME;
              iActionParam = EditorInputEvent.usParam - '0';
            }
            break;

          case 'a':
            iCurrentAction = ACTION_PREV_SELECTIONTYPE;
            break;
          case 'b':
            if (iCurrentTaskbar != TASK_BUILDINGS) {
              iTaskMode = TASK_BUILDINGS;
              DoTaskbar();
            }

            if (CheckForSlantRoofs())
              iDrawMode = DRAW_MODE_SLANTED_ROOF;
            else {
              gusSelectionType = gusSavedBuildingSelectionType;
              iDrawMode = DRAW_MODE_ROOM;
            }
            if (gfCaves)
              SetEditorBuildingTaskbarMode(BUILDING_CAVE_DRAWING);
            else
              SetEditorBuildingTaskbarMode(BUILDING_NEW_ROOM);
            TerrainTileDrawMode = TERRAIN_TILES_BRETS_STRANGEMODE;
            break;
          case 'c':
            if (EditorInputEvent.usKeyState & CTRL_DOWN && iCurrentTaskbar == TASK_MERCS) {
              iCurrentAction = ACTION_COPY_MERC_PLACEMENT;
            }
            break;

          case 'd': // debris
            if (iCurrentTaskbar != TASK_TERRAIN) {
              iTaskMode = TASK_TERRAIN;
              DoTaskbar();
            }

            iCurrentAction = ACTION_NULL;
            iDrawMode = DRAW_MODE_DEBRIS;
            ClickEditorButton(TERRAIN_PLACE_DEBRIS);
            iEditorToolbarState = TBAR_MODE_DRAW_DEBRIS;
            TerrainTileDrawMode = TERRAIN_TILES_NODRAW;
            break;
          case 'e':
            if (iDrawMode >= DRAW_MODE_ERASE) {
              iDrawMode -= DRAW_MODE_ERASE;
            } else {
              switch (iDrawMode) {
                case DRAW_MODE_NORTHPOINT:
                case DRAW_MODE_WESTPOINT:
                case DRAW_MODE_EASTPOINT:
                case DRAW_MODE_SOUTHPOINT:
                case DRAW_MODE_CENTERPOINT:
                case DRAW_MODE_ISOLATEDPOINT:
                case DRAW_MODE_EXITGRID:
                case DRAW_MODE_LIGHT:
                case DRAW_MODE_GROUND:
                case DRAW_MODE_OSTRUCTS:
                case DRAW_MODE_OSTRUCTS1:
                case DRAW_MODE_OSTRUCTS2:
                case DRAW_MODE_DEBRIS:
                case DRAW_MODE_BANKS:
                case DRAW_MODE_ROADS:
                case DRAW_MODE_WALLS:
                case DRAW_MODE_DOORS:
                case DRAW_MODE_WINDOWS:
                case DRAW_MODE_ROOFS:
                case DRAW_MODE_BROKEN_WALLS:
                case DRAW_MODE_DECOR:
                case DRAW_MODE_DECALS:
                case DRAW_MODE_FLOORS:
                case DRAW_MODE_TOILET:
                case DRAW_MODE_ROOM:
                case DRAW_MODE_SLANTED_ROOF:
                case DRAW_MODE_ROOMNUM:
                  iDrawMode += DRAW_MODE_ERASE;
                  break;
              }
            }
            break;
          case 'f':
            gbFPSDisplay = !gbFPSDisplay;
            DisableFPSOverlay(!gbFPSDisplay);
            break;
          case 'g': // ground
            if (EditorInputEvent.usKeyState & CTRL_DOWN) {
              CreateGotoGridNoUI();
            } else {
              if (iCurrentTaskbar != TASK_TERRAIN) {
                iTaskMode = TASK_TERRAIN;
                DoTaskbar();
              }
              iCurrentAction = ACTION_NULL;
              SetEditorTerrainTaskbarMode(TERRAIN_FGROUND_TEXTURES);
            }
            break;

          case 'h':
            if (fBuildingShowRoofs ^= 1)
              ClickEditorButton(BUILDING_TOGGLE_ROOF_VIEW);
            else
              UnclickEditorButton(BUILDING_TOGGLE_ROOF_VIEW);
            UpdateRoofsView();
            break;

          case 'i':
            if (!InOverheadMap())
              GoIntoOverheadMap();
            else
              KillOverheadMap();
            break;

          case 'l':
            if (EditorInputEvent.usKeyState & CTRL_DOWN) {
              UpdateLastActionBeforeLeaving();
              iCurrentAction = ACTION_LOAD_MAP;
              break;
            }
            if (iCurrentTaskbar != TASK_TERRAIN) {
              iTaskMode = TASK_TERRAIN;
              DoTaskbar();
            }
            break;
          case 'n':
            if (fBuildingShowRoomInfo ^= 1) {
              SetRenderFlags(RENDER_FLAG_ROOMIDS);
              ClickEditorButton(BUILDING_TOGGLE_INFO_VIEW);
            } else {
              ClearRenderFlags(RENDER_FLAG_ROOMIDS);
              UnclickEditorButton(BUILDING_TOGGLE_INFO_VIEW);
            }
            break;
          case 'o':
            if (iCurrentTaskbar != TASK_TERRAIN) {
              iTaskMode = TASK_TERRAIN;
              DoTaskbar();
            }
            iCurrentAction = ACTION_NULL;
            iDrawMode = DRAW_MODE_OSTRUCTS2;
            ClickEditorButton(TERRAIN_PLACE_MISC);
            iEditorToolbarState = TBAR_MODE_DRAW_OSTRUCTS2;
            break;
          case 'r': // rocks
            if (iCurrentTaskbar != TASK_TERRAIN) {
              iTaskMode = TASK_TERRAIN;
              DoTaskbar();
            }
            iCurrentAction = ACTION_NULL;
            iDrawMode = DRAW_MODE_OSTRUCTS1;
            ClickEditorButton(TERRAIN_PLACE_ROCKS);
            iEditorToolbarState = TBAR_MODE_DRAW_OSTRUCTS1;
            break;
          case 's':
            if (EditorInputEvent.usKeyState & CTRL_DOWN) {
              iCurrentAction = ACTION_SAVE_MAP;
            }
            break;
          case 't': // Trees
            if (iCurrentTaskbar != TASK_TERRAIN) {
              iTaskMode = TASK_TERRAIN;
              DoTaskbar();
            }
            iCurrentAction = ACTION_NULL;
            iDrawMode = DRAW_MODE_OSTRUCTS;
            ClickEditorButton(TERRAIN_PLACE_TREES);
            iEditorToolbarState = TBAR_MODE_DRAW_OSTRUCTS;
            break;
          case 'T':
            if (fShowTrees) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Removing Treetops");
              WorldHideTrees();
            } else {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "Showing Treetops");
              WorldShowTrees();
            }
            fShowTrees = !fShowTrees;

            break;
          case 'u':
            RaiseWorldLand();
            break;
          case 'w': // walls (full building)
            if (fBuildingShowWalls ^= 1)
              ClickEditorButton(BUILDING_TOGGLE_WALL_VIEW);
            else
              UnclickEditorButton(BUILDING_TOGGLE_WALL_VIEW);
            UpdateWallsView();
            break;
          case 'v':
            if (EditorInputEvent.usKeyState & CTRL_DOWN && iCurrentTaskbar == TASK_MERCS) {
              iCurrentAction = ACTION_PASTE_MERC_PLACEMENT;
            }
            break;

          case 'x':
            if (EditorInputEvent.usKeyState & ALT_DOWN) {
              if (InOverheadMap())
                KillOverheadMap();
              if (gfEditingDoor)
                KillDoorEditing();
              iCurrentAction = ACTION_QUIT_GAME;
              return;
            }
            break;
          case 'z':
            iCurrentAction = ACTION_NEXT_SELECTIONTYPE;
            break;
          case ',':
            gusSelectionType = LINESELECTION;
            gusPreserveSelectionWidth--;
            if (!gusPreserveSelectionWidth)
              gusPreserveSelectionWidth = 8;
            gfRenderTaskbar = TRUE;
            break;
          case '.':
            gusSelectionType = LINESELECTION;
            gusPreserveSelectionWidth++;
            if (gusPreserveSelectionWidth > 8)
              gusPreserveSelectionWidth = 1;
            gfRenderTaskbar = TRUE;
          default:
            iCurrentAction = ACTION_NULL;
            break;
        }
    }
  }
}

//----------------------------------------------------------------------------------------------
//	PerformSelectedAction
//
//	Perform the current user selected action, if any (or at least set things up for doing that)
//
function PerformSelectedAction(): UINT32 {
  let uiRetVal: UINT32;

  uiRetVal = EDIT_SCREEN;

  switch (iCurrentAction) {
    case ACTION_DENSITY_DOWN:
      DecreaseSelectionDensity();
      break;
    case ACTION_DENSITY_UP:
      IncreaseSelectionDensity();
      break;

    case ACTION_ERASE_WAYPOINT:
      EraseMercWaypoint();
      break;

    case ACTION_SET_WAYPOINT:
      iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);
      AddMercWaypoint(iMapIndex);
      break;

    case ACTION_RAISE_LAND:
      RaiseWorldLand();
      break;

    case ACTION_HELPSCREEN:
      DisableEditorTaskbar();
      fHelpScreen = TRUE;
      fAllDone = FALSE;
      break;

    case ACTION_QUICK_ERASE:
      if ((gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA) && GetMouseXY(&sGridX, &sGridY)) {
        iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);

        if (iMapIndex < 0x8000) {
          QuickEraseMapTile(iMapIndex);
        }
      }
      break;

    case ACTION_QUIT_GAME:
      gfProgramIsRunning = FALSE;
    case ACTION_EXIT_EDITOR:
      if (EditModeShutdown()) {
        iPrevJA2ToolbarState = iEditorToolbarState;
        iPrevDrawMode = iDrawMode;
        PrevCurrentPaste = CurrentPaste;
        gPrevCurrentBackground = gCurrentBackground;
        fFirstTimeInGameScreen = TRUE;
        return GAME_SCREEN;
      }
      return EDIT_SCREEN;
    case ACTION_GET_WALL:
    case ACTION_GET_DOOR:
    case ACTION_GET_WINDOW:
    case ACTION_GET_ROOF:
    case ACTION_GET_NEW_ROOF:
    case ACTION_GET_BROKEN_WALL:
    case ACTION_GET_DECOR:
    case ACTION_GET_DECAL:
    case ACTION_GET_FLOOR:
    case ACTION_GET_TOILET:
    case ACTION_GET_ROOM:
      switch (iCurrentAction) {
        case ACTION_GET_WALL:
          CreateJA2SelectionWindow(SELWIN_SINGLEWALL);
          break;
        case ACTION_GET_DOOR:
          CreateJA2SelectionWindow(SELWIN_SINGLEDOOR);
          break;
        case ACTION_GET_WINDOW:
          CreateJA2SelectionWindow(SELWIN_SINGLEWINDOW);
          break;
        case ACTION_GET_ROOF:
          CreateJA2SelectionWindow(SELWIN_SINGLEROOF);
          break;
        case ACTION_GET_NEW_ROOF:
          CreateJA2SelectionWindow(SELWIN_SINGLENEWROOF);
          break;
        case ACTION_GET_BROKEN_WALL:
          CreateJA2SelectionWindow(SELWIN_SINGLEBROKENWALL);
          break;
        case ACTION_GET_DECOR:
          CreateJA2SelectionWindow(SELWIN_SINGLEDECOR);
          break;
        case ACTION_GET_DECAL:
          CreateJA2SelectionWindow(SELWIN_SINGLEDECAL);
          break;
        case ACTION_GET_FLOOR:
          CreateJA2SelectionWindow(SELWIN_SINGLEFLOOR);
          break;
        case ACTION_GET_TOILET:
          CreateJA2SelectionWindow(SELWIN_SINGLETOILET);
          break;
        case ACTION_GET_ROOM:
          CreateJA2SelectionWindow(SELWIN_ROOM);
          break;
      }
      fSelectionWindow = TRUE;
      fAllDone = FALSE;
      break;

    case ACTION_NEW_MAP:
      fNewMap = TRUE;
      if (gfPendingBasement)
        CreateMessageBox("Delete current map and start a new basement level?");
      else if (gfPendingCaves)
        CreateMessageBox("Delete current map and start a new cave level?");
      else
        CreateMessageBox("Delete current map and start a new outdoor level?");
      break;

    case ACTION_SET_NEW_BACKGROUND:
      if (!fBeenWarned)
        CreateMessageBox(" Wipe out ground textures? ");
      else {
        gCurrentBackground = TerrainBackgroundTile;
        SetBackgroundTexture();
        fBeenWarned = FALSE;
      }
      break;

    case ACTION_SUB_INDEX_UP:
      gusSelectionType = SMALLSELECTION;
      switch (iDrawMode) {
        case DRAW_MODE_BANKS:
          if (iNumBanksSelected > 0)
            iCurBank = (iCurBank + 1) % iNumBanksSelected;
          break;
        case DRAW_MODE_ROADS:
          if (iNumRoadsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumRoadsSelected;
          break;
        case DRAW_MODE_WALLS:
          if (iNumWallsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumWallsSelected;
          break;
        case DRAW_MODE_DOORS:
          if (iNumDoorsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumDoorsSelected;
          break;
        case DRAW_MODE_WINDOWS:
          if (iNumWindowsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumWindowsSelected;
          break;
        case DRAW_MODE_ROOFS:
          if (iNumRoofsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumRoofsSelected;
          break;
        case DRAW_MODE_BROKEN_WALLS:
          if (iNumBrokenWallsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumBrokenWallsSelected;
          break;
        case DRAW_MODE_DECOR:
          if (iNumDecorSelected > 0)
            iCurBank = (iCurBank + 1) % iNumDecorSelected;
          break;
        case DRAW_MODE_DECALS:
          if (iNumDecalsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumDecalsSelected;
          break;
        case DRAW_MODE_FLOORS:
          if (iNumFloorsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumFloorsSelected;
          break;
        case DRAW_MODE_TOILET:
          if (iNumToiletsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumToiletsSelected;
          break;
        case DRAW_MODE_NEWROOF:
          if (iNumNewRoofsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumNewRoofsSelected;
          break;
        case DRAW_MODE_OSTRUCTS:
          fDontUseRandom = TRUE;
          if (iNumOStructsSelected > 0)
            iCurBank = (iCurBank + 1) % iNumOStructsSelected;
          break;

        case DRAW_MODE_OSTRUCTS1:
          fDontUseRandom = TRUE;
          if (iNumOStructs1Selected > 0)
            iCurBank = (iCurBank + 1) % iNumOStructs1Selected;
          break;

        case DRAW_MODE_OSTRUCTS2:
          fDontUseRandom = TRUE;
          if (iNumOStructs2Selected > 0)
            iCurBank = (iCurBank + 1) % iNumOStructs2Selected;
          break;

        case DRAW_MODE_DEBRIS:
          fDontUseRandom = TRUE;
          if (iNumDebrisSelected > 0)
            iCurBank = (iCurBank + 1) % iNumDebrisSelected;
          break;
      }
      break;

    case ACTION_SUB_INDEX_DWN:
      gusSelectionType = SMALLSELECTION;
      switch (iDrawMode) {
        case DRAW_MODE_BANKS:
          if (iNumBanksSelected > 0)
            iCurBank = (iCurBank + (iNumBanksSelected - 1)) % iNumBanksSelected;
          break;
        case DRAW_MODE_ROADS:
          if (iNumRoadsSelected > 0)
            iCurBank = (iCurBank + (iNumRoadsSelected - 1)) % iNumRoadsSelected;
          break;
        case DRAW_MODE_WALLS:
          if (iNumWallsSelected > 0)
            iCurBank = (iCurBank + (iNumWallsSelected - 1)) % iNumWallsSelected;
          break;
        case DRAW_MODE_DOORS:
          if (iNumDoorsSelected > 0)
            iCurBank = (iCurBank + (iNumDoorsSelected - 1)) % iNumDoorsSelected;
          break;
        case DRAW_MODE_WINDOWS:
          if (iNumWindowsSelected > 0)
            iCurBank = (iCurBank + (iNumWindowsSelected - 1)) % iNumWindowsSelected;
          break;
        case DRAW_MODE_ROOFS:
          if (iNumRoofsSelected > 0)
            iCurBank = (iCurBank + (iNumRoofsSelected - 1)) % iNumRoofsSelected;
          break;
        case DRAW_MODE_BROKEN_WALLS:
          if (iNumBrokenWallsSelected > 0)
            iCurBank = (iCurBank + (iNumBrokenWallsSelected - 1)) % iNumBrokenWallsSelected;
          break;
        case DRAW_MODE_DECOR:
          if (iNumDecorSelected > 0)
            iCurBank = (iCurBank + (iNumDecorSelected - 1)) % iNumDecorSelected;
          break;
        case DRAW_MODE_DECALS:
          if (iNumDecalsSelected > 0)
            iCurBank = (iCurBank + (iNumDecalsSelected - 1)) % iNumDecalsSelected;
          break;
        case DRAW_MODE_FLOORS:
          if (iNumFloorsSelected > 0)
            iCurBank = (iCurBank + (iNumFloorsSelected - 1)) % iNumFloorsSelected;
          break;
        case DRAW_MODE_TOILET:
          if (iNumToiletsSelected > 0)
            iCurBank = (iCurBank + (iNumToiletsSelected - 1)) % iNumToiletsSelected;
          break;
        case DRAW_MODE_NEWROOF:
          if (iNumNewRoofsSelected > 0)
            iCurBank = (iCurBank + (iNumNewRoofsSelected - 1)) % iNumNewRoofsSelected;
          break;
        case DRAW_MODE_OSTRUCTS:
          fDontUseRandom = TRUE;
          if (iNumOStructsSelected > 0)
            iCurBank = (iCurBank + (iNumOStructsSelected - 1)) % iNumOStructsSelected;
          break;

        case DRAW_MODE_OSTRUCTS1:
          fDontUseRandom = TRUE;
          if (iNumOStructs1Selected > 0)
            iCurBank = (iCurBank + (iNumOStructs1Selected - 1)) % iNumOStructs1Selected;
          break;

        case DRAW_MODE_OSTRUCTS2:
          fDontUseRandom = TRUE;
          if (iNumOStructs2Selected > 0)
            iCurBank = (iCurBank + (iNumOStructs2Selected - 1)) % iNumOStructs2Selected;
          break;

        case DRAW_MODE_DEBRIS:
          fDontUseRandom = TRUE;
          if (iNumDebrisSelected > 0)
            iCurBank = (iCurBank + (iNumDebrisSelected - 1)) % iNumDebrisSelected;
          break;
      }
      break;
    case ACTION_NEXT_FGRND:
      break;

    case ACTION_NEXT_DEBRIS:
      CreateJA2SelectionWindow(SELWIN_DEBRIS);
      fSelectionWindow = TRUE;
      fAllDone = FALSE;
      break;

    case ACTION_PREV_SELECTIONTYPE:
      gusSelectionType--;
      if (gusSelectionType > AREASELECTION)
        gusSelectionType = AREASELECTION;
      gfRenderTaskbar = TRUE;
      break;
    case ACTION_NEXT_SELECTIONTYPE:
      gusSelectionType++;
      if (gusSelectionType > AREASELECTION)
        gusSelectionType = SMALLSELECTION;
      gfRenderTaskbar = TRUE;
      break;

    case ACTION_COPY_MERC_PLACEMENT:
      GetMouseXY(&sGridX, &sGridY);
      iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);
      CopyMercPlacement(iMapIndex);
      break;
    case ACTION_PASTE_MERC_PLACEMENT:
      GetMouseXY(&sGridX, &sGridY);
      iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);
      PasteMercPlacement(iMapIndex);
      break;

    case ACTION_SAVE_MAP:
      UpdateLastActionBeforeLeaving();
      return LOADSAVE_SCREEN;

    case ACTION_LOAD_MAP:
      UpdateLastActionBeforeLeaving();
      return LOADSAVE_SCREEN;

    case ACTION_UNDO:
      ExecuteUndoList();
      gfRenderWorld = TRUE;
      break;

    case ACTION_NEXT_BANK:
      CreateJA2SelectionWindow(SELWIN_BANKS);
      fSelectionWindow = TRUE;
      fAllDone = FALSE;
      break;

    case ACTION_NEXT_ROAD:
      CreateJA2SelectionWindow(SELWIN_ROADS);
      fSelectionWindow = TRUE;
      fAllDone = FALSE;
      break;

    case ACTION_SHADE_UP:
      if (EditorInputEvent.usKeyState & SHIFT_DOWN) {
        gShadePercent += .05;
      } else {
        gShadePercent += .01;
      }

      if (gShadePercent > 1) {
        gShadePercent = 0;
      }
      SetShadeTablePercent(gShadePercent);
      break;

    case ACTION_SHADE_DWN:
      if (EditorInputEvent.usKeyState & SHIFT_DOWN) {
        gShadePercent -= .05;
      } else {
        gShadePercent -= .01;
      }

      if (gShadePercent < 0) {
        gShadePercent = 1;
      }
      SetShadeTablePercent(gShadePercent);
      break;

    case ACTION_WALL_PASTE1: // Doors		//** Changes needed
      GetMouseXY(&sGridX, &sGridY);
      iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);

      AddWallToStructLayer(iMapIndex, FIRSTWALL18, TRUE);
      break;

    case ACTION_WALL_PASTE2: // Windows	//** Changes Needed
      GetMouseXY(&sGridX, &sGridY);
      iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);

      AddWallToStructLayer(iMapIndex, FIRSTWALL19, TRUE);
      break;

    case ACTION_NEXT_STRUCT:
      CreateJA2SelectionWindow(SELWIN_OSTRUCTS);
      fSelectionWindow = TRUE;
      fAllDone = FALSE;
      break;

    case ACTION_NEXT_STRUCT1:
      CreateJA2SelectionWindow(SELWIN_OSTRUCTS1);
      fSelectionWindow = TRUE;
      fAllDone = FALSE;
      break;

    case ACTION_NEXT_STRUCT2:
      CreateJA2SelectionWindow(SELWIN_OSTRUCTS2);
      fSelectionWindow = TRUE;
      fAllDone = FALSE;
      break;

    default:
      break;
  }

  return uiRetVal;
}

function CreateNewMap(): void {
  if (gfSummaryWindowActive)
    DestroySummaryWindow();

  if (!gfWorldLoaded)
    LoadMapTileset(0);

  LightReset();
  NewWorld();
  if (gfPendingBasement) {
    let i: UINT32;
    let usIndex: UINT16;
    for (i = 0; i < WORLD_MAX; i++) {
      // Set land index 9 + 3 variants
      GetTileIndexFromTypeSubIndex(FIRSTROOF, (9 + Random(3)), &usIndex);
      AddRoofToHead(i, usIndex);
    }
    SetEditorSmoothingMode(SMOOTHING_BASEMENT);
  } else if (gfPendingCaves) {
    let i: UINT32;
    let usIndex: UINT16;
    for (i = 0; i < WORLD_MAX; i++) {
      // Set up the default cave here.
      GetTileIndexFromTypeSubIndex(FIRSTWALL, (60 + Random(6)), &usIndex);
      AddCave(i, usIndex);
    }
    SetEditorSmoothingMode(SMOOTHING_CAVES);
  } else
    SetEditorSmoothingMode(SMOOTHING_NORMAL);
  fNewMap = FALSE;
  RemoveAllFromUndoList();
  UseEditorAlternateList();
  KillSoldierInitList();
  UseEditorOriginalList();
  KillSoldierInitList();
  HideEntryPoints();
  gMapInformation.sNorthGridNo = -1;
  gMapInformation.sSouthGridNo = -1;
  gMapInformation.sWestGridNo = -1;
  gMapInformation.sEastGridNo = -1;
}

function ProcessEditscreenMessageBoxResponse(): UINT32 {
  RemoveMessageBox();
  gfRenderWorld = TRUE;
  if (gfConfirmExitPending) {
    gfConfirmExitPending = FALSE;
    if (gfMessageBoxResult) {
      gfConfirmExitFirst = FALSE;
      iEditorToolbarState = TBAR_MODE_EXIT_EDIT;
    }
    return EDIT_SCREEN;
  }
  if (!gfMessageBoxResult)
    return EDIT_SCREEN;
  if (gfRemoveLightsPending) {
    let i: INT32;
    LightReset();
    for (i = 0; i < WORLD_MAX; i++) {
      RemoveAllObjectsOfTypeRange(i, GOODRING, GOODRING);
    }
    MarkWorldDirty();
    LightSetBaseLevel((15 - ubAmbientLightLevel));
    gfRemoveLightsPending = FALSE;
  }
  if (gfScheduleReversalPending) {
    IndicateSelectedMerc(SELECT_NO_MERC);
    ReverseSchedules();
    gfScheduleReversalPending = FALSE;
  } else if (gfScheduleClearPending) {
    IndicateSelectedMerc(SELECT_NO_MERC);
    ClearAllSchedules();
    gfScheduleClearPending = FALSE;
  }
  if (fNewMap) {
    CreateNewMap();
    return EDIT_SCREEN;
  } else if (iDrawMode == DRAW_MODE_NEW_GROUND) {
    gCurrentBackground = TerrainBackgroundTile;
    SetBackgroundTexture();
    SetEditorTerrainTaskbarMode(TERRAIN_FGROUND_TEXTURES);
    return EDIT_SCREEN;
  }
  return EDIT_SCREEN;
}

//----------------------------------------------------------------------------------------------
//	WaitForHelpScreenResponse
//
//	Displays a help screen and waits for the user to wisk it away.
//
function WaitForHelpScreenResponse(): UINT32 {
  let DummyEvent: InputAtom;
  let fLeaveScreen: BOOLEAN;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, 50, 50, 590, 310, Get16BPPColor(FROMRGB(136, 138, 135)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 51, 51, 590, 310, Get16BPPColor(FROMRGB(24, 61, 81)));
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 51, 51, 589, 309, GenericButtonFillColors[0]);

  SetFont(gp12PointFont1);

  gprintf(55, 55, "HOME");
  gprintf(205, 55, "Toggle fake editor lighting ON/OFF");

  gprintf(55, 67, "INSERT");
  gprintf(205, 67, "Toggle fill mode ON/OFF");

  gprintf(55, 79, "BKSPC");
  gprintf(205, 79, "Undo last change");

  gprintf(55, 91, "DEL");
  gprintf(205, 91, "Quick erase object under mouse cursor");

  gprintf(55, 103, "ESC");
  gprintf(205, 103, "Exit editor");

  gprintf(55, 115, "PGUP/PGDN");
  gprintf(205, 115, "Change object to be pasted");

  gprintf(55, 127, "F1");
  gprintf(205, 127, "This help screen");

  gprintf(55, 139, "F10");
  gprintf(205, 139, "Save current map");

  gprintf(55, 151, "F11");
  gprintf(205, 151, "Load map as current");

  gprintf(55, 163, "+/-");
  gprintf(205, 163, "Change shadow darkness by .01");

  gprintf(55, 175, "SHFT +/-");
  gprintf(205, 175, "Change shadow darkness by .05");

  gprintf(55, 187, "0 - 9");
  gprintf(205, 187, "Change map/tileset filename");

  gprintf(55, 199, "b");
  gprintf(205, 199, "Change brush size");

  gprintf(55, 211, "d");
  gprintf(205, 211, "Draw debris");

  gprintf(55, 223, "o");
  gprintf(205, 223, "Draw obstacle");

  gprintf(55, 235, "r");
  gprintf(205, 235, "Draw rocks");

  gprintf(55, 247, "t");
  gprintf(205, 247, "Toggle trees display ON/OFF");

  gprintf(55, 259, "g");
  gprintf(205, 259, "Draw ground textures");

  gprintf(55, 271, "w");
  gprintf(205, 271, "Draw building walls");

  gprintf(55, 283, "e");
  gprintf(205, 283, "Toggle erase mode ON/OFF");

  gprintf(55, 295, "h");
  gprintf(205, 295, "Toggle roofs ON/OFF");

  fLeaveScreen = FALSE;

  while (DequeueEvent(&DummyEvent) == TRUE) {
    if (DummyEvent.usEvent == KEY_DOWN) {
      switch (DummyEvent.usParam) {
        case SPACE:
        case ESC:
        case ENTER:
        case F1:
          fLeaveScreen = TRUE;
          break;
      }
    }
  }

  if ((_LeftButtonDown) || (_RightButtonDown) || fLeaveScreen) {
    fHelpScreen = FALSE;

    while (DequeueEvent(&DummyEvent))
      continue;

    EnableEditorTaskbar();
  }

  InvalidateScreen();
  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  return EDIT_SCREEN;
}

//----------------------------------------------------------------------------------------------
//	WaitForSelectionWindowResponse
//
//	Handles all keyboard input and display for a selection window.
//
function WaitForSelectionWindowResponse(): UINT32 {
  let DummyEvent: InputAtom;

  while (DequeueEvent(&DummyEvent) == TRUE) {
    if (DummyEvent.usEvent == KEY_DOWN) {
      switch (DummyEvent.usParam) {
        case SPACE:
          ClearSelectionList();
          break;

        case DNARROW:
          ScrollSelWinDown();
          break;

        case UPARROW:
          ScrollSelWinUp();
          break;

        case ESC:
          RestoreSelectionList();
        case ENTER:
          fAllDone = TRUE;
          break;
      }
    }
  }

  if (DoWindowSelection()) {
    fSelectionWindow = FALSE;
    ShutdownJA2SelectionWindow();
    // Quick hack to trash the mouse event queue.
    while (DequeueEvent(&DummyEvent))
      continue;

    iCurBank = 0;

    if (iDrawMode == DRAW_MODE_SLANTED_ROOF || iDrawMode == DRAW_MODE_ROOM) {
      if (CheckForSlantRoofs())
        iDrawMode = DRAW_MODE_SLANTED_ROOF;
    }
    InvalidateScreen();
    ExecuteBaseDirtyRectQueue();
    EndFrameBufferRender();
  } else {
    DisplaySelectionWindowGraphicalInformation();
    InvalidateScreen();
    ExecuteBaseDirtyRectQueue();
    EndFrameBufferRender();
  }

  return EDIT_SCREEN;
}

//----------------------------------------------------------------------------------------------
//	FindTilesetComments
//
//	Retrieves the file comments from the master list for the current tileset
//
function FindTilesetComments(): void {
}

//----------------------------------------------------------------------------------------------
//	GetMasterList
//
//	Loads the master list for the tileset comments
//
function GetMasterList(): void {
}

//----------------------------------------------------------------------------------------------
//	ShowCurrentSlotSurface
//
//	Displays the image of the currently highlighted tileset slot if it's a video surface.
//	(usually a 16 bit image)
//
function ShowCurrentSlotSurface(vSurface: UINT32, iWindow: INT32): void {
  let ClipRect: SGPRect;
  let WinRect: SGPRect;
  let iStartX: INT32;
  let iStartY: INT32;
  let iPicHeight: INT32;
  let iPicWidth: INT32;
  let hvSurface: HVSURFACE;
  let iWinWidth: INT32;
  let iWinHeight: INT32;
  let vSfx: blt_vs_fx;

  WinRect.iLeft = (iWindow == 0) ? (336) : (488);
  WinRect.iTop = 211;
  WinRect.iRight = (iWindow == 0) ? (485) : (637);
  WinRect.iBottom = 399;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, WinRect.iLeft - 1, WinRect.iTop - 1, WinRect.iRight + 1, WinRect.iBottom + 1, Get16BPPColor(FROMRGB(128, 0, 0)));

  iWinWidth = WinRect.iRight - WinRect.iLeft;
  iWinHeight = WinRect.iBottom - WinRect.iTop;

  GetVideoSurface(&hvSurface, vSurface);

  iPicWidth = hvSurface.value.usWidth;
  iPicHeight = hvSurface.value.usHeight;

  if (iPicWidth > iWinWidth) {
    ClipRect.iLeft = (iPicWidth - iWinWidth) / 2;
    ClipRect.iRight = ClipRect.iLeft + iWinWidth - 1;
    iStartX = WinRect.iLeft;
  } else {
    ClipRect.iLeft = 0;
    ClipRect.iRight = iPicWidth - 1;
    iStartX = ((iWinWidth - iPicWidth) / 2) + WinRect.iLeft;
  }

  if (iPicHeight > iWinHeight) {
    ClipRect.iTop = (iPicHeight - iWinHeight) / 2;
    ClipRect.iBottom = ClipRect.iTop + iWinHeight - 1;
    iStartY = WinRect.iTop;
  } else {
    ClipRect.iTop = 0;
    ClipRect.iBottom = iPicHeight - 1;
    iStartY = ((iWinHeight - iPicHeight) / 2) + WinRect.iTop;
  }

  vSfx.SrcRect = ClipRect;
  BltVideoSurface(FRAME_BUFFER, vSurface, 0, iStartX, iStartY, VS_BLT_SRCSUBRECT, &vSfx);
}

//----------------------------------------------------------------------------------------------
//	ShowCurrentSlotImage
//
//	Displays the image of the currently highlighted tileset slot image. Usually this is for
//	8 bit image (.STI) files
//
function ShowCurrentSlotImage(hVObj: HVOBJECT, iWindow: INT32): void {
  let ClipRect: SGPRect;
  let NewRect: SGPRect;
  let iStartX: INT32;
  let iStartY: INT32;
  let iPicHeight: INT32;
  let iPicWidth: INT32;
  let sTempOffsetX: INT16;
  let sTempOffsetY: INT16;
  let pETRLEObject: Pointer<ETRLEObject>;
  let iWinWidth: INT32;
  let iWinHeight: INT32;

  NewRect.iLeft = (iWindow == 0) ? (336) : (488);
  NewRect.iTop = 211;
  NewRect.iRight = (iWindow == 0) ? (485) : (637);
  NewRect.iBottom = 399;

  iWinWidth = NewRect.iRight - NewRect.iLeft;
  iWinHeight = NewRect.iBottom - NewRect.iTop;

  GetClippingRect(&ClipRect);
  SetClippingRect(&NewRect);

  pETRLEObject = &(hVObj.value.pETRLEObject[0]);

  iPicWidth = pETRLEObject.value.usWidth;
  iPicHeight = pETRLEObject.value.usHeight;

  iStartX = ((iWinWidth - iPicWidth) / 2) + NewRect.iLeft;
  iStartY = ((iWinHeight - iPicHeight) / 2) + NewRect.iTop;

  // We have to store the offset data in temp variables before zeroing them and blitting
  sTempOffsetX = pETRLEObject.value.sOffsetX;
  sTempOffsetY = pETRLEObject.value.sOffsetY;

  // Set the offsets used for blitting to 0
  pETRLEObject.value.sOffsetX = 0;
  pETRLEObject.value.sOffsetY = 0;

  SetObjectShade(hVObj, DEFAULT_SHADE_LEVEL);
  BltVideoObject(FRAME_BUFFER, hVObj, 0, (iStartX), (iStartY), VO_BLT_SRCTRANSPARENCY, NULL);

  pETRLEObject.value.sOffsetX = sTempOffsetX;
  pETRLEObject.value.sOffsetY = sTempOffsetY;

  SetClippingRect(&ClipRect);
}

//----------------------------------------------------------------------------------------------
//	PlaceLight
//
//	Creates and places a light of selected radius and color into the world.
//
function PlaceLight(sRadius: INT16, iMapX: INT16, iMapY: INT16, sType: INT16): BOOLEAN {
  let iLightHandle: INT32;
  let ubIntensity: UINT8;
  let Filename: STRING512;
  let iMapIndex: INT32;
  let usTmpIndex: UINT16;

  sprintf(Filename, "L-R%02d.LHT", sRadius);

  // Attempt to create light
  if ((iLightHandle = LightSpriteCreate(Filename, sType)) == (-1)) {
    // Couldn't load file because it doesn't exist. So let's make the file
    ubIntensity = (sRadius / LIGHT_DECAY);
    if ((iLightHandle = LightCreateOmni(ubIntensity, sRadius)) == (-1)) {
      // Can't create light template
      DebugMsg(TOPIC_GAME, DBG_LEVEL_1, String("PlaceLight: Can't create light template for radius %d", sRadius));
      return FALSE;
    }

    if (!LightSave(iLightHandle, Filename)) {
      // Can't save light template
      DebugMsg(TOPIC_GAME, DBG_LEVEL_1, String("PlaceLight: Can't save light template for radius %d", sRadius));
      return FALSE;
    }

    if ((iLightHandle = LightSpriteCreate(Filename, sType)) == (-1)) {
      // Can't create sprite
      DebugMsg(TOPIC_GAME, DBG_LEVEL_1, String("PlaceLight: Can't create light sprite of radius %d", sRadius));
      return FALSE;
    }
  }

  if (!LightSpritePower(iLightHandle, TRUE)) {
    // Can't turn this light on
    DebugMsg(TOPIC_GAME, DBG_LEVEL_1, String("PlaceLight: Can't turn on light %d", iLightHandle));
    return FALSE;
  }

  if (!LightSpritePosition(iLightHandle, iMapX, iMapY)) {
    // Can't set light's position
    DebugMsg(TOPIC_GAME, DBG_LEVEL_1, String("PlaceLight: Can't set light position for light %d", iLightHandle));
    return FALSE;
  }

  switch (gbDefaultLightType) {
    case PRIMETIME_LIGHT:
      LightSprites[iLightHandle].uiFlags |= LIGHT_PRIMETIME;
      break;
    case NIGHTTIME_LIGHT:
      LightSprites[iLightHandle].uiFlags |= LIGHT_NIGHTTIME;
      break;
  }

  iMapIndex = (iMapY * WORLD_COLS) + iMapX;
  if (!TypeExistsInObjectLayer(iMapIndex, GOODRING, &usTmpIndex)) {
    AddObjectToHead(iMapIndex, GOODRING1);
    gpWorldLevelData[iMapIndex].pObjectHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
  }

  AddLightToUndoList(iMapIndex, 0, 0);

  return TRUE;
}

//----------------------------------------------------------------------------------------------
//	RemoveLight
//
//	Removes (erases) all lights at a given map tile location. Lights that are attached to a merc
//	are not deleted.
//
//	Returns TRUE if deleted the light, otherwise, returns FALSE.
//	i.e. FALSE is not an error condition!
//
function RemoveLight(iMapX: INT16, iMapY: INT16): BOOLEAN {
  let iCount: INT32;
  let cnt: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fSoldierLight: BOOLEAN;
  let fRemovedLight: BOOLEAN;
  let iMapIndex: INT32;
  let uiLastLightType: UINT32;
  let pLastLightName: Pointer<UINT8>;

  fRemovedLight = FALSE;

  // Check all lights if any at this given position
  for (iCount = 0; iCount < MAX_LIGHT_SPRITES; iCount++) {
    if (LightSprites[iCount].uiFlags & LIGHT_SPR_ACTIVE) {
      if (LightSprites[iCount].iX == iMapX && LightSprites[iCount].iY == iMapY) {
        // Found a light, so let's see if it belong to a merc!
        fSoldierLight = FALSE;
        for (cnt = 0; cnt < MAX_NUM_SOLDIERS && !fSoldierLight; cnt++) {
          if (GetSoldier(&pSoldier, cnt)) {
            if (pSoldier.value.iLight == iCount)
              fSoldierLight = TRUE;
          }
        }

        if (!fSoldierLight) {
          // Ok, it's not a merc's light so kill it!
          pLastLightName = LightSpriteGetTypeName(iCount);
          uiLastLightType = LightSprites[iCount].uiLightType;
          LightSpritePower(iCount, FALSE);
          LightSpriteDestroy(iCount);
          fRemovedLight = TRUE;
          iMapIndex = (iMapY * WORLD_COLS) + iMapX;
          RemoveAllObjectsOfTypeRange(iMapIndex, GOODRING, GOODRING);
        }
      }
    }
  }
  if (fRemovedLight) {
    let usRadius: UINT16;
    // Assuming that the light naming convention doesn't change, then this following conversion
    // should work.  Basically, the radius values aren't stored in the lights, so I have pull
    // the radius out of the filename.  Ex:  L-RO5.LHT
    usRadius = pLastLightName[4] - 0x30;
    AddLightToUndoList(iMapIndex, usRadius, uiLastLightType);
  }

  return fRemovedLight;
}

//----------------------------------------------------------------------------------------------
//	ShowLightPositionHandles
//
//	For all lights that are in the world (except lights attached to mercs), this function places
//	a marker at it's location for editing purposes.
//
function ShowLightPositionHandles(): void {
  let iCount: INT32;
  let iMapIndex: INT32;
  let cnt: UINT16;
  let usTmpIndex: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fSoldierLight: BOOLEAN;

  // Check all lights and place a position handle there!
  for (iCount = 0; iCount < MAX_LIGHT_SPRITES; iCount++) {
    if (LightSprites[iCount].uiFlags & LIGHT_SPR_ACTIVE) {
      // Found a light, so let's see if it belong to a merc!
      fSoldierLight = FALSE;
      for (cnt = 0; cnt < MAX_NUM_SOLDIERS && !fSoldierLight; cnt++) {
        if (GetSoldier(&pSoldier, cnt)) {
          if (pSoldier.value.iLight == iCount)
            fSoldierLight = TRUE;
        }
      }

      if (!fSoldierLight) {
        iMapIndex = (LightSprites[iCount].iY * WORLD_COLS) + LightSprites[iCount].iX;
        if (!TypeExistsInObjectLayer(iMapIndex, GOODRING, &usTmpIndex)) {
          AddObjectToHead(iMapIndex, GOODRING1);
          gpWorldLevelData[iMapIndex].pObjectHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
        }
      }
    }
  }
}

//----------------------------------------------------------------------------------------------
//	RemoveLightPositionHandles
//
//	Scans through all light currently in the world and removes any light markers that may be present.
//
function RemoveLightPositionHandles(): void {
  let iCount: INT32;
  let iMapIndex: INT32;
  let cnt: UINT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fSoldierLight: BOOLEAN;

  // Check all lights and remove the position handle there!
  for (iCount = 0; iCount < MAX_LIGHT_SPRITES; iCount++) {
    if (LightSprites[iCount].uiFlags & LIGHT_SPR_ACTIVE) {
      // Found a light, so let's see if it belong to a merc!
      fSoldierLight = FALSE;
      for (cnt = 0; cnt < MAX_NUM_SOLDIERS && !fSoldierLight; cnt++) {
        if (GetSoldier(&pSoldier, cnt)) {
          if (pSoldier.value.iLight == iCount)
            fSoldierLight = TRUE;
        }
      }

      if (!fSoldierLight) {
        iMapIndex = (LightSprites[iCount].iY * WORLD_COLS) + LightSprites[iCount].iX;
        RemoveAllObjectsOfTypeRange(iMapIndex, GOODRING, GOODRING);
      }
    }
  }
}

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//	End of button callback functions
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------
//	CheckForSlantRoofs
//
//	Verifies whether there are any slant roofs selected in the "multiwall" or "room" selection list.
//	if so, and no flat roofs were selected, then we return TRUE, otherwise we return FALSE.
//
//	This function is used to determine if we should force the area selection of rooms to handle
//	slant roofs (which require at least one side to be exactly 8 tiles wide)
//
function CheckForSlantRoofs(): BOOLEAN {
  let usCheck: UINT16;

  pSelList = SelRoom;
  pNumSelList = &iNumRoomsSelected;

  usCheck = GetRandomIndexByRange(FIRSTROOF, LASTROOF);
  if (usCheck != 0xffff)
    return FALSE;

  usCheck = GetRandomIndexByRange(FIRSTSLANTROOF, LASTSLANTROOF);
  return usCheck != 0xffff;
}

//----------------------------------------------------------------------------------------------
//	MapOptimize
//
//	Runs through all map locations, and if it's outside the visible world, then we remove
//	EVERYTHING from it since it will never be seen!
//
//	If it can be seen, then we remove all extraneous land tiles. We find the tile that has the first
//	FULL TILE indicator, and delete anything that may come after it (it'll never be seen anyway)
//
//	Doing the above has shown to free up about 1.1 Megs on the default map. Deletion of non-viewable
//	land pieces alone gained us about 600 K of memory.
//
function MapOptimize(): void {
}

//----------------------------------------------------------------------------------------------
//	CheckForFences
//
//	Verifies whether the selection list has only fence pieces. If so, turns off random selection
//	for that selection list.
//
//	if ANY piece other than a fence piece exists in the selection list, then we want to keep
//	random selections.
//
function CheckForFences(): BOOLEAN {
  let usCheck: UINT16;
  let fFence: BOOLEAN;
  let T: Pointer<TILE_ELEMENT>;

  pSelList = SelOStructs2;
  pNumSelList = &iNumOStructs2Selected;

  fFence = TRUE;

  for (usCheck = 0; usCheck < iNumOStructs2Selected; usCheck++) {
    T = &gTileDatabase[gTileTypeStartIndex[pSelList[usCheck].uiObject]];
    if (T.value.pDBStructureRef == NULL)
      fFence = FALSE;
    else if (!(T.value.pDBStructureRef.value.pDBStructure.value.fFlags & STRUCTURE_ANYFENCE))
      fFence = FALSE;
  }

  return fFence;
}

function EnsureStatusOfEditorButtons(): void {
  if (iDrawMode >= DRAW_MODE_ERASE) {
    ClickEditorButton(TERRAIN_TOGGLE_ERASEMODE);
    ClickEditorButton(BUILDING_TOGGLE_ERASEMODE);
    ClickEditorButton(MAPINFO_TOGGLE_ERASEMODE);
  } else {
    UnclickEditorButton(TERRAIN_TOGGLE_ERASEMODE);
    UnclickEditorButton(BUILDING_TOGGLE_ERASEMODE);
    UnclickEditorButton(MAPINFO_TOGGLE_ERASEMODE);
  }

  // disable erase buttons if drawing caves
  if (iDrawMode == DRAW_MODE_CAVES || iDrawMode == DRAW_MODE_NEWROOF)
    DisableEditorButton(BUILDING_TOGGLE_ERASEMODE);
  else
    EnableEditorButton(BUILDING_TOGGLE_ERASEMODE);

  // Ensure that the fill button is on or off depending on our current mode
  if (iDrawMode == (DRAW_MODE_GROUND + DRAW_MODE_FILL_AREA))
    ClickEditorButton(TERRAIN_FILL_AREA);
  else
    UnclickEditorButton(TERRAIN_FILL_AREA);

  // Make sure that the fake-lighting button is down if appropriate
  if (gfFakeLights)
    ClickEditorButton(MAPINFO_TOGGLE_FAKE_LIGHTS);
  else
    UnclickEditorButton(MAPINFO_TOGGLE_FAKE_LIGHTS);
}

function HandleMouseClicksInGameScreen(): void {
  let dummy: EXITGRID = [ 0, 0, 0, 0 ];
  let sX: INT16;
  let sY: INT16;
  let fPrevState: BOOLEAN;
  if (!GetMouseXY(&sGridX, &sGridY))
    return;
  if (iCurrentTaskbar == TASK_OPTIONS || iCurrentTaskbar == TASK_NONE) {
    // if in taskbar modes which don't process clicks in the world.
    return;
  }
  if (!(gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA)) {
    // if mouse cursor not in the game screen.
    return;
  }

  iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);

  fPrevState = gfRenderWorld;

  if (_LeftButtonDown) {
    gfRenderWorld = TRUE;
    // Are we trying to erase something?
    if (iDrawMode >= DRAW_MODE_ERASE) {
      // Erasing can have a brush size larger than 1 tile
      for (sY = gSelectRegion.iTop; sY <= gSelectRegion.iBottom; sY++) {
        for (sX = gSelectRegion.iLeft; sX <= gSelectRegion.iRight; sX++) {
          if (iDrawMode == (DRAW_MODE_LIGHT + DRAW_MODE_ERASE)) {
            RemoveLight(sX, sY);
          } else
            EraseMapTile(MAPROWCOLTOPOS(sY, sX));
        }
      }

      if (iDrawMode == DRAW_MODE_LIGHT + DRAW_MODE_ERASE)
        LightSpriteRenderAll(); // To adjust building's lighting
      return;
    }

    switch (iDrawMode) {
      case DRAW_MODE_SCHEDULEACTION:
        if (IsLocationSittableExcludingPeople(iMapIndex, FALSE)) {
          iDrawMode = DRAW_MODE_SCHEDULECONFIRM;
          gfFirstPlacement = FALSE;
        }
        break;
      case DRAW_MODE_NORTHPOINT:
      case DRAW_MODE_WESTPOINT:
      case DRAW_MODE_EASTPOINT:
      case DRAW_MODE_SOUTHPOINT:
      case DRAW_MODE_CENTERPOINT:
      case DRAW_MODE_ISOLATEDPOINT:
        SpecifyEntryPoint(iMapIndex);
        break;

      case DRAW_MODE_ENEMY:
      case DRAW_MODE_CREATURE:
      case DRAW_MODE_REBEL:
      case DRAW_MODE_CIVILIAN:
        // Handle adding mercs to the world
        if (gfFirstPlacement) {
          AddMercToWorld(iMapIndex);
          gfFirstPlacement = FALSE;
        }
        break;

      case DRAW_MODE_LIGHT:
        // Add a normal light to the world
        if (gfFirstPlacement) {
          PlaceLight(gsLightRadius, sGridX, sGridY, 0);
          gfFirstPlacement = FALSE;
        }
        break;

      case DRAW_MODE_SAW_ROOM:
      case DRAW_MODE_ROOM:
      case DRAW_MODE_CAVES:
        if (gusSelectionType >= SMALLSELECTION && gusSelectionType <= XLARGESELECTION)
          ProcessAreaSelection(TRUE);
        break;
      case DRAW_MODE_NEWROOF:
        ReplaceBuildingWithNewRoof(iMapIndex);
        break;

      case DRAW_MODE_WALLS:
        PasteSingleWall(iMapIndex);
        break;
      case DRAW_MODE_DOORS:
        PasteSingleDoor(iMapIndex);
        break;
      case DRAW_MODE_WINDOWS:
        PasteSingleWindow(iMapIndex);
        break;
      case DRAW_MODE_ROOFS:
        PasteSingleRoof(iMapIndex);
        break;
      case DRAW_MODE_BROKEN_WALLS:
        PasteSingleBrokenWall(iMapIndex);
        break;
      case DRAW_MODE_DECOR:
        PasteSingleDecoration(iMapIndex);
        break;
      case DRAW_MODE_DECALS:
        if (ValidDecalPlacement(iMapIndex))
          PasteSingleDecal(iMapIndex);
        break;
      case DRAW_MODE_TOILET:
        PasteSingleToilet(iMapIndex);
        break;
      case DRAW_MODE_SMART_WALLS:
        PasteSmartWall(iMapIndex);
        break;
      case DRAW_MODE_SMART_DOORS:
        PasteSmartDoor(iMapIndex);
        break;
      case DRAW_MODE_SMART_WINDOWS:
        PasteSmartWindow(iMapIndex);
        break;
      case DRAW_MODE_SMART_BROKEN_WALLS:
        PasteSmartBrokenWall(iMapIndex);
        break;
      case DRAW_MODE_EXITGRID:
      case DRAW_MODE_FLOORS:
      case DRAW_MODE_GROUND:
      case DRAW_MODE_OSTRUCTS:
      case DRAW_MODE_OSTRUCTS1:
      case DRAW_MODE_OSTRUCTS2:
      case DRAW_MODE_DEBRIS:
        if (gusSelectionType >= SMALLSELECTION && gusSelectionType <= XLARGESELECTION) {
          DrawObjectsBasedOnSelectionRegion();
        } else
          gfRenderWorld = fPrevState;
        break;
      case DRAW_MODE_DOORKEYS:
        InitDoorEditing(iMapIndex);
        break;
      case DRAW_MODE_KILL_BUILDING:
        KillBuilding(iMapIndex);
        break;
      case DRAW_MODE_COPY_BUILDING:
      case DRAW_MODE_MOVE_BUILDING:
        if (gfFirstPlacement) {
          CopyBuilding(iMapIndex);
          gfFirstPlacement = FALSE;
        }
        gfRenderWorld = fPrevState;
        break;
      case DRAW_MODE_BANKS:
        PasteBanks(iMapIndex, gsBanksSubIndex, TRUE);
        break;
      case DRAW_MODE_ROADS:
        PasteRoads(iMapIndex);
        break;
      case (DRAW_MODE_GROUND + DRAW_MODE_FILL_AREA):
        TerrainFill(iMapIndex);
        // BeginFill( iMapIndex );
        break;
      case DRAW_MODE_PLACE_ITEM:
        if (gfFirstPlacement) {
          AddSelectedItemToWorld(iMapIndex);
          gfFirstPlacement = FALSE;
        }
        break;
      default:
        gfRenderWorld = fPrevState;
        break;
    }
  } else if (_RightButtonDown) {
    gfRenderWorld = TRUE;
    switch (iDrawMode) {
      // Handle right clicking on a merc (for editing/moving him)
      case DRAW_MODE_ENEMY:
      case DRAW_MODE_CREATURE:
      case DRAW_MODE_REBEL:
      case DRAW_MODE_CIVILIAN:
        HandleRightClickOnMerc(iMapIndex);
        break;
      case DRAW_MODE_PLACE_ITEM:
        HandleRightClickOnItem(iMapIndex);
        break;

      // Handle the right clicks in the main window to bring up the appropriate selection window
      case DRAW_MODE_WALLS:
        iEditorToolbarState = TBAR_MODE_GET_WALL;
        break;
      case DRAW_MODE_DOORS:
        iEditorToolbarState = TBAR_MODE_GET_DOOR;
        break;
      case DRAW_MODE_WINDOWS:
        iEditorToolbarState = TBAR_MODE_GET_WINDOW;
        break;
      case DRAW_MODE_ROOFS:
        iEditorToolbarState = TBAR_MODE_GET_ROOF;
        break;
      case DRAW_MODE_BROKEN_WALLS:
        iEditorToolbarState = TBAR_MODE_GET_BROKEN_WALL;
        break;
      case DRAW_MODE_DECOR:
        iEditorToolbarState = TBAR_MODE_GET_DECOR;
        break;
      case DRAW_MODE_DECALS:
        iEditorToolbarState = TBAR_MODE_GET_DECAL;
        break;
      case DRAW_MODE_FLOORS:
        iEditorToolbarState = TBAR_MODE_GET_FLOOR;
        break;
      case DRAW_MODE_TOILET:
        iEditorToolbarState = TBAR_MODE_GET_TOILET;
        break;

      case DRAW_MODE_ROOM:
        iEditorToolbarState = TBAR_MODE_GET_ROOM;
        break;
      case DRAW_MODE_NEWROOF:
        iEditorToolbarState = TBAR_MODE_GET_NEW_ROOF;
        break;
      case DRAW_MODE_SLANTED_ROOF:
        iEditorToolbarState = TBAR_MODE_GET_ROOM;
        break;
      case DRAW_MODE_DEBRIS:
        iEditorToolbarState = TBAR_MODE_GET_DEBRIS;
        break;
      case DRAW_MODE_OSTRUCTS:
        iEditorToolbarState = TBAR_MODE_GET_OSTRUCTS;
        break;
      case DRAW_MODE_OSTRUCTS1:
        iEditorToolbarState = TBAR_MODE_GET_OSTRUCTS1;
        break;
      case DRAW_MODE_OSTRUCTS2:
        iEditorToolbarState = TBAR_MODE_GET_OSTRUCTS2;
        break;
      case DRAW_MODE_BANKS:
        iEditorToolbarState = TBAR_MODE_GET_BANKS;
        break;
      case DRAW_MODE_ROADS:
        iEditorToolbarState = TBAR_MODE_GET_ROADS;
        break;

      case DRAW_MODE_CAVES:
        if (gusSelectionType >= SMALLSELECTION && gusSelectionType <= XLARGESELECTION)
          ProcessAreaSelection(FALSE);
        break;

      case DRAW_MODE_SMART_WALLS:
        EraseWalls(iMapIndex);
        break;
      case DRAW_MODE_SMART_BROKEN_WALLS:
      case DRAW_MODE_SMART_WINDOWS:
      case DRAW_MODE_SMART_DOORS:
        RestoreWalls(iMapIndex);
        break;
      case DRAW_MODE_EXITGRID:
        if (GetExitGrid(iMapIndex, &gExitGrid))
          ApplyNewExitGridValuesToTextFields();
        break;
      default:
        gfRenderWorld = fPrevState;
        break;
    }
  } else if (!_LeftButtonDown && !gfFirstPlacement) {
    switch (iDrawMode) {
      case DRAW_MODE_SCHEDULECONFIRM:
        if (IsLocationSittableExcludingPeople(iMapIndex, FALSE)) {
          RegisterCurrentScheduleAction(iMapIndex);
        }
        break;
      case DRAW_MODE_COPY_BUILDING:
        PasteBuilding(iMapIndex);
        break;
      case DRAW_MODE_MOVE_BUILDING:
        MoveBuilding(iMapIndex);
        break;
    }
  }
}

function DoIRenderASpecialMouseCursor(): BOOLEAN {
  let sMouseX_M: INT16;
  let sMouseY_M: INT16;

  // Draw basic mouse
  if (GetMouseXY(&sMouseX_M, &sMouseY_M)) {
    if ((gsCursorGridNo = MAPROWCOLTOPOS(sMouseY_M, sMouseX_M)) < 0x8000) {
      // Add basic cursor
      // gBasicCursorNode = AddTopmostToTail( gsCursorGridNo, FIRSTPOINTERS1 );
    }
  }

  if (iCurrentTaskbar != TASK_OPTIONS) {
    switch (iDrawMode) {
      case DRAW_MODE_OSTRUCTS2:
        if (CheckForFences())
          fDontUseRandom = TRUE;
      case DRAW_MODE_DEBRIS: // These only show if you first hit PGUP/PGDOWN keys
      case DRAW_MODE_OSTRUCTS:
      case DRAW_MODE_OSTRUCTS1:
        if (!fDontUseRandom)
          break;
      case DRAW_MODE_BANKS:
      case DRAW_MODE_ROADS:
      case DRAW_MODE_WALLS:
      case DRAW_MODE_DOORS:
      case DRAW_MODE_WINDOWS:
      case DRAW_MODE_ROOFS:
      case DRAW_MODE_BROKEN_WALLS:
      case DRAW_MODE_DECOR:
      case DRAW_MODE_DECALS:
      case DRAW_MODE_FLOORS:
      case DRAW_MODE_TOILET:

      case DRAW_MODE_SMART_WALLS:
      case DRAW_MODE_SMART_DOORS:
      case DRAW_MODE_SMART_WINDOWS:
      case DRAW_MODE_SMART_BROKEN_WALLS:
      case DRAW_MODE_ROOM:
      case DRAW_MODE_NEWROOF:
        return DrawTempMouseCursorObject();

      default:
        break;
    }
  }
  return FALSE;
}

function ShowEntryPoints(): void {
  // make entry points visible
  if (gMapInformation.sNorthGridNo != -1)
    AddTopmostToTail(gMapInformation.sNorthGridNo, FIRSTPOINTERS2);
  if (gMapInformation.sEastGridNo != -1)
    AddTopmostToTail(gMapInformation.sEastGridNo, FIRSTPOINTERS2);
  if (gMapInformation.sSouthGridNo != -1)
    AddTopmostToTail(gMapInformation.sSouthGridNo, FIRSTPOINTERS2);
  if (gMapInformation.sWestGridNo != -1)
    AddTopmostToTail(gMapInformation.sWestGridNo, FIRSTPOINTERS2);
}

function HideEntryPoints(): void {
  // remove entry point indicators
  if (gMapInformation.sNorthGridNo != -1)
    RemoveAllTopmostsOfTypeRange(gMapInformation.sNorthGridNo, FIRSTPOINTERS, FIRSTPOINTERS);
  if (gMapInformation.sEastGridNo != -1)
    RemoveAllTopmostsOfTypeRange(gMapInformation.sEastGridNo, FIRSTPOINTERS, FIRSTPOINTERS);
  if (gMapInformation.sSouthGridNo != -1)
    RemoveAllTopmostsOfTypeRange(gMapInformation.sSouthGridNo, FIRSTPOINTERS, FIRSTPOINTERS);
  if (gMapInformation.sWestGridNo != -1)
    RemoveAllTopmostsOfTypeRange(gMapInformation.sWestGridNo, FIRSTPOINTERS, FIRSTPOINTERS);
}

function TaskOptionsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iTaskMode = TASK_OPTIONS;
  }
}

function TaskTerrainCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iTaskMode = TASK_TERRAIN;
  }
}

function TaskBuildingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iTaskMode = TASK_BUILDINGS;
  }
}

function TaskItemsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iTaskMode = TASK_ITEMS;
  }
}

function TaskMercsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iTaskMode = TASK_MERCS;
  }
}

function TaskMapInfoCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iTaskMode = TASK_MAPINFO;
  }
}

function ProcessAreaSelection(fWithLeftButton: BOOLEAN): void {
  let fPrevState: BOOLEAN = gfRenderWorld;
  gfRenderWorld = TRUE;
  switch (iDrawMode) {
    case DRAW_MODE_ROOM:
    case DRAW_MODE_SLANTED_ROOF:
      AddBuildingSectionToWorld(&gSelectRegion);
      break;
    case DRAW_MODE_SAW_ROOM:
      RemoveBuildingSectionFromWorld(&gSelectRegion);
      break;
    case DRAW_MODE_CAVES:
      if (fWithLeftButton)
        AddCaveSectionToWorld(&gSelectRegion);
      else
        RemoveCaveSectionFromWorld(&gSelectRegion);
      break;
    case DRAW_MODE_ROOMNUM:
      DrawObjectsBasedOnSelectionRegion();
      if (gubCurrRoomNumber > 0) {
        gubCurrRoomNumber++;
        gubMaxRoomNumber++;
        if (iCurrentTaskbar == TASK_BUILDINGS && TextInputMode()) {
          let str: UINT16[] /* [4] */;
          swprintf(str, "%d", gubCurrRoomNumber);
          SetInputFieldStringWith16BitString(1, str);
          SetActiveField(0);
        }
      }
      break;
    case DRAW_MODE_EXITGRID:
    case DRAW_MODE_FLOORS:
    case DRAW_MODE_GROUND:
    case DRAW_MODE_OSTRUCTS:
    case DRAW_MODE_OSTRUCTS1:
    case DRAW_MODE_OSTRUCTS2:
    case DRAW_MODE_DEBRIS:
      // These aren't normally supported by area selection, so
      // call the equivalent function that is normally associated with them.
      DrawObjectsBasedOnSelectionRegion();
      break;
    default:
      gfRenderWorld = fPrevState;
      break;
  }
}

// For any drawing modes that support large cursors, or even area selection, this function calls the
// appropriate paste function for every gridno within the cursor.  This is not used for functions that
// rely completely on selection areas, such as buildings.
function DrawObjectsBasedOnSelectionRegion(): void {
  let x: INT32;
  let y: INT32;
  let iMapIndex: INT32;
  let fSkipTest: BOOLEAN;

  // Certain drawing modes are placed with 100% density.  Those cases are checked here,
  // so the density test can be skipped.
  fSkipTest = FALSE;
  if (gusSelectionType == SMALLSELECTION || iDrawMode == DRAW_MODE_GROUND || iDrawMode == DRAW_MODE_FLOORS || iDrawMode == DRAW_MODE_ROOMNUM || iDrawMode == DRAW_MODE_EXITGRID)
    fSkipTest = TRUE;

  // The reason why I process the region from top to bottom then to the right is
  // to even out the binary tree undo placements.  Otherwise, the placements within
  // the undo binary tree would alway choose the right branch because the imapindex is
  // always greater than the previously positioned one.
  // Process the cursor area
  for (x = gSelectRegion.iLeft; x <= gSelectRegion.iRight; x++) {
    // process the region from
    for (y = gSelectRegion.iTop; y <= gSelectRegion.iBottom; y++) {
      if (fSkipTest || PerformDensityTest()) {
        iMapIndex = MAPROWCOLTOPOS(y, x);
        switch (iDrawMode) {
          case DRAW_MODE_EXITGRID:
            AddToUndoList(iMapIndex);
            AddExitGridToWorld(iMapIndex, &gExitGrid);
            AddTopmostToTail(iMapIndex, FIRSTPOINTERS8);
            break;
          case DRAW_MODE_DEBRIS:
            PasteDebris(iMapIndex);
            break;
          case DRAW_MODE_FLOORS:
            PasteSingleFloor(iMapIndex);
            break;
          case DRAW_MODE_GROUND:
            PasteTexture(iMapIndex);
            break;
          case DRAW_MODE_OSTRUCTS:
            PasteStructure(iMapIndex);
            break;
          case DRAW_MODE_OSTRUCTS1:
            PasteStructure1(iMapIndex);
            break;
          case DRAW_MODE_OSTRUCTS2:
            PasteStructure2(iMapIndex);
            break;
          case DRAW_MODE_ROOMNUM:
            PasteRoomNumber(iMapIndex, gubCurrRoomNumber);
            break;
          default:
            return; // no point in continuing...
        }
      }
    }
  }
}

// The main loop of the editor.
function EditScreenHandle(): UINT32 {
  let uiRetVal: UINT32;
  let fShowingCursor: BOOLEAN;
  StartFrameBufferRender();

  if (gfWorldLoaded && gMapInformation.ubMapVersion <= 7 && !gfCorruptMap) {
    ScreenMsg(FONT_MCOLOR_RED, MSG_ERROR, "Map data has just been corrupted.  Don't save, don't quit, get Kris!  If he's not here, save the map using a temp filename and document everything you just did, especially your last action!");
    gfCorruptMap = TRUE;
  }
  if (gfWorldLoaded && gubScheduleID > 40 && !gfCorruptSchedules) {
    OptimizeSchedules();
    if (gubScheduleID > 32) {
      ScreenMsg(FONT_MCOLOR_RED, MSG_ERROR, "Schedule data has just been corrupted.  Don't save, don't quit, get Kris!  If he's not here, save the map using a temp filename and document everything you just did, especially your last action!");
      gfCorruptSchedules = TRUE;
    }
  }

  if (gfAutoLoadA9 == 2)
    AutoLoadMap();

  if (fEditModeFirstTime) {
    EditModeInit();
  }

  if (InOverheadMap() && !gfSummaryWindowActive) {
    HandleOverheadMap();
  }

  // Calculate general mouse information
  GetMouseXY(&sGridX, &sGridY);
  iMapIndex = sGridY * WORLD_COLS + sGridX;

  DetermineUndoState();

  fBeenWarned = FALSE;

  uiRetVal = EDIT_SCREEN;

  // Handle the bottom task bar menu.
  DoTaskbar();

  // Process the variety of popup menus, dialogs, etc.

  if (gubMessageBoxStatus) {
    if (MessageBoxHandled())
      return ProcessEditscreenMessageBoxResponse();
    return EDIT_SCREEN;
  }

  if (ProcessPopupMenuIfActive())
    return EDIT_SCREEN;
  if (fHelpScreen)
    return WaitForHelpScreenResponse();
  if (fSelectionWindow)
    return WaitForSelectionWindowResponse();

  // If editing mercs, handle that stuff
  ProcessMercEditing();

  EnsureStatusOfEditorButtons();

  // Handle scrolling of the map if needed
  if (!gfGotoGridNoUI && iDrawMode != DRAW_MODE_SHOW_TILESET && !gfSummaryWindowActive && !gfEditingDoor && !gfNoScroll && !InOverheadMap())
    ScrollWorld();

  iCurrentAction = ACTION_NULL;

  UpdateCursorAreas();

  HandleMouseClicksInGameScreen();

  if (!gfFirstPlacement && !gfLeftButtonState)
    gfFirstPlacement = TRUE;

  // If we are copying or moving a building, we process, then delete the building layout immediately
  // after releasing the mouse button.  If released in the world, then the building would have been
  // processed in above function, HandleMouseClicksInGameScreen().
  if (!_LeftButtonDown && gpBuildingLayoutList)
    DeleteBuildingLayout();

  fShowingCursor = DoIRenderASpecialMouseCursor();

  DequeAllGameEvents(TRUE);

  if (fBuildingShowRoomInfo) {
    SetRenderFlags(RENDER_FLAG_ROOMIDS);
  }

  if (gfRenderWorld) {
    if (gCursorNode)
      gCursorNode.value.uiFlags &= (~LEVELNODE_REVEAL);

    // This flag is the beast that makes the renderer do everything
    MarkWorldDirty();

    gfRenderWorld = FALSE;
  }

  // The default here for the renderer is to just do dynamic stuff...
  if (!gfSummaryWindowActive && !gfEditingDoor && !InOverheadMap())
    RenderWorld();

  DisplayWayPoints();

  if (fShowingCursor)
    RemoveTempMouseCursorObject();

  ProcessEditorRendering();

  // Handle toolbar selections
  HandleJA2ToolbarSelection();

  // Handle keyboard shortcuts / selections
  HandleKeyboardShortcuts();

  // Perform action based on current selection
  if ((uiRetVal = PerformSelectedAction()) != EDIT_SCREEN)
    return uiRetVal;

  // Display Framerate
  DisplayFrameRate();

  // Handle video overlays, for FPS and screen message stuff
  if (gfScrollPending) {
    AllocateVideoOverlaysArea();
    SaveVideoOverlaysArea(FRAME_BUFFER);
  }
  ExecuteVideoOverlays();

  ScrollString();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  return uiRetVal;
}

function CreateGotoGridNoUI(): void {
  gfGotoGridNoUI = TRUE;
  // Disable the rest of the editor
  DisableEditorTaskbar();
  // Create the background panel.
  guiGotoGridNoUIButtonID = CreateTextButton("Enter gridno:", FONT10ARIAL, FONT_YELLOW, FONT_BLACK, BUTTON_USE_DEFAULT, 290, 155, 60, 50, BUTTON_NO_TOGGLE, MSYS_PRIORITY_NORMAL, DEFAULT_MOVE_CALLBACK, MSYS_NO_CALLBACK);
  SpecifyDisabledButtonStyle(guiGotoGridNoUIButtonID, DISABLED_STYLE_NONE);
  SpecifyButtonTextOffsets(guiGotoGridNoUIButtonID, 5, 5, FALSE);
  DisableButton(guiGotoGridNoUIButtonID);
  // Create a blanket region so nobody can use
  MSYS_DefineRegion(&GotoGridNoUIRegion, 0, 0, 640, 480, MSYS_PRIORITY_NORMAL + 1, 0, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  // Init a text input field.
  InitTextInputModeWithScheme(DEFAULT_SCHEME);
  AddTextInputField(300, 180, 40, 18, MSYS_PRIORITY_HIGH, "", 6, INPUTTYPE_NUMERICSTRICT);
}

function RemoveGotoGridNoUI(): void {
  let iMapIndex: INT32;
  gfGotoGridNoUI = FALSE;
  // Enable the rest of the editor
  EnableEditorTaskbar();
  RemoveButton(guiGotoGridNoUIButtonID);
  iMapIndex = GetNumericStrictValueFromField(0);
  KillTextInputMode();
  MSYS_RemoveRegion(&GotoGridNoUIRegion);
  if (iMapIndex != -1) {
    // Warp the screen to the location of this gridno.
    CenterScreenAtMapIndex(iMapIndex);
  } else {
    MarkWorldDirty();
  }
}

function UpdateLastActionBeforeLeaving(): void {
  if (iCurrentTaskbar == TASK_MERCS)
    IndicateSelectedMerc(SELECT_NO_MERC);
  SpecifyItemToEdit(NULL, -1);
}

function ReloadMap(): void {
  let szFilename: UINT16[] /* [30] */;
  swprintf(szFilename, "%S", gubFilename);
  ExternalLoadMap(szFilename);
}
