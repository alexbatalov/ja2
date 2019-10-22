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
    case BASE_TERRAIN_TILE_REGION_ID:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      MSYS_EnableRegion(&TerrainTileButtonRegion[bRegionID]);
      break;
    case ITEM_REGION_ID:
      MSYS_EnableRegion(&ItemsRegion);
      break;
    case MERC_REGION_ID:
      MSYS_EnableRegion(&MercRegion);
      break;
  }
}

function DisableEditorRegion(bRegionID: INT8): void {
  switch (bRegionID) {
    case BASE_TERRAIN_TILE_REGION_ID:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      MSYS_DisableRegion(&TerrainTileButtonRegion[bRegionID]);
      break;
    case ITEM_REGION_ID:
      MSYS_DisableRegion(&ItemsRegion);
      break;
    case MERC_REGION_ID:
      MSYS_DisableRegion(&MercRegion);
      break;
  }
}

function RemoveEditorRegions(): void {
  let x: INT32;
  MSYS_RemoveRegion(&EditorRegion);
  for (x = BASE_TERRAIN_TILE_REGION_ID; x < NUM_TERRAIN_TILE_REGIONS; x++) {
    MSYS_RemoveRegion(&TerrainTileButtonRegion[x]);
  }
  MSYS_RemoveRegion(&ItemsRegion);
  MSYS_RemoveRegion(&MercRegion);
}

function InitEditorRegions(): void {
  let x: INT32;

  // By doing this, all of the buttons underneath are blanketed and can't be used anymore.
  // Any new buttons will cover this up as well.  Think of it as a barrier between the editor buttons,
  // and the game's interface panel buttons and regions.
  MSYS_DefineRegion(&EditorRegion, 0, 360, 640, 480, MSYS_PRIORITY_NORMAL, 0, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);

  // Create the regions for the terrain tile selections
  for (x = 0; x < NUM_TERRAIN_TILE_REGIONS; x++) {
    MSYS_DefineRegion(&TerrainTileButtonRegion[x], (261 + x * 42), 369, (303 + x * 42), 391, MSYS_PRIORITY_NORMAL, 0, MSYS_NO_CALLBACK, TerrainTileButtonRegionCallback);
    MSYS_SetRegionUserData(&TerrainTileButtonRegion[x], 0, x);
    MSYS_DisableRegion(&TerrainTileButtonRegion[x]);
  }
  gfShowTerrainTileButtons = FALSE;

  // Create the region for the items selection window.
  MSYS_DefineRegion(&ItemsRegion, 100, 360, 540, 440, MSYS_PRIORITY_NORMAL, 0, MouseMovedInItemsRegion, MouseClickedInItemsRegion);
  MSYS_DisableRegion(&ItemsRegion);

  // Create the region for the merc inventory panel.
  MSYS_DefineRegion(&MercRegion, 175, 361, 450, 460, MSYS_PRIORITY_NORMAL, 0, MouseMovedInMercRegion, MouseClickedInMercRegion);
  MSYS_DisableRegion(&MercRegion);
}

