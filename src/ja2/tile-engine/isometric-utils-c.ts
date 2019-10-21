UINT32 guiForceRefreshMousePositionCalculation = 0;

// GLOBALS
INT16 DirIncrementer[8] = {
  -MAPWIDTH, // N
  1 - MAPWIDTH, // NE
  1, // E
  1 + MAPWIDTH, // SE
  MAPWIDTH, // S
  MAPWIDTH - 1, // SW
  -1, // W
  -MAPWIDTH - 1, // NW
};

// Opposite directions
UINT8 gOppositeDirection[NUM_WORLD_DIRECTIONS] = {
  SOUTH,
  SOUTHWEST,
  WEST,
  NORTHWEST,
  NORTH,
  NORTHEAST,
  EAST,
  SOUTHEAST,
};

UINT8 gTwoCCDirection[NUM_WORLD_DIRECTIONS] = {
  WEST,
  NORTHWEST,
  NORTH,
  NORTHEAST,
  EAST,
  SOUTHEAST,
  SOUTH,
  SOUTHWEST,
};

UINT8 gTwoCDirection[NUM_WORLD_DIRECTIONS] = {
  EAST,
  SOUTHEAST,
  SOUTH,
  SOUTHWEST,
  WEST,
  NORTHWEST,
  NORTH,
  NORTHEAST,
};

UINT8 gOneCDirection[NUM_WORLD_DIRECTIONS] = {
  NORTHEAST,
  EAST,
  SOUTHEAST,
  SOUTH,
  SOUTHWEST,
  WEST,
  NORTHWEST,
  NORTH,
};

UINT8 gOneCCDirection[NUM_WORLD_DIRECTIONS] = {
  NORTHWEST,
  NORTH,
  NORTHEAST,
  EAST,
  SOUTHEAST,
  SOUTH,
  SOUTHWEST,
  WEST,
};

//														DIRECTION FACING			 DIRECTION WE WANT TO GOTO
UINT8 gPurpendicularDirection[NUM_WORLD_DIRECTIONS][NUM_WORLD_DIRECTIONS] = {
  // NORTH
  {
    WEST, // EITHER
    NORTHWEST,
    NORTH,
    NORTHEAST,
    EAST, // EITHER
    NORTHWEST,
    NORTH,
    NORTHEAST,
  },

  // NORTH EAST
  {
    NORTHWEST,
    NORTHWEST, // EITHER
    SOUTH,
    NORTHEAST,
    EAST,
    SOUTHEAST, // EITHER
    NORTH,
    NORTHEAST,
  },

  // EAST
  {
    EAST,
    SOUTHEAST,
    NORTH, // EITHER
    NORTHEAST,
    EAST,
    SOUTHEAST,
    NORTH, // EITHER
    NORTHEAST,
  },

  // SOUTHEAST
  {
    EAST,
    SOUTHEAST,
    SOUTH,
    SOUTHWEST, // EITHER
    SOUTHWEST,
    SOUTHEAST,
    SOUTH,
    SOUTHWEST, // EITHER
  },

  // SOUTH
  {
    WEST, // EITHER
    SOUTHEAST,
    SOUTH,
    SOUTHWEST,
    EAST, // EITHER
    SOUTHEAST,
    SOUTH,
    SOUTHWEST,
  },

  // SOUTHWEST
  {
    WEST,
    NORTHWEST, // EITHER
    SOUTH,
    SOUTHWEST,
    WEST,
    SOUTHEAST, // EITHER
    SOUTH,
    SOUTHWEST,
  },

  // WEST
  {
    WEST,
    NORTHWEST,
    NORTH, // EITHER
    SOUTHWEST,
    WEST,
    NORTHWEST,
    SOUTH, // EITHER
    SOUTHWEST,
  },

  // NORTHWEST
  {
    WEST,
    NORTHWEST,
    NORTH,
    SOUTHWEST, // EITHER
    SOUTHWEST,
    NORTHWEST,
    NORTH,
    NORTHEAST, // EITHER
  },
};

