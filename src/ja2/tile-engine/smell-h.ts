const HUMAN = 0;
const CREATURE_ON_FLOOR = 0x01;
const CREATURE_ON_ROOF = 0x02;

const NORMAL_HUMAN_SMELL_STRENGTH = 10;
const COW_SMELL_STRENGTH = 15;
const NORMAL_CREATURE_SMELL_STRENGTH = 20;

const SMELL_TYPE_NUM_BITS = 2;
const SMELL_TYPE = (s) => (s & 0x01);
const SMELL_STRENGTH = (s) => ((s & 0xFC) >> SMELL_TYPE_NUM_BITS);

const MAXBLOODQUANTITY = 7;
const BLOODDIVISOR = 10;

void DecaySmells(void);
void DecayBloodAndSmells(UINT32 uiTime);
void DropSmell(SOLDIERTYPE *pSoldier);
void DropBlood(SOLDIERTYPE *pSoldier, UINT8 ubStrength, INT8 bVisible);
void UpdateBloodGraphics(INT16 sGridNo, INT8 bLevel);
void RemoveBlood(INT16 sGridNo, INT8 bLevel);
void InternalDropBlood(INT16 sGridNo, INT8 bLevel, UINT8 ubType, UINT8 ubStrength, INT8 bVisible);
