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

export function createArmyComposition(): ARMY_COMPOSITION {
  return {
    iReadability: 0,
    bPriority: 0,
    bElitePercentage: 0,
    bTroopPercentage: 0,
    bAdminPercentage: 0,
    bDesiredPopulation: 0,
    bStartPopulation: 0,
    bPadding: createArray(10, 0),
  };
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

export function copyArmyComposition(destination: ARMY_COMPOSITION, source: ARMY_COMPOSITION) {
  destination.iReadability = source.iReadability;
  destination.bPriority = source.bPriority;
  destination.bElitePercentage = source.bElitePercentage;
  destination.bTroopPercentage = source.bTroopPercentage;
  destination.bAdminPercentage = source.bAdminPercentage;
  destination.bDesiredPopulation = source.bDesiredPopulation;
  destination.bStartPopulation = source.bStartPopulation;
  copyArray(destination.bPadding, source.bPadding);
}

export const ARMY_COMPOSITION_SIZE = 20;

export function readArmyComposition(o: ARMY_COMPOSITION, buffer: Buffer, offset: number = 0): number {
  o.iReadability = buffer.readInt32LE(offset); offset += 4;
  o.bPriority = buffer.readInt8(offset++);
  o.bElitePercentage = buffer.readInt8(offset++);
  o.bTroopPercentage = buffer.readInt8(offset++);
  o.bAdminPercentage = buffer.readInt8(offset++);
  o.bDesiredPopulation = buffer.readInt8(offset++);
  o.bStartPopulation = buffer.readInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);

  return offset;
}

export function writeArmyComposition(o: ARMY_COMPOSITION, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt32LE(o.iReadability, offset);
  offset = buffer.writeInt8(o.bPriority, offset);
  offset = buffer.writeInt8(o.bElitePercentage, offset);
  offset = buffer.writeInt8(o.bTroopPercentage, offset);
  offset = buffer.writeInt8(o.bAdminPercentage, offset);
  offset = buffer.writeInt8(o.bDesiredPopulation, offset);
  offset = buffer.writeInt8(o.bStartPopulation, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);

  return offset;
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

export function createPatrolGroup(): PATROL_GROUP {
  return {
    bSize: 0,
    bPriority: 0,
    ubSectorID: createArray(4, 0),
    bFillPermittedAfterDayMod100: 0,
    ubGroupID: 0,
    bWeight: 0,
    ubPendingGroupID: 0,
    bPadding: createArray(10, 0),
  };
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

export function copyPatrolGroup(destination: PATROL_GROUP, source: PATROL_GROUP) {
  destination.bSize = source.bSize;
  destination.bPriority = source.bPriority;
  copyArray(destination.ubSectorID, source.ubSectorID);
  destination.bFillPermittedAfterDayMod100 = source.bFillPermittedAfterDayMod100;
  destination.ubGroupID = source.ubGroupID;
  destination.bWeight = source.bWeight;
  destination.ubPendingGroupID = source.ubPendingGroupID;
  copyArray(destination.bPadding, source.bPadding);
}

export const PATROL_GROUP_SIZE = 20;

export function readPatrolGroup(o: PATROL_GROUP, buffer: Buffer, offset: number = 0): number {
  o.bSize = buffer.readInt8(offset++);
  o.bPriority = buffer.readInt8(offset++);
  offset = readUIntArray(o.ubSectorID, buffer, offset, 1);
  o.bFillPermittedAfterDayMod100 = buffer.readInt8(offset++);
  o.ubGroupID = buffer.readUInt8(offset++);
  o.bWeight = buffer.readInt8(offset++);
  o.ubPendingGroupID = buffer.readUInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);

  return offset;
}

export function writePatrolGroup(o: PATROL_GROUP, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt8(o.bSize, offset);
  offset = buffer.writeInt8(o.bPriority, offset);
  offset = writeUIntArray(o.ubSectorID, buffer, offset, 1);
  offset = buffer.writeInt8(o.bFillPermittedAfterDayMod100, offset);
  offset = buffer.writeUInt8(o.ubGroupID, offset);
  offset = buffer.writeInt8(o.bWeight, offset);
  offset = buffer.writeUInt8(o.ubPendingGroupID, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);

  return offset;
}

// Defines all stationary defence forces.
export interface GARRISON_GROUP {
  ubSectorID: UINT8;
  ubComposition: UINT8;
  bWeight: INT8;
  ubPendingGroupID: UINT8;
  bPadding: INT8[] /* [10] */;
}

export function createGarrisonGroup(): GARRISON_GROUP {
  return {
    ubSectorID: 0,
    ubComposition: 0,
    bWeight: 0,
    ubPendingGroupID: 0,
    bPadding: createArray(10, 0),
  };
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

export function copyGarrisonGroup(destination: GARRISON_GROUP, source: GARRISON_GROUP) {
  destination.ubSectorID = source.ubSectorID;
  destination.ubComposition = source.ubComposition;
  destination.bWeight = source.bWeight;
  destination.ubPendingGroupID = source.ubPendingGroupID;
  copyArray(destination.bPadding, source.bPadding);
}

export const GARRISON_GROUP_SIZE = 14;

export function readGarrisonGroup(o: GARRISON_GROUP, buffer: Buffer, offset: number = 0): number {
  o.ubSectorID = buffer.readUInt8(offset++);
  o.ubComposition = buffer.readUInt8(offset++);
  o.bWeight = buffer.readInt8(offset++);
  o.ubPendingGroupID = buffer.readUInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);

  return offset;
}

export function writeGarrisonGroup(o: GARRISON_GROUP, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubSectorID, offset);
  offset = buffer.writeUInt8(o.ubComposition, offset);
  offset = buffer.writeInt8(o.bWeight, offset);
  offset = buffer.writeUInt8(o.ubPendingGroupID, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);

  return offset;
}

}
