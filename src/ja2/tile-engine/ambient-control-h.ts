namespace ja2 {

const SOUND_NAME_SIZE = 256;
export const NUM_SOUNDS_PER_TIMEFRAME = 8;

export const enum Enum301 {
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

export interface STEADY_STATE_AMBIENCE {
  zSoundNames: string[] /* CHAR8[NUM_SOUNDS_PER_TIMEFRAME][SOUND_NAME_SIZE] */;
}

export function createSteadyStateAmbienceFrom(zSoundNames: string[]): STEADY_STATE_AMBIENCE {
  return {
    zSoundNames,
  };
}

}
