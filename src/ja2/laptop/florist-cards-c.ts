const FLORIST_CARDS_SENTENCE_FONT = () => FONT12ARIAL();
const FLORIST_CARDS_SENTENCE_COLOR = FONT_MCOLOR_WHITE;

const FLORIST_CARD_FIRST_POS_X = LAPTOP_SCREEN_UL_X + 7;
const FLORIST_CARD_FIRST_POS_Y = LAPTOP_SCREEN_WEB_UL_Y + 72;
const FLORIST_CARD_FIRST_OFFSET_X = 174;
const FLORIST_CARD_FIRST_OFFSET_Y = 109;

const FLORIST_CARD_CARD_WIDTH = 135;
const FLORIST_CARD_CARD_HEIGHT = 100;

const FLORIST_CARD_TEXT_WIDTH = 121;
const FLORIST_CARD_TEXT_HEIGHT = 90;

const FLORIST_CARD_TITLE_SENTENCE_X = LAPTOP_SCREEN_UL_X;
const FLORIST_CARD_TITLE_SENTENCE_Y = LAPTOP_SCREEN_WEB_UL_Y + 53;
const FLORIST_CARD_TITLE_SENTENCE_WIDTH = LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X;

const FLORIST_CARD_BACK_BUTTON_X = LAPTOP_SCREEN_UL_X + 8;
const FLORIST_CARD_BACK_BUTTON_Y = LAPTOP_SCREEN_WEB_UL_Y + 12;

UINT32 guiCardBackground;

INT8 gbCurrentlySelectedCard;

// link to the card gallery
MOUSE_REGION gSelectedFloristCardsRegion[9];

INT32 guiFlowerCardsButtonImage;
UINT32 guiFlowerCardsBackButton;

function GameInitFloristCards(): void {
}

function EnterFloristCards(): BOOLEAN {
  UINT16 i, j, usPosX, usPosY;
  VOBJECT_DESC VObjectDesc;
  UINT8 ubCount;

  InitFloristDefaults();

  // load the Flower Account Box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\CardBlank.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiCardBackground));

  ubCount = 0;
  usPosY = FLORIST_CARD_FIRST_POS_Y;
  for (j = 0; j < 3; j++) {
    usPosX = FLORIST_CARD_FIRST_POS_X;
    for (i = 0; i < 3; i++) {
      MSYS_DefineRegion(&gSelectedFloristCardsRegion[ubCount], usPosX, usPosY, (UINT16)(usPosX + FLORIST_CARD_CARD_WIDTH), (UINT16)(usPosY + FLORIST_CARD_CARD_HEIGHT), MSYS_PRIORITY_HIGH, CURSOR_WWW, MSYS_NO_CALLBACK, SelectFloristCardsRegionCallBack);
      MSYS_AddRegion(&gSelectedFloristCardsRegion[ubCount]);
      MSYS_SetRegionUserData(&gSelectedFloristCardsRegion[ubCount], 0, ubCount);
      ubCount++;
      usPosX += FLORIST_CARD_FIRST_OFFSET_X;
    }
    usPosY += FLORIST_CARD_FIRST_OFFSET_Y;
  }

  guiFlowerCardsButtonImage = LoadButtonImage("LAPTOP\\FloristButtons.sti", -1, 0, -1, 1, -1);

  guiFlowerCardsBackButton = CreateIconAndTextButton(guiFlowerCardsButtonImage, sFloristCards[FLORIST_CARDS_BACK], FLORIST_BUTTON_TEXT_FONT, FLORIST_BUTTON_TEXT_UP_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, FLORIST_BUTTON_TEXT_DOWN_COLOR, FLORIST_BUTTON_TEXT_SHADOW_COLOR, TEXT_CJUSTIFIED, FLORIST_CARD_BACK_BUTTON_X, FLORIST_CARD_BACK_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnFlowerCardsBackButtonCallback);
  SetButtonCursor(guiFlowerCardsBackButton, CURSOR_WWW);

  // passing the currently selected card to -1, so it is not used
  gbCurrentlySelectedCard = -1;

  RenderFloristCards();
  return TRUE;
}

