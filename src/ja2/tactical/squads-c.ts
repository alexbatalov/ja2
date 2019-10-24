interface SAVE_SQUAD_INFO_STRUCT {
  uiID: INT16; // The soldiers ID
  sPadding: INT16[] /* [5] */;
}

// squad array
let Squad: Pointer<SOLDIERTYPE>[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */;

// list of dead guys for squads...in id values -> -1 means no one home
let sDeadMercs: INT16[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */;

// the movement group ids
let SquadMovementGroups: INT8[] /* [NUMBER_OF_SQUADS] */;

let fExitingVehicleToSquad: BOOLEAN = FALSE;

let iCurrentTacticalSquad: INT32 = Enum275.FIRST_SQUAD;

function InitSquads(): void {
  // init the squad lists to NULL ptrs.
  let iCounterB: INT32 = 0;
  let iCounter: INT32 = 0;
  let pGroup: Pointer<GROUP> = null;

  // null each list of ptrs.
  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    for (iCounterB = 0; iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounterB++) {
      // squad, soldier
      Squad[iCounter][iCounterB] = null;
    }

    // create mvt groups
    SquadMovementGroups[iCounter] = CreateNewPlayerGroupDepartingFromSector(1, 1);

    // Set persistent....
    pGroup = GetGroup(SquadMovementGroups[iCounter]);
    pGroup.value.fPersistant = TRUE;
  }

  memset(sDeadMercs, -1, sizeof(INT16) * Enum275.NUMBER_OF_SQUADS * NUMBER_OF_SOLDIERS_PER_SQUAD);

  return;
}

function IsThisSquadFull(bSquadValue: INT8): BOOLEAN {
  let iCounter: INT32 = 0;

  // run through entries in the squad list, make sure there is a free entry
  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    // check this slot
    if (Squad[bSquadValue][iCounter] == null) {
      // a free slot found - not full
      return FALSE;
    }
  }

  // no free slots - it's full
  return TRUE;
}

function GetFirstEmptySquad(): INT8 {
  let ubCounter: UINT8 = 0;

  for (ubCounter = 0; ubCounter < Enum275.NUMBER_OF_SQUADS; ubCounter++) {
    if (SquadIsEmpty(ubCounter) == TRUE) {
      // empty squad, return value
      return ubCounter;
    }
  }

  // not found - none are completely empty (shouldn't ever happen!)
  Assert(FALSE);
  return -1;
}

