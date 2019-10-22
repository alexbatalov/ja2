// Defines

const NUM_AIM_HISTORY_PAGES = 5;

const AIM_HISTORY_TITLE_FONT = () => FONT14ARIAL();
const AIM_HISTORY_TITLE_COLOR = AIM_GREEN;
const AIM_HISTORY_TEXT_FONT = () => FONT10ARIAL();
const AIM_HISTORY_TEXT_COLOR = FONT_MCOLOR_WHITE;
const AIM_HISTORY_TOC_TEXT_FONT = () => FONT12ARIAL();
const AIM_HISTORY_TOC_TEXT_COLOR = FONT_MCOLOR_WHITE;
const AIM_HISTORY_PARAGRAPH_TITLE_FONT = () => FONT12ARIAL();
const AIM_HISTORY_PARAGRAPH_TITLE_COLOR = FONT_MCOLOR_WHITE;

const AIM_HISTORY_MENU_X = LAPTOP_SCREEN_UL_X + 40;
const AIM_HISTORY_MENU_Y = 370 + LAPTOP_SCREEN_WEB_DELTA_Y;
const AIM_HISTORY_MENU_BUTTON_AMOUNT = 4;
const AIM_HISTORY_GAP_X = 40 + BOTTOM_BUTTON_START_WIDTH;
const AIM_HISTORY_MENU_END_X = AIM_HISTORY_MENU_X + AIM_HISTORY_GAP_X *(AIM_HISTORY_MENU_BUTTON_AMOUNT + 2);
const AIM_HISTORY_MENU_END_Y = AIM_HISTORY_MENU_Y + BOTTOM_BUTTON_START_HEIGHT;

const AIM_HISTORY_TEXT_X = IMAGE_OFFSET_X + 149;
const AIM_HISTORY_TEXT_Y = AIM_SYMBOL_Y + AIM_SYMBOL_SIZE_Y + 45;
const AIM_HISTORY_TEXT_WIDTH = AIM_SYMBOL_WIDTH;

const AIM_HISTORY_PARAGRAPH_X = LAPTOP_SCREEN_UL_X + 20;
const AIM_HISTORY_PARAGRAPH_Y = AIM_HISTORY_SUBTITLE_Y + 18;
const AIM_HISTORY_SUBTITLE_Y = 150 + LAPTOP_SCREEN_WEB_DELTA_Y;
const AIM_HISTORY_PARAGRAPH_WIDTH = 460;

const AIM_HISTORY_CONTENTBUTTON_X = 259;
const AIM_HISTORY_CONTENTBUTTON_Y = AIM_HISTORY_SUBTITLE_Y;

const AIM_HISTORY_TOC_X = AIM_HISTORY_CONTENTBUTTON_X;
const AIM_HISTORY_TOC_Y = 5;
const AIM_HISTORY_TOC_GAP_Y = 25;

const AIM_HISTORY_SPACE_BETWEEN_PARAGRAPHS = 8;

let guiBottomButton: UINT32;
let guiBottomButton2: UINT32;
let guiContentButton: UINT32;

let gubCurPageNum: UINT8;
let gfInToc: BOOLEAN = FALSE;
let gubAimHistoryMenuButtonDown: UINT8 = 255;
let gfExitingAimHistory: BOOLEAN;
let AimHistorySubPagesVisitedFlag: BOOLEAN[] /* [NUM_AIM_HISTORY_PAGES] */;

let gSelectedHistoryTocMenuRegion: MOUSE_REGION[] /* [NUM_AIM_HISTORY_PAGES] */;

let guiHistoryMenuButton: UINT32[] /* [AIM_HISTORY_MENU_BUTTON_AMOUNT] */;
let guiHistoryMenuButtonImage: INT32;

// These enums represent which paragraph they are located in the AimHist.edt file
const enum Enum64 {
  IN_THE_BEGINNING = 6,
  IN_THE_BEGINNING_1,
  IN_THE_BEGINNING_2,

  THE_ISLAND_METAVIRA,
  THE_ISLAND_METAVIRA_1,
  THE_ISLAND_METAVIRA_2,

  GUS_TARBALLS,
  GUS_TARBALLS_1,
  GUS_TARBALLS_2,

  WORD_FROM_FOUNDER,
  WORD_FROM_FOUNDER_1,
  COLONEL_MOHANNED,

  INCORPORATION,
  INCORPORATION_1,
  INCORPORATION_2,
  DUNN_AND_BRADROAD,
  INCORPORATION_3,
}

