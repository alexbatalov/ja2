namespace ja2 {

let guiLNCount: UINT32[] /* [9] */;
/* static */ let gzLevelString: string[] /* CHAR16[9][15] */ = [
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
function CreateLevelNode(): LEVELNODE {
  let pNode: LEVELNODE;

  pNode = createLevelNode();

  // Set default values
  pNode.ubShadeLevel = LightGetAmbient();
  pNode.ubNaturalShadeLevel = LightGetAmbient();
  pNode.pSoldier = <SOLDIERTYPE><unknown>null;
  pNode.pNext = null;
  pNode.sRelativeX = 0;
  pNode.sRelativeY = 0;

  guiLevelNodes++;

  return pNode;
}

export function CountLevelNodes(): void {
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let pLN: LEVELNODE | null;
  let pME: MAP_ELEMENT;

  for (uiLoop2 = 0; uiLoop2 < 9; uiLoop2++) {
    guiLNCount[uiLoop2] = 0;
  }

  for (uiLoop = 0; uiLoop < WORLD_MAX; uiLoop++) {
    pME = gpWorldLevelData[uiLoop];
    // start at 1 to skip land head ptr; 0 stores total
    for (uiLoop2 = 1; uiLoop2 < 9; uiLoop2++) {
      pLN = pME.pLevelNodes[uiLoop2];
      while (pLN != null) {
        guiLNCount[uiLoop2]++;
        guiLNCount[0]++;
        pLN = pLN.pNext;
      }
    }
  }
}

const LINE_HEIGHT = 20;
export function DebugLevelNodePage(): void {
  let uiLoop: UINT32;

  SetFont(LARGEFONT1());
  gprintf(0, 0, "DEBUG LEVELNODES PAGE 1 OF 1");

  for (uiLoop = 1; uiLoop < 9; uiLoop++) {
    gprintf(0, LINE_HEIGHT * (uiLoop + 1), gzLevelString[uiLoop], guiLNCount[uiLoop]);
  }
  gprintf(0, LINE_HEIGHT * 12, "%d land nodes in excess of world max (25600)", guiLNCount[1] - WORLD_MAX);
  gprintf(0, LINE_HEIGHT * 13, "Total # levelnodes %d, %d bytes each", guiLNCount[0], LEVEL_NODE_SIZE);
  gprintf(0, LINE_HEIGHT * 14, "Total memory for levelnodes %d", guiLNCount[0] * LEVEL_NODE_SIZE);
}

function TypeExistsInLevel(pStartNode: LEVELNODE | null, fType: UINT32): UINT16 {
  let fTileType: UINT32;

  // Look through all objects and Search for type
  while (pStartNode != null) {
    if (pStartNode.usIndex != NO_TILE && pStartNode.usIndex < Enum312.NUMBEROFTILES) {
      fTileType = GetTileType(pStartNode.usIndex);

      if (fTileType == fType) {
        return pStartNode.usIndex;
      }
    }

    pStartNode = pStartNode.pNext;
  }

  // Could not find it, return FALSE
  return -1;
}

// SHADE LEVEL MANIPULATION FOR NODES
function SetLevelShadeLevel(pStartNode: LEVELNODE | null, ubShadeLevel: UINT8): void {
  // Look through all objects and Search for type
  while (pStartNode != null) {
    pStartNode.ubShadeLevel = ubShadeLevel;

    // Advance to next
    pStartNode = pStartNode.pNext;
  }
}

function AdjustLevelShadeLevel(pStartNode: LEVELNODE | null, bShadeDiff: INT8): void {
  // Look through all objects and Search for type
  while (pStartNode != null) {
    pStartNode.ubShadeLevel += bShadeDiff;

    if (pStartNode.ubShadeLevel > MAX_SHADE_LEVEL) {
      pStartNode.ubShadeLevel = MAX_SHADE_LEVEL;
    }

    if (pStartNode.ubShadeLevel < MIN_SHADE_LEVEL) {
      pStartNode.ubShadeLevel = MIN_SHADE_LEVEL;
    }

    // Advance to next
    pStartNode = pStartNode.pNext;
  }
}

function SetIndexLevelNodeFlags(pStartNode: LEVELNODE | null, uiFlags: UINT32, usIndex: UINT16): void {
  // Look through all objects and Search for type
  while (pStartNode != null) {
    if (pStartNode.usIndex == usIndex) {
      pStartNode.uiFlags |= uiFlags;
      break;
    }

    // Advance to next
    pStartNode = pStartNode.pNext;
  }
}

function RemoveIndexLevelNodeFlags(pStartNode: LEVELNODE | null, uiFlags: UINT32, usIndex: UINT16): void {
  // Look through all objects and Search for type
  while (pStartNode != null) {
    if (pStartNode.usIndex == usIndex) {
      pStartNode.uiFlags &= (~uiFlags);
      break;
    }

    // Advance to next
    pStartNode = pStartNode.pNext;
  }
}

// First for object layer
// #################################################################

export function AddObjectToTail(iMapIndex: UINT32, usIndex: UINT16): LEVELNODE {
  let pObject: LEVELNODE | null = null;
  let pNextObject: LEVELNODE = <LEVELNODE><unknown>null;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // If we're at the head, set here
  if (pObject == null) {
    pNextObject = CreateLevelNode();
    pNextObject.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pObjectHead = pNextObject;
  } else {
    while (pObject != null) {
      if (pObject.pNext == null) {
        pNextObject = CreateLevelNode();
        pObject.pNext = pNextObject;

        pNextObject.pNext = null;
        pNextObject.usIndex = usIndex;

        break;
      }

      pObject = pObject.pNext;
    }
  }

  // CheckForAndAddTileCacheStructInfo( pNextObject, (INT16)iMapIndex, usIndex );

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_OBJECTS);
  return pNextObject;
}

export function AddObjectToHead(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pObject: LEVELNODE | null = null;
  let pNextObject: LEVELNODE;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  pNextObject = CreateLevelNode();

  pNextObject.pNext = pObject;
  pNextObject.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pObjectHead = pNextObject;

  // CheckForAndAddTileCacheStructInfo( pNextObject, (INT16)iMapIndex, usIndex );

  // If it's NOT the first head
  ResetSpecificLayerOptimizing(TILES_DYNAMIC_OBJECTS);

  // Add the object to the map temp file, if we have to
  AddObjectToMapTempFile(iMapIndex, usIndex);

  return true;
}

export function RemoveObject(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pObject: LEVELNODE | null = null;
  let pOldObject: LEVELNODE | null = null;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and remove index if found

  while (pObject != null) {
    if (pObject.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldObject == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pObjectHead = pObject.pNext;
      } else {
        pOldObject.pNext = pObject.pNext;
      }

      CheckForAndDeleteTileCacheStructInfo(pObject, usIndex);

      // Delete memory assosiated with item
      guiLevelNodes--;

      // Add the index to the maps temp file so we can remove it after reloading the map
      AddRemoveObjectToMapTempFile(iMapIndex, usIndex);

      return true;
    }

    pOldObject = pObject;
    pObject = pObject.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

export function TypeRangeExistsInObjectLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): UINT16 {
  let pObject: LEVELNODE | null = null;
  let pOldObject: LEVELNODE;
  let fTileType: UINT32;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and Search for type

  while (pObject != null) {
    // Advance to next
    pOldObject = pObject;
    pObject = pObject.pNext;

    if (pOldObject.usIndex != NO_TILE && pOldObject.usIndex < Enum312.NUMBEROFTILES) {
      fTileType = GetTileType(pOldObject.usIndex);

      if (fTileType >= fStartType && fTileType <= fEndType) {
        return pOldObject.usIndex;
      }
    }
  }

  // Could not find it, return FALSE

  return -1;
}

export function TypeExistsInObjectLayer(iMapIndex: UINT32, fType: UINT32): UINT16 {
  let pObject: LEVELNODE | null = null;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  return TypeExistsInLevel(pObject, fType);
}

function SetAllObjectShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pObject: LEVELNODE | null = null;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  SetLevelShadeLevel(pObject, ubShadeLevel);
}

function AdjustAllObjectShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pObject: LEVELNODE | null = null;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  AdjustLevelShadeLevel(pObject, bShadeDiff);
}

export function RemoveAllObjectsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): boolean {
  let pObject: LEVELNODE | null = null;
  let pOldObject: LEVELNODE;
  let fTileType: UINT32;
  let fRetVal: boolean = false;

  pObject = gpWorldLevelData[iMapIndex].pObjectHead;

  // Look through all objects and Search for type

  while (pObject != null) {
    // Advance to next
    pOldObject = pObject;
    pObject = pObject.pNext;

    if (pOldObject.usIndex != NO_TILE && pOldObject.usIndex < Enum312.NUMBEROFTILES) {
      fTileType = GetTileType(pOldObject.usIndex);

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveObject(iMapIndex, pOldObject.usIndex);
        fRetVal = true;
      }
    }
  }
  return fRetVal;
}

// #######################################################
// Land Peice Layer
// #######################################################

