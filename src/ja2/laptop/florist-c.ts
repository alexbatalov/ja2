const FLORIST_SENTENCE_FONT = () => FONT12ARIAL();
const FLORIST_SENTENCE_COLOR = FONT_MCOLOR_WHITE;

const FLORIST_TITLE_FONT = () => FONT14ARIAL();
const FLORIST_TITLE_COLOR = FONT_MCOLOR_WHITE;

const FLORIST_BACKGROUND_WIDTH = 125;
const FLORIST_BACKGROUND_HEIGHT = 100;

const FLORIST_BIG_TITLE_X = LAPTOP_SCREEN_UL_X + 113;
const FLORIST_BIG_TITLE_Y = LAPTOP_SCREEN_WEB_UL_Y + 0;

const FLORIST_SMALL_TITLE_X = LAPTOP_SCREEN_UL_X + 195;
const FLORIST_SMALL_TITLE_Y = LAPTOP_SCREEN_WEB_UL_Y + 0;
const FLORIST_SMALL_TITLE_WIDTH = 100;
const FLORIST_SMALL_TITLE_HEIGHT = 49;

const FLORIST_FIRST_BULLET_X = LAPTOP_SCREEN_UL_X + 5;
const FLORIST_FIRST_BULLET_Y = LAPTOP_SCREEN_WEB_UL_Y + 135;

const FLORIST_BULLET_OFFSET_Y = 54;

const FLORIST_NUMBER_OF_BULLETS = 4;

const FLORIST_GALLERY_BUTTON_X = LAPTOP_SCREEN_UL_X + 210;
const FLORIST_GALLERY_BUTTON_Y = LAPTOP_SCREEN_WEB_UL_Y + 360;

const FLORIST_FIRST_SENTENCE_COLUMN_TEXT_X = LAPTOP_SCREEN_UL_X + 53;
const FLORIST_FIRST_SENTENCE_COLUMN_TEXT_WIDTH = 136;

const FLORIST_SECOND_SENTENCE_COLUMN_TEXT_X = LAPTOP_SCREEN_UL_X + 200;
const FLORIST_SECOND_SENTENCE_COLUMN_TEXT_WIDTH = 300;

const FLORIST_COMPANY_INFO_TEXT_X = LAPTOP_SCREEN_UL_X + 117;
const FLORIST_COMPANY_INFO_TEXT_WIDTH = 290;

const FLORIST_COMPANY_INFO_LINE_1_Y = LAPTOP_SCREEN_WEB_UL_Y + 79;
const FLORIST_COMPANY_INFO_LINE_2_Y = LAPTOP_SCREEN_WEB_UL_Y + 94;
const FLORIST_COMPANY_INFO_LINE_3_Y = LAPTOP_SCREEN_WEB_UL_Y + 107;
const FLORIST_COMPANY_INFO_LINE_4_Y = LAPTOP_SCREEN_WEB_UL_Y + 119;

let guiFloristBackground: UINT32;
let guiHandBullet: UINT32;
let guiLargeTitleSymbol: UINT32;
let guiSmallTitleSymbol: UINT32;

let gfHomePageActive: BOOLEAN = FALSE; // Specifies whether or not the home page or the sub pages are active

// Buttons

// Graphic for button
let guiGalleryButtonImage: INT32;
let guiGalleryButton: UINT32;

// link to the flower home page by clicking on the flower title
let gSelectedFloristTitleHomeLinkRegion: MOUSE_REGION;

function GameInitFlorist(): void {
}

function EnterFlorist(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  SetBookMark(Enum98.FLORIST_BOOKMARK);

  InitFloristDefaults();

  // load the handbullet graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\HandBullet.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiHandBullet)));

  guiGalleryButtonImage = LoadButtonImage("LAPTOP\\FloristButtons.sti", -1, 0, -1, 1, -1);

  guiGalleryButton = CreateIconAndTextButton(guiGalleryButtonImage, sFloristText[Enum345.FLORIST_GALLERY], FLORIST_BUTTON_TEXT_FONT, FLORIST_BUTTON_TEXT_UP_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, FLORIST_BUTTON_TEXT_DOWN_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, TEXT_CJUSTIFIED, FLORIST_GALLERY_BUTTON_X, FLORIST_GALLERY_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnGalleryButtonCallback);
  SetButtonCursor(guiGalleryButton, Enum317.CURSOR_WWW);

  // reset the currently selected card
  gbCurrentlySelectedCard = -1;

  // Initialize the Florsit Order Page (reset some variables)
  InitFloristOrderForm();

  // Initialize the flower index for the gallery page
  gubCurFlowerIndex = 0;

  RenderFlorist();
  fReDrawScreenFlag = TRUE;

  // set some variables for the order form
  InitFloristOrderFormVariables();

  return TRUE;
}

function ExitFlorist(): void {
  DeleteVideoObjectFromIndex(guiHandBullet);

  RemoveFloristDefaults();

  UnloadButtonImage(guiGalleryButtonImage);

  RemoveButton(guiGalleryButton);
}

function HandleFlorist(): void {
}

