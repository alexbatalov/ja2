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

let gpStructureFileRefs: Pointer<STRUCTURE_FILE_REF>;

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
function FilledTilePositions(pTile: Pointer<DB_STRUCTURE_TILE>): UINT8 {
  let ubFilled: UINT8 = 0;
  let ubShapeValue: UINT8;
  let bLoopX: INT8;
  let bLoopY: INT8;
  let bLoopZ: INT8;

  // Loop through all parts of a structure and add up the number of
  // filled spots
  for (bLoopX = 0; bLoopX < PROFILE_X_SIZE; bLoopX++) {
    for (bLoopY = 0; bLoopY < PROFILE_Y_SIZE; bLoopY++) {
      ubShapeValue = pTile.value.Shape[bLoopX][bLoopY];
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

function FreeStructureFileRef(pFileRef: Pointer<STRUCTURE_FILE_REF>): void {
  // Frees all of the memory associated with a file reference, including
                                                          // the file reference structure itself

  let usLoop: UINT16;

  Assert(pFileRef != null);
  if (pFileRef.value.pDBStructureRef != null) {
    for (usLoop = 0; usLoop < pFileRef.value.usNumberOfStructures; usLoop++) {
      if (pFileRef.value.pDBStructureRef[usLoop].ppTile) {
        MemFree(pFileRef.value.pDBStructureRef[usLoop].ppTile);
      }
    }
    MemFree(pFileRef.value.pDBStructureRef);
  }
  if (pFileRef.value.pubStructureData != null) {
    MemFree(pFileRef.value.pubStructureData);
  }
  if (pFileRef.value.pAuxData != null) {
    MemFree(pFileRef.value.pAuxData);
    if (pFileRef.value.pTileLocData != null) {
      MemFree(pFileRef.value.pTileLocData);
    }
  }
  MemFree(pFileRef);
}

export function FreeAllStructureFiles(): void {
  // Frees all of the structure database!
  let pFileRef: Pointer<STRUCTURE_FILE_REF>;
  let pNextRef: Pointer<STRUCTURE_FILE_REF>;

  pFileRef = gpStructureFileRefs;
  while (pFileRef != null) {
    pNextRef = pFileRef.value.pNext;
    FreeStructureFileRef(pFileRef);
    pFileRef = pNextRef;
  }
}

export function FreeStructureFile(pStructureFile: Pointer<STRUCTURE_FILE_REF>): boolean {
  if (!pStructureFile) {
    return false;
  }

  // unlink the file ref
  if (pStructureFile.value.pPrev != null) {
    pStructureFile.value.pPrev.value.pNext = pStructureFile.value.pNext;
  } else {
    // freeing the head of the list!
    gpStructureFileRefs = pStructureFile.value.pNext;
  }
  if (pStructureFile.value.pNext != null) {
    pStructureFile.value.pNext.value.pPrev = pStructureFile.value.pPrev;
  }
  if (pStructureFile.value.pPrev == null && pStructureFile.value.pNext == null) {
    // toasting the list!
    gpStructureFileRefs = null;
  }
  // and free all the structures used!
  FreeStructureFileRef(pStructureFile);
  return true;
}

function LoadStructureData(szFileName: string /* STR */, pFileRef: Pointer<STRUCTURE_FILE_REF>, puiStructureDataSize: Pointer<UINT32>): boolean
// UINT8 **ppubStructureData, UINT32 * puiDataSize, STRUCTURE_FILE_HEADER * pHeader )
{ // Loads a structure file's data as a honking chunk o' memory
  let hInput: HWFILE;
  let Header: STRUCTURE_FILE_HEADER;
  let uiBytesRead: UINT32;
  let uiDataSize: UINT32;
  let fOk: boolean;

  if (!szFileName) {
    return false;
  }
  if (!pFileRef) {
    return false;
  }
  hInput = FileOpen(szFileName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hInput == 0) {
    return false;
  }
  fOk = FileRead(hInput, addressof(Header), sizeof(STRUCTURE_FILE_HEADER), addressof(uiBytesRead));
  if (!fOk || uiBytesRead != sizeof(STRUCTURE_FILE_HEADER) || strncmp(Header.szId, STRUCTURE_FILE_ID, STRUCTURE_FILE_ID_LEN) != 0 || Header.usNumberOfStructures == 0) {
    FileClose(hInput);
    return false;
  }
  pFileRef.value.usNumberOfStructures = Header.usNumberOfStructures;
  if (Header.fFlags & STRUCTURE_FILE_CONTAINS_AUXIMAGEDATA) {
    uiDataSize = sizeof(AuxObjectData) * Header.usNumberOfImages;
    pFileRef.value.pAuxData = MemAlloc(uiDataSize);
    if (pFileRef.value.pAuxData == null) {
      FileClose(hInput);
      return false;
    }
    fOk = FileRead(hInput, pFileRef.value.pAuxData, uiDataSize, addressof(uiBytesRead));
    if (!fOk || uiBytesRead != uiDataSize) {
      MemFree(pFileRef.value.pAuxData);
      FileClose(hInput);
      return false;
    }
    if (Header.usNumberOfImageTileLocsStored > 0) {
      uiDataSize = sizeof(RelTileLoc) * Header.usNumberOfImageTileLocsStored;
      pFileRef.value.pTileLocData = MemAlloc(uiDataSize);
      if (pFileRef.value.pTileLocData == null) {
        MemFree(pFileRef.value.pAuxData);
        FileClose(hInput);
        return false;
      }
      fOk = FileRead(hInput, pFileRef.value.pTileLocData, uiDataSize, addressof(uiBytesRead));
      if (!fOk || uiBytesRead != uiDataSize) {
        MemFree(pFileRef.value.pAuxData);
        FileClose(hInput);
        return false;
      }
    }
  }
  if (Header.fFlags & STRUCTURE_FILE_CONTAINS_STRUCTUREDATA) {
    pFileRef.value.usNumberOfStructuresStored = Header.usNumberOfStructuresStored;
    uiDataSize = Header.usStructureDataSize;
    // Determine the size of the data, from the header just read,
    // allocate enough memory and read it in
    pFileRef.value.pubStructureData = MemAlloc(uiDataSize);
    if (pFileRef.value.pubStructureData == null) {
      FileClose(hInput);
      if (pFileRef.value.pAuxData != null) {
        MemFree(pFileRef.value.pAuxData);
        if (pFileRef.value.pTileLocData != null) {
          MemFree(pFileRef.value.pTileLocData);
        }
      }
      return false;
    }
    fOk = FileRead(hInput, pFileRef.value.pubStructureData, uiDataSize, addressof(uiBytesRead));
    if (!fOk || uiBytesRead != uiDataSize) {
      MemFree(pFileRef.value.pubStructureData);
      if (pFileRef.value.pAuxData != null) {
        MemFree(pFileRef.value.pAuxData);
        if (pFileRef.value.pTileLocData != null) {
          MemFree(pFileRef.value.pTileLocData);
        }
      }
      FileClose(hInput);
      return false;
    }
    puiStructureDataSize.value = uiDataSize;
  }
  FileClose(hInput);
  return true;
}

function CreateFileStructureArrays(pFileRef: Pointer<STRUCTURE_FILE_REF>, uiDataSize: UINT32): boolean {
  // Based on a file chunk, creates all the dynamic arrays for the
                                                                                     // structure definitions contained within

  let pCurrent: Pointer<UINT8>;
  let pDBStructureRef: Pointer<DB_STRUCTURE_REF>;
  let ppTileArray: Pointer<Pointer<DB_STRUCTURE_TILE>>;
  let usLoop: UINT16;
  let usIndex: UINT16;
  let usTileLoop: UINT16;
  let uiHitPoints: UINT32;

  pCurrent = pFileRef.value.pubStructureData;
  pDBStructureRef = MemAlloc(pFileRef.value.usNumberOfStructures * sizeof(DB_STRUCTURE_REF));
  if (pDBStructureRef == null) {
    return false;
  }
  memset(pDBStructureRef, 0, pFileRef.value.usNumberOfStructures * sizeof(DB_STRUCTURE_REF));
  pFileRef.value.pDBStructureRef = pDBStructureRef;
  for (usLoop = 0; usLoop < pFileRef.value.usNumberOfStructuresStored; usLoop++) {
    if (pCurrent + sizeof(DB_STRUCTURE) > pFileRef.value.pubStructureData + uiDataSize) {
      // gone past end of file block?!
      // freeing of memory will occur outside of the function
      return false;
    }
    usIndex = (pCurrent).value.usStructureNumber;
    pDBStructureRef[usIndex].pDBStructure = pCurrent;
    ppTileArray = MemAlloc(pDBStructureRef[usIndex].pDBStructure.value.ubNumberOfTiles * sizeof(DB_STRUCTURE_TILE /* Pointer<DB_STRUCTURE_TILE> */));
    if (ppTileArray == null) {
      // freeing of memory will occur outside of the function
      return false;
    }
    pDBStructureRef[usIndex].ppTile = ppTileArray;
    pCurrent += sizeof(DB_STRUCTURE);
    // Set things up to calculate hit points
    uiHitPoints = 0;
    for (usTileLoop = 0; usTileLoop < pDBStructureRef[usIndex].pDBStructure.value.ubNumberOfTiles; usTileLoop++) {
      if (pCurrent + sizeof(DB_STRUCTURE) > pFileRef.value.pubStructureData + uiDataSize) {
        // gone past end of file block?!
        // freeing of memory will occur outside of the function
        return false;
      }
      ppTileArray[usTileLoop] = pCurrent;
      // set the single-value relative position between this tile and the base tile
      ppTileArray[usTileLoop].value.sPosRelToBase = ppTileArray[usTileLoop].value.bXPosRelToBase + ppTileArray[usTileLoop].value.bYPosRelToBase * WORLD_COLS;
      uiHitPoints += FilledTilePositions(ppTileArray[usTileLoop]);
      pCurrent += sizeof(DB_STRUCTURE_TILE);
    }
    // scale hit points down to something reasonable...
    uiHitPoints = uiHitPoints * 100 / 255;
    /*
    if (uiHitPoints > 255)
    {
            uiHitPoints = 255;
    }
    */
    pDBStructureRef[usIndex].pDBStructure.value.ubHitPoints = uiHitPoints;
    /*
    if (pDBStructureRef[usIndex].pDBStructure->usStructureNumber + 1 == pFileRef->usNumberOfStructures)
    {
            break;
    }
    */
  }
  return true;
}

export function LoadStructureFile(szFileName: string /* STR */): Pointer<STRUCTURE_FILE_REF> {
  // NB should be passed in expected number of structures so we can check equality
  let uiDataSize: UINT32 = 0;
  let fOk: boolean;
  let pFileRef: Pointer<STRUCTURE_FILE_REF>;

  pFileRef = MemAlloc(sizeof(STRUCTURE_FILE_REF));
  if (pFileRef == null) {
    return null;
  }
  memset(pFileRef, 0, sizeof(STRUCTURE_FILE_REF));
  fOk = LoadStructureData(szFileName, pFileRef, addressof(uiDataSize));
  if (!fOk) {
    MemFree(pFileRef);
    return null;
  }
  if (pFileRef.value.pubStructureData != null) {
    fOk = CreateFileStructureArrays(pFileRef, uiDataSize);
    if (fOk == false) {
      FreeStructureFileRef(pFileRef);
      return null;
    }
  }
  // Add the file reference to the master list, at the head for convenience
  if (gpStructureFileRefs != null) {
    gpStructureFileRefs.value.pPrev = pFileRef;
  }
  pFileRef.value.pNext = gpStructureFileRefs;
  gpStructureFileRefs = pFileRef;
  return pFileRef;
}

//
// Structure creation functions
//

function CreateStructureFromDB(pDBStructureRef: Pointer<DB_STRUCTURE_REF>, ubTileNum: UINT8): Pointer<STRUCTURE> {
  // Creates a STRUCTURE struct for one tile of a structure
  let pStructure: Pointer<STRUCTURE>;
  let pDBStructure: Pointer<DB_STRUCTURE>;
  let pTile: Pointer<DB_STRUCTURE_TILE>;

  // set pointers to the DBStructure and Tile
  if (!pDBStructureRef) {
    return null;
  }
  if (!pDBStructureRef.value.pDBStructure) {
    return null;
  }
  pDBStructure = pDBStructureRef.value.pDBStructure;
  if (!pDBStructureRef.value.ppTile) {
    return null;
  }
  pTile = pDBStructureRef.value.ppTile[ubTileNum];
  if (!pTile) {
    return null;
  }

  // allocate memory...
  pStructure = MemAlloc(sizeof(STRUCTURE));
  if (!pStructure) {
    return null;
  }

  memset(pStructure, 0, sizeof(STRUCTURE));

  // setup
  pStructure.value.fFlags = pDBStructure.value.fFlags;
  pStructure.value.pShape = addressof(pTile.value.Shape);
  pStructure.value.pDBStructureRef = pDBStructureRef;
  if (pTile.value.sPosRelToBase == 0) {
    // base tile
    pStructure.value.fFlags |= STRUCTURE_BASE_TILE;
    pStructure.value.ubHitPoints = pDBStructure.value.ubHitPoints;
  }
  if (pDBStructure.value.ubWallOrientation != Enum314.NO_ORIENTATION) {
    if (pStructure.value.fFlags & STRUCTURE_WALL) {
      // for multi-tile walls, which are only the special corner pieces,
      // the non-base tile gets no orientation value because this copy
      // will be skipped
      if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
        pStructure.value.ubWallOrientation = pDBStructure.value.ubWallOrientation;
      }
    } else {
      pStructure.value.ubWallOrientation = pDBStructure.value.ubWallOrientation;
    }
  }
  pStructure.value.ubVehicleHitLocation = pTile.value.ubVehicleHitLocation;
  return pStructure;
}

function OkayToAddStructureToTile(sBaseGridNo: INT16, sCubeOffset: INT16, pDBStructureRef: Pointer<DB_STRUCTURE_REF>, ubTileIndex: UINT8, sExclusionID: INT16, fIgnorePeople: boolean): boolean {
  // Verifies whether a structure is blocked from being added to the map at a particular point
  let pDBStructure: Pointer<DB_STRUCTURE>;
  let ppTile: Pointer<Pointer<DB_STRUCTURE_TILE>>;
  let pExistingStructure: Pointer<STRUCTURE>;
  let pOtherExistingStructure: Pointer<STRUCTURE>;
  let bLoop: INT8;
  let bLoop2: INT8;
  let sGridNo: INT16;
  let sOtherGridNo: INT16;

  ppTile = pDBStructureRef.value.ppTile;
  sGridNo = sBaseGridNo + ppTile[ubTileIndex].value.sPosRelToBase;
  if (sGridNo < 0 || sGridNo > WORLD_MAX) {
    return false;
  }

  if (gpWorldLevelData[sBaseGridNo].sHeight != gpWorldLevelData[sGridNo].sHeight) {
    // uneven terrain, one portion on top of cliff and another not! can't add!
    return false;
  }

  pDBStructure = pDBStructureRef.value.pDBStructure;
  pExistingStructure = gpWorldLevelData[sGridNo].pStructureHead;

  /*
          // If adding a mobile structure, always allow addition if the mobile structure tile is passable
          if ( (pDBStructure->fFlags & STRUCTURE_MOBILE) && (ppTile[ubTileIndex]->fFlags & TILE_PASSABLE) )
          {
                  return( TRUE );
          }
  */

  while (pExistingStructure != null) {
    if (sCubeOffset == pExistingStructure.value.sCubeOffset) {
      // CJC:
      // If adding a mobile structure, allow addition if existing structure is passable
      if ((pDBStructure.value.fFlags & STRUCTURE_MOBILE) && (pExistingStructure.value.fFlags & STRUCTURE_PASSABLE)) {
        // Skip!
        pExistingStructure = pExistingStructure.value.pNext;
        continue;
      }

      if (pDBStructure.value.fFlags & STRUCTURE_OBSTACLE) {
        // CJC: NB these next two if states are probably COMPLETELY OBSOLETE but I'm leaving
        // them in there for now (no harm done)

        // ATE:
        // ignore this one if it has the same ID num as exclusion
        if (sExclusionID != INVALID_STRUCTURE_ID) {
          if (pExistingStructure.value.usStructureID == sExclusionID) {
            // Skip!
            pExistingStructure = pExistingStructure.value.pNext;
            continue;
          }
        }

        if (fIgnorePeople) {
          // If we are a person, skip!
          if (pExistingStructure.value.usStructureID < TOTAL_SOLDIERS) {
            // Skip!
            pExistingStructure = pExistingStructure.value.pNext;
            continue;
          }
        }

        // two obstacle structures aren't allowed in the same tile at the same height
        // ATE: There is more sophisticated logic for mobiles, so postpone this check if mobile....
        if ((pExistingStructure.value.fFlags & STRUCTURE_OBSTACLE) && !(pDBStructure.value.fFlags & STRUCTURE_MOBILE)) {
          if (pExistingStructure.value.fFlags & STRUCTURE_PASSABLE && !(pExistingStructure.value.fFlags & STRUCTURE_MOBILE)) {
            // no mobiles, existing structure is passable
          } else {
            return false;
          }
        } else if ((pDBStructure.value.ubNumberOfTiles > 1) && (pExistingStructure.value.fFlags & STRUCTURE_WALLSTUFF)) {
          // if not an open door...
          if (!((pExistingStructure.value.fFlags & STRUCTURE_ANYDOOR) && (pExistingStructure.value.fFlags & STRUCTURE_OPEN))) {
            // we could be trying to place a multi-tile obstacle on top of a wall; we shouldn't
            // allow this if the structure is going to be on both sides of the wall
            for (bLoop = 1; bLoop < 4; bLoop++) {
              switch (pExistingStructure.value.ubWallOrientation) {
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
              for (bLoop2 = 0; bLoop2 < pDBStructure.value.ubNumberOfTiles; bLoop2++) {
                if (sBaseGridNo + ppTile[bLoop2].value.sPosRelToBase == sOtherGridNo) {
                  // obstacle will straddle wall!
                  return false;
                }
              }
            }
          }
        }
      } else if (pDBStructure.value.fFlags & STRUCTURE_WALLSTUFF) {
        // two walls with the same alignment aren't allowed in the same tile
        if ((pExistingStructure.value.fFlags & STRUCTURE_WALLSTUFF) && (pDBStructure.value.ubWallOrientation == pExistingStructure.value.ubWallOrientation)) {
          return false;
        } else if (!(pExistingStructure.value.fFlags & (STRUCTURE_CORPSE | STRUCTURE_PERSON))) {
          // it's possible we're trying to insert this wall on top of a multitile obstacle
          for (bLoop = 1; bLoop < 4; bLoop++) {
            switch (pDBStructure.value.ubWallOrientation) {
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
            for (ubTileIndex = 0; ubTileIndex < pDBStructure.value.ubNumberOfTiles; ubTileIndex++) {
              pOtherExistingStructure = FindStructureByID(sOtherGridNo, pExistingStructure.value.usStructureID);
              if (pOtherExistingStructure) {
                return false;
              }
            }
          }
        }
      }

      if (pDBStructure.value.fFlags & STRUCTURE_MOBILE) {
        // ATE:
        // ignore this one if it has the same ID num as exclusion
        if (sExclusionID != INVALID_STRUCTURE_ID) {
          if (pExistingStructure.value.usStructureID == sExclusionID) {
            // Skip!
            pExistingStructure = pExistingStructure.value.pNext;
            continue;
          }
        }

        if (fIgnorePeople) {
          // If we are a person, skip!
          if (pExistingStructure.value.usStructureID < TOTAL_SOLDIERS) {
            // Skip!
            pExistingStructure = pExistingStructure.value.pNext;
            continue;
          }
        }

        // ATE: Added check here - UNLESS the part we are trying to add is PASSABLE!
        if (pExistingStructure.value.fFlags & STRUCTURE_MOBILE && !(pExistingStructure.value.fFlags & STRUCTURE_PASSABLE) && !(ppTile[ubTileIndex].value.fFlags & TILE_PASSABLE)) {
          // don't allow 2 people in the same tile
          return false;
        }

        // ATE: Another rule: allow PASSABLE *IF* the PASSABLE is *NOT* MOBILE!
        if (!(pExistingStructure.value.fFlags & STRUCTURE_MOBILE) && (pExistingStructure.value.fFlags & STRUCTURE_PASSABLE)) {
          // Skip!
          pExistingStructure = pExistingStructure.value.pNext;
          continue;
        }

        // ATE: Added here - UNLESS this part is PASSABLE....
        // two obstacle structures aren't allowed in the same tile at the same height
        if ((pExistingStructure.value.fFlags & STRUCTURE_OBSTACLE) && !(ppTile[ubTileIndex].value.fFlags & TILE_PASSABLE)) {
          return false;
        }
      }

      if ((pDBStructure.value.fFlags & STRUCTURE_OPENABLE)) {
        if (pExistingStructure.value.fFlags & STRUCTURE_OPENABLE) {
          // don't allow two openable structures in the same tile or things will screw
          // up on an interface level
          return false;
        }
      }
    }

    pExistingStructure = pExistingStructure.value.pNext;
  }

  return true;
}

export function InternalOkayToAddStructureToWorld(sBaseGridNo: INT16, bLevel: INT8, pDBStructureRef: Pointer<DB_STRUCTURE_REF>, sExclusionID: INT16, fIgnorePeople: boolean): boolean {
  let ubLoop: UINT8;
  let sCubeOffset: INT16;

  if (!pDBStructureRef) {
    return false;
  }
  if (!pDBStructureRef.value.pDBStructure) {
    return false;
  }
  if (pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles <= 0) {
    return false;
  }
  if (!pDBStructureRef.value.ppTile) {
    return false;
  }

  /*
          if (gpWorldLevelData[sGridNo].sHeight != sBaseTileHeight)
          {
                  // not level ground!
                  return( FALSE );
          }
  */

  for (ubLoop = 0; ubLoop < pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles; ubLoop++) {
    if (pDBStructureRef.value.ppTile[ubLoop].value.fFlags & TILE_ON_ROOF) {
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

export function OkayToAddStructureToWorld(sBaseGridNo: INT16, bLevel: INT8, pDBStructureRef: Pointer<DB_STRUCTURE_REF>, sExclusionID: INT16): boolean {
  return InternalOkayToAddStructureToWorld(sBaseGridNo, bLevel, pDBStructureRef, sExclusionID, (sExclusionID == IGNORE_PEOPLE_STRUCTURE_ID));
}

function AddStructureToTile(pMapElement: Pointer<MAP_ELEMENT>, pStructure: Pointer<STRUCTURE>, usStructureID: UINT16): boolean {
  // adds a STRUCTURE to a MAP_ELEMENT (adds part of a structure to a location on the map)
  let pStructureTail: Pointer<STRUCTURE>;

  if (!pMapElement) {
    return false;
  }
  if (!pStructure) {
    return false;
  }
  pStructureTail = pMapElement.value.pStructureTail;
  if (pStructureTail == null) {
    // set the head and tail to the new structure
    pMapElement.value.pStructureHead = pStructure;
  } else {
    // add to the end of the list
    pStructure.value.pPrev = pStructureTail;
    pStructureTail.value.pNext = pStructure;
  }
  pMapElement.value.pStructureTail = pStructure;
  pStructure.value.usStructureID = usStructureID;
  if (pStructure.value.fFlags & STRUCTURE_OPENABLE) {
    pMapElement.value.uiFlags |= MAPELEMENT_INTERACTIVETILE;
  }
  return true;
}

function InternalAddStructureToWorld(sBaseGridNo: INT16, bLevel: INT8, pDBStructureRef: Pointer<DB_STRUCTURE_REF>, pLevelNode: Pointer<LEVELNODE>): Pointer<STRUCTURE> {
  // Adds a complete structure to the world at a location plus all other locations covered by the structure
  let sGridNo: INT16;
  let ppStructure: Pointer<Pointer<STRUCTURE>>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let pDBStructure: Pointer<DB_STRUCTURE>;
  let ppTile: Pointer<Pointer<DB_STRUCTURE_TILE>>;
  let ubLoop: UINT8;
  let ubLoop2: UINT8;
  let sBaseTileHeight: INT16 = -1;
  let usStructureID: UINT16;

  if (!pDBStructureRef) {
    return false;
  }
  if (!pLevelNode) {
    return false;
  }

  pDBStructure = pDBStructureRef.value.pDBStructure;
  if (!pDBStructure) {
    return false;
  }

  ppTile = pDBStructureRef.value.ppTile;
  if (!ppTile) {
    return false;
  }

  if (pDBStructure.value.ubNumberOfTiles <= 0) {
    return false;
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
  ppStructure = MemAlloc(pDBStructure.value.ubNumberOfTiles * sizeof(STRUCTURE /* Pointer<STRUCTURE> */));
  if (!ppStructure) {
    return false;
  }
  memset(ppStructure, 0, pDBStructure.value.ubNumberOfTiles * sizeof(STRUCTURE /* Pointer<STRUCTURE> */));

  for (ubLoop = BASE_TILE; ubLoop < pDBStructure.value.ubNumberOfTiles; ubLoop++) {
    // for each tile, create the appropriate STRUCTURE struct
    ppStructure[ubLoop] = CreateStructureFromDB(pDBStructureRef, ubLoop);
    if (ppStructure[ubLoop] == null) {
      // Free allocated memory and abort!
      for (ubLoop2 = 0; ubLoop2 < ubLoop; ubLoop2++) {
        MemFree(ppStructure[ubLoop2]);
      }
      MemFree(ppStructure);
      return null;
    }
    ppStructure[ubLoop].value.sGridNo = sBaseGridNo + ppTile[ubLoop].value.sPosRelToBase;
    if (ubLoop != BASE_TILE) {
      // Kris:
      // Added this undo code if in the editor.
      // It is important to save tiles effected by multitiles.  If the structure placement
      // fails below, it doesn't matter, because it won't hurt the undo code.
      if (gfEditMode)
        AddToUndoList(ppStructure[ubLoop].value.sGridNo);

      ppStructure[ubLoop].value.sBaseGridNo = sBaseGridNo;
    }
    if (ppTile[ubLoop].value.fFlags & TILE_ON_ROOF) {
      ppStructure[ubLoop].value.sCubeOffset = (bLevel + 1) * PROFILE_Z_SIZE;
    } else {
      ppStructure[ubLoop].value.sCubeOffset = bLevel * PROFILE_Z_SIZE;
    }
    if (ppTile[ubLoop].value.fFlags & TILE_PASSABLE) {
      ppStructure[ubLoop].value.fFlags |= STRUCTURE_PASSABLE;
    }
    if (pLevelNode.value.uiFlags & LEVELNODE_SOLDIER) {
      // should now be unncessary
      ppStructure[ubLoop].value.fFlags |= STRUCTURE_PERSON;
      ppStructure[ubLoop].value.fFlags &= ~(STRUCTURE_BLOCKSMOVES);
    } else if (pLevelNode.value.uiFlags & LEVELNODE_ROTTINGCORPSE || pDBStructure.value.fFlags & STRUCTURE_CORPSE) {
      ppStructure[ubLoop].value.fFlags |= STRUCTURE_CORPSE;
      // attempted check to screen this out for queen creature or vehicle
      if (pDBStructure.value.ubNumberOfTiles < 10) {
        ppStructure[ubLoop].value.fFlags |= STRUCTURE_PASSABLE;
        ppStructure[ubLoop].value.fFlags &= ~(STRUCTURE_BLOCKSMOVES);
      } else {
        // make sure not transparent
        ppStructure[ubLoop].value.fFlags &= ~(STRUCTURE_TRANSPARENT);
      }
    }
  }

  if (pLevelNode.value.uiFlags & LEVELNODE_SOLDIER) {
    // use the merc's ID as the structure ID for his/her structure
    usStructureID = pLevelNode.value.pSoldier.value.ubID;
  } else if (pLevelNode.value.uiFlags & LEVELNODE_ROTTINGCORPSE) {
    // ATE: Offset IDs so they don't collide with soldiers
    usStructureID = (TOTAL_SOLDIERS + pLevelNode.value.pAniTile.value.uiUserData);
  } else {
    gusNextAvailableStructureID++;
    if (gusNextAvailableStructureID == 0) {
      // skip past the #s for soldiers' structures and the invalid structure #
      gusNextAvailableStructureID = FIRST_AVAILABLE_STRUCTURE_ID;
    }
    usStructureID = gusNextAvailableStructureID;
  }
  // now add all these to the world!
  for (ubLoop = BASE_TILE; ubLoop < pDBStructure.value.ubNumberOfTiles; ubLoop++) {
    sGridNo = ppStructure[ubLoop].value.sGridNo;
    if (ubLoop == BASE_TILE) {
      sBaseTileHeight = gpWorldLevelData[sGridNo].sHeight;
    } else {
      if (gpWorldLevelData[sGridNo].sHeight != sBaseTileHeight) {
        // not level ground! abort!
        for (ubLoop2 = BASE_TILE; ubLoop2 < ubLoop; ubLoop2++) {
          DeleteStructureFromTile(addressof(gpWorldLevelData[ppStructure[ubLoop2].value.sGridNo]), ppStructure[ubLoop2]);
        }
        MemFree(ppStructure);
        return null;
      }
    }
    if (AddStructureToTile(addressof(gpWorldLevelData[sGridNo]), ppStructure[ubLoop], usStructureID) == false) {
      // error! abort!
      for (ubLoop2 = BASE_TILE; ubLoop2 < ubLoop; ubLoop2++) {
        DeleteStructureFromTile(addressof(gpWorldLevelData[ppStructure[ubLoop2].value.sGridNo]), ppStructure[ubLoop2]);
      }
      MemFree(ppStructure);
      return null;
    }
  }

  pBaseStructure = ppStructure[BASE_TILE];
  pLevelNode.value.pStructureData = pBaseStructure;

  MemFree(ppStructure);
  // And we're done! return a pointer to the base structure!

  return pBaseStructure;
}

export function AddStructureToWorld(sBaseGridNo: INT16, bLevel: INT8, pDBStructureRef: Pointer<DB_STRUCTURE_REF>, pLevelN: PTR): boolean {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = InternalAddStructureToWorld(sBaseGridNo, bLevel, pDBStructureRef, pLevelN);
  if (pStructure == null) {
    return false;
  }
  return true;
}

//
// Structure deletion functions
//

function DeleteStructureFromTile(pMapElement: Pointer<MAP_ELEMENT>, pStructure: Pointer<STRUCTURE>): void {
  // removes a STRUCTURE element at a particular location from the world
  // put location pointer in tile
  if (pMapElement.value.pStructureHead == pStructure) {
    if (pMapElement.value.pStructureTail == pStructure) {
      // only element in the list!
      pMapElement.value.pStructureHead = null;
      pMapElement.value.pStructureTail = null;
    } else {
      // first element in the list of 2+ members
      pMapElement.value.pStructureHead = pStructure.value.pNext;
    }
  } else if (pMapElement.value.pStructureTail == pStructure) {
    // last element in the list
    pStructure.value.pPrev.value.pNext = null;
    pMapElement.value.pStructureTail = pStructure.value.pPrev;
  } else {
    // second or later element in the list; it's guaranteed that there is a
    // previous element but not necessary a next
    pStructure.value.pPrev.value.pNext = pStructure.value.pNext;
    if (pStructure.value.pNext != null) {
      pStructure.value.pNext.value.pPrev = pStructure.value.pPrev;
    }
  }
  if (pStructure.value.fFlags & STRUCTURE_OPENABLE) {
    // only one allowed in a tile, so we are safe to do this...
    pMapElement.value.uiFlags &= (~MAPELEMENT_INTERACTIVETILE);
  }
  MemFree(pStructure);
}

export function DeleteStructureFromWorld(pStructure: Pointer<STRUCTURE>): boolean {
  // removes all of the STRUCTURE elements for a structure from the world
  let pBaseMapElement: Pointer<MAP_ELEMENT>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let ppTile: Pointer<Pointer<DB_STRUCTURE_TILE>>;
  let pCurrent: Pointer<STRUCTURE>;
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

  usStructureID = pBaseStructure.value.usStructureID;
  fMultiStructure = ((pBaseStructure.value.fFlags & STRUCTURE_MULTI) != 0);
  fRecompileMPs = ((gsRecompileAreaLeft != 0) && !((pBaseStructure.value.fFlags & STRUCTURE_MOBILE) != 0));
  if (fRecompileMPs) {
    fRecompileExtraRadius = ((pBaseStructure.value.fFlags & STRUCTURE_WALLSTUFF) != 0);
  } else {
    fRecompileExtraRadius = false;
  }

  pBaseMapElement = addressof(gpWorldLevelData[pBaseStructure.value.sGridNo]);
  ppTile = pBaseStructure.value.pDBStructureRef.value.ppTile;
  sBaseGridNo = pBaseStructure.value.sGridNo;
  ubNumberOfTiles = pBaseStructure.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles;
  // Free all the tiles
  for (ubLoop = BASE_TILE; ubLoop < ubNumberOfTiles; ubLoop++) {
    sGridNo = sBaseGridNo + ppTile[ubLoop].value.sPosRelToBase;
    // there might be two structures in this tile, one on each level, but we just want to
    // delete one on each pass
    pCurrent = FindStructureByID(sGridNo, usStructureID);
    if (pCurrent) {
      DeleteStructureFromTile(addressof(gpWorldLevelData[sGridNo]), pCurrent);
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

function InternalSwapStructureForPartner(sGridNo: INT16, pStructure: Pointer<STRUCTURE>, fFlipSwitches: boolean, fStoreInMap: boolean): Pointer<STRUCTURE> {
  // switch structure
  let pLevelNode: Pointer<LEVELNODE>;
  let pShadowNode: Pointer<LEVELNODE>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let pNewBaseStructure: Pointer<STRUCTURE>;
  let pPartnerDBStructure: Pointer<DB_STRUCTURE_REF>;
  let fDoor: boolean;

  let bDelta: INT8;
  let ubHitPoints: UINT8;
  let sCubeOffset: INT16;

  if (pStructure == null) {
    return null;
  }
  pBaseStructure = FindBaseStructure(pStructure);
  if (!pBaseStructure) {
    return false;
  }
  if ((pBaseStructure.value.pDBStructureRef.value.pDBStructure).value.bPartnerDelta == NO_PARTNER_STRUCTURE) {
    return null;
  }
  fDoor = ((pBaseStructure.value.fFlags & STRUCTURE_ANYDOOR) > 0);
  pLevelNode = FindLevelNodeBasedOnStructure(pBaseStructure.value.sGridNo, pBaseStructure);
  if (pLevelNode == null) {
    return null;
  }
  pShadowNode = FindShadow(pBaseStructure.value.sGridNo, pLevelNode.value.usIndex);

  // record values
  bDelta = pBaseStructure.value.pDBStructureRef.value.pDBStructure.value.bPartnerDelta;
  pPartnerDBStructure = pBaseStructure.value.pDBStructureRef + bDelta;
  sGridNo = pBaseStructure.value.sGridNo;
  ubHitPoints = pBaseStructure.value.ubHitPoints;
  sCubeOffset = pBaseStructure.value.sCubeOffset;
  // delete the old structure and add the new one
  if (DeleteStructureFromWorld(pBaseStructure) == false) {
    return null;
  }
  pNewBaseStructure = InternalAddStructureToWorld(sGridNo, (sCubeOffset / PROFILE_Z_SIZE), pPartnerDBStructure, pLevelNode);
  if (pNewBaseStructure == null) {
    return null;
  }
  // set values in the new structure
  pNewBaseStructure.value.ubHitPoints = ubHitPoints;
  if (!fDoor) {
    // swap the graphics

    // store removal of previous if necessary
    if (fStoreInMap) {
      ApplyMapChangesToMapTempFile(true);
      RemoveStructFromMapTempFile(sGridNo, pLevelNode.value.usIndex);
    }

    pLevelNode.value.usIndex += bDelta;

    // store removal of new one if necessary
    if (fStoreInMap) {
      AddStructToMapTempFile(sGridNo, pLevelNode.value.usIndex);
      ApplyMapChangesToMapTempFile(false);
    }

    if (pShadowNode != null) {
      pShadowNode.value.usIndex += bDelta;
    }
  }

  // if ( (pNewBaseStructure->fFlags & STRUCTURE_SWITCH) && (pNewBaseStructure->fFlags & STRUCTURE_OPEN) )
  if (0 /*fFlipSwitches*/) {
    if (pNewBaseStructure.value.fFlags & STRUCTURE_SWITCH) {
      // just turned a switch on!
      ActivateSwitchInGridNo(NOBODY, sGridNo);
    }
  }
  return pNewBaseStructure;
}

export function SwapStructureForPartner(sGridNo: INT16, pStructure: Pointer<STRUCTURE>): Pointer<STRUCTURE> {
  return InternalSwapStructureForPartner(sGridNo, pStructure, true, false);
}

export function SwapStructureForPartnerWithoutTriggeringSwitches(sGridNo: INT16, pStructure: Pointer<STRUCTURE>): Pointer<STRUCTURE> {
  return InternalSwapStructureForPartner(sGridNo, pStructure, false, false);
}

export function SwapStructureForPartnerAndStoreChangeInMap(sGridNo: INT16, pStructure: Pointer<STRUCTURE>): Pointer<STRUCTURE> {
  return InternalSwapStructureForPartner(sGridNo, pStructure, true, true);
}

export function FindStructure(sGridNo: INT16, fFlags: UINT32): Pointer<STRUCTURE> {
  // finds a structure that matches any of the given flags
  let pCurrent: Pointer<STRUCTURE>;

  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
  while (pCurrent != null) {
    if ((pCurrent.value.fFlags & fFlags) != 0) {
      return pCurrent;
    }
    pCurrent = pCurrent.value.pNext;
  }
  return null;
}

export function FindNextStructure(pStructure: Pointer<STRUCTURE>, fFlags: UINT32): Pointer<STRUCTURE> {
  let pCurrent: Pointer<STRUCTURE>;

  if (!pStructure) {
    return false;
  }
  pCurrent = pStructure.value.pNext;
  while (pCurrent != null) {
    if ((pCurrent.value.fFlags & fFlags) != 0) {
      return pCurrent;
    }
    pCurrent = pCurrent.value.pNext;
  }
  return null;
}

export function FindStructureByID(sGridNo: INT16, usStructureID: UINT16): Pointer<STRUCTURE> {
  // finds a structure that matches any of the given flags
  let pCurrent: Pointer<STRUCTURE>;

  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
  while (pCurrent != null) {
    if (pCurrent.value.usStructureID == usStructureID) {
      return pCurrent;
    }
    pCurrent = pCurrent.value.pNext;
  }
  return null;
}

export function FindBaseStructure(pStructure: Pointer<STRUCTURE>): Pointer<STRUCTURE> {
  // finds the base structure for any structure
  if (!pStructure) {
    return false;
  }
  if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
    return pStructure;
  }
  return FindStructureByID(pStructure.value.sBaseGridNo, pStructure.value.usStructureID);
}

function FindNonBaseStructure(sGridNo: INT16, pStructure: Pointer<STRUCTURE>): Pointer<STRUCTURE> {
  // finds a non-base structure in a location
  if (!pStructure) {
    return false;
  }
  if (!(pStructure.value.fFlags & STRUCTURE_BASE_TILE)) {
    // error!
    return null;
  }

  return FindStructureByID(sGridNo, pStructure.value.usStructureID);
}

function GetBaseTile(pStructure: Pointer<STRUCTURE>): INT16 {
  if (pStructure == null) {
    return -1;
  }
  if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
    return pStructure.value.sGridNo;
  } else {
    return pStructure.value.sBaseGridNo;
  }
}

export function StructureHeight(pStructure: Pointer<STRUCTURE>): INT8 {
  // return the height of an object from 1-4
  let ubLoopX: UINT8;
  let ubLoopY: UINT8;
  PROFILE() *pShape;
  let ubShapeValue: UINT8;
  let bLoopZ: INT8;
  let bGreatestHeight: INT8 = -1;

  if (pStructure == null || pStructure.value.pShape == null) {
    return 0;
  }

  if (pStructure.value.ubStructureHeight != 0) {
    return pStructure.value.ubStructureHeight;
  }

  pShape = pStructure.value.pShape;

  // loop horizontally on the X and Y planes
  for (ubLoopX = 0; ubLoopX < PROFILE_X_SIZE; ubLoopX++) {
    for (ubLoopY = 0; ubLoopY < PROFILE_Y_SIZE; ubLoopY++) {
      ubShapeValue = (pShape.value)[ubLoopX][ubLoopY];
      // loop DOWN vertically so that we find the tallest point first
      // and don't need to check any below it
      for (bLoopZ = PROFILE_Z_SIZE - 1; bLoopZ > bGreatestHeight; bLoopZ--) {
        if (ubShapeValue & AtHeight[bLoopZ]) {
          bGreatestHeight = bLoopZ;
          if (bGreatestHeight == PROFILE_Z_SIZE - 1) {
            // store height
            pStructure.value.ubStructureHeight = bGreatestHeight + 1;
            return bGreatestHeight + 1;
          }
          break;
        }
      }
    }
  }
  // store height
  pStructure.value.ubStructureHeight = bGreatestHeight + 1;
  return bGreatestHeight + 1;
}

export function GetTallestStructureHeight(sGridNo: INT16, fOnRoof: boolean): INT8 {
  let pCurrent: Pointer<STRUCTURE>;
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
    if (pCurrent.value.sCubeOffset == sDesiredHeight) {
      iHeight = StructureHeight(pCurrent);
      if (iHeight > iTallest) {
        iTallest = iHeight;
      }
    }
    pCurrent = pCurrent.value.pNext;
  }
  return iTallest;
}

export function GetStructureTargetHeight(sGridNo: INT16, fOnRoof: boolean): INT8 {
  let pCurrent: Pointer<STRUCTURE>;
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
    if (pCurrent.value.fFlags & STRUCTURE_DOOR) {
      iTallest = 3; // don't aim at the very top of the door
    } else {
      iTallest = StructureHeight(pCurrent);
    }
  } else {
    pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
    while (pCurrent != null) {
      if (pCurrent.value.sCubeOffset == sDesiredHeight) {
        iHeight = StructureHeight(pCurrent);

        if (iHeight > iTallest) {
          iTallest = iHeight;
        }
      }
      pCurrent = pCurrent.value.pNext;
    }
  }
  return iTallest;
}

export function StructureBottomLevel(pStructure: Pointer<STRUCTURE>): INT8 {
  // return the bottom level of an object, from 1-4
  let ubLoopX: UINT8;
  let ubLoopY: UINT8;
  PROFILE() *pShape;
  let ubShapeValue: UINT8;
  let bLoopZ: INT8;
  let bLowestHeight: INT8 = PROFILE_Z_SIZE;

  if (pStructure == null || pStructure.value.pShape == null) {
    return 0;
  }
  pShape = pStructure.value.pShape;

  // loop horizontally on the X and Y planes
  for (ubLoopX = 0; ubLoopX < PROFILE_X_SIZE; ubLoopX++) {
    for (ubLoopY = 0; ubLoopY < PROFILE_Y_SIZE; ubLoopY++) {
      ubShapeValue = (pShape.value)[ubLoopX][ubLoopY];
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

export function StructureDensity(pStructure: Pointer<STRUCTURE>, pubLevel0: Pointer<UINT8>, pubLevel1: Pointer<UINT8>, pubLevel2: Pointer<UINT8>, pubLevel3: Pointer<UINT8>): boolean {
  let ubLoopX: UINT8;
  let ubLoopY: UINT8;
  let ubShapeValue: UINT8;
  PROFILE() *pShape;

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

  pShape = pStructure.value.pShape;

  for (ubLoopX = 0; ubLoopX < PROFILE_X_SIZE; ubLoopX++) {
    for (ubLoopY = 0; ubLoopY < PROFILE_Y_SIZE; ubLoopY++) {
      ubShapeValue = (pShape.value)[ubLoopX][ubLoopY];
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

export function DamageStructure(pStructure: Pointer<STRUCTURE>, ubDamage: UINT8, ubReason: UINT8, sGridNo: INT16, sX: INT16, sY: INT16, ubOwner: UINT8): boolean {
  // do damage to a structure; returns TRUE if the structure should be removed

  let pBase: Pointer<STRUCTURE>;
  let ubArmour: UINT8;
  // LEVELNODE			*pNode;

  if (!pStructure) {
    return false;
  }
  if (pStructure.value.fFlags & STRUCTURE_PERSON || pStructure.value.fFlags & STRUCTURE_CORPSE) {
    // don't hurt this structure, it's used for hit detection only!
    return false;
  }

  if ((pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_INDESTRUCTABLE_METAL) || (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour == Enum309.MATERIAL_INDESTRUCTABLE_STONE)) {
    return false;
  }

  // Account for armour!
  if (ubReason == STRUCTURE_DAMAGE_EXPLOSION) {
    if (pStructure.value.fFlags & STRUCTURE_EXPLOSIVE) {
      ubArmour = gubMaterialArmour[pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour] / 3;
    } else {
      ubArmour = gubMaterialArmour[pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour] / 2;
    }

    if (ubArmour > ubDamage) {
      // didn't even scratch the paint
      return false;
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
    if ((pStructure.value.fFlags & STRUCTURE_EXPLOSIVE) && Random(2)) {
      // Remove struct!
      pBase = FindBaseStructure(pStructure);

      // ATE: Set hit points to zero....
      pBase.value.ubHitPoints = 0;

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
      return false;
    }

    // Make hit sound....
    if (pStructure.value.fFlags & STRUCTURE_CAVEWALL) {
      PlayJA2Sample(Enum330.S_VEG_IMPACT1, RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
    } else {
      if (guiMaterialHitSound[pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour] != -1) {
        PlayJA2Sample(guiMaterialHitSound[pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour], RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));
      }
    }
    // Don't update damage HPs....
    return true;
  }

  // OK, LOOK FOR A SAM SITE, UPDATE....
  UpdateAndDamageSAMIfFound(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, sGridNo, ubDamage);

  // find the base so we can reduce the hit points!
  pBase = FindBaseStructure(pStructure);
  if (!pBase) {
    return false;
  }
  if (pBase.value.ubHitPoints <= ubDamage) {
    // boom! structure destroyed!
    return true;
  } else {
    pBase.value.ubHitPoints -= ubDamage;

    // Since the structure is being damaged, set the map element that a structure is damaged
    gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_STRUCTURE_DAMAGED;

    // We are a little damaged....
    return 2;
  }
}

const LINE_HEIGHT = 20;
export function DebugStructurePage1(): void {
  let pStructure: Pointer<STRUCTURE>;
  let pBase: Pointer<STRUCTURE>;
  // LEVELNODE *		pLand;
  let sGridNo: INT16;
  let sDesiredLevel: INT16;
  let bHeight: INT8;
  let bDens0: INT8;
  let bDens1: INT8;
  let bDens2: INT8;
  let bDens3: INT8;
  let bStructures: INT8;

  /* static */ let WallOrientationString: string[] /* CHAR16[5][15] */ = [
    "None",
    "Inside left",
    "Inside right",
    "Outside left",
    "Outside right",
  ];

  SetFont(LARGEFONT1());
  gprintf(0, 0, "DEBUG STRUCTURES PAGE 1 OF 1");
  if (GetMouseMapPos(addressof(sGridNo)) == false) {
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
    if (pStructure.value.sCubeOffset == sDesiredLevel) {
      break;
    }
    pStructure = pStructure.value.pNext;
  }

  if (pStructure != null) {
    if (pStructure.value.fFlags & STRUCTURE_GENERIC) {
      gprintf(0, LINE_HEIGHT * 1, "Generic structure %x #%d", pStructure.value.fFlags, pStructure.value.pDBStructureRef.value.pDBStructure.value.usStructureNumber);
    } else if (pStructure.value.fFlags & STRUCTURE_TREE) {
      gprintf(0, LINE_HEIGHT * 1, "Tree");
    } else if (pStructure.value.fFlags & STRUCTURE_WALL) {
      gprintf(0, LINE_HEIGHT * 1, "Wall with orientation %s", WallOrientationString[pStructure.value.ubWallOrientation]);
    } else if (pStructure.value.fFlags & STRUCTURE_WALLNWINDOW) {
      gprintf(0, LINE_HEIGHT * 1, "Wall with window");
    } else if (pStructure.value.fFlags & STRUCTURE_VEHICLE) {
      gprintf(0, LINE_HEIGHT * 1, "Vehicle %d", pStructure.value.pDBStructureRef.value.pDBStructure.value.usStructureNumber);
    } else if (pStructure.value.fFlags & STRUCTURE_NORMAL_ROOF) {
      gprintf(0, LINE_HEIGHT * 1, "Roof");
    } else if (pStructure.value.fFlags & STRUCTURE_SLANTED_ROOF) {
      gprintf(0, LINE_HEIGHT * 1, "Slanted roof");
    } else if (pStructure.value.fFlags & STRUCTURE_DOOR) {
      gprintf(0, LINE_HEIGHT * 1, "Door with orientation %s", WallOrientationString[pStructure.value.ubWallOrientation]);
    } else if (pStructure.value.fFlags & STRUCTURE_SLIDINGDOOR) {
      gprintf(0, LINE_HEIGHT * 1, "%s sliding door with orientation %s", (pStructure.value.fFlags & STRUCTURE_OPEN) ? "Open" : "Closed", WallOrientationString[pStructure.value.ubWallOrientation]);
    } else if (pStructure.value.fFlags & STRUCTURE_DDOOR_LEFT) {
      gprintf(0, LINE_HEIGHT * 1, "DDoorLft with orientation %s", WallOrientationString[pStructure.value.ubWallOrientation]);
    } else if (pStructure.value.fFlags & STRUCTURE_DDOOR_RIGHT) {
      gprintf(0, LINE_HEIGHT * 1, "DDoorRt with orientation %s", WallOrientationString[pStructure.value.ubWallOrientation]);
    } else {
      gprintf(0, LINE_HEIGHT * 1, "UNKNOWN STRUCTURE! (%x)", pStructure.value.fFlags);
    }
    bHeight = StructureHeight(pStructure);
    pBase = FindBaseStructure(pStructure);
    gprintf(0, LINE_HEIGHT * 2, "Structure height %d, cube offset %d, armour %d, HP %d", bHeight, pStructure.value.sCubeOffset, gubMaterialArmour[pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour], pBase.value.ubHitPoints);
    if (StructureDensity(pStructure, addressof(bDens0), addressof(bDens1), addressof(bDens2), addressof(bDens3)) == true) {
      gprintf(0, LINE_HEIGHT * 3, "Structure fill %d%%/%d%%/%d%%/%d%% density %d", bDens0, bDens1, bDens2, bDens3, pStructure.value.pDBStructureRef.value.pDBStructure.value.ubDensity);
    }

    gprintf(0, LINE_HEIGHT * 4, "Structure ID %d", pStructure.value.usStructureID);

    pStructure = gpWorldLevelData[sGridNo].pStructureHead;
    for (bStructures = 0; pStructure != null; pStructure = pStructure.value.pNext) {
      bStructures++;
    }
    gprintf(0, LINE_HEIGHT * 12, "Number of structures = %d", bStructures);
  }
  gprintf(0, LINE_HEIGHT * 13, "N %d NE %d E %d SE %d", gubWorldMovementCosts[sGridNo][Enum245.NORTH][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.NORTHEAST][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.EAST][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.SOUTHEAST][gsInterfaceLevel]);
  gprintf(0, LINE_HEIGHT * 14, "S %d SW %d W %d NW %d", gubWorldMovementCosts[sGridNo][Enum245.SOUTH][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.SOUTHWEST][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.WEST][gsInterfaceLevel], gubWorldMovementCosts[sGridNo][Enum245.NORTHWEST][gsInterfaceLevel]);
  gprintf(0, LINE_HEIGHT * 15, "Ground smell %d strength %d", SMELL_TYPE(gpWorldLevelData[sGridNo].ubSmellInfo), SMELL_STRENGTH(gpWorldLevelData[sGridNo].ubSmellInfo));

  gprintf(0, LINE_HEIGHT * 16, "Adj soldiers %d", gpWorldLevelData[sGridNo].ubAdjacentSoldierCnt);
}

export function AddZStripInfoToVObject(hVObject: HVOBJECT, pStructureFileRef: Pointer<STRUCTURE_FILE_REF>, fFromAnimation: boolean, sSTIStartIndex: INT16): boolean {
  let uiLoop: UINT32;
  let ubLoop2: UINT8;
  let ubNumIncreasing: UINT8 = 0;
  let ubNumStable: UINT8 = 0;
  let ubNumDecreasing: UINT8 = 0;
  let fFound: boolean = false;
  let pCurr: Pointer<ZStripInfo>;
  let sLeftHalfWidth: INT16;
  let sRightHalfWidth: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let usWidth: UINT16;
  let usHeight: UINT16;
  let pDBStructureRef: Pointer<DB_STRUCTURE_REF>;
  let pDBStructure: Pointer<DB_STRUCTURE> = null;
  let sSTIStep: INT16 = 0;
  let sStructIndex: INT16 = 0;
  let sNext: INT16;
  let uiDestVoIndex: UINT32;
  let fCopyIntoVo: boolean;
  let fFirstTime: boolean;

  if (pStructureFileRef.value.usNumberOfStructuresStored == 0) {
    return true;
  }
  for (uiLoop = 0; uiLoop < pStructureFileRef.value.usNumberOfStructures; uiLoop++) {
    pDBStructureRef = addressof(pStructureFileRef.value.pDBStructureRef[uiLoop]);
    pDBStructure = pDBStructureRef.value.pDBStructure;
    // if (pDBStructure != NULL && pDBStructure->ubNumberOfTiles > 1 && !(pDBStructure->fFlags & STRUCTURE_WALLSTUFF) )
    if (pDBStructure != null && pDBStructure.value.ubNumberOfTiles > 1) {
      for (ubLoop2 = 1; ubLoop2 < pDBStructure.value.ubNumberOfTiles; ubLoop2++) {
        if (pDBStructureRef.value.ppTile[ubLoop2].value.sPosRelToBase != 0) {
          // spans multiple tiles! (could be two levels high in one tile)
          fFound = true;
          break;
        }
      }
    }
  }

  // ATE: Make all corpses use z-strip info..
  if (pDBStructure != null && pDBStructure.value.fFlags & STRUCTURE_CORPSE) {
    fFound = true;
  }

  if (!fFound) {
    // no multi-tile images in this vobject; that's okay... return!
    return true;
  }
  hVObject.value.ppZStripInfo = MemAlloc(sizeof(ZStripInfo /* Pointer<ZStripInfo> */) * hVObject.value.usNumberOfObjects);
  if (hVObject.value.ppZStripInfo == null) {
    return false;
  }
  memset(hVObject.value.ppZStripInfo, 0, sizeof(ZStripInfo /* Pointer<ZStripInfo> */) * hVObject.value.usNumberOfObjects);

  if (fFromAnimation) {
    // Determine step index for STI
    if (sSTIStartIndex == -1) {
      // one-direction only for this anim structure
      sSTIStep = hVObject.value.usNumberOfObjects;
      sSTIStartIndex = 0;
    } else {
      sSTIStep = (hVObject.value.usNumberOfObjects / pStructureFileRef.value.usNumberOfStructures);
    }
  } else {
    sSTIStep = 1;
  }

  sStructIndex = 0;
  sNext = sSTIStartIndex + sSTIStep;
  fFirstTime = true;

  for (uiLoop = sSTIStartIndex; uiLoop < hVObject.value.usNumberOfObjects; uiLoop++) {
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

    if (fCopyIntoVo && sStructIndex < pStructureFileRef.value.usNumberOfStructures) {
      pDBStructure = pStructureFileRef.value.pDBStructureRef[sStructIndex].pDBStructure;
      if (pDBStructure != null && (pDBStructure.value.ubNumberOfTiles > 1 || (pDBStructure.value.fFlags & STRUCTURE_CORPSE)))
      // if (pDBStructure != NULL && pDBStructure->ubNumberOfTiles > 1 )
      {
        // ATE: We allow SLIDING DOORS of 2 tile sizes...
        if (!(pDBStructure.value.fFlags & STRUCTURE_ANYDOOR) || ((pDBStructure.value.fFlags & (STRUCTURE_ANYDOOR)) && (pDBStructure.value.fFlags & STRUCTURE_SLIDINGDOOR))) {
          hVObject.value.ppZStripInfo[uiDestVoIndex] = MemAlloc(sizeof(ZStripInfo));
          if (hVObject.value.ppZStripInfo[uiDestVoIndex] == null) {
            // augh!! out of memory!  free everything allocated and abort
            for (ubLoop2 = 0; ubLoop2 < uiLoop; ubLoop2++) {
              if (hVObject.value.ppZStripInfo[ubLoop2] != null) {
                MemFree(hVObject.value.ppZStripInfo[uiLoop]);
              }
            }
            MemFree(hVObject.value.ppZStripInfo);
            hVObject.value.ppZStripInfo = null;
            return false;
          } else {
            pCurr = hVObject.value.ppZStripInfo[uiDestVoIndex];

            ubNumIncreasing = 0;
            ubNumStable = 0;
            ubNumDecreasing = 0;

            // time to do our calculations!
            sOffsetX = hVObject.value.pETRLEObject[uiLoop].sOffsetX;
            sOffsetY = hVObject.value.pETRLEObject[uiLoop].sOffsetY;
            usWidth = hVObject.value.pETRLEObject[uiLoop].usWidth;
            usHeight = hVObject.value.pETRLEObject[uiLoop].usHeight;
            if (pDBStructure.value.fFlags & (STRUCTURE_MOBILE | STRUCTURE_CORPSE)) {
              let i: UINT32 = 0;
              // adjust for the difference between the animation and structure base tile

              // if (pDBStructure->fFlags & (STRUCTURE_MOBILE ) )
              {
                sOffsetX = sOffsetX + (WORLD_TILE_X / 2);
                sOffsetY = sOffsetY + (WORLD_TILE_Y / 2);
              }
              // adjust for the tile offset
              sOffsetX = sOffsetX - pDBStructure.value.bZTileOffsetX * (WORLD_TILE_X / 2) + pDBStructure.value.bZTileOffsetY * (WORLD_TILE_X / 2);
              sOffsetY = sOffsetY - pDBStructure.value.bZTileOffsetY * (WORLD_TILE_Y / 2);
            }

            // figure out how much of the image is on each side of
            // the bottom corner of the base tile
            if (sOffsetX <= 0) {
              // note that the adjustments here by (WORLD_TILE_X / 2) are to account for the X difference
              // between the blit position and the bottom corner of the base tile
              sRightHalfWidth = usWidth + sOffsetX - (WORLD_TILE_X / 2);

              if (sRightHalfWidth >= 0) {
                // Case 1: negative image offset, image straddles bottom corner

                // negative of a negative is positive
                sLeftHalfWidth = -sOffsetX + (WORLD_TILE_X / 2);
              } else {
                // Case 2: negative image offset, image all on left side

                // bump up the LeftHalfWidth to the right edge of the last tile-half,
                // so we can calculate the size of the leftmost portion accurately
                // NB subtracting a negative to add the absolute value
                sLeftHalfWidth = usWidth - (sRightHalfWidth % (WORLD_TILE_X / 2));
                sRightHalfWidth = 0;
              }
            } else if (sOffsetX < (WORLD_TILE_X / 2)) {
              sLeftHalfWidth = (WORLD_TILE_X / 2) - sOffsetX;
              sRightHalfWidth = usWidth - sLeftHalfWidth;
              if (sRightHalfWidth <= 0) {
                // Case 3: positive offset < 20, image all on left side
                // should never happen because these images are multi-tile!
                sRightHalfWidth = 0;
                // fake the left width to one half-tile
                sLeftHalfWidth = (WORLD_TILE_X / 2);
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
              ubNumIncreasing = sLeftHalfWidth / (WORLD_TILE_X / 2);
            }
            if (sRightHalfWidth > 0) {
              ubNumStable = 1;
              if (sRightHalfWidth > (WORLD_TILE_X / 2)) {
                ubNumDecreasing = sRightHalfWidth / (WORLD_TILE_X / 2);
              }
            }
            if (sLeftHalfWidth > 0) {
              pCurr.value.ubFirstZStripWidth = sLeftHalfWidth % (WORLD_TILE_X / 2);
              if (pCurr.value.ubFirstZStripWidth == 0) {
                ubNumIncreasing--;
                pCurr.value.ubFirstZStripWidth = (WORLD_TILE_X / 2);
              }
            } else // right side only; offset is at least 20 (= WORLD_TILE_X / 2)
            {
              if (sOffsetX > WORLD_TILE_X) {
                pCurr.value.ubFirstZStripWidth = (WORLD_TILE_X / 2) - (sOffsetX - WORLD_TILE_X) % (WORLD_TILE_X / 2);
              } else {
                pCurr.value.ubFirstZStripWidth = WORLD_TILE_X - sOffsetX;
              }
              if (pCurr.value.ubFirstZStripWidth == 0) {
                ubNumDecreasing--;
                pCurr.value.ubFirstZStripWidth = (WORLD_TILE_X / 2);
              }
            }

            // now create the array!
            pCurr.value.ubNumberOfZChanges = ubNumIncreasing + ubNumStable + ubNumDecreasing;
            pCurr.value.pbZChange = MemAlloc(pCurr.value.ubNumberOfZChanges);
            if (pCurr.value.pbZChange == null) {
              // augh!
              for (ubLoop2 = 0; ubLoop2 < uiLoop; ubLoop2++) {
                if (hVObject.value.ppZStripInfo[ubLoop2] != null) {
                  MemFree(hVObject.value.ppZStripInfo[uiLoop]);
                }
              }
              MemFree(hVObject.value.ppZStripInfo);
              hVObject.value.ppZStripInfo = null;
              return false;
            }
            for (ubLoop2 = 0; ubLoop2 < ubNumIncreasing; ubLoop2++) {
              pCurr.value.pbZChange[ubLoop2] = 1;
            }
            for (; ubLoop2 < ubNumIncreasing + ubNumStable; ubLoop2++) {
              pCurr.value.pbZChange[ubLoop2] = 0;
            }
            for (; ubLoop2 < pCurr.value.ubNumberOfZChanges; ubLoop2++) {
              pCurr.value.pbZChange[ubLoop2] = -1;
            }
            if (ubNumIncreasing > 0) {
              pCurr.value.bInitialZChange = -(ubNumIncreasing);
            } else if (ubNumStable > 0) {
              pCurr.value.bInitialZChange = 0;
            } else {
              pCurr.value.bInitialZChange = -(ubNumDecreasing);
            }
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

export function GetBlockingStructureInfo(sGridNo: INT16, bDir: INT8, bNextDir: INT8, bLevel: INT8, pStructHeight: Pointer<INT8>, ppTallestStructure: Pointer<Pointer<STRUCTURE>>, fWallsBlock: boolean): INT8 {
  let pCurrent: Pointer<STRUCTURE>;
  let pStructure: Pointer<STRUCTURE>;
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
    if (pCurrent.value.sCubeOffset == sDesiredLevel) {
      fOKStructOnLevel = true;
      pStructure = pCurrent;

      // Turn off if we are on upper level!
      if (pCurrent.value.fFlags & STRUCTURE_ROOF && bLevel == 1) {
        fOKStructOnLevel = false;
      }

      // Don't stop FOV for people
      if (pCurrent.value.fFlags & (STRUCTURE_CORPSE | STRUCTURE_PERSON)) {
        fOKStructOnLevel = false;
      }

      if (pCurrent.value.fFlags & (STRUCTURE_TREE | STRUCTURE_ANYFENCE)) {
        fMinimumBlockingFound = true;
      }

      // Default, if we are a wall, set full blocking
      if ((pCurrent.value.fFlags & STRUCTURE_WALL) && !fWallsBlock) {
        // Return full blocking!
        // OK! This will be handled by movement costs......!
        fOKStructOnLevel = false;
      }

      // CHECK FOR WINDOW
      if (pCurrent.value.fFlags & STRUCTURE_WALLNWINDOW) {
        switch (pCurrent.value.ubWallOrientation) {
          case Enum314.OUTSIDE_TOP_LEFT:
          case Enum314.INSIDE_TOP_LEFT:

            (pStructHeight.value) = StructureHeight(pCurrent);
            (ppTallestStructure.value) = pCurrent;

            if (pCurrent.value.fFlags & STRUCTURE_OPEN) {
              return BLOCKING_TOPLEFT_OPEN_WINDOW;
            } else {
              return BLOCKING_TOPLEFT_WINDOW;
            }
            break;

          case Enum314.OUTSIDE_TOP_RIGHT:
          case Enum314.INSIDE_TOP_RIGHT:

            (pStructHeight.value) = StructureHeight(pCurrent);
            (ppTallestStructure.value) = pCurrent;

            if (pCurrent.value.fFlags & STRUCTURE_OPEN) {
              return BLOCKING_TOPRIGHT_OPEN_WINDOW;
            } else {
              return BLOCKING_TOPRIGHT_WINDOW;
            }
            break;
        }
      }

      // Check for door
      if (pCurrent.value.fFlags & STRUCTURE_ANYDOOR) {
        // If we are not opem, we are full blocking!
        if (!(pCurrent.value.fFlags & STRUCTURE_OPEN)) {
          (pStructHeight.value) = StructureHeight(pCurrent);
          (ppTallestStructure.value) = pCurrent;
          return FULL_BLOCKING;
          break;
        } else {
          switch (pCurrent.value.ubWallOrientation) {
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
    pCurrent = pCurrent.value.pNext;
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

export function FindStructureBySavedInfo(sGridNo: INT16, ubType: UINT8, ubWallOrientation: UINT8, bLevel: INT8): Pointer<STRUCTURE> {
  let pCurrent: Pointer<STRUCTURE>;
  let uiTypeFlag: UINT32;

  uiTypeFlag = StructureTypeToFlag(ubType);

  pCurrent = gpWorldLevelData[sGridNo].pStructureHead;
  while (pCurrent != null) {
    if (pCurrent.value.fFlags & uiTypeFlag && pCurrent.value.ubWallOrientation == ubWallOrientation && ((bLevel == 0 && pCurrent.value.sCubeOffset == 0) || (bLevel > 0 && pCurrent.value.sCubeOffset > 0))) {
      return pCurrent;
    }
    pCurrent = pCurrent.value.pNext;
  }
  return null;
}

export function GetStructureOpenSound(pStructure: Pointer<STRUCTURE>, fClose: boolean): UINT32 {
  let uiSoundID: UINT32;

  switch (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubArmour) {
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
