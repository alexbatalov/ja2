const enum Enum19 {
  INTRO_TXT__CANT_FIND_INTRO,
}

// ddd

// ggg
let gfIntroScreenEntry: BOOLEAN;
let gfIntroScreenExit: BOOLEAN;

let guiIntroExitScreen: UINT32 = INTRO_SCREEN;

let gpSmackFlic: Pointer<SMKFLIC> = NULL;

const SMKINTRO_FIRST_VIDEO = 255;
const SMKINTRO_NO_VIDEO = -1;

// enums for the various smacker files
const enum Enum20 {
  SMKINTRO_REBEL_CRDT,
  SMKINTRO_OMERTA,
  SMKINTRO_PRAGUE_CRDT,
  SMKINTRO_PRAGUE,

  // there are no more videos shown for the begining

  SMKINTRO_END_END_SPEECH_MIGUEL,
  SMKINTRO_END_END_SPEECH_NO_MIGUEL,
  SMKINTRO_END_HELI_FLYBY,
  SMKINTRO_END_SKYRIDER_HELICOPTER,
  SMKINTRO_END_NOSKYRIDER_HELICOPTER,

  SMKINTRO_SPLASH_SCREEN,
  SMKINTRO_SPLASH_TALONSOFT,

  // there are no more videos shown for the endgame
  SMKINTRO_LAST_END_GAME,
}

let giCurrentIntroBeingPlayed: INT32 = SMKINTRO_NO_VIDEO;

let gpzSmackerFileNames: Pointer<CHAR>[] /* [] */ = {
  // begining of the game
  "INTRO\\Rebel_cr.smk",
  "INTRO\\Omerta.smk",
  "INTRO\\Prague_cr.smk",
  "INTRO\\Prague.smk",

  // endgame
  "INTRO\\Throne_Mig.smk",
  "INTRO\\Throne_NoMig.smk",
  "INTRO\\Heli_FlyBy.smk",
  "INTRO\\Heli_Sky.smk",
  "INTRO\\Heli_NoSky.smk",

  "INTRO\\SplashScreen.smk",
  "INTRO\\TalonSoftid_endhold.smk",
};

// enums used for when the intro screen can come up, either begining game intro, or end game cinematic
let gbIntroScreenMode: INT8 = -1;

// ppp

function IntroScreenInit(): UINT32 {
  // Set so next time we come in, we can set up
  gfIntroScreenEntry = TRUE;

  return 1;
}

function IntroScreenShutdown(): UINT32 {
  return 1;
}

function IntroScreenHandle(): UINT32 {
  if (gfIntroScreenEntry) {
    EnterIntroScreen();
    gfIntroScreenEntry = FALSE;
    gfIntroScreenExit = FALSE;

    InvalidateRegion(0, 0, 640, 480);
  }

  RestoreBackgroundRects();

  GetIntroScreenUserInput();

  HandleIntroScreen();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  if (gfIntroScreenExit) {
    ExitIntroScreen();
    gfIntroScreenExit = FALSE;
    gfIntroScreenEntry = TRUE;
  }

  return guiIntroExitScreen;
}

function EnterIntroScreen(): BOOLEAN {
  let iFirstVideoID: INT32 = -1;

  ClearMainMenu();

  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  // Don't play music....
  SetMusicMode(MUSIC_NONE);

  // if the library doesnt exist, exit
  if (!IsLibraryOpened(LIBRARY_INTRO)) {
    PrepareToExitIntroScreen();
    return TRUE;
  }

  // initialize smacker
  SmkInitialize(ghWindow, 640, 480);

  // get the index opf the first video to watch
  iFirstVideoID = GetNextIntroVideo(SMKINTRO_FIRST_VIDEO);

  if (iFirstVideoID != -1) {
    StartPlayingIntroFlic(iFirstVideoID);

    guiIntroExitScreen = INTRO_SCREEN;
  }

  // Got no intro video, exit
  else {
    PrepareToExitIntroScreen();
  }

  return TRUE;
}

function RenderIntroScreen(): void {
}

