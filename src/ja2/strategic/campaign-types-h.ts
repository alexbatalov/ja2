// Macro to convert sector coordinates (1-16,1-16) to 0-255
const SECTOR = (x, y) => ((y - 1) * 16 + x - 1);
const SECTORX = (SectorID) => ((SectorID % 16) + 1);
const SECTORY = (SectorID) => ((SectorID / 16) + 1);

// Sector enumerations
//
// NOTE: These use the 0-255 SectorInfo[] numbering system, and CAN'T be used as indexes into the StrategicMap[] array
// Use SECTOR_INFO_TO_STRATEGIC_INDEX() macro to convert...
const enum Enum123 {
  SEC_A1,
  SEC_A2,
  SEC_A3,
  SEC_A4,
  SEC_A5,
  SEC_A6,
  SEC_A7,
  SEC_A8,
  SEC_A9,
  SEC_A10,
  SEC_A11,
  SEC_A12,
  SEC_A13,
  SEC_A14,
  SEC_A15,
  SEC_A16,
  SEC_B1,
  SEC_B2,
  SEC_B3,
  SEC_B4,
  SEC_B5,
  SEC_B6,
  SEC_B7,
  SEC_B8,
  SEC_B9,
  SEC_B10,
  SEC_B11,
  SEC_B12,
  SEC_B13,
  SEC_B14,
  SEC_B15,
  SEC_B16,
  SEC_C1,
  SEC_C2,
  SEC_C3,
  SEC_C4,
  SEC_C5,
  SEC_C6,
  SEC_C7,
  SEC_C8,
  SEC_C9,
  SEC_C10,
  SEC_C11,
  SEC_C12,
  SEC_C13,
  SEC_C14,
  SEC_C15,
  SEC_C16,
  SEC_D1,
  SEC_D2,
  SEC_D3,
  SEC_D4,
  SEC_D5,
  SEC_D6,
  SEC_D7,
  SEC_D8,
  SEC_D9,
  SEC_D10,
  SEC_D11,
  SEC_D12,
  SEC_D13,
  SEC_D14,
  SEC_D15,
  SEC_D16,
  SEC_E1,
  SEC_E2,
  SEC_E3,
  SEC_E4,
  SEC_E5,
  SEC_E6,
  SEC_E7,
  SEC_E8,
  SEC_E9,
  SEC_E10,
  SEC_E11,
  SEC_E12,
  SEC_E13,
  SEC_E14,
  SEC_E15,
  SEC_E16,
  SEC_F1,
  SEC_F2,
  SEC_F3,
  SEC_F4,
  SEC_F5,
  SEC_F6,
  SEC_F7,
  SEC_F8,
  SEC_F9,
  SEC_F10,
  SEC_F11,
  SEC_F12,
  SEC_F13,
  SEC_F14,
  SEC_F15,
  SEC_F16,
  SEC_G1,
  SEC_G2,
  SEC_G3,
  SEC_G4,
  SEC_G5,
  SEC_G6,
  SEC_G7,
  SEC_G8,
  SEC_G9,
  SEC_G10,
  SEC_G11,
  SEC_G12,
  SEC_G13,
  SEC_G14,
  SEC_G15,
  SEC_G16,
  SEC_H1,
  SEC_H2,
  SEC_H3,
  SEC_H4,
  SEC_H5,
  SEC_H6,
  SEC_H7,
  SEC_H8,
  SEC_H9,
  SEC_H10,
  SEC_H11,
  SEC_H12,
  SEC_H13,
  SEC_H14,
  SEC_H15,
  SEC_H16,
  SEC_I1,
  SEC_I2,
  SEC_I3,
  SEC_I4,
  SEC_I5,
  SEC_I6,
  SEC_I7,
  SEC_I8,
  SEC_I9,
  SEC_I10,
  SEC_I11,
  SEC_I12,
  SEC_I13,
  SEC_I14,
  SEC_I15,
  SEC_I16,
  SEC_J1,
  SEC_J2,
  SEC_J3,
  SEC_J4,
  SEC_J5,
  SEC_J6,
  SEC_J7,
  SEC_J8,
  SEC_J9,
  SEC_J10,
  SEC_J11,
  SEC_J12,
  SEC_J13,
  SEC_J14,
  SEC_J15,
  SEC_J16,
  SEC_K1,
  SEC_K2,
  SEC_K3,
  SEC_K4,
  SEC_K5,
  SEC_K6,
  SEC_K7,
  SEC_K8,
  SEC_K9,
  SEC_K10,
  SEC_K11,
  SEC_K12,
  SEC_K13,
  SEC_K14,
  SEC_K15,
  SEC_K16,
  SEC_L1,
  SEC_L2,
  SEC_L3,
  SEC_L4,
  SEC_L5,
  SEC_L6,
  SEC_L7,
  SEC_L8,
  SEC_L9,
  SEC_L10,
  SEC_L11,
  SEC_L12,
  SEC_L13,
  SEC_L14,
  SEC_L15,
  SEC_L16,
  SEC_M1,
  SEC_M2,
  SEC_M3,
  SEC_M4,
  SEC_M5,
  SEC_M6,
  SEC_M7,
  SEC_M8,
  SEC_M9,
  SEC_M10,
  SEC_M11,
  SEC_M12,
  SEC_M13,
  SEC_M14,
  SEC_M15,
  SEC_M16,
  SEC_N1,
  SEC_N2,
  SEC_N3,
  SEC_N4,
  SEC_N5,
  SEC_N6,
  SEC_N7,
  SEC_N8,
  SEC_N9,
  SEC_N10,
  SEC_N11,
  SEC_N12,
  SEC_N13,
  SEC_N14,
  SEC_N15,
  SEC_N16,
  SEC_O1,
  SEC_O2,
  SEC_O3,
  SEC_O4,
  SEC_O5,
  SEC_O6,
  SEC_O7,
  SEC_O8,
  SEC_O9,
  SEC_O10,
  SEC_O11,
  SEC_O12,
  SEC_O13,
  SEC_O14,
  SEC_O15,
  SEC_O16,
  SEC_P1,
  SEC_P2,
  SEC_P3,
  SEC_P4,
  SEC_P5,
  SEC_P6,
  SEC_P7,
  SEC_P8,
  SEC_P9,
  SEC_P10,
  SEC_P11,
  SEC_P12,
  SEC_P13,
  SEC_P14,
  SEC_P15,
  SEC_P16,
}

