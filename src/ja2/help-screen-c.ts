namespace ja2 {

const HELP_SCREEN_ACTIVE = 0x00000001;

// The defualt size and placement of the screen
const HELP_SCREEN_DEFUALT_LOC_X = 155;
const HELP_SCREEN_DEFUALT_LOC_Y = 105;

const HELP_SCREEN_BUTTON_BORDER_WIDTH = 92;
const HELP_SCREEN_SMALL_LOC_WIDTH = 320;

const HELP_SCREEN_DEFUALT_LOC_WIDTH = HELP_SCREEN_SMALL_LOC_WIDTH + HELP_SCREEN_BUTTON_BORDER_WIDTH;
const HELP_SCREEN_DEFUALT_LOC_HEIGHT = 292; // 300

const HELP_SCREEN_SMALL_LOC_HEIGHT = HELP_SCREEN_DEFUALT_LOC_HEIGHT; // 224

const HELP_SCREEN_BTN_OFFSET_X = 11;
const HELP_SCREEN_BTN_OFFSET_Y = 12; // 50
const HELP_SCREEN_BTN_FONT_ON_COLOR = 73;
const HELP_SCREEN_BTN_FONT_OFF_COLOR = FONT_MCOLOR_WHITE;

const HELP_SCREEN_BTN_FONT_BACK_COLOR = 50;
const HELP_SCREEN_BTN_FONT = () => FONT10ARIAL();

const HELP_SCREEN_BTN_WIDTH = 77;
const HELP_SCREEN_BTN_HEIGHT = 22;
const HELP_SCREEN_GAP_BN_BTNS = 8;

const HELP_SCREEN_MARGIN_SIZE = 10;
const HELP_SCREEN_TEXT_RIGHT_MARGIN_SPACE = 36;
const HELP_SCREEN_TEXT_LEFT_MARGIN_WITH_BTN = (HELP_SCREEN_BUTTON_BORDER_WIDTH + 5 + HELP_SCREEN_MARGIN_SIZE);
const HELP_SCREEN_TEXT_LEFT_MARGIN = (5 + HELP_SCREEN_MARGIN_SIZE);

const HELP_SCREEN_TEXT_OFFSET_Y = 48;
const HELP_SCREEN_GAP_BTN_LINES = 2;

const HELP_SCREEN_TITLE_BODY_FONT = () => FONT12ARIAL();
const HELP_SCREEN_TITLE_BODY_COLOR = FONT_MCOLOR_WHITE; // FONT_NEARBLACK

const HELP_SCREEN_TEXT_BODY_FONT = () => FONT10ARIAL();
const HELP_SCREEN_TEXT_BODY_COLOR = FONT_MCOLOR_WHITE; // FONT_NEARBLACK
const HELP_SCREEN_TEXT_BACKGROUND = 0; // NO_SHADOW//FONT_MCOLOR_WHITE

const HELP_SCREEN_TITLE_OFFSET_Y = 7;
const HELP_SCREEN_HELP_REMINDER_Y = HELP_SCREEN_TITLE_OFFSET_Y + 15;

const HELP_SCREEN_NUM_BTNS = 8;

const HELP_SCREEN_SHOW_HELP_AGAIN_REGION_OFFSET_X = 4;
const HELP_SCREEN_SHOW_HELP_AGAIN_REGION_OFFSET_Y = 18;
const HELP_SCREEN_SHOW_HELP_AGAIN_REGION_TEXT_OFFSET_X = 25 + HELP_SCREEN_SHOW_HELP_AGAIN_REGION_OFFSET_X;
const HELP_SCREEN_SHOW_HELP_AGAIN_REGION_TEXT_OFFSET_Y = (HELP_SCREEN_SHOW_HELP_AGAIN_REGION_OFFSET_Y);

const HELP_SCREEN_EXIT_BTN_OFFSET_X = 291;
const HELP_SCREEN_EXIT_BTN_LOC_Y = 9;

// the type of help screen
const HLP_SCRN_DEFAULT_TYPE = 9;
const HLP_SCRN_BUTTON_BORDER = 8;

// this is the size of the text buffer where everything will be blitted.
// 2 ( bytest for char ) * width of buffer * height of 1 line * # of text lines
//#define	HLP_SCRN__NUMBER_BYTES_IN_TEXT_BUFFER						( 2 * HLP_SCRN__WIDTH_OF_TEXT_BUFFER * HLP_SCRN__HEIGHT_OF_1_LINE_IN_BUFFER * HLP_SCRN__MAX_NUMBER_OF_LINES_IN_BUFFER )
const HLP_SCRN__WIDTH_OF_TEXT_BUFFER = 280;
const HLP_SCRN__MAX_NUMBER_OF_LINES_IN_BUFFER = 170; // 100
const HLP_SCRN__HEIGHT_OF_1_LINE_IN_BUFFER = () => (GetFontHeight(HELP_SCREEN_TEXT_BODY_FONT()) + HELP_SCREEN_GAP_BTN_LINES);
const HLP_SCRN__MAX_NUMBER_PIXELS_DISPLAYED_IN_TEXT_BUFFER = HELP_SCREEN_DEFUALT_LOC_HEIGHT;
const HLP_SCRN__HEIGHT_OF_TEXT_BUFFER = () => (HLP_SCRN__HEIGHT_OF_1_LINE_IN_BUFFER() * HLP_SCRN__MAX_NUMBER_OF_LINES_IN_BUFFER);

const HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER = () => (HLP_SCRN__HEIGHT_OF_TEXT_AREA / HLP_SCRN__HEIGHT_OF_1_LINE_IN_BUFFER());

const HLP_SCRN__HEIGHT_OF_TEXT_AREA = 228;

const HLP_SCRN__HEIGHT_OF_SCROLL_AREA = 182;
const HLP_SCRN__WIDTH_OF_SCROLL_AREA = 20;
const HLP_SCRN__SCROLL_POSX = 292;
const HLP_SCRN__SCROLL_POSY = () => (gHelpScreen.usScreenLocY + 63);

const HLP_SCRN__SCROLL_UP_ARROW_X = 292;
const HLP_SCRN__SCROLL_UP_ARROW_Y = 43;

const HLP_SCRN__SCROLL_DWN_ARROW_X = HLP_SCRN__SCROLL_UP_ARROW_X;
const HLP_SCRN__SCROLL_DWN_ARROW_Y = HLP_SCRN__SCROLL_UP_ARROW_Y + 202;

// enums for the different dirty levels
const enum Enum10 {
  HLP_SCRN_DRTY_LVL_NOT_DIRTY,
  HLP_SCRN_DRTY_LVL_REFRESH_TEXT,
  HLP_SCRN_DRTY_LVL_REFRESH_ALL,
}

// new screen:

const enum Enum11 {
  HLP_SCRN_MPSCRN_SCTR_OVERVIEW,
}

// mapscreen, welcome to arulco
const enum Enum12 {
  HLP_SCRN_MPSCRN_OVERVIEW,
  HLP_SCRN_MPSCRN_ASSIGNMENTS,
  HLP_SCRN_MPSCRN_DESTINATIONS,
  HLP_SCRN_MPSCRN_MAP,
  HLP_SCRN_MPSCRN_MILITIA,
  HLP_SCRN_MPSCRN_AIRSPACE,
  HLP_SCRN_MPSCRN_ITEMS,
  HLP_SCRN_MPSCRN_KEYBOARD,

  HLP_SCRN_NUM_MPSCRN_BTNS,
}
// laptop sub pages
const enum Enum13 {
  HLP_SCRN_LPTP_OVERVIEW,
  HLP_SCRN_LPTP_EMAIL,
  HLP_SCRN_LPTP_WEB,
  HLP_SCRN_LPTP_FILES,
  HLP_SCRN_LPTP_HISTORY,
  HLP_SCRN_LPTP_PERSONNEL,
  HLP_SCRN_LPTP_FINANCIAL,
  HLP_SCRN_LPTP_MERC_STATS,

  HLP_SCRN_LPTP_NUM_PAGES,
}

// Mapscreen no one hired yet pages
const enum Enum14 {
  HLP_SCRN_NO_ONE_HIRED,

  HLP_SCRN_NUM_MAPSCREEN_NO_1_HIRED_YET_PAGES,
}

// mapscreen no 1 hired yet pages
const enum Enum15 {
  HLP_SCRN_NOT_IN_ARULCO,

  HLP_SCRN_NUM_NOT_IN_ARULCO_PAGES,
}

// Tactical
const enum Enum16 {
  HLP_SCRN_TACTICAL_OVERVIEW,
  HLP_SCRN_TACTICAL_MOVEMENT,
  HLP_SCRN_TACTICAL_SIGHT,
  HLP_SCRN_TACTICAL_ATTACKING,
  HLP_SCRN_TACTICAL_ITEMS,
  HLP_SCRN_TACTICAL_KEYBOARD,

  HLP_SCRN_NUM_TACTICAL_PAGES,
}

// ddd

export let gHelpScreen: HELP_SCREEN_STRUCT = createHelpScreenStruct();

interface HELP_SCREEN_BTN_TEXT_RECORD {
  iButtonTextNum: INT32[] /* [HELP_SCREEN_NUM_BTNS] */;
}

function createHelpScreenBtnTextRecordFrom(iButtonTextNum: INT32[]): HELP_SCREEN_BTN_TEXT_RECORD {
  return {
    iButtonTextNum,
  };
}

// An array of record nums for the text on the help buttons
let gHelpScreenBtnTextRecordNum: HELP_SCREEN_BTN_TEXT_RECORD[] /* [HELP_SCREEN_NUMBER_OF_HELP_SCREENS] */ = [
  // new screen:

  // Laptop button record nums
  //	HELP_SCREEN_LAPTOP,
  createHelpScreenBtnTextRecordFrom([
    Enum18.HLP_TXT_LAPTOP_BUTTON_1,
    Enum18.HLP_TXT_LAPTOP_BUTTON_2,
    Enum18.HLP_TXT_LAPTOP_BUTTON_3,
    Enum18.HLP_TXT_LAPTOP_BUTTON_4,
    Enum18.HLP_TXT_LAPTOP_BUTTON_5,
    Enum18.HLP_TXT_LAPTOP_BUTTON_6,
    Enum18.HLP_TXT_LAPTOP_BUTTON_7,
    Enum18.HLP_TXT_LAPTOP_BUTTON_8,
  ]),

  //	HELP_SCREEN_MAPSCREEN,
  createHelpScreenBtnTextRecordFrom([
    Enum18.HLP_TXT_WELCOM_TO_ARULCO_BUTTON_1,
    Enum18.HLP_TXT_WELCOM_TO_ARULCO_BUTTON_2,
    Enum18.HLP_TXT_WELCOM_TO_ARULCO_BUTTON_3,
    Enum18.HLP_TXT_WELCOM_TO_ARULCO_BUTTON_4,
    Enum18.HLP_TXT_WELCOM_TO_ARULCO_BUTTON_5,
    Enum18.HLP_TXT_WELCOM_TO_ARULCO_BUTTON_6,
    Enum18.HLP_TXT_WELCOM_TO_ARULCO_BUTTON_7,
    Enum18.HLP_TXT_WELCOM_TO_ARULCO_BUTTON_8,
  ]),

  //	HELP_SCREEN_MAPSCREEN_NO_ONE_HIRED,
  createHelpScreenBtnTextRecordFrom([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ]),

  //	HELP_SCREEN_MAPSCREEN_NOT_IN_ARULCO,
  createHelpScreenBtnTextRecordFrom([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ]),

  //	HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY,
  createHelpScreenBtnTextRecordFrom([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ]),

  //	HELP_SCREEN_TACTICAL,
  createHelpScreenBtnTextRecordFrom([
    Enum18.HLP_TXT_TACTICAL_BUTTON_1,
    Enum18.HLP_TXT_TACTICAL_BUTTON_2,
    Enum18.HLP_TXT_TACTICAL_BUTTON_3,
    Enum18.HLP_TXT_TACTICAL_BUTTON_4,
    Enum18.HLP_TXT_TACTICAL_BUTTON_5,
    Enum18.HLP_TXT_TACTICAL_BUTTON_6,
    -1,
    -1,
  ]),

  //	HELP_SCREEN_OPTIONS,
  createHelpScreenBtnTextRecordFrom([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ]),

  //	HELP_SCREEN_LOAD_GAME,
  createHelpScreenBtnTextRecordFrom([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ]),
];

let gfHelpScreenEntry: boolean = true;
let gfHelpScreenExit: boolean = false;

let guiHelpScreenBackGround: UINT32;
let guiHelpScreenTextBufferSurface: UINT32;

let gfScrollBoxIsScrolling: boolean = false;

let gfHaveRenderedFirstFrameToSaveBuffer: boolean = false;

//  must use this cause you have ur cursor over a button when entering the help screen, the button will burn though.
// It does this cause that region loses it focus so it draws the button again.
let gubRenderHelpScreenTwiceInaRow: UINT8 = 0;

// mmm

// region to mask the background
let gHelpScreenFullScreenMask: MOUSE_REGION = createMouseRegion();
// void SelectHelpTextFullScreenMaskCallBack(MOUSE_REGION * pRegion, INT32 iReason );

// region to mask the background
let gHelpScreenScrollArea: MOUSE_REGION = createMouseRegion();

// region to mask the background
let gHelpScreenScrollAreaArrows: MOUSE_REGION = createMouseRegion();

// checkbox to toggle show help again toggle
let gHelpScreenDontShowHelpAgainToggle: UINT32;
// MOUSE_REGION    HelpScreenDontShowHelpAgainToggleTextRegion;
// void		HelpScreenDontShowHelpAgainToggleTextRegionCallBack(MOUSE_REGION * pRegion, INT32 iReason );

let giHelpScreenButtonsImage: INT32[] /* [HELP_SCREEN_NUM_BTNS] */;
let guiHelpScreenBtns: UINT32[] /* [HELP_SCREEN_NUM_BTNS] */;

let giExitBtnImage: INT32;
let guiHelpScreenExitBtn: UINT32;

let giHelpScreenScrollArrows: INT32[] /* [2] */;
let guiHelpScreenScrollArrowImage: UINT32[] /* [2] */;

// ggg

// ppp

export function InitHelpScreenSystem(): void {
  // set some values
  resetHelpScreenStruct(gHelpScreen);

  // set it up so we can enter the screen
  gfHelpScreenEntry = true;
  gfHelpScreenExit = false;

  gHelpScreen.bCurrentHelpScreenActiveSubPage = -1;

  gHelpScreen.fHaveAlreadyBeenInHelpScreenSinceEnteringCurrenScreen = false;
}

export function ShouldTheHelpScreenComeUp(ubScreenID: UINT8, fForceHelpScreenToComeUp: boolean): boolean {
  // if the screen is being forsced to come up ( user pressed 'h' )
  if (fForceHelpScreenToComeUp) {
    // Set thefact that the user broughtthe help screen up
    gHelpScreen.fForceHelpScreenToComeUp = true;

    goto("HELP_SCREEN_SHOULD_COME_UP");
  }

  // if we are already in the help system, return true
  if (gHelpScreen.uiFlags & HELP_SCREEN_ACTIVE) {
    return true;
  }

  // has the player been in the screen before
  if ((gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen >> ubScreenID) & 0x01) {
    goto("HELP_SCREEN_WAIT_1_FRAME");
  }

  // if we have already been in the screen, and the user DIDNT press 'h', leave
  if (gHelpScreen.fHaveAlreadyBeenInHelpScreenSinceEnteringCurrenScreen) {
    return false;
  }

  // should the screen come up, based on the users choice for it automatically coming up
  //	if( !( gHelpScreen.fHideHelpInAllScreens ) )
  {
    //		goto HELP_SCREEN_WAIT_1_FRAME;
  }

  // the help screen shouldnt come up
  return false;

HELP_SCREEN_WAIT_1_FRAME:

  // we have to wait 1 frame while the screen renders
  if (gHelpScreen.bDelayEnteringHelpScreenBy1FrameCount < 2) {
    gHelpScreen.bDelayEnteringHelpScreenBy1FrameCount += 1;

    UnmarkButtonsDirty();

    return false;
  }

HELP_SCREEN_SHOULD_COME_UP:

  // Record which screen it is

  // if its mapscreen
  if (ubScreenID == Enum17.HELP_SCREEN_MAPSCREEN) {
    // determine which screen it is ( is any mercs hired, did game just start )
    gHelpScreen.bCurrentHelpScreen = HelpScreenDetermineWhichMapScreenHelpToShow();
  } else {
    gHelpScreen.bCurrentHelpScreen = ubScreenID;
  }

  // mark it that the help screnn is enabled
  gHelpScreen.uiFlags |= HELP_SCREEN_ACTIVE;

  // reset
  gHelpScreen.bDelayEnteringHelpScreenBy1FrameCount = 0;

  return true;
}

export function HelpScreenHandler(): void {
  // if we are just entering the help screen
  if (gfHelpScreenEntry) {
    // setup the help screen
    EnterHelpScreen();

    gfHelpScreenEntry = false;
    gfHelpScreenExit = false;
  }

  RestoreBackgroundRects();

  // get the mouse and keyboard inputs
  GetHelpScreenUserInput();

  // handle the help screen
  HandleHelpScreen();

  // if the help screen is dirty, re-render it
  if (gHelpScreen.ubHelpScreenDirty != Enum10.HLP_SCRN_DRTY_LVL_NOT_DIRTY) {
    // temp
    //		gHelpScreen.ubHelpScreenDirty = HLP_SCRN_DRTY_LVL_REFRESH_ALL;

    RenderHelpScreen();
    gHelpScreen.ubHelpScreenDirty = Enum10.HLP_SCRN_DRTY_LVL_NOT_DIRTY;
  }

  // render buttons marked dirty
  //  MarkButtonsDirty( );
  RenderButtons();

  SaveBackgroundRects();
  RenderButtonsFastHelp();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  // if we are leaving the help screen
  if (gfHelpScreenExit) {
    gfHelpScreenExit = false;

    gfHelpScreenEntry = true;

    // exit mouse regions etc..
    ExitHelpScreen();

    // reset the helpscreen id
    gHelpScreen.bCurrentHelpScreen = -1;
  }
}

function EnterHelpScreen(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let usPosX: UINT16;
  let usPosY: UINT16; //, usWidth, usHeight;
  //	INT32	iStartLoc;
  //	CHAR16 zText[1024];

  // Clear out all the save background rects
  EmptyBackgroundRects();

  UnmarkButtonsDirty();

  // remeber if the game was paused or not ( so when we exit we know what to do )
  gHelpScreen.fWasTheGamePausedPriorToEnteringHelpScreen = gfGamePaused;

  // pause the game
  PauseGame();

  // Determine the help screen size, based off the help screen
  SetSizeAndPropertiesOfHelpScreen();

  // Create a mouse region 'mask' the entrire screen
  MSYS_DefineRegion(gHelpScreenFullScreenMask, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST, gHelpScreen.usCursor, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  MSYS_AddRegion(gHelpScreenFullScreenMask);

  // Create the exit button
  if (gHelpScreen.bNumberOfButtons != 0)
    usPosX = gHelpScreen.usScreenLocX + HELP_SCREEN_EXIT_BTN_OFFSET_X + HELP_SCREEN_BUTTON_BORDER_WIDTH;
  else
    usPosX = gHelpScreen.usScreenLocX + HELP_SCREEN_EXIT_BTN_OFFSET_X;

  usPosY = gHelpScreen.usScreenLocY + HELP_SCREEN_EXIT_BTN_LOC_Y;

  // Create the exit buttons
  giExitBtnImage = LoadButtonImage("INTERFACE\\HelpScreen.sti", -1, 0, 4, 2, 6);

  guiHelpScreenExitBtn = CreateIconAndTextButton(giExitBtnImage, "", HELP_SCREEN_BTN_FONT(), HELP_SCREEN_BTN_FONT_ON_COLOR, DEFAULT_SHADOW, HELP_SCREEN_BTN_FONT_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, usPosX, usPosY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), BtnHelpScreenExitCallback);
  SetButtonFastHelpText(guiHelpScreenExitBtn, gzHelpScreenText[Enum377.HLP_SCRN_TXT__EXIT_SCREEN]);
  SetButtonCursor(guiHelpScreenExitBtn, gHelpScreen.usCursor);

  // Create the buttons needed for the screen
  CreateHelpScreenButtons();

  // if there are buttons
  if (gHelpScreen.bNumberOfButtons != 0)
    usPosX = gHelpScreen.usScreenLocX + HELP_SCREEN_SHOW_HELP_AGAIN_REGION_OFFSET_X + HELP_SCREEN_BUTTON_BORDER_WIDTH;
  else
    usPosX = gHelpScreen.usScreenLocX + HELP_SCREEN_SHOW_HELP_AGAIN_REGION_OFFSET_X;

  usPosY = gHelpScreen.usScreenLocY + gHelpScreen.usScreenHeight - HELP_SCREEN_SHOW_HELP_AGAIN_REGION_OFFSET_Y;

  if (!gHelpScreen.fForceHelpScreenToComeUp) {
    gHelpScreenDontShowHelpAgainToggle = CreateCheckBoxButton(usPosX, (usPosY - 3), "INTERFACE\\OptionsCheckBoxes.sti", MSYS_PRIORITY_HIGHEST, BtnHelpScreenDontShowHelpAgainCallback);

    SetButtonCursor(gHelpScreenDontShowHelpAgainToggle, gHelpScreen.usCursor);

    // Set the state of the chec box
    if (gGameSettings.fHideHelpInAllScreens)
      ButtonList[gHelpScreenDontShowHelpAgainToggle].uiFlags |= BUTTON_CLICKED_ON;
    else
      ButtonList[gHelpScreenDontShowHelpAgainToggle].uiFlags &= ~BUTTON_CLICKED_ON;
  }

  /*
          ///creatre a region for the text that says ' [ x ] click to continue seeing ....'
          iStartLoc = HELPSCREEN_RECORD_SIZE * HLP_TXT_CONSTANT_FOOTER;
          LoadEncryptedDataFromFile(HELPSCREEN_FILE, zText, iStartLoc, HELPSCREEN_RECORD_SIZE );

          usWidth = StringPixLength( zText, HELP_SCREEN_TEXT_BODY_FONT );
          usHeight = GetFontHeight( HELP_SCREEN_TEXT_BODY_FONT );

  /*
          MSYS_DefineRegion( &HelpScreenDontShowHelpAgainToggleTextRegion, usPosX, usPosY, (UINT16)(usPosX+usWidth), (UINT16)(usPosY+usHeight), MSYS_PRIORITY_HIGHEST-1,
                                                           gHelpScreen.usCursor, MSYS_NO_CALLBACK, HelpScreenDontShowHelpAgainToggleTextRegionCallBack );
    MSYS_AddRegion( &HelpScreenDontShowHelpAgainToggleTextRegion );
  */

  // load the help screen background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\HelpScreen.sti");
  if (!(guiHelpScreenBackGround = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // create the text buffer
  CreateHelpScreenTextBuffer();

  // make sure we redraw everything
  gHelpScreen.ubHelpScreenDirty = Enum10.HLP_SCRN_DRTY_LVL_REFRESH_ALL;

  // mark it that we have been in since we enter the current screen
  gHelpScreen.fHaveAlreadyBeenInHelpScreenSinceEnteringCurrenScreen = true;

  // set the fact that we have been to the screen
  gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen &= ~(1 << gHelpScreen.bCurrentHelpScreen);

  // always start at the top
  gHelpScreen.iLineAtTopOfTextBuffer = 0;

  // set it so there was no previous click
  gHelpScreen.iLastMouseClickY = -1;

  // Create the scroll box, and scroll arrow regions/buttons
  CreateScrollAreaButtons();

  // render the active page to the text buffer
  ChangeHelpScreenSubPage();

  // reset scroll box flag
  gfScrollBoxIsScrolling = false;

  // reset first frame buffer
  gfHaveRenderedFirstFrameToSaveBuffer = false;

  gubRenderHelpScreenTwiceInaRow = 0;

  return true;
}

function HandleHelpScreen(): void {
  // if any of the possible screens need to have a some code done every loop..  its done in here
  SpecialHandlerCode();

  if (gfScrollBoxIsScrolling) {
    if (gfLeftButtonState) {
      HelpScreenMouseMoveScrollBox(gusMouseYPos);
    } else {
      gfScrollBoxIsScrolling = false;
      gHelpScreen.iLastMouseClickY = -1;
    }
  }

  if (gubRenderHelpScreenTwiceInaRow < 3) {
    // test
    //		gHelpScreen.ubHelpScreenDirty = HLP_SCRN_DRTY_LVL_REFRESH_ALL;

    gubRenderHelpScreenTwiceInaRow++;

    UnmarkButtonsDirty();
  }

  // refresh all of help screens buttons
  RefreshAllHelpScreenButtons();
}

function RenderHelpScreen(): void {
  // rrr

  if (gfHaveRenderedFirstFrameToSaveBuffer) {
    // Restore the background before blitting the text back on
    RestoreExternBackgroundRect(gHelpScreen.usScreenLocX, gHelpScreen.usScreenLocY, gHelpScreen.usScreenWidth, gHelpScreen.usScreenHeight);
  }

  if (gHelpScreen.ubHelpScreenDirty == Enum10.HLP_SCRN_DRTY_LVL_REFRESH_ALL) {
    // Display the helpscreen background
    DrawHelpScreenBackGround();

    // Display the current screens title, and footer info
    DisplayCurrentScreenTitleAndFooter();
  }

  if (!gfHaveRenderedFirstFrameToSaveBuffer) {
    gfHaveRenderedFirstFrameToSaveBuffer = true;

    // blit everything to the save buffer ( cause the save buffer can bleed through )
    BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, gHelpScreen.usScreenLocX, gHelpScreen.usScreenLocY, (gHelpScreen.usScreenLocX + gHelpScreen.usScreenWidth), (gHelpScreen.usScreenLocY + gHelpScreen.usScreenHeight));

    UnmarkButtonsDirty();
  }

  // render the text buffer to the screen
  if (gHelpScreen.ubHelpScreenDirty >= Enum10.HLP_SCRN_DRTY_LVL_REFRESH_TEXT) {
    RenderTextBufferToScreen();
  }
}

function ExitHelpScreen(): void {
  let i: INT32;

  if (!gHelpScreen.fForceHelpScreenToComeUp) {
    // Get the current value of the checkbox
    if (ButtonList[gHelpScreenDontShowHelpAgainToggle].uiFlags & BUTTON_CLICKED_ON) {
      gGameSettings.fHideHelpInAllScreens = true;
      gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen = 0;
    } else {
      gGameSettings.fHideHelpInAllScreens = false;
    }

    // remove the mouse region for the '[ ] dont show help...'
    RemoveButton(gHelpScreenDontShowHelpAgainToggle);
  }

  // mark it that the help screen is not active
  gHelpScreen.uiFlags &= ~HELP_SCREEN_ACTIVE;

  // remove the mouse region that blankets
  MSYS_RemoveRegion(gHelpScreenFullScreenMask);

  // checkbox to toggle show help again toggle
  //	MSYS_RemoveRegion( &HelpScreenDontShowHelpAgainToggleTextRegion );

  // remove the hepl graphic
  DeleteVideoObjectFromIndex(guiHelpScreenBackGround);

  // remove the exit button
  RemoveButton(guiHelpScreenExitBtn);

  // if there are any buttons, remove them
  if (gHelpScreen.bNumberOfButtons != 0) {
    for (i = 0; i < gHelpScreen.bNumberOfButtons; i++) {
      UnloadButtonImage(giHelpScreenButtonsImage[i]);
      RemoveButton(guiHelpScreenBtns[i]);
    }
  }

  // destroy the text buffer for the help screen
  DestroyHelpScreenTextBuffer();

  // Handles the dirtying of any special screen we are about to reenter
  HelpScreenSpecialExitCode();

  // if the game was NOT paused
  if (gHelpScreen.fWasTheGamePausedPriorToEnteringHelpScreen == false) {
    // un pause the game
    UnPauseGame();
  }

  // Delete the scroll box, and scroll arrow regions/buttons
  DeleteScrollArrowButtons();

  // reset
  gHelpScreen.fForceHelpScreenToComeUp = false;

  SaveGameSettings();
}

function DrawHelpScreenBackGround(): boolean {
  let hPixHandle: SGPVObject;
  let usPosX: UINT16;

  // Get and display the background image
  hPixHandle = GetVideoObject(guiHelpScreenBackGround);

  usPosX = gHelpScreen.usScreenLocX;

  // if there are buttons, blit the button border
  if (gHelpScreen.bNumberOfButtons != 0) {
    BltVideoObject(FRAME_BUFFER, hPixHandle, HLP_SCRN_BUTTON_BORDER, usPosX, gHelpScreen.usScreenLocY, VO_BLT_SRCTRANSPARENCY, null);
    usPosX += HELP_SCREEN_BUTTON_BORDER_WIDTH;
  }

  BltVideoObject(FRAME_BUFFER, hPixHandle, HLP_SCRN_DEFAULT_TYPE, usPosX, gHelpScreen.usScreenLocY, VO_BLT_SRCTRANSPARENCY, null);

  InvalidateRegion(gHelpScreen.usScreenLocX, gHelpScreen.usScreenLocY, gHelpScreen.usScreenLocX + gHelpScreen.usScreenWidth, gHelpScreen.usScreenLocY + gHelpScreen.usScreenHeight);

  return true;
}

function SetSizeAndPropertiesOfHelpScreen(): void {
  // new screen:
  gHelpScreen.bNumberOfButtons = 0;

  //
  // these are the default settings, so if the screen uses different then defualt, set them in the switch
  //
  {
    gHelpScreen.usScreenWidth = HELP_SCREEN_DEFUALT_LOC_WIDTH;
    gHelpScreen.usScreenHeight = HELP_SCREEN_DEFUALT_LOC_HEIGHT;

    gHelpScreen.usScreenLocX = (640 - gHelpScreen.usScreenWidth) / 2;
    gHelpScreen.usScreenLocY = (480 - gHelpScreen.usScreenHeight) / 2;

    gHelpScreen.bCurrentHelpScreenActiveSubPage = 0;

    gHelpScreen.usCursor = Enum317.CURSOR_NORMAL;
  }

  switch (gHelpScreen.bCurrentHelpScreen) {
    case Enum17.HELP_SCREEN_LAPTOP:
      gHelpScreen.bNumberOfButtons = Enum13.HLP_SCRN_LPTP_NUM_PAGES;
      gHelpScreen.usCursor = Enum317.CURSOR_LAPTOP_SCREEN;

      // center the screen inside the laptop screen
      gHelpScreen.usScreenLocX = LAPTOP_SCREEN_UL_X + (LAPTOP_SCREEN_WIDTH - gHelpScreen.usScreenWidth) / 2;
      gHelpScreen.usScreenLocY = LAPTOP_SCREEN_UL_Y + (LAPTOP_SCREEN_HEIGHT - gHelpScreen.usScreenHeight) / 2;

      break;
    case Enum17.HELP_SCREEN_MAPSCREEN:
      gHelpScreen.bNumberOfButtons = Enum12.HLP_SCRN_NUM_MPSCRN_BTNS;

      // calc the center position based on the current panel thats being displayed
      gHelpScreen.usScreenLocY = (gsVIEWPORT_END_Y - gHelpScreen.usScreenHeight) / 2;
      break;
    case Enum17.HELP_SCREEN_TACTICAL:
      gHelpScreen.bNumberOfButtons = Enum16.HLP_SCRN_NUM_TACTICAL_PAGES;

      // calc the center position based on the current panel thats being displayed
      gHelpScreen.usScreenLocY = (gsVIEWPORT_END_Y - gHelpScreen.usScreenHeight) / 2;
      break;

    case Enum17.HELP_SCREEN_MAPSCREEN_NO_ONE_HIRED:
    case Enum17.HELP_SCREEN_MAPSCREEN_NOT_IN_ARULCO:
    case Enum17.HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY:
      gHelpScreen.usScreenWidth = HELP_SCREEN_SMALL_LOC_WIDTH;
      gHelpScreen.usScreenHeight = HELP_SCREEN_SMALL_LOC_HEIGHT;

      // calc screen position since we just set the width and height
      gHelpScreen.usScreenLocX = (640 - gHelpScreen.usScreenWidth) / 2;

      // calc the center position based on the current panel thats being displayed
      gHelpScreen.usScreenLocY = (gsVIEWPORT_END_Y - gHelpScreen.usScreenHeight) / 2;

      gHelpScreen.bNumberOfButtons = 0;
      gHelpScreen.bCurrentHelpScreenActiveSubPage = 0;
      break;

    case Enum17.HELP_SCREEN_OPTIONS:
    case Enum17.HELP_SCREEN_LOAD_GAME:
      break;

    default:
      break;
  }

  // if there are buttons
  if (gHelpScreen.bNumberOfButtons != 0)
    gHelpScreen.usLeftMarginPosX = gHelpScreen.usScreenLocX + HELP_SCREEN_TEXT_LEFT_MARGIN_WITH_BTN;
  else
    gHelpScreen.usLeftMarginPosX = gHelpScreen.usScreenLocX + HELP_SCREEN_TEXT_LEFT_MARGIN;
}

function CreateHelpScreenButtons(): void {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let sText: string /* CHAR16[1024] */;
  let i: INT32;

  // if there are buttons to create
  if (gHelpScreen.bNumberOfButtons != 0) {
    usPosX = gHelpScreen.usScreenLocX + HELP_SCREEN_BTN_OFFSET_X;
    usPosY = HELP_SCREEN_BTN_OFFSET_Y + gHelpScreen.usScreenLocY;

    // loop through all the buttons, and create them
    for (i = 0; i < gHelpScreen.bNumberOfButtons; i++) {
      // get the text for the button
      sText = GetHelpScreenText(gHelpScreenBtnTextRecordNum[gHelpScreen.bCurrentHelpScreen].iButtonTextNum[i]);

      /*
                              guiHelpScreenBtns[i] = CreateTextButton( sText, HELP_SCREEN_BTN_FONT, HELP_SCREEN_BTN_FONT_COLOR, HELP_SCREEN_BTN_FONT_BACK_COLOR,
                                              BUTTON_USE_DEFAULT, usPosX, usPosY, HELP_SCREEN_BTN_WIDTH, HELP_SCREEN_BTN_HEIGHT,
                                              BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, BUTTON_NO_CALLBACK, BtnHelpScreenBtnsCallback );
      */

      giHelpScreenButtonsImage[i] = UseLoadedButtonImage(giExitBtnImage, -1, 1, 5, 3, 7);

      guiHelpScreenBtns[i] = CreateIconAndTextButton(giHelpScreenButtonsImage[i], sText, HELP_SCREEN_BTN_FONT(), HELP_SCREEN_BTN_FONT_ON_COLOR, DEFAULT_SHADOW, HELP_SCREEN_BTN_FONT_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, usPosX, usPosY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), BtnHelpScreenBtnsCallback);

      SetButtonCursor(guiHelpScreenBtns[i], gHelpScreen.usCursor);
      MSYS_SetBtnUserData(guiHelpScreenBtns[i], 0, i);

      //	SpecifyButtonTextOffsets( guiHelpScreenBtns[i], 19, 9, TRUE );

      usPosY += HELP_SCREEN_BTN_HEIGHT + HELP_SCREEN_GAP_BN_BTNS;
    }

    ButtonList[guiHelpScreenBtns[0]].uiFlags |= BUTTON_CLICKED_ON;
  }
}

function GetHelpScreenUserInput(): void {
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

    if (!HandleTextInput(Event) && Event.usEvent == KEY_UP) {
      switch (Event.usParam) {
        case ESC:
          PrepareToExitHelpScreen();
          break;

        case DNARROW: {
          ChangeTopLineInTextBufferByAmount(1);
        } break;

        case UPARROW: {
          ChangeTopLineInTextBufferByAmount(-1);
        } break;

        case PGUP: {
          ChangeTopLineInTextBufferByAmount(-(HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER() - 1));
        } break;
        case PGDN: {
          ChangeTopLineInTextBufferByAmount((HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER() - 1));
        } break;

        case LEFTARROW:
          ChangeToHelpScreenSubPage((gHelpScreen.bCurrentHelpScreenActiveSubPage - 1));
          break;

        case RIGHTARROW:
          ChangeToHelpScreenSubPage((gHelpScreen.bCurrentHelpScreenActiveSubPage + 1));
          break;

          /*

                                          case LEFTARROW:
                                          {
                                          }
                                                  break;

                                          case RIGHTARROW:
                                          {
                                          }
                                                  break;
          */
      }
    }

    if (!HandleTextInput(Event) && Event.usEvent == KEY_REPEAT) {
      switch (Event.usParam) {
        case DNARROW: {
          ChangeTopLineInTextBufferByAmount(1);
        } break;

        case UPARROW: {
          ChangeTopLineInTextBufferByAmount(-1);
        } break;

        case PGUP: {
          ChangeTopLineInTextBufferByAmount(-(HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER() - 1));
        } break;
        case PGDN: {
          ChangeTopLineInTextBufferByAmount((HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER() - 1));
        } break;
      }
    }
  }
}

