namespace ja2 {

// This method isn't foolproof, but because erasing large areas of buildings could result in
// multiple wall types for each building.  When processing the region, it is necessary to
// calculate the roof type by searching for the nearest roof tile.
export function SearchForWallType(iMapIndex: UINT32): UINT16 {
  let uiTileType: UINT32;
  let pWall: LEVELNODE | null;
  let sOffset: INT16;
  let x: INT16;
  let y: INT16;
  let sRadius: INT16 = 0;
  if (gfBasement) {
    let usWallType: UINT16;
    usWallType = GetRandomIndexByRange(Enum313.FIRSTWALL, LASTWALL);
    if (usWallType == 0xffff)
      usWallType = Enum313.FIRSTWALL;
    return usWallType;
  }
  while (sRadius < 32) {
    // NOTE:  start at the higher y value and go negative because it is possible to have another
    // structure type one tile north, but not one tile south -- so it'll find the correct wall first.
    for (y = sRadius; y >= -sRadius; y--)
      for (x = -sRadius; x <= sRadius; x++) {
        if (Math.abs(x) == Math.abs(sRadius) || Math.abs(y) == Math.abs(sRadius)) {
          sOffset = y * WORLD_COLS + x;
          if (!GridNoOnVisibleWorldTile((iMapIndex + sOffset))) {
            continue;
          }
          pWall = gpWorldLevelData[iMapIndex + sOffset].pStructHead;
          while (pWall) {
            uiTileType = GetTileType(pWall.usIndex);
            if (uiTileType >= Enum313.FIRSTWALL && uiTileType <= LASTWALL) {
              // found a roof, so return its type.
              return uiTileType;
            }
            // if( uiTileType >= FIRSTWINDOW && uiTileType <= LASTWINDOW )
            //{	//Window types can be converted to a wall type.
            //	return (UINT16)(FIRSTWALL + uiTileType - FIRSTWINDOW );
            //}
            pWall = pWall.pNext;
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
export function SearchForRoofType(iMapIndex: UINT32): UINT16 {
  let uiTileType: UINT32;
  let pRoof: LEVELNODE | null;
  let x: INT16;
  let y: INT16;
  let sRadius: INT16 = 0;
  let sOffset: INT16;
  while (sRadius < 32) {
    for (y = -sRadius; y <= sRadius; y++)
      for (x = -sRadius; x <= sRadius; x++) {
        if (Math.abs(x) == Math.abs(sRadius) || Math.abs(y) == Math.abs(sRadius)) {
          sOffset = y * WORLD_COLS + x;
          if (!GridNoOnVisibleWorldTile((iMapIndex + sOffset))) {
            continue;
          }
          pRoof = gpWorldLevelData[iMapIndex + sOffset].pRoofHead;
          while (pRoof) {
            uiTileType = GetTileType(pRoof.usIndex);
            if (uiTileType >= Enum313.FIRSTROOF && uiTileType <= LASTROOF) {
              // found a roof, so return its type.
              return uiTileType;
            }
            pRoof = pRoof.pNext;
          }
        }
      }
    sRadius++;
  }
  return 0xffff;
}

function RoofAtGridNo(iMapIndex: UINT32): boolean {
  let pRoof: LEVELNODE | null;
  let uiTileType: UINT32;
  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;
  // Look through all objects and Search for type
  while (pRoof) {
    if (pRoof.usIndex != NO_TILE) {
      uiTileType = GetTileType(pRoof.usIndex);
      if (uiTileType >= Enum313.FIRSTROOF && uiTileType <= Enum313.SECONDSLANTROOF)
        return true;
      pRoof = pRoof.pNext;
    }
  }
  return false;
}

export function BuildingAtGridNo(iMapIndex: UINT32): boolean {
  if (RoofAtGridNo(iMapIndex))
    return true;
  if (FloorAtGridNo(iMapIndex))
    return true;
  return false;
}

export function ValidDecalPlacement(iMapIndex: UINT32): boolean {
  if (GetVerticalWall(iMapIndex) || GetHorizontalWall(iMapIndex) || GetVerticalFence(iMapIndex) || GetHorizontalFence(iMapIndex))
    return true;
  return false;
}

export function GetVerticalWall(iMapIndex: UINT32): LEVELNODE | null {
  let pStruct: LEVELNODE | null;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;
  pStruct = gpWorldLevelData[iMapIndex].pStructHead;
  while (pStruct) {
    if (pStruct.usIndex != NO_TILE) {
      uiTileType = GetTileType(pStruct.usIndex);
      if (uiTileType >= Enum313.FIRSTWALL && uiTileType <= LASTWALL || uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
        usWallOrientation = GetWallOrientation(pStruct.usIndex);
        if (usWallOrientation == Enum314.INSIDE_TOP_RIGHT || usWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) {
          return pStruct;
        }
      }
    }
    pStruct = pStruct.pNext;
  }
  return null;
}

export function GetHorizontalWall(iMapIndex: UINT32): LEVELNODE | null {
  let pStruct: LEVELNODE | null;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;
  pStruct = gpWorldLevelData[iMapIndex].pStructHead;
  while (pStruct) {
    if (pStruct.usIndex != NO_TILE) {
      uiTileType = GetTileType(pStruct.usIndex);
      if (uiTileType >= Enum313.FIRSTWALL && uiTileType <= LASTWALL || uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
        usWallOrientation = GetWallOrientation(pStruct.usIndex);
        if (usWallOrientation == Enum314.INSIDE_TOP_LEFT || usWallOrientation == Enum314.OUTSIDE_TOP_LEFT) {
          return pStruct;
        }
      }
    }
    pStruct = pStruct.pNext;
  }
  return null;
}

export function GetVerticalWallType(iMapIndex: UINT32): UINT16 {
  let pWall: LEVELNODE | null;
  let uiTileType: UINT32;
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    uiTileType = GetTileType(pWall.usIndex);
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR)
      uiTileType = SearchForWallType(iMapIndex);
    return uiTileType;
  }
  return 0;
}

export function GetHorizontalWallType(iMapIndex: UINT32): UINT16 {
  let pWall: LEVELNODE | null;
  let uiTileType: UINT32;
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    uiTileType = GetTileType(pWall.usIndex);
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR)
      uiTileType = SearchForWallType(iMapIndex);
    return uiTileType;
  }
  return 0;
}

function GetVerticalFence(iMapIndex: UINT32): LEVELNODE | null {
  let pStruct: LEVELNODE | null;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;
  pStruct = gpWorldLevelData[iMapIndex].pStructHead;
  while (pStruct) {
    if (pStruct.usIndex != NO_TILE) {
      uiTileType = GetTileType(pStruct.usIndex);
      if (uiTileType == Enum313.FENCESTRUCT) {
        usWallOrientation = GetWallOrientation(pStruct.usIndex);
        if (usWallOrientation == Enum314.INSIDE_TOP_RIGHT || usWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) {
          return pStruct;
        }
      }
    }
    pStruct = pStruct.pNext;
  }
  return null;
}

function GetHorizontalFence(iMapIndex: UINT32): LEVELNODE | null {
  let pStruct: LEVELNODE | null;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;
  pStruct = gpWorldLevelData[iMapIndex].pStructHead;
  while (pStruct) {
    if (pStruct.usIndex != NO_TILE) {
      uiTileType = GetTileType(pStruct.usIndex);
      if (uiTileType == Enum313.FENCESTRUCT) {
        usWallOrientation = GetWallOrientation(pStruct.usIndex);
        if (usWallOrientation == Enum314.INSIDE_TOP_LEFT || usWallOrientation == Enum314.OUTSIDE_TOP_LEFT) {
          return pStruct;
        }
      }
    }
    pStruct = pStruct.pNext;
  }
  return null;
}

export function EraseHorizontalWall(iMapIndex: UINT32): void {
  let pWall: LEVELNODE | null;
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    AddToUndoList(iMapIndex);
    RemoveStruct(iMapIndex, pWall.usIndex);
    RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTWALL, LASTWALL);
  }
}

