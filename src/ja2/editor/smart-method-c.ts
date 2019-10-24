let gubDoorUIValue: UINT8 = 0;
let gubWindowUIValue: UINT8 = 0;
let gubWallUIValue: UINT8 = Enum313.FIRSTWALL;
let gubBrokenWallUIValue: UINT8 = 0;

function CalcSmartWallDefault(pusObjIndex: Pointer<UINT16>, pusUseIndex: Pointer<UINT16>): void {
  pusUseIndex.value = 0;
  pusObjIndex.value = gubWallUIValue;
}

function CalcSmartDoorDefault(pusObjIndex: Pointer<UINT16>, pusUseIndex: Pointer<UINT16>): void {
  pusUseIndex.value = 4 * (gubDoorUIValue % 2); // open or closed -- odd or even
  pusObjIndex.value = Enum313.FIRSTDOOR + gubDoorUIValue / 2;
}

function CalcSmartWindowDefault(pusObjIndex: Pointer<UINT16>, pusUseIndex: Pointer<UINT16>): void {
  pusUseIndex.value = 44 + gubWindowUIValue; // first exterior top right oriented window
  pusObjIndex.value = Enum313.FIRSTWALL;
}

function CalcSmartBrokenWallDefault(pusObjIndex: Pointer<UINT16>, pusUseIndex: Pointer<UINT16>): void {
  switch (gubBrokenWallUIValue) {
    case 0:
    case 1:
      pusUseIndex.value = 49 + gubBrokenWallUIValue;
      break;
    case 3:
      pusUseIndex.value = 62;
      break;
    case 4:
      pusUseIndex.value = 64;
      break;
  }
  pusObjIndex.value = Enum313.FIRSTWALL;
}

function CalcSmartWindowIndex(usWallOrientation: UINT16): UINT16 {
  return (33 + usWallOrientation * 3 + gubWindowUIValue);
}

function CalcSmartDoorIndex(usWallOrientation: UINT16): UINT16 {
  // convert the orientation values as the graphics are in reverse order
  // orientation values:   INSIDE_TOP_LEFT=1,  INSIDE_TOP_RIGHT=2,  OUTSIDE_TOP_LEFT=3, OUTSIDE_TOP_RIGHT=4
  // door graphics order:	INSIDE_TOP_LEFT=15, INSIDE_TOP_RIGHT=10, OUTSIDE_TOP_LEFT=5, OUTSIDE_TOP_RIGHT=0
  usWallOrientation = (4 - usWallOrientation) * 5;
  // 4 * (gubDoorUIValue%2) evaluates to +4 if the door is open, 0 if closed
  return (1 + usWallOrientation + 4 * (gubDoorUIValue % 2));
}

function CalcSmartDoorType(): UINT16 {
  return (Enum313.FIRSTDOOR + gubDoorUIValue / 2);
}

function CalcSmartBrokenWallIndex(usWallOrientation: UINT16): UINT16 {
  if (gubBrokenWallUIValue == 2) // the hole in the wall
    return 0xffff;
  if (gubBrokenWallUIValue < 2) // broken walls
  {
    // convert the orientation value as the graphics are in a different order.
    // orientation values:   INSIDE_TOP_LEFT=1, INSIDE_TOP_RIGHT=2, OUTSIDE_TOP_LEFT=3, OUTSIDE_TOP_RIGHT=4
    //																			4										6										8										 10
    // door graphics order:  INSIDE_TOP_LEFT=4, INSIDE_TOP_RIGHT=6, OUTSIDE_TOP_LEFT=0, OUTSIDE_TOP_RIGHT=2
    usWallOrientation = usWallOrientation * 2 + 2;
    usWallOrientation -= usWallOrientation > 6 ? 8 : 0;
    return (usWallOrientation + 48 + gubBrokenWallUIValue);
  }

  // cracked and smudged walls

  // convert the orientation value as the graphics are in a different order.
  // orientation values:   INSIDE_TOP_LEFT=1, INSIDE_TOP_RIGHT=2, OUTSIDE_TOP_LEFT=3, OUTSIDE_TOP_RIGHT=4
  // door graphics order:  INSIDE_TOP_LEFT=1, INSIDE_TOP_RIGHT=2, OUTSIDE_TOP_LEFT=5, OUTSIDE_TOP_RIGHT=6
  usWallOrientation += usWallOrientation > 1 ? 2 : 0;
  usWallOrientation += gubBrokenWallUIValue == 4 ? 2 : 0; // smudged type which is 2 index values higher.
  return (usWallOrientation + 57);
}

