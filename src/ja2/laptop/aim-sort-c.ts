namespace ja2 {

//#define

const AIM_SORT_FONT_TITLE = () => FONT14ARIAL();
const AIM_SORT_FONT_SORT_TEXT = () => FONT10ARIAL();

const AIM_SORT_COLOR_SORT_TEXT = AIM_FONT_MCOLOR_WHITE;
const AIM_SORT_SORT_BY_COLOR = 146;
const AIM_SORT_LINK_TEXT_COLOR = 146;

const AIM_SORT_GAP_BN_ICONS = 60;
const AIM_SORT_CHECKBOX_SIZE = 10;
const AIM_SORT_ON = 0;
const AIM_SORT_OFF = 1;

const AIM_SORT_SORT_BY_X = IMAGE_OFFSET_X + 155;
const AIM_SORT_SORT_BY_Y = IMAGE_OFFSET_Y + 96;
const AIM_SORT_SORT_BY_WIDTH = 190;
const AIM_SORT_SORT_BY_HEIGHT = 81;

const AIM_SORT_TO_MUGSHOTS_X = IMAGE_OFFSET_X + 89;
const AIM_SORT_TO_MUGSHOTS_Y = IMAGE_OFFSET_Y + 184;
const AIM_SORT_TO_MUGSHOTS_SIZE = 54;

const AIM_SORT_TO_STATS_X = AIM_SORT_TO_MUGSHOTS_X;
const AIM_SORT_TO_STATS_Y = AIM_SORT_TO_MUGSHOTS_Y + AIM_SORT_GAP_BN_ICONS;
const AIM_SORT_TO_STATS_SIZE = AIM_SORT_TO_MUGSHOTS_SIZE;

const AIM_SORT_TO_ALUMNI_X = AIM_SORT_TO_MUGSHOTS_X;
const AIM_SORT_TO_ALUMNI_Y = AIM_SORT_TO_STATS_Y + AIM_SORT_GAP_BN_ICONS;
const AIM_SORT_TO_ALUMNI_SIZE = AIM_SORT_TO_MUGSHOTS_SIZE;

const AIM_SORT_AIM_MEMBER_X = AIM_SORT_SORT_BY_X;
const AIM_SORT_AIM_MEMBER_Y = 105 + LAPTOP_SCREEN_WEB_DELTA_Y;
const AIM_SORT_AIM_MEMBER_WIDTH = AIM_SORT_SORT_BY_WIDTH;

const AIM_SORT_SORT_BY_TEXT_X = AIM_SORT_SORT_BY_X + 9;
const AIM_SORT_SORT_BY_TEXT_Y = AIM_SORT_SORT_BY_Y + 8;

const AIM_SORT_PRICE_TEXT_X = AIM_SORT_SORT_BY_X + 22;
const AIM_SORT_PRICE_TEXT_Y = AIM_SORT_SORT_BY_Y + 36;

const AIM_SORT_EXP_TEXT_X = AIM_SORT_PRICE_TEXT_X;
const AIM_SORT_EXP_TEXT_Y = AIM_SORT_PRICE_TEXT_Y + 13;

const AIM_SORT_MARKMNSHP_TEXT_X = AIM_SORT_PRICE_TEXT_X;
const AIM_SORT_MARKMNSHP_TEXT_Y = AIM_SORT_EXP_TEXT_Y + 13;

const AIM_SORT_MEDICAL_X = AIM_SORT_SORT_BY_X + 125;
const AIM_SORT_MEDICAL_Y = AIM_SORT_PRICE_TEXT_Y;

const AIM_SORT_EXPLOSIVES_X = AIM_SORT_MEDICAL_X;
const AIM_SORT_EXPLOSIVES_Y = AIM_SORT_EXP_TEXT_Y;

const AIM_SORT_MECHANICAL_X = AIM_SORT_MEDICAL_X;
const AIM_SORT_MECHANICAL_Y = AIM_SORT_MARKMNSHP_TEXT_Y;

const AIM_SORT_ASC_DESC_WIDTH = 100;
const AIM_SORT_ASCEND_TEXT_X = AIM_SORT_SORT_BY_X + 154 - AIM_SORT_ASC_DESC_WIDTH - 4 + 18;
const AIM_SORT_ASCEND_TEXT_Y = 128 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_SORT_DESCEND_TEXT_X = AIM_SORT_ASCEND_TEXT_X;
const AIM_SORT_DESCEND_TEXT_Y = 141 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_SORT_MUGSHOT_TEXT_X = 266;
const AIM_SORT_MUGSHOT_TEXT_Y = 230 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_SORT_MERC_STATS_TEXT_X = AIM_SORT_MUGSHOT_TEXT_X;
const AIM_SORT_MERC_STATS_TEXT_Y = 293 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_SORT_ALUMNI_TEXT_X = AIM_SORT_MUGSHOT_TEXT_X;
const AIM_SORT_ALUMNI_TEXT_Y = 351 + LAPTOP_SCREEN_WEB_DELTA_Y;

const AIM_SORT_FIRST_SORT_CLOUMN_GAP = 22;

let AimSortCheckBoxLoc: UINT16[] /* [] */ = [
  (AIM_SORT_SORT_BY_X + 9), (AIM_SORT_SORT_BY_Y + 34),
  (AIM_SORT_SORT_BY_X + 9), (AIM_SORT_SORT_BY_Y + 47),
  (AIM_SORT_SORT_BY_X + 9), (AIM_SORT_SORT_BY_Y + 60),
  (AIM_SORT_SORT_BY_X + 111), (AIM_SORT_SORT_BY_Y + 34),
  (AIM_SORT_SORT_BY_X + 111), (AIM_SORT_SORT_BY_Y + 47),
  (AIM_SORT_SORT_BY_X + 111), (AIM_SORT_SORT_BY_Y + 60),
  (AIM_SORT_SORT_BY_X + 172), (AIM_SORT_SORT_BY_Y + 4),
  (AIM_SORT_SORT_BY_X + 172), (AIM_SORT_SORT_BY_Y + 17),
];

export let gubCurrentSortMode: UINT8;
let gubOldSortMode: UINT8;
export let gubCurrentListMode: UINT8;
let gubOldListMode: UINT8;

// Mouse stuff
// Clicking on To Mugshot
let gSelectedToMugShotRegion: MOUSE_REGION = createMouseRegion();

// Clicking on ToStats
let gSelectedToStatsRegion: MOUSE_REGION = createMouseRegion();

// Clicking on ToStats
let gSelectedToArchiveRegion: MOUSE_REGION = createMouseRegion();

// Clicking on Price Check Box
let gSelectedPriceBoxRegion: MOUSE_REGION = createMouseRegion();
// Clicking on Explosive Check Box
let gSelectedExpBoxRegion: MOUSE_REGION = createMouseRegion();
// Clicking on Markmanship Check Box
let gSelectedMarkBoxRegion: MOUSE_REGION = createMouseRegion();
// Clicking on Medical Check box
let gSelectedMedicalBoxRegion: MOUSE_REGION = createMouseRegion();
// Clicking on Explosive Check Box
let gSelectedExplosiveBoxRegion: MOUSE_REGION = createMouseRegion();
// Clicking on Mechanical Check Box
let gSelectedMechanicalBoxRegion: MOUSE_REGION = createMouseRegion();
// Clicking on Ascending Check Box
let gSelectedAscendBoxRegion: MOUSE_REGION = createMouseRegion();
// Clicking on Descending Check Box
let gSelectedDescendBoxRegion: MOUSE_REGION = createMouseRegion();

let guiSortByBox: UINT32;
let guiToAlumni: UINT32;
let guiToMugShots: UINT32;
let guiToStats: UINT32;
let guiSelectLight: UINT32;

export function GameInitAimSort(): void {
  gubCurrentSortMode = 0;
  gubOldSortMode = 0;
  gubCurrentListMode = AIM_DESCEND;
  gubOldListMode = AIM_DESCEND;
}

export function EnterAimSort(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let ubCurNumber: UINT8 = 0;
  let ubWidth: UINT16;
  let i: UINT8;

  // Everytime into Aim Sort, reset array.
  for (i = 0; i < MAX_NUMBER_MERCS; i++) {
    AimMercArray[i] = i;
  }

  InitAimDefaults();

  // load the SortBy box graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\SortBy.sti");
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSortByBox))) {
    return false;
  }

  // load the ToAlumni graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_TOALUMNI);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiToAlumni))) {
    return false;
  }

  // load the ToMugShots graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_TOMUGSHOTS);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiToMugShots))) {
    return false;
  }

  // load the ToStats graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_TOSTATS);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiToStats))) {
    return false;
  }

  // load the SelectLight graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\SelectLight.sti");
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiSelectLight))) {
    return false;
  }

  //** Mouse Regions **

  // Mouse region for the ToMugShotRegion
  MSYS_DefineRegion(gSelectedToMugShotRegion, AIM_SORT_TO_MUGSHOTS_X, AIM_SORT_TO_MUGSHOTS_Y, (AIM_SORT_TO_MUGSHOTS_X + AIM_SORT_TO_MUGSHOTS_SIZE), (AIM_SORT_TO_MUGSHOTS_Y + AIM_SORT_TO_MUGSHOTS_SIZE), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectToMugShotRegionCallBack);
  MSYS_AddRegion(gSelectedToMugShotRegion);

  // Mouse region for the ToStatsRegion
  MSYS_DefineRegion(gSelectedToStatsRegion, AIM_SORT_TO_STATS_X, AIM_SORT_TO_STATS_Y, (AIM_SORT_TO_STATS_X + AIM_SORT_TO_STATS_SIZE), (AIM_SORT_TO_STATS_Y + AIM_SORT_TO_STATS_SIZE), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectToStatsRegionCallBack);
  MSYS_AddRegion(gSelectedToStatsRegion);

  // Mouse region for the ToArhciveRegion
  MSYS_DefineRegion(gSelectedToArchiveRegion, AIM_SORT_TO_ALUMNI_X, AIM_SORT_TO_ALUMNI_Y, (AIM_SORT_TO_ALUMNI_X + AIM_SORT_TO_ALUMNI_SIZE), (AIM_SORT_TO_ALUMNI_Y + AIM_SORT_TO_ALUMNI_SIZE), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectToArchiveRegionCallBack);
  MSYS_AddRegion(gSelectedToArchiveRegion);

  // CURSOR_WWW MSYS_NO_CURSOR
  ubCurNumber = 0;
  // Mouse region for the Price Check Box
  ubWidth = StringPixLength(AimSortText[Enum352.PRICE], AIM_SORT_FONT_SORT_TEXT()) + AimSortCheckBoxLoc[ubCurNumber] + (AIM_SORT_PRICE_TEXT_X - AimSortCheckBoxLoc[ubCurNumber]) - 3;
  MSYS_DefineRegion(gSelectedPriceBoxRegion, AimSortCheckBoxLoc[ubCurNumber], AimSortCheckBoxLoc[ubCurNumber + 1], ubWidth, (AimSortCheckBoxLoc[ubCurNumber + 1] + AIM_SORT_CHECKBOX_SIZE), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, SelectPriceBoxRegionCallBack);
  MSYS_AddRegion(gSelectedPriceBoxRegion);

  ubCurNumber += 2;
  ubWidth = StringPixLength(AimSortText[Enum352.EXPERIENCE], AIM_SORT_FONT_SORT_TEXT()) + AimSortCheckBoxLoc[ubCurNumber] + (AIM_SORT_PRICE_TEXT_X - AimSortCheckBoxLoc[ubCurNumber]) - 3;
  // Mouse region for the Experience Check Box
  MSYS_DefineRegion(gSelectedExpBoxRegion, AimSortCheckBoxLoc[ubCurNumber], AimSortCheckBoxLoc[ubCurNumber + 1], ubWidth, (AimSortCheckBoxLoc[ubCurNumber + 1] + AIM_SORT_CHECKBOX_SIZE), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, SelectExpBoxRegionCallBack);
  MSYS_AddRegion(gSelectedExpBoxRegion);

  ubCurNumber += 2;
  ubWidth = StringPixLength(AimSortText[Enum352.AIMMARKSMANSHIP], AIM_SORT_FONT_SORT_TEXT()) + AimSortCheckBoxLoc[ubCurNumber] + (AIM_SORT_PRICE_TEXT_X - AimSortCheckBoxLoc[ubCurNumber]) - 3;
  // Mouse region for the Markmanship Check Box
  MSYS_DefineRegion(gSelectedMarkBoxRegion, AimSortCheckBoxLoc[ubCurNumber], AimSortCheckBoxLoc[ubCurNumber + 1], ubWidth, (AimSortCheckBoxLoc[ubCurNumber + 1] + AIM_SORT_CHECKBOX_SIZE), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, SelectMarkBoxRegionCallBack);
  MSYS_AddRegion(gSelectedMarkBoxRegion);

  ubCurNumber += 2;
  ubWidth = StringPixLength(AimSortText[Enum352.AIMMEDICAL], AIM_SORT_FONT_SORT_TEXT()) + AimSortCheckBoxLoc[ubCurNumber] + (AIM_SORT_MEDICAL_X - AimSortCheckBoxLoc[ubCurNumber]) - 3;
  // Mouse region for the Medical  Check Box
  MSYS_DefineRegion(gSelectedMedicalBoxRegion, AimSortCheckBoxLoc[ubCurNumber], AimSortCheckBoxLoc[ubCurNumber + 1], ubWidth, (AimSortCheckBoxLoc[ubCurNumber + 1] + AIM_SORT_CHECKBOX_SIZE), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, SelectMedicalBoxRegionCallBack);
  MSYS_AddRegion(gSelectedMedicalBoxRegion);

  ubCurNumber += 2;
  ubWidth = StringPixLength(AimSortText[Enum352.EXPLOSIVES], AIM_SORT_FONT_SORT_TEXT()) + AimSortCheckBoxLoc[ubCurNumber] + (AIM_SORT_MEDICAL_X - AimSortCheckBoxLoc[ubCurNumber]) - 3;
  // Mouse region for the Explosive  Check Box
  MSYS_DefineRegion(gSelectedExplosiveBoxRegion, AimSortCheckBoxLoc[ubCurNumber], AimSortCheckBoxLoc[ubCurNumber + 1], ubWidth, (AimSortCheckBoxLoc[ubCurNumber + 1] + AIM_SORT_CHECKBOX_SIZE), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, SelectExplosiveBoxRegionCallBack);
  MSYS_AddRegion(gSelectedExplosiveBoxRegion);

  ubCurNumber += 2;
  ubWidth = StringPixLength(AimSortText[Enum352.AIMMECHANICAL], AIM_SORT_FONT_SORT_TEXT()) + AimSortCheckBoxLoc[ubCurNumber] + (AIM_SORT_MEDICAL_X - AimSortCheckBoxLoc[ubCurNumber]) - 3;
  // Mouse region for the Mechanical Check Box
  MSYS_DefineRegion(gSelectedMechanicalBoxRegion, AimSortCheckBoxLoc[ubCurNumber], AimSortCheckBoxLoc[ubCurNumber + 1], ubWidth, (AimSortCheckBoxLoc[ubCurNumber + 1] + AIM_SORT_CHECKBOX_SIZE), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, SelectMechanicalBoxRegionCallBack);
  MSYS_AddRegion(gSelectedMechanicalBoxRegion);

  ubCurNumber += 2;

  ubWidth = AimSortCheckBoxLoc[ubCurNumber] - StringPixLength(AimSortText[Enum352.ASCENDING], AIM_SORT_FONT_SORT_TEXT()) - 6;
  // Mouse region for the Ascend Check Box
  MSYS_DefineRegion(gSelectedAscendBoxRegion, ubWidth, AimSortCheckBoxLoc[ubCurNumber + 1], (AimSortCheckBoxLoc[ubCurNumber] + AIM_SORT_CHECKBOX_SIZE), (AimSortCheckBoxLoc[ubCurNumber + 1] + AIM_SORT_CHECKBOX_SIZE), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, SelectAscendBoxRegionCallBack);
  MSYS_AddRegion(gSelectedAscendBoxRegion);

  ubCurNumber += 2;
  ubWidth = AimSortCheckBoxLoc[ubCurNumber] - StringPixLength(AimSortText[Enum352.DESCENDING], AIM_SORT_FONT_SORT_TEXT()) - 6;

  // Mouse region for the Descend Check Box
  MSYS_DefineRegion(gSelectedDescendBoxRegion, ubWidth, AimSortCheckBoxLoc[ubCurNumber + 1], (AimSortCheckBoxLoc[ubCurNumber] + AIM_SORT_CHECKBOX_SIZE), (AimSortCheckBoxLoc[ubCurNumber + 1] + AIM_SORT_CHECKBOX_SIZE), MSYS_PRIORITY_HIGH, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, SelectDescendBoxRegionCallBack);
  MSYS_AddRegion(gSelectedDescendBoxRegion);

  InitAimMenuBar();

  RenderAimSort();

  return true;
}

