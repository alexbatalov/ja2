namespace ja2 {

// NPC ACTION TRIGGERS SPECIAL CASE AI
export const enum Enum173 {
  STRATEGIC_AI_ACTION_WAKE_QUEEN = 1,
  STRATEGIC_AI_ACTION_KINGPIN_DEAD,
  STRATEGIC_AI_ACTION_QUEEN_DEAD,
}

// These enumerations define all of the various types of stationary garrison
// groups, and index their compositions for forces, etc.
export const enum Enum174 {
  QUEEN_DEFENCE, // The most important sector, the queen's palace.
  MEDUNA_DEFENCE, // The town surrounding the queen's palace.
  MEDUNA_SAMSITE, // A sam site within Meduna (higher priority)
  LEVEL1_DEFENCE, // The sectors immediately adjacent to Meduna (defence and spawning area)
  LEVEL2_DEFENCE, // Two sectors away from Meduna (defence and spawning area)
  LEVEL3_DEFENCE, // Three sectors away from Meduna (defence and spawning area)
  ORTA_DEFENCE, // The top secret military base containing lots of elites
  EAST_GRUMM_DEFENCE, // The most-industrial town in Arulco (more mine income)
  WEST_GRUMM_DEFENCE, // The most-industrial town in Arulco (more mine income)
  GRUMM_MINE,
  OMERTA_WELCOME_WAGON, // Small force that greets the player upon arrival in game.
  BALIME_DEFENCE, // Rich town, paved roads, close to Meduna (in queen's favor)
  TIXA_PRISON, // Prison, well defended, but no point in retaking
  TIXA_SAMSITE, // The central-most sam site (important for queen to keep)
  ALMA_DEFENCE, // The military town of Meduna.  Also very important for queen.
  ALMA_MINE, // Mine income AND administrators
  CAMBRIA_DEFENCE, // Medical town, large, central.
  CAMBRIA_MINE,
  CHITZENA_DEFENCE, // Small town, small mine, far away.
  CHITZENA_MINE,
  CHITZENA_SAMSITE, // Sam site near Chitzena.
  DRASSEN_AIRPORT, // Very far away, a supply depot of little importance.
  DRASSEN_DEFENCE, // Medium town, normal.
  DRASSEN_MINE,
  DRASSEN_SAMSITE, // Sam site near Drassen (least importance to queen of all samsites)
  ROADBLOCK, // General outside city roadblocks -- enhance chance of ambush?
  SANMONA_SMALL,
  NUM_ARMY_COMPOSITIONS,
}

export interface ARMY_COMPOSITION {
  iReadability: INT32; // contains the enumeration which is useless, but helps readability.
  bPriority: INT8;
  bElitePercentage: INT8;
  bTroopPercentage: INT8;
  bAdminPercentage: INT8;
  bDesiredPopulation: INT8;
  bStartPopulation: INT8;
  bPadding: INT8[] /* [10] */;
}

export function createArmyCompositionFrom(iReadability: INT32, bPriority: INT8, bElitePercentage: INT8, bTroopPercentage: INT8, bAdminPercentage: INT8, bDesiredPopulation: INT8, bStartPopulation: INT8, bPadding: INT8[]): ARMY_COMPOSITION {
  return {
    iReadability,
    bPriority,
    bElitePercentage,
    bTroopPercentage,
    bAdminPercentage,
    bDesiredPopulation,
    bStartPopulation,
    bPadding,
  };
}

// Defines the patrol groups -- movement groups.
export interface PATROL_GROUP {
  bSize: INT8;
  bPriority: INT8;
  ubSectorID: UINT8[] /* [4] */;
  bFillPermittedAfterDayMod100: INT8;
  ubGroupID: UINT8;
  bWeight: INT8;
  ubPendingGroupID: UINT8;
  bPadding: INT8[] /* [10] */;
}

export function createPatrolGroupFrom(bSize: INT8, bPriority: INT8, ubSectorID: UINT8[], bFillPermittedAfterDayMod100: INT8, ubGroupID: UINT8, bWeight: INT8, ubPendingGroupID: UINT8, bPadding: INT8[]): PATROL_GROUP {
  return {
    bSize,
    bPriority,
    ubSectorID,
    bFillPermittedAfterDayMod100,
    ubGroupID,
    bWeight,
    ubPendingGroupID,
    bPadding,
  };
}

// Defines all stationary defence forces.
export interface GARRISON_GROUP {
  ubSectorID: UINT8;
  ubComposition: UINT8;
  bWeight: INT8;
  ubPendingGroupID: UINT8;
  bPadding: INT8[] /* [10] */;
}

export function createGarrisonGroupFrom(ubSectorID: UINT8, ubComposition: UINT8, bWeight: INT8, ubPendingGroupID: UINT8, bPadding: INT8[]): GARRISON_GROUP {
  return {
    ubSectorID,
    ubComposition,
    bWeight,
    ubPendingGroupID,
    bPadding,
  };
}

}