function GameInitAimHistory(): void {
}

function EnterInitAimHistory(): void {
  memset(addressof(AimHistorySubPagesVisitedFlag), 0, NUM_AIM_HISTORY_PAGES);
}

function EnterAimHistory(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  gfExitingAimHistory = FALSE;
  InitAimDefaults();
  InitAimHistoryMenuBar();

  // load the Content Buttons graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\ContentButton.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiContentButton)));

  gubCurPageNum = giCurrentSubPage;
  RenderAimHistory();

  DisableAimHistoryButton();
  gubAimHistoryMenuButtonDown = 255;

  return TRUE;
}

function ExitAimHistory(): void {
  gfExitingAimHistory = TRUE;
  RemoveAimDefaults();
  ExitAimHistoryMenuBar();

  DeleteVideoObjectFromIndex(guiContentButton);
  giCurrentSubPage = gubCurPageNum;

  if (gfInToc)
    ExitTocMenu();
}

function HandleAimHistory(): void {
}

function RenderAimHistory(): void {
  let sText: wchar_t[] /* [400] */;
  let uiStartLoc: UINT32 = 0;
  let usPosY: UINT16;

  DrawAimDefaults();
  //	DrawAimHistoryMenuBar();
  DisplayAimSlogan();
  DisplayAimCopyright();

  DrawTextToScreen(AimHistoryText[AIM_HISTORY_TITLE], AIM_HISTORY_TEXT_X, AIM_HISTORY_TEXT_Y, AIM_HISTORY_TEXT_WIDTH, AIM_HISTORY_TITLE_FONT, AIM_HISTORY_TITLE_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  switch (gubCurPageNum) {
    // History Page TOC
    case 0:
      InitTocMenu();
      break;

    // Load and Display the begining
    case 1:
      DisplayAimHistoryParagraph(IN_THE_BEGINNING, 2);
      break;

    // Load and Display the island of metavira
    case 2:
      DisplayAimHistoryParagraph(THE_ISLAND_METAVIRA, 2);
      break;

    // Load and Display the gus tarballs
    case 3:
      DisplayAimHistoryParagraph(GUS_TARBALLS, 2);
      break;

    // Load and Display the founder
    case 4:
      DisplayAimHistoryParagraph(WORD_FROM_FOUNDER, 1);

      // display coloniel Mohanned...
      usPosY = AIM_HISTORY_PARAGRAPH_Y + (GetFontHeight(AIM_HISTORY_TEXT_FONT) + 2) * 5 + LAPTOP_SCREEN_WEB_DELTA_Y;
      uiStartLoc = AIM_HISTORY_LINE_SIZE * COLONEL_MOHANNED;
      LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);
      DisplayWrappedString(AIM_HISTORY_PARAGRAPH_X, 210 + LAPTOP_SCREEN_WEB_DELTA_Y, AIM_HISTORY_PARAGRAPH_WIDTH, 2, AIM_HISTORY_TEXT_FONT, AIM_HISTORY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);
      break;

    // Load and Display the incorporation
    case 5:
      DisplayAimHistoryParagraph(INCORPORATION, 2);

      // display dunn and bradbord...
      uiStartLoc = AIM_HISTORY_LINE_SIZE * DUNN_AND_BRADROAD;
      LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);
      DisplayWrappedString(AIM_HISTORY_PARAGRAPH_X, 270 + LAPTOP_SCREEN_WEB_DELTA_Y, AIM_HISTORY_PARAGRAPH_WIDTH, 2, AIM_HISTORY_TEXT_FONT, AIM_HISTORY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

      // AIM_HISTORY_PARAGRAPH_Y
      uiStartLoc = AIM_HISTORY_LINE_SIZE * INCORPORATION_3;
      LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);
      DisplayWrappedString(AIM_HISTORY_PARAGRAPH_X, 290 + LAPTOP_SCREEN_WEB_DELTA_Y, AIM_HISTORY_PARAGRAPH_WIDTH, 2, AIM_HISTORY_TEXT_FONT, AIM_HISTORY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
      break;
  }

  MarkButtonsDirty();

  RenderWWWProgramTitleBar();

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function InitAimHistoryMenuBar(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let i: UINT16;
  let usPosX: UINT16;

  // load the Bottom Buttons graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BottomButton.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBottomButton)));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BottomButton2.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBottomButton2)));

  guiHistoryMenuButtonImage = LoadButtonImage("LAPTOP\\BottomButtons2.sti", -1, 0, -1, 1, -1);
  usPosX = AIM_HISTORY_MENU_X;
  for (i = 0; i < AIM_HISTORY_MENU_BUTTON_AMOUNT; i++) {
    //		guiHistoryMenuButton[i] = QuickCreateButton(guiHistoryMenuButtonImage, usPosX, AIM_HISTORY_MENU_Y,
    //																	BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
    //																	DEFAULT_MOVE_CALLBACK, (GUI_CALLBACK)BtnHistoryMenuButtonCallback);
    //		SetButtonCursor(guiHistoryMenuButton[i], CURSOR_WWW);
    //		MSYS_SetBtnUserData( guiHistoryMenuButton[i], 0, i+1);

    guiHistoryMenuButton[i] = CreateIconAndTextButton(guiHistoryMenuButtonImage, AimHistoryText[i + AIM_HISTORY_PREVIOUS], FONT10ARIAL, AIM_BUTTON_ON_COLOR, DEFAULT_SHADOW, AIM_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, usPosX, AIM_HISTORY_MENU_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnHistoryMenuButtonCallback);
    SetButtonCursor(guiHistoryMenuButton[i], CURSOR_WWW);
    MSYS_SetBtnUserData(guiHistoryMenuButton[i], 0, i + 1);

    usPosX += AIM_HISTORY_GAP_X;
  }

  return TRUE;
}

function ExitAimHistoryMenuBar(): BOOLEAN {
  let i: int;

  //	DeleteVideoObjectFromIndex(guiHistoryMenuButtonImage);
  UnloadButtonImage(guiHistoryMenuButtonImage);

  for (i = 0; i < AIM_HISTORY_MENU_BUTTON_AMOUNT; i++)
    RemoveButton(guiHistoryMenuButton[i]);

  return TRUE;
}

function SelectHistoryMenuButtonsRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  let rValue: UINT8;
  /* static */ let fOnPage: BOOLEAN = TRUE;

  if (fOnPage) {
    if (iReason & MSYS_CALLBACK_REASON_INIT) {
    } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      rValue = MSYS_GetRegionUserData(pRegion, 0);
      // Previous Page
      if (rValue == 1) {
        if (gubCurPageNum > 0) {
          gubCurPageNum--;
          ChangingAimHistorySubPage(gubCurPageNum);
          //					RenderAimHistory();
        }
      }

      // Home Page
      else if (rValue == 2) {
        guiCurrentLaptopMode = LAPTOP_MODE_AIM;
      }
      // Company policies
      else if (rValue == 3) {
        guiCurrentLaptopMode = LAPTOP_MODE_AIM_POLICIES;
      }
      // Next Page
      else if (rValue == 4) {
        if (gubCurPageNum < NUM_AIM_HISTORY_PAGES) {
          gubCurPageNum++;
          ChangingAimHistorySubPage(gubCurPageNum);

          fOnPage = FALSE;
          if (gfInToc) {
            ExitTocMenu();
          }
          fOnPage = TRUE;
          //					RenderAimHistory();
        }
      }
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    }
  }
}

