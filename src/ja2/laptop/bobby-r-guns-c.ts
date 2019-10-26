const BOBBYR_DEFAULT_MENU_COLOR = 255;

const BOBBYR_GRID_PIC_WIDTH = 118;
const BOBBYR_GRID_PIC_HEIGHT = 69;

const BOBBYR_GRID_PIC_X = BOBBYR_GRIDLOC_X + 3;
const BOBBYR_GRID_PIC_Y = BOBBYR_GRIDLOC_Y + 3;

const BOBBYR_GRID_OFFSET = 72;

const BOBBYR_ORDER_TITLE_FONT = () => FONT14ARIAL();
const BOBBYR_ORDER_TEXT_FONT = () => FONT10ARIAL();
const BOBBYR_ORDER_TEXT_COLOR = 75;

const BOBBYR_STATIC_TEXT_COLOR = 75;
const BOBBYR_ITEM_DESC_TEXT_FONT = () => FONT10ARIAL();
const BOBBYR_ITEM_DESC_TEXT_COLOR = FONT_MCOLOR_WHITE;
const BOBBYR_ITEM_NAME_TEXT_FONT = () => FONT10ARIAL();
const BOBBYR_ITEM_NAME_TEXT_COLOR = FONT_MCOLOR_WHITE;

const NUM_BOBBYRPAGE_MENU = 6;
const NUM_CATALOGUE_BUTTONS = 5;
const BOBBYR_NUM_WEAPONS_ON_PAGE = 4;

const BOBBYR_BRTITLE_X = LAPTOP_SCREEN_UL_X + 4;
const BOBBYR_BRTITLE_Y = LAPTOP_SCREEN_WEB_UL_Y + 3;
const BOBBYR_BRTITLE_WIDTH = 46;
const BOBBYR_BRTITLE_HEIGHT = 42;

const BOBBYR_TO_ORDER_TITLE_X = 195;
const BOBBYR_TO_ORDER_TITLE_Y = 42 + LAPTOP_SCREEN_WEB_DELTA_Y;

const BOBBYR_TO_ORDER_TEXT_X = BOBBYR_TO_ORDER_TITLE_X + 75;
const BOBBYR_TO_ORDER_TEXT_Y = 33 + LAPTOP_SCREEN_WEB_DELTA_Y;
const BOBBYR_TO_ORDER_TEXT_WIDTH = 330;

const BOBBYR_PREVIOUS_BUTTON_X = LAPTOP_SCREEN_UL_X + 5; // BOBBYR_HOME_BUTTON_X + BOBBYR_CATALOGUE_BUTTON_WIDTH + 5
const BOBBYR_PREVIOUS_BUTTON_Y = LAPTOP_SCREEN_WEB_UL_Y + 340; // BOBBYR_HOME_BUTTON_Y

const BOBBYR_NEXT_BUTTON_X = LAPTOP_SCREEN_UL_X + 412; // BOBBYR_ORDER_FORM_X + BOBBYR_ORDER_FORM_WIDTH + 5
const BOBBYR_NEXT_BUTTON_Y = BOBBYR_PREVIOUS_BUTTON_Y; // BOBBYR_PREVIOUS_BUTTON_Y

const BOBBYR_CATALOGUE_BUTTON_START_X = BOBBYR_PREVIOUS_BUTTON_X + 92; // LAPTOP_SCREEN_UL_X + 93 - BOBBYR_CATALOGUE_BUTTON_WIDTH/2
const BOBBYR_CATALOGUE_BUTTON_GAP = (318 - NUM_CATALOGUE_BUTTONS * BOBBYR_CATALOGUE_BUTTON_WIDTH) / (NUM_CATALOGUE_BUTTONS + 1) + BOBBYR_CATALOGUE_BUTTON_WIDTH + 1; // 80
const BOBBYR_CATALOGUE_BUTTON_Y = LAPTOP_SCREEN_WEB_UL_Y + 340;
const BOBBYR_CATALOGUE_BUTTON_WIDTH = 56; // 75

const BOBBYR_HOME_BUTTON_X = 120;
const BOBBYR_HOME_BUTTON_Y = 400 + LAPTOP_SCREEN_WEB_DELTA_Y;

const BOBBYR_CATALOGUE_BUTTON_TEXT_Y = BOBBYR_CATALOGUE_BUTTON_Y + 5;

const BOBBYR_PREVIOUS_PAGE = 0;
const BOBBYR_NEXT_PAGE = 1;

const BOBBYR_ITEM_DESC_START_X = BOBBYR_GRIDLOC_X + 172 + 5;
const BOBBYR_ITEM_DESC_START_Y = BOBBYR_GRIDLOC_Y + 6;
const BOBBYR_ITEM_DESC_START_WIDTH = 214 - 10 + 20;

const BOBBYR_ITEM_NAME_X = BOBBYR_GRIDLOC_X + 6;
const BOBBYR_ITEM_NAME_Y_OFFSET = 54;

const BOBBYR_ORDER_NUM_WIDTH = 15;
const BOBBYR_ORDER_NUM_X = BOBBYR_GRIDLOC_X + 120 - BOBBYR_ORDER_NUM_WIDTH; // BOBBYR_ITEM_STOCK_TEXT_X
const BOBBYR_ORDER_NUM_Y_OFFSET = 1;

const BOBBYR_ITEM_WEIGHT_TEXT_X = BOBBYR_GRIDLOC_X + 409 + 3;
const BOBBYR_ITEM_WEIGHT_TEXT_Y = 3;

const BOBBYR_ITEM_WEIGHT_NUM_X = BOBBYR_GRIDLOC_X + 429 - 2;
const BOBBYR_ITEM_WEIGHT_NUM_Y = 3;
const BOBBYR_ITEM_WEIGHT_NUM_WIDTH = 60;

const BOBBYR_ITEM_SPEC_GAP = 2;

const BOBBYR_ITEM_COST_TEXT_X = BOBBYR_GRIDLOC_X + 125;
const BOBBYR_ITEM_COST_TEXT_Y = BOBBYR_GRIDLOC_Y + 6;
const BOBBYR_ITEM_COST_TEXT_WIDTH = 42;

const BOBBYR_ITEM_COST_NUM_X = BOBBYR_ITEM_COST_TEXT_X;
const BOBBYR_ITEM_COST_NUM_Y = BOBBYR_ITEM_COST_TEXT_Y + 10;

const BOBBYR_ITEM_STOCK_TEXT_X = BOBBYR_ITEM_COST_TEXT_X;

const BOBBYR_ITEM_QTY_TEXT_X = BOBBYR_GRIDLOC_X + 5; // BOBBYR_ITEM_COST_TEXT_X
const BOBBYR_ITEM_QTY_TEXT_Y = BOBBYR_ITEM_COST_TEXT_Y + 28;
const BOBBYR_ITEM_QTY_WIDTH = 95;

const BOBBYR_ITEM_QTY_NUM_X = BOBBYR_GRIDLOC_X + 105; // BOBBYR_ITEM_COST_TEXT_X + 1
const BOBBYR_ITEM_QTY_NUM_Y = BOBBYR_ITEM_QTY_TEXT_Y; // BOBBYR_ITEM_COST_TEXT_Y + 40

const BOBBYR_ITEMS_BOUGHT_X = BOBBYR_GRIDLOC_X + 105 - BOBBYR_ORDER_NUM_WIDTH; // BOBBYR_ITEM_QTY_NUM_X

const BOBBY_RAY_NOT_PURCHASED = 255;
const BOBBY_RAY_MAX_AMOUNT_OF_ITEMS_TO_PURCHASE = 200;

const BOBBYR_ORDER_FORM_X = LAPTOP_SCREEN_UL_X + 200; // 204
const BOBBYR_ORDER_FORM_Y = LAPTOP_SCREEN_WEB_UL_Y + 367;
const BOBBYR_ORDER_FORM_WIDTH = 95;

const BOBBYR_ORDER_SUBTOTAL_X = 490;
const BOBBYR_ORDER_SUBTOTAL_Y = BOBBYR_ORDER_FORM_Y + 2; // BOBBYR_HOME_BUTTON_Y

const BOBBYR_PERCENT_FUNTCIONAL_X = BOBBYR_ORDER_SUBTOTAL_X;
const BOBBYR_PERCENT_FUNTCIONAL_Y = BOBBYR_ORDER_SUBTOTAL_Y + 15;

