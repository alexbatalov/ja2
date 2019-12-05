namespace ja2 {

const CLOCK_X = 554;
const CLOCK_Y = 459;
let gOldClippingRect: SGPRect = createSGPRect();
let gOldDirtyClippingRect: SGPRect = createSGPRect();

export let guiTacticalInterfaceFlags: UINT32;

let gusUICurIntTileEffectIndex: UINT16;
let gsUICurIntTileEffectGridNo: INT16;
let gsUICurIntTileEffectGridNo__Pointer = createPointer(() => gsUICurIntTileEffectGridNo, (v) => gsUICurIntTileEffectGridNo = v);
let gsUICurIntTileOldShade: UINT8;

export let gfRerenderInterfaceFromHelpText: boolean = false;

let gLockPanelOverlayRegion: MOUSE_REGION = createMouseRegion();

export let gfPausedTacticalRenderInterfaceFlags: UINT8 /* boolean */ = 0;
export let gfPausedTacticalRenderFlags: boolean = false;

export function SetTacticalInterfaceFlags(uiFlags: UINT32): void {
  guiTacticalInterfaceFlags = uiFlags;
}

export function HandleTacticalPanelSwitch(): void {
  if (gfSwitchPanel) {
    SetCurrentInterfacePanel(gbNewPanel);
    SetCurrentTacticalPanelCurrentMerc(gubNewPanelParam);
    gfSwitchPanel = false;

    if (!(guiTacticalInterfaceFlags & INTERFACE_NORENDERBUTTONS) && !(guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE)) {
      RenderButtons();
    }
  }
}

export function RenderTacticalInterface(): void {
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
      RenderSMPanel(fInterfacePanelDirty__Pointer);
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
    gRenderFlags |= Number(gfPausedTacticalRenderFlags);
    gfPausedTacticalRenderFlags = false;
  }

  if (gfPausedTacticalRenderInterfaceFlags) {
    fInterfacePanelDirty = gfPausedTacticalRenderInterfaceFlags;
    gfPausedTacticalRenderInterfaceFlags = 0;
  }

  return;
}

export function RenderTacticalInterfaceWhileScrolling(): void {
  RenderButtons();

  switch (gsCurInterfacePanel) {
    case Enum215.SM_PANEL:
      RenderSMPanel(fInterfacePanelDirty__Pointer);
      break;

    case Enum215.TEAM_PANEL:
      RenderTEAMPanel(fInterfacePanelDirty);
      break;
  }

  // Handle faces
  HandleAutoFaces();
}

