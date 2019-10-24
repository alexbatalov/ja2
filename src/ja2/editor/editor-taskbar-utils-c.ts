// editor icon storage vars
let giEditMercDirectionIcons: INT32[] /* [2] */;
let guiMercInventoryPanel: UINT32;
let guiOmertaMap: UINT32;
let guiMercInvPanelBuffers: UINT32[] /* [9] */;
let guiMercTempBuffer: UINT32;
let giEditMercImage: INT32[] /* [2] */;
let guiExclamation: UINT32;
let guiKeyImage: UINT32;

// editor Mouseregion storage vars
let TerrainTileButtonRegion: MOUSE_REGION[] /* [NUM_TERRAIN_TILE_REGIONS] */;
let ItemsRegion: MOUSE_REGION;
let MercRegion: MOUSE_REGION;
let EditorRegion: MOUSE_REGION;

function EnableEditorRegion(bRegionID: INT8): void {
  switch (bRegionID) {
    case Enum45.BASE_TERRAIN_TILE_REGION_ID:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      MSYS_EnableRegion(addressof(TerrainTileButtonRegion[bRegionID]));
      break;
    case Enum45.ITEM_REGION_ID:
      MSYS_EnableRegion(addressof(ItemsRegion));
      break;
    case Enum45.MERC_REGION_ID:
      MSYS_EnableRegion(addressof(MercRegion));
      break;
  }
}

function DisableEditorRegion(bRegionID: INT8): void {
  switch (bRegionID) {
    case Enum45.BASE_TERRAIN_TILE_REGION_ID:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      MSYS_DisableRegion(addressof(TerrainTileButtonRegion[bRegionID]));
      break;
    case Enum45.ITEM_REGION_ID:
      MSYS_DisableRegion(addressof(ItemsRegion));
      break;
    case Enum45.MERC_REGION_ID:
      MSYS_DisableRegion(addressof(MercRegion));
      break;
  }
}

function RemoveEditorRegions(): void {
  let x: INT32;
  MSYS_RemoveRegion(addressof(EditorRegion));
  for (x = Enum45.BASE_TERRAIN_TILE_REGION_ID; x < NUM_TERRAIN_TILE_REGIONS; x++) {
    MSYS_RemoveRegion(addressof(TerrainTileButtonRegion[x]));
  }
  MSYS_RemoveRegion(addressof(ItemsRegion));
  MSYS_RemoveRegion(addressof(MercRegion));
}

function InitEditorRegions(): void {
  let x: INT32;

  // By doing this, all of the buttons underneath are blanketed and can't be used anymore.
  // Any new buttons will cover this up as well.  Think of it as a barrier between the editor buttons,
  // and the game's interface panel buttons and regions.
  MSYS_DefineRegion(addressof(EditorRegion), 0, 360, 640, 480, MSYS_PRIORITY_NORMAL, 0, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

  // Create the regions for the terrain tile selections
  for (x = 0; x < NUM_TERRAIN_TILE_REGIONS; x++) {
    MSYS_DefineRegion(addressof(TerrainTileButtonRegion[x]), (261 + x * 42), 369, (303 + x * 42), 391, MSYS_PRIORITY_NORMAL, 0, MSYS_NO_CALLBACK, TerrainTileButtonRegionCallback);
    MSYS_SetRegionUserData(addressof(TerrainTileButtonRegion[x]), 0, x);
    MSYS_DisableRegion(addressof(TerrainTileButtonRegion[x]));
  }
  gfShowTerrainTileButtons = FALSE;

  // Create the region for the items selection window.
  MSYS_DefineRegion(addressof(ItemsRegion), 100, 360, 540, 440, MSYS_PRIORITY_NORMAL, 0, MouseMovedInItemsRegion, MouseClickedInItemsRegion);
  MSYS_DisableRegion(addressof(ItemsRegion));

  // Create the region for the merc inventory panel.
  MSYS_DefineRegion(addressof(MercRegion), 175, 361, 450, 460, MSYS_PRIORITY_NORMAL, 0, MouseMovedInMercRegion, MouseClickedInMercRegion);
  MSYS_DisableRegion(addressof(MercRegion));
}

function LoadEditorImages(): void {
  let VObjectDesc: VOBJECT_DESC;

  // Set up the merc inventory panel
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  sprintf(VObjectDesc.ImageFile, "EDITOR\\InvPanel.sti");
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiMercInventoryPanel)))
    AssertMsg(0, "Failed to load data\\editor\\InvPanel.sti");
  // Set up small omerta map
  sprintf(VObjectDesc.ImageFile, "EDITOR\\omerta.sti");
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiOmertaMap)))
    AssertMsg(0, "Failed to load data\\editor\\omerta.sti");
  // Set up the merc directional buttons.
  giEditMercDirectionIcons[0] = LoadGenericButtonIcon("EDITOR//arrowsoff.sti");
  giEditMercDirectionIcons[1] = LoadGenericButtonIcon("EDITOR//arrowson.sti");

  giEditMercImage[0] = LoadButtonImage("EDITOR\\leftarrow.sti", 0, 1, 2, 3, 4);
  giEditMercImage[1] = LoadButtonImage("EDITOR\\rightarrow.sti", 0, 1, 2, 3, 4);

  sprintf(VObjectDesc.ImageFile, "EDITOR\\Exclamation.sti");
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiExclamation)))
    AssertMsg(0, "Failed to load data\\editor\\Exclamation.sti");
  sprintf(VObjectDesc.ImageFile, "EDITOR\\KeyImage.sti");
  if (!AddVideoObject(addressof(VObjectDesc), addressof(guiKeyImage)))
    AssertMsg(0, "Failed to load data\\editor\\KeyImage.sti");
}

