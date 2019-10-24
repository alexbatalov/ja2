const SET_MOVEMENTCOST = (a, b, c, d) => ((gubWorldMovementCosts[a][b][c] < d) ? (gubWorldMovementCosts[a][b][c] = d) : 0);
const FORCE_SET_MOVEMENTCOST = (a, b, c, d) => (gubWorldMovementCosts[a][b][c] = d);
const SET_CURRMOVEMENTCOST = (a, b) => SET_MOVEMENTCOST(usGridNo, a, 0, b);

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
let gfForceLoadPlayers: BOOLEAN = FALSE;
let gzForceLoadFile: CHAR8[] /* [100] */;
let gfForceLoad: BOOLEAN = FALSE;

let gubCurrentLevel: UINT8;
let giCurrentTilesetID: INT32 = 0;
let gzLastLoadedFile: CHAR8[] /* [260] */;

let gCurrentBackground: UINT32 = Enum313.FIRSTTEXTURE;

let TileSurfaceFilenames: CHAR8[][] /* [NUMBEROFTILETYPES][32] */;
let gbNewTileSurfaceLoaded: INT8[] /* [NUMBEROFTILETYPES] */;

function SetAllNewTileSurfacesLoaded(fNew: BOOLEAN): void {
  memset(gbNewTileSurfaceLoaded, fNew, sizeof(gbNewTileSurfaceLoaded));
}

let gfInitAnimateLoading: BOOLEAN = FALSE;

// Global Variables
let gpWorldLevelData: Pointer<MAP_ELEMENT>;
let gpDirtyData: Pointer<INT32>;
let gSurfaceMemUsage: UINT32;
let gubWorldMovementCosts: UINT8[][][] /* [WORLD_MAX][MAXDIR][2] */;

// set to nonzero (locs of base gridno of structure are good) to have it defined by structure code
let gsRecompileAreaTop: INT16 = 0;
let gsRecompileAreaLeft: INT16 = 0;
let gsRecompileAreaRight: INT16 = 0;
let gsRecompileAreaBottom: INT16 = 0;

// TIMER TESTING STUFF

function DoorAtGridNo(iMapIndex: UINT32): BOOLEAN {
  let pStruct: Pointer<STRUCTURE>;
  pStruct = gpWorldLevelData[iMapIndex].pStructureHead;
  while (pStruct) {
    if (pStruct.value.fFlags & STRUCTURE_ANYDOOR)
      return TRUE;
    pStruct = pStruct.value.pNext;
  }
  return FALSE;
}

function OpenableAtGridNo(iMapIndex: UINT32): BOOLEAN {
  let pStruct: Pointer<STRUCTURE>;
  pStruct = gpWorldLevelData[iMapIndex].pStructureHead;
  while (pStruct) {
    if (pStruct.value.fFlags & STRUCTURE_OPENABLE)
      return TRUE;
    pStruct = pStruct.value.pNext;
  }
  return FALSE;
}

function FloorAtGridNo(iMapIndex: UINT32): BOOLEAN {
  let pLand: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  pLand = gpWorldLevelData[iMapIndex].pLandHead;
  // Look through all objects and Search for type
  while (pLand) {
    if (pLand.value.usIndex != NO_TILE) {
      GetTileType(pLand.value.usIndex, addressof(uiTileType));
      if (uiTileType >= Enum313.FIRSTFLOOR && uiTileType <= LASTFLOOR) {
        return TRUE;
      }
      pLand = pLand.value.pNext;
    }
  }
  return FALSE;
}

function GridNoIndoors(iMapIndex: UINT32): BOOLEAN {
  if (gfBasement || gfCaves)
    return TRUE;
  if (FloorAtGridNo(iMapIndex))
    return TRUE;
  return FALSE;
}

function DOIT(): void {
  //	LEVELNODE *			pLand;
  // LEVELNODE *			pObject;
  let pStruct: Pointer<LEVELNODE>;
  let pNewStruct: Pointer<LEVELNODE>;
  // LEVELNODE	*			pShadow;
  let uiLoop: UINT32;

  // first level
  for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
    pStruct = gpWorldLevelData[uiLoop].pStructHead;

    while (pStruct != null) {
      pNewStruct = pStruct.value.pNext;

      if (pStruct.value.usIndex >= Enum312.DEBRISWOOD1 && pStruct.value.usIndex <= Enum312.DEBRISWEEDS10) {
        AddObjectToHead(uiLoop, pStruct.value.usIndex);

        RemoveStruct(uiLoop, pStruct.value.usIndex);
      }

      pStruct = pNewStruct;
    }
  }
}

function InitializeWorld(): BOOLEAN {
  gTileDatabaseSize = 0;
  gSurfaceMemUsage = 0;
  giCurrentTilesetID = -1;

  // DB Adds the _8 to the names if we're in 8 bit mode.
  // ProcessTilesetNamesForBPP();

  // Memset tileset list
  memset(TileSurfaceFilenames, '\0', sizeof(TileSurfaceFilenames));

  // ATE: MEMSET LOG HEIGHT VALUES
  memset(gTileTypeLogicalHeight, 1, sizeof(gTileTypeLogicalHeight));

  // Memset tile database
  memset(gTileDatabase, 0, sizeof(gTileDatabase));

  // Init surface list
  memset(gTileSurfaceArray, 0, sizeof(gTileSurfaceArray));

  // Init default surface list
  memset(gbDefaultSurfaceUsed, 0, sizeof(gbDefaultSurfaceUsed));

  // Init same surface list
  memset(gbSameAsDefaultSurfaceUsed, 0, sizeof(gbSameAsDefaultSurfaceUsed));

  // Initialize world data

  gpWorldLevelData = MemAlloc(WORLD_MAX * sizeof(MAP_ELEMENT));
  CHECKF(gpWorldLevelData);

  // Zero world
  memset(gpWorldLevelData, 0, WORLD_MAX * sizeof(MAP_ELEMENT));

  // Init room database
  InitRoomDatabase();

  // INit tilesets
  InitEngineTilesets();

  return TRUE;
}

function DeinitializeWorld(): void {
  TrashWorld();

  if (gpWorldLevelData != null) {
    MemFree(gpWorldLevelData);
  }

  if (gpDirtyData != null) {
    MemFree(gpDirtyData);
  }

  DestroyTileSurfaces();
  FreeAllStructureFiles();

  // Shutdown tile database data
  DeallocateTileDatabase();

  ShutdownRoomDatabase();
}

function ReloadTilesetSlot(iSlot: INT32): BOOLEAN {
  return TRUE;
}

function LoadTileSurfaces(ppTileSurfaceFilenames: char[][] /* [][32] */, ubTilesetID: UINT8): BOOLEAN {
  let cTemp: SGPFILENAME;
  let uiLoop: UINT32;

  let uiPercentage: UINT32;
  // UINT32					uiLength;
  // UINT16					uiFillColor;
  let ExeDir: STRING512;
  let INIFile: STRING512;

  // Get Executable Directory
  GetExecutableDirectory(ExeDir);

  // Adjust Current Dir
  // CHECK IF DEFAULT INI OVERRIDE FILE EXISTS
  sprintf(INIFile, "%s\\engine.ini", ExeDir);
  if (!FileExists(INIFile)) {
    // USE PER TILESET BASIS
    sprintf(INIFile, "%s\\engine%d.ini", ExeDir, ubTilesetID);
  }

  // If no Tileset filenames are given, return error
  if (ppTileSurfaceFilenames == null) {
    return FALSE;
  } else {
    for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++)
      strcpy(TileSurfaceFilenames[uiLoop], ppTileSurfaceFilenames[uiLoop]); //(char *)(ppTileSurfaceFilenames + (65 * uiLoop)) );
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
    uiPercentage = (uiLoop * 100) / (Enum313.NUMBEROFTILETYPES - 1);
    RenderProgressBar(0, uiPercentage);

    // uiFillColor = Get16BPPColor(FROMRGB( 100 + uiPercentage , 0, 0 ));
    // ColorFillVideoSurfaceArea( FRAME_BUFFER, 22, 401, 22 + uiLength, 418, uiFillColor );
    // InvalidateRegion( 0, 399, 640, 420 );
    // EndFrameBufferRender( );

    // The cost of having to do this check each time through the loop,
    // thus about 20 times, seems better than having to maintain two
    // almost completely identical functions
    if (ppTileSurfaceFilenames == null) {
      GetPrivateProfileString("TileSurface Filenames", gTileSurfaceName[uiLoop], "", cTemp, SGPFILENAME_LEN, INIFile);
      if (cTemp.value != '\0') {
        strcpy(TileSurfaceFilenames[uiLoop], cTemp);
        if (AddTileSurface(cTemp, uiLoop, ubTilesetID, TRUE) == FALSE) {
          DestroyTileSurfaces();
          return FALSE;
        }
      } else {
        // Use default
        if (AddTileSurface(TileSurfaceFilenames[uiLoop], uiLoop, ubTilesetID, FALSE) == FALSE) {
          DestroyTileSurfaces();
          return FALSE;
        }
      }
    } else {
      GetPrivateProfileString("TileSurface Filenames", gTileSurfaceName[uiLoop], "", cTemp, SGPFILENAME_LEN, INIFile);
      if (cTemp.value != '\0') {
        strcpy(TileSurfaceFilenames[uiLoop], cTemp);
        if (AddTileSurface(cTemp, uiLoop, ubTilesetID, TRUE) == FALSE) {
          DestroyTileSurfaces();
          return FALSE;
        }
      } else {
        if ((ppTileSurfaceFilenames[uiLoop]).value != '\0') {
          if (AddTileSurface(ppTileSurfaceFilenames[uiLoop], uiLoop, ubTilesetID, FALSE) == FALSE) {
            DestroyTileSurfaces();
            return FALSE;
          }
        } else {
          // USE FIRST TILESET VALUE!

          // ATE: If here, don't load default surface if already loaded...
          if (!gbDefaultSurfaceUsed[uiLoop]) {
            strcpy(TileSurfaceFilenames[uiLoop], gTilesets[Enum316.GENERIC_1].TileSurfaceFilenames[uiLoop]); //(char *)(ppTileSurfaceFilenames + (65 * uiLoop)) );
            if (AddTileSurface(gTilesets[Enum316.GENERIC_1].TileSurfaceFilenames[uiLoop], uiLoop, Enum316.GENERIC_1, FALSE) == FALSE) {
              DestroyTileSurfaces();
              return FALSE;
            }
          } else {
            gbSameAsDefaultSurfaceUsed[uiLoop] = TRUE;
          }
        }
      }
    }
  }

  return TRUE;
}

function AddTileSurface(cFilename: Pointer<char>, ubType: UINT32, ubTilesetID: UINT8, fGetFromRoot: BOOLEAN): BOOLEAN {
  // Add tile surface
  let TileSurf: PTILE_IMAGERY;
  let cFileBPP: CHAR8[] /* [128] */;
  let cAdjustedFile: CHAR8[] /* [128] */;

  // Delete the surface first!
  if (gTileSurfaceArray[ubType] != null) {
    DeleteTileSurface(gTileSurfaceArray[ubType]);
    gTileSurfaceArray[ubType] = null;
  }

  // Adjust flag for same as default used...
  gbSameAsDefaultSurfaceUsed[ubType] = FALSE;

  // Adjust for BPP
  FilenameForBPP(cFilename, cFileBPP);

  if (!fGetFromRoot) {
    // Adjust for tileset position
    sprintf(cAdjustedFile, "TILESETS\\%d\\%s", ubTilesetID, cFileBPP);
  } else {
    sprintf(cAdjustedFile, "%s", cFileBPP);
  }

  TileSurf = LoadTileSurface(cAdjustedFile);

  if (TileSurf == null)
    return FALSE;

  TileSurf.value.fType = ubType;

  SetRaisedObjectFlag(cAdjustedFile, TileSurf);

  gTileSurfaceArray[ubType] = TileSurf;

  // OK, if we were not the default tileset, set value indicating that!
  if (ubTilesetID != Enum316.GENERIC_1) {
    gbDefaultSurfaceUsed[ubType] = FALSE;
  } else {
    gbDefaultSurfaceUsed[ubType] = TRUE;
  }

  gbNewTileSurfaceLoaded[ubType] = TRUE;

  return TRUE;
}

