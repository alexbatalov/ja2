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
function FindGridNoFromSweetSpot(pSoldier: Pointer<SOLDIERTYPE>, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
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
  let fFound: BOOLEAN = FALSE;
  let soldier: SOLDIERTYPE;
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
  memset(&soldier, 0, sizeof(SOLDIERTYPE));
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
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(&soldier, NOWHERE, 0, WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
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
            fFound = TRUE;
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;
  if (fFound) {
    // Set direction to center of map!
    *pubDirection = GetDirectionToGridNoFromGridNo(sLowestGridNo, (((WORLD_ROWS / 2) * WORLD_COLS) + (WORLD_COLS / 2)));
    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

function FindGridNoFromSweetSpotThroughPeople(pSoldier: Pointer<SOLDIERTYPE>, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
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
  let fFound: BOOLEAN = FALSE;
  let soldier: SOLDIERTYPE;
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
  memset(&soldier, 0, sizeof(SOLDIERTYPE));
  soldier.bLevel = 0;
  soldier.bTeam = pSoldier.value.bTeam;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(&soldier, NOWHERE, 0, WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          {
            if (uiRange < uiLowestRange) {
              sLowestGridNo = sGridNo;
              uiLowestRange = uiRange;
              fFound = TRUE;
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
    *pubDirection = GetDirectionToGridNoFromGridNo(sLowestGridNo, (((WORLD_ROWS / 2) * WORLD_COLS) + (WORLD_COLS / 2)));
    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

// Kris:  modified to actually path from sweetspot to gridno.  Previously, it only checked if the
// destination was sittable (though it was possible that that location would be trapped.
function FindGridNoFromSweetSpotWithStructData(pSoldier: Pointer<SOLDIERTYPE>, usAnimState: UINT16, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>, fClosestToMerc: BOOLEAN): UINT16 {
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
  let fFound: BOOLEAN = FALSE;
  let soldier: SOLDIERTYPE;
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
  memset(&soldier, 0, sizeof(SOLDIERTYPE));
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // If we are already at this gridno....
  if (pSoldier.value.sGridNo == sSweetGridNo && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
    *pubDirection = pSoldier.value.bDirection;
    return sSweetGridNo;
  }

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(&soldier, NOWHERE, 0, WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
          let fDirectionFound: BOOLEAN = FALSE;
          let usOKToAddStructID: UINT16;
          let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
          let usAnimSurface: UINT16;

          if (pSoldier.value.pLevelNode != NULL) {
            if (pSoldier.value.pLevelNode.value.pStructureData != NULL) {
              usOKToAddStructID = pSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
            } else {
              usOKToAddStructID = INVALID_STRUCTURE_ID;
            }
          } else {
            usOKToAddStructID = INVALID_STRUCTURE_ID;
          }

          // Get animation surface...
          usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);
          // Get structure ref...
          pStructureFileRef = GetAnimationStructureRef(pSoldier.value.ubID, usAnimSurface, usAnimState);

          if (!pStructureFileRef) {
            Assert(0);
          }

          // Check each struct in each direction
          for (cnt3 = 0; cnt3 < 8; cnt3++) {
            if (OkayToAddStructureToWorld(sGridNo, pSoldier.value.bLevel, &(pStructureFileRef.value.pDBStructureRef[gOneCDirection[cnt3]]), usOKToAddStructID)) {
              fDirectionFound = TRUE;
              break;
            }
          }

          if (fDirectionFound) {
            if (fClosestToMerc) {
              uiRange = FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, NO_COPYROUTE, 0);

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
              fFound = TRUE;
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
    *pubDirection = ubBestDirection;

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

function FindGridNoFromSweetSpotWithStructDataUsingGivenDirectionFirst(pSoldier: Pointer<SOLDIERTYPE>, usAnimState: UINT16, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>, fClosestToMerc: BOOLEAN, bGivenDirection: INT8): UINT16 {
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
  let fFound: BOOLEAN = FALSE;
  let soldier: SOLDIERTYPE;
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
  memset(&soldier, 0, sizeof(SOLDIERTYPE));
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // If we are already at this gridno....
  if (pSoldier.value.sGridNo == sSweetGridNo && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
    *pubDirection = pSoldier.value.bDirection;
    return sSweetGridNo;
  }

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(&soldier, NOWHERE, 0, WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
          let fDirectionFound: BOOLEAN = FALSE;
          let usOKToAddStructID: UINT16;
          let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
          let usAnimSurface: UINT16;

          if (pSoldier.value.pLevelNode != NULL) {
            if (pSoldier.value.pLevelNode.value.pStructureData != NULL) {
              usOKToAddStructID = pSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
            } else {
              usOKToAddStructID = INVALID_STRUCTURE_ID;
            }
          } else {
            usOKToAddStructID = INVALID_STRUCTURE_ID;
          }

          // Get animation surface...
          usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);
          // Get structure ref...
          pStructureFileRef = GetAnimationStructureRef(pSoldier.value.ubID, usAnimSurface, usAnimState);

          if (!pStructureFileRef) {
            Assert(0);
          }

          // OK, check the perfered given direction first
          if (OkayToAddStructureToWorld(sGridNo, pSoldier.value.bLevel, &(pStructureFileRef.value.pDBStructureRef[gOneCDirection[bGivenDirection]]), usOKToAddStructID)) {
            fDirectionFound = TRUE;
            cnt3 = bGivenDirection;
          } else {
            // Check each struct in each direction
            for (cnt3 = 0; cnt3 < 8; cnt3++) {
              if (cnt3 != bGivenDirection) {
                if (OkayToAddStructureToWorld(sGridNo, pSoldier.value.bLevel, &(pStructureFileRef.value.pDBStructureRef[gOneCDirection[cnt3]]), usOKToAddStructID)) {
                  fDirectionFound = TRUE;
                  break;
                }
              }
            }
          }

          if (fDirectionFound) {
            if (fClosestToMerc) {
              uiRange = FindBestPath(pSoldier, sGridNo, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, NO_COPYROUTE, 0);

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
              fFound = TRUE;
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
    *pubDirection = ubBestDirection;

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

function FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier: Pointer<SOLDIERTYPE>, usAnimState: UINT16, ubRadius: INT8, pubDirection: Pointer<UINT8>, fClosestToMerc: BOOLEAN, pSrcSoldier: Pointer<SOLDIERTYPE>): UINT16 {
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
  let fFound: BOOLEAN = FALSE;
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let ubBestDirection: UINT8 = 0;
  let sSweetGridNo: INT16;
  let soldier: SOLDIERTYPE;

  sSweetGridNo = pSrcSoldier.value.sGridNo;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  memset(&soldier, 0, sizeof(SOLDIERTYPE));
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
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  FindBestPath(&soldier, NOWHERE, 0, WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
          let fDirectionFound: BOOLEAN = FALSE;
          let usOKToAddStructID: UINT16;
          let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
          let usAnimSurface: UINT16;

          if (fClosestToMerc != 3) {
            if (pSoldier.value.pLevelNode != NULL && pSoldier.value.pLevelNode.value.pStructureData != NULL) {
              usOKToAddStructID = pSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
            } else {
              usOKToAddStructID = INVALID_STRUCTURE_ID;
            }

            // Get animation surface...
            usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, usAnimState);
            // Get structure ref...
            pStructureFileRef = GetAnimationStructureRef(pSoldier.value.ubID, usAnimSurface, usAnimState);

            // Check each struct in each direction
            for (cnt3 = 0; cnt3 < 8; cnt3++) {
              if (OkayToAddStructureToWorld(sGridNo, pSoldier.value.bLevel, &(pStructureFileRef.value.pDBStructureRef[gOneCDirection[cnt3]]), usOKToAddStructID)) {
                fDirectionFound = TRUE;
                break;
              }
            }
          } else {
            fDirectionFound = TRUE;
            cnt3 = Random(8);
          }

          if (fDirectionFound) {
            if (fClosestToMerc == 1) {
              uiRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, sGridNo);
            } else if (fClosestToMerc == 2) {
              uiRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, sGridNo) + GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);
            } else {
              // uiRange = GetRangeInCellCoordsFromGridNoDiff( sSweetGridNo, sGridNo );
              uiRange = abs((sSweetGridNo / MAXCOL) - (sGridNo / MAXCOL)) + abs((sSweetGridNo % MAXROW) - (sGridNo % MAXROW));
            }

            if (uiRange < uiLowestRange || (uiRange == uiLowestRange && PythSpacesAway(pSoldier.value.sGridNo, sGridNo) < PythSpacesAway(pSoldier.value.sGridNo, sLowestGridNo))) {
              ubBestDirection = cnt3;
              sLowestGridNo = sGridNo;
              uiLowestRange = uiRange;
              fFound = TRUE;
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
    *pubDirection = ubBestDirection;

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

function FindGridNoFromSweetSpotExcludingSweetSpot(pSoldier: Pointer<SOLDIERTYPE>, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
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
  let fFound: BOOLEAN = FALSE;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;

      if (sSweetGridNo == sGridNo) {
        continue;
      }

      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            sLowestGridNo = sGridNo;
            uiLowestRange = uiRange;

            fFound = TRUE;
          }
        }
      }
    }
  }

  if (fFound) {
    // Set direction to center of map!
    *pubDirection = GetDirectionToGridNoFromGridNo(sLowestGridNo, (((WORLD_ROWS / 2) * WORLD_COLS) + (WORLD_COLS / 2)));

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

function FindGridNoFromSweetSpotExcludingSweetSpotInQuardent(pSoldier: Pointer<SOLDIERTYPE>, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>, ubQuardentDir: INT8): UINT16 {
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
  let fFound: BOOLEAN = FALSE;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // Switch on quadrent
  if (ubQuardentDir == SOUTHEAST) {
    sBottom = 0;
    sLeft = 0;
  }

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;

      if (sSweetGridNo == sGridNo) {
        continue;
      }

      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        // Go on sweet stop
        if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            sLowestGridNo = sGridNo;
            uiLowestRange = uiRange;
            fFound = TRUE;
          }
        }
      }
    }
  }

  if (fFound) {
    // Set direction to center of map!
    *pubDirection = GetDirectionToGridNoFromGridNo(sLowestGridNo, (((WORLD_ROWS / 2) * WORLD_COLS) + (WORLD_COLS / 2)));

    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

function CanSoldierReachGridNoInGivenTileLimit(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, sMaxTiles: INT16, bLevel: INT8): BOOLEAN {
  let iNumTiles: INT32;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;

  if (pSoldier.value.bLevel != bLevel) {
    return FALSE;
  }

  sActionGridNo = FindAdjacentGridEx(pSoldier, sGridNo, &ubDirection, NULL, FALSE, FALSE);

  if (sActionGridNo == -1) {
    sActionGridNo = sGridNo;
  }

  if (sActionGridNo == pSoldier.value.sGridNo) {
    return TRUE;
  }

  iNumTiles = FindBestPath(pSoldier, sActionGridNo, pSoldier.value.bLevel, WALKING, NO_COPYROUTE, PATH_IGNORE_PERSON_AT_DEST);

  if (iNumTiles <= sMaxTiles && iNumTiles != 0) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function FindRandomGridNoFromSweetSpot(pSoldier: Pointer<SOLDIERTYPE>, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
  let sX: INT16;
  let sY: INT16;
  let sGridNo: INT16;
  let leftmost: INT32;
  let fFound: BOOLEAN = FALSE;
  let cnt: UINT32 = 0;
  let soldier: SOLDIERTYPE;
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
  memset(&soldier, 0, sizeof(SOLDIERTYPE));
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // ATE: CHECK FOR BOUNDARIES!!!!!!
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(&soldier, NOWHERE, 0, WALKING, COPYREACHABLE, (PATH_IGNORE_PERSON_AT_DEST | PATH_THROUGH_PEOPLE));

  do {
    sX = Random(ubRadius);
    sY = Random(ubRadius);

    leftmost = ((sSweetGridNo + (WORLD_COLS * sY)) / WORLD_COLS) * WORLD_COLS;

    sGridNo = sSweetGridNo + (WORLD_COLS * sY) + sX;

    if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
      // Go on sweet stop
      if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
        // If we are a crow, we need this additional check
        if (pSoldier.value.ubBodyType == CROW) {
          if (!InARoom(sGridNo, &ubRoomNum)) {
            fFound = TRUE;
          }
        } else {
          fFound = TRUE;
        }
      }
    }

    cnt++;

    if (cnt > 2000) {
      return NOWHERE;
    }
  } while (!fFound);

  // Set direction to center of map!
  *pubDirection = GetDirectionToGridNoFromGridNo(sGridNo, (((WORLD_ROWS / 2) * WORLD_COLS) + (WORLD_COLS / 2)));

  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;

  return sGridNo;
}

function FindRandomGridNoFromSweetSpotExcludingSweetSpot(pSoldier: Pointer<SOLDIERTYPE>, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
  let sX: INT16;
  let sY: INT16;
  let sGridNo: INT16;
  let leftmost: INT32;
  let fFound: BOOLEAN = FALSE;
  let cnt: UINT32 = 0;

  do {
    sX = Random(ubRadius);
    sY = Random(ubRadius);

    leftmost = ((sSweetGridNo + (WORLD_COLS * sY)) / WORLD_COLS) * WORLD_COLS;

    sGridNo = sSweetGridNo + (WORLD_COLS * sY) + sX;

    if (sGridNo == sSweetGridNo) {
      continue;
    }

    if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
      // Go on sweet stop
      if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier.value.bLevel)) {
        fFound = TRUE;
      }
    }

    cnt++;

    if (cnt > 2000) {
      return NOWHERE;
    }
  } while (!fFound);

  // Set direction to center of map!
  *pubDirection = GetDirectionToGridNoFromGridNo(sGridNo, (((WORLD_ROWS / 2) * WORLD_COLS) + (WORLD_COLS / 2)));

  return sGridNo;
}

function InternalAddSoldierToSector(ubID: UINT8, fCalculateDirection: BOOLEAN, fUseAnimation: BOOLEAN, usAnimState: UINT16, usAnimCode: UINT16): BOOLEAN {
  let ubDirection: UINT8;
  let ubCalculatedDirection: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sGridNo: INT16;
  let sExitGridNo: INT16;

  pSoldier = MercPtrs[ubID];

  if (pSoldier.value.bActive) {
    // ATE: Make sure life of elliot is OK if from a meanwhile
    if (AreInMeanwhile() && pSoldier.value.ubProfile == ELLIOT) {
      if (pSoldier.value.bLife < OKLIFE) {
        pSoldier.value.bLife = 25;
      }
    }

    // ADD SOLDIER TO SLOT!
    if (pSoldier.value.uiStatusFlags & SOLDIER_OFF_MAP) {
      AddAwaySlot(pSoldier);

      // Guy is NOT "in sector"
      pSoldier.value.bInSector = FALSE;
    } else {
      AddMercSlot(pSoldier);

      // Add guy to sector flag
      pSoldier.value.bInSector = TRUE;
    }

    // If a driver or passenger - stop here!
    if (pSoldier.value.uiStatusFlags & SOLDIER_DRIVER || pSoldier.value.uiStatusFlags & SOLDIER_PASSENGER) {
      return FALSE;
    }

    // Add to panel
    CheckForAndAddMercToTeamPanel(pSoldier);

    pSoldier.value.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_SPOTTING_CREATURE_ATTACK);
    pSoldier.value.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_SMELLED_CREATURE);
    pSoldier.value.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_WORRIED_ABOUT_CREATURES);

    // Add to interface if the are ours
    if (pSoldier.value.bTeam == CREATURE_TEAM) {
      sGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, STANDING, pSoldier.value.sInsertionGridNo, 7, &ubCalculatedDirection, FALSE);
      if (fCalculateDirection)
        ubDirection = ubCalculatedDirection;
      else
        ubDirection = pSoldier.value.ubInsertionDirection;
    } else {
      if (pSoldier.value.sInsertionGridNo == NOWHERE) {
        // Add the soldier to the respective entrypoint.  This is an error condition.
      }
      if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
        sGridNo = FindGridNoFromSweetSpotWithStructDataUsingGivenDirectionFirst(pSoldier, STANDING, pSoldier.value.sInsertionGridNo, 12, &ubCalculatedDirection, FALSE, pSoldier.value.ubInsertionDirection);
        // ATE: Override insertion direction
        pSoldier.value.ubInsertionDirection = ubCalculatedDirection;
      } else {
        sGridNo = FindGridNoFromSweetSpot(pSoldier, pSoldier.value.sInsertionGridNo, 7, &ubCalculatedDirection);

        // ATE: Error condition - if nowhere use insertion gridno!
        if (sGridNo == NOWHERE) {
          sGridNo = pSoldier.value.sInsertionGridNo;
        }
      }

      // Override calculated direction if we were told to....
      if (pSoldier.value.ubInsertionDirection > 100) {
        pSoldier.value.ubInsertionDirection = pSoldier.value.ubInsertionDirection - 100;
        fCalculateDirection = FALSE;
      }

      if (fCalculateDirection) {
        ubDirection = ubCalculatedDirection;

        // Check if we need to get direction from exit grid...
        if (pSoldier.value.bUseExitGridForReentryDirection) {
          pSoldier.value.bUseExitGridForReentryDirection = FALSE;

          // OK, we know there must be an exit gridno SOMEWHERE close...
          sExitGridNo = FindClosestExitGrid(pSoldier, sGridNo, 10);

          if (sExitGridNo != NOWHERE) {
            // We found one
            // Calculate direction...
            ubDirection = GetDirectionToGridNoFromGridNo(sExitGridNo, sGridNo);
          }
        }
      } else {
        ubDirection = pSoldier.value.ubInsertionDirection;
      }
    }

    // Add
    if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
      AddSoldierToSectorGridNo(pSoldier, sGridNo, pSoldier.value.bDirection, fUseAnimation, usAnimState, usAnimCode);
    else
      AddSoldierToSectorGridNo(pSoldier, sGridNo, ubDirection, fUseAnimation, usAnimState, usAnimCode);

    CheckForPotentialAddToBattleIncrement(pSoldier);

    return TRUE;
  }

  return FALSE;
}

