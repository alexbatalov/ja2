namespace ja2 {

/****************************************************************************************
 * JA2 Lighting Module
 *
 *		Tile-based, ray-casted lighting system.
 *
 *		Lights are precalculated into linked lists containing offsets from 0,0, and a light
 * level to add at that tile. Lists are constructed by casting a ray from the origin of
 * the light, and each tile stopped at is stored as a node in the list. To draw the light
 * during runtime, you traverse the list, checking at each tile that it isn't of the type
 * that can obscure light. If it is, you keep traversing the list until you hit a node
 * with a marker LIGHT_NEW_RAY, which means you're back at the origin, and have skipped
 * the remainder of the last ray.
 *
 * Written by Derek Beland, April 14, 1997
 *
 ***************************************************************************************/
const LVL1_L1_PER = (50);
const LVL1_L2_PER = (50);

const LVL2_L1_PER = (30);
const LVL2_L2_PER = (70);

const LIGHT_TREE_REVEAL = 5; // width of rect

// Local-use only prototypes

// Top node of linked lists, NULL = FREE
let pLightList: Pointer<LIGHT_NODE>[] /* [MAX_LIGHT_TEMPLATES] */;
let usTemplateSize: UINT16[] /* [MAX_LIGHT_TEMPLATES] */;
let pLightRayList: Pointer<UINT16>[] /* [MAX_LIGHT_TEMPLATES] */;
let usRaySize: UINT16[] /* [MAX_LIGHT_TEMPLATES] */;
let LightHeight: INT16[] /* [MAX_LIGHT_TEMPLATES] */;
let LightWidth: INT16[] /* [MAX_LIGHT_TEMPLATES] */;
let LightXOffset: INT16[] /* [MAX_LIGHT_TEMPLATES] */;
let LightYOffset: INT16[] /* [MAX_LIGHT_TEMPLATES] */;
let LightMapLeft: INT16[] /* [MAX_LIGHT_TEMPLATES] */;
let LightMapTop: INT16[] /* [MAX_LIGHT_TEMPLATES] */;
let LightMapRight: INT16[] /* [MAX_LIGHT_TEMPLATES] */;
let LightMapBottom: INT16[] /* [MAX_LIGHT_TEMPLATES] */;
export let pLightNames: string[] /* STR[MAX_LIGHT_TEMPLATES] */;

// Sprite data
export let LightSprites: LIGHT_SPRITE[] /* [MAX_LIGHT_SPRITES] */;

// Lighting system general data
export let ubAmbientLightLevel: UINT8 = DEFAULT_SHADE_LEVEL;
let gubNumLightColors: UINT8 = 1;

// Externed in Rotting Corpses.c
export let gpLightColors: SGPPaletteEntry[] /* [3] */ = [
  createSGPPaletteEntryFrom(0, 0, 0, 0),
  createSGPPaletteEntryFrom(0, 0, 255, 0),
  createSGPPaletteEntryFrom(0, 0, 0, 0),
];

let gpOrigLights: SGPPaletteEntry[] /* [2] */ = [
  createSGPPaletteEntryFrom(0, 0, 0, 0),
  createSGPPaletteEntryFrom(0, 0, 255, 0),
];

/*
UINT16 gusShadeLevels[16][3]={{500, 500, 500},				// green table
                                                                                                                        {450, 450, 450},		// bright
                                                                                                                        {350, 350, 350},
                                                                                                                        {300, 300, 300},
                                                                                                                        {255, 255, 255},		// normal
                                                                                                                        {227, 227, 227},
                                                                                                                        {198, 198, 198},
                                                                                                                        {171, 171, 171},
                                                                                                                        {143, 143, 143},
                                                                                                                        {115, 115, 160},				// darkening
                                                                                                                        {87, 87, 176},
                                                                                                                        {60, 60, 160},
                                                                                                                        {48, 48, 192},
                                                                                                                        {36, 36, 208},
                                                                                                                        {18, 18, 224},
                                                                                                                        {48, 222, 48}};
*/
// Externed in Rotting Corpses.c
// Kris' attempt at blue night lights
/*
UINT16 gusShadeLevels[16][3]={{500, 500, 500},				// green table
                                                                                                                        {450, 450, 450},		// bright
                                                                                                                        {350, 350, 350},
                                                                                                                        {300, 300, 300},
                                                                                                                        {255, 255, 255},		// normal
                                                                                                                        {215, 215, 227},
                                                                                                                        {179, 179, 179},
                                                                                                                        {149, 149, 149},
                                                                                                                        {125, 125, 128},
                                                                                                                        {104, 104, 128},				// darkening
                                                                                                                        {86, 86, 128},
                                                                                                                        {72, 72, 128},
                                                                                                                        {60, 60, 128},
                                                                                                                        {36, 36, 208},
                                                                                                                        {18, 18, 224},
                                                                                                                        {48, 222, 48}};
*/

/*
//Linda's final version

UINT16 gusShadeLevels[16][3] =
{
        500, 500, 500,
        450, 450, 450,	//bright
        350, 350, 350,
        300, 300, 300,
        255, 255, 255,	//normal
        222, 200, 200,
        174, 167, 167,
        150, 137, 137,
        122, 116, 116,	//darkening
        96, 96, 96,
        77, 77, 84,
        58, 58, 69,
        44, 44, 66,			//night
        36, 36, 244,
        18, 18, 224,
        48, 222, 48,
};
*/

// JA2 Gold:
export let gusShadeLevels: UINT16[][] /* [16][3] */ = [
  [ 500, 500, 500 ],
  [ 450, 450, 450 ], // bright
  [ 350, 350, 350 ],
  [ 300, 300, 300 ],
  [ 255, 255, 255 ], // normal
  [ 231, 199, 199 ],
  [ 209, 185, 185 ],
  [ 187, 171, 171 ],
  [ 165, 157, 157 ], // darkening
  [ 143, 143, 143 ],
  [ 121, 121, 129 ],
  [ 99, 99, 115 ],
  [ 77, 77, 101 ], // night
  [ 36, 36, 244 ],
  [ 18, 18, 224 ],
  [ 48, 222, 48 ],
];

// Set this true if you want the shadetables to be loaded from the text file.
export let gfLoadShadeTablesFromTextFile: boolean = false;

export function LoadShadeTablesFromTextFile(): void {
  let fp: Pointer<FILE>;
  let i: INT32;
  let j: INT32;
  let num: INT32;
  let str: string /* UINT8[10] */;
  if (gfLoadShadeTablesFromTextFile) {
    fp = fopen("ShadeTables.txt", "r");
    Assert(fp);
    if (fp) {
      for (i = 0; i < 16; i++) {
        for (j = 0; j < 3; j++) {
          fscanf(fp, "%s", str);
          sscanf(str, "%d", addressof(num));
          gusShadeLevels[i][j] = num;
        }
      }
      fclose(fp);
    }
  }
}

// Debug variable
let gNodesAdded: UINT32 = 0;

/****************************************************************************************
 InitLightingSystem

        Initializes the lighting system.

***************************************************************************************/
export function InitLightingSystem(): boolean {
  let uiCount: UINT32;

  LoadShadeTablesFromTextFile();

  // init all light lists
  for (uiCount = 0; uiCount < MAX_LIGHT_TEMPLATES; uiCount++) {
    pLightList[uiCount] = null;
    pLightNames[uiCount] = null;
    pLightRayList[uiCount] = null;
    usTemplateSize[uiCount] = 0;
    usRaySize[uiCount] = 0;
  }

  // init all light sprites
  for (uiCount = 0; uiCount < MAX_LIGHT_SPRITES; uiCount++)
    memset(addressof(LightSprites[uiCount]), 0, sizeof(LIGHT_SPRITE));

  if (LightLoad("TRANSLUC.LHT") != 0) {
    DebugMsg(TOPIC_GAME, DBG_LEVEL_0, FormatString("Failed to load translucency template"));
    return false;
  }

  return true;
}

// THIS MUST BE CALLED ONCE ALL SURFACE VIDEO OBJECTS HAVE BEEN LOADED!
export function SetDefaultWorldLightingColors(): boolean {
  let pPal: SGPPaletteEntry[] /* [2] */ = createArrayFrom(2, createSGPPaletteEntry);

  pPal[0].peRed = 0;
  pPal[0].peGreen = 0;
  pPal[0].peBlue = 0;
  pPal[1].peRed = 0;
  pPal[1].peGreen = 0;
  pPal[1].peBlue = 128;

  LightSetColors(addressof(pPal[0]), 1);

  return true;
}

/****************************************************************************************
 ShutdownLightingSystem

        Closes down the lighting system. Any lights that were created are destroyed, and the
        memory attached to them freed up.

***************************************************************************************/
export function ShutdownLightingSystem(): boolean {
  let uiCount: UINT32;

  // free up all allocated light nodes
  for (uiCount = 0; uiCount < MAX_LIGHT_TEMPLATES; uiCount++)
    if (pLightList[uiCount] != null)
      LightDelete(uiCount);

  return true;
}

/****************************************************************************************
 LightReset

        Removes all currently active lights, without undrawing them.

***************************************************************************************/
export function LightReset(): boolean {
  let uiCount: UINT32;

  // reset all light lists
  for (uiCount = 0; uiCount < MAX_LIGHT_TEMPLATES; uiCount++)
    if (pLightList[uiCount] != null)
      LightDelete(uiCount);

  // init all light sprites
  for (uiCount = 0; uiCount < MAX_LIGHT_SPRITES; uiCount++)
    memset(addressof(LightSprites[uiCount]), 0, sizeof(LIGHT_SPRITE));

  if (LightLoad("TRANSLUC.LHT") != 0) {
    DebugMsg(TOPIC_GAME, DBG_LEVEL_0, FormatString("Failed to load translucency template"));
    return false;
  }

  // Loop through mercs and reset light value
  for (uiCount = 0; uiCount < MAX_NUM_SOLDIERS; uiCount++) {
    MercPtrs[uiCount].value.iLight = -1;
  }

  return true;
}

/****************************************************************************************
 LightCreateTemplateNode

        Creates a new node, and appends it to the template list. The index into the list is
        returned.

***************************************************************************************/
function LightCreateTemplateNode(iLight: INT32, iX: INT16, iY: INT16, ubLight: UINT8): UINT16 {
  let usNumNodes: UINT16;

  // create a new list
  if (pLightList[iLight] == null) {
    if ((pLightList[iLight] = MemAlloc(sizeof(LIGHT_NODE))) == null)
      return 65535;

    pLightList[iLight].value.iDX = iX;
    pLightList[iLight].value.iDY = iY;
    pLightList[iLight].value.ubLight = ubLight;
    pLightList[iLight].value.uiFlags = 0;

    usTemplateSize[iLight] = 1;
    return 0;
  } else {
    usNumNodes = usTemplateSize[iLight];
    pLightList[iLight] = MemRealloc(pLightList[iLight], (usNumNodes + 1) * sizeof(LIGHT_NODE));
    (pLightList[iLight] + usNumNodes).value.iDX = iX;
    (pLightList[iLight] + usNumNodes).value.iDY = iY;
    (pLightList[iLight] + usNumNodes).value.ubLight = ubLight;
    (pLightList[iLight] + usNumNodes).value.uiFlags = 0;
    usTemplateSize[iLight] = usNumNodes + 1;
    return usNumNodes;
  }
}

/****************************************************************************************
 LightAddTemplateNode

        Adds a node to the template list. If the node does not exist, it creates a new one.
        Returns the index into the list.

***************************************************************************************/
function LightAddTemplateNode(iLight: INT32, iX: INT16, iY: INT16, ubLight: UINT8): UINT16 {
  let usCount: UINT16;

  for (usCount = 0; usCount < usTemplateSize[iLight]; usCount++) {
    if (((pLightList[iLight] + usCount).value.iDX == iX) && ((pLightList[iLight] + usCount).value.iDY == iY)) {
      return usCount;
    }
  }

  return LightCreateTemplateNode(iLight, iX, iY, ubLight);
}

/****************************************************************************************
 LightAddRayNode

        Adds a node to the ray casting list.

***************************************************************************************/
function LightAddRayNode(iLight: INT32, iX: INT16, iY: INT16, ubLight: UINT8, usFlags: UINT16): UINT16 {
  let usNumNodes: UINT16;

  // create a new list
  if (pLightRayList[iLight] == null) {
    if ((pLightRayList[iLight] = MemAlloc(sizeof(UINT16))) == null)
      return 65535;

    pLightRayList[iLight].value = (LightAddTemplateNode(iLight, iX, iY, ubLight) | usFlags);

    usRaySize[iLight] = 1;
    return 0;
  } else {
    usNumNodes = usRaySize[iLight];
    pLightRayList[iLight] = MemRealloc(pLightRayList[iLight], (usNumNodes + 1) * sizeof(UINT16));
    (pLightRayList[iLight] + usNumNodes).value = (LightAddTemplateNode(iLight, iX, iY, ubLight) | usFlags);
    usRaySize[iLight] = usNumNodes + 1;
    return usNumNodes;
  }
}

/****************************************************************************************
 LightAddRayNode

        Adds a node to the ray casting list.

***************************************************************************************/
function LightInsertRayNode(iLight: INT32, usIndex: UINT16, iX: INT16, iY: INT16, ubLight: UINT8, usFlags: UINT16): UINT16 {
  let usNumNodes: UINT16;

  // create a new list
  if (pLightRayList[iLight] == null) {
    if ((pLightRayList[iLight] = MemAlloc(sizeof(UINT16))) == null)
      return 65535;

    pLightRayList[iLight].value = (LightAddTemplateNode(iLight, iX, iY, ubLight) | usFlags);

    usRaySize[iLight] = 1;
    return 0;
  } else {
    usNumNodes = usRaySize[iLight];
    pLightRayList[iLight] = MemRealloc(pLightRayList[iLight], (usNumNodes + 1) * sizeof(UINT16));

    if (usIndex < usRaySize[iLight]) {
      memmove(pLightRayList[iLight] + usIndex + 1, pLightRayList[iLight] + usIndex, (usRaySize[iLight] - usIndex) * sizeof(UINT16));
    }

    (pLightRayList[iLight] + usIndex).value = (LightAddTemplateNode(iLight, iX, iY, ubLight) | usFlags);
    usRaySize[iLight] = usNumNodes + 1;
    return usNumNodes;
  }
}

/****************************************************************************************
 LightTileBlocked

        Returns TRUE/FALSE if the tile at the specified tile number can block light.

***************************************************************************************/
function LightTileBlocked(iSrcX: INT16, iSrcY: INT16, iX: INT16, iY: INT16): boolean {
  let usTileNo: UINT16;
  let usSrcTileNo: UINT16;

  Assert(gpWorldLevelData != null);

  usTileNo = MAPROWCOLTOPOS(iY, iX);
  usSrcTileNo = MAPROWCOLTOPOS(iSrcY, iSrcX);

  if (usTileNo >= NOWHERE) {
    return false;
  }

  if (usSrcTileNo >= NOWHERE) {
    return false;
  }

  if (gpWorldLevelData[usTileNo].sHeight > gpWorldLevelData[usSrcTileNo].sHeight)
    return true;
  {
    let usTileNo: UINT16;
    let pStruct: Pointer<LEVELNODE>;

    usTileNo = MAPROWCOLTOPOS(iY, iX);

    pStruct = gpWorldLevelData[usTileNo].pStructHead;
    if (pStruct != null) {
      // IF WE ARE A WINDOW, DO NOT BLOCK!
      if (FindStructure(usTileNo, STRUCTURE_WALLNWINDOW) != null) {
        return false;
      }
    }
  }

  return LightTileHasWall(iSrcX, iSrcY, iX, iY);
}

/****************************************************************************************
 LightTileHasWall

        Returns TRUE/FALSE if the tile at the specified coordinates contains a wall.

***************************************************************************************/
function LightTileHasWall(iSrcX: INT16, iSrcY: INT16, iX: INT16, iY: INT16): boolean {
  // LEVELNODE *pStruct;
  // UINT32 uiType;
  let usTileNo: UINT16;
  let usSrcTileNo: UINT16;
  let bDirection: INT8;
  let ubTravelCost: UINT8;
  // INT8		bWallCount = 0;
  // UINT16	usWallOrientation;

  Assert(gpWorldLevelData != null);

  usTileNo = MAPROWCOLTOPOS(iY, iX);
  usSrcTileNo = MAPROWCOLTOPOS(iSrcY, iSrcX);

  if (usTileNo == usSrcTileNo) {
    return false;
  }

  // if ( usTileNo == 10125 || usTileNo == 10126 )
  //{
  //	int i = 0;
  //}

  if (usTileNo >= NOWHERE) {
    return false;
  }

  if (usSrcTileNo >= NOWHERE) {
    return false;
  }

  // Get direction
  // bDirection = atan8( iX, iY, iSrcX, iSrcY );
  bDirection = atan8(iSrcX, iSrcY, iX, iY);

  if (usTileNo == 20415 && bDirection == 3) {
    let i: number = 0;
  }

  ubTravelCost = gubWorldMovementCosts[usTileNo][bDirection][0];

  if (ubTravelCost == TRAVELCOST_WALL) {
    return true;
  }

  if (IS_TRAVELCOST_DOOR(ubTravelCost)) {
    ubTravelCost = DoorTravelCost(null, usTileNo, ubTravelCost, true, null);

    if (ubTravelCost == TRAVELCOST_OBSTACLE || ubTravelCost == TRAVELCOST_DOOR) {
      return true;
    }
  }

  return false;
}

/****************************************************************************************
 LightDelete

        Removes a light template from the list, and frees up the associated node memory.

***************************************************************************************/
function LightDelete(iLight: INT32): boolean {
  if (pLightList[iLight] != null) {
    if (pLightList[iLight] != null) {
      MemFree(pLightList[iLight]);
      pLightList[iLight] = null;
    }

    if (pLightRayList[iLight] != null) {
      MemFree(pLightRayList[iLight]);
      pLightRayList[iLight] = null;
    }

    if (pLightNames[iLight] != null) {
      MemFree(pLightNames[iLight]);
      pLightNames[iLight] = null;
    }

    usTemplateSize[iLight] = 0;
    usRaySize[iLight] = 0;

    return true;
  } else
    return false;
}

/****************************************************************************************
 LightGetFree

        Returns an available slot for a new light template. If none are available, (-1) is
        returned.

***************************************************************************************/
function LightGetFree(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < MAX_LIGHT_TEMPLATES; uiCount++)
    if (pLightList[uiCount] == null)
      return uiCount;

  return -1;
}

