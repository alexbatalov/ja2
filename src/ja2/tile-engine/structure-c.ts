namespace ja2 {

/*
 * NB:  STRUCTURE_SPECIAL
 *
 * Means different things depending on the context.
 *
 * WALLNWINDOW SPECIAL - opaque to sight
 * MULTI SPECIAL - second level (damaged) MULTI structure, should only be deleted if
 *    starting with the deletion of a MULTI SPECIAL structure
 */

export let AtHeight: UINT8[] /* [PROFILE_Z_SIZE] */ = [
  0x01,
  0x02,
  0x04,
  0x08,
];

const FIRST_AVAILABLE_STRUCTURE_ID = (INVALID_STRUCTURE_ID + 2);

let gusNextAvailableStructureID: UINT16 = FIRST_AVAILABLE_STRUCTURE_ID;

let gpStructureFileRefs: STRUCTURE_FILE_REF | null = null;

let guiMaterialHitSound: INT32[] /* [NUM_MATERIAL_TYPES] */ = [
  -1,
  Enum330.S_WOOD_IMPACT1,
  Enum330.S_WOOD_IMPACT2,
  Enum330.S_WOOD_IMPACT3,
  Enum330.S_VEG_IMPACT1,
  -1,
  Enum330.S_PORCELAIN_IMPACT1,
  -1,
  -1,
  -1,

  -1,
  Enum330.S_STONE_IMPACT1,
  Enum330.S_STONE_IMPACT1,
  Enum330.S_STONE_IMPACT1,
  Enum330.S_STONE_IMPACT1,
  Enum330.S_RUBBER_IMPACT1,
  -1,
  -1,
  -1,
  -1,

  -1,
  Enum330.S_METAL_IMPACT1,
  Enum330.S_METAL_IMPACT2,
  Enum330.S_METAL_IMPACT3,
  Enum330.S_STONE_IMPACT1,
  Enum330.S_METAL_IMPACT3,
];

/*
index  1-10, organics
index 11-20, rocks and concretes
index 21-30, metals

index 1, dry timber
index 2, furniture wood
index 3, tree wood
index 11, stone masonry
index 12, non-reinforced concrete
index 13, reinforced concrete
index 14, rock
index 21, light metal (furniture)
index 22, heavy metal (doors etc)
index 23, really heavy metal
index 24, indestructable stone
index 25, indestructable metal
*/
export let gubMaterialArmour: UINT8[] /* [] */ = [
  // note: must increase; r.c. should block *AP* 7.62mm rounds
  0, // nothing
  25, // dry timber; wood wall +1/2
  20, // furniture wood (thin!) or plywood wall +1/2
  30, // wood (live); 1.5x timber
  3, // light vegetation
  10, // upholstered furniture
  47, // porcelain
  10, // cactus, hay, bamboo
  0,
  0,
  0,
  55, // stone masonry; 3x timber
  63, // non-reinforced concrete; 4x timber???
  70, // reinforced concrete; 6x timber
  85, // rock? - number invented
  9, // rubber - tires
  40, // sand
  1, // cloth
  40, // sandbag
  0,
  0,
  37, // light metal (furniture; NB thin!)
  57, // thicker metal (dumpster)
  85, // heavy metal (vault doors) - block everything
  // note that vehicle armour will probably end up in here
  127, // rock indestructable
  127, // indestructable
  57, // like 22 but with screen windows
];

// Function operating on a structure tile
function FilledTilePositions(pTile: DB_STRUCTURE_TILE): UINT8 {
  let ubFilled: UINT8 = 0;
  let ubShapeValue: UINT8;
  let bLoopX: INT8;
  let bLoopY: INT8;
  let bLoopZ: INT8;

  // Loop through all parts of a structure and add up the number of
  // filled spots
  for (bLoopX = 0; bLoopX < PROFILE_X_SIZE; bLoopX++) {
    for (bLoopY = 0; bLoopY < PROFILE_Y_SIZE; bLoopY++) {
      ubShapeValue = pTile.Shape[bLoopX][bLoopY];
      for (bLoopZ = 0; bLoopZ < PROFILE_Z_SIZE; bLoopZ++) {
        if (ubShapeValue & AtHeight[bLoopZ]) {
          ubFilled++;
        }
      }
    }
  }
  return ubFilled;
}

//
// Structure database functions
//

function FreeStructureFileRef(pFileRef: STRUCTURE_FILE_REF): void {
  // Frees all of the memory associated with a file reference, including
                                                          // the file reference structure itself

  let usLoop: UINT16;

  Assert(pFileRef != null);
}

export function FreeAllStructureFiles(): void {
  // Frees all of the structure database!
  let pFileRef: STRUCTURE_FILE_REF | null;
  let pNextRef: STRUCTURE_FILE_REF | null;

  pFileRef = gpStructureFileRefs;
  while (pFileRef != null) {
    pNextRef = pFileRef.pNext;
    FreeStructureFileRef(pFileRef);
    pFileRef = pNextRef;
  }
}

export function FreeStructureFile(pStructureFile: STRUCTURE_FILE_REF): boolean {
  if (!pStructureFile) {
    return false;
  }

  // unlink the file ref
  if (pStructureFile.pPrev != null) {
    pStructureFile.pPrev.pNext = pStructureFile.pNext;
  } else {
    // freeing the head of the list!
    gpStructureFileRefs = pStructureFile.pNext;
  }
  if (pStructureFile.pNext != null) {
    pStructureFile.pNext.pPrev = pStructureFile.pPrev;
  }
  if (pStructureFile.pPrev == null && pStructureFile.pNext == null) {
    // toasting the list!
    gpStructureFileRefs = null;
  }
  // and free all the structures used!
  FreeStructureFileRef(pStructureFile);
  return true;
}

function LoadStructureData(szFileName: string /* STR */, pFileRef: STRUCTURE_FILE_REF): UINT32
// UINT8 **ppubStructureData, UINT32 * puiDataSize, STRUCTURE_FILE_HEADER * pHeader )
{ // Loads a structure file's data as a honking chunk o' memory
  let uiStructureDataSize: UINT32 = 0;

  let hInput: HWFILE;
  let Header: STRUCTURE_FILE_HEADER = createStructureFileHeader();
  let uiBytesRead: UINT32;
  let uiDataSize: UINT32;
  let fOk: boolean;
  let buffer: Buffer;

  if (!szFileName) {
    return -1;
  }
  if (!pFileRef) {
    return -1;
  }
  hInput = FileOpen(szFileName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hInput == 0) {
    return -1;
  }

  buffer = Buffer.allocUnsafe(STRUCTURE_FILE_HEADER_SIZE);
  fOk = (uiBytesRead = FileRead(hInput, buffer, STRUCTURE_FILE_HEADER_SIZE)) !== -1;
  if (!fOk || uiBytesRead != STRUCTURE_FILE_HEADER_SIZE) {
    FileClose(hInput);
    return -1;
  }

  readStructureFileHeader(Header, buffer);

  if (Header.szId !== STRUCTURE_FILE_ID || Header.usNumberOfStructures == 0) {
    FileClose(hInput);
    return -1;
  }

  pFileRef.usNumberOfStructures = Header.usNumberOfStructures;
  if (Header.fFlags & STRUCTURE_FILE_CONTAINS_AUXIMAGEDATA) {
    uiDataSize = AUX_OBJECT_DATA_SIZE * Header.usNumberOfImages;
    pFileRef.pAuxData = createArrayFrom(Header.usNumberOfImages, createAuxObjectData);

    buffer = Buffer.allocUnsafe(uiDataSize);
    fOk = (uiBytesRead = FileRead(hInput, buffer, uiDataSize)) !== -1;
    if (!fOk || uiBytesRead != uiDataSize) {
      FileClose(hInput);
      return -1;
    }

    readObjectArray(pFileRef.pAuxData, buffer, 0, readAuxObjectData);

    if (Header.usNumberOfImageTileLocsStored > 0) {
      uiDataSize = RELATIVE_TILE_LOCATION_SIZE * Header.usNumberOfImageTileLocsStored;
      pFileRef.pTileLocData = createArrayFrom(Header.usNumberOfImageTileLocsStored, createRelativeTileLocation);

      buffer = Buffer.allocUnsafe(uiDataSize);
      fOk = (uiBytesRead = FileRead(hInput, buffer, uiDataSize)) !== -1;
      if (!fOk || uiBytesRead != uiDataSize) {
        FileClose(hInput);
        return -1;
      }

      readObjectArray(pFileRef.pTileLocData, buffer, 0, readRelativeTileLocation);
    }
  }

  if (Header.fFlags & STRUCTURE_FILE_CONTAINS_STRUCTUREDATA) {
    pFileRef.usNumberOfStructuresStored = Header.usNumberOfStructuresStored;
    uiDataSize = Header.usStructureDataSize;
    // Determine the size of the data, from the header just read,
    // allocate enough memory and read it in
    buffer = Buffer.allocUnsafe(uiDataSize);

    fOk = (uiBytesRead = FileRead(hInput, buffer, uiDataSize)) !== -1;
    if (!fOk || uiBytesRead != uiDataSize) {
      FileClose(hInput);
      return -1;
    }

    pFileRef.pubStructureData = buffer;
    uiStructureDataSize = uiDataSize;
  }
  FileClose(hInput);
  return uiStructureDataSize;
}

// Based on a file chunk, creates all the dynamic arrays for the
// structure definitions contained within
function CreateFileStructureArrays(pFileRef: STRUCTURE_FILE_REF, uiDataSize: UINT32): boolean {
  let pCurrent: number;
  let pDBStructureRef: DB_STRUCTURE_REF[];
  let ppTileArray: DB_STRUCTURE_TILE[];
  let usLoop: UINT16;
  let usIndex: UINT16;
  let usTileLoop: UINT16;
  let uiHitPoints: UINT32;
  let buffer: Buffer;
  let dbStructure: DB_STRUCTURE;

  buffer = pFileRef.pubStructureData;
  pCurrent = 0;

  pDBStructureRef = createArrayFrom(pFileRef.usNumberOfStructures, createDbStructureRef);;
  pFileRef.pDBStructureRef = pDBStructureRef;

  for (usLoop = 0; usLoop < pFileRef.usNumberOfStructuresStored; usLoop++) {
    if (pCurrent + DB_STRUCTURE_SIZE > uiDataSize) {
      // gone past end of file block?!
      // freeing of memory will occur outside of the function
      return false;
    }

    dbStructure = createDbStructure();
    readDbStructure(dbStructure, buffer, pCurrent);

    usIndex = dbStructure.usStructureNumber;
    pDBStructureRef[usIndex].pDBStructure = dbStructure;

    ppTileArray = createArrayFrom(pDBStructureRef[usIndex].pDBStructure.ubNumberOfTiles, createDbStructureTile);
    pDBStructureRef[usIndex].ppTile = ppTileArray;

    pCurrent += DB_STRUCTURE_SIZE;

    // Set things up to calculate hit points
    uiHitPoints = 0;
    for (usTileLoop = 0; usTileLoop < pDBStructureRef[usIndex].pDBStructure.ubNumberOfTiles; usTileLoop++) {
      if (pCurrent + DB_STRUCTURE_SIZE > uiDataSize) {
        // gone past end of file block?!
        // freeing of memory will occur outside of the function
        return false;
      }

      readDbStructureTile(ppTileArray[usTileLoop], buffer, pCurrent);

      // set the single-value relative position between this tile and the base tile
      ppTileArray[usTileLoop].sPosRelToBase = ppTileArray[usTileLoop].bXPosRelToBase + ppTileArray[usTileLoop].bYPosRelToBase * WORLD_COLS;
      uiHitPoints += FilledTilePositions(ppTileArray[usTileLoop]);
      pCurrent += DB_STRUCTURE_TILE_SIZE;
    }
    // scale hit points down to something reasonable...
    uiHitPoints = Math.trunc((uiHitPoints * 100) / 255);
    /*
    if (uiHitPoints > 255)
    {
            uiHitPoints = 255;
    }
    */
    pDBStructureRef[usIndex].pDBStructure.ubHitPoints = uiHitPoints;
    /*
    if (pDBStructureRef[usIndex].pDBStructure->usStructureNumber + 1 == pFileRef->usNumberOfStructures)
    {
            break;
    }
    */
  }
  return true;
}

export function LoadStructureFile(szFileName: string /* STR */): STRUCTURE_FILE_REF | null {
  // NB should be passed in expected number of structures so we can check equality
  let uiDataSize: UINT32 = 0;
  let fOk: boolean;
  let pFileRef: STRUCTURE_FILE_REF;

  pFileRef = createStructureFileRef();

  fOk = (uiDataSize = LoadStructureData(szFileName, pFileRef)) !== -1;
  if (!fOk) {
    return null;
  }
  if (pFileRef.pubStructureData != null) {
    fOk = CreateFileStructureArrays(pFileRef, uiDataSize);
    if (fOk == false) {
      FreeStructureFileRef(pFileRef);
      return null;
    }
  }
  // Add the file reference to the master list, at the head for convenience
  if (gpStructureFileRefs != null) {
    gpStructureFileRefs.pPrev = pFileRef;
  }
  pFileRef.pNext = gpStructureFileRefs;
  gpStructureFileRefs = pFileRef;
  return pFileRef;
}

//
// Structure creation functions
//

function CreateStructureFromDB(pDBStructureRef: DB_STRUCTURE_REF, ubTileNum: UINT8): STRUCTURE | null {
  // Creates a STRUCTURE struct for one tile of a structure
  let pStructure: STRUCTURE | null;
  let pDBStructure: DB_STRUCTURE;
  let pTile: DB_STRUCTURE_TILE | null;

  // set pointers to the DBStructure and Tile
  if (!pDBStructureRef) {
    return null;
  }
  if (!pDBStructureRef.pDBStructure) {
    return null;
  }
  pDBStructure = pDBStructureRef.pDBStructure;
  if (!pDBStructureRef.ppTile) {
    return null;
  }
  pTile = pDBStructureRef.ppTile[ubTileNum];
  if (!pTile) {
    return null;
  }

  // allocate memory...
  pStructure = createStructure();

  // setup
  pStructure.fFlags = pDBStructure.fFlags;
  pStructure.pShape = pTile.Shape;
  pStructure.pDBStructureRef = pDBStructureRef;
  if (pTile.sPosRelToBase == 0) {
    // base tile
    pStructure.fFlags |= STRUCTURE_BASE_TILE;
    pStructure.ubHitPoints = pDBStructure.ubHitPoints;
  }
  if (pDBStructure.ubWallOrientation != Enum314.NO_ORIENTATION) {
    if (pStructure.fFlags & STRUCTURE_WALL) {
      // for multi-tile walls, which are only the special corner pieces,
      // the non-base tile gets no orientation value because this copy
      // will be skipped
      if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
        pStructure.ubWallOrientation = pDBStructure.ubWallOrientation;
      }
    } else {
      pStructure.ubWallOrientation = pDBStructure.ubWallOrientation;
    }
  }
  pStructure.ubVehicleHitLocation = pTile.ubVehicleHitLocation;
  return pStructure;
}