export function EraseVerticalWall(iMapIndex: UINT32): void {
  let pWall: LEVELNODE | null;
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    AddToUndoList(iMapIndex);
    RemoveStruct(iMapIndex, pWall.usIndex);
    RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTWALL, LASTWALL);
  }
}

function ChangeHorizontalWall(iMapIndex: UINT32, usNewPiece: UINT16): void {
  let pWall: LEVELNODE | null;
  let uiTileType: UINT32;
  let usTileIndex: UINT16;
  let sIndex: INT16;
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    uiTileType = GetTileType(pWall.usIndex);
    if (uiTileType >= Enum313.FIRSTWALL && uiTileType <= LASTWALL) {
      // Okay, we have the wall, now change it's type.
      sIndex = PickAWallPiece(usNewPiece);
      AddToUndoList(iMapIndex);
      usTileIndex = GetTileIndexFromTypeSubIndex(uiTileType, sIndex);
      ReplaceStructIndex(iMapIndex, pWall.usIndex, usTileIndex);
    }
  }
}

export function ChangeVerticalWall(iMapIndex: UINT32, usNewPiece: UINT16): void {
  let pWall: LEVELNODE | null;
  let uiTileType: UINT32;
  let usTileIndex: UINT16;
  let sIndex: INT16;
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    uiTileType = GetTileType(pWall.usIndex);
    if (uiTileType >= Enum313.FIRSTWALL && uiTileType <= LASTWALL) {
      // Okay, we have the wall, now change it's type.
      sIndex = PickAWallPiece(usNewPiece);
      AddToUndoList(iMapIndex);
      usTileIndex = GetTileIndexFromTypeSubIndex(uiTileType, sIndex);
      ReplaceStructIndex(iMapIndex, pWall.usIndex, usTileIndex);
    }
  }
}

