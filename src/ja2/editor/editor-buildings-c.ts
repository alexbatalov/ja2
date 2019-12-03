namespace ja2 {

export let fBuildingShowRoofs: boolean;
export let fBuildingShowWalls: boolean;
export let fBuildingShowRoomInfo: boolean;
export let usCurrentMode: UINT16;
export let gubCurrRoomNumber: UINT8;
export let gubMaxRoomNumber: UINT8;
export let gfEditingDoor: boolean;

// BEGINNNING OF BUILDING INITIALIZATION FUNCTIONS
export function GameInitEditorBuildingInfo(): void {
  fBuildingShowRoofs = true;
  fBuildingShowWalls = true;
  fBuildingShowRoomInfo = false;
  usCurrentMode = Enum32.BUILDING_PLACE_WALLS;
  gubCurrRoomNumber = gubMaxRoomNumber = 1;
}

// BEGINNING OF BUILDING UTILITY FUNCTIONS
export function UpdateRoofsView(): void {
  let x: INT32;
  let usType: UINT16;
  for (x = 0; x < WORLD_MAX; x++) {
    for (usType = Enum313.FIRSTROOF; usType <= LASTSLANTROOF; usType++) {
      HideStructOfGivenType(x, usType, (!fBuildingShowRoofs));
    }
  }
  gfRenderWorld = true;
}

export function UpdateWallsView(): void {
  let cnt: INT32;
  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    if (fBuildingShowWalls) {
      RemoveWallLevelnodeFlags(cnt, LEVELNODE_HIDDEN);
    } else {
      SetWallLevelnodeFlags(cnt, LEVELNODE_HIDDEN);
    }
  }
  gfRenderWorld = true;
}

export function UpdateBuildingsInfo(): void {
  // print the headers on top of the columns
  SetFont(SMALLCOMPFONT());
  SetFontForeground(FONT_RED);
  mprintfEditor(112, 362, "TOGGLE");
  mprintfEditor(114, 372, "VIEWS");
  SetFontForeground(FONT_YELLOW);
  mprintfEditor(185, 362, "SELECTION METHOD");
  SetFontForeground(FONT_LTGREEN);
  mprintfEditor(290, 362, "SMART METHOD");
  SetFontForeground(FONT_LTBLUE);
  mprintfEditor(390, 362, "BUILDING METHOD");
  SetFontForeground(FONT_GRAY2);
  mprintfEditor(437, 404, "Room#");
}

// Uses a recursive method to elimate adjacent tiles of structure information.
// The code will attempt to delete the current mapindex, then search using this method:
// 1) if there isn't structure info here, return.
// 2) if there is structure info here, delete it now.
// 3) KillBuilding at x-1, y.
// 4) KillBuilding at x  , y-1.
// 5) KillBuilding at x+1, y.
// 6) KillBuilding at x  , y+1.
export function KillBuilding(iMapIndex: UINT32): void {
  let fFound: boolean = false;

  if (!gfBasement)
    fFound = fFound || RemoveAllRoofsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, LASTITEM);
  fFound = fFound || RemoveAllLandsOfTypeRange(iMapIndex, Enum313.FIRSTFLOOR, LASTFLOOR);

  EraseBuilding(iMapIndex);
  gubWorldRoomInfo[iMapIndex] = 0;

  if (!fFound) {
    if (gfBasement)
      RebuildRoof(iMapIndex, 0);
    return;
  }

  if (GridNoOnVisibleWorldTile((iMapIndex - WORLD_COLS)))
    KillBuilding(iMapIndex - WORLD_COLS);
  if (GridNoOnVisibleWorldTile((iMapIndex + WORLD_COLS)))
    KillBuilding(iMapIndex + WORLD_COLS);
  if (GridNoOnVisibleWorldTile((iMapIndex + 1)))
    KillBuilding(iMapIndex + 1);
  if (GridNoOnVisibleWorldTile((iMapIndex - 1)))
    KillBuilding(iMapIndex - 1);

  if (gfBasement)
    RebuildRoof(iMapIndex, 0);
}

export let gpBuildingLayoutList: BUILDINGLAYOUTNODE | null /* Pointer<BUILDINGLAYOUTNODE> */ = null;
export let gsBuildingLayoutAnchorGridNo: INT16 = -1;

