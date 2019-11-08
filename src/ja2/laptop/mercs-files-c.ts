namespace ja2 {

const MERCBIOFILE = "BINARYDATA\\MercBios.edt";

const MERC_BIO_FONT = () => FONT14ARIAL(); // FONT12ARIAL
const MERC_BIO_COLOR = FONT_MCOLOR_WHITE;

const MERC_TITLE_FONT = () => FONT14ARIAL();
const MERC_TITLE_COLOR = 146;

const MERC_NAME_FONT = () => FONT14ARIAL();
const MERC_NAME_COLOR = FONT_MCOLOR_WHITE;

const MERC_STATS_FONT = () => FONT12ARIAL();
const MERC_STATIC_STATS_COLOR = 146;
const MERC_DYNAMIC_STATS_COLOR = FONT_MCOLOR_WHITE;

const MERC_FILES_PORTRAIT_BOX_X = LAPTOP_SCREEN_UL_X + 16;
const MERC_FILES_PORTRAIT_BOX_Y = LAPTOP_SCREEN_WEB_UL_Y + 17;

const MERC_FACE_X = MERC_FILES_PORTRAIT_BOX_X + 2;
const MERC_FACE_Y = MERC_FILES_PORTRAIT_BOX_Y + 2;
const MERC_FACE_WIDTH = 106;
const MERC_FACE_HEIGHT = 122;

const MERC_FILES_STATS_BOX_X = LAPTOP_SCREEN_UL_X + 164;
const MERC_FILES_STATS_BOX_Y = MERC_FILES_PORTRAIT_BOX_Y;

const MERC_FILES_BIO_BOX_X = MERC_FILES_PORTRAIT_BOX_X;
const MERC_FILES_BIO_BOX_Y = LAPTOP_SCREEN_WEB_UL_Y + 155;

const MERC_FILES_PREV_BUTTON_X = 128;
const MERC_FILES_PREV_BUTTON_Y = 380;

const MERC_FILES_NEXT_BUTTON_X = 490;
const MERC_FILES_NEXT_BUTTON_Y = MERC_FILES_PREV_BUTTON_Y;

const MERC_FILES_HIRE_BUTTON_X = 260;
const MERC_FILES_HIRE_BUTTON_Y = MERC_FILES_PREV_BUTTON_Y;

const MERC_FILES_BACK_BUTTON_X = 380;
const MERC_FILES_BACK_BUTTON_Y = MERC_FILES_PREV_BUTTON_Y;

const MERC_NAME_X = MERC_FILES_STATS_BOX_X + 50;
const MERC_NAME_Y = MERC_FILES_STATS_BOX_Y + 10;

const MERC_BIO_TEXT_X = MERC_FILES_BIO_BOX_X + 5;
const MERC_BIO_TEXT_Y = MERC_FILES_BIO_BOX_Y + 10;

const MERC_ADD_BIO_TITLE_X = MERC_BIO_TEXT_X;
const MERC_ADD_BIO_TITLE_Y = MERC_BIO_TEXT_Y + 100;

const MERC_ADD_BIO_TEXT_X = MERC_BIO_TEXT_X;
const MERC_ADD_BIO_TEXT_Y = MERC_ADD_BIO_TITLE_Y + 20;

const MERC_BIO_WIDTH = 460 - 10;

const MERC_BIO_INFO_TEXT_SIZE = 5 * 80 * 2;
const MERC_BIO_ADD_INFO_TEXT_SIZE = 2 * 80 * 2;
const MERC_BIO_SIZE = 7 * 80 * 2;

const MERC_STATS_FIRST_COL_X = MERC_NAME_X;
const MERC_STATS_FIRST_NUM_COL_X = MERC_STATS_FIRST_COL_X + 90;
const MERC_STATS_SECOND_COL_X = MERC_FILES_STATS_BOX_X + 170;
const MERC_STATS_SECOND_NUM_COL_X = MERC_STATS_SECOND_COL_X + 115;
const MERC_SPACE_BN_LINES = 15;

const MERC_HEALTH_Y = MERC_FILES_STATS_BOX_Y + 30;

const MERC_PORTRAIT_TEXT_OFFSET_Y = 110;

let guiPortraitBox: UINT32;
let guiStatsBox: UINT32;
let guiBioBox: UINT32;
let guiMercFace: UINT32;

//
// Buttons
//

let guiPrevButton: UINT32;
let guiButtonImage: INT32;

let guiNextButton: UINT32;

let guiHireButton: UINT32;

let guiMercBackButton: UINT32;

//****************************
//
//  Function Prototypes
//
//****************************

function GameInitMercsFiles(): void {
}

export function EnterMercsFiles(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  InitMercBackGround();

  // load the stats box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, Enum326.MLG_STATSBOX);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiStatsBox))) {
    return false;
  }

  // load the Portrait box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\PortraitBox.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiPortraitBox))) {
    return false;
  }

  // load the bio box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\BioBox.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBioBox))) {
    return false;
  }

  // Prev Box button
  guiButtonImage = LoadButtonImage("LAPTOP\\BigButtons.sti", -1, 0, -1, 1, -1);

  guiPrevButton = CreateIconAndTextButton(guiButtonImage, MercInfo[Enum341.MERC_FILES_PREVIOUS], FONT12ARIAL(), MERC_BUTTON_UP_COLOR, DEFAULT_SHADOW, MERC_BUTTON_DOWN_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, MERC_FILES_PREV_BUTTON_X, MERC_FILES_PREV_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnMercPrevButtonCallback);

  SetButtonCursor(guiPrevButton, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiPrevButton, Enum29.DISABLED_STYLE_SHADED);

  // Next Button
  guiNextButton = CreateIconAndTextButton(guiButtonImage, MercInfo[Enum341.MERC_FILES_NEXT], FONT12ARIAL(), MERC_BUTTON_UP_COLOR, DEFAULT_SHADOW, MERC_BUTTON_DOWN_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, MERC_FILES_NEXT_BUTTON_X, MERC_FILES_NEXT_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnMercNextButtonCallback);

  SetButtonCursor(guiNextButton, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiNextButton, Enum29.DISABLED_STYLE_SHADED);

  // Hire button
  guiHireButton = CreateIconAndTextButton(guiButtonImage, MercInfo[Enum341.MERC_FILES_HIRE], FONT12ARIAL(), MERC_BUTTON_UP_COLOR, DEFAULT_SHADOW, MERC_BUTTON_DOWN_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, MERC_FILES_HIRE_BUTTON_X, MERC_FILES_HIRE_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnMercHireButtonCallback);
  SetButtonCursor(guiHireButton, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiHireButton, Enum29.DISABLED_STYLE_SHADED);

  // Back button
  guiMercBackButton = CreateIconAndTextButton(guiButtonImage, MercInfo[Enum341.MERC_FILES_HOME], FONT12ARIAL(), MERC_BUTTON_UP_COLOR, DEFAULT_SHADOW, MERC_BUTTON_DOWN_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, MERC_FILES_BACK_BUTTON_X, MERC_FILES_BACK_BUTTON_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnMercFilesBackButtonCallback);
  SetButtonCursor(guiMercBackButton, Enum317.CURSOR_LAPTOP_SCREEN);
  SpecifyDisabledButtonStyle(guiMercBackButton, Enum29.DISABLED_STYLE_SHADED);

  //	RenderMercsFiles();
  return true;
}

