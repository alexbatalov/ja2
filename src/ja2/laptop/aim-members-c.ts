namespace ja2 {

//
//******  Defines  ******
//

const MERCBIOSFILENAME = "BINARYDATA\\aimbios.edt";

const AIM_M_FONT_PREV_NEXT_CONTACT = () => FONT14ARIAL();
const AIM_M_FONT_PREV_NEXT_CONTACT_COLOR_UP = FONT_MCOLOR_DKWHITE;
const AIM_M_FONT_PREV_NEXT_CONTACT_COLOR_DOWN = 138;
const AIM_M_FONT_STATIC_TEXT = () => FONT12ARIAL();
const AIM_M_COLOR_STATIC_TEXT = 146; // 75
const AIM_M_FONT_DYNAMIC_TEXT = () => FONT10ARIAL();
const AIM_M_COLOR_DYNAMIC_TEXT = FONT_MCOLOR_WHITE;
const AIM_M_WEAPON_TEXT_FONT = () => FONT10ARIAL();
const AIM_M_WEAPON_TEXT_COLOR = FONT_MCOLOR_WHITE;
const AIM_M_NUMBER_FONT = () => FONT12ARIAL();
const AIM_M_NUMBER_COLOR = FONT_MCOLOR_WHITE;
const AIM_M_ACTIVE_MEMBER_TITLE_COLOR = AIM_GREEN;
const AIM_M_FEE_CONTRACT_COLOR = AIM_GREEN;
const AIM_M_VIDEO_TITLE_COLOR = AIM_FONT_GOLD;
const AIM_M_VIDEO_NAME_COLOR = FONT_MCOLOR_BLACK;
const AIM_M_VIDEO_NAME_SHADOWCOLOR = AIM_FONT_GOLD;

const AIM_M_VIDEO_CONTRACT_LENGTH_FONT = () => FONT12ARIAL();
const AIM_M_VIDEO_CONTRACT_LENGTH_COLOR = FONT_MCOLOR_BLACK;

const AIM_M_VIDEO_CONTRACT_AMOUNT_FONT = () => FONT10ARIAL();
const AIM_M_VIDEO_CONTRACT_AMOUNT_COLOR = 183;

const AIM_POPUP_BOX_FONT = () => FONT12ARIAL();
const AIM_POPUP_BOX_COLOR = FONT_MCOLOR_BLACK;

const HIGH_STAT_COLOR = FONT_MCOLOR_WHITE; // FONT_MCOLOR_LTGREEN
const MED_STAT_COLOR = FONT_MCOLOR_DKWHITE; // FONT_MCOLOR_WHITE
const LOW_STAT_COLOR = FONT_MCOLOR_DKWHITE; // FONT_MCOLOR_DKGRAY

const SIZE_MERC_BIO_INFO = 400 * 2;
const SIZE_MERC_ADDITIONAL_INFO = 160 * 2;

const MERC_ANNOYED_WONT_CONTACT_TIME_MINUTES = 6 * 60;
const NUMBER_HATED_MERCS_ONTEAM = 3;

const STATS_X = IMAGE_OFFSET_X + 121;
const STATS_Y = IMAGE_OFFSET_Y + 66; // 69

const PRICE_X = IMAGE_OFFSET_X + 377;
const PRICE_Y = STATS_Y;
const PRICE_WIDTH = 116;

const PORTRAIT_X = IMAGE_OFFSET_X + 8;
const PORTRAIT_Y = STATS_Y;
const PORTRAIT_WIDTH = 110;
const PORTRAIT_HEIGHT = 126;

const FACE_X = PORTRAIT_X + 2;
const FACE_Y = PORTRAIT_Y + 2;
const FACE_WIDTH = 106;
const FACE_HEIGHT = 122;

const WEAPONBOX_X = IMAGE_OFFSET_X + 6;
const WEAPONBOX_Y = IMAGE_OFFSET_Y + 296; // 299
const WEAPONBOX_SIZE_X = 61;
const WEAPONBOX_SIZE_Y = 31;
const WEAPONBOX_NUMBER = 8;

const SPACE_BN_LINES = 15; // 13
const STATS_FIRST_COL = STATS_X + 9;
const STATS_SECOND_COL = STATS_FIRST_COL + 129;
const STATS_FIRST_NUM = STATS_X + 111; // 91
const STATS_SECOND_NUM = STATS_X + 235;

const HEALTH_Y = STATS_Y + 34;
const AGILITY_Y = HEALTH_Y + SPACE_BN_LINES;
const DEXTERITY_Y = AGILITY_Y + SPACE_BN_LINES;
const STRENGTH_Y = DEXTERITY_Y + SPACE_BN_LINES;
const LEADERSHIP_Y = STRENGTH_Y + SPACE_BN_LINES;
const WISDOM_Y = LEADERSHIP_Y + SPACE_BN_LINES;

const EXPLEVEL_Y = HEALTH_Y;
const MARKSMAN_Y = AGILITY_Y;
const MECHANAICAL_Y = DEXTERITY_Y;
const EXPLOSIVE_Y = STRENGTH_Y;
const MEDICAL_Y = LEADERSHIP_Y;

const NAME_X = STATS_FIRST_COL;
const NAME_Y = STATS_Y + 7;

const FEE_X = PRICE_X + 7;
const FEE_Y = NAME_Y;
const FEE_WIDTH = 37; // 33

const AIM_CONTRACT_X = PRICE_X + 51;
const AIM_CONTRACT_Y = FEE_Y;
const AIM_CONTRACT_WIDTH = 59;

const ONEDAY_X = AIM_CONTRACT_X;
const ONEWEEK_X = AIM_CONTRACT_X;
const TWOWEEK_X = AIM_CONTRACT_X;

const PREVIOUS_X = 224;
const PREVIOUS_Y = 386 + LAPTOP_SCREEN_WEB_DELTA_Y;
const PREVIOUS_BOX_Y = PREVIOUS_Y - 4;
const PREVIOUS_BR_X = PREVIOUS_X + BOTTOM_BUTTON_START_WIDTH;
const PREVIOUS_BR_Y = PREVIOUS_BOX_Y + BOTTOM_BUTTON_START_HEIGHT;

const CONTACT_X = 331;
const CONTACT_Y = PREVIOUS_Y;
const CONTACT_BOX_Y = CONTACT_Y - 4;
const CONTACT_BOX_WIDTH = 75;
const CONTACT_BOX_HEIGHT = 18;
const CONTACT_BR_X = CONTACT_X + BOTTOM_BUTTON_START_WIDTH;
const CONTACT_BR_Y = CONTACT_BOX_Y + BOTTOM_BUTTON_START_HEIGHT;

const NEXT_X = 431;
const NEXT_Y = PREVIOUS_Y;
const NEXT_BOX_Y = NEXT_Y - 4;
const NEXT_BR_X = NEXT_X + BOTTOM_BUTTON_START_WIDTH;
const NEXT_BR_Y = NEXT_BOX_Y + BOTTOM_BUTTON_START_HEIGHT;

const AIM_MERC_INFO_X = 124;
const AIM_MERC_INFO_Y = 223 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_MERC_ADD_X = AIM_MERC_ADD_INFO_X;
const AIM_MERC_ADD_Y = 269 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_MERC_ADD_INFO_X = AIM_MERC_INFO_X;
const AIM_MERC_ADD_INFO_Y = AIM_MERC_ADD_Y + 15;
const AIM_MERC_INFO_WIDTH = 470;

const AIM_MEDICAL_DEPOSIT_X = PRICE_X + 5;
const AIM_MEDICAL_DEPOSIT_Y = LEADERSHIP_Y;
const AIM_MEDICAL_DEPOSIT_WIDTH = PRICE_WIDTH - 6;

const AIM_MEMBER_ACTIVE_TEXT_X = IMAGE_OFFSET_X + 149;
const AIM_MEMBER_ACTIVE_TEXT_Y = AIM_SYMBOL_Y + AIM_SYMBOL_SIZE_Y - 1; // + 1
const AIM_MEMBER_ACTIVE_TEXT_WIDTH = AIM_SYMBOL_WIDTH;

const AIM_MEMBER_OPTIONAL_GEAR_X = AIM_MERC_INFO_X;
const AIM_MEMBER_OPTIONAL_GEAR_Y = WEAPONBOX_Y - 13;
//#define		AIM_MEMBER_OPTIONAL_GEAR_NUMBER_X		AIM_MEMBER_OPTIONAL_GEAR_X

const AIM_MEMBER_WEAPON_NAME_X = WEAPONBOX_X;
const AIM_MEMBER_WEAPON_NAME_Y = WEAPONBOX_Y + WEAPONBOX_SIZE_Y + 1;
const AIM_MEMBER_WEAPON_NAME_WIDTH = WEAPONBOX_SIZE_X - 2;
/*
#define		AIM_MEMBER_PREVIOUS 0
#define		AIM_MEMBER_CONTACT	1
#define		AIM_MEMBER_NEXT			2
*/

// video Conferencing Info
const AIM_MEMBER_VIDEO_CONF_TERMINAL_X = 125;
const AIM_MEMBER_VIDEO_CONF_TERMINAL_Y = 97 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_MEMBER_VIDEO_CONF_TERMINAL_WIDTH = 368;
const AIM_MEMBER_VIDEO_CONF_TERMINAL_HEIGHT = 150;

const AIM_MEMBER_VIDEO_TITLE_BAR_WIDTH = 368;
const AIM_MEMBER_VIDEO_TITLE_BAR_HEIGHT = 21;
const AIM_MEMBER_VIDEO_TITLE_ITERATIONS = 18;
const AIM_MEMBER_VIDEO_TITLE_START_Y = 382 + LAPTOP_SCREEN_WEB_DELTA_Y;
const AIM_MEMBER_VIDEO_TITLE_END_Y = 96;
const AIM_MEMBER_VIDEO_TITLE_START_X = 330;
const AIM_MEMBER_VIDEO_TITLE_END_X = 125;

const AIM_MEMBER_VIDEO_CONF_TERMINAL_RIGHT = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + AIM_MEMBER_VIDEO_CONF_TERMINAL_WIDTH;
const AIM_MEMBER_VIDEO_CONF_TERMINAL_BOTTOM = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + AIM_MEMBER_VIDEO_CONF_TERMINAL_HEIGHT;

const AIM_MEMBER_VIDEO_CONF_CONTRACT_IMAGE_X = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + 6;
const AIM_MEMBER_VIDEO_CONF_CONTRACT_IMAGE_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + 130;

const AIM_MEMBER_VIDEO_CONF_XCLOSE_X = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + 348;
const AIM_MEMBER_VIDEO_CONF_XCLOSE_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + 3;

const AIM_MEMBER_VIDEO_CONF_TITLE_BAR_HEIGHT_Y = 20;

const AIM_MEMBER_BUY_CONTRACT_LENGTH_X = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + 113;
const AIM_MEMBER_BUY_CONTRACT_LENGTH_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + AIM_MEMBER_VIDEO_CONF_TITLE_BAR_HEIGHT_Y + 15;

const AIM_MEMBER_BUY_EQUIPMENT_GAP = 23;

const AIM_MEMBER_BUY_EQUIPMENT_X = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + 235;

const AIM_MEMBER_AUTHORIZE_PAY_X = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + 113;
const AIM_MEMBER_AUTHORIZE_PAY_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + AIM_MEMBER_VIDEO_CONF_TITLE_BAR_HEIGHT_Y + 92;
const AIM_MEMBER_AUTHORIZE_PAY_WIDTH = 116;
const AIM_MEMBER_AUTHORIZE_PAY_GAP = 122;

const AIM_MEMBER_VIDEO_FACE_X = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + 7 + 1;
const AIM_MEMBER_VIDEO_FACE_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + AIM_MEMBER_VIDEO_CONF_TITLE_BAR_HEIGHT_Y + 6 + 1;

const AIM_MEMBER_VIDEO_FACE_WIDTH = 96;
const AIM_MEMBER_VIDEO_FACE_HEIGHT = 86;

const AIM_MEMBER_VIDEO_NAME_X = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + 7;
const AIM_MEMBER_VIDEO_NAME_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + 5;

const AIM_CONTRACT_CHARGE_X = AIM_MEMBER_VIDEO_NAME_X;
const AIM_CONTRACT_CHARGE_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + AIM_MEMBER_VIDEO_CONF_TITLE_BAR_HEIGHT_Y + 98;

const AIM_CONTRACT_LENGTH_ONE_DAY = 0;
const AIM_CONTRACT_LENGTH_ONE_WEEK = 1;
const AIM_CONTRACT_LENGTH_TWO_WEEKS = 2;

const AIM_SELECT_LIGHT_ON_X = 105;
const AIM_SELECT_LIGHT_ON_Y = 8;

const AIM_SELECT_LIGHT_OFF_X = 105;
const AIM_SELECT_LIGHT_OFF_Y = 7;

const AIM_CONTRACT_CHARGE_AMOUNNT_X = AIM_MEMBER_VIDEO_CONF_TERMINAL_X + 7; // 8
const AIM_CONTRACT_CHARGE_AMOUNNT_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + AIM_MEMBER_VIDEO_CONF_TITLE_BAR_HEIGHT_Y + 111; // 114
const AIM_CONTRACT_CHARGE_AMOUNNT_WIDTH = 98;
const AIM_CONTRACT_CHARGE_AMOUNNT_HEIGHT = 12;

const AIM_POPUP_BOX_X = 260;
const AIM_POPUP_BOX_Y = 140 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_POPUP_BOX_WIDTH = 162;
const AIM_POPUP_BOX_HEIGHT = 100;
const AIM_POPUP_BOX_STRING1_Y = 6;
const AIM_POPUP_BOX_BUTTON_OFFSET_X = 20;
const AIM_POPUP_BOX_BUTTON_OFFSET_Y = 62;
const AIM_POPUP_BOX_SUCCESS = 0;
const AIM_POPUP_BOX_FAILURE = 1;

const AIM_MEMBER_HANG_UP_X = 290;
const AIM_MEMBER_HANG_UP_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + AIM_MEMBER_VIDEO_CONF_TITLE_BAR_HEIGHT_Y + 42;

const AIM_MEMBER_VIDEO_TALKING_TEXT_X = AIM_MEMBER_AUTHORIZE_PAY_X;
const AIM_MEMBER_VIDEO_TALKING_TEXT_Y = AIM_MEMBER_VIDEO_CONF_TERMINAL_Y + AIM_MEMBER_VIDEO_CONF_TITLE_BAR_HEIGHT_Y + 30;
const AIM_MEMBER_VIDEO_TALKING_TEXT_WIDTH = 240;

const VC_CONTACT_STATIC_TIME = 30;
const VC_CONTACT_FUZZY_LINE_TIME = 100;
const VC_NUM_LINES_SNOW = 6;
const VC_NUM_FUZZ_LINES = 10;
const VC_NUM_STRAIGHT_LINES = 9;

const VC_ANSWER_IMAGE_DELAY = 100;

const QUOTE_FIRST_ATTITUDE_TIME = 3000;
const QUOTE_ATTITUDE_TIME = 10000;

const QUOTE_DELAY_SMALL_TALK = 1;
const QUOTE_DELAY_IMPATIENT_TALK = 2;
const QUOTE_DELAY_VERY_IMPATIENT_TALK = 3;
const QUOTE_DELAY_HANGUP_TALK = 4;
const QUOTE_DELAY_NO_ACTION = 5;
const QUOTE_MERC_BUSY = 6;

const TEXT_POPUP_WINDOW_X = 180;
const TEXT_POPUP_WINDOW_Y = 255 + LAPTOP_SCREEN_WEB_DELTA_Y;
const TEXT_POPUP_STRING_SIZE = 512;

const FIRST_COLUMN_DOT = 328; // 308
const SECOND_COLUMN_DOT = 451;

const MINIMUM_TALKING_TIME_FOR_MERC = 1500;

const AIM_TEXT_SPEECH_MODIFIER = 80;

const AIM_WEAPONBOX_NAME_WIDTH = 93;

// enumerated types used for the Video Conferencing Display
const enum Enum65 {
  AIM_VIDEO_NOT_DISPLAYED_MODE, // The video popup is not displayed
  AIM_VIDEO_POPUP_MODE, // The title bar pops up out of the Contact button
  AIM_VIDEO_INIT_MODE, // When the player first tries to contact the merc, it will be snowy for a bit
  AIM_VIDEO_FIRST_CONTACT_MERC_MODE, // The popup that is displayed when first contactinf the merc
  AIM_VIDEO_HIRE_MERC_MODE, // The popup which deals with the contract length, and transfer funds
  AIM_VIDEO_MERC_ANSWERING_MACHINE_MODE, // The popup which will be instread of the AIM_VIDEO_FIRST_CONTACT_MERC_MODE if the merc is not there
  AIM_VIDEO_MERC_UNAVAILABLE_MODE, // The popup which will be instread of the AIM_VIDEO_FIRST_CONTACT_MERC_MODE if the merc is unavailable
  AIM_VIDEO_POPDOWN_MODE, // The title bars pops down to the contact button
}

// Enumerated types used for the Pop Up Box
const enum Enum66 {
  AIM_POPUP_NOTHING,
  AIM_POPUP_CREATE,
  AIM_POPUP_DISPLAY,
  AIM_POPUP_DELETE,
}

// Enumerated Types used for the different types of video distortion applied to the video face
const enum Enum67 {
  VC_NO_STATIC,
  VC_FUZZY_LINE,
  VC_STRAIGHTLINE,
  VC_STATIC_IMAGE,
  VC_BW_SNOW,
  VC_PIXELATE,
  VC_TRANS_SNOW_IN, // fade from clear to snowy
  VC_TRANS_SNOW_OUT, // fade from snowy to clear
}

// Image Identifiers
let guiStats: UINT32;
let guiPrice: UINT32;
let guiPortrait: UINT32;
let guiWeaponBox: UINT32;
let guiFace: UINT32;
// UINT32		guiVideoFace;
// UINT32		guiContactButton;
let guiVideoConfPopup: UINT32;
let guiVideoConfTerminal: UINT32;
let guiPopUpBox: UINT32;
let guiVideoFaceBackground: UINT32;
let guiBWSnow: UINT32;
let guiFuzzLine: UINT32;
let guiStraightLine: UINT32;
let guiTransSnow: UINT32;
let guiVideoContractCharge: UINT32;
// UINT32		guiAnsweringMachineImage;
let guiVideoTitleBar: UINT32;
let iAimMembersBoxId: INT32 = -1;

let gbCurrentSoldier: UINT8 = 0;
export let gbCurrentIndex: UINT8 = 0;

export let gubVideoConferencingMode: UINT8;
let gubVideoConferencingPreviousMode: UINT8;
let gfJustSwitchedVideoConferenceMode: boolean;

let gfMercIsTalking: boolean = false;
let gfVideoFaceActive: boolean = false;

let gubPopUpBoxAction: UINT8 = Enum66.AIM_POPUP_NOTHING;
let gfRedrawScreen: boolean = false;
export let gubContractLength: UINT8;
let gfBuyEquipment: boolean;
let giContractAmount: INT32 = 0;
let giMercFaceIndex: INT32;
let gsTalkingMercText: wchar_t[] /* [TEXT_POPUP_STRING_SIZE] */;
let guiTimeThatMercStartedTalking: UINT32;
let guiLastHandleMercTime: UINT32;
let gfFirstTimeInContactScreen: boolean;

let gubCurrentCount: UINT8;
let gubCurrentStaticMode: UINT8;
let guiMercAttitudeTime: UINT32; // retains the amount of time the user is in a screen, if over a certain time, the merc gets miffed
let gubMercAttitudeLevel: UINT8; // retains the current level the merc is  P.O.'ed at the caller.
let gfHangUpMerc: boolean; // if we have to cancel the video conferencing after the merc is finsihed talking
let gfIsShutUpMouseRegionActive: boolean;
let gfIsAnsweringMachineActive: boolean;
let gfRenderTopLevel: boolean;
let gfStopMercFromTalking: boolean;

let usAimMercSpeechDuration: UINT16 = 0;

let gfIsNewMailFlagSet: boolean = false;

let gfWaitingForMercToStopTalkingOrUserToClick: boolean = false;

let giIdOfLastHiredMerc: INT32 = -1;

let gfAimMemberDisplayFaceHelpText: boolean = false;

let gfAimMemberCanMercSayOpeningQuote: boolean = true;

////////////////////////////////////////////////////////////////
//
//	Mouse and Buttons
//
////////////////////////////////////////////////////////////////

// Graphic for following
let guiPreviousContactNextButtonImage: INT32;
let giPreviousButton: INT32;

let giContactButton: INT32;

let giNextButton: INT32;

// Video conference buttons
let guiVideoConferenceButtonImage: INT32[] /* [3] */;

let giContractLengthButton: INT32[] /* [3] */;

let giBuyEquipmentButton: INT32[] /* [2] */;

let giAuthorizeButton: INT32[] /* [2] */;

let giHangUpButton: INT32;

let guiPopUpOkButton: UINT32;
let guiPopUpImage: INT32;

let giFirstContactButton: INT32[] /* [2] */;

let giAnsweringMachineButton: INT32[] /* [2] */;

// X to Close the video conference Button
let giXToCloseVideoConfButtonImage: INT32;
let giXToCloseVideoConfButton: INT32;

// Mouse Regions
// Clicking on guys Face
let gSelectedFaceRegion: MOUSE_REGION;

// Clicking To shut merc up
let gSelectedShutUpMercRegion: MOUSE_REGION;

//*******************************************
//
//	Function Prototypes
//
//*******************************************

// BOOLEAN DisplayAnimatedAnsweringMachineMsg( BOOLEAN fInit, UINT8 ubNumSubImages);
// BOOLEAN HandleAnsweringMachineMessage();

// ppp

//*******************************************
//
//	FUNCTIONS
//
//*******************************************

export function GameInitAIMMembers(): void {
}

export function EnterInitAimMembers(): void {
  gubVideoConferencingMode = Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE;
  gubVideoConferencingPreviousMode = Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE;
  gfVideoFaceActive = false;
  // fShouldMercTalk = FALSE;
  gubPopUpBoxAction = Enum66.AIM_POPUP_NOTHING;
  gfRedrawScreen = false;
  giContractAmount = 0;
  giMercFaceIndex = 0;
  guiLastHandleMercTime = GetJA2Clock();
  gubCurrentCount = 0;
  gfFirstTimeInContactScreen = true;

  // reset the variable so a pop up can be displyed this time in laptop
  LaptopSaveInfo.sLastHiredMerc.fHaveDisplayedPopUpInLaptop = false;

  // reset the id of the last merc
  LaptopSaveInfo.sLastHiredMerc.iIdOfMerc = -1;
}

export function EnterAIMMembers(): boolean {
  let VObjectDesc: VOBJECT_DESC;
  let vs_desc: VSURFACE_DESC;

  // Create a background video surface to blt the face onto
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = AIM_MEMBER_VIDEO_FACE_WIDTH;
  vs_desc.usHeight = AIM_MEMBER_VIDEO_FACE_HEIGHT;
  vs_desc.ubBitDepth = 16;
  CHECKF(AddVideoSurface(addressof(vs_desc), addressof(guiVideoFaceBackground)));

  // load the stats graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\stats.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiStats)));

  // load the Price graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\price.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiPrice)));

  // load the Portait graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\portrait.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiPortrait)));

  // load the WeaponBox graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\weaponbox.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiWeaponBox)));

  // load the videoconf Popup graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\VideoConfPopup.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiVideoConfPopup)));

  // load the video conf terminal graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\VideoConfTerminal.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiVideoConfTerminal)));

  // load the background snow for the video conf terminal
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BWSnow.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBWSnow)));

  // load the fuzzy line for the video conf terminal
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\FuzzLine.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFuzzLine)));

  // load the line distortion for the video conf terminal
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\LineInterference.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiStraightLine)));

  // load the translucent snow for the video conf terminal
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\TransSnow.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiTransSnow)));

  // load the translucent snow for the video conf terminal
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\VideoContractCharge.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiVideoContractCharge)));

  //** Mouse Regions **
  MSYS_DefineRegion(addressof(gSelectedFaceRegion), PORTRAIT_X, PORTRAIT_Y, PORTRAIT_X + PORTRAIT_WIDTH, PORTRAIT_Y + PORTRAIT_HEIGHT, MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, SelectFaceMovementRegionCallBack, SelectFaceRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedFaceRegion));

  // Set the fast help for the mouse region
  //	SetRegionFastHelpText( &gSelectedFaceRegion, AimMemberText[ AIM_MEMBER_CLICK_INSTRUCTIONS ] );

  // if user clicks in the area, the merc will shut up!
  MSYS_DefineRegion(addressof(gSelectedShutUpMercRegion), LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y, MSYS_PRIORITY_HIGH - 1, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, SelectShutUpMercRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedShutUpMercRegion));
  // have it disbled at first
  MSYS_DisableRegion(addressof(gSelectedShutUpMercRegion));

  // Button Regions
  giXToCloseVideoConfButtonImage = LoadButtonImage("LAPTOP\\x_button.sti", -1, 0, -1, 1, -1);

  guiPreviousContactNextButtonImage = LoadButtonImage("LAPTOP\\BottomButtons2.sti", -1, 0, -1, 1, -1);

  giPreviousButton = CreateIconAndTextButton(guiPreviousContactNextButtonImage, CharacterInfo[Enum355.AIM_MEMBER_PREVIOUS], AIM_M_FONT_PREV_NEXT_CONTACT(), AIM_M_FONT_PREV_NEXT_CONTACT_COLOR_UP, DEFAULT_SHADOW, AIM_M_FONT_PREV_NEXT_CONTACT_COLOR_DOWN, DEFAULT_SHADOW, TEXT_CJUSTIFIED, PREVIOUS_X, PREVIOUS_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnPreviousButtonCallback);
  SetButtonCursor(giPreviousButton, Enum317.CURSOR_WWW);

  giContactButton = CreateIconAndTextButton(guiPreviousContactNextButtonImage, CharacterInfo[Enum355.AIM_MEMBER_CONTACT], AIM_M_FONT_PREV_NEXT_CONTACT(), AIM_M_FONT_PREV_NEXT_CONTACT_COLOR_UP, DEFAULT_SHADOW, AIM_M_FONT_PREV_NEXT_CONTACT_COLOR_DOWN, DEFAULT_SHADOW, TEXT_CJUSTIFIED, CONTACT_X, CONTACT_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnContactButtonCallback);
  SetButtonCursor(giContactButton, Enum317.CURSOR_WWW);

  giNextButton = CreateIconAndTextButton(guiPreviousContactNextButtonImage, CharacterInfo[Enum355.AIM_MEMBER_NEXT], AIM_M_FONT_PREV_NEXT_CONTACT(), AIM_M_FONT_PREV_NEXT_CONTACT_COLOR_UP, DEFAULT_SHADOW, AIM_M_FONT_PREV_NEXT_CONTACT_COLOR_DOWN, DEFAULT_SHADOW, TEXT_CJUSTIFIED, NEXT_X, NEXT_BOX_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnNextButtonCallback);
  SetButtonCursor(giNextButton, Enum317.CURSOR_WWW);

  gbCurrentSoldier = AimMercArray[gbCurrentIndex];

  gfStopMercFromTalking = false;
  gubVideoConferencingMode = giCurrentSubPage;
  gubVideoConferencingPreviousMode = Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE;

  gfRenderTopLevel = false;

  // if we are re-entering but the video conference should still be up
  if (gubVideoConferencingMode != 0) {
    // if we need to re initialize the talking face
    if (gubVideoConferencingMode != Enum65.AIM_VIDEO_FIRST_CONTACT_MERC_MODE)
      InitVideoFace(gbCurrentSoldier);

    InitDeleteVideoConferencePopUp();
  }

  InitAimMenuBar();
  InitAimDefaults();

  // LoadTextMercPopupImages( BASIC_MERC_POPUP_BACKGROUND, BASIC_MERC_POPUP_BORDER);

  RenderAIMMembers();
  gfIsNewMailFlagSet = false;
  gfAimMemberCanMercSayOpeningQuote = true;

  return true;
}

