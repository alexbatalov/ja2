namespace ja2 {

export const SOLDIER_CREATE_AUTO_TEAM = -1;

// Kris:
// This value is the total maximum number of slots in a map.
// Players		20
// Enemies		32
// Creatures 32
// Rebels		32
// Civilians 32
// Total			148
export const MAX_INDIVIDUALS = 148;

// Kris:  SERIALIZING INFORMATION
// All maps must have:
//	-MAPCREATE_STRUCT
//		MAPCREATE_STRUCT.ubNumIndividuals determines how many BASIC_SOLDIERCREATE_STRUCTs there are
//  -The BASIC_SOLDIERCREATE_STRUCTS are saved contiguously, but if any of them
//		fDetailedPlacement set, then there is a SOLDIERCREATE_STRUCT saved immediately after.

// These are the placement slots used by the editor to define where characters are in a map, what
// they are, what team they are on, personality traits, etc.  The Merc section of the editor is
// what is used to define these values.
export interface BASIC_SOLDIERCREATE_STRUCT {
  fDetailedPlacement: boolean; // Specialized information.  Has a counterpart containing all info.
  usStartingGridNo: UINT16; // Where the placement position is.
  bTeam: INT8; // The team this individual is part of.
  bRelativeAttributeLevel: INT8;
  bRelativeEquipmentLevel: INT8;
  bDirection: INT8; // 1 of 8 values (always mandatory)
  bOrders: INT8;
  bAttitude: INT8;
  bBodyType: INT8; // up to 128 body types, -1 means random
  sPatrolGrid: INT16[] /* [MAXPATROLGRIDS] */; // possible locations to visit, patrol, etc.
  bPatrolCnt: INT8;
  fOnRoof: boolean;
  ubSoldierClass: UINT8; // army, administrator, elite
  ubCivilianGroup: UINT8;
  fPriorityExistance: boolean; // These slots are used first
  fHasKeys: boolean;
  PADDINGSLOTS: INT8[] /* [14] */;
} // 50 bytes

export function createBasicSoldierCreateStruct(): BASIC_SOLDIERCREATE_STRUCT {
  return {
    fDetailedPlacement: false,
    usStartingGridNo: 0,
    bTeam: 0,
    bRelativeAttributeLevel: 0,
    bRelativeEquipmentLevel: 0,
    bDirection: 0,
    bOrders: 0,
    bAttitude: 0,
    bBodyType: 0,
    sPatrolGrid: createArray(MAXPATROLGRIDS, 0),
    bPatrolCnt: 0,
    fOnRoof: false,
    ubSoldierClass: 0,
    ubCivilianGroup: 0,
    fPriorityExistance: false,
    fHasKeys: false,
    PADDINGSLOTS: createArray(14, 0),
  };
}

export function copyBasicSoldierCreateStruct(destination: BASIC_SOLDIERCREATE_STRUCT, source: BASIC_SOLDIERCREATE_STRUCT) {
  destination.fDetailedPlacement = source.fDetailedPlacement;
  destination.usStartingGridNo = source.usStartingGridNo;
  destination.bTeam = source.bTeam;
  destination.bRelativeAttributeLevel = source.bRelativeAttributeLevel;
  destination.bRelativeEquipmentLevel = source.bRelativeEquipmentLevel;
  destination.bDirection = source.bDirection;
  destination.bOrders = source.bOrders;
  destination.bAttitude = source.bAttitude;
  destination.bBodyType = source.bBodyType;
  copyArray(destination.sPatrolGrid, source.sPatrolGrid);
  destination.bPatrolCnt = source.bPatrolCnt;
  destination.fOnRoof = source.fOnRoof;
  destination.ubSoldierClass = source.ubSoldierClass;
  destination.ubCivilianGroup = source.ubCivilianGroup;
  destination.fPriorityExistance = source.fPriorityExistance;
  destination.fHasKeys = source.fHasKeys;
  copyArray(destination.PADDINGSLOTS, source.PADDINGSLOTS);
}

export function resetBasicSoldierCreateStruct(o: BASIC_SOLDIERCREATE_STRUCT) {
  o.fDetailedPlacement = false;
  o.usStartingGridNo = 0;
  o.bTeam = 0;
  o.bRelativeAttributeLevel = 0;
  o.bRelativeEquipmentLevel = 0;
  o.bDirection = 0;
  o.bOrders = 0;
  o.bAttitude = 0;
  o.bBodyType = 0;
  o.sPatrolGrid.fill(0);
  o.bPatrolCnt = 0;
  o.fOnRoof = false;
  o.ubSoldierClass = 0;
  o.ubCivilianGroup = 0;
  o.fPriorityExistance = false;
  o.fHasKeys = false;
  o.PADDINGSLOTS.fill(0);
}

export const BASIC_SOLDIER_CREATE_STRUCT_SIZE = 52;

export function readBasicSoldierCreateStruct(o: BASIC_SOLDIERCREATE_STRUCT, buffer: Buffer, offset: number = 0): number {
  o.fDetailedPlacement = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.usStartingGridNo = buffer.readUInt16LE(offset); offset += 2;
  o.bTeam = buffer.readInt8(offset++);
  o.bRelativeAttributeLevel = buffer.readInt8(offset++);
  o.bRelativeEquipmentLevel = buffer.readInt8(offset++);
  o.bDirection = buffer.readInt8(offset++);
  o.bOrders = buffer.readInt8(offset++);
  o.bAttitude = buffer.readInt8(offset++);
  o.bBodyType = buffer.readInt8(offset++);
  offset++; // padding
  offset = readIntArray(o.sPatrolGrid, buffer, offset, 2);
  o.bPatrolCnt = buffer.readInt8(offset++);
  o.fOnRoof = Boolean(buffer.readUInt8(offset++));
  o.ubSoldierClass = buffer.readUInt8(offset++);
  o.ubCivilianGroup = buffer.readUInt8(offset++);
  o.fPriorityExistance = Boolean(buffer.readUInt8(offset++));
  o.fHasKeys = Boolean(buffer.readUInt8(offset++));
  offset = readIntArray(o.PADDINGSLOTS, buffer, offset, 1);
  return offset;
}

export function writeBasicSoldierCreateStruct(o: BASIC_SOLDIERCREATE_STRUCT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fDetailedPlacement), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usStartingGridNo, offset);
  offset = buffer.writeInt8(o.bTeam, offset);
  offset = buffer.writeInt8(o.bRelativeAttributeLevel, offset);
  offset = buffer.writeInt8(o.bRelativeEquipmentLevel, offset);
  offset = buffer.writeInt8(o.bDirection, offset);
  offset = buffer.writeInt8(o.bOrders, offset);
  offset = buffer.writeInt8(o.bAttitude, offset);
  offset = buffer.writeInt8(o.bBodyType, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = writeIntArray(o.sPatrolGrid, buffer, offset, 2);
  offset = buffer.writeInt8(o.bPatrolCnt, offset);
  offset = buffer.writeUInt8(Number(o.fOnRoof), offset);
  offset = buffer.writeUInt8(o.ubSoldierClass, offset);
  offset = buffer.writeUInt8(o.ubCivilianGroup, offset);
  offset = buffer.writeUInt8(Number(o.fPriorityExistance), offset);
  offset = buffer.writeUInt8(Number(o.fHasKeys), offset);
  offset = writeIntArray(o.PADDINGSLOTS, buffer, offset, 1);
  return offset;
}