export function ExitAimSort(): void {
  // Sort the merc array
  SortMercArray();
  RemoveAimDefaults();

  DeleteVideoObjectFromIndex(guiSortByBox);
  DeleteVideoObjectFromIndex(guiToAlumni);
  DeleteVideoObjectFromIndex(guiToMugShots);
  DeleteVideoObjectFromIndex(guiToStats);
  DeleteVideoObjectFromIndex(guiSelectLight);

  MSYS_RemoveRegion(gSelectedToMugShotRegion);
  MSYS_RemoveRegion(gSelectedToStatsRegion);
  MSYS_RemoveRegion(gSelectedToArchiveRegion);

  MSYS_RemoveRegion(gSelectedPriceBoxRegion);
  MSYS_RemoveRegion(gSelectedExpBoxRegion);
  MSYS_RemoveRegion(gSelectedMarkBoxRegion);
  MSYS_RemoveRegion(gSelectedMedicalBoxRegion);
  MSYS_RemoveRegion(gSelectedExplosiveBoxRegion);
  MSYS_RemoveRegion(gSelectedMechanicalBoxRegion);
  MSYS_RemoveRegion(gSelectedAscendBoxRegion);
  MSYS_RemoveRegion(gSelectedDescendBoxRegion);
  ExitAimMenuBar();
}

