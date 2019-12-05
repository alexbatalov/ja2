namespace ja2 {

const fs: typeof import('fs') = require('fs');

let guiNumTileCacheStructs: UINT32 = 0;
let guiMaxTileCacheSize: UINT32 = 50;
let guiCurTileCacheSize: UINT32 = 0;
let giDefaultStructIndex: INT32 = -1;

export let gpTileCache: TILE_CACHE_ELEMENT[] /* Pointer<TILE_CACHE_ELEMENT> */ = <TILE_CACHE_ELEMENT[]><unknown>null;
let gpTileCacheStructInfo: TILE_CACHE_STRUCT[] /* Pointer<TILE_CACHE_STRUCT> */ = <TILE_CACHE_STRUCT[]><unknown>null;

export function InitTileCache(): boolean {
  let cnt: UINT32;
  let FileInfo: GETFILESTRUCT;
  let sFiles: INT16 = 0;

  gpTileCache = createArrayFrom(guiMaxTileCacheSize, createTileCacheElement);

  // Zero entries
  for (cnt = 0; cnt < guiMaxTileCacheSize; cnt++) {
    gpTileCache[cnt].pImagery = null;
    gpTileCache[cnt].sStructRefID = -1;
  }

  guiCurTileCacheSize = 0;

  // OK, look for JSD files in the tile cache directory and
  // load any we find...
  const tileCacheDirName = fs.readdirSync('.').find(entry => entry.toLowerCase() === 'tilecache');
  if (tileCacheDirName) {
    const fileNames = fs.readdirSync(tileCacheDirName).filter(entry => entry.toLowerCase().endsWith('.jsd'));
    sFiles = fileNames.length;

    // Allocate memory...
    if (sFiles > 0) {
      cnt = 0;

      guiNumTileCacheStructs = sFiles;

      gpTileCacheStructInfo = createArrayFrom(sFiles, createTileCacheStruct);

      // Loop through and set filenames
      for (let i = 0; i < sFiles; i++) {
        gpTileCacheStructInfo[cnt].Filename = sprintf("%s\\%s", tileCacheDirName, fileNames[i]);

        // Get root name
        gpTileCacheStructInfo[cnt].zRootName = GetRootName(gpTileCacheStructInfo[cnt].Filename);

        // Load struc data....
        gpTileCacheStructInfo[cnt].pStructureFileRef = LoadStructureFile(gpTileCacheStructInfo[cnt].Filename);

        if (gpTileCacheStructInfo[cnt].zRootName.toLowerCase() == "l_dead1") {
          giDefaultStructIndex = cnt;
        }

        cnt++;
      }
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
        DeleteTileSurface(<TILE_IMAGERY>gpTileCache[cnt].pImagery);
      }
    }
    MemFree(gpTileCache);
  }

  if (gpTileCacheStructInfo != null) {
    MemFree(gpTileCacheStructInfo);
  }

  guiCurTileCacheSize = 0;
}

function FindCacheStructDataIndex(cFilename: string /* Pointer<INT8> */): INT16 {
  let cnt: UINT32;

  for (cnt = 0; cnt < guiNumTileCacheStructs; cnt++) {
    if (gpTileCacheStructInfo[cnt].zRootName.toLowerCase() === cFilename.toLowerCase()) {
      return cnt;
    }
  }

  return -1;
}

