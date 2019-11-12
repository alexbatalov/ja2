namespace ja2 {

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

let gfHomePageActive: boolean = false; // Specifies whether or not the home page or the sub pages are active

// Buttons

// Graphic for button
export let guiGalleryButtonImage: INT32;
export let guiGalleryButton: UINT32;

// link to the flower home page by clicking on the flower title
let gSelectedFloristTitleHomeLinkRegion: MOUSE_REGION = createMouseRegion();

export function GameInitFlorist(): void {
}

export function EnterFlorist(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  SetBookMark(Enum98.FLORIST_BOOKMARK);

  InitFloristDefaults();

  // load the handbullet graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\HandBullet.sti");
  if (!(guiHandBullet = AddVideoObject(VObjectDesc))) {
    return false;
  }

  guiGalleryButtonImage = LoadButtonImage("LAPTOP\\FloristButtons.sti", -1, 0, -1, 1, -1);

  guiGalleryButton = CreateIconAndTextButton(guiGalleryButtonImage, sFloristText[Enum345.FLORIST_GALLERY], FLORIST_BUTTON_TEXT_FONT(), FLORIST_BUTTON_TEXT_UP_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, FLORIST_BUTTON_TEXT_DOWN_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, TEXT_CJUSTIFIED, FLORIST_GALLERY_BUTTON_X, FLORIST_GALLERY_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnGalleryButtonCallback);
  SetButtonCursor(guiGalleryButton, Enum317.CURSOR_WWW);

  // reset the currently selected card
  gbCurrentlySelectedCard = -1;

  // Initialize the Florsit Order Page (reset some variables)
  InitFloristOrderForm();

  // Initialize the flower index for the gallery page
  gubCurFlowerIndex = 0;

  RenderFlorist();
  fReDrawScreenFlag = true;

  // set some variables for the order form
  InitFloristOrderFormVariables();

  return true;
}

export function ExitFlorist(): void {
  DeleteVideoObjectFromIndex(guiHandBullet);

  RemoveFloristDefaults();

  UnloadButtonImage(guiGalleryButtonImage);

  RemoveButton(guiGalleryButton);
}

export function HandleFlorist(): void {
}

export function RenderFlorist(): void {
  let hPixHandle: HVOBJECT;
  let i: UINT16;
  let usPosY: UINT16;
  let ubTextCounter: UINT8;

  hPixHandle = GetVideoObject(guiHandBullet);

  DisplayFloristDefaults();

  // compnay info
  DisplayWrappedString(FLORIST_COMPANY_INFO_TEXT_X, FLORIST_COMPANY_INFO_LINE_1_Y, FLORIST_COMPANY_INFO_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT(), FLORIST_SENTENCE_COLOR, sFloristText[Enum345.FLORIST_DROP_ANYWHERE], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DisplayWrappedString(FLORIST_COMPANY_INFO_TEXT_X, FLORIST_COMPANY_INFO_LINE_2_Y, FLORIST_COMPANY_INFO_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT(), FLORIST_SENTENCE_COLOR, sFloristText[Enum345.FLORIST_PHONE_NUMBER], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DisplayWrappedString(FLORIST_COMPANY_INFO_TEXT_X, FLORIST_COMPANY_INFO_LINE_3_Y, FLORIST_COMPANY_INFO_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT(), FLORIST_SENTENCE_COLOR, sFloristText[Enum345.FLORIST_STREET_ADDRESS], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  DisplayWrappedString(FLORIST_COMPANY_INFO_TEXT_X, FLORIST_COMPANY_INFO_LINE_4_Y, FLORIST_COMPANY_INFO_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT(), FLORIST_SENTENCE_COLOR, sFloristText[Enum345.FLORIST_WWW_ADDRESS], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  usPosY = FLORIST_FIRST_BULLET_Y;
  ubTextCounter = Enum345.FLORIST_ADVERTISEMENT_1;
  for (i = 0; i < FLORIST_NUMBER_OF_BULLETS; i++) {
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLORIST_FIRST_BULLET_X, usPosY, VO_BLT_SRCTRANSPARENCY, null);

    DisplayWrappedString(FLORIST_FIRST_SENTENCE_COLUMN_TEXT_X, (usPosY + 20), FLORIST_FIRST_SENTENCE_COLUMN_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT(), FLORIST_SENTENCE_COLOR, sFloristText[ubTextCounter], FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    ubTextCounter++;

    DisplayWrappedString(FLORIST_SECOND_SENTENCE_COLUMN_TEXT_X, (usPosY + 15), FLORIST_SECOND_SENTENCE_COLUMN_TEXT_WIDTH, 2, FLORIST_SENTENCE_FONT(), FLORIST_SENTENCE_COLOR, sFloristText[ubTextCounter], FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    ubTextCounter++;

    usPosY += FLORIST_BULLET_OFFSET_Y;
  }

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_UL_Y);
}

export function InitFloristDefaults(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load the Florist background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\leafback.sti");
  if (!(guiFloristBackground = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // if its the first page
  if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_FLORIST) {
    // load the small title graphic and add it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_LARGEFLORISTSYMBOL);
    if (!(guiLargeTitleSymbol = AddVideoObject(VObjectDesc))) {
      return false;
    }
  } else {
    // load the leaf back graphic and add it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_SMALLFLORISTSYMBOL);
    if (!(guiSmallTitleSymbol = AddVideoObject(VObjectDesc))) {
      return false;
    }

    // flower title homepage link
    MSYS_DefineRegion(gSelectedFloristTitleHomeLinkRegion, FLORIST_SMALL_TITLE_X, FLORIST_SMALL_TITLE_Y, (FLORIST_SMALL_TITLE_X + FLORIST_SMALL_TITLE_WIDTH), (FLORIST_SMALL_TITLE_Y + FLORIST_SMALL_TITLE_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFloristTitleHomeLinkRegionCallBack);
    MSYS_AddRegion(gSelectedFloristTitleHomeLinkRegion);
  }

  return true;
}

export function DisplayFloristDefaults(): void {
  let hPixHandle: HVOBJECT;

  WebPageTileBackground(4, 4, FLORIST_BACKGROUND_WIDTH, FLORIST_BACKGROUND_HEIGHT, guiFloristBackground);

  // if its the first page
  if (guiCurrentLaptopMode == Enum95.LAPTOP_MODE_FLORIST) {
    gfHomePageActive = true;
    hPixHandle = GetVideoObject(guiLargeTitleSymbol);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLORIST_BIG_TITLE_X, FLORIST_BIG_TITLE_Y, VO_BLT_SRCTRANSPARENCY, null);
  } else {
    gfHomePageActive = false;
    hPixHandle = GetVideoObject(guiSmallTitleSymbol);
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FLORIST_SMALL_TITLE_X, FLORIST_SMALL_TITLE_Y, VO_BLT_SRCTRANSPARENCY, null);
  }
}

export function RemoveFloristDefaults(): void {
  DeleteVideoObjectFromIndex(guiFloristBackground);

  // if its the first page
  if (gfHomePageActive) {
    // delete the big title
    DeleteVideoObjectFromIndex(guiLargeTitleSymbol);
  } else {
    // delete the little title
    DeleteVideoObjectFromIndex(guiSmallTitleSymbol);

    MSYS_RemoveRegion(gSelectedFloristTitleHomeLinkRegion);
  }
}

function BtnGalleryButtonCallback(btn: GUI_BUTTON, reason: INT32): void {
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

function SelectFloristTitleHomeLinkRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_FLORIST;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

}
