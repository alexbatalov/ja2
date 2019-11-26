namespace ja2 {

export let gubVehicleMovementGroups: INT8[] /* [MAX_VEHICLES] */ = createArray(MAX_VEHICLES, 0);

// the list of vehicles
export let pVehicleList: VEHICLETYPE[] /* Pointer<VEHICLETYPE> */ = <VEHICLETYPE[]><unknown>null;

// number of vehicle slots on the list
export let ubNumberOfVehicles: UINT8 = 0;

// ATE: These arrays below should all be in a large LUT which contains
// static info for each vehicle....

// the mvt groups associated with vehcile types
let iMvtTypes: INT32[] /* [] */ = [
  CAR, // eldorado
  CAR, // hummer
  CAR, // ice cream truck
  CAR, // jeep
  CAR, // tank

  AIR, // helicopter
];

export let iSeatingCapacities: INT32[] /* [] */ = [
  6, // eldorado
  6, // hummer
  6, // ice cream truck
  6, // jeep
  6, // tank
  6, // helicopter
];

let iEnterVehicleSndID: INT32[] /* [] */ = [
  Enum330.S_VECH1_INTO,
  Enum330.S_VECH1_INTO,
  Enum330.S_VECH1_INTO,
  Enum330.S_VECH1_INTO,
  Enum330.S_VECH1_INTO,
  Enum330.S_VECH1_INTO,
];

let iMoveVehicleSndID: INT32[] /* [] */ = [
  Enum330.S_VECH1_MOVE,
  Enum330.S_VECH1_MOVE,
  Enum330.S_VECH1_MOVE,
  Enum330.S_VECH1_MOVE,
  Enum330.S_VECH1_MOVE,
  Enum330.S_VECH1_MOVE,
];

let ubVehicleTypeProfileID: UINT8[] /* [] */ = [
  Enum268.PROF_ELDERODO,
  Enum268.PROF_HUMMER,
  Enum268.PROF_ICECREAM,
  Enum268.NPC164,
  Enum268.NPC164,
  Enum268.PROF_HELICOPTER,
];

/*
// location of crits based on facing
INT8 bInternalCritHitsByLocation[ NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE ][ NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE ]={
        { ENGINE_HIT_LOCATION, ENGINE_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION,CREW_COMPARTMENT_HIT_LOCATION, RF_TIRE_HIT_LOCATION, LF_TIRE_HIT_LOCATION }, // front
        { ENGINE_HIT_LOCATION, LF_TIRE_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION, LR_TIRE_HIT_LOCATION, GAS_TANK_HIT_LOCATION}, // left side
        { ENGINE_HIT_LOCATION, RF_TIRE_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION, RR_TIRE_HIT_LOCATION, GAS_TANK_HIT_LOCATION}, // right side
        { CREW_COMPARTMENT_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION, RR_TIRE_HIT_LOCATION, LR_TIRE_HIT_LOCATION, GAS_TANK_HIT_LOCATION }, // rear
        { ENGINE_HIT_LOCATION, RF_TIRE_HIT_LOCATION, LF_TIRE_HIT_LOCATION, RR_TIRE_HIT_LOCATION,LR_TIRE_HIT_LOCATION, GAS_TANK_HIT_LOCATION,}, // bottom side
        { ENGINE_HIT_LOCATION, ENGINE_HIT_LOCATION, ENGINE_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION, CREW_COMPARTMENT_HIT_LOCATION, GAS_TANK_HIT_LOCATION }, // top
};
*/

// original armor values for vehicles
/*
        ELDORADO_CAR = 0,
        HUMMER,
        ICE_CREAM_TRUCK,
        JEEP_CAR,
        TANK_CAR,
        HELICOPTER,
*/

let sVehicleArmourType: INT16[] /* [NUMBER_OF_TYPES_OF_VEHICLES] */ = [
  Enum225.KEVLAR_VEST, // El Dorado
  Enum225.SPECTRA_VEST, // Hummer
  Enum225.KEVLAR_VEST, // Ice cream truck
  Enum225.KEVLAR_VEST, // Jeep
  Enum225.SPECTRA_VEST, // Tank - do we want this?
  Enum225.KEVLAR_VEST, // Helicopter
];

/*
INT16 sVehicleExternalOrigArmorValues[ NUMBER_OF_TYPES_OF_VEHICLES ][ NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE ]={
        { 100,100,100,100,100,100 }, // helicopter
        { 500,500,500,500,500,500 }, // hummer
};
*/

/*
// external armor values
INT16 sVehicleInternalOrigArmorValues[ NUMBER_OF_TYPES_OF_VEHICLES ][ NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE ]={
        { 250,250,250,250,250,250 }, // eldorado
        { 250,250,250,250,250,250 }, // hummer
        { 250,250,250,250,250,250 }, // ice cream
        { 250,250,250,250,250,250 }, // feep
        { 850,850,850,850,850,850 }, // tank
        { 50,50,50,50,50,50 }, // helicopter
};
*/

// ap cost per crit
const COST_PER_ENGINE_CRIT = 15;
const COST_PER_TIRE_HIT = 5;
//#define VEHICLE_MAX_INTERNAL 250

// void RemoveSoldierFromVehicleBetweenSectors( pSoldier, iId );

// Loop through and create a few soldier squad ID's for vehicles ( max # 3 )
export function InitVehicles(): void {
  let cnt: INT32;
  let pGroup: GROUP;

  for (cnt = 0; cnt < MAX_VEHICLES; cnt++) {
    // create mvt groups
    gubVehicleMovementGroups[cnt] = CreateNewVehicleGroupDepartingFromSector(1, 1, cnt);

    // Set persistent....
    pGroup = GetGroup(gubVehicleMovementGroups[cnt]);
    pGroup.fPersistant = true;
  }
}

export function SetVehicleValuesIntoSoldierType(pVehicle: SOLDIERTYPE): void {
  pVehicle.name = zVehicleName[pVehicleList[pVehicle.bVehicleID].ubVehicleType];

  pVehicle.ubProfile = pVehicleList[pVehicle.bVehicleID].ubProfileID;

  // Init fuel!
  pVehicle.sBreathRed = 10000;
  pVehicle.bBreath = 100;

  pVehicle.ubWhatKindOfMercAmI = Enum260.MERC_TYPE__VEHICLE;
}

export function AddVehicleToList(sMapX: INT16, sMapY: INT16, sGridNo: INT16, ubType: UINT8): INT32 {
  // insert this vehicle into the list
  // how many vehicles are there?
  let iVehicleIdValue: INT32 = -1;
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;
  let pTempList: Pointer<VEHICLETYPE> = null;
  let fFoundEmpty: boolean = false;
  let pGroup: Pointer<GROUP>;

  if (pVehicleList != null) {
    // not the first, add to list
    for (iCounter = 0; iCounter < ubNumberOfVehicles; iCounter++) {
      // might have an empty slot
      if (pVehicleList[iCounter].fValid == false) {
        iCount = iCounter;
        iCounter = ubNumberOfVehicles;
        fFoundEmpty = true;
        iVehicleIdValue = iCount;
      }
    }
  }

  if (fFoundEmpty == false) {
    iCount = ubNumberOfVehicles;
  }

  if (iCount == 0) {
    pVehicleList = MemAlloc(sizeof(VEHICLETYPE));

    // Set!
    memset(pVehicleList, 0, sizeof(VEHICLETYPE));

    ubNumberOfVehicles = 1;
    iVehicleIdValue = 0;
  }

  if ((iVehicleIdValue == -1) && (iCount != 0) && (fFoundEmpty == false)) {
    // no empty slot found, need to realloc
    pTempList = MemAlloc(sizeof(VEHICLETYPE) * ubNumberOfVehicles);

    // copy to temp
    memcpy(pTempList, pVehicleList, sizeof(VEHICLETYPE) * ubNumberOfVehicles);

    // now realloc
    pVehicleList = MemRealloc(pVehicleList, (sizeof(VEHICLETYPE) * (ubNumberOfVehicles + 1)));

    // memset the stuff
    memset(pVehicleList, 0, (sizeof(VEHICLETYPE) * (ubNumberOfVehicles + 1)));

    // now copy the stuff back
    memcpy(pVehicleList, pTempList, sizeof(VEHICLETYPE) * (ubNumberOfVehicles));

    // now get rid of crap
    MemFree(pTempList);

    // now get the index value
    iVehicleIdValue = ubNumberOfVehicles;

    ubNumberOfVehicles++;
  }

  // found a slot
  pVehicleList[iCount].ubMovementGroup = 0;
  pVehicleList[iCount].sSectorX = sMapX;
  pVehicleList[iCount].sSectorY = sMapY;
  pVehicleList[iCount].sSectorZ = 0;
  pVehicleList[iCount].sGridNo = sGridNo;
  memset(pVehicleList[iCount].pPassengers, 0, 10 * sizeof(SOLDIERTYPE /* Pointer<SOLDIERTYPE> */));
  pVehicleList[iCount].fValid = true;
  pVehicleList[iCount].ubVehicleType = ubType;
  pVehicleList[iCount].pMercPath = null;
  pVehicleList[iCount].fFunctional = true;
  pVehicleList[iCount].fDestroyed = false;
  pVehicleList[iCount].iMoveSound = iMoveVehicleSndID[ubType];
  pVehicleList[iCount].iOutOfSound = iEnterVehicleSndID[ubType];
  pVehicleList[iCount].ubProfileID = ubVehicleTypeProfileID[ubType];
  pVehicleList[iCount].ubMovementGroup = gubVehicleMovementGroups[iCount];

  // ATE: Add movement mask to group...
  pGroup = GetGroup(pVehicleList[iCount].ubMovementGroup);

  if (!pGroup) {
    if (gfEditMode) {
      // This is okay, no groups exist, so simply return.
      return iVehicleIdValue;
    }
    Assert(0);
  }

  pGroup.value.ubTransportationMask = iMvtTypes[ubType];

  // ARM: setup group movement defaults
  pGroup.value.ubSectorX = sMapX;
  pGroup.value.ubNextX = sMapX;
  pGroup.value.ubSectorY = sMapY;
  pGroup.value.ubNextY = sMapY;
  pGroup.value.uiTraverseTime = 0;
  pGroup.value.uiArrivalTime = 0;

  SetUpArmorForVehicle(iCount);

  return iVehicleIdValue;
}

export function RemoveVehicleFromList(iId: INT32): boolean {
  // remove this vehicle from the list

  // error check
  if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
    return false;
  }

  // clear remaining path nodes
  if (pVehicleList[iId].pMercPath != null) {
    pVehicleList[iId].pMercPath = ClearStrategicPathList(pVehicleList[iId].pMercPath, 0);
  }

  // zero out mem
  memset(addressof(pVehicleList[iId]), 0, sizeof(VEHICLETYPE));

  return true;
}