export function AddLandToTail(iMapIndex: UINT32, usIndex: UINT16): LEVELNODE {
  let pLand: LEVELNODE | null = null;
  let pNextLand: LEVELNODE = <LEVELNODE><unknown>null;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // If we're at the head, set here
  if (pLand == null) {
    pNextLand = CreateLevelNode();
    pNextLand.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pLandHead = pNextLand;
  } else {
    while (pLand != null) {
      if (pLand.pNext == null) {
        pNextLand = CreateLevelNode();
        pLand.pNext = pNextLand;

        pNextLand.pNext = null;
        pNextLand.pPrevNode = pLand;
        pNextLand.usIndex = usIndex;

        break;
      }

      pLand = pLand.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return pNextLand;
}

export function AddLandToHead(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pLand: LEVELNODE | null = null;
  let pNextLand: LEVELNODE;
  let TileElem: TILE_ELEMENT = createTileElement();

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Allocate head
  pNextLand = CreateLevelNode();

  pNextLand.pNext = pLand;
  pNextLand.pPrevNode = null;
  pNextLand.usIndex = usIndex;
  pNextLand.ubShadeLevel = LightGetAmbient();

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
  if (pLand != null) {
    pLand.pPrevNode = pNextLand;
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return true;
}

export function RemoveLand(iMapIndex: UINT32, usIndex: UINT16): boolean {
  RemoveLandEx(iMapIndex, usIndex);

  AdjustForFullTile(iMapIndex);

  return false;
}

function RemoveLandEx(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pLand: LEVELNODE | null = null;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != null) {
    if (pLand.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pLand.pPrevNode == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pLandHead = pLand.pNext;
      } else {
        pLand.pPrevNode.pNext = pLand.pNext;
      }

      // Check for tail
      if (pLand.pNext == null) {
      } else {
        pLand.pNext.pPrevNode = pLand.pPrevNode;
      }

      // Delete memory assosiated with item
      guiLevelNodes--;

      break;
    }
    pLand = pLand.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

function AdjustForFullTile(iMapIndex: UINT32): boolean {
  let pLand: LEVELNODE | null = null;
  let pOldLand: LEVELNODE;
  let TileElem: TILE_ELEMENT = createTileElement();
  //	UINT32 iType;
  //	UINT16 iNewIndex;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != null) {
    if (pLand.usIndex < Enum312.NUMBEROFTILES) {
      // If this is a full tile, set new full tile
      TileElem = gTileDatabase[pLand.usIndex];

      // Check for full tile
      if (TileElem.ubFullTile) {
        gpWorldLevelData[iMapIndex].pLandStart = pLand;
        return true;
      }
    }
    pOldLand = pLand;
    pLand = pLand.pNext;
  }

  // Could not find a full tile
  // Set to tail, and convert it to a full tile!
  // Add a land peice to tail from basic land
  {
    let NewIndex: UINT16;
    let pNewNode: LEVELNODE;

    NewIndex = (Random(10));

    // Adjust for type
    NewIndex += gTileTypeStartIndex[gCurrentBackground];

    pNewNode = AddLandToTail(iMapIndex, NewIndex);

    gpWorldLevelData[iMapIndex].pLandStart = pNewNode;
  }

  return false;
}

export function ReplaceLandIndex(iMapIndex: UINT32, usOldIndex: UINT16, usNewIndex: UINT16): boolean {
  let pLand: LEVELNODE | null = null;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all Lands and remove index if found

  while (pLand != null) {
    if (pLand.usIndex == usOldIndex) {
      // OK, set new index value
      pLand.usIndex = usNewIndex;

      AdjustForFullTile(iMapIndex);

      return true;
    }

    // Advance
    pLand = pLand.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

export function TypeExistsInLandLayer(iMapIndex: UINT32, fType: UINT32): UINT16 {
  let pLand: LEVELNODE | null = null;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  return TypeExistsInLevel(pLand, fType);
}

export function TypeRangeExistsInLandLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): UINT16 {
  let pLand: LEVELNODE | null = null;
  let pOldLand: LEVELNODE;
  let fTileType: UINT32;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != null) {
    if (pLand.usIndex != NO_TILE) {
      fTileType = GetTileType(pLand.usIndex);

      // Advance to next
      pOldLand = pLand;
      pLand = pLand.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        return pOldLand.usIndex;
      }
    }
  }

  // Could not find it, return FALSE

  return -1;
}

function TypeRangeExistsInLandHead(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): UINT16 {
  let pLand: LEVELNODE | null = null;
  let pOldLand: LEVELNODE;
  let fTileType: UINT32;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;
  Assert(pLand);
  // Look through all objects and Search for type

  if (pLand.usIndex != NO_TILE) {
    fTileType = GetTileType(pLand.usIndex);

    // Advance to next
    pOldLand = pLand;
    pLand = pLand.pNext;

    if (fTileType >= fStartType && fTileType <= fEndType) {
      return pOldLand.usIndex;
    }
  }

  // Could not find it, return FALSE

  return -1;
}

function TypeRangeExistsInStructLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): UINT16 {
  let pStruct: LEVELNODE | null = null;
  let pOldStruct: LEVELNODE;
  let fTileType: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != null) {
    if (pStruct.usIndex != NO_TILE) {
      fTileType = GetTileType(pStruct.usIndex);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        return pOldStruct.usIndex;
      }
    }
  }

  // Could not find it, return FALSE

  return -1;
}

export function RemoveAllLandsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): boolean {
  let pLand: LEVELNODE | null = null;
  let pOldLand: LEVELNODE;
  let fTileType: UINT32;
  let fRetVal: boolean = false;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != null) {
    if (pLand.usIndex != NO_TILE) {
      fTileType = GetTileType(pLand.usIndex);

      // Advance to next
      pOldLand = pLand;
      pLand = pLand.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveLand(iMapIndex, pOldLand.usIndex);
        fRetVal = true;
      }
    }
  }
  return fRetVal;
}

function SetAllLandShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pLand: LEVELNODE | null = null;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  SetLevelShadeLevel(pLand, ubShadeLevel);
}

function AdjustAllLandShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pLand: LEVELNODE | null = null;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type
  AdjustLevelShadeLevel(pLand, bShadeDiff);
}

export function DeleteAllLandLayers(iMapIndex: UINT32): boolean {
  let pLand: LEVELNODE | null = null;
  let pOldLand: LEVELNODE;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Look through all objects and Search for type

  while (pLand != null) {
    // Advance to next
    pOldLand = pLand;
    pLand = pLand.pNext;

    // Remove Item
    RemoveLandEx(iMapIndex, pOldLand.usIndex);
  }

  // Set world data values
  gpWorldLevelData[iMapIndex].pLandHead = null;
  gpWorldLevelData[iMapIndex].pLandStart = null;

  return true;
}

export function InsertLandIndexAtLevel(iMapIndex: UINT32, usIndex: UINT16, ubLevel: UINT8): boolean {
  let pLand: LEVELNODE | null = null;
  let pNextLand: LEVELNODE;
  let level: UINT8 = 0;
  let CanInsert: boolean = false;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // If we want to insert at head;
  if (ubLevel == 0) {
    AddLandToHead(iMapIndex, usIndex);
    return true;
  }

  // Allocate memory for new item
  pNextLand = CreateLevelNode();
  pNextLand.usIndex = usIndex;

  // Move to index before insertion
  while (pLand != null) {
    if (level == (ubLevel - 1)) {
      CanInsert = true;
      break;
    }

    pLand = pLand.pNext;
    level++;
  }

  // Check if level has been macthed
  if (!CanInsert) {
    return false;
  }

  // Set links, according to position!
  pNextLand.pPrevNode = pLand;
  pNextLand.pNext = (<LEVELNODE>pLand).pNext;
  (<LEVELNODE>pLand).pNext = pNextLand;

  // Check for tail
  if (pNextLand.pNext == null) {
  } else {
    pNextLand.pNext.pPrevNode = pNextLand;
  }

  AdjustForFullTile(iMapIndex);

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return true;
}

export function RemoveHigherLandLevels(iMapIndex: UINT32, fSrcType: UINT32, puiHigherTypes: Pointer<UINT32[]>, pubNumHigherTypes: Pointer<UINT8>): boolean {
  let pLand: LEVELNODE | null = null;
  let pOldLand: LEVELNODE | null = null;
  let fTileType: UINT32;
  let ubSrcLogHeight: UINT8;

  pubNumHigherTypes.value = 0;
  puiHigherTypes.value = [];

  // Start at tail and up
  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // GEt tail
  while (pLand != null) {
    pOldLand = pLand;
    pLand = pLand.pNext;
  }

  pLand = pOldLand;

  // Get src height
  ubSrcLogHeight = GetTileTypeLogicalHeight(fSrcType);

  // Look through all objects and Search for height
  while (pLand != null) {
    fTileType = GetTileType(pLand.usIndex);

    // Advance to next
    pOldLand = pLand;
    pLand = pLand.pPrevNode;

    if (gTileTypeLogicalHeight[fTileType] > ubSrcLogHeight) {
      // Remove Item
      SetLandIndex(iMapIndex, pOldLand.usIndex, fTileType, true);

      (pubNumHigherTypes.value)++;

      puiHigherTypes.value.push(0);

      (puiHigherTypes.value)[(pubNumHigherTypes.value) - 1] = fTileType;
    }
  }

  // Adjust full tile sets
  AdjustForFullTile(iMapIndex);

  return true;
}