// Handles anything spcial that must be done when exiting the specific screen we are about to reenter ( eg. dirtying of the screen )
function HelpScreenSpecialExitCode(): void {
  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreen) {
    case Enum17.HELP_SCREEN_LAPTOP:
      fReDrawScreenFlag = true;
      break;

    case Enum17.HELP_SCREEN_MAPSCREEN_NO_ONE_HIRED:
    case Enum17.HELP_SCREEN_MAPSCREEN_NOT_IN_ARULCO:
    case Enum17.HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY:
    case Enum17.HELP_SCREEN_MAPSCREEN:
      fCharacterInfoPanelDirty = true;
      fTeamPanelDirty = true;
      fMapScreenBottomDirty = true;
      fMapPanelDirty = true;
      break;

    case Enum17.HELP_SCREEN_TACTICAL:
      fInterfacePanelDirty = DIRTYLEVEL2;
      SetRenderFlags(RENDER_FLAG_FULL);
      break;

    case Enum17.HELP_SCREEN_OPTIONS:
      break;
    case Enum17.HELP_SCREEN_LOAD_GAME:
      break;

    default:
      break;
  }
}

function PrepareToExitHelpScreen(): void {
  gfHelpScreenExit = true;
}

// Handles anything special that must be done when exiting the specific screen we are about to reenter ( eg. dirtying of the screen )
function SpecialHandlerCode(): void {
  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreen) {
    case Enum17.HELP_SCREEN_LAPTOP:
      PrintDate();
      PrintBalance();
      PrintNumberOnTeam();
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN:
      break;
    case Enum17.HELP_SCREEN_TACTICAL:
      break;

    case Enum17.HELP_SCREEN_MAPSCREEN_NO_ONE_HIRED:
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN_NOT_IN_ARULCO:
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY:
      break;
      break;
    case Enum17.HELP_SCREEN_OPTIONS:
      break;
    case Enum17.HELP_SCREEN_LOAD_GAME:
      break;

    default:
      break;
  }
}

