namespace ja2 {

const NUM_REVEALED_BYTES = 3200;

let gfApplyChangesToTempFile: boolean = false;

//  There are 3200 bytes, and each bit represents the revelaed status.
//	3200 bytes * 8 bits = 25600 map elements
let gpRevealedMap: Pointer<UINT8>;

// ppp

export function ApplyMapChangesToMapTempFile(fAddToMap: boolean): void {
  gfApplyChangesToTempFile = fAddToMap;
}

function SaveModifiedMapStructToMapTempFile(pMap: Pointer<MODIFY_MAP>, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Move to the end of the file
  FileSeek(hFile, 0, FILE_SEEK_FROM_END);

  FileWrite(hFile, pMap, sizeof(MODIFY_MAP), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(MODIFY_MAP)) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);

  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS);

  return true;
}

export function LoadAllMapChangesFromMapTempFileAndApplyThem(): boolean {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let uiFileSize: UINT32;
  let uiNumberOfElements: UINT32;
  let uiNumberOfElementsSavedBackToFile: UINT32 = 0; // added becuase if no files get saved back to disk, the flag needs to be erased
  let cnt: UINT32;
  let pMap: Pointer<MODIFY_MAP>;
  let pTempArrayOfMaps: Pointer<MODIFY_MAP> = null;
  let usIndex: UINT16;

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return true;
  }

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file,
    return false;
  }

  // Get the size of the file
  uiFileSize = FileGetSize(hFile);

  // Allocate memory for the buffer
  pTempArrayOfMaps = MemAlloc(uiFileSize);
  if (pTempArrayOfMaps == null) {
    Assert(0);
    return true;
  }

  // Read the map temp file into a buffer
  FileRead(hFile, pTempArrayOfMaps, uiFileSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return false;
  }

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  uiNumberOfElements = uiFileSize / sizeof(MODIFY_MAP);

  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = addressof(pTempArrayOfMaps[cnt]);

    // Switch on the type that should either be added or removed from the map
    switch (pMap.value.ubType) {
      // If we are adding to the map
      case Enum307.SLM_LAND:
        break;
      case Enum307.SLM_OBJECT:
        GetTileIndexFromTypeSubIndex(pMap.value.usImageType, pMap.value.usSubImageIndex, addressof(usIndex));

        AddObjectFromMapTempFileToMap(pMap.value.usGridNo, usIndex);

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;

        break;
      case Enum307.SLM_STRUCT:
        GetTileIndexFromTypeSubIndex(pMap.value.usImageType, pMap.value.usSubImageIndex, addressof(usIndex));

        AddStructFromMapTempFileToMap(pMap.value.usGridNo, usIndex);

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;
        break;
      case Enum307.SLM_SHADOW:
        break;
      case Enum307.SLM_MERC:
        break;
      case Enum307.SLM_ROOF:
        break;
      case Enum307.SLM_ONROOF:
        break;
      case Enum307.SLM_TOPMOST:
        break;

      // Remove objects out of the world
      case Enum307.SLM_REMOVE_LAND:
        break;
      case Enum307.SLM_REMOVE_OBJECT:
        break;
      case Enum307.SLM_REMOVE_STRUCT:

        // ATE: OK, dor doors, the usIndex can be varied, opened, closed, etc
        // we MUSTR delete ANY door type on this gridno
        // Since we can only have one door per gridno, we're safe to do so.....
        if (pMap.value.usImageType >= Enum313.FIRSTDOOR && pMap.value.usImageType <= Enum313.FOURTHDOOR) {
          // Remove ANY door...
          RemoveAllStructsOfTypeRange(pMap.value.usGridNo, Enum313.FIRSTDOOR, Enum313.FOURTHDOOR);
        } else {
          GetTileIndexFromTypeSubIndex(pMap.value.usImageType, pMap.value.usSubImageIndex, addressof(usIndex));
          RemoveSavedStructFromMap(pMap.value.usGridNo, usIndex);
        }

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;
        break;
      case Enum307.SLM_REMOVE_SHADOW:
        break;
      case Enum307.SLM_REMOVE_MERC:
        break;
      case Enum307.SLM_REMOVE_ROOF:
        break;
      case Enum307.SLM_REMOVE_ONROOF:
        break;
      case Enum307.SLM_REMOVE_TOPMOST:
        break;

      case Enum307.SLM_BLOOD_SMELL:
        AddBloodOrSmellFromMapTempFileToMap(pMap);
        break;

      case Enum307.SLM_DAMAGED_STRUCT:
        DamageStructsFromMapTempFile(pMap);
        break;

      case Enum307.SLM_EXIT_GRIDS: {
        let ExitGrid: EXITGRID;
        gfLoadingExitGrids = true;
        ExitGrid.usGridNo = pMap.value.usSubImageIndex;
        ExitGrid.ubGotoSectorX = pMap.value.usImageType;
        ExitGrid.ubGotoSectorY = (pMap.value.usImageType >> 8);
        ExitGrid.ubGotoSectorZ = pMap.value.ubExtra;

        AddExitGridToWorld(pMap.value.usGridNo, addressof(ExitGrid));
        gfLoadingExitGrids = false;

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;
      } break;

      case Enum307.SLM_OPENABLE_STRUCT:
        SetOpenableStructStatusFromMapTempFile(pMap.value.usGridNo, pMap.value.usImageType);
        break;

      case Enum307.SLM_WINDOW_HIT:
        if (ModifyWindowStatus(pMap.value.usGridNo)) {
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
  pTempArrayOfMaps = null;

  return true;
}

export function AddStructToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_STRUCT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function AddStructFromMapTempFileToMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  AddStructToTailCommon(uiMapIndex, usIndex, true);
}

