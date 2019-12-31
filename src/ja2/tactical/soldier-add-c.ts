namespace ja2 {

// SO, STEPS IN CREATING A MERC!

// 1 ) Setup the SOLDIERCREATE_STRUCT
//			Among other things, this struct needs a sSectorX, sSectorY, and a valid InsertionDirection
//			and InsertionGridNo.
//			This GridNo will be determined by a prevouis function that will examine the sector
//			Infomration regarding placement positions and pick one
// 2 ) Call TacticalCreateSoldier() which will create our soldier
//			What it does is:	Creates a soldier in the MercPtrs[] array.
//												Allocates the Animation cache for this merc
//												Loads up the intial aniamtion file
//												Creates initial palettes, etc
//												And other cool things.
//			Now we have an allocated soldier, we just need to set him in the world!
// 3) When we want them in the world, call AddSoldierToSector().
//			This function sets the graphic in the world, lighting effects, etc
//			It also formally adds it to the TacticalSoldier slot and interface panel slot.

// Kris:  modified to actually path from sweetspot to gridno.  Previously, it only checked if the
// destination was sittable (though it was possible that that location would be trapped.
export function FindGridNoFromSweetSpot(pSoldier: SOLDIERTYPE, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = -1;
  let leftmost: INT32;
  let fFound: boolean = false;
  let soldier: SOLDIERTYPE = createSoldierType();
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(soldier, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
          // ATE: INstead of using absolute range, use the path cost!
          // uiRange = PlotPath( &soldier, sGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, WALKING, NOT_STEALTH, FORWARD, 50 );
          uiRange = CardinalSpacesAway(sSweetGridNo, sGridNo);

          //	if ( uiRange == 0 )
          //	{
          //		uiRange = 999999;
          //	}

          if (uiRange < uiLowestRange) {
            sLowestGridNo = sGridNo;
            uiLowestRange = uiRange;
            fFound = true;
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;
  if (fFound) {
    // Set direction to center of map!
    pubDirection.value = GetDirectionToGridNoFromGridNo(sLowestGridNo, ((Math.trunc(WORLD_ROWS / 2) * WORLD_COLS) + Math.trunc(WORLD_COLS / 2)));
    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

export function FindGridNoFromSweetSpotThroughPeople(pSoldier: SOLDIERTYPE, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = -1;
  let leftmost: INT32;
  let fFound: boolean = false;
  let soldier: SOLDIERTYPE = createSoldierType();
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  soldier.bLevel = 0;
  soldier.bTeam = pSoldier.bTeam;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(soldier, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          {
            if (uiRange < uiLowestRange) {
              sLowestGridNo = sGridNo;
              uiLowestRange = uiRange;
              fFound = true;
            }
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;
  if (fFound) {
    // Set direction to center of map!
    pubDirection.value = GetDirectionToGridNoFromGridNo(sLowestGridNo, ((Math.trunc(WORLD_ROWS / 2) * WORLD_COLS) + Math.trunc(WORLD_COLS / 2)));
    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

// Kris:  modified to actually path from sweetspot to gridno.  Previously, it only checked if the
// destination was sittable (though it was possible that that location would be trapped.
export function FindGridNoFromSweetSpotWithStructData(pSoldier: SOLDIERTYPE, usAnimState: UINT16, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>, fClosestToMerc: boolean): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let cnt3: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = -1;
  let leftmost: INT32;
  let fFound: boolean = false;
  let soldier: SOLDIERTYPE = createSoldierType();
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let ubBestDirection: UINT8 = 0;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // If we are already at this gridno....
  if (pSoldier.sGridNo == sSweetGridNo && !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    pubDirection.value = pSoldier.bDirection;
    return sSweetGridNo;
  }

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(soldier, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
          let fDirectionFound: boolean = false;
          let usOKToAddStructID: UINT16;
          let pStructureFileRef: STRUCTURE_FILE_REF | null;
          let usAnimSurface: UINT16;

          if (pSoldier.pLevelNode != null) {
            if (pSoldier.pLevelNode.pStructureData != null) {
              usOKToAddStructID = pSoldier.pLevelNode.pStructureData.usStructureID;
            } else {
              usOKToAddStructID = INVALID_STRUCTURE_ID;
            }
          } else {
            usOKToAddStructID = INVALID_STRUCTURE_ID;
          }

          // Get animation surface...
          usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);
          // Get structure ref...
          pStructureFileRef = GetAnimationStructureRef(pSoldier.ubID, usAnimSurface, usAnimState);

          if (!pStructureFileRef) {
            Assert(false);
          }

          // Check each struct in each direction
          for (cnt3 = 0; cnt3 < 8; cnt3++) {
            if (OkayToAddStructureToWorld(sGridNo, pSoldier.bLevel, pStructureFileRef.pDBStructureRef[gOneCDirection[cnt3]], usOKToAddStructID)) {
              fDirectionFound = true;
              break;
            }
          }

          if (fDirectionFound) {
            if (fClosestToMerc) {
              uiRange = FindBestPath(pSoldier, sGridNo, pSoldier.bLevel, pSoldier.usUIMovementMode, NO_COPYROUTE, 0);

              if (uiRange == 0) {
                uiRange = 999;
              }
            } else {
              uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);
            }

            if (uiRange < uiLowestRange) {
              ubBestDirection = cnt3;
              sLowestGridNo = sGridNo;
              uiLowestRange = uiRange;
              fFound = true;
            }
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;
  if (fFound) {
    // Set direction we chose...
    pubDirection.value = ubBestDirection;

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

function FindGridNoFromSweetSpotWithStructDataUsingGivenDirectionFirst(pSoldier: SOLDIERTYPE, usAnimState: UINT16, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>, fClosestToMerc: boolean, bGivenDirection: INT8): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let cnt3: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = -1;
  let leftmost: INT32;
  let fFound: boolean = false;
  let soldier: SOLDIERTYPE = createSoldierType();
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let ubBestDirection: UINT8 = 0;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // If we are already at this gridno....
  if (pSoldier.sGridNo == sSweetGridNo && !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    pubDirection.value = pSoldier.bDirection;
    return sSweetGridNo;
  }

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(soldier, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
          let fDirectionFound: boolean = false;
          let usOKToAddStructID: UINT16;
          let pStructureFileRef: STRUCTURE_FILE_REF | null;
          let usAnimSurface: UINT16;

          if (pSoldier.pLevelNode != null) {
            if (pSoldier.pLevelNode.pStructureData != null) {
              usOKToAddStructID = pSoldier.pLevelNode.pStructureData.usStructureID;
            } else {
              usOKToAddStructID = INVALID_STRUCTURE_ID;
            }
          } else {
            usOKToAddStructID = INVALID_STRUCTURE_ID;
          }

          // Get animation surface...
          usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);
          // Get structure ref...
          pStructureFileRef = GetAnimationStructureRef(pSoldier.ubID, usAnimSurface, usAnimState);

          if (!pStructureFileRef) {
            Assert(false);
          }

          // OK, check the perfered given direction first
          if (OkayToAddStructureToWorld(sGridNo, pSoldier.bLevel, pStructureFileRef.pDBStructureRef[gOneCDirection[bGivenDirection]], usOKToAddStructID)) {
            fDirectionFound = true;
            cnt3 = bGivenDirection;
          } else {
            // Check each struct in each direction
            for (cnt3 = 0; cnt3 < 8; cnt3++) {
              if (cnt3 != bGivenDirection) {
                if (OkayToAddStructureToWorld(sGridNo, pSoldier.bLevel, pStructureFileRef.pDBStructureRef[gOneCDirection[cnt3]], usOKToAddStructID)) {
                  fDirectionFound = true;
                  break;
                }
              }
            }
          }

          if (fDirectionFound) {
            if (fClosestToMerc) {
              uiRange = FindBestPath(pSoldier, sGridNo, pSoldier.bLevel, pSoldier.usUIMovementMode, NO_COPYROUTE, 0);

              if (uiRange == 0) {
                uiRange = 999;
              }
            } else {
              uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);
            }

            if (uiRange < uiLowestRange) {
              ubBestDirection = cnt3;
              sLowestGridNo = sGridNo;
              uiLowestRange = uiRange;
              fFound = true;
            }
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;
  if (fFound) {
    // Set direction we chose...
    pubDirection.value = ubBestDirection;

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

export function FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier: SOLDIERTYPE, usAnimState: UINT16, ubRadius: INT8, pubDirection: Pointer<UINT8>, fClosestToMerc: UINT8 /* boolean */, pSrcSoldier: SOLDIERTYPE): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let cnt3: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = -1;
  let leftmost: INT32;
  let fFound: boolean = false;
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let ubBestDirection: UINT8 = 0;
  let sSweetGridNo: INT16;
  let soldier: SOLDIERTYPE = createSoldierType();

  sSweetGridNo = pSrcSoldier.sGridNo;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  FindBestPath(soldier, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
          let fDirectionFound: boolean = false;
          let usOKToAddStructID: UINT16;
          let pStructureFileRef: STRUCTURE_FILE_REF | null;
          let usAnimSurface: UINT16;

          if (fClosestToMerc != 3) {
            if (pSoldier.pLevelNode != null && pSoldier.pLevelNode.pStructureData != null) {
              usOKToAddStructID = pSoldier.pLevelNode.pStructureData.usStructureID;
            } else {
              usOKToAddStructID = INVALID_STRUCTURE_ID;
            }

            // Get animation surface...
            usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);
            // Get structure ref...
            pStructureFileRef = <STRUCTURE_FILE_REF>GetAnimationStructureRef(pSoldier.ubID, usAnimSurface, usAnimState);

            // Check each struct in each direction
            for (cnt3 = 0; cnt3 < 8; cnt3++) {
              if (OkayToAddStructureToWorld(sGridNo, pSoldier.bLevel, pStructureFileRef.pDBStructureRef[gOneCDirection[cnt3]], usOKToAddStructID)) {
                fDirectionFound = true;
                break;
              }
            }
          } else {
            fDirectionFound = true;
            cnt3 = Random(8);
          }

          if (fDirectionFound) {
            if (fClosestToMerc == 1) {
              uiRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.sGridNo, sGridNo);
            } else if (fClosestToMerc == 2) {
              uiRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.sGridNo, sGridNo) + GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);
            } else {
              // uiRange = GetRangeInCellCoordsFromGridNoDiff( sSweetGridNo, sGridNo );
              uiRange = Math.abs(Math.trunc(sSweetGridNo / MAXCOL) - Math.trunc(sGridNo / MAXCOL)) + Math.abs((sSweetGridNo % MAXROW) - (sGridNo % MAXROW));
            }

            if (uiRange < uiLowestRange || (uiRange == uiLowestRange && PythSpacesAway(pSoldier.sGridNo, sGridNo) < PythSpacesAway(pSoldier.sGridNo, sLowestGridNo))) {
              ubBestDirection = cnt3;
              sLowestGridNo = sGridNo;
              uiLowestRange = uiRange;
              fFound = true;
            }
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;
  if (fFound) {
    // Set direction we chose...
    pubDirection.value = ubBestDirection;

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

export function FindGridNoFromSweetSpotExcludingSweetSpot(pSoldier: SOLDIERTYPE, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = -1;
  let leftmost: INT32;
  let fFound: boolean = false;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;

      if (sSweetGridNo == sGridNo) {
        continue;
      }

      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            sLowestGridNo = sGridNo;
            uiLowestRange = uiRange;

            fFound = true;
          }
        }
      }
    }
  }

  if (fFound) {
    // Set direction to center of map!
    pubDirection.value = GetDirectionToGridNoFromGridNo(sLowestGridNo, ((Math.trunc(WORLD_ROWS / 2) * WORLD_COLS) + Math.trunc(WORLD_COLS / 2)));

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

export function FindGridNoFromSweetSpotExcludingSweetSpotInQuardent(pSoldier: SOLDIERTYPE, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>, ubQuardentDir: INT8): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = -1;
  let leftmost: INT32;
  let fFound: boolean = false;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // Switch on quadrent
  if (ubQuardentDir == Enum245.SOUTHEAST) {
    sBottom = 0;
    sLeft = 0;
  }

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;

      if (sSweetGridNo == sGridNo) {
        continue;
      }

      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            sLowestGridNo = sGridNo;
            uiLowestRange = uiRange;
            fFound = true;
          }
        }
      }
    }
  }

  if (fFound) {
    // Set direction to center of map!
    pubDirection.value = GetDirectionToGridNoFromGridNo(sLowestGridNo, ((Math.trunc(WORLD_ROWS / 2) * WORLD_COLS) + Math.trunc(WORLD_COLS / 2)));

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

export function CanSoldierReachGridNoInGivenTileLimit(pSoldier: SOLDIERTYPE, sGridNo: INT16, sMaxTiles: INT16, bLevel: INT8): boolean {
  let iNumTiles: INT32;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;

  if (pSoldier.bLevel != bLevel) {
    return false;
  }

  sActionGridNo = FindAdjacentGridEx(pSoldier, sGridNo, createPointer(() => ubDirection, (v) => ubDirection = v), null, false, false);

  if (sActionGridNo == -1) {
    sActionGridNo = sGridNo;
  }

  if (sActionGridNo == pSoldier.sGridNo) {
    return true;
  }

  iNumTiles = FindBestPath(pSoldier, sActionGridNo, pSoldier.bLevel, Enum193.WALKING, NO_COPYROUTE, PATH_IGNORE_PERSON_AT_DEST);

  if (iNumTiles <= sMaxTiles && iNumTiles != 0) {
    return true;
  } else {
    return false;
  }
}

export function FindRandomGridNoFromSweetSpot(pSoldier: SOLDIERTYPE, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
  let sX: INT16;
  let sY: INT16;
  let sGridNo: INT16;
  let leftmost: INT32;
  let fFound: boolean = false;
  let cnt: UINT32 = 0;
  let soldier: SOLDIERTYPE = createSoldierType();
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let ubBestDirection: UINT8 = 0;
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let ubRoomNum: UINT8;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(soldier, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  do {
    sX = Random(ubRadius);
    sY = Random(ubRadius);

    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * sY)) / WORLD_COLS) * WORLD_COLS;

    sGridNo = sSweetGridNo + (WORLD_COLS * sY) + sX;

    if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
      // Go on sweet stop
      if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
        // If we are a crow, we need this additional check
        if (pSoldier.ubBodyType == Enum194.CROW) {
          if ((ubRoomNum = InARoom(sGridNo)) === -1) {
            fFound = true;
          }
        } else {
          fFound = true;
        }
      }
    }

    cnt++;

    if (cnt > 2000) {
      return NOWHERE;
    }
  } while (!fFound);

  // Set direction to center of map!
  pubDirection.value = GetDirectionToGridNoFromGridNo(sGridNo, ((Math.trunc(WORLD_ROWS / 2) * WORLD_COLS) + Math.trunc(WORLD_COLS / 2)));

  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;

  return sGridNo;
}

