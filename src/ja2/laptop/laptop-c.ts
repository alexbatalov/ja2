namespace ja2 {

// icons text id's
const enum Enum91 {
  MAIL = 0,
  WWW,
  FINANCIAL,
  PERSONNEL,
  HISTORY,
  FILES,
  MAX_ICON_COUNT,
}

const enum Enum92 {
  NO_REGION = 0,
  EMAIL_REGION,
  WWW_REGION,
  FINANCIAL_REGION,
  PERSONNEL_REGION,
  HISTORY_REGION,
  FILES_REGION,
}

interface RGBCOLOR {
  ubRed: UINT8;
  ubGreen: UINT8;
  ubBlue: UINT8;
}

function createRGBColorFrom(ubRed: UINT8, ubGreen: UINT8, ubBlue: UINT8): RGBCOLOR {
  return {
    ubRed,
    ubGreen,
    ubBlue,
  };
}

let GlowColors: RGBCOLOR[] /* [] */ = [
  createRGBColorFrom(0, 0, 0),
  createRGBColorFrom(25, 0, 0),
  createRGBColorFrom(50, 0, 0),
  createRGBColorFrom(75, 0, 0),
  createRGBColorFrom(100, 0, 0),
  createRGBColorFrom(125, 0, 0),
  createRGBColorFrom(150, 0, 0),
  createRGBColorFrom(175, 0, 0),
  createRGBColorFrom(200, 0, 0),
  createRGBColorFrom(225, 0, 0),
  createRGBColorFrom(250, 0, 0),
];

// laptop programs
const enum Enum93 {
  LAPTOP_PROGRAM_MAILER,
  LAPTOP_PROGRAM_WEB_BROWSER,
  LAPTOP_PROGRAM_FILES,
  LAPTOP_PROGRAM_PERSONNEL,
  LAPTOP_PROGRAM_FINANCES,
  LAPTOP_PROGRAM_HISTORY,
}

// laptop program states
const enum Enum94 {
  LAPTOP_PROGRAM_MINIMIZED,
  LAPTOP_PROGRAM_OPEN,
}
const LAPTOP_ICONS_X = 33;
const LAPTOP_ICONS_MAIL_Y = 35 - 5;
const LAPTOP_ICONS_WWW_Y = 102 - 10 - 5;
const LAPTOP_ICONS_FINANCIAL_Y = 172 - 10 - 5;
const LAPTOP_ICONS_PERSONNEL_Y = 263 - 20 - 5;
const LAPTOP_ICONS_HISTORY_Y = 310 - 5;
const LAPTOP_ICONS_FILES_Y = 365 - 5 - 5;
const LAPTOP_ICON_TEXT_X = 24;
const LAPTOP_ICON_TEXT_WIDTH = 103 - 24;
const LAPTOP_ICON_TEXT_HEIGHT = 6;
const LAPTOP_ICON_TEXT_MAIL_Y = 82 - 5;
const LAPTOP_ICON_TEXT_WWW_Y = 153 + 4 - 10 - 5;
const LAPTOP_ICON_TEXT_FINANCIAL_Y = 229 - 10 - 5;
const LAPTOP_ICON_TEXT_PERSONNEL_Y = 291 + 5 + 5 - 5;
const LAPTOP_ICON_TEXT_HISTORY_Y = 346 + 10 + 5 - 5;
const LAPTOP_ICON_TEXT_FILES_Y = 412 + 5 + 3 - 5;
const LAPTOPICONFONT = () => FONT10ARIAL();
const BOOK_FONT = () => FONT10ARIAL();
const DOWNLOAD_FONT = () => FONT12ARIAL();
const ERROR_TITLE_FONT = () => FONT14ARIAL();
const ERROR_FONT = () => FONT12ARIAL();

const HISTORY_ICON_OFFSET_X = 0;
const FILES_ICON_OFFSET_X = 3;
const FINANCIAL_ICON_OFFSET_X = 0;
const LAPTOP_ICON_WIDTH = 80;
const MAX_BUTTON_COUNT = 1;
const ON_BUTTON = 0;
const GLOW_DELAY = 70;
const WWW_COUNT = 6;
const ICON_INTERVAL = 150;
const BOOK_X = 111;
const BOOK_TOP_Y = 79;
const BOOK_HEIGHT = 12;
const DOWN_HEIGHT = 19;
const BOOK_WIDTH = 100;
const SCROLL_MIN = -100;
const SCROLL_DIFFERENCE = 10;

const LONG_UNIT_TIME = 120;
const UNIT_TIME = 40;
const LOAD_TIME = UNIT_TIME * 30;
const FAST_UNIT_TIME = 3;
const FASTEST_UNIT_TIME = 2;
const ALMOST_FAST_UNIT_TIME = 25;
const ALMOST_FAST_LOAD_TIME = ALMOST_FAST_UNIT_TIME * 30;
const FAST_LOAD_TIME = FAST_UNIT_TIME * 30;
const LONG_LOAD_TIME = LONG_UNIT_TIME * 30;
const FASTEST_LOAD_TIME = FASTEST_UNIT_TIME * 30;
const DOWNLOAD_X = 300;
const DOWNLOAD_Y = 200;
const LAPTOP_WINDOW_X = DOWNLOAD_X + 12;
const LAPTOP_WINDOW_Y = DOWNLOAD_Y + 25;
const LAPTOP_BAR_Y = LAPTOP_WINDOW_Y + 2;
const LAPTOP_BAR_X = LAPTOP_WINDOW_X + 1;
const UNIT_WIDTH = 4;
const LAPTOP_WINDOW_WIDTH = 331 - 181;
const LAPTOP_WINDOW_HEIGHT = 240 - 190;
const DOWN_STRING_X = DOWNLOAD_X + 47;
const DOWN_STRING_Y = DOWNLOAD_Y + 5;
const ERROR_X = 300;
const ERROR_Y = 200;
const ERROR_BTN_X = 43;
const ERROR_BTN_Y = ERROR_Y + 70;
const ERROR_TITLE_X = ERROR_X + 3;
const ERROR_TITLE_Y = ERROR_Y + 3;
const ERROR_BTN_TEXT_X = 20;
const ERROR_BTN_TEXT_Y = 9;
const ERROR_TEXT_X = 0;
const ERROR_TEXT_Y = 15;
const LAPTOP_TITLE_ICONS_X = 113;
const LAPTOP_TITLE_ICONS_Y = 27;

// HD flicker times
const HD_FLICKER_TIME = 3000;
const FLICKER_TIME = 50;

const NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS = 18;
const LAPTOP_TITLE_BAR_WIDTH = 500;
const LAPTOP_TITLE_BAR_HEIGHT = 24;

const LAPTOP_TITLE_BAR_TOP_LEFT_X = 111;
const LAPTOP_TITLE_BAR_TOP_LEFT_Y = 25;
const LAPTOP_TITLE_BAR_TOP_RIGHT_X = 610;
const LAPTOP_TITLE_BAR_TOP_RIGHT_Y = LAPTOP_TITLE_BAR_TOP_LEFT_Y;

const LAPTOP_TITLE_BAR_ICON_OFFSET_X = 5;
const LAPTOP_TITLE_BAR_ICON_OFFSET_Y = 2;
const LAPTOP_TITLE_BAR_TEXT_OFFSET_X = 29; // 18
const LAPTOP_TITLE_BAR_TEXT_OFFSET_Y = 8;

const LAPTOP_PROGRAM_ICON_X = LAPTOP_TITLE_BAR_TOP_LEFT_X;
const LAPTOP_PROGRAM_ICON_Y = LAPTOP_TITLE_BAR_TOP_LEFT_Y;
const LAPTOP_PROGRAM_ICON_WIDTH = 20;
const LAPTOP_PROGRAM_ICON_HEIGHT = 20;
const DISPLAY_TIME_FOR_WEB_BOOKMARK_NOTIFY = 2000;

// the wait time for closing of laptop animation/delay
const EXIT_LAPTOP_DELAY_TIME = 100;

let guiTitleBarSurface: UINT32;
let gfTitleBarSurfaceAlreadyActive: boolean = false;

const LAPTOP__NEW_FILE_ICON_X = 83;
const LAPTOP__NEW_FILE_ICON_Y = 412; //(405+19)

const LAPTOP__NEW_EMAIL_ICON_X = (83 - 16);
const LAPTOP__NEW_EMAIL_ICON_Y = LAPTOP__NEW_FILE_ICON_Y;

// Mode values
export let guiCurrentLaptopMode: UINT32;
export let guiPreviousLaptopMode: UINT32;
let guiCurrentWWWMode: UINT32 = Enum95.LAPTOP_MODE_NONE;
export let giCurrentSubPage: INT32;
let guiCurrentLapTopCursor: UINT32;
let guiPreviousLapTopCursor: UINT32;
let guiCurrentSidePanel: UINT32; // the current navagation panel on the leftside of the laptop screen
let guiPreviousSidePanel: UINT32;

let iHighLightBookLine: INT32 = -1;
export let fFastLoadFlag: boolean = false;
let gfSideBarFlag: boolean;
let gfEnterLapTop: boolean = true;
export let gfShowBookmarks: boolean = false;

// in progress of loading a page?
export let fLoadPendingFlag: boolean = false;
let fErrorFlag: boolean;

// mark buttons dirty?
export let fMarkButtonsDirtyFlag: boolean = true;

// redraw afer rendering buttons?
export let fReDrawPostButtonRender: boolean = false;

// intermediate refresh flag
let fIntermediateReDrawFlag: boolean = false;

// in laptop right now?
export let fCurrentlyInLaptop: boolean = false;

// exit due to a message box pop up?..don't really leave LAPTOP
export let fExitDueToMessageBox: boolean = false;

// have we visited IMP yety?
export let fNotVistedImpYet: boolean = true;

// exit laptop during a load?
let fExitDuringLoad: boolean = false;

// done loading?
export let fDoneLoadPending: boolean = false;

// re connecting to a web page?
let fReConnectingFlag: boolean = false;

// going a subpage of a web page?..faster access time
export let fConnectingToSubPage: boolean = false;

// is this our first time in laptop?
let fFirstTimeInLaptop: boolean = true;

// redraw the book mark info panel .. for blitting on top of animations
export let fReDrawBookMarkInfo: boolean = false;

// show the 2 second info about bookmarks being accessed by clicking on web
export let fShowBookmarkInfo: boolean = false;

// TEMP!	Disables the loadpending delay when switching b/n www pages
let gfTemporaryDisablingOfLoadPendingFlag: boolean = false;

// GLOBAL FOR WHICH SCREEN TO EXIT TO FOR LAPTOP
export let guiExitScreen: UINT32 = Enum26.MAP_SCREEN;

let gLaptopRegion: MOUSE_REGION;
// Laptop screen graphic handle
let guiLAPTOP: UINT32;
let fNewWWWDisplay: boolean = true;

/* static */ let fNewWWW: boolean = true;

let giRainDelayInternetSite: INT32 = -1;

// have we visitied this site already?
// BOOLEAN fVisitedBookmarkAlready[20];

// the laptop icons
let guiFILESICON: UINT32;
let guiFINANCIALICON: UINT32;
let guiHISTORYICON: UINT32;
let guiMAILICON: UINT32;
let guiPERSICON: UINT32;
let guiWWWICON: UINT32;
let guiBOOKTOP: UINT32;
let guiBOOKHIGH: UINT32;
let guiBOOKMID: UINT32;
let guiBOOKBOT: UINT32;
let guiBOOKMARK: UINT32;
let guiGRAPHWINDOW: UINT32;
let guiGRAPHBAR: UINT32;
export let guiLaptopBACKGROUND: UINT32;
let guiDOWNLOADTOP: UINT32;
let guiDOWNLOADMID: UINT32;
let guiDOWNLOADBOT: UINT32;
let guiTITLEBARLAPTOP: UINT32;
let guiLIGHTS: UINT32;
export let guiTITLEBARICONS: UINT32;
let guiDESKTOP: UINT32;

// email notification
let guiUNREAD: UINT32;
let guiNEWMAIL: UINT32;

// laptop button
let guiLAPTOPBUTTON: UINT32;
// the sidepanel handle
let guiLAPTOPSIDEPANEL: UINT32;

// BOOLEAN		gfNewGameLaptop = TRUE;

// enter new laptop mode due to sliding bars
let fEnteredNewLapTopDueToHandleSlidingBars: boolean = false;

// laptop pop up messages index value
let iLaptopMessageBox: INT32 = -1;

// whether or not we are initing the slide in title bar
let fInitTitle: boolean = true;

// tab handled
let fTabHandled: boolean = false;

// are we maxing or mining?
let fForward: boolean = true;

// BUTTON IMAGES
let giLapTopButton: INT32[] /* [MAX_BUTTON_COUNT] */;
let giLapTopButtonImage: INT32[] /* [MAX_BUTTON_COUNT] */;
let giErrorButton: INT32[] /* [1] */;
let giErrorButtonImage: INT32[] /* [1] */;

let gLaptopButton: INT32[] /* [7] */;
let gLaptopButtonImage: INT32[] /* [7] */;

// minimize button
let gLaptopMinButton: INT32[] /* [1] */;
let gLaptopMinButtonImage: INT32[] /* [1] */;

let gLaptopProgramStates: INT32[] /* [LAPTOP_PROGRAM_HISTORY + 1] */;

// process of mazimizing
let fMaximizingProgram: boolean = false;

// program we are maximizing
let bProgramBeingMaximized: INT8 = -1;

// are we minimizing
let fMinizingProgram: boolean = false;

// process openned queue
let gLaptopProgramQueueList: INT32[] /* [6] */;

// state of createion of minimize button
let fCreateMinimizeButton: boolean = false;

export let fExitingLaptopFlag: boolean = false;

// HD and power lights on
let fPowerLightOn: boolean = true;
let fHardDriveLightOn: boolean = false;

// HD flicker
let fFlickerHD: boolean = false;

// the screens limiting rect
let LaptopScreenRect: SGPRect = createSGPRectFrom(LAPTOP_UL_X, LAPTOP_UL_Y - 5, LAPTOP_SCREEN_LR_X + 2, LAPTOP_SCREEN_LR_Y + 5 + 19);

// the sub pages vistsed or not status within the web browser
let gfWWWaitSubSitesVisitedFlags: boolean[] /* [LAPTOP_MODE_SIRTECH - LAPTOP_MODE_WWW] */;

// INT32 iBookMarkList[MAX_BOOKMARKS];

// mouse regions
let gEmailRegion: MOUSE_REGION;
let gWWWRegion: MOUSE_REGION;
let gFinancialRegion: MOUSE_REGION;
let gPersonnelRegion: MOUSE_REGION;
let gHistoryRegion: MOUSE_REGION;
let gFilesRegion: MOUSE_REGION;
let gLapTopScreenRegion: MOUSE_REGION;
let gBookmarkMouseRegions: MOUSE_REGION[] /* [MAX_BOOKMARKS] */;
export let pScreenMask: MOUSE_REGION;
let gLapTopProgramMinIcon: MOUSE_REGION;
let gNewMailIconRegion: MOUSE_REGION;
let gNewFileIconRegion: MOUSE_REGION;

// highlighted mouse region
let giHighLightRegion: INT32 = Enum92.NO_REGION;

// highlighted regions
let giCurrentRegion: INT32 = Enum92.NO_REGION;
let giOldRegion: INT32 = Enum92.NO_REGION;

// used for global variables that need to be saved
export let LaptopSaveInfo: LaptopSaveInfoStruct;

export let fReDrawScreenFlag: boolean = false;
export let fPausedReDrawScreenFlag: boolean = false; // used in the handler functions to redraw the screen, after the current frame

// ppp

export function SetLaptopExitScreen(uiExitScreen: UINT32): void {
  guiExitScreen = uiExitScreen;
}

export function SetLaptopNewGameFlag(): void {
  LaptopSaveInfo.gfNewGameLaptop = true;
}

function HandleLapTopCursorUpDate(): void {
  if (guiPreviousLapTopCursor == guiCurrentLapTopCursor)
    return;
  switch (guiCurrentLapTopCursor) {
    case Enum97.LAPTOP_PANEL_CURSOR:
      MSYS_SetCurrentCursor(Enum317.CURSOR_NORMAL);
      break;
    case Enum97.LAPTOP_SCREEN_CURSOR:
      MSYS_SetCurrentCursor(Enum317.CURSOR_LAPTOP_SCREEN);
      break;
    case Enum97.LAPTOP_WWW_CURSOR:
      MSYS_SetCurrentCursor(Enum317.CURSOR_WWW);
      break;
  }
  guiPreviousLapTopCursor = guiCurrentLapTopCursor;
}
function GetLaptopKeyboardInput(): void {
  let InputEvent: InputAtom;
  let MousePos: POINT = createPoint();

  GetCursorPos(addressof(MousePos));

  fTabHandled = false;

  while (DequeueEvent(addressof(InputEvent)) == true) {
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
      case RIGHT_BUTTON_REPEAT:
        MouseSystemHook(RIGHT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
      case LEFT_BUTTON_REPEAT:
        MouseSystemHook(LEFT_BUTTON_REPEAT, MousePos.x, MousePos.y, _LeftButtonDown(), _RightButtonDown());
        break;
    }

    HandleKeyBoardShortCutsForLapTop(InputEvent.usEvent, InputEvent.usParam, InputEvent.usKeyState);
  }
}

// This is called only once at game initialization.
export function LaptopScreenInit(): UINT32 {
  // Memset the whole structure, to make sure of no 'JUNK'
  memset(addressof(LaptopSaveInfo), 0, sizeof(LaptopSaveInfoStruct));

  LaptopSaveInfo.gfNewGameLaptop = true;

  InitializeNumDaysMercArrive();

  // reset the id of the last hired merc
  LaptopSaveInfo.sLastHiredMerc.iIdOfMerc = -1;

  // reset the flag that enables the 'just hired merc' popup
  LaptopSaveInfo.sLastHiredMerc.fHaveDisplayedPopUpInLaptop = false;

  // Initialize all vars
  guiCurrentLaptopMode = Enum95.LAPTOP_MODE_EMAIL;
  guiPreviousLaptopMode = Enum95.LAPTOP_MODE_NONE;
  guiCurrentWWWMode = Enum95.LAPTOP_MODE_NONE;
  guiCurrentSidePanel = Enum96.FIRST_SIDE_PANEL;
  guiPreviousSidePanel = Enum96.FIRST_SIDE_PANEL;

  gfSideBarFlag = false;
  gfShowBookmarks = false;
  InitBookMarkList();
  GameInitAIM();
  GameInitAIMMembers();
  GameInitAimFacialIndex();
  GameInitAimSort();
  GameInitAimArchives();
  GameInitAimPolicies();
  GameInitAimLinks();
  GameInitAimHistory();
  GameInitMercs();
  GameInitBobbyR();
  GameInitBobbyRAmmo();
  GameInitBobbyRArmour();
  GameInitBobbyRGuns();
  GameInitBobbyRMailOrder();
  GameInitBobbyRMisc();
  GameInitBobbyRUsed();
  GameInitEmail();
  GameInitCharProfile();
  GameInitFlorist();
  GameInitInsurance();
  GameInitInsuranceContract();
  GameInitFuneral();
  GameInitSirTech();
  GameInitFiles();
  GameInitPersonnel();

  // init program states
  memset(addressof(gLaptopProgramStates), Enum94.LAPTOP_PROGRAM_MINIMIZED, sizeof(gLaptopProgramStates));

  gfAtLeastOneMercWasHired = false;

  // No longer inits the laptop screens, now InitLaptopAndLaptopScreens() does

  return 1;
}

export function InitLaptopAndLaptopScreens(): boolean {
  GameInitFinances();
  GameInitHistory();

  // Reset the flag so we can create a new IMP character
  LaptopSaveInfo.fIMPCompletedFlag = false;

  // Reset the flag so that BOBBYR's isnt available at the begining of the game
  LaptopSaveInfo.fBobbyRSiteCanBeAccessed = false;

  return true;
}

export function DrawLapTopIcons(): UINT32 {
  return true;
}

export function DrawLapTopText(): UINT32 {
  // show balance
  DisplayPlayersBalanceToDate();

  return true;
}

// This is only called once at game shutdown.
export function LaptopScreenShutdown(): UINT32 {
  InsuranceContractEndGameShutDown();
  BobbyRayMailOrderEndGameShutDown();
  ShutDownEmailList();

  ClearHistoryList();

  return true;
}

function EnterLaptop(): INT32 {
  // Create, load, initialize data -- just entered the laptop.

  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let iCounter: INT32 = 0;

  /* static */ let fEnteredFromGameStartup: boolean = true;
  // we are re entering due to message box, leave NOW!
  if (fExitDueToMessageBox == true) {
    return true;
  }

  // if the radar map mouse region is still active, disable it.
  if (gRadarRegion.uiFlags & MSYS_REGION_ENABLED) {
    MSYS_DisableRegion(addressof(gRadarRegion));
    /*
                    #ifdef JA2BETAVERSION
                            DoLapTopMessageBox( MSG_BOX_LAPTOP_DEFAULT, L"Mapscreen's radar region is still active, please tell Dave how you entered Laptop.", LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL );
                    #endif
    */
  }

  gfDontStartTransitionFromLaptop = false;

  // Since we are coming in from MapScreen, uncheck the flag
  guiTacticalInterfaceFlags &= ~INTERFACE_MAPSCREEN;

  // ATE: Disable messages....
  DisableScrollMessages();

  // Stop any person from saying anything
  StopAnyCurrentlyTalkingSpeech();

  // Don't play music....
  SetMusicMode(Enum328.MUSIC_LAPTOP);

  // Stop ambients...
  StopAmbients();

  // if its raining, start the rain showers
  if (IsItRaining()) {
    // Enable the rain delay warning
    giRainDelayInternetSite = -1;

    // lower the volume
    guiRainLoop = PlayJA2Ambient(Enum331.RAIN_1, LOWVOLUME, 0);
  }

  // open the laptop library
  //	OpenLibrary( LIBRARY_LAPTOP );

  // pause the game because we dont want time to advance in the laptop
  PauseGame();

  // set the fact we are currently in laptop, for rendering purposes
  fCurrentlyInLaptop = true;

  // clear guiSAVEBUFFER
  // ColorFillVideoSurfaceArea(guiSAVEBUFFER,	0, 0, 640, 480, Get16BPPColor(FROMRGB(0, 0, 0)) );
  // disable characters panel buttons

  // reset redraw flag and redraw new mail
  fReDrawScreenFlag = false;
  fReDrawNewMailFlag = true;

  // setup basic cursors
  guiCurrentLapTopCursor = Enum97.LAPTOP_PANEL_CURSOR;
  guiPreviousLapTopCursor = Enum97.LAPTOP_NO_CURSOR;

  // sub page
  giCurrentSubPage = 0;
  giCurrentRegion = Enum92.EMAIL_REGION;

  // load the laptop graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\laptop3.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiLAPTOP))) {
    return false;
  }

  // background for panel
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\taskbar.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiLaptopBACKGROUND))) {
    return false;
  }

  // background for panel
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\programtitlebar.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiTITLEBARLAPTOP))) {
    return false;
  }

  // lights for power and HD
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\lights.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiLIGHTS))) {
    return false;
  }

  // icons for title bars
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\ICONS.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiTITLEBARICONS))) {
    return false;
  }

  // load, blt and delete graphics
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\NewMailWarning.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiEmailWarning))) {
    return false;
  }
  // load background
  LoadDesktopBackground();

  guiCurrentLaptopMode = Enum95.LAPTOP_MODE_NONE;
  // MSYS_SetCurrentCursor(CURSOR_NORMAL);

  guiCurrentLaptopMode = Enum95.LAPTOP_MODE_NONE;
  guiPreviousLaptopMode = Enum95.LAPTOP_MODE_NONE;
  guiCurrentWWWMode = Enum95.LAPTOP_MODE_NONE;
  guiCurrentSidePanel = Enum96.FIRST_SIDE_PANEL;
  guiPreviousSidePanel = Enum96.FIRST_SIDE_PANEL;
  gfSideBarFlag = false;
  CreateLapTopMouseRegions();
  RenderLapTopImage();
  HighLightRegion(giCurrentRegion);
  // AddEmailMessage(L"Entered LapTop",L"Entered", 0, 0);
  // for(iCounter=0; iCounter <10; iCounter++)
  //{
  // AddEmail(3,5,0,0);
  //}
  // the laptop mouse region

  // reset bookmarks flags
  fFirstTimeInLaptop = true;

  // reset all bookmark visits
  memset(addressof(LaptopSaveInfo.fVisitedBookmarkAlready), 0, sizeof(LaptopSaveInfo.fVisitedBookmarkAlready));

  // init program states
  memset(addressof(gLaptopProgramStates), Enum94.LAPTOP_PROGRAM_MINIMIZED, sizeof(gLaptopProgramStates));

  // turn the power on
  fPowerLightOn = true;

  // we are not exiting laptop right now, we just got here
  fExitingLaptopFlag = false;

  // reset program we are maximizing
  bProgramBeingMaximized = -1;

  // reset fact we are maximizing/ mining
  fMaximizingProgram = false;
  fMinizingProgram = false;

  // initialize open queue
  InitLaptopOpenQueue();

  gfShowBookmarks = false;
  LoadBookmark();
  SetBookMark(Enum98.AIM_BOOKMARK);
  LoadLoadPending();

  DrawDeskTopBackground();

  // create region for new mail icon
  CreateDestroyMouseRegionForNewMailIcon();

  // DEF: Added to Init things in various laptop pages
  EnterLaptopInitLaptopPages();
  InitalizeSubSitesList();

  fShowAtmPanelStartButton = true;

  InvalidateRegion(0, 0, 640, 480);

  return true;
}