function IncSmartWallUIValue(): void {
  gubWallUIValue += gubWallUIValue < LASTWALL ? 1 : -3;
}

function DecSmartWallUIValue(): void {
  gubWallUIValue -= gubWallUIValue > Enum313.FIRSTWALL ? 1 : -3;
}

function IncSmartDoorUIValue(): void {
  gubDoorUIValue += gubDoorUIValue < 7 ? 1 : -7;
}

function DecSmartDoorUIValue(): void {
  gubDoorUIValue -= gubDoorUIValue > 0 ? 1 : -7;
}

function IncSmartWindowUIValue(): void {
  gubWindowUIValue += gubWindowUIValue < 2 ? 1 : -2;
}

function DecSmartWindowUIValue(): void {
  gubWindowUIValue -= gubWindowUIValue > 0 ? 1 : -2;
}

function IncSmartBrokenWallUIValue(): void {
  gubBrokenWallUIValue += gubBrokenWallUIValue < 4 ? 1 : -4;
}

function DecSmartBrokenWallUIValue(): void {
  gubBrokenWallUIValue -= gubBrokenWallUIValue > 0 ? 1 : -4;
}

function CalcWallInfoUsingSmartMethod(iMapIndex: UINT32, pusWallType: Pointer<UINT16>, pusIndex: Pointer<UINT16>): BOOLEAN {
  return FALSE;
}

function CalcDoorInfoUsingSmartMethod(iMapIndex: UINT32, pusDoorType: Pointer<UINT16>, pusIndex: Pointer<UINT16>): BOOLEAN {
  let pWall: Pointer<LEVELNODE> = NULL;
  let usWallOrientation: UINT16;
  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    pusIndex.value = CalcSmartDoorIndex(usWallOrientation) - 1;
    pusDoorType.value = CalcSmartDoorType();
    return TRUE;
  }
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    pusIndex.value = CalcSmartDoorIndex(usWallOrientation) - 1;
    pusDoorType.value = CalcSmartDoorType();
    return TRUE;
  }
  return FALSE;
}

function CalcWindowInfoUsingSmartMethod(iMapIndex: UINT32, pusWallType: Pointer<UINT16>, pusIndex: Pointer<UINT16>): BOOLEAN {
  let pWall: Pointer<LEVELNODE> = NULL;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;

  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall.value.usIndex, addressof(uiTileType));
    pusWallType.value = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
      // We want to be able to replace doors with a window, however, the doors do not
      // contain the wall type, so we have to search for the nearest wall to extract it.
      pusWallType.value = SearchForWallType(iMapIndex);
    }
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    pusIndex.value = CalcSmartWindowIndex(usWallOrientation) - 1;
    return TRUE;
  }
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall.value.usIndex, addressof(uiTileType));
    pusWallType.value = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
      // We want to be able to replace doors with a window, however, the doors do not
      // contain the wall type, so we have to search for the nearest wall to extract it.
      pusWallType.value = SearchForWallType(iMapIndex);
    }
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    pusIndex.value = CalcSmartWindowIndex(usWallOrientation) - 1;
    return TRUE;
  }
  return FALSE;
}