function LoadEditorImages(): void {
  let VObjectDesc: VOBJECT_DESC;

  // Set up the merc inventory panel
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  sprintf(VObjectDesc.ImageFile, "EDITOR\\InvPanel.sti");
  if (!AddVideoObject(&VObjectDesc, &guiMercInventoryPanel))
    AssertMsg(0, "Failed to load data\\editor\\InvPanel.sti");
  // Set up small omerta map
  sprintf(VObjectDesc.ImageFile, "EDITOR\\omerta.sti");
  if (!AddVideoObject(&VObjectDesc, &guiOmertaMap))
    AssertMsg(0, "Failed to load data\\editor\\omerta.sti");
  // Set up the merc directional buttons.
  giEditMercDirectionIcons[0] = LoadGenericButtonIcon("EDITOR//arrowsoff.sti");
  giEditMercDirectionIcons[1] = LoadGenericButtonIcon("EDITOR//arrowson.sti");

  giEditMercImage[0] = LoadButtonImage("EDITOR\\leftarrow.sti", 0, 1, 2, 3, 4);
  giEditMercImage[1] = LoadButtonImage("EDITOR\\rightarrow.sti", 0, 1, 2, 3, 4);

  sprintf(VObjectDesc.ImageFile, "EDITOR\\Exclamation.sti");
  if (!AddVideoObject(&VObjectDesc, &guiExclamation))
    AssertMsg(0, "Failed to load data\\editor\\Exclamation.sti");
  sprintf(VObjectDesc.ImageFile, "EDITOR\\KeyImage.sti");
  if (!AddVideoObject(&VObjectDesc, &guiKeyImage))
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
  GetCurrentVideoSettings(&usUselessWidth, &usUselessHeight, &ubBitDepth);
  vs_desc.fCreateFlags = VSURFACE_CREATE_DEFAULT | VSURFACE_SYSTEM_MEM_USAGE;
  vs_desc.usWidth = 60;
  vs_desc.usHeight = 25;
  vs_desc.ubBitDepth = ubBitDepth;
  if (!AddVideoSurface(&vs_desc, &guiMercTempBuffer))
    AssertMsg(0, "Failed to allocate memory for merc tempitem buffer.");

  // create the nine buffers for the merc's inventory slots.
  vs_desc.usHeight = MERCINV_SLOT_HEIGHT;
  for (i = 0; i < 9; i++) {
    vs_desc.usWidth = i < 3 ? MERCINV_SMSLOT_WIDTH : MERCINV_LGSLOT_WIDTH;
    if (!AddVideoSurface(&vs_desc, &guiMercInvPanelBuffers[i]))
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
    case TASK_TERRAIN:
      ShowEditorButtons(FIRST_TERRAIN_BUTTON, LAST_TERRAIN_BUTTON);
      break;
    case TASK_BUILDINGS:
      ShowEditorButtons(FIRST_BUILDINGS_BUTTON, LAST_BUILDINGS_BUTTON);
      break;
    case TASK_ITEMS:
      ShowEditorButtons(FIRST_ITEMS_BUTTON, LAST_ITEMS_BUTTON);
      break;
    case TASK_MERCS:
      ShowEditorButtons(FIRST_MERCS_TEAMMODE_BUTTON, LAST_MERCS_TEAMMODE_BUTTON);
      break;
    case TASK_MAPINFO:
      ShowEditorButtons(FIRST_MAPINFO_BUTTON, LAST_MAPINFO_BUTTON);
      break;
    case TASK_OPTIONS:
      ShowEditorButtons(FIRST_OPTIONS_BUTTON, LAST_OPTIONS_BUTTON);
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
    case TASK_TERRAIN:
      iStart = FIRST_TERRAIN_BUTTON;
      iEnd = LAST_TERRAIN_BUTTON;
      break;
    case TASK_BUILDINGS:
      iStart = FIRST_BUILDINGS_BUTTON;
      iEnd = LAST_BUILDINGS_BUTTON;
      break;
    case TASK_ITEMS:
      iStart = FIRST_ITEMS_BUTTON;
      iEnd = LAST_ITEMS_BUTTON;
      break;
    case TASK_MERCS:
      iStart = FIRST_MERCS_BUTTON;
      iEnd = LAST_MERCS_BUTTON;
      break;
    case TASK_MAPINFO:
      iStart = FIRST_MAPINFO_BUTTON;
      iEnd = LAST_MAPINFO_BUTTON;
      break;
    case TASK_OPTIONS:
      iStart = FIRST_OPTIONS_BUTTON;
      iEnd = LAST_OPTIONS_BUTTON;
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

  for (x = 0; x < NUMBER_EDITOR_BUTTONS; x++)
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
    case TASK_TERRAIN:
      UnclickEditorButton(TAB_TERRAIN);
      HideTerrainTileButtons();
      break;
    case TASK_BUILDINGS:
      UnclickEditorButton(TAB_BUILDINGS);
      KillTextInputMode();
      break;
    case TASK_ITEMS:
      UnclickEditorButton(TAB_ITEMS);
      HideItemStatsPanel();
      if (eInfo.fActive)
        ClearEditorItemsInfo();
      gfShowPits = FALSE;
      RemoveAllPits();
      break;
    case TASK_MERCS:
      UnclickEditorButton(TAB_MERCS);
      IndicateSelectedMerc(SELECT_NO_MERC);
      SetMercEditingMode(MERC_NOMODE);
      break;
    case TASK_MAPINFO:
      UnclickEditorButton(TAB_MAPINFO);
      ExtractAndUpdateMapInfo();
      KillTextInputMode();
      HideExitGrids();
      break;
    case TASK_OPTIONS:
      UnclickEditorButton(TAB_OPTIONS);
      break;
  }

  // Setup the new tab mode
  iCurrentTaskbar = iTaskMode;
  ShowEditorToolbar(iTaskMode);
  iTaskMode = TASK_NONE;

  // Special code when entering a new editor tab
  switch (iCurrentTaskbar) {
    case TASK_MERCS:
      ClickEditorButton(TAB_MERCS);
      ClickEditorButton(MERCS_ENEMY);
      iDrawMode = DRAW_MODE_ENEMY;
      SetMercEditingMode(MERC_TEAMMODE);
      fBuildingShowRoofs = FALSE;
      UpdateRoofsView();
      break;
    case TASK_TERRAIN:
      ClickEditorButton(TAB_TERRAIN);
      ShowTerrainTileButtons();
      SetEditorTerrainTaskbarMode(TERRAIN_FGROUND_TEXTURES);
      break;
    case TASK_BUILDINGS:
      ClickEditorButton(TAB_BUILDINGS);
      if (fBuildingShowRoofs)
        ClickEditorButton(BUILDING_TOGGLE_ROOF_VIEW);
      if (fBuildingShowWalls)
        ClickEditorButton(BUILDING_TOGGLE_WALL_VIEW);
      if (fBuildingShowRoomInfo)
        ClickEditorButton(BUILDING_TOGGLE_INFO_VIEW);
      if (gfCaves) {
        ClickEditorButton(BUILDING_CAVE_DRAWING);
        iDrawMode = DRAW_MODE_CAVES;
      } else {
        ClickEditorButton(BUILDING_NEW_ROOM);
        iDrawMode = DRAW_MODE_ROOM;
      }
      TerrainTileDrawMode = TERRAIN_TILES_BRETS_STRANGEMODE;
      SetEditorSmoothingMode(gMapInformation.ubEditorSmoothingType);
      gusSelectionType = gusSavedBuildingSelectionType;
      SetupTextInputForBuildings();
      break;
    case TASK_ITEMS:
      SetFont(FONT10ARIAL);
      SetFontForeground(FONT_YELLOW);
      ClickEditorButton(TAB_ITEMS);
      ClickEditorButton(ITEMS_WEAPONS + eInfo.uiItemType - TBAR_MODE_ITEM_WEAPONS);
      InitEditorItemsInfo(eInfo.uiItemType);
      ShowItemStatsPanel();
      gfShowPits = TRUE;
      AddAllPits();
      iDrawMode = DRAW_MODE_PLACE_ITEM;
      break;
    case TASK_MAPINFO:
      ClickEditorButton(TAB_MAPINFO);
      if (gfFakeLights)
        ClickEditorButton(MAPINFO_TOGGLE_FAKE_LIGHTS);
      ClickEditorButton(MAPINFO_ADD_LIGHT1_SOURCE);
      iDrawMode = DRAW_MODE_LIGHT;
      TerrainTileDrawMode = TERRAIN_TILES_BRETS_STRANGEMODE;
      SetupTextInputForMapInfo();
      break;
    case TASK_OPTIONS:
      ClickEditorButton(TAB_OPTIONS);
      TerrainTileDrawMode = TERRAIN_TILES_NODRAW;
      break;
  }
}

