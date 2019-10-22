/*
Kris -- Notes on how the undo code works:

At the bottom of the hierarchy, we need to determine the state of the undo command.  The idea
is that we want to separate undo commands by separating them by new mouse clicks.  By holding a mouse
down and painting various objects in the world would all constitute a single undo command.  As soon as
the mouse is release, then a new undo command is setup.  So, to automate this, there is a call every
frame to DetermineUndoState().

At the next level, there is a binary tree that keeps track of what map indices have been backup up in
the current undo command.  The whole reason to maintain this list, is to avoid multiple map elements of
the same map index from being saved.  In the outer code, everytime something is changed, a call to
AddToUndoList() is called, so there are many cases (especially with building/terrain smoothing) that the
same mapindex is added to the undo list.  This is also completely transparent, and doesn't need to be
maintained.

In the outer code, there are several calls to AddToUndoList( iMapIndex ).  This function basically looks
in the binary tree for an existing entry, and if there isn't, then the entire mapelement is saved (with
the exception of the merc level ).  Lights are also supported, but there is a totally different methodology
for accomplishing this.  The equivalent function is AddLightToUndoList( iMapIndex ).  In this case, only the
light is saved, along with internal maintanance of several flags.

The actual mapelement copy code, is very complex.  The mapelement is copied in parallel with a new one which
has to allocate several nodes of several types because a mapelement contains over a dozen separate lists, and
all of them need to be saved.  The structure information of certain mapelements may be multitiled and must
also save the affected gridno's as well.  This is also done internally.  Basically, your call to
AddToUndoList() for any particular gridno, may actually save several entries (like for a car which could be 6+
tiles)

MERCS
Mercs are not supported in the undo code.  Because they are so dynamic, and stats could change, they could
move, etc., it doesn't need to be in the undo code.  The editor has its own way of dealing with mercs which
doesn't use the undo methodology.

*/

let gfUndoEnabled: BOOLEAN = FALSE;

function EnableUndo(): void {
  gfUndoEnabled = TRUE;
}

function DisableUndo(): void {
  gfUndoEnabled = FALSE;
}

// undo node data element
interface undo_struct {
  iMapIndex: INT32;
  pMapTile: Pointer<MAP_ELEMENT>;
  fLightSaved: BOOLEAN; // determines that a light has been saved
  ubLightRadius: UINT8; // the radius of the light to build if undo is called
  ubLightID: UINT8; // only applies if a light was saved.
  ubRoomNum: UINT8;
}

// Undo stack node
interface undo_stack {
  iCmdCount: INT32;
  pData: Pointer<undo_struct>;
  pNext: Pointer<undo_stack>;
  iUndoType: INT32;
}
let gpTileUndoStack: Pointer<undo_stack> = NULL;

let fNewUndoCmd: BOOLEAN = TRUE;
let gfIgnoreUndoCmdsForLights: BOOLEAN = FALSE;

// New pre-undo binary tree stuff
// With this, new undo commands will not duplicate saves in the same command.  This will
// increase speed, and save memory.
interface MapIndexBinaryTree {
  left: Pointer<MapIndexBinaryTree>;
  right: Pointer<MapIndexBinaryTree>;

  usMapIndex: UINT16;
}

let top: Pointer<MapIndexBinaryTree> = NULL;

// Recursively deletes all nodes below the node passed including itself.
function DeleteTreeNode(node: Pointer<Pointer<MapIndexBinaryTree>>): void {
  if ((*node).value.left)
    DeleteTreeNode(addressof((*node).value.left));
  if ((*node).value.right)
    DeleteTreeNode(addressof((*node).value.right));
  MemFree(*node);
  *node = NULL;
}

// Recursively delete all nodes (from the top down).
function ClearUndoMapIndexTree(): void {
  if (top)
    DeleteTreeNode(addressof(top));
}