function AddSoldierToSector(ubID: UINT8): BOOLEAN {
  return InternalAddSoldierToSector(ubID, TRUE, FALSE, 0, 0);
}

function AddSoldierToSectorNoCalculateDirection(ubID: UINT8): BOOLEAN {
  return InternalAddSoldierToSector(ubID, FALSE, FALSE, 0, 0);
}

function AddSoldierToSectorNoCalculateDirectionUseAnimation(ubID: UINT8, usAnimState: UINT16, usAnimCode: UINT16): BOOLEAN {
  return InternalAddSoldierToSector(ubID, FALSE, TRUE, usAnimState, usAnimCode);
}

function InternalSoldierInSectorSleep(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, fDoTransition: BOOLEAN): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8;
  let sGoodGridNo: INT16;
  let usAnim: UINT16 = SLEEPING;

  if (!pSoldier.value.bInSector) {
    return;
  }

  if (AM_AN_EPC(pSoldier)) {
    usAnim = STANDING;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, usAnim, sGridNo, 5, &ubNewDirection, FALSE);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  if (AM_AN_EPC(pSoldier)) {
    EVENT_InitNewSoldierAnim(pSoldier, STANDING, 1, TRUE);
  } else {
    if (fDoTransition) {
      EVENT_InitNewSoldierAnim(pSoldier, GOTO_SLEEP, 1, TRUE);
    } else {
      EVENT_InitNewSoldierAnim(pSoldier, SLEEPING, 1, TRUE);
    }
  }
}