function ExitIntroScreen(): void {
  // shutdown smaker
  SmkShutdown();
}

function HandleIntroScreen(): void {
  let fFlicStillPlaying: BOOLEAN = FALSE;

  // if we are exiting this screen, this frame, dont update the screen
  if (gfIntroScreenExit)
    return;

  // handle smaker each frame
  fFlicStillPlaying = SmkPollFlics();

  // if the flic is not playing
  if (!fFlicStillPlaying) {
    let iNextVideoToPlay: INT32 = -1;

    iNextVideoToPlay = GetNextIntroVideo(giCurrentIntroBeingPlayed);

    if (iNextVideoToPlay != -1) {
      StartPlayingIntroFlic(iNextVideoToPlay);
    } else {
      PrepareToExitIntroScreen();
      giCurrentIntroBeingPlayed = -1;
    }
  }

  InvalidateScreen();
}

function GetIntroScreenUserInput(): void {
  let Event: InputAtom;
  let MousePos: POINT;

  GetCursorPos(&MousePos);

  while (DequeueEvent(&Event)) {
    // HOOK INTO MOUSE HOOKS
    switch (Event.usEvent) {
      case LEFT_BUTTON_DOWN:
        MouseSystemHook(LEFT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown, _RightButtonDown);
        break;
      case LEFT_BUTTON_UP:
        MouseSystemHook(LEFT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown, _RightButtonDown);
        break;
      case RIGHT_BUTTON_DOWN:
        MouseSystemHook(RIGHT_BUTTON_DOWN, MousePos.x, MousePos.y, _LeftButtonDown, _RightButtonDown);
        break;
      case RIGHT_BUTTON_UP:
        MouseSystemHook(RIGHT_BUTTON_UP, MousePos.x, MousePos.y, _LeftButtonDown, _RightButtonDown);
        break;
      case RIGHT_BUTTON_REPEAT:
        MouseSystemHook(RIGHT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown, _RightButtonDown);
        break;
      case LEFT_BUTTON_REPEAT:
        MouseSystemHook(LEFT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown, _RightButtonDown);
        break;
    }

    if (Event.usEvent == KEY_UP) {
      switch (Event.usParam) {
        case ESC:
          PrepareToExitIntroScreen();
          break;
        case SPACE:
          SmkCloseFlic(gpSmackFlic);
          break;
      }
    }
  }

  // if the user presses either mouse button
  if (gfLeftButtonState || gfRightButtonState) {
    // advance to the next flic
    SmkCloseFlic(gpSmackFlic);
  }
}

function PrepareToExitIntroScreen(): void {
  // if its the intro at the begining of the game
  if (gbIntroScreenMode == INTRO_BEGINING) {
    // go to the init screen
    guiIntroExitScreen = INIT_SCREEN;
  } else if (gbIntroScreenMode == INTRO_SPLASH) {
    // display a logo when exiting
    DisplaySirtechSplashScreen();

    gfDoneWithSplashScreen = TRUE;
    guiIntroExitScreen = INIT_SCREEN;
  } else {
    // We want to reinitialize the game
    ReStartingGame();

    //		guiIntroExitScreen = MAINMENU_SCREEN;
    guiIntroExitScreen = CREDIT_SCREEN;
  }

  gfIntroScreenExit = TRUE;
}

