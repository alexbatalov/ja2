// the delay for a group about to arrive
const ABOUT_TO_ARRIVE_DELAY = 5;

let gpGroupList: Pointer<GROUP>;

let gpPendingSimultaneousGroup: Pointer<GROUP> = NULL;

let gfDelayAutoResolveStart: BOOLEAN = FALSE;

let gfRandomizingPatrolGroup: BOOLEAN = FALSE;

let gubNumGroupsArrivedSimultaneously: UINT8 = 0;

// Doesn't require text localization.  This is for debug strings only.
let gszTerrain: UINT8[][] /* [NUM_TRAVTERRAIN_TYPES][15] */ = [
  "TOWN",
  "ROAD",
  "PLAINS",
  "SAND",
  "SPARSE",
  "DENSE",
  "SWAMP",
  "WATER",
  "HILLS",
  "GROUNDBARRIER",
  "NS_RIVER",
  "EW_RIVER",
  "EDGEOFWORLD",
];

let gfUndergroundTacticalTraversal: BOOLEAN = FALSE;

// remembers which player group is the Continue/Stop prompt about?  No need to save as long as you can't save while prompt ON
let gpGroupPrompting: Pointer<GROUP> = NULL;

let uniqueIDMask: UINT32[] /* [8] */ = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];

// Internal function manipulation prototypes

let gpInitPrebattleGroup: Pointer<GROUP> = NULL;

// waiting for input from user
let gfWaitingForInput: BOOLEAN = FALSE;

// Player grouping functions
//.........................
// Creates a new player group, returning the unique ID of that group.  This is the first
// step before adding waypoints and members to the player group.
function CreateNewPlayerGroupDepartingFromSector(ubSectorX: UINT8, ubSectorY: UINT8): UINT8 {
  let pNew: Pointer<GROUP>;
  AssertMsg(ubSectorX >= 1 && ubSectorX <= 16, String("CreateNewPlayerGroup with out of range sectorX value of %d", ubSectorX));
  AssertMsg(ubSectorY >= 1 && ubSectorY <= 16, String("CreateNewPlayerGroup with out of range sectorY value of %d", ubSectorY));
  pNew = MemAlloc(sizeof(GROUP));
  AssertMsg(pNew, "MemAlloc failure during CreateNewPlayerGroup.");
  memset(pNew, 0, sizeof(GROUP));
  pNew.value.pPlayerList = NULL;
  pNew.value.pWaypoints = NULL;
  pNew.value.ubSectorX = pNew.value.ubNextX = ubSectorX;
  pNew.value.ubSectorY = pNew.value.ubNextY = ubSectorY;
  pNew.value.ubOriginalSector = SECTOR(ubSectorX, ubSectorY);
  pNew.value.fPlayer = TRUE;
  pNew.value.ubMoveType = ONE_WAY;
  pNew.value.ubNextWaypointID = 0;
  pNew.value.ubFatigueLevel = 100;
  pNew.value.ubRestAtFatigueLevel = 0;
  pNew.value.ubTransportationMask = FOOT;
  pNew.value.fVehicle = FALSE;
  pNew.value.ubCreatedSectorID = pNew.value.ubOriginalSector;
  pNew.value.ubSectorIDOfLastReassignment = 255;

  return AddGroupToList(pNew);
}

function CreateNewVehicleGroupDepartingFromSector(ubSectorX: UINT8, ubSectorY: UINT8, uiUNISEDVehicleId: UINT32): UINT8 {
  let pNew: Pointer<GROUP>;
  AssertMsg(ubSectorX >= 1 && ubSectorX <= 16, String("CreateNewVehicleGroup with out of range sectorX value of %d", ubSectorX));
  AssertMsg(ubSectorY >= 1 && ubSectorY <= 16, String("CreateNewVehicleGroup with out of range sectorY value of %d", ubSectorY));
  pNew = MemAlloc(sizeof(GROUP));
  AssertMsg(pNew, "MemAlloc failure during CreateNewVehicleGroup.");
  memset(pNew, 0, sizeof(GROUP));
  pNew.value.pWaypoints = NULL;
  pNew.value.ubSectorX = pNew.value.ubNextX = ubSectorX;
  pNew.value.ubSectorY = pNew.value.ubNextY = ubSectorY;
  pNew.value.ubOriginalSector = SECTOR(ubSectorX, ubSectorY);
  pNew.value.ubMoveType = ONE_WAY;
  pNew.value.ubNextWaypointID = 0;
  pNew.value.ubFatigueLevel = 100;
  pNew.value.ubRestAtFatigueLevel = 0;
  pNew.value.fVehicle = TRUE;
  pNew.value.fPlayer = TRUE;
  pNew.value.pPlayerList = NULL;
  pNew.value.ubCreatedSectorID = pNew.value.ubOriginalSector;
  pNew.value.ubSectorIDOfLastReassignment = 255;

  // get the type
  pNew.value.ubTransportationMask = CAR;

  return AddGroupToList(pNew);
}

// Allows you to add players to the group.
function AddPlayerToGroup(ubGroupID: UINT8, pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let pGroup: Pointer<GROUP>;
  let pPlayer: Pointer<PLAYERGROUP>;
  let curr: Pointer<PLAYERGROUP>;
  pGroup = GetGroup(ubGroupID);
  Assert(pGroup);
  pPlayer = MemAlloc(sizeof(PLAYERGROUP));
  Assert(pPlayer);
  AssertMsg(pGroup.value.fPlayer, "Attempting AddPlayerToGroup() on an ENEMY group!");
  pPlayer.value.pSoldier = pSoldier;
  pPlayer.value.ubProfileID = pSoldier.value.ubProfile;
  pPlayer.value.ubID = pSoldier.value.ubID;
  pPlayer.value.bFlags = 0;
  pPlayer.value.next = NULL;

  if (!pGroup.value.pPlayerList) {
    pGroup.value.pPlayerList = pPlayer;
    pGroup.value.ubGroupSize = 1;
    pGroup.value.ubPrevX = ((pSoldier.value.ubPrevSectorID % 16) + 1);
    pGroup.value.ubPrevY = ((pSoldier.value.ubPrevSectorID / 16) + 1);
    pGroup.value.ubSectorX = pSoldier.value.sSectorX;
    pGroup.value.ubSectorY = pSoldier.value.sSectorY;
    pGroup.value.ubSectorZ = pSoldier.value.bSectorZ;

    // set group id
    pSoldier.value.ubGroupID = ubGroupID;

    return TRUE;
  } else {
    curr = pGroup.value.pPlayerList;
    pSoldier.value.ubNumTraversalsAllowedToMerge = curr.value.pSoldier.value.ubNumTraversalsAllowedToMerge;
    pSoldier.value.ubDesiredSquadAssignment = curr.value.pSoldier.value.ubDesiredSquadAssignment;
    while (curr.value.next) {
      if (curr.value.ubProfileID == pSoldier.value.ubProfile)
        AssertMsg(0, String("Attempting to add an already existing merc to group (ubProfile=%d).", pSoldier.value.ubProfile));
      curr = curr.value.next;
    }
    curr.value.next = pPlayer;

    // set group id
    pSoldier.value.ubGroupID = ubGroupID;

    pGroup.value.ubGroupSize++;
    return TRUE;
  }
}

// remove all grunts from player mvt grp
function RemoveAllPlayersFromGroup(ubGroupId: UINT8): BOOLEAN {
  let pGroup: Pointer<GROUP>;

  // grab group id
  pGroup = GetGroup(ubGroupId);

  // init errors checks
  AssertMsg(pGroup, String("Attempting to RemovePlayerFromGroup( %d ) from non-existant group", ubGroupId));

  return RemoveAllPlayersFromPGroup(pGroup);
}

function RemoveAllPlayersFromPGroup(pGroup: Pointer<GROUP>): BOOLEAN {
  let curr: Pointer<PLAYERGROUP>;

  AssertMsg(pGroup.value.fPlayer, "Attempting RemovePlayerFromGroup() on an ENEMY group!");

  curr = pGroup.value.pPlayerList;
  while (curr) {
    pGroup.value.pPlayerList = pGroup.value.pPlayerList.value.next;

    curr.value.pSoldier.value.ubPrevSectorID = SECTOR(pGroup.value.ubPrevX, pGroup.value.ubPrevY);
    curr.value.pSoldier.value.ubGroupID = 0;

    MemFree(curr);

    curr = pGroup.value.pPlayerList;
  }
  pGroup.value.ubGroupSize = 0;

  if (!pGroup.value.fPersistant) {
    // remove the empty group
    RemovePGroup(pGroup);
  } else {
    CancelEmptyPersistentGroupMovement(pGroup);
  }

  return TRUE;
}

function RemovePlayerFromPGroup(pGroup: Pointer<GROUP>, pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let prev: Pointer<PLAYERGROUP>;
  let curr: Pointer<PLAYERGROUP>;
  AssertMsg(pGroup.value.fPlayer, "Attempting RemovePlayerFromGroup() on an ENEMY group!");

  curr = pGroup.value.pPlayerList;

  if (!curr) {
    return FALSE;
  }

  if (curr.value.pSoldier == pSoldier) {
    // possibly the only node
    pGroup.value.pPlayerList = pGroup.value.pPlayerList.value.next;

    // delete the node
    MemFree(curr);

    // process info for soldier
    pGroup.value.ubGroupSize--;
    pSoldier.value.ubPrevSectorID = SECTOR(pGroup.value.ubPrevX, pGroup.value.ubPrevY);
    pSoldier.value.ubGroupID = 0;

    // if there's nobody left in the group
    if (pGroup.value.ubGroupSize == 0) {
      if (!pGroup.value.fPersistant) {
        // remove the empty group
        RemovePGroup(pGroup);
      } else {
        CancelEmptyPersistentGroupMovement(pGroup);
      }
    }

    return TRUE;
  }
  prev = NULL;

  while (curr) {
    // definately more than one node

    if (curr.value.pSoldier == pSoldier) {
      // detach and delete the node
      if (prev) {
        prev.value.next = curr.value.next;
      }
      MemFree(curr);

      // process info for soldier
      pSoldier.value.ubGroupID = 0;
      pGroup.value.ubGroupSize--;
      pSoldier.value.ubPrevSectorID = SECTOR(pGroup.value.ubPrevX, pGroup.value.ubPrevY);

      return TRUE;
    }

    prev = curr;
    curr = curr.value.next;
  }

  // !curr
  return FALSE;
}

function RemovePlayerFromGroup(ubGroupID: UINT8, pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let pGroup: Pointer<GROUP>;
  pGroup = GetGroup(ubGroupID);

  // KM : August 6, 1999 Patch fix
  //     Because the release build has no assertions, it was still possible for the group to be null,
  //     causing a crash.  Instead of crashing, it'll simply return false.
  if (!pGroup) {
    return FALSE;
  }
  // end

  AssertMsg(pGroup, String("Attempting to RemovePlayerFromGroup( %d, %d ) from non-existant group", ubGroupID, pSoldier.value.ubProfile));

  return RemovePlayerFromPGroup(pGroup, pSoldier);
}

function GroupReversingDirectionsBetweenSectors(pGroup: Pointer<GROUP>, ubSectorX: UINT8, ubSectorY: UINT8, fBuildingWaypoints: BOOLEAN): BOOLEAN {
  // if we're not between sectors, or we are but we're continuing in the same direction as before
  if (!GroupBetweenSectorsAndSectorXYIsInDifferentDirection(pGroup, ubSectorX, ubSectorY)) {
    // then there's no need to reverse directions
    return FALSE;
  }

  // The new direction is reversed, so we have to go back to the sector we just left.

  // Search for the arrival event, and kill it!
  DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

  // Adjust the information in the group to reflect the new movement.
  pGroup.value.ubPrevX = pGroup.value.ubNextX;
  pGroup.value.ubPrevY = pGroup.value.ubNextY;
  pGroup.value.ubNextX = pGroup.value.ubSectorX;
  pGroup.value.ubNextY = pGroup.value.ubSectorY;
  pGroup.value.ubSectorX = pGroup.value.ubPrevX;
  pGroup.value.ubSectorY = pGroup.value.ubPrevY;

  if (pGroup.value.fPlayer) {
    // ARM: because we've changed the group's ubSectoryX and ubSectorY, we must now also go and change the sSectorX and
    // sSectorY of all the soldiers in this group so that they stay in synch.  Otherwise pathing and movement problems
    // will result since the group is in one place while the merc is in another...
    SetLocationOfAllPlayerSoldiersInGroup(pGroup, pGroup.value.ubSectorX, pGroup.value.ubSectorY, 0);
  }

  // IMPORTANT: The traverse time doesn't change just because we reverse directions!  It takes the same time no matter
  // which direction you're going in!  This becomes critical in case the player reverse directions again before moving!

  // The time it takes to arrive there will be exactly the amount of time we have been moving away from it.
  SetGroupArrivalTime(pGroup, pGroup.value.uiTraverseTime - pGroup.value.uiArrivalTime + GetWorldTotalMin() * 2);

  // if they're not already there
  if (pGroup.value.uiArrivalTime > GetWorldTotalMin()) {
    // Post the replacement event to move back to the previous sector!
    AddStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.uiArrivalTime, pGroup.value.ubGroupID);

    if (pGroup.value.fPlayer) {
      if ((pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY) > GetWorldTotalMin()) {
        // Post the about to arrive event
        AddStrategicEvent(EVENT_GROUP_ABOUT_TO_ARRIVE, pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY, pGroup.value.ubGroupID);
      }
    }
  } else {
    // IMPORTANT: this can't be called during RebuildWayPointsForGroupPath(), since it will clear the mercpath
    // prematurely by assuming the mercs are now at their final destination when only the first waypoint is in place!!!
    // To handle this situation, RebuildWayPointsForGroupPath() will issue it's own call after it's ready for it.
    if (!fBuildingWaypoints) {
      // never really left.  Must set check for battle TRUE in order for HandleNonCombatGroupArrival() to run!
      GroupArrivedAtSector(pGroup.value.ubGroupID, TRUE, TRUE);
    }
  }

  return TRUE;
}

function GroupBetweenSectorsAndSectorXYIsInDifferentDirection(pGroup: Pointer<GROUP>, ubSectorX: UINT8, ubSectorY: UINT8): BOOLEAN {
  let currDX: INT32;
  let currDY: INT32;
  let newDX: INT32;
  let newDY: INT32;
  let ubNumUnalignedAxes: UINT8 = 0;

  if (!pGroup.value.fBetweenSectors)
    return FALSE;

  // Determine the direction the group is currently traveling in
  currDX = pGroup.value.ubNextX - pGroup.value.ubSectorX;
  currDY = pGroup.value.ubNextY - pGroup.value.ubSectorY;

  // Determine the direction the group would need to travel in to reach the given sector
  newDX = ubSectorX - pGroup.value.ubSectorX;
  newDY = ubSectorY - pGroup.value.ubSectorY;

  // clip the new dx/dy values to +/- 1
  if (newDX) {
    ubNumUnalignedAxes++;
    newDX /= abs(newDX);
  }
  if (newDY) {
    ubNumUnalignedAxes++;
    newDY /= abs(newDY);
  }

  // error checking
  if (ubNumUnalignedAxes > 1) {
    AssertMsg(FALSE, String("Checking a diagonal move for direction change, groupID %d. AM-0", pGroup.value.ubGroupID));
    return FALSE;
  }

  // Compare the dx/dy's.  If they're exactly the same, group is travelling in the same direction as before, so we're not
  // changing directions.
  // Note that 90-degree orthogonal changes are considered changing direction, as well as the full 180-degree reversal.
  // That's because the party must return to the previous sector in each of those cases, too.
  if (currDX == newDX && currDY == newDY)
    return FALSE;

  // yes, we're between sectors, and we'd be changing direction to go to the given sector
  return TRUE;
}

// Appends a waypoint to the end of the list.  Waypoint MUST be on the
// same horizontal or vertical level as the last waypoint added.
function AddWaypointToPGroup(pGroup: Pointer<GROUP>, ubSectorX: UINT8, ubSectorY: UINT8): BOOLEAN // Same, but overloaded
{
  let pWay: Pointer<WAYPOINT>;
  let ubNumAlignedAxes: UINT8 = 0;
  let fReversingDirection: BOOLEAN = FALSE;

  AssertMsg(ubSectorX >= 1 && ubSectorX <= 16, String("AddWaypointToPGroup with out of range sectorX value of %d", ubSectorX));
  AssertMsg(ubSectorY >= 1 && ubSectorY <= 16, String("AddWaypointToPGroup with out of range sectorY value of %d", ubSectorY));

  if (!pGroup)
    return FALSE;

  // At this point, we have the group, and a valid coordinate.  Now we must
  // determine that this waypoint will be aligned exclusively to either the x or y axis of
  // the last waypoint in the list.
  pWay = pGroup.value.pWaypoints;
  if (!pWay) {
    if (GroupReversingDirectionsBetweenSectors(pGroup, ubSectorX, ubSectorY, TRUE)) {
      if (pGroup.value.fPlayer) {
        // because we reversed, we must add the new current sector back at the head of everyone's mercpath
        AddSectorToFrontOfMercPathForAllSoldiersInGroup(pGroup, pGroup.value.ubSectorX, pGroup.value.ubSectorY);
      }

      // Very special case that requiring specific coding.  Check out the comments
      // at the above function for more information.
      fReversingDirection = TRUE;
      // ARM:  Kris - new rulez.  Must still fall through and add a waypoint anyway!!!
    } else {
      // No waypoints, so compare against the current location.
      if (pGroup.value.ubSectorX == ubSectorX) {
        ubNumAlignedAxes++;
      }
      if (pGroup.value.ubSectorY == ubSectorY) {
        ubNumAlignedAxes++;
      }
    }
  } else {
    // we do have a waypoint list, so go to the last entry
    while (pWay.value.next) {
      pWay = pWay.value.next;
    }
    // now, we are pointing to the last waypoint in the list
    if (pWay.value.x == ubSectorX) {
      ubNumAlignedAxes++;
    }
    if (pWay.value.y == ubSectorY) {
      ubNumAlignedAxes++;
    }
  }

  if (!fReversingDirection) {
    if (ubNumAlignedAxes == 0) {
      AssertMsg(FALSE, String("Invalid DIAGONAL waypoint being added for groupID %d. AM-0", pGroup.value.ubGroupID));
      return FALSE;
    }

    if (ubNumAlignedAxes >= 2) {
      AssertMsg(FALSE, String("Invalid IDENTICAL waypoint being added for groupID %d. AM-0", pGroup.value.ubGroupID));
      return FALSE;
    }

    // has to be different in exactly 1 axis to be a valid new waypoint
    Assert(ubNumAlignedAxes == 1);
  }

  if (!pWay) {
    // We are adding the first waypoint.
    pGroup.value.pWaypoints = MemAlloc(sizeof(WAYPOINT));
    pWay = pGroup.value.pWaypoints;
  } else {
    // Add the waypoint to the end of the list
    pWay.value.next = MemAlloc(sizeof(WAYPOINT));
    pWay = pWay.value.next;
  }

  AssertMsg(pWay, "Failed to allocate memory for waypoint.");

  // Fill in the information for the new waypoint.
  pWay.value.x = ubSectorX;
  pWay.value.y = ubSectorY;
  pWay.value.next = NULL;

  // IMPORTANT:
  // The first waypoint added actually initiates the group's movement to the next sector.
  if (pWay == pGroup.value.pWaypoints) {
    // don't do this if we have reversed directions!!!  In that case, the required work has already been done back there
    if (!fReversingDirection) {
      // We need to calculate the next sector the group is moving to and post an event for it.
      InitiateGroupMovementToNextSector(pGroup);
    }
  }

  if (pGroup.value.fPlayer) {
    let curr: Pointer<PLAYERGROUP>;
    // Also, nuke any previous "tactical traversal" information.
    curr = pGroup.value.pPlayerList;
    while (curr) {
      curr.value.pSoldier.value.ubStrategicInsertionCode = 0;
      curr = curr.value.next;
    }
  }

  return TRUE;
}

function AddWaypointToGroup(ubGroupID: UINT8, ubSectorX: UINT8, ubSectorY: UINT8): BOOLEAN {
  let pGroup: Pointer<GROUP>;
  pGroup = GetGroup(ubGroupID);
  return AddWaypointToPGroup(pGroup, ubSectorX, ubSectorY);
}

// NOTE: This does NOT expect a strategic sector ID
function AddWaypointIDToGroup(ubGroupID: UINT8, ubSectorID: UINT8): BOOLEAN {
  let pGroup: Pointer<GROUP>;
  pGroup = GetGroup(ubGroupID);
  return AddWaypointIDToPGroup(pGroup, ubSectorID);
}

// NOTE: This does NOT expect a strategic sector ID
function AddWaypointIDToPGroup(pGroup: Pointer<GROUP>, ubSectorID: UINT8): BOOLEAN {
  let ubSectorX: UINT8;
  let ubSectorY: UINT8;
  ubSectorX = SECTORX(ubSectorID);
  ubSectorY = SECTORY(ubSectorID);
  return AddWaypointToPGroup(pGroup, ubSectorX, ubSectorY);
}

