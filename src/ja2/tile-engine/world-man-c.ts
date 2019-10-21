extern BOOLEAN gfBasement;

UINT32 guiLNCount[9];
static CHAR16 gzLevelString[9][15] = {
  L"",
  L"Land    %d",
  L"Object  %d",
  L"Struct  %d",
  L"Shadow  %d",
  L"Merc    %d",
  L"Roof    %d",
  L"Onroof  %d",
  L"Topmost %d",
};

UINT32 guiLevelNodes = 0;

// LEVEL NODE MANIPLULATION FUNCTIONS
function CreateLevelNode(ppNode: Pointer<Pointer<LEVELNODE>>): BOOLEAN {
  *ppNode = MemAlloc(sizeof(LEVELNODE));
  CHECKF(*ppNode != NULL);

  // Clear all values
  memset(*ppNode, 0, sizeof(LEVELNODE));

  // Set default values
  (*ppNode)->ubShadeLevel = LightGetAmbient();
  (*ppNode)->ubNaturalShadeLevel = LightGetAmbient();
  (*ppNode)->pSoldier = NULL;
  (*ppNode)->pNext = NULL;
  (*ppNode)->sRelativeX = 0;
  (*ppNode)->sRelativeY = 0;

  guiLevelNodes++;

  return TRUE;
}

function CountLevelNodes(): void {
  UINT32 uiLoop, uiLoop2;
  LEVELNODE *pLN;
  MAP_ELEMENT *pME;

  for (uiLoop2 = 0; uiLoop2 < 9; uiLoop2++) {
    guiLNCount[uiLoop2] = 0;
  }

  for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
    pME = &(gpWorldLevelData[uiLoop]);
    // start at 1 to skip land head ptr; 0 stores total
    for (uiLoop2 = 1; uiLoop2 < 9; uiLoop2++) {
      pLN = pME->pLevelNodes[uiLoop2];
      while (pLN != NULL) {
        guiLNCount[uiLoop2]++;
        guiLNCount[0]++;
        pLN = pLN->pNext;
      }
    }
  }
}

const LINE_HEIGHT = 20;
function DebugLevelNodePage(): void {
  UINT32 uiLoop;

  SetFont(LARGEFONT1);
  gprintf(0, 0, L"DEBUG LEVELNODES PAGE 1 OF 1");

  for (uiLoop = 1; uiLoop < 9; uiLoop++) {
    gprintf(0, LINE_HEIGHT * (uiLoop + 1), gzLevelString[uiLoop], guiLNCount[uiLoop]);
  }
  gprintf(0, LINE_HEIGHT * 12, L"%d land nodes in excess of world max (25600)", guiLNCount[1] - WORLD_MAX);
  gprintf(0, LINE_HEIGHT * 13, L"Total # levelnodes %d, %d bytes each", guiLNCount[0], sizeof(LEVELNODE));
  gprintf(0, LINE_HEIGHT * 14, L"Total memory for levelnodes %d", guiLNCount[0] * sizeof(LEVELNODE));
}

function TypeExistsInLevel(pStartNode: Pointer<LEVELNODE>, fType: UINT32, pusIndex: Pointer<UINT16>): BOOLEAN {
  UINT32 fTileType;

  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    if (pStartNode->usIndex != NO_TILE && pStartNode->usIndex < NUMBEROFTILES) {
      GetTileType(pStartNode->usIndex, &fTileType);

      if (fTileType == fType) {
        *pusIndex = pStartNode->usIndex;
        return TRUE;
      }
    }

    pStartNode = pStartNode->pNext;
  }

  // Could not find it, return FALSE
  return FALSE;
}

// SHADE LEVEL MANIPULATION FOR NODES
function SetLevelShadeLevel(pStartNode: Pointer<LEVELNODE>, ubShadeLevel: UINT8): void {
  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    pStartNode->ubShadeLevel = ubShadeLevel;

    // Advance to next
    pStartNode = pStartNode->pNext;
  }
}

function AdjustLevelShadeLevel(pStartNode: Pointer<LEVELNODE>, bShadeDiff: INT8): void {
  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    pStartNode->ubShadeLevel += bShadeDiff;

    if (pStartNode->ubShadeLevel > MAX_SHADE_LEVEL) {
      pStartNode->ubShadeLevel = MAX_SHADE_LEVEL;
    }

    if (pStartNode->ubShadeLevel < MIN_SHADE_LEVEL) {
      pStartNode->ubShadeLevel = MIN_SHADE_LEVEL;
    }

    // Advance to next
    pStartNode = pStartNode->pNext;
  }
}

function SetIndexLevelNodeFlags(pStartNode: Pointer<LEVELNODE>, uiFlags: UINT32, usIndex: UINT16): void {
  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    if (pStartNode->usIndex == usIndex) {
      pStartNode->uiFlags |= uiFlags;
      break;
    }

    // Advance to next
    pStartNode = pStartNode->pNext;
  }
}

function RemoveIndexLevelNodeFlags(pStartNode: Pointer<LEVELNODE>, uiFlags: UINT32, usIndex: UINT16): void {
  // Look through all objects and Search for type
  while (pStartNode != NULL) {
    if (pStartNode->usIndex == usIndex) {
      pStartNode->uiFlags &= (~uiFlags);
      break;
    }

    // Advance to next
    pStartNode = pStartNode->pNext;
  }
}

// First for object layer
// #################################################################

function AddObjectToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  LEVELNODE *pObject = NULL;
  LEVELNODE *pNextObject = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // If we're at the head, set here
  if (pObject == NULL) {
    CHECKF(CreateLevelNode(&pNextObject) != FALSE);
    pNextObject->usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pObjectHead = pNextObject;
  } else {
    while (pObject != NULL) {
      if (pObject->pNext == NULL) {
        CHECKF(CreateLevelNode(&pNextObject) != FALSE);
        pObject->pNext = pNextObject;

        pNextObject->pNext = NULL;
        pNextObject->usIndex = usIndex;

        break;
      }

      pObject = pObject->pNext;
    }
  }

  // CheckForAndAddTileCacheStructInfo( pNextObject, (INT16)iMapIndex, usIndex );

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_OBJECTS);
  return pNextObject;
}

function AddObjectToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pObject = NULL;
  LEVELNODE *pNextObject = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  CHECKF(CreateLevelNode(&pNextObject) != FALSE);

  pNextObject->pNext = pObject;
  pNextObject->usIndex = usIndex;

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
  LEVELNODE *pObject = NULL;
  LEVELNODE *pOldObject = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and remove index if found

  while (pObject != NULL) {
    if (pObject->usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldObject == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pObjectHead = pObject->pNext;
      } else {
        pOldObject->pNext = pObject->pNext;
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
    pObject = pObject->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeRangeExistsInObjectLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusObjectIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pObject = NULL;
  LEVELNODE *pOldObject = NULL;
  UINT32 fTileType;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and Search for type

  while (pObject != NULL) {
    // Advance to next
    pOldObject = pObject;
    pObject = pObject->pNext;

    if (pOldObject->usIndex != NO_TILE && pOldObject->usIndex < NUMBEROFTILES) {
      GetTileType(pOldObject->usIndex, &fTileType);

      if (fTileType >= fStartType && fTileType <= fEndType) {
        *pusObjectIndex = pOldObject->usIndex;
        return TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeExistsInObjectLayer(iMapIndex: UINT32, fType: UINT32, pusObjectIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pObject = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  return TypeExistsInLevel(pObject, fType, pusObjectIndex);
}

function SetAllObjectShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  LEVELNODE *pObject = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  SetLevelShadeLevel(pObject, ubShadeLevel);
}

function AdjustAllObjectShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  LEVELNODE *pObject = NULL;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  AdjustLevelShadeLevel(pObject, bShadeDiff);
}

function RemoveAllObjectsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  LEVELNODE *pObject = NULL;
  LEVELNODE *pOldObject = NULL;
  UINT32 fTileType;
  BOOLEAN fRetVal = FALSE;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and Search for type

  while (pObject != NULL) {
    // Advance to next
    pOldObject = pObject;
    pObject = pObject->pNext;

    if (pOldObject->usIndex != NO_TILE && pOldObject->usIndex < NUMBEROFTILES) {
      GetTileType(pOldObject->usIndex, &fTileType);

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveObject(iMapIndex, pOldObject->usIndex);
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
  LEVELNODE *pLand = NULL;
  LEVELNODE *pNextLand = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // If we're at the head, set here
  if (pLand == NULL) {
    CHECKF(CreateLevelNode(&pNextLand) != FALSE);
    pNextLand->usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pLandHead = pNextLand;
  } else {
    while (pLand != NULL) {
      if (pLand->pNext == NULL) {
        CHECKF(CreateLevelNode(&pNextLand) != FALSE);
        pLand->pNext = pNextLand;

        pNextLand->pNext = NULL;
        pNextLand->pPrevNode = pLand;
        pNextLand->usIndex = usIndex;

        break;
      }

      pLand = pLand->pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return pNextLand;
}

function AddLandToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pNextLand = NULL;
  TILE_ELEMENT TileElem;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Allocate head
  CHECKF(CreateLevelNode(&pNextLand) != FALSE);

  pNextLand->pNext = pLand;
  pNextLand->pPrevNode = NULL;
  pNextLand->usIndex = usIndex;
  pNextLand->ubShadeLevel = LightGetAmbient();

  if (usIndex < NUMBEROFTILES) {
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
    pLand->pPrevNode = pNextLand;
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
  LEVELNODE *pLand = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != NULL) {
    if (pLand->usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pLand->pPrevNode == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pLandHead = pLand->pNext;
      } else {
        pLand->pPrevNode->pNext = pLand->pNext;
      }

      // Check for tail
      if (pLand->pNext == NULL) {
      } else {
        pLand->pNext->pPrevNode = pLand->pPrevNode;
      }

      // Delete memory assosiated with item
      MemFree(pLand);
      guiLevelNodes--;

      break;
    }
    pLand = pLand->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function AdjustForFullTile(iMapIndex: UINT32): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pOldLand = NULL;
  TILE_ELEMENT TileElem;
  //	UINT32 iType;
  //	UINT16 iNewIndex;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != NULL) {
    if (pLand->usIndex < NUMBEROFTILES) {
      // If this is a full tile, set new full tile
      TileElem = gTileDatabase[pLand->usIndex];

      // Check for full tile
      if (TileElem.ubFullTile) {
        gpWorldLevelData[iMapIndex].pLandStart = pLand;
        return TRUE;
      }
    }
    pOldLand = pLand;
    pLand = pLand->pNext;
  }

  // Could not find a full tile
  // Set to tail, and convert it to a full tile!
  // Add a land peice to tail from basic land
  {
    UINT16 NewIndex;
    LEVELNODE *pNewNode;

    NewIndex = (UINT16)(Random(10));

    // Adjust for type
    NewIndex += gTileTypeStartIndex[gCurrentBackground];

    pNewNode = AddLandToTail(iMapIndex, NewIndex);

    gpWorldLevelData[iMapIndex].pLandStart = pNewNode;
  }

  return FALSE;
}

function ReplaceLandIndex(iMapIndex: UINT32, usOldIndex: UINT16, usNewIndex: UINT16): BOOLEAN {
  LEVELNODE *pLand = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != NULL) {
    if (pLand->usIndex == usOldIndex) {
      // OK, set new index value
      pLand->usIndex = usNewIndex;

      AdjustForFullTile(iMapIndex);

      return TRUE;
    }

    // Advance
    pLand = pLand->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeExistsInLandLayer(iMapIndex: UINT32, fType: UINT32, pusLandIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pLand = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  return TypeExistsInLevel(pLand, fType, pusLandIndex);
}

function TypeRangeExistsInLandLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusLandIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pOldLand = NULL;
  UINT32 fTileType;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != NULL) {
    if (pLand->usIndex != NO_TILE) {
      GetTileType(pLand->usIndex, &fTileType);

      // Advance to next
      pOldLand = pLand;
      pLand = pLand->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        *pusLandIndex = pOldLand->usIndex;
        return TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeRangeExistsInLandHead(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusLandIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pOldLand = NULL;
  UINT32 fTileType;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  if (pLand->usIndex != NO_TILE) {
    GetTileType(pLand->usIndex, &fTileType);

    // Advance to next
    pOldLand = pLand;
    pLand = pLand->pNext;

    if (fTileType >= fStartType && fTileType <= fEndType) {
      *pusLandIndex = pOldLand->usIndex;
      return TRUE;
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeRangeExistsInStructLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusStructIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pOldStruct = NULL;
  UINT32 fTileType;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != NULL) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileType(pStruct->usIndex, &fTileType);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        *pusStructIndex = pOldStruct->usIndex;
        return TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveAllLandsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pOldLand = NULL;
  UINT32 fTileType;
  BOOLEAN fRetVal = FALSE;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != NULL) {
    if (pLand->usIndex != NO_TILE) {
      GetTileType(pLand->usIndex, &fTileType);

      // Advance to next
      pOldLand = pLand;
      pLand = pLand->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveLand(iMapIndex, pOldLand->usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

function SetAllLandShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  LEVELNODE *pLand = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  SetLevelShadeLevel(pLand, ubShadeLevel);
}

function AdjustAllLandShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  LEVELNODE *pLand = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type
  AdjustLevelShadeLevel(pLand, bShadeDiff);
}

function DeleteAllLandLayers(iMapIndex: UINT32): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pOldLand = NULL;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != NULL) {
    // Advance to next
    pOldLand = pLand;
    pLand = pLand->pNext;

    // Remove Item
    RemoveLandEx(iMapIndex, pOldLand->usIndex);
  }

  // Set world data values
  gpWorldLevelData[iMapIndex].pLandHead = NULL;
  gpWorldLevelData[iMapIndex].pLandStart = NULL;

  return TRUE;
}

function InsertLandIndexAtLevel(iMapIndex: UINT32, usIndex: UINT16, ubLevel: UINT8): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pNextLand = NULL;
  UINT8 level = 0;
  BOOLEAN CanInsert = FALSE;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // If we want to insert at head;
  if (ubLevel == 0) {
    AddLandToHead(iMapIndex, usIndex);
    return TRUE;
  }

  // Allocate memory for new item
  CHECKF(CreateLevelNode(&pNextLand) != FALSE);
  pNextLand->usIndex = usIndex;

  // Move to index before insertion
  while (pLand != NULL) {
    if (level == (ubLevel - 1)) {
      CanInsert = TRUE;
      break;
    }

    pLand = pLand->pNext;
    level++;
  }

  // Check if level has been macthed
  if (!CanInsert) {
    return FALSE;
  }

  // Set links, according to position!
  pNextLand->pPrevNode = pLand;
  pNextLand->pNext = pLand->pNext;
  pLand->pNext = pNextLand;

  // Check for tail
  if (pNextLand->pNext == NULL) {
  } else {
    pNextLand->pNext->pPrevNode = pNextLand;
  }

  AdjustForFullTile(iMapIndex);

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return TRUE;
}

function RemoveHigherLandLevels(iMapIndex: UINT32, fSrcType: UINT32, puiHigherTypes: Pointer<Pointer<UINT32>>, pubNumHigherTypes: Pointer<UINT8>): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pOldLand = NULL;
  UINT32 fTileType;
  UINT8 ubSrcLogHeight;

  *pubNumHigherTypes = 0;
  *puiHigherTypes = NULL;

  // Start at tail and up
  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // GEt tail
  while (pLand != NULL) {
    pOldLand = pLand;
    pLand = pLand->pNext;
  }

  pLand = pOldLand;

  // Get src height
  GetTileTypeLogicalHeight(fSrcType, &ubSrcLogHeight);

  // Look through all objects and Search for height
  while (pLand != NULL) {
    GetTileType(pLand->usIndex, &fTileType);

    // Advance to next
    pOldLand = pLand;
    pLand = pLand->pPrevNode;

    if (gTileTypeLogicalHeight[fTileType] > ubSrcLogHeight) {
      // Remove Item
      SetLandIndex(iMapIndex, pOldLand->usIndex, fTileType, TRUE);

      (*pubNumHigherTypes)++;

      *puiHigherTypes = MemRealloc(*puiHigherTypes, (*pubNumHigherTypes) * sizeof(UINT32));

      (*puiHigherTypes)[(*pubNumHigherTypes) - 1] = fTileType;
    }
  }

  // Adjust full tile sets
  AdjustForFullTile(iMapIndex);

  return TRUE;
}

function SetLowerLandLevels(iMapIndex: UINT32, fSrcType: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pLand = NULL;
  LEVELNODE *pOldLand = NULL;
  UINT32 fTileType;
  UINT8 ubSrcLogHeight;
  UINT16 NewTile;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Get src height
  GetTileTypeLogicalHeight(fSrcType, &ubSrcLogHeight);

  // Look through all objects and Search for height
  while (pLand != NULL) {
    GetTileType(pLand->usIndex, &fTileType);

    // Advance to next
    pOldLand = pLand;
    pLand = pLand->pNext;

    if (gTileTypeLogicalHeight[fTileType] < ubSrcLogHeight) {
      // Set item
      GetTileIndexFromTypeSubIndex(fTileType, usIndex, &NewTile);

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
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pTailStruct = NULL;
  LEVELNODE *pNextStruct = NULL;
  DB_STRUCTURE *pDBStructure;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Do we have an empty list?
  if (pStruct == NULL) {
    CHECKF(CreateLevelNode(&pNextStruct) != FALSE);

    if (fAddStructDBInfo) {
      if (usIndex < NUMBEROFTILES) {
        if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
          if (AddStructureToWorld((INT16)iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == FALSE) {
            MemFree(pNextStruct);
            guiLevelNodes--;
            return NULL;
          }
        } else {
          //				 pNextStruct->pStructureData = NULL;
        }
      }
    }

    pNextStruct->usIndex = usIndex;

    pNextStruct->pNext = NULL;

    gpWorldLevelData[iMapIndex].pStructHead = pNextStruct;
  } else {
    // MOVE TO TAIL
    while (pStruct != NULL) {
      pTailStruct = pStruct;
      pStruct = pStruct->pNext;
    }

    CHECKN(CreateLevelNode(&pNextStruct) != FALSE);

    if (fAddStructDBInfo) {
      if (usIndex < NUMBEROFTILES) {
        if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
          if (AddStructureToWorld((INT16)iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == FALSE) {
            MemFree(pNextStruct);
            guiLevelNodes--;
            return NULL;
          } else {
            //					pNextStruct->pStructureData = NULL;
          }
        }
      }
    }
    pNextStruct->usIndex = usIndex;

    pNextStruct->pNext = NULL;
    pTailStruct->pNext = pNextStruct;
  }

  // Check flags for tiledat and set a shadow if we have a buddy
  if (usIndex < NUMBEROFTILES) {
    if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
      AddShadowToHead(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
      gpWorldLevelData[iMapIndex].pShadowHead->uiFlags |= LEVELNODE_BUDDYSHADOW;
    }

    // Check for special flag to stop burn-through on same-tile structs...
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      pDBStructure = gTileDatabase[usIndex].pDBStructureRef->pDBStructure;

      // Default to off....
      gpWorldLevelData[iMapIndex].ubExtFlags[0] &= (~MAPELEMENT_EXT_NOBURN_STRUCT);

      // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
      if (!FindStructure((INT16)iMapIndex, STRUCTURE_WALLSTUFF) && pDBStructure->ubNumberOfTiles == 1) {
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
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pNextStruct = NULL;
  DB_STRUCTURE *pDBStructure;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  CHECKF(CreateLevelNode(&pNextStruct) != FALSE);

  if (usIndex < NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      if (AddStructureToWorld((INT16)iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == FALSE) {
        MemFree(pNextStruct);
        guiLevelNodes--;
        return FALSE;
      }
    }
  }

  pNextStruct->pNext = pStruct;
  pNextStruct->usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pStructHead = pNextStruct;

  SetWorldFlagsFromNewNode((UINT16)iMapIndex, pNextStruct->usIndex);

  if (usIndex < NUMBEROFTILES) {
    // Check flags for tiledat and set a shadow if we have a buddy
    if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
      AddShadowToHead(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
      gpWorldLevelData[iMapIndex].pShadowHead->uiFlags |= LEVELNODE_BUDDYSHADOW;
    }

    // Check for special flag to stop burn-through on same-tile structs...
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      pDBStructure = gTileDatabase[usIndex].pDBStructureRef->pDBStructure;

      // Default to off....
      gpWorldLevelData[iMapIndex].ubExtFlags[0] &= (~MAPELEMENT_EXT_NOBURN_STRUCT);

      // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
      if (!!FindStructure((INT16)iMapIndex, STRUCTURE_WALLSTUFF) && pDBStructure->ubNumberOfTiles == 1) {
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
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pNextStruct = NULL;
  UINT8 level = 0;
  BOOLEAN CanInsert = FALSE;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // If we want to insert at head;
  if (ubLevel == 0) {
    return AddStructToHead(iMapIndex, usIndex);
  }

  // Allocate memory for new item
  CHECKF(CreateLevelNode(&pNextStruct) != FALSE);

  pNextStruct->usIndex = usIndex;

  // Move to index before insertion
  while (pStruct != NULL) {
    if (level == (ubLevel - 1)) {
      CanInsert = TRUE;
      break;
    }

    pStruct = pStruct->pNext;
    level++;
  }

  // Check if level has been macthed
  if (!CanInsert) {
    MemFree(pNextStruct);
    guiLevelNodes--;
    return FALSE;
  }

  if (usIndex < NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      if (AddStructureToWorld((INT16)iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == FALSE) {
        MemFree(pNextStruct);
        guiLevelNodes--;
        return FALSE;
      }
    }
  }

  // Set links, according to position!
  pNextStruct->pNext = pStruct->pNext;
  pStruct->pNext = pNextStruct;

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
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pPrevStruct = NULL;
  UINT16 usIndex;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // GOTO TAIL
  while (pStruct != NULL) {
    // AT THE TAIL
    if (pStruct->pNext == NULL) {
      if (pPrevStruct != NULL) {
        pPrevStruct->pNext = pStruct->pNext;
      } else
        gpWorldLevelData[iMapIndex].pStructHead = pPrevStruct;

      if (fRemoveStructDBInfo) {
        // Check for special flag to stop burn-through on same-tile structs...
        if (pStruct->pStructureData != NULL) {
          // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
          // if ( !( pStruct->pStructureData->fFlags & STRUCTURE_WALLSTUFF ) && pStruct->pStructureData->pDBStructureRef->pDBStructure->ubNumberOfTiles == 1 )
          //{
          // UNSet flag...
          //	gpWorldLevelData[ iMapIndex ].ubExtFlags[0] &= ( ~MAPELEMENT_EXT_NOBURN_STRUCT );
          //}
        }

        DeleteStructureFromWorld(pStruct->pStructureData);
      }

      usIndex = pStruct->usIndex;

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      MemFree(pStruct);
      guiLevelNodes--;

      if (usIndex < NUMBEROFTILES) {
        // Check flags for tiledat and set a shadow if we have a buddy
        if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
          RemoveShadow(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
        }
      }
      return TRUE;
    }

    pPrevStruct = pStruct;
    pStruct = pStruct->pNext;
  }

  return TRUE;
}

function RemoveStruct(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pOldStruct = NULL;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and remove index if found

  while (pStruct != NULL) {
    if (pStruct->usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldStruct == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pStructHead = pStruct->pNext;
      } else {
        pOldStruct->pNext = pStruct->pNext;
      }

      // Check for special flag to stop burn-through on same-tile structs...
      if (pStruct->pStructureData != NULL) {
        // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
        // if ( !( pStruct->pStructureData->fFlags & STRUCTURE_WALLSTUFF ) && pStruct->pStructureData->pDBStructureRef->pDBStructure->ubNumberOfTiles == 1 )
        //{
        // UNSet flag...
        //	gpWorldLevelData[ iMapIndex ].ubExtFlags[0] &= ( ~MAPELEMENT_EXT_NOBURN_STRUCT );
        //}
      }

      // Delete memory assosiated with item
      DeleteStructureFromWorld(pStruct->pStructureData);

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      if (usIndex < NUMBEROFTILES) {
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
    pStruct = pStruct->pNext;
  }

  // Could not find it, return FALSE
  RemoveWorldFlagsFromNewNode((UINT16)iMapIndex, usIndex);

  return FALSE;
}

function RemoveStructFromLevelNode(iMapIndex: UINT32, pNode: Pointer<LEVELNODE>): BOOLEAN {
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pOldStruct = NULL;
  UINT16 usIndex;

  usIndex = pNode->usIndex;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and remove index if found

  while (pStruct != NULL) {
    if (pStruct == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldStruct == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pStructHead = pStruct->pNext;
      } else {
        pOldStruct->pNext = pStruct->pNext;
      }

      // Delete memory assosiated with item
      DeleteStructureFromWorld(pStruct->pStructureData);

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      if (pNode->usIndex < NUMBEROFTILES) {
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
    pStruct = pStruct->pNext;
  }

  // Could not find it, return FALSE
  RemoveWorldFlagsFromNewNode((UINT16)iMapIndex, usIndex);

  return FALSE;
}

function RemoveAllStructsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pOldStruct = NULL;
  UINT32 fTileType;
  UINT16 usIndex;
  BOOLEAN fRetVal = FALSE;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != NULL) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileType(pStruct->usIndex, &fTileType);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        usIndex = pOldStruct->usIndex;

        // Remove Item
        if (usIndex < NUMBEROFTILES) {
          RemoveStruct(iMapIndex, pOldStruct->usIndex);
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
  LEVELNODE *pStruct = NULL;
  UINT16 usCheckWallOrient;
  UINT16 usWallOrientation;
  BOOLEAN fInsertFound = FALSE;
  BOOLEAN fRoofFound = FALSE;
  UINT8 ubRoofLevel = 0;
  UINT32 uiCheckType;
  UINT8 ubLevel = 0;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Get orientation of peice we want to add
  GetWallOrientation(usIndex, &usWallOrientation);

  // Look through all objects and Search for orientation
  while (pStruct != NULL) {
    GetWallOrientation(pStruct->usIndex, &usCheckWallOrient);
    // OLD CASE
    // if ( usCheckWallOrient > usWallOrientation )
    // Kris:
    // New case -- If placing a new wall which is at right angles to the current wall, then
    // we insert it.
    if (usCheckWallOrient > usWallOrientation) {
      if ((usWallOrientation == INSIDE_TOP_RIGHT || usWallOrientation == OUTSIDE_TOP_RIGHT) && (usCheckWallOrient == INSIDE_TOP_LEFT || usCheckWallOrient == OUTSIDE_TOP_LEFT) || (usWallOrientation == INSIDE_TOP_LEFT || usWallOrientation == OUTSIDE_TOP_LEFT) && (usCheckWallOrient == INSIDE_TOP_RIGHT || usCheckWallOrient == OUTSIDE_TOP_RIGHT)) {
        fInsertFound = TRUE;
      }
    }

    GetTileType(pStruct->usIndex, &uiCheckType);

    //		if ( uiCheckType >= FIRSTFLOOR && uiCheckType <= LASTFLOOR )
    if (uiCheckType >= FIRSTROOF && uiCheckType <= LASTROOF) {
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
    if ((usWallOrientation == INSIDE_TOP_RIGHT || usWallOrientation == OUTSIDE_TOP_RIGHT) && (usCheckWallOrient == INSIDE_TOP_RIGHT || usCheckWallOrient == OUTSIDE_TOP_RIGHT) || (usWallOrientation == INSIDE_TOP_LEFT || usWallOrientation == OUTSIDE_TOP_LEFT) && (usCheckWallOrient == INSIDE_TOP_LEFT || usCheckWallOrient == OUTSIDE_TOP_LEFT)) {
      // Same, if replace, replace here
      if (fReplace) {
        return ReplaceStructIndex(iMapIndex, pStruct->usIndex, usIndex);
      } else {
        return FALSE;
      }
    }

    // Advance to next
    pStruct = pStruct->pNext;

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
  LEVELNODE *pStruct = NULL;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  return TypeExistsInLevel(pStruct, fType, pusStructIndex);
}

function SetAllStructShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  LEVELNODE *pStruct = NULL;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  SetLevelShadeLevel(pStruct, ubShadeLevel);
}

function AdjustAllStructShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  LEVELNODE *pStruct = NULL;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  AdjustLevelShadeLevel(pStruct, bShadeDiff);
}

function SetStructIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pOldStruct = NULL;
  UINT32 fTileType;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != NULL) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileType(pStruct->usIndex, &fTileType);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldStruct->uiFlags |= uiFlags;
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
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pOldStruct = NULL;
  UINT32 fTileType;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != NULL) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileType(pStruct->usIndex, &fTileType);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldStruct->uiFlags &= (~uiFlags);
      }
    }
  }
}

// Shadow layer
// #################################################################

function AddShadowToTail(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pShadow = NULL;
  LEVELNODE *pNextShadow = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // If we're at the head, set here
  if (pShadow == NULL) {
    CHECKF(CreateLevelNode(&pShadow) != FALSE);
    pShadow->usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pShadowHead = pShadow;
  } else {
    while (pShadow != NULL) {
      if (pShadow->pNext == NULL) {
        CHECKF(CreateLevelNode(&pNextShadow) != FALSE);
        pShadow->pNext = pNextShadow;
        pNextShadow->pNext = NULL;
        pNextShadow->usIndex = usIndex;
        break;
      }

      pShadow = pShadow->pNext;
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
  LEVELNODE *pShadow;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;
  while (pShadow) {
    if (pShadow->usIndex == usIndex)
      return;
    pShadow = pShadow->pNext;
  }
  AddShadowToHead(iMapIndex, usIndex);
}

function AddShadowToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pShadow;
  LEVELNODE *pNextShadow = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Allocate head
  CHECKF(CreateLevelNode(&pNextShadow) != FALSE);
  pNextShadow->pNext = pShadow;
  pNextShadow->usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pShadowHead = pNextShadow;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_SHADOWS);
  return TRUE;
}

function RemoveShadow(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pShadow = NULL;
  LEVELNODE *pOldShadow = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != NULL) {
    if (pShadow->usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow->pNext;
      } else {
        pOldShadow->pNext = pShadow->pNext;
      }

      // Delete memory assosiated with item
      MemFree(pShadow);
      guiLevelNodes--;

      return TRUE;
    }

    pOldShadow = pShadow;
    pShadow = pShadow->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveShadowFromLevelNode(iMapIndex: UINT32, pNode: Pointer<LEVELNODE>): BOOLEAN {
  LEVELNODE *pShadow = NULL;
  LEVELNODE *pOldShadow = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != NULL) {
    if (pShadow == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow->pNext;
      } else {
        pOldShadow->pNext = pShadow->pNext;
      }

      // Delete memory assosiated with item
      MemFree(pShadow);
      guiLevelNodes--;

      return TRUE;
    }

    pOldShadow = pShadow;
    pShadow = pShadow->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveStructShadowPartner(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pShadow = NULL;
  LEVELNODE *pOldShadow = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != NULL) {
    if (pShadow->usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow->pNext;
      } else {
        pOldShadow->pNext = pShadow->pNext;
      }

      // Delete memory assosiated with item
      MemFree(pShadow);
      guiLevelNodes--;

      return TRUE;
    }

    pOldShadow = pShadow;
    pShadow = pShadow->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveAllShadowsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  LEVELNODE *pShadow = NULL;
  LEVELNODE *pOldShadow = NULL;
  UINT32 fTileType;
  BOOLEAN fRetVal = FALSE;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and Search for type

  while (pShadow != NULL) {
    if (pShadow->usIndex != NO_TILE) {
      GetTileType(pShadow->usIndex, &fTileType);

      // Advance to next
      pOldShadow = pShadow;
      pShadow = pShadow->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveShadow(iMapIndex, pOldShadow->usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

function RemoveAllShadows(iMapIndex: UINT32): BOOLEAN {
  LEVELNODE *pShadow = NULL;
  LEVELNODE *pOldShadow = NULL;
  BOOLEAN fRetVal = FALSE;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and Search for type

  while (pShadow != NULL) {
    if (pShadow->usIndex != NO_TILE) {
      // Advance to next
      pOldShadow = pShadow;
      pShadow = pShadow->pNext;

      // Remove Item
      RemoveShadow(iMapIndex, pOldShadow->usIndex);
      fRetVal = TRUE;
    }
  }
  return fRetVal;
}

function TypeExistsInShadowLayer(iMapIndex: UINT32, fType: UINT32, pusShadowIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pShadow = NULL;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  return TypeExistsInLevel(pShadow, fType, pusShadowIndex);
}

// Merc layer
// #################################################################

function AddMercToHead(iMapIndex: UINT32, pSoldier: Pointer<SOLDIERTYPE>, fAddStructInfo: BOOLEAN): BOOLEAN {
  LEVELNODE *pMerc = NULL;
  LEVELNODE *pNextMerc = NULL;

  pMerc = gpWorldLevelData[iMapIndex].pMercHead;

  // Allocate head
  CHECKF(CreateLevelNode(&pNextMerc) != FALSE);
  pNextMerc->pNext = pMerc;
  pNextMerc->pSoldier = pSoldier;
  pNextMerc->uiFlags |= LEVELNODE_SOLDIER;

  // Add structure info if we want
  if (fAddStructInfo) {
    // Set soldier's levelnode
    pSoldier->pLevelNode = pNextMerc;

    AddMercStructureInfo((UINT16)iMapIndex, pSoldier);
  }

  // Set head
  gpWorldLevelData[iMapIndex].pMercHead = pNextMerc;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_MERCS | TILES_DYNAMIC_STRUCT_MERCS | TILES_DYNAMIC_HIGHMERCS);
  return TRUE;
}

function AddMercStructureInfo(sGridNo: INT16, pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  UINT16 usAnimSurface;

  // Get surface data
  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier->usAnimState);

  AddMercStructureInfoFromAnimSurface(sGridNo, pSoldier, usAnimSurface, pSoldier->usAnimState);

  return TRUE;
}

function AddMercStructureInfoFromAnimSurface(sGridNo: INT16, pSoldier: Pointer<SOLDIERTYPE>, usAnimSurface: UINT16, usAnimState: UINT16): BOOLEAN {
  STRUCTURE_FILE_REF *pStructureFileRef;
  BOOLEAN fReturn;

  // Turn off multi tile flag...
  pSoldier->uiStatusFlags &= (~SOLDIER_MULTITILE);

  if (pSoldier->pLevelNode == NULL) {
    return FALSE;
  }

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    return FALSE;
  }

  // Remove existing structs
  DeleteStructureFromWorld(pSoldier->pLevelNode->pStructureData);
  pSoldier->pLevelNode->pStructureData = NULL;

  pStructureFileRef = GetAnimationStructureRef(pSoldier->ubID, usAnimSurface, usAnimState);

  // Now check if we are multi-tiled!
  if (pStructureFileRef != NULL) {
    if (pSoldier->ubBodyType == QUEENMONSTER) {
      // Queen uses onely one direction....
      fReturn = AddStructureToWorld(sGridNo, pSoldier->bLevel, &(pStructureFileRef->pDBStructureRef[0]), pSoldier->pLevelNode);
    } else {
      fReturn = AddStructureToWorld(sGridNo, pSoldier->bLevel, &(pStructureFileRef->pDBStructureRef[gOneCDirection[pSoldier->bDirection]]), pSoldier->pLevelNode);
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
      ScreenMsg(MSG_FONT_RED, MSG_DEBUG, L"FAILED: add struct info for merc %d (%s), at %d direction %d", pSoldier->ubID, pSoldier->name, sGridNo, pSoldier->bDirection);

      if (pStructureFileRef->pDBStructureRef[gOneCDirection[pSoldier->bDirection]].pDBStructure->ubNumberOfTiles > 1) {
        // If we have more than one tile
        pSoldier->uiStatusFlags |= SOLDIER_MULTITILE_Z;
      }

      return FALSE;
    } else {
      // Turn on if we are multi-tiled
      if (pSoldier->pLevelNode->pStructureData->pDBStructureRef->pDBStructure->ubNumberOfTiles > 1) {
        // If we have more than one tile
        pSoldier->uiStatusFlags |= SOLDIER_MULTITILE_Z;
      } else {
        // pSoldier->uiStatusFlags |= SOLDIER_MULTITILE_NZ;
      }
    }
  }

  return TRUE;
}

function OKToAddMercToWorld(pSoldier: Pointer<SOLDIERTYPE>, bDirection: INT8): BOOLEAN {
  UINT16 usAnimSurface;
  STRUCTURE_FILE_REF *pStructFileRef;
  UINT16 usOKToAddStructID;

  // if ( pSoldier->uiStatusFlags & SOLDIER_MULTITILE )
  {
    // Get surface data
    usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier->usAnimState);
    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      return FALSE;
    }

    pStructFileRef = GetAnimationStructureRef(pSoldier->ubID, usAnimSurface, pSoldier->usAnimState);

    // Now check if we have multi-tile info!
    if (pStructFileRef != NULL) {
      // Try adding struct to this location, if we can it's good!
      if (pSoldier->pLevelNode && pSoldier->pLevelNode->pStructureData != NULL) {
        usOKToAddStructID = pSoldier->pLevelNode->pStructureData->usStructureID;
      } else {
        usOKToAddStructID = INVALID_STRUCTURE_ID;
      }

      if (!OkayToAddStructureToWorld(pSoldier->sGridNo, pSoldier->bLevel, &(pStructFileRef->pDBStructureRef[gOneCDirection[bDirection]]), usOKToAddStructID)) {
        return FALSE;
      }
    }
  }

  return TRUE;
}

function UpdateMercStructureInfo(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // Remove strucute info!
  if (pSoldier->pLevelNode == NULL) {
    return FALSE;
  }

  // DeleteStructureFromWorld( pSoldier->pLevelNode->pStructureData );

  // Add new one!
  return AddMercStructureInfo(pSoldier->sGridNo, pSoldier);
}

function RemoveMerc(iMapIndex: UINT32, pSoldier: Pointer<SOLDIERTYPE>, fPlaceHolder: BOOLEAN): BOOLEAN {
  LEVELNODE *pMerc = NULL;
  LEVELNODE *pOldMerc = NULL;
  BOOLEAN fMercFound;

  if (iMapIndex == NOWHERE) {
    return FALSE;
  }

  pMerc = gpWorldLevelData[iMapIndex].pMercHead;

  // Look through all mercs and remove index if found

  while (pMerc != NULL) {
    fMercFound = FALSE;

    if (pMerc->pSoldier == pSoldier) {
      // If it's a placeholder, check!
      if (fPlaceHolder) {
        if ((pMerc->uiFlags & LEVELNODE_MERCPLACEHOLDER)) {
          fMercFound = TRUE;
        }
      } else {
        if (!(pMerc->uiFlags & LEVELNODE_MERCPLACEHOLDER)) {
          fMercFound = TRUE;
        }
      }

      if (fMercFound) {
        // OK, set links
        // Check for head or tail
        if (pOldMerc == NULL) {
          // It's the head
          gpWorldLevelData[iMapIndex].pMercHead = pMerc->pNext;
        } else {
          pOldMerc->pNext = pMerc->pNext;
        }

        if (!fPlaceHolder) {
          // Set level node to NULL
          pSoldier->pLevelNode = NULL;

          // Remove strucute info!
          DeleteStructureFromWorld(pMerc->pStructureData);
        }

        // Delete memory assosiated with item
        MemFree(pMerc);
        guiLevelNodes--;

        return TRUE;
      }
    }

    pOldMerc = pMerc;
    pMerc = pMerc->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

// Roof layer
// #################################################################

function AddRoofToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  LEVELNODE *pRoof = NULL;
  LEVELNODE *pNextRoof = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // If we're at the head, set here
  if (pRoof == NULL) {
    CHECKF(CreateLevelNode(&pRoof) != FALSE);

    if (usIndex < NUMBEROFTILES) {
      if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
        if (AddStructureToWorld((INT16)iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pRoof) == FALSE) {
          MemFree(pRoof);
          guiLevelNodes--;
          return FALSE;
        }
      }
    }
    pRoof->usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pRoofHead = pRoof;

    pNextRoof = pRoof;
  } else {
    while (pRoof != NULL) {
      if (pRoof->pNext == NULL) {
        CHECKF(CreateLevelNode(&pNextRoof) != FALSE);

        if (usIndex < NUMBEROFTILES) {
          if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
            if (AddStructureToWorld((INT16)iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextRoof) == FALSE) {
              MemFree(pNextRoof);
              guiLevelNodes--;
              return FALSE;
            }
          }
        }
        pRoof->pNext = pNextRoof;

        pNextRoof->pNext = NULL;
        pNextRoof->usIndex = usIndex;

        break;
      }

      pRoof = pRoof->pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ROOF);

  return pNextRoof;
}

function AddRoofToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pRoof = NULL;
  LEVELNODE *pNextRoof = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  CHECKF(CreateLevelNode(&pNextRoof) != FALSE);

  if (usIndex < NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      if (AddStructureToWorld((INT16)iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextRoof) == FALSE) {
        MemFree(pNextRoof);
        guiLevelNodes--;
        return FALSE;
      }
    }
  }

  pNextRoof->pNext = pRoof;
  pNextRoof->usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pRoofHead = pNextRoof;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ROOF);
  return TRUE;
}