export function DeleteBuildingLayout(): void {
  let curr: BUILDINGLAYOUTNODE | null;
  // Erases the cursors associated with them.
  RemoveBuildingLayout();
  while (gpBuildingLayoutList) {
    curr = gpBuildingLayoutList;
    gpBuildingLayoutList = gpBuildingLayoutList.next;
    MemFree(curr);
  }
  gpBuildingLayoutList = null;
  gsBuildingLayoutAnchorGridNo = -1;
}

function BuildLayout(iMapIndex: INT32, iOffset: INT32): void {
  let curr: BUILDINGLAYOUTNODE | null;
  // First, validate the gridno
  iMapIndex += iOffset;
  if (iMapIndex < 0 && iMapIndex >= WORLD_COLS * WORLD_ROWS)
    return;
  // Now, check if there is a building here
  if (!BuildingAtGridNo(iMapIndex)) {
    if (iOffset == 1 && !BuildingAtGridNo(iMapIndex - 1))
      return;
    if (iOffset == WORLD_COLS && !BuildingAtGridNo(iMapIndex - WORLD_COLS))
      return;
    if (iOffset == -1 && !GetVerticalWall(iMapIndex))
      return;
    if (iOffset == -WORLD_COLS && !GetHorizontalWall(iMapIndex))
      return;
  }
  // Now, check to make sure this gridno hasn't already been processed.
  curr = gpBuildingLayoutList;
  while (curr) {
    if (iMapIndex == curr.sGridNo)
      return;
    curr = curr.next;
  }
  // Good, it hasn't, so process it and add it to the head of the list.
  curr = createBuildingLayoutNode();
  Assert(curr);
  curr.sGridNo = iMapIndex;
  curr.next = gpBuildingLayoutList;
  gpBuildingLayoutList = curr;

  // Use recursion to process the remainder.
  BuildLayout(iMapIndex, -WORLD_COLS);
  BuildLayout(iMapIndex, -1);
  BuildLayout(iMapIndex, 1);
  BuildLayout(iMapIndex, WORLD_COLS);
}

// The first step is copying a building.  After that, it either must be pasted or moved.
export function CopyBuilding(iMapIndex: INT32): void {
  AssertMsg(!gpBuildingLayoutList, "Error:  Attempting to copy building multiple times.");

  // First step is to determine if we have a building in the area that we click.  If not, do nothing.
  if (!BuildingAtGridNo(iMapIndex))
    return;
  // Okay, a building does exist here to some undetermined capacity.
  // Allocate the basic structure, then calculate the layout.  The head node is
  gpBuildingLayoutList = createBuildingLayoutNode();
  Assert(gpBuildingLayoutList);
  gpBuildingLayoutList.sGridNo = iMapIndex;
  gpBuildingLayoutList.next = null;

  // Set the anchor point for this building -- this is where the user clicked.
  gsBuildingLayoutAnchorGridNo = iMapIndex;

  // Now, recursively expand out while adding unique gridnos to our list.  The recursion will
  // terminate when complete.
  BuildLayout(iMapIndex, -WORLD_COLS);
  BuildLayout(iMapIndex, -1);
  BuildLayout(iMapIndex, 1);
  BuildLayout(iMapIndex, WORLD_COLS);

  // We have our layout.  Now depending on the mode, we will either move the building or
  // copy it.  The layout automatically gets deleted as soon as the user releases the mouse
  // button.
}

