namespace ja2 {

export const GLOBAL_SUMMARY_VERSION = 14;
export const MINIMUMVERSION = 7;

export interface TEAMSUMMARY {
  ubTotal: UINT8;
  ubDetailed: UINT8;
  ubProfile: UINT8;
  ubExistance: UINT8;
  ubNumAnimals: UINT8;

  // attributes
  ubBadA: UINT8;
  ubPoorA: UINT8;
  ubAvgA: UINT8;
  ubGoodA: UINT8;
  ubGreatA: UINT8;

  // equipment
  ubBadE: UINT8;
  ubPoorE: UINT8;
  ubAvgE: UINT8;
  ubGoodE: UINT8;
  ubGreatE: UINT8;
} // 15 bytes
export function createTeamSummary(): TEAMSUMMARY {
  return {
    ubTotal: 0,
    ubDetailed: 0,
    ubProfile: 0,
    ubExistance: 0,
    ubNumAnimals: 0,
    ubBadA: 0,
    ubPoorA: 0,
    ubAvgA: 0,
    ubGoodA: 0,
    ubGreatA: 0,
    ubBadE: 0,
    ubPoorE: 0,
    ubAvgE: 0,
    ubGoodE: 0,
    ubGreatE: 0,
  };
}

export function copyTeamSummary(destination: TEAMSUMMARY, source: TEAMSUMMARY) {
  destination.ubTotal = source.ubTotal;
  destination.ubDetailed = source.ubDetailed;
  destination.ubProfile = source.ubProfile;
  destination.ubExistance = source.ubExistance;
  destination.ubNumAnimals = source.ubNumAnimals;
  destination.ubBadA = source.ubBadA;
  destination.ubPoorA = source.ubPoorA;
  destination.ubAvgA = source.ubAvgA;
  destination.ubGoodA = source.ubGoodA;
  destination.ubGreatA = source.ubGreatA;
  destination.ubBadE = source.ubBadE;
  destination.ubPoorE = source.ubPoorE;
  destination.ubAvgE = source.ubAvgE;
  destination.ubGoodE = source.ubGoodE;
  destination.ubGreatE = source.ubGreatE;
}

export const TEAM_SUMMARY_SIZE = 15;

export function readTeamSummary(o: TEAMSUMMARY, buffer: Buffer, offset: number = 0): number {
  o.ubTotal = buffer.readUInt8(offset++);
  o.ubDetailed = buffer.readUInt8(offset++);
  o.ubProfile = buffer.readUInt8(offset++);
  o.ubExistance = buffer.readUInt8(offset++);
  o.ubNumAnimals = buffer.readUInt8(offset++);
  o.ubBadA = buffer.readUInt8(offset++);
  o.ubPoorA = buffer.readUInt8(offset++);
  o.ubAvgA = buffer.readUInt8(offset++);
  o.ubGoodA = buffer.readUInt8(offset++);
  o.ubGreatA = buffer.readUInt8(offset++);
  o.ubBadE = buffer.readUInt8(offset++);
  o.ubPoorE = buffer.readUInt8(offset++);
  o.ubAvgE = buffer.readUInt8(offset++);
  o.ubGoodE = buffer.readUInt8(offset++);
  o.ubGreatE = buffer.readUInt8(offset++);
  return offset;
}

export function writeTeamSummary(o: TEAMSUMMARY, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubTotal, offset++);
  offset = buffer.writeUInt8(o.ubDetailed, offset++);
  offset = buffer.writeUInt8(o.ubProfile, offset++);
  offset = buffer.writeUInt8(o.ubExistance, offset++);
  offset = buffer.writeUInt8(o.ubNumAnimals, offset++);
  offset = buffer.writeUInt8(o.ubBadA, offset++);
  offset = buffer.writeUInt8(o.ubPoorA, offset++);
  offset = buffer.writeUInt8(o.ubAvgA, offset++);
  offset = buffer.writeUInt8(o.ubGoodA, offset++);
  offset = buffer.writeUInt8(o.ubGreatA, offset++);
  offset = buffer.writeUInt8(o.ubBadE, offset++);
  offset = buffer.writeUInt8(o.ubPoorE, offset++);
  offset = buffer.writeUInt8(o.ubAvgE, offset++);
  offset = buffer.writeUInt8(o.ubGoodE, offset++);
  offset = buffer.writeUInt8(o.ubGreatE, offset++);
  return offset;
}