/****************************************************************************************
 LinearDistance

        Calculates the 2D linear distance between two points.

***************************************************************************************/
function LinearDistance(iX1: INT16, iY1: INT16, iX2: INT16, iY2: INT16): INT32 {
  let iDx: INT32;
  let iDy: INT32;

  iDx = Math.abs(iX1 - iX2);
  iDx *= iDx;
  iDy = Math.abs(iY1 - iY2);
  iDy *= iDy;

  return Math.sqrt((iDx + iDy));
}

/****************************************************************************************
        LinearDistanceDouble

                Calculates the 2D linear distance between two points. Returns the result in a DOUBLE
        for greater accuracy.

***************************************************************************************/
function LinearDistanceDouble(iX1: INT16, iY1: INT16, iX2: INT16, iY2: INT16): DOUBLE {
  let iDx: INT32;
  let iDy: INT32;

  iDx = Math.abs(iX1 - iX2);
  iDx *= iDx;
  iDy = Math.abs(iY1 - iY2);
  iDy *= iDy;

  return Math.sqrt((iDx + iDy));
}

/****************************************************************************************
        LightTrueLevel

                Returns the light level at a particular level without fake lights

***************************************************************************************/
export function LightTrueLevel(sGridNo: INT16, bLevel: INT8): UINT8 {
  let pNode: Pointer<LEVELNODE>;
  let iSum: INT32;

  if (bLevel == 0) {
    pNode = gpWorldLevelData[sGridNo].pLandHead;
  } else {
    pNode = gpWorldLevelData[sGridNo].pRoofHead;
  }

  if (pNode == null) {
    return ubAmbientLightLevel;
  } else {
    iSum = pNode.value.ubNaturalShadeLevel - (pNode.value.ubSumLights - pNode.value.ubFakeShadeLevel);

    iSum = Math.min(SHADE_MIN, iSum);
    iSum = Math.max(SHADE_MAX, iSum);
    return iSum;
  }
}

/****************************************************************************************
        LightAddNodeTile

                Does the addition of light values to individual LEVELNODEs in the world tile list.

***************************************************************************************/
function LightAddTileNode(pNode: Pointer<LEVELNODE>, uiLightType: UINT32, ubShadeAdd: UINT8, fFake: boolean): void {
  let sSum: INT16;

  pNode.value.ubSumLights += ubShadeAdd;
  if (fFake) {
    pNode.value.ubFakeShadeLevel += ubShadeAdd;
  }

  // Now set max
  pNode.value.ubMaxLights = Math.max(pNode.value.ubMaxLights, ubShadeAdd);

  sSum = pNode.value.ubNaturalShadeLevel - pNode.value.ubMaxLights;

  sSum = Math.min(SHADE_MIN, sSum);
  sSum = Math.max(SHADE_MAX, sSum);

  pNode.value.ubShadeLevel = sSum;
}

/****************************************************************************************
        LightAddNodeTile

                Does the subtraction of light values to individual LEVELNODEs in the world tile list.

***************************************************************************************/
function LightSubtractTileNode(pNode: Pointer<LEVELNODE>, uiLightType: UINT32, ubShadeSubtract: UINT8, fFake: boolean): void {
  let sSum: INT16;

  if (ubShadeSubtract > pNode.value.ubSumLights) {
    pNode.value.ubSumLights = 0;
  } else {
    pNode.value.ubSumLights -= ubShadeSubtract;
  }
  if (fFake) {
    if (ubShadeSubtract > pNode.value.ubFakeShadeLevel) {
      pNode.value.ubFakeShadeLevel = 0;
    } else {
      pNode.value.ubFakeShadeLevel -= ubShadeSubtract;
    }
  }

  // Now set max
  pNode.value.ubMaxLights = Math.min(pNode.value.ubMaxLights, pNode.value.ubSumLights);

  sSum = pNode.value.ubNaturalShadeLevel - pNode.value.ubMaxLights;

  sSum = Math.min(SHADE_MIN, sSum);
  sSum = Math.max(SHADE_MAX, sSum);

  pNode.value.ubShadeLevel = sSum;
}

/****************************************************************************************
        LightAddTile

                Adds a specified amount of light to all objects on a given tile.

***************************************************************************************/
function LightAddTile(uiLightType: UINT32, iSrcX: INT16, iSrcY: INT16, iX: INT16, iY: INT16, ubShade: UINT8, uiFlags: UINT32, fOnlyWalls: boolean): boolean {
  let pLand: Pointer<LEVELNODE>;
  let pStruct: Pointer<LEVELNODE>;
  let pObject: Pointer<LEVELNODE>;
  let pMerc: Pointer<LEVELNODE>;
  let pRoof: Pointer<LEVELNODE>;
  let pOnRoof: Pointer<LEVELNODE>;
  let ubShadeAdd: UINT8;
  let uiTile: UINT32;
  let fLitWall: boolean = false;
  let fFake: boolean;

  Assert(gpWorldLevelData != null);

  uiTile = MAPROWCOLTOPOS(iY, iX);

  if (uiTile >= NOWHERE) {
    return false;
  }

  gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_REDRAW;

  // if((uiFlags&LIGHT_BACKLIGHT) && !(uiFlags&LIGHT_ROOF_ONLY))
  //	ubShadeAdd=ubShade*7/10;
  // else
  ubShadeAdd = ubShade;

  if (uiFlags & LIGHT_FAKE) {
    fFake = true;
  } else {
    fFake = false;
  }

  if (!(uiFlags & LIGHT_ROOF_ONLY) || (uiFlags & LIGHT_EVERYTHING)) {
    pStruct = gpWorldLevelData[uiTile].pStructHead;
    while (pStruct != null) {
      if (pStruct.value.usIndex < Enum312.NUMBEROFTILES) {
        if ((gTileDatabase[pStruct.value.usIndex].fType != Enum313.FIRSTCLIFFHANG) || (uiFlags & LIGHT_EVERYTHING)) {
          if ((uiFlags & LIGHT_IGNORE_WALLS) || gfCaves)
            LightAddTileNode(pStruct, uiLightType, ubShadeAdd, false);
          else if (LightIlluminateWall(iSrcX, iSrcY, iX, iY, pStruct)) {
            if (LightTileHasWall(iSrcX, iSrcY, iX, iY))
              fLitWall = true;

            // ATE: Limit shade for walls if in caves
            if (fLitWall && gfCaves) {
              LightAddTileNode(pStruct, uiLightType, Math.min(ubShadeAdd, (SHADE_MAX + 5)), false);
            } else if (fLitWall) {
              LightAddTileNode(pStruct, uiLightType, ubShadeAdd, false);
            } else if (!fOnlyWalls) {
              LightAddTileNode(pStruct, uiLightType, ubShadeAdd, false);
            }
          }
        }
      } else {
        LightAddTileNode(pStruct, uiLightType, ubShadeAdd, false);
      }
      pStruct = pStruct.value.pNext;
    }

    ubShadeAdd = ubShade;

    if (!fOnlyWalls) {
      pLand = gpWorldLevelData[uiTile].pLandHead;

      while (pLand) {
        if (gfCaves || !fLitWall) {
          LightAddTileNode(pLand, uiLightType, ubShadeAdd, fFake);
        }
        pLand = pLand.value.pNext;
      }

      pObject = gpWorldLevelData[uiTile].pObjectHead;
      while (pObject != null) {
        if (pObject.value.usIndex < Enum312.NUMBEROFTILES) {
          LightAddTileNode(pObject, uiLightType, ubShadeAdd, false);
        }
        pObject = pObject.value.pNext;
      }

      if (uiFlags & LIGHT_BACKLIGHT)
        ubShadeAdd = ubShade * 7 / 10;

      pMerc = gpWorldLevelData[uiTile].pMercHead;
      while (pMerc != null) {
        LightAddTileNode(pMerc, uiLightType, ubShadeAdd, false);
        pMerc = pMerc.value.pNext;
      }
    }
  }

  if ((uiFlags & LIGHT_ROOF_ONLY) || (uiFlags & LIGHT_EVERYTHING)) {
    pRoof = gpWorldLevelData[uiTile].pRoofHead;
    while (pRoof != null) {
      if (pRoof.value.usIndex < Enum312.NUMBEROFTILES) {
        LightAddTileNode(pRoof, uiLightType, ubShadeAdd, fFake);
      }
      pRoof = pRoof.value.pNext;
    }

    pOnRoof = gpWorldLevelData[uiTile].pOnRoofHead;
    while (pOnRoof != null) {
      LightAddTileNode(pOnRoof, uiLightType, ubShadeAdd, false);

      pOnRoof = pOnRoof.value.pNext;
    }
  }
  return true;
}

