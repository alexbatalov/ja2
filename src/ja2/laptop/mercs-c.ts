namespace ja2 {

const MERC_TEXT_FONT = () => FONT12ARIAL();
const MERC_TEXT_COLOR = FONT_MCOLOR_WHITE;

const MERC_VIDEO_TITLE_FONT = () => FONT10ARIAL();
const MERC_VIDEO_TITLE_COLOR = FONT_MCOLOR_LTYELLOW;

const MERC_BACKGROUND_WIDTH = 125;
const MERC_BACKGROUND_HEIGHT = 100;

const MERC_TITLE_X = LAPTOP_SCREEN_UL_X + 135;
const MERC_TITLE_Y = LAPTOP_SCREEN_WEB_UL_Y + 20;

const MERC_PORTRAIT_X = LAPTOP_SCREEN_UL_X + 198;
const MERC_PORTRAIT_Y = LAPTOP_SCREEN_WEB_UL_Y + 96;
const MERC_PORTRAIT_TEXT_X = MERC_PORTRAIT_X;
const MERC_PORTRAIT_TEXT_Y = MERC_PORTRAIT_Y + 109;
const MERC_PORTRAIT_TEXT_WIDTH = 115;

const MERC_ACCOUNT_BOX_X = LAPTOP_SCREEN_UL_X + 138;
const MERC_ACCOUNT_BOX_Y = LAPTOP_SCREEN_WEB_UL_Y + 251;

const MERC_ACCOUNT_BOX_TEXT_X = MERC_ACCOUNT_BOX_X;
const MERC_ACCOUNT_BOX_TEXT_Y = MERC_ACCOUNT_BOX_Y + 20;
const MERC_ACCOUNT_BOX_TEXT_WIDTH = 110;

const MERC_ACCOUNT_ARROW_X = MERC_ACCOUNT_BOX_X + 125;
const MERC_ACCOUNT_ARROW_Y = MERC_ACCOUNT_BOX_Y + 18;

const MERC_ACCOUNT_BUTTON_X = MERC_ACCOUNT_BOX_X + 133;
const MERC_ACCOUNT_BUTTON_Y = MERC_ACCOUNT_BOX_Y + 8;

const MERC_FILE_BOX_X = MERC_ACCOUNT_BOX_X;
const MERC_FILE_BOX_Y = LAPTOP_SCREEN_WEB_UL_Y + 321;

const MERC_FILE_BOX_TEXT_X = MERC_FILE_BOX_X;
const MERC_FILE_BOX_TEXT_Y = MERC_FILE_BOX_Y + 20;
const MERC_FILE_BOX_TEXT_WIDTH = MERC_ACCOUNT_BOX_TEXT_WIDTH;

const MERC_FILE_ARROW_X = MERC_FILE_BOX_X + 125;
const MERC_FILE_ARROW_Y = MERC_FILE_BOX_Y + 18;

const MERC_FILE_BUTTON_X = MERC_ACCOUNT_BUTTON_X;
const MERC_FILE_BUTTON_Y = MERC_FILE_BOX_Y + 8;

// Video Conference Defines
const MERC_VIDEO_BACKGROUND_X = MERC_PORTRAIT_X;
const MERC_VIDEO_BACKGROUND_Y = MERC_PORTRAIT_Y;
const MERC_VIDEO_BACKGROUND_WIDTH = 116;
const MERC_VIDEO_BACKGROUND_HEIGHT = 108;

const MERC_VIDEO_FACE_X = MERC_VIDEO_BACKGROUND_X + 10;
const MERC_VIDEO_FACE_Y = MERC_VIDEO_BACKGROUND_Y + 17;
const MERC_VIDEO_FACE_WIDTH = 96;
const MERC_VIDEO_FACE_HEIGHT = 86;
const MERC_X_TO_CLOSE_VIDEO_X = MERC_VIDEO_BACKGROUND_X + 104;
const MERC_X_TO_CLOSE_VIDEO_Y = MERC_VIDEO_BACKGROUND_Y + 3;
const MERC_X_VIDEO_TITLE_X = MERC_VIDEO_BACKGROUND_X + 5;
const MERC_X_VIDEO_TITLE_Y = MERC_VIDEO_BACKGROUND_Y + 3;

const MERC_INTRO_TIME = 1000;
const MERC_EXIT_TIME = 500;
const MERC_VIDEO_MERC_ID_FOR_SPECKS = 159; // 255

const MERC_TEXT_BOX_POS_Y = 255;

const SPECK_IDLE_CHAT_DELAY = 10000;

const MERC_NUMBER_OF_RANDOM_QUOTES = 14;

const MERC_FIRST_MERC = Enum268.BIFF;
const MERC_LAST_MERC = Enum268.BUBBA;

// number of payment days ( # of merc days paid ) to get next set of mercs
const MERC_NUM_DAYS_TILL_FIRST_MERC_AVAILABLE = 10;
const MERC_NUM_DAYS_TILL_SECOND_MERC_AVAILABLE = 16;
const MERC_NUM_DAYS_TILL_THIRD_MERC_AVAILABLE = 24;
const MERC_NUM_DAYS_TILL_FOURTH_MERC_AVAILABLE = 30;

const MERC__AMOUNT_OF_MONEY_FOR_BUBBA = 6000;
const MERC__DAY_WHEN_BUBBA_CAN_BECOME_AVAILABLE = 10;

const enum Enum100 {
  MERC_ARRIVES_BUBBA,
  MERC_ARRIVES_LARRY,
  MERC_ARRIVES_NUMB,
  MERC_ARRIVES_COUGAR,

  NUM_MERC_ARRIVALS,
}

interface CONTITION_FOR_MERC_AVAILABLE {
  usMoneyPaid: UINT16;
  usDay: UINT16;
  ubMercArrayID: UINT8;
}

function createConditionForMercAvailableFrom(usMoneyPaid: UINT16, usDay: UINT16, ubMercArrayID: UINT8): CONTITION_FOR_MERC_AVAILABLE {
  return {
    usMoneyPaid,
    usDay,
    ubMercArrayID,
  };
}

let gConditionsForMercAvailability: CONTITION_FOR_MERC_AVAILABLE[] /* [NUM_MERC_ARRIVALS] */ = [
  createConditionForMercAvailableFrom(5000, 8, 6), // BUBBA
  createConditionForMercAvailableFrom(10000, 15, 7), // Larry
  createConditionForMercAvailableFrom(15000, 20, 9), // Numb
  createConditionForMercAvailableFrom(20000, 25, 10), // Cougar
];

const enum Enum101 {
  MERC_DISTORTION_NO_DISTORTION,
  MERC_DISTORTION_PIXELATE_UP,
  MERC_DISTORTION_PIXELATE_DOWN,
  MERC_DISRTORTION_DISTORT_IMAGE,
}

const enum Enum102 {
  MERC_SITE_NEVER_VISITED,
  MERC_SITE_FIRST_VISIT,
  MERC_SITE_SECOND_VISIT,
  MERC_SITE_THIRD_OR_MORE_VISITS,
}

// Image Indetifiers

let guiAccountBox: UINT32;
let guiArrow: UINT32;
let guiFilesBox: UINT32;
let guiMercSymbol: UINT32;
let guiSpecPortrait: UINT32;
let guiMercBackGround: UINT32;
let guiMercVideoFaceBackground: UINT32;
let guiMercVideoPopupBackground: UINT32;

let gubMercArray: UINT8[] /* [NUMBER_OF_MERCS] */ = createArray(NUMBER_OF_MERCS, 0);
export let gubCurMercIndex: UINT8;

let iMercPopUpBox: INT32 = -1;

let gusPositionOfSpecksDialogBox_X: UINT16;
let gsSpeckDialogueTextPopUp: string /* wchar_t[900] */;
let gusSpeckDialogueX: UINT16;
let gusSpeckDialogueActualWidth: UINT16;
let gusSpeckDialogueActualWidth__Pointer = createPointer(() => gusSpeckDialogueActualWidth, (v) => gusSpeckDialogueActualWidth = v);

let gfInMercSite: boolean = false; // this flag is set when inide of the merc site

// Merc Video Conferencing Mode
const enum Enum103 {
  MERC_VIDEO_NO_VIDEO_MODE,
  MERC_VIDEO_INIT_VIDEO_MODE,
  MERC_VIDEO_VIDEO_MODE,
  MERC_VIDEO_EXIT_VIDEO_MODE,
}

let gubCurrentMercVideoMode: UINT8;
let gfMercVideoIsBeingDisplayed: boolean;
let giVideoSpeckFaceIndex: INT32;
export let gusMercVideoSpeckSpeech: UINT16;

let gfDisplaySpeckTextBox: boolean = false;

let gfJustEnteredMercSite: boolean = false;
export let gubArrivedFromMercSubSite: UINT8 = Enum105.MERC_CAME_FROM_OTHER_PAGE; // the merc is arriving from one of the merc sub pages
let gfDoneIntroSpeech: boolean = true;

let gfMercSiteScreenIsReDrawn: boolean = false;

export let gfJustHiredAMercMerc: boolean = false;

let gfRedrawMercSite: boolean = false;

let gfFirstTimeIntoMERCSiteSinceEnteringLaptop: boolean = false;

// used for the random quotes to try to balance the ones that are said
interface NUMBER_TIMES_QUOTE_SAID {
  ubQuoteID: UINT8;
  uiNumberOfTimesQuoteSaid: UINT32;
}

function createNumberOfTimesQuoteSaidFrom(ubQuoteID: UINT8, uiNumberOfTimesQuoteSaid: UINT32): NUMBER_TIMES_QUOTE_SAID {
  return {
    ubQuoteID,
    uiNumberOfTimesQuoteSaid,
  };
}

let gNumberOfTimesQuoteSaid: NUMBER_TIMES_QUOTE_SAID[] /* [MERC_NUMBER_OF_RANDOM_QUOTES] */ = [
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_BIFF, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_HAYWIRE, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_GASKET, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_RAZOR, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_FLO, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_GUMPY, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_LARRY, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_COUGER, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_NUMB, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_BUBBA, 0),

  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_AIM_SLANDER_1, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_AIM_SLANDER_2, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_AIM_SLANDER_3, 0),
  createNumberOfTimesQuoteSaidFrom(Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_AIM_SLANDER_4, 0),
];

//
// Buttons
//

let guiAccountBoxButton: UINT32;
let guiAccountBoxButtonImage: INT32;

// File Box
let guiFileBoxButton: UINT32;

let guiXToCloseMercVideoButton: UINT32;
let guiXToCloseMercVideoButtonImage: INT32;

// Mouse region for the subtitles region when the merc is talking
let gMercSiteSubTitleMouseRegion: MOUSE_REGION = createMouseRegion();

