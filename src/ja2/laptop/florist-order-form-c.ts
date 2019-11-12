namespace ja2 {

const FLOWER_ORDEER_TINY_FONT = () => FONT10ARIAL();
const FLOWER_ORDEER_SMALL_FONT = () => FONT12ARIAL();
const FLOWER_ORDEER_BIG_FONT = () => FONT12ARIAL();
const FLOWER_ORDEER_SMALL_COLOR = FONT_MCOLOR_WHITE;
const FLOWER_ORDEER_LINK_COLOR = FONT_MCOLOR_LTYELLOW;
const FLOWER_ORDEER_DROP_DOWN_FONT = () => FONT12ARIAL();
const FLOWER_ORDEER_DROP_DOWN_COLOR = FONT_MCOLOR_WHITE;

const FLOWER_ORDER_STATIC_TEXT_COLOR = 76;

const FLOWER_ORDER_FLOWER_BOX_X = LAPTOP_SCREEN_UL_X + 7;
const FLOWER_ORDER_FLOWER_BOX_Y = LAPTOP_SCREEN_WEB_UL_Y + 63;
const FLOWER_ORDER_FLOWER_BOX_WIDTH = 75;
const FLOWER_ORDER_FLOWER_BOX_HEIGHT = 100;

const FLOWER_ORDER_SENTIMENT_BOX_X = LAPTOP_SCREEN_UL_X + 14;
const FLOWER_ORDER_SENTIMENT_BOX_Y = LAPTOP_SCREEN_WEB_UL_Y + 226;
const FLOWER_ORDER_SENTIMENT_BOX_WIDTH = 468;
const FLOWER_ORDER_SENTIMENT_BOX_HEIGHT = 27;

const FLOWER_ORDER_NAME_BOX_X = LAPTOP_SCREEN_UL_X + 60;
const FLOWER_ORDER_NAME_BOX_Y = LAPTOP_SCREEN_WEB_UL_Y + 314 - FLOWER_ORDER_SMALLER_PS_OFFSET_Y;

const FLOWER_ORDER_SMALLER_PS_OFFSET_Y = 27;

const FLOWER_ORDER_DELIVERY_LOCATION_X = LAPTOP_SCREEN_UL_X + 205;
const FLOWER_ORDER_DELIVERY_LOCATION_Y = LAPTOP_SCREEN_WEB_UL_Y + 143;
const FLOWER_ORDER_DELIVERY_LOCATION_WIDTH = 252;
const FLOWER_ORDER_DELIVERY_LOCATION_HEIGHT = 20;

const FLOWER_ORDER_BACK_BUTTON_X = LAPTOP_SCREEN_UL_X + 8;
const FLOWER_ORDER_BACK_BUTTON_Y = LAPTOP_SCREEN_WEB_UL_Y + 12;

const FLOWER_ORDER_SEND_BUTTON_X = LAPTOP_SCREEN_UL_X + 124;
const FLOWER_ORDER_SEND_BUTTON_Y = LAPTOP_SCREEN_WEB_UL_Y + 364;

const FLOWER_ORDER_CLEAR_BUTTON_X = LAPTOP_SCREEN_UL_X + 215;
const FLOWER_ORDER_CLEAR_BUTTON_Y = FLOWER_ORDER_SEND_BUTTON_Y;

const FLOWER_ORDER_GALLERY_BUTTON_X = LAPTOP_SCREEN_UL_X + 305;
const FLOWER_ORDER_GALLERY_BUTTON_Y = FLOWER_ORDER_SEND_BUTTON_Y;

const FLOWER_ORDER_FLOWER_NAME_X = LAPTOP_SCREEN_UL_X + 94;
const FLOWER_ORDER_FLOWER_NAME_Y = LAPTOP_SCREEN_WEB_UL_Y + 68;

const FLOWER_ORDER_BOUQUET_NAME_X = FLOWER_ORDER_FLOWER_NAME_X;
const FLOWER_ORDER_BOUQUET_NAME_Y = FLOWER_ORDER_ORDER_NUM_NAME_Y + 15; // FLOWER_ORDER_FLOWER_NAME_Y + 15

const FLOWER_ORDER_ORDER_NUM_NAME_X = FLOWER_ORDER_BOUQUET_NAME_X;
const FLOWER_ORDER_ORDER_NUM_NAME_Y = FLOWER_ORDER_FLOWER_NAME_Y + 15; // FLOWER_ORDER_BOUQUET_NAME_Y + 15

const FLOWER_ORDER_DATE_X = FLOWER_ORDER_FLOWER_NAME_X;
const FLOWER_ORDER_DATE_Y = LAPTOP_SCREEN_WEB_UL_Y + 126;

const FLOWER_ORDER_LOCATION_X = FLOWER_ORDER_FLOWER_NAME_X;
const FLOWER_ORDER_LOCATION_Y = FLOWER_ORDER_DELIVERY_LOCATION_Y + 4;

const FLOWER_ORDER_ADDITIONAL_SERVICES_X = FLOWER_ORDER_FLOWER_BOX_X;
const FLOWER_ORDER_ADDITIONAL_SERVICES_Y = LAPTOP_SCREEN_WEB_UL_Y + 167;

const FLOWER_ORDER_PERSONAL_SENT_TEXT_X = FLOWER_ORDER_ADDITIONAL_SERVICES_X;
const FLOWER_ORDER_PERSONAL_SENT_TEXT_Y = LAPTOP_SCREEN_WEB_UL_Y + 212;

const FLOWER_ORDER_PERSONAL_SENT_BOX_X = FLOWER_ORDER_SENTIMENT_BOX_X + 5;
const FLOWER_ORDER_PERSONAL_SENT_BOX_Y = FLOWER_ORDER_SENTIMENT_BOX_Y + 5;
const FLOWER_ORDER_PERSONAL_SENT_TEXT_WIDTH = 457;
const FLOWER_ORDER_PERSONAL_SENT_TEXT_HEIGHT = 17; // 44

const FLOWER_ORDER_BILLING_INFO_X = FLOWER_ORDER_ADDITIONAL_SERVICES_X;
const FLOWER_ORDER_BILLING_INFO_Y = LAPTOP_SCREEN_WEB_UL_Y + 296 - FLOWER_ORDER_SMALLER_PS_OFFSET_Y;

const FLOWER_ORDER_NAME_TEXT_X = FLOWER_ORDER_ADDITIONAL_SERVICES_X;
const FLOWER_ORDER_NAME_TEXT_Y = FLOWER_ORDER_NAME_BOX_Y + 4;
const FLOWER_ORDER_NAME_TEXT_WIDTH = 50;

const FLOWER_ORDER_NAME_TEXT_BOX_X = FLOWER_ORDER_NAME_BOX_X + 3;
const FLOWER_ORDER_NAME_TEXT_BOX_Y = FLOWER_ORDER_NAME_BOX_Y + 3;
const FLOWER_ORDER_NAME_TEXT_BOX_WIDTH = 257;
const FLOWER_ORDER_NAME_TEXT_BOX_HEIGHT = 15;

const FLOWER_ORDER_CHECK_WIDTH = 20;
const FLOWER_ORDER_CHECK_HEIGHT = 17;

const FLOWER_ORDER_CHECK_BOX_0_X = LAPTOP_SCREEN_UL_X + 186;
const FLOWER_ORDER_CHECK_BOX_0_Y = FLOWER_ORDER_DATE_Y - 3;

const FLOWER_ORDER_CHECK_BOX_1_X = LAPTOP_SCREEN_UL_X + 270;
const FLOWER_ORDER_CHECK_BOX_1_Y = FLOWER_ORDER_CHECK_BOX_0_Y;

const FLOWER_ORDER_CHECK_BOX_2_X = LAPTOP_SCREEN_UL_X + 123;
const FLOWER_ORDER_CHECK_BOX_2_Y = FLOWER_ORDER_ADDITIONAL_SERVICES_Y;

const FLOWER_ORDER_CHECK_BOX_3_X = LAPTOP_SCREEN_UL_X + 269;
const FLOWER_ORDER_CHECK_BOX_3_Y = FLOWER_ORDER_CHECK_BOX_2_Y;

const FLOWER_ORDER_CHECK_BOX_4_X = FLOWER_ORDER_CHECK_BOX_2_X;
const FLOWER_ORDER_CHECK_BOX_4_Y = FLOWER_ORDER_CHECK_BOX_2_Y + 25;

const FLOWER_ORDER_CHECK_BOX_5_X = FLOWER_ORDER_CHECK_BOX_3_X;
const FLOWER_ORDER_CHECK_BOX_5_Y = FLOWER_ORDER_CHECK_BOX_4_Y;

const FLOWER_ORDER_LINK_TO_CARD_GALLERY_X = LAPTOP_SCREEN_UL_X + 190;
const FLOWER_ORDER_LINK_TO_CARD_GALLERY_Y = LAPTOP_SCREEN_WEB_UL_Y + 284 - FLOWER_ORDER_SMALLER_PS_OFFSET_Y;

const FLOWER_ORDER_DROP_DOWN_LOCATION_X = FLOWER_ORDER_DELIVERY_LOCATION_X;
const FLOWER_ORDER_DROP_DOWN_LOCATION_Y = FLOWER_ORDER_DELIVERY_LOCATION_Y + 19;
const FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH = 230;

const FLOWER_ORDER_DROP_DOWN_CITY_START_X = FLOWER_ORDER_DROP_DOWN_LOCATION_X + 5;
const FLOWER_ORDER_DROP_DOWN_CITY_START_Y = FLOWER_ORDER_DROP_DOWN_LOCATION_Y + 3;

const FLOWER_ORDER_PERSONEL_SENTIMENT_NUM_CHARS = 75;
const FLOWER_ORDER_NAME_FIELD_NUM_CHARS = 35;

interface FlowerOrderLocationStruct {
  psCityLoc: string /* Pointer<STR16> */;
  ubNextDayDeliveryCost: UINT8;
  ubWhenItGetsThereCost: UINT8;
}

function createFlowerOrderLocationStructFrom(psCityLoc: string, ubNextDayDeliveryCost: UINT8, ubWhenItGetsThereCost: UINT8): FlowerOrderLocationStruct {
  return {
    psCityLoc,
    ubNextDayDeliveryCost,
    ubWhenItGetsThereCost,
  };
}

const FLOWER_ORDER_NUMBER_OF_DROP_DOWN_LOCATIONS = 17;

let FlowerOrderLocations: FlowerOrderLocationStruct[] /* [FLOWER_ORDER_NUMBER_OF_DROP_DOWN_LOCATIONS] */ = [
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[0], 20, 15),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[1], 95, 70),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[2], 100, 75),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[3], 50, 35),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[4], 70, 50),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[5], 45, 35),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[6], 30, 25),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[7], 100, 75),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[8], 100, 75),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[9], 30, 25),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[10], 95, 70),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[11], 30, 25),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[12], 40, 30),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[13], 45, 35),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[14], 95, 70),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[15], 50, 40),
  createFlowerOrderLocationStructFrom(pDeliveryLocationStrings[16], 40, 30),
];