export function ClearOutVehicleList(): void {
  let iCounter: INT32;

  // empty out the vehicle list
  if (pVehicleList) {
    for (iCounter = 0; iCounter < ubNumberOfVehicles; iCounter++) {
      // if there is a valid vehicle
      if (pVehicleList[iCounter].fValid) {
        // if the vehicle has a valid path
        if (pVehicleList[iCounter].pMercPath) {
          // toast the vehicle path
          pVehicleList[iCounter].pMercPath = ClearStrategicPathList(pVehicleList[iCounter].pMercPath, 0);
        }
      }
    }

    MemFree(pVehicleList);
    pVehicleList = null;
    ubNumberOfVehicles = 0;
  }

  /*
          // empty out the vehicle list
          if( pVehicleList )
          {
                  MemFree( pVehicleList );
                  pVehicleList = NULL;
                  ubNumberOfVehicles = 0;
          }
  */
}

export function IsThisVehicleAccessibleToSoldier(pSoldier: SOLDIERTYPE, iId: INT32): boolean {
  if (pSoldier == null) {
    return false;
  }

  if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
    return false;
  }

  // now check if vehicle is valid
  if (pVehicleList[iId].fValid == false) {
    return false;
  }

  // if the soldier or the vehicle is between sectors
  if (pSoldier.fBetweenSectors || pVehicleList[iId].fBetweenSectors) {
    return false;
  }

  // any sector values off?
  if ((pSoldier.sSectorX != pVehicleList[iId].sSectorX) || (pSoldier.sSectorY != pVehicleList[iId].sSectorY) || (pSoldier.bSectorZ != pVehicleList[iId].sSectorZ)) {
    return false;
  }

  // if vehicle is not ok to use then return false
  if (!OKUseVehicle(pVehicleList[iId].ubProfileID)) {
    return false;
  }

  return true;
}

function AddSoldierToVehicle(pSoldier: SOLDIERTYPE, iId: INT32): boolean {
  let iCounter: INT32 = 0;
  let pVehicleSoldier: SOLDIERTYPE;

  // Add Soldierto Vehicle
  if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
    return false;
  }

  // ok now check if any free slots in the vehicle

  // now check if vehicle is valid
  if (pVehicleList[iId].fValid == false) {
    return false;
  }

  // get the vehicle soldiertype
  pVehicleSoldier = GetSoldierStructureForVehicle(iId);

  if (pVehicleSoldier) {
    if (pVehicleSoldier.bTeam != gbPlayerNum) {
      // Change sides...
      pVehicleSoldier = ChangeSoldierTeam(pVehicleSoldier, gbPlayerNum);
      // add it to mapscreen list
      fReBuildCharacterList = true;
    }
  }

  // If vehicle is empty, add to unique squad now that it has somebody in it!
  if (GetNumberInVehicle(iId) == 0 && pVehicleSoldier) {
    // 2 ) Add to unique squad...
    AddCharacterToUniqueSquad(pVehicleSoldier);

    // ATE: OK funcky stuff here!
    // We have now a guy on a squad group, remove him!
    RemovePlayerFromGroup(SquadMovementGroups[pVehicleSoldier.bAssignment], pVehicleSoldier);

    // I really have vehicles.\
    // ONLY add to vehicle group once!
    if (!DoesPlayerExistInPGroup(pVehicleList[iId].ubMovementGroup, pVehicleSoldier)) {
      // NOW.. add guy to vehicle group....
      AddPlayerToGroup(pVehicleList[iId].ubMovementGroup, pVehicleSoldier);
    } else {
      pVehicleSoldier.ubGroupID = pVehicleList[iId].ubMovementGroup;
    }
  }

  // check if the grunt is already here
  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] == pSoldier) {
      // guy found, no need to add
      return true;
    }
  }

  if (pVehicleSoldier) {
    // can't call SelectSoldier in mapscreen, that will initialize interface panels!!!
    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      SelectSoldier(pVehicleSoldier.ubID, false, true);
    }

    PlayJA2Sample(pVehicleList[pVehicleSoldier.bVehicleID].iOutOfSound, RATE_11025, SoundVolume(HIGHVOLUME, pVehicleSoldier.sGridNo), 1, SoundDir(pVehicleSoldier.sGridNo));
  }

  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    // check if slot free
    if (pVehicleList[iId].pPassengers[iCounter] == null) {
      // add person in
      pVehicleList[iId].pPassengers[iCounter] = pSoldier;

      if (pSoldier.bAssignment == Enum117.VEHICLE) {
        TakeSoldierOutOfVehicle(pSoldier);
        // NOTE: This will leave the soldier on a squad.  Must be done PRIOR TO and in AS WELL AS the call
        // to RemoveCharacterFromSquads() that's coming up, to permit direct vehicle->vehicle reassignment!
      }

      // if in a squad, remove from squad, if not, check if in vehicle, if so remove, if not, then check if in mvt group..if so, move and destroy group
      if (pSoldier.bAssignment < Enum117.ON_DUTY) {
        RemoveCharacterFromSquads(pSoldier);
      } else if (pSoldier.ubGroupID != 0) {
        // destroy group and set to zero
        RemoveGroup(pSoldier.ubGroupID);
        pSoldier.ubGroupID = 0;
      }

      if ((pSoldier.bAssignment != Enum117.VEHICLE) || (pSoldier.iVehicleId != iId)) {
        SetTimeOfAssignmentChangeForMerc(pSoldier);
      }

      // set thier assignment
      ChangeSoldiersAssignment(pSoldier, Enum117.VEHICLE);

      // set vehicle id
      pSoldier.iVehicleId = iId;

      // if vehicle is part of mvt group, then add character to mvt group
      if (pVehicleList[iId].ubMovementGroup != 0) {
        // add character
        AddPlayerToGroup(pVehicleList[iId].ubMovementGroup, pSoldier);
      }

      // Are we the first?
      if (GetNumberInVehicle(iId) == 1) {
        // Set as driver...
        pSoldier.uiStatusFlags |= SOLDIER_DRIVER;

        SetDriver(iId, pSoldier.ubID);
      } else {
        // Set as driver...
        pSoldier.uiStatusFlags |= SOLDIER_PASSENGER;
      }

      // Remove soldier's graphic
      RemoveSoldierFromGridNo(pSoldier);

      if (pVehicleSoldier) {
        // Set gridno for vehicle.....
        EVENT_SetSoldierPosition(pSoldier, pVehicleSoldier.dXPos, pVehicleSoldier.dYPos);

        // Stop from any movement.....
        EVENT_StopMerc(pSoldier, pSoldier.sGridNo, pSoldier.bDirection);

        // can't call SetCurrentSquad OR SelectSoldier in mapscreen, that will initialize interface panels!!!
        if (guiCurrentScreen == Enum26.GAME_SCREEN) {
          SetCurrentSquad(pVehicleSoldier.bAssignment, true);
        }
      }

      return true;
    }
  }

  // no slots, leave
  return false;
}

export function SetSoldierExitVehicleInsertionData(pSoldier: SOLDIERTYPE, iId: INT32): void {
  if (iId == iHelicopterVehicleId && !pSoldier.bInSector) {
    if (pSoldier.sSectorX != BOBBYR_SHIPPING_DEST_SECTOR_X || pSoldier.sSectorY != BOBBYR_SHIPPING_DEST_SECTOR_Y || pSoldier.bSectorZ != BOBBYR_SHIPPING_DEST_SECTOR_Z) {
      // Not anything different here - just use center gridno......
      pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_CENTER;
    } else {
      // This is drassen, make insertion gridno specific...
      pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
      pSoldier.usStrategicInsertionData = 10125;
    }
  }
}

