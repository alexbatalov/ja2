let StrategicMap: StrategicMapElement[] /* [MAP_WORLD_X * MAP_WORLD_Y] */;

function HandleStrategicDeath(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  // add the guy to the dead list
  // AddCharacterToDeadList( pSoldier );

  // If in a vehicle, remove them!
  if ((pSoldier.value.bAssignment == Enum117.VEHICLE) && (pSoldier.value.iVehicleId != -1)) {
    // remove from vehicle
    TakeSoldierOutOfVehicle(pSoldier);
  }

  // if not in mapscreen
  if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    // ATE; At least make them dead!
    if ((pSoldier.value.bAssignment != Enum117.ASSIGNMENT_DEAD)) {
      SetTimeOfAssignmentChangeForMerc(pSoldier);
    }

    ChangeSoldiersAssignment(pSoldier, Enum117.ASSIGNMENT_DEAD);
  } else if ((pSoldier.value.bLife == 0) && (pSoldier.value.bAssignment != Enum117.ASSIGNMENT_DEAD)) {
    // died in mapscreen

    fReDrawFace = true;

    // dead
    if ((pSoldier.value.bAssignment != Enum117.ASSIGNMENT_DEAD)) {
      SetTimeOfAssignmentChangeForMerc(pSoldier);
    }

    ChangeSoldiersAssignment(pSoldier, Enum117.ASSIGNMENT_DEAD);

    // s et breath and breath max to 0
    pSoldier.value.bBreath = pSoldier.value.bBreathMax = 0;

    // rebuild list
    ReBuildCharactersList();

    // ste merc as dead
    // pSoldier->fUIdeadMerc = TRUE;

    // attempt o remove character from squad
    RemoveCharacterFromSquads(pSoldier);

    // handle any passign comments by grunts
    HandleSoldierDeadComments(pSoldier);

    // put the dead guys down
    AddDeadSoldierToUnLoadedSector((pSoldier.value.sSectorX), (pSoldier.value.sSectorY), pSoldier.value.bSectorZ, pSoldier, RandomGridNo(), ADD_DEAD_SOLDIER_TO_SWEETSPOT);

    fTeamPanelDirty = true;
    fMapPanelDirty = true;
    fCharacterInfoPanelDirty = true;

    StopTimeCompression();
  }

  return true;
}

function HandleSoldierDeadComments(pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: INT32 = 0;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let bBuddyIndex: INT8;

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;

  // see if this was the friend of a living merc
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bLife >= OKLIFE && pTeamSoldier.value.bActive) {
      bBuddyIndex = WhichBuddy(pTeamSoldier.value.ubProfile, pSoldier.value.ubProfile);
      switch (bBuddyIndex) {
        case 0:
          // buddy #1 died!
          TacticalCharacterDialogue(pTeamSoldier, Enum202.QUOTE_BUDDY_ONE_KILLED);
          break;
        case 1:
          // buddy #2 died!
          TacticalCharacterDialogue(pTeamSoldier, Enum202.QUOTE_BUDDY_TWO_KILLED);
          break;
        case 2:
          // learn to like buddy died!
          TacticalCharacterDialogue(pTeamSoldier, Enum202.QUOTE_LEARNED_TO_LIKE_MERC_KILLED);
          break;
        default:
          break;
      }
    }
  }

  return;
}