function FindRandomGridNoFromSweetSpotExcludingSweetSpot(pSoldier: SOLDIERTYPE, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
  let sX: INT16;
  let sY: INT16;
  let sGridNo: INT16;
  let leftmost: INT32;
  let fFound: boolean = false;
  let cnt: UINT32 = 0;

  do {
    sX = Random(ubRadius);
    sY = Random(ubRadius);

    leftmost = Math.trunc((sSweetGridNo + (WORLD_COLS * sY)) / WORLD_COLS) * WORLD_COLS;

    sGridNo = sSweetGridNo + (WORLD_COLS * sY) + sX;

    if (sGridNo == sSweetGridNo) {
      continue;
    }

    if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
      // Go on sweet stop
      if (NewOKDestination(pSoldier, sGridNo, true, pSoldier.bLevel)) {
        fFound = true;
      }
    }

    cnt++;

    if (cnt > 2000) {
      return NOWHERE;
    }
  } while (!fFound);

  // Set direction to center of map!
  pubDirection.value = GetDirectionToGridNoFromGridNo(sGridNo, ((Math.trunc(WORLD_ROWS / 2) * WORLD_COLS) + Math.trunc(WORLD_COLS / 2)));

  return sGridNo;
}

export function InternalAddSoldierToSector(ubID: UINT8, fCalculateDirection: boolean, fUseAnimation: boolean, usAnimState: UINT16, usAnimCode: UINT16): boolean {
  let ubDirection: UINT8;
  let ubCalculatedDirection: UINT8 = 0;
  let ubCalculatedDirection__Pointer = createPointer(() => ubCalculatedDirection, (v) => ubCalculatedDirection = v);
  let pSoldier: SOLDIERTYPE;
  let sGridNo: INT16;
  let sExitGridNo: INT16;

  pSoldier = MercPtrs[ubID];

  if (pSoldier.bActive) {
    // ATE: Make sure life of elliot is OK if from a meanwhile
    if (AreInMeanwhile() && pSoldier.ubProfile == Enum268.ELLIOT) {
      if (pSoldier.bLife < OKLIFE) {
        pSoldier.bLife = 25;
      }
    }

    // ADD SOLDIER TO SLOT!
    if (pSoldier.uiStatusFlags & SOLDIER_OFF_MAP) {
      AddAwaySlot(pSoldier);

      // Guy is NOT "in sector"
      pSoldier.bInSector = false;
    } else {
      AddMercSlot(pSoldier);

      // Add guy to sector flag
      pSoldier.bInSector = true;
    }

    // If a driver or passenger - stop here!
    if (pSoldier.uiStatusFlags & SOLDIER_DRIVER || pSoldier.uiStatusFlags & SOLDIER_PASSENGER) {
      return false;
    }

    // Add to panel
    CheckForAndAddMercToTeamPanel(pSoldier);

    pSoldier.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_SPOTTING_CREATURE_ATTACK);
    pSoldier.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_SMELLED_CREATURE);
    pSoldier.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_WORRIED_ABOUT_CREATURES);

    // Add to interface if the are ours
    if (pSoldier.bTeam == CREATURE_TEAM) {
      sGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, Enum193.STANDING, pSoldier.sInsertionGridNo, 7, ubCalculatedDirection__Pointer, false);
      if (fCalculateDirection)
        ubDirection = ubCalculatedDirection;
      else
        ubDirection = pSoldier.ubInsertionDirection;
    } else {
      if (pSoldier.sInsertionGridNo == NOWHERE) {
        // Add the soldier to the respective entrypoint.  This is an error condition.
      }
      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        sGridNo = FindGridNoFromSweetSpotWithStructDataUsingGivenDirectionFirst(pSoldier, Enum193.STANDING, pSoldier.sInsertionGridNo, 12, ubCalculatedDirection__Pointer, false, pSoldier.ubInsertionDirection);
        // ATE: Override insertion direction
        pSoldier.ubInsertionDirection = ubCalculatedDirection;
      } else {
        sGridNo = FindGridNoFromSweetSpot(pSoldier, pSoldier.sInsertionGridNo, 7, ubCalculatedDirection__Pointer);

        // ATE: Error condition - if nowhere use insertion gridno!
        if (sGridNo == NOWHERE) {
          sGridNo = pSoldier.sInsertionGridNo;
        }
      }

      // Override calculated direction if we were told to....
      if (pSoldier.ubInsertionDirection > 100) {
        pSoldier.ubInsertionDirection = pSoldier.ubInsertionDirection - 100;
        fCalculateDirection = false;
      }

      if (fCalculateDirection) {
        ubDirection = ubCalculatedDirection;

        // Check if we need to get direction from exit grid...
        if (pSoldier.bUseExitGridForReentryDirection) {
          pSoldier.bUseExitGridForReentryDirection = false;

          // OK, we know there must be an exit gridno SOMEWHERE close...
          sExitGridNo = FindClosestExitGrid(pSoldier, sGridNo, 10);

          if (sExitGridNo != NOWHERE) {
            // We found one
            // Calculate direction...
            ubDirection = GetDirectionToGridNoFromGridNo(sExitGridNo, sGridNo);
          }
        }
      } else {
        ubDirection = pSoldier.ubInsertionDirection;
      }
    }

    // Add
    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
      AddSoldierToSectorGridNo(pSoldier, sGridNo, pSoldier.bDirection, fUseAnimation, usAnimState, usAnimCode);
    else
      AddSoldierToSectorGridNo(pSoldier, sGridNo, ubDirection, fUseAnimation, usAnimState, usAnimCode);

    CheckForPotentialAddToBattleIncrement(pSoldier);

    return true;
  }

  return false;
}