// depending on the offset, we will either sort in increasing order, or decreasing order.
// This will prevent overlapping problems.
function SortBuildingLayout(iMapIndex: INT32): void {
  let head: BUILDINGLAYOUTNODE | null = null;
  let curr: BUILDINGLAYOUTNODE | null = null;
  let prev: BUILDINGLAYOUTNODE | null = null;
  let prevBest: BUILDINGLAYOUTNODE | null = null;
  let best: BUILDINGLAYOUTNODE | null = null;
  let iBestIndex: INT32;
  head = null;
  if (iMapIndex < gsBuildingLayoutAnchorGridNo) {
    // Forward sort (in increasing order)
    while (gpBuildingLayoutList) {
      iBestIndex = -1;
      curr = gpBuildingLayoutList;
      prev = null;
      while (curr) {
        if (iBestIndex < curr.sGridNo) {
          iBestIndex = curr.sGridNo;
          prevBest = prev;
          best = curr;
        }
        prev = curr;
        curr = curr.next;
      }
      // detach node from real list
      if (prevBest)
        prevBest.next = (<BUILDINGLAYOUTNODE>best).next;
      if (best == gpBuildingLayoutList)
        gpBuildingLayoutList = gpBuildingLayoutList.next;
      // insert node into temp sorted list
      (<BUILDINGLAYOUTNODE>best).next = head;
      head = best;
    }
  } else {
    // Reverse sort (in decreasing order)
    while (gpBuildingLayoutList) {
      iBestIndex = 100000;
      curr = gpBuildingLayoutList;
      prev = null;
      while (curr) {
        if (iBestIndex > curr.sGridNo) {
          iBestIndex = curr.sGridNo;
          prevBest = prev;
          best = curr;
        }
        prev = curr;
        curr = curr.next;
      }
      // detach node from real list
      if (prevBest)
        prevBest.next = (<BUILDINGLAYOUTNODE>best).next;
      if (best == gpBuildingLayoutList)
        gpBuildingLayoutList = gpBuildingLayoutList.next;
      // insert node into temp sorted list
      (<BUILDINGLAYOUTNODE>best).next = head;
      head = best;
    }
  }
  // Now assign the newly sorted list back to the real list.
  gpBuildingLayoutList = head;
}

function PasteMapElementToNewMapElement(iSrcGridNo: INT32, iDstGridNo: INT32): void {
  let pSrcMapElement: MAP_ELEMENT;
  let pNode: LEVELNODE | null;
  let usType: UINT16;

  DeleteStuffFromMapTile(iDstGridNo);
  DeleteAllLandLayers(iDstGridNo);

  // Get a pointer to the src mapelement
  pSrcMapElement = gpWorldLevelData[iSrcGridNo];

  // Go through each levelnode, and paste the info into the new gridno
  pNode = pSrcMapElement.pLandHead;
  while (pNode) {
    if (pNode == pSrcMapElement.pLandStart)
      gpWorldLevelData[iDstGridNo].pLandStart = AddLandToTail(iDstGridNo, pNode.usIndex);
    else
      AddLandToTail(iDstGridNo, pNode.usIndex);
    pNode = pNode.pNext;
  }
  pNode = pSrcMapElement.pObjectHead;
  while (pNode) {
    AddObjectToTail(iDstGridNo, pNode.usIndex);
    pNode = pNode.pNext;
  }
  pNode = pSrcMapElement.pStructHead;
  while (pNode) {
    AddStructToTail(iDstGridNo, pNode.usIndex);
    pNode = pNode.pNext;
  }
  pNode = pSrcMapElement.pShadowHead;
  while (pNode) {
    AddShadowToTail(iDstGridNo, pNode.usIndex);
    pNode = pNode.pNext;
  }
  pNode = pSrcMapElement.pRoofHead;
  while (pNode) {
    AddRoofToTail(iDstGridNo, pNode.usIndex);
    pNode = pNode.pNext;
  }
  pNode = pSrcMapElement.pOnRoofHead;
  while (pNode) {
    AddOnRoofToTail(iDstGridNo, pNode.usIndex);
    pNode = pNode.pNext;
  }
  pNode = pSrcMapElement.pTopmostHead;
  while (pNode) {
    if (pNode.usIndex != Enum312.FIRSTPOINTERS1)
      AddTopmostToTail(iDstGridNo, pNode.usIndex);
    pNode = pNode.pNext;
  }
  for (usType = Enum313.FIRSTROOF; usType <= LASTSLANTROOF; usType++) {
    HideStructOfGivenType(iDstGridNo, usType, (!fBuildingShowRoofs));
  }
}

export function MoveBuilding(iMapIndex: INT32): void {
  let curr: BUILDINGLAYOUTNODE | null;
  let iOffset: INT32;
  if (!gpBuildingLayoutList)
    return;
  SortBuildingLayout(iMapIndex);
  iOffset = iMapIndex - gsBuildingLayoutAnchorGridNo;
  // First time, set the undo gridnos to everything effected.
  curr = gpBuildingLayoutList;
  while (curr) {
    AddToUndoList(curr.sGridNo);
    AddToUndoList(curr.sGridNo + iOffset);
    curr = curr.next;
  }
  // Now, move the building
  curr = gpBuildingLayoutList;
  while (curr) {
    PasteMapElementToNewMapElement(curr.sGridNo, curr.sGridNo + iOffset);
    DeleteStuffFromMapTile(curr.sGridNo);
    curr = curr.next;
  }
  MarkWorldDirty();
}

