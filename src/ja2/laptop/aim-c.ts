namespace ja2 {

export let AimMercArray: UINT8[] /* [MAX_NUMBER_MERCS] */;

let gCurrentAimPage: UINT8[] /* [NUM_AIM_SCREENS] */ = [
  Enum95.LAPTOP_MODE_AIM,
  Enum95.LAPTOP_MODE_AIM_MEMBERS_SORTED_FILES,
  Enum95.LAPTOP_MODE_AIM_MEMBERS_ARCHIVES,
  Enum95.LAPTOP_MODE_AIM_POLICIES,
  Enum95.LAPTOP_MODE_AIM_HISTORY,
  Enum95.LAPTOP_MODE_AIM_LINKS,
];

//
//***  Defines **
//

const BOBBYR_UNDER_CONSTRUCTION_AD_FONT = () => FONT14HUMANIST(); // FONT16ARIAL
const BOBBYR_UNDER_CONSTRUCTION_AD_COLOR = FONT_MCOLOR_DKRED; // FONT_MCOLOR_WHITE

// Link Images
const LINK_SIZE_X = 101;
const LINK_SIZE_Y = 76;

const MEMBERCARD_X = IMAGE_OFFSET_X + 118;
const MEMBERCARD_Y = IMAGE_OFFSET_Y + 190;

const POLICIES_X = IMAGE_OFFSET_X + 284;
const POLICIES_Y = MEMBERCARD_Y;

const HISTORY_X = MEMBERCARD_X;
const HISTORY_Y = IMAGE_OFFSET_Y + 279;

const LINKS_X = POLICIES_X;
const LINKS_Y = HISTORY_Y;

const WARNING_X = IMAGE_OFFSET_X + 126;
const WARNING_Y = IMAGE_OFFSET_Y + 80 - 1;

const MEMBERS_TEXT_Y = MEMBERCARD_Y + 77;
const HISTORY_TEXT_Y = HISTORY_Y + 77;
const POLICIES_TEXT_Y = MEMBERS_TEXT_Y;
const LINK_TEXT_Y = HISTORY_TEXT_Y;

const AIM_WARNING_TEXT_X = WARNING_X + 15;
const AIM_WARNING_TEXT_Y = WARNING_Y + 46;
const AIM_WARNING_TEXT_WIDTH = 220;

const AIM_FLOWER_LINK_TEXT_Y = AIM_WARNING_TEXT_Y + 25;

const AIM_BOBBYR1_LINK_TEXT_X = WARNING_X + 20;
const AIM_BOBBYR1_LINK_TEXT_Y = WARNING_Y + 20;

const AIM_BOBBYR2_LINK_TEXT_X = WARNING_X + 50;
const AIM_BOBBYR2_LINK_TEXT_Y = WARNING_Y + 58;

const AIM_BOBBYR3_LINK_TEXT_X = WARNING_X + 20;
const AIM_BOBBYR3_LINK_TEXT_Y = WARNING_Y + 20;

const AIM_AD_TOP_LEFT_X = WARNING_X;
const AIM_AD_TOP_LEFT_Y = WARNING_Y;
const AIM_AD_BOTTOM_RIGHT_X = AIM_AD_TOP_LEFT_X + 248;
const AIM_AD_BOTTOM_RIGHT_Y = AIM_AD_TOP_LEFT_Y + 110;

const AIM_COPYRIGHT_X = 160;
const AIM_COPYRIGHT_Y = 396 + LAPTOP_SCREEN_WEB_DELTA_Y;
const AIM_COPYRIGHT_WIDTH = 400;
const AIM_COPYRIGHT_GAP = 9;

//#define			AIM_WARNING_TIME				100
const AIM_WARNING_TIME = 10000;

//#define			AIM_ADVERTISING_DELAY		50
const AIM_ADVERTISING_DELAY = 500;

//#define			AIM_FLOWER_AD_DELAY					15
const AIM_FLOWER_AD_DELAY = 150;
const AIM_FLOWER_NUM_SUBIMAGES = 16;

const AIM_AD_FOR_ADS_DELAY = 150;
//#define			AIM_AD_FOR_ADS_DELAY					15
const AIM_AD_FOR_ADS__NUM_SUBIMAGES = 13;

const AIM_AD_INSURANCE_AD_DELAY = 150;
const AIM_AD_INSURANCE_AD__NUM_SUBIMAGES = 10;

const AIM_AD_FUNERAL_AD_DELAY = 250;
const AIM_AD_FUNERAL_AD__NUM_SUBIMAGES = 9;

const AIM_AD_BOBBYR_AD_STARTS = 2;
const AIM_AD_DAY_FUNERAL_AD_STARTS = 4;
const AIM_AD_DAY_FLOWER_AD_STARTS = 7;
const AIM_AD_DAY_INSURANCE_AD_STARTS = 12;

const AIM_AD_BOBBYR_AD_DELAY = 300;
const AIM_AD_BOBBYR_AD__NUM_SUBIMAGES = 21;
const AIM_AD_BOBBYR_AD_NUM_DUCK_SUBIMAGES = 6;

//#define

const enum Enum62 {
  AIM_AD_NOT_DONE,
  AIM_AD_DONE,
  AIM_AD_WARNING_BOX,
  AIM_AD_FOR_ADS,
  AIM_AD_BOBBY_RAY_AD,
  AIM_AD_FUNERAL_ADS,
  AIM_AD_FLOWER_SHOP,
  AIM_AD_INSURANCE_AD,
  AIM_AD_LAST_AD,
}

// Aim Screen Handle
let guiAimSymbol: UINT32;
let guiRustBackGround: UINT32;
let guiMemberCard: UINT32;
let guiPolicies: UINT32;
let guiHistory: UINT32;
let guiLinks: UINT32;
let guiWarning: UINT32;
export let guiBottomButton: UINT32;
export let guiBottomButton2: UINT32;
let guiFlowerAdvertisement: UINT32;
let guiAdForAdsImages: UINT32;
let guiInsuranceAdImages: UINT32;
let guiFuneralAdImages: UINT32;
let guiBobbyRAdImages: UINT32;

let gubAimMenuButtonDown: UINT8 = 255;
let gubWarningTimer: UINT32;
let gubCurrentAdvertisment: UINT8;

let gfInitAdArea: boolean;

// MemberCard
let gSelectedMemberCardRegion: MOUSE_REGION = createMouseRegion();

// Policies
let gSelectedPoliciesRegion: MOUSE_REGION = createMouseRegion();

// History
let gSelectedHistoryRegion: MOUSE_REGION = createMouseRegion();

// Links
let gSelectedLinksRegion: MOUSE_REGION = createMouseRegion();

let guiBottomButtons: UINT32[] /* [NUM_AIM_SCREENS] */;
let guiBottomButtonImage: INT32;

// Banner Area
let gSelectedBannerRegion: MOUSE_REGION = createMouseRegion();

// Aim logo click
let gSelectedAimLogo: MOUSE_REGION = createMouseRegion();

let fFirstTimeIn: boolean = true;

//
// ***********************  Functions		*************************
//

export function GameInitAIM(): void {
  LaptopInitAim();
}

export function EnterAIM(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  gubWarningTimer = 0;
  gubCurrentAdvertisment = Enum62.AIM_AD_WARNING_BOX;
  LaptopInitAim();

  InitAimDefaults();

  // load the MemberShipcard graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\membercard.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMemberCard))) {
    return false;
  }

  // load the Policies graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Policies.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiPolicies))) {
    return false;
  }

  // load the Links graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Links.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiLinks))) {
    return false;
  }

  // load the History graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_HISTORY);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiHistory))) {
    return false;
  }

  // load the Wanring graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_WARNING);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiWarning))) {
    return false;
  }

  // load the flower advertisment and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\flowerad_16.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiFlowerAdvertisement))) {
    return false;
  }

  // load the your ad advertisment and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_YOURAD13);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiAdForAdsImages))) {
    return false;
  }

  // load the insurance advertisment and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_INSURANCEAD10);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiInsuranceAdImages))) {
    return false;
  }

  // load the funeral advertisment and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_FUNERALAD9);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiFuneralAdImages))) {
    return false;
  }

  // load the funeral advertisment and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_BOBBYRAYAD21);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiBobbyRAdImages))) {
    return false;
  }

  //** Mouse Regions **

  // Mouse region for the MebershipCard
  MSYS_DefineRegion(gSelectedMemberCardRegion, MEMBERCARD_X, MEMBERCARD_Y, (MEMBERCARD_X + LINK_SIZE_X), (MEMBERCARD_Y + LINK_SIZE_Y), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectMemberCardRegionCallBack);
  MSYS_AddRegion(gSelectedMemberCardRegion);

  // Mouse region for the Policies
  MSYS_DefineRegion(gSelectedPoliciesRegion, POLICIES_X, POLICIES_Y, (POLICIES_X + LINK_SIZE_X), (POLICIES_Y + LINK_SIZE_Y), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectPoliciesRegionCallBack);
  MSYS_AddRegion(gSelectedPoliciesRegion);

  // Mouse region for the History
  MSYS_DefineRegion(gSelectedHistoryRegion, HISTORY_X, HISTORY_Y, (HISTORY_X + LINK_SIZE_X), (HISTORY_Y + LINK_SIZE_Y), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectHistoryRegionCallBack);
  MSYS_AddRegion(gSelectedHistoryRegion);

  // Mouse region for the Links
  MSYS_DefineRegion(gSelectedLinksRegion, LINKS_X, LINKS_Y, (LINKS_X + LINK_SIZE_X), (LINKS_Y + LINK_SIZE_Y), MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectLinksRegionCallBack);
  MSYS_AddRegion(gSelectedLinksRegion);

  // Mouse region for the Links
  MSYS_DefineRegion(gSelectedBannerRegion, AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y, MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectBannerRegionCallBack);
  MSYS_AddRegion(gSelectedBannerRegion);

  // disable the region because only certain banners will be 'clickable'
  MSYS_DisableRegion(gSelectedBannerRegion);

  gubAimMenuButtonDown = 255;

  fFirstTimeIn = false;
  RenderAIM();

  return true;
}