let guiDeliveryLocation: UINT32;
let guiFlowerFrame: UINT32;
let guiCurrentlySelectedFlowerImage: UINT32;
let guiNameBox: UINT32;
let guiPersonalSentiments: UINT32;
let guiFlowerOrderCheckBoxButtonImage: UINT32;
export let guiDropDownBorder: UINT32;

let gfFLoristCheckBox0Down: boolean = false; // next day delviery
let gfFLoristCheckBox1Down: boolean = true; // when it gets there delivery
let gfFLoristCheckBox2Down: boolean = false;
let gfFLoristCheckBox3Down: boolean = false;
let gfFLoristCheckBox4Down: boolean = false;
let gfFLoristCheckBox5Down: boolean = false;

let guiFlowerPrice: UINT32;

// drop down menu
const enum Enum81 {
  FLOWER_ORDER_DROP_DOWN_NO_ACTION,
  FLOWER_ORDER_DROP_DOWN_CREATE,
  FLOWER_ORDER_DROP_DOWN_DESTROY,
  FLOWER_ORDER_DROP_DOWN_DISPLAY,
}
// the current mode of the drop down display
let gubFlowerDestDropDownMode: UINT8;
let gubCurrentlySelectedFlowerLocation: UINT8;

let gsSentimentTextField: string /* wchar_t[FLOWER_ORDER_PERSONEL_SENTIMENT_NUM_CHARS] */ = [ 0 ];
let gsNameTextField: string /* wchar_t[FLOWER_ORDER_NAME_FIELD_NUM_CHARS] */ = [ 0 ];

// buttons
let guiFlowerOrderButtonImage: INT32;

let gubFlowerOrder_AdditioanalServicePrices: UINT8[] /* [] */ = [
  10,
  20,
  10,
  10,
];

let guiFlowerOrderBackButton: UINT32;

let guiFlowerOrderSendButton: UINT32;

let guiFlowerOrderClearButton: UINT32;

let guiFlowerOrderGalleryButton: UINT32;

// Clicking on OrderCheckBox
let gSelectedFloristCheckBoxRegion: MOUSE_REGION[] /* [6] */ = createArrayFrom(6, createMouseRegion);

// link to the card gallery
let gSelectedFloristCardGalleryLinkRegion: MOUSE_REGION = createMouseRegion();

// link to the flower gallery by clicking on the flower
let gSelectedFloristGalleryLinkRegion: MOUSE_REGION = createMouseRegion();

// the drop down for the city
let gSelectedFloristDropDownRegion: MOUSE_REGION = createMouseRegion();

// to disable the drop down window
let gSelectedFloristDisableDropDownRegion: MOUSE_REGION = createMouseRegion();

// mouse region for the drop down city location area
let gSelectedFlowerDropDownRegion: MOUSE_REGION[] /* [FLOWER_ORDER_NUMBER_OF_DROP_DOWN_LOCATIONS] */ = createArrayFrom(FLOWER_ORDER_NUMBER_OF_DROP_DOWN_LOCATIONS, createMouseRegion);

// to select typing in the personal sentiment box
// MOUSE_REGION    gSelectedFloristPersonalSentimentBoxRegion;
// void SelectFloristPersonalSentimentBoxRegionCallBack(MOUSE_REGION * pRegion, INT32 iReason );

function GameInitFloristOrderForm(): void {
}

