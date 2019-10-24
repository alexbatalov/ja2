interface BobbyROrderLocationStruct {
  psCityLoc: Pointer<STR16>;
  usOverNightExpress: UINT16;
  us2DaysService: UINT16;
  usStandardService: UINT16;
}

let BobbyROrderLocations: BobbyROrderLocationStruct[] /* [] */ = [
  [ addressof(pDeliveryLocationStrings[0]), 20, 15, 10 ],
  [ addressof(pDeliveryLocationStrings[1]), 295, 150, 85 ],
  [ addressof(pDeliveryLocationStrings[2]), 200, 100, 50 ], // the only one that really matters
  [ addressof(pDeliveryLocationStrings[3]), 100, 55, 30 ],
  [ addressof(pDeliveryLocationStrings[4]), 95, 65, 40 ],
  [ addressof(pDeliveryLocationStrings[5]), 55, 40, 25 ],
  [ addressof(pDeliveryLocationStrings[6]), 35, 25, 15 ],
  [ addressof(pDeliveryLocationStrings[7]), 200, 100, 50 ],
  [ addressof(pDeliveryLocationStrings[8]), 190, 90, 45 ],
  [ addressof(pDeliveryLocationStrings[9]), 35, 25, 15 ],
  [ addressof(pDeliveryLocationStrings[10]), 100, 55, 30 ],
  [ addressof(pDeliveryLocationStrings[11]), 35, 25, 15 ],
  [ addressof(pDeliveryLocationStrings[12]), 45, 30, 20 ],
  [ addressof(pDeliveryLocationStrings[13]), 55, 40, 25 ],
  [ addressof(pDeliveryLocationStrings[14]), 100, 55, 30 ],
  [ addressof(pDeliveryLocationStrings[15]), 100, 55, 30 ],
  [ addressof(pDeliveryLocationStrings[16]), 45, 30, 20 ],
];

// drop down menu
const enum Enum69 {
  BR_DROP_DOWN_NO_ACTION,
  BR_DROP_DOWN_CREATE,
  BR_DROP_DOWN_DESTROY,
  BR_DROP_DOWN_DISPLAY,
}

const BOBBYR_ORDER_NUM_SHIPPING_CITIES = 17;
const BOBBYR_NUM_DISPLAYED_CITIES = 10;

const OVERNIGHT_EXPRESS = 1;
const TWO_BUSINESS_DAYS = 2;
const STANDARD_SERVICE = 3;

const MIN_SHIPPING_WEIGHT = 20;

const BOBBYR_ORDER_TITLE_TEXT_FONT = () => FONT14ARIAL();
const BOBBYR_ORDER_TITLE_TEXT_COLOR = 157;

const BOBBYR_FONT_BLACK = 2;

const BOBBYR_ORDER_STATIC_TEXT_FONT = () => FONT12ARIAL();
const BOBBYR_ORDER_STATIC_TEXT_COLOR = 145;

const BOBBYR_DISCLAIMER_FONT = () => FONT10ARIAL();

const BOBBYR_ORDER_DYNAMIC_TEXT_FONT = () => FONT12ARIAL();
const BOBBYR_ORDER_DYNAMIC_TEXT_COLOR = FONT_MCOLOR_WHITE;

const BOBBYR_ORDER_DROP_DOWN_SELEC_COLOR = FONT_MCOLOR_WHITE;

const BOBBYR_DROPDOWN_FONT = () => FONT12ARIAL();

const BOBBYR_ORDERGRID_X = LAPTOP_SCREEN_UL_X + 2;
const BOBBYR_ORDERGRID_Y = LAPTOP_SCREEN_WEB_UL_Y + 62;

const BOBBYR_BOBBY_RAY_TITLE_X = LAPTOP_SCREEN_UL_X + 171;
const BOBBYR_BOBBY_RAY_TITLE_Y = LAPTOP_SCREEN_WEB_UL_Y + 3;
const BOBBYR_BOBBY_RAY_TITLE_WIDTH = 160;
const BOBBYR_BOBBY_RAY_TITLE_HEIGHT = 35;

const BOBBYR_LOCATION_BOX_X = LAPTOP_SCREEN_UL_X + 276;
const BOBBYR_LOCATION_BOX_Y = LAPTOP_SCREEN_WEB_UL_Y + 62;

const BOBBYR_DELIVERYSPEED_X = LAPTOP_SCREEN_UL_X + 276;
const BOBBYR_DELIVERYSPEED_Y = LAPTOP_SCREEN_WEB_UL_Y + 149;

const BOBBYR_CLEAR_ORDER_X = LAPTOP_SCREEN_UL_X + 309;
const BOBBYR_CLEAR_ORDER_Y = LAPTOP_SCREEN_WEB_UL_Y + 268; // LAPTOP_SCREEN_WEB_UL_Y + 252

const BOBBYR_ACCEPT_ORDER_X = LAPTOP_SCREEN_UL_X + 299;
const BOBBYR_ACCEPT_ORDER_Y = LAPTOP_SCREEN_WEB_UL_Y + 303; // LAPTOP_SCREEN_WEB_UL_Y + 288

const BOBBYR_GRID_ROW_OFFSET = 20;
const BOBBYR_GRID_TITLE_OFFSET = 27;

const BOBBYR_GRID_FIRST_COLUMN_X = 3; // BOBBYR_ORDERGRID_X + 3
const BOBBYR_GRID_FIRST_COLUMN_Y = 37; // BOBBYR_ORDERGRID_Y + 37
const BOBBYR_GRID_FIRST_COLUMN_WIDTH = 23;

const BOBBYR_GRID_SECOND_COLUMN_X = 28; // BOBBYR_ORDERGRID_X + 28
const BOBBYR_GRID_SECOND_COLUMN_Y = BOBBYR_GRID_FIRST_COLUMN_Y;
const BOBBYR_GRID_SECOND_COLUMN_WIDTH = 40;

const BOBBYR_GRID_THIRD_COLUMN_X = 70; // BOBBYR_ORDERGRID_X + 70
const BOBBYR_GRID_THIRD_COLUMN_Y = BOBBYR_GRID_FIRST_COLUMN_Y;
const BOBBYR_GRID_THIRD_COLUMN_WIDTH = 111;

const BOBBYR_GRID_FOURTH_COLUMN_X = 184; // BOBBYR_ORDERGRID_X + 184
const BOBBYR_GRID_FOURTH_COLUMN_Y = BOBBYR_GRID_FIRST_COLUMN_Y;
const BOBBYR_GRID_FOURTH_COLUMN_WIDTH = 40;

const BOBBYR_GRID_FIFTH_COLUMN_X = 224; // BOBBYR_ORDERGRID_X + 224
const BOBBYR_GRID_FIFTH_COLUMN_Y = BOBBYR_GRID_FIRST_COLUMN_Y;
const BOBBYR_GRID_FIFTH_COLUMN_WIDTH = 42;

const BOBBYR_SUBTOTAL_WIDTH = 212;
const BOBBYR_SUBTOTAL_X = BOBBYR_GRID_FIRST_COLUMN_X;
const BOBBYR_SUBTOTAL_Y = BOBBYR_GRID_FIRST_COLUMN_Y + BOBBYR_GRID_ROW_OFFSET * 10 + 3;

const BOBBYR_SHIPPING_N_HANDLE_Y = BOBBYR_SUBTOTAL_Y + 17;
const BOBBYR_GRAND_TOTAL_Y = BOBBYR_SHIPPING_N_HANDLE_Y + 20;

const BOBBYR_SHIPPING_LOCATION_TEXT_X = BOBBYR_LOCATION_BOX_X + 8;
const BOBBYR_SHIPPING_LOCATION_TEXT_Y = BOBBYR_LOCATION_BOX_Y + 8;

const BOBBYR_SHIPPING_SPEED_X = BOBBYR_SHIPPING_LOCATION_TEXT_X;
const BOBBYR_SHIPPING_SPEED_Y = BOBBYR_DELIVERYSPEED_Y + 11;

const BOBBYR_SHIPPING_COST_X = BOBBYR_SHIPPING_SPEED_X + 130;

const BOBBYR_OVERNIGHT_EXPRESS_Y = BOBBYR_DELIVERYSPEED_Y + 42;

const BOBBYR_ORDER_FORM_TITLE_X = BOBBYR_BOBBY_RAY_TITLE_X;
const BOBBYR_ORDER_FORM_TITLE_Y = BOBBYR_BOBBY_RAY_TITLE_Y + 37;
const BOBBYR_ORDER_FORM_TITLE_WIDTH = 159;

const BOBBYR_BACK_BUTTON_X = 130;
const BOBBYR_BACK_BUTTON_Y = 400 + LAPTOP_SCREEN_WEB_DELTA_Y + 4;

const BOBBYR_HOME_BUTTON_X = 515;
const BOBBYR_HOME_BUTTON_Y = BOBBYR_BACK_BUTTON_Y;

const BOBBYR_SHIPMENT_BUTTON_X = (LAPTOP_SCREEN_UL_X + (LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X - 75) / 2);
const BOBBYR_SHIPMENT_BUTTON_Y = BOBBYR_BACK_BUTTON_Y;

const SHIPPING_SPEED_LIGHT_WIDTH = 9;
const SHIPPING_SPEED_LIGHT_HEIGHT = 9;

const BOBBYR_CONFIRM_ORDER_X = 220;
const BOBBYR_CONFIRM_ORDER_Y = 170;

const BOBBYR_CITY_START_LOCATION_X = BOBBYR_LOCATION_BOX_X + 6;
const BOBBYR_CITY_START_LOCATION_Y = BOBBYR_LOCATION_BOX_Y + 61;
const BOBBYR_DROP_DOWN_WIDTH = 182; // 203
const BOBBYR_DROP_DOWN_HEIGHT = 19;
const BOBBYR_CITY_NAME_OFFSET = 6;

const BOBBYR_SCROLL_AREA_X = BOBBYR_CITY_START_LOCATION_X + BOBBYR_DROP_DOWN_WIDTH;
const BOBBYR_SCROLL_AREA_Y = BOBBYR_CITY_START_LOCATION_Y;
const BOBBYR_SCROLL_AREA_WIDTH = 22;
const BOBBYR_SCROLL_AREA_HEIGHT = 139;
const BOBBYR_SCROLL_AREA_HEIGHT_MINUS_ARROWS = (BOBBYR_SCROLL_AREA_HEIGHT - (2 * BOBBYR_SCROLL_ARROW_HEIGHT) - 8);

const BOBBYR_SCROLL_UP_ARROW_X = BOBBYR_SCROLL_AREA_X;
const BOBBYR_SCROLL_UP_ARROW_Y = BOBBYR_SCROLL_AREA_Y + 5;
const BOBBYR_SCROLL_DOWN_ARROW_X = BOBBYR_SCROLL_UP_ARROW_X;
const BOBBYR_SCROLL_DOWN_ARROW_Y = BOBBYR_SCROLL_AREA_Y + BOBBYR_SCROLL_AREA_HEIGHT - 24;
const BOBBYR_SCROLL_ARROW_WIDTH = 18;
const BOBBYR_SCROLL_ARROW_HEIGHT = 20;

const BOBBYR_SHIPPING_LOC_AREA_L_X = BOBBYR_LOCATION_BOX_X + 9;
const BOBBYR_SHIPPING_LOC_AREA_T_Y = BOBBYR_LOCATION_BOX_Y + 39;

const BOBBYR_SHIPPING_LOC_AREA_R_X = BOBBYR_LOCATION_BOX_X + 206;
const BOBBYR_SHIPPING_LOC_AREA_B_Y = BOBBYR_LOCATION_BOX_Y + 57;

const BOBBYR_SHIPPING_SPEED_NUMBER_X = BOBBYR_SHIPPING_COST_X;
const BOBBYR_SHIPPING_SPEED_NUMBER_WIDTH = 37;
const BOBBYR_SHIPPING_SPEED_NUMBER_1_Y = BOBBYR_OVERNIGHT_EXPRESS_Y;

const BOBBYR_SHIPPING_SPEED_NUMBER_2_Y = BOBBYR_OVERNIGHT_EXPRESS_Y;
const BOBBYR_SHIPPING_SPEED_NUMBER_3_Y = BOBBYR_OVERNIGHT_EXPRESS_Y;

const BOBBYR_TOTAL_SAVED_AREA_X = BOBBYR_ORDERGRID_X + 221;
const BOBBYR_TOTAL_SAVED_AREA_Y = BOBBYR_ORDERGRID_Y + 237;

const BOBBYR_USED_WARNING_X = 122;
const BOBBYR_USED_WARNING_Y = 382 + LAPTOP_SCREEN_WEB_DELTA_Y;

const BOBBYR_PACKAXGE_WEIGHT_X = BOBBYR_LOCATION_BOX_X;
const BOBBYR_PACKAXGE_WEIGHT_Y = LAPTOP_SCREEN_WEB_UL_Y + 249;
const BOBBYR_PACKAXGE_WEIGHT_WIDTH = 188;

let gShippingSpeedAreas: UINT16[] /* [] */ = [
  585, 218 + LAPTOP_SCREEN_WEB_DELTA_Y,
  585, 238 + LAPTOP_SCREEN_WEB_DELTA_Y,
  585, 258 + LAPTOP_SCREEN_WEB_DELTA_Y,
];

