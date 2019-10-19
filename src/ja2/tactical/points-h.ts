const AP_MINIMUM = 10; // no merc can have less for his turn
const AP_MAXIMUM = 25; // no merc can have more for his turn
const AP_MONSTER_MAXIMUM = 40; // no monster can have more for his turn
const AP_VEHICLE_MAXIMUM = 50; // no merc can have more for his turn
const AP_INCREASE = 10; // optional across-the-board AP boost
const MAX_AP_CARRIED = 5; // APs carried from turn-to-turn

// monster AP bonuses, expressed in 10ths (12 = 120% normal)
const AP_YOUNG_MONST_FACTOR = 15;
const AP_ADULT_MONST_FACTOR = 12;
const AP_MONST_FRENZY_FACTOR = 13;

// AP penalty for a phobia situation (again, in 10ths)
const AP_CLAUSTROPHOBE = 9;
const AP_AFRAID_OF_INSECTS = 8;

const AP_EXCHANGE_PLACES = 5;

// Action Point values
const AP_REVERSE_MODIFIER = 1;
const AP_STEALTH_MODIFIER = 2;

const AP_STEAL_ITEM = 10; // APs to steal item....

const AP_TAKE_BLOOD = 10;

const AP_TALK = 6;

const AP_MOVEMENT_FLAT = 3; // div by 2 for run, +2, for crawl, -1 for swat
const AP_MOVEMENT_GRASS = 4;
const AP_MOVEMENT_BUSH = 5;
const AP_MOVEMENT_RUBBLE = 6;
const AP_MOVEMENT_SHORE = 7; // shallow wade

const AP_MOVEMENT_LAKE = 9; // deep wade -> slowest
const AP_MOVEMENT_OCEAN = 8; // swimming is faster than deep wade

const AP_CHANGE_FACING = 1; // turning to face any other direction
const AP_CHANGE_TARGET = 1; // aiming at a new target

const AP_CATCH_ITEM = 5; // turn to catch item
const AP_TOSS_ITEM = 8; // toss item from inv

const AP_REFUEL_VEHICLE = 10;
/*
#define AP_MOVE_ITEM_FREE       0       // same place, pocket->pocket
#define AP_MOVE_ITEM_FAST       2       // hand, holster, ground only
#define AP_MOVE_ITEM_AVG        4       // everything else!
#define AP_MOVE_ITEM_SLOW       6       // vests, protective gear
*/
const AP_MOVE_ITEM_FAST = 4; // hand, holster, ground only
const AP_MOVE_ITEM_SLOW = 6; // vests, protective gear

const AP_RADIO = 5;
const AP_CROUCH = 2;
const AP_PRONE = 2;

const AP_LOOK_STANDING = 1;
const AP_LOOK_CROUCHED = 2;
const AP_LOOK_PRONE = 2;

const AP_READY_KNIFE = 0;
const AP_READY_PISTOL = 1;
const AP_READY_RIFLE = 2;
const AP_READY_SAW = 0;
// JA2Gold: reduced dual AP cost from 3 to 1
//#define AP_READY_DUAL           3
const AP_READY_DUAL = 1;

const AP_MIN_AIM_ATTACK = 0; // minimum permitted extra aiming
const AP_MAX_AIM_ATTACK = 4; // maximum permitted extra aiming

const AP_BURST = 5;

const AP_DROP_BOMB = 3;

const AP_RELOAD_GUN = 5; // loading new clip/magazine

const AP_START_FIRST_AID = 5; // get the stuff out of medic kit
const AP_PER_HP_FIRST_AID = 1; // for each point healed
const AP_STOP_FIRST_AID = 3; // put everything away again

const AP_START_REPAIR = 5; // get the stuff out of repair kit

const AP_GET_HIT = 2; // struck by bullet, knife, explosion
const AP_GET_WOUNDED_DIVISOR = 4; // 1 AP lost for every 'divisor' dmg
const AP_FALL_DOWN = 4; // falling down (explosion, exhaustion)
const AP_GET_THROWN = 2; // get thrown back (by explosion)

const AP_GET_UP = 5; // getting up again
const AP_ROLL_OVER = 2; // flipping from back to stomach

