const CLOCK_X = 554;
const CLOCK_Y = 459;
let gOldClippingRect: SGPRect;
let gOldDirtyClippingRect: SGPRect;

let guiTacticalInterfaceFlags: UINT32;

let gusUICurIntTileEffectIndex: UINT16;
let gsUICurIntTileEffectGridNo: INT16;
let gsUICurIntTileOldShade: UINT8;

let gfRerenderInterfaceFromHelpText: BOOLEAN = FALSE;

let gLockPanelOverlayRegion: MOUSE_REGION;

let gfPausedTacticalRenderInterfaceFlags: BOOLEAN = FALSE;
let gfPausedTacticalRenderFlags: BOOLEAN = FALSE;

function SetTacticalInterfaceFlags(uiFlags: UINT32): void {
  guiTacticalInterfaceFlags = uiFlags;
}

function HandleTacticalPanelSwitch(): void {
  if (gfSwitchPanel) {
    SetCurrentInterfacePanel(gbNewPanel);
    SetCurrentTacticalPanelCurrentMerc(gubNewPanelParam);
    gfSwitchPanel = FALSE;

    if ((!guiTacticalInterfaceFlags & INTERFACE_NORENDERBUTTONS) && !(guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE)) {
      RenderButtons();
    }
  }
}

function RenderTacticalInterface(): void {
  // handle paused render of tactical
  HandlePausedTacticalRender();

  if (!(guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    HandleFlashingItems();

    HandleMultiPurposeLocator();
  }

  // Handle degrading new items...
  DegradeNewlyAddedItems();

  switch (gsCurInterfacePanel) {
    case Enum215.SM_PANEL:
      RenderSMPanel(addressof(fInterfacePanelDirty));
      break;

    case Enum215.TEAM_PANEL:
      RenderTEAMPanel(fInterfacePanelDirty);
      break;
  }

  // Handle faces
  if (!(guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE))
    HandleAutoFaces();
}

function HandlePausedTacticalRender(): void {
  // for a one frame paused render of tactical
  if (gfPausedTacticalRenderFlags) {
    gRenderFlags |= gfPausedTacticalRenderFlags;
    gfPausedTacticalRenderFlags = FALSE;
  }

  if (gfPausedTacticalRenderInterfaceFlags) {
    fInterfacePanelDirty = gfPausedTacticalRenderInterfaceFlags;
    gfPausedTacticalRenderInterfaceFlags = FALSE;
  }

  return;
}

function RenderTacticalInterfaceWhileScrolling(): void {
  RenderButtons();

  switch (gsCurInterfacePanel) {
    case Enum215.SM_PANEL:
      RenderSMPanel(addressof(fInterfacePanelDirty));
      break;

    case Enum215.TEAM_PANEL:
      RenderTEAMPanel(fInterfacePanelDirty);
      break;
  }

  // Handle faces
  HandleAutoFaces();
}

function SetUpInterface(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pIntTile: Pointer<LEVELNODE>;

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    return;
  }

  DrawUICursor();

  SetupPhysicsTrajectoryUI();

  if (giUIMessageOverlay != -1) {
    if ((GetJA2Clock() - guiUIMessageTime) > guiUIMessageTimeDelay) {
      EndUIMessage();
    }
  }

  if (gusSelectedSoldier != NO_SOLDIER) {
    GetSoldier(addressof(pSoldier), gusSelectedSoldier);
  }

  if (gCurrentUIMode == Enum206.OPENDOOR_MENU_MODE) {
    HandleOpenDoorMenu();
  }

  HandleTalkingMenu();

  if (gCurrentUIMode == Enum206.EXITSECTORMENU_MODE) {
    HandleSectorExitMenu();
  }

  // FOR THE MOST PART - SHUTDOWN INTERFACE WHEN IT'S THE ENEMY'S TURN
  if (gTacticalStatus.ubCurrentTeam != gbPlayerNum) {
    return;
  }

  HandleInterfaceBackgrounds();

  if (gfUIHandleSelection == NONSELECTED_GUY_SELECTION) {
    if (gsSelectedLevel > 0) {
      AddRoofToHead(gsSelectedGridNo, Enum312.GOODRING1);
      gpWorldLevelData[gsSelectedGridNo].pRoofHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      gpWorldLevelData[gsSelectedGridNo].pRoofHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    } else {
      AddObjectToHead(gsSelectedGridNo, Enum312.GOODRING1);
      gpWorldLevelData[gsSelectedGridNo].pObjectHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      gpWorldLevelData[gsSelectedGridNo].pObjectHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    }
  }

  if (gfUIHandleSelection == SELECTED_GUY_SELECTION) {
    if (gsSelectedLevel > 0) {
      // AddRoofToHead( gsSelectedGridNo, SELRING1 );
      AddRoofToHead(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      gpWorldLevelData[gsSelectedGridNo].pRoofHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      gpWorldLevelData[gsSelectedGridNo].pRoofHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    } else {
      // AddObjectToHead( gsSelectedGridNo, SELRING1 );
      AddObjectToHead(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      gpWorldLevelData[gsSelectedGridNo].pObjectHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      gpWorldLevelData[gsSelectedGridNo].pObjectHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    }
  }

  if (gfUIHandleSelection == ENEMY_GUY_SELECTION) {
    if (gsSelectedLevel > 0) {
      AddRoofToHead(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      gpWorldLevelData[gsSelectedGridNo].pRoofHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      gpWorldLevelData[gsSelectedGridNo].pRoofHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    } else {
      AddObjectToHead(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      gpWorldLevelData[gsSelectedGridNo].pObjectHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
      gpWorldLevelData[gsSelectedGridNo].pObjectHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    }
  }

  if (gfUIHandleShowMoveGrid) {
    if (gusSelectedSoldier != NOBODY) {
      if (MercPtrs[gusSelectedSoldier].value.sGridNo != gsUIHandleShowMoveGridLocation) {
        if (gfUIHandleShowMoveGrid == 2) {
          AddTopmostToHead(gsUIHandleShowMoveGridLocation, GetSnapCursorIndex(Enum312.FIRSTPOINTERS4));
          gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
          gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
        } else {
          if (MercPtrs[gusSelectedSoldier].value.bStealthMode) {
            AddTopmostToHead(gsUIHandleShowMoveGridLocation, GetSnapCursorIndex(Enum312.FIRSTPOINTERS9));
            gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          } else {
            AddTopmostToHead(gsUIHandleShowMoveGridLocation, GetSnapCursorIndex(Enum312.FIRSTPOINTERS2));
            gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead.value.ubShadeLevel = DEFAULT_SHADE_LEVEL;
            gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead.value.ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          }
        }
      }
    }
  }

  // Check if we are over an interactive tile...
  if (gfUIShowCurIntTile) {
    pIntTile = GetCurInteractiveTileGridNo(addressof(gsUICurIntTileEffectGridNo));

    if (pIntTile != NULL) {
      gusUICurIntTileEffectIndex = pIntTile.value.usIndex;

      // Shade green
      gsUICurIntTileOldShade = pIntTile.value.ubShadeLevel;
      pIntTile.value.ubShadeLevel = 0;
      pIntTile.value.uiFlags |= LEVELNODE_DYNAMIC;
    }
  }
}

function ResetInterface(): void {
  let pNode: Pointer<LEVELNODE>;

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    return;
  }

  // find out if we need to show any menus
  DetermineWhichAssignmentMenusCanBeShown();
  CreateDestroyAssignmentPopUpBoxes();

  HideUICursor();

  ResetPhysicsTrajectoryUI();

  if (gfUIHandleSelection) {
    if (gsSelectedLevel > 0) {
      RemoveRoof(gsSelectedGridNo, Enum312.GOODRING1);
      RemoveRoof(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
    } else {
      RemoveObject(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      RemoveObject(gsSelectedGridNo, Enum312.GOODRING1);
    }
  }

  if (gfUIHandleShowMoveGrid) {
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS4);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS9);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS2);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS13);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS15);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS19);
    RemoveTopmost(gsUIHandleShowMoveGridLocation, Enum312.FIRSTPOINTERS20);
  }

  if (fInterfacePanelDirty) {
    fInterfacePanelDirty = FALSE;
  }

  // Reset int tile cursor stuff
  if (gfUIShowCurIntTile) {
    if (gsUICurIntTileEffectGridNo != NOWHERE) {
      // Find our tile!
      pNode = gpWorldLevelData[gsUICurIntTileEffectGridNo].pStructHead;

      while (pNode != NULL) {
        if (pNode.value.usIndex == gusUICurIntTileEffectIndex) {
          pNode.value.ubShadeLevel = gsUICurIntTileOldShade;
          pNode.value.uiFlags &= (~LEVELNODE_DYNAMIC);
          break;
        }

        pNode = pNode.value.pNext;
      }
    }
  }
}

