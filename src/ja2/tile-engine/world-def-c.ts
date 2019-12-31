namespace ja2 {

const path: typeof import('path') = require('path');

const SET_MOVEMENTCOST = (a: number, b: number, c: number, d: number) => ((gubWorldMovementCosts[a][b][c] < d) ? (gubWorldMovementCosts[a][b][c] = d) : 0);
const FORCE_SET_MOVEMENTCOST = (a: number, b: number, c: number, d: number) => (gubWorldMovementCosts[a][b][c] = d);
const SET_CURRMOVEMENTCOST = (usGridNo: number, a: number, b: number) => SET_MOVEMENTCOST(usGridNo, a, 0, b);

const TEMP_FILE_FOR_TILESET_CHANGE = "jatileS34.dat";

const MAP_FULLSOLDIER_SAVED = 0x00000001;
const MAP_WORLDONLY_SAVED = 0x00000002;
const MAP_WORLDLIGHTS_SAVED = 0x00000004;
const MAP_WORLDITEMS_SAVED = 0x00000008;
const MAP_EXITGRIDS_SAVED = 0x00000010;
const MAP_DOORTABLE_SAVED = 0x00000020;
const MAP_EDGEPOINTS_SAVED = 0x00000040;
const MAP_AMBIENTLIGHTLEVEL_SAVED = 0x00000080;
const MAP_NPCSCHEDULES_SAVED = 0x00000100;

// TEMP
let gfForceLoadPlayers: boolean = false;
let gzForceLoadFile: string /* CHAR8[100] */;
let gfForceLoad: boolean = false;

let gubCurrentLevel: UINT8;
export let giCurrentTilesetID: INT32 = 0;
let gzLastLoadedFile: string /* CHAR8[260] */;

export let gCurrentBackground: UINT32 = Enum313.FIRSTTEXTURE;

export let TileSurfaceFilenames: string[] /* CHAR8[NUMBEROFTILETYPES][32] */ = createArray(Enum313.NUMBEROFTILETYPES, '');
let gbNewTileSurfaceLoaded: boolean[] /* INT8[NUMBEROFTILETYPES] */ = createArray(Enum313.NUMBEROFTILETYPES, false);

export function SetAllNewTileSurfacesLoaded(fNew: boolean): void {
  gbNewTileSurfaceLoaded.fill(fNew);
}

let gfInitAnimateLoading: boolean = false;

// Global Variables
export let gpWorldLevelData: MAP_ELEMENT[] /* Pointer<MAP_ELEMENT> */;
export let gSurfaceMemUsage: UINT32;
export let gubWorldMovementCosts: UINT8[][][] /* [WORLD_MAX][MAXDIR][2] */ = createArrayFrom(WORLD_MAX, () => createArrayFrom(MAXDIR, () => createArray(2, 0)));

// set to nonzero (locs of base gridno of structure are good) to have it defined by structure code
export let gsRecompileAreaTop: INT16 = 0;
export let gsRecompileAreaLeft: INT16 = 0;
export let gsRecompileAreaRight: INT16 = 0;
export let gsRecompileAreaBottom: INT16 = 0;

// TIMER TESTING STUFF

export function DoorAtGridNo(iMapIndex: UINT32): boolean {
  let pStruct: STRUCTURE | null;
  pStruct = gpWorldLevelData[iMapIndex].pStructureHead;
  while (pStruct) {
    if (pStruct.fFlags & STRUCTURE_ANYDOOR)
      return true;
    pStruct = pStruct.pNext;
  }
  return false;
}

export function OpenableAtGridNo(iMapIndex: UINT32): boolean {
  let pStruct: STRUCTURE | null;
  pStruct = gpWorldLevelData[iMapIndex].pStructureHead;
  while (pStruct) {
    if (pStruct.fFlags & STRUCTURE_OPENABLE)
      return true;
    pStruct = pStruct.pNext;
  }
  return false;
}

export function FloorAtGridNo(iMapIndex: UINT32): boolean {
  let pLand: LEVELNODE | null;
  let uiTileType: UINT32;
  pLand = gpWorldLevelData[iMapIndex].pLandHead;
  // Look through all objects and Search for type
  while (pLand) {
    if (pLand.usIndex != NO_TILE) {
      uiTileType = GetTileType(pLand.usIndex);
      if (uiTileType >= Enum313.FIRSTFLOOR && uiTileType <= LASTFLOOR) {
        return true;
      }
      pLand = pLand.pNext;
    }
  }
  return false;
}

export function GridNoIndoors(iMapIndex: UINT32): boolean {
  if (gfBasement || gfCaves)
    return true;
  if (FloorAtGridNo(iMapIndex))
    return true;
  return false;
}

function DOIT(): void {
  //	LEVELNODE *			pLand;
  // LEVELNODE *			pObject;
  let pStruct: LEVELNODE | null;
  let pNewStruct: LEVELNODE | null;
  // LEVELNODE	*			pShadow;
  let uiLoop: UINT32;

  // first level
  for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
    pStruct = gpWorldLevelData[uiLoop].pStructHead;

    while (pStruct != null) {
      pNewStruct = pStruct.pNext;

      if (pStruct.usIndex >= Enum312.DEBRISWOOD1 && pStruct.usIndex <= Enum312.DEBRISWEEDS10) {
        AddObjectToHead(uiLoop, pStruct.usIndex);

        RemoveStruct(uiLoop, pStruct.usIndex);
      }

      pStruct = pNewStruct;
    }
  }
}

export function InitializeWorld(): boolean {
  gTileDatabaseSize = 0;
  gSurfaceMemUsage = 0;
  giCurrentTilesetID = -1;

  // DB Adds the _8 to the names if we're in 8 bit mode.
  // ProcessTilesetNamesForBPP();

  // Memset tileset list
  TileSurfaceFilenames.fill('');

  // ATE: MEMSET LOG HEIGHT VALUES
  gTileTypeLogicalHeight.fill(1);;

  // Memset tile database
  gTileDatabase.forEach(resetTileElement);

  // Init surface list
  gTileSurfaceArray.fill(<TILE_IMAGERY><unknown>null);;

  // Init default surface list
  gbDefaultSurfaceUsed.fill(false);

  // Init same surface list
  gbSameAsDefaultSurfaceUsed.fill(false);

  // Initialize world data

  gpWorldLevelData = createArrayFrom(WORLD_MAX, createMapElement);

  // Init room database
  InitRoomDatabase();

  // INit tilesets
  InitEngineTilesets();

  return true;
}

export function DeinitializeWorld(): void {
  TrashWorld();

  if (gpWorldLevelData != null) {
    gpWorldLevelData.length = 0;
  }

  DestroyTileSurfaces();
  FreeAllStructureFiles();

  // Shutdown tile database data
  DeallocateTileDatabase();

  ShutdownRoomDatabase();
}

function ReloadTilesetSlot(iSlot: INT32): boolean {
  return true;
}

function LoadTileSurfaces(ppTileSurfaceFilenames: string[] /* [][32] */, ubTilesetID: UINT8): boolean {
  let cTemp: string /* SGPFILENAME */;
  let uiLoop: UINT32;

  let uiPercentage: UINT32;
  // UINT32					uiLength;
  // UINT16					uiFillColor;

  // If no Tileset filenames are given, return error
  if (ppTileSurfaceFilenames == null) {
    return false;
  } else {
    for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++)
      TileSurfaceFilenames[uiLoop] = ppTileSurfaceFilenames[uiLoop]; //(char *)(ppTileSurfaceFilenames + (65 * uiLoop)) );
  }

  // uiFillColor = Get16BPPColor(FROMRGB(223, 223, 223));
  // StartFrameBufferRender( );
  // ColorFillVideoSurfaceArea( FRAME_BUFFER, 20, 399, 622, 420, uiFillColor );
  // ColorFillVideoSurfaceArea( FRAME_BUFFER, 21, 400, 621, 419, 0 );
  // EndFrameBufferRender( );

  // uiFillColor = Get16BPPColor(FROMRGB( 100, 0, 0 ));
  // load the tile surfaces
  SetRelativeStartAndEndPercentage(0, 1, 35, "Tile Surfaces");
  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    uiPercentage = Math.trunc((uiLoop * 100) / (Enum313.NUMBEROFTILETYPES - 1));
    RenderProgressBar(0, uiPercentage);

    // uiFillColor = Get16BPPColor(FROMRGB( 100 + uiPercentage , 0, 0 ));
    // ColorFillVideoSurfaceArea( FRAME_BUFFER, 22, 401, 22 + uiLength, 418, uiFillColor );
    // InvalidateRegion( 0, 399, 640, 420 );
    // EndFrameBufferRender( );

    // The cost of having to do this check each time through the loop,
    // thus about 20 times, seems better than having to maintain two
    // almost completely identical functions
    if (ppTileSurfaceFilenames == null) {
      // Use default
      if (AddTileSurface(TileSurfaceFilenames[uiLoop], uiLoop, ubTilesetID, false) == false) {
        DestroyTileSurfaces();
        return false;
      }
    } else {
      if ((ppTileSurfaceFilenames[uiLoop]) != '') {
        if (AddTileSurface(ppTileSurfaceFilenames[uiLoop], uiLoop, ubTilesetID, false) == false) {
          DestroyTileSurfaces();
          return false;
        }
      } else {
        // USE FIRST TILESET VALUE!

        // ATE: If here, don't load default surface if already loaded...
        if (!gbDefaultSurfaceUsed[uiLoop]) {
          TileSurfaceFilenames[uiLoop] = gTilesets[Enum316.GENERIC_1].TileSurfaceFilenames[uiLoop]; //(char *)(ppTileSurfaceFilenames + (65 * uiLoop)) );
          if (AddTileSurface(gTilesets[Enum316.GENERIC_1].TileSurfaceFilenames[uiLoop], uiLoop, Enum316.GENERIC_1, false) == false) {
            DestroyTileSurfaces();
            return false;
          }
        } else {
          gbSameAsDefaultSurfaceUsed[uiLoop] = true;
        }
      }
    }
  }

  return true;
}

function AddTileSurface(cFilename: string /* Pointer<char> */, ubType: UINT32, ubTilesetID: UINT8, fGetFromRoot: boolean): boolean {
  // Add tile surface
  let TileSurf: TILE_IMAGERY | null;
  let cFileBPP: string /* CHAR8[128] */;
  let cAdjustedFile: string /* CHAR8[128] */;

  // Delete the surface first!
  if (gTileSurfaceArray[ubType] != null) {
    DeleteTileSurface(gTileSurfaceArray[ubType]);
    gTileSurfaceArray[ubType] = <TILE_IMAGERY><unknown>null;
  }

  // Adjust flag for same as default used...
  gbSameAsDefaultSurfaceUsed[ubType] = false;

  // Adjust for BPP
  cFileBPP = FilenameForBPP(cFilename);

  if (!fGetFromRoot) {
    // Adjust for tileset position
    cAdjustedFile = sprintf("TILESETS\\%d\\%s", ubTilesetID, cFileBPP);
  } else {
    cAdjustedFile = sprintf("%s", cFileBPP);
  }

  TileSurf = LoadTileSurface(cAdjustedFile);

  if (TileSurf == null)
    return false;

  TileSurf.fType = ubType;

  SetRaisedObjectFlag(cAdjustedFile, TileSurf);

  gTileSurfaceArray[ubType] = TileSurf;

  // OK, if we were not the default tileset, set value indicating that!
  if (ubTilesetID != Enum316.GENERIC_1) {
    gbDefaultSurfaceUsed[ubType] = false;
  } else {
    gbDefaultSurfaceUsed[ubType] = true;
  }

  gbNewTileSurfaceLoaded[ubType] = true;

  return true;
}

/* static */ let BuildTileShadeTables__ubLastRed: UINT8 = 255;
/* static */ let BuildTileShadeTables__ubLastGreen: UINT8 = 255;
/* static */ let BuildTileShadeTables__ubLastBlue: UINT8 = 255;
export function BuildTileShadeTables(): void {
  let hfile: HWFILE;
  let DataDir: string /* STRING512 */;
  let ShadeTableDir: string /* STRING512 */;
  let uiLoop: UINT32;
  let cRootFile: string /* CHAR8[128] */;
  let fForceRebuildForSlot: boolean = false;

  // Set the directory to the shadetable directory
  DataDir = GetFileManCurrentDirectory();
  ShadeTableDir = path.join(DataDir, 'ShadeTables');
  if (!SetFileManCurrentDirectory(ShadeTableDir)) {
    AssertMsg(0, "Can't set the directory to Data\\ShadeTable.  Kris' big problem!");
  }
  hfile = FileOpen("IgnoreShadeTables.txt", FILE_ACCESS_READ, false);
  if (hfile) {
    FileClose(hfile);
    gfForceBuildShadeTables = true;
  } else {
    gfForceBuildShadeTables = false;
  }
  // now, determine if we are using specialized colors.
  if (gpLightColors[0].peRed || gpLightColors[0].peGreen || gpLightColors[0].peBlue) {
    // we are, which basically means we force build the shadetables.  However, the one
    // exception is if we are loading another map and the colors are the same.
    if (gpLightColors[0].peRed != BuildTileShadeTables__ubLastRed || gpLightColors[0].peGreen != BuildTileShadeTables__ubLastGreen || gpLightColors[0].peBlue != BuildTileShadeTables__ubLastBlue) {
      // Same tileset, but colors are different, so set things up to regenerate the shadetables.
      gfForceBuildShadeTables = true;
    } else {
      // same colors, same tileset, so don't rebuild shadetables -- much faster!
      gfForceBuildShadeTables = false;
    }
  }

  if (gfLoadShadeTablesFromTextFile) {
    // Because we're tweaking the RGB values in the text file, always force rebuild the shadetables
    // so that the user can tweak them in the same exe session.
    gbNewTileSurfaceLoaded.fill(true);
  }

  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    if (gTileSurfaceArray[uiLoop] != null) {
// Don't Create shade tables if default were already used once!
      if (gbNewTileSurfaceLoaded[uiLoop] || gfEditorForceShadeTableRebuild)
      {
        fForceRebuildForSlot = false;

        cRootFile = GetRootName(TileSurfaceFilenames[uiLoop]);

        if (cRootFile === "grass2") {
          fForceRebuildForSlot = true;
        }

        RenderProgressBar(0, Math.trunc(uiLoop * 100 / Enum313.NUMBEROFTILETYPES));
        CreateTilePaletteTables(gTileSurfaceArray[uiLoop].vo, uiLoop, fForceRebuildForSlot);
      }
    }
  }

  // Restore the data directory once we are finished.
  SetFileManCurrentDirectory(DataDir);

  BuildTileShadeTables__ubLastRed = gpLightColors[0].peRed;
  BuildTileShadeTables__ubLastGreen = gpLightColors[0].peGreen;
  BuildTileShadeTables__ubLastBlue = gpLightColors[0].peBlue;
}

