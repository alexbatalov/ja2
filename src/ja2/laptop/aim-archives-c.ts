const AIM_ALUMNI_NAME_FILE = "BINARYDATA\\AlumName.edt";
const AIM_ALUMNI_FILE = "BINARYDATA\\Alumni.edt";

const AIM_ALUMNI_TITLE_FONT = () => FONT14ARIAL();
const AIM_ALUMNI_TITLE_COLOR = AIM_GREEN;

const AIM_ALUMNI_POPUP_FONT = () => FONT10ARIAL();
const AIM_ALUMNI_POPUP_COLOR = FONT_MCOLOR_WHITE;

const AIM_ALUMNI_POPUP_NAME_FONT = () => FONT12ARIAL();
const AIM_ALUMNI_POPUP_NAME_COLOR = FONT_MCOLOR_WHITE;

const AIM_ALUMNI_NAME_FONT = () => FONT12ARIAL();
const AIM_ALUMNI_NAME_COLOR = FONT_MCOLOR_WHITE;
const AIM_ALUMNI_PAGE_FONT = () => FONT14ARIAL();
const AIM_ALUMNI_PAGE_COLOR_UP = FONT_MCOLOR_DKWHITE;
const AIM_ALUMNI_PAGE_COLOR_DOWN = 138;

const AIM_ALUMNI_NAME_LINESIZE = 80 * 2;
const AIM_ALUMNI_ALUMNI_LINESIZE = 7 * 80 * 2;

const AIM_ALUMNI_NUM_FACE_COLS = 5;
const AIM_ALUMNI_NUM_FACE_ROWS = 4;
const MAX_NUMBER_OLD_MERCS_ON_PAGE = AIM_ALUMNI_NUM_FACE_ROWS *AIM_ALUMNI_NUM_FACE_COLS;

const AIM_ALUMNI_START_GRID_X = LAPTOP_SCREEN_UL_X + 37;
const AIM_ALUMNI_START_GRID_Y = LAPTOP_SCREEN_WEB_UL_Y + 68;

const AIM_ALUMNI_GRID_OFFSET_X = 90;
const AIM_ALUMNI_GRID_OFFSET_Y = 72;

const AIM_ALUMNI_ALUMNI_FRAME_WIDTH = 66;
const AIM_ALUMNI_ALUMNI_FRAME_HEIGHT = 64;

const AIM_ALUMNI_ALUMNI_FACE_WIDTH = 56;
const AIM_ALUMNI_ALUMNI_FACE_HEIGHT = 50;

const AIM_ALUMNI_NAME_OFFSET_X = 5;
const AIM_ALUMNI_NAME_OFFSET_Y = 55;
const AIM_ALUMNI_NAME_WIDTH = AIM_ALUMNI_ALUMNI_FRAME_WIDTH - AIM_ALUMNI_NAME_OFFSET_X * 2;

const AIM_ALUMNI_PAGE1_X = LAPTOP_SCREEN_UL_X + 100;
const AIM_ALUMNI_PAGE1_Y = LAPTOP_SCREEN_WEB_UL_Y + 357;
const AIM_ALUMNI_PAGE_GAP = BOTTOM_BUTTON_START_WIDTH + 25;

const AIM_ALUMNI_PAGE_END_X = AIM_ALUMNI_PAGE1_X + (BOTTOM_BUTTON_START_WIDTH + BOTTOM_BUTTON_START_WIDTH) * 3;
const AIM_ALUMNI_PAGE_END_Y = AIM_ALUMNI_PAGE1_Y + BOTTOM_BUTTON_START_HEIGHT;

const AIM_ALUMNI_TITLE_X = IMAGE_OFFSET_X + 149;
const AIM_ALUMNI_TITLE_Y = AIM_SYMBOL_Y + AIM_SYMBOL_SIZE_Y; // + 2
const AIM_ALUMNI_TITLE_WIDTH = AIM_SYMBOL_WIDTH;

const AIM_POPUP_WIDTH = 309;
const AIM_POPUP_TEXT_WIDTH = 296;
const AIM_POPUP_SECTION_HEIGHT = 9;

const AIM_POPUP_X = LAPTOP_SCREEN_UL_X + (500 - AIM_POPUP_WIDTH) / 2;
const AIM_POPUP_Y = 120 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_POPUP_SHADOW_GAP = 4;