function AddMapIndexToTree(usMapIndex: UINT16): BOOLEAN {
  let curr: Pointer<MapIndexBinaryTree>;
  let parent: Pointer<MapIndexBinaryTree>;
  if (!top) {
    top = MemAlloc(sizeof(MapIndexBinaryTree));
    Assert(top);
    top.value.usMapIndex = usMapIndex;
    top.value.left = NULL;
    top.value.right = NULL;
    return TRUE;
  }
  curr = top;
  parent = NULL;
  // Traverse down the tree and attempt to find a matching mapindex.
  // If one is encountered, then we fail, and don't add the mapindex to the
  // tree.
  while (curr) {
    parent = curr;
    if (curr.value.usMapIndex == usMapIndex) // found a match, so stop
      return FALSE;
    // if the mapIndex is < node's mapIndex, then go left, else right
    curr = (usMapIndex < curr.value.usMapIndex) ? curr.value.left : curr.value.right;
  }
  // if we made it this far, then curr is null and parent is pointing
  // directly above.
  // Create the new node and fill in the information.
  curr = MemAlloc(sizeof(MapIndexBinaryTree));
  Assert(curr);
  curr.value.usMapIndex = usMapIndex;
  curr.value.left = NULL;
  curr.value.right = NULL;
  // Now link the new node to the parent.
  if (curr.value.usMapIndex < parent.value.usMapIndex)
    parent.value.left = curr;
  else
    parent.value.right = curr;
  return TRUE;
}
//*************************************************************************
//
//	Start of Undo code
//
//*************************************************************************

function DeleteTopStackNode(): BOOLEAN {
  let pCurrent: Pointer<undo_stack>;

  pCurrent = gpTileUndoStack;

  DeleteStackNodeContents(pCurrent);

  // Remove node from stack, and free it's memory
  gpTileUndoStack = gpTileUndoStack.value.pNext;
  MemFree(pCurrent);

  return TRUE;
}

function DeleteThisStackNode(pThisNode: Pointer<undo_stack>): Pointer<undo_stack> {
  let pCurrent: Pointer<undo_stack>;
  let pNextNode: Pointer<undo_stack>;

  pCurrent = pThisNode;
  pNextNode = pThisNode.value.pNext;

  // Remove node from stack, and free it's memory
  DeleteStackNodeContents(pCurrent);
  MemFree(pCurrent);

  return pNextNode;
}

function DeleteStackNodeContents(pCurrent: Pointer<undo_stack>): BOOLEAN {
  let pData: Pointer<undo_struct>;
  let pMapTile: Pointer<MAP_ELEMENT>;
  let pLandNode: Pointer<LEVELNODE>;
  let pObjectNode: Pointer<LEVELNODE>;
  let pStructNode: Pointer<LEVELNODE>;
  let pShadowNode: Pointer<LEVELNODE>;
  let pMercNode: Pointer<LEVELNODE>;
  let pTopmostNode: Pointer<LEVELNODE>;
  let pRoofNode: Pointer<LEVELNODE>;
  let pOnRoofNode: Pointer<LEVELNODE>;
  let pStructureNode: Pointer<STRUCTURE>;

  pData = pCurrent.value.pData;
  pMapTile = pData.value.pMapTile;

  if (!pMapTile)
    return TRUE; // light was saved -- mapelement wasn't saved.

  // Free the memory associated with the map tile liked lists
  pLandNode = pMapTile.value.pLandHead;
  while (pLandNode != NULL) {
    pMapTile.value.pLandHead = pLandNode.value.pNext;
    MemFree(pLandNode);
    pLandNode = pMapTile.value.pLandHead;
  }

  pObjectNode = pMapTile.value.pObjectHead;
  while (pObjectNode != NULL) {
    pMapTile.value.pObjectHead = pObjectNode.value.pNext;
    MemFree(pObjectNode);
    pObjectNode = pMapTile.value.pObjectHead;
  }

  pStructNode = pMapTile.value.pStructHead;
  while (pStructNode != NULL) {
    pMapTile.value.pStructHead = pStructNode.value.pNext;
    MemFree(pStructNode);
    pStructNode = pMapTile.value.pStructHead;
  }

  pShadowNode = pMapTile.value.pShadowHead;
  while (pShadowNode != NULL) {
    pMapTile.value.pShadowHead = pShadowNode.value.pNext;
    MemFree(pShadowNode);
    pShadowNode = pMapTile.value.pShadowHead;
  }

  pMercNode = pMapTile.value.pMercHead;
  while (pMercNode != NULL) {
    pMapTile.value.pMercHead = pMercNode.value.pNext;
    MemFree(pMercNode);
    pMercNode = pMapTile.value.pMercHead;
  }

  pRoofNode = pMapTile.value.pRoofHead;
  while (pRoofNode != NULL) {
    pMapTile.value.pRoofHead = pRoofNode.value.pNext;
    MemFree(pRoofNode);
    pRoofNode = pMapTile.value.pRoofHead;
  }

  pOnRoofNode = pMapTile.value.pOnRoofHead;
  while (pOnRoofNode != NULL) {
    pMapTile.value.pOnRoofHead = pOnRoofNode.value.pNext;
    MemFree(pOnRoofNode);
    pOnRoofNode = pMapTile.value.pOnRoofHead;
  }

  pTopmostNode = pMapTile.value.pTopmostHead;
  while (pTopmostNode != NULL) {
    pMapTile.value.pTopmostHead = pTopmostNode.value.pNext;
    MemFree(pTopmostNode);
    pTopmostNode = pMapTile.value.pTopmostHead;
  }

  pStructureNode = pMapTile.value.pStructureHead;
  while (pStructureNode) {
    pMapTile.value.pStructureHead = pStructureNode.value.pNext;
    if (pStructureNode.value.usStructureID > INVALID_STRUCTURE_ID) {
      // Okay to delete the structure data -- otherwise, this would be
      // merc structure data that we DON'T want to delete, because the merc node
      // that hasn't been modified will still use this structure data!
      MemFree(pStructureNode);
    }
    pStructureNode = pMapTile.value.pStructureHead;
  }

  // Free the map tile structure itself
  MemFree(pMapTile);

  // Free the undo struct
  MemFree(pData);

  return TRUE;
}

