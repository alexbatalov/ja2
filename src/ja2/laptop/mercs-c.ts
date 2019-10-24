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

let gConditionsForMercAvailability: CONTITION_FOR_MERC_AVAILABLE[] /* [NUM_MERC_ARRIVALS] */ = [
  [ 5000, 8, 6 ], // BUBBA
  [ 10000, 15, 7 ], // Larry
  [ 15000, 20, 9 ], // Numb
  [ 20000, 25, 10 ], // Cougar
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

let gubMercArray: UINT8[] /* [NUMBER_OF_MERCS] */;
let gubCurMercIndex: UINT8;

let iMercPopUpBox: INT32 = -1;

let gusPositionOfSpecksDialogBox_X: UINT16;
let gsSpeckDialogueTextPopUp: wchar_t[] /* [900] */;
let gusSpeckDialogueX: UINT16;
let gusSpeckDialogueActualWidth: UINT16;

let gfInMercSite: BOOLEAN = FALSE; // this flag is set when inide of the merc site

// Merc Video Conferencing Mode
const enum Enum103 {
  MERC_VIDEO_NO_VIDEO_MODE,
  MERC_VIDEO_INIT_VIDEO_MODE,
  MERC_VIDEO_VIDEO_MODE,
  MERC_VIDEO_EXIT_VIDEO_MODE,
}

let gubCurrentMercVideoMode: UINT8;
let gfMercVideoIsBeingDisplayed: BOOLEAN;
let giVideoSpeckFaceIndex: INT32;
let gusMercVideoSpeckSpeech: UINT16;

let gfDisplaySpeckTextBox: BOOLEAN = FALSE;

let gfJustEnteredMercSite: BOOLEAN = FALSE;
let gubArrivedFromMercSubSite: UINT8 = Enum105.MERC_CAME_FROM_OTHER_PAGE; // the merc is arriving from one of the merc sub pages
let gfDoneIntroSpeech: BOOLEAN = TRUE;

let gfMercSiteScreenIsReDrawn: BOOLEAN = FALSE;

let gfJustHiredAMercMerc: BOOLEAN = FALSE;

let gfRedrawMercSite: BOOLEAN = FALSE;

let gfFirstTimeIntoMERCSiteSinceEnteringLaptop: BOOLEAN = FALSE;

// used for the random quotes to try to balance the ones that are said
interface NUMBER_TIMES_QUOTE_SAID {
  ubQuoteID: UINT8;
  uiNumberOfTimesQuoteSaid: UINT32;
}
let gNumberOfTimesQuoteSaid: NUMBER_TIMES_QUOTE_SAID[] /* [MERC_NUMBER_OF_RANDOM_QUOTES] */ = [
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_BIFF, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_HAYWIRE, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_GASKET, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_RAZOR, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_FLO, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_GUMPY, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_LARRY, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_COUGER, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_NUMB, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_BUBBA, 0 ],

  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_AIM_SLANDER_1, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_AIM_SLANDER_2, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_AIM_SLANDER_3, 0 ],
  [ Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_AIM_SLANDER_4, 0 ],
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
let gMercSiteSubTitleMouseRegion: MOUSE_REGION;

//*******************************
//
//   Function Prototypes
//
//*******************************

// ppp

function GameInitMercs(): void {
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
  gfMercVideoIsBeingDisplayed = FALSE;

  LaptopSaveInfo.guiNumberOfMercPaymentsInDays = 0;

  gusMercVideoSpeckSpeech = 0;

  /*
          for( i=0; i<MERC_NUMBER_OF_RANDOM_QUOTES; i++ )
          {
                  gNumberOfTimesQuoteSaid[i] = 0;
          }
  */
}

function EnterMercs(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let vs_desc: VSURFACE_DESC;

  SetBookMark(Enum98.MERC_BOOKMARK);

  // Reset a static variable
  HandleSpeckTalking(TRUE);

  InitMercBackGround();

  // load the Account box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\AccountBox.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiAccountBox)));

  // load the files Box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\FilesBox.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFilesBox)));

  // load the MercSymbol graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\MERCSymbol.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiMercSymbol)));

  // load the SpecPortrait graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\SpecPortrait.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSpecPortrait)));

  // load the Arrow graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Arrow.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiArrow)));

  // load the Merc video conf background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\SpeckComWindow.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiMercVideoPopupBackground)));

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
  CHECKF(AddVideoSurface(addressof(vs_desc), addressof(guiMercVideoFaceBackground)));

  RenderMercs();

  // init the face

  gfJustEnteredMercSite = TRUE;

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

  GetSpeckConditionalOpening(TRUE);
  //	gubArrivedFromMercSubSite = MERC_CAME_FROM_OTHER_PAGE;

  // if Speck should start talking
  if (ShouldSpeckSayAQuote()) {
    gubCurrentMercVideoMode = Enum103.MERC_VIDEO_INIT_VIDEO_MODE;
  }

  // Reset the some variables
  HandleSpeckIdleConversation(TRUE);

  // Since we are in the site, set the flag
  gfInMercSite = TRUE;

  return TRUE;
}

