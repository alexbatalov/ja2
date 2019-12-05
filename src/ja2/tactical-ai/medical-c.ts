namespace ja2 {

//
// This file contains code devoted to the player AI-controlled medical system.  Maybe it
// can be used or adapted for the enemies too...
//

const NOT_GOING_TO_DIE = -1;
const NOT_GOING_TO_COLLAPSE = -1;

function FindAutobandageClimbPoint(sDesiredGridNo: INT16, fClimbUp: boolean): boolean {
  // checks for existance of location to climb up to building, not occupied by a medic
  let pBuilding: BUILDING | null;
  let ubNumClimbSpots: UINT8;
  let ubLoop: UINT8;
  let ubWhoIsThere: UINT8;

  pBuilding = FindBuilding(sDesiredGridNo);
  if (!pBuilding) {
    return false;
  }

  ubNumClimbSpots = pBuilding.ubNumClimbSpots;

  for (ubLoop = 0; ubLoop < ubNumClimbSpots; ubLoop++) {
    ubWhoIsThere = WhoIsThere2(pBuilding.sUpClimbSpots[ubLoop], 1);
    if (ubWhoIsThere != NOBODY && !CanCharacterAutoBandageTeammate(MercPtrs[ubWhoIsThere])) {
      continue;
    }
    ubWhoIsThere = WhoIsThere2(pBuilding.sDownClimbSpots[ubLoop], 0);
    if (ubWhoIsThere != NOBODY && !CanCharacterAutoBandageTeammate(MercPtrs[ubWhoIsThere])) {
      continue;
    }
    return true;
  }

  return false;
}

function FullPatientCheck(pPatient: SOLDIERTYPE): boolean {
  let cnt: UINT8;
  let pSoldier: SOLDIERTYPE;

  if (CanCharacterAutoBandageTeammate(pPatient)) {
    // can bandage self!
    return true;
  }

  if (pPatient.bLevel != 0) {
    // look for a clear spot for jumping up

    // special "closest" search that ignores climb spots IF they are occupied by non-medics
    return FindAutobandageClimbPoint(pPatient.sGridNo, true);
  } else {
    // run though the list of chars on team
    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
      // can this character help out?
      if (CanCharacterAutoBandageTeammate(pSoldier) == true) {
        // can this guy path to the patient?
        if (pSoldier.bLevel == 0) {
          // do a regular path check
          if (FindBestPath(pSoldier, pPatient.sGridNo, 0, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
            return true;
          }
        } else {
          // if on different levels, assume okay
          return true;
        }
      }
    }
  }
  return false;
}

/* static */ let CanAutoBandage__ubIDForFullCheck: UINT8 = NOBODY;
export function CanAutoBandage(fDoFullCheck: boolean): boolean {
  // returns false if we should stop being in auto-bandage mode
  let cnt: UINT8;
  let ubMedics: UINT8 = 0;
  let ubPatients: UINT8 = 0;
  let pSoldier: SOLDIERTYPE;

  // run though the list of chars on team
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    // can this character help out?
    if (CanCharacterAutoBandageTeammate(pSoldier) == true) {
      // yep, up the number of medics in sector
      ubMedics++;
    }
  }

  if (ubMedics == 0) {
    // no one that can help
    return false;
  }

  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    // can this character be helped out by a teammate?
    if (CanCharacterBeAutoBandagedByTeammate(pSoldier) == true) {
      // yep, up the number of patients awaiting treatment in sector
      ubPatients++;
      if (fDoFullCheck) {
        if (CanAutoBandage__ubIDForFullCheck == NOBODY) {
          // do this guy NEXT time around
          CanAutoBandage__ubIDForFullCheck = cnt;
        } else if (cnt == CanAutoBandage__ubIDForFullCheck) {
          // test this guy
          if (FullPatientCheck(pSoldier) == false) {
            // shit!
            gfAutoBandageFailed = true;
            return false;
          }
          // set ID for full check to NOBODY; will be set to someone later in loop, or to
          // the first guy on the next pass
          CanAutoBandage__ubIDForFullCheck = NOBODY;
        }
      }
    }
    // is this guy REACHABLE??
  }

  if (ubPatients == 0) {
    // there is no one to help
    return false;
  } else {
    // got someone that can help and help wanted
    return true;
  }
}