function RemoveSoldierFromVehicle(pSoldier: SOLDIERTYPE, iId: INT32): boolean {
  // remove soldier from vehicle
  let iCounter: INT32 = 0;
  let fSoldierLeft: boolean = false;
  let fSoldierFound: boolean = false;
  let pVehicleSoldier: SOLDIERTYPE;

  if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
    return false;
  }

  // now check if vehicle is valid
  if (pVehicleList[iId].fValid == false) {
    return false;
  }

  // now look for the grunt
  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] == pSoldier) {
      fSoldierFound = true;

      pVehicleList[iId].pPassengers[iCounter].value.ubGroupID = 0;
      pVehicleList[iId].pPassengers[iCounter].value.sSectorY = pVehicleList[iId].sSectorY;
      pVehicleList[iId].pPassengers[iCounter].value.sSectorX = pVehicleList[iId].sSectorX;
      pVehicleList[iId].pPassengers[iCounter].value.bSectorZ = pVehicleList[iId].sSectorZ;
      pVehicleList[iId].pPassengers[iCounter] = null;

      pSoldier.uiStatusFlags &= (~(SOLDIER_DRIVER | SOLDIER_PASSENGER));

      // check if anyone left in vehicle
      fSoldierLeft = false;
      for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
        if (pVehicleList[iId].pPassengers[iCounter] != null) {
          fSoldierLeft = true;
        }
      }

      if (pVehicleList[iId].ubMovementGroup != 0) {
        RemovePlayerFromGroup(pVehicleList[iId].ubMovementGroup, pSoldier);

        /* ARM 20-01-99, now gonna disallow exiting vehicles between sectors except if merc is leaving (fired, dies, contract runs out)
                                                                                in which case we don't need to give them up for anything movement related since they're gone.

                                        // check if vehicle was between sectors, if so, grunt must go it on foot
                                        if( pVehicleList[ iId ].fBetweenSectors == TRUE )
                                        {
                                                RemoveSoldierFromVehicleBetweenSectors( pSoldier, iId );
                                        }
        */
      }

      break;
    }
  }

  if (!fSoldierFound) {
    return false;
  }

  // Are we the last?
  // if ( GetNumberInVehicle( iId ) == 0 )
  if (fSoldierLeft == false) {
    // is the vehicle the helicopter?..it can continue moving when no soldiers aboard (Skyrider remains)
    if (iId != iHelicopterVehicleId) {
      pVehicleSoldier = GetSoldierStructureForVehicle(iId);
      Assert(pVehicleSoldier);

      if (pVehicleSoldier) {
        // and he has a route set
        if (GetLengthOfMercPath(pVehicleSoldier) > 0) {
          // cancel the entire path (also handles reversing directions)
          CancelPathForVehicle(pVehicleList[iId], false);
        }

        // if the vehicle was abandoned between sectors
        if (pVehicleList[iId].fBetweenSectors) {
          // teleport it to the closer of its current and next sectors (it beats having it arrive empty later)
          TeleportVehicleToItsClosestSector(iId, pVehicleSoldier.ubGroupID);
        }

        // Remove vehicle from squad.....
        RemoveCharacterFromSquads(pVehicleSoldier);
        // ATE: Add him back to vehicle group!
        if (!DoesPlayerExistInPGroup(pVehicleList[iId].ubMovementGroup, pVehicleSoldier)) {
          AddPlayerToGroup(pVehicleList[iId].ubMovementGroup, pVehicleSoldier);
        }
        ChangeSoldiersAssignment(pVehicleSoldier, Enum117.ASSIGNMENT_EMPTY);

        /* ARM Removed Feb. 17, 99 - causes pVehicleSoldier->ubGroupID to become 0, which will cause assert later on
                                        RemovePlayerFromGroup( pVehicleSoldier->ubGroupID, pVehicleSoldier );
        */

        /*
                                        // Change sides...
                                        pVehicleSoldier = ChangeSoldierTeam( pVehicleSoldier, CIV_TEAM );
                                        // subtract it from mapscreen list
                                        fReBuildCharacterList = TRUE;

                                        RemoveCharacterFromSquads( pVehicleSoldier );
        */
      }
    }
  }

  // if he got out of the chopper
  if (iId == iHelicopterVehicleId) {
    // and he's alive
    if (pSoldier.bLife >= OKLIFE) {
      // mark the sector as visited (flying around in the chopper doesn't, so this does it as soon as we get off it)
      SetSectorFlag(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ, SF_ALREADY_VISITED);
    }

    SetSoldierExitVehicleInsertionData(pSoldier, iId);

    // Update in sector if this is the current sector.....
    if (pSoldier.sSectorX == gWorldSectorX && pSoldier.sSectorY == gWorldSectorY && pSoldier.bSectorZ == gbWorldSectorZ) {
      UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    }
  }

  // soldier successfully removed
  return true;
}

/*
void RemoveSoldierFromVehicleBetweenSectors( pSoldier, iId )
{
        GROUP *pGroup;
        INT32 iCurrentCostInTime = 0;
        INT8 bDelta = 0;
        UINT8 ubCurrent, ubNext, ubDirection, ubSector;
        UINT8 ubNextX, ubNextY, ubPrevX, ubPrevY;
        UINT32 uiTraverseTime, uiArriveTime;
        UINT8 ubGroupId;
        float flTripFractionCovered;


        // set up a mvt group for the grunt
        pSoldier->fBetweenSectors = TRUE;

        // ok, the guy wasn't in a squad
        // get his mvt groups position and set the squads to this
        GetGroupPosition(&ubNextX, &ubNextY, &ubPrevX, &ubPrevY, &uiTraverseTime, &uiArriveTime, pVehicleList[ iId ].ubMovementGroup );

        ubGroupId = CreateNewPlayerGroupDepartingFromSector( ( INT8 ) ( pSoldier -> sSectorX ) , ( INT8 ) ( pSoldier -> sSectorY ) );

        // assign to a group
        AddPlayerToGroup( ubGroupId, pSoldier );

        // get the group
        pGroup = GetGroup( ubGroupId );


        // find total time for traversal between sectors for foot mvt type

        // get current and next sector values (DON'T use prevX, prevY, that's the sector BEFORE the current one!!!)
        ubCurrent = CALCULATE_STRATEGIC_INDEX( pGroup->ubSectorX, pGroup->ubSectorY );
        ubNext = CALCULATE_STRATEGIC_INDEX( ubNextX, ubNextY );

        // handle errors
        Assert( ubCurrent != ubNext );
        if ( ubCurrent == ubNext )
                continue;

        // which direction are we moving in?
        bDelta = (INT8) ubNext - ubCurrent;
        if( bDelta > 0 )
        {
                if( bDelta % SOUTH_MOVE == 0 )
                {
                        ubDirection = SOUTH_STRATEGIC_MOVE;
                }
                else
                {
                        ubDirection = EAST_STRATEGIC_MOVE;
                }
        }
        else
        {
                if( bDelta % NORTH_MOVE == 0 )
                {
                        ubDirection = NORTH_STRATEGIC_MOVE;
                }
                else
                {
                        ubDirection = WEST_STRATEGIC_MOVE;
                }
        }


        // calculate how long the entire trip would have taken on foot
        ubSector = ( UINT8 ) SECTOR( pGroup->ubSectorX, pGroup->ubSectorY );
        iCurrentCostInTime = GetSectorMvtTimeForGroup( ubSector, ubDirection, pGroup );

        if( iCurrentCostInTime == 0xffffffff )
        {
                AssertMsg( 0, String("Group %d (%s) attempting illegal move from sector %d, dir %d (%s).",
                                pGroup->ubGroupID, ( pGroup->fPlayer ) ? "Player" : "AI",
                                ubSector, ubDirection,
                                gszTerrain[SectorInfo[ubSector].ubTraversability[ubDirection]] ) );
        }

        // figure out what how far along ( percentage ) the vehicle's trip duration we bailed out at
        flTripFractionCovered = ( uiTraverseTime - uiArriveTime + GetWorldTotalMin( ) ) / (float)uiTraverseTime;

        // calculate how much longer we have to go on foot to get there
        uiArriveTime = ( UINT32 )( ( ( 1.0 - flTripFractionCovered ) * ( float )iCurrentCostInTime ) + GetWorldTotalMin( ) );

        SetGroupPosition( ubNextX, ubNextY, ubPrevX, ubPrevY, iCurrentCostInTime, uiArriveTime, pSoldier -> ubGroupID );

// ARM: if this is ever reactivated, there seem to be the following additional problems:
        1) The soldier removed isn't showing any DEST.  Must set up his strategic path/destination.
        2) The arrive time seems to be much later than it should have been, suggesting the math above is wrong somehow
        3) Reassigning multiple mercs at once out of a vehicle onroute doesn't work 'cause the group is between sectors so only
                        the first merc gets added successfully, the others all fail.
}
*/