function SetLowerLandLevels(iMapIndex: UINT32, fSrcType: UINT32, usIndex: UINT16): boolean {
  let pLand: LEVELNODE | null = null;
  let pOldLand: LEVELNODE;
  let fTileType: UINT32;
  let ubSrcLogHeight: UINT8;
  let NewTile: UINT16;

  pLand = gpWorldLevelData[iMapIndex].pLandHead;

  // Get src height
  ubSrcLogHeight = GetTileTypeLogicalHeight(fSrcType);

  // Look through all objects and Search for height
  while (pLand != null) {
    fTileType = GetTileType(pLand.usIndex);

    // Advance to next
    pOldLand = pLand;
    pLand = pLand.pNext;

    if (gTileTypeLogicalHeight[fTileType] < ubSrcLogHeight) {
      // Set item
      NewTile = GetTileIndexFromTypeSubIndex(fTileType, usIndex);

      // Set as normal
      SetLandIndex(iMapIndex, NewTile, fTileType, false);
    }
  }

  // Adjust full tile sets
  AdjustForFullTile(iMapIndex);

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_LAND);
  return true;
}

// Struct layer
// #################################################################

export function AddStructToTail(iMapIndex: UINT32, usIndex: UINT16): LEVELNODE | null {
  return AddStructToTailCommon(iMapIndex, usIndex, true);
}

export function ForceStructToTail(iMapIndex: UINT32, usIndex: UINT16): LEVELNODE | null {
  return AddStructToTailCommon(iMapIndex, usIndex, false);
}