function LaptopInitAim(): void {
  gfInitAdArea = true;
}

export function ExitAIM(): void {
  RemoveAimDefaults();

  DeleteVideoObjectFromIndex(guiMemberCard);
  DeleteVideoObjectFromIndex(guiPolicies);
  DeleteVideoObjectFromIndex(guiLinks);
  DeleteVideoObjectFromIndex(guiHistory);
  DeleteVideoObjectFromIndex(guiWarning);
  DeleteVideoObjectFromIndex(guiFlowerAdvertisement);
  DeleteVideoObjectFromIndex(guiAdForAdsImages);
  DeleteVideoObjectFromIndex(guiInsuranceAdImages);
  DeleteVideoObjectFromIndex(guiFuneralAdImages);
  DeleteVideoObjectFromIndex(guiBobbyRAdImages);

  // Remove Mouse Regions
  MSYS_RemoveRegion(gSelectedMemberCardRegion);
  MSYS_RemoveRegion(gSelectedPoliciesRegion);
  MSYS_RemoveRegion(gSelectedLinksRegion);
  MSYS_RemoveRegion(gSelectedHistoryRegion);
  MSYS_RemoveRegion(gSelectedBannerRegion);
}

export function HandleAIM(): void {
  HandleAdAndWarningArea(gfInitAdArea, false);
  gfInitAdArea = false;
}

