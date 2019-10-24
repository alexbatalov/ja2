function IsFencePresentAtGridno(sGridNo: INT16): boolean {
  if (FindStructure(sGridNo, STRUCTURE_ANYFENCE) != null) {
    return true;
  }

  return false;
}

function IsRoofPresentAtGridno(sGridNo: INT16): boolean {
  if (FindStructure(sGridNo, STRUCTURE_ROOF) != null) {
    return true;
  }

  return false;
}

function IsJumpableFencePresentAtGridno(sGridNo: INT16): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_OBSTACLE);

  if (pStructure) {
    if (pStructure.value.fFlags & STRUCTURE_FENCE && !(pStructure.value.fFlags & STRUCTURE_SPECIAL)) {
      return true;
    }
    if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_SANDBAG && StructureHeight(pStructure) < 2) {
      return true;
    }
  }

  return false;
}

function IsDoorPresentAtGridno(sGridNo: INT16): boolean {
  if (FindStructure(sGridNo, STRUCTURE_ANYDOOR) != null) {
    return true;
  }

  return false;
}

function IsTreePresentAtGridno(sGridNo: INT16): boolean {
  if (FindStructure(sGridNo, STRUCTURE_TREE) != null) {
    return true;
  }

  return false;
}

function IsWallPresentAtGridno(sGridNo: INT16): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE> = null;
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  if (pStructure != null) {
    pNode = FindLevelNodeBasedOnStructure(sGridNo, pStructure);
  }

  return pNode;
}

function GetWallLevelNodeOfSameOrientationAtGridno(sGridNo: INT16, ubOrientation: INT8): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE> = null;
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  while (pStructure != null) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == ubOrientation) {
      pNode = FindLevelNodeBasedOnStructure(sGridNo, pStructure);
      return pNode;
    }
    pStructure = FindNextStructure(pStructure, STRUCTURE_WALLSTUFF);
  }

  return null;
}

function GetWallLevelNodeAndStructOfSameOrientationAtGridno(sGridNo: INT16, ubOrientation: INT8, ppStructure: Pointer<Pointer<STRUCTURE>>): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE> = null;
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;

  (ppStructure.value) = null;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  while (pStructure != null) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == ubOrientation) {
      pBaseStructure = FindBaseStructure(pStructure);
      if (pBaseStructure) {
        pNode = FindLevelNodeBasedOnStructure(pBaseStructure.value.sGridNo, pBaseStructure);
        (ppStructure.value) = pBaseStructure;
        return pNode;
      }
    }
    pStructure = FindNextStructure(pStructure, STRUCTURE_WALLSTUFF);
  }

  return null;
}

function IsDoorVisibleAtGridNo(sGridNo: INT16): boolean {
  let pStructure: Pointer<STRUCTURE>;
  let sNewGridNo: INT16;

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure != null) {
    // Check around based on orientation
    switch (pStructure.value.ubWallOrientation) {
      case Enum314.INSIDE_TOP_LEFT:
      case Enum314.OUTSIDE_TOP_LEFT:

        // Here, check north direction
        sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.NORTH));

        if (IsRoofVisible2(sNewGridNo)) {
          // OK, now check south, if true, she's not visible
          sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTH));

          if (IsRoofVisible2(sNewGridNo)) {
            return false;
          }
        }
        break;

      case Enum314.INSIDE_TOP_RIGHT:
      case Enum314.OUTSIDE_TOP_RIGHT:

        // Here, check west direction
        sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.WEST));

        if (IsRoofVisible2(sNewGridNo)) {
          // OK, now check south, if true, she's not visible
          sNewGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.EAST));

          if (IsRoofVisible2(sNewGridNo)) {
            return false;
          }
        }
        break;
    }
  }

  // Return true here, even if she does not exist
  return true;
}

function DoesGridnoContainHiddenStruct(sGridNo: INT16, pfVisible: Pointer<boolean>): boolean {
  // ATE: These are ignored now - always return false

  // STRUCTURE *pStructure;

  // pStructure = FindStructure( sGridNo, STRUCTURE_HIDDEN );

  // if ( pStructure != NULL )
  //{
  //	if ( !(gpWorldLevelData[ sGridNo ].uiFlags & MAPELEMENT_REVEALED ) && !(gTacticalStatus.uiFlags&SHOW_ALL_MERCS)  )
  //	{
  //		*pfVisible = FALSE;
  //	}
  //	else
  //	{
  //		*pfVisible = TRUE;
  //	}//
  //
  //	return( TRUE );
  //}

  return false;
}

function IsHiddenStructureVisible(sGridNo: INT16, usIndex: UINT16): boolean {
  // Check if it's a hidden struct and we have not revealed anything!
  if (gTileDatabase[usIndex].uiFlags & HIDDEN_TILE) {
    if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
      // Return false
      return false;
    }
  }

  return true;
}

function WallExistsOfTopLeftOrientation(sGridNo: INT16): boolean {
  // CJC: changing to search only for normal walls, July 16, 1998
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALL);

  while (pStructure != null) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == Enum314.INSIDE_TOP_LEFT || pStructure.value.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT) {
      return true;
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_WALL);
  }

  return false;
}

function WallExistsOfTopRightOrientation(sGridNo: INT16): boolean {
  // CJC: changing to search only for normal walls, July 16, 1998
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALL);

  while (pStructure != null) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT || pStructure.value.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) {
      return true;
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_WALL);
  }

  return false;
}