export function AddStructToTailCommon(iMapIndex: UINT32, usIndex: UINT16, fAddStructDBInfo: boolean): LEVELNODE | null {
  let pStruct: LEVELNODE | null = null;
  let pTailStruct: LEVELNODE = <LEVELNODE><unknown>null;
  let pNextStruct: LEVELNODE;
  let pDBStructure: DB_STRUCTURE;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Do we have an empty list?
  if (pStruct == null) {
    pNextStruct = CreateLevelNode();

    if (fAddStructDBInfo) {
      if (usIndex < Enum312.NUMBEROFTILES) {
        if (gTileDatabase[usIndex].pDBStructureRef != null) {
          if (AddStructureToWorld(iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == false) {
            guiLevelNodes--;
            return null;
          }
        } else {
          //				 pNextStruct->pStructureData = NULL;
        }
      }
    }

    pNextStruct.usIndex = usIndex;

    pNextStruct.pNext = null;

    gpWorldLevelData[iMapIndex].pStructHead = pNextStruct;
  } else {
    // MOVE TO TAIL
    while (pStruct != null) {
      pTailStruct = pStruct;
      pStruct = pStruct.pNext;
    }

    pNextStruct = CreateLevelNode();

    if (fAddStructDBInfo) {
      if (usIndex < Enum312.NUMBEROFTILES) {
        if (gTileDatabase[usIndex].pDBStructureRef != null) {
          if (AddStructureToWorld(iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == false) {
            guiLevelNodes--;
            return null;
          } else {
            //					pNextStruct->pStructureData = NULL;
          }
        }
      }
    }
    pNextStruct.usIndex = usIndex;

    pNextStruct.pNext = null;
    pTailStruct.pNext = pNextStruct;
  }

  // Check flags for tiledat and set a shadow if we have a buddy
  if (usIndex < Enum312.NUMBEROFTILES) {
    if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
      AddShadowToHead(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
      (<LEVELNODE>gpWorldLevelData[iMapIndex].pShadowHead).uiFlags |= LEVELNODE_BUDDYSHADOW;
    }

    // Check for special flag to stop burn-through on same-tile structs...
    if (gTileDatabase[usIndex].pDBStructureRef != null) {
      pDBStructure = (<DB_STRUCTURE_REF>gTileDatabase[usIndex].pDBStructureRef).pDBStructure;

      // Default to off....
      gpWorldLevelData[iMapIndex].ubExtFlags[0] &= (~MAPELEMENT_EXT_NOBURN_STRUCT);

      // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
      if (!FindStructure(iMapIndex, STRUCTURE_WALLSTUFF) && pDBStructure.ubNumberOfTiles == 1) {
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

export function AddStructToHead(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pStruct: LEVELNODE | null = null;
  let pNextStruct: LEVELNODE;
  let pDBStructure: DB_STRUCTURE;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  pNextStruct = CreateLevelNode();

  if (usIndex < Enum312.NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != null) {
      if (AddStructureToWorld(iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == false) {
        guiLevelNodes--;
        return false;
      }
    }
  }

  pNextStruct.pNext = pStruct;
  pNextStruct.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pStructHead = pNextStruct;

  SetWorldFlagsFromNewNode(iMapIndex, pNextStruct.usIndex);

  if (usIndex < Enum312.NUMBEROFTILES) {
    // Check flags for tiledat and set a shadow if we have a buddy
    if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
      AddShadowToHead(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
      (<LEVELNODE>gpWorldLevelData[iMapIndex].pShadowHead).uiFlags |= LEVELNODE_BUDDYSHADOW;
    }

    // Check for special flag to stop burn-through on same-tile structs...
    if (gTileDatabase[usIndex].pDBStructureRef != null) {
      pDBStructure = (<DB_STRUCTURE_REF>gTileDatabase[usIndex].pDBStructureRef).pDBStructure;

      // Default to off....
      gpWorldLevelData[iMapIndex].ubExtFlags[0] &= (~MAPELEMENT_EXT_NOBURN_STRUCT);

      // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
      if (!!FindStructure(iMapIndex, STRUCTURE_WALLSTUFF) && pDBStructure.ubNumberOfTiles == 1) {
        // Set flag...
        gpWorldLevelData[iMapIndex].ubExtFlags[0] |= MAPELEMENT_EXT_NOBURN_STRUCT;
      }
    }
  }

  // Add the structure the maps temp file
  AddStructToMapTempFile(iMapIndex, usIndex);

  // CheckForAndAddTileCacheStructInfo( pNextStruct, (INT16)iMapIndex, usIndex );

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);
  return true;
}

function InsertStructIndex(iMapIndex: UINT32, usIndex: UINT16, ubLevel: UINT8): boolean {
  let pStruct: LEVELNODE | null;
  let pNextStruct: LEVELNODE;
  let level: UINT8 = 0;
  let CanInsert: boolean = false;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // If we want to insert at head;
  if (ubLevel == 0) {
    return AddStructToHead(iMapIndex, usIndex);
  }

  // Allocate memory for new item
  pNextStruct = CreateLevelNode();

  pNextStruct.usIndex = usIndex;

  // Move to index before insertion
  while (pStruct != null) {
    if (level == (ubLevel - 1)) {
      CanInsert = true;
      break;
    }

    pStruct = pStruct.pNext;
    level++;
  }

  // Check if level has been macthed
  if (!CanInsert) {
    guiLevelNodes--;
    return false;
  }

  if (usIndex < Enum312.NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != null) {
      if (AddStructureToWorld(iMapIndex, 0, gTileDatabase[usIndex].pDBStructureRef, pNextStruct) == false) {
        guiLevelNodes--;
        return false;
      }
    }
  }

  // Set links, according to position!
  pNextStruct.pNext = (<LEVELNODE>pStruct).pNext;
  (<LEVELNODE>pStruct).pNext = pNextStruct;

  // CheckForAndAddTileCacheStructInfo( pNextStruct, (INT16)iMapIndex, usIndex );

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_STRUCTURES);
  return true;
}

function RemoveStructFromTail(iMapIndex: UINT32): boolean {
  return RemoveStructFromTailCommon(iMapIndex, true);
}

export function ForceRemoveStructFromTail(iMapIndex: UINT32): boolean {
  return RemoveStructFromTailCommon(iMapIndex, false);
}

function RemoveStructFromTailCommon(iMapIndex: UINT32, fRemoveStructDBInfo: boolean): boolean {
  let pStruct: LEVELNODE | null = null;
  let pPrevStruct: LEVELNODE | null = null;
  let usIndex: UINT16;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // GOTO TAIL
  while (pStruct != null) {
    // AT THE TAIL
    if (pStruct.pNext == null) {
      if (pPrevStruct != null) {
        pPrevStruct.pNext = pStruct.pNext;
      } else
        gpWorldLevelData[iMapIndex].pStructHead = pPrevStruct;

      if (fRemoveStructDBInfo) {
        // Check for special flag to stop burn-through on same-tile structs...
        if (pStruct.pStructureData != null) {
          // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
          // if ( !( pStruct->pStructureData->fFlags & STRUCTURE_WALLSTUFF ) && pStruct->pStructureData->pDBStructureRef->pDBStructure->ubNumberOfTiles == 1 )
          //{
          // UNSet flag...
          //	gpWorldLevelData[ iMapIndex ].ubExtFlags[0] &= ( ~MAPELEMENT_EXT_NOBURN_STRUCT );
          //}
        }

        DeleteStructureFromWorld(pStruct.pStructureData);
      }

      usIndex = pStruct.usIndex;

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      guiLevelNodes--;

      if (usIndex < Enum312.NUMBEROFTILES) {
        // Check flags for tiledat and set a shadow if we have a buddy
        if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
          RemoveShadow(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
        }
      }
      return true;
    }

    pPrevStruct = pStruct;
    pStruct = pStruct.pNext;
  }

  return true;
}

export function RemoveStruct(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pStruct: LEVELNODE | null = null;
  let pOldStruct: LEVELNODE | null = null;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and remove index if found

  while (pStruct != null) {
    if (pStruct.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldStruct == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pStructHead = pStruct.pNext;
      } else {
        pOldStruct.pNext = pStruct.pNext;
      }

      // Check for special flag to stop burn-through on same-tile structs...
      if (pStruct.pStructureData != null) {
        // If we are NOT a wall and NOT multi-tiles, set mapelement flag...
        // if ( !( pStruct->pStructureData->fFlags & STRUCTURE_WALLSTUFF ) && pStruct->pStructureData->pDBStructureRef->pDBStructure->ubNumberOfTiles == 1 )
        //{
        // UNSet flag...
        //	gpWorldLevelData[ iMapIndex ].ubExtFlags[0] &= ( ~MAPELEMENT_EXT_NOBURN_STRUCT );
        //}
      }

      // Delete memory assosiated with item
      DeleteStructureFromWorld(pStruct.pStructureData);

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      if (usIndex < Enum312.NUMBEROFTILES) {
        // Check flags for tiledat and set a shadow if we have a buddy
        if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
          RemoveShadow(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
        }
      }
      guiLevelNodes--;

      return true;
    }

    pOldStruct = pStruct;
    pStruct = pStruct.pNext;
  }

  // Could not find it, return FALSE
  RemoveWorldFlagsFromNewNode(iMapIndex, usIndex);

  return false;
}

export function RemoveStructFromLevelNode(iMapIndex: UINT32, pNode: LEVELNODE): boolean {
  let pStruct: LEVELNODE | null = null;
  let pOldStruct: LEVELNODE | null = null;
  let usIndex: UINT16;

  usIndex = pNode.usIndex;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and remove index if found

  while (pStruct != null) {
    if (pStruct == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldStruct == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pStructHead = pStruct.pNext;
      } else {
        pOldStruct.pNext = pStruct.pNext;
      }

      // Delete memory assosiated with item
      DeleteStructureFromWorld(pStruct.pStructureData);

      // If we have to, make sure to remove this node when we reload the map from a saved game
      RemoveStructFromMapTempFile(iMapIndex, usIndex);

      if (pNode.usIndex < Enum312.NUMBEROFTILES) {
        // Check flags for tiledat and set a shadow if we have a buddy
        if (!GridNoIndoors(iMapIndex) && gTileDatabase[usIndex].uiFlags & HAS_SHADOW_BUDDY && gTileDatabase[usIndex].sBuddyNum != -1) {
          RemoveShadow(iMapIndex, gTileDatabase[usIndex].sBuddyNum);
        }
      }

      guiLevelNodes--;

      return true;
    }

    pOldStruct = pStruct;
    pStruct = pStruct.pNext;
  }

  // Could not find it, return FALSE
  RemoveWorldFlagsFromNewNode(iMapIndex, usIndex);

  return false;
}

export function RemoveAllStructsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): boolean {
  let pStruct: LEVELNODE | null = null;
  let pOldStruct: LEVELNODE;
  let fTileType: UINT32;
  let usIndex: UINT16;
  let fRetVal: boolean = false;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != null) {
    if (pStruct.usIndex != NO_TILE) {
      fTileType = GetTileType(pStruct.usIndex);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        usIndex = pOldStruct.usIndex;

        // Remove Item
        if (usIndex < Enum312.NUMBEROFTILES) {
          RemoveStruct(iMapIndex, pOldStruct.usIndex);
          fRetVal = true;
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
export function ReplaceStructIndex(iMapIndex: UINT32, usOldIndex: UINT16, usNewIndex: UINT16): boolean {
  RemoveStruct(iMapIndex, usOldIndex);
  AddWallToStructLayer(iMapIndex, usNewIndex, false);
  return true;
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
export function AddWallToStructLayer(iMapIndex: INT32, usIndex: UINT16, fReplace: boolean): boolean {
  let pStruct: LEVELNODE | null = null;
  let usCheckWallOrient: UINT16;
  let usWallOrientation: UINT16;
  let fInsertFound: boolean = false;
  let fRoofFound: boolean = false;
  let ubRoofLevel: UINT8 = 0;
  let uiCheckType: UINT32;
  let ubLevel: UINT8 = 0;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Get orientation of peice we want to add
  usWallOrientation = GetWallOrientation(usIndex);

  // Look through all objects and Search for orientation
  while (pStruct != null) {
    usCheckWallOrient = GetWallOrientation(pStruct.usIndex);
    // OLD CASE
    // if ( usCheckWallOrient > usWallOrientation )
    // Kris:
    // New case -- If placing a new wall which is at right angles to the current wall, then
    // we insert it.
    if (usCheckWallOrient > usWallOrientation) {
      if ((usWallOrientation == Enum314.INSIDE_TOP_RIGHT || usWallOrientation == Enum314.OUTSIDE_TOP_RIGHT) && (usCheckWallOrient == Enum314.INSIDE_TOP_LEFT || usCheckWallOrient == Enum314.OUTSIDE_TOP_LEFT) || (usWallOrientation == Enum314.INSIDE_TOP_LEFT || usWallOrientation == Enum314.OUTSIDE_TOP_LEFT) && (usCheckWallOrient == Enum314.INSIDE_TOP_RIGHT || usCheckWallOrient == Enum314.OUTSIDE_TOP_RIGHT)) {
        fInsertFound = true;
      }
    }

    uiCheckType = GetTileType(pStruct.usIndex);

    //		if ( uiCheckType >= FIRSTFLOOR && uiCheckType <= LASTFLOOR )
    if (uiCheckType >= Enum313.FIRSTROOF && uiCheckType <= LASTROOF) {
      fRoofFound = true;
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
        return ReplaceStructIndex(iMapIndex, pStruct.usIndex, usIndex);
      } else {
        return false;
      }
    }

    // Advance to next
    pStruct = pStruct.pNext;

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
  return true;
}

export function TypeExistsInStructLayer(iMapIndex: UINT32, fType: UINT32): UINT16 {
  let pStruct: LEVELNODE | null = null;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  return TypeExistsInLevel(pStruct, fType);
}

function SetAllStructShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pStruct: LEVELNODE | null = null;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  SetLevelShadeLevel(pStruct, ubShadeLevel);
}

function AdjustAllStructShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pStruct: LEVELNODE | null = null;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  AdjustLevelShadeLevel(pStruct, bShadeDiff);
}

function SetStructIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  let pStruct: LEVELNODE | null = null;
  let pOldStruct: LEVELNODE;
  let fTileType: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != null) {
    if (pStruct.usIndex != NO_TILE) {
      fTileType = GetTileType(pStruct.usIndex);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldStruct.uiFlags |= uiFlags;
      }
    }
  }
}

export function HideStructOfGivenType(iMapIndex: UINT32, fType: UINT32, fHide: boolean): boolean {
  if (fHide) {
    SetRoofIndexFlagsFromTypeRange(iMapIndex, fType, fType, LEVELNODE_HIDDEN);
  } else {
    // ONLY UNHIDE IF NOT REAVEALED ALREADY
    if (!(gpWorldLevelData[iMapIndex].uiFlags & MAPELEMENT_REVEALED)) {
      RemoveRoofIndexFlagsFromTypeRange(iMapIndex, fType, fType, LEVELNODE_HIDDEN);
    }
  }
  return true;
}

function RemoveStructIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  let pStruct: LEVELNODE | null = null;
  let pOldStruct: LEVELNODE;
  let fTileType: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pStructHead;

  // Look through all structs and Search for type

  while (pStruct != null) {
    if (pStruct.usIndex != NO_TILE) {
      fTileType = GetTileType(pStruct.usIndex);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldStruct.uiFlags &= (~uiFlags);
      }
    }
  }
}

// Shadow layer
// #################################################################

