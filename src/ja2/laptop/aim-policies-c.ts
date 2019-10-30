namespace ja2 {

const NUM_AIM_POLICY_PAGES = 11;
const NUM_AIM_POLICY_TOC_BUTTONS = 9;
const AIMPOLICYFILE = "BINARYDATA\\AimPol.edt";
const AIM_POLICY_LINE_SIZE = 80 * 5 * 2; // 80 columns of 5 lines that are wide chars, 800 bytes total

const AIM_POLICY_TITLE_FONT = () => FONT14ARIAL();
const AIM_POLICY_TITLE_COLOR = AIM_GREEN;
const AIM_POLICY_TEXT_FONT = () => FONT10ARIAL();
const AIM_POLICY_TEXT_COLOR = FONT_MCOLOR_WHITE;
const AIM_POLICY_TOC_FONT = () => FONT12ARIAL();
const AIM_POLICY_TOC_COLOR = FONT_MCOLOR_WHITE;
const AIM_POLICY_TOC_TITLE_FONT = () => FONT12ARIAL();
const AIM_POLICY_TOC_TITLE_COLOR = FONT_MCOLOR_WHITE;
const AIM_POLICY_SUBTITLE_FONT = () => FONT12ARIAL();
const AIM_POLICY_SUBTITLE_COLOR = FONT_MCOLOR_WHITE;
const AIM_POLICY_AGREE_TOC_COLOR_ON = FONT_MCOLOR_WHITE;
const AIM_POLICY_AGREE_TOC_COLOR_OFF = FONT_MCOLOR_DKWHITE;

const AIM_POLICY_MENU_X = LAPTOP_SCREEN_UL_X + 40;
const AIM_POLICY_MENU_Y = 390 + LAPTOP_SCREEN_WEB_DELTA_Y;
const AIM_POLICY_MENU_BUTTON_AMOUNT = 4;
const AIM_POLICY_GAP_X = 40 + BOTTOM_BUTTON_START_WIDTH;

const AIM_POLICY_TITLE_X = IMAGE_OFFSET_X + 149;
const AIM_POLICY_TITLE_Y = AIM_SYMBOL_Y + AIM_SYMBOL_SIZE_Y + 11;
const AIM_POLICY_TITLE_WIDTH = AIM_SYMBOL_WIDTH;

const AIM_POLICY_TITLE_STATEMENT_WIDTH = 300;
const AIM_POLICY_TITLE_STATEMENT_X = IMAGE_OFFSET_X + (500 - AIM_POLICY_TITLE_STATEMENT_WIDTH) / 2 + 5; // 80
const AIM_POLICY_TITLE_STATEMENT_Y = AIM_SYMBOL_Y + AIM_SYMBOL_SIZE_Y + 75;

const AIM_POLICY_SUBTITLE_NUMBER = AIM_POLICY_TITLE_STATEMENT_X - 75;
const AIM_POLICY_SUBTITLE_X = AIM_POLICY_SUBTITLE_NUMBER + 20;
const AIM_POLICY_SUBTITLE_Y = 115 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_POLICY_PARAGRAPH_NUMBER = AIM_POLICY_SUBTITLE_X - 12;
const AIM_POLICY_PARAGRAPH_X = AIM_POLICY_PARAGRAPH_NUMBER + 23;
const AIM_POLICY_PARAGRAPH_Y = AIM_POLICY_SUBTITLE_Y + 20;
const AIM_POLICY_PARAGRAPH_WIDTH = 380;
const AIM_POLICY_PARAGRAPH_GAP = 6;
const AIM_POLICY_SUBPARAGRAPH_NUMBER = AIM_POLICY_PARAGRAPH_X;
const AIM_POLICY_SUBPARAGRAPH_X = AIM_POLICY_SUBPARAGRAPH_NUMBER + 25;

const AIM_POLICY_TOC_X = 259;
const AIM_POLICY_TOC_Y = AIM_POLICY_SUBTITLE_Y;
const AIM_POLICY_TOC_GAP_Y = 25;
const AIM_POLICY_TOC_TEXT_OFFSET_X = 5;
const AIM_POLICY_TOC_TEXT_OFFSET_Y = 5;

const AIM_POLICY_AGREEMENT_X = IMAGE_OFFSET_X + 150;
const AIM_POLICY_AGREEMENT_Y = 350 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_POLICY_DISAGREEMENT_X = AIM_POLICY_AGREEMENT_X + 125;
const AIM_POLICY_DISAGREEMENT_Y = AIM_POLICY_AGREEMENT_Y;

const AIM_POLICY_TOC_PAGE = 1;
const AIM_POLICY_LAST_PAGE = 10;

const AIM_POLICY_AGREE_PAGE = 0;

// These enums represent which paragraph they are located in the AimPol.edt file
const enum Enum68 {
  AIM_STATEMENT_OF_POLICY,
  AIM_STATEMENT_OF_POLICY_1,
  AIM_STATEMENT_OF_POLICY_2,

  DEFINITIONS,
  DEFINITIONS_1,
  DEFINITIONS_2,
  DEFINITIONS_3,
  DEFINITIONS_4,

  LENGTH_OF_ENGAGEMENT,
  LENGTH_OF_ENGAGEMENT_1,
  LENGTH_OF_ENGAGEMENT_1_1,
  LENGTH_OF_ENGAGEMENT_1_2,
  LENGTH_OF_ENGAGEMENT_1_3,
  LENGTH_OF_ENGAGEMENT_2,

  LOCATION_0F_ENGAGEMENT,
  LOCATION_0F_ENGAGEMENT_1,
  LOCATION_0F_ENGAGEMENT_2,
  LOCATION_0F_ENGAGEMENT_2_1,
  LOCATION_0F_ENGAGEMENT_2_2,
  LOCATION_0F_ENGAGEMENT_2_3,
  LOCATION_0F_ENGAGEMENT_2_4,
  LOCATION_0F_ENGAGEMENT_3,

  CONTRACT_EXTENSIONS,
  CONTRACT_EXTENSIONS_1,
  CONTRACT_EXTENSIONS_2,
  CONTRACT_EXTENSIONS_3,

  TERMS_OF_PAYMENT,
  TERMS_OF_PAYMENT_1,

  TERMS_OF_ENGAGEMENT,
  TERMS_OF_ENGAGEMENT_1,
  TERMS_OF_ENGAGEMENT_2A,
  TERMS_OF_ENGAGEMENT_2B,

  ENGAGEMENT_TERMINATION,
  ENGAGEMENT_TERMINATION_1,
  ENGAGEMENT_TERMINATION_1_1,
  ENGAGEMENT_TERMINATION_1_2,
  ENGAGEMENT_TERMINATION_1_3,

  EQUIPMENT_AND_INVENTORY,
  EQUIPMENT_AND_INVENTORY_1,
  EQUIPMENT_AND_INVENTORY_2,

  POLICY_MEDICAL,
  POLICY_MEDICAL_1,
  POLICY_MEDICAL_2,
  POLICY_MEDICAL_3A,
  POLICY_MEDICAL_3B,
  POLICY_MEDICAL_4,

  NUM_AIM_POLICY_LOCATIONS,
}

// Toc menu mouse regions
let gSelectedPolicyTocMenuRegion: MOUSE_REGION[] /* [NUM_AIM_POLICY_TOC_BUTTONS] */;

let guiPoliciesAgreeButton: UINT32[] /* [2] */;
let guiPoliciesButtonImage: INT32;

let guiPoliciesMenuButton: UINT32[] /* [AIM_POLICY_MENU_BUTTON_AMOUNT] */;
let guiPoliciesMenuButtonImage: INT32;

export let guiBottomButton: UINT32;
export let guiBottomButton2: UINT32;
export let gubCurPageNum: UINT8;
let gfInPolicyToc: boolean = false;
let gfInAgreementPage: boolean = false;
let gfAimPolicyMenuBarLoaded: boolean = false;
export let guiContentButton: UINT32;
let gfExitingPolicesAgreeButton: boolean;
let gubPoliciesAgreeButtonDown: UINT8;
let gubAimPolicyMenuButtonDown: UINT8 = 255;
let gfExitingAimPolicy: boolean;
let AimPoliciesSubPagesVisitedFlag: boolean[] /* [NUM_AIM_POLICY_PAGES] */;

export function GameInitAimPolicies(): void {
}

export function EnterInitAimPolicies(): void {
  memset(addressof(AimPoliciesSubPagesVisitedFlag), 0, NUM_AIM_POLICY_PAGES);
}

export function EnterAimPolicies(): boolean {
  let VObjectDesc: VOBJECT_DESC;

  InitAimDefaults();

  gubCurPageNum = giCurrentSubPage;

  gfAimPolicyMenuBarLoaded = false;
  gfExitingAimPolicy = false;

  gubPoliciesAgreeButtonDown = 255;
  gubAimPolicyMenuButtonDown = 255;

  if (gubCurPageNum != 0)
    InitAimPolicyMenuBar();

  gfInPolicyToc = false;

  // load the Bottom Buttons graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BottomButton.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBottomButton)));

  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BottomButton2.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBottomButton2)));

  // load the Content Buttons graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\ContentButton.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiContentButton)));

  RenderAimPolicies();
  return true;
}