/****************************************************************************************
        LightSubtractTile

                Subtracts a specified amount of light to a given tile.

***************************************************************************************/
function LightSubtractTile(uiLightType: UINT32, iSrcX: INT16, iSrcY: INT16, iX: INT16, iY: INT16, ubShade: UINT8, uiFlags: UINT32, fOnlyWalls: boolean): boolean {
  let pLand: Pointer<LEVELNODE>;
  let pStruct: Pointer<LEVELNODE>;
  let pObject: Pointer<LEVELNODE>;
  let pMerc: Pointer<LEVELNODE>;
  let pRoof: Pointer<LEVELNODE>;
  let pOnRoof: Pointer<LEVELNODE>;
  let ubShadeSubtract: UINT8;
  let uiTile: UINT32;
  let fLitWall: boolean = false;
  let fFake: boolean; // only passed in to land and roof layers; others get fed FALSE

  Assert(gpWorldLevelData != null);

  uiTile = MAPROWCOLTOPOS(iY, iX);

  if (uiTile >= NOWHERE) {
    return false;
  }

  gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_REDRAW;

  //	if((uiFlags&LIGHT_BACKLIGHT) && !(uiFlags&LIGHT_ROOF_ONLY))
  //		ubShadeSubtract=ubShade*7/10;
  //	else
  ubShadeSubtract = ubShade;

  if (uiFlags & LIGHT_FAKE) {
    fFake = true;
  } else {
    fFake = false;
  }

  if (!(uiFlags & LIGHT_ROOF_ONLY) || (uiFlags & LIGHT_EVERYTHING)) {
    pStruct = gpWorldLevelData[uiTile].pStructHead;
    while (pStruct != null) {
      if (pStruct.value.usIndex < Enum312.NUMBEROFTILES) {
        if ((gTileDatabase[pStruct.value.usIndex].fType != Enum313.FIRSTCLIFFHANG) || (uiFlags & LIGHT_EVERYTHING)) {
          if ((uiFlags & LIGHT_IGNORE_WALLS) || gfCaves)
            LightSubtractTileNode(pStruct, uiLightType, ubShadeSubtract, false);
          else if (LightIlluminateWall(iSrcX, iSrcY, iX, iY, pStruct)) {
            if (LightTileHasWall(iSrcX, iSrcY, iX, iY))
              fLitWall = true;

            // ATE: Limit shade for walls if in caves
            if (fLitWall && gfCaves) {
              LightSubtractTileNode(pStruct, uiLightType, Math.max((ubShadeSubtract - 5), 0), false);
            } else if (fLitWall) {
              LightSubtractTileNode(pStruct, uiLightType, ubShadeSubtract, false);
            } else if (!fOnlyWalls) {
              LightSubtractTileNode(pStruct, uiLightType, ubShadeSubtract, false);
            }
          }
        }
      } else {
        LightSubtractTileNode(pStruct, uiLightType, ubShadeSubtract, false);
      }
      pStruct = pStruct.value.pNext;
    }

    ubShadeSubtract = ubShade;

    if (!fOnlyWalls) {
      pLand = gpWorldLevelData[uiTile].pLandHead;

      while (pLand) {
        if (gfCaves || !fLitWall) {
          LightSubtractTileNode(pLand, uiLightType, ubShadeSubtract, fFake);
        }
        pLand = pLand.value.pNext;
      }

      pObject = gpWorldLevelData[uiTile].pObjectHead;
      while (pObject != null) {
        if (pObject.value.usIndex < Enum312.NUMBEROFTILES) {
          LightSubtractTileNode(pObject, uiLightType, ubShadeSubtract, false);
        }
        pObject = pObject.value.pNext;
      }

      if (uiFlags & LIGHT_BACKLIGHT)
        ubShadeSubtract = ubShade * 7 / 10;

      pMerc = gpWorldLevelData[uiTile].pMercHead;
      while (pMerc != null) {
        LightSubtractTileNode(pMerc, uiLightType, ubShadeSubtract, false);
        pMerc = pMerc.value.pNext;
      }
    }
  }

  if ((uiFlags & LIGHT_ROOF_ONLY) || (uiFlags & LIGHT_EVERYTHING)) {
    pRoof = gpWorldLevelData[uiTile].pRoofHead;
    while (pRoof != null) {
      if (pRoof.value.usIndex < Enum312.NUMBEROFTILES) {
        LightSubtractTileNode(pRoof, uiLightType, ubShadeSubtract, fFake);
      }
      pRoof = pRoof.value.pNext;
    }

    pOnRoof = gpWorldLevelData[uiTile].pOnRoofHead;
    while (pOnRoof != null) {
      if (pOnRoof.value.usIndex < Enum312.NUMBEROFTILES) {
        LightSubtractTileNode(pOnRoof, uiLightType, ubShadeSubtract, false);
      }
      pOnRoof = pOnRoof.value.pNext;
    }
  }

  return true;
}

/****************************************************************************************
        LightSetNaturalTileNode

                Sets the natural light level (as well as the current) on individual LEVELNODEs.

***************************************************************************************/
function LightSetNaturalTileNode(pNode: Pointer<LEVELNODE>, ubShade: UINT8): void {
  Assert(pNode != null);

  pNode.value.ubSumLights = 0;
  pNode.value.ubMaxLights = 0;
  pNode.value.ubNaturalShadeLevel = ubShade;
  pNode.value.ubShadeLevel = ubShade;
  // LightAddTileNode(pNode, 0, (INT16)(SHADE_MIN-ubShade));
}

/****************************************************************************************
        LightSetNaturalTile

                Sets the natural light value of all objects on a given tile to the specified value.
        This is the light value a tile has with no artificial lighting affecting it.

***************************************************************************************/
function LightSetNaturalTile(iX: INT16, iY: INT16, ubShade: UINT8): boolean {
  let pLand: Pointer<LEVELNODE>;
  let pStruct: Pointer<LEVELNODE>;
  let pObject: Pointer<LEVELNODE>;
  let pRoof: Pointer<LEVELNODE>;
  let pOnRoof: Pointer<LEVELNODE>;
  let pTopmost: Pointer<LEVELNODE>;
  let pMerc: Pointer<LEVELNODE>;
  let uiIndex: UINT32;

  if (gpWorldLevelData == null) {
    return false;
  }

  uiIndex = MAPROWCOLTOPOS(iY, iX);

  Assert(uiIndex != 0xffff);

  ubShade = Math.max(SHADE_MAX, ubShade);
  ubShade = Math.min(SHADE_MIN, ubShade);

  pLand = gpWorldLevelData[uiIndex].pLandHead;

  while (pLand != null) {
    LightSetNaturalTileNode(pLand, ubShade);
    pLand = pLand.value.pNext;
  }

  pStruct = gpWorldLevelData[uiIndex].pStructHead;

  while (pStruct != null) {
    LightSetNaturalTileNode(pStruct, ubShade);
    pStruct = pStruct.value.pNext;
  }

  pObject = gpWorldLevelData[uiIndex].pObjectHead;
  while (pObject != null) {
    LightSetNaturalTileNode(pObject, ubShade);
    pObject = pObject.value.pNext;
  }

  pRoof = gpWorldLevelData[uiIndex].pRoofHead;
  while (pRoof != null) {
    LightSetNaturalTileNode(pRoof, ubShade);
    pRoof = pRoof.value.pNext;
  }

  pOnRoof = gpWorldLevelData[uiIndex].pOnRoofHead;
  while (pOnRoof != null) {
    LightSetNaturalTileNode(pOnRoof, ubShade);
    pOnRoof = pOnRoof.value.pNext;
  }

  pTopmost = gpWorldLevelData[uiIndex].pTopmostHead;
  while (pTopmost != null) {
    LightSetNaturalTileNode(pTopmost, ubShade);
    pTopmost = pTopmost.value.pNext;
  }

  pMerc = gpWorldLevelData[uiIndex].pMercHead;
  while (pMerc != null) {
    LightSetNaturalTileNode(pMerc, ubShade);
    pMerc = pMerc.value.pNext;
  }
  return true;
}

/****************************************************************************************
        LightResetTileNode

        Resets the light level of individual LEVELNODEs to the value contained in the
        natural light level.

***************************************************************************************/
function LightResetTileNode(pNode: Pointer<LEVELNODE>): void {
  pNode.value.ubSumLights = 0;
  pNode.value.ubMaxLights = 0;
  pNode.value.ubShadeLevel = pNode.value.ubNaturalShadeLevel;
  pNode.value.ubFakeShadeLevel = 0;
}

/****************************************************************************************
        LightResetTile

                Resets the light values of all objects on a given tile to the "natural" light level
        for that tile.

***************************************************************************************/
function LightResetTile(iX: INT16, iY: INT16): boolean {
  let pLand: Pointer<LEVELNODE>;
  let pStruct: Pointer<LEVELNODE>;
  let pObject: Pointer<LEVELNODE>;
  let pRoof: Pointer<LEVELNODE>;
  let pOnRoof: Pointer<LEVELNODE>;
  let pTopmost: Pointer<LEVELNODE>;
  let pMerc: Pointer<LEVELNODE>;
  let uiTile: UINT32;

  if (gpWorldLevelData == null) {
    return false;
  }

  uiTile = MAPROWCOLTOPOS(iY, iX);

  if (uiTile == 0xffff) {
    return false;
  }

  pLand = gpWorldLevelData[uiTile].pLandHead;

  while (pLand != null) {
    LightResetTileNode(pLand);
    pLand = pLand.value.pNext;
  }

  pStruct = gpWorldLevelData[uiTile].pStructHead;

  while (pStruct != null) {
    LightResetTileNode(pStruct);
    pStruct = pStruct.value.pNext;
  }

  pObject = gpWorldLevelData[uiTile].pObjectHead;
  while (pObject != null) {
    LightResetTileNode(pObject);
    pObject = pObject.value.pNext;
  }

  pRoof = gpWorldLevelData[uiTile].pRoofHead;
  while (pRoof != null) {
    LightResetTileNode(pRoof);
    pRoof = pRoof.value.pNext;
  }

  pOnRoof = gpWorldLevelData[uiTile].pOnRoofHead;
  while (pOnRoof != null) {
    LightResetTileNode(pOnRoof);
    pOnRoof = pOnRoof.value.pNext;
  }

  pTopmost = gpWorldLevelData[uiTile].pTopmostHead;
  while (pTopmost != null) {
    LightResetTileNode(pTopmost);
    pTopmost = pTopmost.value.pNext;
  }

  pMerc = gpWorldLevelData[uiTile].pMercHead;
  while (pMerc != null) {
    LightResetTileNode(pMerc);
    pMerc = pMerc.value.pNext;
  }

  return true;
}

/****************************************************************************************
        LightResetAllTiles

                Resets all tiles on the map to their baseline values.

***************************************************************************************/
function LightResetAllTiles(): boolean {
  let iCountY: INT16;
  let iCountX: INT16;

  for (iCountY = 0; iCountY < WORLD_ROWS; iCountY++)
    for (iCountX = 0; iCountX < WORLD_COLS; iCountX++)
      LightResetTile(iCountX, iCountY);

  return true;
}

/****************************************************************************************
        LightSetTile

                Sets the current light value of all objects on a given tile to the specified value.

***************************************************************************************/
function LightSetTile(iX: INT16, iY: INT16, ubShade: UINT8, uiLightType: UINT32): boolean {
  /*LEVELNODE *pLand, *pStruct, *pObject, *pRoof, *pOnRoof, *pTopmost, *pFog;
  UINT32 uiIndex;

          ubShade=__max(SHADE_MAX, ubShade);
          ubShade=__min(SHADE_MIN, ubShade);

          uiIndex = MAPROWCOLTOPOS( iY, iX );
          pLand = gpWorldLevelData[ uiIndex ].pLandHead;

          while(pLand!=NULL)
          {
                  pLand->sSumLights[uiLightType]= ubShade-SHADE_MAX;
                  pLand->ubShadeLevel = ubShade;
                  pLand=pLand->pNext;
          }

          pStruct = gpWorldLevelData[ uiIndex ].pStructHead;

          while(pStruct!=NULL)
          {
                  pStruct->sSumLights[uiLightType]= ubShade-SHADE_MAX;
                  pStruct->ubShadeLevel = ubShade;
                  pStruct=pStruct->pNext;
          }

          pObject = gpWorldLevelData[ uiIndex ].pObjectHead;
          while(pObject!=NULL)
          {
                  pObject->sSumLights[uiLightType]= ubShade-SHADE_MAX;
                  pObject->ubShadeLevel = ubShade;
                  pObject=pObject->pNext;
          }

          pRoof = gpWorldLevelData[ uiIndex ].pRoofHead;
          while(pRoof!=NULL)
          {
                  pRoof->sSumLights[uiLightType]= ubShade-SHADE_MAX;
                  pRoof->ubShadeLevel = ubShade;
                  pRoof=pRoof->pNext;
          }

          pOnRoof = gpWorldLevelData[ uiIndex ].pOnRoofHead;
          while(pOnRoof!=NULL)
          {
                  pOnRoof->sSumLights[uiLightType]= ubShade-SHADE_MAX;
                  pOnRoof->ubShadeLevel = ubShade;
                  pOnRoof=pOnRoof->pNext;
          }

          pFog = gpWorldLevelData[ uiIndex ].pFogHead;
          while(pFog!=NULL)
          {
                  pFog->sSumLights[uiLightType]= ubShade-SHADE_MAX;
                  pFog->ubShadeLevel = ubShade;
                  pFog=pFog->pNext;
          }

          pTopmost = gpWorldLevelData[ uiIndex ].pTopmostHead;
          while(pTopmost!=NULL)
          {
                  pTopmost->sSumLights[uiLightType]= ubShade-SHADE_MAX;
                  pTopmost->ubShadeLevel = ubShade;
                  pTopmost=pTopmost->pNext;
          } */
  return true;
}

/****************************************************************************************
        LightGetLastNode

                Returns a pointer to the last node in a light list. If the list is empty, NULL is
        returned.

***************************************************************************************/
function LightGetLastNode(iLight: INT32): UINT16 {
  return usRaySize[iLight];
}

/****************************************************************************************
        LightAddNode

                Creates a new node, and adds it to the end of a light list.

***************************************************************************************/
function LightAddNode(iLight: INT32, iHotSpotX: INT16, iHotSpotY: INT16, iX: INT16, iY: INT16, ubIntensity: UINT8, uiFlags: UINT16): boolean {
  let fDuplicate: boolean = false;
  let dDistance: DOUBLE;
  let ubShade: UINT8;
  let iLightDecay: INT32;

  dDistance = LinearDistanceDouble(iX, iY, iHotSpotX, iHotSpotY);
  dDistance /= DISTANCE_SCALE;

  iLightDecay = (dDistance * LIGHT_DECAY);

  if ((iLightDecay >= ubIntensity))
    ubShade = 0;
  else
    ubShade = ubIntensity - iLightDecay;

  iX /= DISTANCE_SCALE;
  iY /= DISTANCE_SCALE;

  LightAddRayNode(iLight, iX, iY, ubShade, uiFlags);
  return true;
}

/****************************************************************************************
        LightInsertNode

                Creates a new node, and inserts it after the specified node.

***************************************************************************************/
function LightInsertNode(iLight: INT32, usLightIns: UINT16, iHotSpotX: INT16, iHotSpotY: INT16, iX: INT16, iY: INT16, ubIntensity: UINT8, uiFlags: UINT16): boolean {
  let dDistance: DOUBLE;
  let ubShade: UINT8;
  let iLightDecay: INT32;

  dDistance = LinearDistanceDouble(iX, iY, iHotSpotX, iHotSpotY);
  dDistance /= DISTANCE_SCALE;

  iLightDecay = (dDistance * LIGHT_DECAY);

  if ((iLightDecay >= ubIntensity))
    ubShade = 0;
  else
    ubShade = ubIntensity - iLightDecay;

  iX /= DISTANCE_SCALE;
  iY /= DISTANCE_SCALE;

  LightInsertRayNode(iLight, usLightIns, iX, iY, ubShade, uiFlags);

  return true;
}

