let guiUsedBackground: UINT32;
let guiUsedGrid: UINT32;

function GameInitBobbyRUsed(): void {
}

function EnterBobbyRUsed(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  // load the background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\usedbackground.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiUsedBackground)));

  // load the gunsgrid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\usedgrid.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiUsedGrid)));

  InitBobbyBrTitle();

  SetFirstLastPagesForUsed();
  //	CalculateFirstAndLastIndexs();

  // Draw menu bar
  InitBobbyMenuBar();

  RenderBobbyRUsed();

  return TRUE;
}

function ExitBobbyRUsed(): void {
  DeleteVideoObjectFromIndex(guiUsedBackground);
  DeleteVideoObjectFromIndex(guiUsedGrid);
  DeleteBobbyMenuBar();
  DeleteBobbyBrTitle();
  DeleteMouseRegionForBigImage();

  giCurrentSubPage = gusCurWeaponIndex;
  guiLastBobbyRayPage = Enum95.LAPTOP_MODE_BOBBY_R_USED;
}

function HandleBobbyRUsed(): void {
}

function RenderBobbyRUsed(): void {
  let hPixHandle: HVOBJECT;

  WebPageTileBackground(BOBBYR_NUM_HORIZONTAL_TILES, BOBBYR_NUM_VERTICAL_TILES, BOBBYR_BACKGROUND_WIDTH, BOBBYR_BACKGROUND_HEIGHT, guiUsedBackground);

  // Display title at top of page
  DisplayBobbyRBrTitle();

  // GunForm
  GetVideoObject(addressof(hPixHandle), guiUsedGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_GRIDLOC_X, BOBBYR_GRIDLOC_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  DisplayItemInfo(BOBBYR_USED_ITEMS);

  UpdateButtonText(guiCurrentLaptopMode);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}