export function ExitLaptop(): void {
  // exit is called due to message box, leave
  if (fExitDueToMessageBox) {
    fExitDueToMessageBox = false;
    return;
  }

  if (DidGameJustStart()) {
    SetMusicMode(Enum328.MUSIC_LAPTOP);
  } else {
    // Restore to old stuff...
    SetMusicMode(Enum328.MUSIC_RESTORE);
  }

  // Start ambients...
  BuildDayAmbientSounds();

  // if its raining, start the rain showers
  if (IsItRaining()) {
    // Raise the volume to where it was
    guiRainLoop = PlayJA2Ambient(Enum331.RAIN_1, MIDVOLUME, 0);
  }

  // release cursor
  FreeMouseCursor();

  // set the fact we are currently not in laptop, for rendering purposes
  fCurrentlyInLaptop = false;

  // Deallocate, save data -- leaving laptop.
  SetRenderFlags(RENDER_FLAG_FULL);

  if (fExitDuringLoad == false) {
    ExitLaptopMode(guiCurrentLaptopMode);
  }

  fExitDuringLoad = false;
  fLoadPendingFlag = false;

  DeleteVideoObjectFromIndex(guiLAPTOP);
  DeleteVideoObjectFromIndex(guiLaptopBACKGROUND);
  DeleteVideoObjectFromIndex(guiTITLEBARLAPTOP);
  DeleteVideoObjectFromIndex(guiLIGHTS);
  DeleteVideoObjectFromIndex(guiTITLEBARICONS);
  DeleteVideoObjectFromIndex(guiEmailWarning);

  // destroy region for new mail icon
  CreateDestroyMouseRegionForNewMailIcon();

  // get rid of desktop
  DeleteDesktopBackground();

  if (fErrorFlag) {
    fErrorFlag = false;
    CreateDestroyErrorButton();
  }
  if (fDeleteMailFlag) {
    fDeleteMailFlag = false;
    CreateDestroyDeleteNoticeMailButton();
  }
  if (fNewMailFlag) {
    fNewMailFlag = false;
    CreateDestroyNewMailButton();
  }

  // get rid of minize button
  CreateDestroyMinimizeButtonForCurrentMode();

  // MSYS_SetCurrentCursor(CURSOR_NORMAL);
  gfEnterLapTop = true;
  DeleteLapTopButtons();
  DeleteLapTopMouseRegions();
  // restore tactical buttons
  // CreateCurrentTacticalPanelButtons();
  gfShowBookmarks = false;
  CreateDestoryBookMarkRegions();

  fNewWWW = true;
  RemoveBookmark(-2);
  DeleteBookmark();
  // DeleteBookmarkRegions();
  DeleteLoadPending();
  fReDrawNewMailFlag = false;

  // Since we are going to MapScreen, check the flag
  guiTacticalInterfaceFlags |= INTERFACE_MAPSCREEN;

  // close the laptop library
  //	CloseLibrary( LIBRARY_LAPTOP );
  // pause the game because we dont want time to advance in the laptop
  UnPauseGame();
}

function RenderLapTopImage(): void {
  let hLapTopHandle: HVOBJECT;

  if ((fMaximizingProgram == true) || (fMinizingProgram == true)) {
    return;
  }

  GetVideoObject(addressof(hLapTopHandle), guiLAPTOP);
  BltVideoObject(FRAME_BUFFER, hLapTopHandle, 0, LAPTOP_X, LAPTOP_Y, VO_BLT_SRCTRANSPARENCY, null);

  GetVideoObject(addressof(hLapTopHandle), guiLaptopBACKGROUND);
  BltVideoObject(FRAME_BUFFER, hLapTopHandle, 1, 25, 23, VO_BLT_SRCTRANSPARENCY, null);

  MarkButtonsDirty();
}
export function RenderLaptop(): void {
  let uiTempMode: UINT32 = 0;

  if ((fMaximizingProgram == true) || (fMinizingProgram == true)) {
    gfShowBookmarks = false;
    return;
  }

  if (fLoadPendingFlag) {
    uiTempMode = guiCurrentLaptopMode;
    guiCurrentLaptopMode = guiPreviousLaptopMode;
  }

  switch (guiCurrentLaptopMode) {
    case (Enum95.LAPTOP_MODE_NONE):
      DrawDeskTopBackground();
      break;
    case Enum95.LAPTOP_MODE_AIM:
      RenderAIM();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS:
      RenderAIMMembers();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX:
      RenderAimFacialIndex();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_SORTED_FILES:
      RenderAimSort();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_ARCHIVES:
      RenderAimArchives();
      break;
    case Enum95.LAPTOP_MODE_AIM_POLICIES:
      RenderAimPolicies();
      break;
    case Enum95.LAPTOP_MODE_AIM_LINKS:
      RenderAimLinks();
      break;
    case Enum95.LAPTOP_MODE_AIM_HISTORY:
      RenderAimHistory();
      break;
    case Enum95.LAPTOP_MODE_MERC:
      RenderMercs();
      break;
    case Enum95.LAPTOP_MODE_MERC_FILES:
      RenderMercsFiles();
      break;
    case Enum95.LAPTOP_MODE_MERC_ACCOUNT:
      RenderMercsAccount();
      break;
    case Enum95.LAPTOP_MODE_MERC_NO_ACCOUNT:
      RenderMercsNoAccount();
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R:
      RenderBobbyR();
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R_GUNS:
      RenderBobbyRGuns();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_AMMO:
      RenderBobbyRAmmo();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_ARMOR:
      RenderBobbyRArmour();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_MISC:
      RenderBobbyRMisc();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_USED:
      RenderBobbyRUsed();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_MAILORDER:
      RenderBobbyRMailOrder();
      break;
    case Enum95.LAPTOP_MODE_CHAR_PROFILE:
      RenderCharProfile();
      break;
    case Enum95.LAPTOP_MODE_FLORIST:
      RenderFlorist();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_FLOWER_GALLERY:
      RenderFloristGallery();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_ORDERFORM:
      RenderFloristOrderForm();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_CARD_GALLERY:
      RenderFloristCards();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE:
      RenderInsurance();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE_INFO:
      RenderInsuranceInfo();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE_CONTRACT:
      RenderInsuranceContract();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE_COMMENTS:
      RenderInsuranceComments();
      break;

    case Enum95.LAPTOP_MODE_FUNERAL:
      RenderFuneral();
      break;
    case Enum95.LAPTOP_MODE_SIRTECH:
      RenderSirTech();
      break;
    case Enum95.LAPTOP_MODE_FINANCES:
      RenderFinances();
      break;
    case Enum95.LAPTOP_MODE_PERSONNEL:
      RenderPersonnel();
      break;
    case Enum95.LAPTOP_MODE_HISTORY:
      RenderHistory();
      break;
    case Enum95.LAPTOP_MODE_FILES:
      RenderFiles();
      break;
    case Enum95.LAPTOP_MODE_EMAIL:
      RenderEmail();
      break;
    case (Enum95.LAPTOP_MODE_WWW):
      DrawDeskTopBackground();
      RenderWWWProgramTitleBar();
      break;
    case (Enum95.LAPTOP_MODE_BROKEN_LINK):
      RenderBrokenLink();
      break;

    case Enum95.LAPTOP_MODE_BOBBYR_SHIPMENTS:
      RenderBobbyRShipments();
      break;
  }

  if (guiCurrentLaptopMode >= Enum95.LAPTOP_MODE_WWW) {
    // render program bar for www program
    RenderWWWProgramTitleBar();
  }

  if (fLoadPendingFlag) {
    guiCurrentLaptopMode = uiTempMode;
    return;
  }

  DisplayProgramBoundingBox(false);

  // mark the buttons dirty at this point
  MarkButtonsDirty();
}

function EnterNewLaptopMode(): void {
  /* static */ let fOldLoadFlag: boolean = false;

  if (fExitingLaptopFlag) {
    return;
  }
  // cause flicker, as we are going to a new program/WEB page
  fFlickerHD = true;

  // handle maximizing of programs
  switch (guiCurrentLaptopMode) {
    case (Enum95.LAPTOP_MODE_EMAIL):
      if (gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_MAILER] == Enum94.LAPTOP_PROGRAM_MINIMIZED) {
        // minized, maximized
        if (fMaximizingProgram == false) {
          fInitTitle = true;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopTitles[0], guiTITLEBARICONS, 0);
          ExitLaptopMode(guiPreviousLaptopMode);
        }
        fMaximizingProgram = true;
        bProgramBeingMaximized = Enum93.LAPTOP_PROGRAM_MAILER;
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_MAILER] = Enum94.LAPTOP_PROGRAM_OPEN;

        return;
      }
      break;
    case (Enum95.LAPTOP_MODE_FILES):
      if (gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_FILES] == Enum94.LAPTOP_PROGRAM_MINIMIZED) {
        // minized, maximized
        if (fMaximizingProgram == false) {
          fInitTitle = true;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopTitles[1], guiTITLEBARICONS, 2);
          ExitLaptopMode(guiPreviousLaptopMode);
        }

        // minized, maximized
        fMaximizingProgram = true;
        bProgramBeingMaximized = Enum93.LAPTOP_PROGRAM_FILES;
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_FILES] = Enum94.LAPTOP_PROGRAM_OPEN;
        return;
      }
      break;
    case (Enum95.LAPTOP_MODE_PERSONNEL):
      if (gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_PERSONNEL] == Enum94.LAPTOP_PROGRAM_MINIMIZED) {
        // minized, maximized
        if (fMaximizingProgram == false) {
          fInitTitle = true;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopTitles[2], guiTITLEBARICONS, 3);
          ExitLaptopMode(guiPreviousLaptopMode);
        }

        // minized, maximized
        fMaximizingProgram = true;
        bProgramBeingMaximized = Enum93.LAPTOP_PROGRAM_PERSONNEL;
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_PERSONNEL] = Enum94.LAPTOP_PROGRAM_OPEN;
        return;
      }
      break;
    case (Enum95.LAPTOP_MODE_FINANCES):
      if (gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_FINANCES] == Enum94.LAPTOP_PROGRAM_MINIMIZED) {
        // minized, maximized
        if (fMaximizingProgram == false) {
          fInitTitle = true;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopTitles[3], guiTITLEBARICONS, 5);
          ExitLaptopMode(guiPreviousLaptopMode);
        }

        // minized, maximized
        fMaximizingProgram = true;
        bProgramBeingMaximized = Enum93.LAPTOP_PROGRAM_FINANCES;
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_FINANCES] = Enum94.LAPTOP_PROGRAM_OPEN;
        return;
      }
      break;
    case (Enum95.LAPTOP_MODE_HISTORY):
      if (gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_HISTORY] == Enum94.LAPTOP_PROGRAM_MINIMIZED) {
        // minized, maximized
        if (fMaximizingProgram == false) {
          fInitTitle = true;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopTitles[4], guiTITLEBARICONS, 4);
          ExitLaptopMode(guiPreviousLaptopMode);
        }
        // minized, maximized
        fMaximizingProgram = true;
        bProgramBeingMaximized = Enum93.LAPTOP_PROGRAM_HISTORY;
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_HISTORY] = Enum94.LAPTOP_PROGRAM_OPEN;
        return;
      }
      break;
    case (Enum95.LAPTOP_MODE_NONE):
      // do nothing
      break;
    default:
      if (gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_WEB_BROWSER] == Enum94.LAPTOP_PROGRAM_MINIMIZED) {
        // minized, maximized
        if (fMaximizingProgram == false) {
          fInitTitle = true;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pWebTitle[0], guiTITLEBARICONS, 1);
          ExitLaptopMode(guiPreviousLaptopMode);
        }
        // minized, maximized
        fMaximizingProgram = true;
        bProgramBeingMaximized = Enum93.LAPTOP_PROGRAM_WEB_BROWSER;
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_WEB_BROWSER] = Enum94.LAPTOP_PROGRAM_OPEN;
        return;
      }
      break;
  }

  if ((fMaximizingProgram == true) || (fMinizingProgram == true)) {
    return;
  }

  if ((fOldLoadFlag) && (!fLoadPendingFlag)) {
    fOldLoadFlag = false;
  } else if ((fLoadPendingFlag) && (!fOldLoadFlag)) {
    ExitLaptopMode(guiPreviousLaptopMode);
    fOldLoadFlag = true;
    return;
  } else if ((fOldLoadFlag) && (fLoadPendingFlag)) {
    return;
  } else {
    // do not exit previous mode if coming from sliding bar handler
    if ((fEnteredNewLapTopDueToHandleSlidingBars == false)) {
      ExitLaptopMode(guiPreviousLaptopMode);
    }
  }

  if ((guiCurrentWWWMode == Enum95.LAPTOP_MODE_NONE) && (guiCurrentLaptopMode >= Enum95.LAPTOP_MODE_WWW)) {
    RenderLapTopImage();
    giCurrentRegion = Enum92.WWW_REGION;
    RestoreOldRegion(giOldRegion);
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_WWW;
    HighLightRegion(giCurrentRegion);
  } else {
    if (guiCurrentLaptopMode > Enum95.LAPTOP_MODE_WWW) {
      if (guiPreviousLaptopMode < Enum95.LAPTOP_MODE_WWW)
        guiCurrentLaptopMode = guiCurrentWWWMode;
      else {
        guiCurrentWWWMode = guiCurrentLaptopMode;
        giCurrentSubPage = 0;
      }
    }
  }

  if (guiCurrentLaptopMode >= Enum95.LAPTOP_MODE_WWW) {
    RenderWWWProgramTitleBar();
  }

  if ((guiCurrentLaptopMode >= Enum95.LAPTOP_MODE_WWW) && (guiPreviousLaptopMode >= Enum95.LAPTOP_MODE_WWW)) {
    gfShowBookmarks = false;
  }

  // Initialize the new mode.
  switch (guiCurrentLaptopMode) {
    case Enum95.LAPTOP_MODE_AIM:
      EnterAIM();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS:
      EnterAIMMembers();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX:
      EnterAimFacialIndex();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_SORTED_FILES:
      EnterAimSort();
      break;

    case Enum95.LAPTOP_MODE_AIM_MEMBERS_ARCHIVES:
      EnterAimArchives();
      break;
    case Enum95.LAPTOP_MODE_AIM_POLICIES:
      EnterAimPolicies();
      break;
    case Enum95.LAPTOP_MODE_AIM_LINKS:
      EnterAimLinks();
      break;
    case Enum95.LAPTOP_MODE_AIM_HISTORY:
      EnterAimHistory();
      break;

    case Enum95.LAPTOP_MODE_MERC:
      EnterMercs();
      break;
    case Enum95.LAPTOP_MODE_MERC_FILES:
      EnterMercsFiles();
      break;
    case Enum95.LAPTOP_MODE_MERC_ACCOUNT:
      EnterMercsAccount();
      break;
    case Enum95.LAPTOP_MODE_MERC_NO_ACCOUNT:
      EnterMercsNoAccount();
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R:
      EnterBobbyR();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_GUNS:
      EnterBobbyRGuns();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_AMMO:
      EnterBobbyRAmmo();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_ARMOR:
      EnterBobbyRArmour();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_MISC:
      EnterBobbyRMisc();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_USED:
      EnterBobbyRUsed();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_MAILORDER:
      EnterBobbyRMailOrder();
      break;
    case Enum95.LAPTOP_MODE_CHAR_PROFILE:
      EnterCharProfile();
      break;

    case Enum95.LAPTOP_MODE_FLORIST:
      EnterFlorist();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_FLOWER_GALLERY:
      EnterFloristGallery();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_ORDERFORM:
      EnterFloristOrderForm();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_CARD_GALLERY:
      EnterFloristCards();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE:
      EnterInsurance();
      break;
    case Enum95.LAPTOP_MODE_INSURANCE_INFO:
      EnterInsuranceInfo();
      break;
    case Enum95.LAPTOP_MODE_INSURANCE_CONTRACT:
      EnterInsuranceContract();
      break;
    case Enum95.LAPTOP_MODE_INSURANCE_COMMENTS:
      EnterInsuranceComments();
      break;

    case Enum95.LAPTOP_MODE_FUNERAL:
      EnterFuneral();
      break;
    case Enum95.LAPTOP_MODE_SIRTECH:
      EnterSirTech();
      break;
    case Enum95.LAPTOP_MODE_FINANCES:
      EnterFinances();
      break;
    case Enum95.LAPTOP_MODE_PERSONNEL:
      EnterPersonnel();
      break;
    case Enum95.LAPTOP_MODE_HISTORY:
      EnterHistory();
      break;
    case Enum95.LAPTOP_MODE_FILES:
      EnterFiles();
      break;
    case Enum95.LAPTOP_MODE_EMAIL:
      EnterEmail();
      break;
    case Enum95.LAPTOP_MODE_BROKEN_LINK:
      EnterBrokenLink();
      break;
    case Enum95.LAPTOP_MODE_BOBBYR_SHIPMENTS:
      EnterBobbyRShipments();
      break;
  }

  // first time using webbrowser in this laptop session
  if ((fFirstTimeInLaptop == true) && (guiCurrentLaptopMode >= Enum95.LAPTOP_MODE_WWW)) {
    // show bookmarks
    gfShowBookmarks = true;

    // reset flag
    fFirstTimeInLaptop = false;
  }

  if ((!fLoadPendingFlag)) {
    CreateDestroyMinimizeButtonForCurrentMode();
    guiPreviousLaptopMode = guiCurrentLaptopMode;
    SetSubSiteAsVisted();
  }

  DisplayProgramBoundingBox(true);

  // check to see if we need to go to there default web page of not
  // HandleDefaultWebpageForLaptop( );
}