export function DestroyTileShadeTables(): void {
  let uiLoop: UINT32;

  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    if (gTileSurfaceArray[uiLoop] != null) {
// Don't Delete shade tables if default are still being used...
      if (gbNewTileSurfaceLoaded[uiLoop] || gfEditorForceShadeTableRebuild) {
        DestroyObjectPaletteTables(gTileSurfaceArray[uiLoop].vo);
      }
    }
  }
}

function DestroyTileSurfaces(): void {
  let uiLoop: UINT32;

  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    if (gTileSurfaceArray[uiLoop] != null) {
      DeleteTileSurface(gTileSurfaceArray[uiLoop]);
      gTileSurfaceArray[uiLoop] = <TILE_IMAGERY><unknown>null;
    }
  }
}

function CompileWorldTerrainIDs(): void {
  let sGridNo: INT16;
  let sTempGridNo: INT16;
  let pNode: LEVELNODE | null;
  let pTileElement: TILE_ELEMENT;
  let ubLoop: UINT8;

  for (sGridNo = 0; sGridNo < WORLD_MAX; sGridNo++) {
    if (GridNoOnVisibleWorldTile(sGridNo)) {
      // Check if we have anything in object layer which has a terrain modifier
      pNode = gpWorldLevelData[sGridNo].pObjectHead;

      // ATE: CRAPOLA! Special case stuff here for the friggen pool since art was fu*ked up
      if (giCurrentTilesetID == Enum316.TEMP_19) {
        // Get ID
        if (pNode != null) {
          if (pNode.usIndex == Enum312.ANOTHERDEBRIS4 || pNode.usIndex == Enum312.ANOTHERDEBRIS6 || pNode.usIndex == Enum312.ANOTHERDEBRIS7) {
            gpWorldLevelData[sGridNo].ubTerrainID = Enum315.LOW_WATER;
            continue;
          }
        }
      }

      if (pNode == null || pNode.usIndex >= Enum312.NUMBEROFTILES || gTileDatabase[pNode.usIndex].ubTerrainID == Enum315.NO_TERRAIN) {
        // Try terrain instead!
        pNode = gpWorldLevelData[sGridNo].pLandHead;
      }
      pTileElement = gTileDatabase[(<LEVELNODE>pNode).usIndex];
      if (pTileElement.ubNumberOfTiles > 1) {
        Assert(pTileElement.pTileLocData);
        for (ubLoop = 0; ubLoop < pTileElement.ubNumberOfTiles; ubLoop++) {
          sTempGridNo = sGridNo + pTileElement.pTileLocData[ubLoop].bTileOffsetX + pTileElement.pTileLocData[ubLoop].bTileOffsetY * WORLD_COLS;
          gpWorldLevelData[sTempGridNo].ubTerrainID = pTileElement.ubTerrainID;
        }
      } else {
        gpWorldLevelData[sGridNo].ubTerrainID = pTileElement.ubTerrainID;
      }
    }
  }
}

function CompileTileMovementCosts(usGridNo: UINT16): void {
  let ubTerrainID: UINT8;
  let TileElem: TILE_ELEMENT = createTileElement();
  let pLand: LEVELNODE | null;

  let pStructure: STRUCTURE | null;
  let fStructuresOnRoof: boolean;

  let ubDirLoop: UINT8;

  /*
   */

  if (GridNoOnVisibleWorldTile(usGridNo)) {
    // check for land of a different height in adjacent locations
    for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
      if (gpWorldLevelData[usGridNo].sHeight != gpWorldLevelData[usGridNo + DirectionInc(ubDirLoop)].sHeight) {
        SET_CURRMOVEMENTCOST(usGridNo, ubDirLoop, TRAVELCOST_OBSTACLE);
      }
    }

    // check for exit grids
    if (ExitGridAtGridNo(usGridNo)) {
      for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
        SET_CURRMOVEMENTCOST(usGridNo, ubDirLoop, TRAVELCOST_EXITGRID);
      }
      // leave the roof alone, and continue, so that we can get values for the roof if traversable
    }
  } else {
    for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
      SET_MOVEMENTCOST(usGridNo, ubDirLoop, 0, TRAVELCOST_OFF_MAP);
      SET_MOVEMENTCOST(usGridNo, ubDirLoop, 1, TRAVELCOST_OFF_MAP);
    }
    if (gpWorldLevelData[usGridNo].pStructureHead == null) {
      return;
    }
  }

  if (gpWorldLevelData[usGridNo].pStructureHead != null) {
    // structures in tile
    // consider the land
    pLand = gpWorldLevelData[usGridNo].pLandHead;
    if (pLand != null) {
      // Set TEMPORARY cost here
      // Get from tile database
      TileElem = gTileDatabase[pLand.usIndex];

      // Get terrain type
      ubTerrainID = gpWorldLevelData[usGridNo].ubTerrainID; // = GetTerrainType( (INT16)usGridNo );

      for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
        SET_CURRMOVEMENTCOST(usGridNo, ubDirLoop, gTileTypeMovementCost[ubTerrainID]);
      }
    }

    // now consider all structures
    pStructure = <STRUCTURE>gpWorldLevelData[usGridNo].pStructureHead;
    fStructuresOnRoof = false;
    do {
      if (pStructure.sCubeOffset == STRUCTURE_ON_GROUND) {
        if (pStructure.fFlags & STRUCTURE_PASSABLE) {
          if (pStructure.fFlags & STRUCTURE_WIREFENCE && pStructure.fFlags & STRUCTURE_OPEN) {
            // prevent movement along the fence but allow in all other directions
            switch (pStructure.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.EAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHEAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTH, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_NOT_STANDING);
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.EAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHEAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTH, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_NOT_STANDING);
                break;
            }
          }
          // all other passable structures do not block movement in any way
        } else if (pStructure.fFlags & STRUCTURE_BLOCKSMOVES) {
          if ((pStructure.fFlags & STRUCTURE_FENCE) && !(pStructure.fFlags & STRUCTURE_SPECIAL)) {
            // jumpable!
            switch (pStructure.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:
                // can be jumped north and south
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_FENCE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.EAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHEAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTH, TRAVELCOST_FENCE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_OBSTACLE);
                // set values for the tiles EXITED from this location
                FORCE_SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTH, 0, TRAVELCOST_NONE);
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                FORCE_SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_NONE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo - 1, Enum245.WEST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS - 1, Enum245.NORTHWEST, 0, TRAVELCOST_OBSTACLE);
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:
                // can be jumped east and west
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.EAST, TRAVELCOST_FENCE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHEAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTH, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_FENCE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_OBSTACLE);
                // set values for the tiles EXITED from this location
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTH, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);
                // make sure no obstacle costs exists before changing path cost to 0
                if (gubWorldMovementCosts[usGridNo + 1][Enum245.EAST][0] < TRAVELCOST_BLOCKED) {
                  FORCE_SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_NONE);
                }
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);
                if (gubWorldMovementCosts[usGridNo - 1][Enum245.WEST][0] < TRAVELCOST_BLOCKED) {
                  FORCE_SET_MOVEMENTCOST(usGridNo - 1, Enum245.WEST, 0, TRAVELCOST_NONE);
                }
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS - 1, Enum245.NORTHWEST, 0, TRAVELCOST_OBSTACLE);
                break;

              default:
                // corners aren't jumpable
                for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
                  SET_CURRMOVEMENTCOST(usGridNo, ubDirLoop, TRAVELCOST_OBSTACLE);
                }
                break;
            }
          } else if (pStructure.pDBStructureRef.pDBStructure.ubArmour == Enum309.MATERIAL_SANDBAG && StructureHeight(pStructure) < 2) {
            for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
              SET_CURRMOVEMENTCOST(usGridNo, ubDirLoop, TRAVELCOST_OBSTACLE);
            }

            if (FindStructure((usGridNo - WORLD_COLS), STRUCTURE_OBSTACLE) == null && FindStructure((usGridNo + WORLD_COLS), STRUCTURE_OBSTACLE) == null) {
              FORCE_SET_MOVEMENTCOST(usGridNo, Enum245.NORTH, 0, TRAVELCOST_FENCE);
              FORCE_SET_MOVEMENTCOST(usGridNo, Enum245.SOUTH, 0, TRAVELCOST_FENCE);
            }

            if (FindStructure((usGridNo - 1), STRUCTURE_OBSTACLE) == null && FindStructure((usGridNo + 1), STRUCTURE_OBSTACLE) == null) {
              FORCE_SET_MOVEMENTCOST(usGridNo, Enum245.EAST, 0, TRAVELCOST_FENCE);
              FORCE_SET_MOVEMENTCOST(usGridNo, Enum245.WEST, 0, TRAVELCOST_FENCE);
            }
          } else if ((pStructure.fFlags & STRUCTURE_CAVEWALL)) {
            for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
              SET_CURRMOVEMENTCOST(usGridNo, ubDirLoop, TRAVELCOST_CAVEWALL);
            }
          } else {
            for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
              SET_CURRMOVEMENTCOST(usGridNo, ubDirLoop, TRAVELCOST_OBSTACLE);
            }
          }
        } else if (pStructure.fFlags & STRUCTURE_ANYDOOR) /*&& (pStructure->fFlags & STRUCTURE_OPEN))*/
        {
         // NB closed doors are treated just like walls, in the section after this

          if (pStructure.fFlags & STRUCTURE_DDOOR_LEFT && (pStructure.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT || pStructure.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT)) {
            // double door, left side (as you look on the screen)
            switch (pStructure.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_RIGHT:
                if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
                  // doorpost
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                  // corner
                  SET_MOVEMENTCOST(usGridNo + 1 + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                } else {
                  // door
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_DOOR_OPEN_W);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_DOOR_OPEN_W);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_OPEN_NW);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_NW);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_W_W);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_NW_W);
                }
                break;

              case Enum314.INSIDE_TOP_RIGHT:
                // doorpost
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                // door
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_DOOR_OPEN_HERE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_DOOR_OPEN_HERE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_OPEN_N);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_N);
                SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_E);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_NE);
                break;

              default:
                // door with no orientation specified!?
                break;
            }
          } else if (pStructure.fFlags & STRUCTURE_DDOOR_RIGHT && (pStructure.ubWallOrientation == Enum314.INSIDE_TOP_LEFT || pStructure.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT)) {
            // double door, right side (as you look on the screen)
            switch (pStructure.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
                if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
                  // doorpost
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N)
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                  ;
                  // corner
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                } else {
                  // door
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_DOOR_OPEN_N);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_DOOR_OPEN_N);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_OPEN_NW);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_NW);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_N_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_NW_N);
                }
                break;

              case Enum314.INSIDE_TOP_LEFT:
                // doorpost
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_WALL);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
                // corner
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                // door
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_DOOR_OPEN_HERE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_DOOR_OPEN_HERE);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_OPEN_W);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_W);
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_S);
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_SW);
                break;
              default:
                // door with no orientation specified!?
                break;
            }
          } else if (pStructure.fFlags & STRUCTURE_SLIDINGDOOR && pStructure.pDBStructureRef.pDBStructure.ubNumberOfTiles > 1) {
            switch (pStructure.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:
                // doorframe post in one corner of each of the tiles
                if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_CLOSED_N);
                } else {
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_CLOSED_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                }
                break;
              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:
                // doorframe post in one corner of each of the tiles
                if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_DOOR_CLOSED_HERE);

                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                } else {
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_WALL);

                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                }
                break;
            }
          } else {
            // standard door
            switch (pStructure.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
                if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
                  // doorframe
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);

                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);

                  // DO CORNERS
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);

                  // SET_CURRMOVEMENTCOST(usGridNo,  NORTHEAST, TRAVELCOST_OBSTACLE );
                  // SET_CURRMOVEMENTCOST(usGridNo,  NORTHWEST, TRAVELCOST_OBSTACLE );
                  // SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                  // SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHWEST, 0, TRAVELCOST_OBSTACLE );
                  // corner
                  // SET_MOVEMENTCOST( usGridNo + 1 ,NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                } else if (!(pStructure.fFlags & STRUCTURE_SLIDINGDOOR)) {
                  // door
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.EAST, TRAVELCOST_DOOR_OPEN_N);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.WEST, 0, TRAVELCOST_DOOR_OPEN_NE);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_N_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_NE_N);
                }
                break;

              case Enum314.INSIDE_TOP_LEFT:
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_WALL);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);

                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);

                // DO CORNERS
                SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);

                // doorframe
                // SET_CURRMOVEMENTCOST(usGridNo,  NORTHEAST, TRAVELCOST_OBSTACLE );
                // SET_CURRMOVEMENTCOST(usGridNo,  NORTHWEST, TRAVELCOST_OBSTACLE );
                // SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                // SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHWEST, 0, TRAVELCOST_OBSTACLE );
                // corner
                // SET_MOVEMENTCOST( usGridNo + 1 ,NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                // door
                if (!(pStructure.fFlags & STRUCTURE_SLIDINGDOOR)) {
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.EAST, TRAVELCOST_DOOR_OPEN_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHEAST, TRAVELCOST_DOOR_OPEN_HERE);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.WEST, 0, TRAVELCOST_DOOR_OPEN_E);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_E);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_S);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS - 1, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_SE);
                }
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
                if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
                  // doorframe
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_OBSTACLE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_OBSTACLE);

                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);

                  // DO CORNERS
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHWEST, 0, TRAVELCOST_OBSTACLE);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);

                  // SET_CURRMOVEMENTCOST(usGridNo,  SOUTHWEST, TRAVELCOST_OBSTACLE );
                  // SET_CURRMOVEMENTCOST(usGridNo,  NORTHWEST, TRAVELCOST_OBSTACLE );
                  // SET_MOVEMENTCOST( usGridNo + 1, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                  // SET_MOVEMENTCOST( usGridNo + 1, NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                  // corner
                  // SET_MOVEMENTCOST( usGridNo + 1 + WORLD_COLS, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                } else if (!(pStructure.fFlags & STRUCTURE_SLIDINGDOOR)) {
                  // door
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTH, TRAVELCOST_DOOR_OPEN_W);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_DOOR_OPEN_W);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTH, 0, TRAVELCOST_DOOR_OPEN_SW);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_SW);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_W_W);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_SW_W);
                }
                break;

              case Enum314.INSIDE_TOP_RIGHT:
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_OBSTACLE);

                SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);

                // DO CORNERS
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHWEST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);

                // doorframe
                /*
                SET_CURRMOVEMENTCOST(usGridNo,  SOUTHWEST, TRAVELCOST_OBSTACLE );
                SET_CURRMOVEMENTCOST(usGridNo,  NORTHWEST, TRAVELCOST_OBSTACLE );
                SET_MOVEMENTCOST( usGridNo + 1,SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                SET_MOVEMENTCOST( usGridNo + 1,NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                // corner
                SET_MOVEMENTCOST( usGridNo - WORLD_COLS,  NORTHWEST, 0, TRAVELCOST_OBSTACLE );
                */
                if (!(pStructure.fFlags & STRUCTURE_SLIDINGDOOR)) {
                  // door
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTH, TRAVELCOST_DOOR_OPEN_HERE);
                  SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHEAST, TRAVELCOST_DOOR_OPEN_HERE);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTH, 0, TRAVELCOST_DOOR_OPEN_S);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_S);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_E);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS - 1, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_SE);
                }
                break;

              default:
                // door with no orientation specified!?
                break;
            }
          }

          /*
          switch( pStructure->ubWallOrientation )
          {
                  case OUTSIDE_TOP_LEFT:
                  case INSIDE_TOP_LEFT:
                          SET_CURRMOVEMENTCOST(usGridNo,  NORTHEAST, TRAVELCOST_OBSTACLE );
                          SET_CURRMOVEMENTCOST(usGridNo,  NORTH, TRAVELCOST_DOOR_CLOSED_HERE );
                          SET_CURRMOVEMENTCOST(usGridNo,  NORTHWEST, TRAVELCOST_OBSTACLE );

                          SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                          SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N );
                          SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHWEST, 0, TRAVELCOST_OBSTACLE );

                          // DO CORNERS
                          SET_MOVEMENTCOST( usGridNo - 1, NORTHWEST, 0, TRAVELCOST_OBSTACLE );
                          SET_MOVEMENTCOST( usGridNo + 1, NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                          SET_MOVEMENTCOST( usGridNo + WORLD_COLS - 1, SOUTHWEST, 0, TRAVELCOST_OBSTACLE );
                          SET_MOVEMENTCOST( usGridNo + WORLD_COLS + 1, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                          break;

                  case OUTSIDE_TOP_RIGHT:
                  case INSIDE_TOP_RIGHT:
                          SET_CURRMOVEMENTCOST(usGridNo,  SOUTHWEST, TRAVELCOST_OBSTACLE );
                          SET_CURRMOVEMENTCOST(usGridNo,  WEST, TRAVELCOST_DOOR_CLOSED_HERE );
                          SET_CURRMOVEMENTCOST(usGridNo,  NORTHWEST, TRAVELCOST_OBSTACLE );

                          SET_MOVEMENTCOST( usGridNo + 1, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                          SET_MOVEMENTCOST( usGridNo + 1, EAST, 0, TRAVELCOST_DOOR_CLOSED_W );
                          SET_MOVEMENTCOST( usGridNo + 1, NORTHEAST, 0, TRAVELCOST_OBSTACLE );

                          // DO CORNERS
                          SET_MOVEMENTCOST( usGridNo - WORLD_COLS + 1, NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                          SET_MOVEMENTCOST( usGridNo - WORLD_COLS, NORTHWEST, 0, TRAVELCOST_OBSTACLE );
                          SET_MOVEMENTCOST( usGridNo + WORLD_COLS + 1, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                          SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHWEST, 0, TRAVELCOST_OBSTACLE );
                          break;

                  default:
                          // wall with no orientation specified!?
                          break;
          }
          */
        } else if (pStructure.fFlags & STRUCTURE_WALLSTUFF) {
          // ATE: IF a closed door, set to door value
          switch (pStructure.ubWallOrientation) {
            case Enum314.OUTSIDE_TOP_LEFT:
            case Enum314.INSIDE_TOP_LEFT:
              SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHEAST, TRAVELCOST_WALL);
              SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTH, TRAVELCOST_WALL);
              SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);

              // DO CORNERS
              SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
              break;

            case Enum314.OUTSIDE_TOP_RIGHT:
            case Enum314.INSIDE_TOP_RIGHT:
              SET_CURRMOVEMENTCOST(usGridNo, Enum245.SOUTHWEST, TRAVELCOST_WALL);
              SET_CURRMOVEMENTCOST(usGridNo, Enum245.WEST, TRAVELCOST_WALL);
              SET_CURRMOVEMENTCOST(usGridNo, Enum245.NORTHWEST, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);

              // DO CORNERS
              SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHWEST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
              SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
              break;

            default:
              // wall with no orientation specified!?
              break;
          }
        }
      } else {
        if (!(pStructure.fFlags & STRUCTURE_PASSABLE || pStructure.fFlags & STRUCTURE_NORMAL_ROOF)) {
          fStructuresOnRoof = true;
        }
      }
      pStructure = pStructure.pNext;
    } while (pStructure != null);

    // HIGHEST LAYER
    if ((gpWorldLevelData[usGridNo].pRoofHead != null)) {
      if (!fStructuresOnRoof) {
        for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
          SET_MOVEMENTCOST(usGridNo, ubDirLoop, 1, TRAVELCOST_FLAT);
        }
      } else {
        for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
          SET_MOVEMENTCOST(usGridNo, ubDirLoop, 1, TRAVELCOST_OBSTACLE);
        }
      }
    } else {
      for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
        SET_MOVEMENTCOST(usGridNo, ubDirLoop, 1, TRAVELCOST_OBSTACLE);
      }
    }
  } else {
    // NO STRUCTURES IN TILE
    // consider just the land

    // Get terrain type
    ubTerrainID = gpWorldLevelData[usGridNo].ubTerrainID; // = GetTerrainType( (INT16)usGridNo );
    for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
      SET_MOVEMENTCOST(usGridNo, ubDirLoop, 0, gTileTypeMovementCost[ubTerrainID]);
    }

    /*
                    pLand = gpWorldLevelData[ usGridNo ].pLandHead;
                    if ( pLand != NULL )
                    {
                            // Set cost here
                            // Get from tile database
                            TileElem = gTileDatabase[ pLand->usIndex ];

                            // Get terrain type
                            ubTerrainID =	GetTerrainType( (INT16)usGridNo );

                            for (ubDirLoop=0; ubDirLoop < 8; ubDirLoop++)
                            {
                                    SET_MOVEMENTCOST( usGridNo ,ubDirLoop, 0, gTileTypeMovementCost[ ubTerrainID ] );
                            }
                    }
    */
    // HIGHEST LEVEL
    if (gpWorldLevelData[usGridNo].pRoofHead != null) {
      for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
        SET_MOVEMENTCOST(usGridNo, ubDirLoop, 1, TRAVELCOST_FLAT);
      }
    } else {
      for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
        SET_MOVEMENTCOST(usGridNo, ubDirLoop, 1, TRAVELCOST_OBSTACLE);
      }
    }
  }
}