function DeleteEditorImages(): void {
  // The merc inventory panel
  DeleteVideoObjectFromIndex(guiMercInventoryPanel);
  DeleteVideoObjectFromIndex(guiOmertaMap);
  // The merc directional buttons
  UnloadGenericButtonIcon(giEditMercDirectionIcons[0]);
  UnloadGenericButtonIcon(giEditMercDirectionIcons[1]);

  UnloadButtonImage(giEditMercImage[0]);
  UnloadButtonImage(giEditMercImage[1]);
}

function CreateEditorBuffers(): void {
  let i: INT32;
  let vs_desc: VSURFACE_DESC;
  let usUselessWidth: UINT16;
  let usUselessHeight: UINT16;
  let ubBitDepth: UINT8;

  // create buffer for the transition slot for merc items.  This slot contains the newly
  // selected item graphic in it's inventory size version.  This buffer is then scaled down
  // into the associated merc inventory panel slot buffer which is approximately 20% smaller.
  GetCurrentVideoSettings(addressof(usUselessWidth), addressof(usUselessHeight), addressof(ubBitDepth));
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = 60;
  vs_desc.usHeight = 25;
  vs_desc.ubBitDepth = ubBitDepth;
  if (!AddVideoSurface(addressof(vs_desc), addressof(guiMercTempBuffer)))
    AssertMsg(0, "Failed to allocate memory for merc tempitem buffer.");

  // create the nine buffers for the merc's inventory slots.
  vs_desc.usHeight = MERCINV_SLOT_HEIGHT;
  for (i = 0; i < 9; i++) {
    vs_desc.usWidth = i < 3 ? MERCINV_SMSLOT_WIDTH : MERCINV_LGSLOT_WIDTH;
    if (!AddVideoSurface(addressof(vs_desc), addressof(guiMercInvPanelBuffers[i])))
      AssertMsg(0, "Failed to allocate memory for merc item[] buffers.");
  }
}

function DeleteEditorBuffers(): void {
  let i: INT32;
  DeleteVideoSurfaceFromIndex(guiMercTempBuffer);
  for (i = 0; i < 9; i++) {
    DeleteVideoSurfaceFromIndex(guiMercInvPanelBuffers[i]);
  }
}

