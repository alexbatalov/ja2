const INS_CTRCT_ORDER_GRID_WIDTH = 132;
const INS_CTRCT_ORDER_GRID_HEIGHT = 216;
const INS_CTRCT_ORDER_GRID_OFFSET_X = INS_CTRCT_ORDER_GRID_WIDTH + 2;

const INS_CTRCT_ORDER_GRID1_X = 76 + LAPTOP_SCREEN_UL_X;
const INS_CTRCT_ORDER_GRID1_Y = 126 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_CTRCT_ORDER_GRID2_X = INS_CTRCT_ORDER_GRID1_X + INS_CTRCT_ORDER_GRID_OFFSET_X;

const INS_CTRCT_ORDER_GRID3_X = INS_CTRCT_ORDER_GRID2_X + INS_CTRCT_ORDER_GRID_OFFSET_X;

const INS_CTRCT_OG_FACE_OFFSET_X = 5;
const INS_CTRCT_OG_FACE_OFFSET_Y = 4;

const INS_CTRCT_OG_NICK_NAME_OFFSET_X = 57;
const INS_CTRCT_OG_NICK_NAME_OFFSET_Y = 13;

const INS_CTRCT_OG_HAS_CONTRACT_OFFSET_X = INS_CTRCT_OG_NICK_NAME_OFFSET_X;
const INS_CTRCT_OG_HAS_CONTRACT_OFFSET_Y = INS_CTRCT_OG_NICK_NAME_OFFSET_Y + 13;

const INS_CTRCT_TITLE_Y = (48 + LAPTOP_SCREEN_WEB_UL_Y); // 52 + LAPTOP_SCREEN_WEB_UL_Y

const INS_CTRCT_FIRST_BULLET_TEXT_X = 86 + LAPTOP_SCREEN_UL_X;
const INS_CTRCT_FIRST_BULLET_TEXT_Y = 65 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_CTRCT_SECOND_BULLET_TEXT_X = INS_CTRCT_FIRST_BULLET_TEXT_X;
const INS_CTRCT_SECOND_BULLET_TEXT_Y = 93 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_CTRCT_INTSRUCTION_TEXT_WIDTH = 375;

const INS_CTRCT_RED_BAR_UNDER_INSTRUCTION_TEXT_Y = 123 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_CTRCT_EMPLYMNT_CNTRCT_TEXT_OFFSET_X = 4;
const INS_CTRCT_EMPLYMNT_CNTRCT_TEXT_OFFSET_Y = 54;

const INS_CTRCT_LENGTH_OFFSET_X = INS_CTRCT_EMPLYMNT_CNTRCT_TEXT_OFFSET_X;
const INS_CTRCT_LENGTH_OFFSET_Y = 71;

const INS_CTRCT_DAYS_REMAINING_OFFSET_Y = 87;

const INS_CTRCT_INSURANCE_CNTRCT_OFFSET_Y = 108;

const INS_CTRCT_PREMIUM_OWING_OFFSET_Y = 160;

const INS_CTRCT_OG_BOX_OFFSET_X = 92;
const INS_CTRCT_OG_BOX_WIDTH = 35;

const INS_CTRCT_ACCEPT_BTN_X = (132 / 2 - 43 / 2); // 6
const INS_CTRCT_ACCEPT_BTN_Y = 193;

const INS_CTRCT_CLEAR_BTN_X = 86;

const INS_CTRCT_BOTTON_LINK_Y = 351 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_CTRCT_BOTTOM_LINK_RED_BAR_X = 171 + LAPTOP_SCREEN_UL_X;
const INS_CTRCT_BOTTON_LINK_RED_BAR_Y = INS_CTRCT_BOTTON_LINK_Y + 41;

const INS_CTRCT_BOTTOM_LINK_RED_BAR_OFFSET = 117;

const INS_CTRCT_BOTTOM_LINK_RED_WIDTH = 97;

const INS_CTRCT_CONTRACT_STATUS_TEXT_WIDTH = 74;

// this is the percentage of daily salary used as a base to calculate daily insurance premiums
const INSURANCE_PREMIUM_RATE = 5;

const INS_CTRCT_SKILL_BASE = 42;
const INS_CTRCT_FITNESS_BASE = 85;
const INS_CTRCT_EXP_LEVEL_BASE = 3;
const INS_CTRCT_SURVIVAL_BASE = 90;

let guiInsOrderGridImage: UINT32;
let guiInsOrderBulletImage: UINT32;

let gsForm1InsuranceLengthNumber: INT16;
let gsForm2InsuranceLengthNumber: INT16;
let gsForm3InsuranceLengthNumber: INT16;

let gubMercIDForMercInForm1: UINT8;
let gubMercIDForMercInForm2: UINT8;
let gubMercIDForMercInForm3: UINT8;

let gubNumberofDisplayedInsuranceGrids: UINT8;

let gfChangeInsuranceFormButtons: BOOLEAN = FALSE;

let gubInsuranceMercArray: UINT8[] /* [20] */;
let gsCurrentInsuranceMercIndex: INT16;
let gsMaxPlayersOnTeam: INT16;

// link to the varios pages
let gSelectedInsuranceContractLinkRegion: MOUSE_REGION[] /* [2] */;

let guiInsContractPrevButtonImage: INT32;
let guiInsContractPrevBackButton: UINT32;

let guiInsContractNextButtonImage: INT32;
let guiInsContractNextBackButton: UINT32;

// Graphic for Accept, Clear button for form 1
let guiInsuranceAcceptClearForm1ButtonImage: INT32;
let guiInsuranceAcceptClearForm1Button: UINT32;

let guiInsuranceAcceptClearForm2Button: UINT32;

let guiInsuranceAcceptClearForm3Button: UINT32;

// ppp

function GameInitInsuranceContract(): void {
  gsCurrentInsuranceMercIndex = gTacticalStatus.Team[gbPlayerNum].bFirstID;
}

function EnterLaptopInitInsuranceContract(): void {
  let zTextField: wchar_t[] /* [14] */;

  swprintf(zTextField, "%d", 0);
  SetInputFieldStringWith16BitString(1, zTextField);
  SetInputFieldStringWith16BitString(2, zTextField);
  SetInputFieldStringWith16BitString(3, zTextField);
}

