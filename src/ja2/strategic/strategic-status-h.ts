namespace ja2 {

// Enemy is allowed to capture the player after certain day
export const STARTDAY_ALLOW_PLAYER_CAPTURE_FOR_RESCUE = 4;

export const STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE = 0x00000001;
export const STRATEGIC_PLAYER_CAPTURED_FOR_ESCAPE = 0x00000002;

export const ARMY_GUN_LEVELS = 11;

// player reputation modifiers
export const REPUTATION_LOW_DEATHRATE = +5;
export const REPUTATION_HIGH_DEATHRATE = -5;
export const REPUTATION_GREAT_MORALE = +3;
export const REPUTATION_POOR_MORALE = -3;
export const REPUTATION_BATTLE_WON = +2;
export const REPUTATION_BATTLE_LOST = -2;
export const REPUTATION_TOWN_WON = +5;
export const REPUTATION_TOWN_LOST = -5;
export const REPUTATION_SOLDIER_DIED = -2; // per exp. level
export const REPUTATION_SOLDIER_CAPTURED = -1;
export const REPUTATION_KILLED_CIVILIAN = -5;
export const REPUTATION_EARLY_FIRING = -3;
export const REPUTATION_KILLED_MONSTER_QUEEN = +15;
export const REPUTATION_KILLED_DEIDRANNA = +25;

// flags to remember whether a certain E-mail has already been sent out
export const ENRICO_EMAIL_SENT_SOME_PROGRESS = 0x0001;
export const ENRICO_EMAIL_SENT_ABOUT_HALFWAY = 0x0002;
export const ENRICO_EMAIL_SENT_NEARLY_DONE = 0x0004;
export const ENRICO_EMAIL_SENT_MINOR_SETBACK = 0x0008;
export const ENRICO_EMAIL_SENT_MAJOR_SETBACK = 0x0010;
export const ENRICO_EMAIL_SENT_CREATURES = 0x0020;
export const ENRICO_EMAIL_FLAG_SETBACK_OVER = 0x0040;
export const ENRICO_EMAIL_SENT_LACK_PROGRESS1 = 0x0080;
export const ENRICO_EMAIL_SENT_LACK_PROGRESS2 = 0x0100;
export const ENRICO_EMAIL_SENT_LACK_PROGRESS3 = 0x0200;

// progress threshold that control Enrico E-mail timing
export const SOME_PROGRESS_THRESHOLD = 20;
export const ABOUT_HALFWAY_THRESHOLD = 55;
export const NEARLY_DONE_THRESHOLD = 80;
export const MINOR_SETBACK_THRESHOLD = 5;
export const MAJOR_SETBACK_THRESHOLD = 15;

export const NEW_SECTORS_EQUAL_TO_ACTIVITY = 4;

// enemy ranks
export const enum Enum188 {
  ENEMY_RANK_ADMIN,
  ENEMY_RANK_TROOP,
  ENEMY_RANK_ELITE,
  NUM_ENEMY_RANKS,
}

// ways enemies can be killed
export const enum Enum189 {
  ENEMY_KILLED_IN_TACTICAL,
  ENEMY_KILLED_IN_AUTO_RESOLVE,
  ENEMY_KILLED_TOTAL,
  NUM_WAYS_ENEMIES_KILLED,
}

export interface STRATEGIC_STATUS {
  uiFlags: UINT32;
  ubNumCapturedForRescue: UINT8;

  ubHighestProgress: UINT8; // the highest level of progress player has attained thus far in the game (0-100)

  ubStandardArmyGunIndex: UINT8[] /* [ARMY_GUN_LEVELS] */; // type of gun in each group that Queen's army is using this game
  fWeaponDroppedAlready: boolean[] /* [MAX_WEAPONS] */; // flag that tracks whether this weapon type has been dropped before

  ubMercDeaths: UINT8; // how many soldiers have bit it while in the player's employ (0-100)
  uiManDaysPlayed: UINT32; // once per day, # living mercs on player's team is added to this running total

  ubBadReputation: UINT8; // how bad a reputation player has earned through his actions, performance, etc. (0-100)

  usEnricoEmailFlags: UINT16; // bit flags that control progress-related E-mails from Enrico

  ubInsuranceInvestigationsCnt: UINT8; // how many times merc has been investigated for possible insurance fraud

  ubUnhiredMercDeaths: UINT8; // how many mercs have died while NOT working for the player

  usPlayerKills: UINT16; // kills achieved by all mercs controlled by player together.  *Excludes* militia kills!

  usEnemiesKilled: UINT16[][] /* [NUM_WAYS_ENEMIES_KILLED][NUM_ENEMY_RANKS] */; // admin/troop/elite.  Includes kills by militia, too
  usLastDayOfPlayerActivity: UINT16;
  ubNumNewSectorsVisitedToday: UINT8;
  ubNumberOfDaysOfInactivity: UINT8;

  bPadding: INT8[] /* [70] */;
}

export function createStrategicStatus(): STRATEGIC_STATUS {
  return {
    uiFlags: 0,
    ubNumCapturedForRescue: 0,
    ubHighestProgress: 0,
    ubStandardArmyGunIndex: createArray(ARMY_GUN_LEVELS, 0),
    fWeaponDroppedAlready: createArray(Enum225.MAX_WEAPONS, false),
    ubMercDeaths: 0,
    uiManDaysPlayed: 0,
    ubBadReputation: 0,
    usEnricoEmailFlags: 0,
    ubInsuranceInvestigationsCnt: 0,
    ubUnhiredMercDeaths: 0,
    usPlayerKills: 0,
    usEnemiesKilled: createArrayFrom(Enum189.NUM_WAYS_ENEMIES_KILLED, () => createArray(Enum188.NUM_ENEMY_RANKS, 0)),
    usLastDayOfPlayerActivity: 0,
    ubNumNewSectorsVisitedToday: 0,
    ubNumberOfDaysOfInactivity: 0,
    bPadding: createArray(70, 0),
  };
}

export function resetStrategicStatus(o: STRATEGIC_STATUS) {
  o.uiFlags = 0;
  o.ubNumCapturedForRescue = 0;
  o.ubHighestProgress = 0;
  o.ubStandardArmyGunIndex.fill(0);
  o.fWeaponDroppedAlready.fill(false);
  o.ubMercDeaths = 0;
  o.uiManDaysPlayed = 0;
  o.ubBadReputation = 0;
  o.usEnricoEmailFlags = 0;
  o.ubInsuranceInvestigationsCnt = 0;
  o.ubUnhiredMercDeaths = 0;
  o.usPlayerKills = 0;

  for (let i = 0; i < o.usEnemiesKilled.length; i++) {
    o.usEnemiesKilled[i].fill(0);
  }

  o.usLastDayOfPlayerActivity = 0;
  o.ubNumNewSectorsVisitedToday = 0;
  o.ubNumberOfDaysOfInactivity = 0;
  o.bPadding.fill(0);
}

export const STRATEGIC_STATUS_SIZE = 192;

export function readStrategicStatus(o: STRATEGIC_STATUS, buffer: Buffer, offset: number = 0): number {
  o.uiFlags = buffer.readUInt32LE(offset); offset += 4;
  o.ubNumCapturedForRescue = buffer.readUInt8(offset++);
  o.ubHighestProgress = buffer.readUInt8(offset++);
  offset = readUIntArray(o.ubStandardArmyGunIndex, buffer, offset, 1);
  offset = readBooleanArray(o.fWeaponDroppedAlready, buffer, offset);
  o.ubMercDeaths = buffer.readUInt8(offset++);
  o.uiManDaysPlayed = buffer.readUInt32LE(offset); offset += 4;
  o.ubBadReputation = buffer.readUInt8(offset++);
  offset++; // padding
  o.usEnricoEmailFlags = buffer.readUInt16LE(offset); offset += 2;
  o.ubInsuranceInvestigationsCnt = buffer.readUInt8(offset++);
  o.ubUnhiredMercDeaths = buffer.readUInt8(offset++);
  o.usPlayerKills = buffer.readUInt16LE(offset); offset += 2;

  for (let i = 0; i < o.usEnemiesKilled.length; i++) {
    offset = readUIntArray(o.usEnemiesKilled[i], buffer, offset, 2);
  }

  o.usLastDayOfPlayerActivity = buffer.readUInt16LE(offset); offset += 2;
  o.ubNumNewSectorsVisitedToday = buffer.readUInt8(offset++);
  o.ubNumberOfDaysOfInactivity = buffer.readUInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);

  return offset;
}