export function MoveCharactersPathToVehicle(pSoldier: SOLDIERTYPE): boolean {
  let iId: INT32;
  // valid soldier?
  if (pSoldier == null) {
    return false;
  }

  // check if character is in fact in a vehicle
  if ((pSoldier.bAssignment != Enum117.VEHICLE) && (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE))) {
    // now clear soldier's path
    pSoldier.pMercPath = ClearStrategicPathList(pSoldier.pMercPath, 0);
    return false;
  }

  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    // grab the id the character is
    iId = pSoldier.bVehicleID;
  } else {
    // grab the id the character is
    iId = pSoldier.iVehicleId;
  }

  // check if vehicle is valid
  if (iId != -1) {
    // check if vehicle has mvt group, if not, get one for it
    if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
      // now clear soldier's path
      pSoldier.pMercPath = ClearStrategicPathList(pSoldier.pMercPath, 0);
      return false;
    }

    // now check if vehicle is valid
    if (pVehicleList[iId].fValid == false) {
      // now clear soldier's path
      pSoldier.pMercPath = ClearStrategicPathList(pSoldier.pMercPath, 0);
      return false;
    }
  }

  // valid vehicle

  // now clear soldier's path
  pVehicleList[iId].pMercPath = ClearStrategicPathList(pVehicleList[iId].pMercPath, pVehicleList[iId].ubMovementGroup);

  // now copy over
  pVehicleList[iId].pMercPath = CopyPaths(pSoldier.pMercPath, pVehicleList[iId].pMercPath);

  // move to beginning
  pVehicleList[iId].pMercPath = MoveToBeginningOfPathList(pVehicleList[iId].pMercPath);

  // now clear soldier's path
  pSoldier.pMercPath = ClearStrategicPathList(pSoldier.pMercPath, 0);

  return true;
}

function CopyVehiclePathToSoldier(pSoldier: SOLDIERTYPE): boolean {
  let iId: INT32;

  // valid soldier?
  if (pSoldier == null) {
    return false;
  }

  // check if character is in fact in a vehicle
  if ((pSoldier.bAssignment != Enum117.VEHICLE) && (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE))) {
    return false;
  }

  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    // grab the id the character is
    iId = pSoldier.bVehicleID;
  } else {
    // grab the id the character is
    iId = pSoldier.iVehicleId;
  }

  // check if vehicle is valid
  if (iId != -1) {
    // check if vehicle has mvt group, if not, get one for it
    if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
      return false;
    }

    // now check if vehicle is valid
    if (pVehicleList[iId].fValid == false) {
      return false;
    }
  }

  // reset mvt group for the grunt
  // ATE: NOT if we are the vehicle
  if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    pSoldier.ubGroupID = pVehicleList[iId].ubMovementGroup;
  }

  // valid vehicle

  // clear grunt path
  if (pSoldier.pMercPath) {
    // clear soldier's path
    pSoldier.pMercPath = ClearStrategicPathList(pSoldier.pMercPath, 0);
  }

  // now copy over
  pSoldier.pMercPath = CopyPaths(pVehicleList[iId].pMercPath, pSoldier.pMercPath);

  return true;
}

export function SetUpMvtGroupForVehicle(pSoldier: SOLDIERTYPE): boolean {
  // given this grunt, find out if asscoiated vehicle has a mvt group, if so, set this grunts mvt group tho the vehicle
  // for pathing purposes, will be reset to zero in copying of path
  let iId: INT32 = 0;
  let iCounter: INT32 = 0;

  // check if character is in fact in a vehicle
  if ((pSoldier.bAssignment != Enum117.VEHICLE) && (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE))) {
    return false;
  }

  if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
    // grab the id the character is
    iId = pSoldier.bVehicleID;
  } else {
    // grab the id the character is
    iId = pSoldier.iVehicleId;
  }

  if (pSoldier.pMercPath) {
    // clear soldier's path
    pSoldier.pMercPath = ClearStrategicPathList(pSoldier.pMercPath, pSoldier.ubGroupID);
  }

  // if no group, create one for vehicle
  // if( pVehicleList[ iId ].ubMovementGroup == 0 )
  //{
  // get the vehicle a mvt group
  // pVehicleList[ iId ].ubMovementGroup = CreateNewVehicleGroupDepartingFromSector( ( UINT8 )( pVehicleList[ iId ].sSectorX ), ( UINT8 )( pVehicleList[ iId ].sSectorY ), iId );
  // pVehicleList[ iId ].ubMovementGroup = CreateNewVehicleGroupDepartingFromSector( ( UINT8 )( pVehicleList[ iId ].sSectorX ), ( UINT8 )( pVehicleList[ iId ].sSectorY ), iId );

  // add everyone in vehicle to this mvt group
  // for( iCounter = 0; iCounter < iSeatingCapacities[ pVehicleList[ iId ].ubVehicleType ]; iCounter++ )
  //{
  //	if( pVehicleList[ iId ].pPassengers[ iCounter ] != NULL )
  //	{
  //			// add character
  //		AddPlayerToGroup( pVehicleList[ iId ].ubMovementGroup, pVehicleList[ iId ].pPassengers[ iCounter ] );
  //	}
  //}
  //}

  CopyVehiclePathToSoldier(pSoldier);

  // set up mvt group
  pSoldier.ubGroupID = pVehicleList[iId].ubMovementGroup;

  return true;
}
export function VehicleIdIsValid(iId: INT32): boolean {
  // check if vehicle has mvt group, if not, get one for it
  if ((iId >= ubNumberOfVehicles) || (iId < 0)) {
    return false;
  }
  // now check if vehicle is valid
  if (pVehicleList[iId].fValid == false) {
    return false;
  }

  return true;
}

// get travel time of vehicle
function GetTravelTimeOfVehicle(iId: INT32): INT32 {
  let pGroup: GROUP;

  // valid vehicle?
  if (VehicleIdIsValid(iId) == false) {
    return 0;
  }

  // no mvt group?
  if (pVehicleList[iId].ubMovementGroup == 0) {
    return 0;
  }

  pGroup = GetGroup(pVehicleList[iId].ubMovementGroup);

  if (pGroup == null) {
    pVehicleList[iId].ubMovementGroup = 0;
    return 0;
  }

  return CalculateTravelTimeOfGroupId(pVehicleList[iId].ubMovementGroup);
}

export function UpdatePositionOfMercsInVehicle(iId: INT32): void {
  let iCounter: INT32 = 0;

  // update the position of all the grunts in the vehicle
  if (VehicleIdIsValid(iId) == false) {
    return;
  }

  // go through list of mercs in vehicle and set all thier states as arrived
  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] != null) {
      pVehicleList[iId].pPassengers[iCounter].sSectorY = pVehicleList[iId].sSectorY;
      pVehicleList[iId].pPassengers[iCounter].sSectorX = pVehicleList[iId].sSectorX;
      pVehicleList[iId].pPassengers[iCounter].fBetweenSectors = false;
    }
  }

  return;
}

export function GivenMvtGroupIdFindVehicleId(ubGroupId: UINT8): INT32 {
  let iCounter: INT32 = 0;

  // given the id of a mvt group, find a vehicle in this group
  if (ubGroupId == 0) {
    return -1;
  }

  for (iCounter = 0; iCounter < ubNumberOfVehicles; iCounter++) {
    // might have an empty slot
    if (pVehicleList[iCounter].fValid == true) {
      if (pVehicleList[iCounter].ubMovementGroup == ubGroupId) {
        return iCounter;
      }
    }
  }

  return -1;
}

// add all people in this vehicle to the mvt group for benifit of prebattle interface
function AddVehicleMembersToMvtGroup(iId: INT32): boolean {
  let iCounter: INT32 = 0;

  if (VehicleIdIsValid(iId) == false) {
    return false;
  }

  // clear the vehicle people list out
  // RemoveAllPlayersFromGroup( pVehicleList[ iId ].ubMovementGroup );

  // go through list of mercs in vehicle and set all thier states as arrived
  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] != null) {
      AddPlayerToGroup(pVehicleList[iId].ubMovementGroup, pVehicleList[iId].pPassengers[iCounter]);
    }
  }

  return true;
}

function InjurePersonInVehicle(iId: INT32, pSoldier: SOLDIERTYPE, ubPointsOfDmg: UINT8): boolean {
  // find this person, see if they have this many pts left, if not, kill them

  // find if vehicle is valid
  if (VehicleIdIsValid(iId) == false) {
    return false;
  }

  // check if soldier is valid
  if (pSoldier == null) {
    return false;
  }

  // now check hpts of merc
  if (pSoldier.bLife == 0) {
    // guy is dead, leave
    return false;
  }

  // see if we will infact kill them
  if (ubPointsOfDmg >= pSoldier.bLife) {
    return KillPersonInVehicle(iId, pSoldier);
  }

  // otherwise hurt them
  SoldierTakeDamage(pSoldier, 0, ubPointsOfDmg, ubPointsOfDmg, TAKE_DAMAGE_GUNFIRE, NOBODY, NOWHERE, 0, true);

  HandleSoldierTakeDamageFeedback(pSoldier);

  return true;
}

function KillPersonInVehicle(iId: INT32, pSoldier: SOLDIERTYPE): boolean {
  // find if vehicle is valid
  if (VehicleIdIsValid(iId) == false) {
    return false;
  }

  // check if soldier is valid
  if (pSoldier == null) {
    return false;
  }

  // now check hpts of merc
  if (pSoldier.bLife == 0) {
    // guy is dead, leave
    return false;
  }

  // otherwise hurt them
  SoldierTakeDamage(pSoldier, 0, 100, 100, TAKE_DAMAGE_BLOODLOSS, NOBODY, NOWHERE, 0, true);

  return true;
}

