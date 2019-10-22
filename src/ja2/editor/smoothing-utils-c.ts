// This method isn't foolproof, but because erasing large areas of buildings could result in
// multiple wall types for each building.  When processing the region, it is necessary to
// calculate the roof type by searching for the nearest roof tile.
function SearchForWallType(iMapIndex: UINT32): UINT16 {
  let uiTileType: UINT32;
  let pWall: Pointer<LEVELNODE>;
  let sOffset: INT16;
  let x: INT16;
  let y: INT16;
  let sRadius: INT16 = 0;
  if (gfBasement) {
    let usWallType: UINT16;
    usWallType = GetRandomIndexByRange(FIRSTWALL, LASTWALL);
    if (usWallType == 0xffff)
      usWallType = FIRSTWALL;
    return usWallType;
  }
  while (sRadius < 32) {
    // NOTE:  start at the higher y value and go negative because it is possible to have another
    // structure type one tile north, but not one tile south -- so it'll find the correct wall first.
    for (y = sRadius; y >= -sRadius; y--)
      for (x = -sRadius; x <= sRadius; x++) {
        if (abs(x) == abs(sRadius) || abs(y) == abs(sRadius)) {
          sOffset = y * WORLD_COLS + x;
          if (!GridNoOnVisibleWorldTile((iMapIndex + sOffset))) {
            continue;
          }
          pWall = gpWorldLevelData[iMapIndex + sOffset].pStructHead;
          while (pWall) {
            GetTileType(pWall->usIndex, &uiTileType);
            if (uiTileType >= FIRSTWALL && uiTileType <= LASTWALL) {
              // found a roof, so return its type.
              return uiTileType;
            }
            // if( uiTileType >= FIRSTWINDOW && uiTileType <= LASTWINDOW )
            //{	//Window types can be converted to a wall type.
            //	return (UINT16)(FIRSTWALL + uiTileType - FIRSTWINDOW );
            //}
            pWall = pWall->pNext;
          }
        }
      }
    sRadius++;
  }
  return 0xffff;
}

// This method isn't foolproof, but because erasing large areas of buildings could result in
// multiple roof types for each building.  When processing the region, it is necessary to
// calculate the roof type by searching for the nearest roof tile.
function SearchForRoofType(iMapIndex: UINT32): UINT16 {
  let uiTileType: UINT32;
  let pRoof: Pointer<LEVELNODE>;
  let x: INT16;
  let y: INT16;
  let sRadius: INT16 = 0;
  let sOffset: INT16;
  while (sRadius < 32) {
    for (y = -sRadius; y <= sRadius; y++)
      for (x = -sRadius; x <= sRadius; x++) {
        if (abs(x) == abs(sRadius) || abs(y) == abs(sRadius)) {
          sOffset = y * WORLD_COLS + x;
          if (!GridNoOnVisibleWorldTile((iMapIndex + sOffset))) {
            continue;
          }
          pRoof = gpWorldLevelData[iMapIndex + sOffset].pRoofHead;
          while (pRoof) {
            GetTileType(pRoof->usIndex, &uiTileType);
            if (uiTileType >= FIRSTROOF && uiTileType <= LASTROOF) {
              // found a roof, so return its type.
              return uiTileType;
            }
            pRoof = pRoof->pNext;
          }
        }
      }
    sRadius++;
  }
  return 0xffff;
}

function RoofAtGridNo(iMapIndex: UINT32): BOOLEAN {
  let pRoof: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;
  // Look through all objects and Search for type
  while (pRoof) {
    if (pRoof->usIndex != NO_TILE) {
      GetTileType(pRoof->usIndex, &uiTileType);
      if (uiTileType >= FIRSTROOF && uiTileType <= SECONDSLANTROOF)
        return TRUE;
      pRoof = pRoof->pNext;
    }
  }
  return FALSE;
}

function BuildingAtGridNo(iMapIndex: UINT32): BOOLEAN {
  if (RoofAtGridNo(iMapIndex))
    return TRUE;
  if (FloorAtGridNo(iMapIndex))
    return TRUE;
  return FALSE;
}

function ValidDecalPlacement(iMapIndex: UINT32): BOOLEAN {
  if (GetVerticalWall(iMapIndex) || GetHorizontalWall(iMapIndex) || GetVerticalFence(iMapIndex) || GetHorizontalFence(iMapIndex))
    return TRUE;
  return FALSE;
}

function GetVerticalWall(iMapIndex: UINT32): Pointer<LEVELNODE> {
  let pStruct: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;
  pStruct = gpWorldLevelData[iMapIndex].pStructHead;
  while (pStruct) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileType(pStruct->usIndex, &uiTileType);
      if (uiTileType >= FIRSTWALL && uiTileType <= LASTWALL || uiTileType >= FIRSTDOOR && uiTileType <= LASTDOOR) {
        GetWallOrientation(pStruct->usIndex, &usWallOrientation);
        if (usWallOrientation == INSIDE_TOP_RIGHT || usWallOrientation == OUTSIDE_TOP_RIGHT) {
          return pStruct;
        }
      }
    }
    pStruct = pStruct->pNext;
  }
  return NULL;
}

