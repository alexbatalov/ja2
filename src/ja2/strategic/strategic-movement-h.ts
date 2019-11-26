namespace ja2 {

// enemy intentions,
export const enum Enum184 {
  NO_INTENTIONS, // enemy intentions are undefined.
  PURSUIT, // enemy group has spotted a player group and is pursuing them.  If they lose the player group, they
           // will get reassigned.
  STAGING, // enemy is prepare to assault a town sector, but doesn't have enough troops.
  PATROL, // enemy is moving around determining safe areas.
  REINFORCEMENTS, // enemy group has intentions to fortify position at final destination.
  ASSAULT, // enemy is ready to fight anything they encounter.
  NUM_ENEMY_INTENTIONS,
}

// move types
export const enum Enum185 {
  ONE_WAY, // from first waypoint to last, deleting each waypoint as they are reached.
  CIRCULAR, // from first to last, recycling forever.
  ENDTOEND_FORWARDS, // from first to last -- when reaching last, change to backwards.
  ENDTOEND_BACKWARDS, // from last to first -- when reaching first, change to forwards.
}

export const enum Enum186 {
  NORTH_STRATEGIC_MOVE,
  EAST_STRATEGIC_MOVE,
  SOUTH_STRATEGIC_MOVE,
  WEST_STRATEGIC_MOVE,
  THROUGH_STRATEGIC_MOVE,
}

// This structure contains all of the information about a group moving in the strategic
// layer.  This includes all troops, equipment, and waypoints, and location.
// NOTE:  This is used for groups that are initiating a movement to another sector.
export interface WAYPOINT {
  x: UINT8; // sector x position of waypoint
  y: UINT8; // sector y position of waypoint
  next: WAYPOINT | null /* Pointer<WAYPOINT> */; // next waypoint in list
}

export function createWaypoint(): WAYPOINT {
  return {
    x: 0,
    y: 0,
    next: null,
  };
}

export const WAYPOINT_SIZE = 8;

export function readWaypoint(o: WAYPOINT, buffer: Buffer, offset: number = 0): number {
  o.x = buffer.readUInt8(offset++);
  o.y = buffer.readUInt8(offset++);
  offset += 2; // padding
  o.next = null; offset += 4; // pointer
  return offset;
}

export function writeWaypoint(o: WAYPOINT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.x, offset);
  offset = buffer.writeUInt8(o.y, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4); // pointer
  return offset;
}

const PG_INDIVIDUAL_MERGED = 0x01;

export interface PLAYERGROUP {
  ubProfileID: UINT8; // SAVE THIS VALUE ONLY.  The others are temp (for quick access)
  ubID: UINT8; // index in the Menptr array
  pSoldier: SOLDIERTYPE; // direct access to the soldier pointer
  bFlags: UINT8; // flags referring to individual player soldiers
  next: PLAYERGROUP | null /* Pointer<PLAYERGROUP> */; // next player in list
}

export function createPlayerGroup(): PLAYERGROUP {
  return {
    ubProfileID: 0,
    ubID: 0,
    pSoldier: <SOLDIERTYPE><unknown>null,
    bFlags: 0,
    next: null,
  };
}

export interface ENEMYGROUP {
  ubNumTroops: UINT8; // number of regular troops in the group
  ubNumElites: UINT8; // number of elite troops in the group
  ubNumAdmins: UINT8; // number of administrators in the group
  ubLeaderProfileID: UINT8; // could be Mike, maybe the warden... someone new, but likely nobody.
  ubPendingReinforcements: UINT8; // This group is waiting for reinforcements before attacking or attempting to fortify newly aquired sector.
  ubAdminsInBattle: UINT8; // number of administrators in currently in battle.
  ubIntention: UINT8; // the type of group this is:  patrol, assault, spies, etc.
  ubTroopsInBattle: UINT8; // number of soldiers currently in battle.
  ubElitesInBattle: UINT8; // number of elite soldiers currently in battle.
  bPadding: INT8[] /* [20] */;
}