//*******************************
//
//   Function Prototypes
//
//*******************************

// ppp

export function GameInitMercs(): void {
  //	for(i=0; i<NUMBER_OF_MERCS; i++)
  //		gubMercArray[ i ] = i+BIFF;

  // can now be out of order
  gubMercArray[0] = Enum268.BIFF;
  gubMercArray[1] = Enum268.HAYWIRE;
  gubMercArray[2] = Enum268.GASKET;
  gubMercArray[3] = Enum268.RAZOR;
  gubMercArray[4] = Enum268.FLO;
  gubMercArray[5] = Enum268.GUMPY;
  gubMercArray[6] = Enum268.BUBBA;
  gubMercArray[7] = Enum268.LARRY_NORMAL; // if changing this values, change in GetMercIDFromMERCArray()
  gubMercArray[8] = Enum268.LARRY_DRUNK; // if changing this values, change in GetMercIDFromMERCArray()
  gubMercArray[9] = Enum268.NUMB;
  gubMercArray[10] = Enum268.COUGAR;

  LaptopSaveInfo.gubPlayersMercAccountStatus = Enum104.MERC_NO_ACCOUNT;
  gubCurMercIndex = 0;
  LaptopSaveInfo.gubLastMercIndex = NUMBER_OF_BAD_MERCS;

  gubCurrentMercVideoMode = Enum103.MERC_VIDEO_NO_VIDEO_MODE;
  gfMercVideoIsBeingDisplayed = false;

  LaptopSaveInfo.guiNumberOfMercPaymentsInDays = 0;

  gusMercVideoSpeckSpeech = 0;

  /*
          for( i=0; i<MERC_NUMBER_OF_RANDOM_QUOTES; i++ )
          {
                  gNumberOfTimesQuoteSaid[i] = 0;
          }
  */
}