export function ExitAimPolicies(): void {
  gfExitingAimPolicy = true;

  DeleteVideoObjectFromIndex(guiBottomButton);
  DeleteVideoObjectFromIndex(guiBottomButton2);
  DeleteVideoObjectFromIndex(guiContentButton);

  if (gfAimPolicyMenuBarLoaded)
    ExitAimPolicyMenuBar();

  if (gfInPolicyToc)
    ExitAimPolicyTocMenu();

  if (gfInAgreementPage)
    ExitAgreementButton();
  RemoveAimDefaults();

  giCurrentSubPage = gubCurPageNum;
}

export function HandleAimPolicies(): void {
  if ((gfAimPolicyMenuBarLoaded != true) && gubCurPageNum != 0) {
    InitAimPolicyMenuBar();
    //		RenderAimPolicies();
    fPausedReDrawScreenFlag = true;
  }
}

export function RenderAimPolicies(): void {
  let usNumPixles: UINT16;

  DrawAimDefaults();

  DisplayAimPolicyTitleText();

  if (gfInAgreementPage)
    ExitAgreementButton();

  switch (gubCurPageNum) {
    case 0:
      DisplayAimPolicyStatement();
      InitAgreementRegion();
      break;

    case 1:
      InitAimPolicyTocMenu();
      InitAimPolicyMenuBar();
      DisableAimPolicyButton();
      DrawAimPolicyMenu();
      break;

    case 2:
      // Display the Definitions title
      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.DEFINITIONS, 1.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.DEFINITIONS_1, 1.1) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.DEFINITIONS_2, 1.2) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.DEFINITIONS_3, 1.3) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.DEFINITIONS_4, 1.4);
      break;

    case 3:
      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.LENGTH_OF_ENGAGEMENT, 2.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.LENGTH_OF_ENGAGEMENT_1, 2.1) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.LENGTH_OF_ENGAGEMENT_1_1, 2.11) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.LENGTH_OF_ENGAGEMENT_1_2, 2.12) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.LENGTH_OF_ENGAGEMENT_1_3, 2.13) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.LENGTH_OF_ENGAGEMENT_2, 2.2) + AIM_POLICY_PARAGRAPH_GAP;
      break;

    case 4:
      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.LOCATION_0F_ENGAGEMENT, 3.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.LOCATION_0F_ENGAGEMENT_1, 3.1) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.LOCATION_0F_ENGAGEMENT_2, 3.2) + AIM_POLICY_PARAGRAPH_GAP;

      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.LOCATION_0F_ENGAGEMENT_2_1, 3.21) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.LOCATION_0F_ENGAGEMENT_2_2, 3.22) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.LOCATION_0F_ENGAGEMENT_2_3, 3.23) + AIM_POLICY_PARAGRAPH_GAP;
      //			usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, LOCATION_0F_ENGAGEMENT_2_4, (FLOAT)3.24) + AIM_POLICY_PARAGRAPH_GAP;

      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.LOCATION_0F_ENGAGEMENT_2_4, 3.3) + AIM_POLICY_PARAGRAPH_GAP;

      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.LOCATION_0F_ENGAGEMENT_3, 3.4) + AIM_POLICY_PARAGRAPH_GAP;
      break;

    case 5:
      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.CONTRACT_EXTENSIONS, 4.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.CONTRACT_EXTENSIONS_1, 4.1) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.CONTRACT_EXTENSIONS_2, 4.2) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.CONTRACT_EXTENSIONS_3, 4.3) + AIM_POLICY_PARAGRAPH_GAP;
      break;

    case 6:
      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.TERMS_OF_PAYMENT, 5.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.TERMS_OF_PAYMENT_1, 5.1) + AIM_POLICY_PARAGRAPH_GAP;
      break;

    case 7:
      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.TERMS_OF_ENGAGEMENT, 6.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.TERMS_OF_ENGAGEMENT_1, 6.1) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.TERMS_OF_ENGAGEMENT_2A, 6.2) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.TERMS_OF_ENGAGEMENT_2B, 0.0) + AIM_POLICY_PARAGRAPH_GAP;
      break;

    case 8:
      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.ENGAGEMENT_TERMINATION, 7.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.ENGAGEMENT_TERMINATION_1, 7.1) + AIM_POLICY_PARAGRAPH_GAP;

      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.ENGAGEMENT_TERMINATION_1_1, 7.11) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.ENGAGEMENT_TERMINATION_1_2, 7.12) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicySubParagraph(usNumPixles, Enum68.ENGAGEMENT_TERMINATION_1_3, 7.13) + AIM_POLICY_PARAGRAPH_GAP;
      break;

    case 9:
      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.EQUIPMENT_AND_INVENTORY, 8.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.EQUIPMENT_AND_INVENTORY_1, 8.1) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.EQUIPMENT_AND_INVENTORY_2, 8.2) + AIM_POLICY_PARAGRAPH_GAP;
      break;

    case 10:
      DisableAimPolicyButton();

      DisplayAimPolicyTitle(AIM_POLICY_SUBTITLE_Y, Enum68.POLICY_MEDICAL, 9.0);
      usNumPixles = AIM_POLICY_PARAGRAPH_Y;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.POLICY_MEDICAL_1, 9.1) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.POLICY_MEDICAL_2, 9.2) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.POLICY_MEDICAL_3A, 9.3) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.POLICY_MEDICAL_3B, 0.0) + AIM_POLICY_PARAGRAPH_GAP;
      usNumPixles += DisplayAimPolicyParagraph(usNumPixles, Enum68.POLICY_MEDICAL_4, 9.4) + AIM_POLICY_PARAGRAPH_GAP;
      break;
  }

  MarkButtonsDirty();

  RenderWWWProgramTitleBar();

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function InitAimPolicyMenuBar(): boolean {
  let i: UINT16;
  let usPosX: UINT16;

  if (gfAimPolicyMenuBarLoaded)
    return true;

  // Load graphic for buttons
  guiPoliciesMenuButtonImage = LoadButtonImage("LAPTOP\\BottomButtons2.sti", -1, 0, -1, 1, -1);

  usPosX = AIM_POLICY_MENU_X;
  for (i = 0; i < AIM_POLICY_MENU_BUTTON_AMOUNT; i++) {
    //		guiPoliciesMenuButton[i] = QuickCreateButton(guiPoliciesMenuButtonImage, usPosX, AIM_POLICY_MENU_Y,
    //																	BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
    //																	DEFAULT_MOVE_CALLBACK, (GUI_CALLBACK)BtnPoliciesMenuButtonCallback);
    //		SetButtonCursor(guiPoliciesMenuButton[i], CURSOR_WWW);
    //		MSYS_SetBtnUserData( guiPoliciesMenuButton[i], 0, i);

    guiPoliciesMenuButton[i] = CreateIconAndTextButton(guiPoliciesMenuButtonImage, AimPolicyText[i], FONT10ARIAL(), AIM_BUTTON_ON_COLOR, DEFAULT_SHADOW, AIM_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, usPosX, AIM_POLICY_MENU_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnPoliciesMenuButtonCallback);
    SetButtonCursor(guiPoliciesMenuButton[i], Enum317.CURSOR_WWW);
    MSYS_SetBtnUserData(guiPoliciesMenuButton[i], 0, i);

    usPosX += AIM_POLICY_GAP_X;
  }

  gfAimPolicyMenuBarLoaded = true;

  return true;
}