function AddWaypointStrategicIDToGroup(ubGroupID: UINT8, uiSectorID: UINT32): BOOLEAN {
  let pGroup: Pointer<GROUP>;
  pGroup = GetGroup(ubGroupID);
  return AddWaypointStrategicIDToPGroup(pGroup, uiSectorID);
}

function AddWaypointStrategicIDToPGroup(pGroup: Pointer<GROUP>, uiSectorID: UINT32): BOOLEAN {
  let ubSectorX: UINT8;
  let ubSectorY: UINT8;
  ubSectorX = GET_X_FROM_STRATEGIC_INDEX(uiSectorID);
  ubSectorY = GET_Y_FROM_STRATEGIC_INDEX(uiSectorID);
  return AddWaypointToPGroup(pGroup, ubSectorX, ubSectorY);
}

// Enemy grouping functions -- private use by the strategic AI.
//............................................................
function CreateNewEnemyGroupDepartingFromSector(uiSector: UINT32, ubNumAdmins: UINT8, ubNumTroops: UINT8, ubNumElites: UINT8): Pointer<GROUP> {
  let pNew: Pointer<GROUP>;
  AssertMsg(uiSector >= 0 && uiSector <= 255, String("CreateNewEnemyGroup with out of range value of %d", uiSector));
  pNew = MemAlloc(sizeof(GROUP));
  AssertMsg(pNew, "MemAlloc failure during CreateNewEnemyGroup.");
  memset(pNew, 0, sizeof(GROUP));
  pNew.value.pEnemyGroup = MemAlloc(sizeof(ENEMYGROUP));
  AssertMsg(pNew.value.pEnemyGroup, "MemAlloc failure during enemy group creation.");
  memset(pNew.value.pEnemyGroup, 0, sizeof(ENEMYGROUP));
  pNew.value.pWaypoints = NULL;
  pNew.value.ubSectorX = SECTORX(uiSector);
  pNew.value.ubSectorY = SECTORY(uiSector);
  pNew.value.ubOriginalSector = uiSector;
  pNew.value.fPlayer = FALSE;
  pNew.value.ubMoveType = CIRCULAR;
  pNew.value.ubNextWaypointID = 0;
  pNew.value.ubFatigueLevel = 100;
  pNew.value.ubRestAtFatigueLevel = 0;
  pNew.value.pEnemyGroup.value.ubNumAdmins = ubNumAdmins;
  pNew.value.pEnemyGroup.value.ubNumTroops = ubNumTroops;
  pNew.value.pEnemyGroup.value.ubNumElites = ubNumElites;
  pNew.value.ubGroupSize = (ubNumTroops + ubNumElites);
  pNew.value.ubTransportationMask = FOOT;
  pNew.value.fVehicle = FALSE;
  pNew.value.ubCreatedSectorID = pNew.value.ubOriginalSector;
  pNew.value.ubSectorIDOfLastReassignment = 255;

  if (AddGroupToList(pNew))
    return pNew;
  return NULL;
}

// INTERNAL LIST MANIPULATION FUNCTIONS

// When adding any new group to the list, this is what must be done:
// 1)  Find the first unused ID (unique)
// 2)  Assign that ID to the new group
// 3)  Insert the group at the end of the list.
function AddGroupToList(pGroup: Pointer<GROUP>): UINT8 {
  let curr: Pointer<GROUP>;
  let bit: UINT32;
  let index: UINT32;
  let mask: UINT32;
  let ID: UINT8 = 0;
  // First, find a unique ID
  while (++ID) {
    index = ID / 32;
    bit = ID % 32;
    mask = 1 << bit;
    if (!(uniqueIDMask[index] & mask)) {
      // found a free ID
      pGroup.value.ubGroupID = ID;
      uniqueIDMask[index] += mask;
      // add group to list now.
      curr = gpGroupList;
      if (curr) {
        // point to the last item in list.
        while (curr.value.next)
          curr = curr.value.next;
        curr.value.next = pGroup;
      } else // new list
        gpGroupList = pGroup;
      pGroup.value.next = NULL;
      return ID;
    }
  }
  return FALSE;
}

function RemoveGroupIdFromList(ubId: UINT8): void {
  let pGroup: Pointer<GROUP>;

  if (ubId == 0) {
    // no group, leave
    return;
  }

  // get group
  pGroup = GetGroup(ubId);

  // is there in fact a group?
  Assert(pGroup);

  // now remove this group
  RemoveGroupFromList(pGroup);
}
// Destroys the waypoint list, detaches group from list, then deallocated the memory for the group
function RemoveGroupFromList(pGroup: Pointer<GROUP>): void {
  let curr: Pointer<GROUP>;
  let temp: Pointer<GROUP>;
  curr = gpGroupList;
  if (!curr)
    return;
  if (curr == pGroup) {
    // Removing head
    gpGroupList = curr.value.next;
  } else
    while (curr.value.next) {
      // traverse the list
      if (curr.value.next == pGroup) {
        // the next node is the one we want to remove
        temp = curr;
        // curr now points to the nod we want to remove
        curr = curr.value.next;
        // detach the node from the list
        temp.value.next = curr.value.next;
        break;
      }
      curr = curr.value.next;
    }

  if (curr == pGroup) {
    // we found the group, so now remove it.
    let bit: UINT32;
    let index: UINT32;
    let mask: UINT32;

    // clear the unique group ID
    index = pGroup.value.ubGroupID / 32;
    bit = pGroup.value.ubGroupID % 32;
    mask = 1 << bit;

    if (!(uniqueIDMask[index] & mask)) {
      mask = mask;
    }

    uniqueIDMask[index] -= mask;

    MemFree(curr);
    curr = NULL;
  }
}

function GetGroup(ubGroupID: UINT8): Pointer<GROUP> {
  let curr: Pointer<GROUP>;
  curr = gpGroupList;
  while (curr) {
    if (curr.value.ubGroupID == ubGroupID)
      return curr;
    curr = curr.value.next;
  }
  return NULL;
}

function HandleImportantPBIQuote(pSoldier: Pointer<SOLDIERTYPE>, pInitiatingBattleGroup: Pointer<GROUP>): void {
  // wake merc up for THIS quote
  if (pSoldier.value.fMercAsleep) {
    TacticalCharacterDialogueWithSpecialEvent(pSoldier, QUOTE_ENEMY_PRESENCE, DIALOGUE_SPECIAL_EVENT_SLEEP, 0, 0);
    TacticalCharacterDialogueWithSpecialEvent(pSoldier, QUOTE_ENEMY_PRESENCE, DIALOGUE_SPECIAL_EVENT_BEGINPREBATTLEINTERFACE, pInitiatingBattleGroup, 0);
    TacticalCharacterDialogueWithSpecialEvent(pSoldier, QUOTE_ENEMY_PRESENCE, DIALOGUE_SPECIAL_EVENT_SLEEP, 1, 0);
  } else {
    TacticalCharacterDialogueWithSpecialEvent(pSoldier, QUOTE_ENEMY_PRESENCE, DIALOGUE_SPECIAL_EVENT_BEGINPREBATTLEINTERFACE, pInitiatingBattleGroup, 0);
  }
}

// If this is called, we are setting the game up to bring up the prebattle interface.  Before doing so,
// one of the involved mercs will pipe up.  When he is finished, we automatically go into the mapscreen,
// regardless of the mode we are in.
function PrepareForPreBattleInterface(pPlayerDialogGroup: Pointer<GROUP>, pInitiatingBattleGroup: Pointer<GROUP>): void {
  // ATE; Changed alogrithm here...
  // We first loop through the group and save ubID's ov valid guys to talk....
  // ( Can't if sleeping, unconscious, and EPC, etc....
  let ubMercsInGroup: UINT8[] /* [20] */ = [ 0 ];
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pPlayer: Pointer<PLAYERGROUP>;

  if (fDisableMapInterfaceDueToBattle) {
    AssertMsg(0, "fDisableMapInterfaceDueToBattle is set before attempting to bring up PBI.  Please send PRIOR save if possible and details on anything that just happened before this battle.");
    return;
  }

  // Pipe up with quote...
  AssertMsg(pPlayerDialogGroup, "Didn't get a player dialog group for prebattle interface.");

  pPlayer = pPlayerDialogGroup.value.pPlayerList;
  AssertMsg(pPlayer, String("Player group %d doesn't have *any* players in it!  (Finding dialog group)", pPlayerDialogGroup.value.ubGroupID));

  while (pPlayer != NULL) {
    pSoldier = pPlayer.value.pSoldier;

    if (pSoldier.value.bLife >= OKLIFE && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !AM_A_ROBOT(pSoldier) && !AM_AN_EPC(pSoldier)) {
      ubMercsInGroup[ubNumMercs] = pSoldier.value.ubID;
      ubNumMercs++;
    }

    pPlayer = pPlayer.value.next;
  }

  // Set music
  SetMusicMode(MUSIC_TACTICAL_ENEMYPRESENT);

  if (gfTacticalTraversal && pInitiatingBattleGroup == gpTacticalTraversalGroup || pInitiatingBattleGroup && !pInitiatingBattleGroup.value.fPlayer && pInitiatingBattleGroup.value.ubSectorX == gWorldSectorX && pInitiatingBattleGroup.value.ubSectorY == gWorldSectorY && !gbWorldSectorZ) {
    // At least say quote....
    if (ubNumMercs > 0) {
      if (pPlayerDialogGroup.value.uiFlags & GROUPFLAG_JUST_RETREATED_FROM_BATTLE) {
        gfCantRetreatInPBI = TRUE;
      }

      ubChosenMerc = Random(ubNumMercs);

      pSoldier = MercPtrs[ubMercsInGroup[ubChosenMerc]];
      gpTacticalTraversalChosenSoldier = pSoldier;

      if (!gfTacticalTraversal) {
        HandleImportantPBIQuote(pSoldier, pInitiatingBattleGroup);
      }

      InterruptTime();
      PauseGame();
      LockPauseState(11);

      if (!gfTacticalTraversal)
        fDisableMapInterfaceDueToBattle = TRUE;
    }
    return;
  }

  // Randomly pick a valid merc from the list we have created!
  if (ubNumMercs > 0) {
    if (pPlayerDialogGroup.value.uiFlags & GROUPFLAG_JUST_RETREATED_FROM_BATTLE) {
      gfCantRetreatInPBI = TRUE;
    }

    ubChosenMerc = Random(ubNumMercs);

    pSoldier = MercPtrs[ubMercsInGroup[ubChosenMerc]];

    HandleImportantPBIQuote(pSoldier, pInitiatingBattleGroup);
    InterruptTime();
    PauseGame();
    LockPauseState(12);

    // disable exit from mapscreen and what not until face done talking
    fDisableMapInterfaceDueToBattle = TRUE;
  } else {
    // ATE: What if we have unconscious guys, etc....
    // We MUST start combat, but donot play quote...
    InitPreBattleInterface(pInitiatingBattleGroup, TRUE);
  }
}

function CheckConditionsForBattle(pGroup: Pointer<GROUP>): BOOLEAN {
  let curr: Pointer<GROUP>;
  let pPlayerDialogGroup: Pointer<GROUP> = NULL;
  let pPlayer: Pointer<PLAYERGROUP>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fBattlePending: BOOLEAN = FALSE;
  let fPossibleQueuedBattle: BOOLEAN = FALSE;
  let fAliveMerc: BOOLEAN = FALSE;
  let fMilitiaPresent: BOOLEAN = FALSE;
  let fCombatAbleMerc: BOOLEAN = FALSE;
  let fBloodCatAmbush: BOOLEAN = FALSE;

  if (gfWorldLoaded) {
    // look for people arriving in the currently loaded sector.  This handles reinforcements.
    curr = FindMovementGroupInSector(gWorldSectorX, gWorldSectorY, TRUE);
    if (!gbWorldSectorZ && PlayerMercsInSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ) && pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && curr) {
      // Reinforcements have arrived!
      if (gTacticalStatus.fEnemyInSector) {
        HandleArrivalOfReinforcements(pGroup);
        return TRUE;
      }
    }
  }

  if (!DidGameJustStart()) {
    gubEnemyEncounterCode = NO_ENCOUNTER_CODE;
  }

  HandleOtherGroupsArrivingSimultaneously(pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ);

  curr = gpGroupList;
  while (curr) {
    if (curr.value.fPlayer && curr.value.ubGroupSize) {
      if (!curr.value.fBetweenSectors) {
        if (curr.value.ubSectorX == pGroup.value.ubSectorX && curr.value.ubSectorY == pGroup.value.ubSectorY && !curr.value.ubSectorZ) {
          if (!GroupHasInTransitDeadOrPOWMercs(curr) && (!IsGroupTheHelicopterGroup(curr) || !fHelicopterIsAirBorne) && (!curr.value.fVehicle || NumberMercsInVehicleGroup(curr))) {
            // Now, a player group is in this sector.  Determine if the group contains any mercs that can fight.
            // Vehicles, EPCs and the robot doesn't count.  Mercs below OKLIFE do.
            pPlayer = curr.value.pPlayerList;
            while (pPlayer) {
              pSoldier = pPlayer.value.pSoldier;
              if (!(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
                if (!AM_A_ROBOT(pSoldier) && !AM_AN_EPC(pSoldier) && pSoldier.value.bLife >= OKLIFE) {
                  fCombatAbleMerc = TRUE;
                }
                if (pSoldier.value.bLife > 0) {
                  fAliveMerc = TRUE;
                }
              }
              pPlayer = pPlayer.value.next;
            }
            if (!pPlayerDialogGroup && fCombatAbleMerc) {
              pPlayerDialogGroup = curr;
            }
            if (fCombatAbleMerc) {
              break;
            }
          }
        }
      }
    }
    curr = curr.value.next;
  }

  if (pGroup.value.fPlayer) {
    pPlayerDialogGroup = pGroup;

    if (NumEnemiesInSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY)) {
      fBattlePending = TRUE;
    }

    if (pGroup.value.uiFlags & GROUPFLAG_HIGH_POTENTIAL_FOR_AMBUSH && fBattlePending) {
      // This group has just arrived in a new sector from an adjacent sector that he retreated from
      // If this battle is an encounter type battle, then there is a 90% chance that the battle will
      // become an ambush scenario.
      gfHighPotentialForAmbush = TRUE;
    }

    // If there are bloodcats in this sector, then it internally checks and handles it
    if (TestForBloodcatAmbush(pGroup)) {
      fBloodCatAmbush = TRUE;
      fBattlePending = TRUE;
    }

    if (fBattlePending && (!fBloodCatAmbush || gubEnemyEncounterCode == ENTERING_BLOODCAT_LAIR_CODE)) {
      if (PossibleToCoordinateSimultaneousGroupArrivals(pGroup)) {
        return FALSE;
      }
    }
  } else {
    if (CountAllMilitiaInSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY)) {
      fMilitiaPresent = TRUE;
      fBattlePending = TRUE;
    }
    if (fAliveMerc) {
      fBattlePending = TRUE;
    }
  }

  if (!fAliveMerc && !fMilitiaPresent) {
    // empty vehicle, everyone dead, don't care.  Enemies don't care.
    return FALSE;
  }

  if (fBattlePending) {
    // A battle is pending, but the player's could be all unconcious or dead.
// Go through every group until we find at least one concious merc.  The looping will determine
// if there are any live mercs and/or concious ones.  If there are no concious mercs, but alive ones,
// then we will go straight to autoresolve, where the enemy will likely annihilate them or capture them.
// If there are no alive mercs, then there is nothing anybody can do.  The enemy will completely ignore
// this, and continue on.

    if (gubNumGroupsArrivedSimultaneously) {
      // Because this is a battle case, clear all the group flags
      curr = gpGroupList;
      while (curr && gubNumGroupsArrivedSimultaneously) {
        if (curr.value.uiFlags & GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY) {
          curr.value.uiFlags &= ~GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY;
          gubNumGroupsArrivedSimultaneously--;
        }
        curr = curr.value.next;
      }
    }

    gpInitPrebattleGroup = pGroup;

    if (gubEnemyEncounterCode == BLOODCAT_AMBUSH_CODE || gubEnemyEncounterCode == ENTERING_BLOODCAT_LAIR_CODE) {
      NotifyPlayerOfBloodcatBattle(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
      return TRUE;
    }

    if (!fCombatAbleMerc) {
      // Prepare for instant autoresolve.
      gfDelayAutoResolveStart = TRUE;
      gfUsePersistantPBI = TRUE;
      if (fMilitiaPresent) {
        NotifyPlayerOfInvasionByEnemyForces(pGroup.value.ubSectorX, pGroup.value.ubSectorY, 0, TriggerPrebattleInterface);
      } else {
        let str: UINT16[] /* [256] */;
        let pSectorStr: UINT16[] /* [128] */;
        GetSectorIDString(pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ, pSectorStr, TRUE);
        swprintf(str, gpStrategicString[STR_DIALOG_ENEMIES_ATTACK_UNCONCIOUSMERCS], pSectorStr);
        DoScreenIndependantMessageBox(str, MSG_BOX_FLAG_OK, TriggerPrebattleInterface);
      }
    }

    if (pPlayerDialogGroup) {
      PrepareForPreBattleInterface(pPlayerDialogGroup, pGroup);
    }
    return TRUE;
  }
  return FALSE;
}

function TriggerPrebattleInterface(ubResult: UINT8): void {
  StopTimeCompression();
  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_TRIGGERPREBATTLEINTERFACE, gpInitPrebattleGroup, 0, 0, 0, 0);
  gpInitPrebattleGroup = NULL;
}

function DeployGroupToSector(pGroup: Pointer<GROUP>): void {
  Assert(pGroup);
  if (pGroup.value.fPlayer) {
    // Update the sector positions of the players...
    return;
  }
  // Assuming enemy code from here on...
}

// This will get called after a battle is auto-resolved or automatically after arriving
// at the next sector during a move and the area is clear.
function CalculateNextMoveIntention(pGroup: Pointer<GROUP>): void {
  let i: INT32;
  let wp: Pointer<WAYPOINT>;

  Assert(pGroup);

  // TEMP:  Ignore resting...

  // Should be surely an enemy group that has just made a new decision to go elsewhere!
  if (pGroup.value.fBetweenSectors) {
    return;
  }

  if (!pGroup.value.pWaypoints) {
    return;
  }

  // If the waypoints have been cancelled, then stop moving.
  /*
  if( pGroup->fWaypointsCancelled )
  {
          DeployGroupToSector( pGroup );
          return;
  }
  */

  // Determine if we are at a waypoint.
  i = pGroup.value.ubNextWaypointID;
  wp = pGroup.value.pWaypoints;
  while (i--) {
    // Traverse through the waypoint list to the next waypoint ID
    Assert(wp);
    wp = wp.value.next;
  }
  Assert(wp);

  // We have the next waypoint, now check if we are actually there.
  if (pGroup.value.ubSectorX == wp.value.x && pGroup.value.ubSectorY == wp.value.y) {
    // We have reached the next waypoint, so now determine what the next waypoint is.
    switch (pGroup.value.ubMoveType) {
      case ONE_WAY:
        if (!wp.value.next) {
          // No more waypoints, so we've reached the destination.
          DeployGroupToSector(pGroup);
          return;
        }
        // Advance destination to next waypoint ID
        pGroup.value.ubNextWaypointID++;
        break;
      case CIRCULAR:
        wp = wp.value.next;
        if (!wp) {
          // reached the end of the patrol route.  Set to the first waypoint in list, indefinately.
          // NOTE:  If the last waypoint isn't exclusively aligned to the x or y axis of the first
          //			 waypoint, there will be an assertion failure inside the waypoint movement code.
          pGroup.value.ubNextWaypointID = 0;
        } else
          pGroup.value.ubNextWaypointID++;
        break;
      case ENDTOEND_FORWARDS:
        wp = wp.value.next;
        if (!wp) {
          AssertMsg(pGroup.value.ubNextWaypointID, "EndToEnd patrol group needs more than one waypoint!");
          pGroup.value.ubNextWaypointID--;
          pGroup.value.ubMoveType = ENDTOEND_BACKWARDS;
        } else
          pGroup.value.ubNextWaypointID++;
        break;
      case ENDTOEND_BACKWARDS:
        if (!pGroup.value.ubNextWaypointID) {
          pGroup.value.ubNextWaypointID++;
          pGroup.value.ubMoveType = ENDTOEND_FORWARDS;
        } else
          pGroup.value.ubNextWaypointID--;
        break;
    }
  }
  InitiateGroupMovementToNextSector(pGroup);
}

function AttemptToMergeSeparatedGroups(pGroup: Pointer<GROUP>, fDecrementTraversals: BOOLEAN): BOOLEAN {
  let curr: Pointer<GROUP> = NULL;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let pCharacter: Pointer<SOLDIERTYPE> = NULL;
  let pPlayer: Pointer<PLAYERGROUP> = NULL;
  let fSuccess: BOOLEAN = FALSE;
  return FALSE;
}