const AIM_POPUP_TEXT_X = AIM_POPUP_X;

const AIM_ALUMNI_FACE_PANEL_X = AIM_POPUP_X + 6;
const AIM_ALUMNI_FACE_PANEL_Y = AIM_POPUP_Y + 6;
const AIM_ALUMNI_FACE_PANEL_WIDTH = 58;
const AIM_ALUMNI_FACE_PANEL_HEIGHT = 52;

const AIM_ALUMNI_POPUP_NAME_X = AIM_ALUMNI_FACE_PANEL_X + AIM_ALUMNI_FACE_PANEL_WIDTH + 10;
const AIM_ALUMNI_POPUP_NAME_Y = AIM_ALUMNI_FACE_PANEL_Y + 20;

const AIM_ALUMNI_POPUP_DESC_X = AIM_POPUP_X + 8;
const AIM_ALUMNI_POPUP_DESC_Y = AIM_ALUMNI_FACE_PANEL_Y + AIM_ALUMNI_FACE_PANEL_HEIGHT + 5;

const AIM_ALUMNI_DONE_X = AIM_POPUP_X + AIM_POPUP_WIDTH - AIM_ALUMNI_DONE_WIDTH - 7;
const AIM_ALUMNI_DONE_WIDTH = 36;
const AIM_ALUMNI_DONE_HEIGHT = 16;

const AIM_ALUMNI_NAME_SIZE = 80 * 2;
const AIM_ALUMNI_DECRIPTION_SIZE = 80 * 7 * 2;
const AIM_ALUMNI_FILE_RECORD_SIZE = 80 * 8 * 2;
//#define		AIM_ALUMNI_FILE_RECORD_SIZE			80 * 7 * 2
const AIM_ALUMNI_FULL_NAME_SIZE = 80 * 2;

let guiAlumniFrame: UINT32;
let guiOldAim: UINT32;
let guiPageButtons: UINT32;
let guiAlumniPopUp: UINT32;
let guiPopUpPic: UINT32;
let guiDoneButton: UINT32;

let gubPageNum: UINT8;
let gunAlumniButtonDown: UINT8 = 255;
let gfExitingAimArchives: BOOLEAN;
let gubDrawOldMerc: UINT8;
let gfDrawPopUpBox: UINT8 = FALSE;
let gfDestroyPopUpBox: BOOLEAN;
let gfFaceMouseRegionsActive: BOOLEAN;
// BOOLEAN		gfDestroyDoneRegion;
let gfReDrawScreen: BOOLEAN = FALSE;

let AimArchivesSubPagesVisitedFlag: BOOLEAN[] /* [3] */ = [
  0,
  0,
  0,
];

// Mouse Regions

// Face regions
let gMercAlumniFaceMouseRegions: MOUSE_REGION[] /* [MAX_NUMBER_OLD_MERCS_ON_PAGE] */;

// Done region
let gDoneRegion: MOUSE_REGION;

let guiAlumniPageButton: UINT32[] /* [3] */;
let guiAlumniPageButtonImage: INT32;

function GameInitAimArchives(): void {
}

function EnterInitAimArchives(): void {
  gfDrawPopUpBox = FALSE;
  gfDestroyPopUpBox = FALSE;

  memset(&AimArchivesSubPagesVisitedFlag, 0, 3);
  AimArchivesSubPagesVisitedFlag[0] = TRUE;
}