let BobbyRayPurchases: BobbyRayPurchaseStruct[] /* [MAX_PURCHASE_AMOUNT] */;

// BobbyRayOrderStruct *BobbyRayOrdersOnDeliveryArray=NULL;
// UINT8	usNumberOfBobbyRayOrderItems = 0;
// UINT8	usNumberOfBobbyRayOrderUsed = 0;

let guiGunBackground: UINT32;
let guiGunsGrid: UINT32;
let guiBrTitle: UINT32;
let gusCurWeaponIndex: UINT16;
let gubCurPage: UINT8;
let ubCatalogueButtonValues: UINT8[] /* [] */ = [
  Enum95.LAPTOP_MODE_BOBBY_R_GUNS,
  Enum95.LAPTOP_MODE_BOBBY_R_AMMO,
  Enum95.LAPTOP_MODE_BOBBY_R_ARMOR,
  Enum95.LAPTOP_MODE_BOBBY_R_MISC,
  Enum95.LAPTOP_MODE_BOBBY_R_USED,
];

let gusLastItemIndex: UINT16 = 0;
let gusFirstItemIndex: UINT16 = 0;
let gubNumItemsOnScreen: UINT8;
let gubNumPages: UINT8;

let gfBigImageMouseRegionCreated: boolean;
let gusItemNumberForItemsOnScreen: UINT16[] /* [BOBBYR_NUM_WEAPONS_ON_PAGE] */;

let gfOnUsedPage: boolean;

let gusOldItemNumOnTopOfPage: UINT16 = 65535;

let guiBobbyRPageMenu: UINT32[] /* [NUM_CATALOGUE_BUTTONS] */;
let guiBobbyRPageMenuImage: INT32;

let guiBobbyRPreviousPage: UINT32;
let guiBobbyRPreviousPageImage: INT32;

let guiBobbyRNextPage: UINT32;
let guiBobbyRNextPageImage: INT32;

// Big Image Mouse region
let gSelectedBigImageRegion: MOUSE_REGION[] /* [BOBBYR_NUM_WEAPONS_ON_PAGE] */;

let guiBobbyROrderForm: UINT32;
let guiBobbyROrderFormImage: INT32;

let guiBobbyRHome: UINT32;
let guiBobbyRHomeImage: INT32;

// Link from the title
let gSelectedTitleImageLinkRegion: MOUSE_REGION;

let guiTempCurrentMode: UINT32;

// ppp

function GameInitBobbyRGuns(): void {
  guiTempCurrentMode = 0;

  memset(addressof(BobbyRayPurchases), 0, MAX_PURCHASE_AMOUNT);
}

function EnterInitBobbyRGuns(): void {
  guiTempCurrentMode = 0;

  memset(addressof(BobbyRayPurchases), 0, MAX_PURCHASE_AMOUNT);
}

function EnterBobbyRGuns(): boolean {
  let VObjectDesc: VOBJECT_DESC;

  gfBigImageMouseRegionCreated = false;

  // load the background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\gunbackground.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiGunBackground)));

  // load the gunsgrid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\gunsgrid.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiGunsGrid)));

  InitBobbyBrTitle();

  SetFirstLastPagesForNew(IC_BOBBY_GUN);
  //	CalculateFirstAndLastIndexs();
  /*
          if(giCurrentSubPage == 0)
                  gusCurWeaponIndex = gusFirstGunIndex;
          else
                  gusCurWeaponIndex = (UINT8)giCurrentSubPage;
  */
  // Draw menu bar
  InitBobbyMenuBar(IC_GUN);

  // render once
  RenderBobbyRGuns();

  //	RenderBobbyRGuns();
  return true;
}

function ExitBobbyRGuns(): void {
  DeleteVideoObjectFromIndex(guiGunBackground);
  DeleteVideoObjectFromIndex(guiGunsGrid);
  DeleteBobbyBrTitle();
  DeleteBobbyMenuBar();

  DeleteMouseRegionForBigImage();

  giCurrentSubPage = gusCurWeaponIndex;
  guiLastBobbyRayPage = Enum95.LAPTOP_MODE_BOBBY_R_GUNS;
}

function HandleBobbyRGuns(): void {
}

function RenderBobbyRGuns(): void {
  let hPixHandle: HVOBJECT;

  WebPageTileBackground(BOBBYR_NUM_HORIZONTAL_TILES, BOBBYR_NUM_VERTICAL_TILES, BOBBYR_BACKGROUND_WIDTH, BOBBYR_BACKGROUND_HEIGHT, guiGunBackground);

  // Display title at top of page
  DisplayBobbyRBrTitle();

  // GunForm
  GetVideoObject(addressof(hPixHandle), guiGunsGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_GRIDLOC_X, BOBBYR_GRIDLOC_Y, VO_BLT_SRCTRANSPARENCY, null);

  //	DeleteMouseRegionForBigImage();
  DisplayItemInfo(IC_BOBBY_GUN);
  UpdateButtonText(guiCurrentLaptopMode);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(0, 0, 640, 480);
}

function DisplayBobbyRBrTitle(): boolean {
  let hPixHandle: HVOBJECT;

  // BR title
  GetVideoObject(addressof(hPixHandle), guiBrTitle);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_BRTITLE_X, BOBBYR_BRTITLE_Y, VO_BLT_SRCTRANSPARENCY, null);

  // To Order Text
  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_TO_ORDER], BOBBYR_TO_ORDER_TITLE_X, BOBBYR_TO_ORDER_TITLE_Y, 0, BOBBYR_ORDER_TITLE_FONT(), BOBBYR_ORDER_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // First put a shadow behind the image
  ShadowVideoSurfaceRect(FRAME_BUFFER, BOBBYR_TO_ORDER_TEXT_X - 2, BOBBYR_TO_ORDER_TEXT_Y - 2, BOBBYR_TO_ORDER_TEXT_X + BOBBYR_TO_ORDER_TEXT_WIDTH, BOBBYR_TO_ORDER_TEXT_Y + 31);

  // To Order text
  DisplayWrappedString(BOBBYR_TO_ORDER_TEXT_X, BOBBYR_TO_ORDER_TEXT_Y, BOBBYR_TO_ORDER_TEXT_WIDTH, 2, BOBBYR_ORDER_TEXT_FONT(), BOBBYR_ORDER_TEXT_COLOR, BobbyRText[Enum350.BOBBYR_GUNS_CLICK_ON_ITEMS], FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  return true;
}

function InitBobbyBrTitle(): boolean {
  let VObjectDesc: VOBJECT_DESC;

  // load the br title graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\br.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBrTitle)));

  // initialize the link to the homepage by clicking on the title
  MSYS_DefineRegion(addressof(gSelectedTitleImageLinkRegion), BOBBYR_BRTITLE_X, BOBBYR_BRTITLE_Y, (BOBBYR_BRTITLE_X + BOBBYR_BRTITLE_WIDTH), (BOBBYR_BRTITLE_Y + BOBBYR_BRTITLE_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectTitleImageLinkRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedTitleImageLinkRegion));

  gusOldItemNumOnTopOfPage = 65535;

  return true;
}

function DeleteBobbyBrTitle(): boolean {
  DeleteVideoObjectFromIndex(guiBrTitle);

  MSYS_RemoveRegion(addressof(gSelectedTitleImageLinkRegion));

  DeleteMouseRegionForBigImage();

  return true;
}

function SelectTitleImageLinkRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BOBBY_R;
  }
}