function CalcBrokenWallInfoUsingSmartMethod(iMapIndex: UINT32, pusWallType: Pointer<UINT16>, pusIndex: Pointer<UINT16>): BOOLEAN {
  let pWall: Pointer<LEVELNODE> = NULL;
  let uiTileType: UINT32;
  let usWallOrientation: UINT16;

  if (gubBrokenWallUIValue == 2) // the hole in the wall
  {
    pusWallType.value = 0xffff;
    pusIndex.value = 0xffff; // but it won't draw it.
    return TRUE;
  }

  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall.value.usIndex, addressof(uiTileType));
    pusWallType.value = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
      // We want to be able to replace doors with a walltype, however, the doors do not
      // contain the wall type, so we have to search for the nearest wall to extract it.
      pusWallType.value = SearchForWallType(iMapIndex);
    }
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    pusIndex.value = CalcSmartBrokenWallIndex(usWallOrientation) - 1;
    return TRUE;
  }
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall.value.usIndex, addressof(uiTileType));
    pusWallType.value = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
      // We want to be able to replace doors with a walltype, however, the doors do not
      // contain the wall type, so we have to search for the nearest wall to extract it.
      pusWallType.value = SearchForWallType(iMapIndex);
    }
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    pusIndex.value = CalcSmartBrokenWallIndex(usWallOrientation) - 1;
    return TRUE;
  }
  return FALSE;
}