const LOCAL_RADIUS = 4;

export function RecompileLocalMovementCosts(sCentreGridNo: INT16): void {
  let usGridNo: INT16;
  let sGridX: INT16;
  let sGridY: INT16;
  let sCentreGridX: INT16;
  let sCentreGridY: INT16;
  let bDirLoop: INT8;

  ({ sX: sCentreGridX, sY: sCentreGridY } = ConvertGridNoToXY(sCentreGridNo));
  for (sGridY = sCentreGridY - LOCAL_RADIUS; sGridY < sCentreGridY + LOCAL_RADIUS; sGridY++) {
    for (sGridX = sCentreGridX - LOCAL_RADIUS; sGridX < sCentreGridX + LOCAL_RADIUS; sGridX++) {
      usGridNo = MAPROWCOLTOPOS(sGridY, sGridX);
      // times 2 for 2 levels, times 2 for UINT16s
      //			memset( &(gubWorldMovementCosts[usGridNo]), 0, MAXDIR * 2 * 2 );
      if (usGridNo < WORLD_MAX) {
        for (bDirLoop = 0; bDirLoop < MAXDIR; bDirLoop++) {
          gubWorldMovementCosts[usGridNo][bDirLoop][0] = 0;
          gubWorldMovementCosts[usGridNo][bDirLoop][1] = 0;
        }
      }
    }
  }

  // note the radius used in this loop is larger, to guarantee that the
  // edges of the recompiled areas are correct (i.e. there could be spillover)
  for (sGridY = sCentreGridY - LOCAL_RADIUS - 1; sGridY < sCentreGridY + LOCAL_RADIUS + 1; sGridY++) {
    for (sGridX = sCentreGridX - LOCAL_RADIUS - 1; sGridX < sCentreGridX + LOCAL_RADIUS + 1; sGridX++) {
      usGridNo = MAPROWCOLTOPOS(sGridY, sGridX);
      if (usGridNo < WORLD_MAX) {
        CompileTileMovementCosts(usGridNo);
      }
    }
  }
}

export function RecompileLocalMovementCostsFromRadius(sCentreGridNo: INT16, bRadius: INT8): void {
  let usGridNo: INT16;
  let sGridX: INT16;
  let sGridY: INT16;
  let sCentreGridX: INT16;
  let sCentreGridY: INT16;
  let bDirLoop: INT8;

  ({ sX: sCentreGridX, sY: sCentreGridY } = ConvertGridNoToXY(sCentreGridNo));
  if (bRadius == 0) {
    // one tile check only
    for (bDirLoop = 0; bDirLoop < MAXDIR; bDirLoop++) {
      gubWorldMovementCosts[sCentreGridNo][bDirLoop][0] = 0;
      gubWorldMovementCosts[sCentreGridNo][bDirLoop][1] = 0;
    }
    CompileTileMovementCosts(sCentreGridNo);
  } else {
    for (sGridY = sCentreGridY - bRadius; sGridY < sCentreGridY + bRadius; sGridY++) {
      for (sGridX = sCentreGridX - bRadius; sGridX < sCentreGridX + bRadius; sGridX++) {
        usGridNo = MAPROWCOLTOPOS(sGridY, sGridX);
        // times 2 for 2 levels, times 2 for UINT16s
        //			memset( &(gubWorldMovementCosts[usGridNo]), 0, MAXDIR * 2 * 2 );
        if (usGridNo < WORLD_MAX) {
          for (bDirLoop = 0; bDirLoop < MAXDIR; bDirLoop++) {
            gubWorldMovementCosts[usGridNo][bDirLoop][0] = 0;
            gubWorldMovementCosts[usGridNo][bDirLoop][1] = 0;
          }
        }
      }
    }

    // note the radius used in this loop is larger, to guarantee that the
    // edges of the recompiled areas are correct (i.e. there could be spillover)
    for (sGridY = sCentreGridY - bRadius - 1; sGridY < sCentreGridY + bRadius + 1; sGridY++) {
      for (sGridX = sCentreGridX - bRadius - 1; sGridX < sCentreGridX + bRadius + 1; sGridX++) {
        usGridNo = MAPROWCOLTOPOS(sGridY, sGridX);
        if (usGridNo < WORLD_MAX) {
          CompileTileMovementCosts(usGridNo);
        }
      }
    }
  }
}

export function AddTileToRecompileArea(sGridNo: INT16): void {
  let sCheckGridNo: INT16;
  let sCheckX: INT16;
  let sCheckY: INT16;

  // Set flag to wipe and recompile MPs in this tile
  if (sGridNo < 0 || sGridNo >= WORLD_MAX) {
    return;
  }

  gpWorldLevelData[sGridNo].ubExtFlags[0] |= MAPELEMENT_EXT_RECALCULATE_MOVEMENT;

  // check Top/Left of recompile region
  sCheckGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.NORTHWEST));
  sCheckX = sCheckGridNo % WORLD_COLS;
  sCheckY = Math.trunc(sCheckGridNo / WORLD_COLS);
  if (sCheckX < gsRecompileAreaLeft) {
    gsRecompileAreaLeft = sCheckX;
  }
  if (sCheckY < gsRecompileAreaTop) {
    gsRecompileAreaTop = sCheckY;
  }

  // check Bottom/Right
  sCheckGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTHEAST));
  sCheckX = sCheckGridNo % WORLD_COLS;
  sCheckY = Math.trunc(sCheckGridNo / WORLD_COLS);
  if (sCheckX > gsRecompileAreaRight) {
    gsRecompileAreaRight = sCheckX;
  }
  if (sCheckY > gsRecompileAreaBottom) {
    gsRecompileAreaBottom = sCheckY;
  }
}

export function RecompileLocalMovementCostsInAreaWithFlags(): void {
  let usGridNo: INT16;
  let sGridX: INT16;
  let sGridY: INT16;
  let bDirLoop: INT8;

  for (sGridY = gsRecompileAreaTop; sGridY <= gsRecompileAreaBottom; sGridY++) {
    for (sGridX = gsRecompileAreaLeft; sGridX < gsRecompileAreaRight; sGridX++) {
      usGridNo = MAPROWCOLTOPOS(sGridY, sGridX);
      if (usGridNo < WORLD_MAX && gpWorldLevelData[usGridNo].ubExtFlags[0] & MAPELEMENT_EXT_RECALCULATE_MOVEMENT) {
        // wipe MPs in this tile!
        for (bDirLoop = 0; bDirLoop < MAXDIR; bDirLoop++) {
          gubWorldMovementCosts[usGridNo][bDirLoop][0] = 0;
          gubWorldMovementCosts[usGridNo][bDirLoop][1] = 0;
        }
        // reset flag
        gpWorldLevelData[usGridNo].ubExtFlags[0] &= (~MAPELEMENT_EXT_RECALCULATE_MOVEMENT);
      }
    }
  }

  for (sGridY = gsRecompileAreaTop; sGridY <= gsRecompileAreaBottom; sGridY++) {
    for (sGridX = gsRecompileAreaLeft; sGridX <= gsRecompileAreaRight; sGridX++) {
      usGridNo = MAPROWCOLTOPOS(sGridY, sGridX);
      if (usGridNo < WORLD_MAX) {
        CompileTileMovementCosts(usGridNo);
      }
    }
  }
}

export function RecompileLocalMovementCostsForWall(sGridNo: INT16, ubOrientation: UINT8): void {
  let bDirLoop: INT8;
  let sUp: INT16;
  let sDown: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let sX: INT16;
  let sY: INT16;
  let sTempGridNo: INT16;

  switch (ubOrientation) {
    case Enum314.OUTSIDE_TOP_RIGHT:
    case Enum314.INSIDE_TOP_RIGHT:
      sUp = -1;
      sDown = 1;
      sLeft = 0;
      sRight = 1;
      break;
    case Enum314.OUTSIDE_TOP_LEFT:
    case Enum314.INSIDE_TOP_LEFT:
      sUp = 0;
      sDown = 1;
      sLeft = -1;
      sRight = 1;
      break;
    default:
      return;
  }

  for (sY = sUp; sY <= sDown; sY++) {
    for (sX = sLeft; sX <= sRight; sX++) {
      sTempGridNo = sGridNo + sX + sY * WORLD_COLS;
      for (bDirLoop = 0; bDirLoop < MAXDIR; bDirLoop++) {
        gubWorldMovementCosts[sTempGridNo][bDirLoop][0] = 0;
        gubWorldMovementCosts[sTempGridNo][bDirLoop][1] = 0;
      }

      CompileTileMovementCosts(sTempGridNo);
    }
  }
}

// GLOBAL WORLD MANIPULATION FUNCTIONS
export function CompileWorldMovementCosts(): void {
  let usGridNo: UINT16;

  for (let i = 0; i < gubWorldMovementCosts.length; i++) {
    for (let j = 0; j < gubWorldMovementCosts[i].length; j++) {
      gubWorldMovementCosts[i][j].fill(0);
    }
  }

  CompileWorldTerrainIDs();
  for (usGridNo = 0; usGridNo < WORLD_MAX; usGridNo++) {
    CompileTileMovementCosts(usGridNo);
  }
}