export function createEnemyGroup(): ENEMYGROUP {
  return {
    ubNumTroops: 0,
    ubNumElites: 0,
    ubNumAdmins: 0,
    ubLeaderProfileID: 0,
    ubPendingReinforcements: 0,
    ubAdminsInBattle: 0,
    ubIntention: 0,
    ubTroopsInBattle: 0,
    ubElitesInBattle: 0,
    bPadding: createArray(20, 0),
  };
}

export const ENEMY_GROUP_SIZE = 29;

export function readEnemyGroup(o: ENEMYGROUP, buffer: Buffer, offset: number = 0): number {
  o.ubNumTroops = buffer.readUInt8(offset++);
  o.ubNumElites = buffer.readUInt8(offset++);
  o.ubNumAdmins = buffer.readUInt8(offset++);
  o.ubLeaderProfileID = buffer.readUInt8(offset++);
  o.ubPendingReinforcements = buffer.readUInt8(offset++);
  o.ubAdminsInBattle = buffer.readUInt8(offset++);
  o.ubIntention = buffer.readUInt8(offset++);
  o.ubTroopsInBattle = buffer.readUInt8(offset++);
  o.ubElitesInBattle = buffer.readUInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);
  return offset;
}

export function writeEnemyGroup(o: ENEMYGROUP, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubNumTroops, offset);
  offset = buffer.writeUInt8(o.ubNumElites, offset);
  offset = buffer.writeUInt8(o.ubNumAdmins, offset);
  offset = buffer.writeUInt8(o.ubLeaderProfileID, offset);
  offset = buffer.writeUInt8(o.ubPendingReinforcements, offset);
  offset = buffer.writeUInt8(o.ubAdminsInBattle, offset);
  offset = buffer.writeUInt8(o.ubIntention, offset);
  offset = buffer.writeUInt8(o.ubTroopsInBattle, offset);
  offset = buffer.writeUInt8(o.ubElitesInBattle, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);
  return offset;
}

// NOTE:  ALL FLAGS ARE CLEARED WHENEVER A GROUP ARRIVES IN A SECTOR, OR ITS WAYPOINTS ARE
//       DELETED!!!
export const GROUPFLAG_SIMULTANEOUSARRIVAL_APPROVED = 0x00000001;
export const GROUPFLAG_SIMULTANEOUSARRIVAL_CHECKED = 0x00000002;
// I use this flag when traversing through a list to determine which groups meet whatever conditions,
// then add this marker flag.  The second time I traverse the list, I simply check for this flag,
// apply my modifications to the group, and remove the flag.  If you decide to use it, make sure the
// flag is cleared.
export const GROUPFLAG_MARKER = 0x00000004;
// Set whenever a group retreats from battle.  If the group arrives in the next sector and enemies are there
// retreat will not be an option.
export const GROUPFLAG_JUST_RETREATED_FROM_BATTLE = 0x00000008;
export const GROUPFLAG_HIGH_POTENTIAL_FOR_AMBUSH = 0x00000010;
export const GROUPFLAG_GROUP_ARRIVED_SIMULTANEOUSLY = 0x00000020;

export interface GROUP {
  fDebugGroup: boolean; // for testing purposes -- handled differently in certain cases.
  fPlayer: boolean; // set if this is a player controlled group.
  fVehicle: boolean; // vehicle controlled group?
  fPersistant: boolean; // This flag when set prevents the group from being automatically deleted when it becomes empty.
  ubGroupID: UINT8; // the unique ID of the group (used for hooking into events and SOLDIERTYPE)
  ubGroupSize: UINT8; // total number of individuals in the group.

  // last/curr sector occupied
  ubSectorX: UINT8;
  ubSectorY: UINT8;

  ubSectorZ: UINT8;

  // next sector destination
  ubNextX: UINT8;
  ubNextY: UINT8;

