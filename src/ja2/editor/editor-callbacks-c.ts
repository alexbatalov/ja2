namespace ja2 {

// TERRAIN
export function BtnFgGrndCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_FGROUND_TEXTURES);
  }
}

export function BtnBkGrndCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_BGROUND_TEXTURES);
  }
}

export function BtnObjectCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_TREES);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_TREES);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_OSTRUCTS;
  }
}

export function BtnObject1Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_ROCKS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_ROCKS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_OSTRUCTS1;
  }
}

export function BtnObject2Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_MISC);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_MISC);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_OSTRUCTS2;
  }
}

export function BtnBanksCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_CLIFFS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_CLIFFS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_BANKS;
  }
}

export function BtnRoadsCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_ROADS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_ROADS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_ROADS;
  }
}

export function BtnDebrisCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_DEBRIS);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_PLACE_DEBRIS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_DEBRIS;
  }
}

export function BtnBrushCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_CHANGE_BRUSH;
  }
}

export function BtnFillCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorTerrainTaskbarMode(Enum32.TERRAIN_FILL_AREA);
  }
}

export function BtnIncBrushDensityCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_DENS_UP;
  }
}

export function BtnDecBrushDensityCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_DENS_DWN;
  }
}

// BUILDINGS
export function BuildingWallCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_WALLS);
    iDrawMode = Enum38.DRAW_MODE_WALLS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_WALLS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_WALL;
  }
}

export function BuildingDoorCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_DOORS);
    iDrawMode = Enum38.DRAW_MODE_DOORS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_DOORS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_DOOR;
  }
}

export function BuildingWindowCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_WINDOWS);
    iDrawMode = Enum38.DRAW_MODE_WINDOWS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_WINDOWS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_WINDOW;
  }
}

export function BuildingRoofCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_ROOFS);
    iDrawMode = Enum38.DRAW_MODE_ROOFS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_ROOFS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_ROOF;
  }
}

export function BuildingCrackWallCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_BROKEN_WALLS);
    iDrawMode = Enum38.DRAW_MODE_BROKEN_WALLS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_BROKEN_WALLS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_BROKEN_WALL;
  }
}

export function BuildingFloorCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_FLOORS);
    iDrawMode = Enum38.DRAW_MODE_FLOORS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_FLOORS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_FLOOR;
  }
}

export function BuildingToiletCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_TOILETS);
    iDrawMode = Enum38.DRAW_MODE_TOILET;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_TOILETS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_TOILET;
  }
}

export function BuildingFurnitureCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_FURNITURE);
    iDrawMode = Enum38.DRAW_MODE_DECOR;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_FURNITURE);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_DECOR;
  }
}

export function BuildingDecalCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_DECALS);
    iDrawMode = Enum38.DRAW_MODE_DECALS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_PLACE_DECALS);
    iEditorToolbarState = Enum35.TBAR_MODE_GET_DECAL;
  }
}

export function BuildingSmartWallCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SMART_WALLS);
    iDrawMode = Enum38.DRAW_MODE_SMART_WALLS;
  }
}

export function BuildingSmartWindowCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SMART_WINDOWS);
    iDrawMode = Enum38.DRAW_MODE_SMART_WINDOWS;
  }
}

export function BuildingSmartDoorCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SMART_DOORS);
    iDrawMode = Enum38.DRAW_MODE_SMART_DOORS;
  }
}

export function BuildingSmartCrackWallCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SMART_BROKEN_WALLS);
    iDrawMode = Enum38.DRAW_MODE_SMART_BROKEN_WALLS;
  }
}

export function BuildingDoorKeyCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_DOORKEY);
    iDrawMode = Enum38.DRAW_MODE_DOORKEYS;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_DOORKEY);
    iDrawMode = Enum38.DRAW_MODE_DOORKEYS;
    FindNextLockedDoor();
  }
}

export function BuildingNewRoomCallback(btn: GUI_BUTTON, reason: INT32): void {
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

export function BuildingNewRoofCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_NEW_ROOF);
    iDrawMode = Enum38.DRAW_MODE_NEWROOF;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_NEW_ROOF);
    iDrawMode = Enum38.DRAW_MODE_NEWROOF;
    iEditorToolbarState = Enum35.TBAR_MODE_GET_NEW_ROOF;
  }
}