function EnterInsuranceContract(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let usPosX: UINT16;
  let i: UINT16;

  // build the list of mercs that are can be displayed
  BuildInsuranceArray();

  gubNumberofDisplayedInsuranceGrids = GetNumberOfHireMercsStartingFromID(gsCurrentInsuranceMercIndex);
  if (gubNumberofDisplayedInsuranceGrids > 3)
    gubNumberofDisplayedInsuranceGrids = 3;

  InitInsuranceDefaults();

  // load the Insurance title graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\InsOrderGrid.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiInsOrderGridImage)));

  // load the Insurance bullet graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\bullet.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiInsOrderBulletImage)));

  usPosX = INS_CTRCT_BOTTOM_LINK_RED_BAR_X;
  for (i = 0; i < 2; i++) {
    MSYS_DefineRegion(addressof(gSelectedInsuranceContractLinkRegion[i]), usPosX, INS_CTRCT_BOTTON_LINK_RED_BAR_Y - 37, (usPosX + INS_CTRCT_BOTTOM_LINK_RED_WIDTH), INS_CTRCT_BOTTON_LINK_RED_BAR_Y + 2, MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectInsuranceContractRegionCallBack);
    MSYS_AddRegion(addressof(gSelectedInsuranceContractLinkRegion[i]));
    MSYS_SetRegionUserData(addressof(gSelectedInsuranceContractLinkRegion[i]), 0, i);

    usPosX += INS_CTRCT_BOTTOM_LINK_RED_BAR_OFFSET;
  }

  // left arrow
  guiInsContractPrevButtonImage = LoadButtonImage("LAPTOP\\InsLeftButton.sti", 2, 0, -1, 1, -1);
  guiInsContractPrevBackButton = CreateIconAndTextButton(guiInsContractPrevButtonImage, InsContractText[Enum338.INS_CONTRACT_PREVIOUS], INS_FONT_BIG(), INS_FONT_COLOR, INS_FONT_SHADOW, INS_FONT_COLOR, INS_FONT_SHADOW, TEXT_CJUSTIFIED, INS_INFO_LEFT_ARROW_BUTTON_X, INS_INFO_LEFT_ARROW_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnInsContractPrevButtonCallback);
  SetButtonCursor(guiInsContractPrevBackButton, Enum317.CURSOR_WWW);
  SpecifyButtonTextOffsets(guiInsContractPrevBackButton, 17, 16, FALSE);

  // Right arrow
  guiInsContractNextButtonImage = LoadButtonImage("LAPTOP\\InsRightButton.sti", 2, 0, -1, 1, -1);
  guiInsContractNextBackButton = CreateIconAndTextButton(guiInsContractNextButtonImage, InsContractText[Enum338.INS_CONTRACT_NEXT], INS_FONT_BIG(), INS_FONT_COLOR, INS_FONT_SHADOW, INS_FONT_COLOR, INS_FONT_SHADOW, TEXT_CJUSTIFIED, INS_INFO_RIGHT_ARROW_BUTTON_X, INS_INFO_RIGHT_ARROW_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnInsContractNextButtonCallBack);
  SetButtonCursor(guiInsContractNextBackButton, Enum317.CURSOR_WWW);
  SpecifyButtonTextOffsets(guiInsContractNextBackButton, 18, 16, FALSE);

  // create the new set of buttons
  CreateDestroyInsuranceContractFormButtons(TRUE);

  //	RenderInsuranceContract();
  return TRUE;
}

function ExitInsuranceContract(): void {
  let i: UINT8;

  RemoveInsuranceDefaults();

  DeleteVideoObjectFromIndex(guiInsOrderGridImage);

  DeleteVideoObjectFromIndex(guiInsOrderBulletImage);

  for (i = 0; i < 2; i++)
    MSYS_RemoveRegion(addressof(gSelectedInsuranceContractLinkRegion[i]));

  // the previous button
  UnloadButtonImage(guiInsContractPrevButtonImage);
  RemoveButton(guiInsContractPrevBackButton);

  // the next button
  UnloadButtonImage(guiInsContractNextButtonImage);
  RemoveButton(guiInsContractNextBackButton);

  CreateDestroyInsuranceContractFormButtons(FALSE);
}

function HandleInsuranceContract(): void {
  if (gfChangeInsuranceFormButtons) {
    // remove the old buttons from the page
    CreateDestroyInsuranceContractFormButtons(FALSE);

    // Get the new number of displayed insurance grids
    gubNumberofDisplayedInsuranceGrids = GetNumberOfHireMercsStartingFromID(gsCurrentInsuranceMercIndex);
    if (gubNumberofDisplayedInsuranceGrids > 3)
      gubNumberofDisplayedInsuranceGrids = 3;

    // create the new set of buttons
    CreateDestroyInsuranceContractFormButtons(TRUE);

    // reset the flag
    gfChangeInsuranceFormButtons = FALSE;

    // force a redraw of the screen to erase the old buttons
    fPausedReDrawScreenFlag = TRUE;
    RenderInsuranceContract();

    MarkButtonsDirty();
  }

  EnableDisableInsuranceContractAcceptButtons();
}