export interface SOLDIERCREATE_STRUCT {
  // Bulletproofing so static detailed placements aren't used to tactically create soldiers.
  // Used by editor for validation purposes.
  fStatic: boolean;

  // Profile information used for special NPCs and player mercs.
  ubProfile: UINT8;
  fPlayerMerc: boolean;
  fPlayerPlan: boolean;
  fCopyProfileItemsOver: boolean;

  // Location information
  sSectorX: INT16;
  sSectorY: INT16;
  bDirection: INT8;
  sInsertionGridNo: INT16;

  // Can force a team, but needs flag set
  bTeam: INT8;
  bBodyType: INT8;

  // Orders and attitude settings
  bAttitude: INT8;
  bOrders: INT8;

  // Attributes
  bLifeMax: INT8;
  bLife: INT8;
  bAgility: INT8;
  bDexterity: INT8;
  bExpLevel: INT8;
  bMarksmanship: INT8;
  bMedical: INT8;
  bMechanical: INT8;
  bExplosive: INT8;
  bLeadership: INT8;
  bStrength: INT8;
  bWisdom: INT8;
  bMorale: INT8;
  bAIMorale: INT8;

  // Inventory
  Inv: OBJECTTYPE[] /* [NUM_INV_SLOTS] */;

  // Palette information for soldiers.
  HeadPal: PaletteRepID;
  PantsPal: PaletteRepID;
  VestPal: PaletteRepID;
  SkinPal: PaletteRepID;
  MiscPal: PaletteRepID;