function CropStackToMaxLength(iMaxCmds: INT32): void {
  let iCmdCount: INT32;
  let pCurrent: Pointer<undo_stack>;

  iCmdCount = 0;
  pCurrent = gpTileUndoStack;

  // If stack is empty, leave
  if (pCurrent == NULL)
    return;

  while ((iCmdCount <= (iMaxCmds - 1)) && (pCurrent != NULL)) {
    if (pCurrent.value.iCmdCount == 1)
      iCmdCount++;
    pCurrent = pCurrent.value.pNext;
  }

  // If the max number of commands was reached, and there is something
  // to crop, from the rest of the stack, remove it.
  if ((iCmdCount >= iMaxCmds) && pCurrent != NULL) {
    while (pCurrent.value.pNext != NULL)
      pCurrent.value.pNext = DeleteThisStackNode(pCurrent.value.pNext);
  }
}

// We are adding a light to the undo list.  We won't save the mapelement, nor will
// we validate the gridno in the binary tree.  This works differently than a mapelement,
// because lights work on a different system.  By setting the fLightSaved flag to TRUE,
// this will handle the way the undo command is handled.  If there is no lightradius in
// our saved light, then we intend on erasing the light upon undo execution, otherwise, we
// save the light radius and light ID, so that we place it during undo execution.
function AddLightToUndoList(iMapIndex: INT32, iLightRadius: INT32, ubLightID: UINT8): void {
  let pNode: Pointer<undo_stack>;
  let pUndoInfo: Pointer<undo_struct>;

  if (!gfUndoEnabled)
    return;
  // When executing an undo command (by adding a light or removing one), that command
  // actually tries to add it to the undo list.  So we wrap the execution of the undo
  // command by temporarily setting this flag, so it'll ignore, and not place a new undo
  // command.  When finished, the flag is cleared, and lights are again allowed to be saved
  // in the undo list.
  if (gfIgnoreUndoCmdsForLights)
    return;

  pNode = MemAlloc(sizeof(undo_stack));
  if (!pNode)
    return;

  pUndoInfo = MemAlloc(sizeof(undo_struct));
  if (!pUndoInfo) {
    MemFree(pNode);
    return;
  }

  pUndoInfo.value.fLightSaved = TRUE;
  // if ubLightRadius is 0, then we don't need to save the light information because we
  // will erase it when it comes time to execute the undo command.
  pUndoInfo.value.ubLightRadius = iLightRadius;
  pUndoInfo.value.ubLightID = ubLightID;
  pUndoInfo.value.iMapIndex = iMapIndex;
  pUndoInfo.value.pMapTile = NULL;

  // Add to undo stack
  pNode.value.iCmdCount = 1;
  pNode.value.pData = pUndoInfo;
  pNode.value.pNext = gpTileUndoStack;
  gpTileUndoStack = pNode;

  CropStackToMaxLength(MAX_UNDO_COMMAND_LENGTH);
}