function AwardExperienceForTravelling(pGroup: Pointer<GROUP>): void {
  // based on how long movement took, mercs gain a bit of life experience for travelling
  let pPlayerGroup: Pointer<PLAYERGROUP>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiPoints: UINT32;
  let uiCarriedPercent: UINT32;

  if (!pGroup || !pGroup.value.fPlayer) {
    return;
  }

  pPlayerGroup = pGroup.value.pPlayerList;
  while (pPlayerGroup) {
    pSoldier = pPlayerGroup.value.pSoldier;
    if (pSoldier && !AM_A_ROBOT(pSoldier) && !AM_AN_EPC(pSoldier) && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
      if (pSoldier.value.bLifeMax < 100) {
        // award exp...
        // amount was originally based on getting 100-bLifeMax points for 12 hours of travel (720)
        // but changed to flat rate since StatChange makes roll vs 100-lifemax as well!
        uiPoints = pGroup.value.uiTraverseTime / (450 / 100 - pSoldier.value.bLifeMax);
        if (uiPoints > 0) {
          StatChange(pSoldier, HEALTHAMT, uiPoints, FALSE);
        }
      }

      if (pSoldier.value.bStrength < 100) {
        uiCarriedPercent = CalculateCarriedWeight(pSoldier);
        if (uiCarriedPercent > 50) {
          uiPoints = pGroup.value.uiTraverseTime / (450 / (100 - pSoldier.value.bStrength));
          StatChange(pSoldier, STRAMT, (uiPoints * (uiCarriedPercent - 50) / 100), FALSE);
        }
      }
    }
    pPlayerGroup = pPlayerGroup.value.next;
  }
}

function AddCorpsesToBloodcatLair(sSectorX: INT16, sSectorY: INT16): void {
  let Corpse: ROTTING_CORPSE_DEFINITION;
  let sXPos: INT16;
  let sYPos: INT16;

  memset(addressof(Corpse), 0, sizeof(ROTTING_CORPSE_DEFINITION));

  // Setup some values!
  Corpse.ubBodyType = REGMALE;
  Corpse.sHeightAdjustment = 0;
  Corpse.bVisible = TRUE;

  SET_PALETTEREP_ID(Corpse.HeadPal, "BROWNHEAD");
  SET_PALETTEREP_ID(Corpse.VestPal, "YELLOWVEST");
  SET_PALETTEREP_ID(Corpse.SkinPal, "PINKSKIN");
  SET_PALETTEREP_ID(Corpse.PantsPal, "GREENPANTS");

  Corpse.bDirection = Random(8);

  // Set time of death
  // Make sure they will be rotting!
  Corpse.uiTimeOfDeath = GetWorldTotalMin() - (2 * NUM_SEC_IN_DAY / 60);
  // Set type
  Corpse.ubType = SMERC_JFK;
  Corpse.usFlags = ROTTING_CORPSE_FIND_SWEETSPOT_FROM_GRIDNO;

  // 1st gridno
  Corpse.sGridNo = 14319;
  ConvertGridNoToXY(Corpse.sGridNo, addressof(sXPos), addressof(sYPos));
  Corpse.dXPos = (CenterX(sXPos));
  Corpse.dYPos = (CenterY(sYPos));

  // Add the rotting corpse info to the sectors unloaded rotting corpse file
  AddRottingCorpseToUnloadedSectorsRottingCorpseFile(sSectorX, sSectorY, 0, addressof(Corpse));

  // 2nd gridno
  Corpse.sGridNo = 9835;
  ConvertGridNoToXY(Corpse.sGridNo, addressof(sXPos), addressof(sYPos));
  Corpse.dXPos = (CenterX(sXPos));
  Corpse.dYPos = (CenterY(sYPos));

  // Add the rotting corpse info to the sectors unloaded rotting corpse file
  AddRottingCorpseToUnloadedSectorsRottingCorpseFile(sSectorX, sSectorY, 0, addressof(Corpse));

  // 3rd gridno
  Corpse.sGridNo = 11262;
  ConvertGridNoToXY(Corpse.sGridNo, addressof(sXPos), addressof(sYPos));
  Corpse.dXPos = (CenterX(sXPos));
  Corpse.dYPos = (CenterY(sYPos));

  // Add the rotting corpse info to the sectors unloaded rotting corpse file
  AddRottingCorpseToUnloadedSectorsRottingCorpseFile(sSectorX, sSectorY, 0, addressof(Corpse));
}

// ARRIVALCALLBACK
//...............
// This is called whenever any group arrives in the next sector (player or enemy)
// This function will first check to see if a battle should start, or if they
// aren't at the final destination, they will move to the next sector.
function GroupArrivedAtSector(ubGroupID: UINT8, fCheckForBattle: BOOLEAN, fNeverLeft: BOOLEAN): void {
  let pGroup: Pointer<GROUP>;
  let iVehId: INT32 = -1;
  let curr: Pointer<PLAYERGROUP>;
  let ubInsertionDirection: UINT8;
  let ubStrategicInsertionCode: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let fExceptionQueue: BOOLEAN = FALSE;
  let fFirstTimeInSector: BOOLEAN = FALSE;
  let fGroupDestroyed: BOOLEAN = FALSE;
  let fVehicleStranded: BOOLEAN = FALSE;

  // reset
  gfWaitingForInput = FALSE;

  // grab the group and see if valid
  pGroup = GetGroup(ubGroupID);

  if (pGroup == NULL) {
    return;
  }

  if (pGroup.value.fPlayer) {
    // Set the fact we have visited the  sector
    curr = pGroup.value.pPlayerList;
    if (curr) {
      if (curr.value.pSoldier.value.bAssignment < ON_DUTY) {
        ResetDeadSquadMemberList(curr.value.pSoldier.value.bAssignment);
      }
    }

    while (curr) {
      curr.value.pSoldier.value.uiStatusFlags &= ~SOLDIER_SHOULD_BE_TACTICALLY_VALID;
      curr = curr.value.next;
    }

    if (pGroup.value.fVehicle) {
      if ((iVehId = (GivenMvtGroupIdFindVehicleId(ubGroupID))) != -1) {
        if (iVehId != iHelicopterVehicleId) {
          if (pGroup.value.pPlayerList == NULL) {
            // nobody here, better just get out now
            // with vehicles, arriving empty is probably ok, since passengers might have been killed but vehicle lived.
            return;
          }
        }
      }
    } else {
      if (pGroup.value.pPlayerList == NULL) {
        // nobody here, better just get out now
        AssertMsg(0, String("Player group %d arrived in sector empty.  KM 0", ubGroupID));
        return;
      }
    }
  }
  // Check for exception cases which
  if (gTacticalStatus.bBoxingState != NOT_BOXING) {
    if (!pGroup.value.fPlayer && pGroup.value.ubNextX == 5 && pGroup.value.ubNextY == 4 && pGroup.value.ubSectorZ == 0) {
      fExceptionQueue = TRUE;
    }
  }
  // First check if the group arriving is going to queue another battle.
  // NOTE:  We can't have more than one battle ongoing at a time.
  if (fExceptionQueue || fCheckForBattle && gTacticalStatus.fEnemyInSector && FindMovementGroupInSector(gWorldSectorX, gWorldSectorY, TRUE) && (pGroup.value.ubNextX != gWorldSectorX || pGroup.value.ubNextY != gWorldSectorY || gbWorldSectorZ > 0) || AreInMeanwhile() ||
      // KM : Aug 11, 1999 -- Patch fix:  Added additional checks to prevent a 2nd battle in the case
      //     where the player is involved in a potential battle with bloodcats/civilians
      fCheckForBattle && HostileCiviliansPresent() || fCheckForBattle && HostileBloodcatsPresent()) {
    // QUEUE BATTLE!
    // Delay arrival by a random value ranging from 3-5 minutes, so it doesn't get the player
    // too suspicious after it happens to him a few times, which, by the way, is a rare occurrence.
    if (AreInMeanwhile()) {
      pGroup.value.uiArrivalTime++; // tack on only 1 minute if we are in a meanwhile scene.  This effectively
                               // prevents any battle from occurring while inside a meanwhile scene.
    } else {
      pGroup.value.uiArrivalTime += Random(3) + 3;
    }

    if (!AddStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.uiArrivalTime, pGroup.value.ubGroupID))
      AssertMsg(0, "Failed to add movement event.");

    if (pGroup.value.fPlayer) {
      if (pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
        AddStrategicEvent(EVENT_GROUP_ABOUT_TO_ARRIVE, pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY, pGroup.value.ubGroupID);
      }
    }

    return;
  }

  // Update the position of the group
  pGroup.value.ubPrevX = pGroup.value.ubSectorX;
  pGroup.value.ubPrevY = pGroup.value.ubSectorY;
  pGroup.value.ubSectorX = pGroup.value.ubNextX;
  pGroup.value.ubSectorY = pGroup.value.ubNextY;
  pGroup.value.ubNextX = 0;
  pGroup.value.ubNextY = 0;

  if (pGroup.value.fPlayer) {
    if (pGroup.value.ubSectorZ == 0) {
      SectorInfo[SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY)].bLastKnownEnemies = NumEnemiesInSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
    }

    // award life 'experience' for travelling, based on travel time!
    if (!pGroup.value.fVehicle) {
      // gotta be walking to get tougher
      AwardExperienceForTravelling(pGroup);
    } else if (!IsGroupTheHelicopterGroup(pGroup)) {
      let pSoldier: Pointer<SOLDIERTYPE>;
      let iVehicleID: INT32;
      iVehicleID = GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID);
      AssertMsg(iVehicleID != -1, "GroupArrival for vehicle group.  Invalid iVehicleID. ");

      pSoldier = GetSoldierStructureForVehicle(iVehicleID);
      AssertMsg(pSoldier, "GroupArrival for vehicle group.  Invalid soldier pointer.");

      SpendVehicleFuel(pSoldier, (pGroup.value.uiTraverseTime * 6));

      if (!VehicleFuelRemaining(pSoldier)) {
        ReportVehicleOutOfGas(iVehicleID, pGroup.value.ubSectorX, pGroup.value.ubSectorY);
        // Nuke the group's path, so they don't continue moving.
        ClearMercPathsAndWaypointsForAllInGroup(pGroup);
      }
    }
  }

  pGroup.value.uiTraverseTime = 0;
  SetGroupArrivalTime(pGroup, 0);
  pGroup.value.fBetweenSectors = FALSE;

  fMapPanelDirty = TRUE;
  fMapScreenBottomDirty = TRUE;

  // if a player group
  if (pGroup.value.fPlayer) {
    // if this is the last sector along player group's movement path (no more waypoints)
    if (GroupAtFinalDestination(pGroup)) {
      // clear their strategic movement (mercpaths and waypoints)
      ClearMercPathsAndWaypointsForAllInGroup(pGroup);
    }

    // if on surface
    if (pGroup.value.ubSectorZ == 0) {
      // check for discovering secret locations
      let bTownId: INT8 = GetTownIdForSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY);

      if (bTownId == TIXA)
        SetTixaAsFound();
      else if (bTownId == ORTA)
        SetOrtaAsFound();
      else if (IsThisSectorASAMSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY, 0))
        SetSAMSiteAsFound(GetSAMIdFromSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY, 0));
    }

    if (pGroup.value.ubSectorX < pGroup.value.ubPrevX) {
      ubInsertionDirection = SOUTHWEST;
      ubStrategicInsertionCode = INSERTION_CODE_EAST;
    } else if (pGroup.value.ubSectorX > pGroup.value.ubPrevX) {
      ubInsertionDirection = NORTHEAST;
      ubStrategicInsertionCode = INSERTION_CODE_WEST;
    } else if (pGroup.value.ubSectorY < pGroup.value.ubPrevY) {
      ubInsertionDirection = NORTHWEST;
      ubStrategicInsertionCode = INSERTION_CODE_SOUTH;
    } else if (pGroup.value.ubSectorY > pGroup.value.ubPrevY) {
      ubInsertionDirection = SOUTHEAST;
      ubStrategicInsertionCode = INSERTION_CODE_NORTH;
    } else {
      Assert(0);
      return;
    }

    if (pGroup.value.fVehicle == FALSE) {
      // non-vehicle player group

      curr = pGroup.value.pPlayerList;
      while (curr) {
        curr.value.pSoldier.value.fBetweenSectors = FALSE;
        curr.value.pSoldier.value.sSectorX = pGroup.value.ubSectorX;
        curr.value.pSoldier.value.sSectorY = pGroup.value.ubSectorY;
        curr.value.pSoldier.value.bSectorZ = pGroup.value.ubSectorZ;
        curr.value.pSoldier.value.ubPrevSectorID = SECTOR(pGroup.value.ubPrevX, pGroup.value.ubPrevY);
        curr.value.pSoldier.value.ubInsertionDirection = ubInsertionDirection;

        // don't override if a tactical traversal
        if (curr.value.pSoldier.value.ubStrategicInsertionCode != INSERTION_CODE_PRIMARY_EDGEINDEX && curr.value.pSoldier.value.ubStrategicInsertionCode != INSERTION_CODE_SECONDARY_EDGEINDEX) {
          curr.value.pSoldier.value.ubStrategicInsertionCode = ubStrategicInsertionCode;
        }

        if (curr.value.pSoldier.value.pMercPath) {
          // remove head from their mapscreen path list
          curr.value.pSoldier.value.pMercPath = RemoveHeadFromStrategicPath(curr.value.pSoldier.value.pMercPath);
        }

        // ATE: Alrighty, check if this sector is currently loaded, if so,
        // add them to the tactical engine!
        if (pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && pGroup.value.ubSectorZ == gbWorldSectorZ) {
          UpdateMercInSector(curr.value.pSoldier, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
        }
        curr = curr.value.next;
      }

      // if there's anybody in the group
      if (pGroup.value.pPlayerList) {
        // don't print any messages when arriving underground (there's no delay involved) or if we never left (cancel)
        if (GroupAtFinalDestination(pGroup) && (pGroup.value.ubSectorZ == 0) && !fNeverLeft) {
          // if assigned to a squad
          if (pGroup.value.pPlayerList.value.pSoldier.value.bAssignment < ON_DUTY) {
            // squad
            ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pMessageStrings[MSG_ARRIVE], pAssignmentStrings[pGroup.value.pPlayerList.value.pSoldier.value.bAssignment], pMapVertIndex[pGroup.value.pPlayerList.value.pSoldier.value.sSectorY], pMapHortIndex[pGroup.value.pPlayerList.value.pSoldier.value.sSectorX]);
          } else {
            // a loner
            ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pMessageStrings[MSG_ARRIVE], pGroup.value.pPlayerList.value.pSoldier.value.name, pMapVertIndex[pGroup.value.pPlayerList.value.pSoldier.value.sSectorY], pMapHortIndex[pGroup.value.pPlayerList.value.pSoldier.value.sSectorX]);
          }
        }
      }
    } else // vehicle player group
    {
      iVehId = GivenMvtGroupIdFindVehicleId(ubGroupID);
      Assert(iVehId != -1);

      if (pVehicleList[iVehId].pMercPath) {
        // remove head from vehicle's mapscreen path list
        pVehicleList[iVehId].pMercPath = RemoveHeadFromStrategicPath(pVehicleList[iVehId].pMercPath);
      }

      // update vehicle position
      SetVehicleSectorValues(iVehId, pGroup.value.ubSectorX, pGroup.value.ubSectorY);
      pVehicleList[iVehId].fBetweenSectors = FALSE;

      // update passengers position
      UpdatePositionOfMercsInVehicle(iVehId);

      if (iVehId != iHelicopterVehicleId) {
        pSoldier = GetSoldierStructureForVehicle(iVehId);
        Assert(pSoldier);

        pSoldier.value.fBetweenSectors = FALSE;
        pSoldier.value.sSectorX = pGroup.value.ubSectorX;
        pSoldier.value.sSectorY = pGroup.value.ubSectorY;
        pSoldier.value.bSectorZ = pGroup.value.ubSectorZ;
        pSoldier.value.ubInsertionDirection = ubInsertionDirection;

        // ATE: Removed, may 21 - sufficient to use insertion direction...
        // pSoldier->bDesiredDirection = ubInsertionDirection;

        pSoldier.value.ubStrategicInsertionCode = ubStrategicInsertionCode;

        // if this sector is currently loaded
        if (pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && pGroup.value.ubSectorZ == gbWorldSectorZ) {
          // add vehicle to the tactical engine!
          UpdateMercInSector(pSoldier, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
        }

        // set directions of insertion
        curr = pGroup.value.pPlayerList;
        while (curr) {
          curr.value.pSoldier.value.fBetweenSectors = FALSE;
          curr.value.pSoldier.value.sSectorX = pGroup.value.ubSectorX;
          curr.value.pSoldier.value.sSectorY = pGroup.value.ubSectorY;
          curr.value.pSoldier.value.bSectorZ = pGroup.value.ubSectorZ;
          curr.value.pSoldier.value.ubInsertionDirection = ubInsertionDirection;

          // ATE: Removed, may 21 - sufficient to use insertion direction...
          // curr->pSoldier->bDesiredDirection = ubInsertionDirection;

          curr.value.pSoldier.value.ubStrategicInsertionCode = ubStrategicInsertionCode;

          // if this sector is currently loaded
          if (pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && pGroup.value.ubSectorZ == gbWorldSectorZ) {
            // add passenger to the tactical engine!
            UpdateMercInSector(curr.value.pSoldier, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
          }

          curr = curr.value.next;
        }
      } else {
        if (HandleHeliEnteringSector(pVehicleList[iVehId].sSectorX, pVehicleList[iVehId].sSectorY) == TRUE) {
          // helicopter destroyed
          fGroupDestroyed = TRUE;
        }
      }

      if (!fGroupDestroyed) {
        // don't print any messages when arriving underground, there's no delay involved
        if (GroupAtFinalDestination(pGroup) && (pGroup.value.ubSectorZ == 0) && !fNeverLeft) {
          ScreenMsg(FONT_MCOLOR_DKRED, MSG_INTERFACE, pMessageStrings[MSG_ARRIVE], pVehicleStrings[pVehicleList[iVehId].ubVehicleType], pMapVertIndex[pGroup.value.ubSectorY], pMapHortIndex[pGroup.value.ubSectorX]);
        }
      }
    }

    if (!fGroupDestroyed) {
      // check if sector had been visited previously
      fFirstTimeInSector = !GetSectorFlagStatus(pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ, SF_ALREADY_VISITED);

      // on foot, or in a vehicle other than the chopper
      if (!pGroup.value.fVehicle || !IsGroupTheHelicopterGroup(pGroup)) {
        // ATE: Add a few corpse to the bloodcat lair...
        if (SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY) == SEC_I16 && fFirstTimeInSector) {
          AddCorpsesToBloodcatLair(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
        }

        // mark the sector as visited already
        SetSectorFlag(pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ, SF_ALREADY_VISITED);
      }
    }

    // update character info
    fTeamPanelDirty = TRUE;
    fCharacterInfoPanelDirty = TRUE;
  }

  if (!fGroupDestroyed) {
    // Determine if a battle should start.
    // if a battle does start, or get's delayed, then we will keep the group in memory including
    // all waypoints, until after the battle is resolved.  At that point, we will continue the processing.
    if (fCheckForBattle && !CheckConditionsForBattle(pGroup) && !gfWaitingForInput) {
      let next: Pointer<GROUP>;
      HandleNonCombatGroupArrival(pGroup, TRUE, fNeverLeft);

      if (gubNumGroupsArrivedSimultaneously) {
        pGroup = gpGroupList;
        while (gubNumGroupsArrivedSimultaneously && pGroup) {
          next = pGroup.value.next;
          if (pGroup.value.uiFlags & GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY) {
            gubNumGroupsArrivedSimultaneously--;
            HandleNonCombatGroupArrival(pGroup, FALSE, FALSE);
          }
          pGroup = next;
        }
      }
    } else {
      // Handle cases for pre battle conditions
      pGroup.value.uiFlags = 0;
      if (gubNumAwareBattles) {
        // When the AI is looking for the players, and a battle is initiated, then
        // decrement the value, otherwise the queen will continue searching to infinity.
        gubNumAwareBattles--;
      }
    }
  }
  gfWaitingForInput = FALSE;
}

function HandleNonCombatGroupArrival(pGroup: Pointer<GROUP>, fMainGroup: BOOLEAN, fNeverLeft: BOOLEAN): void {
  // if any mercs are actually in the group

  if (StrategicAILookForAdjacentGroups(pGroup)) {
    // The routine actually just deleted the enemy group (player's don't get deleted), so we are done!
    return;
  }

  if (pGroup.value.fPlayer) {
    // The group will always exist after the AI was processed.

    // Determine if the group should rest, change routes, or continue moving.
    // if on foot, or in a vehicle other than the helicopter
    if (!pGroup.value.fVehicle || !IsGroupTheHelicopterGroup(pGroup)) {
      // take control of sector
      SetThisSectorAsPlayerControlled(pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ, FALSE);
    }

    // if this is the last sector along their movement path (no more waypoints)
    if (GroupAtFinalDestination(pGroup)) {
      // if currently selected sector has nobody in it
      if (PlayerMercsInSector(sSelMapX, sSelMapY, iCurrentMapSectorZ) == 0) {
        // make this sector strategically selected
        ChangeSelectedMapSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ);
      }

      // if on foot or in a vehicle other than the helicopter (Skyrider speaks for heli movement)
      if (!pGroup.value.fVehicle || !IsGroupTheHelicopterGroup(pGroup)) {
        StopTimeCompression();

        // if traversing tactically, or we never left (just canceling), don't do this
        if (!gfTacticalTraversal && !fNeverLeft) {
          RandomMercInGroupSaysQuote(pGroup, QUOTE_MERC_REACHED_DESTINATION);
        }
      }
    }
    // look for NPCs to stop for, anyone is too tired to keep going, if all OK rebuild waypoints & continue movement
    // NOTE: Only the main group (first group arriving) will stop for NPCs, it's just too much hassle to stop them all
    PlayerGroupArrivedSafelyInSector(pGroup, fMainGroup);
  } else {
    if (!pGroup.value.fDebugGroup) {
      CalculateNextMoveIntention(pGroup);
    } else {
      RemovePGroup(pGroup);
    }
  }
  // Clear the non-persistant flags.
  pGroup.value.uiFlags = 0;
}