export function KillAllInVehicle(iId: INT32): boolean {
  let iCounter: INT32 = 0;

  // find if vehicle is valid
  if (VehicleIdIsValid(iId) == false) {
    return false;
  }

  // go through list of occupants and kill them
  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] != null) {
      if (KillPersonInVehicle(iId, pVehicleList[iId].pPassengers[iCounter]) == false) {
        return false;
      }
    }
  }

  return true;
}

export function GetNumberInVehicle(iId: INT32): INT32 {
  // go through list of occupants in vehicles and count them
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  // find if vehicle is valid
  if (VehicleIdIsValid(iId) == false) {
    return 0;
  }

  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] != null) {
      iCount++;
    }
  }

  return iCount;
}

export function GetNumberOfNonEPCsInVehicle(iId: INT32): INT32 {
  // go through list of occupants in vehicles and count them
  let iCounter: INT32 = 0;
  let iCount: INT32 = 0;

  // find if vehicle is valid
  if (VehicleIdIsValid(iId) == false) {
    return 0;
  }

  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] != null && !AM_AN_EPC(pVehicleList[iId].pPassengers[iCounter])) {
      iCount++;
    }
  }

  return iCount;
}

export function IsRobotControllerInVehicle(iId: INT32): boolean {
  // go through list of occupants in vehicles and count them
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  // find if vehicle is valid
  if (VehicleIdIsValid(iId) == false) {
    return false;
  }

  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    pSoldier = pVehicleList[iId].pPassengers[iCounter];
    if (pSoldier != null && ControllingRobot(pSoldier)) {
      return true;
    }
  }

  return false;
}

export function AnyAccessibleVehiclesInSoldiersSector(pSoldier: SOLDIERTYPE): boolean {
  let iCounter: INT32 = 0;

  for (iCounter = 0; iCounter < ubNumberOfVehicles; iCounter++) {
    if (pVehicleList[iCounter].fValid == true) {
      if (IsThisVehicleAccessibleToSoldier(pSoldier, iCounter)) {
        return true;
      }
    }
  }

  return false;
}

function GetDriver(iID: INT32): SOLDIERTYPE {
  return MercPtrs[pVehicleList[iID].ubDriver];
}

function SetDriver(iID: INT32, ubID: UINT8): void {
  pVehicleList[iID].ubDriver = ubID;
}

export function IsEnoughSpaceInVehicle(iID: INT32): boolean {
  // find if vehicle is valid
  if (VehicleIdIsValid(iID) == false) {
    return false;
  }

  if (GetNumberInVehicle(iID) == iSeatingCapacities[pVehicleList[iID].ubVehicleType]) {
    return false;
  }

  return true;
}

export function PutSoldierInVehicle(pSoldier: SOLDIERTYPE, bVehicleId: INT8): boolean {
  let pVehicleSoldier: SOLDIERTYPE;

  if ((pSoldier.sSectorX != gWorldSectorX) || (pSoldier.sSectorY != gWorldSectorY) || (pSoldier.bSectorZ != 0) || (bVehicleId == iHelicopterVehicleId)) {
    // add the soldier
    return AddSoldierToVehicle(pSoldier, bVehicleId);
  } else {
    // grab the soldier struct for the vehicle
    pVehicleSoldier = GetSoldierStructureForVehicle(bVehicleId);

    // enter the vehicle
    return EnterVehicle(pVehicleSoldier, pSoldier);
  }
}

export function TakeSoldierOutOfVehicle(pSoldier: SOLDIERTYPE): boolean {
  // if not in vehicle, don't take out, not much point, now is there?
  if (pSoldier.bAssignment != Enum117.VEHICLE) {
    return false;
  }

  if ((pSoldier.sSectorX != gWorldSectorX) || (pSoldier.sSectorY != gWorldSectorY) || (pSoldier.bSectorZ != 0) || !pSoldier.bInSector) {
    // add the soldier
    return RemoveSoldierFromVehicle(pSoldier, pSoldier.iVehicleId);
  } else {
    // helicopter isn't a soldiertype instance
    if (pSoldier.iVehicleId == iHelicopterVehicleId) {
      return RemoveSoldierFromVehicle(pSoldier, pSoldier.iVehicleId);
    } else {
      // exit the vehicle
      return ExitVehicle(pSoldier);
    }
  }
}

export function EnterVehicle(pVehicle: SOLDIERTYPE, pSoldier: SOLDIERTYPE): boolean {
  let sOldGridNo: INT16 = 0;

  // TEST IF IT'S VALID...
  if (pVehicle.uiStatusFlags & SOLDIER_VEHICLE) {
    // Is there room...
    if (IsEnoughSpaceInVehicle(pVehicle.bVehicleID)) {
      // OK, add....
      AddSoldierToVehicle(pSoldier, pVehicle.bVehicleID);

      if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
        // Change to team panel if we are not already...
        SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
      }

      return true;
    }
  }

  return false;
}

function GetVehicleSoldierPointerFromPassenger(pSrcSoldier: SOLDIERTYPE): SOLDIERTYPE | null {
  let cnt: UINT32;
  let pSoldier: SOLDIERTYPE;

  // End the turn of player charactors
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive && pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
      // Check ubID....
      if (pSoldier.bVehicleID == pSrcSoldier.iVehicleId) {
        return pSoldier;
      }
    }
  }

  return null;
}

export function ExitVehicle(pSoldier: SOLDIERTYPE): boolean {
  let pVehicle: SOLDIERTYPE | null;
  let ubDirection: UINT8;
  let sGridNo: INT16;

  // Get vehicle from soldier...
  pVehicle = GetVehicleSoldierPointerFromPassenger(pSoldier);

  if (pVehicle == null) {
    return false;
  }

  // TEST IF IT'S VALID...
  if (pVehicle.uiStatusFlags & SOLDIER_VEHICLE) {
    sGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.usUIMovementMode, 5, addressof(ubDirection), 3, pVehicle);

    if (sGridNo == NOWHERE) {
      // ATE: BUT we need a place, widen the search
      sGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.usUIMovementMode, 20, addressof(ubDirection), 3, pVehicle);
    }

    // OK, remove....
    RemoveSoldierFromVehicle(pSoldier, pVehicle.bVehicleID);

    // Were we the driver, and if so, pick another....
    pSoldier.sInsertionGridNo = sGridNo;
    pSoldier.ubStrategicInsertionCode = Enum175.INSERTION_CODE_GRIDNO;
    pSoldier.usStrategicInsertionData = pSoldier.sInsertionGridNo;
    pSoldier.iVehicleId = -1;

    // AllTeamsLookForAll( FALSE );
    pSoldier.bOppList[pVehicle.ubID] = 1;

    // Add to sector....
    EVENT_SetSoldierPosition(pSoldier, CenterX(sGridNo), CenterY(sGridNo));

    // Update visiblity.....
    HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO);

    // Add to unique squad....
    AddCharacterToUniqueSquad(pSoldier);

    // can't call SetCurrentSquad OR SelectSoldier in mapscreen, that will initialize interface panels!!!
    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      SetCurrentSquad(pSoldier.bAssignment, true);

      SelectSoldier(pSoldier.ubID, false, true);
    }

    PlayJA2Sample(pVehicleList[pVehicle.bVehicleID].iOutOfSound, RATE_11025, SoundVolume(HIGHVOLUME, pVehicle.sGridNo), 1, SoundDir(pVehicle.sGridNo));
    return true;
  }

  return false;
}

export function AddPassangersToTeamPanel(iId: INT32): void {
  let cnt: INT32;

  for (cnt = 0; cnt < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; cnt++) {
    if (pVehicleList[iId].pPassengers[cnt] != null) {
      // add character
      AddPlayerToInterfaceTeamSlot(pVehicleList[iId].pPassengers[cnt].ubID);
    }
  }
}

export function VehicleTakeDamage(ubID: UINT8, ubReason: UINT8, sDamage: INT16, sGridNo: INT16, ubAttackerID: UINT8): void {
  let sOldDmgValue: INT16 = 0;

  if (ubReason != TAKE_DAMAGE_GAS) {
    PlayJA2Sample((Enum330.S_METAL_IMPACT3), RATE_11025, SoundVolume(MIDVOLUME, sGridNo), 1, SoundDir(sGridNo));
  }

  // check if there was in fact damage done to the vehicle
  if ((ubReason == TAKE_DAMAGE_HANDTOHAND) || (ubReason == TAKE_DAMAGE_GAS)) {
    // nope
    return;
  }

  if (pVehicleList[ubID].fDestroyed == false) {
    switch (ubReason) {
      case (TAKE_DAMAGE_GUNFIRE):
      case (TAKE_DAMAGE_EXPLOSION):
      case (TAKE_DAMAGE_STRUCTURE_EXPLOSION):

        HandleCriticalHitForVehicleInLocation(ubID, sDamage, sGridNo, ubAttackerID);
        break;
    }
  }
}