function ExitFloristCards(): void {
  UINT8 i;

  RemoveFloristDefaults();
  DeleteVideoObjectFromIndex(guiCardBackground);

  // card gallery
  for (i = 0; i < 9; i++)
    MSYS_RemoveRegion(&gSelectedFloristCardsRegion[i]);

  UnloadButtonImage(guiFlowerCardsButtonImage);
  RemoveButton(guiFlowerCardsBackButton);
}

function HandleFloristCards(): void {
}

function RenderFloristCards(): void {
  UINT8 i, j, ubCount;
  UINT16 usPosX, usPosY;
  wchar_t sTemp[640];
  UINT32 uiStartLoc = 0;
  HVOBJECT hPixHandle;
  UINT16 usHeightOffset;

  DisplayFloristDefaults();

  DrawTextToScreen(sFloristCards[FLORIST_CARDS_CLICK_SELECTION], FLORIST_CARD_TITLE_SENTENCE_X, FLORIST_CARD_TITLE_SENTENCE_Y, FLORIST_CARD_TITLE_SENTENCE_WIDTH, FONT10ARIAL, FLORIST_CARDS_SENTENCE_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  GetVideoObject(&hPixHandle, guiCardBackground);
  usPosY = FLORIST_CARD_FIRST_POS_Y;
  ubCount = 0;
  for (j = 0; j < 3; j++) {
    usPosX = FLORIST_CARD_FIRST_POS_X;
    for (i = 0; i < 3; i++) {
      // The flowe account box
      BltVideoObject(FRAME_BUFFER, hPixHandle, 0, usPosX, usPosY, VO_BLT_SRCTRANSPARENCY, NULL);

      // Get and display the card saying
      uiStartLoc = FLOR_CARD_TEXT_TITLE_SIZE * ubCount;
      LoadEncryptedDataFromFile(FLOR_CARD_TEXT_FILE, sTemp, uiStartLoc, FLOR_CARD_TEXT_TITLE_SIZE);

      //			DisplayWrappedString((UINT16)(usPosX+7), (UINT16)(usPosY+15), FLORIST_CARD_TEXT_WIDTH, 2, FLORIST_CARDS_SENTENCE_FONT, FLORIST_CARDS_SENTENCE_COLOR,  sTemp, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);
      usHeightOffset = IanWrappedStringHeight((UINT16)(usPosX + 7), (UINT16)(usPosY), FLORIST_CARD_TEXT_WIDTH, 2, FLORIST_CARDS_SENTENCE_FONT, FLORIST_CARDS_SENTENCE_COLOR, sTemp, 0, FALSE, 0);

      usHeightOffset = (FLORIST_CARD_TEXT_HEIGHT - usHeightOffset) / 2;

      IanDisplayWrappedString((UINT16)(usPosX + 7), (UINT16)(usPosY + 10 + usHeightOffset), FLORIST_CARD_TEXT_WIDTH, 2, FLORIST_CARDS_SENTENCE_FONT, FLORIST_CARDS_SENTENCE_COLOR, sTemp, 0, FALSE, 0);

      ubCount++;
      usPosX += FLORIST_CARD_FIRST_OFFSET_X;
    }
    usPosY += FLORIST_CARD_FIRST_OFFSET_Y;
  }

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function SelectFloristCardsRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gbCurrentlySelectedCard = (UINT8)MSYS_GetRegionUserData(pRegion, 0);

    guiCurrentLaptopMode = LAPTOP_MODE_FLORIST_ORDERFORM;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function BtnFlowerCardsBackButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON) {
      btn->uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = LAPTOP_MODE_FLORIST_ORDERFORM;

      InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn->uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn->Area.RegionTopLeftX, btn->Area.RegionTopLeftY, btn->Area.RegionBottomRightX, btn->Area.RegionBottomRightY);
  }
}
