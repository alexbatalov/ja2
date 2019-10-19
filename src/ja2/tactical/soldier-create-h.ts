const SOLDIER_CREATE_AUTO_TEAM = -1;

// Kris:
// This value is the total maximum number of slots in a map.
// Players		20
// Enemies		32
// Creatures 32
// Rebels		32
// Civilians 32
// Total			148
const MAX_INDIVIDUALS = 148;

// Kris:  SERIALIZING INFORMATION
// All maps must have:
//	-MAPCREATE_STRUCT
//		MAPCREATE_STRUCT.ubNumIndividuals determines how many BASIC_SOLDIERCREATE_STRUCTs there are
//  -The BASIC_SOLDIERCREATE_STRUCTS are saved contiguously, but if any of them
//		fDetailedPlacement set, then there is a SOLDIERCREATE_STRUCT saved immediately after.

// These are the placement slots used by the editor to define where characters are in a map, what
// they are, what team they are on, personality traits, etc.  The Merc section of the editor is
// what is used to define these values.
interface BASIC_SOLDIERCREATE_STRUCT {
  fDetailedPlacement: BOOLEAN; // Specialized information.  Has a counterpart containing all info.
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
  fOnRoof: BOOLEAN;
  ubSoldierClass: UINT8; // army, administrator, elite
  ubCivilianGroup: UINT8;
  fPriorityExistance: BOOLEAN; // These slots are used first
  fHasKeys: BOOLEAN;
  PADDINGSLOTS: INT8[] /* [14] */;
} // 50 bytes

interface SOLDIERCREATE_STRUCT {
  // Bulletproofing so static detailed placements aren't used to tactically create soldiers.
  // Used by editor for validation purposes.
  fStatic: BOOLEAN;

  // Profile information used for special NPCs and player mercs.
  ubProfile: UINT8;
  fPlayerMerc: BOOLEAN;
  fPlayerPlan: BOOLEAN;
  fCopyProfileItemsOver: BOOLEAN;

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
  fVisible: BOOLEAN;
  name: UINT16[] /* [10] */;

  ubSoldierClass: UINT8; // army, administrator, elite

  fOnRoof: BOOLEAN;

  bSectorZ: INT8;

  pExistingSoldier: Pointer<SOLDIERTYPE>;
  fUseExistingSoldier: BOOLEAN;
  ubCivilianGroup: UINT8;

  fKillSlotIfOwnerDies: BOOLEAN;
  ubScheduleID: UINT8;

  fUseGivenVehicle: BOOLEAN;
  bUseGivenVehicleID: INT8;
  fHasKeys: BOOLEAN;

  bPadding: INT8[] /* [115] */;
}

// Original functions currently used throughout the game.
BOOLEAN TacticalRemoveSoldier(UINT16 usSoldierIndex);
BOOLEAN TacticalRemoveSoldierPointer(SOLDIERTYPE *pSoldier, BOOLEAN fRemoveVehicle);

INT8 CalcDifficultyModifier(UINT8 ubSoldierClass);

void RandomizeNewSoldierStats(SOLDIERCREATE_STRUCT *pCreateStruct);

// Kris:
// Modified return type from BOOLEAN to SOLDIERTYPE*
SOLDIERTYPE *TacticalCreateSoldier(SOLDIERCREATE_STRUCT *pCreateStruct, UINT8 *pubID);

// Randomly generated enemies used by strategic AI.
SOLDIERTYPE *TacticalCreateAdministrator();
SOLDIERTYPE *TacticalCreateEliteEnemy();
SOLDIERTYPE *TacticalCreateArmyTroop();
SOLDIERTYPE *TacticalCreateMilitia(UINT8 ubMilitiaClass);
SOLDIERTYPE *TacticalCreateCreature(INT8 bCreatureBodyType);

// randomly generates a relative level rating (attributes or equipment)
void RandomizeRelativeLevel(INT8 *pbRelLevel, UINT8 ubSoldierClass);

// get the pythag. distance from the passed sector to the palace..
UINT8 GetPythDistanceFromPalace(INT16 sSectorX, INT16 sSectorY);

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

// Used to generate a detailed placement from a basic placement.  This assumes that the detailed placement
// doesn't exist, meaning there are no static attributes.  This is called when you wish to convert a basic
// placement into a detailed placement just before creating a soldier.
void CreateDetailedPlacementGivenBasicPlacementInfo(SOLDIERCREATE_STRUCT *pp, BASIC_SOLDIERCREATE_STRUCT *bp);

// Used exclusively by the editor when the user wishes to change a basic placement into a detailed placement.
// Because the intention is to make some of the attributes static, all of the information that can be generated
// are defaulted to -1.  When an attribute is made to be static, that value in replaced by the new static value.
// This information is NOT compatible with TacticalCreateSoldier.  Before doing so, you must first convert the
// static detailed placement to a regular detailed placement.
void CreateStaticDetailedPlacementGivenBasicPlacementInfo(SOLDIERCREATE_STRUCT *spp, BASIC_SOLDIERCREATE_STRUCT *bp);

// When you are ready to generate a soldier with a static detailed placement slot, this function will generate
// the proper priority placement slot given the static detailed placement and it's accompanying basic placment.
// For the purposes of merc editing, the static detailed placement is preserved.
void CreateDetailedPlacementGivenStaticDetailedPlacementAndBasicPlacementInfo(SOLDIERCREATE_STRUCT *pp, SOLDIERCREATE_STRUCT *spp, BASIC_SOLDIERCREATE_STRUCT *bp);

// Used to update a existing soldier's attributes with the new static detailed placement info.  This is used
// by the editor upon exiting the editor into the game, to update the existing soldiers with new information.
// This gives flexibility of testing mercs.  Upon entering the editor again, this call will reset all the
// mercs to their original states.
void UpdateSoldierWithStaticDetailedInformation(SOLDIERTYPE *s, SOLDIERCREATE_STRUCT *spp);

// In the case of setting a profile ID in order to extract a soldier from the profile array, we
// also want to copy that information to the static detailed placement, for editor viewing purposes.
void UpdateStaticDetailedPlacementWithProfileInformation(SOLDIERCREATE_STRUCT *spp, UINT8 ubProfile);

// When the editor modifies the soldier's relative attribute level,
// this function is called to update that information.
void ModifySoldierAttributesWithNewRelativeLevel(SOLDIERTYPE *s, INT8 bLevel);

// Force the soldier to be a different ID
void ForceSoldierProfileID(SOLDIERTYPE *pSoldier, UINT8 ubProfileID);

void GeneratePaletteForSoldier(SOLDIERTYPE *pSoldier, UINT8 ubSoldierClass);

void QuickCreateProfileMerc(INT8 bTeam, UINT8 ubProfileID);

BOOLEAN InternalTacticalRemoveSoldier(UINT16 usSoldierIndex, BOOLEAN fRemoveVehicle);

// SPECIAL!  Certain events in the game can cause profiled NPCs to become enemies.  The two cases are
// adding Mike and Iggy.  We will only add one NPC in any given combat and the conditions for setting
// the associated facts are done elsewhere.  The function will set the profile for the SOLDIERCREATE_STRUCT
// and the rest will be handled automatically so long the ubProfile field doesn't get changed.
// NOTE:  We don't want to add Mike or Iggy if this is being called from autoresolve!
void OkayToUpgradeEliteToSpecialProfiledEnemy(SOLDIERCREATE_STRUCT *pp);
extern BOOLEAN gfProfiledEnemyAdded; // needs to be saved (used by the above function)