function OkayToAddStructureToTile(sBaseGridNo: INT16, sCubeOffset: INT16, pDBStructureRef: DB_STRUCTURE_REF, ubTileIndex: UINT8, sExclusionID: INT16, fIgnorePeople: boolean): boolean {
  // Verifies whether a structure is blocked from being added to the map at a particular point
  let pDBStructure: DB_STRUCTURE;
  let ppTile: DB_STRUCTURE_TILE[];
  let pExistingStructure: STRUCTURE | null;
  let pOtherExistingStructure: STRUCTURE | null;
  let bLoop: INT8;
  let bLoop2: INT8;
  let sGridNo: INT16;
  let sOtherGridNo: INT16;

  ppTile = pDBStructureRef.ppTile;
  sGridNo = sBaseGridNo + ppTile[ubTileIndex].sPosRelToBase;
  if (sGridNo < 0 || sGridNo > WORLD_MAX) {
    return false;
  }

  if (gpWorldLevelData[sBaseGridNo].sHeight != gpWorldLevelData[sGridNo].sHeight) {
    // uneven terrain, one portion on top of cliff and another not! can't add!
    return false;
  }

  pDBStructure = pDBStructureRef.pDBStructure;
  pExistingStructure = gpWorldLevelData[sGridNo].pStructureHead;

  /*
          // If adding a mobile structure, always allow addition if the mobile structure tile is passable
          if ( (pDBStructure->fFlags & STRUCTURE_MOBILE) && (ppTile[ubTileIndex]->fFlags & TILE_PASSABLE) )
          {
                  return( TRUE );
          }
  */

  while (pExistingStructure != null) {
    if (sCubeOffset == pExistingStructure.sCubeOffset) {
      // CJC:
      // If adding a mobile structure, allow addition if existing structure is passable
      if ((pDBStructure.fFlags & STRUCTURE_MOBILE) && (pExistingStructure.fFlags & STRUCTURE_PASSABLE)) {
        // Skip!
        pExistingStructure = pExistingStructure.pNext;
        continue;
      }

      if (pDBStructure.fFlags & STRUCTURE_OBSTACLE) {
        // CJC: NB these next two if states are probably COMPLETELY OBSOLETE but I'm leaving
        // them in there for now (no harm done)

        // ATE:
        // ignore this one if it has the same ID num as exclusion
        if (sExclusionID != INVALID_STRUCTURE_ID) {
          if (pExistingStructure.usStructureID == sExclusionID) {
            // Skip!
            pExistingStructure = pExistingStructure.pNext;
            continue;
          }
        }

        if (fIgnorePeople) {
          // If we are a person, skip!
          if (pExistingStructure.usStructureID < TOTAL_SOLDIERS) {
            // Skip!
            pExistingStructure = pExistingStructure.pNext;
            continue;
          }
        }

        // two obstacle structures aren't allowed in the same tile at the same height
        // ATE: There is more sophisticated logic for mobiles, so postpone this check if mobile....
        if ((pExistingStructure.fFlags & STRUCTURE_OBSTACLE) && !(pDBStructure.fFlags & STRUCTURE_MOBILE)) {
          if (pExistingStructure.fFlags & STRUCTURE_PASSABLE && !(pExistingStructure.fFlags & STRUCTURE_MOBILE)) {
            // no mobiles, existing structure is passable
          } else {
            return false;
          }
        } else if ((pDBStructure.ubNumberOfTiles > 1) && (pExistingStructure.fFlags & STRUCTURE_WALLSTUFF)) {
          // if not an open door...
          if (!((pExistingStructure.fFlags & STRUCTURE_ANYDOOR) && (pExistingStructure.fFlags & STRUCTURE_OPEN))) {
            // we could be trying to place a multi-tile obstacle on top of a wall; we shouldn't
            // allow this if the structure is going to be on both sides of the wall
            for (bLoop = 1; bLoop < 4; bLoop++) {
              switch (pExistingStructure.ubWallOrientation) {
                case Enum314.OUTSIDE_TOP_LEFT:
                case Enum314.INSIDE_TOP_LEFT:
                  sOtherGridNo = NewGridNo(sGridNo, DirectionInc((bLoop + 2)));
                  break;
                case Enum314.OUTSIDE_TOP_RIGHT:
                case Enum314.INSIDE_TOP_RIGHT:
                  sOtherGridNo = NewGridNo(sGridNo, DirectionInc(bLoop));
                  break;
                default:
                  // @%?@#%?@%
                  sOtherGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTHEAST));
              }
              for (bLoop2 = 0; bLoop2 < pDBStructure.ubNumberOfTiles; bLoop2++) {
                if (sBaseGridNo + ppTile[bLoop2].sPosRelToBase == sOtherGridNo) {
                  // obstacle will straddle wall!
                  return false;
                }
              }
            }
          }
        }
      } else if (pDBStructure.fFlags & STRUCTURE_WALLSTUFF) {
        // two walls with the same alignment aren't allowed in the same tile
        if ((pExistingStructure.fFlags & STRUCTURE_WALLSTUFF) && (pDBStructure.ubWallOrientation == pExistingStructure.ubWallOrientation)) {
          return false;
        } else if (!(pExistingStructure.fFlags & (STRUCTURE_CORPSE | STRUCTURE_PERSON))) {
          // it's possible we're trying to insert this wall on top of a multitile obstacle
          for (bLoop = 1; bLoop < 4; bLoop++) {
            switch (pDBStructure.ubWallOrientation) {
              case Enum314.OUTSIDE_TOP_LEFT:
              case Enum314.INSIDE_TOP_LEFT:
                sOtherGridNo = NewGridNo(sGridNo, DirectionInc((bLoop + 2)));
                break;
              case Enum314.OUTSIDE_TOP_RIGHT:
              case Enum314.INSIDE_TOP_RIGHT:
                sOtherGridNo = NewGridNo(sGridNo, DirectionInc(bLoop));
                break;
              default:
                // @%?@#%?@%
                sOtherGridNo = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTHEAST));
                break;
            }
            for (ubTileIndex = 0; ubTileIndex < pDBStructure.ubNumberOfTiles; ubTileIndex++) {
              pOtherExistingStructure = FindStructureByID(sOtherGridNo, pExistingStructure.usStructureID);
              if (pOtherExistingStructure) {
                return false;
              }
            }
          }
        }
      }

      if (pDBStructure.fFlags & STRUCTURE_MOBILE) {
        // ATE:
        // ignore this one if it has the same ID num as exclusion
        if (sExclusionID != INVALID_STRUCTURE_ID) {
          if (pExistingStructure.usStructureID == sExclusionID) {
            // Skip!
            pExistingStructure = pExistingStructure.pNext;
            continue;
          }
        }

        if (fIgnorePeople) {
          // If we are a person, skip!
          if (pExistingStructure.usStructureID < TOTAL_SOLDIERS) {
            // Skip!
            pExistingStructure = pExistingStructure.pNext;
            continue;
          }
        }

        // ATE: Added check here - UNLESS the part we are trying to add is PASSABLE!
        if (pExistingStructure.fFlags & STRUCTURE_MOBILE && !(pExistingStructure.fFlags & STRUCTURE_PASSABLE) && !(ppTile[ubTileIndex].fFlags & TILE_PASSABLE)) {
          // don't allow 2 people in the same tile
          return false;
        }

        // ATE: Another rule: allow PASSABLE *IF* the PASSABLE is *NOT* MOBILE!
        if (!(pExistingStructure.fFlags & STRUCTURE_MOBILE) && (pExistingStructure.fFlags & STRUCTURE_PASSABLE)) {
          // Skip!
          pExistingStructure = pExistingStructure.pNext;
          continue;
        }

        // ATE: Added here - UNLESS this part is PASSABLE....
        // two obstacle structures aren't allowed in the same tile at the same height
        if ((pExistingStructure.fFlags & STRUCTURE_OBSTACLE) && !(ppTile[ubTileIndex].fFlags & TILE_PASSABLE)) {
          return false;
        }
      }

      if ((pDBStructure.fFlags & STRUCTURE_OPENABLE)) {
        if (pExistingStructure.fFlags & STRUCTURE_OPENABLE) {
          // don't allow two openable structures in the same tile or things will screw
          // up on an interface level
          return false;
        }
      }
    }

    pExistingStructure = pExistingStructure.pNext;
  }

  return true;
}