function HandleCriticalHitForVehicleInLocation(ubID: UINT8, sDmg: INT16, sGridNo: INT16, ubAttackerID: UINT8): void {
  // check state the armor was s'posed to be in vs. the current state..the difference / orig state is % chance
  // that a critical hit will occur
  let sOrigValue: INT16 = 0;
  let sCurrValue: INT16 = 0;
  let fChance: FLOAT = 0.0;
  let iRand: INT32 = 0;
  let iCrit: INT32 = 0;
  let pSoldier: SOLDIERTYPE;
  let fDestroyVehicle: boolean = false;
  let fMadeCorpse: boolean = false;

  pSoldier = GetSoldierStructureForVehicle(ubID);

  if (sDmg > pSoldier.bLife) {
    pSoldier.bLife = 0;
  } else {
    // Decrease Health
    pSoldier.bLife -= sDmg;
  }

  if (pSoldier.bLife < OKLIFE) {
    pSoldier.bLife = 0;
  }

  // Show damage
  pSoldier.sDamage += sDmg;

  if (pSoldier.bInSector && pSoldier.bVisible != -1) {
    // If we are already dead, don't show damage!
    if (sDmg != 0) {
      // Display damage
      let sMercScreenX: INT16;
      let sMercScreenY: INT16;
      let sOffsetX: INT16;
      let sOffsetY: INT16;

      // Set Damage display counter
      pSoldier.fDisplayDamage = true;
      pSoldier.bDisplayDamageCount = 0;

      ({ sScreenX: sMercScreenX, sScreenY: sMercScreenY } = GetSoldierScreenPos(pSoldier));
      ({ sOffsetX, sOffsetY } = GetSoldierAnimOffsets(pSoldier));
      pSoldier.sDamageX = sOffsetX;
      pSoldier.sDamageY = sOffsetY;
    }
  }

  if (pSoldier.bLife == 0 && !pVehicleList[ubID].fDestroyed) {
    pVehicleList[ubID].fDestroyed = true;

    // Explode vehicle...
    IgniteExplosion(ubAttackerID, CenterX(sGridNo), CenterY(sGridNo), 0, sGridNo, Enum225.GREAT_BIG_EXPLOSION, 0);

    if (pSoldier != null) {
      // Tacticlly remove soldier....
      // EVENT_InitNewSoldierAnim( pSoldier, VEHICLE_DIE, 0, FALSE );
      // TacticalRemoveSoldier( pSoldier->ubID );

      CheckForAndHandleSoldierDeath(pSoldier, addressof(fMadeCorpse));
    }

    // Kill all in vehicle...
    KillAllInVehicle(ubID);
  }

  return;
}

export function DoesVehicleNeedAnyRepairs(iVehicleId: INT32): boolean {
  let pVehicleSoldier: SOLDIERTYPE;

  // is the vehicle in fact a valid vehicle
  if (VehicleIdIsValid(iVehicleId) == false) {
    // nope
    return false;
  }

  // Skyrider isn't damagable/repairable
  if (iVehicleId == iHelicopterVehicleId) {
    return false;
  }

  // get the vehicle soldiertype
  pVehicleSoldier = GetSoldierStructureForVehicle(iVehicleId);

  if (pVehicleSoldier.bLife != pVehicleSoldier.bLifeMax) {
    return true;
  }

  // everything is in perfect condition
  return false;
}

export function RepairVehicle(iVehicleId: INT32, bRepairPtsLeft: INT8, pfNothingToRepair: Pointer<boolean>): INT8 {
  let pVehicleSoldier: SOLDIERTYPE;
  let bRepairPtsUsed: INT8 = 0;
  let bOldLife: INT8;

  // is the vehicle in fact a valid vehicle
  if (VehicleIdIsValid(iVehicleId) == false) {
    // nope
    return bRepairPtsUsed;
  }

  // Skyrider isn't damagable/repairable
  if (iVehicleId == iHelicopterVehicleId) {
    return bRepairPtsUsed;
  }

  // get the vehicle soldiertype
  pVehicleSoldier = GetSoldierStructureForVehicle(iVehicleId);

  if (!DoesVehicleNeedAnyRepairs(iVehicleId)) {
    return bRepairPtsUsed;
  }

  bOldLife = pVehicleSoldier.bLife;

  // Repair
  pVehicleSoldier.bLife += (bRepairPtsLeft / VEHICLE_REPAIR_POINTS_DIVISOR);

  // Check
  if (pVehicleSoldier.bLife > pVehicleSoldier.bLifeMax) {
    pVehicleSoldier.bLife = pVehicleSoldier.bLifeMax;
  }

  // Calculate pts used;
  bRepairPtsUsed = (pVehicleSoldier.bLife - bOldLife) * VEHICLE_REPAIR_POINTS_DIVISOR;

  // ARM: personally, I'd love to know where in Arulco the mechanic gets the PARTS to do this stuff, but hey, it's a game!
  (pfNothingToRepair.value) = !DoesVehicleNeedAnyRepairs(iVehicleId);

  return bRepairPtsUsed;
}

/*
INT16 GetOrigInternalArmorValueForVehicleInLocation( UINT8 ubID, UINT8 ubLocation )
{
        INT16 sArmorValue = 0;

        sArmorValue = sVehicleInternalOrigArmorValues[ pVehicleList[ ubID ].ubVehicleType ][ ubLocation ];

        // return the armor value
        return( sArmorValue );
}
*/

export function GetSoldierStructureForVehicle(iId: INT32): SOLDIERTYPE {
  let pSoldier: SOLDIERTYPE;
  let pFoundSoldier: SOLDIERTYPE = <SOLDIERTYPE><unknown>null;
  let iCounter: INT32 = 0;
  let iNumberOnTeam: INT32 = 0;

  // get number of mercs on team
  iNumberOnTeam = TOTAL_SOLDIERS; // gTacticalStatus.Team[ OUR_TEAM ].bLastID;

  for (iCounter = 0; iCounter < iNumberOnTeam; iCounter++) {
    pSoldier = Menptr[iCounter];

    if (pSoldier.bActive) {
      if (pSoldier.uiStatusFlags & SOLDIER_VEHICLE) {
        if (pSoldier.bVehicleID == iId) {
          pFoundSoldier = pSoldier;
          iCounter = iNumberOnTeam;
        }
      }
    }
  }

  return pFoundSoldier;
}

function SetUpArmorForVehicle(ubID: UINT8): void {
  let iCounter: INT32 = 0;

  /*
          // set up the internal and external armor for vehicles
          for( iCounter = 0; iCounter < NUMBER_OF_INTERNAL_HIT_LOCATIONS_IN_VEHICLE; iCounter++ )
          {
                  pVehicleList[ ubID ].sInternalHitLocations[ iCounter ] = sVehicleInternalOrigArmorValues[ pVehicleList[ ubID ].ubVehicleType ][ iCounter ];
          }


          for( iCounter = 0; iCounter < NUMBER_OF_EXTERNAL_HIT_LOCATIONS_ON_VEHICLE; iCounter++ )
          {
                  pVehicleList[ ubID ].sExternalArmorLocationsStatus[ iCounter ] = 100;
          }
          */

  // for armour type, store the index into the armour table itself
  pVehicleList[ubID].sArmourType = Item[sVehicleArmourType[pVehicleList[ubID].ubVehicleType]].ubClassIndex;

  return;
}

export function AdjustVehicleAPs(pSoldier: SOLDIERTYPE, ubPoints: UINT8): UINT8 {
  let pubDeducations: UINT8 = 0;
  let iCounter: INT32 = 0;

  ubPoints += 35;

  // check for state of critcals

  // handle for each engine crit
  pubDeducations += pVehicleList[pSoldier.bVehicleID].sCriticalHits[Enum281.ENGINE_HIT_LOCATION] * COST_PER_ENGINE_CRIT;

  // handle each tire
  for (iCounter = Enum281.RF_TIRE_HIT_LOCATION; iCounter < Enum281.LR_TIRE_HIT_LOCATION; iCounter++) {
    if (pVehicleList[pSoldier.bVehicleID].sCriticalHits[iCounter]) {
      pubDeducations += COST_PER_TIRE_HIT;
    }
  }

  // make sure we don't go too far
  if (pubDeducations > ubPoints) {
    pubDeducations = ubPoints;
  }

  // now deduct pts
  ubPoints -= pubDeducations;

  return ubPoints;
}

