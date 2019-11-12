namespace ja2 {

// DEFINES
export const MAXCOL = WORLD_COLS;
export const MAXROW = WORLD_ROWS;
export const GRIDSIZE = (MAXCOL * MAXROW);
export const RIGHTMOSTGRID = (MAXCOL - 1);
export const LASTROWSTART = (GRIDSIZE - MAXCOL);
export const NOWHERE = (GRIDSIZE + 1);
export const NO_MAP_POS = NOWHERE;
export const MAPWIDTH = (WORLD_COLS);
const MAPHEIGHT = (WORLD_ROWS);
export const MAPLENGTH = (MAPHEIGHT * MAPWIDTH);

// Macros

//                                                |Check for map bounds------------------------------------------|   |Invalid-|   |Valid-------------------|
export const MAPROWCOLTOPOS = (r: number, c: number) => (((r < 0) || (r >= WORLD_ROWS) || (c < 0) || (c >= WORLD_COLS)) ? (0xffff) : ((r) * WORLD_COLS + (c)));

export const GETWORLDINDEXFROMWORLDCOORDS = (r: number, c: number) => ((r / CELL_X_SIZE)) * WORLD_COLS + ((c / CELL_Y_SIZE));

}