function EnterAimArchives(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let usPosX: UINT16;
  let i: UINT16;

  gfExitingAimArchives = FALSE;
  //	gubDrawOldMerc = 255;
  gfDrawPopUpBox = FALSE;
  gfDestroyPopUpBox = FALSE;

  InitAimDefaults();
  InitAimMenuBar();

  gubPageNum = giCurrentSubPage;

  // load the Alumni Frame and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\AlumniFrame.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiAlumniFrame));

  // load the 1st set of faces and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Old_Aim.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiOldAim));

  // load the Bottom Buttons graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BottomButton.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiPageButtons));

  // load the PopupPic graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\PopupPicFrame.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiPopUpPic));

  // load the AlumniPopUp graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\AlumniPopUp.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiAlumniPopUp));

  // load the Done Button graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\DoneButton.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiDoneButton));

  InitAlumniFaceRegions();

  // Load graphic for buttons
  guiAlumniPageButtonImage = LoadButtonImage("LAPTOP\\BottomButtons2.sti", -1, 0, -1, 1, -1);

  usPosX = AIM_ALUMNI_PAGE1_X;
  for (i = 0; i < 3; i++) {
    guiAlumniPageButton[i] = CreateIconAndTextButton(guiAlumniPageButtonImage, AimAlumniText[i], AIM_ALUMNI_PAGE_FONT, AIM_ALUMNI_PAGE_COLOR_UP, DEFAULT_SHADOW, AIM_ALUMNI_PAGE_COLOR_DOWN, DEFAULT_SHADOW, TEXT_CJUSTIFIED, usPosX, AIM_ALUMNI_PAGE1_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK, BtnAlumniPageButtonCallback);
    SetButtonCursor(guiAlumniPageButton[i], CURSOR_WWW);
    MSYS_SetBtnUserData(guiAlumniPageButton[i], 0, i);

    usPosX += AIM_ALUMNI_PAGE_GAP;
  }

  DisableAimArchiveButton();
  RenderAimArchives();
  return TRUE;
}

function ExitAimArchives(): void {
  let i: UINT16;

  gfExitingAimArchives = TRUE;

  DeleteVideoObjectFromIndex(guiAlumniFrame);
  DeleteVideoObjectFromIndex(guiOldAim);
  DeleteVideoObjectFromIndex(guiAlumniPopUp);
  DeleteVideoObjectFromIndex(guiPopUpPic);
  DeleteVideoObjectFromIndex(guiDoneButton);

  RemoveAimAlumniFaceRegion();

  UnloadButtonImage(guiAlumniPageButtonImage);
  for (i = 0; i < 3; i++)
    RemoveButton(guiAlumniPageButton[i]);

  RemoveAimDefaults();
  ExitAimMenuBar();
  giCurrentSubPage = gubPageNum;

  CreateDestroyDoneMouseRegion(0);
  gfDestroyPopUpBox = FALSE;
  gfDrawPopUpBox = FALSE;
}

function HandleAimArchives(): void {
  if (gfReDrawScreen) {
    //		RenderAimArchives();
    fPausedReDrawScreenFlag = TRUE;

    gfReDrawScreen = FALSE;
  }
  if (gfDestroyPopUpBox) {
    gfDestroyPopUpBox = FALSE;

    CreateDestroyDoneMouseRegion(0);
    InitAlumniFaceRegions();
    gfDestroyPopUpBox = FALSE;
  }
}

