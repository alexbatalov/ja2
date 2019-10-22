// THIS FILE CONTAINS DEFINITIONS FOR TILESET FILES

let gTilesets: TILESET[] /* [NUM_TILESETS] */;

function InitEngineTilesets(): void {
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
  hfile = FileOpen("BINARYDATA\\JA2SET.DAT", FILE_ACCESS_READ, FALSE);
  if (!hfile) {
    SET_ERROR("Cannot open tileset data file");
    return;
  }

  // READ # TILESETS and compare
  //	fread( &ubNumSets, sizeof( ubNumSets ), 1, hfile );
  FileRead(hfile, &ubNumSets, sizeof(ubNumSets), &uiNumBytesRead);
  // CHECK
  if (ubNumSets != NUM_TILESETS) {
    // Report error
    SET_ERROR("Number of tilesets in code does not match data file");
    return;
  }

  // READ #files
  //	fread( &uiNumFiles, sizeof( uiNumFiles ), 1, hfile );
  FileRead(hfile, &uiNumFiles, sizeof(uiNumFiles), &uiNumBytesRead);

  // COMPARE
  if (uiNumFiles != NUMBEROFTILETYPES) {
    // Report error
    SET_ERROR("Number of tilesets slots in code does not match data file");
    return;
  }

  // Loop through each tileset, load name then files
  for (cnt = 0; cnt < NUM_TILESETS; cnt++) {
    // Read name
    //		fread( &zName, sizeof( zName ), 1, hfile );
    FileRead(hfile, &zName, sizeof(zName), &uiNumBytesRead);

    // Read ambience value
    //		fread( &(gTilesets[ cnt ].ubAmbientID), sizeof( UINT8), 1, hfile );
    FileRead(hfile, &(gTilesets[cnt].ubAmbientID), sizeof(UINT8), &uiNumBytesRead);

    // Set into tileset
    swprintf(gTilesets[cnt].zName, "%S", zName);

    // Loop for files
    for (cnt2 = 0; cnt2 < uiNumFiles; cnt2++) {
      // Read file name
      //			fread( &zName, sizeof( zName ), 1, hfile );
      FileRead(hfile, &zName, sizeof(zName), &uiNumBytesRead);

      // Set into database
      strcpy(gTilesets[cnt].TileSurfaceFilenames[cnt2], zName);
    }
  }

  //	fclose( hfile );
  FileClose(hfile);

  // SET CALLBACK FUNTIONS!!!!!!!!!!!!!
  gTilesets[CAVES_1].MovementCostFnc = SetTilesetTwoTerrainValues;
  gTilesets[AIRSTRIP].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[DEAD_AIRSTRIP].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[TEMP_14].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[TEMP_18].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[TEMP_19].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[TEMP_26].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[TEMP_27].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[TEMP_28].MovementCostFnc = SetTilesetThreeTerrainValues;
  gTilesets[TEMP_29].MovementCostFnc = SetTilesetThreeTerrainValues;

  gTilesets[TROPICAL_1].MovementCostFnc = SetTilesetFourTerrainValues;
  gTilesets[TEMP_20].MovementCostFnc = SetTilesetFourTerrainValues;
}