function RenderSpecificHelpScreen(): UINT16 {
  let usNumVerticalPixelsDisplayed: UINT16 = 0;
  // new screen:

  // set the buffer for the text to go to
  //	SetFontDestBuffer( guiHelpScreenTextBufferSurface, gHelpScreen.usLeftMarginPosX, gHelpScreen.usScreenLocY + HELP_SCREEN_TEXT_OFFSET_Y,
  //										 HLP_SCRN__WIDTH_OF_TEXT_BUFFER, HLP_SCRN__NUMBER_BYTES_IN_TEXT_BUFFER, FALSE );
  SetFontDestBuffer(guiHelpScreenTextBufferSurface, 0, 0, HLP_SCRN__WIDTH_OF_TEXT_BUFFER, HLP_SCRN__HEIGHT_OF_TEXT_BUFFER(), false);

  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreen) {
    case Enum17.HELP_SCREEN_LAPTOP:
      usNumVerticalPixelsDisplayed = RenderLaptopHelpScreen();
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN:
      usNumVerticalPixelsDisplayed = RenderMapScreenHelpScreen();
      break;
    case Enum17.HELP_SCREEN_TACTICAL:
      usNumVerticalPixelsDisplayed = RenderTacticalHelpScreen();
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN_NO_ONE_HIRED:
      usNumVerticalPixelsDisplayed = RenderMapScreenNoOneHiredYetHelpScreen();
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN_NOT_IN_ARULCO:
      usNumVerticalPixelsDisplayed = RenderMapScreenNotYetInArulcoHelpScreen();
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY:
      usNumVerticalPixelsDisplayed = RenderMapScreenSectorInventoryHelpScreen();
      break;
    case Enum17.HELP_SCREEN_OPTIONS:
      break;
    case Enum17.HELP_SCREEN_LOAD_GAME:
      break;

    default:
      break;
  }

  SetFontDestBuffer(FRAME_BUFFER, 0, 0, 640, 480, false);

  // add 1 line to the bottom of the buffer
  usNumVerticalPixelsDisplayed += 10;

  return usNumVerticalPixelsDisplayed;
}

