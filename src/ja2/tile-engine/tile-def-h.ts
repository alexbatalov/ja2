namespace ja2 {

// CATEGORY TYPES
export const NO_TILE = 64000;
export const ERASE_TILE = 65000;
export const REQUIRES_SMOOTHING_TILE = 19;
const NUM_WALL_ORIENTATIONS = 40;

export const WALL_TILE = 0x00000001;
export const ANIMATED_TILE = 0x00000002;
export const DYNAMIC_TILE = 0x00000004;
export const IGNORE_WORLD_HEIGHT = 0x00000008;
export const ROAD_TILE = 0x00000010;
export const FULL3D_TILE = 0x00000020;
export const MULTI_Z_TILE = 0x00000080;
export const OBJECTLAYER_USEZHEIGHT = 0x00000100;
export const ROOFSHADOW_TILE = 0x00000200;
export const ROOF_TILE = 0x00000400;
const TRANSLUCENT_TILE = 0x00000800;
export const HAS_SHADOW_BUDDY = 0x00001000;
export const AFRAME_TILE = 0x00002000;
export const HIDDEN_TILE = 0x00004000;
export const CLIFFHANG_TILE = 0x00008000;
export const UNDERFLOW_FILLER = 0x00010000;

export const MAX_ANIMATED_TILES = 200;
export const WALL_HEIGHT = 50;

// Kris:  Added the last two bottom corner orientation values.  This won't effect
// current code, but there is new code that makes use of this.  A function called
// UINT8 CalculateWallOrientationsAtGridNo( INT32 iMapIndex ) that will look at all
// of the walls and return the last two wall orientations for tiles with two proper
// wall pieces.
export const enum Enum314 {
  NO_ORIENTATION,
  INSIDE_TOP_LEFT,
  INSIDE_TOP_RIGHT,
  OUTSIDE_TOP_LEFT,
  OUTSIDE_TOP_RIGHT,
  INSIDE_BOTTOM_CORNER,
  OUTSIDE_BOTTOM_CORNER,
}

// TERRAIN ID VALUES.
export const enum Enum315 {
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
export interface TILE_IMAGERY {
  vo: SGPVObject;
  fType: UINT32;
  pAuxData: AuxObjectData[] | null /* Pointer<AuxObjectData> */;
  pTileLocData: RelTileLoc[] | null /* Pointer<RelTileLoc> */;
  pStructureFileRef: STRUCTURE_FILE_REF | null /* Pointer<STRUCTURE_FILE_REF> */;
  ubTerrainID: UINT8;
  bRaisedObjectType: boolean /* BYTE */;

  // Reserved for added room and 32-byte boundaries
  bReserved: BYTE[] /* [2] */;
}

export function createTileImagery(): TILE_IMAGERY {
  return {
    vo: <SGPVObject><unknown>null,
    fType: 0,
    pAuxData: null,
    pTileLocData: null,
    pStructureFileRef: null,
    ubTerrainID: 0,
    bRaisedObjectType: false,
    bReserved: createArray(2, 0),
  };
}

export interface TILE_ANIMATION_DATA {
  pusFrames: UINT16[] /* Pointer<UINT16> */;
  bCurrentFrame: INT8;
  ubNumFrames: UINT8;
}

export function createTileAnimationData(): TILE_ANIMATION_DATA {
  return {
    pusFrames: <UINT16[]><unknown>null,
    bCurrentFrame: 0,
    ubNumFrames: 0,
  };
}

// Tile data element
export interface TILE_ELEMENT {
  fType: UINT16;
  hTileSurface: SGPVObject;
  pDBStructureRef: DB_STRUCTURE_REF | null /* Pointer<DB_STRUCTURE_REF> */;
  uiFlags: UINT32;
  pTileLocData: RelTileLoc[] | null /* Pointer<RelTileLoc> */;
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
  pAnimData: TILE_ANIMATION_DATA | null /* Pointer<TILE_ANIMATION_DATA> */;
  /*   } */
  /* } */
  // Reserved for added room and 32-byte boundaries
  bReserved: BYTE[] /* [3] */;
}

export function createTileElement(): TILE_ELEMENT {
  return {
    fType: 0,
    hTileSurface: <SGPVObject><unknown>null,
    pDBStructureRef: null,
    uiFlags: 0,
    pTileLocData: null,
    usRegionIndex: 0,
    sBuddyNum: 0,
    ubTerrainID: 0,
    ubNumberOfTiles: 0,
    bZOffsetX: 0,
    bZOffsetY: 0,
    sOffsetHeight: 0,
    usWallOrientation: 0,
    ubFullTile: 0,
    pAnimData: null,
    bReserved: createArray(3, 0),
  };
}

export function resetTileElement(o: TILE_ELEMENT) {
  o.fType = 0;
  o.hTileSurface = <SGPVObject><unknown>null;
  o.pDBStructureRef = null;
  o.uiFlags = 0;
  o.pTileLocData = null;
  o.usRegionIndex = 0;
  o.sBuddyNum = 0;
  o.ubTerrainID = 0;
  o.ubNumberOfTiles = 0;
  o.bZOffsetX = 0;
  o.bZOffsetY = 0;
  o.sOffsetHeight = 0;
  o.usWallOrientation = 0;
  o.ubFullTile = 0;
  o.pAnimData = null;
  o.bReserved.fill(0);
}

export const TILE_ELEMENT_SIZE = 44;

}
