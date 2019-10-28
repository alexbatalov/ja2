namespace ja2 {

// Prototype Declarations

let ghInstance: HINSTANCE;

// Global Variable Declarations

// moved from header file: 24mar98:HJH
export let giStartMem: UINT32;
export let gbPixelDepth: UINT8; // GLOBAL RUN-TIME SETTINGS

let guiMouseWheelMsg: UINT32; // For mouse wheel messages

let gfApplicationActive: boolean;
export let gfProgramIsRunning: boolean;
let gfGameInitialized: boolean = false;
export let giStartMem: UINT32;
export let gfDontUseDDBlits: boolean = false;

// There were TWO of them??!?! -- DB
// CHAR8		gzCommandLine[ 100 ];
export let gzCommandLine: string /* CHAR8[100] */; // Command line given

let gzErrorMsg: string /* CHAR8[2048] */ = "";
let gfIgnoreMessages: boolean = false;

// GLOBAL VARIBLE, SET TO DEFAULT BUT CAN BE CHANGED BY THE GAME IF INIT FILE READ
export let gbPixelDepth: UINT8 = PIXEL_DEPTH;

function WindowProcedure(hWindow: HWND, Message: UINT16, wParam: WPARAM, lParam: LPARAM): INT32 {
  /* static */ let fRestore: boolean = false;

  if (gfIgnoreMessages)
    return DefWindowProc(hWindow, Message, wParam, lParam);

  // ATE: This is for older win95 or NT 3.51 to get MOUSE_WHEEL Messages
  if (Message == guiMouseWheelMsg) {
    QueueEvent(MOUSE_WHEEL, wParam, lParam);
    return 0;
  }

  switch (Message) {
    case WM_MOUSEWHEEL: {
      QueueEvent(MOUSE_WHEEL, wParam, lParam);
      break;
    }

    case WM_ACTIVATEAPP:
      switch (wParam) {
        case true: // We are restarting DirectDraw
          if (fRestore == true) {
            RestoreVideoManager();
            RestoreVideoSurfaces(); // Restore any video surfaces

            // unpause the JA2 Global clock
            if (!gfPauseDueToPlayerGamePause) {
              PauseTime(false);
            }
            gfApplicationActive = true;
          }
          break;
        case false: // We are suspending direct draw
                    // pause the JA2 Global clock
          PauseTime(true);
          SuspendVideoManager();
          // suspend movement timer, to prevent timer crash if delay becomes long
          // * it doesn't matter whether the 3-D engine is actually running or not, or if it's even been initialized
          // * restore is automatic, no need to do anything on reactivation

          gfApplicationActive = false;
          fRestore = true;
          break;
      }
      break;

    case WM_CREATE:
      break;

    case WM_DESTROY:
      ShutdownStandardGamingPlatform();
      ShowCursor(true);
      PostQuitMessage(0);
      break;

    case WM_SETFOCUS:
      RestoreCursorClipRect();

      break;

    case WM_KILLFOCUS:
      // Set a flag to restore surfaces once a WM_ACTIVEATEAPP is received
      fRestore = true;
      break;

    case WM_DEVICECHANGE: {
      let pHeader: Pointer<DEV_BROADCAST_HDR> = lParam;

      // if a device has been removed
      if (wParam == DBT_DEVICEREMOVECOMPLETE) {
        // if its  a disk
        if (pHeader.value.dbch_devicetype == DBT_DEVTYP_VOLUME) {
          // check to see if the play cd is still in the cdrom
          if (!CheckIfGameCdromIsInCDromDrive()) {
          }
        }
      }
    } break;

    default:
      return DefWindowProc(hWindow, Message, wParam, lParam);
  }
  return 0;
}

function InitializeStandardGamingPlatform(hInstance: HINSTANCE, sCommandShow: int): boolean {
  let pFontTable: Pointer<FontTranslationTable>;

  // now required by all (even JA2) in order to call ShutdownSGP
  atexit(SGPExit);

  // First, initialize the registry keys.
  InitializeRegistryKeys("Wizardry8", "Wizardry8key");

  // Second, read in settings
  GetRuntimeSettings();

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

  FastDebugMsg("Initializing Mutex Manager");
  // Initialize the Dirty Rectangle Manager
  if (InitializeMutexManager() == false) {
    // We were unable to initialize the game
    FastDebugMsg("FAILED : Initializing Mutex Manager");
    return false;
  }

  FastDebugMsg("Initializing File Manager");
  // Initialize the File Manager
  if (InitializeFileManager(null) == false) {
    // We were unable to initialize the file manager
    FastDebugMsg("FAILED : Initializing File Manager");
    return false;
  }

  FastDebugMsg("Initializing Containers Manager");
  InitializeContainers();

  FastDebugMsg("Initializing Input Manager");
  // Initialize the Input Manager
  if (InitializeInputManager() == false) {
    // We were unable to initialize the input manager
    FastDebugMsg("FAILED : Initializing Input Manager");
    return false;
  }

  FastDebugMsg("Initializing Video Manager");
  // Initialize DirectDraw (DirectX 2)
  if (InitializeVideoManager(hInstance, sCommandShow, WindowProcedure) == false) {
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
  if (pFontTable == null) {
    return false;
  }

  // Initialize Font Manager
  FastDebugMsg("Initializing the Font Manager");
  // Init the manager and copy the TransTable stuff into it.
  if (!InitializeFontManager(8, pFontTable)) {
    FastDebugMsg("FAILED : Initializing Font Manager");
    return false;
  }
  // Don't need this thing anymore, so get rid of it (but don't de-alloc the contents)
  MemFree(pFontTable);

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

  // Register mouse wheel message
  guiMouseWheelMsg = RegisterWindowMessage(MSH_MOUSEWHEEL);

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
  ShutdownContainers();
  ShutdownFileManager();
  ShutdownMutexManager();

  ShutdownMemoryManager(); // must go last (except for Debug), for MemDebugCounter to work right...

  //
  // Make sure we unregister the last remaining debug topic before shutting
  // down the debugging layer
  UnRegisterDebugTopic(TOPIC_SGP, "Standard Gaming Platform");

  ShutdownDebugManager();
}

function WinMain(hInstance: HINSTANCE, hPrevInstance: HINSTANCE, pCommandLine: LPSTR, sCommandShow: int): int {
  let Message: MSG;
  let hPrevInstanceWindow: HWND;

  // Make sure that only one instance of this application is running at once
  // // Look for prev instance by searching for the window
  hPrevInstanceWindow = FindWindowEx(null, null, APPLICATION_NAME, APPLICATION_NAME);

  // One is found, bring it up!
  if (hPrevInstanceWindow != null) {
    SetForegroundWindow(hPrevInstanceWindow);
    ShowWindow(hPrevInstanceWindow, SW_RESTORE);
    return 0;
  }

  ghInstance = hInstance;

  // Copy commandline!
  strncpy(gzCommandLine, pCommandLine, 100);
  gzCommandLine[99] = '\0';

  // Process the command line BEFORE initialization
  ProcessJa2CommandLineBeforeInitialization(pCommandLine);

  // Mem Usage
  giStartMem = MemGetFree() / 1024;

  // Handle Check for CD
  if (!HandleJA2CDCheck()) {
    return 0;
  }

  ShowCursor(false);

  // Inititialize the SGP
  if (InitializeStandardGamingPlatform(hInstance, sCommandShow) == false) {
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
  while (gfProgramIsRunning) {
    if (PeekMessage(addressof(Message), null, 0, 0, PM_NOREMOVE)) {
      // We have a message on the WIN95 queue, let's get it
      if (!GetMessage(addressof(Message), null, 0, 0)) {
        // It's quitting time
        return Message.wParam;
      }
      // Ok, now that we have the message, let's handle it
      TranslateMessage(addressof(Message));
      DispatchMessage(addressof(Message));
    } else {
      // Windows hasn't processed any messages, therefore we handle the rest
      if (gfApplicationActive == false) {
        // Well we got nothing to do but to wait for a message to activate
        WaitMessage();
      } else {
        // Well, the game is active, so we handle the game stuff
        GameLoop();

        // After this frame, reset input given flag
        gfSGPInputReceived = false;
      }
    }
  }

  // This is the normal exit point
  FastDebugMsg("Exiting Game");
  PostQuitMessage(0);

  // SGPExit() will be called next through the atexit() mechanism...  This way we correctly process both normal exits and
  // emergency aborts (such as those caused by a failed assertion).

  // return wParam of the last message received
  return Message.wParam;
}

function SGPExit(): void {
  /* static */ let fAlreadyExiting: boolean = false;
  let fUnloadScreens: boolean = true;

  // helps prevent heap crashes when multiple assertions occur and call us
  if (fAlreadyExiting) {
    return;
  }

  fAlreadyExiting = true;
  gfProgramIsRunning = false;

  ShutdownStandardGamingPlatform();
  ShowCursor(true);
  if (strlen(gzErrorMsg)) {
    MessageBox(null, gzErrorMsg, "Error", MB_OK | MB_ICONERROR);
  }
}

function GetRuntimeSettings(): void {
  // Runtime settings - for now use INI file - later use registry
  let ExeDir: string /* STRING512 */;
  let INIFile: string /* STRING512 */;

  // Get Executable Directory
  GetExecutableDirectory(ExeDir);
  // Adjust Current Dir
  sprintf(INIFile, "%s\\sgp.ini", ExeDir);

  gbPixelDepth = GetPrivateProfileInt("SGP", "PIXEL_DEPTH", PIXEL_DEPTH, INIFile);
}

export function ShutdownWithErrorBox(pcMessage: string /* Pointer<CHAR8> */): void {
  strncpy(gzErrorMsg, pcMessage, 255);
  gzErrorMsg[255] = '\0';
  gfIgnoreMessages = true;

  exit(0);
}

function ProcessJa2CommandLineBeforeInitialization(pCommandLine: string /* Pointer<CHAR8> */): void {
  let cSeparators: string /* CHAR8[] */ = "\t =";
  let pCopy: string /* Pointer<CHAR8> */ = null;
  let pToken: string /* Pointer<CHAR8> */;

  pCopy = MemAlloc(strlen(pCommandLine) + 1);

  Assert(pCopy);
  if (!pCopy)
    return;

  memcpy(pCopy, pCommandLine, strlen(pCommandLine) + 1);

  pToken = strtok(pCopy, cSeparators);
  while (pToken) {
    // if its the NO SOUND option
    if (!_strnicmp(pToken, "/NOSOUND", 8)) {
      // disable the sound
      SoundEnableSound(false);
    }

    // get the next token
    pToken = strtok(null, cSeparators);
  }

  MemFree(pCopy);
}

}