export function ExitAIMMembers(): void {
  RemoveAimDefaults();

  // if we are exiting and the transfer of funds popup is enable, make sure we dont come back to it
  if (gubPopUpBoxAction)
    giCurrentSubPage = Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE;
  else
    giCurrentSubPage = gubVideoConferencingMode;

  gubVideoConferencingMode = Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE;
  InitDeleteVideoConferencePopUp();

  DeleteVideoSurfaceFromIndex(guiVideoFaceBackground);

  DeleteVideoObjectFromIndex(guiStats);
  DeleteVideoObjectFromIndex(guiPrice);
  DeleteVideoObjectFromIndex(guiPortrait);
  DeleteVideoObjectFromIndex(guiWeaponBox);
  DeleteVideoObjectFromIndex(guiVideoConfPopup);
  DeleteVideoObjectFromIndex(guiVideoConfTerminal);
  DeleteVideoObjectFromIndex(guiBWSnow);
  DeleteVideoObjectFromIndex(guiFuzzLine);
  DeleteVideoObjectFromIndex(guiStraightLine);
  DeleteVideoObjectFromIndex(guiTransSnow);
  DeleteVideoObjectFromIndex(guiVideoContractCharge);

  UnloadButtonImage(guiPreviousContactNextButtonImage);
  UnloadButtonImage(giXToCloseVideoConfButtonImage);

  RemoveButton(giPreviousButton);
  RemoveButton(giContactButton);
  RemoveButton(giNextButton);

  MSYS_RemoveRegion(addressof(gSelectedFaceRegion));
  MSYS_RemoveRegion(addressof(gSelectedShutUpMercRegion));

  ExitAimMenuBar();

  InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_DELETE, null, null, 0, 0, 0);

  RemoveTextMercPopupImages();
}

export function HandleAIMMembers(): void {
  // determine if the merc has a quote that is waiting to be said
  DelayMercSpeech(0, 0, 0, false, false);

  if (gfHangUpMerc && !gfMercIsTalking) {
    if (gubVideoConferencingMode != Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE)
      gubVideoConferencingMode = Enum65.AIM_VIDEO_POPDOWN_MODE;
    gfHangUpMerc = false;
  }

  if (gfStopMercFromTalking) {
    StopMercTalking();
    gfStopMercFromTalking = false;
    /*
                    //if we were waiting for the merc to stop talking
                    if( gfWaitingForMercToStopTalkingOrUserToClick )
                    {
                            gubVideoConferencingMode = AIM_VIDEO_POPDOWN_MODE;
                            gfWaitingForMercToStopTalkingOrUserToClick = FALSE;
                    }
    */
  }

  // If we have to change video conference modes, change to new mode
  if (gubVideoConferencingMode != gubVideoConferencingPreviousMode && gubPopUpBoxAction != Enum66.AIM_POPUP_DISPLAY) {
    InitDeleteVideoConferencePopUp();

    // if we are exiting to display a popup box, dont rerender the display
    if (!fExitDueToMessageBox)
      gfRedrawScreen = true;
  }

  // If we have to get rid of the popup box
  if (gubPopUpBoxAction == Enum66.AIM_POPUP_DELETE) {
    InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_DELETE, null, null, 0, 0, 0);

    // if we are exiting to display a popup box, dont rerender the display
    if (!fExitDueToMessageBox)
      gfRedrawScreen = true;
  }

  // Handle the current video conference screen
  HandleCurrentVideoConfMode();

  // If the answering machine is active, display the graphics for it
  //	if( gfIsAnsweringMachineActive )
  //		HandleAnsweringMachineMessage();

  // if the face is active, display the talking face
  if (gfVideoFaceActive) {
    gfMercIsTalking = DisplayTalkingMercFaceForVideoPopUp(giMercFaceIndex);

    // put the noise lines on the screen
    if (!gfIsAnsweringMachineActive)
      HandleVideoDistortion();

    // to handle when/if the merc is getting po'ed (waiting for player to do something)
    if (!gfMercIsTalking)
      HandleMercAttitude();
  }

  // if we have to rerender the popup, set the flag to render the PostButtonRender function in laptop.c
  if (gubPopUpBoxAction == Enum66.AIM_POPUP_DISPLAY) {
    fReDrawPostButtonRender = true;
  }

  // Gets set in the InitDeleteVideoConferencePopUp() function
  if (gfJustSwitchedVideoConferenceMode)
    gfJustSwitchedVideoConferenceMode = false;

  if (gfRedrawScreen) {
    RenderAIMMembers();
    gfRedrawScreen = false;
  }

  MarkButtonsDirty();
}

export function RenderAIMMembersTopLevel(): boolean {
  InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_DISPLAY, null, null, 0, 0, 0);

  return true;
}

export function RenderAIMMembers(): boolean {
  let hStatsHandle: HVOBJECT;
  let hPriceHandle: HVOBJECT;
  let hWeaponBoxHandle: HVOBJECT;
  let x: UINT16;
  let uiPosX: UINT16;
  let wTemp: wchar_t[] /* [50] */;

  DrawAimDefaults();

  // Stats
  GetVideoObject(addressof(hStatsHandle), guiStats);
  BltVideoObject(FRAME_BUFFER, hStatsHandle, 0, STATS_X, STATS_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Price
  GetVideoObject(addressof(hPriceHandle), guiPrice);
  BltVideoObject(FRAME_BUFFER, hPriceHandle, 0, PRICE_X, PRICE_Y, VO_BLT_SRCTRANSPARENCY, null);

  // WeaponBox
  GetVideoObject(addressof(hWeaponBoxHandle), guiWeaponBox);

  uiPosX = WEAPONBOX_X;
  for (x = 0; x < WEAPONBOX_NUMBER; x++) {
    BltVideoObject(FRAME_BUFFER, hWeaponBoxHandle, 0, uiPosX, WEAPONBOX_Y, VO_BLT_SRCTRANSPARENCY, null);
    uiPosX += WEAPONBOX_SIZE_X;
  }

  UpdateMercInfo();

  // Draw fee & contract
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_FEE], FEE_X, FEE_Y, 0, AIM_M_FONT_PREV_NEXT_CONTACT(), AIM_M_FEE_CONTRACT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_CONTRACT], AIM_CONTRACT_X, AIM_CONTRACT_Y, AIM_CONTRACT_WIDTH, AIM_M_FONT_PREV_NEXT_CONTACT(), AIM_M_FEE_CONTRACT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  // Draw pay period (day, week, 2 week)
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_1_DAY], ONEDAY_X, EXPLEVEL_Y, AIM_CONTRACT_WIDTH, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_1_WEEK], ONEWEEK_X, MARKSMAN_Y, AIM_CONTRACT_WIDTH, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_2_WEEKS], TWOWEEK_X, MECHANAICAL_Y, AIM_CONTRACT_WIDTH, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  // Display AIM Member text
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_ACTIVE_MEMBERS], AIM_MEMBER_ACTIVE_TEXT_X, AIM_MEMBER_ACTIVE_TEXT_Y, AIM_MEMBER_ACTIVE_TEXT_WIDTH, AIM_MAINTITLE_FONT(), AIM_M_ACTIVE_MEMBER_TITLE_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // Display Option Gear Cost text
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_OPTIONAL_GEAR], AIM_MEMBER_OPTIONAL_GEAR_X, AIM_MEMBER_OPTIONAL_GEAR_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  swprintf(wTemp, "%d", gMercProfiles[gbCurrentSoldier].usOptionalGearCost);
  InsertCommasForDollarFigure(wTemp);
  InsertDollarSignInToString(wTemp);
  uiPosX = AIM_MEMBER_OPTIONAL_GEAR_X + StringPixLength(CharacterInfo[Enum355.AIM_MEMBER_OPTIONAL_GEAR], AIM_M_FONT_STATIC_TEXT()) + 5;
  DrawTextToScreen(wTemp, uiPosX, AIM_MEMBER_OPTIONAL_GEAR_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  DisableAimButton();

  DisplayMercsInventory(gbCurrentSoldier);

  DisplayMercsFace();

  if (gubVideoConferencingMode) {
    DisplayMercStats();
    DisplayVideoConferencingDisplay();
  } else {
    // Display the mercs stats and face
    DisplayMercStats();

    gubMercAttitudeLevel = 0;
    gfIsAnsweringMachineActive = false;
  }

  //	InitCreateDeleteAimPopUpBox( AIM_POPUP_DISPLAY, NULL, NULL, 0, 0, 0);

  // check to see if the merc is dead if so disable the contact button
  if (IsMercDead(gbCurrentSoldier)) {
    DisableButton(giContactButton);
  } else {
    EnableButton(giContactButton);
  }

  // if we are to renbder the 'click face' text
  if (gfAimMemberDisplayFaceHelpText) {
    DisplayAimMemberClickOnFaceHelpText();
  }

  RenderWWWProgramTitleBar();
  DisplayProgramBoundingBox(true);
  fReDrawScreenFlag = true;

  return true;
}

export function DrawNumeralsToScreen(iNumber: INT32, bWidth: INT8, usLocX: UINT16, usLocY: UINT16, ulFont: UINT32, ubColor: UINT8): boolean {
  let sStr: wchar_t[] /* [10] */;

  swprintf(sStr, "%d", iNumber);

  DrawTextToScreen(sStr, usLocX, usLocY, bWidth, ulFont, ubColor, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  return true;
}

function DrawMoneyToScreen(iNumber: INT32, bWidth: INT8, usLocX: UINT16, usLocY: UINT16, ulFont: UINT32, ubColor: UINT8): boolean {
  let sStr: wchar_t[] /* [10] */;

  swprintf(sStr, "%d", iNumber);
  InsertCommasForDollarFigure(sStr);
  InsertDollarSignInToString(sStr);

  //	DrawTextToScreen(L"$", usLocX, usLocY, 0, ulFont, ubColor, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  DrawTextToScreen(sStr, usLocX, usLocY, bWidth, ulFont, ubColor, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  return true;
}

function SelectFaceRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX;
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // if the merc is not dead, video conference with the merc
    if (!IsMercDead(gbCurrentSoldier)) {
      gubVideoConferencingMode = Enum65.AIM_VIDEO_POPUP_MODE;
      gfFirstTimeInContactScreen = true;
    }
  }
}

function SelectFaceMovementRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    gfAimMemberDisplayFaceHelpText = false;
    gfRedrawScreen = true;
  } else if (iReason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    gfAimMemberDisplayFaceHelpText = true;
    gfRedrawScreen = true;
  } else if (iReason & MSYS_CALLBACK_REASON_MOVE) {
  }
}

function UpdateMercInfo(): boolean {
  let PosY: UINT16 = 300;
  let MercInfoString: wchar_t[] /* [SIZE_MERC_BIO_INFO] */;
  let AdditionalInfoString: wchar_t[] /* [SIZE_MERC_BIO_INFO] */;

  // Display the salaries
  DrawMoneyToScreen(gMercProfiles[gbCurrentSoldier].sSalary, FEE_WIDTH, FEE_X, HEALTH_Y, AIM_M_NUMBER_FONT(), AIM_M_COLOR_DYNAMIC_TEXT);
  DrawMoneyToScreen(gMercProfiles[gbCurrentSoldier].uiWeeklySalary, FEE_WIDTH, FEE_X, AGILITY_Y, AIM_M_NUMBER_FONT(), AIM_M_COLOR_DYNAMIC_TEXT);
  DrawMoneyToScreen(gMercProfiles[gbCurrentSoldier].uiBiWeeklySalary, FEE_WIDTH, FEE_X, DEXTERITY_Y, AIM_M_NUMBER_FONT(), AIM_M_COLOR_DYNAMIC_TEXT);

  // if medical deposit is required
  if (gMercProfiles[gbCurrentSoldier].bMedicalDeposit) {
    let zTemp: wchar_t[] /* [40] */;
    let sMedicalString: wchar_t[] /* [40] */;

    // Display the medical cost
    swprintf(zTemp, "%d", gMercProfiles[gbCurrentSoldier].sMedicalDepositAmount);
    InsertCommasForDollarFigure(zTemp);
    InsertDollarSignInToString(zTemp);

    swprintf(sMedicalString, "%s %s", zTemp, CharacterInfo[Enum355.AIM_MEMBER_MEDICAL_DEPOSIT_REQ]);

    // If the string will be displayed in more then 2 lines, recenter the string
    if ((DisplayWrappedString(0, 0, AIM_MEDICAL_DEPOSIT_WIDTH, 2, AIM_FONT12ARIAL(), AIM_M_COLOR_DYNAMIC_TEXT, sMedicalString, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED | DONT_DISPLAY_TEXT) / GetFontHeight(AIM_FONT12ARIAL())) > 2) {
      DisplayWrappedString(AIM_MEDICAL_DEPOSIT_X, (AIM_MEDICAL_DEPOSIT_Y - GetFontHeight(AIM_FONT12ARIAL())), AIM_MEDICAL_DEPOSIT_WIDTH, 2, AIM_FONT12ARIAL(), AIM_M_COLOR_DYNAMIC_TEXT, sMedicalString, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
    } else
      DisplayWrappedString(AIM_MEDICAL_DEPOSIT_X, AIM_MEDICAL_DEPOSIT_Y, AIM_MEDICAL_DEPOSIT_WIDTH, 2, AIM_FONT12ARIAL(), AIM_M_COLOR_DYNAMIC_TEXT, sMedicalString, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  LoadMercBioInfo(gbCurrentSoldier, MercInfoString, AdditionalInfoString);
  if (MercInfoString[0] != 0) {
    DisplayWrappedString(AIM_MERC_INFO_X, AIM_MERC_INFO_Y, AIM_MERC_INFO_WIDTH, 2, AIM_M_FONT_DYNAMIC_TEXT(), AIM_FONT_MCOLOR_WHITE, MercInfoString, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }
  if (AdditionalInfoString[0] != 0) {
    DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_ADDTNL_INFO], AIM_MERC_ADD_X, AIM_MERC_ADD_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    DisplayWrappedString(AIM_MERC_ADD_INFO_X, AIM_MERC_ADD_INFO_Y, AIM_MERC_INFO_WIDTH, 2, AIM_M_FONT_DYNAMIC_TEXT(), AIM_FONT_MCOLOR_WHITE, AdditionalInfoString, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }

  return true;
}

function LoadMercBioInfo(ubIndex: UINT8, pInfoString: STR16, pAddInfo: STR16): boolean {
  let hFile: HWFILE;
  let uiBytesRead: UINT32;
  let i: UINT16;
  let uiStartSeekAmount: UINT32;

  hFile = FileOpen(MERCBIOSFILENAME, FILE_ACCESS_READ, false);
  if (!hFile) {
    return false;
  }

  // Get current mercs bio info
  uiStartSeekAmount = (SIZE_MERC_BIO_INFO + SIZE_MERC_ADDITIONAL_INFO) * ubIndex;

  if (FileSeek(hFile, uiStartSeekAmount, FILE_SEEK_FROM_START) == false) {
    return false;
  }

  if (!FileRead(hFile, pInfoString, SIZE_MERC_BIO_INFO, addressof(uiBytesRead))) {
    return false;
  }

  // Decrement, by 1, any value > 32
  for (i = 0; (i < SIZE_MERC_BIO_INFO) && (pInfoString[i] != 0); i++) {
    if (pInfoString[i] > 33)
      pInfoString[i] -= 1;
// FIXME: Language-specific code
// #ifdef POLISH
//     switch (pInfoString[i]) {
//       case 260:
//         pInfoString[i] = 165;
//         break;
//       case 262:
//         pInfoString[i] = 198;
//         break;
//       case 280:
//         pInfoString[i] = 202;
//         break;
//       case 321:
//         pInfoString[i] = 163;
//         break;
//       case 323:
//         pInfoString[i] = 209;
//         break;
//       case 211:
//         pInfoString[i] = 211;
//         break;
//
//       case 346:
//         pInfoString[i] = 338;
//         break;
//       case 379:
//         pInfoString[i] = 175;
//         break;
//       case 377:
//         pInfoString[i] = 143;
//         break;
//       case 261:
//         pInfoString[i] = 185;
//         break;
//       case 263:
//         pInfoString[i] = 230;
//         break;
//       case 281:
//         pInfoString[i] = 234;
//         break;
//
//       case 322:
//         pInfoString[i] = 179;
//         break;
//       case 324:
//         pInfoString[i] = 241;
//         break;
//       case 243:
//         pInfoString[i] = 243;
//         break;
//       case 347:
//         pInfoString[i] = 339;
//         break;
//       case 380:
//         pInfoString[i] = 191;
//         break;
//       case 378:
//         pInfoString[i] = 376;
//         break;
//     }
// #endif
  }

  // Get the additional info
  uiStartSeekAmount = ((SIZE_MERC_BIO_INFO + SIZE_MERC_ADDITIONAL_INFO) * ubIndex) + SIZE_MERC_BIO_INFO;
  if (FileSeek(hFile, uiStartSeekAmount, FILE_SEEK_FROM_START) == false) {
    return false;
  }

  if (!FileRead(hFile, pAddInfo, SIZE_MERC_ADDITIONAL_INFO, addressof(uiBytesRead))) {
    return false;
  }

  // Decrement, by 1, any value > 32
  for (i = 0; (i < SIZE_MERC_BIO_INFO) && (pAddInfo[i] != 0); i++) {
    if (pAddInfo[i] > 33)
      pAddInfo[i] -= 1;
// FIXME: Language-specific code
// #ifdef POLISH
//     switch (pAddInfo[i]) {
//       case 260:
//         pAddInfo[i] = 165;
//         break;
//       case 262:
//         pAddInfo[i] = 198;
//         break;
//       case 280:
//         pAddInfo[i] = 202;
//         break;
//       case 321:
//         pAddInfo[i] = 163;
//         break;
//       case 323:
//         pAddInfo[i] = 209;
//         break;
//       case 211:
//         pAddInfo[i] = 211;
//         break;
//
//       case 346:
//         pAddInfo[i] = 338;
//         break;
//       case 379:
//         pAddInfo[i] = 175;
//         break;
//       case 377:
//         pAddInfo[i] = 143;
//         break;
//       case 261:
//         pAddInfo[i] = 185;
//         break;
//       case 263:
//         pAddInfo[i] = 230;
//         break;
//       case 281:
//         pAddInfo[i] = 234;
//         break;
//
//       case 322:
//         pAddInfo[i] = 179;
//         break;
//       case 324:
//         pAddInfo[i] = 241;
//         break;
//       case 243:
//         pAddInfo[i] = 243;
//         break;
//       case 347:
//         pAddInfo[i] = 339;
//         break;
//       case 380:
//         pAddInfo[i] = 191;
//         break;
//       case 378:
//         pAddInfo[i] = 376;
//         break;
//     }
// #endif
  }

  FileClose(hFile);
  return true;
}

function DisplayMercsInventory(ubMercID: UINT8): boolean {
  let i: UINT8;
  let PosX: INT16;
  let PosY: INT16;
  let sCenX: INT16;
  let sCenY: INT16;
  let usItem: UINT16;
  let pItem: Pointer<INVTYPE>;
  let hVObject: HVOBJECT;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let gzItemName: UINT16[] /* [SIZE_ITEM_NAME] */;
  let ubItemCount: UINT8 = 0;
  //	UINT16			gzTempItemName[ SIZE_ITEM_INFO ];

  // if the mercs inventory has already been purchased, dont display the inventory
  if (gMercProfiles[ubMercID].ubMiscFlags & PROFILE_MISC_FLAG_ALREADY_USED_ITEMS)
    return true;

  PosY = WEAPONBOX_Y;
  PosX = WEAPONBOX_X + 3; // + 3 ( 1 to take care of the shadow, +2 to get past the weapon box border )
  for (i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    usItem = gMercProfiles[ubMercID].inv[i];

    // if its a valid item AND we are only displaying less then 8 items
    if (usItem && ubItemCount < WEAPONBOX_NUMBER) {
      // increase the item count
      ubItemCount++;

      pItem = addressof(Item[usItem]);
      GetVideoObject(addressof(hVObject), GetInterfaceGraphicForItem(pItem));
      pTrav = addressof(hVObject.value.pETRLEObject[pItem.value.ubGraphicNum]);

      usHeight = pTrav.value.usHeight;
      usWidth = pTrav.value.usWidth;

      sCenX = PosX + (Math.abs(WEAPONBOX_SIZE_X - 3 - usWidth) / 2) - pTrav.value.sOffsetX;
      sCenY = PosY + (Math.abs(WEAPONBOX_SIZE_Y - usHeight) / 2) - pTrav.value.sOffsetY;

      // blt the shadow of the item
      BltVideoObjectOutlineShadowFromIndex(FRAME_BUFFER, GetInterfaceGraphicForItem(pItem), pItem.value.ubGraphicNum, sCenX - 2, sCenY + 2);
      // blt the item
      BltVideoObjectOutlineFromIndex(FRAME_BUFFER, GetInterfaceGraphicForItem(pItem), pItem.value.ubGraphicNum, sCenX, sCenY, 0, false);

      // if there are more then 1 piece of equipment in the current slot, display how many there are
      if (gMercProfiles[ubMercID].bInvNumber[i] > 1) {
        let zTempStr: wchar_t[] /* [32] */;
        //				UINT16	usWidthOfNumber;

        swprintf(zTempStr, "x%d", gMercProfiles[ubMercID].bInvNumber[i]);

        DrawTextToScreen(zTempStr, (PosX - 1), (PosY + 20), AIM_MEMBER_WEAPON_NAME_WIDTH, AIM_M_FONT_DYNAMIC_TEXT(), AIM_M_WEAPON_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
      } else {
      }

      wcscpy(gzItemName, ShortItemNames[usItem]);

      // if this will only be a single line, center it in the box
      if ((DisplayWrappedString((PosX - 1), AIM_MEMBER_WEAPON_NAME_Y, AIM_MEMBER_WEAPON_NAME_WIDTH, 2, AIM_M_WEAPON_TEXT_FONT(), AIM_M_WEAPON_TEXT_COLOR, gzItemName, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED | DONT_DISPLAY_TEXT) / GetFontHeight(AIM_M_WEAPON_TEXT_FONT())) == 1)
        DisplayWrappedString((PosX - 1), (AIM_MEMBER_WEAPON_NAME_Y + GetFontHeight(AIM_M_WEAPON_TEXT_FONT()) / 2), AIM_MEMBER_WEAPON_NAME_WIDTH, 2, AIM_M_WEAPON_TEXT_FONT(), AIM_M_WEAPON_TEXT_COLOR, gzItemName, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
      else
        DisplayWrappedString((PosX - 1), AIM_MEMBER_WEAPON_NAME_Y, AIM_MEMBER_WEAPON_NAME_WIDTH, 2, AIM_M_WEAPON_TEXT_FONT(), AIM_M_WEAPON_TEXT_COLOR, gzItemName, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

      PosX += WEAPONBOX_SIZE_X;
    }
  }

  return true;
}

function BtnPreviousButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_DELETE, null, null, 0, 0, 0);

      if (gbCurrentIndex > 0)
        gbCurrentIndex--;
      else
        gbCurrentIndex = MAX_NUMBER_MERCS - 1;

      gfRedrawScreen = true;

      gbCurrentSoldier = AimMercArray[gbCurrentIndex];

      gubVideoConferencingMode = Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE;
      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnContactButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      // if we are not already in the video conferemce mode, go in to it
      if (!gubVideoConferencingMode) {
        gubVideoConferencingMode = Enum65.AIM_VIDEO_POPUP_MODE;
        //				gubVideoConferencingMode = AIM_VIDEO_INIT_MODE;
        gfFirstTimeInContactScreen = true;
      }

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_DELETE, null, null, 0, 0, 0);

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnNextButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
      InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_DELETE, null, null, 0, 0, 0);

      if (gbCurrentIndex < MAX_NUMBER_MERCS - 1)
        gbCurrentIndex++;
      else
        gbCurrentIndex = 0;

      gbCurrentSoldier = AimMercArray[gbCurrentIndex];

      gfRedrawScreen = true;

      gubVideoConferencingMode = Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function DisplayMercsFace(): boolean {
  let hFaceHandle: HVOBJECT;
  let hPortraitHandle: HVOBJECT;
  let sFaceLoc: STR = "FACES\\BIGFACES\\";
  let sTemp: char[] /* [100] */;
  let VObjectDesc: VOBJECT_DESC;
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // See if the merc is currently hired
  pSoldier = FindSoldierByProfileID(gbCurrentSoldier, true);

  // Portrait Frame
  GetVideoObject(addressof(hPortraitHandle), guiPortrait);
  BltVideoObject(FRAME_BUFFER, hPortraitHandle, 0, PORTRAIT_X, PORTRAIT_Y, VO_BLT_SRCTRANSPARENCY, null);

  // load the Face graphic and add it
  sprintf(sTemp, "%s%02d.sti", sFaceLoc, gbCurrentSoldier);
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP(sTemp, VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFace)));

  // Blt face to screen
  GetVideoObject(addressof(hFaceHandle), guiFace);
  BltVideoObject(FRAME_BUFFER, hFaceHandle, 0, FACE_X, FACE_Y, VO_BLT_SRCTRANSPARENCY, null);

  // if the merc is dead
  if (IsMercDead(gbCurrentSoldier)) {
    // shade the face red, (to signif that he is dead)
    hFaceHandle.value.pShades[0] = Create16BPPPaletteShaded(hFaceHandle.value.pPaletteEntry, DEAD_MERC_COLOR_RED, DEAD_MERC_COLOR_GREEN, DEAD_MERC_COLOR_BLUE, true);

    // get the face object
    GetVideoObject(addressof(hFaceHandle), guiFace);

    // set the red pallete to the face
    SetObjectHandleShade(guiFace, 0);

    // Blt face to screen
    BltVideoObject(FRAME_BUFFER, hFaceHandle, 0, FACE_X, FACE_Y, VO_BLT_SRCTRANSPARENCY, null);

    // if the merc is dead, display it
    DrawTextToScreen(AimPopUpText[Enum357.AIM_MEMBER_DEAD], FACE_X + 1, FACE_Y + 107, FACE_WIDTH, FONT14ARIAL(), 145, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  // else if the merc is currently a POW or, the merc was fired as a pow
  else if (gMercProfiles[gbCurrentSoldier].bMercStatus == MERC_FIRED_AS_A_POW || (pSoldier && pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW)) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, FACE_X, FACE_Y, FACE_X + FACE_WIDTH, FACE_Y + FACE_HEIGHT);
    DrawTextToScreen(pPOWStrings[0], FACE_X + 1, FACE_Y + 107, FACE_WIDTH, FONT14ARIAL(), 145, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  // else if the merc has already been hired
  else if (FindSoldierByProfileID(gbCurrentSoldier, true)) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, FACE_X, FACE_Y, FACE_X + FACE_WIDTH, FACE_Y + FACE_HEIGHT);
    DrawTextToScreen(MercInfo[Enum341.MERC_FILES_ALREADY_HIRED], FACE_X + 1, FACE_Y + 107, FACE_WIDTH, FONT14ARIAL(), 145, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  else if (!IsMercHireable(gbCurrentSoldier)) {
    // else if the merc has a text file and the merc is not away
    ShadowVideoSurfaceRect(FRAME_BUFFER, FACE_X, FACE_Y, FACE_X + FACE_WIDTH, FACE_Y + FACE_HEIGHT);
    DrawTextToScreen(AimPopUpText[Enum357.AIM_MEMBER_ON_ASSIGNMENT], FACE_X + 1, FACE_Y + 107, FACE_WIDTH, FONT14ARIAL(), 145, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  DeleteVideoObjectFromIndex(guiFace);

  return true;
}

function DisplayMercStats(): void {
  let ubColor: UINT8;

  //
  // Display all the static text
  //

  // First column in stats box.  Health, Agility, dexterity, strength, leadership, wisdom
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_HEALTH], STATS_FIRST_COL, HEALTH_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_FIRST_COL, HEALTH_Y, FIRST_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_HEALTH]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_AGILITY], STATS_FIRST_COL, AGILITY_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_FIRST_COL, AGILITY_Y, FIRST_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_AGILITY]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_DEXTERITY], STATS_FIRST_COL, DEXTERITY_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_FIRST_COL, DEXTERITY_Y, FIRST_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_DEXTERITY]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_STRENGTH], STATS_FIRST_COL, STRENGTH_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_FIRST_COL, STRENGTH_Y, FIRST_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_STRENGTH]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_LEADERSHIP], STATS_FIRST_COL, LEADERSHIP_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_FIRST_COL, LEADERSHIP_Y, FIRST_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_LEADERSHIP]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_WISDOM], STATS_FIRST_COL, WISDOM_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_FIRST_COL, WISDOM_Y, FIRST_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_WISDOM]);

  // Second column in stats box.  Exp.Level, Markmanship, mechanical, explosive, medical
  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_EXP_LEVEL], STATS_SECOND_COL, EXPLEVEL_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_SECOND_COL, EXPLEVEL_Y, SECOND_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_EXP_LEVEL]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_MARKSMANSHIP], STATS_SECOND_COL, MARKSMAN_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_SECOND_COL, MARKSMAN_Y, SECOND_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_MARKSMANSHIP]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_MECHANICAL], STATS_SECOND_COL, MECHANAICAL_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_SECOND_COL, MECHANAICAL_Y, SECOND_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_MECHANICAL]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_EXPLOSIVE], STATS_SECOND_COL, EXPLOSIVE_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_SECOND_COL, EXPLOSIVE_Y, SECOND_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_EXPLOSIVE]);

  DrawTextToScreen(CharacterInfo[Enum355.AIM_MEMBER_MEDICAL], STATS_SECOND_COL, MEDICAL_Y, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DisplayDots(STATS_SECOND_COL, MEDICAL_Y, SECOND_COLUMN_DOT, CharacterInfo[Enum355.AIM_MEMBER_MEDICAL]);

  //
  // Display all the Merc dynamic stat info
  //

  // Name
  DrawTextToScreen(gMercProfiles[gbCurrentSoldier].zName, NAME_X, NAME_Y, 0, FONT14ARIAL(), AIM_M_COLOR_DYNAMIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Numbers for above.   Health, Agility, dexterity, strength, leadership, wisdom

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bLife);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bLife, 3, STATS_FIRST_NUM, HEALTH_Y, AIM_M_NUMBER_FONT(), ubColor);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bAgility);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bAgility, 3, STATS_FIRST_NUM, AGILITY_Y, AIM_M_NUMBER_FONT(), ubColor);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bDexterity);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bDexterity, 3, STATS_FIRST_NUM, DEXTERITY_Y, AIM_M_NUMBER_FONT(), ubColor);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bStrength);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bStrength, 3, STATS_FIRST_NUM, STRENGTH_Y, AIM_M_NUMBER_FONT(), ubColor);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bLeadership);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bLeadership, 3, STATS_FIRST_NUM, LEADERSHIP_Y, AIM_M_NUMBER_FONT(), ubColor);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bWisdom);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bWisdom, 3, STATS_FIRST_NUM, WISDOM_Y, AIM_M_NUMBER_FONT(), ubColor);

  // Second column in stats box.  Exp.Level, Markmanship, mechanical, explosive, medical

  //	ubColor = GetStatColor( gMercProfiles[gbCurrentSoldier].bExpLevel );
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bExpLevel, 3, STATS_SECOND_NUM, EXPLEVEL_Y, AIM_M_NUMBER_FONT(), FONT_MCOLOR_WHITE);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bMarksmanship);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bMarksmanship, 3, STATS_SECOND_NUM, MARKSMAN_Y, AIM_M_NUMBER_FONT(), ubColor);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bMechanical);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bMechanical, 3, STATS_SECOND_NUM, MECHANAICAL_Y, AIM_M_NUMBER_FONT(), ubColor);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bExplosive);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bExplosive, 3, STATS_SECOND_NUM, EXPLOSIVE_Y, AIM_M_NUMBER_FONT(), ubColor);

  ubColor = GetStatColor(gMercProfiles[gbCurrentSoldier].bMedical);
  DrawNumeralsToScreen(gMercProfiles[gbCurrentSoldier].bMedical, 3, STATS_SECOND_NUM, MEDICAL_Y, AIM_M_NUMBER_FONT(), ubColor);
}