function AddCharacterToSquad(pCharacter: Pointer<SOLDIERTYPE>, bSquadValue: INT8): BOOLEAN {
  let bCounter: INT8 = 0;
  let sX: INT16;
  let sY: INT16;
  let bZ: INT8;
  //	BOOLEAN fBetweenSectors = FALSE;
  let pGroup: Pointer<GROUP>;
  let fNewSquad: BOOLEAN;

  // add character to squad...return success or failure
  // run through list of people in squad, find first free slo

  if (fExitingVehicleToSquad) {
    return FALSE;
  }

  // ATE: If any vehicle exists in this squad AND we're not set to
  // a driver or or passenger, when return false
  if (DoesVehicleExistInSquad(bSquadValue)) {
    // We're not allowing anybody to go on a vehicle if they are not passengers!
    // NB: We obviously need to make sure that REAL passengers have their
    // flags set before adding them to a squad!
    if (!(pCharacter.value.uiStatusFlags & (SOLDIER_PASSENGER | SOLDIER_DRIVER | SOLDIER_VEHICLE))) {
      return FALSE;
    }
  }

  // if squad is on the move, can't add someone
  if (IsThisSquadOnTheMove(bSquadValue) == TRUE) {
    // nope, go away now
    return FALSE;
  }

  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    // check if on current squad and current slot?
    if (Squad[bSquadValue][bCounter] == pCharacter) {
      // 'successful of sorts, if there, then he's 'added'
      return TRUE;
    }

    // free slot, add here
    if (Squad[bSquadValue][bCounter] == null) {
      // check if squad empty, if not check sector x,y,z are the same as this guys
      if (SquadIsEmpty(bSquadValue) == FALSE) {
        GetLocationOfSquad(addressof(sX), addressof(sY), addressof(bZ), bSquadValue);

        // if not same, return false
        if ((pCharacter.value.sSectorX != sX) || (pCharacter.value.sSectorY != sY) || (pCharacter.value.bSectorZ != bZ)) {
          return FALSE;
        }
        // remove them
        RemoveCharacterFromSquads(pCharacter);

        //				fBetweenSectors =  Squad[ bSquadValue ][ 0 ]->fBetweenSectors;
      } else {
        // remove them
        RemoveCharacterFromSquads(pCharacter);
      }

      /*
                              if( fBetweenSectors == TRUE )
                              {
                                      pCharacter->fBetweenSectors = TRUE;
                              }
      */

      // copy path of squad to this char
      CopyPathOfSquadToCharacter(pCharacter, bSquadValue);

      // check if old mvt group
      if (pCharacter.value.ubGroupID != 0) {
        // in valid group, remove from that group
        RemovePlayerFromGroup(pCharacter.value.ubGroupID, pCharacter);

        // character not on a reserved group
        if ((pCharacter.value.bAssignment >= Enum117.ON_DUTY) && (pCharacter.value.bAssignment != Enum117.VEHICLE)) {
          // get the group from the character
          pGroup = GetGroup(pCharacter.value.ubGroupID);

          // if valid group, delete it
          if (pGroup) {
            RemoveGroupFromList(pGroup);
          }
        }
      }

      if ((pCharacter.value.bAssignment == Enum117.VEHICLE) && (pCharacter.value.iVehicleId == iHelicopterVehicleId) && (pCharacter.value.iVehicleId != -1)) {
        // if creating a new squad from guys exiting the chopper
        fNewSquad = SquadIsEmpty(bSquadValue);

        RemoveSoldierFromHelicopter(pCharacter);

        AddPlayerToGroup(SquadMovementGroups[bSquadValue], pCharacter);
        SetGroupSectorValue(pCharacter.value.sSectorX, pCharacter.value.sSectorY, pCharacter.value.bSectorZ, SquadMovementGroups[bSquadValue]);
        pCharacter.value.ubGroupID = SquadMovementGroups[bSquadValue];

        // if we've just started a new squad
        if (fNewSquad) {
          // set mvt group for
          let pGroup: Pointer<GROUP>;

          // grab group
          pGroup = GetGroup(pVehicleList[iHelicopterVehicleId].ubMovementGroup);
          Assert(pGroup);

          if (pGroup) {
            // set where it is and where it's going, then make it arrive there.  Don't check for battle
            PlaceGroupInSector(SquadMovementGroups[bSquadValue], pGroup.value.ubPrevX, pGroup.value.ubPrevY, pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ, FALSE);
          }
        }
      } else if ((pCharacter.value.bAssignment == Enum117.VEHICLE) && (pCharacter.value.iVehicleId != -1)) {
        fExitingVehicleToSquad = TRUE;
        // remove from vehicle
        TakeSoldierOutOfVehicle(pCharacter);
        fExitingVehicleToSquad = FALSE;

        AddPlayerToGroup(SquadMovementGroups[bSquadValue], pCharacter);
        SetGroupSectorValue(pCharacter.value.sSectorX, pCharacter.value.sSectorY, pCharacter.value.bSectorZ, SquadMovementGroups[bSquadValue]);
        pCharacter.value.ubGroupID = SquadMovementGroups[bSquadValue];
      } else {
        AddPlayerToGroup(SquadMovementGroups[bSquadValue], pCharacter);
        SetGroupSectorValue(pCharacter.value.sSectorX, pCharacter.value.sSectorY, pCharacter.value.bSectorZ, SquadMovementGroups[bSquadValue]);
        pCharacter.value.ubGroupID = SquadMovementGroups[bSquadValue];
      }

      // assign here
      Squad[bSquadValue][bCounter] = pCharacter;

      if ((pCharacter.value.bAssignment != bSquadValue)) {
        // check to see if we should wake them up
        if (pCharacter.value.fMercAsleep) {
          // try to wake him up
          SetMercAwake(pCharacter, FALSE, FALSE);
        }
        SetTimeOfAssignmentChangeForMerc(pCharacter);
      }

      // set squad value
      ChangeSoldiersAssignment(pCharacter, bSquadValue);
      if (pCharacter.value.bOldAssignment < Enum117.ON_DUTY) {
        pCharacter.value.bOldAssignment = bSquadValue;
      }

      // if current tactical sqaud...upadte panel
      if (NumberOfPeopleInSquad(iCurrentTacticalSquad) == 0) {
        SetCurrentSquad(bSquadValue, TRUE);
      }

      if (bSquadValue == iCurrentTacticalSquad) {
        CheckForAndAddMercToTeamPanel(Squad[iCurrentTacticalSquad][bCounter]);
      }

      if (pCharacter.value.ubID == gusSelectedSoldier) {
        SetCurrentSquad(bSquadValue, TRUE);
      }

      return TRUE;
    }
  }

  return FALSE;
}

// find the first slot we can fit the guy in
function AddCharacterToAnySquad(pCharacter: Pointer<SOLDIERTYPE>): BOOLEAN {
  // add character to any squad, if character is assigned to a squad, returns TRUE
  let bCounter: INT8 = 0;
  let bFirstEmptySquad: INT8 = -1;

  // remove them from current squad
  RemoveCharacterFromSquads(pCharacter);

  // first look for a compatible NON-EMPTY squad (don't start new squad if we don't have to)
  for (bCounter = 0; bCounter < Enum275.NUMBER_OF_SQUADS; bCounter++) {
    if (SquadIsEmpty(bCounter) == FALSE) {
      if (AddCharacterToSquad(pCharacter, bCounter) == TRUE) {
        return TRUE;
      }
    } else {
      if (bFirstEmptySquad == -1) {
        bFirstEmptySquad = bCounter;
      }
    }
  }

  // no non-empty compatible squads were found

  // try the first empty one (and there better be one)
  if (bFirstEmptySquad != -1) {
    if (AddCharacterToSquad(pCharacter, bFirstEmptySquad) == TRUE) {
      return TRUE;
    }
  }

  // should never happen!
  Assert(FALSE);
  return FALSE;
}