// SAVING CODE
export function SaveWorld(puiFilename: string /* Pointer<UINT8> */): boolean {
  let cnt: INT32;
  let uiSoldierSize: UINT32;
  let uiType: UINT32;
  let uiFlags: UINT32;
  let uiBytesWritten: UINT32;
  let uiNumWarningsCaught: UINT32 = 0;
  let hfile: HWFILE;
  let pLand: LEVELNODE | null;
  let pObject: LEVELNODE | null;
  let pStruct: LEVELNODE | null;
  let pShadow: LEVELNODE | null;
  let pRoof: LEVELNODE | null;
  let pOnRoof: LEVELNODE | null;
  let pTailLand: LEVELNODE | null = null;
  let usNumExitGrids: UINT16 = 0;
  let usTypeSubIndex: UINT16;
  let LayerCount: UINT8;
  let ObjectCount: UINT8;
  let StructCount: UINT8;
  let ShadowCount: UINT8;
  let RoofCount: UINT8;
  let OnRoofCount: UINT8;
  let ubType: UINT8;
  let ubTypeSubIndex: UINT8;
  let ubTest: UINT8 = 1;
  let aFilename: string /* CHAR8[255] */;
  let ubCombine: UINT8;
  let bCounts: UINT8[][] /* [WORLD_MAX][8] */ = createArrayFrom(WORLD_MAX, () => createArray(8, 0));
  let buffer: Buffer;

  aFilename = sprintf("MAPS\\%s", puiFilename);

  // Open file
  hfile = FileOpen(aFilename, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, false);

  if (!hfile) {
    return false;
  }

  buffer = Buffer.allocUnsafe(4);

  // Write JA2 Version ID
  buffer.writeFloatLE(gdMajorMapVersion, 0);
  uiBytesWritten = FileWrite(hfile, buffer, 4);
  if (gdMajorMapVersion >= 4.00) {
    buffer.writeUInt8(gubMinorMapVersion, 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);
  }

  // Write FLAGS FOR WORLD
  // uiFlags = MAP_WORLDONLY_SAVED;
  uiFlags = 0;
  uiFlags |= MAP_FULLSOLDIER_SAVED;
  uiFlags |= MAP_EXITGRIDS_SAVED;
  uiFlags |= MAP_WORLDLIGHTS_SAVED;
  uiFlags |= MAP_DOORTABLE_SAVED;
  uiFlags |= MAP_WORLDITEMS_SAVED;
  uiFlags |= MAP_EDGEPOINTS_SAVED;
  if (gfBasement || gfCaves)
    uiFlags |= MAP_AMBIENTLIGHTLEVEL_SAVED;
  uiFlags |= MAP_NPCSCHEDULES_SAVED;

  buffer.writeUInt32LE(uiFlags, 0);
  uiBytesWritten = FileWrite(hfile, buffer, 4);

  // Write tileset ID
  buffer.writeInt32LE(giCurrentTilesetID, 0);
  uiBytesWritten = FileWrite(hfile, buffer, 4);

  // Write SOLDIER CONTROL SIZE
  uiSoldierSize = SOLDIER_TYPE_SIZE;
  buffer.writeUInt32LE(uiSoldierSize, 0);
  uiBytesWritten = FileWrite(hfile, buffer, 4);

  // REMOVE WORLD VISIBILITY TILES
  RemoveWorldWireFrameTiles();

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write out height values
    buffer.writeUInt8(gpWorldLevelData[cnt].sHeight, 0);
    buffer.writeUInt8(0, 1);
    uiBytesWritten = FileWrite(hfile, buffer, 2);
  }

  // Write out # values - we'll have no more than 15 per level!
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Determine number of land
    pLand = gpWorldLevelData[cnt].pLandHead;
    LayerCount = 0;

    while (pLand != null) {
      LayerCount++;
      pLand = pLand.pNext;
    }
    if (LayerCount > 15) {
      gzErrorCatchString = swprintf("SAVE ABORTED!  Land count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.", LayerCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = true;
      FileClose(hfile);
      return false;
    }
    if (LayerCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = true;
      gzErrorCatchString = swprintf("Warnings %d -- Last warning:  Land count warning of %d for gridno %d.", uiNumWarningsCaught, LayerCount, cnt);
    }
    bCounts[cnt][0] = LayerCount;

    // Combine # of land layers with worlddef flags ( first 4 bits )
    ubCombine = ((LayerCount & 0xf) | ((gpWorldLevelData[cnt].uiFlags & 0xf) << 4));
    // Write combination
    buffer.writeUInt8(ubCombine, 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);

    // Determine # of objects
    pObject = gpWorldLevelData[cnt].pObjectHead;
    ObjectCount = 0;
    while (pObject != null) {
      // DON'T WRITE ANY ITEMS
      if (!(pObject.uiFlags & (LEVELNODE_ITEM))) {
        let uiTileType: UINT32;
        // Make sure this isn't a UI Element
        uiTileType = GetTileType(pObject.usIndex);
        if (uiTileType < Enum313.FIRSTPOINTERS)
          ObjectCount++;
      }
      pObject = pObject.pNext;
    }
    if (ObjectCount > 15) {
      gzErrorCatchString = swprintf("SAVE ABORTED!  Object count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.", ObjectCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = true;
      FileClose(hfile);
      return false;
    }
    if (ObjectCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = true;
      gzErrorCatchString = swprintf("Warnings %d -- Last warning:  Object count warning of %d for gridno %d.", uiNumWarningsCaught, ObjectCount, cnt);
    }
    bCounts[cnt][1] = ObjectCount;

    // Determine # of structs
    pStruct = gpWorldLevelData[cnt].pStructHead;
    StructCount = 0;
    while (pStruct != null) {
      // DON'T WRITE ANY ITEMS
      if (!(pStruct.uiFlags & (LEVELNODE_ITEM))) {
        StructCount++;
      }
      pStruct = pStruct.pNext;
    }
    if (StructCount > 15) {
      gzErrorCatchString = swprintf("SAVE ABORTED!  Struct count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.", StructCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = true;
      FileClose(hfile);
      return false;
    }
    if (StructCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = true;
      gzErrorCatchString = swprintf("Warnings %d -- Last warning:  Struct count warning of %d for gridno %d.", uiNumWarningsCaught, StructCount, cnt);
    }
    bCounts[cnt][2] = StructCount;

    ubCombine = ((ObjectCount & 0xf) | ((StructCount & 0xf) << 4));
    // Write combination
    buffer.writeUInt8(ubCombine, 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);

    // Determine # of shadows
    pShadow = gpWorldLevelData[cnt].pShadowHead;
    ShadowCount = 0;
    while (pShadow != null) {
      // Don't write any shadowbuddys or exit grids
      if (!(pShadow.uiFlags & (LEVELNODE_BUDDYSHADOW | LEVELNODE_EXITGRID))) {
        ShadowCount++;
      }
      pShadow = pShadow.pNext;
    }
    if (ShadowCount > 15) {
      gzErrorCatchString = swprintf("SAVE ABORTED!  Shadow count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.", ShadowCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = true;
      FileClose(hfile);
      return false;
    }
    if (ShadowCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = true;
      gzErrorCatchString = swprintf("Warnings %d -- Last warning:  Shadow count warning of %d for gridno %d.", uiNumWarningsCaught, ShadowCount, cnt);
    }
    bCounts[cnt][3] = ShadowCount;

    // Determine # of Roofs
    pRoof = gpWorldLevelData[cnt].pRoofHead;
    RoofCount = 0;
    while (pRoof != null) {
      // ATE: Don't save revealed roof info...
      if (pRoof.usIndex != Enum312.SLANTROOFCEILING1) {
        RoofCount++;
      }
      pRoof = pRoof.pNext;
    }
    if (RoofCount > 15) {
      gzErrorCatchString = swprintf("SAVE ABORTED!  Roof count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.", RoofCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = true;
      FileClose(hfile);
      return false;
    }
    if (RoofCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = true;
      gzErrorCatchString = swprintf("Warnings %d -- Last warning:  Roof count warning of %d for gridno %d.", uiNumWarningsCaught, RoofCount, cnt);
    }
    bCounts[cnt][4] = RoofCount;

    ubCombine = ((ShadowCount & 0xf) | ((RoofCount & 0xf) << 4));
    // Write combination
    buffer.writeUInt8(ubCombine, 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);

    // Write OnRoof layer
    // Determine # of OnRoofs
    pOnRoof = gpWorldLevelData[cnt].pOnRoofHead;
    OnRoofCount = 0;

    while (pOnRoof != null) {
      OnRoofCount++;
      pOnRoof = pOnRoof.pNext;
    }
    if (OnRoofCount > 15) {
      gzErrorCatchString = swprintf("SAVE ABORTED!  OnRoof count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.", OnRoofCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = true;
      FileClose(hfile);
      return false;
    }
    if (OnRoofCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = true;
      gzErrorCatchString = swprintf("Warnings %d -- Last warning:  OnRoof count warning of %d for gridno %d.", uiNumWarningsCaught, OnRoofCount, cnt);
    }
    bCounts[cnt][5] = RoofCount;

    // Write combination of onroof and nothing...
    ubCombine = ((OnRoofCount & 0xf));
    // Write combination
    buffer.writeUInt8(ubCombine, 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (bCounts[cnt][0] == 0) {
      buffer.writeUInt8(ubTest, 0);
      uiBytesWritten = FileWrite(hfile, buffer, 1);
      uiBytesWritten = FileWrite(hfile, buffer, 1);
    } else {
      // Write land layers
      // Write out land peices backwards so that they are loaded properly
      pLand = gpWorldLevelData[cnt].pLandHead;
      // GET TAIL
      while (pLand != null) {
        pTailLand = pLand;
        pLand = pLand.pNext;
      }

      while (pTailLand != null) {
        // Write out object type and sub-index
        uiType = GetTileType(pTailLand.usIndex);
        ubType = uiType;
        ubTypeSubIndex = GetTypeSubIndexFromTileIndexChar(uiType, pTailLand.usIndex);
        buffer.writeUInt8(ubType, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);
        buffer.writeUInt8(ubTypeSubIndex, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);

        pTailLand = pTailLand.pPrevNode;
      }
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write object layer
    pObject = gpWorldLevelData[cnt].pObjectHead;
    while (pObject != null) {
      // DON'T WRITE ANY ITEMS
      if (!(pObject.uiFlags & (LEVELNODE_ITEM))) {
        // Write out object type and sub-index
        uiType = GetTileType(pObject.usIndex);
        // Make sure this isn't a UI Element
        if (uiType < Enum313.FIRSTPOINTERS) {
          // We are writing 2 bytes for the type subindex in the object layer because the
          // ROADPIECES slot contains more than 256 subindices.
          ubType = uiType;
          usTypeSubIndex = GetTypeSubIndexFromTileIndex(uiType, pObject.usIndex);
          buffer.writeUInt8(ubType, 0);
          uiBytesWritten = FileWrite(hfile, buffer, 1);
          buffer.writeUInt16LE(usTypeSubIndex, 0);
          uiBytesWritten = FileWrite(hfile, buffer, 2);
        }
      }
      pObject = pObject.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write struct layer
    pStruct = gpWorldLevelData[cnt].pStructHead;
    while (pStruct != null) {
      // DON'T WRITE ANY ITEMS
      if (!(pStruct.uiFlags & (LEVELNODE_ITEM))) {
        // Write out object type and sub-index
        uiType = GetTileType(pStruct.usIndex);
        ubType = uiType;
        ubTypeSubIndex = GetTypeSubIndexFromTileIndexChar(uiType, pStruct.usIndex);
        buffer.writeUInt8(ubType, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);
        buffer.writeUInt8(ubTypeSubIndex, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);
      }

      pStruct = pStruct.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write shadows
    pShadow = gpWorldLevelData[cnt].pShadowHead;
    while (pShadow != null) {
      // Dont't write any buddys or exit grids
      if (!(pShadow.uiFlags & (LEVELNODE_BUDDYSHADOW | LEVELNODE_EXITGRID))) {
        // Write out object type and sub-index
        // Write out object type and sub-index
        uiType = GetTileType(pShadow.usIndex);
        ubType = uiType;
        ubTypeSubIndex = GetTypeSubIndexFromTileIndexChar(uiType, pShadow.usIndex);
        buffer.writeUInt8(ubType, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);
        buffer.writeUInt8(ubTypeSubIndex, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);
      } else if (pShadow.uiFlags & LEVELNODE_EXITGRID) {
        // count the number of exitgrids
        usNumExitGrids++;
      }

      pShadow = pShadow.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pRoof = gpWorldLevelData[cnt].pRoofHead;
    while (pRoof != null) {
      // ATE: Don't save revealed roof info...
      if (pRoof.usIndex != Enum312.SLANTROOFCEILING1) {
        // Write out object type and sub-index
        uiType = GetTileType(pRoof.usIndex);
        ubType = uiType;
        ubTypeSubIndex = GetTypeSubIndexFromTileIndexChar(uiType, pRoof.usIndex);
        buffer.writeUInt8(ubType, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);
        buffer.writeUInt8(ubTypeSubIndex, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);
      }

      pRoof = pRoof.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write OnRoofs
    pOnRoof = gpWorldLevelData[cnt].pOnRoofHead;
    while (pOnRoof != null) {
      // Write out object type and sub-index
      uiType = GetTileType(pOnRoof.usIndex);
      ubType = uiType;
      ubTypeSubIndex = GetTypeSubIndexFromTileIndexChar(uiType, pOnRoof.usIndex);
      buffer.writeUInt8(ubType, 0);
      uiBytesWritten = FileWrite(hfile, buffer, 1);
      buffer.writeUInt8(ubTypeSubIndex, 0);
      uiBytesWritten = FileWrite(hfile, buffer, 1);

      pOnRoof = pOnRoof.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write out room information
    buffer.writeUInt8(gubWorldRoomInfo[cnt], 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);
  }

  if (uiFlags & MAP_WORLDITEMS_SAVED) {
    // Write out item information
    SaveWorldItemsToMap(hfile);
  }

  if (uiFlags & MAP_AMBIENTLIGHTLEVEL_SAVED) {
    buffer.writeUInt8(Number(gfBasement), 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);
    buffer.writeUInt8(Number(gfCaves), 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);
    buffer.writeUInt8(ubAmbientLightLevel, 0);
    uiBytesWritten = FileWrite(hfile, buffer, 1);
  }

  if (uiFlags & MAP_WORLDLIGHTS_SAVED) {
    SaveMapLights(hfile);
  }

  SaveMapInformation(hfile);

  if (uiFlags & MAP_FULLSOLDIER_SAVED) {
    SaveSoldiersToMap(hfile);
  }
  if (uiFlags & MAP_EXITGRIDS_SAVED) {
    SaveExitGrids(hfile, usNumExitGrids);
  }
  if (uiFlags & MAP_DOORTABLE_SAVED) {
    SaveDoorTableToMap(hfile);
  }
  if (uiFlags & MAP_EDGEPOINTS_SAVED) {
    CompileWorldMovementCosts();
    GenerateMapEdgepoints();
    SaveMapEdgepoints(hfile);
  }
  if (uiFlags & MAP_NPCSCHEDULES_SAVED) {
    SaveSchedules(hfile);
  }

  FileClose(hfile);

  gubFilename = puiFilename;

  return true;
}

const NUM_DIR_SEARCHES = 5;
let bDirectionsForShadowSearch: INT8[] /* [NUM_DIR_SEARCHES] */ = [
  Enum245.WEST,
  Enum245.SOUTHWEST,
  Enum245.SOUTH,
  Enum245.SOUTHEAST,
  Enum245.EAST,
];

function OptimizeMapForShadows(): void {
  let cnt: INT32;
  let dir: INT32;
  let sNewGridNo: INT16;
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // CHECK IF WE ARE A TREE HERE
    if (IsTreePresentAtGridno(cnt)) {
      // CHECK FOR A STRUCTURE A FOOTPRINT AWAY
      for (dir = 0; dir < NUM_DIR_SEARCHES; dir++) {
        sNewGridNo = NewGridNo(cnt, DirectionInc(bDirectionsForShadowSearch[dir]));

        if (gpWorldLevelData[sNewGridNo].pStructureHead == null) {
          break;
        }
      }
      // If we made it here, remove shadow!
      // We're full of structures
      if (dir == NUM_DIR_SEARCHES) {
        RemoveAllShadows(cnt);
        // Display message to effect
      }
    }
  }
}

function SetBlueFlagFlags(): void {
  let cnt: INT32;
  let pNode: LEVELNODE | null;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pNode = gpWorldLevelData[cnt].pStructHead;
    while (pNode) {
      if (pNode.usIndex == BLUEFLAG_GRAPHIC) {
        gpWorldLevelData[cnt].uiFlags |= MAPELEMENT_PLAYER_MINE_PRESENT;
        break;
      }
      pNode = pNode.pNext;
    }
  }
}

export function InitLoadedWorld(): void {
  // if the current sector is not valid, dont init the world
  if (gWorldSectorX == 0 || gWorldSectorY == 0) {
    return;
  }

  // COMPILE MOVEMENT COSTS
  CompileWorldMovementCosts();

  // COMPILE INTERACTIVE TILES
  CompileInteractiveTiles();

  // COMPILE WORLD VISIBLIY TILES
  CalculateWorldWireFrameTiles(true);

  LightSpriteRenderAll();

  OptimizeMapForShadows();

  SetInterfaceHeightLevel();

  // ATE: if we have a slide location, remove it!
  gTacticalStatus.sSlideTarget = NOWHERE;

  SetBlueFlagFlags();
}

export function EvaluateWorld(pSector: string /* Pointer<UINT8> */, ubLevel: UINT8): boolean {
  let dMajorMapVersion: FLOAT;
  let pSummary: SUMMARYFILE;
  let hfile: HWFILE;
  let mapInfo: MAPCREATE_STRUCT = createMapCreateStruct();
  let uiFileSize: UINT32;
  let uiFlags: UINT32;
  let uiBytesRead: UINT32;
  let cnt: INT32;
  let i: INT32;
  let iTilesetID: INT32;
  let str: string /* UINT16[40] */;
  let bCounts: UINT8[][] /* [WORLD_MAX][8] */ = createArrayFrom(WORLD_MAX, () => createArray(8, 0));
  let ubCombine: UINT8;
  let szDirFilename: string /* UINT8[50] */;
  let szFilename: string /* UINT8[40] */;
  let ubMinorMapVersion: UINT8;
  let buffer: Buffer;
  let offset: number;

  // Make sure the file exists... if not, then return false
  szFilename = pSector;
  if (ubLevel % 4) {
    let str: string /* UINT8[4] */;
    str = sprintf("_b%d", ubLevel % 4);
    szFilename += str;
  }
  if (ubLevel >= 4) {
    szFilename += "_a";
  }
  szFilename += ".dat";
  szDirFilename = sprintf("MAPS\\%s", szFilename);

  if (gfMajorUpdate) {
    if (!LoadWorld(szFilename)) // error
      return false;
    FileClearAttributes(szDirFilename);
    SaveWorld(szFilename);
  }

  hfile = FileOpen(szDirFilename, FILE_ACCESS_READ, false);
  if (!hfile)
    return false;

  uiFileSize = FileGetSize(hfile);
  buffer = Buffer.allocUnsafe(uiFileSize);
  uiBytesRead = FileRead(hfile, buffer, uiFileSize);
  FileClose(hfile);

  str = swprintf("Analyzing map %S", szFilename);
  if (!gfUpdatingNow)
    SetRelativeStartAndEndPercentage(0, 0, 100, str);
  else
    SetRelativeStartAndEndPercentage(0, MasterStart, MasterEnd, str);

  RenderProgressBar(0, 0);
  // RenderProgressBar( 1, 0 );

  // clear the summary file info
  pSummary = createSummaryFile();
  pSummary.ubSummaryVersion = GLOBAL_SUMMARY_VERSION;
  pSummary.dMajorMapVersion = gdMajorMapVersion;

  offset = 0;

  // skip JA2 Version ID
  dMajorMapVersion = buffer.readFloatLE(offset); offset += 4;
  if (dMajorMapVersion >= 4.00) {
    ubMinorMapVersion = buffer.readUInt8(offset++);
  }

  // Read FLAGS FOR WORLD
  uiFlags = buffer.readUInt32LE(offset); offset += 4;

  // Read tilesetID
  iTilesetID = buffer.readInt32LE(offset); offset += 4;
  pSummary.ubTilesetID = iTilesetID;

  // skip soldier size
  offset += 4;

  // skip height values
  offset += 2 * WORLD_MAX;

  // read layer counts
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (!(cnt % 2560)) {
      RenderProgressBar(0, Math.trunc(cnt / 2560) + 1); // 1 - 10
      // RenderProgressBar( 1, (cnt / 2560)+1 ); //1 - 10
    }
    // Read combination of land/world flags
    ubCombine = buffer.readUInt8(offset++);
    // split
    bCounts[cnt][0] = (ubCombine & 0xf);
    gpWorldLevelData[cnt].uiFlags |= ((ubCombine & 0xf0) >> 4);
    // Read #objects, structs
    ubCombine = buffer.readUInt8(offset++);
    // split
    bCounts[cnt][1] = (ubCombine & 0xf);
    bCounts[cnt][2] = ((ubCombine & 0xf0) >> 4);
    // Read shadows, roof
    ubCombine = buffer.readUInt8(offset++);
    // split
    bCounts[cnt][3] = (ubCombine & 0xf);
    bCounts[cnt][4] = ((ubCombine & 0xf0) >> 4);
    // Read OnRoof, nothing
    ubCombine = buffer.readUInt8(offset++);
    // split
    bCounts[cnt][5] = (ubCombine & 0xf);
    // bCounts[ cnt ][4] = (UINT8)((ubCombine&0xf0)>>4);
    bCounts[cnt][6] = bCounts[cnt][0] + bCounts[cnt][1] + bCounts[cnt][2] + bCounts[cnt][3] + bCounts[cnt][4] + bCounts[cnt][5];
  }
  // skip all layers
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (!(cnt % 320)) {
      RenderProgressBar(0, Math.trunc(cnt / 320) + 11); // 11 - 90
      // RenderProgressBar( 1, (cnt / 320)+11 ); //11 - 90
    }
    offset += 2 * bCounts[cnt][6];
    offset += bCounts[cnt][1];
  }

  // extract highest room number
  {
    let ubRoomNum: UINT8;
    for (cnt = 0; cnt < WORLD_MAX; cnt++) {
      ubRoomNum = buffer.readUInt8(offset++);
      if (ubRoomNum > pSummary.ubNumRooms) {
        pSummary.ubNumRooms = ubRoomNum;
      }
    }
  }

  if (uiFlags & MAP_WORLDITEMS_SAVED) {
    let temp: UINT32;
    RenderProgressBar(0, 91);
    // RenderProgressBar( 1, 91 );
    // get number of items (for now)
    temp = buffer.readUInt32LE(offset); offset += 4;
    pSummary.usNumItems = temp;
    // Important:  Saves the file position (byte offset) of the position where the numitems
    //            resides.  Checking this value and comparing to usNumItems will ensure validity.
    if (pSummary.usNumItems) {
      pSummary.uiNumItemsPosition = offset - 4;
    }
    // Skip the contents of the world items.
    offset += WORLD_ITEM_SIZE * pSummary.usNumItems;
  }

  if (uiFlags & MAP_AMBIENTLIGHTLEVEL_SAVED) {
    offset += 3;
  }

  if (uiFlags & MAP_WORLDLIGHTS_SAVED) {
    let ubTemp: UINT8;
    RenderProgressBar(0, 92);
    // RenderProgressBar( 1, 92 );
    // skip number of light palette entries
    ubTemp = buffer.readUInt8(offset++);
    offset += SGP_PALETTE_ENTRY_SIZE * ubTemp;
    // get number of lights
    pSummary.usNumLights = buffer.readUInt16LE(offset); offset += 2;
    // skip the light loading
    for (cnt = 0; cnt < pSummary.usNumLights; cnt++) {
      let ubStrLen: UINT8;
      offset += LIGHT_SPRITE_SIZE;
      ubStrLen = buffer.readUInt8(offset++);
      if (ubStrLen) {
        offset += ubStrLen;
      }
    }
  }

  // read the mapinformation
  offset = readMapCreateStruct(mapInfo, buffer, offset);

  copyMapCreateStruct(pSummary.MapInfo, mapInfo);

  if (uiFlags & MAP_FULLSOLDIER_SAVED) {
    let pTeam: TEAMSUMMARY = <TEAMSUMMARY><unknown>undefined;
    let basic: BASIC_SOLDIERCREATE_STRUCT = createBasicSoldierCreateStruct();
    let priority: SOLDIERCREATE_STRUCT = createSoldierCreateStruct();
    RenderProgressBar(0, 94);
    // RenderProgressBar( 1, 94 );

    pSummary.uiEnemyPlacementPosition = offset;

    for (i = 0; i < pSummary.MapInfo.ubNumIndividuals; i++) {
      offset = readBasicSoldierCreateStruct(basic, buffer, offset);

      switch (basic.bTeam) {
        case ENEMY_TEAM:
          pTeam = pSummary.EnemyTeam;
          break;
        case CREATURE_TEAM:
          pTeam = pSummary.CreatureTeam;
          break;
        case MILITIA_TEAM:
          pTeam = pSummary.RebelTeam;
          break;
        case CIV_TEAM:
          pTeam = pSummary.CivTeam;
          break;
      }
      if (basic.bOrders == Enum241.RNDPTPATROL || basic.bOrders == Enum241.POINTPATROL) {
        // make sure the placement has at least one waypoint.
        if (!basic.bPatrolCnt) {
          pSummary.ubEnemiesReqWaypoints++;
        }
      } else if (basic.bPatrolCnt) {
        pSummary.ubEnemiesHaveWaypoints++;
      }
      if (basic.fPriorityExistance)
        pTeam.ubExistance++;
      switch (basic.bRelativeAttributeLevel) {
        case 0:
          pTeam.ubBadA++;
          break;
        case 1:
          pTeam.ubPoorA++;
          break;
        case 2:
          pTeam.ubAvgA++;
          break;
        case 3:
          pTeam.ubGoodA++;
          break;
        case 4:
          pTeam.ubGreatA++;
          break;
      }
      switch (basic.bRelativeEquipmentLevel) {
        case 0:
          pTeam.ubBadE++;
          break;
        case 1:
          pTeam.ubPoorE++;
          break;
        case 2:
          pTeam.ubAvgE++;
          break;
        case 3:
          pTeam.ubGoodE++;
          break;
        case 4:
          pTeam.ubGreatE++;
          break;
      }
      if (basic.fDetailedPlacement) {
        // skip static priority placement
        offset = readSoldierCreateStruct(priority, buffer, offset);
        if (priority.ubProfile != NO_PROFILE)
          pTeam.ubProfile++;
        else
          pTeam.ubDetailed++;
        if (basic.bTeam == CIV_TEAM) {
          if (priority.ubScheduleID)
            pSummary.ubCivSchedules++;
          if (priority.bBodyType == Enum194.COW)
            pSummary.ubCivCows++;
          else if (priority.bBodyType == Enum194.BLOODCAT)
            pSummary.ubCivBloodcats++;
        }
      }
      if (basic.bTeam == ENEMY_TEAM) {
        switch (basic.ubSoldierClass) {
          case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
            pSummary.ubNumAdmins++;
            if (basic.fPriorityExistance)
              pSummary.ubAdminExistance++;
            if (basic.fDetailedPlacement) {
              if (priority.ubProfile != NO_PROFILE)
                pSummary.ubAdminProfile++;
              else
                pSummary.ubAdminDetailed++;
            }
            break;
          case Enum262.SOLDIER_CLASS_ELITE:
            pSummary.ubNumElites++;
            if (basic.fPriorityExistance)
              pSummary.ubEliteExistance++;
            if (basic.fDetailedPlacement) {
              if (priority.ubProfile != NO_PROFILE)
                pSummary.ubEliteProfile++;
              else
                pSummary.ubEliteDetailed++;
            }
            break;
          case Enum262.SOLDIER_CLASS_ARMY:
            pSummary.ubNumTroops++;
            if (basic.fPriorityExistance)
              pSummary.ubTroopExistance++;
            if (basic.fDetailedPlacement) {
              if (priority.ubProfile != NO_PROFILE)
                pSummary.ubTroopProfile++;
              else
                pSummary.ubTroopDetailed++;
            }
            break;
        }
      } else if (basic.bTeam == CREATURE_TEAM) {
        if (basic.bBodyType == Enum194.BLOODCAT)
          pTeam.ubNumAnimals++;
      }
      pTeam.ubTotal++;
    }
    RenderProgressBar(0, 96);
    // RenderProgressBar( 1, 96 );
  }

  if (uiFlags & MAP_EXITGRIDS_SAVED) {
    let exitGrid: EXITGRID = createExitGrid();
    let loop: INT32;
    let usMapIndex: UINT16;
    let fExitGridFound: boolean;
    RenderProgressBar(0, 98);
    // RenderProgressBar( 1, 98 );

    cnt = buffer.readUInt16LE(offset); offset += 2;

    for (i = 0; i < cnt; i++) {
      usMapIndex = buffer.readUInt16LE(offset); offset += 2;
      offset = readExitGrid(exitGrid, buffer, offset);
      fExitGridFound = false;
      for (loop = 0; loop < pSummary.ubNumExitGridDests; loop++) {
        if (pSummary.ExitGrid[loop].usGridNo == exitGrid.usGridNo && pSummary.ExitGrid[loop].ubGotoSectorX == exitGrid.ubGotoSectorX && pSummary.ExitGrid[loop].ubGotoSectorY == exitGrid.ubGotoSectorY && pSummary.ExitGrid[loop].ubGotoSectorZ == exitGrid.ubGotoSectorZ) {
          // same destination.
          pSummary.usExitGridSize[loop]++;
          fExitGridFound = true;
          break;
        }
      }
      if (!fExitGridFound) {
        if (loop >= 4) {
          pSummary.fTooManyExitGridDests = true;
        } else {
          pSummary.ubNumExitGridDests++;
          pSummary.usExitGridSize[loop]++;
          pSummary.ExitGrid[loop].usGridNo = exitGrid.usGridNo;
          pSummary.ExitGrid[loop].ubGotoSectorX = exitGrid.ubGotoSectorX;
          pSummary.ExitGrid[loop].ubGotoSectorY = exitGrid.ubGotoSectorY;
          pSummary.ExitGrid[loop].ubGotoSectorZ = exitGrid.ubGotoSectorZ;
          if (pSummary.ExitGrid[loop].ubGotoSectorX != exitGrid.ubGotoSectorX || pSummary.ExitGrid[loop].ubGotoSectorY != exitGrid.ubGotoSectorY) {
            pSummary.fInvalidDest[loop] = true;
          }
        }
      }
    }
  }

  if (uiFlags & MAP_DOORTABLE_SAVED) {
    let Door: DOOR = createDoor();

    pSummary.ubNumDoors = buffer.readUInt8(offset++);

    for (cnt = 0; cnt < pSummary.ubNumDoors; cnt++) {
      offset = readDoor(Door, buffer, offset);

      if (Door.ubTrapID && Door.ubLockID)
        pSummary.ubNumDoorsLockedAndTrapped++;
      else if (Door.ubLockID)
        pSummary.ubNumDoorsLocked++;
      else if (Door.ubTrapID)
        pSummary.ubNumDoorsTrapped++;
    }
  }

  RenderProgressBar(0, 100);
  // RenderProgressBar( 1, 100 );

  WriteSectorSummaryUpdate(szFilename, ubLevel, pSummary);
  return true;
}

export function LoadWorld(puiFilename: string /* Pointer<UINT8> */): boolean {
  let hfile: HWFILE;
  let dMajorMapVersion: FLOAT;
  let uiFlags: UINT32;
  let uiBytesRead: UINT32;
  let uiSoldierSize: UINT32;
  let uiFileSize: UINT32;
  let fp: UINT32;
  let offset: UINT32;
  let cnt: INT32;
  let cnt2: INT32;
  let iTilesetID: INT32;
  let usTileIndex: UINT16;
  let usTypeSubIndex: UINT16;
  let ubType: UINT8;
  let ubSubIndex: UINT8;
  let aFilename: string /* CHAR8[50] */;
  let ubCombine: UINT8;
  let bCounts: UINT8[][] /* [WORLD_MAX][8] */ = createArrayFrom(WORLD_MAX, () => createArray(8, 0));
  let fGenerateEdgePoints: boolean = false;
  let ubMinorMapVersion: UINT8;
  let buffer: Buffer;
  let bufferOffset: number;

  LoadShadeTablesFromTextFile();

  // Append exension to filename!
  if (gfForceLoad) {
    aFilename = sprintf("MAPS\\%s", gzForceLoadFile);
  } else {
    aFilename = sprintf("MAPS\\%s", puiFilename);
  }

  // RESET FLAGS FOR OUTDOORS/INDOORS
  gfBasement = false;
  gfCaves = false;

  // Open file
  hfile = FileOpen(aFilename, FILE_ACCESS_READ, false);

  if (!hfile) {
    SET_ERROR("Could not load map file %S", aFilename);
    return false;
  }

  SetRelativeStartAndEndPercentage(0, 0, 1, "Trashing world...");

  TrashWorld();

  LightReset();

  // Get the file size and alloc one huge buffer for it.
  // We will use this buffer to transfer all of the data from.
  uiFileSize = FileGetSize(hfile);
  buffer = Buffer.allocUnsafe(uiFileSize);
  uiBytesRead = FileRead(hfile, buffer, uiFileSize);
  FileClose(hfile);

  bufferOffset = 0;

  // Read JA2 Version ID
  dMajorMapVersion = buffer.readFloatLE(bufferOffset); bufferOffset += 4;

// FIXME: Language-specific code
// #ifdef RUSSIAN
//   if (dMajorMapVersion != 6.00) {
//     return FALSE;
//   }
// #endif

  ubMinorMapVersion = buffer.readUInt8(bufferOffset++);

  // CHECK FOR NON-COMPATIBLE VERSIONS!
  // CHECK FOR MAJOR MAP VERSION INCOMPATIBLITIES
  // if ( dMajorMapVersion < gdMajorMapVersion )
  //{
  // AssertMsg( 0, "Major version conflict.  Should have force updated this map already!!!" );
  // SET_ERROR(  "Incompatible JA2 map version: %f, map version is now at %f", gdLoadedMapVersion, gdMapVersion );
  // return( FALSE );
  //}

  // Read FLAGS FOR WORLD
  uiFlags = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;

  iTilesetID = buffer.readInt32LE(bufferOffset); bufferOffset += 4;

  if (LoadMapTileset(iTilesetID) == false) {
    return false;
  }

  // Load soldier size
  uiSoldierSize = buffer.readUInt32LE(bufferOffset); bufferOffset += 4;

  // FP 0x000010

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Read height values
    gpWorldLevelData[cnt].sHeight = buffer.readUInt8(bufferOffset++);
    bufferOffset++;
  }

  // FP 0x00c810

  SetRelativeStartAndEndPercentage(0, 35, 40, "Counting layers...");
  RenderProgressBar(0, 100);

  // Read layer counts
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Read combination of land/world flags
    ubCombine = buffer.readUInt8(bufferOffset++);

    // split
    bCounts[cnt][0] = (ubCombine & 0xf);
    gpWorldLevelData[cnt].uiFlags |= ((ubCombine & 0xf0) >> 4);

    // Read #objects, structs
    ubCombine = buffer.readUInt8(bufferOffset++);

    // split
    bCounts[cnt][1] = (ubCombine & 0xf);
    bCounts[cnt][2] = ((ubCombine & 0xf0) >> 4);

    // Read shadows, roof
    ubCombine = buffer.readUInt8(bufferOffset++);

    // split
    bCounts[cnt][3] = (ubCombine & 0xf);
    bCounts[cnt][4] = ((ubCombine & 0xf0) >> 4);

    // Read OnRoof, nothing
    ubCombine = buffer.readUInt8(bufferOffset++);

    // split
    bCounts[cnt][5] = (ubCombine & 0xf);
  }

  // FP 0x025810
  fp = 0x025810;
  offset = 0;

  SetRelativeStartAndEndPercentage(0, 40, 43, "Loading land layers...");
  RenderProgressBar(0, 100);

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Read new values
    if (bCounts[cnt][0] > 10) {
      cnt = cnt;
    }
    for (cnt2 = 0; cnt2 < bCounts[cnt][0]; cnt2++) {
      ubType = buffer.readUInt8(bufferOffset++);
      ubSubIndex = buffer.readUInt8(bufferOffset++);

      // Get tile index
      usTileIndex = GetTileIndexFromTypeSubIndex(ubType, ubSubIndex);

      // Add layer
      AddLandToHead(cnt, usTileIndex);

      offset += 2;
    }
  }

  fp += offset;
  offset = 0;

  SetRelativeStartAndEndPercentage(0, 43, 46, "Loading object layer...");
  RenderProgressBar(0, 100);

  if (0) {
    // Old loads
    for (cnt = 0; cnt < WORLD_MAX; cnt++) {
      // Set objects
      for (cnt2 = 0; cnt2 < bCounts[cnt][1]; cnt2++) {
        ubType = buffer.readUInt8(bufferOffset++);
        ubSubIndex = buffer.readUInt8(bufferOffset++);
        if (ubType >= Enum313.FIRSTPOINTERS) {
          continue;
        }
        // Get tile index
        usTileIndex = GetTileIndexFromTypeSubIndex(ubType, ubSubIndex);
        // Add layer
        AddObjectToTail(cnt, usTileIndex);
      }
    }
  } else {
    // New load require UINT16 for the type subindex due to the fact that ROADPIECES
    // contain over 300 type subindices.
    for (cnt = 0; cnt < WORLD_MAX; cnt++) {
      // Set objects
      if (bCounts[cnt][1] > 10) {
        cnt = cnt;
      }
      for (cnt2 = 0; cnt2 < bCounts[cnt][1]; cnt2++) {
        ubType = buffer.readUInt8(bufferOffset++);
        usTypeSubIndex = buffer.readUInt16LE(bufferOffset); bufferOffset += 2;
        if (ubType >= Enum313.FIRSTPOINTERS) {
          continue;
        }
        // Get tile index
        usTileIndex = GetTileIndexFromTypeSubIndex(ubType, usTypeSubIndex);
        // Add layer
        AddObjectToTail(cnt, usTileIndex);

        offset += 3;
      }
    }
  }

  fp += offset;
  offset = 0;

  SetRelativeStartAndEndPercentage(0, 46, 49, "Loading struct layer...");
  RenderProgressBar(0, 100);

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Set structs
    if (bCounts[cnt][2] > 10) {
      cnt = cnt;
    }
    for (cnt2 = 0; cnt2 < bCounts[cnt][2]; cnt2++) {
      ubType = buffer.readUInt8(bufferOffset++);
      ubSubIndex = buffer.readUInt8(bufferOffset++);

      // Get tile index
      usTileIndex = GetTileIndexFromTypeSubIndex(ubType, ubSubIndex);

      if (ubMinorMapVersion <= 25) {
        // Check patching for phantom menace struct data...
        if (gTileDatabase[usTileIndex].uiFlags & UNDERFLOW_FILLER) {
          usTileIndex = GetTileIndexFromTypeSubIndex(ubType, 1);
        }
      }

      // Add layer
      AddStructToTail(cnt, usTileIndex);

      offset += 2;
    }
  }

  fp += offset;
  offset = 0;

  SetRelativeStartAndEndPercentage(0, 49, 52, "Loading shadow layer...");
  RenderProgressBar(0, 100);

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (bCounts[cnt][3] > 10) {
      cnt = cnt;
    }
    for (cnt2 = 0; cnt2 < bCounts[cnt][3]; cnt2++) {
      ubType = buffer.readUInt8(bufferOffset++);
      ubSubIndex = buffer.readUInt8(bufferOffset++);

      // Get tile index
      usTileIndex = GetTileIndexFromTypeSubIndex(ubType, ubSubIndex);

      // Add layer
      AddShadowToTail(cnt, usTileIndex);

      offset += 2;
    }
  }

  fp += offset;
  offset = 0;

  SetRelativeStartAndEndPercentage(0, 52, 55, "Loading roof layer...");
  RenderProgressBar(0, 100);

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (bCounts[cnt][4] > 10) {
      cnt = cnt;
    }
    for (cnt2 = 0; cnt2 < bCounts[cnt][4]; cnt2++) {
      ubType = buffer.readUInt8(bufferOffset++);
      ubSubIndex = buffer.readUInt8(bufferOffset++);

      // Get tile index
      usTileIndex = GetTileIndexFromTypeSubIndex(ubType, ubSubIndex);

      // Add layer
      AddRoofToTail(cnt, usTileIndex);

      offset += 2;
    }
  }

  fp += offset;
  offset = 0;

  SetRelativeStartAndEndPercentage(0, 55, 58, "Loading on roof layer...");
  RenderProgressBar(0, 100);

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (bCounts[cnt][5] > 10) {
      cnt = cnt;
    }
    for (cnt2 = 0; cnt2 < bCounts[cnt][5]; cnt2++) {
      ubType = buffer.readUInt8(bufferOffset++);
      ubSubIndex = buffer.readUInt8(bufferOffset++);

      // Get tile index
      usTileIndex = GetTileIndexFromTypeSubIndex(ubType, ubSubIndex);

      // Add layer
      AddOnRoofToTail(cnt, usTileIndex);

      offset += 2;
    }
  }

  fp += offset;
  offset = 0;

// FIXME: Language-specific code
// #ifdef RUSSIAN
//   {
//     UINT32 uiNums[37];
//     LOADDATA(uiNums, pBuffer, 37 * sizeof(INT32));
//   }
// #endif

  SetRelativeStartAndEndPercentage(0, 58, 59, "Loading room information...");
  RenderProgressBar(0, 100);

  gubMaxRoomNumber = 0;
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Read room information
    gubWorldRoomInfo[cnt] = buffer.readUInt8(bufferOffset++);
    // Got to set the max room number
    if (gubWorldRoomInfo[cnt] > gubMaxRoomNumber)
      gubMaxRoomNumber = gubWorldRoomInfo[cnt];
  }
  if (gubMaxRoomNumber < 255)
    gubMaxRoomNumber++;

  // ATE; Memset this array!
  if (0) {
    // for debugging purposes
    gubWorldRoomInfo.fill(0);
  }

  gubWorldRoomHidden.fill(true);

  SetRelativeStartAndEndPercentage(0, 59, 61, "Loading items...");
  RenderProgressBar(0, 100);

  if (uiFlags & MAP_WORLDITEMS_SAVED) {
    // Load out item information
    gfLoadPitsWithoutArming = true;
    bufferOffset = LoadWorldItemsFromMap(buffer, bufferOffset);
    gfLoadPitsWithoutArming = false;
  }

  SetRelativeStartAndEndPercentage(0, 62, 85, "Loading lights...");
  RenderProgressBar(0, 0);

  if (uiFlags & MAP_AMBIENTLIGHTLEVEL_SAVED) {
    // Ambient light levels are only saved in underground levels
    gfBasement = Boolean(buffer.readUInt8(bufferOffset++));
    gfCaves = Boolean(buffer.readUInt8(bufferOffset++));
    ubAmbientLightLevel = buffer.readUInt8(bufferOffset++);
  } else {
    // We are above ground.
    gfBasement = false;
    gfCaves = false;
    if (!gfEditMode && guiCurrentScreen != Enum26.MAPUTILITY_SCREEN) {
      ubAmbientLightLevel = GetTimeOfDayAmbientLightLevel();
    } else {
      ubAmbientLightLevel = 4;
    }
  }
  if (uiFlags & MAP_WORLDLIGHTS_SAVED) {
    bufferOffset = LoadMapLights(buffer, bufferOffset);
  } else {
    // Set some default value for lighting
    SetDefaultWorldLightingColors();
  }
  LightSetBaseLevel(ubAmbientLightLevel);

  SetRelativeStartAndEndPercentage(0, 85, 86, "Loading map information...");
  RenderProgressBar(0, 0);

  bufferOffset = LoadMapInformation(buffer, bufferOffset);

  if (uiFlags & MAP_FULLSOLDIER_SAVED) {
    SetRelativeStartAndEndPercentage(0, 86, 87, "Loading placements...");
    RenderProgressBar(0, 0);
    bufferOffset = LoadSoldiersFromMap(buffer, bufferOffset);
  }
  if (uiFlags & MAP_EXITGRIDS_SAVED) {
    SetRelativeStartAndEndPercentage(0, 87, 88, "Loading exit grids...");
    RenderProgressBar(0, 0);
    bufferOffset = LoadExitGrids(buffer, bufferOffset);
  }
  if (uiFlags & MAP_DOORTABLE_SAVED) {
    SetRelativeStartAndEndPercentage(0, 89, 90, "Loading door tables...");
    RenderProgressBar(0, 0);
    bufferOffset = LoadDoorTableFromMap(buffer, bufferOffset);
  }
  if (uiFlags & MAP_EDGEPOINTS_SAVED) {
    SetRelativeStartAndEndPercentage(0, 90, 91, "Loading edgepoints...");
    RenderProgressBar(0, 0);
    let result: boolean;
    ({ result, offset: bufferOffset } = LoadMapEdgepoints(buffer, bufferOffset));
    if (!result)
      fGenerateEdgePoints = true; // only if the map had the older edgepoint system
  } else {
    fGenerateEdgePoints = true;
  }
  if (uiFlags & MAP_NPCSCHEDULES_SAVED) {
    SetRelativeStartAndEndPercentage(0, 91, 92, "Loading NPC schedules...");
    RenderProgressBar(0, 0);
    LoadSchedules(buffer, bufferOffset);
  }

  ValidateAndUpdateMapVersionIfNecessary();

  // if we arent loading a saved game
  //	if( !(gTacticalStatus.uiFlags & LOADING_SAVED_GAME ) )
  {
    SetRelativeStartAndEndPercentage(0, 93, 94, "Init Loaded World...");
    RenderProgressBar(0, 0);
    InitLoadedWorld();
  }

  if (fGenerateEdgePoints) {
    SetRelativeStartAndEndPercentage(0, 94, 95, "Generating map edgepoints...");
    RenderProgressBar(0, 0);
    CompileWorldMovementCosts();
    GenerateMapEdgepoints();
  }

  RenderProgressBar(0, 20);

  SetRelativeStartAndEndPercentage(0, 95, 100, "General initialization...");
  // RESET AI!
  InitOpponentKnowledgeSystem();

  RenderProgressBar(0, 30);

  // AllTeamsLookForAll(NO_INTERRUPTS);

  RenderProgressBar(0, 40);

  // Reset some override flags
  gfForceLoadPlayers = false;
  gfForceLoad = false;

  // CHECK IF OUR SELECTED GUY IS GONE!
  if (gusSelectedSoldier != NO_SOLDIER) {
    if (MercPtrs[gusSelectedSoldier].bActive == false) {
      gusSelectedSoldier = NO_SOLDIER;
    }
  }

  AdjustSoldierCreationStartValues();

  RenderProgressBar(0, 60);

  InvalidateWorldRedundency();

  // SAVE FILENAME
  gzLastLoadedFile = puiFilename;
  LoadRadarScreenBitmap(puiFilename);

  RenderProgressBar(0, 80);

  gfWorldLoaded = true;

  gubFilename = puiFilename;

  RenderProgressBar(0, 100);

  DequeueAllKeyBoardEvents();

  return true;
}