function GetStatColor(bStat: INT8): UINT8 {
  if (bStat >= 80)
    return HIGH_STAT_COLOR;
  else if (bStat >= 50)
    return MED_STAT_COLOR;
  else
    return LOW_STAT_COLOR;
}

// displays the dots between the stats and the stat name
function DisplayDots(usNameX: UINT16, usNameY: UINT16, usStatX: UINT16, pString: STR16): void {
  let sNumberOfDots: INT16;
  let usStringLength: UINT16 = StringPixLength(pString, AIM_M_FONT_STATIC_TEXT());
  let i: INT16;
  let usPosX: UINT16;

  sNumberOfDots = (usStatX - usNameX - usStringLength) / 7;

  usPosX = usStatX;
  for (i = usNameX + usStringLength; i <= usPosX; usPosX -= 7) {
    DrawTextToScreen(".", usPosX, usNameY, 0, AIM_M_FONT_STATIC_TEXT(), AIM_M_COLOR_STATIC_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }
}

function BtnContractLengthButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    let ubRetValue: UINT8 = MSYS_GetBtnUserData(btn, 0);

    btn.value.uiFlags |= BUTTON_CLICKED_ON;

    gubContractLength = ubRetValue;
    DisplaySelectLights(true, false);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    DisplaySelectLights(false, false);

    guiMercAttitudeTime = GetJA2Clock();

    DisplayMercChargeAmount();
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);

    //		InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnBuyEquipmentButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    gfBuyEquipment = MSYS_GetBtnUserData(btn, 0);
    DisplaySelectLights(false, true);

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    DisplaySelectLights(false, false);
    DisplayMercChargeAmount();

    guiMercAttitudeTime = GetJA2Clock();

    //		InvalidateRegion(LAPTOP_SCREEN_UL_X,LAPTOP_SCREEN_WEB_UL_Y,LAPTOP_SCREEN_LR_X,LAPTOP_SCREEN_WEB_LR_Y);

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

// Transfer funds button callback
function BtnAuthorizeButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubRetValue: UINT8 = MSYS_GetBtnUserData(btn, 0);
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    gfStopMercFromTalking = true;
    gubMercAttitudeLevel = QUOTE_DELAY_NO_ACTION;

    // If we try to hire the merc
    if (ubRetValue == 0) {
      StopMercTalking();

      // can the merc be hired?  (does he like/not like people on the team
      //			if( CanMercBeHired() )
      {
        // Was the merc hired
        if (AimMemberHireMerc()) {
          // if merc was hired
          InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_CREATE, AimPopUpText[Enum357.AIM_MEMBER_FUNDS_TRANSFER_SUCCESFUL], null, AIM_POPUP_BOX_X, AIM_POPUP_BOX_Y, AIM_POPUP_BOX_SUCCESS);
          DelayMercSpeech(gbCurrentSoldier, Enum202.QUOTE_CONTRACT_ACCEPTANCE, 750, true, false);

          // Disable the buttons behind the message box
          EnableDisableCurrentVideoConferenceButtons(true);

          SpecifyDisabledButtonStyle(giBuyEquipmentButton[0], Enum29.DISABLED_STYLE_NONE);
          SpecifyDisabledButtonStyle(giBuyEquipmentButton[1], Enum29.DISABLED_STYLE_NONE);

          giIdOfLastHiredMerc = AimMercArray[gbCurrentIndex];
        }
      }
      /*
                              else
                              {
                                      //else the merc doesnt like a player on the team, hang up when the merc is done complaining

                                      //reset ( in case merc was going to say something
                                      DelayMercSpeech( 0, 0, 0, FALSE, TRUE );

                                      gubVideoConferencingMode = AIM_VIDEO_HIRE_MERC_MODE;
                              }
      */
    }
    // else we cancel
    else {
      gubVideoConferencingMode = Enum65.AIM_VIDEO_FIRST_CONTACT_MERC_MODE;
    }
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function AimMemberHireMerc(): INT8 {
  let HireMercStruct: MERC_HIRE_STRUCT;
  let ubCurrentSoldier: UINT8 = AimMercArray[gbCurrentIndex];
  let bReturnCode: INT8;
  let sSoldierID: INT16 = 0;
  let bTypeOfContract: INT8 = 0;

  if (LaptopSaveInfo.iCurrentBalance < giContractAmount) {
    // wasnt hired because of lack of funds
    InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_CREATE, AimPopUpText[Enum357.AIM_MEMBER_FUNDS_TRANSFER_FAILED], AimPopUpText[Enum357.AIM_MEMBER_NOT_ENOUGH_FUNDS], AIM_POPUP_BOX_X, AIM_POPUP_BOX_Y, AIM_POPUP_BOX_FAILURE);

    // Disable the buttons behind the message box
    EnableDisableCurrentVideoConferenceButtons(true);

    SpecifyDisabledButtonStyle(giBuyEquipmentButton[0], Enum29.DISABLED_STYLE_NONE);
    SpecifyDisabledButtonStyle(giBuyEquipmentButton[1], Enum29.DISABLED_STYLE_NONE);

    DelayMercSpeech(gbCurrentSoldier, Enum202.QUOTE_REFUSAL_TO_JOIN_LACK_OF_FUNDS, 750, true, false);

    return false;
  }

  memset(addressof(HireMercStruct), 0, sizeof(MERC_HIRE_STRUCT));

  HireMercStruct.ubProfileID = ubCurrentSoldier;

  // DEF: temp
  HireMercStruct.sSectorX = gsMercArriveSectorX;
  HireMercStruct.sSectorY = gsMercArriveSectorY;
  HireMercStruct.fUseLandingZoneForArrival = true;
  HireMercStruct.ubInsertionCode = Enum175.INSERTION_CODE_ARRIVING_GAME;

  HireMercStruct.fCopyProfileItemsOver = gfBuyEquipment;
  // if the players is buyibng the equipment
  if (gfBuyEquipment) {
    gMercProfiles[ubCurrentSoldier].ubMiscFlags |= PROFILE_MISC_FLAG_ALREADY_USED_ITEMS;
  }

  // If 1 day
  if (gubContractLength == AIM_CONTRACT_LENGTH_ONE_DAY) {
    bTypeOfContract = Enum161.CONTRACT_EXTEND_1_DAY;
    HireMercStruct.iTotalContractLength = 1;
  } else if (gubContractLength == AIM_CONTRACT_LENGTH_ONE_WEEK) {
    bTypeOfContract = Enum161.CONTRACT_EXTEND_1_WEEK;
    HireMercStruct.iTotalContractLength = 7;
  } else if (gubContractLength == AIM_CONTRACT_LENGTH_TWO_WEEKS) {
    bTypeOfContract = Enum161.CONTRACT_EXTEND_2_WEEK;
    HireMercStruct.iTotalContractLength = 14;
  }

  // specify when the merc should arrive
  HireMercStruct.uiTimeTillMercArrives = GetMercArrivalTimeOfDay(); // + ubCurrentSoldier

  // Set the time and ID of the last hired merc will arrive
  //	LaptopSaveInfo.sLastHiredMerc.iIdOfMerc = HireMercStruct.ubProfileID;
  //	LaptopSaveInfo.sLastHiredMerc.uiArrivalTime = HireMercStruct.uiTimeTillMercArrives;

  // if we succesfully hired the merc
  bReturnCode = HireMerc(addressof(HireMercStruct));
  if (bReturnCode == MERC_HIRE_OVER_20_MERCS_HIRED) {
    // display a warning saying u cant hire more then 20 mercs
    DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, AimPopUpText[Enum357.AIM_MEMBER_ALREADY_HAVE_20_MERCS], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, null);
    return false;
  } else if (bReturnCode == MERC_HIRE_FAILED) {
    return false;
  }

  // Set the type of contract the merc is on
  sSoldierID = GetSoldierIDFromMercID(ubCurrentSoldier);
  if (sSoldierID == -1)
    return false;
  Menptr[sSoldierID].bTypeOfLastContract = bTypeOfContract;

  // add an entry in the finacial page for the hiring of the merc
  AddTransactionToPlayersBook(Enum80.HIRED_MERC, ubCurrentSoldier, GetWorldTotalMin(), -(giContractAmount - gMercProfiles[gbCurrentSoldier].sMedicalDepositAmount));

  if (gMercProfiles[gbCurrentSoldier].bMedicalDeposit) {
    // add an entry in the finacial page for the medical deposit
    AddTransactionToPlayersBook(Enum80.MEDICAL_DEPOSIT, ubCurrentSoldier, GetWorldTotalMin(), -(gMercProfiles[gbCurrentSoldier].sMedicalDepositAmount));
  }

  // add an entry in the history page for the hiring of the merc
  AddHistoryToPlayersLog(Enum83.HISTORY_HIRED_MERC_FROM_AIM, ubCurrentSoldier, GetWorldTotalMin(), -1, -1);
  return true;
}

function DisplayVideoConferencingDisplay(): boolean {
  let sMercName: wchar_t[] /* [128] */;

  if ((gubVideoConferencingMode == Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE) || (gubVideoConferencingMode == Enum65.AIM_VIDEO_POPUP_MODE))
    return false;

  DisplayMercsVideoFace();

  // Title & Name
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_INIT_MODE) {
    swprintf(sMercName, "%s", VideoConfercingText[Enum356.AIM_MEMBER_CONNECTING]);
    DrawTextToScreen(sMercName, AIM_MEMBER_VIDEO_NAME_X, AIM_MEMBER_VIDEO_NAME_Y, 0, FONT12ARIAL(), AIM_M_VIDEO_TITLE_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  } else {
    swprintf(sMercName, "%s %s", VideoConfercingText[Enum356.AIM_MEMBER_VIDEO_CONF_WITH], gMercProfiles[gbCurrentSoldier].zName);
    DrawTextToScreen(sMercName, AIM_MEMBER_VIDEO_NAME_X, AIM_MEMBER_VIDEO_NAME_Y, 0, FONT12ARIAL(), AIM_M_VIDEO_TITLE_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }

  // Display Contract charge text
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_HIRE_MERC_MODE) {
    // Display the contract charge
    SetFontShadow(AIM_M_VIDEO_NAME_SHADOWCOLOR);
    DrawTextToScreen(VideoConfercingText[Enum356.AIM_MEMBER_CONTRACT_CHARGE], AIM_CONTRACT_CHARGE_X, AIM_CONTRACT_CHARGE_Y, 0, FONT12ARIAL(), AIM_M_VIDEO_NAME_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    SetFontShadow(DEFAULT_SHADOW);
  }

  DisplayMercChargeAmount();

  //	if( gfMercIsTalking && !gfIsAnsweringMachineActive)
  if (gfMercIsTalking && gGameSettings.fOptions[Enum8.TOPTION_SUBTITLES]) {
    let usActualWidth: UINT16;
    let usActualHeight: UINT16;
    let usPosX: UINT16;

    SET_USE_WINFONTS(true);
    SET_WINFONT(giSubTitleWinFont);
    iAimMembersBoxId = PrepareMercPopupBox(iAimMembersBoxId, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, gsTalkingMercText, 300, 0, 0, 0, addressof(usActualWidth), addressof(usActualHeight));
    SET_USE_WINFONTS(false);

    usPosX = (LAPTOP_SCREEN_LR_X - usActualWidth) / 2;

    RenderMercPopUpBoxFromIndex(iAimMembersBoxId, usPosX, TEXT_POPUP_WINDOW_Y, FRAME_BUFFER);

    if (RemoveMercPopupBoxFromIndex(iAimMembersBoxId)) {
      iAimMembersBoxId = -1;
    }
  }

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);

  return true;
}

function DisplayMercsVideoFace(): boolean {
  let hTerminalHandle: HVOBJECT;
  let sFaceLoc: STR = "FACES\\";

  // Get and Blt Terminal Frame
  GetVideoObject(addressof(hTerminalHandle), guiVideoConfTerminal);
  ShadowVideoSurfaceImage(FRAME_BUFFER, hTerminalHandle, AIM_MEMBER_VIDEO_CONF_TERMINAL_X, AIM_MEMBER_VIDEO_CONF_TERMINAL_Y);
  BltVideoObject(FRAME_BUFFER, hTerminalHandle, 0, AIM_MEMBER_VIDEO_CONF_TERMINAL_X, AIM_MEMBER_VIDEO_CONF_TERMINAL_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Display the Select light on the merc
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_HIRE_MERC_MODE)
    DisplaySelectLights(false, false);

  return true;
}