function GetHorizontalWall(iMapIndex: UINT32): Pointer<LEVELNODE> {
  let pStruct: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;
  pStruct = gpWorldLevelData[iMapIndex].pStructHead;
  while (pStruct) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileType(pStruct->usIndex, &uiTileType);
      if (uiTileType >= FIRSTWALL && uiTileType <= LASTWALL || uiTileType >= FIRSTDOOR && uiTileType <= LASTDOOR) {
        GetWallOrientation(pStruct->usIndex, &usWallOrientation);
        if (usWallOrientation == INSIDE_TOP_LEFT || usWallOrientation == OUTSIDE_TOP_LEFT) {
          return pStruct;
        }
      }
    }
    pStruct = pStruct->pNext;
  }
  return NULL;
}

function GetVerticalWallType(iMapIndex: UINT32): UINT16 {
  let pWall: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall->usIndex, &uiTileType);
    if (uiTileType >= FIRSTDOOR && uiTileType <= LASTDOOR)
      uiTileType = SearchForWallType(iMapIndex);
    return uiTileType;
  }
  return 0;
}

function GetHorizontalWallType(iMapIndex: UINT32): UINT16 {
  let pWall: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall->usIndex, &uiTileType);
    if (uiTileType >= FIRSTDOOR && uiTileType <= LASTDOOR)
      uiTileType = SearchForWallType(iMapIndex);
    return uiTileType;
  }
  return 0;
}

function GetVerticalFence(iMapIndex: UINT32): Pointer<LEVELNODE> {
  let pStruct: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;
  pStruct = gpWorldLevelData[iMapIndex].pStructHead;
  while (pStruct) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileType(pStruct->usIndex, &uiTileType);
      if (uiTileType == FENCESTRUCT) {
        GetWallOrientation(pStruct->usIndex, &usWallOrientation);
        if (usWallOrientation == INSIDE_TOP_RIGHT || usWallOrientation == OUTSIDE_TOP_RIGHT) {
          return pStruct;
        }
      }
    }
    pStruct = pStruct->pNext;
  }
  return NULL;
}

function GetHorizontalFence(iMapIndex: UINT32): Pointer<LEVELNODE> {
  let pStruct: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;
  pStruct = gpWorldLevelData[iMapIndex].pStructHead;
  while (pStruct) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileType(pStruct->usIndex, &uiTileType);
      if (uiTileType == FENCESTRUCT) {
        GetWallOrientation(pStruct->usIndex, &usWallOrientation);
        if (usWallOrientation == INSIDE_TOP_LEFT || usWallOrientation == OUTSIDE_TOP_LEFT) {
          return pStruct;
        }
      }
    }
    pStruct = pStruct->pNext;
  }
  return NULL;
}

function EraseHorizontalWall(iMapIndex: UINT32): void {
  let pWall: Pointer<LEVELNODE>;
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    AddToUndoList(iMapIndex);
    RemoveStruct(iMapIndex, pWall->usIndex);
    RemoveAllShadowsOfTypeRange(iMapIndex, FIRSTWALL, LASTWALL);
  }
}

function EraseVerticalWall(iMapIndex: UINT32): void {
  let pWall: Pointer<LEVELNODE>;
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    AddToUndoList(iMapIndex);
    RemoveStruct(iMapIndex, pWall->usIndex);
    RemoveAllShadowsOfTypeRange(iMapIndex, FIRSTWALL, LASTWALL);
  }
}

function ChangeHorizontalWall(iMapIndex: UINT32, usNewPiece: UINT16): void {
  let pWall: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  let usTileIndex: UINT16;
  let sIndex: INT16;
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall->usIndex, &uiTileType);
    if (uiTileType >= FIRSTWALL && uiTileType <= LASTWALL) {
      // Okay, we have the wall, now change it's type.
      sIndex = PickAWallPiece(usNewPiece);
      AddToUndoList(iMapIndex);
      GetTileIndexFromTypeSubIndex(uiTileType, sIndex, &usTileIndex);
      ReplaceStructIndex(iMapIndex, pWall->usIndex, usTileIndex);
    }
  }
}

function ChangeVerticalWall(iMapIndex: UINT32, usNewPiece: UINT16): void {
  let pWall: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  let usTileIndex: UINT16;
  let sIndex: INT16;
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall->usIndex, &uiTileType);
    if (uiTileType >= FIRSTWALL && uiTileType <= LASTWALL) {
      // Okay, we have the wall, now change it's type.
      sIndex = PickAWallPiece(usNewPiece);
      AddToUndoList(iMapIndex);
      GetTileIndexFromTypeSubIndex(uiTileType, sIndex, &usTileIndex);
      ReplaceStructIndex(iMapIndex, pWall->usIndex, usTileIndex);
    }
  }
}

