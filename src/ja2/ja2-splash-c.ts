let guiSplashFrameFade: UINT32 = 10;
let guiSplashStartTime: UINT32 = 0;

// Simply create videosurface, load image, and draw it to the screen.
function InitJA2SplashScreen(): void {
  let uiLogoID: UINT32 = 0;
  let CurrentDir: STRING512;
  let DataDir: STRING512;
  let hVSurface: HVSURFACE;
  let VSurfaceDesc: VSURFACE_DESC;
  let i: INT32 = 0;

  InitializeJA2Clock();
  // InitializeJA2TimerID();
  // Get Executable Directory
  GetExecutableDirectory(CurrentDir);

  // Adjust Current Dir
  sprintf(DataDir, "%s\\Data", CurrentDir);
  if (!SetFileManCurrentDirectory(DataDir)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Could not find data directory, shutting down");
    return;
  }

  // Initialize the file database
  InitializeFileDatabase(gGameLibaries, Enum30.NUMBER_OF_LIBRARIES);

// FIXME: Language-specific code
// #ifdef ENGLISH
  ClearMainMenu();
// #else
//   {
//     memset(&VSurfaceDesc, 0, sizeof(VSURFACE_DESC));
//     VSurfaceDesc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;
//     GetMLGFilename(VSurfaceDesc.ImageFile, MLG_SPLASH);
//     if (!AddVideoSurface(&VSurfaceDesc, &uiLogoID)) {
//       AssertMsg(0, String("Failed to load %s", VSurfaceDesc.ImageFile));
//       return;
//     }
//
//     GetVideoSurface(&hVSurface, uiLogoID);
//     BltVideoSurfaceToVideoSurface(ghFrameBuffer, hVSurface, 0, 0, 0, 0, NULL);
//     DeleteVideoSurfaceFromIndex(uiLogoID);
//   }
// #endif

  InvalidateScreen();
  RefreshScreen(null);

  guiSplashStartTime = GetJA2Clock();
}