export function EnterMercs(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let vs_desc: VSURFACE_DESC = createVSurfaceDesc();

  SetBookMark(Enum98.MERC_BOOKMARK);

  // Reset a static variable
  HandleSpeckTalking(true);

  InitMercBackGround();

  // load the Account box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\AccountBox.sti");
  if (!(guiAccountBox = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the files Box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\FilesBox.sti");
  if (!(guiFilesBox = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the MercSymbol graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\MERCSymbol.sti");
  if (!(guiMercSymbol = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the SpecPortrait graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\SpecPortrait.sti");
  if (!(guiSpecPortrait = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the Arrow graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\Arrow.sti");
  if (!(guiArrow = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the Merc video conf background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\SpeckComWindow.sti");
  if (!(guiMercVideoPopupBackground = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // Account Box button
  guiAccountBoxButtonImage = LoadButtonImage("LAPTOP\\SmallButtons.sti", -1, 0, -1, 1, -1);

  guiAccountBoxButton = QuickCreateButton(guiAccountBoxButtonImage, MERC_ACCOUNT_BUTTON_X, MERC_ACCOUNT_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnAccountBoxButtonCallback);
  SetButtonCursor(guiAccountBoxButton, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiAccountBoxButton, Enum29.DISABLED_STYLE_SHADED);

  guiFileBoxButton = QuickCreateButton(guiAccountBoxButtonImage, MERC_FILE_BUTTON_X, MERC_FILE_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnFileBoxButtonCallback);
  SetButtonCursor(guiFileBoxButton, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiFileBoxButton, Enum29.DISABLED_STYLE_SHADED);

  // if the player doesnt have an account disable it
  if (LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_NO_ACCOUNT) {
    DisableButton(guiFileBoxButton);
  }

  //
  //	Video Conferencing stuff
  //

  // Create a background video surface to blt the face onto
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = MERC_VIDEO_FACE_WIDTH;
  vs_desc.usHeight = MERC_VIDEO_FACE_HEIGHT;
  vs_desc.ubBitDepth = 16;
  if ((guiMercVideoFaceBackground = AddVideoSurface(vs_desc)) === -1) {
    return false;
  }

  RenderMercs();

  // init the face

  gfJustEnteredMercSite = true;

  // if NOT entering from a subsite
  if (gubArrivedFromMercSubSite == Enum105.MERC_CAME_FROM_OTHER_PAGE) {
    // Set that we have been here before
    if (LaptopSaveInfo.ubPlayerBeenToMercSiteStatus == Enum102.MERC_SITE_NEVER_VISITED)
      LaptopSaveInfo.ubPlayerBeenToMercSiteStatus = Enum102.MERC_SITE_FIRST_VISIT;
    else if (LaptopSaveInfo.ubPlayerBeenToMercSiteStatus == Enum102.MERC_SITE_FIRST_VISIT)
      LaptopSaveInfo.ubPlayerBeenToMercSiteStatus = Enum102.MERC_SITE_SECOND_VISIT;
    else
      LaptopSaveInfo.ubPlayerBeenToMercSiteStatus = Enum102.MERC_SITE_THIRD_OR_MORE_VISITS;

    // Reset the speech variable
    gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;
  }

  GetSpeckConditionalOpening(true);
  //	gubArrivedFromMercSubSite = MERC_CAME_FROM_OTHER_PAGE;

  // if Speck should start talking
  if (ShouldSpeckSayAQuote()) {
    gubCurrentMercVideoMode = Enum103.MERC_VIDEO_INIT_VIDEO_MODE;
  }

  // Reset the some variables
  HandleSpeckIdleConversation(true);

  // Since we are in the site, set the flag
  gfInMercSite = true;

  return true;
}

export function ExitMercs(): void {
  StopSpeckFromTalking();

  if (gfMercVideoIsBeingDisplayed) {
    gfMercVideoIsBeingDisplayed = false;
    DeleteFace(giVideoSpeckFaceIndex);
    InitDestroyXToCloseVideoWindow(false);
    gubCurrentMercVideoMode = Enum103.MERC_VIDEO_NO_VIDEO_MODE;
  }

  DeleteVideoObjectFromIndex(guiAccountBox);
  DeleteVideoObjectFromIndex(guiFilesBox);
  DeleteVideoObjectFromIndex(guiMercSymbol);
  DeleteVideoObjectFromIndex(guiSpecPortrait);
  DeleteVideoObjectFromIndex(guiArrow);
  DeleteVideoObjectFromIndex(guiMercVideoPopupBackground);

  UnloadButtonImage(guiAccountBoxButtonImage);
  RemoveButton(guiFileBoxButton);
  RemoveButton(guiAccountBoxButton);

  RemoveMercBackGround();

  DeleteVideoSurfaceFromIndex(guiMercVideoFaceBackground);

  /*
          //Set that we have been here before
          if( LaptopSaveInfo.ubPlayerBeenToMercSiteStatus == MERC_SITE_FIRST_VISIT )
                  LaptopSaveInfo.ubPlayerBeenToMercSiteStatus = MERC_SITE_SECOND_VISIT;
          else
                  LaptopSaveInfo.ubPlayerBeenToMercSiteStatus = MERC_SITE_THIRD_OR_MORE_VISITS;
  */

  gfJustEnteredMercSite = true;
  gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

  // Remove the merc text box if one is available
  RemoveSpeckPopupTextBox();

  // Set up so next time we come in, we know we came from a differnt page
  gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_OTHER_PAGE;

  gfJustHiredAMercMerc = false;

  // Since we are leaving the site, set the flag
  gfInMercSite = true;

  // Empty the Queue cause Speck could still have a quote in waiting
  EmptyDialogueQueue();
}

export function HandleMercs(): void {
  if (gfRedrawMercSite) {
    RenderMercs();
    gfRedrawMercSite = false;
    gfMercSiteScreenIsReDrawn = true;
  }

  // if Speck has something to say, say it
  if (gusMercVideoSpeckSpeech != MERC_VIDEO_SPECK_SPEECH_NOT_TALKING) // && !gfDoneIntroSpeech )
  {
    // if the face isnt active, make it so
    if (!gfMercVideoIsBeingDisplayed) {
      // Blt the video window background
      DrawMercVideoBackGround();

      InitDestroyXToCloseVideoWindow(true);

      InitMercVideoFace();
      gubCurrentMercVideoMode = Enum103.MERC_VIDEO_INIT_VIDEO_MODE;

      //			gfMercSiteScreenIsReDrawn = TRUE;
    }
  }

  // if the page is redrawn, and we are in video conferencing, redraw the VC backgrund graphic
  if (gfMercVideoIsBeingDisplayed && gfMercSiteScreenIsReDrawn) {
    // Blt the video window background
    DrawMercVideoBackGround();

    gfMercSiteScreenIsReDrawn = false;
  }

  // if Specks should be video conferencing...
  if (gubCurrentMercVideoMode != Enum103.MERC_VIDEO_NO_VIDEO_MODE) {
    HandleTalkingSpeck();
  }

  // Reset the some variables
  HandleSpeckIdleConversation(false);

  if (fCurrentlyInLaptop == false) {
    // if we are exiting the laptop screen, shut up the speck
    StopSpeckFromTalking();
  }
}

export function RenderMercs(): void {
  let hPixHandle: SGPVObject;

  DrawMecBackGround();

  // Title
  hPixHandle = GetVideoObject(guiMercSymbol);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_TITLE_X, MERC_TITLE_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Speck Portrait
  hPixHandle = GetVideoObject(guiSpecPortrait);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_PORTRAIT_X, MERC_PORTRAIT_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Account Box
  hPixHandle = GetVideoObject(guiAccountBox);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_ACCOUNT_BOX_X, MERC_ACCOUNT_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Files Box
  hPixHandle = GetVideoObject(guiFilesBox);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_FILE_BOX_X, MERC_FILE_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Text on the Speck Portrait
  DisplayWrappedString(MERC_PORTRAIT_TEXT_X, MERC_PORTRAIT_TEXT_Y, MERC_PORTRAIT_TEXT_WIDTH, 2, MERC_TEXT_FONT(), MERC_TEXT_COLOR, MercHomePageText[Enum343.MERC_SPECK_OWNER], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // Text on the Account Box
  if (LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_NO_ACCOUNT)
    DisplayWrappedString(MERC_ACCOUNT_BOX_TEXT_X, MERC_ACCOUNT_BOX_TEXT_Y, MERC_ACCOUNT_BOX_TEXT_WIDTH, 2, MERC_TEXT_FONT(), MERC_TEXT_COLOR, MercHomePageText[Enum343.MERC_OPEN_ACCOUNT], FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  else
    DisplayWrappedString(MERC_ACCOUNT_BOX_TEXT_X, MERC_ACCOUNT_BOX_TEXT_Y, MERC_ACCOUNT_BOX_TEXT_WIDTH, 2, MERC_TEXT_FONT(), MERC_TEXT_COLOR, MercHomePageText[Enum343.MERC_VIEW_ACCOUNT], FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  // Text on the Files Box
  DisplayWrappedString(MERC_FILE_BOX_TEXT_X, MERC_FILE_BOX_TEXT_Y, MERC_FILE_BOX_TEXT_WIDTH, 2, MERC_TEXT_FONT(), MERC_TEXT_COLOR, MercHomePageText[Enum343.MERC_VIEW_FILES], FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  // If the Specks popup dioalogue box is active, display it.
  if (iMercPopUpBox != -1) {
    DrawButton(guiAccountBoxButton);
    ButtonList[guiAccountBoxButton].uiFlags |= BUTTON_FORCE_UNDIRTY;

    RenderMercPopUpBoxFromIndex(iMercPopUpBox, gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, FRAME_BUFFER);
  }

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();

  // if the page is redrawn, and we are in video conferencing, redraw the VC backgrund graphic
  gfMercSiteScreenIsReDrawn = true;

  ButtonList[guiAccountBoxButton].uiFlags &= ~BUTTON_FORCE_UNDIRTY;

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

export function InitMercBackGround(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load the Merc background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\MERCBackGround.sti");
  if (!(guiMercBackGround = AddVideoObject(VObjectDesc))) {
    return false;
  }

  return true;
}

export function DrawMecBackGround(): boolean {
  WebPageTileBackground(4, 4, MERC_BACKGROUND_WIDTH, MERC_BACKGROUND_HEIGHT, guiMercBackGround);
  return true;
}

export function RemoveMercBackGround(): boolean {
  DeleteVideoObjectFromIndex(guiMercBackGround);

  return true;
}

function BtnAccountBoxButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= (~BUTTON_CLICKED_ON);

      if (LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_NO_ACCOUNT)
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC_NO_ACCOUNT;
      else
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC_ACCOUNT;

      if (iMercPopUpBox != -1) {
        ButtonList[guiAccountBoxButton].uiFlags |= BUTTON_FORCE_UNDIRTY;

        RenderMercPopUpBoxFromIndex(iMercPopUpBox, gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, FRAME_BUFFER);
      }

      InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function BtnFileBoxButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC_FILES;

      InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

export function DailyUpdateOfMercSite(usDate: UINT16): void {
  let pSoldier: SOLDIERTYPE;
  let sSoldierID: INT16;
  let i: INT16;
  let ubMercID: UINT8;
  let iNumDays: INT32;
  let fAlreadySentEmailToPlayerThisTurn: boolean = false;

  // if its the first day, leave
  if (usDate == 1)
    return;

  iNumDays = 0;

  // loop through all of the hired mercs from M.E.R.C.
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    ubMercID = GetMercIDFromMERCArray(i);
    if (IsMercOnTeam(ubMercID)) {
      // if it larry Roach burn advance.  ( cause larry is in twice, a sober larry and a stoned larry )
      if (i == MERC_LARRY_ROACHBURN)
        continue;

      sSoldierID = GetSoldierIDFromMercID(ubMercID);
      pSoldier = MercPtrs[sSoldierID];

      // if the merc is dead, dont advance the contract length
      if (!IsMercDead(pSoldier.ubProfile)) {
        gMercProfiles[pSoldier.ubProfile].iMercMercContractLength += 1;
        //				pSoldier->iTotalContractLength++;
      }

      // Get the longest time
      if (gMercProfiles[pSoldier.ubProfile].iMercMercContractLength > iNumDays)
        iNumDays = gMercProfiles[pSoldier.ubProfile].iMercMercContractLength;
    }
  }

  // if the players hasnt paid for a while, get email him to tell him to pay
  // iTotalContractLength
  if (iNumDays > MERC_NUM_DAYS_TILL_ACCOUNT_INVALID) {
    if (LaptopSaveInfo.gubPlayersMercAccountStatus != Enum104.MERC_ACCOUNT_INVALID) {
      LaptopSaveInfo.gubPlayersMercAccountStatus = Enum104.MERC_ACCOUNT_INVALID;
      AddEmail(MERC_INVALID, MERC_INVALID_LENGTH, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());
    }
  } else if (iNumDays > MERC_NUM_DAYS_TILL_ACCOUNT_SUSPENDED) {
    if (LaptopSaveInfo.gubPlayersMercAccountStatus != Enum104.MERC_ACCOUNT_SUSPENDED) {
      LaptopSaveInfo.gubPlayersMercAccountStatus = Enum104.MERC_ACCOUNT_SUSPENDED;
      AddEmail(MERC_WARNING, MERC_WARNING_LENGTH, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());

      // Have speck complain next time player come to site
      LaptopSaveInfo.uiSpeckQuoteFlags |= SPECK_QUOTE__SENT_EMAIL_ABOUT_LACK_OF_PAYMENT;
    }
  } else if (iNumDays > MERC_NUM_DAYS_TILL_FIRST_WARNING) {
    if (LaptopSaveInfo.gubPlayersMercAccountStatus != Enum104.MERC_ACCOUNT_VALID_FIRST_WARNING) {
      LaptopSaveInfo.gubPlayersMercAccountStatus = Enum104.MERC_ACCOUNT_VALID_FIRST_WARNING;
      AddEmail(MERC_FIRST_WARNING, MERC_FIRST_WARNING_LENGTH, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());

      // Have speck complain next time player come to site
      LaptopSaveInfo.uiSpeckQuoteFlags |= SPECK_QUOTE__SENT_EMAIL_ABOUT_LACK_OF_PAYMENT;
    }
  }

  // Check and act if any new Merc Mercs should become available
  ShouldAnyNewMercMercBecomeAvailable();

  /*
          //If we should advacne the number of days that the good mercs arrive
  //	if( LaptopSaveInfo.guiNumberOfMercPaymentsInDays > 4 )
          {
                  UINT8 ubNumDays;

  //		ubNumDays = (UINT8) LaptopSaveInfo.guiNumberOfMercPaymentsInDays / 4;
                  ubNumDays = (UINT8) LaptopSaveInfo.guiNumberOfMercPaymentsInDays;

  //		LaptopSaveInfo.guiNumberOfMercPaymentsInDays = LaptopSaveInfo.guiNumberOfMercPaymentsInDays % 4;
                  LaptopSaveInfo.guiNumberOfMercPaymentsInDays = 0;

                  //for the first merc
                  //if the merc is not already here
                  if( LaptopSaveInfo.gbNumDaysTillFirstMercArrives != -1 )
                  {
                          //We advance the day the merc arrives on
                          if( LaptopSaveInfo.gbNumDaysTillFirstMercArrives > ubNumDays )
                          {
                                  LaptopSaveInfo.gbNumDaysTillFirstMercArrives -= ubNumDays;
                          }
                          else
                          {
                                  //its time to add the new mercs
                                  LaptopSaveInfo.gubLastMercIndex = NUMBER_MERCS_AFTER_FIRST_MERC_ARRIVES;

                                  //Set the fact that there are new mercs available
                                  LaptopSaveInfo.fNewMercsAvailableAtMercSite = TRUE;

                                  //if we havent already sent an email this turn
                                  if( !fAlreadySentEmailToPlayerThisTurn )
                                  {
                                          AddEmail( NEW_MERCS_AT_MERC, NEW_MERCS_AT_MERC_LENGTH, SPECK_FROM_MERC, GetWorldTotalMin());
                                          fAlreadySentEmailToPlayerThisTurn = TRUE;
                                  }
                                  LaptopSaveInfo.gbNumDaysTillFirstMercArrives = -1;
                          }
                  }


                  //for the Second merc
                  //if the merc is not already here
                  if( LaptopSaveInfo.gbNumDaysTillSecondMercArrives != -1 )
                  {
                          //We advance the day the merc arrives on
                          if( LaptopSaveInfo.gbNumDaysTillSecondMercArrives > ubNumDays )
                          {
                                  LaptopSaveInfo.gbNumDaysTillSecondMercArrives -= ubNumDays;
                          }
                          else
                          {
                                  //its time to add the new mercs
                                  LaptopSaveInfo.gubLastMercIndex = NUMBER_MERCS_AFTER_SECOND_MERC_ARRIVES;

                                  //Set the fact that there are new mercs available
                                  LaptopSaveInfo.fNewMercsAvailableAtMercSite = TRUE;

                                  //if we havent already sent an email this turn
                                  if( !fAlreadySentEmailToPlayerThisTurn )
                                  {
                                          AddEmail( NEW_MERCS_AT_MERC, NEW_MERCS_AT_MERC_LENGTH, SPECK_FROM_MERC, GetWorldTotalMin());
                                          fAlreadySentEmailToPlayerThisTurn = TRUE;
                                  }
                                  LaptopSaveInfo.gbNumDaysTillSecondMercArrives = -1;
                          }
                  }

                  //for the Third merc
                  //if the merc is not already here
                  if( LaptopSaveInfo.gbNumDaysTillThirdMercArrives != -1 )
                  {
                          //We advance the day the merc arrives on
                          if( LaptopSaveInfo.gbNumDaysTillThirdMercArrives > ubNumDays )
                          {
                                  LaptopSaveInfo.gbNumDaysTillThirdMercArrives -= ubNumDays;
                          }
                          else
                          {
                                  //its time to add the new mercs
                                  LaptopSaveInfo.gubLastMercIndex = NUMBER_MERCS_AFTER_THIRD_MERC_ARRIVES;

                                  //Set the fact that there are new mercs available
                                  LaptopSaveInfo.fNewMercsAvailableAtMercSite = TRUE;

                                  //if we havent already sent an email this turn
                                  if( !fAlreadySentEmailToPlayerThisTurn )
                                  {
                                          AddEmail( NEW_MERCS_AT_MERC, NEW_MERCS_AT_MERC_LENGTH, SPECK_FROM_MERC, GetWorldTotalMin());
                                          fAlreadySentEmailToPlayerThisTurn = TRUE;
                                  }
                                  LaptopSaveInfo.gbNumDaysTillThirdMercArrives = -1;
                          }
                  }

                  //for the Fourth merc
                  //if the merc is not already here
                  if( LaptopSaveInfo.gbNumDaysTillFourthMercArrives != -1 )
                  {
                          //We advance the day the merc arrives on
                          if( LaptopSaveInfo.gbNumDaysTillFourthMercArrives > ubNumDays )
                          {
                                  LaptopSaveInfo.gbNumDaysTillFourthMercArrives -= ubNumDays;
                          }
                          else
                          {
                                  //its time to add the new mercs
                                  LaptopSaveInfo.gubLastMercIndex = NUMBER_MERCS_AFTER_FOURTH_MERC_ARRIVES;

                                  //Set the fact that there are new mercs available
                                  LaptopSaveInfo.fNewMercsAvailableAtMercSite = TRUE;

                                  //if we havent already sent an email this turn
                                  if( !fAlreadySentEmailToPlayerThisTurn )
                                  {
                                          AddEmail( NEW_MERCS_AT_MERC, NEW_MERCS_AT_MERC_LENGTH, SPECK_FROM_MERC, GetWorldTotalMin());
                                          fAlreadySentEmailToPlayerThisTurn = TRUE;
                                  }
                                  LaptopSaveInfo.gbNumDaysTillFourthMercArrives = -1;
                          }
                  }
          }
  */

  // If the merc site has never gone down, the number of MERC payment days is above 'X',
  // and the players account status is ok ( cant have the merc site going down when the player owes him money, player may lose account that way )
  if (ShouldTheMercSiteServerGoDown()) {
    let uiTimeInMinutes: UINT32 = 0;

    // Set the fact the site has gone down
    LaptopSaveInfo.fMercSiteHasGoneDownYet = true;

    // No lnger removing the bookmark, leave it up, and the user will go to the broken link page
    // Remove the book mark
    //		RemoveBookMark( MERC_BOOKMARK );

    // Get the site up the next day at 6:00 pm
    uiTimeInMinutes = GetMidnightOfFutureDayInMinutes(1) + 18 * 60;

    // Add an event that will get the site back up and running
    AddStrategicEvent(Enum132.EVENT_MERC_SITE_BACK_ONLINE, uiTimeInMinutes, 0);
  }
}

// Gets the actual merc id from the array
export function GetMercIDFromMERCArray(ubMercID: UINT8): UINT8 {
  // if it is one of the regular MERCS
  if (ubMercID <= 6) {
    return gubMercArray[ubMercID];
  }

  // if it is Larry, determine if it Stoned larry or straight larry
  else if ((ubMercID == 7) || (ubMercID == 8)) {
    if (HasLarryRelapsed()) {
      return gubMercArray[8];
    } else {
      return gubMercArray[7];
    }
  }

  // if it is one of the newer mercs
  else if (ubMercID <= 10) {
    return gubMercArray[ubMercID];
  }

  // else its an error
  else {
    Assert(0);
    return 1;
  }
}

/*
BOOLEAN InitDeleteMercVideoConferenceMode()
{
        static BOOLEAN	fVideoConfModeCreated = FALSE;

        if( !fVideoConfModeCreated && gubCurrentMercVideoMode == MERC_VIDEO_INIT_VIDEO_MODE )
        {
//		InitMercVideoFace();
        }

        if( fVideoConfModeCreated && gubCurrentMercVideoMode == MERC_VIDEO_EXIT_VIDEO_MODE )
        {
                //If merc is talking, stop him from talking
                ShutupaYoFace( giVideoSpeckFaceIndex );

                //Delete the face
                DeleteFace( giVideoSpeckFaceIndex  );

                gfMercVideoIsBeingDisplayed = FALSE;
        }


        return(TRUE);
}
*/

function InitMercVideoFace(): void {
  // Alocates space, and loads the sti for SPECK
  //	giVideoSpeckFaceIndex = InternalInitFace( NO_PROFILE, NOBODY, 0, MERC_VIDEO_MERC_ID_FOR_SPECKS, 3000, 2000 );
  giVideoSpeckFaceIndex = InitFace(MERC_VIDEO_MERC_ID_FOR_SPECKS, NOBODY, 0);

  // Sets up the eyes blinking and the mouth moving
  //	InternalSetAutoFaceActive( guiMercVideoFaceBackground, FACE_AUTO_RESTORE_BUFFER , giVideoSpeckFaceIndex, 0, 0, 8, 9, 7, 25 );
  SetAutoFaceActive(guiMercVideoFaceBackground, FACE_AUTO_RESTORE_BUFFER, giVideoSpeckFaceIndex, 0, 0);

  // Renders the face to the background
  RenderAutoFace(giVideoSpeckFaceIndex);

  // enables the global flag indicating the the video is being displayed
  gfMercVideoIsBeingDisplayed = true;
}

function StartSpeckTalking(usQuoteNum: UINT16): boolean {
  if (usQuoteNum == MERC_VIDEO_SPECK_SPEECH_NOT_TALKING || usQuoteNum == MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET)
    return false;

  // Reset the time for when speck starts to do the random quotes
  HandleSpeckIdleConversation(true);

  // Start Speck talking
  if (!CharacterDialogue(MERC_VIDEO_MERC_ID_FOR_SPECKS, usQuoteNum, giVideoSpeckFaceIndex, DIALOGUE_SPECK_CONTACT_PAGE_UI, false, false)) {
    Assert(0);
    return false;
  }

  gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

  return true;
}

// Performs the frame by frame update
/* static */ let HandleSpeckTalking__fWasTheMercTalking: boolean = false;
function HandleSpeckTalking(fReset: boolean): boolean {
  let fIsTheMercTalking: boolean;
  let SrcRect: SGPRect = createSGPRect();
  let DestRect: SGPRect = createSGPRect();

  if (fReset) {
    HandleSpeckTalking__fWasTheMercTalking = false;
    return true;
  }

  SrcRect.iLeft = 0;
  SrcRect.iTop = 0;
  SrcRect.iRight = 48;
  SrcRect.iBottom = 43;

  DestRect.iLeft = MERC_VIDEO_FACE_X;
  DestRect.iTop = MERC_VIDEO_FACE_Y;
  DestRect.iRight = DestRect.iLeft + MERC_VIDEO_FACE_WIDTH;
  DestRect.iBottom = DestRect.iTop + MERC_VIDEO_FACE_HEIGHT;

  HandleDialogue();
  HandleAutoFaces();
  HandleTalkingAutoFaces();

  // Blt the face surface to the video background surface
  if (!BltStretchVideoSurface(FRAME_BUFFER, guiMercVideoFaceBackground, 0, 0, VO_BLT_SRCTRANSPARENCY, SrcRect, DestRect))
    return false;

  // HandleCurrentMercDistortion();

  InvalidateRegion(MERC_VIDEO_BACKGROUND_X, MERC_VIDEO_BACKGROUND_Y, (MERC_VIDEO_BACKGROUND_X + MERC_VIDEO_BACKGROUND_WIDTH), (MERC_VIDEO_BACKGROUND_Y + MERC_VIDEO_BACKGROUND_HEIGHT));

  // find out if the merc just stopped talking
  fIsTheMercTalking = gFacesData[giVideoSpeckFaceIndex].fTalking;

  // if the merc just stopped talking
  if (HandleSpeckTalking__fWasTheMercTalking && !fIsTheMercTalking) {
    HandleSpeckTalking__fWasTheMercTalking = false;

    if (DialogueQueueIsEmpty()) {
      RemoveSpeckPopupTextBox();

      gfDisplaySpeckTextBox = false;

      gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

      // Reset the time for when speck starts to do the random quotes
      HandleSpeckIdleConversation(true);
    } else
      fIsTheMercTalking = true;
  }

  HandleSpeckTalking__fWasTheMercTalking = fIsTheMercTalking;

  return fIsTheMercTalking;
}

/* static */ let HandleCurrentMercDistortion__ubCurrentMercDistortionMode: UINT8 = Enum101.MERC_DISTORTION_NO_DISTORTION;
function HandleCurrentMercDistortion(): void {
  let fReturnStatus: boolean;

  // if there is no current distortion mode, randomly choose one
  if (HandleCurrentMercDistortion__ubCurrentMercDistortionMode == Enum101.MERC_DISTORTION_NO_DISTORTION) {
    let ubRandom: UINT8;

    ubRandom = Random(200);

    if (ubRandom < 40) {
      ubRandom = Random(100);
      if (ubRandom < 10)
        HandleCurrentMercDistortion__ubCurrentMercDistortionMode = Enum101.MERC_DISRTORTION_DISTORT_IMAGE;
      else if (ubRandom < 30)
        HandleCurrentMercDistortion__ubCurrentMercDistortionMode = Enum101.MERC_DISTORTION_PIXELATE_UP;
    }
  }

  // Perform whichever video distortion mode is current
  switch (HandleCurrentMercDistortion__ubCurrentMercDistortionMode) {
    case Enum101.MERC_DISTORTION_NO_DISTORTION:
      break;

    case Enum101.MERC_DISTORTION_PIXELATE_UP:
      //			fReturnStatus = PixelateVideoMercImage( TRUE );
      fReturnStatus = PixelateVideoMercImage(true, MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_HEIGHT);
      if (fReturnStatus)
        HandleCurrentMercDistortion__ubCurrentMercDistortionMode = Enum101.MERC_DISTORTION_PIXELATE_DOWN;
      break;

    case Enum101.MERC_DISTORTION_PIXELATE_DOWN:
      //			fReturnStatus = PixelateVideoMercImage( FALSE );
      fReturnStatus = PixelateVideoMercImage(false, MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_HEIGHT);
      if (fReturnStatus)
        HandleCurrentMercDistortion__ubCurrentMercDistortionMode = Enum101.MERC_DISTORTION_NO_DISTORTION;
      break;

    case Enum101.MERC_DISRTORTION_DISTORT_IMAGE:
      //			fReturnStatus = DistortVideoMercImage();
      fReturnStatus = DistortVideoMercImage(MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_HEIGHT);

      if (fReturnStatus)
        HandleCurrentMercDistortion__ubCurrentMercDistortionMode = Enum101.MERC_DISTORTION_NO_DISTORTION;
      break;
  }
}

/* static */ let PixelateVideoMercImage__uiLastTime: UINT32;
/* static */ let PixelateVideoMercImage__ubPixelationAmount: UINT8 = 255;
function PixelateVideoMercImage(fUp: boolean, usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, usHeight: UINT16): boolean {
  let uiCurTime: UINT32 = GetJA2Clock();
  let pBuffer: Uint8ClampedArray;
  let DestColor: UINT16;
  let uiPitch: UINT32 = 0;
  let i: UINT16;
  let j: UINT16;
  let fReturnStatus: boolean = false;
  i = 0;

  pBuffer = LockVideoSurface(FRAME_BUFFER, createPointer(() => uiPitch, (v) => uiPitch = v));
  Assert(pBuffer);

  if (PixelateVideoMercImage__ubPixelationAmount == 255) {
    if (fUp)
      PixelateVideoMercImage__ubPixelationAmount = 1;
    else
      PixelateVideoMercImage__ubPixelationAmount = 4;
    PixelateVideoMercImage__uiLastTime = GetJA2Clock();
  }

  // is it time to change the animation
  if ((uiCurTime - PixelateVideoMercImage__uiLastTime) > 100) {
    // if we are starting to pixelate the image
    if (fUp) {
      // the varying degrees of pixelation
      if (PixelateVideoMercImage__ubPixelationAmount <= 4) {
        PixelateVideoMercImage__ubPixelationAmount++;
        fReturnStatus = false;
      } else {
        PixelateVideoMercImage__ubPixelationAmount = 255;
        fReturnStatus = true;
      }
    }
    // else we are pixelating down
    else {
      if (PixelateVideoMercImage__ubPixelationAmount > 1) {
        PixelateVideoMercImage__ubPixelationAmount--;
        fReturnStatus = false;
      } else {
        PixelateVideoMercImage__ubPixelationAmount = 255;
        fReturnStatus = true;
      }
    }
    PixelateVideoMercImage__uiLastTime = GetJA2Clock();
  } else
    i = i;

  uiPitch /= 4;
  i = j = 0;
  DestColor = pBuffer[(j * uiPitch) + i];

  for (j = usPosY; j < usPosY + usHeight; j++) {
    for (i = usPosX; i < usPosX + usWidth; i++) {
      // get the next color
      if (!(i % PixelateVideoMercImage__ubPixelationAmount)) {
        if (i < usPosX + usWidth - PixelateVideoMercImage__ubPixelationAmount)
          DestColor = pBuffer[(j * uiPitch) + i + PixelateVideoMercImage__ubPixelationAmount / 2];
        else
          DestColor = pBuffer[(j * uiPitch) + i];
      }

      pBuffer[(j * uiPitch) + i] = DestColor;
    }
  }

  UnLockVideoSurface(FRAME_BUFFER);

  return fReturnStatus;
}

/* static */ let DistortVideoMercImage__usDistortionValue: UINT16 = 255;
function DistortVideoMercImage(usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, usHeight: UINT16): boolean {
  let uiPitch: UINT32 = 0;
  let i: UINT16;
  let j: UINT16;
  let pBuffer: Uint8ClampedArray;
  let DestColor: UINT16;
  let uiColor: UINT32;
  let red: UINT8;
  let green: UINT8;
  let blue: UINT8;
  let uiReturnValue: boolean;
  let usEndOnLine: UINT16 = 0;

  pBuffer = LockVideoSurface(FRAME_BUFFER, createPointer(() => uiPitch, (v) => uiPitch = v));
  Assert(pBuffer);

  uiPitch /= 4;
  j = MERC_VIDEO_FACE_Y;
  i = MERC_VIDEO_FACE_X;

  DestColor = pBuffer[(j * uiPitch) + i];

  if (DistortVideoMercImage__usDistortionValue >= usPosY + usHeight) {
    DistortVideoMercImage__usDistortionValue = 0;
    uiReturnValue = true;
  } else {
    DistortVideoMercImage__usDistortionValue++;

    uiReturnValue = false;

    if (DistortVideoMercImage__usDistortionValue + 10 >= usHeight)
      usEndOnLine = usHeight - 1;
    else
      usEndOnLine = DistortVideoMercImage__usDistortionValue + 10;

    for (j = usPosY + DistortVideoMercImage__usDistortionValue; j < usPosY + usEndOnLine; j++) {
      for (i = usPosX; i < usPosX + usWidth; i++) {
        DestColor = pBuffer[(j * uiPitch) + i];

        uiColor = GetRGBColor(DestColor);

        red = uiColor;
        green = (uiColor >> 8);
        blue = (uiColor >> 16);

        DestColor = Get16BPPColor(FROMRGB(255 - red, 250 - green, 250 - blue));

        pBuffer[(j * uiPitch) + i] = DestColor;
      }
    }
  }
  UnLockVideoSurface(FRAME_BUFFER);

  return uiReturnValue;
}

/* static */ let InitDestroyXToCloseVideoWindow__fButtonCreated: boolean = false;
function InitDestroyXToCloseVideoWindow(fCreate: boolean): boolean {
  // if we are asked to create the buttons and the button isnt already created
  if (fCreate && !InitDestroyXToCloseVideoWindow__fButtonCreated) {
    guiXToCloseMercVideoButtonImage = LoadButtonImage("LAPTOP\\CloseButton.sti", -1, 0, -1, 1, -1);

    guiXToCloseMercVideoButton = QuickCreateButton(guiXToCloseMercVideoButtonImage, MERC_X_TO_CLOSE_VIDEO_X, MERC_X_TO_CLOSE_VIDEO_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnXToCloseMercVideoButtonCallback);
    SetButtonCursor(guiXToCloseMercVideoButton, Enum317.CURSOR_LAPTOP_SCREEN);

    InitDestroyXToCloseVideoWindow__fButtonCreated = true;
  }

  // if we are asked to destroy the buttons and the buttons are created
  if (!fCreate && InitDestroyXToCloseVideoWindow__fButtonCreated) {
    UnloadButtonImage(guiXToCloseMercVideoButtonImage);
    RemoveButton(guiXToCloseMercVideoButton);
    InitDestroyXToCloseVideoWindow__fButtonCreated = false;
  }

  return true;
}

function BtnXToCloseMercVideoButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= (~BUTTON_CLICKED_ON);

      // Stop speck from talking
      //			ShutupaYoFace( giVideoSpeckFaceIndex );
      StopSpeckFromTalking();

      // make sure we are done the intro speech
      gfDoneIntroSpeech = true;

      // remove the video conf mode
      gubCurrentMercVideoMode = Enum103.MERC_VIDEO_EXIT_VIDEO_MODE;

      gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

      InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

/* static */ let DisplayMercVideoIntro__uiLastTime: UINT32 = 0;
function DisplayMercVideoIntro(usTimeTillFinish: UINT16): boolean {
  let uiCurTime: UINT32 = GetJA2Clock();

  // init variable
  if (DisplayMercVideoIntro__uiLastTime == 0)
    DisplayMercVideoIntro__uiLastTime = uiCurTime;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_X + MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_Y + MERC_VIDEO_FACE_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

  // if the intro is done
  if ((uiCurTime - DisplayMercVideoIntro__uiLastTime) > usTimeTillFinish) {
    DisplayMercVideoIntro__uiLastTime = 0;
    return true;
  } else
    return false;
}

function HandleTalkingSpeck(): void {
  let fIsSpeckTalking: boolean = true;

  switch (gubCurrentMercVideoMode) {
    // Init the video conferencing
    case Enum103.MERC_VIDEO_INIT_VIDEO_MODE:
      // perform some opening animation.  When its done start Speck talking

      // if the intro is finished
      if (DisplayMercVideoIntro(MERC_INTRO_TIME)) {
        // NULL out the string
        gsSpeckDialogueTextPopUp = '';

        // Start speck talking
        if (gusMercVideoSpeckSpeech != MERC_VIDEO_SPECK_SPEECH_NOT_TALKING || gusMercVideoSpeckSpeech != <number>MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET)
          StartSpeckTalking(gusMercVideoSpeckSpeech);

        gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;
        gubCurrentMercVideoMode = Enum103.MERC_VIDEO_VIDEO_MODE;
      }
      break;

    // Display his talking and blinking face
    case Enum103.MERC_VIDEO_VIDEO_MODE:

      // Make sure the accounts button does not overwrite the dialog text
      //			ButtonList[ guiAccountBoxButton ]->uiFlags |= BUTTON_FORCE_UNDIRTY;
      // def:

      if (gfJustEnteredMercSite && gubArrivedFromMercSubSite != Enum105.MERC_CAME_FROM_OTHER_PAGE || gfFirstTimeIntoMERCSiteSinceEnteringLaptop) {
        gfFirstTimeIntoMERCSiteSinceEnteringLaptop = false;
        GetSpeckConditionalOpening(false);
        gfJustEnteredMercSite = false;
      } else {
        fIsSpeckTalking = HandleSpeckTalking(false);

        if (!fIsSpeckTalking)
          fIsSpeckTalking = GetSpeckConditionalOpening(false);

        // if speck didnt start talking, see if he just hired someone
        if (!fIsSpeckTalking) {
          fIsSpeckTalking = ShouldSpeckStartTalkingDueToActionOnSubPage();
        }
      }

      if (!fIsSpeckTalking)
        gubCurrentMercVideoMode = Enum103.MERC_VIDEO_EXIT_VIDEO_MODE;

      if (gfDisplaySpeckTextBox && gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES]) {
        if (!gfInMercSite) {
          StopSpeckFromTalking();
          return;
        }

        if (gsSpeckDialogueTextPopUp[0] != '\0') {
          //					DrawButton( guiAccountBoxButton );
          //					ButtonList[ guiAccountBoxButton ]->uiFlags |= BUTTON_FORCE_UNDIRTY;

          if (iMercPopUpBox != -1) {
            DrawButton(guiAccountBoxButton);
            ButtonList[guiAccountBoxButton].uiFlags |= BUTTON_FORCE_UNDIRTY;

            RenderMercPopUpBoxFromIndex(iMercPopUpBox, gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, FRAME_BUFFER);
          }
        }
      }

      break;

    // shut down the video conferencing
    case Enum103.MERC_VIDEO_EXIT_VIDEO_MODE:

      // if the exit animation is finished, exit the video conf window
      if (DisplayMercVideoIntro(MERC_EXIT_TIME)) {
        StopSpeckFromTalking();

        // Delete the face
        DeleteFace(giVideoSpeckFaceIndex);
        InitDestroyXToCloseVideoWindow(false);

        gfRedrawMercSite = true;
        gfMercVideoIsBeingDisplayed = false;

        // Remove the merc popup
        RemoveSpeckPopupTextBox();

        // maybe display ending animation
        gubCurrentMercVideoMode = Enum103.MERC_VIDEO_NO_VIDEO_MODE;
      } else {
        // else we are done the exit animation.  The area is not being invalidated anymore
        InvalidateRegion(MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_X + MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_Y + MERC_VIDEO_FACE_HEIGHT);
      }
      break;
  }
}

export function DisplayTextForSpeckVideoPopUp(pString: string /* STR16 */): void {
  let usActualHeight: UINT16 = 0;
  let iOldMercPopUpBoxId: INT32 = iMercPopUpBox;

  // If the user has selected no subtitles
  if (!gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES])
    return;

//	wcscpy(gsSpeckDialogueTextPopUp, pString);
// add the "" around the speech.
  gsSpeckDialogueTextPopUp = swprintf("\"%s\"", pString);

  gfDisplaySpeckTextBox = true;

  // Set this so the popup box doesnt render in RenderMercs()
  iMercPopUpBox = -1;

  // Render the screen to get rid of any old text popup boxes
  RenderMercs();

  iMercPopUpBox = iOldMercPopUpBoxId;

  if (gfMercVideoIsBeingDisplayed && gfMercSiteScreenIsReDrawn) {
    DrawMercVideoBackGround();
  }

  // Create the popup box
  SET_USE_WINFONTS(true);
  SET_WINFONT(giSubTitleWinFont);
  iMercPopUpBox = PrepareMercPopupBox(iMercPopUpBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, gsSpeckDialogueTextPopUp, 300, 0, 0, 0, gusSpeckDialogueActualWidth__Pointer, createPointer(() => usActualHeight, (v) => usActualHeight = v));
  SET_USE_WINFONTS(false);

  gusSpeckDialogueX = (LAPTOP_SCREEN_LR_X - gusSpeckDialogueActualWidth - LAPTOP_SCREEN_UL_X) / 2 + LAPTOP_SCREEN_UL_X;

  // Render the pop box
  RenderMercPopUpBoxFromIndex(iMercPopUpBox, gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, FRAME_BUFFER);

  // check to make sure the region is not already initialized
  if (!(gMercSiteSubTitleMouseRegion.uiFlags & MSYS_REGION_EXISTS)) {
    MSYS_DefineRegion(gMercSiteSubTitleMouseRegion, gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, (gusSpeckDialogueX + gusSpeckDialogueActualWidth), (MERC_TEXT_BOX_POS_Y + usActualHeight), MSYS_PRIORITY_HIGH, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, MercSiteSubTitleRegionCallBack);
    MSYS_AddRegion(gMercSiteSubTitleMouseRegion);
  }
}

function CheatToGetAll5Merc(): void {
  LaptopSaveInfo.guiNumberOfMercPaymentsInDays += 20;

  /*
          LaptopSaveInfo.gbNumDaysTillFirstMercArrives = 1;
          LaptopSaveInfo.gbNumDaysTillSecondMercArrives = 1;
          LaptopSaveInfo.gbNumDaysTillThirdMercArrives = 1;
          LaptopSaveInfo.gbNumDaysTillFourthMercArrives = 1;
  */
  LaptopSaveInfo.gubLastMercIndex = NUMBER_MERCS_AFTER_FOURTH_MERC_ARRIVES;
}

/* static */ let GetSpeckConditionalOpening__usQuoteToSay: UINT16 = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;
function GetSpeckConditionalOpening(fJustEnteredScreen: boolean): boolean {
  let ubRandom: UINT8 = 0;
  let ubCnt: UINT8;
  let fCanSayLackOfPaymentQuote: boolean = true;
  let fCanUseIdleTag: boolean = false;

  // If we just entered the screen, reset some variables
  if (fJustEnteredScreen) {
    gfDoneIntroSpeech = false;
    GetSpeckConditionalOpening__usQuoteToSay = 0;
    return false;
  }

  // if we are done the intro speech, or arrived from a sub page, get out of the function
  if (gfDoneIntroSpeech || gubArrivedFromMercSubSite != Enum105.MERC_CAME_FROM_OTHER_PAGE) {
    return false;
  }

  gfDoneIntroSpeech = true;

  // set the opening quote based on if the player has been here before
  if (LaptopSaveInfo.ubPlayerBeenToMercSiteStatus == Enum102.MERC_SITE_FIRST_VISIT && GetSpeckConditionalOpening__usQuoteToSay <= 8) //!= 0 )
  {
    StartSpeckTalking(GetSpeckConditionalOpening__usQuoteToSay);
    GetSpeckConditionalOpening__usQuoteToSay++;
    if (GetSpeckConditionalOpening__usQuoteToSay <= 8)
      gfDoneIntroSpeech = false;
  }

  // if its the players second visit
  else if (LaptopSaveInfo.ubPlayerBeenToMercSiteStatus == Enum102.MERC_SITE_SECOND_VISIT) {
    StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_1_TOUGH_START);
    fCanUseIdleTag = true;
  }

  // We have been here at least 2 times before, Check which quote we should use
  else {
    // if the player has not hired any MERC mercs before
    // CJC Dec 1 2002: fixing this, so near-bankrupt msg will play
    if (!IsAnyMercMercsHired() && CalcMercDaysServed() == 0) {
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_2_BUSINESS_BAD);
    }

    // else if it is the first visit since the server went down
    else if (LaptopSaveInfo.fFirstVisitSinceServerWentDown == true) {
      LaptopSaveInfo.fFirstVisitSinceServerWentDown = <boolean><unknown>2;
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_9_FIRST_VISIT_SINCE_SERVER_WENT_DOWN);
      fCanUseIdleTag = true;
    }
    /*
                    //else if new mercs are available
                    else if( LaptopSaveInfo.fNewMercsAvailableAtMercSite )
                    {
                            LaptopSaveInfo.fNewMercsAvailableAtMercSite = FALSE;

                            StartSpeckTalking( SPECK_QUOTE_ALTERNATE_OPENING_11_NEW_MERCS_AVAILABLE );
                    }
    */
    // else if lots of MERC mercs are DEAD, and speck can say the quote ( dont want him to continously say it )
    else if (CountNumberOfMercMercsWhoAreDead() >= 2 && LaptopSaveInfo.ubSpeckCanSayPlayersLostQuote) {
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_12_PLAYERS_LOST_MERCS);

      // Set it so speck Wont say the quote again till someone else dies
      LaptopSaveInfo.ubSpeckCanSayPlayersLostQuote = 0;
    }

    // else if player owes lots of money
    else if (LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_ACCOUNT_SUSPENDED) {
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_5_PLAYER_OWES_SPECK_ACCOUNT_SUSPENDED);

      fCanSayLackOfPaymentQuote = false;
    }

    // else if the player owes speck a large sum of money, have speck say so
    else if (CalculateHowMuchPlayerOwesSpeck() > 5000) {
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_6_PLAYER_OWES_SPECK_ALMOST_BANKRUPT_1);
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_6_PLAYER_OWES_SPECK_ALMOST_BANKRUPT_2);

      fCanSayLackOfPaymentQuote = false;
    }

    else {
      let ubNumMercsDead: UINT8 = NumberOfMercMercsDead();
      let ubRandom: UINT8 = Random(100);

      // if business is good
      //			if( ubRandom < 40 && ubNumMercsDead < 2 && CountNumberOfMercMercsHired() > 1 )
      if (ubRandom < 40 && AreAnyOfTheNewMercsAvailable() && CountNumberOfMercMercsHired() > 1) {
        StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_3_BUSINESS_GOOD);
        fCanUseIdleTag = true;
      }

      // or if still trying to recruit ( the last recruit hasnt arrived and the player has paid for some of his mercs )
      //			else if( ubRandom < 80 && LaptopSaveInfo.gbNumDaysTillFourthMercArrives != -1 && LaptopSaveInfo.gbNumDaysTillFirstMercArrives < MERC_NUM_DAYS_TILL_FIRST_MERC_AVAILABLE )
      else if (ubRandom < 80 && gConditionsForMercAvailability[LaptopSaveInfo.ubLastMercAvailableId].usMoneyPaid <= LaptopSaveInfo.uiTotalMoneyPaidToSpeck && CanMercBeAvailableYet(LaptopSaveInfo.ubLastMercAvailableId)) {
        StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_4_TRYING_TO_RECRUIT);
        fCanUseIdleTag = true;
      }

      // else use the generic opening
      else {
        StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_10_GENERIC_OPENING);
        fCanUseIdleTag = true;

        // if the  merc hasnt said the line before
        if (!LaptopSaveInfo.fSaidGenericOpeningInMercSite) {
          LaptopSaveInfo.fSaidGenericOpeningInMercSite = true;
          StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_10_TAG_FOR_20);
        }
      }
    }

    if (fCanUseIdleTag) {
      let ubRandom: UINT8 = Random(100);

      if (ubRandom < 50) {
        ubRandom = Random(4);

        switch (ubRandom) {
          case 0:
            StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_ON_AFTER_OTHER_TAGS_1);
            break;
          case 1:
            StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_ON_AFTER_OTHER_TAGS_2);
            break;
          case 2:
            StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_ON_AFTER_OTHER_TAGS_3);
            break;
          case 3:
            StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_ON_AFTER_OTHER_TAGS_4);
            break;
          default:
            Assert(0);
        }
      }
    }
  }

  // If Speck has sent an email to the player, and the player still hasnt paid, has speck complain about it.
  // CJC Dec 1 2002 ACTUALLY HOOKED IN THAT CHECK
  if (fCanSayLackOfPaymentQuote) {
    if (LaptopSaveInfo.uiSpeckQuoteFlags & SPECK_QUOTE__SENT_EMAIL_ABOUT_LACK_OF_PAYMENT) {
      LaptopSaveInfo.uiSpeckQuoteFlags &= ~SPECK_QUOTE__SENT_EMAIL_ABOUT_LACK_OF_PAYMENT;

      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_PLAYER_OWES_MONEY);
    }
  }

  // if new mercs are available
  if (LaptopSaveInfo.fNewMercsAvailableAtMercSite) {
    LaptopSaveInfo.fNewMercsAvailableAtMercSite = false;

    StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_11_NEW_MERCS_AVAILABLE);
  }

  // if any mercs are dead
  if (IsAnyMercMercsDead()) {
    // if no merc has died before
    if (!LaptopSaveInfo.fHasAMercDiedAtMercSite) {
      LaptopSaveInfo.fHasAMercDiedAtMercSite = true;
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_FIRST_MERC_DIES);
    }

    // loop through all the mercs and see if any are dead and the quote is not said
    for (ubCnt = MERC_FIRST_MERC; ubCnt < MERC_LAST_MERC; ubCnt++) {
      // if the merc is dead
      if (IsMercDead(ubCnt)) {
        // if the quote has not been said
        if (!(gMercProfiles[ubCnt].ubMiscFlags3 & PROFILE_MISC_FLAG3_MERC_MERC_IS_DEAD_AND_QUOTE_SAID)) {
          // set the flag
          gMercProfiles[ubCnt].ubMiscFlags3 |= PROFILE_MISC_FLAG3_MERC_MERC_IS_DEAD_AND_QUOTE_SAID;

          switch (ubCnt) {
            case Enum268.BIFF:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_BIFF_IS_DEAD);
              break;
            case Enum268.HAYWIRE:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_HAYWIRE_IS_DEAD);
              break;
            case Enum268.GASKET:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_GASKET_IS_DEAD);
              break;
            case Enum268.RAZOR:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_RAZOR_IS_DEAD);
              break;
            case Enum268.FLO:
              // if biff is dead
              if (IsMercDead(Enum268.BIFF))
                StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_FLO_IS_DEAD_BIFF_IS_DEAD);
              else {
                StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_FLO_IS_DEAD_BIFF_ALIVE);
                MakeBiffAwayForCoupleOfDays();
              }
              break;

            case Enum268.GUMPY:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_GUMPY_IS_DEAD);
              break;
            case Enum268.LARRY_NORMAL:
            case Enum268.LARRY_DRUNK:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_LARRY_IS_DEAD);
              break;
            case Enum268.COUGAR:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_COUGER_IS_DEAD);
              break;
            case Enum268.NUMB:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_NUMB_IS_DEAD);
              break;
            case Enum268.BUBBA:
              StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_BUBBA_IS_DEAD);
              break;
          };
        }
      }
    }
  }

  // if flo has married the cousin
  if (gubFact[Enum170.FACT_PC_MARRYING_DARYL_IS_FLO]) {
    // if speck hasnt said the quote before, and Biff is NOT dead
    if (!LaptopSaveInfo.fSpeckSaidFloMarriedCousinQuote && !IsMercDead(Enum268.BIFF)) {
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_FLO_MARRIED_A_COUSIN_BIFF_IS_ALIVE);
      LaptopSaveInfo.fSpeckSaidFloMarriedCousinQuote = true;

      MakeBiffAwayForCoupleOfDays();
    }
  }

  // if larry has relapsed
  if (HasLarryRelapsed() && !(LaptopSaveInfo.uiSpeckQuoteFlags & SPECK_QUOTE__ALREADY_TOLD_PLAYER_THAT_LARRY_RELAPSED)) {
    LaptopSaveInfo.uiSpeckQuoteFlags |= SPECK_QUOTE__ALREADY_TOLD_PLAYER_THAT_LARRY_RELAPSED;

    StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_LARRY_RELAPSED);
  }

  return true;
}