export function AddObjectToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_OBJECT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function AddObjectFromMapTempFileToMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  AddObjectToHead(uiMapIndex, usIndex);
}

export function AddRemoveObjectToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_REMOVE_OBJECT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

export function RemoveStructFromMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex			= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_REMOVE_STRUCT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function RemoveSavedStructFromMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  RemoveStruct(uiMapIndex, usIndex);
}

export function SaveBloodSmellAndRevealedStatesFromMapToTempFile(): void {
  let Map: MODIFY_MAP;
  let cnt: UINT16;
  let pStructure: Pointer<STRUCTURE>;

  gpRevealedMap = MemAlloc(NUM_REVEALED_BYTES);
  if (gpRevealedMap == null)
    AssertMsg(0, "Failed allocating memory for the revealed map");
  memset(gpRevealedMap, 0, NUM_REVEALED_BYTES);

  // Loop though all the map elements
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // if there is either blood or a smell on the tile, save it
    if (gpWorldLevelData[cnt].ubBloodInfo || gpWorldLevelData[cnt].ubSmellInfo) {
      memset(addressof(Map), 0, sizeof(MODIFY_MAP));

      // Save the BloodInfo in the bottom byte and the smell info in the upper byte
      Map.usGridNo = cnt;
      //			Map.usIndex			= gpWorldLevelData[cnt].ubBloodInfo | ( gpWorldLevelData[cnt].ubSmellInfo << 8 );
      Map.usImageType = gpWorldLevelData[cnt].ubBloodInfo;
      Map.usSubImageIndex = gpWorldLevelData[cnt].ubSmellInfo;

      Map.ubType = Enum307.SLM_BLOOD_SMELL;

      // Save the change to the map file
      SaveModifiedMapStructToMapTempFile(addressof(Map), gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
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
        if (pCurrent.value.ubHitPoints < pCurrent.value.pDBStructureRef.value.pDBStructure.value.ubHitPoints) {
          let ubBitToSet: UINT8 = 0x80;
          let ubLevel: UINT8 = 0;

          if (pCurrent.value.sCubeOffset != 0)
            ubLevel |= ubBitToSet;

          memset(addressof(Map), 0, sizeof(MODIFY_MAP));

          // Save the Damaged value
          Map.usGridNo = cnt;
          //					Map.usIndex			= StructureFlagToType( pCurrent->fFlags ) | ( pCurrent->ubHitPoints << 8 );
          Map.usImageType = StructureFlagToType(pCurrent.value.fFlags);
          Map.usSubImageIndex = pCurrent.value.ubHitPoints;

          Map.ubType = Enum307.SLM_DAMAGED_STRUCT;
          Map.ubExtra = pCurrent.value.ubWallOrientation | ubLevel;

          // Save the change to the map file
          SaveModifiedMapStructToMapTempFile(addressof(Map), gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
        }

        pCurrent = FindNextStructure(pCurrent, STRUCTURE_BASE_TILE);
      }
    }

    pStructure = FindStructure(cnt, STRUCTURE_OPENABLE);

    // if this structure
    if (pStructure) {
      // if the current structure has an openable structure in it, and it is NOT a door
      if (!(pStructure.value.fFlags & STRUCTURE_ANYDOOR)) {
        let fStatusOnTheMap: boolean;

        fStatusOnTheMap = ((pStructure.value.fFlags & STRUCTURE_OPEN) != 0);

        AddOpenableStructStatusToMapTempFile(cnt, fStatusOnTheMap);
      }
    }
  }
}

