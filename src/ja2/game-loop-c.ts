namespace ja2 {

export let guiCurrentScreen: UINT32;
export let guiPendingScreen: UINT32 = NO_PENDING_SCREEN;
let guiPreviousScreen: UINT32 = NO_PENDING_SCREEN;

export let giStartingMemValue: INT32 = 0;

const DONT_CHECK_FOR_FREE_SPACE = 255;
let gubCheckForFreeSpaceOnHardDriveCount: UINT8 = DONT_CHECK_FOR_FREE_SPACE;

// The InitializeGame function is responsible for setting up all data and Gaming Engine
// tasks which will run the game

export function InitializeGame(): boolean {
  let uiIndex: UINT32;

  ClearAllDebugTopics();
  RegisterJA2DebugTopic(TOPIC_JA2OPPLIST, "Reg");
  // RegisterJA2DebugTopic( TOPIC_MEMORY_MANAGER, "Reg" );

  // Initlaize mouse subsystems
  MSYS_Init();
  InitButtonSystem();
  InitCursors();

  // Init Fonts
  if (!InitializeFonts()) {
    // Send debug message and quit
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "COULD NOT INUT FONT SYSTEM...");
    return false;
  }

  // Deletes all the Temp files in the Maps\Temp directory
  InitTacticalSave(true);

  // Initialize Game Screens.
  for (uiIndex = 0; uiIndex < Enum26.MAX_SCREENS; uiIndex++) {
    if (GameScreens[uiIndex].InitializeScreen() == false) {
      // Failed to initialize one of the screens.
      return false;
    }
  }

  // Init the help screen system
  InitHelpScreenSystem();

  // Loads the saved (if any) general JA2 game settings
  LoadGameSettings();

  // Initialize the Game options ( Gun nut, scifi and dif. levels
  InitGameOptions();

  // preload mapscreen graphics
  HandlePreloadOfMapGraphics();

  guiCurrentScreen = Enum26.INIT_SCREEN;

  return true;
}

// The ShutdownGame function will free up/undo all things that were started in InitializeGame()
// It will also be responsible to making sure that all Gaming Engine tasks exit properly

export function ShutdownGame(): void {
  // handle shutdown of game with respect to preloaded mapscreen graphics
  HandleRemovalOfPreLoadedMapGraphics();

  ShutdownJA2();

  // Save the general save game settings to disk
  SaveGameSettings();

  // shutdown the file database manager
  ShutDownFileDatabase();

  // Deletes all the Temp files in the Maps\Temp directory
  InitTacticalSave(false);
}

// This is the main Gameloop. This should eventually by one big switch statement which represents
// the state of the game (i.e. Main Menu, PC Generation, Combat loop, etc....)
// This function exits constantly and reenters constantly

