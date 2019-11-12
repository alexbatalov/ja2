namespace ja2 {

export const WORLD_TILE_X = 40;
export const WORLD_TILE_Y = 20;
export const WORLD_COLS = 160;
export const WORLD_ROWS = 160;
export const WORLD_COORD_COLS = 1600;
export const WORLD_COORD_ROWS = 1600;
export const WORLD_MAX = 25600;
export const CELL_X_SIZE = 10;
export const CELL_Y_SIZE = 10;

const WORLD_BASE_HEIGHT = 0;
export const WORLD_CLIFF_HEIGHT = 80;

// A macro that actually memcpy's over data and increments the pointer automatically
// based on the size.  Works like a FileRead except with a buffer instead of a file pointer.
// Used by LoadWorld() and child functions.
export const LOADDATA = (dst, src, size) => {
  memcpy(dst, src, size);
  src += size;
}

export const LANDHEAD = 0;
export const MAXDIR = 8;

// Defines for shade levels
export const MIN_SHADE_LEVEL = 4;
export const MAX_SHADE_LEVEL = 15;

// DEFINES FOR LEVELNODE FLAGS
export const LEVELNODE_SOLDIER = 0x00000001;
const LEVELNODE_UNUSED2 = 0x00000002;
export const LEVELNODE_MERCPLACEHOLDER = 0x00000004;
export const LEVELNODE_SHOW_THROUGH = 0x00000008;
export const LEVELNODE_NOZBLITTER = 0x00000010;
export const LEVELNODE_CACHEDANITILE = 0x00000020;
export const LEVELNODE_ROTTINGCORPSE = 0x00000040;
export const LEVELNODE_BUDDYSHADOW = 0x00000080;
export const LEVELNODE_HIDDEN = 0x00000100;
export const LEVELNODE_USERELPOS = 0x00000200;
export const LEVELNODE_DISPLAY_AP = 0x00000400;
export const LEVELNODE_ANIMATION = 0x00000800;
export const LEVELNODE_USEABSOLUTEPOS = 0x00001000;
export const LEVELNODE_REVEAL = 0x00002000;
export const LEVELNODE_REVEALTREES = 0x00004000;
export const LEVELNODE_USEBESTTRANSTYPE = 0x00008000;
export const LEVELNODE_USEZ = 0x00010000;
export const LEVELNODE_DYNAMICZ = 0x00020000;
export const LEVELNODE_UPDATESAVEBUFFERONCE = 0x00040000;
export const LEVELNODE_ERASEZ = 0x00080000;
export const LEVELNODE_WIREFRAME = 0x00100000;
export const LEVELNODE_ITEM = 0x00200000;
export const LEVELNODE_IGNOREHEIGHT = 0x00400000;
export const LEVELNODE_DYNAMIC = 0x02000000;
export const LEVELNODE_LASTDYNAMIC = 0x04000000;
export const LEVELNODE_PHYSICSOBJECT = 0x08000000;
export const LEVELNODE_NOWRITEZ = 0x10000000;
const LEVELNODE_MULTITILESOLDIER = 0x20000000;
export const LEVELNODE_EXITGRID = 0x40000000;
export const LEVELNODE_CAVE = 0x80000000;

// THE FIRST FEW ( 4 ) bits are flags which are saved in the world
export const MAPELEMENT_REDUNDENT = 0x0001;
export const MAPELEMENT_REEVALUATE_REDUNDENCY = 0x0002;
export const MAPELEMENT_ENEMY_MINE_PRESENT = 0x0004;
export const MAPELEMENT_PLAYER_MINE_PRESENT = 0x0008;
export const MAPELEMENT_STRUCTURE_DAMAGED = 0x0010;
export const MAPELEMENT_REEVALUATEBLOOD = 0x0020;
export const MAPELEMENT_INTERACTIVETILE = 0x0040;
export const MAPELEMENT_RAISE_LAND_START = 0x0080;
export const MAPELEMENT_REVEALED = 0x0100;
export const MAPELEMENT_RAISE_LAND_END = 0x0200;
export const MAPELEMENT_REDRAW = 0x0400;
export const MAPELEMENT_REVEALED_ROOF = 0x0800;
export const MAPELEMENT_MOVEMENT_RESERVED = 0x1000;
export const MAPELEMENT_RECALCULATE_WIREFRAMES = 0x2000;
export const MAPELEMENT_ITEMPOOL_PRESENT = 0x4000;
export const MAPELEMENT_REACHABLE = 0x8000;

export const MAPELEMENT_EXT_SMOKE = 0x01;
export const MAPELEMENT_EXT_TEARGAS = 0x02;
export const MAPELEMENT_EXT_MUSTARDGAS = 0x04;
export const MAPELEMENT_EXT_DOOR_STATUS_PRESENT = 0x08;
export const MAPELEMENT_EXT_RECALCULATE_MOVEMENT = 0x10;
export const MAPELEMENT_EXT_NOBURN_STRUCT = 0x20;
export const MAPELEMENT_EXT_ROOFCODE_VISITED = 0x40;
export const MAPELEMENT_EXT_CREATUREGAS = 0x80;

export const FIRST_LEVEL = 0;
export const SECOND_LEVEL = 1;

export const ANY_SMOKE_EFFECT = (MAPELEMENT_EXT_CREATUREGAS | MAPELEMENT_EXT_SMOKE | MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS);

export interface LEVELNODE {
  pNext: Pointer<LEVELNODE>;
  uiFlags: UINT32; // flags struct

  ubSumLights: UINT8; // LIGHTING INFO
  ubMaxLights: UINT8; // MAX LIGHTING INFO

  /* union { */
  pPrevNode: Pointer<LEVELNODE>; // FOR LAND, GOING BACKWARDS POINTER
  pStructureData: Pointer<STRUCTURE>; // STRUCTURE DATA
  iPhysicsObjectID: INT32; // ID FOR PHYSICS ITEM
  uiAPCost: INT32; // FOR AP DISPLAY
  iExitGridInfo: INT32;
  /* } */
  /* union { */
  /*   struct { */
  usIndex: UINT16; // TILE DATABASE INDEX
  sCurrentFrame: INT16; // Stuff for animated tiles for a given tile location ( doors, etc )
  /*   } */
  pSoldier: Pointer<SOLDIERTYPE>; // POINTER TO SOLDIER
  /* } */
  /* union { */
  /*   struct { */
  sRelativeX: INT16; // Relative position values
  sRelativeY: INT16; // Relative position values
  /*   } */
  /*   struct { */
  iCorpseID: INT32; // Index into corpse ID
  /*   } */
  /*   struct { */
  uiAnimHitLocationFlags: UINT32; // Animation profile flags for soldier placeholders ( prone merc hit location values )
  /*   } */
  /*   struct { */
  pAniTile: Pointer<ANITILE>;
  /*   } */
  /*   struct { */
  pItemPool: Pointer<ITEM_POOL>; // ITEM POOLS
  /*   } */
  /* } */
  sRelativeZ: INT16; // Relative position values
  ubShadeLevel: UINT8; // LIGHTING INFO
  ubNaturalShadeLevel: UINT8; // LIGHTING INFO
  ubFakeShadeLevel: UINT8; // LIGHTING INFO
}

export const LAND_START_INDEX = 1;
export const OBJECT_START_INDEX = 2;
export const STRUCT_START_INDEX = 3;
export const SHADOW_START_INDEX = 4;
export const MERC_START_INDEX = 5;
export const ROOF_START_INDEX = 6;
export const ONROOF_START_INDEX = 7;
export const TOPMOST_START_INDEX = 8;

export interface MAP_ELEMENT {
  /* union { */
  /*   struct { */
  pLandHead: Pointer<LEVELNODE>; // 0
  pLandStart: Pointer<LEVELNODE>; // 1

  pObjectHead: Pointer<LEVELNODE>; // 2

  pStructHead: Pointer<LEVELNODE>; // 3

  pShadowHead: Pointer<LEVELNODE>; // 4

  pMercHead: Pointer<LEVELNODE>; // 5

  pRoofHead: Pointer<LEVELNODE>; // 6

  pOnRoofHead: Pointer<LEVELNODE>; // 7

  pTopmostHead: Pointer<LEVELNODE>; // 8
  /*   } */
  pLevelNodes: Pointer<LEVELNODE>[] /* [9] */;
  /* } */
  pStructureHead: Pointer<STRUCTURE>;
  pStructureTail: Pointer<STRUCTURE>;

  uiFlags: UINT16;
  ubExtFlags: UINT8[] /* [2] */;
  sSumRealLights: UINT16[] /* [1] */;
  sHeight: UINT8;
  ubAdjacentSoldierCnt: UINT8;
  ubTerrainID: UINT8;

  ubReservedSoldierID: UINT8;
  ubBloodInfo: UINT8;
  ubSmellInfo: UINT8;
}

}