  // prev sector occupied (could be same as ubSectorX/Y)
  ubPrevX: UINT8;
  ubPrevY: UINT8;

  ubOriginalSector: UINT8; // sector where group was created.
  fBetweenSectors: boolean; // set only if a group is between sector.
  ubMoveType: UINT8; // determines the type of movement (ONE_WAY, CIRCULAR, ENDTOEND, etc.)
  ubNextWaypointID: UINT8; // the ID of the next waypoint
  ubFatigueLevel: UINT8; // the fatigue level of the weakest member in group
  ubRestAtFatigueLevel: UINT8; // when the group's fatigue level <= this level, they will rest upon arrival at next sector.
  ubRestToFatigueLevel: UINT8; // when resting, the group will rest until the fatigue level reaches this level.
  uiArrivalTime: UINT32; // the arrival time in world minutes that the group will arrive at the next sector.
  uiTraverseTime: UINT32; // the total traversal time from the previous sector to the next sector.
  fRestAtNight: boolean; // set when the group is permitted to rest between 2200 and 0600 when moving
  fWaypointsCancelled: boolean; // set when groups waypoints have been removed.
  pWaypoints: WAYPOINT | null; // a list of all of the waypoints in the groups movement.
  ubTransportationMask: UINT8; // the mask combining all of the groups transportation methods.
  uiFlags: UINT32; // various conditions that apply to the group
  ubCreatedSectorID: UINT8; // used for debugging strategic AI for keeping track of the sector ID a group was created in.
  ubSectorIDOfLastReassignment: UINT8; // used for debuggin strategic AI.  Records location of any reassignments.
  bPadding: INT8[] /* [29] */; //***********************************************//

  /* union { */
  pPlayerList: PLAYERGROUP | null; // list of players in the group
  pEnemyGroup: ENEMYGROUP | null; // a structure containing general enemy info
  /* } */
  next: GROUP | null /* Pointer<GROUP> */; // next group
}

export function createGroup(): GROUP {
  return {
    fDebugGroup: false,
    fPlayer: false,
    fVehicle: false,
    fPersistant: false,
    ubGroupID: 0,
    ubGroupSize: 0,
    ubSectorX: 0,
    ubSectorY: 0,
    ubSectorZ: 0,
    ubNextX: 0,
    ubNextY: 0,
    ubPrevX: 0,
    ubPrevY: 0,
    ubOriginalSector: 0,
    fBetweenSectors: false,
    ubMoveType: 0,
    ubNextWaypointID: 0,
    ubFatigueLevel: 0,
    ubRestAtFatigueLevel: 0,
    ubRestToFatigueLevel: 0,
    uiArrivalTime: 0,
    uiTraverseTime: 0,
    fRestAtNight: false,
    fWaypointsCancelled: false,
    pWaypoints: null,
    ubTransportationMask: 0,
    uiFlags: 0,
    ubCreatedSectorID: 0,
    ubSectorIDOfLastReassignment: 0,
    bPadding: createArray(29, 0),
    pPlayerList: null,
    pEnemyGroup: null,
    next: null,
  };
}

export const GROUP_SIZE = 84;