function DisplayAimHistoryParagraph(ubPageNum: UINT8, ubNumParagraphs: UINT8): BOOLEAN {
  let sText: wchar_t[] /* [400] */;
  let uiStartLoc: UINT32 = 0;
  let usPosY: UINT16 = 0;
  let usNumPixels: UINT16 = 0;

  // title
  uiStartLoc = AIM_HISTORY_LINE_SIZE * ubPageNum;
  LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);
  DrawTextToScreen(sText, AIM_HISTORY_PARAGRAPH_X, AIM_HISTORY_SUBTITLE_Y, 0, AIM_HISTORY_PARAGRAPH_TITLE_FONT, AIM_HISTORY_PARAGRAPH_TITLE_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  if (ubNumParagraphs >= 1) {
    usPosY = AIM_HISTORY_PARAGRAPH_Y;
    // 1st paragraph
    uiStartLoc = AIM_HISTORY_LINE_SIZE * (ubPageNum + 1);
    LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);
    usNumPixels = DisplayWrappedString(AIM_HISTORY_PARAGRAPH_X, usPosY, AIM_HISTORY_PARAGRAPH_WIDTH, 2, AIM_HISTORY_TEXT_FONT, AIM_HISTORY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  }

  if (ubNumParagraphs >= 2) {
    // 2nd paragraph
    usPosY += usNumPixels + AIM_HISTORY_SPACE_BETWEEN_PARAGRAPHS;
    uiStartLoc = AIM_HISTORY_LINE_SIZE * (ubPageNum + 2);
    LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);
    DisplayWrappedString(AIM_HISTORY_PARAGRAPH_X, usPosY, AIM_HISTORY_PARAGRAPH_WIDTH, 2, AIM_HISTORY_TEXT_FONT, AIM_HISTORY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  }

  if (ubNumParagraphs >= 3) {
    // 3rd paragraph
    usPosY += usNumPixels + AIM_HISTORY_SPACE_BETWEEN_PARAGRAPHS;

    uiStartLoc = AIM_HISTORY_LINE_SIZE * (ubPageNum + 3);
    LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);
    DisplayWrappedString(AIM_HISTORY_PARAGRAPH_X, usPosY, AIM_HISTORY_PARAGRAPH_WIDTH, 2, AIM_HISTORY_TEXT_FONT, AIM_HISTORY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  }

  return TRUE;
}

