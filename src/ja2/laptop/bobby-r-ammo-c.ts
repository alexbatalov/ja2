namespace ja2 {

let guiAmmoBackground: UINT32;
let guiAmmoGrid: UINT32;

export function GameInitBobbyRAmmo(): void {
}

export function EnterBobbyRAmmo(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load the background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\ammobackground.sti");
  if (!(guiAmmoBackground = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the gunsgrid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\ammogrid.sti");
  if (!(guiAmmoGrid = AddVideoObject(VObjectDesc))) {
    return false;
  }

  InitBobbyBrTitle();

  SetFirstLastPagesForNew(IC_AMMO);
  //	CalculateFirstAndLastIndexs();

  // Draw menu bar
  InitBobbyMenuBar();

  RenderBobbyRAmmo();

  return true;
}

export function ExitBobbyRAmmo(): void {
  DeleteVideoObjectFromIndex(guiAmmoBackground);
  DeleteVideoObjectFromIndex(guiAmmoGrid);
  DeleteBobbyMenuBar();

  DeleteBobbyBrTitle();
  DeleteMouseRegionForBigImage();

  giCurrentSubPage = gusCurWeaponIndex;
  guiLastBobbyRayPage = Enum95.LAPTOP_MODE_BOBBY_R_AMMO;
}

export function HandleBobbyRAmmo(): void {
}

export function RenderBobbyRAmmo(): void {
  let hPixHandle: SGPVObject;

  WebPageTileBackground(BOBBYR_NUM_HORIZONTAL_TILES, BOBBYR_NUM_VERTICAL_TILES, BOBBYR_BACKGROUND_WIDTH, BOBBYR_BACKGROUND_HEIGHT, guiAmmoBackground);

  // Display title at top of page
  DisplayBobbyRBrTitle();

  // GunForm
  hPixHandle = GetVideoObject(guiAmmoGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_GRIDLOC_X, BOBBYR_GRIDLOC_Y, VO_BLT_SRCTRANSPARENCY, null);

  DisplayItemInfo(IC_AMMO);

  UpdateButtonText(guiCurrentLaptopMode);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

}
