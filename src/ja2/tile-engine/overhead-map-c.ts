// OK, these are values that are calculated in InitRenderParams( ) with normal view settings.
// These would be different if we change ANYTHING about the game worlkd map sizes...
const NORMAL_MAP_SCREEN_WIDTH = 3160;
const NORMAL_MAP_SCREEN_HEIGHT = 1540;
const NORMAL_MAP_SCREEN_X = 1580;
const NORMAL_MAP_SCREEN_BY = 2400;
const NORMAL_MAP_SCREEN_TY = 860;

const FASTMAPROWCOLTOPOS = (r, c) => ((r) * WORLD_COLS + (c));

interface SMALL_TILE_SURF {
  vo: HVOBJECT;
  fType: UINT32;
}

interface SMALL_TILE_DB {
  vo: HVOBJECT;
  usSubIndex: UINT16;
  fType: UINT32;
}

let gSmTileSurf: SMALL_TILE_SURF[] /* [NUMBEROFTILETYPES] */;
let gSmTileDB: SMALL_TILE_DB[] /* [NUMBEROFTILES] */;
let gubSmTileNum: UINT8 = 0;
let gfSmTileLoaded: BOOLEAN = FALSE;
let gfInOverheadMap: BOOLEAN = FALSE;
let OverheadRegion: MOUSE_REGION;
let OverheadBackgroundRegion: MOUSE_REGION;
let uiOVERMAP: UINT32;
let uiPERSONS: UINT32;
let gfOverheadMapDirty: BOOLEAN = FALSE;
let gsStartRestrictedX: INT16;
let gsStartRestrictedY: INT16;
let gfOverItemPool: BOOLEAN = FALSE;
let gsOveritemPoolGridNo: INT16;

function InitNewOverheadDB(ubTilesetID: UINT8): void {
  let uiLoop: UINT32;
  let VObjectDesc: VOBJECT_DESC;
  let hVObject: HVOBJECT;
  let cFileBPP: CHAR8[] /* [128] */;
  let cAdjustedFile: CHAR8[] /* [128] */;
  let cnt1: UINT32;
  let cnt2: UINT32;
  let s: SMALL_TILE_SURF;
  let NumRegions: UINT32;
  let dbSize: UINT32 = 0;

  for (uiLoop = 0; uiLoop < NUMBEROFTILETYPES; uiLoop++) {
    // Create video object

    // Adjust for BPP
    FilenameForBPP(gTilesets[ubTilesetID].TileSurfaceFilenames[uiLoop], cFileBPP);

    // Adjust for tileset position
    sprintf(cAdjustedFile, "TILESETS\\%d\\T\\%s", ubTilesetID, cFileBPP);

    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    strcpy(VObjectDesc.ImageFile, cAdjustedFile);
    hVObject = CreateVideoObject(&VObjectDesc);

    if (hVObject == NULL) {
      // TRY loading from default directory
      FilenameForBPP(gTilesets[GENERIC_1].TileSurfaceFilenames[uiLoop], cFileBPP);
      // Adjust for tileset position
      sprintf(cAdjustedFile, "TILESETS\\0\\T\\%s", cFileBPP);

      // LOAD ONE WE KNOW ABOUT!
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      strcpy(VObjectDesc.ImageFile, cAdjustedFile);
      hVObject = CreateVideoObject(&VObjectDesc);

      if (hVObject == NULL) {
        // LOAD ONE WE KNOW ABOUT!
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        strcpy(VObjectDesc.ImageFile, "TILESETS\\0\\T\\grass.sti");
        hVObject = CreateVideoObject(&VObjectDesc);
      }
    }

    gSmTileSurf[uiLoop].vo = hVObject;
    gSmTileSurf[uiLoop].fType = uiLoop;
  }

  // NOW LOOP THROUGH AND CREATE DATABASE
  for (cnt1 = 0; cnt1 < NUMBEROFTILETYPES; cnt1++) {
    // Get number of regions
    s = gSmTileSurf[cnt1];

    NumRegions = s.vo->usNumberOfObjects;

    // Check for overflow
    if (NumRegions > gNumTilesPerType[cnt1]) {
      // Cutof
      NumRegions = gNumTilesPerType[cnt1];
    }

    for (cnt2 = 0; cnt2 < NumRegions; cnt2++) {
      gSmTileDB[dbSize].vo = s.vo;
      gSmTileDB[dbSize].usSubIndex = cnt2;
      gSmTileDB[dbSize].fType = cnt1;

      dbSize++;
    }

    // Check if data matches what should be there
    if (NumRegions < gNumTilesPerType[cnt1]) {
      // Do underflows here
      for (cnt2 = NumRegions; cnt2 < gNumTilesPerType[cnt1]; cnt2++) {
        gSmTileDB[dbSize].vo = s.vo;
        gSmTileDB[dbSize].usSubIndex = 0;
        gSmTileDB[dbSize].fType = cnt1;
        dbSize++;
      }
    }
  }

  gsStartRestrictedX = 0;
  gsStartRestrictedY = 0;

  // Calculate Scale factors because of restricted map scroll regions
  if (gMapInformation.ubRestrictedScrollID != 0) {
    let sX1: INT16;
    let sY1: INT16;
    let sX2: INT16;
    let sY2: INT16;

    CalculateRestrictedMapCoords(NORTH, &sX1, &sY1, &sX2, &gsStartRestrictedY, 640, 320);
    CalculateRestrictedMapCoords(WEST, &sX1, &sY1, &gsStartRestrictedX, &sY2, 640, 320);
  }

  // Copy over shade tables from main tileset
  CopyOverheadDBShadetablesFromTileset();
}

function DeleteOverheadDB(): void {
  let cnt: INT32;

  for (cnt = 0; cnt < NUMBEROFTILETYPES; cnt++) {
    DeleteVideoObject(gSmTileSurf[cnt].vo);
  }
}

function GetClosestItemPool(sSweetGridNo: INT16, ppReturnedItemPool: Pointer<Pointer<ITEM_POOL>>, ubRadius: UINT8, bLevel: INT8): BOOLEAN {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let leftmost: INT32;
  let fFound: BOOLEAN = FALSE;
  let pItemPool: Pointer<ITEM_POOL>;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        // Go on sweet stop
        if (GetItemPool(sGridNo, &pItemPool, bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            (*ppReturnedItemPool) = pItemPool;
            uiLowestRange = uiRange;
            fFound = TRUE;
          }
        }
      }
    }
  }

  return fFound;
}