// Because a battle is about to start, we need to go through the event list and look for other
// groups that may arrive at the same time -- enemies or players, and blindly add them to the sector
// without checking for battle conditions, as it has already determined that a new battle is about to
// start.
function HandleOtherGroupsArrivingSimultaneously(ubSectorX: UINT8, ubSectorY: UINT8, ubSectorZ: UINT8): void {
  let pEvent: Pointer<STRATEGICEVENT>;
  let uiCurrTimeStamp: UINT32;
  let pGroup: Pointer<GROUP>;
  uiCurrTimeStamp = GetWorldTotalSeconds();
  pEvent = gpEventList;
  gubNumGroupsArrivedSimultaneously = 0;
  while (pEvent && pEvent.value.uiTimeStamp <= uiCurrTimeStamp) {
    if (pEvent.value.ubCallbackID == EVENT_GROUP_ARRIVAL && !(pEvent.value.ubFlags & SEF_DELETION_PENDING)) {
      pGroup = GetGroup(pEvent.value.uiParam);
      Assert(pGroup);
      if (pGroup.value.ubNextX == ubSectorX && pGroup.value.ubNextY == ubSectorY && pGroup.value.ubSectorZ == ubSectorZ) {
        if (pGroup.value.fBetweenSectors) {
          GroupArrivedAtSector(pEvent.value.uiParam, FALSE, FALSE);
          pGroup.value.uiFlags |= GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY;
          gubNumGroupsArrivedSimultaneously++;
          DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);
          pEvent = gpEventList;
          continue;
        }
      }
    }
    pEvent = pEvent.value.next;
  }
}

// The user has just approved to plan a simultaneous arrival.  So we will syncronize all of the involved
// groups so that they arrive at the same time (which is the time the final group would arrive).
function PrepareGroupsForSimultaneousArrival(): void {
  let pGroup: Pointer<GROUP>;
  let uiLatestArrivalTime: UINT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let iVehId: INT32 = 0;

  pGroup = gpGroupList;
  while (pGroup) {
    // For all of the groups that haven't arrived yet, determine which one is going to take the longest.
    if (pGroup != gpPendingSimultaneousGroup && pGroup.value.fPlayer && pGroup.value.fBetweenSectors && pGroup.value.ubNextX == gpPendingSimultaneousGroup.value.ubSectorX && pGroup.value.ubNextY == gpPendingSimultaneousGroup.value.ubSectorY && !IsGroupTheHelicopterGroup(pGroup)) {
      uiLatestArrivalTime = max(pGroup.value.uiArrivalTime, uiLatestArrivalTime);
      pGroup.value.uiFlags |= GROUPFLAG_SIMULTANEOUSARRIVAL_APPROVED | GROUPFLAG_MARKER;
    }
    pGroup = pGroup.value.next;
  }
  // Now, go through the list again, and reset their arrival event to the latest arrival time.
  pGroup = gpGroupList;
  while (pGroup) {
    if (pGroup.value.uiFlags & GROUPFLAG_MARKER) {
      DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

      // NOTE: This can cause the arrival time to be > GetWorldTotalMin() + TraverseTime, so keep that in mind
      // if you have any code that uses these 3 values to figure out how far along its route a group is!
      SetGroupArrivalTime(pGroup, uiLatestArrivalTime);
      AddStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.uiArrivalTime, pGroup.value.ubGroupID);

      if (pGroup.value.fPlayer) {
        if (pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
          AddStrategicEvent(EVENT_GROUP_ABOUT_TO_ARRIVE, pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY, pGroup.value.ubGroupID);
        }
      }

      DelayEnemyGroupsIfPathsCross(pGroup);

      pGroup.value.uiFlags &= ~GROUPFLAG_MARKER;
    }
    pGroup = pGroup.value.next;
  }
  // We still have the first group that has arrived.  Because they are set up to be in the destination
  // sector, we will "warp" them back to the last sector, and also setup a new arrival time for them.
  pGroup = gpPendingSimultaneousGroup;
  pGroup.value.ubNextX = pGroup.value.ubSectorX;
  pGroup.value.ubNextY = pGroup.value.ubSectorY;
  pGroup.value.ubSectorX = pGroup.value.ubPrevX;
  pGroup.value.ubSectorY = pGroup.value.ubPrevY;
  SetGroupArrivalTime(pGroup, uiLatestArrivalTime);
  pGroup.value.fBetweenSectors = TRUE;

  if (pGroup.value.fVehicle) {
    if ((iVehId = (GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID))) != -1) {
      pVehicleList[iVehId].fBetweenSectors = TRUE;

      // set up vehicle soldier
      pSoldier = GetSoldierStructureForVehicle(iVehId);

      if (pSoldier) {
        pSoldier.value.fBetweenSectors = TRUE;
      }
    }
  }

  AddStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.uiArrivalTime, pGroup.value.ubGroupID);

  if (pGroup.value.fPlayer) {
    if (pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
      AddStrategicEvent(EVENT_GROUP_ABOUT_TO_ARRIVE, pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY, pGroup.value.ubGroupID);
    }
  }
  DelayEnemyGroupsIfPathsCross(pGroup);
}

// See if there are other groups OTW.  If so, and if we haven't asked the user yet to plan
// a simultaneous attack, do so now, and readjust the groups accordingly.  If it is possible
// to do so, then we will set up the gui, and postpone the prebattle interface.
function PossibleToCoordinateSimultaneousGroupArrivals(pFirstGroup: Pointer<GROUP>): BOOLEAN {
  let pGroup: Pointer<GROUP>;
  let ubNumNearbyGroups: UINT8 = 0;

  // If the user has already been asked, then don't ask the question again!
  if (pFirstGroup.value.uiFlags & (GROUPFLAG_SIMULTANEOUSARRIVAL_APPROVED | GROUPFLAG_SIMULTANEOUSARRIVAL_CHECKED) || IsGroupTheHelicopterGroup(pFirstGroup)) {
    return FALSE;
  }

  // We can't coordinate simultaneous attacks on a sector without any stationary forces!  Otherwise, it
  // is possible that they will be gone when you finally arrive.
  // if( !NumStationaryEnemiesInSector( pFirstGroup->ubSectorX, pFirstGroup->ubSectorY ) )
  //	return FALSE;

  // Count the number of groups that are scheduled to arrive in the same sector and are currently
  // adjacent to the sector in question.
  pGroup = gpGroupList;
  while (pGroup) {
    if (pGroup != pFirstGroup && pGroup.value.fPlayer && pGroup.value.fBetweenSectors && pGroup.value.ubNextX == pFirstGroup.value.ubSectorX && pGroup.value.ubNextY == pFirstGroup.value.ubSectorY && !(pGroup.value.uiFlags & GROUPFLAG_SIMULTANEOUSARRIVAL_CHECKED) && !IsGroupTheHelicopterGroup(pGroup)) {
      pGroup.value.uiFlags |= GROUPFLAG_SIMULTANEOUSARRIVAL_CHECKED;
      ubNumNearbyGroups++;
    }
    pGroup = pGroup.value.next;
  }

  if (ubNumNearbyGroups) {
    // postpone the battle until the user answers the dialog.
    let str: UINT16[] /* [255] */;
    let pStr: Pointer<UINT16>;
    let pEnemyType: Pointer<UINT16>;
    InterruptTime();
    PauseGame();
    LockPauseState(13);
    gpPendingSimultaneousGroup = pFirstGroup;
    // Build the string
    if (ubNumNearbyGroups == 1) {
      pStr = gpStrategicString[STR_DETECTED_SINGULAR];
    } else {
      pStr = gpStrategicString[STR_DETECTED_PLURAL];
    }
    if (gubEnemyEncounterCode == ENTERING_BLOODCAT_LAIR_CODE) {
      pEnemyType = gpStrategicString[STR_PB_BLOODCATS];
    } else {
      pEnemyType = gpStrategicString[STR_PB_ENEMIES];
    }
    // header, sector, singular/plural str, confirmation string.
    // Ex:  Enemies have been detected in sector J9 and another squad is
    //     about to arrive.  Do you wish to coordinate a simultaneous arrival?
    swprintf(str, pStr,
             pEnemyType, // Enemy type (Enemies or bloodcats)
             'A' + gpPendingSimultaneousGroup.value.ubSectorY - 1, gpPendingSimultaneousGroup.value.ubSectorX); // Sector location
    wcscat(str, "  ");
    wcscat(str, gpStrategicString[STR_COORDINATE]);
    // Setup the dialog

    // Kris August 03, 1999 Bug fix:  Changed 1st line to 2nd line to fix game breaking if this dialog came up while in tactical.
    //                               It would kick you to mapscreen, where things would break...
    // DoMapMessageBox( MSG_BOX_BASIC_STYLE, str, MAP_SCREEN, MSG_BOX_FLAG_YESNO, PlanSimultaneousGroupArrivalCallback );
    DoMapMessageBox(MSG_BOX_BASIC_STYLE, str, guiCurrentScreen, MSG_BOX_FLAG_YESNO, PlanSimultaneousGroupArrivalCallback);

    gfWaitingForInput = TRUE;
    return TRUE;
  }
  return FALSE;
}

function PlanSimultaneousGroupArrivalCallback(bMessageValue: UINT8): void {
  if (bMessageValue == MSG_BOX_RETURN_YES) {
    PrepareGroupsForSimultaneousArrival();
  } else {
    PrepareForPreBattleInterface(gpPendingSimultaneousGroup, gpPendingSimultaneousGroup);
  }
  UnLockPauseState();
  UnPauseGame();
}

function DelayEnemyGroupsIfPathsCross(pPlayerGroup: Pointer<GROUP>): void {
  let pGroup: Pointer<GROUP>;
  pGroup = gpGroupList;
  while (pGroup) {
    if (!pGroup.value.fPlayer) {
      // then check to see if this group will arrive in next sector before the player group.
      if (pGroup.value.uiArrivalTime < pPlayerGroup.value.uiArrivalTime) {
        // check to see if enemy group will cross paths with player group.
        if (pGroup.value.ubNextX == pPlayerGroup.value.ubSectorX && pGroup.value.ubNextY == pPlayerGroup.value.ubSectorY && pGroup.value.ubSectorX == pPlayerGroup.value.ubNextX && pGroup.value.ubSectorY == pPlayerGroup.value.ubNextY) {
          // Okay, the enemy group will cross paths with the player, so find and delete the arrival event
          // and repost it in the future (like a minute or so after the player arrives)
          DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

          // NOTE: This can cause the arrival time to be > GetWorldTotalMin() + TraverseTime, so keep that in mind
          // if you have any code that uses these 3 values to figure out how far along its route a group is!
          SetGroupArrivalTime(pGroup, pPlayerGroup.value.uiArrivalTime + 1 + Random(10));
          if (!AddStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.uiArrivalTime, pGroup.value.ubGroupID))
            AssertMsg(0, "Failed to add movement event.");
        }
      }
    }
    pGroup = pGroup.value.next;
  }
}

function InitiateGroupMovementToNextSector(pGroup: Pointer<GROUP>): void {
  let dx: INT32;
  let dy: INT32;
  let i: INT32;
  let ubDirection: UINT8;
  let ubSector: UINT8;
  let wp: Pointer<WAYPOINT>;
  let iVehId: INT32 = -1;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;
  let uiSleepMinutes: UINT32 = 0;

  Assert(pGroup);
  i = pGroup.value.ubNextWaypointID;
  wp = pGroup.value.pWaypoints;
  while (i--) {
    // Traverse through the waypoint list to the next waypoint ID
    Assert(wp);
    wp = wp.value.next;
  }
  Assert(wp);
  // We now have the correct waypoint.
  // Analyse the group and determine which direction it will move from the current sector.
  dx = wp.value.x - pGroup.value.ubSectorX;
  dy = wp.value.y - pGroup.value.ubSectorY;
  if (dx && dy) {
    // Can't move diagonally!
    AssertMsg(0, String("Attempting to move to waypoint in a diagonal direction from sector %d,%d to sector %d,%d", pGroup.value.ubSectorX, pGroup.value.ubSectorY, wp.value.x, wp.value.y));
  }
  if (!dx && !dy) // Can't move to position currently at!
    AssertMsg(0, String("Attempting to move to waypoint %d, %d that you are already at!", wp.value.x, wp.value.y));
  // Clip dx/dy value so that the move is for only one sector.
  if (dx >= 1) {
    ubDirection = EAST_STRATEGIC_MOVE;
    dx = 1;
  } else if (dy >= 1) {
    ubDirection = SOUTH_STRATEGIC_MOVE;
    dy = 1;
  } else if (dx <= -1) {
    ubDirection = WEST_STRATEGIC_MOVE;
    dx = -1;
  } else if (dy <= -1) {
    ubDirection = NORTH_STRATEGIC_MOVE;
    dy = -1;
  } else {
    Assert(0);
    return;
  }
  // All conditions for moving to the next waypoint are now good.
  pGroup.value.ubNextX = (dx + pGroup.value.ubSectorX);
  pGroup.value.ubNextY = (dy + pGroup.value.ubSectorY);
  // Calc time to get to next waypoint...
  ubSector = SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
  if (!pGroup.value.ubSectorZ) {
    let fCalcRegularTime: BOOLEAN = TRUE;
    if (!pGroup.value.fPlayer) {
      // Determine if the enemy group is "sleeping".  If so, then simply delay their arrival time by the amount of time
      // they are going to be sleeping for.
      if (GetWorldHour() >= 21 || GetWorldHour() <= 4) {
        // It is definitely night time.
        if (Chance(67)) {
          // 2 in 3 chance of going to sleep.
          pGroup.value.uiTraverseTime = GetSectorMvtTimeForGroup(ubSector, ubDirection, pGroup);
          uiSleepMinutes = 360 + Random(121); // 6-8 hours sleep
          fCalcRegularTime = FALSE;
        }
      }
    }
    if (fCalcRegularTime) {
      pGroup.value.uiTraverseTime = GetSectorMvtTimeForGroup(ubSector, ubDirection, pGroup);
    }
  } else {
    pGroup.value.uiTraverseTime = 1;
  }

  if (pGroup.value.uiTraverseTime == 0xffffffff) {
    AssertMsg(0, String("Group %d (%s) attempting illegal move from %c%d to %c%d (%s).", pGroup.value.ubGroupID, (pGroup.value.fPlayer) ? "Player" : "AI", pGroup.value.ubSectorY + 'A', pGroup.value.ubSectorX, pGroup.value.ubNextY + 'A', pGroup.value.ubNextX, gszTerrain[SectorInfo[ubSector].ubTraversability[ubDirection]]));
  }

  // add sleep, if any
  pGroup.value.uiTraverseTime += uiSleepMinutes;

  if (gfTacticalTraversal && gpTacticalTraversalGroup == pGroup) {
    if (gfUndergroundTacticalTraversal) {
      // underground movement between sectors takes 1 minute.
      pGroup.value.uiTraverseTime = 1;
    } else {
      // strategic movement between town sectors takes 5 minutes.
      pGroup.value.uiTraverseTime = 5;
    }
  }

  // if group isn't already between sectors
  if (!pGroup.value.fBetweenSectors) {
    // put group between sectors
    pGroup.value.fBetweenSectors = TRUE;
    // and set it's arrival time
    SetGroupArrivalTime(pGroup, GetWorldTotalMin() + pGroup.value.uiTraverseTime);
  }
  // NOTE: if the group is already between sectors, DON'T MESS WITH ITS ARRIVAL TIME!  THAT'S NOT OUR JOB HERE!!!

  // special override for AI patrol initialization only
  if (gfRandomizingPatrolGroup) {
    // We're initializing the patrol group, so randomize the enemy groups to have extremely quick and varying
    // arrival times so that their initial positions aren't easily determined.
    pGroup.value.uiTraverseTime = 1 + Random(pGroup.value.uiTraverseTime - 1);
    SetGroupArrivalTime(pGroup, GetWorldTotalMin() + pGroup.value.uiTraverseTime);
  }

  if (pGroup.value.fVehicle == TRUE) {
    // vehicle, set fact it is between sectors too
    if ((iVehId = (GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID))) != -1) {
      pVehicleList[iVehId].fBetweenSectors = TRUE;
      pSoldier = GetSoldierStructureForVehicle(iVehId);

      if (pSoldier) {
        pSoldier.value.fBetweenSectors = TRUE;

        // OK, Remove the guy from tactical engine!
        RemoveSoldierFromTacticalSector(pSoldier, TRUE);
      }
    }
  }

  // Post the event!
  if (!AddStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.uiArrivalTime, pGroup.value.ubGroupID))
    AssertMsg(0, "Failed to add movement event.");

  // For the case of player groups, we need to update the information of the soldiers.
  if (pGroup.value.fPlayer) {
    let curr: Pointer<PLAYERGROUP>;

    if (pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
      AddStrategicEvent(EVENT_GROUP_ABOUT_TO_ARRIVE, pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY, pGroup.value.ubGroupID);
    }

    curr = pGroup.value.pPlayerList;
    while (curr) {
      curr.value.pSoldier.value.fBetweenSectors = TRUE;

      // OK, Remove the guy from tactical engine!
      RemoveSoldierFromTacticalSector(curr.value.pSoldier, TRUE);

      curr = curr.value.next;
    }
    CheckAndHandleUnloadingOfCurrentWorld();

    // If an enemy group will be crossing paths with the player group, delay the enemy group's arrival time so that
    // the player will always encounter that group.
    if (!pGroup.value.ubSectorZ) {
      DelayEnemyGroupsIfPathsCross(pGroup);
    }
  }
}

function RemoveGroupWaypoints(ubGroupID: UINT8): void {
  let pGroup: Pointer<GROUP>;
  pGroup = GetGroup(ubGroupID);
  Assert(pGroup);
  RemovePGroupWaypoints(pGroup);
}

function RemovePGroupWaypoints(pGroup: Pointer<GROUP>): void {
  let wp: Pointer<WAYPOINT>;
  // if there aren't any waypoints to delete, then return.  This also avoids setting
  // the fWaypointsCancelled flag.
  if (!pGroup.value.pWaypoints)
    return;
  // remove all of the waypoints.
  while (pGroup.value.pWaypoints) {
    wp = pGroup.value.pWaypoints;
    pGroup.value.pWaypoints = pGroup.value.pWaypoints.value.next;
    MemFree(wp);
  }
  pGroup.value.ubNextWaypointID = 0;
  pGroup.value.pWaypoints = NULL;

  // By setting this flag, it acknowledges the possibility that the group is currently between sectors,
  // and will continue moving until it reaches the next sector.  If the user decides to change directions,
  // during this process, the arrival event must be modified to send the group back.
  // pGroup->fWaypointsCancelled = TRUE;
}

// set groups waypoints as cancelled
function SetWayPointsAsCanceled(ubGroupID: UINT8): void {
  let pGroup: Pointer<GROUP>;
  pGroup = GetGroup(ubGroupID);
  Assert(pGroup);

  // pGroup -> fWaypointsCancelled = TRUE;

  return;
}

// set this groups previous sector values
function SetGroupPrevSectors(ubGroupID: UINT8, ubX: UINT8, ubY: UINT8): void {
  let pGroup: Pointer<GROUP>;
  pGroup = GetGroup(ubGroupID);
  Assert(pGroup);

  // since we have a group, set prev sector's x and y
  pGroup.value.ubPrevX = ubX;
  pGroup.value.ubPrevY = ubY;
}

function RemoveGroup(ubGroupID: UINT8): void {
  let pGroup: Pointer<GROUP>;
  pGroup = GetGroup(ubGroupID);

  if (ubGroupID == 51) {
    let i: int = 0;
  }

  Assert(pGroup);
  RemovePGroup(pGroup);
}

let gfRemovingAllGroups: BOOLEAN = FALSE;

