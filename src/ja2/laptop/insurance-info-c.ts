const INS_INFO_FRAUD_TEXT_COLOR = FONT_MCOLOR_RED;

const INS_INFO_SUBTITLE_X = 86 + LAPTOP_SCREEN_UL_X;
const INS_INFO_SUBTITLE_Y = 62 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_INFO_SUBTITLE_LINE_Y = INS_INFO_SUBTITLE_Y + 14;
const INS_INFO_SUBTITLE_LINE_WIDTH = 375;

const INS_INFO_FIRST_PARAGRAPH_WIDTH = INS_INFO_SUBTITLE_LINE_WIDTH;
const INS_INFO_FIRST_PARAGRAPH_X = INS_INFO_SUBTITLE_X;
const INS_INFO_FIRST_PARAGRAPH_Y = INS_INFO_SUBTITLE_LINE_Y + 9;

const INS_INFO_SPACE_BN_PARAGRAPHS = 12;

const INS_INFO_INFO_TOC_TITLE_X = 170;
const INS_INFO_INFO_TOC_TITLE_Y = 54 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_INFO_TOC_SUBTITLE_X = INS_INFO_SUBTITLE_X;

const INS_INFO_LINK_TO_CONTRACT_X = 235 + LAPTOP_SCREEN_UL_X;
const INS_INFO_LINK_TO_CONTRACT_Y = 392 + LAPTOP_SCREEN_WEB_UL_Y;
const INS_INFO_LINK_TO_CONTRACT_WIDTH = 97; // 107

const INS_INFO_LINK_START_OFFSET = 20; // 14
const INS_INFO_LINK_START_X = 262 + INS_INFO_LINK_START_OFFSET;
const INS_INFO_LINK_START_Y = 392 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_INFO_LINK_TO_CONTRACT_TEXT_Y = 355 + LAPTOP_SCREEN_WEB_UL_Y;

let guiBulletImage: UINT32;

// The list of Info sub pages
const enum Enum89 {
  INS_INFO_INFO_TOC,
  INS_INFO_SUBMIT_CLAIM,
  INS_INFO_PREMIUMS,
  INS_INFO_RENEWL,
  INS_INFO_CANCELATION,
  INS_INFO_LAST_PAGE,
}
let gubCurrentInsInfoSubPage: UINT8 = 0;

let InsuranceInfoSubPagesVisitedFlag: boolean[] /* [INS_INFO_LAST_PAGE - 1] */;

let guiInsPrevButtonImage: INT32;
let guiInsPrevBackButton: UINT32;

let guiInsNextButtonImage: INT32;
let guiInsNextBackButton: UINT32;

// link to the varios pages
let gSelectedInsuranceInfoLinkRegion: MOUSE_REGION;

let gSelectedInsuranceInfoHomeLinkRegion: MOUSE_REGION;

function GameInitInsuranceInfo(): void {
}

function EnterInitInsuranceInfo(): void {
  memset(addressof(InsuranceInfoSubPagesVisitedFlag), 0, Enum89.INS_INFO_LAST_PAGE - 1);
}