function RemoveRoof(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pRoof = NULL;
  LEVELNODE *pOldRoof = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and remove index if found

  while (pRoof != NULL) {
    if (pRoof->usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldRoof == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pRoofHead = pRoof->pNext;
      } else {
        pOldRoof->pNext = pRoof->pNext;
      }
      // Delete memory assosiated with item
      DeleteStructureFromWorld(pRoof->pStructureData);
      MemFree(pRoof);
      guiLevelNodes--;

      return TRUE;
    }

    pOldRoof = pRoof;
    pRoof = pRoof->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeExistsInRoofLayer(iMapIndex: UINT32, fType: UINT32, pusRoofIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pRoof = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  return TypeExistsInLevel(pRoof, fType, pusRoofIndex);
}

function TypeRangeExistsInRoofLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, pusRoofIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pRoof = NULL;
  LEVELNODE *pOldRoof = NULL;
  UINT32 fTileType;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all objects and Search for type

  while (pRoof != NULL) {
    if (pRoof->usIndex != NO_TILE) {
      GetTileType(pRoof->usIndex, &fTileType);

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        *pusRoofIndex = pOldRoof->usIndex;
        return TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return FALSE;
}

function IndexExistsInRoofLayer(sGridNo: INT16, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pRoof = NULL;
  LEVELNODE *pOldRoof = NULL;

  pRoof = gpWorldLevelData[sGridNo].pRoofHead;

  // Look through all objects and Search for type

  while (pRoof != NULL) {
    if (pRoof->usIndex == usIndex) {
      return TRUE;
    }

    pRoof = pRoof->pNext;
  }

  // Could not find it, return FALSE
  return FALSE;
}

function SetAllRoofShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  LEVELNODE *pRoof = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  SetLevelShadeLevel(pRoof, ubShadeLevel);
}

function AdjustAllRoofShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  LEVELNODE *pRoof = NULL;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  AdjustLevelShadeLevel(pRoof, bShadeDiff);
}

function RemoveAllRoofsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  LEVELNODE *pRoof = NULL;
  LEVELNODE *pOldRoof = NULL;
  UINT32 fTileType;
  BOOLEAN fRetVal = FALSE;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != NULL) {
    if (pRoof->usIndex != NO_TILE) {
      GetTileType(pRoof->usIndex, &fTileType);

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveRoof(iMapIndex, pOldRoof->usIndex);
        fRetVal = TRUE;
      }
    }
  }

  // Could not find it, return FALSE

  return fRetVal;
}

function RemoveRoofIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  LEVELNODE *pRoof = NULL;
  LEVELNODE *pOldRoof = NULL;
  UINT32 fTileType;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != NULL) {
    if (pRoof->usIndex != NO_TILE) {
      GetTileType(pRoof->usIndex, &fTileType);

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldRoof->uiFlags &= (~uiFlags);
      }
    }
  }
}

function SetRoofIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  LEVELNODE *pRoof = NULL;
  LEVELNODE *pOldRoof = NULL;
  UINT32 fTileType;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != NULL) {
    if (pRoof->usIndex != NO_TILE) {
      GetTileType(pRoof->usIndex, &fTileType);

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldRoof->uiFlags |= uiFlags;
      }
    }
  }
}

// OnRoof layer
// #################################################################

function AddOnRoofToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  LEVELNODE *pOnRoof = NULL;
  LEVELNODE *pNextOnRoof = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // If we're at the head, set here
  if (pOnRoof == NULL) {
    CHECKF(CreateLevelNode(&pOnRoof) != FALSE);

    if (usIndex < NUMBEROFTILES) {
      if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
        if (AddStructureToWorld((INT16)iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pOnRoof) == FALSE) {
          MemFree(pOnRoof);
          guiLevelNodes--;
          return FALSE;
        }
      }
    }
    pOnRoof->usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof;

    ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
    return pOnRoof;
  } else {
    while (pOnRoof != NULL) {
      if (pOnRoof->pNext == NULL) {
        CHECKF(CreateLevelNode(&pNextOnRoof) != FALSE);

        if (usIndex < NUMBEROFTILES) {
          if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
            if (AddStructureToWorld((INT16)iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextOnRoof) == FALSE) {
              MemFree(pNextOnRoof);
              guiLevelNodes--;
              return NULL;
            }
          }
        }

        pOnRoof->pNext = pNextOnRoof;

        pNextOnRoof->pNext = NULL;
        pNextOnRoof->usIndex = usIndex;
        break;
      }

      pOnRoof = pOnRoof->pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
  return pNextOnRoof;
}

function AddOnRoofToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pOnRoof = NULL;
  LEVELNODE *pNextOnRoof = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  CHECKF(CreateLevelNode(&pNextOnRoof) != FALSE);
  if (usIndex < NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != NULL) {
      if (AddStructureToWorld((INT16)iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextOnRoof) == FALSE) {
        MemFree(pNextOnRoof);
        guiLevelNodes--;
        return FALSE;
      }
    }
  }

  pNextOnRoof->pNext = pOnRoof;
  pNextOnRoof->usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pOnRoofHead = pNextOnRoof;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
  return TRUE;
}

function RemoveOnRoof(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pOnRoof = NULL;
  LEVELNODE *pOldOnRoof = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and remove index if found

  while (pOnRoof != NULL) {
    if (pOnRoof->usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldOnRoof == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof->pNext;
      } else {
        pOldOnRoof->pNext = pOnRoof->pNext;
      }

      // REMOVE ONROOF!
      MemFree(pOnRoof);
      guiLevelNodes--;

      return TRUE;
    }

    pOldOnRoof = pOnRoof;
    pOnRoof = pOnRoof->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveOnRoofFromLevelNode(iMapIndex: UINT32, pNode: Pointer<LEVELNODE>): BOOLEAN {
  LEVELNODE *pOnRoof = NULL;
  LEVELNODE *pOldOnRoof = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and remove index if found

  while (pOnRoof != NULL) {
    if (pOnRoof == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldOnRoof == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof->pNext;
      } else {
        pOldOnRoof->pNext = pOnRoof->pNext;
      }

      // REMOVE ONROOF!
      MemFree(pOnRoof);
      guiLevelNodes--;

      return TRUE;
    }

    pOldOnRoof = pOnRoof;
    pOnRoof = pOnRoof->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function TypeExistsInOnRoofLayer(iMapIndex: UINT32, fType: UINT32, pusOnRoofIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pOnRoof = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  return TypeExistsInLevel(pOnRoof, fType, pusOnRoofIndex);
}

function SetAllOnRoofShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  LEVELNODE *pOnRoof = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  SetLevelShadeLevel(pOnRoof, ubShadeLevel);
}

function AdjustAllOnRoofShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  LEVELNODE *pOnRoof = NULL;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  AdjustLevelShadeLevel(pOnRoof, bShadeDiff);
}

function RemoveAllOnRoofsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  LEVELNODE *pOnRoof = NULL;
  LEVELNODE *pOldOnRoof = NULL;
  UINT32 fTileType;
  BOOLEAN fRetVal = FALSE;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and Search for type

  while (pOnRoof != NULL) {
    if (pOnRoof->usIndex != NO_TILE) {
      GetTileType(pOnRoof->usIndex, &fTileType);

      // Advance to next
      pOldOnRoof = pOnRoof;
      pOnRoof = pOnRoof->pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveOnRoof(iMapIndex, pOldOnRoof->usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

// Topmost layer
// #################################################################

function AddTopmostToTail(iMapIndex: UINT32, usIndex: UINT16): Pointer<LEVELNODE> {
  LEVELNODE *pTopmost = NULL;
  LEVELNODE *pNextTopmost = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // If we're at the head, set here
  if (pTopmost == NULL) {
    CHECKN(CreateLevelNode(&pNextTopmost) != FALSE);
    pNextTopmost->usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pTopmostHead = pNextTopmost;
  } else {
    while (pTopmost != NULL) {
      if (pTopmost->pNext == NULL) {
        CHECKN(CreateLevelNode(&pNextTopmost) != FALSE);
        pTopmost->pNext = pNextTopmost;
        pNextTopmost->pNext = NULL;
        pNextTopmost->usIndex = usIndex;

        break;
      }

      pTopmost = pTopmost->pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return pNextTopmost;
}

function AddUIElem(iMapIndex: UINT32, usIndex: UINT16, sRelativeX: INT8, sRelativeY: INT8, ppNewNode: Pointer<Pointer<LEVELNODE>>): BOOLEAN {
  LEVELNODE *pTopmost = NULL;

  pTopmost = AddTopmostToTail(iMapIndex, usIndex);

  CHECKF(pTopmost != NULL);

  // Set flags
  pTopmost->uiFlags |= LEVELNODE_USERELPOS;
  pTopmost->sRelativeX = sRelativeX;
  pTopmost->sRelativeY = sRelativeY;

  if (ppNewNode != NULL) {
    *ppNewNode = pTopmost;
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return TRUE;
}

function RemoveUIElem(iMapIndex: UINT32, usIndex: UINT16): void {
  RemoveTopmost(iMapIndex, usIndex);
}

function AddTopmostToHead(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pTopmost = NULL;
  LEVELNODE *pNextTopmost = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Allocate head
  CHECKF(CreateLevelNode(&pNextTopmost) != FALSE);
  pNextTopmost->pNext = pTopmost;
  pNextTopmost->usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pTopmostHead = pNextTopmost;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return TRUE;
}

function RemoveTopmost(iMapIndex: UINT32, usIndex: UINT16): BOOLEAN {
  LEVELNODE *pTopmost = NULL;
  LEVELNODE *pOldTopmost = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and remove index if found

  while (pTopmost != NULL) {
    if (pTopmost->usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldTopmost == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pTopmostHead = pTopmost->pNext;
      } else {
        pOldTopmost->pNext = pTopmost->pNext;
      }

      // Delete memory assosiated with item
      MemFree(pTopmost);
      guiLevelNodes--;

      return TRUE;
    }

    pOldTopmost = pTopmost;
    pTopmost = pTopmost->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveTopmostFromLevelNode(iMapIndex: UINT32, pNode: Pointer<LEVELNODE>): BOOLEAN {
  LEVELNODE *pTopmost = NULL;
  LEVELNODE *pOldTopmost = NULL;
  UINT16 usIndex;

  usIndex = pNode->usIndex;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and remove index if found

  while (pTopmost != NULL) {
    if (pTopmost == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldTopmost == NULL) {
        // It's the head
        gpWorldLevelData[iMapIndex].pTopmostHead = pTopmost->pNext;
      } else {
        pOldTopmost->pNext = pTopmost->pNext;
      }

      // Delete memory assosiated with item
      MemFree(pTopmost);
      guiLevelNodes--;

      return TRUE;
    }

    pOldTopmost = pTopmost;
    pTopmost = pTopmost->pNext;
  }

  // Could not find it, return FALSE

  return FALSE;
}

function RemoveAllTopmostsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): BOOLEAN {
  LEVELNODE *pTopmost = NULL;
  LEVELNODE *pOldTopmost = NULL;
  UINT32 fTileType;
  BOOLEAN fRetVal = FALSE;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and Search for type

  while (pTopmost != NULL) {
    // Advance to next
    pOldTopmost = pTopmost;
    pTopmost = pTopmost->pNext;

    if (pOldTopmost->usIndex != NO_TILE && pOldTopmost->usIndex < NUMBEROFTILES) {
      GetTileType(pOldTopmost->usIndex, &fTileType);

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveTopmost(iMapIndex, pOldTopmost->usIndex);
        fRetVal = TRUE;
      }
    }
  }
  return fRetVal;
}

function TypeExistsInTopmostLayer(iMapIndex: UINT32, fType: UINT32, pusTopmostIndex: Pointer<UINT16>): BOOLEAN {
  LEVELNODE *pTopmost = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  return TypeExistsInLevel(pTopmost, fType, pusTopmostIndex);
}

function SetTopmostFlags(iMapIndex: UINT32, uiFlags: UINT32, usIndex: UINT16): void {
  LEVELNODE *pTopmost = NULL;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  SetIndexLevelNodeFlags(pTopmost, uiFlags, usIndex);
}

function RemoveTopmostFlags(iMapIndex: UINT32, uiFlags: UINT32, usIndex: UINT16): void {
  LEVELNODE *pTopmost = NULL;

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
  STRUCTURE *pStructure;

  pStructure = FindStructure(sGridNo, STRUCTURE_NORMAL_ROOF);

  if (pStructure != NULL) {
    return TRUE;
  }

  return FALSE;
}

function IsLowerLevel(sGridNo: INT16): BOOLEAN {
  STRUCTURE *pStructure;

  pStructure = FindStructure(sGridNo, STRUCTURE_NORMAL_ROOF);

  if (pStructure == NULL) {
    return TRUE;
  }

  return FALSE;
}

function IsRoofVisible(sMapPos: INT16): BOOLEAN {
  STRUCTURE *pStructure;

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
  STRUCTURE *pStructure;

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
  STRUCTURE *pStructure;

  if (!GridNoOnVisibleWorldTile(sGridNo)) {
    return NOBODY;
  }

  if (gpWorldLevelData[sGridNo].pStructureHead != NULL) {
    pStructure = gpWorldLevelData[sGridNo].pStructureHead;

    while (pStructure) {
      // person must either have their pSoldier->sGridNo here or be non-passable
      if ((pStructure->fFlags & STRUCTURE_PERSON) && (!(pStructure->fFlags & STRUCTURE_PASSABLE) || MercPtrs[pStructure->usStructureID]->sGridNo == sGridNo)) {
        if ((bLevel == 0 && pStructure->sCubeOffset == 0) || (bLevel > 0 && pStructure->sCubeOffset > 0)) {
          // found a person, on the right level!
          // structure ID and merc ID are identical for merc structures
          return (UINT8)pStructure->usStructureID;
        }
      }
      pStructure = pStructure->pNext;
    }
  }

  return (UINT8)NOBODY;
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
  MAP_ELEMENT *pMapElement;

  if (sGridNo == NOWHERE) {
    return FALSE;
  }

  pMapElement = &(gpWorldLevelData[sGridNo]);
  if (pMapElement->ubTerrainID == LOW_WATER || pMapElement->ubTerrainID == MED_WATER || pMapElement->ubTerrainID == DEEP_WATER) {
    // check for a bridge!  otherwise...
    return TRUE;
  } else {
    return FALSE;
  }
}

function DeepWater(sGridNo: INT16): BOOLEAN {
  MAP_ELEMENT *pMapElement;

  pMapElement = &(gpWorldLevelData[sGridNo]);
  if (pMapElement->ubTerrainID == DEEP_WATER) {
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
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pOldStruct = NULL;
  UINT32 uiTileFlags;

  pStruct = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type
  while (pStruct != NULL) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileFlags(pStruct->usIndex, &uiTileFlags);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct->pNext;

      if (uiTileFlags & AFRAME_TILE) {
        pOldStruct->uiFlags |= uiFlags;
      }
    }
  }
}

function RemoveStructAframeFlags(iMapIndex: UINT32, uiFlags: UINT32): void {
  LEVELNODE *pStruct = NULL;
  LEVELNODE *pOldStruct = NULL;
  UINT32 uiTileFlags;

  pStruct = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type
  while (pStruct != NULL) {
    if (pStruct->usIndex != NO_TILE) {
      GetTileFlags(pStruct->usIndex, &uiTileFlags);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct->pNext;

      if (uiTileFlags & AFRAME_TILE) {
        pOldStruct->uiFlags &= (~uiFlags);
      }
    }
  }
}

function FindLevelNodeBasedOnStructure(sGridNo: INT16, pStructure: Pointer<STRUCTURE>): Pointer<LEVELNODE> {
  LEVELNODE *pLevelNode;

  // ATE: First look on the struct layer.....
  pLevelNode = gpWorldLevelData[sGridNo].pStructHead;
  while (pLevelNode != NULL) {
    if (pLevelNode->pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode->pNext;
  }

  // Next the roof layer....
  pLevelNode = gpWorldLevelData[sGridNo].pRoofHead;
  while (pLevelNode != NULL) {
    if (pLevelNode->pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode->pNext;
  }

  // Then the object layer....
  pLevelNode = gpWorldLevelData[sGridNo].pObjectHead;
  while (pLevelNode != NULL) {
    if (pLevelNode->pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode->pNext;
  }

  // Finally the onroof layer....
  pLevelNode = gpWorldLevelData[sGridNo].pOnRoofHead;
  while (pLevelNode != NULL) {
    if (pLevelNode->pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode->pNext;
  }

  // Assert here if it cannot be found....
  AssertMsg(0, "FindLevelNodeBasedOnStruct failed.");

  return NULL;
}

function FindShadow(sGridNo: INT16, usStructIndex: UINT16): Pointer<LEVELNODE> {
  LEVELNODE *pLevelNode;
  UINT16 usShadowIndex;

  if (usStructIndex < FIRSTOSTRUCT1 || usStructIndex >= FIRSTSHADOW1) {
    return NULL;
  }

  usShadowIndex = usStructIndex - FIRSTOSTRUCT1 + FIRSTSHADOW1;

  pLevelNode = gpWorldLevelData[sGridNo].pShadowHead;
  while (pLevelNode != NULL) {
    if (pLevelNode->usIndex == usShadowIndex) {
      break;
    }
    pLevelNode = pLevelNode->pNext;
  }
  return pLevelNode;
}

function WorldHideTrees(): void {
  LEVELNODE *pNode;
  BOOLEAN fRerender = FALSE;
  UINT32 fTileFlags;
  UINT32 cnt;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pNode = gpWorldLevelData[cnt].pStructHead;
    while (pNode != NULL) {
      GetTileFlags(pNode->usIndex, &fTileFlags);

      if (fTileFlags & FULL3D_TILE) {
        if (!(pNode->uiFlags & LEVELNODE_REVEALTREES)) {
          pNode->uiFlags |= (LEVELNODE_REVEALTREES);
        }

        fRerender = TRUE;
      }
      pNode = pNode->pNext;
    }
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

function WorldShowTrees(): void {
  LEVELNODE *pNode;
  BOOLEAN fRerender = FALSE;
  UINT32 fTileFlags;
  UINT32 cnt;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pNode = gpWorldLevelData[cnt].pStructHead;
    while (pNode != NULL) {
      GetTileFlags(pNode->usIndex, &fTileFlags);

      if (fTileFlags & FULL3D_TILE) {
        if ((pNode->uiFlags & LEVELNODE_REVEALTREES)) {
          pNode->uiFlags &= (~(LEVELNODE_REVEALTREES));
        }

        fRerender = TRUE;
      }
      pNode = pNode->pNext;
    }
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

function SetWorldFlagsFromNewNode(sGridNo: UINT16, usIndex: UINT16): void {
}

function RemoveWorldFlagsFromNewNode(sGridNo: UINT16, usIndex: UINT16): void {
}

function SetWallLevelnodeFlags(sGridNo: UINT16, uiFlags: UINT32): void {
  LEVELNODE *pStruct = NULL;

  pStruct = gpWorldLevelData[sGridNo].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != NULL) {
    if (pStruct->pStructureData != NULL) {
      // See if we are a wall!
      if (pStruct->pStructureData->fFlags & STRUCTURE_WALLSTUFF) {
        pStruct->uiFlags |= uiFlags;
      }
    }
    // Advance to next
    pStruct = pStruct->pNext;
  }
}

function RemoveWallLevelnodeFlags(sGridNo: UINT16, uiFlags: UINT32): void {
  LEVELNODE *pStruct = NULL;

  pStruct = gpWorldLevelData[sGridNo].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != NULL) {
    if (pStruct->pStructureData != NULL) {
      // See if we are a wall!
      if (pStruct->pStructureData->fFlags & STRUCTURE_WALLSTUFF) {
        pStruct->uiFlags &= (~uiFlags);
      }
    }
    // Advance to next
    pStruct = pStruct->pNext;
  }
}

function SetTreeTopStateForMap(): void {
  if (!gGameSettings.fOptions[TOPTION_TOGGLE_TREE_TOPS]) {
    WorldHideTrees();
    gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;
  } else {
    WorldShowTrees();
    gTacticalStatus.uiFlags &= (~NOHIDE_REDUNDENCY);
  }

  // FOR THE NEXT RENDER LOOP, RE-EVALUATE REDUNDENT TILES
  InvalidateWorldRedundency();
}