function GetHelpScreenTextPositions(): { usPosX: UINT16, usPosY: UINT16, usWidth: UINT16 } {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usWidth: UINT16;
  // if there are buttons
  usPosX = 0;

  usWidth = HLP_SCRN__WIDTH_OF_TEXT_BUFFER - 1 * HELP_SCREEN_MARGIN_SIZE; // DEF was 2

  usPosY = 0;

  return { usPosX, usPosY, usWidth };
}

function DisplayCurrentScreenTitleAndFooter(): void {
  let iStartLoc: INT32 = -1;
  let zText: string /* CHAR16[1024] */;
  let usPosX: UINT16 = 0;
  let usPosY: UINT16 = 0;
  let usWidth: UINT16 = 0;

  // new screen:

  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreen) {
    case Enum17.HELP_SCREEN_LAPTOP:
      iStartLoc = HELPSCREEN_RECORD_SIZE * Enum18.HLP_TXT_LAPTOP_TITLE;
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN:
      iStartLoc = HELPSCREEN_RECORD_SIZE * Enum18.HLP_TXT_WELCOM_TO_ARULCO_TITLE;
      break;
    case Enum17.HELP_SCREEN_TACTICAL:
      iStartLoc = HELPSCREEN_RECORD_SIZE * Enum18.HLP_TXT_TACTICAL_TITLE;
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN_NO_ONE_HIRED:
      iStartLoc = HELPSCREEN_RECORD_SIZE * Enum18.HLP_TXT_MPSCRN_NO_1_HIRED_YET_TITLE;
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN_NOT_IN_ARULCO:
      iStartLoc = HELPSCREEN_RECORD_SIZE * Enum18.HLP_TXT_MPSCRN_NOT_IN_ARULCO_TITLE;
      break;
    case Enum17.HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY:
      iStartLoc = HELPSCREEN_RECORD_SIZE * Enum18.HLP_TXT_SECTOR_INVTRY_TITLE;
      break;
    case Enum17.HELP_SCREEN_OPTIONS:
      break;
    case Enum17.HELP_SCREEN_LOAD_GAME:
      break;

    default:
      break;
  }

  //	GetHelpScreenTextPositions( NULL, NULL, &usWidth );

  if (gHelpScreen.bNumberOfButtons != 0)
    usWidth = gHelpScreen.usScreenWidth - HELP_SCREEN_TEXT_LEFT_MARGIN_WITH_BTN - HELP_SCREEN_TEXT_RIGHT_MARGIN_SPACE;
  else
    usWidth = gHelpScreen.usScreenWidth - HELP_SCREEN_TEXT_LEFT_MARGIN - HELP_SCREEN_TEXT_RIGHT_MARGIN_SPACE;

  // if this screen has a valid title
  if (iStartLoc != -1) {
    zText = LoadEncryptedDataFromFile(HELPSCREEN_FILE, iStartLoc, HELPSCREEN_RECORD_SIZE);

    SetFontShadow(NO_SHADOW);

    usPosX = gHelpScreen.usLeftMarginPosX;

    //		DrawTextToScreen( zText, usPosX, (UINT16)(gHelpScreen.usScreenLocY+HELP_SCREEN_TITLE_OFFSET_Y), usWidth,
    //									 HELP_SCREEN_TITLE_BODY_FONT, HELP_SCREEN_TITLE_BODY_COLOR, HELP_SCREEN_TEXT_BACKGROUND, FALSE, CENTER_JUSTIFIED );

    // Display the Title
    IanDisplayWrappedString(usPosX, (gHelpScreen.usScreenLocY + HELP_SCREEN_TITLE_OFFSET_Y), usWidth, HELP_SCREEN_GAP_BTN_LINES, HELP_SCREEN_TITLE_BODY_FONT(), HELP_SCREEN_TITLE_BODY_COLOR, zText, HELP_SCREEN_TEXT_BACKGROUND, false, 0);
  }

  // Display the '( press H to get help... )'
  iStartLoc = HELPSCREEN_RECORD_SIZE * Enum18.HLP_TXT_CONSTANT_SUBTITLE;
  zText = LoadEncryptedDataFromFile(HELPSCREEN_FILE, iStartLoc, HELPSCREEN_RECORD_SIZE);

  usPosX = gHelpScreen.usLeftMarginPosX;

  usPosY = gHelpScreen.usScreenLocY + HELP_SCREEN_HELP_REMINDER_Y;
  //	DrawTextToScreen( zText, usPosX, usPosY, usWidth,
  //								 HELP_SCREEN_TEXT_BODY_FONT, HELP_SCREEN_TITLE_BODY_COLOR, HELP_SCREEN_TEXT_BACKGROUND, FALSE, CENTER_JUSTIFIED );

  IanDisplayWrappedString(usPosX, usPosY, usWidth, HELP_SCREEN_GAP_BTN_LINES, HELP_SCREEN_TITLE_BODY_FONT(), HELP_SCREEN_TITLE_BODY_COLOR, zText, HELP_SCREEN_TEXT_BACKGROUND, false, 0);

  if (!gHelpScreen.fForceHelpScreenToComeUp) {
    // calc location for the ' [ x ] Dont display again...'
    iStartLoc = HELPSCREEN_RECORD_SIZE * Enum18.HLP_TXT_CONSTANT_FOOTER;
    zText = LoadEncryptedDataFromFile(HELPSCREEN_FILE, iStartLoc, HELPSCREEN_RECORD_SIZE);

    usPosX = gHelpScreen.usLeftMarginPosX + HELP_SCREEN_SHOW_HELP_AGAIN_REGION_TEXT_OFFSET_X;

    usPosY = gHelpScreen.usScreenLocY + gHelpScreen.usScreenHeight - HELP_SCREEN_SHOW_HELP_AGAIN_REGION_TEXT_OFFSET_Y + 2;

    // Display the ' [ x ] Dont display again...'
    IanDisplayWrappedString(usPosX, usPosY, usWidth, HELP_SCREEN_GAP_BTN_LINES, HELP_SCREEN_TEXT_BODY_FONT(), HELP_SCREEN_TITLE_BODY_COLOR, zText, HELP_SCREEN_TEXT_BACKGROUND, false, 0);
  }

  SetFontShadow(DEFAULT_SHADOW);
}

function BtnHelpScreenBtnsCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    //		btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // Get the btn id
    let bRetValue: INT8 = MSYS_GetBtnUserData(btn, 0);

    ChangeToHelpScreenSubPage(bRetValue);
    /*
                    //change the current page to the new one
                    gHelpScreen.bCurrentHelpScreenActiveSubPage = ( bRetValue > gHelpScreen.bNumberOfButtons ) ? gHelpScreen.bNumberOfButtons-1 : bRetValue;

                    gHelpScreen.ubHelpScreenDirty = HLP_SCRN_DRTY_LVL_REFRESH_TEXT;

                    for( i=0; i< gHelpScreen.bNumberOfButtons; i++ )
                    {
                            ButtonList[ guiHelpScreenBtns[i] ]->uiFlags &= (~BUTTON_CLICKED_ON );
                    }

                    //change the current sub page, and render it to the buffer
                    ChangeHelpScreenSubPage();
    */
    btn.uiFlags |= BUTTON_CLICKED_ON;

    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    //		btn->uiFlags &= (~BUTTON_CLICKED_ON );
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function ChangeToHelpScreenSubPage(bNewPage: INT8): void {
  let i: INT8;

  // if for some reason, we are assigning a lower number
  if (bNewPage < 0) {
    gHelpScreen.bCurrentHelpScreenActiveSubPage = 0;
  }

  // for some reason if the we are passing in a # that is greater then the max, set it to the max
  else if (bNewPage >= gHelpScreen.bNumberOfButtons) {
    gHelpScreen.bCurrentHelpScreenActiveSubPage = (gHelpScreen.bNumberOfButtons == 0) ? 0 : gHelpScreen.bNumberOfButtons - 1;
  }

  // if we are selecting the current su page, exit
  else if (bNewPage == gHelpScreen.bCurrentHelpScreenActiveSubPage) {
    return;
  }

  // else assign the new subpage
  else {
    gHelpScreen.bCurrentHelpScreenActiveSubPage = bNewPage;
  }

  // refresh the screen
  gHelpScreen.ubHelpScreenDirty = Enum10.HLP_SCRN_DRTY_LVL_REFRESH_TEXT;

  //'undepress' all the buttons
  for (i = 0; i < gHelpScreen.bNumberOfButtons; i++) {
    ButtonList[guiHelpScreenBtns[i]].uiFlags &= (~BUTTON_CLICKED_ON);
  }

  // depress the proper button
  ButtonList[guiHelpScreenBtns[gHelpScreen.bCurrentHelpScreenActiveSubPage]].uiFlags |= BUTTON_CLICKED_ON;

  // change the current sub page, and render it to the buffer
  ChangeHelpScreenSubPage();
}

function GetHelpScreenText(uiRecordToGet: UINT32): string {
  let iStartLoc: INT32 = -1;

  iStartLoc = HELPSCREEN_RECORD_SIZE * uiRecordToGet;
  return LoadEncryptedDataFromFile(HELPSCREEN_FILE, iStartLoc, HELPSCREEN_RECORD_SIZE);
}

