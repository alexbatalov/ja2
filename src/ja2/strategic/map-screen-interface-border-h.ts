const MAP_BORDER_START_X = 261;
const MAP_BORDER_START_Y = 0;

// scroll directions
const enum Enum139 {
  ZOOM_MAP_SCROLL_UP = 0,
  ZOOM_MAP_SCROLL_DWN,
  ZOOM_MAP_SCROLL_RIGHT,
  ZOOM_MAP_SCROLL_LEFT,
}

const enum Enum140 {
  EAST_DIR = 0,
  WEST_DIR,
  NORTH_DIR,
  SOUTH_DIR,
}
const enum Enum141 {
  MAP_BORDER_TOWN_BTN = 0,
  MAP_BORDER_MINE_BTN,
  MAP_BORDER_TEAMS_BTN,
  MAP_BORDER_AIRSPACE_BTN,
  MAP_BORDER_ITEM_BTN,
  MAP_BORDER_MILITIA_BTN,
}

/*
enum{
        MAP_BORDER_RAISE_LEVEL=0,
        MAP_BORDER_LOWER_LEVEL,
};
*/

const MAP_LEVEL_MARKER_X = 565;
const MAP_LEVEL_MARKER_Y = 323;
const MAP_LEVEL_MARKER_DELTA = 8;
const MAP_LEVEL_MARKER_WIDTH = (620 - MAP_LEVEL_MARKER_X);

// extern BOOLEAN fShowVehicleFlag;

// extern BOOLEAN fMapScrollDueToPanelButton;
// extern BOOLEAN fCursorIsOnMapScrollButtons;
// extern BOOLEAN fDisabledMapBorder;

// void RenderMapBorderCorner( void );
// void ShowDestinationOfPlottedPath( STR16 pLoc );
// void ResetAircraftButton( void );
// void HandleMapScrollButtonStates( void );

/*
// enable disable map border
void DisableMapBorderRegion( void );
void EnableMapBorderRegion( void );
*/

// void UpdateLevelButtonStates( void );