export function PasteBuilding(iMapIndex: INT32): void {
  let curr: BUILDINGLAYOUTNODE | null;
  let iOffset: INT32;
  if (!gpBuildingLayoutList)
    return;
  SortBuildingLayout(iMapIndex);
  iOffset = iMapIndex - gsBuildingLayoutAnchorGridNo;
  curr = gpBuildingLayoutList;
  // First time, set the undo gridnos to everything effected.
  while (curr) {
    AddToUndoList(curr.sGridNo);
    AddToUndoList(curr.sGridNo + iOffset);
    curr = curr.next;
  }
  // Now, paste the building (no smoothing)
  curr = gpBuildingLayoutList;
  while (curr) {
    PasteMapElementToNewMapElement(curr.sGridNo, curr.sGridNo + iOffset);
    curr = curr.next;
  }
  MarkWorldDirty();
}

interface ROOFNODE {
  iMapIndex: INT32;
  next: ROOFNODE | null /* Pointer<ROOFNODE> */;
}

function createRoofNode(): ROOFNODE {
  return {
    iMapIndex: 0,
    next: null,
  };
}

let gpRoofList: ROOFNODE | null /* Pointer<ROOFNODE> */ = null;

function ReplaceRoof(iMapIndex: INT32, usRoofType: UINT16): void {
  let curr: ROOFNODE | null;
  // First, validate the gridno
  if (iMapIndex < 0 && iMapIndex >= WORLD_COLS * WORLD_ROWS)
    return;
  // Now, check if there is a floor here
  if (!FloorAtGridNo(iMapIndex))
    return;
  // Now, check to make sure this gridno hasn't already been processed.
  curr = gpRoofList;
  while (curr) {
    if (iMapIndex == curr.iMapIndex)
      return;
    curr = curr.next;
  }
  // Good, it hasn't, so process it and add it to the head of the list.
  curr = createRoofNode();
  Assert(curr);
  curr.iMapIndex = iMapIndex;
  curr.next = gpRoofList;
  gpRoofList = curr;

  RebuildRoofUsingFloorInfo(iMapIndex, usRoofType);

  // Use recursion to process the remainder.
  ReplaceRoof(iMapIndex - WORLD_COLS, usRoofType);
  ReplaceRoof(iMapIndex + WORLD_COLS, usRoofType);
  ReplaceRoof(iMapIndex - 1, usRoofType);
  ReplaceRoof(iMapIndex + 1, usRoofType);
}

export function ReplaceBuildingWithNewRoof(iMapIndex: INT32): void {
  let usRoofType: UINT16;
  let curr: ROOFNODE | null;
  // Not in normal editor mode, then can't do it.
  if (gfBasement || gfCaves)
    return;
  // if we don't have a floor here, then we can't replace the roof!
  if (!FloorAtGridNo(iMapIndex))
    return;
  // Extract the selected roof type.
  usRoofType = SelSingleNewRoof[iCurBank].uiObject;

  // now start building a linked list of all nodes visited -- start the first node.
  gpRoofList = createRoofNode();
  Assert(gpRoofList);
  gpRoofList.iMapIndex = iMapIndex;
  gpRoofList.next = null;
  RebuildRoofUsingFloorInfo(iMapIndex, usRoofType);

  // Use recursion to process the remainder.
  ReplaceRoof(iMapIndex - WORLD_COLS, usRoofType);
  ReplaceRoof(iMapIndex + WORLD_COLS, usRoofType);
  ReplaceRoof(iMapIndex - 1, usRoofType);
  ReplaceRoof(iMapIndex + 1, usRoofType);

  // Done, so delete the list.
  while (gpRoofList) {
    curr = gpRoofList;
    gpRoofList = gpRoofList.next;
  }
  gpRoofList = null;
}

// internal door editing vars.
let iDoorMapIndex: INT32 = 0;
const enum Enum34 {
  DOOR_BACKGROUND,
  DOOR_OKAY,
  DOOR_CANCEL,
  DOOR_LOCKED,
  NUM_DOOR_BUTTONS,
}
let iDoorButton: INT32[] /* [NUM_DOOR_BUTTONS] */ = createArray(Enum34.NUM_DOOR_BUTTONS, 0);
let DoorRegion: MOUSE_REGION = createMouseRegion();