export function RenderAIM(): void {
  let hMemberCardHandle: HVOBJECT;
  let hPoliciesHandle: HVOBJECT;
  let hLinksHandle: HVOBJECT;
  let hHistoryHandle: HVOBJECT;
  //	UINT16	x,y, uiPosX, uiPosY;

  DrawAimDefaults();

  // MemberCard
  GetVideoObject(addressof(hMemberCardHandle), guiMemberCard);
  BltVideoObject(FRAME_BUFFER, hMemberCardHandle, 0, MEMBERCARD_X, MEMBERCARD_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Policies
  GetVideoObject(addressof(hPoliciesHandle), guiPolicies);
  BltVideoObject(FRAME_BUFFER, hPoliciesHandle, 0, POLICIES_X, POLICIES_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Links
  GetVideoObject(addressof(hLinksHandle), guiLinks);
  BltVideoObject(FRAME_BUFFER, hLinksHandle, 0, LINKS_X, LINKS_Y, VO_BLT_SRCTRANSPARENCY, null);

  // History
  GetVideoObject(addressof(hHistoryHandle), guiHistory);
  BltVideoObject(FRAME_BUFFER, hHistoryHandle, 0, HISTORY_X, HISTORY_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Draw the aim slogan under the symbol
  DisplayAimSlogan();

  DisplayAimCopyright();

  // Draw text under boxes
  // members
  DrawTextToScreen(AimBottomMenuText[Enum363.AIM_MEMBERS], MEMBERCARD_X, MEMBERS_TEXT_Y, LINK_SIZE_X, FONT12ARIAL(), AIM_FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  // Policies
  DrawTextToScreen(AimBottomMenuText[Enum363.AIM_POLICIES], POLICIES_X, POLICIES_TEXT_Y, LINK_SIZE_X, FONT12ARIAL(), AIM_FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  // History
  DrawTextToScreen(AimBottomMenuText[Enum363.AIM_HISTORY], HISTORY_X, HISTORY_TEXT_Y, LINK_SIZE_X, FONT12ARIAL(), AIM_FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
  // Links
  DrawTextToScreen(AimBottomMenuText[Enum363.AIM_LINKS], LINKS_X, LINK_TEXT_Y, LINK_SIZE_X, FONT12ARIAL(), AIM_FONT_MCOLOR_WHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  HandleAdAndWarningArea(gfInitAdArea, true);

  RenderWWWProgramTitleBar();

  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

function SelectMemberCardRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (!fFirstTimeIn)
      guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM_MEMBERS_SORTED_FILES;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectPoliciesRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM_POLICIES;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectHistoryRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM_HISTORY;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function SelectLinksRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM_LINKS;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

export function InitAimDefaults(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load the Rust bacground graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\rustbackground.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiRustBackGround))) {
    return false;
  }

  // load the Aim Symbol graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_AIMSYMBOL);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiAimSymbol))) {
    return false;
  }

  // Mouse region for the Links
  MSYS_DefineRegion(gSelectedAimLogo, AIM_SYMBOL_X, AIM_SYMBOL_Y, AIM_SYMBOL_X + AIM_SYMBOL_WIDTH, AIM_SYMBOL_Y + AIM_SYMBOL_HEIGHT, MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectAimLogoRegionCallBack);
  MSYS_AddRegion(gSelectedAimLogo);

  return true;
}

export function RemoveAimDefaults(): boolean {
  DeleteVideoObjectFromIndex(guiRustBackGround);
  DeleteVideoObjectFromIndex(guiAimSymbol);
  MSYS_RemoveRegion(gSelectedAimLogo);

  return true;
}

export function DrawAimDefaults(): boolean {
  let hRustBackGroundHandle: HVOBJECT;
  let hAimSymbolHandle: HVOBJECT;
  let x: UINT16;
  let y: UINT16;
  let uiPosX: UINT16;
  let uiPosY: UINT16;

  // Blt the rust background
  GetVideoObject(addressof(hRustBackGroundHandle), guiRustBackGround);

  uiPosY = RUSTBACKGROUND_1_Y;
  for (y = 0; y < 4; y++) {
    uiPosX = RUSTBACKGROUND_1_X;
    for (x = 0; x < 4; x++) {
      BltVideoObject(FRAME_BUFFER, hRustBackGroundHandle, 0, uiPosX, uiPosY, VO_BLT_SRCTRANSPARENCY, null);
      uiPosX += RUSTBACKGROUND_SIZE_X;
    }
    uiPosY += RUSTBACKGROUND_SIZE_Y;
  }

  // Aim Symbol
  GetVideoObject(addressof(hAimSymbolHandle), guiAimSymbol);
  BltVideoObject(FRAME_BUFFER, hAimSymbolHandle, 0, AIM_SYMBOL_X, AIM_SYMBOL_Y, VO_BLT_SRCTRANSPARENCY, null);

  return true;
}

function SelectAimLogoRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    guiCurrentLaptopMode = Enum95.LAPTOP_MODE_AIM;
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

export function DisplayAimSlogan(): boolean {
  let sSlogan: string /* wchar_t[400] */;

  LoadEncryptedDataFromFile(AIMHISTORYFILE, sSlogan, 0, AIM_HISTORY_LINE_SIZE);
  // Display Aim Text under the logo
  DisplayWrappedString(AIM_LOGO_TEXT_X, AIM_LOGO_TEXT_Y, AIM_LOGO_TEXT_WIDTH, 2, AIM_LOGO_FONT(), AIM_FONT_MCOLOR_WHITE, sSlogan, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  return true;
}

export function DisplayAimCopyright(): boolean {
  let sSlogan: string /* wchar_t[400] */;
  let uiStartLoc: UINT32 = 0;

  // Load and Display the copyright notice

  uiStartLoc = AIM_HISTORY_LINE_SIZE * Enum63.AIM_COPYRIGHT_1;
  LoadEncryptedDataFromFile(AIMHISTORYFILE, sSlogan, uiStartLoc, AIM_HISTORY_LINE_SIZE);
  DrawTextToScreen(sSlogan, AIM_COPYRIGHT_X, AIM_COPYRIGHT_Y, AIM_COPYRIGHT_WIDTH, AIM_COPYRIGHT_FONT(), FONT_MCOLOR_DKWHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  uiStartLoc = AIM_HISTORY_LINE_SIZE * Enum63.AIM_COPYRIGHT_2;
  LoadEncryptedDataFromFile(AIMHISTORYFILE, sSlogan, uiStartLoc, AIM_HISTORY_LINE_SIZE);
  DrawTextToScreen(sSlogan, AIM_COPYRIGHT_X, AIM_COPYRIGHT_Y + AIM_COPYRIGHT_GAP, AIM_COPYRIGHT_WIDTH, AIM_COPYRIGHT_FONT(), FONT_MCOLOR_DKWHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  uiStartLoc = AIM_HISTORY_LINE_SIZE * Enum63.AIM_COPYRIGHT_3;
  LoadEncryptedDataFromFile(AIMHISTORYFILE, sSlogan, uiStartLoc, AIM_HISTORY_LINE_SIZE);
  DrawTextToScreen(sSlogan, AIM_COPYRIGHT_X, AIM_COPYRIGHT_Y + AIM_COPYRIGHT_GAP * 2, AIM_COPYRIGHT_WIDTH, AIM_COPYRIGHT_FONT(), FONT_MCOLOR_DKWHITE, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

  return true;
}

// Buttons
export function InitAimMenuBar(): boolean {
  let i: UINT8;
  let usPosX: UINT16;

  guiBottomButtonImage = LoadButtonImage("LAPTOP\\BottomButtons2.sti", -1, 0, -1, 1, -1);

  usPosX = BOTTOM_BUTTON_START_X;
  for (i = 0; i < BOTTOM_BUTTON_AMOUNT; i++) {
    guiBottomButtons[i] = CreateIconAndTextButton(guiBottomButtonImage, AimBottomMenuText[i], FONT10ARIAL(), AIM_BUTTON_ON_COLOR, DEFAULT_SHADOW, AIM_BUTTON_OFF_COLOR, DEFAULT_SHADOW, TEXT_CJUSTIFIED, usPosX, BOTTOM_BUTTON_START_Y, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), BtnAimBottomButtonsCallback);
    SetButtonCursor(guiBottomButtons[i], Enum317.CURSOR_LAPTOP_SCREEN);

    MSYS_SetBtnUserData(guiBottomButtons[i], 0, gCurrentAimPage[i]);
    MSYS_SetBtnUserData(guiBottomButtons[i], 1, i);

    usPosX += BOTTOM_BUTTON_START_WIDTH;
  }
  return true;
}
export function ExitAimMenuBar(): boolean {
  let i: UINT8;

  UnloadButtonImage(guiBottomButtonImage);

  for (i = 0; i < BOTTOM_BUTTON_AMOUNT; i++) {
    RemoveButton(guiBottomButtons[i]);
  }
  return true;
}

function BtnAimBottomButtonsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let bNewValue: UINT32;

  bNewValue = MSYS_GetBtnUserData(btn, 0);
  gubAimMenuButtonDown = 255;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;

    gubAimMenuButtonDown = MSYS_GetBtnUserData(btn, 1);
    InvalidateRegion(BOTTOM_BUTTON_START_X, BOTTOM_BUTTON_START_Y, BOTTOM_BUTTON_END_X, BOTTOM_BUTTON_END_Y);
  }
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) {
      ResetAimButtons(guiBottomButtons, NUM_AIM_BOTTOMBUTTONS);

      guiCurrentLaptopMode = MSYS_GetBtnUserData(btn, 0);

      InvalidateRegion(BOTTOM_BUTTON_START_X, BOTTOM_BUTTON_START_Y, BOTTOM_BUTTON_END_X, BOTTOM_BUTTON_END_Y);
    }
  }
  if (reason & MSYS_CALLBACK_REASON_LOST_MOUSE) {
    btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    InvalidateRegion(BOTTOM_BUTTON_START_X, BOTTOM_BUTTON_START_Y, BOTTOM_BUTTON_END_X, BOTTOM_BUTTON_END_Y);
  }
  DisableAimButton();
}

function ResetAimButtons(Buttons: Pointer<UINT32>, uNumberOfButtons: UINT16): void {
  let cnt: UINT32;

  for (cnt = 0; cnt < uNumberOfButtons; cnt++) {
    ButtonList[Buttons[cnt]].value.uiFlags &= ~(BUTTON_CLICKED_ON);
  }
}

export function DisableAimButton(): void {
  let i: number = 0;

  for (i = 0; i < NUM_AIM_BOTTOMBUTTONS; i++) {
    if (gCurrentAimPage[i] == guiCurrentLaptopMode)
      ButtonList[guiBottomButtons[i]].value.uiFlags |= BUTTON_CLICKED_ON;
  }
}

function HandleAdAndWarningArea(fInit: boolean, fRedraw: boolean): void {
  /* static */ let ubPreviousAdvertisment: UINT8;

  if (fInit)
    gubCurrentAdvertisment = Enum62.AIM_AD_WARNING_BOX;
  else {
    if (ubPreviousAdvertisment == Enum62.AIM_AD_DONE) {
      gubCurrentAdvertisment = GetNextAimAd(gubCurrentAdvertisment);

      fInit = true;

      /*
                              UINT32	uiDay = GetWorldDay();
                              BOOLEAN	fSkip=FALSE;
                              gubCurrentAdvertisment++;

                              //if the add should be for Bobby rays
                              if( gubCurrentAdvertisment == AIM_AD_BOBBY_RAY_AD )
                              {
                                      //if the player has NOT ever been to drassen
                                      if( !LaptopSaveInfo.fBobbyRSiteCanBeAccessed )
                                      {
                                              //advance to the next add
                                              gubCurrentAdvertisment++;
                                      }
                                      else
                                      {
                                              fSkip = TRUE;
                                              fInit = TRUE;
                                      }
                              }
                              else
                                      fSkip = FALSE;


                              if( !fSkip )
                              {
                                      //if the current ad is not supposed to be available, loop back to the first ad
                                      switch( gubCurrentAdvertisment )
                                      {
                                              case AIM_AD_FUNERAL_ADS:
                                                      if( uiDay < AIM_AD_DAY_FUNERAL_AD_STARTS )
                                                              gubCurrentAdvertisment = AIM_AD_WARNING_BOX;
                                                      break;

                                              case AIM_AD_FLOWER_SHOP:
                                                      if( uiDay < AIM_AD_DAY_FLOWER_AD_STARTS )
                                                              gubCurrentAdvertisment = AIM_AD_WARNING_BOX;
                                                      break;

                                              case AIM_AD_INSURANCE_AD:
                                                      if( uiDay < AIM_AD_DAY_INSURANCE_AD_STARTS )
                                                              gubCurrentAdvertisment = AIM_AD_WARNING_BOX;
                                                      break;
                                      }
                                      fInit = TRUE;
                              }
      */
    }

    if (gubCurrentAdvertisment >= Enum62.AIM_AD_LAST_AD) {
      gubCurrentAdvertisment = Enum62.AIM_AD_WARNING_BOX;
    }
  }

  switch (gubCurrentAdvertisment) {
    case Enum62.AIM_AD_WARNING_BOX:
      MSYS_DisableRegion(gSelectedBannerRegion);
      ubPreviousAdvertisment = DrawWarningBox(fInit, fRedraw);
      break;

    case Enum62.AIM_AD_FLOWER_SHOP:
      ubPreviousAdvertisment = DisplayFlowerAd(fInit, fRedraw);
      break;

    case Enum62.AIM_AD_FOR_ADS:
      // disable the region because only certain banners will be 'clickable'
      MSYS_DisableRegion(gSelectedBannerRegion);
      ubPreviousAdvertisment = DisplayAd(fInit, fRedraw, AIM_AD_FOR_ADS_DELAY, AIM_AD_FOR_ADS__NUM_SUBIMAGES, guiAdForAdsImages);
      break;

    case Enum62.AIM_AD_INSURANCE_AD:
      MSYS_EnableRegion(gSelectedBannerRegion);
      ubPreviousAdvertisment = DisplayAd(fInit, fRedraw, AIM_AD_INSURANCE_AD_DELAY, AIM_AD_INSURANCE_AD__NUM_SUBIMAGES, guiInsuranceAdImages);
      break;

    case Enum62.AIM_AD_FUNERAL_ADS:
      MSYS_EnableRegion(gSelectedBannerRegion);
      ubPreviousAdvertisment = DisplayAd(fInit, fRedraw, AIM_AD_FUNERAL_AD_DELAY, AIM_AD_FUNERAL_AD__NUM_SUBIMAGES, guiFuneralAdImages);
      break;

    case Enum62.AIM_AD_BOBBY_RAY_AD:
      MSYS_EnableRegion(gSelectedBannerRegion);
      //			ubPreviousAdvertisment = DisplayAd( fInit, fRedraw, AIM_AD_BOBBYR_AD_DELAY, AIM_AD_BOBBYR_AD__NUM_SUBIMAGES, guiBobbyRAdImages );
      ubPreviousAdvertisment = DisplayBobbyRAd(fInit, fRedraw);
      break;
  }
}

function DisplayFlowerAd(fInit: boolean, fRedraw: boolean): boolean {
  /* static */ let uiLastTime: UINT32;
  /* static */ let ubSubImage: UINT8 = 0;
  /* static */ let ubCount: UINT8 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();

  if (fInit) {
    uiLastTime = 0;
    ubSubImage = 0;
    ubCount = 0;
    MSYS_EnableRegion(gSelectedBannerRegion);
  }

  if (((uiCurTime - uiLastTime) > AIM_FLOWER_AD_DELAY) || fRedraw) {
    let hAdHandle: HVOBJECT;

    if (ubSubImage == AIM_FLOWER_NUM_SUBIMAGES) {
      if (ubCount == 0 || fRedraw) {
        // Blit the blue sky frame with text on top
        GetVideoObject(addressof(hAdHandle), guiFlowerAdvertisement);
        BltVideoObject(FRAME_BUFFER, hAdHandle, 0, WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY, null);

        // redraw new mail warning, and create new mail button, if nessacary
        fReDrawNewMailFlag = true;

        // Display Aim Warning Text
        DisplayWrappedString(AIM_WARNING_TEXT_X, AIM_WARNING_TEXT_Y, AIM_WARNING_TEXT_WIDTH, 2, FONT14ARIAL(), FONT_GREEN, AimScreenText[Enum362.AIM_INFO_6], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

        // Display Aim Warning Text
        SetFontShadow(FONT_MCOLOR_WHITE);
        DisplayWrappedString(AIM_WARNING_TEXT_X, AIM_FLOWER_LINK_TEXT_Y, AIM_WARNING_TEXT_WIDTH, 2, FONT12ARIAL(), 2, AimScreenText[Enum362.AIM_INFO_7], FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);
        SetFontShadow(DEFAULT_SHADOW);

        InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);
      }

      uiLastTime = GetJA2Clock();

      ubCount++;
      if (ubCount > 40) {
        return Enum62.AIM_AD_DONE;
      } else
        return Enum62.AIM_AD_NOT_DONE;
    } else {
      GetVideoObject(addressof(hAdHandle), guiFlowerAdvertisement);
      BltVideoObject(FRAME_BUFFER, hAdHandle, ubSubImage, WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY, null);

      // redraw new mail warning, and create new mail button, if nessacary
      fReDrawNewMailFlag = true;

      ubSubImage++;
    }

    uiLastTime = GetJA2Clock();
    InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);
  }
  return Enum62.AIM_AD_NOT_DONE;
}

function DrawWarningBox(fInit: boolean, fRedraw: boolean): boolean {
  /* static */ let uiLastTime: UINT32;
  /* static */ let ubSubImage: UINT8 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();

  if (fInit || fRedraw) {
    let sText: string /* wchar_t[400] */;
    let uiStartLoc: UINT32 = 0;
    let usLocY: UINT16 = AIM_WARNING_TEXT_Y + (GetFontHeight(AIM_WARNING_FONT()) + 2) * 2;
    let hWarningHandle: HVOBJECT;

    // Warning
    GetVideoObject(addressof(hWarningHandle), guiWarning);
    BltVideoObject(FRAME_BUFFER, hWarningHandle, 0, WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY, null);

    uiStartLoc = AIM_HISTORY_LINE_SIZE * Enum63.AIM_WARNING_1;
    LoadEncryptedDataFromFile(AIMHISTORYFILE, sText, uiStartLoc, AIM_HISTORY_LINE_SIZE);

    // Display Aim Warning Text
    DisplayWrappedString(AIM_WARNING_TEXT_X, AIM_WARNING_TEXT_Y, AIM_WARNING_TEXT_WIDTH, 2, AIM_WARNING_FONT(), FONT_RED, sText, FONT_MCOLOR_BLACK, false, CENTER_JUSTIFIED);

    InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);

    // redraw new mail warning, and create new mail button, if nessacary
    fReDrawNewMailFlag = true;

    if (fInit)
      uiLastTime = uiCurTime;
  }

  if ((uiCurTime - uiLastTime) > AIM_WARNING_TIME)
    return Enum62.AIM_AD_DONE;
  else {
    return Enum62.AIM_AD_NOT_DONE;
  }
}

function SelectBannerRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gubCurrentAdvertisment == Enum62.AIM_AD_FLOWER_SHOP)
      GoToWebPage(Enum98.FLORIST_BOOKMARK);
    else if (gubCurrentAdvertisment == Enum62.AIM_AD_INSURANCE_AD)
      GoToWebPage(Enum98.INSURANCE_BOOKMARK);
    else if (gubCurrentAdvertisment == Enum62.AIM_AD_FUNERAL_ADS)
      GoToWebPage(Enum98.FUNERAL_BOOKMARK);
    else if (gubCurrentAdvertisment == Enum62.AIM_AD_BOBBY_RAY_AD)
      GoToWebPage(Enum98.BOBBYR_BOOKMARK);
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