function InitBobbyMenuBar(): boolean {
  let i: UINT8;
  let usPosX: UINT16;
  let bCurMode: UINT8;

  // Previous button
  guiBobbyRPreviousPageImage = LoadButtonImage("LAPTOP\\PreviousButton.sti", -1, 0, -1, 1, -1);
  guiBobbyRPreviousPage = CreateIconAndTextButton(guiBobbyRPreviousPageImage, BobbyRText[Enum350.BOBBYR_GUNS_PREVIOUS_ITEMS], BOBBYR_GUNS_BUTTON_FONT(), BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_PREVIOUS_BUTTON_X, BOBBYR_PREVIOUS_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnBobbyRNextPreviousPageCallback);
  SetButtonCursor(guiBobbyRPreviousPage, Enum317.CURSOR_LAPTOP_SCREEN);
  MSYS_SetBtnUserData(guiBobbyRPreviousPage, 0, BOBBYR_PREVIOUS_PAGE);
  SpecifyDisabledButtonStyle(guiBobbyRPreviousPage, Enum29.DISABLED_STYLE_SHADED);

  guiBobbyRPageMenuImage = LoadButtonImage("LAPTOP\\CatalogueButton1.sti", -1, 0, -1, 1, -1);

  // Next button
  guiBobbyRNextPageImage = LoadButtonImage("LAPTOP\\NextButton.sti", -1, 0, -1, 1, -1);
  guiBobbyRNextPage = CreateIconAndTextButton(guiBobbyRNextPageImage, BobbyRText[Enum350.BOBBYR_GUNS_MORE_ITEMS], BOBBYR_GUNS_BUTTON_FONT(), BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_NEXT_BUTTON_X, BOBBYR_NEXT_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnBobbyRNextPreviousPageCallback);
  SetButtonCursor(guiBobbyRNextPage, Enum317.CURSOR_LAPTOP_SCREEN);
  MSYS_SetBtnUserData(guiBobbyRNextPage, 0, BOBBYR_NEXT_PAGE);
  SpecifyDisabledButtonStyle(guiBobbyRNextPage, Enum29.DISABLED_STYLE_SHADED);

  bCurMode = 0;
  usPosX = BOBBYR_CATALOGUE_BUTTON_START_X;
  for (i = 0; i < NUM_CATALOGUE_BUTTONS; i++) {
    // Catalogue Buttons button
    guiBobbyRPageMenu[i] = CreateIconAndTextButton(guiBobbyRPageMenuImage, BobbyRText[Enum350.BOBBYR_GUNS_GUNS + i], BOBBYR_GUNS_BUTTON_FONT(), BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, usPosX, BOBBYR_CATALOGUE_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnBobbyRPageMenuCallback);

    SetButtonCursor(guiBobbyRPageMenu[i], Enum317.CURSOR_LAPTOP_SCREEN);

    MSYS_SetBtnUserData(guiBobbyRPageMenu[i], 0, ubCatalogueButtonValues[bCurMode]);

    usPosX += BOBBYR_CATALOGUE_BUTTON_GAP;
    bCurMode++;
  }

  // Order Form button
  guiBobbyROrderFormImage = LoadButtonImage("LAPTOP\\OrderFormButton.sti", -1, 0, -1, 1, -1);
  guiBobbyROrderForm = CreateIconAndTextButton(guiBobbyROrderFormImage, BobbyRText[Enum350.BOBBYR_GUNS_ORDER_FORM], BOBBYR_GUNS_BUTTON_FONT(), BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_ORDER_FORM_X, BOBBYR_ORDER_FORM_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnBobbyROrderFormCallback);

  SetButtonCursor(guiBobbyROrderForm, Enum317.CURSOR_LAPTOP_SCREEN);

  // Home button

  guiBobbyRHomeImage = LoadButtonImage("LAPTOP\\CatalogueButton.sti", -1, 0, -1, 1, -1);
  guiBobbyRHome = CreateIconAndTextButton(guiBobbyRHomeImage, BobbyRText[Enum350.BOBBYR_GUNS_HOME], BOBBYR_GUNS_BUTTON_FONT(), BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_HOME_BUTTON_X, BOBBYR_HOME_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnBobbyRHomeButtonCallback);
  SetButtonCursor(guiBobbyRHome, Enum317.CURSOR_LAPTOP_SCREEN);

  return true;
}

function DeleteBobbyMenuBar(): boolean {
  let i: UINT8;

  UnloadButtonImage(guiBobbyRNextPageImage);
  UnloadButtonImage(guiBobbyRPreviousPageImage);
  UnloadButtonImage(guiBobbyRPageMenuImage);
  UnloadButtonImage(guiBobbyROrderFormImage);
  UnloadButtonImage(guiBobbyRHomeImage);

  RemoveButton(guiBobbyRNextPage);
  RemoveButton(guiBobbyRPreviousPage);
  RemoveButton(guiBobbyROrderForm);
  RemoveButton(guiBobbyRHome);

  for (i = 0; i < NUM_CATALOGUE_BUTTONS; i++) {
    RemoveButton(guiBobbyRPageMenu[i]);
  }

  return true;
}

function BtnBobbyRPageMenuCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let bNewValue: UINT32;
  bNewValue = MSYS_GetBtnUserData(btn, 0);

  if (!(btn.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;

    guiTempCurrentMode = bNewValue;

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    guiTempCurrentMode = BOBBYR_DEFAULT_MENU_COLOR;
    UpdateButtonText(guiCurrentLaptopMode);
    guiCurrentLaptopMode = bNewValue;
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    guiTempCurrentMode = BOBBYR_DEFAULT_MENU_COLOR;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnBobbyRNextPreviousPageCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let bNewValue: UINT32;

  bNewValue = MSYS_GetBtnUserData(btn, 0);

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;

    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);

    // if previous screen
    if (bNewValue == BOBBYR_PREVIOUS_PAGE) {
      if (gubCurPage > 0)
        gubCurPage--;
    }
    // else next screen
    else {
      if (gubCurPage < gubNumPages - 1)
        gubCurPage++;
    }

    DeleteMouseRegionForBigImage();

    fReDrawScreenFlag = true;
    fPausedReDrawScreenFlag = true;
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function DisplayItemInfo(uiItemClass: UINT32): boolean {
  let i: UINT16;
  let ubCount: UINT8 = 0;
  let PosY: UINT16;
  let usTextPosY: UINT16;
  let ubFirstIndex: UINT16 = 0;
  let usItemIndex: UINT16;
  let sDollarTemp: wchar_t[] /* [60] */;
  let sTemp: wchar_t[] /* [60] */;
  let pItemNumbers: INT16[] /* [BOBBYR_NUM_WEAPONS_ON_PAGE] */;

  PosY = BOBBYR_GRID_PIC_Y;
  usTextPosY = BOBBYR_ITEM_DESC_START_Y;

  //	InitFirstAndLastGlobalIndex( uiItemClass );

  // if there are no items then return
  if (gusFirstItemIndex == BOBBYR_NO_ITEMS) {
    if (fExitingLaptopFlag)
      return true;

    DisableBobbyRButtons();

    // Display a popup saying we are out of stock
    DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, BobbyRText[Enum350.BOBBYR_NO_MORE_STOCK], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, OutOfStockMessageBoxCallBack);
    return true;
  }

  if (uiItemClass == BOBBYR_USED_ITEMS)
    CalcFirstIndexForPage(LaptopSaveInfo.BobbyRayUsedInventory, uiItemClass);
  else
    CalcFirstIndexForPage(LaptopSaveInfo.BobbyRayInventory, uiItemClass);

  DisableBobbyRButtons();

  if (gusOldItemNumOnTopOfPage != gusCurWeaponIndex) {
    DeleteMouseRegionForBigImage();
  }

  for (i = gusCurWeaponIndex; ((i <= gusLastItemIndex) && (ubCount < 4)); i++) {
    if (uiItemClass == BOBBYR_USED_ITEMS) {
      // If there is not items in stock
      if (LaptopSaveInfo.BobbyRayUsedInventory[i].ubQtyOnHand == 0)
        continue;

      usItemIndex = LaptopSaveInfo.BobbyRayUsedInventory[i].usItemIndex;
      gfOnUsedPage = true;
    } else {
      // If there is not items in stock
      if (LaptopSaveInfo.BobbyRayInventory[i].ubQtyOnHand == 0)
        continue;

      usItemIndex = LaptopSaveInfo.BobbyRayInventory[i].usItemIndex;
      gfOnUsedPage = false;
    }

    // skip items that aren't of the right item class
    if (!(Item[usItemIndex].usItemClass & uiItemClass)) {
      continue;
    }

    pItemNumbers[ubCount] = usItemIndex;

    switch (Item[usItemIndex].usItemClass) {
      case IC_GUN:
      case IC_LAUNCHER:
        gusItemNumberForItemsOnScreen[ubCount] = i;

        DisplayBigItemImage(usItemIndex, PosY);

        // Display Items Name
        DisplayItemNameAndInfo(usTextPosY, usItemIndex, i, gfOnUsedPage);

        DisplayGunInfo(usItemIndex, usTextPosY, gfOnUsedPage, i);

        PosY += BOBBYR_GRID_OFFSET;
        usTextPosY += BOBBYR_GRID_OFFSET;
        ubCount++;
        break;

      case IC_AMMO:
        gusItemNumberForItemsOnScreen[ubCount] = i;

        DisplayBigItemImage(usItemIndex, PosY);

        // Display Items Name
        DisplayItemNameAndInfo(usTextPosY, usItemIndex, i, gfOnUsedPage);

        DisplayAmmoInfo(usItemIndex, usTextPosY, gfOnUsedPage, i);

        PosY += BOBBYR_GRID_OFFSET;
        usTextPosY += BOBBYR_GRID_OFFSET;
        ubCount++;
        break;

      case IC_ARMOUR:
        gusItemNumberForItemsOnScreen[ubCount] = i;

        DisplayBigItemImage(usItemIndex, PosY);

        // Display Items Name
        DisplayItemNameAndInfo(usTextPosY, usItemIndex, i, gfOnUsedPage);

        DisplayArmourInfo(usItemIndex, usTextPosY, gfOnUsedPage, i);

        PosY += BOBBYR_GRID_OFFSET;
        usTextPosY += BOBBYR_GRID_OFFSET;
        ubCount++;
        break;

      case IC_BLADE:
      case IC_THROWING_KNIFE:
      case IC_PUNCH:
        gusItemNumberForItemsOnScreen[ubCount] = i;

        DisplayBigItemImage(usItemIndex, PosY);

        // Display Items Name
        DisplayItemNameAndInfo(usTextPosY, usItemIndex, i, gfOnUsedPage);

        DisplayNonGunWeaponInfo(usItemIndex, usTextPosY, gfOnUsedPage, i);

        PosY += BOBBYR_GRID_OFFSET;
        usTextPosY += BOBBYR_GRID_OFFSET;
        ubCount++;
        break;

      case IC_GRENADE:
      case IC_BOMB:
      case IC_MISC:
      case IC_MEDKIT:
      case IC_KIT:
      case IC_FACE:
        gusItemNumberForItemsOnScreen[ubCount] = i;

        DisplayBigItemImage(usItemIndex, PosY);

        // Display Items Name
        DisplayItemNameAndInfo(usTextPosY, usItemIndex, i, gfOnUsedPage);

        DisplayMiscInfo(usItemIndex, usTextPosY, gfOnUsedPage, i);

        PosY += BOBBYR_GRID_OFFSET;
        usTextPosY += BOBBYR_GRID_OFFSET;
        ubCount++;
        break;
    }
  }

  if (gusOldItemNumOnTopOfPage != gusCurWeaponIndex) {
    CreateMouseRegionForBigImage(BOBBYR_GRID_PIC_Y, ubCount, pItemNumbers);

    gusOldItemNumOnTopOfPage = gusCurWeaponIndex;
  }

  // Display the subtotal at the bottom of the screen
  swprintf(sDollarTemp, "%d", CalculateTotalPurchasePrice());
  InsertCommasForDollarFigure(sDollarTemp);
  InsertDollarSignInToString(sDollarTemp);
  swprintf(sTemp, "%s %s", BobbyRText[Enum350.BOBBYR_GUNS_SUB_TOTAL], sDollarTemp);
  DrawTextToScreen(sTemp, BOBBYR_ORDER_SUBTOTAL_X, BOBBYR_ORDER_SUBTOTAL_Y, 0, BOBBYR_ORDER_TITLE_FONT(), BOBBYR_ORDER_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED | TEXT_SHADOWED);

  // Display the Used item disclaimer
  if (gfOnUsedPage) {
    DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_PERCENT_FUNCTIONAL], BOBBYR_PERCENT_FUNTCIONAL_X, BOBBYR_PERCENT_FUNTCIONAL_Y, 0, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ORDER_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED | TEXT_SHADOWED);
  }

  return true;
}