let guiColors: UINT32[] /* [12] */ = [
  FROMRGB(198, 163, 0),
  FROMRGB(185, 150, 0),
  FROMRGB(172, 136, 0),
  FROMRGB(159, 123, 0),
  FROMRGB(146, 110, 0),
  FROMRGB(133, 96, 0),
  FROMRGB(120, 83, 0),
  FROMRGB(133, 96, 0),
  FROMRGB(146, 110, 0),
  FROMRGB(159, 123, 0),
  FROMRGB(172, 136, 0),
  FROMRGB(185, 150, 0),
];

function RenderRubberBanding(): void {
  let usLineColor: UINT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let iLeft: INT16;
  let iRight: INT16;
  let iTop: INT16;
  let iBottom: INT16;
  let iBack: INT32 = -1;
  /* static */ let iFlashColor: INT32 = 0;
  /* static */ let uiTimeOfLastUpdate: INT32 = 0;

  if (!gRubberBandActive)
    return;

  iLeft = gRubberBandRect.iLeft;
  iRight = gRubberBandRect.iRight;
  iTop = gRubberBandRect.iTop;
  iBottom = gRubberBandRect.iBottom;

  if (iLeft == iRight && iTop == iBottom) {
    return;
  }

  if ((GetJA2Clock() - uiTimeOfLastUpdate) > 60) {
    uiTimeOfLastUpdate = GetJA2Clock();
    iFlashColor++;

    if (iFlashColor == 12) {
      iFlashColor = 0;
    }
  }

  // Draw rectangle.....
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y);

  usLineColor = Get16BPPColor(guiColors[iFlashColor]);

  if ((iRight - iLeft) > 0) {
    LineDraw(TRUE, iLeft, iTop, iRight, iTop, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, iLeft, iTop, (iRight + 1), (iTop + 1));
  } else if ((iRight - iLeft) < 0) {
    LineDraw(TRUE, iLeft, iTop, iRight, iTop, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, iRight, iTop, (iLeft + 1), (iTop + 1));
  }

  if (iBack != -1) {
    SetBackgroundRectFilled(iBack);
  }

  iBack = -1;

  if ((iRight - iLeft) > 0) {
    LineDraw(TRUE, iLeft, iBottom, iRight, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, iLeft, iBottom, (iRight + 1), (iBottom + 1));
  } else if ((iRight - iLeft) < 0) {
    LineDraw(TRUE, iLeft, iBottom, iRight, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, iRight, iBottom, (iLeft + 1), (iBottom + 1));
  }

  if (iBack != -1) {
    SetBackgroundRectFilled(iBack);
  }

  iBack = -1;

  if ((iBottom - iTop) > 0) {
    LineDraw(TRUE, iLeft, iTop, iLeft, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, iLeft, iTop, (iLeft + 1), iBottom);
  } else if ((iBottom - iTop) < 0) {
    LineDraw(TRUE, iLeft, iTop, iLeft, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, iLeft, iBottom, (iLeft + 1), iTop);
  }

  if (iBack != -1) {
    SetBackgroundRectFilled(iBack);
  }

  iBack = -1;

  if ((iBottom - iTop) > 0) {
    LineDraw(TRUE, iRight, iTop, iRight, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, iRight, iTop, (iRight + 1), iBottom);
  } else if ((iBottom - iTop) < 0) {
    LineDraw(TRUE, iRight, iTop, iRight, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, iRight, iBottom, (iRight + 1), iTop);
  }

  if (iBack != -1) {
    SetBackgroundRectFilled(iBack);
  }

  UnLockVideoSurface(FRAME_BUFFER);
}

