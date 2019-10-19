//#define LOS_DEBUG

// fixed-point arithmetic definitions start here

typedef INT32 FIXEDPT;
// rem 1 signed bit at the top
const FIXEDPT_WHOLE_BITS = 11;
const FIXEDPT_FRACTIONAL_BITS = 20;
const FIXEDPT_FRACTIONAL_RESOLUTION = 1048576;

const INT32_TO_FIXEDPT = (n) => ((n) << FIXEDPT_FRACTIONAL_BITS);
const FIXEDPT_TO_INT32 = (n) => ((n) / FIXEDPT_FRACTIONAL_RESOLUTION);

const FIXEDPT_TO_TILE_NUM = (n) => (FIXEDPT_TO_INT32((n)) / CELL_X_SIZE);
const FIXEDPT_TO_LOS_INDEX = (n) => (CONVERT_WITHINTILE_TO_INDEX(FIXEDPT_TO_INT32((n)) % CELL_X_SIZE));

// fixed-point arithmetic definitions end here

const OK_CHANCE_TO_GET_THROUGH = 10;

const enum Enum229 {
  COLLISION_NONE,
  COLLISION_GROUND,
  COLLISION_MERC,
  COLLISION_WINDOW_SOUTHEAST,
  COLLISION_WINDOW_SOUTHWEST,
  COLLISION_WINDOW_NORTHEAST,
  COLLISION_WINDOW_NORTHWEST,
  COLLISION_WINDOW_NORTH,
  COLLISION_WALL_SOUTHEAST,
  COLLISION_WALL_SOUTHWEST,
  COLLISION_WALL_NORTHEAST,
  COLLISION_WALL_NORTHWEST,
  COLLISION_STRUCTURE,
  COLLISION_ROOF,
  COLLISION_INTERIOR_ROOF,
  COLLISION_STRUCTURE_Z,
  COLLISION_WATER,
}

INT32 CheckForCollision(FLOAT dX, FLOAT dY, FLOAT dZ, FLOAT dDeltaX, FLOAT dDeltaY, FLOAT dDeltaZ, INT16 *pusStructureID, FLOAT *pdNormalX, FLOAT *pdNormalY, FLOAT *pdNormalZ);

INT8 ChanceToGetThrough(SOLDIERTYPE *pFirer, FLOAT dEndX, FLOAT dEndY, FLOAT dEndZ);
INT8 FireBulletGivenTarget(SOLDIERTYPE *pFirer, FLOAT dEndX, FLOAT dEndY, FLOAT dEndZ, UINT16 usHandItem, INT16 sHitBy, BOOLEAN fBuckshot, BOOLEAN fFake);

INT32 SoldierToSoldierLineOfSightTest(SOLDIERTYPE *pStartSoldier, SOLDIERTYPE *pEndSoldier, UINT8 ubSightLimit, INT8 bAware);
INT32 SoldierToLocationLineOfSightTest(SOLDIERTYPE *pStartSoldier, INT16 sGridNo, UINT8 ubSightLimit, INT8 bAware);
INT32 SoldierTo3DLocationLineOfSightTest(SOLDIERTYPE *pStartSoldier, INT16 sGridNo, INT8 bLevel, INT8 bCubeLevel, UINT8 ubSightLimit, INT8 bAware);
INT32 SoldierToBodyPartLineOfSightTest(SOLDIERTYPE *pStartSoldier, INT16 sGridNo, INT8 bLevel, UINT8 ubAimLocation, UINT8 ubTileSightLimit, INT8 bAware);
INT32 SoldierToVirtualSoldierLineOfSightTest(SOLDIERTYPE *pStartSoldier, INT16 sGridNo, INT8 bLevel, INT8 bStance, UINT8 ubTileSightLimit, INT8 bAware);
UINT8 SoldierToSoldierChanceToGetThrough(SOLDIERTYPE *pStartSoldier, SOLDIERTYPE *pEndSoldier);
UINT8 SoldierToSoldierBodyPartChanceToGetThrough(SOLDIERTYPE *pStartSoldier, SOLDIERTYPE *pEndSoldier, UINT8 ubAimLocation);
UINT8 AISoldierToSoldierChanceToGetThrough(SOLDIERTYPE *pStartSoldier, SOLDIERTYPE *pEndSoldier);
UINT8 AISoldierToLocationChanceToGetThrough(SOLDIERTYPE *pStartSoldier, INT16 sGridNo, INT8 bLevel, INT8 bCubeLevel);
UINT8 SoldierToLocationChanceToGetThrough(SOLDIERTYPE *pStartSoldier, INT16 sGridNo, INT8 bLevel, INT8 bCubeLevel, UINT8 ubTargetID);
INT32 SoldierToLocationVisibleDistance(SOLDIERTYPE *pStartSoldier, INT16 sGridNo, UINT8 ubTileSightLimit, INT8 bAware);
INT16 SoldierToLocationWindowTest(SOLDIERTYPE *pStartSoldier, INT16 sEndGridNo);
INT32 LocationToLocationLineOfSightTest(INT16 sStartGridNo, INT8 bStartLevel, INT16 sEndGridNo, INT8 bEndLevel, UINT8 ubTileSightLimit, INT8 bAware);

