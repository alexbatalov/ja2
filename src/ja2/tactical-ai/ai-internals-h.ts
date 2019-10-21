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

const enum Enum292 {
  URGENCY_LOW = 0,
  URGENCY_MED,
  URGENCY_HIGH,
  NUM_URGENCY_STATES,
}

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

interface THREATTYPE {
  pOpponent: Pointer<SOLDIERTYPE>;
  sGridNo: INT16;
  iValue: INT32;
  iAPs: INT32;
  iCertainty: INT32;
  iOrigRange: INT32;
}

// define for bAimTime for bursting
const BURSTING = 5;

interface ATTACKTYPE {
  ubPossible: UINT8; // is this attack form possible?  T/F
  ubOpponent: UINT8; // which soldier is the victim?
  ubAimTime: UINT8; // how many extra APs to spend on aiming
  ubChanceToReallyHit: UINT8; // chance to hit * chance to get through cover
  iAttackValue: INT32; // relative worthiness of this type of attack
  sTarget: INT16; // target gridno of this attack
  bTargetLevel: INT8; // target level of this attack
  ubAPCost: UINT8; // how many APs the attack will use up
  bWeaponIn: INT8; // the inv slot of the weapon in question
}

extern THREATTYPE Threat[MAXMERCS];
extern int ThreatPercent[10];
extern UINT8 SkipCoverCheck;
extern INT8 GameOption[MAXGAMEOPTIONS];

const enum Enum293 {
  SEARCH_GENERAL_ITEMS,
  SEARCH_AMMO,
  SEARCH_WEAPONS,
}

// go as far as possible flags
const FLAG_CAUTIOUS = 0x01;
const FLAG_STOPSHORT = 0x02;

const STOPSHORTDIST = 5;