function DisplayGunInfo(usIndex: UINT16, usTextPosY: UINT16, fUsed: boolean, usBobbyIndex: UINT16): boolean {
  let usHeight: UINT16;
  let uiStartLoc: UINT32 = 0;
  let usFontHeight: UINT16;
  usFontHeight = GetFontHeight(BOBBYR_ITEM_DESC_TEXT_FONT());

  // Display Items Name
  // DisplayItemNameAndInfo(usTextPosY, usIndex, fUsed);

  usHeight = usTextPosY;
  // Display the weight, caliber, mag, rng, dam, rof text

  // Weight
  usHeight = DisplayWeight(usHeight, usIndex, usFontHeight);

  // Caliber
  usHeight = DisplayCaliber(usHeight, usIndex, usFontHeight);

  // Magazine
  usHeight = DisplayMagazine(usHeight, usIndex, usFontHeight);

  // Range
  usHeight = DisplayRange(usHeight, usIndex, usFontHeight);

  // Damage
  usHeight = DisplayDamage(usHeight, usIndex, usFontHeight);

  // ROF
  usHeight = DisplayRof(usHeight, usIndex, usFontHeight);

  // Display the Cost and the qty bought and on hand
  usHeight = DisplayCostAndQty(usTextPosY, usIndex, usFontHeight, usBobbyIndex, fUsed);

  return true;
} // DisplayGunInfo

function DisplayNonGunWeaponInfo(usIndex: UINT16, usTextPosY: UINT16, fUsed: boolean, usBobbyIndex: UINT16): boolean {
  let usHeight: UINT16;
  let uiStartLoc: UINT32 = 0;
  let usFontHeight: UINT16;
  usFontHeight = GetFontHeight(BOBBYR_ITEM_DESC_TEXT_FONT());

  // Display Items Name
  //	DisplayItemNameAndInfo(usTextPosY, usIndex, fUsed);

  usHeight = usTextPosY;
  // Display the weight, caliber, mag, rng, dam, rof text

  // Weight
  usHeight = DisplayWeight(usHeight, usIndex, usFontHeight);

  // Damage
  usHeight = DisplayDamage(usHeight, usIndex, usFontHeight);

  // Display the Cost and the qty bought and on hand
  usHeight = DisplayCostAndQty(usTextPosY, usIndex, usFontHeight, usBobbyIndex, fUsed);

  return true;
} // DisplayNonGunWeaponInfo

function DisplayAmmoInfo(usIndex: UINT16, usTextPosY: UINT16, fUsed: boolean, usBobbyIndex: UINT16): boolean {
  let usHeight: UINT16;
  let uiStartLoc: UINT32 = 0;
  let usFontHeight: UINT16;
  usFontHeight = GetFontHeight(BOBBYR_ITEM_DESC_TEXT_FONT());

  // Display Items Name
  //	DisplayItemNameAndInfo(usTextPosY, usIndex, fUsed);

  usHeight = usTextPosY;
  // Display the weight, caliber, mag, rng, dam, rof text

  // Caliber
  usHeight = DisplayCaliber(usHeight, usIndex, usFontHeight);

  // Magazine
  //	usHeight = DisplayMagazine(usHeight, usIndex, usFontHeight);

  // Display the Cost and the qty bought and on hand
  usHeight = DisplayCostAndQty(usTextPosY, usIndex, usFontHeight, usBobbyIndex, fUsed);

  return true;
} // DisplayAmmoInfo

function DisplayBigItemImage(usIndex: UINT16, PosY: UINT16): boolean {
  let PosX: INT16;
  let sCenX: INT16;
  let sCenY: INT16;
  let usHeight: UINT32;
  let usWidth: UINT32;
  let pTrav: Pointer<ETRLEObject>;
  let pItem: Pointer<INVTYPE>;
  let uiImage: UINT32;
  let hPixHandle: HVOBJECT;

  PosX = BOBBYR_GRID_PIC_X;

  pItem = addressof(Item[usIndex]);
  LoadTileGraphicForItem(pItem, addressof(uiImage));

  GetVideoObject(addressof(hPixHandle), uiImage);
  pTrav = addressof(hPixHandle.value.pETRLEObject[0]);

  // center picture in frame
  usHeight = pTrav.value.usHeight;
  usWidth = pTrav.value.usWidth;
  //	sCenX = PosX + ( abs( BOBBYR_GRID_PIC_WIDTH - usWidth ) / 2 );
  //	sCenY = PosY + 8;
  sCenX = PosX + (Math.abs(BOBBYR_GRID_PIC_WIDTH - usWidth) / 2) - pTrav.value.sOffsetX;
  sCenY = PosY + 8;

  // blt the shadow of the item
  BltVideoObjectOutlineShadowFromIndex(FRAME_BUFFER, uiImage, 0, sCenX - 2, sCenY + 2); // pItem->ubGraphicNum

  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, sCenX, sCenY, VO_BLT_SRCTRANSPARENCY, null);
  DeleteVideoObjectFromIndex(uiImage);

  return true;
}

