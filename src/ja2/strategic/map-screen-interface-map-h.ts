// void DrawMapIndexSmallMap( BOOLEAN fSelectedCursorIsYellow );

// check if anyone left behind, if not, move selected cursor along with movement group
// void CheckIfAnyoneLeftInSector( INT16 sX, INT16 sY, INT16 sNewX, INT16 sNewY, INT8 bZ );

const enum Enum158 {
  ABORT_PLOTTING = 0,
  PATH_CLEARED,
  PATH_SHORTENED,
}

// what the player knows about the enemies in a given sector
const enum Enum159 {
  KNOWS_NOTHING = 0,
  KNOWS_THEYRE_THERE,
  KNOWS_HOW_MANY,
}

// size of squares on the map
const MAP_GRID_X = 21;
const MAP_GRID_Y = 18;

// scroll bounds
const EAST_ZOOM_BOUND = 378;
const WEST_ZOOM_BOUND = 42;
const SOUTH_ZOOM_BOUND = 324;
const NORTH_ZOOM_BOUND = 36;

// map view region
const MAP_VIEW_START_X = 270;
const MAP_VIEW_START_Y = 10;
const MAP_VIEW_WIDTH = 336;
const MAP_VIEW_HEIGHT = 298;

// zoomed in grid sizes
const MAP_GRID_ZOOM_X = MAP_GRID_X * 2;
const MAP_GRID_ZOOM_Y = MAP_GRID_Y * 2;

// number of units wide
const WORLD_MAP_X = 18;

// dirty regions for the map
const DMAP_GRID_X = (MAP_GRID_X + 1);
const DMAP_GRID_Y = (MAP_GRID_Y + 1);
const DMAP_GRID_ZOOM_X = (MAP_GRID_ZOOM_X + 1);
const DMAP_GRID_ZOOM_Y = (MAP_GRID_ZOOM_Y + 1);

// Orta position on the map
const ORTA_SECTOR_X = 4;
const ORTA_SECTOR_Y = 11;

const TIXA_SECTOR_X = 9;
const TIXA_SECTOR_Y = 10;

// what are we showing?..teams/vehicles
// Show values
const SHOW_TEAMMATES = 1;
const SHOW_VEHICLES = 2;

// wait time until temp path is drawn, from placing cursor on a map grid
const MIN_WAIT_TIME_FOR_TEMP_PATH = 200;

// zoom UL coords
extern INT32 iZoomX;
extern INT32 iZoomY;

// the number of militia on the cursor
extern INT16 sGreensOnCursor;
extern INT16 sRegularsOnCursor;
extern INT16 sElitesOnCursor;

// highlighted sectors
extern INT16 gsHighlightSectorX;
extern INT16 gsHighlightSectorY;

// the big map
extern UINT32 guiBIGMAP;

// the orta icon
extern UINT32 guiORTAICON;

extern UINT32 guiTIXAICON;

// the character icons
extern UINT32 guiCHARICONS;

// the merc arrival sector landing zone icon
UINT32 guiBULLSEYE;

// character between sector icons
extern UINT32 guiCHARBETWEENSECTORICONS;
extern UINT32 guiCHARBETWEENSECTORICONSCLOSE;

// the viewable map bound region
extern SGPRect MapScreenRect;

// draw temp path
extern BOOLEAN fDrawTempHeliPath;

// selected destination char
extern INT8 bSelectedDestChar;

// current assignment character
extern INT8 bSelectedAssignChar;

// the info character
extern INT8 bSelectedInfoChar;

// the contract char
extern INT8 bSelectedContractChar;

// map arrows graphical index value
extern UINT32 guiMAPCURSORS;

// has temp path for character path or helicopter been already drawn
extern BOOLEAN fTempPathAlreadyDrawn;

// map view region clipping rect
extern SGPRect MapScreenRect;

// the map border eta pop up
extern UINT32 guiMapBorderEtaPopUp;

// heli pop up
extern UINT32 guiMapBorderHeliSectors;

// the currently selected town militia
extern INT16 sSelectedMilitiaTown;

// the selected sectors
extern UINT16 sSelMapX;
extern UINT16 sSelMapY;

extern BOOLEAN fFoundTixa;

extern UINT32 guiSubLevel1, guiSubLevel2, guiSubLevel3;