function GetNextIntroVideo(uiCurrentVideo: UINT32): INT32 {
  let iStringToUse: INT32 = -1;

  // switch on whether it is the beginging or the end game video
  switch (gbIntroScreenMode) {
    // the video at the begining of the game
    case INTRO_BEGINING: {
      switch (uiCurrentVideo) {
        case SMKINTRO_FIRST_VIDEO:
          iStringToUse = SMKINTRO_REBEL_CRDT;
          break;
        case SMKINTRO_REBEL_CRDT:
          iStringToUse = SMKINTRO_OMERTA;
          break;
        case SMKINTRO_OMERTA:
          iStringToUse = SMKINTRO_PRAGUE_CRDT;
          break;
        case SMKINTRO_PRAGUE_CRDT:
          iStringToUse = SMKINTRO_PRAGUE;
          break;
        case SMKINTRO_PRAGUE:
          iStringToUse = -1;
          break;
          //				case SMKINTRO_LAST_INTRO:
          //					iStringToUse = -1;
          //					break;
      }
    } break;

    // end game
    case INTRO_ENDING: {
      switch (uiCurrentVideo) {
        case SMKINTRO_FIRST_VIDEO:
          // if Miguel is dead, play the flic with out him in it
          if (gMercProfiles[MIGUEL].bMercStatus == MERC_IS_DEAD)
            iStringToUse = SMKINTRO_END_END_SPEECH_NO_MIGUEL;
          else
            iStringToUse = SMKINTRO_END_END_SPEECH_MIGUEL;
          break;

        case SMKINTRO_END_END_SPEECH_MIGUEL:
        case SMKINTRO_END_END_SPEECH_NO_MIGUEL:
          iStringToUse = SMKINTRO_END_HELI_FLYBY;
          break;

        // if SkyRider is dead, play the flic without him
        case SMKINTRO_END_HELI_FLYBY:
          if (gMercProfiles[SKYRIDER].bMercStatus == MERC_IS_DEAD)
            iStringToUse = SMKINTRO_END_NOSKYRIDER_HELICOPTER;
          else
            iStringToUse = SMKINTRO_END_SKYRIDER_HELICOPTER;
          break;
      }
    } break;

    case INTRO_SPLASH:
      switch (uiCurrentVideo) {
        case SMKINTRO_FIRST_VIDEO:
          iStringToUse = SMKINTRO_SPLASH_SCREEN;
          break;
        case SMKINTRO_SPLASH_SCREEN:
          // iStringToUse = SMKINTRO_SPLASH_TALONSOFT;
          break;
      }
      break;
  }

  return iStringToUse;
}

function StartPlayingIntroFlic(iIndexOfFlicToPlay: INT32): void {
  if (iIndexOfFlicToPlay != -1) {
    // start playing a flic
    gpSmackFlic = SmkPlayFlic(gpzSmackerFileNames[iIndexOfFlicToPlay], 0, 0, TRUE);

    if (gpSmackFlic != NULL) {
      giCurrentIntroBeingPlayed = iIndexOfFlicToPlay;
    } else {
      // do a check

      DoScreenIndependantMessageBox(gzIntroScreen[INTRO_TXT__CANT_FIND_INTRO], MSG_BOX_FLAG_OK, CDromEjectionErrorMessageBoxCallBack);
    }
  }
}

function SetIntroType(bIntroType: INT8): void {
  if (bIntroType == INTRO_BEGINING) {
    gbIntroScreenMode = INTRO_BEGINING;
  } else if (bIntroType == INTRO_ENDING) {
    gbIntroScreenMode = INTRO_ENDING;
  } else if (bIntroType == INTRO_SPLASH) {
    gbIntroScreenMode = INTRO_SPLASH;
  }
}

function DisplaySirtechSplashScreen(): void {
  let hPixHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC;
  let uiLogoID: UINT32;

  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;

  // JA3Gold: do nothing until we have a graphic to replace Talonsoft's
  // return;

  // CLEAR THE FRAME BUFFER
  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);
  memset(pDestBuf, 0, SCREEN_HEIGHT * uiDestPitchBYTES);
  UnLockVideoSurface(FRAME_BUFFER);

  memset(&VObjectDesc, 0, sizeof(VOBJECT_DESC));
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\SirtechSplash.sti", VObjectDesc.ImageFile);

  //	FilenameForBPP("INTERFACE\\TShold.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(&VObjectDesc, &uiLogoID)) {
    AssertMsg(0, String("Failed to load %s", VObjectDesc.ImageFile));
    return;
  }

  GetVideoObject(&hPixHandle, uiLogoID);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, NULL);
  DeleteVideoObjectFromIndex(uiLogoID);

  InvalidateScreen();
  RefreshScreen(NULL);
}