// returns the number of vertical pixels printed
function GetAndDisplayHelpScreenText(uiRecord: UINT32, usPosX: UINT16, usPosY: UINT16, usWidth: UINT16): UINT16 {
  let zText: string /* CHAR16[1024] */;
  let usNumVertPixels: UINT16 = 0;
  let uiStartLoc: UINT32;

  SetFontShadow(NO_SHADOW);

  zText = GetHelpScreenText(uiRecord);

  // Get the record
  uiStartLoc = HELPSCREEN_RECORD_SIZE * uiRecord;
  zText = LoadEncryptedDataFromFile(HELPSCREEN_FILE, uiStartLoc, HELPSCREEN_RECORD_SIZE);

  // Display the text
  usNumVertPixels = IanDisplayWrappedString(usPosX, usPosY, usWidth, HELP_SCREEN_GAP_BTN_LINES, HELP_SCREEN_TEXT_BODY_FONT(), HELP_SCREEN_TEXT_BODY_COLOR, zText, HELP_SCREEN_TEXT_BACKGROUND, false, 0);

  SetFontShadow(DEFAULT_SHADOW);

  return usNumVertPixels;
}

function BtnHelpScreenDontShowHelpAgainCallback(btn: GUI_BUTTON, reason: INT32): void {
  //	UINT8	ubButton = (UINT8)MSYS_GetBtnUserData( btn, 0 );

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    /*
                    btn->uiFlags &= ~BUTTON_CLICKED_ON;

                    if( gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen & ( 1 << gHelpScreen.bCurrentHelpScreen ) )
                    {
    //
                            gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen &= ~( 1 << gHelpScreen.bCurrentHelpScreen );
                    }
                    else
                    {
    //			gHelpScreen.usHasPlayerSeenHelpScreenInCurrentScreen |= ( 1 << gHelpScreen.bCurrentHelpScreen );

                    }
    //		btn->uiFlags |= BUTTON_CLICKED_ON;
    */
  }
}

/*
void HelpScreenDontShowHelpAgainToggleTextRegionCallBack(MOUSE_REGION * pRegion, INT32 iReason )
{
        if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP)
        {
                InvalidateRegion(pRegion->RegionTopLeftX, pRegion->RegionTopLeftY, pRegion->RegionBottomRightX, pRegion->RegionBottomRightY);
        }


        else if( iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN )
        {
                if( gGameSettings.fOptions[ ubButton ] )
                {
                }
                else
                {
                }
        }
}
*/

// set the fact the we have chmaged to a new screen
export function NewScreenSoResetHelpScreen(): void {
  gHelpScreen.fHaveAlreadyBeenInHelpScreenSinceEnteringCurrenScreen = false;
  gHelpScreen.bDelayEnteringHelpScreenBy1FrameCount = 0;
}

function BtnHelpScreenExitCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);

    PrepareToExitHelpScreen();

    btn.uiFlags &= (~BUTTON_CLICKED_ON);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function RenderLaptopHelpScreen(): UINT16 {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usWidth: UINT16;
  let usNumVertPixels: UINT16;
  let ubCnt: UINT8;
  let usTotalNumberOfVerticalPixels: UINT16 = 0;
  let usFontHeight: UINT16 = GetFontHeight(HELP_SCREEN_TEXT_BODY_FONT());

  if (gHelpScreen.bCurrentHelpScreenActiveSubPage == -1) {
    return 0;
  }

  // Get the position for the text
  ({ usPosX, usPosY, usWidth } = GetHelpScreenTextPositions());

  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreenActiveSubPage) {
    case Enum13.HLP_SCRN_LPTP_OVERVIEW:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 2; ubCnt++) {
        // Display the text, and get the number of pixels it used to display it
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_LAPTOP_OVERVIEW_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      /*
                              //Display the first paragraph
                              usTotalNumberOfVerticalPixels = GetAndDisplayHelpScreenText( HLP_TXT_LAPTOP_OVERVIEW_P1, usPosX, usPosY, usWidth );

                              usPosY = usPosY+ usNumVertPixels + GetFontHeight( HELP_SCREEN_TEXT_BODY_FONT );

                              //Display the second paragraph
                              usTotalNumberOfVerticalPixels += GetAndDisplayHelpScreenText( HLP_TXT_LAPTOP_OVERVIEW_P2, usPosX, usPosY, usWidth );
      */
      break;

    case Enum13.HLP_SCRN_LPTP_EMAIL:

      // Display the first paragraph
      usTotalNumberOfVerticalPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_LAPTOP_EMAIL_P1, usPosX, usPosY, usWidth);
      break;

    case Enum13.HLP_SCRN_LPTP_WEB:

      // Display the first paragraph
      usTotalNumberOfVerticalPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_LAPTOP_WEB_P1, usPosX, usPosY, usWidth);

      break;

    case Enum13.HLP_SCRN_LPTP_FILES:

      // Display the first paragraph
      usTotalNumberOfVerticalPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_LAPTOP_FILES_P1, usPosX, usPosY, usWidth);
      break;

    case Enum13.HLP_SCRN_LPTP_HISTORY:
      // Display the first paragraph
      usTotalNumberOfVerticalPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_LAPTOP_HISTORY_P1, usPosX, usPosY, usWidth);

      break;

    case Enum13.HLP_SCRN_LPTP_PERSONNEL:

      // Display the first paragraph
      usTotalNumberOfVerticalPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_LAPTOP_PERSONNEL_P1, usPosX, usPosY, usWidth);
      break;

    case Enum13.HLP_SCRN_LPTP_FINANCIAL:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 2; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_FINANCES_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      break;

    case Enum13.HLP_SCRN_LPTP_MERC_STATS:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 15; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_MERC_STATS_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      break;
  }

  return usTotalNumberOfVerticalPixels;
}

function RenderMapScreenNoOneHiredYetHelpScreen(): UINT16 {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usWidth: UINT16;
  let usNumVertPixels: UINT16;
  let ubCnt: UINT8;
  let usTotalNumberOfVerticalPixels: UINT16 = 0;
  let usFontHeight: UINT16 = GetFontHeight(HELP_SCREEN_TEXT_BODY_FONT());

  if (gHelpScreen.bCurrentHelpScreenActiveSubPage == -1) {
    return 0;
  }

  // Get the position for the text
  ({ usPosX, usPosY, usWidth } = GetHelpScreenTextPositions());

  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreenActiveSubPage) {
    case Enum14.HLP_SCRN_NO_ONE_HIRED:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 2; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_MPSCRN_NO_1_HIRED_YET_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      break;
  }

  return usTotalNumberOfVerticalPixels;
}

function RenderMapScreenNotYetInArulcoHelpScreen(): UINT16 {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usWidth: UINT16;
  let usNumVertPixels: UINT16;
  let ubCnt: UINT8;
  let usTotalNumberOfVerticalPixels: UINT16 = 0;
  let usFontHeight: UINT16 = GetFontHeight(HELP_SCREEN_TEXT_BODY_FONT());

  if (gHelpScreen.bCurrentHelpScreenActiveSubPage == -1) {
    return 0;
  }

  // Get the position for the text
  ({ usPosX, usPosY, usWidth } = GetHelpScreenTextPositions());

  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreenActiveSubPage) {
    case Enum15.HLP_SCRN_NOT_IN_ARULCO:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 3; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_MPSCRN_NOT_IN_ARULCO_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;
  }

  return usTotalNumberOfVerticalPixels;
}

function RenderMapScreenSectorInventoryHelpScreen(): UINT16 {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usWidth: UINT16;
  let usNumVertPixels: UINT16;
  let ubCnt: UINT8;
  let usTotalNumberOfVerticalPixels: UINT16 = 0;
  let usFontHeight: UINT16 = GetFontHeight(HELP_SCREEN_TEXT_BODY_FONT());

  if (gHelpScreen.bCurrentHelpScreenActiveSubPage == -1) {
    return 0;
  }

  // Get the position for the text
  ({ usPosX, usPosY, usWidth } = GetHelpScreenTextPositions());

  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreenActiveSubPage) {
    case Enum11.HLP_SCRN_MPSCRN_SCTR_OVERVIEW:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 2; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_SECTOR_INVTRY_OVERVIEW_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      break;
  }

  return usTotalNumberOfVerticalPixels;
}

function RenderTacticalHelpScreen(): UINT16 {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usWidth: UINT16;
  let usNumVertPixels: UINT16;
  let ubCnt: UINT8;
  let usTotalNumberOfVerticalPixels: UINT16 = 0;
  let usFontHeight: UINT16 = GetFontHeight(HELP_SCREEN_TEXT_BODY_FONT());

  if (gHelpScreen.bCurrentHelpScreenActiveSubPage == -1) {
    return 0;
  }

  // Get the position for the text
  ({ usPosX, usPosY, usWidth } = GetHelpScreenTextPositions());

  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreenActiveSubPage) {
    case Enum16.HLP_SCRN_TACTICAL_OVERVIEW:

      // Display all the paragraph
      for (ubCnt = 0; ubCnt < 4; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_TACTICAL_OVERVIEW_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;

    case Enum16.HLP_SCRN_TACTICAL_MOVEMENT:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 4; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_TACTICAL_MOVEMENT_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;

    case Enum16.HLP_SCRN_TACTICAL_SIGHT:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 4; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_TACTICAL_SIGHT_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      break;

    case Enum16.HLP_SCRN_TACTICAL_ATTACKING:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 3; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_TACTICAL_ATTACKING_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;

    case Enum16.HLP_SCRN_TACTICAL_ITEMS:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 4; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_TACTICAL_ITEMS_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      break;

    case Enum16.HLP_SCRN_TACTICAL_KEYBOARD:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 8; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_TACTICAL_KEYBOARD_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;
  }

  return usTotalNumberOfVerticalPixels;
}