export interface SUMMARYFILE {
  // start version 1
  ubSummaryVersion: UINT8;
  ubSpecial: UINT8;
  usNumItems: UINT16;
  usNumLights: UINT16;
  MapInfo: MAPCREATE_STRUCT;
  EnemyTeam: TEAMSUMMARY;
  CreatureTeam: TEAMSUMMARY;
  RebelTeam: TEAMSUMMARY;
  CivTeam: TEAMSUMMARY;
  ubNumDoors: UINT8;
  ubNumDoorsLocked: UINT8;
  ubNumDoorsTrapped: UINT8;
  ubNumDoorsLockedAndTrapped: UINT8;
  // start version 2
  ubTilesetID: UINT8;
  ubNumRooms: UINT8;
  // start version	3
  ubNumElites: UINT8;
  ubNumAdmins: UINT8;
  ubNumTroops: UINT8;
  // start version 4
  ubEliteDetailed: UINT8;
  ubAdminDetailed: UINT8;
  ubTroopDetailed: UINT8;
  // start version 5
  ubEliteProfile: UINT8;
  ubAdminProfile: UINT8;
  ubTroopProfile: UINT8;
  // start version 6
  ubEliteExistance: UINT8;
  ubAdminExistance: UINT8;
  ubTroopExistance: UINT8;
  // start version 7
  dMajorMapVersion: FLOAT;
  // start version 8
  ubCivSchedules: UINT8;
  // start version 9
  ubCivCows: UINT8;
  ubCivBloodcats: UINT8;
  //																//-----
  //	190
  // start version 10
  ExitGrid: EXITGRID[] /* [4] */; // 5*4 //	 20
  usExitGridSize: UINT16[] /* [4] */; // 2*4 //    8
  fInvalidDest: boolean[] /* [4] */; //    4
  ubNumExitGridDests: UINT8; //		1
  fTooManyExitGridDests: boolean; //		1
  //																//-----
  //																//	224
  // start version 11
  ubEnemiesReqWaypoints: UINT8; //		1
  //																//-----
  //																		225
  // start version 12
  usWarningRoomNums: UINT16; //    2
                             //	227
  // start version 13
  ubEnemiesHaveWaypoints: UINT8; //		1
  uiNumItemsPosition: UINT32; //		4
                              //-----
                              //	232
  // start version 14
  uiEnemyPlacementPosition: UINT32; //		4
                                    //-----
                                    //	236
  ubPadding: UINT8[] /* [164] */; //	164
}

export function createSummaryFile(): SUMMARYFILE {
  return {
    ubSummaryVersion: 0,
    ubSpecial: 0,
    usNumItems: 0,
    usNumLights: 0,
    MapInfo: createMapCreateStruct(),
    EnemyTeam: createTeamSummary(),
    CreatureTeam: createTeamSummary(),
    RebelTeam: createTeamSummary(),
    CivTeam: createTeamSummary(),
    ubNumDoors: 0,
    ubNumDoorsLocked: 0,
    ubNumDoorsTrapped: 0,
    ubNumDoorsLockedAndTrapped: 0,
    ubTilesetID: 0,
    ubNumRooms: 0,
    ubNumElites: 0,
    ubNumAdmins: 0,
    ubNumTroops: 0,
    ubEliteDetailed: 0,
    ubAdminDetailed: 0,
    ubTroopDetailed: 0,
    ubEliteProfile: 0,
    ubAdminProfile: 0,
    ubTroopProfile: 0,
    ubEliteExistance: 0,
    ubAdminExistance: 0,
    ubTroopExistance: 0,
    dMajorMapVersion: 0,
    ubCivSchedules: 0,
    ubCivCows: 0,
    ubCivBloodcats: 0,
    ExitGrid: createArrayFrom(4, createExitGrid),
    usExitGridSize: createArray(4, 0),
    fInvalidDest: createArray(4, false),
    ubNumExitGridDests: 0,
    fTooManyExitGridDests: false,
    ubEnemiesReqWaypoints: 0,
    usWarningRoomNums: 0,
    ubEnemiesHaveWaypoints: 0,
    uiNumItemsPosition: 0,
    uiEnemyPlacementPosition: 0,
    ubPadding: createArray(164, 0),
  };
}