function ExitAimPolicyMenuBar(): boolean {
  let i: number;

  if (!gfAimPolicyMenuBarLoaded)
    return false;

  for (i = 0; i < AIM_POLICY_MENU_BUTTON_AMOUNT; i++)
    RemoveButton(guiPoliciesMenuButton[i]);

  UnloadButtonImage(guiPoliciesMenuButtonImage);

  gfAimPolicyMenuBarLoaded = false;

  return true;
}

function DrawAimPolicyMenu(): boolean {
  let i: UINT16;
  let usPosY: UINT16;
  let usHeight: UINT16;
  let uiStartLoc: UINT32 = 0;
  let sText: string /* wchar_t[400] */;
  let hContentButtonHandle: HVOBJECT;
  let ubLocInFile: UINT8[] /* [] */ = [
    Enum68.DEFINITIONS,
    Enum68.LENGTH_OF_ENGAGEMENT,
    Enum68.LOCATION_0F_ENGAGEMENT,
    Enum68.CONTRACT_EXTENSIONS,
    Enum68.TERMS_OF_PAYMENT,
    Enum68.TERMS_OF_ENGAGEMENT,
    Enum68.ENGAGEMENT_TERMINATION,
    Enum68.EQUIPMENT_AND_INVENTORY,
    Enum68.POLICY_MEDICAL,
  ];

  GetVideoObject(addressof(hContentButtonHandle), guiContentButton);

  usHeight = GetFontHeight(AIM_POLICY_TOC_FONT());
  usPosY = AIM_POLICY_TOC_Y;
  for (i = 0; i < NUM_AIM_POLICY_TOC_BUTTONS; i++) {
    BltVideoObject(FRAME_BUFFER, hContentButtonHandle, 0, AIM_POLICY_TOC_X, usPosY, VO_BLT_SRCTRANSPARENCY, null);

    uiStartLoc = AIM_POLICY_LINE_SIZE * ubLocInFile[i];
    LoadEncryptedDataFromFile(AIMPOLICYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);
    DrawTextToScreen(sText, AIM_POLICY_TOC_X + AIM_POLICY_TOC_TEXT_OFFSET_X, (usPosY + AIM_POLICY_TOC_TEXT_OFFSET_Y), AIM_CONTENTBUTTON_WIDTH, AIM_POLICY_TOC_FONT(), AIM_POLICY_TOC_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

    usPosY += AIM_POLICY_TOC_GAP_Y;
  }
  gfInPolicyToc = true;

  return true;
}

function InitAimPolicyTocMenu(): boolean {
  let i: UINT16;
  let usPosY: UINT16;
  let usHeight: UINT16;
  let uiStartLoc: UINT32 = 0;

  if (gfInPolicyToc)
    return true;

  usHeight = GetFontHeight(AIM_POLICY_TOC_FONT());
  usPosY = AIM_POLICY_TOC_Y;
  for (i = 0; i < NUM_AIM_POLICY_TOC_BUTTONS; i++) {
    // Mouse region for the toc buttons
    MSYS_DefineRegion(addressof(gSelectedPolicyTocMenuRegion[i]), AIM_POLICY_TOC_X, usPosY, (AIM_POLICY_TOC_X + AIM_CONTENTBUTTON_WIDTH), (usPosY + AIM_CONTENTBUTTON_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectPolicyTocMenuRegionCallBack);
    MSYS_AddRegion(addressof(gSelectedPolicyTocMenuRegion[i]));
    MSYS_SetRegionUserData(addressof(gSelectedPolicyTocMenuRegion[i]), 0, i + 2);

    usPosY += AIM_POLICY_TOC_GAP_Y;
  }
  gfInPolicyToc = true;

  return true;
}

function ExitAimPolicyTocMenu(): boolean {
  let i: UINT16;

  gfInPolicyToc = false;
  for (i = 0; i < NUM_AIM_POLICY_TOC_BUTTONS; i++)
    MSYS_RemoveRegion(addressof(gSelectedPolicyTocMenuRegion[i]));

  return true;
}

function SelectPolicyTocMenuRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (gfInPolicyToc) {
    if (iReason & MSYS_CALLBACK_REASON_INIT) {
    } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      gubCurPageNum = MSYS_GetRegionUserData(pRegion, 0);

      ChangingAimPoliciesSubPage(gubCurPageNum);

      ExitAimPolicyTocMenu();
      ResetAimPolicyButtons();
      DisableAimPolicyButton();
    } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    }
  }
}