function InitTocMenu(): BOOLEAN {
  let i: UINT16;
  let usPosY: UINT16;
  let usHeight: UINT16;
  let usWidth: UINT16 = 0;
  let uiStartLoc: UINT32 = 0;
  let sText: wchar_t[] /* [400] */;
  let ubLocInFile: UINT8[] /* [] */ = [
    IN_THE_BEGINNING,
    THE_ISLAND_METAVIRA,
    GUS_TARBALLS,
    WORD_FROM_FOUNDER,
    INCORPORATION,
  ];

  let hContentButtonHandle: HVOBJECT;

  GetVideoObject(addressof(hContentButtonHandle), guiContentButton);

  usHeight = GetFontHeight(AIM_HISTORY_TOC_TEXT_FONT);
  usPosY = AIM_HISTORY_CONTENTBUTTON_Y;
  for (i = 0; i < NUM_AIM_HISTORY_PAGES; i++) {
    uiStartLoc = AIM_HISTORY_LINE_SIZE * ubLocInFile[i];
    LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);

    usWidth = StringPixLength(sText, AIM_HISTORY_TOC_TEXT_FONT);

    // if the mouse regions havent been inited, init them
    if (!gfInToc) {
      // Mouse region for the history toc buttons
      MSYS_DefineRegion(addressof(gSelectedHistoryTocMenuRegion[i]), AIM_HISTORY_TOC_X, usPosY, (AIM_HISTORY_TOC_X + AIM_CONTENTBUTTON_WIDTH), (usPosY + AIM_CONTENTBUTTON_HEIGHT), MSYS_PRIORITY_HIGH, CURSOR_WWW, MSYS_NO_CALLBACK, SelectHistoryTocMenuRegionCallBack);
      MSYS_AddRegion(addressof(gSelectedHistoryTocMenuRegion[i]));
      MSYS_SetRegionUserData(addressof(gSelectedHistoryTocMenuRegion[i]), 0, i + 1);
    }

    BltVideoObject(FRAME_BUFFER, hContentButtonHandle, 0, AIM_HISTORY_TOC_X, usPosY, VO_BLT_SRCTRANSPARENCY, NULL);
    DrawTextToScreen(sText, AIM_HISTORY_TOC_X, (usPosY + AIM_HISTORY_TOC_Y), AIM_CONTENTBUTTON_WIDTH, AIM_HISTORY_TOC_TEXT_FONT, AIM_HISTORY_TOC_TEXT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

    usPosY += AIM_HISTORY_TOC_GAP_Y;
  }
  gfInToc = TRUE;
  return TRUE;
}