function RenderFlorist(): void {
  let hPixHandle: HVOBJECT;
  let i: UINT16;
  let usPosY: UINT16;
  let ubTextCounter: UINT8;

  GetVideoObject(addressof(hPixHandle), guiHandBullet);

  DisplayFloristDefaults();

  // compnay info
  DisplayWrappedString(FLORIST_COMPANY_INFO_TEXT_X, FLORIST_COMPANY_INFO_LINE_1_Y, FLORIST_COMPANY_INFO_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT, FLORIST_SENTENCE_COLOR, sFloristText[Enum345.FLORIST_DROP_ANYWHERE], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
  DisplayWrappedString(FLORIST_COMPANY_INFO_TEXT_X, FLORIST_COMPANY_INFO_LINE_2_Y, FLORIST_COMPANY_INFO_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT, FLORIST_SENTENCE_COLOR, sFloristText[Enum345.FLORIST_PHONE_NUMBER], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
  DisplayWrappedString(FLORIST_COMPANY_INFO_TEXT_X, FLORIST_COMPANY_INFO_LINE_3_Y, FLORIST_COMPANY_INFO_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT, FLORIST_SENTENCE_COLOR, sFloristText[Enum345.FLORIST_STREET_ADDRESS], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
  DisplayWrappedString(FLORIST_COMPANY_INFO_TEXT_X, FLORIST_COMPANY_INFO_LINE_4_Y, FLORIST_COMPANY_INFO_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT, FLORIST_SENTENCE_COLOR, sFloristText[Enum345.FLORIST_WWW_ADDRESS], FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  usPosY = FLORIST_FIRST_BULLET_Y;
  ubTextCounter = Enum345.FLORIST_ADVERTISEMENT_1;
  for (i = 0; i < FLORIST_NUMBER_OF_BULLETS; i++) {
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLORIST_FIRST_BULLET_X, usPosY, VO_BLT_SRCTRANSPARENCY, NULL);

    DisplayWrappedString(FLORIST_FIRST_SENTENCE_COLUMN_TEXT_X, (usPosY + 20), FLORIST_FIRST_SENTENCE_COLUMN_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT, FLORIST_SENTENCE_COLOR, sFloristText[ubTextCounter], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
    ubTextCounter++;

    DisplayWrappedString(FLORIST_SECOND_SENTENCE_COLUMN_TEXT_X, (usPosY + 15), FLORIST_SECOND_SENTENCE_COLUMN_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT, FLORIST_SENTENCE_COLOR, sFloristText[ubTextCounter], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
    ubTextCounter++;

    usPosY += FLORIST_BULLET_OFFSET_Y;
  }

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_UL_Y);
}

function InitFloristDefaults(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  // load the Florist background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\leafback.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiFloristBackground)));

  // if its the first page
  if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_FLORIST) {
    // load the small title graphic and add it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    GetMLGFilename(VObjectDesc.ImageFile, Enum326.MLG_LARGEFLORISTSYMBOL);
    CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiLargeTitleSymbol)));
  } else {
    // load the leaf back graphic and add it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    GetMLGFilename(VObjectDesc.ImageFile, Enum326.MLG_SMALLFLORISTSYMBOL);
    CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiSmallTitleSymbol)));

    // flower title homepage link
    MSYS_DefineRegion(addressof(gSelectedFloristTitleHomeLinkRegion), FLORIST_SMALL_TITLE_X, FLORIST_SMALL_TITLE_Y, (FLORIST_SMALL_TITLE_X + FLORIST_SMALL_TITLE_WIDTH), (FLORIST_SMALL_TITLE_Y + FLORIST_SMALL_TITLE_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFloristTitleHomeLinkRegionCallBack);
    MSYS_AddRegion(addressof(gSelectedFloristTitleHomeLinkRegion));
  }

  return TRUE;
}

function DisplayFloristDefaults(): void {
  let hPixHandle: HVOBJECT;

  WebPageTileBackground(4, 4, FLORIST_BACKGROUND_WIDTH, FLORIST_BACKGROUND_HEIGHT, guiFloristBackground);

  // if its the first page
  if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_FLORIST) {
    gfHomePageActive = TRUE;
    GetVideoObject(addressof(hPixHandle), guiLargeTitleSymbol);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLORIST_BIG_TITLE_X, FLORIST_BIG_TITLE_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  } else {
    gfHomePageActive = FALSE;
    GetVideoObject(addressof(hPixHandle), guiSmallTitleSymbol);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLORIST_SMALL_TITLE_X, FLORIST_SMALL_TITLE_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  }
}

function RemoveFloristDefaults(): void {
  DeleteVideoObjectFromIndex(guiFloristBackground);

  // if its the first page
  if (gfHomePageActive) {
    // delete the big title
    DeleteVideoObjectFromIndex(guiLargeTitleSymbol);
  } else {
    // delete the little title
    DeleteVideoObjectFromIndex(guiSmallTitleSymbol);

    MSYS_RemoveRegion(addressof(gSelectedFloristTitleHomeLinkRegion));
  }
}

function BtnGalleryButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST_FLOWER_GALLERY;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function SelectFloristTitleHomeLinkRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}