export function InternalOkayToAddStructureToWorld(sBaseGridNo: INT16, bLevel: INT8, pDBStructureRef: DB_STRUCTURE_REF, sExclusionID: INT16, fIgnorePeople: boolean): boolean {
  let ubLoop: UINT8;
  let sCubeOffset: INT16;

  if (!pDBStructureRef) {
    return false;
  }
  if (!pDBStructureRef.pDBStructure) {
    return false;
  }
  if (pDBStructureRef.pDBStructure.ubNumberOfTiles <= 0) {
    return false;
  }
  if (!pDBStructureRef.ppTile) {
    return false;
  }

  /*
          if (gpWorldLevelData[sGridNo].sHeight != sBaseTileHeight)
          {
                  // not level ground!
                  return( FALSE );
          }
  */

  for (ubLoop = 0; ubLoop < pDBStructureRef.pDBStructure.ubNumberOfTiles; ubLoop++) {
    if (pDBStructureRef.ppTile[ubLoop].fFlags & TILE_ON_ROOF) {
      if (bLevel == 0) {
        sCubeOffset = PROFILE_Z_SIZE;
      } else {
        return false;
      }
    } else {
      sCubeOffset = bLevel * PROFILE_Z_SIZE;
    }
    if (!OkayToAddStructureToTile(sBaseGridNo, sCubeOffset, pDBStructureRef, ubLoop, sExclusionID, fIgnorePeople)) {
      return false;
    }
  }
  return true;
}

export function OkayToAddStructureToWorld(sBaseGridNo: INT16, bLevel: INT8, pDBStructureRef: DB_STRUCTURE_REF, sExclusionID: INT16): boolean {
  return InternalOkayToAddStructureToWorld(sBaseGridNo, bLevel, pDBStructureRef, sExclusionID, (sExclusionID == IGNORE_PEOPLE_STRUCTURE_ID));
}

function AddStructureToTile(pMapElement: MAP_ELEMENT | null, pStructure: STRUCTURE | null, usStructureID: UINT16): boolean {
  // adds a STRUCTURE to a MAP_ELEMENT (adds part of a structure to a location on the map)
  let pStructureTail: STRUCTURE | null;

  if (!pMapElement) {
    return false;
  }
  if (!pStructure) {
    return false;
  }
  pStructureTail = pMapElement.pStructureTail;
  if (pStructureTail == null) {
    // set the head and tail to the new structure
    pMapElement.pStructureHead = pStructure;
  } else {
    // add to the end of the list
    pStructure.pPrev = pStructureTail;
    pStructureTail.pNext = pStructure;
  }
  pMapElement.pStructureTail = pStructure;
  pStructure.usStructureID = usStructureID;
  if (pStructure.fFlags & STRUCTURE_OPENABLE) {
    pMapElement.uiFlags |= MAPELEMENT_INTERACTIVETILE;
  }
  return true;
}