  // Waypoint information for patrolling
  sPatrolGrid: INT16[] /* [MAXPATROLGRIDS] */;
  bPatrolCnt: INT8;

  // Kris:  Additions November 16, 1997 (padding down to 129 from 150)
  fVisible: boolean;
  name: string /* UINT16[10] */;

  ubSoldierClass: UINT8; // army, administrator, elite

  fOnRoof: boolean;

  bSectorZ: INT8;

  pExistingSoldier: SOLDIERTYPE | null;
  fUseExistingSoldier: boolean;
  ubCivilianGroup: UINT8;

  fKillSlotIfOwnerDies: boolean;
  ubScheduleID: UINT8;

  fUseGivenVehicle: boolean;
  bUseGivenVehicleID: INT8;
  fHasKeys: boolean;

  bPadding: INT8[] /* [115] */;
}

export function createSoldierCreateStruct(): SOLDIERCREATE_STRUCT {
  return {
    fStatic: false,
    ubProfile: 0,
    fPlayerMerc: false,
    fPlayerPlan: false,
    fCopyProfileItemsOver: false,
    sSectorX: 0,
    sSectorY: 0,
    bDirection: 0,
    sInsertionGridNo: 0,
    bTeam: 0,
    bBodyType: 0,
    bAttitude: 0,
    bOrders: 0,
    bLifeMax: 0,
    bLife: 0,
    bAgility: 0,
    bDexterity: 0,
    bExpLevel: 0,
    bMarksmanship: 0,
    bMedical: 0,
    bMechanical: 0,
    bExplosive: 0,
    bLeadership: 0,
    bStrength: 0,
    bWisdom: 0,
    bMorale: 0,
    bAIMorale: 0,
    Inv: createArrayFrom(Enum261.NUM_INV_SLOTS, createObjectType),
    HeadPal: "",
    PantsPal: "",
    VestPal: "",
    SkinPal: "",
    MiscPal: "",
    sPatrolGrid: createArray(MAXPATROLGRIDS, 0),
    bPatrolCnt: 0,
    fVisible: false,
    name: "",
    ubSoldierClass: 0,
    fOnRoof: false,
    bSectorZ: 0,
    pExistingSoldier: null,
    fUseExistingSoldier: false,
    ubCivilianGroup: 0,
    fKillSlotIfOwnerDies: false,
    ubScheduleID: 0,
    fUseGivenVehicle: false,
    bUseGivenVehicleID: 0,
    fHasKeys: false,
    bPadding: createArray(115, 0),
  };
}