export function AddSoldierToSector(ubID: UINT8): boolean {
  return InternalAddSoldierToSector(ubID, true, false, 0, 0);
}

export function AddSoldierToSectorNoCalculateDirection(ubID: UINT8): boolean {
  return InternalAddSoldierToSector(ubID, false, false, 0, 0);
}

export function AddSoldierToSectorNoCalculateDirectionUseAnimation(ubID: UINT8, usAnimState: UINT16, usAnimCode: UINT16): boolean {
  return InternalAddSoldierToSector(ubID, false, true, usAnimState, usAnimCode);
}

function InternalSoldierInSectorSleep(pSoldier: SOLDIERTYPE, sGridNo: INT16, fDoTransition: boolean): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8 = 0;
  let sGoodGridNo: INT16;
  let usAnim: UINT16 = Enum193.SLEEPING;

  if (!pSoldier.bInSector) {
    return;
  }

  if (AM_AN_EPC(pSoldier)) {
    usAnim = Enum193.STANDING;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, usAnim, sGridNo, 5, createPointer(() => ubNewDirection, (v) => ubNewDirection = v), false);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  if (AM_AN_EPC(pSoldier)) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 1, true);
  } else {
    if (fDoTransition) {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.GOTO_SLEEP, 1, true);
    } else {
      EVENT_InitNewSoldierAnim(pSoldier, Enum193.SLEEPING, 1, true);
    }
  }
}