//****************************************************************************************
//
//	Deletes everything then re-creates the world with simple ground tiles
//
//****************************************************************************************
export function NewWorld(): boolean {
  let NewIndex: UINT16;
  let cnt: INT32;

  gusSelectedSoldier = gusOldSelectedSoldier = NO_SOLDIER;

  AdjustSoldierCreationStartValues();

  TrashWorld();

  // Create world randomly from tiles
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Set land index
    NewIndex = Math.floor(Math.random() * 10);
    AddLandToHead(cnt, NewIndex);
  }

  InitRoomDatabase();

  gfWorldLoaded = true;

  return true;
}

export function TrashWorld(): void {
  let pMapTile: MAP_ELEMENT;
  let pLandNode: LEVELNODE | null;
  let pObjectNode: LEVELNODE | null;
  let pStructNode: LEVELNODE | null;
  let pShadowNode: LEVELNODE | null;
  let pMercNode: LEVELNODE | null;
  let pRoofNode: LEVELNODE | null;
  let pOnRoofNode: LEVELNODE | null;
  let pTopmostNode: LEVELNODE | null;
  //	STRUCTURE			*pStructureNode;
  let cnt: INT32;
  let pSoldier: SOLDIERTYPE;

  if (!gfWorldLoaded)
    return;

  // REMOVE ALL ITEMS FROM WORLD
  TrashWorldItems();

  // Trash the overhead map
  TrashOverheadMap();

  // Reset the smoke effects.
  ResetSmokeEffects();

  // Reset the light effects
  ResetLightEffects();

  // Set soldiers to not active!
  // ATE: FOR NOW, ONLY TRASH FROM NPC UP!!!!
  // cnt = gTacticalStatus.Team[ gbPlayerNum ].bLastID + 1;
  cnt = 0;

  for (pSoldier = MercPtrs[cnt]; cnt < MAX_NUM_SOLDIERS; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive) {
      if (pSoldier.bTeam == gbPlayerNum) {
        // Just delete levelnode
        pSoldier.pLevelNode = null;
      } else {
        // Delete from world
        TacticalRemoveSoldier(cnt);
      }
    }
  }

  RemoveCorpses();

  // Remove all ani tiles...
  DeleteAniTiles();

  // Kill both soldier init lists.
  UseEditorAlternateList();
  KillSoldierInitList();
  UseEditorOriginalList();
  KillSoldierInitList();

  // Remove the schedules
  DestroyAllSchedules();

  // on trash world sheck if we have to set up the first meanwhile
  HandleFirstMeanWhileSetUpWithTrashWorld();

  // Create world randomly from tiles
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pMapTile = gpWorldLevelData[cnt];

    // Free the memory associated with the map tile link lists
    pLandNode = pMapTile.pLandHead;
    while (pLandNode != null) {
      pMapTile.pLandHead = pLandNode.pNext;
      pLandNode = pMapTile.pLandHead;
    }

    pObjectNode = pMapTile.pObjectHead;
    while (pObjectNode != null) {
      pMapTile.pObjectHead = pObjectNode.pNext;
      pObjectNode = pMapTile.pObjectHead;
    }

    pStructNode = pMapTile.pStructHead;
    while (pStructNode != null) {
      pMapTile.pStructHead = pStructNode.pNext;
      pStructNode = pMapTile.pStructHead;
    }

    pShadowNode = pMapTile.pShadowHead;
    while (pShadowNode != null) {
      pMapTile.pShadowHead = pShadowNode.pNext;
      pShadowNode = pMapTile.pShadowHead;
    }

    pMercNode = pMapTile.pMercHead;
    while (pMercNode != null) {
      pMapTile.pMercHead = pMercNode.pNext;
      pMercNode = pMapTile.pMercHead;
    }

    pRoofNode = pMapTile.pRoofHead;
    while (pRoofNode != null) {
      pMapTile.pRoofHead = pRoofNode.pNext;
      pRoofNode = pMapTile.pRoofHead;
    }

    pOnRoofNode = pMapTile.pOnRoofHead;
    while (pOnRoofNode != null) {
      pMapTile.pOnRoofHead = pOnRoofNode.pNext;
      pOnRoofNode = pMapTile.pOnRoofHead;
    }

    pTopmostNode = pMapTile.pTopmostHead;
    while (pTopmostNode != null) {
      pMapTile.pTopmostHead = pTopmostNode.pNext;
      pTopmostNode = pMapTile.pTopmostHead;
    }

    while (pMapTile.pStructureHead != null) {
      if (DeleteStructureFromWorld(pMapTile.pStructureHead) == false) {
        // ERROR!!!!!!
        break;
      }
    }
  }

  // Zero world
  gpWorldLevelData.forEach(resetMapElement);

  // Set some default flags
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    gpWorldLevelData[cnt].uiFlags |= MAPELEMENT_RECALCULATE_WIREFRAMES;
  }

  TrashDoorTable();
  TrashMapEdgepoints();
  TrashDoorStatusArray();

  // gfBlitBattleSectorLocator = FALSE;
  gfWorldLoaded = false;
  gubFilename = "none";
}

