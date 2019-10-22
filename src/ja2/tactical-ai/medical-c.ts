//
// This file contains code devoted to the player AI-controlled medical system.  Maybe it
// can be used or adapted for the enemies too...
//

const NOT_GOING_TO_DIE = -1;
const NOT_GOING_TO_COLLAPSE = -1;

function FindAutobandageClimbPoint(sDesiredGridNo: INT16, fClimbUp: BOOLEAN): BOOLEAN {
  // checks for existance of location to climb up to building, not occupied by a medic
  let pBuilding: Pointer<BUILDING>;
  let ubNumClimbSpots: UINT8;
  let ubLoop: UINT8;
  let ubWhoIsThere: UINT8;

  pBuilding = FindBuilding(sDesiredGridNo);
  if (!pBuilding) {
    return FALSE;
  }

  ubNumClimbSpots = pBuilding.value.ubNumClimbSpots;

  for (ubLoop = 0; ubLoop < ubNumClimbSpots; ubLoop++) {
    ubWhoIsThere = WhoIsThere2(pBuilding.value.sUpClimbSpots[ubLoop], 1);
    if (ubWhoIsThere != NOBODY && !CanCharacterAutoBandageTeammate(MercPtrs[ubWhoIsThere])) {
      continue;
    }
    ubWhoIsThere = WhoIsThere2(pBuilding.value.sDownClimbSpots[ubLoop], 0);
    if (ubWhoIsThere != NOBODY && !CanCharacterAutoBandageTeammate(MercPtrs[ubWhoIsThere])) {
      continue;
    }
    return TRUE;
  }

  return FALSE;
}

function FullPatientCheck(pPatient: Pointer<SOLDIERTYPE>): BOOLEAN {
  let cnt: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (CanCharacterAutoBandageTeammate(pPatient)) {
    // can bandage self!
    return TRUE;
  }

  if (pPatient.value.bLevel != 0) {
    // look for a clear spot for jumping up

    // special "closest" search that ignores climb spots IF they are occupied by non-medics
    return FindAutobandageClimbPoint(pPatient.value.sGridNo, TRUE);
  } else {
    // run though the list of chars on team
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
      // can this character help out?
      if (CanCharacterAutoBandageTeammate(pSoldier) == TRUE) {
        // can this guy path to the patient?
        if (pSoldier.value.bLevel == 0) {
          // do a regular path check
          if (FindBestPath(pSoldier, pPatient.value.sGridNo, 0, WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
            return TRUE;
          }
        } else {
          // if on different levels, assume okay
          return TRUE;
        }
      }
    }
  }
  return FALSE;
}

function CanAutoBandage(fDoFullCheck: BOOLEAN): BOOLEAN {
  // returns false if we should stop being in auto-bandage mode
  let cnt: UINT8;
  let ubMedics: UINT8 = 0;
  let ubPatients: UINT8 = 0;
  let pSoldier: Pointer<SOLDIERTYPE>;
  /* static */ let ubIDForFullCheck: UINT8 = NOBODY;

  // run though the list of chars on team
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // can this character help out?
    if (CanCharacterAutoBandageTeammate(pSoldier) == TRUE) {
      // yep, up the number of medics in sector
      ubMedics++;
    }
  }

  if (ubMedics == 0) {
    // no one that can help
    return FALSE;
  }

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // can this character be helped out by a teammate?
    if (CanCharacterBeAutoBandagedByTeammate(pSoldier) == TRUE) {
      // yep, up the number of patients awaiting treatment in sector
      ubPatients++;
      if (fDoFullCheck) {
        if (ubIDForFullCheck == NOBODY) {
          // do this guy NEXT time around
          ubIDForFullCheck = cnt;
        } else if (cnt == ubIDForFullCheck) {
          // test this guy
          if (FullPatientCheck(pSoldier) == FALSE) {
            // shit!
            gfAutoBandageFailed = TRUE;
            return FALSE;
          }
          // set ID for full check to NOBODY; will be set to someone later in loop, or to
          // the first guy on the next pass
          ubIDForFullCheck = NOBODY;
        }
      }
    }
    // is this guy REACHABLE??
  }

  if (ubPatients == 0) {
    // there is no one to help
    return FALSE;
  } else {
    // got someone that can help and help wanted
    return TRUE;
  }
}

