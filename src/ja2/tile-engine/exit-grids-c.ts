let gfLoadingExitGrids: BOOLEAN = FALSE;

// used by editor.
let gExitGrid: EXITGRID = { 0, 1, 1, 0 };

let gfOverrideInsertionWithExitGrid: BOOLEAN = FALSE;

function ConvertExitGridToINT32(pExitGrid: Pointer<EXITGRID>): INT32 {
  let iExitGridInfo: INT32;
  iExitGridInfo = (pExitGrid->ubGotoSectorX - 1) << 28;
  iExitGridInfo += (pExitGrid->ubGotoSectorY - 1) << 24;
  iExitGridInfo += pExitGrid->ubGotoSectorZ << 20;
  iExitGridInfo += pExitGrid->usGridNo & 0x0000ffff;
  return iExitGridInfo;
}

function ConvertINT32ToExitGrid(iExitGridInfo: INT32, pExitGrid: Pointer<EXITGRID>): void {
  // convert the int into 4 unsigned bytes.
  pExitGrid->ubGotoSectorX = (((iExitGridInfo & 0xf0000000) >> 28) + 1);
  pExitGrid->ubGotoSectorY = (((iExitGridInfo & 0x0f000000) >> 24) + 1);
  pExitGrid->ubGotoSectorZ = ((iExitGridInfo & 0x00f00000) >> 20);
  pExitGrid->usGridNo = (iExitGridInfo & 0x0000ffff);
}

function GetExitGrid(usMapIndex: UINT16, pExitGrid: Pointer<EXITGRID>): BOOLEAN {
  let pShadow: Pointer<LEVELNODE>;
  pShadow = gpWorldLevelData[usMapIndex].pShadowHead;
  // Search through object layer for an exitgrid
  while (pShadow) {
    if (pShadow->uiFlags & LEVELNODE_EXITGRID) {
      ConvertINT32ToExitGrid(pShadow->iExitGridInfo, pExitGrid);
      return TRUE;
    }
    pShadow = pShadow->pNext;
  }
  pExitGrid->ubGotoSectorX = 0;
  pExitGrid->ubGotoSectorY = 0;
  pExitGrid->ubGotoSectorZ = 0;
  pExitGrid->usGridNo = 0;
  return FALSE;
}

function ExitGridAtGridNo(usMapIndex: UINT16): BOOLEAN {
  let pShadow: Pointer<LEVELNODE>;
  pShadow = gpWorldLevelData[usMapIndex].pShadowHead;
  // Search through object layer for an exitgrid
  while (pShadow) {
    if (pShadow->uiFlags & LEVELNODE_EXITGRID) {
      return TRUE;
    }
    pShadow = pShadow->pNext;
  }
  return FALSE;
}

function GetExitGridLevelNode(usMapIndex: UINT16, ppLevelNode: Pointer<Pointer<LEVELNODE>>): BOOLEAN {
  let pShadow: Pointer<LEVELNODE>;
  pShadow = gpWorldLevelData[usMapIndex].pShadowHead;
  // Search through object layer for an exitgrid
  while (pShadow) {
    if (pShadow->uiFlags & LEVELNODE_EXITGRID) {
      *ppLevelNode = pShadow;
      return TRUE;
    }
    pShadow = pShadow->pNext;
  }
  return FALSE;
}

