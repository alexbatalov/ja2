let guiMiscBackground: UINT32;
let guiMiscGrid: UINT32;

function GameInitBobbyRMisc(): void {
}

function EnterBobbyRMisc(): BOOLEAN {
  let VObjectDesc: VOBJECT_DESC;

  // load the background graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\miscbackground.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiMiscBackground));

  // load the gunsgrid graphic and add it
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("LAPTOP\\miscgrid.sti", VObjectDesc.ImageFile);
  CHECKF(AddVideoObject(&VObjectDesc, &guiMiscGrid));

  InitBobbyBrTitle();
  // Draw menu bar
  InitBobbyMenuBar();

  SetFirstLastPagesForNew(IC_BOBBY_MISC);
  //	CalculateFirstAndLastIndexs();

  RenderBobbyRMisc();

  return TRUE;
}

function ExitBobbyRMisc(): void {
  DeleteVideoObjectFromIndex(guiMiscBackground);
  DeleteVideoObjectFromIndex(guiMiscGrid);
  DeleteBobbyBrTitle();
  DeleteMouseRegionForBigImage();
  DeleteBobbyMenuBar();

  guiLastBobbyRayPage = LAPTOP_MODE_BOBBY_R_MISC;
}

function HandleBobbyRMisc(): void {
}

function RenderBobbyRMisc(): void {
  let hPixHandle: HVOBJECT;

  WebPageTileBackground(BOBBYR_NUM_HORIZONTAL_TILES, BOBBYR_NUM_VERTICAL_TILES, BOBBYR_BACKGROUND_WIDTH, BOBBYR_BACKGROUND_HEIGHT, guiMiscBackground);

  // Display title at top of page
  DisplayBobbyRBrTitle();

  // GunForm
  GetVideoObject(&hPixHandle, guiMiscGrid);
  BltVideoObject(FRAME_BUFFER, hPixHandle, 0, BOBBYR_GRIDLOC_X, BOBBYR_GRIDLOC_Y, VO_BLT_SRCTRANSPARENCY, NULL);

  DisplayItemInfo(IC_BOBBY_MISC);

  UpdateButtonText(guiCurrentLaptopMode);
  MarkButtonsDirty();
  RenderWWWProgramTitleBar();
  InvalidateRegion(LAPTOP_SCREEN_UL_X, LAPTOP_SCREEN_WEB_UL_Y, LAPTOP_SCREEN_LR_X, LAPTOP_SCREEN_WEB_LR_Y);
}
