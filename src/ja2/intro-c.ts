namespace ja2 {

const enum Enum19 {
  INTRO_TXT__CANT_FIND_INTRO,
}

// ddd

// ggg
let gfIntroScreenEntry: boolean;
let gfIntroScreenExit: boolean;

let guiIntroExitScreen: UINT32 = Enum26.INTRO_SCREEN;

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

let gpzSmackerFileNames: string[] /* Pointer<CHAR>[] */ = [
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
];

// enums used for when the intro screen can come up, either begining game intro, or end game cinematic
let gbIntroScreenMode: INT8 = -1;

// ppp

export function IntroScreenInit(): boolean {
  // Set so next time we come in, we can set up
  gfIntroScreenEntry = true;

  return true;
}

export function IntroScreenShutdown(): boolean {
  return true;
}

export function IntroScreenHandle(): UINT32 {
  if (gfIntroScreenEntry) {
    EnterIntroScreen();
    gfIntroScreenEntry = false;
    gfIntroScreenExit = false;

    InvalidateRegion(0, 0, 640, 480);
  }

  RestoreBackgroundRects();

  GetIntroScreenUserInput();

  HandleIntroScreen();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  if (gfIntroScreenExit) {
    ExitIntroScreen();
    gfIntroScreenExit = false;
    gfIntroScreenEntry = true;
  }

  return guiIntroExitScreen;
}

function EnterIntroScreen(): boolean {
  let iFirstVideoID: INT32 = -1;

  ClearMainMenu();

  SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);

  // Don't play music....
  SetMusicMode(Enum328.MUSIC_NONE);

  // if the library doesnt exist, exit
  if (!IsLibraryOpened(Enum30.LIBRARY_INTRO)) {
    PrepareToExitIntroScreen();
    return true;
  }

  PrepareToExitIntroScreen();

  return true;
}

function RenderIntroScreen(): void {
}

function ExitIntroScreen(): void {
}

function HandleIntroScreen(): void {
  let fFlicStillPlaying: boolean = false;

  // if we are exiting this screen, this frame, dont update the screen
  if (gfIntroScreenExit)
    return;

  // handle smaker each frame
  fFlicStillPlaying = false;

  PrepareToExitIntroScreen();
  giCurrentIntroBeingPlayed = -1;


  InvalidateScreen();
}