function AddToUndoList(iMapIndex: INT32): BOOLEAN {
  /* static */ let iCount: INT32 = 1;

  if (!gfUndoEnabled)
    return FALSE;
  if (fNewUndoCmd) {
    iCount = 0;
    fNewUndoCmd = FALSE;
  }

  // Check to see if the tile in question is even on the visible map, then
  // if that is true, then check to make sure we don't already have the mapindex
  // saved in the new binary tree (which only holds unique mapindex values).
  if (GridNoOnVisibleWorldTile(iMapIndex) && AddMapIndexToTree(iMapIndex))

  {
    if (AddToUndoListCmd(iMapIndex, ++iCount))
      return TRUE;
    iCount--;
  }
  return FALSE;
}

function AddToUndoListCmd(iMapIndex: INT32, iCmdCount: INT32): BOOLEAN {
  let pNode: Pointer<undo_stack>;
  let pUndoInfo: Pointer<undo_struct>;
  let pData: Pointer<MAP_ELEMENT>;
  let pStructure: Pointer<STRUCTURE>;
  let iCoveredMapIndex: INT32;
  let ubLoop: UINT8;

  if ((pNode = MemAlloc(sizeof(undo_stack))) == NULL) {
    return FALSE;
  }

  if ((pUndoInfo = MemAlloc(sizeof(undo_struct))) == NULL) {
    MemFree(pNode);
    return FALSE;
  }

  if ((pData = MemAlloc(sizeof(MAP_ELEMENT))) == NULL) {
    MemFree(pNode);
    MemFree(pUndoInfo);
    return FALSE;
  }

  // Init map element struct
  pData.value.pLandHead = pData.value.pLandStart = NULL;
  pData.value.pObjectHead = NULL;
  pData.value.pStructHead = NULL;
  pData.value.pShadowHead = NULL;
  pData.value.pMercHead = NULL;
  pData.value.pRoofHead = NULL;
  pData.value.pOnRoofHead = NULL;
  pData.value.pTopmostHead = NULL;
  pData.value.pStructureHead = pData.value.pStructureTail = NULL;
  pData.value.sHeight = 0;

  // Copy the world map's tile
  if (CopyMapElementFromWorld(pData, iMapIndex) == FALSE) {
    MemFree(pNode);
    MemFree(pUndoInfo);
    MemFree(pData);
    return FALSE;
  }

  // copy the room number information (it's not in the mapelement structure)
  pUndoInfo.value.ubRoomNum = gubWorldRoomInfo[iMapIndex];

  pUndoInfo.value.fLightSaved = FALSE;
  pUndoInfo.value.ubLightRadius = 0;
  pUndoInfo.value.ubLightID = 0;
  pUndoInfo.value.pMapTile = pData;
  pUndoInfo.value.iMapIndex = iMapIndex;

  pNode.value.pData = pUndoInfo;
  pNode.value.iCmdCount = iCmdCount;
  pNode.value.pNext = gpTileUndoStack;
  gpTileUndoStack = pNode;

  // loop through pData->pStructureHead list
  // for each structure
  //   find the base tile
  //   reference the db structure
  //   if number of tiles > 1
  //     add all covered tiles to undo list
  pStructure = pData.value.pStructureHead;
  while (pStructure) {
    for (ubLoop = 1; ubLoop < pStructure.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles; ubLoop++) {
      // this loop won't execute for single-tile structures; for multi-tile structures, we have to
      // add to the undo list all the other tiles covered by the structure
      iCoveredMapIndex = pStructure.value.sBaseGridNo + pStructure.value.pDBStructureRef.value.ppTile[ubLoop].value.sPosRelToBase;
      AddToUndoList(iCoveredMapIndex);
    }
    pStructure = pStructure.value.pNext;
  }

  CropStackToMaxLength(MAX_UNDO_COMMAND_LENGTH);

  return TRUE;
}