function CanCharacterAutoBandageTeammate(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN
// can this soldier autobandage others in sector
{
  // if the soldier isn't active or in sector, we have problems..leave
  if (!(pSoldier.value.bActive) || !(pSoldier.value.bInSector) || (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.value.bAssignment == VEHICLE)) {
    return FALSE;
  }

  // they must have oklife or more, not be collapsed, have some level of medical competence, and have a med kit of some sort
  if ((pSoldier.value.bLife >= OKLIFE) && !(pSoldier.value.bCollapsed) && (pSoldier.value.bMedical > 0) && (FindObjClass(pSoldier, IC_MEDKIT) != NO_SLOT)) {
    return TRUE;
  }

  return FALSE;
}

// can this soldier autobandage others in sector
function CanCharacterBeAutoBandagedByTeammate(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // if the soldier isn't active or in sector, we have problems..leave
  if (!(pSoldier.value.bActive) || !(pSoldier.value.bInSector) || (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.value.bAssignment == VEHICLE)) {
    return FALSE;
  }

  if ((pSoldier.value.bLife > 0) && (pSoldier.value.bBleeding > 0)) {
    // someone's bleeding and not being given first aid!
    return TRUE;
  }

  return FALSE;
}

function FindBestPatient(pSoldier: Pointer<SOLDIERTYPE>, pfDoClimb: Pointer<BOOLEAN>): INT8 {
  let cnt: UINT8;
  let cnt2: UINT8;
  let bBestPriority: INT16 = 0;
  let sBestAdjGridNo: INT16;
  let sPatientGridNo: INT16;
  let sBestPatientGridNo: INT16;
  let sShortestPath: INT16 = 1000;
  let sPathCost: INT16;
  let sOtherMedicPathCost: INT16;
  let pPatient: Pointer<SOLDIERTYPE>;
  let pBestPatient: Pointer<SOLDIERTYPE> = NULL;
  let pOtherMedic: Pointer<SOLDIERTYPE>;
  let bPatientPriority: INT8;
  let ubDirection: UINT8;
  let sAdjustedGridNo: INT16;
  let sAdjacentGridNo: INT16;
  let sOtherAdjacentGridNo: INT16;
  let sClimbGridNo: INT16;
  let sBestClimbGridNo: INT16 = NOWHERE;
  let sShortestClimbPath: INT16 = 1000;
  let fClimbingNecessary: BOOLEAN;

  gubGlobalPathFlags = PATH_THROUGH_PEOPLE;

  // search for someone who needs aid
  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  for (pPatient = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pPatient++) {
    if (!(pPatient.value.bActive) || !(pPatient.value.bInSector)) {
      continue; // NEXT!!!
    }

    if (pPatient.value.bLife > 0 && pPatient.value.bBleeding && pPatient.value.ubServiceCount == 0) {
      if (pPatient.value.bLife < OKLIFE) {
        bPatientPriority = 3;
      } else if (pPatient.value.bLife < OKLIFE * 2) {
        bPatientPriority = 2;
      } else {
        bPatientPriority = 1;
      }

      if (bPatientPriority >= bBestPriority) {
        if (!ClimbingNecessary(pSoldier, pPatient.value.sGridNo, pPatient.value.bLevel)) {
          sPatientGridNo = pPatient.value.sGridNo;
          sAdjacentGridNo = FindAdjacentGridEx(pSoldier, sPatientGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), FALSE, FALSE);
          if (sAdjacentGridNo == -1 && gAnimControl[pPatient.value.usAnimState].ubEndHeight == ANIM_PRONE) {
            // prone; could be the base tile is inaccessible but the rest isn't...
            for (cnt2 = 0; cnt2 < NUM_WORLD_DIRECTIONS; cnt2++) {
              sPatientGridNo = pPatient.value.sGridNo + DirectionInc(cnt2);
              if (WhoIsThere2(sPatientGridNo, pPatient.value.bLevel) == pPatient.value.ubID) {
                // patient is also here, try this location
                sAdjacentGridNo = FindAdjacentGridEx(pSoldier, sPatientGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), FALSE, FALSE);
                if (sAdjacentGridNo != -1) {
                  break;
                }
              }
            }
          }

          if (sAdjacentGridNo != -1) {
            if (sAdjacentGridNo == pSoldier.value.sGridNo) {
              sPathCost = 1;
            } else {
              sPathCost = PlotPath(pSoldier, sAdjacentGridNo, FALSE, FALSE, FALSE, RUNNING, FALSE, FALSE, 0);
            }

            if (sPathCost != 0) {
              // we can get there... can anyone else?

              if (pPatient.value.ubAutoBandagingMedic != NOBODY && pPatient.value.ubAutoBandagingMedic != pSoldier.value.ubID) {
                // only switch to this patient if our distance is closer than
                // the other medic's
                pOtherMedic = MercPtrs[pPatient.value.ubAutoBandagingMedic];
                sOtherAdjacentGridNo = FindAdjacentGridEx(pOtherMedic, sPatientGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), FALSE, FALSE);
                if (sOtherAdjacentGridNo != -1) {
                  if (sOtherAdjacentGridNo == pOtherMedic.value.sGridNo) {
                    sOtherMedicPathCost = 1;
                  } else {
                    sOtherMedicPathCost = PlotPath(pOtherMedic, sOtherAdjacentGridNo, FALSE, FALSE, FALSE, RUNNING, FALSE, FALSE, 0);
                  }

                  if (sPathCost >= sOtherMedicPathCost) {
                    // this patient is best served by the merc moving to them now
                    continue;
                  }
                }
              }

              if (bPatientPriority == bBestPriority) {
                // compare path distances
                if (sPathCost > sShortestPath) {
                  continue;
                }
              }

              sShortestPath = sPathCost;
              pBestPatient = pPatient;
              sBestPatientGridNo = sPatientGridNo;
              bBestPriority = bPatientPriority;
              sBestAdjGridNo = sAdjacentGridNo;
            }
          }
        } else {
          sClimbGridNo = NOWHERE;
          // see if guy on another building etc and we need to climb somewhere
          sPathCost = EstimatePathCostToLocation(pSoldier, pPatient.value.sGridNo, pPatient.value.bLevel, FALSE, addressof(fClimbingNecessary), addressof(sClimbGridNo));
          // if we can get there
          if (sPathCost != 0 && fClimbingNecessary && sPathCost < sShortestClimbPath) {
            sBestClimbGridNo = sClimbGridNo;
            sShortestClimbPath = sPathCost;
          }
        }
      }
    }
  }

  gubGlobalPathFlags = 0;

  if (pBestPatient) {
    if (pBestPatient.value.ubAutoBandagingMedic != NOBODY) {
      // cancel that medic
      CancelAIAction(MercPtrs[pBestPatient.value.ubAutoBandagingMedic], TRUE);
    }
    pBestPatient.value.ubAutoBandagingMedic = pSoldier.value.ubID;
    *pfDoClimb = FALSE;
    if (CardinalSpacesAway(pSoldier.value.sGridNo, sBestPatientGridNo) == 1) {
      pSoldier.value.usActionData = sBestPatientGridNo;
      return AI_ACTION_GIVE_AID;
    } else {
      pSoldier.value.usActionData = sBestAdjGridNo;
      return AI_ACTION_GET_CLOSER;
    }
  } else if (sBestClimbGridNo != NOWHERE) {
    *pfDoClimb = TRUE;
    pSoldier.value.usActionData = sBestClimbGridNo;
    return AI_ACTION_MOVE_TO_CLIMB;
  } else {
    return AI_ACTION_NONE;
  }
}