export function InitDoorEditing(iMapIndex: INT32): void {
  let pDoor: DOOR | null;
  if (!DoorAtGridNo(iMapIndex) && !OpenableAtGridNo(iMapIndex))
    return;
  gfEditingDoor = true;
  iDoorMapIndex = iMapIndex;
  DisableEditorTaskbar();
  MSYS_DefineRegion(DoorRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGH - 2, 0, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  iDoorButton[Enum34.DOOR_BACKGROUND] = CreateTextButton('', 0, 0, 0, BUTTON_USE_DEFAULT, 200, 130, 240, 100, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH - 1, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
  DisableButton(iDoorButton[Enum34.DOOR_BACKGROUND]);
  SpecifyDisabledButtonStyle(iDoorButton[Enum34.DOOR_BACKGROUND], Enum29.DISABLED_STYLE_NONE);
  iDoorButton[Enum34.DOOR_OKAY] = CreateTextButton("Okay", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 330, 195, 50, 30, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), DoorOkayCallback);
  iDoorButton[Enum34.DOOR_CANCEL] = CreateTextButton("Cancel", FONT12POINT1(), FONT_BLACK, FONT_BLACK, BUTTON_USE_DEFAULT, 385, 195, 50, 30, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH, DEFAULT_MOVE_CALLBACK(), DoorCancelCallback);
  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);
  AddTextInputField(210, 155, 25, 16, MSYS_PRIORITY_HIGH, "0", 3, INPUTTYPE_NUMERICSTRICT);
  AddTextInputField(210, 175, 25, 16, MSYS_PRIORITY_HIGH, "0", 2, INPUTTYPE_NUMERICSTRICT);
  AddTextInputField(210, 195, 25, 16, MSYS_PRIORITY_HIGH, "0", 2, INPUTTYPE_NUMERICSTRICT);
  iDoorButton[Enum34.DOOR_LOCKED] = CreateCheckBoxButton(210, 215, "EDITOR//SmCheckbox.sti", MSYS_PRIORITY_HIGH, DoorToggleLockedCallback);

  pDoor = FindDoorInfoAtGridNo(iDoorMapIndex);
  if (pDoor) {
    if (pDoor.fLocked) {
      ButtonList[iDoorButton[Enum34.DOOR_LOCKED]].uiFlags |= BUTTON_CLICKED_ON;
    }
    SetInputFieldStringWithNumericStrictValue(0, pDoor.ubLockID);
    SetInputFieldStringWithNumericStrictValue(1, pDoor.ubTrapID);
    SetInputFieldStringWithNumericStrictValue(2, pDoor.ubTrapLevel);
  } else {
    ButtonList[iDoorButton[Enum34.DOOR_LOCKED]].uiFlags |= BUTTON_CLICKED_ON;
  }
}

export function ExtractAndUpdateDoorInfo(): void {
  let pNode: LEVELNODE | null;
  let num: INT32;
  let door: DOOR = createDoor();
  let fCursor: boolean = false;
  let fCursorExists: boolean = false;

  door.sGridNo = iDoorMapIndex;

  num = Math.min(GetNumericStrictValueFromField(0), NUM_LOCKS - 1);
  door.ubLockID = num;
  SetInputFieldStringWithNumericStrictValue(0, num);
  if (num >= 0)
    fCursor = true;

  num = Math.min(Math.max(GetNumericStrictValueFromField(1), 0), 10);
  door.ubTrapID = num;
  SetInputFieldStringWithNumericStrictValue(1, num);
  if (num)
    fCursor = true;

  num = Math.min(Math.max(GetNumericStrictValueFromField(2), 0), 20);
  if (door.ubTrapID && !num)
    num = 1; // Can't have a trap without a traplevel!
  door.ubTrapLevel = num;
  SetInputFieldStringWithNumericStrictValue(2, num);
  if (num)
    fCursor = true;

  if (ButtonList[iDoorButton[Enum34.DOOR_LOCKED]].uiFlags & BUTTON_CLICKED_ON) {
    door.fLocked = true;
  } else {
    door.fLocked = false;
  }

  // Find out if we have a rotating key cursor (we will either add one or remove one)
  pNode = gpWorldLevelData[iDoorMapIndex].pTopmostHead;
  while (pNode) {
    if (pNode.usIndex == Enum312.ROTATINGKEY1) {
      fCursorExists = true;
      break;
    }
    pNode = pNode.pNext;
  }
  if (fCursor) {
    // we have a valid door, so add it (or replace existing)
    if (!fCursorExists)
      AddTopmostToHead(iDoorMapIndex, Enum312.ROTATINGKEY1);
    // If the door already exists, the new information will replace it.
    AddDoorInfoToTable(door);
  } else {
    // if a door exists here, remove it.
    if (fCursorExists)
      RemoveAllTopmostsOfTypeRange(iDoorMapIndex, Enum313.ROTATINGKEY, Enum313.ROTATINGKEY);
    RemoveDoorInfoFromTable(iDoorMapIndex);
  }
}

