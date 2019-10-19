extern BOOLEAN gfTurnBasedAI;

// THIS IS AN ITEM #  - AND FOR NOW JUST COMPLETELY FAKE...

const MAX_TOSS_SEARCH_DIST = 1; // must throw within this of opponent
const NPC_TOSS_SAFETY_MARGIN = 4; // all friends must be this far away

const ACTING_ON_SCHEDULE = (p) => ((p)->fAIFlags & AI_CHECK_SCHEDULE);

// the AI should try to have this many APs before climbing a roof, if possible
const AI_AP_CLIMBROOF = 15;

const TEMPORARILY = 0;
const FOREVER = 1;

const IGNORE_PATH = 0;
const ENSURE_PATH = 1;
const ENSURE_PATH_COST = 2;

// Kris:  November 10, 1997
// Please don't change this value from 10.  It will invalidate all of the maps and soldiers.
const MAXPATROLGRIDS = 10;

const NOWATER = 0;
const WATEROK = 1;

const DONTADDTURNCOST = 0;
const ADDTURNCOST = 1;

enum {
  URGENCY_LOW = 0,
  URGENCY_MED,
  URGENCY_HIGH,
  NUM_URGENCY_STATES,
};

const NOWATER = 0;
const WATEROK = 1;

const IGNORE_PATH = 0;
const ENSURE_PATH = 1;
const ENSURE_PATH_COST = 2;

const DONTFORCE = 0;
const FORCE = 1;

const MAX_ROAMING_RANGE = WORLD_COLS;

const PTR_CIV_OR_MILITIA = () => (PTR_CIVILIAN() || (pSoldier->bTeam == MILITIA_TEAM));

const REALTIME_AI_DELAY = () => (10000 + Random(1000));
const REALTIME_CIV_AI_DELAY = () => (1000 * (gTacticalStatus.Team[MILITIA_TEAM].bMenInSector + gTacticalStatus.Team[CIV_TEAM].bMenInSector) + 5000 + 2000 * Random(3));
const REALTIME_CREATURE_AI_DELAY = () => (10000 + 1000 * Random(3));

//#define PLAYINGMODE             0
//#define CAMPAIGNLENGTH          1
//#define LASTUSABLESLOT          2
//#define RANDOMMERCS             3
//#define AVAILABLEMERCS          4
//#define HIRINGKNOWLEDGE         5
//#define EQUIPMENTLEVEL          6
//#define ENEMYTEAMSIZE           7
const ENEMYDIFFICULTY = 8; // this is being used in this module
//#define FOG_OF_WAR              9
//#define TURNLENGTH              10
//#define INCREASEDAP             11
//#define BLOODSTAINS             12
//#define STARTINGBALANCE         13
const MAXGAMEOPTIONS = 14;

const NOSHOOT_WAITABIT = -1;
const NOSHOOT_WATER = -2;
const NOSHOOT_MYSELF = -3;
const NOSHOOT_HURT = -4;
const NOSHOOT_NOAMMO = -5;
const NOSHOOT_NOLOAD = -6;
const NOSHOOT_NOWEAPON = -7;

const PERCENT_TO_IGNORE_THREAT = 50; // any less, use threat value
const ACTION_TIMEOUT_CYCLES = 50; // # failed cycles through AI
const MAX_THREAT_RANGE = 400; // 30 tiles worth
const MIN_PERCENT_BETTER = 5; // 5% improvement in cover is good

const TOSSES_PER_10TURNS = 18; // max # of grenades tossable in 10 turns
const SHELLS_PER_10TURNS = 13; // max # of shells   firable  in 10 turns

const SEE_THRU_COVER_THRESHOLD = 5; // min chance to get through

const min = (a, b) => ((a) < (b) ? (a) : (b));

const max = (a, b) => ((a) > (b) ? (a) : (b));

typedef struct {
  SOLDIERTYPE *pOpponent;
  INT16 sGridNo;
  INT32 iValue;
  INT32 iAPs;
  INT32 iCertainty;
  INT32 iOrigRange;
} THREATTYPE;

// define for bAimTime for bursting
const BURSTING = 5;