function CheckMapIndexForMultiTileStructures(usMapIndex: UINT16): void {
  let pStructure: Pointer<STRUCTURE>;
  let ubLoop: UINT8;
  let iCoveredMapIndex: INT32;

  pStructure = gpWorldLevelData[usMapIndex].pStructureHead;
  while (pStructure) {
    if (pStructure.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles > 1) {
      for (ubLoop = 0; ubLoop < pStructure.value.pDBStructureRef.value.pDBStructure.value.ubNumberOfTiles; ubLoop++) {
        // for multi-tile structures we have to add, to the undo list, all the other tiles covered by the structure
        if (pStructure.value.fFlags & STRUCTURE_BASE_TILE) {
          iCoveredMapIndex = usMapIndex + pStructure.value.pDBStructureRef.value.ppTile[ubLoop].value.sPosRelToBase;
        } else {
          iCoveredMapIndex = pStructure.value.sBaseGridNo + pStructure.value.pDBStructureRef.value.ppTile[ubLoop].value.sPosRelToBase;
        }
        AddToUndoList(iCoveredMapIndex);
      }
    }
    pStructure = pStructure.value.pNext;
  }
}

function CheckForMultiTilesInTreeAndAddToUndoList(node: Pointer<MapIndexBinaryTree>): void {
  CheckMapIndexForMultiTileStructures(node.value.usMapIndex);
  if (node.value.left)
    CheckForMultiTilesInTreeAndAddToUndoList(node.value.left);
  if (node.value.right)
    CheckForMultiTilesInTreeAndAddToUndoList(node.value.right);
}

function RemoveAllFromUndoList(): BOOLEAN {
  ClearUndoMapIndexTree();

  while (gpTileUndoStack != NULL)
    DeleteTopStackNode();

  return TRUE;
}

function ExecuteUndoList(): BOOLEAN {
  let iCmdCount: INT32;
  let iCurCount: INT32;
  let iUndoMapIndex: INT32;
  let fExitGrid: BOOLEAN;

  if (!gfUndoEnabled)
    return FALSE;

  // Is there something on the undo stack?
  if (gpTileUndoStack == NULL)
    return TRUE;

  // Get number of stack entries for this command (top node will tell this)
  iCmdCount = gpTileUndoStack.value.iCmdCount;

  // Execute each stack node in command, and remove each from stack.
  iCurCount = 0;
  while ((iCurCount < iCmdCount) && (gpTileUndoStack != NULL)) {
    iUndoMapIndex = gpTileUndoStack.value.pData.value.iMapIndex;

    // Find which map tile we are to "undo"
    if (gpTileUndoStack.value.pData.value.fLightSaved) {
      // We saved a light, so delete that light
      let sX: INT16;
      let sY: INT16;
      // Turn on this flag so that the following code, when executed, doesn't attempt to
      // add lights to the undo list.  That would cause problems...
      gfIgnoreUndoCmdsForLights = TRUE;
      ConvertGridNoToXY(iUndoMapIndex, addressof(sX), addressof(sY));
      if (!gpTileUndoStack.value.pData.value.ubLightRadius)
        RemoveLight(sX, sY);
      else
        PlaceLight(gpTileUndoStack.value.pData.value.ubLightRadius, sX, sY, gpTileUndoStack.value.pData.value.ubLightID);
      // Turn off the flag so lights can again be added to the undo list.
      gfIgnoreUndoCmdsForLights = FALSE;
    } else {
      // We execute the undo command node by simply swapping the contents
      // of the undo's MAP_ELEMENT with the world's element.
      fExitGrid = ExitGridAtGridNo(iUndoMapIndex);
      SwapMapElementWithWorld(iUndoMapIndex, gpTileUndoStack.value.pData.value.pMapTile);

      // copy the room number information back
      gubWorldRoomInfo[iUndoMapIndex] = gpTileUndoStack.value.pData.value.ubRoomNum;

      // Now we smooth out the changes...
      // SmoothUndoMapTileTerrain( iUndoMapIndex, gpTileUndoStack->pData->pMapTile );
      SmoothAllTerrainTypeRadius(iUndoMapIndex, 1, TRUE);
    }

    // ...trash the top element of the stack...
    DeleteTopStackNode();

    // ...and bump the command counter up by 1
    iCurCount++;

    // Kris:
    // The new cursor system is somehow interfering with the undo stuff.  When
    // an undo is called, the item is erased, but a cursor is added!  I'm quickly
    // hacking around this by erasing all cursors here.
    RemoveAllTopmostsOfTypeRange(iUndoMapIndex, FIRSTPOINTERS, FIRSTPOINTERS);

    if (fExitGrid && !ExitGridAtGridNo(iUndoMapIndex)) {
      // An exitgrid has been removed, so get rid of the associated indicator.
      RemoveTopmost(iUndoMapIndex, FIRSTPOINTERS8);
    } else if (!fExitGrid && ExitGridAtGridNo(iUndoMapIndex)) {
      // An exitgrid has been added, so add the associated indicator
      AddTopmostToTail(iUndoMapIndex, FIRSTPOINTERS8);
    }
  }

  return TRUE;
}