export function AddShadowToTail(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pShadow: LEVELNODE | null = null;
  let pNextShadow: LEVELNODE;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // If we're at the head, set here
  if (pShadow == null) {
    pShadow = CreateLevelNode();
    pShadow.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pShadowHead = pShadow;
  } else {
    while (pShadow != null) {
      if (pShadow.pNext == null) {
        pNextShadow = CreateLevelNode();
        pShadow.pNext = pNextShadow;
        pNextShadow.pNext = null;
        pNextShadow.usIndex = usIndex;
        break;
      }

      pShadow = pShadow.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_SHADOWS);
  return true;
}

// Kris:  identical shadows can exist in the same gridno, though it makes no sense
//		because it actually renders the shadows darker than the others.  This is an
//	  undesirable effect with walls and buildings so I added this function to make
//		sure there isn't already a shadow before placing it.
export function AddExclusiveShadow(iMapIndex: UINT32, usIndex: UINT16): void {
  let pShadow: LEVELNODE | null;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;
  while (pShadow) {
    if (pShadow.usIndex == usIndex)
      return;
    pShadow = pShadow.pNext;
  }
  AddShadowToHead(iMapIndex, usIndex);
}

export function AddShadowToHead(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pShadow: LEVELNODE | null;
  let pNextShadow: LEVELNODE;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Allocate head
  pNextShadow = CreateLevelNode();
  pNextShadow.pNext = pShadow;
  pNextShadow.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pShadowHead = pNextShadow;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_SHADOWS);
  return true;
}

function RemoveShadow(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pShadow: LEVELNODE | null = null;
  let pOldShadow: LEVELNODE | null = null;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != null) {
    if (pShadow.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow.pNext;
      } else {
        pOldShadow.pNext = pShadow.pNext;
      }

      // Delete memory assosiated with item
      guiLevelNodes--;

      return true;
    }

    pOldShadow = pShadow;
    pShadow = pShadow.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

export function RemoveShadowFromLevelNode(iMapIndex: UINT32, pNode: LEVELNODE): boolean {
  let pShadow: LEVELNODE | null = null;
  let pOldShadow: LEVELNODE | null = null;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != null) {
    if (pShadow == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow.pNext;
      } else {
        pOldShadow.pNext = pShadow.pNext;
      }

      // Delete memory assosiated with item
      guiLevelNodes--;

      return true;
    }

    pOldShadow = pShadow;
    pShadow = pShadow.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

function RemoveStructShadowPartner(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pShadow: LEVELNODE | null = null;
  let pOldShadow: LEVELNODE | null = null;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and remove index if found

  while (pShadow != null) {
    if (pShadow.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldShadow == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pShadowHead = pShadow.pNext;
      } else {
        pOldShadow.pNext = pShadow.pNext;
      }

      // Delete memory assosiated with item
      guiLevelNodes--;

      return true;
    }

    pOldShadow = pShadow;
    pShadow = pShadow.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

export function RemoveAllShadowsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): boolean {
  let pShadow: LEVELNODE | null = null;
  let pOldShadow: LEVELNODE;
  let fTileType: UINT32;
  let fRetVal: boolean = false;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and Search for type

  while (pShadow != null) {
    if (pShadow.usIndex != NO_TILE) {
      fTileType = GetTileType(pShadow.usIndex);

      // Advance to next
      pOldShadow = pShadow;
      pShadow = pShadow.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveShadow(iMapIndex, pOldShadow.usIndex);
        fRetVal = true;
      }
    }
  }
  return fRetVal;
}

export function RemoveAllShadows(iMapIndex: UINT32): boolean {
  let pShadow: LEVELNODE | null = null;
  let pOldShadow: LEVELNODE;
  let fRetVal: boolean = false;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Look through all shadows and Search for type

  while (pShadow != null) {
    if (pShadow.usIndex != NO_TILE) {
      // Advance to next
      pOldShadow = pShadow;
      pShadow = pShadow.pNext;

      // Remove Item
      RemoveShadow(iMapIndex, pOldShadow.usIndex);
      fRetVal = true;
    }
  }
  return fRetVal;
}

export function TypeExistsInShadowLayer(iMapIndex: UINT32, fType: UINT32): UINT16 {
  let pShadow: LEVELNODE | null = null;

  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  return TypeExistsInLevel(pShadow, fType);
}

// Merc layer
// #################################################################

export function AddMercToHead(iMapIndex: UINT32, pSoldier: SOLDIERTYPE, fAddStructInfo: boolean): boolean {
  let pMerc: LEVELNODE | null = null;
  let pNextMerc: LEVELNODE;

  pMerc = gpWorldLevelData[iMapIndex].pMercHead;

  // Allocate head
  pNextMerc = CreateLevelNode();
  pNextMerc.pNext = pMerc;
  pNextMerc.pSoldier = pSoldier;
  pNextMerc.uiFlags |= LEVELNODE_SOLDIER;

  // Add structure info if we want
  if (fAddStructInfo) {
    // Set soldier's levelnode
    pSoldier.pLevelNode = pNextMerc;

    AddMercStructureInfo(iMapIndex, pSoldier);
  }

  // Set head
  gpWorldLevelData[iMapIndex].pMercHead = pNextMerc;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_MERCS | TILES_DYNAMIC_STRUCT_MERCS | TILES_DYNAMIC_HIGHMERCS);
  return true;
}

function AddMercStructureInfo(sGridNo: INT16, pSoldier: SOLDIERTYPE): boolean {
  let usAnimSurface: UINT16;

  // Get surface data
  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);

  AddMercStructureInfoFromAnimSurface(sGridNo, pSoldier, usAnimSurface, pSoldier.usAnimState);

  return true;
}

export function AddMercStructureInfoFromAnimSurface(sGridNo: INT16, pSoldier: SOLDIERTYPE, usAnimSurface: UINT16, usAnimState: UINT16): boolean {
  let pStructureFileRef: STRUCTURE_FILE_REF | null;
  let fReturn: boolean;

  // Turn off multi tile flag...
  pSoldier.uiStatusFlags &= (~SOLDIER_MULTITILE);

  if (pSoldier.pLevelNode == null) {
    return false;
  }

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    return false;
  }

  // Remove existing structs
  DeleteStructureFromWorld(pSoldier.pLevelNode.pStructureData);
  pSoldier.pLevelNode.pStructureData = null;

  pStructureFileRef = GetAnimationStructureRef(pSoldier.ubID, usAnimSurface, usAnimState);

  // Now check if we are multi-tiled!
  if (pStructureFileRef != null) {
    if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
      // Queen uses onely one direction....
      fReturn = AddStructureToWorld(sGridNo, pSoldier.bLevel, pStructureFileRef.pDBStructureRef[0], pSoldier.pLevelNode);
    } else {
      fReturn = AddStructureToWorld(sGridNo, pSoldier.bLevel, pStructureFileRef.pDBStructureRef[gOneCDirection[pSoldier.bDirection]], pSoldier.pLevelNode);
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

    if (fReturn == false) {
      // Debug msg
      ScreenMsg(MSG_FONT_RED, MSG_DEBUG, "FAILED: add struct info for merc %d (%s), at %d direction %d", pSoldier.ubID, pSoldier.name, sGridNo, pSoldier.bDirection);

      if (pStructureFileRef.pDBStructureRef[gOneCDirection[pSoldier.bDirection]].pDBStructure.ubNumberOfTiles > 1) {
        // If we have more than one tile
        pSoldier.uiStatusFlags |= SOLDIER_MULTITILE_Z;
      }

      return false;
    } else {
      // Turn on if we are multi-tiled
      if ((<STRUCTURE><unknown>pSoldier.pLevelNode.pStructureData).pDBStructureRef.pDBStructure.ubNumberOfTiles > 1) {
        // If we have more than one tile
        pSoldier.uiStatusFlags |= SOLDIER_MULTITILE_Z;
      } else {
        // pSoldier->uiStatusFlags |= SOLDIER_MULTITILE_NZ;
      }
    }
  }

  return true;
}

export function OKToAddMercToWorld(pSoldier: SOLDIERTYPE, bDirection: INT8): boolean {
  let usAnimSurface: UINT16;
  let pStructFileRef: STRUCTURE_FILE_REF | null;
  let usOKToAddStructID: UINT16;

  // if ( pSoldier->uiStatusFlags & SOLDIER_MULTITILE )
  {
    // Get surface data
    usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.usAnimState);
    if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
      return false;
    }

    pStructFileRef = GetAnimationStructureRef(pSoldier.ubID, usAnimSurface, pSoldier.usAnimState);

    // Now check if we have multi-tile info!
    if (pStructFileRef != null) {
      // Try adding struct to this location, if we can it's good!
      if (pSoldier.pLevelNode && pSoldier.pLevelNode.pStructureData != null) {
        usOKToAddStructID = pSoldier.pLevelNode.pStructureData.usStructureID;
      } else {
        usOKToAddStructID = INVALID_STRUCTURE_ID;
      }

      if (!OkayToAddStructureToWorld(pSoldier.sGridNo, pSoldier.bLevel, pStructFileRef.pDBStructureRef[gOneCDirection[bDirection]], usOKToAddStructID)) {
        return false;
      }
    }
  }

  return true;
}

export function UpdateMercStructureInfo(pSoldier: SOLDIERTYPE): boolean {
  // Remove strucute info!
  if (pSoldier.pLevelNode == null) {
    return false;
  }

  // DeleteStructureFromWorld( pSoldier->pLevelNode->pStructureData );

  // Add new one!
  return AddMercStructureInfo(pSoldier.sGridNo, pSoldier);
}