export function copySoldierCreateStruct(destination: SOLDIERCREATE_STRUCT, source: SOLDIERCREATE_STRUCT) {
  destination.fStatic = source.fStatic;
  destination.ubProfile = source.ubProfile;
  destination.fPlayerMerc = source.fPlayerMerc;
  destination.fPlayerPlan = source.fPlayerPlan;
  destination.fCopyProfileItemsOver = source.fCopyProfileItemsOver;
  destination.sSectorX = source.sSectorX;
  destination.sSectorY = source.sSectorY;
  destination.bDirection = source.bDirection;
  destination.sInsertionGridNo = source.sInsertionGridNo;
  destination.bTeam = source.bTeam;
  destination.bBodyType = source.bBodyType;
  destination.bAttitude = source.bAttitude;
  destination.bOrders = source.bOrders;
  destination.bLifeMax = source.bLifeMax;
  destination.bLife = source.bLife;
  destination.bAgility = source.bAgility;
  destination.bDexterity = source.bDexterity;
  destination.bExpLevel = source.bExpLevel;
  destination.bMarksmanship = source.bMarksmanship;
  destination.bMedical = source.bMedical;
  destination.bMechanical = source.bMechanical;
  destination.bExplosive = source.bExplosive;
  destination.bLeadership = source.bLeadership;
  destination.bStrength = source.bStrength;
  destination.bWisdom = source.bWisdom;
  destination.bMorale = source.bMorale;
  destination.bAIMorale = source.bAIMorale;

  for (let i = 0; i < Enum261.NUM_INV_SLOTS; i++) {
    copyObjectType(destination.Inv[i], source.Inv[i]);
  }

  destination.HeadPal = source.HeadPal;
  destination.PantsPal = source.PantsPal;
  destination.VestPal = source.VestPal;
  destination.SkinPal = source.SkinPal;
  destination.MiscPal = source.MiscPal;
  copyArray(destination.sPatrolGrid, source.sPatrolGrid);
  destination.bPatrolCnt = source.bPatrolCnt;
  destination.fVisible = source.fVisible;
  destination.name = source.name;
  destination.ubSoldierClass = source.ubSoldierClass;
  destination.fOnRoof = source.fOnRoof;
  destination.bSectorZ = source.bSectorZ;
  destination.pExistingSoldier = source.pExistingSoldier;
  destination.fUseExistingSoldier = source.fUseExistingSoldier;
  destination.ubCivilianGroup = source.ubCivilianGroup;
  destination.fKillSlotIfOwnerDies = source.fKillSlotIfOwnerDies;
  destination.ubScheduleID = source.ubScheduleID;
  destination.fUseGivenVehicle = source.fUseGivenVehicle;
  destination.bUseGivenVehicleID = source.bUseGivenVehicleID;
  destination.fHasKeys = source.fHasKeys;
  copyArray(destination.bPadding, source.bPadding);
}

export function resetSoldierCreateStruct(o: SOLDIERCREATE_STRUCT) {
  o.fStatic = false;
  o.ubProfile = 0;
  o.fPlayerMerc = false;
  o.fPlayerPlan = false;
  o.fCopyProfileItemsOver = false;
  o.sSectorX = 0;
  o.sSectorY = 0;
  o.bDirection = 0;
  o.sInsertionGridNo = 0;
  o.bTeam = 0;
  o.bBodyType = 0;
  o.bAttitude = 0;
  o.bOrders = 0;
  o.bLifeMax = 0;
  o.bLife = 0;
  o.bAgility = 0;
  o.bDexterity = 0;
  o.bExpLevel = 0;
  o.bMarksmanship = 0;
  o.bMedical = 0;
  o.bMechanical = 0;
  o.bExplosive = 0;
  o.bLeadership = 0;
  o.bStrength = 0;
  o.bWisdom = 0;
  o.bMorale = 0;
  o.bAIMorale = 0;
  o.Inv.forEach(resetObjectType);
  o.HeadPal = "";
  o.PantsPal = "";
  o.VestPal = "";
  o.SkinPal = "";
  o.MiscPal = "";
  o.sPatrolGrid.fill(0);
  o.bPatrolCnt = 0;
  o.fVisible = false;
  o.name = "";
  o.ubSoldierClass = 0;
  o.fOnRoof = false;
  o.bSectorZ = 0;
  o.pExistingSoldier = null;
  o.fUseExistingSoldier = false;
  o.ubCivilianGroup = 0;
  o.fKillSlotIfOwnerDies = false;
  o.ubScheduleID = 0;
  o.fUseGivenVehicle = false;
  o.bUseGivenVehicleID = 0;
  o.fHasKeys = false;
  o.bPadding.fill(0);
}

export const SOLDIER_CREATE_STRUCT_SIZE = 1040;