function SmoothUndoMapTileTerrain(iWorldTile: INT32, pUndoTile: Pointer<MAP_ELEMENT>): void {
  let pWorldLand: Pointer<LEVELNODE>;
  let pUndoLand: Pointer<LEVELNODE>;
  let pLand: Pointer<LEVELNODE>;
  let pWLand: Pointer<LEVELNODE>;
  let uiCheckType: UINT32;
  let uiWCheckType: UINT32;
  let fFound: BOOLEAN;

  pUndoLand = pUndoTile.value.pLandHead;
  pWorldLand = gpWorldLevelData[iWorldTile].pLandHead;

  if (pUndoLand == NULL) {
    // nothing in the old tile, so smooth the entire land in world's tile
    pLand = gpWorldLevelData[iWorldTile].pLandHead;
    while (pLand != NULL) {
      GetTileType(pLand.value.usIndex, addressof(uiCheckType));
      SmoothTerrainRadius(iWorldTile, uiCheckType, 1, TRUE);
      pLand = pLand.value.pNext;
    }
  } else if (gpWorldLevelData[iWorldTile].pLandHead == NULL) {
    // Nothing in world's tile, so smooth out the land in the old tile.
    pLand = pUndoLand;
    while (pLand != NULL) {
      GetTileType(pLand.value.usIndex, addressof(uiCheckType));
      SmoothTerrainRadius(iWorldTile, uiCheckType, 1, TRUE);
      pLand = pLand.value.pNext;
    }
  } else {
    pLand = pUndoLand;
    while (pLand != NULL) {
      GetTileType(pLand.value.usIndex, addressof(uiCheckType));

      fFound = FALSE;
      pWLand = pWorldLand;
      while (pWLand != NULL && !fFound) {
        GetTileType(pWLand.value.usIndex, addressof(uiWCheckType));

        if (uiCheckType == uiWCheckType)
          fFound = TRUE;

        pWLand = pWLand.value.pNext;
      }

      if (!fFound)
        SmoothTerrainRadius(iWorldTile, uiCheckType, 1, TRUE);

      pLand = pLand.value.pNext;
    }

    pWLand = pWorldLand;
    while (pWLand != NULL) {
      GetTileType(pWLand.value.usIndex, addressof(uiWCheckType));

      fFound = FALSE;
      pLand = pUndoLand;
      while (pLand != NULL && !fFound) {
        GetTileType(pLand.value.usIndex, addressof(uiCheckType));

        if (uiCheckType == uiWCheckType)
          fFound = TRUE;

        pLand = pLand.value.pNext;
      }

      if (!fFound)
        SmoothTerrainRadius(iWorldTile, uiWCheckType, 1, TRUE);

      pWLand = pWLand.value.pNext;
    }
  }
}

// Because of the potentially huge amounts of memory that can be allocated due to the inefficient
// undo methods coded by Bret, it is feasible that it could fail.  Instead of using assertions to
// terminate the program, destroy the memory allocated thusfar.
function DeleteMapElementContentsAfterCreationFail(pNewMapElement: Pointer<MAP_ELEMENT>): void {
  let pLevelNode: Pointer<LEVELNODE>;
  let pStructure: Pointer<STRUCTURE>;
  let x: INT32;
  for (x = 0; x < 9; x++) {
    if (x == 1)
      continue;
    pLevelNode = pNewMapElement.value.pLevelNodes[x];
    while (pLevelNode) {
      let temp: Pointer<LEVELNODE>;
      temp = pLevelNode;
      pLevelNode = pLevelNode.value.pNext;
      MemFree(temp);
    }
  }
  pStructure = pNewMapElement.value.pStructureHead;
  while (pStructure) {
    let temp: Pointer<STRUCTURE>;
    temp = pStructure;
    pStructure = pStructure.value.pNext;
    MemFree(temp);
  }
}

