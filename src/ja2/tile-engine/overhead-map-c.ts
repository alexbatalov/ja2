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
let gfSmTileLoaded: boolean = false;
let gfInOverheadMap: boolean = false;
let OverheadRegion: MOUSE_REGION;
let OverheadBackgroundRegion: MOUSE_REGION;
let uiOVERMAP: UINT32;
let uiPERSONS: UINT32;
export let gfOverheadMapDirty: boolean = false;
let gsStartRestrictedX: INT16;
let gsStartRestrictedY: INT16;
let gfOverItemPool: boolean = false;
let gsOveritemPoolGridNo: INT16;

export function InitNewOverheadDB(ubTilesetID: UINT8): void {
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

  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    // Create video object

    // Adjust for BPP
    FilenameForBPP(gTilesets[ubTilesetID].TileSurfaceFilenames[uiLoop], cFileBPP);

    // Adjust for tileset position
    sprintf(cAdjustedFile, "TILESETS\\%d\\T\\%s", ubTilesetID, cFileBPP);

    VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
    strcpy(VObjectDesc.ImageFile, cAdjustedFile);
    hVObject = CreateVideoObject(addressof(VObjectDesc));

    if (hVObject == null) {
      // TRY loading from default directory
      FilenameForBPP(gTilesets[Enum316.GENERIC_1].TileSurfaceFilenames[uiLoop], cFileBPP);
      // Adjust for tileset position
      sprintf(cAdjustedFile, "TILESETS\\0\\T\\%s", cFileBPP);

      // LOAD ONE WE KNOW ABOUT!
      VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
      strcpy(VObjectDesc.ImageFile, cAdjustedFile);
      hVObject = CreateVideoObject(addressof(VObjectDesc));

      if (hVObject == null) {
        // LOAD ONE WE KNOW ABOUT!
        VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
        strcpy(VObjectDesc.ImageFile, "TILESETS\\0\\T\\grass.sti");
        hVObject = CreateVideoObject(addressof(VObjectDesc));
      }
    }

    gSmTileSurf[uiLoop].vo = hVObject;
    gSmTileSurf[uiLoop].fType = uiLoop;
  }

  // NOW LOOP THROUGH AND CREATE DATABASE
  for (cnt1 = 0; cnt1 < Enum313.NUMBEROFTILETYPES; cnt1++) {
    // Get number of regions
    s = gSmTileSurf[cnt1];

    NumRegions = s.vo.value.usNumberOfObjects;

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

    CalculateRestrictedMapCoords(Enum245.NORTH, addressof(sX1), addressof(sY1), addressof(sX2), addressof(gsStartRestrictedY), 640, 320);
    CalculateRestrictedMapCoords(Enum245.WEST, addressof(sX1), addressof(sY1), addressof(gsStartRestrictedX), addressof(sY2), 640, 320);
  }

  // Copy over shade tables from main tileset
  CopyOverheadDBShadetablesFromTileset();
}

function DeleteOverheadDB(): void {
  let cnt: INT32;

  for (cnt = 0; cnt < Enum313.NUMBEROFTILETYPES; cnt++) {
    DeleteVideoObject(gSmTileSurf[cnt].vo);
  }
}

function GetClosestItemPool(sSweetGridNo: INT16, ppReturnedItemPool: Pointer<Pointer<ITEM_POOL>>, ubRadius: UINT8, bLevel: INT8): boolean {
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
  let fFound: boolean = false;
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
        if (GetItemPool(sGridNo, addressof(pItemPool), bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            (ppReturnedItemPool.value) = pItemPool;
            uiLowestRange = uiRange;
            fFound = true;
          }
        }
      }
    }
  }

  return fFound;
}