export function readSoldierCreateStruct(o: SOLDIERCREATE_STRUCT, buffer: Buffer, offset: number = 0): number {
  o.fStatic = Boolean(buffer.readUInt8(offset++));
  o.ubProfile = buffer.readUInt8(offset++);
  o.fPlayerMerc = Boolean(buffer.readUInt8(offset++));
  o.fPlayerPlan = Boolean(buffer.readUInt8(offset++));
  o.fCopyProfileItemsOver = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.sSectorX = buffer.readInt16LE(offset); offset += 2;
  o.sSectorY = buffer.readInt16LE(offset); offset += 2;
  o.bDirection = buffer.readInt8(offset++);
  offset++; // padding
  o.sInsertionGridNo = buffer.readInt16LE(offset); offset += 2;
  o.bTeam = buffer.readInt8(offset++);
  o.bBodyType = buffer.readInt8(offset++);
  o.bAttitude = buffer.readInt8(offset++);
  o.bOrders = buffer.readInt8(offset++);
  o.bLifeMax = buffer.readInt8(offset++);
  o.bLife = buffer.readInt8(offset++);
  o.bAgility = buffer.readInt8(offset++);
  o.bDexterity = buffer.readInt8(offset++);
  o.bExpLevel = buffer.readInt8(offset++);
  o.bMarksmanship = buffer.readInt8(offset++);
  o.bMedical = buffer.readInt8(offset++);
  o.bMechanical = buffer.readInt8(offset++);
  o.bExplosive = buffer.readInt8(offset++);
  o.bLeadership = buffer.readInt8(offset++);
  o.bStrength = buffer.readInt8(offset++);
  o.bWisdom = buffer.readInt8(offset++);
  o.bMorale = buffer.readInt8(offset++);
  o.bAIMorale = buffer.readInt8(offset++);
  offset = readObjectArray(o.Inv, buffer, offset, readObjectType);
  o.HeadPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.PantsPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.VestPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.SkinPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  o.MiscPal = readStringNL(buffer, 'ascii', offset, offset + 30); offset += 30;
  offset = readIntArray(o.sPatrolGrid, buffer, offset, 2);
  o.bPatrolCnt = buffer.readInt8(offset++);
  o.fVisible = Boolean(buffer.readUInt8(offset++));
  o.name = readStringNL(buffer, 'utf16le', offset, offset + 20); offset += 20;
  o.ubSoldierClass = buffer.readUInt8(offset++);
  o.fOnRoof = Boolean(buffer.readUInt8(offset++));
  o.bSectorZ = buffer.readInt8(offset++);
  offset++; // padding
  o.pExistingSoldier = null; offset += 4; // pointer
  o.fUseExistingSoldier = Boolean(buffer.readUInt8(offset++));
  o.ubCivilianGroup = buffer.readUInt8(offset++);
  o.fKillSlotIfOwnerDies = Boolean(buffer.readUInt8(offset++));
  o.ubScheduleID = buffer.readUInt8(offset++);
  o.fUseGivenVehicle = Boolean(buffer.readUInt8(offset++));
  o.bUseGivenVehicleID = buffer.readInt8(offset++);
  o.fHasKeys = Boolean(buffer.readUInt8(offset++));
  offset = readIntArray(o.bPadding, buffer, offset, 1);
  offset += 2; // padding
  return offset;
}