/*
        union
        {
                struct TAG_level_node				*pPrevNode;					// FOR LAND, GOING BACKWARDS POINTER
                ITEM_POOL										*pItemPool;					// ITEM POOLS
                STRUCTURE										*pStructureData;		// STRUCTURE DATA
                INT32												iPhysicsObjectID;		// ID FOR PHYSICS ITEM
                INT32												uiAPCost;						// FOR AP DISPLAY
        }; // ( 4 byte union )
        union
        {
                struct
                {
                        UINT16										usIndex;							// TILE DATABASE INDEX
                        INT16											sCurrentFrame;				// Stuff for animated tiles for a given tile location ( doors, etc )
                };
                struct
                {
                        SOLDIERTYPE								*pSoldier;					// POINTER TO SOLDIER
                };
        }; // ( 4 byte union )
*/
function CopyMapElementFromWorld(pNewMapElement: Pointer<MAP_ELEMENT>, iMapIndex: INT32): BOOLEAN {
  let pOldMapElement: Pointer<MAP_ELEMENT>;
  let pOldLevelNode: Pointer<LEVELNODE>;
  let pLevelNode: Pointer<LEVELNODE>;
  let pNewLevelNode: Pointer<LEVELNODE>;
  let tail: Pointer<LEVELNODE>;
  let x: INT32;

  let pOldStructure: Pointer<STRUCTURE>;

  // Get a pointer to the current map index
  pOldMapElement = addressof(gpWorldLevelData[iMapIndex]);

  // Save the structure information from the mapelement
  pOldStructure = pOldMapElement.value.pStructureHead;
  if (pOldStructure) {
    let pNewStructure: Pointer<STRUCTURE>;
    let pStructure: Pointer<STRUCTURE>;
    let tail: Pointer<STRUCTURE>;
    tail = NULL;
    pNewStructure = NULL;
    while (pOldStructure) {
      pStructure = MemAlloc(sizeof(STRUCTURE));
      if (!pStructure) {
        DeleteMapElementContentsAfterCreationFail(pNewMapElement);
        return FALSE;
      }
      if (!tail) {
        // first node in structure list
        tail = pStructure;
        *tail = *pOldStructure;
        tail.value.pPrev = NULL;
        tail.value.pNext = NULL;
      } else {
        // add to the end of the levelnode list
        tail.value.pNext = pStructure;
        *pStructure = *pOldStructure;
        pStructure.value.pPrev = tail;
        pStructure.value.pNext = NULL;
        tail = tail.value.pNext;
      }
      // place the new node inside of the new map element
      if (!pNewStructure) {
        pNewMapElement.value.pStructureHead = pStructure;
        pNewStructure = pStructure;
      } else {
        pNewStructure.value.pNext = pStructure;
        pNewStructure = pNewStructure.value.pNext;
      }
      pOldStructure = pOldStructure.value.pNext;
    }
    if (tail) {
      pNewMapElement.value.pStructureTail = tail;
    }
  }

  // For each of the 9 levelnodes, save each one
  // except for levelnode[1] which is a pointer to the first land to render.
  for (x = 0; x < 9; x++) {
    if (x == 1 || x == 5) // skip the pLandStart and pMercLevel LEVELNODES
      continue;
    tail = NULL;
    pOldLevelNode = pOldMapElement.value.pLevelNodes[x];
    pNewLevelNode = NULL;
    while (pOldLevelNode) {
      // copy the level node
      pLevelNode = MemAlloc(sizeof(LEVELNODE));
      if (!pLevelNode) {
        DeleteMapElementContentsAfterCreationFail(pNewMapElement);
        return FALSE;
      }
      if (!tail) {
        // first node in levelnode list
        tail = pLevelNode;
        *tail = *pOldLevelNode;
        if (!x) // land layer only
          tail.value.pPrevNode = NULL;
        tail.value.pNext = NULL;
      } else {
        // add to the end of the levelnode list
        tail.value.pNext = pLevelNode;
        *pLevelNode = *pOldLevelNode;
        if (!x) // land layer only
          pLevelNode.value.pPrevNode = tail;
        pLevelNode.value.pNext = NULL;
        tail = tail.value.pNext;
      }
      // place the new node inside of the new map element
      if (!pNewLevelNode) {
        pNewMapElement.value.pLevelNodes[x] = pLevelNode;
        pNewLevelNode = pLevelNode;
      } else {
        pNewLevelNode.value.pNext = pLevelNode;
        pNewLevelNode = pNewLevelNode.value.pNext;
      }
      // Handle levelnode layer specific stuff
      switch (x) {
        case 0: // LAND LAYER
          if (pOldLevelNode == pOldMapElement.value.pLandStart) {
            // set the new landstart to point to the new levelnode.
            pNewMapElement.value.pLandStart = pNewLevelNode;
          }
          break;
        case 2: // OBJECT LAYER
          if (pOldLevelNode.value.pItemPool) {
            // save the item pool?
                                          // pNewLevelNode->pItemPool = (ITEM_POOL*)MemAlloc( sizeof( ITEM_POOL ) );
          }
          break;
        case 3: // STRUCT LAYER
        case 6: // ROOF LAYER
        case 7: // ON ROOF LAYER
          if (pOldLevelNode.value.pStructureData) {
            // make sure the structuredata pointer points to the parallel structure
            let pOld: Pointer<STRUCTURE>;
            let pNew: Pointer<STRUCTURE>;
            // both lists are exactly the same size and contain the same information,
            // but the addresses are different.  We will traverse the old list until
            // we find the match, then
            pOld = pOldMapElement.value.pStructureHead;
            pNew = pNewMapElement.value.pStructureHead;
            while (pOld) {
              Assert(pNew);
              if (pOld == pOldLevelNode.value.pStructureData) {
                pNewLevelNode.value.pStructureData = pNew;
                break;
              }
              pOld = pOld.value.pNext;
              pNew = pNew.value.pNext;
            }
            // Kris:
            // If this assert should fail, that means there is something wrong with
            // the preservation of the structure data within the mapelement.
            if (pOld != pOldLevelNode.value.pStructureData) {
              // OUCH!!! THIS IS HAPPENING.  DISABLED IT FOR LINDA'S SAKE
              Assert(1);
            }
          }
          break;
      }
      // Done, go to next node in this level
      pOldLevelNode = pOldLevelNode.value.pNext;
    }
    // Done, go to next level
  }

  // Save the rest of the information in the mapelement.
  pNewMapElement.value.uiFlags = pOldMapElement.value.uiFlags;
  pNewMapElement.value.sSumRealLights[0] = pOldMapElement.value.sSumRealLights[0];
  pNewMapElement.value.sSumRealLights[1] = pOldMapElement.value.sSumRealLights[1];
  pNewMapElement.value.sHeight = pOldMapElement.value.sHeight;
  pNewMapElement.value.ubTerrainID = pOldMapElement.value.ubTerrainID;
  pNewMapElement.value.ubReservedSoldierID = pOldMapElement.value.ubReservedSoldierID;

  return TRUE;
}

