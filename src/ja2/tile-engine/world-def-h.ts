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
  pNext: LEVELNODE | null;
  uiFlags: UINT32; // flags struct

  ubSumLights: UINT8; // LIGHTING INFO
  ubMaxLights: UINT8; // MAX LIGHTING INFO

  /* union { */
  pPrevNode: LEVELNODE | null; // FOR LAND, GOING BACKWARDS POINTER
  pStructureData: STRUCTURE | null; // STRUCTURE DATA
  iPhysicsObjectID: INT32; // ID FOR PHYSICS ITEM
  uiAPCost: INT32; // FOR AP DISPLAY
  iExitGridInfo: INT32;
  /* } */
  /* union { */
  /*   struct { */
  usIndex: UINT16; // TILE DATABASE INDEX
  sCurrentFrame: INT16; // Stuff for animated tiles for a given tile location ( doors, etc )
  /*   } */
  pSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */; // POINTER TO SOLDIER
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
  pAniTile: ANITILE /* Pointer<ANITILE> */;
  /*   } */
  /*   struct { */
  pItemPool: ITEM_POOL /* Pointer<ITEM_POOL> */; // ITEM POOLS
  /*   } */
  /* } */
  sRelativeZ: INT16; // Relative position values
  ubShadeLevel: UINT8; // LIGHTING INFO
  ubNaturalShadeLevel: UINT8; // LIGHTING INFO
  ubFakeShadeLevel: UINT8; // LIGHTING INFO
}

export function createLevelNode(): LEVELNODE {
  return {
    pNext: null,
    uiFlags: 0,
    ubSumLights: 0,
    ubMaxLights: 0,
    pPrevNode: null,
    pStructureData: null,
    iPhysicsObjectID: 0,
    uiAPCost: 0,
    iExitGridInfo: 0,
    usIndex: 0,
    sCurrentFrame: 0,
    pSoldier: <SOLDIERTYPE><unknown>null,
    sRelativeX: 0,
    sRelativeY: 0,
    iCorpseID: 0,
    uiAnimHitLocationFlags: 0,
    pAniTile: <ANITILE><unknown>null,
    pItemPool: <ITEM_POOL><unknown>null,
    sRelativeZ: 0,
    ubShadeLevel: 0,
    ubNaturalShadeLevel: 0,
    ubFakeShadeLevel: 0,
  };
}

export const LEVEL_NODE_SIZE = 32;

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
  pLandHead: LEVELNODE | null; // 0
  pLandStart: LEVELNODE | null; // 1

  pObjectHead: LEVELNODE | null; // 2

  pStructHead: LEVELNODE | null; // 3

  pShadowHead: LEVELNODE | null; // 4

  pMercHead: LEVELNODE | null; // 5

  pRoofHead: LEVELNODE | null; // 6

  pOnRoofHead: LEVELNODE | null; // 7

  pTopmostHead: LEVELNODE | null; // 8
  /*   } */
  pLevelNodes: (LEVELNODE | null)[] /* [9] */;
  /* } */
  pStructureHead: STRUCTURE | null;
  pStructureTail: STRUCTURE | null;

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

class _MAP_ELEMENT implements MAP_ELEMENT {
  public pLevelNodes: (LEVELNODE | null)[] /* [9] */;
  public pStructureHead: STRUCTURE | null;
  public pStructureTail: STRUCTURE | null;
  public uiFlags: UINT16;
  public ubExtFlags: UINT8[] /* [2] */;
  public sSumRealLights: UINT16[] /* [1] */;
  public sHeight: UINT8;
  public ubAdjacentSoldierCnt: UINT8;
  public ubTerrainID: UINT8;
  public ubReservedSoldierID: UINT8;
  public ubBloodInfo: UINT8;
  public ubSmellInfo: UINT8;

  constructor() {
    this.pLevelNodes = createArray(9, null);
    this.pStructureHead = null;
    this.pStructureTail = null;
    this.uiFlags = 0;
    this.ubExtFlags = createArray(2, 0);
    this.sSumRealLights = createArray(1, 0);
    this.sHeight = 0;
    this.ubAdjacentSoldierCnt = 0;
    this.ubTerrainID = 0;
    this.ubReservedSoldierID = 0;
    this.ubBloodInfo = 0;
    this.ubSmellInfo = 0;
  }

  get pLandHead() {
    return this.pLevelNodes[0];
  }

  set pLandHead(value) {
    this.pLevelNodes[0] = value;
  }

  get pLandStart() {
    return this.pLevelNodes[1];
  }

  set pLandStart(value) {
    this.pLevelNodes[1] = value;
  }

  get pObjectHead() {
    return this.pLevelNodes[2];
  }

  set pObjectHead(value) {
    this.pLevelNodes[2] = value;
  }

  get pStructHead() {
    return this.pLevelNodes[3];
  }

  set pStructHead(value) {
    this.pLevelNodes[3] = value;
  }

  get pShadowHead() {
    return this.pLevelNodes[4];
  }

  set pShadowHead(value) {
    this.pLevelNodes[4] = value;
  }

  get pMercHead() {
    return this.pLevelNodes[5];
  }

  set pMercHead(value) {
    this.pLevelNodes[5] = value;
  }

  get pRoofHead() {
    return this.pLevelNodes[6];
  }

  set pRoofHead(value) {
    this.pLevelNodes[6] = value;
  }

  get pOnRoofHead() {
    return this.pLevelNodes[7];
  }

  set pOnRoofHead(value) {
    this.pLevelNodes[7] = value;
  }

  get pTopmostHead() {
    return this.pLevelNodes[8];
  }

  set pTopmostHead(value) {
    this.pLevelNodes[8] = value;
  }
}

export function createMapElement(): MAP_ELEMENT {
  return new _MAP_ELEMENT();
}

export function resetMapElement(o: MAP_ELEMENT) {
  o.pLevelNodes.fill(null);
  o.pStructureHead = null;
  o.pStructureTail = null;
  o.uiFlags = 0;
  o.ubExtFlags.fill(0);
  o.sSumRealLights.fill(0);
  o.sHeight = 0;
  o.ubAdjacentSoldierCnt = 0;
  o.ubTerrainID = 0;
  o.ubReservedSoldierID = 0;
  o.ubBloodInfo = 0;
  o.ubSmellInfo = 0;
}

}