// find the first slot we can fit the guy in
function AddCharacterToUniqueSquad(pCharacter: Pointer<SOLDIERTYPE>): INT8 {
  // add character to any squad, if character is assigned to a squad, returns TRUE
  let bCounter: INT8 = 0;

  // check if character on a squad

  // remove them
  RemoveCharacterFromSquads(pCharacter);

  for (bCounter = 0; bCounter < Enum275.NUMBER_OF_SQUADS; bCounter++) {
    if (SquadIsEmpty(bCounter) == TRUE) {
      if (AddCharacterToSquad(pCharacter, bCounter) == TRUE) {
        return bCounter;
      }
    }
  }

  return -1;
}

function SquadIsEmpty(bSquadValue: INT8): BOOLEAN {
  // run through this squad's slots and find if they ALL are empty
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    if (Squad[bSquadValue][iCounter] != null) {
      return FALSE;
    }
  }

  return TRUE;
}

// find and remove characters from any squad
function RemoveCharacterFromSquads(pCharacter: Pointer<SOLDIERTYPE>): BOOLEAN {
  let iCounterA: INT32 = 0;
  let iCounter: INT32 = 0;
  let ubGroupId: UINT8 = 0;
  // find character and remove.. check characters in all squads

  // squad?
  for (iCounterA = 0; iCounterA < Enum275.NUMBER_OF_SQUADS; iCounterA++) {
    // slot?
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      // check if on current squad and current slot?
      if (Squad[iCounterA][iCounter] == pCharacter) {
        // found and nulled
        Squad[iCounterA][iCounter] = null;

        // Release memory for his personal path, BUT DON'T CLEAR HIS GROUP'S PATH/WAYPOINTS (pass in groupID -1).
        // Just because one guy leaves a group is no reason to cancel movement for the rest of the group.
        pCharacter.value.pMercPath = ClearStrategicPathList(pCharacter.value.pMercPath, -1);

        // remove character from mvt group
        RemovePlayerFromGroup(SquadMovementGroups[iCounterA], pCharacter);

        // reset player mvt group id value
        pCharacter.value.ubGroupID = 0;

        if ((pCharacter.value.fBetweenSectors) && (pCharacter.value.uiStatusFlags & SOLDIER_VEHICLE)) {
          ubGroupId = CreateNewPlayerGroupDepartingFromSector((pCharacter.value.sSectorX), (pCharacter.value.sSectorY));

          // assign to a group
          AddPlayerToGroup(ubGroupId, pCharacter);
        }

        RebuildSquad(iCounterA);

        if (pCharacter.value.bLife == 0) {
          AddDeadCharacterToSquadDeadGuys(pCharacter, iCounterA);
        }

        // if we are not loading a saved game
        if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME) && guiCurrentScreen == Enum26.GAME_SCREEN) {
          UpdateCurrentlySelectedMerc(pCharacter, iCounterA);
        }

        return TRUE;
      }
    }
  }

  // not found
  return FALSE;
}

function RemoveCharacterFromASquad(pCharacter: Pointer<SOLDIERTYPE>, bSquadValue: INT8): BOOLEAN {
  let iCounter: INT32 = 0;
  let iCounterA: INT32 = 0;

  // remove character from particular squad..return if successful
  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    // check if on current squad and current slot?
    if (Squad[bSquadValue][iCounter] == pCharacter) {
      UpdateCurrentlySelectedMerc(pCharacter, bSquadValue);

      // found and nulled
      Squad[bSquadValue][iCounter] = null;

      // remove character from mvt group
      RemovePlayerFromGroup(SquadMovementGroups[bSquadValue], pCharacter);

      if (pCharacter.value.bLife == 0) {
        AddDeadCharacterToSquadDeadGuys(pCharacter, iCounterA);
      }

      RebuildSquad(bSquadValue);

      // found
      return TRUE;
    }
  }

  // not found
  return FALSE;
}

function IsCharacterInSquad(pCharacter: Pointer<SOLDIERTYPE>, bSquadValue: INT8): BOOLEAN {
  let iCounter: INT32 = 0;
  // find character in particular squad..return if successful
  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    // check if on current squad and current slot?
    if (Squad[bSquadValue][iCounter] == pCharacter) {
      // found
      return TRUE;
    }
  }

  // not found
  return FALSE;
}

function SlotCharacterIsInSquad(pCharacter: Pointer<SOLDIERTYPE>, bSquadValue: INT8): INT8 {
  let bCounter: INT8 = 0;

  // find character in particular squad..return slot if successful, else -1
  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    // check if on current squad and current slot?
    if (Squad[bSquadValue][bCounter] == pCharacter) {
      // found
      return bCounter;
    }
  }

  // not found
  return -1;
}

function SquadCharacterIsIn(pCharacter: Pointer<SOLDIERTYPE>): INT8 {
  // returns which squad character is in, -1 if none found
  let iCounterA: INT8 = 0;
  let iCounter: INT8 = 0;

  // squad?
  for (iCounterA = 0; iCounterA < Enum275.NUMBER_OF_SQUADS; iCounterA++) {
    // slot?
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      // check if on current squad and current slot?
      if (Squad[iCounterA][iCounter] == pCharacter) {
        // return value
        return iCounterA;
      }
    }
  }

  // return failure
  return -1;
}