function ShowEditorToolbar(iNewTaskMode: INT32): void {
  switch (iNewTaskMode) {
    case Enum36.TASK_TERRAIN:
      ShowEditorButtons(Enum32.FIRST_TERRAIN_BUTTON, Enum32.LAST_TERRAIN_BUTTON);
      break;
    case Enum36.TASK_BUILDINGS:
      ShowEditorButtons(Enum32.FIRST_BUILDINGS_BUTTON, Enum32.LAST_BUILDINGS_BUTTON);
      break;
    case Enum36.TASK_ITEMS:
      ShowEditorButtons(Enum32.FIRST_ITEMS_BUTTON, Enum32.LAST_ITEMS_BUTTON);
      break;
    case Enum36.TASK_MERCS:
      ShowEditorButtons(FIRST_MERCS_TEAMMODE_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
      break;
    case Enum36.TASK_MAPINFO:
      ShowEditorButtons(Enum32.FIRST_MAPINFO_BUTTON, Enum32.LAST_MAPINFO_BUTTON);
      break;
    case Enum36.TASK_OPTIONS:
      ShowEditorButtons(Enum32.FIRST_OPTIONS_BUTTON, Enum32.LAST_OPTIONS_BUTTON);
      break;
    default:
      return;
  }
}

function HideEditorToolbar(iOldTaskMode: INT32): void {
  let i: INT32;
  let iStart: INT32;
  let iEnd: INT32;
  switch (iOldTaskMode) {
    case Enum36.TASK_TERRAIN:
      iStart = Enum32.FIRST_TERRAIN_BUTTON;
      iEnd = Enum32.LAST_TERRAIN_BUTTON;
      break;
    case Enum36.TASK_BUILDINGS:
      iStart = Enum32.FIRST_BUILDINGS_BUTTON;
      iEnd = Enum32.LAST_BUILDINGS_BUTTON;
      break;
    case Enum36.TASK_ITEMS:
      iStart = Enum32.FIRST_ITEMS_BUTTON;
      iEnd = Enum32.LAST_ITEMS_BUTTON;
      break;
    case Enum36.TASK_MERCS:
      iStart = Enum32.FIRST_MERCS_BUTTON;
      iEnd = Enum32.LAST_MERCS_BUTTON;
      break;
    case Enum36.TASK_MAPINFO:
      iStart = Enum32.FIRST_MAPINFO_BUTTON;
      iEnd = Enum32.LAST_MAPINFO_BUTTON;
      break;
    case Enum36.TASK_OPTIONS:
      iStart = Enum32.FIRST_OPTIONS_BUTTON;
      iEnd = Enum32.LAST_OPTIONS_BUTTON;
      break;
    default:
      return;
  }
  for (i = iStart; i <= iEnd; i++) {
    HideButton(iEditorButton[i]);
    UnclickEditorButton(i);
  }
}

function CreateEditorTaskbar(): void {
  InitEditorRegions();
  LoadEditorImages();
  CreateEditorBuffers();
  CreateEditorTaskbarInternal();
  HideItemStatsPanel();
}

function DeleteEditorTaskbar(): void {
  let x: INT32;

  iOldTaskMode = iCurrentTaskbar;

  for (x = 0; x < Enum32.NUMBER_EDITOR_BUTTONS; x++)
    RemoveButton(iEditorButton[x]);

  RemoveEditorRegions();
  DeleteEditorImages();
  DeleteEditorBuffers();
}

function DoTaskbar(): void {
  if (!iTaskMode || iTaskMode == iCurrentTaskbar) {
    return;
  }

  gfRenderTaskbar = TRUE;

  HideEditorToolbar(iCurrentTaskbar);

  // Special code when exiting previous editor tab
  switch (iCurrentTaskbar) {
    case Enum36.TASK_TERRAIN:
      UnclickEditorButton(Enum32.TAB_TERRAIN);
      HideTerrainTileButtons();
      break;
    case Enum36.TASK_BUILDINGS:
      UnclickEditorButton(Enum32.TAB_BUILDINGS);
      KillTextInputMode();
      break;
    case Enum36.TASK_ITEMS:
      UnclickEditorButton(Enum32.TAB_ITEMS);
      HideItemStatsPanel();
      if (eInfo.fActive)
        ClearEditorItemsInfo();
      gfShowPits = FALSE;
      RemoveAllPits();
      break;
    case Enum36.TASK_MERCS:
      UnclickEditorButton(Enum32.TAB_MERCS);
      IndicateSelectedMerc(Enum43.SELECT_NO_MERC);
      SetMercEditingMode(Enum42.MERC_NOMODE);
      break;
    case Enum36.TASK_MAPINFO:
      UnclickEditorButton(Enum32.TAB_MAPINFO);
      ExtractAndUpdateMapInfo();
      KillTextInputMode();
      HideExitGrids();
      break;
    case Enum36.TASK_OPTIONS:
      UnclickEditorButton(Enum32.TAB_OPTIONS);
      break;
  }

  // Setup the new tab mode
  iCurrentTaskbar = iTaskMode;
  ShowEditorToolbar(iTaskMode);
  iTaskMode = Enum36.TASK_NONE;

  // Special code when entering a new editor tab
  switch (iCurrentTaskbar) {
    case Enum36.TASK_MERCS:
      ClickEditorButton(Enum32.TAB_MERCS);
      ClickEditorButton(Enum32.MERCS_ENEMY);
      iDrawMode = Enum38.DRAW_MODE_ENEMY;
      SetMercEditingMode(Enum42.MERC_TEAMMODE);
      fBuildingShowRoofs = FALSE;
      UpdateRoofsView();
      break;
    case Enum36.TASK_TERRAIN:
      ClickEditorButton(Enum32.TAB_TERRAIN);
      ShowTerrainTileButtons();
      SetEditorTerrainTaskbarMode(Enum32.TERRAIN_FGROUND_TEXTURES);
      break;
    case Enum36.TASK_BUILDINGS:
      ClickEditorButton(Enum32.TAB_BUILDINGS);
      if (fBuildingShowRoofs)
        ClickEditorButton(Enum32.BUILDING_TOGGLE_ROOF_VIEW);
      if (fBuildingShowWalls)
        ClickEditorButton(Enum32.BUILDING_TOGGLE_WALL_VIEW);
      if (fBuildingShowRoomInfo)
        ClickEditorButton(Enum32.BUILDING_TOGGLE_INFO_VIEW);
      if (gfCaves) {
        ClickEditorButton(Enum32.BUILDING_CAVE_DRAWING);
        iDrawMode = Enum38.DRAW_MODE_CAVES;
      } else {
        ClickEditorButton(Enum32.BUILDING_NEW_ROOM);
        iDrawMode = Enum38.DRAW_MODE_ROOM;
      }
      TerrainTileDrawMode = TERRAIN_TILES_BRETS_STRANGEMODE;
      SetEditorSmoothingMode(gMapInformation.ubEditorSmoothingType);
      gusSelectionType = gusSavedBuildingSelectionType;
      SetupTextInputForBuildings();
      break;
    case Enum36.TASK_ITEMS:
      SetFont(FONT10ARIAL());
      SetFontForeground(FONT_YELLOW);
      ClickEditorButton(Enum32.TAB_ITEMS);
      ClickEditorButton(Enum32.ITEMS_WEAPONS + eInfo.uiItemType - Enum35.TBAR_MODE_ITEM_WEAPONS);
      InitEditorItemsInfo(eInfo.uiItemType);
      ShowItemStatsPanel();
      gfShowPits = TRUE;
      AddAllPits();
      iDrawMode = Enum38.DRAW_MODE_PLACE_ITEM;
      break;
    case Enum36.TASK_MAPINFO:
      ClickEditorButton(Enum32.TAB_MAPINFO);
      if (gfFakeLights)
        ClickEditorButton(Enum32.MAPINFO_TOGGLE_FAKE_LIGHTS);
      ClickEditorButton(Enum32.MAPINFO_ADD_LIGHT1_SOURCE);
      iDrawMode = Enum38.DRAW_MODE_LIGHT;
      TerrainTileDrawMode = TERRAIN_TILES_BRETS_STRANGEMODE;
      SetupTextInputForMapInfo();
      break;
    case Enum36.TASK_OPTIONS:
      ClickEditorButton(Enum32.TAB_OPTIONS);
      TerrainTileDrawMode = TERRAIN_TILES_NODRAW;
      break;
  }
}

// Disables the task bar, but leaves it on screen. Used when a selection window is up.
function DisableEditorTaskbar(): void {
  let x: INT32;
  for (x = 0; x < Enum32.NUMBER_EDITOR_BUTTONS; x++)
    DisableButton(iEditorButton[x]);
}

function EnableEditorTaskbar(): void {
  let x: INT32;

  for (x = 0; x < Enum32.NUMBER_EDITOR_BUTTONS; x++)
    EnableButton(iEditorButton[x]);
  // Keep permanent buttons disabled.
  DisableButton(iEditorButton[Enum32.MERCS_1]);
  DisableButton(iEditorButton[Enum32.MAPINFO_LIGHT_PANEL]);
  DisableButton(iEditorButton[Enum32.MAPINFO_RADIO_PANEL]);
  DisableButton(iEditorButton[Enum32.ITEMSTATS_PANEL]);
  DisableButton(iEditorButton[Enum32.MERCS_PLAYERTOGGLE]);
  DisableButton(iEditorButton[Enum32.MERCS_PLAYER]);
  if (iCurrentTaskbar == Enum36.TASK_ITEMS)
    DetermineItemsScrolling();
}

// A specialized mprint function that'll restore the editor panel underneath the
// string before rendering the string.  This is obviously only useful for drawing text
// in the editor taskbar.
function mprintfEditor(x: INT16, y: INT16, pFontString: Pointer<UINT16>, ...args: any[]): void {
  let argptr: va_list;
  let string: wchar_t[] /* [512] */;
  let uiStringLength: UINT16;
  let uiStringHeight: UINT16;

  Assert(pFontString != null);

  va_start(argptr, pFontString); // Set up variable argument pointer
  vswprintf(string, pFontString, argptr); // process gprintf string (get output str)
  va_end(argptr);

  uiStringLength = StringPixLength(string, FontDefault);
  uiStringHeight = GetFontHeight(FontDefault);

  ClearTaskbarRegion(x, y, (x + uiStringLength), (y + uiStringHeight));
  mprintf(x, y, string);
}

function ClearTaskbarRegion(sLeft: INT16, sTop: INT16, sRight: INT16, sBottom: INT16): void {
  ColorFillVideoSurfaceArea(ButtonDestBuffer, sLeft, sTop, sRight, sBottom, gusEditorTaskbarColor);

  if (!sLeft) {
    ColorFillVideoSurfaceArea(ButtonDestBuffer, 0, sTop, 1, sBottom, gusEditorTaskbarHiColor);
    sLeft++;
  }
  if (sTop == 360) {
    ColorFillVideoSurfaceArea(ButtonDestBuffer, sLeft, 360, sRight, 361, gusEditorTaskbarHiColor);
    sTop++;
  }
  if (sBottom == 480)
    ColorFillVideoSurfaceArea(ButtonDestBuffer, sLeft, 479, sRight, 480, gusEditorTaskbarLoColor);
  if (sRight == 640)
    ColorFillVideoSurfaceArea(ButtonDestBuffer, 639, sTop, 640, sBottom, gusEditorTaskbarLoColor);

  InvalidateRegion(sLeft, sTop, sRight, sBottom);
}

// Kris:
// This is a new function which duplicates the older "yellow info boxes" that
// are common throughout the editor.  This draws the yellow box with the indentation
// look.
function DrawEditorInfoBox(str: Pointer<UINT16>, uiFont: UINT32, x: UINT16, y: UINT16, w: UINT16, h: UINT16): void {
  let usFillColorDark: UINT16;
  let usFillColorLight: UINT16;
  let usFillColorBack: UINT16;
  let x2: UINT16;
  let y2: UINT16;
  let usStrWidth: UINT16;

  x2 = x + w;
  y2 = y + h;

  usFillColorDark = Get16BPPColor(FROMRGB(24, 61, 81));
  usFillColorLight = Get16BPPColor(FROMRGB(136, 138, 135));
  usFillColorBack = Get16BPPColor(FROMRGB(250, 240, 188));

  ColorFillVideoSurfaceArea(ButtonDestBuffer, x, y, x2, y2, usFillColorDark);
  ColorFillVideoSurfaceArea(ButtonDestBuffer, x + 1, y + 1, x2, y2, usFillColorLight);
  ColorFillVideoSurfaceArea(ButtonDestBuffer, x + 1, y + 1, x2 - 1, y2 - 1, usFillColorBack);

  usStrWidth = StringPixLength(str, uiFont);
  if (usStrWidth > w) {
    // the string is too long, so use the wrapped method
    y += 1;
    DisplayWrappedString(x, y, w, 2, uiFont, FONT_BLACK, str, FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    return;
  }
  // center the string vertically and horizontally.
  SetFont(uiFont);
  SetFontForeground(FONT_BLACK);
  SetFontShadow(FONT_BLACK);
  x += (w - StringPixLength(str, uiFont)) / 2;
  y += (h - GetFontHeight(uiFont)) / 2;
  mprintf(x, y, "%s", str);
  InvalidateRegion(x, y, x2, y2);
}

function ClickEditorButton(iEditorButtonID: INT32): void {
  let butn: Pointer<GUI_BUTTON>;
  if (iEditorButtonID < 0 || iEditorButtonID >= Enum32.NUMBER_EDITOR_BUTTONS)
    return;
  if (iEditorButton[iEditorButtonID] != -1) {
    butn = ButtonList[iEditorButton[iEditorButtonID]];
    if (butn)
      butn.value.uiFlags |= BUTTON_CLICKED_ON;
  }
}

function UnclickEditorButton(iEditorButtonID: INT32): void {
  let butn: Pointer<GUI_BUTTON>;
  if (iEditorButtonID < 0 || iEditorButtonID >= Enum32.NUMBER_EDITOR_BUTTONS)
    return;
  if (iEditorButton[iEditorButtonID] != -1) {
    butn = ButtonList[iEditorButton[iEditorButtonID]];
    if (butn)
      butn.value.uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function HideEditorButton(iEditorButtonID: INT32): void {
  HideButton(iEditorButton[iEditorButtonID]);
}

function ShowEditorButton(iEditorButtonID: INT32): void {
  ShowButton(iEditorButton[iEditorButtonID]);
}

function DisableEditorButton(iEditorButtonID: INT32): void {
  DisableButton(iEditorButton[iEditorButtonID]);
}

function EnableEditorButton(iEditorButtonID: INT32): void {
  EnableButton(iEditorButton[iEditorButtonID]);
}

function ClickEditorButtons(iFirstEditorButtonID: INT32, iLastEditorButtonID: INT32): void {
  let i: INT32;
  let b: Pointer<GUI_BUTTON>;
  for (i = iFirstEditorButtonID; i <= iLastEditorButtonID; i++) {
    Assert(iEditorButton[i] != -1);
    b = ButtonList[iEditorButton[i]];
    Assert(b);
    b.value.uiFlags |= BUTTON_CLICKED_ON;
  }
}

function UnclickEditorButtons(iFirstEditorButtonID: INT32, iLastEditorButtonID: INT32): void {
  let i: INT32;
  let b: Pointer<GUI_BUTTON>;
  for (i = iFirstEditorButtonID; i <= iLastEditorButtonID; i++) {
    Assert(iEditorButton[i] != -1);
    b = ButtonList[iEditorButton[i]];
    Assert(b);
    b.value.uiFlags &= (~BUTTON_CLICKED_ON);
  }
}

function HideEditorButtons(iFirstEditorButtonID: INT32, iLastEditorButtonID: INT32): void {
  let i: INT32;
  for (i = iFirstEditorButtonID; i <= iLastEditorButtonID; i++)
    HideButton(iEditorButton[i]);
}

function ShowEditorButtons(iFirstEditorButtonID: INT32, iLastEditorButtonID: INT32): void {
  let i: INT32;
  for (i = iFirstEditorButtonID; i <= iLastEditorButtonID; i++)
    ShowButton(iEditorButton[i]);
}

function DisableEditorButtons(iFirstEditorButtonID: INT32, iLastEditorButtonID: INT32): void {
  let i: INT32;
  for (i = iFirstEditorButtonID; i <= iLastEditorButtonID; i++)
    DisableButton(iEditorButton[i]);
}

function EnableEditorButtons(iFirstEditorButtonID: INT32, iLastEditorButtonID: INT32): void {
  let i: INT32;
  for (i = iFirstEditorButtonID; i <= iLastEditorButtonID; i++)
    EnableButton(iEditorButton[i]);
}

function RenderMapEntryPointsAndLights(): void {
  let sGridNo: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let i: INT32;
  if (gfSummaryWindowActive)
    return;
  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_YELLOW);
  SetFontShadow(FONT_NEARBLACK);
  sGridNo = gMapInformation.sNorthGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, addressof(sScreenX), addressof(sScreenY));
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL(), FONT_YELLOW, "North Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sWestGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, addressof(sScreenX), addressof(sScreenY));
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL(), FONT_YELLOW, "West Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sEastGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, addressof(sScreenX), addressof(sScreenY));
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL(), FONT_YELLOW, "East Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sSouthGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, addressof(sScreenX), addressof(sScreenY));
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL(), FONT_YELLOW, "South Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sCenterGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, addressof(sScreenX), addressof(sScreenY));
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL(), FONT_YELLOW, "Center Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sIsolatedGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, addressof(sScreenX), addressof(sScreenY));
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL(), FONT_YELLOW, "Isolated Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  // Do the lights now.
  for (i = 0; i < MAX_LIGHT_SPRITES; i++) {
    if (LightSprites[i].uiFlags & LIGHT_SPR_ACTIVE) {
      sGridNo = LightSprites[i].iY * WORLD_COLS + LightSprites[i].iX;
      GetGridNoScreenPos(sGridNo, 0, addressof(sScreenX), addressof(sScreenY));
      if (sScreenY >= -50 && sScreenY < 300 && sScreenX >= -40 && sScreenX < 640) {
        if (LightSprites[i].uiFlags & LIGHT_PRIMETIME)
          DisplayWrappedString(sScreenX, (sScreenY - 5), 50, 2, FONT10ARIAL(), FONT_ORANGE, "Prime", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
        else if (LightSprites[i].uiFlags & LIGHT_NIGHTTIME)
          DisplayWrappedString(sScreenX, (sScreenY - 5), 50, 2, FONT10ARIAL(), FONT_RED, "Night", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
        else
          DisplayWrappedString(sScreenX, (sScreenY - 5), 50, 2, FONT10ARIAL(), FONT_YELLOW, "24Hour", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
      }
    }
  }
}

function BuildTriggerName(pItem: Pointer<OBJECTTYPE>, szItemName: Pointer<UINT16>): void {
  if (pItem.value.usItem == Enum225.SWITCH) {
    if (pItem.value.bFrequency == PANIC_FREQUENCY)
      swprintf(szItemName, "Panic Trigger1");
    else if (pItem.value.bFrequency == PANIC_FREQUENCY_2)
      swprintf(szItemName, "Panic Trigger2");
    else if (pItem.value.bFrequency == PANIC_FREQUENCY_3)
      swprintf(szItemName, "Panic Trigger3");
    else
      swprintf(szItemName, "Trigger%d", pItem.value.bFrequency - 50);
  } else {
    // action item
    if (pItem.value.bDetonatorType == Enum224.BOMB_PRESSURE)
      swprintf(szItemName, "Pressure Action");
    else if (pItem.value.bFrequency == PANIC_FREQUENCY)
      swprintf(szItemName, "Panic Action1");
    else if (pItem.value.bFrequency == PANIC_FREQUENCY_2)
      swprintf(szItemName, "Panic Action2");
    else if (pItem.value.bFrequency == PANIC_FREQUENCY_3)
      swprintf(szItemName, "Panic Action3");
    else
      swprintf(szItemName, "Action%d", pItem.value.bFrequency - 50);
  }
}

function RenderDoorLockInfo(): void {
  let i: INT16;
  let xp: INT16;
  let yp: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let str: UINT16[] /* [50] */;
  for (i = 0; i < gubNumDoors; i++) {
    GetGridNoScreenPos(DoorTable[i].sGridNo, 0, addressof(sScreenX), addressof(sScreenY));
    if (sScreenY > 390)
      continue;
    if (DoorTable[i].ubLockID != 255)
      swprintf(str, "%S", LockTable[DoorTable[i].ubLockID].ubEditorName);
    else
      swprintf(str, "No Lock ID");
    xp = sScreenX - 10;
    yp = sScreenY - 40;
    DisplayWrappedString(xp, yp, 60, 2, FONT10ARIAL(), FONT_LTKHAKI, str, FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    if (DoorTable[i].ubTrapID) {
      SetFont(FONT10ARIAL());
      SetFontForeground(FONT_RED);
      SetFontShadow(FONT_NEARBLACK);
      switch (DoorTable[i].ubTrapID) {
        case Enum227.EXPLOSION:
          swprintf(str, "Explosion Trap");
          break;
        case Enum227.ELECTRIC:
          swprintf(str, "Electric Trap");
          break;
        case Enum227.SIREN:
          swprintf(str, "Siren Trap");
          break;
        case Enum227.SILENT_ALARM:
          swprintf(str, "Silent Alarm");
          break;
        case Enum227.SUPER_ELECTRIC:
          swprintf(str, "Super Electric Trap");
          break;
      }
      xp = sScreenX + 20 - StringPixLength(str, FONT10ARIAL()) / 2;
      yp = sScreenY;
      mprintf(xp, yp, str);
      swprintf(str, "Trap Level %d", DoorTable[i].ubTrapLevel);
      xp = sScreenX + 20 - StringPixLength(str, FONT10ARIAL()) / 2;
      mprintf(xp, yp + 10, str);
    }
  }
}

function RenderSelectedItemBlownUp(): void {
  let uiVideoObjectIndex: UINT32;
  let hVObject: HVOBJECT;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let xp: INT16;
  let yp: INT16;
  let pItemPool: Pointer<ITEM_POOL>;
  let szItemName: UINT16[] /* [SIZE_ITEM_NAME] */;
  let i: INT32;
  let sWidth: INT16;
  let sHeight: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;

  GetGridNoScreenPos(gsItemGridNo, 0, addressof(sScreenX), addressof(sScreenY));

  if (sScreenY > 340)
    return;

  // Display the enlarged item graphic
  uiVideoObjectIndex = GetInterfaceGraphicForItem(addressof(Item[gpItem.value.usItem]));
  GetVideoObject(addressof(hVObject), uiVideoObjectIndex);

  sWidth = hVObject.value.pETRLEObject[Item[gpItem.value.usItem].ubGraphicNum].usWidth;
  sOffsetX = hVObject.value.pETRLEObject[Item[gpItem.value.usItem].ubGraphicNum].sOffsetX;
  xp = sScreenX + (40 - sWidth - sOffsetX * 2) / 2;

  sHeight = hVObject.value.pETRLEObject[Item[gpItem.value.usItem].ubGraphicNum].usHeight;
  sOffsetY = hVObject.value.pETRLEObject[Item[gpItem.value.usItem].ubGraphicNum].sOffsetY;
  yp = sScreenY + (20 - sHeight - sOffsetY * 2) / 2;

  BltVideoObjectOutlineFromIndex(FRAME_BUFFER, uiVideoObjectIndex, Item[gpItem.value.usItem].ubGraphicNum, xp, yp, Get16BPPColor(FROMRGB(0, 140, 170)), TRUE);

  // Display the item name above it
  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_YELLOW);
  SetFontShadow(FONT_NEARBLACK);
  if (gpItem.value.usItem == Enum225.ACTION_ITEM || gpItem.value.usItem == Enum225.SWITCH) {
    BuildTriggerName(gpItem, szItemName);
  } else if (Item[gpItem.value.usItem].usItemClass == IC_KEY) {
    swprintf(szItemName, "%S", LockTable[gpItem.value.ubKeyID].ubEditorName);
  } else {
    LoadItemInfo(gpItem.value.usItem, szItemName, null);
  }
  xp = sScreenX - (StringPixLength(szItemName, FONT10ARIAL()) - 40) / 2;
  yp -= 10;
  mprintf(xp, yp, szItemName);

  if (gpItem.value.usItem == Enum225.ACTION_ITEM) {
    let pStr: Pointer<UINT16>;
    pStr = GetActionItemName(gpItem);
    xp = sScreenX - (StringPixLength(pStr, FONT10ARIALBOLD()) - 40) / 2;
    yp += 10;
    SetFont(FONT10ARIALBOLD());
    SetFontForeground(FONT_LTKHAKI);
    mprintf(xp, yp, pStr);
    SetFontForeground(FONT_YELLOW);
  }

  // Count the number of items in the current pool, and display that.
  i = 0;
  GetItemPool(gsItemGridNo, addressof(pItemPool), 0);
  Assert(pItemPool);
  while (pItemPool) {
    i++;
    pItemPool = pItemPool.value.pNext;
  }
  xp = sScreenX;
  yp = sScreenY + 10;
  mprintf(xp, yp, "%d", i);

  // If the item is hidden, render a blinking H (just like DG)
  if (gWorldItems[gpItemPool.value.iItemIndex].bVisible == HIDDEN_ITEM || gWorldItems[gpItemPool.value.iItemIndex].bVisible == BURIED) {
    SetFont(FONT10ARIALBOLD());
    if (GetJA2Clock() % 1000 > 500) {
      SetFontForeground(249);
    }
    mprintf(sScreenX + 16, sScreenY + 7, "H");
    InvalidateRegion(sScreenX + 16, sScreenY + 7, sScreenX + 24, sScreenY + 27);
  }
}

function RenderEditorInfo(): void {
  let FPSText: wchar_t[] /* [50] */;
  /* static */ let iSpewWarning: INT32 = 0;
  let iMapIndex: INT16;

  SetFont(FONT12POINT1());
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  // Display the mapindex position
  if (GetMouseMapPos(addressof(iMapIndex)))
    swprintf(FPSText, "   (%d)   ", iMapIndex);
  else
    swprintf(FPSText, "          ");
  mprintfEditor((50 - StringPixLength(FPSText, FONT12POINT1()) / 2), 463, FPSText);

  switch (iCurrentTaskbar) {
    case Enum36.TASK_OPTIONS:
      if (!gfWorldLoaded || giCurrentTilesetID < 0)
        mprintf(260, 445, "No map currently loaded.");
      else
        mprintf(260, 445, "File:  %S, Current Tileset:  %s", gubFilename, gTilesets[giCurrentTilesetID].zName);
      break;
    case Enum36.TASK_TERRAIN:
      if (gusSelectionType == Enum33.LINESELECTION)
        swprintf(wszSelType[Enum33.LINESELECTION], "Width: %d", gusSelectionWidth);
      DrawEditorInfoBox(wszSelType[gusSelectionType], FONT12POINT1(), 220, 430, 60, 30);
      swprintf(FPSText, "%d%%", gusSelectionDensity);
      DrawEditorInfoBox(FPSText, FONT12POINT1(), 310, 430, 40, 30);
      break;
    case Enum36.TASK_ITEMS:
      RenderEditorItemsInfo();
      UpdateItemStatsPanel();
      break;
    case Enum36.TASK_BUILDINGS:
      UpdateBuildingsInfo();
      if (gusSelectionType == Enum33.LINESELECTION)
        swprintf(wszSelType[Enum33.LINESELECTION], "Width: %d", gusSelectionWidth);
      DrawEditorInfoBox(wszSelType[gusSelectionType], FONT12POINT1(), 530, 430, 60, 30);
      break;
    case Enum36.TASK_MERCS:
      UpdateMercsInfo();
      break;
    case Enum36.TASK_MAPINFO:
      UpdateMapInfo();
      if (gusSelectionType == Enum33.LINESELECTION)
        swprintf(wszSelType[Enum33.LINESELECTION], "Width: %d", gusSelectionWidth);
      DrawEditorInfoBox(wszSelType[gusSelectionType], FONT12POINT1(), 440, 430, 60, 30);
      break;
  }
}

function ProcessEditorRendering(): void {
  let fSaveBuffer: BOOLEAN = FALSE;
  if (gfRenderTaskbar) // do a full taskbar render.
  {
    ClearTaskbarRegion(0, 360, 640, 480);
    RenderTerrainTileButtons();
    MarkButtonsDirty();
    gfRenderTaskbar = FALSE;
    fSaveBuffer = TRUE;
    gfRenderDrawingMode = TRUE;
    gfRenderHilights = FALSE;
    gfRenderMercInfo = TRUE;
  }
  if (gfRenderDrawingMode) {
    if (iCurrentTaskbar == Enum36.TASK_BUILDINGS || iCurrentTaskbar == Enum36.TASK_TERRAIN || iCurrentTaskbar == Enum36.TASK_ITEMS) {
      ShowCurrentDrawingMode();
      gfRenderDrawingMode = FALSE;
    }
  }
  // render dynamically changed buttons only
  RenderButtons();

  if (gfSummaryWindowActive)
    RenderSummaryWindow();
  else if (!gfGotoGridNoUI && !InOverheadMap())
    RenderMercStrings();

  if (gfEditingDoor)
    RenderDoorEditingWindow();

  if (TextInputMode())
    RenderAllTextFields();
  RenderEditorInfo();

  if (!gfSummaryWindowActive && !gfGotoGridNoUI && !InOverheadMap()) {
    if (gpItem && gsItemGridNo != -1)
      RenderSelectedItemBlownUp();
    if (iCurrentTaskbar == Enum36.TASK_MAPINFO)
      RenderMapEntryPointsAndLights();
    if (iDrawMode == Enum38.DRAW_MODE_PLACE_ITEM && eInfo.uiItemType == Enum35.TBAR_MODE_ITEM_KEYS || iDrawMode == Enum38.DRAW_MODE_DOORKEYS)
      RenderDoorLockInfo();
  }

  if (fSaveBuffer)
    BlitBufferToBuffer(FRAME_BUFFER, guiSAVEBUFFER, 0, 360, 640, 120);

  // Make sure this is TRUE at all times.
  // It is set to false when before we save the buffer, so the buttons don't get
  // rendered with hilites, in case the mouse is over one.
  gfRenderHilights = TRUE;

  RenderButtonsFastHelp();
}
