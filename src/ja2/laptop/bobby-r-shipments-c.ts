const BOBBYR_SHIPMENT_TITLE_TEXT_FONT = () => FONT14ARIAL();
const BOBBYR_SHIPMENT_TITLE_TEXT_COLOR = 157;

const BOBBYR_SHIPMENT_STATIC_TEXT_FONT = () => FONT12ARIAL();
const BOBBYR_SHIPMENT_STATIC_TEXT_COLOR = 145;

const BOBBYR_BOBBY_RAY_TITLE_X = LAPTOP_SCREEN_UL_X + 171;
const BOBBYR_BOBBY_RAY_TITLE_Y = LAPTOP_SCREEN_WEB_UL_Y + 3;

const BOBBYR_ORDER_FORM_TITLE_X = BOBBYR_BOBBY_RAY_TITLE_X;
const BOBBYR_ORDER_FORM_TITLE_Y = BOBBYR_BOBBY_RAY_TITLE_Y + 37;
const BOBBYR_ORDER_FORM_TITLE_WIDTH = 159;

const BOBBYR_SHIPMENT_DELIVERY_GRID_X = LAPTOP_SCREEN_UL_X + 2;
const BOBBYR_SHIPMENT_DELIVERY_GRID_Y = BOBBYR_SHIPMENT_ORDER_GRID_Y;
const BOBBYR_SHIPMENT_DELIVERY_GRID_WIDTH = 183;

const BOBBYR_SHIPMENT_ORDER_GRID_X = LAPTOP_SCREEN_UL_X + 223;
const BOBBYR_SHIPMENT_ORDER_GRID_Y = LAPTOP_SCREEN_WEB_UL_Y + 62;

const BOBBYR_SHIPMENT_BACK_BUTTON_X = 130;
const BOBBYR_SHIPMENT_BACK_BUTTON_Y = 400 + LAPTOP_SCREEN_WEB_DELTA_Y + 4;

const BOBBYR_SHIPMENT_HOME_BUTTON_X = 515;
const BOBBYR_SHIPMENT_HOME_BUTTON_Y = BOBBYR_SHIPMENT_BACK_BUTTON_Y;

const BOBBYR_SHIPMENT_NUM_PREVIOUS_SHIPMENTS = 13;

const BOBBYR_SHIPMENT_ORDER_NUM_X = 116; // LAPTOP_SCREEN_UL_X + 9
const BOBBYR_SHIPMENT_ORDER_NUM_START_Y = 144;
const BOBBYR_SHIPMENT_ORDER_NUM_WIDTH = 64;

const BOBBYR_SHIPMENT_GAP_BTN_LINES = 20;

const BOBBYR_SHIPMENT_SHIPMENT_ORDER_NUM_X = BOBBYR_SHIPMENT_ORDER_NUM_X;
const BOBBYR_SHIPMENT_SHIPMENT_ORDER_NUM_Y = 117;

const BOBBYR_SHIPMENT_NUM_ITEMS_X = 183; // BOBBYR_SHIPMENT_ORDER_NUM_X+BOBBYR_SHIPMENT_ORDER_NUM_WIDTH+2
const BOBBYR_SHIPMENT_NUM_ITEMS_Y = BOBBYR_SHIPMENT_SHIPMENT_ORDER_NUM_Y;
const BOBBYR_SHIPMENT_NUM_ITEMS_WIDTH = 116;

//#define		BOBBYR_SHIPMENT_

UINT32 guiBobbyRShipmentGrid;

BOOLEAN gfBobbyRShipmentsDirty = FALSE;

INT32 giBobbyRShipmentSelectedShipment = -1;

UINT32 guiBobbyRShipmetBack;
INT32 guiBobbyRShipmentBackImage;

UINT32 guiBobbyRShipmentHome;
INT32 giBobbyRShipmentHomeImage;

MOUSE_REGION gSelectedPreviousShipmentsRegion[BOBBYR_SHIPMENT_NUM_PREVIOUS_SHIPMENTS];

//
// Function Prototypes
//

// ppp

//
// Function
//

function GameInitBobbyRShipments(): void {
}