function NumberOfPeopleInSquad(bSquadValue: INT8): INT8 {
  let bCounter: INT8 = 0;
  let bSquadCount: INT8 = 0;

  if (bSquadValue == NO_CURRENT_SQUAD) {
    return 0;
  }

  // find number of characters in particular squad.
  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    // valid slot?
    if (Squad[bSquadValue][bCounter] != null) {
      // yep
      bSquadCount++;
    }
  }

  // return number found
  return bSquadCount;
}

function NumberOfNonEPCsInSquad(bSquadValue: INT8): INT8 {
  let bCounter: INT8 = 0;
  let bSquadCount: INT8 = 0;

  if (bSquadValue == NO_CURRENT_SQUAD) {
    return 0;
  }

  // find number of characters in particular squad.
  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    // valid slot?
    if (Squad[bSquadValue][bCounter] != null && !AM_AN_EPC(Squad[bSquadValue][bCounter])) {
      // yep
      bSquadCount++;
    }
  }

  // return number found
  return bSquadCount;
}

function IsRobotControllerInSquad(bSquadValue: INT8): BOOLEAN {
  let bCounter: INT8 = 0;

  if (bSquadValue == NO_CURRENT_SQUAD) {
    return 0;
  }

  // find number of characters in particular squad.
  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    // valid slot?
    if ((Squad[bSquadValue][bCounter] != null) && ControllingRobot(Squad[bSquadValue][bCounter])) {
      // yep
      return TRUE;
    }
  }

  // return number found
  return FALSE;
}

function SectorSquadIsIn(bSquadValue: INT8, sMapX: Pointer<INT16>, sMapY: Pointer<INT16>, sMapZ: Pointer<INT16>): BOOLEAN {
  // returns if there is anyone on the squad and what sector ( strategic ) they are in
  let bCounter: INT8 = 0;

  Assert(bSquadValue < Enum117.ON_DUTY);

  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    // if valid soldier, get current sector and return
    if (Squad[bSquadValue][bCounter] != null) {
      sMapX.value = Squad[bSquadValue][bCounter].value.sSectorX;
      sMapY.value = Squad[bSquadValue][bCounter].value.sSectorY;
      sMapZ.value = Squad[bSquadValue][bCounter].value.bSectorZ;

      return TRUE;
    }
  }

  // return there is no squad
  return FALSE;
}

function CopyPathOfSquadToCharacter(pCharacter: Pointer<SOLDIERTYPE>, bSquadValue: INT8): BOOLEAN {
  // copy path from squad to character
  let bCounter: INT8 = 0;

  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    if ((Squad[bSquadValue][bCounter] != pCharacter) && (Squad[bSquadValue][bCounter] != null)) {
      // valid character, copy paths
      pCharacter.value.pMercPath = CopyPaths(Squad[bSquadValue][bCounter].value.pMercPath, pCharacter.value.pMercPath);

      // return success
      return TRUE;
    }
  }

  // return failure
  return FALSE;
}

function CopyPathOfCharacterToSquad(pCharacter: Pointer<SOLDIERTYPE>, bSquadValue: INT8): BOOLEAN {
  // copy path of this character to members of squad
  let fSuccess: BOOLEAN = FALSE;
  let bCounter: INT8 = 0;

  // anyone else on squad?
  if (NumberOfPeopleInSquad(bSquadValue) < 2) {
    // nope

    // return failure
    return FALSE;
  }

  // copy each person on squad, skip this character
  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    if ((Squad[bSquadValue][bCounter] != pCharacter) && (Squad[bSquadValue][bCounter] != null)) {
      // valid character, copy paths

      // first empty path
      Squad[bSquadValue][bCounter].value.pMercPath = ClearStrategicPathList(Squad[bSquadValue][bCounter].value.pMercPath, -1);

      // then copy
      Squad[bSquadValue][bCounter].value.pMercPath = CopyPaths(pCharacter.value.pMercPath, Squad[bSquadValue][bCounter].value.pMercPath);

      // successful at least once
      fSuccess = TRUE;
    }
  }

  // return success?
  return fSuccess;
}

function CurrentSquad(): INT32 {
  // returns which squad is current squad

  return iCurrentTacticalSquad;
}

function SetCurrentSquad(iCurrentSquad: INT32, fForce: BOOLEAN): BOOLEAN {
  // set the current tactical squad
  let iCounter: INT32 = 0;

  // ARM: can't call SetCurrentSquad() in mapscreen, it calls SelectSoldier(), that will initialize interface panels!!!
  // ATE: Adjusted conditions a bit ( sometimes were not getting selected )
  if (guiCurrentScreen == Enum26.LAPTOP_SCREEN || guiCurrentScreen == Enum26.MAP_SCREEN) {
    return FALSE;
  }

  // ATE; Added to allow us to have NO current squad
  if (iCurrentSquad == NO_CURRENT_SQUAD) {
    // set current squad and return success
    iCurrentTacticalSquad = iCurrentSquad;

    // cleat list
    RemoveAllPlayersFromSlot();

    // set all auto faces inactive
    SetAllAutoFacesInactive();

    return FALSE;
  }

  // check if valid value passed
  if ((iCurrentSquad >= Enum275.NUMBER_OF_SQUADS) || (iCurrentSquad < 0)) {
    // no
    return FALSE;
  }

  // check if squad is current
  if (iCurrentSquad == iCurrentTacticalSquad && !fForce) {
    return TRUE;
  }

  // set current squad and return success
  iCurrentTacticalSquad = iCurrentSquad;

  // cleat list
  RemoveAllPlayersFromSlot();

  // set all auto faces inactive
  SetAllAutoFacesInactive();

  if (iCurrentTacticalSquad != NO_CURRENT_SQUAD) {
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (Squad[iCurrentTacticalSquad][iCounter] != null) {
        // squad set, now add soldiers in
        CheckForAndAddMercToTeamPanel(Squad[iCurrentTacticalSquad][iCounter]);
      }
    }
  }

  // check if the currently selected guy is on this squad, if not, get the first one on the new squad
  if (gusSelectedSoldier != NO_SOLDIER) {
    if (Menptr[gusSelectedSoldier].bAssignment != iCurrentTacticalSquad) {
      // ATE: Changed this to FALSE for ackoledgement sounds.. sounds bad if just starting/entering sector..
      SelectSoldier(Squad[iCurrentTacticalSquad][0].value.ubID, FALSE, TRUE);
    }
  } else {
    // ATE: Changed this to FALSE for ackoledgement sounds.. sounds bad if just starting/entering sector..
    SelectSoldier(Squad[iCurrentTacticalSquad][0].value.ubID, FALSE, TRUE);
  }

  return TRUE;
}

