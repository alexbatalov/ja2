// DEFINES
const MAXCOL = WORLD_COLS;
const MAXROW = WORLD_ROWS;
const GRIDSIZE = (MAXCOL * MAXROW);
const RIGHTMOSTGRID = (MAXCOL - 1);
const LASTROWSTART = (GRIDSIZE - MAXCOL);
const NOWHERE = (GRIDSIZE + 1);
const NO_MAP_POS = NOWHERE;
const MAPWIDTH = (WORLD_COLS);
const MAPHEIGHT = (WORLD_ROWS);
const MAPLENGTH = (MAPHEIGHT * MAPWIDTH);

const ADJUST_Y_FOR_HEIGHT = (pos, y) => (y -= gpWorldLevelData[pos].sHeight);

// Macros

//                                                |Check for map bounds------------------------------------------|   |Invalid-|   |Valid-------------------|
const MAPROWCOLTOPOS = (r, c) => (((r < 0) || (r >= WORLD_ROWS) || (c < 0) || (c >= WORLD_COLS)) ? (0xffff) : ((r) * WORLD_COLS + (c)));

const GETWORLDINDEXFROMWORLDCOORDS = (r, c) => ((INT16)(r / CELL_X_SIZE)) * WORLD_COLS + ((INT16)(c / CELL_Y_SIZE));