// group types
const enum Enum124 {
  NOGROUP,
  MOBILE,
  DEFENCE,
}

// strategic values for each sector
const enum Enum125 {
  NO_VALUE,
  LOW_VALUE,
  FAIR_VALUE,
  AVG_VALUE,
  GOOD_VALUE,
  HI_VALUE,
  GREAT_VALUE,
}

// Various flag definitions

const SF_USE_MAP_SETTINGS = 0x00000001;
const SF_ENEMY_AMBUSH_LOCATION = 0x00000002;

// Special case flag used when players encounter enemies in a sector, then retreat.  The number of enemies
// will display on mapscreen until time is compressed.  When time is compressed, the flag is cleared, and
// a question mark is displayed to reflect that the player no longer knows.
const SF_PLAYER_KNOWS_ENEMIES_ARE_HERE = 0x00000004;

const SF_SAM_SITE = 0x00000008;
const SF_MINING_SITE = 0x00000010;
const SF_ALREADY_VISITED = 0x00000020;
const SF_USE_ALTERNATE_MAP = 0x00000040;
const SF_PENDING_ALTERNATE_MAP = 0x00000080;
const SF_ALREADY_LOADED = 0x00000100;
const SF_HAS_ENTERED_TACTICAL = 0x00000200;
const SF_SKYRIDER_NOTICED_ENEMIES_HERE = 0x00000400;
const SF_HAVE_USED_GUIDE_QUOTE = 0x00000800;

const SF_SMOKE_EFFECTS_TEMP_FILE_EXISTS = 0x00100000; // Temp File starts with sm_
const SF_LIGHTING_EFFECTS_TEMP_FILE_EXISTS = 0x00200000; // Temp File starts with l_

const SF_REVEALED_STATUS_TEMP_FILE_EXISTS = 0x01000000; // Temp File starts with v_
const SF_DOOR_STATUS_TEMP_FILE_EXISTS = 0x02000000; // Temp File starts with ds_
const SF_ENEMY_PRESERVED_TEMP_FILE_EXISTS = 0x04000000; // Temp File starts with e_
const SF_CIV_PRESERVED_TEMP_FILE_EXISTS = 0x08000000; // Temp File starts with c_
const SF_ITEM_TEMP_FILE_EXISTS = 0x10000000; // Temp File starts with i_
const SF_ROTTING_CORPSE_TEMP_FILE_EXISTS = 0x20000000; // Temp File starts with r_
const SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS = 0x40000000; // Temp File starts with m_
const SF_DOOR_TABLE_TEMP_FILES_EXISTS = 0x80000000; // Temp File starts with d_

