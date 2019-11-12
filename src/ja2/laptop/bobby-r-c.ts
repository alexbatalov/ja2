namespace ja2 {

const BOBBIES_SIGN_FONT = () => FONT14ARIAL();
const BOBBIES_SIGN_COLOR = 2;
const BOBBIES_SIGN_BACKCOLOR = FONT_MCOLOR_BLACK;
const BOBBIES_SIGN_BACKGROUNDCOLOR = 78; // NO_SHADOW

const BOBBIES_NUMBER_SIGNS = 5;

const BOBBIES_SENTENCE_FONT = () => FONT12ARIAL();
const BOBBIES_SENTENCE_COLOR = FONT_MCOLOR_WHITE;
const BOBBIES_SENTENCE_BACKGROUNDCOLOR = 2; // NO_SHADOW//226

const BOBBY_WOOD_BACKGROUND_X = LAPTOP_SCREEN_UL_X;
const BOBBY_WOOD_BACKGROUND_Y = LAPTOP_SCREEN_WEB_UL_Y;
const BOBBY_WOOD_BACKGROUND_WIDTH = 125;
const BOBBY_WOOD_BACKGROUND_HEIGHT = 100;

const BOBBY_RAYS_NAME_X = LAPTOP_SCREEN_UL_X + 77;
const BOBBY_RAYS_NAME_Y = LAPTOP_SCREEN_WEB_UL_Y + 0;
const BOBBY_RAYS_NAME_WIDTH = 344;
const BOBBY_RAYS_NAME_HEIGHT = 66;

const BOBBYS_PLAQUES_X = LAPTOP_SCREEN_UL_X + 39;
const BOBBYS_PLAQUES_Y = LAPTOP_SCREEN_WEB_UL_Y + 174;
const BOBBYS_PLAQUES_WIDTH = 414;
const BOBBYS_PLAQUES_HEIGHT = 190;

const BOBBIES_TOPHINGE_X = LAPTOP_SCREEN_UL_X;
const BOBBIES_TOPHINGE_Y = LAPTOP_SCREEN_WEB_UL_Y + 42;

const BOBBIES_BOTTOMHINGE_X = LAPTOP_SCREEN_UL_X;
const BOBBIES_BOTTOMHINGE_Y = LAPTOP_SCREEN_WEB_UL_Y + 338;

const BOBBIES_STORE_PLAQUE_X = LAPTOP_SCREEN_UL_X + 148;
const BOBBIES_STORE_PLAQUE_Y = LAPTOP_SCREEN_WEB_UL_Y + 66;
const BOBBIES_STORE_PLAQUE_HEIGHT = 93;

const BOBBIES_HANDLE_X = LAPTOP_SCREEN_UL_X + 457;
const BOBBIES_HANDLE_Y = LAPTOP_SCREEN_WEB_UL_Y + 147;

const BOBBIES_FIRST_SENTENCE_X = LAPTOP_SCREEN_UL_X;
const BOBBIES_FIRST_SENTENCE_Y = BOBBIES_STORE_PLAQUE_Y + BOBBIES_STORE_PLAQUE_HEIGHT - 3;
const BOBBIES_FIRST_SENTENCE_WIDTH = 500;

const BOBBIES_2ND_SENTENCE_X = LAPTOP_SCREEN_UL_X;
const BOBBIES_2ND_SENTENCE_Y = BOBBIES_FIRST_SENTENCE_Y + 13;
const BOBBIES_2ND_SENTENCE_WIDTH = 500;

const BOBBIES_CENTER_SIGN_OFFSET_Y = 23;

const BOBBIES_USED_SIGN_X = BOBBYS_PLAQUES_X + 93;
const BOBBIES_USED_SIGN_Y = BOBBYS_PLAQUES_Y + 32;
const BOBBIES_USED_SIGN_WIDTH = 92;
const BOBBIES_USED_SIGN_HEIGHT = 50;
const BOBBIES_USED_SIGN_TEXT_OFFSET = BOBBIES_USED_SIGN_Y + 10;

const BOBBIES_MISC_SIGN_X = BOBBYS_PLAQUES_X + 238;
const BOBBIES_MISC_SIGN_Y = BOBBYS_PLAQUES_Y + 27;
const BOBBIES_MISC_SIGN_WIDTH = 103;
const BOBBIES_MISC_SIGN_HEIGHT = 57;
const BOBBIES_MISC_SIGN_TEXT_OFFSET = BOBBIES_MISC_SIGN_Y + BOBBIES_CENTER_SIGN_OFFSET_Y;

const BOBBIES_GUNS_SIGN_X = BOBBYS_PLAQUES_X + 3;
const BOBBIES_GUNS_SIGN_Y = BOBBYS_PLAQUES_Y + 102;
const BOBBIES_GUNS_SIGN_WIDTH = 116;
const BOBBIES_GUNS_SIGN_HEIGHT = 75;
const BOBBIES_GUNS_SIGN_TEXT_OFFSET = BOBBIES_GUNS_SIGN_Y + BOBBIES_CENTER_SIGN_OFFSET_Y;

const BOBBIES_AMMO_SIGN_X = BOBBYS_PLAQUES_X + 150;
const BOBBIES_AMMO_SIGN_Y = BOBBYS_PLAQUES_Y + 105;
const BOBBIES_AMMO_SIGN_WIDTH = 112;
const BOBBIES_AMMO_SIGN_HEIGHT = 71;
const BOBBIES_AMMO_SIGN_TEXT_OFFSET = BOBBIES_AMMO_SIGN_Y + BOBBIES_CENTER_SIGN_OFFSET_Y;

const BOBBIES_ARMOUR_SIGN_X = BOBBYS_PLAQUES_X + 290;
const BOBBIES_ARMOUR_SIGN_Y = BOBBYS_PLAQUES_Y + 108;
const BOBBIES_ARMOUR_SIGN_WIDTH = 114;
const BOBBIES_ARMOUR_SIGN_HEIGHT = 70;
const BOBBIES_ARMOUR_SIGN_TEXT_OFFSET = BOBBIES_ARMOUR_SIGN_Y + BOBBIES_CENTER_SIGN_OFFSET_Y;

const BOBBIES_3RD_SENTENCE_X = LAPTOP_SCREEN_UL_X;
const BOBBIES_3RD_SENTENCE_Y = BOBBIES_BOTTOMHINGE_Y + 40;
const BOBBIES_3RD_SENTENCE_WIDTH = 500;

const BOBBY_R_NEW_PURCHASE_ARRIVAL_TIME = (1 * 60 * 24); // minutes in 1 day

const BOBBY_R_USED_PURCHASE_OFFSET = 1000;

const BOBBYR_UNDERCONSTRUCTION_ANI_DELAY = 150;
const BOBBYR_UNDERCONSTRUCTION_NUM_FRAMES = 5;

const BOBBYR_UNDERCONSTRUCTION_X = LAPTOP_SCREEN_UL_X + (LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X - BOBBYR_UNDERCONSTRUCTION_WIDTH) / 2;
const BOBBYR_UNDERCONSTRUCTION_Y = 175;
const BOBBYR_UNDERCONSTRUCTION1_Y = 378;

const BOBBYR_UNDERCONSTRUCTION_WIDTH = 414;
const BOBBYR_UNDERCONSTRUCTION_HEIGHT = 64;

const BOBBYR_UNDER_CONSTRUCTION_TEXT_X = LAPTOP_SCREEN_UL_X;
const BOBBYR_UNDER_CONSTRUCTION_TEXT_Y = BOBBYR_UNDERCONSTRUCTION_Y + 62 + 60;
const BOBBYR_UNDER_CONSTRUCTION_TEXT_WIDTH = LAPTOP_SCREEN_LR_X - LAPTOP_SCREEN_UL_X;

let guiBobbyName: UINT32;
let guiPlaque: UINT32;
let guiTopHinge: UINT32;
let guiBottomHinge: UINT32;
let guiStorePlaque: UINT32;
let guiHandle: UINT32;
let guiWoodBackground: UINT32;
let guiUnderConstructionImage: UINT32;

/*
UINT16	gusFirstGunIndex;
UINT16	gusLastGunIndex;
UINT8		gubNumGunPages;

UINT16	gusFirstAmmoIndex;
UINT16	gusLastAmmoIndex;
UINT8		gubNumAmmoPages;

UINT16	gusFirstMiscIndex;
UINT16	gusLastMiscIndex;
UINT8		gubNumMiscPages;

UINT16  gusFirstArmourIndex;
UINT16  gusLastArmourIndex;
UINT8		gubNumArmourPages;

UINT16  gusFirstUsedIndex;
UINT16  gusLastUsedIndex;
UINT8		gubNumUsedPages;
*/

export let guiLastBobbyRayPage: UINT32;

let gubBobbyRPages: UINT8[] /* [] */ = [
  Enum95.LAPTOP_MODE_BOBBY_R_USED,
  Enum95.LAPTOP_MODE_BOBBY_R_MISC,
  Enum95.LAPTOP_MODE_BOBBY_R_GUNS,
  Enum95.LAPTOP_MODE_BOBBY_R_AMMO,
  Enum95.LAPTOP_MODE_BOBBY_R_ARMOR,
];

// Bobby's Sign menu mouse regions
let gSelectedBobbiesSignMenuRegion: MOUSE_REGION[] /* [BOBBIES_NUMBER_SIGNS] */ = createArrayFrom(BOBBIES_NUMBER_SIGNS, createMouseRegion);

export function GameInitBobbyR(): void {
}

export function EnterBobbyR(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let i: UINT8;

  // an array of mouse regions for the bobbies signs.  Top Left corner, bottom right corner
  let usMouseRegionPosArray: UINT16[] /* [] */ = [
    BOBBIES_USED_SIGN_X, BOBBIES_USED_SIGN_Y,
    BOBBIES_USED_SIGN_X + BOBBIES_USED_SIGN_WIDTH, BOBBIES_USED_SIGN_Y + BOBBIES_USED_SIGN_HEIGHT,
    BOBBIES_MISC_SIGN_X, BOBBIES_MISC_SIGN_Y,
    BOBBIES_MISC_SIGN_X + BOBBIES_MISC_SIGN_WIDTH, BOBBIES_MISC_SIGN_Y + BOBBIES_MISC_SIGN_HEIGHT,
    BOBBIES_GUNS_SIGN_X, BOBBIES_GUNS_SIGN_Y,
    BOBBIES_GUNS_SIGN_X + BOBBIES_GUNS_SIGN_WIDTH, BOBBIES_GUNS_SIGN_Y + BOBBIES_GUNS_SIGN_HEIGHT,
    BOBBIES_AMMO_SIGN_X, BOBBIES_AMMO_SIGN_Y,
    BOBBIES_AMMO_SIGN_X + BOBBIES_AMMO_SIGN_WIDTH, BOBBIES_AMMO_SIGN_Y + BOBBIES_AMMO_SIGN_HEIGHT,
    BOBBIES_ARMOUR_SIGN_X, BOBBIES_ARMOUR_SIGN_Y,
    BOBBIES_ARMOUR_SIGN_X + BOBBIES_ARMOUR_SIGN_WIDTH, BOBBIES_ARMOUR_SIGN_Y + BOBBIES_ARMOUR_SIGN_HEIGHT,
  ];

  InitBobbyRWoodBackground();

  // load the Bobbyname graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_BOBBYNAME);
  if (!(guiBobbyName = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the plaque graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\BobbyPlaques.sti");
  if (!(guiPlaque = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the TopHinge graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\BobbyTopHinge.sti");
  if (!(guiTopHinge = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the BottomHinge graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\BobbyBottomHinge.sti");
  if (!(guiBottomHinge = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the Store Plaque graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = GetMLGFilename(Enum326.MLG_STOREPLAQUE);
  if (!(guiStorePlaque = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the Handle graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\BobbyHandle.sti");
  if (!(guiHandle = AddVideoObject(VObjectDesc))) {
    return false;
  }

  InitBobbiesMouseRegion(BOBBIES_NUMBER_SIGNS, usMouseRegionPosArray, gSelectedBobbiesSignMenuRegion);

  if (!LaptopSaveInfo.fBobbyRSiteCanBeAccessed) {
    // load the Handle graphic and add it
    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\UnderConstruction.sti");
    if (!(guiUnderConstructionImage = AddVideoObject(VObjectDesc))) {
      return false;
    }

    for (i = 0; i < BOBBIES_NUMBER_SIGNS; i++) {
      MSYS_DisableRegion(gSelectedBobbiesSignMenuRegion[i]);
    }

    LaptopSaveInfo.ubHaveBeenToBobbyRaysAtLeastOnceWhileUnderConstruction = Enum99.BOBBYR_BEEN_TO_SITE_ONCE;
  }

  SetBookMark(Enum98.BOBBYR_BOOKMARK);
  HandleBobbyRUnderConstructionAni(true);

  RenderBobbyR();

  return true;
}

export function ExitBobbyR(): void {
  DeleteVideoObjectFromIndex(guiBobbyName);
  DeleteVideoObjectFromIndex(guiPlaque);
  DeleteVideoObjectFromIndex(guiTopHinge);
  DeleteVideoObjectFromIndex(guiBottomHinge);
  DeleteVideoObjectFromIndex(guiStorePlaque);
  DeleteVideoObjectFromIndex(guiHandle);

  if (!LaptopSaveInfo.fBobbyRSiteCanBeAccessed) {
    DeleteVideoObjectFromIndex(guiUnderConstructionImage);
  }

  DeleteBobbyRWoodBackground();

  RemoveBobbiesMouseRegion(BOBBIES_NUMBER_SIGNS, gSelectedBobbiesSignMenuRegion);

  guiLastBobbyRayPage = Enum95.LAPTOP_MODE_BOBBY_R;
}

export function HandleBobbyR(): void {
  HandleBobbyRUnderConstructionAni(false);
}

export function RenderBobbyR(): void {
  let hPixHandle: HVOBJECT;
  let hStorePlaqueHandle: HVOBJECT;

  DrawBobbyRWoodBackground();

  // Bobby's Name
  hPixHandle = GetVideoObject(guiBobbyName);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBY_RAYS_NAME_X, BOBBY_RAYS_NAME_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Plaque
  hPixHandle = GetVideoObject(guiPlaque);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYS_PLAQUES_X, BOBBYS_PLAQUES_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Top Hinge
  hPixHandle = GetVideoObject(guiTopHinge);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBIES_TOPHINGE_X, BOBBIES_TOPHINGE_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Bottom Hinge
  hPixHandle = GetVideoObject(guiBottomHinge);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBIES_BOTTOMHINGE_X, BOBBIES_BOTTOMHINGE_Y, VO_BLT_SRCTRANSPARENCY, null);

  // StorePlaque
  hStorePlaqueHandle = GetVideoObject(guiStorePlaque);
  BltVideoObject(FRAME_BUFFER, hStorePlaqueHandle, 0, BOBBIES_STORE_PLAQUE_X, BOBBIES_STORE_PLAQUE_Y, VO_BLT_SRCTRANSPARENCY, null);

  // Handle
  hPixHandle = GetVideoObject(guiHandle);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBIES_HANDLE_X, BOBBIES_HANDLE_Y, VO_BLT_SRCTRANSPARENCY, null);

  /*
          if( !LaptopSaveInfo.fBobbyRSiteCanBeAccessed )
          {
                  // The undercontsruction graphic
                  GetVideoObject(&hPixHandle, guiUnderConstructionImage );
                  BltVideoObject(FRAME_BUFFER, hPixHandle, 0,BOBBIES_FIRST_SENTENCE_X, BOBBIES_FIRST_SENTENCE_Y, VO_BLT_SRCTRANSPARENCY,NULL);
                  BltVideoObject(FRAME_BUFFER, hPixHandle, 0,BOBBIES_3RD_SENTENCE_X, BOBBIES_3RD_SENTENCE_Y, VO_BLT_SRCTRANSPARENCY,NULL);
          }
  */

  SetFontShadow(BOBBIES_SENTENCE_BACKGROUNDCOLOR);

  if (LaptopSaveInfo.fBobbyRSiteCanBeAccessed) {
    // Bobbys first sentence
    //	ShadowText( FRAME_BUFFER, BobbyRaysFrontText[BOBBYR_ADVERTISMENT_1], BOBBIES_SENTENCE_FONT, BOBBIES_FIRST_SENTENCE_X, BOBBIES_FIRST_SENTENCE_Y );
    DrawTextToScreen(BobbyRaysFrontText[Enum351.BOBBYR_ADVERTISMENT_1], BOBBIES_FIRST_SENTENCE_X, BOBBIES_FIRST_SENTENCE_Y, BOBBIES_FIRST_SENTENCE_WIDTH, BOBBIES_SENTENCE_FONT(), BOBBIES_SENTENCE_COLOR, BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED | TEXT_SHADOWED);

    // Bobbys second sentence
    DrawTextToScreen(BobbyRaysFrontText[Enum351.BOBBYR_ADVERTISMENT_2], BOBBIES_2ND_SENTENCE_X, BOBBIES_2ND_SENTENCE_Y, BOBBIES_2ND_SENTENCE_WIDTH, BOBBIES_SENTENCE_FONT(), BOBBIES_SENTENCE_COLOR, BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED | TEXT_SHADOWED);
    SetFontShadow(DEFAULT_SHADOW);
  }

  SetFontShadow(BOBBIES_SIGN_BACKGROUNDCOLOR);
  // Text on the Used Sign
  DisplayWrappedString(BOBBIES_USED_SIGN_X, BOBBIES_USED_SIGN_TEXT_OFFSET, BOBBIES_USED_SIGN_WIDTH - 5, 2, BOBBIES_SIGN_FONT(), BOBBIES_SIGN_COLOR, BobbyRaysFrontText[Enum351.BOBBYR_USED], BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED);
  // Text on the Misc Sign
  DisplayWrappedString(BOBBIES_MISC_SIGN_X, BOBBIES_MISC_SIGN_TEXT_OFFSET, BOBBIES_MISC_SIGN_WIDTH, 2, BOBBIES_SIGN_FONT(), BOBBIES_SIGN_COLOR, BobbyRaysFrontText[Enum351.BOBBYR_MISC], BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED);
  // Text on the Guns Sign
  DisplayWrappedString(BOBBIES_GUNS_SIGN_X, BOBBIES_GUNS_SIGN_TEXT_OFFSET, BOBBIES_GUNS_SIGN_WIDTH, 2, BOBBIES_SIGN_FONT(), BOBBIES_SIGN_COLOR, BobbyRaysFrontText[Enum351.BOBBYR_GUNS], BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED);
  // Text on the Ammo Sign
  DisplayWrappedString(BOBBIES_AMMO_SIGN_X, BOBBIES_AMMO_SIGN_TEXT_OFFSET, BOBBIES_AMMO_SIGN_WIDTH, 2, BOBBIES_SIGN_FONT(), BOBBIES_SIGN_COLOR, BobbyRaysFrontText[Enum351.BOBBYR_AMMO], BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED);
  // Text on the Armour Sign
  DisplayWrappedString(BOBBIES_ARMOUR_SIGN_X, BOBBIES_ARMOUR_SIGN_TEXT_OFFSET, BOBBIES_ARMOUR_SIGN_WIDTH, 2, BOBBIES_SIGN_FONT(), BOBBIES_SIGN_COLOR, BobbyRaysFrontText[Enum351.BOBBYR_ARMOR], BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED);
  SetFontShadow(DEFAULT_SHADOW);

  if (LaptopSaveInfo.fBobbyRSiteCanBeAccessed) {
    // Bobbys Third sentence
    SetFontShadow(BOBBIES_SENTENCE_BACKGROUNDCOLOR);
    DrawTextToScreen(BobbyRaysFrontText[Enum351.BOBBYR_ADVERTISMENT_3], BOBBIES_3RD_SENTENCE_X, BOBBIES_3RD_SENTENCE_Y, BOBBIES_3RD_SENTENCE_WIDTH, BOBBIES_SENTENCE_FONT(), BOBBIES_SENTENCE_COLOR, BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED | TEXT_SHADOWED);
    SetFontShadow(DEFAULT_SHADOW);
  }

  // if we cant go to any sub pages, darken the page out
  if (!LaptopSaveInfo.fBobbyRSiteCanBeAccessed) {
    ShadowVideoSurfaceRect(FRAME_BUFFER, LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
  }

  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

export function InitBobbyRWoodBackground(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load the Wood bacground graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\BobbyWood.sti");
  if (!(guiWoodBackground = AddVideoObject(VObjectDesc))) {
    return false;
  }

  return true;
}

export function DeleteBobbyRWoodBackground(): boolean {
  DeleteVideoObjectFromIndex(guiWoodBackground);
  return true;
}

export function DrawBobbyRWoodBackground(): boolean {
  let hWoodBackGroundHandle: HVOBJECT;
  let x: UINT16;
  let y: UINT16;
  let uiPosX: UINT16;
  let uiPosY: UINT16;

  // Blt the Wood background
  hWoodBackGroundHandle = GetVideoObject(guiWoodBackground);

  uiPosY = BOBBY_WOOD_BACKGROUND_Y;
  for (y = 0; y < 4; y++) {
    uiPosX = BOBBY_WOOD_BACKGROUND_X;
    for (x = 0; x < 4; x++) {
      BltVideoObject(FRAME_BUFFER, hWoodBackGroundHandle, 0, uiPosX, uiPosY, VO_BLT_SRCTRANSPARENCY, null);
      uiPosX += BOBBY_WOOD_BACKGROUND_WIDTH;
    }
    uiPosY += BOBBY_WOOD_BACKGROUND_HEIGHT;
  }

  return true;
}

function InitBobbiesMouseRegion(ubNumerRegions: UINT8, usMouseRegionPosArray: UINT16[], MouseRegion: MOUSE_REGION[]): boolean {
  let i: UINT8;
  let ubCount: UINT8 = 0;

  for (i = 0; i < ubNumerRegions; i++) {
    // Mouse region for the toc buttons
    MSYS_DefineRegion(MouseRegion[i], usMouseRegionPosArray[ubCount], usMouseRegionPosArray[ubCount + 1], usMouseRegionPosArray[ubCount + 2], usMouseRegionPosArray[ubCount + 3], MSYS_PRIORITY_HIGH, Enum317.CURSOR_WWW, MSYS_NO_CALLBACK, SelectBobbiesSignMenuRegionCallBack);
    MSYS_AddRegion(MouseRegion[i]);
    MSYS_SetRegionUserData(MouseRegion[i], 0, gubBobbyRPages[i]);

    ubCount += 4;
  }

  return true;
}

function RemoveBobbiesMouseRegion(ubNumberRegions: UINT8, Mouse_Region: MOUSE_REGION[]): boolean {
  let i: UINT8;

  for (i = 0; i < ubNumberRegions; i++)
    MSYS_RemoveRegion(Mouse_Region[i]);

  return true;
}

function SelectBobbiesSignMenuRegionCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_INIT) {
  } else if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubNewPage: UINT8 = MSYS_GetRegionUserData(pRegion, 0);
    guiCurrentLaptopMode = ubNewPage;
    //		FindLastItemIndex(ubNewPage);
  } else if (iReason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
  }
}

/*
BOOLEAN WebPageTileBackground(UINT8 ubNumX, UINT8 ubNumY, UINT16 usWidth, UINT16 usHeight, UINT32 uiBackground)
{
  HVOBJECT hBackGroundHandle;
        UINT16	x,y, uiPosX, uiPosY;

        // Blt the Wood background
        GetVideoObject(&hBackGroundHandle, uiBackground);

        uiPosY = LAPTOP_SCREEN_WEB_UL_Y;
        for(y=0; y<ubNumY; y++)
        {
                uiPosX = LAPTOP_SCREEN_UL_X;
                for(x=0; x<ubNumX; x++)
                {
                  BltVideoObject(FRAME_BUFFER, hBackGroundHandle, 0,uiPosX, uiPosY, VO_BLT_SRCTRANSPARENCY,NULL);
                        uiPosX += usWidth;
                }
                uiPosY += usHeight;
        }
        return(TRUE);
}
*/

function HandleBobbyRUnderConstructionAni(fReset: boolean): void {
  let hPixHandle: HVOBJECT;
  /* static */ let uiLastTime: UINT32 = 1;
  /* static */ let usCount: UINT16 = 0;
  let uiCurTime: UINT32 = GetJA2Clock();

  if (LaptopSaveInfo.fBobbyRSiteCanBeAccessed)
    return;

  if (fReset)
    usCount = 1;

  if (fShowBookmarkInfo) {
    fReDrawBookMarkInfo = true;
  }

  if (((uiCurTime - uiLastTime) > BOBBYR_UNDERCONSTRUCTION_ANI_DELAY) || (fReDrawScreenFlag)) {
    // The undercontsruction graphic
    hPixHandle = GetVideoObject(guiUnderConstructionImage);
    BltVideoObject(FRAME_BUFFER, hPixHandle, usCount, BOBBYR_UNDERCONSTRUCTION_X, BOBBYR_UNDERCONSTRUCTION_Y, VO_BLT_SRCTRANSPARENCY, null);

    BltVideoObject(FRAME_BUFFER, hPixHandle, usCount, BOBBYR_UNDERCONSTRUCTION_X, BOBBYR_UNDERCONSTRUCTION1_Y, VO_BLT_SRCTRANSPARENCY, null);

    DrawTextToScreen(BobbyRaysFrontText[Enum351.BOBBYR_UNDER_CONSTRUCTION], BOBBYR_UNDER_CONSTRUCTION_TEXT_X, BOBBYR_UNDER_CONSTRUCTION_TEXT_Y, BOBBYR_UNDER_CONSTRUCTION_TEXT_WIDTH, FONT16ARIAL(), BOBBIES_SENTENCE_COLOR, BOBBIES_SIGN_BACKCOLOR, false, CENTER_JUSTIFIED | INVALIDATE_TEXT);

    InvalidateRegion(BOBBYR_UNDERCONSTRUCTION_X, BOBBYR_UNDERCONSTRUCTION_Y, BOBBYR_UNDERCONSTRUCTION_X + BOBBYR_UNDERCONSTRUCTION_WIDTH, BOBBYR_UNDERCONSTRUCTION_Y + BOBBYR_UNDERCONSTRUCTION_HEIGHT);
    InvalidateRegion(BOBBYR_UNDERCONSTRUCTION_X, BOBBYR_UNDERCONSTRUCTION1_Y, BOBBYR_UNDERCONSTRUCTION_X + BOBBYR_UNDERCONSTRUCTION_WIDTH, BOBBYR_UNDERCONSTRUCTION1_Y + BOBBYR_UNDERCONSTRUCTION_HEIGHT);

    uiLastTime = GetJA2Clock();

    usCount++;

    if (usCount >= BOBBYR_UNDERCONSTRUCTION_NUM_FRAMES)
      usCount = 0;
  }
}

export function InitBobbyRayInventory(): void {
  // Initializes which NEW items can be bought at Bobby Rays
  InitBobbyRayNewInventory();

  // Initializes the starting values for Bobby Rays NEW Inventory
  SetupStoreInventory(LaptopSaveInfo.BobbyRayInventory, false);

  // Initializes which USED items can be bought at Bobby Rays
  InitBobbyRayUsedInventory();

  // Initializes the starting values for Bobby Rays USED Inventory
  SetupStoreInventory(LaptopSaveInfo.BobbyRayUsedInventory, true);
}

function InitBobbyRayNewInventory(): boolean {
  let i: UINT16;
  let usBobbyrIndex: UINT16 = 0;

  memset(LaptopSaveInfo.BobbyRayInventory, 0, sizeof(STORE_INVENTORY) * Enum225.MAXITEMS);

  // add all the NEW items he can ever sell into his possible inventory list, for now in order by item #
  for (i = 0; i < Enum225.MAXITEMS; i++) {
    // if Bobby Ray sells this, it can be sold, and it's allowed into this game (some depend on e.g. gun-nut option)
    if ((StoreInventory[i][Enum112.BOBBY_RAY_NEW] != 0) && !(Item[i].fFlags & ITEM_NOT_BUYABLE) && ItemIsLegal(i)) {
      LaptopSaveInfo.BobbyRayInventory[usBobbyrIndex].usItemIndex = i;
      usBobbyrIndex++;
    }
  }

  if (usBobbyrIndex > 1) {
    // sort this list by object category, and by ascending price within each category
    qsort(LaptopSaveInfo.BobbyRayInventory, usBobbyrIndex, sizeof(STORE_INVENTORY), BobbyRayItemQsortCompare);
  }

  // remember how many entries in the list are valid
  LaptopSaveInfo.usInventoryListLength[Enum112.BOBBY_RAY_NEW] = usBobbyrIndex;
  // also mark the end of the list of valid item entries
  LaptopSaveInfo.BobbyRayInventory[usBobbyrIndex].usItemIndex = BOBBYR_NO_ITEMS;

  return true;
}

function InitBobbyRayUsedInventory(): boolean {
  let i: UINT16;
  let usBobbyrIndex: UINT16 = 0;

  memset(LaptopSaveInfo.BobbyRayUsedInventory, 0, sizeof(STORE_INVENTORY) * Enum225.MAXITEMS);

  // add all the NEW items he can ever sell into his possible inventory list, for now in order by item #
  for (i = 0; i < Enum225.MAXITEMS; i++) {
    // if Bobby Ray sells this, it can be sold, and it's allowed into this game (some depend on e.g. gun-nut option)
    if ((StoreInventory[i][Enum112.BOBBY_RAY_USED] != 0) && !(Item[i].fFlags & ITEM_NOT_BUYABLE) && ItemIsLegal(i)) {
      if ((StoreInventory[i][Enum112.BOBBY_RAY_USED] != 0) && !(Item[i].fFlags & ITEM_NOT_BUYABLE) && ItemIsLegal(i))
        // in case his store inventory list is wrong, make sure this category of item can be sold used
        if (CanDealerItemBeSoldUsed(i)) {
          LaptopSaveInfo.BobbyRayUsedInventory[usBobbyrIndex].usItemIndex = i;
          usBobbyrIndex++;
        }
    }
  }

  if (usBobbyrIndex > 1) {
    // sort this list by object category, and by ascending price within each category
    qsort(LaptopSaveInfo.BobbyRayUsedInventory, usBobbyrIndex, sizeof(STORE_INVENTORY), BobbyRayItemQsortCompare);
  }

  // remember how many entries in the list are valid
  LaptopSaveInfo.usInventoryListLength[Enum112.BOBBY_RAY_USED] = usBobbyrIndex;
  // also mark the end of the list of valid item entries
  LaptopSaveInfo.BobbyRayUsedInventory[usBobbyrIndex].usItemIndex = BOBBYR_NO_ITEMS;

  return true;
}

export function DailyUpdateOfBobbyRaysNewInventory(): void {
  let i: INT16;
  let usItemIndex: UINT16;
  let fPrevElig: boolean;

  // simulate other buyers by reducing the current quantity on hand
  SimulateBobbyRayCustomer(LaptopSaveInfo.BobbyRayInventory, Enum112.BOBBY_RAY_NEW);

  // loop through all items BR can stock to see what needs reordering
  for (i = 0; i < LaptopSaveInfo.usInventoryListLength[Enum112.BOBBY_RAY_NEW]; i++) {
    // the index is NOT the item #, get that from the table
    usItemIndex = LaptopSaveInfo.BobbyRayInventory[i].usItemIndex;

    Assert(usItemIndex < Enum225.MAXITEMS);

    // make sure this item is still sellable in the latest version of the store inventory
    if (StoreInventory[usItemIndex][Enum112.BOBBY_RAY_NEW] == 0) {
      continue;
    }

    // if the item isn't already on order
    if (LaptopSaveInfo.BobbyRayInventory[i].ubQtyOnOrder == 0) {
      // if the qty on hand is half the desired amount or fewer
      if (LaptopSaveInfo.BobbyRayInventory[i].ubQtyOnHand <= (StoreInventory[usItemIndex][Enum112.BOBBY_RAY_NEW] / 2)) {
        // remember value of the "previously eligible" flag
        fPrevElig = LaptopSaveInfo.BobbyRayInventory[i].fPreviouslyEligible;

        // determine if any can/should be ordered, and how many
        LaptopSaveInfo.BobbyRayInventory[i].ubQtyOnOrder = HowManyBRItemsToOrder(usItemIndex, LaptopSaveInfo.BobbyRayInventory[i].ubQtyOnHand, Enum112.BOBBY_RAY_NEW);

        // if he found some to buy
        if (LaptopSaveInfo.BobbyRayInventory[i].ubQtyOnOrder > 0) {
          // if this is the first day the player is eligible to have access to this thing
          if (!fPrevElig) {
            // eliminate the ordering delay and stock the items instantly!
            // This is just a way to reward the player right away for making progress without the reordering lag...
            AddFreshBobbyRayInventory(usItemIndex);
          } else {
            OrderBobbyRItem(usItemIndex);
          }
        }
      }
    }
  }
}

export function DailyUpdateOfBobbyRaysUsedInventory(): void {
  let i: INT16;
  let usItemIndex: UINT16;
  let fPrevElig: boolean;

  // simulate other buyers by reducing the current quantity on hand
  SimulateBobbyRayCustomer(LaptopSaveInfo.BobbyRayUsedInventory, Enum112.BOBBY_RAY_USED);

  for (i = 0; i < LaptopSaveInfo.usInventoryListLength[Enum112.BOBBY_RAY_USED]; i++) {
    // if the used item isn't already on order
    if (LaptopSaveInfo.BobbyRayUsedInventory[i].ubQtyOnOrder == 0) {
      // if we don't have ANY
      if (LaptopSaveInfo.BobbyRayUsedInventory[i].ubQtyOnHand == 0) {
        // the index is NOT the item #, get that from the table
        usItemIndex = LaptopSaveInfo.BobbyRayUsedInventory[i].usItemIndex;
        Assert(usItemIndex < Enum225.MAXITEMS);

        // make sure this item is still sellable in the latest version of the store inventory
        if (StoreInventory[usItemIndex][Enum112.BOBBY_RAY_USED] == 0) {
          continue;
        }

        // remember value of the "previously eligible" flag
        fPrevElig = LaptopSaveInfo.BobbyRayUsedInventory[i].fPreviouslyEligible;

        // determine if any can/should be ordered, and how many
        LaptopSaveInfo.BobbyRayUsedInventory[i].ubQtyOnOrder = HowManyBRItemsToOrder(usItemIndex, LaptopSaveInfo.BobbyRayUsedInventory[i].ubQtyOnHand, Enum112.BOBBY_RAY_USED);

        // if he found some to buy
        if (LaptopSaveInfo.BobbyRayUsedInventory[i].ubQtyOnOrder > 0) {
          // if this is the first day the player is eligible to have access to this thing
          if (!fPrevElig) {
            // eliminate the ordering delay and stock the items instantly!
            // This is just a way to reward the player right away for making progress without the reordering lag...
            AddFreshBobbyRayInventory(usItemIndex);
          } else {
            OrderBobbyRItem((usItemIndex + BOBBY_R_USED_PURCHASE_OFFSET));
          }
        }
      }
    }
  }
}

// returns the number of items to order
function HowManyBRItemsToOrder(usItemIndex: UINT16, ubCurrentlyOnHand: UINT8, ubBobbyRayNewUsed: UINT8): UINT8 {
  let ubItemsOrdered: UINT8 = 0;

  Assert(usItemIndex < Enum225.MAXITEMS);
  // formulas below will fail if there are more items already in stock than optimal
  Assert(ubCurrentlyOnHand <= StoreInventory[usItemIndex][ubBobbyRayNewUsed]);
  Assert(ubBobbyRayNewUsed < Enum112.BOBBY_RAY_LISTS);

  // decide if he can get stock for this item (items are reordered an entire batch at a time)
  if (ItemTransactionOccurs(-1, usItemIndex, DEALER_BUYING, ubBobbyRayNewUsed)) {
    if (ubBobbyRayNewUsed == Enum112.BOBBY_RAY_NEW) {
      ubItemsOrdered = HowManyItemsToReorder(StoreInventory[usItemIndex][ubBobbyRayNewUsed], ubCurrentlyOnHand);
    } else {
      // Since these are used items we only should order 1 of each type
      ubItemsOrdered = 1;
    }
  } else {
    // can't obtain this item from suppliers
    ubItemsOrdered = 0;
  }

  return ubItemsOrdered;
}

function OrderBobbyRItem(usItemIndex: UINT16): void {
  let uiArrivalTime: UINT32;

  // add the new item to the queue.  The new item will arrive in 'uiArrivalTime' minutes.
  uiArrivalTime = BOBBY_R_NEW_PURCHASE_ARRIVAL_TIME + Random(BOBBY_R_NEW_PURCHASE_ARRIVAL_TIME / 2);
  uiArrivalTime += GetWorldTotalMin();
  AddStrategicEvent(Enum132.EVENT_UPDATE_BOBBY_RAY_INVENTORY, uiArrivalTime, usItemIndex);
}

export function AddFreshBobbyRayInventory(usItemIndex: UINT16): void {
  let sInventorySlot: INT16;
  let pInventoryArray: Pointer<STORE_INVENTORY>;
  let fUsed: boolean;
  let ubItemQuality: UINT8;

  if (usItemIndex >= BOBBY_R_USED_PURCHASE_OFFSET) {
    usItemIndex -= BOBBY_R_USED_PURCHASE_OFFSET;
    pInventoryArray = LaptopSaveInfo.BobbyRayUsedInventory;
    fUsed = Enum112.BOBBY_RAY_USED;
    ubItemQuality = 20 + Random(60);
  } else {
    pInventoryArray = LaptopSaveInfo.BobbyRayInventory;
    fUsed = Enum112.BOBBY_RAY_NEW;
    ubItemQuality = 100;
  }

  // find out which inventory slot that item is stored in
  sInventorySlot = GetInventorySlotForItem(pInventoryArray, usItemIndex, fUsed);
  if (sInventorySlot == -1) {
    AssertMsg(false, String("AddFreshBobbyRayInventory(), Item %d not found.  AM-0.", usItemIndex));
    return;
  }

  pInventoryArray[sInventorySlot].ubQtyOnHand += pInventoryArray[sInventorySlot].ubQtyOnOrder;
  pInventoryArray[sInventorySlot].ubItemQuality = ubItemQuality;

  // cancel order
  pInventoryArray[sInventorySlot].ubQtyOnOrder = 0;
}

export function GetInventorySlotForItem(pInventoryArray: Pointer<STORE_INVENTORY>, usItemIndex: UINT16, fUsed: boolean): INT16 {
  let i: INT16;

  for (i = 0; i < LaptopSaveInfo.usInventoryListLength[fUsed]; i++) {
    // if we have some of this item in stock
    if (pInventoryArray[i].usItemIndex == usItemIndex) {
      return i;
    }
  }

  // not found!
  return -1;
}

function SimulateBobbyRayCustomer(pInventoryArray: Pointer<STORE_INVENTORY>, fUsed: boolean): void {
  let i: INT16;
  let ubItemsSold: UINT8;

  // loop through all items BR can stock to see what gets sold
  for (i = 0; i < LaptopSaveInfo.usInventoryListLength[fUsed]; i++) {
    // if we have some of this item in stock
    if (pInventoryArray[i].ubQtyOnHand > 0) {
      ubItemsSold = HowManyItemsAreSold(-1, pInventoryArray[i].usItemIndex, pInventoryArray[i].ubQtyOnHand, fUsed);
      pInventoryArray[i].ubQtyOnHand -= ubItemsSold;
    }
  }
}

export function CancelAllPendingBRPurchaseOrders(): void {
  let i: INT16;

  // remove all the BR-Order events off the event queue
  DeleteAllStrategicEventsOfType(Enum132.EVENT_UPDATE_BOBBY_RAY_INVENTORY);

  // zero out all the quantities on order
  for (i = 0; i < Enum225.MAXITEMS; i++) {
    LaptopSaveInfo.BobbyRayInventory[i].ubQtyOnOrder = 0;
    LaptopSaveInfo.BobbyRayUsedInventory[i].ubQtyOnOrder = 0;
  }

  // do an extra daily update immediately to create new reorders ASAP
  DailyUpdateOfBobbyRaysNewInventory();
  DailyUpdateOfBobbyRaysUsedInventory();
}

}
