type TILESET_CALLBACK = () => void;

interface TILESET {
  zName: INT16[] /* [32] */;
  TileSurfaceFilenames: CHAR8[][] /* [NUMBEROFTILETYPES][32] */;
  ubAmbientID: UINT8;
  MovementCostFnc: TILESET_CALLBACK;
}

extern TILESET gTilesets[NUM_TILESETS];

void InitEngineTilesets();

// THESE FUNCTIONS WILL SET TERRAIN VALUES - CALL ONE FOR EACH TILESET
void SetTilesetOneTerrainValues();
void SetTilesetTwoTerrainValues();