/****************************************************************************************
        LightFindNextRay

                Traverses the linked list until a node with the LIGHT_NEW_RAY marker, and returns
        the pointer. If the end of list is reached, NULL is returned.

***************************************************************************************/
function LightFindNextRay(iLight: INT32, usIndex: UINT16): UINT16 {
  let usNodeIndex: UINT16;

  usNodeIndex = usIndex;
  while ((usNodeIndex < usRaySize[iLight]) && !((pLightRayList[iLight] + usNodeIndex).value & LIGHT_NEW_RAY))
    usNodeIndex++;

  return usNodeIndex;
}

/****************************************************************************************
        LightCastRay

                Casts a ray from an origin to an end point, creating nodes and adding them to the
        light list.

***************************************************************************************/
function LightCastRay(iLight: INT32, iStartX: INT16, iStartY: INT16, iEndPointX: INT16, iEndPointY: INT16, ubStartIntens: UINT8, ubEndIntens: UINT8): boolean {
  let AdjUp: INT16;
  let AdjDown: INT16;
  let ErrorTerm: INT16;
  let XAdvance: INT16;
  let XDelta: INT16;
  let YDelta: INT16;
  let WholeStep: INT32;
  let InitialPixelCount: INT32;
  let FinalPixelCount: INT32;
  let i: INT32;
  let j: INT32;
  let RunLength: INT32;
  let iXPos: INT16;
  let iYPos: INT16;
  let iEndY: INT16;
  let iEndX: INT16;
  let usCurNode: UINT16 = 0;
  let usFlags: UINT16 = 0;
  let fInsertNodes: boolean = false;

  if ((iEndPointX > 0) && (iEndPointY > 0))
    usFlags = LIGHT_BACKLIGHT;

  /* We'll always draw top to bottom, to reduce the number of cases we have to
  handle, and to make lines between the same endpoints draw the same pixels */
  if (iStartY > iEndPointY) {
    iXPos = iEndPointX;
    iEndX = iStartX;
    iYPos = iEndPointY;
    iEndY = iStartY;
    fInsertNodes = true;
  } else {
    iXPos = iStartX;
    iEndX = iEndPointX;
    iYPos = iStartY;
    iEndY = iEndPointY;
  }

  /* Figure out whether we're going left or right, and how far we're
going horizontally */
  if ((XDelta = (iEndX - iXPos)) < 0) {
    XAdvance = -1;
    XDelta = -XDelta;
  } else {
    XAdvance = 1;
  }
  /* Figure out how far we're going vertically */
  YDelta = iEndY - iYPos;

  // Check for 0 length ray
  if ((XDelta == 0) && (YDelta == 0))
    return false;

  // DebugMsg(TOPIC_GAME, DBG_LEVEL_0, String("Drawing (%d,%d) to (%d,%d)", iXPos, iYPos, iEndX, iEndY));
  LightAddNode(iLight, 32767, 32767, 32767, 32767, 0, LIGHT_NEW_RAY);
  if (fInsertNodes)
    usCurNode = LightGetLastNode(iLight);

  /* Special-case horizontal, vertical, and diagonal lines, for speed
and to avoid nasty boundary conditions and division by 0 */
  if (XDelta == 0) {
    /* Vertical line */
    if (fInsertNodes) {
      for (i = 0; i <= YDelta; i++) {
        LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iYPos++;
      }
    } else {
      for (i = 0; i <= YDelta; i++) {
        LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iYPos++;
      }
    }
    return true;
  }
  if (YDelta == 0) {
    /* Horizontal line */
    if (fInsertNodes) {
      for (i = 0; i <= XDelta; i++) {
        LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iXPos += XAdvance;
      }
    } else {
      for (i = 0; i <= XDelta; i++) {
        LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iXPos += XAdvance;
      }
    }
    return true;
  }
  if (XDelta == YDelta) {
    /* Diagonal line */
    if (fInsertNodes) {
      for (i = 0; i <= XDelta; i++) {
        LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iXPos += XAdvance;
        iYPos++;
      }
    } else {
      for (i = 0; i <= XDelta; i++) {
        LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iXPos += XAdvance;
        iYPos++;
      }
    }
    return true;
  }

  /* Determine whether the line is X or Y major, and handle accordingly */
  if (XDelta >= YDelta) {
    /* X major line */
    /* Minimum # of pixels in a run in this line */
    WholeStep = XDelta / YDelta;

    /* Error term adjust each time Y steps by 1; used to tell when one
       extra pixel should be drawn as part of a run, to account for
       fractional steps along the X axis per 1-pixel steps along Y */
    AdjUp = (XDelta % YDelta) * 2;

    /* Error term adjust when the error term turns over, used to factor
       out the X step made at that time */
    AdjDown = YDelta * 2;

    /* Initial error term; reflects an initial step of 0.5 along the Y
       axis */
    ErrorTerm = (XDelta % YDelta) - (YDelta * 2);

    /* The initial and last runs are partial, because Y advances only 0.5
       for these runs, rather than 1. Divide one full run, plus the
       initial pixel, between the initial and last runs */
    InitialPixelCount = (WholeStep / 2) + 1;
    FinalPixelCount = InitialPixelCount;

    /* If the basic run length is even and there's no fractional
       advance, we have one pixel that could go to either the initial
       or last partial run, which we'll arbitrarily allocate to the
       last run */
    if ((AdjUp == 0) && ((WholeStep & 0x01) == 0)) {
      InitialPixelCount--;
    }
    /* If there're an odd number of pixels per run, we have 1 pixel that can't
       be allocated to either the initial or last partial run, so we'll add 0.5
       to error term so this pixel will be handled by the normal full-run loop */
    if ((WholeStep & 0x01) != 0) {
      ErrorTerm += YDelta;
    }
    /* Draw the first, partial run of pixels */
    // DrawHorizontalRun(&ScreenPtr, XAdvance, InitialPixelCount, Color);
    if (fInsertNodes) {
      for (i = 0; i < InitialPixelCount; i++) {
        LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iXPos += XAdvance;
      }
    } else {
      for (i = 0; i < InitialPixelCount; i++) {
        LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iXPos += XAdvance;
      }
    }
    iYPos++;

    /* Draw all full runs */
    for (j = 0; j < (YDelta - 1); j++) {
      RunLength = WholeStep; /* run is at least this long */
      /* Advance the error term and add an extra pixel if the error
         term so indicates */
      if ((ErrorTerm += AdjUp) > 0) {
        RunLength++;
        ErrorTerm -= AdjDown; /* reset the error term */
      }
      /* Draw this scan line's run */
      // DrawHorizontalRun(&ScreenPtr, XAdvance, RunLength, Color);
      if (fInsertNodes) {
        for (i = 0; i < RunLength; i++) {
          LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
          iXPos += XAdvance;
        }
      } else {
        for (i = 0; i < RunLength; i++) {
          LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
          iXPos += XAdvance;
        }
      }
      iYPos++;
    }
    /* Draw the final run of pixels */
    // DrawHorizontalRun(&ScreenPtr, XAdvance, FinalPixelCount, Color);
    if (fInsertNodes) {
      for (i = 0; i < FinalPixelCount; i++) {
        LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iXPos += XAdvance;
      }
    } else {
      for (i = 0; i < FinalPixelCount; i++) {
        LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iXPos += XAdvance;
      }
    }
    iYPos++;
  } else {
    /* Y major line */

    /* Minimum # of pixels in a run in this line */
    WholeStep = YDelta / XDelta;

    /* Error term adjust each time X steps by 1; used to tell when 1 extra
       pixel should be drawn as part of a run, to account for
       fractional steps along the Y axis per 1-pixel steps along X */
    AdjUp = (YDelta % XDelta) * 2;

    /* Error term adjust when the error term turns over, used to factor
       out the Y step made at that time */
    AdjDown = XDelta * 2;

    /* Initial error term; reflects initial step of 0.5 along the X axis */
    ErrorTerm = (YDelta % XDelta) - (XDelta * 2);

    /* The initial and last runs are partial, because X advances only 0.5
       for these runs, rather than 1. Divide one full run, plus the
       initial pixel, between the initial and last runs */
    InitialPixelCount = (WholeStep / 2) + 1;
    FinalPixelCount = InitialPixelCount;

    /* If the basic run length is even and there's no fractional advance, we
       have 1 pixel that could go to either the initial or last partial run,
       which we'll arbitrarily allocate to the last run */
    if ((AdjUp == 0) && ((WholeStep & 0x01) == 0)) {
      InitialPixelCount--;
    }
    /* If there are an odd number of pixels per run, we have one pixel
       that can't be allocated to either the initial or last partial
       run, so we'll add 0.5 to the error term so this pixel will be
       handled by the normal full-run loop */
    if ((WholeStep & 0x01) != 0) {
      ErrorTerm += XDelta;
    }
    /* Draw the first, partial run of pixels */
    if (fInsertNodes) {
      for (i = 0; i < InitialPixelCount; i++) {
        LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iYPos++;
      }
    } else {
      for (i = 0; i < InitialPixelCount; i++) {
        LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iYPos++;
      }
    }
    iXPos += XAdvance;
    // DrawVerticalRun(&ScreenPtr, XAdvance, InitialPixelCount, Color);

    /* Draw all full runs */
    for (j = 0; j < (XDelta - 1); j++) {
      RunLength = WholeStep; /* run is at least this long */
      /* Advance the error term and add an extra pixel if the error
         term so indicates */
      if ((ErrorTerm += AdjUp) > 0) {
        RunLength++;
        ErrorTerm -= AdjDown; /* reset the error term */
      }
      /* Draw this scan line's run */
      // DrawVerticalRun(&ScreenPtr, XAdvance, RunLength, Color);
      if (fInsertNodes) {
        for (i = 0; i < RunLength; i++) {
          LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
          iYPos++;
        }
      } else {
        for (i = 0; i < RunLength; i++) {
          LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
          iYPos++;
        }
      }
      iXPos += XAdvance;
    }
    /* Draw the final run of pixels */
    // DrawVerticalRun(&ScreenPtr, XAdvance, FinalPixelCount, Color);
    if (fInsertNodes) {
      for (i = 0; i < FinalPixelCount; i++) {
        LightInsertNode(iLight, usCurNode, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iYPos++;
      }
    } else {
      for (i = 0; i < FinalPixelCount; i++) {
        LightAddNode(iLight, iStartX, iStartY, iXPos, iYPos, ubStartIntens, usFlags);
        iYPos++;
      }
    }
    iXPos += XAdvance;
  }
  return true;
}

/****************************************************************************************
        LightGenerateElliptical

                Creates an elliptical light, taking two radii.

***************************************************************************************/
function LightGenerateElliptical(iLight: INT32, iIntensity: UINT8, iA: INT16, iB: INT16): boolean {
  let iX: INT16;
  let iY: INT16;
  let WorkingX: INT32;
  let WorkingY: INT32;
  let ASquared: DOUBLE;
  let BSquared: DOUBLE;
  let Temp: DOUBLE;

  iX = 0;
  iY = 0;
  ASquared = iA * iA;
  BSquared = iB * iB;

  /* Draw the four symmetric arcs for which X advances faster (that is,
     for which X is the major axis) */
  /* Draw the initial top & bottom points */
  LightCastRay(iLight, iX, iY, iX, (iY + iB), iIntensity, 1);
  LightCastRay(iLight, iX, iY, iX, (iY - iB), iIntensity, 1);

  /* Draw the four arcs */
  for (WorkingX = 0;;) {
    /* Advance one pixel along the X axis */
    WorkingX++;

    /* Calculate the corresponding point along the Y axis. Guard
       against floating-point roundoff making the intermediate term
       less than 0 */
    Temp = BSquared - (BSquared * WorkingX * WorkingX / ASquared);

    if (Temp >= 0)
      WorkingY = (Math.sqrt(Temp) + 0.5);
    else
      WorkingY = 0;

    /* Stop if X is no longer the major axis (the arc has passed the
       45-degree point) */
    if ((WorkingY / BSquared) <= (WorkingX / ASquared))
      break;

    /* Draw the 4 symmetries of the current point */
    LightCastRay(iLight, iX, iY, (iX + WorkingX), (iY - WorkingY), iIntensity, 1);
    LightCastRay(iLight, iX, iY, (iX - WorkingX), (iY - WorkingY), iIntensity, 1);
    LightCastRay(iLight, iX, iY, (iX + WorkingX), (iY + WorkingY), iIntensity, 1);
    LightCastRay(iLight, iX, iY, (iX - WorkingX), (iY + WorkingY), iIntensity, 1);
  }

  /* Draw the four symmetric arcs for which Y advances faster (that is,
     for which Y is the major axis) */
  /* Draw the initial left & right points */
  LightCastRay(iLight, iX, iY, (iX + iA), iY, iIntensity, 1);
  LightCastRay(iLight, iX, iY, (iX - iA), iY, iIntensity, 1);

  /* Draw the four arcs */
  for (WorkingY = 0;;) {
    /* Advance one pixel along the Y axis */
    WorkingY++;

    /* Calculate the corresponding point along the X axis. Guard
       against floating-point roundoff making the intermediate term
       less than 0 */
    Temp = ASquared - (ASquared * WorkingY * WorkingY / BSquared);

    if (Temp >= 0)
      WorkingX = (Math.sqrt(Temp) + 0.5);
    else
      WorkingX = 0;

    /* Stop if Y is no longer the major axis (the arc has passed the
       45-degree point) */
    if ((WorkingX / ASquared) < (WorkingY / BSquared))
      break;

    /* Draw the 4 symmetries of the current point */
    LightCastRay(iLight, iX, iY, (iX + WorkingX), (iY - WorkingY), iIntensity, 1);
    LightCastRay(iLight, iX, iY, (iX - WorkingX), (iY - WorkingY), iIntensity, 1);
    LightCastRay(iLight, iX, iY, (iX + WorkingX), (iY + WorkingY), iIntensity, 1);
    LightCastRay(iLight, iX, iY, (iX - WorkingX), (iY + WorkingY), iIntensity, 1);
  }

  return true;
}

/****************************************************************************************
        LightGenerateSquare

                Creates an square light, taking two radii.

***************************************************************************************/
function LightGenerateSquare(iLight: INT32, iIntensity: UINT8, iA: INT16, iB: INT16): boolean {
  let iX: INT16;
  let iY: INT16;

  for (iX = 0 - iA; iX <= 0 + iA; iX++)
    LightCastRay(iLight, 0, 0, iX, (0 - iB), iIntensity, 1);

  for (iX = 0 - iA; iX <= 0 + iA; iX++)
    LightCastRay(iLight, 0, 0, iX, (0 + iB), iIntensity, 1);

  for (iY = 0 - iB; iY <= 0 + iB; iY++)
    LightCastRay(iLight, 0, 0, (0 - iA), iY, iIntensity, 1);

  for (iY = 0 - iB; iY <= 0 + iB; iY++)
    LightCastRay(iLight, 0, 0, (0 + iA), iY, iIntensity, 1);

  /*for(iY=0-iB; iY <= 0+iB; iY++)
          LightCastRay(iLight, 0, iY, (INT16)(0+iA), iY, iIntensity, 1);

  for(iY=0+iB; iY >= 0-iB; iY--)
          LightCastRay(iLight, 0, iY, (INT16)(0-iA), iY, iIntensity, 1);

  for(iX=0-iA; iX <= 0+iA; iX++)
          LightCastRay(iLight, iX, 0, iX, (INT16)(0+iB), iIntensity, 1);

  for(iX=0+iA; iX >= 0-iA; iX--)
          LightCastRay(iLight, iX, 0, iX, (INT16)(0-iB), iIntensity, 1); */

  return true;
}

/****************************************************************************************
        LightGenerateBeam

                Creates a directional light.

***************************************************************************************/
function LightGenerateBeam(iLight: INT32, iIntensity: UINT8, iLength: INT16, iRadius: INT16, iDirection: INT16): boolean {
  return false;
}

/****************************************************************************************
        LightSetBaseLevel

                Sets the current and natural light settings for all tiles in the world.

***************************************************************************************/
export function LightSetBaseLevel(iIntensity: UINT8): boolean {
  let iCountY: INT16;
  let iCountX: INT16;
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  ubAmbientLightLevel = iIntensity;

  if (!gfEditMode) {
    // Loop for all good guys in tactical map and add a light if required
    for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
      pSoldier = MercSlots[cnt];

      if (pSoldier != null) {
        if (pSoldier.value.bTeam == gbPlayerNum) {
          // Re-create soldier lights
          ReCreateSoldierLight(pSoldier);
        }
      }
    }
  }

  for (iCountY = 0; iCountY < WORLD_ROWS; iCountY++)
    for (iCountX = 0; iCountX < WORLD_COLS; iCountX++)
      LightSetNaturalTile(iCountX, iCountY, iIntensity);

  LightSpriteRenderAll();

  if (iIntensity >= LIGHT_DUSK_CUTOFF)
    RenderSetShadows(false);
  else
    RenderSetShadows(true);

  return true;
}