function RebuildCurrentSquad(): void {
  // rebuilds current squad to reset faces in tactical
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let pDeadSoldier: Pointer<SOLDIERTYPE> = null;

  // check if valid value passed
  if ((iCurrentTacticalSquad >= Enum275.NUMBER_OF_SQUADS) || (iCurrentTacticalSquad < 0)) {
    // no
    return;
  }

  // set default squad..just inc ase we no longer have a valid squad
  SetDefaultSquadOnSectorEntry(TRUE);

  // cleat list
  RemoveAllPlayersFromSlot();

  // set all auto faces inactive
  SetAllAutoFacesInactive();

  gfPausedTacticalRenderInterfaceFlags = DIRTYLEVEL2;

  if (iCurrentTacticalSquad != NO_CURRENT_SQUAD) {
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (Squad[iCurrentTacticalSquad][iCounter] != null) {
        // squad set, now add soldiers in
        CheckForAndAddMercToTeamPanel(Squad[iCurrentTacticalSquad][iCounter]);
      }
    }

    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (sDeadMercs[iCurrentTacticalSquad][iCounter] != -1) {
        pDeadSoldier = FindSoldierByProfileID((sDeadMercs[iCurrentTacticalSquad][iCounter]), TRUE);

        if (pDeadSoldier) {
          // squad set, now add soldiers in
          CheckForAndAddMercToTeamPanel(pDeadSoldier);
        }
      }
    }
  }
}

function ExamineCurrentSquadLights(): void {
  // rebuilds current squad to reset faces in tactical
  let iCounter: INT32 = 0;
  let ubLoop: UINT8;

  // OK, we should add lights for any guy currently bInSector who is not bad OKLIFE...
  ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++) {
    if (MercPtrs[ubLoop].value.bInSector && MercPtrs[ubLoop].value.bLife >= OKLIFE) {
      PositionSoldierLight(MercPtrs[ubLoop]);
    }
  }

  // check if valid value passed
  // if( ( iCurrentTacticalSquad >= NUMBER_OF_SQUADS ) || ( iCurrentTacticalSquad < 0 ) )
  //{
  // no
  //	return;
  //}

  // for( iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++ )
  //{
  //	if(  Squad[ iCurrentTacticalSquad ][ iCounter ] != NULL )
  //	{
  //		PositionSoldierLight( Squad[ iCurrentTacticalSquad ][ iCounter ] );
  //	}
  //}
}

function GetSoldiersInSquad(iCurrentSquad: INT32, pSoldierArray: Pointer<SOLDIERTYPE>[] /* [] */): BOOLEAN {
  let iCounter: INT32 = 0;
  // will get the soldiertype pts for every merc in this squad

  // check if valid value passed
  if ((iCurrentSquad >= Enum275.NUMBER_OF_SQUADS) || (iCurrentSquad < 0)) {
    // no
    return FALSE;
  }

  // copy pts values over
  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    pSoldierArray[iCounter] = Squad[iCurrentSquad][iCounter];
  }

  return TRUE;
}

function IsSquadOnCurrentTacticalMap(iCurrentSquad: INT32): BOOLEAN {
  let iCounter: INT32 = 0;
  // check to see if this squad is on the current map

  // check if valid value passed
  if ((iCurrentSquad >= Enum275.NUMBER_OF_SQUADS) || (iCurrentSquad < 0)) {
    // no
    return FALSE;
  }

  // go through memebrs of squad...if anyone on this map, return true
  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    if (Squad[iCurrentSquad][iCounter] != null) {
      // ATE; Added more checks here for being in sector ( fBetweenSectors and SectorZ )
      if ((Squad[iCurrentSquad][iCounter].value.sSectorX == gWorldSectorX) && (Squad[iCurrentSquad][iCounter].value.sSectorY == gWorldSectorY) && Squad[iCurrentSquad][iCounter].value.bSectorZ == gbWorldSectorZ && Squad[iCurrentSquad][iCounter].value.fBetweenSectors != TRUE) {
        return TRUE;
      }
    }
  }

  return FALSE;
}

