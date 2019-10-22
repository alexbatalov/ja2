function IsFencePresentAtGridno(sGridNo: INT16): BOOLEAN {
  if (FindStructure(sGridNo, STRUCTURE_ANYFENCE) != NULL) {
    return TRUE;
  }

  return FALSE;
}

function IsRoofPresentAtGridno(sGridNo: INT16): BOOLEAN {
  if (FindStructure(sGridNo, STRUCTURE_ROOF) != NULL) {
    return TRUE;
  }

  return FALSE;
}

function IsJumpableFencePresentAtGridno(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_OBSTACLE);

  if (pStructure) {
    if (pStructure.value.fFlags & STRUCTURE_FENCE && !(pStructure.value.fFlags & STRUCTURE_SPECIAL)) {
      return TRUE;
    }
    if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == MATERIAL_SANDBAG && StructureHeight(pStructure) < 2) {
      return TRUE;
    }
  }

  return FALSE;
}

function IsDoorPresentAtGridno(sGridNo: INT16): BOOLEAN {
  if (FindStructure(sGridNo, STRUCTURE_ANYDOOR) != NULL) {
    return TRUE;
  }

  return FALSE;
}

function IsTreePresentAtGridno(sGridNo: INT16): BOOLEAN {
  if (FindStructure(sGridNo, STRUCTURE_TREE) != NULL) {
    return TRUE;
  }

  return FALSE;
}

function IsWallPresentAtGridno(sGridNo: INT16): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE> = NULL;
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  if (pStructure != NULL) {
    pNode = FindLevelNodeBasedOnStructure(sGridNo, pStructure);
  }

  return pNode;
}

function GetWallLevelNodeOfSameOrientationAtGridno(sGridNo: INT16, ubOrientation: INT8): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE> = NULL;
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  while (pStructure != NULL) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == ubOrientation) {
      pNode = FindLevelNodeBasedOnStructure(sGridNo, pStructure);
      return pNode;
    }
    pStructure = FindNextStructure(pStructure, STRUCTURE_WALLSTUFF);
  }

  return NULL;
}

function GetWallLevelNodeAndStructOfSameOrientationAtGridno(sGridNo: INT16, ubOrientation: INT8, ppStructure: Pointer<Pointer<STRUCTURE>>): Pointer<LEVELNODE> {
  let pNode: Pointer<LEVELNODE> = NULL;
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;

  (ppStructure.value) = NULL;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  while (pStructure != NULL) {
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

  return NULL;
}

function IsDoorVisibleAtGridNo(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;
  let sNewGridNo: INT16;

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure != NULL) {
    // Check around based on orientation
    switch (pStructure.value.ubWallOrientation) {
      case INSIDE_TOP_LEFT:
      case OUTSIDE_TOP_LEFT:

        // Here, check north direction
        sNewGridNo = NewGridNo(sGridNo, DirectionInc(NORTH));

        if (IsRoofVisible2(sNewGridNo)) {
          // OK, now check south, if true, she's not visible
          sNewGridNo = NewGridNo(sGridNo, DirectionInc(SOUTH));

          if (IsRoofVisible2(sNewGridNo)) {
            return FALSE;
          }
        }
        break;

      case INSIDE_TOP_RIGHT:
      case OUTSIDE_TOP_RIGHT:

        // Here, check west direction
        sNewGridNo = NewGridNo(sGridNo, DirectionInc(WEST));

        if (IsRoofVisible2(sNewGridNo)) {
          // OK, now check south, if true, she's not visible
          sNewGridNo = NewGridNo(sGridNo, DirectionInc(EAST));

          if (IsRoofVisible2(sNewGridNo)) {
            return FALSE;
          }
        }
        break;
    }
  }

  // Return true here, even if she does not exist
  return TRUE;
}

function DoesGridnoContainHiddenStruct(sGridNo: INT16, pfVisible: Pointer<BOOLEAN>): BOOLEAN {
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

  return FALSE;
}

function IsHiddenStructureVisible(sGridNo: INT16, usIndex: UINT16): BOOLEAN {
  // Check if it's a hidden struct and we have not revealed anything!
  if (gTileDatabase[usIndex].uiFlags & HIDDEN_TILE) {
    if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
      // Return false
      return FALSE;
    }
  }

  return TRUE;
}

function WallExistsOfTopLeftOrientation(sGridNo: INT16): BOOLEAN {
  // CJC: changing to search only for normal walls, July 16, 1998
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALL);

  while (pStructure != NULL) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == INSIDE_TOP_LEFT || pStructure.value.ubWallOrientation == OUTSIDE_TOP_LEFT) {
      return TRUE;
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_WALL);
  }

  return FALSE;
}

function WallExistsOfTopRightOrientation(sGridNo: INT16): BOOLEAN {
  // CJC: changing to search only for normal walls, July 16, 1998
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALL);

  while (pStructure != NULL) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == INSIDE_TOP_RIGHT || pStructure.value.ubWallOrientation == OUTSIDE_TOP_RIGHT) {
      return TRUE;
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_WALL);
  }

  return FALSE;
}

function WallOrClosedDoorExistsOfTopLeftOrientation(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  while (pStructure != NULL) {
    // skip it if it's an open door
    if (!((pStructure.value.fFlags & STRUCTURE_ANYDOOR) && (pStructure.value.fFlags & STRUCTURE_OPEN))) {
      // Check orientation
      if (pStructure.value.ubWallOrientation == INSIDE_TOP_LEFT || pStructure.value.ubWallOrientation == OUTSIDE_TOP_LEFT) {
        return TRUE;
      }
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_WALLSTUFF);
  }

  return FALSE;
}