function DisplaySelectLights(fContractDown: boolean, fBuyEquipDown: boolean): void {
  let i: UINT16;
  let usPosY: UINT16;
  let usPosX: UINT16;

  // First draw the select light for the contract length buttons
  usPosY = AIM_MEMBER_BUY_CONTRACT_LENGTH_Y;
  for (i = 0; i < 3; i++) {
    // if the if is true, the light is on
    if (gubContractLength == i) {
      if (fContractDown) {
        usPosX = AIM_MEMBER_BUY_CONTRACT_LENGTH_X + AIM_SELECT_LIGHT_ON_X;
        ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY + AIM_SELECT_LIGHT_ON_Y, usPosX + 8, usPosY + AIM_SELECT_LIGHT_ON_Y + 8, Get16BPPColor(FROMRGB(0, 255, 0)));
      } else {
        usPosX = AIM_MEMBER_BUY_CONTRACT_LENGTH_X + AIM_SELECT_LIGHT_OFF_X;
        ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY + AIM_SELECT_LIGHT_OFF_Y, usPosX + 8, usPosY + AIM_SELECT_LIGHT_OFF_Y + 8, Get16BPPColor(FROMRGB(0, 255, 0)));
      }
    } else {
      usPosX = AIM_MEMBER_BUY_CONTRACT_LENGTH_X + AIM_SELECT_LIGHT_OFF_X;
      ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY + AIM_SELECT_LIGHT_OFF_Y, usPosX + 8, usPosY + AIM_SELECT_LIGHT_OFF_Y + 8, Get16BPPColor(FROMRGB(0, 0, 0)));
    }
    usPosY += AIM_MEMBER_BUY_EQUIPMENT_GAP;
  }

  // draw the select light for the buy equipment buttons
  usPosY = AIM_MEMBER_BUY_CONTRACT_LENGTH_Y;
  for (i = 0; i < 2; i++) {
    if (gfBuyEquipment == i) {
      if (fBuyEquipDown) {
        usPosX = AIM_MEMBER_BUY_EQUIPMENT_X + AIM_SELECT_LIGHT_ON_X;
        ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY + AIM_SELECT_LIGHT_ON_Y, usPosX + 8, usPosY + AIM_SELECT_LIGHT_ON_Y + 8, Get16BPPColor(FROMRGB(0, 255, 0)));
      } else {
        usPosX = AIM_MEMBER_BUY_EQUIPMENT_X + AIM_SELECT_LIGHT_OFF_X;
        ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY + AIM_SELECT_LIGHT_OFF_Y, usPosX + 8, usPosY + AIM_SELECT_LIGHT_OFF_Y + 8, Get16BPPColor(FROMRGB(0, 255, 0)));
      }
    } else {
      usPosX = AIM_MEMBER_BUY_EQUIPMENT_X + AIM_SELECT_LIGHT_OFF_X;
      ColorFillVideoSurfaceArea(FRAME_BUFFER, usPosX, usPosY + AIM_SELECT_LIGHT_OFF_Y, usPosX + 8, usPosY + AIM_SELECT_LIGHT_OFF_Y + 8, Get16BPPColor(FROMRGB(0, 0, 0)));
    }
    usPosY += AIM_MEMBER_BUY_EQUIPMENT_GAP;
  }
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function DisplayMercChargeAmount(): UINT32 {
  let wTemp: wchar_t[] /* [50] */;
  let wDollarTemp: wchar_t[] /* [50] */;
  let hImageHandle: HVOBJECT;

  if (gubVideoConferencingMode != Enum65.AIM_VIDEO_HIRE_MERC_MODE)
    return 0;

  // Display the 'black hole'for the contract charge  in the video conference terminal
  GetVideoObject(addressof(hImageHandle), guiVideoContractCharge);
  BltVideoObject(FRAME_BUFFER, hImageHandle, 0, AIM_MEMBER_VIDEO_CONF_CONTRACT_IMAGE_X, AIM_MEMBER_VIDEO_CONF_CONTRACT_IMAGE_Y, VO_BLT_SRCTRANSPARENCY, null);

  if (FindSoldierByProfileID(gbCurrentSoldier, true) == null) {
    giContractAmount = 0;

    // the contract charge amount

    // Get the salary rate
    if (gubContractLength == AIM_CONTRACT_LENGTH_ONE_DAY)
      giContractAmount = gMercProfiles[gbCurrentSoldier].sSalary;

    else if (gubContractLength == AIM_CONTRACT_LENGTH_ONE_WEEK)
      giContractAmount = gMercProfiles[gbCurrentSoldier].uiWeeklySalary;

    else if (gubContractLength == AIM_CONTRACT_LENGTH_TWO_WEEKS)
      giContractAmount = gMercProfiles[gbCurrentSoldier].uiBiWeeklySalary;

    // if there is a medical deposit, add it in
    if (gMercProfiles[gbCurrentSoldier].bMedicalDeposit) {
      giContractAmount += gMercProfiles[gbCurrentSoldier].sMedicalDepositAmount;
    }

    // If hired with the equipment, add it in aswell
    if (gfBuyEquipment) {
      giContractAmount += gMercProfiles[gbCurrentSoldier].usOptionalGearCost;
    }
  }

  swprintf(wDollarTemp, "%d", giContractAmount);
  InsertCommasForDollarFigure(wDollarTemp);
  InsertDollarSignInToString(wDollarTemp);

  // if the merc hasnt just been hired
  //	if( FindSoldierByProfileID( gbCurrentSoldier, TRUE ) == NULL )
  {
    if (gMercProfiles[gbCurrentSoldier].bMedicalDeposit)
      swprintf(wTemp, "%s %s", wDollarTemp, VideoConfercingText[Enum356.AIM_MEMBER_WITH_MEDICAL]);
    else
      swprintf(wTemp, "%s", wDollarTemp);

    DrawTextToScreen(wTemp, AIM_CONTRACT_CHARGE_AMOUNNT_X + 1, AIM_CONTRACT_CHARGE_AMOUNNT_Y + 3, 0, AIM_M_VIDEO_CONTRACT_AMOUNT_FONT(), AIM_M_VIDEO_CONTRACT_AMOUNT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }

  return giContractAmount;
}

function InitCreateDeleteAimPopUpBox(ubFlag: UINT8, sString1: STR16, sString2: STR16, usPosX: UINT16, usPosY: UINT16, ubData: UINT8): boolean {
  let VObjectDesc: VOBJECT_DESC;
  let hPopupBoxHandle: HVOBJECT;
  /* static */ let usPopUpBoxPosX: UINT16;
  /* static */ let usPopUpBoxPosY: UINT16;
  /* static */ let sPopUpString1: wchar_t[] /* [400] */;
  /* static */ let sPopUpString2: wchar_t[] /* [400] */;
  /* static */ let fPopUpBoxActive: boolean = false;
  ;

  switch (ubFlag) {
    case Enum66.AIM_POPUP_CREATE: {
      if (fPopUpBoxActive)
        return false;

      // Disable the 'X' to close the pop upi video
      DisableButton(giXToCloseVideoConfButton);

      if (sString1 != null)
        wcscpy(sPopUpString1, sString1);
      else
        sPopUpString1[0] = '\0';

      if (sString2 != null)
        wcscpy(sPopUpString2, sString2);
      else
        sPopUpString2[0] = '\0';

      usPopUpBoxPosX = usPosX;
      usPopUpBoxPosY = usPosY;

      // load the popup box graphic
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("LAPTOP\\VideoConfPopUp.sti", VObjectDesc.ImageFile);
      CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiPopUpBox)));

      GetVideoObject(addressof(hPopupBoxHandle), guiPopUpBox);
      BltVideoObject(FRAME_BUFFER, hPopupBoxHandle, 0, usPosX, usPosY, VO_BLT_SRCTRANSPARENCY, null);

      // Create the popup boxes button
      guiPopUpImage = LoadButtonImage("LAPTOP\\VideoConfButtons.sti", -1, 2, -1, 3, -1);
      guiPopUpOkButton = CreateIconAndTextButton(guiPopUpImage, VideoConfercingText[Enum356.AIM_MEMBER_OK], FONT14ARIAL(), AIM_POPUP_BOX_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, AIM_POPUP_BOX_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, TEXT_CJUSTIFIED, (usPosX + AIM_POPUP_BOX_BUTTON_OFFSET_X), (usPosY + AIM_POPUP_BOX_BUTTON_OFFSET_Y), BUTTON_TOGGLE, MSYS_PRIORITY_HIGH + 5, DEFAULT_MOVE_CALLBACK(), BtnPopUpOkButtonCallback);
      SetButtonCursor(guiPopUpOkButton, Enum317.CURSOR_LAPTOP_SCREEN);
      MSYS_SetBtnUserData(guiPopUpOkButton, 0, ubData);

      fPopUpBoxActive = true;
      gubPopUpBoxAction = Enum66.AIM_POPUP_DISPLAY;

      // Disable the current video conference buttons
      // EnableDisableCurrentVideoConferenceButtons(TRUE);
      if (gubVideoConferencingPreviousMode == Enum65.AIM_VIDEO_HIRE_MERC_MODE) {
        // Enable the current video conference buttons
        EnableDisableCurrentVideoConferenceButtons(false);
      }

      //
      //	Create a new flag for the PostButtonRendering function
      //
      fReDrawPostButtonRender = true;
    } break;

    case Enum66.AIM_POPUP_DISPLAY: {
      let hPopupBoxHandle: HVOBJECT;
      let usTempPosY: UINT16 = usPopUpBoxPosY;

      if (gubPopUpBoxAction != Enum66.AIM_POPUP_DISPLAY)
        return false;

      // load and display the popup box graphic
      GetVideoObject(addressof(hPopupBoxHandle), guiPopUpBox);
      BltVideoObject(FRAME_BUFFER, hPopupBoxHandle, 0, usPopUpBoxPosX, usPopUpBoxPosY, VO_BLT_SRCTRANSPARENCY, null);

      SetFontShadow(AIM_M_VIDEO_NAME_SHADOWCOLOR);

      usTempPosY += AIM_POPUP_BOX_STRING1_Y;
      if (sPopUpString1[0] != '\0')
        usTempPosY += DisplayWrappedString(usPopUpBoxPosX, usTempPosY, AIM_POPUP_BOX_WIDTH, 2, AIM_POPUP_BOX_FONT(), AIM_POPUP_BOX_COLOR, sPopUpString1, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
      if (sPopUpString2[0] != '\0')
        DisplayWrappedString(usPopUpBoxPosX, (usTempPosY + 4), AIM_POPUP_BOX_WIDTH, 2, AIM_POPUP_BOX_FONT(), AIM_POPUP_BOX_COLOR, sPopUpString2, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

      SetFontShadow(DEFAULT_SHADOW);

      InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
    } break;

    case Enum66.AIM_POPUP_DELETE: {
      if (!fPopUpBoxActive)
        return false;

      // Disable the 'X' to close the pop upi video
      EnableButton(giXToCloseVideoConfButton);

      UnloadButtonImage(guiPopUpImage);
      RemoveButton(guiPopUpOkButton);
      DeleteVideoObjectFromIndex(guiPopUpBox);

      fPopUpBoxActive = false;
      gubPopUpBoxAction = Enum66.AIM_POPUP_NOTHING;

      if (gubVideoConferencingPreviousMode == Enum65.AIM_VIDEO_HIRE_MERC_MODE) {
        // Enable the current video conference buttons
        EnableDisableCurrentVideoConferenceButtons(false);
      } else if (gubVideoConferencingPreviousMode == Enum65.AIM_VIDEO_MERC_ANSWERING_MACHINE_MODE) {
        EnableButton(giAnsweringMachineButton[1]);
      }
    } break;
  }

  return true;
}

function BtnPopUpOkButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  /* static */ let fInCallback: boolean = true;

  if (fInCallback) {
    if (!(btn.value.uiFlags & BUTTON_ENABLED))
      return;

    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      let ubCurPageNum: UINT8 = MSYS_GetBtnUserData(btn, 0);

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
      fInCallback = false;

      //			gfStopMercFromTalking = TRUE;

      gubPopUpBoxAction = Enum66.AIM_POPUP_DELETE;

      if (gubVideoConferencingMode != Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE) {
        if (ubCurPageNum == AIM_POPUP_BOX_SUCCESS) {
          gubVideoConferencingMode = Enum65.AIM_VIDEO_HIRE_MERC_MODE;
          WaitForMercToFinishTalkingOrUserToClick();
        }
        //				gubVideoConferencingMode = AIM_VIDEO_POPDOWN_MODE;
        else
          gubVideoConferencingMode = Enum65.AIM_VIDEO_HIRE_MERC_MODE;
      }

      fInCallback = true;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
}

// we first contact merc.  We either go to hire him or cancel the call
function BtnFirstContactButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let ubRetValue: UINT8 = MSYS_GetBtnUserData(btn, 0);

      //			gfStopMercFromTalking = TRUE;
      StopMercTalking();

      gfAimMemberCanMercSayOpeningQuote = false;

      if (ubRetValue == 0) {
        if (CanMercBeHired()) {
          gubVideoConferencingMode = Enum65.AIM_VIDEO_HIRE_MERC_MODE;
        }
      } else {
        gubVideoConferencingMode = Enum65.AIM_VIDEO_POPDOWN_MODE;
      }

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnAnsweringMachineButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let ubRetValue: UINT8 = MSYS_GetBtnUserData(btn, 0);

      if (ubRetValue == 0) {
        // Set a flag indicating that the merc has a message
        gMercProfiles[gbCurrentSoldier].ubMiscFlags3 |= PROFILE_MISC_FLAG3_PLAYER_LEFT_MSG_FOR_MERC_AT_AIM;
        WaitForMercToFinishTalkingOrUserToClick();

        // Display a message box displaying a messsage that the message was recorded
        //				DoLapTopMessageBox( 10, AimPopUpText[ AIM_MEMBER_MESSAGE_RECORDED ], LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL );
        InitCreateDeleteAimPopUpBox(Enum66.AIM_POPUP_CREATE, " ", AimPopUpText[Enum357.AIM_MEMBER_MESSAGE_RECORDED], AIM_POPUP_BOX_X, AIM_POPUP_BOX_Y, AIM_POPUP_BOX_SUCCESS);

        SpecifyDisabledButtonStyle(giAnsweringMachineButton[1], Enum29.DISABLED_STYLE_NONE);
        DisableButton(giAnsweringMachineButton[1]);
        DisableButton(giAnsweringMachineButton[0]);
      } else {
        gubVideoConferencingMode = Enum65.AIM_VIDEO_POPDOWN_MODE;
        //				gubVideoConferencingMode = AIM_VIDEO_NOT_DISPLAYED_MODE;
      }

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnHangUpButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(CONTACT_X, CONTACT_BOX_Y, CONTACT_BR_X, CONTACT_BR_Y);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      //			gubVideoConferencingMode = AIM_VIDEO_NOT_DISPLAYED_MODE;
      gubVideoConferencingMode = Enum65.AIM_VIDEO_POPDOWN_MODE;

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      InvalidateRegion(CONTACT_X, CONTACT_BOX_Y, CONTACT_BR_X, CONTACT_BR_Y);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(CONTACT_X, CONTACT_BOX_Y, CONTACT_BR_X, CONTACT_BR_Y);
  }
}

// InitVideoFace() is called once to initialize things
function InitVideoFace(ubMercID: UINT8): boolean {
  // Create the facial index
  giMercFaceIndex = InitFace(ubMercID, NOBODY, 0);

  SetAutoFaceActive(guiVideoFaceBackground, FACE_AUTO_RESTORE_BUFFER, giMercFaceIndex, 0, 0);

  RenderAutoFace(giMercFaceIndex);

  gubCurrentStaticMode = Enum67.VC_NO_STATIC;

  gfVideoFaceActive = true;

  guiMercAttitudeTime = GetJA2Clock();

  return true;
}

// InitVideoFaceTalking() is called to start a merc speaking a particular message
function InitVideoFaceTalking(ubMercID: UINT8, usQuoteNum: UINT16): boolean {
  // Starts the merc talking
  if (!CharacterDialogue(ubMercID, usQuoteNum, giMercFaceIndex, DIALOGUE_CONTACTPAGE_UI, false, false)) {
    return false;
  }

  // Enables it so if a player clicks, he will shutup the merc
  MSYS_EnableRegion(addressof(gSelectedShutUpMercRegion));

  gfIsShutUpMouseRegionActive = true;
  gfMercIsTalking = true;
  guiTimeThatMercStartedTalking = GetJA2Clock();
  return true;
}

function DisplayTalkingMercFaceForVideoPopUp(iFaceIndex: INT32): boolean {
  /* static */ let fWasTheMercTalking: boolean = false;
  let fIsTheMercTalking: boolean;
  let SrcRect: SGPRect;
  let DestRect: SGPRect;

  // Test
  SrcRect.iLeft = 0;
  SrcRect.iTop = 0;
  SrcRect.iRight = 48;
  SrcRect.iBottom = 43;

  DestRect.iLeft = AIM_MEMBER_VIDEO_FACE_X;
  DestRect.iTop = AIM_MEMBER_VIDEO_FACE_Y;
  DestRect.iRight = DestRect.iLeft + AIM_MEMBER_VIDEO_FACE_WIDTH;
  DestRect.iBottom = DestRect.iTop + AIM_MEMBER_VIDEO_FACE_HEIGHT;

  // If the answering machine graphics is up, dont handle the faces
  if (gfIsAnsweringMachineActive) {
    gFacesData[giMercFaceIndex].fInvalidAnim = true;
  }

  HandleDialogue();
  HandleAutoFaces();
  HandleTalkingAutoFaces();

  // If the answering machine is up, dont display the face
  //	if( !gfIsAnsweringMachineActive )
  {
    // Blt the face surface to the video background surface
    if (!BltStretchVideoSurface(FRAME_BUFFER, guiVideoFaceBackground, 0, 0, VO_BLT_SRCTRANSPARENCY, addressof(SrcRect), addressof(DestRect)))
      return false;

    // if the merc is not at home and the players is leaving a message, shade the players face
    if (gfIsAnsweringMachineActive)
      ShadowVideoSurfaceRect(FRAME_BUFFER, DestRect.iLeft, DestRect.iTop, DestRect.iRight - 1, DestRect.iBottom - 1);

    // If the answering machine graphics is up, place a message on the screen
    if (gfIsAnsweringMachineActive) {
      // display a message over the mercs face
      DisplayWrappedString(AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y + 20, AIM_MEMBER_VIDEO_FACE_WIDTH, 2, FONT14ARIAL(), 145, AimPopUpText[Enum357.AIM_MEMBER_PRERECORDED_MESSAGE], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
    }

    InvalidateRegion(AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X + AIM_MEMBER_VIDEO_FACE_WIDTH, AIM_MEMBER_VIDEO_FACE_Y + AIM_MEMBER_VIDEO_FACE_HEIGHT);
  }

  fIsTheMercTalking = gFacesData[iFaceIndex].fTalking;

  // if the merc is talking, reset their attitude time
  if (fIsTheMercTalking) {
    // def added 3/18/99
    guiMercAttitudeTime = GetJA2Clock();
  }

  // if the text the merc is saying is really short, extend the time that it is on the screen
  if ((GetJA2Clock() - guiTimeThatMercStartedTalking) > usAimMercSpeechDuration) {
    // if the merc just stopped talking
    if (fWasTheMercTalking && !fIsTheMercTalking) {
      fWasTheMercTalking = false;

      gfRedrawScreen = true;
      guiMercAttitudeTime = GetJA2Clock();

      StopMercTalking();
    }
  } else if (fIsTheMercTalking) {
    fWasTheMercTalking = fIsTheMercTalking;
  }

  return fIsTheMercTalking;
}

export function DisplayTextForMercFaceVideoPopUp(pString: STR16): void {
  swprintf(gsTalkingMercText, "\"%s\"", pString);

  // Set the minimum time for the dialogue text to be present
  usAimMercSpeechDuration = wcslen(gsTalkingMercText) * AIM_TEXT_SPEECH_MODIFIER;

  if (usAimMercSpeechDuration < MINIMUM_TALKING_TIME_FOR_MERC)
    usAimMercSpeechDuration = MINIMUM_TALKING_TIME_FOR_MERC;

  gfRedrawScreen = true;
}

function SelectShutUpMercRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let fInCallBack: boolean = true;

  if (fInCallBack) {
    if (iReason & MSYS_CALLBACK_REASON_INIT) {
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
      gfStopMercFromTalking = true;
    } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      fInCallBack = false;

      gfStopMercFromTalking = true;
      fInCallBack = true;
    }
  }
}

function WillMercAcceptCall(): UINT8 {
  // if merc has hung up on the player twice within a period of time (MERC_ANNOYED_WONT_CONTACT_TIME_MINUTES )the merc cant ber hired
  if (gMercProfiles[gbCurrentSoldier].bMercStatus == MERC_ANNOYED_WONT_CONTACT) {
    return Enum65.AIM_VIDEO_MERC_UNAVAILABLE_MODE;
  }

  // if the merc is currently on contract, the answering machine will pick up.
  if ((gMercProfiles[gbCurrentSoldier].bMercStatus > 0) || (gMercProfiles[gbCurrentSoldier].bMercStatus == MERC_HAS_NO_TEXT_FILE) || (gMercProfiles[gbCurrentSoldier].bMercStatus == MERC_HIRED_BUT_NOT_ARRIVED_YET)) {
    return Enum65.AIM_VIDEO_MERC_ANSWERING_MACHINE_MODE;
  }

  // if the merc is at home, or if the merc is only slightly annoyed at the player,  he will greet the player
  if (IsMercHireable(gbCurrentSoldier)) {
    return Enum65.AIM_VIDEO_FIRST_CONTACT_MERC_MODE;
  } else
    return Enum65.AIM_VIDEO_MERC_ANSWERING_MACHINE_MODE;
}

