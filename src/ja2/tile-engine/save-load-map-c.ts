namespace ja2 {

const NUM_REVEALED_BYTES = 3200;

let gfApplyChangesToTempFile: boolean = false;

//  There are 3200 bytes, and each bit represents the revelaed status.
//	3200 bytes * 8 bits = 25600 map elements
let gpRevealedMap: UINT8[] | null;

// ppp

export function ApplyMapChangesToMapTempFile(fAddToMap: boolean): void {
  gfApplyChangesToTempFile = fAddToMap;
}

function SaveModifiedMapStructToMapTempFile(pMap: MODIFY_MAP, sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, sSectorX, sSectorY, bSectorZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Move to the end of the file
  FileSeek(hFile, 0, FILE_SEEK_FROM_END);

  buffer = Buffer.allocUnsafe(MODIFY_MAP_SIZE);
  writeModifyMap(pMap, buffer);

  uiNumBytesWritten = FileWrite(hFile, buffer, MODIFY_MAP_SIZE);
  if (uiNumBytesWritten != MODIFY_MAP_SIZE) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);

  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS);

  return true;
}

export function LoadAllMapChangesFromMapTempFileAndApplyThem(): boolean {
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let uiFileSize: UINT32;
  let uiNumberOfElements: UINT32;
  let uiNumberOfElementsSavedBackToFile: UINT32 = 0; // added becuase if no files get saved back to disk, the flag needs to be erased
  let cnt: UINT32;
  let pMap: MODIFY_MAP;
  let pTempArrayOfMaps: MODIFY_MAP[];
  let usIndex: UINT16;
  let buffer: Buffer;

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

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
  pTempArrayOfMaps = createArrayFrom(uiFileSize / MODIFY_MAP_SIZE, createModifyMap);

  // Read the map temp file into a buffer
  buffer = Buffer.allocUnsafe(uiFileSize)
  uiNumBytesRead = FileRead(hFile, buffer, uiFileSize);
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return false;
  }

  readObjectArray(pTempArrayOfMaps, buffer, 0, readModifyMap);

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  uiNumberOfElements = uiFileSize / MODIFY_MAP_SIZE;

  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = pTempArrayOfMaps[cnt];

    // Switch on the type that should either be added or removed from the map
    switch (pMap.ubType) {
      // If we are adding to the map
      case Enum307.SLM_LAND:
        break;
      case Enum307.SLM_OBJECT:
        usIndex = GetTileIndexFromTypeSubIndex(pMap.usImageType, pMap.usSubImageIndex);

        AddObjectFromMapTempFileToMap(pMap.usGridNo, usIndex);

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;

        break;
      case Enum307.SLM_STRUCT:
        usIndex = GetTileIndexFromTypeSubIndex(pMap.usImageType, pMap.usSubImageIndex);

        AddStructFromMapTempFileToMap(pMap.usGridNo, usIndex);

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
        if (pMap.usImageType >= Enum313.FIRSTDOOR && pMap.usImageType <= Enum313.FOURTHDOOR) {
          // Remove ANY door...
          RemoveAllStructsOfTypeRange(pMap.usGridNo, Enum313.FIRSTDOOR, Enum313.FOURTHDOOR);
        } else {
          usIndex = GetTileIndexFromTypeSubIndex(pMap.usImageType, pMap.usSubImageIndex);
          RemoveSavedStructFromMap(pMap.usGridNo, usIndex);
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
        let ExitGrid: EXITGRID = createExitGrid();
        gfLoadingExitGrids = true;
        ExitGrid.usGridNo = pMap.usSubImageIndex;
        ExitGrid.ubGotoSectorX = pMap.usImageType;
        ExitGrid.ubGotoSectorY = (pMap.usImageType >> 8);
        ExitGrid.ubGotoSectorZ = pMap.ubExtra;

        AddExitGridToWorld(pMap.usGridNo, ExitGrid);
        gfLoadingExitGrids = false;

        // Save this struct back to the temp file
        SaveModifiedMapStructToMapTempFile(pMap, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Since the element is being saved back to the temp file, increment the #
        uiNumberOfElementsSavedBackToFile++;
      } break;

      case Enum307.SLM_OPENABLE_STRUCT:
        SetOpenableStructStatusFromMapTempFile(pMap.usGridNo, Boolean(pMap.usImageType));
        break;

      case Enum307.SLM_WINDOW_HIT:
        if (ModifyWindowStatus(pMap.usGridNo)) {
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

  return true;
}

export function AddStructToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP = createModifyMap();
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_STRUCT;

  SaveModifiedMapStructToMapTempFile(Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function AddStructFromMapTempFileToMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  AddStructToTailCommon(uiMapIndex, usIndex, true);
}

export function AddObjectToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP = createModifyMap();
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_OBJECT;

  SaveModifiedMapStructToMapTempFile(Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function AddObjectFromMapTempFileToMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  AddObjectToHead(uiMapIndex, usIndex);
}

export function AddRemoveObjectToMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP = createModifyMap();
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_REMOVE_OBJECT;

  SaveModifiedMapStructToMapTempFile(Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

export function RemoveStructFromMapTempFile(uiMapIndex: UINT32, usIndex: UINT16): void {
  let Map: MODIFY_MAP = createModifyMap();
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (!gfApplyChangesToTempFile)
    return;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex			= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_REMOVE_STRUCT;

  SaveModifiedMapStructToMapTempFile(Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function RemoveSavedStructFromMap(uiMapIndex: UINT32, usIndex: UINT16): void {
  RemoveStruct(uiMapIndex, usIndex);
}

export function SaveBloodSmellAndRevealedStatesFromMapToTempFile(): void {
  let Map: MODIFY_MAP = createModifyMap();
  let cnt: UINT16;
  let pStructure: STRUCTURE | null;
  let buffer: Buffer;

  gpRevealedMap = createArray(NUM_REVEALED_BYTES, 0);

  // Loop though all the map elements
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    // if there is either blood or a smell on the tile, save it
    if (gpWorldLevelData[cnt].ubBloodInfo || gpWorldLevelData[cnt].ubSmellInfo) {
      resetModifyMap(Map);

      // Save the BloodInfo in the bottom byte and the smell info in the upper byte
      Map.usGridNo = cnt;
      //			Map.usIndex			= gpWorldLevelData[cnt].ubBloodInfo | ( gpWorldLevelData[cnt].ubSmellInfo << 8 );
      Map.usImageType = gpWorldLevelData[cnt].ubBloodInfo;
      Map.usSubImageIndex = gpWorldLevelData[cnt].ubSmellInfo;

      Map.ubType = Enum307.SLM_BLOOD_SMELL;

      // Save the change to the map file
      SaveModifiedMapStructToMapTempFile(Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    }

    // if the element has been revealed
    if (gpWorldLevelData[cnt].uiFlags & MAPELEMENT_REVEALED) {
      SetSectorsRevealedBit(cnt);
    }

    // if there is a structure that is damaged
    if (gpWorldLevelData[cnt].uiFlags & MAPELEMENT_STRUCTURE_DAMAGED) {
      let pCurrent: STRUCTURE | null;

      pCurrent = gpWorldLevelData[cnt].pStructureHead;

      pCurrent = FindStructure(cnt, STRUCTURE_BASE_TILE);

      // loop through all the structures and add all that are damaged
      while (pCurrent) {
        // if the structure has been damaged
        if (pCurrent.ubHitPoints < pCurrent.pDBStructureRef.pDBStructure.ubHitPoints) {
          let ubBitToSet: UINT8 = 0x80;
          let ubLevel: UINT8 = 0;

          if (pCurrent.sCubeOffset != 0)
            ubLevel |= ubBitToSet;

          resetModifyMap(Map);

          // Save the Damaged value
          Map.usGridNo = cnt;
          //					Map.usIndex			= StructureFlagToType( pCurrent->fFlags ) | ( pCurrent->ubHitPoints << 8 );
          Map.usImageType = StructureFlagToType(pCurrent.fFlags);
          Map.usSubImageIndex = pCurrent.ubHitPoints;

          Map.ubType = Enum307.SLM_DAMAGED_STRUCT;
          Map.ubExtra = pCurrent.ubWallOrientation | ubLevel;

          // Save the change to the map file
          SaveModifiedMapStructToMapTempFile(Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
        }

        pCurrent = FindNextStructure(pCurrent, STRUCTURE_BASE_TILE);
      }
    }

    pStructure = FindStructure(cnt, STRUCTURE_OPENABLE);

    // if this structure
    if (pStructure) {
      // if the current structure has an openable structure in it, and it is NOT a door
      if (!(pStructure.fFlags & STRUCTURE_ANYDOOR)) {
        let fStatusOnTheMap: boolean;

        fStatusOnTheMap = ((pStructure.fFlags & STRUCTURE_OPEN) != 0);

        AddOpenableStructStatusToMapTempFile(cnt, fStatusOnTheMap);
      }
    }
  }
}

// The BloodInfo is saved in the bottom byte and the smell info in the upper byte
function AddBloodOrSmellFromMapTempFileToMap(pMap: MODIFY_MAP): void {
  gpWorldLevelData[pMap.usGridNo].ubBloodInfo = pMap.usImageType;

  // if the blood and gore option IS set, add blood
  if (gGameSettings.fOptions[Enum8.TOPTION_BLOOD_N_GORE]) {
    // Update graphics for both levels...
    gpWorldLevelData[pMap.usGridNo].uiFlags |= MAPELEMENT_REEVALUATEBLOOD;
    UpdateBloodGraphics(pMap.usGridNo, 0);
    gpWorldLevelData[pMap.usGridNo].uiFlags |= MAPELEMENT_REEVALUATEBLOOD;
    UpdateBloodGraphics(pMap.usGridNo, 1);
  }

  gpWorldLevelData[pMap.usGridNo].ubSmellInfo = pMap.usSubImageIndex;
}

export function SaveRevealedStatusArrayToRevealedTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;
  let buffer: Buffer;

  Assert(gpRevealedMap != null);

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'v' for 'reVeiled Map' to the front of the map name
  //	sprintf( zMapName, "%s\\v_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_REVEALED_STATUS_TEMP_FILE_EXISTS, sSectorX, sSectorY, bSectorZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Write the revealed array to the Revealed temp file
  buffer = Buffer.allocUnsafe(NUM_REVEALED_BYTES);
  writeUIntArray(gpRevealedMap, buffer, 0, 1);
  uiNumBytesWritten = FileWrite(hFile, buffer, NUM_REVEALED_BYTES);
  if (uiNumBytesWritten != NUM_REVEALED_BYTES) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);

  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_REVEALED_STATUS_TEMP_FILE_EXISTS);

  gpRevealedMap = null;

  return true;
}

export function LoadRevealedStatusArrayFromRevealedTempFile(): boolean {
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'v' for 'reVeiled Map' to the front of the map name
  //	sprintf( zMapName, "%s\\v_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_REVEALED_STATUS_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

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
  gpRevealedMap = createArray(NUM_REVEALED_BYTES, 0);

  // Load the Reveal map array structure
  buffer = Buffer.allocUnsafe(NUM_REVEALED_BYTES);
  uiNumBytesRead = FileRead(hFile, buffer, NUM_REVEALED_BYTES);
  if (uiNumBytesRead != NUM_REVEALED_BYTES) {
    return false;
  }

  readUIntArray(gpRevealedMap, buffer, 0, 1);

  FileClose(hFile);

  // Loop through and set the bits in the map that are revealed
  SetMapRevealedStatus();

  gpRevealedMap = null;

  return true;
}

function SetSectorsRevealedBit(usMapIndex: UINT16): void {
  let usByteNumber: UINT16;
  let ubBitNumber: UINT8;

  usByteNumber = usMapIndex / 8;
  ubBitNumber = usMapIndex % 8;

  Assert(gpRevealedMap);
  gpRevealedMap[usByteNumber] |= 1 << ubBitNumber;
}

function SetMapRevealedStatus(): void {
  let usByteCnt: UINT16;
  let ubBitCnt: UINT8;
  let usMapIndex: UINT16;

  if (gpRevealedMap == null)
    AssertMsg(false, "gpRevealedMap is NULL.  DF 1");

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

function DamageStructsFromMapTempFile(pMap: MODIFY_MAP): void {
  let pCurrent: STRUCTURE | null = null;
  let bLevel: INT8;
  let ubWallOrientation: UINT8;
  let ubBitToSet: UINT8 = 0x80;
  let ubHitPoints: UINT8 = 0;
  let ubType: UINT8 = 0;

  // Find the base structure
  pCurrent = FindStructure(pMap.usGridNo, STRUCTURE_BASE_TILE);

  if (pCurrent == null)
    return;

  bLevel = pMap.ubExtra & ubBitToSet;
  ubWallOrientation = pMap.ubExtra & ~ubBitToSet;
  ubType = pMap.usImageType;

  // Check to see if the desired strucure node is in this tile
  pCurrent = FindStructureBySavedInfo(pMap.usGridNo, ubType, ubWallOrientation, bLevel);

  if (pCurrent != null) {
    // Assign the hitpoints
    pCurrent.ubHitPoints = (pMap.usSubImageIndex);

    gpWorldLevelData[pCurrent.sGridNo].uiFlags |= MAPELEMENT_STRUCTURE_DAMAGED;
  }
}

//////////////

export function AddStructToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP = createModifyMap();
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_STRUCT;

  SaveModifiedMapStructToMapTempFile(Map, sSectorX, sSectorY, ubSectorZ);
}

function AddObjectToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP = createModifyMap();
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_OBJECT;

  SaveModifiedMapStructToMapTempFile(Map, sSectorX, sSectorY, ubSectorZ);
}

export function RemoveStructFromUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP = createModifyMap();
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex			= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_REMOVE_STRUCT;

  SaveModifiedMapStructToMapTempFile(Map, sSectorX, sSectorY, ubSectorZ);
}

function AddRemoveObjectToUnLoadedMapTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP = createModifyMap();
  let uiType: UINT32;
  let usSubIndex: UINT16;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  Map.usGridNo = uiMapIndex;
  //	Map.usIndex		= usIndex;
  Map.usImageType = uiType;
  Map.usSubImageIndex = usSubIndex;

  Map.ubType = Enum307.SLM_REMOVE_OBJECT;

  SaveModifiedMapStructToMapTempFile(Map, sSectorX, sSectorY, ubSectorZ);
}

