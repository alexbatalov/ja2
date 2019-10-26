// THIS FILE CONTAINS DEFINITIONS FOR TILESET FILES

export let gTilesets: TILESET[] /* [NUM_TILESETS] */;

export function InitEngineTilesets(): void {
  let ubNumSets: UINT8;
  let cnt: UINT32;
  let cnt2: UINT32;
  let uiNumFiles: UINT32;
  //	FILE					*hfile;
  let hfile: HWFILE;
  let zName: CHAR8[] /* [32] */;
  let uiNumBytesRead: UINT32;

  // OPEN FILE
  //	hfile = fopen( "BINARYDATA\\JA2SET.DAT", "rb" );
  hfile = FileOpen("BINARYDATA\\JA2SET.DAT", FILE_ACCESS_READ, false);
  if (!hfile) {
    SET_ERROR("Cannot open tileset data file");
    return;
  }

  // READ # TILESETS and compare
  //	fread( &ubNumSets, sizeof( ubNumSets ), 1, hfile );
  FileRead(hfile, addressof(ubNumSets), sizeof(ubNumSets), addressof(uiNumBytesRead));
  // CHECK
  if (ubNumSets != Enum316.NUM_TILESETS) {
    // Report error
    SET_ERROR("Number of tilesets in code does not match data file");
    return;
  }

  // READ #files
  //	fread( &uiNumFiles, sizeof( uiNumFiles ), 1, hfile );
  FileRead(hfile, addressof(uiNumFiles), sizeof(uiNumFiles), addressof(uiNumBytesRead));

  // COMPARE
  if (uiNumFiles != Enum313.NUMBEROFTILETYPES) {
    // Report error
    SET_ERROR("Number of tilesets slots in code does not match data file");
    return;
  }

  // Loop through each tileset, load name then files
  for (cnt = 0; cnt < Enum316.NUM_TILESETS; cnt++) {
    // Read name
    //		fread( &zName, sizeof( zName ), 1, hfile );
    FileRead(hfile, addressof(zName), sizeof(zName), addressof(uiNumBytesRead));

    // Read ambience value
    //		fread( &(gTilesets[ cnt ].ubAmbientID), sizeof( UINT8), 1, hfile );
    FileRead(hfile, addressof(gTilesets[cnt].ubAmbientID), sizeof(UINT8), addressof(uiNumBytesRead));

    // Set into tileset
    swprintf(gTilesets[cnt].zName, "%S", zName);

    // Loop for files
    for (cnt2 = 0; cnt2 < uiNumFiles; cnt2++) {
      // Read file name
      //			fread( &zName, sizeof( zName ), 1, hfile );
      FileRead(hfile, addressof(zName), sizeof(zName), addressof(uiNumBytesRead));

      // Set into database
      strcpy(gTilesets[cnt].TileSurfaceFilenames[cnt2], zName);
    }
  }

  //	fclose( hfile );
  FileClose(hfile);

  // SET CALLBACK FUNTIONS!!!!!!!!!!!!!
  gTilesets[Enum316.CAVES_1].MovementCostFnc = SetTilesetTwoTerrainValues;
  gTilesets[Enum316.AIRSTRIP].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[Enum316.DEAD_AIRSTRIP].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[Enum316.TEMP_14].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[Enum316.TEMP_18].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[Enum316.TEMP_19].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[Enum316.TEMP_26].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[Enum316.TEMP_27].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[Enum316.TEMP_28].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[Enum316.TEMP_29].MovementCostFnc = SetTilesetThreeTerrainValues;

  gTilesets[Enum316.TROPICAL_1].MovementCostFnc = SetTilesetFourTerrainValues;
  gTilesets[Enum316.TEMP_20].MovementCostFnc = SetTilesetFourTerrainValues;
}