function IsAnyMercMercsHired(): boolean {
  let ubMercID: UINT8;
  let i: UINT8;

  // loop through all of the hired mercs from M.E.R.C.
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    ubMercID = GetMercIDFromMERCArray(i);
    if (IsMercOnTeam(ubMercID)) {
      return true;
    }
  }

  return false;
}

function IsAnyMercMercsDead(): boolean {
  let i: UINT8;

  // loop through all of the hired mercs from M.E.R.C.
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    if (gMercProfiles[i + Enum268.BIFF].bMercStatus == MERC_IS_DEAD)
      return true;
  }

  return false;
}

function NumberOfMercMercsDead(): UINT8 {
  let i: UINT8;
  let ubNumDead: UINT8 = 0;

  // loop through all of the hired mercs from M.E.R.C.
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    if (gMercProfiles[i + Enum268.BIFF].bMercStatus == MERC_IS_DEAD)
      ubNumDead++;
  }

  return ubNumDead;
}

function CountNumberOfMercMercsHired(): UINT8 {
  let ubMercID: UINT8;
  let i: UINT8;
  let ubCount: UINT8 = 0;

  // loop through all of the hired mercs from M.E.R.C.
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    ubMercID = GetMercIDFromMERCArray(i);
    if (IsMercOnTeam(ubMercID)) {
      ubCount++;
    }
  }

  return ubCount;
}

