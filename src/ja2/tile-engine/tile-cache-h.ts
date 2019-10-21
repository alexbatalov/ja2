const TILE_CACHE_START_INDEX = 36000;

interface TILE_CACHE_ELEMENT {
  zName: CHAR8[] /* [128] */; // Name of tile ( filename and directory here )
  zRootName: CHAR8[] /* [30] */; // Root name
  pImagery: Pointer<TILE_IMAGERY>; // Tile imagery
  sHits: INT16;
  ubNumFrames: UINT8;
  sStructRefID: INT16;
}

interface TILE_CACHE_STRUCT {
  Filename: CHAR8[] /* [150] */;
  zRootName: CHAR8[] /* [30] */; // Root name
  pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
}

TILE_CACHE_ELEMENT *gpTileCache;

// OF COURSE, FOR SPEED, WE EXPORT OUR ARRAY
// ACCESS FUNCTIONS IN RENDERER IS NOT TOO NICE
// ATE
