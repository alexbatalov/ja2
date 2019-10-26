namespace ja2 {

// void DrawMapIndexSmallMap( BOOLEAN fSelectedCursorIsYellow );

// check if anyone left behind, if not, move selected cursor along with movement group
// void CheckIfAnyoneLeftInSector( INT16 sX, INT16 sY, INT16 sNewX, INT16 sNewY, INT8 bZ );

export const enum Enum158 {
  ABORT_PLOTTING = 0,
  PATH_CLEARED,
  PATH_SHORTENED,
}

// what the player knows about the enemies in a given sector
export const enum Enum159 {
  KNOWS_NOTHING = 0,
  KNOWS_THEYRE_THERE,
  KNOWS_HOW_MANY,
}

// size of squares on the map
export const MAP_GRID_X = 21;
export const MAP_GRID_Y = 18;

// scroll bounds
export const EAST_ZOOM_BOUND = 378;
export const WEST_ZOOM_BOUND = 42;
export const SOUTH_ZOOM_BOUND = 324;
export const NORTH_ZOOM_BOUND = 36;

// map view region
export const MAP_VIEW_START_X = 270;
export const MAP_VIEW_START_Y = 10;
export const MAP_VIEW_WIDTH = 336;
export const MAP_VIEW_HEIGHT = 298;

// zoomed in grid sizes
export const MAP_GRID_ZOOM_X = MAP_GRID_X * 2;
export const MAP_GRID_ZOOM_Y = MAP_GRID_Y * 2;

// number of units wide
export const WORLD_MAP_X = 18;

// dirty regions for the map
export const DMAP_GRID_X = (MAP_GRID_X + 1);
export const DMAP_GRID_Y = (MAP_GRID_Y + 1);
export const DMAP_GRID_ZOOM_X = (MAP_GRID_ZOOM_X + 1);
export const DMAP_GRID_ZOOM_Y = (MAP_GRID_ZOOM_Y + 1);

// Orta position on the map
export const ORTA_SECTOR_X = 4;
export const ORTA_SECTOR_Y = 11;

export const TIXA_SECTOR_X = 9;
export const TIXA_SECTOR_Y = 10;

// what are we showing?..teams/vehicles
// Show values
export const SHOW_TEAMMATES = 1;
export const SHOW_VEHICLES = 2;

// wait time until temp path is drawn, from placing cursor on a map grid
export const MIN_WAIT_TIME_FOR_TEMP_PATH = 200;

}