function FromCellToScreenCoordinates(sCellX: INT16, sCellY: INT16, psScreenX: Pointer<INT16>, psScreenY: Pointer<INT16>): void {
  *psScreenX = (2 * sCellX) - (2 * sCellY);
  *psScreenY = sCellX + sCellY;
}

function FromScreenToCellCoordinates(sScreenX: INT16, sScreenY: INT16, psCellX: Pointer<INT16>, psCellY: Pointer<INT16>): void {
  *psCellX = ((sScreenX + (2 * sScreenY)) / 4);
  *psCellY = ((2 * sScreenY) - sScreenX) / 4;
}

// These two functions take into account that our world is projected and attached
// to the screen (0,0) in a specific way, and we MUSt take that into account then
// determining screen coords

function FloatFromCellToScreenCoordinates(dCellX: FLOAT, dCellY: FLOAT, pdScreenX: Pointer<FLOAT>, pdScreenY: Pointer<FLOAT>): void {
  FLOAT dScreenX, dScreenY;

  dScreenX = (2 * dCellX) - (2 * dCellY);
  dScreenY = dCellX + dCellY;

  *pdScreenX = dScreenX;
  *pdScreenY = dScreenY;
}

function FloatFromScreenToCellCoordinates(dScreenX: FLOAT, dScreenY: FLOAT, pdCellX: Pointer<FLOAT>, pdCellY: Pointer<FLOAT>): void {
  FLOAT dCellX, dCellY;

  dCellX = ((dScreenX + (2 * dScreenY)) / 4);
  dCellY = ((2 * dScreenY) - dScreenX) / 4;

  *pdCellX = dCellX;
  *pdCellY = dCellY;
}

function GetMouseXY(psMouseX: Pointer<INT16>, psMouseY: Pointer<INT16>): BOOLEAN {
  INT16 sWorldX, sWorldY;

  if (!GetMouseWorldCoords(&sWorldX, &sWorldY)) {
    (*psMouseX) = 0;
    (*psMouseY) = 0;
    return FALSE;
  }

  // Find start block
  (*psMouseX) = (sWorldX / CELL_X_SIZE);
  (*psMouseY) = (sWorldY / CELL_Y_SIZE);

  return TRUE;
}

function GetMouseXYWithRemainder(psMouseX: Pointer<INT16>, psMouseY: Pointer<INT16>, psCellX: Pointer<INT16>, psCellY: Pointer<INT16>): BOOLEAN {
  INT16 sWorldX, sWorldY;

  if (!GetMouseWorldCoords(&sWorldX, &sWorldY)) {
    return FALSE;
  }

  // Find start block
  (*psMouseX) = (sWorldX / CELL_X_SIZE);
  (*psMouseY) = (sWorldY / CELL_Y_SIZE);

  (*psCellX) = sWorldX - ((*psMouseX) * CELL_X_SIZE);
  (*psCellY) = sWorldY - ((*psMouseY) * CELL_Y_SIZE);

  return TRUE;
}

function GetMouseWorldCoords(psMouseX: Pointer<INT16>, psMouseY: Pointer<INT16>): BOOLEAN {
  INT16 sOffsetX, sOffsetY;
  INT16 sTempPosX_W, sTempPosY_W;
  INT16 sStartPointX_W, sStartPointY_W;

  // Convert mouse screen coords into offset from center
  if (!(gViewportRegion.uiFlags & MSYS_MOUSE_IN_AREA)) {
    *psMouseX = 0;
    *psMouseY = 0;
    return FALSE;
  }

  sOffsetX = gViewportRegion.MouseXPos - ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2); // + gsRenderWorldOffsetX;
  sOffsetY = gViewportRegion.MouseYPos - ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + 10; // + gsRenderWorldOffsetY;

  // OK, Let's offset by a value if our interfac level is changed!
  if (gsInterfaceLevel != 0) {
    // sOffsetY -= 50;
  }

  FromScreenToCellCoordinates(sOffsetX, sOffsetY, &sTempPosX_W, &sTempPosY_W);

  // World start point is Render center plus this distance
  sStartPointX_W = gsRenderCenterX + sTempPosX_W;
  sStartPointY_W = gsRenderCenterY + sTempPosY_W;

  // check if we are out of bounds..
  if (sStartPointX_W < 0 || sStartPointX_W >= WORLD_COORD_ROWS || sStartPointY_W < 0 || sStartPointY_W >= WORLD_COORD_COLS) {
    *psMouseX = 0;
    *psMouseY = 0;
    return FALSE;
  }

  // Determine Start block and render offsets
  // Find start block
  // Add adjustment for render origin as well
  (*psMouseX) = sStartPointX_W;
  (*psMouseY) = sStartPointY_W;

  return TRUE;
}

