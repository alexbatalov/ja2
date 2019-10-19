// CATEGORY TYPES
const NO_TILE = 64000;
const ERASE_TILE = 65000;
const REQUIRES_SMOOTHING_TILE = 19;
const NUM_WALL_ORIENTATIONS = 40;

const WALL_TILE = 0x00000001;
const ANIMATED_TILE = 0x00000002;
const DYNAMIC_TILE = 0x00000004;
const IGNORE_WORLD_HEIGHT = 0x00000008;
const ROAD_TILE = 0x00000010;
const FULL3D_TILE = 0x00000020;
const MULTI_Z_TILE = 0x00000080;
const OBJECTLAYER_USEZHEIGHT = 0x00000100;
const ROOFSHADOW_TILE = 0x00000200;
const ROOF_TILE = 0x00000400;
const TRANSLUCENT_TILE = 0x00000800;
const HAS_SHADOW_BUDDY = 0x00001000;
const AFRAME_TILE = 0x00002000;
const HIDDEN_TILE = 0x00004000;
const CLIFFHANG_TILE = 0x00008000;
const UNDERFLOW_FILLER = 0x00010000;

const MAX_ANIMATED_TILES = 200;
const WALL_HEIGHT = 50;

// Kris:  Added the last two bottom corner orientation values.  This won't effect
// current code, but there is new code that makes use of this.  A function called
// UINT8 CalculateWallOrientationsAtGridNo( INT32 iMapIndex ) that will look at all
// of the walls and return the last two wall orientations for tiles with two proper
// wall pieces.
const enum Enum314 {
  NO_ORIENTATION,
  INSIDE_TOP_LEFT,
  INSIDE_TOP_RIGHT,
  OUTSIDE_TOP_LEFT,
  OUTSIDE_TOP_RIGHT,
  INSIDE_BOTTOM_CORNER,
  OUTSIDE_BOTTOM_CORNER,
}

// TERRAIN ID VALUES.
const enum Enum315 {
  NO_TERRAIN,
  FLAT_GROUND,
  FLAT_FLOOR,
  PAVED_ROAD,
  DIRT_ROAD,
  LOW_GRASS,
  HIGH_GRASS,
  TRAIN_TRACKS,
  LOW_WATER,
  MED_WATER,
  DEEP_WATER,
  NUM_TERRAIN_TYPES,
}

// These structures are placed in a list and used for all tile imagery
typedef struct {
  HVOBJECT vo;
  UINT32 fType;
  AuxObjectData *pAuxData;
  RelTileLoc *pTileLocData;
  STRUCTURE_FILE_REF *pStructureFileRef;
  UINT8 ubTerrainID;
  BYTE bRaisedObjectType;

  // Reserved for added room and 32-byte boundaries
  BYTE bReserved[2];
} TILE_IMAGERY, *PTILE_IMAGERY;

typedef struct {
  UINT16 *pusFrames;
  INT8 bCurrentFrame;
  UINT8 ubNumFrames;
} TILE_ANIMATION_DATA;

// Tile data element
typedef struct {
  UINT16 fType;
  HVOBJECT hTileSurface;
  DB_STRUCTURE_REF *pDBStructureRef;
  UINT32 uiFlags;
  RelTileLoc *pTileLocData;
  UINT16 usRegionIndex;
  INT16 sBuddyNum;
  UINT8 ubTerrainID;
  UINT8 ubNumberOfTiles;

  UINT8 bZOffsetX;
  UINT8 bZOffsetY;

  // This union contains different data based on tile type
  union {
    // Land and overlay type
    struct {
      INT16 sOffsetHeight;
      UINT16 usWallOrientation;
      UINT8 ubFullTile;

      // For animated tiles
      TILE_ANIMATION_DATA *pAnimData;
    };
  };

  // Reserved for added room and 32-byte boundaries
  BYTE bReserved[3];
} TILE_ELEMENT, *PTILE_ELEMENT;

typedef struct {
  INT32 iMapIndex;
  UINT8 ubNumLayers;
  UINT16 *pIndexValues;
} land_undo_struct;

// Globals used
TILE_ELEMENT gTileDatabase[NUMBEROFTILES];
UINT16 gTileDatabaseSize;
UINT8 gFullBaseTileValues[];
UINT16 gNumTilesPerType[NUMBEROFTILETYPES];
UINT16 gTileTypeStartIndex[NUMBEROFTILETYPES];
STR gTileSurfaceName[NUMBEROFTILETYPES];
UINT8 gTileTypeLogicalHeight[NUMBEROFTILETYPES];

UINT16 gusNumAnimatedTiles;
UINT16 gusAnimatedTiles[MAX_ANIMATED_TILES];
UINT8 gTileTypeMovementCost[NUM_TERRAIN_TYPES];

void CreateTileDatabase();

// Land level manipulation functions
BOOLEAN GetLandHeadType(INT32 iMapIndex, UINT32 *puiType);

BOOLEAN SetLandIndex(INT32 iMapIndex, UINT16 usIndex, UINT32 uiNewType, BOOLEAN fDelete);

BOOLEAN GetTypeLandLevel(UINT32 iMapIndex, UINT32 uiNewType, UINT8 *pubLevel);
UINT8 GetLandLevelDepth(UINT32 iMapIndex);

BOOLEAN SetLandIndexWithRadius(INT32 iMapIndex, UINT16 usIndex, UINT32 uiNewType, UINT8 ubRadius, BOOLEAN fReplace);

BOOLEAN LandTypeHeigher(UINT32 uiDestType, UINT32 uiSrcType);

BOOLEAN MoveLandIndexToTop(UINT32 iMapIndex, UINT16 usIndex);

// Database access functions
BOOLEAN GetSubIndexFromTileIndex(UINT16 usIndex, UINT16 *pusSubIndex);
BOOLEAN GetTypeSubIndexFromTileIndex(UINT32 uiCheckType, UINT16 usIndex, UINT16 *pusSubIndex);
BOOLEAN GetTypeSubIndexFromTileIndexChar(UINT32 uiCheckType, UINT16 usIndex, UINT8 *pusSubIndex);
BOOLEAN GetTileIndexFromTypeSubIndex(UINT32 uiCheckType, UINT16 usSubIndex, UINT16 *pusTileIndex);
BOOLEAN GetTileType(UINT16 usIndex, UINT32 *puiType);
BOOLEAN GetTileFlags(UINT16 usIndex, UINT32 *puiFlags);

BOOLEAN GetTileTypeLogicalHeight(UINT32 fType, UINT8 *pubLogHeight);
BOOLEAN AnyHeigherLand(UINT32 iMapIndex, UINT32 uiSrcType, UINT8 *pubLastLevel);
BOOLEAN AnyLowerLand(UINT32 iMapIndex, UINT32 uiSrcType, UINT8 *pubLastLevel);
BOOLEAN GetWallOrientation(UINT16 usIndex, UINT16 *pusWallOrientation);
BOOLEAN ContainsWallOrientation(INT32 iMapIndex, UINT32 uiType, UINT16 usWallOrientation, UINT8 *pubLevel);
UINT8 CalculateWallOrientationsAtGridNo(INT32 iMapIndex);

void SetSpecificDatabaseValues(UINT16 usType, UINT16 uiDatabaseElem, TILE_ELEMENT *TileElement, BOOLEAN fUseRaisedObjectType);

BOOLEAN AllocateAnimTileData(TILE_ELEMENT *pTileElem, UINT8 ubNumFrames);
void FreeAnimTileData(TILE_ELEMENT *pTileElem);
void DeallocateTileDatabase();