export function GetCachedTile(cFilename: string /* Pointer<INT8> */): INT32 {
  let cnt: UINT32;
  let ubLowestIndex: UINT32 = 0;
  let sMostHits: INT16 = 15000;
  let pImagery: TILE_IMAGERY | null;

  // Check to see if surface exists already
  for (cnt = 0; cnt < guiCurTileCacheSize; cnt++) {
    if (gpTileCache[cnt].pImagery != null) {
      if (gpTileCache[cnt].zName.toLowerCase() === cFilename.toLowerCase()) {
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
    DeleteTileSurface(<TILE_IMAGERY>gpTileCache[ubLowestIndex].pImagery);

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

      pImagery = gpTileCache[cnt].pImagery;
      if (pImagery == null) {
        return -1;
      }

      gpTileCache[cnt].zName = cFilename;
      gpTileCache[cnt].sHits = 1;

      // Get root name
      gpTileCache[cnt].zRootName = GetRootName(cFilename);

      gpTileCache[cnt].sStructRefID = FindCacheStructDataIndex(gpTileCache[cnt].zRootName);

      // ATE: Add z-strip info
      if (gpTileCache[cnt].sStructRefID != -1) {
        AddZStripInfoToVObject(pImagery.vo, <STRUCTURE_FILE_REF>gpTileCacheStructInfo[gpTileCache[cnt].sStructRefID].pStructureFileRef, true, 0);
      }

      if (pImagery.pAuxData != null) {
        gpTileCache[cnt].ubNumFrames = pImagery.pAuxData[0].ubNumberOfFrames;
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
          DeleteTileSurface(<TILE_IMAGERY>gpTileCache[cnt].pImagery);
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

function GetCachedTileStructureRef(iIndex: INT32): STRUCTURE_FILE_REF | null {
  if (iIndex == -1) {
    return null;
  }

  if (gpTileCache[iIndex].sStructRefID == -1) {
    return null;
  }

  return gpTileCacheStructInfo[gpTileCache[iIndex].sStructRefID].pStructureFileRef;
}

export function GetCachedTileStructureRefFromFilename(cFilename: string /* Pointer<INT8> */): STRUCTURE_FILE_REF | null {
  let sStructDataIndex: INT16;

  // Given filename, look for index
  sStructDataIndex = FindCacheStructDataIndex(cFilename);

  if (sStructDataIndex == -1) {
    return null;
  }

  return gpTileCacheStructInfo[sStructDataIndex].pStructureFileRef;
}

export function CheckForAndAddTileCacheStructInfo(pNode: LEVELNODE, sGridNo: INT16, usIndex: UINT16, usSubIndex: UINT16): void {
  let pStructureFileRef: STRUCTURE_FILE_REF | null;

  pStructureFileRef = GetCachedTileStructureRef(usIndex);

  if (pStructureFileRef != null) {
    if (!AddStructureToWorld(sGridNo, 0, pStructureFileRef.pDBStructureRef[usSubIndex], pNode)) {
      if (giDefaultStructIndex != -1) {
        pStructureFileRef = gpTileCacheStructInfo[giDefaultStructIndex].pStructureFileRef;

        if (pStructureFileRef != null) {
          AddStructureToWorld(sGridNo, 0, pStructureFileRef.pDBStructureRef[usSubIndex], pNode);
        }
      }
    }
  }
}

export function CheckForAndDeleteTileCacheStructInfo(pNode: LEVELNODE, usIndex: UINT16): void {
  let pStructureFileRef: STRUCTURE_FILE_REF | null;

  if (usIndex >= TILE_CACHE_START_INDEX) {
    pStructureFileRef = GetCachedTileStructureRef((usIndex - TILE_CACHE_START_INDEX));

    if (pStructureFileRef != null) {
      DeleteStructureFromWorld(pNode.pStructureData);
    }
  }
}

export function GetRootName(pSrcStr: string /* Pointer<INT8> */): string {
  let pDestStr: string;

  // Remove path and extension
  let cTempFilename: string /* INT8[120] */;
  let cEndOfName: number /* STR */;

  // Remove path
  cTempFilename = pSrcStr;
  cEndOfName = cTempFilename.lastIndexOf('\\');
  if (cEndOfName != -1) {
    cEndOfName++;
    pDestStr = cTempFilename.substring(cEndOfName);
  } else {
    pDestStr = cTempFilename;
  }

  // Now remove extension...
  cEndOfName = pDestStr.indexOf('.');
  if (cEndOfName != -1) {
    pDestStr = pDestStr.substring(0, cEndOfName);
  }

  return pDestStr;
}

}