function RenderTopmostTacticalInterface(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: UINT32;
  /* static */ let uiBogTarget: UINT32 = 0;
  let VObjectDesc: VOBJECT_DESC;
  let sX: INT16;
  let sY: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let sTempY_S: INT16;
  let sTempX_S: INT16;
  let usMapPos: UINT16;
  let pItemPool: Pointer<ITEM_POOL>;

  if (gfRerenderInterfaceFromHelpText == TRUE) {
    fInterfacePanelDirty = DIRTYLEVEL2;

    switch (gsCurInterfacePanel) {
      case Enum215.SM_PANEL:
        RenderSMPanel(addressof(fInterfacePanelDirty));
        break;

      case Enum215.TEAM_PANEL:
        RenderTEAMPanel(fInterfacePanelDirty);
        break;
    }
    gfRerenderInterfaceFromHelpText = FALSE;
  }

  if ((guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN)) {
    if (!(guiTacticalInterfaceFlags & INTERFACE_NORENDERBUTTONS)) {
      // If we want to rederaw whole screen, dirty all buttons!
      if (fInterfacePanelDirty == DIRTYLEVEL2) {
        MarkButtonsDirty();
      }

      RenderButtons();
    }

    return;
  }

  if (InItemStackPopup()) {
    if (fInterfacePanelDirty == DIRTYLEVEL2) {
      RenderItemStackPopup(TRUE);
    } else {
      RenderItemStackPopup(FALSE);
    }
  }

  if ((InKeyRingPopup()) && (!InItemDescriptionBox())) {
    RenderKeyRingPopup((fInterfacePanelDirty == DIRTYLEVEL2));
  }

  if (gfInMovementMenu) {
    RenderMovementMenu();
  }

  // if IN PLAN MODE AND WE HAVE TARGETS, draw black targets!
  if (InUIPlanMode()) {
    // Zero out any planned soldiers
    for (cnt = MAX_NUM_SOLDIERS; cnt < TOTAL_SOLDIERS; cnt++) {
      if (MercPtrs[cnt].value.bActive) {
        if (MercPtrs[cnt].value.sPlannedTargetX != -1) {
          // Blit bogus target
          if (uiBogTarget == 0) {
            // Loadup cursor!
            VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
            FilenameForBPP("CURSORS\\targblak.sti", VObjectDesc.ImageFile);
            AddVideoObject(addressof(VObjectDesc), addressof(uiBogTarget));
          }

          if (GridNoOnScreen(MAPROWCOLTOPOS((MercPtrs[cnt].value.sPlannedTargetY / CELL_Y_SIZE), (MercPtrs[cnt].value.sPlannedTargetX / CELL_X_SIZE)))) {
            // GET SCREEN COORDINATES
            sOffsetX = (MercPtrs[cnt].value.sPlannedTargetX - gsRenderCenterX);
            sOffsetY = (MercPtrs[cnt].value.sPlannedTargetY - gsRenderCenterY);

            FromCellToScreenCoordinates(sOffsetX, sOffsetY, addressof(sTempX_S), addressof(sTempY_S));

            sX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + sTempX_S;
            sY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + sTempY_S;

            // Adjust for offset position on screen
            sX -= gsRenderWorldOffsetX;
            sY -= gsRenderWorldOffsetY;

            sX -= 10;
            sY -= 10;

            BltVideoObjectFromIndex(FRAME_BUFFER, uiBogTarget, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, NULL);
            InvalidateRegion(sX, sY, sX + 20, sY + 20);
          }
        }
      }
    }
  }

  if (gfUIInDeadlock) {
    SetFont(LARGEFONT1);
    SetFontBackground(FONT_MCOLOR_BLACK);
    SetFontForeground(FONT_MCOLOR_WHITE);
    gprintfdirty(0, 300, "OPPONENT %d DEADLOCKED - 'Q' TO DEBUG, <ALT><ENTER> END OPP TURN", gUIDeadlockedSoldier);
    mprintf(0, 300, "OPPONENT %d DEADLOCKED - 'Q' TO DEBUG, <ALT><ENTER> END OPP TURN", gUIDeadlockedSoldier);
  }

  // Syncronize for upcoming soldier counters
  SYNCTIMECOUNTER();

  // Setup system for video overlay ( text and blitting ) Sets clipping rects, etc
  StartViewportOverlays();

  RenderTopmostFlashingItems();

  RenderTopmostMultiPurposeLocator();

  RenderAccumulatedBurstLocations();

  // Loop through all mercs and make go
  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    if (pSoldier != NULL) {
      if (pSoldier.value.ubID == gsSelectedGuy && gfUIHandleSelectionAboveGuy) {
      } else {
        DrawSelectedUIAboveGuy(pSoldier.value.ubID);
      }

      if (pSoldier.value.fDisplayDamage) {
        // Display damage

        // Use world coordinates!
        let sMercScreenX: INT16;
        let sMercScreenY: INT16;
        let sOffsetX: INT16;
        let sOffsetY: INT16;
        let sDamageX: INT16;
        let sDamageY: INT16;

        if (pSoldier.value.sGridNo != NOWHERE && pSoldier.value.bVisible != -1) {
          GetSoldierScreenPos(pSoldier, addressof(sMercScreenX), addressof(sMercScreenY));
          GetSoldierAnimOffsets(pSoldier, addressof(sOffsetX), addressof(sOffsetY));

          if (pSoldier.value.ubBodyType == Enum194.QUEENMONSTER) {
            sDamageX = sMercScreenX + pSoldier.value.sDamageX - pSoldier.value.sBoundingBoxOffsetX;
            sDamageY = sMercScreenY + pSoldier.value.sDamageY - pSoldier.value.sBoundingBoxOffsetY;

            sDamageX += 25;
            sDamageY += 10;
          } else {
            sDamageX = pSoldier.value.sDamageX + (sMercScreenX + (2 * 30 / 3));
            sDamageY = pSoldier.value.sDamageY + (sMercScreenY - 5);

            sDamageX -= sOffsetX;
            sDamageY -= sOffsetY;

            if (sDamageY < gsVIEWPORT_WINDOW_START_Y) {
              sDamageY = (sMercScreenY - sOffsetY);
            }
          }

          SetFont(TINYFONT1);
          SetFontBackground(FONT_MCOLOR_BLACK);
          SetFontForeground(FONT_MCOLOR_WHITE);

          gprintfdirty(sDamageX, sDamageY, "-%d", pSoldier.value.sDamage);
          mprintf(sDamageX, sDamageY, "-%d", pSoldier.value.sDamage);
        }
      }
    }
  }

  if (gusSelectedSoldier != NOBODY) {
    DrawSelectedUIAboveGuy(gusSelectedSoldier);
  }

  if (gfUIHandleSelectionAboveGuy && gsSelectedGuy != NOBODY) {
    DrawSelectedUIAboveGuy(gsSelectedGuy);
  }

  // FOR THE MOST PART, DISABLE INTERFACE STUFF WHEN IT'S ENEMY'S TURN
  if (gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
    RenderArrows();
  }

  RenderAimCubeUI();

  EndViewportOverlays();

  RenderRubberBanding();

  if (!gfInItemPickupMenu && gpItemPointer == NULL) {
    HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), NULL, TRUE);
  }

  // CHECK IF OUR CURSOR IS OVER AN INV POOL
  if (GetMouseMapPos(addressof(usMapPos))) {
    if (gfUIOverItemPool) {
      if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
        // Check if we are over an item pool
        if (GetItemPool(gfUIOverItemPoolGridNo, addressof(pItemPool), pSoldier.value.bLevel)) {
          let pStructure: Pointer<STRUCTURE> = NULL;
          let sIntTileGridNo: INT16;
          let bZLevel: INT8 = 0;
          let sActionGridNo: INT16 = usMapPos;

          // Get interactive tile...
          if (ConditionalGetCurInteractiveTileGridNoAndStructure(addressof(sIntTileGridNo), addressof(pStructure), FALSE)) {
            sActionGridNo = sIntTileGridNo;
          }

          bZLevel = GetZLevelOfItemPoolGivenStructure(sActionGridNo, pSoldier.value.bLevel, pStructure);

          if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
            DrawItemPoolList(pItemPool, gfUIOverItemPoolGridNo, ITEMLIST_DISPLAY, bZLevel, gusMouseXPos, gusMouseYPos);

            // ATE: If over items, remove locator....
            RemoveFlashItemSlot(pItemPool);
          }
        } else {
          let bCheckLevel: INT8;

          // ATE: Allow to see list if a different level....
          if (pSoldier.value.bLevel == 0) {
            bCheckLevel = 1;
          } else {
            bCheckLevel = 0;
          }

          // Check if we are over an item pool
          if (GetItemPool(gfUIOverItemPoolGridNo, addressof(pItemPool), bCheckLevel)) {
            let pStructure: Pointer<STRUCTURE> = NULL;
            let sIntTileGridNo: INT16;
            let bZLevel: INT8 = 0;
            let sActionGridNo: INT16 = usMapPos;

            // Get interactive tile...
            if (ConditionalGetCurInteractiveTileGridNoAndStructure(addressof(sIntTileGridNo), addressof(pStructure), FALSE)) {
              sActionGridNo = sIntTileGridNo;
            }

            bZLevel = GetZLevelOfItemPoolGivenStructure(sActionGridNo, bCheckLevel, pStructure);

            if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
              DrawItemPoolList(pItemPool, gfUIOverItemPoolGridNo, ITEMLIST_DISPLAY, bZLevel, gusMouseXPos, gusMouseYPos);

              // ATE: If over items, remove locator....
              RemoveFlashItemSlot(pItemPool);
            }
          }
        }
      }
    }
  }

  // Check if we should render item selection window
  if (gCurrentUIMode == Enum206.GETTINGITEM_MODE) {
    SetItemPickupMenuDirty(DIRTYLEVEL2);
    // Handle item pickup will return true if it's been closed
    RenderItemPickupMenu();
  }

  // Check if we should render item selection window
  if (gCurrentUIMode == Enum206.OPENDOOR_MENU_MODE) {
    RenderOpenDoorMenu();
  }

  if (gfInTalkPanel) {
    SetTalkingMenuDirty(DIRTYLEVEL2);
    // Handle item pickup will return true if it's been closed
    RenderTalkingMenu();
  }

  if (gfInSectorExitMenu) {
    RenderSectorExitMenu();
  }

  if (fRenderRadarScreen == TRUE) {
    // Render clock
    RenderClock(CLOCK_X, CLOCK_Y);
    RenderTownIDString();
    CreateMouseRegionForPauseOfClock(CLOCK_REGION_START_X, CLOCK_REGION_START_Y);
  } else {
    RemoveMouseRegionForPauseOfClock();
  }

  if (!(guiTacticalInterfaceFlags & INTERFACE_NORENDERBUTTONS)) {
    // If we want to rederaw whole screen, dirty all buttons!
    if (fInterfacePanelDirty == DIRTYLEVEL2) {
      MarkButtonsDirty();
    }

    RenderButtons();
    RenderPausedGameBox();
  }

  // mark all pop ups as dirty
  MarkAllBoxesAsAltered();

  HandleShowingOfTacticalInterfaceFastHelpText();
  HandleShadingOfLinesForAssignmentMenus();
  DetermineBoxPositions();
  DisplayBoxes(FRAME_BUFFER);
}