function CanMercBeHired(): boolean {
  let i: UINT8;
  let j: UINT8;
  let bMercID: INT8;
  let fRetVal: boolean = false;
  let fBuddyOnTeam: boolean = false;

  StopMercTalking();

  // if the merc recently came back with poor morale, and hasn't gotten over it yet
  if (gMercProfiles[gbCurrentSoldier].ubDaysOfMoraleHangover > 0) {
    // then he refuses with a lame excuse.  Buddy or no buddy.
    WaitForMercToFinishTalkingOrUserToClick();
    InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_LAME_REFUSAL);
    return false;
  }

  // loop through the list of people the merc hates
  for (i = 0; i < NUMBER_HATED_MERCS_ONTEAM; i++) {
    // see if someone the merc hates is on the team
    bMercID = gMercProfiles[gbCurrentSoldier].bHated[i];

    if (bMercID < 0)
      continue;

    // if the hated merc is dead
    if (IsMercDead(bMercID)) {
      // ignore the merc
      continue;
    }

    if (IsMercOnTeamAndInOmertaAlready(bMercID)) {
      // if the merc hates someone on the team, see if a buddy is on the team
      for (j = 0; j < NUMBER_HATED_MERCS_ONTEAM; j++) {
        // if a buddy is on the team, the merc will join
        bMercID = gMercProfiles[gbCurrentSoldier].bBuddy[j];

        if (bMercID < 0)
          continue;

        if (IsMercOnTeam(bMercID) && !IsMercDead(bMercID)) {
          if (j == 0) {
            InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_JOINING_CAUSE_BUDDY_1_ON_TEAM);
          } else if (j == 1) {
            InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_JOINING_CAUSE_BUDDY_2_ON_TEAM);
          } else {
            InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_JOINING_CAUSE_LEARNED_TO_LIKE_BUDDY_ON_TEAM);
          }

          return true;
        }
      }

      // the merc doesnt like anybody on the team
      // if merc doesnt like first hated merc
      if (i == 0) {
        if (gMercProfiles[gbCurrentSoldier].bHatedTime[i] < 24) {
          WaitForMercToFinishTalkingOrUserToClick();
          InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_HATE_MERC_1_ON_TEAM);
          fRetVal = false;
        } else {
          InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_PERSONALITY_BIAS_WITH_MERC_1);
          fRetVal = true;
        }
      } else if (i == 1) {
        if (gMercProfiles[gbCurrentSoldier].bHatedTime[i] < 24) {
          WaitForMercToFinishTalkingOrUserToClick();
          InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_HATE_MERC_2_ON_TEAM);
          fRetVal = false;
        } else {
          InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_PERSONALITY_BIAS_WITH_MERC_2);
          //					DelayMercSpeech( gbCurrentSoldier, QUOTE_PERSONALITY_BIAS_WITH_MERC_2, 750, TRUE, FALSE );
          fRetVal = true;
        }
      } else {
        WaitForMercToFinishTalkingOrUserToClick();
        InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_LEARNED_TO_HATE_MERC_ON_TEAM);
        fRetVal = false;
      }

      return fRetVal;
    }
  }

  // Is a buddy working on the team
  fBuddyOnTeam = DoesMercHaveABuddyOnTheTeam(gbCurrentSoldier);

  // If the merc doesnt have a buddy on the team
  if (!fBuddyOnTeam) {
    // Check the players Death rate
    if (MercThinksDeathRateTooHigh(gbCurrentSoldier)) {
      WaitForMercToFinishTalkingOrUserToClick();
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_DEATH_RATE_REFUSAL);
      return false;
    }

    // Check the players Reputation
    if (MercThinksBadReputationTooHigh(gbCurrentSoldier)) {
      WaitForMercToFinishTalkingOrUserToClick();
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_REPUTATION_REFUSAL);
      return false;
    }
  }

  return true;
}

function DisplaySnowBackground(): boolean {
  let uiCurrentTime: UINT32 = 0;
  let hSnowHandle: HVOBJECT;
  let ubCount: UINT8;

  uiCurrentTime = GetJA2Clock();

  if (gubCurrentCount < VC_NUM_LINES_SNOW) {
    ubCount = gubCurrentCount;
  } else if (gubCurrentCount < VC_NUM_LINES_SNOW * 2) {
    ubCount = gubCurrentCount - VC_NUM_LINES_SNOW;
  } else {
    gfFirstTimeInContactScreen = false;
    gubCurrentCount = 0;
    ubCount = 0;

    if (gubVideoConferencingMode == Enum65.AIM_VIDEO_FIRST_CONTACT_MERC_MODE && gfAimMemberCanMercSayOpeningQuote)
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_GREETING);

    return true;
  }

  // if it is time to update the snow image
  if ((uiCurrentTime - guiLastHandleMercTime) > VC_CONTACT_STATIC_TIME) {
    gubCurrentCount++;
    guiLastHandleMercTime = uiCurrentTime;
  }
  // Get the snow background, and blit it
  GetVideoObject(addressof(hSnowHandle), guiBWSnow);
  BltVideoObject(FRAME_BUFFER, hSnowHandle, ubCount, AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, VO_BLT_SRCTRANSPARENCY, null);

  InvalidateRegion(AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X + AIM_MEMBER_VIDEO_FACE_WIDTH, AIM_MEMBER_VIDEO_FACE_Y + AIM_MEMBER_VIDEO_FACE_HEIGHT);

  return false;
}

function DisplayBlackBackground(ubMaxNumOfLoops: UINT8): boolean {
  let uiCurrentTime: UINT32 = 0;
  let ubCount: UINT8;

  uiCurrentTime = GetJA2Clock();

  if (gubCurrentCount < ubMaxNumOfLoops) {
    ubCount = gubCurrentCount;
  } else {
    gubCurrentCount = 0;
    return true;
  }

  // if it is time to update the snow image
  if ((uiCurrentTime - guiLastHandleMercTime) > VC_CONTACT_STATIC_TIME) {
    gubCurrentCount++;
    guiLastHandleMercTime = uiCurrentTime;
  }
  // Blit color to screen
  ColorFillVideoSurfaceArea(FRAME_BUFFER, AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X + AIM_MEMBER_VIDEO_FACE_WIDTH, AIM_MEMBER_VIDEO_FACE_Y + AIM_MEMBER_VIDEO_FACE_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));
  InvalidateRegion(AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X + AIM_MEMBER_VIDEO_FACE_WIDTH, AIM_MEMBER_VIDEO_FACE_Y + AIM_MEMBER_VIDEO_FACE_HEIGHT);

  return false;
}

function HandleVideoDistortion(): void {
  /* static */ let uiStaticNoiseSound: UINT32 = NO_SAMPLE;
  let ubOldMode: UINT8 = gubCurrentStaticMode;

  // if we are just entering the contact page, display a snowy background
  if (gfFirstTimeInContactScreen && !gfIsAnsweringMachineActive) {
    DisplaySnowBackground();

    // if it is time to start playing another sound
    if (uiStaticNoiseSound == NO_SAMPLE) {
      uiStaticNoiseSound = PlayJA2SampleFromFile("LAPTOP\\static4.wav", RATE_11025, LOWVOLUME, 1, MIDDLEPAN);
    }
  } else {
    switch (gubCurrentStaticMode) {
      case Enum67.VC_NO_STATIC: {
        /* static */ let uiCurTime: UINT32 = 0;
        let ubNum: UINT8;

        // if the sound is playing, stop it
        if (uiStaticNoiseSound != NO_SAMPLE) {
          SoundStop(uiStaticNoiseSound);
          uiStaticNoiseSound = NO_SAMPLE;
        }

        // DECIDE WHICH ONE TO BLIT NEXT
        if ((GetJA2Clock() - uiCurTime) > 2500) {
          ubNum = Random(200); // 125;

          if (ubNum < 15)
            gubCurrentStaticMode = Enum67.VC_FUZZY_LINE;

          else if (ubNum < 25)
            gubCurrentStaticMode = Enum67.VC_STRAIGHTLINE;

          else if (ubNum < 35)
            gubCurrentStaticMode = Enum67.VC_BW_SNOW;

          else if (ubNum < 40)
            gubCurrentStaticMode = Enum67.VC_PIXELATE;

          else if (ubNum < 80)
            gubCurrentStaticMode = Enum67.VC_TRANS_SNOW_OUT;

          else if (ubNum < 100)
            gubCurrentStaticMode = Enum67.VC_TRANS_SNOW_IN;

          uiCurTime = GetJA2Clock();
        }
      } break;

      case Enum67.VC_FUZZY_LINE:
        gubCurrentStaticMode = DisplayDistortionLine(Enum67.VC_FUZZY_LINE, guiFuzzLine, VC_NUM_FUZZ_LINES);

        // if it is time to start playing another sound
        if (uiStaticNoiseSound == NO_SAMPLE) {
          uiStaticNoiseSound = PlayJA2SampleFromFile("LAPTOP\\static1.wav", RATE_11025, LOWVOLUME, 1, MIDDLEPAN);
        }
        break;

      case Enum67.VC_STRAIGHTLINE:
        gubCurrentStaticMode = DisplayDistortionLine(Enum67.VC_STRAIGHTLINE, guiStraightLine, VC_NUM_STRAIGHT_LINES);

        // if it is time to start playing another sound
        if (uiStaticNoiseSound == NO_SAMPLE) {
          uiStaticNoiseSound = PlayJA2SampleFromFile("LAPTOP\\static5.wav", RATE_11025, LOWVOLUME, 1, MIDDLEPAN);
        }
        break;

      case Enum67.VC_BW_SNOW:
        gubCurrentStaticMode = DisplayDistortionLine(Enum67.VC_BW_SNOW, guiBWSnow, 5);

        // if it is time to start playing another sound
        if (uiStaticNoiseSound == NO_SAMPLE) {
          uiStaticNoiseSound = PlayJA2SampleFromFile("LAPTOP\\static6.wav", RATE_11025, LOWVOLUME, 1, MIDDLEPAN);
        }
        break;

      case Enum67.VC_PIXELATE:
        gubCurrentStaticMode = DisplayPixelatedImage(4);

        // if it is time to start playing another sound
        if (uiStaticNoiseSound == NO_SAMPLE) {
          uiStaticNoiseSound = PlayJA2SampleFromFile("LAPTOP\\static3.wav", RATE_11025, LOWVOLUME, 1, MIDDLEPAN);
        }
        break;

      case Enum67.VC_TRANS_SNOW_OUT:
        gubCurrentStaticMode = DisplayTransparentSnow(Enum67.VC_TRANS_SNOW_OUT, guiTransSnow, 7, false);

        // if it is time to start playing another sound
        if (uiStaticNoiseSound == NO_SAMPLE) {
          uiStaticNoiseSound = PlayJA2SampleFromFile("LAPTOP\\static5.wav", RATE_11025, LOWVOLUME, 1, MIDDLEPAN);
        }
        break;

      case Enum67.VC_TRANS_SNOW_IN:
        gubCurrentStaticMode = DisplayTransparentSnow(Enum67.VC_TRANS_SNOW_IN, guiTransSnow, 7, true);

        // if it is time to start playing another sound
        if (uiStaticNoiseSound == NO_SAMPLE) {
          uiStaticNoiseSound = PlayJA2SampleFromFile("LAPTOP\\static4.wav", RATE_11025, LOWVOLUME, 1, MIDDLEPAN);
        }
        break;
    }

    if (ubOldMode != gubCurrentStaticMode) {
      uiStaticNoiseSound = NO_SAMPLE;
    }
  }
}

// returns true when done. else false
function DisplayTransparentSnow(ubMode: UINT8, uiImageIdentifier: UINT32, ubMaxImages: UINT8, bForward: boolean): UINT8 {
  let hFuzzLineHandle: HVOBJECT;
  /* static */ let bCount: INT8 = 0;
  let uiCurrentTime: UINT32 = 0;
  /* static */ let uiLastTime: UINT32 = 0;

  uiCurrentTime = GetJA2Clock();

  if ((uiCurrentTime - uiLastTime) > 100) {
    if (bForward) {
      if (bCount > ubMaxImages - 1)
        bCount = 0;
      else
        bCount++;
    } else {
      if (bCount <= 0)
        bCount = ubMaxImages - 1;
      else
        bCount--;
    }
    uiLastTime = uiCurrentTime;
  }

  if (bCount >= ubMaxImages)
    bCount = ubMaxImages - 1;

  // Get the snow background, and blit it
  GetVideoObject(addressof(hFuzzLineHandle), uiImageIdentifier);
  BltVideoObject(FRAME_BUFFER, hFuzzLineHandle, bCount, AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, VO_BLT_SRCTRANSPARENCY, null);

  if (bForward) {
    if (bCount == ubMaxImages - 1) {
      bCount = 0;
      return Enum67.VC_BW_SNOW;
    } else
      return ubMode;
  } else {
    if (bCount == 0) {
      bCount = 0;
      return Enum67.VC_NO_STATIC;
    } else
      return ubMode;
  }
}

// returns true when done. else false
function DisplayDistortionLine(ubMode: UINT8, uiImageIdentifier: UINT32, ubMaxImages: UINT8): UINT8 {
  let hFuzzLineHandle: HVOBJECT;
  /* static */ let ubCount: UINT8 = 255;
  let uiCurrentTime: UINT32 = 0;
  /* static */ let uiLastTime: UINT32 = 0;

  uiCurrentTime = GetJA2Clock();

  if ((uiCurrentTime - uiLastTime) > VC_CONTACT_FUZZY_LINE_TIME) {
    if (ubCount >= ubMaxImages - 1)
      ubCount = 0;
    else
      ubCount++;
    uiLastTime = uiCurrentTime;
  }

  if (ubCount >= ubMaxImages)
    ubCount = ubMaxImages - 1;

  // Get the snow background, and blit it
  GetVideoObject(addressof(hFuzzLineHandle), uiImageIdentifier);
  BltVideoObject(FRAME_BUFFER, hFuzzLineHandle, ubCount, AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, VO_BLT_SRCTRANSPARENCY, null);

  if (ubCount == ubMaxImages - 1) {
    ubCount = 0;
    if (ubMode == Enum67.VC_BW_SNOW)
      return Enum67.VC_TRANS_SNOW_OUT;
    else
      return Enum67.VC_NO_STATIC;
  } else
    return ubMode;
}

function DisplayPixelatedImage(ubMaxImages: UINT8): UINT8 {
  /* static */ let ubCount: UINT8 = 255;
  let uiCurrentTime: UINT32 = 0;
  /* static */ let uiLastTime: UINT32 = 0;

  uiCurrentTime = GetJA2Clock();

  if ((uiCurrentTime - uiLastTime) > VC_CONTACT_FUZZY_LINE_TIME) {
    if (ubCount >= ubMaxImages - 1)
      ubCount = 0;
    else
      ubCount++;
    uiLastTime = uiCurrentTime;
  }

  //	PixelateVideoObjectRect(  FRAME_BUFFER, AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X+AIM_MEMBER_VIDEO_FACE_WIDTH-1, AIM_MEMBER_VIDEO_FACE_Y+AIM_MEMBER_VIDEO_FACE_HEIGHT-1);
  ShadowVideoSurfaceRect(FRAME_BUFFER, AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X + AIM_MEMBER_VIDEO_FACE_WIDTH - 1, AIM_MEMBER_VIDEO_FACE_Y + AIM_MEMBER_VIDEO_FACE_HEIGHT - 1);

  if (ubCount == ubMaxImages - 1) {
    ubCount = 0;
    return Enum67.VC_NO_STATIC;
  } else
    return Enum67.VC_PIXELATE;
}

function HandleMercAttitude(): void {
  let uiCurrentTime: UINT32 = 0;

  uiCurrentTime = GetJA2Clock();

  if ((gubMercAttitudeLevel <= 1 && ((uiCurrentTime - guiMercAttitudeTime) > QUOTE_FIRST_ATTITUDE_TIME)) || ((uiCurrentTime - guiMercAttitudeTime) > QUOTE_ATTITUDE_TIME)) {
    if (gubMercAttitudeLevel == QUOTE_DELAY_SMALL_TALK) {
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_SMALL_TALK);
    } else if (gubMercAttitudeLevel == QUOTE_DELAY_IMPATIENT_TALK) {
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_IMPATIENT_QUOTE);
    } else if (gubMercAttitudeLevel == QUOTE_DELAY_VERY_IMPATIENT_TALK) {
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_PRECEDENT_TO_REPEATING_ONESELF);
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_IMPATIENT_QUOTE);
    } else if (gubMercAttitudeLevel == QUOTE_DELAY_HANGUP_TALK) {
      let uiResetTime: UINT32;
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_COMMENT_BEFORE_HANG_UP);

      // if the merc is going to hang up disable the buttons, so user cant press any buttons
      //			EnableDisableCurrentVideoConferenceButtons( FALSE);
      if (gubVideoConferencingPreviousMode == Enum65.AIM_VIDEO_HIRE_MERC_MODE) {
        // Enable the current video conference buttons
        EnableDisableCurrentVideoConferenceButtons(false);
      }

      // increments the merc 'annoyance' at the player
      if (gMercProfiles[gbCurrentSoldier].bMercStatus == 0)
        gMercProfiles[gbCurrentSoldier].bMercStatus = MERC_ANNOYED_BUT_CAN_STILL_CONTACT;
      else if (gMercProfiles[gbCurrentSoldier].bMercStatus == MERC_ANNOYED_BUT_CAN_STILL_CONTACT)
        gMercProfiles[gbCurrentSoldier].bMercStatus = MERC_ANNOYED_WONT_CONTACT;

      // add an event so we can reset the 'annoyance factor'
      uiResetTime = (Random(600));
      uiResetTime += GetWorldTotalMin() + MERC_ANNOYED_WONT_CONTACT_TIME_MINUTES;
      AddStrategicEvent(Enum132.EVENT_AIM_RESET_MERC_ANNOYANCE, uiResetTime, gbCurrentSoldier);

      gfHangUpMerc = true;
    }

    if (gubMercAttitudeLevel == QUOTE_MERC_BUSY) {
      InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_LAME_REFUSAL);
      gfHangUpMerc = true;
    } else if (gubMercAttitudeLevel != QUOTE_DELAY_NO_ACTION)
      gubMercAttitudeLevel++;

    guiMercAttitudeTime = GetJA2Clock();
  }
}

function StopMercTalking(): void {
  if (gfIsShutUpMouseRegionActive) {
    MSYS_DisableRegion(addressof(gSelectedShutUpMercRegion));

    ShutupaYoFace(giMercFaceIndex);
    gfMercIsTalking = false;
    guiMercAttitudeTime = GetJA2Clock();
    gfIsShutUpMouseRegionActive = false;
    gfRedrawScreen = true;
  }
}

function BtnXToCloseVideoConfButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      gubVideoConferencingMode = Enum65.AIM_VIDEO_POPDOWN_MODE;
      //			gubVideoConferencingMode = AIM_VIDEO_NOT_DISPLAYED_MODE;
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
}

