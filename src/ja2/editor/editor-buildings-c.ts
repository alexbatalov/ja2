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
    fFound |= RemoveAllRoofsOfTypeRange(iMapIndex, Enum313.FIRSTTEXTURE, LASTITEM);
  fFound |= RemoveAllLandsOfTypeRange(iMapIndex, Enum313.FIRSTFLOOR, LASTFLOOR);

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

export let gpBuildingLayoutList: Pointer<BUILDINGLAYOUTNODE> = null;
export let gsBuildingLayoutAnchorGridNo: INT16 = -1;

export function DeleteBuildingLayout(): void {
  let curr: Pointer<BUILDINGLAYOUTNODE>;
  // Erases the cursors associated with them.
  RemoveBuildingLayout();
  while (gpBuildingLayoutList) {
    curr = gpBuildingLayoutList;
    gpBuildingLayoutList = gpBuildingLayoutList.value.next;
    MemFree(curr);
  }
  gpBuildingLayoutList = null;
  gsBuildingLayoutAnchorGridNo = -1;
}

function BuildLayout(iMapIndex: INT32, iOffset: INT32): void {
  let curr: Pointer<BUILDINGLAYOUTNODE>;
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
    if (iMapIndex == curr.value.sGridNo)
      return;
    curr = curr.value.next;
  }
  // Good, it hasn't, so process it and add it to the head of the list.
  curr = MemAlloc(sizeof(BUILDINGLAYOUTNODE));
  Assert(curr);
  curr.value.sGridNo = iMapIndex;
  curr.value.next = gpBuildingLayoutList;
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
  gpBuildingLayoutList = MemAlloc(sizeof(BUILDINGLAYOUTNODE));
  Assert(gpBuildingLayoutList);
  gpBuildingLayoutList.value.sGridNo = iMapIndex;
  gpBuildingLayoutList.value.next = null;

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
function SortBuildingLayout(iMapIndex): void {
  let head: Pointer<BUILDINGLAYOUTNODE>;
  let curr: Pointer<BUILDINGLAYOUTNODE>;
  let prev: Pointer<BUILDINGLAYOUTNODE>;
  let prevBest: Pointer<BUILDINGLAYOUTNODE>;
  let best: Pointer<BUILDINGLAYOUTNODE>;
  let iBestIndex: INT32;
  head = null;
  if (iMapIndex < gsBuildingLayoutAnchorGridNo) {
    // Forward sort (in increasing order)
    while (gpBuildingLayoutList) {
      iBestIndex = -1;
      curr = gpBuildingLayoutList;
      prev = null;
      while (curr) {
        if (iBestIndex < curr.value.sGridNo) {
          iBestIndex = curr.value.sGridNo;
          prevBest = prev;
          best = curr;
        }
        prev = curr;
        curr = curr.value.next;
      }
      // detach node from real list
      if (prevBest)
        prevBest.value.next = best.value.next;
      if (best == gpBuildingLayoutList)
        gpBuildingLayoutList = gpBuildingLayoutList.value.next;
      // insert node into temp sorted list
      best.value.next = head;
      head = best;
    }
  } else {
    // Reverse sort (in decreasing order)
    while (gpBuildingLayoutList) {
      iBestIndex = 100000;
      curr = gpBuildingLayoutList;
      prev = null;
      while (curr) {
        if (iBestIndex > curr.value.sGridNo) {
          iBestIndex = curr.value.sGridNo;
          prevBest = prev;
          best = curr;
        }
        prev = curr;
        curr = curr.value.next;
      }
      // detach node from real list
      if (prevBest)
        prevBest.value.next = best.value.next;
      if (best == gpBuildingLayoutList)
        gpBuildingLayoutList = gpBuildingLayoutList.value.next;
      // insert node into temp sorted list
      best.value.next = head;
      head = best;
    }
  }
  // Now assign the newly sorted list back to the real list.
  gpBuildingLayoutList = head;
}