function EnterBobbyRShipments(): BOOLEAN {
  VOBJECT_DESC VObjectDesc;

  InitBobbyRWoodBackground();

  // load the Order Grid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BobbyRay_OnOrder.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiBobbyRShipmentGrid));

  guiBobbyRShipmentBackImage = LoadButtonImage("LAPTOP\\CatalogueButton.sti", -1, 0, -1, 1, -1);
  guiBobbyRShipmetBack = CreateIconAndTextButton(guiBobbyRShipmentBackImage, BobbyROrderFormText[BOBBYR_BACK], BOBBYR_GUNS_BUTTON_FONT, BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_SHIPMENT_BACK_BUTTON_X, BOBBYR_SHIPMENT_BACK_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnBobbyRShipmentBackCallback);
  SetButtonCursor(guiBobbyRShipmetBack, CURSOR_LAPTOP_SCREEN);

  giBobbyRShipmentHomeImage = UseLoadedButtonImage(guiBobbyRShipmentBackImage, -1, 0, -1, 1, -1);
  guiBobbyRShipmentHome = CreateIconAndTextButton(giBobbyRShipmentHomeImage, BobbyROrderFormText[BOBBYR_HOME], BOBBYR_GUNS_BUTTON_FONT, BOBBYR_GUNS_TEXT_COLOR_ON, BOBBYR_GUNS_SHADOW_COLOR, BOBBYR_GUNS_TEXT_COLOR_OFF, BOBBYR_GUNS_SHADOW_COLOR, TEXT_CJUSTIFIED, BOBBYR_SHIPMENT_HOME_BUTTON_X, BOBBYR_SHIPMENT_HOME_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnBobbyRShipmentHomeCallback);
  SetButtonCursor(guiBobbyRShipmentHome, CURSOR_LAPTOP_SCREEN);

  CreateBobbyRayOrderTitle();

  giBobbyRShipmentSelectedShipment = -1;

  // if there are shipments
  if (giNumberOfNewBobbyRShipment != 0) {
    INT32 iCnt;

    // get the first shipment #
    for (iCnt = 0; iCnt < giNumberOfNewBobbyRShipment; iCnt++) {
      if (gpNewBobbyrShipments[iCnt].fActive)
        giBobbyRShipmentSelectedShipment = iCnt;
    }
  }

  CreatePreviousShipmentsMouseRegions();

  return TRUE;
}

function ExitBobbyRShipments(): void {
  DeleteBobbyRWoodBackground();
  DestroyBobbyROrderTitle();

  DeleteVideoObjectFromIndex(guiBobbyRShipmentGrid);

  UnloadButtonImage(guiBobbyRShipmentBackImage);
  UnloadButtonImage(giBobbyRShipmentHomeImage);
  RemoveButton(guiBobbyRShipmetBack);
  RemoveButton(guiBobbyRShipmentHome);

  RemovePreviousShipmentsMouseRegions();
}

function HandleBobbyRShipments(): void {
  if (gfBobbyRShipmentsDirty) {
    gfBobbyRShipmentsDirty = FALSE;

    RenderBobbyRShipments();
  }
}

function RenderBobbyRShipments(): void {
  //  HVOBJECT hPixHandle;

  DrawBobbyRWoodBackground();

  DrawBobbyROrderTitle();

  // Output the title
  DrawTextToScreen(gzBobbyRShipmentText[BOBBYR_SHIPMENT__TITLE], BOBBYR_ORDER_FORM_TITLE_X, BOBBYR_ORDER_FORM_TITLE_Y, BOBBYR_ORDER_FORM_TITLE_WIDTH, BOBBYR_SHIPMENT_TITLE_TEXT_FONT, BOBBYR_SHIPMENT_TITLE_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  DisplayShipmentGrid();

  if (giBobbyRShipmentSelectedShipment != -1 && gpNewBobbyrShipments[giBobbyRShipmentSelectedShipment].fActive && gpNewBobbyrShipments[giBobbyRShipmentSelectedShipment].fDisplayedInShipmentPage) {
    //		DisplayPurchasedItems( FALSE, BOBBYR_SHIPMENT_ORDER_GRID_X, BOBBYR_SHIPMENT_ORDER_GRID_Y, &LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[giBobbyRShipmentSelectedShipment].BobbyRayPurchase[0], FALSE );
    DisplayPurchasedItems(FALSE, BOBBYR_SHIPMENT_ORDER_GRID_X, BOBBYR_SHIPMENT_ORDER_GRID_Y, &gpNewBobbyrShipments[giBobbyRShipmentSelectedShipment].BobbyRayPurchase[0], FALSE, giBobbyRShipmentSelectedShipment);
  } else {
    //		DisplayPurchasedItems( FALSE, BOBBYR_SHIPMENT_ORDER_GRID_X, BOBBYR_SHIPMENT_ORDER_GRID_Y, &LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[giBobbyRShipmentSelectedShipment].BobbyRayPurchase[0], TRUE );
    DisplayPurchasedItems(FALSE, BOBBYR_SHIPMENT_ORDER_GRID_X, BOBBYR_SHIPMENT_ORDER_GRID_Y, NULL, TRUE, giBobbyRShipmentSelectedShipment);
  }

  DisplayShipmentTitles();
  DisplayPreviousShipments();

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function BtnBobbyRShipmentBackCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    guiCurrentLaptopMode = LAPTOP_MODE_BOBBY_R_MAILORDER;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function BtnBobbyRShipmentHomeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);

    guiCurrentLaptopMode = LAPTOP_MODE_BOBBY_R;

    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}