function DisplayAimPolicyTitleText(): boolean {
  let sText: string /* wchar_t[400] */;
  let uiStartLoc: UINT32 = 0;

  // Load anfd display title
  uiStartLoc = AIM_POLICY_LINE_SIZE * Enum68.AIM_STATEMENT_OF_POLICY;
  LoadEncryptedDataFromFile(AIMPOLICYFILE, sText, uiStartLoc, AIM_POLICY_LINE_SIZE);

  if (gubCurPageNum == 0)
    DrawTextToScreen(sText, AIM_POLICY_TITLE_X, AIM_POLICY_TITLE_STATEMENT_Y - 25, AIM_POLICY_TITLE_WIDTH, AIM_POLICY_TITLE_FONT(), AIM_POLICY_TITLE_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  else
    DrawTextToScreen(sText, AIM_POLICY_TITLE_X, AIM_POLICY_TITLE_Y, AIM_POLICY_TITLE_WIDTH, AIM_POLICY_TITLE_FONT(), AIM_POLICY_TITLE_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  return true;
}

function DisplayAimPolicyStatement(): boolean {
  let sText: string /* wchar_t[400] */;
  let uiStartLoc: UINT32 = 0;
  let usNumPixels: UINT16;

  // load and display the statment of policies
  uiStartLoc = AIM_POLICY_LINE_SIZE * Enum68.AIM_STATEMENT_OF_POLICY_1;
  LoadEncryptedDataFromFile(AIMPOLICYFILE, sText, uiStartLoc, AIM_POLICY_LINE_SIZE);
  usNumPixels = DisplayWrappedString(AIM_POLICY_TITLE_STATEMENT_X, AIM_POLICY_TITLE_STATEMENT_Y, AIM_POLICY_TITLE_STATEMENT_WIDTH, 2, AIM_POLICY_TEXT_FONT(), AIM_POLICY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // load and display the statment of policies
  uiStartLoc = AIM_POLICY_LINE_SIZE * Enum68.AIM_STATEMENT_OF_POLICY_2;
  LoadEncryptedDataFromFile(AIMPOLICYFILE, sText, uiStartLoc, AIM_POLICY_LINE_SIZE);
  DisplayWrappedString(AIM_POLICY_TITLE_STATEMENT_X, (AIM_POLICY_TITLE_STATEMENT_Y + usNumPixels + 15), AIM_POLICY_TITLE_STATEMENT_WIDTH, 2, AIM_POLICY_TEXT_FONT(), AIM_POLICY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  return true;
}

function InitAgreementRegion(): boolean {
  let usPosX: UINT16;
  let i: UINT16;

  gfExitingPolicesAgreeButton = false;

  // Load graphic for buttons
  guiPoliciesButtonImage = LoadButtonImage("LAPTOP\\BottomButtons2.sti", -1, 0, -1, 1, -1);

  usPosX = AIM_POLICY_AGREEMENT_X;
  for (i = 0; i < 2; i++) {
    //		guiPoliciesAgreeButton[i] = QuickCreateButton(guiPoliciesButtonImage, usPosX, AIM_POLICY_AGREEMENT_Y,
    //																	BUTTON_TOGGLE, MSYS_PRIORITY_HIGH,
    //																	BUTTON_NO_CALLBACK, (GUI_CALLBACK)BtnPoliciesAgreeButtonCallback);
    //		SetButtonCursor(guiPoliciesAgreeButton[i], CURSOR_WWW);
    //		MSYS_SetBtnUserData( guiPoliciesAgreeButton[i], 0, i);

    guiPoliciesAgreeButton[i] = CreateIconAndTextButton(guiPoliciesButtonImage, AimPolicyText[i + Enum353.AIM_POLICIES_DISAGREE], AIM_POLICY_TOC_FONT(), AIM_POLICY_AGREE_TOC_COLOR_ON, DEFAULT_SHADOW, AIM_POLICY_AGREE_TOC_COLOR_OFF, DEFAULT_SHADOW, TEXT_CJUSTIFIED, usPosX, AIM_POLICY_AGREEMENT_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnPoliciesAgreeButtonCallback);
    SetButtonCursor(guiPoliciesAgreeButton[i], Enum317.CURSOR_WWW);
    MSYS_SetBtnUserData(guiPoliciesAgreeButton[i], 0, i);

    usPosX += 125;
  }
  gfInAgreementPage = true;
  return true;
}

function ExitAgreementButton(): boolean {
  let i: UINT8;

  gfExitingPolicesAgreeButton = true;

  UnloadButtonImage(guiPoliciesButtonImage);

  for (i = 0; i < 2; i++)
    RemoveButton(guiPoliciesAgreeButton[i]);

  gfInAgreementPage = false;

  return true;
}

function DisplayAimPolicyTitle(usPosY: UINT16, ubPageNum: UINT8, fNumber: FLOAT): boolean {
  let sText: string /* wchar_t[400] */;
  let uiStartLoc: UINT32 = 0;

  // Load and display title
  uiStartLoc = AIM_POLICY_LINE_SIZE * ubPageNum;
  LoadEncryptedDataFromFile(AIMPOLICYFILE, sText, uiStartLoc, AIM_POLICY_LINE_SIZE);
  DrawTextToScreen(sText, AIM_POLICY_SUBTITLE_NUMBER, usPosY, 0, AIM_POLICY_SUBTITLE_FONT(), AIM_POLICY_SUBTITLE_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  return true;
}

function DisplayAimPolicyParagraph(usPosY: UINT16, ubPageNum: UINT8, fNumber: FLOAT): UINT16 {
  let sText: string /* wchar_t[400] */;
  let sTemp: string /* wchar_t[20] */;
  let uiStartLoc: UINT32 = 0;
  let usNumPixels: UINT16;

  uiStartLoc = AIM_POLICY_LINE_SIZE * ubPageNum;
  LoadEncryptedDataFromFile(AIMPOLICYFILE, sText, uiStartLoc, AIM_POLICY_LINE_SIZE);

  if (fNumber != 0.0) {
    // Display the section number
    sTemp = swprintf("%2.1f", fNumber);
    DrawTextToScreen(sTemp, AIM_POLICY_PARAGRAPH_NUMBER, usPosY, 0, AIM_POLICY_TEXT_FONT(), AIM_POLICY_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }

  // Display the text beside the section number
  usNumPixels = DisplayWrappedString(AIM_POLICY_PARAGRAPH_X, usPosY, AIM_POLICY_PARAGRAPH_WIDTH, 2, AIM_POLICY_TEXT_FONT(), AIM_POLICY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  return usNumPixels;
}

function DisplayAimPolicySubParagraph(usPosY: UINT16, ubPageNum: UINT8, fNumber: FLOAT): UINT16 {
  let sText: string /* wchar_t[400] */;
  let sTemp: string /* wchar_t[20] */;
  let uiStartLoc: UINT32 = 0;
  let usNumPixels: UINT16;

  uiStartLoc = AIM_POLICY_LINE_SIZE * ubPageNum;
  LoadEncryptedDataFromFile(AIMPOLICYFILE, sText, uiStartLoc, AIM_POLICY_LINE_SIZE);

  // Display the section number
  sTemp = swprintf("%2.2f", fNumber);
  DrawTextToScreen(sTemp, AIM_POLICY_SUBPARAGRAPH_NUMBER, usPosY, 0, AIM_POLICY_TEXT_FONT(), AIM_POLICY_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Display the text beside the section number
  usNumPixels = DisplayWrappedString(AIM_POLICY_SUBPARAGRAPH_X, usPosY, AIM_POLICY_PARAGRAPH_WIDTH, 2, AIM_POLICY_TEXT_FONT(), AIM_POLICY_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  return usNumPixels;
}

function BtnPoliciesAgreeButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let ubRetValue: UINT8;
  /* static */ let fOnPage: boolean = true;
  if (fOnPage) {
    ubRetValue = MSYS_GetBtnUserData(btn, 0);
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
      InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
      gubPoliciesAgreeButtonDown = ubRetValue;
    }

    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
        btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

        // Agree
        fOnPage = false;
        if (ubRetValue == 1) {
          gubCurPageNum++;
          ChangingAimPoliciesSubPage(gubCurPageNum);
        }

        // Disagree
        else {
          guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM;
        }
        InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
        fOnPage = true;
        gubPoliciesAgreeButtonDown = 255;
      }
    }
    if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
      gubPoliciesAgreeButtonDown = 255;
      InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
    }
  }
}

function BtnPoliciesMenuButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let ubRetValue: UINT8;
  /* static */ let fOnPage: boolean = true;
  if (fOnPage) {
    ubRetValue = MSYS_GetBtnUserData(btn, 0);
    if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
      gubAimPolicyMenuButtonDown = ubRetValue;
      InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
    }

    if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
      if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
        btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

        gubAimPolicyMenuButtonDown = 255;
        // If previous Page
        if (ubRetValue == 0) {
          if (gubCurPageNum > 1) {
            gubCurPageNum--;
            ChangingAimPoliciesSubPage(gubCurPageNum);
          }
        }

        // Home Page
        else if (ubRetValue == 1) {
          guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM;
        }

        // Company policies index
        else if (ubRetValue == 2) {
          if (gubCurPageNum != 1) {
            gubCurPageNum = 1;
            ChangingAimPoliciesSubPage(gubCurPageNum);
          }
        }

        // Next Page
        else if (ubRetValue == 3) {
          if (gubCurPageNum < NUM_AIM_POLICY_PAGES - 1) {
            gubCurPageNum++;
            ChangingAimPoliciesSubPage(gubCurPageNum);

            fOnPage = false;
            if (gfInPolicyToc) {
              ExitAimPolicyTocMenu();
            }
            fOnPage = true;
          }
        }
        InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
        ResetAimPolicyButtons();
        DisableAimPolicyButton();
        fOnPage = true;
      }
    }
    if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
      gubAimPolicyMenuButtonDown = 255;
      DisableAimPolicyButton();
      InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
    }
  }
}