function RenderMapScreenHelpScreen(): UINT16 {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usWidth: UINT16;
  let usNumVertPixels: UINT16;
  let ubCnt: UINT8;
  let usTotalNumberOfVerticalPixels: UINT16 = 0;
  let usFontHeight: UINT16 = GetFontHeight(HELP_SCREEN_TEXT_BODY_FONT());

  if (gHelpScreen.bCurrentHelpScreenActiveSubPage == -1) {
    return 0;
  }

  // Get the position for the text
  ({ usPosX, usPosY, usWidth } = GetHelpScreenTextPositions());

  // switch on the current screen
  switch (gHelpScreen.bCurrentHelpScreenActiveSubPage) {
    case Enum12.HLP_SCRN_MPSCRN_OVERVIEW:

      // Display all the paragraph
      for (ubCnt = 0; ubCnt < 3; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_WELCOM_TO_ARULCO_OVERVIEW_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;

    case Enum12.HLP_SCRN_MPSCRN_ASSIGNMENTS:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 4; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_WELCOM_TO_ARULCO_ASSNMNT_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;

    case Enum12.HLP_SCRN_MPSCRN_DESTINATIONS:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 5; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_WELCOM_TO_ARULCO_DSTINATION_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      break;

    case Enum12.HLP_SCRN_MPSCRN_MAP:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 3; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_WELCOM_TO_ARULCO_MAP_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;

    case Enum12.HLP_SCRN_MPSCRN_MILITIA:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 3; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_WELCOM_TO_ARULCO_MILITIA_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }

      break;

    case Enum12.HLP_SCRN_MPSCRN_AIRSPACE:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 2; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_WELCOM_TO_ARULCO_AIRSPACE_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;

    case Enum12.HLP_SCRN_MPSCRN_ITEMS:

      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 1; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_WELCOM_TO_ARULCO_ITEMS_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;

    case Enum12.HLP_SCRN_MPSCRN_KEYBOARD:
      // Display all the paragraphs
      for (ubCnt = 0; ubCnt < 4; ubCnt++) {
        usNumVertPixels = GetAndDisplayHelpScreenText(Enum18.HLP_TXT_WELCOM_TO_ARULCO_KEYBOARD_P1 + ubCnt, usPosX, usPosY, usWidth);

        // move the next text down by the right amount
        usPosY = usPosY + usNumVertPixels + usFontHeight;

        // add the total amount of pixels used
        usTotalNumberOfVerticalPixels += usNumVertPixels + usFontHeight;
      }
      break;
  }

  return usTotalNumberOfVerticalPixels;
}

function RefreshAllHelpScreenButtons(): void {
  let i: UINT8;

  // loop through all the buttons, and refresh them
  for (i = 0; i < gHelpScreen.bNumberOfButtons; i++) {
    ButtonList[guiHelpScreenBtns[i]].uiFlags |= BUTTON_DIRTY;
  }

  ButtonList[guiHelpScreenExitBtn].uiFlags |= BUTTON_DIRTY;

  if (!gHelpScreen.fForceHelpScreenToComeUp) {
    ButtonList[gHelpScreenDontShowHelpAgainToggle].uiFlags |= BUTTON_DIRTY;
  }

  ButtonList[giHelpScreenScrollArrows[0]].uiFlags |= BUTTON_DIRTY;
  ButtonList[giHelpScreenScrollArrows[1]].uiFlags |= BUTTON_DIRTY;
}

export function HelpScreenDetermineWhichMapScreenHelpToShow(): INT8 {
  if (fShowMapInventoryPool) {
    return Enum17.HELP_SCREEN_MAPSCREEN_SECTOR_INVENTORY;
  }

  if (AnyMercsHired() == false) {
    return Enum17.HELP_SCREEN_MAPSCREEN_NO_ONE_HIRED;
  }

  if (gTacticalStatus.fDidGameJustStart) {
    return Enum17.HELP_SCREEN_MAPSCREEN_NOT_IN_ARULCO;
  }

  return Enum17.HELP_SCREEN_MAPSCREEN;
}

function CreateHelpScreenTextBuffer(): boolean {
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();

  // Create a background video surface to blt the face onto
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = HLP_SCRN__WIDTH_OF_TEXT_BUFFER;
  vs_desc.usHeight = HLP_SCRN__HEIGHT_OF_TEXT_BUFFER();
  vs_desc.ubBitDepth = 16;
  if ((guiHelpScreenTextBufferSurface = AddVideoSurface(vs_desc)) === -1) {
    return false;
  }

  return true;
}

function DestroyHelpScreenTextBuffer(): void {
  DeleteVideoSurfaceFromIndex(guiHelpScreenTextBufferSurface);
}

function RenderCurrentHelpScreenTextToBuffer(): void {
  // clear the buffer ( use 0, black as a transparent color
  ClearHelpScreenTextBuffer();

  // Render the current screen, and get the number of pixels it used to display
  gHelpScreen.usTotalNumberOfPixelsInBuffer = RenderSpecificHelpScreen();

  // calc the number of lines in the buffer
  gHelpScreen.usTotalNumberOfLinesInBuffer = gHelpScreen.usTotalNumberOfPixelsInBuffer / (HLP_SCRN__HEIGHT_OF_1_LINE_IN_BUFFER());
}

function RenderTextBufferToScreen(): void {
  let hDestVSurface: HVSURFACE;
  let hSrcVSurface: HVSURFACE;
  let SrcRect: SGPRect = createSGPRect();

  hDestVSurface = GetVideoSurface(guiRENDERBUFFER);
  hSrcVSurface = GetVideoSurface(guiHelpScreenTextBufferSurface);

  SrcRect.iLeft = 0;
  SrcRect.iTop = gHelpScreen.iLineAtTopOfTextBuffer * HLP_SCRN__HEIGHT_OF_1_LINE_IN_BUFFER();
  SrcRect.iRight = HLP_SCRN__WIDTH_OF_TEXT_BUFFER;
  SrcRect.iBottom = SrcRect.iTop + HLP_SCRN__HEIGHT_OF_TEXT_AREA - (2 * 8);

  BltVSurfaceUsingDD(hDestVSurface, hSrcVSurface, VO_BLT_SRCTRANSPARENCY, gHelpScreen.usLeftMarginPosX, (gHelpScreen.usScreenLocY + HELP_SCREEN_TEXT_OFFSET_Y), SGPRectToRect(SrcRect));

  DisplayHelpScreenTextBufferScrollBox();
}

function ChangeHelpScreenSubPage(): void {
  // reset
  gHelpScreen.iLineAtTopOfTextBuffer = 0;

  RenderCurrentHelpScreenTextToBuffer();

  // enable or disable the help screen arrow buttons
  if (gHelpScreen.usTotalNumberOfLinesInBuffer <= HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER()) {
    DisableButton(giHelpScreenScrollArrows[0]);
    DisableButton(giHelpScreenScrollArrows[1]);
  } else {
    EnableButton(giHelpScreenScrollArrows[0]);
    EnableButton(giHelpScreenScrollArrows[1]);
  }
}

function ClearHelpScreenTextBuffer(): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;

  // CLEAR THE FRAME BUFFER
  pDestBuf = LockVideoSurface(guiHelpScreenTextBufferSurface, addressof(uiDestPitchBYTES));
  memset(pDestBuf, 0, HLP_SCRN__HEIGHT_OF_TEXT_BUFFER() * uiDestPitchBYTES);
  UnLockVideoSurface(guiHelpScreenTextBufferSurface);
  InvalidateScreen();
}

// - is up, + is down
function ChangeTopLineInTextBufferByAmount(iAmouontToMove: INT32): void {
  // if we are moving up
  if (iAmouontToMove < 0) {
    if (gHelpScreen.iLineAtTopOfTextBuffer + iAmouontToMove >= 0) {
      // if we can move up by the requested amount
      if ((gHelpScreen.usTotalNumberOfLinesInBuffer - gHelpScreen.iLineAtTopOfTextBuffer) > iAmouontToMove) {
        gHelpScreen.iLineAtTopOfTextBuffer += iAmouontToMove;
      }

      // else, trying to move past the top
      else {
        gHelpScreen.iLineAtTopOfTextBuffer = 0;
      }
    } else {
      gHelpScreen.iLineAtTopOfTextBuffer = 0;
    }
  }

  // else we are moving down
  else {
    // if we dont have to scroll cause there is not enough text
    if (gHelpScreen.usTotalNumberOfLinesInBuffer <= HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER()) {
      gHelpScreen.iLineAtTopOfTextBuffer = 0;
    } else {
      if ((gHelpScreen.iLineAtTopOfTextBuffer + HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER() + iAmouontToMove) <= gHelpScreen.usTotalNumberOfLinesInBuffer) {
        gHelpScreen.iLineAtTopOfTextBuffer += iAmouontToMove;
      } else {
        gHelpScreen.iLineAtTopOfTextBuffer = gHelpScreen.usTotalNumberOfLinesInBuffer - HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER();
      }
    }
  }

  //	RenderCurrentHelpScreenTextToBuffer();

  gHelpScreen.ubHelpScreenDirty = Enum10.HLP_SCRN_DRTY_LVL_REFRESH_TEXT;
}

function DisplayHelpScreenTextBufferScrollBox(): void {
  let iSizeOfBox: INT32;
  let iTopPosScrollBox: INT32 = 0;
  let pDestBuf: Pointer<UINT8>;
  let uiDestPitchBYTES: UINT32;
  let usPosX: UINT16;

  if (gHelpScreen.bNumberOfButtons != 0) {
    usPosX = gHelpScreen.usScreenLocX + HLP_SCRN__SCROLL_POSX + HELP_SCREEN_BUTTON_BORDER_WIDTH;
  } else {
    usPosX = gHelpScreen.usScreenLocX + HLP_SCRN__SCROLL_POSX;
  }

  //
  // first calculate the height of the scroll box
  //

  ({ iHeightOfScrollBox: iSizeOfBox, iTopOfScrollBox: iTopPosScrollBox } = CalculateHeightAndPositionForHelpScreenScrollBox());

  //
  // next draw the box
  //

  // if there ARE scroll bars, draw the
  if (!(gHelpScreen.usTotalNumberOfLinesInBuffer <= HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER())) {
    ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, iTopPosScrollBox, usPosX + HLP_SCRN__WIDTH_OF_SCROLL_AREA, iTopPosScrollBox + iSizeOfBox - 1, Get16BPPColor(FROMRGB(227, 198, 88)));

    // display the line
    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
    SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

    // draw the gold highlite line on the top and left
    LineDraw(false, usPosX, iTopPosScrollBox, usPosX + HLP_SCRN__WIDTH_OF_SCROLL_AREA, iTopPosScrollBox, Get16BPPColor(FROMRGB(235, 222, 171)), pDestBuf);
    LineDraw(false, usPosX, iTopPosScrollBox, usPosX, iTopPosScrollBox + iSizeOfBox - 1, Get16BPPColor(FROMRGB(235, 222, 171)), pDestBuf);

    // draw the shadow line on the bottom and right
    LineDraw(false, usPosX, iTopPosScrollBox + iSizeOfBox - 1, usPosX + HLP_SCRN__WIDTH_OF_SCROLL_AREA, iTopPosScrollBox + iSizeOfBox - 1, Get16BPPColor(FROMRGB(65, 49, 6)), pDestBuf);
    LineDraw(false, usPosX + HLP_SCRN__WIDTH_OF_SCROLL_AREA, iTopPosScrollBox, usPosX + HLP_SCRN__WIDTH_OF_SCROLL_AREA, iTopPosScrollBox + iSizeOfBox - 1, Get16BPPColor(FROMRGB(65, 49, 6)), pDestBuf);

    // unlock frame buffer
    UnLockVideoSurface(FRAME_BUFFER);
  }
}