export function BuildingCaveDrawingCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_CAVE_DRAWING);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = Enum38.DRAW_MODE_CAVES;
  }
}

export function BuildingSawRoomCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_SAW_ROOM);
    gusSelectionType = gusSavedBuildingSelectionType;
    iDrawMode = Enum38.DRAW_MODE_SAW_ROOM;
  }
}

export function BuildingKillBuildingCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_KILL_BUILDING);
    iDrawMode = Enum38.DRAW_MODE_KILL_BUILDING;
  }
}

export function BuildingCopyBuildingCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_COPY_BUILDING);
    iDrawMode = Enum38.DRAW_MODE_COPY_BUILDING;
  }
}

export function BuildingMoveBuildingCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_MOVE_BUILDING);
    iDrawMode = Enum38.DRAW_MODE_MOVE_BUILDING;
  }
}

export function BuildingDrawRoomNumCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_DRAW_ROOMNUM);
    iDrawMode = Enum38.DRAW_MODE_ROOMNUM;
    gubCurrRoomNumber = gubMaxRoomNumber;
  }
}

export function BuildingEraseRoomNumCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    SetEditorBuildingTaskbarMode(Enum32.BUILDING_ERASE_ROOMNUM);
    iDrawMode = Enum38.DRAW_MODE_ROOMNUM + Enum38.DRAW_MODE_ERASE;
  }
}

export function BuildingToggleRoofViewCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if ((fBuildingShowRoofs = !fBuildingShowRoofs)) {
      ClickEditorButton(Enum32.BUILDING_TOGGLE_ROOF_VIEW);
    } else {
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_ROOF_VIEW);
    }
    // Name could be a bit misleading.  It'll hide or show the roofs based on the
    // fBuildingShowRoofs value.
    UpdateRoofsView();
  }
}

export function BuildingToggleWallViewCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if ((fBuildingShowWalls = !fBuildingShowWalls)) {
      ClickEditorButton(Enum32.BUILDING_TOGGLE_WALL_VIEW);
    } else {
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_WALL_VIEW);
    }
    // Name could be a bit misleading.  It'll hide or show the walls based on the
    // fBuildingShowWalls value.
    UpdateWallsView();
  }
}

export function BuildingToggleInfoViewCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if ((fBuildingShowRoomInfo = !fBuildingShowRoomInfo)) {
      ClickEditorButton(Enum32.BUILDING_TOGGLE_INFO_VIEW);
    } else {
      UnclickEditorButton(Enum32.BUILDING_TOGGLE_INFO_VIEW);
    }
    gfRenderWorld = true;
  }
}

// MAPINFO
export function BtnFakeLightCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON)
      btn.uiFlags &= (~BUTTON_CLICKED_ON);
    else
      btn.uiFlags |= BUTTON_CLICKED_ON;

    iEditorToolbarState = Enum35.TBAR_MODE_FAKE_LIGHTING;
  }
}

export function BtnDrawLightsCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_ADD_LIGHT1_SOURCE);
}

export function MapInfoDrawExitGridCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_DRAW_EXITGRIDS);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_DRAW_EXITGRIDS);
    LocateNextExitGrid();
  }
}

export function MapInfoEntryPointsCallback(btn: GUI_BUTTON, reason: INT32): void {
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
            default:
              throw new Error('Should be unreachable');
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

export function MapInfoNormalRadioCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_RADIO_NORMAL);
}

export function MapInfoBasementRadioCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_RADIO_BASEMENT);
}

export function MapInfoCavesRadioCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorMapInfoTaskbarMode(Enum32.MAPINFO_RADIO_CAVES);
}

export function MapInfoPrimeTimeRadioCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(Enum39.PRIMETIME_LIGHT);
}

export function MapInfoNightTimeRadioCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(Enum39.NIGHTTIME_LIGHT);
}

export function MapInfo24HourTimeRadioCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ChangeLightDefault(Enum39.ALWAYSON_LIGHT);
}