export function SaveVehicleInformationToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let pTempPathPtr: PathStPtr;
  let uiNodeCount: UINT32 = 0;
  let cnt: UINT8;
  let TempVehicle: VEHICLETYPE;
  let ubPassengerCnt: UINT8 = 0;

  // Save the number of elements
  uiNumBytesWritten = FileWrite(hFile, addressof(ubNumberOfVehicles), sizeof(UINT8));
  if (uiNumBytesWritten != sizeof(UINT8)) {
    return false;
  }

  // loop through all the vehicles and save each one
  for (cnt = 0; cnt < ubNumberOfVehicles; cnt++) {
    // save if the vehicle spot is valid
    uiNumBytesWritten = FileWrite(hFile, addressof(pVehicleList[cnt].fValid), sizeof(BOOLEAN));
    if (uiNumBytesWritten != sizeof(BOOLEAN)) {
      return false;
    }

    if (pVehicleList[cnt].fValid) {
      // copy the node into the temp vehicle buffer ( need to do this because we cant save the pointers
      // to the soldier, therefore save the soldier ubProfile
      memcpy(addressof(TempVehicle), addressof(pVehicleList[cnt]), sizeof(VEHICLETYPE));

      // loop through the passengers
      for (ubPassengerCnt = 0; ubPassengerCnt < 10; ubPassengerCnt++) {
        TempVehicle.pPassengers[ubPassengerCnt] = NO_PROFILE;

        // if there is a passenger here
        if (pVehicleList[cnt].pPassengers[ubPassengerCnt]) {
          // assign the passengers profile to the struct
          // ! The pointer to the passenger is converted to a byte so that the Id of the soldier can be saved.
          // ! This means that the pointer contains a bogus pointer, but a real ID for the soldier.
          // ! When reloading, this bogus pointer is converted to a byte to contain the id of the soldier so
          // ! we can get the REAL pointer to the soldier
          TempVehicle.pPassengers[ubPassengerCnt] = pVehicleList[cnt].pPassengers[ubPassengerCnt].value.ubProfile;
        }
      }

      // save the vehicle info
      uiNumBytesWritten = FileWrite(hFile, addressof(TempVehicle), sizeof(VEHICLETYPE));
      if (uiNumBytesWritten != sizeof(VEHICLETYPE)) {
        return false;
      }
      // count the number of nodes in the vehicles path
      uiNodeCount = 0;
      pTempPathPtr = pVehicleList[cnt].pMercPath;
      while (pTempPathPtr) {
        uiNodeCount++;
        pTempPathPtr = pTempPathPtr.value.pNext;
      }

      // Save the number of nodes
      uiNumBytesWritten = FileWrite(hFile, addressof(uiNodeCount), sizeof(UINT32));
      if (uiNumBytesWritten != sizeof(UINT32)) {
        return false;
      }

      // save all the nodes
      pTempPathPtr = pVehicleList[cnt].pMercPath;
      while (pTempPathPtr) {
        // Save the node
        uiNumBytesWritten = FileWrite(hFile, pTempPathPtr, sizeof(PathSt));
        if (uiNumBytesWritten != sizeof(PathSt)) {
          return false;
        }

        pTempPathPtr = pTempPathPtr.value.pNext;
      }
    }
  }

  return true;
}

export function LoadVehicleInformationFromSavedGameFile(hFile: HWFILE, uiSavedGameVersion: UINT32): boolean {
  let uiNumBytesRead: UINT32;
  let uiTotalNodeCount: UINT32 = 0;
  let cnt: UINT8;
  let uiNodeCount: UINT32 = 0;
  let pPath: Pointer<PathSt> = null;
  let ubPassengerCnt: UINT8 = 0;
  let pTempPath: Pointer<PathSt>;

  // Clear out th vehicle list
  ClearOutVehicleList();

  // Load the number of elements
  uiNumBytesRead = FileRead(hFile, addressof(ubNumberOfVehicles), sizeof(UINT8));
  if (uiNumBytesRead != sizeof(UINT8)) {
    return false;
  }

  if (ubNumberOfVehicles != 0) {
    // allocate memory to hold the vehicle list
    pVehicleList = MemAlloc(sizeof(VEHICLETYPE) * ubNumberOfVehicles);
    if (pVehicleList == null)
      return false;
    memset(pVehicleList, 0, sizeof(VEHICLETYPE) * ubNumberOfVehicles);

    // loop through all the vehicles and load each one
    for (cnt = 0; cnt < ubNumberOfVehicles; cnt++) {
      // Load if the vehicle spot is valid
      uiNumBytesRead = FileRead(hFile, addressof(pVehicleList[cnt].fValid), sizeof(BOOLEAN));
      if (uiNumBytesRead != sizeof(BOOLEAN)) {
        return false;
      }

      if (pVehicleList[cnt].fValid) {
        // load the vehicle info
        uiNumBytesRead = FileRead(hFile, addressof(pVehicleList[cnt]), sizeof(VEHICLETYPE));
        if (uiNumBytesRead != sizeof(VEHICLETYPE)) {
          return false;
        }

        //
        // Build the passenger list
        //

        // loop through all the passengers
        for (ubPassengerCnt = 0; ubPassengerCnt < 10; ubPassengerCnt++) {
          if (uiSavedGameVersion < 86) {
            if (pVehicleList[cnt].pPassengers[ubPassengerCnt] != 0) {
              // ! The id of the soldier was saved in the passenger pointer.  The passenger pointer is converted back
              // ! to a UINT8 so we can get the REAL pointer to the soldier.
              pVehicleList[cnt].pPassengers[ubPassengerCnt] = FindSoldierByProfileID(pVehicleList[cnt].pPassengers[ubPassengerCnt], false);
            }
          } else {
            if (pVehicleList[cnt].pPassengers[ubPassengerCnt] != NO_PROFILE) {
              // ! The id of the soldier was saved in the passenger pointer.  The passenger pointer is converted back
              // ! to a UINT8 so we can get the REAL pointer to the soldier.
              pVehicleList[cnt].pPassengers[ubPassengerCnt] = FindSoldierByProfileID(pVehicleList[cnt].pPassengers[ubPassengerCnt], false);
            } else {
              pVehicleList[cnt].pPassengers[ubPassengerCnt] = null;
            }
          }
        }

        // Load the number of nodes
        uiNumBytesRead = FileRead(hFile, addressof(uiTotalNodeCount), sizeof(UINT32));
        if (uiNumBytesRead != sizeof(UINT32)) {
          return false;
        }

        if (uiTotalNodeCount != 0) {
          pPath = null;

          pVehicleList[cnt].pMercPath = null;

          // loop through each node
          for (uiNodeCount = 0; uiNodeCount < uiTotalNodeCount; uiNodeCount++) {
            // allocate memory to hold the vehicle path
            pTempPath = MemAlloc(sizeof(PathSt));
            if (pTempPath == null)
              return false;
            memset(pTempPath, 0, sizeof(PathSt));

            // Load all the nodes
            uiNumBytesRead = FileRead(hFile, pTempPath, sizeof(PathSt));
            if (uiNumBytesRead != sizeof(PathSt)) {
              return false;
            }

            //
            // Setup the pointer info
            //

            if (pVehicleList[cnt].pMercPath == null)
              pVehicleList[cnt].pMercPath = pTempPath;

            // if there is a previous node
            if (pPath != null) {
              pPath.value.pNext = pTempPath;

              pTempPath.value.pPrev = pPath;
            } else
              pTempPath.value.pPrev = null;

            pTempPath.value.pNext = null;

            pPath = pTempPath;
          }
        } else {
          pVehicleList[cnt].pMercPath = null;
        }
      }
    }
  }
  return true;
}

export function SetVehicleSectorValues(iVehId: INT32, ubSectorX: UINT8, ubSectorY: UINT8): void {
  pVehicleList[iVehId].sSectorX = ubSectorX;
  pVehicleList[iVehId].sSectorY = ubSectorY;

  gMercProfiles[pVehicleList[iVehId].ubProfileID].sSectorX = ubSectorX;
  gMercProfiles[pVehicleList[iVehId].ubProfileID].sSectorY = ubSectorY;
}

export function UpdateAllVehiclePassengersGridNo(pSoldier: SOLDIERTYPE): void {
  let iCounter: INT32;
  let iId: INT32;
  let pPassenger: SOLDIERTYPE;

  // If not a vehicle, ignore!
  if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    return;
  }

  iId = pSoldier.bVehicleID;

  // Loop through passengers and update each guy's position
  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] != null) {
      pPassenger = pVehicleList[iId].pPassengers[iCounter];

      // Set gridno.....
      EVENT_SetSoldierPosition(pPassenger, pSoldier.dXPos, pSoldier.dYPos);
    }
  }
}

function SaveVehicleMovementInfoToSavedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let uiSaveSize: UINT32 = 0;

  // Save all the vehicle movement id's
  uiNumBytesWritten = FileWrite(hFile, gubVehicleMovementGroups, sizeof(INT8) * 5);
  if (uiNumBytesWritten != sizeof(INT8) * 5) {
    return false;
  }

  return true;
}

export function LoadVehicleMovementInfoFromSavedGameFile(hFile: HWFILE): boolean {
  let cnt: INT32;
  let pGroup: Pointer<GROUP> = null;
  let uiNumBytesRead: UINT32 = 0;
  let uiSaveSize: UINT32 = 0;

  // Load in the Squad movement id's
  uiNumBytesRead = FileRead(hFile, gubVehicleMovementGroups, sizeof(INT8) * 5);
  if (uiNumBytesRead != sizeof(INT8) * 5) {
    return false;
  }

  for (cnt = 5; cnt < MAX_VEHICLES; cnt++) {
    // create mvt groups
    gubVehicleMovementGroups[cnt] = CreateNewVehicleGroupDepartingFromSector(1, 1, cnt);

    // Set persistent....
    pGroup = GetGroup(gubVehicleMovementGroups[cnt]);
    pGroup.value.fPersistant = true;
  }

  return true;
}

export function NewSaveVehicleMovementInfoToSavedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let uiSaveSize: UINT32 = 0;

  // Save all the vehicle movement id's
  uiNumBytesWritten = FileWrite(hFile, gubVehicleMovementGroups, sizeof(INT8) * MAX_VEHICLES);
  if (uiNumBytesWritten != sizeof(INT8) * MAX_VEHICLES) {
    return false;
  }

  return true;
}