const AP_OPEN_DOOR = 3; // whether successful, or not (locked)
const AP_PICKLOCK = 10; // should really be several turns
const AP_EXAMINE_DOOR = 5; // time to examine door
const AP_BOOT_DOOR = 8; // time to boot door
const AP_USE_CROWBAR = 10; // time to crowbar door
const AP_UNLOCK_DOOR = 6; // time to unlock door
const AP_LOCK_DOOR = 6; // time to lock door
const AP_EXPLODE_DOOR = 10; // time to set explode charge on door
const AP_UNTRAP_DOOR = 10; // time to untrap door

const AP_USEWIRECUTTERS = 10; // Time to use wirecutters

const AP_CLIMBROOF = 10; // APs to climb roof
const AP_CLIMBOFFROOF = 6; // APs to climb off roof
const AP_JUMPFENCE = 6; // time to jump over a fence

const AP_OPEN_SAFE = 8; // time to use combination

const AP_USE_REMOTE = 2;
const AP_PULL_TRIGGER = 2; // operate nearby panic trigger

const AP_FORCE_LID_OPEN = 10;
const AP_SEARCH_CONTAINER = 5; // boxes, crates, safe, etc.

const AP_READ_NOTE = 10; // reading a note's contents in inv.

const AP_SNAKE_BATTLE = 10; // when first attacked
const AP_KILL_SNAKE = 7; // when snake battle's been won

const AP_USE_SURV_CAM = 5;

const AP_PICKUP_ITEM = 3;
const AP_GIVE_ITEM = 1;

const AP_BURY_MINE = 10;
const AP_DISARM_MINE = 10;

const AP_DRINK = 5;
const AP_CAMOFLAGE = 10;

const AP_TAKE_PHOTOGRAPH = 5;
const AP_MERGE = 8;

const AP_OTHER_COST = 99;

const AP_START_RUN_COST = 1;

const AP_ATTACH_CAN = 5;

const AP_JUMP_OVER = 6;

// special Breath Point related constants

const BP_RATIO_RED_PTS_TO_NORMAL = 100;

const BP_RUN_ENERGYCOSTFACTOR = 3; // Richard thinks running is 3rd most strenous over time... tough, Mark didn't.  CJC increased it again
const BP_WALK_ENERGYCOSTFACTOR = 1; // walking subtracts flat terrain breath value
const BP_SWAT_ENERGYCOSTFACTOR = 2; // Richard thinks swatmove is 2nd most strenous over time... tough, Mark didn't
const BP_CRAWL_ENERGYCOSTFACTOR = 4; // Richard thinks crawling is the MOST strenuous over time

const BP_RADIO = 0; // no breath cost
const BP_USE_DETONATOR = 0; // no breath cost

const BP_REVERSE_MODIFIER = 0; // no change, a bit more challenging
const BP_STEALTH_MODIFIER = -20; // slow & cautious, not too strenuous
const BP_MINING_MODIFIER = -30; // pretty relaxing, overall

// end-of-turn Breath Point gain/usage rates
const BP_PER_AP_NO_EFFORT = -200; // gain breath!
const BP_PER_AP_MIN_EFFORT = -100; // gain breath!
const BP_PER_AP_LT_EFFORT = -50; // gain breath!
const BP_PER_AP_MOD_EFFORT = 25;
const BP_PER_AP_HVY_EFFORT = 50;
const BP_PER_AP_MAX_EFFORT = 100;

// Breath Point values
const BP_MOVEMENT_FLAT = 5;
const BP_MOVEMENT_GRASS = 10;
const BP_MOVEMENT_BUSH = 20;
const BP_MOVEMENT_RUBBLE = 35;
const BP_MOVEMENT_SHORE = 50; // shallow wade
const BP_MOVEMENT_LAKE = 75; // deep wade
const BP_MOVEMENT_OCEAN = 100; // swimming

const BP_CHANGE_FACING = 10; // turning to face another direction

const BP_CROUCH = 10;
const BP_PRONE = 10;

const BP_CLIMBROOF = 500; // BPs to climb roof
const BP_CLIMBOFFROOF = 250; // BPs to climb off roof
const BP_JUMPFENCE = 200; // BPs to jump fence

/*
#define BP_MOVE_ITEM_FREE       0       // same place, pocket->pocket
#define BP_MOVE_ITEM_FAST       0       // hand, holster, ground only
#define BP_MOVE_ITEM_AVG        0       // everything else!
#define BP_MOVE_ITEM_SLOW       20      // vests, protective gear
*/
const BP_MOVE_ITEM_FAST = 0; // hand, holster, ground only
const BP_MOVE_ITEM_SLOW = 20; // vests, protective gear