function RenderInsuranceContract(): void {
  let hPixHandle: HVOBJECT;
  let sText: wchar_t[] /* [800] */;
  let ubCount: UINT8 = 0;
  let sMercID: INT16;
  let sNextMercID: INT16;
  let usPosX: UINT16;
  let fIsThereAnyAimMercs: BOOLEAN = FALSE;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;

  SetFontShadow(INS_FONT_SHADOW);

  DisplayInsuranceDefaults();

  // disable the next or previous button depending on how many more mercs we have to display
  DisableInsuranceContractNextPreviousbuttons();

  usPosX = INS_CTRCT_BOTTOM_LINK_RED_BAR_X;

  // Display the red bar under the link at the bottom.  and the text
  DisplaySmallRedLineWithShadow(usPosX, INS_CTRCT_BOTTON_LINK_RED_BAR_Y, (usPosX + INS_CTRCT_BOTTOM_LINK_RED_WIDTH), INS_CTRCT_BOTTON_LINK_RED_BAR_Y);
  swprintf(sText, "%s", pMessageStrings[Enum333.MSG_HOMEPAGE]);
  DisplayWrappedString(usPosX, INS_CTRCT_BOTTON_LINK_Y + 18, INS_CTRCT_BOTTOM_LINK_RED_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  usPosX += INS_CTRCT_BOTTOM_LINK_RED_BAR_OFFSET;

  // Display the red bar under the link at the bottom.  and the text
  DisplaySmallRedLineWithShadow(usPosX, INS_CTRCT_BOTTON_LINK_RED_BAR_Y, (usPosX + INS_CTRCT_BOTTOM_LINK_RED_WIDTH), INS_CTRCT_BOTTON_LINK_RED_BAR_Y);
  GetInsuranceText(Enum90.INS_SNGL_HOW_DOES_INS_WORK, sText);
  DisplayWrappedString(usPosX, INS_CTRCT_BOTTON_LINK_Y + 12, INS_CTRCT_BOTTOM_LINK_RED_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display the title slogan
  GetInsuranceText(Enum90.INS_SNGL_ENTERING_REVIEWING_CLAIM, sText);
  DrawTextToScreen(sText, LAPTOP_SCREEN_UL_X, INS_CTRCT_TITLE_Y, LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X, INS_FONT_BIG(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Get and display the insurance bullet
  GetVideoObject(addressof(hPixHandle), guiInsOrderBulletImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_CTRCT_FIRST_BULLET_TEXT_X, INS_CTRCT_FIRST_BULLET_TEXT_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Display the first instruction sentence
  GetInsuranceText(Enum90.INS_MLTI_TO_PURCHASE_INSURANCE, sText);
  DisplayWrappedString(INS_CTRCT_FIRST_BULLET_TEXT_X + INSURANCE_BULLET_TEXT_OFFSET_X, INS_CTRCT_FIRST_BULLET_TEXT_Y, INS_CTRCT_INTSRUCTION_TEXT_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Get and display the insurance bullet
  GetVideoObject(addressof(hPixHandle), guiInsOrderBulletImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_CTRCT_FIRST_BULLET_TEXT_X, INS_CTRCT_SECOND_BULLET_TEXT_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // Display the second instruction sentence
  GetInsuranceText(Enum90.INS_MLTI_ONCE_SATISFIED_CLICK_ACCEPT, sText);
  DisplayWrappedString(INS_CTRCT_FIRST_BULLET_TEXT_X + INSURANCE_BULLET_TEXT_OFFSET_X, INS_CTRCT_SECOND_BULLET_TEXT_Y, INS_CTRCT_INTSRUCTION_TEXT_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the red bar under the instruction text
  DisplaySmallRedLineWithShadow(INS_CTRCT_FIRST_BULLET_TEXT_X, INS_CTRCT_RED_BAR_UNDER_INSTRUCTION_TEXT_Y, INS_CTRCT_FIRST_BULLET_TEXT_X + INS_CTRCT_INTSRUCTION_TEXT_WIDTH, INS_CTRCT_RED_BAR_UNDER_INSTRUCTION_TEXT_Y);

  sNextMercID = gsCurrentInsuranceMercIndex;
  while ((ubCount < gubNumberofDisplayedInsuranceGrids) && (sNextMercID <= gTacticalStatus.Team[gbPlayerNum].bLastID)) {
    sMercID = gubInsuranceMercArray[sNextMercID];

    pSoldier = addressof(Menptr[GetSoldierIDFromMercID(sMercID)]);

    if ((sMercID != -1) && MercIsInsurable(pSoldier)) {
      DisplayOrderGrid(ubCount, sMercID);
      ubCount++;
    }

    sNextMercID++;
  }

  // if there are no valid mercs to insure
  if (ubCount == 0) {
    // if there where AIM mercs ( on short contract )
    if (AreAnyAimMercsOnTeam()) {
      // Display Error Message, all aim mercs are on short contract
      GetInsuranceText(Enum90.INS_MLTI_ALL_AIM_MERCS_ON_SHORT_CONTRACT, sText);
      DoLapTopMessageBox(Enum24.MSG_BOX_RED_ON_WHITE, sText, Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, InsContractNoMercsPopupCallBack);
    } else {
      // Display Error Message, no valid mercs
      GetInsuranceText(Enum90.INS_MLTI_NO_QUALIFIED_MERCS, sText);
      DoLapTopMessageBox(Enum24.MSG_BOX_RED_ON_WHITE, sText, Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, InsContractNoMercsPopupCallBack);
    }
  }

  SetFontShadow(DEFAULT_SHADOW);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function BtnInsContractPrevButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      if (gsCurrentInsuranceMercIndex > 2)
        gsCurrentInsuranceMercIndex -= 3;

      // signal that we want to change the number of forms on the page
      gfChangeInsuranceFormButtons = TRUE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnInsContractNextButtonCallBack(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      gsCurrentInsuranceMercIndex += 3;

      // signal that we want to change the number of forms on the page
      gfChangeInsuranceFormButtons = TRUE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function DisplayOrderGrid(ubGridNumber: UINT8, ubMercID: UINT8): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let hPixHandle: HVOBJECT;
  let usPosX: UINT16;
  let usPosY: UINT16;
  let uiInsMercFaceImage: UINT32;
  let iCostOfContract: INT32 = 0;
  let sTemp: char[] /* [100] */;
  let sText: wchar_t[] /* [800] */;
  let fDisplayMercContractStateTextColorInRed: BOOLEAN = FALSE;

  let pSoldier: Pointer<SOLDIERTYPE>;

  pSoldier = addressof(Menptr[GetSoldierIDFromMercID(ubMercID)]);

  usPosX = usPosY = 0;

  switch (ubGridNumber) {
    case 0:
      usPosX = INS_CTRCT_ORDER_GRID1_X;
      gubMercIDForMercInForm1 = ubMercID;
      gsForm1InsuranceLengthNumber = pSoldier.value.iTotalLengthOfInsuranceContract;
      break;

    case 1:
      usPosX = INS_CTRCT_ORDER_GRID2_X;
      gubMercIDForMercInForm2 = ubMercID;
      gsForm2InsuranceLengthNumber = pSoldier.value.iTotalLengthOfInsuranceContract;
      break;

    case 2:
      usPosX = INS_CTRCT_ORDER_GRID3_X;
      gubMercIDForMercInForm3 = ubMercID;
      gsForm3InsuranceLengthNumber = pSoldier.value.iTotalLengthOfInsuranceContract;
      break;

    default:
      // should never get in here
      Assert(0);
      break;
  }

  // Get and display the insurance order grid #1
  GetVideoObject(addressof(hPixHandle), guiInsOrderGridImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, usPosX, INS_CTRCT_ORDER_GRID1_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // load the mercs face graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  sprintf(sTemp, "FACES\\%02d.sti", ubMercID);
  FilenameForBPP(sTemp, VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(uiInsMercFaceImage)));

  // Get the merc's face
  GetVideoObject(addressof(hPixHandle), uiInsMercFaceImage);

  // if the merc is dead, shade the face red
  if (IsMercDead(ubMercID)) {
    // if the merc is dead
    // shade the face red, (to signify that he is dead)
    hPixHandle.value.pShades[0] = Create16BPPPaletteShaded(hPixHandle.value.pPaletteEntry, DEAD_MERC_COLOR_RED, DEAD_MERC_COLOR_GREEN, DEAD_MERC_COLOR_BLUE, TRUE);

    // set the red pallete to the face
    SetObjectHandleShade(uiInsMercFaceImage, 0);
  }

  // Get and display the mercs face
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, usPosX + INS_CTRCT_OG_FACE_OFFSET_X, INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_OG_FACE_OFFSET_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  // the face images isn't needed anymore so delete it
  DeleteVideoObjectFromIndex(uiInsMercFaceImage);

  // display the mercs nickname
  DrawTextToScreen(gMercProfiles[ubMercID].zNickname, (usPosX + INS_CTRCT_OG_NICK_NAME_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_OG_NICK_NAME_OFFSET_Y, 0, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Get the text to display the mercs current insurance contract status
  if (IsMercDead(pSoldier.value.ubProfile)) {
    // if the merc has a contract
    if (pSoldier.value.usLifeInsurance) {
      // Display the contract text
      GetInsuranceText(Enum90.INS_SNGL_DEAD_WITH_CONTRACT, sText);
    } else {
      // Display the contract text
      GetInsuranceText(Enum90.INS_SNGL_DEAD_NO_CONTRACT, sText);
    }
    DisplayWrappedString((usPosX + INS_CTRCT_OG_HAS_CONTRACT_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_OG_HAS_CONTRACT_OFFSET_Y, INS_CTRCT_CONTRACT_STATUS_TEXT_WIDTH, 2, INS_FONT_SMALL(), INS_FONT_COLOR_RED, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  } else {
    // if the merc has a contract
    if (pSoldier.value.usLifeInsurance) {
      // if the soldier can extend their insurance
      if (CanSoldierExtendInsuranceContract(pSoldier)) {
        // Display the contract text
        GetInsuranceText(Enum90.INS_SNGL_PARTIALLY_INSURED, sText);
        fDisplayMercContractStateTextColorInRed = TRUE;
      } else {
        // Display the contract text
        GetInsuranceText(Enum90.INS_SNGL_CONTRACT, sText);
        fDisplayMercContractStateTextColorInRed = FALSE;
      }
    } else {
      // Display the contract text
      GetInsuranceText(Enum90.INS_SNGL_NOCONTRACT, sText);
      fDisplayMercContractStateTextColorInRed = TRUE;
    }
    if (fDisplayMercContractStateTextColorInRed)
      DisplayWrappedString((usPosX + INS_CTRCT_OG_HAS_CONTRACT_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_OG_HAS_CONTRACT_OFFSET_Y, INS_CTRCT_CONTRACT_STATUS_TEXT_WIDTH, 2, INS_FONT_SMALL(), INS_FONT_COLOR_RED, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
    else
      DisplayWrappedString((usPosX + INS_CTRCT_OG_HAS_CONTRACT_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_OG_HAS_CONTRACT_OFFSET_Y, INS_CTRCT_CONTRACT_STATUS_TEXT_WIDTH, 2, INS_FONT_SMALL(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);
  }

  // Display the Emplyment contract text
  GetInsuranceText(Enum90.INS_SNGL_EMPLOYMENT_CONTRACT, sText);
  DrawTextToScreen(sText, (usPosX + INS_CTRCT_EMPLYMNT_CNTRCT_TEXT_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_EMPLYMNT_CNTRCT_TEXT_OFFSET_Y, INS_CTRCT_ORDER_GRID_WIDTH, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Display the merc contract Length text
  GetInsuranceText(Enum90.INS_SNGL_LENGTH, sText);
  DrawTextToScreen(sText, (usPosX + INS_CTRCT_LENGTH_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_LENGTH_OFFSET_Y, 0, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the mercs contract length
  swprintf(sText, "%d", pSoldier.value.iTotalContractLength);
  DrawTextToScreen(sText, (usPosX + INS_CTRCT_OG_BOX_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_LENGTH_OFFSET_Y, INS_CTRCT_OG_BOX_WIDTH, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

  // Display the days remaining for the emplyment contract text
  GetInsuranceText(Enum90.INS_SNGL_DAYS_REMAINING, sText);
  DrawTextToScreen(sText, (usPosX + INS_CTRCT_LENGTH_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_DAYS_REMAINING_OFFSET_Y, 0, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // display the amount of time the merc has left on their Regular contract
  if (IsMercDead(ubMercID))
    swprintf(sText, "%s", pMessageStrings[Enum333.MSG_LOWERCASE_NA]);
  else
    swprintf(sText, "%d", GetTimeRemainingOnSoldiersContract(pSoldier));

  DrawTextToScreen(sText, (usPosX + INS_CTRCT_OG_BOX_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_DAYS_REMAINING_OFFSET_Y, INS_CTRCT_OG_BOX_WIDTH, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

  // Display the Insurqance contract
  GetInsuranceText(Enum90.INS_SNGL_INSURANCE_CONTRACT, sText);
  DrawTextToScreen(sText, (usPosX + INS_CTRCT_EMPLYMNT_CNTRCT_TEXT_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_INSURANCE_CNTRCT_OFFSET_Y, INS_CTRCT_ORDER_GRID_WIDTH, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  GetInsuranceText(Enum90.INS_SNGL_LENGTH, sText);
  DrawTextToScreen(sText, (usPosX + INS_CTRCT_LENGTH_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_LENGTH_OFFSET_Y + 54, 0, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  // Display the insurance days remaining text
  GetInsuranceText(Enum90.INS_SNGL_DAYS_REMAINING, sText);
  DrawTextToScreen(sText, (usPosX + INS_CTRCT_LENGTH_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_DAYS_REMAINING_OFFSET_Y + 54, 0, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED);

  //
  // display the amount of time the merc has left on the insurance contract
  //

  // if the soldier has insurance, disply the length of time the merc has left
  if (IsMercDead(ubMercID))
    swprintf(sText, "%s", pMessageStrings[Enum333.MSG_LOWERCASE_NA]);

  else if (pSoldier.value.usLifeInsurance != 0)
    swprintf(sText, "%d", GetTimeRemainingOnSoldiersInsuranceContract(pSoldier));

  else
    swprintf(sText, "%d", 0);

  DrawTextToScreen(sText, (usPosX + INS_CTRCT_OG_BOX_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_DAYS_REMAINING_OFFSET_Y + 54, INS_CTRCT_OG_BOX_WIDTH, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

  //
  // Calculate the insurance cost
  //

  // if the soldier can get insurance, calculate a new cost
  if (CanSoldierExtendInsuranceContract(pSoldier)) {
    iCostOfContract = CalculateInsuranceContractCost(CalculateSoldiersInsuranceContractLength(pSoldier), pSoldier.value.ubProfile);
  }

  else {
    iCostOfContract = 0;
  }

  if (iCostOfContract < 0) {
    // shouldnt get in here now since we can longer give refunds
    Assert(0);
  } else {
    // Display the premium owing text
    GetInsuranceText(Enum90.INS_SNGL_PREMIUM_OWING, sText);
    DrawTextToScreen(sText, (usPosX + INS_CTRCT_EMPLYMNT_CNTRCT_TEXT_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_PREMIUM_OWING_OFFSET_Y, INS_CTRCT_ORDER_GRID_WIDTH, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

    // display the amount of refund
    swprintf(sText, "%d", iCostOfContract);
    InsertCommasForDollarFigure(sText);
    InsertDollarSignInToString(sText);
  }

  if (IsMercDead(ubMercID)) {
    swprintf(sText, "0");
    InsertDollarSignInToString(sText);
  }
  // display the amount owing
  DrawTextToScreen(sText, (usPosX + 32), INS_CTRCT_ORDER_GRID1_Y + 179, 72, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

  //
  // Get the insurance contract length for the merc
  //
  swprintf(sText, "%d", CalculateSoldiersInsuranceContractLength(pSoldier));

  // Display the length of time the player can get for the insurance contract
  DrawTextToScreen(sText, (usPosX + INS_CTRCT_OG_BOX_OFFSET_X), INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_LENGTH_OFFSET_Y + 52 + 2, INS_CTRCT_OG_BOX_WIDTH, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, FALSE, RIGHT_JUSTIFIED);

  return TRUE;
}

function BtnInsuranceAcceptClearForm1ButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);
      let ubSoldierID: UINT8 = GetSoldierIDFromMercID(gubMercIDForMercInForm1);

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      // the accept button
      if (ubButton == 0) {
        // handle the accept button, (global to all accept button
        HandleAcceptButton(ubSoldierID, 1);

        // specify the length of the insurance contract
        Menptr[ubSoldierID].iTotalLengthOfInsuranceContract = gsForm1InsuranceLengthNumber;

        // reset the insurance length
        gsForm1InsuranceLengthNumber = 0;
      }

      // redraw the screen
      fPausedReDrawScreenFlag = TRUE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnInsuranceAcceptClearForm2ButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);
      let ubSoldierID: UINT8 = GetSoldierIDFromMercID(gubMercIDForMercInForm2);

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      // the accept button
      if (ubButton == 0) {
        // handle the accept button, (global to all accept button
        HandleAcceptButton(ubSoldierID, 2);

        // specify the length of the insurance contract
        Menptr[ubSoldierID].iTotalLengthOfInsuranceContract = gsForm2InsuranceLengthNumber;

        // reset the insurance length
        gsForm2InsuranceLengthNumber = 0;
      }

      // redraw the screen
      fPausedReDrawScreenFlag = TRUE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnInsuranceAcceptClearForm3ButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      let ubButton: UINT8 = MSYS_GetBtnUserData(btn, 0);
      let ubSoldierID: UINT8 = GetSoldierIDFromMercID(gubMercIDForMercInForm3);

      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      // the accept button
      if (ubButton == 0) {
        // handle the accept button, (global to all accept button
        HandleAcceptButton(ubSoldierID, 3);

        // specify the length of the insurance contract
        Menptr[ubSoldierID].iTotalLengthOfInsuranceContract = gsForm3InsuranceLengthNumber;

        // reset the insurance length
        gsForm3InsuranceLengthNumber = 0;
      }

      // redraw the screen
      fPausedReDrawScreenFlag = TRUE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function GetNumberOfHireMercsStartingFromID(ubStartMercID: UINT8): INT8 {
  let i: UINT8;
  let ubCount: UINT8 = 0;

  for (i = 0; i < gsMaxPlayersOnTeam; i++) {
    if (i >= ubStartMercID) {
      ubCount++;
    }
  }

  return ubCount;
}

/*
INT32 CalculateInsuranceCost( SOLDIERTYPE *pSoldier, BOOLEAN fHaveInsurance )
{
        INT32			iAmount=0;
        UINT32		uiInsuranceContractLength = 0;

        uiInsuranceContractLength = CalculateSoldiersInsuranceContractLength( pSoldier );

        //If the soldier already has life insurance, then the user is changing the length of the contract
        if( pSoldier->usLifeInsurance )
        {
                //if the user is changing the contract length
                if( uiInsuranceContractLength != 0 )
                {
                        iAmount = CalculateInsuranceContractCost( uiInsuranceContractLength, pSoldier->ubProfile);
                }
                //else we are just calculating the new figure
                else
                {
                        iAmount = 0;
                }
        }
        //else the merc doesn't have life insurance
        else
        {
                iAmount = CalculateInsuranceContractCost( uiInsuranceContractLength, pSoldier->ubProfile);
        }

        return( iAmount );
}
*/

function SelectInsuranceContractRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let uiInsuranceLink: UINT32 = MSYS_GetRegionUserData(pRegion, 0);

    if (uiInsuranceLink == 0)
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE;
    else if (uiInsuranceLink == 1)
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE_INFO;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function CountInsurableMercs(): INT8 {
  let cnt: INT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bLastTeamID: INT16;
  let bCount: INT8 = 0;

  // Set locator to first merc
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

  for (pSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pSoldier++) {
    if (MercIsInsurable(pSoldier)) {
      bCount++;
    }
  }

  return bCount;
}

function DisableInsuranceContractNextPreviousbuttons(): void {
  // disable the next button if there is no more mercs to display
  if ((gsCurrentInsuranceMercIndex + gubNumberofDisplayedInsuranceGrids) < CountInsurableMercs()) {
    EnableButton(guiInsContractNextBackButton);
  } else
    DisableButton(guiInsContractNextBackButton);

  // if we are currently displaying the first set of mercs, disable the previous button
  if (gsCurrentInsuranceMercIndex < 3) {
    DisableButton(guiInsContractPrevBackButton);
  } else
    EnableButton(guiInsContractPrevBackButton);
}

function CreateDestroyInsuranceContractFormButtons(fCreate: BOOLEAN): void {
  /* static */ let fButtonsCreated: BOOLEAN = FALSE;

  if (fCreate && !fButtonsCreated) {
    // place the 3 accept buttons for the different forms

    // The accept button image
    guiInsuranceAcceptClearForm1ButtonImage = LoadButtonImage("LAPTOP\\AcceptClearBox.sti", -1, 0, -1, 1, -1);

    if (gubNumberofDisplayedInsuranceGrids >= 1) {
      // the accept button for form 1
      guiInsuranceAcceptClearForm1Button = CreateIconAndTextButton(guiInsuranceAcceptClearForm1ButtonImage, InsContractText[Enum338.INS_CONTRACT_ACCEPT], INS_FONT_MED(), INS_FONT_BTN_COLOR, INS_FONT_BTN_SHADOW_COLOR, INS_FONT_BTN_COLOR, INS_FONT_BTN_SHADOW_COLOR, TEXT_CJUSTIFIED, INS_CTRCT_ORDER_GRID1_X + INS_CTRCT_ACCEPT_BTN_X, INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_ACCEPT_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnInsuranceAcceptClearForm1ButtonCallback);
      SetButtonCursor(guiInsuranceAcceptClearForm1Button, Enum317.CURSOR_LAPTOP_SCREEN);
      MSYS_SetBtnUserData(guiInsuranceAcceptClearForm1Button, 0, 0);
    }

    if (gubNumberofDisplayedInsuranceGrids >= 2) {
      // the accept button for form 2
      guiInsuranceAcceptClearForm2Button = CreateIconAndTextButton(guiInsuranceAcceptClearForm1ButtonImage, InsContractText[Enum338.INS_CONTRACT_ACCEPT], INS_FONT_MED(), INS_FONT_BTN_COLOR, INS_FONT_BTN_SHADOW_COLOR, INS_FONT_BTN_COLOR, INS_FONT_BTN_SHADOW_COLOR, TEXT_CJUSTIFIED, INS_CTRCT_ORDER_GRID2_X + INS_CTRCT_ACCEPT_BTN_X, INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_ACCEPT_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnInsuranceAcceptClearForm2ButtonCallback);
      SetButtonCursor(guiInsuranceAcceptClearForm2Button, Enum317.CURSOR_LAPTOP_SCREEN);
      MSYS_SetBtnUserData(guiInsuranceAcceptClearForm2Button, 0, 0);
    }

    if (gubNumberofDisplayedInsuranceGrids >= 3) {
      // the accept button for form 3
      guiInsuranceAcceptClearForm3Button = CreateIconAndTextButton(guiInsuranceAcceptClearForm1ButtonImage, InsContractText[Enum338.INS_CONTRACT_ACCEPT], INS_FONT_MED(), INS_FONT_BTN_COLOR, INS_FONT_BTN_SHADOW_COLOR, INS_FONT_BTN_COLOR, INS_FONT_BTN_SHADOW_COLOR, TEXT_CJUSTIFIED, INS_CTRCT_ORDER_GRID3_X + INS_CTRCT_ACCEPT_BTN_X, INS_CTRCT_ORDER_GRID1_Y + INS_CTRCT_ACCEPT_BTN_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnInsuranceAcceptClearForm3ButtonCallback);
      SetButtonCursor(guiInsuranceAcceptClearForm3Button, Enum317.CURSOR_LAPTOP_SCREEN);
      MSYS_SetBtnUserData(guiInsuranceAcceptClearForm3Button, 0, 0);
    }

    fButtonsCreated = TRUE;
  }

  if (fButtonsCreated && !fCreate) {
    // the accept image
    UnloadButtonImage(guiInsuranceAcceptClearForm1ButtonImage);

    if (gubNumberofDisplayedInsuranceGrids >= 1) {
      // the accept for the first form
      RemoveButton(guiInsuranceAcceptClearForm1Button);
    }

    if (gubNumberofDisplayedInsuranceGrids >= 2) {
      // the accept clear for the second form
      RemoveButton(guiInsuranceAcceptClearForm2Button);
    }

    if (gubNumberofDisplayedInsuranceGrids >= 3) {
      // the accept clear for the third form
      RemoveButton(guiInsuranceAcceptClearForm3Button);
    }

    fButtonsCreated = FALSE;
  }
}

function HandleAcceptButton(ubSoldierID: UINT8, ubFormID: UINT8): void {
  let iAmountOfMoneyTransfer: INT32 = -1;

  // passed in either 1,2,3 should be 0,1,2
  ubFormID--;

  PurchaseOrExtendInsuranceForSoldier(addressof(Menptr[ubSoldierID]), CalculateSoldiersInsuranceContractLength(addressof(Menptr[ubSoldierID])));

  RenderInsuranceContract();
}

// determines if a merc will run out of their insurance contract
function DailyUpdateOfInsuredMercs(): void {
  let cnt: INT16;
  let bLastTeamID: INT16;
  let pSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;

  for (pSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pSoldier++) {
    // if the soldier is in the team array
    if (pSoldier.value.bActive) {
      // if the merc has life insurance
      if (pSoldier.value.usLifeInsurance) {
        // if the merc wasn't just hired
        if (GetWorldDay() != pSoldier.value.iStartOfInsuranceContract) {
          // if the contract has run out of time
          if (GetTimeRemainingOnSoldiersInsuranceContract(pSoldier) <= 0) {
            // if the soldier isn't dead
            if (!IsMercDead(pSoldier.value.ubProfile)) {
              pSoldier.value.usLifeInsurance = 0;
              pSoldier.value.iTotalLengthOfInsuranceContract = 0;
              pSoldier.value.iStartOfInsuranceContract = 0;
            }
          }
        }
      }
    }
  }
}

const MIN_INSURANCE_RATIO = 0.1;
const MAX_INSURANCE_RATIO = 10.0;

function CalculateInsuranceContractCost(iLength: INT32, ubMercID: UINT8): INT32 {
  let pProfile: Pointer<MERCPROFILESTRUCT>;
  let sTotalSkill: INT16 = 0;
  let flSkillFactor: FLOAT;
  let flFitnessFactor: FLOAT;
  let flExpFactor: FLOAT;
  let flSurvivalFactor: FLOAT;
  let flRiskFactor: FLOAT;
  let uiDailyInsurancePremium: UINT32;
  let uiTotalInsurancePremium: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  pSoldier = addressof(Menptr[GetSoldierIDFromMercID(ubMercID)]);

  // only mercs with at least 2 days to go on their employment contract are insurable
  // def: 2/5/99.  However if they already have insurance is SHOULD be ok
  if (GetTimeRemainingOnSoldiersContract(pSoldier) < 2 && !(pSoldier.value.usLifeInsurance != 0 && GetTimeRemainingOnSoldiersContract(pSoldier) >= 1)) {
    return 0;
  }

  // If the merc is currently being held captive, get out
  if (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
    return 0;
  }

  /*
          replaced with the above check

          if (iLength < 2)
          {
                  return(0);
          }
          */

  pProfile = addressof(gMercProfiles[ubMercID]);

  // calculate the degree of training
  sTotalSkill = (pProfile.value.bMarksmanship + pProfile.value.bMedical + pProfile.value.bMechanical + pProfile.value.bExplosive + pProfile.value.bLeadership) / 5;
  flSkillFactor = DiffFromNormRatio(sTotalSkill, INS_CTRCT_SKILL_BASE);

  // calc relative fitness level
  flFitnessFactor = DiffFromNormRatio(pProfile.value.bLife, INS_CTRCT_FITNESS_BASE);

  // calc relative experience
  flExpFactor = DiffFromNormRatio(pProfile.value.bExpLevel, INS_CTRCT_EXP_LEVEL_BASE);

  // calc player's survival rate (death rate subtracted from 100)
  flSurvivalFactor = DiffFromNormRatio((100 - CalcDeathRate()), INS_CTRCT_SURVIVAL_BASE);

  // calculate the overall insurability risk factor for this merc by combining all the subfactors
  flRiskFactor = flSkillFactor * flFitnessFactor * flExpFactor * flSurvivalFactor;

  // restrict the overall factor to within reasonable limits
  if (flRiskFactor < MIN_INSURANCE_RATIO) {
    flRiskFactor = MIN_INSURANCE_RATIO;
  } else if (flRiskFactor > MAX_INSURANCE_RATIO) {
    flRiskFactor = MAX_INSURANCE_RATIO;
  }

  // premium depend on merc's salary, the base insurance rate, and the individual's risk factor at this time
  uiDailyInsurancePremium = (((pProfile.value.sSalary * INSURANCE_PREMIUM_RATE * flRiskFactor) / 100) + 0.5);
  // multiply by the insurance contract length
  uiTotalInsurancePremium = uiDailyInsurancePremium * iLength;

  return uiTotalInsurancePremium;
}

// values passed in must be such that exceeding the normal value REDUCES insurance premiums
function DiffFromNormRatio(sThisValue: INT16, sNormalValue: INT16): FLOAT {
  let flRatio: FLOAT;

  if (sThisValue > 0) {
    flRatio = sNormalValue / sThisValue;

    // restrict each ratio to within a reasonable range
    if (flRatio < MIN_INSURANCE_RATIO) {
      flRatio = MIN_INSURANCE_RATIO;
    } else if (flRatio > MAX_INSURANCE_RATIO) {
      flRatio = MAX_INSURANCE_RATIO;
    }
  } else {
    // use maximum allowable ratio
    flRatio = MAX_INSURANCE_RATIO;
  }

  return flRatio;
}

function InsContractNoMercsPopupCallBack(bExitValue: UINT8): void {
  // yes, so start over, else stay here and do nothing for now
  if (bExitValue == MSG_BOX_RETURN_OK) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE;
  }

  return;
}

function BuildInsuranceArray(): void {
  let cnt: INT16;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bLastTeamID: INT16;

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  bLastTeamID = gTacticalStatus.Team[gbPlayerNum].bLastID;
  gsMaxPlayersOnTeam = 0;

  // store profile #s of all insurable mercs in an array
  for (pSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pSoldier++) {
    if (MercIsInsurable(pSoldier)) {
      gubInsuranceMercArray[gsMaxPlayersOnTeam] = pSoldier.value.ubProfile;
      gsMaxPlayersOnTeam++;
    }
  }
}

function AddLifeInsurancePayout(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let ubPayoutID: UINT8;
  let uiTimeInMinutes: UINT32;
  let pProfile: Pointer<MERCPROFILESTRUCT>;
  let uiCostPerDay: UINT32;
  let uiDaysToPay: UINT32;

  Assert(pSoldier != NULL);
  Assert(pSoldier.value.ubProfile != NO_PROFILE);

  pProfile = addressof(gMercProfiles[pSoldier.value.ubProfile]);

  // if we need to add more array elements
  if (LaptopSaveInfo.ubNumberLifeInsurancePayouts <= LaptopSaveInfo.ubNumberLifeInsurancePayoutUsed) {
    LaptopSaveInfo.ubNumberLifeInsurancePayouts++;
    LaptopSaveInfo.pLifeInsurancePayouts = MemRealloc(LaptopSaveInfo.pLifeInsurancePayouts, sizeof(LIFE_INSURANCE_PAYOUT) * LaptopSaveInfo.ubNumberLifeInsurancePayouts);
    if (LaptopSaveInfo.pLifeInsurancePayouts == NULL)
      return FALSE;

    memset(addressof(LaptopSaveInfo.pLifeInsurancePayouts[LaptopSaveInfo.ubNumberLifeInsurancePayouts - 1]), 0, sizeof(LIFE_INSURANCE_PAYOUT));
  }

  for (ubPayoutID = 0; ubPayoutID < LaptopSaveInfo.ubNumberLifeInsurancePayouts; ubPayoutID++) {
    // get an empty element in the array
    if (!LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].fActive)
      break;
  }

  LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubSoldierID = pSoldier.value.ubID;
  LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID = pSoldier.value.ubProfile;
  LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].fActive = TRUE;

  // This uses the merc's latest salaries, ignoring that they may be higher than the salaries paid under the current
  // contract if the guy has recently gained a level.  We could store his daily salary when he was last contracted,
  // and use that, but it still doesn't easily account for the fact that renewing a leveled merc early means that the
  // first part of his contract is under his old salary and the second part is under his new one.  Therefore, I chose
  // to ignore this wrinkle, and let the player awlays get paid out using the higher amount.  ARM

  // figure out which of the 3 salary rates the merc has is the cheapest, and use it to calculate the paid amount, to
  // avoid getting back more than the merc cost if he was on a 2-week contract!

  // start with the daily salary
  uiCostPerDay = pProfile.value.sSalary;

  // consider weekly salary / day
  if ((pProfile.value.uiWeeklySalary / 7) < uiCostPerDay) {
    uiCostPerDay = (pProfile.value.uiWeeklySalary / 7);
  }

  // consider biweekly salary / day
  if ((pProfile.value.uiBiWeeklySalary / 14) < uiCostPerDay) {
    uiCostPerDay = (pProfile.value.uiBiWeeklySalary / 14);
  }

  // calculate how many full, insured days of work the merc is going to miss
  uiDaysToPay = pSoldier.value.iTotalLengthOfInsuranceContract - (GetWorldDay() + 1 - pSoldier.value.iStartOfInsuranceContract);

  // calculate & store how much is to be paid out
  LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].iPayOutPrice = uiDaysToPay * uiCostPerDay;

  // 4pm next day
  uiTimeInMinutes = GetMidnightOfFutureDayInMinutes(1) + 16 * 60;

  // if the death was suspicious, or he's already been investigated twice or more
  if (pProfile.value.ubSuspiciousDeath || (gStrategicStatus.ubInsuranceInvestigationsCnt >= 2)) {
    // fraud suspected, claim will be investigated first
    AddStrategicEvent(Enum132.EVENT_INSURANCE_INVESTIGATION_STARTED, uiTimeInMinutes, ubPayoutID);
  } else {
    // is ok, make a prompt payment
    AddStrategicEvent(Enum132.EVENT_PAY_LIFE_INSURANCE_FOR_DEAD_MERC, uiTimeInMinutes, ubPayoutID);
  }

  LaptopSaveInfo.ubNumberLifeInsurancePayoutUsed++;

  return TRUE;
}

function StartInsuranceInvestigation(ubPayoutID: UINT8): void {
  let ubDays: UINT8;

  // send an email telling player an investigation is taking place
  if (gStrategicStatus.ubInsuranceInvestigationsCnt == 0) {
    // first offense
    AddEmailWithSpecialData(INSUR_SUSPIC, INSUR_SUSPIC_LENGTH, Enum75.INSURANCE_COMPANY, GetWorldTotalMin(), LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].iPayOutPrice, LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID);
  } else {
    // subsequent offense
    AddEmailWithSpecialData(INSUR_SUSPIC_2, INSUR_SUSPIC_2_LENGTH, Enum75.INSURANCE_COMPANY, GetWorldTotalMin(), LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].iPayOutPrice, LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID);
  }

  if (gMercProfiles[LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID].ubSuspiciousDeath == VERY_SUSPICIOUS_DEATH) {
    // the fact that you tried to cheat them gets realized very quickly. :-)
    ubDays = 1;
  } else {
    // calculate how many days the investigation will take
    ubDays = (2 + gStrategicStatus.ubInsuranceInvestigationsCnt + Random(3)); // 2-4 days, +1 for every previous investigation
  }

  // post an event to end the investigation that many days in the future (at 4pm)
  AddStrategicEvent(Enum132.EVENT_INSURANCE_INVESTIGATION_OVER, GetMidnightOfFutureDayInMinutes(ubDays) + 16 * 60, ubPayoutID);

  // increment counter of all investigations
  gStrategicStatus.ubInsuranceInvestigationsCnt++;
}

function EndInsuranceInvestigation(ubPayoutID: UINT8): void {
  // send an email telling player the investigation is over
  if (gMercProfiles[LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID].ubSuspiciousDeath == VERY_SUSPICIOUS_DEATH) {
    // fraud, no payout!
    AddEmailWithSpecialData(INSUR_1HOUR_FRAUD, INSUR_1HOUR_FRAUD_LENGTH, Enum75.INSURANCE_COMPANY, GetWorldTotalMin(), LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].iPayOutPrice, LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID);
  } else {
    AddEmailWithSpecialData(INSUR_INVEST_OVER, INSUR_INVEST_OVER_LENGTH, Enum75.INSURANCE_COMPANY, GetWorldTotalMin(), LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].iPayOutPrice, LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID);

    // only now make a payment (immediately)
    InsuranceContractPayLifeInsuranceForDeadMerc(ubPayoutID);
  }
}

// void InsuranceContractPayLifeInsuranceForDeadMerc( LIFE_INSURANCE_PAYOUT *pPayoutStruct )
function InsuranceContractPayLifeInsuranceForDeadMerc(ubPayoutID: UINT8): void {
  // if the mercs id number is the same what is in the soldier array
  if (LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubSoldierID == Menptr[LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubSoldierID].ubID) {
    // and if the soldier is still active ( player hasn't removed carcass yet ), reset insurance flag
    if (Menptr[LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubSoldierID].bActive)
      Menptr[LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubSoldierID].usLifeInsurance = 0;
  }

  // add transaction to players account
  AddTransactionToPlayersBook(Enum80.INSURANCE_PAYOUT, LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID, GetWorldTotalMin(), LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].iPayOutPrice);

  // add to the history log the fact that the we paid the insurance claim
  AddHistoryToPlayersLog(Enum83.HISTORY_INSURANCE_CLAIM_PAYOUT, LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID, GetWorldTotalMin(), -1, -1);

  // if there WASNT an investigation
  if (gMercProfiles[LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID].ubSuspiciousDeath == 0) {
    // Add an email telling the user that he received an insurance payment
    AddEmailWithSpecialData(INSUR_PAYMENT, INSUR_PAYMENT_LENGTH, Enum75.INSURANCE_COMPANY, GetWorldTotalMin(), LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].iPayOutPrice, LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].ubMercID);
  }

  LaptopSaveInfo.ubNumberLifeInsurancePayoutUsed--;
  LaptopSaveInfo.pLifeInsurancePayouts[ubPayoutID].fActive = FALSE;
  //	MemFree( pPayoutStruct );
}

// Gets called at the very end of the game
function InsuranceContractEndGameShutDown(): void {
  // Free up the memory allocated to the insurance payouts
  if (LaptopSaveInfo.pLifeInsurancePayouts) {
    MemFree(LaptopSaveInfo.pLifeInsurancePayouts);
    LaptopSaveInfo.pLifeInsurancePayouts = NULL;
  }
}

function MercIsInsurable(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // only A.I.M. mercs currently on player's team
  if ((pSoldier.value.bActive) && (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC)) {
    // with more than one day left on their employment contract are eligible for insurance
    // the second part is because the insurance doesn't pay for any working day already started at time of death
    //		if( ( (pSoldier->iEndofContractTime - GetWorldTotalMin()) > 24 * 60) || pSoldier->usLifeInsurance )
    if (CanSoldierExtendInsuranceContract(pSoldier) || pSoldier.value.usLifeInsurance) {
      // who aren't currently being held POW
      // POWs are also uninsurable - if already insured, that insurance IS valid but no new contracts or extension allowed
      if (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_POW) {
        return TRUE;
      }
    }
  }

  return FALSE;
}

function EnableDisableInsuranceContractAcceptButtons(): void {
  // If it is the first grid
  if (gubNumberofDisplayedInsuranceGrids >= 1) {
    EnableDisableIndividualInsuranceContractButton(gubMercIDForMercInForm1, addressof(guiInsuranceAcceptClearForm1Button));
  }

  // If it is the 2nd grid
  if (gubNumberofDisplayedInsuranceGrids >= 2) {
    EnableDisableIndividualInsuranceContractButton(gubMercIDForMercInForm2, addressof(guiInsuranceAcceptClearForm2Button));
  }

  // If it is the 3rd grid
  if (gubNumberofDisplayedInsuranceGrids >= 3) {
    EnableDisableIndividualInsuranceContractButton(gubMercIDForMercInForm3, addressof(guiInsuranceAcceptClearForm3Button));
  }
}

function EnableDisableIndividualInsuranceContractButton(ubMercIDForMercInForm: UINT8, puiAcceptButton: Pointer<UINT32>): void {
  let sSoldierID: INT16 = 0;

  sSoldierID = GetSoldierIDFromMercID(ubMercIDForMercInForm);
  if (sSoldierID == -1)
    return;

  // if the soldiers contract can be extended, enable the button
  if (CanSoldierExtendInsuranceContract(addressof(Menptr[sSoldierID])))
    EnableButton(puiAcceptButton.value);

  // else the soldier cant extend their insurance contract, disable the button
  else
    DisableButton(puiAcceptButton.value);

  // if the merc is dead, disable the button
  if (IsMercDead(ubMercIDForMercInForm))
    DisableButton(puiAcceptButton.value);
}

/*
UINT32	GetContractLengthForFormNumber( UINT8 ubFormID )
{
        UINT8	ubMercID;
        SOLDIERTYPE	*pSoldier;

        switch( ubFormID )
        {
                case 0:
                        ubMercID = gubMercIDForMercInForm1;
                        break;
                case 1:
                        ubMercID = gubMercIDForMercInForm1;
                        break;
                case 2:
                        ubMercID = gubMercIDForMercInForm1;
                        break;

                default:
                        Assert( 0 );
                        break;
        }

        pSoldier = &Menptr[ GetSoldierIDFromMercID( ubMercID ) ];

        return( pSoldier->iTotalContractLength );
}
*/

function GetTimeRemainingOnSoldiersInsuranceContract(pSoldier: Pointer<SOLDIERTYPE>): UINT32 {
  // if the soldier has life insurance
  if (pSoldier.value.usLifeInsurance) {
    // if the insurance contract hasnt started yet
    if (GetWorldDay() < pSoldier.value.iStartOfInsuranceContract)
      return pSoldier.value.iTotalLengthOfInsuranceContract;
    else
      return pSoldier.value.iTotalLengthOfInsuranceContract - (GetWorldDay() - pSoldier.value.iStartOfInsuranceContract);
  } else
    return 0;
}

function GetTimeRemainingOnSoldiersContract(pSoldier: Pointer<SOLDIERTYPE>): UINT32 {
  let iDayMercLeaves: INT32 = (pSoldier.value.iEndofContractTime / 1440) - 1;

  // Since the merc is leaving in the afternoon, we must adjust since the time left would be different if we did the calc
  // at 11:59 or 12:01 ( noon )
  if (pSoldier.value.iEndofContractTime % 1440)
    iDayMercLeaves++;

  // Subtract todays day number
  iDayMercLeaves = iDayMercLeaves - GetWorldDay();

  if (iDayMercLeaves > pSoldier.value.iTotalContractLength)
    iDayMercLeaves = pSoldier.value.iTotalContractLength;

  return iDayMercLeaves;
  //	return( ( pSoldier->iEndofContractTime - (INT32)GetWorldTotalMin( ) ) / 1440 );
}

function PurchaseOrExtendInsuranceForSoldier(pSoldier: Pointer<SOLDIERTYPE>, uiInsuranceLength: UINT32): void {
  let iAmountOfMoneyTransfer: INT32 = -1;

  if (pSoldier == NULL)
    AssertMsg(0, "Soldier pointer is NULL!");

  // if the user doesnt have insruance already,
  if (!(pSoldier.value.usLifeInsurance)) {
    // specify the start date of the contract
    pSoldier.value.iStartOfInsuranceContract = CalcStartDayOfInsurance(pSoldier);
    pSoldier.value.uiStartTimeOfInsuranceContract = GetWorldTotalMin();
  }

  // transfer money
  iAmountOfMoneyTransfer = CalculateInsuranceContractCost(uiInsuranceLength, pSoldier.value.ubProfile);

  // if the user did have insruance already,
  if (pSoldier.value.usLifeInsurance) {
    // specify the start date of the contract
    pSoldier.value.iStartOfInsuranceContract = CalcStartDayOfInsurance(pSoldier);
  }

  // add transaction to finaces page
  // if the player has life insurance
  if (pSoldier.value.usLifeInsurance) {
    // if the player is extending the contract
    if (iAmountOfMoneyTransfer > 0)
      AddTransactionToPlayersBook(Enum80.EXTENDED_INSURANCE, pSoldier.value.ubProfile, GetWorldTotalMin(), -(iAmountOfMoneyTransfer));
    else
      Assert(0);
  } else {
    // if the player doesnt have enough money, tell him
    if (LaptopSaveInfo.iCurrentBalance < iAmountOfMoneyTransfer) {
      let sText: wchar_t[] /* [800] */;

      GetInsuranceText(Enum90.INS_MLTI_NOT_ENOUGH_FUNDS, sText);
      if (guiCurrentScreen == Enum26.LAPTOP_SCREEN)
        DoLapTopMessageBox(Enum24.MSG_BOX_RED_ON_WHITE, sText, Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, NULL);
      else
        DoMapMessageBox(Enum24.MSG_BOX_RED_ON_WHITE, sText, Enum26.MAP_SCREEN, MSG_BOX_FLAG_OK, NULL);
    } else {
      // else if the player has enought to cover the bill, let him

      // the player just purchased life insurance
      AddTransactionToPlayersBook(Enum80.PURCHASED_INSURANCE, pSoldier.value.ubProfile, GetWorldTotalMin(), -(iAmountOfMoneyTransfer));

      // add an entry in the history page for the purchasing of life insurance
      AddHistoryToPlayersLog(Enum83.HISTORY_PURCHASED_INSURANCE, pSoldier.value.ubProfile, GetWorldTotalMin(), -1, -1);

      // Set that we have life insurance
      pSoldier.value.usLifeInsurance = 1;
    }
  }

  pSoldier.value.iTotalLengthOfInsuranceContract += uiInsuranceLength;

  // make sure the length doesnt exceed the contract length
  if ((GetTimeRemainingOnSoldiersInsuranceContract(pSoldier)) > GetTimeRemainingOnSoldiersContract(pSoldier)) {
    pSoldier.value.iTotalLengthOfInsuranceContract -= GetTimeRemainingOnSoldiersInsuranceContract(pSoldier) - GetTimeRemainingOnSoldiersContract(pSoldier);
  }
}

function CanSoldierExtendInsuranceContract(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  if (CalculateSoldiersInsuranceContractLength(pSoldier) != 0)
    return TRUE;
  else
    return FALSE;
}

function CalculateSoldiersInsuranceContractLength(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let iInsuranceContractLength: INT32 = 0;
  let uiTimeRemainingOnSoldiersContract: UINT32 = GetTimeRemainingOnSoldiersContract(pSoldier);

  // if the merc is dead
  if (IsMercDead(pSoldier.value.ubProfile))
    return 0;

  // only mercs with at least 2 days to go on their employment contract are insurable
  // def: 2/5/99.  However if they already have insurance is SHOULD be ok
  if (uiTimeRemainingOnSoldiersContract < 2 && !(pSoldier.value.usLifeInsurance != 0 && uiTimeRemainingOnSoldiersContract >= 1)) {
    return 0;
  }

  //
  // Calculate the insurance contract length
  //

  // if the soldier has an insurance contract, dont deduct a day
  if (pSoldier.value.usLifeInsurance || DidGameJustStart())
    iInsuranceContractLength = uiTimeRemainingOnSoldiersContract - GetTimeRemainingOnSoldiersInsuranceContract(pSoldier);

  // else deduct a day
  else
    iInsuranceContractLength = uiTimeRemainingOnSoldiersContract - GetTimeRemainingOnSoldiersInsuranceContract(pSoldier) - 1;

  // make sure the length doesnt exceed the contract length
  if ((GetTimeRemainingOnSoldiersInsuranceContract(pSoldier) + iInsuranceContractLength) > uiTimeRemainingOnSoldiersContract) {
    iInsuranceContractLength = uiTimeRemainingOnSoldiersContract - GetTimeRemainingOnSoldiersInsuranceContract(pSoldier);
  }

  // Is the mercs insurace contract is less then a day, set it to 0
  if (iInsuranceContractLength < 0)
    iInsuranceContractLength = 0;

  if (pSoldier.value.usLifeInsurance && pSoldier.value.iStartOfInsuranceContract >= GetWorldDay() && iInsuranceContractLength < 2)
    iInsuranceContractLength = 0;

  return iInsuranceContractLength;
}

function CalcStartDayOfInsurance(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let uiDayToStartInsurance: UINT32 = 0;

  // if the soldier was just hired ( in transit ), and the game didnt just start
  if (pSoldier.value.bAssignment == Enum117.IN_TRANSIT && !DidGameJustStart()) {
    uiDayToStartInsurance = GetWorldDay();
  } else {
    // Get tomorows date ( and convert it to days )
    uiDayToStartInsurance = GetMidnightOfFutureDayInMinutes(1) / 1440;
  }

  return uiDayToStartInsurance;
}

function AreAnyAimMercsOnTeam(): BOOLEAN {
  let sNextMercID: INT16 = 0;
  let fIsThereAnyAimMercs: BOOLEAN = FALSE;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;

  for (sNextMercID = 0; sNextMercID <= gTacticalStatus.Team[gbPlayerNum].bLastID; sNextMercID++) {
    pSoldier = addressof(Menptr[GetSoldierIDFromMercID(sNextMercID)]);

    // check to see if any of the mercs are AIM mercs
    if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__AIM_MERC) {
      fIsThereAnyAimMercs = TRUE;
    }
  }

  return fIsThereAnyAimMercs;
}