function EnterInsuranceInfo(): boolean {
  let VObjectDesc: VOBJECT_DESC;
  let usPosX: UINT16;

  InitInsuranceDefaults();

  // load the Insurance bullet graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\bullet.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiBulletImage)));

  // left arrow
  guiInsPrevButtonImage = LoadButtonImage("LAPTOP\\InsLeftButton.sti", 2, 0, -1, 1, -1);
  guiInsPrevBackButton = CreateIconAndTextButton(guiInsPrevButtonImage, InsInfoText[Enum339.INS_INFO_PREVIOUS], INS_FONT_BIG(), INS_FONT_COLOR, INS_FONT_SHADOW, INS_FONT_COLOR, INS_FONT_SHADOW, TEXT_CJUSTIFIED, INS_INFO_LEFT_ARROW_BUTTON_X, INS_INFO_LEFT_ARROW_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnInsPrevButtonCallback);
  SetButtonCursor(guiInsPrevBackButton, Enum317.CURSOR_WWW);
  SpecifyButtonTextOffsets(guiInsPrevBackButton, 17, 16, false);

  // Right arrow
  guiInsNextButtonImage = LoadButtonImage("LAPTOP\\InsRightButton.sti", 2, 0, -1, 1, -1);
  guiInsNextBackButton = CreateIconAndTextButton(guiInsNextButtonImage, InsInfoText[Enum339.INS_INFO_NEXT], INS_FONT_BIG(), INS_FONT_COLOR, INS_FONT_SHADOW, INS_FONT_COLOR, INS_FONT_SHADOW, TEXT_CJUSTIFIED, INS_INFO_RIGHT_ARROW_BUTTON_X, INS_INFO_RIGHT_ARROW_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnInsNextButtonCallback);
  SetButtonCursor(guiInsNextBackButton, Enum317.CURSOR_WWW);
  SpecifyButtonTextOffsets(guiInsNextBackButton, 18, 16, false);

  usPosX = INS_INFO_LINK_START_X;
  // link to go to the contract page
  // link to go to the home page
  MSYS_DefineRegion(addressof(gSelectedInsuranceInfoHomeLinkRegion), usPosX, INS_INFO_LINK_TO_CONTRACT_Y - 37, (usPosX + INS_INFO_LINK_TO_CONTRACT_WIDTH), INS_INFO_LINK_TO_CONTRACT_Y + 2, MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectInsuranceInfoHomeLinkRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedInsuranceInfoHomeLinkRegion));

  usPosX += INS_INFO_LINK_START_OFFSET + INS_INFO_LINK_TO_CONTRACT_WIDTH;
  MSYS_DefineRegion(addressof(gSelectedInsuranceInfoLinkRegion), usPosX, INS_INFO_LINK_TO_CONTRACT_Y - 37, (usPosX + INS_INFO_LINK_TO_CONTRACT_WIDTH), INS_INFO_LINK_TO_CONTRACT_Y + 2, MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectInsuranceLinkRegionCallBack);
  MSYS_AddRegion(addressof(gSelectedInsuranceInfoLinkRegion));

  gubCurrentInsInfoSubPage = Enum89.INS_INFO_INFO_TOC;

  RenderInsuranceInfo();

  return true;
}

function ExitInsuranceInfo(): void {
  RemoveInsuranceDefaults();

  UnloadButtonImage(guiInsPrevButtonImage);
  RemoveButton(guiInsPrevBackButton);

  UnloadButtonImage(guiInsNextButtonImage);
  RemoveButton(guiInsNextBackButton);

  MSYS_RemoveRegion(addressof(gSelectedInsuranceInfoLinkRegion));
  MSYS_RemoveRegion(addressof(gSelectedInsuranceInfoHomeLinkRegion));

  DeleteVideoObjectFromIndex(guiBulletImage);
}

function HandleInsuranceInfo(): void {
}

