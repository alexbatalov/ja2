namespace ja2 {

let guiNumTileCacheStructs: UINT32 = 0;
let guiMaxTileCacheSize: UINT32 = 50;
let guiCurTileCacheSize: UINT32 = 0;
let giDefaultStructIndex: INT32 = -1;

export let gpTileCache: Pointer<TILE_CACHE_ELEMENT> = null;
let gpTileCacheStructInfo: Pointer<TILE_CACHE_STRUCT> = null;

export function InitTileCache(): boolean {
  let cnt: UINT32;
  let FileInfo: GETFILESTRUCT;
  let sFiles: INT16 = 0;

  gpTileCache = MemAlloc(sizeof(TILE_CACHE_ELEMENT) * guiMaxTileCacheSize);

  // Zero entries
  for (cnt = 0; cnt < guiMaxTileCacheSize; cnt++) {
    gpTileCache[cnt].pImagery = null;
    gpTileCache[cnt].sStructRefID = -1;
  }

  guiCurTileCacheSize = 0;

  // OK, look for JSD files in the tile cache directory and
  // load any we find....
  if (GetFileFirst("TILECACHE\\*.jsd", addressof(FileInfo))) {
    while (GetFileNext(addressof(FileInfo))) {
      sFiles++;
    }
    GetFileClose(addressof(FileInfo));
  }

  // Allocate memory...
  if (sFiles > 0) {
    cnt = 0;

    guiNumTileCacheStructs = sFiles;

    gpTileCacheStructInfo = MemAlloc(sizeof(TILE_CACHE_STRUCT) * sFiles);

    // Loop through and set filenames
    if (GetFileFirst("TILECACHE\\*.jsd", addressof(FileInfo))) {
      while (GetFileNext(addressof(FileInfo))) {
        sprintf(gpTileCacheStructInfo[cnt].Filename, "TILECACHE\\%s", FileInfo.zFileName);

        // Get root name
        GetRootName(gpTileCacheStructInfo[cnt].zRootName, gpTileCacheStructInfo[cnt].Filename);

        // Load struc data....
        gpTileCacheStructInfo[cnt].pStructureFileRef = LoadStructureFile(gpTileCacheStructInfo[cnt].Filename);

        if (stricmp(gpTileCacheStructInfo[cnt].zRootName, "l_dead1") == 0) {
          giDefaultStructIndex = cnt;
        }

        cnt++;
      }
      GetFileClose(addressof(FileInfo));
    }
  }

  return true;
}

export function DeleteTileCache(): void {
  let cnt: UINT32;

  // Allocate entries
  if (gpTileCache != null) {
    // Loop through and delete any entries
    for (cnt = 0; cnt < guiMaxTileCacheSize; cnt++) {
      if (gpTileCache[cnt].pImagery != null) {
        DeleteTileSurface(gpTileCache[cnt].pImagery);
      }
    }
    MemFree(gpTileCache);
  }

  if (gpTileCacheStructInfo != null) {
    MemFree(gpTileCacheStructInfo);
  }

  guiCurTileCacheSize = 0;
}

function FindCacheStructDataIndex(cFilename: Pointer<INT8>): INT16 {
  let cnt: UINT32;

  for (cnt = 0; cnt < guiNumTileCacheStructs; cnt++) {
    if (_stricmp(gpTileCacheStructInfo[cnt].zRootName, cFilename) == 0) {
      return cnt;
    }
  }

  return -1;
}

export function GetCachedTile(cFilename: Pointer<INT8>): INT32 {
  let cnt: UINT32;
  let ubLowestIndex: UINT32 = 0;
  let sMostHits: INT16 = 15000;

  // Check to see if surface exists already
  for (cnt = 0; cnt < guiCurTileCacheSize; cnt++) {
    if (gpTileCache[cnt].pImagery != null) {
      if (_stricmp(gpTileCache[cnt].zName, cFilename) == 0) {
        // Found surface, return
        gpTileCache[cnt].sHits++;
        return cnt;
      }
    }
  }

  // Check if max size has been reached
  if (guiCurTileCacheSize == guiMaxTileCacheSize) {
    // cache out least used file
    for (cnt = 0; cnt < guiCurTileCacheSize; cnt++) {
      if (gpTileCache[cnt].sHits < sMostHits) {
        sMostHits = gpTileCache[cnt].sHits;
        ubLowestIndex = cnt;
      }
    }

    // Bump off lowest index
    DeleteTileSurface(gpTileCache[ubLowestIndex].pImagery);

    // Decrement
    gpTileCache[ubLowestIndex].sHits = 0;
    gpTileCache[ubLowestIndex].pImagery = null;
    gpTileCache[ubLowestIndex].sStructRefID = -1;
  }

  // If here, Insert at an empty slot
  // Find an empty slot
  for (cnt = 0; cnt < guiMaxTileCacheSize; cnt++) {
    if (gpTileCache[cnt].pImagery == null) {
      // Insert here
      gpTileCache[cnt].pImagery = LoadTileSurface(cFilename);

      if (gpTileCache[cnt].pImagery == null) {
        return -1;
      }

      strcpy(gpTileCache[cnt].zName, cFilename);
      gpTileCache[cnt].sHits = 1;

      // Get root name
      GetRootName(gpTileCache[cnt].zRootName, cFilename);

      gpTileCache[cnt].sStructRefID = FindCacheStructDataIndex(gpTileCache[cnt].zRootName);

      // ATE: Add z-strip info
      if (gpTileCache[cnt].sStructRefID != -1) {
        AddZStripInfoToVObject(gpTileCache[cnt].pImagery.value.vo, gpTileCacheStructInfo[gpTileCache[cnt].sStructRefID].pStructureFileRef, true, 0);
      }

      if (gpTileCache[cnt].pImagery.value.pAuxData != null) {
        gpTileCache[cnt].ubNumFrames = gpTileCache[cnt].pImagery.value.pAuxData.value.ubNumberOfFrames;
      } else {
        gpTileCache[cnt].ubNumFrames = 1;
      }

      // Has our cache size increased?
      if (cnt >= guiCurTileCacheSize) {
        guiCurTileCacheSize = cnt + 1;
        ;
      }

      return cnt;
    }
  }

  // Can't find one!
  return -1;
}

export function RemoveCachedTile(iCachedTile: INT32): boolean {
  let cnt: UINT32;

  // Find tile
  for (cnt = 0; cnt < guiCurTileCacheSize; cnt++) {
    if (gpTileCache[cnt].pImagery != null) {
      if (cnt == iCachedTile) {
        // Found surface, decrement hits
        gpTileCache[cnt].sHits--;

        // Are we at zero?
        if (gpTileCache[cnt].sHits == 0) {
          DeleteTileSurface(gpTileCache[cnt].pImagery);
          gpTileCache[cnt].pImagery = null;
          gpTileCache[cnt].sStructRefID = -1;
          return true;
          ;
        }
      }
    }
  }

  return false;
}

function GetCachedTileVideoObject(iIndex: INT32): HVOBJECT {
  if (iIndex == -1) {
    return null;
  }

  if (gpTileCache[iIndex].pImagery == null) {
    return null;
  }

  return gpTileCache[iIndex].pImagery.value.vo;
}

function GetCachedTileStructureRef(iIndex: INT32): Pointer<STRUCTURE_FILE_REF> {
  if (iIndex == -1) {
    return null;
  }

  if (gpTileCache[iIndex].sStructRefID == -1) {
    return null;
  }

  return gpTileCacheStructInfo[gpTileCache[iIndex].sStructRefID].pStructureFileRef;
}

export function GetCachedTileStructureRefFromFilename(cFilename: Pointer<INT8>): Pointer<STRUCTURE_FILE_REF> {
  let sStructDataIndex: INT16;

  // Given filename, look for index
  sStructDataIndex = FindCacheStructDataIndex(cFilename);

  if (sStructDataIndex == -1) {
    return null;
  }

  return gpTileCacheStructInfo[sStructDataIndex].pStructureFileRef;
}

export function CheckForAndAddTileCacheStructInfo(pNode: Pointer<LEVELNODE>, sGridNo: INT16, usIndex: UINT16, usSubIndex: UINT16): void {
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;

  pStructureFileRef = GetCachedTileStructureRef(usIndex);

  if (pStructureFileRef != null) {
    if (!AddStructureToWorld(sGridNo, 0, addressof(pStructureFileRef.value.pDBStructureRef[usSubIndex]), pNode)) {
      if (giDefaultStructIndex != -1) {
        pStructureFileRef = gpTileCacheStructInfo[giDefaultStructIndex].pStructureFileRef;

        if (pStructureFileRef != null) {
          AddStructureToWorld(sGridNo, 0, addressof(pStructureFileRef.value.pDBStructureRef[usSubIndex]), pNode);
        }
      }
    }
  }
}

export function CheckForAndDeleteTileCacheStructInfo(pNode: Pointer<LEVELNODE>, usIndex: UINT16): void {
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;

  if (usIndex >= TILE_CACHE_START_INDEX) {
    pStructureFileRef = GetCachedTileStructureRef((usIndex - TILE_CACHE_START_INDEX));

    if (pStructureFileRef != null) {
      DeleteStructureFromWorld(pNode.value.pStructureData);
    }
  }
}

export function GetRootName(pDestStr: Pointer<INT8>, pSrcStr: Pointer<INT8>): void {
  // Remove path and extension
  let cTempFilename: INT8[] /* [120] */;
  let cEndOfName: STR;

  // Remove path
  strcpy(cTempFilename, pSrcStr);
  cEndOfName = strrchr(cTempFilename, '\\');
  if (cEndOfName != null) {
    cEndOfName++;
    strcpy(pDestStr, cEndOfName);
  } else {
    strcpy(pDestStr, cTempFilename);
  }

  // Now remove extension...
  cEndOfName = strchr(pDestStr, '.');
  if (cEndOfName != null) {
    cEndOfName.value = '\0';
  }
}

}