function InternalAddStructureToWorld(sBaseGridNo: INT16, bLevel: INT8, pDBStructureRef: DB_STRUCTURE_REF | null, pLevelNode: LEVELNODE | null): STRUCTURE | null {
  // Adds a complete structure to the world at a location plus all other locations covered by the structure
  let sGridNo: INT16;
  let ppStructure: STRUCTURE[];
  let pBaseStructure: STRUCTURE;
  let pDBStructure: DB_STRUCTURE | null;
  let ppTile: DB_STRUCTURE_TILE[];
  let ubLoop: UINT8;
  let ubLoop2: UINT8;
  let sBaseTileHeight: INT16 = -1;
  let usStructureID: UINT16;

  if (!pDBStructureRef) {
    return null;
  }
  if (!pLevelNode) {
    return null;
  }

  pDBStructure = pDBStructureRef.pDBStructure;
  if (!pDBStructure) {
    return null;
  }

  ppTile = pDBStructureRef.ppTile;
  if (!ppTile) {
    return null;
  }

  if (pDBStructure.ubNumberOfTiles <= 0) {
    return null;
  }

  // first check to see if the structure will be blocked
  if (!OkayToAddStructureToWorld(sBaseGridNo, bLevel, pDBStructureRef, INVALID_STRUCTURE_ID)) {
    return null;
  }

  // We go through a definition stage here and a later stage of
  // adding everything to the world so that we don't have to untangle
  // things if we run out of memory.  First we create an array of
  // pointers to point to all of the STRUCTURE elements created in
  // the first stage.  This array gets given to the base tile so
  // there is an easy way to remove an entire object from the world quickly

  // NB we add 1 because the 0th element is in fact the reference count!
  ppStructure = createArrayFrom(pDBStructure.ubNumberOfTiles, createStructure);

  for (ubLoop = BASE_TILE; ubLoop < pDBStructure.ubNumberOfTiles; ubLoop++) {
    // for each tile, create the appropriate STRUCTURE struct
    ppStructure[ubLoop] = <STRUCTURE>CreateStructureFromDB(pDBStructureRef, ubLoop);
    if (ppStructure[ubLoop] == null) {
      // Free allocated memory and abort!
      return null;
    }
    ppStructure[ubLoop].sGridNo = sBaseGridNo + ppTile[ubLoop].sPosRelToBase;
    if (ubLoop != BASE_TILE) {
      // Kris:
      // Added this undo code if in the editor.
      // It is important to save tiles effected by multitiles.  If the structure placement
      // fails below, it doesn't matter, because it won't hurt the undo code.
      if (gfEditMode)
        AddToUndoList(ppStructure[ubLoop].sGridNo);

      ppStructure[ubLoop].sBaseGridNo = sBaseGridNo;
    }
    if (ppTile[ubLoop].fFlags & TILE_ON_ROOF) {
      ppStructure[ubLoop].sCubeOffset = (bLevel + 1) * PROFILE_Z_SIZE;
    } else {
      ppStructure[ubLoop].sCubeOffset = bLevel * PROFILE_Z_SIZE;
    }
    if (ppTile[ubLoop].fFlags & TILE_PASSABLE) {
      ppStructure[ubLoop].fFlags |= STRUCTURE_PASSABLE;
    }
    if (pLevelNode.uiFlags & LEVELNODE_SOLDIER) {
      // should now be unncessary
      ppStructure[ubLoop].fFlags |= STRUCTURE_PERSON;
      ppStructure[ubLoop].fFlags &= ~(STRUCTURE_BLOCKSMOVES);
    } else if (pLevelNode.uiFlags & LEVELNODE_ROTTINGCORPSE || pDBStructure.fFlags & STRUCTURE_CORPSE) {
      ppStructure[ubLoop].fFlags |= STRUCTURE_CORPSE;
      // attempted check to screen this out for queen creature or vehicle
      if (pDBStructure.ubNumberOfTiles < 10) {
        ppStructure[ubLoop].fFlags |= STRUCTURE_PASSABLE;
        ppStructure[ubLoop].fFlags &= ~(STRUCTURE_BLOCKSMOVES);
      } else {
        // make sure not transparent
        ppStructure[ubLoop].fFlags &= ~(STRUCTURE_TRANSPARENT);
      }
    }
  }

  if (pLevelNode.uiFlags & LEVELNODE_SOLDIER) {
    // use the merc's ID as the structure ID for his/her structure
    usStructureID = pLevelNode.pSoldier.ubID;
  } else if (pLevelNode.uiFlags & LEVELNODE_ROTTINGCORPSE) {
    // ATE: Offset IDs so they don't collide with soldiers
    usStructureID = (TOTAL_SOLDIERS + pLevelNode.pAniTile.uiUserData);
  } else {
    gusNextAvailableStructureID++;
    if (gusNextAvailableStructureID == 0) {
      // skip past the #s for soldiers' structures and the invalid structure #
      gusNextAvailableStructureID = FIRST_AVAILABLE_STRUCTURE_ID;
    }
    usStructureID = gusNextAvailableStructureID;
  }
  // now add all these to the world!
  for (ubLoop = BASE_TILE; ubLoop < pDBStructure.ubNumberOfTiles; ubLoop++) {
    sGridNo = ppStructure[ubLoop].sGridNo;
    if (ubLoop == BASE_TILE) {
      sBaseTileHeight = gpWorldLevelData[sGridNo].sHeight;
    } else {
      if (gpWorldLevelData[sGridNo].sHeight != sBaseTileHeight) {
        // not level ground! abort!
        for (ubLoop2 = BASE_TILE; ubLoop2 < ubLoop; ubLoop2++) {
          DeleteStructureFromTile(gpWorldLevelData[ppStructure[ubLoop2].sGridNo], ppStructure[ubLoop2]);
        }
        return null;
      }
    }
    if (AddStructureToTile(gpWorldLevelData[sGridNo], ppStructure[ubLoop], usStructureID) == false) {
      // error! abort!
      for (ubLoop2 = BASE_TILE; ubLoop2 < ubLoop; ubLoop2++) {
        DeleteStructureFromTile(gpWorldLevelData[ppStructure[ubLoop2].sGridNo], ppStructure[ubLoop2]);
      }
      return null;
    }
  }

  pBaseStructure = ppStructure[BASE_TILE];
  pLevelNode.pStructureData = pBaseStructure;

  // And we're done! return a pointer to the base structure!

  return pBaseStructure;
}

export function AddStructureToWorld(sBaseGridNo: INT16, bLevel: INT8, pDBStructureRef: DB_STRUCTURE_REF | null, pLevelN: LEVELNODE | null): boolean {
  let pStructure: STRUCTURE | null;

  pStructure = InternalAddStructureToWorld(sBaseGridNo, bLevel, pDBStructureRef, pLevelN);
  if (pStructure == null) {
    return false;
  }
  return true;
}

//
// Structure deletion functions
//

function DeleteStructureFromTile(pMapElement: MAP_ELEMENT, pStructure: STRUCTURE): void {
  // removes a STRUCTURE element at a particular location from the world
  // put location pointer in tile
  if (pMapElement.pStructureHead == pStructure) {
    if (pMapElement.pStructureTail == pStructure) {
      // only element in the list!
      pMapElement.pStructureHead = null;
      pMapElement.pStructureTail = null;
    } else {
      // first element in the list of 2+ members
      pMapElement.pStructureHead = pStructure.pNext;
    }
  } else if (pMapElement.pStructureTail == pStructure) {
    // last element in the list
    (<STRUCTURE>pStructure.pPrev).pNext = null;
    pMapElement.pStructureTail = pStructure.pPrev;
  } else {
    // second or later element in the list; it's guaranteed that there is a
    // previous element but not necessary a next
    (<STRUCTURE>pStructure.pPrev).pNext = pStructure.pNext;
    if (pStructure.pNext != null) {
      pStructure.pNext.pPrev = pStructure.pPrev;
    }
  }
  if (pStructure.fFlags & STRUCTURE_OPENABLE) {
    // only one allowed in a tile, so we are safe to do this...
    pMapElement.uiFlags &= (~MAPELEMENT_INTERACTIVETILE);
  }
}

export function DeleteStructureFromWorld(pStructure: STRUCTURE | null): boolean {
  // removes all of the STRUCTURE elements for a structure from the world
  let pBaseMapElement: MAP_ELEMENT;
  let pBaseStructure: STRUCTURE | null;
  let ppTile: DB_STRUCTURE_TILE[];
  let pCurrent: STRUCTURE | null;
  let ubLoop: UINT8;
  let ubLoop2: UINT8;
  let ubNumberOfTiles: UINT8;
  let sBaseGridNo: INT16;
  let sGridNo: INT16;
  let usStructureID: UINT16;
  let fMultiStructure: boolean;
  let fRecompileMPs: boolean;
  let fRecompileExtraRadius: boolean; // for doors... yuck
  let sCheckGridNo: INT16;

  if (!pStructure) {
    return false;
  }

  pBaseStructure = FindBaseStructure(pStructure);
  if (!pBaseStructure) {
    return false;
  }

  usStructureID = pBaseStructure.usStructureID;
  fMultiStructure = ((pBaseStructure.fFlags & STRUCTURE_MULTI) != 0);
  fRecompileMPs = ((gsRecompileAreaLeft != 0) && !((pBaseStructure.fFlags & STRUCTURE_MOBILE) != 0));
  if (fRecompileMPs) {
    fRecompileExtraRadius = ((pBaseStructure.fFlags & STRUCTURE_WALLSTUFF) != 0);
  } else {
    fRecompileExtraRadius = false;
  }

  pBaseMapElement = gpWorldLevelData[pBaseStructure.sGridNo];
  ppTile = pBaseStructure.pDBStructureRef.ppTile;
  sBaseGridNo = pBaseStructure.sGridNo;
  ubNumberOfTiles = pBaseStructure.pDBStructureRef.pDBStructure.ubNumberOfTiles;
  // Free all the tiles
  for (ubLoop = BASE_TILE; ubLoop < ubNumberOfTiles; ubLoop++) {
    sGridNo = sBaseGridNo + ppTile[ubLoop].sPosRelToBase;
    // there might be two structures in this tile, one on each level, but we just want to
    // delete one on each pass
    pCurrent = FindStructureByID(sGridNo, usStructureID);
    if (pCurrent) {
      DeleteStructureFromTile(gpWorldLevelData[sGridNo], pCurrent);
    }

    if (!gfEditMode && (fRecompileMPs)) {
      if (fRecompileMPs) {
        AddTileToRecompileArea(sGridNo);
        if (fRecompileExtraRadius) {
          // add adjacent tiles too
          for (ubLoop2 = 0; ubLoop2 < Enum245.NUM_WORLD_DIRECTIONS; ubLoop2++) {
            sCheckGridNo = NewGridNo(sGridNo, DirectionInc(ubLoop2));
            if (sCheckGridNo != sGridNo) {
              AddTileToRecompileArea(sCheckGridNo);
            }
          }
        }
      }
    }
  }
  return true;
}

function InternalSwapStructureForPartner(sGridNo: INT16, pStructure: STRUCTURE | null, fFlipSwitches: boolean, fStoreInMap: boolean): STRUCTURE | null {
  // switch structure
  let pLevelNode: LEVELNODE | null;
  let pShadowNode: LEVELNODE | null;
  let pBaseStructure: STRUCTURE | null;
  let pNewBaseStructure: STRUCTURE | null;
  let pPartnerDBStructure: DB_STRUCTURE_REF;
  let fDoor: boolean;

  let bDelta: INT8;
  let ubHitPoints: UINT8;
  let sCubeOffset: INT16;

  if (pStructure == null) {
    return null;
  }
  pBaseStructure = FindBaseStructure(pStructure);
  if (!pBaseStructure) {
    return null;
  }
  if (pBaseStructure.pDBStructureRef.pDBStructure.bPartnerDelta == NO_PARTNER_STRUCTURE) {
    return null;
  }
  fDoor = ((pBaseStructure.fFlags & STRUCTURE_ANYDOOR) > 0);
  pLevelNode = FindLevelNodeBasedOnStructure(pBaseStructure.sGridNo, pBaseStructure);
  if (pLevelNode == null) {
    return null;
  }
  pShadowNode = FindShadow(pBaseStructure.sGridNo, pLevelNode.usIndex);

  // record values
  bDelta = pBaseStructure.pDBStructureRef.pDBStructure.bPartnerDelta;
  pPartnerDBStructure = pBaseStructure.pDBStructureRef + bDelta;
  sGridNo = pBaseStructure.sGridNo;
  ubHitPoints = pBaseStructure.ubHitPoints;
  sCubeOffset = pBaseStructure.sCubeOffset;
  // delete the old structure and add the new one
  if (DeleteStructureFromWorld(pBaseStructure) == false) {
    return null;
  }
  pNewBaseStructure = InternalAddStructureToWorld(sGridNo, Math.trunc(sCubeOffset / PROFILE_Z_SIZE), pPartnerDBStructure, pLevelNode);
  if (pNewBaseStructure == null) {
    return null;
  }
  // set values in the new structure
  pNewBaseStructure.ubHitPoints = ubHitPoints;
  if (!fDoor) {
    // swap the graphics

    // store removal of previous if necessary
    if (fStoreInMap) {
      ApplyMapChangesToMapTempFile(true);
      RemoveStructFromMapTempFile(sGridNo, pLevelNode.usIndex);
    }

    pLevelNode.usIndex += bDelta;

    // store removal of new one if necessary
    if (fStoreInMap) {
      AddStructToMapTempFile(sGridNo, pLevelNode.usIndex);
      ApplyMapChangesToMapTempFile(false);
    }

    if (pShadowNode != null) {
      pShadowNode.usIndex += bDelta;
    }
  }

  // if ( (pNewBaseStructure->fFlags & STRUCTURE_SWITCH) && (pNewBaseStructure->fFlags & STRUCTURE_OPEN) )
  if (0 /*fFlipSwitches*/) {
    if (pNewBaseStructure.fFlags & STRUCTURE_SWITCH) {
      // just turned a switch on!
      ActivateSwitchInGridNo(NOBODY, sGridNo);
    }
  }
  return pNewBaseStructure;
}