function DisplayAd(fInit: boolean, fRedraw: boolean, usDelay: UINT16, usNumberOfSubImages: UINT16, uiAdImageIdentifier: UINT32): boolean {
  /* static */ let uiLastTime: UINT32;
  /* static */ let ubSubImage: UINT8 = 0;
  /* static */ let ubCount: UINT8 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();
  let ubRetVal: UINT8 = 0;

  if (fInit) {
    uiLastTime = 0;
    ubSubImage = 0;
    ubCount = 0;
  }

  if (((uiCurTime - uiLastTime) > usDelay) || fRedraw) {
    let hAdHandle: HVOBJECT;

    if (ubSubImage == 0) {
      if (ubCount == 0 || fRedraw) {
        // Blit the ad
        GetVideoObject(addressof(hAdHandle), uiAdImageIdentifier);
        BltVideoObject(FRAME_BUFFER, hAdHandle, 0, WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY, null);

        // redraw new mail warning, and create new mail button, if nessacary
        fReDrawNewMailFlag = true;

        InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);
      }

      uiLastTime = GetJA2Clock();

      // display first frame longer then rest
      ubCount++;
      if (ubCount > 12) {
        ubCount = 0;
        ubSubImage++;
      }

      ubRetVal = Enum62.AIM_AD_NOT_DONE;
    } else if (ubSubImage == usNumberOfSubImages - 1) {
      if (ubCount == 0 || fRedraw) {
        // Blit the ad
        GetVideoObject(addressof(hAdHandle), uiAdImageIdentifier);
        BltVideoObject(FRAME_BUFFER, hAdHandle, ubSubImage, WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY, null);

        // redraw new mail warning, and create new mail button, if nessacary
        fReDrawNewMailFlag = true;

        InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);
      }

      uiLastTime = GetJA2Clock();

      // display first frame longer then rest
      ubCount++;
      if (ubCount > 12) {
        ubRetVal = Enum62.AIM_AD_DONE;
      }
    } else {
      GetVideoObject(addressof(hAdHandle), uiAdImageIdentifier);
      BltVideoObject(FRAME_BUFFER, hAdHandle, ubSubImage, WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY, null);

      // redraw new mail warning, and create new mail button, if nessacary
      fReDrawNewMailFlag = true;

      ubSubImage++;
    }

    // if the add it to have text on it, then put the text on it.
    HandleTextOnAimAdd(ubSubImage);

    uiLastTime = GetJA2Clock();
    InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);
  }
  return ubRetVal;
}

