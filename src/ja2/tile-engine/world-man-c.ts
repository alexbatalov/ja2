let guiLNCount: UINT32[] /* [9] */;
/* static */ let gzLevelString: CHAR16[][] /* [9][15] */ = [
  "",
  "Land    %d",
  "Object  %d",
  "Struct  %d",
  "Shadow  %d",
  "Merc    %d",
  "Roof    %d",
  "Onroof  %d",
  "Topmost %d",
];

let guiLevelNodes: UINT32 = 0;

// LEVEL NODE MANIPLULATION FUNCTIONS
function CreateLevelNode(ppNode: Pointer<Pointer<LEVELNODE>>): BOOLEAN {
  ppNode.value = MemAlloc(sizeof(LEVELNODE));
  CHECKF(ppNode.value != NULL);

  // Clear all values
  memset(ppNode.value, 0, sizeof(LEVELNODE));

  // Set default values
  (ppNode.value).value.ubShadeLevel = LightGetAmbient();
  (ppNode.value).value.ubNaturalShadeLevel = LightGetAmbient();
  (ppNode.value).value.pSoldier = NULL;
  (ppNode.value).value.pNext = NULL;
  (ppNode.value).value.sRelativeX = 0;
  (ppNode.value).value.sRelativeY = 0;

  guiLevelNodes++;

  return TRUE;
}

function CountLevelNodes(): void {
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let pLN: Pointer<LEVELNODE>;
  let pME: Pointer<MAP_ELEMENT>;

  for (uiLoop2 = 0; uiLoop2 < 9; uiLoop2++) {
    guiLNCount[uiLoop2] = 0;
  }

  for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
    pME = addressof(gpWorldLevelData[uiLoop]);
    // start at 1 to skip land head ptr; 0 stores total
    for (uiLoop2 = 1; uiLoop2 < 9; uiLoop2++) {
      pLN = pME.value.pLevelNodes[uiLoop2];
      while (pLN != NULL) {
        guiLNCount[uiLoop2]++;
        guiLNCount[0]++;
        pLN = pLN.value.pNext;
      }
    }
  }
}

const LINE_HEIGHT = 20;
function DebugLevelNodePage(): void {
  let uiLoop: UINT32;

  SetFont(LARGEFONT1);
  gprintf(0, 0, "DEBUG LEVELNODES PAGE 1 OF 1");

  for (uiLoop = 1; uiLoop < 9; uiLoop++) {
    gprintf(0, LINE_HEIGHT * (uiLoop + 1), gzLevelString[uiLoop], guiLNCount[uiLoop]);
  }
  gprintf(0, LINE_HEIGHT * 12, "%d land nodes in excess of world max (25600)", guiLNCount[1] - WORLD_MAX);
  gprintf(0, LINE_HEIGHT * 13, "Total # levelnodes %d, %d bytes each", guiLNCount[0], sizeof(LEVELNODE));
  gprintf(0, LINE_HEIGHT * 14, "Total memory for levelnodes %d", guiLNCount[0] * sizeof(LEVELNODE));
}

function TypeExistsInLevel(pStartNode: Pointer<LEVELNODE>, fType: UINT32, pusIndex: Pointer<UINT16>): BOOLEAN {
  let fTileType: UINT32;

  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    if (pStartNode.value.usIndex != NO_TILE && pStartNode.value.usIndex < Enum312.NUMBEROFTILES) {
      GetTileType(pStartNode.value.usIndex, addressof(fTileType));

      if (fTileType == fType) {
        pusIndex.value = pStartNode.value.usIndex;
        return TRUE;
      }
    }

    pStartNode = pStartNode.value.pNext;
  }

  // Could not find it, return FALSE
  return FALSE;
}

// SHADE LEVEL MANIPULATION FOR NODES
function SetLevelShadeLevel(pStartNode: Pointer<LEVELNODE>, ubShadeLevel: UINT8): void {
  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    pStartNode.value.ubShadeLevel = ubShadeLevel;

    // Advance to next
    pStartNode = pStartNode.value.pNext;
  }
}

function AdjustLevelShadeLevel(pStartNode: Pointer<LEVELNODE>, bShadeDiff: INT8): void {
  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    pStartNode.value.ubShadeLevel += bShadeDiff;

    if (pStartNode.value.ubShadeLevel > MAX_SHADE_LEVEL) {
      pStartNode.value.ubShadeLevel = MAX_SHADE_LEVEL;
    }

    if (pStartNode.value.ubShadeLevel < MIN_SHADE_LEVEL) {
      pStartNode.value.ubShadeLevel = MIN_SHADE_LEVEL;
    }

    // Advance to next
    pStartNode = pStartNode.value.pNext;
  }
}

function SetIndexLevelNodeFlags(pStartNode: Pointer<LEVELNODE>, uiFlags: UINT32, usIndex: UINT16): void {
  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    if (pStartNode.value.usIndex == usIndex) {
      pStartNode.value.uiFlags |= uiFlags;
      break;
    }

    // Advance to next
    pStartNode = pStartNode.value.pNext;
  }
}

function RemoveIndexLevelNodeFlags(pStartNode: Pointer<LEVELNODE>, uiFlags: UINT32, usIndex: UINT16): void {
  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    if (pStartNode.value.usIndex == usIndex) {
      pStartNode.value.uiFlags &= (~uiFlags);
      break;
    }

    // Advance to next
    pStartNode = pStartNode.value.pNext;
  }
}

// First for object layer
// #################################################################

function AddObjectToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  let pObject: Pointer<LEVELNODE> = NULL;
  let pNextObject: Pointer<LEVELNODE> = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // If we're at the head, set here
  if (pObject == NULL) {
    CHECKF(CreateLevelNode(addressof(pNextObject)) != FALSE);
    pNextObject.value.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pObjectHead = pNextObject;
  } else {
    while (pObject != NULL) {
      if (pObject.value.pNext == NULL) {
        CHECKF(CreateLevelNode(addressof(pNextObject)) != FALSE);
        pObject.value.pNext = pNextObject;

        pNextObject.value.pNext = NULL;
        pNextObject.value.usIndex = usIndex;

        break;
      }

      pObject = pObject.value.pNext;
    }
  }

  // CheckForAndAddTileCacheStructInfo( pNextObject, (INT16)iMapIndex, usIndex );

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_OBJECTS);
  return pNextObject;
}

function AddObjectToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pObject: Pointer<LEVELNODE> = NULL;
  let pNextObject: Pointer<LEVELNODE> = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  CHECKF(CreateLevelNode(addressof(pNextObject)) != FALSE);

  pNextObject.value.pNext = pObject;
  pNextObject.value.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pObjectHead = pNextObject;

  // CheckForAndAddTileCacheStructInfo( pNextObject, (INT16)iMapIndex, usIndex );

  // If it's NOT the first head
  ResetSpecificLayerOptimizing(TILES_DYNAMIC_OBJECTS);

  // Add the object to the map temp file, if we have to
  AddObjectToMapTempFile(iMapIndex, usIndex);

  return TRUE;
}