function SoldierInSectorIncompaciated(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8;
  let sGoodGridNo: INT16;

  if (!pSoldier.value.bInSector) {
    return;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, STAND_FALLFORWARD_STOP, sGridNo, 5, &ubNewDirection, FALSE);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  EVENT_InitNewSoldierAnim(pSoldier, STAND_FALLFORWARD_STOP, 1, TRUE);
}

/*
void SoldierInSectorSleep( SOLDIERTYPE *pSoldier, INT16 sGridNo )
{
        InternalSoldierInSectorSleep( pSoldier, sGridNo, TRUE );
}
*/

function SoldierInSectorPatient(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8;
  let sGoodGridNo: INT16;

  if (!pSoldier.value.bInSector) {
    return;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, BEING_PATIENT, sGridNo, 5, &ubNewDirection, FALSE);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  if (!IS_MERC_BODY_TYPE(pSoldier)) {
    EVENT_InitNewSoldierAnim(pSoldier, STANDING, 1, TRUE);
  } else {
    EVENT_InitNewSoldierAnim(pSoldier, BEING_PATIENT, 1, TRUE);
  }
}

function SoldierInSectorDoctor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8;
  let sGoodGridNo: INT16;

  if (!pSoldier.value.bInSector) {
    return;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, BEING_DOCTOR, sGridNo, 5, &ubNewDirection, FALSE);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  if (!IS_MERC_BODY_TYPE(pSoldier)) {
    EVENT_InitNewSoldierAnim(pSoldier, STANDING, 1, TRUE);
  } else {
    EVENT_InitNewSoldierAnim(pSoldier, BEING_DOCTOR, 1, TRUE);
  }
}