const BP_READY_KNIFE = 0; // raise/lower knife
const BP_READY_PISTOL = 10; // raise/lower pistol
const BP_READY_RIFLE = 20; // raise/lower rifle
const BP_READY_SAW = 0; // raise/lower saw

const BP_STEAL_ITEM = 50; // BPs steal item

const BP_PER_AP_AIMING = 5; // breath cost while aiming
const BP_RELOAD_GUN = 20; // loading new clip/magazine

const BP_THROW_ITEM = 50; // throw grenades, fire-bombs, etc.

const BP_START_FIRST_AID = 0; // get the stuff out of medic kit
const BP_PER_HP_FIRST_AID = -25; // gain breath for each point healed
const BP_STOP_FIRST_AID = 0; // put everything away again

const BP_GET_HIT = 200; // struck by bullet, knife, explosion
const BP_GET_WOUNDED = 50; // per pt of GUNFIRE/EXPLOSION impact
const BP_FALL_DOWN = 250; // falling down (explosion, exhaustion)
const BP_GET_UP = 50; // getting up again
const BP_ROLL_OVER = 20; // flipping from back to stomach

const BP_OPEN_DOOR = 30; // whether successful, or not (locked)
const BP_PICKLOCK = -250; // gain breath, not very tiring...
const BP_EXAMINE_DOOR = -250; // gain breath, not very tiring...
const BP_BOOT_DOOR = 200; // BP to boot door
const BP_USE_CROWBAR = 350; // BP to crowbar door
const BP_UNLOCK_DOOR = 50; // BP to unlock door
const BP_EXPLODE_DOOR = -250; // BP to set explode charge on door
const BP_UNTRAP_DOOR = 150; // BP to untrap
const BP_LOCK_DOOR = 50; // BP to untrap

const BP_USEWIRECUTTERS = 200; // BP to use wirecutters

const BP_PULL_TRIGGER = 0; // for operating panic triggers

const BP_FORCE_LID_OPEN = 50; // per point of strength required
const BP_SEARCH_CONTAINER = 0; // get some breath back (was -50)

const BP_OPEN_SAFE = -50;
const BP_READ_NOTE = -250; // reading a note's contents in inv.

const BP_SNAKE_BATTLE = 500; // when first attacked
const BP_KILL_SNAKE = 350; // when snake battle's been won

const BP_USE_SURV_CAM = -100;

const BP_BURY_MINE = 250; // involves digging & filling again
const BP_DISARM_MINE = 0; // 1/2 digging, 1/2 light effort

const BP_FIRE_HANDGUN = 25; // preatty easy, little recoil
const BP_FIRE_RIFLE = 50; // heavier, nasty recoil
const BP_FIRE_SHOTGUN = 100; // quite tiring, must be pumped up

const BP_STAB_KNIFE = 200;

const BP_TAKE_PHOTOGRAPH = 0;
const BP_MERGE = 50;

const BP_FALLFROMROOF = 1000;

const BP_JUMP_OVER = 250;

const DEFAULT_APS = 20;
const DEFAULT_AIMSKILL = 80;

UINT8 BaseAPsToShootOrStab(INT8 bAPs, INT8 bAimSkill, OBJECTTYPE *pObj);

INT16 TerrainActionPoints(SOLDIERTYPE *pSoldier, INT16 sGridno, INT8 bDir, INT8 bLevel);
INT16 ActionPointCost(SOLDIERTYPE *pSoldier, INT16 sGridNo, INT8 bDir, UINT16 usMovementMode);
INT16 EstimateActionPointCost(SOLDIERTYPE *pSoldier, INT16 sGridNo, INT8 bDir, UINT16 usMovementMode, INT8 bPathIndex, INT8 bPathLength);
BOOLEAN SelectedMercCanAffordMove();