function DecideAutoBandage(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let bSlot: INT8;
  let fDoClimb: BOOLEAN;

  if (pSoldier.value.bMedical == 0 || pSoldier.value.ubServicePartner != NOBODY) {
    // don't/can't make decision
    return AI_ACTION_NONE;
  }

  bSlot = FindObjClass(pSoldier, IC_MEDKIT);
  if (bSlot == NO_SLOT) {
    // no medical kit!
    return AI_ACTION_NONE;
  }

  if (pSoldier.value.bBleeding) {
    // heal self first!
    pSoldier.value.usActionData = pSoldier.value.sGridNo;
    if (bSlot != HANDPOS) {
      pSoldier.value.bSlotItemTakenFrom = bSlot;

      SwapObjs(addressof(pSoldier.value.inv[HANDPOS]), addressof(pSoldier.value.inv[bSlot]));
      /*
      memset( &TempObj, 0, sizeof( OBJECTTYPE ) );
      // move the med kit out to temp obj
      SwapObjs( &TempObj, &(pSoldier->inv[bSlot]) );
      // swap the med kit with whatever was in the hand
      SwapObjs( &TempObj, &(pSoldier->inv[HANDPOS]) );
      // replace whatever was in the hand somewhere in inventory
      AutoPlaceObject( pSoldier, &TempObj, FALSE );
      */
    }
    return AI_ACTION_GIVE_AID;
  }

  //	pSoldier->usActionData = FindClosestPatient( pSoldier );
  pSoldier.value.bAction = FindBestPatient(pSoldier, addressof(fDoClimb));
  if (pSoldier.value.bAction != AI_ACTION_NONE) {
    pSoldier.value.usUIMovementMode = RUNNING;
    if (bSlot != HANDPOS) {
      pSoldier.value.bSlotItemTakenFrom = bSlot;

      SwapObjs(addressof(pSoldier.value.inv[HANDPOS]), addressof(pSoldier.value.inv[bSlot]));
    }
    return pSoldier.value.bAction;
  }

  // do nothing
  return AI_ACTION_NONE;
}