function GetClosestMercInOverheadMap(sSweetGridNo: INT16, ppReturnedSoldier: Pointer<Pointer<SOLDIERTYPE>>, ubRadius: UINT8): BOOLEAN {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let leftmost: INT32;
  let fFound: BOOLEAN = FALSE;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS)) {
        // Go on sweet stop
        if (gpWorldLevelData[sGridNo].pMercHead != NULL && gpWorldLevelData[sGridNo].pMercHead->pSoldier->bVisible != -1) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            (*ppReturnedSoldier) = gpWorldLevelData[sGridNo].pMercHead->pSoldier;
            uiLowestRange = uiRange;
            fFound = TRUE;
          }
        }
      }
    }
  }

  return fFound;
}

function DisplayMercNameInOverhead(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sWorldScreenX: INT16;
  let sX: INT16;
  let sWorldScreenY: INT16;
  let sY: INT16;

  // Get Screen position of guy.....
  GetWorldXYAbsoluteScreenXY((pSoldier->sX / CELL_X_SIZE), (pSoldier->sY / CELL_Y_SIZE), &sWorldScreenX, &sWorldScreenY);

  sWorldScreenX = gsStartRestrictedX + (sWorldScreenX / 5) + 5;
  sWorldScreenY = gsStartRestrictedY + (sWorldScreenY / 5) + (pSoldier->sHeightAdjustment / 5) + (gpWorldLevelData[pSoldier->sGridNo].sHeight / 5) - 8;

  sWorldScreenY += (gsRenderHeight / 5);

  // Display name
  SetFont(TINYFONT1);
  SetFontBackground(FONT_MCOLOR_BLACK);
  SetFontForeground(FONT_MCOLOR_WHITE);

  // Center here....
  FindFontCenterCoordinates(sWorldScreenX, sWorldScreenY, (1), 1, pSoldier->name, TINYFONT1, &sX, &sY);

  // OK, selected guy is here...
  gprintfdirty(sX, sY, pSoldier->name);
  mprintf(sX, sY, pSoldier->name);
}

function HandleOverheadMap(): void {
  /* static */ let fFirst: BOOLEAN = TRUE;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (fFirst) {
    fFirst = FALSE;
  }

  gfInOverheadMap = TRUE;
  gfOverItemPool = FALSE;

  // Check tileset numbers
  if (gubSmTileNum != giCurrentTilesetID) {
    // If loaded, unload!
    if (gfSmTileLoaded) {
      // Unload
      DeleteOverheadDB();

      // Force load
      gfSmTileLoaded = FALSE;
    }
  }

  gubSmTileNum = giCurrentTilesetID;

  if (gfSmTileLoaded == FALSE) {
    // LOAD LAND
    InitNewOverheadDB(gubSmTileNum);
    gfSmTileLoaded = TRUE;
  }

  // restore background rects
  RestoreBackgroundRects();

  // RENDER!!!!!!!!
  RenderOverheadMap(0, (WORLD_COLS / 2), 0, 0, 640, 320, FALSE);

  HandleTalkingAutoFaces();

  if (!gfEditMode) {
    // CHECK FOR UI
    if (gfTacticalPlacementGUIActive) {
      TacticalPlacementHandle();
      if (!gfTacticalPlacementGUIActive) {
        return;
      }
    } else {
      HandleOverheadUI();

      if (!gfInOverheadMap) {
        return;
      }
      RenderTacticalInterface();
      RenderRadarScreen();
      RenderClock(CLOCK_X, CLOCK_Y);
      RenderTownIDString();

      HandleAutoFaces();
    }
  }

  if (!gfEditMode && !gfTacticalPlacementGUIActive) {
    let usMapPos: INT16;
    let pItemPool: Pointer<ITEM_POOL>;

    gfUIHandleSelectionAboveGuy = FALSE;

    HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), NULL, TRUE);

    if (GetOverheadMouseGridNo(&usMapPos)) {
      // ATE: Find the closest item pool within 5 tiles....
      if (GetClosestItemPool(usMapPos, &pItemPool, 1, 0)) {
        let pStructure: Pointer<STRUCTURE> = NULL;
        let sIntTileGridNo: INT16;
        let bZLevel: INT8 = 0;
        let sActionGridNo: INT16 = usMapPos;

        // Get interactive tile...
        if (ConditionalGetCurInteractiveTileGridNoAndStructure(&sIntTileGridNo, &pStructure, FALSE)) {
          sActionGridNo = sIntTileGridNo;
        }

        bZLevel = GetZLevelOfItemPoolGivenStructure(sActionGridNo, 0, pStructure);

        if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
          DrawItemPoolList(pItemPool, usMapPos, ITEMLIST_DISPLAY, bZLevel, gusMouseXPos, gusMouseYPos);

          gfOverItemPool = TRUE;
          gsOveritemPoolGridNo = pItemPool->sGridNo;
        }
      }

      if (GetClosestItemPool(usMapPos, &pItemPool, 1, 1)) {
        let bZLevel: INT8 = 0;
        let sActionGridNo: INT16 = usMapPos;

        if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
          DrawItemPoolList(pItemPool, usMapPos, ITEMLIST_DISPLAY, bZLevel, gusMouseXPos, (gusMouseYPos - 5));

          gfOverItemPool = TRUE;
          gsOveritemPoolGridNo = pItemPool->sGridNo;
        }
      }
    }

    if (GetOverheadMouseGridNoForFullSoldiersGridNo(&usMapPos)) {
      if (GetClosestMercInOverheadMap(usMapPos, &pSoldier, 1)) {
        if (pSoldier->bTeam == gbPlayerNum) {
          gfUIHandleSelectionAboveGuy = TRUE;
          gsSelectedGuy = pSoldier->ubID;
        }

        DisplayMercNameInOverhead(pSoldier);
      }
    }
  }

  RenderOverheadOverlays();
  if (!gfEditMode && !gfTacticalPlacementGUIActive && gusSelectedSoldier != NOBODY) {
    pSoldier = MercPtrs[gusSelectedSoldier];

    DisplayMercNameInOverhead(pSoldier);
  }

  RenderButtons();
  StartFrameBufferRender();

  // save background rects
  SaveBackgroundRects();

  RenderButtonsFastHelp();

  ExecuteBaseDirtyRectQueue();
  EndFrameBufferRender();

  fInterfacePanelDirty = FALSE;
}