function StartViewportOverlays(): void {
  // Set Clipping Rect to be the viewscreen
  // Save old one
  memcpy(addressof(gOldClippingRect), addressof(ClippingRect), sizeof(gOldClippingRect));

  // Save old dirty clipping rect
  memcpy(addressof(gOldDirtyClippingRect), addressof(ClippingRect), sizeof(gOldDirtyClippingRect));

  // Set bottom clipping value for blitter clipping rect
  ClippingRect.iLeft = INTERFACE_START_X;
  ClippingRect.iTop = gsVIEWPORT_WINDOW_START_Y;
  ClippingRect.iRight = 640;
  ClippingRect.iBottom = gsVIEWPORT_WINDOW_END_Y;

  // Set values for dirty rect clipping rect
  gDirtyClipRect.iLeft = INTERFACE_START_X;
  gDirtyClipRect.iTop = gsVIEWPORT_WINDOW_START_Y;
  gDirtyClipRect.iRight = 640;
  gDirtyClipRect.iBottom = gsVIEWPORT_WINDOW_END_Y;

  SaveFontSettings();
  SetFontDestBuffer(FRAME_BUFFER, 0, gsVIEWPORT_WINDOW_START_Y, 640, gsVIEWPORT_WINDOW_END_Y, FALSE);
}

