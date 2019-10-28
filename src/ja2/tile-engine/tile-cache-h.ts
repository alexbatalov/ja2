namespace ja2 {

export const TILE_CACHE_START_INDEX = 36000;

export interface TILE_CACHE_ELEMENT {
  zName: string /* CHAR8[128] */; // Name of tile ( filename and directory here )
  zRootName: string /* CHAR8[30] */; // Root name
  pImagery: Pointer<TILE_IMAGERY>; // Tile imagery
  sHits: INT16;
  ubNumFrames: UINT8;
  sStructRefID: INT16;
}

export interface TILE_CACHE_STRUCT {
  Filename: string /* CHAR8[150] */;
  zRootName: string /* CHAR8[30] */; // Root name
  pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
}

// OF COURSE, FOR SPEED, WE EXPORT OUR ARRAY
// ACCESS FUNCTIONS IN RENDERER IS NOT TOO NICE
// ATE

}
