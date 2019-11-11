namespace ja2 {

const FUNERAL_SENTENCE_FONT = () => FONT12ARIAL();
const FUNERAL_SENTENCE_COLOR = 2; // FONT_MCOLOR_WHITE
const FUNERAL_SENTENCE_SHADOW_COLOR = FONT_MCOLOR_WHITE; // FONT_MCOLOR_DKWHITE

const FUNERAL_SMALL_FONT = () => FONT10ARIAL();

const FUNERAL_TITLE_FONT = () => FONT14ARIAL();
const FUNERAL_TITLE_COLOR = FONT_MCOLOR_WHITE;
const FUNERAL_TITLE_SHADOW_COLOR = FONT_MCOLOR_DKWHITE;

const FUNERAL_RIP_SHADOW_COLOR = FONT_MCOLOR_DKWHITE;

const FUNERAL_MCGILICUTTYS_SIGN_X = LAPTOP_SCREEN_UL_X + 92;
const FUNERAL_MCGILICUTTYS_SIGN_Y = LAPTOP_SCREEN_WEB_UL_Y + 0;

const FUNERAL_MORTUARY_SIGN_X = LAPTOP_SCREEN_UL_X + 58;
const FUNERAL_MORTUARY_SIGN_Y = LAPTOP_SCREEN_WEB_UL_Y + 43;

const FUNERAL_LEFT_COLUMN_X = LAPTOP_SCREEN_UL_X + 0;
const FUNERAL_LEFT_COLUMN_Y = LAPTOP_SCREEN_WEB_UL_Y + 43;

const FUNERAL_RIGHT_COLUMN_X = LAPTOP_SCREEN_UL_X + 442;
const FUNERAL_RIGHT_COLUMN_Y = LAPTOP_SCREEN_WEB_UL_Y + 43;

const FUNERAL_LINK_1_X = LAPTOP_SCREEN_UL_X + 37;
const FUNERAL_LINK_1_Y = LAPTOP_SCREEN_WEB_UL_Y + 329;
const FUNERAL_LINK_1_WIDTH = 85;
const FUNERAL_LINK_1_HEIGHT = 60;

const FUNERAL_LINK_OFFSET_X = 85;
const FUNERAL_NUMBER_OF_LINKS = 5;

const FUNERAL_LINK_TEXT_OFFSET_X = 4;
const FUNERAL_LINK_TEXT_OFFSET_Y = 17;
const FUNERAL_LINK_TEXT_WIDTH = 76;

const FUNERAL_MARBLE_WIDTH = 125;
const FUNERAL_MARBLE_HEIGHT = 100;

const FUNERAL_SENTENCE_WIDTH = 380;

const FUNERAL_SENTENCE_1_X = LAPTOP_SCREEN_UL_X + 60;
const FUNERAL_SENTENCE_1_Y = LAPTOP_SCREEN_WEB_UL_Y + 164;

const FUNERAL_SENTENCE_2_X = FUNERAL_SENTENCE_1_X;
const FUNERAL_SENTENCE_2_Y = LAPTOP_SCREEN_WEB_UL_Y + 198;

const FUNERAL_SENTENCE_3_X = FUNERAL_SENTENCE_1_X;
const FUNERAL_SENTENCE_3_Y = LAPTOP_SCREEN_WEB_UL_Y + 227;

const FUNERAL_SENTENCE_4_X = FUNERAL_SENTENCE_1_X;
const FUNERAL_SENTENCE_4_Y = LAPTOP_SCREEN_WEB_UL_Y + 261;

const FUNERAL_SENTENCE_5_X = FUNERAL_SENTENCE_1_X;
const FUNERAL_SENTENCE_5_Y = LAPTOP_SCREEN_WEB_UL_Y + 303;

const FUNERAL_CLOSED_RIP_SIGN_X = LAPTOP_SCREEN_UL_X + 72;
const FUNERAL_CLOSED_RIP_SIGN_Y = LAPTOP_SCREEN_WEB_UL_Y + 151;
const FUNERAL_CLOSED_WIDTH = 364;
const FUNERAL_CLOSED_HEIGHT = 204;

const FUNERAL_RIP_SENTENCE_WIDTH = 260;

const FUNERAL_RIP_SENTENCE_1_X = FUNERAL_CLOSED_RIP_SIGN_X + 55;
const FUNERAL_RIP_SENTENCE_1_Y = FUNERAL_CLOSED_RIP_SIGN_Y + 98;

const FUNERAL_RIP_SENTENCE_2_X = FUNERAL_RIP_SENTENCE_1_X;
const FUNERAL_RIP_SENTENCE_2_Y = FUNERAL_CLOSED_RIP_SIGN_Y + 162;

// Image Identifiers
let guiClosedSign: UINT32;
let guiLeftColumn: UINT32;
let guiLinkCarving: UINT32;
let guiMarbleBackground: UINT32;
let guiMcGillicuttys: UINT32;
let guiMortuary: UINT32;
let guiRightColumn: UINT32;

// Clicking on Funeral link
let gSelectedFuneralLinkRegion: MOUSE_REGION[] /* [FUNERAL_NUMBER_OF_LINKS] */ = createArrayFrom(FUNERAL_NUMBER_OF_LINKS, createMouseRegion);

// Clicking on rip sign to make it disappear
let gSelectedRipSignRegion: MOUSE_REGION = createMouseRegion();

export function GameInitFuneral(): void {
}

export function EnterFuneral(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let usPosX: UINT16;
  let i: UINT16;

  // load the Closed graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_CLOSED);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiClosedSign))) {
    return false;
  }

  // load the Left column graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\LeftColumn.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiLeftColumn))) {
    return false;
  }

  // load the Link carving graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\LinkCarving.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiLinkCarving))) {
    return false;
  }

  // load the Marble graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Marble.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMarbleBackground))) {
    return false;
  }

  // load the McGillicuttys sign graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_MCGILLICUTTYS);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMcGillicuttys))) {
    return false;
  }

  // load the Mortuary  graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_MORTUARY);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMortuary))) {
    return false;
  }

  // load the right column graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\RightColumn.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiRightColumn))) {
    return false;
  }

  usPosX = FUNERAL_LINK_1_X;
  for (i = 0; i < FUNERAL_NUMBER_OF_LINKS; i++) {
    // Mouse region for the bottom links

    MSYS_DefineRegion(gSelectedFuneralLinkRegion[i], usPosX, FUNERAL_LINK_1_Y, (usPosX + FUNERAL_LINK_1_WIDTH), (FUNERAL_LINK_1_Y + FUNERAL_LINK_1_HEIGHT), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectFuneralLinkRegionCallBack);
    MSYS_AddRegion(gSelectedFuneralLinkRegion[i]);
    MSYS_SetRegionUserData(gSelectedFuneralLinkRegion[i], 0, i);

    usPosX += FUNERAL_LINK_OFFSET_X;
  }

  MSYS_DefineRegion(gSelectedRipSignRegion, FUNERAL_CLOSED_RIP_SIGN_X, FUNERAL_CLOSED_RIP_SIGN_Y, (FUNERAL_CLOSED_RIP_SIGN_X + FUNERAL_CLOSED_WIDTH), (FUNERAL_CLOSED_RIP_SIGN_Y + FUNERAL_CLOSED_HEIGHT), MSYS_PRIORITY_HIGH + 1, Enum317.CURSOR_LAPTOP_SCREEN, MSYS_NO_CALLBACK, SelectRipSignRegionCallBack);
  MSYS_AddRegion(gSelectedRipSignRegion);
  MSYS_DisableRegion(gSelectedRipSignRegion);

  SetBookMark(Enum98.FUNERAL_BOOKMARK);

  return true;
}