function HandleLapTopHandles(): void {
  if (fLoadPendingFlag)
    return;

  if ((fMaximizingProgram == true) || (fMinizingProgram == true)) {
    return;
  }

  switch (guiCurrentLaptopMode) {
    case Enum95.LAPTOP_MODE_AIM:

      HandleAIM();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS:
      HandleAIMMembers();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX:
      HandleAimFacialIndex();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_SORTED_FILES:
      HandleAimSort();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_ARCHIVES:
      HandleAimArchives();
      break;
    case Enum95.LAPTOP_MODE_AIM_POLICIES:
      HandleAimPolicies();
      break;
    case Enum95.LAPTOP_MODE_AIM_LINKS:
      HandleAimLinks();
      break;
    case Enum95.LAPTOP_MODE_AIM_HISTORY:
      HandleAimHistory();
      break;

    case Enum95.LAPTOP_MODE_MERC:
      HandleMercs();
      break;
    case Enum95.LAPTOP_MODE_MERC_FILES:
      HandleMercsFiles();
      break;
    case Enum95.LAPTOP_MODE_MERC_ACCOUNT:
      HandleMercsAccount();
      break;
    case Enum95.LAPTOP_MODE_MERC_NO_ACCOUNT:
      HandleMercsNoAccount();
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R:
      HandleBobbyR();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_GUNS:
      HandleBobbyRGuns();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_AMMO:
      HandleBobbyRAmmo();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_ARMOR:
      HandleBobbyRArmour();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_MISC:
      HandleBobbyRMisc();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_USED:
      HandleBobbyRUsed();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_MAILORDER:
      HandleBobbyRMailOrder();
      break;

    case Enum95.LAPTOP_MODE_CHAR_PROFILE:
      HandleCharProfile();
      break;
    case Enum95.LAPTOP_MODE_FLORIST:
      HandleFlorist();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_FLOWER_GALLERY:
      HandleFloristGallery();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_ORDERFORM:
      HandleFloristOrderForm();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_CARD_GALLERY:
      HandleFloristCards();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE:
      HandleInsurance();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE_INFO:
      HandleInsuranceInfo();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE_CONTRACT:
      HandleInsuranceContract();
      break;
    case Enum95.LAPTOP_MODE_INSURANCE_COMMENTS:
      HandleInsuranceComments();
      break;

    case Enum95.LAPTOP_MODE_FUNERAL:
      HandleFuneral();
      break;
    case Enum95.LAPTOP_MODE_SIRTECH:
      HandleSirTech();
      break;
    case Enum95.LAPTOP_MODE_FINANCES:
      HandleFinances();
      break;
    case Enum95.LAPTOP_MODE_PERSONNEL:
      HandlePersonnel();
      break;
    case Enum95.LAPTOP_MODE_HISTORY:
      HandleHistory();
      break;
    case Enum95.LAPTOP_MODE_FILES:
      HandleFiles();
      break;
    case Enum95.LAPTOP_MODE_EMAIL:
      HandleEmail();
      break;

    case Enum95.LAPTOP_MODE_BROKEN_LINK:
      HandleBrokenLink();
      break;

    case Enum95.LAPTOP_MODE_BOBBYR_SHIPMENTS:
      HandleBobbyRShipments();
      break;
  }
}

export function LaptopScreenHandle(): UINT32 {
  // User just changed modes.  This is determined by the button callbacks
  // created in LaptopScreenInit()

  // just entered
  if (gfEnterLapTop) {
    EnterLaptop();
    CreateLaptopButtons();
    gfEnterLapTop = false;
  }

  if (gfStartMapScreenToLaptopTransition) {
    // Everything is set up to start the transition animation.
    let SrcRect1: SGPRect = createSGPRect();
    let SrcRect2: SGPRect = createSGPRect();
    let DstRect: SGPRect = createSGPRect();
    let iPercentage: INT32;
    let iScalePercentage: INT32;
    let iFactor: INT32;
    let uiStartTime: UINT32;
    let uiTimeRange: UINT32;
    let uiCurrTime: UINT32;
    let iX: INT32;
    let iY: INT32;
    let iWidth: INT32;
    let iHeight: INT32;

    let iRealPercentage: INT32;

    SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
    // Step 1:  Build the laptop image into the save buffer.
    gfStartMapScreenToLaptopTransition = false;
    RestoreBackgroundRects();
    RenderLapTopImage();
    HighLightRegion(giCurrentRegion);
    RenderLaptop();
    RenderButtons();
    PrintDate();
    PrintBalance();
    PrintNumberOnTeam();
    ShowLights();

    // Step 2:  The mapscreen image is in the EXTRABUFFER, and laptop is in the SAVEBUFFER
    //         Start transitioning the screen.
    DstRect.iLeft = 0;
    DstRect.iTop = 0;
    DstRect.iRight = 640;
    DstRect.iBottom = 480;
    uiTimeRange = 1000;
    iPercentage = iRealPercentage = 0;
    uiStartTime = GetJA2Clock();
    BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 640, 480);
    BlitBufferToBuffer(guiEXTRABUFFER, FRAME_BUFFER, 0, 0, 640, 480);
    PlayJA2SampleFromFile("SOUNDS\\Laptop power up (8-11).wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
    while (iRealPercentage < 100) {
      uiCurrTime = GetJA2Clock();
      iPercentage = (uiCurrTime - uiStartTime) * 100 / uiTimeRange;
      iPercentage = Math.min(iPercentage, 100);

      iRealPercentage = iPercentage;

      // Factor the percentage so that it is modified by a gravity falling acceleration effect.
      iFactor = (iPercentage - 50) * 2;
      if (iPercentage < 50)
        iPercentage = (iPercentage + iPercentage * iFactor * 0.01 + 0.5);
      else
        iPercentage = (iPercentage + (100 - iPercentage) * iFactor * 0.01 + 0.5);

      // Mapscreen source rect
      SrcRect1.iLeft = 464 * iPercentage / 100;
      SrcRect1.iRight = 640 - 163 * iPercentage / 100;
      SrcRect1.iTop = 417 * iPercentage / 100;
      SrcRect1.iBottom = 480 - 55 * iPercentage / 100;
      // Laptop source rect
      if (iPercentage < 99)
        iScalePercentage = 10000 / (100 - iPercentage);
      else
        iScalePercentage = 5333;
      iWidth = 12 * iScalePercentage / 100;
      iHeight = 9 * iScalePercentage / 100;
      iX = 472 - (472 - 320) * iScalePercentage / 5333;
      iY = 424 - (424 - 240) * iScalePercentage / 5333;

      SrcRect2.iLeft = iX - iWidth / 2;
      SrcRect2.iRight = SrcRect2.iLeft + iWidth;
      SrcRect2.iTop = iY - iHeight / 2;
      SrcRect2.iBottom = SrcRect2.iTop + iHeight;
      // SrcRect2.iLeft = 464 - 464 * iScalePercentage / 100;
      // SrcRect2.iRight = 477 + 163 * iScalePercentage / 100;
      // SrcRect2.iTop = 417 - 417 * iScalePercentage / 100;
      // SrcRect2.iBottom = 425 + 55 * iScalePercentage / 100;

      // BltStretchVideoSurface( FRAME_BUFFER, guiEXTRABUFFER, 0, 0, 0, &SrcRect1, &DstRect );

      // SetFont( FONT10ARIAL );
      // SetFontForeground( FONT_YELLOW );
      // SetFontShadow( FONT_NEARBLACK );
      // mprintf( 10, 10, L"%d -> %d", iRealPercentage, iPercentage );
      // pDestBuf = LockVideoSurface( FRAME_BUFFER, &uiDestPitchBYTES );
      // SetClippingRegionAndImageWidth( uiDestPitchBYTES, 0, 0, 640, 480 );
      // RectangleDraw( TRUE, SrcRect1.iLeft, SrcRect1.iTop, SrcRect1.iRight, SrcRect1.iBottom, Get16BPPColor( FROMRGB( 255, 100, 0 ) ), pDestBuf );
      // RectangleDraw( TRUE, SrcRect2.iLeft, SrcRect2.iTop, SrcRect2.iRight, SrcRect2.iBottom, Get16BPPColor( FROMRGB( 100, 255, 0 ) ), pDestBuf );
      // UnLockVideoSurface( FRAME_BUFFER );

      BltStretchVideoSurface(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 0, addressof(DstRect), addressof(SrcRect2));
      InvalidateScreen();
      // gfPrintFrameBuffer = TRUE;
      RefreshScreen(null);
    }
    fReDrawScreenFlag = true;
  }

  // DO NOT MOVE THIS FUNCTION CALL!!!

  // This determines if the help screen should be active
  if (ShouldTheHelpScreenComeUp(Enum17.HELP_SCREEN_LAPTOP, false)) {
    // handle the help screen
    HelpScreenHandler();
    return Enum26.LAPTOP_SCREEN;
  }

  RestoreBackgroundRects();

  // lock cursor to screen
  RestrictMouseCursor(addressof(LaptopScreenRect));

  // handle animated cursors
  HandleAnimatedCursors();
  // Deque all game events
  DequeAllGameEvents(true);

  // handle sub sites..like BR Guns, BR Ammo, Armour, Misc...for WW Wait..since they are not true sub pages
  // and are not individual sites
  HandleWWWSubSites();
  UpdateStatusOfDisplayingBookMarks();

  // check if we need to reset new WWW mode
  CheckIfNewWWWW();

  if (guiCurrentLaptopMode != guiPreviousLaptopMode) {
    if (guiCurrentLaptopMode <= Enum95.LAPTOP_MODE_WWW) {
      fLoadPendingFlag = false;
    }

    if ((fMaximizingProgram == false) && (fMinizingProgram == false)) {
      if (guiCurrentLaptopMode <= Enum95.LAPTOP_MODE_WWW) {
        EnterNewLaptopMode();
        if ((fMaximizingProgram == false) && (fMinizingProgram == false)) {
          guiPreviousLaptopMode = guiCurrentLaptopMode;
        }
      } else {
        if (!fLoadPendingFlag) {
          EnterNewLaptopMode();
          guiPreviousLaptopMode = guiCurrentLaptopMode;
        }
      }
    }
  }
  if (fPausedReDrawScreenFlag) {
    fReDrawScreenFlag = true;
    fPausedReDrawScreenFlag = false;
  }

  if (fReDrawScreenFlag) {
    RenderLapTopImage();
    HighLightRegion(giCurrentRegion);
    RenderLaptop();
  }

  // are we about to leave laptop
  if (fExitingLaptopFlag) {
    if (fLoadPendingFlag == true) {
      fLoadPendingFlag = false;
      fExitDuringLoad = true;
    }
    LeaveLapTopScreen();
  }

  if (fExitingLaptopFlag == false) {
    // handle handles for laptop input stream
    HandleLapTopHandles();
  }

  // get keyboard input, handle it
  GetLaptopKeyboardInput();

  // check to see if new mail box needs to be displayed
  DisplayNewMailBox();
  CreateDestroyNewMailButton();

  // create various mouse regions that are global to laptop system
  CreateDestoryBookMarkRegions();
  CreateDestroyErrorButton();

  // check to see if error box needs to be displayed
  DisplayErrorBox();

  // check to see if buttons marked dirty
  CheckMarkButtonsDirtyFlag();

  // check to see if new mail box needs to be displayed
  ShouldNewMailBeDisplayed();

  // check to see if new mail box needs to be displayed
  ReDrawNewMailBox();

  // look for unread email
  LookForUnread();
  // Handle keyboard shortcuts...

  // mouse regions
  // HandleLapTopScreenMouseUi();
  // RenderButtons();
  // RenderButtonsFastHelp( );

  if ((fLoadPendingFlag == false) || (fNewMailFlag)) {
    // render buttons marked dirty
    RenderButtons();

    // render fast help 'quick created' buttons
    //		RenderFastHelp( );
    //	  RenderButtonsFastHelp( );
  }

  // show text on top of buttons
  if ((fMaximizingProgram == false) && (fMinizingProgram == false)) {
    DrawButtonText();
  }

  // check to see if bookmarks need to be displayed
  if (gfShowBookmarks) {
    if (fExitingLaptopFlag)
      gfShowBookmarks = false;
    else
      DisplayBookMarks();
  }

  // check to see if laod pending flag is set
  DisplayLoadPending();

  // check if we are showing message?
  DisplayWebBookMarkNotify();

  if ((fIntermediateReDrawFlag) || (fReDrawPostButtonRender)) {
    // rendering AFTER buttons and button text
    if ((fMaximizingProgram == false) && (fMinizingProgram == false)) {
      PostButtonRendering();
    }
  }
  // PrintBalance( );

  PrintDate();

  PrintBalance();

  PrintNumberOnTeam();
  DisplayTaskBarIcons();

  // handle if we are maximizing a program from a minimized state or vice versa
  HandleSlidingTitleBar();

  // flicker HD light as nessacary
  FlickerHDLight();

  // display power and HD lights
  ShowLights();

  // render frame rate
  DisplayFrameRate();

  // invalidate screen if redrawn
  if (fReDrawScreenFlag == true) {
    InvalidateRegion(0, 0, 640, 480);
    fReDrawScreenFlag = false;
  }

  ExecuteVideoOverlays();

  SaveBackgroundRects();
  //	RenderButtonsFastHelp();
  RenderFastHelp();

  // ex SAVEBUFFER queue
  ExecuteBaseDirtyRectQueue();
  ResetInterface();
  EndFrameBufferRender();
  return Enum26.LAPTOP_SCREEN;
}

function RenderLaptopPanel(): UINT32 {
  return 0;
}

function ExitLaptopMode(uiMode: UINT32): UINT32 {
  // Deallocate the previous mode that you were in.

  switch (uiMode) {
    case Enum95.LAPTOP_MODE_AIM:
      ExitAIM();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS:
      ExitAIMMembers();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX:
      ExitAimFacialIndex();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_SORTED_FILES:
      ExitAimSort();
      break;
    case Enum95.LAPTOP_MODE_AIM_MEMBERS_ARCHIVES:
      ExitAimArchives();
      break;
    case Enum95.LAPTOP_MODE_AIM_POLICIES:
      ExitAimPolicies();
      break;
    case Enum95.LAPTOP_MODE_AIM_LINKS:
      ExitAimLinks();
      break;
    case Enum95.LAPTOP_MODE_AIM_HISTORY:
      ExitAimHistory();
      break;

    case Enum95.LAPTOP_MODE_MERC:
      ExitMercs();
      break;
    case Enum95.LAPTOP_MODE_MERC_FILES:
      ExitMercsFiles();
      break;
    case Enum95.LAPTOP_MODE_MERC_ACCOUNT:
      ExitMercsAccount();
      break;
    case Enum95.LAPTOP_MODE_MERC_NO_ACCOUNT:
      ExitMercsNoAccount();
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R:
      ExitBobbyR();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_GUNS:
      ExitBobbyRGuns();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_AMMO:
      ExitBobbyRAmmo();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_ARMOR:
      ExitBobbyRArmour();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_MISC:
      ExitBobbyRMisc();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_USED:
      ExitBobbyRUsed();
      break;
    case Enum95.LAPTOP_MODE_BOBBY_R_MAILORDER:
      ExitBobbyRMailOrder();
      break;

    case Enum95.LAPTOP_MODE_CHAR_PROFILE:
      ExitCharProfile();
      break;
    case Enum95.LAPTOP_MODE_FLORIST:
      ExitFlorist();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_FLOWER_GALLERY:
      ExitFloristGallery();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_ORDERFORM:
      ExitFloristOrderForm();
      break;
    case Enum95.LAPTOP_MODE_FLORIST_CARD_GALLERY:
      ExitFloristCards();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE:
      ExitInsurance();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE_INFO:
      ExitInsuranceInfo();
      break;

    case Enum95.LAPTOP_MODE_INSURANCE_CONTRACT:
      ExitInsuranceContract();
      break;
    case Enum95.LAPTOP_MODE_INSURANCE_COMMENTS:
      ExitInsuranceComments();
      break;

    case Enum95.LAPTOP_MODE_FUNERAL:
      ExitFuneral();
      break;
    case Enum95.LAPTOP_MODE_SIRTECH:
      ExitSirTech();
      break;
    case Enum95.LAPTOP_MODE_FINANCES:
      ExitFinances();
      break;
    case Enum95.LAPTOP_MODE_PERSONNEL:
      ExitPersonnel();
      break;
    case Enum95.LAPTOP_MODE_HISTORY:
      ExitHistory();
      break;
    case Enum95.LAPTOP_MODE_FILES:
      ExitFiles();
      break;
    case Enum95.LAPTOP_MODE_EMAIL:
      ExitEmail();
      break;
    case Enum95.LAPTOP_MODE_BROKEN_LINK:
      ExitBrokenLink();
      break;

    case Enum95.LAPTOP_MODE_BOBBYR_SHIPMENTS:
      ExitBobbyRShipments();
      break;
  }

  if ((uiMode != Enum95.LAPTOP_MODE_NONE) && (uiMode < Enum95.LAPTOP_MODE_WWW)) {
    CreateDestroyMinimizeButtonForCurrentMode();
  }
  return true;
}

function CreateLaptopButtons(): UINT32 {
  memset(giLapTopButton, -1, sizeof(giLapTopButton));

  /*giLapTopButtonImage[ON_BUTTON]=  LoadButtonImage( "LAPTOP\\button.sti" ,-1,1,-1,0,-1 );
  giLapTopButton[ON_BUTTON] = QuickCreateButton( giLapTopButtonImage[ON_BUTTON], ON_X, ON_Y,
                                                                                 BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST,
                                                                                 (GUI_CALLBACK)BtnGenericMouseMoveButtonCallback, (GUI_CALLBACK)BtnOnCallback);
   */

  // the program buttons

  gLaptopButtonImage[0] = LoadButtonImage("LAPTOP\\buttonsforlaptop.sti", -1, 0, -1, 8, -1);
  gLaptopButton[0] = QuickCreateButton(gLaptopButtonImage[0], 29, 66, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, EmailRegionButtonCallback);
  CreateLaptopButtonHelpText(gLaptopButton[0], Enum376.LAPTOP_BN_HLP_TXT_VIEW_EMAIL);

  SpecifyButtonText(gLaptopButton[0], pLaptopIcons[0]);
  SpecifyButtonFont(gLaptopButton[0], FONT10ARIAL());
  SpecifyButtonTextOffsets(gLaptopButton[0], 30, 11, true);
  SpecifyButtonDownTextColors(gLaptopButton[0], 2, 0);
  SpecifyButtonUpTextColors(gLaptopButton[0], 2, 0);

  gLaptopButtonImage[1] = LoadButtonImage("LAPTOP\\buttonsforlaptop.sti", -1, 1, -1, 9, -1);
  gLaptopButton[1] = QuickCreateButton(gLaptopButtonImage[1], 29, 98, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, WWWRegionButtonCallback);
  CreateLaptopButtonHelpText(gLaptopButton[1], Enum376.LAPTOP_BN_HLP_TXT_BROWSE_VARIOUS_WEB_SITES);

  SpecifyButtonText(gLaptopButton[1], pLaptopIcons[1]);
  SpecifyButtonFont(gLaptopButton[1], FONT10ARIAL());
  SpecifyButtonTextOffsets(gLaptopButton[1], 30, 11, true);
  SpecifyButtonUpTextColors(gLaptopButton[1], 2, 0);
  SpecifyButtonDownTextColors(gLaptopButton[1], 2, 0);

  gLaptopButtonImage[2] = LoadButtonImage("LAPTOP\\buttonsforlaptop.sti", -1, 2, -1, 10, -1);
  gLaptopButton[2] = QuickCreateButton(gLaptopButtonImage[2], 29, 130, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, FilesRegionButtonCallback);
  CreateLaptopButtonHelpText(gLaptopButton[2], Enum376.LAPTOP_BN_HLP_TXT_VIEW_FILES_AND_EMAIL_ATTACHMENTS);

  SpecifyButtonText(gLaptopButton[2], pLaptopIcons[5]);
  SpecifyButtonFont(gLaptopButton[2], FONT10ARIAL());
  SpecifyButtonTextOffsets(gLaptopButton[2], 30, 11, true);
  SpecifyButtonUpTextColors(gLaptopButton[2], 2, 0);
  SpecifyButtonDownTextColors(gLaptopButton[2], 2, 0);

  gLaptopButtonImage[3] = LoadButtonImage("LAPTOP\\buttonsforlaptop.sti", -1, 3, -1, 11, -1);
  gLaptopButton[3] = QuickCreateButton(gLaptopButtonImage[3], 29, 194, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, PersonnelRegionButtonCallback);
  CreateLaptopButtonHelpText(gLaptopButton[3], Enum376.LAPTOP_BN_HLP_TXT_VIEW_TEAM_INFO);

  SpecifyButtonText(gLaptopButton[3], pLaptopIcons[3]);
  SpecifyButtonFont(gLaptopButton[3], FONT10ARIAL());
  SpecifyButtonTextOffsets(gLaptopButton[3], 30, 11, true);
  SpecifyButtonUpTextColors(gLaptopButton[3], 2, 0);
  SpecifyButtonDownTextColors(gLaptopButton[3], 2, 0);

  gLaptopButtonImage[4] = LoadButtonImage("LAPTOP\\buttonsforlaptop.sti", -1, 4, -1, 12, -1);
  gLaptopButton[4] = QuickCreateButton(gLaptopButtonImage[4], 29, 162, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, HistoryRegionButtonCallback);
  CreateLaptopButtonHelpText(gLaptopButton[4], Enum376.LAPTOP_BN_HLP_TXT_READ_LOG_OF_EVENTS);

  SpecifyButtonText(gLaptopButton[4], pLaptopIcons[4]);
  SpecifyButtonFont(gLaptopButton[4], FONT10ARIAL());
  SpecifyButtonTextOffsets(gLaptopButton[4], 30, 11, true);
  SpecifyButtonUpTextColors(gLaptopButton[4], 2, 0);
  SpecifyButtonDownTextColors(gLaptopButton[4], 2, 0);

  gLaptopButtonImage[5] = LoadButtonImage("LAPTOP\\buttonsforlaptop.sti", -1, 5, -1, 13, -1);
  gLaptopButton[5] = QuickCreateButton(gLaptopButtonImage[5], 29, 226 + 15, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, FinancialRegionButtonCallback);
  CreateLaptopButtonHelpText(gLaptopButton[5], Enum376.LAPTOP_BN_HLP_TXT_VIEW_FINANCIAL_SUMMARY_AND_HISTORY);

  SpecifyButtonText(gLaptopButton[5], pLaptopIcons[2]);
  SpecifyButtonFont(gLaptopButton[5], FONT10ARIAL());
  SpecifyButtonTextOffsets(gLaptopButton[5], 30, 11, true);
  SpecifyButtonUpTextColors(gLaptopButton[5], 2, 0);
  SpecifyButtonDownTextColors(gLaptopButton[5], 2, 0);

  gLaptopButtonImage[6] = LoadButtonImage("LAPTOP\\buttonsforlaptop.sti", -1, 6, -1, 14, -1);
  gLaptopButton[6] = QuickCreateButton(gLaptopButtonImage[6], 29, 371 + 7, // DEF: was 19
                                       BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, BtnOnCallback);
  CreateLaptopButtonHelpText(gLaptopButton[6], Enum376.LAPTOP_BN_HLP_TXT_CLOSE_LAPTOP);

  SpecifyButtonText(gLaptopButton[6], pLaptopIcons[6]);
  SpecifyButtonFont(gLaptopButton[6], FONT10ARIAL());
  SpecifyButtonTextOffsets(gLaptopButton[6], 25, 11, true);
  SpecifyButtonUpTextColors(gLaptopButton[6], 2, 0);
  SpecifyButtonDownTextColors(gLaptopButton[6], 2, 0);

  // define the cursor
  SetButtonCursor(gLaptopButton[0], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(gLaptopButton[1], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(gLaptopButton[2], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(gLaptopButton[3], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(gLaptopButton[4], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(gLaptopButton[5], Enum317.CURSOR_LAPTOP_SCREEN);
  SetButtonCursor(gLaptopButton[6], Enum317.CURSOR_LAPTOP_SCREEN);

  return true;
}

function DeleteLapTopButtons(): void {
  let cnt: UINT32;
  /*	for ( cnt = 0; cnt < MAX_BUTTON_COUNT; cnt++ )
          {
                  if (giLapTopButton[ cnt ] != -1 )
                  {
                          RemoveButton( giLapTopButton[ cnt ] );
                  }
          }


          for ( cnt = 0; cnt < MAX_BUTTON_COUNT; cnt++ )
          {
                  UnloadButtonImage( giLapTopButtonImage[ cnt ] );
          }

  */
  for (cnt = 0; cnt < 7; cnt++) {
    RemoveButton(gLaptopButton[cnt]);
    UnloadButtonImage(gLaptopButtonImage[cnt]);
  }
}

function BtnOnCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON))
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
    InvalidateRegion(0, 0, 640, 480);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      if (HandleExit()) {
        //			 btn->uiFlags&=~(BUTTON_CLICKED_ON);
        fExitingLaptopFlag = true;
        InvalidateRegion(0, 0, 640, 480);
      }
    }
    btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
  }
}