function RemoveObject(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pObject: Pointer<LEVELNODE> = NULL;
  let pOldObject: Pointer<LEVELNODE> = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and remove index if found

  while (pObject != NULL) {
    if (pObject.value.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldObject == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pObjectHead = pObject.value.pNext;
      } else {
        pOldObject.value.pNext = pObject.value.pNext;
      }

      CheckForAndDeleteTileCacheStructInfo(pObject, usIndex);

      // Delete memory assosiated with item
      MemFree(pObject);
      guiLevelNodes--;

      // Add the index to the maps temp file so we can remove it after reloading the map
      AddRemoveObjectToMapTempFile(iMapIndex, usIndex);

      return TRUE;
    }

    pOldObject = pObject;
    pObject = pObject.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeRangeExistsInObjectLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusObjectIndex: Pointer<UINT16>): BOOLEAN {
  let pObject: Pointer<LEVELNODE> = NULL;
  let pOldObject: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and Search for type

  while (pObject != NULL) {
    // Advance to next
    pOldObject = pObject;
    pObject = pObject.value.pNext;

    if (pOldObject.value.usIndex != NO_TILE && pOldObject.value.usIndex < Enum312.NUMBEROFTILES) {
      GetTileType(pOldObject.value.usIndex, addressof(fTileType));

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pusObjectIndex.value = pOldObject.value.usIndex;
        return TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeExistsInObjectLayer(iMapIndex: UINT32, fType: UINT32, pusObjectIndex: Pointer<UINT16>): BOOLEAN {
  let pObject: Pointer<LEVELNODE> = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  return TypeExistsInLevel(pObject, fType, pusObjectIndex);
}

function SetAllObjectShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pObject: Pointer<LEVELNODE> = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  SetLevelShadeLevel(pObject, ubShadeLevel);
}

function AdjustAllObjectShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pObject: Pointer<LEVELNODE> = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  AdjustLevelShadeLevel(pObject, bShadeDiff);
}

function RemoveAllObjectsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  let pObject: Pointer<LEVELNODE> = NULL;
  let pOldObject: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let fRetVal: BOOLEAN = FALSE;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and Search for type

  while (pObject != NULL) {
    // Advance to next
    pOldObject = pObject;
    pObject = pObject.value.pNext;

    if (pOldObject.value.usIndex != NO_TILE && pOldObject.value.usIndex < Enum312.NUMBEROFTILES) {
      GetTileType(pOldObject.value.usIndex, addressof(fTileType));

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveObject(iMapIndex, pOldObject.value.usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

// #######################################################
// Land Peice Layer
// #######################################################

function AddLandToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pNextLand: Pointer<LEVELNODE> = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // If we're at the head, set here
  if (pLand == NULL) {
    CHECKF(CreateLevelNode(addressof(pNextLand)) != FALSE);
    pNextLand.value.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pLandHead = pNextLand;
  } else {
    while (pLand != NULL) {
      if (pLand.value.pNext == NULL) {
        CHECKF(CreateLevelNode(addressof(pNextLand)) != FALSE);
        pLand.value.pNext = pNextLand;

        pNextLand.value.pNext = NULL;
        pNextLand.value.pPrevNode = pLand;
        pNextLand.value.usIndex = usIndex;

        break;
      }

      pLand = pLand.value.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return pNextLand;
}

function AddLandToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pNextLand: Pointer<LEVELNODE> = NULL;
  let TileElem: TILE_ELEMENT;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Allocate head
  CHECKF(CreateLevelNode(addressof(pNextLand)) != FALSE);

  pNextLand.value.pNext = pLand;
  pNextLand.value.pPrevNode = NULL;
  pNextLand.value.usIndex = usIndex;
  pNextLand.value.ubShadeLevel = LightGetAmbient();

  if (usIndex < Enum312.NUMBEROFTILES) {
    // Get tile element
    TileElem = gTileDatabase[usIndex];

    // Check for full tile
    if (TileElem.ubFullTile) {
      gpWorldLevelData[iMapIndex].pLandStart = pNextLand;
    }
  }

  // Set head
  gpWorldLevelData[iMapIndex].pLandHead = pNextLand;

  // If it's NOT the first head
  if (pLand != NULL) {
    pLand.value.pPrevNode = pNextLand;
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return TRUE;
}

function RemoveLand(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  RemoveLandEx(iMapIndex, usIndex);

  AdjustForFullTile(iMapIndex);

  return FALSE;
}

function RemoveLandEx(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != NULL) {
    if (pLand.value.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pLand.value.pPrevNode == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pLandHead = pLand.value.pNext;
      } else {
        pLand.value.pPrevNode.value.pNext = pLand.value.pNext;
      }

      // Check for tail
      if (pLand.value.pNext == NULL) {
      } else {
        pLand.value.pNext.value.pPrevNode = pLand.value.pPrevNode;
      }

      // Delete memory assosiated with item
      MemFree(pLand);
      guiLevelNodes--;

      break;
    }
    pLand = pLand.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function AdjustForFullTile(iMapIndex: UINT32): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pOldLand: Pointer<LEVELNODE> = NULL;
  let TileElem: TILE_ELEMENT;
  //	UINT32 iType;
  //	UINT16 iNewIndex;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != NULL) {
    if (pLand.value.usIndex < Enum312.NUMBEROFTILES) {
      // If this is a full tile, set new full tile
      TileElem = gTileDatabase[pLand.value.usIndex];

      // Check for full tile
      if (TileElem.ubFullTile) {
        gpWorldLevelData[iMapIndex].pLandStart = pLand;
        return TRUE;
      }
    }
    pOldLand = pLand;
    pLand = pLand.value.pNext;
  }

  // Could not find a full tile
  // Set to tail, and convert it to a full tile!
  // Add a land peice to tail from basic land
  {
    let NewIndex: UINT16;
    let pNewNode: Pointer<LEVELNODE>;

    NewIndex = (Random(10));

    // Adjust for type
    NewIndex += gTileTypeStartIndex[gCurrentBackground];

    pNewNode = AddLandToTail(iMapIndex, NewIndex);

    gpWorldLevelData[iMapIndex].pLandStart = pNewNode;
  }

  return FALSE;
}

function ReplaceLandIndex(iMapIndex: UINT32, usOldIndex: UINT16, usNewIndex: UINT16): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != NULL) {
    if (pLand.value.usIndex == usOldIndex) {
      // OK, set new index value
      pLand.value.usIndex = usNewIndex;

      AdjustForFullTile(iMapIndex);

      return TRUE;
    }

    // Advance
    pLand = pLand.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeExistsInLandLayer(iMapIndex: UINT32, fType: UINT32, pusLandIndex: Pointer<UINT16>): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  return TypeExistsInLevel(pLand, fType, pusLandIndex);
}

function TypeRangeExistsInLandLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusLandIndex: Pointer<UINT16>): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pOldLand: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != NULL) {
    if (pLand.value.usIndex != NO_TILE) {
      GetTileType(pLand.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldLand = pLand;
      pLand = pLand.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pusLandIndex.value = pOldLand.value.usIndex;
        return TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeRangeExistsInLandHead(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusLandIndex: Pointer<UINT16>): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pOldLand: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  if (pLand.value.usIndex != NO_TILE) {
    GetTileType(pLand.value.usIndex, addressof(fTileType));

    // Advance to next
    pOldLand = pLand;
    pLand = pLand.value.pNext;

    if (fTileType >= fStartType && fTileType <= fEndType) {
      pusLandIndex.value = pOldLand.value.usIndex;
      return TRUE;
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeRangeExistsInStructLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusStructIndex: Pointer<UINT16>): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != NULL) {
    if (pStruct.value.usIndex != NO_TILE) {
      GetTileType(pStruct.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pusStructIndex.value = pOldStruct.value.usIndex;
        return TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveAllLandsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pOldLand: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let fRetVal: BOOLEAN = FALSE;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != NULL) {
    if (pLand.value.usIndex != NO_TILE) {
      GetTileType(pLand.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldLand = pLand;
      pLand = pLand.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveLand(iMapIndex, pOldLand.value.usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

function SetAllLandShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pLand: Pointer<LEVELNODE> = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  SetLevelShadeLevel(pLand, ubShadeLevel);
}

function AdjustAllLandShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pLand: Pointer<LEVELNODE> = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type
  AdjustLevelShadeLevel(pLand, bShadeDiff);
}

function DeleteAllLandLayers(iMapIndex: UINT32): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pOldLand: Pointer<LEVELNODE> = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != NULL) {
    // Advance to next
    pOldLand = pLand;
    pLand = pLand.value.pNext;

    // Remove Item
    RemoveLandEx(iMapIndex, pOldLand.value.usIndex);
  }

  // Set world data values
  gpWorldLevelData[iMapIndex].pLandHead = NULL;
  gpWorldLevelData[iMapIndex].pLandStart = NULL;

  return TRUE;
}

function InsertLandIndexAtLevel(iMapIndex: UINT32, usIndex: UINT16, ubLevel: UINT8): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pNextLand: Pointer<LEVELNODE> = NULL;
  let level: UINT8 = 0;
  let CanInsert: BOOLEAN = FALSE;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // If we want to insert at head;
  if (ubLevel == 0) {
    AddLandToHead(iMapIndex, usIndex);
    return TRUE;
  }

  // Allocate memory for new item
  CHECKF(CreateLevelNode(addressof(pNextLand)) != FALSE);
  pNextLand.value.usIndex = usIndex;

  // Move to index before insertion
  while (pLand != NULL) {
    if (level == (ubLevel - 1)) {
      CanInsert = TRUE;
      break;
    }

    pLand = pLand.value.pNext;
    level++;
  }

  // Check if level has been macthed
  if (!CanInsert) {
    return FALSE;
  }

  // Set links, according to position!
  pNextLand.value.pPrevNode = pLand;
  pNextLand.value.pNext = pLand.value.pNext;
  pLand.value.pNext = pNextLand;

  // Check for tail
  if (pNextLand.value.pNext == NULL) {
  } else {
    pNextLand.value.pNext.value.pPrevNode = pNextLand;
  }

  AdjustForFullTile(iMapIndex);

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return TRUE;
}

function RemoveHigherLandLevels(iMapIndex: UINT32, fSrcType: UINT32, puiHigherTypes: Pointer<Pointer<UINT32>>, pubNumHigherTypes: Pointer<UINT8>): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pOldLand: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let ubSrcLogHeight: UINT8;

  pubNumHigherTypes.value = 0;
  puiHigherTypes.value = NULL;

  // Start at tail and up
  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // GEt tail
  while (pLand != NULL) {
    pOldLand = pLand;
    pLand = pLand.value.pNext;
  }

  pLand = pOldLand;

  // Get src height
  GetTileTypeLogicalHeight(fSrcType, addressof(ubSrcLogHeight));

  // Look through all objects and Search for height
  while (pLand != NULL) {
    GetTileType(pLand.value.usIndex, addressof(fTileType));

    // Advance to next
    pOldLand = pLand;
    pLand = pLand.value.pPrevNode;

    if (gTileTypeLogicalHeight[fTileType] > ubSrcLogHeight) {
      // Remove Item
      SetLandIndex(iMapIndex, pOldLand.value.usIndex, fTileType, TRUE);

      (pubNumHigherTypes.value)++;

      puiHigherTypes.value = MemRealloc(puiHigherTypes.value, (pubNumHigherTypes.value) * sizeof(UINT32));

      (puiHigherTypes.value)[(pubNumHigherTypes.value) - 1] = fTileType;
    }
  }

  // Adjust full tile sets
  AdjustForFullTile(iMapIndex);

  return TRUE;
}

function SetLowerLandLevels(iMapIndex: UINT32, fSrcType: UINT32, usIndex: UINT16): BOOLEAN {
  let pLand: Pointer<LEVELNODE> = NULL;
  let pOldLand: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let ubSrcLogHeight: UINT8;
  let NewTile: UINT16;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Get src height
  GetTileTypeLogicalHeight(fSrcType, addressof(ubSrcLogHeight));

  // Look through all objects and Search for height
  while (pLand != NULL) {
    GetTileType(pLand.value.usIndex, addressof(fTileType));

    // Advance to next
    pOldLand = pLand;
    pLand = pLand.value.pNext;

    if (gTileTypeLogicalHeight[fTileType] < ubSrcLogHeight) {
      // Set item
      GetTileIndexFromTypeSubIndex(fTileType, usIndex, addressof(NewTile));

      // Set as normal
      SetLandIndex(iMapIndex, NewTile, fTileType, FALSE);
    }
  }

  // Adjust full tile sets
  AdjustForFullTile(iMapIndex);

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return TRUE;
}

// Struct layer
// #################################################################

function AddStructToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  return AddStructToTailCommon(iMapIndex, usIndex, TRUE);
}

function ForceStructToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  return AddStructToTailCommon(iMapIndex, usIndex, FALSE);
}

function AddStructToTailCommon(iMapIndex: UINT32, usIndex: UINT16, fAddStructDBInfo: BOOLEAN): Pointer<LEVELNODE> {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pTailStruct: Pointer<LEVELNODE> = NULL;
  let pNextStruct: Pointer<LEVELNODE> = NULL;
  let pDBStructure: Pointer<DB_STRUCTURE>;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Do we have an empty list?
  if (pStruct == NULL) {
    CHECKF(CreateLevelNode(addressof(pNextStruct)) != FALSE);

    if (fAddStructDBInfo) {
      if (usIndex < Enum312.NUMBEROFTILES) {
        if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
          if (AddStructureToWorld(iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == FALSE) {
            MemFree(pNextStruct);
            guiLevelNodes--;
            return NULL;
          }
        } else {
          //				 pNextStruct->pStructureData = NULL;
        }
      }
    }

    pNextStruct.value.usIndex = usIndex;

    pNextStruct.value.pNext = NULL;

    gpWorldLevelData[iMapIndex].pStructHead = pNextStruct;
  } else {
    // MOVE TO TAIL
    while (pStruct != NULL) {
      pTailStruct = pStruct;
      pStruct = pStruct.value.pNext;
    }

    CHECKN(CreateLevelNode(addressof(pNextStruct)) != FALSE);

    if (fAddStructDBInfo) {
      if (usIndex < Enum312.NUMBEROFTILES) {
        if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
          if (AddStructureToWorld(iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == FALSE) {
            MemFree(pNextStruct);
            guiLevelNodes--;
            return NULL;
          } else {
            //					pNextStruct->pStructureData = NULL;
          }
        }
      }
    }
    pNextStruct.value.usIndex = usIndex;

    pNextStruct.value.pNext = NULL;
    pTailStruct.value.pNext = pNextStruct;
  }

  // Check flags for tiledat and set a shadow if we have a buddy
  if (usIndex < Enum312.NUMBEROFTILES) {
    if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
      AddShadowToHead(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
      gpWorldLevelData[iMapIndex].pShadowHead.value.uiFlags |= LEVELNODE_BUDDYSHADOW;
    }

    // Check for special flag to stop burn-through on same-tile structs...
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      pDBStructure = gTileDatabase[usIndex].pDBStructureRef.value.pDBStructure;

      // Default to off....
      gpWorldLevelData[iMapIndex].ubExtFlags[0] &= (~MAPELEMENT_EXT_NOBURN_STRUCT);

      // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
      if (!FindStructure(iMapIndex, STRUCTURE_WALLSTUFF) && pDBStructure.value.ubNumberOfTiles == 1) {
        // Set flag...
        gpWorldLevelData[iMapIndex].ubExtFlags[0] |= MAPELEMENT_EXT_NOBURN_STRUCT;
      }
    }
  }

  // Add the structure the maps temp file
  AddStructToMapTempFile(iMapIndex, usIndex);

  // CheckForAndAddTileCacheStructInfo( pNextStruct, (INT16)iMapIndex, usIndex );

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);

  return pNextStruct;
}

function AddStructToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pNextStruct: Pointer<LEVELNODE> = NULL;
  let pDBStructure: Pointer<DB_STRUCTURE>;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  CHECKF(CreateLevelNode(addressof(pNextStruct)) != FALSE);

  if (usIndex < Enum312.NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      if (AddStructureToWorld(iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == FALSE) {
        MemFree(pNextStruct);
        guiLevelNodes--;
        return FALSE;
      }
    }
  }

  pNextStruct.value.pNext = pStruct;
  pNextStruct.value.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pStructHead = pNextStruct;

  SetWorldFlagsFromNewNode(iMapIndex, pNextStruct.value.usIndex);

  if (usIndex < Enum312.NUMBEROFTILES) {
    // Check flags for tiledat and set a shadow if we have a buddy
    if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
      AddShadowToHead(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
      gpWorldLevelData[iMapIndex].pShadowHead.value.uiFlags |= LEVELNODE_BUDDYSHADOW;
    }

    // Check for special flag to stop burn-through on same-tile structs...
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      pDBStructure = gTileDatabase[usIndex].pDBStructureRef.value.pDBStructure;

      // Default to off....
      gpWorldLevelData[iMapIndex].ubExtFlags[0] &= (~MAPELEMENT_EXT_NOBURN_STRUCT);

      // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
      if (!!FindStructure(iMapIndex, STRUCTURE_WALLSTUFF) && pDBStructure.value.ubNumberOfTiles == 1) {
        // Set flag...
        gpWorldLevelData[iMapIndex].ubExtFlags[0] |= MAPELEMENT_EXT_NOBURN_STRUCT;
      }
    }
  }

  // Add the structure the maps temp file
  AddStructToMapTempFile(iMapIndex, usIndex);

  // CheckForAndAddTileCacheStructInfo( pNextStruct, (INT16)iMapIndex, usIndex );

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);
  return TRUE;
}

function InsertStructIndex(iMapIndex: UINT32, usIndex: UINT16, ubLevel: UINT8): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pNextStruct: Pointer<LEVELNODE> = NULL;
  let level: UINT8 = 0;
  let CanInsert: BOOLEAN = FALSE;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // If we want to insert at head;
  if (ubLevel == 0) {
    return AddStructToHead(iMapIndex, usIndex);
  }

  // Allocate memory for new item
  CHECKF(CreateLevelNode(addressof(pNextStruct)) != FALSE);

  pNextStruct.value.usIndex = usIndex;

  // Move to index before insertion
  while (pStruct != NULL) {
    if (level == (ubLevel - 1)) {
      CanInsert = TRUE;
      break;
    }

    pStruct = pStruct.value.pNext;
    level++;
  }

  // Check if level has been macthed
  if (!CanInsert) {
    MemFree(pNextStruct);
    guiLevelNodes--;
    return FALSE;
  }

  if (usIndex < Enum312.NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      if (AddStructureToWorld(iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == FALSE) {
        MemFree(pNextStruct);
        guiLevelNodes--;
        return FALSE;
      }
    }
  }

  // Set links, according to position!
  pNextStruct.value.pNext = pStruct.value.pNext;
  pStruct.value.pNext = pNextStruct;

  // CheckForAndAddTileCacheStructInfo( pNextStruct, (INT16)iMapIndex, usIndex );

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);
  return TRUE;
}

function RemoveStructFromTail(iMapIndex: UINT32): BOOLEAN {
  return RemoveStructFromTailCommon(iMapIndex, TRUE);
}

function ForceRemoveStructFromTail(iMapIndex: UINT32): BOOLEAN {
  return RemoveStructFromTailCommon(iMapIndex, FALSE);
}

function RemoveStructFromTailCommon(iMapIndex: UINT32, fRemoveStructDBInfo: BOOLEAN): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pPrevStruct: Pointer<LEVELNODE> = NULL;
  let usIndex: UINT16;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // GOTO TAIL
  while (pStruct != NULL) {
    // AT THE TAIL
    if (pStruct.value.pNext == NULL) {
      if (pPrevStruct != NULL) {
        pPrevStruct.value.pNext = pStruct.value.pNext;
      } else
        gpWorldLevelData[iMapIndex].pStructHead = pPrevStruct;

      if (fRemoveStructDBInfo) {
        // Check for special flag to stop burn-through on same-tile structs...
        if (pStruct.value.pStructureData != NULL) {
          // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
          // if ( !( pStruct->pStructureData->fFlags & STRUCTURE_WALLSTUFF ) && pStruct->pStructureData->pDBStructureRef->pDBStructure->ubNumberOfTiles == 1 )
          //{
          // UNSet flag...
          //	gpWorldLevelData[ iMapIndex ].ubExtFlags[0] &= ( ~MAPELEMENT_EXT_NOBURN_STRUCT );
          //}
        }

        DeleteStructureFromWorld(pStruct.value.pStructureData);
      }

      usIndex = pStruct.value.usIndex;

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      MemFree(pStruct);
      guiLevelNodes--;

      if (usIndex < Enum312.NUMBEROFTILES) {
        // Check flags for tiledat and set a shadow if we have a buddy
        if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
          RemoveShadow(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
        }
      }
      return TRUE;
    }

    pPrevStruct = pStruct;
    pStruct = pStruct.value.pNext;
  }

  return TRUE;
}