BOOLEAN EnoughPoints(SOLDIERTYPE *pSoldier, INT16 sAPCost, INT16 sBPCost, BOOLEAN fDisplayMsg);
void DeductPoints(SOLDIERTYPE *pSoldier, INT16 sAPCost, INT16 sBPCost);
INT16 AdjustBreathPts(SOLDIERTYPE *pSold, INT16 sBPCost);
void UnusedAPsToBreath(SOLDIERTYPE *pSold);
INT16 TerrainBreathPoints(SOLDIERTYPE *pSoldier, INT16 sGridno, INT8 bDir, UINT16 usMovementMode);
UINT8 MinAPsToAttack(SOLDIERTYPE *pSoldier, INT16 sGridno, UINT8 ubAddTurningCost);
INT8 MinPtsToMove(SOLDIERTYPE *pSoldier);
INT8 MinAPsToStartMovement(SOLDIERTYPE *pSoldier, UINT16 usMovementMode);
INT8 PtsToMoveDirection(SOLDIERTYPE *pSoldier, INT8 bDirection);
UINT8 MinAPsToShootOrStab(SOLDIERTYPE *pSoldier, INT16 sGridno, UINT8 ubAddTurningCost);
BOOLEAN EnoughAmmo(SOLDIERTYPE *pSoldier, BOOLEAN fDisplay, INT8 bInvPos);
void DeductAmmo(SOLDIERTYPE *pSoldier, INT8 bInvPos);

UINT16 GetAPsToPickupItem(SOLDIERTYPE *pSoldier, UINT16 usMapPos);
UINT8 MinAPsToPunch(SOLDIERTYPE *pSoldier, INT16 sGridno, UINT8 ubAddTurningCost);
UINT8 CalcTotalAPsToAttack(SOLDIERTYPE *pSoldier, INT16 sGridno, UINT8 ubAddTurningCost, INT8 bAimTime);
UINT8 CalcAPsToBurst(INT8 bBaseActionPoints, OBJECTTYPE *pObj);
UINT16 GetAPsToChangeStance(SOLDIERTYPE *pSoldier, INT8 bDesiredHeight);
UINT16 GetBPsToChangeStance(SOLDIERTYPE *pSoldier, INT8 bDesiredHeight);

UINT16 GetAPsToLook(SOLDIERTYPE *pSoldier);
UINT16 GetAPsToGiveItem(SOLDIERTYPE *pSoldier, UINT16 usMapPos);

BOOLEAN CheckForMercContMove(SOLDIERTYPE *pSoldier);

INT16 GetAPsToReadyWeapon(SOLDIERTYPE *pSoldier, UINT16 usAnimState);

INT8 GetAPsToClimbRoof(SOLDIERTYPE *pSoldier, BOOLEAN fClimbDown);
INT16 GetBPsToClimbRoof(SOLDIERTYPE *pSoldier, BOOLEAN fClimbDown);

INT8 GetAPsToJumpFence(SOLDIERTYPE *pSoldier);
INT8 GetBPsToJumpFence(SOLDIERTYPE *pSoldier);

INT8 GetAPsToCutFence(SOLDIERTYPE *pSoldier);
INT8 GetAPsToBeginFirstAid(SOLDIERTYPE *pSoldier);
INT8 GetAPsToBeginRepair(SOLDIERTYPE *pSoldier);
INT8 GetAPsToRefuelVehicle(SOLDIERTYPE *pSoldier);

INT16 MinAPsToThrow(SOLDIERTYPE *pSoldier, INT16 sGridNo, UINT8 ubAddTurningCost);

UINT16 GetAPsToDropBomb(SOLDIERTYPE *pSoldier);
UINT16 GetTotalAPsToDropBomb(SOLDIERTYPE *pSoldier, INT16 sGridNo);
UINT16 GetAPsToUseRemote(SOLDIERTYPE *pSoldier);

INT8 GetAPsToStealItem(SOLDIERTYPE *pSoldier, INT16 usMapPos);
INT8 GetBPsToStealItem(SOLDIERTYPE *pSoldier);

INT8 GetAPsToUseJar(SOLDIERTYPE *pSoldier, INT16 usMapPos);
INT8 GetAPsToUseCan(SOLDIERTYPE *pSoldier, INT16 usMapPos);
INT8 GetBPsTouseJar(SOLDIERTYPE *pSoldier);

INT8 GetAPsToJumpOver(SOLDIERTYPE *pSoldier);

void GetAPChargeForShootOrStabWRTGunRaises(SOLDIERTYPE *pSoldier, INT16 sGridNo, UINT8 ubAddTurningCost, BOOLEAN *pfChargeTurning, BOOLEAN *pfChargeRaise);

UINT16 GetAPsToReloadRobot(SOLDIERTYPE *pSoldier, SOLDIERTYPE *pRobot);
INT8 GetAPsToReloadGunWithAmmo(OBJECTTYPE *pGun, OBJECTTYPE *pAmmo);
INT8 GetAPsToAutoReload(SOLDIERTYPE *pSoldier);