// Identifier for the images
let guiBobbyRayTitle: UINT32;
let guiBobbyROrderGrid: UINT32;
let guiBobbyRLocationGraphic: UINT32;
let guiDeliverySpeedGraphic: UINT32;
let guiConfirmGraphic: UINT32;
let guiTotalSaveArea: UINT32; // used as a savebuffer for the subtotal, s&h, and grand total values
let guiDropDownBorder: UINT32;
let guiGoldArrowImages: UINT32;
let guiPackageWeightImage: UINT32;

let gfReDrawBobbyOrder: BOOLEAN = FALSE;

let giGrandTotal: INT32;
let guiShippingCost: UINT32;
let guiSubTotal: UINT32;

let gubSelectedLight: UINT8;

let gfDrawConfirmOrderGrpahic: BOOLEAN;
let gfDestroyConfirmGrphiArea: BOOLEAN;

let gfCanAcceptOrder: BOOLEAN;

let gubDropDownAction: UINT8;
let gbSelectedCity: INT8 = -1; // keeps track of the currently selected city
let gubCityAtTopOfList: UINT8;

let gfRemoveItemsFromStock: BOOLEAN = FALSE;

let gpNewBobbyrShipments: Pointer<NewBobbyRayOrderStruct>;
let giNumberOfNewBobbyRShipment: INT32;

//
// Buttons
//

let guiBobbyRClearOrder: UINT32;
let guiBobbyRClearOrderImage: INT32;

let guiBobbyRAcceptOrder: UINT32;
let guiBobbyRAcceptOrderImage: INT32;

let guiBobbyRBack: UINT32;
let guiBobbyRBackImage: INT32;

let guiBobbyRHome: UINT32;
let guiBobbyRHomeImage: INT32;

let guiBobbyRGotoShipmentPage: UINT32;
let giBobbyRGotoShipmentPageImage: INT32;

// mouse region for the shipping speed selection area
let gSelectedShippingSpeedRegion: MOUSE_REGION[] /* [3] */;

// mouse region for the confirm area
let gSelectedConfirmOrderRegion: MOUSE_REGION;

// mouse region for the drop down city location area
let gSelectedDropDownRegion: MOUSE_REGION[] /* [BOBBYR_ORDER_NUM_SHIPPING_CITIES] */;

// mouse region for scroll area for the drop down city location area
let gSelectedScrollAreaDropDownRegion: MOUSE_REGION[] /* [BOBBYR_ORDER_NUM_SHIPPING_CITIES] */;

// mouse region to activate the shipping location drop down
let gSelectedActivateCityDroDownRegion: MOUSE_REGION;

// mouse region to close the drop down menu
let gSelectedCloseDropDownRegion: MOUSE_REGION;

// mouse region to click on the title to go to the home page
let gSelectedTitleLinkRegion: MOUSE_REGION;

// mouse region to click on the up or down arrow on the scroll area
let gSelectedUpDownArrowOnScrollAreaRegion: MOUSE_REGION[] /* [2] */;

// ppp

function GameInitBobbyRMailOrder(): void {
  gubSelectedLight = 0;

  gpNewBobbyrShipments = NULL;
  giNumberOfNewBobbyRShipment = 0;
}

function EnterBobbyRMailOrder(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let i: UINT16;

  gfReDrawBobbyOrder = FALSE;
  gfDrawConfirmOrderGrpahic = FALSE;
  gfDestroyConfirmGrphiArea = FALSE;
  gfCanAcceptOrder = TRUE;
  gubDropDownAction = Enum69.BR_DROP_DOWN_NO_ACTION;

  // load the Order Grid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BobbyOrderGrid.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBobbyROrderGrid)));

  // load the Location graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BobbyLocationBox.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBobbyRLocationGraphic)));

  // load the delivery speed graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BobbyDeliverySpeed.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiDeliverySpeedGraphic)));

  // load the delivery speed graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, Enum326.MLG_CONFIRMORDER);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiConfirmGraphic)));

  // load the delivery speed graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\TotalSaveArea.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiTotalSaveArea)));

  // border
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\TactPopUp.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiDropDownBorder)));

  // Gold Arrow for the scroll area
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\GoldArrows.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiGoldArrowImages)));

  // Package Weight Graphic
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\PackageWeight.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiPackageWeightImage)));

  InitBobbyRWoodBackground();

  //
  // Init the button areas
  //

  // Clear Order button
  guiBobbyRClearOrderImage = LoadButtonImage("LAPTOP\\EraseOrderButton.sti", -1, 0, -1, 1, -1);
  guiBobbyRClearOrder = CreateIconAndTextButton(guiBobbyRClearOrderImage, BobbyROrderFormText[Enum349.BOBBYR_CLEAR_ORDER], BOBBYR_ORDER_TITLE_TEXT_FONT, BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_CLEAR_ORDER_X, BOBBYR_CLEAR_ORDER_Y + 4, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnBobbyRClearOrderCallback);
  SetButtonCursor(guiBobbyRClearOrder, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiBobbyRClearOrder, Enum29.DISABLED_STYLE_NONE);
  SpecifyButtonTextOffsets(guiBobbyRClearOrder, 39, 10, TRUE);

  // Accept Order button
  guiBobbyRAcceptOrderImage = LoadButtonImage("LAPTOP\\AcceptOrderButton.sti", 2, 0, -1, 1, -1);
  guiBobbyRAcceptOrder = CreateIconAndTextButton(guiBobbyRAcceptOrderImage, BobbyROrderFormText[Enum349.BOBBYR_ACCEPT_ORDER], BOBBYR_ORDER_TITLE_TEXT_FONT, BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_ACCEPT_ORDER_X, BOBBYR_ACCEPT_ORDER_Y + 4, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnBobbyRAcceptOrderCallback);
  SetButtonCursor(guiBobbyRAcceptOrder, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyButtonTextOffsets(guiBobbyRAcceptOrder, 43, 24, TRUE);

  SpecifyDisabledButtonStyle(guiBobbyRAcceptOrder, Enum29.DISABLED_STYLE_SHADED);

  if (gbSelectedCity == -1)
    DisableButton(guiBobbyRAcceptOrder);

  // if there is anything to buy, dont disable the accept button
  //	if( !IsAnythingPurchasedFromBobbyRayPage() )
  {
    //		DisableButton( guiBobbyRAcceptOrder );
  }

  guiBobbyRBackImage = LoadButtonImage("LAPTOP\\CatalogueButton.sti", -1, 0, -1, 1, -1);
  guiBobbyRBack = CreateIconAndTextButton(guiBobbyRBackImage, BobbyROrderFormText[Enum349.BOBBYR_BACK], BOBBYR_GUNS_BUTTON_FONT, BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_BACK_BUTTON_X, BOBBYR_BACK_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnBobbyRBackCallback);
  SetButtonCursor(guiBobbyRBack, Enum317.CURSOR_LAPTOP_SCREEN);

  guiBobbyRHomeImage = UseLoadedButtonImage(guiBobbyRBackImage, -1, 0, -1, 1, -1);
  guiBobbyRHome = CreateIconAndTextButton(guiBobbyRHomeImage, BobbyROrderFormText[Enum349.BOBBYR_HOME], BOBBYR_GUNS_BUTTON_FONT, BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_HOME_BUTTON_X, BOBBYR_HOME_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnBobbyRHomeCallback);
  SetButtonCursor(guiBobbyRHome, Enum317.CURSOR_LAPTOP_SCREEN);

  giBobbyRGotoShipmentPageImage = UseLoadedButtonImage(guiBobbyRBackImage, -1, 0, -1, 1, -1);
  guiBobbyRGotoShipmentPage = CreateIconAndTextButton(giBobbyRGotoShipmentPageImage, BobbyROrderFormText[Enum349.BOBBYR_GOTOSHIPMENT_PAGE], BOBBYR_GUNS_BUTTON_FONT, BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_SHIPMENT_BUTTON_X, BOBBYR_SHIPMENT_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnBobbyRGotoShipmentPageCallback);
  SetButtonCursor(guiBobbyRGotoShipmentPage, Enum317.CURSOR_LAPTOP_SCREEN);

  for (i = 0; i < 3; i++) {
    MSYS_DefineRegion(addressof(gSelectedShippingSpeedRegion[i]), gShippingSpeedAreas[i * 2], gShippingSpeedAreas[i * 2 + 1], (gShippingSpeedAreas[i * 2] + SHIPPING_SPEED_LIGHT_WIDTH), (gShippingSpeedAreas[i * 2 + 1] + SHIPPING_SPEED_LIGHT_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectShippingSpeedRegionCallBack);
    MSYS_AddRegion(addressof(gSelectedShippingSpeedRegion[i]));
    MSYS_SetRegionUserData(addressof(gSelectedShippingSpeedRegion[i]), 0, i);
  }

  // confirmorder mouse region, occupies the entrie screen and is present only when the confirm order graphic
  // s on screen.  When user clicks anywhere the graphic disappears
  MSYS_DefineRegion(addressof(gSelectedConfirmOrderRegion), LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y, MSYS_PRIORITY_HIGH + 1, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectConfirmOrderRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedConfirmOrderRegion));
  MSYS_DisableRegion(addressof(gSelectedConfirmOrderRegion));

  // click on the shipping location to activate the drop down menu
  MSYS_DefineRegion(addressof(gSelectedActivateCityDroDownRegion), BOBBYR_SHIPPING_LOC_AREA_L_X, BOBBYR_SHIPPING_LOC_AREA_T_Y, BOBBYR_SHIPPING_LOC_AREA_R_X, BOBBYR_SHIPPING_LOC_AREA_B_Y, MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectActivateCityDroDownRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedActivateCityDroDownRegion));

  // click anywhere on the screen to close the window( only when the drop down window is active)
  MSYS_DefineRegion(addressof(gSelectedCloseDropDownRegion), LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y, MSYS_PRIORITY_HIGH - 1, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, SelectCloseDroDownRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedCloseDropDownRegion));
  MSYS_DisableRegion(addressof(gSelectedCloseDropDownRegion));

  CreateBobbyRayOrderTitle();

  guiShippingCost = 0;

  gfRemoveItemsFromStock = FALSE;

  RenderBobbyRMailOrder();
  return TRUE;
}

function ExitBobbyRMailOrder(): void {
  let i: UINT16;

  // if we are to remove the items from stock
  if (gfRemoveItemsFromStock) {
    // Remove the items for Boby Rqys Inventory
    RemovePurchasedItemsFromBobbyRayInventory();
  }

  DestroyBobbyROrderTitle();

  DeleteVideoObjectFromIndex(guiBobbyROrderGrid);
  DeleteVideoObjectFromIndex(guiBobbyRLocationGraphic);
  DeleteVideoObjectFromIndex(guiDeliverySpeedGraphic);
  DeleteVideoObjectFromIndex(guiConfirmGraphic);
  DeleteVideoObjectFromIndex(guiTotalSaveArea);
  DeleteVideoObjectFromIndex(guiDropDownBorder);
  DeleteVideoObjectFromIndex(guiGoldArrowImages);
  DeleteVideoObjectFromIndex(guiPackageWeightImage);

  UnloadButtonImage(guiBobbyRClearOrderImage);
  RemoveButton(guiBobbyRClearOrder);

  UnloadButtonImage(guiBobbyRAcceptOrderImage);
  RemoveButton(guiBobbyRAcceptOrder);

  UnloadButtonImage(guiBobbyRBackImage);
  RemoveButton(guiBobbyRBack);

  UnloadButtonImage(giBobbyRGotoShipmentPageImage);
  RemoveButton(guiBobbyRGotoShipmentPage);

  RemoveButton(guiBobbyRHome);
  UnloadButtonImage(guiBobbyRHomeImage);

  DeleteBobbyRWoodBackground();

  for (i = 0; i < 3; i++) {
    MSYS_RemoveRegion(addressof(gSelectedShippingSpeedRegion[i]));
  }

  MSYS_RemoveRegion(addressof(gSelectedConfirmOrderRegion));
  MSYS_RemoveRegion(addressof(gSelectedActivateCityDroDownRegion));
  MSYS_RemoveRegion(addressof(gSelectedCloseDropDownRegion));

  // if the drop down box is active, destroy it
  gubDropDownAction = Enum69.BR_DROP_DOWN_DESTROY;
  CreateDestroyBobbyRDropDown(Enum69.BR_DROP_DOWN_DESTROY);
}

function HandleBobbyRMailOrder(): void {
  if (gfReDrawBobbyOrder) {
    //		RenderBobbyRMailOrder();
    fPausedReDrawScreenFlag = TRUE;
    gfReDrawBobbyOrder = FALSE;
  }

  if (gfDrawConfirmOrderGrpahic) {
    let hPixHandle: HVOBJECT;

    // Bobbyray title
    GetVideoObject(addressof(hPixHandle), guiConfirmGraphic);
    BltVideoObjectOutlineShadowFromIndex(FRAME_BUFFER, guiConfirmGraphic, 0, BOBBYR_CONFIRM_ORDER_X + 3, BOBBYR_CONFIRM_ORDER_Y + 3);

    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_CONFIRM_ORDER_X, BOBBYR_CONFIRM_ORDER_Y, VO_BLT_SRCTRANSPARENCY, NULL);
    InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);

    gfDrawConfirmOrderGrpahic = FALSE;
  }

  if (gfDestroyConfirmGrphiArea) {
    gfDestroyConfirmGrphiArea = FALSE;
    gfReDrawBobbyOrder = TRUE;
    MSYS_DisableRegion(addressof(gSelectedConfirmOrderRegion));
    gfCanAcceptOrder = TRUE;
  }

  if (gubDropDownAction != Enum69.BR_DROP_DOWN_NO_ACTION) {
    CreateDestroyBobbyRDropDown(gubDropDownAction);

    if (gubDropDownAction == Enum69.BR_DROP_DOWN_CREATE)
      gubDropDownAction = Enum69.BR_DROP_DOWN_DISPLAY;
    else
      gubDropDownAction = Enum69.BR_DROP_DOWN_NO_ACTION;
  }
}