export function SetUpInterface(): void {
  let pSoldier: SOLDIERTYPE | null;
  let pIntTile: LEVELNODE | null;

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
    pSoldier = GetSoldier(gusSelectedSoldier);
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
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pRoofHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pRoofHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    } else {
      AddObjectToHead(gsSelectedGridNo, Enum312.GOODRING1);
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pObjectHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pObjectHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    }
  }

  if (gfUIHandleSelection == SELECTED_GUY_SELECTION) {
    if (gsSelectedLevel > 0) {
      // AddRoofToHead( gsSelectedGridNo, SELRING1 );
      AddRoofToHead(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pRoofHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pRoofHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    } else {
      // AddObjectToHead( gsSelectedGridNo, SELRING1 );
      AddObjectToHead(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pObjectHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pObjectHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    }
  }

  if (gfUIHandleSelection == ENEMY_GUY_SELECTION) {
    if (gsSelectedLevel > 0) {
      AddRoofToHead(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pRoofHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pRoofHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    } else {
      AddObjectToHead(gsSelectedGridNo, Enum312.FIRSTPOINTERS2);
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pObjectHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
      (<LEVELNODE>gpWorldLevelData[gsSelectedGridNo].pObjectHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
    }
  }

  if (gfUIHandleShowMoveGrid) {
    if (gusSelectedSoldier != NOBODY) {
      if (MercPtrs[gusSelectedSoldier].sGridNo != gsUIHandleShowMoveGridLocation) {
        if (gfUIHandleShowMoveGrid == 2) {
          AddTopmostToHead(gsUIHandleShowMoveGridLocation, GetSnapCursorIndex(Enum312.FIRSTPOINTERS4));
          (<LEVELNODE>gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
          (<LEVELNODE>gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
        } else {
          if (MercPtrs[gusSelectedSoldier].bStealthMode) {
            AddTopmostToHead(gsUIHandleShowMoveGridLocation, GetSnapCursorIndex(Enum312.FIRSTPOINTERS9));
            (<LEVELNODE>gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
            (<LEVELNODE>gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          } else {
            AddTopmostToHead(gsUIHandleShowMoveGridLocation, GetSnapCursorIndex(Enum312.FIRSTPOINTERS2));
            (<LEVELNODE>gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead).ubShadeLevel = DEFAULT_SHADE_LEVEL;
            (<LEVELNODE>gpWorldLevelData[gsUIHandleShowMoveGridLocation].pTopmostHead).ubNaturalShadeLevel = DEFAULT_SHADE_LEVEL;
          }
        }
      }
    }
  }

  // Check if we are over an interactive tile...
  if (gfUIShowCurIntTile) {
    pIntTile = GetCurInteractiveTileGridNo(gsUICurIntTileEffectGridNo__Pointer);

    if (pIntTile != null) {
      gusUICurIntTileEffectIndex = pIntTile.usIndex;

      // Shade green
      gsUICurIntTileOldShade = pIntTile.ubShadeLevel;
      pIntTile.ubShadeLevel = 0;
      pIntTile.uiFlags |= LEVELNODE_DYNAMIC;
    }
  }
}

export function ResetInterface(): void {
  let pNode: LEVELNODE | null;

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
    fInterfacePanelDirty = 0;
  }

  // Reset int tile cursor stuff
  if (gfUIShowCurIntTile) {
    if (gsUICurIntTileEffectGridNo != NOWHERE) {
      // Find our tile!
      pNode = gpWorldLevelData[gsUICurIntTileEffectGridNo].pStructHead;

      while (pNode != null) {
        if (pNode.usIndex == gusUICurIntTileEffectIndex) {
          pNode.ubShadeLevel = gsUICurIntTileOldShade;
          pNode.uiFlags &= (~LEVELNODE_DYNAMIC);
          break;
        }

        pNode = pNode.pNext;
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

/* static */ let RenderRubberBanding__iFlashColor: INT32 = 0;
/* static */ let RenderRubberBanding__uiTimeOfLastUpdate: INT32 = 0;
function RenderRubberBanding(): void {
  let usLineColor: UINT16;
  let uiDestPitchBYTES: UINT32;
  let pDestBuf: Pointer<UINT8>;
  let iLeft: INT16;
  let iRight: INT16;
  let iTop: INT16;
  let iBottom: INT16;
  let iBack: INT32 = -1;

  if (!gRubberBandActive)
    return;

  iLeft = gRubberBandRect.iLeft;
  iRight = gRubberBandRect.iRight;
  iTop = gRubberBandRect.iTop;
  iBottom = gRubberBandRect.iBottom;

  if (iLeft == iRight && iTop == iBottom) {
    return;
  }

  if ((GetJA2Clock() - RenderRubberBanding__uiTimeOfLastUpdate) > 60) {
    RenderRubberBanding__uiTimeOfLastUpdate = GetJA2Clock();
    RenderRubberBanding__iFlashColor++;

    if (RenderRubberBanding__iFlashColor == 12) {
      RenderRubberBanding__iFlashColor = 0;
    }
  }

  // Draw rectangle.....
  pDestBuf = LockVideoSurface(FRAME_BUFFER, addressof(uiDestPitchBYTES));
  SetClippingRegionAndImageWidth(uiDestPitchBYTES, 0, 0, gsVIEWPORT_END_X, gsVIEWPORT_WINDOW_END_Y);

  usLineColor = Get16BPPColor(guiColors[RenderRubberBanding__iFlashColor]);

  if ((iRight - iLeft) > 0) {
    LineDraw(true, iLeft, iTop, iRight, iTop, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, iLeft, iTop, (iRight + 1), (iTop + 1));
  } else if ((iRight - iLeft) < 0) {
    LineDraw(true, iLeft, iTop, iRight, iTop, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, iRight, iTop, (iLeft + 1), (iTop + 1));
  }

  if (iBack != -1) {
    SetBackgroundRectFilled(iBack);
  }

  iBack = -1;

  if ((iRight - iLeft) > 0) {
    LineDraw(true, iLeft, iBottom, iRight, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, iLeft, iBottom, (iRight + 1), (iBottom + 1));
  } else if ((iRight - iLeft) < 0) {
    LineDraw(true, iLeft, iBottom, iRight, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, iRight, iBottom, (iLeft + 1), (iBottom + 1));
  }

  if (iBack != -1) {
    SetBackgroundRectFilled(iBack);
  }

  iBack = -1;

  if ((iBottom - iTop) > 0) {
    LineDraw(true, iLeft, iTop, iLeft, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, iLeft, iTop, (iLeft + 1), iBottom);
  } else if ((iBottom - iTop) < 0) {
    LineDraw(true, iLeft, iTop, iLeft, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, iLeft, iBottom, (iLeft + 1), iTop);
  }

  if (iBack != -1) {
    SetBackgroundRectFilled(iBack);
  }

  iBack = -1;

  if ((iBottom - iTop) > 0) {
    LineDraw(true, iRight, iTop, iRight, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, iRight, iTop, (iRight + 1), iBottom);
  } else if ((iBottom - iTop) < 0) {
    LineDraw(true, iRight, iTop, iRight, iBottom, usLineColor, pDestBuf);
    iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, iRight, iBottom, (iRight + 1), iTop);
  }

  if (iBack != -1) {
    SetBackgroundRectFilled(iBack);
  }

  UnLockVideoSurface(FRAME_BUFFER);
}

/* static */ let RenderTopmostTacticalInterface__uiBogTarget: UINT32 = 0;
export function RenderTopmostTacticalInterface(): void {
  let pSoldier: SOLDIERTYPE | null;
  let cnt: UINT32;
  let VObjectDesc: VOBJECT_DESC = createVObjectDesc();
  let sX: INT16;
  let sY: INT16;
  let sOffsetX: INT16;
  let sOffsetY: INT16;
  let sTempY_S: INT16;
  let sTempX_S: INT16;
  let usMapPos: UINT16 = 0;
  let pItemPool: ITEM_POOL | null;

  if (gfRerenderInterfaceFromHelpText == true) {
    fInterfacePanelDirty = DIRTYLEVEL2;

    switch (gsCurInterfacePanel) {
      case Enum215.SM_PANEL:
        RenderSMPanel(fInterfacePanelDirty__Pointer);
        break;

      case Enum215.TEAM_PANEL:
        RenderTEAMPanel(fInterfacePanelDirty);
        break;
    }
    gfRerenderInterfaceFromHelpText = false;
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
      RenderItemStackPopup(true);
    } else {
      RenderItemStackPopup(false);
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
      if (MercPtrs[cnt].bActive) {
        if (MercPtrs[cnt].sPlannedTargetX != -1) {
          // Blit bogus target
          if (RenderTopmostTacticalInterface__uiBogTarget == 0) {
            // Loadup cursor!
            VObjectDesc.fCreateFlags = VOBJECT_CREATE_FROMFILE;
            VObjectDesc.ImageFile = FilenameForBPP("CURSORS\\targblak.sti");
            RenderTopmostTacticalInterface__uiBogTarget = AddVideoObject(VObjectDesc);
          }

          if (GridNoOnScreen(MAPROWCOLTOPOS((MercPtrs[cnt].sPlannedTargetY / CELL_Y_SIZE), (MercPtrs[cnt].sPlannedTargetX / CELL_X_SIZE)))) {
            // GET SCREEN COORDINATES
            sOffsetX = (MercPtrs[cnt].sPlannedTargetX - gsRenderCenterX);
            sOffsetY = (MercPtrs[cnt].sPlannedTargetY - gsRenderCenterY);

            ({ sScreenX: sTempX_S, sScreenY: sTempY_S } = FromCellToScreenCoordinates(sOffsetX, sOffsetY));

            sX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + sTempX_S;
            sY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + sTempY_S;

            // Adjust for offset position on screen
            sX -= gsRenderWorldOffsetX;
            sY -= gsRenderWorldOffsetY;

            sX -= 10;
            sY -= 10;

            BltVideoObjectFromIndex(FRAME_BUFFER, RenderTopmostTacticalInterface__uiBogTarget, 0, sX, sY, VO_BLT_SRCTRANSPARENCY, null);
            InvalidateRegion(sX, sY, sX + 20, sY + 20);
          }
        }
      }
    }
  }

  if (gfUIInDeadlock) {
    SetFont(LARGEFONT1());
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

    if (pSoldier != null) {
      if (pSoldier.ubID == gsSelectedGuy && gfUIHandleSelectionAboveGuy) {
      } else {
        DrawSelectedUIAboveGuy(pSoldier.ubID);
      }

      if (pSoldier.fDisplayDamage) {
        // Display damage

        // Use world coordinates!
        let sMercScreenX: INT16;
        let sMercScreenY: INT16;
        let sOffsetX: INT16;
        let sOffsetY: INT16;
        let sDamageX: INT16;
        let sDamageY: INT16;

        if (pSoldier.sGridNo != NOWHERE && pSoldier.bVisible != -1) {
          ({ sScreenX: sMercScreenX, sScreenY: sMercScreenY } = GetSoldierScreenPos(pSoldier));
          ({ sOffsetX, sOffsetY } = GetSoldierAnimOffsets(pSoldier));

          if (pSoldier.ubBodyType == Enum194.QUEENMONSTER) {
            sDamageX = sMercScreenX + pSoldier.sDamageX - pSoldier.sBoundingBoxOffsetX;
            sDamageY = sMercScreenY + pSoldier.sDamageY - pSoldier.sBoundingBoxOffsetY;

            sDamageX += 25;
            sDamageY += 10;
          } else {
            sDamageX = pSoldier.sDamageX + (sMercScreenX + (2 * 30 / 3));
            sDamageY = pSoldier.sDamageY + (sMercScreenY - 5);

            sDamageX -= sOffsetX;
            sDamageY -= sOffsetY;

            if (sDamageY < gsVIEWPORT_WINDOW_START_Y) {
              sDamageY = (sMercScreenY - sOffsetY);
            }
          }

          SetFont(TINYFONT1());
          SetFontBackground(FONT_MCOLOR_BLACK);
          SetFontForeground(FONT_MCOLOR_WHITE);

          gprintfdirty(sDamageX, sDamageY, "-%d", pSoldier.sDamage);
          mprintf(sDamageX, sDamageY, "-%d", pSoldier.sDamage);
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

  if (!gfInItemPickupMenu && gpItemPointer == null) {
    HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), null, true);
  }

  // CHECK IF OUR CURSOR IS OVER AN INV POOL
  if (GetMouseMapPos(createPointer(() => usMapPos, (v) => usMapPos = v))) {
    if (gfUIOverItemPool) {
      if ((pSoldier = GetSoldier(gusSelectedSoldier)) !== null) {
        // Check if we are over an item pool
        if ((pItemPool = GetItemPool(gfUIOverItemPoolGridNo, pSoldier.bLevel))) {
          let pStructure: STRUCTURE | null = null;
          let sIntTileGridNo: INT16 = 0;
          let bZLevel: INT8 = 0;
          let sActionGridNo: INT16 = usMapPos;

          // Get interactive tile...
          if (ConditionalGetCurInteractiveTileGridNoAndStructure(createPointer(() => sIntTileGridNo, (v) => sIntTileGridNo = v), createPointer(() => pStructure, (v) => pStructure = v), false)) {
            sActionGridNo = sIntTileGridNo;
          }

          bZLevel = GetZLevelOfItemPoolGivenStructure(sActionGridNo, pSoldier.bLevel, pStructure);

          if (AnyItemsVisibleOnLevel(pItemPool, bZLevel)) {
            DrawItemPoolList(pItemPool, gfUIOverItemPoolGridNo, ITEMLIST_DISPLAY, bZLevel, gusMouseXPos, gusMouseYPos);

            // ATE: If over items, remove locator....
            RemoveFlashItemSlot(pItemPool);
          }
        } else {
          let bCheckLevel: INT8;

          // ATE: Allow to see list if a different level....
          if (pSoldier.bLevel == 0) {
            bCheckLevel = 1;
          } else {
            bCheckLevel = 0;
          }

          // Check if we are over an item pool
          if ((pItemPool = GetItemPool(gfUIOverItemPoolGridNo, bCheckLevel))) {
            let pStructure: STRUCTURE | null = null;
            let sIntTileGridNo: INT16 = 0;
            let bZLevel: INT8 = 0;
            let sActionGridNo: INT16 = usMapPos;

            // Get interactive tile...
            if (ConditionalGetCurInteractiveTileGridNoAndStructure(createPointer(() => sIntTileGridNo, (v) => sIntTileGridNo = v), createPointer(() => pStructure, (v) => pStructure = v), false)) {
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

  if (fRenderRadarScreen == true) {
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
  copySGPRect(gOldClippingRect, ClippingRect);

  // Save old dirty clipping rect
  copySGPRect(gOldDirtyClippingRect, ClippingRect);

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
  SetFontDestBuffer(FRAME_BUFFER, 0, gsVIEWPORT_WINDOW_START_Y, 640, gsVIEWPORT_WINDOW_END_Y, false);
}

function EndViewportOverlays(): void {
  // Reset clipping rect
  copySGPRect(ClippingRect, gOldClippingRect);
  copySGPRect(gDirtyClipRect, gOldDirtyClippingRect);
  RestoreFontSettings();
}

function LockTacticalInterface(): void {
  // OK, check and see if we are not locked, if so
  // 1) create a mouse region over the entrie interface panel
  // 2) set flag for use in tactical to indicate we are locked
  if (!(guiTacticalInterfaceFlags & INTERFACE_LOCKEDLEVEL1)) {
    MSYS_DefineRegion(gLockPanelOverlayRegion, 0, gsVIEWPORT_WINDOW_END_Y, 640, 480, MSYS_PRIORITY_HIGHEST, Enum317.CURSOR_NORMAL, MSYS_NO_CALLBACK, MSYS_NO_CALLBACK);
    // Add region
    MSYS_AddRegion(gLockPanelOverlayRegion);

    guiTacticalInterfaceFlags |= INTERFACE_LOCKEDLEVEL1;
  }
}

function UnLockTacticalInterface(): void {
  if ((guiTacticalInterfaceFlags & INTERFACE_LOCKEDLEVEL1)) {
    // Remove region
    MSYS_RemoveRegion(gLockPanelOverlayRegion);

    guiTacticalInterfaceFlags &= (~INTERFACE_LOCKEDLEVEL1);
  }
}

export function EraseInterfaceMenus(fIgnoreUIUnLock: boolean): void {
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

export function AreWeInAUIMenu(): boolean {
  if (gfInMovementMenu || gfInOpenDoorMenu || gfInItemPickupMenu || gfInSectorExitMenu || gfInTalkPanel) {
    return true;
  } else {
    return false;
  }
}

export function ResetInterfaceAndUI(): void {
  // Erase menus
  EraseInterfaceMenus(false);

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

export function InterfaceOKForMeanwhilePopup(): boolean {
  if (gfSwitchPanel) {
    return false;
  }

  return true;
}

}
