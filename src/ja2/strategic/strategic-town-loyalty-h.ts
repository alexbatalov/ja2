namespace ja2 {

// gain pts per real loyalty pt
export const GAIN_PTS_PER_LOYALTY_PT = 500;

// --- LOYALTY BONUSES ---
// Omerta
export const LOYALTY_BONUS_MIGUEL_READS_LETTER = (10 * GAIN_PTS_PER_LOYALTY_PT); // multiplied by 4.5 due to Omerta's high seniment, so it's 45%
// Drassen
export const LOYALTY_BONUS_CHILDREN_FREED_DOREEN_KILLED = (10 * GAIN_PTS_PER_LOYALTY_PT); // +50% bonus for Drassen
export const LOYALTY_BONUS_CHILDREN_FREED_DOREEN_SPARED = (20 * GAIN_PTS_PER_LOYALTY_PT); // +50% bonus for Drassen
// Cambria
export const LOYALTY_BONUS_MARTHA_WHEN_JOEY_RESCUED = (15 * GAIN_PTS_PER_LOYALTY_PT); // -25% for low Cambria sentiment
export const LOYALTY_BONUS_KEITH_WHEN_HILLBILLY_SOLVED = (15 * GAIN_PTS_PER_LOYALTY_PT); // -25% for low Cambria sentiment
// Chitzena
export const LOYALTY_BONUS_YANNI_WHEN_CHALICE_RETURNED_LOCAL = (20 * GAIN_PTS_PER_LOYALTY_PT); // +75% higher in Chitzena
export const LOYALTY_BONUS_YANNI_WHEN_CHALICE_RETURNED_GLOBAL = (10 * GAIN_PTS_PER_LOYALTY_PT); // for ALL towns!
// Alma
export const LOYALTY_BONUS_AUNTIE_WHEN_BLOODCATS_KILLED = (20 * GAIN_PTS_PER_LOYALTY_PT); // Alma's increases reduced by half due to low rebel sentiment
export const LOYALTY_BONUS_MATT_WHEN_DYNAMO_FREED = (20 * GAIN_PTS_PER_LOYALTY_PT); // Alma's increases reduced by half due to low rebel sentiment
export const LOYALTY_BONUS_FOR_SERGEANT_KROTT = (20 * GAIN_PTS_PER_LOYALTY_PT); // Alma's increases reduced by half due to low rebel sentiment
// Everywhere
export const LOYALTY_BONUS_TERRORISTS_DEALT_WITH = (5 * GAIN_PTS_PER_LOYALTY_PT);
export const LOYALTY_BONUS_KILL_QUEEN_MONSTER = (10 * GAIN_PTS_PER_LOYALTY_PT);
// Anywhere
// loyalty bonus for completing town training
export const LOYALTY_BONUS_FOR_TOWN_TRAINING = (2 * GAIN_PTS_PER_LOYALTY_PT); // 2%

// --- LOYALTY PENALTIES ---
// Cambria
export const LOYALTY_PENALTY_MARTHA_HEART_ATTACK = (20 * GAIN_PTS_PER_LOYALTY_PT);
export const LOYALTY_PENALTY_JOEY_KILLED = (10 * GAIN_PTS_PER_LOYALTY_PT);
// Balime
export const LOYALTY_PENALTY_ELDIN_KILLED = (20 * GAIN_PTS_PER_LOYALTY_PT); // effect is double that!
// Any mine
export const LOYALTY_PENALTY_HEAD_MINER_ATTACKED = (20 * GAIN_PTS_PER_LOYALTY_PT); // exact impact depends on rebel sentiment in that town
// Loyalty penalty for being inactive, per day after the third
export const LOYALTY_PENALTY_INACTIVE = (10 * GAIN_PTS_PER_LOYALTY_PT);

export const enum Enum190 {
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

export interface TOWN_LOYALTY {
  ubRating: UINT8;
  sChange: INT16;
  fStarted: boolean; // starting loyalty of each town is initialized only when player first enters that town
  UNUSEDubRebelSentiment: UINT8; // current rebel sentiment.  Events could change the starting value...
  fLiberatedAlready: boolean;
  filler: BYTE[] /* [19] */; // reserved for expansion
}

export function createTownLoyalty(): TOWN_LOYALTY {
  return {
    ubRating: 0,
    sChange: 0,
    fStarted: false,
    UNUSEDubRebelSentiment: 0,
    fLiberatedAlready: false,
    filler: createArray(19, 0),
  };
}

export const TOWN_LOYALTY_SIZE = 26;

export function readTownLoyalty(o: TOWN_LOYALTY, buffer: Buffer, offset: number = 0): number {
  o.ubRating = buffer.readUInt8(offset++);
  offset++; // padding
  o.sChange = buffer.readInt16LE(offset); offset += 2;
  o.fStarted = Boolean(buffer.readUInt8(offset++));
  o.UNUSEDubRebelSentiment = buffer.readUInt8(offset++);
  o.fLiberatedAlready = Boolean(buffer.readUInt8(offset++));
  offset = readUIntArray(o.filler, buffer, offset, 1);
  return offset
}

export function writeTownLoyalty(o: TOWN_LOYALTY, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubRating, offset);
  offset = writePadding(buffer, offset, 1);
  offset = buffer.writeInt16LE(o.sChange, offset);
  offset = buffer.writeUInt8(Number(o.fStarted), offset);
  offset = buffer.writeUInt8(o.UNUSEDubRebelSentiment, offset);
  offset = buffer.writeUInt8(Number(o.fLiberatedAlready), offset);
  offset = writeUIntArray(o.filler, buffer, offset, 1);
  return offset;
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

export const RETREAT_TACTICAL_TRAVERSAL = 0;
export const RETREAT_PBI = 1;
export const RETREAT_AUTORESOLVE = 2;

}
