const BOXING_SECTOR_X = 5;
const BOXING_SECTOR_Y = 4;
const BOXING_SECTOR_Z = 0;
const ROOM_SURROUNDING_BOXING_RING = 3;
const BOXING_RING = 29;

const BOXING_AI_START_POSITION = 11235;

const NUM_BOXERS = 3;

const enum Enum199 {
  BOXER_OUT_OF_RING,
  NON_BOXER_IN_RING,
  BAD_ATTACK,
}

extern INT16 gsBoxerGridNo[NUM_BOXERS];
extern UINT8 gubBoxerID[NUM_BOXERS];
extern BOOLEAN gfBoxerFought[NUM_BOXERS];
extern INT8 gbBoxingState;
extern BOOLEAN gfLastBoxingMatchWonByPlayer;
extern UINT8 gubBoxingMatchesWon;
extern UINT8 gubBoxersRests;
extern BOOLEAN gfBoxersResting;
