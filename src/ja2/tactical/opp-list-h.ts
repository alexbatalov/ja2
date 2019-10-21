const EVERYBODY = MAXMERCS;

const MAX_MISC_NOISE_DURATION = 12; // max dur for VERY loud NOBODY noises

const DOOR_NOISE_VOLUME = 2;
const WINDOW_CRACK_VOLUME = 4;
const WINDOW_SMASH_VOLUME = 8;
const MACHETE_VOLUME = 9;
const TRIMMER_VOLUME = 18;
const CHAINSAW_VOLUME = 30;
const SMASHING_DOOR_VOLUME = 6;
const CROWBAR_DOOR_VOLUME = 4;
const ITEM_THROWN_VOLUME = 2;

const TIME_BETWEEN_RT_OPPLIST_DECAYS = 20;

// this is a fake "level" value (0 on ground, 1 on roof) for
// HearNoise to ignore the effects of lighting(?)
const LIGHT_IRRELEVANT = 127;

const AUTOMATIC_INTERRUPT = 100;
const NO_INTERRUPT = 127;

const MOVEINTERRUPT = 0;
const SIGHTINTERRUPT = 1;
const NOISEINTERRUPT = 2;

// noise type constants
const enum Enum236 {
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

const NUM_WATCHED_LOCS = 3;

extern INT8 gbPublicOpplist[MAXTEAMS][TOTAL_SOLDIERS];
extern INT8 gbSeenOpponents[TOTAL_SOLDIERS][TOTAL_SOLDIERS];
extern INT16 gsLastKnownOppLoc[TOTAL_SOLDIERS][TOTAL_SOLDIERS]; // merc vs. merc
extern INT8 gbLastKnownOppLevel[TOTAL_SOLDIERS][TOTAL_SOLDIERS];
extern INT16 gsPublicLastKnownOppLoc[MAXTEAMS][TOTAL_SOLDIERS]; // team vs. merc
extern INT8 gbPublicLastKnownOppLevel[MAXTEAMS][TOTAL_SOLDIERS];
extern UINT8 gubPublicNoiseVolume[MAXTEAMS];
extern INT16 gsPublicNoiseGridno[MAXTEAMS];
extern INT8 gbPublicNoiseLevel[MAXTEAMS];
extern UINT8 gubKnowledgeValue[10][10];
extern INT8 gbLookDistance[8][8];
extern INT8 gfKnowAboutOpponents;

extern BOOLEAN gfPlayerTeamSawJoey;
extern BOOLEAN gfMikeShouldSayHi;

extern INT16 gsWatchedLoc[TOTAL_SOLDIERS][NUM_WATCHED_LOCS];
extern INT8 gbWatchedLocLevel[TOTAL_SOLDIERS][NUM_WATCHED_LOCS];
extern UINT8 gubWatchedLocPoints[TOTAL_SOLDIERS][NUM_WATCHED_LOCS];
extern BOOLEAN gfWatchedLocReset[TOTAL_SOLDIERS][NUM_WATCHED_LOCS];

const BEST_SIGHTING_ARRAY_SIZE = 6;
const BEST_SIGHTING_ARRAY_SIZE_ALL_TEAMS_LOOK_FOR_ALL = 6;
const BEST_SIGHTING_ARRAY_SIZE_NONCOMBAT = 3;
const BEST_SIGHTING_ARRAY_SIZE_INCOMBAT = 0;
extern UINT8 gubBestToMakeSightingSize;

extern INT8 gbLightSighting[1][16];