function ExitMercs(): void {
  StopSpeckFromTalking();

  if (gfMercVideoIsBeingDisplayed) {
    gfMercVideoIsBeingDisplayed = FALSE;
    DeleteFace(giVideoSpeckFaceIndex);
    InitDestroyXToCloseVideoWindow(FALSE);
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

  gfJustEnteredMercSite = TRUE;
  gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

  // Remove the merc text box if one is available
  RemoveSpeckPopupTextBox();

  // Set up so next time we come in, we know we came from a differnt page
  gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_OTHER_PAGE;

  gfJustHiredAMercMerc = FALSE;

  // Since we are leaving the site, set the flag
  gfInMercSite = TRUE;

  // Empty the Queue cause Speck could still have a quote in waiting
  EmptyDialogueQueue();
}

function HandleMercs(): void {
  if (gfRedrawMercSite) {
    RenderMercs();
    gfRedrawMercSite = FALSE;
    gfMercSiteScreenIsReDrawn = TRUE;
  }

  // if Speck has something to say, say it
  if (gusMercVideoSpeckSpeech != MERC_VIDEO_SPECK_SPEECH_NOT_TALKING) // && !gfDoneIntroSpeech )
  {
    // if the face isnt active, make it so
    if (!gfMercVideoIsBeingDisplayed) {
      // Blt the video window background
      DrawMercVideoBackGround();

      InitDestroyXToCloseVideoWindow(TRUE);

      InitMercVideoFace();
      gubCurrentMercVideoMode = Enum103.MERC_VIDEO_INIT_VIDEO_MODE;

      //			gfMercSiteScreenIsReDrawn = TRUE;
    }
  }

  // if the page is redrawn, and we are in video conferencing, redraw the VC backgrund graphic
  if (gfMercVideoIsBeingDisplayed && gfMercSiteScreenIsReDrawn) {
    // Blt the video window background
    DrawMercVideoBackGround();

    gfMercSiteScreenIsReDrawn = FALSE;
  }

  // if Specks should be video conferencing...
  if (gubCurrentMercVideoMode != Enum103.MERC_VIDEO_NO_VIDEO_MODE) {
    HandleTalkingSpeck();
  }

  // Reset the some variables
  HandleSpeckIdleConversation(FALSE);

  if (fCurrentlyInLaptop == FALSE) {
    // if we are exiting the laptop screen, shut up the speck
    StopSpeckFromTalking();
  }
}

function RenderMercs(): void {
  let hPixHandle: HVOBJECT;

  DrawMecBackGround();

  // Title
  GetVideoObject(addressof(hPixHandle), guiMercSymbol);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_TITLE_X, MERC_TITLE_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Speck Portrait
  GetVideoObject(addressof(hPixHandle), guiSpecPortrait);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_PORTRAIT_X, MERC_PORTRAIT_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Account Box
  GetVideoObject(addressof(hPixHandle), guiAccountBox);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_ACCOUNT_BOX_X, MERC_ACCOUNT_BOX_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Files Box
  GetVideoObject(addressof(hPixHandle), guiFilesBox);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_FILE_BOX_X, MERC_FILE_BOX_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Text on the Speck Portrait
  DisplayWrappedString(MERC_PORTRAIT_TEXT_X, MERC_PORTRAIT_TEXT_Y, MERC_PORTRAIT_TEXT_WIDTH, 2, MERC_TEXT_FONT(), MERC_TEXT_COLOR, MercHomePageText[Enum343.MERC_SPECK_OWNER], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Text on the Account Box
  if (LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_NO_ACCOUNT)
    DisplayWrappedString(MERC_ACCOUNT_BOX_TEXT_X, MERC_ACCOUNT_BOX_TEXT_Y, MERC_ACCOUNT_BOX_TEXT_WIDTH, 2, MERC_TEXT_FONT(), MERC_TEXT_COLOR, MercHomePageText[Enum343.MERC_OPEN_ACCOUNT], FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  else
    DisplayWrappedString(MERC_ACCOUNT_BOX_TEXT_X, MERC_ACCOUNT_BOX_TEXT_Y, MERC_ACCOUNT_BOX_TEXT_WIDTH, 2, MERC_TEXT_FONT(), MERC_TEXT_COLOR, MercHomePageText[Enum343.MERC_VIEW_ACCOUNT], FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

  // Text on the Files Box
  DisplayWrappedString(MERC_FILE_BOX_TEXT_X, MERC_FILE_BOX_TEXT_Y, MERC_FILE_BOX_TEXT_WIDTH, 2, MERC_TEXT_FONT(), MERC_TEXT_COLOR, MercHomePageText[Enum343.MERC_VIEW_FILES], FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

  // If the Specks popup dioalogue box is active, display it.
  if (iMercPopUpBox != -1) {
    DrawButton(guiAccountBoxButton);
    ButtonList[guiAccountBoxButton].value.uiFlags |= BUTTON_FORCE_UNDIRTY;

    RenderMercPopUpBoxFromIndex(iMercPopUpBox, gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, FRAME_BUFFER);
  }

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();

  // if the page is redrawn, and we are in video conferencing, redraw the VC backgrund graphic
  gfMercSiteScreenIsReDrawn = TRUE;

  ButtonList[guiAccountBoxButton].value.uiFlags &= ~BUTTON_FORCE_UNDIRTY;

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function InitMercBackGround(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  // load the Merc background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\MERCBackGround.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiMercBackGround)));

  return TRUE;
}

function DrawMecBackGround(): BOOLEAN {
  WebPageTileBackground(4, 4, MERC_BACKGROUND_WIDTH, MERC_BACKGROUND_HEIGHT, guiMercBackGround);
  return TRUE;
}

function RemoveMercBackGround(): BOOLEAN {
  DeleteVideoObjectFromIndex(guiMercBackGround);

  return TRUE;
}

function BtnAccountBoxButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      if (LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_NO_ACCOUNT)
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC_NO_ACCOUNT;
      else
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC_ACCOUNT;

      if (iMercPopUpBox != -1) {
        ButtonList[guiAccountBoxButton].value.uiFlags |= BUTTON_FORCE_UNDIRTY;

        RenderMercPopUpBoxFromIndex(iMercPopUpBox, gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, FRAME_BUFFER);
      }

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnFileBoxButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC_FILES;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function DailyUpdateOfMercSite(usDate: UINT16): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sSoldierID: INT16;
  let i: INT16;
  let ubMercID: UINT8;
  let iNumDays: INT32;
  let fAlreadySentEmailToPlayerThisTurn: BOOLEAN = FALSE;

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
      if (!IsMercDead(pSoldier.value.ubProfile)) {
        gMercProfiles[pSoldier.value.ubProfile].iMercMercContractLength += 1;
        //				pSoldier->iTotalContractLength++;
      }

      // Get the longest time
      if (gMercProfiles[pSoldier.value.ubProfile].iMercMercContractLength > iNumDays)
        iNumDays = gMercProfiles[pSoldier.value.ubProfile].iMercMercContractLength;
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
    LaptopSaveInfo.fMercSiteHasGoneDownYet = TRUE;

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
function GetMercIDFromMERCArray(ubMercID: UINT8): UINT8 {
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
    return TRUE;
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
  gfMercVideoIsBeingDisplayed = TRUE;
}

function StartSpeckTalking(usQuoteNum: UINT16): BOOLEAN {
  if (usQuoteNum == MERC_VIDEO_SPECK_SPEECH_NOT_TALKING || usQuoteNum == MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET)
    return FALSE;

  // Reset the time for when speck starts to do the random quotes
  HandleSpeckIdleConversation(TRUE);

  // Start Speck talking
  if (!CharacterDialogue(MERC_VIDEO_MERC_ID_FOR_SPECKS, usQuoteNum, giVideoSpeckFaceIndex, DIALOGUE_SPECK_CONTACT_PAGE_UI, FALSE, FALSE)) {
    Assert(0);
    return FALSE;
  }

  gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

  return TRUE;
}

// Performs the frame by frame update
function HandleSpeckTalking(fReset: BOOLEAN): BOOLEAN {
  /* static */ let fWasTheMercTalking: BOOLEAN = FALSE;
  let fIsTheMercTalking: BOOLEAN;
  let SrcRect: SGPRect;
  let DestRect: SGPRect;

  if (fReset) {
    fWasTheMercTalking = FALSE;
    return TRUE;
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
  if (!BltStretchVideoSurface(FRAME_BUFFER, guiMercVideoFaceBackground, 0, 0, VO_BLT_SRCTRANSPARENCY, addressof(SrcRect), addressof(DestRect)))
    return FALSE;

  // HandleCurrentMercDistortion();

  InvalidateRegion(MERC_VIDEO_BACKGROUND_X, MERC_VIDEO_BACKGROUND_Y, (MERC_VIDEO_BACKGROUND_X + MERC_VIDEO_BACKGROUND_WIDTH), (MERC_VIDEO_BACKGROUND_Y + MERC_VIDEO_BACKGROUND_HEIGHT));

  // find out if the merc just stopped talking
  fIsTheMercTalking = gFacesData[giVideoSpeckFaceIndex].fTalking;

  // if the merc just stopped talking
  if (fWasTheMercTalking && !fIsTheMercTalking) {
    fWasTheMercTalking = FALSE;

    if (DialogueQueueIsEmpty()) {
      RemoveSpeckPopupTextBox();

      gfDisplaySpeckTextBox = FALSE;

      gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

      // Reset the time for when speck starts to do the random quotes
      HandleSpeckIdleConversation(TRUE);
    } else
      fIsTheMercTalking = TRUE;
  }

  fWasTheMercTalking = fIsTheMercTalking;

  return fIsTheMercTalking;
}

function HandleCurrentMercDistortion(): void {
  /* static */ let ubCurrentMercDistortionMode: UINT8 = Enum101.MERC_DISTORTION_NO_DISTORTION;
  let fReturnStatus: BOOLEAN;

  // if there is no current distortion mode, randomly choose one
  if (ubCurrentMercDistortionMode == Enum101.MERC_DISTORTION_NO_DISTORTION) {
    let ubRandom: UINT8;

    ubRandom = Random(200);

    if (ubRandom < 40) {
      ubRandom = Random(100);
      if (ubRandom < 10)
        ubCurrentMercDistortionMode = Enum101.MERC_DISRTORTION_DISTORT_IMAGE;
      else if (ubRandom < 30)
        ubCurrentMercDistortionMode = Enum101.MERC_DISTORTION_PIXELATE_UP;
    }
  }

  // Perform whichever video distortion mode is current
  switch (ubCurrentMercDistortionMode) {
    case Enum101.MERC_DISTORTION_NO_DISTORTION:
      break;

    case Enum101.MERC_DISTORTION_PIXELATE_UP:
      //			fReturnStatus = PixelateVideoMercImage( TRUE );
      fReturnStatus = PixelateVideoMercImage(TRUE, MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_HEIGHT);
      if (fReturnStatus)
        ubCurrentMercDistortionMode = Enum101.MERC_DISTORTION_PIXELATE_DOWN;
      break;

    case Enum101.MERC_DISTORTION_PIXELATE_DOWN:
      //			fReturnStatus = PixelateVideoMercImage( FALSE );
      fReturnStatus = PixelateVideoMercImage(FALSE, MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_HEIGHT);
      if (fReturnStatus)
        ubCurrentMercDistortionMode = Enum101.MERC_DISTORTION_NO_DISTORTION;
      break;

    case Enum101.MERC_DISRTORTION_DISTORT_IMAGE:
      //			fReturnStatus = DistortVideoMercImage();
      fReturnStatus = DistortVideoMercImage(MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_HEIGHT);

      if (fReturnStatus)
        ubCurrentMercDistortionMode = Enum101.MERC_DISTORTION_NO_DISTORTION;
      break;
  }
}

function PixelateVideoMercImage(fUp: BOOLEAN, usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, usHeight: UINT16): BOOLEAN {
  /* static */ let uiLastTime: UINT32;
  let uiCurTime: UINT32 = GetJA2Clock();
  let pBuffer: Pointer<UINT16> = NULL;
  let DestColor: UINT16;
  let uiPitch: UINT32;
  let i: UINT16;
  let j: UINT16;
  /* static */ let ubPixelationAmount: UINT8 = 255;
  let fReturnStatus: BOOLEAN = FALSE;
  i = 0;

  pBuffer = LockVideoSurface(FRAME_BUFFER, addressof(uiPitch));
  Assert(pBuffer);

  if (ubPixelationAmount == 255) {
    if (fUp)
      ubPixelationAmount = 1;
    else
      ubPixelationAmount = 4;
    uiLastTime = GetJA2Clock();
  }

  // is it time to change the animation
  if ((uiCurTime - uiLastTime) > 100) {
    // if we are starting to pixelate the image
    if (fUp) {
      // the varying degrees of pixelation
      if (ubPixelationAmount <= 4) {
        ubPixelationAmount++;
        fReturnStatus = FALSE;
      } else {
        ubPixelationAmount = 255;
        fReturnStatus = TRUE;
      }
    }
    // else we are pixelating down
    else {
      if (ubPixelationAmount > 1) {
        ubPixelationAmount--;
        fReturnStatus = FALSE;
      } else {
        ubPixelationAmount = 255;
        fReturnStatus = TRUE;
      }
    }
    uiLastTime = GetJA2Clock();
  } else
    i = i;

  uiPitch /= 2;
  i = j = 0;
  DestColor = pBuffer[(j * uiPitch) + i];

  for (j = usPosY; j < usPosY + usHeight; j++) {
    for (i = usPosX; i < usPosX + usWidth; i++) {
      // get the next color
      if (!(i % ubPixelationAmount)) {
        if (i < usPosX + usWidth - ubPixelationAmount)
          DestColor = pBuffer[(j * uiPitch) + i + ubPixelationAmount / 2];
        else
          DestColor = pBuffer[(j * uiPitch) + i];
      }

      pBuffer[(j * uiPitch) + i] = DestColor;
    }
  }

  UnLockVideoSurface(FRAME_BUFFER);

  return fReturnStatus;
}

function DistortVideoMercImage(usPosX: UINT16, usPosY: UINT16, usWidth: UINT16, usHeight: UINT16): BOOLEAN {
  let uiPitch: UINT32;
  let i: UINT16;
  let j: UINT16;
  let pBuffer: Pointer<UINT16> = NULL;
  let DestColor: UINT16;
  let uiColor: UINT32;
  let red: UINT8;
  let green: UINT8;
  let blue: UINT8;
  /* static */ let usDistortionValue: UINT16 = 255;
  let uiReturnValue: UINT8;
  let usEndOnLine: UINT16 = 0;

  pBuffer = LockVideoSurface(FRAME_BUFFER, addressof(uiPitch));
  Assert(pBuffer);

  uiPitch /= 2;
  j = MERC_VIDEO_FACE_Y;
  i = MERC_VIDEO_FACE_X;

  DestColor = pBuffer[(j * uiPitch) + i];

  if (usDistortionValue >= usPosY + usHeight) {
    usDistortionValue = 0;
    uiReturnValue = TRUE;
  } else {
    usDistortionValue++;

    uiReturnValue = FALSE;

    if (usDistortionValue + 10 >= usHeight)
      usEndOnLine = usHeight - 1;
    else
      usEndOnLine = usDistortionValue + 10;

    for (j = usPosY + usDistortionValue; j < usPosY + usEndOnLine; j++) {
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

function InitDestroyXToCloseVideoWindow(fCreate: BOOLEAN): BOOLEAN {
  /* static */ let fButtonCreated: BOOLEAN = FALSE;

  // if we are asked to create the buttons and the button isnt already created
  if (fCreate && !fButtonCreated) {
    guiXToCloseMercVideoButtonImage = LoadButtonImage("LAPTOP\\CloseButton.sti", -1, 0, -1, 1, -1);

    guiXToCloseMercVideoButton = QuickCreateButton(guiXToCloseMercVideoButtonImage, MERC_X_TO_CLOSE_VIDEO_X, MERC_X_TO_CLOSE_VIDEO_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnXToCloseMercVideoButtonCallback);
    SetButtonCursor(guiXToCloseMercVideoButton, Enum317.CURSOR_LAPTOP_SCREEN);

    fButtonCreated = TRUE;
  }

  // if we are asked to destroy the buttons and the buttons are created
  if (!fCreate && fButtonCreated) {
    UnloadButtonImage(guiXToCloseMercVideoButtonImage);
    RemoveButton(guiXToCloseMercVideoButton);
    fButtonCreated = FALSE;
  }

  return TRUE;
}

function BtnXToCloseMercVideoButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      // Stop speck from talking
      //			ShutupaYoFace( giVideoSpeckFaceIndex );
      StopSpeckFromTalking();

      // make sure we are done the intro speech
      gfDoneIntroSpeech = TRUE;

      // remove the video conf mode
      gubCurrentMercVideoMode = Enum103.MERC_VIDEO_EXIT_VIDEO_MODE;

      gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function DisplayMercVideoIntro(usTimeTillFinish: UINT16): BOOLEAN {
  let uiCurTime: UINT32 = GetJA2Clock();
  /* static */ let uiLastTime: UINT32 = 0;

  // init variable
  if (uiLastTime == 0)
    uiLastTime = uiCurTime;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, MERC_VIDEO_FACE_X, MERC_VIDEO_FACE_Y, MERC_VIDEO_FACE_X + MERC_VIDEO_FACE_WIDTH, MERC_VIDEO_FACE_Y + MERC_VIDEO_FACE_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

  // if the intro is done
  if ((uiCurTime - uiLastTime) > usTimeTillFinish) {
    uiLastTime = 0;
    return TRUE;
  } else
    return FALSE;
}

function HandleTalkingSpeck(): void {
  let fIsSpeckTalking: BOOLEAN = TRUE;

  switch (gubCurrentMercVideoMode) {
    // Init the video conferencing
    case Enum103.MERC_VIDEO_INIT_VIDEO_MODE:
      // perform some opening animation.  When its done start Speck talking

      // if the intro is finished
      if (DisplayMercVideoIntro(MERC_INTRO_TIME)) {
        // NULL out the string
        gsSpeckDialogueTextPopUp[0] = '\0';

        // Start speck talking
        if (gusMercVideoSpeckSpeech != MERC_VIDEO_SPECK_SPEECH_NOT_TALKING || gusMercVideoSpeckSpeech != MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET)
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
        gfFirstTimeIntoMERCSiteSinceEnteringLaptop = FALSE;
        GetSpeckConditionalOpening(FALSE);
        gfJustEnteredMercSite = FALSE;
      } else {
        fIsSpeckTalking = HandleSpeckTalking(FALSE);

        if (!fIsSpeckTalking)
          fIsSpeckTalking = GetSpeckConditionalOpening(FALSE);

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
            ButtonList[guiAccountBoxButton].value.uiFlags |= BUTTON_FORCE_UNDIRTY;

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
        InitDestroyXToCloseVideoWindow(FALSE);

        gfRedrawMercSite = TRUE;
        gfMercVideoIsBeingDisplayed = FALSE;

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

function DisplayTextForSpeckVideoPopUp(pString: STR16): void {
  let usActualHeight: UINT16;
  let iOldMercPopUpBoxId: INT32 = iMercPopUpBox;

  // If the user has selected no subtitles
  if (!gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES])
    return;

//	wcscpy(gsSpeckDialogueTextPopUp, pString);
// add the "" around the speech.
  swprintf(gsSpeckDialogueTextPopUp, "\"%s\"", pString);

  gfDisplaySpeckTextBox = TRUE;

  // Set this so the popup box doesnt render in RenderMercs()
  iMercPopUpBox = -1;

  // Render the screen to get rid of any old text popup boxes
  RenderMercs();

  iMercPopUpBox = iOldMercPopUpBoxId;

  if (gfMercVideoIsBeingDisplayed && gfMercSiteScreenIsReDrawn) {
    DrawMercVideoBackGround();
  }

  // Create the popup box
  SET_USE_WINFONTS(TRUE);
  SET_WINFONT(giSubTitleWinFont);
  iMercPopUpBox = PrepareMercPopupBox(iMercPopUpBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, gsSpeckDialogueTextPopUp, 300, 0, 0, 0, addressof(gusSpeckDialogueActualWidth), addressof(usActualHeight));
  SET_USE_WINFONTS(FALSE);

  gusSpeckDialogueX = (LAPTOP_SCREEN_LR_X - gusSpeckDialogueActualWidth - LAPTOP_SCREEN_UL_X) / 2 + LAPTOP_SCREEN_UL_X;

  // Render the pop box
  RenderMercPopUpBoxFromIndex(iMercPopUpBox, gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, FRAME_BUFFER);

  // check to make sure the region is not already initialized
  if (!(gMercSiteSubTitleMouseRegion.uiFlags & MSYS_REGION_EXISTS)) {
    MSYS_DefineRegion(addressof(gMercSiteSubTitleMouseRegion), gusSpeckDialogueX, MERC_TEXT_BOX_POS_Y, (gusSpeckDialogueX + gusSpeckDialogueActualWidth), (MERC_TEXT_BOX_POS_Y + usActualHeight), MSYS_PRIORITY_HIGH, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, MercSiteSubTitleRegionCallBack);
    MSYS_AddRegion(addressof(gMercSiteSubTitleMouseRegion));
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

function GetSpeckConditionalOpening(fJustEnteredScreen: BOOLEAN): BOOLEAN {
  /* static */ let usQuoteToSay: UINT16 = MERC_VIDEO_SPECK_SPEECH_NOT_TALKING;
  let ubRandom: UINT8 = 0;
  let ubCnt: UINT8;
  let fCanSayLackOfPaymentQuote: BOOLEAN = TRUE;
  let fCanUseIdleTag: BOOLEAN = FALSE;

  // If we just entered the screen, reset some variables
  if (fJustEnteredScreen) {
    gfDoneIntroSpeech = FALSE;
    usQuoteToSay = 0;
    return FALSE;
  }

  // if we are done the intro speech, or arrived from a sub page, get out of the function
  if (gfDoneIntroSpeech || gubArrivedFromMercSubSite != Enum105.MERC_CAME_FROM_OTHER_PAGE) {
    return FALSE;
  }

  gfDoneIntroSpeech = TRUE;

  // set the opening quote based on if the player has been here before
  if (LaptopSaveInfo.ubPlayerBeenToMercSiteStatus == Enum102.MERC_SITE_FIRST_VISIT && usQuoteToSay <= 8) //!= 0 )
  {
    StartSpeckTalking(usQuoteToSay);
    usQuoteToSay++;
    if (usQuoteToSay <= 8)
      gfDoneIntroSpeech = FALSE;
  }

  // if its the players second visit
  else if (LaptopSaveInfo.ubPlayerBeenToMercSiteStatus == Enum102.MERC_SITE_SECOND_VISIT) {
    StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_1_TOUGH_START);
    fCanUseIdleTag = TRUE;
  }

  // We have been here at least 2 times before, Check which quote we should use
  else {
    // if the player has not hired any MERC mercs before
    // CJC Dec 1 2002: fixing this, so near-bankrupt msg will play
    if (!IsAnyMercMercsHired() && CalcMercDaysServed() == 0) {
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_2_BUSINESS_BAD);
    }

    // else if it is the first visit since the server went down
    else if (LaptopSaveInfo.fFirstVisitSinceServerWentDown == TRUE) {
      LaptopSaveInfo.fFirstVisitSinceServerWentDown = 2;
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_9_FIRST_VISIT_SINCE_SERVER_WENT_DOWN);
      fCanUseIdleTag = TRUE;
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

      fCanSayLackOfPaymentQuote = FALSE;
    }

    // else if the player owes speck a large sum of money, have speck say so
    else if (CalculateHowMuchPlayerOwesSpeck() > 5000) {
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_6_PLAYER_OWES_SPECK_ALMOST_BANKRUPT_1);
      StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_6_PLAYER_OWES_SPECK_ALMOST_BANKRUPT_2);

      fCanSayLackOfPaymentQuote = FALSE;
    }

    else {
      let ubNumMercsDead: UINT8 = NumberOfMercMercsDead();
      let ubRandom: UINT8 = Random(100);

      // if business is good
      //			if( ubRandom < 40 && ubNumMercsDead < 2 && CountNumberOfMercMercsHired() > 1 )
      if (ubRandom < 40 && AreAnyOfTheNewMercsAvailable() && CountNumberOfMercMercsHired() > 1) {
        StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_3_BUSINESS_GOOD);
        fCanUseIdleTag = TRUE;
      }

      // or if still trying to recruit ( the last recruit hasnt arrived and the player has paid for some of his mercs )
      //			else if( ubRandom < 80 && LaptopSaveInfo.gbNumDaysTillFourthMercArrives != -1 && LaptopSaveInfo.gbNumDaysTillFirstMercArrives < MERC_NUM_DAYS_TILL_FIRST_MERC_AVAILABLE )
      else if (ubRandom < 80 && gConditionsForMercAvailability[LaptopSaveInfo.ubLastMercAvailableId].usMoneyPaid <= LaptopSaveInfo.uiTotalMoneyPaidToSpeck && CanMercBeAvailableYet(LaptopSaveInfo.ubLastMercAvailableId)) {
        StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_4_TRYING_TO_RECRUIT);
        fCanUseIdleTag = TRUE;
      }

      // else use the generic opening
      else {
        StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_10_GENERIC_OPENING);
        fCanUseIdleTag = TRUE;

        // if the  merc hasnt said the line before
        if (!LaptopSaveInfo.fSaidGenericOpeningInMercSite) {
          LaptopSaveInfo.fSaidGenericOpeningInMercSite = TRUE;
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
    LaptopSaveInfo.fNewMercsAvailableAtMercSite = FALSE;

    StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_11_NEW_MERCS_AVAILABLE);
  }

  // if any mercs are dead
  if (IsAnyMercMercsDead()) {
    // if no merc has died before
    if (!LaptopSaveInfo.fHasAMercDiedAtMercSite) {
      LaptopSaveInfo.fHasAMercDiedAtMercSite = TRUE;
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
      LaptopSaveInfo.fSpeckSaidFloMarriedCousinQuote = TRUE;

      MakeBiffAwayForCoupleOfDays();
    }
  }

  // if larry has relapsed
  if (HasLarryRelapsed() && !(LaptopSaveInfo.uiSpeckQuoteFlags & SPECK_QUOTE__ALREADY_TOLD_PLAYER_THAT_LARRY_RELAPSED)) {
    LaptopSaveInfo.uiSpeckQuoteFlags |= SPECK_QUOTE__ALREADY_TOLD_PLAYER_THAT_LARRY_RELAPSED;

    StartSpeckTalking(Enum111.SPECK_QUOTE_ALTERNATE_OPENING_TAG_LARRY_RELAPSED);
  }

  return TRUE;
}

function IsAnyMercMercsHired(): BOOLEAN {
  let ubMercID: UINT8;
  let i: UINT8;

  // loop through all of the hired mercs from M.E.R.C.
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    ubMercID = GetMercIDFromMERCArray(i);
    if (IsMercOnTeam(ubMercID)) {
      return TRUE;
    }
  }

  return FALSE;
}

function IsAnyMercMercsDead(): BOOLEAN {
  let i: UINT8;

  // loop through all of the hired mercs from M.E.R.C.
  for (i = 0; i < NUMBER_OF_MERCS; i++) {
    if (gMercProfiles[i + Enum268.BIFF].bMercStatus == MERC_IS_DEAD)
      return TRUE;
  }

  return FALSE;
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
function MercSiteSubTitleRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP || iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    StopSpeckFromTalking();
  }
}

function RemoveSpeckPopupTextBox(): void {
  if (iMercPopUpBox == -1)
    return;

  if (gMercSiteSubTitleMouseRegion.uiFlags & MSYS_REGION_EXISTS)
    MSYS_RemoveRegion(addressof(gMercSiteSubTitleMouseRegion));

  if (RemoveMercPopupBoxFromIndex(iMercPopUpBox)) {
    iMercPopUpBox = -1;
  }

  // redraw the screen
  gfRedrawMercSite = TRUE;
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

function IsMercMercAvailable(ubMercID: UINT8): BOOLEAN {
  let cnt: UINT8;

  // loop through the array of mercs
  for (cnt = 0; cnt < LaptopSaveInfo.gubLastMercIndex; cnt++) {
    // if this is the merc
    if (GetMercIDFromMERCArray(cnt) == ubMercID) {
      // if the merc is available, and Not dead
      //			if( gMercProfiles[ ubMercID ].bMercStatus == 0 && !IsMercDead( ubMercID ) )
      if (IsMercHireable(ubMercID))
        return TRUE;
    }
  }

  return FALSE;
}

function ShouldSpeckStartTalkingDueToActionOnSubPage(): BOOLEAN {
  // if the merc came from the hire screen
  if (gfJustHiredAMercMerc) {
    HandlePlayerHiringMerc(GetMercIDFromMERCArray(gubCurMercIndex));

    // get speck to say the thank you
    if (Random(100) > 50)
      StartSpeckTalking(Enum111.SPECK_QUOTE_GENERIC_THANKS_FOR_HIRING_MERCS_1);
    else
      StartSpeckTalking(Enum111.SPECK_QUOTE_GENERIC_THANKS_FOR_HIRING_MERCS_2);

    gfJustHiredAMercMerc = FALSE;
    //				gfDoneIntroSpeech = TRUE;

    return TRUE;
  }

  return FALSE;
}

function ShouldSpeckSayAQuote(): BOOLEAN {
  // if we are entering from anywhere except a sub page, and we should say the opening quote
  if (gfJustEnteredMercSite && gubArrivedFromMercSubSite == Enum105.MERC_CAME_FROM_OTHER_PAGE) {
    // if the merc has something to say
    if (gusMercVideoSpeckSpeech != MERC_VIDEO_SPECK_SPEECH_NOT_TALKING)
      return FALSE;
  }

  // if the player just hired a merc
  if (gfJustHiredAMercMerc) {
    gusMercVideoSpeckSpeech = MERC_VIDEO_SPECK_HAS_TO_TALK_BUT_QUOTE_NOT_CHOSEN_YET;
    return TRUE;

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
    return TRUE;
  }

  /*
          //if we are entering from anywhere except a sub page
          if( gubArrivedFromMercSubSite == MERC_CAME_FROM_OTHER_PAGE )
          {
                  GetSpeckConditionalOpening( FALSE );
                  return( TRUE );
          }
  */
  return FALSE;
}

function HandleSpeckIdleConversation(fReset: BOOLEAN): void {
  /* static */ let uiLastTime: UINT32 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();
  let sLeastSaidQuote: INT16;

  // if we should reset the variables
  if (fReset) {
    uiLastTime = GetJA2Clock();
    return;
  }

  if ((uiCurTime - uiLastTime) > SPECK_IDLE_CHAT_DELAY) {
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

    uiLastTime = GetJA2Clock();
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

function HasLarryRelapsed(): BOOLEAN {
  return CheckFact(Enum170.FACT_LARRY_CHANGED, 0);
}

// Gets Called on each enter into laptop.
function EnterInitMercSite(): void {
  gfFirstTimeIntoMERCSiteSinceEnteringLaptop = TRUE;
  gubCurMercIndex = 0;
}

function ShouldTheMercSiteServerGoDown(): BOOLEAN {
  let uiDay: UINT32 = GetWorldDay();

  // If the merc site has never gone down, the first new merc has shown ( which shows the player is using the site ),
  // and the players account status is ok ( cant have the merc site going down when the player owes him money, player may lose account that way )
  //	if( !LaptopSaveInfo.fMercSiteHasGoneDownYet  && LaptopSaveInfo.gbNumDaysTillThirdMercArrives <= 6 && LaptopSaveInfo.gubPlayersMercAccountStatus == MERC_ACCOUNT_VALID )
  if (!LaptopSaveInfo.fMercSiteHasGoneDownYet && LaptopSaveInfo.ubLastMercAvailableId >= 1 && LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_ACCOUNT_VALID) {
    if (Random(100) < (uiDay * 2 + 10)) {
      return TRUE;
    } else {
      return FALSE;
    }
  }

  return FALSE;
}

function GetMercSiteBackOnline(): void {
  // Add an email telling the user the site is back up
  AddEmail(MERC_NEW_SITE_ADDRESS, MERC_NEW_SITE_ADDRESS_LENGTH, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());

  // Set a flag indicating that the server just went up ( so speck can make a comment when the player next visits the site )
  LaptopSaveInfo.fFirstVisitSinceServerWentDown = TRUE;
}

function DrawMercVideoBackGround(): void {
  let hPixHandle: HVOBJECT;

  GetVideoObject(addressof(hPixHandle), guiMercVideoPopupBackground);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_VIDEO_BACKGROUND_X, MERC_VIDEO_BACKGROUND_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // put the title on the window
  DrawTextToScreen(MercHomePageText[Enum343.MERC_SPECK_COM], MERC_X_VIDEO_TITLE_X, MERC_X_VIDEO_TITLE_Y, 0, MERC_VIDEO_TITLE_FONT(), MERC_VIDEO_TITLE_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  InvalidateRegion(MERC_VIDEO_BACKGROUND_X, MERC_VIDEO_BACKGROUND_Y, (MERC_VIDEO_BACKGROUND_X + MERC_VIDEO_BACKGROUND_WIDTH), (MERC_VIDEO_BACKGROUND_Y + MERC_VIDEO_BACKGROUND_HEIGHT));
}

function DisableMercSiteButton(): void {
  if (iMercPopUpBox != -1) {
    ButtonList[guiAccountBoxButton].value.uiFlags |= BUTTON_FORCE_UNDIRTY;
  }
}

function CanMercQuoteBeSaid(uiQuoteID: UINT32): BOOLEAN {
  let fRetVal: BOOLEAN = TRUE;

  // switch onb the quote being said, if hes plugging a merc that has already been hired, dont say it
  switch (uiQuoteID) {
    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_BIFF:
      if (!IsMercMercAvailable(Enum268.BIFF))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_HAYWIRE:
      if (!IsMercMercAvailable(Enum268.HAYWIRE))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_GASKET:
      if (!IsMercMercAvailable(Enum268.GASKET))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_RAZOR:
      if (!IsMercMercAvailable(Enum268.RAZOR))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_FLO:
      if (!IsMercMercAvailable(Enum268.FLO))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_GUMPY:
      if (!IsMercMercAvailable(Enum268.GUMPY))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_LARRY:
      if (!IsMercMercAvailable(Enum268.LARRY_NORMAL) || IsMercMercAvailable(Enum268.LARRY_DRUNK))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_COUGER:
      if (!IsMercMercAvailable(Enum268.COUGAR))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_NUMB:
      if (!IsMercMercAvailable(Enum268.NUMB))
        fRetVal = FALSE;
      break;

    case Enum111.SPECK_QUOTE_PLAYER_NOT_DOING_ANYTHING_SPECK_SELLS_BUBBA:
      if (!IsMercMercAvailable(Enum268.BUBBA))
        fRetVal = FALSE;
      break;
  }

  return fRetVal;
}

function InitializeNumDaysMercArrive(): void {
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

function AreAnyOfTheNewMercsAvailable(): BOOLEAN {
  let i: UINT8;
  let ubMercID: UINT8;

  if (LaptopSaveInfo.fNewMercsAvailableAtMercSite)
    return FALSE;

  for (i = (Enum268.LARRY_NORMAL - Enum268.BIFF); i <= LaptopSaveInfo.gubLastMercIndex; i++) {
    ubMercID = GetMercIDFromMERCArray(i);

    if (IsMercMercAvailable(ubMercID))
      return TRUE;
  }

  return FALSE;
}

function ShouldAnyNewMercMercBecomeAvailable(): void {
  let fNewMercAreAvailable: BOOLEAN = FALSE;

  // for bubba
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == GUMPY )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_BUBBA)) {
      fNewMercAreAvailable = TRUE;
    }
  }

  // for Larry
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == LARRY_NORMAL ||
  //		GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == LARRY_DRUNK )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_LARRY)) {
      fNewMercAreAvailable = TRUE;
    }
  }

  // for Numb
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == NUMB )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_NUMB)) {
      fNewMercAreAvailable = TRUE;
    }
  }

  // for COUGAR
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == COUGAR )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_COUGAR)) {
      fNewMercAreAvailable = TRUE;
    }
  }

  // if there is a new merc available
  if (fNewMercAreAvailable) {
    // Set up an event to add the merc in x days
    AddStrategicEvent(Enum132.EVENT_MERC_SITE_NEW_MERC_AVAILABLE, GetMidnightOfFutureDayInMinutes(1) + 420 + Random(3 * 60), 0);
  }
}

