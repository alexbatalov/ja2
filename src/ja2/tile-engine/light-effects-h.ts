// Light effect types
const enum Enum305 {
  NO_LIGHT_EFFECT,
  LIGHT_FLARE_MARK_1,
}

interface LIGHTEFFECT {
  sGridNo: INT16; // gridno at which the tear gas cloud is centered

  ubDuration: UINT8; // the number of turns will remain effective
  bRadius: UINT8; // the current radius
  bAge: INT8; // the number of turns light has been around
  fAllocated: BOOLEAN;
  bType: INT8;
  iLight: INT32;
  uiTimeOfLastUpdate: UINT32;
}

// Decays all light effects...
void DecayLightEffects(UINT32 uiTime);

// Add light to gridno
// ( Replacement algorithm uses distance away )
void AddLightEffectToTile(INT8 bType, INT16 sGridNo);

void RemoveLightEffectFromTile(INT16 sGridNo);

INT32 NewLightEffect(INT16 sGridNo, INT8 bType);

BOOLEAN SaveLightEffectsToSaveGameFile(HWFILE hFile);
BOOLEAN LoadLightEffectsFromLoadGameFile(HWFILE hFile);

BOOLEAN SaveLightEffectsToMapTempFile(INT16 sMapX, INT16 sMapY, INT8 bMapZ);
BOOLEAN LoadLightEffectsFromMapTempFile(INT16 sMapX, INT16 sMapY, INT8 bMapZ);
void ResetLightEffects();
