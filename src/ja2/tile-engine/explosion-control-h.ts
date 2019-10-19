const MAX_DISTANCE_EXPLOSIVE_CAN_DESTROY_STRUCTURES = 2;

const EXPLOSION_FLAG_USEABSPOS = 0x00000001;
const EXPLOSION_FLAG_DISPLAYONLY = 0x00000002;

// Explosion Data
interface EXPLOSION_PARAMS {
  uiFlags: UINT32;

  ubOwner: UINT8;
  ubTypeID: UINT8;

  usItem: UINT16;

  sX: INT16; // World X ( optional )
  sY: INT16; // World Y ( optional )
  sZ: INT16; // World Z ( optional )
  sGridNo: INT16; // World GridNo
  fLocate: BOOLEAN;
  bLevel: INT8; // World level
  ubUnsed: UINT8[] /* [1] */;
}

interface EXPLOSIONTYPE {
  Params: EXPLOSION_PARAMS;
  fAllocated: BOOLEAN;
  sCurrentFrame: INT16;
  iID: INT32;
  iLightID: INT32;
  ubUnsed: UINT8[] /* [2] */;
}

const enum Enum304 {
  NO_BLAST,
  BLAST_1,
  BLAST_2,
  BLAST_3,
  STUN_BLAST,
  WATER_BLAST,
  TARGAS_EXP,
  SMOKE_EXP,
  MUSTARD_EXP,

  NUM_EXP_TYPES,
}

interface ExplosionQueueElement {
  uiWorldBombIndex: UINT32;
  uiTimeStamp: UINT32;
  fExists: UINT8;
}

const ERASE_SPREAD_EFFECT = 2;
const BLOOD_SPREAD_EFFECT = 3;
const REDO_SPREAD_EFFECT = 4;

const NUM_EXPLOSION_SLOTS = 100;
extern EXPLOSIONTYPE gExplosionData[NUM_EXPLOSION_SLOTS];

extern UINT8 gubElementsOnExplosionQueue;
extern BOOLEAN gfExplosionQueueActive;

void IgniteExplosion(UINT8 ubOwner, INT16 sX, INT16 sY, INT16 sZ, INT16 sGridNo, UINT16 usItem, INT8 bLevel);
void InternalIgniteExplosion(UINT8 ubOwner, INT16 sX, INT16 sY, INT16 sZ, INT16 sGridNo, UINT16 usItem, BOOLEAN fLocate, INT8 bLevel);

void GenerateExplosion(EXPLOSION_PARAMS *pExpParams);

void SpreadEffect(INT16 sGridNo, UINT8 ubRadius, UINT16 usItem, UINT8 ubOwner, BOOLEAN fSubsequent, INT8 bLevel, INT32 iSmokeEffectNum);

void AddBombToQueue(UINT32 uiWorldBombIndex, UINT32 uiTimeStamp);

void DecayBombTimers(void);
void SetOffBombsByFrequency(UINT8 ubID, INT8 bFrequency);
BOOLEAN SetOffBombsInGridNo(UINT8 ubID, INT16 sGridNo, BOOLEAN fAllBombs, INT8 bLevel);
void ActivateSwitchInGridNo(UINT8 ubID, INT16 sGridNo);
void SetOffPanicBombs(UINT8 ubID, INT8 bPanicTrigger);

void UpdateExplosionFrame(INT32 iIndex, INT16 sCurrentFrame);
void RemoveExplosionData(INT32 iIndex);

void UpdateAndDamageSAMIfFound(INT16 sSectorX, INT16 sSectorY, INT16 sSectorZ, INT16 sGridNo, UINT8 ubDamage);
void UpdateSAMDoneRepair(INT16 sSectorX, INT16 sSectorY, INT16 sSectorZ);

BOOLEAN SaveExplosionTableToSaveGameFile(HWFILE hFile);

BOOLEAN LoadExplosionTableFromSavedGameFile(HWFILE hFile);

INT32 FindActiveTimedBomb(void);
BOOLEAN ActiveTimedBombExists(void);
void RemoveAllActiveTimedBombs(void);

const GASMASK_MIN_STATUS = 70;

BOOLEAN DishOutGasDamage(SOLDIERTYPE *pSoldier, EXPLOSIVETYPE *pExplosive, INT16 sSubsequent, BOOLEAN fRecompileMovementCosts, INT16 sWoundAmt, INT16 sBreathAmt, UINT8 ubOwner);