function DisplayArmourInfo(usIndex: UINT16, usTextPosY: UINT16, fUsed: boolean, usBobbyIndex: UINT16): boolean {
  let usHeight: UINT16;
  let uiStartLoc: UINT32 = 0;
  let usFontHeight: UINT16;
  usFontHeight = GetFontHeight(BOBBYR_ITEM_DESC_TEXT_FONT());

  // Display Items Name
  //	DisplayItemNameAndInfo(usTextPosY, usIndex, fUsed);

  usHeight = usTextPosY;
  // Display the weight, caliber, mag, rng, dam, rof text

  // Weight
  usHeight = DisplayWeight(usHeight, usIndex, usFontHeight);

  // Display the Cost and the qty bought and on hand
  usHeight = DisplayCostAndQty(usTextPosY, usIndex, usFontHeight, usBobbyIndex, fUsed);

  return true;
} // DisplayArmourInfo

function DisplayMiscInfo(usIndex: UINT16, usTextPosY: UINT16, fUsed: boolean, usBobbyIndex: UINT16): boolean {
  let usHeight: UINT16;
  let uiStartLoc: UINT32 = 0;
  let usFontHeight: UINT16;
  usFontHeight = GetFontHeight(BOBBYR_ITEM_DESC_TEXT_FONT());

  // Display Items Name
  //	DisplayItemNameAndInfo(usTextPosY, usIndex, fUsed);

  // Display the Cost and the qty bought and on hand
  usHeight = DisplayCostAndQty(usTextPosY, usIndex, usFontHeight, usBobbyIndex, fUsed);

  return true;
} // DisplayMiscInfo

function DisplayCostAndQty(usPosY: UINT16, usIndex: UINT16, usFontHeight: UINT16, usBobbyIndex: UINT16, fUsed: boolean): UINT16 {
  let sTemp: wchar_t[] /* [20] */;
  //	UINT8	ubPurchaseNumber;

  //
  // Display the cost and the qty
  //

  // Display the cost
  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_COST], BOBBYR_ITEM_COST_TEXT_X, usPosY, BOBBYR_ITEM_COST_TEXT_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usPosY += usFontHeight + 2;

  swprintf(sTemp, "%d", CalcBobbyRayCost(usIndex, usBobbyIndex, fUsed));
  InsertCommasForDollarFigure(sTemp);
  InsertDollarSignInToString(sTemp);

  DrawTextToScreen(sTemp, BOBBYR_ITEM_COST_NUM_X, usPosY, BOBBYR_ITEM_COST_TEXT_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  usPosY += usFontHeight + 2;

  /*
          //Display the # bought
          DrawTextToScreen(BobbyRText[BOBBYR_GUNS_QTY_ON_ORDER], BOBBYR_ITEM_QTY_TEXT_X, (UINT16)usPosY, BOBBYR_ITEM_COST_TEXT_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT, BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
          usPosY += usFontHeight + 2;

          ubPurchaseNumber = CheckIfItemIsPurchased(usBobbyIndex);
          if( ubPurchaseNumber == BOBBY_RAY_NOT_PURCHASED)
                  swprintf(sTemp, L"% 4d", 0);
          else
                  swprintf(sTemp, L"% 4d", BobbyRayPurchases[ ubPurchaseNumber ].ubNumberPurchased);

          DrawTextToScreen(sTemp, BOBBYR_ITEMS_BOUGHT_X, (UINT16)usPosY, BOBBYR_ITEM_COST_TEXT_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT, BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  */

  // Display Weight Number
  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_WGHT], BOBBYR_ITEM_STOCK_TEXT_X, (usPosY), BOBBYR_ITEM_COST_TEXT_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usPosY += usFontHeight + 2;

  swprintf(sTemp, "%3.2f", GetWeightBasedOnMetricOption(Item[usIndex].ubWeight) / (10.0));
  DrawTextToScreen(sTemp, BOBBYR_ITEM_STOCK_TEXT_X, (usPosY), BOBBYR_ITEM_COST_TEXT_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  usPosY += usFontHeight + 2;

  // Display the # In Stock
  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_IN_STOCK], BOBBYR_ITEM_STOCK_TEXT_X, usPosY, BOBBYR_ITEM_COST_TEXT_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usPosY += usFontHeight + 2;

  if (fUsed)
    swprintf(sTemp, "% 4d", LaptopSaveInfo.BobbyRayUsedInventory[usBobbyIndex].ubQtyOnHand);
  else
    swprintf(sTemp, "% 4d", LaptopSaveInfo.BobbyRayInventory[usBobbyIndex].ubQtyOnHand);

  DrawTextToScreen(sTemp, BOBBYR_ITEM_STOCK_TEXT_X, usPosY, BOBBYR_ITEM_COST_TEXT_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  usPosY += usFontHeight + 2;

  return usPosY;
}

function DisplayRof(usPosY: UINT16, usIndex: UINT16, usFontHeight: UINT16): UINT16 {
  let sTemp: wchar_t[] /* [20] */;

  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_ROF], BOBBYR_ITEM_WEIGHT_TEXT_X, usPosY, 0, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  if (WeaponROF[usIndex] == -1)
    swprintf(sTemp, "? %s", pMessageStrings[Enum333.MSG_RPM]);
  else
    swprintf(sTemp, "%3d/%s", WeaponROF[usIndex], pMessageStrings[Enum333.MSG_MINUTE_ABBREVIATION]);

  DrawTextToScreen(sTemp, BOBBYR_ITEM_WEIGHT_NUM_X, usPosY, BOBBYR_ITEM_WEIGHT_NUM_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  usPosY += usFontHeight + 2;
  return usPosY;
}

function DisplayDamage(usPosY: UINT16, usIndex: UINT16, usFontHeight: UINT16): UINT16 {
  let sTemp: wchar_t[] /* [20] */;

  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_DAMAGE], BOBBYR_ITEM_WEIGHT_TEXT_X, usPosY, 0, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  swprintf(sTemp, "%4d", Weapon[usIndex].ubImpact);
  DrawTextToScreen(sTemp, BOBBYR_ITEM_WEIGHT_NUM_X, usPosY, BOBBYR_ITEM_WEIGHT_NUM_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  usPosY += usFontHeight + 2;
  return usPosY;
}

function DisplayRange(usPosY: UINT16, usIndex: UINT16, usFontHeight: UINT16): UINT16 {
  let sTemp: wchar_t[] /* [20] */;

  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_RANGE], BOBBYR_ITEM_WEIGHT_TEXT_X, usPosY, 0, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  swprintf(sTemp, "%3d %s", Weapon[usIndex].usRange, pMessageStrings[Enum333.MSG_METER_ABBREVIATION]);
  DrawTextToScreen(sTemp, BOBBYR_ITEM_WEIGHT_NUM_X, usPosY, BOBBYR_ITEM_WEIGHT_NUM_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  usPosY += usFontHeight + 2;
  return usPosY;
}

function DisplayMagazine(usPosY: UINT16, usIndex: UINT16, usFontHeight: UINT16): UINT16 {
  let sTemp: wchar_t[] /* [20] */;

  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_MAGAZINE], BOBBYR_ITEM_WEIGHT_TEXT_X, usPosY, 0, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  swprintf(sTemp, "%3d %s", Weapon[usIndex].ubMagSize, pMessageStrings[Enum333.MSG_ROUNDS_ABBREVIATION]);
  DrawTextToScreen(sTemp, BOBBYR_ITEM_WEIGHT_NUM_X, usPosY, BOBBYR_ITEM_WEIGHT_NUM_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  usPosY += usFontHeight + 2;
  return usPosY;
}