function AddExitGridToWorld(iMapIndex: INT32, pExitGrid: Pointer<EXITGRID>): void {
  let pShadow: Pointer<LEVELNODE>;
  let tail: Pointer<LEVELNODE>;
  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // Search through object layer for an exitgrid
  while (pShadow) {
    tail = pShadow;
    if (pShadow->uiFlags & LEVELNODE_EXITGRID) {
      // we have found an existing exitgrid in this node, so replace it with the new information.
      pShadow->iExitGridInfo = ConvertExitGridToINT32(pExitGrid);
      // SmoothExitGridRadius( (UINT16)iMapIndex, 0 );
      return;
    }
    pShadow = pShadow->pNext;
  }

  // Add levelnode
  AddShadowToHead(iMapIndex, MOCKFLOOR1);
  // Get new node
  pShadow = gpWorldLevelData[iMapIndex].pShadowHead;

  // fill in the information for the new exitgrid levelnode.
  pShadow->iExitGridInfo = ConvertExitGridToINT32(pExitGrid);
  pShadow->uiFlags |= (LEVELNODE_EXITGRID | LEVELNODE_HIDDEN);

  // Add the exit grid to the sector, only if we call ApplyMapChangesToMapTempFile() first.
  if (!gfEditMode && !gfLoadingExitGrids) {
    AddExitGridToMapTempFile(iMapIndex, pExitGrid, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
  }
}

function RemoveExitGridFromWorld(iMapIndex: INT32): void {
  let usDummy: UINT16;
  if (TypeExistsInShadowLayer(iMapIndex, MOCKFLOOR, &usDummy)) {
    RemoveAllShadowsOfTypeRange(iMapIndex, MOCKFLOOR, MOCKFLOOR);
  }
}

function SaveExitGrids(fp: HWFILE, usNumExitGrids: UINT16): void {
  let exitGrid: EXITGRID;
  let usNumSaved: UINT16 = 0;
  let x: UINT16;
  let uiBytesWritten: UINT32;
  FileWrite(fp, &usNumExitGrids, 2, &uiBytesWritten);
  for (x = 0; x < WORLD_MAX; x++) {
    if (GetExitGrid(x, &exitGrid)) {
      FileWrite(fp, &x, 2, &uiBytesWritten);
      FileWrite(fp, &exitGrid, 5, &uiBytesWritten);
      usNumSaved++;
    }
  }
  // If these numbers aren't equal, something is wrong!
  Assert(usNumExitGrids == usNumSaved);
}

function LoadExitGrids(hBuffer: Pointer<Pointer<INT8>>): void {
  let exitGrid: EXITGRID;
  let x: UINT16;
  let usNumSaved: UINT16;
  let usMapIndex: UINT16;
  gfLoadingExitGrids = TRUE;
  LOADDATA(&usNumSaved, *hBuffer, 2);
  // FileRead( hfile, &usNumSaved, 2, NULL);
  for (x = 0; x < usNumSaved; x++) {
    LOADDATA(&usMapIndex, *hBuffer, 2);
    // FileRead( hfile, &usMapIndex, 2, NULL);
    LOADDATA(&exitGrid, *hBuffer, 5);
    // FileRead( hfile, &exitGrid, 5, NULL);
    AddExitGridToWorld(usMapIndex, &exitGrid);
  }
  gfLoadingExitGrids = FALSE;
}

function AttemptToChangeFloorLevel(bRelativeZLevel: INT8): void {
  let ubLookForLevel: UINT8 = 0;
  let i: UINT16;
  if (bRelativeZLevel != 1 && bRelativeZLevel != -1)
    return;
  // Check if on ground level -- if so, can't go up!
  if (bRelativeZLevel == -1 && !gbWorldSectorZ) {
    ScreenMsg(FONT_DKYELLOW, MSG_INTERFACE, pMessageStrings[MSG_CANT_GO_UP], ubLookForLevel);
    return;
  }
  // Check if on bottom level -- if so, can't go down!
  if (bRelativeZLevel == 1 && gbWorldSectorZ == 3) {
    ScreenMsg(FONT_DKYELLOW, MSG_INTERFACE, pMessageStrings[MSG_CANT_GO_DOWN], ubLookForLevel);
    return;
  }
  ubLookForLevel = (gbWorldSectorZ + bRelativeZLevel);
  for (i = 0; i < WORLD_MAX; i++) {
    if (GetExitGrid(i, &gExitGrid)) {
      if (gExitGrid.ubGotoSectorZ == ubLookForLevel) {
        // found an exit grid leading to the goal sector!
        gfOverrideInsertionWithExitGrid = TRUE;
        // change all current mercs in the loaded sector, and move them
        // to the new sector.
        MoveAllGroupsInCurrentSectorToSector(gWorldSectorX, gWorldSectorY, ubLookForLevel);
        if (ubLookForLevel)
          ScreenMsg(FONT_YELLOW, MSG_INTERFACE, pMessageStrings[MSG_ENTERING_LEVEL], ubLookForLevel);
        else
          ScreenMsg(FONT_YELLOW, MSG_INTERFACE, pMessageStrings[MSG_LEAVING_BASEMENT]);

        SetCurrentWorldSector(gWorldSectorX, gWorldSectorY, ubLookForLevel);
        gfOverrideInsertionWithExitGrid = FALSE;
      }
    }
  }
}

function FindGridNoFromSweetSpotCloseToExitGrid(pSoldier: Pointer<SOLDIERTYPE>, sSweetGridNo: INT16, ubRadius: INT8, pubDirection: Pointer<UINT8>): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = 0;
  let leftmost: INT32;
  let fFound: BOOLEAN = FALSE;
  let soldier: SOLDIERTYPE;
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let ExitGrid: EXITGRID;
  let ubGotoSectorX: UINT8;
  let ubGotoSectorY: UINT8;
  let ubGotoSectorZ: UINT8;

  // Turn off at end of function...
  gfPlotPathToExitGrid = TRUE;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  memset(&soldier, 0, sizeof(SOLDIERTYPE));
  soldier.bLevel = 0;
  soldier.bTeam = 1;
  soldier.sGridNo = pSoldier->sGridNo;

  // OK, Get an exit grid ( if possible )
  if (!GetExitGrid(sSweetGridNo, &ExitGrid)) {
    return NOWHERE;
  }

  // Copy our dest values.....
  ubGotoSectorX = ExitGrid.ubGotoSectorX;
  ubGotoSectorY = ExitGrid.ubGotoSectorY;
  ubGotoSectorZ = ExitGrid.ubGotoSectorZ;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = pSoldier->sGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(&soldier, NOWHERE, 0, WALKING, COPYREACHABLE, PATH_THROUGH_PEOPLE);

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((pSoldier->sGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = pSoldier->sGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        // ATE: Added this check because for all intensive purposes, cavewalls will be not an OKDEST
        // but we want thenm too...
        if (NewOKDestination(pSoldier, sGridNo, TRUE, pSoldier->bLevel)) {
          if (GetExitGrid(sGridNo, &ExitGrid)) {
            // Is it the same exitgrid?
            if (ExitGrid.ubGotoSectorX == ubGotoSectorX && ExitGrid.ubGotoSectorY == ubGotoSectorY && ExitGrid.ubGotoSectorZ == ubGotoSectorZ) {
              uiRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier->sGridNo, sGridNo);

              if (uiRange < uiLowestRange) {
                sLowestGridNo = sGridNo;
                uiLowestRange = uiRange;
                fFound = TRUE;
              }
            }
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;

  gfPlotPathToExitGrid = FALSE;

  if (fFound) {
    // Set direction to center of map!
    *pubDirection = GetDirectionToGridNoFromGridNo(sLowestGridNo, (((WORLD_ROWS / 2) * WORLD_COLS) + (WORLD_COLS / 2)));
    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}

function FindClosestExitGrid(pSoldier: Pointer<SOLDIERTYPE>, sSrcGridNo: INT16, ubRadius: INT8): UINT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = 0;
  let leftmost: INT32;
  let fFound: BOOLEAN = FALSE;
  let ExitGrid: EXITGRID;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSrcGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSrcGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        if (GetExitGrid(sGridNo, &ExitGrid)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSrcGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            sLowestGridNo = sGridNo;
            uiLowestRange = uiRange;
            fFound = TRUE;
          }
        }
      }
    }
  }

  if (fFound) {
    return sLowestGridNo;
  } else {
    return NOWHERE;
  }
}