export function AddExitGridToMapTempFile(usGridNo: UINT16, pExitGrid: EXITGRID, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): void {
  let Map: MODIFY_MAP = createModifyMap();

  if (!gfApplyChangesToTempFile) {
    ScreenMsg(FONT_MCOLOR_WHITE, MSG_BETAVERSION, "Called AddExitGridToMapTempFile() without calling ApplyMapChangesToMapTempFile()");
    return;
  }

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME)
    return;

  Map.usGridNo = usGridNo;
  //	Map.usIndex		= pExitGrid->ubGotoSectorX;

  Map.usImageType = pExitGrid.ubGotoSectorX | (pExitGrid.ubGotoSectorY << 8);
  Map.usSubImageIndex = pExitGrid.usGridNo;

  Map.ubExtra = pExitGrid.ubGotoSectorZ;
  Map.ubType = Enum307.SLM_EXIT_GRIDS;

  SaveModifiedMapStructToMapTempFile(Map, sSectorX, sSectorY, ubSectorZ);
}

export function RemoveGraphicFromTempFile(uiMapIndex: UINT32, usIndex: UINT16, sSectorX: INT16, sSectorY: INT16, ubSectorZ: UINT8): boolean {
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let pTempArrayOfMaps: MODIFY_MAP[];
  let pMap: MODIFY_MAP;
  let uiFileSize: UINT32;
  let uiNumberOfElements: UINT32;
  let fRetVal: boolean = false;
  let uiType: UINT32;
  let usSubIndex: UINT16;
  let cnt: UINT32;
  let buffer: Buffer;

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, ubSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, sSectorX, sSectorY, ubSectorZ);

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
  pTempArrayOfMaps = createArrayFrom(uiFileSize / MODIFY_MAP_SIZE, createModifyMap);

  // Read the map temp file into a buffer
  buffer = Buffer.allocUnsafe(uiFileSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiFileSize);
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return false;
  }

  readObjectArray(pTempArrayOfMaps, buffer, 0, readModifyMap);

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  // Get the number of elements in the file
  uiNumberOfElements = uiFileSize / MODIFY_MAP_SIZE;

  // Get the image type and subindex
  uiType = GetTileType(usIndex);
  usSubIndex = GetSubIndexFromTileIndex(usIndex);

  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = pTempArrayOfMaps[cnt];

    // if this is the peice we are looking for
    if (pMap.usGridNo == uiMapIndex && pMap.usImageType == uiType && pMap.usSubImageIndex == usSubIndex) {
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
  let Map: MODIFY_MAP = createModifyMap();

  Map.usGridNo = uiMapIndex;
  Map.usImageType = Number(fOpened);

  Map.ubType = Enum307.SLM_OPENABLE_STRUCT;

  SaveModifiedMapStructToMapTempFile(Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

export function AddWindowHitToMapTempFile(uiMapIndex: UINT32): void {
  let Map: MODIFY_MAP = createModifyMap();

  Map.usGridNo = uiMapIndex;
  Map.ubType = Enum307.SLM_WINDOW_HIT;

  SaveModifiedMapStructToMapTempFile(Map, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
}

function ModifyWindowStatus(uiMapIndex: UINT32): boolean {
  let pStructure: STRUCTURE | null;

  pStructure = FindStructure(uiMapIndex, STRUCTURE_WALLNWINDOW);
  if (pStructure) {
    SwapStructureForPartner(uiMapIndex, pStructure);
    return true;
  }
  // else forget it, window could be destroyed
  return false;
}

function SetOpenableStructStatusFromMapTempFile(uiMapIndex: UINT32, fOpened: boolean): void {
  let pStructure: STRUCTURE | null;
  let pBase: STRUCTURE | null;
  let fStatusOnTheMap: boolean;
  let pItemPool: ITEM_POOL | null;
  let sBaseGridNo: INT16 = uiMapIndex;

  pStructure = FindStructure(uiMapIndex, STRUCTURE_OPENABLE);

  if (pStructure == null) {
    //		ScreenMsg( FONT_MCOLOR_WHITE, MSG_BETAVERSION, L"SetOpenableStructStatusFromMapTempFile( %d, %d ) failed to find the openable struct.  DF 1.", uiMapIndex, fOpened );
    return;
  }

  fStatusOnTheMap = ((pStructure.fFlags & STRUCTURE_OPEN) != 0);

  if (fStatusOnTheMap != fOpened) {
    // Adjust the item's gridno to the base of struct.....
    pBase = FindBaseStructure(pStructure);

    // Get LEVELNODE for struct and remove!
    if (pBase) {
      sBaseGridNo = pBase.sGridNo;
    }

    if (SwapStructureForPartnerWithoutTriggeringSwitches(uiMapIndex, pStructure) == null) {
      // an error occured
    }

    // Adjust visiblity of any item pools here....
    // ATE: Nasty bug here - use base gridno for structure for items!
    // since items always drop to base gridno in AddItemToPool
    if ((pItemPool = GetItemPool(sBaseGridNo, 0))) {
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
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let uiNumBytesWritten: UINT32;
  let uiFileSize: UINT32;
  let uiNumberOfElements: UINT32;
  let uiNumberOfElementsSavedBackToFile: UINT32 = 0; // added becuase if no files get saved back to disk, the flag needs to be erased
  let cnt: UINT32;
  let pMap: MODIFY_MAP;
  let pTempArrayOfMaps: MODIFY_MAP[];
  //	UINT16	usIndex;
  let buffer: Buffer;

  // Convert the current sector location into a file name
  //	GetMapFileName( usSectorX, usSectorY, bSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\m_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_MAP_MODIFICATIONS_TEMP_FILE_EXISTS, usSectorX, usSectorY, bSectorZ);

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
  pTempArrayOfMaps = createArrayFrom(uiFileSize / MODIFY_MAP_SIZE, createModifyMap);

  // Read the map temp file into a buffer
  buffer = Buffer.allocUnsafe(uiFileSize);
  uiNumBytesRead = FileRead(hFile, buffer, uiFileSize);
  if (uiNumBytesRead != uiFileSize) {
    FileClose(hFile);
    return false;
  }

  readObjectArray(pTempArrayOfMaps, buffer, 0, readModifyMap);

  // Close the file
  FileClose(hFile);

  // Delete the file
  FileDelete(zMapName);

  uiNumberOfElements = uiFileSize / MODIFY_MAP_SIZE;

  // loop through all the array elements to
  for (cnt = 0; cnt < uiNumberOfElements; cnt++) {
    pMap = pTempArrayOfMaps[cnt];

    // if this element is of the same type
    if (pMap.ubType == Enum307.SLM_OPENABLE_STRUCT) {
      // if its on the same gridno
      if (pMap.usGridNo == usGridNo) {
        // Change to the desired settings
        pMap.usImageType = Number(fChangeToOpen);

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
  buffer = Buffer.allocUnsafe(uiFileSize);
  writeObjectArray(pTempArrayOfMaps, buffer, 0, writeModifyMap);

  uiNumBytesWritten = FileWrite(hFile, buffer, uiFileSize);
  if (uiNumBytesWritten != uiFileSize) {
    FileClose(hFile);
    return false;
  }

  FileClose(hFile);

  return true;
}

}