function RenderInsuranceInfo(): void {
  let sText: wchar_t[] /* [800] */;
  let usNewLineOffset: UINT16 = 0;
  let usPosX: UINT16;

  DisableArrowButtonsIfOnLastOrFirstPage();

  DisplayInsuranceDefaults();

  SetFontShadow(INS_FONT_SHADOW);

  // Display the red bar under the link at the bottom
  DisplaySmallRedLineWithShadow(INS_INFO_SUBTITLE_X, INS_INFO_SUBTITLE_LINE_Y, INS_INFO_SUBTITLE_X + INS_INFO_SUBTITLE_LINE_WIDTH, INS_INFO_SUBTITLE_LINE_Y);

  switch (gubCurrentInsInfoSubPage) {
    case Enum89.INS_INFO_INFO_TOC:
      DisplayInfoTocPage();
      break;

    case Enum89.INS_INFO_SUBMIT_CLAIM:
      DisplaySubmitClaimPage();
      break;

    case Enum89.INS_INFO_PREMIUMS:
      DisplayPremiumPage();
      break;

    case Enum89.INS_INFO_RENEWL:
      DisplayRenewingPremiumPage();
      break;

    case Enum89.INS_INFO_CANCELATION:
      DisplayCancelationPagePage();
      break;
  }

  usPosX = INS_INFO_LINK_START_X;

  // Display the red bar under the link at the bottom.  and the text
  DisplaySmallRedLineWithShadow(usPosX, INS_INFO_LINK_TO_CONTRACT_Y, (usPosX + INS_INFO_LINK_TO_CONTRACT_WIDTH), INS_INFO_LINK_TO_CONTRACT_Y);
  swprintf(sText, "%s", pMessageStrings[Enum333.MSG_HOMEPAGE]);
  DisplayWrappedString(usPosX, INS_INFO_LINK_TO_CONTRACT_TEXT_Y + 14, INS_INFO_LINK_TO_CONTRACT_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  usPosX += INS_INFO_LINK_START_OFFSET + INS_INFO_LINK_TO_CONTRACT_WIDTH;

  // Display the red bar under the link at the bottom.  and the text
  DisplaySmallRedLineWithShadow(usPosX, INS_INFO_LINK_TO_CONTRACT_Y, (usPosX + INS_INFO_LINK_TO_CONTRACT_WIDTH), INS_INFO_LINK_TO_CONTRACT_Y);
  GetInsuranceText(Enum90.INS_SNGL_TO_ENTER_REVIEW, sText);
  DisplayWrappedString(usPosX, INS_INFO_LINK_TO_CONTRACT_TEXT_Y, INS_INFO_LINK_TO_CONTRACT_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  SetFontShadow(DEFAULT_SHADOW);

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function BtnInsPrevButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      if (gubCurrentInsInfoSubPage > 0)
        gubCurrentInsInfoSubPage--;

      ChangingInsuranceInfoSubPage(gubCurrentInsInfoSubPage);
      //			fPausedReDrawScreenFlag = TRUE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnInsNextButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      if (gubCurrentInsInfoSubPage < (Enum89.INS_INFO_LAST_PAGE - 1))
        gubCurrentInsInfoSubPage++;

      ChangingInsuranceInfoSubPage(gubCurrentInsInfoSubPage);

      //			fPausedReDrawScreenFlag = TRUE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function SelectInsuranceLinkRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE_CONTRACT;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectInsuranceInfoHomeLinkRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function DisplaySubmitClaimPage(): void {
  let sText: wchar_t[] /* [800] */;
  let usNewLineOffset: UINT16 = 0;
  let usPosX: UINT16;

  usNewLineOffset = INS_INFO_FIRST_PARAGRAPH_Y;

  // Display the title slogan
  GetInsuranceText(Enum90.INS_SNGL_SUBMITTING_CLAIM, sText);
  DrawTextToScreen(sText, INS_INFO_SUBTITLE_X, INS_INFO_SUBTITLE_Y, 0, INS_FONT_BIG(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Display the title slogan
  GetInsuranceText(Enum90.INS_MLTI_U_CAN_REST_ASSURED, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  GetInsuranceText(Enum90.INS_MLTI_HAD_U_HIRED_AN_INDIVIDUAL, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  // display the BIG FRAUD
  GetInsuranceText(Enum90.INS_SNGL_FRAUD, sText);
  DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, (usNewLineOffset - 1), INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_BIG(), INS_INFO_FRAUD_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  usPosX = INS_INFO_FIRST_PARAGRAPH_X + StringPixLength(sText, INS_FONT_BIG()) + 2;
  GetInsuranceText(Enum90.INS_MLTI_WE_RESERVE_THE_RIGHT, sText);
  usNewLineOffset += DisplayWrappedString(usPosX, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  GetInsuranceText(Enum90.INS_MLTI_SHOULD_THERE_BE_GROUNDS, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  GetInsuranceText(Enum90.INS_MLTI_SHOULD_SUCH_A_SITUATION, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;
}

function DisplayPremiumPage(): void {
  let sText: wchar_t[] /* [800] */;
  let usNewLineOffset: UINT16 = 0;
  let hPixHandle: HVOBJECT;

  usNewLineOffset = INS_INFO_FIRST_PARAGRAPH_Y;

  // Display the title slogan
  GetInsuranceText(Enum90.INS_SNGL_PREMIUMS, sText);
  DrawTextToScreen(sText, INS_INFO_SUBTITLE_X, INS_INFO_SUBTITLE_Y, 0, INS_FONT_BIG(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  GetInsuranceText(Enum90.INS_MLTI_EACH_TIME_U_COME_TO_US, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  // Get and display the insurance bullet
  GetVideoObject(addressof(hPixHandle), guiBulletImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, VO_BLT_SRCTRANSPARENCY, null);

  GetInsuranceText(Enum90.INS_MLTI_LENGTH_OF_EMPLOYMENT_CONTRACT, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X + INSURANCE_BULLET_TEXT_OFFSET_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  // Get and display the insurance bullet
  GetVideoObject(addressof(hPixHandle), guiBulletImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, VO_BLT_SRCTRANSPARENCY, null);

  GetInsuranceText(Enum90.INS_MLTI_EMPLOYEES_AGE_AND_HEALTH, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X + INSURANCE_BULLET_TEXT_OFFSET_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  // Get and display the insurance bullet
  GetVideoObject(addressof(hPixHandle), guiBulletImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, VO_BLT_SRCTRANSPARENCY, null);

  GetInsuranceText(Enum90.INS_MLTI_EMPLOOYEES_TRAINING_AND_EXP, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X + INSURANCE_BULLET_TEXT_OFFSET_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;
}

function DisplayRenewingPremiumPage(): void {
  let sText: wchar_t[] /* [800] */;
  let usNewLineOffset: UINT16 = 0;
  //  HVOBJECT hPixHandle;

  usNewLineOffset = INS_INFO_FIRST_PARAGRAPH_Y;

  // Display the title slogan
  GetInsuranceText(Enum90.INS_SNGL_RENEWL_PREMIUMS, sText);
  DrawTextToScreen(sText, INS_INFO_SUBTITLE_X, INS_INFO_SUBTITLE_Y, 0, INS_FONT_BIG(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  GetInsuranceText(Enum90.INS_MLTI_WHEN_IT_COMES_TIME_TO_RENEW, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  GetInsuranceText(Enum90.INS_MLTI_SHOULD_THE_PROJECT_BE_GOING_WELL, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  // display the LOWER PREMIUM FOR RENWING EARLY
  GetInsuranceText(Enum90.INS_SNGL_LOWER_PREMIUMS_4_RENEWING, sText);
  DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, (usNewLineOffset - 1), INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_BIG(), INS_INFO_FRAUD_TEXT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS + 2;

  /*
          //Get and display the insurance bullet
          GetVideoObject(&hPixHandle, guiBulletImage );
          BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, VO_BLT_SRCTRANSPARENCY,NULL);

          GetInsuranceText( INS_MLTI_IF_U_EXTEND_THE_CONTRACT, sText );
          usNewLineOffset += DisplayWrappedString( INS_INFO_FIRST_PARAGRAPH_X+INSURANCE_BULLET_TEXT_OFFSET_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED, INS_FONT_COLOR,  sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
          usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;
  */
}

function DisplayCancelationPagePage(): void {
  let sText: wchar_t[] /* [800] */;
  let usNewLineOffset: UINT16 = 0;

  usNewLineOffset = INS_INFO_FIRST_PARAGRAPH_Y;

  // Display the title slogan
  GetInsuranceText(Enum90.INS_SNGL_POLICY_CANCELATIONS, sText);
  DrawTextToScreen(sText, INS_INFO_SUBTITLE_X, INS_INFO_SUBTITLE_Y, 0, INS_FONT_BIG(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  GetInsuranceText(Enum90.INS_MLTI_WE_WILL_ACCEPT_INS_CANCELATION, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  GetInsuranceText(Enum90.INS_MLTI_1_HOUR_EXCLUSION_A, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  GetInsuranceText(Enum90.INS_MLTI_1_HOUR_EXCLUSION_B, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;
}

function DisableArrowButtonsIfOnLastOrFirstPage(): void {
  if (gubCurrentInsInfoSubPage == Enum89.INS_INFO_INFO_TOC)
    DisableButton(guiInsPrevBackButton);
  else
    EnableButton(guiInsPrevBackButton);

  if (gubCurrentInsInfoSubPage == Enum89.INS_INFO_LAST_PAGE - 1)
    DisableButton(guiInsNextBackButton);
  else
    EnableButton(guiInsNextBackButton);
}

function ChangingInsuranceInfoSubPage(ubSubPageNumber: UINT8): void {
  fLoadPendingFlag = true;

  if (InsuranceInfoSubPagesVisitedFlag[ubSubPageNumber] == false) {
    fConnectingToSubPage = true;
    fFastLoadFlag = false;

    InsuranceInfoSubPagesVisitedFlag[ubSubPageNumber] = true;
  } else {
    fConnectingToSubPage = true;
    fFastLoadFlag = true;
  }
}

function DisplayInfoTocPage(): void {
  let sText: wchar_t[] /* [800] */;
  let usNewLineOffset: UINT16 = 0;
  let hPixHandle: HVOBJECT;
  let usPosY: UINT16;

  usNewLineOffset = INS_INFO_FIRST_PARAGRAPH_Y;

  // Display the title slogan
  GetInsuranceText(Enum90.INS_SNGL_HOW_DOES_INS_WORK, sText);
  DrawTextToScreen(sText, INS_INFO_INFO_TOC_TITLE_X, INS_INFO_INFO_TOC_TITLE_Y, 439, INS_FONT_BIG(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // Display the First paragraph
  GetInsuranceText(Enum90.INS_MLTI_HIRING_4_SHORT_TERM_HIGH_RISK_1, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  // Display the 2nd paragraph
  GetInsuranceText(Enum90.INS_MLTI_HIRING_4_SHORT_TERM_HIGH_RISK_2, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  // Display the sub title
  GetInsuranceText(Enum90.INS_SNGL_WE_CAN_OFFER_U, sText);
  DrawTextToScreen(sText, INS_INFO_TOC_SUBTITLE_X, usNewLineOffset, 640 - INS_INFO_INFO_TOC_TITLE_X, INS_FONT_BIG(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usPosY = usNewLineOffset + 12;
  DisplaySmallRedLineWithShadow(INS_INFO_SUBTITLE_X, usPosY, (INS_INFO_SUBTITLE_X + INS_INFO_SUBTITLE_LINE_WIDTH), usPosY);

  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  //
  // Premiuns bulleted sentence
  //

  // Get and display the insurance bullet
  GetVideoObject(addressof(hPixHandle), guiBulletImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, VO_BLT_SRCTRANSPARENCY, null);

  GetInsuranceText(Enum90.INS_MLTI_REASONABLE_AND_FLEXIBLE, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X + INSURANCE_BULLET_TEXT_OFFSET_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;

  //
  // Quick and efficient claims
  //

  // Get and display the insurance bullet
  GetVideoObject(addressof(hPixHandle), guiBulletImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_INFO_FIRST_PARAGRAPH_X, usNewLineOffset, VO_BLT_SRCTRANSPARENCY, null);

  GetInsuranceText(Enum90.INS_MLTI_QUICKLY_AND_EFFICIENT, sText);
  usNewLineOffset += DisplayWrappedString(INS_INFO_FIRST_PARAGRAPH_X + INSURANCE_BULLET_TEXT_OFFSET_X, usNewLineOffset, INS_INFO_FIRST_PARAGRAPH_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  usNewLineOffset += INS_INFO_SPACE_BN_PARAGRAPHS;
}