function GetClosestMercInOverheadMap(sSweetGridNo: INT16, ppReturnedSoldier: Pointer<Pointer<SOLDIERTYPE>>, ubRadius: UINT8): boolean {
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
  let fFound: boolean = false;

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
        if (gpWorldLevelData[sGridNo].pMercHead != null && gpWorldLevelData[sGridNo].pMercHead.value.pSoldier.value.bVisible != -1) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            (ppReturnedSoldier.value) = gpWorldLevelData[sGridNo].pMercHead.value.pSoldier;
            uiLowestRange = uiRange;
            fFound = true;
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
  GetWorldXYAbsoluteScreenXY((pSoldier.value.sX / CELL_X_SIZE), (pSoldier.value.sY / CELL_Y_SIZE), addressof(sWorldScreenX), addressof(sWorldScreenY));

  sWorldScreenX = gsStartRestrictedX + (sWorldScreenX / 5) + 5;
  sWorldScreenY = gsStartRestrictedY + (sWorldScreenY / 5) + (pSoldier.value.sHeightAdjustment / 5) + (gpWorldLevelData[pSoldier.value.sGridNo].sHeight / 5) - 8;

  sWorldScreenY += (gsRenderHeight / 5);

  // Display name
  SetFont(TINYFONT1());
  SetFontBackground(FONT_MCOLOR_BLACK);
  SetFontForeground(FONT_MCOLOR_WHITE);

  // Center here....
  FindFontCenterCoordinates(sWorldScreenX, sWorldScreenY, (1), 1, pSoldier.value.name, TINYFONT1(), addressof(sX), addressof(sY));

  // OK, selected guy is here...
  gprintfdirty(sX, sY, pSoldier.value.name);
  mprintf(sX, sY, pSoldier.value.name);
}