/****************************************************************************************
        LightAddBaseLevel

                Adds a light value to all the tiles in the world

***************************************************************************************/
export function LightAddBaseLevel(uiLightType: UINT32, iIntensity: UINT8): boolean {
  let iCountY: INT16;
  let iCountX: INT16;

  ubAmbientLightLevel = Math.max(SHADE_MAX, ubAmbientLightLevel - iIntensity);

  for (iCountY = 0; iCountY < WORLD_ROWS; iCountY++)
    for (iCountX = 0; iCountX < WORLD_COLS; iCountX++)
      LightAddTile(uiLightType, iCountX, iCountY, iCountX, iCountY, iIntensity, LIGHT_IGNORE_WALLS | LIGHT_EVERYTHING, false);

  if (ubAmbientLightLevel >= LIGHT_DUSK_CUTOFF)
    RenderSetShadows(false);
  else
    RenderSetShadows(true);

  return true;
}

/****************************************************************************************
        LightSubtractBaseLevel

                Sets the current and natural light settings for all tiles in the world.

***************************************************************************************/
export function LightSubtractBaseLevel(uiLightType: UINT32, iIntensity: UINT8): boolean {
  let iCountY: INT16;
  let iCountX: INT16;

  ubAmbientLightLevel = Math.min(SHADE_MIN, ubAmbientLightLevel + iIntensity);

  for (iCountY = 0; iCountY < WORLD_ROWS; iCountY++)
    for (iCountX = 0; iCountX < WORLD_COLS; iCountX++)
      LightSubtractTile(uiLightType, iCountX, iCountY, iCountX, iCountY, iIntensity, LIGHT_IGNORE_WALLS | LIGHT_EVERYTHING, false);

  if (ubAmbientLightLevel >= LIGHT_DUSK_CUTOFF)
    RenderSetShadows(false);
  else
    RenderSetShadows(true);

  return true;
}

/****************************************************************************************
        LightCreateOmni

                Creates a circular light.

***************************************************************************************/
export function LightCreateOmni(ubIntensity: UINT8, iRadius: INT16): INT32 {
  let iLight: INT32;
  let usName: string /* UINT8[14] */;

  iLight = LightGetFree();
  if (iLight != (-1)) {
    LightGenerateElliptical(iLight, ubIntensity, (iRadius * DISTANCE_SCALE), (iRadius * DISTANCE_SCALE));
  }

  usName = sprintf("LTO%d.LHT", iRadius);
  pLightNames[iLight] = MemAlloc(usName.length + 1);
  pLightNames[iLight] = usName;

  return iLight;
}

/****************************************************************************************
        LightCreateSquare

                Creates a square light.

***************************************************************************************/
function LightCreateSquare(ubIntensity: UINT8, iRadius1: INT16, iRadius2: INT16): INT32 {
  let iLight: INT32;
  let usName: string /* UINT8[14] */;

  iLight = LightGetFree();
  if (iLight != (-1)) {
    LightGenerateSquare(iLight, ubIntensity, (iRadius1 * DISTANCE_SCALE), (iRadius2 * DISTANCE_SCALE));
  }

  usName = sprintf("LTS%d-%d.LHT", iRadius1, iRadius2);
  pLightNames[iLight] = MemAlloc(usName.length + 1);
  pLightNames[iLight] = usName;

  return iLight;
}

/****************************************************************************************
        LightCreateOval

                Creates an elliptical light.

***************************************************************************************/
function LightCreateElliptical(ubIntensity: UINT8, iRadius1: INT16, iRadius2: INT16): INT32 {
  let iLight: INT32;
  let usName: string /* UINT8[14] */;

  iLight = LightGetFree();
  if (iLight != (-1))
    LightGenerateElliptical(iLight, ubIntensity, (iRadius1 * DISTANCE_SCALE), (iRadius2 * DISTANCE_SCALE));

  usName = sprintf("LTE%d-%d.LHT", iRadius1, iRadius2);
  pLightNames[iLight] = MemAlloc(usName.length + 1);
  pLightNames[iLight] = usName;

  return iLight;
}

/****************************************************************************************
        LightIlluminateWall

                Renders a light template at the specified X,Y coordinates.

***************************************************************************************/
function LightIlluminateWall(iSourceX: INT16, iSourceY: INT16, iTileX: INT16, iTileY: INT16, pStruct: Pointer<LEVELNODE>): boolean {
  //	return( LightTileHasWall( iSourceX, iSourceY, iTileX, iTileY ) );

  return true;
}

/****************************************************************************************
        LightDraw

                Renders a light template at the specified X,Y coordinates.

***************************************************************************************/
export function LightDraw(uiLightType: UINT32, iLight: INT32, iX: INT16, iY: INT16, uiSprite: UINT32): boolean {
  let pLight: Pointer<LIGHT_NODE>;
  let uiCount: UINT16;
  let usNodeIndex: UINT16;
  let uiFlags: UINT32;
  let iOldX: INT32;
  let iOldY: INT32;
  let fBlocked: boolean = false;
  let fOnlyWalls: boolean;

  // MAP_ELEMENT * pMapElement;

  if (pLightList[iLight] == null)
    return false;

  // clear out all the flags
  for (uiCount = 0; uiCount < usTemplateSize[iLight]; uiCount++) {
    pLight = pLightList[iLight] + uiCount;
    pLight.value.uiFlags &= (~LIGHT_NODE_DRAWN);
  }

  /*
          if (!(LightSprites[uiSprite].uiFlags & MERC_LIGHT))
          {
                  uiFlags |= LIGHT_FAKE

                  pMapElement = &(gpWorldLevelData[]);
                  if (pMapElement->pLand != NULL)
                  {
                          // only do this for visible locations
                          // adjust tile's recorded light level
                          pMapElement->sSumRealLight1+=sShadeAdd;

                          sSum=pMapElement->pLand->ubNaturalShadeLevel - __max( pMapElement->sSumRealLights[0], pMapElement->pLand->sSumLights[1]);

                          sSum=__min(SHADE_MIN, sSum);
                          sSum=__max(SHADE_MAX, sSum);

                          gpWorldLevelData[ ].ubRealShadeLevel = (UINT8) sSum;

                  }

          }
  */

  iOldX = iX;
  iOldY = iY;

  for (uiCount = 0; uiCount < usRaySize[iLight]; uiCount++) {
    usNodeIndex = (pLightRayList[iLight] + uiCount).value;

    if (!(usNodeIndex & LIGHT_NEW_RAY)) {
      fBlocked = false;
      fOnlyWalls = false;

      pLight = pLightList[iLight] + (usNodeIndex & (~LIGHT_BACKLIGHT));

      if (!(LightSprites[uiSprite].uiFlags & LIGHT_SPR_ONROOF)) {
        if (LightTileBlocked(iOldX, iOldY, (iX + pLight.value.iDX), (iY + pLight.value.iDY))) {
          uiCount = LightFindNextRay(iLight, uiCount);

          fOnlyWalls = true;
          fBlocked = true;
        }
      }

      if (!(pLight.value.uiFlags & LIGHT_NODE_DRAWN) && (pLight.value.ubLight)) {
        uiFlags = (usNodeIndex & LIGHT_BACKLIGHT);
        if (LightSprites[uiSprite].uiFlags & MERC_LIGHT)
          uiFlags |= LIGHT_FAKE;
        if (LightSprites[uiSprite].uiFlags & LIGHT_SPR_ONROOF)
          uiFlags |= LIGHT_ROOF_ONLY;

        LightAddTile(uiLightType, iOldX, iOldY, (iX + pLight.value.iDX), (iY + pLight.value.iDY), pLight.value.ubLight, uiFlags, fOnlyWalls);

        pLight.value.uiFlags |= LIGHT_NODE_DRAWN;
      }

      if (fBlocked) {
        iOldX = iX;
        iOldY = iY;
      } else {
        iOldX = iX + pLight.value.iDX;
        iOldY = iY + pLight.value.iDY;
      }
    } else {
      iOldX = iX;
      iOldY = iY;
    }
  }

  return true;
}

function LightRevealWall(sX: INT16, sY: INT16, sSrcX: INT16, sSrcY: INT16): boolean {
  let pStruct: Pointer<LEVELNODE>;
  let uiTile: UINT32;
  let fRerender: boolean = false;
  let fHitWall: boolean = false;
  let fDoRightWalls: boolean = true;
  let fDoLeftWalls: boolean = true;
  let TileElem: Pointer<TILE_ELEMENT>;

  Assert(gpWorldLevelData != null);

  uiTile = MAPROWCOLTOPOS(sY, sX);

  if (sX < sSrcX)
    fDoRightWalls = false;

  if (sY < sSrcY)
    fDoLeftWalls = false;

  // IF A FENCE, RETURN FALSE
  if (IsFencePresentAtGridno(uiTile)) {
    return false;
  }

  pStruct = gpWorldLevelData[uiTile].pStructHead;
  while (pStruct != null) {
    TileElem = addressof(gTileDatabase[pStruct.value.usIndex]);
    switch (TileElem.value.usWallOrientation) {
      case Enum314.INSIDE_TOP_RIGHT:
      case Enum314.OUTSIDE_TOP_RIGHT:
        if (!fDoRightWalls)
          fDoLeftWalls = false;
        break;

      case Enum314.INSIDE_TOP_LEFT:
      case Enum314.OUTSIDE_TOP_LEFT:
        if (!fDoLeftWalls)
          fDoRightWalls = false;
        break;
    }
    pStruct = pStruct.value.pNext;
  }

  pStruct = gpWorldLevelData[uiTile].pStructHead;
  while (pStruct != null) {
    TileElem = addressof(gTileDatabase[pStruct.value.usIndex]);
    switch (TileElem.value.usWallOrientation) {
      case Enum314.NO_ORIENTATION:
        break;

      case Enum314.INSIDE_TOP_RIGHT:
      case Enum314.OUTSIDE_TOP_RIGHT:
        fHitWall = true;
        if ((fDoRightWalls) && (sX >= sSrcX)) {
          pStruct.value.uiFlags |= LEVELNODE_REVEAL;
          fRerender = true;
        }
        break;

      case Enum314.INSIDE_TOP_LEFT:
      case Enum314.OUTSIDE_TOP_LEFT:
        fHitWall = true;
        if ((fDoLeftWalls) && (sY >= sSrcY)) {
          pStruct.value.uiFlags |= LEVELNODE_REVEAL;
          fRerender = true;
        }
        break;
    }
    pStruct = pStruct.value.pNext;
  }

  if (fRerender)
    SetRenderFlags(RENDER_FLAG_FULL);

  return fHitWall;
}

function LightHideWall(sX: INT16, sY: INT16, sSrcX: INT16, sSrcY: INT16): boolean {
  let pStruct: Pointer<LEVELNODE>;
  let uiTile: UINT32;
  let fRerender: boolean = false;
  let fHitWall: boolean = false;
  let fDoRightWalls: boolean = true;
  let fDoLeftWalls: boolean = true;
  let TileElem: Pointer<TILE_ELEMENT>;

  Assert(gpWorldLevelData != null);

  uiTile = MAPROWCOLTOPOS(sY, sX);

  if (sX < sSrcX)
    fDoRightWalls = false;

  if (sY < sSrcY)
    fDoLeftWalls = false;

  pStruct = gpWorldLevelData[uiTile].pStructHead;
  while (pStruct != null) {
    TileElem = addressof(gTileDatabase[pStruct.value.usIndex]);
    switch (TileElem.value.usWallOrientation) {
      case Enum314.INSIDE_TOP_RIGHT:
      case Enum314.OUTSIDE_TOP_RIGHT:
        if (!fDoRightWalls)
          fDoLeftWalls = false;
        break;

      case Enum314.INSIDE_TOP_LEFT:
      case Enum314.OUTSIDE_TOP_LEFT:
        if (!fDoLeftWalls)
          fDoRightWalls = false;
        break;
    }
    pStruct = pStruct.value.pNext;
  }

  pStruct = gpWorldLevelData[uiTile].pStructHead;
  while (pStruct != null) {
    TileElem = addressof(gTileDatabase[pStruct.value.usIndex]);
    switch (TileElem.value.usWallOrientation) {
      case Enum314.NO_ORIENTATION:
        break;

      case Enum314.INSIDE_TOP_RIGHT:
      case Enum314.OUTSIDE_TOP_RIGHT:
        fHitWall = true;
        if ((fDoRightWalls) && (sX >= sSrcX)) {
          pStruct.value.uiFlags &= (~LEVELNODE_REVEAL);
          fRerender = true;
        }
        break;

      case Enum314.INSIDE_TOP_LEFT:
      case Enum314.OUTSIDE_TOP_LEFT:
        fHitWall = true;
        if ((fDoLeftWalls) && (sY >= sSrcY)) {
          pStruct.value.uiFlags &= (~LEVELNODE_REVEAL);
          fRerender = true;
        }
        break;
    }
    pStruct = pStruct.value.pNext;
  }

  if (fRerender)
    SetRenderFlags(RENDER_FLAG_FULL);

  return fHitWall;
}