export function writeStrategicStatus(o: STRATEGIC_STATUS, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiFlags, offset);
  offset = buffer.writeUInt8(o.ubNumCapturedForRescue, offset);
  offset = buffer.writeUInt8(o.ubHighestProgress, offset);
  offset = writeUIntArray(o.ubStandardArmyGunIndex, buffer, offset, 1);
  offset = writeBooleanArray(o.fWeaponDroppedAlready, buffer, offset);
  offset = buffer.writeUInt8(o.ubMercDeaths, offset);
  offset = buffer.writeUInt32LE(o.uiManDaysPlayed, offset);
  offset = buffer.writeUInt8(o.ubBadReputation, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usEnricoEmailFlags, offset);
  offset = buffer.writeUInt8(o.ubInsuranceInvestigationsCnt, offset);
  offset = buffer.writeUInt8(o.ubUnhiredMercDeaths, offset);
  offset = buffer.writeUInt16LE(o.usPlayerKills, offset);

  for (let i = 0; i < o.usEnemiesKilled.length; i++) {
    offset = writeUIntArray(o.usEnemiesKilled[i], buffer, offset, 2);
  }

  offset = buffer.writeUInt16LE(o.usLastDayOfPlayerActivity, offset);
  offset = buffer.writeUInt8(o.ubNumNewSectorsVisitedToday, offset);
  offset = buffer.writeUInt8(o.ubNumberOfDaysOfInactivity, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);

  return offset;
}

}
