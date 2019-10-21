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
interface TILE_IMAGERY {
  vo: HVOBJECT;
  fType: UINT32;
  pAuxData: Pointer<AuxObjectData>;
  pTileLocData: Pointer<RelTileLoc>;
  pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
  ubTerrainID: UINT8;
  bRaisedObjectType: BYTE;

  // Reserved for added room and 32-byte boundaries
  bReserved: BYTE[] /* [2] */;
}

type PTILE_IMAGERY = Pointer<TILE_IMAGERY>;

interface TILE_ANIMATION_DATA {
  pusFrames: Pointer<UINT16>;
  bCurrentFrame: INT8;
  ubNumFrames: UINT8;
}

// Tile data element
interface TILE_ELEMENT {
  fType: UINT16;
  hTileSurface: HVOBJECT;
  pDBStructureRef: Pointer<DB_STRUCTURE_REF>;
  uiFlags: UINT32;
  pTileLocData: Pointer<RelTileLoc>;
  usRegionIndex: UINT16;
  sBuddyNum: INT16;
  ubTerrainID: UINT8;
  ubNumberOfTiles: UINT8;

  bZOffsetX: UINT8;
  bZOffsetY: UINT8;

  /* union { */
  /*   struct { */
  sOffsetHeight: INT16;
  usWallOrientation: UINT16;
  ubFullTile: UINT8;

  // For animated tiles
  pAnimData: Pointer<TILE_ANIMATION_DATA>;
  /*   } */
  /* } */
  // Reserved for added room and 32-byte boundaries
  bReserved: BYTE[] /* [3] */;
}

type PTILE_ELEMENT = Pointer<TILE_ELEMENT>;

interface land_undo_struct {
  iMapIndex: INT32;
  ubNumLayers: UINT8;
  pIndexValues: Pointer<UINT16>;
}

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