function DisplayCaliber(usPosY: UINT16, usIndex: UINT16, usFontHeight: UINT16): UINT16 {
  let zTemp: CHAR16[] /* [128] */;
  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_CALIBRE], BOBBYR_ITEM_WEIGHT_TEXT_X, usPosY, 0, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  //	if ammo is begin drawn
  if (Item[usIndex].usItemClass == IC_AMMO) {
    swprintf(zTemp, "%s", BobbyRayAmmoCaliber[Magazine[Item[usIndex].ubClassIndex].ubCalibre]);
    //		DrawTextToScreen( AmmoCaliber[ Magazine[ Item[ usIndex ].ubClassIndex ].ubCalibre], BOBBYR_ITEM_WEIGHT_NUM_X, (UINT16)usPosY, BOBBYR_ITEM_WEIGHT_NUM_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT, BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  } else {
    // else a gun is being displayed
    swprintf(zTemp, "%s", BobbyRayAmmoCaliber[Weapon[Item[usIndex].ubClassIndex].ubCalibre]);
    //		DrawTextToScreen( AmmoCaliber[ Weapon[ Item[ usIndex ].ubClassIndex ].ubCalibre ], BOBBYR_ITEM_WEIGHT_NUM_X, (UINT16)usPosY, BOBBYR_ITEM_WEIGHT_NUM_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT, BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
  }

  if (StringPixLength(zTemp, BOBBYR_ITEM_DESC_TEXT_FONT()) > BOBBYR_ITEM_WEIGHT_NUM_WIDTH)
    ReduceStringLength(zTemp, BOBBYR_GRID_PIC_WIDTH, BOBBYR_ITEM_NAME_TEXT_FONT());

  DrawTextToScreen(zTemp, BOBBYR_ITEM_WEIGHT_NUM_X, usPosY, BOBBYR_ITEM_WEIGHT_NUM_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  usPosY += usFontHeight + 2;
  return usPosY;
}

function DisplayWeight(usPosY: UINT16, usIndex: UINT16, usFontHeight: UINT16): UINT16 {
  let sTemp: wchar_t[] /* [20] */;

  // display the 'weight' string
  DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_WEIGHT], BOBBYR_ITEM_WEIGHT_TEXT_X, usPosY, 0, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  swprintf(sTemp, "%3.2f %s", GetWeightBasedOnMetricOption(Item[usIndex].ubWeight) / 10, GetWeightUnitString());
  DrawTextToScreen(sTemp, BOBBYR_ITEM_WEIGHT_NUM_X, usPosY, BOBBYR_ITEM_WEIGHT_NUM_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  usPosY += usFontHeight + 2;
  return usPosY;
}