export function GameLoop(): void {
  let InputEvent: InputAtom = createInputAtom();
  let MousePos: POINT = createPoint();
  let uiOldScreen: UINT32 = guiCurrentScreen;

  GetCursorPos(MousePos);
  // Hook into mouse stuff for MOVEMENT MESSAGES
  MouseSystemHook(MOUSE_POS, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
  MusicPoll(false);

  while (DequeueSpecificEvent(InputEvent, LEFT_BUTTON_REPEAT | RIGHT_BUTTON_REPEAT | LEFT_BUTTON_DOWN | LEFT_BUTTON_UP | RIGHT_BUTTON_DOWN | RIGHT_BUTTON_UP) == true) {
    // HOOK INTO MOUSE HOOKS
    switch (InputEvent.usEvent) {
      case LEFT_BUTTON_DOWN:
        MouseSystemHook(LEFT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case LEFT_BUTTON_UP:
        MouseSystemHook(LEFT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case RIGHT_BUTTON_DOWN:
        MouseSystemHook(RIGHT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case RIGHT_BUTTON_UP:
        MouseSystemHook(RIGHT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case LEFT_BUTTON_REPEAT:
        MouseSystemHook(LEFT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case RIGHT_BUTTON_REPEAT:
        MouseSystemHook(RIGHT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
    }
  }

  if (gfGlobalError) {
    guiCurrentScreen = Enum26.ERROR_SCREEN;
  }

  // ATE: Force to be in message box screen!
  if (gfInMsgBox) {
    guiPendingScreen = Enum26.MSG_BOX_SCREEN;
  }

  if (guiPendingScreen != NO_PENDING_SCREEN) {
    // Based on active screen, deinit!
    if (guiPendingScreen != guiCurrentScreen) {
      switch (guiCurrentScreen) {
        case Enum26.MAP_SCREEN:
          if (guiPendingScreen != Enum26.MSG_BOX_SCREEN) {
            EndMapScreen(false);
          }
          break;
        case Enum26.LAPTOP_SCREEN:
          ExitLaptop();
          break;
      }
    }

    // if the screen has chnaged
    if (uiOldScreen != guiPendingScreen) {
      // Set the fact that the screen has changed
      uiOldScreen = guiPendingScreen;

      HandleNewScreenChange(guiPendingScreen, guiCurrentScreen);
    }
    guiCurrentScreen = guiPendingScreen;
    guiPendingScreen = NO_PENDING_SCREEN;
  }

  uiOldScreen = GameScreens[guiCurrentScreen].HandleScreen();

  // if the screen has chnaged
  if (uiOldScreen != guiCurrentScreen) {
    HandleNewScreenChange(uiOldScreen, guiCurrentScreen);
    guiCurrentScreen = uiOldScreen;
  }

  RefreshScreen();

  guiGameCycleCounter++;

  UpdateClock();
}

function SetCurrentScreen(uiNewScreen: UINT32): void {
  guiCurrentScreen = uiNewScreen;
  GameScreens[guiCurrentScreen].HandleScreen();
}

export function SetPendingNewScreen(uiNewScreen: UINT32): void {
  guiPendingScreen = uiNewScreen;
}

// Gets called when the screen changes, place any needed in code in here
function HandleNewScreenChange(uiNewScreen: UINT32, uiOldScreen: UINT32): void {
  // if we are not going into the message box screen, and we didnt just come from it
  if ((uiNewScreen != Enum26.MSG_BOX_SCREEN && uiOldScreen != Enum26.MSG_BOX_SCREEN)) {
    // reset the help screen
    NewScreenSoResetHelpScreen();
  }
}

export function HandleShortCutExitState(): void {
  // look at the state of fGameIsRunning, if set false, then prompt user for confirmation

  // use YES/NO Pop up box, settup for particular screen
  let pCenteringRect: SGPRect = createSGPRectFrom(0, 0, 640, INV_INTERFACE_START_Y);

  if (guiCurrentScreen == Enum26.ERROR_SCREEN) {
    // an assert failure, don't bring up the box!
    gfProgramIsRunning = false;
    return;
  }

  if (guiCurrentScreen == Enum26.AUTORESOLVE_SCREEN) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMessageStrings[Enum333.MSG_EXITGAME], guiCurrentScreen, (MSG_BOX_FLAG_YESNO | MSG_BOX_FLAG_USE_CENTERING_RECT), EndGameMessageBoxCallBack, pCenteringRect);
    return;
  }

  /// which screen are we in?
  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    // set up for mapscreen
    DoMapMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMessageStrings[Enum333.MSG_EXITGAME], Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, EndGameMessageBoxCallBack);
  } else if (guiCurrentScreen == Enum26.LAPTOP_SCREEN) {
    // set up for laptop
    DoLapTopSystemMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, pMessageStrings[Enum333.MSG_EXITGAME], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_YESNO, EndGameMessageBoxCallBack);
  } else if (guiCurrentScreen == Enum26.SHOPKEEPER_SCREEN) {
    DoSkiMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMessageStrings[Enum333.MSG_EXITGAME], Enum26.SHOPKEEPER_SCREEN, MSG_BOX_FLAG_YESNO, EndGameMessageBoxCallBack);
  } else {
    // check if error or editor

    if ((guiCurrentScreen == Enum26.ERROR_SCREEN) || (guiCurrentScreen == Enum26.EDIT_SCREEN) || (guiCurrentScreen == Enum26.DEBUG_SCREEN)) {
      // then don't prompt
      gfProgramIsRunning = false;
      return;
    }

    // set up for all otherscreens
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, pMessageStrings[Enum333.MSG_EXITGAME], guiCurrentScreen, (MSG_BOX_FLAG_YESNO | MSG_BOX_FLAG_USE_CENTERING_RECT), EndGameMessageBoxCallBack, pCenteringRect);
  }
}

export function EndGameMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, so start over, else stay here and do nothing for now
  if (bExitValue == MSG_BOX_RETURN_YES) {
    gfProgramIsRunning = false;
  }

  // If we are in the tactical placement gui, we need this flag set so the interface is updated.
  if (gfTacticalPlacementGUIActive) {
    gfTacticalPlacementGUIDirty = true;
    gfValidLocationsChanged = 1;
  }

  return;
}

export function NextLoopCheckForEnoughFreeHardDriveSpace(): void {
  gubCheckForFreeSpaceOnHardDriveCount = 0;
}

}