function InOverheadMap(): BOOLEAN {
  return gfInOverheadMap;
}

function GoIntoOverheadMap(): void {
  let VObjectDesc: VOBJECT_DESC;
  let hVObject: HVOBJECT;

  gfInOverheadMap = TRUE;

  MSYS_DefineRegion(&OverheadBackgroundRegion, 0, 0, 640, 360, MSYS_PRIORITY_HIGH, CURSOR_NORMAL, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  // Add region
  MSYS_AddRegion(&OverheadBackgroundRegion);

  MSYS_DefineRegion(&OverheadRegion, 0, 0, gsVIEWPORT_END_X, 320, MSYS_PRIORITY_HIGH, CURSOR_NORMAL, MoveOverheadRegionCallback, ClickOverheadRegionCallback);
  // Add region
  MSYS_AddRegion(&OverheadRegion);

  // LOAD CLOSE ANIM
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\MAP_BORD.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(&VObjectDesc, &uiOVERMAP))
    AssertMsg(0, "Missing INTERFACE\\MAP_BORD.sti");

  // LOAD PERSONS
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\PERSONS.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(&VObjectDesc, &uiPERSONS))
    AssertMsg(0, "Missing INTERFACE\\PERSONS.sti");

  // Add shades to persons....
  GetVideoObject(&hVObject, uiPERSONS);
  hVObject->pShades[0] = Create16BPPPaletteShaded(hVObject->pPaletteEntry, 256, 256, 256, FALSE);
  hVObject->pShades[1] = Create16BPPPaletteShaded(hVObject->pPaletteEntry, 310, 310, 310, FALSE);
  hVObject->pShades[2] = Create16BPPPaletteShaded(hVObject->pPaletteEntry, 0, 0, 0, FALSE);

  gfOverheadMapDirty = TRUE;

  if (!gfEditMode) {
    // Make sure we are in team panel mode...
    gfSwitchPanel = TRUE;
    gbNewPanel = TEAM_PANEL;
    gubNewPanelParam = gusSelectedSoldier;
    fInterfacePanelDirty = DIRTYLEVEL2;

    // Disable tactical buttons......
    if (!gfEnterTacticalPlacementGUI) {
      // Handle switch of panel....
      HandleTacticalPanelSwitch();
      DisableTacticalTeamPanelButtons(TRUE);
    }

    EmptyBackgroundRects();
  }
}

function HandleOverheadUI(): void {
  let InputEvent: InputAtom;
  let sMousePos: INT16 = 0;
  let ubID: UINT8;

  // CHECK FOR MOUSE OVER REGIONS...
  if (GetOverheadMouseGridNo(&sMousePos)) {
    // Look quickly for a soldier....
    ubID = QuickFindSoldier(sMousePos);

    if (ubID != NOBODY) {
      // OK, selected guy is here...
      // gprintfdirty( gusMouseXPos, gusMouseYPos, MercPtrs[ ubID ]->name );
      // mprintf( gusMouseXPos, gusMouseYPos, MercPtrs[ ubID ]->name );
    }
  }

  while (DequeueEvent(&InputEvent) == TRUE) {
    if ((InputEvent.usEvent == KEY_DOWN)) {
      switch (InputEvent.usParam) {
        case (ESC):
        case (INSERT):

          KillOverheadMap();
          break;

        case ('x'):
          if ((InputEvent.usKeyState & ALT_DOWN)) {
            HandleShortCutExitState();
          }
          break;
      }
    }
  }
}

function KillOverheadMap(): void {
  gfInOverheadMap = FALSE;
  SetRenderFlags(RENDER_FLAG_FULL);
  RenderWorld();

  MSYS_RemoveRegion(&OverheadRegion);
  MSYS_RemoveRegion(&OverheadBackgroundRegion);

  DeleteVideoObjectFromIndex(uiOVERMAP);
  DeleteVideoObjectFromIndex(uiPERSONS);

  HandleTacticalPanelSwitch();
  DisableTacticalTeamPanelButtons(FALSE);
}

function GetOffsetLandHeight(sGridNo: INT32): INT16 {
  let sTileHeight: INT16;

  sTileHeight = gpWorldLevelData[sGridNo].sHeight;

  return sTileHeight;
}

function GetModifiedOffsetLandHeight(sGridNo: INT32): INT16 {
  let sTileHeight: INT16;
  let sModifiedTileHeight: INT16;

  sTileHeight = gpWorldLevelData[sGridNo].sHeight;

  sModifiedTileHeight = (((sTileHeight / 80) - 1) * 80);

  if (sModifiedTileHeight < 0) {
    sModifiedTileHeight = 0;
  }

  return sModifiedTileHeight;
}

