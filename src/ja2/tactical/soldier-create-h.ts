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
  name: UINT16[] /* [10] */;

  ubSoldierClass: UINT8; // army, administrator, elite

  fOnRoof: boolean;

  bSectorZ: INT8;

  pExistingSoldier: Pointer<SOLDIERTYPE>;
  fUseExistingSoldier: boolean;
  ubCivilianGroup: UINT8;

  fKillSlotIfOwnerDies: boolean;
  ubScheduleID: UINT8;

  fUseGivenVehicle: boolean;
  bUseGivenVehicleID: INT8;
  fHasKeys: boolean;

  bPadding: INT8[] /* [115] */;
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