// town militia experience categories
const enum Enum126 {
  GREEN_MILITIA = 0,
  REGULAR_MILITIA,
  ELITE_MILITIA,
  MAX_MILITIA_LEVELS,
}

// facilities flags
const SFCF_HOSPITAL = 0x00000001;
const SFCF_INDUSTRY = 0x00000002;
const SFCF_PRISON = 0x00000004;
const SFCF_MILITARY = 0x00000008;
const SFCF_AIRPORT = 0x00000010;
const SFCF_GUN_RANGE = 0x00000020;

// coordinates of shooting range sector
const GUN_RANGE_X = 13;
const GUN_RANGE_Y = MAP_ROW_H;
const GUN_RANGE_Z = 0;

// Vehicle types
const FOOT = 0x01; // anywhere
const CAR = 0x02; // roads
const TRUCK = 0x04; // roads, plains, sparse
const TRACKED = 0x08; // roads, plains, sand, sparse
const AIR = 0x10; // can traverse all terrains at 100%

// Traversability ratings
const enum Enum127 {
  TOWN, // instant
  ROAD, // everything travels at 100%
  PLAINS, // foot 90%, truck 75%, tracked 100%
  SAND, // foot 70%, tracked 60%
  SPARSE, // foot 70%, truck 50%, tracked 60%
  DENSE, // foot 50%
  SWAMP, // foot 20%
  WATER, // foot 15%
  HILLS, // foot 50%, truck 50%, tracked 50%
  GROUNDBARRIER, // only air (super dense forest, ocean, etc.)
  NS_RIVER, // river from north to south
  EW_RIVER, // river from east to west
  EDGEOFWORLD, // nobody can traverse.
  // NEW (not used for border values -- traversal calculations)
  TROPICS,
  FARMLAND,
  PLAINS_ROAD,
  SPARSE_ROAD,
  FARMLAND_ROAD,
  TROPICS_ROAD,
  DENSE_ROAD,
  COASTAL,
  HILLS_ROAD,
  COASTAL_ROAD,
  SAND_ROAD,
  SWAMP_ROAD,
  // only used for text purposes and not assigned to areas (SAM sites are hard coded throughout the code)
  SPARSE_SAM_SITE, // D15 near Drassen
  SAND_SAM_SITE, // I8 near Tixa
  TROPICS_SAM_SITE, // D2 near Chitzena
  MEDUNA_SAM_SITE, // N4 in Meduna
  CAMBRIA_HOSPITAL_SITE,
  DRASSEN_AIRPORT_SITE,
  MEDUNA_AIRPORT_SITE,
  SAM_SITE,

  REBEL_HIDEOUT,
  TIXA_DUNGEON,
  CREATURE_LAIR,
  ORTA_BASEMENT,
  TUNNEL,
  SHELTER,
  ABANDONED_MINE,

  NUM_TRAVTERRAIN_TYPES,
}

const TRAVELRATING_NONE = 0;
const TRAVELRATING_LOW = 25;
const TRAVELRATING_NORMAL = 50;
const TRAVELRATING_HIGH = 75;
const TRAVELRATING_EXTREME = 100;

// Used by ubGarrisonID when a sector doesn't point to a garrison.  Used by strategic AI only.
const NO_GARRISON = 255;

interface SECTORINFO {
  // information pertaining to this sector
  uiFlags: UINT32; // various special conditions
  ubInvestigativeState: UINT8; // When the sector is attacked by the player, the state increases by 1 permanently.
                               // This value determines how quickly it is investigated by the enemy.
  ubGarrisonID: UINT8; // IF the sector has an ID for this (non 255), then the queen values this sector and it
                       // indexes the garrison group.
  ubPendingReinforcements: INT8; // when the enemy owns this sector, this value will keep track of HIGH priority reinforcements -- not regular.
  fMilitiaTrainingPaid: BOOLEAN;
  ubMilitiaTrainingPercentDone: UINT8;
  ubMilitiaTrainingHundredths: UINT8;
  // enemy military presence
  fPlayer: BOOLEAN[] /* [4] */; // whether the player THINKS the sector is unde his control or not. array is for sublevels
  // enemy only info
  ubNumTroops: UINT8; // the actual number of troops here.
  ubNumElites: UINT8; // the actual number of elites here.
  ubNumAdmins: UINT8; // the actual number of admins here.
  ubNumCreatures: UINT8; // only set when immediately before ground attack made!

