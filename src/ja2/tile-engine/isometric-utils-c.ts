namespace ja2 {

export let guiForceRefreshMousePositionCalculation: UINT32 = 0;

// GLOBALS
export let DirIncrementer: INT16[] /* [8] */ = [
  -MAPWIDTH, // N
  1 - MAPWIDTH, // NE
  1, // E
  1 + MAPWIDTH, // SE
  MAPWIDTH, // S
  MAPWIDTH - 1, // SW
  -1, // W
  -MAPWIDTH - 1, // NW
];

// Opposite directions
export let gOppositeDirection: UINT8[] /* [NUM_WORLD_DIRECTIONS] */ = [
  Enum245.SOUTH,
  Enum245.SOUTHWEST,
  Enum245.WEST,
  Enum245.NORTHWEST,
  Enum245.NORTH,
  Enum245.NORTHEAST,
  Enum245.EAST,
  Enum245.SOUTHEAST,
];

export let gTwoCCDirection: UINT8[] /* [NUM_WORLD_DIRECTIONS] */ = [
  Enum245.WEST,
  Enum245.NORTHWEST,
  Enum245.NORTH,
  Enum245.NORTHEAST,
  Enum245.EAST,
  Enum245.SOUTHEAST,
  Enum245.SOUTH,
  Enum245.SOUTHWEST,
];

export let gTwoCDirection: UINT8[] /* [NUM_WORLD_DIRECTIONS] */ = [
  Enum245.EAST,
  Enum245.SOUTHEAST,
  Enum245.SOUTH,
  Enum245.SOUTHWEST,
  Enum245.WEST,
  Enum245.NORTHWEST,
  Enum245.NORTH,
  Enum245.NORTHEAST,
];

export let gOneCDirection: UINT8[] /* [NUM_WORLD_DIRECTIONS] */ = [
  Enum245.NORTHEAST,
  Enum245.EAST,
  Enum245.SOUTHEAST,
  Enum245.SOUTH,
  Enum245.SOUTHWEST,
  Enum245.WEST,
  Enum245.NORTHWEST,
  Enum245.NORTH,
];

export let gOneCCDirection: UINT8[] /* [NUM_WORLD_DIRECTIONS] */ = [
  Enum245.NORTHWEST,
  Enum245.NORTH,
  Enum245.NORTHEAST,
  Enum245.EAST,
  Enum245.SOUTHEAST,
  Enum245.SOUTH,
  Enum245.SOUTHWEST,
  Enum245.WEST,
];

//														DIRECTION FACING			 DIRECTION WE WANT TO GOTO
export let gPurpendicularDirection: UINT8[][] /* [NUM_WORLD_DIRECTIONS][NUM_WORLD_DIRECTIONS] */ = [
  // NORTH
  [
    Enum245.WEST, // EITHER
    Enum245.NORTHWEST,
    Enum245.NORTH,
    Enum245.NORTHEAST,
    Enum245.EAST, // EITHER
    Enum245.NORTHWEST,
    Enum245.NORTH,
    Enum245.NORTHEAST,
  ],

  // NORTH EAST
  [
    Enum245.NORTHWEST,
    Enum245.NORTHWEST, // EITHER
    Enum245.SOUTH,
    Enum245.NORTHEAST,
    Enum245.EAST,
    Enum245.SOUTHEAST, // EITHER
    Enum245.NORTH,
    Enum245.NORTHEAST,
  ],

  // EAST
  [
    Enum245.EAST,
    Enum245.SOUTHEAST,
    Enum245.NORTH, // EITHER
    Enum245.NORTHEAST,
    Enum245.EAST,
    Enum245.SOUTHEAST,
    Enum245.NORTH, // EITHER
    Enum245.NORTHEAST,
  ],

  // SOUTHEAST
  [
    Enum245.EAST,
    Enum245.SOUTHEAST,
    Enum245.SOUTH,
    Enum245.SOUTHWEST, // EITHER
    Enum245.SOUTHWEST,
    Enum245.SOUTHEAST,
    Enum245.SOUTH,
    Enum245.SOUTHWEST, // EITHER
  ],

  // SOUTH
  [
    Enum245.WEST, // EITHER
    Enum245.SOUTHEAST,
    Enum245.SOUTH,
    Enum245.SOUTHWEST,
    Enum245.EAST, // EITHER
    Enum245.SOUTHEAST,
    Enum245.SOUTH,
    Enum245.SOUTHWEST,
  ],

  // SOUTHWEST
  [
    Enum245.WEST,
    Enum245.NORTHWEST, // EITHER
    Enum245.SOUTH,
    Enum245.SOUTHWEST,
    Enum245.WEST,
    Enum245.SOUTHEAST, // EITHER
    Enum245.SOUTH,
    Enum245.SOUTHWEST,
  ],

  // WEST
  [
    Enum245.WEST,
    Enum245.NORTHWEST,
    Enum245.NORTH, // EITHER
    Enum245.SOUTHWEST,
    Enum245.WEST,
    Enum245.NORTHWEST,
    Enum245.SOUTH, // EITHER
    Enum245.SOUTHWEST,
  ],

  // NORTHWEST
  [
    Enum245.WEST,
    Enum245.NORTHWEST,
    Enum245.NORTH,
    Enum245.SOUTHWEST, // EITHER
    Enum245.SOUTHWEST,
    Enum245.NORTHWEST,
    Enum245.NORTH,
    Enum245.NORTHEAST, // EITHER
  ],
];

export function FromCellToScreenCoordinates(sCellX: INT16, sCellY: INT16): { sScreenX: INT16, sScreenY: INT16 } {
  let sScreenX: INT16;
  let sScreenY: INT16;

  sScreenX = (2 * sCellX) - (2 * sCellY);
  sScreenY = sCellX + sCellY;

  return { sScreenX, sScreenY };
}

export function FromScreenToCellCoordinates(sScreenX: INT16, sScreenY: INT16): { sCellX: INT16, sCellY: INT16 } {
  let sCellX: INT16;
  let sCellY: INT16;

  sCellX = ((sScreenX + (2 * sScreenY)) / 4);
  sCellY = ((2 * sScreenY) - sScreenX) / 4;

  return { sCellX, sCellY };
}

// These two functions take into account that our world is projected and attached
// to the screen (0,0) in a specific way, and we MUSt take that into account then
// determining screen coords

export function FloatFromCellToScreenCoordinates(dCellX: FLOAT, dCellY: FLOAT): { dScreenX: FLOAT, dScreenY: FLOAT } {
  let dScreenX: FLOAT;
  let dScreenY: FLOAT;

  dScreenX = (2 * dCellX) - (2 * dCellY);
  dScreenY = dCellX + dCellY;

  return { dScreenX, dScreenY };
}

function FloatFromScreenToCellCoordinates(dScreenX: FLOAT, dScreenY: FLOAT): { dCellX: FLOAT, dCellY: FLOAT } {
  let dCellX: FLOAT;
  let dCellY: FLOAT;

  dCellX = ((dScreenX + (2 * dScreenY)) / 4);
  dCellY = ((2 * dScreenY) - dScreenX) / 4;

  return { dCellX, dCellY };
}

export function GetMouseXY(psMouseX: Pointer<INT16>, psMouseY: Pointer<INT16>): boolean {
  let sWorldX: INT16;
  let sWorldY: INT16;

  if (!GetMouseWorldCoords(addressof(sWorldX), addressof(sWorldY))) {
    (psMouseX.value) = 0;
    (psMouseY.value) = 0;
    return false;
  }

  // Find start block
  (psMouseX.value) = (sWorldX / CELL_X_SIZE);
  (psMouseY.value) = (sWorldY / CELL_Y_SIZE);

  return true;
}

export function GetMouseXYWithRemainder(psMouseX: Pointer<INT16>, psMouseY: Pointer<INT16>, psCellX: Pointer<INT16>, psCellY: Pointer<INT16>): boolean {
  let sWorldX: INT16;
  let sWorldY: INT16;

  if (!GetMouseWorldCoords(addressof(sWorldX), addressof(sWorldY))) {
    return false;
  }

  // Find start block
  (psMouseX.value) = (sWorldX / CELL_X_SIZE);
  (psMouseY.value) = (sWorldY / CELL_Y_SIZE);

  (psCellX.value) = sWorldX - ((psMouseX.value) * CELL_X_SIZE);
  (psCellY.value) = sWorldY - ((psMouseY.value) * CELL_Y_SIZE);

  return true;
}

export function GetMouseWorldCoords(psMouseX: Pointer<INT16>, psMouseY: Pointer<INT16>): boolean {
  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let sTempPosX_W: INT16;
  let sTempPosY_W: INT16;
  let sStartPointX_W: INT16;
  let sStartPointY_W: INT16;

  // Convert mouse screen coords into offset from center
  if (!(gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA)) {
    psMouseX.value = 0;
    psMouseY.value = 0;
    return false;
  }

  sOffsetX = gViewportRegion.MouseXPos - ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2); // + gsRenderWorldOffsetX;
  sOffsetY = gViewportRegion.MouseYPos - ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + 10; // + gsRenderWorldOffsetY;

  // OK, Let's offset by a value if our interfac level is changed!
  if (gsInterfaceLevel != 0) {
    // sOffsetY -= 50;
  }

  ({ sCellX: sTempPosX_W, sCellY: sTempPosY_W } = FromScreenToCellCoordinates(sOffsetX, sOffsetY));

  // World start point is Render center plus this distance
  sStartPointX_W = gsRenderCenterX + sTempPosX_W;
  sStartPointY_W = gsRenderCenterY + sTempPosY_W;

  // check if we are out of bounds..
  if (sStartPointX_W < 0 || sStartPointX_W >= WORLD_COORD_ROWS || sStartPointY_W < 0 || sStartPointY_W >= WORLD_COORD_COLS) {
    psMouseX.value = 0;
    psMouseY.value = 0;
    return false;
  }

  // Determine Start block and render offsets
  // Find start block
  // Add adjustment for render origin as well
  (psMouseX.value) = sStartPointX_W;
  (psMouseY.value) = sStartPointY_W;

  return true;
}