function RemovePGroup(pGroup: Pointer<GROUP>): void {
  let bit: UINT32;
  let index: UINT32;
  let mask: UINT32;

  if (pGroup.value.fPersistant && !gfRemovingAllGroups) {
    CancelEmptyPersistentGroupMovement(pGroup);
    return;
    DoScreenIndependantMessageBox("Strategic Info Warning:  Attempting to delete a persistant group.", MSG_BOX_FLAG_OK, NULL);
  }
  // if removing head, then advance head first.
  if (pGroup == gpGroupList)
    gpGroupList = gpGroupList.value.next;
  else {
    // detach this node from the list.
    let curr: Pointer<GROUP>;
    curr = gpGroupList;
    while (curr.value.next && curr.value.next != pGroup)
      curr = curr.value.next;
    AssertMsg(curr.value.next == pGroup, "Trying to remove a strategic group that isn't in the list!");
    curr.value.next = pGroup.value.next;
  }

  // Remove the waypoints.
  RemovePGroupWaypoints(pGroup);

  // Remove the arrival event if applicable.
  DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

  // Determine what type of group we have (because it requires different methods)
  if (pGroup.value.fPlayer) {
    // Remove player group
    let pPlayer: Pointer<PLAYERGROUP>;
    while (pGroup.value.pPlayerList) {
      pPlayer = pGroup.value.pPlayerList;
      pGroup.value.pPlayerList = pGroup.value.pPlayerList.value.next;
      MemFree(pPlayer);
    }
  } else {
    RemoveGroupFromStrategicAILists(pGroup.value.ubGroupID);
    MemFree(pGroup.value.pEnemyGroup);
  }

  // clear the unique group ID
  index = pGroup.value.ubGroupID / 32;
  bit = pGroup.value.ubGroupID % 32;
  mask = 1 << bit;

  if (!(uniqueIDMask[index] & mask)) {
    mask = mask;
  }

  uniqueIDMask[index] -= mask;

  MemFree(pGroup);
  pGroup = NULL;
}

function RemoveAllGroups(): void {
  gfRemovingAllGroups = TRUE;
  while (gpGroupList) {
    RemovePGroup(gpGroupList);
  }
  gfRemovingAllGroups = FALSE;
}

function SetGroupSectorValue(sSectorX: INT16, sSectorY: INT16, sSectorZ: INT16, ubGroupID: UINT8): void {
  let pGroup: Pointer<GROUP>;
  let pPlayer: Pointer<PLAYERGROUP>;

  // get the group
  pGroup = GetGroup(ubGroupID);

  // make sure it is valid
  Assert(pGroup);

  // Remove waypoints
  RemovePGroupWaypoints(pGroup);

  // set sector x and y to passed values
  pGroup.value.ubSectorX = pGroup.value.ubNextX = sSectorX;
  pGroup.value.ubSectorY = pGroup.value.ubNextY = sSectorY;
  pGroup.value.ubSectorZ = sSectorZ;
  pGroup.value.fBetweenSectors = FALSE;

  // set next sectors same as current
  pGroup.value.ubOriginalSector = SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
  DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

  // set all of the mercs in the group so that they are in the new sector too.
  pPlayer = pGroup.value.pPlayerList;
  while (pPlayer) {
    pPlayer.value.pSoldier.value.sSectorX = sSectorX;
    pPlayer.value.pSoldier.value.sSectorY = sSectorY;
    pPlayer.value.pSoldier.value.bSectorZ = sSectorZ;
    pPlayer.value.pSoldier.value.fBetweenSectors = FALSE;
    pPlayer.value.pSoldier.value.uiStatusFlags &= ~SOLDIER_SHOULD_BE_TACTICALLY_VALID;
    pPlayer = pPlayer.value.next;
  }

  CheckAndHandleUnloadingOfCurrentWorld();
}

function SetEnemyGroupSector(pGroup: Pointer<GROUP>, ubSectorID: UINT8): void {
  // make sure it is valid
  Assert(pGroup);
  DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

  // Remove waypoints
  if (!gfRandomizingPatrolGroup) {
    RemovePGroupWaypoints(pGroup);
  }

  // set sector x and y to passed values
  pGroup.value.ubSectorX = pGroup.value.ubNextX = SECTORX(ubSectorID);
  pGroup.value.ubSectorY = pGroup.value.ubNextY = SECTORY(ubSectorID);
  pGroup.value.ubSectorZ = 0;
  pGroup.value.fBetweenSectors = FALSE;
  // pGroup->fWaypointsCancelled = FALSE;
}

function SetGroupNextSectorValue(sSectorX: INT16, sSectorY: INT16, ubGroupID: UINT8): void {
  let pGroup: Pointer<GROUP>;

  // get the group
  pGroup = GetGroup(ubGroupID);

  // make sure it is valid
  Assert(pGroup);

  // Remove waypoints
  RemovePGroupWaypoints(pGroup);

  // set sector x and y to passed values
  pGroup.value.ubNextX = sSectorX;
  pGroup.value.ubNextY = sSectorY;
  pGroup.value.fBetweenSectors = FALSE;

  // set next sectors same as current
  pGroup.value.ubOriginalSector = SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
}

// get eta of the group with this id
function CalculateTravelTimeOfGroupId(ubId: UINT8): INT32 {
  let pGroup: Pointer<GROUP>;

  // get the group
  pGroup = GetGroup(ubId);

  if (pGroup == NULL) {
    return 0;
  }

  return CalculateTravelTimeOfGroup(pGroup);
}

function CalculateTravelTimeOfGroup(pGroup: Pointer<GROUP>): INT32 {
  let iDelta: INT32;
  let uiEtaTime: UINT32 = 0;
  let pNode: Pointer<WAYPOINT> = NULL;
  let pCurrent: WAYPOINT;
  let pDest: WAYPOINT;
  let ubCurrentSector: INT8 = 0;

  // check if valid group
  if (pGroup == NULL) {
    // return current time
    return uiEtaTime;
  }

  // set up next node
  pNode = pGroup.value.pWaypoints;

  // now get the delta in current sector and next sector
  iDelta = (SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY) - SECTOR(pGroup.value.ubNextX, pGroup.value.ubNextY));

  if (iDelta == 0) {
    // not going anywhere...return current time
    return uiEtaTime;
  }

  // if already on the road
  if (pGroup.value.fBetweenSectors) {
    // to get travel time to the first sector, use the arrival time, this way it accounts for delays due to simul. arrival
    if (pGroup.value.uiArrivalTime >= GetWorldTotalMin()) {
      uiEtaTime += (pGroup.value.uiArrivalTime - GetWorldTotalMin());
    }

    // first waypoint is NEXT sector
    pCurrent.x = pGroup.value.ubNextX;
    pCurrent.y = pGroup.value.ubNextY;
  } else {
    // first waypoint is CURRENT sector
    pCurrent.x = pGroup.value.ubSectorX;
    pCurrent.y = pGroup.value.ubSectorY;
  }

  while (pNode) {
    pDest.x = pNode.value.x;
    pDest.y = pNode.value.y;

    // update eta time by the path between these 2 waypts
    uiEtaTime += FindTravelTimeBetweenWaypoints(addressof(pCurrent), addressof(pDest), pGroup);

    pCurrent.x = pNode.value.x;
    pCurrent.y = pNode.value.y;

    // next waypt
    pNode = pNode.value.next;
  }

  return uiEtaTime;
}

function FindTravelTimeBetweenWaypoints(pSource: Pointer<WAYPOINT>, pDest: Pointer<WAYPOINT>, pGroup: Pointer<GROUP>): INT32 {
  let ubStart: UINT8 = 0;
  let ubEnd: UINT8 = 0;
  let iDelta: INT32 = 0;
  let iCurrentCostInTime: INT32 = 0;
  let ubCurrentSector: UINT8 = 0;
  let ubDirection: UINT8;
  let iThisCostInTime: INT32;

  // find travel time between waypoints
  if (!pSource || !pDest) {
    // no change
    return iCurrentCostInTime;
  }

  // get start and end setor values
  ubStart = SECTOR(pSource.value.x, pSource.value.y);
  ubEnd = SECTOR(pDest.value.x, pDest.value.y);

  // are we in fact moving?
  if (ubStart == ubEnd) {
    // no
    return iCurrentCostInTime;
  }

  iDelta = (ubEnd - ubStart);

  // which direction are we moving?
  if (iDelta > 0) {
    if (iDelta % (SOUTH_MOVE - 2) == 0) {
      iDelta = (SOUTH_MOVE - 2);
      ubDirection = SOUTH_STRATEGIC_MOVE;
    } else {
      iDelta = EAST_MOVE;
      ubDirection = EAST_STRATEGIC_MOVE;
    }
  } else {
    if (iDelta % (NORTH_MOVE + 2) == 0) {
      iDelta = (NORTH_MOVE + 2);
      ubDirection = NORTH_STRATEGIC_MOVE;
    } else {
      iDelta = WEST_MOVE;
      ubDirection = WEST_STRATEGIC_MOVE;
    }
  }

  for (ubCurrentSector = ubStart; ubCurrentSector != ubEnd; ubCurrentSector += iDelta) {
    // find diff between current and next
    iThisCostInTime = GetSectorMvtTimeForGroup(ubCurrentSector, ubDirection, pGroup);

    if (iThisCostInTime == 0xffffffff) {
      AssertMsg(0, String("Group %d (%s) attempting illegal move from sector %d, dir %d (%s).", pGroup.value.ubGroupID, (pGroup.value.fPlayer) ? "Player" : "AI", ubCurrentSector, ubDirection, gszTerrain[SectorInfo[ubCurrentSector].ubTraversability[ubDirection]]));
    }

    // accumulate it
    iCurrentCostInTime += iThisCostInTime;
  }

  return iCurrentCostInTime;
}

const FOOT_TRAVEL_TIME = 89;
const CAR_TRAVEL_TIME = 30;
const TRUCK_TRAVEL_TIME = 32;
const TRACKED_TRAVEL_TIME = 46;
const AIR_TRAVEL_TIME = 10;

// CHANGES:  ubDirection contains the strategic move value, not the delta value.
function GetSectorMvtTimeForGroup(ubSector: UINT8, ubDirection: UINT8, pGroup: Pointer<GROUP>): INT32 {
  let iTraverseTime: INT32;
  let iBestTraverseTime: INT32 = 1000000;
  let iEncumbrance: INT32;
  let iHighestEncumbrance: INT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let curr: Pointer<PLAYERGROUP>;
  let fFoot: BOOLEAN;
  let fCar: BOOLEAN;
  let fTruck: BOOLEAN;
  let fTracked: BOOLEAN;
  let fAir: BOOLEAN;
  let ubTraverseType: UINT8;
  let ubTraverseMod: UINT8;

  // THIS FUNCTION WAS WRITTEN TO HANDLE MOVEMENT TYPES WHERE MORE THAN ONE TRANSPORTAION TYPE IS AVAILABLE.

  // Determine the group's method(s) of tranportation.  If more than one,
  // we will always use the highest time.
  fFoot = (pGroup.value.ubTransportationMask & FOOT);
  fCar = (pGroup.value.ubTransportationMask & CAR);
  fTruck = (pGroup.value.ubTransportationMask & TRUCK);
  fTracked = (pGroup.value.ubTransportationMask & TRACKED);
  fAir = (pGroup.value.ubTransportationMask & AIR);

  ubTraverseType = SectorInfo[ubSector].ubTraversability[ubDirection];

  if (ubTraverseType == EDGEOFWORLD)
    return 0xffffffff; // can't travel here!

  // ARM: Made air-only travel take its normal time per sector even through towns.  Because Skyrider charges by the sector,
  // not by flying time, it's annoying when his default route detours through a town to save time, but costs extra money.
  // This isn't exactly unrealistic, since the chopper shouldn't be faster flying over a town anyway...  Not that other
  // kinds of travel should be either - but the towns represents a kind of warping of our space-time scale as it is...
  if ((ubTraverseType == TOWN) && (pGroup.value.ubTransportationMask != AIR))
    return 5; // very fast, and vehicle types don't matter.

  if (fFoot) {
    switch (ubTraverseType) {
      case ROAD:
        ubTraverseMod = 100;
        break;
      case PLAINS:
        ubTraverseMod = 85;
        break;
      case SAND:
        ubTraverseMod = 50;
        break;
      case SPARSE:
        ubTraverseMod = 70;
        break;
      case DENSE:
        ubTraverseMod = 60;
        break;
      case SWAMP:
        ubTraverseMod = 35;
        break;
      case WATER:
        ubTraverseMod = 25;
        break;
      case HILLS:
        ubTraverseMod = 50;
        break;
      case GROUNDBARRIER:
        ubTraverseMod = 0;
        break;
      case NS_RIVER:
        ubTraverseMod = 25;
        break;
      case EW_RIVER:
        ubTraverseMod = 25;
        break;
      default:
        Assert(0);
        return 0xffffffff;
    }
    if (ubTraverseMod == 0)
      return 0xffffffff; // Group can't traverse here.
    iTraverseTime = FOOT_TRAVEL_TIME * 100 / ubTraverseMod;
    if (iTraverseTime < iBestTraverseTime)
      iBestTraverseTime = iTraverseTime;

    if (pGroup.value.fPlayer) {
      curr = pGroup.value.pPlayerList;
      while (curr) {
        pSoldier = curr.value.pSoldier;
        if (pSoldier.value.bAssignment != VEHICLE) {
          // Soldier is on foot and travelling.  Factor encumbrance into movement rate.
          iEncumbrance = CalculateCarriedWeight(pSoldier);
          if (iEncumbrance > iHighestEncumbrance) {
            iHighestEncumbrance = iEncumbrance;
          }
        }
        curr = curr.value.next;
      }
      if (iHighestEncumbrance > 100) {
        iBestTraverseTime = iBestTraverseTime * iHighestEncumbrance / 100;
      }
    }
  }
  if (fCar) {
    switch (ubTraverseType) {
      case ROAD:
        ubTraverseMod = 100;
        break;
      default:
        ubTraverseMod = 0;
        break;
    }
    if (ubTraverseMod == 0)
      return 0xffffffff; // Group can't traverse here.
    iTraverseTime = CAR_TRAVEL_TIME * 100 / ubTraverseMod;
    if (iTraverseTime < iBestTraverseTime)
      iBestTraverseTime = iTraverseTime;
  }
  if (fTruck) {
    switch (ubTraverseType) {
      case ROAD:
        ubTraverseMod = 100;
        break;
      case PLAINS:
        ubTraverseMod = 75;
        break;
      case SPARSE:
        ubTraverseMod = 60;
        break;
      case HILLS:
        ubTraverseMod = 50;
        break;
      default:
        ubTraverseMod = 0;
        break;
    }
    if (ubTraverseMod == 0)
      return 0xffffffff; // Group can't traverse here.
    iTraverseTime = TRUCK_TRAVEL_TIME * 100 / ubTraverseMod;
    if (iTraverseTime < iBestTraverseTime)
      iBestTraverseTime = iTraverseTime;
  }
  if (fTracked) {
    switch (ubTraverseType) {
      case ROAD:
        ubTraverseMod = 100;
        break;
      case PLAINS:
        ubTraverseMod = 100;
        break;
      case SAND:
        ubTraverseMod = 70;
        break;
      case SPARSE:
        ubTraverseMod = 60;
        break;
      case HILLS:
        ubTraverseMod = 60;
        break;
      case NS_RIVER:
        ubTraverseMod = 20;
        break;
      case EW_RIVER:
        ubTraverseMod = 20;
        break;
      case WATER:
        ubTraverseMod = 10;
        break;
      default:
        ubTraverseMod = 0;
        break;
    }
    if (ubTraverseMod == 0)
      return 0xffffffff; // Group can't traverse here.
    iTraverseTime = TRACKED_TRAVEL_TIME * 100 / ubTraverseMod;
    if (iTraverseTime < iBestTraverseTime)
      iBestTraverseTime = iTraverseTime;
  }
  if (fAir) {
    iTraverseTime = AIR_TRAVEL_TIME;
    if (iTraverseTime < iBestTraverseTime)
      iBestTraverseTime = iTraverseTime;
  }
  return iBestTraverseTime;
}

// Counts the number of live mercs in any given sector.
function PlayerMercsInSector(ubSectorX: UINT8, ubSectorY: UINT8, ubSectorZ: UINT8): UINT8 {
  let pGroup: Pointer<GROUP>;
  let pPlayer: Pointer<PLAYERGROUP>;
  let ubNumMercs: UINT8 = 0;
  pGroup = gpGroupList;
  while (pGroup) {
    if (pGroup.value.fPlayer && !pGroup.value.fBetweenSectors) {
      if (pGroup.value.ubSectorX == ubSectorX && pGroup.value.ubSectorY == ubSectorY && pGroup.value.ubSectorZ == ubSectorZ) {
        // we have a group, make sure that it isn't a group containing only dead members.
        pPlayer = pGroup.value.pPlayerList;
        while (pPlayer) {
          // robots count as mercs here, because they can fight, but vehicles don't
          if ((pPlayer.value.pSoldier.value.bLife) && !(pPlayer.value.pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
            ubNumMercs++;
          }
          pPlayer = pPlayer.value.next;
        }
      }
    }
    pGroup = pGroup.value.next;
  }
  return ubNumMercs;
}

function PlayerGroupsInSector(ubSectorX: UINT8, ubSectorY: UINT8, ubSectorZ: UINT8): UINT8 {
  let pGroup: Pointer<GROUP>;
  let pPlayer: Pointer<PLAYERGROUP>;
  let ubNumGroups: UINT8 = 0;
  pGroup = gpGroupList;
  while (pGroup) {
    if (pGroup.value.fPlayer && !pGroup.value.fBetweenSectors) {
      if (pGroup.value.ubSectorX == ubSectorX && pGroup.value.ubSectorY == ubSectorY && pGroup.value.ubSectorZ == ubSectorZ) {
        // we have a group, make sure that it isn't a group containing only dead members.
        pPlayer = pGroup.value.pPlayerList;
        while (pPlayer) {
          if (pPlayer.value.pSoldier.value.bLife) {
            ubNumGroups++;
            break;
          }
          pPlayer = pPlayer.value.next;
        }
      }
    }
    pGroup = pGroup.value.next;
  }
  return ubNumGroups;
}

// is the player group with this id in motion?
function PlayerIDGroupInMotion(ubID: UINT8): BOOLEAN {
  let pGroup: Pointer<GROUP>;

  // get the group
  pGroup = GetGroup(ubID);

  // make sure it is valid

  // no group
  if (pGroup == NULL) {
    return FALSE;
  }

  return PlayerGroupInMotion(pGroup);
}

// is the player group in motion?
function PlayerGroupInMotion(pGroup: Pointer<GROUP>): BOOLEAN {
  return pGroup.value.fBetweenSectors;
}

// get travel time for this group
function GetTravelTimeForGroup(ubSector: UINT8, ubDirection: UINT8, ubGroup: UINT8): INT32 {
  let pGroup: Pointer<GROUP>;

  // get the group
  pGroup = GetGroup(ubGroup);

  // make sure it is valid
  Assert(pGroup);

  return GetSectorMvtTimeForGroup(ubSector, ubDirection, pGroup);
}

function GetTravelTimeForFootTeam(ubSector: UINT8, ubDirection: UINT8): INT32 {
  let Group: GROUP;

  // group going on foot
  Group.ubTransportationMask = FOOT;

  return GetSectorMvtTimeForGroup(ubSector, ubDirection, addressof(Group));
}

// Add this group to the current battle fray!
// NOTE:  For enemies, only MAX_STRATEGIC_TEAM_SIZE at a time can be in a battle, so
// if it ever gets past that, god help the player, but we'll have to insert them
// as those slots free up.
function HandleArrivalOfReinforcements(pGroup: Pointer<GROUP>): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pSector: Pointer<SECTORINFO>;
  let iNumEnemiesInSector: INT32;
  let cnt: INT32;

  if (pGroup.value.fPlayer) {
    // We don't have to worry about filling up the player slots, because it is impossible
    // to have more player's in the game then the number of slots available for the player.
    let pPlayer: Pointer<PLAYERGROUP>;
    let ubStrategicInsertionCode: UINT8;
    // First, determine which entrypoint to use, based on the travel direction of the group.
    if (pGroup.value.ubSectorX < pGroup.value.ubPrevX)
      ubStrategicInsertionCode = INSERTION_CODE_EAST;
    else if (pGroup.value.ubSectorX > pGroup.value.ubPrevX)
      ubStrategicInsertionCode = INSERTION_CODE_WEST;
    else if (pGroup.value.ubSectorY < pGroup.value.ubPrevY)
      ubStrategicInsertionCode = INSERTION_CODE_SOUTH;
    else if (pGroup.value.ubSectorY > pGroup.value.ubPrevY)
      ubStrategicInsertionCode = INSERTION_CODE_NORTH;
    else {
      Assert(0);
      return;
    }
    pPlayer = pGroup.value.pPlayerList;

    cnt = 0;

    while (pPlayer) {
      pSoldier = pPlayer.value.pSoldier;
      Assert(pSoldier);
      pSoldier.value.ubStrategicInsertionCode = ubStrategicInsertionCode;
      UpdateMercInSector(pSoldier, pGroup.value.ubSectorX, pGroup.value.ubSectorY, 0);
      pPlayer = pPlayer.value.next;

      // DO arrives quote....
      if (cnt == 0) {
        TacticalCharacterDialogue(pSoldier, QUOTE_MERC_REACHED_DESTINATION);
      }
      cnt++;
    }
    ScreenMsg(FONT_YELLOW, MSG_INTERFACE, Message[STR_PLAYER_REINFORCEMENTS]);
  } else {
    gfPendingEnemies = TRUE;
    ResetMortarsOnTeamCount();
    AddPossiblePendingEnemiesToBattle();
  }
  // Update the known number of enemies in the sector.
  pSector = addressof(SectorInfo[SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY)]);
  iNumEnemiesInSector = NumEnemiesInSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
  if (iNumEnemiesInSector) {
    if (pSector.value.bLastKnownEnemies >= 0) {
      pSector.value.bLastKnownEnemies = iNumEnemiesInSector;
    }
    // if we don't know how many enemies there are, then we can't update this value.
  } else {
    pSector.value.bLastKnownEnemies = 0;
  }
}