function RenderOverheadMap(sStartPointX_M: INT16, sStartPointY_M: INT16, sStartPointX_S: INT16, sStartPointY_S: INT16, sEndXS: INT16, sEndYS: INT16, fFromMapUtility: BOOLEAN): void {
  let bXOddFlag: INT8 = 0;
  let sModifiedHeight: INT16 = 0;
  let sAnchorPosX_M: INT16;
  let sAnchorPosY_M: INT16;
  let sAnchorPosX_S: INT16;
  let sAnchorPosY_S: INT16;
  let sTempPosX_M: INT16;
  let sTempPosY_M: INT16;
  let sTempPosX_S: INT16;
  let sTempPosY_S: INT16;
  let fEndRenderRow: BOOLEAN = FALSE;
  let fEndRenderCol: BOOLEAN = FALSE;
  let usTileIndex: UINT32;
  let sX: INT16;
  let sY: INT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let pNode: Pointer<LEVELNODE>;
  let pTile: Pointer<SMALL_TILE_DB>;
  let sHeight: INT16;
  let hVObject: HVOBJECT;
  let sX1: INT16;
  let sX2: INT16;
  let sY1: INT16;
  let sY2: INT16;

  // Get video object for persons...
  if (!fFromMapUtility) {
    GetVideoObject(&hVObject, uiPERSONS);
  }

  if (gfOverheadMapDirty) {
    // Black out.......
    ColorFillVideoSurfaceArea(FRAME_BUFFER, sStartPointX_S, sStartPointY_S, sEndXS, sEndYS, 0);

    InvalidateScreen();
    gfOverheadMapDirty = FALSE;

    // Begin Render Loop
    sAnchorPosX_M = sStartPointX_M;
    sAnchorPosY_M = sStartPointY_M;
    sAnchorPosX_S = sStartPointX_S;
    sAnchorPosY_S = sStartPointY_S;

    // Zero out area!
    // ColorFillVideoSurfaceArea( FRAME_BUFFER, 0, 0, (INT16)(640), (INT16)(gsVIEWPORT_WINDOW_END_Y), Get16BPPColor( FROMRGB( 0, 0, 0 ) ) );

    pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);

    do {
      fEndRenderRow = FALSE;
      sTempPosX_M = sAnchorPosX_M;
      sTempPosY_M = sAnchorPosY_M;
      sTempPosX_S = sAnchorPosX_S;
      sTempPosY_S = sAnchorPosY_S;

      if (bXOddFlag > 0)
        sTempPosX_S += 4;

      do {
        usTileIndex = FASTMAPROWCOLTOPOS(sTempPosY_M, sTempPosX_M);

        if (usTileIndex < GRIDSIZE) {
          sHeight = (GetOffsetLandHeight(usTileIndex) / 5);

          pNode = gpWorldLevelData[usTileIndex].pLandStart;
          while (pNode != NULL) {
            pTile = &(gSmTileDB[pNode->usIndex]);

            sX = sTempPosX_S;
            sY = sTempPosY_S - sHeight + (gsRenderHeight / 5);

            pTile->vo->pShadeCurrent = gSmTileSurf[pTile->fType].vo->pShades[pNode->ubShadeLevel];

            // RENDER!
            // BltVideoObjectFromIndex(  FRAME_BUFFER, SGR1, gSmallTileDatabase[ gpWorldLevelData[ usTileIndex ].pLandHead->usIndex ], sX, sY, VO_BLT_SRCTRANSPARENCY, NULL );
            // BltVideoObjectFromIndex(  FRAME_BUFFER, SGR1, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, NULL );
            Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, pTile->vo, sX, sY, pTile->usSubIndex);

            pNode = pNode->pPrevNode;
          }
        }

        sTempPosX_S += 8;
        sTempPosX_M++;
        sTempPosY_M--;

        if (sTempPosX_S >= sEndXS) {
          fEndRenderRow = TRUE;
        }
      } while (!fEndRenderRow);

      if (bXOddFlag > 0) {
        sAnchorPosY_M++;
      } else {
        sAnchorPosX_M++;
      }

      bXOddFlag = !bXOddFlag;
      sAnchorPosY_S += 2;

      if (sAnchorPosY_S >= sEndYS) {
        fEndRenderCol = TRUE;
      }
    } while (!fEndRenderCol);

    // Begin Render Loop
    sAnchorPosX_M = sStartPointX_M;
    sAnchorPosY_M = sStartPointY_M;
    sAnchorPosX_S = sStartPointX_S;
    sAnchorPosY_S = sStartPointY_S;
    bXOddFlag = 0;
    fEndRenderRow = FALSE;
    fEndRenderCol = FALSE;

    do {
      fEndRenderRow = FALSE;
      sTempPosX_M = sAnchorPosX_M;
      sTempPosY_M = sAnchorPosY_M;
      sTempPosX_S = sAnchorPosX_S;
      sTempPosY_S = sAnchorPosY_S;

      if (bXOddFlag > 0)
        sTempPosX_S += 4;

      do {
        usTileIndex = FASTMAPROWCOLTOPOS(sTempPosY_M, sTempPosX_M);

        if (usTileIndex < GRIDSIZE) {
          sHeight = (GetOffsetLandHeight(usTileIndex) / 5);
          sModifiedHeight = (GetModifiedOffsetLandHeight(usTileIndex) / 5);

          pNode = gpWorldLevelData[usTileIndex].pObjectHead;
          while (pNode != NULL) {
            if (pNode->usIndex < NUMBEROFTILES) {
              // Don't render itempools!
              if (!(pNode->uiFlags & LEVELNODE_ITEM)) {
                pTile = &(gSmTileDB[pNode->usIndex]);

                sX = sTempPosX_S;
                sY = sTempPosY_S;

                if (gTileDatabase[pNode->usIndex].uiFlags & IGNORE_WORLD_HEIGHT) {
                  sY -= sModifiedHeight;
                } else {
                  sY -= sHeight;
                }

                sY += (gsRenderHeight / 5);

                pTile->vo->pShadeCurrent = gSmTileSurf[pTile->fType].vo->pShades[pNode->ubShadeLevel];

                // RENDER!
                Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, pTile->vo, sX, sY, pTile->usSubIndex);
              }
            }

            pNode = pNode->pNext;
          }

          pNode = gpWorldLevelData[usTileIndex].pShadowHead;
          while (pNode != NULL) {
            if (pNode->usIndex < NUMBEROFTILES) {
              pTile = &(gSmTileDB[pNode->usIndex]);
              sX = sTempPosX_S;
              sY = sTempPosY_S - sHeight;

              sY += (gsRenderHeight / 5);

              pTile->vo->pShadeCurrent = gSmTileSurf[pTile->fType].vo->pShades[pNode->ubShadeLevel];

              // RENDER!
              Blt8BPPDataTo16BPPBufferShadow(pDestBuf, uiDestPitchBYTES, pTile->vo, sX, sY, pTile->usSubIndex);
            }

            pNode = pNode->pNext;
          }

          pNode = gpWorldLevelData[usTileIndex].pStructHead;

          while (pNode != NULL) {
            if (pNode->usIndex < NUMBEROFTILES) {
              // Don't render itempools!
              if (!(pNode->uiFlags & LEVELNODE_ITEM)) {
                pTile = &(gSmTileDB[pNode->usIndex]);

                sX = sTempPosX_S;
                sY = sTempPosY_S - (gTileDatabase[pNode->usIndex].sOffsetHeight / 5);

                if (gTileDatabase[pNode->usIndex].uiFlags & IGNORE_WORLD_HEIGHT) {
                  sY -= sModifiedHeight;
                } else {
                  sY -= sHeight;
                }

                sY += (gsRenderHeight / 5);

                pTile->vo->pShadeCurrent = gSmTileSurf[pTile->fType].vo->pShades[pNode->ubShadeLevel];

                // RENDER!
                Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, pTile->vo, sX, sY, pTile->usSubIndex);
              }
            }

            pNode = pNode->pNext;
          }
        }

        sTempPosX_S += 8;
        sTempPosX_M++;
        sTempPosY_M--;

        if (sTempPosX_S >= sEndXS) {
          fEndRenderRow = TRUE;
        }
      } while (!fEndRenderRow);

      if (bXOddFlag > 0) {
        sAnchorPosY_M++;
      } else {
        sAnchorPosX_M++;
      }

      bXOddFlag = !bXOddFlag;
      sAnchorPosY_S += 2;

      if (sAnchorPosY_S >= sEndYS) {
        fEndRenderCol = TRUE;
      }
    } while (!fEndRenderCol);

    // if ( !fFromMapUtility && !gfEditMode )
    {
      // ROOF RENDR LOOP
      // Begin Render Loop
      sAnchorPosX_M = sStartPointX_M;
      sAnchorPosY_M = sStartPointY_M;
      sAnchorPosX_S = sStartPointX_S;
      sAnchorPosY_S = sStartPointY_S;
      bXOddFlag = 0;
      fEndRenderRow = FALSE;
      fEndRenderCol = FALSE;

      do {
        fEndRenderRow = FALSE;
        sTempPosX_M = sAnchorPosX_M;
        sTempPosY_M = sAnchorPosY_M;
        sTempPosX_S = sAnchorPosX_S;
        sTempPosY_S = sAnchorPosY_S;

        if (bXOddFlag > 0)
          sTempPosX_S += 4;

        do {
          usTileIndex = FASTMAPROWCOLTOPOS(sTempPosY_M, sTempPosX_M);

          if (usTileIndex < GRIDSIZE) {
            sHeight = (GetOffsetLandHeight(usTileIndex) / 5);

            pNode = gpWorldLevelData[usTileIndex].pRoofHead;
            while (pNode != NULL) {
              if (pNode->usIndex < NUMBEROFTILES) {
                if (!(pNode->uiFlags & LEVELNODE_HIDDEN)) {
                  pTile = &(gSmTileDB[pNode->usIndex]);

                  sX = sTempPosX_S;
                  sY = sTempPosY_S - (gTileDatabase[pNode->usIndex].sOffsetHeight / 5) - sHeight;

                  sY -= (WALL_HEIGHT / 5);

                  sY += (gsRenderHeight / 5);

                  pTile->vo->pShadeCurrent = gSmTileSurf[pTile->fType].vo->pShades[pNode->ubShadeLevel];

                  // RENDER!
                  Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, pTile->vo, sX, sY, pTile->usSubIndex);
                }
              }
              pNode = pNode->pNext;
            }
          }

          sTempPosX_S += 8;
          sTempPosX_M++;
          sTempPosY_M--;

          if (sTempPosX_S >= sEndXS) {
            fEndRenderRow = TRUE;
          }
        } while (!fEndRenderRow);

        if (bXOddFlag > 0) {
          sAnchorPosY_M++;
        } else {
          sAnchorPosX_M++;
        }

        bXOddFlag = !bXOddFlag;
        sAnchorPosY_S += 2;

        if (sAnchorPosY_S >= sEndYS) {
          fEndRenderCol = TRUE;
        }
      } while (!fEndRenderCol);
    }

    UnLockVideoSurface(FRAME_BUFFER);

    // OK, blacken out edges of smaller maps...
    if (gMapInformation.ubRestrictedScrollID != 0) {
      CalculateRestrictedMapCoords(NORTH, &sX1, &sY1, &sX2, &sY2, sEndXS, sEndYS);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, sX1, sY1, sX2, sY2, Get16BPPColor(FROMRGB(0, 0, 0)));

      CalculateRestrictedMapCoords(WEST, &sX1, &sY1, &sX2, &sY2, sEndXS, sEndYS);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, sX1, sY1, sX2, sY2, Get16BPPColor(FROMRGB(0, 0, 0)));

      CalculateRestrictedMapCoords(SOUTH, &sX1, &sY1, &sX2, &sY2, sEndXS, sEndYS);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, sX1, sY1, sX2, sY2, Get16BPPColor(FROMRGB(0, 0, 0)));

      CalculateRestrictedMapCoords(EAST, &sX1, &sY1, &sX2, &sY2, sEndXS, sEndYS);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, sX1, sY1, sX2, sY2, Get16BPPColor(FROMRGB(0, 0, 0)));
    }

    if (!fFromMapUtility) {
      // Render border!
      BltVideoObjectFromIndex(FRAME_BUFFER, uiOVERMAP, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, NULL);
    }

    // Update the save buffer
    {
      let uiDestPitchBYTES: UINT32;
      let uiSrcPitchBYTES: UINT32;
      let pDestBuf: Pointer<UINT8>;
      let pSrcBuf: Pointer<UINT8>;
      let usWidth: UINT16;
      let usHeight: UINT16;
      let ubBitDepth: UINT8;

      // Update saved buffer - do for the viewport size ony!
      GetCurrentVideoSettings(&usWidth, &usHeight, &ubBitDepth);

      pSrcBuf = LockVideoSurface(guiRENDERBUFFER, &uiSrcPitchBYTES);
      pDestBuf = LockVideoSurface(guiSAVEBUFFER, &uiDestPitchBYTES);

      if (gbPixelDepth == 16) {
        // BLIT HERE
        Blt16BPPTo16BPP(pDestBuf, uiDestPitchBYTES, pSrcBuf, uiSrcPitchBYTES, 0, 0, 0, 0, usWidth, usHeight);
      }

      UnLockVideoSurface(guiRENDERBUFFER);
      UnLockVideoSurface(guiSAVEBUFFER);
    }
  }
}