function SetDefaultSquadOnSectorEntry(fForce: BOOLEAN): void {
  let iCounter: INT32 = 0;
  // check if selected squad is in current sector, if so, do nothing, if not...first first case that they are

  if (IsSquadOnCurrentTacticalMap(iCurrentTacticalSquad) == TRUE) {
    // is in sector, leave
    return;
  }

  // otherwise...

  // find first squad availiable
  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    if (IsSquadOnCurrentTacticalMap(iCounter) == TRUE) {
      // squad in sector...set as current
      SetCurrentSquad(iCounter, fForce);

      return;
    }
  }

  // If here, set to no current squad
  SetCurrentSquad(NO_CURRENT_SQUAD, FALSE);

  return;
}

function GetLastSquadActive(): INT32 {
  // find id of last squad in the list with active mercs in it
  let iCounter: INT32 = 0;
  let iCounterB: INT32 = 0;
  let iLastSquad: INT32 = 0;

  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    for (iCounterB = 0; iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounterB++) {
      if (Squad[iCounter][iCounterB] != null) {
        iLastSquad = iCounter;
      }
    }
  }

  return iLastSquad;
}

function GetSquadPosition(ubNextX: Pointer<UINT8>, ubNextY: Pointer<UINT8>, ubPrevX: Pointer<UINT8>, ubPrevY: Pointer<UINT8>, uiTraverseTime: Pointer<UINT32>, uiArriveTime: Pointer<UINT32>, ubSquadValue: UINT8): void {
  // grab the mvt group for this squad and find all this information

  if (SquadMovementGroups[ubSquadValue] == 0) {
    ubNextX.value = 0;
    ubNextY.value = 0;
    ubPrevX.value = 0;
    ubPrevY.value = 0;
    uiTraverseTime.value = 0;
    uiArriveTime.value = 0;
    return;
  }

  // grab this squads mvt position
  GetGroupPosition(ubNextX, ubNextY, ubPrevX, ubPrevY, uiTraverseTime, uiArriveTime, SquadMovementGroups[ubSquadValue]);

  return;
}

function SetSquadPositionBetweenSectors(ubNextX: UINT8, ubNextY: UINT8, ubPrevX: UINT8, ubPrevY: UINT8, uiTraverseTime: UINT32, uiArriveTime: UINT32, ubSquadValue: UINT8): void {
  // set mvt group position for squad for

  if (SquadMovementGroups[ubSquadValue] == 0) {
    return;
  }
  SetGroupPosition(ubNextX, ubNextY, ubPrevX, ubPrevY, uiTraverseTime, uiArriveTime, SquadMovementGroups[ubSquadValue]);

  return;
}

function SaveSquadInfoToSavedGameFile(hFile: HWFILE): BOOLEAN {
  let sSquadSaveStruct: SAVE_SQUAD_INFO_STRUCT[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */;
  let uiNumBytesWritten: UINT32 = 0;
  let uiSaveSize: UINT32 = 0;
  // Reset the current squad info
  let iCounterB: INT32 = 0;
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    for (iCounterB = 0; iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounterB++) {
      if (Squad[iCounter][iCounterB])
        sSquadSaveStruct[iCounter][iCounterB].uiID = Squad[iCounter][iCounterB].value.ubID;
      else
        sSquadSaveStruct[iCounter][iCounterB].uiID = -1;
    }
  }

  // Save the squad info to the Saved Game File
  uiSaveSize = sizeof(SAVE_SQUAD_INFO_STRUCT) * Enum275.NUMBER_OF_SQUADS * NUMBER_OF_SOLDIERS_PER_SQUAD;

  FileWrite(hFile, sSquadSaveStruct, uiSaveSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiSaveSize) {
    return FALSE;
  }

  // Save all the squad movement id's
  FileWrite(hFile, SquadMovementGroups, sizeof(INT8) * Enum275.NUMBER_OF_SQUADS, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(INT8) * Enum275.NUMBER_OF_SQUADS) {
    return FALSE;
  }

  return TRUE;
}

function LoadSquadInfoFromSavedGameFile(hFile: HWFILE): BOOLEAN {
  let sSquadSaveStruct: SAVE_SQUAD_INFO_STRUCT[][] /* [NUMBER_OF_SQUADS][NUMBER_OF_SOLDIERS_PER_SQUAD] */;
  let uiNumBytesRead: UINT32 = 0;
  let uiSaveSize: UINT32 = 0;

  // Reset the current squad info
  let iCounterB: INT32 = 0;
  let iCounter: INT32 = 0;

  // null each list of ptrs.
  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    for (iCounterB = 0; iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounterB++) {
      // squad, soldier
      Squad[iCounter][iCounterB] = null;
    }
  }

  // Load in the squad info
  uiSaveSize = sizeof(SAVE_SQUAD_INFO_STRUCT) * Enum275.NUMBER_OF_SQUADS * NUMBER_OF_SOLDIERS_PER_SQUAD;

  FileRead(hFile, sSquadSaveStruct, uiSaveSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiSaveSize) {
    return FALSE;
  }

  // Loop through the array loaded in
  for (iCounter = 0; iCounter < Enum275.NUMBER_OF_SQUADS; iCounter++) {
    for (iCounterB = 0; iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounterB++) {
      if (sSquadSaveStruct[iCounter][iCounterB].uiID != -1)
        Squad[iCounter][iCounterB] = addressof(Menptr[sSquadSaveStruct[iCounter][iCounterB].uiID]);
      else
        Squad[iCounter][iCounterB] = null;
    }
  }

  // Load in the Squad movement id's
  FileRead(hFile, SquadMovementGroups, sizeof(INT8) * Enum275.NUMBER_OF_SQUADS, addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(INT8) * Enum275.NUMBER_OF_SQUADS) {
    return FALSE;
  }

  return TRUE;
}