function HandleTextOnAimAdd(ubCurSubImage: UINT8): void {
  switch (gubCurrentAdvertisment) {
    case Enum62.AIM_AD_WARNING_BOX:
      break;

    case Enum62.AIM_AD_FLOWER_SHOP:
      break;

    case Enum62.AIM_AD_FOR_ADS:
      break;

    case Enum62.AIM_AD_INSURANCE_AD:
      break;

    case Enum62.AIM_AD_FUNERAL_ADS:
      break;

    case Enum62.AIM_AD_BOBBY_RAY_AD:

      // if the subimage is the first couple
      if (ubCurSubImage <= AIM_AD_BOBBYR_AD_NUM_DUCK_SUBIMAGES) {
        // Display Aim Warning Text
        SetFontShadow(2);
        DisplayWrappedString(AIM_BOBBYR1_LINK_TEXT_X, AIM_BOBBYR1_LINK_TEXT_Y, AIM_WARNING_TEXT_WIDTH, 2, BOBBYR_UNDER_CONSTRUCTION_AD_FONT(), BOBBYR_UNDER_CONSTRUCTION_AD_COLOR, AimScreenText[Enum362.AIM_BOBBYR_ADD1], FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED | INVALIDATE_TEXT);
        SetFontShadow(DEFAULT_SHADOW);
      }

      else if (ubCurSubImage >= AIM_AD_BOBBYR_AD__NUM_SUBIMAGES - 5) {
        // Display Aim Warning Text
        SetFontShadow(2);
        DisplayWrappedString(AIM_BOBBYR2_LINK_TEXT_X, AIM_BOBBYR2_LINK_TEXT_Y, AIM_WARNING_TEXT_WIDTH, 2, BOBBYR_UNDER_CONSTRUCTION_AD_FONT(), BOBBYR_UNDER_CONSTRUCTION_AD_COLOR, AimScreenText[Enum362.AIM_BOBBYR_ADD2], FONT_MCOLOR_BLACK, false, LEFT_JUSTIFIED | INVALIDATE_TEXT);
        SetFontShadow(DEFAULT_SHADOW);
      }
      /*
                              else
                              {
                                      //Display Aim Warning Text
                                      SetFontShadow( 2 );
      //				DisplayWrappedString( AIM_BOBBYR3_LINK_TEXT_X, AIM_BOBBYR3_LINK_TEXT_Y, AIM_WARNING_TEXT_WIDTH, 2, BOBBYR_UNDER_CONSTRUCTION_AD_FONT, FONT_MCOLOR_WHITE, AimScreenText[AIM_BOBBYR_ADD3], FONT_MCOLOR_BLACK, FALSE, LEFT_JUSTIFIED | INVALIDATE_TEXT );
                                      SetFontShadow( DEFAULT_SHADOW );
                              }
      */
      break;
  }
}