// OPTIONS
export function BtnNewMapCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_NEW_MAP;
    gfPendingBasement = false;
    gfPendingCaves = false;
  }
}

export function BtnNewBasementCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_NEW_MAP;
    gfPendingBasement = true;
    gfPendingCaves = false;
  }
}

export function BtnNewCavesCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_NEW_MAP;
    gfPendingBasement = false;
    gfPendingCaves = true;
  }
}

export function BtnSaveCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_SAVE;
  }
}

export function BtnLoadCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_LOAD;
  }
}

export function BtnChangeTilesetCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = Enum35.TBAR_MODE_CHANGE_TILESET;
  }
}

export function BtnCancelCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_EXIT_EDIT;
  }
}

export function BtnQuitCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_QUIT_GAME;
  }
}

// ITEMS
export function MouseMovedInItemsRegion(reg: MOUSE_REGION, reason: INT32): void {
  HandleItemsPanel(gusMouseXPos, gusMouseYPos, Enum44.GUI_MOVE_EVENT);
}

export function MouseClickedInItemsRegion(reg: MOUSE_REGION, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    HandleItemsPanel(gusMouseXPos, gusMouseYPos, Enum44.GUI_LCLICK_EVENT);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP)
    HandleItemsPanel(gusMouseXPos, gusMouseYPos, Enum44.GUI_RCLICK_EVENT);
}

export function ItemsWeaponsCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_WEAPONS);
}

export function ItemsAmmoCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_AMMO);
}

export function ItemsArmourCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_ARMOUR);
}

export function ItemsExplosivesCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_EXPLOSIVES);
}

export function ItemsEquipment1Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_EQUIPMENT1);
}

export function ItemsEquipment2Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_EQUIPMENT2);
}

export function ItemsEquipment3Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_EQUIPMENT3);
}

export function ItemsTriggersCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_TRIGGERS);
}

export function ItemsKeysCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetEditorItemsTaskbarMode(Enum32.ITEMS_KEYS);
}

export function ItemsLeftScrollCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderTaskbar = true;
    eInfo.sScrollIndex--;
    if (!eInfo.sScrollIndex)
      DisableButton(iEditorButton[Enum32.ITEMS_LEFTSCROLL]);
    if (eInfo.sScrollIndex < ((eInfo.sNumItems + 1) / 2) - 6)
      EnableButton(iEditorButton[Enum32.ITEMS_RIGHTSCROLL]);
  }
}

export function ItemsRightScrollCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfRenderTaskbar = true;
    eInfo.sScrollIndex++;
    EnableButton(iEditorButton[Enum32.ITEMS_LEFTSCROLL]);
    if (eInfo.sScrollIndex == Math.max(((eInfo.sNumItems + 1) / 2) - 6, 0))
      DisableButton(iEditorButton[Enum32.ITEMS_RIGHTSCROLL]);
  }
}

// MERCS
export function MercsTogglePlayers(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowPlayers = btn.uiFlags & BUTTON_CLICKED_ON ? true : false;
    SetMercTeamVisibility(OUR_TEAM, gfShowCivilians);
  }
}

export function MercsToggleEnemies(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowEnemies = btn.uiFlags & BUTTON_CLICKED_ON ? true : false;
    SetMercTeamVisibility(ENEMY_TEAM, gfShowEnemies);
  }
}

export function MercsToggleCreatures(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowCreatures = btn.uiFlags & BUTTON_CLICKED_ON ? true : false;
    SetMercTeamVisibility(CREATURE_TEAM, gfShowCreatures);
  }
}

export function MercsToggleRebels(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowRebels = btn.uiFlags & BUTTON_CLICKED_ON ? true : false;
    SetMercTeamVisibility(MILITIA_TEAM, gfShowRebels);
  }
}

export function MercsToggleCivilians(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gfShowCivilians = btn.uiFlags & BUTTON_CLICKED_ON ? true : false;
    SetMercTeamVisibility(CIV_TEAM, gfShowCivilians);
  }
}