function PasteMapElementToNewMapElement(iSrcGridNo: INT32, iDstGridNo: INT32): void {
  let pSrcMapElement: Pointer<MAP_ELEMENT>;
  let pNode: Pointer<LEVELNODE>;
  let usType: UINT16;

  DeleteStuffFromMapTile(iDstGridNo);
  DeleteAllLandLayers(iDstGridNo);

  // Get a pointer to the src mapelement
  pSrcMapElement = addressof(gpWorldLevelData[iSrcGridNo]);

  // Go through each levelnode, and paste the info into the new gridno
  pNode = pSrcMapElement.value.pLandHead;
  while (pNode) {
    if (pNode == pSrcMapElement.value.pLandStart)
      gpWorldLevelData[iDstGridNo].pLandStart = AddLandToTail(iDstGridNo, pNode.value.usIndex);
    else
      AddLandToTail(iDstGridNo, pNode.value.usIndex);
    pNode = pNode.value.pNext;
  }
  pNode = pSrcMapElement.value.pObjectHead;
  while (pNode) {
    AddObjectToTail(iDstGridNo, pNode.value.usIndex);
    pNode = pNode.value.pNext;
  }
  pNode = pSrcMapElement.value.pStructHead;
  while (pNode) {
    AddStructToTail(iDstGridNo, pNode.value.usIndex);
    pNode = pNode.value.pNext;
  }
  pNode = pSrcMapElement.value.pShadowHead;
  while (pNode) {
    AddShadowToTail(iDstGridNo, pNode.value.usIndex);
    pNode = pNode.value.pNext;
  }
  pNode = pSrcMapElement.value.pRoofHead;
  while (pNode) {
    AddRoofToTail(iDstGridNo, pNode.value.usIndex);
    pNode = pNode.value.pNext;
  }
  pNode = pSrcMapElement.value.pOnRoofHead;
  while (pNode) {
    AddOnRoofToTail(iDstGridNo, pNode.value.usIndex);
    pNode = pNode.value.pNext;
  }
  pNode = pSrcMapElement.value.pTopmostHead;
  while (pNode) {
    if (pNode.value.usIndex != Enum312.FIRSTPOINTERS1)
      AddTopmostToTail(iDstGridNo, pNode.value.usIndex);
    pNode = pNode.value.pNext;
  }
  for (usType = Enum313.FIRSTROOF; usType <= LASTSLANTROOF; usType++) {
    HideStructOfGivenType(iDstGridNo, usType, (!fBuildingShowRoofs));
  }
}

export function MoveBuilding(iMapIndex: INT32): void {
  let curr: Pointer<BUILDINGLAYOUTNODE>;
  let iOffset: INT32;
  if (!gpBuildingLayoutList)
    return;
  SortBuildingLayout(iMapIndex);
  iOffset = iMapIndex - gsBuildingLayoutAnchorGridNo;
  // First time, set the undo gridnos to everything effected.
  curr = gpBuildingLayoutList;
  while (curr) {
    AddToUndoList(curr.value.sGridNo);
    AddToUndoList(curr.value.sGridNo + iOffset);
    curr = curr.value.next;
  }
  // Now, move the building
  curr = gpBuildingLayoutList;
  while (curr) {
    PasteMapElementToNewMapElement(curr.value.sGridNo, curr.value.sGridNo + iOffset);
    DeleteStuffFromMapTile(curr.value.sGridNo);
    curr = curr.value.next;
  }
  MarkWorldDirty();
}

export function PasteBuilding(iMapIndex: INT32): void {
  let curr: Pointer<BUILDINGLAYOUTNODE>;
  let iOffset: INT32;
  if (!gpBuildingLayoutList)
    return;
  SortBuildingLayout(iMapIndex);
  iOffset = iMapIndex - gsBuildingLayoutAnchorGridNo;
  curr = gpBuildingLayoutList;
  // First time, set the undo gridnos to everything effected.
  while (curr) {
    AddToUndoList(curr.value.sGridNo);
    AddToUndoList(curr.value.sGridNo + iOffset);
    curr = curr.value.next;
  }
  // Now, paste the building (no smoothing)
  curr = gpBuildingLayoutList;
  while (curr) {
    PasteMapElementToNewMapElement(curr.value.sGridNo, curr.value.sGridNo + iOffset);
    curr = curr.value.next;
  }
  MarkWorldDirty();
}