function CountNumberOfMercMercsWhoAreDead(): UINT8 {
  let i: UINT8;
  let ubCount: UINT8 = 0;

  // loop through all of the hired mercs from M.E.R.C.
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    if (gMercProfiles[i + Enum268.BIFF].bMercStatus == MERC_IS_DEAD) {
      ubCount++;
    }
  }

  return ubCount;
}

// Mouse Call back for the pop up text box
function MercSiteSubTitleRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP || iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    StopSpeckFromTalking();
  }
}

function RemoveSpeckPopupTextBox(): void {
  if (iMercPopUpBox == -1)
    return;

  if (gMercSiteSubTitleMouseRegion.uiFlags & MSYS_REGION_EXISTS)
    MSYS_RemoveRegion(gMercSiteSubTitleMouseRegion);

  if (RemoveMercPopupBoxFromIndex(iMercPopUpBox)) {
    iMercPopUpBox = -1;
  }

  // redraw the screen
  gfRedrawMercSite = true;
}

function HandlePlayerHiringMerc(ubHiredMercID: UINT8): void {
  gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

  // if the players is in good finacial standing
  // DEF: 3/19/99: Dont know why this was done
  //	if( LaptopSaveInfo.iCurrentBalance >= 2000 )
  {
    // determine which quote to say based on the merc that was hired
    switch (ubHiredMercID) {
      // Biff is hired
      case Enum268.BIFF:
        // if Larry is available, advertise for larry
        if (IsMercMercAvailable(Enum268.LARRY_NORMAL) || IsMercMercAvailable(Enum268.LARRY_DRUNK))
          StartSpeckTalking(Enum111.SPECK_QUOTE_PLAYERS_HIRES_BIFF_SPECK_PLUGS_LARRY);

        // if flo is available, advertise for flo
        if (IsMercMercAvailable(Enum268.FLO))
          StartSpeckTalking(Enum111.SPECK_QUOTE_PLAYERS_HIRES_BIFF_SPECK_PLUGS_FLO);
        break;

      // haywire is hired
      case Enum268.HAYWIRE:
        // if razor is available, advertise for razor
        if (IsMercMercAvailable(Enum268.RAZOR))
          StartSpeckTalking(Enum111.SPECK_QUOTE_PLAYERS_HIRES_HAYWIRE_SPECK_PLUGS_RAZOR);
        break;

      // razor is hired
      case Enum268.RAZOR:
        // if haywire is available, advertise for haywire
        if (IsMercMercAvailable(Enum268.HAYWIRE))
          StartSpeckTalking(Enum111.SPECK_QUOTE_PLAYERS_HIRES_RAZOR_SPECK_PLUGS_HAYWIRE);
        break;

      // flo is hired
      case Enum268.FLO:
        // if biff is available, advertise for biff
        if (IsMercMercAvailable(Enum268.BIFF))
          StartSpeckTalking(Enum111.SPECK_QUOTE_PLAYERS_HIRES_FLO_SPECK_PLUGS_BIFF);
        break;

      // larry is hired
      case Enum268.LARRY_NORMAL:
      case Enum268.LARRY_DRUNK:
        // if biff is available, advertise for biff
        if (IsMercMercAvailable(Enum268.BIFF))
          StartSpeckTalking(Enum111.SPECK_QUOTE_PLAYERS_HIRES_LARRY_SPECK_PLUGS_BIFF);
        break;
    }
  }

  gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_HIRE_PAGE;
}