export function SwapStructureForPartner(sGridNo: INT16, pStructure: STRUCTURE | null): STRUCTURE | null {
  return InternalSwapStructureForPartner(sGridNo, pStructure, true, false);
}

export function SwapStructureForPartnerWithoutTriggeringSwitches(sGridNo: INT16, pStructure: STRUCTURE | null): STRUCTURE | null {
  return InternalSwapStructureForPartner(sGridNo, pStructure, false, false);
}

export function SwapStructureForPartnerAndStoreChangeInMap(sGridNo: INT16, pStructure: STRUCTURE | null): STRUCTURE | null {
  return InternalSwapStructureForPartner(sGridNo, pStructure, true, true);
}

export function FindStructure(sGridNo: INT16, fFlags: UINT32): STRUCTURE | null {
  // finds a structure that matches any of the given flags
  let pCurrent: STRUCTURE | null;

  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
  while (pCurrent != null) {
    if ((pCurrent.fFlags & fFlags) != 0) {
      return pCurrent;
    }
    pCurrent = pCurrent.pNext;
  }
  return null;
}

export function FindNextStructure(pStructure: STRUCTURE, fFlags: UINT32): STRUCTURE | null {
  let pCurrent: STRUCTURE | null;

  if (!pStructure) {
    return null;
  }
  pCurrent = pStructure.pNext;
  while (pCurrent != null) {
    if ((pCurrent.fFlags & fFlags) != 0) {
      return pCurrent;
    }
    pCurrent = pCurrent.pNext;
  }
  return null;
}

export function FindStructureByID(sGridNo: INT16, usStructureID: UINT16): STRUCTURE | null {
  // finds a structure that matches any of the given flags
  let pCurrent: STRUCTURE | null;

  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
  while (pCurrent != null) {
    if (pCurrent.usStructureID == usStructureID) {
      return pCurrent;
    }
    pCurrent = pCurrent.pNext;
  }
  return null;
}

export function FindBaseStructure(pStructure: STRUCTURE | null): STRUCTURE | null {
  // finds the base structure for any structure
  if (!pStructure) {
    return null;
  }
  if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
    return pStructure;
  }
  return FindStructureByID(pStructure.sBaseGridNo, pStructure.usStructureID);
}

function FindNonBaseStructure(sGridNo: INT16, pStructure: STRUCTURE | null): STRUCTURE | null {
  // finds a non-base structure in a location
  if (!pStructure) {
    return null;
  }
  if (!(pStructure.fFlags & STRUCTURE_BASE_TILE)) {
    // error!
    return null;
  }

  return FindStructureByID(sGridNo, pStructure.usStructureID);
}

function GetBaseTile(pStructure: STRUCTURE | null): INT16 {
  if (pStructure == null) {
    return -1;
  }
  if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
    return pStructure.sGridNo;
  } else {
    return pStructure.sBaseGridNo;
  }
}

export function StructureHeight(pStructure: STRUCTURE | null): INT8 {
  // return the height of an object from 1-4
  let ubLoopX: UINT8;
  let ubLoopY: UINT8;
  let pShape: PROFILE;
  let ubShapeValue: UINT8;
  let bLoopZ: INT8;
  let bGreatestHeight: INT8 = -1;

  if (pStructure == null || pStructure.pShape == null) {
    return 0;
  }

  if (pStructure.ubStructureHeight != 0) {
    return pStructure.ubStructureHeight;
  }

  pShape = pStructure.pShape;

  // loop horizontally on the X and Y planes
  for (ubLoopX = 0; ubLoopX < PROFILE_X_SIZE; ubLoopX++) {
    for (ubLoopY = 0; ubLoopY < PROFILE_Y_SIZE; ubLoopY++) {
      ubShapeValue = pShape[ubLoopX][ubLoopY];
      // loop DOWN vertically so that we find the tallest point first
      // and don't need to check any below it
      for (bLoopZ = PROFILE_Z_SIZE - 1; bLoopZ > bGreatestHeight; bLoopZ--) {
        if (ubShapeValue & AtHeight[bLoopZ]) {
          bGreatestHeight = bLoopZ;
          if (bGreatestHeight == PROFILE_Z_SIZE - 1) {
            // store height
            pStructure.ubStructureHeight = bGreatestHeight + 1;
            return bGreatestHeight + 1;
          }
          break;
        }
      }
    }
  }
  // store height
  pStructure.ubStructureHeight = bGreatestHeight + 1;
  return bGreatestHeight + 1;
}

export function GetTallestStructureHeight(sGridNo: INT16, fOnRoof: boolean): INT8 {
  let pCurrent: STRUCTURE | null;
  let iHeight: INT8;
  let iTallest: INT8 = 0;
  let sDesiredHeight: INT16;

  if (fOnRoof) {
    sDesiredHeight = STRUCTURE_ON_ROOF;
  } else {
    sDesiredHeight = STRUCTURE_ON_GROUND;
  }
  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
  while (pCurrent != null) {
    if (pCurrent.sCubeOffset == sDesiredHeight) {
      iHeight = StructureHeight(pCurrent);
      if (iHeight > iTallest) {
        iTallest = iHeight;
      }
    }
    pCurrent = pCurrent.pNext;
  }
  return iTallest;
}

export function GetStructureTargetHeight(sGridNo: INT16, fOnRoof: boolean): INT8 {
  let pCurrent: STRUCTURE | null;
  let iHeight: INT8;
  let iTallest: INT8 = 0;
  let sDesiredHeight: INT16;

  if (fOnRoof) {
    sDesiredHeight = STRUCTURE_ON_ROOF;
  } else {
    sDesiredHeight = STRUCTURE_ON_GROUND;
  }

  // prioritize openable structures and doors
  pCurrent = FindStructure(sGridNo, (STRUCTURE_DOOR | STRUCTURE_OPENABLE));
  if (pCurrent) {
    // use this structure
    if (pCurrent.fFlags & STRUCTURE_DOOR) {
      iTallest = 3; // don't aim at the very top of the door
    } else {
      iTallest = StructureHeight(pCurrent);
    }
  } else {
    pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
    while (pCurrent != null) {
      if (pCurrent.sCubeOffset == sDesiredHeight) {
        iHeight = StructureHeight(pCurrent);

        if (iHeight > iTallest) {
          iTallest = iHeight;
        }
      }
      pCurrent = pCurrent.pNext;
    }
  }
  return iTallest;
}

export function StructureBottomLevel(pStructure: STRUCTURE | null): INT8 {
  // return the bottom level of an object, from 1-4
  let ubLoopX: UINT8;
  let ubLoopY: UINT8;
  let pShape: PROFILE;
  let ubShapeValue: UINT8;
  let bLoopZ: INT8;
  let bLowestHeight: INT8 = PROFILE_Z_SIZE;

  if (pStructure == null || pStructure.pShape == null) {
    return 0;
  }
  pShape = pStructure.pShape;

  // loop horizontally on the X and Y planes
  for (ubLoopX = 0; ubLoopX < PROFILE_X_SIZE; ubLoopX++) {
    for (ubLoopY = 0; ubLoopY < PROFILE_Y_SIZE; ubLoopY++) {
      ubShapeValue = pShape[ubLoopX][ubLoopY];
      // loop DOWN vertically so that we find the tallest point first
      // and don't need to check any below it
      for (bLoopZ = 0; bLoopZ < bLowestHeight; bLoopZ++) {
        if (ubShapeValue & AtHeight[bLoopZ]) {
          bLowestHeight = bLoopZ;
          if (bLowestHeight == 0) {
            return 1;
          }
          break;
        }
      }
    }
  }
  return bLowestHeight + 1;
}