// This is a very difficult function to document properly.  The reason being is that it is sooo
// subliminal by nature.  I have thought up of priorities and choose the best piece to draw based
// on the surrounding conditions.  Here are the priorities which are referenced below via comments:
// A)  If there is currently a bottom piece and a right piece, immediately exit.
// B)  We are currently over a bottom piece.  Now, we don't automatically want to draw a right piece here
//		for multiple reasons.  First, the UI will be too quick and place bottom and right pieces for every
//		place the user clicks, which isn't what we want.  Therefore, we look to see if there is a right
//    piece in the y-1 gridno.  It would then make sense to place a right piece down here.  Regardless,
//		if we encounter a bottom piece here, we will exit.
// C)  This is the counterpart to B, but we are looking at a current right piece, and are determining if
//		we should place a bottom piece based on another bottom piece existing in the x-1 gridno.
// D)  Now, we analyse the neighboring tiles and determine the orientations that would add weight to the
//    current tile either towards drawing a horizontal piece or a vertical piece.
// E)  Now that we have the information, we give the highest priority to any weights that match the current
//		wall piece type selected by the user.  Based on that, we will only consider the best match of the
//		type and use it.  If there are no matches on type, we continue.
// F)  We failed to find weights matching the current wall type, but before we give up using the user's wall
//		type, there are two more cases.  When there is a bottom wall in the y+1 position or a right wall in
//		the x+1 position.  If there are matching walls, there, then we draw two pieces to connect the current
//		gridno with the respective position.
function PasteSmartWall(iMapIndex: UINT32): void {
  /* static */ let fWallAlone: BOOLEAN = FALSE;
  /* static */ let iAloneMapIndex: UINT32 = 0x8000;
  let usWallType: UINT16;

  // These are the counters for the walls of each type
  let usNumV: UINT16[] /* [4] */ = [
    0,
    0,
    0,
    0,
  ]; // vertical wall weights
  let usNumH: UINT16[] /* [4] */ = [
    0,
    0,
    0,
    0,
  ]; // horizontal wall weights

  //*A* See above documentation
  if (GetVerticalWall(iMapIndex) && GetHorizontalWall(iMapIndex))
    return;
  //*B* See above documentation
  usWallType = GetHorizontalWallType(iMapIndex);
  if (usWallType) {
    if (usWallType == gubWallUIValue) {
      usWallType = GetVerticalWallType(iMapIndex - WORLD_COLS);
      if (usWallType == gubWallUIValue) {
        if (FloorAtGridNo(iMapIndex + 1))
          BuildWallPiece(iMapIndex, Enum61.EXTERIOR_RIGHT, gubWallUIValue);
        else
          BuildWallPiece(iMapIndex, Enum61.INTERIOR_RIGHT, gubWallUIValue);
        return;
      }
      usWallType = GetHorizontalWallType(iMapIndex - WORLD_COLS);
      if (usWallType == gubWallUIValue) {
        if (FloorAtGridNo(iMapIndex + 1)) {
          BuildWallPiece(iMapIndex, Enum61.EXTERIOR_RIGHT, gubWallUIValue);
          if (!GetHorizontalWall(iMapIndex - WORLD_COLS + 1))
            ChangeVerticalWall(iMapIndex, Enum60.INTERIOR_EXTENDED);
        } else {
          BuildWallPiece(iMapIndex, Enum61.INTERIOR_RIGHT, gubWallUIValue);
          if (!GetHorizontalWall(iMapIndex - WORLD_COLS + 1))
            ChangeVerticalWall(iMapIndex, Enum60.EXTERIOR_EXTENDED);
        }
      }
    }
    return;
  }
  //*C* See above documentation
  usWallType = GetVerticalWallType(iMapIndex);
  if (usWallType) {
    if (usWallType == gubWallUIValue) {
      usWallType = GetHorizontalWallType(iMapIndex - 1);
      if (usWallType == gubWallUIValue) {
        if (FloorAtGridNo(iMapIndex + WORLD_COLS))
          BuildWallPiece(iMapIndex, Enum61.EXTERIOR_BOTTOM, gubWallUIValue);
        else
          BuildWallPiece(iMapIndex, Enum61.INTERIOR_BOTTOM, gubWallUIValue);
      }
    }
    return;
  }
  //*D* See above documentation
  // Evaluate left adjacent tile
  if (usWallType = GetVerticalWallType(iMapIndex - 1))
    usNumH[usWallType - Enum313.FIRSTWALL]++;
  if (usWallType = GetHorizontalWallType(iMapIndex - 1))
    usNumH[usWallType - Enum313.FIRSTWALL]++;
  // Evaluate right adjacent tile
  if (usWallType = GetHorizontalWallType(iMapIndex + 1))
    usNumH[usWallType - Enum313.FIRSTWALL]++;
  // Evaluate upper adjacent tile
  if (usWallType = GetVerticalWallType(iMapIndex - WORLD_COLS))
    usNumV[usWallType - Enum313.FIRSTWALL]++;
  if (usWallType = GetHorizontalWallType(iMapIndex - WORLD_COLS))
    usNumV[usWallType - Enum313.FIRSTWALL]++;
  // Evaluate lower adjacent tile
  if (usWallType = GetVerticalWallType(iMapIndex + WORLD_COLS))
    usNumV[usWallType - Enum313.FIRSTWALL]++;
  //*E* See above documentation
  if (usNumV[gubWallUIValue - Enum313.FIRSTWALL] | usNumH[gubWallUIValue - Enum313.FIRSTWALL]) {
    if (usNumV[gubWallUIValue - Enum313.FIRSTWALL] >= usNumH[gubWallUIValue - Enum313.FIRSTWALL]) {
      if (FloorAtGridNo(iMapIndex + 1)) {
        // inside
        BuildWallPiece(iMapIndex, Enum61.EXTERIOR_RIGHT, gubWallUIValue);
        // Change to extended piece if it is a new top right corner to cover the end part.
        if (GetHorizontalWall(iMapIndex - WORLD_COLS) && !GetHorizontalWall(iMapIndex - WORLD_COLS + 1) && !GetVerticalWall(iMapIndex - WORLD_COLS))
          ChangeVerticalWall(iMapIndex, Enum60.INTERIOR_EXTENDED);
        else if (GetHorizontalWall(iMapIndex - WORLD_COLS) && !GetHorizontalWall(iMapIndex - WORLD_COLS - 1) && !GetVerticalWall(iMapIndex - WORLD_COLS - 1)) {
          ChangeVerticalWall(iMapIndex, Enum60.INTERIOR_EXTENDED);
          EraseHorizontalWall(iMapIndex - WORLD_COLS);
        }
      } else {
        // outside
        BuildWallPiece(iMapIndex, Enum61.INTERIOR_RIGHT, gubWallUIValue);
        if (GetHorizontalWall(iMapIndex - WORLD_COLS) && !GetHorizontalWall(iMapIndex - WORLD_COLS + 1) && !GetVerticalWall(iMapIndex - WORLD_COLS))
          ChangeVerticalWall(iMapIndex, Enum60.EXTERIOR_EXTENDED);
        else if (GetHorizontalWall(iMapIndex - WORLD_COLS) && !GetHorizontalWall(iMapIndex - WORLD_COLS - 1) && !GetVerticalWall(iMapIndex - WORLD_COLS - 1)) {
          ChangeVerticalWall(iMapIndex, Enum60.EXTERIOR_EXTENDED);
          EraseHorizontalWall(iMapIndex - WORLD_COLS);
        }
      }
    } else {
      if (GetVerticalWall(iMapIndex - 1) && !GetVerticalWall(iMapIndex - WORLD_COLS - 1) && !GetHorizontalWall(iMapIndex - WORLD_COLS - 1))
        EraseVerticalWall(iMapIndex - 1);
      if (FloorAtGridNo(iMapIndex + WORLD_COLS)) {
        // inside
        BuildWallPiece(iMapIndex, Enum61.EXTERIOR_BOTTOM, gubWallUIValue);
        if (GetVerticalWall(iMapIndex + WORLD_COLS))
          ChangeVerticalWall(iMapIndex + WORLD_COLS, Enum60.INTERIOR_EXTENDED);
        if (GetVerticalWall(iMapIndex + WORLD_COLS - 1) && !GetVerticalWall(iMapIndex - 1))
          ChangeVerticalWall(iMapIndex + WORLD_COLS - 1, Enum60.INTERIOR_EXTENDED);
        else if (GetVerticalWall(iMapIndex - 1) && !GetVerticalWall(iMapIndex + WORLD_COLS - 1) && FloorAtGridNo(iMapIndex))
          ChangeVerticalWall(iMapIndex - 1, Enum60.INTERIOR_BOTTOMEND);
      } else {
        // outside
        BuildWallPiece(iMapIndex, Enum61.INTERIOR_BOTTOM, gubWallUIValue);
        if (GetVerticalWall(iMapIndex + WORLD_COLS))
          ChangeVerticalWall(iMapIndex + WORLD_COLS, Enum60.EXTERIOR_EXTENDED);
        if (GetVerticalWall(iMapIndex + WORLD_COLS - 1) && !GetVerticalWall(iMapIndex - 1))
          ChangeVerticalWall(iMapIndex + WORLD_COLS - 1, Enum60.EXTERIOR_EXTENDED);
        else if (GetVerticalWall(iMapIndex - 1) && !GetVerticalWall(iMapIndex + WORLD_COLS - 1) && FloorAtGridNo(iMapIndex))
          ChangeVerticalWall(iMapIndex - 1, Enum60.EXTERIOR_BOTTOMEND);
      }
    }
    return;
  }
  //*F* See above documentation
  usWallType = GetHorizontalWallType(iMapIndex + WORLD_COLS);
  if (usWallType == gubWallUIValue) {
    if (!GetHorizontalWall(iMapIndex + WORLD_COLS - 1))
      EraseHorizontalWall(iMapIndex + WORLD_COLS);
    if (FloorAtGridNo(iMapIndex + 1)) {
      // inside
      BuildWallPiece(iMapIndex + WORLD_COLS, Enum61.EXTERIOR_RIGHT, gubWallUIValue);
      BuildWallPiece(iMapIndex, Enum61.EXTERIOR_RIGHT, gubWallUIValue);
      if (!GetVerticalWall(iMapIndex + WORLD_COLS * 2) && FloorAtGridNo(iMapIndex + WORLD_COLS * 2 + 1))
        ChangeVerticalWall(iMapIndex + WORLD_COLS, Enum60.INTERIOR_BOTTOMEND);
      else // override the damn other smoothing.
        ChangeVerticalWall(iMapIndex + WORLD_COLS, Enum60.INTERIOR_R);
    } else {
      // outside
      BuildWallPiece(iMapIndex + WORLD_COLS, Enum61.INTERIOR_RIGHT, gubWallUIValue);
      BuildWallPiece(iMapIndex, Enum61.INTERIOR_RIGHT, gubWallUIValue);
      if (!GetVerticalWall(iMapIndex + WORLD_COLS * 2) && !FloorAtGridNo(iMapIndex + WORLD_COLS * 2 + 1))
        ChangeVerticalWall(iMapIndex + WORLD_COLS, Enum60.EXTERIOR_BOTTOMEND);
      else // override the damn other smoothing.
        ChangeVerticalWall(iMapIndex + WORLD_COLS, Enum60.EXTERIOR_R);
    }
    return;
  }
  usWallType = GetVerticalWallType(iMapIndex + 1);
  if (usWallType == gubWallUIValue) {
    if (FloorAtGridNo(iMapIndex + WORLD_COLS)) {
      // inside
      BuildWallPiece(iMapIndex + 1, Enum61.EXTERIOR_BOTTOM, gubWallUIValue);
      BuildWallPiece(iMapIndex, Enum61.EXTERIOR_BOTTOM, gubWallUIValue);
      if (!GetVerticalWall(iMapIndex - WORLD_COLS + 1)) {
        EraseVerticalWall(iMapIndex + 1);
        ChangeVerticalWall(iMapIndex + WORLD_COLS + 1, Enum60.INTERIOR_EXTENDED);
      }
      if (!GetVerticalWall(iMapIndex + WORLD_COLS + 1)) {
        if (!GetHorizontalWall(iMapIndex - WORLD_COLS + 1) && !GetVerticalWall(iMapIndex - WORLD_COLS + 1) && GetHorizontalWall(iMapIndex - WORLD_COLS + 2))
          ChangeVerticalWall(iMapIndex + 1, Enum60.INTERIOR_EXTENDED);
        else
          ChangeVerticalWall(iMapIndex + 1, Enum60.INTERIOR_BOTTOMEND);
      }
    } else {
      // outside
      BuildWallPiece(iMapIndex + 1, Enum61.INTERIOR_BOTTOM, gubWallUIValue);
      BuildWallPiece(iMapIndex, Enum61.INTERIOR_BOTTOM, gubWallUIValue);
      if (!GetVerticalWall(iMapIndex - WORLD_COLS + 1)) {
        EraseVerticalWall(iMapIndex + 1);
        ChangeVerticalWall(iMapIndex + WORLD_COLS + 1, Enum60.EXTERIOR_EXTENDED);
      }
      if (!GetVerticalWall(iMapIndex + WORLD_COLS + 1)) {
        if (!GetHorizontalWall(iMapIndex - WORLD_COLS + 1) && !GetVerticalWall(iMapIndex - WORLD_COLS + 1) && GetHorizontalWall(iMapIndex - WORLD_COLS + 2))
          ChangeVerticalWall(iMapIndex + 1, Enum60.EXTERIOR_EXTENDED);
        else
          ChangeVerticalWall(iMapIndex + 1, Enum60.EXTERIOR_BOTTOMEND);
      }
    }
    return;
  }
  // Check for the highest weight value.
}