function RestoreWalls(iMapIndex: UINT32): void {
  let pWall: Pointer<LEVELNODE> = NULL;
  let uiTileType: UINT32;
  let usWallType: UINT16;
  let usWallOrientation: UINT16;
  let ubSaveWallUIValue: UINT8;
  let fDone: BOOLEAN = FALSE;

  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall->usIndex, &uiTileType);
    usWallType = uiTileType;
    if (uiTileType >= FIRSTDOOR && uiTileType <= LASTDOOR)
      usWallType = SearchForWallType(iMapIndex);
    GetWallOrientation(pWall->usIndex, &usWallOrientation);
    AddToUndoList(iMapIndex);
    RemoveStruct(iMapIndex, pWall->usIndex);
    RemoveAllShadowsOfTypeRange(iMapIndex, FIRSTWALL, LASTWALL);
    switch (usWallOrientation) {
      case OUTSIDE_TOP_LEFT:
        BuildWallPiece(iMapIndex, INTERIOR_BOTTOM, usWallType);
        break;
      case INSIDE_TOP_LEFT:
        BuildWallPiece(iMapIndex, EXTERIOR_BOTTOM, usWallType);
        break;
    }
    fDone = TRUE;
  }
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall->usIndex, &uiTileType);
    usWallType = uiTileType;
    if (uiTileType >= FIRSTDOOR && uiTileType <= LASTDOOR)
      usWallType = SearchForWallType(iMapIndex);
    GetWallOrientation(pWall->usIndex, &usWallOrientation);
    AddToUndoList(iMapIndex);
    RemoveStruct(iMapIndex, pWall->usIndex);
    RemoveAllShadowsOfTypeRange(iMapIndex, FIRSTWALL, LASTWALL);
    switch (usWallOrientation) {
      case OUTSIDE_TOP_RIGHT:
        BuildWallPiece(iMapIndex, INTERIOR_RIGHT, usWallType);
        break;
      case INSIDE_TOP_RIGHT:
        BuildWallPiece(iMapIndex, EXTERIOR_RIGHT, usWallType);
        break;
    }
    fDone = TRUE;
  }
  if (fDone) {
    return;
  }
  // we are in a special case here.  The user is attempting to restore a wall, though nothing
  // is here.  We will hook into the smart wall method by tricking it into using the local wall
  // type, but only if we have adjacent walls.
  fDone = FALSE;
  if (pWall = GetHorizontalWall(iMapIndex - 1))
    fDone = TRUE;
  if (!fDone && (pWall = GetHorizontalWall(iMapIndex + 1)))
    fDone = TRUE;
  if (!fDone && (pWall = GetVerticalWall(iMapIndex - WORLD_COLS)))
    fDone = TRUE;
  if (!fDone && (pWall = GetVerticalWall(iMapIndex + WORLD_COLS)))
    fDone = TRUE;
  if (!fDone)
    return;
  // found a wall.  Let's back up the current wall value, and restore it after pasting a smart wall.
  if (pWall) {
    GetTileType(pWall->usIndex, &uiTileType);
    usWallType = uiTileType;
    if (uiTileType >= FIRSTDOOR && uiTileType <= LASTDOOR)
      usWallType = SearchForWallType(iMapIndex);
    if (usWallType != 0xffff) {
      ubSaveWallUIValue = gubWallUIValue; // save the wall UI value.
      gubWallUIValue = usWallType; // trick the UI value
      PasteSmartWall(iMapIndex); // paste smart wall with fake UI value
      gubWallUIValue = ubSaveWallUIValue; // restore the real UI value.
    }
  }
}

function GetWallClass(pWall: Pointer<LEVELNODE>): UINT16 {
  let row: UINT16;
  let col: UINT16;
  let rowVariants: UINT16;
  let usWallIndex: UINT16;
  if (!pWall)
    return 0xffff;
  GetSubIndexFromTileIndex(pWall->usIndex, &usWallIndex);
  for (row = 0; row < NUM_WALL_TYPES; row++) {
    rowVariants = gbWallTileLUT[row][0];
    for (col = 1; col <= rowVariants; col++) {
      if (usWallIndex == gbWallTileLUT[row][col]) {
        return row; // row is the wall class
      }
    }
  }
  return 0xffff;
}

function GetVerticalWallClass(iMapIndex: UINT16): UINT16 {
  let pWall: Pointer<LEVELNODE>;
  if (pWall = GetVerticalWall(iMapIndex))
    return GetWallClass(pWall);
  return 0xffff;
}

function GetHorizontalWallClass(iMapIndex: UINT16): UINT16 {
  let pWall: Pointer<LEVELNODE>;
  if (pWall = GetVerticalWall(iMapIndex))
    return GetWallClass(pWall);
  return 0xffff;
}
