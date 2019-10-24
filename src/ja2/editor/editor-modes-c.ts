let gfShowExitGrids: BOOLEAN = FALSE;

function SetEditorItemsTaskbarMode(usNewMode: UINT16): void {
  UnclickEditorButtons(Enum32.ITEMS_WEAPONS, Enum32.ITEMS_KEYS);
  switch (usNewMode) {
    case Enum32.ITEMS_WEAPONS:
      ClickEditorButton(Enum32.ITEMS_WEAPONS);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_WEAPONS;
      break;
    case Enum32.ITEMS_AMMO:
      ClickEditorButton(Enum32.ITEMS_AMMO);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_AMMO;
      break;
    case Enum32.ITEMS_ARMOUR:
      ClickEditorButton(Enum32.ITEMS_ARMOUR);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_ARMOUR;
      break;
    case Enum32.ITEMS_EXPLOSIVES:
      ClickEditorButton(Enum32.ITEMS_EXPLOSIVES);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_EXPLOSIVES;
      break;
    case Enum32.ITEMS_EQUIPMENT1:
      ClickEditorButton(Enum32.ITEMS_EQUIPMENT1);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_EQUIPMENT1;
      break;
    case Enum32.ITEMS_EQUIPMENT2:
      ClickEditorButton(Enum32.ITEMS_EQUIPMENT2);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_EQUIPMENT2;
      break;
    case Enum32.ITEMS_EQUIPMENT3:
      ClickEditorButton(Enum32.ITEMS_EQUIPMENT3);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_EQUIPMENT3;
      break;
    case Enum32.ITEMS_TRIGGERS:
      ClickEditorButton(Enum32.ITEMS_TRIGGERS);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_TRIGGERS;
      break;
    case Enum32.ITEMS_KEYS:
      ClickEditorButton(Enum32.ITEMS_KEYS);
      iEditorToolbarState = Enum35.TBAR_MODE_ITEM_KEYS;
      break;
  }
}

const NO_EFFECT = 2;