export function GetMouseWorldCoordsInCenter(psMouseX: Pointer<INT16>, psMouseY: Pointer<INT16>): boolean {
  let sMouseX: INT16;
  let sMouseY: INT16;

  // Get grid position
  if (!GetMouseXY(addressof(sMouseX), addressof(sMouseY))) {
    return false;
  }

  // Now adjust these cell coords into world coords
  psMouseX.value = ((sMouseX)*CELL_X_SIZE) + (CELL_X_SIZE / 2);
  psMouseY.value = ((sMouseY)*CELL_Y_SIZE) + (CELL_Y_SIZE / 2);

  return true;
}

/* static */ let GetMouseMapPos__sSameCursorPos: INT16;
/* static */ let GetMouseMapPos__uiOldFrameNumber: UINT32 = 99999;
export function GetMouseMapPos(psMapPos: Pointer<INT16>): boolean {
  let sWorldX: INT16;
  let sWorldY: INT16;

  // Check if this is the same frame as before, return already calculated value if so!
  if (GetMouseMapPos__uiOldFrameNumber == guiGameCycleCounter && !guiForceRefreshMousePositionCalculation) {
    (psMapPos.value) = GetMouseMapPos__sSameCursorPos;

    if (GetMouseMapPos__sSameCursorPos == 0) {
      return false;
    }
    return true;
  }

  GetMouseMapPos__uiOldFrameNumber = guiGameCycleCounter;
  guiForceRefreshMousePositionCalculation = false;

  if (GetMouseXY(addressof(sWorldX), addressof(sWorldY))) {
    psMapPos.value = MAPROWCOLTOPOS(sWorldY, sWorldX);
    GetMouseMapPos__sSameCursorPos = (psMapPos.value);
    return true;
  } else {
    psMapPos.value = 0;
    GetMouseMapPos__sSameCursorPos = (psMapPos.value);
    return false;
  }
}