function GetMouseWorldCoordsInCenter(psMouseX: Pointer<INT16>, psMouseY: Pointer<INT16>): BOOLEAN {
  INT16 sMouseX, sMouseY;

  // Get grid position
  if (!GetMouseXY(&sMouseX, &sMouseY)) {
    return FALSE;
  }

  // Now adjust these cell coords into world coords
  *psMouseX = ((sMouseX)*CELL_X_SIZE) + (CELL_X_SIZE / 2);
  *psMouseY = ((sMouseY)*CELL_Y_SIZE) + (CELL_Y_SIZE / 2);

  return TRUE;
}

function GetMouseMapPos(psMapPos: Pointer<INT16>): BOOLEAN {
  INT16 sWorldX, sWorldY;
  static INT16 sSameCursorPos;
  static UINT32 uiOldFrameNumber = 99999;

  // Check if this is the same frame as before, return already calculated value if so!
  if (uiOldFrameNumber == guiGameCycleCounter && !guiForceRefreshMousePositionCalculation) {
    (*psMapPos) = sSameCursorPos;

    if (sSameCursorPos == 0) {
      return FALSE;
    }
    return TRUE;
  }

  uiOldFrameNumber = guiGameCycleCounter;
  guiForceRefreshMousePositionCalculation = FALSE;

  if (GetMouseXY(&sWorldX, &sWorldY)) {
    *psMapPos = MAPROWCOLTOPOS(sWorldY, sWorldX);
    sSameCursorPos = (*psMapPos);
    return TRUE;
  } else {
    *psMapPos = 0;
    sSameCursorPos = (*psMapPos);
    return FALSE;
  }
}

function ConvertMapPosToWorldTileCenter(usMapPos: UINT16, psXPos: Pointer<INT16>, psYPos: Pointer<INT16>): BOOLEAN {
  INT16 sWorldX, sWorldY;
  INT16 sCellX, sCellY;

  // Get X, Y world GRID Coordinates
  sWorldY = (usMapPos / WORLD_COLS);
  sWorldX = usMapPos - (sWorldY * WORLD_COLS);

  // Convert into cell coords
  sCellY = sWorldY * CELL_Y_SIZE;
  sCellX = sWorldX * CELL_X_SIZE;

  // Add center tile positions
  *psXPos = sCellX + (CELL_X_SIZE / 2);
  *psYPos = sCellY + (CELL_Y_SIZE / 2);

  return TRUE;
}

