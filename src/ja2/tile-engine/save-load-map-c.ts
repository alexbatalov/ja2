const NUM_REVEALED_BYTES = 3200;

let gfApplyChangesToTempFile: BOOLEAN = FALSE;

//  There are 3200 bytes, and each bit represents the revelaed status.
//	3200 bytes * 8 bits = 25600 map elements
let gpRevealedMap: Pointer<UINT8>;

// ppp

function ApplyMapChangesToMapTempFile(fAddToMap: BOOLEAN): void {
  gfApplyChangesToTempFile = fAddToMap;
}

function SaveModifiedMapStructToMapTempFile(pMap: Pointer<MODIFY_MAP>, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): BOOLEAN {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
  if (hFile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // Move to the end of the file
  FileSeek(hFile, 0, FILE_SEEK_FROM_END);

  FileWrite(hFile, pMap, sizeof(MODIFY_MAP), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(MODIFY_MAP)) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return FALSE;
  }

  FileClose(hFile);

  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS);

  return TRUE;
}

function LoadAllMapChangesFromMapTempFileAndApplyThem(): BOOLEAN {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let uiFileSize: UINT32;
  let uiNumberOfElements: UINT32;
  let uiNumberOfElementsSavedBackToFile: UINT32 = 0; // added becuase if no files get saved back to disk, the flag needs to be erased
  let cnt: UINT32;
  let pMap: Pointer<MODIFY_MAP>;
  let pTempArrayOfMaps: Pointer<MODIFY_MAP> = NULL;
  let usIndex: UINT16;

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return TRUE;
  }

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hFile == 0) {
    // Error opening map modification file,
    return FALSE;
  }

  // Get the size of the file
  uiFileSize = FileGetSize(hFile);

  // Allocate memory for the buffer
  pTempArrayOfMaps = MemAlloc(uiFileSize);
  if (pTempArrayOfMaps == NULL) {
    Assert(0);
    return TRUE;
  }

  // Read the map temp file into a buffer
  FileRead(hFile, pTempArrayOfMaps, uiFileSize, &uiNumBytesRead);
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return FALSE;
  }

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  uiNumberOfElements = uiFileSize / sizeof(MODIFY_MAP);

  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = &pTempArrayOfMaps[cnt];

    // Switch on the type that should either be added or removed from the map
    switch (pMap->ubType) {
      // If we are adding to the map
      case SLM_LAND:
        break;
      case SLM_OBJECT:
        GetTileIndexFromTypeSubIndex(pMap->usImageType, pMap->usSubImageIndex, &usIndex);

        AddObjectFromMapTempFileToMap(pMap->usGridNo, usIndex);

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;

        break;
      case SLM_STRUCT:
        GetTileIndexFromTypeSubIndex(pMap->usImageType, pMap->usSubImageIndex, &usIndex);

        AddStructFromMapTempFileToMap(pMap->usGridNo, usIndex);

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;
        break;
      case SLM_SHADOW:
        break;
      case SLM_MERC:
        break;
      case SLM_ROOF:
        break;
      case SLM_ONROOF:
        break;
      case SLM_TOPMOST:
        break;

      // Remove objects out of the world
      case SLM_REMOVE_LAND:
        break;
      case SLM_REMOVE_OBJECT:
        break;
      case SLM_REMOVE_STRUCT:

        // ATE: OK, dor doors, the usIndex can be varied, opened, closed, etc
        // we MUSTR delete ANY door type on this gridno
        // Since we can only have one door per gridno, we're safe to do so.....
        if (pMap->usImageType >= FIRSTDOOR && pMap->usImageType <= FOURTHDOOR) {
          // Remove ANY door...
          RemoveAllStructsOfTypeRange(pMap->usGridNo, FIRSTDOOR, FOURTHDOOR);
        } else {
          GetTileIndexFromTypeSubIndex(pMap->usImageType, pMap->usSubImageIndex, &usIndex);
          RemoveSavedStructFromMap(pMap->usGridNo, usIndex);
        }

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;
        break;
      case SLM_REMOVE_SHADOW:
        break;
      case SLM_REMOVE_MERC:
        break;
      case SLM_REMOVE_ROOF:
        break;
      case SLM_REMOVE_ONROOF:
        break;
      case SLM_REMOVE_TOPMOST:
        break;

      case SLM_BLOOD_SMELL:
        AddBloodOrSmellFromMapTempFileToMap(pMap);
        break;

      case SLM_DAMAGED_STRUCT:
        DamageStructsFromMapTempFile(pMap);
        break;

      case SLM_EXIT_GRIDS: {
        let ExitGrid: EXITGRID;
        gfLoadingExitGrids = TRUE;
        ExitGrid.usGridNo = pMap->usSubImageIndex;
        ExitGrid.ubGotoSectorX = pMap->usImageType;
        ExitGrid.ubGotoSectorY = (pMap->usImageType >> 8);
        ExitGrid.ubGotoSectorZ = pMap->ubExtra;

        AddExitGridToWorld(pMap->usGridNo, &ExitGrid);
        gfLoadingExitGrids = FALSE;

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;
      } break;

      case SLM_OPENABLE_STRUCT:
        SetOpenableStructStatusFromMapTempFile(pMap->usGridNo, pMap->usImageType);
        break;

      case SLM_WINDOW_HIT:
        if (ModifyWindowStatus(pMap->usGridNo)) {
          // Save this struct back to the temp file
          SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

          // Since the element is being saved back to the temp file, increment the #
          uiNumberOfElementsSavedBackToFile++;
        }
        break;

      default:
        AssertMsg(0, "ERROR!  Map Type not in switch when loading map changes from temp file");
        break;
    }
  }

  // if no elements are saved back to the file, remove the flag indicating that there is a temp file
  if (uiNumberOfElementsSavedBackToFile == 0) {
    ReSetSectorFlag(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS);
  }

  FileClose(hFile);

  // Free the memory used for the temp array
  MemFree(pTempArrayOfMaps);
  pTempArrayOfMaps = NULL;

  return TRUE;
}

function AddStructToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = SLM_STRUCT;

  SaveModifiedMapStructToMapTempFile(&Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function AddStructFromMapTempFileToMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  AddStructToTailCommon(uiMapIndex, usIndex, TRUE);
}

function AddObjectToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = SLM_OBJECT;

  SaveModifiedMapStructToMapTempFile(&Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function AddObjectFromMapTempFileToMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  AddObjectToHead(uiMapIndex, usIndex);
}

function AddRemoveObjectToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = SLM_REMOVE_OBJECT;

  SaveModifiedMapStructToMapTempFile(&Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function RemoveStructFromMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex			= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = SLM_REMOVE_STRUCT;

  SaveModifiedMapStructToMapTempFile(&Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function RemoveSavedStructFromMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  RemoveStruct(uiMapIndex, usIndex);
}

function SaveBloodSmellAndRevealedStatesFromMapToTempFile(): void {
  let Map: MODIFY_MAP;
  let cnt: UINT16;
  let pStructure: Pointer<STRUCTURE>;

  gpRevealedMap = MemAlloc(NUM_REVEALED_BYTES);
  if (gpRevealedMap == NULL)
    AssertMsg(0, "Failed allocating memory for the revealed map");
  memset(gpRevealedMap, 0, NUM_REVEALED_BYTES);

  // Loop though all the map elements
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // if there is either blood or a smell on the tile, save it
    if (gpWorldLevelData[cnt].ubBloodInfo || gpWorldLevelData[cnt].ubSmellInfo) {
      memset(&Map, 0, sizeof(MODIFY_MAP));

      // Save the BloodInfo in the bottom byte and the smell info in the upper byte
      Map.usGridNo = cnt;
      //			Map.usIndex			= gpWorldLevelData[cnt].ubBloodInfo | ( gpWorldLevelData[cnt].ubSmellInfo << 8 );
      Map.usImageType = gpWorldLevelData[cnt].ubBloodInfo;
      Map.usSubImageIndex = gpWorldLevelData[cnt].ubSmellInfo;

      Map.ubType = SLM_BLOOD_SMELL;

      // Save the change to the map file
      SaveModifiedMapStructToMapTempFile(&Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    }

    // if the element has been revealed
    if (gpWorldLevelData[cnt].uiFlags & MAPELEMENT_REVEALED) {
      SetSectorsRevealedBit(cnt);
    }

    // if there is a structure that is damaged
    if (gpWorldLevelData[cnt].uiFlags & MAPELEMENT_STRUCTURE_DAMAGED) {
      let pCurrent: Pointer<STRUCTURE>;

      pCurrent = gpWorldLevelData[cnt].pStructureHead;

      pCurrent = FindStructure(cnt, STRUCTURE_BASE_TILE);

      // loop through all the structures and add all that are damaged
      while (pCurrent) {
        // if the structure has been damaged
        if (pCurrent->ubHitPoints < pCurrent->pDBStructureRef->pDBStructure->ubHitPoints) {
          let ubBitToSet: UINT8 = 0x80;
          let ubLevel: UINT8 = 0;

          if (pCurrent->sCubeOffset != 0)
            ubLevel |= ubBitToSet;

          memset(&Map, 0, sizeof(MODIFY_MAP));

          // Save the Damaged value
          Map.usGridNo = cnt;
          //					Map.usIndex			= StructureFlagToType( pCurrent->fFlags ) | ( pCurrent->ubHitPoints << 8 );
          Map.usImageType = StructureFlagToType(pCurrent->fFlags);
          Map.usSubImageIndex = pCurrent->ubHitPoints;

          Map.ubType = SLM_DAMAGED_STRUCT;
          Map.ubExtra = pCurrent->ubWallOrientation | ubLevel;

          // Save the change to the map file
          SaveModifiedMapStructToMapTempFile(&Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
        }

        pCurrent = FindNextStructure(pCurrent, STRUCTURE_BASE_TILE);
      }
    }

    pStructure = FindStructure(cnt, STRUCTURE_OPENABLE);

    // if this structure
    if (pStructure) {
      // if the current structure has an openable structure in it, and it is NOT a door
      if (!(pStructure->fFlags & STRUCTURE_ANYDOOR)) {
        let fStatusOnTheMap: BOOLEAN;

        fStatusOnTheMap = ((pStructure->fFlags & STRUCTURE_OPEN) != 0);

        AddOpenableStructStatusToMapTempFile(cnt, fStatusOnTheMap);
      }
    }
  }
}

// The BloodInfo is saved in the bottom byte and the smell info in the upper byte
function AddBloodOrSmellFromMapTempFileToMap(pMap: Pointer<MODIFY_MAP>): void {
  gpWorldLevelData[pMap->usGridNo].ubBloodInfo = pMap->usImageType;

  // if the blood and gore option IS set, add blood
  if (gGameSettings.fOptions[TOPTION_BLOOD_N_GORE]) {
    // Update graphics for both levels...
    gpWorldLevelData[pMap->usGridNo].uiFlags |= MAPELEMENT_REEVALUATEBLOOD;
    UpdateBloodGraphics(pMap->usGridNo, 0);
    gpWorldLevelData[pMap->usGridNo].uiFlags |= MAPELEMENT_REEVALUATEBLOOD;
    UpdateBloodGraphics(pMap->usGridNo, 1);
  }

  gpWorldLevelData[pMap->usGridNo].ubSmellInfo = pMap->usSubImageIndex;
}

function SaveRevealedStatusArrayToRevealedTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): BOOLEAN {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;

  Assert(gpRevealedMap != NULL);

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'v' for 'reVeiled Map' to the front of the map name
  //	sprintf( zMapName, "%s\\v_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_REVEALED_STATUS_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
  if (hFile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // Write the revealed array to the Revealed temp file
  FileWrite(hFile, gpRevealedMap, NUM_REVEALED_BYTES, &uiNumBytesWritten);
  if (uiNumBytesWritten != NUM_REVEALED_BYTES) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return FALSE;
  }

  FileClose(hFile);

  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_REVEALED_STATUS_TEMP_FILE_EXISTS);

  MemFree(gpRevealedMap);
  gpRevealedMap = NULL;

  return TRUE;
}