function RemoveStruct(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and remove index if found

  while (pStruct != NULL) {
    if (pStruct.value.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldStruct == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pStructHead = pStruct.value.pNext;
      } else {
        pOldStruct.value.pNext = pStruct.value.pNext;
      }

      // Check for special flag to stop burn-through on same-tile structs...
      if (pStruct.value.pStructureData != NULL) {
        // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
        // if ( !( pStruct->pStructureData->fFlags & STRUCTURE_WALLSTUFF ) && pStruct->pStructureData->pDBStructureRef->pDBStructure->ubNumberOfTiles == 1 )
        //{
        // UNSet flag...
        //	gpWorldLevelData[ iMapIndex ].ubExtFlags[0] &= ( ~MAPELEMENT_EXT_NOBURN_STRUCT );
        //}
      }

      // Delete memory assosiated with item
      DeleteStructureFromWorld(pStruct.value.pStructureData);

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      if (usIndex < Enum312.NUMBEROFTILES) {
        // Check flags for tiledat and set a shadow if we have a buddy
        if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
          RemoveShadow(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
        }
      }
      MemFree(pStruct);
      guiLevelNodes--;

      return TRUE;
    }

    pOldStruct = pStruct;
    pStruct = pStruct.value.pNext;
  }

  // Could not find it, return FALSE
  RemoveWorldFlagsFromNewNode(iMapIndex, usIndex);

  return FALSE;
}

function RemoveStructFromLevelNode(iMapIndex: UINT32, pNode: Pointer<LEVELNODE>): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;
  let usIndex: UINT16;

  usIndex = pNode.value.usIndex;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and remove index if found

  while (pStruct != NULL) {
    if (pStruct == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldStruct == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pStructHead = pStruct.value.pNext;
      } else {
        pOldStruct.value.pNext = pStruct.value.pNext;
      }

      // Delete memory assosiated with item
      DeleteStructureFromWorld(pStruct.value.pStructureData);

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      if (pNode.value.usIndex < Enum312.NUMBEROFTILES) {
        // Check flags for tiledat and set a shadow if we have a buddy
        if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
          RemoveShadow(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
        }
      }
      MemFree(pStruct);
      guiLevelNodes--;

      return TRUE;
    }

    pOldStruct = pStruct;
    pStruct = pStruct.value.pNext;
  }

  // Could not find it, return FALSE
  RemoveWorldFlagsFromNewNode(iMapIndex, usIndex);

  return FALSE;
}

function RemoveAllStructsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let usIndex: UINT16;
  let fRetVal: BOOLEAN = FALSE;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != NULL) {
    if (pStruct.value.usIndex != NO_TILE) {
      GetTileType(pStruct.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        usIndex = pOldStruct.value.usIndex;

        // Remove Item
        if (usIndex < Enum312.NUMBEROFTILES) {
          RemoveStruct(iMapIndex, pOldStruct.value.usIndex);
          fRetVal = TRUE;
          if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
            RemoveShadow(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
          }
        }
      }
    }
  }
  return fRetVal;
}

// Kris:  This was a serious problem.  When saving the map and then reloading it, the structure
//  information was invalid if you changed the types, etc.  This is the bulletproof way.
function ReplaceStructIndex(iMapIndex: UINT32, usOldIndex: UINT16, usNewIndex: UINT16): BOOLEAN {
  RemoveStruct(iMapIndex, usOldIndex);
  AddWallToStructLayer(iMapIndex, usNewIndex, FALSE);
  return TRUE;
  //	LEVELNODE	*pStruct				= NULL;
  //	pStruct = gpWorldLevelData[ iMapIndex ].pStructHead;
  // Look through all Structs and remove index if found
  //	while( pStruct != NULL )
  //	{
  //		if ( pStruct->usIndex == usOldIndex )
  //		{
  //			// OK, set new index value
  //			pStruct->usIndex = usNewIndex;
  //			AdjustForFullTile( iMapIndex );
  //			return( TRUE );
  //		}
  //		// Advance
  //		pStruct = pStruct->pNext;
  //	}
  //	// Could not find it, return FALSE
  //	return( FALSE );
}

// When adding, put in order such that it's drawn before any walls of a
// lesser orientation value
function AddWallToStructLayer(iMapIndex: INT32, usIndex: UINT16, fReplace: BOOLEAN): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let usCheckWallOrient: UINT16;
  let usWallOrientation: UINT16;
  let fInsertFound: BOOLEAN = FALSE;
  let fRoofFound: BOOLEAN = FALSE;
  let ubRoofLevel: UINT8 = 0;
  let uiCheckType: UINT32;
  let ubLevel: UINT8 = 0;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Get orientation of peice we want to add
  GetWallOrientation(usIndex, addressof(usWallOrientation));

  // Look through all objects and Search for orientation
  while (pStruct != NULL) {
    GetWallOrientation(pStruct.value.usIndex, addressof(usCheckWallOrient));
    // OLD CASE
    // if ( usCheckWallOrient > usWallOrientation )
    // Kris:
    // New case -- If placing a new wall which is at right angles to the current wall, then
    // we insert it.
    if (usCheckWallOrient > usWallOrientation) {
      if ((usWallOrientation == Enum314.INSIDE_TOP_RIGHT || usWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) && (usCheckWallOrient == Enum314.INSIDE_TOP_LEFT || usCheckWallOrient == Enum314.OUTSIDE_TOP_LEFT) || (usWallOrientation == Enum314.INSIDE_TOP_LEFT || usWallOrientation == Enum314.OUTSIDE_TOP_LEFT) && (usCheckWallOrient == Enum314.INSIDE_TOP_RIGHT || usCheckWallOrient == Enum314.OUTSIDE_TOP_RIGHT)) {
        fInsertFound = TRUE;
      }
    }

    GetTileType(pStruct.value.usIndex, addressof(uiCheckType));

    //		if ( uiCheckType >= FIRSTFLOOR && uiCheckType <= LASTFLOOR )
    if (uiCheckType >= Enum313.FIRSTROOF && uiCheckType <= LASTROOF) {
      fRoofFound = TRUE;
      ubRoofLevel = ubLevel;
    }

    // OLD CHECK
    // Check if it's the same orientation
    // if ( usCheckWallOrient == usWallOrientation )
    // Kris:
    // New check -- we want to check for walls being parallel to each other.  If so, then
    // we we want to replace it.  This is because of an existing problem with say, INSIDE_TOP_LEFT
    // and OUTSIDE_TOP_LEFT walls coexisting.
    if ((usWallOrientation == Enum314.INSIDE_TOP_RIGHT || usWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) && (usCheckWallOrient == Enum314.INSIDE_TOP_RIGHT || usCheckWallOrient == Enum314.OUTSIDE_TOP_RIGHT) || (usWallOrientation == Enum314.INSIDE_TOP_LEFT || usWallOrientation == Enum314.OUTSIDE_TOP_LEFT) && (usCheckWallOrient == Enum314.INSIDE_TOP_LEFT || usCheckWallOrient == Enum314.OUTSIDE_TOP_LEFT)) {
      // Same, if replace, replace here
      if (fReplace) {
        return ReplaceStructIndex(iMapIndex, pStruct.value.usIndex, usIndex);
      } else {
        return FALSE;
      }
    }

    // Advance to next
    pStruct = pStruct.value.pNext;

    ubLevel++;
  }

  // Check if we found an insert position, otherwise set to head
  if (fInsertFound) {
    // Insert struct at head
    AddStructToHead(iMapIndex, usIndex);
  } else {
    // Make sure it's ALWAYS after the roof ( if any )
    if (fRoofFound) {
      InsertStructIndex(iMapIndex, usIndex, ubRoofLevel);
    } else {
      AddStructToTail(iMapIndex, usIndex);
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);
  // Could not find it, return FALSE
  return TRUE;
}

function TypeExistsInStructLayer(iMapIndex: UINT32, fType: UINT32, pusStructIndex: Pointer<UINT16>): BOOLEAN {
  let pStruct: Pointer<LEVELNODE> = NULL;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  return TypeExistsInLevel(pStruct, fType, pusStructIndex);
}

function SetAllStructShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pStruct: Pointer<LEVELNODE> = NULL;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  SetLevelShadeLevel(pStruct, ubShadeLevel);
}

function AdjustAllStructShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pStruct: Pointer<LEVELNODE> = NULL;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  AdjustLevelShadeLevel(pStruct, bShadeDiff);
}

function SetStructIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != NULL) {
    if (pStruct.value.usIndex != NO_TILE) {
      GetTileType(pStruct.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldStruct.value.uiFlags |= uiFlags;
      }
    }
  }
}

function HideStructOfGivenType(iMapIndex: UINT32, fType: UINT32, fHide: BOOLEAN): BOOLEAN {
  if (fHide) {
    SetRoofIndexFlagsFromTypeRange(iMapIndex, fType, fType, LEVELNODE_HIDDEN);
  } else {
    // ONLY UNHIDE IF NOT REAVEALED ALREADY
    if (!(gpWorldLevelData[iMapIndex].uiFlags & MAPELEMENT_REVEALED)) {
      RemoveRoofIndexFlagsFromTypeRange(iMapIndex, fType, fType, LEVELNODE_HIDDEN);
    }
  }
  return TRUE;
}

function RemoveStructIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != NULL) {
    if (pStruct.value.usIndex != NO_TILE) {
      GetTileType(pStruct.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldStruct.value.uiFlags &= (~uiFlags);
      }
    }
  }
}

// Shadow layer
// #################################################################