function PlayersBetweenTheseSectors(sSource: INT16, sDest: INT16, iCountEnter: Pointer<INT32>, iCountExit: Pointer<INT32>, fAboutToArriveEnter: Pointer<BOOLEAN>): BOOLEAN {
  let curr: Pointer<GROUP> = gpGroupList;
  let sBattleSector: INT16 = -1;
  let fMayRetreatFromBattle: BOOLEAN = FALSE;
  let fRetreatingFromBattle: BOOLEAN = FALSE;
  let fHandleRetreats: BOOLEAN = FALSE;
  let fHelicopterGroup: BOOLEAN = FALSE;
  let ubMercsInGroup: UINT8 = 0;

  *iCountEnter = 0;
  *iCountExit = 0;
  *fAboutToArriveEnter = FALSE;

  if (gpBattleGroup) {
    // Assert( gfPreBattleInterfaceActive );
    sBattleSector = SECTOR(gpBattleGroup.value.ubSectorX, gpBattleGroup.value.ubSectorY);
  }

  // debug only
  if (gfDisplayPotentialRetreatPaths == TRUE) {
    // Assert( gfPreBattleInterfaceActive );
  }

  // get number of characters entering/existing between these two sectors.  Special conditions during
  // pre-battle interface to return where this function is used to show potential retreating directions instead!

  //	check all groups
  while (curr) {
    // if player group
    if (curr.value.fPlayer == TRUE) {
      fHelicopterGroup = IsGroupTheHelicopterGroup(curr);

      // if this group is aboard the helicopter and we're showing the airspace layer, don't count any mercs aboard the
      // chopper, because the chopper icon itself serves the function of showing the location/size of this group
      if (!fHelicopterGroup || !fShowAircraftFlag) {
        // if only showing retreat paths, ignore groups not in the battle sector
        // if NOT showing retreat paths, ignore groups not between sectors
        if ((gfDisplayPotentialRetreatPaths == TRUE) && (sBattleSector == sSource) || (gfDisplayPotentialRetreatPaths == FALSE) && (curr.value.fBetweenSectors == TRUE)) {
          fMayRetreatFromBattle = FALSE;
          fRetreatingFromBattle = FALSE;

          if ((sBattleSector == sSource) && (SECTOR(curr.value.ubSectorX, curr.value.ubSectorY) == sSource) && (SECTOR(curr.value.ubPrevX, curr.value.ubPrevY) == sDest)) {
            fMayRetreatFromBattle = TRUE;
          }

          if ((sBattleSector == sDest) && (SECTOR(curr.value.ubSectorX, curr.value.ubSectorY) == sDest) && (SECTOR(curr.value.ubPrevX, curr.value.ubPrevY) == sSource)) {
            fRetreatingFromBattle = TRUE;
          }

          ubMercsInGroup = curr.value.ubGroupSize;

          if (((SECTOR(curr.value.ubSectorX, curr.value.ubSectorY) == sSource) && (SECTOR(curr.value.ubNextX, curr.value.ubNextY) == sDest)) || (fMayRetreatFromBattle == TRUE)) {
            // if it's a valid vehicle, but not the helicopter (which can fly empty)
            if (curr.value.fVehicle && !fHelicopterGroup && (GivenMvtGroupIdFindVehicleId(curr.value.ubGroupID) != -1)) {
              // make sure empty vehicles (besides helicopter) aren't in motion!
              Assert(ubMercsInGroup > 0);
              // subtract 1, we don't wanna count the vehicle itself for purposes of showing a number on the map
              ubMercsInGroup--;
            }

            *iCountEnter += ubMercsInGroup;

            if ((curr.value.uiArrivalTime - GetWorldTotalMin() <= ABOUT_TO_ARRIVE_DELAY) || (fMayRetreatFromBattle == TRUE)) {
              *fAboutToArriveEnter = TRUE;
            }
          } else if ((SECTOR(curr.value.ubSectorX, curr.value.ubSectorY) == sDest) && (SECTOR(curr.value.ubNextX, curr.value.ubNextY) == sSource) || (fRetreatingFromBattle == TRUE)) {
            // if it's a valid vehicle, but not the helicopter (which can fly empty)
            if (curr.value.fVehicle && !fHelicopterGroup && (GivenMvtGroupIdFindVehicleId(curr.value.ubGroupID) != -1)) {
              // make sure empty vehicles (besides helicopter) aren't in motion!
              Assert(ubMercsInGroup > 0);
              // subtract 1, we don't wanna count the vehicle itself for purposes of showing a number on the map
              ubMercsInGroup--;
            }

            *iCountExit += ubMercsInGroup;
          }
        }
      }
    }

    // next group
    curr = curr.value.next;
  }

  // if there was actually anyone leaving this sector and entering next
  if (*iCountEnter > 0) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function MoveAllGroupsInCurrentSectorToSector(ubSectorX: UINT8, ubSectorY: UINT8, ubSectorZ: UINT8): void {
  let pGroup: Pointer<GROUP>;
  let pPlayer: Pointer<PLAYERGROUP>;
  pGroup = gpGroupList;
  while (pGroup) {
    if (pGroup.value.fPlayer && pGroup.value.ubSectorX == gWorldSectorX && pGroup.value.ubSectorY == gWorldSectorY && pGroup.value.ubSectorZ == gbWorldSectorZ && !pGroup.value.fBetweenSectors) {
      // This player group is in the currently loaded sector...
      pGroup.value.ubSectorX = ubSectorX;
      pGroup.value.ubSectorY = ubSectorY;
      pGroup.value.ubSectorZ = ubSectorZ;
      pPlayer = pGroup.value.pPlayerList;
      while (pPlayer) {
        pPlayer.value.pSoldier.value.sSectorX = ubSectorX;
        pPlayer.value.pSoldier.value.sSectorY = ubSectorY;
        pPlayer.value.pSoldier.value.bSectorZ = ubSectorZ;
        pPlayer.value.pSoldier.value.fBetweenSectors = FALSE;
        pPlayer = pPlayer.value.next;
      }
    }
    pGroup = pGroup.value.next;
  }
  CheckAndHandleUnloadingOfCurrentWorld();
}

function GetGroupPosition(ubNextX: Pointer<UINT8>, ubNextY: Pointer<UINT8>, ubPrevX: Pointer<UINT8>, ubPrevY: Pointer<UINT8>, uiTraverseTime: Pointer<UINT32>, uiArriveTime: Pointer<UINT32>, ubGroupId: UINT8): void {
  let pGroup: Pointer<GROUP>;

  // get the group
  pGroup = GetGroup(ubGroupId);

  // make sure it is valid

  // no group
  if (pGroup == NULL) {
    *ubNextX = 0;
    *ubNextY = 0;
    *ubPrevX = 0;
    *ubPrevY = 0;
    *uiTraverseTime = 0;
    *uiArriveTime = 0;
    return;
  }

  // valid group, grab values
  *ubNextX = pGroup.value.ubNextX;
  *ubNextY = pGroup.value.ubNextY;
  *ubPrevX = pGroup.value.ubPrevX;
  *ubPrevY = pGroup.value.ubPrevY;
  *uiTraverseTime = pGroup.value.uiTraverseTime;
  *uiArriveTime = pGroup.value.uiArrivalTime;

  return;
}

// this is only for grunts who were in mvt groups between sectors and are set to a new squad...NOTHING ELSE!!!!!
function SetGroupPosition(ubNextX: UINT8, ubNextY: UINT8, ubPrevX: UINT8, ubPrevY: UINT8, uiTraverseTime: UINT32, uiArriveTime: UINT32, ubGroupId: UINT8): void {
  let pGroup: Pointer<GROUP>;
  let pPlayer: Pointer<PLAYERGROUP>;

  // get the group
  pGroup = GetGroup(ubGroupId);

  // no group
  if (pGroup == NULL) {
    return;
  }

  // valid group, grab values
  pGroup.value.ubNextX = ubNextX;
  pGroup.value.ubNextY = ubNextY;
  pGroup.value.ubPrevX = ubPrevX;
  pGroup.value.ubPrevY = ubPrevY;
  pGroup.value.uiTraverseTime = uiTraverseTime;
  SetGroupArrivalTime(pGroup, uiArriveTime);
  pGroup.value.fBetweenSectors = TRUE;

  AddWaypointToPGroup(pGroup, pGroup.value.ubNextX, pGroup.value.ubNextY);
  // now, if player group set all grunts in the group to be between secotrs
  if (pGroup.value.fPlayer == TRUE) {
    pPlayer = pGroup.value.pPlayerList;
    while (pPlayer) {
      pPlayer.value.pSoldier.value.fBetweenSectors = TRUE;
      pPlayer = pPlayer.value.next;
    }
  }

  return;
}

function SaveStrategicMovementGroupsToSaveGameFile(hFile: HWFILE): BOOLEAN {
  let pGroup: Pointer<GROUP> = NULL;
  let uiNumberOfGroups: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;

  pGroup = gpGroupList;

  // Count the number of active groups
  while (pGroup) {
    uiNumberOfGroups++;
    pGroup = pGroup.value.next;
  }

  // Save the number of movement groups to the saved game file
  FileWrite(hFile, addressof(uiNumberOfGroups), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  pGroup = gpGroupList;

  // Loop through the linked lists and add each node
  while (pGroup) {
    // Save each node in the LL
    FileWrite(hFile, pGroup, sizeof(GROUP), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(GROUP)) {
      // Error Writing group node to disk
      return FALSE;
    }

    //
    // Save the linked list, for the current type of group
    //

    // If its a player group
    if (pGroup.value.fPlayer) {
      // if there is a player list, add it
      if (pGroup.value.ubGroupSize) {
        // Save the player group list
        SavePlayerGroupList(hFile, pGroup);
      }
    } else // else its an enemy group
    {
      // Make sure the pointer is valid
      Assert(pGroup.value.pEnemyGroup);

      //
      SaveEnemyGroupStruct(hFile, pGroup);
    }

    // Save the waypoint list for the group, if they have one
    SaveWayPointList(hFile, pGroup);

    pGroup = pGroup.value.next;
  }

  // Save the unique id mask
  FileWrite(hFile, uniqueIDMask, sizeof(UINT32) * 8, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32) * 8) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  return TRUE;
}

function LoadStrategicMovementGroupsFromSavedGameFile(hFile: HWFILE): BOOLEAN {
  let pGroup: Pointer<GROUP> = NULL;
  let pTemp: Pointer<GROUP> = NULL;
  let uiNumberOfGroups: UINT32 = 0;
  // UINT32	uiNumBytesWritten=0;
  let uiNumBytesRead: UINT32 = 0;
  let cnt: UINT32;
  let bit: UINT32;
  let index: UINT32;
  let mask: UINT32;
  let ubNumPlayerGroupsEmpty: UINT8 = 0;
  let ubNumEnemyGroupsEmpty: UINT8 = 0;
  let ubNumPlayerGroupsFull: UINT8 = 0;
  let ubNumEnemyGroupsFull: UINT8 = 0;

  // delete the existing group list
  while (gpGroupList)
    RemoveGroupFromList(gpGroupList);

  // load the number of nodes in the list
  FileRead(hFile, addressof(uiNumberOfGroups), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  pGroup = gpGroupList;

  // loop through all the nodes and add them to the LL
  for (cnt = 0; cnt < uiNumberOfGroups; cnt++) {
    // allocate memory for the node
    pTemp = MemAlloc(sizeof(GROUP));
    if (pTemp == NULL)
      return FALSE;
    memset(pTemp, 0, sizeof(GROUP));

    // Read in the node
    FileRead(hFile, pTemp, sizeof(GROUP), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(GROUP)) {
      // Error Writing size of L.L. to disk
      return FALSE;
    }

    //
    // Add either the pointer or the linked list.
    //

    if (pTemp.value.fPlayer) {
      // if there is a player list, add it
      if (pTemp.value.ubGroupSize) {
        // Save the player group list
        LoadPlayerGroupList(hFile, addressof(pTemp));
      }
    } else // else its an enemy group
    {
      LoadEnemyGroupStructFromSavedGame(hFile, pTemp);
    }

    // Save the waypoint list for the group, if they have one
    LoadWayPointList(hFile, pTemp);

    pTemp.value.next = NULL;

    // add the node to the list

    // if its the firs node
    if (cnt == 0) {
      gpGroupList = pTemp;
      pGroup = gpGroupList;
    } else {
      pGroup.value.next = pTemp;
      pGroup = pGroup.value.next;
    }
  }

  // Load the unique id mask
  FileRead(hFile, uniqueIDMask, sizeof(UINT32) * 8, addressof(uiNumBytesRead));

  //@@@ TEMP!
  // Rebuild the uniqueIDMask as a very old bug broke the uniqueID assignments in extremely rare cases.
  memset(uniqueIDMask, 0, sizeof(UINT32) * 8);
  pGroup = gpGroupList;
  while (pGroup) {
    if (pGroup.value.fPlayer) {
      if (pGroup.value.ubGroupSize) {
        ubNumPlayerGroupsFull++;
      } else {
        ubNumPlayerGroupsEmpty++;
      }
    } else {
      if (pGroup.value.ubGroupSize) {
        ubNumEnemyGroupsFull++;
      } else {
        ubNumEnemyGroupsEmpty++;
      }
    }
    if (ubNumPlayerGroupsEmpty || ubNumEnemyGroupsEmpty) {
      // report error?
    }
    index = pGroup.value.ubGroupID / 32;
    bit = pGroup.value.ubGroupID % 32;
    mask = 1 << bit;
    uniqueIDMask[index] += mask;
    pGroup = pGroup.value.next;
  }

  if (uiNumBytesRead != sizeof(UINT32) * 8) {
    return FALSE;
  }

  return TRUE;
}

// Saves the Player's group list to the saved game file
function SavePlayerGroupList(hFile: HWFILE, pGroup: Pointer<GROUP>): BOOLEAN {
  let uiNumberOfNodesInList: UINT32 = 0;
  let pTemp: Pointer<PLAYERGROUP> = NULL;
  let uiNumBytesWritten: UINT32 = 0;
  let uiProfileID: UINT32;

  pTemp = pGroup.value.pPlayerList;

  while (pTemp) {
    uiNumberOfNodesInList++;
    pTemp = pTemp.value.next;
  }

  // Save the number of nodes in the list
  FileWrite(hFile, addressof(uiNumberOfNodesInList), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  pTemp = pGroup.value.pPlayerList;

  // Loop trhough and save only the players profile id
  while (pTemp) {
    // Save the ubProfile ID for this node
    uiProfileID = pTemp.value.ubProfileID;
    FileWrite(hFile, addressof(uiProfileID), sizeof(UINT32), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(UINT32)) {
      // Error Writing size of L.L. to disk
      return FALSE;
    }

    pTemp = pTemp.value.next;
  }

  return TRUE;
}

function LoadPlayerGroupList(hFile: HWFILE, pGroup: Pointer<Pointer<GROUP>>): BOOLEAN {
  let uiNumberOfNodesInList: UINT32 = 0;
  let pTemp: Pointer<PLAYERGROUP> = NULL;
  let pHead: Pointer<PLAYERGROUP> = NULL;
  let uiNumberOfNodes: UINT32 = 0;
  let uiProfileID: UINT32 = 0;
  let uiNumBytesRead: UINT32;
  let cnt: UINT32 = 0;
  let sTempID: INT16;
  let pTempGroup: Pointer<GROUP> = *pGroup;

  //	pTemp = pGroup;

  //	pHead = *pGroup->pPlayerList;

  // Load the number of nodes in the player list
  FileRead(hFile, addressof(uiNumberOfNodes), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  // loop through all the nodes and set them up
  for (cnt = 0; cnt < uiNumberOfNodes; cnt++) {
    // allcate space for the current node
    pTemp = MemAlloc(sizeof(PLAYERGROUP));
    if (pTemp == NULL)
      return FALSE;

    // Load the ubProfile ID for this node
    FileRead(hFile, addressof(uiProfileID), sizeof(UINT32), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(UINT32)) {
      // Error Writing size of L.L. to disk
      return FALSE;
    }

    // Set up the current node
    pTemp.value.ubProfileID = uiProfileID;
    sTempID = GetSoldierIDFromMercID(pTemp.value.ubProfileID);

    // Should never happen
    // Assert( sTempID != -1 );
    pTemp.value.ubID = sTempID;

    pTemp.value.pSoldier = addressof(Menptr[pTemp.value.ubID]);

    pTemp.value.next = NULL;

    // if its the first time through
    if (cnt == 0) {
      pTempGroup.value.pPlayerList = pTemp;
      pHead = pTemp;
    } else {
      pHead.value.next = pTemp;

      // move to the next node
      pHead = pHead.value.next;
    }
  }

  return TRUE;
}

// Saves the enemy group struct to the saved game struct
function SaveEnemyGroupStruct(hFile: HWFILE, pGroup: Pointer<GROUP>): BOOLEAN {
  let uiNumBytesWritten: UINT32 = 0;

  // Save the enemy struct info to the saved game file
  FileWrite(hFile, pGroup.value.pEnemyGroup, sizeof(ENEMYGROUP), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(ENEMYGROUP)) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  return TRUE;
}

// Loads the enemy group struct from the saved game file
function LoadEnemyGroupStructFromSavedGame(hFile: HWFILE, pGroup: Pointer<GROUP>): BOOLEAN {
  let uiNumBytesRead: UINT32 = 0;
  let pEnemyGroup: Pointer<ENEMYGROUP> = NULL;

  // Alllocate memory for the enemy struct
  pEnemyGroup = MemAlloc(sizeof(ENEMYGROUP));
  if (pEnemyGroup == NULL)
    return FALSE;
  memset(pEnemyGroup, 0, sizeof(ENEMYGROUP));

  // Load the enemy struct
  FileRead(hFile, pEnemyGroup, sizeof(ENEMYGROUP), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(ENEMYGROUP)) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  // Assign the struct to the group list
  pGroup.value.pEnemyGroup = pEnemyGroup;

  return TRUE;
}

function CheckMembersOfMvtGroupAndComplainAboutBleeding(pSoldier: Pointer<SOLDIERTYPE>): void {
  // run through members of group
  let ubGroupId: UINT8 = pSoldier.value.ubGroupID;
  let pGroup: Pointer<GROUP>;
  let pPlayer: Pointer<PLAYERGROUP> = NULL;
  let pCurrentSoldier: Pointer<SOLDIERTYPE> = NULL;

  pGroup = GetGroup(ubGroupId);

  // valid group?
  if (pGroup == NULL) {
    return;
  }

  // player controlled group?
  if (pGroup.value.fPlayer == FALSE) {
    return;
  }

  // make sure there are members in the group..if so, then run through and make each bleeder compain
  pPlayer = pGroup.value.pPlayerList;

  // is there a player list?
  if (pPlayer == NULL) {
    return;
  }

  BeginLoggingForBleedMeToos(TRUE);

  while (pPlayer) {
    pCurrentSoldier = pPlayer.value.pSoldier;

    if (pCurrentSoldier.value.bBleeding > 0) {
      // complain about bleeding
      TacticalCharacterDialogue(pCurrentSoldier, QUOTE_STARTING_TO_BLEED);
    }
    pPlayer = pPlayer.value.next;
  }

  BeginLoggingForBleedMeToos(FALSE);
}

function SaveWayPointList(hFile: HWFILE, pGroup: Pointer<GROUP>): BOOLEAN {
  let cnt: UINT32 = 0;
  let uiNumberOfWayPoints: UINT32 = 0;
  let uiNumBytesWritten: UINT32 = 0;
  let pWayPoints: Pointer<WAYPOINT> = pGroup.value.pWaypoints;

  // loop trhough and count all the node in the waypoint list
  while (pWayPoints != NULL) {
    uiNumberOfWayPoints++;
    pWayPoints = pWayPoints.value.next;
  }

  // Save the number of waypoints
  FileWrite(hFile, addressof(uiNumberOfWayPoints), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  if (uiNumberOfWayPoints) {
    pWayPoints = pGroup.value.pWaypoints;
    for (cnt = 0; cnt < uiNumberOfWayPoints; cnt++) {
      // Save the waypoint node
      FileWrite(hFile, pWayPoints, sizeof(WAYPOINT), addressof(uiNumBytesWritten));
      if (uiNumBytesWritten != sizeof(WAYPOINT)) {
        // Error Writing size of L.L. to disk
        return FALSE;
      }

      // Advance to the next waypoint
      pWayPoints = pWayPoints.value.next;
    }
  }

  return TRUE;
}

function LoadWayPointList(hFile: HWFILE, pGroup: Pointer<GROUP>): BOOLEAN {
  let cnt: UINT32 = 0;
  let uiNumberOfWayPoints: UINT32 = 0;
  let uiNumBytesRead: UINT32 = 0;
  let pWayPoints: Pointer<WAYPOINT> = pGroup.value.pWaypoints;
  let pTemp: Pointer<WAYPOINT> = NULL;

  // Load the number of waypoints
  FileRead(hFile, addressof(uiNumberOfWayPoints), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    // Error Writing size of L.L. to disk
    return FALSE;
  }

  if (uiNumberOfWayPoints) {
    pWayPoints = pGroup.value.pWaypoints;
    for (cnt = 0; cnt < uiNumberOfWayPoints; cnt++) {
      // Allocate memory for the node
      pTemp = MemAlloc(sizeof(WAYPOINT));
      if (pTemp == NULL)
        return FALSE;
      memset(pTemp, 0, sizeof(WAYPOINT));

      // Load the waypoint node
      FileRead(hFile, pTemp, sizeof(WAYPOINT), addressof(uiNumBytesRead));
      if (uiNumBytesRead != sizeof(WAYPOINT)) {
        // Error Writing size of L.L. to disk
        return FALSE;
      }

      pTemp.value.next = NULL;

      // if its the first node
      if (cnt == 0) {
        pGroup.value.pWaypoints = pTemp;
        pWayPoints = pTemp;
      } else {
        pWayPoints.value.next = pTemp;

        // Advance to the next waypoint
        pWayPoints = pWayPoints.value.next;
      }
    }
  } else
    pGroup.value.pWaypoints = NULL;

  return TRUE;
}

function CalculateGroupRetreatSector(pGroup: Pointer<GROUP>): void {
  let pSector: Pointer<SECTORINFO>;
  let uiSectorID: UINT32;

  uiSectorID = SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
  pSector = addressof(SectorInfo[uiSectorID]);

  if (pSector.value.ubTraversability[NORTH_STRATEGIC_MOVE] != GROUNDBARRIER && pSector.value.ubTraversability[NORTH_STRATEGIC_MOVE] != EDGEOFWORLD) {
    pGroup.value.ubPrevX = pGroup.value.ubSectorX;
    pGroup.value.ubPrevY = pGroup.value.ubSectorY - 1;
  } else if (pSector.value.ubTraversability[EAST_STRATEGIC_MOVE] != GROUNDBARRIER && pSector.value.ubTraversability[EAST_STRATEGIC_MOVE] != EDGEOFWORLD) {
    pGroup.value.ubPrevX = pGroup.value.ubSectorX + 1;
    pGroup.value.ubPrevY = pGroup.value.ubSectorY;
  } else if (pSector.value.ubTraversability[WEST_STRATEGIC_MOVE] != GROUNDBARRIER && pSector.value.ubTraversability[WEST_STRATEGIC_MOVE] != EDGEOFWORLD) {
    pGroup.value.ubPrevX = pGroup.value.ubSectorX - 1;
    pGroup.value.ubPrevY = pGroup.value.ubSectorY;
  } else if (pSector.value.ubTraversability[SOUTH_STRATEGIC_MOVE] != GROUNDBARRIER && pSector.value.ubTraversability[SOUTH_STRATEGIC_MOVE] != EDGEOFWORLD) {
    pGroup.value.ubPrevX = pGroup.value.ubSectorX;
    pGroup.value.ubPrevY = pGroup.value.ubSectorY + 1;
  } else {
    AssertMsg(0, String("Player group cannot retreat from sector %c%d ", pGroup.value.ubSectorY + 'A' - 1, pGroup.value.ubSectorX));
    return;
  }
  if (pGroup.value.fPlayer) {
    // update the previous sector for the mercs
    let pPlayer: Pointer<PLAYERGROUP>;
    pPlayer = pGroup.value.pPlayerList;
    while (pPlayer) {
      pPlayer.value.pSoldier.value.ubPrevSectorID = SECTOR(pGroup.value.ubPrevX, pGroup.value.ubPrevY);
      pPlayer = pPlayer.value.next;
    }
  }
}

// Called when all checks have been made for the group (if possible to retreat, etc.)  This function
// blindly determines where to move the group.
function RetreatGroupToPreviousSector(pGroup: Pointer<GROUP>): void {
  let ubSector: UINT8;
  let ubDirection: UINT8 = 255;
  let iVehId: INT32;
  let dx: INT32;
  let dy: INT32;
  Assert(pGroup);
  AssertMsg(!pGroup.value.fBetweenSectors, "Can't retreat a group when between sectors!");

  if (pGroup.value.ubPrevX != 16 || pGroup.value.ubPrevY != 16) {
    // Group has a previous sector
    pGroup.value.ubNextX = pGroup.value.ubPrevX;
    pGroup.value.ubNextY = pGroup.value.ubPrevY;

    // Determine the correct direction.
    dx = pGroup.value.ubNextX - pGroup.value.ubSectorX;
    dy = pGroup.value.ubNextY - pGroup.value.ubSectorY;
    if (dy == -1 && !dx)
      ubDirection = NORTH_STRATEGIC_MOVE;
    else if (dx == 1 && !dy)
      ubDirection = EAST_STRATEGIC_MOVE;
    else if (dy == 1 && !dx)
      ubDirection = SOUTH_STRATEGIC_MOVE;
    else if (dx == -1 && !dy)
      ubDirection = WEST_STRATEGIC_MOVE;
    else {
      AssertMsg(0, String("Player group attempting illegal retreat from %c%d to %c%d.", pGroup.value.ubSectorY + 'A' - 1, pGroup.value.ubSectorX, pGroup.value.ubNextY + 'A' - 1, pGroup.value.ubNextX));
    }
  } else {
    // Group doesn't have a previous sector.  Create one, then recurse
    CalculateGroupRetreatSector(pGroup);
    RetreatGroupToPreviousSector(pGroup);
  }

  // Calc time to get to next waypoint...
  ubSector = SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
  pGroup.value.uiTraverseTime = GetSectorMvtTimeForGroup(ubSector, ubDirection, pGroup);
  if (pGroup.value.uiTraverseTime == 0xffffffff) {
    AssertMsg(0, String("Group %d (%s) attempting illegal move from %c%d to %c%d (%s).", pGroup.value.ubGroupID, (pGroup.value.fPlayer) ? "Player" : "AI", pGroup.value.ubSectorY + 'A', pGroup.value.ubSectorX, pGroup.value.ubNextY + 'A', pGroup.value.ubNextX, gszTerrain[SectorInfo[ubSector].ubTraversability[ubDirection]]));
  }

  if (!pGroup.value.uiTraverseTime) {
    // Because we are in the strategic layer, don't make the arrival instantaneous (towns).
    pGroup.value.uiTraverseTime = 5;
  }

  SetGroupArrivalTime(pGroup, GetWorldTotalMin() + pGroup.value.uiTraverseTime);
  pGroup.value.fBetweenSectors = TRUE;
  pGroup.value.uiFlags |= GROUPFLAG_JUST_RETREATED_FROM_BATTLE;

  if (pGroup.value.fVehicle == TRUE) {
    // vehicle, set fact it is between sectors too
    if ((iVehId = (GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID))) != -1) {
      pVehicleList[iVehId].fBetweenSectors = TRUE;
    }
  }

  // Post the event!
  if (!AddStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.uiArrivalTime, pGroup.value.ubGroupID))
    AssertMsg(0, "Failed to add movement event.");

  // For the case of player groups, we need to update the information of the soldiers.
  if (pGroup.value.fPlayer) {
    let curr: Pointer<PLAYERGROUP>;
    curr = pGroup.value.pPlayerList;

    if (pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY > GetWorldTotalMin()) {
      AddStrategicEvent(EVENT_GROUP_ABOUT_TO_ARRIVE, pGroup.value.uiArrivalTime - ABOUT_TO_ARRIVE_DELAY, pGroup.value.ubGroupID);
    }

    while (curr) {
      curr.value.pSoldier.value.fBetweenSectors = TRUE;

      // OK, Remove the guy from tactical engine!
      RemoveSoldierFromTacticalSector(curr.value.pSoldier, TRUE);

      curr = curr.value.next;
    }
  }
}

function FindMovementGroupInSector(ubSectorX: UINT8, ubSectorY: UINT8, fPlayer: BOOLEAN): Pointer<GROUP> {
  let pGroup: Pointer<GROUP>;
  pGroup = gpGroupList;
  while (pGroup) {
    if (pGroup.value.fPlayer) {
      // NOTE: These checks must always match the INVOLVED group checks in PBI!!!
      if (fPlayer && pGroup.value.ubGroupSize && !pGroup.value.fBetweenSectors && pGroup.value.ubSectorX == ubSectorX && pGroup.value.ubSectorY == ubSectorY && !pGroup.value.ubSectorZ && !GroupHasInTransitDeadOrPOWMercs(pGroup) && (!IsGroupTheHelicopterGroup(pGroup) || !fHelicopterIsAirBorne)) {
        return pGroup;
      }
    } else if (!fPlayer && pGroup.value.ubSectorX == ubSectorX && pGroup.value.ubSectorY == ubSectorY && !pGroup.value.ubSectorZ)
      return pGroup;

    pGroup = pGroup.value.next;
  }
  return NULL;
}

function GroupAtFinalDestination(pGroup: Pointer<GROUP>): BOOLEAN {
  let wp: Pointer<WAYPOINT>;

  if (pGroup.value.ubMoveType != ONE_WAY)
    return FALSE; // Group will continue to patrol, hence never stops.

  // Determine if we are at the final waypoint.
  wp = GetFinalWaypoint(pGroup);

  if (!wp) {
    // no waypoints, so the group is at it's destination.  This happens when
    // an enemy group is created in the destination sector (which is legal for
    // staging groups which always stop adjacent to their real sector destination)
    return TRUE;
  }

  // if we're there
  if ((pGroup.value.ubSectorX == wp.value.x) && (pGroup.value.ubSectorY == wp.value.y)) {
    return TRUE;
  }

  return FALSE;
}

function GetFinalWaypoint(pGroup: Pointer<GROUP>): Pointer<WAYPOINT> {
  let wp: Pointer<WAYPOINT>;

  Assert(pGroup);

  // Make sure they're on a one way route, otherwise this request is illegal
  Assert(pGroup.value.ubMoveType == ONE_WAY);

  wp = pGroup.value.pWaypoints;
  if (wp) {
    while (wp.value.next) {
      wp = wp.value.next;
    }
  }

  return wp;
}

// The sector supplied resets ALL enemy groups in the sector specified.  See comments in
// ResetMovementForEnemyGroup() for more details on what the resetting does.
function ResetMovementForEnemyGroupsInLocation(ubSectorX: UINT8, ubSectorY: UINT8): void {
  let pGroup: Pointer<GROUP>;
  let next: Pointer<GROUP>;
  let sSectorX: INT16;
  let sSectorY: INT16;
  let sSectorZ: INT16;

  GetCurrentBattleSectorXYZ(addressof(sSectorX), addressof(sSectorY), addressof(sSectorZ));
  pGroup = gpGroupList;
  while (pGroup) {
    next = pGroup.value.next;
    if (!pGroup.value.fPlayer) {
      if (pGroup.value.ubSectorX == sSectorX && pGroup.value.ubSectorY == sSectorY) {
        ResetMovementForEnemyGroup(pGroup);
      }
    }
    pGroup = next;
  }
}

// This function is used to reset the location of the enemy group if they are
// currently between sectors.  If they were 50% of the way from sector A10 to A11,
// then after this function is called, then that group would be 0% of the way from
// sector A10 to A11.  In no way does this function effect the strategic path for
// the group.
function ResetMovementForEnemyGroup(pGroup: Pointer<GROUP>): void {
  // Validate that the group is an enemy group and that it is moving.
  if (pGroup.value.fPlayer) {
    return;
  }
  if (!pGroup.value.fBetweenSectors || !pGroup.value.ubNextX || !pGroup.value.ubNextY) {
    // Reset the group's assignment by moving it to the group's original sector as it's pending group.
    RepollSAIGroup(pGroup);
    return;
  }

  // Cancel the event that is posted.
  DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

  // Calculate the new arrival time (all data pertaining to movement should be valid)
  if (pGroup.value.uiTraverseTime > 400) {
    // The group was likely sleeping which makes for extremely long arrival times.  Shorten it
    // arbitrarily.  Doesn't really matter if this isn't accurate.
    pGroup.value.uiTraverseTime = 90;
  }
  SetGroupArrivalTime(pGroup, GetWorldTotalMin() + pGroup.value.uiTraverseTime);

  // Add a new event
  AddStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.uiArrivalTime, pGroup.value.ubGroupID);
}

function UpdatePersistantGroupsFromOldSave(uiSavedGameVersion: UINT32): void {
  let pGroup: Pointer<GROUP> = NULL;
  let fDone: BOOLEAN = FALSE;
  let cnt: INT32;
  let fDoChange: BOOLEAN = FALSE;

  // ATE: If saved game is < 61, we need to do something better!
  if (uiSavedGameVersion < 61) {
    for (cnt = 0; cnt < 55; cnt++) {
      // create mvt groups
      pGroup = GetGroup(cnt);

      if (pGroup != NULL && pGroup.value.fPlayer) {
        pGroup.value.fPersistant = TRUE;
      }
    }

    fDoChange = TRUE;
  } else if (uiSavedGameVersion < 63) {
    for (cnt = 0; cnt < NUMBER_OF_SQUADS; cnt++) {
      // create mvt groups
      pGroup = GetGroup(SquadMovementGroups[cnt]);

      if (pGroup != NULL) {
        pGroup.value.fPersistant = TRUE;
      }
    }

    for (cnt = 0; cnt < MAX_VEHICLES; cnt++) {
      pGroup = GetGroup(gubVehicleMovementGroups[cnt]);

      if (pGroup != NULL) {
        pGroup.value.fPersistant = TRUE;
      }
    }

    fDoChange = TRUE;
  }

  if (fDoChange) {
    // Remove all empty groups
    fDone = FALSE;
    while (!fDone) {
      pGroup = gpGroupList;
      while (pGroup) {
        if (!pGroup.value.ubGroupSize && !pGroup.value.fPersistant) {
          RemovePGroup(pGroup);
          break;
        }
        pGroup = pGroup.value.next;
        if (!pGroup) {
          fDone = TRUE;
        }
      }
    }
  }
}

// Determines if any particular group WILL be moving through a given sector given it's current
// position in the route and the pGroup->ubMoveType must be ONE_WAY.  If the group is currently
// IN the sector, or just left the sector, it will return FALSE.
function GroupWillMoveThroughSector(pGroup: Pointer<GROUP>, ubSectorX: UINT8, ubSectorY: UINT8): BOOLEAN {
  let wp: Pointer<WAYPOINT>;
  let i: INT32;
  let dx: INT32;
  let dy: INT32;
  let ubOrigX: UINT8;
  let ubOrigY: UINT8;

  Assert(pGroup);
  AssertMsg(pGroup.value.ubMoveType == ONE_WAY, String("GroupWillMoveThroughSector() -- Attempting to test group with an invalid move type.  ubGroupID: %d, ubMoveType: %d, sector: %c%d -- KM:0", pGroup.value.ubGroupID, pGroup.value.ubMoveType, pGroup.value.ubSectorY + 'A' - 1, pGroup.value.ubSectorX));

  // Preserve the original sector values, as we will be temporarily modifying the group's ubSectorX/Y values
  // as we traverse the waypoints.
  ubOrigX = pGroup.value.ubSectorX;
  ubOrigY = pGroup.value.ubSectorY;

  i = pGroup.value.ubNextWaypointID;
  wp = pGroup.value.pWaypoints;

  if (!wp) {
    // This is a floating group!?
    return FALSE;
  }
  while (i--) {
    // Traverse through the waypoint list to the next waypoint ID
    Assert(wp);
    wp = wp.value.next;
  }
  Assert(wp);

  while (wp) {
    while (pGroup.value.ubSectorX != wp.value.x || pGroup.value.ubSectorY != wp.value.y) {
      // We now have the correct waypoint.
      // Analyse the group and determine which direction it will move from the current sector.
      dx = wp.value.x - pGroup.value.ubSectorX;
      dy = wp.value.y - pGroup.value.ubSectorY;
      if (dx && dy) {
        // Can't move diagonally!
        AssertMsg(0, String("GroupWillMoveThroughSector() -- Attempting to process waypoint in a diagonal direction from sector %c%d to sector %c%d for group at sector %c%d -- KM:0", pGroup.value.ubSectorY + 'A', pGroup.value.ubSectorX, wp.value.y + 'A' - 1, wp.value.x, ubOrigY + 'A' - 1, ubOrigX));
        pGroup.value.ubSectorX = ubOrigX;
        pGroup.value.ubSectorY = ubOrigY;
        return TRUE;
      }
      if (!dx && !dy) // Can't move to position currently at!
      {
        AssertMsg(0, String("GroupWillMoveThroughSector() -- Attempting to process same waypoint at %c%d for group at %c%d -- KM:0", wp.value.y + 'A' - 1, wp.value.x, ubOrigY + 'A' - 1, ubOrigX));
        pGroup.value.ubSectorX = ubOrigX;
        pGroup.value.ubSectorY = ubOrigY;
        return TRUE;
      }
      // Clip dx/dy value so that the move is for only one sector.
      if (dx >= 1) {
        dx = 1;
      } else if (dy >= 1) {
        dy = 1;
      } else if (dx <= -1) {
        dx = -1;
      } else if (dy <= -1) {
        dy = -1;
      } else {
        Assert(0);
        pGroup.value.ubSectorX = ubOrigX;
        pGroup.value.ubSectorY = ubOrigY;
        return TRUE;
      }
      // Advance the sector value
      pGroup.value.ubSectorX = (dx + pGroup.value.ubSectorX);
      pGroup.value.ubSectorY = (dy + pGroup.value.ubSectorY);
      // Check to see if it the sector we are checking to see if this group will be moving through.
      if (pGroup.value.ubSectorX == ubSectorX && pGroup.value.ubSectorY == ubSectorY) {
        pGroup.value.ubSectorX = ubOrigX;
        pGroup.value.ubSectorY = ubOrigY;
        return TRUE;
      }
    }
    // Advance to the next waypoint.
    wp = wp.value.next;
  }
  pGroup.value.ubSectorX = ubOrigX;
  pGroup.value.ubSectorY = ubOrigY;
  return FALSE;
}

function CalculateFuelCostBetweenSectors(ubSectorID1: UINT8, ubSectorID2: UINT8): INT16 {
  return 0;
}

function VehicleHasFuel(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  Assert(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE);
  if (pSoldier.value.sBreathRed) {
    return TRUE;
  }
  return FALSE;
}

function VehicleFuelRemaining(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  Assert(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE);
  return pSoldier.value.sBreathRed;
}

function SpendVehicleFuel(pSoldier: Pointer<SOLDIERTYPE>, sFuelSpent: INT16): BOOLEAN {
  Assert(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE);
  pSoldier.value.sBreathRed -= sFuelSpent;
  pSoldier.value.sBreathRed = max(0, pSoldier.value.sBreathRed);
  pSoldier.value.bBreath = ((pSoldier.value.sBreathRed + 99) / 100);
  return FALSE;
}

function AddFuelToVehicle(pSoldier: Pointer<SOLDIERTYPE>, pVehicle: Pointer<SOLDIERTYPE>): void {
  let pItem: Pointer<OBJECTTYPE>;
  let sFuelNeeded: INT16;
  let sFuelAvailable: INT16;
  let sFuelAdded: INT16;
  pItem = addressof(pSoldier.value.inv[HANDPOS]);
  if (pItem.value.usItem != GAS_CAN) {
    return;
  }
  // Soldier has gas can, so now add gas to vehicle while removing gas from the gas can.
  // A gas can with 100 status translate to 50% of a fillup.
  if (pVehicle.value.sBreathRed == 10000) {
    // Message for vehicle full?
    return;
  }
  if (pItem.value.bStatus) {
    // Fill 'er up.
    sFuelNeeded = 10000 - pVehicle.value.sBreathRed;
    sFuelAvailable = pItem.value.bStatus[0] * 50;
    sFuelAdded = min(sFuelNeeded, sFuelAvailable);
    // Add to vehicle
    pVehicle.value.sBreathRed += sFuelAdded;
    pVehicle.value.bBreath = (pVehicle.value.sBreathRed / 100);
    // Subtract from item
    pItem.value.bStatus[0] = (pItem.value.bStatus[0] - sFuelAdded / 50);
    if (!pItem.value.bStatus[0]) {
      // Gas can is empty, so toast the item.
      DeleteObj(pItem);
    }
  }
}

function ReportVehicleOutOfGas(iVehicleID: INT32, ubSectorX: UINT8, ubSectorY: UINT8): void {
  let str: UINT16[] /* [255] */;
  // Report that the vehicle that just arrived is out of gas.
  swprintf(str, gzLateLocalizedString[5], pVehicleStrings[pVehicleList[iVehicleID].ubVehicleType], ubSectorY + 'A' - 1, ubSectorX);
  DoScreenIndependantMessageBox(str, MSG_BOX_FLAG_OK, NULL);
}

function SetLocationOfAllPlayerSoldiersInGroup(pGroup: Pointer<GROUP>, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): void {
  let pPlayer: Pointer<PLAYERGROUP> = NULL;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;

  pPlayer = pGroup.value.pPlayerList;
  while (pPlayer) {
    pSoldier = pPlayer.value.pSoldier;

    if (pSoldier != NULL) {
      pSoldier.value.sSectorX = sSectorX;
      pSoldier.value.sSectorY = sSectorY;
      pSoldier.value.bSectorZ = bSectorZ;
    }

    pPlayer = pPlayer.value.next;
  }

  // if it's a vehicle
  if (pGroup.value.fVehicle) {
    let iVehicleId: INT32 = -1;
    let pVehicle: Pointer<VEHICLETYPE> = NULL;

    iVehicleId = GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID);
    Assert(iVehicleId != -1);

    pVehicle = addressof(pVehicleList[iVehicleId]);

    pVehicle.value.sSectorX = sSectorX;
    pVehicle.value.sSectorY = sSectorY;
    pVehicle.value.sSectorZ = bSectorZ;

    // if it ain't the chopper
    if (iVehicleId != iHelicopterVehicleId) {
      pSoldier = GetSoldierStructureForVehicle(iVehicleId);
      Assert(pSoldier);

      // these are apparently unnecessary, since vehicles are part of the pPlayerList in a vehicle group.  Oh well.
      pSoldier.value.sSectorX = sSectorX;
      pSoldier.value.sSectorY = sSectorY;
      pSoldier.value.bSectorZ = bSectorZ;
    }
  }
}

function RandomizePatrolGroupLocation(pGroup: Pointer<GROUP>): void {
  // Make sure this is an enemy patrol group
  let wp: Pointer<WAYPOINT>;
  let ubMaxWaypointID: UINT8 = 0;
  let ubTotalWaypoints: UINT8;
  let ubChosen: UINT8;
  let ubSectorID: UINT8;

  // return; //disabled for now

  Assert(!pGroup.value.fPlayer);
  Assert(pGroup.value.ubMoveType == ENDTOEND_FORWARDS);
  Assert(pGroup.value.pEnemyGroup.value.ubIntention == PATROL);

  // Search for the event, and kill it (if it exists)!
  DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

  // count the group's waypoints
  wp = pGroup.value.pWaypoints;
  while (wp) {
    if (wp.value.next) {
      ubMaxWaypointID++;
    }
    wp = wp.value.next;
  }
  // double it (they go back and forth) -- it's using zero based indices, so you have to add one to get the number of actual
  // waypoints in one direction.
  ubTotalWaypoints = ((ubMaxWaypointID)*2);

  // pick the waypoint they start at
  ubChosen = Random(ubTotalWaypoints);

  if (ubChosen >= ubMaxWaypointID) {
    // They chose a waypoint going in the reverse direction, so translate it
    // to an actual waypointID and switch directions.
    pGroup.value.ubMoveType = ENDTOEND_BACKWARDS;
    pGroup.value.ubNextWaypointID = ubChosen - ubMaxWaypointID;
    ubChosen = pGroup.value.ubNextWaypointID + 1;
  } else {
    pGroup.value.ubMoveType = ENDTOEND_FORWARDS;
    pGroup.value.ubNextWaypointID = ubChosen + 1;
  }

  // Traverse through the waypoint list again, to extract the location they are at.
  wp = pGroup.value.pWaypoints;
  while (wp && ubChosen) {
    ubChosen--;
    wp = wp.value.next;
  }

  // logic error if this fails.  We should have a null value for ubChosen
  Assert(!ubChosen);
  Assert(wp);

  // Move the group to the location of this chosen waypoint.
  ubSectorID = SECTOR(wp.value.x, wp.value.y);

  // Set up this global var to randomize the arrival time of the group from
  // 1 minute to actual traverse time between the sectors.
  gfRandomizingPatrolGroup = TRUE;

  SetEnemyGroupSector(pGroup, ubSectorID);
  InitiateGroupMovementToNextSector(pGroup);

  // Immediately turn off the flag once finished.
  gfRandomizingPatrolGroup = FALSE;
}

// Whenever a player group arrives in a sector, and if bloodcats exist in the sector,
// roll the dice to see if this will become an ambush random encounter.
function TestForBloodcatAmbush(pGroup: Pointer<GROUP>): BOOLEAN {
  let pSector: Pointer<SECTORINFO>;
  let iHoursElapsed: INT32;
  let ubSectorID: UINT8;
  let ubChance: UINT8;
  let bDifficultyMaxCats: INT8;
  let bProgressMaxCats: INT8;
  let bNumMercMaxCats: INT8;
  let fAlreadyAmbushed: BOOLEAN = FALSE;

  if (pGroup.value.ubSectorZ) {
    // no ambushes underground (no bloodcats either)
    return FALSE;
  }

  ubSectorID = SECTOR(pGroup.value.ubSectorX, pGroup.value.ubSectorY);
  pSector = addressof(SectorInfo[ubSectorID]);

  ubChance = 5 * gGameOptions.ubDifficultyLevel;

  iHoursElapsed = (GetWorldTotalMin() - pSector.value.uiTimeCurrentSectorWasLastLoaded) / 60;
  if (ubSectorID == SEC_N5 || ubSectorID == SEC_I16) {
    // These are special maps -- we use all placements.
    if (pSector.value.bBloodCats == -1) {
      pSector.value.bBloodCats = pSector.value.bBloodCatPlacements;
    } else if (pSector.value.bBloodCats > 0 && pSector.value.bBloodCats < pSector.value.bBloodCatPlacements) {
      // Slowly have them recuperate if we haven't been here for a long time.  The population will
      // come back up to the maximum if left long enough.
      let iBloodCatDiff: INT32;
      iBloodCatDiff = pSector.value.bBloodCatPlacements - pSector.value.bBloodCats;
      pSector.value.bBloodCats += min(iHoursElapsed / 18, iBloodCatDiff);
    }
    // Once 0, the bloodcats will never recupe.
  } else if (pSector.value.bBloodCats == -1) {
    // If we haven't been ambushed by bloodcats yet...
    if (gfAutoAmbush || PreChance(ubChance)) {
      // randomly choose from 5-8, 7-10, 9-12 bloodcats based on easy, normal, and hard, respectively
      bDifficultyMaxCats = (Random(4) + gGameOptions.ubDifficultyLevel * 2 + 3);

      // maximum of 3 bloodcats or 1 for every 6%, 5%, 4% progress based on easy, normal, and hard, respectively
      bProgressMaxCats = max(CurrentPlayerProgressPercentage() / (7 - gGameOptions.ubDifficultyLevel), 3);

      // make sure bloodcats don't outnumber mercs by a factor greater than 2
      bNumMercMaxCats = (PlayerMercsInSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY, pGroup.value.ubSectorZ) * 2);

      // choose the lowest number of cats calculated by difficulty and progress.
      pSector.value.bBloodCats = min(bDifficultyMaxCats, bProgressMaxCats);

      if (gGameOptions.ubDifficultyLevel != DIF_LEVEL_HARD) {
        // if not hard difficulty, ensure cats never outnumber mercs by a factor of 2 (min 3 bloodcats)
        pSector.value.bBloodCats = min(pSector.value.bBloodCats, bNumMercMaxCats);
        pSector.value.bBloodCats = max(pSector.value.bBloodCats, 3);
      }

      // ensure that there aren't more bloodcats than placements
      pSector.value.bBloodCats = min(pSector.value.bBloodCats, pSector.value.bBloodCatPlacements);
    }
  } else if (ubSectorID != SEC_I16) {
    if (!gfAutoAmbush && PreChance(95)) {
      // already ambushed here.  But 5% chance of getting ambushed again!
      fAlreadyAmbushed = TRUE;
    }
  }

  if (!fAlreadyAmbushed && ubSectorID != SEC_N5 && pSector.value.bBloodCats > 0 && !pGroup.value.fVehicle && !NumEnemiesInSector(pGroup.value.ubSectorX, pGroup.value.ubSectorY)) {
    if (ubSectorID != SEC_I16 || !gubFact[FACT_PLAYER_KNOWS_ABOUT_BLOODCAT_LAIR]) {
      gubEnemyEncounterCode = BLOODCAT_AMBUSH_CODE;
    } else {
      gubEnemyEncounterCode = ENTERING_BLOODCAT_LAIR_CODE;
    }
    return TRUE;
  } else {
    gubEnemyEncounterCode = NO_ENCOUNTER_CODE;
    return FALSE;
  }
}