interface ROOFNODE {
  iMapIndex: INT32;
  next: Pointer<ROOFNODE>;
}

let gpRoofList: Pointer<ROOFNODE> = null;

function ReplaceRoof(iMapIndex: INT32, usRoofType: UINT16): void {
  let curr: Pointer<ROOFNODE>;
  // First, validate the gridno
  if (iMapIndex < 0 && iMapIndex >= WORLD_COLS * WORLD_ROWS)
    return;
  // Now, check if there is a floor here
  if (!FloorAtGridNo(iMapIndex))
    return;
  // Now, check to make sure this gridno hasn't already been processed.
  curr = gpRoofList;
  while (curr) {
    if (iMapIndex == curr.value.iMapIndex)
      return;
    curr = curr.value.next;
  }
  // Good, it hasn't, so process it and add it to the head of the list.
  curr = MemAlloc(sizeof(ROOFNODE));
  Assert(curr);
  curr.value.iMapIndex = iMapIndex;
  curr.value.next = gpRoofList;
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
  let curr: Pointer<ROOFNODE>;
  // Not in normal editor mode, then can't do it.
  if (gfBasement || gfCaves)
    return;
  // if we don't have a floor here, then we can't replace the roof!
  if (!FloorAtGridNo(iMapIndex))
    return;
  // Extract the selected roof type.
  usRoofType = SelSingleNewRoof[iCurBank].uiObject;

  // now start building a linked list of all nodes visited -- start the first node.
  gpRoofList = MemAlloc(sizeof(ROOFNODE));
  Assert(gpRoofList);
  gpRoofList.value.iMapIndex = iMapIndex;
  gpRoofList.value.next = 0;
  RebuildRoofUsingFloorInfo(iMapIndex, usRoofType);

  // Use recursion to process the remainder.
  ReplaceRoof(iMapIndex - WORLD_COLS, usRoofType);
  ReplaceRoof(iMapIndex + WORLD_COLS, usRoofType);
  ReplaceRoof(iMapIndex - 1, usRoofType);
  ReplaceRoof(iMapIndex + 1, usRoofType);

  // Done, so delete the list.
  while (gpRoofList) {
    curr = gpRoofList;
    gpRoofList = gpRoofList.value.next;
    MemFree(curr);
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
let iDoorButton: INT32[] /* [NUM_DOOR_BUTTONS] */;
let DoorRegion: MOUSE_REGION;

export function InitDoorEditing(iMapIndex: INT32): void {
  let pDoor: Pointer<DOOR>;
  if (!DoorAtGridNo(iMapIndex) && !OpenableAtGridNo(iMapIndex))
    return;
  gfEditingDoor = true;
  iDoorMapIndex = iMapIndex;
  DisableEditorTaskbar();
  MSYS_DefineRegion(addressof(DoorRegion), 0, 0, 640, 480, MSYS_PRIORITY_HIGH - 2, 0, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  iDoorButton[Enum34.DOOR_BACKGROUND] = CreateTextButton(0, 0, 0, 0, BUTTON_USE_DEFAULT, 200, 130, 240, 100, BUTTON_TOGGLE, MSYS_PRIORITY_HIGH - 1, BUTTON_NO_CALLBACK, BUTTON_NO_CALLBACK);
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
    if (pDoor.value.fLocked) {
      ButtonList[iDoorButton[Enum34.DOOR_LOCKED]].value.uiFlags |= BUTTON_CLICKED_ON;
    }
    SetInputFieldStringWithNumericStrictValue(0, pDoor.value.ubLockID);
    SetInputFieldStringWithNumericStrictValue(1, pDoor.value.ubTrapID);
    SetInputFieldStringWithNumericStrictValue(2, pDoor.value.ubTrapLevel);
  } else {
    ButtonList[iDoorButton[Enum34.DOOR_LOCKED]].value.uiFlags |= BUTTON_CLICKED_ON;
  }
}

export function ExtractAndUpdateDoorInfo(): void {
  let pNode: Pointer<LEVELNODE>;
  let num: INT32;
  let door: DOOR;
  let fCursor: boolean = false;
  let fCursorExists: boolean = false;

  memset(addressof(door), 0, sizeof(DOOR));

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

  if (ButtonList[iDoorButton[Enum34.DOOR_LOCKED]].value.uiFlags & BUTTON_CLICKED_ON) {
    door.fLocked = true;
  } else {
    door.fLocked = false;
  }

  // Find out if we have a rotating key cursor (we will either add one or remove one)
  pNode = gpWorldLevelData[iDoorMapIndex].pTopmostHead;
  while (pNode) {
    if (pNode.value.usIndex == Enum312.ROTATINGKEY1) {
      fCursorExists = true;
      break;
    }
    pNode = pNode.value.pNext;
  }
  if (fCursor) {
    // we have a valid door, so add it (or replace existing)
    if (!fCursorExists)
      AddTopmostToHead(iDoorMapIndex, Enum312.ROTATINGKEY1);
    // If the door already exists, the new information will replace it.
    AddDoorInfoToTable(addressof(door));
  } else {
    // if a door exists here, remove it.
    if (fCursorExists)
      RemoveAllTopmostsOfTypeRange(iDoorMapIndex, Enum313.ROTATINGKEY, Enum313.ROTATINGKEY);
    RemoveDoorInfoFromTable(iDoorMapIndex);
  }
}

export function FindNextLockedDoor(): void {
  let pDoor: Pointer<DOOR>;
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
  MSYS_RemoveRegion(addressof(DoorRegion));
  for (i = 0; i < Enum34.NUM_DOOR_BUTTONS; i++)
    RemoveButton(iDoorButton[i]);
  gfEditingDoor = false;
  KillTextInputMode();
}

function DoorOkayCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    ExtractAndUpdateDoorInfo();
    KillDoorEditing();
  }
}

function DoorCancelCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    KillDoorEditing();
  }
}

function DoorToggleLockedCallback(btn: Pointer<GUI_BUTTON>, reason: INT32): void {
  // handled in ExtractAndUpdateDoorInfo();
}

export function AddLockedDoorCursors(): void {
  let pDoor: Pointer<DOOR>;
  let i: INT;
  for (i = 0; i < gubNumDoors; i++) {
    pDoor = addressof(DoorTable[i]);
    AddTopmostToHead(pDoor.value.sGridNo, Enum312.ROTATINGKEY1);
  }
}

export function RemoveLockedDoorCursors(): void {
  let pDoor: Pointer<DOOR>;
  let i: INT;
  let pNode: Pointer<LEVELNODE>;
  let pTemp: Pointer<LEVELNODE>;
  for (i = 0; i < gubNumDoors; i++) {
    pDoor = addressof(DoorTable[i]);
    pNode = gpWorldLevelData[pDoor.value.sGridNo].pTopmostHead;
    while (pNode) {
      if (pNode.value.usIndex == Enum312.ROTATINGKEY1) {
        pTemp = pNode;
        pNode = pNode.value.pNext;
        RemoveTopmost(pDoor.value.sGridNo, pTemp.value.usIndex);
      } else
        pNode = pNode.value.pNext;
    }
  }
}

export function SetupTextInputForBuildings(): void {
  let str: UINT16[] /* [4] */;
  InitTextInputModeWithScheme(Enum384.DEFAULT_SCHEME);
  AddUserInputField(null); // just so we can use short cut keys while not typing.
  swprintf(str, "%d", gubMaxRoomNumber);
  AddTextInputField(410, 400, 25, 15, MSYS_PRIORITY_NORMAL, str, 3, INPUTTYPE_NUMERICSTRICT);
}

export function ExtractAndUpdateBuildingInfo(): void {
  let str: UINT16[] /* [4] */;
  let temp: INT32;
  // extract light1 colors
  temp = Math.min(GetNumericStrictValueFromField(1), 255);
  if (temp != -1) {
    gubCurrRoomNumber = temp;
  } else {
    gubCurrRoomNumber = 0;
  }
  swprintf(str, "%d", gubCurrRoomNumber);
  SetInputFieldStringWith16BitString(1, str);
  SetActiveField(0);
}

}