export function EnterFloristOrderForm(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let i: UINT8;
  let sTemp: string /* char[40] */;
  let usPosX: UINT16;
  let usWidth: UINT16;
  let usHeight: UINT16;

  InitFloristDefaults();

  // load the DeliveryLocation graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\DeliveryLocation.sti");
  if (!(guiDeliveryLocation = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the Flower frame graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\FlowerFrame.sti");
  if (!(guiFlowerFrame = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the Personel sentiments graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\PersonalSentiments.sti");
  if (!(guiPersonalSentiments = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the Name Box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\NameBox.sti");
  if (!(guiNameBox = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the Check Box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\OrderCheckBox.sti");
  if (!(guiFlowerOrderCheckBoxButtonImage = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the currently selected flower bouquet
  sTemp = sprintf("LAPTOP\\Flower_%d.sti", guiCurrentlySelectedFlower);
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP(sTemp);
  if (!(guiCurrentlySelectedFlowerImage = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // border
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("INTERFACE\\TactPopUp.sti");
  if (!(guiDropDownBorder = AddVideoObject(VObjectDesc))) {
    return false;
  }

  guiFlowerOrderButtonImage = LoadButtonImage("LAPTOP\\FloristButtons.sti", -1, 0, -1, 1, -1);

  guiFlowerOrderBackButton = CreateIconAndTextButton(guiFlowerOrderButtonImage, sOrderFormText[Enum346.FLORIST_ORDER_BACK], FLORIST_BUTTON_TEXT_FONT(), FLORIST_BUTTON_TEXT_UP_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, FLORIST_BUTTON_TEXT_DOWN_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, TEXT_CJUSTIFIED, FLOWER_ORDER_BACK_BUTTON_X, FLOWER_ORDER_BACK_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnFlowerOrderBackButtonCallback);
  SetButtonCursor(guiFlowerOrderBackButton, Enum317.CURSOR_WWW);

  guiFlowerOrderSendButton = CreateIconAndTextButton(guiFlowerOrderButtonImage, sOrderFormText[Enum346.FLORIST_ORDER_SEND], FLORIST_BUTTON_TEXT_FONT(), FLORIST_BUTTON_TEXT_UP_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, FLORIST_BUTTON_TEXT_DOWN_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, TEXT_CJUSTIFIED, FLOWER_ORDER_SEND_BUTTON_X, FLOWER_ORDER_SEND_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnFlowerOrderSendButtonCallback);
  SetButtonCursor(guiFlowerOrderSendButton, Enum317.CURSOR_WWW);

  guiFlowerOrderClearButton = CreateIconAndTextButton(guiFlowerOrderButtonImage, sOrderFormText[Enum346.FLORIST_ORDER_CLEAR], FLORIST_BUTTON_TEXT_FONT(), FLORIST_BUTTON_TEXT_UP_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, FLORIST_BUTTON_TEXT_DOWN_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, TEXT_CJUSTIFIED, FLOWER_ORDER_CLEAR_BUTTON_X, FLOWER_ORDER_CLEAR_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnFlowerOrderClearButtonCallback);
  SetButtonCursor(guiFlowerOrderClearButton, Enum317.CURSOR_WWW);

  guiFlowerOrderGalleryButton = CreateIconAndTextButton(guiFlowerOrderButtonImage, sOrderFormText[Enum346.FLORIST_ORDER_GALLERY], FLORIST_BUTTON_TEXT_FONT(), FLORIST_BUTTON_TEXT_UP_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, FLORIST_BUTTON_TEXT_DOWN_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, TEXT_CJUSTIFIED, FLOWER_ORDER_GALLERY_BUTTON_X, FLOWER_ORDER_GALLERY_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnFlowerOrderGalleryButtonCallback);
  SetButtonCursor(guiFlowerOrderGalleryButton, Enum317.CURSOR_WWW);

  //
  //	The check box mouse regions
  //
  i = 0;
  MSYS_DefineRegion(gSelectedFloristCheckBoxRegion[i], FLOWER_ORDER_CHECK_BOX_0_X, FLOWER_ORDER_CHECK_BOX_0_Y, (FLOWER_ORDER_CHECK_BOX_0_X + FLOWER_ORDER_CHECK_WIDTH), (FLOWER_ORDER_CHECK_BOX_0_Y + FLOWER_ORDER_CHECK_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFlorsitCheckBoxRegionCallBack);
  MSYS_AddRegion(gSelectedFloristCheckBoxRegion[i]);
  MSYS_SetRegionUserData(gSelectedFloristCheckBoxRegion[i], 0, i);
  i++;

  MSYS_DefineRegion(gSelectedFloristCheckBoxRegion[i], FLOWER_ORDER_CHECK_BOX_1_X, FLOWER_ORDER_CHECK_BOX_1_Y, (FLOWER_ORDER_CHECK_BOX_1_X + FLOWER_ORDER_CHECK_WIDTH), (FLOWER_ORDER_CHECK_BOX_1_Y + FLOWER_ORDER_CHECK_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFlorsitCheckBoxRegionCallBack);
  MSYS_AddRegion(gSelectedFloristCheckBoxRegion[i]);
  MSYS_SetRegionUserData(gSelectedFloristCheckBoxRegion[i], 0, i);
  i++;

  MSYS_DefineRegion(gSelectedFloristCheckBoxRegion[i], FLOWER_ORDER_CHECK_BOX_2_X, FLOWER_ORDER_CHECK_BOX_2_Y, (FLOWER_ORDER_CHECK_BOX_2_X + FLOWER_ORDER_CHECK_WIDTH), (FLOWER_ORDER_CHECK_BOX_2_Y + FLOWER_ORDER_CHECK_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFlorsitCheckBoxRegionCallBack);
  MSYS_AddRegion(gSelectedFloristCheckBoxRegion[i]);
  MSYS_SetRegionUserData(gSelectedFloristCheckBoxRegion[i], 0, i);
  i++;

  MSYS_DefineRegion(gSelectedFloristCheckBoxRegion[i], FLOWER_ORDER_CHECK_BOX_3_X, FLOWER_ORDER_CHECK_BOX_3_Y, (FLOWER_ORDER_CHECK_BOX_3_X + FLOWER_ORDER_CHECK_WIDTH), (FLOWER_ORDER_CHECK_BOX_3_Y + FLOWER_ORDER_CHECK_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFlorsitCheckBoxRegionCallBack);
  MSYS_AddRegion(gSelectedFloristCheckBoxRegion[i]);
  MSYS_SetRegionUserData(gSelectedFloristCheckBoxRegion[i], 0, i);
  i++;

  MSYS_DefineRegion(gSelectedFloristCheckBoxRegion[i], FLOWER_ORDER_CHECK_BOX_4_X, FLOWER_ORDER_CHECK_BOX_4_Y, (FLOWER_ORDER_CHECK_BOX_4_X + FLOWER_ORDER_CHECK_WIDTH), (FLOWER_ORDER_CHECK_BOX_4_Y + FLOWER_ORDER_CHECK_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFlorsitCheckBoxRegionCallBack);
  MSYS_AddRegion(gSelectedFloristCheckBoxRegion[i]);
  MSYS_SetRegionUserData(gSelectedFloristCheckBoxRegion[i], 0, i);
  i++;

  MSYS_DefineRegion(gSelectedFloristCheckBoxRegion[i], FLOWER_ORDER_CHECK_BOX_5_X, FLOWER_ORDER_CHECK_BOX_5_Y, (FLOWER_ORDER_CHECK_BOX_5_X + FLOWER_ORDER_CHECK_WIDTH), (FLOWER_ORDER_CHECK_BOX_5_Y + FLOWER_ORDER_CHECK_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFlorsitCheckBoxRegionCallBack);
  MSYS_AddRegion(gSelectedFloristCheckBoxRegion[i]);
  MSYS_SetRegionUserData(gSelectedFloristCheckBoxRegion[i], 0, i);
  i++;

  usPosX = StringPixLength(sOrderFormText[Enum346.FLORIST_ORDER_SELECT_FROM_OURS], FLOWER_ORDEER_SMALL_FONT()) + 2 + FLOWER_ORDER_LINK_TO_CARD_GALLERY_X;
  usWidth = StringPixLength(sOrderFormText[Enum346.FLORIST_ORDER_STANDARDIZED_CARDS], FLOWER_ORDEER_SMALL_FONT());
  usHeight = GetFontHeight(FLOWER_ORDEER_SMALL_FONT());
  MSYS_DefineRegion(gSelectedFloristCardGalleryLinkRegion, usPosX, FLOWER_ORDER_LINK_TO_CARD_GALLERY_Y, (usPosX + usWidth), (FLOWER_ORDER_LINK_TO_CARD_GALLERY_Y + usHeight), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFloristCardGalleryLinkRegionCallBack);
  MSYS_AddRegion(gSelectedFloristCardGalleryLinkRegion);

  // flower link
  MSYS_DefineRegion(gSelectedFloristGalleryLinkRegion, FLOWER_ORDER_FLOWER_BOX_X, FLOWER_ORDER_FLOWER_BOX_Y, (FLOWER_ORDER_FLOWER_BOX_X + FLOWER_ORDER_FLOWER_BOX_WIDTH), (FLOWER_ORDER_FLOWER_BOX_Y + FLOWER_ORDER_FLOWER_BOX_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFloristGalleryLinkRegionCallBack);
  MSYS_AddRegion(gSelectedFloristGalleryLinkRegion);

  // drop down city location
  MSYS_DefineRegion(gSelectedFloristDropDownRegion, FLOWER_ORDER_DELIVERY_LOCATION_X, FLOWER_ORDER_DELIVERY_LOCATION_Y, (FLOWER_ORDER_DELIVERY_LOCATION_X + FLOWER_ORDER_DELIVERY_LOCATION_WIDTH), (FLOWER_ORDER_DELIVERY_LOCATION_Y + FLOWER_ORDER_DELIVERY_LOCATION_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFloristDropDownRegionCallBack);
  MSYS_AddRegion(gSelectedFloristDropDownRegion);

  // to disable the drop down city location
  MSYS_DefineRegion(gSelectedFloristDisableDropDownRegion, LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y, MSYS_PRIORITY_HIGH + 2, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, SelectFloristDisableDropDownRegionCallBack);
  MSYS_AddRegion(gSelectedFloristDisableDropDownRegion);
  MSYS_DisableRegion(gSelectedFloristDisableDropDownRegion);

  // to select typing in the personal sentiment box
  //	MSYS_DefineRegion( &gSelectedFloristPersonalSentimentBoxRegion, FLOWER_ORDER_SENTIMENT_BOX_X, FLOWER_ORDER_SENTIMENT_BOX_Y, (UINT16)(FLOWER_ORDER_SENTIMENT_BOX_X + FLOWER_ORDER_SENTIMENT_BOX_WIDTH), (UINT16)(FLOWER_ORDER_SENTIMENT_BOX_Y + FLOWER_ORDER_SENTIMENT_BOX_HEIGHT), MSYS_PRIORITY_HIGH,
  //					 CURSOR_WWW, MSYS_NO_CALLBACK, SelectFloristPersonalSentimentBoxRegionCallBack);
  //	MSYS_AddRegion( &gSelectedFloristPersonalSentimentBoxRegion );

  InitFlowerOrderTextInputBoxes();

  LaptopSaveInfo.uiFlowerOrderNumber += Random(5) + 1;

  RenderFloristOrderForm();

  //	guiFlowerPrice = 0;
  //	gubFlowerDestDropDownMode = FLOWER_ORDER_DROP_DOWN_NO_ACTION;
  //	gubCurrentlySelectedFlowerLocation = 0;

  return true;
}

export function InitFloristOrderFormVariables(): void {
  guiFlowerPrice = 0;
  gubFlowerDestDropDownMode = Enum81.FLOWER_ORDER_DROP_DOWN_NO_ACTION;
  gubCurrentlySelectedFlowerLocation = 0;
}

export function ExitFloristOrderForm(): void {
  let i: UINT8;
  RemoveFloristDefaults();

  DeleteVideoObjectFromIndex(guiDeliveryLocation);
  DeleteVideoObjectFromIndex(guiFlowerFrame);
  DeleteVideoObjectFromIndex(guiNameBox);
  DeleteVideoObjectFromIndex(guiPersonalSentiments);
  DeleteVideoObjectFromIndex(guiFlowerOrderCheckBoxButtonImage);
  DeleteVideoObjectFromIndex(guiCurrentlySelectedFlowerImage);
  DeleteVideoObjectFromIndex(guiDropDownBorder);

  for (i = 0; i < 6; i++)
    MSYS_RemoveRegion(gSelectedFloristCheckBoxRegion[i]);

  // card gallery link
  MSYS_RemoveRegion(gSelectedFloristCardGalleryLinkRegion);

  // flower link
  MSYS_RemoveRegion(gSelectedFloristGalleryLinkRegion);

  // flower link
  MSYS_RemoveRegion(gSelectedFloristDropDownRegion);

  // to select typing in the personal sentiment box
  //	MSYS_RemoveRegion( &gSelectedFloristPersonalSentimentBoxRegion);

  // disable the drop down window
  MSYS_RemoveRegion(gSelectedFloristDisableDropDownRegion);

  UnloadButtonImage(guiFlowerOrderButtonImage);

  RemoveButton(guiFlowerOrderBackButton);
  RemoveButton(guiFlowerOrderSendButton);
  RemoveButton(guiFlowerOrderClearButton);
  RemoveButton(guiFlowerOrderGalleryButton);

  // Store the text fields
  Get16BitStringFromField(1, gsSentimentTextField);
  Get16BitStringFromField(2, gsNameTextField);
  gbCurrentlySelectedCard = -1;

  DestroyFlowerOrderTextInputBoxes();
}

export function HandleFloristOrderForm(): void {
  if (gubFlowerDestDropDownMode != Enum81.FLOWER_ORDER_DROP_DOWN_NO_ACTION) {
    CreateDestroyFlowerOrderDestDropDown(gubFlowerDestDropDownMode);
  }
  HandleFloristOrderKeyBoardInput();

  RenderAllTextFields();
}

export function RenderFloristOrderForm(): void {
  let hPixHandle: HVOBJECT;
  let usPosX: UINT16;
  let sTemp: string /* wchar_t[640] */;
  let uiStartLoc: UINT32 = 0;

  DisplayFloristDefaults();

  // The flowe Delivery location
  hPixHandle = GetVideoObject(guiDeliveryLocation);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_DELIVERY_LOCATION_X, FLOWER_ORDER_DELIVERY_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);

  // The flowe Flower Frame
  hPixHandle = GetVideoObject(guiFlowerFrame);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_FLOWER_BOX_X, FLOWER_ORDER_FLOWER_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // The currenltly selected flwoer
  hPixHandle = GetVideoObject(guiCurrentlySelectedFlowerImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_FLOWER_BOX_X + 5, FLOWER_ORDER_FLOWER_BOX_Y + 5, VO_BLT_SRCTRANSPARENCY, null);

  // The flowe Name Box
  hPixHandle = GetVideoObject(guiNameBox);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_NAME_BOX_X, FLOWER_ORDER_NAME_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // The flowe Personel sentiments
  hPixHandle = GetVideoObject(guiPersonalSentiments);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_SENTIMENT_BOX_X, FLOWER_ORDER_SENTIMENT_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Bouquet name, price and order number,text
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_NAME_BOUQUET], FLOWER_ORDER_FLOWER_NAME_X, FLOWER_ORDER_FLOWER_NAME_Y, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_PRICE], FLOWER_ORDER_BOUQUET_NAME_X, FLOWER_ORDER_BOUQUET_NAME_Y, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_ORDER_NUMBER], FLOWER_ORDER_ORDER_NUM_NAME_X, FLOWER_ORDER_ORDER_NUM_NAME_Y, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // The flower name
  usPosX = StringPixLength(sOrderFormText[Enum346.FLORIST_ORDER_NAME_BOUQUET], FLOWER_ORDEER_SMALL_FONT()) + 5 + FLOWER_ORDER_FLOWER_NAME_X;
  uiStartLoc = FLOR_GALLERY_TEXT_TOTAL_SIZE * guiCurrentlySelectedFlower;
  LoadEncryptedDataFromFile(FLOR_GALLERY_TEXT_FILE, sTemp, uiStartLoc, FLOR_GALLERY_TEXT_TITLE_SIZE);
  DrawTextToScreen(sTemp, usPosX, FLOWER_ORDER_FLOWER_NAME_Y, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Deliverry Date
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_DELIVERY_DATE], FLOWER_ORDER_ORDER_NUM_NAME_X, FLOWER_ORDER_DATE_Y, 0, FLOWER_ORDEER_BIG_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Next day
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_NEXT_DAY], FLOWER_ORDER_CHECK_BOX_0_X + FLOWER_ORDER_CHECK_WIDTH + 3, FLOWER_ORDER_CHECK_BOX_0_Y + 2, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // When it get there
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_GETS_THERE], FLOWER_ORDER_CHECK_BOX_1_X + FLOWER_ORDER_CHECK_WIDTH + 3, FLOWER_ORDER_CHECK_BOX_1_Y + 2, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Deliverry locatiuon
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_DELIVERY_LOCATION], FLOWER_ORDER_ORDER_NUM_NAME_X, FLOWER_ORDER_LOCATION_Y, 0, FLOWER_ORDEER_BIG_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Additional services
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_ADDITIONAL_CHARGES], FLOWER_ORDER_ADDITIONAL_SERVICES_X, FLOWER_ORDER_ADDITIONAL_SERVICES_Y, 0, FLOWER_ORDEER_BIG_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // crushed bouquet
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_CRUSHED], FLOWER_ORDER_CHECK_BOX_2_X + FLOWER_ORDER_CHECK_WIDTH + 3, FLOWER_ORDER_CHECK_BOX_2_Y + 2, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // black roses
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_BLACK_ROSES], FLOWER_ORDER_CHECK_BOX_3_X + FLOWER_ORDER_CHECK_WIDTH + 3, FLOWER_ORDER_CHECK_BOX_3_Y + 2, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // wilted bouquet
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_WILTED], FLOWER_ORDER_CHECK_BOX_4_X + FLOWER_ORDER_CHECK_WIDTH + 3, FLOWER_ORDER_CHECK_BOX_4_Y + 2, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // fruit cake
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_FRUIT_CAKE], FLOWER_ORDER_CHECK_BOX_5_X + FLOWER_ORDER_CHECK_WIDTH + 3, FLOWER_ORDER_CHECK_BOX_5_Y + 2, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Personal sentiment
  usPosX = FLOWER_ORDER_PERSONAL_SENT_TEXT_X + StringPixLength(sOrderFormText[Enum346.FLORIST_ORDER_PERSONAL_SENTIMENTS], FLOWER_ORDEER_BIG_FONT()) + 5;
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_PERSONAL_SENTIMENTS], FLOWER_ORDER_PERSONAL_SENT_TEXT_X, FLOWER_ORDER_PERSONAL_SENT_TEXT_Y, 0, FLOWER_ORDEER_BIG_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_CARD_LENGTH], usPosX, FLOWER_ORDER_PERSONAL_SENT_TEXT_Y + 2, 0, FLOWER_ORDEER_TINY_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Billing information
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_BILLING_INFO], FLOWER_ORDER_BILLING_INFO_X, FLOWER_ORDER_BILLING_INFO_Y, 0, FLOWER_ORDEER_BIG_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Billing Name
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_NAME], FLOWER_ORDER_NAME_TEXT_X, FLOWER_ORDER_NAME_TEXT_Y, FLOWER_ORDER_NAME_TEXT_WIDTH, FLOWER_ORDEER_BIG_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  // the text to link to the card gallery
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_SELECT_FROM_OURS], FLOWER_ORDER_LINK_TO_CARD_GALLERY_X, FLOWER_ORDER_LINK_TO_CARD_GALLERY_Y, 0, FLOWER_ORDEER_BIG_FONT(), FLOWER_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usPosX = StringPixLength(sOrderFormText[Enum346.FLORIST_ORDER_SELECT_FROM_OURS], FLOWER_ORDEER_SMALL_FONT()) + 5 + FLOWER_ORDER_LINK_TO_CARD_GALLERY_X;
  DrawTextToScreen(sOrderFormText[Enum346.FLORIST_ORDER_STANDARDIZED_CARDS], usPosX, FLOWER_ORDER_LINK_TO_CARD_GALLERY_Y, 0, FLOWER_ORDEER_BIG_FONT(), FLOWER_ORDEER_LINK_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  DisplayFloristCheckBox();

  // display all the things that change for the different bouquet collections
  DisplayFlowerDynamicItems();

  // Display the currently selected city
  FlowerOrderDisplayShippingLocationCity();

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function BtnFlowerOrderBackButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST_FLOWER_GALLERY;

      InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function BtnFlowerOrderSendButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= (~BUTTON_CLICKED_ON);

      // add an entry in the finacial page for the medical deposit
      AddTransactionToPlayersBook(Enum80.PURCHASED_FLOWERS, 0, GetWorldTotalMin(), -(guiFlowerPrice));

      if (gubCurrentlySelectedFlowerLocation == 7) {
        // sent to meduna!
        if (gfFLoristCheckBox0Down) {
          HandleFlowersMeanwhileScene(0);
        } else {
          HandleFlowersMeanwhileScene(1);
        }
      }

      // increment the order number
      LaptopSaveInfo.uiFlowerOrderNumber += (1 + Random(2));

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST;
      InitFloristOrderForm();

      InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function BtnFlowerOrderClearButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST;
      InitFloristOrderForm();

      InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function BtnFlowerOrderGalleryButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) {
      btn.uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST_FLOWER_GALLERY;

      // reset the gallery back to page 0
      gubCurFlowerIndex = 0;

      InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.Area.RegionTopLeftX, btn.Area.RegionTopLeftY, btn.Area.RegionBottomRightX, btn.Area.RegionBottomRightY);
  }
}

function SelectFlorsitCheckBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let uiUserData: UINT32;

    uiUserData = MSYS_GetRegionUserData(pRegion, 0);

    switch (uiUserData) {
      case 0:
        if (gfFLoristCheckBox0Down) {
          gfFLoristCheckBox0Down = false;
          gfFLoristCheckBox1Down = true;
        } else {
          gfFLoristCheckBox0Down = true;
          gfFLoristCheckBox1Down = false;
        }
        break;
      case 1:
        if (gfFLoristCheckBox1Down) {
          gfFLoristCheckBox1Down = false;
          gfFLoristCheckBox0Down = true;
        } else {
          gfFLoristCheckBox1Down = true;
          gfFLoristCheckBox0Down = false;
        }
        break;
      case 2:
        if (gfFLoristCheckBox2Down)
          gfFLoristCheckBox2Down = false;
        else
          gfFLoristCheckBox2Down = true;
        break;
      case 3:
        if (gfFLoristCheckBox3Down)
          gfFLoristCheckBox3Down = false;
        else
          gfFLoristCheckBox3Down = true;
        break;
      case 4:
        if (gfFLoristCheckBox4Down)
          gfFLoristCheckBox4Down = false;
        else
          gfFLoristCheckBox4Down = true;
        break;
      case 5:
        if (gfFLoristCheckBox5Down)
          gfFLoristCheckBox5Down = false;
        else
          gfFLoristCheckBox5Down = true;
        break;
    }
    DisplayFloristCheckBox();
    fPausedReDrawScreenFlag = true;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function DisplayFloristCheckBox(): void {
  let hPixHandle: HVOBJECT;

  // check box
  hPixHandle = GetVideoObject(guiFlowerOrderCheckBoxButtonImage);
  if (gfFLoristCheckBox0Down)
    BltVideoObject(FRAME_BUFFER, hPixHandle, 1, FLOWER_ORDER_CHECK_BOX_0_X, FLOWER_ORDER_CHECK_BOX_0_Y, VO_BLT_SRCTRANSPARENCY, null);
  else
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_CHECK_BOX_0_X, FLOWER_ORDER_CHECK_BOX_0_Y, VO_BLT_SRCTRANSPARENCY, null);

  // first check box
  hPixHandle = GetVideoObject(guiFlowerOrderCheckBoxButtonImage);
  if (gfFLoristCheckBox1Down)
    BltVideoObject(FRAME_BUFFER, hPixHandle, 1, FLOWER_ORDER_CHECK_BOX_1_X, FLOWER_ORDER_CHECK_BOX_1_Y, VO_BLT_SRCTRANSPARENCY, null);
  else
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_CHECK_BOX_1_X, FLOWER_ORDER_CHECK_BOX_1_Y, VO_BLT_SRCTRANSPARENCY, null);

  // second check box
  hPixHandle = GetVideoObject(guiFlowerOrderCheckBoxButtonImage);
  if (gfFLoristCheckBox2Down)
    BltVideoObject(FRAME_BUFFER, hPixHandle, 1, FLOWER_ORDER_CHECK_BOX_2_X, FLOWER_ORDER_CHECK_BOX_2_Y, VO_BLT_SRCTRANSPARENCY, null);
  else
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_CHECK_BOX_2_X, FLOWER_ORDER_CHECK_BOX_2_Y, VO_BLT_SRCTRANSPARENCY, null);

  // third check box
  hPixHandle = GetVideoObject(guiFlowerOrderCheckBoxButtonImage);
  if (gfFLoristCheckBox3Down)
    BltVideoObject(FRAME_BUFFER, hPixHandle, 1, FLOWER_ORDER_CHECK_BOX_3_X, FLOWER_ORDER_CHECK_BOX_3_Y, VO_BLT_SRCTRANSPARENCY, null);
  else
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_CHECK_BOX_3_X, FLOWER_ORDER_CHECK_BOX_3_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Foiurth check box
  hPixHandle = GetVideoObject(guiFlowerOrderCheckBoxButtonImage);
  if (gfFLoristCheckBox4Down)
    BltVideoObject(FRAME_BUFFER, hPixHandle, 1, FLOWER_ORDER_CHECK_BOX_4_X, FLOWER_ORDER_CHECK_BOX_4_Y, VO_BLT_SRCTRANSPARENCY, null);
  else
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_CHECK_BOX_4_X, FLOWER_ORDER_CHECK_BOX_4_Y, VO_BLT_SRCTRANSPARENCY, null);

  // fifth check box
  hPixHandle = GetVideoObject(guiFlowerOrderCheckBoxButtonImage);
  if (gfFLoristCheckBox5Down)
    BltVideoObject(FRAME_BUFFER, hPixHandle, 1, FLOWER_ORDER_CHECK_BOX_5_X, FLOWER_ORDER_CHECK_BOX_5_Y, VO_BLT_SRCTRANSPARENCY, null);
  else
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLOWER_ORDER_CHECK_BOX_5_X, FLOWER_ORDER_CHECK_BOX_5_Y, VO_BLT_SRCTRANSPARENCY, null);

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function SelectFloristCardGalleryLinkRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST_CARD_GALLERY;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