export function RemoveMerc(iMapIndex: UINT32, pSoldier: SOLDIERTYPE, fPlaceHolder: boolean): boolean {
  let pMerc: LEVELNODE | null = null;
  let pOldMerc: LEVELNODE | null = null;
  let fMercFound: boolean;

  if (iMapIndex == NOWHERE) {
    return false;
  }

  pMerc = gpWorldLevelData[iMapIndex].pMercHead;

  // Look through all mercs and remove index if found

  while (pMerc != null) {
    fMercFound = false;

    if (pMerc.pSoldier == pSoldier) {
      // If it's a placeholder, check!
      if (fPlaceHolder) {
        if ((pMerc.uiFlags & LEVELNODE_MERCPLACEHOLDER)) {
          fMercFound = true;
        }
      } else {
        if (!(pMerc.uiFlags & LEVELNODE_MERCPLACEHOLDER)) {
          fMercFound = true;
        }
      }

      if (fMercFound) {
        // OK, set links
        // Check for head or tail
        if (pOldMerc == null) {
          // It's the head
          gpWorldLevelData[iMapIndex].pMercHead = pMerc.pNext;
        } else {
          pOldMerc.pNext = pMerc.pNext;
        }

        if (!fPlaceHolder) {
          // Set level node to NULL
          pSoldier.pLevelNode = null;

          // Remove strucute info!
          DeleteStructureFromWorld(pMerc.pStructureData);
        }

        // Delete memory assosiated with item
        guiLevelNodes--;

        return true;
      }
    }

    pOldMerc = pMerc;
    pMerc = pMerc.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

// Roof layer
// #################################################################

export function AddRoofToTail(iMapIndex: UINT32, usIndex: UINT16): LEVELNODE | null {
  let pRoof: LEVELNODE | null = null;
  let pNextRoof: LEVELNODE = <LEVELNODE><unknown>null;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // If we're at the head, set here
  if (pRoof == null) {
    pRoof = CreateLevelNode();

    if (usIndex < Enum312.NUMBEROFTILES) {
      if (gTileDatabase[usIndex].pDBStructureRef != null) {
        if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pRoof) == false) {
          guiLevelNodes--;
          return null;
        }
      }
    }
    pRoof.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pRoofHead = pRoof;

    pNextRoof = pRoof;
  } else {
    while (pRoof != null) {
      if (pRoof.pNext == null) {
        pNextRoof = CreateLevelNode();

        if (usIndex < Enum312.NUMBEROFTILES) {
          if (gTileDatabase[usIndex].pDBStructureRef != null) {
            if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextRoof) == false) {
              guiLevelNodes--;
              return null;
            }
          }
        }
        pRoof.pNext = pNextRoof;

        pNextRoof.pNext = null;
        pNextRoof.usIndex = usIndex;

        break;
      }

      pRoof = pRoof.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ROOF);

  return pNextRoof;
}

export function AddRoofToHead(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pRoof: LEVELNODE | null = null;
  let pNextRoof: LEVELNODE;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  pNextRoof = CreateLevelNode();

  if (usIndex < Enum312.NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != null) {
      if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextRoof) == false) {
        guiLevelNodes--;
        return false;
      }
    }
  }

  pNextRoof.pNext = pRoof;
  pNextRoof.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pRoofHead = pNextRoof;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ROOF);
  return true;
}

export function RemoveRoof(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pRoof: LEVELNODE | null = null;
  let pOldRoof: LEVELNODE | null = null;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and remove index if found

  while (pRoof != null) {
    if (pRoof.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldRoof == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pRoofHead = pRoof.pNext;
      } else {
        pOldRoof.pNext = pRoof.pNext;
      }
      // Delete memory assosiated with item
      DeleteStructureFromWorld(pRoof.pStructureData);
      guiLevelNodes--;

      return true;
    }

    pOldRoof = pRoof;
    pRoof = pRoof.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

export function TypeExistsInRoofLayer(iMapIndex: UINT32, fType: UINT32): UINT16 {
  let pRoof: LEVELNODE | null = null;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  return TypeExistsInLevel(pRoof, fType);
}

export function TypeRangeExistsInRoofLayer(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): UINT16 {
  let pRoof: LEVELNODE | null = null;
  let pOldRoof: LEVELNODE;
  let fTileType: UINT32;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all objects and Search for type

  while (pRoof != null) {
    if (pRoof.usIndex != NO_TILE) {
      fTileType = GetTileType(pRoof.usIndex);

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        return pOldRoof.usIndex;
      }
    }
  }

  // Could not find it, return FALSE

  return -1;
}

export function IndexExistsInRoofLayer(sGridNo: INT16, usIndex: UINT16): boolean {
  let pRoof: LEVELNODE | null = null;
  let pOldRoof: LEVELNODE | null = null;

  pRoof = gpWorldLevelData[sGridNo].pRoofHead;

  // Look through all objects and Search for type

  while (pRoof != null) {
    if (pRoof.usIndex == usIndex) {
      return true;
    }

    pRoof = pRoof.pNext;
  }

  // Could not find it, return FALSE
  return false;
}

function SetAllRoofShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pRoof: LEVELNODE | null = null;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  SetLevelShadeLevel(pRoof, ubShadeLevel);
}

function AdjustAllRoofShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pRoof: LEVELNODE | null = null;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  AdjustLevelShadeLevel(pRoof, bShadeDiff);
}

export function RemoveAllRoofsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): boolean {
  let pRoof: LEVELNODE | null = null;
  let pOldRoof: LEVELNODE;
  let fTileType: UINT32;
  let fRetVal: boolean = false;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != null) {
    if (pRoof.usIndex != NO_TILE) {
      fTileType = GetTileType(pRoof.usIndex);

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveRoof(iMapIndex, pOldRoof.usIndex);
        fRetVal = true;
      }
    }
  }

  // Could not find it, return FALSE

  return fRetVal;
}

export function RemoveRoofIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  let pRoof: LEVELNODE | null = null;
  let pOldRoof: LEVELNODE;
  let fTileType: UINT32;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != null) {
    if (pRoof.usIndex != NO_TILE) {
      fTileType = GetTileType(pRoof.usIndex);

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldRoof.uiFlags &= (~uiFlags);
      }
    }
  }
}

export function SetRoofIndexFlagsFromTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32, uiFlags: UINT32): void {
  let pRoof: LEVELNODE | null = null;
  let pOldRoof: LEVELNODE;
  let fTileType: UINT32;

  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type

  while (pRoof != null) {
    if (pRoof.usIndex != NO_TILE) {
      fTileType = GetTileType(pRoof.usIndex);

      // Advance to next
      pOldRoof = pRoof;
      pRoof = pRoof.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        pOldRoof.uiFlags |= uiFlags;
      }
    }
  }
}

// OnRoof layer
// #################################################################

export function AddOnRoofToTail(iMapIndex: UINT32, usIndex: UINT16): LEVELNODE | null {
  let pOnRoof: LEVELNODE | null = null;
  let pNextOnRoof: LEVELNODE = <LEVELNODE><unknown>null;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // If we're at the head, set here
  if (pOnRoof == null) {
    pOnRoof = CreateLevelNode();

    if (usIndex < Enum312.NUMBEROFTILES) {
      if (gTileDatabase[usIndex].pDBStructureRef != null) {
        if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pOnRoof) == false) {
          guiLevelNodes--;
          return null;
        }
      }
    }
    pOnRoof.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof;

    ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
    return pOnRoof;
  } else {
    while (pOnRoof != null) {
      if (pOnRoof.pNext == null) {
        pNextOnRoof = CreateLevelNode();

        if (usIndex < Enum312.NUMBEROFTILES) {
          if (gTileDatabase[usIndex].pDBStructureRef != null) {
            if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextOnRoof) == false) {
              guiLevelNodes--;
              return null;
            }
          }
        }

        pOnRoof.pNext = pNextOnRoof;

        pNextOnRoof.pNext = null;
        pNextOnRoof.usIndex = usIndex;
        break;
      }

      pOnRoof = pOnRoof.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
  return pNextOnRoof;
}

export function AddOnRoofToHead(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pOnRoof: LEVELNODE | null = null;
  let pNextOnRoof: LEVELNODE;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  pNextOnRoof = CreateLevelNode();
  if (usIndex < Enum312.NUMBEROFTILES) {
    if (gTileDatabase[usIndex].pDBStructureRef != null) {
      if (AddStructureToWorld(iMapIndex, 1, gTileDatabase[usIndex].pDBStructureRef, pNextOnRoof) == false) {
        guiLevelNodes--;
        return false;
      }
    }
  }

  pNextOnRoof.pNext = pOnRoof;
  pNextOnRoof.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pOnRoofHead = pNextOnRoof;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_ONROOF);
  return true;
}