function IsMercMercAvailable(ubMercID: UINT8): boolean {
  let cnt: UINT8;

  // loop through the array of mercs
  for (cnt = 0; cnt < LaptopSaveInfo.gubLastMercIndex; cnt++) {
    // if this is the merc
    if (GetMercIDFromMERCArray(cnt) == ubMercID) {
      // if the merc is available, and Not dead
      //			if( gMercProfiles[ ubMercID ].bMercStatus == 0 && !IsMercDead( ubMercID ) )
      if (IsMercHireable(ubMercID))
        return true;
    }
  }

  return false;
}

function ShouldSpeckStartTalkingDueToActionOnSubPage(): boolean {
  // if the merc came from the hire screen
  if (gfJustHiredAMercMerc) {
    HandlePlayerHiringMerc(GetMercIDFromMERCArray(gubCurMercIndex));

    // get speck to say the thank you
    if (Random(100) > 50)
      StartSpeckTalking(Enum111.SPECK_QUOTE_GENERIC_THANKS_FOR_HIRING_MERCS_1);
    else
      StartSpeckTalking(Enum111.SPECK_QUOTE_GENERIC_THANKS_FOR_HIRING_MERCS_2);

    gfJustHiredAMercMerc = false;
    //				gfDoneIntroSpeech = TRUE;

    return true;
  }

  return false;
}