function InitDeleteVideoConferencePopUp(): boolean {
  /* static */ let fXRegionActive: boolean = false;
  /* static */ let fVideoConferenceCreated: boolean = false;
  let i: UINT8;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let VObjectDesc: VOBJECT_DESC;
  let vs_desc: VSURFACE_DESC;

  // remove the face help text
  gfAimMemberDisplayFaceHelpText = false;

  // Gets reset to FALSE in the HandleCurrentVideoConfMode() function
  gfJustSwitchedVideoConferenceMode = true;

  // remove old mode
  DeleteVideoConfPopUp();

  // reset ( in case merc was going to say something
  DelayMercSpeech(0, 0, 0, false, true);

  // if the video conferencing is currently displayed, put the 'x' to close it in the top right corner
  // and disable the ability to click on the BIG face to go to different screen
  if ((gubVideoConferencingMode != Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE) && (gubVideoConferencingMode != Enum65.AIM_VIDEO_POPUP_MODE)) {
    if (!fXRegionActive) {
      giXToCloseVideoConfButton = QuickCreateButton(giXToCloseVideoConfButtonImage, AIM_MEMBER_VIDEO_CONF_XCLOSE_X, AIM_MEMBER_VIDEO_CONF_XCLOSE_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnXToCloseVideoConfButtonCallback);
      SetButtonCursor(giXToCloseVideoConfButton, Enum317.CURSOR_LAPTOP_SCREEN);
      SpecifyDisabledButtonStyle(giXToCloseVideoConfButton, Enum29.DISABLED_STYLE_NONE);
      fXRegionActive = true;

      MSYS_DisableRegion(addressof(gSelectedFaceRegion));
    }
  }

  // The video conference is not displayed
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE) {
    gubVideoConferencingPreviousMode = gubVideoConferencingMode;
    gfRedrawScreen = true;

    if (gfVideoFaceActive) {
      StopMercTalking();

      // Get rid of the talking face
      DeleteFace(giMercFaceIndex);
    }

    // if the ansering machine is currently on, turn it off
    if (gfIsAnsweringMachineActive)
      gfIsAnsweringMachineActive = false;

    gfVideoFaceActive = false;

    if (fXRegionActive) {
      RemoveButton(giXToCloseVideoConfButton);
      fXRegionActive = false;
    }

    MSYS_DisableRegion(addressof(gSelectedShutUpMercRegion));

    // Enable the ability to click on the BIG face to go to different screen
    MSYS_EnableRegion(addressof(gSelectedFaceRegion));

    //		EnableDisableCurrentVideoConferenceButtons(FALSE);
    if (gubVideoConferencingPreviousMode == Enum65.AIM_VIDEO_HIRE_MERC_MODE) {
      // Enable the current video conference buttons
      EnableDisableCurrentVideoConferenceButtons(false);
    }

    fVideoConferenceCreated = false;

    fNewMailFlag = gfIsNewMailFlagSet;
    gfIsNewMailFlagSet = false;
  }

  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_POPUP_MODE) {
    gubVideoConferencingPreviousMode = gubVideoConferencingMode;

    if (gfJustSwitchedVideoConferenceMode) {
      let uiVideoBackgroundGraphic: UINT32;
      let hImageHandle: HVOBJECT;

      // load the answering machine graphic and add it
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      FilenameForBPP("LAPTOP\\VideoTitleBar.sti", VObjectDesc.ImageFile);
      CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiVideoBackgroundGraphic)));

      // Create a background video surface to blt the face onto
      vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
      vs_desc.usWidth = AIM_MEMBER_VIDEO_TITLE_BAR_WIDTH;
      vs_desc.usHeight = AIM_MEMBER_VIDEO_TITLE_BAR_HEIGHT;
      vs_desc.ubBitDepth = 16;
      CHECKF(AddVideoSurface(addressof(vs_desc), addressof(guiVideoTitleBar)));

      gfAimMemberCanMercSayOpeningQuote = true;

      GetVideoObject(addressof(hImageHandle), uiVideoBackgroundGraphic);
      BltVideoObject(guiVideoTitleBar, hImageHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);

      DeleteVideoObjectFromIndex(uiVideoBackgroundGraphic);
    }
  }

  // The opening animation of the vc (fuzzy screen, then goes to black)
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_INIT_MODE) {
    gubVideoConferencingPreviousMode = gubVideoConferencingMode;
    gubMercAttitudeLevel = 0;
    gubContractLength = AIM_CONTRACT_LENGTH_ONE_WEEK;

    if (gMercProfiles[gbCurrentSoldier].usOptionalGearCost == 0)
      gfBuyEquipment = false;
    else
      gfBuyEquipment = true;

    gfMercIsTalking = false;
    gfVideoFaceActive = false;
    guiLastHandleMercTime = 0;
    gfHangUpMerc = false;

    fVideoConferenceCreated = true;
  }

  // The screen in which you first contact the merc, you have the option to hang up or goto hire merc screen
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_FIRST_CONTACT_MERC_MODE) {
    // if the last screen was the init screen, then we need to initialize the video face
    if ((gubVideoConferencingPreviousMode == Enum65.AIM_VIDEO_INIT_MODE) || (gubVideoConferencingPreviousMode == Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE)) {
      // Put the merc face up on the screen
      InitVideoFace(gbCurrentSoldier);

      //			if( gubVideoConferencingPreviousMode == AIM_VIDEO_INIT_MODE)
      //				InitVideoFaceTalking(gbCurrentSoldier, QUOTE_GREETING);
    }

    gubVideoConferencingPreviousMode = gubVideoConferencingMode;

    // Hang up button
    usPosX = AIM_MEMBER_AUTHORIZE_PAY_X;
    guiVideoConferenceButtonImage[2] = LoadButtonImage("LAPTOP\\VideoConfButtons.sti", -1, 2, -1, 3, -1);
    for (i = 0; i < 2; i++) {
      giAuthorizeButton[i] = CreateIconAndTextButton(guiVideoConferenceButtonImage[2], VideoConfercingText[i + Enum356.AIM_MEMBER_HIRE], FONT12ARIAL(), AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, TEXT_CJUSTIFIED, usPosX, AIM_MEMBER_HANG_UP_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnFirstContactButtonCallback);

      MSYS_SetBtnUserData(giAuthorizeButton[i], 0, i);
      SetButtonCursor(giAuthorizeButton[i], Enum317.CURSOR_LAPTOP_SCREEN);
      usPosX += AIM_MEMBER_AUTHORIZE_PAY_GAP;
    }

    if (gfWaitingForMercToStopTalkingOrUserToClick) {
      DisableButton(giAuthorizeButton[0]);
      gfWaitingForMercToStopTalkingOrUserToClick = false;

      // Display a popup msg box telling the user when and where the merc will arrive
      //			DisplayPopUpBoxExplainingMercArrivalLocationAndTime( giIdOfLastHiredMerc );
      giIdOfLastHiredMerc = -1;
    }
  }

  // The screen in which you set the contract length, and the ability to buy equipment..
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_HIRE_MERC_MODE) {
    gubVideoConferencingPreviousMode = gubVideoConferencingMode;

    // Contract Length button
    guiVideoConferenceButtonImage[0] = LoadButtonImage("LAPTOP\\VideoConfButtons.sti", -1, 0, -1, 1, -1);
    usPosY = AIM_MEMBER_BUY_CONTRACT_LENGTH_Y;
    for (i = 0; i < 3; i++) {
      giContractLengthButton[i] = CreateIconAndTextButton(guiVideoConferenceButtonImage[0], VideoConfercingText[i + Enum356.AIM_MEMBER_ONE_DAY], FONT12ARIAL(), AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, TEXT_LJUSTIFIED, AIM_MEMBER_BUY_CONTRACT_LENGTH_X, usPosY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnContractLengthButtonCallback);

      SetButtonCursor(giContractLengthButton[i], Enum317.CURSOR_LAPTOP_SCREEN);
      MSYS_SetBtnUserData(giContractLengthButton[i], 0, i);
      SpecifyDisabledButtonStyle(giContractLengthButton[i], Enum29.DISABLED_STYLE_NONE);
      usPosY += AIM_MEMBER_BUY_EQUIPMENT_GAP;
    }

    // BuyEquipment button
    usPosY = AIM_MEMBER_BUY_CONTRACT_LENGTH_Y;
    for (i = 0; i < 2; i++) {
      giBuyEquipmentButton[i] = CreateIconAndTextButton(guiVideoConferenceButtonImage[0], VideoConfercingText[i + Enum356.AIM_MEMBER_NO_EQUIPMENT], FONT12ARIAL(), AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, TEXT_LJUSTIFIED, AIM_MEMBER_BUY_EQUIPMENT_X, usPosY, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnBuyEquipmentButtonCallback);

      SetButtonCursor(giBuyEquipmentButton[i], Enum317.CURSOR_LAPTOP_SCREEN);
      MSYS_SetBtnUserData(giBuyEquipmentButton[i], 0, i);
      SpecifyDisabledButtonStyle(giBuyEquipmentButton[i], Enum29.DISABLED_STYLE_SHADED);
      usPosY += AIM_MEMBER_BUY_EQUIPMENT_GAP;
    }
    if (gMercProfiles[gbCurrentSoldier].usOptionalGearCost == 0)
      DisableButton(giBuyEquipmentButton[1]);

    // Authorize button
    usPosX = AIM_MEMBER_AUTHORIZE_PAY_X;
    guiVideoConferenceButtonImage[1] = LoadButtonImage("LAPTOP\\VideoConfButtons.sti", -1, 2, -1, 3, -1);
    for (i = 0; i < 2; i++) {
      giAuthorizeButton[i] = CreateIconAndTextButton(guiVideoConferenceButtonImage[1], VideoConfercingText[i + Enum356.AIM_MEMBER_TRANSFER_FUNDS], FONT12ARIAL(), AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, TEXT_CJUSTIFIED, usPosX, AIM_MEMBER_AUTHORIZE_PAY_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnAuthorizeButtonCallback);

      SetButtonCursor(giAuthorizeButton[i], Enum317.CURSOR_LAPTOP_SCREEN);
      MSYS_SetBtnUserData(giAuthorizeButton[i], 0, i);
      SpecifyDisabledButtonStyle(giAuthorizeButton[i], Enum29.DISABLED_STYLE_NONE);
      usPosX += AIM_MEMBER_AUTHORIZE_PAY_GAP;
    }

    //		InitVideoFaceTalking(gbCurrentSoldier, QUOTE_LENGTH_OF_CONTRACT);
    DelayMercSpeech(gbCurrentSoldier, Enum202.QUOTE_LENGTH_OF_CONTRACT, 750, true, false);
  }

  // The merc is not home and the player gets the answering machine
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_MERC_ANSWERING_MACHINE_MODE) {
    gubVideoConferencingPreviousMode = gubVideoConferencingMode;

    gfIsAnsweringMachineActive = true;

    // Leave msg button
    usPosX = AIM_MEMBER_AUTHORIZE_PAY_X;
    guiVideoConferenceButtonImage[2] = LoadButtonImage("LAPTOP\\VideoConfButtons.sti", -1, 2, -1, 3, -1);

    giAnsweringMachineButton[0] = CreateIconAndTextButton(guiVideoConferenceButtonImage[2], VideoConfercingText[Enum356.AIM_MEMBER_LEAVE_MESSAGE], FONT12ARIAL(), AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, TEXT_CJUSTIFIED, usPosX, AIM_MEMBER_HANG_UP_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnAnsweringMachineButtonCallback);
    MSYS_SetBtnUserData(giAnsweringMachineButton[0], 0, 0);
    SetButtonCursor(giAnsweringMachineButton[0], Enum317.CURSOR_LAPTOP_SCREEN);

    // if the user has already left a message, disable the button
    if (gMercProfiles[gbCurrentSoldier].ubMiscFlags3 & PROFILE_MISC_FLAG3_PLAYER_LEFT_MSG_FOR_MERC_AT_AIM)
      DisableButton(giAnsweringMachineButton[0]);

    usPosX += AIM_MEMBER_AUTHORIZE_PAY_GAP;

    giAnsweringMachineButton[1] = CreateIconAndTextButton(guiVideoConferenceButtonImage[2], VideoConfercingText[Enum356.AIM_MEMBER_HANG_UP], FONT12ARIAL(), AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, TEXT_CJUSTIFIED, usPosX, AIM_MEMBER_HANG_UP_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnAnsweringMachineButtonCallback);

    MSYS_SetBtnUserData(giAnsweringMachineButton[1], 0, 1);
    SetButtonCursor(giAnsweringMachineButton[1], Enum317.CURSOR_LAPTOP_SCREEN);

    // The face must be inited even though the face wont appear.  It is so the voice is played
    InitVideoFace(gbCurrentSoldier);

    // Make sure the merc doesnt ramble away to the player
    gubMercAttitudeLevel = QUOTE_DELAY_NO_ACTION;

    //
    // DEF: TEST
    //
    /*		// load the answering machine graphic and add it
                    VObjectDesc.fCreateFlags=VOBJECT_CREATE_FROMFILE;
                    FilenameForBPP("LAPTOP\\explosion.sti", VObjectDesc.ImageFile);
                    CHECKF(AddVideoObject(&VObjectDesc, &guiAnsweringMachineImage));
    */
    gubCurrentStaticMode = Enum67.VC_NO_STATIC;
  }

  // The merc is home but for some reason doesnt want to work for player
  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_MERC_UNAVAILABLE_MODE) {
    gubVideoConferencingPreviousMode = gubVideoConferencingMode;

    // The hangup button
    guiVideoConferenceButtonImage[2] = LoadButtonImage("LAPTOP\\VideoConfButtons.sti", -1, 2, -1, 3, -1);

    giHangUpButton = CreateIconAndTextButton(guiVideoConferenceButtonImage[2], VideoConfercingText[Enum356.AIM_MEMBER_HANG_UP], FONT12ARIAL(), AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, AIM_M_VIDEO_NAME_COLOR, AIM_M_VIDEO_NAME_SHADOWCOLOR, TEXT_CJUSTIFIED, AIM_MEMBER_HANG_UP_X, AIM_MEMBER_HANG_UP_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnHangUpButtonCallback);

    MSYS_SetBtnUserData(giHangUpButton, 0, 1);
    SetButtonCursor(giHangUpButton, Enum317.CURSOR_LAPTOP_SCREEN);

    // set the flag saying specifying that merc is busy
    gubMercAttitudeLevel = QUOTE_MERC_BUSY;

    InitVideoFace(gbCurrentSoldier);
  }

  if (gubVideoConferencingMode == Enum65.AIM_VIDEO_POPDOWN_MODE) {
    let uiVideoBackgroundGraphic: UINT32;
    let hImageHandle: HVOBJECT;

    if (gubPopUpBoxAction == Enum66.AIM_POPUP_DISPLAY) {
      return true;
    }

    gubVideoConferencingPreviousMode = gubVideoConferencingMode;

    gfIsAnsweringMachineActive = false;

    // load the Video conference background graphic and add it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    FilenameForBPP("LAPTOP\\VideoTitleBar.sti", VObjectDesc.ImageFile);
    CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiVideoBackgroundGraphic)));

    // Create a background video surface to blt the face onto
    vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
    vs_desc.usWidth = AIM_MEMBER_VIDEO_TITLE_BAR_WIDTH;
    vs_desc.usHeight = AIM_MEMBER_VIDEO_TITLE_BAR_HEIGHT;
    vs_desc.ubBitDepth = 16;
    CHECKF(AddVideoSurface(addressof(vs_desc), addressof(guiVideoTitleBar)));

    GetVideoObject(addressof(hImageHandle), uiVideoBackgroundGraphic);
    BltVideoObject(guiVideoTitleBar, hImageHandle, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);

    DeleteVideoObjectFromIndex(uiVideoBackgroundGraphic);
  }

  //	gfWaitingForMercToStopTalkingOrUserToClick = FALSE;

  // reset the time in which the merc will get annoyed
  guiMercAttitudeTime = GetJA2Clock();
  return true;
}

function DeleteVideoConfPopUp(): boolean {
  let i: UINT16;

  // reset ( in case merc was going to say something
  DelayMercSpeech(0, 0, 0, false, true);

  switch (gubVideoConferencingPreviousMode) {
    // The video conference is not displayed
    case Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE: {
      break;
    }

    case Enum65.AIM_VIDEO_POPUP_MODE: {
      DeleteVideoSurfaceFromIndex(guiVideoTitleBar);
      break;
    }

    // The opening animation of the vc (fuzzy screen, then goes to black)
    case Enum65.AIM_VIDEO_INIT_MODE: {
      break;
    }

    // The screen in which you first contact the merc, you have the option to hang up or goto hire merc screen
    case Enum65.AIM_VIDEO_FIRST_CONTACT_MERC_MODE: {
      // Remove the video conf buttons images
      UnloadButtonImage(guiVideoConferenceButtonImage[2]);

      // Remove the Hangup  buttons
      for (i = 0; i < 2; i++)
        RemoveButton(giAuthorizeButton[i]);

      break;
    }

    // The screen in which you set the contract length, and the ability to buy equipment..
    case Enum65.AIM_VIDEO_HIRE_MERC_MODE: {
      // Remove the video conf buttons images
      for (i = 0; i < 2; i++)
        UnloadButtonImage(guiVideoConferenceButtonImage[i]);

      // Remove the Contracy Length button
      for (i = 0; i < 3; i++)
        RemoveButton(giContractLengthButton[i]);

      for (i = 0; i < 2; i++)
        RemoveButton(giBuyEquipmentButton[i]);

      for (i = 0; i < 2; i++)
        RemoveButton(giAuthorizeButton[i]);

      break;
    }

    // The merc is not home and the player gets the answering machine
    case Enum65.AIM_VIDEO_MERC_ANSWERING_MACHINE_MODE: {
      if (gubPopUpBoxAction == Enum66.AIM_POPUP_DISPLAY) {
        //				return( TRUE );
      }

      // Remove the video conf buttons images
      UnloadButtonImage(guiVideoConferenceButtonImage[2]);

      // Remove the Answering machine buttons
      for (i = 0; i < 2; i++)
        RemoveButton(giAnsweringMachineButton[i]);

      //			DeleteVideoObjectFromIndex(guiAnsweringMachineImage);
      break;
    }

    // The merc is home but doesnt want to work for player
    case Enum65.AIM_VIDEO_MERC_UNAVAILABLE_MODE: {
      RemoveButton(giHangUpButton);
      UnloadButtonImage(guiVideoConferenceButtonImage[2]);
      break;
    }

    case Enum65.AIM_VIDEO_POPDOWN_MODE: {
      if (gubPopUpBoxAction == Enum66.AIM_POPUP_DISPLAY) {
        return true;
      }

      if (gfWaitingForMercToStopTalkingOrUserToClick) {
        gfWaitingForMercToStopTalkingOrUserToClick = false;

        //				DisplayPopUpBoxExplainingMercArrivalLocationAndTime( giIdOfLastHiredMerc );
      }

      gfWaitingForMercToStopTalkingOrUserToClick = false;
      DeleteVideoSurfaceFromIndex(guiVideoTitleBar);
      break;
    }
  }
  return true;
}

function HandleCurrentVideoConfMode(): boolean {
  switch (gubVideoConferencingMode) {
    // The video conference is not displayed
    case Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE: {
      gfWaitingForMercToStopTalkingOrUserToClick = false;

      break;
    }

    case Enum65.AIM_VIDEO_POPUP_MODE: {
      let ubDone: boolean;

      if (gfJustSwitchedVideoConferenceMode)
        ubDone = DisplayMovingTitleBar(true, true);
      else
        ubDone = DisplayMovingTitleBar(true, false);

      if (ubDone)
        gubVideoConferencingMode = Enum65.AIM_VIDEO_INIT_MODE;

      break;
    }

    // The opening animation of the vc (fuzzy screen, then goes to black)
    case Enum65.AIM_VIDEO_INIT_MODE: {
      /* static */ let ubCurMode: UINT8 = 0;
      let fDone: boolean;

      if (ubCurMode == 0) {
        fDone = DisplayBlackBackground(10);
        if (fDone)
          ubCurMode = 1;
      } else
        fDone = DisplaySnowBackground();

      if (fDone && ubCurMode) {
        ubCurMode = 0;

        gubVideoConferencingMode = WillMercAcceptCall();
      }

      break;
    }

    // The screen in which you first contact the merc, you have the option to hang up or goto hire merc screen
    case Enum65.AIM_VIDEO_FIRST_CONTACT_MERC_MODE: {
      // if the merc is at home, play his greeting
      //			if( gfJustSwitchedVideoConferenceMode )
      //				InitVideoFaceTalking(gbCurrentSoldier, QUOTE_GREETING);

      break;
    }

    // The screen in which you set the contract length, and the ability to buy equipment..
    case Enum65.AIM_VIDEO_HIRE_MERC_MODE: {
      break;
    }

    // The merc is not home and the player gets the answering machine
    case Enum65.AIM_VIDEO_MERC_ANSWERING_MACHINE_MODE: {
      // if the merc is not at home, play his answering machine
      if (gfJustSwitchedVideoConferenceMode) {
        InitVideoFaceTalking(gbCurrentSoldier, Enum202.QUOTE_ANSWERING_MACHINE_MSG);
      }

      break;
    }

    // The merc is home but doesnt want to work for player
    case Enum65.AIM_VIDEO_MERC_UNAVAILABLE_MODE: {
      break;
    }

    case Enum65.AIM_VIDEO_POPDOWN_MODE: {
      let ubDone: boolean;

      if (gfJustSwitchedVideoConferenceMode)
        ubDone = DisplayMovingTitleBar(false, true);
      else
        ubDone = DisplayMovingTitleBar(false, false);

      if (ubDone) {
        gubVideoConferencingMode = Enum65.AIM_VIDEO_NOT_DISPLAYED_MODE;

        // display the popup telling the user when the just hired merc is going to land
        DisplayPopUpBoxExplainingMercArrivalLocationAndTime(giIdOfLastHiredMerc);

        // render the screen immediately to get rid of the pop down stuff
        InitDeleteVideoConferencePopUp();
        RenderAIMMembers();
        gfVideoFaceActive = false;
      }

      break;
    }
  }

  // Gets set in the InitDeleteVideoConferencePopUp() function
  //	gfJustSwitchedVideoConferenceMode = FALSE;

  return true;
}

