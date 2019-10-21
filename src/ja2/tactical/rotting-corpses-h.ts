const NUM_CORPSE_SHADES = 17;

const enum Enum249 {
  NO_CORPSE,
  SMERC_JFK,
  SMERC_BCK,
  SMERC_FWD,
  SMERC_DHD,
  SMERC_PRN,
  SMERC_WTR,
  SMERC_FALL,
  SMERC_FALLF,

  MMERC_JFK,
  MMERC_BCK,
  MMERC_FWD,
  MMERC_DHD,
  MMERC_PRN,
  MMERC_WTR,
  MMERC_FALL,
  MMERC_FALLF,

  FMERC_JFK,
  FMERC_BCK,
  FMERC_FWD,
  FMERC_DHD,
  FMERC_PRN,
  FMERC_WTR,
  FMERC_FALL,
  FMERC_FALLF,

  // CIVS
  M_DEAD1,
  K_DEAD1,
  H_DEAD1,
  FT_DEAD1,
  S_DEAD1,
  W_DEAD1,
  C_DEAD1,
  M_DEAD2,
  K_DEAD2,
  H_DEAD2,

  FT_DEAD2,
  S_DEAD2,
  W_DEAD2,
  C_DEAD2,
  BLOODCAT_DEAD,
  COW_DEAD,
  ADULTMONSTER_DEAD,
  INFANTMONSTER_DEAD,
  LARVAEMONSTER_DEAD,
  ROTTING_STAGE2,

  TANK1_DEAD,
  TANK2_DEAD,
  HUMMER_DEAD,
  ICECREAM_DEAD,
  QUEEN_MONSTER_DEAD,
  ROBOT_DEAD,
  BURNT_DEAD,
  EXPLODE_DEAD,

  NUM_CORPSES,
}

const ROTTING_CORPSE_FIND_SWEETSPOT_FROM_GRIDNO = 0x01; // Find the closest spot to the given gridno
const ROTTING_CORPSE_USE_NORTH_ENTRY_POINT = 0x02; // Find the spot closest to the north entry grid
const ROTTING_CORPSE_USE_SOUTH_ENTRY_POINT = 0x04; // Find the spot closest to the south entry grid
const ROTTING_CORPSE_USE_EAST_ENTRY_POINT = 0x08; // Find the spot closest to the east entry grid
const ROTTING_CORPSE_USE_WEST_ENTRY_POINT = 0x10; // Find the spot closest to the west entry grid
const ROTTING_CORPSE_USE_CAMMO_PALETTE = 0x20; // We use cammo palette here....
const ROTTING_CORPSE_VEHICLE = 0x40; // Vehicle Corpse

interface ROTTING_CORPSE_DEFINITION {
  ubType: UINT8;
  ubBodyType: UINT8;
  sGridNo: INT16;
  dXPos: FLOAT;
  dYPos: FLOAT;
  sHeightAdjustment: INT16;

  HeadPal: PaletteRepID; // Palette reps
  PantsPal: PaletteRepID;
  VestPal: PaletteRepID;
  SkinPal: PaletteRepID;

  bDirection: INT8;
  uiTimeOfDeath: UINT32;

  usFlags: UINT16;

  bLevel: INT8;

  bVisible: INT8;
  bNumServicingCrows: INT8;
  ubProfile: UINT8;
  fHeadTaken: BOOLEAN;
  ubAIWarningValue: UINT8;

  ubFiller: UINT8[] /* [12] */;
}

interface ROTTING_CORPSE {
  def: ROTTING_CORPSE_DEFINITION;
  fActivated: BOOLEAN;

  pAniTile: Pointer<ANITILE>;

  p8BPPPalette: Pointer<SGPPaletteEntry>;
  p16BPPPalette: Pointer<UINT16>;
  pShades: Pointer<UINT16>[] /* [NUM_CORPSE_SHADES] */;
  sGraphicNum: INT16;
  iCachedTileID: INT32;
  dXPos: FLOAT;
  dYPos: FLOAT;

  fAttractCrowsOnlyWhenOnScreen: BOOLEAN;
  iID: INT32;
}

const MAX_ROTTING_CORPSES = 100;