export function FindNextLockedDoor(): void {
  let pDoor: DOOR | null;
  let i: INT32;
  for (i = iDoorMapIndex + 1; i < WORLD_MAX; i++) {
    pDoor = FindDoorInfoAtGridNo(i);
    if (pDoor) {
      CenterScreenAtMapIndex(i);
      iDoorMapIndex = i;
      return;
    }
  }
  for (i = 0; i <= iDoorMapIndex; i++) {
    pDoor = FindDoorInfoAtGridNo(i);
    if (pDoor) {
      CenterScreenAtMapIndex(i);
      iDoorMapIndex = i;
      return;
    }
  }
}

export function RenderDoorEditingWindow(): void {
  InvalidateRegion(200, 130, 440, 230);
  SetFont(FONT10ARIAL());
  SetFontForeground(FONT_YELLOW);
  SetFontShadow(FONT_NEARBLACK);
  SetFontBackground(0);
  mprintf(210, 140, "Editing lock attributes at map index %d.", iDoorMapIndex);

  SetFontForeground(FONT_GRAY2);
  mprintf(238, 160, "Lock ID");
  mprintf(238, 180, "Trap Type");
  mprintf(238, 200, "Trap Level");
  mprintf(238, 218, "Locked");
}

export function KillDoorEditing(): void {
  let i: INT32;
  EnableEditorTaskbar();
  MSYS_RemoveRegion(DoorRegion);
  for (i = 0; i < Enum34.NUM_DOOR_BUTTONS; i++)
    RemoveButton(iDoorButton[i]);
  gfEditingDoor = false;
  KillTextInputMode();
}

function DoorOkayCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ExtractAndUpdateDoorInfo();
    KillDoorEditing();
  }
}

function DoorCancelCallback(btn: GUI_BUTTON, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    KillDoorEditing();
  }
}

function DoorToggleLockedCallback(btn: GUI_BUTTON, reason: INT32): void {
  // handled in ExtractAndUpdateDoorInfo();
}

export function AddLockedDoorCursors(): void {
  let pDoor: DOOR;
  let i: INT32;
  for (i = 0; i < gubNumDoors; i++) {
    pDoor = DoorTable[i];
    AddTopmostToHead(pDoor.sGridNo, Enum312.ROTATINGKEY1);
  }
}

export function RemoveLockedDoorCursors(): void {
  let pDoor: DOOR;
  let i: INT32;
  let pNode: LEVELNODE | null;
  let pTemp: LEVELNODE;
  for (i = 0; i < gubNumDoors; i++) {
    pDoor = DoorTable[i];
    pNode = gpWorldLevelData[pDoor.sGridNo].pTopmostHead;
    while (pNode) {
      if (pNode.usIndex == Enum312.ROTATINGKEY1) {
        pTemp = pNode;
        pNode = pNode.pNext;
        RemoveTopmost(pDoor.sGridNo, pTemp.usIndex);
      } else
        pNode = pNode.pNext;
    }
  }
}

export function SetupTextInputForBuildings(): void {
  let str: string /* UINT16[4] */;
  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);
  AddUserInputField(null); // just so we can use short cut keys while not typing.
  str = swprintf("%d", gubMaxRoomNumber);
  AddTextInputField(410, 400, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
}

export function ExtractAndUpdateBuildingInfo(): void {
  let str: string /* UINT16[4] */;
  let temp: INT32;
  // extract light1 colors
  temp = Math.min(GetNumericStrictValueFromField(1), 255);
  if (temp != -1) {
    gubCurrRoomNumber = temp;
  } else {
    gubCurrRoomNumber = 0;
  }
  str = swprintf("%d", gubCurrRoomNumber);
  SetInputFieldStringWith16BitString(1, str);
  SetActiveField(0);
}

}
