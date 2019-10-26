namespace ja2 {

// GLOBAL HEADER FOR DATA, TYPES FOR TACTICAL ENGINE

export const REFINE_AIM_1 = 0;
export const REFINE_AIM_MID1 = 1;
export const REFINE_AIM_2 = 2;
export const REFINE_AIM_MID2 = 3;
export const REFINE_AIM_3 = 4;
export const REFINE_AIM_MID3 = 5;
export const REFINE_AIM_4 = 6;
export const REFINE_AIM_MID4 = 7;
export const REFINE_AIM_5 = 8;
export const REFINE_AIM_BURST = 10;

export const AIM_SHOT_RANDOM = 0;
export const AIM_SHOT_HEAD = 1;
export const AIM_SHOT_TORSO = 2;
export const AIM_SHOT_LEGS = 3;
export const AIM_SHOT_GLAND = 4;

export const MIN_AMB_LEVEL_FOR_MERC_LIGHTS = 9;

export const MAXTEAMS = 6;
export const MAXMERCS = MAX_NUM_SOLDIERS;

// TACTICAL OVERHEAD STUFF
export const NO_SOLDIER = TOTAL_SOLDIERS; // SAME AS NOBODY
export const NOBODY = NO_SOLDIER;

// TACTICAL ENGINE STATUS FLAGS
export const REALTIME = 0x000000002;
export const TURNBASED = 0x000000004;
export const IN_ENDGAME_SEQUENCE = 0x000000008;
export const SHOW_ALL_ITEMS = 0x000000010;
export const SHOW_AP_LEFT = 0x000000020;
export const SHOW_ALL_MERCS = 0x000000040;
export const TRANSLUCENCY_TYPE = 0x000000080;
export const GODMODE = 0x000000100;
export const DEMOMODE = 0x000000200;
export const PLAYER_TEAM_DEAD = 0x000000400;
export const NPC_TEAM_DEAD = 0x000000800;
export const DISALLOW_SIGHT = 0x000001000;
export const CHECK_SIGHT_AT_END_OF_ATTACK = 0x000002000;
export const IN_CREATURE_LAIR = 0x000004000;
const HIDE_TREES = 0x000008000;
export const NOHIDE_REDUNDENCY = 0x000010000;
export const DEBUGCLIFFS = 0x000020000;
export const INCOMBAT = 0x000040000;
export const ACTIVE = 0x000100000;
export const SHOW_Z_BUFFER = 0x000200000;
export const SLOW_ANIMATION = 0x000400000;
export const ENGAGED_IN_CONV = 0x000800000;
export const LOADING_SAVED_GAME = 0x001000000;
export const OUR_MERCS_AUTO_MOVE = 0x002000000;
export const SHOW_ALL_ROOFS = 0x004000000;
const NEWLY_ENTERED_SECTOR = 0x008000000;
export const RED_ITEM_GLOW_ON = 0x010000000;
export const IGNORE_ENGAGED_IN_CONV_UI_UNLOCK = 0x020000000;
export const IGNORE_ALL_OBSTACLES = 0x040000000;
export const IN_DEIDRANNA_ENDGAME = 0x080000000;
const DONE_DEIDRANNA_ENDGAME = 0x100000000;

export const OKBREATH = 10;
export const OKLIFE = 15;
export const CONSCIOUSNESS = 10;

// VIEWRANGE DEFINES
export const NORMAL_VIEW_RANGE = 13;
const MIN_RANGE_FOR_BLOWNAWAY = 40;

// MODIFIERS FOR AP COST FOR MOVEMENT
export const RUNDIVISOR = 1.8;
export const WALKCOST = -1;
export const SWATCOST = 0;
export const CRAWLCOST = 1;

// defines
// ######################################################
export const MAX_PATH_LIST_SIZE = 30;
export const NUM_SOLDIER_SHADES = 48;
export const NUM_SOLDIER_EFFECTSHADES = 2;

// TIMER DELAYS
export const DAMAGE_DISPLAY_DELAY = 250;
const FADE_DELAY = 150;
export const FLASH_SELECTOR_DELAY = 4000;
const BLINK_SELECTOR_DELAY = 250;

export const PTR_OURTEAM = () => (pSoldier.value.bTeam == gbPlayerNum);

const DONTLOOK = 0;
export const LOOK = 1;

export const NOLOCATE = 0;
const LOCATE = 1;

export const DONTSETLOCATOR = 0;
export const SETLOCATOR = 1;
export const SETANDREMOVEPREVIOUSLOCATOR = 2;
export const SETLOCATORFAST = 3;

const NOCENTERING = 0;

const NOUPDATE = 0;
const UPDATE = 1;

// ORDERS
export const enum Enum241 {
  STATIONARY = 0, // moves max 1 sq., no matter what's going on
  ONGUARD, // moves max 2 sqs. until alerted by something
  CLOSEPATROL, // patrols within 5 spaces until alerted
  FARPATROL, // patrols within 15 spaces
  POINTPATROL, // patrols using patrolGrids
  ONCALL, // helps buddies anywhere within the sector
  SEEKENEMY, // not tied down to any one particular spot
  RNDPTPATROL, // patrols randomly using patrolGrids
  MAXORDERS,
}

// ATTITUDES
export const enum Enum242 {
  DEFENSIVE = 0,
  BRAVESOLO,
  BRAVEAID,
  CUNNINGSOLO,
  CUNNINGAID,
  AGGRESSIVE,
  MAXATTITUDES,
  ATTACKSLAYONLY, // special hyperaggressive vs Slay only value for Carmen the bounty hunter
}

// alert status types
export const enum Enum243 {
  STATUS_GREEN = 0, // everything's OK, no suspicion
  STATUS_YELLOW, // he or his friend heard something
  STATUS_RED, // has definite evidence of opponent
  STATUS_BLACK, // currently sees an active opponent
  NUM_STATUS_STATES,
}

export const enum Enum244 {
  MORALE_HOPELESS = 0,
  MORALE_WORRIED,
  MORALE_NORMAL,
  MORALE_CONFIDENT,
  MORALE_FEARLESS,
  NUM_MORALE_STATES,
}

// DEFINES FOR WEAPON HIT EVENT SPECIAL PARAM
export const FIRE_WEAPON_NO_SPECIAL = 0;
export const FIRE_WEAPON_BURST_SPECIAL = 1;
export const FIRE_WEAPON_HEAD_EXPLODE_SPECIAL = 2;
export const FIRE_WEAPON_CHEST_EXPLODE_SPECIAL = 3;
export const FIRE_WEAPON_LEG_FALLDOWN_SPECIAL = 4;
const FIRE_WEAPON_HIT_BY_KNIFE_SPECIAL = 5;
export const FIRE_WEAPON_SLEEP_DART_SPECIAL = 6;
export const FIRE_WEAPON_BLINDED_BY_SPIT_SPECIAL = 7;
export const FIRE_WEAPON_TOSSED_OBJECT_SPECIAL = 8;

export const NO_INTERRUPTS = 0;
const ALLOW_INTERRUPTS = 1;

export const SIGHT_LOOK = 0x1;
//#define SIGHT_SEND      0x2   // no longer needed using LOCAL OPPLISTs
export const SIGHT_RADIO = 0x4;
export const SIGHT_INTERRUPT = 0x8;
const SIGHT_ALL = 0xF;

// CHANGE THIS VALUE TO AFFECT TOTAL SIGHT RANGE
export const STRAIGHT_RANGE = 13;

// CHANGE THESE VALUES TO ADJUST VARIOUS FOV ANGLES
const STRAIGHT_RATIO = 1;
const ANGLE_RATIO = 0.857;
const SIDE_RATIO = 0.571;
// CJC: Changed SBEHIND_RATIO (side-behind ratio) to be 0 to make stealth attacks easier
// Changed on September 21, 1998
//#define SBEHIND_RATIO		0.142
const SBEHIND_RATIO = 0;
const BEHIND_RATIO = 0;

// looking distance defines
export const BEHIND = (BEHIND_RATIO * STRAIGHT_RANGE);
export const SBEHIND = (SBEHIND_RATIO * STRAIGHT_RANGE);
export const SIDE = (SIDE_RATIO * STRAIGHT_RANGE);
export const ANGLE = (ANGLE_RATIO * STRAIGHT_RANGE);
export const STRAIGHT = (STRAIGHT_RATIO * STRAIGHT_RANGE);

// opplist value constants
const HEARD_3_TURNS_AGO = -4;
const HEARD_2_TURNS_AGO = -3;
export const HEARD_LAST_TURN = -2;
export const HEARD_THIS_TURN = -1;
export const NOT_HEARD_OR_SEEN = 0;
export const SEEN_CURRENTLY = 1;
export const SEEN_THIS_TURN = 2;
export const SEEN_LAST_TURN = 3;
const SEEN_2_TURNS_AGO = 4;
const SEEN_3_TURNS_AGO = 5;

export const OLDEST_SEEN_VALUE = SEEN_3_TURNS_AGO;
export const OLDEST_HEARD_VALUE = HEARD_3_TURNS_AGO;

const UNDER_FIRE = 2;
const UNDER_FIRE_LAST_TURN = 1;

const MAX_DISTANCE_FOR_PROXIMITY_SIGHT = 15;

// DEFINES FOR BODY TYPE SUBSTITUTIONS
export const SUB_ANIM_BIGGUYSHOOT2 = 0x00000001;
export const SUB_ANIM_BIGGUYTHREATENSTANCE = 0x00000002;

// Enumerate directions
export const enum Enum245 {
  NORTH = 0,
  NORTHEAST,
  EAST,
  SOUTHEAST,
  SOUTH,
  SOUTHWEST,
  WEST,
  NORTHWEST,
  NUM_WORLD_DIRECTIONS,
  DIRECTION_IRRELEVANT,
  DIRECTION_EXITGRID = 255,
}

// ENUMERATION OF SOLDIER POSIITONS IN GLOBAL SOLDIER LIST
export const MAX_NUM_SOLDIERS = 148;
const NUM_PLANNING_MERCS = 8;
export const TOTAL_SOLDIERS = (NUM_PLANNING_MERCS + MAX_NUM_SOLDIERS);

// DEFINE TEAMS
export const OUR_TEAM = 0;
export const ENEMY_TEAM = 1;
export const CREATURE_TEAM = 2;
export const MILITIA_TEAM = 3;
export const CIV_TEAM = 4;
export const LAST_TEAM = CIV_TEAM;
export const PLAYER_PLAN = 5;

//-----------------------------------------------
//
// civilian "sub teams":
export const enum Enum246 {
  NON_CIV_GROUP = 0,
  REBEL_CIV_GROUP,
  KINGPIN_CIV_GROUP,
  SANMONA_ARMS_GROUP,
  ANGELS_GROUP,
  BEGGARS_CIV_GROUP,
  TOURISTS_CIV_GROUP,
  ALMA_MILITARY_CIV_GROUP,
  DOCTORS_CIV_GROUP,
  COUPLE1_CIV_GROUP,
  HICKS_CIV_GROUP,
  WARDEN_CIV_GROUP,
  JUNKYARD_CIV_GROUP,
  FACTORY_KIDS_GROUP,
  QUEENS_CIV_GROUP,
  UNNAMED_CIV_GROUP_15,
  UNNAMED_CIV_GROUP_16,
  UNNAMED_CIV_GROUP_17,
  UNNAMED_CIV_GROUP_18,
  UNNAMED_CIV_GROUP_19,

  NUM_CIV_GROUPS,
}

export const CIV_GROUP_NEUTRAL = 0;
export const CIV_GROUP_WILL_EVENTUALLY_BECOME_HOSTILE = 1;
export const CIV_GROUP_WILL_BECOME_HOSTILE = 2;
export const CIV_GROUP_HOSTILE = 3;

// boxing state
export const enum Enum247 {
  NOT_BOXING = 0,
  BOXING_WAITING_FOR_PLAYER,
  PRE_BOXING,
  BOXING,
  DISQUALIFIED,
  WON_ROUND,
  LOST_ROUND,
}

//
//-----------------------------------------------

// PALETTE SUBSITUTION TYPES
export interface PaletteSubRangeType {
  ubStart: UINT8;
  ubEnd: UINT8;
}

export type PaletteRepID = CHAR8[] /* [30] */;

export interface PaletteReplacementType {
  ubType: UINT8;
  ID: PaletteRepID;
  ubPaletteSize: UINT8;
  r: Pointer<UINT8>;
  g: Pointer<UINT8>;
  b: Pointer<UINT8>;
}

// MACROS
// This will set an animation ID
export const SET_PALETTEREP_ID = (a, b) => (strcpy(a, b));
// strcmp returns 0 if true!
export const COMPARE_PALETTEREP_ID = (a, b) => (strcmp(a, b) ? false : true);

}