function DisplayItemNameAndInfo(usPosY: UINT16, usIndex: UINT16, usBobbyIndex: UINT16, fUsed: boolean): void {
  let sText: wchar_t[] /* [400] */;
  let sTemp: wchar_t[] /* [20] */;
  let uiStartLoc: UINT32 = 0;

  let ubPurchaseNumber: UINT8;
  let usFontHeight: UINT16 = GetFontHeight(BOBBYR_ITEM_DESC_TEXT_FONT());

  // Display Items Name
  uiStartLoc = BOBBYR_ITEM_DESC_FILE_SIZE * usIndex;
  LoadEncryptedDataFromFile(BOBBYRDESCFILE, sText, uiStartLoc, BOBBYR_ITEM_DESC_NAME_SIZE);

  if (StringPixLength(sText, BOBBYR_ITEM_NAME_TEXT_FONT()) > (BOBBYR_GRID_PIC_WIDTH - 6))
    ReduceStringLength(sText, BOBBYR_GRID_PIC_WIDTH - 6, BOBBYR_ITEM_NAME_TEXT_FONT());

  DrawTextToScreen(sText, BOBBYR_ITEM_NAME_X, (usPosY + BOBBYR_ITEM_NAME_Y_OFFSET), 0, BOBBYR_ITEM_NAME_TEXT_FONT(), BOBBYR_ITEM_NAME_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // number bought
  // Display the # bought
  ubPurchaseNumber = CheckIfItemIsPurchased(usBobbyIndex);
  if (ubPurchaseNumber != BOBBY_RAY_NOT_PURCHASED) {
    DrawTextToScreen(BobbyRText[Enum350.BOBBYR_GUNS_QTY_ON_ORDER], BOBBYR_ITEM_QTY_TEXT_X, usPosY, BOBBYR_ITEM_QTY_WIDTH, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

    if (ubPurchaseNumber != BOBBY_RAY_NOT_PURCHASED) {
      swprintf(sTemp, "% 4d", BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased);
      DrawTextToScreen(sTemp, BOBBYR_ITEMS_BOUGHT_X, usPosY, 0, FONT14ARIAL(), BOBBYR_ITEM_DESC_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    }
  }

  // if it's a used item, display how damaged the item is
  if (fUsed) {
    swprintf(sTemp, "*%3d%%%%", LaptopSaveInfo.BobbyRayUsedInventory[usBobbyIndex].ubItemQuality);
    DrawTextToScreen(sTemp, (BOBBYR_ITEM_NAME_X - 2), (usPosY - BOBBYR_ORDER_NUM_Y_OFFSET), BOBBYR_ORDER_NUM_WIDTH, BOBBYR_ITEM_NAME_TEXT_FONT(), BOBBYR_ITEM_NAME_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }

  // Display Items description
  uiStartLoc = (BOBBYR_ITEM_DESC_FILE_SIZE * usIndex) + BOBBYR_ITEM_DESC_NAME_SIZE;
  LoadEncryptedDataFromFile(BOBBYRDESCFILE, sText, uiStartLoc, BOBBYR_ITEM_DESC_INFO_SIZE);
  DisplayWrappedString(BOBBYR_ITEM_DESC_START_X, usPosY, BOBBYR_ITEM_DESC_START_WIDTH, 2, BOBBYR_ITEM_DESC_TEXT_FONT(), BOBBYR_ITEM_DESC_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
}

/*
void InitFirstAndLastGlobalIndex(UINT32 uiItemClass)
{
        switch(uiItemClass)
        {
                case IC_BOBBY_GUN:
                        gusLastItemIndex = gusLastGunIndex ;
                        gusFirstItemIndex = gusFirstGunIndex;
                        gubNumPages = gubNumGunPages;
                        break;
                case IC_BOBBY_MISC:
                        gusLastItemIndex = gusLastMiscIndex ;
                        gusFirstItemIndex = gusFirstMiscIndex;
                        gubNumPages = gubNumMiscPages;
                        break;
                case IC_AMMO:
                        gusLastItemIndex = gusLastAmmoIndex ;
                        gusFirstItemIndex = gusFirstAmmoIndex;
                        gubNumPages = gubNumAmmoPages;
                        break;
                case IC_ARMOUR:
                        gusLastItemIndex = gusLastArmourIndex;
                        gusFirstItemIndex = gusFirstArmourIndex;
                        gubNumPages = gubNumArmourPages;
                        break;
                case BOBBYR_USED_ITEMS:
                        gusLastItemIndex = gusLastUsedIndex;
                        gusFirstItemIndex = gusFirstUsedIndex;
                        gubNumPages = gubNumUsedPages;
                        break;
                default:
                        Assert(0);
                        break;
        }
}

void CalculateFirstAndLastIndexs()
{
        //Get the first and last gun index
        SetFirstLastPagesForNew( IC_BOBBY_GUN, &gusFirstGunIndex, &gusLastGunIndex, &gubNumGunPages );

        //Get the first and last misc index
        SetFirstLastPagesForNew( IC_BOBBY_MISC, &gusFirstMiscIndex, &gusLastMiscIndex, &gubNumMiscPages );

        //Get the first and last Ammo index
        SetFirstLastPagesForNew( IC_AMMO, &gusFirstAmmoIndex, &gusLastAmmoIndex, &gubNumAmmoPages );

        //Get the first and last Armour index
        SetFirstLastPagesForNew( IC_ARMOUR, &gusFirstArmourIndex, &gusLastArmourIndex, &gubNumArmourPages );

        //Get the first and last Used index
        SetFirstLastPagesForUsed( &gusFirstUsedIndex, &gusLastUsedIndex, &gubNumUsedPages );
}
*/

// Loops through Bobby Rays Inventory to find the first and last index
function SetFirstLastPagesForNew(uiClassMask: UINT32): void {
  let i: UINT16;
  let sFirst: INT16 = -1;
  let sLast: INT16 = -1;
  let ubPages: UINT8 = 0;
  let ubNumItems: UINT8 = 0;

  gubCurPage = 0;

  // First loop through to get the first and last index indexs
  for (i = 0; i < Enum225.MAXITEMS; i++) {
    // If we have some of the inventory on hand
    if (LaptopSaveInfo.BobbyRayInventory[i].ubQtyOnHand != 0) {
      if (Item[LaptopSaveInfo.BobbyRayInventory[i].usItemIndex].usItemClass & uiClassMask) {
        ubNumItems++;

        if (sFirst == -1)
          sFirst = i;
        sLast = i;
      }
    }
  }

  if (ubNumItems == 0) {
    gusFirstItemIndex = BOBBYR_NO_ITEMS;
    gusLastItemIndex = BOBBYR_NO_ITEMS;
    gubNumPages = 0;
    return;
  }

  gusFirstItemIndex = sFirst;
  gusLastItemIndex = sLast;
  gubNumPages = (ubNumItems / BOBBYR_NUM_WEAPONS_ON_PAGE);
  if ((ubNumItems % BOBBYR_NUM_WEAPONS_ON_PAGE) != 0)
    gubNumPages += 1;
}

// Loops through Bobby Rays Used Inventory to find the first and last index
function SetFirstLastPagesForUsed(): void {
  let i: UINT16;
  let sFirst: INT16 = -1;
  let sLast: INT16 = -1;
  let ubPages: UINT8 = 0;
  let ubNumItems: UINT8 = 0;

  gubCurPage = 0;

  // First loop through to get the first and last index indexs
  for (i = 0; i < Enum225.MAXITEMS; i++) {
    // If we have some of the inventory on hand
    if (LaptopSaveInfo.BobbyRayUsedInventory[i].ubQtyOnHand != 0) {
      ubNumItems++;

      if (sFirst == -1)
        sFirst = i;
      sLast = i;
    }
  }
  if (sFirst == -1) {
    gusFirstItemIndex = BOBBYR_NO_ITEMS;
    gusLastItemIndex = BOBBYR_NO_ITEMS;
    gubNumPages = 0;
    return;
  }

  gusFirstItemIndex = sFirst;
  gusLastItemIndex = sLast;
  gubNumPages = (ubNumItems / BOBBYR_NUM_WEAPONS_ON_PAGE);
  if ((ubNumItems % BOBBYR_NUM_WEAPONS_ON_PAGE) != 0)
    gubNumPages += 1;
}

function CreateMouseRegionForBigImage(usPosY: UINT16, ubCount: UINT8, pItemNumbers: Pointer<INT16>): void {
  let i: UINT8;
  let zItemName: CHAR16[] /* [SIZE_ITEM_NAME] */;
  let ubItemCount: UINT8 = 0;

  if (gfBigImageMouseRegionCreated)
    return;

  for (i = 0; i < ubCount; i++) {
    // Mouse region for the Big Item Image
    MSYS_DefineRegion(addressof(gSelectedBigImageRegion[i]), BOBBYR_GRID_PIC_X, usPosY, (BOBBYR_GRID_PIC_X + BOBBYR_GRID_PIC_WIDTH), (usPosY + BOBBYR_GRID_PIC_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectBigImageRegionCallBack);
    MSYS_AddRegion(addressof(gSelectedBigImageRegion[i]));
    MSYS_SetRegionUserData(addressof(gSelectedBigImageRegion[i]), 0, i);

    // specify the help text only if the items is ammo
    if (Item[pItemNumbers[i]].usItemClass == IC_AMMO) {
      // and only if the user has an item that can use the particular type of ammo
      ubItemCount = CheckPlayersInventoryForGunMatchingGivenAmmoID(pItemNumbers[i]);
      if (ubItemCount != 0) {
        swprintf(zItemName, "%s %d %s", BobbyRText[Enum350.BOBBYR_GUNS_NUM_GUNS_THAT_USE_AMMO_1], ubItemCount, BobbyRText[Enum350.BOBBYR_GUNS_NUM_GUNS_THAT_USE_AMMO_2]);
      } else
        zItemName[0] = '\0';
    } else
      zItemName[0] = '\0';

    SetRegionFastHelpText(addressof(gSelectedBigImageRegion[i]), zItemName);
    SetRegionHelpEndCallback(addressof(gSelectedBigImageRegion[i]), BobbyrRGunsHelpTextDoneCallBack);

    usPosY += BOBBYR_GRID_OFFSET;
  }

  gubNumItemsOnScreen = ubCount;
  gfBigImageMouseRegionCreated = true;
}

function DeleteMouseRegionForBigImage(): void {
  let i: UINT8;

  if (!gfBigImageMouseRegionCreated)
    return;

  for (i = 0; i < gubNumItemsOnScreen; i++)
    MSYS_RemoveRegion(addressof(gSelectedBigImageRegion[i]));

  gfBigImageMouseRegionCreated = false;
  gusOldItemNumOnTopOfPage = 65535;
  gubNumItemsOnScreen = 0;
}

function SelectBigImageRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let usItemNum: UINT16 = MSYS_GetRegionUserData(pRegion, 0);

    PurchaseBobbyRayItem(gusItemNumberForItemsOnScreen[usItemNum]);

    fReDrawScreenFlag = true;
    fPausedReDrawScreenFlag = true;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    let usItemNum: UINT16 = MSYS_GetRegionUserData(pRegion, 0);

    UnPurchaseBobbyRayItem(gusItemNumberForItemsOnScreen[usItemNum]);
    fReDrawScreenFlag = true;
    fPausedReDrawScreenFlag = true;
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_REPEAT) {
    let usItemNum: UINT16 = MSYS_GetRegionUserData(pRegion, 0);

    PurchaseBobbyRayItem(gusItemNumberForItemsOnScreen[usItemNum]);
    fReDrawScreenFlag = true;
    fPausedReDrawScreenFlag = true;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_REPEAT) {
    let usItemNum: UINT16 = MSYS_GetRegionUserData(pRegion, 0);

    UnPurchaseBobbyRayItem(gusItemNumberForItemsOnScreen[usItemNum]);
    fReDrawScreenFlag = true;
    fPausedReDrawScreenFlag = true;
  }
}

function PurchaseBobbyRayItem(usItemNumber: UINT16): void {
  let ubPurchaseNumber: UINT8;

  ubPurchaseNumber = CheckIfItemIsPurchased(usItemNumber);

  // if we are in the used page
  if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_BOBBY_R_USED) {
    // if there is enough inventory in stock to cover the purchase
    if (ubPurchaseNumber == BOBBY_RAY_NOT_PURCHASED || LaptopSaveInfo.BobbyRayUsedInventory[usItemNumber].ubQtyOnHand >= (BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased + 1)) {
      // If the item has not yet been purchased
      if (ubPurchaseNumber == BOBBY_RAY_NOT_PURCHASED) {
        ubPurchaseNumber = GetNextPurchaseNumber();

        if (ubPurchaseNumber != BOBBY_RAY_NOT_PURCHASED) {
          BobbyRayPurchases[ubPurchaseNumber].usItemIndex = LaptopSaveInfo.BobbyRayUsedInventory[usItemNumber].usItemIndex;
          BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased = 1;
          BobbyRayPurchases[ubPurchaseNumber].bItemQuality = LaptopSaveInfo.BobbyRayUsedInventory[usItemNumber].ubItemQuality;
          BobbyRayPurchases[ubPurchaseNumber].usBobbyItemIndex = usItemNumber;
          BobbyRayPurchases[ubPurchaseNumber].fUsed = true;
        } else {
          // display error popup because the player is trying to purchase more thenn 10 items
          DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, BobbyRText[Enum350.BOBBYR_MORE_THEN_10_PURCHASES], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, null);
        }
      }
      // Else If the item is already purchased increment purchase amount.  Only if ordering less then the max amount!
      else {
        if (BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased <= BOBBY_RAY_MAX_AMOUNT_OF_ITEMS_TO_PURCHASE)
          BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased++;
      }
    } else {
      DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, BobbyRText[Enum350.BOBBYR_MORE_NO_MORE_IN_STOCK], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, null);
    }
  }
  // else the player is on a any other page except the used page
  else {
    // if there is enough inventory in stock to cover the purchase
    if (ubPurchaseNumber == BOBBY_RAY_NOT_PURCHASED || LaptopSaveInfo.BobbyRayInventory[usItemNumber].ubQtyOnHand >= (BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased + 1)) {
      // If the item has not yet been purchased
      if (ubPurchaseNumber == BOBBY_RAY_NOT_PURCHASED) {
        ubPurchaseNumber = GetNextPurchaseNumber();

        if (ubPurchaseNumber != BOBBY_RAY_NOT_PURCHASED) {
          BobbyRayPurchases[ubPurchaseNumber].usItemIndex = LaptopSaveInfo.BobbyRayInventory[usItemNumber].usItemIndex;
          BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased = 1;
          BobbyRayPurchases[ubPurchaseNumber].bItemQuality = 100;
          BobbyRayPurchases[ubPurchaseNumber].usBobbyItemIndex = usItemNumber;
          BobbyRayPurchases[ubPurchaseNumber].fUsed = false;
        } else {
          // display error popup because the player is trying to purchase more thenn 10 items
          DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, BobbyRText[Enum350.BOBBYR_MORE_THEN_10_PURCHASES], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, null);
        }
      }
      // Else If the item is already purchased increment purchase amount.  Only if ordering less then the max amount!
      else {
        if (BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased <= BOBBY_RAY_MAX_AMOUNT_OF_ITEMS_TO_PURCHASE)
          BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased++;
      }
    } else {
      DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, BobbyRText[Enum350.BOBBYR_MORE_NO_MORE_IN_STOCK], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, null);
    }
  }
}