// Disables the task bar, but leaves it on screen. Used when a selection window is up.
function DisableEditorTaskbar(): void {
  let x: INT32;
  for (x = 0; x < NUMBER_EDITOR_BUTTONS; x++)
    DisableButton(iEditorButton[x]);
}

function EnableEditorTaskbar(): void {
  let x: INT32;

  for (x = 0; x < NUMBER_EDITOR_BUTTONS; x++)
    EnableButton(iEditorButton[x]);
  // Keep permanent buttons disabled.
  DisableButton(iEditorButton[MERCS_1]);
  DisableButton(iEditorButton[MAPINFO_LIGHT_PANEL]);
  DisableButton(iEditorButton[MAPINFO_RADIO_PANEL]);
  DisableButton(iEditorButton[ITEMSTATS_PANEL]);
  DisableButton(iEditorButton[MERCS_PLAYERTOGGLE]);
  DisableButton(iEditorButton[MERCS_PLAYER]);
  if (iCurrentTaskbar == TASK_ITEMS)
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

  Assert(pFontString != NULL);

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
  mprintf(x, y, L"%s", str);
  InvalidateRegion(x, y, x2, y2);
}

function ClickEditorButton(iEditorButtonID: INT32): void {
  let butn: Pointer<GUI_BUTTON>;
  if (iEditorButtonID < 0 || iEditorButtonID >= NUMBER_EDITOR_BUTTONS)
    return;
  if (iEditorButton[iEditorButtonID] != -1) {
    butn = ButtonList[iEditorButton[iEditorButtonID]];
    if (butn)
      butn->uiFlags |= BUTTON_CLICKED_ON;
  }
}