export function ConvertMapPosToWorldTileCenter(usMapPos: UINT16, psXPos: Pointer<INT16>, psYPos: Pointer<INT16>): boolean {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sCellX: INT16;
  let sCellY: INT16;

  // Get X, Y world GRID Coordinates
  sWorldY = (usMapPos / WORLD_COLS);
  sWorldX = usMapPos - (sWorldY * WORLD_COLS);

  // Convert into cell coords
  sCellY = sWorldY * CELL_Y_SIZE;
  sCellX = sWorldX * CELL_X_SIZE;

  // Add center tile positions
  psXPos.value = sCellX + (CELL_X_SIZE / 2);
  psYPos.value = sCellY + (CELL_Y_SIZE / 2);

  return true;
}

function GetScreenXYWorldCoords(sScreenX: INT16, sScreenY: INT16): { sWorldX: INT16, sWorldY: INT16 } {
  let sWorldX: INT16;
  let sWorldY: INT16;

  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let sTempPosX_W: INT16;
  let sTempPosY_W: INT16;
  let sStartPointX_W: INT16;
  let sStartPointY_W: INT16;

  // Convert mouse screen coords into offset from center
  sOffsetX = sScreenX - (gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2;
  sOffsetY = sScreenY - (gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2;

  ({ sCellX: sTempPosX_W, sCellY: sTempPosY_W } = FromScreenToCellCoordinates(sOffsetX, sOffsetY));

  // World start point is Render center plus this distance
  sStartPointX_W = gsRenderCenterX + sTempPosX_W;
  sStartPointY_W = gsRenderCenterY + sTempPosY_W;

  // Determine Start block and render offsets
  // Find start block
  // Add adjustment for render origin as well
  sWorldX = sStartPointX_W;
  sWorldY = sStartPointY_W;

  return { sWorldX, sWorldY };
}

function GetScreenXYWorldCell(sScreenX: INT16, sScreenY: INT16): { sWorldX: INT16, sWorldY: INT16 } {
  let sWorldX: INT16;
  let sWorldY: INT16;

  ({ sWorldX, sWorldY } = GetScreenXYWorldCoords(sScreenX, sScreenY));

  // Find start block
  sWorldX = (sWorldX / CELL_X_SIZE);
  sWorldY = (sWorldY / CELL_Y_SIZE);

  return { sWorldX, sWorldY };
}

export function GetScreenXYGridNo(sScreenX: INT16, sScreenY: INT16): INT16 {
  let sWorldX: INT16;
  let sWorldY: INT16;

  ({ sWorldX, sWorldY } = GetScreenXYWorldCell(sScreenX, sScreenY));

  return MAPROWCOLTOPOS(sWorldY, sWorldX);
}

export function GetWorldXYAbsoluteScreenXY(sWorldCellX: INT32, sWorldCellY: INT32): { sScreenX: INT16, sScreenY: INT16 } {
  let sScreenX: INT16;
  let sScreenY: INT16;

  let sScreenCenterX: INT16;
  let sScreenCenterY: INT16;
  let sDistToCenterY: INT16;
  let sDistToCenterX: INT16;

  // Find the diustance from render center to true world center
  sDistToCenterX = (sWorldCellX * CELL_X_SIZE) - gCenterWorldX;
  sDistToCenterY = (sWorldCellY * CELL_Y_SIZE) - gCenterWorldY;

  // From render center in world coords, convert to render center in "screen" coords

  // ATE: We should call the fowllowing function but I'm putting it here verbatim for speed
  // FromCellToScreenCoordinates( sDistToCenterX , sDistToCenterY, &sScreenCenterX, &sScreenCenterY );
  sScreenCenterX = (2 * sDistToCenterX) - (2 * sDistToCenterY);
  sScreenCenterY = sDistToCenterX + sDistToCenterY;

  // Subtract screen center
  sScreenX = sScreenCenterX + gsCX - gsTLX;
  sScreenY = sScreenCenterY + gsCY - gsTLY;

  return { sScreenX, sScreenY };
}

export function GetFromAbsoluteScreenXYWorldXY(sWorldScreenX: INT16, sWorldScreenY: INT16): { uiCellX: INT32, uiCellY: INT32 } {
  let uiCellX: INT32;
  let uiCellY: INT32;

  let sWorldCenterX: INT16;
  let sWorldCenterY: INT16;
  let sDistToCenterY: INT16;
  let sDistToCenterX: INT16;

  // Subtract screen center
  sDistToCenterX = sWorldScreenX - gsCX + gsTLX;
  sDistToCenterY = sWorldScreenY - gsCY + gsTLY;

  // From render center in world coords, convert to render center in "screen" coords

  // ATE: We should call the fowllowing function but I'm putting it here verbatim for speed
  // FromCellToScreenCoordinates( sDistToCenterX , sDistToCenterY, &sScreenCenterX, &sScreenCenterY );
  sWorldCenterX = ((sDistToCenterX + (2 * sDistToCenterY)) / 4);
  sWorldCenterY = ((2 * sDistToCenterY) - sDistToCenterX) / 4;

  // Goto center again
  uiCellX = sWorldCenterX + gCenterWorldX;
  uiCellY = sWorldCenterY + gCenterWorldY;

  return { uiCellX, uiCellY };
}

// UTILITY FUNTIONS

export function OutOfBounds(sGridno: INT16, sProposedGridno: INT16): boolean {
  let sMod: INT16;
  let sPropMod: INT16;

  // get modulas of our origin
  sMod = sGridno % MAXCOL;

  if (sMod != 0) // if we're not on leftmost grid
    if (sMod != RIGHTMOSTGRID) // if we're not on rightmost grid
      if (sGridno < LASTROWSTART) // if we're above bottom row
        if (sGridno > MAXCOL) // if we're below top row
          // Everything's OK - we're not on the edge of the map
          return false;

  // if we've got this far, there's a potential problem - check it out!

  if (sProposedGridno < 0)
    return true;

  sPropMod = sProposedGridno % MAXCOL;

  if (sMod == 0 && sPropMod == RIGHTMOSTGRID)
    return true;
  else if (sMod == RIGHTMOSTGRID && sPropMod == 0)
    return true;
  else if (sGridno >= LASTROWSTART && sProposedGridno >= GRIDSIZE)
    return true;
  else
    return false;
}

export function NewGridNo(sGridno: INT16, sDirInc: INT16): INT16 {
  let sProposedGridno: INT16 = sGridno + sDirInc;

  // now check for out-of-bounds
  if (OutOfBounds(sGridno, sProposedGridno))
    // return ORIGINAL gridno to user
    sProposedGridno = sGridno;

  return sProposedGridno;
}

export function DirectionInc(sDirection: INT16): INT16 {
  if ((sDirection < 0) || (sDirection > 7)) {
    //#ifdef BETAVERSION
    //   NumMessage("DirectionInc: Invalid direction received, = ",direction);
    //#endif

    // direction = random(8);	// replace garbage with random direction
    sDirection = 1;
  }

  return DirIncrementer[sDirection];
}

export function CellXYToScreenXY(sCellX: INT16, sCellY: INT16): { sScreenX: INT16, sScreenY: INT16 } {
  let sScreenX: INT16;
  let sScreenY: INT16;

  let sDeltaCellX: INT16;
  let sDeltaCellY: INT16;
  let sDeltaScreenX: INT16;
  let sDeltaScreenY: INT16;

  sDeltaCellX = sCellX - gsRenderCenterX;
  sDeltaCellY = sCellY - gsRenderCenterY;

  ({ sScreenX: sDeltaScreenX, sScreenY: sDeltaScreenY } = FromCellToScreenCoordinates(sDeltaCellX, sDeltaCellY));

  sScreenX = (((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + sDeltaScreenX);
  sScreenY = (((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + sDeltaScreenY);

  return { sScreenX, sScreenY };
}

export function ConvertGridNoToXY(sGridNo: INT16): { sX: INT16, sY: INT16 } {
  let sX: INT16;
  let sY: INT16;

  sY = sGridNo / WORLD_COLS;
  sX = (sGridNo - (sY * WORLD_COLS));

  return { sX, sY };
}

export function ConvertGridNoToCellXY(sGridNo: INT16): { sCellX: INT16, sCellY: INT16 } {
  let sCellX: INT16;
  let sCellY: INT16;

  sCellY = (sGridNo / WORLD_COLS);
  sCellX = sGridNo - (sCellY * WORLD_COLS);

  sCellY = (sCellY * CELL_Y_SIZE);
  sCellX = (sCellX * CELL_X_SIZE);

  return { sCellX, sCellY };
}

export function ConvertGridNoToCenterCellXY(sGridNo: INT16): { sX: INT16, sY: INT16 } {
  let sX: INT16;
  let sY: INT16;

  sY = (sGridNo / WORLD_COLS);
  sX = (sGridNo - (sY * WORLD_COLS));

  sY = (sY * CELL_Y_SIZE) + (CELL_Y_SIZE / 2);
  sX = (sX * CELL_X_SIZE) + (CELL_X_SIZE / 2);

  return { sX, sY };
}

export function GetRangeFromGridNoDiff(sGridNo1: INT16, sGridNo2: INT16): INT32 {
  let uiDist: INT32;
  let sXPos: INT16;
  let sYPos: INT16;
  let sXPos2: INT16;
  let sYPos2: INT16;

  // Convert our grid-not into an XY
  ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo1));

  // Convert our grid-not into an XY
  ({ sX: sXPos2, sY: sYPos2 } = ConvertGridNoToXY(sGridNo2));

  uiDist = Math.sqrt((sXPos2 - sXPos) * (sXPos2 - sXPos) + (sYPos2 - sYPos) * (sYPos2 - sYPos));

  return uiDist;
}

export function GetRangeInCellCoordsFromGridNoDiff(sGridNo1: INT16, sGridNo2: INT16): INT32 {
  let sXPos: INT16;
  let sYPos: INT16;
  let sXPos2: INT16;
  let sYPos2: INT16;

  // Convert our grid-not into an XY
  ({ sX: sXPos, sY: sYPos } = ConvertGridNoToXY(sGridNo1));

  // Convert our grid-not into an XY
  ({ sX: sXPos2, sY: sYPos2 } = ConvertGridNoToXY(sGridNo2));

  return (Math.sqrt((sXPos2 - sXPos) * (sXPos2 - sXPos) + (sYPos2 - sYPos) * (sYPos2 - sYPos))) * CELL_X_SIZE;
}

export function IsPointInScreenRect(sXPos: INT16, sYPos: INT16, pRect: SGPRect): boolean {
  if ((sXPos >= pRect.iLeft) && (sXPos <= pRect.iRight) && (sYPos >= pRect.iTop) && (sYPos <= pRect.iBottom)) {
    return true;
  } else {
    return false;
  }
}

export function IsPointInScreenRectWithRelative(sXPos: INT16, sYPos: INT16, pRect: Pointer<SGPRect>, sXRel: Pointer<INT16>, sYRel: Pointer<INT16>): boolean {
  if ((sXPos >= pRect.value.iLeft) && (sXPos <= pRect.value.iRight) && (sYPos >= pRect.value.iTop) && (sYPos <= pRect.value.iBottom)) {
    (sXRel.value) = pRect.value.iLeft - sXPos;
    (sYRel.value) = sYPos - pRect.value.iTop;

    return true;
  } else {
    return false;
  }
}

export function PythSpacesAway(sOrigin: INT16, sDest: INT16): INT16 {
  let sRows: INT16;
  let sCols: INT16;
  let sResult: INT16;

  sRows = Math.abs((sOrigin / MAXCOL) - (sDest / MAXCOL));
  sCols = Math.abs((sOrigin % MAXROW) - (sDest % MAXROW));

  // apply Pythagoras's theorem for right-handed triangle:
  // dist^2 = rows^2 + cols^2, so use the square root to get the distance
  sResult = Math.sqrt((sRows * sRows) + (sCols * sCols));

  return sResult;
}

export function SpacesAway(sOrigin: INT16, sDest: INT16): INT16 {
  let sRows: INT16;
  let sCols: INT16;

  sRows = Math.abs((sOrigin / MAXCOL) - (sDest / MAXCOL));
  sCols = Math.abs((sOrigin % MAXROW) - (sDest % MAXROW));

  return Math.max(sRows, sCols);
}

export function CardinalSpacesAway(sOrigin: INT16, sDest: INT16): INT16
// distance away, ignoring diagonals!
{
  let sRows: INT16;
  let sCols: INT16;

  sRows = Math.abs((sOrigin / MAXCOL) - (sDest / MAXCOL));
  sCols = Math.abs((sOrigin % MAXROW) - (sDest % MAXROW));

  return (sRows + sCols);
}

function FindNumTurnsBetweenDirs(sDir1: INT8, sDir2: INT8): INT8 {
  let sDirection: INT16;
  let sNumTurns: INT16 = 0;

  sDirection = sDir1;

  do {
    sDirection = sDirection + QuickestDirection(sDir1, sDir2);

    if (sDirection > 7) {
      sDirection = 0;
    } else {
      if (sDirection < 0) {
        sDirection = 7;
      }
    }

    if (sDirection == sDir2) {
      break;
    }

    sNumTurns++;

    // SAFEGUARD ! - if we (somehow) do not get to were we want!
    if (sNumTurns > 100) {
      sNumTurns = 0;
      break;
    }
  } while (true);

  return sNumTurns;
}

export function FindHeigherLevel(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bStartingDir: INT8, pbDirection: Pointer<INT8>): boolean {
  let cnt: INT32;
  let sNewGridNo: INT16;
  let fFound: boolean = false;
  let bMinNumTurns: UINT8 = 100;
  let bNumTurns: INT8;
  let bMinDirection: INT8 = 0;

  // IF there is a roof over our heads, this is an ivalid....
  // return ( FALSE );l
  if (FindStructure(sGridNo, STRUCTURE_ROOF) != null) {
    return false;
  }

  // LOOP THROUGH ALL 8 DIRECTIONS
  for (cnt = 0; cnt < 8; cnt += 2) {
    sNewGridNo = NewGridNo(sGridNo, DirectionInc(cnt));

    if (NewOKDestination(pSoldier, sNewGridNo, true, 1)) {
      // Check if this tile has a higher level
      if (IsHeigherLevel(sNewGridNo)) {
        fFound = true;

        // FInd how many turns we should go to get here
        bNumTurns = FindNumTurnsBetweenDirs(cnt, bStartingDir);

        if (bNumTurns < bMinNumTurns) {
          bMinNumTurns = bNumTurns;
          bMinDirection = cnt;
        }
      }
    }
  }

  if (fFound) {
    pbDirection.value = bMinDirection;
    return true;
  }

  return false;
}

export function FindLowerLevel(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bStartingDir: INT8, pbDirection: Pointer<INT8>): boolean {
  let cnt: INT32;
  let sNewGridNo: INT16;
  let fFound: boolean = false;
  let bMinNumTurns: UINT8 = 100;
  let bNumTurns: INT8;
  let bMinDirection: INT8 = 0;

  // LOOP THROUGH ALL 8 DIRECTIONS
  for (cnt = 0; cnt < 8; cnt += 2) {
    sNewGridNo = NewGridNo(sGridNo, DirectionInc(cnt));

    // Make sure there is NOT a roof here...
    // Check OK destination
    if (NewOKDestination(pSoldier, sNewGridNo, true, 0)) {
      if (FindStructure(sNewGridNo, STRUCTURE_ROOF) == null) {
        {
          fFound = true;

          // FInd how many turns we should go to get here
          bNumTurns = FindNumTurnsBetweenDirs(cnt, bStartingDir);

          if (bNumTurns < bMinNumTurns) {
            bMinNumTurns = bNumTurns;
            bMinDirection = cnt;
          }
        }
      }
    }
  }

  if (fFound) {
    pbDirection.value = bMinDirection;
    return true;
  }

  return false;
}

export function QuickestDirection(origin: INT16, dest: INT16): INT16 {
  let v1: INT16;
  let v2: INT16;

  if (origin == dest)
    return 0;

  if ((Math.abs(origin - dest)) == 4)
    return (1); // this could be made random
  else if (origin > dest) {
    v1 = Math.abs(origin - dest);
    v2 = (8 - origin) + dest;
    if (v1 > v2)
      return 1;
    else
      return -1;
  } else {
    v1 = Math.abs(origin - dest);
    v2 = (8 - dest) + origin;
    if (v1 > v2)
      return -1;
    else
      return 1;
  }
}

export function ExtQuickestDirection(origin: INT16, dest: INT16): INT16 {
  let v1: INT16;
  let v2: INT16;

  if (origin == dest)
    return 0;

  if ((Math.abs(origin - dest)) == 16)
    return (1); // this could be made random
  else if (origin > dest) {
    v1 = Math.abs(origin - dest);
    v2 = (32 - origin) + dest;
    if (v1 > v2)
      return 1;
    else
      return -1;
  } else {
    v1 = Math.abs(origin - dest);
    v2 = (32 - dest) + origin;
    if (v1 > v2)
      return -1;
    else
      return 1;
  }
}

// Returns the (center ) cell coordinates in X
export function CenterX(sGridNo: INT16): INT16 {
  let sYPos: INT16;
  let sXPos: INT16;

  sYPos = sGridNo / WORLD_COLS;
  sXPos = (sGridNo - (sYPos * WORLD_COLS));

  return (sXPos * CELL_X_SIZE) + (CELL_X_SIZE / 2);
}

// Returns the (center ) cell coordinates in Y
export function CenterY(sGridNo: INT16): INT16 {
  let sYPos: INT16;
  let sXPos: INT16;

  sYPos = sGridNo / WORLD_COLS;
  sXPos = (sGridNo - (sYPos * WORLD_COLS));

  return (sYPos * CELL_Y_SIZE) + (CELL_Y_SIZE / 2);
}

function MapX(sGridNo: INT16): INT16 {
  let sYPos: INT16;
  let sXPos: INT16;

  sYPos = sGridNo / WORLD_COLS;
  sXPos = (sGridNo - (sYPos * WORLD_COLS));

  return sXPos;
}

function MapY(sGridNo: INT16): INT16 {
  let sYPos: INT16;
  let sXPos: INT16;

  sYPos = sGridNo / WORLD_COLS;
  sXPos = (sGridNo - (sYPos * WORLD_COLS));

  return sYPos;
}

export function GridNoOnVisibleWorldTile(sGridNo: INT16): boolean {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sXMapPos: INT16;
  let sYMapPos: INT16;

  // Check for valid gridno...
  ({ sX: sXMapPos, sY: sYMapPos } = ConvertGridNoToXY(sGridNo));

  // Get screen coordinates for current position of soldier
  ({ sScreenX: sWorldX, sScreenY: sWorldY } = GetWorldXYAbsoluteScreenXY(sXMapPos, sYMapPos));

  if (sWorldX > 0 && sWorldX < (gsTRX - gsTLX - 20) && sWorldY > 20 && sWorldY < (gsBLY - gsTLY - 20)) {
    return true;
  }

  return false;
}

// This function is used when we care about astetics with the top Y portion of the
// gma eplay area
// mostly due to UI bar that comes down....
function GridNoOnVisibleWorldTileGivenYLimits(sGridNo: INT16): boolean {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sXMapPos: INT16;
  let sYMapPos: INT16;

  // Check for valid gridno...
  ({ sX: sXMapPos, sY: sYMapPos } = ConvertGridNoToXY(sGridNo));

  // Get screen coordinates for current position of soldier
  ({ sScreenX: sWorldX, sScreenY: sWorldY } = GetWorldXYAbsoluteScreenXY(sXMapPos, sYMapPos));

  if (sWorldX > 0 && sWorldX < (gsTRX - gsTLX - 20) && sWorldY > 40 && sWorldY < (gsBLY - gsTLY - 20)) {
    return true;
  }

  return false;
}

export function GridNoOnEdgeOfMap(sGridNo: INT16, pbDirection: Pointer<INT8>): boolean {
  let bDir: INT8;

  // check NE, SE, SW, NW because of tilt of isometric display

  for (bDir = Enum245.NORTHEAST; bDir < Enum245.NUM_WORLD_DIRECTIONS; bDir += 2) {
    if (gubWorldMovementCosts[(sGridNo + DirectionInc(bDir))][bDir][0] == TRAVELCOST_OFF_MAP)
    // if ( !GridNoOnVisibleWorldTile( (INT16) (sGridNo + DirectionInc( bDir ) ) ) )
    {
      pbDirection.value = bDir;
      return true;
    }
  }
  return false;
}

export function FindFenceJumpDirection(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bStartingDir: INT8, pbDirection: Pointer<INT8>): boolean {
  let cnt: INT32;
  let sNewGridNo: INT16;
  let sOtherSideOfFence: INT16;
  let fFound: boolean = false;
  let bMinNumTurns: UINT8 = 100;
  let bNumTurns: INT8;
  let bMinDirection: INT8 = 0;

  // IF there is a fence in this gridno, return false!
  if (IsJumpableFencePresentAtGridno(sGridNo)) {
    return false;
  }

  // LOOP THROUGH ALL 8 DIRECTIONS
  for (cnt = 0; cnt < 8; cnt += 2) {
    // go out *2* tiles
    sNewGridNo = NewGridNo(sGridNo, DirectionInc(cnt));
    sOtherSideOfFence = NewGridNo(sNewGridNo, DirectionInc(cnt));

    if (NewOKDestination(pSoldier, sOtherSideOfFence, true, 0)) {
      // ATE: Check if there is somebody waiting here.....

      // Check if we have a fence here
      if (IsJumpableFencePresentAtGridno(sNewGridNo)) {
        fFound = true;

        // FInd how many turns we should go to get here
        bNumTurns = FindNumTurnsBetweenDirs(cnt, bStartingDir);

        if (bNumTurns < bMinNumTurns) {
          bMinNumTurns = bNumTurns;
          bMinDirection = cnt;
        }
      }
    }
  }

  if (fFound) {
    pbDirection.value = bMinDirection;
    return true;
  }

  return false;
}

// Simply chooses a random gridno within valid boundaries (for dropping things in unloaded sectors)
export function RandomGridNo(): INT16 {
  let iMapXPos: INT32;
  let iMapYPos: INT32;
  let iMapIndex: INT32;
  do {
    iMapXPos = Random(WORLD_COLS);
    iMapYPos = Random(WORLD_ROWS);
    iMapIndex = iMapYPos * WORLD_COLS + iMapXPos;
  } while (!GridNoOnVisibleWorldTile(iMapIndex));
  return iMapIndex;
}

}