typedef struct {
  UINT8 ubPossible; // is this attack form possible?  T/F
  UINT8 ubOpponent; // which soldier is the victim?
  UINT8 ubAimTime; // how many extra APs to spend on aiming
  UINT8 ubChanceToReallyHit; // chance to hit * chance to get through cover
  INT32 iAttackValue; // relative worthiness of this type of attack
  INT16 sTarget; // target gridno of this attack
  INT8 bTargetLevel; // target level of this attack
  UINT8 ubAPCost; // how many APs the attack will use up
  INT8 bWeaponIn; // the inv slot of the weapon in question
} ATTACKTYPE;

extern THREATTYPE Threat[MAXMERCS];
extern int ThreatPercent[10];
extern UINT8 SkipCoverCheck;
extern INT8 GameOption[MAXGAMEOPTIONS];

typedef enum {
  SEARCH_GENERAL_ITEMS,
  SEARCH_AMMO,
  SEARCH_WEAPONS,
} ItemSearchReasons;

// go as far as possible flags
const FLAG_CAUTIOUS = 0x01;
const FLAG_STOPSHORT = 0x02;

const STOPSHORTDIST = 5;

INT16 AdvanceToFiringRange(SOLDIERTYPE *pSoldier, INT16 sClosestOpponent);

BOOLEAN AimingGun(SOLDIERTYPE *pSoldier);
void CalcBestShot(SOLDIERTYPE *pSoldier, ATTACKTYPE *pBestShot);
void CalcBestStab(SOLDIERTYPE *pSoldier, ATTACKTYPE *pBestStab, BOOLEAN fBladeAttack);
void CalcBestThrow(SOLDIERTYPE *pSoldier, ATTACKTYPE *pBestThrow);
void CalcTentacleAttack(SOLDIERTYPE *pSoldier, ATTACKTYPE *pBestStab);

INT16 CalcSpreadBurst(SOLDIERTYPE *pSoldier, INT16 sFirstTarget, INT8 bTargetLevel);
INT32 CalcManThreatValue(SOLDIERTYPE *pSoldier, INT16 sMyGrid, UINT8 ubReduceForCover, SOLDIERTYPE *pMe);
INT8 CanNPCAttack(SOLDIERTYPE *pSoldier);
void CheckIfTossPossible(SOLDIERTYPE *pSoldier, ATTACKTYPE *pBestThrow);
BOOLEAN ClimbingNecessary(SOLDIERTYPE *pSoldier, INT16 sDestGridNo, INT8 bDestLevel);
INT8 ClosestPanicTrigger(SOLDIERTYPE *pSoldier);
INT16 ClosestReachableDisturbance(SOLDIERTYPE *pSoldier, UINT8 ubUnconsciousOK, BOOLEAN *pfChangeLevel);
INT16 ClosestReachableFriendInTrouble(SOLDIERTYPE *pSoldier, BOOLEAN *pfClimbingNecessary);
INT16 ClosestSeenOpponent(SOLDIERTYPE *pSoldier, INT16 *psGridNo, INT8 *pbLevel);
void CreatureCall(SOLDIERTYPE *pCaller);
INT8 CreatureDecideAction(SOLDIERTYPE *pCreature);
void CreatureDecideAlertStatus(SOLDIERTYPE *pCreature);
INT8 CrowDecideAction(SOLDIERTYPE *pSoldier);
void DecideAlertStatus(SOLDIERTYPE *pSoldier);
INT8 DecideAutoBandage(SOLDIERTYPE *pSoldier);
UINT16 DetermineMovementMode(SOLDIERTYPE *pSoldier, INT8 bAction);

INT32 EstimateShotDamage(SOLDIERTYPE *pSoldier, SOLDIERTYPE *pOpponent, UINT8 ubChanceToHit);
INT32 EstimateStabDamage(SOLDIERTYPE *pSoldier, SOLDIERTYPE *pOpponent, UINT8 ubChanceToHit, BOOLEAN fBladeAttack);
INT32 EstimateThrowDamage(SOLDIERTYPE *pSoldier, UINT8 ubItemPos, SOLDIERTYPE *pOpponent, INT16 sGridno);
INT16 EstimatePathCostToLocation(SOLDIERTYPE *pSoldier, INT16 sDestGridNo, INT8 bDestLevel, BOOLEAN fAddCostAfterClimbingUp, BOOLEAN *pfClimbingNecessary, INT16 *psClimbGridNo);

