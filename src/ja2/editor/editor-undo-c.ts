namespace ja2 {

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

let gfUndoEnabled: boolean = false;

export function EnableUndo(): void {
  gfUndoEnabled = true;
}

export function DisableUndo(): void {
  gfUndoEnabled = false;
}

// undo node data element
interface undo_struct {
  iMapIndex: INT32;
  pMapTile: MAP_ELEMENT;
  fLightSaved: boolean; // determines that a light has been saved
  ubLightRadius: UINT8; // the radius of the light to build if undo is called
  ubLightID: UINT8; // only applies if a light was saved.
  ubRoomNum: UINT8;
}

function createUndoStruct(): undo_struct {
  return {
    iMapIndex: 0,
    pMapTile: <MAP_ELEMENT><unknown>null,
    fLightSaved: false,
    ubLightRadius: 0,
    ubLightID: 0,
    ubRoomNum: 0,
  };
}

// Undo stack node
interface undo_stack {
  iCmdCount: INT32;
  pData: undo_struct;
  pNext: undo_stack | null;
  iUndoType: INT32;
}

function createUndoStack(): undo_stack {
  return {
    iCmdCount: 0,
    pData: <undo_struct><unknown>null,
    pNext: null,
    iUndoType: 0,
  };
}

let gpTileUndoStack: undo_stack | null /* Pointer<undo_stack> */ = null;

let fNewUndoCmd: boolean = true;
let gfIgnoreUndoCmdsForLights: boolean = false;

// New pre-undo binary tree stuff
// With this, new undo commands will not duplicate saves in the same command.  This will
// increase speed, and save memory.
interface MapIndexBinaryTree {
  left: MapIndexBinaryTree | null /* Pointer<MapIndexBinaryTree> */;
  right: MapIndexBinaryTree | null /* Pointer<MapIndexBinaryTree> */;

  usMapIndex: UINT16;
}

function createMapIndexBinaryTree(): MapIndexBinaryTree {
  return {
    left: null,
    right: null,
    usMapIndex: 0,
  };
}

let top: MapIndexBinaryTree | null /* Pointer<MapIndexBinaryTree> */ = null;

// Recursively deletes all nodes below the node passed including itself.
function DeleteTreeNode(node: MapIndexBinaryTree): void {
  if (node.left) {
    DeleteTreeNode(node.left);
    node.left = null;
  }
  if (node.right) {
    DeleteTreeNode(node.right);
    node.right = null;
  }
}

// Recursively delete all nodes (from the top down).
function ClearUndoMapIndexTree(): void {
  if (top)
    DeleteTreeNode(top);
}

function AddMapIndexToTree(usMapIndex: UINT16): boolean {
  let curr: MapIndexBinaryTree | null;
  let parent: MapIndexBinaryTree | null;
  if (!top) {
    top = createMapIndexBinaryTree();
    Assert(top);
    top.usMapIndex = usMapIndex;
    top.left = null;
    top.right = null;
    return true;
  }
  curr = top;
  parent = null;
  // Traverse down the tree and attempt to find a matching mapindex.
  // If one is encountered, then we fail, and don't add the mapindex to the
  // tree.
  while (curr) {
    parent = curr;
    if (curr.usMapIndex == usMapIndex) // found a match, so stop
      return false;
    // if the mapIndex is < node's mapIndex, then go left, else right
    curr = (usMapIndex < curr.usMapIndex) ? curr.left : curr.right;
  }
  // if we made it this far, then curr is null and parent is pointing
  // directly above.
  // Create the new node and fill in the information.
  curr = createMapIndexBinaryTree();
  Assert(curr);
  Assert(parent);
  curr.usMapIndex = usMapIndex;
  curr.left = null;
  curr.right = null;
  // Now link the new node to the parent.
  if (curr.usMapIndex < parent.usMapIndex)
    parent.left = curr;
  else
    parent.right = curr;
  return true;
}
//*************************************************************************
//
//	Start of Undo code
//
//*************************************************************************

function DeleteTopStackNode(): boolean {
  let pCurrent: undo_stack;

  Assert(gpTileUndoStack);
  pCurrent = gpTileUndoStack;

  DeleteStackNodeContents(pCurrent);

  // Remove node from stack, and free it's memory
  gpTileUndoStack = gpTileUndoStack.pNext;
  MemFree(pCurrent);

  return true;
}

function DeleteThisStackNode(pThisNode: undo_stack): undo_stack | null {
  let pCurrent: undo_stack;
  let pNextNode: undo_stack | null;

  pCurrent = pThisNode;
  pNextNode = pThisNode.pNext;

  // Remove node from stack, and free it's memory
  DeleteStackNodeContents(pCurrent);
  MemFree(pCurrent);

  return pNextNode;
}

function DeleteStackNodeContents(pCurrent: undo_stack): boolean {
  let pData: undo_struct;
  let pMapTile: MAP_ELEMENT | null;
  let pLandNode: LEVELNODE | null;
  let pObjectNode: LEVELNODE | null;
  let pStructNode: LEVELNODE | null;
  let pShadowNode: LEVELNODE | null;
  let pMercNode: LEVELNODE | null;
  let pTopmostNode: LEVELNODE | null;
  let pRoofNode: LEVELNODE | null;
  let pOnRoofNode: LEVELNODE | null;
  let pStructureNode: STRUCTURE | null;

  pData = pCurrent.pData;
  pMapTile = pData.pMapTile;

  if (!pMapTile)
    return true; // light was saved -- mapelement wasn't saved.

  // Free the memory associated with the map tile liked lists
  pLandNode = pMapTile.pLandHead;
  while (pLandNode != null) {
    pMapTile.pLandHead = pLandNode.pNext;
    pLandNode = pMapTile.pLandHead;
  }

  pObjectNode = pMapTile.pObjectHead;
  while (pObjectNode != null) {
    pMapTile.pObjectHead = pObjectNode.pNext;
    pObjectNode = pMapTile.pObjectHead;
  }

  pStructNode = pMapTile.pStructHead;
  while (pStructNode != null) {
    pMapTile.pStructHead = pStructNode.pNext;
    pStructNode = pMapTile.pStructHead;
  }

  pShadowNode = pMapTile.pShadowHead;
  while (pShadowNode != null) {
    pMapTile.pShadowHead = pShadowNode.pNext;
    pShadowNode = pMapTile.pShadowHead;
  }

  pMercNode = pMapTile.pMercHead;
  while (pMercNode != null) {
    pMapTile.pMercHead = pMercNode.pNext;
    pMercNode = pMapTile.pMercHead;
  }

  pRoofNode = pMapTile.pRoofHead;
  while (pRoofNode != null) {
    pMapTile.pRoofHead = pRoofNode.pNext;
    pRoofNode = pMapTile.pRoofHead;
  }

  pOnRoofNode = pMapTile.pOnRoofHead;
  while (pOnRoofNode != null) {
    pMapTile.pOnRoofHead = pOnRoofNode.pNext;
    pOnRoofNode = pMapTile.pOnRoofHead;
  }

  pTopmostNode = pMapTile.pTopmostHead;
  while (pTopmostNode != null) {
    pMapTile.pTopmostHead = pTopmostNode.pNext;
    pTopmostNode = pMapTile.pTopmostHead;
  }

  pStructureNode = pMapTile.pStructureHead;
  while (pStructureNode) {
    pMapTile.pStructureHead = pStructureNode.pNext;
    if (pStructureNode.usStructureID > INVALID_STRUCTURE_ID) {
      // Okay to delete the structure data -- otherwise, this would be
      // merc structure data that we DON'T want to delete, because the merc node
      // that hasn't been modified will still use this structure data!
    }
    pStructureNode = pMapTile.pStructureHead;
  }

  // Free the map tile structure itself

  // Free the undo struct

  return true;
}

function CropStackToMaxLength(iMaxCmds: INT32): void {
  let iCmdCount: INT32;
  let pCurrent: undo_stack | null;

  iCmdCount = 0;
  pCurrent = gpTileUndoStack;

  // If stack is empty, leave
  if (pCurrent == null)
    return;

  while ((iCmdCount <= (iMaxCmds - 1)) && (pCurrent != null)) {
    if (pCurrent.iCmdCount == 1)
      iCmdCount++;
    pCurrent = pCurrent.pNext;
  }

  // If the max number of commands was reached, and there is something
  // to crop, from the rest of the stack, remove it.
  if ((iCmdCount >= iMaxCmds) && pCurrent != null) {
    while (pCurrent.pNext != null)
      pCurrent.pNext = DeleteThisStackNode(pCurrent.pNext);
  }
}

// We are adding a light to the undo list.  We won't save the mapelement, nor will
// we validate the gridno in the binary tree.  This works differently than a mapelement,
// because lights work on a different system.  By setting the fLightSaved flag to TRUE,
// this will handle the way the undo command is handled.  If there is no lightradius in
// our saved light, then we intend on erasing the light upon undo execution, otherwise, we
// save the light radius and light ID, so that we place it during undo execution.
export function AddLightToUndoList(iMapIndex: INT32, iLightRadius: INT32, ubLightID: UINT8): void {
  let pNode: undo_stack;
  let pUndoInfo: undo_struct;

  if (!gfUndoEnabled)
    return;
  // When executing an undo command (by adding a light or removing one), that command
  // actually tries to add it to the undo list.  So we wrap the execution of the undo
  // command by temporarily setting this flag, so it'll ignore, and not place a new undo
  // command.  When finished, the flag is cleared, and lights are again allowed to be saved
  // in the undo list.
  if (gfIgnoreUndoCmdsForLights)
    return;

  pNode = createUndoStack();
  pUndoInfo = createUndoStruct();

  pUndoInfo.fLightSaved = true;
  // if ubLightRadius is 0, then we don't need to save the light information because we
  // will erase it when it comes time to execute the undo command.
  pUndoInfo.ubLightRadius = iLightRadius;
  pUndoInfo.ubLightID = ubLightID;
  pUndoInfo.iMapIndex = iMapIndex;
  pUndoInfo.pMapTile = <MAP_ELEMENT><unknown>null;

  // Add to undo stack
  pNode.iCmdCount = 1;
  pNode.pData = pUndoInfo;
  pNode.pNext = gpTileUndoStack;
  gpTileUndoStack = pNode;

  CropStackToMaxLength(MAX_UNDO_COMMAND_LENGTH);
}

export function AddToUndoList(iMapIndex: INT32): boolean {
  /* static */ let iCount: INT32 = 1;

  if (!gfUndoEnabled)
    return false;
  if (fNewUndoCmd) {
    iCount = 0;
    fNewUndoCmd = false;
  }

  // Check to see if the tile in question is even on the visible map, then
  // if that is true, then check to make sure we don't already have the mapindex
  // saved in the new binary tree (which only holds unique mapindex values).
  if (GridNoOnVisibleWorldTile(iMapIndex) && AddMapIndexToTree(iMapIndex))

  {
    if (AddToUndoListCmd(iMapIndex, ++iCount))
      return true;
    iCount--;
  }
  return false;
}

function AddToUndoListCmd(iMapIndex: INT32, iCmdCount: INT32): boolean {
  let pNode: undo_stack;
  let pUndoInfo: undo_struct;
  let pData: MAP_ELEMENT;
  let pStructure: STRUCTURE | null;
  let iCoveredMapIndex: INT32;
  let ubLoop: UINT8;

  if ((pNode = createUndoStack()) == null) {
    return false;
  }

  if ((pUndoInfo = createUndoStruct()) == null) {
    return false;
  }

  if ((pData = createMapElement()) == null) {
    return false;
  }

  // Init map element struct
  pData.pLandHead = pData.pLandStart = null;
  pData.pObjectHead = null;
  pData.pStructHead = null;
  pData.pShadowHead = null;
  pData.pMercHead = null;
  pData.pRoofHead = null;
  pData.pOnRoofHead = null;
  pData.pTopmostHead = null;
  pData.pStructureHead = pData.pStructureTail = null;
  pData.sHeight = 0;

  // Copy the world map's tile
  if (CopyMapElementFromWorld(pData, iMapIndex) == false) {
    return false;
  }

  // copy the room number information (it's not in the mapelement structure)
  pUndoInfo.ubRoomNum = gubWorldRoomInfo[iMapIndex];

  pUndoInfo.fLightSaved = false;
  pUndoInfo.ubLightRadius = 0;
  pUndoInfo.ubLightID = 0;
  pUndoInfo.pMapTile = pData;
  pUndoInfo.iMapIndex = iMapIndex;

  pNode.pData = pUndoInfo;
  pNode.iCmdCount = iCmdCount;
  pNode.pNext = gpTileUndoStack;
  gpTileUndoStack = pNode;

  // loop through pData->pStructureHead list
  // for each structure
  //   find the base tile
  //   reference the db structure
  //   if number of tiles > 1
  //     add all covered tiles to undo list
  pStructure = <STRUCTURE><unknown>pData.pStructureHead;
  while (pStructure) {
    for (ubLoop = 1; ubLoop < pStructure.pDBStructureRef.pDBStructure.ubNumberOfTiles; ubLoop++) {
      // this loop won't execute for single-tile structures; for multi-tile structures, we have to
      // add to the undo list all the other tiles covered by the structure
      iCoveredMapIndex = pStructure.sBaseGridNo + pStructure.pDBStructureRef.ppTile[ubLoop].sPosRelToBase;
      AddToUndoList(iCoveredMapIndex);
    }
    pStructure = pStructure.pNext;
  }

  CropStackToMaxLength(MAX_UNDO_COMMAND_LENGTH);

  return true;
}

function CheckMapIndexForMultiTileStructures(usMapIndex: UINT16): void {
  let pStructure: STRUCTURE | null;
  let ubLoop: UINT8;
  let iCoveredMapIndex: INT32;

  pStructure = gpWorldLevelData[usMapIndex].pStructureHead;
  while (pStructure) {
    if (pStructure.pDBStructureRef.pDBStructure.ubNumberOfTiles > 1) {
      for (ubLoop = 0; ubLoop < pStructure.pDBStructureRef.pDBStructure.ubNumberOfTiles; ubLoop++) {
        // for multi-tile structures we have to add, to the undo list, all the other tiles covered by the structure
        if (pStructure.fFlags & STRUCTURE_BASE_TILE) {
          iCoveredMapIndex = usMapIndex + pStructure.pDBStructureRef.ppTile[ubLoop].sPosRelToBase;
        } else {
          iCoveredMapIndex = pStructure.sBaseGridNo + pStructure.pDBStructureRef.ppTile[ubLoop].sPosRelToBase;
        }
        AddToUndoList(iCoveredMapIndex);
      }
    }
    pStructure = pStructure.pNext;
  }
}

function CheckForMultiTilesInTreeAndAddToUndoList(node: MapIndexBinaryTree): void {
  CheckMapIndexForMultiTileStructures(node.usMapIndex);
  if (node.left)
    CheckForMultiTilesInTreeAndAddToUndoList(node.left);
  if (node.right)
    CheckForMultiTilesInTreeAndAddToUndoList(node.right);
}

export function RemoveAllFromUndoList(): boolean {
  ClearUndoMapIndexTree();

  while (gpTileUndoStack != null)
    DeleteTopStackNode();

  return true;
}

export function ExecuteUndoList(): boolean {
  let iCmdCount: INT32;
  let iCurCount: INT32;
  let iUndoMapIndex: INT32;
  let fExitGrid: boolean = false;

  if (!gfUndoEnabled)
    return false;

  // Is there something on the undo stack?
  if (gpTileUndoStack == null)
    return true;

  // Get number of stack entries for this command (top node will tell this)
  iCmdCount = gpTileUndoStack.iCmdCount;

  // Execute each stack node in command, and remove each from stack.
  iCurCount = 0;
  while ((iCurCount < iCmdCount) && (gpTileUndoStack != null)) {
    iUndoMapIndex = gpTileUndoStack.pData.iMapIndex;

    // Find which map tile we are to "undo"
    if (gpTileUndoStack.pData.fLightSaved) {
      // We saved a light, so delete that light
      let sX: INT16;
      let sY: INT16;
      // Turn on this flag so that the following code, when executed, doesn't attempt to
      // add lights to the undo list.  That would cause problems...
      gfIgnoreUndoCmdsForLights = true;
      ({ sX, sY } = ConvertGridNoToXY(iUndoMapIndex));
      if (!gpTileUndoStack.pData.ubLightRadius)
        RemoveLight(sX, sY);
      else
        PlaceLight(gpTileUndoStack.pData.ubLightRadius, sX, sY, gpTileUndoStack.pData.ubLightID);
      // Turn off the flag so lights can again be added to the undo list.
      gfIgnoreUndoCmdsForLights = false;
    } else {
      // We execute the undo command node by simply swapping the contents
      // of the undo's MAP_ELEMENT with the world's element.
      fExitGrid = ExitGridAtGridNo(iUndoMapIndex);
      SwapMapElementWithWorld(iUndoMapIndex, createPropertyPointer(gpTileUndoStack.pData, 'pMapTile'));

      // copy the room number information back
      gubWorldRoomInfo[iUndoMapIndex] = gpTileUndoStack.pData.ubRoomNum;

      // Now we smooth out the changes...
      // SmoothUndoMapTileTerrain( iUndoMapIndex, gpTileUndoStack->pData->pMapTile );
      SmoothAllTerrainTypeRadius(iUndoMapIndex, 1, true);
    }

    // ...trash the top element of the stack...
    DeleteTopStackNode();

    // ...and bump the command counter up by 1
    iCurCount++;

    // Kris:
    // The new cursor system is somehow interfering with the undo stuff.  When
    // an undo is called, the item is erased, but a cursor is added!  I'm quickly
    // hacking around this by erasing all cursors here.
    RemoveAllTopmostsOfTypeRange(iUndoMapIndex, Enum313.FIRSTPOINTERS, Enum313.FIRSTPOINTERS);

    if (fExitGrid && !ExitGridAtGridNo(iUndoMapIndex)) {
      // An exitgrid has been removed, so get rid of the associated indicator.
      RemoveTopmost(iUndoMapIndex, Enum312.FIRSTPOINTERS8);
    } else if (!fExitGrid && ExitGridAtGridNo(iUndoMapIndex)) {
      // An exitgrid has been added, so add the associated indicator
      AddTopmostToTail(iUndoMapIndex, Enum312.FIRSTPOINTERS8);
    }
  }

  return true;
}

function SmoothUndoMapTileTerrain(iWorldTile: INT32, pUndoTile: MAP_ELEMENT): void {
  let pWorldLand: LEVELNODE | null;
  let pUndoLand: LEVELNODE | null;
  let pLand: LEVELNODE | null;
  let pWLand: LEVELNODE | null;
  let uiCheckType: UINT32;
  let uiWCheckType: UINT32;
  let fFound: boolean;

  pUndoLand = pUndoTile.pLandHead;
  pWorldLand = gpWorldLevelData[iWorldTile].pLandHead;

  if (pUndoLand == null) {
    // nothing in the old tile, so smooth the entire land in world's tile
    pLand = gpWorldLevelData[iWorldTile].pLandHead;
    while (pLand != null) {
      uiCheckType = GetTileType(pLand.usIndex);
      SmoothTerrainRadius(iWorldTile, uiCheckType, 1, true);
      pLand = pLand.pNext;
    }
  } else if (gpWorldLevelData[iWorldTile].pLandHead == null) {
    // Nothing in world's tile, so smooth out the land in the old tile.
    pLand = pUndoLand;
    while (pLand != null) {
      uiCheckType = GetTileType(pLand.usIndex);
      SmoothTerrainRadius(iWorldTile, uiCheckType, 1, true);
      pLand = pLand.pNext;
    }
  } else {
    pLand = pUndoLand;
    while (pLand != null) {
      uiCheckType = GetTileType(pLand.usIndex);

      fFound = false;
      pWLand = pWorldLand;
      while (pWLand != null && !fFound) {
        uiWCheckType = GetTileType(pWLand.usIndex);

        if (uiCheckType == uiWCheckType)
          fFound = true;

        pWLand = pWLand.pNext;
      }

      if (!fFound)
        SmoothTerrainRadius(iWorldTile, uiCheckType, 1, true);

      pLand = pLand.pNext;
    }

    pWLand = pWorldLand;
    while (pWLand != null) {
      uiWCheckType = GetTileType(pWLand.usIndex);

      fFound = false;
      pLand = pUndoLand;
      while (pLand != null && !fFound) {
        uiCheckType = GetTileType(pLand.usIndex);

        if (uiCheckType == uiWCheckType)
          fFound = true;

        pLand = pLand.pNext;
      }

      if (!fFound)
        SmoothTerrainRadius(iWorldTile, uiWCheckType, 1, true);

      pWLand = pWLand.pNext;
    }
  }
}

// Because of the potentially huge amounts of memory that can be allocated due to the inefficient
// undo methods coded by Bret, it is feasible that it could fail.  Instead of using assertions to
// terminate the program, destroy the memory allocated thusfar.
function DeleteMapElementContentsAfterCreationFail(pNewMapElement: MAP_ELEMENT): void {
  let pLevelNode: LEVELNODE | null;
  let pStructure: STRUCTURE | null;
  let x: INT32;
  for (x = 0; x < 9; x++) {
    if (x == 1)
      continue;
    pLevelNode = pNewMapElement.pLevelNodes[x];
    while (pLevelNode) {
      let temp: LEVELNODE | null;
      temp = pLevelNode;
      pLevelNode = pLevelNode.pNext;
      temp = null;
    }
  }
  pStructure = pNewMapElement.pStructureHead;
  while (pStructure) {
    let temp: STRUCTURE | null;
    temp = pStructure;
    pStructure = pStructure.pNext;
    temp = null;
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
function CopyMapElementFromWorld(pNewMapElement: MAP_ELEMENT, iMapIndex: INT32): boolean {
  let pOldMapElement: MAP_ELEMENT;
  let pOldLevelNode: LEVELNODE | null;
  let pLevelNode: LEVELNODE;
  let pNewLevelNode: LEVELNODE | null;
  let tail: LEVELNODE | null;
  let x: INT32;

  let pOldStructure: STRUCTURE | null;

  // Get a pointer to the current map index
  pOldMapElement = gpWorldLevelData[iMapIndex];

  // Save the structure information from the mapelement
  pOldStructure = pOldMapElement.pStructureHead;
  if (pOldStructure) {
    let pNewStructure: STRUCTURE | null;
    let pStructure: STRUCTURE;
    let tail: STRUCTURE | null;
    tail = null;
    pNewStructure = null;
    while (pOldStructure) {
      pStructure = createStructure();
      if (!pStructure) {
        DeleteMapElementContentsAfterCreationFail(pNewMapElement);
        return false;
      }
      if (!tail) {
        // first node in structure list
        tail = pStructure;
        tail = pOldStructure;
        tail.pPrev = null;
        tail.pNext = null;
      } else {
        // add to the end of the levelnode list
        tail.pNext = pStructure;
        pStructure = pOldStructure;
        pStructure.pPrev = tail;
        pStructure.pNext = null;
        tail = tail.pNext;
      }
      // place the new node inside of the new map element
      if (!pNewStructure) {
        pNewMapElement.pStructureHead = pStructure;
        pNewStructure = pStructure;
      } else {
        pNewStructure.pNext = pStructure;
        pNewStructure = pNewStructure.pNext;
      }
      pOldStructure = pOldStructure.pNext;
    }
    if (tail) {
      pNewMapElement.pStructureTail = tail;
    }
  }

  // For each of the 9 levelnodes, save each one
  // except for levelnode[1] which is a pointer to the first land to render.
  for (x = 0; x < 9; x++) {
    if (x == 1 || x == 5) // skip the pLandStart and pMercLevel LEVELNODES
      continue;
    tail = null;
    pOldLevelNode = pOldMapElement.pLevelNodes[x];
    pNewLevelNode = null;
    while (pOldLevelNode) {
      // copy the level node
      pLevelNode = createLevelNode();
      if (!pLevelNode) {
        DeleteMapElementContentsAfterCreationFail(pNewMapElement);
        return false;
      }
      if (!tail) {
        // first node in levelnode list
        tail = pLevelNode;
        tail = pOldLevelNode;
        if (!x) // land layer only
          tail.pPrevNode = null;
        tail.pNext = null;
      } else {
        // add to the end of the levelnode list
        tail.pNext = pLevelNode;
        pLevelNode = pOldLevelNode;
        if (!x) // land layer only
          pLevelNode.pPrevNode = tail;
        pLevelNode.pNext = null;
        tail = tail.pNext;
      }
      // place the new node inside of the new map element
      if (!pNewLevelNode) {
        pNewMapElement.pLevelNodes[x] = pLevelNode;
        pNewLevelNode = pLevelNode;
      } else {
        pNewLevelNode.pNext = pLevelNode;
        pNewLevelNode = pNewLevelNode.pNext;
      }
      // Handle levelnode layer specific stuff
      switch (x) {
        case 0: // LAND LAYER
          if (pOldLevelNode == pOldMapElement.pLandStart) {
            // set the new landstart to point to the new levelnode.
            pNewMapElement.pLandStart = pNewLevelNode;
          }
          break;
        case 2: // OBJECT LAYER
          if (pOldLevelNode.pItemPool) {
            // save the item pool?
                                          // pNewLevelNode->pItemPool = (ITEM_POOL*)MemAlloc( sizeof( ITEM_POOL ) );
          }
          break;
        case 3: // STRUCT LAYER
        case 6: // ROOF LAYER
        case 7: // ON ROOF LAYER
          if (pOldLevelNode.pStructureData) {
            // make sure the structuredata pointer points to the parallel structure
            let pOld: STRUCTURE | null;
            let pNew: STRUCTURE | null;
            // both lists are exactly the same size and contain the same information,
            // but the addresses are different.  We will traverse the old list until
            // we find the match, then
            pOld = pOldMapElement.pStructureHead;
            pNew = pNewMapElement.pStructureHead;
            while (pOld) {
              Assert(pNew);
              if (pOld == pOldLevelNode.pStructureData) {
                pNewLevelNode.pStructureData = pNew;
                break;
              }
              pOld = pOld.pNext;
              pNew = pNew.pNext;
            }
            // Kris:
            // If this assert should fail, that means there is something wrong with
            // the preservation of the structure data within the mapelement.
            if (pOld != pOldLevelNode.pStructureData) {
              // OUCH!!! THIS IS HAPPENING.  DISABLED IT FOR LINDA'S SAKE
              Assert(1);
            }
          }
          break;
      }
      // Done, go to next node in this level
      pOldLevelNode = pOldLevelNode.pNext;
    }
    // Done, go to next level
  }

  // Save the rest of the information in the mapelement.
  pNewMapElement.uiFlags = pOldMapElement.uiFlags;
  pNewMapElement.sSumRealLights[0] = pOldMapElement.sSumRealLights[0];
  pNewMapElement.sSumRealLights[1] = pOldMapElement.sSumRealLights[1];
  pNewMapElement.sHeight = pOldMapElement.sHeight;
  pNewMapElement.ubTerrainID = pOldMapElement.ubTerrainID;
  pNewMapElement.ubReservedSoldierID = pOldMapElement.ubReservedSoldierID;

  return true;
}

function SwapMapElementWithWorld(iMapIndex: INT32, pUndoMapElement: Pointer<MAP_ELEMENT>): boolean {
  let pCurrentMapElement: MAP_ELEMENT;
  let TempMapElement: MAP_ELEMENT;

  pCurrentMapElement = gpWorldLevelData[iMapIndex];

  // Transfer the merc level node from the current world to the undo mapelement
  // that will replace it.  We do this, because mercs aren't associated with
  // undo commands.
  pUndoMapElement.value.pMercHead = gpWorldLevelData[iMapIndex].pMercHead;
  gpWorldLevelData[iMapIndex].pMercHead = null;

  // Swap the mapelements
  TempMapElement = pCurrentMapElement;
  pCurrentMapElement = pUndoMapElement.value;
  pUndoMapElement.value = TempMapElement;

  return true;
}

export function DetermineUndoState(): void {
  // Reset the undo command mode if we released the left button.
  if (!fNewUndoCmd) {
    if (!gfLeftButtonState && !gfCurrentSelectionWithRightButton || !gfRightButtonState && gfCurrentSelectionWithRightButton) {
      // Clear the mapindex binary tree list, and set up flag for new undo command.
      fNewUndoCmd = true;
      ClearUndoMapIndexTree();
    }
  }
}

}