function EnableDisableCurrentVideoConferenceButtons(fEnable: boolean): boolean {
  let i: INT8;
  /* static */ let fCreated: boolean = false;
  if (!fEnable) {
    if (fCreated) {
      // enable buttons behind the acknowlegde button

      for (i = 0; i < 3; i++)
        EnableButton(giContractLengthButton[i]);

      for (i = 0; i < 2; i++)
        EnableButton(giBuyEquipmentButton[i]);

      for (i = 0; i < 2; i++)
        EnableButton(giAuthorizeButton[i]);

      fCreated = false;
    }
  } else {
    if (!fCreated) {
      // disable buttons behind the acknowlegde button
      for (i = 0; i < 3; i++)
        DisableButton(giContractLengthButton[i]);

      for (i = 0; i < 2; i++)
        DisableButton(giBuyEquipmentButton[i]);

      for (i = 0; i < 2; i++)
        DisableButton(giAuthorizeButton[i]);

      fCreated = true;
    }
  }
  return true;
}

/*
BOOLEAN HandleAnsweringMachineMessage()
{
        static BOOLEAN fDone;

        if( gfJustSwitchedVideoConferenceMode )
                fDone = DisplayAnimatedAnsweringMachineMsg( TRUE,  12);
        else if( !fDone )
        {
                fDone = DisplayAnimatedAnsweringMachineMsg( FALSE,  12);
                if( fDone )
                {
                        fDone = FALSE;
                }
        }

        return(TRUE);
}
*/
/*
BOOLEAN DisplayAnimatedAnsweringMachineMsg( BOOLEAN fInit, UINT8 ubNumSubImages)
{
//  HVOBJECT	hImageHandle;
        static UINT8	ubSubImage=0;
        static UINT32 uiLastTime=0;
        UINT32 uiCurTime = GetJA2Clock();
        static UINT8		ubMode=0;

        if( fInit )
        {
                ubSubImage = 0;
                uiLastTime = 0;
                ubMode = 0;
        }

        if( (uiCurTime - uiLastTime) > VC_ANSWER_IMAGE_DELAY )
        {

                if( ubMode == 0)
                {
                        if( ubSubImage >= ubNumSubImages)
                                ubSubImage = 0;

                        // Display the Answering machine graphic

                        // For now just blit the guys face, and shade it
//			GetVideoObject(&hImageHandle, guiAnsweringMachineImage);
//			BltVideoObject(FRAME_BUFFER, hImageHandle, ubSubImage, AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, VO_BLT_SRCTRANSPARENCY,NULL);
                        InvalidateRegion(AIM_MEMBER_VIDEO_FACE_X,AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X+AIM_MEMBER_VIDEO_FACE_WIDTH,AIM_MEMBER_VIDEO_FACE_Y+AIM_MEMBER_VIDEO_FACE_HEIGHT);

                        ubSubImage ++;
                        if( ubSubImage == ubNumSubImages)
                        {
                                ubSubImage = 0;
                                ubMode++;
                                return(TRUE);
                        }
                }
                else
                {

                        //display the black background with text over it.
                        ColorFillVideoSurfaceArea( FRAME_BUFFER, AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X+AIM_MEMBER_VIDEO_FACE_WIDTH,	AIM_MEMBER_VIDEO_FACE_Y+AIM_MEMBER_VIDEO_FACE_HEIGHT, Get16BPPColor( FROMRGB( 0, 0, 0 ) ) );
                        DisplayWrappedString(AIM_MEMBER_VIDEO_FACE_X, AIM_MEMBER_VIDEO_FACE_Y+20, AIM_MEMBER_VIDEO_FACE_WIDTH, 2, FONT14ARIAL, 145,  AimPopUpText[AIM_MEMBER_LEAVE_MSG], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
                        InvalidateRegion(AIM_MEMBER_VIDEO_FACE_X,AIM_MEMBER_VIDEO_FACE_Y, AIM_MEMBER_VIDEO_FACE_X+AIM_MEMBER_VIDEO_FACE_WIDTH,AIM_MEMBER_VIDEO_FACE_Y+AIM_MEMBER_VIDEO_FACE_HEIGHT);

                        ubSubImage ++;
                        if( ubSubImage == ubNumSubImages * 2)
                        {
                                ubSubImage = 0;
                                ubMode=0;
                                return(TRUE);
                        }
                }


                //reset clock
                uiLastTime = GetJA2Clock();
        }

        return(FALSE);
}
*/

export function ResetMercAnnoyanceAtPlayer(ubMercID: UINT8): void {
  // if merc is still annoyed, reset back to 0

  if (ubMercID == Enum268.LARRY_NORMAL) {
    if (CheckFact(Enum170.FACT_LARRY_CHANGED, 0)) {
      ubMercID = Enum268.LARRY_DRUNK;
    }
  } else if (ubMercID == Enum268.LARRY_DRUNK) {
    if (CheckFact(Enum170.FACT_LARRY_CHANGED, 0) == false) {
      ubMercID = Enum268.LARRY_NORMAL;
    }
  }
  if ((gMercProfiles[ubMercID].bMercStatus == MERC_ANNOYED_WONT_CONTACT) || (gMercProfiles[ubMercID].bMercStatus == MERC_ANNOYED_BUT_CAN_STILL_CONTACT))
    gMercProfiles[ubMercID].bMercStatus = 0;
}

export function DisableNewMailMessage(): boolean {
  if (fNewMailFlag && gubVideoConferencingMode) {
    gfIsNewMailFlagSet = true;
    fNewMailFlag = false;
    gfRedrawScreen = true;

    return true;
  }
  return false;
}

function DisplayMovingTitleBar(fForward: boolean, fInit: boolean): boolean {
  /* static */ let ubCount: UINT8;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let usPosRightX: UINT16;
  let usPosBottomY: UINT16;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let SrcRect: SGPRect;
  let DestRect: SGPRect;
  /* static */ let LastRect: SGPRect;
  let usTemp: FLOAT;

  if (fForward) {
    if (fInit)
      ubCount = 1;

    usTemp = (331 - 125) / AIM_MEMBER_VIDEO_TITLE_ITERATIONS;
    usPosX = (331 - usTemp * ubCount);

    usTemp = (490 - 405) / AIM_MEMBER_VIDEO_TITLE_ITERATIONS;
    usPosRightX = (405 + usTemp * ubCount);

    usTemp = (AIM_MEMBER_VIDEO_TITLE_START_Y - 96) / AIM_MEMBER_VIDEO_TITLE_ITERATIONS;
    usPosY = (AIM_MEMBER_VIDEO_TITLE_START_Y - usTemp * ubCount);

    usPosBottomY = AIM_MEMBER_VIDEO_TITLE_BAR_HEIGHT;
  } else {
    if (fInit)
      ubCount = AIM_MEMBER_VIDEO_TITLE_ITERATIONS - 1;

    usTemp = (331 - 125) / AIM_MEMBER_VIDEO_TITLE_ITERATIONS;
    usPosX = (331 - usTemp * ubCount);

    usTemp = (490 - 405) / AIM_MEMBER_VIDEO_TITLE_ITERATIONS;
    usPosRightX = (405 + usTemp * ubCount);

    usTemp = (AIM_MEMBER_VIDEO_TITLE_START_Y - 96) / AIM_MEMBER_VIDEO_TITLE_ITERATIONS;
    usPosY = (AIM_MEMBER_VIDEO_TITLE_START_Y - usTemp * ubCount);

    usPosBottomY = AIM_MEMBER_VIDEO_TITLE_BAR_HEIGHT;
  }

  SrcRect.iLeft = 0;
  SrcRect.iTop = 0;
  SrcRect.iRight = AIM_MEMBER_VIDEO_TITLE_BAR_WIDTH;
  SrcRect.iBottom = AIM_MEMBER_VIDEO_TITLE_BAR_HEIGHT;

  DestRect.iLeft = usPosX;
  DestRect.iTop = usPosY;
  DestRect.iRight = usPosRightX;
  DestRect.iBottom = DestRect.iTop + usPosBottomY;

  if (fForward) {
    // Restore the old rect
    if (ubCount > 2) {
      usWidth = (LastRect.iRight - LastRect.iLeft);
      usHeight = (LastRect.iBottom - LastRect.iTop);
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, LastRect.iLeft, LastRect.iTop, usWidth, usHeight);
    }

    // Save rectangle
    if (ubCount > 1) {
      usWidth = (DestRect.iRight - DestRect.iLeft);
      usHeight = (DestRect.iBottom - DestRect.iTop);
      BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, DestRect.iLeft, DestRect.iTop, usWidth, usHeight);
    }
  } else {
    // Restore the old rect
    if (ubCount < AIM_MEMBER_VIDEO_TITLE_ITERATIONS - 2) {
      usWidth = (LastRect.iRight - LastRect.iLeft);
      usHeight = (LastRect.iBottom - LastRect.iTop);
      BlitBufferToBuffer(guiSAVEBUFFER, guiRENDERBUFFER, LastRect.iLeft, LastRect.iTop, usWidth, usHeight);
    }

    // Save rectangle
    if (ubCount < AIM_MEMBER_VIDEO_TITLE_ITERATIONS - 1) {
      usWidth = (DestRect.iRight - DestRect.iLeft);
      usHeight = (DestRect.iBottom - DestRect.iTop);
      BlitBufferToBuffer(guiRENDERBUFFER, guiSAVEBUFFER, DestRect.iLeft, DestRect.iTop, usWidth, usHeight);
    }
  }

  BltStretchVideoSurface(FRAME_BUFFER, guiVideoTitleBar, 0, 0, VO_BLT_SRCTRANSPARENCY, addressof(SrcRect), addressof(DestRect));

  InvalidateRegion(DestRect.iLeft, DestRect.iTop, DestRect.iRight, DestRect.iBottom);
  InvalidateRegion(LastRect.iLeft, LastRect.iTop, LastRect.iRight, LastRect.iBottom);

  LastRect = DestRect;

  if (fForward) {
    ubCount++;
    if (ubCount == AIM_MEMBER_VIDEO_TITLE_ITERATIONS - 1)
      return true;
    else
      return false;
  } else {
    ubCount--;
    if (ubCount == 0)
      return true;
    else
      return false;
  }
}

function DelayMercSpeech(ubMercID: UINT8, usQuoteNum: UINT16, usDelay: UINT16, fNewQuote: boolean, fReset: boolean): void {
  /* static */ let uiLastTime: UINT32 = 0;
  let uiCurTime: UINT32;
  /* static */ let usCurQuoteNum: UINT16;
  /* static */ let usCurDelay: UINT16;
  /* static */ let fQuoteWaiting: boolean = false; // a quote is waiting to be said
  /* static */ let ubCurMercID: UINT8;
  /* static */ let fHangUpAfter: boolean = false;

  uiCurTime = GetJA2Clock();

  if (fReset)
    fQuoteWaiting = false;

  if (fNewQuote) {
    // set up the counters
    uiLastTime = uiCurTime;

    ubCurMercID = ubMercID;
    usCurQuoteNum = usQuoteNum;
    usCurDelay = usDelay;

    if (gfHangUpMerc) {
      gfHangUpMerc = false;
      fHangUpAfter = true;
    }

    fQuoteWaiting = true;
  }

  if (fQuoteWaiting) {
    if ((uiCurTime - uiLastTime) > usCurDelay) {
      InitVideoFaceTalking(ubCurMercID, usCurQuoteNum);
      fQuoteWaiting = false;

      if (fHangUpAfter) {
        gfHangUpMerc = true;
        fHangUpAfter = false;
      }
    }
  }
}

function WaitForMercToFinishTalkingOrUserToClick(): void {
  // if the region is not active
  if (!gfIsShutUpMouseRegionActive) {
    // Enables it so if a player clicks, he will shutup the merc
    MSYS_EnableRegion(addressof(gSelectedShutUpMercRegion));
    gfIsShutUpMouseRegionActive = true;
  }

  if (gfIsAnsweringMachineActive)
    gubVideoConferencingMode = Enum65.AIM_VIDEO_MERC_ANSWERING_MACHINE_MODE;
  else
    gubVideoConferencingMode = Enum65.AIM_VIDEO_FIRST_CONTACT_MERC_MODE;

  gfWaitingForMercToStopTalkingOrUserToClick = true;
  gfHangUpMerc = true;
  gfStopMercFromTalking = false;
}

/*
BOOLEAN DisplayShadedStretchedMercFace( UINT8 ubMercID, UINT16 usPosX, UINT16 usPosY )
{
        SGPRect		SrcRect;
        SGPRect		DestRect;


        //Test
        SrcRect.iLeft = 0;
        SrcRect.iTop = 0;
        SrcRect.iRight = 48;
        SrcRect.iBottom = 43;

        DestRect.iLeft = AIM_MEMBER_VIDEO_FACE_X;
        DestRect.iTop = AIM_MEMBER_VIDEO_FACE_Y;
        DestRect.iRight = DestRect.iLeft + AIM_MEMBER_VIDEO_FACE_WIDTH;
        DestRect.iBottom = DestRect.iTop + AIM_MEMBER_VIDEO_FACE_HEIGHT;


        if(	!BltStretchVideoSurface(FRAME_BUFFER, guiVideoFaceBackground, 0, 0, VO_BLT_SRCTRANSPARENCY, &SrcRect, &DestRect ) )
                return(FALSE);


        return( TRUE );
}
*/

export function DisplayPopUpBoxExplainingMercArrivalLocationAndTime(): void {
  let szLocAndTime: CHAR16[] /* [512] */;
  let pSoldier: Pointer<SOLDIERTYPE> = null;
  let zTimeString: CHAR16[] /* [128] */;
  let zSectorIDString: CHAR16[] /* [512] */;
  let uiHour: UINT32;

  // if the id of the merc is invalid, dont display the pop up
  if (LaptopSaveInfo.sLastHiredMerc.iIdOfMerc == -1)
    return;

  // if the pop up has already been displayed, dont display it again for this occurence of laptop
  if (LaptopSaveInfo.sLastHiredMerc.fHaveDisplayedPopUpInLaptop)
    return;

  pSoldier = FindSoldierByProfileID(LaptopSaveInfo.sLastHiredMerc.iIdOfMerc, true);

  if (pSoldier == null)
    return;

  // calc the approximate hour the mercs will arrive at
  uiHour = ((LaptopSaveInfo.sLastHiredMerc.uiArrivalTime) - (((LaptopSaveInfo.sLastHiredMerc.uiArrivalTime) / 1440) * 1440)) / 60;

  // create the time string
  swprintf(zTimeString, "%02d:%02d", uiHour, 0);

  // get the id string
  GetSectorIDString(gsMercArriveSectorX, gsMercArriveSectorY, 0, zSectorIDString, false);

  // create the string to display to the user, looks like....
  //	L"%s should arrive at the designated drop-off point ( sector %d:%d %s ) on day %d, at approximately %s.",		//first %s is mercs name, next is the sector location and name where they will be arriving in, lastely is the day an the time of arrival

// FIXME: Language-specific code
// #ifdef GERMAN
//   // Germans version has a different argument order
//   swprintf(szLocAndTime, pMessageStrings[MSG_JUST_HIRED_MERC_ARRIVAL_LOCATION_POPUP], gMercProfiles[pSoldier->ubProfile].zNickname, LaptopSaveInfo.sLastHiredMerc.uiArrivalTime / 1440, zTimeString, zSectorIDString);
// #else
  swprintf(szLocAndTime, pMessageStrings[Enum333.MSG_JUST_HIRED_MERC_ARRIVAL_LOCATION_POPUP], gMercProfiles[pSoldier.value.ubProfile].zNickname, zSectorIDString, LaptopSaveInfo.sLastHiredMerc.uiArrivalTime / 1440, zTimeString);
// #endif

  // display the message box
  DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, szLocAndTime, Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, DisplayPopUpBoxExplainingMercArrivalLocationAndTimeCallBack);

  // reset the id of the last merc
  LaptopSaveInfo.sLastHiredMerc.iIdOfMerc = -1;

  // set the fact that the pop up has been displayed this time in laptop
  LaptopSaveInfo.sLastHiredMerc.fHaveDisplayedPopUpInLaptop = true;
}

function DisplayPopUpBoxExplainingMercArrivalLocationAndTimeCallBack(bExitValue: UINT8): void {
  // unset the flag so the msgbox WONT dislay its save buffer
  gfDontOverRideSaveBuffer = false;

  if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_AIM_MEMBERS) {
    // render the screen
    gfRedrawScreen = true;
    RenderAIMMembers();
  }
}

function DisplayAimMemberClickOnFaceHelpText(): void {
  // display the 'left and right click' onscreen help msg
  DrawTextToScreen(AimMemberText[0], AIM_FI_LEFT_CLICK_TEXT_X, AIM_FI_LEFT_CLICK_TEXT_Y, AIM_FI_CLICK_TEXT_WIDTH, AIM_FI_HELP_TITLE_FONT(), AIM_FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DrawTextToScreen(AimMemberText[1], AIM_FI_LEFT_CLICK_TEXT_X, AIM_FI_LEFT_CLICK_TEXT_Y + AIM_FI_CLICK_DESC_TEXT_Y_OFFSET, AIM_FI_CLICK_TEXT_WIDTH, AIM_FI_HELP_FONT(), AIM_FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  DrawTextToScreen(AimMemberText[2], AIM_FI_RIGHT_CLICK_TEXT_X, AIM_FI_LEFT_CLICK_TEXT_Y, AIM_FI_CLICK_TEXT_WIDTH, AIM_FI_HELP_TITLE_FONT(), AIM_FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DrawTextToScreen(AimMemberText[3], AIM_FI_RIGHT_CLICK_TEXT_X, AIM_FI_LEFT_CLICK_TEXT_Y + AIM_FI_CLICK_DESC_TEXT_Y_OFFSET, AIM_FI_CLICK_TEXT_WIDTH, AIM_FI_HELP_FONT(), AIM_FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
}

}