export function ExitMercsFiles(): void {
  DeleteVideoObjectFromIndex(guiPortraitBox);
  DeleteVideoObjectFromIndex(guiStatsBox);
  DeleteVideoObjectFromIndex(guiBioBox);

  UnloadButtonImage(guiButtonImage);
  RemoveButton(guiPrevButton);
  RemoveButton(guiNextButton);
  RemoveButton(guiHireButton);
  RemoveButton(guiMercBackButton);

  RemoveMercBackGround();
}

export function HandleMercsFiles(): void {
}

export function RenderMercsFiles(): void {
  let hPixHandle: HVOBJECT;

  DrawMecBackGround();

  // Portrait Box
  GetVideoObject(addressof(hPixHandle), guiPortraitBox);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_FILES_PORTRAIT_BOX_X, MERC_FILES_PORTRAIT_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Stats Box
  GetVideoObject(addressof(hPixHandle), guiStatsBox);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_FILES_STATS_BOX_X, MERC_FILES_STATS_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // bio box
  GetVideoObject(addressof(hPixHandle), guiBioBox);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, MERC_FILES_BIO_BOX_X + 1, MERC_FILES_BIO_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Display the mercs face
  DisplayMercFace(GetMercIDFromMERCArray(gubCurMercIndex));

  // Display Mercs Name
  DrawTextToScreen(gMercProfiles[GetMercIDFromMERCArray(gubCurMercIndex)].zName, MERC_NAME_X, MERC_NAME_Y, 0, MERC_NAME_FONT(), MERC_NAME_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Load and display the mercs bio
  LoadAndDisplayMercBio((GetMercIDFromMERCArray(gubCurMercIndex) - Enum268.BIFF));

  // Display the mercs statistic
  DisplayMercsStats(GetMercIDFromMERCArray(gubCurMercIndex));

  // check to see if the merc is dead if so disable the contact button
  if (IsMercDead(GetMercIDFromMERCArray(gubCurMercIndex)))
    DisableButton(guiHireButton);
  else if ((LaptopSaveInfo.gubPlayersMercAccountStatus != Enum104.MERC_ACCOUNT_VALID) && (LaptopSaveInfo.gubPlayersMercAccountStatus != Enum104.MERC_ACCOUNT_SUSPENDED) && (LaptopSaveInfo.gubPlayersMercAccountStatus != Enum104.MERC_ACCOUNT_VALID_FIRST_WARNING)) {
    // if the players account is suspended, disable the button
    DisableButton(guiHireButton);
  } else
    EnableButton(guiHireButton);

  // Enable or disable the buttons
  EnableDisableMercFilesNextPreviousButton();

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function BtnMercPrevButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      if (gubCurMercIndex > 0)
        gubCurMercIndex--;

      // Since there are 2 larry roachburns
      if (gubCurMercIndex == MERC_LARRY_ROACHBURN)
        gubCurMercIndex--;

      fReDrawScreenFlag = true;

      // Enable or disable the buttons
      EnableDisableMercFilesNextPreviousButton();

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnMercNextButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      if (gubCurMercIndex <= LaptopSaveInfo.gubLastMercIndex - 1)
        gubCurMercIndex++;

      // Since there are 2 larry roachburns
      if (gubCurMercIndex == MERC_LARRY_ROACHBURN)
        gubCurMercIndex++;

      fReDrawScreenFlag = true;

      // Enable or disable the buttons
      EnableDisableMercFilesNextPreviousButton();

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function BtnMercHireButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      // if the players accont is suspended, go back to the main screen and have Speck inform the players
      if (LaptopSaveInfo.gubPlayersMercAccountStatus == Enum104.MERC_ACCOUNT_SUSPENDED) {
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC;
        gusMercVideoSpeckSpeech = Enum111.SPECK_QUOTE_ALTERNATE_OPENING_5_PLAYER_OWES_SPECK_ACCOUNT_SUSPENDED;
        gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_HIRE_PAGE;
      }

      // else try to hire the merc
      else if (MercFilesHireMerc(GetMercIDFromMERCArray(gubCurMercIndex))) {
        guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC;
        gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_HIRE_PAGE;

        // start the merc talking
        //				HandlePlayerHiringMerc( GetMercIDFromMERCArray( gubCurMercIndex ) );

        // We just hired a merc
        gfJustHiredAMercMerc = true;

        // Display a popup msg box telling the user when and where the merc will arrive
        DisplayPopUpBoxExplainingMercArrivalLocationAndTime(GetMercIDFromMERCArray(gubCurMercIndex));
      }

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function DisplayMercFace(ubMercID: UINT8): boolean {
  let hFaceHandle: HVOBJECT;
  let hPortraitHandle: HVOBJECT;
  let sFaceLoc: string /* STR */ = "FACES\\BIGFACES\\";
  let sTemp: string /* char[100] */;
  let pMerc: Pointer<MERCPROFILESTRUCT>;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let pSoldier: Pointer<SOLDIERTYPE> = null;

  // Portrait Frame
  GetVideoObject(addressof(hPortraitHandle), guiPortraitBox);
  BltVideoObject(FRAME_BUFFER, hPortraitHandle, 0, MERC_FILES_PORTRAIT_BOX_X, MERC_FILES_PORTRAIT_BOX_Y, VO_BLT_SRCTRANSPARENCY, null);

  pMerc = addressof(gMercProfiles[ubMercID]);

  // See if the merc is currently hired
  pSoldier = FindSoldierByProfileID(ubMercID, true);

  // load the Face graphic and add it
  sTemp = sprintf("%s%02d.sti", sFaceLoc, ubMercID);
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP(sTemp, VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMercFace))) {
    return false;
  }

  // Blt face to screen
  GetVideoObject(addressof(hFaceHandle), guiMercFace);
  BltVideoObject(FRAME_BUFFER, hFaceHandle, 0, MERC_FACE_X, MERC_FACE_Y, VO_BLT_SRCTRANSPARENCY, null);

  // if the merc is dead, shadow the face red and put text over top saying the merc is dead
  if (IsMercDead(ubMercID)) {
    // shade the face red, (to signif that he is dead)
    hFaceHandle.value.pShades[0] = Create16BPPPaletteShaded(hFaceHandle.value.pPaletteEntry, DEAD_MERC_COLOR_RED, DEAD_MERC_COLOR_GREEN, DEAD_MERC_COLOR_BLUE, true);

    // get the face object
    GetVideoObject(addressof(hFaceHandle), guiMercFace);

    // set the red pallete to the face
    SetObjectHandleShade(guiMercFace, 0);

    // Blt face to screen
    BltVideoObject(FRAME_BUFFER, hFaceHandle, 0, MERC_FACE_X, MERC_FACE_Y, VO_BLT_SRCTRANSPARENCY, null);

    DisplayWrappedString(MERC_FACE_X, MERC_FACE_Y + MERC_PORTRAIT_TEXT_OFFSET_Y, MERC_FACE_WIDTH, 2, FONT14ARIAL(), 145, MercInfo[Enum341.MERC_FILES_MERC_IS_DEAD], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  else if (ubMercID == Enum268.FLO && gubFact[Enum170.FACT_PC_MARRYING_DARYL_IS_FLO]) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, MERC_FACE_X, MERC_FACE_Y, MERC_FACE_X + MERC_FACE_WIDTH, MERC_FACE_Y + MERC_FACE_HEIGHT);
    DisplayWrappedString(MERC_FACE_X, MERC_FACE_Y + MERC_PORTRAIT_TEXT_OFFSET_Y, MERC_FACE_WIDTH, 2, FONT14ARIAL(), 145, pPersonnelDepartedStateStrings[3], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  // else if the merc is currently a POW or, the merc was fired as a pow
  else if (pMerc.value.bMercStatus == MERC_FIRED_AS_A_POW || (pSoldier && pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW)) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, MERC_FACE_X, MERC_FACE_Y, MERC_FACE_X + MERC_FACE_WIDTH, MERC_FACE_Y + MERC_FACE_HEIGHT);
    DisplayWrappedString(MERC_FACE_X, MERC_FACE_Y + MERC_PORTRAIT_TEXT_OFFSET_Y, MERC_FACE_WIDTH, 2, FONT14ARIAL(), 145, pPOWStrings[0], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  // if the merc is hired already, say it
  else if (!IsMercHireable(ubMercID) && pMerc.value.bMercStatus == MERC_HIRED_BUT_NOT_ARRIVED_YET || pMerc.value.bMercStatus > 0) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, MERC_FACE_X, MERC_FACE_Y, MERC_FACE_X + MERC_FACE_WIDTH, MERC_FACE_Y + MERC_FACE_HEIGHT);
    DisplayWrappedString(MERC_FACE_X, MERC_FACE_Y + MERC_PORTRAIT_TEXT_OFFSET_Y, MERC_FACE_WIDTH, 2, FONT14ARIAL(), 145, MercInfo[Enum341.MERC_FILES_ALREADY_HIRED], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  // if the merc is away on another assignemnt, say the merc is unavailable
  else if (!IsMercHireable(ubMercID)) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, MERC_FACE_X, MERC_FACE_Y, MERC_FACE_X + MERC_FACE_WIDTH, MERC_FACE_Y + MERC_FACE_HEIGHT);
    DisplayWrappedString(MERC_FACE_X, MERC_FACE_Y + MERC_PORTRAIT_TEXT_OFFSET_Y, MERC_FACE_WIDTH, 2, FONT14ARIAL(), 145, MercInfo[Enum341.MERC_FILES_MERC_UNAVAILABLE], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  }

  DeleteVideoObjectFromIndex(guiMercFace);

  return true;
}

function LoadAndDisplayMercBio(ubMercID: UINT8): void {
  let sText: string /* wchar_t[400] */;
  let uiStartLoc: UINT32 = 0;

  // load and display the merc bio
  uiStartLoc = MERC_BIO_SIZE * ubMercID;
  LoadEncryptedDataFromFile(MERCBIOFILE, sText, uiStartLoc, MERC_BIO_INFO_TEXT_SIZE);
  DisplayWrappedString(MERC_BIO_TEXT_X, MERC_BIO_TEXT_Y, MERC_BIO_WIDTH, 2, MERC_BIO_FONT(), MERC_BIO_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // load and display the merc's additioanl info (if any)
  uiStartLoc = MERC_BIO_SIZE * ubMercID + MERC_BIO_INFO_TEXT_SIZE;
  LoadEncryptedDataFromFile(MERCBIOFILE, sText, uiStartLoc, MERC_BIO_ADD_INFO_TEXT_SIZE);
  if (sText[0] != 0) {
    DrawTextToScreen(MercInfo[Enum341.MERC_FILES_ADDITIONAL_INFO], MERC_ADD_BIO_TITLE_X, MERC_ADD_BIO_TITLE_Y, 0, MERC_TITLE_FONT(), MERC_TITLE_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
    DisplayWrappedString(MERC_ADD_BIO_TEXT_X, MERC_ADD_BIO_TEXT_Y, MERC_BIO_WIDTH, 2, MERC_BIO_FONT(), MERC_BIO_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  }
}

function DisplayMercsStats(ubMercID: UINT8): void {
  let usPosY: UINT16;
  let usPosX: UINT16;
  let sString: string /* wchar_t[128] */;

  usPosY = MERC_HEALTH_Y;

  // Health
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_HEALTH], MERC_STATS_FIRST_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bLife, 3, MERC_STATS_FIRST_NUM_COL_X, MERC_HEALTH_Y, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Agility
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_AGILITY], MERC_STATS_FIRST_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bAgility, 3, MERC_STATS_FIRST_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Dexterity
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_DEXTERITY], MERC_STATS_FIRST_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bDexterity, 3, MERC_STATS_FIRST_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Strenght
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_STRENGTH], MERC_STATS_FIRST_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bStrength, 3, MERC_STATS_FIRST_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Leadership
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_LEADERSHIP], MERC_STATS_FIRST_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bLeadership, 3, MERC_STATS_FIRST_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Wisdom
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_WISDOM], MERC_STATS_FIRST_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bWisdom, 3, MERC_STATS_FIRST_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);

  usPosY = MERC_HEALTH_Y;

  // Experience Level
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_EXPLEVEL], MERC_STATS_SECOND_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bExpLevel, 3, MERC_STATS_SECOND_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Marksmanship
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_MARKSMANSHIP], MERC_STATS_SECOND_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bMarksmanship, 3, MERC_STATS_SECOND_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Mechanical
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_MECHANICAL], MERC_STATS_SECOND_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bMechanical, 3, MERC_STATS_SECOND_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Explosive
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_EXPLOSIVE], MERC_STATS_SECOND_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bExplosive, 3, MERC_STATS_SECOND_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Medical
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_MEDICAL], MERC_STATS_SECOND_COL_X, usPosY, 0, MERC_STATS_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawNumeralsToScreen(gMercProfiles[ubMercID].bMedical, 3, MERC_STATS_SECOND_NUM_COL_X, usPosY, MERC_STATS_FONT(), MERC_DYNAMIC_STATS_COLOR);
  usPosY += MERC_SPACE_BN_LINES;

  // Daily Salary
  DrawTextToScreen(MercInfo[Enum341.MERC_FILES_SALARY], MERC_STATS_SECOND_COL_X, usPosY, 0, MERC_NAME_FONT(), MERC_STATIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  usPosX = MERC_STATS_SECOND_COL_X + StringPixLength(MercInfo[Enum341.MERC_FILES_SALARY], MERC_NAME_FONT()) + 1;
  sString = swprintf("%d %s", gMercProfiles[ubMercID].sSalary, MercInfo[Enum341.MERC_FILES_PER_DAY]);
  DrawTextToScreen(sString, usPosX, usPosY, 95, MERC_NAME_FONT(), MERC_DYNAMIC_STATS_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
}

function MercFilesHireMerc(ubMercID: UINT8): boolean {
  let HireMercStruct: MERC_HIRE_STRUCT;
  let bReturnCode: INT8;

  memset(addressof(HireMercStruct), 0, sizeof(MERC_HIRE_STRUCT));

  // if the ALT key is down
  if (gfKeyState[ALT] && CHEATER_CHEAT_LEVEL()) {
    // set the merc to be hireable
    gMercProfiles[ubMercID].bMercStatus = MERC_OK;
    gMercProfiles[ubMercID].uiDayBecomesAvailable = 0;
  }

  // if the merc is away, dont hire
  if (!IsMercHireable(ubMercID)) {
    if (gMercProfiles[ubMercID].bMercStatus != MERC_IS_DEAD) {
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC;
      gusMercVideoSpeckSpeech = Enum111.SPECK_QUOTE_PLAYER_TRIES_TO_HIRE_ALREADY_HIRED_MERC;
      gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_HIRE_PAGE;
    }

    return false;
  }

  HireMercStruct.ubProfileID = ubMercID;

  //
  //	HireMercStruct.fCopyProfileItemsOver = gfBuyEquipment;
  //
  HireMercStruct.fCopyProfileItemsOver = true;

  HireMercStruct.iTotalContractLength = 1;

  // Specify where the merc is to appear
  HireMercStruct.sSectorX = gsMercArriveSectorX; // 13;
  HireMercStruct.sSectorY = gsMercArriveSectorY;
  HireMercStruct.fUseLandingZoneForArrival = true;

  HireMercStruct.uiTimeTillMercArrives = GetMercArrivalTimeOfDay(); // + ubMercID

  // Set the time and ID of the last hired merc will arrive
  //	LaptopSaveInfo.sLastHiredMerc.iIdOfMerc = HireMercStruct.ubProfileID;
  //	LaptopSaveInfo.sLastHiredMerc.uiArrivalTime = HireMercStruct.uiTimeTillMercArrives;

  bReturnCode = HireMerc(addressof(HireMercStruct));
  // already have 20 mercs on the team
  if (bReturnCode == MERC_HIRE_OVER_20_MERCS_HIRED) {
    DoLapTopMessageBox(Enum24.MSG_BOX_LAPTOP_DEFAULT, MercInfo[Enum341.MERC_FILES_HIRE_TO_MANY_PEOPLE_WARNING], Enum26.LAPTOP_SCREEN, MSG_BOX_FLAG_OK, null);
    return false;
  } else if (bReturnCode == MERC_HIRE_FAILED) {
    // function failed
    return false;
  } else {
    // if we succesfully hired the merc
    return true;
  }
}

function BtnMercFilesBackButtonCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);

      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_MERC;
      gubArrivedFromMercSubSite = Enum105.MERC_CAME_FROM_HIRE_PAGE;

      InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(btn.value.Area.RegionTopLeftX, btn.value.Area.RegionTopLeftY, btn.value.Area.RegionBottomRightX, btn.value.Area.RegionBottomRightY);
  }
}

function EnableDisableMercFilesNextPreviousButton(): void {
  if (gubCurMercIndex <= LaptopSaveInfo.gubLastMercIndex - 1)
    EnableButton(guiNextButton);
  else
    DisableButton(guiNextButton);

  if (gubCurMercIndex > 0)
    EnableButton(guiPrevButton);
  else
    DisableButton(guiPrevButton);
}

}