function ShouldSpeckSayAQuote(): boolean {
  // if we are entering from anywhere except a sub page, and we should say the opening quote
  if (gfJustEnteredMercSite && gubArrivedFromMercSubSite == Enum105.MERC_CAME_FROM_OTHER_PAGE) {
    // if the merc has something to say
    if (gusMercVideoSpeckSpeech != MERC_VIDEO_SPECK_SPEECH_NOT_TALKING)
      return false;
  }

  // if the player just hired a merc
  if (gfJustHiredAMercMerc) {
    gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET;
    return true;

    /*
                    //if the merc has something to say
                    if( gusMercVideoSpeckSpeech != MERC_VIDEO_SPECK_SPEECH_NOT_TALKING )
                            return( TRUE );
                    else
                    {
                            gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET;
                            return( TRUE );
                    }
    */
  }

  // If it is the first time into the merc site
  if (gfFirstTimeIntoMERCSiteSinceEnteringLaptop) {
    //		gfFirstTimeIntoMERCSiteSinceEnteringLaptop = FALSE;
    gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET;
    return true;
  }

  /*
          //if we are entering from anywhere except a sub page
          if( gubArrivedFromMercSubSite == MERC_CAME_FROM_OTHER_PAGE )
          {
                  GetSpeckConditionalOpening( FALSE );
                  return( TRUE );
          }
  */
  return false;
}

/* static */ let HandleSpeckIdleConversation__uiLastTime: UINT32 = 0;
function HandleSpeckIdleConversation(fReset: boolean): void {
  let uiCurTime: UINT32 = GetJA2Clock();
  let sLeastSaidQuote: INT16;

  // if we should reset the variables
  if (fReset) {
    HandleSpeckIdleConversation__uiLastTime = GetJA2Clock();
    return;
  }

  if ((uiCurTime - HandleSpeckIdleConversation__uiLastTime) > SPECK_IDLE_CHAT_DELAY) {
    // if Speck is not talking
    if (!gfMercVideoIsBeingDisplayed) {
      sLeastSaidQuote = GetRandomQuoteThatHasBeenSaidTheLeast();

      if (sLeastSaidQuote != -1)
        gusMercVideoSpeckSpeech = sLeastSaidQuote;

      // Say the aim slander quotes the least
      if (sLeastSaidQuote >= 47 && sLeastSaidQuote <= 57) {
        IncreaseMercRandomQuoteValue(sLeastSaidQuote, 1);
      } else if (sLeastSaidQuote != -1)
        IncreaseMercRandomQuoteValue(sLeastSaidQuote, 3);
    }

    HandleSpeckIdleConversation__uiLastTime = GetJA2Clock();
  }
}

function GetRandomQuoteThatHasBeenSaidTheLeast(): INT16 {
  let cnt: UINT8;
  let sSmallestNumber: INT16 = 255;

  for (cnt = 0; cnt < MERC_NUMBER_OF_RANDOM_QUOTES; cnt++) {
    // if the quote can be said ( the merc has not been hired )
    if (CanMercQuoteBeSaid(gNumberOfTimesQuoteSaid[cnt].ubQuoteID)) {
      // if this quote has been said less times then the last one
      if (gNumberOfTimesQuoteSaid[cnt].uiNumberOfTimesQuoteSaid < gNumberOfTimesQuoteSaid[sSmallestNumber].uiNumberOfTimesQuoteSaid) {
        sSmallestNumber = cnt;
      }
    }
  }

  if (sSmallestNumber == 255)
    return -1;
  else
    return gNumberOfTimesQuoteSaid[sSmallestNumber].ubQuoteID;
}