function SoldierInSectorIncompaciated(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8 = 0;
  let sGoodGridNo: INT16;

  if (!pSoldier.bInSector) {
    return;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, Enum193.STAND_FALLFORWARD_STOP, sGridNo, 5, createPointer(() => ubNewDirection, (v) => ubNewDirection = v), false);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  EVENT_InitNewSoldierAnim(pSoldier, Enum193.STAND_FALLFORWARD_STOP, 1, true);
}

/*
void SoldierInSectorSleep( SOLDIERTYPE *pSoldier, INT16 sGridNo )
{
        InternalSoldierInSectorSleep( pSoldier, sGridNo, TRUE );
}
*/

export function SoldierInSectorPatient(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8 = 0;
  let sGoodGridNo: INT16;

  if (!pSoldier.bInSector) {
    return;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, Enum193.BEING_PATIENT, sGridNo, 5, createPointer(() => ubNewDirection, (v) => ubNewDirection = v), false);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  if (!IS_MERC_BODY_TYPE(pSoldier)) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 1, true);
  } else {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.BEING_PATIENT, 1, true);
  }
}

export function SoldierInSectorDoctor(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8 = 0;
  let sGoodGridNo: INT16;

  if (!pSoldier.bInSector) {
    return;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, Enum193.BEING_DOCTOR, sGridNo, 5, createPointer(() => ubNewDirection, (v) => ubNewDirection = v), false);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  if (!IS_MERC_BODY_TYPE(pSoldier)) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 1, true);
  } else {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.BEING_DOCTOR, 1, true);
  }
}