BOOLEAN CalculateSoldierZPos(SOLDIERTYPE *pSoldier, UINT8 ubPosType, FLOAT *pdZPos);

BOOLEAN SoldierToSoldierLineOfSightTimingTest(SOLDIERTYPE *pStartSoldier, SOLDIERTYPE *pEndSoldier, UINT8 ubSightLimit, INT8 bAware);
BOOLEAN TestFireBullet(SOLDIERTYPE *pStartSoldier, SOLDIERTYPE *pEndSoldier);
void DoChrisTest(SOLDIERTYPE *pSoldier);

const HEIGHT_UNITS = 256;
const HEIGHT_UNITS_PER_INDEX = (HEIGHT_UNITS / PROFILE_Z_SIZE);
const MAX_STRUCTURE_HEIGHT = 50;
// 5.12 == HEIGHT_UNITS / MAX_STRUCTURE_HEIGHT
const CONVERT_PIXELS_TO_HEIGHTUNITS = (n) => ((n) * HEIGHT_UNITS / MAX_STRUCTURE_HEIGHT);
const CONVERT_PIXELS_TO_INDEX = (n) => ((n) * HEIGHT_UNITS / MAX_STRUCTURE_HEIGHT / HEIGHT_UNITS_PER_INDEX);
const CONVERT_HEIGHTUNITS_TO_INDEX = (n) => ((n) / HEIGHT_UNITS_PER_INDEX);
const CONVERT_HEIGHTUNITS_TO_DISTANCE = (n) => ((n) / (HEIGHT_UNITS / CELL_X_SIZE));
const CONVERT_HEIGHTUNITS_TO_PIXELS = (n) => ((n) * MAX_STRUCTURE_HEIGHT / HEIGHT_UNITS);
const CONVERT_WITHINTILE_TO_INDEX = (n) => ((n) >> 1);
const CONVERT_INDEX_TO_WITHINTILE = (n) => ((n) << 1);
const CONVERT_INDEX_TO_PIXELS = (n) => ((n) * MAX_STRUCTURE_HEIGHT * HEIGHT_UNITS_PER_INDEX / HEIGHT_UNITS);

const TREE_SIGHT_REDUCTION = 6;
const NORMAL_TREES = 10;

const enum Enum230 {
  LOS_POS,
  FIRING_POS,
  TARGET_POS,
  HEAD_TARGET_POS,
  TORSO_TARGET_POS,
  LEGS_TARGET_POS,
  HEIGHT,
}

// 191 is 6' (structures of height 3)
// 127 is 4' (structures of height 2)
//  63 is 2' (structures of height 1)

const STANDING_HEIGHT = 191.0f;
const STANDING_LOS_POS = 175.0f;
const STANDING_FIRING_POS = 175.0f;
const STANDING_HEAD_TARGET_POS = 175.0f;
const STANDING_HEAD_BOTTOM_POS = 159.0f;
const STANDING_TORSO_TARGET_POS = 127.0f;
const STANDING_TORSO_BOTTOM_POS = 95.0f;
const STANDING_LEGS_TARGET_POS = 47.0f;
const STANDING_TARGET_POS = STANDING_HEAD_TARGET_POS;

const CROUCHED_HEIGHT = 130.0f;
const CROUCHED_LOS_POS = 111.0f;
const CROUCHED_FIRING_POS = 111.0f;

const CROUCHED_HEAD_TARGET_POS = 111.0f;
const CROUCHED_HEAD_BOTTOM_POS = 95.0f;
const CROUCHED_TORSO_TARGET_POS = 71.0f;
const CROUCHED_TORSO_BOTTOM_POS = 47.0f;
const CROUCHED_LEGS_TARGET_POS = 31.0f;
const CROUCHED_TARGET_POS = CROUCHED_HEAD_TARGET_POS;

const PRONE_HEIGHT = 63.0f;
const PRONE_LOS_POS = 31.0f;
const PRONE_FIRING_POS = 31.0f;
const PRONE_TORSO_TARGET_POS = 31.0f;
const PRONE_HEAD_TARGET_POS = 31.0f;
const PRONE_LEGS_TARGET_POS = 31.0f;
const PRONE_TARGET_POS = PRONE_HEAD_TARGET_POS;

const WALL_HEIGHT_UNITS = HEIGHT_UNITS;
const WINDOW_BOTTOM_HEIGHT_UNITS = 87;
const WINDOW_TOP_HEIGHT_UNITS = 220;

const CLOSE_TO_FIRER = 25;
const VERY_CLOSE_TO_FIRER = 21;

void MoveBullet(INT32 iBullet);
// BOOLEAN FireBullet2( SOLDIERTYPE * pFirer, FLOAT dEndX, FLOAT dEndY, FLOAT dEndZ, INT16 sHitBy );