export function LeaveLapTopScreen(): boolean {
  if (ExitLaptopDone()) {
    // exit screen is set
    // set new screen
    // if( ( LaptopSaveInfo.gfNewGameLaptop != TRUE ) || !( AnyMercsHired() ) )
    //	{
    SetLaptopExitScreen(Enum26.MAP_SCREEN);
    //}
    // if( ( LaptopSaveInfo.gfNewGameLaptop )&&( AnyMercsHired() ) )
    //{
    //	SetLaptopExitScreen( GAME_SCREEN );
    //	}

    if (gfAtLeastOneMercWasHired == true) {
      if (LaptopSaveInfo.gfNewGameLaptop) {
        LaptopSaveInfo.gfNewGameLaptop = false;
        fExitingLaptopFlag = true;
        /*guiExitScreen = GAME_SCREEN; */
        InitNewGame(false);
        gfDontStartTransitionFromLaptop = true;
        /*InitHelicopterEntranceByMercs( );
        fFirstTimeInGameScreen = TRUE;*/
        return true;
      }
    } else {
      gfDontStartTransitionFromLaptop = true;
    }

    SetPendingNewScreen(guiExitScreen);

    if (!gfDontStartTransitionFromLaptop) {
      let SrcRect1: SGPRect = createSGPRect();
      let SrcRect2: SGPRect = createSGPRect();
      let DstRect: SGPRect = createSGPRect();
      let iPercentage: INT32;
      let iScalePercentage: INT32;
      let iFactor: INT32;
      let uiStartTime: UINT32;
      let uiTimeRange: UINT32;
      let uiCurrTime: UINT32;
      let iX: INT32;
      let iY: INT32;
      let iWidth: INT32;
      let iHeight: INT32;
      let iRealPercentage: INT32;

      gfDontStartTransitionFromLaptop = true;
      SetCurrentCursorFromDatabase(VIDEO_NO_CURSOR);
      // Step 1:  Build the laptop image into the save buffer.
      RestoreBackgroundRects();
      RenderLapTopImage();
      HighLightRegion(giCurrentRegion);
      RenderLaptop();
      RenderButtons();
      PrintDate();
      PrintBalance();
      PrintNumberOnTeam();
      ShowLights();

      // Step 2:  The mapscreen image is in the EXTRABUFFER, and laptop is in the SAVEBUFFER
      //         Start transitioning the screen.
      DstRect.iLeft = 0;
      DstRect.iTop = 0;
      DstRect.iRight = 640;
      DstRect.iBottom = 480;
      uiTimeRange = 1000;
      iPercentage = iRealPercentage = 100;
      uiStartTime = GetJA2Clock();
      BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 640, 480);
      PlayJA2SampleFromFile("SOUNDS\\Laptop power down (8-11).wav", RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
      while (iRealPercentage > 0) {
        BlitBufferToBuffer(guiEXTRABUFFER, FRAME_BUFFER, 0, 0, 640, 480);

        uiCurrTime = GetJA2Clock();
        iPercentage = (uiCurrTime - uiStartTime) * 100 / uiTimeRange;
        iPercentage = Math.min(iPercentage, 100);
        iPercentage = 100 - iPercentage;

        iRealPercentage = iPercentage;

        // Factor the percentage so that it is modified by a gravity falling acceleration effect.
        iFactor = (iPercentage - 50) * 2;
        if (iPercentage < 50)
          iPercentage = (iPercentage + iPercentage * iFactor * 0.01 + 0.5);
        else
          iPercentage = (iPercentage + (100 - iPercentage) * iFactor * 0.01 + 0.5);

        // Mapscreen source rect
        SrcRect1.iLeft = 464 * iPercentage / 100;
        SrcRect1.iRight = 640 - 163 * iPercentage / 100;
        SrcRect1.iTop = 417 * iPercentage / 100;
        SrcRect1.iBottom = 480 - 55 * iPercentage / 100;
        // Laptop source rect
        if (iPercentage < 99)
          iScalePercentage = 10000 / (100 - iPercentage);
        else
          iScalePercentage = 5333;
        iWidth = 12 * iScalePercentage / 100;
        iHeight = 9 * iScalePercentage / 100;
        iX = 472 - (472 - 320) * iScalePercentage / 5333;
        iY = 424 - (424 - 240) * iScalePercentage / 5333;

        SrcRect2.iLeft = iX - iWidth / 2;
        SrcRect2.iRight = SrcRect2.iLeft + iWidth;
        SrcRect2.iTop = iY - iHeight / 2;
        SrcRect2.iBottom = SrcRect2.iTop + iHeight;
        // SrcRect2.iLeft = 464 - 464 * iScalePercentage / 100;
        // SrcRect2.iRight = 477 + 163 * iScalePercentage / 100;
        // SrcRect2.iTop = 417 - 417 * iScalePercentage / 100;
        // SrcRect2.iBottom = 425 + 55 * iScalePercentage / 100;

        // BltStretchVideoSurface( FRAME_BUFFER, guiEXTRABUFFER, 0, 0, 0, &SrcRect1, &DstRect );

        // SetFont( FONT10ARIAL );
        // SetFontForeground( FONT_YELLOW );
        // SetFontShadow( FONT_NEARBLACK );
        // mprintf( 10, 10, L"%d -> %d", iRealPercentage, iPercentage );
        // pDestBuf = LockVideoSurface( FRAME_BUFFER, &uiDestPitchBYTES );
        // SetClippingRegionAndImageWidth( uiDestPitchBYTES, 0, 0, 640, 480 );
        // RectangleDraw( TRUE, SrcRect1.iLeft, SrcRect1.iTop, SrcRect1.iRight, SrcRect1.iBottom, Get16BPPColor( FROMRGB( 255, 100, 0 ) ), pDestBuf );
        // RectangleDraw( TRUE, SrcRect2.iLeft, SrcRect2.iTop, SrcRect2.iRight, SrcRect2.iBottom, Get16BPPColor( FROMRGB( 100, 255, 0 ) ), pDestBuf );
        // UnLockVideoSurface( FRAME_BUFFER );

        BltStretchVideoSurface(FRAME_BUFFER, guiSAVEBUFFER, 0, 0, 0, addressof(DstRect), addressof(SrcRect2));
        InvalidateScreen();
        // gfPrintFrameBuffer = TRUE;
        RefreshScreen(null);
      }
    }
  }
  return true;
}

function HandleExit(): boolean {
  //	static BOOLEAN fSentImpWarningAlready = FALSE;

  // remind player about IMP
  if (LaptopSaveInfo.gfNewGameLaptop != 0) {
    if (!AnyMercsHired()) {
      // AddEmail(0,1, GAME_HELP, GetWorldTotalMin( ) );
      // fExitingLaptopFlag = FALSE;
      // return( FALSE );
    }
  }

  // new game, send email
  if (LaptopSaveInfo.gfNewGameLaptop != 0) {
    // Set an event to send this email ( day 2 8:00-12:00 )
    if ((LaptopSaveInfo.fIMPCompletedFlag == false) && (LaptopSaveInfo.fSentImpWarningAlready == false)) {
      AddFutureDayStrategicEvent(Enum132.EVENT_HAVENT_MADE_IMP_CHARACTER_EMAIL, (8 + Random(4)) * 60, 0, 1);

      /*
       Moved to an event that gets triggered the next day: HaventMadeImpMercEmailCallBack()

                              LaptopSaveInfo.fSentImpWarningAlready = TRUE;
                              AddEmail(IMP_EMAIL_AGAIN,IMP_EMAIL_AGAIN_LENGTH,1, GetWorldTotalMin( ) );
      */
      fExitingLaptopFlag = true;

      return false;
    }
  }

  return true;
}

export function HaventMadeImpMercEmailCallBack(): void {
  // if the player STILL hasnt made an imp merc yet
  if ((LaptopSaveInfo.fIMPCompletedFlag == false) && (LaptopSaveInfo.fSentImpWarningAlready == false)) {
    LaptopSaveInfo.fSentImpWarningAlready = true;
    AddEmail(IMP_EMAIL_AGAIN, IMP_EMAIL_AGAIN_LENGTH, 1, GetWorldTotalMin());
  }
}

function CreateLapTopMouseRegions(): boolean {
  // define regions

  // the entire laptop display region
  MSYS_DefineRegion(addressof(gLapTopScreenRegion), (LaptopScreenRect.iLeft), (LaptopScreenRect.iTop), (LaptopScreenRect.iRight), (LaptopScreenRect.iBottom), MSYS_PRIORITY_NORMAL + 1, Enum317.CURSOR_LAPTOP_SCREEN, ScreenRegionMvtCallback, LapTopScreenCallBack);

  // MSYS_AddRegion(&gLapTopScreenRegion);
  return true;
}

function DeleteLapTopMouseRegions(): boolean {
  MSYS_RemoveRegion(addressof(gLapTopScreenRegion));

  return true;
}

function FinancialRegionButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON))
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      if (giCurrentRegion != Enum92.FINANCIAL_REGION)
        giOldRegion = giCurrentRegion;
      giCurrentRegion = Enum92.FINANCIAL_REGION;
      if (gfShowBookmarks) {
        gfShowBookmarks = false;
        fReDrawScreenFlag = true;
      }
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FINANCES;

      UpdateListToReflectNewProgramOpened(Enum93.LAPTOP_PROGRAM_FINANCES);
    }
  }
}

function PersonnelRegionButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON))
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      if (giCurrentRegion != Enum92.PERSONNEL_REGION)
        giOldRegion = giCurrentRegion;
      giCurrentRegion = Enum92.PERSONNEL_REGION;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_PERSONNEL;
      if (gfShowBookmarks) {
        gfShowBookmarks = false;
        fReDrawScreenFlag = true;
      }
      RestoreOldRegion(giOldRegion);
      HighLightRegion(giCurrentRegion);
      gfShowBookmarks = false;

      UpdateListToReflectNewProgramOpened(Enum93.LAPTOP_PROGRAM_PERSONNEL);
    }
  }
}

function EmailRegionButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON))
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      // set old region
      if (giCurrentRegion != Enum92.EMAIL_REGION)
        giOldRegion = giCurrentRegion;

      // stop showing WWW bookmarks
      if (gfShowBookmarks) {
        gfShowBookmarks = false;
      }

      // set current highlight region
      giCurrentRegion = Enum92.EMAIL_REGION;

      // restore old region
      RestoreOldRegion(giOldRegion);

      // set up current mode
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_EMAIL;

      UpdateListToReflectNewProgramOpened(Enum93.LAPTOP_PROGRAM_MAILER);

      // highlight current region
      HighLightRegion(giCurrentRegion);

      // redraw screen
      fReDrawScreenFlag = true;
    }
  }
}

function WWWRegionButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON))
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON))
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      if (giCurrentRegion != Enum92.WWW_REGION)
        giOldRegion = giCurrentRegion;
      if (!fNewWWW)
        fNewWWWDisplay = false;

      // reset show bookmarks
      if (guiCurrentLaptopMode < Enum95.LAPTOP_MODE_WWW) {
        gfShowBookmarks = false;
        fShowBookmarkInfo = true;
      } else {
        gfShowBookmarks = !gfShowBookmarks;
      }

      if ((gfShowBookmarks) && (!fNewWWW)) {
        fReDrawScreenFlag = true;
        fNewWWWDisplay = false;
      } else if (fNewWWW) {
        // no longer a new WWW mode
        fNewWWW = false;

        // new WWW to display
        fNewWWWDisplay = true;

        // make sure program is maximized
        if (gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_WEB_BROWSER] == Enum94.LAPTOP_PROGRAM_OPEN) {
          // re render laptop region
          RenderLapTopImage();

          // re render background
          DrawDeskTopBackground();
        }
      }
      giCurrentRegion = Enum92.WWW_REGION;
      RestoreOldRegion(giOldRegion);
      if (guiCurrentWWWMode != Enum95.LAPTOP_MODE_NONE)
        guiCurrentLaptopMode = guiCurrentWWWMode;
      else
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_WWW;
      UpdateListToReflectNewProgramOpened(Enum93.LAPTOP_PROGRAM_WEB_BROWSER);
      HighLightRegion(giCurrentRegion);
      fReDrawScreenFlag = true;
    }
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      // nothing yet

      if (giCurrentRegion != Enum92.WWW_REGION)
        giOldRegion = giCurrentRegion;

      giCurrentRegion = Enum92.WWW_REGION;

      RestoreOldRegion(giOldRegion);

      if (guiCurrentWWWMode != Enum95.LAPTOP_MODE_NONE)
        guiCurrentLaptopMode = guiCurrentWWWMode;
      else
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_WWW;

      HighLightRegion(giCurrentRegion);

      fReDrawScreenFlag = true;
    }
  }
}

function HistoryRegionButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON))
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      // if not in history, update to the fact
      if (giCurrentRegion != Enum92.HISTORY_REGION)
        giOldRegion = giCurrentRegion;
      if (gfShowBookmarks) {
        // stop showing WWW bookmarks
        gfShowBookmarks = false;
      }

      // current region is history
      giCurrentRegion = Enum92.HISTORY_REGION;

      // restore old region area
      RestoreOldRegion(giOldRegion);

      // set mode to history
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_HISTORY;

      // hightlight current icon
      HighLightRegion(giCurrentRegion);

      UpdateListToReflectNewProgramOpened(Enum93.LAPTOP_PROGRAM_HISTORY);

      gfShowBookmarks = false;

      // redraw screen
      fReDrawScreenFlag = true;
    }
  }
}
function FilesRegionButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON))
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      // reset old region
      if (giCurrentRegion != Enum92.FILES_REGION)
        giOldRegion = giCurrentRegion;

      // stop showing WWW bookmarks
      if (gfShowBookmarks) {
        gfShowBookmarks = false;
        fReDrawScreenFlag = true;
      }

      // set new region
      giCurrentRegion = Enum92.FILES_REGION;

      // restore old highlight region
      RestoreOldRegion(giOldRegion);

      // highlight new region
      HighLightRegion(giCurrentRegion);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FILES;

      UpdateListToReflectNewProgramOpened(Enum93.LAPTOP_PROGRAM_FILES);

      // redraw screen
      fReDrawScreenFlag = true;
    }
  }
}

function HandleLapTopScreenMouseUi(): void {
  if (gEmailRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    giHighLightRegion = Enum92.EMAIL_REGION;
  } else if (gPersonnelRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    giHighLightRegion = Enum92.PERSONNEL_REGION;
  } else if (gFinancialRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    giHighLightRegion = Enum92.FINANCIAL_REGION;
  } else if (gWWWRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    giHighLightRegion = Enum92.WWW_REGION;
  } else if (gFilesRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    giHighLightRegion = Enum92.FILES_REGION;
  } else if (gHistoryRegion.uiFlags & MSYS_MOUSE_IN_AREA) {
    giHighLightRegion = Enum92.HISTORY_REGION;
  } else
    giHighLightRegion = Enum92.NO_REGION;
  DrawHighLightRegionBox();
}

function DrawHighLightRegionBox(): void {
  return;
}

function RestoreOldRegion(iOldRegion: INT32): void {
  return;
}

function HighLightRegion(iCurrentRegion: INT32): void {
  return;
}

function HandleAnimatedButtons(): void {
  return;
}
function AnimateButton(uiIconID: UINT32, usX: UINT16, usY: UINT16): void {
  return;
}

function WWWRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let iFrame: INT32 = 0;
  let iDifference: INT32 = 0;
  let hLapTopIconHandle: HVOBJECT;
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    iBaseTime = 0;
    iFrame = 0;
    GetVideoObject(addressof(hLapTopIconHandle), guiWWWICON);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, iFrame, LAPTOP_ICONS_X, LAPTOP_ICONS_WWW_Y, VO_BLT_SRCTRANSPARENCY, null);
    DrawLapTopText();
    HighLightRegion(giCurrentRegion);
    InvalidateRegion(0, 0, 640, 480);
  }
}

function EmailRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let iFrame: INT32 = 0;
  let iDifference: INT32 = 0;
  let hLapTopIconHandle: HVOBJECT;
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    iBaseTime = 0;
    iFrame = 0;
    DrawLapTopText();
    GetVideoObject(addressof(hLapTopIconHandle), guiMAILICON);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, iFrame, LAPTOP_ICONS_X, LAPTOP_ICONS_MAIL_Y, VO_BLT_SRCTRANSPARENCY, null);
    if (fUnReadMailFlag) {
      GetVideoObject(addressof(hLapTopIconHandle), guiUNREAD);
      BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, LAPTOP_ICONS_X + CHECK_X, LAPTOP_ICONS_MAIL_Y + CHECK_Y, VO_BLT_SRCTRANSPARENCY, null);
    }
    DrawLapTopText();
    HighLightRegion(giCurrentRegion);
    InvalidateRegion(0, 0, 640, 480);
  }
}

function FinancialRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let iFrame: INT32 = 0;
  let iDifference: INT32 = 0;
  let hLapTopIconHandle: HVOBJECT;
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    iBaseTime = 0;
    iFrame = 0;
    GetVideoObject(addressof(hLapTopIconHandle), guiFINANCIALICON);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, iFrame, LAPTOP_ICONS_X - 4, LAPTOP_ICONS_FINANCIAL_Y, VO_BLT_SRCTRANSPARENCY, null);
    DrawLapTopText();
    HighLightRegion(giCurrentRegion);
    InvalidateRegion(0, 0, 640, 480);
  }
}

function HistoryRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let iFrame: INT32 = 0;
  let iDifference: INT32 = 0;
  let hLapTopIconHandle: HVOBJECT;
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    iBaseTime = 0;
    iFrame = 0;

    GetVideoObject(addressof(hLapTopIconHandle), guiHISTORYICON);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, iFrame, LAPTOP_ICONS_X, LAPTOP_ICONS_HISTORY_Y, VO_BLT_SRCTRANSPARENCY, null);
    DrawLapTopText();
    HighLightRegion(giCurrentRegion);
    InvalidateRegion(0, 0, 640, 480);
  }
}

function FilesRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let iFrame: INT32 = 0;
  let iDifference: INT32 = 0;
  let hLapTopIconHandle: HVOBJECT;
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    iBaseTime = 0;
    iFrame = 0;
    GetVideoObject(addressof(hLapTopIconHandle), guiFILESICON);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, iFrame, LAPTOP_ICONS_X, LAPTOP_ICONS_FILES_Y + 7, VO_BLT_SRCTRANSPARENCY, null);
    DrawLapTopText();
    HighLightRegion(giCurrentRegion);
    InvalidateRegion(0, 0, 640, 480);
  }
}

function PersonnelRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let iFrame: INT32 = 0;
  let iDifference: INT32 = 0;
  let hLapTopIconHandle: HVOBJECT;
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    iBaseTime = 0;
    iFrame = 0;

    GetVideoObject(addressof(hLapTopIconHandle), guiPERSICON);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, iFrame, LAPTOP_ICONS_X, LAPTOP_ICONS_PERSONNEL_Y, VO_BLT_SRCTRANSPARENCY, null);
    DrawLapTopText();
    HighLightRegion(giCurrentRegion);
    InvalidateRegion(0, 0, 640, 480);
  }
}

function CheckIfMouseLeaveScreen(): void {
  let MousePos: POINT = createPoint();
  GetCursorPos(addressof(MousePos));
  if ((MousePos.x > LAPTOP_SCREEN_LR_X) || (MousePos.x < LAPTOP_UL_X) || (MousePos.y < LAPTOP_UL_Y) || (MousePos.y > LAPTOP_SCREEN_LR_Y)) {
    guiCurrentLapTopCursor = Enum97.LAPTOP_PANEL_CURSOR;
  }
}
function ScreenRegionMvtCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }
  /*if (iReason == MSYS_CALLBACK_REASON_MOVE)
  {
          guiCurrentLapTopCursor=LAPTOP_SCREEN_CURSOR;
  }
if (iReason == MSYS_CALLBACK_REASON_LOST_MOUSE )
  {
CheckIfMouseLeaveScreen();
  }
  */
}

export function ReDrawHighLight(): void {
  HighLightRegion(giCurrentRegion);
  return;
}

function DrawButtonText(): void {
  if (fErrorFlag)
    DrawTextOnErrorButton();
  switch (guiCurrentLaptopMode) {
    case Enum95.LAPTOP_MODE_EMAIL:
      DisplayEmailHeaders();
      break;
  }
  return;
}

function InitBookMarkList(): void {
  // sets bookmark list to -1
  memset(LaptopSaveInfo.iBookMarkList, -1, sizeof(LaptopSaveInfo.iBookMarkList));
  return;
}