function LoadRevealedStatusArrayFromRevealedTempFile(): BOOLEAN {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'v' for 'reVeiled Map' to the front of the map name
  //	sprintf( zMapName, "%s\\v_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_REVEALED_STATUS_TEMP_FILE_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return TRUE;
  }

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hFile == 0) {
    // Error opening map modification file,
    return FALSE;
  }

  // Allocate memory
  Assert(gpRevealedMap == NULL);
  gpRevealedMap = MemAlloc(NUM_REVEALED_BYTES);
  if (gpRevealedMap == NULL)
    AssertMsg(0, "Failed allocating memory for the revealed map");
  memset(gpRevealedMap, 0, NUM_REVEALED_BYTES);

  // Load the Reveal map array structure
  FileRead(hFile, gpRevealedMap, NUM_REVEALED_BYTES, &uiNumBytesRead);
  if (uiNumBytesRead != NUM_REVEALED_BYTES) {
    return FALSE;
  }

  FileClose(hFile);

  // Loop through and set the bits in the map that are revealed
  SetMapRevealedStatus();

  MemFree(gpRevealedMap);
  gpRevealedMap = NULL;

  return TRUE;
}

function SetSectorsRevealedBit(usMapIndex: UINT16): void {
  let usByteNumber: UINT16;
  let ubBitNumber: UINT8;

  usByteNumber = usMapIndex / 8;
  ubBitNumber = usMapIndex % 8;

  gpRevealedMap[usByteNumber] |= 1 << ubBitNumber;
}

