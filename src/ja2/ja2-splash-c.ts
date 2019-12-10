namespace ja2 {

export let guiSplashFrameFade: UINT32 = 10;
export let guiSplashStartTime: UINT32 = 0;

// Simply create videosurface, load image, and draw it to the screen.
export function InitJA2SplashScreen(): void {
  InitializeJA2Clock();
  // InitializeJA2TimerID();
  // Get Executable Directory
  // Adjust Current Dir
  if (!SetFileManCurrentDirectory(JA2_DATA_DIR)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Could not find data directory, shutting down");
    return;
  }

  // Initialize the file database
  InitializeFileDatabase();

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
  RefreshScreen();

  guiSplashStartTime = GetJA2Clock();
}

}