function TrashMapTile(MapTile: INT16): void {
  let pMapTile: MAP_ELEMENT;
  let pLandNode: LEVELNODE | null;
  let pObjectNode: LEVELNODE | null;
  let pStructNode: LEVELNODE | null;
  let pShadowNode: LEVELNODE | null;
  let pMercNode: LEVELNODE | null;
  let pRoofNode: LEVELNODE | null;
  let pOnRoofNode: LEVELNODE | null;
  let pTopmostNode: LEVELNODE | null;

  pMapTile = gpWorldLevelData[MapTile];

  // Free the memory associated with the map tile link lists
  pLandNode = pMapTile.pLandHead;
  while (pLandNode != null) {
    pMapTile.pLandHead = pLandNode.pNext;
    pLandNode = pMapTile.pLandHead;
  }
  pMapTile.pLandHead = pMapTile.pLandStart = null;

  pObjectNode = pMapTile.pObjectHead;
  while (pObjectNode != null) {
    pMapTile.pObjectHead = pObjectNode.pNext;
    pObjectNode = pMapTile.pObjectHead;
  }
  pMapTile.pObjectHead = null;

  pStructNode = pMapTile.pStructHead;
  while (pStructNode != null) {
    pMapTile.pStructHead = pStructNode.pNext;
    pStructNode = pMapTile.pStructHead;
  }
  pMapTile.pStructHead = null;

  pShadowNode = pMapTile.pShadowHead;
  while (pShadowNode != null) {
    pMapTile.pShadowHead = pShadowNode.pNext;
    pShadowNode = pMapTile.pShadowHead;
  }
  pMapTile.pShadowHead = null;

  pMercNode = pMapTile.pMercHead;
  while (pMercNode != null) {
    pMapTile.pMercHead = pMercNode.pNext;
    pMercNode = pMapTile.pMercHead;
  }
  pMapTile.pMercHead = null;

  pRoofNode = pMapTile.pRoofHead;
  while (pRoofNode != null) {
    pMapTile.pRoofHead = pRoofNode.pNext;
    pRoofNode = pMapTile.pRoofHead;
  }
  pMapTile.pRoofHead = null;

  pOnRoofNode = pMapTile.pOnRoofHead;
  while (pOnRoofNode != null) {
    pMapTile.pOnRoofHead = pOnRoofNode.pNext;
    pOnRoofNode = pMapTile.pOnRoofHead;
  }
  pMapTile.pOnRoofHead = null;

  pTopmostNode = pMapTile.pTopmostHead;
  while (pTopmostNode != null) {
    pMapTile.pTopmostHead = pTopmostNode.pNext;
    pTopmostNode = pMapTile.pTopmostHead;
  }
  pMapTile.pTopmostHead = null;

  while (pMapTile.pStructureHead != null) {
    DeleteStructureFromWorld(pMapTile.pStructureHead);
  }
  pMapTile.pStructureHead = pMapTile.pStructureTail = null;
}