function WallOrClosedDoorExistsOfTopRightOrientation(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WALLSTUFF);

  while (pStructure != NULL) {
    // skip it if it's an open door
    if (!((pStructure.value.fFlags & STRUCTURE_ANYDOOR) && (pStructure.value.fFlags & STRUCTURE_OPEN))) {
      // Check orientation
      if (pStructure.value.ubWallOrientation == INSIDE_TOP_RIGHT || pStructure.value.ubWallOrientation == OUTSIDE_TOP_RIGHT) {
        return TRUE;
      }
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_WALLSTUFF);
  }

  return FALSE;
}

function OpenRightOrientedDoorWithDoorOnRightOfEdgeExists(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  while (pStructure != NULL && (pStructure.value.fFlags & STRUCTURE_OPEN)) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == INSIDE_TOP_RIGHT || pStructure.value.ubWallOrientation == OUTSIDE_TOP_RIGHT) {
      if ((pStructure.value.fFlags & STRUCTURE_DOOR) || (pStructure.value.fFlags & STRUCTURE_DDOOR_RIGHT)) {
        return TRUE;
      }
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_ANYDOOR);
  }

  return FALSE;
}

function OpenLeftOrientedDoorWithDoorOnLeftOfEdgeExists(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);

  while (pStructure != NULL && (pStructure.value.fFlags & STRUCTURE_OPEN)) {
    // Check orientation
    if (pStructure.value.ubWallOrientation == INSIDE_TOP_LEFT || pStructure.value.ubWallOrientation == OUTSIDE_TOP_LEFT) {
      if ((pStructure.value.fFlags & STRUCTURE_DOOR) || (pStructure.value.fFlags & STRUCTURE_DDOOR_LEFT)) {
        return TRUE;
      }
    }

    pStructure = FindNextStructure(pStructure, STRUCTURE_ANYDOOR);
  }

  return FALSE;
}

function FindCuttableWireFenceAtGridNo(sGridNo: INT16): Pointer<STRUCTURE> {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WIREFENCE);
  if (pStructure != NULL && pStructure.value.ubWallOrientation != NO_ORIENTATION && !(pStructure.value.fFlags & STRUCTURE_OPEN)) {
    return pStructure;
  }
  return NULL;
}

function CutWireFence(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindCuttableWireFenceAtGridNo(sGridNo);
  if (pStructure) {
    pStructure = SwapStructureForPartnerAndStoreChangeInMap(sGridNo, pStructure);
    if (pStructure) {
      RecompileLocalMovementCosts(sGridNo);
      SetRenderFlags(RENDER_FLAG_FULL);
      return TRUE;
    }
  }
  return FALSE;
}

function IsCuttableWireFenceAtGridNo(sGridNo: INT16): BOOLEAN {
  return FindCuttableWireFenceAtGridNo(sGridNo) != NULL;
}

function IsRepairableStructAtGridNo(sGridNo: INT16, pubID: Pointer<UINT8>): BOOLEAN {
  let ubMerc: UINT8;

  // OK, first look for a vehicle....
  ubMerc = WhoIsThere2(sGridNo, 0);

  if (pubID != NULL) {
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

  return FALSE;
}

function IsRefuelableStructAtGridNo(sGridNo: INT16, pubID: Pointer<UINT8>): BOOLEAN {
  let ubMerc: UINT8;

  // OK, first look for a vehicle....
  ubMerc = WhoIsThere2(sGridNo, 0);

  if (pubID != NULL) {
    (pubID.value) = ubMerc;
  }

  if (ubMerc != NOBODY) {
    if (MercPtrs[ubMerc].value.uiStatusFlags & SOLDIER_VEHICLE) {
      return TRUE;
    }
  }
  return FALSE;
}

function IsCutWireFenceAtGridNo(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_WIREFENCE);
  if (pStructure != NULL && (pStructure.value.ubWallOrientation != NO_ORIENTATION) && (pStructure.value.fFlags & STRUCTURE_OPEN)) {
    return TRUE;
  }
  return FALSE;
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

  sTestGridNo = sGridNo + DirectionInc(NORTH);
  pStructure = FindStructure(sTestGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
    return pBaseStructure.value.sGridNo;
  }

  sTestGridNo = sGridNo + DirectionInc(WEST);
  pStructure = FindStructure(sTestGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
    return pBaseStructure.value.sGridNo;
  }

  return NOWHERE;
}

function IsCorpseAtGridNo(sGridNo: INT16, ubLevel: UINT8): BOOLEAN {
  if (GetCorpseAtGridNo(sGridNo, ubLevel) != NULL) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function SetOpenableStructureToClosed(sGridNo: INT16, ubLevel: UINT8): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;
  let pNewStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_OPENABLE);
  if (!pStructure) {
    return FALSE;
  }

  if (pStructure.value.fFlags & STRUCTURE_OPEN) {
    pNewStructure = SwapStructureForPartner(sGridNo, pStructure);
    if (pNewStructure != NULL) {
      RecompileLocalMovementCosts(sGridNo);
      SetRenderFlags(RENDER_FLAG_FULL);
    }
  }
  // else leave it as is!
  return TRUE;
}