function BuildTileShadeTables(): void {
  let hfile: HWFILE;
  let DataDir: STRING512;
  let ShadeTableDir: STRING512;
  let uiLoop: UINT32;
  let cRootFile: CHAR8[] /* [128] */;
  let fForceRebuildForSlot: BOOLEAN = FALSE;

  /* static */ let ubLastRed: UINT8 = 255;
  /* static */ let ubLastGreen: UINT8 = 255;
  /* static */ let ubLastBlue: UINT8 = 255;

  // Set the directory to the shadetable directory
  GetFileManCurrentDirectory(DataDir);
  sprintf(ShadeTableDir, "%s\\ShadeTables", DataDir);
  if (!SetFileManCurrentDirectory(ShadeTableDir)) {
    AssertMsg(0, "Can't set the directory to Data\\ShadeTable.  Kris' big problem!");
  }
  hfile = FileOpen("IgnoreShadeTables.txt", FILE_ACCESS_READ, FALSE);
  if (hfile) {
    FileClose(hfile);
    gfForceBuildShadeTables = TRUE;
  } else {
    gfForceBuildShadeTables = FALSE;
  }
  // now, determine if we are using specialized colors.
  if (gpLightColors[0].peRed || gpLightColors[0].peGreen || gpLightColors[0].peBlue) {
    // we are, which basically means we force build the shadetables.  However, the one
    // exception is if we are loading another map and the colors are the same.
    if (gpLightColors[0].peRed != ubLastRed || gpLightColors[0].peGreen != ubLastGreen || gpLightColors[0].peBlue != ubLastBlue) {
      // Same tileset, but colors are different, so set things up to regenerate the shadetables.
      gfForceBuildShadeTables = TRUE;
    } else {
      // same colors, same tileset, so don't rebuild shadetables -- much faster!
      gfForceBuildShadeTables = FALSE;
    }
  }

  if (gfLoadShadeTablesFromTextFile) {
    // Because we're tweaking the RGB values in the text file, always force rebuild the shadetables
    // so that the user can tweak them in the same exe session.
    memset(gbNewTileSurfaceLoaded, 1, sizeof(gbNewTileSurfaceLoaded));
  }

  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    if (gTileSurfaceArray[uiLoop] != null) {
// Don't Create shade tables if default were already used once!
      if (gbNewTileSurfaceLoaded[uiLoop] || gfEditorForceShadeTableRebuild)
      {
        fForceRebuildForSlot = FALSE;

        GetRootName(cRootFile, TileSurfaceFilenames[uiLoop]);

        if (strcmp(cRootFile, "grass2") == 0) {
          fForceRebuildForSlot = TRUE;
        }

        RenderProgressBar(0, uiLoop * 100 / Enum313.NUMBEROFTILETYPES);
        CreateTilePaletteTables(gTileSurfaceArray[uiLoop].value.vo, uiLoop, fForceRebuildForSlot);
      }
    }
  }

  // Restore the data directory once we are finished.
  SetFileManCurrentDirectory(DataDir);

  ubLastRed = gpLightColors[0].peRed;
  ubLastGreen = gpLightColors[0].peGreen;
  ubLastBlue = gpLightColors[0].peBlue;
}

function DestroyTileShadeTables(): void {
  let uiLoop: UINT32;

  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    if (gTileSurfaceArray[uiLoop] != null) {
// Don't Delete shade tables if default are still being used...
      if (gbNewTileSurfaceLoaded[uiLoop] || gfEditorForceShadeTableRebuild) {
        DestroyObjectPaletteTables(gTileSurfaceArray[uiLoop].value.vo);
      }
    }
  }
}

function DestroyTileSurfaces(): void {
  let uiLoop: UINT32;

  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    if (gTileSurfaceArray[uiLoop] != null) {
      DeleteTileSurface(gTileSurfaceArray[uiLoop]);
      gTileSurfaceArray[uiLoop] = null;
    }
  }
}

function CompileWorldTerrainIDs(): void {
  let sGridNo: INT16;
  let sTempGridNo: INT16;
  let pNode: Pointer<LEVELNODE>;
  let pTileElement: Pointer<TILE_ELEMENT>;
  let ubLoop: UINT8;

  for (sGridNo = 0; sGridNo < WORLD_MAX; sGridNo++) {
    if (GridNoOnVisibleWorldTile(sGridNo)) {
      // Check if we have anything in object layer which has a terrain modifier
      pNode = gpWorldLevelData[sGridNo].pObjectHead;

      // ATE: CRAPOLA! Special case stuff here for the friggen pool since art was fu*ked up
      if (giCurrentTilesetID == Enum316.TEMP_19) {
        // Get ID
        if (pNode != null) {
          if (pNode.value.usIndex == Enum312.ANOTHERDEBRIS4 || pNode.value.usIndex == Enum312.ANOTHERDEBRIS6 || pNode.value.usIndex == Enum312.ANOTHERDEBRIS7) {
            gpWorldLevelData[sGridNo].ubTerrainID = Enum315.LOW_WATER;
            continue;
          }
        }
      }

      if (pNode == null || pNode.value.usIndex >= Enum312.NUMBEROFTILES || gTileDatabase[pNode.value.usIndex].ubTerrainID == Enum315.NO_TERRAIN) {
        // Try terrain instead!
        pNode = gpWorldLevelData[sGridNo].pLandHead;
      }
      pTileElement = addressof(gTileDatabase[pNode.value.usIndex]);
      if (pTileElement.value.ubNumberOfTiles > 1) {
        for (ubLoop = 0; ubLoop < pTileElement.value.ubNumberOfTiles; ubLoop++) {
          sTempGridNo = sGridNo + pTileElement.value.pTileLocData[ubLoop].bTileOffsetX + pTileElement.value.pTileLocData[ubLoop].bTileOffsetY * WORLD_COLS;
          gpWorldLevelData[sTempGridNo].ubTerrainID = pTileElement.value.ubTerrainID;
        }
      } else {
        gpWorldLevelData[sGridNo].ubTerrainID = pTileElement.value.ubTerrainID;
      }
    }
  }
}