function SoldierInSectorRepair(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let ubNewDirection: UINT8;
  let sGoodGridNo: INT16;

  if (!pSoldier.value.bInSector) {
    return;
  }

  // OK, look for sutable placement....
  sGoodGridNo = FindGridNoFromSweetSpotWithStructData(pSoldier, BEING_REPAIRMAN, sGridNo, 5, &ubNewDirection, FALSE);

  sWorldX = CenterX(sGoodGridNo);
  sWorldY = CenterY(sGoodGridNo);

  EVENT_SetSoldierPosition(pSoldier, sWorldX, sWorldY);

  EVENT_SetSoldierDirection(pSoldier, ubNewDirection);
  EVENT_SetSoldierDesiredDirection(pSoldier, ubNewDirection);

  // pSoldier->bDesiredDirection = pSoldier->bDirection;

  if (!IS_MERC_BODY_TYPE(pSoldier)) {
    EVENT_InitNewSoldierAnim(pSoldier, STANDING, 1, TRUE);
  } else {
    EVENT_InitNewSoldierAnim(pSoldier, BEING_REPAIRMAN, 1, TRUE);
  }
}

function AddSoldierToSectorGridNo(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, ubDirection: UINT8, fUseAnimation: BOOLEAN, usAnimState: UINT16, usAnimCode: UINT16): void {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sNewGridNo: INT16;
  let ubNewDirection: UINT8;
  let ubInsertionCode: UINT8;
  let fUpdateFinalPosition: BOOLEAN = TRUE;

  // Add merc to gridno
  sWorldX = CenterX(sGridNo);
  sWorldY = CenterY(sGridNo);

  // Set reserved location!
  pSoldier.value.sReservedMovementGridNo = NOWHERE;

  // Save OLD insertion code.. as this can change...
  ubInsertionCode = pSoldier.value.ubStrategicInsertionCode;

  // Remove any pending animations
  pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
  pSoldier.value.usPendingAnimation2 = NO_PENDING_ANIMATION;
  pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
  pSoldier.value.ubPendingAction = NO_PENDING_ACTION;

  // If we are not loading a saved game
  if ((gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Set final dest to be the same...
    fUpdateFinalPosition = FALSE;
  }

  // If this is a special insertion location, get path!
  if (ubInsertionCode == INSERTION_CODE_ARRIVING_GAME) {
    EVENT_SetSoldierPositionAndMaybeFinalDestAndMaybeNotDestination(pSoldier, sWorldX, sWorldY, fUpdateFinalPosition, fUpdateFinalPosition);
    EVENT_SetSoldierDirection(pSoldier, ubDirection);
    EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
  } else if (ubInsertionCode == INSERTION_CODE_CHOPPER) {
  } else {
    EVENT_SetSoldierPositionAndMaybeFinalDestAndMaybeNotDestination(pSoldier, sWorldX, sWorldY, fUpdateFinalPosition, fUpdateFinalPosition);

    // if we are loading, dont set the direction ( they are already set )
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      EVENT_SetSoldierDirection(pSoldier, ubDirection);

      EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    }
  }

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    if (!(pSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
      if (pSoldier.value.bTeam == gbPlayerNum) {
        RevealRoofsAndItems(pSoldier, TRUE, FALSE, pSoldier.value.bLevel, TRUE);

        // ATE: Patch fix: If we are in an non-interruptable animation, stop!
        if (pSoldier.value.usAnimState == HOPFENCE) {
          pSoldier.value.fInNonintAnim = FALSE;
          SoldierGotoStationaryStance(pSoldier);
        }

        EVENT_StopMerc(pSoldier, sGridNo, ubDirection);
      }
    }

    // If just arriving, set a destination to walk into from!
    if (ubInsertionCode == INSERTION_CODE_ARRIVING_GAME) {
      // Find a sweetspot near...
      sNewGridNo = FindGridNoFromSweetSpot(pSoldier, gMapInformation.sNorthGridNo, 4, &ubNewDirection);
      EVENT_GetNewSoldierPath(pSoldier, sNewGridNo, WALKING);
    }

    // If he's an enemy... set presence
    if (!pSoldier.value.bNeutral && (pSoldier.value.bSide != gbPlayerNum)) {
      // ATE: Added if not bloodcats
      // only do this once they are seen.....
      if (pSoldier.value.ubBodyType != BLOODCAT) {
        SetEnemyPresence();
      }
    }
  }

  if (!(pSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
    // if we are loading a 'pristine' map ( ie, not loading a saved game )
    if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
      // ATE: Double check if we are on the roof that there is a roof there!
      if (pSoldier.value.bLevel == 1) {
        if (!FindStructure(pSoldier.value.sGridNo, STRUCTURE_ROOF)) {
          SetSoldierHeight(pSoldier, (0));
        }
      }

      if (ubInsertionCode != INSERTION_CODE_ARRIVING_GAME) {
        // default to standing on arrival
        if (pSoldier.value.usAnimState != HELIDROP) {
          if (fUseAnimation) {
            EVENT_InitNewSoldierAnim(pSoldier, usAnimState, usAnimCode, TRUE);
          } else if (pSoldier.value.ubBodyType != CROW) {
            EVENT_InitNewSoldierAnim(pSoldier, STANDING, 1, TRUE);
          }
        }

        // ATE: if we are below OK life, make them lie down!
        if (pSoldier.value.bLife < OKLIFE) {
          SoldierInSectorIncompaciated(pSoldier, pSoldier.value.sInsertionGridNo);
        } else if (pSoldier.value.fMercAsleep == TRUE) {
          InternalSoldierInSectorSleep(pSoldier, pSoldier.value.sInsertionGridNo, FALSE);
        } else if (pSoldier.value.bAssignment == PATIENT) {
          SoldierInSectorPatient(pSoldier, pSoldier.value.sInsertionGridNo);
        } else if (pSoldier.value.bAssignment == DOCTOR) {
          SoldierInSectorDoctor(pSoldier, pSoldier.value.sInsertionGridNo);
        } else if (pSoldier.value.bAssignment == REPAIR) {
          SoldierInSectorRepair(pSoldier, pSoldier.value.sInsertionGridNo);
        }

        // ATE: Make sure movement mode is up to date!
        pSoldier.value.usUIMovementMode = GetMoveStateBasedOnStance(pSoldier, gAnimControl[pSoldier.value.usAnimState].ubEndHeight);
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
function IsMercOnTeam(ubMercID: UINT8): BOOLEAN {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.ubProfile == ubMercID) {
      if (pTeamSoldier.value.bActive)
        return TRUE;
    }
  }

  return FALSE;
}

// ATE: Added this new function for contract renewals
function IsMercOnTeamAndAlive(ubMercID: UINT8): BOOLEAN {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.ubProfile == ubMercID) {
      if (pTeamSoldier.value.bActive) {
        if (pTeamSoldier.value.bLife > 0) {
          return TRUE;
        }
      }
    }
  }

  return FALSE;
}

function IsMercOnTeamAndInOmertaAlready(ubMercID: UINT8): BOOLEAN {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.ubProfile == ubMercID) {
      if (pTeamSoldier.value.bActive && pTeamSoldier.value.bAssignment != IN_TRANSIT)
        return TRUE;
    }
  }

  return FALSE;
}

function IsMercOnTeamAndInOmertaAlreadyAndAlive(ubMercID: UINT8): BOOLEAN {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.ubProfile == ubMercID) {
      if (pTeamSoldier.value.bActive && pTeamSoldier.value.bAssignment != IN_TRANSIT) {
        if (pTeamSoldier.value.bLife > 0) {
          return TRUE;
        }
      }
    }
  }

  return FALSE;
}

// GetSoldierIDFromMercID() Gets the Soldier ID from the Merc Profile ID, else returns -1
function GetSoldierIDFromMercID(ubMercID: UINT8): INT16 {
  let cnt: UINT16;
  let ubLastTeamID: UINT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;

  ubLastTeamID = gTacticalStatus.Team[OUR_TEAM].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= ubLastTeamID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.ubProfile == ubMercID) {
      if (pTeamSoldier.value.bActive)
        return cnt;
    }
  }

  return -1;
}