function SetEditorBuildingTaskbarMode(usNewMode: UINT16): void {
  let fNewGroup: BOOLEAN = FALSE;
  let fNewRoofs: BOOLEAN;
  let fNewWalls: BOOLEAN;
  let fNewRoomInfo: BOOLEAN;
  if (usNewMode == usCurrentMode) {
    ClickEditorButton(usNewMode);
    return;
  }
  usCurrentMode = usNewMode;
  // Unclick all of the building section buttons first -- except the view modes.
  UnclickEditorButton(Enum32.BUILDING_PLACE_WALLS);
  UnclickEditorButton(Enum32.BUILDING_PLACE_DOORS);
  UnclickEditorButton(Enum32.BUILDING_PLACE_WINDOWS);
  UnclickEditorButton(Enum32.BUILDING_PLACE_ROOFS);
  UnclickEditorButton(Enum32.BUILDING_PLACE_BROKEN_WALLS);
  UnclickEditorButton(Enum32.BUILDING_PLACE_FURNITURE);
  UnclickEditorButton(Enum32.BUILDING_PLACE_DECALS);
  UnclickEditorButton(Enum32.BUILDING_PLACE_FLOORS);
  UnclickEditorButton(Enum32.BUILDING_PLACE_TOILETS);
  UnclickEditorButton(Enum32.BUILDING_SMART_WALLS);
  UnclickEditorButton(Enum32.BUILDING_SMART_DOORS);
  UnclickEditorButton(Enum32.BUILDING_SMART_WINDOWS);
  UnclickEditorButton(Enum32.BUILDING_SMART_BROKEN_WALLS);
  UnclickEditorButton(Enum32.BUILDING_DOORKEY);
  UnclickEditorButton(Enum32.BUILDING_NEW_ROOM);
  UnclickEditorButton(Enum32.BUILDING_NEW_ROOF);
  UnclickEditorButton(Enum32.BUILDING_CAVE_DRAWING);
  UnclickEditorButton(Enum32.BUILDING_SAW_ROOM);
  UnclickEditorButton(Enum32.BUILDING_KILL_BUILDING);
  UnclickEditorButton(Enum32.BUILDING_COPY_BUILDING);
  UnclickEditorButton(Enum32.BUILDING_MOVE_BUILDING);
  UnclickEditorButton(Enum32.BUILDING_DRAW_ROOMNUM);
  ClickEditorButton(usNewMode);

  gfRenderDrawingMode = TRUE;

  // Clicking on certain buttons will automatically activate/deactive certain views.
  switch (usNewMode) {
    case Enum32.BUILDING_KILL_BUILDING: // Show everything
      fNewWalls = TRUE;
      fNewRoofs = TRUE;
      fNewRoomInfo = TRUE;
      break;
    case Enum32.BUILDING_NEW_ROOF:
    case Enum32.BUILDING_PLACE_ROOFS:
      fNewWalls = TRUE;
      fNewRoofs = TRUE;
      fNewRoomInfo = FALSE;
      break;
    case Enum32.BUILDING_DRAW_ROOMNUM: // Show room info
    case Enum32.BUILDING_ERASE_ROOMNUM: // Show room info
      fNewWalls = NO_EFFECT;
      fNewRoofs = gfBasement ? TRUE : FALSE;
      fNewRoomInfo = TRUE;
      break;
    case Enum32.BUILDING_PLACE_DOORS:
    case Enum32.BUILDING_PLACE_WINDOWS:
    case Enum32.BUILDING_PLACE_WALLS:
    case Enum32.BUILDING_PLACE_BROKEN_WALLS:
    case Enum32.BUILDING_PLACE_FLOORS:
    case Enum32.BUILDING_PLACE_TOILETS:
    case Enum32.BUILDING_PLACE_FURNITURE:
    case Enum32.BUILDING_PLACE_DECALS:
    case Enum32.BUILDING_SMART_WALLS:
    case Enum32.BUILDING_SMART_DOORS:
    case Enum32.BUILDING_SMART_WINDOWS:
    case Enum32.BUILDING_SMART_BROKEN_WALLS:
    case Enum32.BUILDING_DOORKEY:
    case Enum32.BUILDING_SAW_ROOM:
    case Enum32.BUILDING_NEW_ROOM:
    case Enum32.BUILDING_COPY_BUILDING:
    case Enum32.BUILDING_MOVE_BUILDING:
    case Enum32.BUILDING_CAVE_DRAWING:
      fNewRoofs = gfBasement ? TRUE : FALSE;
      fNewWalls = TRUE;
      fNewRoomInfo = FALSE;
      if (usNewMode == Enum32.BUILDING_PLACE_FLOORS)
        gusSelectionType = gusSavedSelectionType;
      break;
    default:
      return;
  }
  UnclickEditorButton(Enum32.BUILDING_TOGGLE_INFO_VIEW);
  if (fNewWalls != NO_EFFECT && fNewWalls != fBuildingShowWalls) {
    if (fNewWalls)
      ClickEditorButton(Enum32.BUILDING_TOGGLE_WALL_VIEW);
    else
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_WALL_VIEW);
    fBuildingShowWalls = fNewWalls;
    UpdateWallsView();
  }
  if (fNewRoofs != NO_EFFECT && fNewRoofs != fBuildingShowRoofs) {
    if (fNewRoofs)
      ClickEditorButton(Enum32.BUILDING_TOGGLE_ROOF_VIEW);
    else
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_ROOF_VIEW);
    fBuildingShowRoofs = fNewRoofs;
    UpdateRoofsView();
  }
  if (fNewRoomInfo != NO_EFFECT && fNewRoomInfo != fBuildingShowRoomInfo) {
    if (fNewRoomInfo)
      ClickEditorButton(Enum32.BUILDING_TOGGLE_INFO_VIEW);
    else
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_INFO_VIEW);
    fBuildingShowRoomInfo = fNewRoomInfo;
    gfRenderWorld = TRUE;
  }
}