export function MercsPlayerTeamCallback(btn: GUI_BUTTON, reason: INT32): void {
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

export function MercsEnemyTeamCallback(btn: GUI_BUTTON, reason: INT32): void {
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

export function MercsCreatureTeamCallback(btn: GUI_BUTTON, reason: INT32): void {
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

export function MercsRebelTeamCallback(btn: GUI_BUTTON, reason: INT32): void {
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

export function MercsCivilianTeamCallback(btn: GUI_BUTTON, reason: INT32): void {
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

export function MercsNextCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    IndicateSelectedMerc(Enum43.SELECT_NEXT_MERC);
  }
}

export function MercsDeleteCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    DeleteSelectedMerc();
    SetMercEditingMode(Enum42.MERC_TEAMMODE);
  }
}

export function MercsInventorySlotCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let uiSlot: INT32;
    uiSlot = MSYS_GetBtnUserData(btn, 0);
    if (btn.uiFlags & BUTTON_CLICKED_ON)
      SetEnemyDroppableStatus(uiSlot, true);
    else
      SetEnemyDroppableStatus(uiSlot, false);
  }
}

export function MercsSetEnemyColorCodeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    let ubColorCode: UINT8;
    ubColorCode = MSYS_GetBtnUserData(btn, 0);
    SetEnemyColorCode(ubColorCode);
  }
}

export function MercsCivilianGroupCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    btn.uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = Enum35.TBAR_MODE_CIVILIAN_GROUP;
  }
}

export function MercsScheduleAction1Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 0;
    InitPopupMenu(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION1], Enum53.SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

export function MercsScheduleAction2Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 1;
    InitPopupMenu(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION2], Enum53.SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

export function MercsScheduleAction3Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 2;
    InitPopupMenu(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION3], Enum53.SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

export function MercsScheduleAction4Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    gubCurrentScheduleActionIndex = 3;
    InitPopupMenu(iEditorButton[Enum32.MERCS_SCHEDULE_ACTION4], Enum53.SCHEDULEACTION_POPUP, DIR_UPRIGHT);
  }
}

export function MercsScheduleToggleVariance1Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE1;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE1;
  }
}

export function MercsScheduleToggleVariance2Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE2;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE2;
  }
}

export function MercsScheduleToggleVariance3Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE3;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE3;
  }
}

export function MercsScheduleToggleVariance4Callback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON)
      gCurrSchedule.usFlags |= SCHEDULE_FLAGS_VARIANCE4;
    else
      gCurrSchedule.usFlags &= ~SCHEDULE_FLAGS_VARIANCE4;
  }
}

export function MercsScheduleData1ACallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 0;
    StartScheduleAction();
    gfSingleAction = true;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(0);
  }
}

export function MercsScheduleData1BCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 0;
    gfUseScheduleData2 = false;
    RegisterCurrentScheduleAction(gCurrSchedule.usData1[0]);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(1);
  }
}

export function MercsScheduleData2ACallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 1;
    StartScheduleAction();
    gfSingleAction = true;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(2);
  }
}

export function MercsScheduleData2BCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 1;
    gfUseScheduleData2 = false;
    RegisterCurrentScheduleAction(gCurrSchedule.usData1[1]);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(3);
  }
}

export function MercsScheduleData3ACallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 2;
    StartScheduleAction();
    gfSingleAction = true;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(4);
  }
}

export function MercsScheduleData3BCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 2;
    gfUseScheduleData2 = false;
    RegisterCurrentScheduleAction(gCurrSchedule.usData1[2]);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(5);
  }
}

export function MercsScheduleData4ACallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 3;
    StartScheduleAction();
    gfSingleAction = true;
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(6);
  }
}

export function MercsScheduleData4BCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    gubCurrentScheduleActionIndex = 3;
    gfUseScheduleData2 = false;
    RegisterCurrentScheduleAction(gCurrSchedule.usData1[3]);
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP) {
    FindScheduleGridNo(7);
  }
}

export function MercsScheduleClearCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ClearCurrentSchedule();
    ExtractAndUpdateMercSchedule();
  }
}

export function MercsDetailedPlacementCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON) // button is checked
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