export function StructureDensity(pStructure: STRUCTURE | null, pubLevel0: Pointer<UINT8>, pubLevel1: Pointer<UINT8>, pubLevel2: Pointer<UINT8>, pubLevel3: Pointer<UINT8>): boolean {
  let ubLoopX: UINT8;
  let ubLoopY: UINT8;
  let ubShapeValue: UINT8;
  let pShape: PROFILE;

  if (!pStructure) {
    return false;
  }
  if (!pubLevel0) {
    return false;
  }
  if (!pubLevel1) {
    return false;
  }
  if (!pubLevel2) {
    return false;
  }
  if (!pubLevel3) {
    return false;
  }
  pubLevel0.value = 0;
  pubLevel1.value = 0;
  pubLevel2.value = 0;
  pubLevel3.value = 0;

  pShape = <PROFILE>pStructure.pShape;

  for (ubLoopX = 0; ubLoopX < PROFILE_X_SIZE; ubLoopX++) {
    for (ubLoopY = 0; ubLoopY < PROFILE_Y_SIZE; ubLoopY++) {
      ubShapeValue = pShape[ubLoopX][ubLoopY];
      if (ubShapeValue & AtHeight[0]) {
        (pubLevel0.value)++;
      }
      if (ubShapeValue & AtHeight[1]) {
        (pubLevel1.value)++;
      }
      if (ubShapeValue & AtHeight[2]) {
        (pubLevel2.value)++;
      }
      if (ubShapeValue & AtHeight[3]) {
        (pubLevel3.value)++;
      }
    }
  }
  // convert values to percentages!
  pubLevel0.value *= 4;
  pubLevel1.value *= 4;
  pubLevel2.value *= 4;
  pubLevel3.value *= 4;
  return true;
}