function AddShadowToTail(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pShadow: Pointer<LEVELNODE> = NULL;
  let pNextShadow: Pointer<LEVELNODE> = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // If we're at the head, set here
  if (pShadow == NULL) {
    CHECKF(CreateLevelNode(addressof(pShadow)) != FALSE);
    pShadow.value.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pShadowHead = pShadow;
  } else {
    while (pShadow != NULL) {
      if (pShadow.value.pNext == NULL) {
        CHECKF(CreateLevelNode(addressof(pNextShadow)) != FALSE);
        pShadow.value.pNext = pNextShadow;
        pNextShadow.value.pNext = NULL;
        pNextShadow.value.usIndex = usIndex;
        break;
      }

      pShadow = pShadow.value.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_SHADOWS);
  return TRUE;
}

// Kris:  identical shadows can exist in the same gridno, though it makes no sense
//		because it actually renders the shadows darker than the others.  This is an
//	  undesirable effect with walls and buildings so I added this function to make
//		sure there isn't already a shadow before placing it.
function AddExclusiveShadow(iMapIndex: UINT32, usIndex: UINT16): void {
  let pShadow: Pointer<LEVELNODE>;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;
  while (pShadow) {
    if (pShadow.value.usIndex == usIndex)
      return;
    pShadow = pShadow.value.pNext;
  }
  AddShadowToHead(iMapIndex, usIndex);
}

function AddShadowToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pShadow: Pointer<LEVELNODE>;
  let pNextShadow: Pointer<LEVELNODE> = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Allocate head
  CHECKF(CreateLevelNode(addressof(pNextShadow)) != FALSE);
  pNextShadow.value.pNext = pShadow;
  pNextShadow.value.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pShadowHead = pNextShadow;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_SHADOWS);
  return TRUE;
}

function RemoveShadow(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pShadow: Pointer<LEVELNODE> = NULL;
  let pOldShadow: Pointer<LEVELNODE> = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != NULL) {
    if (pShadow.value.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow.value.pNext;
      } else {
        pOldShadow.value.pNext = pShadow.value.pNext;
      }

      // Delete memory assosiated with item
      MemFree(pShadow);
      guiLevelNodes--;

      return TRUE;
    }

    pOldShadow = pShadow;
    pShadow = pShadow.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveShadowFromLevelNode(iMapIndex: UINT32, pNode: Pointer<LEVELNODE>): BOOLEAN {
  let pShadow: Pointer<LEVELNODE> = NULL;
  let pOldShadow: Pointer<LEVELNODE> = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != NULL) {
    if (pShadow == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow.value.pNext;
      } else {
        pOldShadow.value.pNext = pShadow.value.pNext;
      }

      // Delete memory assosiated with item
      MemFree(pShadow);
      guiLevelNodes--;

      return TRUE;
    }

    pOldShadow = pShadow;
    pShadow = pShadow.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveStructShadowPartner(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pShadow: Pointer<LEVELNODE> = NULL;
  let pOldShadow: Pointer<LEVELNODE> = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != NULL) {
    if (pShadow.value.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow.value.pNext;
      } else {
        pOldShadow.value.pNext = pShadow.value.pNext;
      }

      // Delete memory assosiated with item
      MemFree(pShadow);
      guiLevelNodes--;

      return TRUE;
    }

    pOldShadow = pShadow;
    pShadow = pShadow.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveAllShadowsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  let pShadow: Pointer<LEVELNODE> = NULL;
  let pOldShadow: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let fRetVal: BOOLEAN = FALSE;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and Search for type

  while (pShadow != NULL) {
    if (pShadow.value.usIndex != NO_TILE) {
      GetTileType(pShadow.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldShadow = pShadow;
      pShadow = pShadow.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveShadow(iMapIndex, pOldShadow.value.usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

function RemoveAllShadows(iMapIndex: UINT32): BOOLEAN {
  let pShadow: Pointer<LEVELNODE> = NULL;
  let pOldShadow: Pointer<LEVELNODE> = NULL;
  let fRetVal: BOOLEAN = FALSE;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and Search for type

  while (pShadow != NULL) {
    if (pShadow.value.usIndex != NO_TILE) {
      // Advance to next
      pOldShadow = pShadow;
      pShadow = pShadow.value.pNext;

      // Remove Item
      RemoveShadow(iMapIndex, pOldShadow.value.usIndex);
      fRetVal = TRUE;
    }
  }
  return fRetVal;
}

function TypeExistsInShadowLayer(iMapIndex: UINT32, fType: UINT32, pusShadowIndex: Pointer<UINT16>): BOOLEAN {
  let pShadow: Pointer<LEVELNODE> = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  return TypeExistsInLevel(pShadow, fType, pusShadowIndex);
}

// Merc layer
// #################################################################

function AddMercToHead(iMapIndex: UINT32, pSoldier: Pointer<SOLDIERTYPE>, fAddStructInfo: BOOLEAN): BOOLEAN {
  let pMerc: Pointer<LEVELNODE> = NULL;
  let pNextMerc: Pointer<LEVELNODE> = NULL;

  pMerc = gpWorldLevelData[iMapIndex].pMercHead;

  // Allocate head
  CHECKF(CreateLevelNode(addressof(pNextMerc)) != FALSE);
  pNextMerc.value.pNext = pMerc;
  pNextMerc.value.pSoldier = pSoldier;
  pNextMerc.value.uiFlags |= LEVELNODE_SOLDIER;

  // Add structure info if we want
  if (fAddStructInfo) {
    // Set soldier's levelnode
    pSoldier.value.pLevelNode = pNextMerc;

    AddMercStructureInfo(iMapIndex, pSoldier);
  }

  // Set head
  gpWorldLevelData[iMapIndex].pMercHead = pNextMerc;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_MERCS | TILES_DYNAMIC_STRUCT_MERCS | TILES_DYNAMIC_HIGHMERCS);
  return TRUE;
}

function AddMercStructureInfo(sGridNo: INT16, pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let usAnimSurface: UINT16;

  // Get surface data
  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  AddMercStructureInfoFromAnimSurface(sGridNo, pSoldier, usAnimSurface, pSoldier.value.usAnimState);

  return TRUE;
}

function AddMercStructureInfoFromAnimSurface(sGridNo: INT16, pSoldier: Pointer<SOLDIERTYPE>, usAnimSurface: UINT16, usAnimState: UINT16): BOOLEAN {
  let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
  let fReturn: BOOLEAN;

  // Turn off multi tile flag...
  pSoldier.value.uiStatusFlags &= (~SOLDIER_MULTITILE);

  if (pSoldier.value.pLevelNode == NULL) {
    return FALSE;
  }

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    return FALSE;
  }

  // Remove existing structs
  DeleteStructureFromWorld(pSoldier.value.pLevelNode.value.pStructureData);
  pSoldier.value.pLevelNode.value.pStructureData = NULL;

  pStructureFileRef = GetAnimationStructureRef(pSoldier.value.ubID, usAnimSurface, usAnimState);

  // Now check if we are multi-tiled!
  if (pStructureFileRef != NULL) {
    if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
      // Queen uses onely one direction....
      fReturn = AddStructureToWorld(sGridNo, pSoldier.value.bLevel, addressof(pStructureFileRef.value.pDBStructureRef[0]), pSoldier.value.pLevelNode);
    } else {
      fReturn = AddStructureToWorld(sGridNo, pSoldier.value.bLevel, addressof(pStructureFileRef.value.pDBStructureRef[gOneCDirection[pSoldier.value.bDirection]]), pSoldier.value.pLevelNode);
    }
    /*
                    if ( fReturn == FALSE )
                    {
                            // try to add default
                            ScreenMsg( MSG_FONT_YELLOW, MSG_DEBUG, L"FAILED: add struct info for merc: %d, at %d direction %d, trying default instead", pSoldier->ubID, sGridNo, pSoldier->bDirection );

                            pStructureFileRef = GetDefaultStructureRef( pSoldier->ubID );
                            if ( pStructureFileRef )
                            {
                                    fReturn = AddStructureToWorld( sGridNo, pSoldier->bLevel, &( pStructureFileRef->pDBStructureRef[ gOneCDirection[ pSoldier->bDirection ] ] ), pSoldier->pLevelNode );
                            }
                    }
                    */

    if (fReturn == FALSE) {
      // Debug msg
      ScreenMsg(MSG_FONT_RED, MSG_DEBUG, "FAILED: add struct info for merc %d (%s), at %d direction %d", pSoldier.value.ubID, pSoldier.value.name, sGridNo, pSoldier.value.bDirection);

      if (pStructureFileRef.value.pDBStructureRef[gOneCDirection[pSoldier.value.bDirection]].pDBStructure.value.ubNumberOfTiles > 1) {
        // If we have more than one tile
        pSoldier.value.uiStatusFlags |= SOLDIER_MULTITILE_Z;
      }

      return FALSE;
    } else {
      // Turn on if we are multi-tiled
      if (pSoldier.value.pLevelNode.value.pStructureData.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles > 1) {
        // If we have more than one tile
        pSoldier.value.uiStatusFlags |= SOLDIER_MULTITILE_Z;
      } else {
        // pSoldier->uiStatusFlags |= SOLDIER_MULTITILE_NZ;
      }
    }
  }

  return TRUE;
}

function OKToAddMercToWorld(pSoldier: Pointer<SOLDIERTYPE>, bDirection: INT8): BOOLEAN {
  let usAnimSurface: UINT16;
  let pStructFileRef: Pointer<STRUCTURE_FILE_REF>;
  let usOKToAddStructID: UINT16;

  // if ( pSoldier->uiStatusFlags & SOLDIER_MULTITILE )
  {
    // Get surface data
    usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);
    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      return FALSE;
    }

    pStructFileRef = GetAnimationStructureRef(pSoldier.value.ubID, usAnimSurface, pSoldier.value.usAnimState);

    // Now check if we have multi-tile info!
    if (pStructFileRef != NULL) {
      // Try adding struct to this location, if we can it's good!
      if (pSoldier.value.pLevelNode && pSoldier.value.pLevelNode.value.pStructureData != NULL) {
        usOKToAddStructID = pSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
      } else {
        usOKToAddStructID = INVALID_STRUCTURE_ID;
      }

      if (!OkayToAddStructureToWorld(pSoldier.value.sGridNo, pSoldier.value.bLevel, addressof(pStructFileRef.value.pDBStructureRef[gOneCDirection[bDirection]]), usOKToAddStructID)) {
        return FALSE;
      }
    }
  }

  return TRUE;
}