function GetLocationOfSquad(sX: Pointer<INT16>, sY: Pointer<INT16>, bZ: Pointer<INT8>, bSquadValue: INT8): void {
  // run through list of guys, once valid merc found, get his sector x and y and z
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    if (Squad[bSquadValue][iCounter]) {
      // valid guy
      sX.value = Squad[bSquadValue][iCounter].value.sSectorX;
      sY.value = Squad[bSquadValue][iCounter].value.sSectorY;
      bZ.value = Squad[bSquadValue][iCounter].value.bSectorZ;
    }
  }

  return;
}

function IsThisSquadOnTheMove(bSquadValue: INT8): BOOLEAN {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    if (Squad[bSquadValue][iCounter]) {
      return Squad[bSquadValue][iCounter].value.fBetweenSectors;
    }
  }

  return FALSE;
}

// rebuild this squad after someone has been removed, to 'squeeze' together any empty spots
function RebuildSquad(bSquadValue: INT8): void {
  let iCounter: INT32 = 0;
  let iCounterB: INT32 = 0;

  for (iCounterB = 0; iCounterB < NUMBER_OF_SOLDIERS_PER_SQUAD - 1; iCounterB++) {
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD - 1; iCounter++) {
      if (Squad[bSquadValue][iCounter] == null) {
        if (Squad[bSquadValue][iCounter + 1] != null) {
          Squad[bSquadValue][iCounter] = Squad[bSquadValue][iCounter + 1];
          Squad[bSquadValue][iCounter + 1] = null;
        }
      }
    }
  }

  return;
}

function UpdateCurrentlySelectedMerc(pSoldier: Pointer<SOLDIERTYPE>, bSquadValue: INT8): void {
  let ubID: UINT8;

  // if this squad is the current one and and the psoldier is the currently selected soldier, get rid of 'em
  if (bSquadValue != iCurrentTacticalSquad) {
    return;
  }

  // Are we the selected guy?
  if (gusSelectedSoldier == pSoldier.value.ubID) {
    ubID = FindNextActiveAndAliveMerc(pSoldier, FALSE, FALSE);

    if (ubID != NOBODY && ubID != gusSelectedSoldier) {
      SelectSoldier(ubID, FALSE, FALSE);
    } else {
      gusSelectedSoldier = NOBODY;

      // ATE: Make sure we are in TEAM panel at this point!
      SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
    }
  }

  return;
}

function IsSquadInSector(pSoldier: Pointer<SOLDIERTYPE>, ubSquad: UINT8): BOOLEAN {
  if (pSoldier == null) {
    return FALSE;
  }

  if (pSoldier.value.fBetweenSectors == TRUE) {
    return FALSE;
  }

  if (pSoldier.value.bAssignment == Enum117.IN_TRANSIT) {
    return FALSE;
  }

  if (pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
    return FALSE;
  }

  if (SquadIsEmpty(ubSquad) == TRUE) {
    return TRUE;
  }

  if ((pSoldier.value.sSectorX != Squad[ubSquad][0].value.sSectorX) || (pSoldier.value.sSectorY != Squad[ubSquad][0].value.sSectorY) || (pSoldier.value.bSectorZ != Squad[ubSquad][0].value.bSectorZ)) {
    return FALSE;
  }

  if (Squad[ubSquad][0].value.fBetweenSectors == TRUE) {
    return FALSE;
  }

  return TRUE;
}

function IsAnyMercOnSquadAsleep(ubSquadValue: UINT8): BOOLEAN {
  let iCounter: INT32 = 0;

  if (SquadIsEmpty(ubSquadValue) == TRUE) {
    return FALSE;
  }

  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD - 1; iCounter++) {
    if (Squad[ubSquadValue][iCounter] != null) {
      if (Squad[ubSquadValue][iCounter].value.fMercAsleep) {
        return TRUE;
      }
    }
  }

  return FALSE;
}

function AddDeadCharacterToSquadDeadGuys(pSoldier: Pointer<SOLDIERTYPE>, iSquadValue: INT32): BOOLEAN {
  let iCounter: INT32 = 0;
  let pTempSoldier: Pointer<SOLDIERTYPE> = null;

  // is dead guy in any squad
  if (IsDeadGuyOnAnySquad(pSoldier) == TRUE) {
    return TRUE;
  }

  // first find out if the guy is in the list
  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    // valid soldier?
    if (sDeadMercs[iSquadValue][iCounter] != -1) {
      pTempSoldier = FindSoldierByProfileID((sDeadMercs[iSquadValue][iCounter]), TRUE);

      if (pSoldier == pTempSoldier) {
        return TRUE;
      }
    }
  }

  // now insert the guy
  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    // valid soldier?
    if (sDeadMercs[iSquadValue][iCounter] != -1) {
      // yep
      pTempSoldier = FindSoldierByProfileID((sDeadMercs[iSquadValue][iCounter]), TRUE);

      // valid soldier?
      if (pTempSoldier == null) {
        // nope
        sDeadMercs[iSquadValue][iCounter] = pSoldier.value.ubProfile;
        return TRUE;
      }
    } else {
      // nope
      sDeadMercs[iSquadValue][iCounter] = pSoldier.value.ubProfile;
      return TRUE;
    }
  }

  // no go
  return FALSE;
}

