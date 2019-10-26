namespace ja2 {

export const EVERYBODY = MAXMERCS;

export const MAX_MISC_NOISE_DURATION = 12; // max dur for VERY loud NOBODY noises

export const DOOR_NOISE_VOLUME = 2;
export const WINDOW_CRACK_VOLUME = 4;
export const WINDOW_SMASH_VOLUME = 8;
const MACHETE_VOLUME = 9;
const TRIMMER_VOLUME = 18;
const CHAINSAW_VOLUME = 30;
export const SMASHING_DOOR_VOLUME = 6;
export const CROWBAR_DOOR_VOLUME = 4;
const ITEM_THROWN_VOLUME = 2;

export const TIME_BETWEEN_RT_OPPLIST_DECAYS = 20;

// this is a fake "level" value (0 on ground, 1 on roof) for
// HearNoise to ignore the effects of lighting(?)
const LIGHT_IRRELEVANT = 127;

export const AUTOMATIC_INTERRUPT = 100;
export const NO_INTERRUPT = 127;

const MOVEINTERRUPT = 0;
export const SIGHTINTERRUPT = 1;
export const NOISEINTERRUPT = 2;

// noise type constants
export const enum Enum236 {
  NOISE_UNKNOWN = 0,
  NOISE_MOVEMENT,
  NOISE_CREAKING,
  NOISE_SPLASHING,
  NOISE_BULLET_IMPACT,
  NOISE_GUNFIRE,
  NOISE_EXPLOSION,
  NOISE_SCREAM,
  NOISE_ROCK_IMPACT,
  NOISE_GRENADE_IMPACT,
  NOISE_WINDOW_SMASHING,
  NOISE_DOOR_SMASHING,
  NOISE_SILENT_ALARM, // only heard by enemies
  MAX_NOISES,
}

const enum Enum237 {
  EXPECTED_NOSEND, // other nodes expecting noise & have all info
  EXPECTED_SEND, // other nodes expecting noise, but need info
  UNEXPECTED, // other nodes are NOT expecting this noise
}

export const NUM_WATCHED_LOCS = 3;

export const BEST_SIGHTING_ARRAY_SIZE = 6;
export const BEST_SIGHTING_ARRAY_SIZE_ALL_TEAMS_LOOK_FOR_ALL = 6;
export const BEST_SIGHTING_ARRAY_SIZE_NONCOMBAT = 3;
export const BEST_SIGHTING_ARRAY_SIZE_INCOMBAT = 0;

}