export function RestoreWalls(iMapIndex: UINT32): void {
  let pWall: LEVELNODE | null;
  let uiTileType: UINT32;
  let usWallType: UINT16;
  let usWallOrientation: UINT16;
  let ubSaveWallUIValue: UINT8;
  let fDone: boolean = false;

  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    uiTileType = GetTileType(pWall.usIndex);
    usWallType = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR)
      usWallType = SearchForWallType(iMapIndex);
    usWallOrientation = GetWallOrientation(pWall.usIndex);
    AddToUndoList(iMapIndex);
    RemoveStruct(iMapIndex, pWall.usIndex);
    RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTWALL, LASTWALL);
    switch (usWallOrientation) {
      case Enum314.OUTSIDE_TOP_LEFT:
        BuildWallPiece(iMapIndex, Enum61.INTERIOR_BOTTOM, usWallType);
        break;
      case Enum314.INSIDE_TOP_LEFT:
        BuildWallPiece(iMapIndex, Enum61.EXTERIOR_BOTTOM, usWallType);
        break;
    }
    fDone = true;
  }
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    uiTileType = GetTileType(pWall.usIndex);
    usWallType = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR)
      usWallType = SearchForWallType(iMapIndex);
    usWallOrientation = GetWallOrientation(pWall.usIndex);
    AddToUndoList(iMapIndex);
    RemoveStruct(iMapIndex, pWall.usIndex);
    RemoveAllShadowsOfTypeRange(iMapIndex, Enum313.FIRSTWALL, LASTWALL);
    switch (usWallOrientation) {
      case Enum314.OUTSIDE_TOP_RIGHT:
        BuildWallPiece(iMapIndex, Enum61.INTERIOR_RIGHT, usWallType);
        break;
      case Enum314.INSIDE_TOP_RIGHT:
        BuildWallPiece(iMapIndex, Enum61.EXTERIOR_RIGHT, usWallType);
        break;
    }
    fDone = true;
  }
  if (fDone) {
    return;
  }
  // we are in a special case here.  The user is attempting to restore a wall, though nothing
  // is here.  We will hook into the smart wall method by tricking it into using the local wall
  // type, but only if we have adjacent walls.
  fDone = false;
  if (pWall = GetHorizontalWall(iMapIndex - 1))
    fDone = true;
  if (!fDone && (pWall = GetHorizontalWall(iMapIndex + 1)))
    fDone = true;
  if (!fDone && (pWall = GetVerticalWall(iMapIndex - WORLD_COLS)))
    fDone = true;
  if (!fDone && (pWall = GetVerticalWall(iMapIndex + WORLD_COLS)))
    fDone = true;
  if (!fDone)
    return;
  // found a wall.  Let's back up the current wall value, and restore it after pasting a smart wall.
  if (pWall) {
    uiTileType = GetTileType(pWall.usIndex);
    usWallType = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR)
      usWallType = SearchForWallType(iMapIndex);
    if (usWallType != 0xffff) {
      ubSaveWallUIValue = gubWallUIValue; // save the wall UI value.
      gubWallUIValue = usWallType; // trick the UI value
      PasteSmartWall(iMapIndex); // paste smart wall with fake UI value
      gubWallUIValue = ubSaveWallUIValue; // restore the real UI value.
    }
  }
}

function GetWallClass(pWall: LEVELNODE | null): UINT16 {
  let row: UINT16;
  let col: UINT16;
  let rowVariants: UINT16;
  let usWallIndex: UINT16;
  if (!pWall)
    return 0xffff;
  usWallIndex = GetSubIndexFromTileIndex(pWall.usIndex);
  for (row = 0; row < Enum60.NUM_WALL_TYPES; row++) {
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
  let pWall: LEVELNODE | null;
  if (pWall = GetVerticalWall(iMapIndex))
    return GetWallClass(pWall);
  return 0xffff;
}

function GetHorizontalWallClass(iMapIndex: UINT16): UINT16 {
  let pWall: LEVELNODE | null;
  if (pWall = GetVerticalWall(iMapIndex))
    return GetWallClass(pWall);
  return 0xffff;
}

}