function WallOrClosedDoorExistsOfTopLeftOrientation(sGridNo: INT16): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  while (pStructure != null) {
    // skip it if it's an open door
    if (!((pStructure.value.fFlags & STRUCTURE_ANYDOOR) && (pStructure.value.fFlags & STRUCTURE_OPEN))) {
      // Check orientation
      if (pStructure.value.ubWallOrientation == Enum314.INSIDE_TOP_LEFT || pStructure.value.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT) {
        return true;
      }
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_WALLSTUFF);
  }

  return false;
}

function WallOrClosedDoorExistsOfTopRightOrientation(sGridNo: INT16): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  while (pStructure != null) {
    // skip it if it's an open door
    if (!((pStructure.value.fFlags & STRUCTURE_ANYDOOR) && (pStructure.value.fFlags & STRUCTURE_OPEN))) {
      // Check orientation
      if (pStructure.value.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT || pStructure.value.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) {
        return true;
      }
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_WALLSTUFF);
  }

  return false;
}

function OpenRightOrientedDoorWithDoorOnRightOfEdgeExists(sGridNo: INT16): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  while (pStructure != null && (pStructure.value.fFlags & STRUCTURE_OPEN)) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT || pStructure.value.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) {
      if ((pStructure.value.fFlags & STRUCTURE_DOOR) || (pStructure.value.fFlags & STRUCTURE_DDOOR_RIGHT)) {
        return true;
      }
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_ANYDOOR);
  }

  return false;
}

function OpenLeftOrientedDoorWithDoorOnLeftOfEdgeExists(sGridNo: INT16): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  while (pStructure != null && (pStructure.value.fFlags & STRUCTURE_OPEN)) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == Enum314.INSIDE_TOP_LEFT || pStructure.value.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT) {
      if ((pStructure.value.fFlags & STRUCTURE_DOOR) || (pStructure.value.fFlags & STRUCTURE_DDOOR_LEFT)) {
        return true;
      }
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_ANYDOOR);
  }

  return false;
}

function FindCuttableWireFenceAtGridNo(sGridNo: INT16): Pointer<STRUCTURE> {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WIREFENCE);
  if (pStructure != null && pStructure.value.ubWallOrientation != Enum314.NO_ORIENTATION && !(pStructure.value.fFlags & STRUCTURE_OPEN)) {
    return pStructure;
  }
  return null;
}

function CutWireFence(sGridNo: INT16): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindCuttableWireFenceAtGridNo(sGridNo);
  if (pStructure) {
    pStructure = SwapStructureForPartnerAndStoreChangeInMap(sGridNo, pStructure);
    if (pStructure) {
      RecompileLocalMovementCosts(sGridNo);
      SetRenderFlags(RENDER_FLAG_FULL);
      return true;
    }
  }
  return false;
}

function IsCuttableWireFenceAtGridNo(sGridNo: INT16): boolean {
  return FindCuttableWireFenceAtGridNo(sGridNo) != null;
}

function IsRepairableStructAtGridNo(sGridNo: INT16, pubID: Pointer<UINT8>): boolean {
  let ubMerc: UINT8;

  // OK, first look for a vehicle....
  ubMerc = WhoIsThere2(sGridNo, 0);

  if (pubID != null) {
    (pubID.value) = ubMerc;
  }

  if (ubMerc != NOBODY) {
    if (MercPtrs[ubMerc].value.uiStatusFlags & SOLDIER_VEHICLE) {
      return 2;
    }
  }
  // Then for over a robot....

  // then for SAM site....
  if (DoesSAMExistHere(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, sGridNo)) {
    return 3;
  }

  return false;
}

function IsRefuelableStructAtGridNo(sGridNo: INT16, pubID: Pointer<UINT8>): boolean {
  let ubMerc: UINT8;

  // OK, first look for a vehicle....
  ubMerc = WhoIsThere2(sGridNo, 0);

  if (pubID != null) {
    (pubID.value) = ubMerc;
  }

  if (ubMerc != NOBODY) {
    if (MercPtrs[ubMerc].value.uiStatusFlags & SOLDIER_VEHICLE) {
      return true;
    }
  }
  return false;
}

function IsCutWireFenceAtGridNo(sGridNo: INT16): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WIREFENCE);
  if (pStructure != null && (pStructure.value.ubWallOrientation != Enum314.NO_ORIENTATION) && (pStructure.value.fFlags & STRUCTURE_OPEN)) {
    return true;
  }
  return false;
}

function FindDoorAtGridNoOrAdjacent(sGridNo: INT16): INT16 {
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let sTestGridNo: INT16;

  sTestGridNo = sGridNo;
  pStructure = FindStructure(sTestGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
    return pBaseStructure.value.sGridNo;
  }

  sTestGridNo = sGridNo + DirectionInc(Enum245.NORTH);
  pStructure = FindStructure(sTestGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
    return pBaseStructure.value.sGridNo;
  }

  sTestGridNo = sGridNo + DirectionInc(Enum245.WEST);
  pStructure = FindStructure(sTestGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
    return pBaseStructure.value.sGridNo;
  }

  return NOWHERE;
}

function IsCorpseAtGridNo(sGridNo: INT16, ubLevel: UINT8): boolean {
  if (GetCorpseAtGridNo(sGridNo, ubLevel) != null) {
    return true;
  } else {
    return false;
  }
}

function SetOpenableStructureToClosed(sGridNo: INT16, ubLevel: UINT8): boolean {
  let pStructure: Pointer<STRUCTURE>;
  let pNewStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_OPENABLE);
  if (!pStructure) {
    return false;
  }

  if (pStructure.value.fFlags & STRUCTURE_OPEN) {
    pNewStructure = SwapStructureForPartner(sGridNo, pStructure);
    if (pNewStructure != null) {
      RecompileLocalMovementCosts(sGridNo);
      SetRenderFlags(RENDER_FLAG_FULL);
    }
  }
  // else leave it as is!
  return true;
}