function SetMapRevealedStatus(): void {
  let usByteCnt: UINT16;
  let ubBitCnt: UINT8;
  let usMapIndex: UINT16;

  if (gpRevealedMap == NULL)
    AssertMsg(0, "gpRevealedMap is NULL.  DF 1");

  ClearSlantRoofs();

  // Loop through all bytes in the array
  for (usByteCnt = 0; usByteCnt < 3200; usByteCnt++) {
    // loop through all the bits in the byte
    for (ubBitCnt = 0; ubBitCnt < 8; ubBitCnt++) {
      usMapIndex = (usByteCnt * 8) + ubBitCnt;

      if (gpRevealedMap[usByteCnt] & (1 << ubBitCnt)) {
        gpWorldLevelData[usMapIndex].uiFlags |= MAPELEMENT_REVEALED;
        SetGridNoRevealedFlag(usMapIndex);
      } else {
        gpWorldLevelData[usMapIndex].uiFlags &= (~MAPELEMENT_REVEALED);
      }
    }
  }

  ExamineSlantRoofFOVSlots();
}

function DamageStructsFromMapTempFile(pMap: Pointer<MODIFY_MAP>): void {
  let pCurrent: Pointer<STRUCTURE> = NULL;
  let bLevel: INT8;
  let ubWallOrientation: UINT8;
  let ubBitToSet: UINT8 = 0x80;
  let ubHitPoints: UINT8 = 0;
  let ubType: UINT8 = 0;

  // Find the base structure
  pCurrent = FindStructure(pMap->usGridNo, STRUCTURE_BASE_TILE);

  if (pCurrent == NULL)
    return;

  bLevel = pMap->ubExtra & ubBitToSet;
  ubWallOrientation = pMap->ubExtra & ~ubBitToSet;
  ubType = pMap->usImageType;

  // Check to see if the desired strucure node is in this tile
  pCurrent = FindStructureBySavedInfo(pMap->usGridNo, ubType, ubWallOrientation, bLevel);

  if (pCurrent != NULL) {
    // Assign the hitpoints
    pCurrent->ubHitPoints = (pMap->usSubImageIndex);

    gpWorldLevelData[pCurrent->sGridNo].uiFlags |= MAPELEMENT_STRUCTURE_DAMAGED;
  }
}

//////////////

function AddStructToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = SLM_STRUCT;

  SaveModifiedMapStructToMapTempFile(&Map, sSectorX, sSectorY, ubSectorZ);
}

function AddObjectToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = SLM_OBJECT;

  SaveModifiedMapStructToMapTempFile(&Map, sSectorX, sSectorY, ubSectorZ);
}

function RemoveStructFromUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex			= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = SLM_REMOVE_STRUCT;

  SaveModifiedMapStructToMapTempFile(&Map, sSectorX, sSectorY, ubSectorZ);
}

function AddRemoveObjectToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = SLM_REMOVE_OBJECT;

  SaveModifiedMapStructToMapTempFile(&Map, sSectorX, sSectorY, ubSectorZ);
}

function AddExitGridToMapTempFile(usGridNo: UINT16, pExitGrid: Pointer<EXITGRID>, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;

  if (!gfApplyChangesToTempFile) {
    ScreenMsg(FONT_MCOLOR_WHITE, MSG_BETAVERSION, "Called AddExitGridToMapTempFile() without calling ApplyMapChangesToMapTempFile()");
    return;
  }

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = usGridNo;
  //	Map.usIndex		= pExitGrid->ubGotoSectorX;

  Map.usImageType = pExitGrid->ubGotoSectorX | (pExitGrid->ubGotoSectorY << 8);
  Map.usSubImageIndex = pExitGrid->usGridNo;

  Map.ubExtra = pExitGrid->ubGotoSectorZ;
  Map.ubType = SLM_EXIT_GRIDS;

  SaveModifiedMapStructToMapTempFile(&Map, sSectorX, sSectorY, ubSectorZ);
}

function RemoveGraphicFromTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): BOOLEAN {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let pTempArrayOfMaps: Pointer<MODIFY_MAP> = NULL;
  let pMap: Pointer<MODIFY_MAP>;
  let uiFileSize: UINT32;
  let uiNumberOfElements: UINT32;
  let fRetVal: BOOLEAN = FALSE;
  let uiType: UINT32;
  let usSubIndex: UINT16;
  let cnt: UINT32;

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, ubSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, ubSectorZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists,
    return FALSE;
  }

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hFile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // Get the size of the temp file
  uiFileSize = FileGetSize(hFile);

  // Allocate memory for the buffer
  pTempArrayOfMaps = MemAlloc(uiFileSize);
  if (pTempArrayOfMaps == NULL) {
    Assert(0);
    return FALSE;
  }

  // Read the map temp file into a buffer
  FileRead(hFile, pTempArrayOfMaps, uiFileSize, &uiNumBytesRead);
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return FALSE;
  }

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  // Get the number of elements in the file
  uiNumberOfElements = uiFileSize / sizeof(MODIFY_MAP);

  // Get the image type and subindex
  GetTileType(usIndex, &uiType);
  GetSubIndexFromTileIndex(usIndex, &usSubIndex);

  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = &pTempArrayOfMaps[cnt];

    // if this is the peice we are looking for
    if (pMap->usGridNo == uiMapIndex && pMap->usImageType == uiType && pMap->usSubImageIndex == usSubIndex) {
      // Do nothin
      fRetVal = TRUE;
    } else {
      // save the struct back to the temp file
      SaveModifiedMapStructToMapTempFile(pMap, sSectorX, sSectorY, ubSectorZ);
    }
  }

  return fRetVal;
}