function RenderOverheadOverlays(): void {
  let uiDestPitchBYTES: UINT32;
  let pWorldItem: Pointer<WORLDITEM>;
  let i: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let hVObject: HVOBJECT;
  let sX: INT16;
  let sY: INT16;
  let end: UINT16;
  let usLineColor: UINT16 = 0;
  let pDestBuf: Pointer<UINT8>;
  let ubPassengers: UINT8 = 0;

  pDestBuf = LockVideoSurface(FRAME_BUFFER, &uiDestPitchBYTES);
  GetVideoObject(&hVObject, uiPERSONS);

  // SOLDIER OVERLAY
  if (gfTacticalPlacementGUIActive) {
    // loop through only the player soldiers
    end = gTacticalStatus.Team[OUR_TEAM].bLastID;
  } else {
    // loop through all soldiers.
    end = MAX_NUM_SOLDIERS;
  }
  for (i = 0; i < end; i++) {
    // First, check to see if the soldier exists and is in the sector.
    pSoldier = MercPtrs[i];
    if (!pSoldier->bActive || !pSoldier->bInSector)
      continue;
    // Soldier is here.  Calculate his screen position based on his current gridno.
    GetOverheadScreenXYFromGridNo(pSoldier->sGridNo, &sX, &sY);
    // Now, draw his "doll"

    // adjust for position.
    sX += 2;
    sY -= 5;
    // sScreenY -= 7;	//height of doll

    if (!gfTacticalPlacementGUIActive && pSoldier->bLastRenderVisibleValue == -1 && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
      continue;
    }

    if (pSoldier->sGridNo == NOWHERE) {
      continue;
    }

    sY -= (GetOffsetLandHeight(pSoldier->sGridNo) / 5);

    // Adjust for height...
    sY -= (pSoldier->sHeightAdjustment / 5);

    sY += (gsRenderHeight / 5);

    // Adjust shade a bit...
    SetObjectShade(hVObject, 0);

    // If on roof....
    if (pSoldier->sHeightAdjustment) {
      SetObjectShade(hVObject, 1);
    }

    if (pSoldier->ubID == gusSelectedSoldier) {
      if (gfRadarCurrentGuyFlash && !gfTacticalPlacementGUIActive) {
        SetObjectShade(hVObject, 2);
      }
    }
    if (gfEditMode && gpSelected && gpSelected->pSoldier == pSoldier) {
      // editor:  show the selected edited merc as the yellow one.
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 0);
    } else
        if (!gfTacticalPlacementGUIActive) {
          // normal
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, pSoldier->bTeam);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, sX, sY, (sX + 3), (sY + 9));
    } else if (pSoldier->uiStatusFlags & SOLDIER_VEHICLE) {
      // vehicle
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 9);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, (sX - 6), (sY), (sX + 9), (sY + 10));
    }
    // else if( pSoldier->uiStatusFlags & (SOLDIER_PASSENGER | SOLDIER_DRIVER) )
    //{// //don't draw person, because they are inside the vehicle.
    //	ubPassengers++;
    //}
    else if (gpTacticalPlacementSelectedSoldier == pSoldier) {
      // tactical placement selected merc
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 7);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, (sX - 2), (sY - 2), (sX + 5), (sY + 11));
    } else if (gpTacticalPlacementHilightedSoldier == pSoldier && pSoldier->uiStatusFlags) {
      // tactical placement hilighted merc
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 8);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, (sX - 2), (sY - 2), (sX + 5), (sY + 11));
    } else {
      // normal
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, pSoldier->bTeam);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, sX, sY, (sX + 3), (sY + 9));
    }
    if (ubPassengers) {
      SetFont(SMALLCOMPFONT);
      SetFontForeground(FONT_WHITE);
      gprintfdirty((sX - 3), sY, "%d", ubPassengers);
      mprintf_buffer(pDestBuf, uiDestPitchBYTES, SMALLCOMPFONT, sX - 3, sY, "%d", ubPassengers);
    }
  }

  // ITEMS OVERLAY
  if (!gfTacticalPlacementGUIActive) {
    for (i = 0; i < guiNumWorldItems; i++) {
      pWorldItem = &gWorldItems[i];
      if (!pWorldItem || !pWorldItem->fExists || pWorldItem->bVisible != VISIBLE && !(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
        continue;
      }

      GetOverheadScreenXYFromGridNo(pWorldItem->sGridNo, &sX, &sY);

      // adjust for position.
      // sX += 2;
      sY += 6;
      sY -= (GetOffsetLandHeight(pWorldItem->sGridNo) / 5);

      sY += (gsRenderHeight / 5);

      if (gfRadarCurrentGuyFlash) {
        usLineColor = Get16BPPColor(FROMRGB(0, 0, 0));
      } else
        switch (pWorldItem->bVisible) {
          case HIDDEN_ITEM:
            usLineColor = Get16BPPColor(FROMRGB(0, 0, 255));
            break;
          case BURIED:
            usLineColor = Get16BPPColor(FROMRGB(255, 0, 0));
            break;
          case HIDDEN_IN_OBJECT:
            usLineColor = Get16BPPColor(FROMRGB(0, 0, 255));
            break;
          case INVISIBLE:
            usLineColor = Get16BPPColor(FROMRGB(0, 255, 0));
            break;
          case VISIBLE:
            usLineColor = Get16BPPColor(FROMRGB(255, 255, 255));
            break;
        }

      if (gfOverItemPool && gsOveritemPoolGridNo == pWorldItem->sGridNo) {
        usLineColor = Get16BPPColor(FROMRGB(255, 0, 0));
      }

      PixelDraw(FALSE, sX, sY, usLineColor, pDestBuf);

      InvalidateRegion(sX, sY, (sX + 1), (sY + 1));
    }
  }

  UnLockVideoSurface(FRAME_BUFFER);
}