// Checks to see if the clicked item is already bought or not.
function CheckIfItemIsPurchased(usItemNumber: UINT16): UINT8 {
  let i: UINT8;

  for (i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    if ((usItemNumber == BobbyRayPurchases[i].usBobbyItemIndex) && (BobbyRayPurchases[i].ubNumberPurchased != 0) && (BobbyRayPurchases[i].fUsed == gfOnUsedPage))
      return i;
  }
  return BOBBY_RAY_NOT_PURCHASED;
}

function GetNextPurchaseNumber(): UINT8 {
  let i: UINT8;

  for (i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    if ((BobbyRayPurchases[i].usBobbyItemIndex == 0) && (BobbyRayPurchases[i].ubNumberPurchased == 0))
      return i;
  }
  return BOBBY_RAY_NOT_PURCHASED;
}

function UnPurchaseBobbyRayItem(usItemNumber: UINT16): void {
  let ubPurchaseNumber: UINT8;

  ubPurchaseNumber = CheckIfItemIsPurchased(usItemNumber);

  if (ubPurchaseNumber != BOBBY_RAY_NOT_PURCHASED) {
    if (BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased > 1)
      BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased--;
    else {
      BobbyRayPurchases[ubPurchaseNumber].ubNumberPurchased = 0;
      BobbyRayPurchases[ubPurchaseNumber].usBobbyItemIndex = 0;
    }
  }
}

function BtnBobbyROrderFormCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_BOBBY_R_MAILORDER;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnBobbyRHomeButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
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

function UpdateButtonText(uiCurPage: UINT32): void {
  switch (uiCurPage) {
    case Enum95.LAPTOP_MODE_BOBBY_R_GUNS:
      DisableButton(guiBobbyRPageMenu[0]);
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R_AMMO:
      DisableButton(guiBobbyRPageMenu[1]);
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R_ARMOR:
      DisableButton(guiBobbyRPageMenu[2]);
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R_MISC:
      DisableButton(guiBobbyRPageMenu[3]);
      break;

    case Enum95.LAPTOP_MODE_BOBBY_R_USED:
      DisableButton(guiBobbyRPageMenu[4]);
      break;
  }
}

function CalcBobbyRayCost(usIndex: UINT16, usBobbyIndex: UINT16, fUsed: boolean): UINT16 {
  let value: DOUBLE;
  if (fUsed)
    value = Item[LaptopSaveInfo.BobbyRayUsedInventory[usBobbyIndex].usItemIndex].usPrice * (.5 + .5 * (LaptopSaveInfo.BobbyRayUsedInventory[usBobbyIndex].ubItemQuality) / 100) + .5;
  else
    value = Item[LaptopSaveInfo.BobbyRayInventory[usBobbyIndex].usItemIndex].usPrice;

  return value;
}

function CalculateTotalPurchasePrice(): UINT32 {
  let i: UINT16;
  let uiTotal: UINT32 = 0;

  for (i = 0; i < MAX_PURCHASE_AMOUNT; i++) {
    // if the item was purchased
    if (BobbyRayPurchases[i].ubNumberPurchased) {
      uiTotal += CalcBobbyRayCost(BobbyRayPurchases[i].usItemIndex, BobbyRayPurchases[i].usBobbyItemIndex, BobbyRayPurchases[i].fUsed) * BobbyRayPurchases[i].ubNumberPurchased;
    }
  }

  return uiTotal;
}

function DisableBobbyRButtons(): void {
  // if it is the last page, disable the next page button
  if (gubNumPages == 0)
    DisableButton(guiBobbyRNextPage);
  else {
    if (gubCurPage >= gubNumPages - 1)
      DisableButton(guiBobbyRNextPage);
    else
      EnableButton(guiBobbyRNextPage);
  }

  // if it is the first page, disable the prev page buitton
  if (gubCurPage == 0)
    DisableButton(guiBobbyRPreviousPage);
  else
    EnableButton(guiBobbyRPreviousPage);

  /*
          //if it is the last page, disable the next page button
          if( !(gusCurWeaponIndex < (gusLastItemIndex - BOBBYR_NUM_WEAPONS_ON_PAGE) ) )
                  DisableButton( guiBobbyRNextPage );
          else
                  EnableButton( guiBobbyRNextPage );


          // if it is the first page, disable the prev page buitton
          if( (gusCurWeaponIndex == gusFirstItemIndex ) )
                  DisableButton( guiBobbyRPreviousPage );
          else
                  EnableButton( guiBobbyRPreviousPage );
  */
}

function CalcFirstIndexForPage(pInv: Pointer<STORE_INVENTORY>, uiItemClass: UINT32): void {
  let i: UINT16;
  let usNumItems: UINT16 = 0;

  // Reset the Current weapon Index
  gusCurWeaponIndex = 0;

  if (uiItemClass == BOBBYR_USED_ITEMS) {
    // Get to the first index on the page
    for (i = gusFirstItemIndex; i <= gusLastItemIndex; i++) {
      // If we have some of the inventory on hand
      if (pInv[i].ubQtyOnHand != 0) {
        if (gubCurPage == 0) {
          gusCurWeaponIndex = i;
          break;
        }

        if (usNumItems <= (gubCurPage * 4))
          gusCurWeaponIndex = i;

        usNumItems++;
      }
    }
  } else {
    // Get to the first index on the page
    for (i = gusFirstItemIndex; i <= gusLastItemIndex; i++) {
      if (Item[pInv[i].usItemIndex].usItemClass & uiItemClass) {
        // If we have some of the inventory on hand
        if (pInv[i].ubQtyOnHand != 0) {
          if (gubCurPage == 0) {
            gusCurWeaponIndex = i;
            break;
          }

          if (usNumItems <= (gubCurPage * 4))
            gusCurWeaponIndex = i;

          usNumItems++;
        }
      }
    }
  }
}

function OutOfStockMessageBoxCallBack(bExitValue: UINT8): void {
  // yes, load the game
  if (bExitValue == MSG_BOX_RETURN_OK) {
    //		guiCurrentLaptopMode  = LAPTOP_MODE_BOBBY_R;
  }
}

function CheckPlayersInventoryForGunMatchingGivenAmmoID(sItemID: INT16): UINT8 {
  let ubItemCount: UINT8 = 0;
  let ubMercCount: UINT8;
  let ubPocketCount: UINT8;

  let ubFirstID: UINT8 = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  let ubLastID: UINT8 = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // loop through all the mercs on the team
  for (ubMercCount = ubFirstID; ubMercCount <= ubLastID; ubMercCount++) {
    if (Menptr[ubMercCount].bActive) {
      // loop through all the pockets on the merc
      for (ubPocketCount = 0; ubPocketCount < Enum261.NUM_INV_SLOTS; ubPocketCount++) {
        // if there is a weapon here
        if (Item[Menptr[ubMercCount].inv[ubPocketCount].usItem].usItemClass == IC_GUN) {
          // if the weapon uses the same kind of ammo as the one passed in, return true
          if (Weapon[Menptr[ubMercCount].inv[ubPocketCount].usItem].ubCalibre == Magazine[Item[sItemID].ubClassIndex].ubCalibre) {
            ubItemCount++;
          }
        }
      }
    }
  }

  return ubItemCount;
}

function BobbyrRGunsHelpTextDoneCallBack(): void {
  fReDrawScreenFlag = true;
  fPausedReDrawScreenFlag = true;
}