  ubTroopsInBattle: UINT8;
  ubElitesInBattle: UINT8;
  ubAdminsInBattle: UINT8;
  ubCreaturesInBattle: UINT8;

  bLastKnownEnemies: INT8; // -1 means never been there, no idea, otherwise it's what we'd observed most recently
                           // while this is being maintained (partially, surely buggy), nothing uses it anymore. ARM
  ubDayOfLastCreatureAttack: UINT32;
  uiFacilitiesFlags: UINT32; // the flags for various facilities

  ubTraversability: UINT8[] /* [5] */; // determines the traversability ratings to adjacent sectors.
                                       // The last index represents the traversability if travelling
                                       // throught the sector without entering it.
  bNameId: INT8;
  bUSUSED: INT8;
  bBloodCats: INT8;
  bBloodCatPlacements: INT8;
  UNUSEDbSAMCondition: INT8;

  ubTravelRating: UINT8; // Represents how travelled a sector is.  Typically, the higher the travel rating,
                         // the more people go near it.  A travel rating of 0 means there are never people
                         // around.  This value is used for determining how often items would "vanish" from
                         // a sector (nice theory, except it isn't being used that way.  Stealing is only in towns.  ARM)
  ubNumberOfCivsAtLevel: UINT8[] /* [MAX_MILITIA_LEVELS] */; // town militia per experience class, 0/1/2 is GREEN/REGULAR/ELITE
  usUNUSEDMilitiaLevels: UINT16; // unused (ARM)
  ubUNUSEDNumberOfJoeBlowCivilians: UINT8; // unused (ARM)
  uiTimeCurrentSectorWasLastLoaded: UINT32; // Specifies the last time the player was in the sector
  ubUNUSEDNumberOfEnemiesThoughtToBeHere: UINT8; // using bLastKnownEnemies instead
  uiTimeLastPlayerLiberated: UINT32; // in game seconds (used to prevent the queen from attacking for awhile)

  fSurfaceWasEverPlayerControlled: BOOLEAN;

  bFiller1: UINT8;
  bFiller2: UINT8;
  bFiller3: UINT8;

  uiNumberOfWorldItemsInTempFileThatCanBeSeenByPlayer: UINT32;

  bPadding: INT8[] /* [41] */;
}

const NO_ADJACENT_SECTOR = 0x00;
const NORTH_ADJACENT_SECTOR = 0x01;
const EAST_ADJACENT_SECTOR = 0x02;
const SOUTH_ADJACENT_SECTOR = 0x04;
const WEST_ADJACENT_SECTOR = 0x08;

interface UNDERGROUND_SECTORINFO {
  uiFlags: UINT32;

  ubSectorX: UINT8;
  ubSectorY: UINT8;
  ubSectorZ: UINT8;

  ubNumElites: UINT8;
  ubNumTroops: UINT8;
  ubNumAdmins: UINT8;
  ubNumCreatures: UINT8;

  fVisited: UINT8;
  ubTravelRating: INT8; // Represents how travelled a sector is.  Typically, the higher the travel rating,
                        // the more people go near it.  A travel rating of 0 means there are never people
                        // around.  This value is used for determining how often items would "vanish" from
                        // a sector.
  uiTimeCurrentSectorWasLastLoaded: UINT32; // Specifies the last time the player was in the sector
  next: Pointer<UNDERGROUND_SECTORINFO>;
  ubAdjacentSectors: UINT8; // mask containing which sectors are adjacent
  ubCreatureHabitat: UINT8; // determines how creatures live in this sector (see creature spreading.c)

  ubElitesInBattle: UINT8;
  ubTroopsInBattle: UINT8;
  ubAdminsInBattle: UINT8;
  ubCreaturesInBattle: UINT8;

  uiNumberOfWorldItemsInTempFileThatCanBeSeenByPlayer: UINT32;
  bPadding: INT8[] /* [36] */;
}
