namespace ja2 {

export const TILE_CACHE_START_INDEX = 36000;

export interface TILE_CACHE_ELEMENT {
  zName: string /* CHAR8[128] */; // Name of tile ( filename and directory here )
  zRootName: string /* CHAR8[30] */; // Root name
  pImagery: TILE_IMAGERY | null; // Tile imagery
  sHits: INT16;
  ubNumFrames: UINT8;
  sStructRefID: INT16;
}

export function createTileCacheElement(): TILE_CACHE_ELEMENT {
  return {
    zName: '',
    zRootName: '',
    pImagery: null,
    sHits: 0,
    ubNumFrames: 0,
    sStructRefID: 0,
  };
}

export interface TILE_CACHE_STRUCT {
  Filename: string /* CHAR8[150] */;
  zRootName: string /* CHAR8[30] */; // Root name
  pStructureFileRef: STRUCTURE_FILE_REF | null;
}

export function createTileCacheStruct(): TILE_CACHE_STRUCT {
  return {
    Filename: '',
    zRootName: '',
    pStructureFileRef: null,
  };
}

// OF COURSE, FOR SPEED, WE EXPORT OUR ARRAY
// ACCESS FUNCTIONS IN RENDERER IS NOT TOO NICE
// ATE

}
