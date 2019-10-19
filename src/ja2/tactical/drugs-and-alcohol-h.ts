const DRUG_TYPE_ADRENALINE = 0;
const DRUG_TYPE_ALCOHOL = 1;
const NO_DRUG = 2;
const NUM_COMPLEX_DRUGS = 2;
const DRUG_TYPE_REGENERATION = 3;

const SOBER = 0;
const FEELING_GOOD = 1;
const BORDERLINE = 2;
const DRUNK = 3;
const HUNGOVER = 4;

const REGEN_POINTS_PER_BOOSTER = 4;
const LIFE_GAIN_PER_REGEN_POINT = 10;

UINT8 GetDrugType(UINT16 usItem);
BOOLEAN ApplyDrugs(SOLDIERTYPE *pSoldier, OBJECTTYPE *pObject);

void HandleEndTurnDrugAdjustments(SOLDIERTYPE *pSoldier);
void HandleAPEffectDueToDrugs(SOLDIERTYPE *pSoldier, UINT8 *pubPoints);
void HandleBPEffectDueToDrugs(SOLDIERTYPE *pSoldier, INT16 *psPoints);

INT8 GetDrugEffect(SOLDIERTYPE *pSoldier, UINT8 ubDrugType);
INT8 GetDrugSideEffect(SOLDIERTYPE *pSoldier, UINT8 ubDrugType);
INT8 GetDrunkLevel(SOLDIERTYPE *pSoldier);
INT32 EffectStatForBeingDrunk(SOLDIERTYPE *pSoldier, INT32 iStat);
BOOLEAN MercUnderTheInfluence(SOLDIERTYPE *pSoldier);