/*//Render the soldiers and items on top of the pristine overhead map.
void RenderOverheadOverlays( INT16 sStartPointX_M, INT16 sStartPointY_M, INT16 sStartPointX_S, INT16 sStartPointY_S, INT16 sEndXS, INT16 sEndYS )
{
        INT8				bXOddFlag = 0;
        INT16				sAnchorPosX_M, sAnchorPosY_M;
        INT16				sAnchorPosX_S, sAnchorPosY_S;
        INT16				sTempPosX_M, sTempPosY_M;
        INT16				sTempPosX_S, sTempPosY_S;
        BOOLEAN			fEndRenderRow = FALSE, fEndRenderCol = FALSE;
        UINT32			usTileIndex;
        INT16				sX, sY;
        UINT32			uiDestPitchBYTES;
        UINT8				*pDestBuf;
        LEVELNODE		*pNode;
        UINT16			usLineColor;
        INT16				sHeight;
        SOLDIERTYPE	*pSoldier;
        HVOBJECT hVObject;
        pDestBuf = LockVideoSurface( FRAME_BUFFER, &uiDestPitchBYTES );
        // Begin Render Loop
        sAnchorPosX_M = sStartPointX_M;
        sAnchorPosY_M = sStartPointY_M;
        sAnchorPosX_S = sStartPointX_S;
        sAnchorPosY_S = sStartPointY_S;
        bXOddFlag = 0;
        fEndRenderRow = FALSE;
        fEndRenderCol = FALSE;

        GetVideoObject( &hVObject, uiPERSONS );
        do
        {

                fEndRenderRow = FALSE;
                sTempPosX_M = sAnchorPosX_M;
                sTempPosY_M = sAnchorPosY_M;
                sTempPosX_S = sAnchorPosX_S;
                sTempPosY_S = sAnchorPosY_S;

                if(bXOddFlag > 0)
                        sTempPosX_S += 4;


                do
                {

                        usTileIndex=FASTMAPROWCOLTOPOS( sTempPosY_M, sTempPosX_M );

                        if ( usTileIndex < GRIDSIZE )
                        {
                                sHeight=(gpWorldLevelData[usTileIndex].sHeight/5);

                                pNode = gpWorldLevelData[ usTileIndex ].pStructHead;
                                while( pNode != NULL )
                                {
                                        // Render itempools!
                                        if ( ( pNode->uiFlags & LEVELNODE_ITEM ) )
                                        {
                                                sX = sTempPosX_S;
                                                sY = sTempPosY_S - sHeight;
                                                // RENDER!
                                                if ( pNode->pItemPool->bVisible == -1 && !(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)  )
                                                {

                                                }
                                                else
                                                {
                                                        if ( gfRadarCurrentGuyFlash )
                                                        {
                                                                usLineColor = Get16BPPColor( FROMRGB( 0, 0, 0 ) );
                                                        }
                                                        else
                                                        {
                                                                usLineColor = Get16BPPColor( FROMRGB( 255, 255, 255 ) );
                                                        }
                                                        RectangleDraw( TRUE, sX, sY, sX + 1, sY + 1, usLineColor, pDestBuf );

                                                        InvalidateRegion( sX, sY, (INT16)( sX + 2 ), (INT16)( sY + 2 ) );

                                                }
                                                break;
                                        }

                                        pNode = pNode->pNext;
                                }


                                pNode = gpWorldLevelData[ usTileIndex ].pMercHead;
                                while( pNode != NULL )
                                {
                                                pSoldier = pNode->pSoldier;

                                                sX = sTempPosX_S;
                                                sY = sTempPosY_S - sHeight - 8; // 8 height of doll guy

                                                // RENDER!
                                                if ( pSoldier->bLastRenderVisibleValue == -1 && !(gTacticalStatus.uiFlags&SHOW_ALL_MERCS)  )
                                                {

                                                }
                                                else
                                                {
                                                        // Adjust for height...
                                                        sY -= ( pSoldier->sHeightAdjustment / 5 );

                                                        // Adjust shade a bit...
                                                        SetObjectShade( hVObject, 0 );

                                                        // If on roof....
                                                        if ( pSoldier->sHeightAdjustment )
                                                        {
                                                                SetObjectShade( hVObject, 1 );
                                                        }

                                                        if ( pSoldier->ubID == gusSelectedSoldier )
                                                        {
                                                                if( gfRadarCurrentGuyFlash && !gfTacticalPlacementGUIActive )
                                                                {
                                                                        SetObjectShade( hVObject, 2 );
                                                                }
                                                        }
                                                        #ifdef JA2EDITOR
                                                        if( gfEditMode && gpSelected && gpSelected->pSoldier == pSoldier )
                                                        { //editor:  show the selected edited merc as the yellow one.
                                                                Blt8BPPDataTo16BPPBufferTransparent((UINT16*)pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 0 );
                                                        }
                                                        else
                                                        #endif
                                                        if( gfTacticalPlacementGUIActive && gpTacticalPlacementSelectedSoldier == pSoldier )
                                                        { //tactical placement selected merc
                                                                Blt8BPPDataTo16BPPBufferTransparent((UINT16*)pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 7 );
                                                        }
                                                        else if( gfTacticalPlacementGUIActive && gpTacticalPlacementHilightedSoldier == pSoldier )
                                                        { //tactical placement selected merc
                                                                Blt8BPPDataTo16BPPBufferTransparent((UINT16*)pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 8 );
                                                        }
                                                        else
                                                        { //normal
                                                                Blt8BPPDataTo16BPPBufferTransparent((UINT16*)pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, pSoldier->bTeam );
                                                        }
                                                        RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, (INT16)(sX-2), (INT16)(sY-2), (INT16)(sX + 5), (INT16)(sY + 11));
                                                }

                                                pNode = pNode->pNext;
                                }
                        }

                        sTempPosX_S += 8;
                        sTempPosX_M ++;
                        sTempPosY_M --;

                        if ( sTempPosX_S >= sEndXS )
                        {
                                fEndRenderRow = TRUE;
                        }

                } while( !fEndRenderRow );

                if ( bXOddFlag > 0 )
                {
                        sAnchorPosY_M ++;
                }
                else
                {
                        sAnchorPosX_M ++;
                }


                bXOddFlag = !bXOddFlag;
                sAnchorPosY_S += 2;

                if ( sAnchorPosY_S >= sEndYS )
                {
                        fEndRenderCol = TRUE;
                }

        }
        while( !fEndRenderCol );
        UnLockVideoSurface( FRAME_BUFFER );
}
*/