export function SetBookMark(iBookId: INT32): void {
  // find first empty spot, set to iBookId
  let iCounter: INT32 = 0;
  if (iBookId != -2) {
    while (LaptopSaveInfo.iBookMarkList[iCounter] != -1) {
      // move trhough list until empty
      if (LaptopSaveInfo.iBookMarkList[iCounter] == iBookId) {
        // found it, return
        return;
      }
      iCounter++;
    }
    LaptopSaveInfo.iBookMarkList[iCounter] = iBookId;
  }
  return;
}

function RemoveBookMark(iBookId: INT32): boolean {
  let iCounter: INT32 = 0;

  // Loop through the bookmarks to get to the desired bookmark
  while (LaptopSaveInfo.iBookMarkList[iCounter] != iBookId) {
    iCounter++;
  }

  // Did we find the right one?
  if (LaptopSaveInfo.iBookMarkList[iCounter] == iBookId) {
    // Reset it
    LaptopSaveInfo.iBookMarkList[iCounter] = -1;

    // return true signifing that we found it
    return true;
  }

  // nope, we didnt find it.
  return false;
}

function LoadBookmark(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // grab download bars too

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\downloadtop.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiDOWNLOADTOP))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\downloadmid.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiDOWNLOADMID))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\downloadbot.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiDOWNLOADBOT))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\bookmarktop.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBOOKTOP))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\bookmarkmiddle.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBOOKMID))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\webpages.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBOOKMARK))) {
    return false;
  }

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\hilite.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBOOKHIGH))) {
    return false;
  }
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Bookmarkbottom.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBOOKBOT))) {
    return false;
  }

  return true;
}

function DisplayBookMarks(): void {
  // will look at bookmarklist and set accordingly
  let iCounter: INT32 = 1;
  // load images
  let hLapTopIconHandle: HVOBJECT;
  // laptop icons
  let sX: INT16;
  let sY: INT16;

  // check if we are maximizing or minimizing.. if so, do not display
  if ((fMaximizingProgram == true) || (fMinizingProgram == true)) {
    return;
  }

  // font stuff
  SetFont(BOOK_FONT());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // dirty and print to screen
  //	gprintfdirty( sX, sY, pBookmarkTitle[0]);
  //	mprintf(sX, sY,pBookmarkTitle[0] );

  // set buffer
  SetFontDestBuffer(FRAME_BUFFER, BOOK_X, BOOK_TOP_Y, BOOK_X + BOOK_WIDTH - 10, 480, false);

  // blt in book mark background
  while (LaptopSaveInfo.iBookMarkList[iCounter - 1] != -1) {
    if (iHighLightBookLine == iCounter - 1) {
      GetVideoObject(addressof(hLapTopIconHandle), guiBOOKHIGH);
      BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, BOOK_X, BOOK_TOP_Y + (iCounter * (BOOK_HEIGHT + 6)) + 6, VO_BLT_SRCTRANSPARENCY, null);
    } else {
      GetVideoObject(addressof(hLapTopIconHandle), guiBOOKMARK);
      BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, BOOK_X, BOOK_TOP_Y + (iCounter * (BOOK_HEIGHT + 6)) + 6, VO_BLT_SRCTRANSPARENCY, null);
    }

    if (iHighLightBookLine == iCounter - 1) {
      // blit in text
      SetFontForeground(FONT_WHITE);
      SetFontBackground(FONT_BLACK);
    } else {
      // blit in text
      SetFontForeground(FONT_BLACK);
      SetFontBackground(FONT_BLACK);
    }

    FindFontCenterCoordinates(BOOK_X + 3, (BOOK_TOP_Y + 2 + (iCounter * (BOOK_HEIGHT + 6)) + 6), BOOK_WIDTH - 3, BOOK_HEIGHT + 6, pBookMarkStrings[LaptopSaveInfo.iBookMarkList[iCounter - 1]], BOOK_FONT(), addressof(sX), addressof(sY));

    mprintf(sX, sY, pBookMarkStrings[LaptopSaveInfo.iBookMarkList[iCounter - 1]]);
    iCounter++;
  }

  // blit one more

  if (iHighLightBookLine == iCounter - 1) {
    GetVideoObject(addressof(hLapTopIconHandle), guiBOOKHIGH);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, BOOK_X, BOOK_TOP_Y + (iCounter * (BOOK_HEIGHT + 6)) + 6, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    GetVideoObject(addressof(hLapTopIconHandle), guiBOOKMARK);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, BOOK_X, BOOK_TOP_Y + (iCounter * (BOOK_HEIGHT + 6)) + 6, VO_BLT_SRCTRANSPARENCY, null);
  }

  if (iHighLightBookLine == iCounter - 1) {
    // blit in text
    SetFontForeground(FONT_WHITE);
    SetFontBackground(FONT_BLACK);
  } else {
    // blit in text
    SetFontForeground(FONT_BLACK);
    SetFontBackground(FONT_BLACK);
  }
  FindFontCenterCoordinates(BOOK_X + 3, (BOOK_TOP_Y + 2 + (iCounter * (BOOK_HEIGHT + 6)) + 6), BOOK_WIDTH - 3, BOOK_HEIGHT + 6, pBookMarkStrings[Enum98.CANCEL_STRING], BOOK_FONT(), addressof(sX), addressof(sY));
  mprintf(sX, sY, pBookMarkStrings[Enum98.CANCEL_STRING]);
  iCounter++;

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  // GetVideoObject(&hLapTopIconHandle, guiBOOKBOT);
  // BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0,BOOK_X, 6+BOOK_TOP_Y+(iCounter)*BOOK_HEIGHT, VO_BLT_SRCTRANSPARENCY,NULL);

  /*if(fNewWWWDisplay)
ScrollDisplayText(BOOK_TOP_Y+2+((iCounter)*BOOK_HEIGHT)+6);
  else
*/ InvalidateRegion(BOOK_X, BOOK_TOP_Y + ((iCounter)*BOOK_HEIGHT) + 12, BOOK_X + BOOK_WIDTH, BOOK_TOP_Y + ((iCounter + 1) * BOOK_HEIGHT) + 16);
  SetFontShadow(DEFAULT_SHADOW);

  InvalidateRegion(BOOK_X, BOOK_TOP_Y, BOOK_X + BOOK_WIDTH, BOOK_TOP_Y + (iCounter + 6) * BOOK_HEIGHT + 16);
  return;
}

function RemoveBookmark(iBookId: INT32): void {
  let iCounter: INT32 = 0;
  if (iBookId == -2)
    return;
  while (LaptopSaveInfo.iBookMarkList[iCounter] != -1) {
    if (LaptopSaveInfo.iBookMarkList[iCounter] == iBookId) {
      // found, move everyone back
      for (iCounter = iCounter + 1; iCounter < MAX_BOOKMARKS; iCounter++) {
        LaptopSaveInfo.iBookMarkList[iCounter - 1] = LaptopSaveInfo.iBookMarkList[iCounter];
      }
      return;
    }
    iCounter++;
  }
  return;
}

function DeleteBookmark(): void {
  DeleteVideoObjectFromIndex(guiBOOKTOP);
  DeleteVideoObjectFromIndex(guiBOOKMID);
  DeleteVideoObjectFromIndex(guiBOOKHIGH);
  DeleteVideoObjectFromIndex(guiBOOKBOT);
  DeleteVideoObjectFromIndex(guiBOOKMARK);

  DeleteVideoObjectFromIndex(guiDOWNLOADTOP);
  DeleteVideoObjectFromIndex(guiDOWNLOADMID);
  DeleteVideoObjectFromIndex(guiDOWNLOADBOT);
}

function ScrollDisplayText(iY: INT32): void {
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let sCurX: INT16;
  let sY: INT16 = iY;

  // if we are just enetering, set basetime to current clock value
  if (iBaseTime == 0)
    iBaseTime = GetJA2Clock();

  // long enough time has passed, shift string
  if (GetJA2Clock() - iBaseTime > SCROLL_DIFFERENCE) {
    // reset postion, if scrolled too far
    if (sCurX < SCROLL_MIN)
      sCurX = BOOK_X + BOOK_WIDTH;
    else
      sCurX--;

    // reset base time
    iBaseTime = GetJA2Clock();
  }

  // font stuff
  SetFontDestBuffer(FRAME_BUFFER, BOOK_X, 0, BOOK_X + BOOK_WIDTH, 480, false);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  // print the scrolling string for bookmarks
  mprintf(sCurX, iY, pBookmarkTitle[1]);

  // reset buffer
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  // invalidate region
  InvalidateRegion(BOOK_X, iY, BOOK_X + BOOK_WIDTH, iY + BOOK_HEIGHT);
}
function CreateBookMarkMouseRegions(): void {
  let iCounter: INT32 = 0;
  // creates regions based on number of entries
  while (LaptopSaveInfo.iBookMarkList[iCounter] != -1) {
    MSYS_DefineRegion(addressof(gBookmarkMouseRegions[iCounter]), BOOK_X, (BOOK_TOP_Y + ((iCounter + 1) * (BOOK_HEIGHT + 6)) + 6), BOOK_X + BOOK_WIDTH, (BOOK_TOP_Y + ((iCounter + 2) * (BOOK_HEIGHT + 6)) + 6), MSYS_PRIORITY_HIGHEST - 2, Enum317.CURSOR_LAPTOP_SCREEN, BookmarkMvtCallBack, BookmarkCallBack);
    // MSYS_AddRegion(&gBookmarkMouseRegions[iCounter]);
    MSYS_SetRegionUserData(addressof(gBookmarkMouseRegions[iCounter]), 0, iCounter);
    MSYS_SetRegionUserData(addressof(gBookmarkMouseRegions[iCounter]), 1, 0);

    // Create the regions help text
    CreateBookMarkHelpText(addressof(gBookmarkMouseRegions[iCounter]), LaptopSaveInfo.iBookMarkList[iCounter]);

    iCounter++;
  }
  // now add one more
  // for the cancel button
  MSYS_DefineRegion(addressof(gBookmarkMouseRegions[iCounter]), BOOK_X, (BOOK_TOP_Y + ((iCounter + 1) * (BOOK_HEIGHT + 6)) + 6), BOOK_X + BOOK_WIDTH, (BOOK_TOP_Y + ((iCounter + 2) * (BOOK_HEIGHT + 6)) + 6), MSYS_PRIORITY_HIGHEST - 2, Enum317.CURSOR_LAPTOP_SCREEN, BookmarkMvtCallBack, BookmarkCallBack);
  // MSYS_AddRegion(&gBookmarkMouseRegions[iCounter]);
  MSYS_SetRegionUserData(addressof(gBookmarkMouseRegions[iCounter]), 0, iCounter);
  MSYS_SetRegionUserData(addressof(gBookmarkMouseRegions[iCounter]), 1, Enum98.CANCEL_STRING);
}

function DeleteBookmarkRegions(): void {
  let iCounter: INT32 = 0;
  // deletes bookmark regions
  while (LaptopSaveInfo.iBookMarkList[iCounter] != -1) {
    MSYS_RemoveRegion(addressof(gBookmarkMouseRegions[iCounter]));
    iCounter++;
  }

  // now one for the cancel
  MSYS_RemoveRegion(addressof(gBookmarkMouseRegions[iCounter]));
}

function CreateDestoryBookMarkRegions(): void {
  // checks to see if a bookmark needs to be created or destroyed
  /* static */ let fOldShowBookmarks: boolean = false;

  if ((gfShowBookmarks) && (!fOldShowBookmarks)) {
    // create regions
    CreateBookMarkMouseRegions();
    fOldShowBookmarks = true;
  } else if ((!gfShowBookmarks) && (fOldShowBookmarks)) {
    // destroy bookmarks
    DeleteBookmarkRegions();
    fOldShowBookmarks = false;
  }
}

function BookmarkCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let iCount: INT32;

  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }

  // we are in process of loading
  if (fLoadPendingFlag == true) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iCount = MSYS_GetRegionUserData(pRegion, 0);
    if (MSYS_GetRegionUserData(pRegion, 1) == Enum98.CANCEL_STRING) {
      gfShowBookmarks = false;
      fReDrawScreenFlag = true;
    }
    if (LaptopSaveInfo.iBookMarkList[iCount] != -1) {
      GoToWebPage(LaptopSaveInfo.iBookMarkList[iCount]);
    } else {
      return;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    iCount = MSYS_GetRegionUserData(pRegion, 0);
  }
  return;
}

export function GoToWebPage(iPageId: INT32): void {
  // if it is raining, popup a warning first saying connection time may be slow
  if (IsItRaining()) {
    if (giRainDelayInternetSite == -1) {
      DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, pErrorStrings[4], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, InternetRainDelayMessageBoxCallBack);
      giRainDelayInternetSite = iPageId;
      return;
    }
  } else
    giRainDelayInternetSite = -1;

  switch (iPageId) {
    case Enum98.AIM_BOOKMARK:
      guiCurrentWWWMode = Enum95.LAPTOP_MODE_AIM;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM;

      // do we have to have a World Wide Wait
      if (LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.AIM_BOOKMARK] == false) {
        // reset flag and set load pending flag
        LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.AIM_BOOKMARK] = true;
        fLoadPendingFlag = true;
      } else {
        // fast reload
        fLoadPendingFlag = true;
        fFastLoadFlag = true;
      }
      break;
    case Enum98.BOBBYR_BOOKMARK:
      guiCurrentWWWMode = Enum95.LAPTOP_MODE_BOBBY_R;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BOBBY_R;

      // do we have to have a World Wide Wait
      if (LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.BOBBYR_BOOKMARK] == false) {
        // reset flag and set load pending flag
        LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.BOBBYR_BOOKMARK] = true;
        fLoadPendingFlag = true;
      } else {
        // fast reload
        fLoadPendingFlag = true;
        fFastLoadFlag = true;
      }
      break;
    case (Enum98.IMP_BOOKMARK):
      guiCurrentWWWMode = Enum95.LAPTOP_MODE_CHAR_PROFILE;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_CHAR_PROFILE;

      // do we have to have a World Wide Wait
      if (LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.IMP_BOOKMARK] == false) {
        // reset flag and set load pending flag
        LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.IMP_BOOKMARK] = true;
        fLoadPendingFlag = true;
      } else {
        // fast reload
        fLoadPendingFlag = true;
        fFastLoadFlag = true;
      }
      iCurrentImpPage = Enum71.IMP_HOME_PAGE;
      break;
    case (Enum98.MERC_BOOKMARK):

      // if the mercs server has gone down, but hasnt come up yet
      if (LaptopSaveInfo.fMercSiteHasGoneDownYet == true && LaptopSaveInfo.fFirstVisitSinceServerWentDown == false) {
        guiCurrentWWWMode = Enum95.LAPTOP_MODE_BROKEN_LINK;
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BROKEN_LINK;
      } else {
        guiCurrentWWWMode = Enum95.LAPTOP_MODE_MERC;
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC;
      }

      // do we have to have a World Wide Wait
      if (LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.MERC_BOOKMARK] == false) {
        // reset flag and set load pending flag
        LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.MERC_BOOKMARK] = true;
        fLoadPendingFlag = true;
      } else {
        // fast reload
        fLoadPendingFlag = true;
        fFastLoadFlag = true;
      }
      break;
    case (Enum98.FUNERAL_BOOKMARK):
      guiCurrentWWWMode = Enum95.LAPTOP_MODE_FUNERAL;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FUNERAL;

      // do we have to have a World Wide Wait
      if (LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.FUNERAL_BOOKMARK] == false) {
        // reset flag and set load pending flag
        LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.FUNERAL_BOOKMARK] = true;
        fLoadPendingFlag = true;
      } else {
        // fast reload
        fLoadPendingFlag = true;
        fFastLoadFlag = true;
      }
      break;
    case (Enum98.FLORIST_BOOKMARK):
      guiCurrentWWWMode = Enum95.LAPTOP_MODE_FLORIST;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST;

      // do we have to have a World Wide Wait
      if (LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.FLORIST_BOOKMARK] == false) {
        // reset flag and set load pending flag
        LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.FLORIST_BOOKMARK] = true;
        fLoadPendingFlag = true;
      } else {
        // fast reload
        fLoadPendingFlag = true;
        fFastLoadFlag = true;
      }
      break;

    case (Enum98.INSURANCE_BOOKMARK):
      guiCurrentWWWMode = Enum95.LAPTOP_MODE_INSURANCE;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE;

      // do we have to have a World Wide Wait
      if (LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.INSURANCE_BOOKMARK] == false) {
        // reset flag and set load pending flag
        LaptopSaveInfo.fVisitedBookmarkAlready[Enum98.INSURANCE_BOOKMARK] = true;
        fLoadPendingFlag = true;
      } else {
        // fast reload
        fLoadPendingFlag = true;
        fFastLoadFlag = true;
      }
      break;
  }

  gfShowBookmarks = false;
  fReDrawScreenFlag = true;
  return;
}

function BookmarkMvtCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason == MSYS_CALLBACK_REASON_MOVE) {
    iHighLightBookLine = MSYS_GetRegionUserData(pRegion, 0);
  }
  if (iReason == MSYS_CALLBACK_REASON_LOST_MOUSE) {
    iHighLightBookLine = -1;
  }
}

function LoadLoadPending(): boolean {
  // function will load the load pending graphics
  // reuse bookmark
  // load graph window and bar
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\graphwindow.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiGRAPHWINDOW))) {
    return false;
  }
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\graphsegment.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiGRAPHBAR))) {
    return false;
  }

  return true;
}

function DisplayLoadPending(): boolean {
  // this function will display the load pending and return if the load is done
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let iTotalTime: INT32 = 0;
  let iTempTime: INT32 = 0;
  let iCounter: INT32 = 0;
  let iDifference: INT32 = 0;
  let hLapTopIconHandle: HVOBJECT;
  let iLoadTime: INT32;
  let iUnitTime: INT32;
  let uiTempLaptopMode: UINT32 = 0;
  let uiTempWWWMode: UINT32 = 0;
  let sXPosition: INT16 = 0;
  let sYPosition: INT16 = 0;

  // if merc webpage, make it longer
  // TEMP disables the loadpending
  if (gfTemporaryDisablingOfLoadPendingFlag) {
    iLoadTime = 1;
    iUnitTime = 1;
  } else {
    if ((fFastLoadFlag == true) && (fConnectingToSubPage == true)) {
      iUnitTime = FASTEST_UNIT_TIME;
    } else if (fFastLoadFlag == true) {
      iUnitTime = FAST_UNIT_TIME;
    } else if (fConnectingToSubPage == true) {
      iUnitTime = ALMOST_FAST_UNIT_TIME;
    }

    // if we are connecting the MERC site, and the MERC site hasnt yet moved to their new site, have the sloooww wait
    else if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_MERC && !LaptopSaveInfo.fMercSiteHasGoneDownYet) {
      iUnitTime = LONG_UNIT_TIME;
    } else {
      iUnitTime = UNIT_TIME;
    }

    iUnitTime += WWaitDelayIncreasedIfRaining(iUnitTime);

    iLoadTime = iUnitTime * 30;
  }

  // we are now waiting on a web page to download, reset counter
  if (!fLoadPendingFlag) {
    fDoneLoadPending = false;
    fFastLoadFlag = false;
    fConnectingToSubPage = false;
    iBaseTime = 0;
    iTotalTime = 0;
    return false;
  }
  // if total time is exceeded, return (TRUE)
  if (iBaseTime == 0) {
    iBaseTime = GetJA2Clock();
  }

  if (iTotalTime >= iLoadTime) {
    // done loading, redraw screen
    fLoadPendingFlag = false;
    fFastLoadFlag = false;
    iTotalTime = 0;
    iBaseTime = 0;
    fDoneLoadPending = true;
    fConnectingToSubPage = false;
    fPausedReDrawScreenFlag = true;

    return true;
  }

  iDifference = GetJA2Clock() - iBaseTime;

  // difference has been long enough or we are redrawing the screen
  if ((iDifference) > iUnitTime) {
    // LONG ENOUGH TIME PASSED
    iCounter = 0;
    iBaseTime = GetJA2Clock();
    iTotalTime += iDifference;
    iTempTime = iTotalTime;
  }

  // new mail, don't redraw
  if (fNewMailFlag == true) {
    return false;
  }

  RenderButtons();

  //	RenderFastHelp( );
  //	RenderButtonsFastHelp( );

  // display top middle and bottom of box
  GetVideoObject(addressof(hLapTopIconHandle), guiDOWNLOADTOP);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, DOWNLOAD_X, DOWNLOAD_Y, VO_BLT_SRCTRANSPARENCY, null);
  GetVideoObject(addressof(hLapTopIconHandle), guiDOWNLOADMID);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, DOWNLOAD_X, DOWNLOAD_Y + DOWN_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
  GetVideoObject(addressof(hLapTopIconHandle), guiDOWNLOADBOT);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, DOWNLOAD_X, DOWNLOAD_Y + 2 * DOWN_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
  GetVideoObject(addressof(hLapTopIconHandle), guiTITLEBARICONS);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 1, DOWNLOAD_X + 4, DOWNLOAD_Y + 1, VO_BLT_SRCTRANSPARENCY, null);

  // font stuff
  SetFont(DOWNLOAD_FONT());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // reload or download?
  if (fFastLoadFlag == true) {
    FindFontCenterCoordinates(328, 0, 446 - 328, 0, pDownloadString[1], DOWNLOAD_FONT(), addressof(sXPosition), addressof(sYPosition));

    // display download string
    mprintf(sXPosition, DOWN_STRING_Y, pDownloadString[1]);
  } else {
    FindFontCenterCoordinates(328, 0, 446 - 328, 0, pDownloadString[0], DOWNLOAD_FONT(), addressof(sXPosition), addressof(sYPosition));

    // display download string
    mprintf(sXPosition, DOWN_STRING_Y, pDownloadString[0]);
  }

  // get and blt the window video object
  GetVideoObject(addressof(hLapTopIconHandle), guiGRAPHWINDOW);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, LAPTOP_WINDOW_X, LAPTOP_WINDOW_Y, VO_BLT_SRCTRANSPARENCY, null);

  // check to see if we are only updating screen, but not passed a new element in the load pending display

  iTempTime = iTotalTime;
  // decide how many time units are to be displayed, based on amount of time passed
  while (iTempTime > 0) {
    GetVideoObject(addressof(hLapTopIconHandle), guiGRAPHBAR);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, LAPTOP_BAR_X + (UNIT_WIDTH * iCounter), LAPTOP_BAR_Y, VO_BLT_SRCTRANSPARENCY, null);
    iTempTime -= iUnitTime;
    iCounter++;

    // have we gone too far?
    if (iCounter > 30) {
      iTempTime = 0;
    }
  }

  InvalidateRegion(DOWNLOAD_X, DOWNLOAD_Y, DOWNLOAD_X + 150, DOWNLOAD_Y + 100);

  // re draw screen and new mail warning box
  SetFontShadow(DEFAULT_SHADOW);

  MarkButtonsDirty();

  DisableMercSiteButton();

  return false;
}

