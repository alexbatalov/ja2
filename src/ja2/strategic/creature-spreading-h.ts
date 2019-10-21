BOOLEAN gfUseCreatureMusic;

extern INT16 gsCreatureInsertionCode;
extern INT16 gsCreatureInsertionGridNo;
extern UINT8 gubNumCreaturesAttackingTown;
extern UINT8 gubYoungMalesAttackingTown;
extern UINT8 gubYoungFemalesAttackingTown;
extern UINT8 gubAdultMalesAttackingTown;
extern UINT8 gubAdultFemalesAttackingTown;
extern UINT8 gubSectorIDOfCreatureAttack;
const enum Enum129 {
  CREATURE_BATTLE_CODE_NONE,
  CREATURE_BATTLE_CODE_TACTICALLYADD,
  CREATURE_BATTLE_CODE_TACTICALLYADD_WITHFOV,
  CREATURE_BATTLE_CODE_PREBATTLEINTERFACE,
  CREATURE_BATTLE_CODE_AUTORESOLVE,
}
extern UINT8 gubCreatureBattleCode;