/****************************************************************************************
        CalcTranslucentWalls

                Tags walls as being translucent using a light template.

***************************************************************************************/
function CalcTranslucentWalls(iX: INT16, iY: INT16): boolean {
  let pLight: Pointer<LIGHT_NODE>;
  let uiCount: UINT16;
  let usNodeIndex: UINT16;
  if (pLightList[0] == null)
    return false;
  for (uiCount = 0; uiCount < usRaySize[0]; uiCount++) {
    usNodeIndex = (pLightRayList[0] + uiCount).value;

    if (!(usNodeIndex & LIGHT_NEW_RAY)) {
      pLight = pLightList[0] + (usNodeIndex & (~LIGHT_BACKLIGHT));

      // Kris:  added map boundary checking!!!
      if (LightRevealWall(Math.min(Math.max((iX + pLight.value.iDX), 0), WORLD_COLS - 1), Math.min(Math.max((iY + pLight.value.iDY), 0), WORLD_ROWS - 1), Math.min(Math.max(iX, 0), WORLD_COLS - 1), Math.min(Math.max(iY, 0), WORLD_ROWS - 1))) {
        uiCount = LightFindNextRay(0, uiCount);
        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }
  }

  return true;
}

function LightGreenTile(sX: INT16, sY: INT16, sSrcX: INT16, sSrcY: INT16): boolean {
  let pStruct: Pointer<LEVELNODE>;
  let pLand: Pointer<LEVELNODE>;
  let uiTile: UINT32;
  let fRerender: boolean = false;
  let fHitWall: boolean = false;
  let fThroughWall: boolean = false;
  let TileElem: Pointer<TILE_ELEMENT>;

  Assert(gpWorldLevelData != null);

  uiTile = MAPROWCOLTOPOS(sY, sX);
  pStruct = gpWorldLevelData[uiTile].pStructHead;

  if ((sX < sSrcX) || (sY < sSrcY))
    fThroughWall = true;

  while (pStruct != null) {
    TileElem = addressof(gTileDatabase[pStruct.value.usIndex]);
    switch (TileElem.value.usWallOrientation) {
      case Enum314.NO_ORIENTATION:
        break;

      case Enum314.INSIDE_TOP_RIGHT:
      case Enum314.OUTSIDE_TOP_RIGHT:
        fHitWall = true;
        if (sX >= sSrcX) {
          pStruct.value.uiFlags |= LEVELNODE_REVEAL;
          fRerender = true;
        }
        break;

      case Enum314.INSIDE_TOP_LEFT:
      case Enum314.OUTSIDE_TOP_LEFT:
        fHitWall = true;
        if (sY >= sSrcY) {
          pStruct.value.uiFlags |= LEVELNODE_REVEAL;
          fRerender = true;
        }
        break;
    }
    pStruct = pStruct.value.pNext;
  }

  // if(fRerender)
  //{
  pLand = gpWorldLevelData[uiTile].pLandHead;
  while (pLand != null) {
    pLand.value.ubShadeLevel = 0;
    pLand = pLand.value.pNext;
  }

  gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_REDRAW;
  SetRenderFlags(RENDER_FLAG_MARKED);
  //}

  return fHitWall;
}

/****************************************************************************************
        LightShowRays

                Draws a template by making the ground tiles green. Must be polled once for
each tile drawn to facilitate animating the drawing process for debugging.

***************************************************************************************/
export function LightShowRays(iX: INT16, iY: INT16, fReset: boolean): boolean {
  let pLight: Pointer<LIGHT_NODE>;
  /* static */ let uiCount: UINT16 = 0;
  let usNodeIndex: UINT16;

  if (fReset)
    uiCount = 0;

  if (pLightList[0] == null)
    return false;

  if (uiCount < usRaySize[0]) {
    usNodeIndex = (pLightRayList[0] + uiCount).value;

    if (!(usNodeIndex & LIGHT_NEW_RAY)) {
      pLight = pLightList[0] + (usNodeIndex & (~LIGHT_BACKLIGHT));

      if (LightGreenTile((iX + pLight.value.iDX), (iY + pLight.value.iDY), iX, iY)) {
        uiCount = LightFindNextRay(0, uiCount);
        SetRenderFlags(RENDER_FLAG_MARKED);
      }
    }

    uiCount++;
    return true;
  } else
    return false;
}

/****************************************************************************************
        LightHideGreen

        Removes the green from the tiles that was drawn to show the path of the rays.

***************************************************************************************/
function LightHideGreen(sX: INT16, sY: INT16, sSrcX: INT16, sSrcY: INT16): boolean {
  let pStruct: Pointer<LEVELNODE>;
  let pLand: Pointer<LEVELNODE>;
  let uiTile: UINT32;
  let fRerender: boolean = false;
  let fHitWall: boolean = false;
  let TileElem: Pointer<TILE_ELEMENT>;

  Assert(gpWorldLevelData != null);

  uiTile = MAPROWCOLTOPOS(sY, sX);
  pStruct = gpWorldLevelData[uiTile].pStructHead;

  while (pStruct != null) {
    TileElem = addressof(gTileDatabase[pStruct.value.usIndex]);
    switch (TileElem.value.usWallOrientation) {
      case Enum314.NO_ORIENTATION:
        break;

      case Enum314.INSIDE_TOP_RIGHT:
      case Enum314.OUTSIDE_TOP_RIGHT:
        fHitWall = true;
        if (sX >= sSrcX) {
          pStruct.value.uiFlags &= (~LEVELNODE_REVEAL);
          fRerender = true;
        }
        break;

      case Enum314.INSIDE_TOP_LEFT:
      case Enum314.OUTSIDE_TOP_LEFT:
        fHitWall = true;
        if (sY >= sSrcY) {
          pStruct.value.uiFlags &= (~LEVELNODE_REVEAL);
          fRerender = true;
        }
        break;
    }
    pStruct = pStruct.value.pNext;
  }

  // if(fRerender)
  //{
  pLand = gpWorldLevelData[uiTile].pLandHead;
  while (pLand != null) {
    pLand.value.ubShadeLevel = pLand.value.ubNaturalShadeLevel;
    pLand = pLand.value.pNext;
  }

  gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_REDRAW;
  SetRenderFlags(RENDER_FLAG_MARKED);
  //}

  return fHitWall;
}

/****************************************************************************************
        LightHideRays

                Hides walls that were revealed by CalcTranslucentWalls.

***************************************************************************************/
export function LightHideRays(iX: INT16, iY: INT16): boolean {
  let pLight: Pointer<LIGHT_NODE>;
  let uiCount: UINT16;
  let usNodeIndex: UINT16;

  if (pLightList[0] == null)
    return false;

  for (uiCount = 0; uiCount < usRaySize[0]; uiCount++) {
    usNodeIndex = (pLightRayList[0] + uiCount).value;

    if (!(usNodeIndex & LIGHT_NEW_RAY)) {
      pLight = pLightList[0] + (usNodeIndex & (~LIGHT_BACKLIGHT));

      if (LightHideWall((iX + pLight.value.iDX), (iY + pLight.value.iDY), iX, iY)) {
        uiCount = LightFindNextRay(0, uiCount);
        SetRenderFlags(RENDER_FLAG_MARKED);
      }
    }
  }

  return true;
}

/****************************************************************************************
        ApplyTranslucencyToWalls

                Hides walls that were revealed by CalcTranslucentWalls.

***************************************************************************************/
export function ApplyTranslucencyToWalls(iX: INT16, iY: INT16): boolean {
  let pLight: Pointer<LIGHT_NODE>;
  let uiCount: UINT16;
  let usNodeIndex: UINT16;

  if (pLightList[0] == null)
    return false;

  for (uiCount = 0; uiCount < usRaySize[0]; uiCount++) {
    usNodeIndex = (pLightRayList[0] + uiCount).value;

    if (!(usNodeIndex & LIGHT_NEW_RAY)) {
      pLight = pLightList[0] + (usNodeIndex & (~LIGHT_BACKLIGHT));
      // Kris:  added map boundary checking!!!
      if (LightHideWall(Math.min(Math.max((iX + pLight.value.iDX), 0), WORLD_COLS - 1), Math.min(Math.max((iY + pLight.value.iDY), 0), WORLD_ROWS - 1), Math.min(Math.max(iX, 0), WORLD_COLS - 1), Math.min(Math.max(iY, 0), WORLD_ROWS - 1))) {
        uiCount = LightFindNextRay(0, uiCount);
        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }
  }

  return true;
}

/****************************************************************************************
        LightTranslucentTrees

                Makes all the near-side trees around a given coordinate translucent.
***************************************************************************************/
function LightTranslucentTrees(iX: INT16, iY: INT16): boolean {
  let iCountX: INT32;
  let iCountY: INT32;
  let uiTile: UINT32;
  let pNode: Pointer<LEVELNODE>;
  let fRerender: boolean = false;
  let fTileFlags: UINT32;

  for (iCountY = iY; iCountY < (iY + LIGHT_TREE_REVEAL); iCountY++)
    for (iCountX = iX; iCountX < (iX + LIGHT_TREE_REVEAL); iCountX++) {
      uiTile = MAPROWCOLTOPOS(iCountY, iCountX);
      pNode = gpWorldLevelData[uiTile].pStructHead;
      while (pNode != null) {
        GetTileFlags(pNode.value.usIndex, addressof(fTileFlags));

        if (fTileFlags & FULL3D_TILE) {
          if (!(pNode.value.uiFlags & LEVELNODE_REVEALTREES)) {
            // pNode->uiFlags |= ( LEVELNODE_REVEALTREES | LEVELNODE_ERASEZ );
            pNode.value.uiFlags |= (LEVELNODE_REVEALTREES);
            gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_REDRAW;
          }

          fRerender = true;
        }
        pNode = pNode.value.pNext;
      }
    }

  if (fRerender) {
    // SetRenderFlags(RENDER_FLAG_MARKED);
    SetRenderFlags(RENDER_FLAG_FULL);
    return true;
  } else
    return false;
}

/****************************************************************************************
        LightHideTrees

                Removes the translucency from any trees in the area.
***************************************************************************************/
function LightHideTrees(iX: INT16, iY: INT16): boolean {
  let iCountX: INT32;
  let iCountY: INT32;
  let uiTile: UINT32;
  let pNode: Pointer<LEVELNODE>;
  let fRerender: boolean = false;
  let fTileFlags: UINT32;

  // Kris:  added map boundary checking!!!
  for (iCountY = Math.max(iY - LIGHT_TREE_REVEAL, 0); iCountY < Math.min(iY + LIGHT_TREE_REVEAL, WORLD_ROWS - 1); iCountY++)
    for (iCountX = Math.max(iX - LIGHT_TREE_REVEAL, 0); iCountX < Math.min(iX + LIGHT_TREE_REVEAL, WORLD_COLS - 1); iCountX++) {
      uiTile = MAPROWCOLTOPOS(iCountY, iCountX);
      pNode = gpWorldLevelData[uiTile].pStructHead;
      while (pNode != null) {
        GetTileFlags(pNode.value.usIndex, addressof(fTileFlags));

        if (fTileFlags & FULL3D_TILE) {
          if ((pNode.value.uiFlags & LEVELNODE_REVEALTREES)) {
            // pNode->uiFlags  &=(~( LEVELNODE_REVEALTREES | LEVELNODE_ERASEZ ) );
            pNode.value.uiFlags &= (~(LEVELNODE_REVEALTREES));
            gpWorldLevelData[uiTile].uiFlags |= MAPELEMENT_REDRAW;
          }

          fRerender = true;
        }
        pNode = pNode.value.pNext;
      }
    }

  if (fRerender) {
    // SetRenderFlags(RENDER_FLAG_MARKED);
    SetRenderFlags(RENDER_FLAG_FULL);
    return true;
  } else
    return false;
}

/****************************************************************************************
        LightErase

                Reverts all tiles a given light affects to their natural light levels.

***************************************************************************************/
function LightErase(uiLightType: UINT32, iLight: INT32, iX: INT16, iY: INT16, uiSprite: UINT32): boolean {
  let pLight: Pointer<LIGHT_NODE>;
  let uiCount: UINT16;
  let usNodeIndex: UINT16;
  let uiFlags: UINT32;
  let iOldX: INT32;
  let iOldY: INT32;
  let fBlocked: boolean = false;
  let fOnlyWalls: boolean;

  if (pLightList[iLight] == null)
    return false;

  // clear out all the flags
  for (uiCount = 0; uiCount < usTemplateSize[iLight]; uiCount++) {
    pLight = pLightList[iLight] + uiCount;
    pLight.value.uiFlags &= (~LIGHT_NODE_DRAWN);
  }

  iOldX = iX;
  iOldY = iY;

  for (uiCount = 0; uiCount < usRaySize[iLight]; uiCount++) {
    usNodeIndex = (pLightRayList[iLight] + uiCount).value;
    if (!(usNodeIndex & LIGHT_NEW_RAY)) {
      fBlocked = false;
      fOnlyWalls = false;

      pLight = pLightList[iLight] + (usNodeIndex & (~LIGHT_BACKLIGHT));

      if (!(LightSprites[uiSprite].uiFlags & LIGHT_SPR_ONROOF)) {
        if (LightTileBlocked(iOldX, iOldY, (iX + pLight.value.iDX), (iY + pLight.value.iDY))) {
          uiCount = LightFindNextRay(iLight, uiCount);

          fOnlyWalls = true;
          fBlocked = true;
        }
      }

      if (!(pLight.value.uiFlags & LIGHT_NODE_DRAWN) && (pLight.value.ubLight)) {
        uiFlags = (usNodeIndex & LIGHT_BACKLIGHT);
        if (LightSprites[uiSprite].uiFlags & MERC_LIGHT)
          uiFlags |= LIGHT_FAKE;
        if (LightSprites[uiSprite].uiFlags & LIGHT_SPR_ONROOF)
          uiFlags |= LIGHT_ROOF_ONLY;

        LightSubtractTile(uiLightType, iOldX, iOldY, (iX + pLight.value.iDX), (iY + pLight.value.iDY), pLight.value.ubLight, uiFlags, fOnlyWalls);
        pLight.value.uiFlags |= LIGHT_NODE_DRAWN;
      }

      if (fBlocked) {
        iOldX = iX;
        iOldY = iY;
      } else {
        iOldX = iX + pLight.value.iDX;
        iOldY = iY + pLight.value.iDY;
      }
    } else {
      iOldX = iX;
      iOldY = iY;
    }
  }

  return true;
}

/****************************************************************************************
        LightCalcRect

                Calculates the rect size of a given light, used in dirtying the screen after updating
        a light.

***************************************************************************************/
function LightCalcRect(iLight: INT32): boolean {
  let MaxRect: SGPRect = createSGPRect();
  let sXValue: INT16;
  let sYValue: INT16;
  let sDummy: INT16;
  let uiCount: UINT32;
  let pLight: Pointer<LIGHT_NODE>;

  if (pLightList[iLight] == null)
    return false;

  pLight = pLightList[iLight];

  MaxRect.iLeft = 99999;
  MaxRect.iRight = -99999;
  MaxRect.iTop = 99999;
  MaxRect.iBottom = -99999;

  for (uiCount = 0; uiCount < usTemplateSize[iLight]; uiCount++) {
    pLight = pLightList[iLight] + uiCount;
    if (pLight.value.ubLight) {
      MaxRect.iLeft = Math.min(MaxRect.iLeft, pLight.value.iDX);
      MaxRect.iRight = Math.max(MaxRect.iRight, pLight.value.iDX);
      MaxRect.iTop = Math.min(MaxRect.iTop, pLight.value.iDY);
      MaxRect.iBottom = Math.max(MaxRect.iBottom, pLight.value.iDY);
    }
  }

  FromCellToScreenCoordinates((MaxRect.iLeft * CELL_X_SIZE), (MaxRect.iTop * CELL_Y_SIZE), addressof(sDummy), addressof(sYValue));

  LightMapLeft[iLight] = MaxRect.iLeft;
  LightMapTop[iLight] = MaxRect.iTop;
  LightMapRight[iLight] = MaxRect.iRight;
  LightMapBottom[iLight] = MaxRect.iBottom;

  LightHeight[iLight] = -sYValue;
  LightYOffset[iLight] = sYValue;

  FromCellToScreenCoordinates((MaxRect.iRight * CELL_X_SIZE), (MaxRect.iBottom * CELL_Y_SIZE), addressof(sDummy), addressof(sYValue));
  LightHeight[iLight] += sYValue;

  FromCellToScreenCoordinates((MaxRect.iLeft * CELL_X_SIZE), (MaxRect.iBottom * CELL_Y_SIZE), addressof(sXValue), addressof(sDummy));
  LightWidth[iLight] = -sXValue;
  LightXOffset[iLight] = sXValue;

  FromCellToScreenCoordinates((MaxRect.iRight * CELL_X_SIZE), (MaxRect.iTop * CELL_Y_SIZE), addressof(sXValue), addressof(sDummy));
  LightWidth[iLight] += sXValue;

  LightHeight[iLight] += WORLD_TILE_X * 2;
  LightWidth[iLight] += WORLD_TILE_Y * 3;
  LightXOffset[iLight] -= WORLD_TILE_X * 2;
  LightYOffset[iLight] -= WORLD_TILE_Y * 2;

  return true;
}

/****************************************************************************************
        LightSave

                Saves the light list of a given template to a file. Passing in NULL for the
        filename forces the system to save the light with the internal filename (recommended).

***************************************************************************************/
export function LightSave(iLight: INT32, pFilename: string /* STR */): boolean {
  let hFile: HWFILE;
  let pName: string /* STR */;

  if (pLightList[iLight] == null)
    return false;
  else {
    if (pFilename == null)
      pName = pLightNames[iLight];
    else
      pName = pFilename;

    if ((hFile = FileOpen(pName, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, false)) != 0) {
      FileWrite(hFile, addressof(usTemplateSize[iLight]), sizeof(UINT16), null);
      FileWrite(hFile, pLightList[iLight], sizeof(LIGHT_NODE) * usTemplateSize[iLight], null);
      FileWrite(hFile, addressof(usRaySize[iLight]), sizeof(UINT16), null);
      FileWrite(hFile, pLightRayList[iLight], sizeof(UINT16) * usRaySize[iLight], null);

      FileClose(hFile);
    } else
      return false;
  }
  return true;
}

/****************************************************************************************
        LightLoad

                Loads a light template from disk. The light template number is returned, or (-1)
        if the file wasn't loaded.

***************************************************************************************/
function LightLoad(pFilename: string /* STR */): INT32 {
  let hFile: HWFILE;
  let pNewLight: Pointer<LIGHT_NODE> = null;
  let pLastLight: Pointer<LIGHT_NODE> = null;
  let iLight: INT32;

  if ((iLight = LightGetFree()) == (-1))
    return -1;
  else {
    if ((hFile = FileOpen(pFilename, FILE_ACCESS_READ, false)) != 0) {
      FileRead(hFile, addressof(usTemplateSize[iLight]), sizeof(UINT16), null);
      if ((pLightList[iLight] = MemAlloc(usTemplateSize[iLight] * sizeof(LIGHT_NODE))) == null) {
        usTemplateSize[iLight] = 0;
        return -1;
      }
      FileRead(hFile, pLightList[iLight], sizeof(LIGHT_NODE) * usTemplateSize[iLight], null);

      FileRead(hFile, addressof(usRaySize[iLight]), sizeof(UINT16), null);
      if ((pLightRayList[iLight] = MemAlloc(usRaySize[iLight] * sizeof(UINT16))) == null) {
        usTemplateSize[iLight] = 0;
        usRaySize[iLight] = 0;
        MemFree(pLightList[iLight]);
        return -1;
      }
      FileRead(hFile, pLightRayList[iLight], sizeof(UINT16) * usRaySize[iLight], null);

      FileClose(hFile);

      pLightNames[iLight] = MemAlloc(pFilename.length + 1);
      pLightNames[iLight] = pFilename;
    } else
      return -1;
  }
  LightCalcRect(iLight);
  return iLight;
}

/****************************************************************************************
        LightLoadCachedTemplate

                Figures out whether a light template is already in memory, or needs to be loaded from
        disk. Returns the index of the template, or (-1) if it couldn't be loaded.

***************************************************************************************/
function LightLoadCachedTemplate(pFilename: string /* STR */): INT32 {
  let iCount: INT32;

  for (iCount = 0; iCount < MAX_LIGHT_TEMPLATES; iCount++) {
    if ((pLightNames[iCount] != null) && !(stricmp(pFilename, pLightNames[iCount])))
      return iCount;
  }

  return LightLoad(pFilename);
}

export function LightGetColors(pPal: Pointer<SGPPaletteEntry>): UINT8 {
  if (pPal != null)
    memcpy(pPal, addressof(gpOrigLights[0]), sizeof(SGPPaletteEntry) * gubNumLightColors);

  return gubNumLightColors;
}

/****************************************************************************************
        LightSetColors

        Sets the number of light colors, and the RGB value for each.

***************************************************************************************/
let gfEditorForceRebuildAllColors: boolean = false;

export function LightSetColors(pPal: Pointer<SGPPaletteEntry>, ubNumColors: UINT8): boolean {
  let sRed: INT16;
  let sGreen: INT16;
  let sBlue: INT16;

  Assert(ubNumColors >= 1 && ubNumColors <= 2);
  Assert(pPal);

  if (pPal[0].peRed != gpLightColors[0].peRed || pPal[0].peGreen != gpLightColors[0].peGreen || pPal[0].peBlue != gpLightColors[0].peBlue) {
    // Set the entire tileset database so that it reloads everything.  It has to because the
    // colors have changed.
    SetAllNewTileSurfacesLoaded(true);
  }

  // before doing anything, get rid of all the old palettes
  DestroyTileShadeTables();

  // we will have at least one light color
  memcpy(addressof(gpLightColors[0]), addressof(pPal[0]), sizeof(SGPPaletteEntry));
  memcpy(addressof(gpOrigLights[0]), addressof(pPal[0]), sizeof(SGPPaletteEntry) * 2);

  gubNumLightColors = ubNumColors;

  // if there are two colors, calculate a third palette that is a mix of the two
  if (ubNumColors == 2) {
    sRed = Math.min(((pPal[0].peRed) * LVL1_L1_PER / 100 + (pPal[1].peRed) * LVL1_L2_PER / 100), 255);
    sGreen = Math.min(((pPal[0].peGreen) * LVL1_L1_PER / 100 + (pPal[1].peGreen) * LVL1_L2_PER / 100), 255);
    sBlue = Math.min(((pPal[0].peBlue) * LVL1_L1_PER / 100 + (pPal[1].peBlue) * LVL1_L2_PER / 100), 255);

    gpLightColors[1].peRed = (sRed);
    gpLightColors[1].peGreen = (sGreen);
    gpLightColors[1].peBlue = (sBlue);

    sRed = Math.min(((pPal[0].peRed) * LVL2_L1_PER / 100 + (pPal[1].peRed) * LVL2_L2_PER / 100), 255);
    sGreen = Math.min(((pPal[0].peGreen) * LVL2_L1_PER / 100 + (pPal[1].peGreen) * LVL2_L2_PER / 100), 255);
    sBlue = Math.min(((pPal[0].peBlue) * LVL2_L1_PER / 100 + (pPal[1].peBlue) * LVL2_L2_PER / 100), 255);

    gpLightColors[2].peRed = (sRed);
    gpLightColors[2].peGreen = (sGreen);
    gpLightColors[2].peBlue = (sBlue);
  }

  BuildTileShadeTables();

  // Build all palettes for all soldiers in the world
  // ( THIS FUNCTION WILL ERASE THEM IF THEY EXIST )
  RebuildAllSoldierShadeTables();

  RebuildAllCorpseShadeTables();

  SetRenderFlags(RENDER_FLAG_FULL);

  return true;
}

//---------------------------------------------------------------------------------------
// Light Manipulation Layer
//---------------------------------------------------------------------------------------

/********************************************************************************
 * LightSpriteGetFree
 *
 *		Returns the index of the next available sprite.
 *
 ********************************************************************************/
function LightSpriteGetFree(): INT32 {
  let iCount: INT32;

  for (iCount = 0; iCount < MAX_LIGHT_SPRITES; iCount++) {
    if (!(LightSprites[iCount].uiFlags & LIGHT_SPR_ACTIVE))
      return iCount;
  }

  return -1;
}

/********************************************************************************
 * LightSpriteCreate
 *
 *		Creates an instance of a light. The template is loaded if it isn't already.
 * If this function fails (out of sprites, or bad template name) it returns (-1).
 *
 ********************************************************************************/
export function LightSpriteCreate(pName: string /* STR */, uiLightType: UINT32): INT32 {
  let iSprite: INT32;

  if ((iSprite = LightSpriteGetFree()) != (-1)) {
    memset(addressof(LightSprites[iSprite]), 0, sizeof(LIGHT_SPRITE));
    LightSprites[iSprite].iX = WORLD_COLS + 1;
    LightSprites[iSprite].iY = WORLD_ROWS + 1;
    LightSprites[iSprite].iOldX = WORLD_COLS + 1;
    LightSprites[iSprite].iOldY = WORLD_ROWS + 1;
    LightSprites[iSprite].uiLightType = uiLightType;

    if ((LightSprites[iSprite].iTemplate = LightLoadCachedTemplate(pName)) == (-1))
      return -1;

    LightSprites[iSprite].uiFlags |= LIGHT_SPR_ACTIVE;
  }

  return iSprite;
}

/********************************************************************************
 * LightSpriteFake
 *
 *		Sets the flag of a light sprite to "fake" (in game for merc navig purposes)
 *
 ********************************************************************************/
export function LightSpriteFake(iSprite: INT32): boolean {
  if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ACTIVE) {
    LightSprites[iSprite].uiFlags |= MERC_LIGHT;
    return true;
  } else {
    return false;
  }
}

/********************************************************************************
 * LightSpriteDestroy
 *
 *		Removes an instance of a light. If it was on, it is erased from the scene.
 *
 ********************************************************************************/
export function LightSpriteDestroy(iSprite: INT32): boolean {
  if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ACTIVE) {
    if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ERASE) {
      if ((LightSprites[iSprite].iX < WORLD_COLS) && (LightSprites[iSprite].iY < WORLD_ROWS)) {
        LightErase(LightSprites[iSprite].uiLightType, LightSprites[iSprite].iTemplate, LightSprites[iSprite].iX, LightSprites[iSprite].iY, iSprite);
        LightSpriteDirty(iSprite);
      }
      LightSprites[iSprite].uiFlags &= (~LIGHT_SPR_ERASE);
    }

    LightSprites[iSprite].uiFlags &= (~LIGHT_SPR_ACTIVE);
    return true;
  }

  return false;
}

