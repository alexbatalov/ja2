extern BOOLEAN GetCDromDriveLetter(STR8 pString);

// The InitializeGame function is responsible for setting up all data and Gaming Engine
// tasks which will run the game

extern HINSTANCE ghInstance;

UINT32 InitializeJA2(void) {
  HandleJA2CDCheck();

  gfWorldLoaded = FALSE;

  // Load external text
  LoadAllExternalText();

  // Init JA2 sounds
  InitJA2Sound();

  gsRenderCenterX = 805;
  gsRenderCenterY = 805;

  // Init data
  InitializeSystemVideoObjects();

  // Init animation system
  if (!InitAnimationSystem()) {
    return ERROR_SCREEN;
  }

  // Init lighting system
  InitLightingSystem();

  // Init dialog queue system
  InitalizeDialogueControl();

  if (!InitStrategicEngine()) {
    return ERROR_SCREEN;
  }

  // needs to be called here to init the SectorInfo struct
  InitStrategicMovementCosts();

  // Init tactical engine
  if (!InitTacticalEngine()) {
    return ERROR_SCREEN;
  }

  // Init timer system
  // Moved to the splash screen code.
  // InitializeJA2Clock( );

  // INit shade tables
  BuildShadeTable();

  // INit intensity tables
  BuildIntensityTable();

  // Init Event Manager
  if (!InitializeEventManager()) {
    return ERROR_SCREEN;
  }

  // Initailize World
  if (!InitializeWorld()) {
    return ERROR_SCREEN;
  }

  InitTileCache();

  InitMercPopupBox();

  // Set global volume
  MusicSetVolume(gGameSettings.ubMusicVolumeSetting);

  DetermineRGBDistributionSettings();

  return INIT_SCREEN;
}

void ShutdownJA2(void) {
  UINT32 uiIndex;

  // Clear screen....
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  InvalidateScreen();
  // Remove cursor....
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  RefreshScreen(NULL);

  ShutdownStrategicLayer();

  // remove temp files built by laptop
  ClearOutTempLaptopFiles();

  // Shutdown queue system
  ShutdownDialogueControl();

  // Shutdown Screens
  for (uiIndex = 0; uiIndex < MAX_SCREENS; uiIndex++) {
    (*(GameScreens[uiIndex].ShutdownScreen))();
  }

  // Shutdown animation system
  DeInitAnimationSystem();

  ShutdownLightingSystem();

  CursorDatabaseClear();

  ShutdownTacticalEngine();

  // Shutdown Overhead
  ShutdownOverhead();

  DeinitializeWorld();

  DeleteTileCache();

  ShutdownJA2Clock();

  ShutdownFonts();

  ShutdownJA2Sound();

  ShutdownEventManager();

  ShutdownBaseDirtyRectQueue();

  // Unload any text box images!
  RemoveTextMercPopupImages();

  ClearOutVehicleList();
}
