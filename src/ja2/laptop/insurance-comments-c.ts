namespace ja2 {

const INS_CMNT_TITLE_Y = 52 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_CMNT_FIRST_BULLET_X = 82 + LAPTOP_SCREEN_UL_X;
const INS_CMNT_FIRST_BULLET_Y = 75 + LAPTOP_SCREEN_WEB_UL_Y;

const INS_CMNT_REDLINE_WIDTH = 384;

const INS_CMNT_COMMENT_OFFSET_Y = 20;

const INS_CMNT_NEXT_COMMENT_OFFSET_Y = 65;

const INS_CMNT_COMMENT_TEXT_WIDTH = 364;

const INS_CMNT_LINK_Y = 357 + LAPTOP_SCREEN_WEB_UL_Y;
const INS_CMNT_LINK_WIDTH = 90;
const INS_CMNT_LINK_HEIGHT = 35;
const INS_CMNT_LINK_OFFSET_X = 166;

let guiInsCmntBulletImage: UINT32;

// link to the varios pages
let gSelectedInsuranceCommentLinkRegion: MOUSE_REGION[] /* [3] */ = createArrayFrom(3, createMouseRegion);

function GameInitInsuranceComments(): void {
}

export function EnterInsuranceComments(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let i: UINT8;
  let usPosX: UINT16;

  InitInsuranceDefaults();

  // load the Insurance bullet graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\bullet.sti");
  if (!(guiInsCmntBulletImage = AddVideoObject(VObjectDesc))) {
    return false;
  }

  usPosX = INS_CMNT_FIRST_BULLET_X - 6;
  for (i = 0; i < 3; i++) {
    MSYS_DefineRegion(gSelectedInsuranceCommentLinkRegion[i], usPosX, INS_CMNT_LINK_Y - 1, (usPosX + INS_CMNT_LINK_WIDTH), INS_CMNT_LINK_Y + INS_CMNT_LINK_HEIGHT + 1, MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectInsuranceCommentLinkRegionCallBack);
    MSYS_AddRegion(gSelectedInsuranceCommentLinkRegion[i]);
    MSYS_SetRegionUserData(gSelectedInsuranceCommentLinkRegion[i], 0, i);

    usPosX += INS_CMNT_LINK_OFFSET_X;
  }

  RenderInsuranceComments();

  return true;
}

export function ExitInsuranceComments(): void {
  let i: UINT8;
  RemoveInsuranceDefaults();
  DeleteVideoObjectFromIndex(guiInsCmntBulletImage);

  for (i = 0; i < 3; i++)
    MSYS_RemoveRegion(gSelectedInsuranceCommentLinkRegion[i]);
}

export function HandleInsuranceComments(): void {
}

export function RenderInsuranceComments(): void {
  //  HVOBJECT hPixHandle;
  let sText: string /* wchar_t[800] */;
  let usPosX: UINT16;
  let usPosY: UINT16;

  SetFontShadow(INS_FONT_SHADOW);

  DisplayInsuranceDefaults();

  // Display the title slogan
  sText = GetInsuranceText(Enum90.INS_SNGL_COMMENTSFROM_CLIENTS);
  DrawTextToScreen(sText, LAPTOP_SCREEN_UL_X, INS_CMNT_TITLE_Y, LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X, INS_FONT_BIG(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  usPosY = INS_CMNT_FIRST_BULLET_Y;

  // Display the commnet from Gus
  DisplayComment(Enum90.INS_SNGL_GUS_TARBALLS, Enum90.INS_MLTI_GUS_SPEECH, usPosY);

  usPosY += INS_CMNT_NEXT_COMMENT_OFFSET_Y;

  // Display the commnet from ali hussean
  DisplayComment(Enum90.INS_SNGL_ALI_HUSSEAN, Enum90.INS_MLTI_ALI_HUSSEAN_SPEECH, usPosY);

  usPosY += INS_CMNT_NEXT_COMMENT_OFFSET_Y;

  // Display the commnet from Lance allot
  DisplayComment(Enum90.INS_SNGL_LANCE_ALLOT, Enum90.INS_MLTI_LANCE_ALLOT_SPEECH, usPosY);

  usPosY += INS_CMNT_NEXT_COMMENT_OFFSET_Y;

  // Display the commnet from Fred Cousteau
  DisplayComment(Enum90.INS_SNGL_FRED_COUSTEAU, Enum90.INS_MLTI_FRED_COUSTEAU_SPEECH, usPosY);

  // Display the link text
  usPosX = INS_CMNT_FIRST_BULLET_X - 6;

  // Display the first link text
  sText = swprintf("%s", pMessageStrings[Enum333.MSG_HOMEPAGE]);
  DisplayWrappedString(usPosX, INS_CMNT_LINK_Y + 13, INS_CMNT_LINK_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  // Display the red bar under the link at the bottom
  DisplaySmallRedLineWithShadow(usPosX, INS_CMNT_LINK_Y + INS_CMNT_LINK_HEIGHT, (usPosX + INS_CMNT_LINK_WIDTH), INS_CMNT_LINK_Y + INS_CMNT_LINK_HEIGHT);
  usPosX += INS_CMNT_LINK_OFFSET_X;

  // Display the third link text
  sText = GetInsuranceText(Enum90.INS_SNGL_HOW_DOES_INS_WORK);
  DisplayWrappedString(usPosX, INS_CMNT_LINK_Y + 6, INS_CMNT_LINK_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  // Display the red bar under the link at the bottom
  DisplaySmallRedLineWithShadow(usPosX, INS_CMNT_LINK_Y + INS_CMNT_LINK_HEIGHT, (usPosX + INS_CMNT_LINK_WIDTH), INS_CMNT_LINK_Y + INS_CMNT_LINK_HEIGHT);
  usPosX += INS_CMNT_LINK_OFFSET_X;

  // Display the fourth link text
  sText = GetInsuranceText(Enum90.INS_SNGL_TO_ENTER_REVIEW);
  DisplayWrappedString(usPosX, INS_CMNT_LINK_Y - 1, INS_CMNT_LINK_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  // Display the red bar under the link at the bottom
  DisplaySmallRedLineWithShadow(usPosX, INS_CMNT_LINK_Y + INS_CMNT_LINK_HEIGHT, (usPosX + INS_CMNT_LINK_WIDTH), INS_CMNT_LINK_Y + INS_CMNT_LINK_HEIGHT);

  SetFontShadow(DEFAULT_SHADOW);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function SelectInsuranceCommentLinkRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let uiInsuranceLink: UINT32 = MSYS_GetRegionUserData(pRegion, 0);

    if (uiInsuranceLink == 0)
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE;
    else if (uiInsuranceLink == 1)
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE_INFO;
    else if (uiInsuranceLink == 2)
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_INSURANCE_CONTRACT;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function DisplayComment(ubCommentorsName: UINT8, ubComment: UINT8, usPosY: UINT16): boolean {
  let sText: string /* wchar_t[800] */;
  let hPixHandle: SGPVObject;
  let sNumPixels: UINT16 = 0;

  // Get and display the insurance bullet
  hPixHandle = GetVideoObject(guiInsCmntBulletImage);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, INS_CMNT_FIRST_BULLET_X, usPosY, VO_BLT_SRCTRANSPARENCY, null);

  // Display the commenters comment
  sText = GetInsuranceText(ubComment); //+INS_CMNT_COMMENT_OFFSET_Y
  sNumPixels = DisplayWrappedString(INS_CMNT_FIRST_BULLET_X + INSURANCE_BULLET_TEXT_OFFSET_X, (usPosY), INS_CMNT_COMMENT_TEXT_WIDTH, 2, INS_FONT_MED(), INS_FONT_COLOR, sText, FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED);

  // Display the red bar under the link at the bottom
  DisplaySmallRedLineWithShadow(INS_CMNT_FIRST_BULLET_X + INSURANCE_BULLET_TEXT_OFFSET_X, (usPosY + sNumPixels), INS_CMNT_FIRST_BULLET_X + INS_CMNT_REDLINE_WIDTH, (usPosY + sNumPixels));

  sNumPixels += 4;

  // Display the commenters name
  sText = GetInsuranceText(ubCommentorsName);
  DrawTextToScreen(sText, INS_CMNT_FIRST_BULLET_X + INSURANCE_BULLET_TEXT_OFFSET_X, (usPosY + sNumPixels), INS_CMNT_REDLINE_WIDTH, INS_FONT_MED(), INS_FONT_COLOR, FONT_MCOLOR_BLACK, false, RIGHT_JUSTIFIED);

  return true;
}

}