export function readGroup(o: GROUP, buffer: Buffer, offset: number = 0): number {
  o.fDebugGroup = Boolean(buffer.readUInt8(offset++));
  o.fPlayer = Boolean(buffer.readUInt8(offset++));
  o.fVehicle = Boolean(buffer.readUInt8(offset++));
  o.fPersistant = Boolean(buffer.readUInt8(offset++));
  o.ubGroupID = buffer.readUInt8(offset++);
  o.ubGroupSize = buffer.readUInt8(offset++);
  o.ubSectorX = buffer.readUInt8(offset++);
  o.ubSectorY = buffer.readUInt8(offset++);
  o.ubSectorZ = buffer.readUInt8(offset++);
  o.ubNextX = buffer.readUInt8(offset++);
  o.ubNextY = buffer.readUInt8(offset++);
  o.ubPrevX = buffer.readUInt8(offset++);
  o.ubPrevY = buffer.readUInt8(offset++);
  o.ubOriginalSector = buffer.readUInt8(offset++);
  o.fBetweenSectors = Boolean(buffer.readUInt8(offset++));
  o.ubMoveType = buffer.readUInt8(offset++);
  o.ubNextWaypointID = buffer.readUInt8(offset++);
  o.ubFatigueLevel = buffer.readUInt8(offset++);
  o.ubRestAtFatigueLevel = buffer.readUInt8(offset++);
  o.ubRestToFatigueLevel = buffer.readUInt8(offset++);
  o.uiArrivalTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiTraverseTime = buffer.readUInt32LE(offset); offset += 4;
  o.fRestAtNight = Boolean(buffer.readUInt8(offset++));
  o.fWaypointsCancelled = Boolean(buffer.readUInt8(offset++));
  offset += 2; // padding
  o.pWaypoints = null; offset += 4; // pointer
  o.ubTransportationMask = buffer.readUInt8(offset++);
  offset += 3; // padding;
  o.uiFlags = buffer.readUInt32LE(offset); offset += 4;
  o.ubCreatedSectorID = buffer.readUInt8(offset++);
  o.ubSectorIDOfLastReassignment = buffer.readUInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);
  offset += 1; // padding

  o.pPlayerList = null;
  o.pEnemyGroup = null;
  offset += 4; // pointer

  o.next = null; offset += 4; // pointer
  return offset;
}

export function writeGroup(o: GROUP, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fDebugGroup), offset);
  offset = buffer.writeUInt8(Number(o.fPlayer), offset);
  offset = buffer.writeUInt8(Number(o.fVehicle), offset);
  offset = buffer.writeUInt8(Number(o.fPersistant), offset);
  offset = buffer.writeUInt8(o.ubGroupID, offset);
  offset = buffer.writeUInt8(o.ubGroupSize, offset);
  offset = buffer.writeUInt8(o.ubSectorX, offset);
  offset = buffer.writeUInt8(o.ubSectorY, offset);
  offset = buffer.writeUInt8(o.ubSectorZ, offset);
  offset = buffer.writeUInt8(o.ubNextX, offset);
  offset = buffer.writeUInt8(o.ubNextY, offset);
  offset = buffer.writeUInt8(o.ubPrevX, offset);
  offset = buffer.writeUInt8(o.ubPrevY, offset);
  offset = buffer.writeUInt8(o.ubOriginalSector, offset);
  offset = buffer.writeUInt8(Number(o.fBetweenSectors), offset);
  offset = buffer.writeUInt8(o.ubMoveType, offset);
  offset = buffer.writeUInt8(o.ubNextWaypointID, offset);
  offset = buffer.writeUInt8(o.ubFatigueLevel, offset);
  offset = buffer.writeUInt8(o.ubRestAtFatigueLevel, offset);
  offset = buffer.writeUInt8(o.ubRestToFatigueLevel, offset);
  offset = buffer.writeUInt32LE(o.uiArrivalTime, offset);
  offset = buffer.writeUInt32LE(o.uiTraverseTime, offset);
  offset = buffer.writeUInt8(Number(o.fRestAtNight), offset);
  offset = buffer.writeUInt8(Number(o.fWaypointsCancelled), offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = writePadding(buffer, offset, 4); // pWaypoints
  offset = buffer.writeUInt8(o.ubTransportationMask, offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiFlags, offset);
  offset = buffer.writeUInt8(o.ubCreatedSectorID, offset);
  offset = buffer.writeUInt8(o.ubSectorIDOfLastReassignment, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);
  offset = writePadding(buffer, offset, 1); // padding
  offset = writePadding(buffer, offset, 4); // pPlayerList, pEnemyGroup
  offset = writePadding(buffer, offset, 4); // next
  return offset;
}

}