function RenderBobbyRMailOrder(): void {
  let usPosY: UINT16;
  let hPixHandle: HVOBJECT;
  let usHeight: UINT16; // usWidth,
  let sTemp: CHAR16[] /* [128] */;

  DrawBobbyRWoodBackground();

  DrawBobbyROrderTitle();

  // Order Grid
  GetVideoObject(addressof(hPixHandle), guiBobbyROrderGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_ORDERGRID_X, BOBBYR_ORDERGRID_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Location graphic
  GetVideoObject(addressof(hPixHandle), guiBobbyRLocationGraphic);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_LOCATION_BOX_X, BOBBYR_LOCATION_BOX_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // DeliverySpeedGraphic
  GetVideoObject(addressof(hPixHandle), guiDeliverySpeedGraphic);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_DELIVERYSPEED_X, BOBBYR_DELIVERYSPEED_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Package Weight
  GetVideoObject(addressof(hPixHandle), guiPackageWeightImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_PACKAXGE_WEIGHT_X, BOBBYR_PACKAXGE_WEIGHT_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  //
  // Display the STATIC text
  //

  // Output the title
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_ORDER_FORM], BOBBYR_ORDER_FORM_TITLE_X, BOBBYR_ORDER_FORM_TITLE_Y, BOBBYR_ORDER_FORM_TITLE_WIDTH, BOBBYR_ORDER_TITLE_TEXT_FONT, BOBBYR_ORDER_TITLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  /*
          //Output the qty
          DrawTextToScreen(BobbyROrderFormText[BOBBYR_QTY], BOBBYR_GRID_FIRST_COLUMN_X, BOBBYR_GRID_FIRST_COLUMN_Y-BOBBYR_GRID_TITLE_OFFSET, BOBBYR_GRID_FIRST_COLUMN_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

          //Create a string for the weight ( %s ) ( where %s is the weight string, either kg or lbs )
          swprintf( sTemp, BobbyROrderFormText[BOBBYR_WEIGHT], GetWeightUnitString( ) );

          //Output the Weight
          DisplayWrappedString(BOBBYR_GRID_SECOND_COLUMN_X, BOBBYR_GRID_SECOND_COLUMN_Y-30, BOBBYR_GRID_SECOND_COLUMN_WIDTH, 2, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, sTemp, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED );

          //Output the name
          DrawTextToScreen(BobbyROrderFormText[BOBBYR_NAME], BOBBYR_GRID_THIRD_COLUMN_X, BOBBYR_GRID_THIRD_COLUMN_Y-BOBBYR_GRID_TITLE_OFFSET, BOBBYR_GRID_THIRD_COLUMN_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

          //Output the unit price
          DisplayWrappedString(BOBBYR_GRID_FOURTH_COLUMN_X, BOBBYR_GRID_FOURTH_COLUMN_Y-30, BOBBYR_GRID_FOURTH_COLUMN_WIDTH, 2, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, BobbyROrderFormText[BOBBYR_UNIT_PRICE], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

          //Output the total
          DrawTextToScreen(BobbyROrderFormText[BOBBYR_TOTAL], BOBBYR_GRID_FIFTH_COLUMN_X, BOBBYR_GRID_FIFTH_COLUMN_Y-BOBBYR_GRID_TITLE_OFFSET, BOBBYR_GRID_FIFTH_COLUMN_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

          //Output the sub total, shipping and handling, and the grand total
          DrawTextToScreen(BobbyROrderFormText[BOBBYR_SUB_TOTAL], BOBBYR_SUBTOTAL_X, BOBBYR_SUBTOTAL_Y, BOBBYR_SUBTOTAL_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
          DrawTextToScreen(BobbyROrderFormText[BOBBYR_S_H], BOBBYR_SUBTOTAL_X, BOBBYR_SHIPPING_N_HANDLE_Y, BOBBYR_SUBTOTAL_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
          DrawTextToScreen(BobbyROrderFormText[BOBBYR_GRAND_TOTAL], BOBBYR_SUBTOTAL_X, BOBBYR_GRAND_TOTAL_Y, BOBBYR_SUBTOTAL_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  */

  // Output the shipping location
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_SHIPPING_LOCATION], BOBBYR_SHIPPING_LOCATION_TEXT_X, BOBBYR_SHIPPING_LOCATION_TEXT_Y, 0, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Output the shiupping speed
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_SHIPPING_SPEED], BOBBYR_SHIPPING_SPEED_X, BOBBYR_SHIPPING_SPEED_Y, 0, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Create a string for the weight ( %s ) ( where %s is the weight string, either kg or lbs )
  swprintf(sTemp, BobbyROrderFormText[Enum349.BOBBYR_COST], GetWeightUnitString());

  // Output the cost
  DrawTextToScreen(sTemp, BOBBYR_SHIPPING_COST_X, BOBBYR_SHIPPING_SPEED_Y, 0, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Output the overnight, business days, standard service
  usPosY = BOBBYR_OVERNIGHT_EXPRESS_Y;
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_OVERNIGHT_EXPRESS], BOBBYR_SHIPPING_SPEED_X, usPosY, 0, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  usPosY += BOBBYR_GRID_ROW_OFFSET;
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_BUSINESS_DAYS], BOBBYR_SHIPPING_SPEED_X, usPosY, 0, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  usPosY += BOBBYR_GRID_ROW_OFFSET;
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_STANDARD_SERVICE], BOBBYR_SHIPPING_SPEED_X, usPosY, 0, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  //	DisplayPurchasedItems();
  DisplayPurchasedItems(TRUE, BOBBYR_ORDERGRID_X, BOBBYR_ORDERGRID_Y, BobbyRayPurchases, FALSE, -1);

  DrawShippingSpeedLights(gubSelectedLight);

  DisplayShippingLocationCity();

  // Display the 'used' text at the bottom of the screen
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_USED_TEXT], BOBBYR_USED_WARNING_X, BOBBYR_USED_WARNING_Y + 1, 0, BOBBYR_DISCLAIMER_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED | TEXT_SHADOWED);

  // Display the minimum weight disclaimer at the bottom of the page
  usHeight = GetFontHeight(BOBBYR_DISCLAIMER_FONT) + 2;
  swprintf(sTemp, "%s %2.1f %s.", BobbyROrderFormText[Enum349.BOBBYR_MINIMUM_WEIGHT], GetWeightBasedOnMetricOption(MIN_SHIPPING_WEIGHT) / 10.0, GetWeightUnitString());
  DrawTextToScreen(sTemp, BOBBYR_USED_WARNING_X, (BOBBYR_USED_WARNING_Y + usHeight + 1), 0, BOBBYR_DISCLAIMER_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED | TEXT_SHADOWED);

  // Calculate and display the total package weight
  DisplayPackageWeight();

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function BtnBobbyRClearOrderCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    memset(addressof(BobbyRayPurchases), 0, sizeof(BobbyRayPurchaseStruct) * MAX_PURCHASE_AMOUNT);
    gubSelectedLight = 0;
    gfReDrawBobbyOrder = TRUE;
    gbSelectedCity = -1;
    gubCityAtTopOfList = 0;

    // Get rid of the city drop dowm, if it is being displayed
    gubDropDownAction = Enum69.BR_DROP_DOWN_DESTROY;

    // disable the accept order button
    DisableButton(guiBobbyRAcceptOrder);

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnBobbyRAcceptOrderCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    if (guiSubTotal && gfCanAcceptOrder) {
      // if the player doesnt have enough money
      if (LaptopSaveInfo.iCurrentBalance < giGrandTotal) {
        DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, BobbyROrderFormText[Enum349.BOBBYR_CANT_AFFORD_PURCHASE], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL);
      } else {
        let zTemp: wchar_t[] /* [128] */;

        // if the city is Drassen, and the airport sector is player controlled
        if (gbSelectedCity == Enum70.BR_DRASSEN && !StrategicMap[SECTOR_INFO_TO_STRATEGIC_INDEX(Enum123.SEC_B13)].fEnemyControlled) {
          // Quick hack to bypass the confirmation box
          ConfirmBobbyRPurchaseMessageBoxCallBack(MSG_BOX_RETURN_YES);
        } else {
          // else pop up a confirmation box
          swprintf(zTemp, BobbyROrderFormText[Enum349.BOBBYR_CONFIRM_DEST], BobbyROrderLocations[gbSelectedCity].psCityLoc.value);
          DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, zTemp, Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_YESNO, ConfirmBobbyRPurchaseMessageBoxCallBack);
        }

        /*				//if the shipment is going to Drassen, add the inventory
                                        if( gbSelectedCity == BR_DRASSEN )
                                        {
        //					BobbyRayOrderStruct *pBobbyRayPurchase;
        //					UINT32	uiResetTimeSec;
                                                UINT8	i, ubCount;
                                                UINT8	cnt;
                                                INT8		bDaysAhead;

                                                //if we need to add more array elements for the Order Array
                                                if( LaptopSaveInfo.usNumberOfBobbyRayOrderItems <= LaptopSaveInfo.usNumberOfBobbyRayOrderUsed )
                                                {
                                                        LaptopSaveInfo.usNumberOfBobbyRayOrderItems++;
                                                        LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = MemRealloc( LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray, sizeof( BobbyRayOrderStruct ) * LaptopSaveInfo.usNumberOfBobbyRayOrderItems );
                                                        if( LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray == NULL )
                                                                return;

                                                        memset( &LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ LaptopSaveInfo.usNumberOfBobbyRayOrderItems - 1 ], 0, sizeof( BobbyRayOrderStruct ) );
                                                }

                                                for( cnt =0; cnt< LaptopSaveInfo.usNumberOfBobbyRayOrderItems; cnt++ )
                                                {
                                                        //get an empty element in the array
                                                        if( !LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].fActive )
                                                                break;
                                                }

                                                //gets reset when the confirm order graphic disappears
                                                gfCanAcceptOrder = FALSE;

        //					pBobbyRayPurchase = MemAlloc( sizeof( BobbyRayOrderStruct ) );
        //					memset(pBobbyRayPurchase, 0, sizeof( BobbyRayOrderStruct ) );


                                                ubCount = 0;
                                                for(i=0; i<MAX_PURCHASE_AMOUNT; i++)
                                                {
                                                        //if the item was purchased
                                                        if( BobbyRayPurchases[ i ].ubNumberPurchased )
                                                        {
                                                                //copy the purchases into the struct that will be added to the queue
                                                                memcpy(&LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].BobbyRayPurchase[ ubCount ] , &BobbyRayPurchases[i],  sizeof(BobbyRayPurchaseStruct));
                                                                ubCount ++;
                                                        }
                                                }

                                                LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].ubNumberPurchases = ubCount;
                                                LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].fActive = TRUE;
                                                LaptopSaveInfo.usNumberOfBobbyRayOrderUsed++;

                                                //get the length of time to receive the shipment
                                                if( gubSelectedLight == 0 )
                                                {
                                                        bDaysAhead = OVERNIGHT_EXPRESS;
                                                        //uiResetTimeSec = GetMidnightOfFutureDayInMinutes( OVERNIGHT_EXPRESS );
                                                }
                                                else if( gubSelectedLight == 1 )
                                                {
                                                        bDaysAhead = TWO_BUSINESS_DAYS;
                                                        //uiResetTimeSec = GetMidnightOfFutureDayInMinutes( TWO_BUSINESS_DAYS );
                                                }
                                                else if( gubSelectedLight == 2 )
                                                {
                                                        bDaysAhead = STANDARD_SERVICE;
                                                        //uiResetTimeSec = GetMidnightOfFutureDayInMinutes( STANDARD_SERVICE );
                                                }
                                                else
                                                {
                                                        bDaysAhead = 0;
                                                        //uiResetTimeSec = 0;
                                                }

                                                if (gMercProfiles[99].bLife == 0)
                                                {
                                                        // Sal is dead, so Pablo is dead, so the airport is badly run
                                                        bDaysAhead += (UINT8) Random( 5 ) + 1;
                                                }

                                                //add a random amount between so it arrives between 8:00 am and noon
                                                //uiResetTimeSec += (8 + Random(4) ) * 60;

                                                //AddStrategicEvent( EVENT_BOBBYRAY_PURCHASE, uiResetTimeSec, cnt);
                                                AddFutureDayStrategicEvent( EVENT_BOBBYRAY_PURCHASE, (8 + Random(4) ) * 60, cnt, bDaysAhead );

                                        }

                                        //Add the transaction to the finance page
                                        AddTransactionToPlayersBook(BOBBYR_PURCHASE, 0, GetWorldTotalMin(), -giGrandTotal);

                                        //display the confirm order graphic
                                        gfDrawConfirmOrderGrpahic = TRUE;

                                        //Get rid of the city drop dowm, if it is being displayed
                                        gubDropDownAction = BR_DROP_DOWN_DESTROY;

                                        MSYS_EnableRegion(&gSelectedConfirmOrderRegion);
        */
      }
    }

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function DisplayPurchasedItems(fCalledFromOrderPage: BOOLEAN, usGridX: UINT16, usGridY: UINT16, pBobbyRayPurchase: Pointer<BobbyRayPurchaseStruct>, fJustDisplayTitles: BOOLEAN, iOrderNum: INT32): void {
  let i: UINT16;
  let j: UINT16;
  let sText: wchar_t[] /* [400] */;
  let sBack: wchar_t[] /* [400] */;
  let sTemp: wchar_t[] /* [20] */;
  let usPosY: UINT16;
  let uiStartLoc: UINT32 = 0;
  let uiTotal: UINT32;
  let usStringLength: UINT16;
  let usPixLength: UINT16;
  let OneChar: wchar_t[] /* [2] */;
  let iGrandTotal: INT32;
  let iSubTotal: INT32;

  // Output the qty
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_QTY], (usGridX + BOBBYR_GRID_FIRST_COLUMN_X), (usGridY + BOBBYR_GRID_FIRST_COLUMN_Y - BOBBYR_GRID_TITLE_OFFSET), BOBBYR_GRID_FIRST_COLUMN_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Create a string for the weight ( %s ) ( where %s is the weight string, either kg or lbs )
  swprintf(sTemp, BobbyROrderFormText[Enum349.BOBBYR_WEIGHT], GetWeightUnitString());

  // Output the Weight
  DisplayWrappedString((usGridX + BOBBYR_GRID_SECOND_COLUMN_X), (usGridY + BOBBYR_GRID_SECOND_COLUMN_Y - 30), BOBBYR_GRID_SECOND_COLUMN_WIDTH, 2, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, sTemp, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Output the name
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_NAME], (usGridX + BOBBYR_GRID_THIRD_COLUMN_X), (usGridY + BOBBYR_GRID_THIRD_COLUMN_Y - BOBBYR_GRID_TITLE_OFFSET), BOBBYR_GRID_THIRD_COLUMN_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Output the unit price
  DisplayWrappedString((usGridX + BOBBYR_GRID_FOURTH_COLUMN_X), (usGridY + BOBBYR_GRID_FOURTH_COLUMN_Y - 30), BOBBYR_GRID_FOURTH_COLUMN_WIDTH, 2, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, BobbyROrderFormText[Enum349.BOBBYR_UNIT_PRICE], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Output the total
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_TOTAL], (usGridX + BOBBYR_GRID_FIFTH_COLUMN_X), (usGridY + BOBBYR_GRID_FIFTH_COLUMN_Y - BOBBYR_GRID_TITLE_OFFSET), BOBBYR_GRID_FIFTH_COLUMN_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Output the sub total, shipping and handling, and the grand total
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_SUB_TOTAL], (usGridX + BOBBYR_SUBTOTAL_X), (usGridY + BOBBYR_SUBTOTAL_Y), BOBBYR_SUBTOTAL_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_S_H], (usGridX + BOBBYR_SUBTOTAL_X), (usGridY + BOBBYR_SHIPPING_N_HANDLE_Y), BOBBYR_SUBTOTAL_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_GRAND_TOTAL], (usGridX + BOBBYR_SUBTOTAL_X), (usGridY + BOBBYR_GRAND_TOTAL_Y), BOBBYR_SUBTOTAL_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

  if (fJustDisplayTitles) {
    return;
  }

  if (fCalledFromOrderPage) {
    guiSubTotal = 0;
    giGrandTotal = 0;
  } else {
    iSubTotal = 0;
    iGrandTotal = 0;
  }

  if (pBobbyRayPurchase == NULL) {
    return;
  }

  // loop through the array of purchases to display only the items that are purchased
  usPosY = usGridY + BOBBYR_GRID_FIRST_COLUMN_Y + 4;
  for (i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    // if the item was purchased
    //		if( BobbyRayPurchases[ i ].ubNumberPurchased )
    if (pBobbyRayPurchase[i].ubNumberPurchased) {
      uiTotal = 0;

      // Display the qty, order#, item name, unit price and the total

      // qty
      swprintf(sTemp, "%3d", pBobbyRayPurchase[i].ubNumberPurchased);
      DrawTextToScreen(sTemp, (usGridX + BOBBYR_GRID_FIRST_COLUMN_X - 2), usPosY, BOBBYR_GRID_FIRST_COLUMN_WIDTH, BOBBYR_ORDER_DYNAMIC_TEXT_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

      // weight
      swprintf(sTemp, "%3.1f", GetWeightBasedOnMetricOption(Item[pBobbyRayPurchase[i].usItemIndex].ubWeight) / (10.0) * pBobbyRayPurchase[i].ubNumberPurchased);
      DrawTextToScreen(sTemp, (usGridX + BOBBYR_GRID_SECOND_COLUMN_X - 2), usPosY, BOBBYR_GRID_SECOND_COLUMN_WIDTH, BOBBYR_ORDER_DYNAMIC_TEXT_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

      // Display Items Name
      if (pBobbyRayPurchase[i].fUsed) {
        uiStartLoc = BOBBYR_ITEM_DESC_FILE_SIZE * LaptopSaveInfo.BobbyRayUsedInventory[pBobbyRayPurchase[i].usBobbyItemIndex].usItemIndex;
      } else {
        uiStartLoc = BOBBYR_ITEM_DESC_FILE_SIZE * LaptopSaveInfo.BobbyRayInventory[pBobbyRayPurchase[i].usBobbyItemIndex].usItemIndex;
      }

      if (pBobbyRayPurchase[i].fUsed) {
        LoadEncryptedDataFromFile(BOBBYRDESCFILE, sBack, uiStartLoc, BOBBYR_ITEM_DESC_NAME_SIZE);
        swprintf(sText, "%s %s", "*", sBack);
      } else
        LoadEncryptedDataFromFile(BOBBYRDESCFILE, sText, uiStartLoc, BOBBYR_ITEM_DESC_NAME_SIZE);

      // if the name is bigger then can fit into the slot, reduce the size
      if (StringPixLength(sText, BOBBYR_ORDER_DYNAMIC_TEXT_FONT) > BOBBYR_GRID_THIRD_COLUMN_WIDTH - 4) {
        usStringLength = wcslen(sText);
        usPixLength = 0;
        OneChar[1] = '\0';
        for (j = 0; (i < usStringLength) && (usPixLength < BOBBYR_GRID_THIRD_COLUMN_WIDTH - 16); j++) {
          sBack[j] = sText[j];
          OneChar[0] = sBack[j];
          usPixLength += StringPixLength(OneChar, BOBBYR_ORDER_DYNAMIC_TEXT_FONT);
        }
        sBack[j] = 0;
        swprintf(sText, "%s...", sBack);
      }

      DrawTextToScreen(sText, (usGridX + BOBBYR_GRID_THIRD_COLUMN_X + 2), usPosY, BOBBYR_GRID_THIRD_COLUMN_WIDTH, BOBBYR_ORDER_DYNAMIC_TEXT_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

      // unit price
      swprintf(sTemp, "%d", CalcBobbyRayCost(pBobbyRayPurchase[i].usItemIndex, pBobbyRayPurchase[i].usBobbyItemIndex, pBobbyRayPurchase[i].fUsed));
      InsertCommasForDollarFigure(sTemp);
      InsertDollarSignInToString(sTemp);

      DrawTextToScreen(sTemp, (usGridX + BOBBYR_GRID_FOURTH_COLUMN_X - 2), usPosY, BOBBYR_GRID_FOURTH_COLUMN_WIDTH, BOBBYR_ORDER_DYNAMIC_TEXT_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

      uiTotal += CalcBobbyRayCost(pBobbyRayPurchase[i].usItemIndex, pBobbyRayPurchase[i].usBobbyItemIndex, pBobbyRayPurchase[i].fUsed) * pBobbyRayPurchase[i].ubNumberPurchased;

      swprintf(sTemp, "%d", uiTotal);
      InsertCommasForDollarFigure(sTemp);
      InsertDollarSignInToString(sTemp);

      DrawTextToScreen(sTemp, (usGridX + BOBBYR_GRID_FIFTH_COLUMN_X - 2), usPosY, BOBBYR_GRID_FIFTH_COLUMN_WIDTH, BOBBYR_ORDER_DYNAMIC_TEXT_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

      // add the current item total to the sub total
      if (fCalledFromOrderPage) {
        guiSubTotal += uiTotal;
      } else {
        iSubTotal += uiTotal;
      }

      usPosY += BOBBYR_GRID_ROW_OFFSET;
    }
  }

  DisplayShippingCosts(fCalledFromOrderPage, iSubTotal, usGridX, usGridY, iOrderNum);
}

function DisplayShippingCosts(fCalledFromOrderPage: BOOLEAN, iSubTotal: INT32, usGridX: UINT16, usGridY: UINT16, iOrderNum: INT32): void {
  let sTemp: wchar_t[] /* [20] */;
  let hPixHandle: HVOBJECT;
  let iShippingCost: INT32 = 0;
  //	INT32 iTotal;

  if (fCalledFromOrderPage) {
    iSubTotal = guiSubTotal;
    //		iTotal = giGrandTotal;

    if (gubSelectedLight == 0)
      guiShippingCost = CalcCostFromWeightOfPackage(0);
    else if (gubSelectedLight == 1)
      guiShippingCost = CalcCostFromWeightOfPackage(1);
    else if (gubSelectedLight == 2)
      guiShippingCost = CalcCostFromWeightOfPackage(2);

    iShippingCost = guiShippingCost;
  } else {
    let usStandardCost: UINT16;

    switch (gpNewBobbyrShipments[iOrderNum].ubDeliveryMethod) {
      case 0:
        usStandardCost = BobbyROrderLocations[gpNewBobbyrShipments[iOrderNum].ubDeliveryLoc].usOverNightExpress;
        break;
      case 1:
        usStandardCost = BobbyROrderLocations[gpNewBobbyrShipments[iOrderNum].ubDeliveryLoc].us2DaysService;
        break;
      case 2:
        usStandardCost = BobbyROrderLocations[gpNewBobbyrShipments[iOrderNum].ubDeliveryLoc].usStandardService;
        break;

      default:
        usStandardCost = 0;
    }

    iShippingCost = ((gpNewBobbyrShipments[iOrderNum].uiPackageWeight / 10) * usStandardCost + .5);
  }

  // erase the old area
  // bli the total Saved area onto the grid
  if (fCalledFromOrderPage) {
    GetVideoObject(addressof(hPixHandle), guiTotalSaveArea);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_TOTAL_SAVED_AREA_X, BOBBYR_TOTAL_SAVED_AREA_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  }

  // if there is a shipment, display the s&h charge
  if (iSubTotal) {
    // Display the subtotal
    swprintf(sTemp, "%d", iSubTotal);
    InsertCommasForDollarFigure(sTemp);
    InsertDollarSignInToString(sTemp);

    DrawTextToScreen(sTemp, (usGridX + BOBBYR_GRID_FIFTH_COLUMN_X - 2), (usGridY + BOBBYR_SUBTOTAL_Y), BOBBYR_GRID_FIFTH_COLUMN_WIDTH, BOBBYR_ORDER_DYNAMIC_TEXT_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

    // Display the shipping and handling charge
    swprintf(sTemp, "%d", iShippingCost);
    InsertCommasForDollarFigure(sTemp);
    InsertDollarSignInToString(sTemp);

    DrawTextToScreen(sTemp, (usGridX + BOBBYR_GRID_FIFTH_COLUMN_X - 2), (usGridY + BOBBYR_SHIPPING_N_HANDLE_Y), BOBBYR_GRID_FIFTH_COLUMN_WIDTH, BOBBYR_ORDER_DYNAMIC_TEXT_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

    // Display the grand total
    giGrandTotal = iSubTotal + iShippingCost;
    swprintf(sTemp, "%d", giGrandTotal);
    InsertCommasForDollarFigure(sTemp);
    InsertDollarSignInToString(sTemp);

    DrawTextToScreen(sTemp, (usGridX + BOBBYR_GRID_FIFTH_COLUMN_X - 2), (usGridY + BOBBYR_GRAND_TOTAL_Y), BOBBYR_GRID_FIFTH_COLUMN_WIDTH, BOBBYR_ORDER_DYNAMIC_TEXT_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  }

  InvalidateRegion(333, 326, 374, 400);
}

function BtnBobbyRBackCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    guiCurrentLaptopMode = guiLastBobbyRayPage;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnBobbyRHomeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BOBBY_R;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function SelectShippingSpeedRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubSelectedLight = MSYS_GetRegionUserData(pRegion, 0);
    DrawShippingSpeedLights(gubSelectedLight);
    DisplayShippingCosts(TRUE, 0, BOBBYR_ORDERGRID_X, BOBBYR_ORDERGRID_Y, -1);
  }
}

function DrawShippingSpeedLights(ubSelected: UINT8): BOOLEAN {
  if (ubSelected == 0)
    ColorFillVideoSurfaceArea(FRAME_BUFFER, gShippingSpeedAreas[0], gShippingSpeedAreas[1], gShippingSpeedAreas[0] + SHIPPING_SPEED_LIGHT_WIDTH, gShippingSpeedAreas[1] + SHIPPING_SPEED_LIGHT_HEIGHT, Get16BPPColor(FROMRGB(0, 255, 0)));
  else
    ColorFillVideoSurfaceArea(FRAME_BUFFER, gShippingSpeedAreas[0], gShippingSpeedAreas[1], gShippingSpeedAreas[0] + SHIPPING_SPEED_LIGHT_WIDTH, gShippingSpeedAreas[1] + SHIPPING_SPEED_LIGHT_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

  if (ubSelected == 1)
    ColorFillVideoSurfaceArea(FRAME_BUFFER, gShippingSpeedAreas[2], gShippingSpeedAreas[3], gShippingSpeedAreas[2] + SHIPPING_SPEED_LIGHT_WIDTH, gShippingSpeedAreas[3] + SHIPPING_SPEED_LIGHT_HEIGHT, Get16BPPColor(FROMRGB(0, 255, 0)));
  else
    ColorFillVideoSurfaceArea(FRAME_BUFFER, gShippingSpeedAreas[2], gShippingSpeedAreas[3], gShippingSpeedAreas[2] + SHIPPING_SPEED_LIGHT_WIDTH, gShippingSpeedAreas[3] + SHIPPING_SPEED_LIGHT_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

  if (ubSelected == 2)
    ColorFillVideoSurfaceArea(FRAME_BUFFER, gShippingSpeedAreas[4], gShippingSpeedAreas[5], gShippingSpeedAreas[4] + SHIPPING_SPEED_LIGHT_WIDTH, gShippingSpeedAreas[5] + SHIPPING_SPEED_LIGHT_HEIGHT, Get16BPPColor(FROMRGB(0, 255, 0)));
  else
    ColorFillVideoSurfaceArea(FRAME_BUFFER, gShippingSpeedAreas[4], gShippingSpeedAreas[5], gShippingSpeedAreas[4] + SHIPPING_SPEED_LIGHT_WIDTH, gShippingSpeedAreas[5] + SHIPPING_SPEED_LIGHT_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

  InvalidateRegion(585, 218, 594, 287);
  return TRUE;
}

function SelectConfirmOrderRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // Remove the items for Boby Rqys Inventory
    RemovePurchasedItemsFromBobbyRayInventory();

    // delete the order
    memset(addressof(BobbyRayPurchases), 0, sizeof(BobbyRayPurchaseStruct) * MAX_PURCHASE_AMOUNT);
    gubSelectedLight = 0;
    gfDestroyConfirmGrphiArea = TRUE;
    gubSelectedLight = 0;

    // Goto The homepage
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BOBBY_R;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    // Remove the items for Boby Rqys Inventory
    RemovePurchasedItemsFromBobbyRayInventory();

    // delete the order
    memset(addressof(BobbyRayPurchases), 0, sizeof(BobbyRayPurchaseStruct) * MAX_PURCHASE_AMOUNT);
    gubSelectedLight = 0;
    gfDestroyConfirmGrphiArea = TRUE;
    gubSelectedLight = 0;
  }
}

function CreateDestroyBobbyRDropDown(ubDropDownAction: UINT8): BOOLEAN {
  /* static */ let usHeight: UINT16;
  /* static */ let fMouseRegionsCreated: BOOLEAN = FALSE;

  switch (ubDropDownAction) {
    case Enum69.BR_DROP_DOWN_NO_ACTION: {
    } break;

    case Enum69.BR_DROP_DOWN_CREATE: {
      let i: UINT8;
      let usPosX: UINT16;
      let usPosY: UINT16;
      let usHeight: UINT16;
      let usTemp: UINT16;
      let usFontHeight: UINT16 = GetFontHeight(BOBBYR_DROPDOWN_FONT);

      if (fMouseRegionsCreated) {
        gubDropDownAction = Enum69.BR_DROP_DOWN_DESTROY;

        break;
      }
      fMouseRegionsCreated = TRUE;

      usPosX = BOBBYR_CITY_START_LOCATION_X;
      usPosY = BOBBYR_CITY_START_LOCATION_Y;
      for (i = 0; i < BOBBYR_NUM_DISPLAYED_CITIES; i++) {
        MSYS_DefineRegion(addressof(gSelectedDropDownRegion[i]), usPosX, (usPosY + 4), (usPosX + BOBBYR_DROP_DOWN_WIDTH - 6), (usPosY + usFontHeight + 7), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, SelectDropDownMovementCallBack, SelectDropDownRegionCallBack);
        MSYS_AddRegion(addressof(gSelectedDropDownRegion[i]));
        MSYS_SetRegionUserData(addressof(gSelectedDropDownRegion[i]), 0, i);

        usPosY += usFontHeight + 2;
      }
      usTemp = BOBBYR_CITY_START_LOCATION_Y;
      usHeight = usPosY - usTemp + 10;

      // create the scroll bars regions
      // up arrow
      usPosX = BOBBYR_SCROLL_UP_ARROW_X;
      usPosY = BOBBYR_SCROLL_UP_ARROW_Y;
      for (i = 0; i < 2; i++) {
        MSYS_DefineRegion(addressof(gSelectedUpDownArrowOnScrollAreaRegion[i]), usPosX, usPosY, (usPosX + BOBBYR_SCROLL_ARROW_WIDTH), (usPosY + BOBBYR_SCROLL_ARROW_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectUpDownArrowOnScrollAreaRegionCallBack);
        MSYS_AddRegion(addressof(gSelectedUpDownArrowOnScrollAreaRegion[i]));
        MSYS_SetRegionUserData(addressof(gSelectedUpDownArrowOnScrollAreaRegion[i]), 0, i);
        usPosX = BOBBYR_SCROLL_DOWN_ARROW_X;
        usPosY = BOBBYR_SCROLL_DOWN_ARROW_Y;
      }

      // the scroll area itself
      usPosX = BOBBYR_SCROLL_AREA_X;
      usPosY = BOBBYR_SCROLL_UP_ARROW_Y + BOBBYR_SCROLL_ARROW_HEIGHT;
      usHeight = BOBBYR_SCROLL_AREA_HEIGHT_MINUS_ARROWS / BOBBYR_ORDER_NUM_SHIPPING_CITIES;
      for (i = 0; i < BOBBYR_ORDER_NUM_SHIPPING_CITIES - 1; i++) {
        MSYS_DefineRegion(addressof(gSelectedScrollAreaDropDownRegion[i]), usPosX, usPosY, (usPosX + BOBBYR_SCROLL_ARROW_WIDTH), (usPosY + usHeight), MSYS_PRIORITY_HIGH + 1, Enum317.CURSOR_LAPTOP_SCREEN, SelectScrollAreaDropDownMovementCallBack, SelectScrollAreaDropDownRegionCallBack);
        MSYS_AddRegion(addressof(gSelectedScrollAreaDropDownRegion[i]));
        MSYS_SetRegionUserData(addressof(gSelectedScrollAreaDropDownRegion[i]), 0, i);
        usPosY += usHeight;
      }
      // put the last one down to cover the remaining area
      MSYS_DefineRegion(addressof(gSelectedScrollAreaDropDownRegion[i]), usPosX, usPosY, (usPosX + BOBBYR_SCROLL_ARROW_WIDTH), BOBBYR_SCROLL_DOWN_ARROW_Y, MSYS_PRIORITY_HIGH + 1, Enum317.CURSOR_LAPTOP_SCREEN, SelectScrollAreaDropDownMovementCallBack, SelectScrollAreaDropDownRegionCallBack);
      MSYS_AddRegion(addressof(gSelectedScrollAreaDropDownRegion[i]));
      MSYS_SetRegionUserData(addressof(gSelectedScrollAreaDropDownRegion[i]), 0, i);

      MSYS_EnableRegion(addressof(gSelectedCloseDropDownRegion));

      // disable the clear order and accept order buttons, (their rendering interferes with the drop down graphics)
      DisableButton(guiBobbyRClearOrder);

      // FERAL
      //			if( IsAnythingPurchasedFromBobbyRayPage() )
      //			{
      //				SpecifyDisabledButtonStyle( guiBobbyRAcceptOrder, DISABLED_STYLE_NONE );
      //				DisableButton(guiBobbyRAcceptOrder);
      //			}
    } break;

    case Enum69.BR_DROP_DOWN_DESTROY: {
      let i: UINT8;

      if (!fMouseRegionsCreated)
        break;

      for (i = 0; i < BOBBYR_NUM_DISPLAYED_CITIES; i++)
        MSYS_RemoveRegion(addressof(gSelectedDropDownRegion[i]));

      // destroy the scroll bars arrow regions
      for (i = 0; i < 2; i++)
        MSYS_RemoveRegion(addressof(gSelectedUpDownArrowOnScrollAreaRegion[i]));

      // destroy the scroll bars regions
      for (i = 0; i < BOBBYR_ORDER_NUM_SHIPPING_CITIES; i++)
        MSYS_RemoveRegion(addressof(gSelectedScrollAreaDropDownRegion[i]));

      // display the name on the title bar
      ColorFillVideoSurfaceArea(FRAME_BUFFER, BOBBYR_SHIPPING_LOC_AREA_L_X, BOBBYR_SHIPPING_LOC_AREA_T_Y, BOBBYR_SHIPPING_LOC_AREA_L_X + 175, BOBBYR_SHIPPING_LOC_AREA_T_Y + BOBBYR_DROP_DOWN_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

      if (gbSelectedCity == -1)
        DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_SELECT_DEST], BOBBYR_CITY_START_LOCATION_X + BOBBYR_CITY_NAME_OFFSET, BOBBYR_SHIPPING_LOC_AREA_T_Y + 3, 0, BOBBYR_DROPDOWN_FONT, BOBBYR_ORDER_DROP_DOWN_SELEC_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
      else
        DrawTextToScreen((BobbyROrderLocations[gbSelectedCity].psCityLoc).value, BOBBYR_CITY_START_LOCATION_X + BOBBYR_CITY_NAME_OFFSET, BOBBYR_SHIPPING_LOC_AREA_T_Y + 3, 0, BOBBYR_DROPDOWN_FONT, BOBBYR_ORDER_DROP_DOWN_SELEC_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

      // disable the r\close regiuon
      MSYS_DisableRegion(addressof(gSelectedCloseDropDownRegion));

      // enable the clear order and accept order buttons, (because their rendering interferes with the drop down graphics)
      EnableButton(guiBobbyRClearOrder);
      // FERAL
      //			if( IsAnythingPurchasedFromBobbyRayPage() )
      //			{
      //				SpecifyDisabledButtonStyle( guiBobbyRAcceptOrder, DISABLED_STYLE_SHADED );
      //			  EnableButton(guiBobbyRAcceptOrder);
      //			}

      gfReDrawBobbyOrder = TRUE;
      fMouseRegionsCreated = FALSE;
      gubDropDownAction = Enum69.BR_DROP_DOWN_NO_ACTION;
    } break;

    case Enum69.BR_DROP_DOWN_DISPLAY: {
      let i: UINT8;
      let usPosY: UINT16;
      let usPosX: UINT16;
      let usFontHeight: UINT16 = GetFontHeight(BOBBYR_DROPDOWN_FONT);
      let hImageHandle: HVOBJECT;
      let hArrowHandle: HVOBJECT;

      // Display the background for the drop down window
      ColorFillVideoSurfaceArea(FRAME_BUFFER, BOBBYR_CITY_START_LOCATION_X, BOBBYR_CITY_START_LOCATION_Y, BOBBYR_CITY_START_LOCATION_X + BOBBYR_DROP_DOWN_WIDTH, BOBBYR_CITY_START_LOCATION_Y + BOBBYR_SCROLL_AREA_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

      //
      // Place the border around the background
      //
      usHeight = BOBBYR_SCROLL_AREA_HEIGHT;

      GetVideoObject(addressof(hImageHandle), guiDropDownBorder);

      usPosX = usPosY = 0;
      // blit top & bottom row of images
      for (i = 10; i < BOBBYR_DROP_DOWN_WIDTH - 10; i += 10) {
        // TOP ROW
        BltVideoObject(FRAME_BUFFER, hImageHandle, 1, i + BOBBYR_CITY_START_LOCATION_X, usPosY + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);
        // BOTTOM ROW
        BltVideoObject(FRAME_BUFFER, hImageHandle, 6, i + BOBBYR_CITY_START_LOCATION_X, usHeight - 10 + 6 + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);
      }

      // blit the left and right row of images
      usPosX = 0;
      for (i = 10; i < usHeight - 10; i += 10) {
        BltVideoObject(FRAME_BUFFER, hImageHandle, 3, usPosX + BOBBYR_CITY_START_LOCATION_X, i + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);
        BltVideoObject(FRAME_BUFFER, hImageHandle, 4, usPosX + BOBBYR_DROP_DOWN_WIDTH - 4 + BOBBYR_CITY_START_LOCATION_X, i + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);
      }

      // blt the corner images for the row
      // top left
      BltVideoObject(FRAME_BUFFER, hImageHandle, 0, 0 + BOBBYR_CITY_START_LOCATION_X, usPosY + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);
      // top right
      BltVideoObject(FRAME_BUFFER, hImageHandle, 2, BOBBYR_DROP_DOWN_WIDTH - 10 + BOBBYR_CITY_START_LOCATION_X, usPosY + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);
      // bottom left
      BltVideoObject(FRAME_BUFFER, hImageHandle, 5, 0 + BOBBYR_CITY_START_LOCATION_X, usHeight - 10 + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);
      // bottom right
      BltVideoObject(FRAME_BUFFER, hImageHandle, 7, BOBBYR_DROP_DOWN_WIDTH - 10 + BOBBYR_CITY_START_LOCATION_X, usHeight - 10 + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);

      DrawSelectedCity(gbSelectedCity);

      // display the scroll bars regions
      ColorFillVideoSurfaceArea(FRAME_BUFFER, BOBBYR_SCROLL_AREA_X, BOBBYR_SCROLL_AREA_Y, BOBBYR_SCROLL_AREA_X + BOBBYR_SCROLL_AREA_WIDTH, BOBBYR_SCROLL_AREA_Y + BOBBYR_SCROLL_AREA_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

      // blt right bar of scroll area
      usPosX = 0;
      for (i = 10; i < BOBBYR_SCROLL_AREA_HEIGHT - 10; i += 10) {
        BltVideoObject(FRAME_BUFFER, hImageHandle, 3, BOBBYR_SCROLL_AREA_X + BOBBYR_SCROLL_AREA_WIDTH - 4, i + BOBBYR_CITY_START_LOCATION_Y, VO_BLT_SRCTRANSPARENCY, NULL);
      }

      // blit top row of images
      for (i = 0; i < BOBBYR_SCROLL_AREA_WIDTH; i += 10) {
        // TOP ROW
        BltVideoObject(FRAME_BUFFER, hImageHandle, 1, i + BOBBYR_SCROLL_AREA_X - 10, BOBBYR_SCROLL_AREA_Y, VO_BLT_SRCTRANSPARENCY, NULL);
        // BOTTOM ROW
        BltVideoObject(FRAME_BUFFER, hImageHandle, 6, i + BOBBYR_SCROLL_AREA_X - 10, BOBBYR_SCROLL_AREA_Y - 10 + 6 + BOBBYR_SCROLL_AREA_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
      }

      // top right
      BltVideoObject(FRAME_BUFFER, hImageHandle, 2, BOBBYR_SCROLL_AREA_X + BOBBYR_SCROLL_AREA_WIDTH - 10, BOBBYR_SCROLL_AREA_Y, VO_BLT_SRCTRANSPARENCY, NULL);
      // bottom right
      BltVideoObject(FRAME_BUFFER, hImageHandle, 7, BOBBYR_SCROLL_AREA_X + BOBBYR_SCROLL_AREA_WIDTH - 10, BOBBYR_SCROLL_AREA_Y + BOBBYR_SCROLL_AREA_HEIGHT - 10, VO_BLT_SRCTRANSPARENCY, NULL);

      // fix
      BltVideoObject(FRAME_BUFFER, hImageHandle, 4, BOBBYR_DROP_DOWN_WIDTH - 4 + BOBBYR_CITY_START_LOCATION_X, BOBBYR_CITY_START_LOCATION_Y + 2, VO_BLT_SRCTRANSPARENCY, NULL);

      // get and display the up and down arrows
      GetVideoObject(addressof(hArrowHandle), guiGoldArrowImages);
      // top arrow
      BltVideoObject(FRAME_BUFFER, hArrowHandle, 1, BOBBYR_SCROLL_UP_ARROW_X, BOBBYR_SCROLL_UP_ARROW_Y, VO_BLT_SRCTRANSPARENCY, NULL);

      // top arrow
      BltVideoObject(FRAME_BUFFER, hArrowHandle, 0, BOBBYR_SCROLL_DOWN_ARROW_X, BOBBYR_SCROLL_DOWN_ARROW_Y, VO_BLT_SRCTRANSPARENCY, NULL);

      // display the scroll rectangle
      DrawGoldRectangle(gbSelectedCity);

      InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
    } break;
  }

  return TRUE;
}

function SelectDropDownRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubSelected: UINT8 = MSYS_GetRegionUserData(pRegion, 0);
    gbSelectedCity = ubSelected + gubCityAtTopOfList;

    DrawSelectedCity(gbSelectedCity);

    gubDropDownAction = Enum69.BR_DROP_DOWN_DESTROY;
  }
}

function SelectActivateCityDroDownRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubDropDownAction = Enum69.BR_DROP_DOWN_CREATE;
  }
}

function SelectDropDownMovementCallBack(pRegion: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    pRegion.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(pRegion.value.RegionTopLeftX, pRegion.value.RegionTopLeftY, pRegion.value.RegionBottomRightX, pRegion.value.RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    pRegion.value.uiFlags |= BUTTON_CLICKED_ON;

    gbSelectedCity = MSYS_GetRegionUserData(pRegion, 0) + gubCityAtTopOfList;

    gubDropDownAction = Enum69.BR_DROP_DOWN_DISPLAY;

    InvalidateRegion(pRegion.value.RegionTopLeftX, pRegion.value.RegionTopLeftY, pRegion.value.RegionBottomRightX, pRegion.value.RegionBottomRightY);
  }
}

function DrawSelectedCity(ubCityNumber: UINT8): void {
  let usPosY: UINT16;
  let usFontHeight: UINT16 = GetFontHeight(BOBBYR_DROPDOWN_FONT);
  let i: UINT8;

  // DEBUG: make sure it wont go over array bounds
  if (gubCityAtTopOfList + BOBBYR_NUM_DISPLAYED_CITIES > BOBBYR_ORDER_NUM_SHIPPING_CITIES)
    gubCityAtTopOfList = BOBBYR_ORDER_NUM_SHIPPING_CITIES - BOBBYR_NUM_DISPLAYED_CITIES - 1;

  // Display the list of cities
  usPosY = BOBBYR_CITY_START_LOCATION_Y + 5;
  for (i = gubCityAtTopOfList; i < gubCityAtTopOfList + BOBBYR_NUM_DISPLAYED_CITIES; i++) {
    DrawTextToScreen((BobbyROrderLocations[i].psCityLoc).value, BOBBYR_CITY_START_LOCATION_X + BOBBYR_CITY_NAME_OFFSET, usPosY, 0, BOBBYR_DROPDOWN_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
    usPosY += usFontHeight + 2;
  }

  if (ubCityNumber != 255)
    usPosY = (usFontHeight + 2) * (ubCityNumber - gubCityAtTopOfList) + BOBBYR_CITY_START_LOCATION_Y;
  else
    usPosY = (usFontHeight + 2) * (gubCityAtTopOfList) + BOBBYR_CITY_START_LOCATION_Y;

  // display the name in the list
  ColorFillVideoSurfaceArea(FRAME_BUFFER, BOBBYR_CITY_START_LOCATION_X + 4, usPosY + 4, BOBBYR_CITY_START_LOCATION_X + BOBBYR_DROP_DOWN_WIDTH - 4, usPosY + usFontHeight + 6, Get16BPPColor(FROMRGB(200, 169, 87)));

  SetFontShadow(NO_SHADOW);
  if (ubCityNumber == 255)
    DrawTextToScreen((BobbyROrderLocations[0].psCityLoc).value, BOBBYR_CITY_START_LOCATION_X + BOBBYR_CITY_NAME_OFFSET, (usPosY + 5), 0, BOBBYR_DROPDOWN_FONT, BOBBYR_FONT_BLACK, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  else
    DrawTextToScreen((BobbyROrderLocations[ubCityNumber].psCityLoc).value, BOBBYR_CITY_START_LOCATION_X + BOBBYR_CITY_NAME_OFFSET, (usPosY + 5), 0, BOBBYR_DROPDOWN_FONT, BOBBYR_FONT_BLACK, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  SetFontShadow(DEFAULT_SHADOW);

  DisplayShippingLocationCity();

  if (guiBobbyRAcceptOrder != -1) {
    // if there is anything to buy, dont disable the accept button
    if (IsAnythingPurchasedFromBobbyRayPage() && gbSelectedCity != -1)
      EnableButton(guiBobbyRAcceptOrder);
  }
}

function DisplayShippingLocationCity(): void {
  let sTemp: wchar_t[] /* [40] */;
  let usPosY: UINT16;

  // display the name on the title bar
  ColorFillVideoSurfaceArea(FRAME_BUFFER, BOBBYR_SHIPPING_LOC_AREA_L_X, BOBBYR_SHIPPING_LOC_AREA_T_Y, BOBBYR_SHIPPING_LOC_AREA_L_X + 175, BOBBYR_SHIPPING_LOC_AREA_T_Y + BOBBYR_DROP_DOWN_HEIGHT, Get16BPPColor(FROMRGB(0, 0, 0)));

  // if there is no city selected
  if (gbSelectedCity == -1)
    DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_SELECT_DEST], BOBBYR_CITY_START_LOCATION_X + BOBBYR_CITY_NAME_OFFSET, BOBBYR_SHIPPING_LOC_AREA_T_Y + 3, 0, BOBBYR_DROPDOWN_FONT, BOBBYR_ORDER_DROP_DOWN_SELEC_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  else
    DrawTextToScreen((BobbyROrderLocations[gbSelectedCity].psCityLoc).value, BOBBYR_CITY_START_LOCATION_X + BOBBYR_CITY_NAME_OFFSET, BOBBYR_SHIPPING_LOC_AREA_T_Y + 3, 0, BOBBYR_DROPDOWN_FONT, BOBBYR_ORDER_DROP_DOWN_SELEC_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  DisplayShippingCosts(TRUE, 0, BOBBYR_ORDERGRID_X, BOBBYR_ORDERGRID_Y, -1);

  if (gubDropDownAction == Enum69.BR_DROP_DOWN_DISPLAY)
    return;

  // Display the shipping cost
  usPosY = BOBBYR_OVERNIGHT_EXPRESS_Y;

  wcscpy(sTemp, "$0");

  if (gbSelectedCity != -1) {
    swprintf(sTemp, "%d", (BobbyROrderLocations[gbSelectedCity].usOverNightExpress / GetWeightBasedOnMetricOption(1)));
    InsertCommasForDollarFigure(sTemp);
    InsertDollarSignInToString(sTemp);
  }

  DrawTextToScreen(sTemp, BOBBYR_SHIPPING_SPEED_NUMBER_X, usPosY, BOBBYR_SHIPPING_SPEED_NUMBER_WIDTH, BOBBYR_DROPDOWN_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  usPosY += BOBBYR_GRID_ROW_OFFSET;

  if (gbSelectedCity != -1) {
    swprintf(sTemp, "%d", (BobbyROrderLocations[gbSelectedCity].us2DaysService / GetWeightBasedOnMetricOption(1)));
    InsertCommasForDollarFigure(sTemp);
    InsertDollarSignInToString(sTemp);
  }

  DrawTextToScreen(sTemp, BOBBYR_SHIPPING_SPEED_NUMBER_X, usPosY, BOBBYR_SHIPPING_SPEED_NUMBER_WIDTH, BOBBYR_DROPDOWN_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  usPosY += BOBBYR_GRID_ROW_OFFSET;

  if (gbSelectedCity != -1) {
    swprintf(sTemp, "%d", (BobbyROrderLocations[gbSelectedCity].usStandardService / GetWeightBasedOnMetricOption(1)));
    InsertCommasForDollarFigure(sTemp);
    InsertDollarSignInToString(sTemp);
  }

  DrawTextToScreen(sTemp, BOBBYR_SHIPPING_SPEED_NUMBER_X, usPosY, BOBBYR_SHIPPING_SPEED_NUMBER_WIDTH, BOBBYR_DROPDOWN_FONT, BOBBYR_ORDER_DYNAMIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
}

function SelectCloseDroDownRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubDropDownAction = Enum69.BR_DROP_DOWN_DESTROY;
  }
}

function RemovePurchasedItemsFromBobbyRayInventory(): void {
  let i: INT16;

  for (i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    // if the item was purchased
    if (BobbyRayPurchases[i].ubNumberPurchased) {
      // if the item is used
      if (BobbyRayPurchases[i].fUsed) {
        // removee it from Bobby Rays Inventory
        if ((LaptopSaveInfo.BobbyRayUsedInventory[BobbyRayPurchases[i].usBobbyItemIndex].ubQtyOnHand - BobbyRayPurchases[i].ubNumberPurchased) > 0)
          LaptopSaveInfo.BobbyRayUsedInventory[BobbyRayPurchases[i].usBobbyItemIndex].ubQtyOnHand -= BobbyRayPurchases[i].ubNumberPurchased;
        else
          LaptopSaveInfo.BobbyRayUsedInventory[BobbyRayPurchases[i].usBobbyItemIndex].ubQtyOnHand = 0;
      }

      // else the purchase is new
      else {
        // removee it from Bobby Rays Inventory
        if ((LaptopSaveInfo.BobbyRayInventory[BobbyRayPurchases[i].usBobbyItemIndex].ubQtyOnHand - BobbyRayPurchases[i].ubNumberPurchased) > 0)
          LaptopSaveInfo.BobbyRayInventory[BobbyRayPurchases[i].usBobbyItemIndex].ubQtyOnHand -= BobbyRayPurchases[i].ubNumberPurchased;
        else
          LaptopSaveInfo.BobbyRayInventory[BobbyRayPurchases[i].usBobbyItemIndex].ubQtyOnHand = 0;
      }
    }
  }
  gfRemoveItemsFromStock = FALSE;
}

function IsAnythingPurchasedFromBobbyRayPage(): BOOLEAN {
  let i: UINT16;
  let fReturnType: BOOLEAN = FALSE;

  for (i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    // if the item was purchased
    if (BobbyRayPurchases[i].ubNumberPurchased) {
      fReturnType = TRUE;
    }
  }
  return fReturnType;
}

function SelectTitleLinkRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BOBBY_R;
  }
}

function SelectScrollAreaDropDownRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubCityNum: UINT8 = MSYS_GetRegionUserData(pRegion, 0);

    if (ubCityNum < gbSelectedCity) {
      gbSelectedCity--;
      if (gbSelectedCity < gubCityAtTopOfList)
        gubCityAtTopOfList--;
    }

    if (ubCityNum > gbSelectedCity) {
      gbSelectedCity++;
      if ((gbSelectedCity - gubCityAtTopOfList) >= BOBBYR_NUM_DISPLAYED_CITIES)
        gubCityAtTopOfList++;
    }

    gubDropDownAction = Enum69.BR_DROP_DOWN_DISPLAY;
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    let ubCityNum: UINT8 = MSYS_GetRegionUserData(pRegion, 0);

    pRegion.value.uiFlags |= BUTTON_CLICKED_ON;

    if (ubCityNum < gbSelectedCity) {
      gbSelectedCity--;
      if (gbSelectedCity < gubCityAtTopOfList)
        gubCityAtTopOfList--;
    }

    if (ubCityNum > gbSelectedCity) {
      gbSelectedCity++;
      if ((gbSelectedCity - gubCityAtTopOfList) >= BOBBYR_NUM_DISPLAYED_CITIES)
        gubCityAtTopOfList++;
    }

    gubDropDownAction = Enum69.BR_DROP_DOWN_DISPLAY;

    InvalidateRegion(pRegion.value.RegionTopLeftX, pRegion.value.RegionTopLeftY, pRegion.value.RegionBottomRightX, pRegion.value.RegionBottomRightY);
  }
}

function SelectScrollAreaDropDownMovementCallBack(pRegion: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    pRegion.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(pRegion.value.RegionTopLeftX, pRegion.value.RegionTopLeftY, pRegion.value.RegionBottomRightX, pRegion.value.RegionBottomRightY);
  } else if (reason & MSYS_CALLBACK_REASON_GAIN_MOUSE) {
    if (gfLeftButtonState) {
      let ubCityNum: UINT8 = MSYS_GetRegionUserData(pRegion, 0);

      pRegion.value.uiFlags |= BUTTON_CLICKED_ON;

      if (ubCityNum < gbSelectedCity) {
        gbSelectedCity = ubCityNum;
        if (gbSelectedCity < gubCityAtTopOfList)
          gubCityAtTopOfList = gbSelectedCity;
      }

      if (ubCityNum > gbSelectedCity) {
        gbSelectedCity = ubCityNum;
        if ((gbSelectedCity - gubCityAtTopOfList) >= BOBBYR_NUM_DISPLAYED_CITIES)
          gubCityAtTopOfList = gbSelectedCity - BOBBYR_NUM_DISPLAYED_CITIES + 1;
      }

      gubDropDownAction = Enum69.BR_DROP_DOWN_DISPLAY;

      InvalidateRegion(pRegion.value.RegionTopLeftX, pRegion.value.RegionTopLeftY, pRegion.value.RegionBottomRightX, pRegion.value.RegionBottomRightY);
    }
  }
}

function SelectUpDownArrowOnScrollAreaRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP || iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    let ubUpArrow: UINT8 = MSYS_GetRegionUserData(pRegion, 0);

    if (ubUpArrow) {
      if (gbSelectedCity < BOBBYR_ORDER_NUM_SHIPPING_CITIES - 1) {
        gbSelectedCity++;
      }

      if ((gbSelectedCity - gubCityAtTopOfList) >= BOBBYR_NUM_DISPLAYED_CITIES) {
        gubCityAtTopOfList++;
      }
    } else {
      if (gbSelectedCity != -1) {
        if (gbSelectedCity > 0)
          gbSelectedCity--;

        if (gbSelectedCity < gubCityAtTopOfList)
          gubCityAtTopOfList--;
      }
    }

    gubDropDownAction = Enum69.BR_DROP_DOWN_DISPLAY;
  }
}

function DrawGoldRectangle(bCityNum: INT8): void {
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let usWidth: UINT16;
  let usTempHeight: UINT16;
  let usTempPosY: UINT16;
  let usHeight: UINT16;
  let usPosX: UINT16;
  let usPosY: UINT16;

  let temp: UINT16;

  if (bCityNum == -1)
    bCityNum = 0;

  usTempPosY = BOBBYR_SCROLL_UP_ARROW_Y;
  usTempPosY += BOBBYR_SCROLL_ARROW_HEIGHT;
  usPosX = BOBBYR_SCROLL_AREA_X;
  usWidth = BOBBYR_SCROLL_AREA_WIDTH - 5;
  usTempHeight = (BOBBYR_SCROLL_AREA_HEIGHT - 2 * BOBBYR_SCROLL_ARROW_HEIGHT) - 8;

  usHeight = usTempHeight / (BOBBYR_ORDER_NUM_SHIPPING_CITIES + 1);

  usPosY = usTempPosY + (((BOBBYR_SCROLL_AREA_HEIGHT - 2 * BOBBYR_SCROLL_ARROW_HEIGHT) / (BOBBYR_ORDER_NUM_SHIPPING_CITIES + 1)) * bCityNum);

  temp = BOBBYR_SCROLL_AREA_Y + BOBBYR_SCROLL_AREA_HEIGHT - BOBBYR_SCROLL_ARROW_HEIGHT - usHeight - 1;

  if (usPosY >= temp)
    usPosY = BOBBYR_SCROLL_AREA_Y + BOBBYR_SCROLL_AREA_HEIGHT - BOBBYR_SCROLL_ARROW_HEIGHT - usHeight - 5;

  ColorFillVideoSurfaceArea(FRAME_BUFFER, BOBBYR_SCROLL_AREA_X, usPosY, BOBBYR_SCROLL_AREA_X + usWidth, usPosY + usHeight, Get16BPPColor(FROMRGB(186, 165, 68)));

  // display the line
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, 640, 480);

  // draw the gold highlite line on the top and left
  LineDraw(FALSE, usPosX, usPosY, usPosX + usWidth, usPosY, Get16BPPColor(FROMRGB(235, 222, 171)), pDestBuf);
  LineDraw(FALSE, usPosX, usPosY, usPosX, usPosY + usHeight, Get16BPPColor(FROMRGB(235, 222, 171)), pDestBuf);

  // draw the shadow line on the bottom and right
  LineDraw(FALSE, usPosX, usPosY + usHeight, usPosX + usWidth, usPosY + usHeight, Get16BPPColor(FROMRGB(65, 49, 6)), pDestBuf);
  LineDraw(FALSE, usPosX + usWidth, usPosY, usPosX + usWidth, usPosY + usHeight, Get16BPPColor(FROMRGB(65, 49, 6)), pDestBuf);

  // unlock frame buffer
  UnLockVideoSurface(FRAME_BUFFER);
}

function CalcCostFromWeightOfPackage(ubTypeOfService: UINT8): UINT32 {
  let uiTotalWeight: UINT32 = 0;
  let usStandardCost: UINT16 = 0;
  let uiTotalCost: UINT32 = 0;

  if (gbSelectedCity == -1) {
    // shipping rates unknown until destination selected
    return 0;
  }

  // Get the package's weight
  uiTotalWeight = CalcPackageTotalWeight();

  /*	for(i=0; i<MAX_PURCHASE_AMOUNT; i++)
          {
                  //if the item was purchased
                  if( BobbyRayPurchases[ i ].ubNumberPurchased )
                  {
                          //add the current weight to the total
                          uiTotalWeight += Item[ BobbyRayPurchases[ i ].usItemIndex ].ubWeight * BobbyRayPurchases[ i ].ubNumberPurchased;
                  }
          }
  */
  Assert(ubTypeOfService < 3);

  switch (ubTypeOfService) {
    case 0:
      usStandardCost = BobbyROrderLocations[gbSelectedCity].usOverNightExpress;
      break;
    case 1:
      usStandardCost = BobbyROrderLocations[gbSelectedCity].us2DaysService;
      break;
    case 2:
      usStandardCost = BobbyROrderLocations[gbSelectedCity].usStandardService;
      break;

    default:
      usStandardCost = 0;
  }

  // Get the actual weight ( either in lbs or metric )
  ///	usStandardCost = (UINT16) GetWeightBasedOnMetricOption( usStandardCost );

  // if the total weight is below a set minimum amount ( 2 kg )
  if (uiTotalWeight < MIN_SHIPPING_WEIGHT) {
    // bring up the base cost
    uiTotalWeight = MIN_SHIPPING_WEIGHT;
  }

  uiTotalCost = ((uiTotalWeight / 10) * usStandardCost + .5);

  return uiTotalCost;
}

function BobbyRayMailOrderEndGameShutDown(): void {
  ShutDownBobbyRNewMailOrders();
  /*
          if( LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray )
          {
                  MemFree( LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray );
                  LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = NULL;
          }
  */
}

function ShutDownBobbyRNewMailOrders(): void {
  if (gpNewBobbyrShipments != NULL) {
    MemFree(gpNewBobbyrShipments);
    gpNewBobbyrShipments = NULL;
  }
  giNumberOfNewBobbyRShipment = 0;
}

function CalculateOrderDelay(ubSelectedService: UINT8): INT8 {
  let bDaysAhead: INT8;

  // get the length of time to receive the shipment
  if (ubSelectedService == 0) {
    bDaysAhead = OVERNIGHT_EXPRESS;
  } else if (ubSelectedService == 1) {
    bDaysAhead = TWO_BUSINESS_DAYS;
  } else if (ubSelectedService == 2) {
    bDaysAhead = STANDARD_SERVICE;
  } else {
    bDaysAhead = 0;
  }

  if (gMercProfiles[Enum268.SAL].bLife == 0) {
    // Sal is dead, so Pablo is dead, so the airport is badly run
    // CJC comment: this seems really extreme!! maybe delay by 1 day randomly but that's it!
    bDaysAhead += Random(5) + 1;
  }

  return bDaysAhead;
}

function PurchaseBobbyOrder(): void {
  // if the shipment is going to Drassen, add the inventory
  if (gbSelectedCity == Enum70.BR_DRASSEN || gbSelectedCity == Enum70.BR_MEDUNA) {
    //					BobbyRayOrderStruct *pBobbyRayPurchase;
    //					UINT32	uiResetTimeSec;
    //		UINT8	i, ubCount;
    //		UINT8	cnt;
    //		INT8		bDaysAhead;

    /*
                    //if we need to add more array elements for the Order Array
                    if( LaptopSaveInfo.usNumberOfBobbyRayOrderItems <= LaptopSaveInfo.usNumberOfBobbyRayOrderUsed )
                    {
                            LaptopSaveInfo.usNumberOfBobbyRayOrderItems++;
                            LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = MemRealloc( LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray, sizeof( BobbyRayOrderStruct ) * LaptopSaveInfo.usNumberOfBobbyRayOrderItems );
                            if( LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray == NULL )
                                    return;

                            memset( &LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ LaptopSaveInfo.usNumberOfBobbyRayOrderItems - 1 ], 0, sizeof( BobbyRayOrderStruct ) );
                    }

                    for( cnt =0; cnt< LaptopSaveInfo.usNumberOfBobbyRayOrderItems; cnt++ )
                    {
                            //get an empty element in the array
                            if( !LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].fActive )
                                    break;
                    }
    */

    // gets reset when the confirm order graphic disappears
    gfCanAcceptOrder = FALSE;

    //					pBobbyRayPurchase = MemAlloc( sizeof( BobbyRayOrderStruct ) );
    //					memset(pBobbyRayPurchase, 0, sizeof( BobbyRayOrderStruct ) );

    /*
                    ubCount = 0;
                    for(i=0; i<MAX_PURCHASE_AMOUNT; i++)
                    {
                            //if the item was purchased
                            if( BobbyRayPurchases[ i ].ubNumberPurchased )
                            {
                                    //copy the purchases into the struct that will be added to the queue
                                    memcpy(&LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].BobbyRayPurchase[ ubCount ] , &BobbyRayPurchases[i],  sizeof(BobbyRayPurchaseStruct));
                                    ubCount ++;
                            }
                    }

                    LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].ubNumberPurchases = ubCount;
                    LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].fActive = TRUE;
                    LaptopSaveInfo.usNumberOfBobbyRayOrderUsed++;
    */

    // add the delivery
    AddNewBobbyRShipment(BobbyRayPurchases, gbSelectedCity, gubSelectedLight, TRUE, CalcPackageTotalWeight());

    /*
                    //get the length of time to receive the shipment
                    bDaysAhead = CalculateOrderDelay( gubSelectedLight );

                    //AddStrategicEvent( EVENT_BOBBYRAY_PURCHASE, uiResetTimeSec, cnt);
                    AddFutureDayStrategicEvent( EVENT_BOBBYRAY_PURCHASE, (8 + Random(4) ) * 60, cnt, bDaysAhead );
    */
  }

  // Add the transaction to the finance page
  AddTransactionToPlayersBook(Enum80.BOBBYR_PURCHASE, 0, GetWorldTotalMin(), -giGrandTotal);

  // display the confirm order graphic
  gfDrawConfirmOrderGrpahic = TRUE;

  // Get rid of the city drop dowm, if it is being displayed
  gubDropDownAction = Enum69.BR_DROP_DOWN_DESTROY;

  MSYS_EnableRegion(addressof(gSelectedConfirmOrderRegion));
  gfRemoveItemsFromStock = TRUE;

  gbSelectedCity = -1;
}

function AddJohnsGunShipment(): void {
  let Temp: BobbyRayPurchaseStruct[] /* [MAX_PURCHASE_AMOUNT] */;
  //	UINT8	cnt;
  let bDaysAhead: INT8;

  // clear out the memory
  memset(Temp, 0, sizeof(BobbyRayPurchaseStruct) * MAX_PURCHASE_AMOUNT);

  /*
          //if we need to add more array elements for the Order Array
          if( LaptopSaveInfo.usNumberOfBobbyRayOrderItems <= LaptopSaveInfo.usNumberOfBobbyRayOrderUsed )
          {
                  LaptopSaveInfo.usNumberOfBobbyRayOrderItems++;
                  LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray = MemRealloc( LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray, sizeof( BobbyRayOrderStruct ) * LaptopSaveInfo.usNumberOfBobbyRayOrderItems );
                  if( LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray == NULL )
                          return;

                  memset( &LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ LaptopSaveInfo.usNumberOfBobbyRayOrderItems - 1 ], 0, sizeof( BobbyRayOrderStruct ) );
          }

          for( cnt =0; cnt< LaptopSaveInfo.usNumberOfBobbyRayOrderItems; cnt++ )
          {
                  //get an empty element in the array
                  if( !LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].fActive )
                          break;
          }
  */

  // want to add two guns (Automags, AUTOMAG_III), and four clips of ammo.

  Temp[0].usItemIndex = Enum225.AUTOMAG_III;
  Temp[0].ubNumberPurchased = 2;
  Temp[0].bItemQuality = 100;
  Temp[0].usBobbyItemIndex = 0; // does this get used anywhere???
  Temp[0].fUsed = FALSE;

  //	memcpy( &(LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].BobbyRayPurchase[0]), &Temp, sizeof(BobbyRayPurchaseStruct) );

  Temp[1].usItemIndex = Enum225.CLIP762N_5_AP;
  Temp[1].ubNumberPurchased = 2;
  Temp[1].bItemQuality = 5;
  Temp[1].usBobbyItemIndex = 0; // does this get used anywhere???
  Temp[1].fUsed = FALSE;

  /*
          memcpy( &(LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].BobbyRayPurchase[1]), &Temp, sizeof(BobbyRayPurchaseStruct) );


          LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].ubNumberPurchases = 2;
          LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].fActive = TRUE;
          LaptopSaveInfo.usNumberOfBobbyRayOrderUsed++;
  */
  bDaysAhead = CalculateOrderDelay(2) + 2;

  // add a random amount between so it arrives between 8:00 am and noon
  //	AddFutureDayStrategicEvent( EVENT_BOBBYRAY_PURCHASE, (8 + Random(4) ) * 60, cnt, bDaysAhead );

  // add the delivery	( weight is not needed as it will not be displayed )
  AddNewBobbyRShipment(Temp, Enum70.BR_DRASSEN, bDaysAhead, FALSE, 0);
}

function ConfirmBobbyRPurchaseMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, load the game
  if (bExitValue == MSG_BOX_RETURN_YES) {
    PurchaseBobbyOrder();
  }
}

function EnterInitBobbyRayOrder(): void {
  memset(addressof(BobbyRayPurchases), 0, sizeof(BobbyRayPurchaseStruct) * MAX_PURCHASE_AMOUNT);
  gubSelectedLight = 0;
  gfReDrawBobbyOrder = TRUE;
  gbSelectedCity = -1;
  gubCityAtTopOfList = 0;

  // Get rid of the city drop dowm, if it is being displayed
  gubDropDownAction = Enum69.BR_DROP_DOWN_DESTROY;

  // disable the accept order button
  DisableButton(guiBobbyRAcceptOrder);
}

function CalcPackageTotalWeight(): UINT32 {
  let i: UINT16;
  let uiTotalWeight: UINT32 = 0;

  // loop through all the packages
  for (i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    // if the item was purchased
    if (BobbyRayPurchases[i].ubNumberPurchased) {
      // add the current weight to the total
      uiTotalWeight += Item[BobbyRayPurchases[i].usItemIndex].ubWeight * BobbyRayPurchases[i].ubNumberPurchased;
    }
  }

  return uiTotalWeight;
}

function DisplayPackageWeight(): void {
  let zTemp: CHAR16[] /* [32] */;
  let uiTotalWeight: UINT32 = CalcPackageTotalWeight();
  //	FLOAT			fWeight = (FLOAT)(uiTotalWeight / 10.0);

  // Display the 'Package Weight' text
  DrawTextToScreen(BobbyROrderFormText[Enum349.BOBBYR_PACKAGE_WEIGHT], BOBBYR_PACKAXGE_WEIGHT_X + 8, BOBBYR_PACKAXGE_WEIGHT_Y + 4, BOBBYR_PACKAXGE_WEIGHT_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the weight
  //	swprintf( zTemp, L"%3.1f %s", fWeight, pMessageStrings[ MSG_KILOGRAM_ABBREVIATION ] );
  swprintf(zTemp, "%3.1f %s", (GetWeightBasedOnMetricOption(uiTotalWeight) / 10.0), GetWeightUnitString());
  DrawTextToScreen(zTemp, BOBBYR_PACKAXGE_WEIGHT_X + 3, BOBBYR_PACKAXGE_WEIGHT_Y + 4, BOBBYR_PACKAXGE_WEIGHT_WIDTH, BOBBYR_ORDER_STATIC_TEXT_FONT, BOBBYR_ORDER_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
}

function BtnBobbyRGotoShipmentPageCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BOBBYR_SHIPMENTS;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function CreateBobbyRayOrderTitle(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  // load BobbyRayTitle graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BobbyRayTitle.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBobbyRayTitle)));

  // the link to home page from the title
  MSYS_DefineRegion(addressof(gSelectedTitleLinkRegion), BOBBYR_BOBBY_RAY_TITLE_X, BOBBYR_BOBBY_RAY_TITLE_Y, (BOBBYR_BOBBY_RAY_TITLE_X + BOBBYR_BOBBY_RAY_TITLE_WIDTH), (BOBBYR_BOBBY_RAY_TITLE_Y + BOBBYR_BOBBY_RAY_TITLE_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectTitleLinkRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedTitleLinkRegion));

  return TRUE;
}

function DestroyBobbyROrderTitle(): void {
  MSYS_RemoveRegion(addressof(gSelectedTitleLinkRegion));
  DeleteVideoObjectFromIndex(guiBobbyRayTitle);
}

function DrawBobbyROrderTitle(): void {
  let hPixHandle: HVOBJECT;

  // Bobbyray title
  GetVideoObject(addressof(hPixHandle), guiBobbyRayTitle);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_BOBBY_RAY_TITLE_X, BOBBYR_BOBBY_RAY_TITLE_Y, VO_BLT_SRCTRANSPARENCY, NULL);
}

function AddNewBobbyRShipment(pPurchaseStruct: Pointer<BobbyRayPurchaseStruct>, ubDeliveryLoc: UINT8, ubDeliveryMethod: UINT8, fPruchasedFromBobbyR: BOOLEAN, uiPackageWeight: UINT32): BOOLEAN {
  let iCnt: INT32;
  let iFoundSpot: INT32 = -1;
  let ubItemCount: UINT8 = 0;
  let i: UINT8;
  let bDaysAhead: INT8 = 0;
  //	UINT32	uiPackageWeight;
  //	gpNewBobbyrShipments = NULL;
  //	giNumberOfNewBobbyRShipment = 0;

  // loop through and see if there is a free spot to insert the new order
  for (iCnt = 0; iCnt < giNumberOfNewBobbyRShipment; iCnt++) {
    if (!gpNewBobbyrShipments.value.fActive) {
      iFoundSpot = iCnt;
      break;
    }
  }

  if (iFoundSpot == -1) {
    // increment the number of spots used
    giNumberOfNewBobbyRShipment++;

    // allocate some more memory
    gpNewBobbyrShipments = MemRealloc(gpNewBobbyrShipments, sizeof(NewBobbyRayOrderStruct) * giNumberOfNewBobbyRShipment);

    iFoundSpot = giNumberOfNewBobbyRShipment - 1;
  }

  // memset the memory
  memset(addressof(gpNewBobbyrShipments[iFoundSpot]), 0, sizeof(NewBobbyRayOrderStruct));

  gpNewBobbyrShipments[iFoundSpot].fActive = TRUE;
  gpNewBobbyrShipments[iFoundSpot].ubDeliveryLoc = ubDeliveryLoc;
  gpNewBobbyrShipments[iFoundSpot].ubDeliveryMethod = ubDeliveryMethod;

  if (fPruchasedFromBobbyR)
    gpNewBobbyrShipments[iFoundSpot].fDisplayedInShipmentPage = TRUE;
  else
    gpNewBobbyrShipments[iFoundSpot].fDisplayedInShipmentPage = FALSE;

  // get the apckage weight, if the weight is "below" the minimum, use the minimum
  if (uiPackageWeight < MIN_SHIPPING_WEIGHT) {
    gpNewBobbyrShipments[iFoundSpot].uiPackageWeight = MIN_SHIPPING_WEIGHT;
  } else {
    gpNewBobbyrShipments[iFoundSpot].uiPackageWeight = uiPackageWeight;
  }

  gpNewBobbyrShipments[iFoundSpot].uiOrderedOnDayNum = GetWorldDay();

  // count the number of purchases
  ubItemCount = 0;
  for (i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    // if the item was purchased
    if (pPurchaseStruct[i].ubNumberPurchased) {
      // copy the new data into the order struct
      memcpy(addressof(gpNewBobbyrShipments[iFoundSpot].BobbyRayPurchase[ubItemCount]), addressof(pPurchaseStruct[i]), sizeof(BobbyRayPurchaseStruct));

      // copy the purchases into the struct that will be added to the queue
      //			memcpy(&LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ cnt ].BobbyRayPurchase[ ubCount ] , &BobbyRayPurchases[i],  sizeof(BobbyRayPurchaseStruct));
      ubItemCount++;
    }
  }

  gpNewBobbyrShipments[iFoundSpot].ubNumberPurchases = ubItemCount;

  // get the length of time to receive the shipment
  if (fPruchasedFromBobbyR)
    bDaysAhead = CalculateOrderDelay(ubDeliveryMethod);
  else
    bDaysAhead = ubDeliveryMethod;

  // AddStrategicEvent( EVENT_BOBBYRAY_PURCHASE, uiResetTimeSec, cnt);
  AddFutureDayStrategicEvent(Enum132.EVENT_BOBBYRAY_PURCHASE, (8 + Random(4)) * 60, iFoundSpot, bDaysAhead);

  return TRUE;
}

function CountNumberOfBobbyPurchasesThatAreInTransit(): UINT16 {
  let usItemCount: UINT16 = 0;
  let iCnt: INT32;

  for (iCnt = 0; iCnt < giNumberOfNewBobbyRShipment; iCnt++) {
    if (gpNewBobbyrShipments[iCnt].fActive) {
      usItemCount++;
    }
  }

  return usItemCount;
}

function NewWayOfSavingBobbyRMailOrdersToSaveGameFile(hFile: HWFILE): BOOLEAN {
  let iCnt: INT32;
  let uiNumBytesWritten: UINT32;

  // Write the number of orders
  FileWrite(hFile, addressof(giNumberOfNewBobbyRShipment), sizeof(INT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(INT32)) {
    FileClose(hFile);
    return FALSE;
  }

  // loop through and save all the mail order slots
  for (iCnt = 0; iCnt < giNumberOfNewBobbyRShipment; iCnt++) {
    // Write the order
    FileWrite(hFile, addressof(gpNewBobbyrShipments[iCnt]), sizeof(NewBobbyRayOrderStruct), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(NewBobbyRayOrderStruct)) {
      FileClose(hFile);
      return FALSE;
    }
  }

  return TRUE;
}

function NewWayOfLoadingBobbyRMailOrdersToSaveGameFile(hFile: HWFILE): BOOLEAN {
  let iCnt: INT32;
  let uiNumBytesRead: UINT32;

  // clear out the old list
  ShutDownBobbyRNewMailOrders();

  // Read the number of orders
  FileRead(hFile, addressof(giNumberOfNewBobbyRShipment), sizeof(INT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(INT32)) {
    FileClose(hFile);
    return FALSE;
  }

  if (giNumberOfNewBobbyRShipment == 0) {
    gpNewBobbyrShipments = NULL;
  } else {
    // Allocate memory for the list
    gpNewBobbyrShipments = MemAlloc(sizeof(NewBobbyRayOrderStruct) * giNumberOfNewBobbyRShipment);
    if (gpNewBobbyrShipments == NULL) {
      Assert(0);
      return FALSE;
    }

    // loop through and load all the mail order slots
    for (iCnt = 0; iCnt < giNumberOfNewBobbyRShipment; iCnt++) {
      // Read the order
      FileRead(hFile, addressof(gpNewBobbyrShipments[iCnt]), sizeof(NewBobbyRayOrderStruct), addressof(uiNumBytesRead));
      if (uiNumBytesRead != sizeof(NewBobbyRayOrderStruct)) {
        FileClose(hFile);
        return FALSE;
      }
    }
  }

  return TRUE;
}
