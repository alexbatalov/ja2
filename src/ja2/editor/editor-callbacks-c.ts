extern SOLDIERINITNODE *gpSelected;
extern SCHEDULENODE gCurrSchedule;

// TERRAIN
function BtnFgGrndCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_FGROUND_TEXTURES);
  }
}

function BtnBkGrndCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_BGROUND_TEXTURES);
  }
}

function BtnObjectCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_TREES);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_TREES);
    iEditorToolbarState = TBAR_MODE_GET_OSTRUCTS;
  }
}

function BtnObject1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_ROCKS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_ROCKS);
    iEditorToolbarState = TBAR_MODE_GET_OSTRUCTS1;
  }
}

function BtnObject2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_MISC);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_MISC);
    iEditorToolbarState = TBAR_MODE_GET_OSTRUCTS2;
  }
}

function BtnBanksCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_CLIFFS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_CLIFFS);
    iEditorToolbarState = TBAR_MODE_GET_BANKS;
  }
}

function BtnRoadsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_ROADS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_ROADS);
    iEditorToolbarState = TBAR_MODE_GET_ROADS;
  }
}

function BtnDebrisCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_DEBRIS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(TERRAIN_PLACE_DEBRIS);
    iEditorToolbarState = TBAR_MODE_GET_DEBRIS;
  }
}

function BtnBrushCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_CHANGE_BRUSH;
  }
}

function BtnFillCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(TERRAIN_FILL_AREA);
  }
}

function BtnIncBrushDensityCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_DENS_UP;
  }
}

function BtnDecBrushDensityCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_DENS_DWN;
  }
}

// BUILDINGS
function BuildingWallCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_WALLS);
    iDrawMode = DRAW_MODE_WALLS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_WALLS);
    iEditorToolbarState = TBAR_MODE_GET_WALL;
  }
}

function BuildingDoorCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_DOORS);
    iDrawMode = DRAW_MODE_DOORS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_DOORS);
    iEditorToolbarState = TBAR_MODE_GET_DOOR;
  }
}

function BuildingWindowCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_WINDOWS);
    iDrawMode = DRAW_MODE_WINDOWS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_WINDOWS);
    iEditorToolbarState = TBAR_MODE_GET_WINDOW;
  }
}

function BuildingRoofCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_ROOFS);
    iDrawMode = DRAW_MODE_ROOFS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_ROOFS);
    iEditorToolbarState = TBAR_MODE_GET_ROOF;
  }
}

function BuildingCrackWallCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_BROKEN_WALLS);
    iDrawMode = DRAW_MODE_BROKEN_WALLS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_BROKEN_WALLS);
    iEditorToolbarState = TBAR_MODE_GET_BROKEN_WALL;
  }
}

function BuildingFloorCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_FLOORS);
    iDrawMode = DRAW_MODE_FLOORS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_FLOORS);
    iEditorToolbarState = TBAR_MODE_GET_FLOOR;
  }
}

function BuildingToiletCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_TOILETS);
    iDrawMode = DRAW_MODE_TOILET;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_TOILETS);
    iEditorToolbarState = TBAR_MODE_GET_TOILET;
  }
}

function BuildingFurnitureCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_FURNITURE);
    iDrawMode = DRAW_MODE_DECOR;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_FURNITURE);
    iEditorToolbarState = TBAR_MODE_GET_DECOR;
  }
}

function BuildingDecalCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_DECALS);
    iDrawMode = DRAW_MODE_DECALS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_PLACE_DECALS);
    iEditorToolbarState = TBAR_MODE_GET_DECAL;
  }
}

function BuildingSmartWallCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_SMART_WALLS);
    iDrawMode = DRAW_MODE_SMART_WALLS;
  }
}

function BuildingSmartWindowCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_SMART_WINDOWS);
    iDrawMode = DRAW_MODE_SMART_WINDOWS;
  }
}

function BuildingSmartDoorCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_SMART_DOORS);
    iDrawMode = DRAW_MODE_SMART_DOORS;
  }
}

function BuildingSmartCrackWallCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_SMART_BROKEN_WALLS);
    iDrawMode = DRAW_MODE_SMART_BROKEN_WALLS;
  }
}

function BuildingDoorKeyCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_DOORKEY);
    iDrawMode = DRAW_MODE_DOORKEYS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_DOORKEY);
    iDrawMode = DRAW_MODE_DOORKEYS;
    FindNextLockedDoor();
  }
}

function BuildingNewRoomCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_NEW_ROOM);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = DRAW_MODE_ROOM;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_NEW_ROOM);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = DRAW_MODE_ROOM;
    iEditorToolbarState = TBAR_MODE_GET_ROOM;
  }
}

function BuildingNewRoofCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_NEW_ROOF);
    iDrawMode = DRAW_MODE_NEWROOF;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(BUILDING_NEW_ROOF);
    iDrawMode = DRAW_MODE_NEWROOF;
    iEditorToolbarState = TBAR_MODE_GET_NEW_ROOF;
  }
}

function BuildingCaveDrawingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_CAVE_DRAWING);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = DRAW_MODE_CAVES;
  }
}

function BuildingSawRoomCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_SAW_ROOM);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = DRAW_MODE_SAW_ROOM;
  }
}

function BuildingKillBuildingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_KILL_BUILDING);
    iDrawMode = DRAW_MODE_KILL_BUILDING;
  }
}

function BuildingCopyBuildingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_COPY_BUILDING);
    iDrawMode = DRAW_MODE_COPY_BUILDING;
  }
}

function BuildingMoveBuildingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_MOVE_BUILDING);
    iDrawMode = DRAW_MODE_MOVE_BUILDING;
  }
}

function BuildingDrawRoomNumCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_DRAW_ROOMNUM);
    iDrawMode = DRAW_MODE_ROOMNUM;
    gubCurrRoomNumber = gubMaxRoomNumber;
  }
}

function BuildingEraseRoomNumCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(BUILDING_ERASE_ROOMNUM);
    iDrawMode = DRAW_MODE_ROOMNUM + DRAW_MODE_ERASE;
  }
}

function BuildingToggleRoofViewCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fBuildingShowRoofs ^= 1) {
      ClickEditorButton(BUILDING_TOGGLE_ROOF_VIEW);
    } else {
      UnclickEditorButton(BUILDING_TOGGLE_ROOF_VIEW);
    }
    // Name could be a bit misleading.  It'll hide or show the roofs based on the
    // fBuildingShowRoofs value.
    UpdateRoofsView();
  }
}

function BuildingToggleWallViewCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fBuildingShowWalls ^= 1) {
      ClickEditorButton(BUILDING_TOGGLE_WALL_VIEW);
    } else {
      UnclickEditorButton(BUILDING_TOGGLE_WALL_VIEW);
    }
    // Name could be a bit misleading.  It'll hide or show the walls based on the
    // fBuildingShowWalls value.
    UpdateWallsView();
  }
}

function BuildingToggleInfoViewCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fBuildingShowRoomInfo ^= 1) {
      ClickEditorButton(BUILDING_TOGGLE_INFO_VIEW);
    } else {
      UnclickEditorButton(BUILDING_TOGGLE_INFO_VIEW);
    }
    gfRenderWorld = TRUE;
  }
}

// MAPINFO
function BtnFakeLightCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON)
      btn->uiFlags &= (~BUTTON_CLICKED_ON);
    else
      btn->uiFlags |= BUTTON_CLICKED_ON;

    iEditorToolbarState = TBAR_MODE_FAKE_LIGHTING;
  }
}

function BtnDrawLightsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(MAPINFO_ADD_LIGHT1_SOURCE);
}

function MapInfoDrawExitGridCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(MAPINFO_DRAW_EXITGRIDS);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    SetEditorMapInfoTaskbarMode(MAPINFO_DRAW_EXITGRIDS);
    LocateNextExitGrid();
  }
}

function MapInfoEntryPointsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP | MSYS_CALLBACK_REASON_RBUTTON_UP)) {
    INT16 x, sGridNo;
    for (x = MAPINFO_NORTH_POINT; x <= MAPINFO_ISOLATED_POINT; x++) {
      if (btn == ButtonList[iEditorButton[x]]) {
        SetEditorMapInfoTaskbarMode(x);
        if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
          switch (x) {
            case MAPINFO_NORTH_POINT:
              sGridNo = gMapInformation.sNorthGridNo;
              break;
            case MAPINFO_WEST_POINT:
              sGridNo = gMapInformation.sWestGridNo;
              break;
            case MAPINFO_EAST_POINT:
              sGridNo = gMapInformation.sEastGridNo;
              break;
            case MAPINFO_SOUTH_POINT:
              sGridNo = gMapInformation.sSouthGridNo;
              break;
            case MAPINFO_CENTER_POINT:
              sGridNo = gMapInformation.sCenterGridNo;
              break;
            case MAPINFO_ISOLATED_POINT:
              sGridNo = gMapInformation.sIsolatedGridNo;
              break;
          }
          if (sGridNo != -1) {
            CenterScreenAtMapIndex(sGridNo);
          }
        }
        break;
      }
    }
  }
}

function MapInfoNormalRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(MAPINFO_RADIO_NORMAL);
}

function MapInfoBasementRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(MAPINFO_RADIO_BASEMENT);
}

function MapInfoCavesRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(MAPINFO_RADIO_CAVES);
}

function MapInfoPrimeTimeRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(PRIMETIME_LIGHT);
}

function MapInfoNightTimeRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(NIGHTTIME_LIGHT);
}

function MapInfo24HourTimeRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(ALWAYSON_LIGHT);
}

// OPTIONS
function BtnNewMapCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_NEW_MAP;
    gfPendingBasement = FALSE;
    gfPendingCaves = FALSE;
  }
}

function BtnNewBasementCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_NEW_MAP;
    gfPendingBasement = TRUE;
    gfPendingCaves = FALSE;
  }
}

function BtnNewCavesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_NEW_MAP;
    gfPendingBasement = FALSE;
    gfPendingCaves = TRUE;
  }
}

function BtnSaveCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_SAVE;
  }
}

function BtnLoadCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_LOAD;
  }
}

function BtnChangeTilesetCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = TBAR_MODE_CHANGE_TILESET;
  }
}

function BtnCancelCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_EXIT_EDIT;
  }
}

function BtnQuitCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_QUIT_GAME;
  }
}

// ITEMS
function MouseMovedInItemsRegion(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  HandleItemsPanel(gusMouseXPos, gusMouseYPos, GUI_MOVE_EVENT);
}

function MouseClickedInItemsRegion(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    HandleItemsPanel(gusMouseXPos, gusMouseYPos, GUI_LCLICK_EVENT);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP)
    HandleItemsPanel(gusMouseXPos, gusMouseYPos, GUI_RCLICK_EVENT);
}

function ItemsWeaponsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_WEAPONS);
}

function ItemsAmmoCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_AMMO);
}

function ItemsArmourCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_ARMOUR);
}

function ItemsExplosivesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_EXPLOSIVES);
}

function ItemsEquipment1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_EQUIPMENT1);
}

function ItemsEquipment2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_EQUIPMENT2);
}

function ItemsEquipment3Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_EQUIPMENT3);
}

function ItemsTriggersCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_TRIGGERS);
}

function ItemsKeysCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(ITEMS_KEYS);
}

function ItemsLeftScrollCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderTaskbar = TRUE;
    eInfo.sScrollIndex--;
    if (!eInfo.sScrollIndex)
      DisableButton(iEditorButton[ITEMS_LEFTSCROLL]);
    if (eInfo.sScrollIndex < ((eInfo.sNumItems + 1) / 2) - 6)
      EnableButton(iEditorButton[ITEMS_RIGHTSCROLL]);
  }
}

function ItemsRightScrollCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderTaskbar = TRUE;
    eInfo.sScrollIndex++;
    EnableButton(iEditorButton[ITEMS_LEFTSCROLL]);
    if (eInfo.sScrollIndex == max(((eInfo.sNumItems + 1) / 2) - 6, 0))
      DisableButton(iEditorButton[ITEMS_RIGHTSCROLL]);
  }
}

// MERCS
function MercsTogglePlayers(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowPlayers = btn->uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(OUR_TEAM, gfShowCivilians);
  }
}

function MercsToggleEnemies(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowEnemies = btn->uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(ENEMY_TEAM, gfShowEnemies);
  }
}

function MercsToggleCreatures(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowCreatures = btn->uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(CREATURE_TEAM, gfShowCreatures);
  }
}

function MercsToggleRebels(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowRebels = btn->uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(MILITIA_TEAM, gfShowRebels);
  }
}

function MercsToggleCivilians(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowCivilians = btn->uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(CIV_TEAM, gfShowCivilians);
  }
}

function MercsPlayerTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ClickEditorButton(MERCS_PLAYER);
    UnclickEditorButton(MERCS_ENEMY);
    UnclickEditorButton(MERCS_CREATURE);
    UnclickEditorButton(MERCS_REBEL);
    UnclickEditorButton(MERCS_CIVILIAN);
    iDrawMode = DRAW_MODE_PLAYER;
    SetMercEditingMode(MERC_TEAMMODE);
  }
}

function MercsEnemyTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UnclickEditorButton(MERCS_PLAYER);
    ClickEditorButton(MERCS_ENEMY);
    UnclickEditorButton(MERCS_CREATURE);
    UnclickEditorButton(MERCS_REBEL);
    UnclickEditorButton(MERCS_CIVILIAN);
    iDrawMode = DRAW_MODE_ENEMY;
    SetMercEditingMode(MERC_TEAMMODE);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    IndicateSelectedMerc(SELECT_NEXT_ENEMY);
  }
}

function MercsCreatureTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UnclickEditorButton(MERCS_PLAYER);
    UnclickEditorButton(MERCS_ENEMY);
    ClickEditorButton(MERCS_CREATURE);
    UnclickEditorButton(MERCS_REBEL);
    UnclickEditorButton(MERCS_CIVILIAN);
    iDrawMode = DRAW_MODE_CREATURE;
    SetMercEditingMode(MERC_TEAMMODE);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    IndicateSelectedMerc(SELECT_NEXT_CREATURE);
  }
}

function MercsRebelTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UnclickEditorButton(MERCS_PLAYER);
    UnclickEditorButton(MERCS_ENEMY);
    UnclickEditorButton(MERCS_CREATURE);
    ClickEditorButton(MERCS_REBEL);
    UnclickEditorButton(MERCS_CIVILIAN);
    iDrawMode = DRAW_MODE_REBEL;
    SetMercEditingMode(MERC_TEAMMODE);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    IndicateSelectedMerc(SELECT_NEXT_REBEL);
  }
}

function MercsCivilianTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UnclickEditorButton(MERCS_PLAYER);
    UnclickEditorButton(MERCS_ENEMY);
    UnclickEditorButton(MERCS_CREATURE);
    UnclickEditorButton(MERCS_REBEL);
    ClickEditorButton(MERCS_CIVILIAN);
    iDrawMode = DRAW_MODE_CIVILIAN;
    SetMercEditingMode(MERC_TEAMMODE);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    IndicateSelectedMerc(SELECT_NEXT_CIV);
  }
}

function MercsNextCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    IndicateSelectedMerc(SELECT_NEXT_MERC);
  }
}

function MercsDeleteCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    DeleteSelectedMerc();
    SetMercEditingMode(MERC_TEAMMODE);
  }
}

function MercsInventorySlotCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    INT32 uiSlot;
    uiSlot = MSYS_GetBtnUserData(btn, 0);
    if (btn->uiFlags & BUTTON_CLICKED_ON)
      SetEnemyDroppableStatus(uiSlot, TRUE);
    else
      SetEnemyDroppableStatus(uiSlot, FALSE);
  }
}

function MercsSetEnemyColorCodeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UINT8 ubColorCode;
    ubColorCode = (UINT8)MSYS_GetBtnUserData(btn, 0);
    SetEnemyColorCode(ubColorCode);
  }
}

function MercsCivilianGroupCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn->uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = TBAR_MODE_CIVILIAN_GROUP;
  }
}

function MercsScheduleAction1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 0;
    InitPopupMenu(iEditorButton[MERCS_SCHEDULE_ACTION1], SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

function MercsScheduleAction2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 1;
    InitPopupMenu(iEditorButton[MERCS_SCHEDULE_ACTION2], SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

function MercsScheduleAction3Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 2;
    InitPopupMenu(iEditorButton[MERCS_SCHEDULE_ACTION3], SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

function MercsScheduleAction4Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 3;
    InitPopupMenu(iEditorButton[MERCS_SCHEDULE_ACTION4], SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

function MercsScheduleToggleVariance1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE1;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE1;
  }
}

function MercsScheduleToggleVariance2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE2;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE2;
  }
}

function MercsScheduleToggleVariance3Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE3;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE3;
  }
}

function MercsScheduleToggleVariance4Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE4;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE4;
  }
}

function MercsScheduleData1ACallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 0;
    StartScheduleAction();
    gfSingleAction = TRUE;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(0);
  }
}

function MercsScheduleData1BCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 0;
    gfUseScheduleData2 = FALSE;
    RegisterCurrentScheduleAction(gCurrSchedule.usData1[0]);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(1);
  }
}

function MercsScheduleData2ACallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 1;
    StartScheduleAction();
    gfSingleAction = TRUE;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(2);
  }
}

function MercsScheduleData2BCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 1;
    gfUseScheduleData2 = FALSE;
    RegisterCurrentScheduleAction(gCurrSchedule.usData1[1]);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(3);
  }
}

function MercsScheduleData3ACallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 2;
    StartScheduleAction();
    gfSingleAction = TRUE;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(4);
  }
}

function MercsScheduleData3BCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 2;
    gfUseScheduleData2 = FALSE;
    RegisterCurrentScheduleAction(gCurrSchedule.usData1[2]);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(5);
  }
}