function SetEditorTerrainTaskbarMode(usNewMode: UINT16): void {
  UnclickEditorButton(Enum32.TERRAIN_FGROUND_TEXTURES);
  UnclickEditorButton(Enum32.TERRAIN_BGROUND_TEXTURES);
  UnclickEditorButton(Enum32.TERRAIN_PLACE_CLIFFS);
  UnclickEditorButton(Enum32.TERRAIN_PLACE_DEBRIS);
  UnclickEditorButton(Enum32.TERRAIN_PLACE_TREES);
  UnclickEditorButton(Enum32.TERRAIN_PLACE_ROCKS);
  UnclickEditorButton(Enum32.TERRAIN_PLACE_MISC);
  UnclickEditorButton(Enum32.TERRAIN_FILL_AREA);
  TerrainTileDrawMode = 0;

  gfRenderDrawingMode = TRUE;

  switch (usNewMode) {
    case Enum32.TERRAIN_FGROUND_TEXTURES:
      TerrainTileDrawMode = TERRAIN_TILES_FOREGROUND;
      ClickEditorButton(Enum32.TERRAIN_FGROUND_TEXTURES);
      iDrawMode = Enum38.DRAW_MODE_GROUND;
      gusSelectionType = gusSavedSelectionType;
      break;
    case Enum32.TERRAIN_BGROUND_TEXTURES:
      TerrainTileDrawMode = TERRAIN_TILES_BACKGROUND;
      ClickEditorButton(Enum32.TERRAIN_BGROUND_TEXTURES);
      iDrawMode = Enum38.DRAW_MODE_NEW_GROUND;
      break;
    case Enum32.TERRAIN_PLACE_CLIFFS:
      ClickEditorButton(Enum32.TERRAIN_PLACE_CLIFFS);
      iDrawMode = Enum38.DRAW_MODE_BANKS;
      break;
    case Enum32.TERRAIN_PLACE_ROADS:
      ClickEditorButton(Enum32.TERRAIN_PLACE_ROADS);
      iDrawMode = Enum38.DRAW_MODE_ROADS;
      break;
    case Enum32.TERRAIN_PLACE_DEBRIS:
      ClickEditorButton(Enum32.TERRAIN_PLACE_DEBRIS);
      iDrawMode = Enum38.DRAW_MODE_DEBRIS;
      gusSelectionType = gusSavedSelectionType;
      break;
    case Enum32.TERRAIN_PLACE_TREES:
      ClickEditorButton(Enum32.TERRAIN_PLACE_TREES);
      iDrawMode = Enum38.DRAW_MODE_OSTRUCTS;
      gusSelectionType = gusSavedSelectionType;
      break;
    case Enum32.TERRAIN_PLACE_ROCKS:
      ClickEditorButton(Enum32.TERRAIN_PLACE_ROCKS);
      iDrawMode = Enum38.DRAW_MODE_OSTRUCTS1;
      gusSelectionType = gusSavedSelectionType;
      break;
    case Enum32.TERRAIN_PLACE_MISC:
      ClickEditorButton(Enum32.TERRAIN_PLACE_MISC);
      iDrawMode = Enum38.DRAW_MODE_OSTRUCTS2;
      gusSelectionType = gusSavedSelectionType;
      break;
    case Enum32.TERRAIN_FILL_AREA:
      ClickEditorButton(Enum32.TERRAIN_FILL_AREA);
      iDrawMode = Enum38.DRAW_MODE_FILL_AREA + Enum38.DRAW_MODE_GROUND;
      TerrainTileDrawMode = 1;
      break;
  }
}

function ShowExitGrids(): void {
  let i: UINT16;
  let pLevelNode: Pointer<LEVELNODE>;
  if (gfShowExitGrids)
    return;
  gfShowExitGrids = TRUE;
  for (i = 0; i < WORLD_MAX; i++) {
    if (GetExitGridLevelNode(i, addressof(pLevelNode))) {
      AddTopmostToTail(i, Enum312.FIRSTPOINTERS8);
    }
  }
}

function HideExitGrids(): void {
  let i: UINT16;
  let pLevelNode: Pointer<LEVELNODE>;
  if (!gfShowExitGrids)
    return;
  gfShowExitGrids = FALSE;
  for (i = 0; i < WORLD_MAX; i++) {
    if (GetExitGridLevelNode(i, addressof(pLevelNode))) {
      pLevelNode = gpWorldLevelData[i].pTopmostHead;
      while (pLevelNode) {
        if (pLevelNode.value.usIndex == Enum312.FIRSTPOINTERS8) {
          RemoveTopmost(i, pLevelNode.value.usIndex);
          break;
        }
        pLevelNode = pLevelNode.value.pNext;
      }
    }
  }
}