function DisplayBobbyRAd(fInit: boolean, fRedraw: boolean): boolean {
  /* static */ let uiLastTime: UINT32;
  /* static */ let ubSubImage: UINT8 = 0;
  /* static */ let ubDuckCount: UINT8 = 0;
  /* static */ let ubCount: UINT8 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();
  let ubRetVal: UINT8 = 0;
  let usDelay: UINT16 = AIM_AD_BOBBYR_AD_DELAY;

  if (fInit) {
    ubDuckCount = 0;
    uiLastTime = 0;
    ubSubImage = 0;
    ubCount = 0;
  }

  if (((uiCurTime - uiLastTime) > usDelay) || fRedraw) {
    let hAdHandle: HVOBJECT;

    // Loop through the first 6 images twice, then start into the later ones
    GetVideoObject(addressof(hAdHandle), guiBobbyRAdImages);

    // if we are still looping through the first 6 animations
    if (ubDuckCount < 2) {
      BltVideoObject(FRAME_BUFFER, hAdHandle, ubSubImage, WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY, null);

      ubSubImage++;

      InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);

      // if we do the first set of images
      if (ubSubImage > AIM_AD_BOBBYR_AD_NUM_DUCK_SUBIMAGES) {
        ubDuckCount++;

        if (ubDuckCount < 2)
          ubSubImage = 0;
        else
          ubSubImage = AIM_AD_BOBBYR_AD_NUM_DUCK_SUBIMAGES + 1;
      }
      ubRetVal = Enum62.AIM_AD_NOT_DONE;
    }

    else {
      // Blit the ad
      BltVideoObject(FRAME_BUFFER, hAdHandle, ubSubImage, WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY, null);

      ubSubImage++;

      if (ubSubImage >= AIM_AD_BOBBYR_AD__NUM_SUBIMAGES - 1) {
        // display last frame longer then rest
        ubCount++;
        if (ubCount > 12) {
          ubRetVal = Enum62.AIM_AD_DONE;
        }

        ubSubImage = AIM_AD_BOBBYR_AD__NUM_SUBIMAGES - 1;
      }

      // redraw new mail warning, and create new mail button, if nessacary
      fReDrawNewMailFlag = true;

      InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);
    }

    // if the add it to have text on it, then put the text on it.
    HandleTextOnAimAdd(ubSubImage);

    uiLastTime = GetJA2Clock();
    InvalidateRegion(AIM_AD_TOP_LEFT_X, AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X, AIM_AD_BOTTOM_RIGHT_Y);
  }

  /*

                  if( ubDuckImage < AIM_AD_BOBBYR_AD_NUM_DUCK_SUBIMAGES )
                  {
                          ubDuckImage++;
                  }

                  GetVideoObject(&hAdHandle, guiBobbyRAdImages);

                  if( ubDuckImage < AIM_AD_BOBBYR_AD_NUM_DUCK_SUBIMAGES * 2 )
                  {
                          if( ubDuckImage >= AIM_AD_BOBBYR_AD_NUM_DUCK_SUBIMAGES )
                                  BltVideoObject(FRAME_BUFFER, hAdHandle, (UINT16)(ubDuckImage-AIM_AD_BOBBYR_AD_NUM_DUCK_SUBIMAGES), WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY,NULL);
                          else
                                  BltVideoObject(FRAME_BUFFER, hAdHandle, ubDuckImage,WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY,NULL);

                          ubDuckImage++;
                  }
                  else
                          ubSubImage = 5;


                  if( ubSubImage == 5 )
                  {
                          if(ubCount == 0 || fRedraw)
                          {
                                  //Blit the ad
                                  BltVideoObject(FRAME_BUFFER, hAdHandle, ubSubImage,WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY,NULL);

                                  // redraw new mail warning, and create new mail button, if nessacary
                                  fReDrawNewMailFlag = TRUE;

                                  InvalidateRegion(AIM_AD_TOP_LEFT_X,AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X	,AIM_AD_BOTTOM_RIGHT_Y);
                          }

                          uiLastTime = GetJA2Clock();


                          ubRetVal = AIM_AD_NOT_DONE;

                  }
                  else if( ubSubImage == AIM_AD_BOBBYR_AD__NUM_SUBIMAGES-1 )
                  {
                          if(ubCount == 0 || fRedraw)
                          {
                                  //Blit the ad
                                  GetVideoObject(&hAdHandle, guiBobbyRAdImages);
                                  BltVideoObject(FRAME_BUFFER, hAdHandle, ubSubImage,WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY,NULL);

                                  // redraw new mail warning, and create new mail button, if nessacary
                                  fReDrawNewMailFlag = TRUE;

                                  InvalidateRegion(AIM_AD_TOP_LEFT_X,AIM_AD_TOP_LEFT_Y, AIM_AD_BOTTOM_RIGHT_X	,AIM_AD_BOTTOM_RIGHT_Y);
                          }

                          uiLastTime = GetJA2Clock();

                          //display last frame longer then rest
                          ubCount++;
                          if( ubCount > 12 )
                          {
                                  ubRetVal = AIM_AD_DONE;
                          }
                  }
                  else
                  {
                          GetVideoObject(&hAdHandle, guiBobbyRAdImages);
                          BltVideoObject(FRAME_BUFFER, hAdHandle, ubSubImage,WARNING_X, WARNING_Y, VO_BLT_SRCTRANSPARENCY,NULL);

                          // redraw new mail warning, and create new mail button, if nessacary
                          fReDrawNewMailFlag = TRUE;

                          ubSubImage++;
                  }
  */

  return ubRetVal;
}