export function HandleOverheadMap(): void {
  /* static */ let fFirst: boolean = true;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (fFirst) {
    fFirst = false;
  }

  gfInOverheadMap = true;
  gfOverItemPool = false;

  // Check tileset numbers
  if (gubSmTileNum != giCurrentTilesetID) {
    // If loaded, unload!
    if (gfSmTileLoaded) {
      // Unload
      DeleteOverheadDB();

      // Force load
      gfSmTileLoaded = false;
    }
  }

  gubSmTileNum = giCurrentTilesetID;

  if (gfSmTileLoaded == false) {
    // LOAD LAND
    InitNewOverheadDB(gubSmTileNum);
    gfSmTileLoaded = true;
  }

  // restore background rects
  RestoreBackgroundRects();

  // RENDER!!!!!!!!
  RenderOverheadMap(0, (WORLD_COLS / 2), 0, 0, 640, 320, false);

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

    gfUIHandleSelectionAboveGuy = false;

    HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), null, true);

    if (GetOverheadMouseGridNo(addressof(usMapPos))) {
      // ATE: Find the closest item pool within 5 tiles....
      if (GetClosestItemPool(usMapPos, addressof(pItemPool), 1, 0)) {
        let pStructure: Pointer<STRUCTURE> = null;
        let sIntTileGridNo: INT16;
        let bZLevel: INT8 = 0;
        let sActionGridNo: INT16 = usMapPos;

        // Get interactive tile...
        if (ConditionalGetCurInteractiveTileGridNoAndStructure(addressof(sIntTileGridNo), addressof(pStructure), false)) {
          sActionGridNo = sIntTileGridNo;
        }

        bZLevel = GetZLevelOfItemPoolGivenStructure(sActionGridNo, 0, pStructure);

        if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
          DrawItemPoolList(pItemPool, usMapPos, ITEMLIST_DISPLAY, bZLevel, gusMouseXPos, gusMouseYPos);

          gfOverItemPool = true;
          gsOveritemPoolGridNo = pItemPool.value.sGridNo;
        }
      }

      if (GetClosestItemPool(usMapPos, addressof(pItemPool), 1, 1)) {
        let bZLevel: INT8 = 0;
        let sActionGridNo: INT16 = usMapPos;

        if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
          DrawItemPoolList(pItemPool, usMapPos, ITEMLIST_DISPLAY, bZLevel, gusMouseXPos, (gusMouseYPos - 5));

          gfOverItemPool = true;
          gsOveritemPoolGridNo = pItemPool.value.sGridNo;
        }
      }
    }

    if (GetOverheadMouseGridNoForFullSoldiersGridNo(addressof(usMapPos))) {
      if (GetClosestMercInOverheadMap(usMapPos, addressof(pSoldier), 1)) {
        if (pSoldier.value.bTeam == gbPlayerNum) {
          gfUIHandleSelectionAboveGuy = true;
          gsSelectedGuy = pSoldier.value.ubID;
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

  fInterfacePanelDirty = false;
}

export function InOverheadMap(): boolean {
  return gfInOverheadMap;
}

export function GoIntoOverheadMap(): void {
  let VObjectDesc: VOBJECT_DESC;
  let hVObject: HVOBJECT;

  gfInOverheadMap = true;

  MSYS_DefineRegion(addressof(OverheadBackgroundRegion), 0, 0, 640, 360, MSYS_PRIORITY_HIGH, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
  // Add region
  MSYS_AddRegion(addressof(OverheadBackgroundRegion));

  MSYS_DefineRegion(addressof(OverheadRegion), 0, 0, gsVIEWPORT_END_X, 320, MSYS_PRIORITY_HIGH, Enum317.CURSOR_NORMAL, MoveOverheadRegionCallback, ClickOverheadRegionCallback);
  // Add region
  MSYS_AddRegion(addressof(OverheadRegion));

  // LOAD CLOSE ANIM
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\MAP_BORD.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(uiOVERMAP)))
    AssertMsg(0, "Missing INTERFACE\\MAP_BORD.sti");

  // LOAD PERSONS
  VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
  FilenameForBPP("INTERFACE\\PERSONS.sti", VObjectDesc.ImageFile);
  if (!AddVideoObject(addressof(VObjectDesc), addressof(uiPERSONS)))
    AssertMsg(0, "Missing INTERFACE\\PERSONS.sti");

  // Add shades to persons....
  GetVideoObject(addressof(hVObject), uiPERSONS);
  hVObject.value.pShades[0] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 256, 256, 256, false);
  hVObject.value.pShades[1] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 310, 310, 310, false);
  hVObject.value.pShades[2] = Create16BPPPaletteShaded(hVObject.value.pPaletteEntry, 0, 0, 0, false);

  gfOverheadMapDirty = true;

  if (!gfEditMode) {
    // Make sure we are in team panel mode...
    gfSwitchPanel = true;
    gbNewPanel = Enum215.TEAM_PANEL;
    gubNewPanelParam = gusSelectedSoldier;
    fInterfacePanelDirty = DIRTYLEVEL2;

    // Disable tactical buttons......
    if (!gfEnterTacticalPlacementGUI) {
      // Handle switch of panel....
      HandleTacticalPanelSwitch();
      DisableTacticalTeamPanelButtons(true);
    }

    EmptyBackgroundRects();
  }
}

