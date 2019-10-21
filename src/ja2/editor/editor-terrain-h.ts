const TERRAIN_TILES_NODRAW = 0;
const TERRAIN_TILES_FOREGROUND = 1;
const TERRAIN_TILES_BACKGROUND = 2;
// Andrew, could you figure out what the hell mode this is???
// It somehow links terrain tiles with lights and buildings.
const TERRAIN_TILES_BRETS_STRANGEMODE = 3;

// Soon to be added to an editor struct
extern UINT16 usTotalWeight;
extern BOOLEAN fPrevShowTerrainTileButtons;
extern BOOLEAN fUseTerrainWeights;
extern INT32 TerrainTileSelected, TerrainForegroundTile, TerrainBackgroundTile;
extern INT32 TerrainTileDrawMode;
