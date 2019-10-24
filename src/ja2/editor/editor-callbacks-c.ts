// TERRAIN
function BtnFgGrndCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_FGROUND_TEXTURES);
  }
}

function BtnBkGrndCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_BGROUND_TEXTURES);
  }
}

function BtnObjectCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_TREES);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_TREES);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_OSTRUCTS;
  }
}

function BtnObject1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_ROCKS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_ROCKS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_OSTRUCTS1;
  }
}

function BtnObject2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_MISC);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_MISC);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_OSTRUCTS2;
  }
}

function BtnBanksCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_CLIFFS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_CLIFFS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_BANKS;
  }
}

function BtnRoadsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_ROADS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_ROADS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_ROADS;
  }
}

function BtnDebrisCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_DEBRIS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_DEBRIS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_DEBRIS;
  }
}

function BtnBrushCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_CHANGE_BRUSH;
  }
}

function BtnFillCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_FILL_AREA);
  }
}

function BtnIncBrushDensityCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_DENS_UP;
  }
}

function BtnDecBrushDensityCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_DENS_DWN;
  }
}

// BUILDINGS
function BuildingWallCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_WALLS);
    iDrawMode = Enum38.DRAW_MODE_WALLS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_WALLS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_WALL;
  }
}

function BuildingDoorCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_DOORS);
    iDrawMode = Enum38.DRAW_MODE_DOORS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_DOORS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_DOOR;
  }
}

function BuildingWindowCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_WINDOWS);
    iDrawMode = Enum38.DRAW_MODE_WINDOWS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_WINDOWS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_WINDOW;
  }
}

function BuildingRoofCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_ROOFS);
    iDrawMode = Enum38.DRAW_MODE_ROOFS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_ROOFS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_ROOF;
  }
}

function BuildingCrackWallCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_BROKEN_WALLS);
    iDrawMode = Enum38.DRAW_MODE_BROKEN_WALLS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_BROKEN_WALLS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_BROKEN_WALL;
  }
}

function BuildingFloorCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_FLOORS);
    iDrawMode = Enum38.DRAW_MODE_FLOORS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_FLOORS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_FLOOR;
  }
}

function BuildingToiletCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_TOILETS);
    iDrawMode = Enum38.DRAW_MODE_TOILET;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_TOILETS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_TOILET;
  }
}

function BuildingFurnitureCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_FURNITURE);
    iDrawMode = Enum38.DRAW_MODE_DECOR;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_FURNITURE);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_DECOR;
  }
}

function BuildingDecalCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_DECALS);
    iDrawMode = Enum38.DRAW_MODE_DECALS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_DECALS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_DECAL;
  }
}

function BuildingSmartWallCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SMART_WALLS);
    iDrawMode = Enum38.DRAW_MODE_SMART_WALLS;
  }
}

function BuildingSmartWindowCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SMART_WINDOWS);
    iDrawMode = Enum38.DRAW_MODE_SMART_WINDOWS;
  }
}

function BuildingSmartDoorCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SMART_DOORS);
    iDrawMode = Enum38.DRAW_MODE_SMART_DOORS;
  }
}

function BuildingSmartCrackWallCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SMART_BROKEN_WALLS);
    iDrawMode = Enum38.DRAW_MODE_SMART_BROKEN_WALLS;
  }
}

function BuildingDoorKeyCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_DOORKEY);
    iDrawMode = Enum38.DRAW_MODE_DOORKEYS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_DOORKEY);
    iDrawMode = Enum38.DRAW_MODE_DOORKEYS;
    FindNextLockedDoor();
  }
}

function BuildingNewRoomCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_NEW_ROOM);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = Enum38.DRAW_MODE_ROOM;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_NEW_ROOM);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = Enum38.DRAW_MODE_ROOM;
    iEditorToolbarState = Enum35.TBAR_MODE_GET_ROOM;
  }
}

function BuildingNewRoofCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_NEW_ROOF);
    iDrawMode = Enum38.DRAW_MODE_NEWROOF;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_NEW_ROOF);
    iDrawMode = Enum38.DRAW_MODE_NEWROOF;
    iEditorToolbarState = Enum35.TBAR_MODE_GET_NEW_ROOF;
  }
}

function BuildingCaveDrawingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_CAVE_DRAWING);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = Enum38.DRAW_MODE_CAVES;
  }
}

function BuildingSawRoomCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SAW_ROOM);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = Enum38.DRAW_MODE_SAW_ROOM;
  }
}

function BuildingKillBuildingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_KILL_BUILDING);
    iDrawMode = Enum38.DRAW_MODE_KILL_BUILDING;
  }
}

function BuildingCopyBuildingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_COPY_BUILDING);
    iDrawMode = Enum38.DRAW_MODE_COPY_BUILDING;
  }
}

function BuildingMoveBuildingCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_MOVE_BUILDING);
    iDrawMode = Enum38.DRAW_MODE_MOVE_BUILDING;
  }
}

function BuildingDrawRoomNumCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_DRAW_ROOMNUM);
    iDrawMode = Enum38.DRAW_MODE_ROOMNUM;
    gubCurrRoomNumber = gubMaxRoomNumber;
  }
}

function BuildingEraseRoomNumCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_ERASE_ROOMNUM);
    iDrawMode = Enum38.DRAW_MODE_ROOMNUM + Enum38.DRAW_MODE_ERASE;
  }
}

function BuildingToggleRoofViewCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fBuildingShowRoofs ^= 1) {
      ClickEditorButton(Enum32.BUILDING_TOGGLE_ROOF_VIEW);
    } else {
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_ROOF_VIEW);
    }
    // Name could be a bit misleading.  It'll hide or show the roofs based on the
    // fBuildingShowRoofs value.
    UpdateRoofsView();
  }
}

function BuildingToggleWallViewCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fBuildingShowWalls ^= 1) {
      ClickEditorButton(Enum32.BUILDING_TOGGLE_WALL_VIEW);
    } else {
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_WALL_VIEW);
    }
    // Name could be a bit misleading.  It'll hide or show the walls based on the
    // fBuildingShowWalls value.
    UpdateWallsView();
  }
}

function BuildingToggleInfoViewCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (fBuildingShowRoomInfo ^= 1) {
      ClickEditorButton(Enum32.BUILDING_TOGGLE_INFO_VIEW);
    } else {
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_INFO_VIEW);
    }
    gfRenderWorld = TRUE;
  }
}

// MAPINFO
function BtnFakeLightCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON)
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    else
      btn.value.uiFlags |= BUTTON_CLICKED_ON;

    iEditorToolbarState = Enum35.TBAR_MODE_FAKE_LIGHTING;
  }
}

function BtnDrawLightsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_ADD_LIGHT1_SOURCE);
}

function MapInfoDrawExitGridCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_DRAW_EXITGRIDS);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_DRAW_EXITGRIDS);
    LocateNextExitGrid();
  }
}

function MapInfoEntryPointsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & (MSYS_CALLBACK_REASON_LBUTTON_UP | MSYS_CALLBACK_REASON_RBUTTON_UP)) {
    let x: INT16;
    let sGridNo: INT16;
    for (x = Enum32.MAPINFO_NORTH_POINT; x <= Enum32.MAPINFO_ISOLATED_POINT; x++) {
      if (btn == ButtonList[iEditorButton[x]]) {
        SetEditorMapInfoTaskbarMode(x);
        if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
          switch (x) {
            case Enum32.MAPINFO_NORTH_POINT:
              sGridNo = gMapInformation.sNorthGridNo;
              break;
            case Enum32.MAPINFO_WEST_POINT:
              sGridNo = gMapInformation.sWestGridNo;
              break;
            case Enum32.MAPINFO_EAST_POINT:
              sGridNo = gMapInformation.sEastGridNo;
              break;
            case Enum32.MAPINFO_SOUTH_POINT:
              sGridNo = gMapInformation.sSouthGridNo;
              break;
            case Enum32.MAPINFO_CENTER_POINT:
              sGridNo = gMapInformation.sCenterGridNo;
              break;
            case Enum32.MAPINFO_ISOLATED_POINT:
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
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_RADIO_NORMAL);
}

function MapInfoBasementRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_RADIO_BASEMENT);
}

function MapInfoCavesRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_RADIO_CAVES);
}

function MapInfoPrimeTimeRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(Enum39.PRIMETIME_LIGHT);
}

function MapInfoNightTimeRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(Enum39.NIGHTTIME_LIGHT);
}

function MapInfo24HourTimeRadioCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(Enum39.ALWAYSON_LIGHT);
}

// OPTIONS
function BtnNewMapCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_NEW_MAP;
    gfPendingBasement = FALSE;
    gfPendingCaves = FALSE;
  }
}

function BtnNewBasementCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_NEW_MAP;
    gfPendingBasement = TRUE;
    gfPendingCaves = FALSE;
  }
}

function BtnNewCavesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_NEW_MAP;
    gfPendingBasement = FALSE;
    gfPendingCaves = TRUE;
  }
}

function BtnSaveCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_SAVE;
  }
}

function BtnLoadCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_LOAD;
  }
}

function BtnChangeTilesetCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = Enum35.TBAR_MODE_CHANGE_TILESET;
  }
}

function BtnCancelCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_EXIT_EDIT;
  }
}

function BtnQuitCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_QUIT_GAME;
  }
}

// ITEMS
function MouseMovedInItemsRegion(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  HandleItemsPanel(gusMouseXPos, gusMouseYPos, Enum44.GUI_MOVE_EVENT);
}

function MouseClickedInItemsRegion(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    HandleItemsPanel(gusMouseXPos, gusMouseYPos, Enum44.GUI_LCLICK_EVENT);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP)
    HandleItemsPanel(gusMouseXPos, gusMouseYPos, Enum44.GUI_RCLICK_EVENT);
}

function ItemsWeaponsCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_WEAPONS);
}

function ItemsAmmoCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_AMMO);
}

function ItemsArmourCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_ARMOUR);
}

function ItemsExplosivesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_EXPLOSIVES);
}

function ItemsEquipment1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_EQUIPMENT1);
}

function ItemsEquipment2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_EQUIPMENT2);
}

function ItemsEquipment3Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_EQUIPMENT3);
}

function ItemsTriggersCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_TRIGGERS);
}

function ItemsKeysCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_KEYS);
}

function ItemsLeftScrollCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderTaskbar = TRUE;
    eInfo.sScrollIndex--;
    if (!eInfo.sScrollIndex)
      DisableButton(iEditorButton[Enum32.ITEMS_LEFTSCROLL]);
    if (eInfo.sScrollIndex < ((eInfo.sNumItems + 1) / 2) - 6)
      EnableButton(iEditorButton[Enum32.ITEMS_RIGHTSCROLL]);
  }
}

function ItemsRightScrollCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderTaskbar = TRUE;
    eInfo.sScrollIndex++;
    EnableButton(iEditorButton[Enum32.ITEMS_LEFTSCROLL]);
    if (eInfo.sScrollIndex == max(((eInfo.sNumItems + 1) / 2) - 6, 0))
      DisableButton(iEditorButton[Enum32.ITEMS_RIGHTSCROLL]);
  }
}

// MERCS
function MercsTogglePlayers(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowPlayers = btn.value.uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(OUR_TEAM, gfShowCivilians);
  }
}

function MercsToggleEnemies(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowEnemies = btn.value.uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(ENEMY_TEAM, gfShowEnemies);
  }
}

function MercsToggleCreatures(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowCreatures = btn.value.uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(CREATURE_TEAM, gfShowCreatures);
  }
}

function MercsToggleRebels(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowRebels = btn.value.uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(MILITIA_TEAM, gfShowRebels);
  }
}

function MercsToggleCivilians(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowCivilians = btn.value.uiFlags & BUTTON_CLICKED_ON ? TRUE : FALSE;
    SetMercTeamVisibility(CIV_TEAM, gfShowCivilians);
  }
}

function MercsPlayerTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ClickEditorButton(Enum32.MERCS_PLAYER);
    UnclickEditorButton(Enum32.MERCS_ENEMY);
    UnclickEditorButton(Enum32.MERCS_CREATURE);
    UnclickEditorButton(Enum32.MERCS_REBEL);
    UnclickEditorButton(Enum32.MERCS_CIVILIAN);
    iDrawMode = Enum38.DRAW_MODE_PLAYER;
    SetMercEditingMode(Enum42.MERC_TEAMMODE);
  }
}

function MercsEnemyTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UnclickEditorButton(Enum32.MERCS_PLAYER);
    ClickEditorButton(Enum32.MERCS_ENEMY);
    UnclickEditorButton(Enum32.MERCS_CREATURE);
    UnclickEditorButton(Enum32.MERCS_REBEL);
    UnclickEditorButton(Enum32.MERCS_CIVILIAN);
    iDrawMode = Enum38.DRAW_MODE_ENEMY;
    SetMercEditingMode(Enum42.MERC_TEAMMODE);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    IndicateSelectedMerc(Enum43.SELECT_NEXT_ENEMY);
  }
}

function MercsCreatureTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UnclickEditorButton(Enum32.MERCS_PLAYER);
    UnclickEditorButton(Enum32.MERCS_ENEMY);
    ClickEditorButton(Enum32.MERCS_CREATURE);
    UnclickEditorButton(Enum32.MERCS_REBEL);
    UnclickEditorButton(Enum32.MERCS_CIVILIAN);
    iDrawMode = Enum38.DRAW_MODE_CREATURE;
    SetMercEditingMode(Enum42.MERC_TEAMMODE);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    IndicateSelectedMerc(Enum43.SELECT_NEXT_CREATURE);
  }
}

function MercsRebelTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UnclickEditorButton(Enum32.MERCS_PLAYER);
    UnclickEditorButton(Enum32.MERCS_ENEMY);
    UnclickEditorButton(Enum32.MERCS_CREATURE);
    ClickEditorButton(Enum32.MERCS_REBEL);
    UnclickEditorButton(Enum32.MERCS_CIVILIAN);
    iDrawMode = Enum38.DRAW_MODE_REBEL;
    SetMercEditingMode(Enum42.MERC_TEAMMODE);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    IndicateSelectedMerc(Enum43.SELECT_NEXT_REBEL);
  }
}

function MercsCivilianTeamCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    UnclickEditorButton(Enum32.MERCS_PLAYER);
    UnclickEditorButton(Enum32.MERCS_ENEMY);
    UnclickEditorButton(Enum32.MERCS_CREATURE);
    UnclickEditorButton(Enum32.MERCS_REBEL);
    ClickEditorButton(Enum32.MERCS_CIVILIAN);
    iDrawMode = Enum38.DRAW_MODE_CIVILIAN;
    SetMercEditingMode(Enum42.MERC_TEAMMODE);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    IndicateSelectedMerc(Enum43.SELECT_NEXT_CIV);
  }
}

function MercsNextCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    IndicateSelectedMerc(Enum43.SELECT_NEXT_MERC);
  }
}

function MercsDeleteCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    DeleteSelectedMerc();
    SetMercEditingMode(Enum42.MERC_TEAMMODE);
  }
}

function MercsInventorySlotCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let uiSlot: INT32;
    uiSlot = MSYS_GetBtnUserData(btn, 0);
    if (btn.value.uiFlags & BUTTON_CLICKED_ON)
      SetEnemyDroppableStatus(uiSlot, TRUE);
    else
      SetEnemyDroppableStatus(uiSlot, FALSE);
  }
}

function MercsSetEnemyColorCodeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubColorCode: UINT8;
    ubColorCode = MSYS_GetBtnUserData(btn, 0);
    SetEnemyColorCode(ubColorCode);
  }
}

function MercsCivilianGroupCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.value.uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = Enum35.TBAR_MODE_CIVILIAN_GROUP;
  }
}

function MercsScheduleAction1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 0;
    InitPopupMenu(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1], Enum53.SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

function MercsScheduleAction2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 1;
    InitPopupMenu(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION2], Enum53.SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

function MercsScheduleAction3Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 2;
    InitPopupMenu(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION3], Enum53.SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

function MercsScheduleAction4Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 3;
    InitPopupMenu(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION4], Enum53.SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

function MercsScheduleToggleVariance1Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE1;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE1;
  }
}

function MercsScheduleToggleVariance2Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE2;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE2;
  }
}

function MercsScheduleToggleVariance3Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE3;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE3;
  }
}