function MoveInOverheadRegionCallback(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  // Calculate the cursor...
}

function ClickOverheadRegionCallback(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
  let uiCellX: UINT32;
  let uiCellY: UINT32;
  let sWorldScreenX: INT16;
  let sWorldScreenY: INT16;

  if (gfTacticalPlacementGUIActive) {
    HandleTacticalPlacementClicksInOverheadMap(reg, reason);
    return;
  }

  if (!(reg->uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    reg->uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    reg->uiFlags &= (~BUTTON_CLICKED_ON);
    sWorldScreenX = (gusMouseXPos - gsStartRestrictedX) * 5;
    sWorldScreenY = (gusMouseYPos - gsStartRestrictedY) * 5;

    // Get new proposed center location.
    GetFromAbsoluteScreenXYWorldXY(&uiCellX, &uiCellY, sWorldScreenX, sWorldScreenY);

    SetRenderCenter(uiCellX, uiCellY);

    KillOverheadMap();
  } else if (reason & MSYS_CALLBACK_REASON_RBUTTON_DWN) {
    KillOverheadMap();
  }
}

function MoveOverheadRegionCallback(reg: Pointer<MOUSE_REGION>, reason: INT32): void {
}

function GetOverheadScreenXYFromGridNo(sGridNo: INT16, psScreenX: Pointer<INT16>, psScreenY: Pointer<INT16>): void {
  GetWorldXYAbsoluteScreenXY((CenterX(sGridNo) / CELL_X_SIZE), (CenterY(sGridNo) / CELL_Y_SIZE), psScreenX, psScreenY);
  *psScreenX /= 5;
  *psScreenY /= 5;

  *psScreenX += 5;
  *psScreenY += 5;

  // Subtract the height....
  //*psScreenY -= gpWorldLevelData[ sGridNo ].sHeight / 5;
}

function GetOverheadMouseGridNo(psGridNo: Pointer<INT16>): BOOLEAN {
  let uiCellX: UINT32;
  let uiCellY: UINT32;
  let sWorldScreenX: INT16;
  let sWorldScreenY: INT16;

  if ((OverheadRegion.uiFlags & MSYS_MOUSE_IN_AREA)) {
    // ATE: Adjust alogrithm values a tad to reflect map positioning
    sWorldScreenX = gsStartRestrictedX + (gusMouseXPos - 5) * 5;
    sWorldScreenY = gsStartRestrictedY + (gusMouseYPos - 8) * 5;

    // Get new proposed center location.
    GetFromAbsoluteScreenXYWorldXY(&uiCellX, &uiCellY, sWorldScreenX, sWorldScreenY);

    // Get gridNo
    (*psGridNo) = MAPROWCOLTOPOS((uiCellY / CELL_Y_SIZE), (uiCellX / CELL_X_SIZE));

    // Adjust for height.....
    sWorldScreenY = sWorldScreenY + gpWorldLevelData[(*psGridNo)].sHeight;

    GetFromAbsoluteScreenXYWorldXY(&uiCellX, &uiCellY, sWorldScreenX, sWorldScreenY);

    // Get gridNo
    (*psGridNo) = MAPROWCOLTOPOS((uiCellY / CELL_Y_SIZE), (uiCellX / CELL_X_SIZE));

    return TRUE;
  } else {
    return FALSE;
  }
}

function GetOverheadMouseGridNoForFullSoldiersGridNo(psGridNo: Pointer<INT16>): BOOLEAN {
  let uiCellX: UINT32;
  let uiCellY: UINT32;
  let sWorldScreenX: INT16;
  let sWorldScreenY: INT16;

  if ((OverheadRegion.uiFlags & MSYS_MOUSE_IN_AREA)) {
    // ATE: Adjust alogrithm values a tad to reflect map positioning
    sWorldScreenX = gsStartRestrictedX + (gusMouseXPos - 5) * 5;
    sWorldScreenY = gsStartRestrictedY + (gusMouseYPos)*5;

    // Get new proposed center location.
    GetFromAbsoluteScreenXYWorldXY(&uiCellX, &uiCellY, sWorldScreenX, sWorldScreenY);

    // Get gridNo
    (*psGridNo) = MAPROWCOLTOPOS((uiCellY / CELL_Y_SIZE), (uiCellX / CELL_X_SIZE));

    // Adjust for height.....
    sWorldScreenY = sWorldScreenY + gpWorldLevelData[(*psGridNo)].sHeight;

    GetFromAbsoluteScreenXYWorldXY(&uiCellX, &uiCellY, sWorldScreenX, sWorldScreenY);

    // Get gridNo
    (*psGridNo) = MAPROWCOLTOPOS((uiCellY / CELL_Y_SIZE), (uiCellX / CELL_X_SIZE));

    return TRUE;
  } else {
    return FALSE;
  }
}

function CalculateRestrictedMapCoords(bDirection: INT8, psX1: Pointer<INT16>, psY1: Pointer<INT16>, psX2: Pointer<INT16>, psY2: Pointer<INT16>, sEndXS: INT16, sEndYS: INT16): void {
  switch (bDirection) {
    case NORTH:

      *psX1 = 0;
      *psX2 = sEndXS;
      *psY1 = 0;
      *psY2 = (abs(NORMAL_MAP_SCREEN_TY - gsTLY) / 5);
      break;

    case WEST:

      *psX1 = 0;
      *psX2 = (abs(-NORMAL_MAP_SCREEN_X - gsTLX) / 5);
      *psY1 = 0;
      *psY2 = sEndYS;
      break;

    case SOUTH:

      *psX1 = 0;
      *psX2 = sEndXS;
      *psY1 = (NORMAL_MAP_SCREEN_HEIGHT - abs(NORMAL_MAP_SCREEN_BY - gsBLY)) / 5;
      *psY2 = sEndYS;
      break;

    case EAST:

      *psX1 = (NORMAL_MAP_SCREEN_WIDTH - abs(NORMAL_MAP_SCREEN_X - gsTRX)) / 5;
      *psX2 = sEndXS;
      *psY1 = 0;
      *psY2 = sEndYS;
      break;
  }
}

function CalculateRestrictedScaleFactors(pScaleX: Pointer<INT16>, pScaleY: Pointer<INT16>): void {
}

function CopyOverheadDBShadetablesFromTileset(): void {
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let pTileSurf: PTILE_IMAGERY;

  // Loop through tileset
  for (uiLoop = 0; uiLoop < NUMBEROFTILETYPES; uiLoop++) {
    pTileSurf = (gTileSurfaceArray[uiLoop]);

    gSmTileSurf[uiLoop].vo->fFlags |= VOBJECT_FLAG_SHADETABLE_SHARED;

    for (uiLoop2 = 0; uiLoop2 < HVOBJECT_SHADE_TABLES; uiLoop2++) {
      gSmTileSurf[uiLoop].vo->pShades[uiLoop2] = pTileSurf->vo->pShades[uiLoop2];
    }
  }
}

function TrashOverheadMap(): void {
  // If loaded, unload!
  if (gfSmTileLoaded) {
    // Unload
    DeleteOverheadDB();

    // Force load
    gfSmTileLoaded = FALSE;
  }
}