function SetTilesetOneTerrainValues(): void {
  // FIRST TEXUTRES
  gTileSurfaceArray[FIRSTTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[SECONDTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[THIRDTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FOURTHTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FIFTHTEXTURE].value.ubTerrainID = LOW_GRASS;
  gTileSurfaceArray[SIXTHTEXTURE].value.ubTerrainID = LOW_GRASS;
  gTileSurfaceArray[SEVENTHTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[REGWATERTEXTURE].value.ubTerrainID = LOW_WATER;
  gTileSurfaceArray[DEEPWATERTEXTURE].value.ubTerrainID = DEEP_WATER;

  // NOW ROADS
  gTileSurfaceArray[FIRSTROAD].value.ubTerrainID = DIRT_ROAD;
  gTileSurfaceArray[ROADPIECES].value.ubTerrainID = DIRT_ROAD;

  // NOW FLOORS
  gTileSurfaceArray[FIRSTFLOOR].value.ubTerrainID = FLAT_FLOOR;
  gTileSurfaceArray[SECONDFLOOR].value.ubTerrainID = FLAT_FLOOR;
  gTileSurfaceArray[THIRDFLOOR].value.ubTerrainID = FLAT_FLOOR;
  gTileSurfaceArray[FOURTHFLOOR].value.ubTerrainID = FLAT_FLOOR;

  // NOW ANY TERRAIN MODIFYING DEBRIS
}

function SetTilesetTwoTerrainValues(): void {
  // FIRST TEXUTRES
  gTileSurfaceArray[FIRSTTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[SECONDTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[THIRDTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FOURTHTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FIFTHTEXTURE].value.ubTerrainID = LOW_GRASS;
  gTileSurfaceArray[SIXTHTEXTURE].value.ubTerrainID = LOW_GRASS;
  gTileSurfaceArray[SEVENTHTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[REGWATERTEXTURE].value.ubTerrainID = LOW_WATER;
  gTileSurfaceArray[DEEPWATERTEXTURE].value.ubTerrainID = DEEP_WATER;

  // NOW ROADS
  gTileSurfaceArray[FIRSTROAD].value.ubTerrainID = DIRT_ROAD;
  gTileSurfaceArray[ROADPIECES].value.ubTerrainID = DIRT_ROAD;

  // NOW FLOORS
  gTileSurfaceArray[FIRSTFLOOR].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[SECONDFLOOR].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[THIRDFLOOR].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FOURTHFLOOR].value.ubTerrainID = FLAT_GROUND;
}

function SetTilesetThreeTerrainValues(): void {
  // DIFFERENCE FROM #1 IS THAT ROADS ARE PAVED

  // FIRST TEXUTRES
  gTileSurfaceArray[FIRSTTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[SECONDTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[THIRDTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FOURTHTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FIFTHTEXTURE].value.ubTerrainID = LOW_GRASS;
  gTileSurfaceArray[SIXTHTEXTURE].value.ubTerrainID = LOW_GRASS;
  gTileSurfaceArray[SEVENTHTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[REGWATERTEXTURE].value.ubTerrainID = LOW_WATER;
  gTileSurfaceArray[DEEPWATERTEXTURE].value.ubTerrainID = DEEP_WATER;

  // NOW ROADS
  gTileSurfaceArray[FIRSTROAD].value.ubTerrainID = PAVED_ROAD;
  gTileSurfaceArray[ROADPIECES].value.ubTerrainID = PAVED_ROAD;

  // NOW FLOORS
  gTileSurfaceArray[FIRSTFLOOR].value.ubTerrainID = FLAT_FLOOR;
  gTileSurfaceArray[SECONDFLOOR].value.ubTerrainID = FLAT_FLOOR;
  gTileSurfaceArray[THIRDFLOOR].value.ubTerrainID = FLAT_FLOOR;
  gTileSurfaceArray[FOURTHFLOOR].value.ubTerrainID = FLAT_FLOOR;

  // NOW ANY TERRAIN MODIFYING DEBRIS
}

function SetTilesetFourTerrainValues(): void {
  // DIFFERENCE FROM #1 IS THAT FLOOR2 IS NOT FLAT_FLOOR BUT FLAT_GROUND

  // FIRST TEXUTRES
  gTileSurfaceArray[FIRSTTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[SECONDTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[THIRDTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FOURTHTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[FIFTHTEXTURE].value.ubTerrainID = LOW_GRASS;
  gTileSurfaceArray[SIXTHTEXTURE].value.ubTerrainID = LOW_GRASS;
  gTileSurfaceArray[SEVENTHTEXTURE].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[REGWATERTEXTURE].value.ubTerrainID = LOW_WATER;
  gTileSurfaceArray[DEEPWATERTEXTURE].value.ubTerrainID = DEEP_WATER;

  // NOW ROADS
  gTileSurfaceArray[FIRSTROAD].value.ubTerrainID = DIRT_ROAD;
  gTileSurfaceArray[ROADPIECES].value.ubTerrainID = DIRT_ROAD;

  // NOW FLOORS
  gTileSurfaceArray[FIRSTFLOOR].value.ubTerrainID = FLAT_FLOOR;
  gTileSurfaceArray[SECONDFLOOR].value.ubTerrainID = FLAT_GROUND;
  gTileSurfaceArray[THIRDFLOOR].value.ubTerrainID = FLAT_FLOOR;
  gTileSurfaceArray[FOURTHFLOOR].value.ubTerrainID = FLAT_FLOOR;

  // NOW ANY TERRAIN MODIFYING DEBRIS
}
