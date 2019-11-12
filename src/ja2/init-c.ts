namespace ja2 {

// The InitializeGame function is responsible for setting up all data and Gaming Engine
// tasks which will run the game

export function InitializeJA2(): UINT32 {
  HandleJA2CDCheck();

  gfWorldLoaded = false;

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
    return Enum26.ERROR_SCREEN;
  }

  // Init lighting system
  InitLightingSystem();

  // Init dialog queue system
  InitalizeDialogueControl();

  if (!InitStrategicEngine()) {
    return Enum26.ERROR_SCREEN;
  }

  // needs to be called here to init the SectorInfo struct
  InitStrategicMovementCosts();

  // Init tactical engine
  if (!InitTacticalEngine()) {
    return Enum26.ERROR_SCREEN;
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
    return Enum26.ERROR_SCREEN;
  }

  // Initailize World
  if (!InitializeWorld()) {
    return Enum26.ERROR_SCREEN;
  }

  InitTileCache();

  InitMercPopupBox();

  // Set global volume
  MusicSetVolume(gGameSettings.ubMusicVolumeSetting);

  DetermineRGBDistributionSettings();

  return Enum26.INIT_SCREEN;
}

export function ShutdownJA2(): void {
  let uiIndex: UINT32;

  // Clear screen....
  ColorFillVideoSurfaceArea(FRAME_BUFFER, 0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)));
  InvalidateScreen();
  // Remove cursor....
  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  RefreshScreen(null);

  ShutdownStrategicLayer();

  // remove temp files built by laptop
  ClearOutTempLaptopFiles();

  // Shutdown queue system
  ShutdownDialogueControl();

  // Shutdown Screens
  for (uiIndex = 0; uiIndex < Enum26.MAX_SCREENS; uiIndex++) {
    GameScreens[uiIndex].ShutdownScreen();
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

}