export function SoldierInSectorRepair(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8 = 0;
  let sGoodGridNo: INT16;

  if (!pSoldier.bInSector) {
    return;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, Enum193.BEING_REPAIRMAN, sGridNo, 5, createPointer(() => ubNewDirection, (v) => ubNewDirection = v), false);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  if (!IS_MERC_BODY_TYPE(pSoldier)) {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 1, true);
  } else {
    EVENT_InitNewSoldierAnim(pSoldier, Enum193.BEING_REPAIRMAN, 1, true);
  }
}

function AddSoldierToSectorGridNo(pSoldier: SOLDIERTYPE, sGridNo: INT16, ubDirection: UINT8, fUseAnimation: boolean, usAnimState: UINT16, usAnimCode: UINT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sNewGridNo: INT16;
  let ubNewDirection: UINT8 = 0;
  let ubInsertionCode: UINT8;
  let fUpdateFinalPosition: boolean = true;

  // Add merc to gridno
  sWorldX = CenterX(sGridNo);
  sWorldY = CenterY(sGridNo);

  // Set reserved location!
  pSoldier.sReservedMovementGridNo = NOWHERE;

  // Save OLD insertion code.. as this can change...
  ubInsertionCode = pSoldier.ubStrategicInsertionCode;

  // Remove any pending animations
  pSoldier.usPendingAnimation = NO_PENDING_ANIMATION;
  pSoldier.usPendingAnimation2 = NO_PENDING_ANIMATION;
  pSoldier.ubPendingDirection = NO_PENDING_DIRECTION;
  pSoldier.ubPendingAction = NO_PENDING_ACTION;

  // If we are not loading a saved game
  if ((gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Set final dest to be the same...
    fUpdateFinalPosition = false;
  }

  // If this is a special insertion location, get path!
  if (ubInsertionCode == Enum175.INSERTION_CODE_ARRIVING_GAME) {
    EVENT_SetSoldierPositionAndMaybeFinalDestAndMaybeNotDestination(pSoldier, sWorldX, sWorldY, fUpdateFinalPosition, fUpdateFinalPosition);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
  } else if (ubInsertionCode == Enum175.INSERTION_CODE_CHOPPER) {
  } else {
    EVENT_SetSoldierPositionAndMaybeFinalDestAndMaybeNotDestination(pSoldier, sWorldX, sWorldY, fUpdateFinalPosition, fUpdateFinalPosition);

    // if we are loading, dont set the direction ( they are already set )
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      EVENT_SetSoldierDirection(pSoldier, ubDirection);

      EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    }
  }

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    if (!(pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
      if (pSoldier.bTeam == gbPlayerNum) {
        RevealRoofsAndItems(pSoldier, true, false, pSoldier.bLevel, true);

        // ATE: Patch fix: If we are in an non-interruptable animation, stop!
        if (pSoldier.usAnimState == Enum193.HOPFENCE) {
          pSoldier.fInNonintAnim = false;
          SoldierGotoStationaryStance(pSoldier);
        }

        EVENT_StopMerc(pSoldier, sGridNo, ubDirection);
      }
    }

    // If just arriving, set a destination to walk into from!
    if (ubInsertionCode == Enum175.INSERTION_CODE_ARRIVING_GAME) {
      // Find a sweetspot near...
      sNewGridNo = FindGridNoFromSweetSpot(pSoldier, gMapInformation.sNorthGridNo, 4, createPointer(() => ubNewDirection, (v) => ubNewDirection = v));
      EVENT_GetNewSoldierPath(pSoldier, sNewGridNo, Enum193.WALKING);
    }

    // If he's an enemy... set presence
    if (!pSoldier.bNeutral && (pSoldier.bSide != gbPlayerNum)) {
      // ATE: Added if not bloodcats
      // only do this once they are seen.....
      if (pSoldier.ubBodyType != Enum194.BLOODCAT) {
        SetEnemyPresence();
      }
    }
  }

  if (!(pSoldier.uiStatusFlags & SOLDIER_DEAD)) {
    // if we are loading a 'pristine' map ( ie, not loading a saved game )
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      // ATE: Double check if we are on the roof that there is a roof there!
      if (pSoldier.bLevel == 1) {
        if (!FindStructure(pSoldier.sGridNo, STRUCTURE_ROOF)) {
          SetSoldierHeight(pSoldier, (0));
        }
      }

      if (ubInsertionCode != Enum175.INSERTION_CODE_ARRIVING_GAME) {
        // default to standing on arrival
        if (pSoldier.usAnimState != Enum193.HELIDROP) {
          if (fUseAnimation) {
            EVENT_InitNewSoldierAnim(pSoldier, usAnimState, usAnimCode, true);
          } else if (pSoldier.ubBodyType != Enum194.CROW) {
            EVENT_InitNewSoldierAnim(pSoldier, Enum193.STANDING, 1, true);
          }
        }

        // ATE: if we are below OK life, make them lie down!
        if (pSoldier.bLife < OKLIFE) {
          SoldierInSectorIncompaciated(pSoldier, pSoldier.sInsertionGridNo);
        } else if (pSoldier.fMercAsleep == true) {
          InternalSoldierInSectorSleep(pSoldier, pSoldier.sInsertionGridNo, false);
        } else if (pSoldier.bAssignment == Enum117.PATIENT) {
          SoldierInSectorPatient(pSoldier, pSoldier.sInsertionGridNo);
        } else if (pSoldier.bAssignment == Enum117.DOCTOR) {
          SoldierInSectorDoctor(pSoldier, pSoldier.sInsertionGridNo);
        } else if (pSoldier.bAssignment == Enum117.REPAIR) {
          SoldierInSectorRepair(pSoldier, pSoldier.sInsertionGridNo);
        }

        // ATE: Make sure movement mode is up to date!
        pSoldier.usUIMovementMode = GetMoveStateBasedOnStance(pSoldier, gAnimControl[pSoldier.usAnimState].ubEndHeight);
      }
    } else {
      // THIS ALL SHOULD HAVE BEEN HANDLED BY THE FACT THAT A GAME WAS LOADED

      // EVENT_InitNewSoldierAnim( pSoldier, pSoldier->usAnimState, pSoldier->usAniCode, TRUE );

      // if the merc had a final destination, get the merc walking there
      // if( pSoldier->sFinalDestination != pSoldier->sGridNo )
      //{
      //	EVENT_GetNewSoldierPath( pSoldier, pSoldier->sFinalDestination, pSoldier->usUIMovementMode );
      //}
    }
  }
}

