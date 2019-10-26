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
  next: Pointer<WAYPOINT>; // next waypoint in list
}

const PG_INDIVIDUAL_MERGED = 0x01;

export interface PLAYERGROUP {
  ubProfileID: UINT8; // SAVE THIS VALUE ONLY.  The others are temp (for quick access)
  ubID: UINT8; // index in the Menptr array
  pSoldier: Pointer<SOLDIERTYPE>; // direct access to the soldier pointer
  bFlags: UINT8; // flags referring to individual player soldiers
  next: Pointer<PLAYERGROUP>; // next player in list
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
  pWaypoints: Pointer<WAYPOINT>; // a list of all of the waypoints in the groups movement.
  ubTransportationMask: UINT8; // the mask combining all of the groups transportation methods.
  uiFlags: UINT32; // various conditions that apply to the group
  ubCreatedSectorID: UINT8; // used for debugging strategic AI for keeping track of the sector ID a group was created in.
  ubSectorIDOfLastReassignment: UINT8; // used for debuggin strategic AI.  Records location of any reassignments.
  bPadding: INT8[] /* [29] */; //***********************************************//

  /* union { */
  pPlayerList: Pointer<PLAYERGROUP>; // list of players in the group
  pEnemyGroup: Pointer<ENEMYGROUP>; // a structure containing general enemy info
  /* } */
  next: Pointer<GROUP>; // next group
}