function HandleOverheadUI(): void {
  let InputEvent: InputAtom;
  let sMousePos: INT16 = 0;
  let ubID: UINT8;

  // CHECK FOR MOUSE OVER REGIONS...
  if (GetOverheadMouseGridNo(addressof(sMousePos))) {
    // Look quickly for a soldier....
    ubID = QuickFindSoldier(sMousePos);

    if (ubID != NOBODY) {
      // OK, selected guy is here...
      // gprintfdirty( gusMouseXPos, gusMouseYPos, MercPtrs[ ubID ]->name );
      // mprintf( gusMouseXPos, gusMouseYPos, MercPtrs[ ubID ]->name );
    }
  }

  while (DequeueEvent(addressof(InputEvent)) == true) {
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

export function KillOverheadMap(): void {
  gfInOverheadMap = false;
  SetRenderFlags(RENDER_FLAG_FULL);
  RenderWorld();

  MSYS_RemoveRegion(addressof(OverheadRegion));
  MSYS_RemoveRegion(addressof(OverheadBackgroundRegion));

  DeleteVideoObjectFromIndex(uiOVERMAP);
  DeleteVideoObjectFromIndex(uiPERSONS);

  HandleTacticalPanelSwitch();
  DisableTacticalTeamPanelButtons(false);
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

export function RenderOverheadMap(sStartPointX_M: INT16, sStartPointY_M: INT16, sStartPointX_S: INT16, sStartPointY_S: INT16, sEndXS: INT16, sEndYS: INT16, fFromMapUtility: boolean): void {
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
  let fEndRenderRow: boolean = false;
  let fEndRenderCol: boolean = false;
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
    GetVideoObject(addressof(hVObject), uiPERSONS);
  }

  if (gfOverheadMapDirty) {
    // Black out.......
    ColorFillVideoSurfaceArea(FRAME_BUFFER, sStartPointX_S, sStartPointY_S, sEndXS, sEndYS, 0);

    InvalidateScreen();
    gfOverheadMapDirty = false;

    // Begin Render Loop
    sAnchorPosX_M = sStartPointX_M;
    sAnchorPosY_M = sStartPointY_M;
    sAnchorPosX_S = sStartPointX_S;
    sAnchorPosY_S = sStartPointY_S;

    // Zero out area!
    // ColorFillVideoSurfaceArea( FRAME_BUFFER, 0, 0, (INT16)(640), (INT16)(gsVIEWPORT_WINDOW_END_Y), Get16BPPColor( FROMRGB( 0, 0, 0 ) ) );

    pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));

    do {
      fEndRenderRow = false;
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
          while (pNode != null) {
            pTile = addressof(gSmTileDB[pNode.value.usIndex]);

            sX = sTempPosX_S;
            sY = sTempPosY_S - sHeight + (gsRenderHeight / 5);

            pTile.value.vo.value.pShadeCurrent = gSmTileSurf[pTile.value.fType].vo.value.pShades[pNode.value.ubShadeLevel];

            // RENDER!
            // BltVideoObjectFromIndex(  FRAME_BUFFER, SGR1, gSmallTileDatabase[ gpWorldLevelData[ usTileIndex ].pLandHead->usIndex ], sX, sY, VO_BLT_SRCTRANSPARENCY, NULL );
            // BltVideoObjectFromIndex(  FRAME_BUFFER, SGR1, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, NULL );
            Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, pTile.value.vo, sX, sY, pTile.value.usSubIndex);

            pNode = pNode.value.pPrevNode;
          }
        }

        sTempPosX_S += 8;
        sTempPosX_M++;
        sTempPosY_M--;

        if (sTempPosX_S >= sEndXS) {
          fEndRenderRow = true;
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
        fEndRenderCol = true;
      }
    } while (!fEndRenderCol);

    // Begin Render Loop
    sAnchorPosX_M = sStartPointX_M;
    sAnchorPosY_M = sStartPointY_M;
    sAnchorPosX_S = sStartPointX_S;
    sAnchorPosY_S = sStartPointY_S;
    bXOddFlag = 0;
    fEndRenderRow = false;
    fEndRenderCol = false;

    do {
      fEndRenderRow = false;
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
          while (pNode != null) {
            if (pNode.value.usIndex < Enum312.NUMBEROFTILES) {
              // Don't render itempools!
              if (!(pNode.value.uiFlags & LEVELNODE_ITEM)) {
                pTile = addressof(gSmTileDB[pNode.value.usIndex]);

                sX = sTempPosX_S;
                sY = sTempPosY_S;

                if (gTileDatabase[pNode.value.usIndex].uiFlags & IGNORE_WORLD_HEIGHT) {
                  sY -= sModifiedHeight;
                } else {
                  sY -= sHeight;
                }

                sY += (gsRenderHeight / 5);

                pTile.value.vo.value.pShadeCurrent = gSmTileSurf[pTile.value.fType].vo.value.pShades[pNode.value.ubShadeLevel];

                // RENDER!
                Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, pTile.value.vo, sX, sY, pTile.value.usSubIndex);
              }
            }

            pNode = pNode.value.pNext;
          }

          pNode = gpWorldLevelData[usTileIndex].pShadowHead;
          while (pNode != null) {
            if (pNode.value.usIndex < Enum312.NUMBEROFTILES) {
              pTile = addressof(gSmTileDB[pNode.value.usIndex]);
              sX = sTempPosX_S;
              sY = sTempPosY_S - sHeight;

              sY += (gsRenderHeight / 5);

              pTile.value.vo.value.pShadeCurrent = gSmTileSurf[pTile.value.fType].vo.value.pShades[pNode.value.ubShadeLevel];

              // RENDER!
              Blt8BPPDataTo16BPPBufferShadow(pDestBuf, uiDestPitchBYTES, pTile.value.vo, sX, sY, pTile.value.usSubIndex);
            }

            pNode = pNode.value.pNext;
          }

          pNode = gpWorldLevelData[usTileIndex].pStructHead;

          while (pNode != null) {
            if (pNode.value.usIndex < Enum312.NUMBEROFTILES) {
              // Don't render itempools!
              if (!(pNode.value.uiFlags & LEVELNODE_ITEM)) {
                pTile = addressof(gSmTileDB[pNode.value.usIndex]);

                sX = sTempPosX_S;
                sY = sTempPosY_S - (gTileDatabase[pNode.value.usIndex].sOffsetHeight / 5);

                if (gTileDatabase[pNode.value.usIndex].uiFlags & IGNORE_WORLD_HEIGHT) {
                  sY -= sModifiedHeight;
                } else {
                  sY -= sHeight;
                }

                sY += (gsRenderHeight / 5);

                pTile.value.vo.value.pShadeCurrent = gSmTileSurf[pTile.value.fType].vo.value.pShades[pNode.value.ubShadeLevel];

                // RENDER!
                Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, pTile.value.vo, sX, sY, pTile.value.usSubIndex);
              }
            }

            pNode = pNode.value.pNext;
          }
        }

        sTempPosX_S += 8;
        sTempPosX_M++;
        sTempPosY_M--;

        if (sTempPosX_S >= sEndXS) {
          fEndRenderRow = true;
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
        fEndRenderCol = true;
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
      fEndRenderRow = false;
      fEndRenderCol = false;

      do {
        fEndRenderRow = false;
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
            while (pNode != null) {
              if (pNode.value.usIndex < Enum312.NUMBEROFTILES) {
                if (!(pNode.value.uiFlags & LEVELNODE_HIDDEN)) {
                  pTile = addressof(gSmTileDB[pNode.value.usIndex]);

                  sX = sTempPosX_S;
                  sY = sTempPosY_S - (gTileDatabase[pNode.value.usIndex].sOffsetHeight / 5) - sHeight;

                  sY -= (WALL_HEIGHT / 5);

                  sY += (gsRenderHeight / 5);

                  pTile.value.vo.value.pShadeCurrent = gSmTileSurf[pTile.value.fType].vo.value.pShades[pNode.value.ubShadeLevel];

                  // RENDER!
                  Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, pTile.value.vo, sX, sY, pTile.value.usSubIndex);
                }
              }
              pNode = pNode.value.pNext;
            }
          }

          sTempPosX_S += 8;
          sTempPosX_M++;
          sTempPosY_M--;

          if (sTempPosX_S >= sEndXS) {
            fEndRenderRow = true;
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
          fEndRenderCol = true;
        }
      } while (!fEndRenderCol);
    }

    UnLockVideoSurface(FRAME_BUFFER);

    // OK, blacken out edges of smaller maps...
    if (gMapInformation.ubRestrictedScrollID != 0) {
      CalculateRestrictedMapCoords(Enum245.NORTH, addressof(sX1), addressof(sY1), addressof(sX2), addressof(sY2), sEndXS, sEndYS);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, sX1, sY1, sX2, sY2, Get16BPPColor(FROMRGB(0, 0, 0)));

      CalculateRestrictedMapCoords(Enum245.WEST, addressof(sX1), addressof(sY1), addressof(sX2), addressof(sY2), sEndXS, sEndYS);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, sX1, sY1, sX2, sY2, Get16BPPColor(FROMRGB(0, 0, 0)));

      CalculateRestrictedMapCoords(Enum245.SOUTH, addressof(sX1), addressof(sY1), addressof(sX2), addressof(sY2), sEndXS, sEndYS);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, sX1, sY1, sX2, sY2, Get16BPPColor(FROMRGB(0, 0, 0)));

      CalculateRestrictedMapCoords(Enum245.EAST, addressof(sX1), addressof(sY1), addressof(sX2), addressof(sY2), sEndXS, sEndYS);
      ColorFillVideoSurfaceArea(FRAME_BUFFER, sX1, sY1, sX2, sY2, Get16BPPColor(FROMRGB(0, 0, 0)));
    }

    if (!fFromMapUtility) {
      // Render border!
      BltVideoObjectFromIndex(FRAME_BUFFER, uiOVERMAP, 0, 0, 0, VO_BLT_SRCTRANSPARENCY, null);
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
      GetCurrentVideoSettings(addressof(usWidth), addressof(usHeight), addressof(ubBitDepth));

      pSrcBuf = LockVideoSurface(guiRENDERBUFFER, addressof(uiSrcPitchBYTES));
      pDestBuf = LockVideoSurface(guiSAVEBUFFER, addressof(uiDestPitchBYTES));

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

  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  GetVideoObject(addressof(hVObject), uiPERSONS);

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
    if (!pSoldier.value.bActive || !pSoldier.value.bInSector)
      continue;
    // Soldier is here.  Calculate his screen position based on his current gridno.
    GetOverheadScreenXYFromGridNo(pSoldier.value.sGridNo, addressof(sX), addressof(sY));
    // Now, draw his "doll"

    // adjust for position.
    sX += 2;
    sY -= 5;
    // sScreenY -= 7;	//height of doll

    if (!gfTacticalPlacementGUIActive && pSoldier.value.bLastRenderVisibleValue == -1 && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
      continue;
    }

    if (pSoldier.value.sGridNo == NOWHERE) {
      continue;
    }

    sY -= (GetOffsetLandHeight(pSoldier.value.sGridNo) / 5);

    // Adjust for height...
    sY -= (pSoldier.value.sHeightAdjustment / 5);

    sY += (gsRenderHeight / 5);

    // Adjust shade a bit...
    SetObjectShade(hVObject, 0);

    // If on roof....
    if (pSoldier.value.sHeightAdjustment) {
      SetObjectShade(hVObject, 1);
    }

    if (pSoldier.value.ubID == gusSelectedSoldier) {
      if (gfRadarCurrentGuyFlash && !gfTacticalPlacementGUIActive) {
        SetObjectShade(hVObject, 2);
      }
    }
    if (gfEditMode && gpSelected && gpSelected.value.pSoldier == pSoldier) {
      // editor:  show the selected edited merc as the yellow one.
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 0);
    } else
        if (!gfTacticalPlacementGUIActive) {
          // normal
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, pSoldier.value.bTeam);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, null, sX, sY, (sX + 3), (sY + 9));
    } else if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
      // vehicle
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 9);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, null, (sX - 6), (sY), (sX + 9), (sY + 10));
    }
    // else if( pSoldier->uiStatusFlags & (SOLDIER_PASSENGER | SOLDIER_DRIVER) )
    //{// //don't draw person, because they are inside the vehicle.
    //	ubPassengers++;
    //}
    else if (gpTacticalPlacementSelectedSoldier == pSoldier) {
      // tactical placement selected merc
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 7);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, null, (sX - 2), (sY - 2), (sX + 5), (sY + 11));
    } else if (gpTacticalPlacementHilightedSoldier == pSoldier && pSoldier.value.uiStatusFlags) {
      // tactical placement hilighted merc
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, 8);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, null, (sX - 2), (sY - 2), (sX + 5), (sY + 11));
    } else {
      // normal
      Blt8BPPDataTo16BPPBufferTransparent(pDestBuf, uiDestPitchBYTES, hVObject, sX, sY, pSoldier.value.bTeam);
      RegisterBackgroundRect(BGND_FLAG_SINGLE, null, sX, sY, (sX + 3), (sY + 9));
    }
    if (ubPassengers) {
      SetFont(SMALLCOMPFONT());
      SetFontForeground(FONT_WHITE);
      gprintfdirty((sX - 3), sY, "%d", ubPassengers);
      mprintf_buffer(pDestBuf, uiDestPitchBYTES, SMALLCOMPFONT(), sX - 3, sY, "%d", ubPassengers);
    }
  }

  // ITEMS OVERLAY
  if (!gfTacticalPlacementGUIActive) {
    for (i = 0; i < guiNumWorldItems; i++) {
      pWorldItem = addressof(gWorldItems[i]);
      if (!pWorldItem || !pWorldItem.value.fExists || pWorldItem.value.bVisible != VISIBLE && !(gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
        continue;
      }

      GetOverheadScreenXYFromGridNo(pWorldItem.value.sGridNo, addressof(sX), addressof(sY));

      // adjust for position.
      // sX += 2;
      sY += 6;
      sY -= (GetOffsetLandHeight(pWorldItem.value.sGridNo) / 5);

      sY += (gsRenderHeight / 5);

      if (gfRadarCurrentGuyFlash) {
        usLineColor = Get16BPPColor(FROMRGB(0, 0, 0));
      } else
        switch (pWorldItem.value.bVisible) {
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

      if (gfOverItemPool && gsOveritemPoolGridNo == pWorldItem.value.sGridNo) {
        usLineColor = Get16BPPColor(FROMRGB(255, 0, 0));
      }

      PixelDraw(false, sX, sY, usLineColor, pDestBuf);

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

  if (!(reg.value.uiFlags & BUTTON_ENABLED))
    return;

  if (reason & MSYS_CALLBACK_REASON_LBUTTON_DWN) {
    reg.value.uiFlags |= BUTTON_CLICKED_ON;
  } else if (reason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    reg.value.uiFlags &= (~BUTTON_CLICKED_ON);
    sWorldScreenX = (gusMouseXPos - gsStartRestrictedX) * 5;
    sWorldScreenY = (gusMouseYPos - gsStartRestrictedY) * 5;

    // Get new proposed center location.
    GetFromAbsoluteScreenXYWorldXY(addressof(uiCellX), addressof(uiCellY), sWorldScreenX, sWorldScreenY);

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
  psScreenX.value /= 5;
  psScreenY.value /= 5;

  psScreenX.value += 5;
  psScreenY.value += 5;

  // Subtract the height....
  //*psScreenY -= gpWorldLevelData[ sGridNo ].sHeight / 5;
}

export function GetOverheadMouseGridNo(psGridNo: Pointer<INT16>): boolean {
  let uiCellX: UINT32;
  let uiCellY: UINT32;
  let sWorldScreenX: INT16;
  let sWorldScreenY: INT16;

  if ((OverheadRegion.uiFlags & MSYS_MOUSE_IN_AREA)) {
    // ATE: Adjust alogrithm values a tad to reflect map positioning
    sWorldScreenX = gsStartRestrictedX + (gusMouseXPos - 5) * 5;
    sWorldScreenY = gsStartRestrictedY + (gusMouseYPos - 8) * 5;

    // Get new proposed center location.
    GetFromAbsoluteScreenXYWorldXY(addressof(uiCellX), addressof(uiCellY), sWorldScreenX, sWorldScreenY);

    // Get gridNo
    (psGridNo.value) = MAPROWCOLTOPOS((uiCellY / CELL_Y_SIZE), (uiCellX / CELL_X_SIZE));

    // Adjust for height.....
    sWorldScreenY = sWorldScreenY + gpWorldLevelData[(psGridNo.value)].sHeight;

    GetFromAbsoluteScreenXYWorldXY(addressof(uiCellX), addressof(uiCellY), sWorldScreenX, sWorldScreenY);

    // Get gridNo
    (psGridNo.value) = MAPROWCOLTOPOS((uiCellY / CELL_Y_SIZE), (uiCellX / CELL_X_SIZE));

    return true;
  } else {
    return false;
  }
}

function GetOverheadMouseGridNoForFullSoldiersGridNo(psGridNo: Pointer<INT16>): boolean {
  let uiCellX: UINT32;
  let uiCellY: UINT32;
  let sWorldScreenX: INT16;
  let sWorldScreenY: INT16;

  if ((OverheadRegion.uiFlags & MSYS_MOUSE_IN_AREA)) {
    // ATE: Adjust alogrithm values a tad to reflect map positioning
    sWorldScreenX = gsStartRestrictedX + (gusMouseXPos - 5) * 5;
    sWorldScreenY = gsStartRestrictedY + (gusMouseYPos)*5;

    // Get new proposed center location.
    GetFromAbsoluteScreenXYWorldXY(addressof(uiCellX), addressof(uiCellY), sWorldScreenX, sWorldScreenY);

    // Get gridNo
    (psGridNo.value) = MAPROWCOLTOPOS((uiCellY / CELL_Y_SIZE), (uiCellX / CELL_X_SIZE));

    // Adjust for height.....
    sWorldScreenY = sWorldScreenY + gpWorldLevelData[(psGridNo.value)].sHeight;

    GetFromAbsoluteScreenXYWorldXY(addressof(uiCellX), addressof(uiCellY), sWorldScreenX, sWorldScreenY);

    // Get gridNo
    (psGridNo.value) = MAPROWCOLTOPOS((uiCellY / CELL_Y_SIZE), (uiCellX / CELL_X_SIZE));

    return true;
  } else {
    return false;
  }
}

export function CalculateRestrictedMapCoords(bDirection: INT8, psX1: Pointer<INT16>, psY1: Pointer<INT16>, psX2: Pointer<INT16>, psY2: Pointer<INT16>, sEndXS: INT16, sEndYS: INT16): void {
  switch (bDirection) {
    case Enum245.NORTH:

      psX1.value = 0;
      psX2.value = sEndXS;
      psY1.value = 0;
      psY2.value = (Math.abs(NORMAL_MAP_SCREEN_TY - gsTLY) / 5);
      break;

    case Enum245.WEST:

      psX1.value = 0;
      psX2.value = (Math.abs(-NORMAL_MAP_SCREEN_X - gsTLX) / 5);
      psY1.value = 0;
      psY2.value = sEndYS;
      break;

    case Enum245.SOUTH:

      psX1.value = 0;
      psX2.value = sEndXS;
      psY1.value = (NORMAL_MAP_SCREEN_HEIGHT - Math.abs(NORMAL_MAP_SCREEN_BY - gsBLY)) / 5;
      psY2.value = sEndYS;
      break;

    case Enum245.EAST:

      psX1.value = (NORMAL_MAP_SCREEN_WIDTH - Math.abs(NORMAL_MAP_SCREEN_X - gsTRX)) / 5;
      psX2.value = sEndXS;
      psY1.value = 0;
      psY2.value = sEndYS;
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
  for (uiLoop = 0; uiLoop < Enum313.NUMBEROFTILETYPES; uiLoop++) {
    pTileSurf = (gTileSurfaceArray[uiLoop]);

    gSmTileSurf[uiLoop].vo.value.fFlags |= VOBJECT_FLAG_SHADETABLE_SHARED;

    for (uiLoop2 = 0; uiLoop2 < HVOBJECT_SHADE_TABLES; uiLoop2++) {
      gSmTileSurf[uiLoop].vo.value.pShades[uiLoop2] = pTileSurf.value.vo.value.pShades[uiLoop2];
    }
  }
}

export function TrashOverheadMap(): void {
  // If loaded, unload!
  if (gfSmTileLoaded) {
    // Unload
    DeleteOverheadDB();

    // Force load
    gfSmTileLoaded = false;
  }
}
