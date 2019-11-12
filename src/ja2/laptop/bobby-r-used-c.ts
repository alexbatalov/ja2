namespace ja2 {

let guiUsedBackground: UINT32;
let guiUsedGrid: UINT32;

export function GameInitBobbyRUsed(): void {
}

export function EnterBobbyRUsed(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load the background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\usedbackground.sti");
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiUsedBackground))) {
    return false;
  }

  // load the gunsgrid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\usedgrid.sti");
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiUsedGrid))) {
    return false;
  }

  InitBobbyBrTitle();

  SetFirstLastPagesForUsed();
  //	CalculateFirstAndLastIndexs();

  // Draw menu bar
  InitBobbyMenuBar();

  RenderBobbyRUsed();

  return true;
}

export function ExitBobbyRUsed(): void {
  DeleteVideoObjectFromIndex(guiUsedBackground);
  DeleteVideoObjectFromIndex(guiUsedGrid);
  DeleteBobbyMenuBar();
  DeleteBobbyBrTitle();
  DeleteMouseRegionForBigImage();

  giCurrentSubPage = gusCurWeaponIndex;
  guiLastBobbyRayPage = Enum95.LAPTOP_MODE_BOBBY_R_USED;
}

export function HandleBobbyRUsed(): void {
}

export function RenderBobbyRUsed(): void {
  let hPixHandle: HVOBJECT;

  WebPageTileBackground(BOBBYR_NUM_HORIZONTAL_TILES, BOBBYR_NUM_VERTICAL_TILES, BOBBYR_BACKGROUND_WIDTH, BOBBYR_BACKGROUND_HEIGHT, guiUsedBackground);

  // Display title at top of page
  DisplayBobbyRBrTitle();

  // GunForm
  GetVideoObject(addressof(hPixHandle), guiUsedGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_GRIDLOC_X, BOBBYR_GRIDLOC_Y, VO_BLT_SRCTRANSPARENCY, null);

  DisplayItemInfo(BOBBYR_USED_ITEMS);

  UpdateButtonText(guiCurrentLaptopMode);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

}