function CreateScrollAreaButtons(): void {
  let usPosX: UINT16;
  let usWidth: UINT16;
  let usPosY: UINT16;
  let iPosY: INT32;
  let iHeight: INT32;

  if (gHelpScreen.bNumberOfButtons != 0) {
    usPosX = gHelpScreen.usScreenLocX + HLP_SCRN__SCROLL_POSX + HELP_SCREEN_BUTTON_BORDER_WIDTH;
  } else {
    usPosX = gHelpScreen.usScreenLocX + HLP_SCRN__SCROLL_POSX;
  }

  usWidth = HLP_SCRN__WIDTH_OF_SCROLL_AREA;

  // Get the height and position of the scroll box
  ({ iHeightOfScrollBox: iHeight, iTopOfScrollBox: iPosY } = CalculateHeightAndPositionForHelpScreenScrollBox());

  // Create a mouse region 'mask' the entrire screen
  MSYS_DefineRegion(gHelpScreenScrollArea, usPosX, iPosY, (usPosX + usWidth), (iPosY + HLP_SCRN__HEIGHT_OF_SCROLL_AREA), MSYS_PRIORITY_HIGHEST, gHelpScreen.usCursor, SelectHelpScrollAreaMovementCallBack, SelectHelpScrollAreaCallBack);
  MSYS_AddRegion(gHelpScreenScrollArea);

  guiHelpScreenScrollArrowImage[0] = LoadButtonImage("INTERFACE\\HelpScreen.sti", 14, 10, 11, 12, 13);
  guiHelpScreenScrollArrowImage[1] = UseLoadedButtonImage(guiHelpScreenScrollArrowImage[0], 19, 15, 16, 17, 18);

  if (gHelpScreen.bNumberOfButtons != 0)
    usPosX = gHelpScreen.usScreenLocX + HLP_SCRN__SCROLL_UP_ARROW_X + HELP_SCREEN_BUTTON_BORDER_WIDTH;
  else
    usPosX = gHelpScreen.usScreenLocX + HLP_SCRN__SCROLL_UP_ARROW_X;

  usPosY = gHelpScreen.usScreenLocY + HLP_SCRN__SCROLL_UP_ARROW_Y;

  // Create the scroll arrows
  giHelpScreenScrollArrows[0] = QuickCreateButton(guiHelpScreenScrollArrowImage[0], usPosX, usPosY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), BtnHelpScreenScrollArrowsCallback);
  MSYS_SetBtnUserData(giHelpScreenScrollArrows[0], 0, 0);
  SetButtonCursor(giHelpScreenScrollArrows[0], gHelpScreen.usCursor);

  usPosY = gHelpScreen.usScreenLocY + HLP_SCRN__SCROLL_DWN_ARROW_Y;

  // Create the scroll arrows
  giHelpScreenScrollArrows[1] = QuickCreateButton(guiHelpScreenScrollArrowImage[1], usPosX, usPosY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGHEST, DEFAULT_MOVE_CALLBACK(), BtnHelpScreenScrollArrowsCallback);
  MSYS_SetBtnUserData(giHelpScreenScrollArrows[1], 0, 1);
  SetButtonCursor(giHelpScreenScrollArrows[1], gHelpScreen.usCursor);
}

function DeleteScrollArrowButtons(): void {
  let i: INT8;
  // remove the mouse region that blankets
  MSYS_RemoveRegion(gHelpScreenScrollArea);

  for (i = 0; i < 2; i++) {
    RemoveButton(giHelpScreenScrollArrows[i]);
    UnloadButtonImage(guiHelpScreenScrollArrowImage[i]);
  }
}

function CalculateHeightAndPositionForHelpScreenScrollBox(): { iHeightOfScrollBox: INT32, iTopOfScrollBox: INT32 } {
  let iHeightOfScrollBox: INT32;
  let iTopOfScrollBox: INT32;

  let iSizeOfBox: INT32;
  let iTopPosScrollBox: INT32;
  let dPercentSizeOfBox: FLOAT = 0;
  let dTemp: FLOAT = 0;

  dPercentSizeOfBox = HLP_SCRN__MAX_NUMBER_DISPLAYED_LINES_IN_BUFFER() / gHelpScreen.usTotalNumberOfLinesInBuffer;

  // if the # is >= 1 then the box is the full size of the scroll area
  if (dPercentSizeOfBox >= 1.0) {
    iSizeOfBox = HLP_SCRN__HEIGHT_OF_SCROLL_AREA;

    // no need to calc the top spot for the box
    iTopPosScrollBox = HLP_SCRN__SCROLL_POSY();
  } else {
    iSizeOfBox = (dPercentSizeOfBox * HLP_SCRN__HEIGHT_OF_SCROLL_AREA + 0.5);

    //
    // next, calculate the top position of the box
    //
    dTemp = (HLP_SCRN__HEIGHT_OF_SCROLL_AREA / gHelpScreen.usTotalNumberOfLinesInBuffer) * gHelpScreen.iLineAtTopOfTextBuffer;

    iTopPosScrollBox = (dTemp + .5) + HLP_SCRN__SCROLL_POSY();
  }

  iHeightOfScrollBox = iSizeOfBox;
  iTopOfScrollBox = iTopPosScrollBox;

  return { iHeightOfScrollBox, iTopOfScrollBox };
}

function SelectHelpScrollAreaCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfScrollBoxIsScrolling = false;
    gHelpScreen.iLastMouseClickY = -1;
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gfScrollBoxIsScrolling = true;
    HelpScreenMouseMoveScrollBox(pRegion.MouseYPos);
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectHelpScrollAreaMovementCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    //		InvalidateRegion(pRegion->RegionTopLeftX, pRegion->RegionTopLeftY, pRegion->RegionBottomRightX, pRegion->RegionBottomRightY);
  } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
  } else if (iReason & MSYS_CALLBACK_REASON_MOVE) {
    if (gfLeftButtonState) {
      HelpScreenMouseMoveScrollBox(pRegion.MouseYPos);
    }
  }
}

function HelpScreenMouseMoveScrollBox(usMousePosY: INT32): void {
  let iPosY: INT32;
  let iHeight: INT32;
  let iNumberOfIncrements: INT32 = 0;
  let dSizeOfIncrement: FLOAT = (HLP_SCRN__HEIGHT_OF_SCROLL_AREA / gHelpScreen.usTotalNumberOfLinesInBuffer);
  let dTemp: FLOAT;
  let iNewPosition: INT32;

  ({ iHeightOfScrollBox: iHeight, iTopOfScrollBox: iPosY } = CalculateHeightAndPositionForHelpScreenScrollBox());

  if (AreWeClickingOnScrollBar(usMousePosY) || gHelpScreen.iLastMouseClickY != -1) {
    if (gHelpScreen.iLastMouseClickY == -1)
      gHelpScreen.iLastMouseClickY = usMousePosY;

    if (usMousePosY < gHelpScreen.iLastMouseClickY) {
      //			iNewPosition = iPosY - ( UINT16)( dSizeOfIncrement + .5);
      iNewPosition = iPosY - (gHelpScreen.iLastMouseClickY - usMousePosY);
    } else if (usMousePosY > gHelpScreen.iLastMouseClickY) {
      //			iNewPosition = iPosY + ( UINT16)( dSizeOfIncrement + .5);
      iNewPosition = iPosY + usMousePosY - gHelpScreen.iLastMouseClickY;
    } else {
      return;
    }

    dTemp = (iNewPosition - iPosY) / dSizeOfIncrement;

    if (dTemp < 0)
      iNumberOfIncrements = (dTemp - 0.5);
    else
      iNumberOfIncrements = (dTemp + 0.5);

    gHelpScreen.iLastMouseClickY = usMousePosY;

    //		return;
  } else {
    // if the mouse is higher then the top of the scroll area, set it to the top of the scroll area
    if (usMousePosY < HLP_SCRN__SCROLL_POSY())
      usMousePosY = HLP_SCRN__SCROLL_POSY();

    dTemp = (usMousePosY - iPosY) / dSizeOfIncrement;

    if (dTemp < 0)
      iNumberOfIncrements = (dTemp - 0.5);
    else
      iNumberOfIncrements = (dTemp + 0.5);
  }

  // if there has been a change
  if (iNumberOfIncrements != 0) {
    ChangeTopLineInTextBufferByAmount(iNumberOfIncrements);
  }
}

function BtnHelpScreenScrollArrowsCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    let iButtonID: INT32 = MSYS_GetBtnUserData(btn, 0);

    btn.uiFlags |= BUTTON_CLICKED_ON;

    // if up
    if (iButtonID == 0) {
      ChangeTopLineInTextBufferByAmount(-1);
    } else {
      ChangeTopLineInTextBufferByAmount(1);
    }

    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    let iButtonID: INT32 = MSYS_GetBtnUserData(btn, 0);

    // if up
    if (iButtonID == 0) {
      ChangeTopLineInTextBufferByAmount(-1);
    } else {
      ChangeTopLineInTextBufferByAmount(1);
    }

    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function AreWeClickingOnScrollBar(usMousePosY: INT32): boolean {
  let iPosY: INT32;
  let iHeight: INT32;

  ({ iHeightOfScrollBox: iHeight, iTopOfScrollBox: iPosY } = CalculateHeightAndPositionForHelpScreenScrollBox());

  if (usMousePosY >= iPosY && usMousePosY < (iPosY + iHeight))
    return true;
  else
    return false;
}

}