function AddOpenableStructStatusToMapTempFile(uiMapIndex: UINT32, fOpened: BOOLEAN): void {
  let Map: MODIFY_MAP;

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  Map.usImageType = fOpened;

  Map.ubType = SLM_OPENABLE_STRUCT;

  SaveModifiedMapStructToMapTempFile(&Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function AddWindowHitToMapTempFile(uiMapIndex: UINT32): void {
  let Map: MODIFY_MAP;

  memset(&Map, 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  Map.ubType = SLM_WINDOW_HIT;

  SaveModifiedMapStructToMapTempFile(&Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function ModifyWindowStatus(uiMapIndex: UINT32): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(uiMapIndex, STRUCTURE_WALLNWINDOW);
  if (pStructure) {
    SwapStructureForPartner(uiMapIndex, pStructure);
    return TRUE;
  }
  // else forget it, window could be destroyed
  return FALSE;
}

function SetOpenableStructStatusFromMapTempFile(uiMapIndex: UINT32, fOpened: BOOLEAN): void {
  let pStructure: Pointer<STRUCTURE>;
  let pBase: Pointer<STRUCTURE>;
  let fStatusOnTheMap: BOOLEAN;
  let pItemPool: Pointer<ITEM_POOL>;
  let sBaseGridNo: INT16 = uiMapIndex;

  pStructure = FindStructure(uiMapIndex, STRUCTURE_OPENABLE);

  if (pStructure == NULL) {
    //		ScreenMsg( FONT_MCOLOR_WHITE, MSG_BETAVERSION, L"SetOpenableStructStatusFromMapTempFile( %d, %d ) failed to find the openable struct.  DF 1.", uiMapIndex, fOpened );
    return;
  }

  fStatusOnTheMap = ((pStructure->fFlags & STRUCTURE_OPEN) != 0);

  if (fStatusOnTheMap != fOpened) {
    // Adjust the item's gridno to the base of struct.....
    pBase = FindBaseStructure(pStructure);

    // Get LEVELNODE for struct and remove!
    if (pBase) {
      sBaseGridNo = pBase->sGridNo;
    }

    if (SwapStructureForPartnerWithoutTriggeringSwitches(uiMapIndex, pStructure) == NULL) {
      // an error occured
    }

    // Adjust visiblity of any item pools here....
    // ATE: Nasty bug here - use base gridno for structure for items!
    // since items always drop to base gridno in AddItemToPool
    if (GetItemPool(sBaseGridNo, &pItemPool, 0)) {
      if (fOpened) {
        // We are open, make un-hidden if so....
        SetItemPoolVisibilityOn(pItemPool, ANY_VISIBILITY_VALUE, FALSE);
      } else {
        // Make sure items are hidden...
        SetItemPoolVisibilityHidden(pItemPool);
      }
    }
  }
}

function ChangeStatusOfOpenableStructInUnloadedSector(usSectorX: UINT16, usSectorY: UINT16, bSectorZ: INT8, usGridNo: UINT16, fChangeToOpen: BOOLEAN): BOOLEAN {
  //	STRUCTURE * pStructure;
  //	MODIFY_MAP Map;
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let uiNumBytesWritten: UINT32;
  let uiFileSize: UINT32;
  let uiNumberOfElements: UINT32;
  let uiNumberOfElementsSavedBackToFile: UINT32 = 0; // added becuase if no files get saved back to disk, the flag needs to be erased
  let cnt: UINT32;
  let pMap: Pointer<MODIFY_MAP>;
  let pTempArrayOfMaps: Pointer<MODIFY_MAP> = NULL;
  //	UINT16	usIndex;

  // Convert the current sector location into a file name
  //	GetMapFileName( usSectorX, usSectorY, bSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, zMapName, usSectorX, usSectorY, bSectorZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return TRUE;
  }

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hFile == 0) {
    // Error opening map modification file,
    return FALSE;
  }

  // Get the size of the file
  uiFileSize = FileGetSize(hFile);

  // Allocate memory for the buffer
  pTempArrayOfMaps = MemAlloc(uiFileSize);
  if (pTempArrayOfMaps == NULL) {
    Assert(0);
    return TRUE;
  }

  // Read the map temp file into a buffer
  FileRead(hFile, pTempArrayOfMaps, uiFileSize, &uiNumBytesRead);
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return FALSE;
  }

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  uiNumberOfElements = uiFileSize / sizeof(MODIFY_MAP);

  // loop through all the array elements to
  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = &pTempArrayOfMaps[cnt];

    // if this element is of the same type
    if (pMap->ubType == SLM_OPENABLE_STRUCT) {
      // if its on the same gridno
      if (pMap->usGridNo == usGridNo) {
        // Change to the desired settings
        pMap->usImageType = fChangeToOpen;

        break;
      }
    }
  }

  // Open the file for writing
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
  if (hFile == 0) {
    // Error opening map modification file,
    return FALSE;
  }

  // Write the map temp file into a buffer
  FileWrite(hFile, pTempArrayOfMaps, uiFileSize, &uiNumBytesWritten);
  if (uiNumBytesWritten != uiFileSize) {
    FileClose(hFile);
    return FALSE;
  }

  FileClose(hFile);

  return TRUE;
}