function IsDeadGuyOnAnySquad(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let iCounterA: INT32 = 0;
  let iCounter: INT32 = 0;

  // squad?
  for (iCounterA = 0; iCounterA < Enum275.NUMBER_OF_SQUADS; iCounterA++) {
    // slot?
    for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
      if (sDeadMercs[iCounterA][iCounter] == pSoldier.value.ubProfile) {
        return TRUE;
      }
    }
  }

  return FALSE;
}

function IsDeadGuyInThisSquadSlot(bSlotId: INT8, bSquadValue: INT8, bNumberOfDeadGuysSoFar: Pointer<INT8>): BOOLEAN {
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  // see if we have gone too far?
  if (bSlotId < bNumberOfDeadGuysSoFar.value) {
    // reset
    bNumberOfDeadGuysSoFar.value = 0;
  }

  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    if (sDeadMercs[bSquadValue][iCounter] != -1) {
      // not gone far enough yet
      if (bNumberOfDeadGuysSoFar.value > iCounter) {
        iCount++;
      } else {
        // far enough, start checking
        bNumberOfDeadGuysSoFar++;

        return TRUE;
      }
    }
  }

  return FALSE;
}

function SoldierIsDeadAndWasOnSquad(pSoldier: Pointer<SOLDIERTYPE>, bSquadValue: INT8): BOOLEAN {
  let iCounter: INT32 = 0;

  if (bSquadValue == NO_CURRENT_SQUAD) {
    return FALSE;
  }

  // check if guy is on squad
  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    if (pSoldier.value.ubProfile == sDeadMercs[bSquadValue][iCounter]) {
      return TRUE;
    }
  }

  return FALSE;
}

function ResetDeadSquadMemberList(iSquadValue: INT32): BOOLEAN {
  memset(sDeadMercs[iSquadValue], -1, sizeof(INT16) * NUMBER_OF_SOLDIERS_PER_SQUAD);

  return TRUE;
}

// this passed  soldier on the current squad int he tactical map
function IsMercOnCurrentSquad(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let iCounter: INT32 = 0;

  // valid soldier?
  if (pSoldier == null) {
    // no
    return FALSE;
  }

  // active grunt?
  if (pSoldier.value.bActive == FALSE) {
    // no
    return FALSE;
  }

  // current squad valid?
  if (iCurrentTacticalSquad >= Enum275.NUMBER_OF_SQUADS) {
    // no
    return FALSE;
  }

  for (iCounter = 0; iCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; iCounter++) {
    if (Squad[iCurrentTacticalSquad][iCounter] == pSoldier) {
      // found him
      return TRUE;
    }
  }

  return FALSE;
}

function NumberOfPlayerControllableMercsInSquad(bSquadValue: INT8): INT8 {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bCounter: INT8 = 0;
  let bSquadCount: INT8 = 0;

  if (bSquadValue == NO_CURRENT_SQUAD) {
    return 0;
  }

  // find number of characters in particular squad.
  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    // valid slot?
    if (Squad[bSquadValue][bCounter] != null) {
      // yep
      pSoldier = Squad[bSquadValue][bCounter];

      // Kris:  This breaks the CLIENT of this function, tactical traversal.  Do NOT check for EPCS or ROBOT here.
      // if ( !AM_AN_EPC( pSoldier ) && !AM_A_ROBOT( pSoldier ) &&
      if (!(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
        bSquadCount++;
      }
    }
  }

  // return number found
  return bSquadCount;
}

function DoesVehicleExistInSquad(bSquadValue: INT8): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bCounter: INT8 = 0;
  let bSquadCount: INT8 = 0;

  if (bSquadValue == NO_CURRENT_SQUAD) {
    return FALSE;
  }

  // find number of characters in particular squad.
  for (bCounter = 0; bCounter < NUMBER_OF_SOLDIERS_PER_SQUAD; bCounter++) {
    // valid slot?
    if (Squad[bSquadValue][bCounter] != null) {
      // yep
      pSoldier = Squad[bSquadValue][bCounter];

      // If we are an EPC or ROBOT, don't allow this
      if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
        return TRUE;
      }
    }
  }

  return FALSE;
}

function CheckSquadMovementGroups(): void {
  let iSquad: INT32;
  let pGroup: Pointer<GROUP>;

  for (iSquad = 0; iSquad < Enum275.NUMBER_OF_SQUADS; iSquad++) {
    pGroup = GetGroup(SquadMovementGroups[iSquad]);
    if (pGroup == null) {
      // recreate group
      SquadMovementGroups[iSquad] = CreateNewPlayerGroupDepartingFromSector(1, 1);

      // Set persistent....
      pGroup = GetGroup(SquadMovementGroups[iSquad]);
      Assert(pGroup);
      pGroup.value.fPersistant = TRUE;
    }
  }
}