function GetIntroScreenUserInput(): void {
  let Event: InputAtom = createInputAtom();
  let MousePos: POINT = createPoint();

  GetCursorPos(MousePos);

  while (DequeueEvent(Event)) {
    // HOOK INTO MOUSE HOOKS
    switch (Event.usEvent) {
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
      case RIGHT_BUTTON_REPEAT:
        MouseSystemHook(RIGHT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case LEFT_BUTTON_REPEAT:
        MouseSystemHook(LEFT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
    }

    if (Event.usEvent == KEY_UP) {
      switch (Event.usParam) {
        case ESC:
          PrepareToExitIntroScreen();
          break;
        case SPACE:
          break;
      }
    }
  }

  // if the user presses either mouse button
  if (gfLeftButtonState || gfRightButtonState) {
    // advance to the next flic
  }
}

function PrepareToExitIntroScreen(): void {
  // if its the intro at the begining of the game
  if (gbIntroScreenMode == Enum21.INTRO_BEGINING) {
    // go to the init screen
    guiIntroExitScreen = Enum26.INIT_SCREEN;
  } else if (gbIntroScreenMode == Enum21.INTRO_SPLASH) {
    // display a logo when exiting
    DisplaySirtechSplashScreen();

    gfDoneWithSplashScreen = true;
    guiIntroExitScreen = Enum26.INIT_SCREEN;
  } else {
    // We want to reinitialize the game
    ReStartingGame();

    //		guiIntroExitScreen = MAINMENU_SCREEN;
    guiIntroExitScreen = Enum26.CREDIT_SCREEN;
  }

  gfIntroScreenExit = true;
}

function GetNextIntroVideo(uiCurrentVideo: UINT32): INT32 {
  let iStringToUse: INT32 = -1;

  // switch on whether it is the beginging or the end game video
  switch (gbIntroScreenMode) {
    // the video at the begining of the game
    case Enum21.INTRO_BEGINING: {
      switch (uiCurrentVideo) {
        case SMKINTRO_FIRST_VIDEO:
          iStringToUse = Enum20.SMKINTRO_REBEL_CRDT;
          break;
        case Enum20.SMKINTRO_REBEL_CRDT:
          iStringToUse = Enum20.SMKINTRO_OMERTA;
          break;
        case Enum20.SMKINTRO_OMERTA:
          iStringToUse = Enum20.SMKINTRO_PRAGUE_CRDT;
          break;
        case Enum20.SMKINTRO_PRAGUE_CRDT:
          iStringToUse = Enum20.SMKINTRO_PRAGUE;
          break;
        case Enum20.SMKINTRO_PRAGUE:
          iStringToUse = -1;
          break;
          //				case SMKINTRO_LAST_INTRO:
          //					iStringToUse = -1;
          //					break;
      }
    } break;

    // end game
    case Enum21.INTRO_ENDING: {
      switch (uiCurrentVideo) {
        case SMKINTRO_FIRST_VIDEO:
          // if Miguel is dead, play the flic with out him in it
          if (gMercProfiles[Enum268.MIGUEL].bMercStatus == MERC_IS_DEAD)
            iStringToUse = Enum20.SMKINTRO_END_END_SPEECH_NO_MIGUEL;
          else
            iStringToUse = Enum20.SMKINTRO_END_END_SPEECH_MIGUEL;
          break;

        case Enum20.SMKINTRO_END_END_SPEECH_MIGUEL:
        case Enum20.SMKINTRO_END_END_SPEECH_NO_MIGUEL:
          iStringToUse = Enum20.SMKINTRO_END_HELI_FLYBY;
          break;

        // if SkyRider is dead, play the flic without him
        case Enum20.SMKINTRO_END_HELI_FLYBY:
          if (gMercProfiles[Enum268.SKYRIDER].bMercStatus == MERC_IS_DEAD)
            iStringToUse = Enum20.SMKINTRO_END_NOSKYRIDER_HELICOPTER;
          else
            iStringToUse = Enum20.SMKINTRO_END_SKYRIDER_HELICOPTER;
          break;
      }
    } break;

    case Enum21.INTRO_SPLASH:
      switch (uiCurrentVideo) {
        case SMKINTRO_FIRST_VIDEO:
          iStringToUse = Enum20.SMKINTRO_SPLASH_SCREEN;
          break;
        case Enum20.SMKINTRO_SPLASH_SCREEN:
          // iStringToUse = SMKINTRO_SPLASH_TALONSOFT;
          break;
      }
      break;
  }

  return iStringToUse;
}

export function SetIntroType(bIntroType: INT8): void {
  if (bIntroType == Enum21.INTRO_BEGINING) {
    gbIntroScreenMode = Enum21.INTRO_BEGINING;
  } else if (bIntroType == Enum21.INTRO_ENDING) {
    gbIntroScreenMode = Enum21.INTRO_ENDING;
  } else if (bIntroType == Enum21.INTRO_SPLASH) {
    gbIntroScreenMode = Enum21.INTRO_SPLASH;
  }
}

function DisplaySirtechSplashScreen(): void {
  let hPixHandle: SGPVObject;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let uiLogoID: UINT32;

  let uiDestPitchBYTES: UINT32 = 0;
  let pDestBuf: Uint8ClampedArray;

  // JA3Gold: do nothing until we have a graphic to replace Talonsoft's
  // return;

  // CLEAR THE FRAME BUFFER
  pDestBuf = LockVideoSurface(FRAME_BUFFER, createPointer(() => uiDestPitchBYTES, (v) => uiDestPitchBYTES = v));
  pDestBuf.fill(0);
  UnLockVideoSurface(FRAME_BUFFER);

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\SirtechSplash.sti");

  //	FilenameForBPP("INTERFACE\\TShold.sti", VObjectDesc.ImageFile);
  if (!(uiLogoID = AddVideoObject(VObjectDesc))) {
    AssertMsg(0, FormatString("Failed to load %s", VObjectDesc.ImageFile));
    return;
  }

  hPixHandle = GetVideoObject(uiLogoID);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
  DeleteVideoObjectFromIndex(uiLogoID);

  InvalidateScreen();
  RefreshScreen();
}

}