export function writeSoldierCreateStruct(o: SOLDIERCREATE_STRUCT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fStatic), offset);
  offset = buffer.writeUInt8(o.ubProfile, offset);
  offset = buffer.writeUInt8(Number(o.fPlayerMerc), offset);
  offset = buffer.writeUInt8(Number(o.fPlayerPlan), offset);
  offset = buffer.writeUInt8(Number(o.fCopyProfileItemsOver), offset);
  offset = writePadding(buffer, offset, 1);
  offset = buffer.writeInt16LE(o.sSectorX, offset);
  offset = buffer.writeInt16LE(o.sSectorY, offset);
  offset = buffer.writeInt8(o.bDirection, offset);
  offset = writePadding(buffer, offset, 1);
  offset = buffer.writeInt16LE(o.sInsertionGridNo, offset);
  offset = buffer.writeInt8(o.bTeam, offset);
  offset = buffer.writeInt8(o.bBodyType, offset);
  offset = buffer.writeInt8(o.bAttitude, offset);
  offset = buffer.writeInt8(o.bOrders, offset);
  offset = buffer.writeInt8(o.bLifeMax, offset);
  offset = buffer.writeInt8(o.bLife, offset);
  offset = buffer.writeInt8(o.bAgility, offset);
  offset = buffer.writeInt8(o.bDexterity, offset);
  offset = buffer.writeInt8(o.bExpLevel, offset);
  offset = buffer.writeInt8(o.bMarksmanship, offset);
  offset = buffer.writeInt8(o.bMedical, offset);
  offset = buffer.writeInt8(o.bMechanical, offset);
  offset = buffer.writeInt8(o.bExplosive, offset);
  offset = buffer.writeInt8(o.bLeadership, offset);
  offset = buffer.writeInt8(o.bStrength, offset);
  offset = buffer.writeInt8(o.bWisdom, offset);
  offset = buffer.writeInt8(o.bMorale, offset);
  offset = buffer.writeInt8(o.bAIMorale, offset);
  offset = writeObjectArray(o.Inv, buffer, offset, writeObjectType);
  offset = writeStringNL(o.HeadPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.PantsPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.VestPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.SkinPal, buffer, offset, 30, 'ascii');
  offset = writeStringNL(o.MiscPal, buffer, offset, 30, 'ascii');
  offset = writeIntArray(o.sPatrolGrid, buffer, offset, 2);
  offset = buffer.writeInt8(o.bPatrolCnt, offset);
  offset = buffer.writeUInt8(Number(o.fVisible), offset);
  offset = writeStringNL(o.name, buffer, offset, 20, 'utf16le');
  offset = buffer.writeUInt8(o.ubSoldierClass, offset);
  offset = buffer.writeUInt8(Number(o.fOnRoof), offset);
  offset = buffer.writeInt8(o.bSectorZ, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = writePadding(buffer, offset, 4); // pExistingSoldier (pointer)
  offset = buffer.writeUInt8(Number(o.fUseExistingSoldier), offset);
  offset = buffer.writeUInt8(o.ubCivilianGroup, offset);
  offset = buffer.writeUInt8(Number(o.fKillSlotIfOwnerDies), offset);
  offset = buffer.writeUInt8(o.ubScheduleID, offset);
  offset = buffer.writeUInt8(Number(o.fUseGivenVehicle), offset);
  offset = buffer.writeInt8(o.bUseGivenVehicleID, offset);
  offset = buffer.writeUInt8(Number(o.fHasKeys), offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);
  offset = writePadding(buffer, offset, 2); // padding
  return offset;
}

// These following functions are currently used exclusively by the editor.
// Now, this will be useful for the strategic AI.
// Definitions:
// Soldier (s):	Currently in the game, but subject to modifications.  The editor has the capability to
//  modify soldier attributes on the fly for testing purposes.
// BasicPlacement (bp):  A BASIC_SOLDIERCREATE_STRUCT that contains compact, very general, information about
//  a soldier.  The BasicPlacement is then used to generate a DetailedPlacement before creating a soldier.
//	Most of the soldiers saved in the maps will be saved in this manner.
// DetailedPlacement (pp):  A SOLDIERCREATE_STRUCT ready to be passed to TacticalCreateSoldier to generate
//	and add a new soldier to the world.  The DetailedPlacement contains all of the necessary information
//  to do this.  This information won't be saved in maps. In most cases, only very few attributes are static,
//  and the rest are generated at runtime.  Because of this situation, saved detailed placements must be in a
//  different format.
// StaticDetailedPlacement (spp):  A hybrid version of the DetailedPlacement.  This is the information saved in
//	the map via the editor.  When loaded, this information is converted to a normal detailed placement, but
//	must also use the BasicPlacement information to complete this properly.  Once the conversion is complete,
//	the static information is lost.  This gives us complete flexibility.  The basic placements contain relative
//  values that work in conjunction with the strategic AI's relative values to generate soldiers.  In no
//  circumstances will static detailed placements be used outside of the editor.  Note, that this hybrid version
//  uses the identical structure as detailed placements.  All non-static values are set to -1.

}