function EndViewportOverlays(): void {
  // Reset clipping rect
  memcpy(addressof(ClippingRect), addressof(gOldClippingRect), sizeof(gOldClippingRect));
  memcpy(addressof(gDirtyClipRect), addressof(gOldDirtyClippingRect), sizeof(gOldDirtyClippingRect));
  RestoreFontSettings();
}

function LockTacticalInterface(): void {
  // OK, check and see if we are not locked, if so
  // 1) create a mouse region over the entrie interface panel
  // 2) set flag for use in tactical to indicate we are locked
  if (!(guiTacticalInterfaceFlags & INTERFACE_LOCKEDLEVEL1)) {
    MSYS_DefineRegion(addressof(gLockPanelOverlayRegion), 0, gsVIEWPORT_WINDOW_END_Y, 640, 480, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
    // Add region
    MSYS_AddRegion(addressof(gLockPanelOverlayRegion));

    guiTacticalInterfaceFlags |= INTERFACE_LOCKEDLEVEL1;
  }
}

function UnLockTacticalInterface(): void {
  if ((guiTacticalInterfaceFlags & INTERFACE_LOCKEDLEVEL1)) {
    // Remove region
    MSYS_RemoveRegion(addressof(gLockPanelOverlayRegion));

    guiTacticalInterfaceFlags &= (~INTERFACE_LOCKEDLEVEL1);
  }
}

function EraseInterfaceMenus(fIgnoreUIUnLock: BOOLEAN): void {
  // ATE: If we are currently talking, setup this flag so that the
  // automatic handler in handledialogue doesn't adjust the UI setting
  if ((gTacticalStatus.uiFlags & ENGAGED_IN_CONV) && fIgnoreUIUnLock) {
    gTacticalStatus.uiFlags |= IGNORE_ENGAGED_IN_CONV_UI_UNLOCK;
  }

  // Remove item pointer if one active
  CancelItemPointer();

  ShutDownQuoteBoxIfActive();
  PopDownMovementMenu();
  PopDownOpenDoorMenu();
  DeleteTalkingMenu();
}

function AreWeInAUIMenu(): BOOLEAN {
  if (gfInMovementMenu || gfInOpenDoorMenu || gfInItemPickupMenu || gfInSectorExitMenu || gfInTalkPanel) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function ResetInterfaceAndUI(): void {
  // Erase menus
  EraseInterfaceMenus(FALSE);

  EraseRenderArrows();

  EndRubberBanding();

  // ResetMultiSelection( );

  if (giUIMessageOverlay != -1) {
    RemoveVideoOverlay(giUIMessageOverlay);
    giUIMessageOverlay = -1;
  }

  // Set UI back to movement...
  guiPendingOverrideEvent = Enum207.M_ON_TERRAIN;
  HandleTacticalUI();
}

function InterfaceOKForMeanwhilePopup(): BOOLEAN {
  if (gfSwitchPanel) {
    return FALSE;
  }

  return TRUE;
}