function DeleteLoadPending(): void {
  // this funtion will delete the load pending graphics
  // reuse bookmark
  DeleteVideoObjectFromIndex(guiGRAPHBAR);
  DeleteVideoObjectFromIndex(guiGRAPHWINDOW);
  return;
}

function BtnErrorCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
    }
    btn.value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);
      fErrorFlag = false;
    }
  }
}
function CreateDestroyErrorButton(): void {
  /* static */ let fOldErrorFlag: boolean = false;
  if ((fErrorFlag) && (!fOldErrorFlag)) {
    // create inventory button
    fOldErrorFlag = true;

    // load image and create error confirm button
    giErrorButtonImage[0] = LoadButtonImage("LAPTOP\\errorbutton.sti", -1, 0, -1, 1, -1);
    giErrorButton[0] = QuickCreateButton(giErrorButtonImage[0], ERROR_X + ERROR_BTN_X, ERROR_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, BtnGenericMouseMoveButtonCallback, BtnErrorCallback);

    // define the cursor
    SetButtonCursor(giErrorButton[0], Enum317.CURSOR_LAPTOP_SCREEN);

    // define the screen mask
    MSYS_DefineRegion(addressof(pScreenMask), 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST - 3, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, LapTopScreenCallBack);

    // add region
    MSYS_AddRegion(addressof(pScreenMask));
  } else if ((!fErrorFlag) && (fOldErrorFlag)) {
    // done dsiplaying, get rid of button and screen mask
    fOldErrorFlag = false;

    RemoveButton(giErrorButton[0]);
    UnloadButtonImage(giErrorButtonImage[0]);

    MSYS_RemoveRegion(addressof(pScreenMask));

    // re draw screen
    fReDrawScreenFlag = true;
  }
  return;
}

function DisplayErrorBox(): void {
  // this function will display the error graphic
  let hLapTopIconHandle: HVOBJECT;
  if (!fErrorFlag)
    return;

  // get and blt top portion
  GetVideoObject(addressof(hLapTopIconHandle), guiBOOKTOP);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, ERROR_X, ERROR_Y, VO_BLT_SRCTRANSPARENCY, null);

  // middle * 5
  GetVideoObject(addressof(hLapTopIconHandle), guiBOOKMID);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, ERROR_X, ERROR_Y + BOOK_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);

  GetVideoObject(addressof(hLapTopIconHandle), guiBOOKMID);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, ERROR_X, ERROR_Y + 2 * BOOK_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);

  GetVideoObject(addressof(hLapTopIconHandle), guiBOOKMID);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, ERROR_X, ERROR_Y + 3 * BOOK_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);

  GetVideoObject(addressof(hLapTopIconHandle), guiBOOKMID);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, ERROR_X, ERROR_Y + 4 * BOOK_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);

  GetVideoObject(addressof(hLapTopIconHandle), guiBOOKMID);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, ERROR_X, ERROR_Y + 5 * BOOK_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);

  // the bottom
  GetVideoObject(addressof(hLapTopIconHandle), guiBOOKBOT);
  BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, ERROR_X, ERROR_Y + 6 * BOOK_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);

  // font stuff
  SetFont(ERROR_TITLE_FONT());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // print title
  mprintf(ERROR_TITLE_X, ERROR_TITLE_Y, pErrorStrings[0]);
  SetFontForeground(FONT_BLACK);
  SetFont(ERROR_FONT());

  // display error string
  DisplayWrappedString(ERROR_X + ERROR_TEXT_X, (ERROR_Y + ERROR_TEXT_Y + DisplayWrappedString(ERROR_X + ERROR_TEXT_X, ERROR_Y + ERROR_TEXT_Y, BOOK_WIDTH, 2, ERROR_FONT(), FONT_BLACK, pErrorStrings[1], FONT_BLACK, false, CENTER_JUSTIFIED)), BOOK_WIDTH, 2, ERROR_FONT(), FONT_BLACK, pErrorStrings[2], FONT_BLACK, false, CENTER_JUSTIFIED);

  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function DrawTextOnErrorButton(): void {
  // draws text on error button
  SetFont(ERROR_TITLE_FONT());
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);
  mprintf(ERROR_X + ERROR_BTN_X + ERROR_BTN_TEXT_X, ERROR_BTN_Y + ERROR_BTN_TEXT_Y, pErrorStrings[3]);
  SetFontShadow(DEFAULT_SHADOW);

  InvalidateRegion(ERROR_X, ERROR_Y, ERROR_X + BOOK_WIDTH, ERROR_Y + 6 * BOOK_HEIGHT);
  return;
}

// This function is called every time the laptop is FIRST initialized, ie whenever the laptop is loaded.  It calls
// various init function in the laptop pages that need to be inited when the laptop is just loaded.
function EnterLaptopInitLaptopPages(): void {
  EnterInitAimMembers();
  EnterInitAimArchives();
  EnterInitAimPolicies();
  EnterInitAimHistory();
  EnterInitFloristGallery();
  EnterInitInsuranceInfo();
  EnterInitBobbyRayOrder();
  EnterInitMercSite();

  // init sub pages for WW Wait
  InitIMPSubPageList();
}

function CheckMarkButtonsDirtyFlag(): void {
  // this function checks the fMarkButtonsDirtyFlag, if true, mark buttons dirty
  if (fMarkButtonsDirtyFlag) {
    // flag set, mark buttons and reset
    MarkButtonsDirty();
    fMarkButtonsDirtyFlag = false;
  }

  return;
}

function PostButtonRendering(): void {
  // this function is in place to allow for post button rendering

  switch (guiCurrentLaptopMode) {
    case Enum95.LAPTOP_MODE_AIM:
      //	    RenderCharProfilePostButton( );
      break;

    case Enum95.LAPTOP_MODE_AIM_MEMBERS:
      RenderAIMMembersTopLevel();
      break;
  }
  return;
}

function ShouldNewMailBeDisplayed(): void {
  let fReDraw: boolean = false;
  switch (guiCurrentLaptopMode) {
    case Enum95.LAPTOP_MODE_AIM_MEMBERS:
      fReDraw = DisableNewMailMessage();
      break;
  }
  /*
          if(fReDraw)
          {
                  RenderLapTopImage();
                  HighLightRegion(giCurrentRegion);
                  RenderLaptop();
          }
   */
}

function DisplayPlayersBalanceToDate(): void {
  // print players balance to date
  let sString: string /* CHAR16[100] */;
  let sX: INT16;
  let sY: INT16;

  // initialize string
  memset(sString, 0, sizeof(sString));

  // font stuff
  SetFont(FONT10ARIAL());
  SetFontForeground(142);
  SetFontShadow(NO_SHADOW);

  // parse straigth number
  sString = swprintf("%d", LaptopSaveInfo.iCurrentBalance);

  // put in commas, then dollar sign
  InsertCommasForDollarFigure(sString);
  InsertDollarSignInToString(sString);

  // get center
  FindFontCenterCoordinates(LAPTOP_ICON_TEXT_X, 0, (LAPTOP_ICON_TEXT_WIDTH), (LAPTOP_ICON_TEXT_HEIGHT), sString, LAPTOPICONFONT(), addressof(sX), addressof(sY));
  //	gprintfdirty( sX , LAPTOP_ICON_TEXT_FINANCIAL_Y + 10, sString );
  // printf it!
  if (ButtonList[gLaptopButton[5]].value.uiFlags & BUTTON_CLICKED_ON) {
    mprintf(sX + 5, LAPTOP_ICON_TEXT_FINANCIAL_Y + 10 + 5, sString);
  } else {
    mprintf(sX, LAPTOP_ICON_TEXT_FINANCIAL_Y + 10, sString);
  }

  // reset shadow
  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function CheckIfNewWWWW(): void {
  // if no www mode, set new www flag..until new www mode that is not 0

  if (guiCurrentWWWMode == Enum95.LAPTOP_MODE_NONE) {
    fNewWWW = true;
  } else {
    fNewWWW = false;
  }

  return;
}

function HandleLapTopESCKey(): void {
  // will handle esc key events, since handling depends on state of laptop

  if (fNewMailFlag) {
    // get rid of new mail warning box
    fNewMailFlag = false;
    CreateDestroyNewMailButton();

    // force redraw
    fReDrawScreenFlag = true;
    RenderLaptop();
  } else if (fDeleteMailFlag) {
    // get rid of delete mail box
    fDeleteMailFlag = false;
    CreateDestroyDeleteNoticeMailButton();

    // force redraw
    fReDrawScreenFlag = true;
    RenderLaptop();
  } else if (fErrorFlag) {
    // get rid of error warning box
    fErrorFlag = false;
    CreateDestroyErrorButton();

    // force redraw
    fReDrawScreenFlag = true;
    RenderLaptop();
  }

  else if (gfShowBookmarks) {
    // get rid of bookmarks
    gfShowBookmarks = false;

    // force redraw
    fReDrawScreenFlag = true;
    RenderLapTopImage();
    RenderLaptop();
  } else {
    // leave
    fExitingLaptopFlag = true;
    HandleExit();
  }

  return;
}

export function HandleRightButtonUpEvent(): void {
  // will handle the right button up event
  if (fNewMailFlag) {
    // get rid of new mail warning box
    fNewMailFlag = false;
    CreateDestroyNewMailButton();

    // force redraw
    fReDrawScreenFlag = true;
    RenderLaptop();
  } else if (fDeleteMailFlag) {
    // get rid of delete mail box
    fDeleteMailFlag = false;
    CreateDestroyDeleteNoticeMailButton();

    // force redraw
    fReDrawScreenFlag = true;
    RenderLaptop();
  } else if (fErrorFlag) {
    // get rid of error warning box
    fErrorFlag = false;
    CreateDestroyErrorButton();

    // force redraw
    fReDrawScreenFlag = true;
    RenderLaptop();
  }

  else if (gfShowBookmarks) {
    // get rid of bookmarks
    gfShowBookmarks = false;

    // force redraw
    fReDrawScreenFlag = true;
    RenderLapTopImage();
    RenderLaptop();
  } else if (fDisplayMessageFlag) {
    fDisplayMessageFlag = false;

    // force redraw
    fReDrawScreenFlag = true;
    RenderLapTopImage();
    RenderLaptop();
  } else if (fShowBookmarkInfo) {
    fShowBookmarkInfo = false;
  }
}

function HandleLeftButtonUpEvent(): void {
  // will handle the left button up event

  if (gfShowBookmarks) {
    // get rid of bookmarks
    gfShowBookmarks = false;

    // force redraw
    fReDrawScreenFlag = true;
    RenderLapTopImage();
    RenderLaptop();
  } else if (fShowBookmarkInfo) {
    fShowBookmarkInfo = false;
  }
}

export function LapTopScreenCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
    return;
  }

  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    HandleLeftButtonUpEvent();
    return;
  }
  if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    HandleRightButtonUpEvent();
    return;
  }

  return;
}

export function DoLapTopMessageBox(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, ubFlags: UINT8, ReturnCallback: MSGBOX_CALLBACK): boolean {
  let pCenteringRect: SGPRect = createSGPRectFrom(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_LR_Y);

  // reset exit mode
  fExitDueToMessageBox = true;

  // do message box and return
  iLaptopMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (ubFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, addressof(pCenteringRect));

  // send back return state
  return iLaptopMessageBox != -1;
}

export function DoLapTopSystemMessageBoxWithRect(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK, pCenteringRect: Pointer<SGPRect>): boolean {
  // reset exit mode
  fExitDueToMessageBox = true;

  // do message box and return
  iLaptopMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, pCenteringRect);

  // send back return state
  return iLaptopMessageBox != -1;
}

export function DoLapTopSystemMessageBox(ubStyle: UINT8, zString: string /* Pointer<INT16> */, uiExitScreen: UINT32, usFlags: UINT16, ReturnCallback: MSGBOX_CALLBACK): boolean {
  let CenteringRect: SGPRect = createSGPRectFrom(0, 0, 640, INV_INTERFACE_START_Y);
  // reset exit mode
  fExitDueToMessageBox = true;

  // do message box and return
  iLaptopMessageBox = DoMessageBox(ubStyle, zString, uiExitScreen, (usFlags | MSG_BOX_FLAG_USE_CENTERING_RECT), ReturnCallback, addressof(CenteringRect));

  // send back return state
  return iLaptopMessageBox != -1;
}

// places a tileable pattern down
export function WebPageTileBackground(ubNumX: UINT8, ubNumY: UINT8, usWidth: UINT16, usHeight: UINT16, uiBackgroundIdentifier: UINT32): boolean {
  let hBackGroundHandle: HVOBJECT;
  let x: UINT16;
  let y: UINT16;
  let uiPosX: UINT16;
  let uiPosY: UINT16;

  // Blt the Wood background
  GetVideoObject(addressof(hBackGroundHandle), uiBackgroundIdentifier);

  uiPosY = LAPTOP_SCREEN_WEB_UL_Y;
  for (y = 0; y < ubNumY; y++) {
    uiPosX = LAPTOP_SCREEN_UL_X;
    for (x = 0; x < ubNumX; x++) {
      BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 0, uiPosX, uiPosY, VO_BLT_SRCTRANSPARENCY, null);
      uiPosX += usWidth;
    }
    uiPosY += usHeight;
  }
  return true;
}

function InitTitleBarMaximizeGraphics(uiBackgroundGraphic: UINT32, pTitle: string /* STR16 */, uiIconGraphic: UINT32, usIconGraphicIndex: UINT16): boolean {
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();
  let hImageHandle: HVOBJECT;

  Assert(uiBackgroundGraphic);

  // Create a background video surface to blt the title bar onto
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = LAPTOP_TITLE_BAR_WIDTH;
  vs_desc.usHeight = LAPTOP_TITLE_BAR_HEIGHT;
  vs_desc.ubBitDepth = 16;
  if (!AddVideoSurface(addressof(vs_desc), addressof(guiTitleBarSurface))) {
    return false;
  }

  // blit the toolbar grapgucs onto the surface
  GetVideoObject(addressof(hImageHandle), uiBackgroundGraphic);
  BltVideoObject(guiTitleBarSurface, hImageHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);

  // blit th icon onto the tool bar
  GetVideoObject(addressof(hImageHandle), uiIconGraphic);
  BltVideoObject(guiTitleBarSurface, hImageHandle, usIconGraphicIndex, LAPTOP_TITLE_BAR_ICON_OFFSET_X, LAPTOP_TITLE_BAR_ICON_OFFSET_Y, VO_BLT_SRCTRANSPARENCY, null);

  SetFontDestBuffer(guiTitleBarSurface, 0, 0, vs_desc.usWidth, vs_desc.usHeight, false);
  DrawTextToScreen(pTitle, LAPTOP_TITLE_BAR_TEXT_OFFSET_X, LAPTOP_TITLE_BAR_TEXT_OFFSET_Y, 0, FONT14ARIAL(), FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  return true;
}

function DisplayTitleBarMaximizeGraphic(fForward: boolean, fInit: boolean, usTopLeftX: UINT16, usTopLeftY: UINT16, usTopRightX: UINT16): boolean {
  /* static */ let ubCount: INT8;
  let sPosX: INT16;
  let sPosY: INT16;
  let sPosRightX: INT16;
  let sPosBottomY: INT16;
  let sWidth: INT16;
  let sHeight: INT16;
  let SrcRect: SGPRect = createSGPRect();
  let DestRect: SGPRect = createSGPRect();
  /* static */ let LastRect: SGPRect = createSGPRect();
  let dTemp: FLOAT;

  if (fInit) {
    if (gfTitleBarSurfaceAlreadyActive)
      return false;

    gfTitleBarSurfaceAlreadyActive = true;
    if (fForward) {
      ubCount = 1;
    } else {
      ubCount = NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS - 1;
    }
  }

  dTemp = (LAPTOP_TITLE_BAR_TOP_LEFT_X - usTopLeftX) / NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS;
  sPosX = (usTopLeftX + dTemp * ubCount);

  dTemp = (LAPTOP_TITLE_BAR_TOP_RIGHT_X - usTopRightX) / NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS;
  sPosRightX = (usTopRightX + dTemp * ubCount);

  dTemp = (LAPTOP_TITLE_BAR_TOP_LEFT_Y - usTopLeftY) / NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS;
  sPosY = (usTopLeftY + dTemp * ubCount);

  sPosBottomY = LAPTOP_TITLE_BAR_HEIGHT;

  SrcRect.iLeft = 0;
  SrcRect.iTop = 0;
  SrcRect.iRight = LAPTOP_TITLE_BAR_WIDTH;
  SrcRect.iBottom = LAPTOP_TITLE_BAR_HEIGHT;

  // if its the last fram, bit the tittle bar to the final position
  if (ubCount == NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS) {
    DestRect.iLeft = LAPTOP_TITLE_BAR_TOP_LEFT_X;
    DestRect.iTop = LAPTOP_TITLE_BAR_TOP_LEFT_Y;
    DestRect.iRight = LAPTOP_TITLE_BAR_TOP_RIGHT_X;
    DestRect.iBottom = DestRect.iTop + sPosBottomY;
  } else {
    DestRect.iLeft = sPosX;
    DestRect.iTop = sPosY;
    DestRect.iRight = sPosRightX;
    DestRect.iBottom = DestRect.iTop + sPosBottomY;
  }

  if (fForward) {
    // Restore the old rect
    if (ubCount > 1) {
      sWidth = (LastRect.iRight - LastRect.iLeft);
      sHeight = (LastRect.iBottom - LastRect.iTop);
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, LastRect.iLeft, LastRect.iTop, sWidth, sHeight);
    }

    // Save rectangle
    if (ubCount > 0) {
      sWidth = (DestRect.iRight - DestRect.iLeft);
      sHeight = (DestRect.iBottom - DestRect.iTop);
      BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, DestRect.iLeft, DestRect.iTop, sWidth, sHeight);
    }
  } else {
    // Restore the old rect
    if (ubCount < NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS - 1) {
      sWidth = (LastRect.iRight - LastRect.iLeft);
      sHeight = (LastRect.iBottom - LastRect.iTop);
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, LastRect.iLeft, LastRect.iTop, sWidth, sHeight);
    }

    // Save rectangle
    if (ubCount < NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS) {
      sWidth = (DestRect.iRight - DestRect.iLeft);
      sHeight = (DestRect.iBottom - DestRect.iTop);
      BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, DestRect.iLeft, DestRect.iTop, sWidth, sHeight);
    }
  }

  BltStretchVideoSurface(FRAME_BUFFER, guiTitleBarSurface, 0, 0, VO_BLT_SRCTRANSPARENCY, addressof(SrcRect), addressof(DestRect));

  InvalidateRegion(DestRect.iLeft, DestRect.iTop, DestRect.iRight, DestRect.iBottom);
  InvalidateRegion(LastRect.iLeft, LastRect.iTop, LastRect.iRight, LastRect.iBottom);

  LastRect = DestRect;

  if (fForward) {
    if (ubCount == NUMBER_OF_LAPTOP_TITLEBAR_ITERATIONS) {
      gfTitleBarSurfaceAlreadyActive = false;
      return true;
    } else {
      ubCount++;
      return false;
    }
  } else {
    if (ubCount == 0) {
      gfTitleBarSurfaceAlreadyActive = false;
      return true;
    } else {
      ubCount--;
      return false;
    }
  }

  return true;
}

function RemoveTitleBarMaximizeGraphics(): void {
  DeleteVideoSurfaceFromIndex(guiTitleBarSurface);
}