function ExitTocMenu(): BOOLEAN {
  let i: UINT16;

  if (gfInToc) {
    gfInToc = FALSE;
    for (i = 0; i < NUM_AIM_HISTORY_PAGES; i++)
      MSYS_RemoveRegion(addressof(gSelectedHistoryTocMenuRegion[i]));
  }

  return TRUE;
}

function SelectHistoryTocMenuRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (gfInToc) {
    if (iReason & MSYS_CALLBACK_REASON_INIT) {
    } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      gubCurPageNum = MSYS_GetRegionUserData(pRegion, 0);
      ChangingAimHistorySubPage(gubCurPageNum);

      ExitTocMenu();
      ResetAimHistoryButtons();
      //			RenderAimHistory();
      DisableAimHistoryButton();
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    }
  }
}

function BtnHistoryMenuButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let ubRetValue: UINT8 = MSYS_GetBtnUserData(btn, 0);
  gubAimHistoryMenuButtonDown = 255;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;

    gubAimHistoryMenuButtonDown = ubRetValue;

    InvalidateRegion(AIM_HISTORY_MENU_X, AIM_HISTORY_MENU_Y, AIM_HISTORY_MENU_END_X, AIM_HISTORY_MENU_END_Y);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
      ResetAimHistoryButtons();

      if (ubRetValue == 1) {
        if (gubCurPageNum > 0) {
          gubCurPageNum--;
          ChangingAimHistorySubPage(gubCurPageNum);

          //						RenderAimHistory();
          ResetAimHistoryButtons();
        } else
          btn.value.uiFlags |= (BUTTON_CLICKED_ON);
      }

      // Home Page
      else if (ubRetValue == 2) {
        guiCurrentLaptopMode = LAPTOP_MODE_AIM;
      }
      // Company policies
      else if (ubRetValue == 3) {
        guiCurrentLaptopMode = LAPTOP_MODE_AIM_MEMBERS_ARCHIVES;
      }
      // Next Page
      else if (ubRetValue == 4) {
        if (gubCurPageNum < NUM_AIM_HISTORY_PAGES) {
          gubCurPageNum++;
          ChangingAimHistorySubPage(gubCurPageNum);

          if (gfInToc) {
            ExitTocMenu();
          }
          //						RenderAimHistory();
        } else
          btn.value.uiFlags |= (BUTTON_CLICKED_ON);
      }

      DisableAimHistoryButton();

      InvalidateRegion(AIM_HISTORY_MENU_X, AIM_HISTORY_MENU_Y, AIM_HISTORY_MENU_END_X, AIM_HISTORY_MENU_END_Y);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

    DisableAimHistoryButton();

    InvalidateRegion(AIM_HISTORY_MENU_X, AIM_HISTORY_MENU_Y, AIM_HISTORY_MENU_END_X, AIM_HISTORY_MENU_END_Y);
  }
}

function ResetAimHistoryButtons(): void {
  let i: int = 0;

  for (i = 0; i < AIM_HISTORY_MENU_BUTTON_AMOUNT; i++) {
    ButtonList[guiHistoryMenuButton[i]].value.uiFlags &= ~BUTTON_CLICKED_ON;
  }
}

function DisableAimHistoryButton(): void {
  if (gfExitingAimHistory == TRUE)
    return;

  if ((gubCurPageNum == 0)) {
    ButtonList[guiHistoryMenuButton[0]].value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if ((gubCurPageNum == 5)) {
    ButtonList[guiHistoryMenuButton[AIM_HISTORY_MENU_BUTTON_AMOUNT - 1]].value.uiFlags |= (BUTTON_CLICKED_ON);
  }
}

function ChangingAimHistorySubPage(ubSubPageNumber: UINT8): void {
  fLoadPendingFlag = TRUE;

  if (AimHistorySubPagesVisitedFlag[ubSubPageNumber] == FALSE) {
    fConnectingToSubPage = TRUE;
    fFastLoadFlag = FALSE;

    AimHistorySubPagesVisitedFlag[ubSubPageNumber] = TRUE;
  } else {
    fConnectingToSubPage = TRUE;
    fFastLoadFlag = TRUE;
  }
}
