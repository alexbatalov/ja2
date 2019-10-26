namespace ja2 {

let fValidCursor: boolean = false;
let fAnchored: boolean = false;
let gfBrushEnabled: boolean = true;
export let gusSelectionWidth: UINT16 = 1;
export let gusPreserveSelectionWidth: UINT16 = 1;
export let gusSelectionType: UINT16 = Enum33.SMALLSELECTION;
export let gusSelectionDensity: UINT16 = 2;
export let gusSavedSelectionType: UINT16 = Enum33.SMALLSELECTION;
export let gusSavedBuildingSelectionType: UINT16 = Enum33.AREASELECTION;
export let sGridX: INT16;
export let sGridY: INT16;
let sBadMarker: INT16 = -1;

export let wszSelType: Pointer<UINT16>[] /* [6] */ = [
  "Small",
  "Medium",
  "Large",
  "XLarge",
  "Width: xx",
  "Area",
];

let gfAllowRightButtonSelections: boolean = false;
export let gfCurrentSelectionWithRightButton: boolean = false;

// Used for offseting cursor to show that it is on the roof rather than on the ground.
// This can be conveniently executed by moving the cursor up and right 3 gridnos for a
// total of -483  -(160*3)-(1*3)
const ROOF_OFFSET = (-483);
let gfUsingOffset: boolean;

// Based on the density level setting and the selection type, this test will
// randomly choose TRUE or FALSE to reflect the *odds*.
export function PerformDensityTest(): boolean {
  if (Random(100) < gusSelectionDensity)
    return true;
  return false;
}

export function IncreaseSelectionDensity(): void {
  if (gusSelectionDensity == 100)
    gusSelectionDensity = 2;
  else if (gusSelectionDensity == 2)
    gusSelectionDensity = 5;
  else if (gusSelectionDensity == 5)
    gusSelectionDensity = 10;
  else
    gusSelectionDensity += 10;
}

export function DecreaseSelectionDensity(): void {
  if (gusSelectionDensity == 10)
    gusSelectionDensity = 5;
  else if (gusSelectionDensity == 5)
    gusSelectionDensity = 2;
  else if (gusSelectionDensity == 2)
    gusSelectionDensity = 100;
  else
    gusSelectionDensity -= 10;
}

export function RemoveCursors(): void {
  let x: INT32;
  let y: INT32;
  let iMapIndex: INT32;
  if (gpBuildingLayoutList) {
    RemoveBuildingLayout();
  }
  Assert(gSelectRegion.iTop >= 0 && gSelectRegion.iTop <= gSelectRegion.iBottom);
  Assert(gSelectRegion.iLeft >= 0 && gSelectRegion.iLeft <= gSelectRegion.iRight);
  for (y = gSelectRegion.iTop; y <= gSelectRegion.iBottom; y++) {
    for (x = gSelectRegion.iLeft; x <= gSelectRegion.iRight; x++) {
      let pNode: Pointer<LEVELNODE>;
      iMapIndex = y * WORLD_COLS + x;
      if (gfUsingOffset)
        iMapIndex += ROOF_OFFSET;
      pNode = gpWorldLevelData[iMapIndex].pTopmostHead;
      while (pNode) {
        if (pNode.value.usIndex == Enum312.FIRSTPOINTERS1 || pNode.value.usIndex == Enum312.FIRSTPOINTERS5) {
          RemoveTopmost(iMapIndex, pNode.value.usIndex);
          break;
        }
        pNode = pNode.value.pNext;
      }
    }
  }
  fValidCursor = false;
  gfUsingOffset = false;
}

function RemoveBadMarker(): void {
  let pNode: Pointer<LEVELNODE>;
  if (sBadMarker < 0)
    return;
  pNode = gpWorldLevelData[sBadMarker].pTopmostHead;
  while (pNode) {
    if (pNode.value.usIndex == Enum312.BADMARKER1) {
      RemoveTopmost(sBadMarker, pNode.value.usIndex);
      sBadMarker = -1;
      break;
    }
    pNode = pNode.value.pNext;
  }
}

export function UpdateCursorAreas(): void {
  let x: INT32;
  let y: INT32;
  let iMapIndex: INT32;

  RemoveCursors();

  EnsureSelectionType();

  // Determine if the mouse is currently in the world.
  if (gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA && GetMouseXY(addressof(sGridX), addressof(sGridY))) {
    iMapIndex = MAPROWCOLTOPOS(sGridY, sGridX);
    if (gpBuildingLayoutList) {
      gSelectRegion.iLeft = gSelectRegion.iRight = sGridX;
      gSelectRegion.iTop = gSelectRegion.iBottom = sGridY;
      fValidCursor = true;
      DrawBuildingLayout(iMapIndex);
    } else
      switch (gusSelectionType) {
        case Enum33.SMALLSELECTION:
          gSelectRegion.iLeft = gSelectRegion.iRight = sGridX;
          gSelectRegion.iTop = gSelectRegion.iBottom = sGridY;
          fValidCursor = true;
          break;
        case Enum33.MEDIUMSELECTION:
        case Enum33.LARGESELECTION:
        case Enum33.XLARGESELECTION:
          // The mouse mode value reflects the size of the cursor.
          gSelectRegion.iTop = sGridY - gusSelectionType;
          gSelectRegion.iBottom = sGridY + gusSelectionType;
          gSelectRegion.iLeft = sGridX - gusSelectionType;
          gSelectRegion.iRight = sGridX + gusSelectionType;
          ValidateSelectionRegionBoundaries();
          fValidCursor = true;
          break;
        case Enum33.LINESELECTION:
          fValidCursor = HandleAreaSelection();
          ForceAreaSelectionWidth();
          ValidateSelectionRegionBoundaries();
          break;
        case Enum33.AREASELECTION:
          fValidCursor = HandleAreaSelection();
          break;
      }
  }
  // Draw all of the area cursors here.
  if (fValidCursor) {
    if (iDrawMode == Enum38.DRAW_MODE_ENEMY || iDrawMode == Enum38.DRAW_MODE_CREATURE || iDrawMode == Enum38.DRAW_MODE_REBEL || iDrawMode == Enum38.DRAW_MODE_CIVILIAN || iDrawMode == Enum38.DRAW_MODE_SCHEDULEACTION) {
      iMapIndex = gSelectRegion.iTop * WORLD_COLS + gSelectRegion.iLeft;
      if (!IsLocationSittable(iMapIndex, gfRoofPlacement) && iDrawMode != Enum38.DRAW_MODE_SCHEDULEACTION || !IsLocationSittableExcludingPeople(iMapIndex, gfRoofPlacement) && iDrawMode == Enum38.DRAW_MODE_SCHEDULEACTION) {
        if (sBadMarker != iMapIndex) {
          RemoveBadMarker();
          if (gfRoofPlacement && FlatRoofAboveGridNo(iMapIndex)) {
            AddTopmostToTail(iMapIndex + ROOF_OFFSET, Enum312.BADMARKER1);
            sBadMarker = (iMapIndex + ROOF_OFFSET);
          } else {
            AddTopmostToTail((iMapIndex), Enum312.BADMARKER1);
            sBadMarker = (iMapIndex);
          }
        }
      } else {
        RemoveBadMarker();
        if (gfRoofPlacement && FlatRoofAboveGridNo(iMapIndex)) {
          AddTopmostToTail(iMapIndex + ROOF_OFFSET, Enum312.FIRSTPOINTERS5);
          gfUsingOffset = true;
        } else
          AddTopmostToTail(iMapIndex, Enum312.FIRSTPOINTERS1);
      }
    } else
      for (y = gSelectRegion.iTop; y <= gSelectRegion.iBottom; y++) {
        for (x = gSelectRegion.iLeft; x <= gSelectRegion.iRight; x++) {
          iMapIndex = y * WORLD_COLS + x;
          AddTopmostToTail(iMapIndex, Enum312.FIRSTPOINTERS1);
        }
      }
  }
}

function ForceAreaSelectionWidth(): void {
  let gusDecSelWidth: UINT16;

  // If the anchor isn't set, we don't want to force the size yet.
  if (!fAnchored)
    return;

  gusDecSelWidth = gusSelectionWidth - 1;

  // compare the region with the anchor and determine if we are going to force size via
  // height or width depending on the cursor distance from the anchor.
  if (Math.abs(sGridX - gSelectAnchor.iX) < Math.abs(sGridY - gSelectAnchor.iY)) {
    // restrict the x axis
    if (sGridX < gSelectAnchor.iX) {
      // to the left
      gSelectRegion.iLeft = gSelectAnchor.iX - gusDecSelWidth;
      gSelectRegion.iRight = gSelectAnchor.iX;
    } else {
      // to the right
      gSelectRegion.iLeft = gSelectAnchor.iX;
      gSelectRegion.iRight = gSelectAnchor.iX + gusDecSelWidth;
    }
  } else {
    // restrict the y axis
    if (sGridY < gSelectAnchor.iY) {
      // to the upper
      gSelectRegion.iTop = gSelectAnchor.iY - gusDecSelWidth;
      gSelectRegion.iBottom = gSelectAnchor.iY;
    } else {
      // to the lower
      gSelectRegion.iBottom = gSelectAnchor.iY + gusDecSelWidth;
      gSelectRegion.iTop = gSelectAnchor.iY;
    }
  }
}

function HandleAreaSelection(): boolean {
  // When the user releases the left button, then clear and process the area.
  if (fAnchored) {
    if (!gfLeftButtonState && !gfCurrentSelectionWithRightButton || !gfRightButtonState && gfCurrentSelectionWithRightButton) {
      fAnchored = false;
      ProcessAreaSelection(!gfCurrentSelectionWithRightButton);
      gfCurrentSelectionWithRightButton = false;
      return false;
    }
  }
  // When the user first clicks, anchor the area.
  if (!fAnchored) {
    if (gfLeftButtonState || gfRightButtonState && gfAllowRightButtonSelections) {
      if (gfRightButtonState && !gfLeftButtonState)
        gfCurrentSelectionWithRightButton = true;
      else
        gfCurrentSelectionWithRightButton = false;
      fAnchored = true;
      gSelectAnchor.iX = sGridX;
      gSelectAnchor.iY = sGridY;
      gSelectRegion.iLeft = gSelectRegion.iRight = sGridX;
      gSelectRegion.iTop = gSelectRegion.iBottom = sGridY;
      return true;
    }
  }
  // If no anchoring, then we are really dealing with a single cursor,
  // until the user clicks and holds the mouse button to anchor the cursor.
  if (!fAnchored) {
    gSelectRegion.iLeft = gSelectRegion.iRight = sGridX;
    gSelectRegion.iTop = gSelectRegion.iBottom = sGridY;
    return true;
  }
  // Base the area from the anchor to the current mouse position.
  if (sGridX <= gSelectAnchor.iX) {
    gSelectRegion.iLeft = sGridX;
    gSelectRegion.iRight = gSelectAnchor.iX;
  } else {
    gSelectRegion.iRight = sGridX;
    gSelectRegion.iLeft = gSelectAnchor.iX;
  }
  if (sGridY <= gSelectAnchor.iY) {
    gSelectRegion.iTop = sGridY;
    gSelectRegion.iBottom = gSelectAnchor.iY;
  } else {
    gSelectRegion.iBottom = sGridY;
    gSelectRegion.iTop = gSelectAnchor.iY;
  }
  return true;
}

function ValidateSelectionRegionBoundaries(): void {
  gSelectRegion.iLeft = Math.max(Math.min(159, gSelectRegion.iLeft), 0);
  gSelectRegion.iRight = Math.max(Math.min(159, gSelectRegion.iRight), 0);
  gSelectRegion.iTop = Math.max(Math.min(159, gSelectRegion.iTop), 0);
  gSelectRegion.iBottom = Math.max(Math.min(159, gSelectRegion.iBottom), 0);
}

function EnsureSelectionType(): void {
  let fPrevBrushEnabledState: boolean = gfBrushEnabled;

  // At time of writing, the only drawing mode supporting right mouse button
  // area selections is the cave drawing mode.
  gfAllowRightButtonSelections = (iDrawMode == Enum38.DRAW_MODE_CAVES);

  // if we are erasing, we have more flexibility with the drawing modes.
  if (iDrawMode >= Enum38.DRAW_MODE_ERASE) {
    // erase modes supporting any cursor mode
    gusSavedSelectionType = gusSelectionType;
    gusSelectionWidth = gusPreserveSelectionWidth;
    gfBrushEnabled = true;
  } else
    switch (iDrawMode) {
      // regular modes
      case Enum38.DRAW_MODE_SAW_ROOM:
      case Enum38.DRAW_MODE_ROOM:
      case Enum38.DRAW_MODE_CAVES:
        gusSavedBuildingSelectionType = gusSelectionType;
        gusSelectionWidth = gusPreserveSelectionWidth;
        gfBrushEnabled = true;
        break;
      case Enum38.DRAW_MODE_SLANTED_ROOF:
        gusSelectionType = Enum33.LINESELECTION;
        gusSelectionWidth = 8;
        gfBrushEnabled = false;
        break;
      case Enum38.DRAW_MODE_EXITGRID:
      case Enum38.DRAW_MODE_ROOMNUM:
      case Enum38.DRAW_MODE_FLOORS:
      case Enum38.DRAW_MODE_GROUND:
      case Enum38.DRAW_MODE_OSTRUCTS:
      case Enum38.DRAW_MODE_OSTRUCTS1:
      case Enum38.DRAW_MODE_OSTRUCTS2:
      case Enum38.DRAW_MODE_DEBRIS:
        // supports all modes
        gusSavedSelectionType = gusSelectionType;
        gusSelectionWidth = gusPreserveSelectionWidth;
        gfBrushEnabled = true;
        break;
      default:
        gusSelectionType = Enum33.SMALLSELECTION;
        gusSelectionWidth = gusPreserveSelectionWidth;
        gfBrushEnabled = false;
        break;
    }

  if (gfBrushEnabled != fPrevBrushEnabledState) {
    if (gfBrushEnabled) {
      EnableEditorButton(Enum32.TERRAIN_CYCLE_BRUSHSIZE);
      EnableEditorButton(Enum32.BUILDING_CYCLE_BRUSHSIZE);
      EnableEditorButton(Enum32.MAPINFO_CYCLE_BRUSHSIZE);
    } else {
      DisableEditorButton(Enum32.TERRAIN_CYCLE_BRUSHSIZE);
      DisableEditorButton(Enum32.BUILDING_CYCLE_BRUSHSIZE);
      DisableEditorButton(Enum32.MAPINFO_CYCLE_BRUSHSIZE);
    }
  }
}

function DrawBuildingLayout(iMapIndex: INT32): void {
  let curr: Pointer<BUILDINGLAYOUTNODE>;
  let iOffset: INT32;
  let pNode: Pointer<LEVELNODE>;
  let fAdd: boolean;
  iOffset = iMapIndex - gsBuildingLayoutAnchorGridNo;
  curr = gpBuildingLayoutList;
  while (curr) {
    iMapIndex = curr.value.sGridNo + iOffset;
    if (iMapIndex > 0 && iMapIndex < WORLD_MAX) {
      fAdd = true;
      pNode = gpWorldLevelData[iMapIndex].pTopmostHead;
      while (pNode) {
        if (pNode.value.usIndex == Enum312.FIRSTPOINTERS1) {
          fAdd = false;
          break;
        }
        pNode = pNode.value.pNext;
      }
      if (fAdd)
        AddTopmostToTail(iMapIndex, Enum312.FIRSTPOINTERS1);
    }
    curr = curr.value.next;
  }
}

export function RemoveBuildingLayout(): void {
  let curr: Pointer<BUILDINGLAYOUTNODE>;
  let iOffset: INT32;
  let iMapIndex: INT32;
  iMapIndex = gSelectRegion.iLeft + gSelectRegion.iTop * WORLD_COLS;
  iOffset = iMapIndex - gsBuildingLayoutAnchorGridNo;
  curr = gpBuildingLayoutList;
  while (curr) {
    iMapIndex = curr.value.sGridNo + iOffset;
    if (iMapIndex > 0 && iMapIndex < WORLD_MAX)
      RemoveTopmost(iMapIndex, Enum312.FIRSTPOINTERS1);
    curr = curr.value.next;
  }
}

}