function IncreaseMercRandomQuoteValue(ubQuoteID: UINT8, ubValue: UINT8): void {
  let cnt: UINT8;

  for (cnt = 0; cnt < MERC_NUMBER_OF_RANDOM_QUOTES; cnt++) {
    if (gNumberOfTimesQuoteSaid[cnt].ubQuoteID == ubQuoteID) {
      if (gNumberOfTimesQuoteSaid[cnt].uiNumberOfTimesQuoteSaid + ubValue > 255)
        gNumberOfTimesQuoteSaid[cnt].uiNumberOfTimesQuoteSaid = 255;
      else
        gNumberOfTimesQuoteSaid[cnt].uiNumberOfTimesQuoteSaid += ubValue;
      break;
    }
  }
}

function StopSpeckFromTalking(): void {
  if (giVideoSpeckFaceIndex == -1)
    return;

  // Stop speck from talking
  ShutupaYoFace(giVideoSpeckFaceIndex);

  RemoveSpeckPopupTextBox();

  gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;
}

function HasLarryRelapsed(): boolean {
  return CheckFact(Enum170.FACT_LARRY_CHANGED, 0);
}

// Gets Called on each enter into laptop.
export function EnterInitMercSite(): void {
  gfFirstTimeIntoMERCSiteSinceEnteringLaptop = true;
  gubCurMercIndex = 0;
}

function ShouldTheMercSiteServerGoDown(): boolean {
  let uiDay: UINT32 = GetWorldDay();

  // If the merc site has never gone down, the first new merc has shown ( which shows the player is using the site ),
  // and the players account status is ok ( cant have the merc site going down when the player owes him money, player may lose account that way )
  //	if( !LaptopSaveInfo.fMercSiteHasGoneDownYet  && LaptopSaveInfo.gbNumDaysTillThirdMercArrives <= 6 && LaptopSaveInfo.gubPlayersMercAccountStatus == MERC_ACCOUNT_VALID )
  if (!LaptopSaveInfo.fMercSiteHasGoneDownYet && LaptopSaveInfo.ubLastMercAvailableId >= 1 && LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_ACCOUNT_VALID) {
    if (Random(100) < (uiDay * 2 + 10)) {
      return true;
    } else {
      return false;
    }
  }

  return false;
}

export function GetMercSiteBackOnline(): void {
  // Add an email telling the user the site is back up
  AddEmail(MERC_NEW_SITE_ADDRESS, MERC_NEW_SITE_ADDRESS_LENGTH, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());

  // Set a flag indicating that the server just went up ( so speck can make a comment when the player next visits the site )
  LaptopSaveInfo.fFirstVisitSinceServerWentDown = true;
}

function DrawMercVideoBackGround(): void {
  let hPixHandle: SGPVObject;

  hPixHandle = GetVideoObject(guiMercVideoPopupBackground);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_VIDEO_BACKGROUND_X, MERC_VIDEO_BACKGROUND_Y, VO_BLT_SRCTRANSPARENCY, null);

  // put the title on the window
  DrawTextToScreen(MercHomePageText[Enum343.MERC_SPECK_COM], MERC_X_VIDEO_TITLE_X, MERC_X_VIDEO_TITLE_Y, 0, MERC_VIDEO_TITLE_FONT(), MERC_VIDEO_TITLE_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  InvalidateRegion(MERC_VIDEO_BACKGROUND_X, MERC_VIDEO_BACKGROUND_Y, (MERC_VIDEO_BACKGROUND_X + MERC_VIDEO_BACKGROUND_WIDTH), (MERC_VIDEO_BACKGROUND_Y + MERC_VIDEO_BACKGROUND_HEIGHT));
}

export function DisableMercSiteButton(): void {
  if (iMercPopUpBox != -1) {
    ButtonList[guiAccountBoxButton].uiFlags |= BUTTON_FORCE_UNDIRTY;
  }
}

function CanMercQuoteBeSaid(uiQuoteID: UINT32): boolean {
  let fRetVal: boolean = true;

  // switch onb the quote being said, if hes plugging a merc that has already been hired, dont say it
  switch (uiQuoteID) {
    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_BIFF:
      if (!IsMercMercAvailable(Enum268.BIFF))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_HAYWIRE:
      if (!IsMercMercAvailable(Enum268.HAYWIRE))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_GASKET:
      if (!IsMercMercAvailable(Enum268.GASKET))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_RAZOR:
      if (!IsMercMercAvailable(Enum268.RAZOR))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_FLO:
      if (!IsMercMercAvailable(Enum268.FLO))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_GUMPY:
      if (!IsMercMercAvailable(Enum268.GUMPY))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_LARRY:
      if (!IsMercMercAvailable(Enum268.LARRY_NORMAL) || IsMercMercAvailable(Enum268.LARRY_DRUNK))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_COUGER:
      if (!IsMercMercAvailable(Enum268.COUGAR))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_NUMB:
      if (!IsMercMercAvailable(Enum268.NUMB))
        fRetVal = false;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_BUBBA:
      if (!IsMercMercAvailable(Enum268.BUBBA))
        fRetVal = false;
      break;
  }

  return fRetVal;
}

export function InitializeNumDaysMercArrive(): void {
  /*
          LaptopSaveInfo.gbNumDaysTillFirstMercArrives = MERC_NUM_DAYS_TILL_FIRST_MERC_AVAILABLE;
          LaptopSaveInfo.gbNumDaysTillSecondMercArrives = MERC_NUM_DAYS_TILL_SECOND_MERC_AVAILABLE;
          LaptopSaveInfo.gbNumDaysTillThirdMercArrives = MERC_NUM_DAYS_TILL_THIRD_MERC_AVAILABLE;
          LaptopSaveInfo.gbNumDaysTillFourthMercArrives = MERC_NUM_DAYS_TILL_FOURTH_MERC_AVAILABLE;
  */
}

function MakeBiffAwayForCoupleOfDays(): void {
  gMercProfiles[Enum268.BIFF].uiDayBecomesAvailable = Random(2) + 2;
}

function AreAnyOfTheNewMercsAvailable(): boolean {
  let i: UINT8;
  let ubMercID: UINT8;

  if (LaptopSaveInfo.fNewMercsAvailableAtMercSite)
    return false;

  for (i = (Enum268.LARRY_NORMAL - Enum268.BIFF); i <= LaptopSaveInfo.gubLastMercIndex; i++) {
    ubMercID = GetMercIDFromMERCArray(i);

    if (IsMercMercAvailable(ubMercID))
      return true;
  }

  return false;
}

function ShouldAnyNewMercMercBecomeAvailable(): void {
  let fNewMercAreAvailable: boolean = false;

  // for bubba
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == GUMPY )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_BUBBA)) {
      fNewMercAreAvailable = true;
    }
  }

  // for Larry
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == LARRY_NORMAL ||
  //		GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == LARRY_DRUNK )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_LARRY)) {
      fNewMercAreAvailable = true;
    }
  }

  // for Numb
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == NUMB )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_NUMB)) {
      fNewMercAreAvailable = true;
    }
  }

  // for COUGAR
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == COUGAR )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_COUGAR)) {
      fNewMercAreAvailable = true;
    }
  }

  // if there is a new merc available
  if (fNewMercAreAvailable) {
    // Set up an event to add the merc in x days
    AddStrategicEvent(Enum132.EVENT_MERC_SITE_NEW_MERC_AVAILABLE, GetMidnightOfFutureDayInMinutes(1) + 420 + Random(3 * 60), 0);
  }
}

function CanMercBeAvailableYet(ubMercToCheck: UINT8): boolean {
  // if the merc is already available
  if (gConditionsForMercAvailability[ubMercToCheck].ubMercArrayID <= LaptopSaveInfo.gubLastMercIndex)
    return false;

  // if the merc is already hired
  if (!IsMercHireable(GetMercIDFromMERCArray(gConditionsForMercAvailability[ubMercToCheck].ubMercArrayID)))
    return false;

  // if player has paid enough money for the merc to be available, and the it is after the current day
  if (gConditionsForMercAvailability[ubMercToCheck].usMoneyPaid <= LaptopSaveInfo.uiTotalMoneyPaidToSpeck && gConditionsForMercAvailability[ubMercToCheck].usDay <= GetWorldDay()) {
    return true;
  }

  return false;
}

export function NewMercsAvailableAtMercSiteCallBack(): void {
  let fSendEmail: boolean = false;
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == BUBBA )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_BUBBA)) {
      LaptopSaveInfo.gubLastMercIndex++;
      LaptopSaveInfo.ubLastMercAvailableId = Enum100.MERC_ARRIVES_BUBBA;
      fSendEmail = true;
    }
  }

  // for Larry
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == LARRY_NORMAL ||
  //			GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == LARRY_DRUNK )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_LARRY)) {
      LaptopSaveInfo.gubLastMercIndex++;
      LaptopSaveInfo.ubLastMercAvailableId = Enum100.MERC_ARRIVES_LARRY;
      fSendEmail = true;
    }
  }

  // for Numb
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == NUMB )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_NUMB)) {
      LaptopSaveInfo.gubLastMercIndex = 9;
      LaptopSaveInfo.ubLastMercAvailableId = Enum100.MERC_ARRIVES_NUMB;
      fSendEmail = true;
    }
  }

  // for COUGAR
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == COUGAR )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_COUGAR)) {
      LaptopSaveInfo.gubLastMercIndex = 10;
      LaptopSaveInfo.ubLastMercAvailableId = Enum100.MERC_ARRIVES_COUGAR;
      fSendEmail = true;
    }
  }

  if (fSendEmail)
    AddEmail(NEW_MERCS_AT_MERC, NEW_MERCS_AT_MERC_LENGTH, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());

  // new mercs are available
  LaptopSaveInfo.fNewMercsAvailableAtMercSite = true;
}

// used for older saves
export function CalcAproximateAmountPaidToSpeck(): void {
  let i: UINT8;
  let ubMercID: UINT8;

  // loop through all the mercs and tally up the amount speck should have been paid
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    // get the id
    ubMercID = GetMercIDFromMERCArray(i);

    // increment the amount
    LaptopSaveInfo.uiTotalMoneyPaidToSpeck += gMercProfiles[ubMercID].uiTotalCostToDate;
  }
}

// CJC Dec 1 2002: calculate whether any MERC characters have been used at all
function CalcMercDaysServed(): UINT32 {
  let i: UINT8;
  let ubMercID: UINT8;
  let uiDaysServed: UINT32 = 0;

  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    // get the id
    ubMercID = GetMercIDFromMERCArray(i);

    uiDaysServed += gMercProfiles[ubMercID].usTotalDaysServed;
  }
  return uiDaysServed;
}

}