function ResetAimPolicyButtons(): void {
  let i: number = 0;

  for (i = 0; i < AIM_POLICY_MENU_BUTTON_AMOUNT; i++) {
    ButtonList[guiPoliciesMenuButton[i]].value.uiFlags &= ~BUTTON_CLICKED_ON;
  }
}

function DisableAimPolicyButton(): void {
  if (gfExitingAimPolicy == true || gfAimPolicyMenuBarLoaded == false)
    return;

  if ((gubCurPageNum == AIM_POLICY_TOC_PAGE)) {
    ButtonList[guiPoliciesMenuButton[0]].value.uiFlags |= (BUTTON_CLICKED_ON);
    ButtonList[guiPoliciesMenuButton[2]].value.uiFlags |= (BUTTON_CLICKED_ON);
  } else if ((gubCurPageNum == AIM_POLICY_LAST_PAGE)) {
    ButtonList[guiPoliciesMenuButton[3]].value.uiFlags |= (BUTTON_CLICKED_ON);
  }
}

function ChangingAimPoliciesSubPage(ubSubPageNumber: UINT8): void {
  fLoadPendingFlag = true;

  if (AimPoliciesSubPagesVisitedFlag[ubSubPageNumber] == false) {
    fConnectingToSubPage = true;
    fFastLoadFlag = false;

    AimPoliciesSubPagesVisitedFlag[ubSubPageNumber] = true;
  } else {
    fConnectingToSubPage = true;
    fFastLoadFlag = true;
  }
}

}