function PasteSmartDoor(iMapIndex: UINT32): void {
  let pWall: Pointer<LEVELNODE> = NULL;
  let usTileIndex: UINT16;
  let usDoorType: UINT16;
  let usIndex: UINT16;
  let usWallOrientation: UINT16;

  if (pWall = GetVerticalWall(iMapIndex)) {
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    usIndex = CalcSmartDoorIndex(usWallOrientation);
    usDoorType = CalcSmartDoorType();
    AddToUndoList(iMapIndex);
    GetTileIndexFromTypeSubIndex(usDoorType, usIndex, addressof(usTileIndex));
    ReplaceStructIndex(iMapIndex, pWall.value.usIndex, usTileIndex);
  }
  if (pWall = GetHorizontalWall(iMapIndex)) {
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    usIndex = CalcSmartDoorIndex(usWallOrientation);
    usDoorType = CalcSmartDoorType();
    AddToUndoList(iMapIndex);
    GetTileIndexFromTypeSubIndex(usDoorType, usIndex, addressof(usTileIndex));
    ReplaceStructIndex(iMapIndex, pWall.value.usIndex, usTileIndex);
  }
}

function PasteSmartWindow(iMapIndex: UINT32): void {
  let usNewWallIndex: UINT16;

  let pWall: Pointer<LEVELNODE> = NULL;
  let uiTileType: UINT32;
  let usWallType: UINT16;
  let usIndex: UINT16;
  let usWallOrientation: UINT16;

  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall.value.usIndex, addressof(uiTileType));
    usWallType = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
      // We want to be able to replace doors with a window, however, the doors do not
      // contain the wall type, so we have to search for the nearest wall to extract it.
      usWallType = SearchForWallType(iMapIndex);
    }
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    usIndex = CalcSmartWindowIndex(usWallOrientation);
    // Calculate the new graphic for the window type selected.

    AddToUndoList(iMapIndex);
    GetTileIndexFromTypeSubIndex(usWallType, usIndex, addressof(usNewWallIndex));
    ReplaceStructIndex(iMapIndex, pWall.value.usIndex, usNewWallIndex);
  }
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall.value.usIndex, addressof(uiTileType));
    usWallType = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
      // We want to be able to replace doors with a window, however, the doors do not
      // contain the wall type, so we have to search for the nearest wall to extract it.
      usWallType = SearchForWallType(iMapIndex);
    }
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    usIndex = CalcSmartWindowIndex(usWallOrientation);
    // Calculate the new graphic for the window type selected.
    AddToUndoList(iMapIndex);
    GetTileIndexFromTypeSubIndex(usWallType, usIndex, addressof(usNewWallIndex));
    ReplaceStructIndex(iMapIndex, pWall.value.usIndex, usNewWallIndex);
  }
}

