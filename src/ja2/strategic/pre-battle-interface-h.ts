export const enum Enum164 {
  // General encounter codes (gubEnemyEncounterCode)
  NO_ENCOUNTER_CODE, // when there is no encounter
  ENEMY_INVASION_CODE,
  ENEMY_ENCOUNTER_CODE,
  ENEMY_AMBUSH_CODE,
  ENTERING_ENEMY_SECTOR_CODE,
  CREATURE_ATTACK_CODE,

  BLOODCAT_AMBUSH_CODE,
  ENTERING_BLOODCAT_LAIR_CODE,

  // Explicit encounter codes only (gubExplicitEnemyEncounterCode -- a superset of gubEnemyEncounterCode)
  FIGHTING_CREATURES_CODE,
  HOSTILE_CIVILIANS_CODE,
  HOSTILE_BLOODCATS_CODE,
}

// SAVE START

// SAVE END

export const enum Enum165 {
  LOG_DEFEAT,
  LOG_VICTORY,
}