/********************************************************************************
 * LightSpriteRender
 *
 *		Currently unused.
 *
 ********************************************************************************/
function LightSpriteRender(): boolean {
  // INT32 iCount;
  // BOOLEAN fRenderLights=FALSE;

  return false;

  /*	for(iCount=0; iCount < MAX_LIGHT_SPRITES; iCount++)
          {
                  if(LightSprites[iCount].uiFlags&LIGHT_SPR_ACTIVE)
                  {
                          if((LightSprites[iCount].iX!=LightSprites[iCount].iOldX)
                                  || (LightSprites[iCount].iY!=LightSprites[iCount].iOldY)
                                  || (LightSprites[iCount].uiFlags&LIGHT_SPR_REDRAW))
                          {
                                  if(LightSprites[iCount].iOldX < WORLD_COLS)
                                  {
                                          fRenderLights=TRUE;
                                          LightSpriteDirty(iCount);
                                  }

                                  LightSprites[iCount].iOldX=LightSprites[iCount].iX;
                                  LightSprites[iCount].iOldY=LightSprites[iCount].iY;

                                  if(LightSprites[iCount].uiFlags&LIGHT_SPR_ON)
                                  {
                                                  LightSpriteDirty(iCount);
                                                  fRenderLights=TRUE;
                                  }

                                  LightSprites[iCount].uiFlags&=(~LIGHT_SPR_REDRAW);
                          }
                  }
          }

          if(fRenderLights)
          {
                  LightResetAllTiles();
                  for(iCount=0; iCount < MAX_LIGHT_SPRITES; iCount++)
                          if((LightSprites[iCount].uiFlags&LIGHT_SPR_ACTIVE) && (LightSprites[iCount].uiFlags&LIGHT_SPR_ON))
                                  LightDraw(LightSprites[iCount].iTemplate, LightSprites[iCount].iX, LightSprites[iCount].iY, iCount);
                  return(TRUE);
          }

          return(FALSE); */
}