function CompileTileMovementCosts(usGridNo: UINT16): void {
  let ubTerrainID: UINT8;
  let TileElem: TILE_ELEMENT;
  let pLand: Pointer<LEVELNODE>;

  let pStructure: Pointer<STRUCTURE>;
  let fStructuresOnRoof: BOOLEAN;

  let ubDirLoop: UINT8;

  /*
   */

  if (GridNoOnVisibleWorldTile(usGridNo)) {
    // check for land of a different height in adjacent locations
    for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
      if (gpWorldLevelData[usGridNo].sHeight != gpWorldLevelData[usGridNo + DirectionInc(ubDirLoop)].sHeight) {
        SET_CURRMOVEMENTCOST(ubDirLoop, TRAVELCOST_OBSTACLE);
      }
    }

    // check for exit grids
    if (ExitGridAtGridNo(usGridNo)) {
      for (ubDirLoop = 0; ubDirLoop < 8; ubDirLoop++) {
        SET_CURRMOVEMENTCOST(ubDirLoop, TRAVELCOST_EXITGRID);
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
      TileElem = gTileDatabase[pLand.value.usIndex];

      // Get terrain type
      ubTerrainID = gpWorldLevelData[usGridNo].ubTerrainID; // = GetTerrainType( (INT16)usGridNo );

      for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
        SET_CURRMOVEMENTCOST(ubDirLoop, gTileTypeMovementCost[ubTerrainID]);
      }
    }

    // now consider all structures
    pStructure = gpWorldLevelData[usGridNo].pStructureHead;
    fStructuresOnRoof = FALSE;
    do {
      if (pStructure.value.sCubeOffset == STRUCTURE_ON_GROUND) {
        if (pStructure.value.fFlags & STRUCTURE_PASSABLE) {
          if (pStructure.value.fFlags & STRUCTURE_WIREFENCE && pStructure.value.fFlags & STRUCTURE_OPEN) {
            // prevent movement along the fence but allow in all other directions
            switch (pStructure.value.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:
                SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.EAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHEAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.SOUTH, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_NOT_STANDING);
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:
                SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.EAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHEAST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.SOUTH, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_NOT_STANDING);
                SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_NOT_STANDING);
                break;
            }
          }
          // all other passable structures do not block movement in any way
        } else if (pStructure.value.fFlags & STRUCTURE_BLOCKSMOVES) {
          if ((pStructure.value.fFlags & STRUCTURE_FENCE) && !(pStructure.value.fFlags & STRUCTURE_SPECIAL)) {
            // jumpable!
            switch (pStructure.value.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:
                // can be jumped north and south
                SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_FENCE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.EAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHEAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTH, TRAVELCOST_FENCE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_OBSTACLE);
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
                SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.EAST, TRAVELCOST_FENCE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHEAST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTH, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_FENCE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_OBSTACLE);
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
                  SET_CURRMOVEMENTCOST(ubDirLoop, TRAVELCOST_OBSTACLE);
                }
                break;
            }
          } else if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_SANDBAG && StructureHeight(pStructure) < 2) {
            for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
              SET_CURRMOVEMENTCOST(ubDirLoop, TRAVELCOST_OBSTACLE);
            }

            if (FindStructure((usGridNo - WORLD_COLS), STRUCTURE_OBSTACLE) == FALSE && FindStructure((usGridNo + WORLD_COLS), STRUCTURE_OBSTACLE) == FALSE) {
              FORCE_SET_MOVEMENTCOST(usGridNo, Enum245.NORTH, 0, TRAVELCOST_FENCE);
              FORCE_SET_MOVEMENTCOST(usGridNo, Enum245.SOUTH, 0, TRAVELCOST_FENCE);
            }

            if (FindStructure((usGridNo - 1), STRUCTURE_OBSTACLE) == FALSE && FindStructure((usGridNo + 1), STRUCTURE_OBSTACLE) == FALSE) {
              FORCE_SET_MOVEMENTCOST(usGridNo, Enum245.EAST, 0, TRAVELCOST_FENCE);
              FORCE_SET_MOVEMENTCOST(usGridNo, Enum245.WEST, 0, TRAVELCOST_FENCE);
            }
          } else if ((pStructure.value.fFlags & STRUCTURE_CAVEWALL)) {
            for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
              SET_CURRMOVEMENTCOST(ubDirLoop, TRAVELCOST_CAVEWALL);
            }
          } else {
            for (ubDirLoop = 0; ubDirLoop < Enum245.NUM_WORLD_DIRECTIONS; ubDirLoop++) {
              SET_CURRMOVEMENTCOST(ubDirLoop, TRAVELCOST_OBSTACLE);
            }
          }
        } else if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) /*&& (pStructure->fFlags & STRUCTURE_OPEN))*/
        {
         // NB closed doors are treated just like walls, in the section after this

          if (pStructure.value.fFlags & STRUCTURE_DDOOR_LEFT && (pStructure.value.ubWallOrientation == Enum314.INSIDE_TOP_RIGHT || pStructure.value.ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT)) {
            // double door, left side (as you look on the screen)
            switch (pStructure.value.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_RIGHT:
                if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
                  // doorpost
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                  // corner
                  SET_MOVEMENTCOST(usGridNo + 1 + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                } else {
                  // door
                  SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_DOOR_OPEN_W);
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_DOOR_OPEN_W);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_OPEN_NW);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_NW);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_W_W);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_NW_W);
                }
                break;

              case Enum314.INSIDE_TOP_RIGHT:
                // doorpost
                SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                // door
                SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_DOOR_OPEN_HERE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_DOOR_OPEN_HERE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_OPEN_N);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_N);
                SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_E);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_NE);
                break;

              default:
                // door with no orientation specified!?
                break;
            }
          } else if (pStructure.value.fFlags & STRUCTURE_DDOOR_RIGHT && (pStructure.value.ubWallOrientation == Enum314.INSIDE_TOP_LEFT || pStructure.value.ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT)) {
            // double door, right side (as you look on the screen)
            switch (pStructure.value.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
                if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
                  // doorpost
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N)
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                  ;
                  // corner
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                } else {
                  // door
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_DOOR_OPEN_N);
                  SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_DOOR_OPEN_N);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_OPEN_NW);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_NW);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_N_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_NW_N);
                }
                break;

              case Enum314.INSIDE_TOP_LEFT:
                // doorpost
                SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_WALL);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
                // corner
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                // door
                SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_DOOR_OPEN_HERE);
                SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_DOOR_OPEN_HERE);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_OPEN_W);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_W);
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_S);
                SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_SW);
                break;
              default:
                // door with no orientation specified!?
                break;
            }
          } else if (pStructure.value.fFlags & STRUCTURE_SLIDINGDOOR && pStructure.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles > 1) {
            switch (pStructure.value.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:
                // doorframe post in one corner of each of the tiles
                if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_CLOSED_N);
                } else {
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_CLOSED_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                }
                break;
              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:
                // doorframe post in one corner of each of the tiles
                if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_DOOR_CLOSED_HERE);

                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                } else {
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_WALL);

                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                }
                break;
            }
          } else {
            // standard door
            switch (pStructure.value.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
                if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
                  // doorframe
                  SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);

                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);

                  // DO CORNERS
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_WALL);

                  // SET_CURRMOVEMENTCOST( NORTHEAST, TRAVELCOST_OBSTACLE );
                  // SET_CURRMOVEMENTCOST( NORTHWEST, TRAVELCOST_OBSTACLE );
                  // SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                  // SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHWEST, 0, TRAVELCOST_OBSTACLE );
                  // corner
                  // SET_MOVEMENTCOST( usGridNo + 1 ,NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                } else if (!(pStructure.value.fFlags & STRUCTURE_SLIDINGDOOR)) {
                  // door
                  SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_WALL);
                  SET_CURRMOVEMENTCOST(Enum245.EAST, TRAVELCOST_DOOR_OPEN_N);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.WEST, 0, TRAVELCOST_DOOR_OPEN_NE);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_WALL);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_N_N);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_NE_N);
                }
                break;

              case Enum314.INSIDE_TOP_LEFT:
                SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_WALL);
                SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_DOOR_CLOSED_HERE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);

                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTH, 0, TRAVELCOST_DOOR_CLOSED_N);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);

                // DO CORNERS
                SET_MOVEMENTCOST(usGridNo - 1, Enum245.NORTHWEST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);
                SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);

                // doorframe
                // SET_CURRMOVEMENTCOST( NORTHEAST, TRAVELCOST_OBSTACLE );
                // SET_CURRMOVEMENTCOST( NORTHWEST, TRAVELCOST_OBSTACLE );
                // SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                // SET_MOVEMENTCOST( usGridNo + WORLD_COLS, SOUTHWEST, 0, TRAVELCOST_OBSTACLE );
                // corner
                // SET_MOVEMENTCOST( usGridNo + 1 ,NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                // door
                if (!(pStructure.value.fFlags & STRUCTURE_SLIDINGDOOR)) {
                  SET_CURRMOVEMENTCOST(Enum245.EAST, TRAVELCOST_DOOR_OPEN_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.SOUTHEAST, TRAVELCOST_DOOR_OPEN_HERE);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.WEST, 0, TRAVELCOST_DOOR_OPEN_E);
                  SET_MOVEMENTCOST(usGridNo - 1, Enum245.SOUTHWEST, 0, TRAVELCOST_DOOR_OPEN_E);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_S);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS - 1, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_SE);
                }
                break;

              case Enum314.OUTSIDE_TOP_RIGHT:
                if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
                  // doorframe
                  SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_OBSTACLE);
                  SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_OBSTACLE);

                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.EAST, 0, TRAVELCOST_DOOR_CLOSED_W);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);

                  // DO CORNERS
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_OBSTACLE);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHWEST, 0, TRAVELCOST_OBSTACLE);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_OBSTACLE);
                  SET_MOVEMENTCOST(usGridNo + WORLD_COLS, Enum245.SOUTHWEST, 0, TRAVELCOST_OBSTACLE);

                  // SET_CURRMOVEMENTCOST( SOUTHWEST, TRAVELCOST_OBSTACLE );
                  // SET_CURRMOVEMENTCOST( NORTHWEST, TRAVELCOST_OBSTACLE );
                  // SET_MOVEMENTCOST( usGridNo + 1, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                  // SET_MOVEMENTCOST( usGridNo + 1, NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                  // corner
                  // SET_MOVEMENTCOST( usGridNo + 1 + WORLD_COLS, SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                } else if (!(pStructure.value.fFlags & STRUCTURE_SLIDINGDOOR)) {
                  // door
                  SET_CURRMOVEMENTCOST(Enum245.SOUTH, TRAVELCOST_DOOR_OPEN_W);
                  SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_DOOR_OPEN_W);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTH, 0, TRAVELCOST_DOOR_OPEN_SW);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS, Enum245.NORTHWEST, 0, TRAVELCOST_DOOR_OPEN_SW);
                  SET_MOVEMENTCOST(usGridNo + 1, Enum245.SOUTHEAST, 0, TRAVELCOST_DOOR_OPEN_W_W);
                  SET_MOVEMENTCOST(usGridNo - WORLD_COLS + 1, Enum245.NORTHEAST, 0, TRAVELCOST_DOOR_OPEN_SW_W);
                }
                break;

              case Enum314.INSIDE_TOP_RIGHT:
                SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_OBSTACLE);
                SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_DOOR_CLOSED_HERE);
                SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_OBSTACLE);

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
                SET_CURRMOVEMENTCOST( SOUTHWEST, TRAVELCOST_OBSTACLE );
                SET_CURRMOVEMENTCOST( NORTHWEST, TRAVELCOST_OBSTACLE );
                SET_MOVEMENTCOST( usGridNo + 1,SOUTHEAST, 0, TRAVELCOST_OBSTACLE );
                SET_MOVEMENTCOST( usGridNo + 1,NORTHEAST, 0, TRAVELCOST_OBSTACLE );
                // corner
                SET_MOVEMENTCOST( usGridNo - WORLD_COLS,  NORTHWEST, 0, TRAVELCOST_OBSTACLE );
                */
                if (!(pStructure.value.fFlags & STRUCTURE_SLIDINGDOOR)) {
                  // door
                  SET_CURRMOVEMENTCOST(Enum245.SOUTH, TRAVELCOST_DOOR_OPEN_HERE);
                  SET_CURRMOVEMENTCOST(Enum245.SOUTHEAST, TRAVELCOST_DOOR_OPEN_HERE);
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
                          SET_CURRMOVEMENTCOST( NORTHEAST, TRAVELCOST_OBSTACLE );
                          SET_CURRMOVEMENTCOST( NORTH, TRAVELCOST_DOOR_CLOSED_HERE );
                          SET_CURRMOVEMENTCOST( NORTHWEST, TRAVELCOST_OBSTACLE );

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
                          SET_CURRMOVEMENTCOST( SOUTHWEST, TRAVELCOST_OBSTACLE );
                          SET_CURRMOVEMENTCOST( WEST, TRAVELCOST_DOOR_CLOSED_HERE );
                          SET_CURRMOVEMENTCOST( NORTHWEST, TRAVELCOST_OBSTACLE );

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
        } else if (pStructure.value.fFlags & STRUCTURE_WALLSTUFF) {
          // ATE: IF a closed door, set to door value
          switch (pStructure.value.ubWallOrientation) {
            case Enum314.OUTSIDE_TOP_LEFT:
            case Enum314.INSIDE_TOP_LEFT:
              SET_CURRMOVEMENTCOST(Enum245.NORTHEAST, TRAVELCOST_WALL);
              SET_CURRMOVEMENTCOST(Enum245.NORTH, TRAVELCOST_WALL);
              SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);
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
              SET_CURRMOVEMENTCOST(Enum245.SOUTHWEST, TRAVELCOST_WALL);
              SET_CURRMOVEMENTCOST(Enum245.WEST, TRAVELCOST_WALL);
              SET_CURRMOVEMENTCOST(Enum245.NORTHWEST, TRAVELCOST_WALL);
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
        if (!(pStructure.value.fFlags & STRUCTURE_PASSABLE || pStructure.value.fFlags & STRUCTURE_NORMAL_ROOF)) {
          fStructuresOnRoof = TRUE;
        }
      }
      pStructure = pStructure.value.pNext;
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

function RecompileLocalMovementCosts(sCentreGridNo: INT16): void {
  let usGridNo: INT16;
  let sGridX: INT16;
  let sGridY: INT16;
  let sCentreGridX: INT16;
  let sCentreGridY: INT16;
  let bDirLoop: INT8;

  ConvertGridNoToXY(sCentreGridNo, addressof(sCentreGridX), addressof(sCentreGridY));
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

function RecompileLocalMovementCostsFromRadius(sCentreGridNo: INT16, bRadius: INT8): void {
  let usGridNo: INT16;
  let sGridX: INT16;
  let sGridY: INT16;
  let sCentreGridX: INT16;
  let sCentreGridY: INT16;
  let bDirLoop: INT8;

  ConvertGridNoToXY(sCentreGridNo, addressof(sCentreGridX), addressof(sCentreGridY));
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

function AddTileToRecompileArea(sGridNo: INT16): void {
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
  sCheckY = sCheckGridNo / WORLD_COLS;
  if (sCheckX < gsRecompileAreaLeft) {
    gsRecompileAreaLeft = sCheckX;
  }
  if (sCheckY < gsRecompileAreaTop) {
    gsRecompileAreaTop = sCheckY;
  }

  // check Bottom/Right
  sCheckGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTHEAST));
  sCheckX = sCheckGridNo % WORLD_COLS;
  sCheckY = sCheckGridNo / WORLD_COLS;
  if (sCheckX > gsRecompileAreaRight) {
    gsRecompileAreaRight = sCheckX;
  }
  if (sCheckY > gsRecompileAreaBottom) {
    gsRecompileAreaBottom = sCheckY;
  }
}