function HandleSlidingTitleBar(): void {
  if ((fMaximizingProgram == false) && (fMinizingProgram == false)) {
    return;
  }

  if (fExitingLaptopFlag) {
    return;
  }

  if (fMaximizingProgram) {
    switch (bProgramBeingMaximized) {
      case (Enum93.LAPTOP_PROGRAM_MAILER):
        fMaximizingProgram = !DisplayTitleBarMaximizeGraphic(true, fInitTitle, 29, 66, 29 + 20);
        if (fMaximizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          fEnteredNewLapTopDueToHandleSlidingBars = true;
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_FILES):
        fMaximizingProgram = !DisplayTitleBarMaximizeGraphic(true, fInitTitle, 29, 120, 29 + 20);
        if (fMaximizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          fEnteredNewLapTopDueToHandleSlidingBars = true;
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_FINANCES):
        fMaximizingProgram = !DisplayTitleBarMaximizeGraphic(true, fInitTitle, 29, 226, 29 + 20);
        if (fMaximizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          fEnteredNewLapTopDueToHandleSlidingBars = true;
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_PERSONNEL):
        fMaximizingProgram = !DisplayTitleBarMaximizeGraphic(true, fInitTitle, 29, 194, 29 + 20);
        if (fMaximizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          fEnteredNewLapTopDueToHandleSlidingBars = true;
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_HISTORY):
        fMaximizingProgram = !DisplayTitleBarMaximizeGraphic(true, fInitTitle, 29, 162, 29 + 20);
        if (fMaximizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          fEnteredNewLapTopDueToHandleSlidingBars = true;
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_WEB_BROWSER):
        fMaximizingProgram = !DisplayTitleBarMaximizeGraphic(true, fInitTitle, 29, 99, 29 + 20);
        if (fMaximizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          fEnteredNewLapTopDueToHandleSlidingBars = true;
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
    }

    MarkButtonsDirty();
  } else {
    // minimizing
    switch (bProgramBeingMaximized) {
      case (Enum93.LAPTOP_PROGRAM_MAILER):
        fMinizingProgram = !DisplayTitleBarMaximizeGraphic(false, fInitTitle, 29, 66, 29 + 20);
        if (fMinizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_FILES):
        fMinizingProgram = !DisplayTitleBarMaximizeGraphic(false, fInitTitle, 29, 130, 29 + 20);
        if (fMinizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_FINANCES):
        fMinizingProgram = !DisplayTitleBarMaximizeGraphic(false, fInitTitle, 29, 226, 29 + 20);
        if (fMinizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_PERSONNEL):
        fMinizingProgram = !DisplayTitleBarMaximizeGraphic(false, fInitTitle, 29, 194, 29 + 20);
        if (fMinizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_HISTORY):
        fMinizingProgram = !DisplayTitleBarMaximizeGraphic(false, fInitTitle, 29, 162, 29 + 20);
        if (fMinizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
      case (Enum93.LAPTOP_PROGRAM_WEB_BROWSER):
        fMinizingProgram = !DisplayTitleBarMaximizeGraphic(false, fInitTitle, 29, 99, 29 + 20);
        if (fMinizingProgram == false) {
          RemoveTitleBarMaximizeGraphics();
          EnterNewLaptopMode();
          fEnteredNewLapTopDueToHandleSlidingBars = false;
          fPausedReDrawScreenFlag = true;
        }
        break;
    }
  }

  // reset init
  fInitTitle = false;
}

function ShowLights(): void {
  // will show lights depending on state
  let hHandle: HVOBJECT;

  if (fPowerLightOn == true) {
    GetVideoObject(addressof(hHandle), guiLIGHTS);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, 44, 466, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    GetVideoObject(addressof(hHandle), guiLIGHTS);
    BltVideoObject(FRAME_BUFFER, hHandle, 1, 44, 466, VO_BLT_SRCTRANSPARENCY, null);
  }

  if (fHardDriveLightOn == true) {
    GetVideoObject(addressof(hHandle), guiLIGHTS);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, 88, 466, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    GetVideoObject(addressof(hHandle), guiLIGHTS);
    BltVideoObject(FRAME_BUFFER, hHandle, 1, 88, 466, VO_BLT_SRCTRANSPARENCY, null);
  }
}

function FlickerHDLight(): void {
  /* static */ let iBaseTime: INT32 = 0;
  /* static */ let iTotalDifference: INT32 = 0;
  let iDifference: INT32 = 0;

  if (fLoadPendingFlag == true) {
    fFlickerHD = true;
  }

  if (fFlickerHD == false) {
    return;
  }

  if (iBaseTime == 0) {
    iBaseTime = GetJA2Clock();
  }

  iDifference = GetJA2Clock() - iBaseTime;

  if ((iTotalDifference > HD_FLICKER_TIME) && (fLoadPendingFlag == false)) {
    iBaseTime = GetJA2Clock();
    fHardDriveLightOn = false;
    iBaseTime = 0;
    iTotalDifference = 0;
    fFlickerHD = false;
    InvalidateRegion(88, 466, 102, 477);
    return;
  }

  if (iDifference > FLICKER_TIME) {
    iTotalDifference += iDifference;

    if (fLoadPendingFlag == true) {
      iTotalDifference = 0;
    }

    if ((Random(2)) == 0) {
      fHardDriveLightOn = true;
    } else {
      fHardDriveLightOn = false;
    }
    InvalidateRegion(88, 466, 102, 477);
  }

  return;
}

function ExitLaptopDone(): boolean {
  // check if this is the first time, to reset counter

  /* static */ let fOldLeaveLaptopState: boolean = false;
  /* static */ let iBaseTime: INT32 = 0;
  let iDifference: INT32 = 0;

  if (fOldLeaveLaptopState == false) {
    fOldLeaveLaptopState = true;
    iBaseTime = GetJA2Clock();
  }

  fPowerLightOn = false;

  InvalidateRegion(44, 466, 58, 477);
  // get the current difference
  iDifference = GetJA2Clock() - iBaseTime;

  // did we wait long enough?
  if (iDifference > EXIT_LAPTOP_DELAY_TIME) {
    iBaseTime = 0;
    fOldLeaveLaptopState = false;
    return true;
  } else {
    return false;
  }
}

function CreateDestroyMinimizeButtonForCurrentMode(): void {
  // will create the minimize button

  /* static */ let fAlreadyCreated: boolean = false;
  // check to see if created, if so, do nothing

  // check current mode
  if ((guiCurrentLaptopMode == Enum95.LAPTOP_MODE_NONE) && (guiPreviousLaptopMode != Enum95.LAPTOP_MODE_NONE)) {
    fCreateMinimizeButton = false;
  } else if ((guiCurrentLaptopMode != Enum95.LAPTOP_MODE_NONE)) {
    fCreateMinimizeButton = true;
  } else if ((guiPreviousLaptopMode != Enum95.LAPTOP_MODE_NONE)) {
    fCreateMinimizeButton = false;
  }

  // leaving laptop, get rid of the button
  if (fExitingLaptopFlag == true) {
    fCreateMinimizeButton = false;
  }

  if ((fAlreadyCreated == false) && (fCreateMinimizeButton == true)) {
    // not created, create
    fAlreadyCreated = true;
    CreateMinimizeButtonForCurrentMode();
    CreateMinimizeRegionsForLaptopProgramIcons();
  } else if ((fAlreadyCreated == true) && (fCreateMinimizeButton == false)) {
    // created and must be destroyed
    fAlreadyCreated = false;
    DestroyMinimizeButtonForCurrentMode();
    DestroyMinimizeRegionsForLaptopProgramIcons();
  } else {
    // do nothing
  }

  return;
}

function CreateMinimizeButtonForCurrentMode(): void {
  // create minimize button
  gLaptopMinButtonImage[0] = LoadButtonImage("LAPTOP\\x.sti", -1, 0, -1, 1, -1);
  gLaptopMinButton[0] = QuickCreateButton(gLaptopMinButtonImage[0], 590, 30, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, BtnGenericMouseMoveButtonCallback, LaptopMinimizeProgramButtonCallback);

  SetButtonCursor(gLaptopMinButton[0], Enum317.CURSOR_LAPTOP_SCREEN);
  return;
}

function DestroyMinimizeButtonForCurrentMode(): void {
  // destroy minimize button
  RemoveButton(gLaptopMinButton[0]);
  UnloadButtonImage(gLaptopMinButtonImage[0]);
}

function LaptopMinimizeProgramButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    if (!(btn.value.uiFlags & BUTTON_CLICKED_ON)) {
      btn.value.uiFlags |= (BUTTON_CLICKED_ON);
    }
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= ~(BUTTON_CLICKED_ON);

      switch (guiCurrentLaptopMode) {
        case (Enum95.LAPTOP_MODE_EMAIL):
          gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_MAILER] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[0], guiTITLEBARICONS, 0);
          SetCurrentToLastProgramOpened();
          fMinizingProgram = true;
          fInitTitle = true;
          break;
        case (Enum95.LAPTOP_MODE_FILES):
          gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_FILES] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[5], guiTITLEBARICONS, 2);
          SetCurrentToLastProgramOpened();
          fMinizingProgram = true;
          fInitTitle = true;
          break;
        case (Enum95.LAPTOP_MODE_FINANCES):
          gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_FINANCES] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[2], guiTITLEBARICONS, 5);
          SetCurrentToLastProgramOpened();
          fMinizingProgram = true;
          fInitTitle = true;
          break;
        case (Enum95.LAPTOP_MODE_HISTORY):
          gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_HISTORY] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[4], guiTITLEBARICONS, 4);
          SetCurrentToLastProgramOpened();
          fMinizingProgram = true;
          fInitTitle = true;
          break;
        case (Enum95.LAPTOP_MODE_PERSONNEL):
          gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_PERSONNEL] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[3], guiTITLEBARICONS, 3);
          SetCurrentToLastProgramOpened();
          fMinizingProgram = true;
          fInitTitle = true;
          break;
        case (Enum95.LAPTOP_MODE_NONE):
          // nothing
          break;
        default:
          gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_WEB_BROWSER] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
          InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[7], guiTITLEBARICONS, 1);
          SetCurrentToLastProgramOpened();
          gfShowBookmarks = false;
          fMinizingProgram = true;
          fInitTitle = true;
          break;
      }
    }
  }
}

function FindLastProgramStillOpen(): INT32 {
  let iLowestValue: INT32 = 6;
  let iLowestValueProgram: INT32 = 6;
  let iCounter: INT32 = 0;

  // returns ID of last program open and not minimized
  for (iCounter = 0; iCounter < 6; iCounter++) {
    if (gLaptopProgramStates[iCounter] != Enum94.LAPTOP_PROGRAM_MINIMIZED) {
      if (gLaptopProgramQueueList[iCounter] < iLowestValue) {
        iLowestValue = gLaptopProgramQueueList[iCounter];
        iLowestValueProgram = iCounter;
      }
    }
  }

  return iLowestValueProgram;
}

function UpdateListToReflectNewProgramOpened(iOpenedProgram: INT32): void {
  let iCounter: INT32 = 0;

  // will update queue of opened programs to show thier states
  // set iOpenedProgram to 1, and update others

  // increment everyone
  for (iCounter = 0; iCounter < 6; iCounter++) {
    gLaptopProgramQueueList[iCounter]++;
  }

  gLaptopProgramQueueList[iOpenedProgram] = 1;

  return;
}

function InitLaptopOpenQueue(): void {
  let iCounter: INT32 = 0;

  // set evereyone to 1
  for (iCounter = 0; iCounter < 6; iCounter++) {
    gLaptopProgramQueueList[iCounter] = 1;
  }

  return;
}

function SetCurrentToLastProgramOpened(): void {
  guiCurrentLaptopMode = Enum95.LAPTOP_MODE_NONE;

  switch (FindLastProgramStillOpen()) {
    case (Enum93.LAPTOP_PROGRAM_HISTORY):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_HISTORY;
      break;
    case (Enum93.LAPTOP_PROGRAM_MAILER):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_EMAIL;
      break;
    case (Enum93.LAPTOP_PROGRAM_PERSONNEL):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_PERSONNEL;
      break;
    case (Enum93.LAPTOP_PROGRAM_FINANCES):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FINANCES;
      break;
    case (Enum93.LAPTOP_PROGRAM_FILES):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FILES;
      break;
    case (Enum93.LAPTOP_PROGRAM_WEB_BROWSER):
      // last www mode
      if (guiCurrentWWWMode != 0) {
        guiCurrentLaptopMode = guiCurrentWWWMode;
      } else {
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_WWW;
      }
      // gfShowBookmarks = TRUE;
      fShowBookmarkInfo = true;
      break;
  }
}

export function BlitTitleBarIcons(): void {
  let hHandle: HVOBJECT;
  // will blit the icons for the title bar of the program we are in
  switch (guiCurrentLaptopMode) {
    case (Enum95.LAPTOP_MODE_HISTORY):
      GetVideoObject(addressof(hHandle), guiTITLEBARICONS);
      BltVideoObject(FRAME_BUFFER, hHandle, 4, LAPTOP_TITLE_ICONS_X, LAPTOP_TITLE_ICONS_Y, VO_BLT_SRCTRANSPARENCY, null);
      break;
    case (Enum95.LAPTOP_MODE_EMAIL):
      GetVideoObject(addressof(hHandle), guiTITLEBARICONS);
      BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_TITLE_ICONS_X, LAPTOP_TITLE_ICONS_Y, VO_BLT_SRCTRANSPARENCY, null);
      break;
    case (Enum95.LAPTOP_MODE_PERSONNEL):
      GetVideoObject(addressof(hHandle), guiTITLEBARICONS);
      BltVideoObject(FRAME_BUFFER, hHandle, 3, LAPTOP_TITLE_ICONS_X, LAPTOP_TITLE_ICONS_Y, VO_BLT_SRCTRANSPARENCY, null);
      break;
    case (Enum95.LAPTOP_MODE_FINANCES):
      GetVideoObject(addressof(hHandle), guiTITLEBARICONS);
      BltVideoObject(FRAME_BUFFER, hHandle, 5, LAPTOP_TITLE_ICONS_X, LAPTOP_TITLE_ICONS_Y, VO_BLT_SRCTRANSPARENCY, null);
      break;
    case (Enum95.LAPTOP_MODE_FILES):
      GetVideoObject(addressof(hHandle), guiTITLEBARICONS);
      BltVideoObject(FRAME_BUFFER, hHandle, 2, LAPTOP_TITLE_ICONS_X, LAPTOP_TITLE_ICONS_Y, VO_BLT_SRCTRANSPARENCY, null);
      break;
    case (Enum95.LAPTOP_MODE_NONE):
      // do nothing
      break;
    default:
      // www pages
      GetVideoObject(addressof(hHandle), guiTITLEBARICONS);
      BltVideoObject(FRAME_BUFFER, hHandle, 1, LAPTOP_TITLE_ICONS_X, LAPTOP_TITLE_ICONS_Y, VO_BLT_SRCTRANSPARENCY, null);
      break;
  }
}

function DrawDeskTopBackground(): boolean {
  let hSrcVSurface: HVSURFACE;
  let uiDestPitchBYTES: UINT32;
  let uiSrcPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT16>;
  let pSrcBuf: Pointer<UINT8>;
  let clip: SGPRect = createSGPRect();

  // set clipping region
  clip.iLeft = 0;
  clip.iRight = 506;
  clip.iTop = 0;
  clip.iBottom = 408 + 19;
  // get surfaces
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  if (!GetVideoSurface(addressof(hSrcVSurface), guiDESKTOP)) {
    return false;
  }
  pSrcBuf = LockVideoSurface(guiDESKTOP, addressof(uiSrcPitchBYTES));

  // blit .pcx for the background onto desktop
  Blt8BPPDataSubTo16BPPBuffer(pDestBuf, uiDestPitchBYTES, hSrcVSurface, pSrcBuf, uiSrcPitchBYTES, LAPTOP_SCREEN_UL_X - 2, LAPTOP_SCREEN_UL_Y - 3, addressof(clip));

  // release surfaces
  UnLockVideoSurface(guiDESKTOP);
  UnLockVideoSurface(FRAME_BUFFER);

  return true;
}

function LoadDesktopBackground(): boolean {
  // load desktop background
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();

  vs_desc.fCreateFlags = VSURFACE_CREATE_FROMFILE | VSURFACE_SYSTEM_MEM_USAGE;
  GetMLGFilename(vs_desc.ImageFile, Enum326.MLG_DESKTOP);
  if (!AddVideoSurface(addressof(vs_desc), addressof(guiDESKTOP))) {
    return false;
  }

  return true;
}

function DeleteDesktopBackground(): void {
  // delete desktop

  DeleteVideoSurfaceFromIndex(guiDESKTOP);
  return;
}

export function PrintBalance(): void {
  let pString: string /* CHAR16[32] */;
  //	UINT16 usX, usY;

  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  pString = swprintf("%d", LaptopSaveInfo.iCurrentBalance);
  InsertCommasForDollarFigure(pString);
  InsertDollarSignInToString(pString);

  if (ButtonList[gLaptopButton[5]].value.uiFlags & BUTTON_CLICKED_ON) {
    //		gprintfdirty(47 +1, 257 +15 + 1,pString);
    mprintf(47 + 1, 257 + 15 + 1, pString);
  } else {
    //		gprintfdirty(47, 257 +15 ,pString);
    mprintf(47, 257 + 15, pString);
  }

  SetFontShadow(DEFAULT_SHADOW);
}

export function PrintNumberOnTeam(): void {
  let pString: string /* CHAR16[32] */;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let iCounter: INT32 = 0;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usFontHeight: UINT16;
  let usStrLength: UINT16;

  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);
  SetFontShadow(NO_SHADOW);

  // grab number on team
  pSoldier = MercPtrs[0];

  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    pTeamSoldier = MercPtrs[cnt];

    if ((pTeamSoldier.value.bActive) && (!(pTeamSoldier.value.uiStatusFlags & SOLDIER_VEHICLE))) {
      iCounter++;
    }
  }

  pString = swprintf("%s %d", pPersonnelString[0], iCounter);

  usFontHeight = GetFontHeight(FONT10ARIAL());
  usStrLength = StringPixLength(pString, FONT10ARIAL());

  if (ButtonList[gLaptopButton[3]].value.uiFlags & BUTTON_CLICKED_ON) {
    usPosX = 47 + 1;
    usPosY = 194 + 30 + 1;
    //		gprintfdirty(47 + 1, 194 +30 +1  ,pString);
    //		mprintf(47 + 1, 194 + 30 + 1,pString);
  } else {
    usPosX = 47;
    usPosY = 194 + 30;
    //		gprintfdirty(47, 194 +30 ,pString);
    //		mprintf(47, 194 + 30,pString);
  }

  //	RestoreExternBackgroundRect( usPosX, usPosY, usStrLength, usFontHeight );
  //	gprintfdirty( usPosX, usPosY, pString);
  mprintf(usPosX, usPosY, pString);

  SetFontShadow(DEFAULT_SHADOW);
}

export function PrintDate(): void {
  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  SetFontShadow(NO_SHADOW);

  mprintf(30 + (70 - StringPixLength(WORLDTIMESTR(), FONT10ARIAL())) / 2, 433, WORLDTIMESTR());

  SetFontShadow(DEFAULT_SHADOW);

  //	RenderClock( 35, 414 );

  /*
          def: removed 3/8/99.
   Now use the render clock function used every where else

          CHAR16 pString[ 32 ];
  //	UINT16 usX, usY;

          SetFont( FONT10ARIAL );
          SetFontForeground( FONT_BLACK );
          SetFontBackground( FONT_BLACK );

          SetFontShadow( NO_SHADOW );

          swprintf(pString, L"%s %d", pMessageStrings[ MSG_DAY ], GetWorldDay( ) );

  //	gprintfdirty(35, 413 + 19,pString);
          mprintf(35, 413 + 19,pString);

          SetFontShadow( DEFAULT_SHADOW );
  */
  return;
}

function DisplayTaskBarIcons(): void {
  let hPixHandle: HVOBJECT;
  //	UINT16 usPosX;

  //	usPosX = 83;

  GetVideoObject(addressof(hPixHandle), guiTITLEBARICONS);

  if (fNewFilesInFileViewer) {
    // display the files icon, if there is any
    BltVideoObject(FRAME_BUFFER, hPixHandle, 7, LAPTOP__NEW_FILE_ICON_X, LAPTOP__NEW_FILE_ICON_Y, VO_BLT_SRCTRANSPARENCY, null);
  }

  // display the email icon, if there is email
  if (fUnReadMailFlag) {
    //		usPosX -= 16;
    BltVideoObject(FRAME_BUFFER, hPixHandle, 6, LAPTOP__NEW_EMAIL_ICON_X, LAPTOP__NEW_EMAIL_ICON_Y, VO_BLT_SRCTRANSPARENCY, null);
  }
}

export function HandleKeyBoardShortCutsForLapTop(usEvent: UINT16, usParam: UINT32, usKeyState: UINT16): void {
  // will handle keyboard shortcuts for the laptop ... to be added to later

  if ((fExitingLaptopFlag == true) || (fTabHandled)) {
    return;
  }

  if ((usEvent == KEY_DOWN) && (usParam == ESC)) {
    // esc hit, check to see if boomark list is shown, if so, get rid of it, otherwise, leave
    HandleLapTopESCKey();
  } else if ((usEvent == KEY_DOWN) && (usParam == TAB)) {
    if (usKeyState & CTRL_DOWN) {
      HandleShiftAltTabKeyInLaptop();
    } else {
      HandleAltTabKeyInLaptop();
    }

    fTabHandled = true;
  }

  else if ((usEvent == KEY_DOWN) && (usParam == 'b')) {
    if (CHEATER_CHEAT_LEVEL()) {
      if ((usKeyState & ALT_DOWN))
        LaptopSaveInfo.fBobbyRSiteCanBeAccessed = true;
      else if (usKeyState & CTRL_DOWN) {
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BROKEN_LINK;
      }
    }
  }

  else if ((usEvent == KEY_DOWN) && (usParam == 'x')) {
    if ((usKeyState & ALT_DOWN)) {
      HandleShortCutExitState();
    }
    // LeaveLapTopScreen( );
  }
      if ((usEvent == KEY_DOWN) && ((usParam == 'h') || (usParam == 'H'))) {
    ShouldTheHelpScreenComeUp(Enum17.HELP_SCREEN_LAPTOP, true);
  }

  // adding money
  else if ((usEvent == KEY_DOWN) && (usParam == '=')) {
    if (CHEATER_CHEAT_LEVEL()) {
      AddTransactionToPlayersBook(Enum80.ANONYMOUS_DEPOSIT, 0, GetWorldTotalMin(), 100000);
      MarkButtonsDirty();
    }
  }

  // subtracting money
  else if ((usEvent == KEY_DOWN) && (usParam == '-')) {
    if (CHEATER_CHEAT_LEVEL()) {
      AddTransactionToPlayersBook(Enum80.ANONYMOUS_DEPOSIT, 0, GetWorldTotalMin(), -10000);
      MarkButtonsDirty();
    }
  }

  return;
}

export function RenderWWWProgramTitleBar(): boolean {
  // will render the title bar for the www program
  let uiTITLEFORWWW: UINT32;
  let hHandle: HVOBJECT;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let iIndex: INT32 = 0;
  let sString: string /* CHAR16[256] */;

  // title bar - load
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\programtitlebar.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(uiTITLEFORWWW))) {
    return false;
  }

  // blit title
  GetVideoObject(addressof(hHandle), uiTITLEFORWWW);
  BltVideoObject(FRAME_BUFFER, hHandle, 0, LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_UL_Y - 2, VO_BLT_SRCTRANSPARENCY, null);

  // now delete
  DeleteVideoObjectFromIndex(uiTITLEFORWWW);

  // now slapdown text
  SetFont(FONT14ARIAL());
  SetFontForeground(FONT_WHITE);
  SetFontBackground(FONT_BLACK);

  // display title

  // no page loaded yet, do not handle yet

  if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_WWW) {
    mprintf(140, 33, pWebTitle[0]);
  }

  else {
    iIndex = guiCurrentLaptopMode - Enum95.LAPTOP_MODE_WWW - 1;

    sString = swprintf("%s  -  %s", pWebTitle[0], pWebPagesTitles[iIndex]);
    mprintf(140, 33, sString);
  }

  BlitTitleBarIcons();

  DisplayProgramBoundingBox(false);

  // InvalidateRegion( 0, 0, 640, 480 );
  return true;
}