/********************************************************************************
 * LightSpriteRenderAll
 *
 *		Resets all tiles in the world to the ambient light level, and redraws all
 * active lights.
 *
 ********************************************************************************/
export function LightSpriteRenderAll(): boolean {
  let iCount: INT32;
  let fRenderLights: boolean = false;

  LightResetAllTiles();
  for (iCount = 0; iCount < MAX_LIGHT_SPRITES; iCount++) {
    LightSprites[iCount].uiFlags &= (~LIGHT_SPR_ERASE);

    if ((LightSprites[iCount].uiFlags & LIGHT_SPR_ACTIVE) && (LightSprites[iCount].uiFlags & LIGHT_SPR_ON)) {
      LightDraw(LightSprites[iCount].uiLightType, LightSprites[iCount].iTemplate, LightSprites[iCount].iX, LightSprites[iCount].iY, iCount);
      LightSprites[iCount].uiFlags |= LIGHT_SPR_ERASE;
      LightSpriteDirty(iCount);
    }

    LightSprites[iCount].iOldX = LightSprites[iCount].iX;
    LightSprites[iCount].iOldY = LightSprites[iCount].iY;
  }

  return true;
}

/********************************************************************************
 * LightSpritePosition
 *
 *		Sets the X,Y position (IN TILES) of a light instance.
 *
 ********************************************************************************/
export function LightSpritePosition(iSprite: INT32, iX: INT16, iY: INT16): boolean {
  if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ACTIVE) {
    if ((LightSprites[iSprite].iX == iX) && (LightSprites[iSprite].iY == iY))
      return true;

    if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ERASE) {
      if ((LightSprites[iSprite].iX < WORLD_COLS) && (LightSprites[iSprite].iY < WORLD_ROWS)) {
        LightErase(LightSprites[iSprite].uiLightType, LightSprites[iSprite].iTemplate, LightSprites[iSprite].iX, LightSprites[iSprite].iY, iSprite);
        LightSpriteDirty(iSprite);
      }
    }

    // LightSprites[iSprite].iOldX=LightSprites[iSprite].iX;
    // LightSprites[iSprite].iOldY=LightSprites[iSprite].iY;

    LightSprites[iSprite].iX = iX;
    LightSprites[iSprite].iY = iY;

    if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ON) {
      if ((LightSprites[iSprite].iX < WORLD_COLS) && (LightSprites[iSprite].iY < WORLD_ROWS)) {
        LightDraw(LightSprites[iSprite].uiLightType, LightSprites[iSprite].iTemplate, iX, iY, iSprite);
        LightSprites[iSprite].uiFlags |= LIGHT_SPR_ERASE;
        LightSpriteDirty(iSprite);
      }
    }
  } else
    return false;

  return true;
}

/********************************************************************************
 * LightSpriteRoofStatus
 *
 *		Determines whether a light is on a roof or not.
 *
 ********************************************************************************/
export function LightSpriteRoofStatus(iSprite: INT32, fOnRoof: boolean): boolean {
  if (fOnRoof && (LightSprites[iSprite].uiFlags & LIGHT_SPR_ONROOF))
    return false;

  if (!fOnRoof && !(LightSprites[iSprite].uiFlags & LIGHT_SPR_ONROOF))
    return false;

  if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ACTIVE) {
    if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ERASE) {
      if ((LightSprites[iSprite].iX < WORLD_COLS) && (LightSprites[iSprite].iY < WORLD_ROWS)) {
        LightErase(LightSprites[iSprite].uiLightType, LightSprites[iSprite].iTemplate, LightSprites[iSprite].iX, LightSprites[iSprite].iY, iSprite);
        LightSpriteDirty(iSprite);
      }
    }

    if (fOnRoof)
      LightSprites[iSprite].uiFlags |= LIGHT_SPR_ONROOF;
    else
      LightSprites[iSprite].uiFlags &= (~LIGHT_SPR_ONROOF);

    if (LightSprites[iSprite].uiFlags & LIGHT_SPR_ON) {
      if ((LightSprites[iSprite].iX < WORLD_COLS) && (LightSprites[iSprite].iY < WORLD_ROWS)) {
        LightDraw(LightSprites[iSprite].uiLightType, LightSprites[iSprite].iTemplate, LightSprites[iSprite].iX, LightSprites[iSprite].iY, iSprite);
        LightSprites[iSprite].uiFlags |= LIGHT_SPR_ERASE;
        LightSpriteDirty(iSprite);
      }
    }
  } else
    return false;

  return true;
}

/********************************************************************************
 * LightSpritePower
 *
 *		Turns on or off a light, based on the BOOLEAN.
 *
 ********************************************************************************/
export function LightSpritePower(iSprite: INT32, fOn: boolean): boolean {
  if (fOn) {
    LightSprites[iSprite].uiFlags |= (LIGHT_SPR_ON | LIGHT_SPR_REDRAW);
    LightSprites[iSprite].iOldX = WORLD_COLS;
  } else
    LightSprites[iSprite].uiFlags &= (~LIGHT_SPR_ON);

  return true;
}

/********************************************************************************
 * LightSpriteDirty
 *
 *		Sets the flag for the renderer to draw all marked tiles.
 *
 ********************************************************************************/
function LightSpriteDirty(iSprite: INT32): boolean {
  // INT16 iLeft_s, iTop_s;
  // INT16 iMapLeft, iMapTop, iMapRight, iMapBottom;

  // CellXYToScreenXY((INT16)(LightSprites[iSprite].iX*CELL_X_SIZE),
  //								(INT16)(LightSprites[iSprite].iY*CELL_Y_SIZE),  &iLeft_s, &iTop_s);

  // iLeft_s+=LightXOffset[LightSprites[iSprite].iTemplate];
  // iTop_s+=LightYOffset[LightSprites[iSprite].iTemplate];

  // iMapLeft=LightSprites[iSprite].iX+LightMapLeft[LightSprites[iSprite].iTemplate];
  // iMapTop=LightSprites[iSprite].iY+LightMapTop[LightSprites[iSprite].iTemplate];
  // iMapRight=LightSprites[iSprite].iX+LightMapRight[LightSprites[iSprite].iTemplate];
  // iMapBottom=LightSprites[iSprite].iY+LightMapBottom[LightSprites[iSprite].iTemplate];

  // ReRenderWorld(iMapLeft, iMapTop, iMapRight, iMapBottom);
  // UpdateSaveBuffer();
  // AddBaseDirtyRect(gsVIEWPORT_START_X, gsVIEWPORT_START_Y, gsVIEWPORT_END_X, gsVIEWPORT_END_Y );
  // AddBaseDirtyRect(iLeft_s, iTop_s,
  //								(INT16)(iLeft_s+LightWidth[LightSprites[iSprite].iTemplate]),
  //								(INT16)(iTop_s+LightHeight[LightSprites[iSprite].iTemplate]));

  SetRenderFlags(RENDER_FLAG_MARKED);

  return true;
}

function CreateObjectPalette(pObj: HVOBJECT, uiBase: UINT32, pShadePal: Pointer<SGPPaletteEntry>): boolean {
  let uiCount: UINT32;

  pObj.value.pShades[uiBase] = Create16BPPPaletteShaded(pShadePal, gusShadeLevels[0][0], gusShadeLevels[0][1], gusShadeLevels[0][2], true);

  for (uiCount = 1; uiCount < 16; uiCount++) {
    pObj.value.pShades[uiBase + uiCount] = Create16BPPPaletteShaded(pShadePal, gusShadeLevels[uiCount][0], gusShadeLevels[uiCount][1], gusShadeLevels[uiCount][2], false);
  }

  return true;
}

function CreateSoldierShadedPalette(pSoldier: Pointer<SOLDIERTYPE>, uiBase: UINT32, pShadePal: Pointer<SGPPaletteEntry>): boolean {
  let uiCount: UINT32;

  pSoldier.value.pShades[uiBase] = Create16BPPPaletteShaded(pShadePal, gusShadeLevels[0][0], gusShadeLevels[0][1], gusShadeLevels[0][2], true);

  for (uiCount = 1; uiCount < 16; uiCount++) {
    pSoldier.value.pShades[uiBase + uiCount] = Create16BPPPaletteShaded(pShadePal, gusShadeLevels[uiCount][0], gusShadeLevels[uiCount][1], gusShadeLevels[uiCount][2], false);
  }

  return true;
}

/**********************************************************************************************
 CreateObjectPaletteTables

                Creates the shading tables for 8-bit brushes. One highlight table is created, based on
        the object-type, 3 brightening tables, 1 normal, and 11 darkening tables. The entries are
        created iteratively, rather than in a loop to allow hand-tweaking of the values. If you
        change the HVOBJECT_SHADE_TABLES symbol, remember to add/delete entries here, it won't
        adjust automagically.

**********************************************************************************************/

export function CreateTilePaletteTables(pObj: HVOBJECT, uiTileIndex: UINT32, fForce: boolean): UINT16 {
  let uiCount: UINT32;
  let LightPal: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);
  let fLoaded: boolean = false;

  Assert(pObj != null);

  // create the basic shade table
  if (!gfForceBuildShadeTables && !fForce) {
    // The overwhelming majority of maps use the neutral 0,0,0 light for outdoors.  These shadetables
    // are extremely time consuming to generate, so we will attempt to load them.  If we do, then
    // we skip the generation process altogether.
    if (LoadShadeTable(pObj, uiTileIndex)) {
      fLoaded = true;
    }
  }
  if (!fLoaded) {
    // This is expensive as hell to call!
    for (uiCount = 0; uiCount < 256; uiCount++) {
      // combine the rgb of the light color with the object's palette
      LightPal[uiCount].peRed = (Math.min(pObj.value.pPaletteEntry[uiCount].peRed + gpLightColors[0].peRed, 255));
      LightPal[uiCount].peGreen = (Math.min(pObj.value.pPaletteEntry[uiCount].peGreen + gpLightColors[0].peGreen, 255));
      LightPal[uiCount].peBlue = (Math.min(pObj.value.pPaletteEntry[uiCount].peBlue + gpLightColors[0].peBlue, 255));
    }
    // build the shade tables
    CreateObjectPalette(pObj, 0, LightPal);

    // We paid to generate the shade table, so now save it, so we don't have to regenerate it ever
    // again!
    if (!gfForceBuildShadeTables && !gpLightColors[0].peRed && !gpLightColors[0].peGreen && !gpLightColors[0].peBlue) {
      SaveShadeTable(pObj, uiTileIndex);
    }
  }

  // if two lights are active
  if (gubNumLightColors == 2) {
    // build the second light's palette and table
    for (uiCount = 0; uiCount < 256; uiCount++) {
      LightPal[uiCount].peRed = (Math.min(pObj.value.pPaletteEntry[uiCount].peRed + gpLightColors[1].peRed, 255));
      LightPal[uiCount].peGreen = (Math.min(pObj.value.pPaletteEntry[uiCount].peGreen + gpLightColors[1].peGreen, 255));
      LightPal[uiCount].peBlue = (Math.min(pObj.value.pPaletteEntry[uiCount].peBlue + gpLightColors[1].peBlue, 255));
    }
    CreateObjectPalette(pObj, 16, LightPal);

    // build a table that is a mix of the first two
    for (uiCount = 0; uiCount < 256; uiCount++) {
      LightPal[uiCount].peRed = (Math.min(pObj.value.pPaletteEntry[uiCount].peRed + gpLightColors[2].peRed, 255));
      LightPal[uiCount].peGreen = (Math.min(pObj.value.pPaletteEntry[uiCount].peGreen + gpLightColors[2].peGreen, 255));
      LightPal[uiCount].peBlue = (Math.min(pObj.value.pPaletteEntry[uiCount].peBlue + gpLightColors[2].peBlue, 255));
    }
    CreateObjectPalette(pObj, 32, LightPal);
  }

  // build neutral palette as well!
  // Set current shade table to neutral color
  pObj.value.pShadeCurrent = pObj.value.pShades[4];
  pObj.value.pGlow = pObj.value.pShades[0];

  return true;
}

export function CreateSoldierPaletteTables(pSoldier: Pointer<SOLDIERTYPE>, uiType: UINT32): UINT16 {
  let LightPal: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);
  let uiCount: UINT32;

  // create the basic shade table
  for (uiCount = 0; uiCount < 256; uiCount++) {
    // combine the rgb of the light color with the object's palette
    LightPal[uiCount].peRed = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peRed + gpLightColors[0].peRed, 255));
    LightPal[uiCount].peGreen = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peGreen + gpLightColors[0].peGreen, 255));
    LightPal[uiCount].peBlue = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peBlue + gpLightColors[0].peBlue, 255));
  }
  // build the shade tables
  CreateSoldierShadedPalette(pSoldier, 0, LightPal);

  // if two lights are active
  if (gubNumLightColors == 2) {
    // build the second light's palette and table
    for (uiCount = 0; uiCount < 256; uiCount++) {
      LightPal[uiCount].peRed = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peRed + gpLightColors[1].peRed, 255));
      LightPal[uiCount].peGreen = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peGreen + gpLightColors[1].peGreen, 255));
      LightPal[uiCount].peBlue = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peBlue + gpLightColors[1].peBlue, 255));
    }
    CreateSoldierShadedPalette(pSoldier, 16, LightPal);

    // build a table that is a mix of the first two
    for (uiCount = 0; uiCount < 256; uiCount++) {
      LightPal[uiCount].peRed = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peRed + gpLightColors[2].peRed, 255));
      LightPal[uiCount].peGreen = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peGreen + gpLightColors[2].peGreen, 255));
      LightPal[uiCount].peBlue = (Math.min(pSoldier.value.p8BPPPalette[uiCount].peBlue + gpLightColors[2].peBlue, 255));
    }
    CreateSoldierShadedPalette(pSoldier, 32, LightPal);
  }

  // build neutral palette as well!
  // Set current shade table to neutral color
  pSoldier.value.pCurrentShade = pSoldier.value.pShades[4];
  // pSoldier->pGlow=pSoldier->pShades[0];

  return true;
}

}