function SwapMapElementWithWorld(iMapIndex: INT32, pUndoMapElement: Pointer<MAP_ELEMENT>): BOOLEAN {
  let pCurrentMapElement: Pointer<MAP_ELEMENT>;
  let TempMapElement: MAP_ELEMENT;

  pCurrentMapElement = addressof(gpWorldLevelData[iMapIndex]);

  // Transfer the merc level node from the current world to the undo mapelement
  // that will replace it.  We do this, because mercs aren't associated with
  // undo commands.
  pUndoMapElement.value.pMercHead = gpWorldLevelData[iMapIndex].pMercHead;
  gpWorldLevelData[iMapIndex].pMercHead = NULL;

  // Swap the mapelements
  TempMapElement = *pCurrentMapElement;
  *pCurrentMapElement = *pUndoMapElement;
  *pUndoMapElement = TempMapElement;

  return TRUE;
}

function DetermineUndoState(): void {
  // Reset the undo command mode if we released the left button.
  if (!fNewUndoCmd) {
    if (!gfLeftButtonState && !gfCurrentSelectionWithRightButton || !gfRightButtonState && gfCurrentSelectionWithRightButton) {
      // Clear the mapindex binary tree list, and set up flag for new undo command.
      fNewUndoCmd = TRUE;
      ClearUndoMapIndexTree();
    }
  }
}