// display the things that change on the screen
function DisplayFlowerDynamicItems(): void {
  let uiStartLoc: UINT32 = 0;
  let usPosX: UINT16;
  let sTemp: string /* wchar_t[640] */;
  //	wchar_t	sText[ 640 ];
  let usPrice: UINT16;
  /*
          //display the card saying
          if( gbCurrentlySelectedCard != -1 )
          {
                  //Get and display the card saying
                  //Display Flower Desc

                  uiStartLoc = FLOR_CARD_TEXT_TITLE_SIZE * + gbCurrentlySelectedCard;
                  LoadEncryptedDataFromFile( FLOR_CARD_TEXT_FILE, sTemp, uiStartLoc, FLOR_CARD_TEXT_TITLE_SIZE);

                  CleanOutControlCodesFromString(sTemp, sText);

                  DisplayWrappedString( (UINT16)(FLOWER_ORDER_SENTIMENT_BOX_X+10), (UINT16)(FLOWER_ORDER_SENTIMENT_BOX_Y+7), FLOWER_ORDER_PERSONAL_SENT_TEXT_WIDTH, 2, FLOWER_ORDEER_SMALL_FONT, FLOWER_ORDEER_SMALL_COLOR,  sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
          }
  */
  // order number
  usPosX = StringPixLength(sOrderFormText[Enum346.FLORIST_ORDER_ORDER_NUMBER], FLOWER_ORDEER_SMALL_FONT()) + 5 + FLOWER_ORDER_ORDER_NUM_NAME_X;
  sTemp = swprintf("%d", LaptopSaveInfo.uiFlowerOrderNumber);
  DrawTextToScreen(sTemp, usPosX, FLOWER_ORDER_ORDER_NUM_NAME_Y, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  guiFlowerPrice = 0;
  // the user selected crushed bouquet
  if (gfFLoristCheckBox2Down)
    guiFlowerPrice += gubFlowerOrder_AdditioanalServicePrices[0];

  // the user selected blak roses
  if (gfFLoristCheckBox3Down)
    guiFlowerPrice += gubFlowerOrder_AdditioanalServicePrices[1];

  // the user selected wilted bouquet
  if (gfFLoristCheckBox4Down)
    guiFlowerPrice += gubFlowerOrder_AdditioanalServicePrices[2];

  // the user selected fruit cake
  if (gfFLoristCheckBox5Down)
    guiFlowerPrice += gubFlowerOrder_AdditioanalServicePrices[3];

  // price
  usPosX = StringPixLength(sOrderFormText[Enum346.FLORIST_ORDER_PRICE], FLOWER_ORDEER_SMALL_FONT()) + 5 + FLOWER_ORDER_BOUQUET_NAME_X;
  uiStartLoc = FLOR_GALLERY_TEXT_TOTAL_SIZE * guiCurrentlySelectedFlower + FLOR_GALLERY_TEXT_TITLE_SIZE;
  LoadEncryptedDataFromFile(FLOR_GALLERY_TEXT_FILE, sTemp, uiStartLoc, FLOR_GALLERY_TEXT_PRICE_SIZE);
  swscanf(sTemp, "%hu", addressof(usPrice));

  // if its the next day delivery
  if (gfFLoristCheckBox0Down)
    guiFlowerPrice += usPrice + FlowerOrderLocations[gubCurrentlySelectedFlowerLocation].ubNextDayDeliveryCost;
  // else its the 'when it gets there' delivery
  else
    guiFlowerPrice += usPrice + FlowerOrderLocations[gubCurrentlySelectedFlowerLocation].ubWhenItGetsThereCost;

  sTemp = swprintf("$%d.00 %s", guiFlowerPrice, pMessageStrings[Enum333.MSG_USDOLLAR_ABBREVIATION]);
  DrawTextToScreen(sTemp, usPosX, FLOWER_ORDER_BOUQUET_NAME_Y, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
}

function SelectFloristGalleryLinkRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST_FLOWER_GALLERY;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectFloristDropDownRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubFlowerDestDropDownMode = Enum81.FLOWER_ORDER_DROP_DOWN_CREATE;
  }
}

function SelectFloristDisableDropDownRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubFlowerDestDropDownMode = Enum81.FLOWER_ORDER_DROP_DOWN_DESTROY;
  }
}

function SelectFlowerDropDownRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentlySelectedFlowerLocation = MSYS_GetRegionUserData(pRegion, 0);
    FlowerOrderDrawSelectedCity(gubCurrentlySelectedFlowerLocation);
    gubFlowerDestDropDownMode = Enum81.FLOWER_ORDER_DROP_DOWN_DESTROY;
  }
}

function SelectFlowerDropDownMovementCallBack(pRegion: MOUSE_REGION, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    pRegion.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(pRegion.RegionTopLeftX, pRegion.RegionTopLeftY, pRegion.RegionBottomRightX, pRegion.RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    pRegion.uiFlags |= BUTTON_CLICKED_ON;

    gubCurrentlySelectedFlowerLocation = MSYS_GetRegionUserData(pRegion, 0);
    FlowerOrderDrawSelectedCity(gubCurrentlySelectedFlowerLocation);

    InvalidateRegion(pRegion.RegionTopLeftX, pRegion.RegionTopLeftY, pRegion.RegionBottomRightX, pRegion.RegionBottomRightY);
  }
}

function CreateDestroyFlowerOrderDestDropDown(ubDropDownMode: UINT8): boolean {
  /* static */ let usHeight: UINT16;
  /* static */ let fMouseRegionsCreated: boolean = false;

  switch (ubDropDownMode) {
    case Enum81.FLOWER_ORDER_DROP_DOWN_NO_ACTION: {
    } break;

    case Enum81.FLOWER_ORDER_DROP_DOWN_CREATE: {
      let i: UINT8;
      let usPosX: UINT16;
      let usPosY: UINT16;
      let usTemp: UINT16;
      let usFontHeight: UINT16 = GetFontHeight(FLOWER_ORDEER_DROP_DOWN_FONT());
      let ubTextFieldID: UINT8;

      if (fMouseRegionsCreated) {
        return false;
        break;
      }

      // Get the current text from the text box
      ubTextFieldID = GetActiveFieldID();

      // if its the personel sentiment field
      if (ubTextFieldID == 1) {
        Get16BitStringFromField(ubTextFieldID, gsSentimentTextField);
      } else if (ubTextFieldID == 2) {
        // else its the name field
        Get16BitStringFromField(ubTextFieldID, gsNameTextField);
      }

      SetActiveField(0);

      fMouseRegionsCreated = true;

      usPosX = FLOWER_ORDER_DROP_DOWN_CITY_START_X;
      usPosY = FLOWER_ORDER_DROP_DOWN_CITY_START_Y;
      for (i = 0; i < FLOWER_ORDER_NUMBER_OF_DROP_DOWN_LOCATIONS; i++) {
        MSYS_DefineRegion(gSelectedFlowerDropDownRegion[i], usPosX, (usPosY + 4), (usPosX + FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH), (usPosY + usFontHeight), MSYS_PRIORITY_HIGH + 3, Enum317.CURSOR_WWW, SelectFlowerDropDownMovementCallBack, SelectFlowerDropDownRegionCallBack);
        MSYS_AddRegion(gSelectedFlowerDropDownRegion[i]);
        MSYS_SetRegionUserData(gSelectedFlowerDropDownRegion[i], 0, i);

        usPosY += usFontHeight + 2;
      }
      usTemp = FLOWER_ORDER_DROP_DOWN_CITY_START_Y;
      usHeight = usPosY - usTemp + 10;

      gubFlowerDestDropDownMode = Enum81.FLOWER_ORDER_DROP_DOWN_DISPLAY;
      MSYS_EnableRegion(gSelectedFloristDisableDropDownRegion);

      // disable the text entry fields
      //			DisableAllTextFields();
      Get16BitStringFromField(1, gsSentimentTextField);
      KillTextInputMode();

      // disable the clear order and accept order buttons, (their rendering interferes with the drop down graphics)
    } break;

    case Enum81.FLOWER_ORDER_DROP_DOWN_DESTROY: {
      let i: UINT8;

      if (!fMouseRegionsCreated)
        break;

      for (i = 0; i < FLOWER_ORDER_NUMBER_OF_DROP_DOWN_LOCATIONS; i++)
        MSYS_RemoveRegion(gSelectedFlowerDropDownRegion[i]);

      // display the name on the title bar
      ColorFillVideoSurfaceArea(FRAME_BUFFER, FLOWER_ORDER_DROP_DOWN_LOCATION_X + 3, FLOWER_ORDER_DELIVERY_LOCATION_Y + 3, FLOWER_ORDER_DROP_DOWN_LOCATION_X + FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH, FLOWER_ORDER_DELIVERY_LOCATION_Y + FLOWER_ORDER_DELIVERY_LOCATION_HEIGHT - 2, Get16BPPColor(FROMRGB(0, 0, 0)));
      DrawTextToScreen((FlowerOrderLocations[gubCurrentlySelectedFlowerLocation].psCityLoc).value, FLOWER_ORDER_DROP_DOWN_CITY_START_X + 6, FLOWER_ORDER_DROP_DOWN_CITY_START_Y + 3, 0, FLOWER_ORDEER_DROP_DOWN_FONT(), FLOWER_ORDEER_DROP_DOWN_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

      // enable the drop down region
      MSYS_DisableRegion(gSelectedFloristDisableDropDownRegion);

      fPausedReDrawScreenFlag = true;
      fMouseRegionsCreated = false;
      gubFlowerDestDropDownMode = Enum81.FLOWER_ORDER_DROP_DOWN_NO_ACTION;

      // enable the text entry fields
      InitFlowerOrderTextInputBoxes();
    } break;

    case Enum81.FLOWER_ORDER_DROP_DOWN_DISPLAY: {
      let i: UINT8;
      let usPosY: UINT16;
      let usPosX: UINT16;
      let usFontHeight: UINT16 = GetFontHeight(FLOWER_ORDEER_DROP_DOWN_FONT());
      let hImageHandle: HVOBJECT;

      // Display the background for the drop down window
      ColorFillVideoSurfaceArea(FRAME_BUFFER, FLOWER_ORDER_DROP_DOWN_LOCATION_X, FLOWER_ORDER_DROP_DOWN_LOCATION_Y, FLOWER_ORDER_DROP_DOWN_LOCATION_X + FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH, FLOWER_ORDER_DROP_DOWN_LOCATION_Y + usHeight, Get16BPPColor(FROMRGB(0, 0, 0)));

      //
      // Place the border around the background
      //

      hImageHandle = GetVideoObject(guiDropDownBorder);

      usPosX = usPosY = 0;
      // blit top row of images
      for (i = 10; i < FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH - 10; i += 10) {
        // TOP ROW
        BltVideoObject(FRAME_BUFFER, hImageHandle, 1, i + FLOWER_ORDER_DROP_DOWN_LOCATION_X, usPosY + FLOWER_ORDER_DROP_DOWN_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);

        // BOTTOM ROW
        BltVideoObject(FRAME_BUFFER, hImageHandle, 6, i + FLOWER_ORDER_DROP_DOWN_LOCATION_X, usHeight - 10 + 6 + FLOWER_ORDER_DROP_DOWN_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);
      }

      // blit the left and right row of images
      usPosX = 0;
      for (i = 10; i < usHeight - 10; i += 10) {
        BltVideoObject(FRAME_BUFFER, hImageHandle, 3, usPosX + FLOWER_ORDER_DROP_DOWN_LOCATION_X, i + FLOWER_ORDER_DROP_DOWN_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);
        BltVideoObject(FRAME_BUFFER, hImageHandle, 4, usPosX + FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH - 4 + FLOWER_ORDER_DROP_DOWN_LOCATION_X, i + FLOWER_ORDER_DROP_DOWN_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);
      }

      // blt the corner images for the row
      // top left
      BltVideoObject(FRAME_BUFFER, hImageHandle, 0, 0 + FLOWER_ORDER_DROP_DOWN_LOCATION_X, usPosY + FLOWER_ORDER_DROP_DOWN_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);
      // top right
      BltVideoObject(FRAME_BUFFER, hImageHandle, 2, FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH - 10 + FLOWER_ORDER_DROP_DOWN_LOCATION_X, usPosY + FLOWER_ORDER_DROP_DOWN_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);
      // bottom left
      BltVideoObject(FRAME_BUFFER, hImageHandle, 5, 0 + FLOWER_ORDER_DROP_DOWN_LOCATION_X, usHeight - 10 + FLOWER_ORDER_DROP_DOWN_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);
      // bottom right
      BltVideoObject(FRAME_BUFFER, hImageHandle, 7, FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH - 10 + FLOWER_ORDER_DROP_DOWN_LOCATION_X, usHeight - 10 + FLOWER_ORDER_DROP_DOWN_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, null);

      // Display the list of cities
      usPosY = FLOWER_ORDER_DROP_DOWN_CITY_START_Y + 3;
      for (i = 0; i < FLOWER_ORDER_NUMBER_OF_DROP_DOWN_LOCATIONS; i++) {
        DrawTextToScreen((FlowerOrderLocations[i].psCityLoc).value, FLOWER_ORDER_DROP_DOWN_CITY_START_X + 6, usPosY, 0, FLOWER_ORDEER_DROP_DOWN_FONT(), FLOWER_ORDEER_DROP_DOWN_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
        usPosY += usFontHeight + 2;
      }

      FlowerOrderDrawSelectedCity(gubCurrentlySelectedFlowerLocation);

      InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
    } break;
  }
  return true;
}

function FlowerOrderDrawSelectedCity(ubNumber: UINT8): void {
  let usPosY: UINT16;
  let usFontHeight: UINT16 = GetFontHeight(FLOWER_ORDEER_DROP_DOWN_FONT());

  usPosY = (usFontHeight + 2) * ubNumber + FLOWER_ORDER_DROP_DOWN_CITY_START_Y;

  // display the name in the list
  ColorFillVideoSurfaceArea(FRAME_BUFFER, FLOWER_ORDER_DROP_DOWN_CITY_START_X, usPosY + 2, FLOWER_ORDER_DROP_DOWN_CITY_START_X + FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH - 9, usPosY + usFontHeight + 4, Get16BPPColor(FROMRGB(255, 255, 255)));

  SetFontShadow(NO_SHADOW);
  DrawTextToScreen((FlowerOrderLocations[ubNumber].psCityLoc).value, FLOWER_ORDER_DROP_DOWN_CITY_START_X + 6, (usPosY + 3), 0, FLOWER_ORDEER_DROP_DOWN_FONT(), 2, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  SetFontShadow(DEFAULT_SHADOW);

  FlowerOrderDisplayShippingLocationCity();
  SetFontShadow(DEFAULT_SHADOW);
}

function FlowerOrderDisplayShippingLocationCity(): void {
  // display the name on the title bar
  ColorFillVideoSurfaceArea(FRAME_BUFFER, FLOWER_ORDER_DROP_DOWN_LOCATION_X + 3, FLOWER_ORDER_DELIVERY_LOCATION_Y + 3, FLOWER_ORDER_DROP_DOWN_LOCATION_X + FLOWER_ORDER_DROP_DOWN_LOCATION_WIDTH, FLOWER_ORDER_DELIVERY_LOCATION_Y + FLOWER_ORDER_DELIVERY_LOCATION_HEIGHT - 2, Get16BPPColor(FROMRGB(0, 0, 0)));
  DrawTextToScreen((FlowerOrderLocations[gubCurrentlySelectedFlowerLocation].psCityLoc).value, FLOWER_ORDER_DELIVERY_LOCATION_X + 5, FLOWER_ORDER_DELIVERY_LOCATION_Y + 5, 0, FLOWER_ORDEER_SMALL_FONT(), FLOWER_ORDEER_SMALL_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
}

function InitFlowerOrderTextInputBoxes(): void {
  let uiStartLoc: UINT32 = 0;
  let sTemp: string /* wchar_t[640] */;
  let sText: string /* wchar_t[640] */;

  InitTextInputMode();
  SetTextInputFont(FONT12ARIAL());
  Set16BPPTextFieldColor(Get16BPPColor(FROMRGB(255, 255, 255)));
  SetBevelColors(Get16BPPColor(FROMRGB(136, 138, 135)), Get16BPPColor(FROMRGB(24, 61, 81)));
  SetTextInputRegularColors(2, FONT_WHITE);
  SetTextInputHilitedColors(FONT_WHITE, 2, 141);
  SetCursorColor(Get16BPPColor(FROMRGB(0, 0, 0)));

  AddUserInputField(FlowerOrderUserTextFieldCallBack);

  if (gbCurrentlySelectedCard != -1) {
    // Get and display the card saying
    // Display Flower Desc

    uiStartLoc = FLOR_CARD_TEXT_TITLE_SIZE * +gbCurrentlySelectedCard;
    LoadEncryptedDataFromFile(FLOR_CARD_TEXT_FILE, sTemp, uiStartLoc, FLOR_CARD_TEXT_TITLE_SIZE);
    CleanOutControlCodesFromString(sTemp, sText);

    wcsncpy(gsSentimentTextField, sText, FLOWER_ORDER_PERSONEL_SENTIMENT_NUM_CHARS - 1);

    gbCurrentlySelectedCard = -1;
  }

  if (gsSentimentTextField.length >= FLOWER_ORDER_PERSONEL_SENTIMENT_NUM_CHARS - 2) {
    gsSentimentTextField[FLOWER_ORDER_PERSONEL_SENTIMENT_NUM_CHARS - 1] = '\0';
  }

  // personal sentiment box
  AddTextInputField(FLOWER_ORDER_PERSONAL_SENT_BOX_X, FLOWER_ORDER_PERSONAL_SENT_BOX_Y, FLOWER_ORDER_PERSONAL_SENT_TEXT_WIDTH, FLOWER_ORDER_PERSONAL_SENT_TEXT_HEIGHT, MSYS_PRIORITY_HIGH + 2, gsSentimentTextField, FLOWER_ORDER_PERSONEL_SENTIMENT_NUM_CHARS, INPUTTYPE_ASCII);

  // Name box
  AddTextInputField(FLOWER_ORDER_NAME_TEXT_BOX_X, FLOWER_ORDER_NAME_TEXT_BOX_Y, FLOWER_ORDER_NAME_TEXT_BOX_WIDTH, FLOWER_ORDER_NAME_TEXT_BOX_HEIGHT, MSYS_PRIORITY_HIGH + 2, gsNameTextField, FLOWER_ORDER_NAME_FIELD_NUM_CHARS, INPUTTYPE_ASCII);
}

function DestroyFlowerOrderTextInputBoxes(): void {
  KillTextInputMode();
}

function HandleFloristOrderKeyBoardInput(): void {
  let InputEvent: InputAtom = createInputAtom();

  while (DequeueEvent(addressof(InputEvent)) == true) {
    if (!HandleTextInput(addressof(InputEvent)) && InputEvent.usEvent == KEY_DOWN) {
      let ubTextFieldID: UINT8;
      switch (InputEvent.usParam) {
        case ENTER:

          ubTextFieldID = GetActiveFieldID();

          // if its the personel sentiment field
          if (ubTextFieldID == 1) {
            Get16BitStringFromField(ubTextFieldID, gsSentimentTextField);
          } else if (ubTextFieldID == 2) {
            // else its the name field
            Get16BitStringFromField(ubTextFieldID, gsNameTextField);
          }

          SetActiveField(0);
          break;

        case ESC:
          SetActiveField(0);
          break;

        default:
          HandleKeyBoardShortCutsForLapTop(InputEvent.usEvent, InputEvent.usParam, InputEvent.usKeyState);
          break;
      }
    }
  }
}

function FlowerOrderUserTextFieldCallBack(ubID: UINT8, fEntering: boolean): void {
  if (fEntering) {
    //		SetActiveField(1);
  }
}

// Initialize the Florsit Order Page (reset some variables)
export function InitFloristOrderForm(): void {
  gsSentimentTextField[0] = 0;

  gfFLoristCheckBox0Down = false; // next day delviery
  gfFLoristCheckBox1Down = true; // when it gets there delivery
  gfFLoristCheckBox2Down = false;
  gfFLoristCheckBox3Down = false;
  gfFLoristCheckBox4Down = false;
  gfFLoristCheckBox5Down = false;

  guiFlowerPrice = 0;

  gubCurrentlySelectedFlowerLocation = 0;
  gbCurrentlySelectedCard = -1;

  gsSentimentTextField[0] = 0;
  gsNameTextField[0] = 0;
}

}
