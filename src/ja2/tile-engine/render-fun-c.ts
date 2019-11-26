namespace ja2 {

// Room Information
export let gubWorldRoomInfo: UINT8[] /* [WORLD_MAX] */;
export let gubWorldRoomHidden: UINT8[] /* [MAX_ROOMS] */;

export function InitRoomDatabase(): boolean {
  memset(gubWorldRoomInfo, NO_ROOM, sizeof(gubWorldRoomInfo));
  memset(gubWorldRoomHidden, true, sizeof(gubWorldRoomHidden));
  return true;
}

export function ShutdownRoomDatabase(): void {
}

function SetTileRoomNum(sGridNo: INT16, ubRoomNum: UINT8): void {
  // Add to global room list
  gubWorldRoomInfo[sGridNo] = ubRoomNum;
}

function SetTileRangeRoomNum(pSelectRegion: Pointer<SGPRect>, ubRoomNum: UINT8): void {
  let cnt1: INT32;
  let cnt2: INT32;

  for (cnt1 = pSelectRegion.value.iTop; cnt1 <= pSelectRegion.value.iBottom; cnt1++) {
    for (cnt2 = pSelectRegion.value.iLeft; cnt2 <= pSelectRegion.value.iRight; cnt2++) {
      gubWorldRoomInfo[MAPROWCOLTOPOS(cnt1, cnt2)] = ubRoomNum;
    }
  }
}

export function InARoom(sGridNo: UINT16, pubRoomNo: Pointer<UINT8>): boolean {
  if (gubWorldRoomInfo[sGridNo] != NO_ROOM) {
    if (pubRoomNo) {
      pubRoomNo.value = gubWorldRoomInfo[sGridNo];
    }
    return true;
  }

  return false;
}

export function InAHiddenRoom(sGridNo: UINT16, pubRoomNo: Pointer<UINT8>): boolean {
  if (gubWorldRoomInfo[sGridNo] != NO_ROOM) {
    if ((gubWorldRoomHidden[gubWorldRoomInfo[sGridNo]])) {
      pubRoomNo.value = gubWorldRoomInfo[sGridNo];
      return true;
    }
  }

  return false;
}

// @@ATECLIP TO WORLD!
export function SetRecalculateWireFrameFlagRadius(sX: INT16, sY: INT16, sRadius: INT16): void {
  let sCountX: INT16;
  let sCountY: INT16;
  let uiTile: UINT32;

  for (sCountY = sY - sRadius; sCountY < (sY + sRadius + 2); sCountY++) {
    for (sCountX = sX - sRadius; sCountX < (sX + sRadius + 2); sCountX++) {
      uiTile = MAPROWCOLTOPOS(sCountY, sCountX);

      gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_RECALCULATE_WIREFRAMES;
    }
  }
}

export function SetGridNoRevealedFlag(sGridNo: UINT16): void {
  //	UINT32 cnt;
  //  ITEM_POOL					*pItemPool;
  //	INT16							sX, sY;
  let pNode: Pointer<LEVELNODE> = null;
  let pStructure: Pointer<STRUCTURE>;
  let pBase: Pointer<STRUCTURE>;

  // Set hidden flag, for any roofs
  SetRoofIndexFlagsFromTypeRange(sGridNo, Enum313.FIRSTROOF, Enum313.FOURTHROOF, LEVELNODE_HIDDEN);

  // ATE: Do this only if we are in a room...
  if (gubWorldRoomInfo[sGridNo] != NO_ROOM) {
    SetStructAframeFlags(sGridNo, LEVELNODE_HIDDEN);
    // Find gridno one east as well...

    if ((sGridNo + WORLD_COLS) < NOWHERE) {
      SetStructAframeFlags(sGridNo + WORLD_COLS, LEVELNODE_HIDDEN);
    }

    if ((sGridNo + 1) < NOWHERE) {
      SetStructAframeFlags(sGridNo + 1, LEVELNODE_HIDDEN);
    }
  }

  // Set gridno as revealed
  gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REVEALED;
  if (gfCaves) {
    RemoveFogFromGridNo(sGridNo);
  }

  // ATE: If there are any structs here, we can render them with the obscured flag!
  // Look for anything but walls pn this gridno!
  pStructure = gpWorldLevelData[sGridNo].pStructureHead;

  while (pStructure != null) {
    if (pStructure.value.sCubeOffset == STRUCTURE_ON_GROUND || (pStructure.value.fFlags & STRUCTURE_SLANTED_ROOF)) {
      if (((pStructure.value.fFlags & STRUCTURE_OBSTACLE) && !(pStructure.value.fFlags & (STRUCTURE_PERSON | STRUCTURE_CORPSE))) || (pStructure.value.fFlags & STRUCTURE_SLANTED_ROOF)) {
        pBase = FindBaseStructure(pStructure);

        // Get LEVELNODE for struct and remove!
        pNode = FindLevelNodeBasedOnStructure(pBase.value.sGridNo, pBase);

        if (pNode)
          pNode.value.uiFlags |= LEVELNODE_SHOW_THROUGH;

        if (pStructure.value.fFlags & STRUCTURE_SLANTED_ROOF) {
          AddSlantRoofFOVSlot(pBase.value.sGridNo);

          // Set hidden...
          pNode.value.uiFlags |= LEVELNODE_HIDDEN;
        }
      }
    }

    pStructure = pStructure.value.pNext;
  }

  gubWorldRoomHidden[gubWorldRoomInfo[sGridNo]] = false;
}

export function ExamineGridNoForSlantRoofExtraGraphic(sCheckGridNo: UINT16): void {
  let pNode: Pointer<LEVELNODE> = null;
  let pStructure: Pointer<STRUCTURE>;
  let pBase: Pointer<STRUCTURE>;
  let ubLoop: UINT8;
  let ppTile: Pointer<Pointer<DB_STRUCTURE_TILE>>;
  let sGridNo: INT16;
  let usIndex: UINT16;
  let fChanged: boolean = false;

  // CHECK FOR A SLANTED ROOF HERE....
  pStructure = FindStructure(sCheckGridNo, STRUCTURE_SLANTED_ROOF);

  if (pStructure != null) {
    // We have a slanted roof here ... find base and remove...
    pBase = FindBaseStructure(pStructure);

    // Get LEVELNODE for struct and remove!
    pNode = FindLevelNodeBasedOnStructure(pBase.value.sGridNo, pBase);

    // Loop through each gridno and see if revealed....
    for (ubLoop = 0; ubLoop < pBase.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles; ubLoop++) {
      ppTile = pBase.value.pDBStructureRef.value.ppTile;
      sGridNo = pBase.value.sGridNo + ppTile[ubLoop].value.sPosRelToBase;

      if (sGridNo < 0 || sGridNo > WORLD_MAX) {
        continue;
      }

      // Given gridno,
      // IF NOT REVEALED AND HIDDEN....
      if (!(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) && pNode.value.uiFlags & LEVELNODE_HIDDEN) {
        // Add graphic if one does not already exist....
        if (!TypeExistsInRoofLayer(sGridNo, Enum313.SLANTROOFCEILING, addressof(usIndex))) {
          // Add
          AddRoofToHead(sGridNo, Enum312.SLANTROOFCEILING1);
          fChanged = true;
        }
      }

      // Revealed?
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) {
        /// Remove any slant roof items if they exist
        if (TypeExistsInRoofLayer(sGridNo, Enum313.SLANTROOFCEILING, addressof(usIndex))) {
          RemoveRoof(sGridNo, usIndex);
          fChanged = true;
        }
      }
    }
  }

  if (fChanged) {
    // DIRTY THE WORLD!
    InvalidateWorldRedundency();
    SetRenderFlags(RENDER_FLAG_FULL);
  }
}