export function ExitFuneral(): void {
  let i: UINT8;

  DeleteVideoObjectFromIndex(guiClosedSign);
  DeleteVideoObjectFromIndex(guiLeftColumn);
  DeleteVideoObjectFromIndex(guiLinkCarving);
  DeleteVideoObjectFromIndex(guiMarbleBackground);
  DeleteVideoObjectFromIndex(guiMcGillicuttys);
  DeleteVideoObjectFromIndex(guiMortuary);
  DeleteVideoObjectFromIndex(guiRightColumn);

  for (i = 0; i < FUNERAL_NUMBER_OF_LINKS; i++) {
    MSYS_RemoveRegion(gSelectedFuneralLinkRegion[i]);
  }

  MSYS_RemoveRegion(gSelectedRipSignRegion);
}

export function HandleFuneral(): void {
}

export function RenderFuneral(): void {
  let hPixHandle: HVOBJECT;
  let i: UINT16;
  let usPosX: UINT16;
  let usStringHeight: UINT16;

  WebPageTileBackground(4, 4, FUNERAL_MARBLE_WIDTH, FUNERAL_MARBLE_HEIGHT, guiMarbleBackground);

  // LeftColumn
  GetVideoObject(addressof(hPixHandle), guiLeftColumn);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FUNERAL_LEFT_COLUMN_X, FUNERAL_LEFT_COLUMN_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Mcgillicuttys
  GetVideoObject(addressof(hPixHandle), guiMcGillicuttys);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FUNERAL_MCGILICUTTYS_SIGN_X, FUNERAL_MCGILICUTTYS_SIGN_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Mortuary
  GetVideoObject(addressof(hPixHandle), guiMortuary);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FUNERAL_MORTUARY_SIGN_X, FUNERAL_MORTUARY_SIGN_Y, VO_BLT_SRCTRANSPARENCY, null);

  // right column
  GetVideoObject(addressof(hPixHandle), guiRightColumn);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FUNERAL_RIGHT_COLUMN_X, FUNERAL_RIGHT_COLUMN_Y, VO_BLT_SRCTRANSPARENCY, null);

  // LinkCarving
  GetVideoObject(addressof(hPixHandle), guiLinkCarving);

  usPosX = FUNERAL_LINK_1_X;
  for (i = 0; i < FUNERAL_NUMBER_OF_LINKS; i++) {
    BltVideoObject(FRAME_BUFFER, hPixHandle, 0, usPosX, FUNERAL_LINK_1_Y, VO_BLT_SRCTRANSPARENCY, null);

    // Calculate the height of the string, as it needs to be vertically centered.
    usStringHeight = IanWrappedStringHeight(0, 0, FUNERAL_LINK_TEXT_WIDTH, 2, FUNERAL_SENTENCE_FONT(), 0, sFuneralString[i + Enum344.FUNERAL_SEND_FLOWERS], 0, 0, 0);
    DisplayWrappedString((usPosX + FUNERAL_LINK_TEXT_OFFSET_X), (FUNERAL_LINK_1_Y + (FUNERAL_LINK_1_HEIGHT - usStringHeight) / 2), FUNERAL_LINK_TEXT_WIDTH, 2, FUNERAL_SENTENCE_FONT(), FUNERAL_TITLE_COLOR, sFuneralString[i + Enum344.FUNERAL_SEND_FLOWERS], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

    usPosX += FUNERAL_LINK_OFFSET_X;
  }

  // display all the sentences

  // sentence 1
  DisplayWrappedString(FUNERAL_SENTENCE_1_X, FUNERAL_SENTENCE_1_Y, FUNERAL_SENTENCE_WIDTH, 2, FUNERAL_TITLE_FONT(), FUNERAL_TITLE_COLOR, sFuneralString[Enum344.FUNERAL_INTRO_1], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  SetFontShadow(FUNERAL_SENTENCE_SHADOW_COLOR);

  // sentence 2
  DisplayWrappedString(FUNERAL_SENTENCE_2_X, FUNERAL_SENTENCE_2_Y, FUNERAL_SENTENCE_WIDTH, 2, FUNERAL_SENTENCE_FONT(), FUNERAL_SENTENCE_COLOR, sFuneralString[Enum344.FUNERAL_INTRO_2], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // sentence 3
  DisplayWrappedString(FUNERAL_SENTENCE_3_X, FUNERAL_SENTENCE_3_Y, FUNERAL_SENTENCE_WIDTH, 2, FUNERAL_SENTENCE_FONT(), FUNERAL_SENTENCE_COLOR, sFuneralString[Enum344.FUNERAL_INTRO_3], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // sentence 4
  DisplayWrappedString(FUNERAL_SENTENCE_4_X, FUNERAL_SENTENCE_4_Y, FUNERAL_SENTENCE_WIDTH, 2, FUNERAL_SENTENCE_FONT(), FUNERAL_SENTENCE_COLOR, sFuneralString[Enum344.FUNERAL_INTRO_4], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  // sentence 5
  DisplayWrappedString(FUNERAL_SENTENCE_5_X, FUNERAL_SENTENCE_5_Y, FUNERAL_SENTENCE_WIDTH, 2, FUNERAL_SENTENCE_FONT(), FUNERAL_SENTENCE_COLOR, sFuneralString[Enum344.FUNERAL_INTRO_5], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  SetFontShadow(DEFAULT_SHADOW);

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function DisplayFuneralRipTombStone(): void {
  let hPixHandle: HVOBJECT;

  // rip tombstone
  GetVideoObject(addressof(hPixHandle), guiClosedSign);
  BltVideoObjectOutlineShadowFromIndex(FRAME_BUFFER, guiClosedSign, 0, FUNERAL_CLOSED_RIP_SIGN_X + 5, FUNERAL_CLOSED_RIP_SIGN_Y + 5);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, FUNERAL_CLOSED_RIP_SIGN_X, FUNERAL_CLOSED_RIP_SIGN_Y, VO_BLT_SRCTRANSPARENCY, null);

  SetFontShadow(FUNERAL_RIP_SHADOW_COLOR);

  // sentence 10
  DisplayWrappedString(FUNERAL_RIP_SENTENCE_1_X, FUNERAL_RIP_SENTENCE_1_Y, FUNERAL_RIP_SENTENCE_WIDTH, 2, FUNERAL_SMALL_FONT(), FUNERAL_SENTENCE_COLOR, sFuneralString[Enum344.FUNERAL_OUR_CONDOLENCES], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED); // FUNERAL_TITLE_FONT

  // sentence 11
  DisplayWrappedString(FUNERAL_RIP_SENTENCE_2_X, FUNERAL_RIP_SENTENCE_2_Y, FUNERAL_RIP_SENTENCE_WIDTH, 2, FUNERAL_SMALL_FONT(), FUNERAL_SENTENCE_COLOR, sFuneralString[Enum344.FUNERAL_OUR_SYMPATHIES], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  SetFontShadow(DEFAULT_SHADOW);

  InvalidateRegion(FUNERAL_CLOSED_RIP_SIGN_X, FUNERAL_CLOSED_RIP_SIGN_Y, FUNERAL_CLOSED_RIP_SIGN_X + FUNERAL_CLOSED_WIDTH + 5, FUNERAL_CLOSED_RIP_SIGN_Y + FUNERAL_CLOSED_HEIGHT + 5);

  // enable the region to make the sign disappear
  MSYS_EnableRegion(gSelectedRipSignRegion);
}

function SelectFuneralLinkRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let uiUserData: UINT32;

    uiUserData = MSYS_GetRegionUserData(pRegion, 0);

    if (uiUserData == 0)
      GoToWebPage(Enum98.FLORIST_BOOKMARK);
    else {
      RenderFuneral();
      DisplayFuneralRipTombStone();
    }
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectRipSignRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    MSYS_DisableRegion(gSelectedRipSignRegion);
    fPausedReDrawScreenFlag = true;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

}