function GetNextAimAd(ubCurrentAd: UINT8): UINT8 {
  let ubNextAd: UINT8;
  let uiDay: UINT32 = GetWorldDay();
  let fSkip: boolean = false;

  if (ubCurrentAd == Enum62.AIM_AD_WARNING_BOX) {
    if (uiDay < AIM_AD_BOBBYR_AD_STARTS) {
      // if the player has NOT ever been to drassen
      if (!LaptopSaveInfo.fBobbyRSiteCanBeAccessed) {
        ubNextAd = Enum62.AIM_AD_FOR_ADS;
      } else {
        ubNextAd = Enum62.AIM_AD_BOBBY_RAY_AD;
      }
    }

    else if (uiDay < AIM_AD_DAY_FUNERAL_AD_STARTS)
      ubNextAd = Enum62.AIM_AD_FUNERAL_ADS;

    else if (uiDay < AIM_AD_DAY_FLOWER_AD_STARTS)
      ubNextAd = Enum62.AIM_AD_FLOWER_SHOP;

    else // if( uiDay < AIM_AD_DAY_INSURANCE_AD_STARTS )
      ubNextAd = Enum62.AIM_AD_INSURANCE_AD;
  } else {
    ubNextAd = Enum62.AIM_AD_WARNING_BOX;
  }

  return ubNextAd;
}

}
