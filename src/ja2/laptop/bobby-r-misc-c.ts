namespace ja2 {

let guiMiscBackground: UINT32;
let guiMiscGrid: UINT32;

export function GameInitBobbyRMisc(): void {
}

export function EnterBobbyRMisc(): boolean {
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();

  // load the background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\miscbackground.sti");
  if (!(guiMiscBackground = AddVideoObject(VObjectDesc))) {
    return false;
  }

  // load the gunsgrid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  VObjectDesc.ImageFile = FilenameForBPP("LAPTOP\\miscgrid.sti");
  if (!(guiMiscGrid = AddVideoObject(VObjectDesc))) {
    return false;
  }

  InitBobbyBrTitle();
  // Draw menu bar
  InitBobbyMenuBar();

  SetFirstLastPagesForNew(IC_BOBBY_MISC);
  //	CalculateFirstAndLastIndexs();

  RenderBobbyRMisc();

  return true;
}

export function ExitBobbyRMisc(): void {
  DeleteVideoObjectFromIndex(guiMiscBackground);
  DeleteVideoObjectFromIndex(guiMiscGrid);
  DeleteBobbyBrTitle();
  DeleteMouseRegionForBigImage();
  DeleteBobbyMenuBar();

  guiLastBobbyRayPage = Enum95.LAPTOP_MODE_BOBBY_R_MISC;
}

export function HandleBobbyRMisc(): void {
}

export function RenderBobbyRMisc(): void {
  let hPixHandle: HVOBJECT;

  WebPageTileBackground(BOBBYR_NUM_HORIZONTAL_TILES, BOBBYR_NUM_VERTICAL_TILES, BOBBYR_BACKGROUND_WIDTH, BOBBYR_BACKGROUND_HEIGHT, guiMiscBackground);

  // Display title at top of page
  DisplayBobbyRBrTitle();

  // GunForm
  GetVideoObject(addressof(hPixHandle), guiMiscGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_GRIDLOC_X, BOBBYR_GRIDLOC_Y, VO_BLT_SRCTRANSPARENCY, null);

  DisplayItemInfo(IC_BOBBY_MISC);

  UpdateButtonText(guiCurrentLaptopMode);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}

}