export function RemoveRoomRoof(sGridNo: UINT16, bRoomNum: UINT8, pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: UINT32;
  let pItemPool: ITEM_POOL | null;
  let sX: INT16;
  let sY: INT16;
  let pNode: Pointer<LEVELNODE> = null;
  let fSaidItemSeenQuote: boolean = false;

  //	STRUCTURE					*pStructure;//, *pBase;

  // LOOP THORUGH WORLD AND CHECK ROOM INFO
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (gubWorldRoomInfo[cnt] == bRoomNum) {
      SetGridNoRevealedFlag(cnt);

      RemoveRoofIndexFlagsFromTypeRange(cnt, Enum313.FIRSTROOF, Enum313.SECONDSLANTROOF, LEVELNODE_REVEAL);

      // Reveal any items if here!
      if ((pItemPool = GetItemPool(cnt, 0))) {
        // Set visible! ( only if invisible... )
        if (SetItemPoolVisibilityOn(pItemPool, INVISIBLE, true)) {
          if (!fSaidItemSeenQuote) {
            fSaidItemSeenQuote = true;

            if (pSoldier != null) {
              TacticalCharacterDialogue(pSoldier, (Enum202.QUOTE_SPOTTED_SOMETHING_ONE + Random(2)));
            }
          }
        }
      }

      // OK, re-set writeframes ( in a radius )
      // Get XY
      ({ sX, sY } = ConvertGridNoToXY(cnt));
      SetRecalculateWireFrameFlagRadius(sX, sY, 2);
    }
  }

  // for ( cnt = 0; cnt < WORLD_MAX; cnt++ )
  //{
  //	if ( gubWorldRoomInfo[ cnt ] == bRoomNum )
  //	{
  //		ExamineGridNoForSlantRoofExtraGraphic( (UINT16)cnt );
  //	}
  //}

  // DIRTY THE WORLD!
  InvalidateWorldRedundency();
  SetRenderFlags(RENDER_FLAG_FULL);

  CalculateWorldWireFrameTiles(false);
}

function AddSpecialTileRange(pSelectRegion: Pointer<SGPRect>): boolean {
  let cnt1: INT32;
  let cnt2: INT32;

  for (cnt1 = pSelectRegion.value.iTop; cnt1 <= pSelectRegion.value.iBottom; cnt1++) {
    for (cnt2 = pSelectRegion.value.iLeft; cnt2 <= pSelectRegion.value.iRight; cnt2++) {
      AddObjectToHead(MAPROWCOLTOPOS(cnt1, cnt2), Enum312.SPECIALTILE_MAPEXIT);
    }
  }

  return true;
}

function RemoveSpecialTileRange(pSelectRegion: Pointer<SGPRect>): boolean {
  let cnt1: INT32;
  let cnt2: INT32;

  for (cnt1 = pSelectRegion.value.iTop; cnt1 <= pSelectRegion.value.iBottom; cnt1++) {
    for (cnt2 = pSelectRegion.value.iLeft; cnt2 <= pSelectRegion.value.iRight; cnt2++) {
      RemoveObject(MAPROWCOLTOPOS(cnt1, cnt2), Enum312.SPECIALTILE_MAPEXIT);
    }
  }

  return true;
}

}