BOOLEAN FindBetterSpotForItem(SOLDIERTYPE *pSoldier, INT8 bSlot);
INT16 FindClosestClimbPointAvailableToAI(SOLDIERTYPE *pSoldier, INT16 sStartGridNo, INT16 sDesiredGridNo, BOOLEAN fClimbUp);
INT16 FindRouteBackOntoMap(SOLDIERTYPE *pSoldier, INT16 sDestGridNo);
INT16 FindClosestBoxingRingSpot(SOLDIERTYPE *pSoldier, BOOLEAN fInRing);
INT16 GetInterveningClimbingLocation(SOLDIERTYPE *pSoldier, INT16 sDestGridNo, INT8 bDestLevel, BOOLEAN *pfClimbingNecessary);
UINT8 GetTraversalQuoteActionID(INT8 bDirection);
INT16 GoAsFarAsPossibleTowards(SOLDIERTYPE *pSoldier, INT16 sDesGrid, INT8 bAction);

INT8 HeadForTheStairCase(SOLDIERTYPE *pSoldier);

BOOLEAN InGas(SOLDIERTYPE *pSoldier, INT16 sGridNo);
BOOLEAN InGasOrSmoke(SOLDIERTYPE *pSoldier, INT16 sGridNo);
BOOLEAN InWaterGasOrSmoke(SOLDIERTYPE *pSoldier, INT16 sGridNo);

void InitAttackType(ATTACKTYPE *pAttack);

INT16 InternalGoAsFarAsPossibleTowards(SOLDIERTYPE *pSoldier, INT16 sDesGrid, INT8 bReserveAPs, INT8 bAction, INT8 fFlags);

int LegalNPCDestination(SOLDIERTYPE *pSoldier, INT16 sGridno, UINT8 ubPathMode, UINT8 ubWaterOK, UINT8 fFlags);
void LoadWeaponIfNeeded(SOLDIERTYPE *pSoldier);
INT16 MostImportantNoiseHeard(SOLDIERTYPE *pSoldier, INT32 *piRetValue, BOOLEAN *pfClimbingNecessary, BOOLEAN *pfReachable);
INT16 NPCConsiderInitiatingConv(SOLDIERTYPE *pNPC, UINT8 *pubDesiredMerc);
void NPCDoesAct(SOLDIERTYPE *pSoldier);
void NPCDoesNothing(SOLDIERTYPE *pSoldier);
INT8 OKToAttack(SOLDIERTYPE *ptr, int target);
BOOLEAN NeedToRadioAboutPanicTrigger(void);
INT8 PointPatrolAI(SOLDIERTYPE *pSoldier);
void PossiblyMakeThisEnemyChosenOne(SOLDIERTYPE *pSoldier);
INT8 RandomPointPatrolAI(SOLDIERTYPE *pSoldier);
INT32 RangeChangeDesire(SOLDIERTYPE *pSoldier);
UINT16 RealtimeDelay(SOLDIERTYPE *pSoldier);
void RearrangePocket(SOLDIERTYPE *pSoldier, INT8 bPocket1, INT8 bPocket2, UINT8 bPermanent);
void RTHandleAI(SOLDIERTYPE *pSoldier);
UINT16 RunAway(SOLDIERTYPE *pSoldier);
INT8 SearchForItems(SOLDIERTYPE *pSoldier, INT8 bReason, UINT16 usItem);
UINT8 ShootingStanceChange(SOLDIERTYPE *pSoldier, ATTACKTYPE *pAttack, INT8 bDesiredDirection);
UINT8 StanceChange(SOLDIERTYPE *pSoldier, UINT8 ubAttackAPCost);
INT16 TrackScent(SOLDIERTYPE *pSoldier);
void RefreshAI(SOLDIERTYPE *pSoldier);
BOOLEAN InLightAtNight(INT16 sGridNo, INT8 bLevel);
INT16 FindNearbyDarkerSpot(SOLDIERTYPE *pSoldier);

BOOLEAN ArmySeesOpponents(void);