export function MercsPriorityExistanceCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gpSelected) {
      if (btn.uiFlags & BUTTON_CLICKED_ON) // button is checked
      {
        gpSelected.pBasicPlacement.fPriorityExistance = true;
      } else // button is unchecked.
      {
        gpSelected.pBasicPlacement.fPriorityExistance = false;
      }
    }
  }
}

export function MercsHasKeysCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gpSelected) {
      if (btn.uiFlags & BUTTON_CLICKED_ON) // button is checked
      {
        gpSelected.pBasicPlacement.fHasKeys = true;
      } else // button is unchecked.
      {
        gpSelected.pBasicPlacement.fHasKeys = false;
      }
      if (gpSelected.pDetailedPlacement) {
        gpSelected.pDetailedPlacement.fHasKeys = gpSelected.pBasicPlacement.fHasKeys;
      }
    }
  }
}

export function MercsGeneralModeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_GENERALMODE);
}

export function MercsAttributesModeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_ATTRIBUTEMODE);
}

export function MercsInventoryModeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_INVENTORYMODE);
}

export function MercsAppearanceModeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_APPEARANCEMODE);
}

export function MercsProfileModeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_PROFILEMODE);
}

export function MercsScheduleModeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercEditingMode(Enum42.MERC_SCHEDULEMODE);
}

// multiple orders buttons
export function MercsSetOrdersCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercOrders(MSYS_GetBtnUserData(btn, 0));
}

// multiple attitude buttons
export function MercsSetAttitudeCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercAttitude(MSYS_GetBtnUserData(btn, 0));
}

// multiple direction buttons
export function MercsDirectionSetCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercDirection(MSYS_GetBtnUserData(btn, 0));
}

export function MercsFindSelectedMercCallback(btn: GUI_BUTTON, reason: INT32): void {
  let pSoldier: SOLDIERTYPE | null;
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (gsSelectedMercID == -1)
      return;
    pSoldier = GetSoldier(gsSelectedMercID);
    if (!pSoldier)
      return;
    CenterScreenAtMapIndex(pSoldier.sGridNo);
  }
}

export function MercsSetRelativeEquipmentCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercRelativeEquipment(MSYS_GetBtnUserData(btn, 0));
}

export function MercsSetRelativeAttributesCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    SetMercRelativeAttributes(MSYS_GetBtnUserData(btn, 0));
}

export function MouseMovedInMercRegion(reg: MOUSE_REGION, reason: INT32): void {
  HandleMercInventoryPanel(reg.RelativeXPos, reg.RelativeYPos, Enum44.GUI_MOVE_EVENT);
}

export function MouseClickedInMercRegion(reg: MOUSE_REGION, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    HandleMercInventoryPanel(reg.RelativeXPos, reg.RelativeYPos, Enum44.GUI_LCLICK_EVENT);
  else if (reason & MSYS_CALLBACK_REASON_RBUTTON_UP)
    HandleMercInventoryPanel(reg.RelativeXPos, reg.RelativeYPos, Enum44.GUI_RCLICK_EVENT);
}

// VARIOUS
export function BtnUndoCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    iEditorToolbarState = Enum35.TBAR_MODE_UNDO;
  }
}

export function BtnEraseCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (iDrawMode >= Enum38.DRAW_MODE_ERASE)
      btn.uiFlags &= (~BUTTON_CLICKED_ON);
    else
      btn.uiFlags |= BUTTON_CLICKED_ON;
    iEditorToolbarState = (btn.uiFlags & BUTTON_CLICKED_ON) ? (Enum35.TBAR_MODE_ERASE) : (Enum35.TBAR_MODE_ERASE_OFF);
  }
}

// ITEM STATS
export function ItemStatsToggleHideCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    if (btn.uiFlags & BUTTON_CLICKED_ON)
      ExecuteItemStatsCmd(Enum48.ITEMSTATS_HIDE);
    else
      ExecuteItemStatsCmd(Enum48.ITEMSTATS_SHOW);
  }
}

export function ItemStatsDeleteCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP)
    ExecuteItemStatsCmd(Enum48.ITEMSTATS_DELETE);
}

}