// The BloodInfo is saved in the bottom byte and the smell info in the upper byte
function AddBloodOrSmellFromMapTempFileToMap(pMap: Pointer<MODIFY_MAP>): void {
  gpWorldLevelData[pMap.value.usGridNo].ubBloodInfo = pMap.value.usImageType;

  // if the blood and gore option IS set, add blood
  if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
    // Update graphics for both levels...
    gpWorldLevelData[pMap.value.usGridNo].uiFlags |= MAPELEMENT_REEVALUATEBLOOD;
    UpdateBloodGraphics(pMap.value.usGridNo, 0);
    gpWorldLevelData[pMap.value.usGridNo].uiFlags |= MAPELEMENT_REEVALUATEBLOOD;
    UpdateBloodGraphics(pMap.value.usGridNo, 1);
  }

  gpWorldLevelData[pMap.value.usGridNo].ubSmellInfo = pMap.value.usSubImageIndex;
}

export function SaveRevealedStatusArrayToRevealedTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;

  Assert(gpRevealedMap != null);

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'v' for 'reVeiled Map' to the front of the map name
  //	sprintf( zMapName, "%s\\v_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_REVEALED_STATUS_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Write the revealed array to the Revealed temp file
  FileWrite(hFile, gpRevealedMap, NUM_REVEALED_BYTES, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != NUM_REVEALED_BYTES) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);

  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_REVEALED_STATUS_TEMP_FILE_EXISTS);

  MemFree(gpRevealedMap);
  gpRevealedMap = null;

  return true;
}

export function LoadRevealedStatusArrayFromRevealedTempFile(): boolean {
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
    return true;
  }

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file,
    return false;
  }

  // Allocate memory
  Assert(gpRevealedMap == null);
  gpRevealedMap = MemAlloc(NUM_REVEALED_BYTES);
  if (gpRevealedMap == null)
    AssertMsg(0, "Failed allocating memory for the revealed map");
  memset(gpRevealedMap, 0, NUM_REVEALED_BYTES);

  // Load the Reveal map array structure
  FileRead(hFile, gpRevealedMap, NUM_REVEALED_BYTES, addressof(uiNumBytesRead));
  if (uiNumBytesRead != NUM_REVEALED_BYTES) {
    return false;
  }

  FileClose(hFile);

  // Loop through and set the bits in the map that are revealed
  SetMapRevealedStatus();

  MemFree(gpRevealedMap);
  gpRevealedMap = null;

  return true;
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

  if (gpRevealedMap == null)
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
  let pCurrent: Pointer<STRUCTURE> = null;
  let bLevel: INT8;
  let ubWallOrientation: UINT8;
  let ubBitToSet: UINT8 = 0x80;
  let ubHitPoints: UINT8 = 0;
  let ubType: UINT8 = 0;

  // Find the base structure
  pCurrent = FindStructure(pMap.value.usGridNo, STRUCTURE_BASE_TILE);

  if (pCurrent == null)
    return;

  bLevel = pMap.value.ubExtra & ubBitToSet;
  ubWallOrientation = pMap.value.ubExtra & ~ubBitToSet;
  ubType = pMap.value.usImageType;

  // Check to see if the desired strucure node is in this tile
  pCurrent = FindStructureBySavedInfo(pMap.value.usGridNo, ubType, ubWallOrientation, bLevel);

  if (pCurrent != null) {
    // Assign the hitpoints
    pCurrent.value.ubHitPoints = (pMap.value.usSubImageIndex);

    gpWorldLevelData[pCurrent.value.sGridNo].uiFlags |= MAPELEMENT_STRUCTURE_DAMAGED;
  }
}

