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

BOOLEAN InitTileCache();
void DeleteTileCache();

INT32 GetCachedTile(INT8 *cFilename);
BOOLEAN RemoveCachedTile(INT32 iCachedTile);

STRUCTURE_FILE_REF *GetCachedTileStructureRefFromFilename(INT8 *cFilename);

HVOBJECT GetCachedTileVideoObject(INT32 iIndex);
STRUCTURE_FILE_REF *GetCachedTileStructureRef(INT32 iIndex);
void CheckForAndAddTileCacheStructInfo(LEVELNODE *pNode, INT16 sGridNo, UINT16 usIndex, UINT16 usSubIndex);
void CheckForAndDeleteTileCacheStructInfo(LEVELNODE *pNode, UINT16 usIndex);
void GetRootName(INT8 *pDestStr, INT8 *pSrcStr);

// OF COURSE, FOR SPEED, WE EXPORT OUR ARRAY
// ACCESS FUNCTIONS IN RENDERER IS NOT TOO NICE
// ATE