export function NewLoadVehicleMovementInfoFromSavedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let uiSaveSize: UINT32 = 0;

  // Load in the Squad movement id's
  uiNumBytesRead = FileRead(hFile, gubVehicleMovementGroups, sizeof(INT8) * MAX_VEHICLES);
  if (uiNumBytesRead != sizeof(INT8) * MAX_VEHICLES) {
    return false;
  }

  return true;
}

export function OKUseVehicle(ubProfile: UINT8): boolean {
  if (ubProfile == Enum268.PROF_HUMMER) {
    return CheckFact(Enum170.FACT_OK_USE_HUMMER, NO_PROFILE);
  } else if (ubProfile == Enum268.PROF_ICECREAM) {
    return CheckFact(Enum170.FACT_OK_USE_ICECREAM, NO_PROFILE);
  } else if (ubProfile == Enum268.PROF_HELICOPTER) {
    // don't allow mercs to get inside vehicle if it's grounded (enemy controlled, Skyrider owed money, etc.)
    return CanHelicopterFly();
  } else {
    return true;
  }
}

function TeleportVehicleToItsClosestSector(iVehicleId: INT32, ubGroupID: UINT8): void {
  let pGroup: GROUP;
  let uiTimeToNextSector: UINT32;
  let uiTimeToLastSector: UINT32;
  let sPrevX: INT16;
  let sPrevY: INT16;
  let sNextX: INT16;
  let sNextY: INT16;

  pGroup = GetGroup(ubGroupID);
  Assert(pGroup);

  Assert(pGroup.uiTraverseTime != -1);
  Assert((pGroup.uiTraverseTime > 0) && (pGroup.uiTraverseTime != 0xffffffff));

  Assert(pGroup.uiArrivalTime >= GetWorldTotalMin());
  uiTimeToNextSector = pGroup.uiArrivalTime - GetWorldTotalMin();

  Assert(pGroup.uiTraverseTime >= uiTimeToNextSector);
  uiTimeToLastSector = pGroup.uiTraverseTime - uiTimeToNextSector;

  if (uiTimeToNextSector >= uiTimeToLastSector) {
    // go to the last sector
    sPrevX = pGroup.ubNextX;
    sPrevY = pGroup.ubNextY;

    sNextX = pGroup.ubSectorX;
    sNextY = pGroup.ubSectorY;
  } else {
    // go to the next sector
    sPrevX = pGroup.ubSectorX;
    sPrevY = pGroup.ubSectorY;

    sNextX = pGroup.ubNextX;
    sNextY = pGroup.ubNextY;
  }

  // make it arrive immediately, not eventually (it's driverless)
  SetGroupArrivalTime(pGroup, GetWorldTotalMin());

  // change where it is and where it's going, then make it arrive there.  Don't check for battle
  PlaceGroupInSector(ubGroupID, sPrevX, sPrevY, sNextX, sNextY, 0, false);
}

export function AddVehicleFuelToSave(): void {
  let iCounter: INT32;
  let pVehicleSoldier: SOLDIERTYPE;

  for (iCounter = 0; iCounter < ubNumberOfVehicles; iCounter++) {
    // might have an empty slot
    if (pVehicleList[iCounter].fValid) {
      // get the vehicle soldiertype
      pVehicleSoldier = GetSoldierStructureForVehicle(iCounter);

      if (pVehicleSoldier) {
        // Init fuel!
        pVehicleSoldier.sBreathRed = 10000;
        pVehicleSoldier.bBreath = 100;
      }
    }
  }
}

function CanSoldierDriveVehicle(pSoldier: SOLDIERTYPE, iVehicleId: INT32, fIgnoreAsleep: boolean): boolean {
  Assert(pSoldier);

  if (pSoldier.bAssignment != Enum117.VEHICLE) {
    // not in a vehicle!
    return false;
  }

  if (pSoldier.iVehicleId != iVehicleId) {
    // not in THIS vehicle!
    return false;
  }

  if (iVehicleId == iHelicopterVehicleId) {
    // only Skyrider can pilot the helicopter
    return false;
  }

  if (!fIgnoreAsleep && (pSoldier.fMercAsleep == true)) {
    // asleep!
    return false;
  }

  if ((pSoldier.uiStatusFlags & SOLDIER_VEHICLE) || AM_A_ROBOT(pSoldier) || AM_AN_EPC(pSoldier)) {
    // vehicles, robot, and EPCs can't drive!
    return false;
  }

  // too wounded to drive
  if (pSoldier.bLife < OKLIFE) {
    return false;
  }

  // too tired to drive
  if (pSoldier.bBreathMax <= BREATHMAX_ABSOLUTE_MINIMUM) {
    return false;
  }

  // yup, he could drive this vehicle
  return true;
}

export function SoldierMustDriveVehicle(pSoldier: SOLDIERTYPE, iVehicleId: INT32, fTryingToTravel: boolean): boolean {
  Assert(pSoldier);

  // error check
  if ((iVehicleId >= ubNumberOfVehicles) || (iVehicleId < 0)) {
    return false;
  }

  // if vehicle is not going anywhere, then nobody has to be driving it!
  // need the path length check in case we're doing a test while actually in a sector even though we're moving!
  if (!fTryingToTravel && (!pVehicleList[iVehicleId].fBetweenSectors) && (GetLengthOfPath(pVehicleList[iVehicleId].pMercPath) == 0)) {
    return false;
  }

  // if he CAN drive it (don't care if he is currently asleep)
  if (CanSoldierDriveVehicle(pSoldier, iVehicleId, true)) {
    // and he's the ONLY one aboard who can do so
    if (OnlyThisSoldierCanDriveVehicle(pSoldier, iVehicleId)) {
      return true;
    }
    // (if there are multiple possible drivers, than the assumption is that this guy ISN'T driving, so he CAN sleep)
  }

  return false;
}

function OnlyThisSoldierCanDriveVehicle(pThisSoldier: SOLDIERTYPE, iVehicleId: INT32): boolean {
  let iCounter: INT32 = 0;
  let pSoldier: SOLDIERTYPE;

  for (iCounter = gTacticalStatus.Team[OUR_TEAM].bFirstID; iCounter <= gTacticalStatus.Team[OUR_TEAM].bLastID; iCounter++) {
    // get the current soldier
    pSoldier = Menptr[iCounter];

    // skip checking THIS soldier, we wanna know about everyone else
    if (pSoldier == pThisSoldier) {
      continue;
    }

    if (pSoldier.bActive) {
      // don't count mercs who are asleep here
      if (CanSoldierDriveVehicle(pSoldier, iVehicleId, false)) {
        // this guy can drive it, too
        return false;
      }
    }
  }

  // you're da man!
  return true;
}

export function IsSoldierInThisVehicleSquad(pSoldier: SOLDIERTYPE, bSquadNumber: INT8): boolean {
  let iVehicleId: INT32;
  let pVehicleSoldier: SOLDIERTYPE;

  Assert(pSoldier);
  Assert((bSquadNumber >= 0) && (bSquadNumber < Enum275.NUMBER_OF_SQUADS));

  // not in a vehicle?
  if (pSoldier.bAssignment != Enum117.VEHICLE) {
    return false;
  }

  // get vehicle ID
  iVehicleId = pSoldier.iVehicleId;

  // if in helicopter
  if (iVehicleId == iHelicopterVehicleId) {
    // they don't get a squad #
    return false;
  }

  pVehicleSoldier = GetSoldierStructureForVehicle(iVehicleId);
  Assert(pVehicleSoldier);

  // check squad vehicle is on
  if (pVehicleSoldier.bAssignment != bSquadNumber) {
    return false;
  }

  // yes, he's in a vehicle assigned to this squad
  return true;
}

export function PickRandomPassengerFromVehicle(pSoldier: SOLDIERTYPE): SOLDIERTYPE | null {
  let ubMercsInSector: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let iCounter: INT32;
  let iId: INT32;

  // If not a vehicle, ignore!
  if (!(pSoldier.uiStatusFlags & SOLDIER_VEHICLE)) {
    return null;
  }

  iId = pSoldier.bVehicleID;

  // Loop through passengers and update each guy's position
  for (iCounter = 0; iCounter < iSeatingCapacities[pVehicleList[iId].ubVehicleType]; iCounter++) {
    if (pVehicleList[iId].pPassengers[iCounter] != null) {
      ubMercsInSector[ubNumMercs] = iCounter;
      ubNumMercs++;
    }
  }

  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    // If we are air raid, AND red exists somewhere...
    return pVehicleList[iId].pPassengers[ubChosenMerc];
  }

  return null;
}

function DoesVehicleHaveAnyPassengers(iVehicleID: INT32): boolean {
  if (!GetNumberInVehicle(iVehicleID)) {
    return false;
  }
  return true;
}

export function DoesVehicleGroupHaveAnyPassengers(pGroup: GROUP): boolean {
  let iVehicleID: INT32;

  iVehicleID = GivenMvtGroupIdFindVehicleId(pGroup.ubGroupID);
  if (iVehicleID == -1) {
    return false;
  }

  return DoesVehicleHaveAnyPassengers(iVehicleID);
}

}