export function HandleAimSort(): void {
}

export function RenderAimSort(): void {
  let hSortByHandle: HVOBJECT;
  let hToAlumniHandle: HVOBJECT;
  let hToMugShotHandle: HVOBJECT;
  let hToStatsHandle: HVOBJECT;

  DrawAimDefaults();
  // SortBy
  GetVideoObject(addressof(hSortByHandle), guiSortByBox);
  BltVideoObject(FRAME_BUFFER, hSortByHandle, 0, AIM_SORT_SORT_BY_X, AIM_SORT_SORT_BY_Y, VO_BLT_SRCTRANSPARENCY, null);

  // To MugShots
  GetVideoObject(addressof(hToMugShotHandle), guiToMugShots);
  BltVideoObject(FRAME_BUFFER, hToMugShotHandle, 0, AIM_SORT_TO_MUGSHOTS_X, AIM_SORT_TO_MUGSHOTS_Y, VO_BLT_SRCTRANSPARENCY, null);

  // To stats
  GetVideoObject(addressof(hToStatsHandle), guiToStats);
  BltVideoObject(FRAME_BUFFER, hToStatsHandle, 0, AIM_SORT_TO_STATS_X, AIM_SORT_TO_STATS_Y, VO_BLT_SRCTRANSPARENCY, null);

  // To Alumni
  GetVideoObject(addressof(hToAlumniHandle), guiToAlumni);
  BltVideoObject(FRAME_BUFFER, hToAlumniHandle, 0, AIM_SORT_TO_ALUMNI_X, AIM_SORT_TO_ALUMNI_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Draw the aim slogan under the symbol
  DisplayAimSlogan();

  // Display AIM Member text
  DrawTextToScreen(AimSortText[Enum352.AIM_AIMMEMBERS], AIM_SORT_AIM_MEMBER_X, AIM_SORT_AIM_MEMBER_Y, AIM_SORT_AIM_MEMBER_WIDTH, AIM_MAINTITLE_FONT(), AIM_MAINTITLE_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // Display sort title
  DrawTextToScreen(AimSortText[Enum352.SORT_BY], AIM_SORT_SORT_BY_TEXT_X, AIM_SORT_SORT_BY_TEXT_Y, 0, AIM_SORT_FONT_TITLE(), AIM_SORT_SORT_BY_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Display all the sort by text
  DrawTextToScreen(AimSortText[Enum352.PRICE], AIM_SORT_PRICE_TEXT_X, AIM_SORT_PRICE_TEXT_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_COLOR_SORT_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(AimSortText[Enum352.EXPERIENCE], AIM_SORT_EXP_TEXT_X, AIM_SORT_EXP_TEXT_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_COLOR_SORT_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(AimSortText[Enum352.AIMMARKSMANSHIP], AIM_SORT_MARKMNSHP_TEXT_X, AIM_SORT_MARKMNSHP_TEXT_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_COLOR_SORT_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(AimSortText[Enum352.AIMMEDICAL], AIM_SORT_MEDICAL_X, AIM_SORT_MEDICAL_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_COLOR_SORT_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(AimSortText[Enum352.EXPLOSIVES], AIM_SORT_EXPLOSIVES_X, AIM_SORT_EXPLOSIVES_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_COLOR_SORT_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(AimSortText[Enum352.AIMMECHANICAL], AIM_SORT_MECHANICAL_X, AIM_SORT_MECHANICAL_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_COLOR_SORT_TEXT, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  DrawTextToScreen(AimSortText[Enum352.ASCENDING], AIM_SORT_ASCEND_TEXT_X, AIM_SORT_ASCEND_TEXT_Y, AIM_SORT_ASC_DESC_WIDTH, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_COLOR_SORT_TEXT, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);
  DrawTextToScreen(AimSortText[Enum352.DESCENDING], AIM_SORT_DESCEND_TEXT_X, AIM_SORT_DESCEND_TEXT_Y, AIM_SORT_ASC_DESC_WIDTH, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_COLOR_SORT_TEXT, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  // Display text for the 3 icons
  DrawTextToScreen(AimSortText[Enum352.MUGSHOT_INDEX], AIM_SORT_MUGSHOT_TEXT_X, AIM_SORT_MUGSHOT_TEXT_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_LINK_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(AimSortText[Enum352.MERCENARY_FILES], AIM_SORT_MERC_STATS_TEXT_X, AIM_SORT_MERC_STATS_TEXT_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_LINK_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);
  DrawTextToScreen(AimSortText[Enum352.ALUMNI_GALLERY], AIM_SORT_ALUMNI_TEXT_X, AIM_SORT_ALUMNI_TEXT_Y, 0, AIM_SORT_FONT_SORT_TEXT(), AIM_SORT_LINK_TEXT_COLOR, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  DrawSelectLight(gubCurrentSortMode, AIM_SORT_ON);
  DrawSelectLight(gubCurrentListMode, AIM_SORT_ON);

  DisableAimButton();

  MarkButtonsDirty();

  RenderWWWProgramTitleBar();

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function SelectToMugShotRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM_MEMBERS_FACIAL_INDEX;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectToStatsRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM_MEMBERS;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectToArchiveRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM_MEMBERS_ARCHIVES;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectPriceBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentSortMode != 0) {
      gubCurrentSortMode = 0;
      DrawSelectLight(gubCurrentSortMode, AIM_SORT_ON);
      DrawSelectLight(gubOldSortMode, AIM_SORT_OFF);
      gubOldSortMode = gubCurrentSortMode;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectExpBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentSortMode != 1) {
      gubCurrentSortMode = 1;
      DrawSelectLight(gubCurrentSortMode, AIM_SORT_ON);
      DrawSelectLight(gubOldSortMode, AIM_SORT_OFF);
      gubOldSortMode = gubCurrentSortMode;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectMarkBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentSortMode != 2) {
      gubCurrentSortMode = 2;
      DrawSelectLight(gubCurrentSortMode, AIM_SORT_ON);
      DrawSelectLight(gubOldSortMode, AIM_SORT_OFF);
      gubOldSortMode = gubCurrentSortMode;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectMedicalBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentSortMode != 3) {
      gubCurrentSortMode = 3;
      DrawSelectLight(gubCurrentSortMode, AIM_SORT_ON);
      DrawSelectLight(gubOldSortMode, AIM_SORT_OFF);
      gubOldSortMode = gubCurrentSortMode;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectExplosiveBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentSortMode != 4) {
      gubCurrentSortMode = 4;
      DrawSelectLight(gubCurrentSortMode, AIM_SORT_ON);
      DrawSelectLight(gubOldSortMode, AIM_SORT_OFF);
      gubOldSortMode = gubCurrentSortMode;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectMechanicalBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentSortMode != 5) {
      gubCurrentSortMode = 5;
      DrawSelectLight(gubCurrentSortMode, AIM_SORT_ON);
      DrawSelectLight(gubOldSortMode, AIM_SORT_OFF);
      gubOldSortMode = gubCurrentSortMode;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectAscendBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentListMode != AIM_ASCEND) {
      gubCurrentListMode = AIM_ASCEND;
      DrawSelectLight(gubCurrentListMode, AIM_SORT_ON);
      DrawSelectLight(gubOldListMode, AIM_SORT_OFF);
      gubOldListMode = gubCurrentListMode;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectDescendBoxRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentListMode != AIM_DESCEND) {
      gubCurrentListMode = AIM_DESCEND;
      DrawSelectLight(gubCurrentListMode, AIM_SORT_ON);
      DrawSelectLight(gubOldListMode, AIM_SORT_OFF);
      gubOldListMode = gubCurrentListMode;
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function DrawSelectLight(ubMode: UINT8, ubImage: UINT8): void {
  let hSelectLightHandle: HVOBJECT;

  ubMode *= 2;

  GetVideoObject(addressof(hSelectLightHandle), guiSelectLight);
  BltVideoObject(FRAME_BUFFER, hSelectLightHandle, ubImage, (AimSortCheckBoxLoc[ubMode]), (AimSortCheckBoxLoc[ubMode + 1]), VO_BLT_SRCTRANSPARENCY, null);

  //  InvalidateRegion(LAPTOP_SCREEN_UL_X,LAPTOP_SCREEN_WEB_UL_Y,LAPTOP_SCREEN_LR_X,LAPTOP_SCREEN_WEB_LR_Y);

  InvalidateRegion(AimSortCheckBoxLoc[ubMode], AimSortCheckBoxLoc[ubMode + 1], (AimSortCheckBoxLoc[ubMode] + AIM_SORT_CHECKBOX_SIZE), (AimSortCheckBoxLoc[ubMode + 1] + AIM_SORT_CHECKBOX_SIZE));
}

function SortMercArray(): boolean {
  qsort(AimMercArray, MAX_NUMBER_MERCS, sizeof(UINT8), QsortCompare);

  return true;
}

function QsortCompare(pNum1: Pointer<void>, pNum2: Pointer<void>): INT32 {
  let Num1: UINT8 = pNum1.value;
  let Num2: UINT8 = pNum2.value;

  switch (gubCurrentSortMode) {
    // Price						INT16	uiWeeklySalary
    case 0:
      return CompareValue(gMercProfiles[Num1].uiWeeklySalary, gMercProfiles[Num2].uiWeeklySalary);
      break;
    // Experience			INT16	bExpLevel
    case 1:
      return CompareValue(gMercProfiles[Num1].bExpLevel, gMercProfiles[Num2].bExpLevel);
      break;
    // Marksmanship		INT16	bMarksmanship
    case 2:
      return CompareValue(gMercProfiles[Num1].bMarksmanship, gMercProfiles[Num2].bMarksmanship);
      break;
    // Medical					INT16	bMedical
    case 3:
      return CompareValue(gMercProfiles[Num1].bMedical, gMercProfiles[Num2].bMedical);
      break;
    // Explosives			INT16	bExplosive
    case 4:
      return CompareValue(gMercProfiles[Num1].bExplosive, gMercProfiles[Num2].bExplosive);
      break;
    // Mechanical			INT16	bMechanical
    case 5:
      return CompareValue(gMercProfiles[Num1].bMechanical, gMercProfiles[Num2].bMechanical);
      break;

    default:
      Assert(0);
      return 0;
      break;
  }
}

function CompareValue(Num1: INT32, Num2: INT32): INT32 {
  // Ascending
  if (gubCurrentListMode == AIM_ASCEND) {
    if (Num1 < Num2)
      return -1;
    else if (Num1 == Num2)
      return 0;
    else
      return 1;
  }

  // Descending
  else if (gubCurrentListMode == AIM_DESCEND) {
    if (Num1 > Num2)
      return -1;
    else if (Num1 == Num2)
      return 0;
    else
      return 1;
  }

  return 0;
}

}