function RenderAimArchives(): void {
  let hFrameHandle: HVOBJECT;
  let hFaceHandle: HVOBJECT;
  //  HVOBJECT	hBottomButtonHandle;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let x: UINT16;
  let y: UINT16;
  let i: UINT16 = 0;
  let ubNumRows: UINT8 = 0;
  let uiStartLoc: UINT32 = 0;
  let sText: wchar_t[] /* [400] */;

  DrawAimDefaults();
  DisableAimButton();

  // Draw Link Title
  DrawTextToScreen(AimAlumniText[AIM_ALUMNI_ALUMNI], AIM_ALUMNI_TITLE_X, AIM_ALUMNI_TITLE_Y, AIM_ALUMNI_TITLE_WIDTH, AIM_ALUMNI_TITLE_FONT, AIM_ALUMNI_TITLE_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Draw the mug shot border and face
  GetVideoObject(&hFrameHandle, guiAlumniFrame);
  GetVideoObject(&hFaceHandle, guiOldAim);

  switch (gubPageNum) {
    case 0:
      ubNumRows = AIM_ALUMNI_NUM_FACE_ROWS;
      i = 0;
      break;
    case 1:
      ubNumRows = AIM_ALUMNI_NUM_FACE_ROWS;
      i = 20;
      break;
    case 2:
      ubNumRows = 2;
      i = 40;
      break;
    default:
      Assert(0);
      break;
  }

  usPosX = AIM_ALUMNI_START_GRID_X;
  usPosY = AIM_ALUMNI_START_GRID_Y;
  for (y = 0; y < ubNumRows; y++) {
    for (x = 0; x < AIM_ALUMNI_NUM_FACE_COLS; x++) {
      // Blt face to screen
      BltVideoObject(FRAME_BUFFER, hFaceHandle, i, usPosX + 4, usPosY + 4, VO_BLT_SRCTRANSPARENCY, NULL);

      // Blt the alumni frame background
      BltVideoObject(FRAME_BUFFER, hFrameHandle, 0, usPosX, usPosY, VO_BLT_SRCTRANSPARENCY, NULL);

      // Display the merc's name
      uiStartLoc = AIM_ALUMNI_NAME_LINESIZE * i;
      LoadEncryptedDataFromFile(AIM_ALUMNI_NAME_FILE, sText, uiStartLoc, AIM_ALUMNI_NAME_SIZE);
      DrawTextToScreen(sText, (usPosX + AIM_ALUMNI_NAME_OFFSET_X), (usPosY + AIM_ALUMNI_NAME_OFFSET_Y), AIM_ALUMNI_NAME_WIDTH, AIM_ALUMNI_NAME_FONT, AIM_ALUMNI_NAME_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

      usPosX += AIM_ALUMNI_GRID_OFFSET_X;
      i++;
    }
    usPosX = AIM_ALUMNI_START_GRID_X;
    usPosY += AIM_ALUMNI_GRID_OFFSET_Y;
  }

  // the 3rd page now has an additional row with 1 merc on it, so add a new row
  if (gubPageNum == 2) {
    // Blt face to screen
    BltVideoObject(FRAME_BUFFER, hFaceHandle, i, usPosX + 4, usPosY + 4, VO_BLT_SRCTRANSPARENCY, NULL);

    // Blt the alumni frame background
    BltVideoObject(FRAME_BUFFER, hFrameHandle, 0, usPosX, usPosY, VO_BLT_SRCTRANSPARENCY, NULL);

    // Display the merc's name
    uiStartLoc = AIM_ALUMNI_NAME_LINESIZE * i;
    LoadEncryptedDataFromFile(AIM_ALUMNI_NAME_FILE, sText, uiStartLoc, AIM_ALUMNI_NAME_SIZE);
    DrawTextToScreen(sText, (usPosX + AIM_ALUMNI_NAME_OFFSET_X), (usPosY + AIM_ALUMNI_NAME_OFFSET_Y), AIM_ALUMNI_NAME_WIDTH, AIM_ALUMNI_NAME_FONT, AIM_ALUMNI_NAME_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

    usPosX += AIM_ALUMNI_GRID_OFFSET_X;
  }

  //	GetVideoObject(&hBottomButtonHandle, guiPageButtons);
  usPosX = AIM_ALUMNI_PAGE1_X;

  if (gfDrawPopUpBox) {
    DisplayAlumniOldMercPopUp();
    RemoveAimAlumniFaceRegion();
  }

  MarkButtonsDirty();

  RenderWWWProgramTitleBar();

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function SelectAlumniFaceRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfDrawPopUpBox = TRUE;
    gfReDrawScreen = TRUE;

    gubDrawOldMerc = MSYS_GetRegionUserData(pRegion, 0);
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function BtnAlumniPageButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let ubRetValue: UINT8 = MSYS_GetBtnUserData(btn, 0);
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;

    gunAlumniButtonDown = ubRetValue;

    InvalidateRegion(AIM_ALUMNI_PAGE1_X, AIM_ALUMNI_PAGE1_Y, AIM_ALUMNI_PAGE_END_X, AIM_ALUMNI_PAGE_END_Y);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      RemoveAimAlumniFaceRegion();

      ChangingAimArchiveSubPage(ubRetValue);

      gubPageNum = ubRetValue;

      gfReDrawScreen = TRUE;

      gfDestroyPopUpBox = TRUE;

      gunAlumniButtonDown = 255;
      ResetAimArchiveButtons();
      DisableAimArchiveButton();
      gfDrawPopUpBox = FALSE;

      InvalidateRegion(AIM_ALUMNI_PAGE1_X, AIM_ALUMNI_PAGE1_Y, AIM_ALUMNI_PAGE_END_X, AIM_ALUMNI_PAGE_END_Y);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    gunAlumniButtonDown = 255;
    DisableAimArchiveButton();
    InvalidateRegion(AIM_ALUMNI_PAGE1_X, AIM_ALUMNI_PAGE1_Y, AIM_ALUMNI_PAGE_END_X, AIM_ALUMNI_PAGE_END_Y);
  }
}

function ResetAimArchiveButtons(): void {
  let i: int = 0;

  for (i = 0; i < 3; i++) {
    ButtonList[guiAlumniPageButton[i]].value.uiFlags &= ~BUTTON_CLICKED_ON;
  }
}

function DisableAimArchiveButton(): void {
  if (gfExitingAimArchives == TRUE)
    return;

  if ((gubPageNum == 0)) {
    ButtonList[guiAlumniPageButton[0]].value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (gubPageNum == 1) {
    ButtonList[guiAlumniPageButton[1]].value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if (gubPageNum == 2) {
    ButtonList[guiAlumniPageButton[2]].value.uiFlags |= (BUTTON_CLICKED_ON);
  }
}

function DisplayAlumniOldMercPopUp(): void {
  let i: UINT8;
  let ubNumLines: UINT8 = 11; // 17
  let usPosY: UINT16;
  let usTextPosY: UINT16;
  let ubFontHeight: UINT8;
  let ubNumDescLines: UINT8;
  let hAlumniPopUpHandle: HVOBJECT;
  let hDoneHandle: HVOBJECT;
  let hFacePaneHandle: HVOBJECT;
  let hFaceHandle: HVOBJECT;
  //	WRAPPED_STRING *pFirstWrappedString, *pTempWrappedString;
  let usHeight: UINT16 = GetFontHeight(AIM_ALUMNI_POPUP_FONT);
  let sName: wchar_t[] /* [AIM_ALUMNI_NAME_SIZE] */;
  let sDesc: wchar_t[] /* [AIM_ALUMNI_DECRIPTION_SIZE] */;
  let uiStartLoc: UINT32;
  let usStringPixLength: UINT16;

  GetVideoObject(&hAlumniPopUpHandle, guiAlumniPopUp);
  GetVideoObject(&hDoneHandle, guiDoneButton);
  GetVideoObject(&hFacePaneHandle, guiPopUpPic);
  GetVideoObject(&hFaceHandle, guiOldAim);

  ubFontHeight = GetFontHeight(AIM_ALUMNI_POPUP_FONT);

  // Load the description
  uiStartLoc = AIM_ALUMNI_FILE_RECORD_SIZE * gubDrawOldMerc + AIM_ALUMNI_FULL_NAME_SIZE;
  LoadEncryptedDataFromFile(AIM_ALUMNI_FILE, sDesc, uiStartLoc, AIM_ALUMNI_DECRIPTION_SIZE);

  usStringPixLength = StringPixLength(sDesc, AIM_ALUMNI_POPUP_FONT);
  ubNumDescLines = (usStringPixLength / AIM_POPUP_TEXT_WIDTH);

  ubNumLines += ubNumDescLines;

  usTextPosY = AIM_POPUP_Y + 5;
  usPosY = AIM_POPUP_Y;

  // draw top line of the popup background
  ShadowVideoSurfaceRect(FRAME_BUFFER, AIM_POPUP_X + AIM_POPUP_SHADOW_GAP, usPosY + AIM_POPUP_SHADOW_GAP, AIM_POPUP_X + AIM_POPUP_WIDTH + AIM_POPUP_SHADOW_GAP, usPosY + AIM_POPUP_SECTION_HEIGHT + AIM_POPUP_SHADOW_GAP - 1);
  BltVideoObject(FRAME_BUFFER, hAlumniPopUpHandle, 0, AIM_POPUP_X, usPosY, VO_BLT_SRCTRANSPARENCY, NULL);
  // draw mid section of the popup background
  usPosY += AIM_POPUP_SECTION_HEIGHT;
  for (i = 0; i < ubNumLines; i++) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, AIM_POPUP_X + AIM_POPUP_SHADOW_GAP, usPosY + AIM_POPUP_SHADOW_GAP, AIM_POPUP_X + AIM_POPUP_WIDTH + AIM_POPUP_SHADOW_GAP, usPosY + AIM_POPUP_SECTION_HEIGHT + AIM_POPUP_SHADOW_GAP - 1);
    BltVideoObject(FRAME_BUFFER, hAlumniPopUpHandle, 1, AIM_POPUP_X, usPosY, VO_BLT_SRCTRANSPARENCY, NULL);
    usPosY += AIM_POPUP_SECTION_HEIGHT;
  }
  // draw the bottom line and done button
  ShadowVideoSurfaceRect(FRAME_BUFFER, AIM_POPUP_X + AIM_POPUP_SHADOW_GAP, usPosY + AIM_POPUP_SHADOW_GAP, AIM_POPUP_X + AIM_POPUP_WIDTH + AIM_POPUP_SHADOW_GAP, usPosY + AIM_POPUP_SECTION_HEIGHT + AIM_POPUP_SHADOW_GAP - 1);
  BltVideoObject(FRAME_BUFFER, hAlumniPopUpHandle, 2, AIM_POPUP_X, usPosY, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(FRAME_BUFFER, hDoneHandle, 0, AIM_ALUMNI_DONE_X, usPosY - AIM_ALUMNI_DONE_HEIGHT, VO_BLT_SRCTRANSPARENCY, NULL);
  DrawTextToScreen(AimAlumniText[AIM_ALUMNI_DONE], (AIM_ALUMNI_DONE_X + 1), (usPosY - AIM_ALUMNI_DONE_HEIGHT + 3), AIM_ALUMNI_DONE_WIDTH, AIM_ALUMNI_POPUP_NAME_FONT, AIM_ALUMNI_POPUP_NAME_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  CreateDestroyDoneMouseRegion(usPosY);

  /// blt face panale and the mecs fce
  BltVideoObject(FRAME_BUFFER, hFacePaneHandle, 0, AIM_ALUMNI_FACE_PANEL_X, AIM_ALUMNI_FACE_PANEL_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  BltVideoObject(FRAME_BUFFER, hFaceHandle, gubDrawOldMerc, AIM_ALUMNI_FACE_PANEL_X + 1, AIM_ALUMNI_FACE_PANEL_Y + 1, VO_BLT_SRCTRANSPARENCY, NULL);

  // Load and display the name
  //	uiStartLoc = AIM_ALUMNI_NAME_SIZE * gubDrawOldMerc;
  //	LoadEncryptedDataFromFile(AIM_ALUMNI_NAME_FILE, sName, uiStartLoc, AIM_ALUMNI_NAME_SIZE);
  uiStartLoc = AIM_ALUMNI_FILE_RECORD_SIZE * gubDrawOldMerc;
  LoadEncryptedDataFromFile(AIM_ALUMNI_FILE, sName, uiStartLoc, AIM_ALUMNI_FULL_NAME_SIZE);

  DrawTextToScreen(sName, AIM_ALUMNI_POPUP_NAME_X, AIM_ALUMNI_POPUP_NAME_Y, 0, AIM_ALUMNI_POPUP_NAME_FONT, AIM_ALUMNI_POPUP_NAME_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the description
  DisplayWrappedString(AIM_ALUMNI_POPUP_DESC_X, AIM_ALUMNI_POPUP_DESC_Y, AIM_POPUP_TEXT_WIDTH, 2, AIM_ALUMNI_POPUP_FONT, AIM_ALUMNI_POPUP_COLOR, sDesc, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function DestroyPopUpBox(): void {
  gfDestroyPopUpBox = FALSE;
  RenderAimArchives();
}

function InitAlumniFaceRegions(): void {
  let usPosX: UINT16;
  let usPosY: UINT16;
  let i: UINT16;
  let x: UINT16;
  let y: UINT16;
  let usNumRows: UINT16;

  if (gfFaceMouseRegionsActive)
    return;

  if (gubPageNum == 2)
    usNumRows = 2;
  else
    usNumRows = AIM_ALUMNI_NUM_FACE_ROWS;

  usPosX = AIM_ALUMNI_START_GRID_X;
  usPosY = AIM_ALUMNI_START_GRID_Y;
  i = 0;
  for (y = 0; y < usNumRows; y++) {
    for (x = 0; x < AIM_ALUMNI_NUM_FACE_COLS; x++) {
      MSYS_DefineRegion(&gMercAlumniFaceMouseRegions[i], usPosX, usPosY, (usPosX + AIM_ALUMNI_ALUMNI_FACE_WIDTH), (usPosY + AIM_ALUMNI_ALUMNI_FACE_HEIGHT), MSYS_PRIORITY_HIGH, CURSOR_WWW, MSYS_NO_CALLBACK, SelectAlumniFaceRegionCallBack);
      // Add region
      MSYS_AddRegion(&gMercAlumniFaceMouseRegions[i]);
      MSYS_SetRegionUserData(&gMercAlumniFaceMouseRegions[i], 0, i + (20 * gubPageNum));

      usPosX += AIM_ALUMNI_GRID_OFFSET_X;
      i++;
    }
    usPosX = AIM_ALUMNI_START_GRID_X;
    usPosY += AIM_ALUMNI_GRID_OFFSET_Y;
  }

  // the 3rd page now has an additional row with 1 merc on it, so add a new row
  if (gubPageNum == 2) {
    MSYS_DefineRegion(&gMercAlumniFaceMouseRegions[i], usPosX, usPosY, (usPosX + AIM_ALUMNI_ALUMNI_FACE_WIDTH), (usPosY + AIM_ALUMNI_ALUMNI_FACE_HEIGHT), MSYS_PRIORITY_HIGH, CURSOR_WWW, MSYS_NO_CALLBACK, SelectAlumniFaceRegionCallBack);
    // Add region
    MSYS_AddRegion(&gMercAlumniFaceMouseRegions[i]);
    MSYS_SetRegionUserData(&gMercAlumniFaceMouseRegions[i], 0, i + (20 * gubPageNum));
  }

  gfFaceMouseRegionsActive = TRUE;
}

function RemoveAimAlumniFaceRegion(): void {
  let i: UINT16;
  let usNumber: UINT16 = 0;

  if (!gfFaceMouseRegionsActive)
    return;

  switch (gubPageNum) {
    case 0:
      usNumber = AIM_ALUMNI_NUM_FACE_ROWS * AIM_ALUMNI_NUM_FACE_COLS;
      break;
    case 1:
      usNumber = AIM_ALUMNI_NUM_FACE_ROWS * AIM_ALUMNI_NUM_FACE_COLS;
      break;
    case 2:
      usNumber = 2 * AIM_ALUMNI_NUM_FACE_COLS + 1;

    default:
      break;
  }

  for (i = 0; i < usNumber; i++) {
    MSYS_RemoveRegion(&gMercAlumniFaceMouseRegions[i]);
  }
  gfFaceMouseRegionsActive = FALSE;
}

function CreateDestroyDoneMouseRegion(usPosY: UINT16): void {
  /* static */ let DoneRegionCreated: BOOLEAN = FALSE;

  if ((!DoneRegionCreated) && (usPosY != 0)) {
    usPosY -= AIM_ALUMNI_DONE_HEIGHT;
    MSYS_DefineRegion(&gDoneRegion, AIM_ALUMNI_DONE_X - 2, usPosY, (AIM_ALUMNI_DONE_X - 2 + AIM_ALUMNI_DONE_WIDTH), (usPosY + AIM_ALUMNI_DONE_HEIGHT), MSYS_PRIORITY_HIGH, CURSOR_WWW, MSYS_NO_CALLBACK, SelectAlumniDoneRegionCallBack);
    // Add region
    MSYS_AddRegion(&gDoneRegion);
    DoneRegionCreated = TRUE;
  }

  if (DoneRegionCreated && usPosY == 0) {
    MSYS_RemoveRegion(&gDoneRegion);
    DoneRegionCreated = FALSE;
    //		gfDestroyDoneRegion = FALSE;
  }
}

function SelectAlumniDoneRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfDestroyPopUpBox = TRUE;
    gfDrawPopUpBox = FALSE;
    gfReDrawScreen = TRUE;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function ChangingAimArchiveSubPage(ubSubPageNumber: UINT8): void {
  fLoadPendingFlag = TRUE;

  if (AimArchivesSubPagesVisitedFlag[ubSubPageNumber] == FALSE) {
    fConnectingToSubPage = TRUE;
    fFastLoadFlag = FALSE;

    AimArchivesSubPagesVisitedFlag[ubSubPageNumber] = TRUE;
  } else {
    fConnectingToSubPage = TRUE;
    fFastLoadFlag = TRUE;
  }
}
