namespace ja2 {

// Prototype Declarations

export let ghInstance: HTMLElement;

// Global Variable Declarations

let gfApplicationActive: boolean;
export let gfProgramIsRunning: boolean;
let gfGameInitialized: boolean = false;
export let gfDontUseDDBlits: boolean = false;

// There were TWO of them??!?! -- DB
// CHAR8		gzCommandLine[ 100 ];
export let gzCommandLine: string /* CHAR8[100] */; // Command line given

let gzErrorMsg: string /* CHAR8[2048] */ = "";
let gfIgnoreMessages: boolean = false;

// GLOBAL VARIBLE, SET TO DEFAULT BUT CAN BE CHANGED BY THE GAME IF INIT FILE READ
export let gbPixelDepth: UINT8 = PIXEL_DEPTH;

function InitializeStandardGamingPlatform(hInstance: HTMLElement): boolean {
  let pFontTable: FontTranslationTable;

  // Initialize the Debug Manager - success doesn't matter
  InitializeDebugManager();

  // Now start up everything else.
  RegisterDebugTopic(TOPIC_SGP, "Standard Gaming Platform");

  // this one needs to go ahead of all others (except Debug), for MemDebugCounter to work right...
  FastDebugMsg("Initializing Memory Manager");
  // Initialize the Memory Manager
  if (InitializeMemoryManager() == false) {
    // We were unable to initialize the memory manager
    FastDebugMsg("FAILED : Initializing Memory Manager");
    return false;
  }

  FastDebugMsg("Initializing File Manager");
  // Initialize the File Manager
  if (InitializeFileManager('') == false) {
    // We were unable to initialize the file manager
    FastDebugMsg("FAILED : Initializing File Manager");
    return false;
  }

  FastDebugMsg("Initializing Input Manager");
  // Initialize the Input Manager
  if (InitializeInputManager() == false) {
    // We were unable to initialize the input manager
    FastDebugMsg("FAILED : Initializing Input Manager");
    return false;
  }

  FastDebugMsg("Initializing Video Manager");
  // Initialize DirectDraw (DirectX 2)
  if (InitializeVideoManager(hInstance) == false) {
    // We were unable to initialize the video manager
    FastDebugMsg("FAILED : Initializing Video Manager");
    return false;
  }

  // Initialize Video Object Manager
  FastDebugMsg("Initializing Video Object Manager");
  if (!InitializeVideoObjectManager()) {
    FastDebugMsg("FAILED : Initializing Video Object Manager");
    return false;
  }

  // Initialize Video Surface Manager
  FastDebugMsg("Initializing Video Surface Manager");
  if (!InitializeVideoSurfaceManager()) {
    FastDebugMsg("FAILED : Initializing Video Surface Manager");
    return false;
  }

  InitJA2SplashScreen();

  // Make sure we start up our local clock (in milliseconds)
  // We don't need to check for a return value here since so far its always TRUE
  InitializeClockManager(); // must initialize after VideoManager, 'cause it uses ghWindow

  // Create font translation table (store in temp structure)
  pFontTable = CreateEnglishTransTable();

  // Initialize Font Manager
  FastDebugMsg("Initializing the Font Manager");
  // Init the manager and copy the TransTable stuff into it.
  if (!InitializeFontManager(8, pFontTable)) {
    FastDebugMsg("FAILED : Initializing Font Manager");
    return false;
  }

  FastDebugMsg("Initializing Sound Manager");
  // Initialize the Sound Manager (DirectSound)
  if (InitializeSoundManager() == false) {
    // We were unable to initialize the sound manager
    FastDebugMsg("FAILED : Initializing Sound Manager");
    return false;
  }

  FastDebugMsg("Initializing Random");
  // Initialize random number generator
  InitializeRandom(); // no Shutdown

  FastDebugMsg("Initializing Game Manager");
  // Initialize the Game
  if (InitializeGame() == false) {
    // We were unable to initialize the game
    FastDebugMsg("FAILED : Initializing Game Manager");
    return false;
  }

  gfGameInitialized = true;

  return true;
}

function ShutdownStandardGamingPlatform(): void {
  //
  // Shut down the different components of the SGP
  //

  // TEST
  SoundServiceStreams();

  if (gfGameInitialized) {
    ShutdownGame();
  }

  ShutdownButtonSystem();
  MSYS_Shutdown();

  ShutdownSoundManager();

  DestroyEnglishTransTable(); // has to go before ShutdownFontManager()
  ShutdownFontManager();

  ShutdownClockManager(); // must shutdown before VideoManager, 'cause it uses ghWindow

  ShutdownVideoSurfaceManager();
  ShutdownVideoObjectManager();
  ShutdownVideoManager();

  ShutdownInputManager();
  ShutdownFileManager();

  ShutdownMemoryManager(); // must go last (except for Debug), for MemDebugCounter to work right...

  //
  // Make sure we unregister the last remaining debug topic before shutting
  // down the debugging layer
  UnRegisterDebugTopic(TOPIC_SGP, "Standard Gaming Platform");

  ShutdownDebugManager();
}

export function WinMain(hInstance: HTMLElement): number {
  ghInstance = hInstance;

  ShowCursor(false);

  // Inititialize the SGP
  if (InitializeStandardGamingPlatform(hInstance) == false) {
    // We failed to initialize the SGP
    return 0;
  }

// FIXME: Language-specific code
// #ifdef ENGLISH
  SetIntroType(Enum21.INTRO_SPLASH);
// #endif

  gfApplicationActive = true;
  gfProgramIsRunning = true;

  FastDebugMsg("Running Game");

  // At this point the SGP is set up, which means all I/O, Memory, tools, etc... are available. All we need to do is
  // attend to the gaming mechanics themselves
  requestAnimationFrame(render);

  function render() {
    GameLoop();

    gfSGPInputReceived = false;

    requestAnimationFrame(render);
  }

  // This is the normal exit point
  FastDebugMsg("Exiting Game");

  // SGPExit() will be called next through the atexit() mechanism...  This way we correctly process both normal exits and
  // emergency aborts (such as those caused by a failed assertion).

  // return wParam of the last message received
  return 0;
}

}