function NotifyPlayerOfBloodcatBattle(ubSectorX: UINT8, ubSectorY: UINT8): void {
  let str: UINT16[] /* [256] */;
  let zTempString: UINT16[] /* [128] */;
  if (gubEnemyEncounterCode == BLOODCAT_AMBUSH_CODE) {
    GetSectorIDString(ubSectorX, ubSectorY, 0, zTempString, TRUE);
    swprintf(str, pMapErrorString[12], zTempString);
  } else if (gubEnemyEncounterCode == ENTERING_BLOODCAT_LAIR_CODE) {
    wcscpy(str, pMapErrorString[13]);
  }

  if (guiCurrentScreen == MAP_SCREEN) {
    // Force render mapscreen (need to update the position of the group before the dialog appears.
    fMapPanelDirty = TRUE;
    MapScreenHandle();
    InvalidateScreen();
    RefreshScreen(NULL);
  }

  gfUsePersistantPBI = TRUE;
  DoScreenIndependantMessageBox(str, MSG_BOX_FLAG_OK, TriggerPrebattleInterface);
}

function PlaceGroupInSector(ubGroupID: UINT8, sPrevX: INT16, sPrevY: INT16, sNextX: INT16, sNextY: INT16, bZ: INT8, fCheckForBattle: BOOLEAN): void {
  ClearMercPathsAndWaypointsForAllInGroup(GetGroup(ubGroupID));

  // change where they are and where they're going
  SetGroupPrevSectors(ubGroupID, sPrevX, sPrevY);
  SetGroupSectorValue(sPrevX, sPrevY, bZ, ubGroupID);
  SetGroupNextSectorValue(sNextX, sNextY, ubGroupID);

  // call arrive event
  GroupArrivedAtSector(ubGroupID, fCheckForBattle, FALSE);
}