export function LoadMapTileset(iTilesetID: INT32): boolean {
  if (iTilesetID >= Enum316.NUM_TILESETS) {
    return false;
  }

  // Init tile surface used values
  gbNewTileSurfaceLoaded.fill(false);

  if (iTilesetID == giCurrentTilesetID) {
    return true;
  }

  // Get free memory value nere
  gSurfaceMemUsage = guiMemTotal;

  // LOAD SURFACES
  if (LoadTileSurfaces(gTilesets[iTilesetID].TileSurfaceFilenames, iTilesetID) == false) {
    return false;
  }

  // SET TERRAIN COSTS
  if (gTilesets[iTilesetID].MovementCostFnc != null) {
    gTilesets[iTilesetID].MovementCostFnc();
  } else {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Tileset %d has no callback function for movement costs. Using default.", iTilesetID));
    SetTilesetOneTerrainValues();
  }

  // RESET TILE DATABASE
  DeallocateTileDatabase();

  CreateTileDatabase();

  // SET GLOBAL ID FOR TILESET ( FOR SAVING! )
  giCurrentTilesetID = iTilesetID;

  return true;
}

export function SetLoadOverrideParams(fForceLoad: boolean, fForceFile: boolean, zLoadName: string | null /* Pointer<CHAR8> */): void {
  gfForceLoadPlayers = fForceLoad;
  gfForceLoad = fForceFile;

  if (zLoadName != null) {
    gzForceLoadFile = zLoadName;
  }
}

function AddWireFrame(sGridNo: INT16, usIndex: UINT16, fForced: boolean): void {
  let pTopmost: LEVELNODE | null;
  let pTopmostTail: LEVELNODE;

  pTopmost = gpWorldLevelData[sGridNo].pTopmostHead;

  while (pTopmost != null) {
    // Check if one of the samer type exists!
    if (pTopmost.usIndex == usIndex) {
      return;
    }
    pTopmost = pTopmost.pNext;
  }

  pTopmostTail = AddTopmostToTail(sGridNo, usIndex);

  if (fForced) {
    pTopmostTail.uiFlags |= LEVELNODE_WIREFRAME;
  }
}

function GetWireframeGraphicNumToUseForWall(sGridNo: INT16, pStructure: STRUCTURE): UINT16 {
  let pNode: LEVELNODE | null = null;
  let ubWallOrientation: UINT8;
  let usValue: UINT16 = 0;
  let usSubIndex: UINT16;
  let pBaseStructure: STRUCTURE | null;

  ubWallOrientation = pStructure.ubWallOrientation;

  pBaseStructure = FindBaseStructure(pStructure);

  if (pBaseStructure) {
    // Find levelnode...
    pNode = gpWorldLevelData[sGridNo].pStructHead;
    while (pNode != null) {
      if (pNode.pStructureData == pBaseStructure) {
        break;
      }
      pNode = pNode.pNext;
    }

    if (pNode != null) {
      // Get Subindex for this wall...
      usSubIndex = GetSubIndexFromTileIndex(pNode.usIndex);

      // Check for broken peices...
      if (usSubIndex == 48 || usSubIndex == 52) {
        return Enum312.WIREFRAMES12;
      } else if (usSubIndex == 49 || usSubIndex == 53) {
        return Enum312.WIREFRAMES13;
      } else if (usSubIndex == 50 || usSubIndex == 54) {
        return Enum312.WIREFRAMES10;
      } else if (usSubIndex == 51 || usSubIndex == 55) {
        return Enum312.WIREFRAMES11;
      }
    }
  }

  switch (ubWallOrientation) {
    case Enum314.OUTSIDE_TOP_LEFT:
    case Enum314.INSIDE_TOP_LEFT:

      usValue = Enum312.WIREFRAMES6;
      break;

    case Enum314.OUTSIDE_TOP_RIGHT:
    case Enum314.INSIDE_TOP_RIGHT:
      usValue = Enum312.WIREFRAMES5;
      break;
  }

  return usValue;
}