export function DamageStructure(pStructure: STRUCTURE | null, ubDamage: UINT8, ubReason: UINT8, sGridNo: INT16, sX: INT16, sY: INT16, ubOwner: UINT8): UINT8 {
  // do damage to a structure; returns TRUE if the structure should be removed

  let pBase: STRUCTURE | null;
  let ubArmour: UINT8;
  // LEVELNODE			*pNode;

  if (!pStructure) {
    return 0;
  }
  if (pStructure.fFlags & STRUCTURE_PERSON || pStructure.fFlags & STRUCTURE_CORPSE) {
    // don't hurt this structure, it's used for hit detection only!
    return 0;
  }

  if ((pStructure.pDBStructureRef.pDBStructure.ubArmour == Enum309.MATERIAL_INDESTRUCTABLE_METAL) || (pStructure.pDBStructureRef.pDBStructure.ubArmour == Enum309.MATERIAL_INDESTRUCTABLE_STONE)) {
    return 0;
  }

  // Account for armour!
  if (ubReason == STRUCTURE_DAMAGE_EXPLOSION) {
    if (pStructure.fFlags & STRUCTURE_EXPLOSIVE) {
      ubArmour = Math.trunc(gubMaterialArmour[pStructure.pDBStructureRef.pDBStructure.ubArmour] / 3);
    } else {
      ubArmour = Math.trunc(gubMaterialArmour[pStructure.pDBStructureRef.pDBStructure.ubArmour] / 2);
    }

    if (ubArmour > ubDamage) {
      // didn't even scratch the paint
      return 0;
    } else {
      // did some damage to the structure
      ubDamage -= ubArmour;
    }
  } else {
    ubDamage = 0;
  }

  // OK, Let's check our reason
  if (ubReason == STRUCTURE_DAMAGE_GUNFIRE) {
    // If here, we have penetrated, check flags
    // Are we an explodable structure?
    if ((pStructure.fFlags & STRUCTURE_EXPLOSIVE) && Random(2)) {
      // Remove struct!
      pBase = <STRUCTURE>FindBaseStructure(pStructure);

      // ATE: Set hit points to zero....
      pBase.ubHitPoints = 0;

      // Get LEVELNODE for struct and remove!
      // pNode = FindLevelNodeBasedOnStructure( pBase->sGridNo, pBase );

      // Set a flag indicating that the following changes are to go the the maps temp file
      // ApplyMapChangesToMapTempFile( TRUE );
      // Remove!
      // RemoveStructFromLevelNode( pBase->sGridNo, pNode );
      // ApplyMapChangesToMapTempFile( FALSE );

      // Generate an explosion here!
      IgniteExplosion(ubOwner, sX, sY, 0, sGridNo, Enum225.STRUCTURE_IGNITE, 0);

      // ATE: Return false here, as we are dealing with deleting the graphic here...
      return 0;
    }

    // Make hit sound....
    if (pStructure.fFlags & STRUCTURE_CAVEWALL) {
      PlayJA2Sample(Enum330.S_VEG_IMPACT1, RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
    } else {
      if (guiMaterialHitSound[pStructure.pDBStructureRef.pDBStructure.ubArmour] != -1) {
        PlayJA2Sample(guiMaterialHitSound[pStructure.pDBStructureRef.pDBStructure.ubArmour], RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
      }
    }
    // Don't update damage HPs....
    return 1;
  }

  // OK, LOOK FOR A SAM SITE, UPDATE....
  UpdateAndDamageSAMIfFound(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, sGridNo, ubDamage);

  // find the base so we can reduce the hit points!
  pBase = FindBaseStructure(pStructure);
  if (!pBase) {
    return 0;
  }
  if (pBase.ubHitPoints <= ubDamage) {
    // boom! structure destroyed!
    return 1;
  } else {
    pBase.ubHitPoints -= ubDamage;

    // Since the structure is being damaged, set the map element that a structure is damaged
    gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_STRUCTURE_DAMAGED;

    // We are a little damaged....
    return 2;
  }
}

const LINE_HEIGHT = 20;
/* static */ let DebugStructurePage1__WallOrientationString: string[] /* CHAR16[5][15] */ = [
  "None",
  "Inside left",
  "Inside right",
  "Outside left",
  "Outside right",
];
export function DebugStructurePage1(): void {
  let pStructure: STRUCTURE | null;
  let pBase: STRUCTURE | null;
  // LEVELNODE *		pLand;
  let sGridNo: INT16 = 0;
  let sDesiredLevel: INT16;
  let bHeight: INT8;
  let bDens: INT8[] = createArray(4, 0);
  let bStructures: INT8;

  SetFont(LARGEFONT1());
  gprintf(0, 0, "DEBUG STRUCTURES PAGE 1 OF 1");
  if (GetMouseMapPos(createPointer(() => sGridNo, (v) => sGridNo = v)) == false) {
    return;
    // gprintf( 0, LINE_HEIGHT * 1, L"No structure selected" );
  }

  if (gsInterfaceLevel == Enum214.I_GROUND_LEVEL) {
    sDesiredLevel = STRUCTURE_ON_GROUND;
  } else {
    sDesiredLevel = STRUCTURE_ON_ROOF;
  }

  gprintf(320, 0, "Building %d", gubBuildingInfo[sGridNo]);
  /*
  pLand = gpWorldLevelData[sGridNo].pLandHead;
  gprintf( 320, 0, L"Fake light %d", pLand->ubFakeShadeLevel );
  gprintf( 320, LINE_HEIGHT, L"Real light: ground %d roof %d", LightTrueLevel( sGridNo, 0 ), LightTrueLevel( sGridNo, 1 ) );
  */

  pStructure = gpWorldLevelData[sGridNo].pStructureHead;
  while (pStructure != null) {
    if (pStructure.sCubeOffset == sDesiredLevel) {
      break;
    }
    pStructure = pStructure.pNext;
  }

  if (pStructure != null) {
    if (pStructure.fFlags & STRUCTURE_GENERIC) {
      gprintf(0, LINE_HEIGHT * 1, "Generic structure %x #%d", pStructure.fFlags, pStructure.pDBStructureRef.pDBStructure.usStructureNumber);
    } else if (pStructure.fFlags & STRUCTURE_TREE) {
      gprintf(0, LINE_HEIGHT * 1, "Tree");
    } else if (pStructure.fFlags & STRUCTURE_WALL) {
      gprintf(0, LINE_HEIGHT * 1, "Wall with orientation %s", DebugStructurePage1__WallOrientationString[pStructure.ubWallOrientation]);
    } else if (pStructure.fFlags & STRUCTURE_WALLNWINDOW) {
      gprintf(0, LINE_HEIGHT * 1, "Wall with window");
    } else if (pStructure.fFlags & STRUCTURE_VEHICLE) {
      gprintf(0, LINE_HEIGHT * 1, "Vehicle %d", pStructure.pDBStructureRef.pDBStructure.usStructureNumber);
    } else if (pStructure.fFlags & STRUCTURE_NORMAL_ROOF) {
      gprintf(0, LINE_HEIGHT * 1, "Roof");
    } else if (pStructure.fFlags & STRUCTURE_SLANTED_ROOF) {
      gprintf(0, LINE_HEIGHT * 1, "Slanted roof");
    } else if (pStructure.fFlags & STRUCTURE_DOOR) {
      gprintf(0, LINE_HEIGHT * 1, "Door with orientation %s", DebugStructurePage1__WallOrientationString[pStructure.ubWallOrientation]);
    } else if (pStructure.fFlags & STRUCTURE_SLIDINGDOOR) {
      gprintf(0, LINE_HEIGHT * 1, "%s sliding door with orientation %s", (pStructure.fFlags & STRUCTURE_OPEN) ? "Open" : "Closed", DebugStructurePage1__WallOrientationString[pStructure.ubWallOrientation]);
    } else if (pStructure.fFlags & STRUCTURE_DDOOR_LEFT) {
      gprintf(0, LINE_HEIGHT * 1, "DDoorLft with orientation %s", DebugStructurePage1__WallOrientationString[pStructure.ubWallOrientation]);
    } else if (pStructure.fFlags & STRUCTURE_DDOOR_RIGHT) {
      gprintf(0, LINE_HEIGHT * 1, "DDoorRt with orientation %s", DebugStructurePage1__WallOrientationString[pStructure.ubWallOrientation]);
    } else {
      gprintf(0, LINE_HEIGHT * 1, "UNKNOWN STRUCTURE! (%x)", pStructure.fFlags);
    }
    bHeight = StructureHeight(pStructure);
    pBase = <STRUCTURE>FindBaseStructure(pStructure);
    gprintf(0, LINE_HEIGHT * 2, "Structure height %d, cube offset %d, armour %d, HP %d", bHeight, pStructure.sCubeOffset, gubMaterialArmour[pStructure.pDBStructureRef.pDBStructure.ubArmour], pBase.ubHitPoints);
    if (StructureDensity(pStructure, createElementPointer(bDens, 0), createElementPointer(bDens, 1), createElementPointer(bDens, 2), createElementPointer(bDens, 3)) == true) {
      gprintf(0, LINE_HEIGHT * 3, "Structure fill %d%%/%d%%/%d%%/%d%% density %d", bDens[0], bDens[1], bDens[2], bDens[3], pStructure.pDBStructureRef.pDBStructure.ubDensity);
    }

    gprintf(0, LINE_HEIGHT * 4, "Structure ID %d", pStructure.usStructureID);

    pStructure = gpWorldLevelData[sGridNo].pStructureHead;
    for (bStructures = 0; pStructure != null; pStructure = pStructure.pNext) {
      bStructures++;
    }
    gprintf(0, LINE_HEIGHT * 12, "Number of structures = %d", bStructures);
  }
  gprintf(0, LINE_HEIGHT * 13, "N %d NE %d E %d SE %d", gubWorldMovementCosts[sGridNo][Enum245.NORTH][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.NORTHEAST][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.EAST][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.SOUTHEAST][gsInterfaceLevel]);
  gprintf(0, LINE_HEIGHT * 14, "S %d SW %d W %d NW %d", gubWorldMovementCosts[sGridNo][Enum245.SOUTH][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.SOUTHWEST][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.WEST][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.NORTHWEST][gsInterfaceLevel]);
  gprintf(0, LINE_HEIGHT * 15, "Ground smell %d strength %d", SMELL_TYPE(gpWorldLevelData[sGridNo].ubSmellInfo), SMELL_STRENGTH(gpWorldLevelData[sGridNo].ubSmellInfo));

  gprintf(0, LINE_HEIGHT * 16, "Adj soldiers %d", gpWorldLevelData[sGridNo].ubAdjacentSoldierCnt);
}

export function AddZStripInfoToVObject(hVObject: SGPVObject, pStructureFileRef: STRUCTURE_FILE_REF, fFromAnimation: boolean, sSTIStartIndex: INT16): boolean {
  let uiLoop: UINT32;
  let ubLoop2: UINT8;
  let ubNumIncreasing: UINT8 = 0;
  let ubNumStable: UINT8 = 0;
  let ubNumDecreasing: UINT8 = 0;
  let fFound: boolean = false;
  let pCurr: ZStripInfo;
  let sLeftHalfWidth: INT16;
  let sRightHalfWidth: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let pDBStructureRef: DB_STRUCTURE_REF;
  let pDBStructure: DB_STRUCTURE | null = null;
  let sSTIStep: INT16 = 0;
  let sStructIndex: INT16 = 0;
  let sNext: INT16;
  let uiDestVoIndex: UINT32;
  let fCopyIntoVo: boolean;
  let fFirstTime: boolean;

  if (pStructureFileRef.usNumberOfStructuresStored == 0) {
    return true;
  }
  for (uiLoop = 0; uiLoop < pStructureFileRef.usNumberOfStructures; uiLoop++) {
    pDBStructureRef = pStructureFileRef.pDBStructureRef[uiLoop];
    pDBStructure = pDBStructureRef.pDBStructure;
    // if (pDBStructure != NULL && pDBStructure->ubNumberOfTiles > 1 && !(pDBStructure->fFlags & STRUCTURE_WALLSTUFF) )
    if (pDBStructure != null && pDBStructure.ubNumberOfTiles > 1) {
      for (ubLoop2 = 1; ubLoop2 < pDBStructure.ubNumberOfTiles; ubLoop2++) {
        if (pDBStructureRef.ppTile[ubLoop2].sPosRelToBase != 0) {
          // spans multiple tiles! (could be two levels high in one tile)
          fFound = true;
          break;
        }
      }
    }
  }

  // ATE: Make all corpses use z-strip info..
  if (pDBStructure != null && pDBStructure.fFlags & STRUCTURE_CORPSE) {
    fFound = true;
  }

  if (!fFound) {
    // no multi-tile images in this vobject; that's okay... return!
    return true;
  }
  hVObject.ppZStripInfo = createArray(hVObject.usNumberOfObjects, <ZStripInfo><unknown>null);

  if (fFromAnimation) {
    // Determine step index for STI
    if (sSTIStartIndex == -1) {
      // one-direction only for this anim structure
      sSTIStep = hVObject.usNumberOfObjects;
      sSTIStartIndex = 0;
    } else {
      sSTIStep = Math.trunc(hVObject.usNumberOfObjects / pStructureFileRef.usNumberOfStructures);
    }
  } else {
    sSTIStep = 1;
  }

  sStructIndex = 0;
  sNext = sSTIStartIndex + sSTIStep;
  fFirstTime = true;

  for (uiLoop = sSTIStartIndex; uiLoop < hVObject.usNumberOfObjects; uiLoop++) {
    // Defualt to true
    fCopyIntoVo = true;

    // Increment struct index....
    if (uiLoop == sNext) {
      sNext = (uiLoop + sSTIStep);
      sStructIndex++;
    } else {
      if (fFirstTime) {
        fFirstTime = false;
      } else {
        fCopyIntoVo = false;
      }
    }

    if (fFromAnimation) {
      uiDestVoIndex = sStructIndex;
    } else {
      uiDestVoIndex = uiLoop;
    }

    if (fCopyIntoVo && sStructIndex < pStructureFileRef.usNumberOfStructures) {
      pDBStructure = pStructureFileRef.pDBStructureRef[sStructIndex].pDBStructure;
      if (pDBStructure != null && (pDBStructure.ubNumberOfTiles > 1 || (pDBStructure.fFlags & STRUCTURE_CORPSE)))
      // if (pDBStructure != NULL && pDBStructure->ubNumberOfTiles > 1 )
      {
        // ATE: We allow SLIDING DOORS of 2 tile sizes...
        if (!(pDBStructure.fFlags & STRUCTURE_ANYDOOR) || ((pDBStructure.fFlags & (STRUCTURE_ANYDOOR)) && (pDBStructure.fFlags & STRUCTURE_SLIDINGDOOR))) {
          hVObject.ppZStripInfo[uiDestVoIndex] = createZStripInfo();
          pCurr = hVObject.ppZStripInfo[uiDestVoIndex];

          ubNumIncreasing = 0;
          ubNumStable = 0;
          ubNumDecreasing = 0;

          // time to do our calculations!
          sOffsetX = hVObject.pETRLEObject[uiLoop].sOffsetX;
          sOffsetY = hVObject.pETRLEObject[uiLoop].sOffsetY;
          usWidth = hVObject.pETRLEObject[uiLoop].usWidth;
          usHeight = hVObject.pETRLEObject[uiLoop].usHeight;
          if (pDBStructure.fFlags & (STRUCTURE_MOBILE | STRUCTURE_CORPSE)) {
            let i: UINT32 = 0;
            // adjust for the difference between the animation and structure base tile

            // if (pDBStructure->fFlags & (STRUCTURE_MOBILE ) )
            {
              sOffsetX = sOffsetX + Math.trunc(WORLD_TILE_X / 2);
              sOffsetY = sOffsetY + Math.trunc(WORLD_TILE_Y / 2);
            }
            // adjust for the tile offset
            sOffsetX = sOffsetX - pDBStructure.bZTileOffsetX * Math.trunc(WORLD_TILE_X / 2) + pDBStructure.bZTileOffsetY * Math.trunc(WORLD_TILE_X / 2);
            sOffsetY = sOffsetY - pDBStructure.bZTileOffsetY * Math.trunc(WORLD_TILE_Y / 2);
          }

          // figure out how much of the image is on each side of
          // the bottom corner of the base tile
          if (sOffsetX <= 0) {
            // note that the adjustments here by (WORLD_TILE_X / 2) are to account for the X difference
            // between the blit position and the bottom corner of the base tile
            sRightHalfWidth = usWidth + sOffsetX - Math.trunc(WORLD_TILE_X / 2);

            if (sRightHalfWidth >= 0) {
              // Case 1: negative image offset, image straddles bottom corner

              // negative of a negative is positive
              sLeftHalfWidth = -sOffsetX + Math.trunc(WORLD_TILE_X / 2);
            } else {
              // Case 2: negative image offset, image all on left side

              // bump up the LeftHalfWidth to the right edge of the last tile-half,
              // so we can calculate the size of the leftmost portion accurately
              // NB subtracting a negative to add the absolute value
              sLeftHalfWidth = usWidth - (sRightHalfWidth % Math.trunc(WORLD_TILE_X / 2));
              sRightHalfWidth = 0;
            }
          } else if (sOffsetX < Math.trunc(WORLD_TILE_X / 2)) {
            sLeftHalfWidth = Math.trunc(WORLD_TILE_X / 2) - sOffsetX;
            sRightHalfWidth = usWidth - sLeftHalfWidth;
            if (sRightHalfWidth <= 0) {
              // Case 3: positive offset < 20, image all on left side
              // should never happen because these images are multi-tile!
              sRightHalfWidth = 0;
              // fake the left width to one half-tile
              sLeftHalfWidth = Math.trunc(WORLD_TILE_X / 2);
            } else {
              // Case 4: positive offset < 20, image straddles bottom corner

              // all okay?
            }
          } else {
            // Case 5: positive offset, image all on right side
            // should never happen either
            sLeftHalfWidth = 0;
            sRightHalfWidth = usWidth;
          }

          if (sLeftHalfWidth > 0) {
            ubNumIncreasing = Math.trunc(sLeftHalfWidth / Math.trunc(WORLD_TILE_X / 2));
          }
          if (sRightHalfWidth > 0) {
            ubNumStable = 1;
            if (sRightHalfWidth > Math.trunc(WORLD_TILE_X / 2)) {
              ubNumDecreasing = Math.trunc(sRightHalfWidth / Math.trunc(WORLD_TILE_X / 2));
            }
          }
          if (sLeftHalfWidth > 0) {
            pCurr.ubFirstZStripWidth = sLeftHalfWidth % Math.trunc(WORLD_TILE_X / 2);
            if (pCurr.ubFirstZStripWidth == 0) {
              ubNumIncreasing--;
              pCurr.ubFirstZStripWidth = Math.trunc(WORLD_TILE_X / 2);
            }
          } else // right side only; offset is at least 20 (= WORLD_TILE_X / 2)
          {
            if (sOffsetX > WORLD_TILE_X) {
              pCurr.ubFirstZStripWidth = Math.trunc(WORLD_TILE_X / 2) - (sOffsetX - WORLD_TILE_X) % Math.trunc(WORLD_TILE_X / 2);
            } else {
              pCurr.ubFirstZStripWidth = WORLD_TILE_X - sOffsetX;
            }
            if (pCurr.ubFirstZStripWidth == 0) {
              ubNumDecreasing--;
              pCurr.ubFirstZStripWidth = Math.trunc(WORLD_TILE_X / 2);
            }
          }

          // now create the array!
          pCurr.ubNumberOfZChanges = ubNumIncreasing + ubNumStable + ubNumDecreasing;
          pCurr.pbZChange = new Int8Array(pCurr.ubNumberOfZChanges);

          for (ubLoop2 = 0; ubLoop2 < ubNumIncreasing; ubLoop2++) {
            pCurr.pbZChange[ubLoop2] = 1;
          }
          for (; ubLoop2 < ubNumIncreasing + ubNumStable; ubLoop2++) {
            pCurr.pbZChange[ubLoop2] = 0;
          }
          for (; ubLoop2 < pCurr.ubNumberOfZChanges; ubLoop2++) {
            pCurr.pbZChange[ubLoop2] = -1;
          }
          if (ubNumIncreasing > 0) {
            pCurr.bInitialZChange = -(ubNumIncreasing);
          } else if (ubNumStable > 0) {
            pCurr.bInitialZChange = 0;
          } else {
            pCurr.bInitialZChange = -(ubNumDecreasing);
          }
        }
      }
    }
  }
  return true;
}

function InitStructureDB(): boolean {
  gusNextAvailableStructureID = FIRST_AVAILABLE_STRUCTURE_ID;
  return true;
}

function FiniStructureDB(): boolean {
  gusNextAvailableStructureID = FIRST_AVAILABLE_STRUCTURE_ID;
  return true;
}

export function GetBlockingStructureInfo(sGridNo: INT16, bDir: INT8, bNextDir: INT8, bLevel: INT8, pStructHeight: Pointer<INT8>, ppTallestStructure: Pointer<STRUCTURE | null>, fWallsBlock: boolean): INT8 {
  let pCurrent: STRUCTURE | null;
  let pStructure: STRUCTURE | null = <STRUCTURE><unknown>null;
  let sDesiredLevel: INT16;
  let fOKStructOnLevel: boolean = false;
  let fMinimumBlockingFound: boolean = false;

  if (bLevel == 0) {
    sDesiredLevel = STRUCTURE_ON_GROUND;
  } else {
    sDesiredLevel = STRUCTURE_ON_ROOF;
  }

  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;

  // If no struct, return
  if (pCurrent == null) {
    (pStructHeight.value) = StructureHeight(pCurrent);
    (ppTallestStructure.value) = null;
    return NOTHING_BLOCKING;
  }

  while (pCurrent != null) {
    // Check level!
    if (pCurrent.sCubeOffset == sDesiredLevel) {
      fOKStructOnLevel = true;
      pStructure = pCurrent;

      // Turn off if we are on upper level!
      if (pCurrent.fFlags & STRUCTURE_ROOF && bLevel == 1) {
        fOKStructOnLevel = false;
      }

      // Don't stop FOV for people
      if (pCurrent.fFlags & (STRUCTURE_CORPSE | STRUCTURE_PERSON)) {
        fOKStructOnLevel = false;
      }

      if (pCurrent.fFlags & (STRUCTURE_TREE | STRUCTURE_ANYFENCE)) {
        fMinimumBlockingFound = true;
      }

      // Default, if we are a wall, set full blocking
      if ((pCurrent.fFlags & STRUCTURE_WALL) && !fWallsBlock) {
        // Return full blocking!
        // OK! This will be handled by movement costs......!
        fOKStructOnLevel = false;
      }

      // CHECK FOR WINDOW
      if (pCurrent.fFlags & STRUCTURE_WALLNWINDOW) {
        switch (pCurrent.ubWallOrientation) {
          case Enum314.OUTSIDE_TOP_LEFT:
          case Enum314.INSIDE_TOP_LEFT:

            (pStructHeight.value) = StructureHeight(pCurrent);
            (ppTallestStructure.value) = pCurrent;

            if (pCurrent.fFlags & STRUCTURE_OPEN) {
              return BLOCKING_TOPLEFT_OPEN_WINDOW;
            } else {
              return BLOCKING_TOPLEFT_WINDOW;
            }
            break;

          case Enum314.OUTSIDE_TOP_RIGHT:
          case Enum314.INSIDE_TOP_RIGHT:

            (pStructHeight.value) = StructureHeight(pCurrent);
            (ppTallestStructure.value) = pCurrent;

            if (pCurrent.fFlags & STRUCTURE_OPEN) {
              return BLOCKING_TOPRIGHT_OPEN_WINDOW;
            } else {
              return BLOCKING_TOPRIGHT_WINDOW;
            }
            break;
        }
      }

      // Check for door
      if (pCurrent.fFlags & STRUCTURE_ANYDOOR) {
        // If we are not opem, we are full blocking!
        if (!(pCurrent.fFlags & STRUCTURE_OPEN)) {
          (pStructHeight.value) = StructureHeight(pCurrent);
          (ppTallestStructure.value) = pCurrent;
          return FULL_BLOCKING;
          break;
        } else {
          switch (pCurrent.ubWallOrientation) {
            case Enum314.OUTSIDE_TOP_LEFT:
            case Enum314.INSIDE_TOP_LEFT:

              (pStructHeight.value) = StructureHeight(pCurrent);
              (ppTallestStructure.value) = pCurrent;
              return BLOCKING_TOPLEFT_DOOR;
              break;

            case Enum314.OUTSIDE_TOP_RIGHT:
            case Enum314.INSIDE_TOP_RIGHT:

              (pStructHeight.value) = StructureHeight(pCurrent);
              (ppTallestStructure.value) = pCurrent;
              return BLOCKING_TOPRIGHT_DOOR;
              break;
          }
        }
      }
    }
    pCurrent = pCurrent.pNext;
  }

  // OK, here, we default to we've seen a struct, reveal just this one
  if (fOKStructOnLevel) {
    if (fMinimumBlockingFound) {
      (pStructHeight.value) = StructureHeight(pStructure);
      (ppTallestStructure.value) = pStructure;
      return BLOCKING_REDUCE_RANGE;
    } else {
      (pStructHeight.value) = StructureHeight(pStructure);
      (ppTallestStructure.value) = pStructure;
      return BLOCKING_NEXT_TILE;
    }
  } else {
    (pStructHeight.value) = 0;
    (ppTallestStructure.value) = null;
    return NOTHING_BLOCKING;
  }
}

export function StructureFlagToType(uiFlag: UINT32): UINT8 {
  let ubLoop: UINT8;
  let uiBit: UINT32 = STRUCTURE_GENERIC;

  for (ubLoop = 8; ubLoop < 32; ubLoop++) {
    if ((uiFlag & uiBit) != 0) {
      return ubLoop;
    }
    uiBit = uiBit << 1;
  }
  return 0;
}

function StructureTypeToFlag(ubType: UINT8): UINT32 {
  let uiFlag: UINT32 = 0x1;

  uiFlag = uiFlag << ubType;
  return uiFlag;
}

export function FindStructureBySavedInfo(sGridNo: INT16, ubType: UINT8, ubWallOrientation: UINT8, bLevel: INT8): STRUCTURE | null {
  let pCurrent: STRUCTURE | null;
  let uiTypeFlag: UINT32;

  uiTypeFlag = StructureTypeToFlag(ubType);

  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
  while (pCurrent != null) {
    if (pCurrent.fFlags & uiTypeFlag && pCurrent.ubWallOrientation == ubWallOrientation && ((bLevel == 0 && pCurrent.sCubeOffset == 0) || (bLevel > 0 && pCurrent.sCubeOffset > 0))) {
      return pCurrent;
    }
    pCurrent = pCurrent.pNext;
  }
  return null;
}

export function GetStructureOpenSound(pStructure: STRUCTURE, fClose: boolean): UINT32 {
  let uiSoundID: UINT32;

  switch (pStructure.pDBStructureRef.pDBStructure.ubArmour) {
    case Enum309.MATERIAL_LIGHT_METAL:
    case Enum309.MATERIAL_THICKER_METAL:

      uiSoundID = Enum330.OPEN_LOCKER;
      break;

    case Enum309.MATERIAL_WOOD_WALL:
    case Enum309.MATERIAL_PLYWOOD_WALL:
    case Enum309.MATERIAL_FURNITURE:

      uiSoundID = Enum330.OPEN_WOODEN_BOX;
      break;

    default:
      uiSoundID = Enum330.OPEN_DEFAULT_OPENABLE;
  }

  if (fClose) {
    uiSoundID++;
  }

  return uiSoundID;
}

}