// ARM: centralized it so we can do a comprehensive Assert on it.  Causing problems with helicopter group!
function SetGroupArrivalTime(pGroup: Pointer<GROUP>, uiArrivalTime: UINT32): void {
  // PLEASE CENTRALIZE ALL CHANGES TO THE ARRIVAL TIMES OF GROUPS THROUGH HERE, ESPECIALLY THE HELICOPTER GROUP!!!

  // if this group is the helicopter group, we have to make sure that its arrival time is never greater than the sum
  // of the current time and its traverse time, 'cause those 3 values are used to plot its map position!  Because of this
  // the chopper groups must NEVER be delayed for any reason - it gets excluded from simultaneous arrival logic

  // Also note that non-chopper groups can currently be delayed such that this assetion would fail - enemy groups by
  // DelayEnemyGroupsIfPathsCross(), and player groups via PrepareGroupsForSimultaneousArrival().  So we skip the assert.

  if (IsGroupTheHelicopterGroup(pGroup)) {
    // make sure it's valid (NOTE: the correct traverse time must be set first!)
    if (uiArrivalTime > (GetWorldTotalMin() + pGroup.value.uiTraverseTime)) {
      AssertMsg(FALSE, String("SetGroupArrivalTime: Setting invalid arrival time %d for group %d, WorldTime = %d, TraverseTime = %d", uiArrivalTime, pGroup.value.ubGroupID, GetWorldTotalMin(), pGroup.value.uiTraverseTime));

      // fix it if assertions are disabled
      uiArrivalTime = GetWorldTotalMin() + pGroup.value.uiTraverseTime;
    }
  }

  pGroup.value.uiArrivalTime = uiArrivalTime;
}

// non-persistent groups should be simply removed instead!
function CancelEmptyPersistentGroupMovement(pGroup: Pointer<GROUP>): void {
  Assert(pGroup);
  Assert(pGroup.value.ubGroupSize == 0);
  Assert(pGroup.value.fPersistant);

  // don't do this for vehicle groups - the chopper can keep flying empty,
  // while other vehicles still exist and teleport to nearest sector instead
  if (pGroup.value.fVehicle) {
    return;
  }

  // prevent it from arriving empty
  DeleteStrategicEvent(EVENT_GROUP_ARRIVAL, pGroup.value.ubGroupID);

  // release memory for its waypoints
  RemoveGroupWaypoints(pGroup.value.ubGroupID);

  pGroup.value.uiTraverseTime = 0;
  SetGroupArrivalTime(pGroup, 0);
  pGroup.value.fBetweenSectors = FALSE;

  pGroup.value.ubPrevX = 0;
  pGroup.value.ubPrevY = 0;
  pGroup.value.ubSectorX = 0;
  pGroup.value.ubSectorY = 0;
  pGroup.value.ubNextX = 0;
  pGroup.value.ubNextY = 0;
}

// look for NPCs to stop for, anyone is too tired to keep going, if all OK rebuild waypoints & continue movement
function PlayerGroupArrivedSafelyInSector(pGroup: Pointer<GROUP>, fCheckForNPCs: BOOLEAN): void {
  let fPlayerPrompted: BOOLEAN = FALSE;

  Assert(pGroup);
  Assert(pGroup.value.fPlayer);

  // if we haven't already checked for NPCs, and the group isn't empty
  if (fCheckForNPCs && (HandlePlayerGroupEnteringSectorToCheckForNPCsOfNote(pGroup) == TRUE)) {
    // wait for player to answer/confirm prompt before doing anything else
    fPlayerPrompted = TRUE;
  }

  // if we're not prompting the player
  if (!fPlayerPrompted) {
    // and we're not at the end of our road
    if (!GroupAtFinalDestination(pGroup)) {
      if (AnyMercInGroupCantContinueMoving(pGroup)) {
        // stop: clear their strategic movement (mercpaths and waypoints)
        ClearMercPathsAndWaypointsForAllInGroup(pGroup);

        // NOTE: Of course, it would be better if they continued onwards once everyone was ready to go again, in which
        // case we'd want to preserve the plotted path, but since the player can mess with the squads, etc.
        // in the mean-time, that just seemed to risky to try to support.  They could get into a fight and be too
        // injured to move, etc.  Basically, we'd have run a complete CanCharacterMoveInStrategic(0 check on all of them.
        // It's a wish list task for AM...

        // stop time so player can react if group was already on the move and suddenly halts
        StopTimeCompression();
      } else {
        // continue onwards: rebuild way points, initiate movement
        RebuildWayPointsForGroupPath(GetGroupMercPathPtr(pGroup), pGroup.value.ubGroupID);
      }
    }
  }
}

function HandlePlayerGroupEnteringSectorToCheckForNPCsOfNote(pGroup: Pointer<GROUP>): BOOLEAN {
  let sSectorX: INT16 = 0;
  let sSectorY: INT16 = 0;
  let bSectorZ: INT8 = 0;
  let sString: CHAR16[] /* [128] */;
  let wSectorName: CHAR16[] /* [128] */;
  let sStrategicSector: INT16;

  Assert(pGroup);
  Assert(pGroup.value.fPlayer);

  // nobody in the group (perfectly legal with the chopper)
  if (pGroup.value.pPlayerList == NULL) {
    return FALSE;
  }

  // chopper doesn't stop for NPCs
  if (IsGroupTheHelicopterGroup(pGroup)) {
    return FALSE;
  }

  // if we're already in the middle of a prompt (possible with simultaneously group arrivals!), don't try to prompt again
  if (gpGroupPrompting != NULL) {
    return FALSE;
  }

  // get the sector values
  sSectorX = pGroup.value.ubSectorX;
  sSectorY = pGroup.value.ubSectorY;
  bSectorZ = pGroup.value.ubSectorZ;

  // don't do this for underground sectors
  if (bSectorZ != 0) {
    return FALSE;
  }

  // get the strategic sector value
  sStrategicSector = sSectorX + MAP_WORLD_X * sSectorY;

  // skip towns/pseudo-towns (anything that shows up on the map as being special)
  if (StrategicMap[sStrategicSector].bNameId != BLANK_SECTOR) {
    return FALSE;
  }

  // skip SAM-sites
  if (IsThisSectorASAMSector(sSectorX, sSectorY, bSectorZ)) {
    return FALSE;
  }

  // check for profiled NPCs in sector
  if (WildernessSectorWithAllProfiledNPCsNotSpokenWith(sSectorX, sSectorY, bSectorZ) == FALSE) {
    return FALSE;
  }

  // store the group ptr for use by the callback function
  gpGroupPrompting = pGroup;

  // build string for squad
  GetSectorIDString(sSectorX, sSectorY, bSectorZ, wSectorName, FALSE);
  swprintf(sString, pLandMarkInSectorString[0], pGroup.value.pPlayerList.value.pSoldier.value.bAssignment + 1, wSectorName);

  if (GroupAtFinalDestination(pGroup)) {
    // do an OK message box
    DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_OK, HandlePlayerGroupEnteringSectorToCheckForNPCsOfNoteCallback);
  } else {
    // do a CONTINUE/STOP message box
    DoScreenIndependantMessageBox(sString, MSG_BOX_FLAG_CONTINUESTOP, HandlePlayerGroupEnteringSectorToCheckForNPCsOfNoteCallback);
  }

  // wait, we're prompting the player
  return TRUE;
}

function WildernessSectorWithAllProfiledNPCsNotSpokenWith(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): BOOLEAN {
  let ubProfile: UINT8;
  let pProfile: Pointer<MERCPROFILESTRUCT>;
  let fFoundSomebody: BOOLEAN = FALSE;

  for (ubProfile = FIRST_RPC; ubProfile < NUM_PROFILES; ubProfile++) {
    pProfile = addressof(gMercProfiles[ubProfile]);

    // skip stiffs
    if ((pProfile.value.bMercStatus == MERC_IS_DEAD) || (pProfile.value.bLife <= 0)) {
      continue;
    }

    // skip vehicles
    if (ubProfile >= PROF_HUMMER && ubProfile <= PROF_HELICOPTER) {
      continue;
    }

    // in this sector?
    if (pProfile.value.sSectorX == sSectorX && pProfile.value.sSectorY == sSectorY && pProfile.value.bSectorZ == bSectorZ) {
      // if we haven't talked to him yet, and he's not currently recruired/escorted by player (!)
      if ((pProfile.value.ubLastDateSpokenTo == 0) && !(pProfile.value.ubMiscFlags & (PROFILE_MISC_FLAG_RECRUITED | PROFILE_MISC_FLAG_EPCACTIVE))) {
        // then this is a guy we need to stop for...
        fFoundSomebody = TRUE;
      } else {
        // already spoke to this guy, don't prompt about this sector again, regardless of status of other NPCs here
        // (although Hamous wanders around, he never shares the same wilderness sector as other important NPCs)
        return FALSE;
      }
    }
  }

  return fFoundSomebody;
}

function HandlePlayerGroupEnteringSectorToCheckForNPCsOfNoteCallback(ubExitValue: UINT8): void {
  Assert(gpGroupPrompting);

  if ((ubExitValue == MSG_BOX_RETURN_YES) || (ubExitValue == MSG_BOX_RETURN_OK)) {
    // NPCs now checked, continue moving if appropriate
    PlayerGroupArrivedSafelyInSector(gpGroupPrompting, FALSE);
  } else if (ubExitValue == MSG_BOX_RETURN_NO) {
    // stop here

    // clear their strategic movement (mercpaths and waypoints)
    ClearMercPathsAndWaypointsForAllInGroup(gpGroupPrompting);

    //		// if currently selected sector has nobody in it
    //		if ( PlayerMercsInSector( ( UINT8 ) sSelMapX, ( UINT8 ) sSelMapY, ( UINT8 ) iCurrentMapSectorZ ) == 0 )
    // New: ALWAYS make this sector strategically selected, even if there were mercs in the previously selected one
    { ChangeSelectedMapSector(gpGroupPrompting.value.ubSectorX, gpGroupPrompting.value.ubSectorY, gpGroupPrompting.value.ubSectorZ); }

    StopTimeCompression();
  }

  gpGroupPrompting = NULL;

  fMapPanelDirty = TRUE;
  fMapScreenBottomDirty = TRUE;

  return;
}

function DoesPlayerExistInPGroup(ubGroupID: UINT8, pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let pGroup: Pointer<GROUP>;
  let curr: Pointer<PLAYERGROUP>;

  pGroup = GetGroup(ubGroupID);
  Assert(pGroup);

  curr = pGroup.value.pPlayerList;

  if (!curr) {
    return FALSE;
  }

  while (curr) {
    // definately more than one node

    if (curr.value.pSoldier == pSoldier) {
      return TRUE;
    }

    curr = curr.value.next;
  }

  // !curr
  return FALSE;
}

function GroupHasInTransitDeadOrPOWMercs(pGroup: Pointer<GROUP>): BOOLEAN {
  let pPlayer: Pointer<PLAYERGROUP>;

  pPlayer = pGroup.value.pPlayerList;
  while (pPlayer) {
    if (pPlayer.value.pSoldier) {
      if ((pPlayer.value.pSoldier.value.bAssignment == IN_TRANSIT) || (pPlayer.value.pSoldier.value.bAssignment == ASSIGNMENT_POW) || (pPlayer.value.pSoldier.value.bAssignment == ASSIGNMENT_DEAD)) {
        // yup!
        return TRUE;
      }
    }

    pPlayer = pPlayer.value.next;
  }

  // nope
  return FALSE;
}

function NumberMercsInVehicleGroup(pGroup: Pointer<GROUP>): UINT8 {
  let iVehicleID: INT32;
  iVehicleID = GivenMvtGroupIdFindVehicleId(pGroup.value.ubGroupID);
  Assert(iVehicleID != -1);
  if (iVehicleID != -1) {
    return GetNumberInVehicle(iVehicleID);
  }
  return 0;
}