function RecompileLocalMovementCostsInAreaWithFlags(): void {
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

function RecompileLocalMovementCostsForWall(sGridNo: INT16, ubOrientation: UINT8): void {
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
function CompileWorldMovementCosts(): void {
  let usGridNo: UINT16;

  memset(gubWorldMovementCosts, 0, sizeof(gubWorldMovementCosts));

  CompileWorldTerrainIDs();
  for (usGridNo = 0; usGridNo < WORLD_MAX; usGridNo++) {
    CompileTileMovementCosts(usGridNo);
  }
}

// SAVING CODE
function SaveWorld(puiFilename: Pointer<UINT8>): BOOLEAN {
  let cnt: INT32;
  let uiSoldierSize: UINT32;
  let uiType: UINT32;
  let uiFlags: UINT32;
  let uiBytesWritten: UINT32;
  let uiNumWarningsCaught: UINT32 = 0;
  let hfile: HWFILE;
  let pLand: Pointer<LEVELNODE>;
  let pObject: Pointer<LEVELNODE>;
  let pStruct: Pointer<LEVELNODE>;
  let pShadow: Pointer<LEVELNODE>;
  let pRoof: Pointer<LEVELNODE>;
  let pOnRoof: Pointer<LEVELNODE>;
  let pTailLand: Pointer<LEVELNODE> = null;
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
  let aFilename: CHAR8[] /* [255] */;
  let ubCombine: UINT8;
  let bCounts: UINT8[][] /* [WORLD_MAX][8] */;

  sprintf(aFilename, "MAPS\\%s", puiFilename);

  // Open file
  hfile = FileOpen(aFilename, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);

  if (!hfile) {
    return FALSE;
  }

  // Write JA2 Version ID
  FileWrite(hfile, addressof(gdMajorMapVersion), sizeof(FLOAT), addressof(uiBytesWritten));
  if (gdMajorMapVersion >= 4.00) {
    FileWrite(hfile, addressof(gubMinorMapVersion), sizeof(UINT8), addressof(uiBytesWritten));
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

  FileWrite(hfile, addressof(uiFlags), sizeof(INT32), addressof(uiBytesWritten));

  // Write tileset ID
  FileWrite(hfile, addressof(giCurrentTilesetID), sizeof(INT32), addressof(uiBytesWritten));

  // Write SOLDIER CONTROL SIZE
  uiSoldierSize = sizeof(SOLDIERTYPE);
  FileWrite(hfile, addressof(uiSoldierSize), sizeof(INT32), addressof(uiBytesWritten));

  // REMOVE WORLD VISIBILITY TILES
  RemoveWorldWireFrameTiles();

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write out height values
    FileWrite(hfile, addressof(gpWorldLevelData[cnt].sHeight), sizeof(INT16), addressof(uiBytesWritten));
  }

  // Write out # values - we'll have no more than 15 per level!
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Determine number of land
    pLand = gpWorldLevelData[cnt].pLandHead;
    LayerCount = 0;

    while (pLand != null) {
      LayerCount++;
      pLand = pLand.value.pNext;
    }
    if (LayerCount > 15) {
      swprintf(gzErrorCatchString,
               "SAVE ABORTED!  Land count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.",
               LayerCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = TRUE;
      FileClose(hfile);
      return FALSE;
    }
    if (LayerCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = TRUE;
      swprintf(gzErrorCatchString, "Warnings %d -- Last warning:  Land count warning of %d for gridno %d.", uiNumWarningsCaught, LayerCount, cnt);
    }
    bCounts[cnt][0] = LayerCount;

    // Combine # of land layers with worlddef flags ( first 4 bits )
    ubCombine = ((LayerCount & 0xf) | ((gpWorldLevelData[cnt].uiFlags & 0xf) << 4));
    // Write combination
    FileWrite(hfile, addressof(ubCombine), sizeof(ubCombine), addressof(uiBytesWritten));

    // Determine # of objects
    pObject = gpWorldLevelData[cnt].pObjectHead;
    ObjectCount = 0;
    while (pObject != null) {
      // DON'T WRITE ANY ITEMS
      if (!(pObject.value.uiFlags & (LEVELNODE_ITEM))) {
        let uiTileType: UINT32;
        // Make sure this isn't a UI Element
        GetTileType(pObject.value.usIndex, addressof(uiTileType));
        if (uiTileType < Enum313.FIRSTPOINTERS)
          ObjectCount++;
      }
      pObject = pObject.value.pNext;
    }
    if (ObjectCount > 15) {
      swprintf(gzErrorCatchString,
               "SAVE ABORTED!  Object count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.",
               ObjectCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = TRUE;
      FileClose(hfile);
      return FALSE;
    }
    if (ObjectCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = TRUE;
      swprintf(gzErrorCatchString, "Warnings %d -- Last warning:  Object count warning of %d for gridno %d.", uiNumWarningsCaught, ObjectCount, cnt);
    }
    bCounts[cnt][1] = ObjectCount;

    // Determine # of structs
    pStruct = gpWorldLevelData[cnt].pStructHead;
    StructCount = 0;
    while (pStruct != null) {
      // DON'T WRITE ANY ITEMS
      if (!(pStruct.value.uiFlags & (LEVELNODE_ITEM))) {
        StructCount++;
      }
      pStruct = pStruct.value.pNext;
    }
    if (StructCount > 15) {
      swprintf(gzErrorCatchString,
               "SAVE ABORTED!  Struct count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.",
               StructCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = TRUE;
      FileClose(hfile);
      return FALSE;
    }
    if (StructCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = TRUE;
      swprintf(gzErrorCatchString, "Warnings %d -- Last warning:  Struct count warning of %d for gridno %d.", uiNumWarningsCaught, StructCount, cnt);
    }
    bCounts[cnt][2] = StructCount;

    ubCombine = ((ObjectCount & 0xf) | ((StructCount & 0xf) << 4));
    // Write combination
    FileWrite(hfile, addressof(ubCombine), sizeof(ubCombine), addressof(uiBytesWritten));

    // Determine # of shadows
    pShadow = gpWorldLevelData[cnt].pShadowHead;
    ShadowCount = 0;
    while (pShadow != null) {
      // Don't write any shadowbuddys or exit grids
      if (!(pShadow.value.uiFlags & (LEVELNODE_BUDDYSHADOW | LEVELNODE_EXITGRID))) {
        ShadowCount++;
      }
      pShadow = pShadow.value.pNext;
    }
    if (ShadowCount > 15) {
      swprintf(gzErrorCatchString,
               "SAVE ABORTED!  Shadow count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.",
               ShadowCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = TRUE;
      FileClose(hfile);
      return FALSE;
    }
    if (ShadowCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = TRUE;
      swprintf(gzErrorCatchString, "Warnings %d -- Last warning:  Shadow count warning of %d for gridno %d.", uiNumWarningsCaught, ShadowCount, cnt);
    }
    bCounts[cnt][3] = ShadowCount;

    // Determine # of Roofs
    pRoof = gpWorldLevelData[cnt].pRoofHead;
    RoofCount = 0;
    while (pRoof != null) {
      // ATE: Don't save revealed roof info...
      if (pRoof.value.usIndex != Enum312.SLANTROOFCEILING1) {
        RoofCount++;
      }
      pRoof = pRoof.value.pNext;
    }
    if (RoofCount > 15) {
      swprintf(gzErrorCatchString,
               "SAVE ABORTED!  Roof count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.",
               RoofCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = TRUE;
      FileClose(hfile);
      return FALSE;
    }
    if (RoofCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = TRUE;
      swprintf(gzErrorCatchString, "Warnings %d -- Last warning:  Roof count warning of %d for gridno %d.", uiNumWarningsCaught, RoofCount, cnt);
    }
    bCounts[cnt][4] = RoofCount;

    ubCombine = ((ShadowCount & 0xf) | ((RoofCount & 0xf) << 4));
    // Write combination
    FileWrite(hfile, addressof(ubCombine), sizeof(ubCombine), addressof(uiBytesWritten));

    // Write OnRoof layer
    // Determine # of OnRoofs
    pOnRoof = gpWorldLevelData[cnt].pOnRoofHead;
    OnRoofCount = 0;

    while (pOnRoof != null) {
      OnRoofCount++;
      pOnRoof = pOnRoof.value.pNext;
    }
    if (OnRoofCount > 15) {
      swprintf(gzErrorCatchString,
               "SAVE ABORTED!  OnRoof count too high (%d) for gridno %d."
               + "  Need to fix before map can be saved!  There are %d additional warnings.",
               OnRoofCount, cnt, uiNumWarningsCaught);
      gfErrorCatch = TRUE;
      FileClose(hfile);
      return FALSE;
    }
    if (OnRoofCount > 10) {
      uiNumWarningsCaught++;
      gfErrorCatch = TRUE;
      swprintf(gzErrorCatchString, "Warnings %d -- Last warning:  OnRoof count warning of %d for gridno %d.", uiNumWarningsCaught, OnRoofCount, cnt);
    }
    bCounts[cnt][5] = RoofCount;

    // Write combination of onroof and nothing...
    ubCombine = ((OnRoofCount & 0xf));
    // Write combination
    FileWrite(hfile, addressof(ubCombine), sizeof(ubCombine), addressof(uiBytesWritten));
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (bCounts[cnt][0] == 0) {
      FileWrite(hfile, addressof(ubTest), sizeof(UINT8), addressof(uiBytesWritten));
      FileWrite(hfile, addressof(ubTest), sizeof(UINT8), addressof(uiBytesWritten));
    } else {
      // Write land layers
      // Write out land peices backwards so that they are loaded properly
      pLand = gpWorldLevelData[cnt].pLandHead;
      // GET TAIL
      while (pLand != null) {
        pTailLand = pLand;
        pLand = pLand.value.pNext;
      }

      while (pTailLand != null) {
        // Write out object type and sub-index
        GetTileType(pTailLand.value.usIndex, addressof(uiType));
        ubType = uiType;
        GetTypeSubIndexFromTileIndexChar(uiType, pTailLand.value.usIndex, addressof(ubTypeSubIndex));
        FileWrite(hfile, addressof(ubType), sizeof(UINT8), addressof(uiBytesWritten));
        FileWrite(hfile, addressof(ubTypeSubIndex), sizeof(UINT8), addressof(uiBytesWritten));

        pTailLand = pTailLand.value.pPrevNode;
      }
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write object layer
    pObject = gpWorldLevelData[cnt].pObjectHead;
    while (pObject != null) {
      // DON'T WRITE ANY ITEMS
      if (!(pObject.value.uiFlags & (LEVELNODE_ITEM))) {
        // Write out object type and sub-index
        GetTileType(pObject.value.usIndex, addressof(uiType));
        // Make sure this isn't a UI Element
        if (uiType < Enum313.FIRSTPOINTERS) {
          // We are writing 2 bytes for the type subindex in the object layer because the
          // ROADPIECES slot contains more than 256 subindices.
          ubType = uiType;
          GetTypeSubIndexFromTileIndex(uiType, pObject.value.usIndex, addressof(usTypeSubIndex));
          FileWrite(hfile, addressof(ubType), sizeof(UINT8), addressof(uiBytesWritten));
          FileWrite(hfile, addressof(usTypeSubIndex), sizeof(UINT16), addressof(uiBytesWritten));
        }
      }
      pObject = pObject.value.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write struct layer
    pStruct = gpWorldLevelData[cnt].pStructHead;
    while (pStruct != null) {
      // DON'T WRITE ANY ITEMS
      if (!(pStruct.value.uiFlags & (LEVELNODE_ITEM))) {
        // Write out object type and sub-index
        GetTileType(pStruct.value.usIndex, addressof(uiType));
        ubType = uiType;
        GetTypeSubIndexFromTileIndexChar(uiType, pStruct.value.usIndex, addressof(ubTypeSubIndex));
        FileWrite(hfile, addressof(ubType), sizeof(UINT8), addressof(uiBytesWritten));
        FileWrite(hfile, addressof(ubTypeSubIndex), sizeof(UINT8), addressof(uiBytesWritten));
      }

      pStruct = pStruct.value.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write shadows
    pShadow = gpWorldLevelData[cnt].pShadowHead;
    while (pShadow != null) {
      // Dont't write any buddys or exit grids
      if (!(pShadow.value.uiFlags & (LEVELNODE_BUDDYSHADOW | LEVELNODE_EXITGRID))) {
        // Write out object type and sub-index
        // Write out object type and sub-index
        GetTileType(pShadow.value.usIndex, addressof(uiType));
        ubType = uiType;
        GetTypeSubIndexFromTileIndexChar(uiType, pShadow.value.usIndex, addressof(ubTypeSubIndex));
        FileWrite(hfile, addressof(ubType), sizeof(UINT8), addressof(uiBytesWritten));
        FileWrite(hfile, addressof(ubTypeSubIndex), sizeof(UINT8), addressof(uiBytesWritten));
      } else if (pShadow.value.uiFlags & LEVELNODE_EXITGRID) {
        // count the number of exitgrids
        usNumExitGrids++;
      }

      pShadow = pShadow.value.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pRoof = gpWorldLevelData[cnt].pRoofHead;
    while (pRoof != null) {
      // ATE: Don't save revealed roof info...
      if (pRoof.value.usIndex != Enum312.SLANTROOFCEILING1) {
        // Write out object type and sub-index
        GetTileType(pRoof.value.usIndex, addressof(uiType));
        ubType = uiType;
        GetTypeSubIndexFromTileIndexChar(uiType, pRoof.value.usIndex, addressof(ubTypeSubIndex));
        FileWrite(hfile, addressof(ubType), sizeof(UINT8), addressof(uiBytesWritten));
        FileWrite(hfile, addressof(ubTypeSubIndex), sizeof(UINT8), addressof(uiBytesWritten));
      }

      pRoof = pRoof.value.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write OnRoofs
    pOnRoof = gpWorldLevelData[cnt].pOnRoofHead;
    while (pOnRoof != null) {
      // Write out object type and sub-index
      GetTileType(pOnRoof.value.usIndex, addressof(uiType));
      ubType = uiType;
      GetTypeSubIndexFromTileIndexChar(uiType, pOnRoof.value.usIndex, addressof(ubTypeSubIndex));
      FileWrite(hfile, addressof(ubType), sizeof(UINT8), addressof(uiBytesWritten));
      FileWrite(hfile, addressof(ubTypeSubIndex), sizeof(UINT8), addressof(uiBytesWritten));

      pOnRoof = pOnRoof.value.pNext;
    }
  }

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Write out room information
    FileWrite(hfile, addressof(gubWorldRoomInfo[cnt]), sizeof(INT8), addressof(uiBytesWritten));
  }

  if (uiFlags & MAP_WORLDITEMS_SAVED) {
    // Write out item information
    SaveWorldItemsToMap(hfile);
  }

  if (uiFlags & MAP_AMBIENTLIGHTLEVEL_SAVED) {
    FileWrite(hfile, addressof(gfBasement), 1, addressof(uiBytesWritten));
    FileWrite(hfile, addressof(gfCaves), 1, addressof(uiBytesWritten));
    FileWrite(hfile, addressof(ubAmbientLightLevel), 1, addressof(uiBytesWritten));
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

  sprintf(gubFilename, puiFilename);

  return TRUE;
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
  let pNode: Pointer<LEVELNODE>;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pNode = gpWorldLevelData[cnt].pStructHead;
    while (pNode) {
      if (pNode.value.usIndex == BLUEFLAG_GRAPHIC) {
        gpWorldLevelData[cnt].uiFlags |= MAPELEMENT_PLAYER_MINE_PRESENT;
        break;
      }
      pNode = pNode.value.pNext;
    }
  }
}

function InitLoadedWorld(): void {
  // if the current sector is not valid, dont init the world
  if (gWorldSectorX == 0 || gWorldSectorY == 0) {
    return;
  }

  // COMPILE MOVEMENT COSTS
  CompileWorldMovementCosts();

  // COMPILE INTERACTIVE TILES
  CompileInteractiveTiles();

  // COMPILE WORLD VISIBLIY TILES
  CalculateWorldWireFrameTiles(TRUE);

  LightSpriteRenderAll();

  OptimizeMapForShadows();

  SetInterfaceHeightLevel();

  // ATE: if we have a slide location, remove it!
  gTacticalStatus.sSlideTarget = NOWHERE;

  SetBlueFlagFlags();
}

function EvaluateWorld(pSector: Pointer<UINT8>, ubLevel: UINT8): BOOLEAN {
  let dMajorMapVersion: FLOAT;
  let pSummary: Pointer<SUMMARYFILE>;
  let hfile: HWFILE;
  let mapInfo: MAPCREATE_STRUCT;
  let pBuffer: Pointer<INT8>;
  let pBufferHead: Pointer<INT8>;
  let uiFileSize: UINT32;
  let uiFlags: UINT32;
  let uiBytesRead: UINT32;
  let cnt: INT32;
  let i: INT32;
  let iTilesetID: INT32;
  let str: UINT16[] /* [40] */;
  let bCounts: UINT8[][] /* [WORLD_MAX][8] */;
  let ubCombine: UINT8;
  let szDirFilename: UINT8[] /* [50] */;
  let szFilename: UINT8[] /* [40] */;
  let ubMinorMapVersion: UINT8;

  // Make sure the file exists... if not, then return false
  sprintf(szFilename, pSector);
  if (ubLevel % 4) {
    let str: UINT8[] /* [4] */;
    sprintf(str, "_b%d", ubLevel % 4);
    strcat(szFilename, str);
  }
  if (ubLevel >= 4) {
    strcat(szFilename, "_a");
  }
  strcat(szFilename, ".dat");
  sprintf(szDirFilename, "MAPS\\%s", szFilename);

  if (gfMajorUpdate) {
    if (!LoadWorld(szFilename)) // error
      return FALSE;
    FileClearAttributes(szDirFilename);
    SaveWorld(szFilename);
  }

  hfile = FileOpen(szDirFilename, FILE_ACCESS_READ, FALSE);
  if (!hfile)
    return FALSE;

  uiFileSize = FileGetSize(hfile);
  pBuffer = MemAlloc(uiFileSize);
  pBufferHead = pBuffer;
  FileRead(hfile, pBuffer, uiFileSize, addressof(uiBytesRead));
  FileClose(hfile);

  swprintf(str, "Analyzing map %S", szFilename);
  if (!gfUpdatingNow)
    SetRelativeStartAndEndPercentage(0, 0, 100, str);
  else
    SetRelativeStartAndEndPercentage(0, MasterStart, MasterEnd, str);

  RenderProgressBar(0, 0);
  // RenderProgressBar( 1, 0 );

  // clear the summary file info
  pSummary = MemAlloc(sizeof(SUMMARYFILE));
  Assert(pSummary);
  memset(pSummary, 0, sizeof(SUMMARYFILE));
  pSummary.value.ubSummaryVersion = GLOBAL_SUMMARY_VERSION;
  pSummary.value.dMajorMapVersion = gdMajorMapVersion;

  // skip JA2 Version ID
  LOADDATA(addressof(dMajorMapVersion), pBuffer, sizeof(FLOAT));
  if (dMajorMapVersion >= 4.00) {
    LOADDATA(addressof(ubMinorMapVersion), pBuffer, sizeof(UINT8));
  }

  // Read FLAGS FOR WORLD
  LOADDATA(addressof(uiFlags), pBuffer, sizeof(INT32));

  // Read tilesetID
  LOADDATA(addressof(iTilesetID), pBuffer, sizeof(INT32));
  pSummary.value.ubTilesetID = iTilesetID;

  // skip soldier size
  pBuffer += sizeof(INT32);

  // skip height values
  pBuffer += sizeof(INT16) * WORLD_MAX;

  // read layer counts
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (!(cnt % 2560)) {
      RenderProgressBar(0, (cnt / 2560) + 1); // 1 - 10
      // RenderProgressBar( 1, (cnt / 2560)+1 ); //1 - 10
    }
    // Read combination of land/world flags
    LOADDATA(addressof(ubCombine), pBuffer, sizeof(UINT8));
    // split
    bCounts[cnt][0] = (ubCombine & 0xf);
    gpWorldLevelData[cnt].uiFlags |= ((ubCombine & 0xf0) >> 4);
    // Read #objects, structs
    LOADDATA(addressof(ubCombine), pBuffer, sizeof(UINT8));
    // split
    bCounts[cnt][1] = (ubCombine & 0xf);
    bCounts[cnt][2] = ((ubCombine & 0xf0) >> 4);
    // Read shadows, roof
    LOADDATA(addressof(ubCombine), pBuffer, sizeof(UINT8));
    // split
    bCounts[cnt][3] = (ubCombine & 0xf);
    bCounts[cnt][4] = ((ubCombine & 0xf0) >> 4);
    // Read OnRoof, nothing
    LOADDATA(addressof(ubCombine), pBuffer, sizeof(UINT8));
    // split
    bCounts[cnt][5] = (ubCombine & 0xf);
    // bCounts[ cnt ][4] = (UINT8)((ubCombine&0xf0)>>4);
    bCounts[cnt][6] = bCounts[cnt][0] + bCounts[cnt][1] + bCounts[cnt][2] + bCounts[cnt][3] + bCounts[cnt][4] + bCounts[cnt][5];
  }
  // skip all layers
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (!(cnt % 320)) {
      RenderProgressBar(0, (cnt / 320) + 11); // 11 - 90
      // RenderProgressBar( 1, (cnt / 320)+11 ); //11 - 90
    }
    pBuffer += sizeof(UINT16) * bCounts[cnt][6];
    pBuffer += bCounts[cnt][1];
  }

  // extract highest room number
  {
    let ubRoomNum: UINT8;
    for (cnt = 0; cnt < WORLD_MAX; cnt++) {
      LOADDATA(addressof(ubRoomNum), pBuffer, 1);
      if (ubRoomNum > pSummary.value.ubNumRooms) {
        pSummary.value.ubNumRooms = ubRoomNum;
      }
    }
  }

  if (uiFlags & MAP_WORLDITEMS_SAVED) {
    let temp: UINT32;
    RenderProgressBar(0, 91);
    // RenderProgressBar( 1, 91 );
    // get number of items (for now)
    LOADDATA(addressof(temp), pBuffer, 4);
    pSummary.value.usNumItems = temp;
    // Important:  Saves the file position (byte offset) of the position where the numitems
    //            resides.  Checking this value and comparing to usNumItems will ensure validity.
    if (pSummary.value.usNumItems) {
      pSummary.value.uiNumItemsPosition = pBuffer - pBufferHead - 4;
    }
    // Skip the contents of the world items.
    pBuffer += sizeof(WORLDITEM) * pSummary.value.usNumItems;
  }

  if (uiFlags & MAP_AMBIENTLIGHTLEVEL_SAVED) {
    pBuffer += 3;
  }

  if (uiFlags & MAP_WORLDLIGHTS_SAVED) {
    let ubTemp: UINT8;
    RenderProgressBar(0, 92);
    // RenderProgressBar( 1, 92 );
    // skip number of light palette entries
    LOADDATA(addressof(ubTemp), pBuffer, 1);
    pBuffer += sizeof(SGPPaletteEntry) * ubTemp;
    // get number of lights
    LOADDATA(addressof(pSummary.value.usNumLights), pBuffer, 2);
    // skip the light loading
    for (cnt = 0; cnt < pSummary.value.usNumLights; cnt++) {
      let ubStrLen: UINT8;
      pBuffer += sizeof(LIGHT_SPRITE);
      LOADDATA(addressof(ubStrLen), pBuffer, 1);
      if (ubStrLen) {
        pBuffer += ubStrLen;
      }
    }
  }

  // read the mapinformation
  LOADDATA(addressof(mapInfo), pBuffer, sizeof(MAPCREATE_STRUCT));

  memcpy(addressof(pSummary.value.MapInfo), addressof(mapInfo), sizeof(MAPCREATE_STRUCT));

  if (uiFlags & MAP_FULLSOLDIER_SAVED) {
    let pTeam: Pointer<TEAMSUMMARY> = null;
    let basic: BASIC_SOLDIERCREATE_STRUCT;
    let priority: SOLDIERCREATE_STRUCT;
    RenderProgressBar(0, 94);
    // RenderProgressBar( 1, 94 );

    pSummary.value.uiEnemyPlacementPosition = pBuffer - pBufferHead;

    for (i = 0; i < pSummary.value.MapInfo.ubNumIndividuals; i++) {
      LOADDATA(addressof(basic), pBuffer, sizeof(BASIC_SOLDIERCREATE_STRUCT));

      switch (basic.bTeam) {
        case ENEMY_TEAM:
          pTeam = addressof(pSummary.value.EnemyTeam);
          break;
        case CREATURE_TEAM:
          pTeam = addressof(pSummary.value.CreatureTeam);
          break;
        case MILITIA_TEAM:
          pTeam = addressof(pSummary.value.RebelTeam);
          break;
        case CIV_TEAM:
          pTeam = addressof(pSummary.value.CivTeam);
          break;
      }
      if (basic.bOrders == Enum241.RNDPTPATROL || basic.bOrders == Enum241.POINTPATROL) {
        // make sure the placement has at least one waypoint.
        if (!basic.bPatrolCnt) {
          pSummary.value.ubEnemiesReqWaypoints++;
        }
      } else if (basic.bPatrolCnt) {
        pSummary.value.ubEnemiesHaveWaypoints++;
      }
      if (basic.fPriorityExistance)
        pTeam.value.ubExistance++;
      switch (basic.bRelativeAttributeLevel) {
        case 0:
          pTeam.value.ubBadA++;
          break;
        case 1:
          pTeam.value.ubPoorA++;
          break;
        case 2:
          pTeam.value.ubAvgA++;
          break;
        case 3:
          pTeam.value.ubGoodA++;
          break;
        case 4:
          pTeam.value.ubGreatA++;
          break;
      }
      switch (basic.bRelativeEquipmentLevel) {
        case 0:
          pTeam.value.ubBadE++;
          break;
        case 1:
          pTeam.value.ubPoorE++;
          break;
        case 2:
          pTeam.value.ubAvgE++;
          break;
        case 3:
          pTeam.value.ubGoodE++;
          break;
        case 4:
          pTeam.value.ubGreatE++;
          break;
      }
      if (basic.fDetailedPlacement) {
        // skip static priority placement
        LOADDATA(addressof(priority), pBuffer, sizeof(SOLDIERCREATE_STRUCT));
        if (priority.ubProfile != NO_PROFILE)
          pTeam.value.ubProfile++;
        else
          pTeam.value.ubDetailed++;
        if (basic.bTeam == CIV_TEAM) {
          if (priority.ubScheduleID)
            pSummary.value.ubCivSchedules++;
          if (priority.bBodyType == Enum194.COW)
            pSummary.value.ubCivCows++;
          else if (priority.bBodyType == Enum194.BLOODCAT)
            pSummary.value.ubCivBloodcats++;
        }
      }
      if (basic.bTeam == ENEMY_TEAM) {
        switch (basic.ubSoldierClass) {
          case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
            pSummary.value.ubNumAdmins++;
            if (basic.fPriorityExistance)
              pSummary.value.ubAdminExistance++;
            if (basic.fDetailedPlacement) {
              if (priority.ubProfile != NO_PROFILE)
                pSummary.value.ubAdminProfile++;
              else
                pSummary.value.ubAdminDetailed++;
            }
            break;
          case Enum262.SOLDIER_CLASS_ELITE:
            pSummary.value.ubNumElites++;
            if (basic.fPriorityExistance)
              pSummary.value.ubEliteExistance++;
            if (basic.fDetailedPlacement) {
              if (priority.ubProfile != NO_PROFILE)
                pSummary.value.ubEliteProfile++;
              else
                pSummary.value.ubEliteDetailed++;
            }
            break;
          case Enum262.SOLDIER_CLASS_ARMY:
            pSummary.value.ubNumTroops++;
            if (basic.fPriorityExistance)
              pSummary.value.ubTroopExistance++;
            if (basic.fDetailedPlacement) {
              if (priority.ubProfile != NO_PROFILE)
                pSummary.value.ubTroopProfile++;
              else
                pSummary.value.ubTroopDetailed++;
            }
            break;
        }
      } else if (basic.bTeam == CREATURE_TEAM) {
        if (basic.bBodyType == Enum194.BLOODCAT)
          pTeam.value.ubNumAnimals++;
      }
      pTeam.value.ubTotal++;
    }
    RenderProgressBar(0, 96);
    // RenderProgressBar( 1, 96 );
  }

  if (uiFlags & MAP_EXITGRIDS_SAVED) {
    let exitGrid: EXITGRID;
    let loop: INT32;
    let usMapIndex: UINT16;
    let fExitGridFound: BOOLEAN;
    RenderProgressBar(0, 98);
    // RenderProgressBar( 1, 98 );

    LOADDATA(addressof(cnt), pBuffer, 2);

    for (i = 0; i < cnt; i++) {
      LOADDATA(addressof(usMapIndex), pBuffer, 2);
      LOADDATA(addressof(exitGrid), pBuffer, 5);
      fExitGridFound = FALSE;
      for (loop = 0; loop < pSummary.value.ubNumExitGridDests; loop++) {
        if (pSummary.value.ExitGrid[loop].usGridNo == exitGrid.usGridNo && pSummary.value.ExitGrid[loop].ubGotoSectorX == exitGrid.ubGotoSectorX && pSummary.value.ExitGrid[loop].ubGotoSectorY == exitGrid.ubGotoSectorY && pSummary.value.ExitGrid[loop].ubGotoSectorZ == exitGrid.ubGotoSectorZ) {
          // same destination.
          pSummary.value.usExitGridSize[loop]++;
          fExitGridFound = TRUE;
          break;
        }
      }
      if (!fExitGridFound) {
        if (loop >= 4) {
          pSummary.value.fTooManyExitGridDests = TRUE;
        } else {
          pSummary.value.ubNumExitGridDests++;
          pSummary.value.usExitGridSize[loop]++;
          pSummary.value.ExitGrid[loop].usGridNo = exitGrid.usGridNo;
          pSummary.value.ExitGrid[loop].ubGotoSectorX = exitGrid.ubGotoSectorX;
          pSummary.value.ExitGrid[loop].ubGotoSectorY = exitGrid.ubGotoSectorY;
          pSummary.value.ExitGrid[loop].ubGotoSectorZ = exitGrid.ubGotoSectorZ;
          if (pSummary.value.ExitGrid[loop].ubGotoSectorX != exitGrid.ubGotoSectorX || pSummary.value.ExitGrid[loop].ubGotoSectorY != exitGrid.ubGotoSectorY) {
            pSummary.value.fInvalidDest[loop] = TRUE;
          }
        }
      }
    }
  }

  if (uiFlags & MAP_DOORTABLE_SAVED) {
    let Door: DOOR;

    LOADDATA(addressof(pSummary.value.ubNumDoors), pBuffer, 1);

    for (cnt = 0; cnt < pSummary.value.ubNumDoors; cnt++) {
      LOADDATA(addressof(Door), pBuffer, sizeof(DOOR));

      if (Door.ubTrapID && Door.ubLockID)
        pSummary.value.ubNumDoorsLockedAndTrapped++;
      else if (Door.ubLockID)
        pSummary.value.ubNumDoorsLocked++;
      else if (Door.ubTrapID)
        pSummary.value.ubNumDoorsTrapped++;
    }
  }

  RenderProgressBar(0, 100);
  // RenderProgressBar( 1, 100 );

  MemFree(pBufferHead);

  WriteSectorSummaryUpdate(szFilename, ubLevel, pSummary);
  return TRUE;
}

function LoadWorld(puiFilename: Pointer<UINT8>): BOOLEAN {
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
  let aFilename: CHAR8[] /* [50] */;
  let ubCombine: UINT8;
  let bCounts: UINT8[][] /* [WORLD_MAX][8] */;
  let pBuffer: Pointer<INT8>;
  let pBufferHead: Pointer<INT8>;
  let fGenerateEdgePoints: BOOLEAN = FALSE;
  let ubMinorMapVersion: UINT8;

  LoadShadeTablesFromTextFile();

  // Append exension to filename!
  if (gfForceLoad) {
    sprintf(aFilename, "MAPS\\%s", gzForceLoadFile);
  } else {
    sprintf(aFilename, "MAPS\\%s", puiFilename);
  }

  // RESET FLAGS FOR OUTDOORS/INDOORS
  gfBasement = FALSE;
  gfCaves = FALSE;

  // Open file
  hfile = FileOpen(aFilename, FILE_ACCESS_READ, FALSE);

  if (!hfile) {
    SET_ERROR("Could not load map file %S", aFilename);
    return FALSE;
  }

  SetRelativeStartAndEndPercentage(0, 0, 1, "Trashing world...");

  TrashWorld();

  LightReset();

  // Get the file size and alloc one huge buffer for it.
  // We will use this buffer to transfer all of the data from.
  uiFileSize = FileGetSize(hfile);
  pBuffer = MemAlloc(uiFileSize);
  pBufferHead = pBuffer;
  FileRead(hfile, pBuffer, uiFileSize, addressof(uiBytesRead));
  FileClose(hfile);

  // Read JA2 Version ID
  LOADDATA(addressof(dMajorMapVersion), pBuffer, sizeof(FLOAT));

// FIXME: Language-specific code
// #ifdef RUSSIAN
//   if (dMajorMapVersion != 6.00) {
//     return FALSE;
//   }
// #endif

  LOADDATA(addressof(ubMinorMapVersion), pBuffer, sizeof(UINT8));

  // CHECK FOR NON-COMPATIBLE VERSIONS!
  // CHECK FOR MAJOR MAP VERSION INCOMPATIBLITIES
  // if ( dMajorMapVersion < gdMajorMapVersion )
  //{
  // AssertMsg( 0, "Major version conflict.  Should have force updated this map already!!!" );
  // SET_ERROR(  "Incompatible JA2 map version: %f, map version is now at %f", gdLoadedMapVersion, gdMapVersion );
  // return( FALSE );
  //}

  // Read FLAGS FOR WORLD
  LOADDATA(addressof(uiFlags), pBuffer, sizeof(INT32));

  LOADDATA(addressof(iTilesetID), pBuffer, sizeof(INT32));

  CHECKF(LoadMapTileset(iTilesetID) != FALSE);

  // Load soldier size
  LOADDATA(addressof(uiSoldierSize), pBuffer, sizeof(INT32));

  // FP 0x000010

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Read height values
    LOADDATA(addressof(gpWorldLevelData[cnt].sHeight), pBuffer, sizeof(INT16));
  }

  // FP 0x00c810

  SetRelativeStartAndEndPercentage(0, 35, 40, "Counting layers...");
  RenderProgressBar(0, 100);

  // Read layer counts
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Read combination of land/world flags
    LOADDATA(addressof(ubCombine), pBuffer, sizeof(UINT8));

    // split
    bCounts[cnt][0] = (ubCombine & 0xf);
    gpWorldLevelData[cnt].uiFlags |= ((ubCombine & 0xf0) >> 4);

    // Read #objects, structs
    LOADDATA(addressof(ubCombine), pBuffer, sizeof(UINT8));

    // split
    bCounts[cnt][1] = (ubCombine & 0xf);
    bCounts[cnt][2] = ((ubCombine & 0xf0) >> 4);

    // Read shadows, roof
    LOADDATA(addressof(ubCombine), pBuffer, sizeof(UINT8));

    // split
    bCounts[cnt][3] = (ubCombine & 0xf);
    bCounts[cnt][4] = ((ubCombine & 0xf0) >> 4);

    // Read OnRoof, nothing
    LOADDATA(addressof(ubCombine), pBuffer, sizeof(UINT8));

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
      LOADDATA(addressof(ubType), pBuffer, sizeof(UINT8));
      LOADDATA(addressof(ubSubIndex), pBuffer, sizeof(UINT8));

      // Get tile index
      GetTileIndexFromTypeSubIndex(ubType, ubSubIndex, addressof(usTileIndex));

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
        LOADDATA(addressof(ubType), pBuffer, sizeof(UINT8));
        LOADDATA(addressof(ubSubIndex), pBuffer, sizeof(UINT8));
        if (ubType >= Enum313.FIRSTPOINTERS) {
          continue;
        }
        // Get tile index
        GetTileIndexFromTypeSubIndex(ubType, ubSubIndex, addressof(usTileIndex));
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
        LOADDATA(addressof(ubType), pBuffer, sizeof(UINT8));
        LOADDATA(addressof(usTypeSubIndex), pBuffer, sizeof(UINT16));
        if (ubType >= Enum313.FIRSTPOINTERS) {
          continue;
        }
        // Get tile index
        GetTileIndexFromTypeSubIndex(ubType, usTypeSubIndex, addressof(usTileIndex));
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
      LOADDATA(addressof(ubType), pBuffer, sizeof(UINT8));
      LOADDATA(addressof(ubSubIndex), pBuffer, sizeof(UINT8));

      // Get tile index
      GetTileIndexFromTypeSubIndex(ubType, ubSubIndex, addressof(usTileIndex));

      if (ubMinorMapVersion <= 25) {
        // Check patching for phantom menace struct data...
        if (gTileDatabase[usTileIndex].uiFlags & UNDERFLOW_FILLER) {
          GetTileIndexFromTypeSubIndex(ubType, 1, addressof(usTileIndex));
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
      LOADDATA(addressof(ubType), pBuffer, sizeof(UINT8));
      LOADDATA(addressof(ubSubIndex), pBuffer, sizeof(UINT8));

      // Get tile index
      GetTileIndexFromTypeSubIndex(ubType, ubSubIndex, addressof(usTileIndex));

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
      LOADDATA(addressof(ubType), pBuffer, sizeof(UINT8));
      LOADDATA(addressof(ubSubIndex), pBuffer, sizeof(UINT8));

      // Get tile index
      GetTileIndexFromTypeSubIndex(ubType, ubSubIndex, addressof(usTileIndex));

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
      LOADDATA(addressof(ubType), pBuffer, sizeof(UINT8));
      LOADDATA(addressof(ubSubIndex), pBuffer, sizeof(UINT8));

      // Get tile index
      GetTileIndexFromTypeSubIndex(ubType, ubSubIndex, addressof(usTileIndex));

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
    LOADDATA(addressof(gubWorldRoomInfo[cnt]), pBuffer, sizeof(INT8));
    // Got to set the max room number
    if (gubWorldRoomInfo[cnt] > gubMaxRoomNumber)
      gubMaxRoomNumber = gubWorldRoomInfo[cnt];
  }
  if (gubMaxRoomNumber < 255)
    gubMaxRoomNumber++;

  // ATE; Memset this array!
  if (0) {
    // for debugging purposes
    memset(gubWorldRoomInfo, 0, sizeof(gubWorldRoomInfo));
  }

  memset(gubWorldRoomHidden, TRUE, sizeof(gubWorldRoomHidden));

  SetRelativeStartAndEndPercentage(0, 59, 61, "Loading items...");
  RenderProgressBar(0, 100);

  if (uiFlags & MAP_WORLDITEMS_SAVED) {
    // Load out item information
    gfLoadPitsWithoutArming = TRUE;
    LoadWorldItemsFromMap(addressof(pBuffer));
    gfLoadPitsWithoutArming = FALSE;
  }

  SetRelativeStartAndEndPercentage(0, 62, 85, "Loading lights...");
  RenderProgressBar(0, 0);

  if (uiFlags & MAP_AMBIENTLIGHTLEVEL_SAVED) {
    // Ambient light levels are only saved in underground levels
    LOADDATA(addressof(gfBasement), pBuffer, 1);
    LOADDATA(addressof(gfCaves), pBuffer, 1);
    LOADDATA(addressof(ubAmbientLightLevel), pBuffer, 1);
  } else {
    // We are above ground.
    gfBasement = FALSE;
    gfCaves = FALSE;
    if (!gfEditMode && guiCurrentScreen != Enum26.MAPUTILITY_SCREEN) {
      ubAmbientLightLevel = GetTimeOfDayAmbientLightLevel();
    } else {
      ubAmbientLightLevel = 4;
    }
  }
  if (uiFlags & MAP_WORLDLIGHTS_SAVED) {
    LoadMapLights(addressof(pBuffer));
  } else {
    // Set some default value for lighting
    SetDefaultWorldLightingColors();
  }
  LightSetBaseLevel(ubAmbientLightLevel);

  SetRelativeStartAndEndPercentage(0, 85, 86, "Loading map information...");
  RenderProgressBar(0, 0);

  LoadMapInformation(addressof(pBuffer));

  if (uiFlags & MAP_FULLSOLDIER_SAVED) {
    SetRelativeStartAndEndPercentage(0, 86, 87, "Loading placements...");
    RenderProgressBar(0, 0);
    LoadSoldiersFromMap(addressof(pBuffer));
  }
  if (uiFlags & MAP_EXITGRIDS_SAVED) {
    SetRelativeStartAndEndPercentage(0, 87, 88, "Loading exit grids...");
    RenderProgressBar(0, 0);
    LoadExitGrids(addressof(pBuffer));
  }
  if (uiFlags & MAP_DOORTABLE_SAVED) {
    SetRelativeStartAndEndPercentage(0, 89, 90, "Loading door tables...");
    RenderProgressBar(0, 0);
    LoadDoorTableFromMap(addressof(pBuffer));
  }
  if (uiFlags & MAP_EDGEPOINTS_SAVED) {
    SetRelativeStartAndEndPercentage(0, 90, 91, "Loading edgepoints...");
    RenderProgressBar(0, 0);
    if (!LoadMapEdgepoints(addressof(pBuffer)))
      fGenerateEdgePoints = TRUE; // only if the map had the older edgepoint system
  } else {
    fGenerateEdgePoints = TRUE;
  }
  if (uiFlags & MAP_NPCSCHEDULES_SAVED) {
    SetRelativeStartAndEndPercentage(0, 91, 92, "Loading NPC schedules...");
    RenderProgressBar(0, 0);
    LoadSchedules(addressof(pBuffer));
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
  gfForceLoadPlayers = FALSE;
  gfForceLoad = FALSE;

  // CHECK IF OUR SELECTED GUY IS GONE!
  if (gusSelectedSoldier != NO_SOLDIER) {
    if (MercPtrs[gusSelectedSoldier].value.bActive == FALSE) {
      gusSelectedSoldier = NO_SOLDIER;
    }
  }

  AdjustSoldierCreationStartValues();

  RenderProgressBar(0, 60);

  InvalidateWorldRedundency();

  // SAVE FILENAME
  strcpy(gzLastLoadedFile, puiFilename);
  LoadRadarScreenBitmap(puiFilename);

  RenderProgressBar(0, 80);

  gfWorldLoaded = TRUE;

  sprintf(gubFilename, puiFilename);

  // Remove this rather large chunk of memory from the system now!
  MemFree(pBufferHead);

  RenderProgressBar(0, 100);

  DequeueAllKeyBoardEvents();

  return TRUE;
}

//****************************************************************************************
//
//	Deletes everything then re-creates the world with simple ground tiles
//
//****************************************************************************************
function NewWorld(): BOOLEAN {
  let NewIndex: UINT16;
  let cnt: INT32;

  gusSelectedSoldier = gusOldSelectedSoldier = NO_SOLDIER;

  AdjustSoldierCreationStartValues();

  TrashWorld();

  // Create world randomly from tiles
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // Set land index
    NewIndex = (rand() % 10);
    AddLandToHead(cnt, NewIndex);
  }

  InitRoomDatabase();

  gfWorldLoaded = TRUE;

  return TRUE;
}

function TrashWorld(): void {
  let pMapTile: Pointer<MAP_ELEMENT>;
  let pLandNode: Pointer<LEVELNODE>;
  let pObjectNode: Pointer<LEVELNODE>;
  let pStructNode: Pointer<LEVELNODE>;
  let pShadowNode: Pointer<LEVELNODE>;
  let pMercNode: Pointer<LEVELNODE>;
  let pRoofNode: Pointer<LEVELNODE>;
  let pOnRoofNode: Pointer<LEVELNODE>;
  let pTopmostNode: Pointer<LEVELNODE>;
  //	STRUCTURE			*pStructureNode;
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

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

  for (pSoldier = MercPtrs[cnt]; cnt < MAX_NUM_SOLDIERS; pSoldier++, cnt++) {
    if (pSoldier.value.bActive) {
      if (pSoldier.value.bTeam == gbPlayerNum) {
        // Just delete levelnode
        pSoldier.value.pLevelNode = null;
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
    pMapTile = addressof(gpWorldLevelData[cnt]);

    // Free the memory associated with the map tile link lists
    pLandNode = pMapTile.value.pLandHead;
    while (pLandNode != null) {
      pMapTile.value.pLandHead = pLandNode.value.pNext;
      MemFree(pLandNode);
      pLandNode = pMapTile.value.pLandHead;
    }

    pObjectNode = pMapTile.value.pObjectHead;
    while (pObjectNode != null) {
      pMapTile.value.pObjectHead = pObjectNode.value.pNext;
      MemFree(pObjectNode);
      pObjectNode = pMapTile.value.pObjectHead;
    }

    pStructNode = pMapTile.value.pStructHead;
    while (pStructNode != null) {
      pMapTile.value.pStructHead = pStructNode.value.pNext;
      MemFree(pStructNode);
      pStructNode = pMapTile.value.pStructHead;
    }

    pShadowNode = pMapTile.value.pShadowHead;
    while (pShadowNode != null) {
      pMapTile.value.pShadowHead = pShadowNode.value.pNext;
      MemFree(pShadowNode);
      pShadowNode = pMapTile.value.pShadowHead;
    }

    pMercNode = pMapTile.value.pMercHead;
    while (pMercNode != null) {
      pMapTile.value.pMercHead = pMercNode.value.pNext;
      MemFree(pMercNode);
      pMercNode = pMapTile.value.pMercHead;
    }

    pRoofNode = pMapTile.value.pRoofHead;
    while (pRoofNode != null) {
      pMapTile.value.pRoofHead = pRoofNode.value.pNext;
      MemFree(pRoofNode);
      pRoofNode = pMapTile.value.pRoofHead;
    }

    pOnRoofNode = pMapTile.value.pOnRoofHead;
    while (pOnRoofNode != null) {
      pMapTile.value.pOnRoofHead = pOnRoofNode.value.pNext;
      MemFree(pOnRoofNode);
      pOnRoofNode = pMapTile.value.pOnRoofHead;
    }

    pTopmostNode = pMapTile.value.pTopmostHead;
    while (pTopmostNode != null) {
      pMapTile.value.pTopmostHead = pTopmostNode.value.pNext;
      MemFree(pTopmostNode);
      pTopmostNode = pMapTile.value.pTopmostHead;
    }

    while (pMapTile.value.pStructureHead != null) {
      if (DeleteStructureFromWorld(pMapTile.value.pStructureHead) == FALSE) {
        // ERROR!!!!!!
        break;
      }
    }
  }

  // Zero world
  memset(gpWorldLevelData, 0, WORLD_MAX * sizeof(MAP_ELEMENT));

  // Set some default flags
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    gpWorldLevelData[cnt].uiFlags |= MAPELEMENT_RECALCULATE_WIREFRAMES;
  }

  TrashDoorTable();
  TrashMapEdgepoints();
  TrashDoorStatusArray();

  // gfBlitBattleSectorLocator = FALSE;
  gfWorldLoaded = FALSE;
  sprintf(gubFilename, "none");
}

function TrashMapTile(MapTile: INT16): void {
  let pMapTile: Pointer<MAP_ELEMENT>;
  let pLandNode: Pointer<LEVELNODE>;
  let pObjectNode: Pointer<LEVELNODE>;
  let pStructNode: Pointer<LEVELNODE>;
  let pShadowNode: Pointer<LEVELNODE>;
  let pMercNode: Pointer<LEVELNODE>;
  let pRoofNode: Pointer<LEVELNODE>;
  let pOnRoofNode: Pointer<LEVELNODE>;
  let pTopmostNode: Pointer<LEVELNODE>;

  pMapTile = addressof(gpWorldLevelData[MapTile]);

  // Free the memory associated with the map tile link lists
  pLandNode = pMapTile.value.pLandHead;
  while (pLandNode != null) {
    pMapTile.value.pLandHead = pLandNode.value.pNext;
    MemFree(pLandNode);
    pLandNode = pMapTile.value.pLandHead;
  }
  pMapTile.value.pLandHead = pMapTile.value.pLandStart = null;

  pObjectNode = pMapTile.value.pObjectHead;
  while (pObjectNode != null) {
    pMapTile.value.pObjectHead = pObjectNode.value.pNext;
    MemFree(pObjectNode);
    pObjectNode = pMapTile.value.pObjectHead;
  }
  pMapTile.value.pObjectHead = null;

  pStructNode = pMapTile.value.pStructHead;
  while (pStructNode != null) {
    pMapTile.value.pStructHead = pStructNode.value.pNext;
    MemFree(pStructNode);
    pStructNode = pMapTile.value.pStructHead;
  }
  pMapTile.value.pStructHead = null;

  pShadowNode = pMapTile.value.pShadowHead;
  while (pShadowNode != null) {
    pMapTile.value.pShadowHead = pShadowNode.value.pNext;
    MemFree(pShadowNode);
    pShadowNode = pMapTile.value.pShadowHead;
  }
  pMapTile.value.pShadowHead = null;

  pMercNode = pMapTile.value.pMercHead;
  while (pMercNode != null) {
    pMapTile.value.pMercHead = pMercNode.value.pNext;
    MemFree(pMercNode);
    pMercNode = pMapTile.value.pMercHead;
  }
  pMapTile.value.pMercHead = null;

  pRoofNode = pMapTile.value.pRoofHead;
  while (pRoofNode != null) {
    pMapTile.value.pRoofHead = pRoofNode.value.pNext;
    MemFree(pRoofNode);
    pRoofNode = pMapTile.value.pRoofHead;
  }
  pMapTile.value.pRoofHead = null;

  pOnRoofNode = pMapTile.value.pOnRoofHead;
  while (pOnRoofNode != null) {
    pMapTile.value.pOnRoofHead = pOnRoofNode.value.pNext;
    MemFree(pOnRoofNode);
    pOnRoofNode = pMapTile.value.pOnRoofHead;
  }
  pMapTile.value.pOnRoofHead = null;

  pTopmostNode = pMapTile.value.pTopmostHead;
  while (pTopmostNode != null) {
    pMapTile.value.pTopmostHead = pTopmostNode.value.pNext;
    MemFree(pTopmostNode);
    pTopmostNode = pMapTile.value.pTopmostHead;
  }
  pMapTile.value.pTopmostHead = null;

  while (pMapTile.value.pStructureHead != null) {
    DeleteStructureFromWorld(pMapTile.value.pStructureHead);
  }
  pMapTile.value.pStructureHead = pMapTile.value.pStructureTail = null;
}

function LoadMapTileset(iTilesetID: INT32): BOOLEAN {
  if (iTilesetID >= Enum316.NUM_TILESETS) {
    return FALSE;
  }

  // Init tile surface used values
  memset(gbNewTileSurfaceLoaded, 0, sizeof(gbNewTileSurfaceLoaded));

  if (iTilesetID == giCurrentTilesetID) {
    return TRUE;
  }

  // Get free memory value nere
  gSurfaceMemUsage = guiMemTotal;

  // LOAD SURFACES
  CHECKF(LoadTileSurfaces(addressof(gTilesets[iTilesetID].TileSurfaceFilenames[0]), iTilesetID) != FALSE);

  // SET TERRAIN COSTS
  if (gTilesets[iTilesetID].MovementCostFnc != null) {
    gTilesets[iTilesetID].MovementCostFnc();
  } else {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Tileset %d has no callback function for movement costs. Using default.", iTilesetID));
    SetTilesetOneTerrainValues();
  }

  // RESET TILE DATABASE
  DeallocateTileDatabase();

  CreateTileDatabase();

  // SET GLOBAL ID FOR TILESET ( FOR SAVING! )
  giCurrentTilesetID = iTilesetID;

  return TRUE;
}

function SaveMapTileset(iTilesetID: INT32): BOOLEAN {
  //	FILE *hTSet;
  let hTSet: HWFILE;
  let zTilesetName: char[] /* [65] */;
  let cnt: int;
  let uiBytesWritten: UINT32;

  // Are we trying to save the default tileset?
  if (iTilesetID == 0)
    return TRUE;

  sprintf(zTilesetName, "TSET%04d.SET", iTilesetID);

  // Open file
  hTSet = FileOpen(zTilesetName, FILE_ACCESS_WRITE | FILE_CREATE_ALWAYS, FALSE);

  if (!hTSet) {
    return FALSE;
  }

  // Save current tile set in map file.
  for (cnt = 0; cnt < Enum313.NUMBEROFTILETYPES; cnt++)
    FileWrite(hTSet, TileSurfaceFilenames[cnt], 65, addressof(uiBytesWritten));
  FileClose(hTSet);

  return TRUE;
}

function SetLoadOverrideParams(fForceLoad: BOOLEAN, fForceFile: BOOLEAN, zLoadName: Pointer<CHAR8>): void {
  gfForceLoadPlayers = fForceLoad;
  gfForceLoad = fForceFile;

  if (zLoadName != null) {
    strcpy(gzForceLoadFile, zLoadName);
  }
}

function AddWireFrame(sGridNo: INT16, usIndex: UINT16, fForced: BOOLEAN): void {
  let pTopmost: Pointer<LEVELNODE>;
  let pTopmostTail: Pointer<LEVELNODE>;

  pTopmost = gpWorldLevelData[sGridNo].pTopmostHead;

  while (pTopmost != null) {
    // Check if one of the samer type exists!
    if (pTopmost.value.usIndex == usIndex) {
      return;
    }
    pTopmost = pTopmost.value.pNext;
  }

  pTopmostTail = AddTopmostToTail(sGridNo, usIndex);

  if (fForced) {
    pTopmostTail.value.uiFlags |= LEVELNODE_WIREFRAME;
  }
}

function GetWireframeGraphicNumToUseForWall(sGridNo: INT16, pStructure: Pointer<STRUCTURE>): UINT16 {
  let pNode: Pointer<LEVELNODE> = null;
  let ubWallOrientation: UINT8;
  let usValue: UINT16 = 0;
  let usSubIndex: UINT16;
  let pBaseStructure: Pointer<STRUCTURE>;

  ubWallOrientation = pStructure.value.ubWallOrientation;

  pBaseStructure = FindBaseStructure(pStructure);

  if (pBaseStructure) {
    // Find levelnode...
    pNode = gpWorldLevelData[sGridNo].pStructHead;
    while (pNode != null) {
      if (pNode.value.pStructureData == pBaseStructure) {
        break;
      }
      pNode = pNode.value.pNext;
    }

    if (pNode != null) {
      // Get Subindex for this wall...
      GetSubIndexFromTileIndex(pNode.value.usIndex, addressof(usSubIndex));

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

function CalculateWorldWireFrameTiles(fForce: BOOLEAN): void {
  let cnt: INT32;
  let pStructure: Pointer<STRUCTURE>;
  let sGridNo: INT16;
  let ubWallOrientation: UINT8;
  let bHiddenVal: INT8;
  let bNumWallsSameGridNo: INT8;
  let usWireFrameIndex: UINT16;

  // Create world randomly from tiles
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (gpWorldLevelData[cnt].uiFlags & MAPELEMENT_RECALCULATE_WIREFRAMES || fForce) {
      if (cnt == 8377) {
        let i: int = 0;
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
        if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
          // ATE: need this additional check here for hidden doors!
          if (pStructure.value.fFlags & STRUCTURE_OPENABLE) {
            // Does the gridno we are over have a non-visible tile?
            // Based on orientation
            ubWallOrientation = pStructure.value.ubWallOrientation;

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
          if (pStructure.value.fFlags & STRUCTURE_WALLNWINDOW) {
            // Does the gridno we are over have a non-visible tile?
            // Based on orientation
            ubWallOrientation = pStructure.value.ubWallOrientation;

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
          if (pStructure.value.fFlags & STRUCTURE_WALLSTUFF) {
            // Does the gridno we are over have a non-visible tile?
            // Based on orientation
            ubWallOrientation = pStructure.value.ubWallOrientation;

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

        pStructure = pStructure.value.pNext;
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
  let pTopmost: Pointer<LEVELNODE>;
  let pNewTopmost: Pointer<LEVELNODE>;
  let pTileElement: Pointer<TILE_ELEMENT>;

  pTopmost = gpWorldLevelData[sGridNo].pTopmostHead;

  while (pTopmost != null) {
    pNewTopmost = pTopmost.value.pNext;

    if (pTopmost.value.usIndex < Enum312.NUMBEROFTILES) {
      pTileElement = addressof(gTileDatabase[pTopmost.value.usIndex]);

      if (pTileElement.value.fType == Enum313.WIREFRAMES) {
        RemoveTopmost(sGridNo, pTopmost.value.usIndex);
      }
    }

    pTopmost = pNewTopmost;
  }
}

function IsHiddenTileMarkerThere(sGridNo: INT16): INT8 {
  let pStructure: Pointer<STRUCTURE>;

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

function ReloadTileset(ubID: UINT8): void {
  let aFilename: CHAR8[] /* [255] */;
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
  sprintf(aFilename, "MAPS\\%s", TEMP_FILE_FOR_TILESET_CHANGE);

  FileDelete(aFilename);
}

function SaveMapLights(hfile: HWFILE): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let LColors: SGPPaletteEntry[] /* [3] */;
  let ubNumColors: UINT8;
  let fSoldierLight: BOOLEAN;
  let usNumLights: UINT16 = 0;
  let cnt: UINT16;
  let cnt2: UINT16;
  let ubStrLen: UINT8;
  let uiBytesWritten: UINT32;

  ubNumColors = LightGetColors(LColors);

  // Save the current light colors!
  FileWrite(hfile, addressof(ubNumColors), 1, addressof(uiBytesWritten));
  FileWrite(hfile, LColors, sizeof(SGPPaletteEntry) * ubNumColors, addressof(uiBytesWritten));

  // count number of non-merc lights.
  for (cnt = 0; cnt < MAX_LIGHT_SPRITES; cnt++) {
    if (LightSprites[cnt].uiFlags & LIGHT_SPR_ACTIVE) {
      // found an active light.  Check to make sure it doesn't belong to a merc.
      fSoldierLight = FALSE;
      for (cnt2 = 0; cnt2 < MAX_NUM_SOLDIERS && !fSoldierLight; cnt2++) {
        if (GetSoldier(addressof(pSoldier), cnt2)) {
          if (pSoldier.value.iLight == cnt)
            fSoldierLight = TRUE;
        }
      }
      if (!fSoldierLight)
        usNumLights++;
    }
  }

  // save the number of lights.
  FileWrite(hfile, addressof(usNumLights), 2, addressof(uiBytesWritten));

  for (cnt = 0; cnt < MAX_LIGHT_SPRITES; cnt++) {
    if (LightSprites[cnt].uiFlags & LIGHT_SPR_ACTIVE) {
      // found an active light.  Check to make sure it doesn't belong to a merc.
      fSoldierLight = FALSE;
      for (cnt2 = 0; cnt2 < MAX_NUM_SOLDIERS && !fSoldierLight; cnt2++) {
        if (GetSoldier(addressof(pSoldier), cnt2)) {
          if (pSoldier.value.iLight == cnt)
            fSoldierLight = TRUE;
        }
      }
      if (!fSoldierLight) {
        // save the light
        FileWrite(hfile, addressof(LightSprites[cnt]), sizeof(LIGHT_SPRITE), addressof(uiBytesWritten));

        ubStrLen = strlen(pLightNames[LightSprites[cnt].iTemplate]) + 1;
        FileWrite(hfile, addressof(ubStrLen), 1, addressof(uiBytesWritten));
        FileWrite(hfile, pLightNames[LightSprites[cnt].iTemplate], ubStrLen, addressof(uiBytesWritten));
      }
    }
  }
}

function LoadMapLights(hBuffer: Pointer<Pointer<INT8>>): void {
  let LColors: SGPPaletteEntry[] /* [3] */;
  let ubNumColors: UINT8;
  let usNumLights: UINT16;
  let cnt: INT32;
  let str: INT8[] /* [30] */;
  let ubStrLen: UINT8;
  let TmpLight: LIGHT_SPRITE;
  let iLSprite: INT32;
  let uiHour: UINT32;
  let fPrimeTime: BOOLEAN = FALSE;
  let fNightTime: BOOLEAN = FALSE;

  // reset the lighting system, so that any current lights are toasted.
  LightReset();

  // read in the light colors!
  LOADDATA(addressof(ubNumColors), hBuffer.value, 1);
  LOADDATA(LColors, hBuffer.value, sizeof(SGPPaletteEntry) * ubNumColors);

  LOADDATA(addressof(usNumLights), hBuffer.value, 2);

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
      fNightTime = TRUE;
    }
    if (uiHour >= PRIME_TIME_LIGHT_START_HOUR) {
      fPrimeTime = TRUE;
    }
  }

  for (cnt = 0; cnt < usNumLights; cnt++) {
    LOADDATA(addressof(TmpLight), hBuffer.value, sizeof(LIGHT_SPRITE));
    LOADDATA(addressof(ubStrLen), hBuffer.value, 1);

    if (ubStrLen) {
      LOADDATA(str, hBuffer.value, ubStrLen);
    }

    str[ubStrLen] = 0;

    iLSprite = LightSpriteCreate(str, TmpLight.uiLightType);
    // if this fails, then we will ignore the light.
    // ATE: Don't add ANY lights of mapscreen util is on
    if (iLSprite != -1 && guiCurrentScreen != Enum26.MAPUTILITY_SCREEN) {
      if (!gfCaves || gfEditMode) {
        if (gfEditMode || TmpLight.uiFlags & LIGHT_PRIMETIME && fPrimeTime || TmpLight.uiFlags & LIGHT_NIGHTTIME && fNightTime || !(TmpLight.uiFlags & (LIGHT_PRIMETIME | LIGHT_NIGHTTIME))) {
          // power only valid lights.
          LightSpritePower(iLSprite, TRUE);
        }
      }
      LightSpritePosition(iLSprite, TmpLight.iX, TmpLight.iY);
      if (TmpLight.uiFlags & LIGHT_PRIMETIME)
        LightSprites[iLSprite].uiFlags |= LIGHT_PRIMETIME;
      else if (TmpLight.uiFlags & LIGHT_NIGHTTIME)
        LightSprites[iLSprite].uiFlags |= LIGHT_NIGHTTIME;
    }
  }
}

function IsRoofVisibleForWireframe(sMapPos: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  if (!gfBasement) {
    pStructure = FindStructure(sMapPos, STRUCTURE_ROOF);

    if (pStructure != null) {
      return TRUE;
    }
  } else {
    // if ( InARoom( sMapPos, &ubRoom ) )
    {
      // if ( !( gpWorldLevelData[ sMapPos ].uiFlags & MAPELEMENT_REVEALED ) )
      { return (TRUE); }
    }
  }

  return FALSE;
}