//////////////

export function AddStructToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_STRUCT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), sSectorX, sSectorY, ubSectorZ);
}

function AddObjectToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_OBJECT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), sSectorX, sSectorY, ubSectorZ);
}

export function RemoveStructFromUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex			= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_REMOVE_STRUCT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), sSectorX, sSectorY, ubSectorZ);
}

function AddRemoveObjectToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_REMOVE_OBJECT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), sSectorX, sSectorY, ubSectorZ);
}

export function AddExitGridToMapTempFile(usGridNo: UINT16, pExitGrid: Pointer<EXITGRID>, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP;

  if (!gfApplyChangesToTempFile) {
    ScreenMsg(FONT_MCOLOR_WHITE, MSG_BETAVERSION, "Called AddExitGridToMapTempFile() without calling ApplyMapChangesToMapTempFile()");
    return;
  }

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = usGridNo;
  //	Map.usIndex		= pExitGrid->ubGotoSectorX;

  Map.usImageType = pExitGrid.value.ubGotoSectorX | (pExitGrid.value.ubGotoSectorY << 8);
  Map.usSubImageIndex = pExitGrid.value.usGridNo;

  Map.ubExtra = pExitGrid.value.ubGotoSectorZ;
  Map.ubType = Enum307.SLM_EXIT_GRIDS;

  SaveModifiedMapStructToMapTempFile(addressof(Map), sSectorX, sSectorY, ubSectorZ);
}

export function RemoveGraphicFromTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): boolean {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let pTempArrayOfMaps: Pointer<MODIFY_MAP> = null;
  let pMap: Pointer<MODIFY_MAP>;
  let uiFileSize: UINT32;
  let uiNumberOfElements: UINT32;
  let fRetVal: boolean = false;
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
    return false;
  }

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Get the size of the temp file
  uiFileSize = FileGetSize(hFile);

  // Allocate memory for the buffer
  pTempArrayOfMaps = MemAlloc(uiFileSize);
  if (pTempArrayOfMaps == null) {
    Assert(0);
    return false;
  }

  // Read the map temp file into a buffer
  FileRead(hFile, pTempArrayOfMaps, uiFileSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return false;
  }

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  // Get the number of elements in the file
  uiNumberOfElements = uiFileSize / sizeof(MODIFY_MAP);

  // Get the image type and subindex
  GetTileType(usIndex, addressof(uiType));
  GetSubIndexFromTileIndex(usIndex, addressof(usSubIndex));

  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = addressof(pTempArrayOfMaps[cnt]);

    // if this is the peice we are looking for
    if (pMap.value.usGridNo == uiMapIndex && pMap.value.usImageType == uiType && pMap.value.usSubImageIndex == usSubIndex) {
      // Do nothin
      fRetVal = true;
    } else {
      // save the struct back to the temp file
      SaveModifiedMapStructToMapTempFile(pMap, sSectorX, sSectorY, ubSectorZ);
    }
  }

  return fRetVal;
}

