let guiArmourBackground: UINT32;
let guiArmourGrid: UINT32;

function GameInitBobbyRArmour(): void {
}

function EnterBobbyRArmour(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  // load the background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Armourbackground.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiArmourBackground)));

  // load the gunsgrid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\Armourgrid.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(addressof(VObjectDesc), addressof(guiArmourGrid)));

  InitBobbyBrTitle();
  // Draw menu bar
  InitBobbyMenuBar();

  SetFirstLastPagesForNew(IC_ARMOUR);
  //	CalculateFirstAndLastIndexs();

  RenderBobbyRArmour();

  return TRUE;
}

function ExitBobbyRArmour(): void {
  DeleteVideoObjectFromIndex(guiArmourBackground);
  DeleteVideoObjectFromIndex(guiArmourGrid);
  DeleteBobbyMenuBar();

  DeleteBobbyBrTitle();
  DeleteMouseRegionForBigImage();

  giCurrentSubPage = gusCurWeaponIndex;
  guiLastBobbyRayPage = Enum95.LAPTOP_MODE_BOBBY_R_ARMOR;
}

function HandleBobbyRArmour(): void {
}

function RenderBobbyRArmour(): void {
  let hPixHandle: HVOBJECT;

  WebPageTileBackground(BOBBYR_NUM_HORIZONTAL_TILES, BOBBYR_NUM_VERTICAL_TILES, BOBBYR_BACKGROUND_WIDTH, BOBBYR_BACKGROUND_HEIGHT, guiArmourBackground);

  // Display title at top of page
  DisplayBobbyRBrTitle();

  // GunForm
  GetVideoObject(addressof(hPixHandle), guiArmourGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_GRIDLOC_X, BOBBYR_GRIDLOC_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  DisplayItemInfo(IC_ARMOUR);

  UpdateButtonText(guiCurrentLaptopMode);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}