export function CalculateWorldWireFrameTiles(fForce: boolean): void {
  let cnt: INT32;
  let pStructure: STRUCTURE | null;
  let sGridNo: INT16;
  let ubWallOrientation: UINT8;
  let bHiddenVal: INT8;
  let bNumWallsSameGridNo: INT8;
  let usWireFrameIndex: UINT16;

  // Create world randomly from tiles
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (gpWorldLevelData[cnt].uiFlags & MAPELEMENT_RECALCULATE_WIREFRAMES || fForce) {
      if (cnt == 8377) {
        let i: number = 0;
      }

      // Turn off flag
      gpWorldLevelData[cnt].uiFlags &= (~MAPELEMENT_RECALCULATE_WIREFRAMES);

      // Remove old ones
      RemoveWireFrameTiles(cnt);

      bNumWallsSameGridNo = 0;

      // Check our gridno, if we have a roof over us that has not beenr evealed, no need for a wiereframe
      if (IsRoofVisibleForWireframe(cnt) && !(gpWorldLevelData[cnt].uiFlags & MAPELEMENT_REVEALED)) {
        continue;
      }

      pStructure = gpWorldLevelData[cnt].pStructureHead;

      while (pStructure != null) {
        // Check for doors
        if (pStructure.fFlags & STRUCTURE_ANYDOOR) {
          // ATE: need this additional check here for hidden doors!
          if (pStructure.fFlags & STRUCTURE_OPENABLE) {
            // Does the gridno we are over have a non-visible tile?
            // Based on orientation
            ubWallOrientation = pStructure.ubWallOrientation;

            switch (ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:

                // Get gridno
                sGridNo = NewGridNo(cnt, DirectionInc(Enum245.SOUTH));

                if (IsRoofVisibleForWireframe(sGridNo) && !(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED)) {
                  AddWireFrame(cnt, Enum312.WIREFRAMES4, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));
                }
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:

                // Get gridno
                sGridNo = NewGridNo(cnt, DirectionInc(Enum245.EAST));

                if (IsRoofVisibleForWireframe(sGridNo) && !(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED)) {
                  AddWireFrame(cnt, Enum312.WIREFRAMES3, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));
                }
                break;
            }
          }
        }
        // Check for windows
        else {
          if (pStructure.fFlags & STRUCTURE_WALLNWINDOW) {
            // Does the gridno we are over have a non-visible tile?
            // Based on orientation
            ubWallOrientation = pStructure.ubWallOrientation;

            switch (ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:

                // Get gridno
                sGridNo = NewGridNo(cnt, DirectionInc(Enum245.SOUTH));

                if (IsRoofVisibleForWireframe(sGridNo) && !(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED)) {
                  AddWireFrame(cnt, Enum312.WIREFRAMES2, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));
                }
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:

                // Get gridno
                sGridNo = NewGridNo(cnt, DirectionInc(Enum245.EAST));

                if (IsRoofVisibleForWireframe(sGridNo) && !(gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED)) {
                  AddWireFrame(cnt, Enum312.WIREFRAMES1, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));
                }
                break;
            }
          }

          // Check for walls
          if (pStructure.fFlags & STRUCTURE_WALLSTUFF) {
            // Does the gridno we are over have a non-visible tile?
            // Based on orientation
            ubWallOrientation = pStructure.ubWallOrientation;

            usWireFrameIndex = GetWireframeGraphicNumToUseForWall(cnt, pStructure);

            switch (ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:

                // Get gridno
                sGridNo = NewGridNo(cnt, DirectionInc(Enum245.SOUTH));

                if (IsRoofVisibleForWireframe(sGridNo)) {
                  bNumWallsSameGridNo++;

                  AddWireFrame(cnt, usWireFrameIndex, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));

                  // Check along our direction to see if we are a corner
                  sGridNo = NewGridNo(cnt, DirectionInc(Enum245.WEST));
                  sGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTH));
                  bHiddenVal = IsHiddenTileMarkerThere(sGridNo);
                  // If we do not exist ( -1 ) or are revealed ( 1 )
                  if (bHiddenVal == -1 || bHiddenVal == 1) {
                    // Place corner!
                    AddWireFrame(cnt, Enum312.WIREFRAMES9, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));
                  }
                }
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:

                // Get gridno
                sGridNo = NewGridNo(cnt, DirectionInc(Enum245.EAST));

                if (IsRoofVisibleForWireframe(sGridNo)) {
                  bNumWallsSameGridNo++;

                  AddWireFrame(cnt, usWireFrameIndex, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));

                  // Check along our direction to see if we are a corner
                  sGridNo = NewGridNo(cnt, DirectionInc(Enum245.NORTH));
                  sGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.EAST));
                  bHiddenVal = IsHiddenTileMarkerThere(sGridNo);
                  // If we do not exist ( -1 ) or are revealed ( 1 )
                  if (bHiddenVal == -1 || bHiddenVal == 1) {
                    // Place corner!
                    AddWireFrame(cnt, Enum312.WIREFRAMES8, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));
                  }
                }
                break;
            }

            // Check for both walls
            if (bNumWallsSameGridNo == 2) {
              sGridNo = NewGridNo(cnt, DirectionInc(Enum245.EAST));
              sGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTH));
              AddWireFrame(cnt, Enum312.WIREFRAMES7, ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REVEALED) != 0));
            }
          }
        }

        pStructure = pStructure.pNext;
      }
    }
  }
}

function RemoveWorldWireFrameTiles(): void {
  let cnt: INT32;

  // Create world randomly from tiles
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    RemoveWireFrameTiles(cnt);
  }
}

function RemoveWireFrameTiles(sGridNo: INT16): void {
  let pTopmost: LEVELNODE | null;
  let pNewTopmost: LEVELNODE | null;
  let pTileElement: TILE_ELEMENT;

  pTopmost = gpWorldLevelData[sGridNo].pTopmostHead;

  while (pTopmost != null) {
    pNewTopmost = pTopmost.pNext;

    if (pTopmost.usIndex < Enum312.NUMBEROFTILES) {
      pTileElement = gTileDatabase[pTopmost.usIndex];

      if (pTileElement.fType == Enum313.WIREFRAMES) {
        RemoveTopmost(sGridNo, pTopmost.usIndex);
      }
    }

    pTopmost = pNewTopmost;
  }
}

function IsHiddenTileMarkerThere(sGridNo: INT16): INT8 {
  let pStructure: STRUCTURE | null;

  if (!gfBasement) {
    pStructure = FindStructure(sGridNo, STRUCTURE_ROOF);

    if (pStructure != null) {
      // if ( !( gpWorldLevelData[ sGridNo ].uiFlags & MAPELEMENT_REVEALED ) )
      { return (2); }

      // if we are here, a roof exists but has been revealed
      return 1;
    }
  } else {
    // if ( InARoom( sGridNo, &ubRoom ) )
    {
      // if ( !( gpWorldLevelData[ sGridNo ].uiFlags & MAPELEMENT_REVEALED ) )
      { return (2); }

      return 1;
    }
  }

  return -1;
}

export function ReloadTileset(ubID: UINT8): void {
  let aFilename: string /* CHAR8[255] */;
  let iCurrTilesetID: INT32 = giCurrentTilesetID;

  // Set gloabal
  giCurrentTilesetID = ubID;

  // Save Map
  SaveWorld(TEMP_FILE_FOR_TILESET_CHANGE);

  // IMPORTANT:  If this is not set, the LoadTileset() will assume that
  // it is loading the same tileset and ignore it...
  giCurrentTilesetID = iCurrTilesetID;

  // Load Map with new tileset
  LoadWorld(TEMP_FILE_FOR_TILESET_CHANGE);

  // Delete file
  aFilename = sprintf("MAPS\\%s", TEMP_FILE_FOR_TILESET_CHANGE);

  FileDelete(aFilename);
}

function SaveMapLights(hfile: HWFILE): void {
  let pSoldier: SOLDIERTYPE | null;
  let LColors: SGPPaletteEntry[] /* [3] */ = createArrayFrom(3, createSGPPaletteEntry);
  let ubNumColors: UINT8;
  let fSoldierLight: boolean;
  let usNumLights: UINT16 = 0;
  let cnt: UINT16;
  let cnt2: UINT16;
  let ubStrLen: UINT8;
  let uiBytesWritten: UINT32;
  let buffer: Buffer;

  ubNumColors = LightGetColors(LColors);

  // Save the current light colors!
  buffer = Buffer.allocUnsafe(1);
  buffer.writeUInt8(ubNumColors, 0);
  uiBytesWritten = FileWrite(hfile, buffer, 1);

  buffer = Buffer.allocUnsafe(SGP_PALETTE_ENTRY_SIZE * ubNumColors);
  writeObjectArray(LColors, buffer, 0, writeSGPPaletteEntry);
  uiBytesWritten = FileWrite(hfile, buffer, SGP_PALETTE_ENTRY_SIZE * ubNumColors);

  // count number of non-merc lights.
  for (cnt = 0; cnt < MAX_LIGHT_SPRITES; cnt++) {
    if (LightSprites[cnt].uiFlags & LIGHT_SPR_ACTIVE) {
      // found an active light.  Check to make sure it doesn't belong to a merc.
      fSoldierLight = false;
      for (cnt2 = 0; cnt2 < MAX_NUM_SOLDIERS && !fSoldierLight; cnt2++) {
        if ((pSoldier = GetSoldier(cnt2)) !== null) {
          if (pSoldier.iLight == cnt)
            fSoldierLight = true;
        }
      }
      if (!fSoldierLight)
        usNumLights++;
    }
  }

  // save the number of lights.
  buffer = Buffer.allocUnsafe(2);
  buffer.writeUInt16LE(usNumLights, 0);
  uiBytesWritten = FileWrite(hfile, buffer, 2);

  for (cnt = 0; cnt < MAX_LIGHT_SPRITES; cnt++) {
    if (LightSprites[cnt].uiFlags & LIGHT_SPR_ACTIVE) {
      // found an active light.  Check to make sure it doesn't belong to a merc.
      fSoldierLight = false;
      for (cnt2 = 0; cnt2 < MAX_NUM_SOLDIERS && !fSoldierLight; cnt2++) {
        if ((pSoldier = GetSoldier(cnt2)) !== null) {
          if (pSoldier.iLight == cnt)
            fSoldierLight = true;
        }
      }
      if (!fSoldierLight) {
        // save the light
        buffer = Buffer.allocUnsafe(LIGHT_SPRITE_SIZE);
        writeLightSprite(LightSprites[cnt], buffer);
        uiBytesWritten = FileWrite(hfile, buffer, LIGHT_SPRITE_SIZE);

        ubStrLen = pLightNames[LightSprites[cnt].iTemplate].length + 1;

        buffer = Buffer.allocUnsafe(1);
        buffer.writeUInt8(ubStrLen, 0);
        uiBytesWritten = FileWrite(hfile, buffer, 1);

        buffer = Buffer.allocUnsafe(ubStrLen);
        writeStringNL(pLightNames[LightSprites[cnt].iTemplate], buffer, 0, ubStrLen, 'ascii');
        uiBytesWritten = FileWrite(hfile, buffer, ubStrLen);
      }
    }
  }
}

function LoadMapLights(buffer: Buffer, offset: number): number {
  let LColors: SGPPaletteEntry[] /* [3] */ = createArrayFrom(3, createSGPPaletteEntry);
  let ubNumColors: UINT8;
  let usNumLights: UINT16;
  let cnt: INT32;
  let str: string /* INT8[30] */;
  let ubStrLen: UINT8;
  let TmpLight: LIGHT_SPRITE = createLightSprite();
  let iLSprite: INT32;
  let uiHour: UINT32;
  let fPrimeTime: boolean = false;
  let fNightTime: boolean = false;

  // reset the lighting system, so that any current lights are toasted.
  LightReset();

  // read in the light colors!
  ubNumColors = buffer.readUInt8(offset++);
  for (let i = 0; i < ubNumColors; i++) {
    offset = readSGPPaletteEntry(LColors[i], buffer, offset);
  }

  usNumLights = buffer.readUInt16LE(offset); offset += 2;

  ubNumColors = 1;

  // ATE: OK, only regenrate if colors are different.....
  // if ( LColors[0].peRed != gpLightColors[0].peRed ||
  //		 LColors[0].peGreen != gpLightColors[0].peGreen ||
  //		 LColors[0].peBlue != gpLightColors[0].peBlue )
  { LightSetColors(LColors, ubNumColors); }

  // Determine which lights are valid for the current time.
  if (!gfEditMode) {
    uiHour = GetWorldHour();
    if (uiHour >= NIGHT_TIME_LIGHT_START_HOUR || uiHour < NIGHT_TIME_LIGHT_END_HOUR) {
      fNightTime = true;
    }
    if (uiHour >= PRIME_TIME_LIGHT_START_HOUR) {
      fPrimeTime = true;
    }
  }

  for (cnt = 0; cnt < usNumLights; cnt++) {
    offset = readLightSprite(TmpLight, buffer, offset);
    ubStrLen = buffer.readUInt8(offset++);

    if (ubStrLen) {
      str = readStringNL(buffer, 'ascii', offset, offset + ubStrLen); offset += ubStrLen;
    } else {
      str = '';
    }

    iLSprite = LightSpriteCreate(str, TmpLight.uiLightType);
    // if this fails, then we will ignore the light.
    // ATE: Don't add ANY lights of mapscreen util is on
    if (iLSprite != -1 && guiCurrentScreen != Enum26.MAPUTILITY_SCREEN) {
      if (!gfCaves || gfEditMode) {
        if (gfEditMode || TmpLight.uiFlags & LIGHT_PRIMETIME && fPrimeTime || TmpLight.uiFlags & LIGHT_NIGHTTIME && fNightTime || !(TmpLight.uiFlags & (LIGHT_PRIMETIME | LIGHT_NIGHTTIME))) {
          // power only valid lights.
          LightSpritePower(iLSprite, true);
        }
      }
      LightSpritePosition(iLSprite, TmpLight.iX, TmpLight.iY);
      if (TmpLight.uiFlags & LIGHT_PRIMETIME)
        LightSprites[iLSprite].uiFlags |= LIGHT_PRIMETIME;
      else if (TmpLight.uiFlags & LIGHT_NIGHTTIME)
        LightSprites[iLSprite].uiFlags |= LIGHT_NIGHTTIME;
    }
  }

  return offset;
}

function IsRoofVisibleForWireframe(sMapPos: INT16): boolean {
  let pStructure: STRUCTURE | null;

  if (!gfBasement) {
    pStructure = FindStructure(sMapPos, STRUCTURE_ROOF);

    if (pStructure != null) {
      return true;
    }
  } else {
    // if ( InARoom( sMapPos, &ubRoom ) )
    {
      // if ( !( gpWorldLevelData[ sMapPos ].uiFlags & MAPELEMENT_REVEALED ) )
      { return (true); }
    }
  }

  return false;
}

}