export function RemoveOnRoof(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pOnRoof: LEVELNODE | null = null;
  let pOldOnRoof: LEVELNODE | null = null;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and remove index if found

  while (pOnRoof != null) {
    if (pOnRoof.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldOnRoof == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof.pNext;
      } else {
        pOldOnRoof.pNext = pOnRoof.pNext;
      }

      // REMOVE ONROOF!
      guiLevelNodes--;

      return true;
    }

    pOldOnRoof = pOnRoof;
    pOnRoof = pOnRoof.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

export function RemoveOnRoofFromLevelNode(iMapIndex: UINT32, pNode: LEVELNODE): boolean {
  let pOnRoof: LEVELNODE | null = null;
  let pOldOnRoof: LEVELNODE | null = null;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and remove index if found

  while (pOnRoof != null) {
    if (pOnRoof == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldOnRoof == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pOnRoofHead = pOnRoof.pNext;
      } else {
        pOldOnRoof.pNext = pOnRoof.pNext;
      }

      // REMOVE ONROOF!
      guiLevelNodes--;

      return true;
    }

    pOldOnRoof = pOnRoof;
    pOnRoof = pOnRoof.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

function TypeExistsInOnRoofLayer(iMapIndex: UINT32, fType: UINT32): UINT16 {
  let pOnRoof: LEVELNODE | null = null;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  return TypeExistsInLevel(pOnRoof, fType);
}

function SetAllOnRoofShadeLevels(iMapIndex: UINT32, ubShadeLevel: UINT8): void {
  let pOnRoof: LEVELNODE | null = null;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  SetLevelShadeLevel(pOnRoof, ubShadeLevel);
}

function AdjustAllOnRoofShadeLevels(iMapIndex: UINT32, bShadeDiff: INT8): void {
  let pOnRoof: LEVELNODE | null = null;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  AdjustLevelShadeLevel(pOnRoof, bShadeDiff);
}

export function RemoveAllOnRoofsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): boolean {
  let pOnRoof: LEVELNODE | null = null;
  let pOldOnRoof: LEVELNODE;
  let fTileType: UINT32;
  let fRetVal: boolean = false;

  pOnRoof = gpWorldLevelData[iMapIndex].pOnRoofHead;

  // Look through all OnRoofs and Search for type

  while (pOnRoof != null) {
    if (pOnRoof.usIndex != NO_TILE) {
      fTileType = GetTileType(pOnRoof.usIndex);

      // Advance to next
      pOldOnRoof = pOnRoof;
      pOnRoof = pOnRoof.pNext;

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveOnRoof(iMapIndex, pOldOnRoof.usIndex);
        fRetVal = true;
      }
    }
  }
  return fRetVal;
}

// Topmost layer
// #################################################################

export function AddTopmostToTail(iMapIndex: UINT32, usIndex: UINT16): LEVELNODE {
  let pTopmost: LEVELNODE | null = null;
  let pNextTopmost: LEVELNODE = <LEVELNODE><unknown>null;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // If we're at the head, set here
  if (pTopmost == null) {
    pNextTopmost = CreateLevelNode();
    pNextTopmost.usIndex = usIndex;

    gpWorldLevelData[iMapIndex].pTopmostHead = pNextTopmost;
  } else {
    while (pTopmost != null) {
      if (pTopmost.pNext == null) {
        pNextTopmost = CreateLevelNode();
        pTopmost.pNext = pNextTopmost;
        pNextTopmost.pNext = null;
        pNextTopmost.usIndex = usIndex;

        break;
      }

      pTopmost = pTopmost.pNext;
    }
  }

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return pNextTopmost;
}

export function AddUIElem(iMapIndex: UINT32, usIndex: UINT16, sRelativeX: INT8, sRelativeY: INT8): LEVELNODE {
  let pTopmost: LEVELNODE;

  pTopmost = AddTopmostToTail(iMapIndex, usIndex);

  // Set flags
  pTopmost.uiFlags |= LEVELNODE_USERELPOS;
  pTopmost.sRelativeX = sRelativeX;
  pTopmost.sRelativeY = sRelativeY;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return pTopmost;
}

function RemoveUIElem(iMapIndex: UINT32, usIndex: UINT16): void {
  RemoveTopmost(iMapIndex, usIndex);
}

export function AddTopmostToHead(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pTopmost: LEVELNODE | null;
  let pNextTopmost: LEVELNODE;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Allocate head
  pNextTopmost = CreateLevelNode();
  pNextTopmost.pNext = pTopmost;
  pNextTopmost.usIndex = usIndex;

  // Set head
  gpWorldLevelData[iMapIndex].pTopmostHead = pNextTopmost;

  ResetSpecificLayerOptimizing(TILES_DYNAMIC_TOPMOST);
  return true;
}

