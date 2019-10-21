// gain pts per real loyalty pt
const GAIN_PTS_PER_LOYALTY_PT = 500;

// --- LOYALTY BONUSES ---
// Omerta
const LOYALTY_BONUS_MIGUEL_READS_LETTER = (10 * GAIN_PTS_PER_LOYALTY_PT); // multiplied by 4.5 due to Omerta's high seniment, so it's 45%
// Drassen
const LOYALTY_BONUS_CHILDREN_FREED_DOREEN_KILLED = (10 * GAIN_PTS_PER_LOYALTY_PT); // +50% bonus for Drassen
const LOYALTY_BONUS_CHILDREN_FREED_DOREEN_SPARED = (20 * GAIN_PTS_PER_LOYALTY_PT); // +50% bonus for Drassen
// Cambria
const LOYALTY_BONUS_MARTHA_WHEN_JOEY_RESCUED = (15 * GAIN_PTS_PER_LOYALTY_PT); // -25% for low Cambria sentiment
const LOYALTY_BONUS_KEITH_WHEN_HILLBILLY_SOLVED = (15 * GAIN_PTS_PER_LOYALTY_PT); // -25% for low Cambria sentiment
// Chitzena
const LOYALTY_BONUS_YANNI_WHEN_CHALICE_RETURNED_LOCAL = (20 * GAIN_PTS_PER_LOYALTY_PT); // +75% higher in Chitzena
const LOYALTY_BONUS_YANNI_WHEN_CHALICE_RETURNED_GLOBAL = (10 * GAIN_PTS_PER_LOYALTY_PT); // for ALL towns!
// Alma
const LOYALTY_BONUS_AUNTIE_WHEN_BLOODCATS_KILLED = (20 * GAIN_PTS_PER_LOYALTY_PT); // Alma's increases reduced by half due to low rebel sentiment
const LOYALTY_BONUS_MATT_WHEN_DYNAMO_FREED = (20 * GAIN_PTS_PER_LOYALTY_PT); // Alma's increases reduced by half due to low rebel sentiment
const LOYALTY_BONUS_FOR_SERGEANT_KROTT = (20 * GAIN_PTS_PER_LOYALTY_PT); // Alma's increases reduced by half due to low rebel sentiment
// Everywhere
const LOYALTY_BONUS_TERRORISTS_DEALT_WITH = (5 * GAIN_PTS_PER_LOYALTY_PT);
const LOYALTY_BONUS_KILL_QUEEN_MONSTER = (10 * GAIN_PTS_PER_LOYALTY_PT);
// Anywhere
// loyalty bonus for completing town training
const LOYALTY_BONUS_FOR_TOWN_TRAINING = (2 * GAIN_PTS_PER_LOYALTY_PT); // 2%

// --- LOYALTY PENALTIES ---
// Cambria
const LOYALTY_PENALTY_MARTHA_HEART_ATTACK = (20 * GAIN_PTS_PER_LOYALTY_PT);
const LOYALTY_PENALTY_JOEY_KILLED = (10 * GAIN_PTS_PER_LOYALTY_PT);
// Balime
const LOYALTY_PENALTY_ELDIN_KILLED = (20 * GAIN_PTS_PER_LOYALTY_PT); // effect is double that!
// Any mine
const LOYALTY_PENALTY_HEAD_MINER_ATTACKED = (20 * GAIN_PTS_PER_LOYALTY_PT); // exact impact depends on rebel sentiment in that town
// Loyalty penalty for being inactive, per day after the third
const LOYALTY_PENALTY_INACTIVE = (10 * GAIN_PTS_PER_LOYALTY_PT);

const enum Enum190 {
  // There are only for distance-adjusted global loyalty effects.  Others go into list above instead!
  GLOBAL_LOYALTY_BATTLE_WON,
  GLOBAL_LOYALTY_BATTLE_LOST,
  GLOBAL_LOYALTY_ENEMY_KILLED,
  GLOBAL_LOYALTY_NATIVE_KILLED,
  GLOBAL_LOYALTY_GAIN_TOWN_SECTOR,
  GLOBAL_LOYALTY_LOSE_TOWN_SECTOR,
  GLOBAL_LOYALTY_LIBERATE_WHOLE_TOWN, // awarded only the first time it happens
  GLOBAL_LOYALTY_ABANDON_MILITIA,
  GLOBAL_LOYALTY_GAIN_MINE,
  GLOBAL_LOYALTY_LOSE_MINE,
  GLOBAL_LOYALTY_GAIN_SAM,
  GLOBAL_LOYALTY_LOSE_SAM,
  GLOBAL_LOYALTY_QUEEN_BATTLE_WON,
}

interface TOWN_LOYALTY {
  ubRating: UINT8;
  sChange: INT16;
  fStarted: BOOLEAN; // starting loyalty of each town is initialized only when player first enters that town
  UNUSEDubRebelSentiment: UINT8; // current rebel sentiment.  Events could change the starting value...
  fLiberatedAlready: BOOLEAN;
  filler: BYTE[] /* [19] */; // reserved for expansion
}

/* Delayed loyalty effects elimininated.  Sep.12/98.  ARM
// delayed town loyalty event
void HandleDelayedTownLoyaltyEvent( UINT32 uiValue );
// build loyalty event value
UINT32 BuildLoyaltyEventValue( INT8 bTownValue, UINT32 uiValue, BOOLEAN fIncrement );
*/

// Function assumes that mercs have retreated already.  Handles two cases, one for general merc retreat
// which slightly demoralizes the mercs, the other handles abandonment of militia forces which poses
// as a serious loyalty penalty.

const RETREAT_TACTICAL_TRAVERSAL = 0;
const RETREAT_PBI = 1;
const RETREAT_AUTORESOLVE = 2;