function PasteSmartBrokenWall(iMapIndex: UINT32): void {
  let usNewWallIndex: UINT16;

  let pWall: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  let usWallType: UINT16;
  let usIndex: UINT16;
  let usWallOrientation: UINT16;

  pWall = GetVerticalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall.value.usIndex, addressof(uiTileType));
    usWallType = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
      usWallType = SearchForWallType(iMapIndex);
    }
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    usIndex = CalcSmartBrokenWallIndex(usWallOrientation);
    if (usIndex == 0xffff) {
      AddToUndoList(iMapIndex);
      RemoveStruct(iMapIndex, pWall.value.usIndex);
    } else {
      AddToUndoList(iMapIndex);
      GetTileIndexFromTypeSubIndex(usWallType, usIndex, addressof(usNewWallIndex));
      ReplaceStructIndex(iMapIndex, pWall.value.usIndex, usNewWallIndex);
    }
  }
  pWall = GetHorizontalWall(iMapIndex);
  if (pWall) {
    GetTileType(pWall.value.usIndex, addressof(uiTileType));
    usWallType = uiTileType;
    if (uiTileType >= Enum313.FIRSTDOOR && uiTileType <= LASTDOOR) {
      // We want to be able to replace doors with a window, however, the doors do not
      // contain the wall type, so we have to search for the nearest wall to extract it.
      usWallType = SearchForWallType(iMapIndex);
    }
    GetWallOrientation(pWall.value.usIndex, addressof(usWallOrientation));
    usIndex = CalcSmartBrokenWallIndex(usWallOrientation);
    if (usIndex == 0xffff) {
      AddToUndoList(iMapIndex);
      RemoveStruct(iMapIndex, pWall.value.usIndex);
    } else {
      AddToUndoList(iMapIndex);
      GetTileIndexFromTypeSubIndex(usWallType, usIndex, addressof(usNewWallIndex));
      ReplaceStructIndex(iMapIndex, pWall.value.usIndex, usNewWallIndex);
    }
    // Calculate the new graphic for the window type selected.
  }
}