function MercsScheduleToggleVariance4Callback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON)
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
    if (btn.value.uiFlags & BUTTON_CLICKED_ON) // button is checked
    {
      InitDetailedPlacementForMerc();
      SetMercEditingMode(Enum42.MERC_GENERALMODE);
    } else // button is unchecked.
    {
      KillDetailedPlacementForMerc();
      SetMercEditingMode(Enum42.MERC_BASICMODE);
    }
  }
}

function MercsPriorityExistanceCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gpSelected) {
      if (btn.value.uiFlags & BUTTON_CLICKED_ON) // button is checked
      {
        gpSelected.value.pBasicPlacement.value.fPriorityExistance = TRUE;
      } else // button is unchecked.
      {
        gpSelected.value.pBasicPlacement.value.fPriorityExistance = FALSE;
      }
    }
  }
}

function MercsHasKeysCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gpSelected) {
      if (btn.value.uiFlags & BUTTON_CLICKED_ON) // button is checked
      {
        gpSelected.value.pBasicPlacement.value.fHasKeys = TRUE;
      } else // button is unchecked.
      {
        gpSelected.value.pBasicPlacement.value.fHasKeys = FALSE;
      }
      if (gpSelected.value.pDetailedPlacement) {
        gpSelected.value.pDetailedPlacement.value.fHasKeys = gpSelected.value.pBasicPlacement.value.fHasKeys;
      }
    }
  }
}

function MercsGeneralModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_GENERALMODE);
}

function MercsAttributesModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_ATTRIBUTEMODE);
}

function MercsInventoryModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_INVENTORYMODE);
}

function MercsAppearanceModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_APPEARANCEMODE);
}

function MercsProfileModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_PROFILEMODE);
}

function MercsScheduleModeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_SCHEDULEMODE);
}

// multiple orders buttons
function MercsSetOrdersCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercOrders(MSYS_GetBtnUserData(btn, 0));
}

// multiple attitude buttons
function MercsSetAttitudeCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercAttitude(MSYS_GetBtnUserData(btn, 0));
}

// multiple direction buttons
function MercsDirectionSetCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercDirection(MSYS_GetBtnUserData(btn, 0));
}

function MercsFindSelectedMercCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gsSelectedMercID == -1)
      return;
    GetSoldier(addressof(pSoldier), gsSelectedMercID);
    if (!pSoldier)
      return;
    CenterScreenAtMapIndex(pSoldier.value.sGridNo);
  }
}

function MercsSetRelativeEquipmentCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercRelativeEquipment(MSYS_GetBtnUserData(btn, 0));
}

function MercsSetRelativeAttributesCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercRelativeAttributes(MSYS_GetBtnUserData(btn, 0));
}

function MouseMovedInMercRegion(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  HandleMercInventoryPanel(reg.value.RelativeXPos, reg.value.RelativeYPos, Enum44.GUI_MOVE_EVENT);
}

function MouseClickedInMercRegion(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    HandleMercInventoryPanel(reg.value.RelativeXPos, reg.value.RelativeYPos, Enum44.GUI_LCLICK_EVENT);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP)
    HandleMercInventoryPanel(reg.value.RelativeXPos, reg.value.RelativeYPos, Enum44.GUI_RCLICK_EVENT);
}

// VARIOUS
function BtnUndoCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_UNDO;
  }
}

function BtnEraseCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (iDrawMode >= Enum38.DRAW_MODE_ERASE)
      btn.value.uiFlags &= (~BUTTON_CLICKED_ON);
    else
      btn.value.uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = (btn.value.uiFlags & BUTTON_CLICKED_ON) ? (Enum35.TBAR_MODE_ERASE) : (Enum35.TBAR_MODE_ERASE_OFF);
  }
}

// ITEM STATS
function ItemStatsToggleHideCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.value.uiFlags & BUTTON_CLICKED_ON)
      ExecuteItemStatsCmd(Enum48.ITEMSTATS_HIDE);
    else
      ExecuteItemStatsCmd(Enum48.ITEMSTATS_SHOW);
  }
}

function ItemStatsDeleteCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ExecuteItemStatsCmd(Enum48.ITEMSTATS_DELETE);
}