function CanMercBeAvailableYet(ubMercToCheck: UINT8): BOOLEAN {
  // if the merc is already available
  if (gConditionsForMercAvailability[ubMercToCheck].ubMercArrayID <= LaptopSaveInfo.gubLastMercIndex)
    return FALSE;

  // if the merc is already hired
  if (!IsMercHireable(GetMercIDFromMERCArray(gConditionsForMercAvailability[ubMercToCheck].ubMercArrayID)))
    return FALSE;

  // if player has paid enough money for the merc to be available, and the it is after the current day
  if (gConditionsForMercAvailability[ubMercToCheck].usMoneyPaid <= LaptopSaveInfo.uiTotalMoneyPaidToSpeck && gConditionsForMercAvailability[ubMercToCheck].usDay <= GetWorldDay()) {
    return TRUE;
  }

  return FALSE;
}

function NewMercsAvailableAtMercSiteCallBack(): void {
  let fSendEmail: BOOLEAN = FALSE;
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == BUBBA )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_BUBBA)) {
      LaptopSaveInfo.gubLastMercIndex++;
      LaptopSaveInfo.ubLastMercAvailableId = Enum100.MERC_ARRIVES_BUBBA;
      fSendEmail = TRUE;
    }
  }

  // for Larry
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == LARRY_NORMAL ||
  //			GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == LARRY_DRUNK )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_LARRY)) {
      LaptopSaveInfo.gubLastMercIndex++;
      LaptopSaveInfo.ubLastMercAvailableId = Enum100.MERC_ARRIVES_LARRY;
      fSendEmail = TRUE;
    }
  }

  // for Numb
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == NUMB )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_NUMB)) {
      LaptopSaveInfo.gubLastMercIndex = 9;
      LaptopSaveInfo.ubLastMercAvailableId = Enum100.MERC_ARRIVES_NUMB;
      fSendEmail = TRUE;
    }
  }

  // for COUGAR
  //	if( GetMercIDFromMERCArray( LaptopSaveInfo.gubLastMercIndex ) == COUGAR )
  {
    if (CanMercBeAvailableYet(Enum100.MERC_ARRIVES_COUGAR)) {
      LaptopSaveInfo.gubLastMercIndex = 10;
      LaptopSaveInfo.ubLastMercAvailableId = Enum100.MERC_ARRIVES_COUGAR;
      fSendEmail = TRUE;
    }
  }

  if (fSendEmail)
    AddEmail(NEW_MERCS_AT_MERC, NEW_MERCS_AT_MERC_LENGTH, Enum75.SPECK_FROM_MERC, GetWorldTotalMin());

  // new mercs are available
  LaptopSaveInfo.fNewMercsAvailableAtMercSite = TRUE;
}

// used for older saves
function CalcAproximateAmountPaidToSpeck(): void {
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