function HandleDefaultWebpageForLaptop(): void {
  // go to first page in bookmark list
  if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_WWW) {
    // if valid entry go there
    if (LaptopSaveInfo.iBookMarkList[0] != -1) {
      GoToWebPage(LaptopSaveInfo.iBookMarkList[0]);
    }
  }

  return;
}

function CreateMinimizeRegionsForLaptopProgramIcons(): void {
  // will create the minizing region to lie over the icon for this particular laptop program

  MSYS_DefineRegion(addressof(gLapTopProgramMinIcon), LAPTOP_PROGRAM_ICON_X, LAPTOP_PROGRAM_ICON_Y, LAPTOP_PROGRAM_ICON_X + LAPTOP_PROGRAM_ICON_WIDTH, LAPTOP_PROGRAM_ICON_Y + LAPTOP_PROGRAM_ICON_HEIGHT, MSYS_PRIORITY_NORMAL + 1, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, LaptopProgramIconMinimizeCallback);

  return;
}

function DestroyMinimizeRegionsForLaptopProgramIcons(): void {
  // will destroy the minizmize regions to be placed over the laptop icons that will be
  // displayed on the top of the laptop program bar

  MSYS_RemoveRegion(addressof(gLapTopProgramMinIcon));

  return;
}

function LaptopProgramIconMinimizeCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  // callback handler for the minize region that is attatched to the laptop program icon
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    switch (guiCurrentLaptopMode) {
      case (Enum95.LAPTOP_MODE_EMAIL):
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_MAILER] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
        InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[0], guiTITLEBARICONS, 0);
        SetCurrentToLastProgramOpened();
        fMinizingProgram = true;
        fInitTitle = true;
        break;
      case (Enum95.LAPTOP_MODE_FILES):
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_FILES] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
        InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[5], guiTITLEBARICONS, 2);
        SetCurrentToLastProgramOpened();
        fMinizingProgram = true;
        fInitTitle = true;
        break;
      case (Enum95.LAPTOP_MODE_FINANCES):
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_FINANCES] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
        InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[2], guiTITLEBARICONS, 5);
        SetCurrentToLastProgramOpened();
        fMinizingProgram = true;
        fInitTitle = true;
        break;
      case (Enum95.LAPTOP_MODE_HISTORY):
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_HISTORY] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
        InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[4], guiTITLEBARICONS, 4);
        SetCurrentToLastProgramOpened();
        fMinizingProgram = true;
        fInitTitle = true;
        break;
      case (Enum95.LAPTOP_MODE_PERSONNEL):
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_PERSONNEL] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
        InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pLaptopIcons[3], guiTITLEBARICONS, 3);
        SetCurrentToLastProgramOpened();
        fMinizingProgram = true;
        fInitTitle = true;
        break;
      case (Enum95.LAPTOP_MODE_NONE):
        // nothing
        break;
      default:
        gLaptopProgramStates[Enum93.LAPTOP_PROGRAM_WEB_BROWSER] = Enum94.LAPTOP_PROGRAM_MINIMIZED;
        InitTitleBarMaximizeGraphics(guiTITLEBARLAPTOP, pWebTitle[0], guiTITLEBARICONS, 1);
        SetCurrentToLastProgramOpened();
        gfShowBookmarks = false;
        fShowBookmarkInfo = false;
        fMinizingProgram = true;
        fInitTitle = true;
        break;
    }
  }
  return;
}

export function DisplayProgramBoundingBox(fMarkButtons: boolean): void {
  // the border fot eh program
  let hHandle: HVOBJECT;

  GetVideoObject(addressof(hHandle), guiLaptopBACKGROUND);
  BltVideoObject(FRAME_BUFFER, hHandle, 1, 25, 23, VO_BLT_SRCTRANSPARENCY, null);

  // no laptop mode, no border around the program
  if (guiCurrentLaptopMode != Enum95.LAPTOP_MODE_NONE) {
    GetVideoObject(addressof(hHandle), guiLaptopBACKGROUND);
    BltVideoObject(FRAME_BUFFER, hHandle, 0, 108, 23, VO_BLT_SRCTRANSPARENCY, null);
  }

  if (fMarkButtons || fLoadPendingFlag) {
    MarkButtonsDirty();
    RenderButtons();
  }

  PrintDate();

  PrintBalance();

  PrintNumberOnTeam();

  // new files or email?
  DisplayTaskBarIcons();

  // InvalidateRegion( 0,0, 640, 480 );

  return;
}

function CreateDestroyMouseRegionForNewMailIcon(): void {
  /* static */ let fCreated: boolean = false;

  //. will toggle creation/destruction of the mouse regions used by the new mail icon

  if (fCreated == false) {
    fCreated = true;
    MSYS_DefineRegion(addressof(gNewMailIconRegion), LAPTOP__NEW_EMAIL_ICON_X, LAPTOP__NEW_EMAIL_ICON_Y + 5, LAPTOP__NEW_EMAIL_ICON_X + 16, LAPTOP__NEW_EMAIL_ICON_Y + 16, MSYS_PRIORITY_HIGHEST - 3, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, NewEmailIconCallback);
    CreateFileAndNewEmailIconFastHelpText(Enum376.LAPTOP_BN_HLP_TXT_YOU_HAVE_NEW_MAIL, (fUnReadMailFlag == 0));

    MSYS_DefineRegion(addressof(gNewFileIconRegion), LAPTOP__NEW_FILE_ICON_X, LAPTOP__NEW_FILE_ICON_Y + 5, LAPTOP__NEW_FILE_ICON_X + 16, LAPTOP__NEW_FILE_ICON_Y + 16, MSYS_PRIORITY_HIGHEST - 3, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, NewFileIconCallback);
    CreateFileAndNewEmailIconFastHelpText(Enum376.LAPTOP_BN_HLP_TXT_YOU_HAVE_NEW_FILE, (fNewFilesInFileViewer == 0));
  } else {
    fCreated = false;
    MSYS_RemoveRegion(addressof(gNewMailIconRegion));
    MSYS_RemoveRegion(addressof(gNewFileIconRegion));
  }
}

function NewEmailIconCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fUnReadMailFlag) {
      fOpenMostRecentUnReadFlag = true;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_EMAIL;
    }
  }
}

function NewFileIconCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fNewFilesInFileViewer) {
      fEnteredFileViewerFromNewFileIcon = true;
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FILES;
    }
  }
}

function HandleWWWSubSites(): void {
  // check to see if WW Wait is needed for a sub site within the Web Browser

  if ((guiCurrentLaptopMode == guiPreviousLaptopMode) || (guiCurrentLaptopMode < Enum95.LAPTOP_MODE_WWW) || (fLoadPendingFlag == true) || (fDoneLoadPending == true) || (guiPreviousLaptopMode < Enum95.LAPTOP_MODE_WWW)) {
    // no go, leave
    return;
  }

  fLoadPendingFlag = true;
  fConnectingToSubPage = true;

  // fast or slow load?
  if (gfWWWaitSubSitesVisitedFlags[guiCurrentLaptopMode - (Enum95.LAPTOP_MODE_WWW + 1)] == true) {
    fFastLoadFlag = true;
  }

  // set fact we were here
  gfWWWaitSubSitesVisitedFlags[guiCurrentLaptopMode - (Enum95.LAPTOP_MODE_WWW + 1)] = true;

  // Dont show the dlownload screen when switching between these pages
  if ((guiCurrentLaptopMode == Enum95.LAPTOP_MODE_AIM_MEMBERS) && (guiPreviousLaptopMode == Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX) || (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX) && (guiPreviousLaptopMode == Enum95.LAPTOP_MODE_AIM_MEMBERS)) {
    fFastLoadFlag = false;
    fLoadPendingFlag = false;

    // set fact we were here
    gfWWWaitSubSitesVisitedFlags[Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX - (Enum95.LAPTOP_MODE_WWW + 1)] = true;
    gfWWWaitSubSitesVisitedFlags[Enum95.LAPTOP_MODE_AIM_MEMBERS - (Enum95.LAPTOP_MODE_WWW + 1)] = true;
  }

  return;
}

function UpdateStatusOfDisplayingBookMarks(): void {
  // this function will disable showing of bookmarks if in process of download or if we miniming web browser
  if ((fLoadPendingFlag == true) || (guiCurrentLaptopMode < Enum95.LAPTOP_MODE_WWW)) {
    gfShowBookmarks = false;
  }

  return;
}

function InitalizeSubSitesList(): void {
  let iCounter: INT32 = 0;

  // init all subsites list to not visited
  for (iCounter = Enum95.LAPTOP_MODE_WWW + 1; iCounter <= Enum95.LAPTOP_MODE_SIRTECH; iCounter++) {
    gfWWWaitSubSitesVisitedFlags[iCounter - (Enum95.LAPTOP_MODE_WWW + 1)] = false;
  }
  return;
}

function SetSubSiteAsVisted(): void {
  // sets a www sub site as visited
  if (guiCurrentLaptopMode <= Enum95.LAPTOP_MODE_WWW) {
    // not at a web page yet
  } else {
    gfWWWaitSubSitesVisitedFlags[guiCurrentLaptopMode - (Enum95.LAPTOP_MODE_WWW + 1)] = true;
  }
}

function HandleShiftAltTabKeyInLaptop(): void {
  // will handle the alt tab keying in laptop

  // move to next program
  if (fMaximizingProgram == true) {
    return;
  }

  switch (guiCurrentLaptopMode) {
    case (Enum95.LAPTOP_MODE_FINANCES):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_PERSONNEL;
      break;
    case (Enum95.LAPTOP_MODE_PERSONNEL):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_HISTORY;
      break;
    case (Enum95.LAPTOP_MODE_HISTORY):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FILES;
      break;
    case (Enum95.LAPTOP_MODE_EMAIL):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FINANCES;
      break;
    case (Enum95.LAPTOP_MODE_FILES):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_WWW;
      break;
    case (Enum95.LAPTOP_MODE_NONE):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FINANCES;
      break;
    case (Enum95.LAPTOP_MODE_WWW):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_EMAIL;
      break;
    default:
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_EMAIL;
      break;
  }

  fPausedReDrawScreenFlag = true;
}

function HandleAltTabKeyInLaptop(): void {
  // will handle the alt tab keying in laptop

  // move to next program
  // move to next program
  if (fMaximizingProgram == true) {
    return;
  }

  switch (guiCurrentLaptopMode) {
    case (Enum95.LAPTOP_MODE_FINANCES):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_EMAIL;
      break;
    case (Enum95.LAPTOP_MODE_PERSONNEL):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FINANCES;
      break;

    case (Enum95.LAPTOP_MODE_HISTORY):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_PERSONNEL;
      break;
    case (Enum95.LAPTOP_MODE_EMAIL):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_WWW;
      break;
    case (Enum95.LAPTOP_MODE_FILES):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_HISTORY;
      break;
    case (Enum95.LAPTOP_MODE_NONE):
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_EMAIL;
      break;
    default:
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FILES;
      break;
  }

  fPausedReDrawScreenFlag = true;
}

// display the 2 second book mark instruction
function DisplayWebBookMarkNotify(): void {
  /* static */ let fOldShow: boolean = false;
  let hLapTopIconHandle: HVOBJECT;

  // handle the timer for this thing
  HandleWebBookMarkNotifyTimer();

  // are we about to start showing box? or did we just stop?
  if (((fOldShow == false) || (fReDrawBookMarkInfo)) && (fShowBookmarkInfo == true)) {
    fOldShow = true;
    fReDrawBookMarkInfo = false;

    // show background objects
    GetVideoObject(addressof(hLapTopIconHandle), guiDOWNLOADTOP);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, DOWNLOAD_X, DOWNLOAD_Y, VO_BLT_SRCTRANSPARENCY, null);
    GetVideoObject(addressof(hLapTopIconHandle), guiDOWNLOADMID);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, DOWNLOAD_X, DOWNLOAD_Y + DOWN_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
    GetVideoObject(addressof(hLapTopIconHandle), guiDOWNLOADBOT);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 0, DOWNLOAD_X, DOWNLOAD_Y + 2 * DOWN_HEIGHT, VO_BLT_SRCTRANSPARENCY, null);
    GetVideoObject(addressof(hLapTopIconHandle), guiTITLEBARICONS);
    BltVideoObject(FRAME_BUFFER, hLapTopIconHandle, 1, DOWNLOAD_X + 4, DOWNLOAD_Y + 1, VO_BLT_SRCTRANSPARENCY, null);

    //	MSYS_DefineRegion( &gLapTopScreenRegion, ( UINT16 )( LaptopScreenRect.iLeft ),( UINT16 )( LaptopScreenRect.iTop ),( UINT16 ) ( LaptopScreenRect.iRight ),( UINT16 )( LaptopScreenRect.iBottom ), MSYS_PRIORITY_NORMAL+1,
    //					CURSOR_LAPTOP_SCREEN, ScreenRegionMvtCallback, LapTopScreenCallBack );

    // font stuff
    SetFont(DOWNLOAD_FONT());
    SetFontForeground(FONT_WHITE);
    SetFontBackground(FONT_BLACK);
    SetFontShadow(NO_SHADOW);

    // display download string
    mprintf(DOWN_STRING_X, DOWN_STRING_Y, pShowBookmarkString[0]);

    SetFont(BOOK_FONT());
    SetFontForeground(FONT_BLACK);
    SetFontBackground(FONT_BLACK);
    SetFontShadow(NO_SHADOW);

    // now draw the message
    DisplayWrappedString((DOWN_STRING_X - 42), (DOWN_STRING_Y + 20), BOOK_WIDTH + 45, 2, BOOK_FONT(), FONT_BLACK, pShowBookmarkString[1], FONT_BLACK, false, CENTER_JUSTIFIED);

    // invalidate region
    InvalidateRegion(DOWNLOAD_X, DOWNLOAD_Y, DOWNLOAD_X + 150, DOWNLOAD_Y + 100);
  } else if ((fOldShow == true) && (fShowBookmarkInfo == false)) {
    // MSYS_RemoveRegion( &gLapTopScreenRegion );
    fOldShow = false;
    fPausedReDrawScreenFlag = true;
  }

  SetFontShadow(DEFAULT_SHADOW);

  return;
}

function HandleWebBookMarkNotifyTimer(): void {
  /* static */ let iBaseTime: INT32 = 0;
  let iDifference: INT32 = 0;
  /* static */ let fOldShowBookMarkInfo: boolean = false;

  // check if maxing or mining?
  if ((fMaximizingProgram == true) || (fMinizingProgram == true)) {
    fOldShowBookMarkInfo |= fShowBookmarkInfo;
    fShowBookmarkInfo = false;
    return;
  }

  // if we were going to show this pop up, but were delayed, then do so now
  fShowBookmarkInfo |= fOldShowBookMarkInfo;

  // reset old flag
  fOldShowBookMarkInfo = false;

  // if current mode is too low, then reset
  if (guiCurrentLaptopMode < Enum95.LAPTOP_MODE_WWW) {
    fShowBookmarkInfo = false;
  }

  // if showing bookmarks, don't show help
  if (gfShowBookmarks == true) {
    fShowBookmarkInfo = false;
  }

  // check if flag false, is so, leave
  if (fShowBookmarkInfo == false) {
    iBaseTime = 0;
    return;
  }

  // check if this is the first time in here
  if (iBaseTime == 0) {
    iBaseTime = GetJA2Clock();
    return;
  }

  iDifference = GetJA2Clock() - iBaseTime;

  fReDrawBookMarkInfo = true;

  if (iDifference > DISPLAY_TIME_FOR_WEB_BOOKMARK_NOTIFY) {
    // waited long enough, stop showing
    iBaseTime = 0;
    fShowBookmarkInfo = false;
  }

  return;
}

export function ClearOutTempLaptopFiles(): void {
  // clear out all temp files from laptop

  // file file
  if ((FileExists("files.dat") == true)) {
    FileClearAttributes("files.dat");
    FileDelete("files.dat");
  }

  // finances
  if ((FileExists("finances.dat") == true)) {
    FileClearAttributes("finances.dat");
    FileDelete("finances.dat");
  }

  // email
  if ((FileExists("email.dat") == true)) {
    FileClearAttributes("email.dat");
    FileDelete("email.dat");
  }

  // history
  if ((FileExists("history.dat") == true)) {
    FileClearAttributes("history.dat");
    FileDelete("history.dat");
  }
}

export function SaveLaptopInfoToSavedGame(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let uiSize: UINT32;

  // Save The laptop information
  FileWrite(hFile, addressof(LaptopSaveInfo), sizeof(LaptopSaveInfoStruct), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(LaptopSaveInfoStruct)) {
    return false;
  }

  // If there is anything in the Bobby Ray Orders on Delivery
  if (LaptopSaveInfo.usNumberOfBobbyRayOrderUsed) {
    // Allocate memory for the information
    uiSize = sizeof(BobbyRayOrderStruct) * LaptopSaveInfo.usNumberOfBobbyRayOrderItems;

    // Load The laptop information
    FileWrite(hFile, LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray, uiSize, addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != uiSize) {
      return false;
    }
  }

  // If there is any Insurance Payouts in progress
  if (LaptopSaveInfo.ubNumberLifeInsurancePayoutUsed) {
    // Allocate memory for the information
    uiSize = sizeof(LIFE_INSURANCE_PAYOUT) * LaptopSaveInfo.ubNumberLifeInsurancePayouts;

    // Load The laptop information
    FileWrite(hFile, LaptopSaveInfo.pLifeInsurancePayouts, uiSize, addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != uiSize) {
      return false;
    }
  }

  return true;
}

export function LoadLaptopInfoFromSavedGame(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let uiSize: UINT32;

  // if there is memory allocated for the BobbyR orders
  if (LaptopSaveInfo.usNumberOfBobbyRayOrderItems) {
    //		if( !LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray )
    //			Assert( 0 );	//Should never happen

    // Free the memory
    if (LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray)
      MemFree(LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray);
    LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = null;
  }

  // if there is memory allocated for life insurance payouts
  if (LaptopSaveInfo.ubNumberLifeInsurancePayouts) {
    if (!LaptopSaveInfo.pLifeInsurancePayouts)
      Assert(0); // Should never happen

    // Free the memory
    MemFree(LaptopSaveInfo.pLifeInsurancePayouts);
    LaptopSaveInfo.pLifeInsurancePayouts = null;
  }

  // Load The laptop information
  FileRead(hFile, addressof(LaptopSaveInfo), sizeof(LaptopSaveInfoStruct), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(LaptopSaveInfoStruct)) {
    return false;
  }

  // If there is anything in the Bobby Ray Orders on Delivery
  if (LaptopSaveInfo.usNumberOfBobbyRayOrderUsed) {
    // Allocate memory for the information
    uiSize = sizeof(BobbyRayOrderStruct) * LaptopSaveInfo.usNumberOfBobbyRayOrderItems;

    LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = MemAlloc(uiSize);
    Assert(LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray);

    // Load The laptop information
    FileRead(hFile, LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray, uiSize, addressof(uiNumBytesRead));
    if (uiNumBytesRead != uiSize) {
      return false;
    }
  } else {
    LaptopSaveInfo.usNumberOfBobbyRayOrderItems = 0;
    LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = null;
  }

  // If there is any Insurance Payouts in progress
  if (LaptopSaveInfo.ubNumberLifeInsurancePayoutUsed) {
    // Allocate memory for the information
    uiSize = sizeof(LIFE_INSURANCE_PAYOUT) * LaptopSaveInfo.ubNumberLifeInsurancePayouts;

    LaptopSaveInfo.pLifeInsurancePayouts = MemAlloc(uiSize);
    Assert(LaptopSaveInfo.pLifeInsurancePayouts);

    // Load The laptop information
    FileRead(hFile, LaptopSaveInfo.pLifeInsurancePayouts, uiSize, addressof(uiNumBytesRead));
    if (uiNumBytesRead != uiSize) {
      return false;
    }
  } else {
    LaptopSaveInfo.ubNumberLifeInsurancePayouts = 0;
    LaptopSaveInfo.pLifeInsurancePayouts = null;
  }

  return true;
}

function LaptopSaveVariablesInit(): void {
}

function WWaitDelayIncreasedIfRaining(iUnitTime: INT32): INT32 {
  let iRetVal: INT32 = 0;

  if (guiEnvWeather & WEATHER_FORECAST_THUNDERSHOWERS) {
    iRetVal = (iUnitTime * 0.80);
  } else if (guiEnvWeather & WEATHER_FORECAST_SHOWERS) {
    iRetVal = (iUnitTime * 0.6);
  }

  return iRetVal;
}

function IsItRaining(): boolean {
  if (guiEnvWeather & WEATHER_FORECAST_SHOWERS || guiEnvWeather & WEATHER_FORECAST_THUNDERSHOWERS)
    return true;
  else
    return false;
}

function InternetRainDelayMessageBoxCallBack(bExitValue: UINT8): void {
  GoToWebPage(giRainDelayInternetSite);

  // Set to -2 so we dont due the message for this occurence of laptop
  giRainDelayInternetSite = -2;
}

function CreateBookMarkHelpText(pRegion: Pointer<MOUSE_REGION>, uiBookMarkID: UINT32): void {
  SetRegionFastHelpText(pRegion, gzLaptopHelpText[Enum376.BOOKMARK_TEXT_ASSOCIATION_OF_INTERNATION_MERCENARIES + uiBookMarkID]);
}

export function CreateFileAndNewEmailIconFastHelpText(uiHelpTextID: UINT32, fClearHelpText: boolean): void {
  let pRegion: Pointer<MOUSE_REGION>;

  switch (uiHelpTextID) {
    case Enum376.LAPTOP_BN_HLP_TXT_YOU_HAVE_NEW_MAIL:
      pRegion = addressof(gNewMailIconRegion);
      break;

    case Enum376.LAPTOP_BN_HLP_TXT_YOU_HAVE_NEW_FILE:
      pRegion = addressof(gNewFileIconRegion);
      break;

    default:
      Assert(0);
      return;
  }

  if (fClearHelpText)
    SetRegionFastHelpText(pRegion, "");
  else
    SetRegionFastHelpText(pRegion, gzLaptopHelpText[uiHelpTextID]);

  // fUnReadMailFlag
  // fNewFilesInFileViewer
}

function CreateLaptopButtonHelpText(iButtonIndex: INT32, uiButtonHelpTextID: UINT32): void {
  SetButtonFastHelpText(iButtonIndex, gzLaptopHelpText[uiButtonHelpTextID]);
}

}