function DisplayShipmentGrid(): void {
  HVOBJECT hPixHandle;

  GetVideoObject(&hPixHandle, guiBobbyRShipmentGrid);

  // Shipment Order Grid
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_SHIPMENT_DELIVERY_GRID_X, BOBBYR_SHIPMENT_DELIVERY_GRID_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Order Grid
  BltVideoObject(FRAME_BUFFER, hPixHandle, 1, BOBBYR_SHIPMENT_ORDER_GRID_X, BOBBYR_SHIPMENT_ORDER_GRID_Y, VO_BLT_SRCTRANSPARENCY, NULL);
}

function DisplayShipmentTitles(): void {
  // output the order #
  DrawTextToScreen(gzBobbyRShipmentText[BOBBYR_SHIPMENT__ORDERED_ON], BOBBYR_SHIPMENT_SHIPMENT_ORDER_NUM_X, BOBBYR_SHIPMENT_SHIPMENT_ORDER_NUM_Y, BOBBYR_SHIPMENT_ORDER_NUM_WIDTH, BOBBYR_SHIPMENT_STATIC_TEXT_FONT, BOBBYR_SHIPMENT_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Output the # of items
  DrawTextToScreen(gzBobbyRShipmentText[BOBBYR_SHIPMENT__NUM_ITEMS], BOBBYR_SHIPMENT_NUM_ITEMS_X, BOBBYR_SHIPMENT_NUM_ITEMS_Y, BOBBYR_SHIPMENT_NUM_ITEMS_WIDTH, BOBBYR_SHIPMENT_STATIC_TEXT_FONT, BOBBYR_SHIPMENT_STATIC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
}

function DisplayPreviousShipments(): void {
  UINT32 uiCnt;
  CHAR16 zText[512];
  UINT16 usPosY = BOBBYR_SHIPMENT_ORDER_NUM_START_Y;
  UINT32 uiNumItems = CountNumberValidShipmentForTheShipmentsPage();
  UINT32 uiNumberItemsInShipments = 0;
  UINT32 uiItemCnt;
  UINT8 ubFontColor = BOBBYR_SHIPMENT_STATIC_TEXT_COLOR;

  // loop through all the shipments
  for (uiCnt = 0; uiCnt < uiNumItems; uiCnt++) {
    // if it is a valid shipment, and can be displayed at bobby r
    if (gpNewBobbyrShipments[uiCnt].fActive && gpNewBobbyrShipments[giBobbyRShipmentSelectedShipment].fDisplayedInShipmentPage) {
      if (uiCnt == (UINT32)giBobbyRShipmentSelectedShipment) {
        ubFontColor = FONT_MCOLOR_WHITE;
      } else {
        ubFontColor = BOBBYR_SHIPMENT_STATIC_TEXT_COLOR;
      }

      // Display the "ordered on day num"
      swprintf(zText, L"%s %d", gpGameClockString[0], gpNewBobbyrShipments[uiCnt].uiOrderedOnDayNum);
      DrawTextToScreen(zText, BOBBYR_SHIPMENT_ORDER_NUM_X, usPosY, BOBBYR_SHIPMENT_ORDER_NUM_WIDTH, BOBBYR_SHIPMENT_STATIC_TEXT_FONT, ubFontColor, 0, FALSE, CENTER_JUSTIFIED);

      uiNumberItemsInShipments = 0;

      //		for( uiItemCnt=0; uiItemCnt<LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ uiCnt ].ubNumberPurchases; uiItemCnt++ )
      for (uiItemCnt = 0; uiItemCnt < gpNewBobbyrShipments[uiCnt].ubNumberPurchases; uiItemCnt++) {
        //			uiNumberItemsInShipments += LaptopSaveInfo.BobbyRayOrdersOnDeliveryArray[ uiCnt ].BobbyRayPurchase[uiItemCnt].ubNumberPurchased;
        uiNumberItemsInShipments += gpNewBobbyrShipments[uiCnt].BobbyRayPurchase[uiItemCnt].ubNumberPurchased;
      }

      // Display the # of items
      swprintf(zText, L"%d", uiNumberItemsInShipments);
      DrawTextToScreen(zText, BOBBYR_SHIPMENT_NUM_ITEMS_X, usPosY, BOBBYR_SHIPMENT_NUM_ITEMS_WIDTH, BOBBYR_SHIPMENT_STATIC_TEXT_FONT, ubFontColor, 0, FALSE, CENTER_JUSTIFIED);
      usPosY += BOBBYR_SHIPMENT_GAP_BTN_LINES;
    }
  }
}

function CreatePreviousShipmentsMouseRegions(): void {
  UINT32 uiCnt;
  UINT16 usPosY = BOBBYR_SHIPMENT_ORDER_NUM_START_Y;
  UINT16 usWidth = BOBBYR_SHIPMENT_DELIVERY_GRID_WIDTH;
  UINT16 usHeight = GetFontHeight(BOBBYR_SHIPMENT_STATIC_TEXT_FONT);
  UINT32 uiNumItems = CountNumberOfBobbyPurchasesThatAreInTransit();

  for (uiCnt = 0; uiCnt < uiNumItems; uiCnt++) {
    MSYS_DefineRegion(&gSelectedPreviousShipmentsRegion[uiCnt], BOBBYR_SHIPMENT_ORDER_NUM_X, usPosY, (UINT16)(BOBBYR_SHIPMENT_ORDER_NUM_X + usWidth), (UINT16)(usPosY + usHeight), MSYS_PRIORITY_HIGH, CURSOR_WWW, MSYS_NO_CALLBACK, SelectPreviousShipmentsRegionCallBack);
    MSYS_AddRegion(&gSelectedPreviousShipmentsRegion[uiCnt]);
    MSYS_SetRegionUserData(&gSelectedPreviousShipmentsRegion[uiCnt], 0, uiCnt);

    usPosY += BOBBYR_SHIPMENT_GAP_BTN_LINES;
  }
}

function RemovePreviousShipmentsMouseRegions(): void {
  UINT32 uiCnt;
  UINT32 uiNumItems = CountNumberOfBobbyPurchasesThatAreInTransit();

  for (uiCnt = 0; uiCnt < uiNumItems; uiCnt++) {
    MSYS_RemoveRegion(&gSelectedPreviousShipmentsRegion[uiCnt]);
  }
}

function SelectPreviousShipmentsRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    INT32 iSlotID = MSYS_GetRegionUserData(pRegion, 0);

    if (CountNumberOfBobbyPurchasesThatAreInTransit() > iSlotID) {
      INT32 iCnt;
      INT32 iValidShipmentCounter = 0;

      giBobbyRShipmentSelectedShipment = -1;

      // loop through and get the "x" iSlotID shipment
      for (iCnt = 0; iCnt < giNumberOfNewBobbyRShipment; iCnt++) {
        if (gpNewBobbyrShipments[iCnt].fActive) {
          if (iValidShipmentCounter == iSlotID) {
            giBobbyRShipmentSelectedShipment = iCnt;
          }

          iValidShipmentCounter++;
        }
      }
    }

    gfBobbyRShipmentsDirty = TRUE;
  }
}

function CountNumberValidShipmentForTheShipmentsPage(): INT32 {
  if (giNumberOfNewBobbyRShipment > BOBBYR_SHIPMENT_NUM_PREVIOUS_SHIPMENTS)
    return BOBBYR_SHIPMENT_NUM_PREVIOUS_SHIPMENTS;
  else
    return giNumberOfNewBobbyRShipment;
}