// IsMercOnTeam() checks to see if the passed in Merc Profile ID is currently on the player's team
export function IsMercOnTeam(ubMercID: UINT8): boolean {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: SOLDIERTYPE;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.ubProfile == ubMercID) {
      if (pTeamSoldier.bActive)
        return true;
    }
  }

  return false;
}

// ATE: Added this new function for contract renewals
export function IsMercOnTeamAndAlive(ubMercID: UINT8): boolean {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: SOLDIERTYPE;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.ubProfile == ubMercID) {
      if (pTeamSoldier.bActive) {
        if (pTeamSoldier.bLife > 0) {
          return true;
        }
      }
    }
  }

  return false;
}

export function IsMercOnTeamAndInOmertaAlready(ubMercID: UINT8): boolean {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: SOLDIERTYPE;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.ubProfile == ubMercID) {
      if (pTeamSoldier.bActive && pTeamSoldier.bAssignment != Enum117.IN_TRANSIT)
        return true;
    }
  }

  return false;
}

export function IsMercOnTeamAndInOmertaAlreadyAndAlive(ubMercID: UINT8): boolean {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: SOLDIERTYPE;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.ubProfile == ubMercID) {
      if (pTeamSoldier.bActive && pTeamSoldier.bAssignment != Enum117.IN_TRANSIT) {
        if (pTeamSoldier.bLife > 0) {
          return true;
        }
      }
    }
  }

  return false;
}

// GetSoldierIDFromMercID() Gets the Soldier ID from the Merc Profile ID, else returns -1
export function GetSoldierIDFromMercID(ubMercID: UINT8): INT16 {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: SOLDIERTYPE;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    if (pTeamSoldier.ubProfile == ubMercID) {
      if (pTeamSoldier.bActive)
        return cnt;
    }
  }

  return -1;
}

}