function UpdateMercStructureInfo(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // Remove strucute info!
  if (pSoldier.value.pLevelNode == NULL) {
    return FALSE;
  }

  // DeleteStructureFromWorld( pSoldier->pLevelNode->pStructureData );

  // Add new one!
  return AddMercStructureInfo(pSoldier.value.sGridNo, pSoldier);
}

function RemoveMerc(iMapIndex: UINT32, pSoldier: Pointer<SOLDIERTYPE>, fPlaceHolder: BOOLEAN): BOOLEAN {
  let pMerc: Pointer<LEVELNODE> = NULL;
  let pOldMerc: Pointer<LEVELNODE> = NULL;
  let fMercFound: BOOLEAN;

  if (iMapIndex == NOWHERE) {
    return FALSE;
  }

  pMerc = gpWorldLevelData[iMapIndex].pMercHead;

  // Look through all mercs and remove index if found

  while (pMerc != NULL) {
    fMercFound = FALSE;

    if (pMerc.value.pSoldier == pSoldier) {
      // If it's a placeholder, check!
      if (fPlaceHolder) {
        if ((pMerc.value.uiFlags & LEVELNODE_MERCPLACEHOLDER)) {
          fMercFound = TRUE;
        }
      } else {
        if (!(pMerc.value.uiFlags & LEVELNODE_MERCPLACEHOLDER)) {
          fMercFound = TRUE;
        }
      }

      if (fMercFound) {
        // OK, set links
        // Check for head or tail
        if (pOldMerc == NULL) {
          // It's the head
          gpWorldLevelData[iMapIndex].pMercHead = pMerc.value.pNext;
        } else {
          pOldMerc.value.pNext = pMerc.value.pNext;
        }

        if (!fPlaceHolder) {
          // Set level node to NULL
          pSoldier.value.pLevelNode = NULL;

          // Remove strucute info!
          DeleteStructureFromWorld(pMerc.value.pStructureData);
        }

        // Delete memory assosiated with item
        MemFree(pMerc);
        guiLevelNodes--;

        return TRUE;
      }
    }

    pOldMerc = pMerc;
    pMerc = pMerc.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

// Roof layer
// #################################################################

function AddRoofToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  let pRoof: Pointer<LEVELNODE> = NULL;
  let pNextRoof: Pointer<LEVELNODE> = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // If we're at the head, set here
  if (pRoof == NULL) {
    CHECKF(CreateLevelNode(addressof(pRoof)) != FALSE);

    if (usIndex < Enum312.NUMBEROFTILES) {
      if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
        if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pRoof) == FALSE) {
          MemFree(pRoof);
          guiLevelNodes--;
          return FALSE;
        }
      }
    }
    pRoof.value.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pRoofHead = pRoof;

    pNextRoof = pRoof;
  } else {
    while (pRoof != NULL) {
      if (pRoof.value.pNext == NULL) {
        CHECKF(CreateLevelNode(addressof(pNextRoof)) != FALSE);

        if (usIndex < Enum312.NUMBEROFTILES) {
          if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
            if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextRoof) == FALSE) {
              MemFree(pNextRoof);
              guiLevelNodes--;
              return FALSE;
            }
          }
        }
        pRoof.value.pNext = pNextRoof;

        pNextRoof.value.pNext = NULL;
        pNextRoof.value.usIndex = usIndex;

        break;
      }

      pRoof = pRoof.value.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ROOF);

  return pNextRoof;
}

function AddRoofToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pRoof: Pointer<LEVELNODE> = NULL;
  let pNextRoof: Pointer<LEVELNODE> = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  CHECKF(CreateLevelNode(addressof(pNextRoof)) != FALSE);

  if (usIndex < Enum312.NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextRoof) == FALSE) {
        MemFree(pNextRoof);
        guiLevelNodes--;
        return FALSE;
      }
    }
  }

  pNextRoof.value.pNext = pRoof;
  pNextRoof.value.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pRoofHead = pNextRoof;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ROOF);
  return TRUE;
}

function RemoveRoof(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pRoof: Pointer<LEVELNODE> = NULL;
  let pOldRoof: Pointer<LEVELNODE> = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and remove index if found

  while (pRoof != NULL) {
    if (pRoof.value.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldRoof == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pRoofHead = pRoof.value.pNext;
      } else {
        pOldRoof.value.pNext = pRoof.value.pNext;
      }
      // Delete memory assosiated with item
      DeleteStructureFromWorld(pRoof.value.pStructureData);
      MemFree(pRoof);
      guiLevelNodes--;

      return TRUE;
    }

    pOldRoof = pRoof;
    pRoof = pRoof.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeExistsInRoofLayer(iMapIndex: UINT32, fType: UINT32, pusRoofIndex: Pointer<UINT16>): BOOLEAN {
  let pRoof: Pointer<LEVELNODE> = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  return TypeExistsInLevel(pRoof, fType, pusRoofIndex);
}

function TypeRangeExistsInRoofLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusRoofIndex: Pointer<UINT16>): BOOLEAN {
  let pRoof: Pointer<LEVELNODE> = NULL;
  let pOldRoof: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all objects and Search for type

  while (pRoof != NULL) {
    if (pRoof.value.usIndex != NO_TILE) {
      GetTileType(pRoof.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pusRoofIndex.value = pOldRoof.value.usIndex;
        return TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function IndexExistsInRoofLayer(sGridNo: INT16, usIndex: UINT16): BOOLEAN {
  let pRoof: Pointer<LEVELNODE> = NULL;
  let pOldRoof: Pointer<LEVELNODE> = NULL;

  pRoof = gpWorldLevelData[sGridNo].pRoofHead;

  // Look through all objects and Search for type

  while (pRoof != NULL) {
    if (pRoof.value.usIndex == usIndex) {
      return TRUE;
    }

    pRoof = pRoof.value.pNext;
  }

  // Could not find it, return FALSE
  return FALSE;
}

function SetAllRoofShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pRoof: Pointer<LEVELNODE> = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  SetLevelShadeLevel(pRoof, ubShadeLevel);
}

function AdjustAllRoofShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pRoof: Pointer<LEVELNODE> = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  AdjustLevelShadeLevel(pRoof, bShadeDiff);
}

function RemoveAllRoofsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  let pRoof: Pointer<LEVELNODE> = NULL;
  let pOldRoof: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let fRetVal: BOOLEAN = FALSE;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != NULL) {
    if (pRoof.value.usIndex != NO_TILE) {
      GetTileType(pRoof.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveRoof(iMapIndex, pOldRoof.value.usIndex);
        fRetVal = TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return fRetVal;
}

function RemoveRoofIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  let pRoof: Pointer<LEVELNODE> = NULL;
  let pOldRoof: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != NULL) {
    if (pRoof.value.usIndex != NO_TILE) {
      GetTileType(pRoof.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldRoof.value.uiFlags &= (~uiFlags);
      }
    }
  }
}

function SetRoofIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  let pRoof: Pointer<LEVELNODE> = NULL;
  let pOldRoof: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != NULL) {
    if (pRoof.value.usIndex != NO_TILE) {
      GetTileType(pRoof.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldRoof.value.uiFlags |= uiFlags;
      }
    }
  }
}

// OnRoof layer
// #################################################################

function AddOnRoofToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  let pOnRoof: Pointer<LEVELNODE> = NULL;
  let pNextOnRoof: Pointer<LEVELNODE> = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // If we're at the head, set here
  if (pOnRoof == NULL) {
    CHECKF(CreateLevelNode(addressof(pOnRoof)) != FALSE);

    if (usIndex < Enum312.NUMBEROFTILES) {
      if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
        if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pOnRoof) == FALSE) {
          MemFree(pOnRoof);
          guiLevelNodes--;
          return FALSE;
        }
      }
    }
    pOnRoof.value.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof;

    ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
    return pOnRoof;
  } else {
    while (pOnRoof != NULL) {
      if (pOnRoof.value.pNext == NULL) {
        CHECKF(CreateLevelNode(addressof(pNextOnRoof)) != FALSE);

        if (usIndex < Enum312.NUMBEROFTILES) {
          if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
            if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextOnRoof) == FALSE) {
              MemFree(pNextOnRoof);
              guiLevelNodes--;
              return NULL;
            }
          }
        }

        pOnRoof.value.pNext = pNextOnRoof;

        pNextOnRoof.value.pNext = NULL;
        pNextOnRoof.value.usIndex = usIndex;
        break;
      }

      pOnRoof = pOnRoof.value.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
  return pNextOnRoof;
}

function AddOnRoofToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pOnRoof: Pointer<LEVELNODE> = NULL;
  let pNextOnRoof: Pointer<LEVELNODE> = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  CHECKF(CreateLevelNode(addressof(pNextOnRoof)) != FALSE);
  if (usIndex < Enum312.NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextOnRoof) == FALSE) {
        MemFree(pNextOnRoof);
        guiLevelNodes--;
        return FALSE;
      }
    }
  }

  pNextOnRoof.value.pNext = pOnRoof;
  pNextOnRoof.value.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pOnRoofHead = pNextOnRoof;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
  return TRUE;
}

function RemoveOnRoof(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pOnRoof: Pointer<LEVELNODE> = NULL;
  let pOldOnRoof: Pointer<LEVELNODE> = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and remove index if found

  while (pOnRoof != NULL) {
    if (pOnRoof.value.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldOnRoof == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof.value.pNext;
      } else {
        pOldOnRoof.value.pNext = pOnRoof.value.pNext;
      }

      // REMOVE ONROOF!
      MemFree(pOnRoof);
      guiLevelNodes--;

      return TRUE;
    }

    pOldOnRoof = pOnRoof;
    pOnRoof = pOnRoof.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveOnRoofFromLevelNode(iMapIndex: UINT32, pNode: Pointer<LEVELNODE>): BOOLEAN {
  let pOnRoof: Pointer<LEVELNODE> = NULL;
  let pOldOnRoof: Pointer<LEVELNODE> = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and remove index if found

  while (pOnRoof != NULL) {
    if (pOnRoof == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldOnRoof == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof.value.pNext;
      } else {
        pOldOnRoof.value.pNext = pOnRoof.value.pNext;
      }

      // REMOVE ONROOF!
      MemFree(pOnRoof);
      guiLevelNodes--;

      return TRUE;
    }

    pOldOnRoof = pOnRoof;
    pOnRoof = pOnRoof.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeExistsInOnRoofLayer(iMapIndex: UINT32, fType: UINT32, pusOnRoofIndex: Pointer<UINT16>): BOOLEAN {
  let pOnRoof: Pointer<LEVELNODE> = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  return TypeExistsInLevel(pOnRoof, fType, pusOnRoofIndex);
}

function SetAllOnRoofShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pOnRoof: Pointer<LEVELNODE> = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  SetLevelShadeLevel(pOnRoof, ubShadeLevel);
}

function AdjustAllOnRoofShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pOnRoof: Pointer<LEVELNODE> = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  AdjustLevelShadeLevel(pOnRoof, bShadeDiff);
}

function RemoveAllOnRoofsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  let pOnRoof: Pointer<LEVELNODE> = NULL;
  let pOldOnRoof: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let fRetVal: BOOLEAN = FALSE;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and Search for type

  while (pOnRoof != NULL) {
    if (pOnRoof.value.usIndex != NO_TILE) {
      GetTileType(pOnRoof.value.usIndex, addressof(fTileType));

      // Advance to next
      pOldOnRoof = pOnRoof;
      pOnRoof = pOnRoof.value.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveOnRoof(iMapIndex, pOldOnRoof.value.usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

// Topmost layer
// #################################################################

function AddTopmostToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  let pTopmost: Pointer<LEVELNODE> = NULL;
  let pNextTopmost: Pointer<LEVELNODE> = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // If we're at the head, set here
  if (pTopmost == NULL) {
    CHECKN(CreateLevelNode(addressof(pNextTopmost)) != FALSE);
    pNextTopmost.value.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pTopmostHead = pNextTopmost;
  } else {
    while (pTopmost != NULL) {
      if (pTopmost.value.pNext == NULL) {
        CHECKN(CreateLevelNode(addressof(pNextTopmost)) != FALSE);
        pTopmost.value.pNext = pNextTopmost;
        pNextTopmost.value.pNext = NULL;
        pNextTopmost.value.usIndex = usIndex;

        break;
      }

      pTopmost = pTopmost.value.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return pNextTopmost;
}

function AddUIElem(iMapIndex: UINT32, usIndex: UINT16, sRelativeX: INT8, sRelativeY: INT8, ppNewNode: Pointer<Pointer<LEVELNODE>>): BOOLEAN {
  let pTopmost: Pointer<LEVELNODE> = NULL;

  pTopmost = AddTopmostToTail(iMapIndex, usIndex);

  CHECKF(pTopmost != NULL);

  // Set flags
  pTopmost.value.uiFlags |= LEVELNODE_USERELPOS;
  pTopmost.value.sRelativeX = sRelativeX;
  pTopmost.value.sRelativeY = sRelativeY;

  if (ppNewNode != NULL) {
    ppNewNode.value = pTopmost;
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return TRUE;
}

function RemoveUIElem(iMapIndex: UINT32, usIndex: UINT16): void {
  RemoveTopmost(iMapIndex, usIndex);
}

function AddTopmostToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pTopmost: Pointer<LEVELNODE> = NULL;
  let pNextTopmost: Pointer<LEVELNODE> = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Allocate head
  CHECKF(CreateLevelNode(addressof(pNextTopmost)) != FALSE);
  pNextTopmost.value.pNext = pTopmost;
  pNextTopmost.value.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pTopmostHead = pNextTopmost;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return TRUE;
}

function RemoveTopmost(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  let pTopmost: Pointer<LEVELNODE> = NULL;
  let pOldTopmost: Pointer<LEVELNODE> = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and remove index if found

  while (pTopmost != NULL) {
    if (pTopmost.value.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldTopmost == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pTopmostHead = pTopmost.value.pNext;
      } else {
        pOldTopmost.value.pNext = pTopmost.value.pNext;
      }

      // Delete memory assosiated with item
      MemFree(pTopmost);
      guiLevelNodes--;

      return TRUE;
    }

    pOldTopmost = pTopmost;
    pTopmost = pTopmost.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveTopmostFromLevelNode(iMapIndex: UINT32, pNode: Pointer<LEVELNODE>): BOOLEAN {
  let pTopmost: Pointer<LEVELNODE> = NULL;
  let pOldTopmost: Pointer<LEVELNODE> = NULL;
  let usIndex: UINT16;

  usIndex = pNode.value.usIndex;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and remove index if found

  while (pTopmost != NULL) {
    if (pTopmost == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldTopmost == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pTopmostHead = pTopmost.value.pNext;
      } else {
        pOldTopmost.value.pNext = pTopmost.value.pNext;
      }

      // Delete memory assosiated with item
      MemFree(pTopmost);
      guiLevelNodes--;

      return TRUE;
    }

    pOldTopmost = pTopmost;
    pTopmost = pTopmost.value.pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveAllTopmostsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  let pTopmost: Pointer<LEVELNODE> = NULL;
  let pOldTopmost: Pointer<LEVELNODE> = NULL;
  let fTileType: UINT32;
  let fRetVal: BOOLEAN = FALSE;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and Search for type

  while (pTopmost != NULL) {
    // Advance to next
    pOldTopmost = pTopmost;
    pTopmost = pTopmost.value.pNext;

    if (pOldTopmost.value.usIndex != NO_TILE && pOldTopmost.value.usIndex < Enum312.NUMBEROFTILES) {
      GetTileType(pOldTopmost.value.usIndex, addressof(fTileType));

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveTopmost(iMapIndex, pOldTopmost.value.usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

function TypeExistsInTopmostLayer(iMapIndex: UINT32, fType: UINT32, pusTopmostIndex: Pointer<UINT16>): BOOLEAN {
  let pTopmost: Pointer<LEVELNODE> = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  return TypeExistsInLevel(pTopmost, fType, pusTopmostIndex);
}

function SetTopmostFlags(iMapIndex: UINT32, uiFlags: UINT32, usIndex: UINT16): void {
  let pTopmost: Pointer<LEVELNODE> = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  SetIndexLevelNodeFlags(pTopmost, uiFlags, usIndex);
}

function RemoveTopmostFlags(iMapIndex: UINT32, uiFlags: UINT32, usIndex: UINT16): void {
  let pTopmost: Pointer<LEVELNODE> = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  RemoveIndexLevelNodeFlags(pTopmost, uiFlags, usIndex);
}

function SetMapElementShadeLevel(uiMapIndex: UINT32, ubShadeLevel: UINT8): BOOLEAN {
  SetAllLandShadeLevels(uiMapIndex, ubShadeLevel);
  SetAllObjectShadeLevels(uiMapIndex, ubShadeLevel);
  SetAllStructShadeLevels(uiMapIndex, ubShadeLevel);

  return TRUE;
}

function IsHeigherLevel(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_NORMAL_ROOF);

  if (pStructure != NULL) {
    return TRUE;
  }

  return FALSE;
}

function IsLowerLevel(sGridNo: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  pStructure = FindStructure(sGridNo, STRUCTURE_NORMAL_ROOF);

  if (pStructure == NULL) {
    return TRUE;
  }

  return FALSE;
}

function IsRoofVisible(sMapPos: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  if (!gfBasement) {
    pStructure = FindStructure(sMapPos, STRUCTURE_ROOF);

    if (pStructure != NULL) {
      if (!(gpWorldLevelData[sMapPos].uiFlags & MAPELEMENT_REVEALED)) {
        return TRUE;
      }
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

function IsRoofVisible2(sMapPos: INT16): BOOLEAN {
  let pStructure: Pointer<STRUCTURE>;

  if (!gfBasement) {
    pStructure = FindStructure(sMapPos, STRUCTURE_ROOF);

    if (pStructure != NULL) {
      if (!(gpWorldLevelData[sMapPos].uiFlags & MAPELEMENT_REVEALED)) {
        return TRUE;
      }
    }
  } else {
    // if ( InARoom( sMapPos, &ubRoom ) )
    {
      if (!(gpWorldLevelData[sMapPos].uiFlags & MAPELEMENT_REVEALED)) {
        return TRUE;
      }
    }
  }

  return FALSE;
}

function WhoIsThere2(sGridNo: INT16, bLevel: INT8): UINT8 {
  let pStructure: Pointer<STRUCTURE>;

  if (!GridNoOnVisibleWorldTile(sGridNo)) {
    return NOBODY;
  }

  if (gpWorldLevelData[sGridNo].pStructureHead != NULL) {
    pStructure = gpWorldLevelData[sGridNo].pStructureHead;

    while (pStructure) {
      // person must either have their pSoldier->sGridNo here or be non-passable
      if ((pStructure.value.fFlags & STRUCTURE_PERSON) && (!(pStructure.value.fFlags & STRUCTURE_PASSABLE) || MercPtrs[pStructure.value.usStructureID].value.sGridNo == sGridNo)) {
        if ((bLevel == 0 && pStructure.value.sCubeOffset == 0) || (bLevel > 0 && pStructure.value.sCubeOffset > 0)) {
          // found a person, on the right level!
          // structure ID and merc ID are identical for merc structures
          return pStructure.value.usStructureID;
        }
      }
      pStructure = pStructure.value.pNext;
    }
  }

  return NOBODY;
}

function GetTerrainType(sGridNo: INT16): UINT8 {
  return gpWorldLevelData[sGridNo].ubTerrainID;
  /*
          LEVELNODE	*pNode;


          // Check if we have anything in object layer which has a terrain modifier
          pNode = gpWorldLevelData[ sGridNo ].pObjectHead;

          if ( pNode != NULL )
          {
                  if ( gTileDatabase[ pNode->usIndex ].ubTerrainID != NO_TERRAIN )
                  {
                          return( gTileDatabase[ pNode->usIndex ].ubTerrainID );
                  }
          }

          // Now try terrain!
          pNode = gpWorldLevelData[ sGridNo ].pLandHead;

          return( gTileDatabase[ pNode->usIndex ].ubTerrainID );
  */
}

function Water(sGridNo: INT16): BOOLEAN {
  let pMapElement: Pointer<MAP_ELEMENT>;

  if (sGridNo == NOWHERE) {
    return FALSE;
  }

  pMapElement = addressof(gpWorldLevelData[sGridNo]);
  if (pMapElement.value.ubTerrainID == Enum315.LOW_WATER || pMapElement.value.ubTerrainID == Enum315.MED_WATER || pMapElement.value.ubTerrainID == Enum315.DEEP_WATER) {
    // check for a bridge!  otherwise...
    return TRUE;
  } else {
    return FALSE;
  }
}

function DeepWater(sGridNo: INT16): BOOLEAN {
  let pMapElement: Pointer<MAP_ELEMENT>;

  pMapElement = addressof(gpWorldLevelData[sGridNo]);
  if (pMapElement.value.ubTerrainID == Enum315.DEEP_WATER) {
    // check for a bridge!  otherwise...
    return TRUE;
  } else {
    return FALSE;
  }
}

function WaterTooDeepForAttacks(sGridNo: INT16): BOOLEAN {
  return DeepWater(sGridNo);
}

function SetStructAframeFlags(iMapIndex: UINT32, uiFlags: UINT32): void {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;
  let uiTileFlags: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type
  while (pStruct != NULL) {
    if (pStruct.value.usIndex != NO_TILE) {
      GetTileFlags(pStruct.value.usIndex, addressof(uiTileFlags));

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;

      if (uiTileFlags & AFRAME_TILE) {
        pOldStruct.value.uiFlags |= uiFlags;
      }
    }
  }
}

function RemoveStructAframeFlags(iMapIndex: UINT32, uiFlags: UINT32): void {
  let pStruct: Pointer<LEVELNODE> = NULL;
  let pOldStruct: Pointer<LEVELNODE> = NULL;
  let uiTileFlags: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type
  while (pStruct != NULL) {
    if (pStruct.value.usIndex != NO_TILE) {
      GetTileFlags(pStruct.value.usIndex, addressof(uiTileFlags));

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.value.pNext;

      if (uiTileFlags & AFRAME_TILE) {
        pOldStruct.value.uiFlags &= (~uiFlags);
      }
    }
  }
}

function FindLevelNodeBasedOnStructure(sGridNo: INT16, pStructure: Pointer<STRUCTURE>): Pointer<LEVELNODE> {
  let pLevelNode: Pointer<LEVELNODE>;

  // ATE: First look on the struct layer.....
  pLevelNode = gpWorldLevelData[sGridNo].pStructHead;
  while (pLevelNode != NULL) {
    if (pLevelNode.value.pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode.value.pNext;
  }

  // Next the roof layer....
  pLevelNode = gpWorldLevelData[sGridNo].pRoofHead;
  while (pLevelNode != NULL) {
    if (pLevelNode.value.pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode.value.pNext;
  }

  // Then the object layer....
  pLevelNode = gpWorldLevelData[sGridNo].pObjectHead;
  while (pLevelNode != NULL) {
    if (pLevelNode.value.pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode.value.pNext;
  }

  // Finally the onroof layer....
  pLevelNode = gpWorldLevelData[sGridNo].pOnRoofHead;
  while (pLevelNode != NULL) {
    if (pLevelNode.value.pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode.value.pNext;
  }

  // Assert here if it cannot be found....
  AssertMsg(0, "FindLevelNodeBasedOnStruct failed.");

  return NULL;
}

function FindShadow(sGridNo: INT16, usStructIndex: UINT16): Pointer<LEVELNODE> {
  let pLevelNode: Pointer<LEVELNODE>;
  let usShadowIndex: UINT16;

  if (usStructIndex < Enum312.FIRSTOSTRUCT1 || usStructIndex >= Enum312.FIRSTSHADOW1) {
    return NULL;
  }

  usShadowIndex = usStructIndex - Enum312.FIRSTOSTRUCT1 + Enum312.FIRSTSHADOW1;

  pLevelNode = gpWorldLevelData[sGridNo].pShadowHead;
  while (pLevelNode != NULL) {
    if (pLevelNode.value.usIndex == usShadowIndex) {
      break;
    }
    pLevelNode = pLevelNode.value.pNext;
  }
  return pLevelNode;
}

function WorldHideTrees(): void {
  let pNode: Pointer<LEVELNODE>;
  let fRerender: BOOLEAN = FALSE;
  let fTileFlags: UINT32;
  let cnt: UINT32;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pNode = gpWorldLevelData[cnt].pStructHead;
    while (pNode != NULL) {
      GetTileFlags(pNode.value.usIndex, addressof(fTileFlags));

      if (fTileFlags & FULL3D_TILE) {
        if (!(pNode.value.uiFlags & LEVELNODE_REVEALTREES)) {
          pNode.value.uiFlags |= (LEVELNODE_REVEALTREES);
        }

        fRerender = TRUE;
      }
      pNode = pNode.value.pNext;
    }
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

function WorldShowTrees(): void {
  let pNode: Pointer<LEVELNODE>;
  let fRerender: BOOLEAN = FALSE;
  let fTileFlags: UINT32;
  let cnt: UINT32;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pNode = gpWorldLevelData[cnt].pStructHead;
    while (pNode != NULL) {
      GetTileFlags(pNode.value.usIndex, addressof(fTileFlags));

      if (fTileFlags & FULL3D_TILE) {
        if ((pNode.value.uiFlags & LEVELNODE_REVEALTREES)) {
          pNode.value.uiFlags &= (~(LEVELNODE_REVEALTREES));
        }

        fRerender = TRUE;
      }
      pNode = pNode.value.pNext;
    }
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

function SetWorldFlagsFromNewNode(sGridNo: UINT16, usIndex: UINT16): void {
}

function RemoveWorldFlagsFromNewNode(sGridNo: UINT16, usIndex: UINT16): void {
}

function SetWallLevelnodeFlags(sGridNo: UINT16, uiFlags: UINT32): void {
  let pStruct: Pointer<LEVELNODE> = NULL;

  pStruct = gpWorldLevelData[sGridNo].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != NULL) {
    if (pStruct.value.pStructureData != NULL) {
      // See if we are a wall!
      if (pStruct.value.pStructureData.value.fFlags & STRUCTURE_WALLSTUFF) {
        pStruct.value.uiFlags |= uiFlags;
      }
    }
    // Advance to next
    pStruct = pStruct.value.pNext;
  }
}

function RemoveWallLevelnodeFlags(sGridNo: UINT16, uiFlags: UINT32): void {
  let pStruct: Pointer<LEVELNODE> = NULL;

  pStruct = gpWorldLevelData[sGridNo].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != NULL) {
    if (pStruct.value.pStructureData != NULL) {
      // See if we are a wall!
      if (pStruct.value.pStructureData.value.fFlags & STRUCTURE_WALLSTUFF) {
        pStruct.value.uiFlags &= (~uiFlags);
      }
    }
    // Advance to next
    pStruct = pStruct.value.pNext;
  }
}

function SetTreeTopStateForMap(): void {
  if (!gGameSettings.fOptions[Enum8.TOPTION_TOGGLE_TREE_TOPS]) {
    WorldHideTrees();
    gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;
  } else {
    WorldShowTrees();
    gTacticalStatus.uiFlags &= (~NOHIDE_REDUNDENCY);
  }

  // FOR THE NEXT RENDER LOOP, RE-EVALUATE REDUNDENT TILES
  InvalidateWorldRedundency();
}