export function SetTilesetOneTerrainValues(): void {
  // FIRST TEXUTRES
  gTileSurfaceArray[Enum313.FIRSTTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.SECONDTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.THIRDTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FOURTHTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FIFTHTEXTURE].value.ubTerrainID = Enum315.LOW_GRASS;
  gTileSurfaceArray[Enum313.SIXTHTEXTURE].value.ubTerrainID = Enum315.LOW_GRASS;
  gTileSurfaceArray[Enum313.SEVENTHTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.REGWATERTEXTURE].value.ubTerrainID = Enum315.LOW_WATER;
  gTileSurfaceArray[Enum313.DEEPWATERTEXTURE].value.ubTerrainID = Enum315.DEEP_WATER;

  // NOW ROADS
  gTileSurfaceArray[Enum313.FIRSTROAD].value.ubTerrainID = Enum315.DIRT_ROAD;
  gTileSurfaceArray[Enum313.ROADPIECES].value.ubTerrainID = Enum315.DIRT_ROAD;

  // NOW FLOORS
  gTileSurfaceArray[Enum313.FIRSTFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;
  gTileSurfaceArray[Enum313.SECONDFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;
  gTileSurfaceArray[Enum313.THIRDFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;
  gTileSurfaceArray[Enum313.FOURTHFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;

  // NOW ANY TERRAIN MODIFYING DEBRIS
}

function SetTilesetTwoTerrainValues(): void {
  // FIRST TEXUTRES
  gTileSurfaceArray[Enum313.FIRSTTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.SECONDTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.THIRDTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FOURTHTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FIFTHTEXTURE].value.ubTerrainID = Enum315.LOW_GRASS;
  gTileSurfaceArray[Enum313.SIXTHTEXTURE].value.ubTerrainID = Enum315.LOW_GRASS;
  gTileSurfaceArray[Enum313.SEVENTHTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.REGWATERTEXTURE].value.ubTerrainID = Enum315.LOW_WATER;
  gTileSurfaceArray[Enum313.DEEPWATERTEXTURE].value.ubTerrainID = Enum315.DEEP_WATER;

  // NOW ROADS
  gTileSurfaceArray[Enum313.FIRSTROAD].value.ubTerrainID = Enum315.DIRT_ROAD;
  gTileSurfaceArray[Enum313.ROADPIECES].value.ubTerrainID = Enum315.DIRT_ROAD;

  // NOW FLOORS
  gTileSurfaceArray[Enum313.FIRSTFLOOR].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.SECONDFLOOR].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.THIRDFLOOR].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FOURTHFLOOR].value.ubTerrainID = Enum315.FLAT_GROUND;
}

function SetTilesetThreeTerrainValues(): void {
  // DIFFERENCE FROM #1 IS THAT ROADS ARE PAVED

  // FIRST TEXUTRES
  gTileSurfaceArray[Enum313.FIRSTTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.SECONDTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.THIRDTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FOURTHTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FIFTHTEXTURE].value.ubTerrainID = Enum315.LOW_GRASS;
  gTileSurfaceArray[Enum313.SIXTHTEXTURE].value.ubTerrainID = Enum315.LOW_GRASS;
  gTileSurfaceArray[Enum313.SEVENTHTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.REGWATERTEXTURE].value.ubTerrainID = Enum315.LOW_WATER;
  gTileSurfaceArray[Enum313.DEEPWATERTEXTURE].value.ubTerrainID = Enum315.DEEP_WATER;

  // NOW ROADS
  gTileSurfaceArray[Enum313.FIRSTROAD].value.ubTerrainID = Enum315.PAVED_ROAD;
  gTileSurfaceArray[Enum313.ROADPIECES].value.ubTerrainID = Enum315.PAVED_ROAD;

  // NOW FLOORS
  gTileSurfaceArray[Enum313.FIRSTFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;
  gTileSurfaceArray[Enum313.SECONDFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;
  gTileSurfaceArray[Enum313.THIRDFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;
  gTileSurfaceArray[Enum313.FOURTHFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;

  // NOW ANY TERRAIN MODIFYING DEBRIS
}

function SetTilesetFourTerrainValues(): void {
  // DIFFERENCE FROM #1 IS THAT FLOOR2 IS NOT FLAT_FLOOR BUT FLAT_GROUND

  // FIRST TEXUTRES
  gTileSurfaceArray[Enum313.FIRSTTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.SECONDTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.THIRDTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FOURTHTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.FIFTHTEXTURE].value.ubTerrainID = Enum315.LOW_GRASS;
  gTileSurfaceArray[Enum313.SIXTHTEXTURE].value.ubTerrainID = Enum315.LOW_GRASS;
  gTileSurfaceArray[Enum313.SEVENTHTEXTURE].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.REGWATERTEXTURE].value.ubTerrainID = Enum315.LOW_WATER;
  gTileSurfaceArray[Enum313.DEEPWATERTEXTURE].value.ubTerrainID = Enum315.DEEP_WATER;

  // NOW ROADS
  gTileSurfaceArray[Enum313.FIRSTROAD].value.ubTerrainID = Enum315.DIRT_ROAD;
  gTileSurfaceArray[Enum313.ROADPIECES].value.ubTerrainID = Enum315.DIRT_ROAD;

  // NOW FLOORS
  gTileSurfaceArray[Enum313.FIRSTFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;
  gTileSurfaceArray[Enum313.SECONDFLOOR].value.ubTerrainID = Enum315.FLAT_GROUND;
  gTileSurfaceArray[Enum313.THIRDFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;
  gTileSurfaceArray[Enum313.FOURTHFLOOR].value.ubTerrainID = Enum315.FLAT_FLOOR;

  // NOW ANY TERRAIN MODIFYING DEBRIS
}