function GetScreenXYWorldCoords(sScreenX: INT16, sScreenY: INT16, psWorldX: Pointer<INT16>, psWorldY: Pointer<INT16>): void {
  INT16 sOffsetX, sOffsetY;
  INT16 sTempPosX_W, sTempPosY_W;
  INT16 sStartPointX_W, sStartPointY_W;

  // Convert mouse screen coords into offset from center
  sOffsetX = sScreenX - (gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2;
  sOffsetY = sScreenY - (gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2;

  FromScreenToCellCoordinates(sOffsetX, sOffsetY, &sTempPosX_W, &sTempPosY_W);

  // World start point is Render center plus this distance
  sStartPointX_W = gsRenderCenterX + sTempPosX_W;
  sStartPointY_W = gsRenderCenterY + sTempPosY_W;

  // Determine Start block and render offsets
  // Find start block
  // Add adjustment for render origin as well
  (*psWorldX) = sStartPointX_W;
  (*psWorldY) = sStartPointY_W;
}

function GetScreenXYWorldCell(sScreenX: INT16, sScreenY: INT16, psWorldCellX: Pointer<INT16>, psWorldCellY: Pointer<INT16>): void {
  INT16 sWorldX, sWorldY;

  GetScreenXYWorldCoords(sScreenX, sScreenY, &sWorldX, &sWorldY);

  // Find start block
  (*psWorldCellX) = (sWorldX / CELL_X_SIZE);
  (*psWorldCellY) = (sWorldY / CELL_Y_SIZE);
}

function GetScreenXYGridNo(sScreenX: INT16, sScreenY: INT16, psMapPos: Pointer<INT16>): void {
  INT16 sWorldX, sWorldY;

  GetScreenXYWorldCell(sScreenX, sScreenY, &sWorldX, &sWorldY);

  *psMapPos = MAPROWCOLTOPOS(sWorldY, sWorldX);
}

function GetWorldXYAbsoluteScreenXY(sWorldCellX: INT32, sWorldCellY: INT32, psWorldScreenX: Pointer<INT16>, psWorldScreenY: Pointer<INT16>): void {
  INT16 sScreenCenterX, sScreenCenterY;
  INT16 sDistToCenterY, sDistToCenterX;

  // Find the diustance from render center to true world center
  sDistToCenterX = (sWorldCellX * CELL_X_SIZE) - gCenterWorldX;
  sDistToCenterY = (sWorldCellY * CELL_Y_SIZE) - gCenterWorldY;

  // From render center in world coords, convert to render center in "screen" coords

  // ATE: We should call the fowllowing function but I'm putting it here verbatim for speed
  // FromCellToScreenCoordinates( sDistToCenterX , sDistToCenterY, &sScreenCenterX, &sScreenCenterY );
  sScreenCenterX = (2 * sDistToCenterX) - (2 * sDistToCenterY);
  sScreenCenterY = sDistToCenterX + sDistToCenterY;

  // Subtract screen center
  *psWorldScreenX = sScreenCenterX + gsCX - gsTLX;
  *psWorldScreenY = sScreenCenterY + gsCY - gsTLY;
}

function GetFromAbsoluteScreenXYWorldXY(psWorldCellX: Pointer<INT32>, psWorldCellY: Pointer<INT32>, sWorldScreenX: INT16, sWorldScreenY: INT16): void {
  INT16 sWorldCenterX, sWorldCenterY;
  INT16 sDistToCenterY, sDistToCenterX;

  // Subtract screen center
  sDistToCenterX = sWorldScreenX - gsCX + gsTLX;
  sDistToCenterY = sWorldScreenY - gsCY + gsTLY;

  // From render center in world coords, convert to render center in "screen" coords

  // ATE: We should call the fowllowing function but I'm putting it here verbatim for speed
  // FromCellToScreenCoordinates( sDistToCenterX , sDistToCenterY, &sScreenCenterX, &sScreenCenterY );
  sWorldCenterX = ((sDistToCenterX + (2 * sDistToCenterY)) / 4);
  sWorldCenterY = ((2 * sDistToCenterY) - sDistToCenterX) / 4;

  // Goto center again
  *psWorldCellX = sWorldCenterX + gCenterWorldX;
  *psWorldCellY = sWorldCenterY + gCenterWorldY;
}

// UTILITY FUNTIONS

function OutOfBounds(sGridno: INT16, sProposedGridno: INT16): INT32 {
  INT16 sMod, sPropMod;

  // get modulas of our origin
  sMod = sGridno % MAXCOL;

  if (sMod != 0) // if we're not on leftmost grid
    if (sMod != RIGHTMOSTGRID) // if we're not on rightmost grid
      if (sGridno < LASTROWSTART) // if we're above bottom row
        if (sGridno > MAXCOL) // if we're below top row
          // Everything's OK - we're not on the edge of the map
          return FALSE;

  // if we've got this far, there's a potential problem - check it out!

  if (sProposedGridno < 0)
    return TRUE;

  sPropMod = sProposedGridno % MAXCOL;

  if (sMod == 0 && sPropMod == RIGHTMOSTGRID)
    return TRUE;
  else if (sMod == RIGHTMOSTGRID && sPropMod == 0)
    return TRUE;
  else if (sGridno >= LASTROWSTART && sProposedGridno >= GRIDSIZE)
    return TRUE;
  else
    return FALSE;
}

function NewGridNo(sGridno: INT16, sDirInc: INT16): INT16 {
  INT16 sProposedGridno = sGridno + sDirInc;

  // now check for out-of-bounds
  if (OutOfBounds(sGridno, sProposedGridno))
    // return ORIGINAL gridno to user
    sProposedGridno = sGridno;

  return sProposedGridno;
}

function DirectionInc(sDirection: INT16): INT16 {
  if ((sDirection < 0) || (sDirection > 7)) {
    //#ifdef BETAVERSION
    //   NumMessage("DirectionInc: Invalid direction received, = ",direction);
    //#endif

    // direction = random(8);	// replace garbage with random direction
    sDirection = 1;
  }

  return DirIncrementer[sDirection];
}

function CellXYToScreenXY(sCellX: INT16, sCellY: INT16, sScreenX: Pointer<INT16>, sScreenY: Pointer<INT16>): BOOLEAN {
  INT16 sDeltaCellX, sDeltaCellY;
  INT16 sDeltaScreenX, sDeltaScreenY;

  sDeltaCellX = sCellX - gsRenderCenterX;
  sDeltaCellY = sCellY - gsRenderCenterY;

  FromCellToScreenCoordinates(sDeltaCellX, sDeltaCellY, &sDeltaScreenX, &sDeltaScreenY);

  *sScreenX = (((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + sDeltaScreenX);
  *sScreenY = (((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + sDeltaScreenY);

  return TRUE;
}

function ConvertGridNoToXY(sGridNo: INT16, sXPos: Pointer<INT16>, sYPos: Pointer<INT16>): void {
  *sYPos = sGridNo / WORLD_COLS;
  *sXPos = (sGridNo - (*sYPos * WORLD_COLS));
}

function ConvertGridNoToCellXY(sGridNo: INT16, sXPos: Pointer<INT16>, sYPos: Pointer<INT16>): void {
  *sYPos = (sGridNo / WORLD_COLS);
  *sXPos = sGridNo - (*sYPos * WORLD_COLS);

  *sYPos = (*sYPos * CELL_Y_SIZE);
  *sXPos = (*sXPos * CELL_X_SIZE);
}

function ConvertGridNoToCenterCellXY(sGridNo: INT16, sXPos: Pointer<INT16>, sYPos: Pointer<INT16>): void {
  *sYPos = (sGridNo / WORLD_COLS);
  *sXPos = (sGridNo - (*sYPos * WORLD_COLS));

  *sYPos = (*sYPos * CELL_Y_SIZE) + (CELL_Y_SIZE / 2);
  *sXPos = (*sXPos * CELL_X_SIZE) + (CELL_X_SIZE / 2);
}

function GetRangeFromGridNoDiff(sGridNo1: INT16, sGridNo2: INT16): INT32 {
  INT32 uiDist;
  INT16 sXPos, sYPos, sXPos2, sYPos2;

  // Convert our grid-not into an XY
  ConvertGridNoToXY(sGridNo1, &sXPos, &sYPos);

  // Convert our grid-not into an XY
  ConvertGridNoToXY(sGridNo2, &sXPos2, &sYPos2);

  uiDist = (INT16)sqrt((sXPos2 - sXPos) * (sXPos2 - sXPos) + (sYPos2 - sYPos) * (sYPos2 - sYPos));

  return uiDist;
}

function GetRangeInCellCoordsFromGridNoDiff(sGridNo1: INT16, sGridNo2: INT16): INT32 {
  INT16 sXPos, sYPos, sXPos2, sYPos2;

  // Convert our grid-not into an XY
  ConvertGridNoToXY(sGridNo1, &sXPos, &sYPos);

  // Convert our grid-not into an XY
  ConvertGridNoToXY(sGridNo2, &sXPos2, &sYPos2);

  return (INT32)(sqrt((sXPos2 - sXPos) * (sXPos2 - sXPos) + (sYPos2 - sYPos) * (sYPos2 - sYPos))) * CELL_X_SIZE;
}

function IsPointInScreenRect(sXPos: INT16, sYPos: INT16, pRect: Pointer<SGPRect>): BOOLEAN {
  if ((sXPos >= pRect->iLeft) && (sXPos <= pRect->iRight) && (sYPos >= pRect->iTop) && (sYPos <= pRect->iBottom)) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function IsPointInScreenRectWithRelative(sXPos: INT16, sYPos: INT16, pRect: Pointer<SGPRect>, sXRel: Pointer<INT16>, sYRel: Pointer<INT16>): BOOLEAN {
  if ((sXPos >= pRect->iLeft) && (sXPos <= pRect->iRight) && (sYPos >= pRect->iTop) && (sYPos <= pRect->iBottom)) {
    (*sXRel) = pRect->iLeft - sXPos;
    (*sYRel) = sYPos - (INT16)pRect->iTop;

    return TRUE;
  } else {
    return FALSE;
  }
}

function PythSpacesAway(sOrigin: INT16, sDest: INT16): INT16 {
  INT16 sRows, sCols, sResult;

  sRows = abs((sOrigin / MAXCOL) - (sDest / MAXCOL));
  sCols = abs((sOrigin % MAXROW) - (sDest % MAXROW));

  // apply Pythagoras's theorem for right-handed triangle:
  // dist^2 = rows^2 + cols^2, so use the square root to get the distance
  sResult = (INT16)sqrt((sRows * sRows) + (sCols * sCols));

  return sResult;
}

function SpacesAway(sOrigin: INT16, sDest: INT16): INT16 {
  INT16 sRows, sCols;

  sRows = abs((sOrigin / MAXCOL) - (sDest / MAXCOL));
  sCols = abs((sOrigin % MAXROW) - (sDest % MAXROW));

  return __max(sRows, sCols);
}

function CardinalSpacesAway(sOrigin: INT16, sDest: INT16): INT16
// distance away, ignoring diagonals!
{
  INT16 sRows, sCols;

  sRows = abs((sOrigin / MAXCOL) - (sDest / MAXCOL));
  sCols = abs((sOrigin % MAXROW) - (sDest % MAXROW));

  return (INT16)(sRows + sCols);
}

function FindNumTurnsBetweenDirs(sDir1: INT8, sDir2: INT8): INT8 {
  INT16 sDirection;
  INT16 sNumTurns = 0;

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
  } while (TRUE);

  return (INT8)sNumTurns;
}

function FindHeigherLevel(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bStartingDir: INT8, pbDirection: Pointer<INT8>): BOOLEAN {
  INT32 cnt;
  INT16 sNewGridNo;
  BOOLEAN fFound = FALSE;
  UINT8 bMinNumTurns = 100;
  INT8 bNumTurns;
  INT8 bMinDirection = 0;

  // IF there is a roof over our heads, this is an ivalid....
  // return ( FALSE );l
  if (FindStructure(sGridNo, STRUCTURE_ROOF) != NULL) {
    return FALSE;
  }

  // LOOP THROUGH ALL 8 DIRECTIONS
  for (cnt = 0; cnt < 8; cnt += 2) {
    sNewGridNo = NewGridNo((UINT16)sGridNo, (UINT16)DirectionInc((UINT8)cnt));

    if (NewOKDestination(pSoldier, sNewGridNo, TRUE, 1)) {
      // Check if this tile has a higher level
      if (IsHeigherLevel(sNewGridNo)) {
        fFound = TRUE;

        // FInd how many turns we should go to get here
        bNumTurns = FindNumTurnsBetweenDirs((INT8)cnt, bStartingDir);

        if (bNumTurns < bMinNumTurns) {
          bMinNumTurns = bNumTurns;
          bMinDirection = (INT8)cnt;
        }
      }
    }
  }

  if (fFound) {
    *pbDirection = bMinDirection;
    return TRUE;
  }

  return FALSE;
}

function FindLowerLevel(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bStartingDir: INT8, pbDirection: Pointer<INT8>): BOOLEAN {
  INT32 cnt;
  INT16 sNewGridNo;
  BOOLEAN fFound = FALSE;
  UINT8 bMinNumTurns = 100;
  INT8 bNumTurns;
  INT8 bMinDirection = 0;

  // LOOP THROUGH ALL 8 DIRECTIONS
  for (cnt = 0; cnt < 8; cnt += 2) {
    sNewGridNo = NewGridNo((UINT16)sGridNo, (UINT16)DirectionInc((UINT8)cnt));

    // Make sure there is NOT a roof here...
    // Check OK destination
    if (NewOKDestination(pSoldier, sNewGridNo, TRUE, 0)) {
      if (FindStructure(sNewGridNo, STRUCTURE_ROOF) == NULL) {
        {
          fFound = TRUE;

          // FInd how many turns we should go to get here
          bNumTurns = FindNumTurnsBetweenDirs((INT8)cnt, bStartingDir);

          if (bNumTurns < bMinNumTurns) {
            bMinNumTurns = bNumTurns;
            bMinDirection = (INT8)cnt;
          }
        }
      }
    }
  }

  if (fFound) {
    *pbDirection = bMinDirection;
    return TRUE;
  }

  return FALSE;
}

function QuickestDirection(origin: INT16, dest: INT16): INT16 {
  INT16 v1, v2;

  if (origin == dest)
    return 0;

  if ((abs(origin - dest)) == 4)
    return (1); // this could be made random
  else if (origin > dest) {
    v1 = abs(origin - dest);
    v2 = (8 - origin) + dest;
    if (v1 > v2)
      return 1;
    else
      return -1;
  } else {
    v1 = abs(origin - dest);
    v2 = (8 - dest) + origin;
    if (v1 > v2)
      return -1;
    else
      return 1;
  }
}

function ExtQuickestDirection(origin: INT16, dest: INT16): INT16 {
  INT16 v1, v2;

  if (origin == dest)
    return 0;

  if ((abs(origin - dest)) == 16)
    return (1); // this could be made random
  else if (origin > dest) {
    v1 = abs(origin - dest);
    v2 = (32 - origin) + dest;
    if (v1 > v2)
      return 1;
    else
      return -1;
  } else {
    v1 = abs(origin - dest);
    v2 = (32 - dest) + origin;
    if (v1 > v2)
      return -1;
    else
      return 1;
  }
}

// Returns the (center ) cell coordinates in X
function CenterX(sGridNo: INT16): INT16 {
  INT16 sYPos, sXPos;

  sYPos = sGridNo / WORLD_COLS;
  sXPos = (sGridNo - (sYPos * WORLD_COLS));

  return (sXPos * CELL_X_SIZE) + (CELL_X_SIZE / 2);
}

// Returns the (center ) cell coordinates in Y
function CenterY(sGridNo: INT16): INT16 {
  INT16 sYPos, sXPos;

  sYPos = sGridNo / WORLD_COLS;
  sXPos = (sGridNo - (sYPos * WORLD_COLS));

  return (sYPos * CELL_Y_SIZE) + (CELL_Y_SIZE / 2);
}

function MapX(sGridNo: INT16): INT16 {
  INT16 sYPos, sXPos;

  sYPos = sGridNo / WORLD_COLS;
  sXPos = (sGridNo - (sYPos * WORLD_COLS));

  return sXPos;
}

function MapY(sGridNo: INT16): INT16 {
  INT16 sYPos, sXPos;

  sYPos = sGridNo / WORLD_COLS;
  sXPos = (sGridNo - (sYPos * WORLD_COLS));

  return sYPos;
}

function GridNoOnVisibleWorldTile(sGridNo: INT16): BOOLEAN {
  INT16 sWorldX;
  INT16 sWorldY;
  INT16 sXMapPos, sYMapPos;

  // Check for valid gridno...
  ConvertGridNoToXY(sGridNo, &sXMapPos, &sYMapPos);

  // Get screen coordinates for current position of soldier
  GetWorldXYAbsoluteScreenXY(sXMapPos, sYMapPos, &sWorldX, &sWorldY);

  if (sWorldX > 0 && sWorldX < (gsTRX - gsTLX - 20) && sWorldY > 20 && sWorldY < (gsBLY - gsTLY - 20)) {
    return TRUE;
  }

  return FALSE;
}

// This function is used when we care about astetics with the top Y portion of the
// gma eplay area
// mostly due to UI bar that comes down....
function GridNoOnVisibleWorldTileGivenYLimits(sGridNo: INT16): BOOLEAN {
  INT16 sWorldX;
  INT16 sWorldY;
  INT16 sXMapPos, sYMapPos;

  // Check for valid gridno...
  ConvertGridNoToXY(sGridNo, &sXMapPos, &sYMapPos);

  // Get screen coordinates for current position of soldier
  GetWorldXYAbsoluteScreenXY(sXMapPos, sYMapPos, &sWorldX, &sWorldY);

  if (sWorldX > 0 && sWorldX < (gsTRX - gsTLX - 20) && sWorldY > 40 && sWorldY < (gsBLY - gsTLY - 20)) {
    return TRUE;
  }

  return FALSE;
}

function GridNoOnEdgeOfMap(sGridNo: INT16, pbDirection: Pointer<INT8>): BOOLEAN {
  INT8 bDir;

  // check NE, SE, SW, NW because of tilt of isometric display

  for (bDir = NORTHEAST; bDir < NUM_WORLD_DIRECTIONS; bDir += 2) {
    if (gubWorldMovementCosts[(sGridNo + DirectionInc(bDir))][bDir][0] == TRAVELCOST_OFF_MAP)
    // if ( !GridNoOnVisibleWorldTile( (INT16) (sGridNo + DirectionInc( bDir ) ) ) )
    {
      *pbDirection = bDir;
      return TRUE;
    }
  }
  return FALSE;
}

function FindFenceJumpDirection(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bStartingDir: INT8, pbDirection: Pointer<INT8>): BOOLEAN {
  INT32 cnt;
  INT16 sNewGridNo, sOtherSideOfFence;
  BOOLEAN fFound = FALSE;
  UINT8 bMinNumTurns = 100;
  INT8 bNumTurns;
  INT8 bMinDirection = 0;

  // IF there is a fence in this gridno, return false!
  if (IsJumpableFencePresentAtGridno(sGridNo)) {
    return FALSE;
  }

  // LOOP THROUGH ALL 8 DIRECTIONS
  for (cnt = 0; cnt < 8; cnt += 2) {
    // go out *2* tiles
    sNewGridNo = NewGridNo((UINT16)sGridNo, (UINT16)DirectionInc((UINT8)cnt));
    sOtherSideOfFence = NewGridNo((UINT16)sNewGridNo, (UINT16)DirectionInc((UINT8)cnt));

    if (NewOKDestination(pSoldier, sOtherSideOfFence, TRUE, 0)) {
      // ATE: Check if there is somebody waiting here.....

      // Check if we have a fence here
      if (IsJumpableFencePresentAtGridno(sNewGridNo)) {
        fFound = TRUE;

        // FInd how many turns we should go to get here
        bNumTurns = FindNumTurnsBetweenDirs((INT8)cnt, bStartingDir);

        if (bNumTurns < bMinNumTurns) {
          bMinNumTurns = bNumTurns;
          bMinDirection = (INT8)cnt;
        }
      }
    }
  }

  if (fFound) {
    *pbDirection = bMinDirection;
    return TRUE;
  }

  return FALSE;
}

// Simply chooses a random gridno within valid boundaries (for dropping things in unloaded sectors)
function RandomGridNo(): INT16 {
  INT32 iMapXPos, iMapYPos, iMapIndex;
  do {
    iMapXPos = Random(WORLD_COLS);
    iMapYPos = Random(WORLD_ROWS);
    iMapIndex = iMapYPos * WORLD_COLS + iMapXPos;
  } while (!GridNoOnVisibleWorldTile((INT16)iMapIndex));
  return (INT16)iMapIndex;
}