function SetEditorMapInfoTaskbarMode(usNewMode: UINT16): void {
  let fShowExitGrids: BOOLEAN = FALSE;
  UnclickEditorButton(Enum32.MAPINFO_ADD_LIGHT1_SOURCE);
  UnclickEditorButton(Enum32.MAPINFO_DRAW_EXITGRIDS);
  UnclickEditorButton(Enum32.MAPINFO_NORTH_POINT);
  UnclickEditorButton(Enum32.MAPINFO_WEST_POINT);
  UnclickEditorButton(Enum32.MAPINFO_CENTER_POINT);
  UnclickEditorButton(Enum32.MAPINFO_EAST_POINT);
  UnclickEditorButton(Enum32.MAPINFO_SOUTH_POINT);
  UnclickEditorButton(Enum32.MAPINFO_ISOLATED_POINT);
  ClickEditorButton(usNewMode);
  switch (usNewMode) {
    case Enum32.MAPINFO_ADD_LIGHT1_SOURCE:
      iDrawMode = Enum38.DRAW_MODE_LIGHT;
      break;
    case Enum32.MAPINFO_DRAW_EXITGRIDS:
      iDrawMode = Enum38.DRAW_MODE_EXITGRID;
      gusSelectionType = gusSavedSelectionType;
      fShowExitGrids = TRUE;
      break;
    case Enum32.MAPINFO_NORTH_POINT:
      iDrawMode = Enum38.DRAW_MODE_NORTHPOINT;
      break;
    case Enum32.MAPINFO_WEST_POINT:
      iDrawMode = Enum38.DRAW_MODE_WESTPOINT;
      break;
    case Enum32.MAPINFO_EAST_POINT:
      iDrawMode = Enum38.DRAW_MODE_EASTPOINT;
      break;
    case Enum32.MAPINFO_SOUTH_POINT:
      iDrawMode = Enum38.DRAW_MODE_SOUTHPOINT;
      break;
    case Enum32.MAPINFO_CENTER_POINT:
      iDrawMode = Enum38.DRAW_MODE_CENTERPOINT;
      break;
    case Enum32.MAPINFO_ISOLATED_POINT:
      iDrawMode = Enum38.DRAW_MODE_ISOLATEDPOINT;
      break;
    case Enum32.MAPINFO_RADIO_NORMAL:
      SetEditorSmoothingMode(Enum231.SMOOTHING_NORMAL);
      gfRenderTaskbar = TRUE;
      break;
    case Enum32.MAPINFO_RADIO_BASEMENT:
      SetEditorSmoothingMode(Enum231.SMOOTHING_BASEMENT);
      gfRenderTaskbar = TRUE;
      break;
    case Enum32.MAPINFO_RADIO_CAVES:
      SetEditorSmoothingMode(Enum231.SMOOTHING_CAVES);
      gfRenderTaskbar = TRUE;
      break;
  }
  if (fShowExitGrids) {
    ShowExitGrids();
  } else {
    HideExitGrids();
  }
}

function SetEditorSmoothingMode(ubNewMode: UINT8): void {
  UnclickEditorButtons(Enum32.MAPINFO_RADIO_NORMAL, Enum32.MAPINFO_RADIO_CAVES);
  if (iCurrentTaskbar == Enum36.TASK_BUILDINGS)
    HideEditorButtons(Enum32.BUILDING_NEW_ROOM, Enum32.BUILDING_CAVE_DRAWING);
  gfBasement = FALSE;
  gfCaves = FALSE;
  gMapInformation.ubEditorSmoothingType = Enum231.SMOOTHING_NORMAL;
  switch (ubNewMode) {
    case Enum231.SMOOTHING_NORMAL:
      ClickEditorButton(Enum32.MAPINFO_RADIO_NORMAL);
      if (iCurrentTaskbar == Enum36.TASK_BUILDINGS)
        ShowEditorButtons(Enum32.BUILDING_NEW_ROOM, Enum32.BUILDING_MOVE_BUILDING);
      EnableEditorButtons(Enum32.BUILDING_SMART_WALLS, Enum32.BUILDING_SMART_BROKEN_WALLS);
      break;
    case Enum231.SMOOTHING_BASEMENT:
      gfBasement = TRUE;
      ClickEditorButton(Enum32.MAPINFO_RADIO_BASEMENT);
      if (iCurrentTaskbar == Enum36.TASK_BUILDINGS)
        ShowEditorButtons(Enum32.BUILDING_NEW_ROOM, Enum32.BUILDING_KILL_BUILDING);
      EnableEditorButtons(Enum32.BUILDING_SMART_WALLS, Enum32.BUILDING_SMART_BROKEN_WALLS);
      break;
    case Enum231.SMOOTHING_CAVES:
      gfCaves = TRUE;
      ClickEditorButton(Enum32.MAPINFO_RADIO_CAVES);
      if (iCurrentTaskbar == Enum36.TASK_BUILDINGS)
        ShowEditorButton(Enum32.BUILDING_CAVE_DRAWING);
      DisableEditorButtons(Enum32.BUILDING_SMART_WALLS, Enum32.BUILDING_SMART_BROKEN_WALLS);
      break;
    default:
      AssertMsg(0, "Attempting to set an illegal smoothing mode.");
      break;
  }
  gMapInformation.ubEditorSmoothingType = ubNewMode;
}
