const AIM_LINK_TITLE_FONT = () => FONT14ARIAL();
const AIM_LINK_TITLE_COLOR = AIM_GREEN;

const AIM_LINK_FONT = () => FONT12ARIAL();
const AIM_LINK_COLOR = AIM_FONT_GOLD;

const AIM_LINK_NUM_LINKS = 3;

const AIM_LINK_LINK_OFFSET_Y = 94; // 90

const AIM_LINK_LINK_WIDTH = 420;
const AIM_LINK_LINK_HEIGHT = 70;

const AIM_LINK_BOBBY_LINK_X = LAPTOP_SCREEN_UL_X + 40;
const AIM_LINK_BOBBY_LINK_Y = LAPTOP_SCREEN_WEB_UL_Y + 91;

const AIM_LINK_FUNERAL_LINK_X = AIM_LINK_BOBBY_LINK_X;
const AIM_LINK_FUNERAL_LINK_Y = AIM_LINK_BOBBY_LINK_Y + AIM_LINK_LINK_OFFSET_Y;

const AIM_LINK_INSURANCE_LINK_X = AIM_LINK_BOBBY_LINK_X;
const AIM_LINK_INSURANCE_LINK_Y = AIM_LINK_FUNERAL_LINK_Y + AIM_LINK_LINK_OFFSET_Y;

const AIM_LINK_TITLE_X = IMAGE_OFFSET_X + 149;
const AIM_LINK_TITLE_Y = AIM_SYMBOL_Y + AIM_SYMBOL_SIZE_Y + 10;
const AIM_LINK_TITLE_WIDTH = AIM_SYMBOL_WIDTH;

const AIM_LINK_LINK_TEXT_1_Y = AIM_LINK_BOBBY_LINK_Y + 71;
const AIM_LINK_LINK_TEXT_2_Y = AIM_LINK_FUNERAL_LINK_Y + 36;
const AIM_LINK_LINK_TEXT_3_Y = AIM_LINK_INSURANCE_LINK_Y + 45;

let guiBobbyLink: UINT32;
let guiFuneralLink: UINT32;
let guiInsuranceLink: UINT32;
let gubLinkPages: UINT8[] /* [] */ = {
  BOBBYR_BOOKMARK,
  FUNERAL_BOOKMARK,
  INSURANCE_BOOKMARK,
};

// Clicking on guys Face
let gSelectedLinkRegion: MOUSE_REGION[] /* [AIM_LINK_NUM_LINKS] */;

function GameInitAimLinks(): void {
}

function EnterAimLinks(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;
  let usPosY: UINT16;
  let i: INT16;

  InitAimDefaults();
  InitAimMenuBar();

  // load the Bobby link graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, MLG_BOBBYRAYLINK);
  CHECKF(AddVideoObject(&VObjectDesc, &guiBobbyLink));

  // load the Funeral graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, MLG_MORTUARYLINK);
  CHECKF(AddVideoObject(&VObjectDesc, &guiFuneralLink));

  // load the Insurance graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  GetMLGFilename(VObjectDesc.ImageFile, MLG_INSURANCELINK);
  CHECKF(AddVideoObject(&VObjectDesc, &guiInsuranceLink));

  usPosY = AIM_LINK_BOBBY_LINK_Y;
  for (i = 0; i < AIM_LINK_NUM_LINKS; i++) {
    MSYS_DefineRegion(&gSelectedLinkRegion[i], AIM_LINK_BOBBY_LINK_X, usPosY, AIM_LINK_BOBBY_LINK_X + AIM_LINK_LINK_WIDTH, (UINT16)(usPosY + AIM_LINK_LINK_HEIGHT), MSYS_PRIORITY_HIGH, CURSOR_WWW, MSYS_NO_CALLBACK, SelectLinkRegionCallBack);
    MSYS_AddRegion(&gSelectedLinkRegion[i]);
    MSYS_SetRegionUserData(&gSelectedLinkRegion[i], 0, gubLinkPages[i]);
    usPosY += AIM_LINK_LINK_OFFSET_Y;
  }

  RenderAimLinks();
  return TRUE;
}

function ExitAimLinks(): void {
  let i: INT16;

  RemoveAimDefaults();

  DeleteVideoObjectFromIndex(guiBobbyLink);
  DeleteVideoObjectFromIndex(guiFuneralLink);
  DeleteVideoObjectFromIndex(guiInsuranceLink);

  for (i = 0; i < AIM_LINK_NUM_LINKS; i++)
    MSYS_RemoveRegion(&gSelectedLinkRegion[i]);

  ExitAimMenuBar();
}

function HandleAimLinks(): void {
}

function RenderAimLinks(): void {
  let hPixHandle: HVOBJECT;

  DrawAimDefaults();
  DisableAimButton();

  GetVideoObject(&hPixHandle, guiBobbyLink);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, AIM_LINK_BOBBY_LINK_X, AIM_LINK_BOBBY_LINK_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  GetVideoObject(&hPixHandle, guiFuneralLink);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, AIM_LINK_FUNERAL_LINK_X, AIM_LINK_FUNERAL_LINK_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  //	DrawTextToScreen(AimLinkText[AIM_LINK_FUNERAL], AIM_LINK_BOBBY_LINK_X, AIM_LINK_LINK_TEXT_2_Y, AIM_LINK_LINK_WIDTH, AIM_LINK_FONT, AIM_LINK_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  GetVideoObject(&hPixHandle, guiInsuranceLink);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, AIM_LINK_INSURANCE_LINK_X, AIM_LINK_INSURANCE_LINK_Y, VO_BLT_SRCTRANSPARENCY, NULL);
  //	DrawTextToScreen(AimLinkText[AIM_LINK_LISTENING], AIM_LINK_BOBBY_LINK_X, AIM_LINK_LINK_TEXT_3_Y, AIM_LINK_LINK_WIDTH, AIM_LINK_FONT, AIM_LINK_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  // Draw Link Title
  DrawTextToScreen(AimLinkText[AIM_LINK_TITLE], AIM_LINK_TITLE_X, AIM_LINK_TITLE_Y, AIM_LINK_TITLE_WIDTH, AIM_LINK_TITLE_FONT, AIM_LINK_TITLE_COLOR, FONT_MCOLOR_BLACK, FALSE, CENTER_JUSTIFIED);

  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function SelectLinkRegionCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let gNextLaptopPage: UINT32;

    gNextLaptopPage = MSYS_GetRegionUserData(pRegion, 0);

    GoToWebPage(gNextLaptopPage);
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}
