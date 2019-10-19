BOOLEAN LoadAmbientControlFile(UINT8 ubAmbientID);

void HandleNewSectorAmbience(UINT8 ubAmbientID);
UINT32 SetupNewAmbientSound(UINT32 uiAmbientID);

void StopAmbients();
void DeleteAllAmbients();

extern AMBIENTDATA_STRUCT gAmbData[MAX_AMBIENT_SOUNDS];
extern INT16 gsNumAmbData;

BOOLEAN SetSteadyStateAmbience(UINT8 ubAmbience);

const SOUND_NAME_SIZE = 256;
const NUM_SOUNDS_PER_TIMEFRAME = 8;

const enum Enum301 {
  SSA_NONE,
  SSA_COUNTRYSIZE,
  SSA_NEAR_WATER,
  SSA_IN_WATER,
  SSA_HEAVY_FOREST,
  SSA_PINE_FOREST,
  SSA_ABANDONED,
  SSA_AIRPORT,
  SSA_WASTELAND,
  SSA_UNDERGROUND,
  SSA_OCEAN,
  NUM_STEADY_STATE_AMBIENCES,
}

typedef struct {
  CHAR8 zSoundNames[NUM_SOUNDS_PER_TIMEFRAME][SOUND_NAME_SIZE];
} STEADY_STATE_AMBIENCE;