export function copySummaryFile(destination: SUMMARYFILE, source: SUMMARYFILE) {
  destination.ubSummaryVersion = source.ubSummaryVersion;
  destination.ubSpecial = source.ubSpecial;
  destination.usNumItems = source.usNumItems;
  destination.usNumLights = source.usNumLights;
  copyMapCreateStruct(destination.MapInfo, source.MapInfo);
  copyTeamSummary(destination.EnemyTeam, source.EnemyTeam);
  copyTeamSummary(destination.CreatureTeam, source.CreatureTeam);
  copyTeamSummary(destination.RebelTeam, source.RebelTeam);
  copyTeamSummary(destination.CivTeam, source.CivTeam);
  destination.ubNumDoors = source.ubNumDoors;
  destination.ubNumDoorsLocked = source.ubNumDoorsLocked;
  destination.ubNumDoorsTrapped = source.ubNumDoorsTrapped;
  destination.ubNumDoorsLockedAndTrapped = source.ubNumDoorsLockedAndTrapped;
  destination.ubTilesetID = source.ubTilesetID;
  destination.ubNumRooms = source.ubNumRooms;
  destination.ubNumElites = source.ubNumElites;
  destination.ubNumAdmins = source.ubNumAdmins;
  destination.ubNumTroops = source.ubNumTroops;
  destination.ubEliteDetailed = source.ubEliteDetailed;
  destination.ubAdminDetailed = source.ubAdminDetailed;
  destination.ubTroopDetailed = source.ubTroopDetailed;
  destination.ubEliteProfile = source.ubEliteProfile;
  destination.ubAdminProfile = source.ubAdminProfile;
  destination.ubTroopProfile = source.ubTroopProfile;
  destination.ubEliteExistance = source.ubEliteExistance;
  destination.ubAdminExistance = source.ubAdminExistance;
  destination.ubTroopExistance = source.ubTroopExistance;
  destination.dMajorMapVersion = source.dMajorMapVersion;
  destination.ubCivSchedules = source.ubCivSchedules;
  destination.ubCivCows = source.ubCivCows;
  destination.ubCivBloodcats = source.ubCivBloodcats;
  copyObjectArray(destination.ExitGrid, source.ExitGrid, copyExitGrid);
  copyArray(destination.usExitGridSize, source.usExitGridSize);
  copyArray(destination.fInvalidDest, source.fInvalidDest);
  destination.ubNumExitGridDests = source.ubNumExitGridDests;
  destination.fTooManyExitGridDests = source.fTooManyExitGridDests;
  destination.ubEnemiesReqWaypoints = source.ubEnemiesReqWaypoints;
  destination.usWarningRoomNums = source.usWarningRoomNums;
  destination.ubEnemiesHaveWaypoints = source.ubEnemiesHaveWaypoints;
  destination.uiNumItemsPosition = source.uiNumItemsPosition;
  destination.uiEnemyPlacementPosition = source.uiEnemyPlacementPosition;
  copyArray(destination.ubPadding, source.ubPadding);
}

export const SUMMARY_FILE_SIZE = 408;

export function readSummaryFile(o: SUMMARYFILE, buffer: Buffer, offset: number = 0): number {
  o.ubSummaryVersion = buffer.readUInt8(offset++);
  o.ubSpecial = buffer.readUInt8(offset++);
  o.usNumItems = buffer.readUInt16LE(offset); offset += 2;
  o.usNumLights = buffer.readUInt16LE(offset); offset += 2;
  offset = readMapCreateStruct(o.MapInfo, buffer, offset);
  offset = readTeamSummary(o.EnemyTeam, buffer, offset);
  offset = readTeamSummary(o.CreatureTeam, buffer, offset);
  offset = readTeamSummary(o.RebelTeam, buffer, offset);
  offset = readTeamSummary(o.CivTeam, buffer, offset);
  o.ubNumDoors = buffer.readUInt8(offset++);
  o.ubNumDoorsLocked = buffer.readUInt8(offset++);
  o.ubNumDoorsTrapped = buffer.readUInt8(offset++);
  o.ubNumDoorsLockedAndTrapped = buffer.readUInt8(offset++);
  o.ubTilesetID = buffer.readUInt8(offset++);
  o.ubNumRooms = buffer.readUInt8(offset++);
  o.ubNumElites = buffer.readUInt8(offset++);
  o.ubNumAdmins = buffer.readUInt8(offset++);
  o.ubNumTroops = buffer.readUInt8(offset++);
  o.ubEliteDetailed = buffer.readUInt8(offset++);
  o.ubAdminDetailed = buffer.readUInt8(offset++);
  o.ubTroopDetailed = buffer.readUInt8(offset++);
  o.ubEliteProfile = buffer.readUInt8(offset++);
  o.ubAdminProfile = buffer.readUInt8(offset++);
  o.ubTroopProfile = buffer.readUInt8(offset++);
  o.ubEliteExistance = buffer.readUInt8(offset++);
  o.ubAdminExistance = buffer.readUInt8(offset++);
  o.ubTroopExistance = buffer.readUInt8(offset++);
  o.dMajorMapVersion = buffer.readFloatLE(offset); offset += 4;
  o.ubCivSchedules = buffer.readUInt8(offset++);
  o.ubCivCows = buffer.readUInt8(offset++);
  o.ubCivBloodcats = buffer.readUInt8(offset++);
  offset++; // padding
  offset = readObjectArray(o.ExitGrid, buffer, offset, readExitGrid);
  offset = readUIntArray(o.usExitGridSize, buffer, offset, 2);
  offset = readBooleanArray(o.fInvalidDest, buffer, offset);
  o.ubNumExitGridDests = buffer.readUInt8(offset++);
  o.fTooManyExitGridDests = Boolean(buffer.readUInt8(offset++));
  o.ubEnemiesReqWaypoints = buffer.readUInt8(offset++);
  offset++; // padding
  o.usWarningRoomNums = buffer.readUInt16LE(offset); offset += 2;
  o.ubEnemiesHaveWaypoints = buffer.readUInt8(offset++);
  offset++; // padding
  o.uiNumItemsPosition = buffer.readUInt32LE(offset); offset += 4;
  o.uiEnemyPlacementPosition = buffer.readUInt32LE(offset); offset += 4;
  offset = readUIntArray(o.ubPadding, buffer, offset, 1);
  return offset;
}

