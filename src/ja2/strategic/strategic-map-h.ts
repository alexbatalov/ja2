namespace ja2 {

// The maximum size for any team strategically speaking.  For example, we can't have more than 20 enemies, militia, or creatures at a time.
export const MAX_STRATEGIC_TEAM_SIZE = 20;

// Codes for jumoing into adjacent sectors..
export const enum Enum177 {
  JUMP_ALL_LOAD_NEW,
  JUMP_ALL_NO_LOAD,
  JUMP_SINGLE_LOAD_NEW,
  JUMP_SINGLE_NO_LOAD,
}

const enum Enum178 {
  CONTROLLED = 0,
  UNCONTROLLED,
}

export const NUMBER_OF_SAMS = 4;

// SAM sites
export const SAM_1_X = 2;
export const SAM_2_X = 15;
export const SAM_3_X = 8;
export const SAM_4_X = 4;

export const SAM_1_Y = 4;
export const SAM_2_Y = 4;
export const SAM_3_Y = 9;
export const SAM_4_Y = 14;

// min condition for sam site to be functional
export const MIN_CONDITION_FOR_SAM_SITE_TO_WORK = 80;

// FUNCTIONS FOR DERTERMINING GOOD SECTOR EXIT DATA
export const CHECK_DIR_X_DELTA = (WORLD_TILE_X * 4);
export const CHECK_DIR_Y_DELTA = (WORLD_TILE_Y * 10);

// get index into aray
export const CALCULATE_STRATEGIC_INDEX = (x, y) => (x + (y * MAP_WORLD_X));
export const GET_X_FROM_STRATEGIC_INDEX = (i) => (i % MAP_WORLD_X);
export const GET_Y_FROM_STRATEGIC_INDEX = (i) => (i / MAP_WORLD_X);

// macros to convert between the 2 different sector numbering systems
export const SECTOR_INFO_TO_STRATEGIC_INDEX = (i) => (CALCULATE_STRATEGIC_INDEX(SECTORX(i), SECTORY(i)));
export const STRATEGIC_INDEX_TO_SECTOR_INFO = (i) => (SECTOR(GET_X_FROM_STRATEGIC_INDEX(i), GET_Y_FROM_STRATEGIC_INDEX(i)));

// BOOLEAN IsThereAnyOneInThisTown( UINT8 ubTownId );

}