function MercsScheduleData4ACallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 3;
    StartScheduleAction();
    gfSingleAction = TRUE;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(6);
  }
}

function MercsScheduleData4BCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 3;
    gfUseScheduleData2 = FALSE;
    RegisterCurrentScheduleAction(gCurrSchedule.usData1[3]);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(7);
  }
}

function MercsScheduleClearCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ClearCurrentSchedule();
    ExtractAndUpdateMercSchedule();
  }
}

function MercsDetailedPlacementCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON) // button is checked
    {
      InitDetailedPlacementForMerc();
      SetMercEditingMode(MERC_GENERALMODE);
    } else // button is unchecked.
    {
      KillDetailedPlacementForMerc();
      SetMercEditingMode(MERC_BASICMODE);
    }
  }
}

function MercsPriorityExistanceCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gpSelected) {
      if (btn->uiFlags & BUTTON_CLICKED_ON) // button is checked
      {
        gpSelected->pBasicPlacement->fPriorityExistance = TRUE;
      } else // button is unchecked.
      {
        gpSelected->pBasicPlacement->fPriorityExistance = FALSE;
      }
    }
  }
}

function MercsHasKeysCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gpSelected) {
      if (btn->uiFlags & BUTTON_CLICKED_ON) // button is checked
      {
        gpSelected->pBasicPlacement->fHasKeys = TRUE;
      } else // button is unchecked.
      {
        gpSelected->pBasicPlacement->fHasKeys = FALSE;
      }
      if (gpSelected->pDetailedPlacement) {
        gpSelected->pDetailedPlacement->fHasKeys = gpSelected->pBasicPlacement->fHasKeys;
      }
    }
  }
}

function MercsGeneralModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(MERC_GENERALMODE);
}

function MercsAttributesModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(MERC_ATTRIBUTEMODE);
}

function MercsInventoryModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(MERC_INVENTORYMODE);
}

function MercsAppearanceModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(MERC_APPEARANCEMODE);
}

function MercsProfileModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(MERC_PROFILEMODE);
}

function MercsScheduleModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(MERC_SCHEDULEMODE);
}

// multiple orders buttons
function MercsSetOrdersCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercOrders((UINT8)MSYS_GetBtnUserData(btn, 0));
}

// multiple attitude buttons
function MercsSetAttitudeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercAttitude((UINT8)MSYS_GetBtnUserData(btn, 0));
}

// multiple direction buttons
function MercsDirectionSetCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercDirection((UINT8)MSYS_GetBtnUserData(btn, 0));
}

function MercsFindSelectedMercCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  SOLDIERTYPE *pSoldier;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gsSelectedMercID == -1)
      return;
    GetSoldier(&pSoldier, gsSelectedMercID);
    if (!pSoldier)
      return;
    CenterScreenAtMapIndex(pSoldier->sGridNo);
  }
}

function MercsSetRelativeEquipmentCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercRelativeEquipment((INT8)MSYS_GetBtnUserData(btn, 0));
}

function MercsSetRelativeAttributesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercRelativeAttributes((INT8)MSYS_GetBtnUserData(btn, 0));
}

function MouseMovedInMercRegion(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  HandleMercInventoryPanel(reg->RelativeXPos, reg->RelativeYPos, GUI_MOVE_EVENT);
}

function MouseClickedInMercRegion(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    HandleMercInventoryPanel(reg->RelativeXPos, reg->RelativeYPos, GUI_LCLICK_EVENT);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP)
    HandleMercInventoryPanel(reg->RelativeXPos, reg->RelativeYPos, GUI_RCLICK_EVENT);
}

// VARIOUS
function BtnUndoCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = TBAR_MODE_UNDO;
  }
}

function BtnEraseCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (iDrawMode >= DRAW_MODE_ERASE)
      btn->uiFlags &= (~BUTTON_CLICKED_ON);
    else
      btn->uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = (btn->uiFlags & BUTTON_CLICKED_ON) ? (TBAR_MODE_ERASE) : (TBAR_MODE_ERASE_OFF);
  }
}

// ITEM STATS
function ItemStatsToggleHideCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn->uiFlags & BUTTON_CLICKED_ON)
      ExecuteItemStatsCmd(ITEMSTATS_HIDE);
    else
      ExecuteItemStatsCmd(ITEMSTATS_SHOW);
  }
}

function ItemStatsDeleteCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ExecuteItemStatsCmd(ITEMSTATS_DELETE);
}