export function writeSummaryFile(o: SUMMARYFILE, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubSummaryVersion, offset);
  offset = buffer.writeUInt8(o.ubSpecial, offset);
  offset = buffer.writeUInt16LE(o.usNumItems, offset);
  offset = buffer.writeUInt16LE(o.usNumLights, offset);
  offset = writeMapCreateStruct(o.MapInfo, buffer, offset);
  offset = writeTeamSummary(o.EnemyTeam, buffer, offset);
  offset = writeTeamSummary(o.CreatureTeam, buffer, offset);
  offset = writeTeamSummary(o.RebelTeam, buffer, offset);
  offset = writeTeamSummary(o.CivTeam, buffer, offset);
  offset = buffer.writeUInt8(o.ubNumDoors, offset);
  offset = buffer.writeUInt8(o.ubNumDoorsLocked, offset);
  offset = buffer.writeUInt8(o.ubNumDoorsTrapped, offset);
  offset = buffer.writeUInt8(o.ubNumDoorsLockedAndTrapped, offset);
  offset = buffer.writeUInt8(o.ubTilesetID, offset);
  offset = buffer.writeUInt8(o.ubNumRooms, offset);
  offset = buffer.writeUInt8(o.ubNumElites, offset);
  offset = buffer.writeUInt8(o.ubNumAdmins, offset);
  offset = buffer.writeUInt8(o.ubNumTroops, offset);
  offset = buffer.writeUInt8(o.ubEliteDetailed, offset);
  offset = buffer.writeUInt8(o.ubAdminDetailed, offset);
  offset = buffer.writeUInt8(o.ubTroopDetailed, offset);
  offset = buffer.writeUInt8(o.ubEliteProfile, offset);
  offset = buffer.writeUInt8(o.ubAdminProfile, offset);
  offset = buffer.writeUInt8(o.ubTroopProfile, offset);
  offset = buffer.writeUInt8(o.ubEliteExistance, offset);
  offset = buffer.writeUInt8(o.ubAdminExistance, offset);
  offset = buffer.writeUInt8(o.ubTroopExistance, offset);
  offset = buffer.writeFloatLE(o.dMajorMapVersion, offset);
  offset = buffer.writeUInt8(o.ubCivSchedules, offset);
  offset = buffer.writeUInt8(o.ubCivCows, offset);
  offset = buffer.writeUInt8(o.ubCivBloodcats, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = writeObjectArray(o.ExitGrid, buffer, offset, writeExitGrid);
  offset = writeUIntArray(o.usExitGridSize, buffer, offset, 2);
  offset = writeBooleanArray(o.fInvalidDest, buffer, offset);
  offset = buffer.writeUInt8(o.ubNumExitGridDests, offset);
  offset = buffer.writeUInt8(Number(o.fTooManyExitGridDests), offset);
  offset = buffer.writeUInt8(o.ubEnemiesReqWaypoints, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usWarningRoomNums, offset);
  offset = buffer.writeUInt8(o.ubEnemiesHaveWaypoints, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiNumItemsPosition, offset);
  offset = buffer.writeUInt32LE(o.uiEnemyPlacementPosition, offset);
  offset = writeUIntArray(o.ubPadding, buffer, offset, 1);
  return offset;
}

}