function UnclickEditorButton(iEditorButtonID: INT32): void {
  let butn: Pointer<GUI_BUTTON>;
  if (iEditorButtonID < 0 || iEditorButtonID >= NUMBER_EDITOR_BUTTONS)
    return;
  if (iEditorButton[iEditorButtonID] != -1) {
    butn = ButtonList[iEditorButton[iEditorButtonID]];
    if (butn)
      butn->uiFlags &= (~BUTTON_CLICKED_ON);
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
    b->uiFlags |= BUTTON_CLICKED_ON;
  }
}

function UnclickEditorButtons(iFirstEditorButtonID: INT32, iLastEditorButtonID: INT32): void {
  let i: INT32;
  let b: Pointer<GUI_BUTTON>;
  for (i = iFirstEditorButtonID; i <= iLastEditorButtonID; i++) {
    Assert(iEditorButton[i] != -1);
    b = ButtonList[iEditorButton[i]];
    Assert(b);
    b->uiFlags &= (~BUTTON_CLICKED_ON);
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
  SetFont(FONT10ARIAL);
  SetFontForeground(FONT_YELLOW);
  SetFontShadow(FONT_NEARBLACK);
  sGridNo = gMapInformation.sNorthGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, &sScreenX, &sScreenY);
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL, FONT_YELLOW, L"North Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sWestGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, &sScreenX, &sScreenY);
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL, FONT_YELLOW, L"West Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sEastGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, &sScreenX, &sScreenY);
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL, FONT_YELLOW, L"East Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sSouthGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, &sScreenX, &sScreenY);
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL, FONT_YELLOW, L"South Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sCenterGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, &sScreenX, &sScreenY);
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL, FONT_YELLOW, L"Center Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  sGridNo = gMapInformation.sIsolatedGridNo;
  if (sGridNo != -1) {
    GetGridNoScreenPos(sGridNo, 0, &sScreenX, &sScreenY);
    if (sScreenY >= -20 && sScreenY < 340 && sScreenX >= -40 && sScreenX < 640) {
      DisplayWrappedString(sScreenX, (sScreenY - 5), 40, 2, FONT10ARIAL, FONT_YELLOW, L"Isolated Entry Point", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    }
  }
  // Do the lights now.
  for (i = 0; i < MAX_LIGHT_SPRITES; i++) {
    if (LightSprites[i].uiFlags & LIGHT_SPR_ACTIVE) {
      sGridNo = LightSprites[i].iY * WORLD_COLS + LightSprites[i].iX;
      GetGridNoScreenPos(sGridNo, 0, &sScreenX, &sScreenY);
      if (sScreenY >= -50 && sScreenY < 300 && sScreenX >= -40 && sScreenX < 640) {
        if (LightSprites[i].uiFlags & LIGHT_PRIMETIME)
          DisplayWrappedString(sScreenX, (sScreenY - 5), 50, 2, FONT10ARIAL, FONT_ORANGE, L"Prime", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
        else if (LightSprites[i].uiFlags & LIGHT_NIGHTTIME)
          DisplayWrappedString(sScreenX, (sScreenY - 5), 50, 2, FONT10ARIAL, FONT_RED, L"Night", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
        else
          DisplayWrappedString(sScreenX, (sScreenY - 5), 50, 2, FONT10ARIAL, FONT_YELLOW, L"24Hour", FONT_BLACK, TRUE, CENTER_JUSTIFIED);
      }
    }
  }
}

function BuildTriggerName(pItem: Pointer<OBJECTTYPE>, szItemName: Pointer<UINT16>): void {
  if (pItem->usItem == SWITCH) {
    if (pItem->bFrequency == PANIC_FREQUENCY)
      swprintf(szItemName, L"Panic Trigger1");
    else if (pItem->bFrequency == PANIC_FREQUENCY_2)
      swprintf(szItemName, L"Panic Trigger2");
    else if (pItem->bFrequency == PANIC_FREQUENCY_3)
      swprintf(szItemName, L"Panic Trigger3");
    else
      swprintf(szItemName, L"Trigger%d", pItem->bFrequency - 50);
  } else {
    // action item
    if (pItem->bDetonatorType == BOMB_PRESSURE)
      swprintf(szItemName, L"Pressure Action");
    else if (pItem->bFrequency == PANIC_FREQUENCY)
      swprintf(szItemName, L"Panic Action1");
    else if (pItem->bFrequency == PANIC_FREQUENCY_2)
      swprintf(szItemName, L"Panic Action2");
    else if (pItem->bFrequency == PANIC_FREQUENCY_3)
      swprintf(szItemName, L"Panic Action3");
    else
      swprintf(szItemName, L"Action%d", pItem->bFrequency - 50);
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
    GetGridNoScreenPos(DoorTable[i].sGridNo, 0, &sScreenX, &sScreenY);
    if (sScreenY > 390)
      continue;
    if (DoorTable[i].ubLockID != 255)
      swprintf(str, L"%S", LockTable[DoorTable[i].ubLockID].ubEditorName);
    else
      swprintf(str, L"No Lock ID");
    xp = sScreenX - 10;
    yp = sScreenY - 40;
    DisplayWrappedString(xp, yp, 60, 2, FONT10ARIAL, FONT_LTKHAKI, str, FONT_BLACK, TRUE, CENTER_JUSTIFIED);
    if (DoorTable[i].ubTrapID) {
      SetFont(FONT10ARIAL);
      SetFontForeground(FONT_RED);
      SetFontShadow(FONT_NEARBLACK);
      switch (DoorTable[i].ubTrapID) {
        case EXPLOSION:
          swprintf(str, L"Explosion Trap");
          break;
        case ELECTRIC:
          swprintf(str, L"Electric Trap");
          break;
        case SIREN:
          swprintf(str, L"Siren Trap");
          break;
        case SILENT_ALARM:
          swprintf(str, L"Silent Alarm");
          break;
        case SUPER_ELECTRIC:
          swprintf(str, L"Super Electric Trap");
          break;
      }
      xp = sScreenX + 20 - StringPixLength(str, FONT10ARIAL) / 2;
      yp = sScreenY;
      mprintf(xp, yp, str);
      swprintf(str, L"Trap Level %d", DoorTable[i].ubTrapLevel);
      xp = sScreenX + 20 - StringPixLength(str, FONT10ARIAL) / 2;
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

  GetGridNoScreenPos(gsItemGridNo, 0, &sScreenX, &sScreenY);

  if (sScreenY > 340)
    return;

  // Display the enlarged item graphic
  uiVideoObjectIndex = GetInterfaceGraphicForItem(&Item[gpItem->usItem]);
  GetVideoObject(&hVObject, uiVideoObjectIndex);

  sWidth = hVObject->pETRLEObject[Item[gpItem->usItem].ubGraphicNum].usWidth;
  sOffsetX = hVObject->pETRLEObject[Item[gpItem->usItem].ubGraphicNum].sOffsetX;
  xp = sScreenX + (40 - sWidth - sOffsetX * 2) / 2;

  sHeight = hVObject->pETRLEObject[Item[gpItem->usItem].ubGraphicNum].usHeight;
  sOffsetY = hVObject->pETRLEObject[Item[gpItem->usItem].ubGraphicNum].sOffsetY;
  yp = sScreenY + (20 - sHeight - sOffsetY * 2) / 2;

  BltVideoObjectOutlineFromIndex(FRAME_BUFFER, uiVideoObjectIndex, Item[gpItem->usItem].ubGraphicNum, xp, yp, Get16BPPColor(FROMRGB(0, 140, 170)), TRUE);

  // Display the item name above it
  SetFont(FONT10ARIAL);
  SetFontForeground(FONT_YELLOW);
  SetFontShadow(FONT_NEARBLACK);
  if (gpItem->usItem == ACTION_ITEM || gpItem->usItem == SWITCH) {
    BuildTriggerName(gpItem, szItemName);
  } else if (Item[gpItem->usItem].usItemClass == IC_KEY) {
    swprintf(szItemName, L"%S", LockTable[gpItem->ubKeyID].ubEditorName);
  } else {
    LoadItemInfo(gpItem->usItem, szItemName, NULL);
  }
  xp = sScreenX - (StringPixLength(szItemName, FONT10ARIAL) - 40) / 2;
  yp -= 10;
  mprintf(xp, yp, szItemName);

  if (gpItem->usItem == ACTION_ITEM) {
    let pStr: Pointer<UINT16>;
    pStr = GetActionItemName(gpItem);
    xp = sScreenX - (StringPixLength(pStr, FONT10ARIALBOLD) - 40) / 2;
    yp += 10;
    SetFont(FONT10ARIALBOLD);
    SetFontForeground(FONT_LTKHAKI);
    mprintf(xp, yp, pStr);
    SetFontForeground(FONT_YELLOW);
  }

  // Count the number of items in the current pool, and display that.
  i = 0;
  GetItemPool(gsItemGridNo, &pItemPool, 0);
  Assert(pItemPool);
  while (pItemPool) {
    i++;
    pItemPool = pItemPool->pNext;
  }
  xp = sScreenX;
  yp = sScreenY + 10;
  mprintf(xp, yp, L"%d", i);

  // If the item is hidden, render a blinking H (just like DG)
  if (gWorldItems[gpItemPool->iItemIndex].bVisible == HIDDEN_ITEM || gWorldItems[gpItemPool->iItemIndex].bVisible == BURIED) {
    SetFont(FONT10ARIALBOLD);
    if (GetJA2Clock() % 1000 > 500) {
      SetFontForeground(249);
    }
    mprintf(sScreenX + 16, sScreenY + 7, L"H");
    InvalidateRegion(sScreenX + 16, sScreenY + 7, sScreenX + 24, sScreenY + 27);
  }
}

function RenderEditorInfo(): void {
  let FPSText: wchar_t[] /* [50] */;
  /* static */ let iSpewWarning: INT32 = 0;
  let iMapIndex: INT16;

  SetFont(FONT12POINT1);
  SetFontForeground(FONT_BLACK);
  SetFontBackground(FONT_BLACK);

  // Display the mapindex position
  if (GetMouseMapPos(&iMapIndex))
    swprintf(FPSText, L"   (%d)   ", iMapIndex);
  else
    swprintf(FPSText, L"          ");
  mprintfEditor((50 - StringPixLength(FPSText, FONT12POINT1) / 2), 463, FPSText);

  switch (iCurrentTaskbar) {
    case TASK_OPTIONS:
      if (!gfWorldLoaded || giCurrentTilesetID < 0)
        mprintf(260, 445, L"No map currently loaded.");
      else
        mprintf(260, 445, L"File:  %S, Current Tileset:  %s", gubFilename, gTilesets[giCurrentTilesetID].zName);
      break;
    case TASK_TERRAIN:
      if (gusSelectionType == LINESELECTION)
        swprintf(wszSelType[LINESELECTION], L"Width: %d", gusSelectionWidth);
      DrawEditorInfoBox(wszSelType[gusSelectionType], FONT12POINT1, 220, 430, 60, 30);
      swprintf(FPSText, L"%d%%", gusSelectionDensity);
      DrawEditorInfoBox(FPSText, FONT12POINT1, 310, 430, 40, 30);
      break;
    case TASK_ITEMS:
      RenderEditorItemsInfo();
      UpdateItemStatsPanel();
      break;
    case TASK_BUILDINGS:
      UpdateBuildingsInfo();
      if (gusSelectionType == LINESELECTION)
        swprintf(wszSelType[LINESELECTION], L"Width: %d", gusSelectionWidth);
      DrawEditorInfoBox(wszSelType[gusSelectionType], FONT12POINT1, 530, 430, 60, 30);
      break;
    case TASK_MERCS:
      UpdateMercsInfo();
      break;
    case TASK_MAPINFO:
      UpdateMapInfo();
      if (gusSelectionType == LINESELECTION)
        swprintf(wszSelType[LINESELECTION], L"Width: %d", gusSelectionWidth);
      DrawEditorInfoBox(wszSelType[gusSelectionType], FONT12POINT1, 440, 430, 60, 30);
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
    if (iCurrentTaskbar == TASK_BUILDINGS || iCurrentTaskbar == TASK_TERRAIN || iCurrentTaskbar == TASK_ITEMS) {
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
    if (iCurrentTaskbar == TASK_MAPINFO)
      RenderMapEntryPointsAndLights();
    if (iDrawMode == DRAW_MODE_PLACE_ITEM && eInfo.uiItemType == TBAR_MODE_ITEM_KEYS || iDrawMode == DRAW_MODE_DOORKEYS)
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