export function CanCharacterAutoBandageTeammate(pSoldier: SOLDIERTYPE): boolean
// can this soldier autobandage others in sector
{
  // if the soldier isn't active or in sector, we have problems..leave
  if (!(pSoldier.bActive) || !(pSoldier.bInSector) || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.bAssignment == Enum117.VEHICLE)) {
    return false;
  }

  // they must have oklife or more, not be collapsed, have some level of medical competence, and have a med kit of some sort
  if ((pSoldier.bLife >= OKLIFE) && !(pSoldier.bCollapsed) && (pSoldier.bMedical > 0) && (FindObjClass(pSoldier, IC_MEDKIT) != NO_SLOT)) {
    return true;
  }

  return false;
}

// can this soldier autobandage others in sector
export function CanCharacterBeAutoBandagedByTeammate(pSoldier: SOLDIERTYPE): boolean {
  // if the soldier isn't active or in sector, we have problems..leave
  if (!(pSoldier.bActive) || !(pSoldier.bInSector) || (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || (pSoldier.bAssignment == Enum117.VEHICLE)) {
    return false;
  }

  if ((pSoldier.bLife > 0) && (pSoldier.bBleeding > 0)) {
    // someone's bleeding and not being given first aid!
    return true;
  }

  return false;
}

function FindBestPatient(pSoldier: SOLDIERTYPE, pfDoClimb: Pointer<boolean>): INT8 {
  let cnt: UINT8;
  let cnt2: UINT8;
  let bBestPriority: INT16 = 0;
  let sBestAdjGridNo: INT16 = 0;
  let sPatientGridNo: INT16;
  let sBestPatientGridNo: INT16 = 0;
  let sShortestPath: INT16 = 1000;
  let sPathCost: INT16;
  let sOtherMedicPathCost: INT16;
  let pPatient: SOLDIERTYPE;
  let pBestPatient: SOLDIERTYPE | null = null;
  let pOtherMedic: SOLDIERTYPE;
  let bPatientPriority: INT8;
  let ubDirection: UINT8 = 0;
  let ubDirection__Pointer = createPointer(() => ubDirection, (v) => ubDirection = v);
  let sAdjustedGridNo: INT16 = 0;
  let sAdjustedGridNo__Pointer = createPointer(() => sAdjustedGridNo, (v) => sAdjustedGridNo = v);
  let sAdjacentGridNo: INT16;
  let sOtherAdjacentGridNo: INT16;
  let sClimbGridNo: INT16 = 0;
  let sClimbGridNo__Pointer = createPointer(() => sClimbGridNo, (v) => sClimbGridNo = v);
  let sBestClimbGridNo: INT16 = NOWHERE;
  let sShortestClimbPath: INT16 = 1000;
  let fClimbingNecessary: boolean = false;
  let fClimbingNecessary__Pointer = createPointer(() => fClimbingNecessary, (v) => fClimbingNecessary = v);

  gubGlobalPathFlags = PATH_THROUGH_PEOPLE;

  // search for someone who needs aid
  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  for (pPatient = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pPatient = MercPtrs[cnt]) {
    if (!(pPatient.bActive) || !(pPatient.bInSector)) {
      continue; // NEXT!!!
    }

    if (pPatient.bLife > 0 && pPatient.bBleeding && pPatient.ubServiceCount == 0) {
      if (pPatient.bLife < OKLIFE) {
        bPatientPriority = 3;
      } else if (pPatient.bLife < OKLIFE * 2) {
        bPatientPriority = 2;
      } else {
        bPatientPriority = 1;
      }

      if (bPatientPriority >= bBestPriority) {
        if (!ClimbingNecessary(pSoldier, pPatient.sGridNo, pPatient.bLevel)) {
          sPatientGridNo = pPatient.sGridNo;
          sAdjacentGridNo = FindAdjacentGridEx(pSoldier, sPatientGridNo, ubDirection__Pointer, sAdjustedGridNo__Pointer, false, false);
          if (sAdjacentGridNo == -1 && gAnimControl[pPatient.usAnimState].ubEndHeight == ANIM_PRONE) {
            // prone; could be the base tile is inaccessible but the rest isn't...
            for (cnt2 = 0; cnt2 < Enum245.NUM_WORLD_DIRECTIONS; cnt2++) {
              sPatientGridNo = pPatient.sGridNo + DirectionInc(cnt2);
              if (WhoIsThere2(sPatientGridNo, pPatient.bLevel) == pPatient.ubID) {
                // patient is also here, try this location
                sAdjacentGridNo = FindAdjacentGridEx(pSoldier, sPatientGridNo, ubDirection__Pointer, sAdjustedGridNo__Pointer, false, false);
                if (sAdjacentGridNo != -1) {
                  break;
                }
              }
            }
          }

          if (sAdjacentGridNo != -1) {
            if (sAdjacentGridNo == pSoldier.sGridNo) {
              sPathCost = 1;
            } else {
              sPathCost = PlotPath(pSoldier, sAdjacentGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, Enum193.RUNNING, NOT_STEALTH, FORWARD, 0);
            }

            if (sPathCost != 0) {
              // we can get there... can anyone else?

              if (pPatient.ubAutoBandagingMedic != NOBODY && pPatient.ubAutoBandagingMedic != pSoldier.ubID) {
                // only switch to this patient if our distance is closer than
                // the other medic's
                pOtherMedic = MercPtrs[pPatient.ubAutoBandagingMedic];
                sOtherAdjacentGridNo = FindAdjacentGridEx(pOtherMedic, sPatientGridNo, ubDirection__Pointer, sAdjustedGridNo__Pointer, false, false);
                if (sOtherAdjacentGridNo != -1) {
                  if (sOtherAdjacentGridNo == pOtherMedic.sGridNo) {
                    sOtherMedicPathCost = 1;
                  } else {
                    sOtherMedicPathCost = PlotPath(pOtherMedic, sOtherAdjacentGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, Enum193.RUNNING, NOT_STEALTH, FORWARD, 0);
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
          sPathCost = EstimatePathCostToLocation(pSoldier, pPatient.sGridNo, pPatient.bLevel, false, fClimbingNecessary__Pointer, sClimbGridNo__Pointer);
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
    if (pBestPatient.ubAutoBandagingMedic != NOBODY) {
      // cancel that medic
      CancelAIAction(MercPtrs[pBestPatient.ubAutoBandagingMedic], 1);
    }
    pBestPatient.ubAutoBandagingMedic = pSoldier.ubID;
    pfDoClimb.value = false;
    if (CardinalSpacesAway(pSoldier.sGridNo, sBestPatientGridNo) == 1) {
      pSoldier.usActionData = sBestPatientGridNo;
      return Enum289.AI_ACTION_GIVE_AID;
    } else {
      pSoldier.usActionData = sBestAdjGridNo;
      return Enum289.AI_ACTION_GET_CLOSER;
    }
  } else if (sBestClimbGridNo != NOWHERE) {
    pfDoClimb.value = true;
    pSoldier.usActionData = sBestClimbGridNo;
    return Enum289.AI_ACTION_MOVE_TO_CLIMB;
  } else {
    return Enum289.AI_ACTION_NONE;
  }
}

export function DecideAutoBandage(pSoldier: SOLDIERTYPE): INT8 {
  let bSlot: INT8;
  let fDoClimb: boolean;

  if (pSoldier.bMedical == 0 || pSoldier.ubServicePartner != NOBODY) {
    // don't/can't make decision
    return Enum289.AI_ACTION_NONE;
  }

  bSlot = FindObjClass(pSoldier, IC_MEDKIT);
  if (bSlot == NO_SLOT) {
    // no medical kit!
    return Enum289.AI_ACTION_NONE;
  }

  if (pSoldier.bBleeding) {
    // heal self first!
    pSoldier.usActionData = pSoldier.sGridNo;
    if (bSlot != Enum261.HANDPOS) {
      pSoldier.bSlotItemTakenFrom = bSlot;

      SwapObjs(pSoldier.inv[Enum261.HANDPOS], pSoldier.inv[bSlot]);
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
    return Enum289.AI_ACTION_GIVE_AID;
  }

  //	pSoldier->usActionData = FindClosestPatient( pSoldier );
  pSoldier.bAction = FindBestPatient(pSoldier, createPointer(() => fDoClimb, (v) => fDoClimb = v));
  if (pSoldier.bAction != Enum289.AI_ACTION_NONE) {
    pSoldier.usUIMovementMode = Enum193.RUNNING;
    if (bSlot != Enum261.HANDPOS) {
      pSoldier.bSlotItemTakenFrom = bSlot;

      SwapObjs(pSoldier.inv[Enum261.HANDPOS], pSoldier.inv[bSlot]);
    }
    return pSoldier.bAction;
  }

  // do nothing
  return Enum289.AI_ACTION_NONE;
}

}