export function RemoveTopmost(iMapIndex: UINT32, usIndex: UINT16): boolean {
  let pTopmost: LEVELNODE | null = null;
  let pOldTopmost: LEVELNODE | null = null;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and remove index if found

  while (pTopmost != null) {
    if (pTopmost.usIndex == usIndex) {
      // OK, set links
      // Check for head or tail
      if (pOldTopmost == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pTopmostHead = pTopmost.pNext;
      } else {
        pOldTopmost.pNext = pTopmost.pNext;
      }

      // Delete memory assosiated with item
      guiLevelNodes--;

      return true;
    }

    pOldTopmost = pTopmost;
    pTopmost = pTopmost.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

export function RemoveTopmostFromLevelNode(iMapIndex: UINT32, pNode: LEVELNODE): boolean {
  let pTopmost: LEVELNODE | null = null;
  let pOldTopmost: LEVELNODE | null = null;
  let usIndex: UINT16;

  usIndex = pNode.usIndex;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and remove index if found

  while (pTopmost != null) {
    if (pTopmost == pNode) {
      // OK, set links
      // Check for head or tail
      if (pOldTopmost == null) {
        // It's the head
        gpWorldLevelData[iMapIndex].pTopmostHead = pTopmost.pNext;
      } else {
        pOldTopmost.pNext = pTopmost.pNext;
      }

      // Delete memory assosiated with item
      guiLevelNodes--;

      return true;
    }

    pOldTopmost = pTopmost;
    pTopmost = pTopmost.pNext;
  }

  // Could not find it, return FALSE

  return false;
}

export function RemoveAllTopmostsOfTypeRange(iMapIndex: UINT32, fStartType: UINT32, fEndType: UINT32): boolean {
  let pTopmost: LEVELNODE | null = null;
  let pOldTopmost: LEVELNODE;
  let fTileType: UINT32;
  let fRetVal: boolean = false;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  // Look through all topmosts and Search for type

  while (pTopmost != null) {
    // Advance to next
    pOldTopmost = pTopmost;
    pTopmost = pTopmost.pNext;

    if (pOldTopmost.usIndex != NO_TILE && pOldTopmost.usIndex < Enum312.NUMBEROFTILES) {
      fTileType = GetTileType(pOldTopmost.usIndex);

      if (fTileType >= fStartType && fTileType <= fEndType) {
        // Remove Item
        RemoveTopmost(iMapIndex, pOldTopmost.usIndex);
        fRetVal = true;
      }
    }
  }
  return fRetVal;
}

export function TypeExistsInTopmostLayer(iMapIndex: UINT32, fType: UINT32): UINT16 {
  let pTopmost: LEVELNODE | null = null;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  return TypeExistsInLevel(pTopmost, fType);
}

function SetTopmostFlags(iMapIndex: UINT32, uiFlags: UINT32, usIndex: UINT16): void {
  let pTopmost: LEVELNODE | null = null;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  SetIndexLevelNodeFlags(pTopmost, uiFlags, usIndex);
}

function RemoveTopmostFlags(iMapIndex: UINT32, uiFlags: UINT32, usIndex: UINT16): void {
  let pTopmost: LEVELNODE | null = null;

  pTopmost = gpWorldLevelData[iMapIndex].pTopmostHead;

  RemoveIndexLevelNodeFlags(pTopmost, uiFlags, usIndex);
}

function SetMapElementShadeLevel(uiMapIndex: UINT32, ubShadeLevel: UINT8): boolean {
  SetAllLandShadeLevels(uiMapIndex, ubShadeLevel);
  SetAllObjectShadeLevels(uiMapIndex, ubShadeLevel);
  SetAllStructShadeLevels(uiMapIndex, ubShadeLevel);

  return true;
}

export function IsHeigherLevel(sGridNo: INT16): boolean {
  let pStructure: STRUCTURE | null;

  pStructure = FindStructure(sGridNo, STRUCTURE_NORMAL_ROOF);

  if (pStructure != null) {
    return true;
  }

  return false;
}

export function IsLowerLevel(sGridNo: INT16): boolean {
  let pStructure: STRUCTURE | null;

  pStructure = FindStructure(sGridNo, STRUCTURE_NORMAL_ROOF);

  if (pStructure == null) {
    return true;
  }

  return false;
}

export function IsRoofVisible(sMapPos: INT16): boolean {
  let pStructure: STRUCTURE | null;

  if (!gfBasement) {
    pStructure = FindStructure(sMapPos, STRUCTURE_ROOF);

    if (pStructure != null) {
      if (!(gpWorldLevelData[sMapPos].uiFlags & MAPELEMENT_REVEALED)) {
        return true;
      }
    }
  } else {
    // if ( InARoom( sMapPos, &ubRoom ) )
    {
      // if ( !( gpWorldLevelData[ sMapPos ].uiFlags & MAPELEMENT_REVEALED ) )
      { return (true); }
    }
  }

  return false;
}

export function IsRoofVisible2(sMapPos: INT16): boolean {
  let pStructure: STRUCTURE | null;

  if (!gfBasement) {
    pStructure = FindStructure(sMapPos, STRUCTURE_ROOF);

    if (pStructure != null) {
      if (!(gpWorldLevelData[sMapPos].uiFlags & MAPELEMENT_REVEALED)) {
        return true;
      }
    }
  } else {
    // if ( InARoom( sMapPos, &ubRoom ) )
    {
      if (!(gpWorldLevelData[sMapPos].uiFlags & MAPELEMENT_REVEALED)) {
        return true;
      }
    }
  }

  return false;
}

export function WhoIsThere2(sGridNo: INT16, bLevel: INT8): UINT8 {
  let pStructure: STRUCTURE | null;

  if (!GridNoOnVisibleWorldTile(sGridNo)) {
    return NOBODY;
  }

  if (gpWorldLevelData[sGridNo].pStructureHead != null) {
    pStructure = gpWorldLevelData[sGridNo].pStructureHead;

    while (pStructure) {
      // person must either have their pSoldier->sGridNo here or be non-passable
      if ((pStructure.fFlags & STRUCTURE_PERSON) && (!(pStructure.fFlags & STRUCTURE_PASSABLE) || MercPtrs[pStructure.usStructureID].sGridNo == sGridNo)) {
        if ((bLevel == 0 && pStructure.sCubeOffset == 0) || (bLevel > 0 && pStructure.sCubeOffset > 0)) {
          // found a person, on the right level!
          // structure ID and merc ID are identical for merc structures
          return pStructure.usStructureID;
        }
      }
      pStructure = pStructure.pNext;
    }
  }

  return NOBODY;
}

export function GetTerrainType(sGridNo: INT16): UINT8 {
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

export function Water(sGridNo: INT16): boolean {
  let pMapElement: MAP_ELEMENT;

  if (sGridNo == NOWHERE) {
    return false;
  }

  pMapElement = gpWorldLevelData[sGridNo];
  if (pMapElement.ubTerrainID == Enum315.LOW_WATER || pMapElement.ubTerrainID == Enum315.MED_WATER || pMapElement.ubTerrainID == Enum315.DEEP_WATER) {
    // check for a bridge!  otherwise...
    return true;
  } else {
    return false;
  }
}

export function DeepWater(sGridNo: INT16): boolean {
  let pMapElement: MAP_ELEMENT;

  pMapElement = gpWorldLevelData[sGridNo];
  if (pMapElement.ubTerrainID == Enum315.DEEP_WATER) {
    // check for a bridge!  otherwise...
    return true;
  } else {
    return false;
  }
}

export function WaterTooDeepForAttacks(sGridNo: INT16): boolean {
  return DeepWater(sGridNo);
}

export function SetStructAframeFlags(iMapIndex: UINT32, uiFlags: UINT32): void {
  let pStruct: LEVELNODE | null = null;
  let pOldStruct: LEVELNODE;
  let uiTileFlags: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type
  while (pStruct != null) {
    if (pStruct.usIndex != NO_TILE) {
      uiTileFlags = GetTileFlags(pStruct.usIndex);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.pNext;

      if (uiTileFlags & AFRAME_TILE) {
        pOldStruct.uiFlags |= uiFlags;
      }
    }
  }
}

function RemoveStructAframeFlags(iMapIndex: UINT32, uiFlags: UINT32): void {
  let pStruct: LEVELNODE | null = null;
  let pOldStruct: LEVELNODE;
  let uiTileFlags: UINT32;

  pStruct = gpWorldLevelData[iMapIndex].pRoofHead;

  // Look through all Roofs and Search for type
  while (pStruct != null) {
    if (pStruct.usIndex != NO_TILE) {
      uiTileFlags = GetTileFlags(pStruct.usIndex);

      // Advance to next
      pOldStruct = pStruct;
      pStruct = pStruct.pNext;

      if (uiTileFlags & AFRAME_TILE) {
        pOldStruct.uiFlags &= (~uiFlags);
      }
    }
  }
}

export function FindLevelNodeBasedOnStructure(sGridNo: INT16, pStructure: STRUCTURE): LEVELNODE {
  let pLevelNode: LEVELNODE | null;

  // ATE: First look on the struct layer.....
  pLevelNode = gpWorldLevelData[sGridNo].pStructHead;
  while (pLevelNode != null) {
    if (pLevelNode.pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode.pNext;
  }

  // Next the roof layer....
  pLevelNode = gpWorldLevelData[sGridNo].pRoofHead;
  while (pLevelNode != null) {
    if (pLevelNode.pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode.pNext;
  }

  // Then the object layer....
  pLevelNode = gpWorldLevelData[sGridNo].pObjectHead;
  while (pLevelNode != null) {
    if (pLevelNode.pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode.pNext;
  }

  // Finally the onroof layer....
  pLevelNode = gpWorldLevelData[sGridNo].pOnRoofHead;
  while (pLevelNode != null) {
    if (pLevelNode.pStructureData == pStructure) {
      return pLevelNode;
    }
    pLevelNode = pLevelNode.pNext;
  }

  // Assert here if it cannot be found....
  AssertMsg(false, "FindLevelNodeBasedOnStruct failed.");

  return <LEVELNODE><unknown>null;
}

export function FindShadow(sGridNo: INT16, usStructIndex: UINT16): LEVELNODE | null {
  let pLevelNode: LEVELNODE | null;
  let usShadowIndex: UINT16;

  if (usStructIndex < Enum312.FIRSTOSTRUCT1 || usStructIndex >= Enum312.FIRSTSHADOW1) {
    return null;
  }

  usShadowIndex = usStructIndex - Enum312.FIRSTOSTRUCT1 + Enum312.FIRSTSHADOW1;

  pLevelNode = gpWorldLevelData[sGridNo].pShadowHead;
  while (pLevelNode != null) {
    if (pLevelNode.usIndex == usShadowIndex) {
      break;
    }
    pLevelNode = pLevelNode.pNext;
  }
  return pLevelNode;
}

export function WorldHideTrees(): void {
  let pNode: LEVELNODE | null;
  let fRerender: boolean = false;
  let fTileFlags: UINT32;
  let cnt: UINT32;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pNode = gpWorldLevelData[cnt].pStructHead;
    while (pNode != null) {
      fTileFlags = GetTileFlags(pNode.usIndex);

      if (fTileFlags & FULL3D_TILE) {
        if (!(pNode.uiFlags & LEVELNODE_REVEALTREES)) {
          pNode.uiFlags |= (LEVELNODE_REVEALTREES);
        }

        fRerender = true;
      }
      pNode = pNode.pNext;
    }
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

export function WorldShowTrees(): void {
  let pNode: LEVELNODE | null;
  let fRerender: boolean = false;
  let fTileFlags: UINT32;
  let cnt: UINT32;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    pNode = gpWorldLevelData[cnt].pStructHead;
    while (pNode != null) {
      fTileFlags = GetTileFlags(pNode.usIndex);

      if (fTileFlags & FULL3D_TILE) {
        if ((pNode.uiFlags & LEVELNODE_REVEALTREES)) {
          pNode.uiFlags &= (~(LEVELNODE_REVEALTREES));
        }

        fRerender = true;
      }
      pNode = pNode.pNext;
    }
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

function SetWorldFlagsFromNewNode(sGridNo: UINT16, usIndex: UINT16): void {
}

function RemoveWorldFlagsFromNewNode(sGridNo: UINT16, usIndex: UINT16): void {
}

export function SetWallLevelnodeFlags(sGridNo: UINT16, uiFlags: UINT32): void {
  let pStruct: LEVELNODE | null = null;

  pStruct = gpWorldLevelData[sGridNo].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != null) {
    if (pStruct.pStructureData != null) {
      // See if we are a wall!
      if (pStruct.pStructureData.fFlags & STRUCTURE_WALLSTUFF) {
        pStruct.uiFlags |= uiFlags;
      }
    }
    // Advance to next
    pStruct = pStruct.pNext;
  }
}

export function RemoveWallLevelnodeFlags(sGridNo: UINT16, uiFlags: UINT32): void {
  let pStruct: LEVELNODE | null = null;

  pStruct = gpWorldLevelData[sGridNo].pStructHead;

  // Look through all objects and Search for type

  while (pStruct != null) {
    if (pStruct.pStructureData != null) {
      // See if we are a wall!
      if (pStruct.pStructureData.fFlags & STRUCTURE_WALLSTUFF) {
        pStruct.uiFlags &= (~uiFlags);
      }
    }
    // Advance to next
    pStruct = pStruct.pNext;
  }
}

export function SetTreeTopStateForMap(): void {
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

}