function AddOpenableStructStatusToMapTempFile(uiMapIndex: UINT32, fOpened: boolean): void {
  let Map: MODIFY_MAP;

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  Map.usImageType = fOpened;

  Map.ubType = Enum307.SLM_OPENABLE_STRUCT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

export function AddWindowHitToMapTempFile(uiMapIndex: UINT32): void {
  let Map: MODIFY_MAP;

  memset(addressof(Map), 0, sizeof(MODIFY_MAP));

  Map.usGridNo = uiMapIndex;
  Map.ubType = Enum307.SLM_WINDOW_HIT;

  SaveModifiedMapStructToMapTempFile(addressof(Map), gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function ModifyWindowStatus(uiMapIndex: UINT32): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(uiMapIndex, STRUCTURE_WALLNWINDOW);
  if (pStructure) {
    SwapStructureForPartner(uiMapIndex, pStructure);
    return true;
  }
  // else forget it, window could be destroyed
  return false;
}

function SetOpenableStructStatusFromMapTempFile(uiMapIndex: UINT32, fOpened: boolean): void {
  let pStructure: Pointer<STRUCTURE>;
  let pBase: Pointer<STRUCTURE>;
  let fStatusOnTheMap: boolean;
  let pItemPool: Pointer<ITEM_POOL>;
  let sBaseGridNo: INT16 = uiMapIndex;

  pStructure = FindStructure(uiMapIndex, STRUCTURE_OPENABLE);

  if (pStructure == null) {
    //		ScreenMsg( FONT_MCOLOR_WHITE, MSG_BETAVERSION, L"SetOpenableStructStatusFromMapTempFile( %d, %d ) failed to find the openable struct.  DF 1.", uiMapIndex, fOpened );
    return;
  }

  fStatusOnTheMap = ((pStructure.value.fFlags & STRUCTURE_OPEN) != 0);

  if (fStatusOnTheMap != fOpened) {
    // Adjust the item's gridno to the base of struct.....
    pBase = FindBaseStructure(pStructure);

    // Get LEVELNODE for struct and remove!
    if (pBase) {
      sBaseGridNo = pBase.value.sGridNo;
    }

    if (SwapStructureForPartnerWithoutTriggeringSwitches(uiMapIndex, pStructure) == null) {
      // an error occured
    }

    // Adjust visiblity of any item pools here....
    // ATE: Nasty bug here - use base gridno for structure for items!
    // since items always drop to base gridno in AddItemToPool
    if (GetItemPool(sBaseGridNo, addressof(pItemPool), 0)) {
      if (fOpened) {
        // We are open, make un-hidden if so....
        SetItemPoolVisibilityOn(pItemPool, ANY_VISIBILITY_VALUE, false);
      } else {
        // Make sure items are hidden...
        SetItemPoolVisibilityHidden(pItemPool);
      }
    }
  }
}

export function ChangeStatusOfOpenableStructInUnloadedSector(usSectorX: UINT16, usSectorY: UINT16, bSectorZ: INT8, usGridNo: UINT16, fChangeToOpen: boolean): boolean {
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
  let pTempArrayOfMaps: Pointer<MODIFY_MAP> = null;
  //	UINT16	usIndex;

  // Convert the current sector location into a file name
  //	GetMapFileName( usSectorX, usSectorY, bSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, zMapName, usSectorX, usSectorY, bSectorZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return true;
  }

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file,
    return false;
  }

  // Get the size of the file
  uiFileSize = FileGetSize(hFile);

  // Allocate memory for the buffer
  pTempArrayOfMaps = MemAlloc(uiFileSize);
  if (pTempArrayOfMaps == null) {
    Assert(0);
    return true;
  }

  // Read the map temp file into a buffer
  FileRead(hFile, pTempArrayOfMaps, uiFileSize, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return false;
  }

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  uiNumberOfElements = uiFileSize / sizeof(MODIFY_MAP);

  // loop through all the array elements to
  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = addressof(pTempArrayOfMaps[cnt]);

    // if this element is of the same type
    if (pMap.value.ubType == Enum307.SLM_OPENABLE_STRUCT) {
      // if its on the same gridno
      if (pMap.value.usGridNo == usGridNo) {
        // Change to the desired settings
        pMap.value.usImageType = fChangeToOpen;

        break;
      }
    }
  }

  // Open the file for writing
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file,
    return false;
  }

  // Write the map temp file into a buffer
  FileWrite(hFile, pTempArrayOfMaps, uiFileSize, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != uiFileSize) {
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);

  return true;
}

}
