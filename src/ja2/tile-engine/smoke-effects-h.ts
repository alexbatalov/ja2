// Smoke effect types
const enum Enum308 {
  NO_SMOKE_EFFECT,
  NORMAL_SMOKE_EFFECT,
  TEARGAS_SMOKE_EFFECT,
  MUSTARDGAS_SMOKE_EFFECT,
  CREATURE_SMOKE_EFFECT,
}

const SMOKE_EFFECT_INDOORS = 0x01;
const SMOKE_EFFECT_ON_ROOF = 0x02;
const SMOKE_EFFECT_MARK_FOR_UPDATE = 0x04;

interface SMOKEEFFECT {
  sGridNo: INT16; // gridno at which the tear gas cloud is centered

  ubDuration: UINT8; // the number of turns gas will remain effective
  ubRadius: UINT8; // the current radius of the cloud in map tiles
  bFlags: UINT8; // 0 - outdoors (fast spread), 1 - indoors (slow)
  bAge: INT8; // the number of turns gas has been around
  fAllocated: BOOLEAN;
  bType: INT8;
  usItem: UINT16;
  ubOwner: UINT8;
  ubPadding: UINT8;
  uiTimeOfLastUpdate: UINT32;
}

// Returns NO_SMOKE_EFFECT if none there...
INT8 GetSmokeEffectOnTile(INT16 sGridNo, INT8 bLevel);

// Decays all smoke effects...
void DecaySmokeEffects(UINT32 uiTime);

// Add smoke to gridno
// ( Replacement algorithm uses distance away )
void AddSmokeEffectToTile(INT32 iSmokeEffectID, INT8 bType, INT16 sGridNo, INT8 bLevel);

void RemoveSmokeEffectFromTile(INT16 sGridNo, INT8 bLevel);

INT32 NewSmokeEffect(INT16 sGridNo, UINT16 usItem, INT8 bLevel, UINT8 ubOwner);

BOOLEAN SaveSmokeEffectsToSaveGameFile(HWFILE hFile);
BOOLEAN LoadSmokeEffectsFromLoadGameFile(HWFILE hFile);

BOOLEAN SaveSmokeEffectsToMapTempFile(INT16 sMapX, INT16 sMapY, INT8 bMapZ);
BOOLEAN LoadSmokeEffectsFromMapTempFile(INT16 sMapX, INT16 sMapY, INT8 bMapZ);

void ResetSmokeEffects();

void UpdateSmokeEffectGraphics();
