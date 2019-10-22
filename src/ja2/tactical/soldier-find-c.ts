// This value is used to keep a small static array of uBID's which are stacked
const MAX_STACKED_MERCS = 10;

let gScrollSlideInertiaDirection: UINT32[] /* [NUM_WORLD_DIRECTIONS] */ = [
  3,
  0,
  0,
  0,
  0,
  0,
  3,
  3,
];

// Struct used for cycling through multiple mercs per mouse position
interface SOLDIER_STACK_TYPE {
  bNum: INT8;
  ubIDs: UINT8[] /* [MAX_STACKED_MERCS] */;
  bCur: INT8;
  fUseGridNo: BOOLEAN;
  sUseGridNoGridNo: UINT16;
}

let gSoldierStack: SOLDIER_STACK_TYPE;
let gfHandleStack: BOOLEAN = FALSE;

function FindSoldierFromMouse(pusSoldierIndex: Pointer<UINT16>, pMercFlags: Pointer<UINT32>): BOOLEAN {
  let sMapPos: INT16;

  *pMercFlags = 0;

  if (GetMouseMapPos(addressof(sMapPos))) {
    if (FindSoldier(sMapPos, pusSoldierIndex, pMercFlags, FINDSOLDIERSAMELEVEL(gsInterfaceLevel))) {
      return TRUE;
    }
  }

  return FALSE;
}

function SelectiveFindSoldierFromMouse(pusSoldierIndex: Pointer<UINT16>, pMercFlags: Pointer<UINT32>): BOOLEAN {
  let sMapPos: INT16;

  *pMercFlags = 0;

  if (GetMouseMapPos(addressof(sMapPos))) {
    if (FindSoldier(sMapPos, pusSoldierIndex, pMercFlags, FINDSOLDIERSAMELEVEL(gsInterfaceLevel))) {
      return TRUE;
    }
  }

  return FALSE;
}

function GetSoldierFindFlags(ubID: UINT16): UINT32 {
  let MercFlags: UINT32 = 0;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Get pSoldier!
  pSoldier = MercPtrs[ubID];

  // FInd out and set flags
  if (ubID == gusSelectedSoldier) {
    MercFlags |= SELECTED_MERC;
  }
  if (ubID >= gTacticalStatus.Team[gbPlayerNum].bFirstID && ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID) {
    if ((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !GetNumberInVehicle(pSoldier.value.bVehicleID)) {
      // Don't do anything!
    } else {
      // It's our own merc
      MercFlags |= OWNED_MERC;

      if (pSoldier.value.bAssignment < ON_DUTY) {
        MercFlags |= ONDUTY_MERC;
      }
    }
  } else {
    // Check the side, etc
    if (!pSoldier.value.bNeutral && (pSoldier.value.bSide != gbPlayerNum)) {
      // It's an enemy merc
      MercFlags |= ENEMY_MERC;
    } else {
      // It's not an enemy merc
      MercFlags |= NEUTRAL_MERC;
    }
  }

  // Check for a guy who does not have an iterrupt ( when applicable! )
  if (!OK_INTERRUPT_MERC(pSoldier)) {
    MercFlags |= NOINTERRUPT_MERC;
  }

  if (pSoldier.value.bLife < OKLIFE) {
    MercFlags |= UNCONSCIOUS_MERC;
  }

  if (pSoldier.value.bLife == 0) {
    MercFlags |= DEAD_MERC;
  }

  if (pSoldier.value.bVisible != -1 || (gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
    MercFlags |= VISIBLE_MERC;
  }

  return MercFlags;
}

// THIS FUNCTION IS CALLED FAIRLY REGULARLY
function FindSoldier(sGridNo: INT16, pusSoldierIndex: Pointer<UINT16>, pMercFlags: Pointer<UINT32>, uiFlags: UINT32): BOOLEAN {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let aRect: SGPRect;
  let fSoldierFound: BOOLEAN = FALSE;
  let sXMapPos: INT16;
  let sYMapPos: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let sMaxScreenMercY: INT16;
  let sHeighestMercScreenY: INT16 = -32000;
  let fDoFull: BOOLEAN;
  let ubBestMerc: UINT8 = NOBODY;
  let usAnimSurface: UINT16;
  let iMercScreenX: INT32;
  let iMercScreenY: INT32;
  let fInScreenRect: BOOLEAN = FALSE;
  let fInGridNo: BOOLEAN = FALSE;

  *pusSoldierIndex = NOBODY;
  *pMercFlags = 0;

  if (_KeyDown(SHIFT)) {
    uiFlags = FIND_SOLDIER_GRIDNO;
  }

  // Set some values
  if (uiFlags & FIND_SOLDIER_BEGINSTACK) {
    gSoldierStack.bNum = 0;
    gSoldierStack.fUseGridNo = FALSE;
  }

  // Loop through all mercs and make go
  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];
    fInScreenRect = FALSE;
    fInGridNo = FALSE;

    if (pSoldier != NULL) {
      if (pSoldier.value.bActive && !(pSoldier.value.uiStatusFlags & SOLDIER_DEAD) && (pSoldier.value.bVisible != -1 || (gTacticalStatus.uiFlags & SHOW_ALL_MERCS))) {
        // OK, ignore if we are a passenger...
        if (pSoldier.value.uiStatusFlags & (SOLDIER_PASSENGER | SOLDIER_DRIVER)) {
          continue;
        }

        // If we want same level, skip if buggy's not on the same level!
        if (uiFlags & FIND_SOLDIER_SAMELEVEL) {
          if (pSoldier.value.bLevel != (uiFlags >> 16)) {
            continue;
          }
        }

        // If we are selective.... do our own guys FULL and other with gridno!
        // First look for owned soldiers, by way of the full method
        if (uiFlags & FIND_SOLDIER_GRIDNO) {
          fDoFull = FALSE;
        } else if (uiFlags & FIND_SOLDIER_SELECTIVE) {
          if (pSoldier.value.ubID >= gTacticalStatus.Team[gbPlayerNum].bFirstID && pSoldier.value.ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID) {
            fDoFull = TRUE;
          } else {
            fDoFull = FALSE;
          }
        } else {
          fDoFull = TRUE;
        }

        if (fDoFull) {
          // Get Rect contained in the soldier
          GetSoldierScreenRect(pSoldier, addressof(aRect));

          // Get XY From gridno
          ConvertGridNoToXY(sGridNo, addressof(sXMapPos), addressof(sYMapPos));

          // Get screen XY pos from map XY
          // Be carefull to convert to cell cords
          // CellXYToScreenXY( (INT16)((sXMapPos*CELL_X_SIZE)), (INT16)((sYMapPos*CELL_Y_SIZE)), &sScreenX, &sScreenY);

          // Set mouse stuff
          sScreenX = gusMouseXPos;
          sScreenY = gusMouseYPos;

          if (IsPointInScreenRect(sScreenX, sScreenY, addressof(aRect))) {
            fInScreenRect = TRUE;
          }

          if (pSoldier.value.sGridNo == sGridNo) {
            fInGridNo = TRUE;
          }

          // ATE: If we are an enemy....
          if (!gGameSettings.fOptions[TOPTION_SMART_CURSOR]) {
            if (pSoldier.value.ubID >= gTacticalStatus.Team[gbPlayerNum].bFirstID && pSoldier.value.ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID) {
              // ATE: NOT if we are in action or comfirm action mode
              if (gCurrentUIMode != ACTION_MODE && gCurrentUIMode != CONFIRM_ACTION_MODE || gUIActionModeChangeDueToMouseOver) {
                fInScreenRect = FALSE;
              }
            }
          }

          // ATE: Refine this further....
          // Check if this is the selected guy....
          if (pSoldier.value.ubID == gusSelectedSoldier) {
            // Are we in action mode...
            if (gCurrentUIMode == ACTION_MODE || gCurrentUIMode == CONFIRM_ACTION_MODE) {
              // Are we in medic mode?
              if (GetActionModeCursor(pSoldier) != AIDCURS) {
                fInScreenRect = FALSE;
                fInGridNo = FALSE;
              }
            }
          }

          // Make sure we are always on guy if we are on same gridno
          if (fInScreenRect || fInGridNo) {
            // Check if we are a vehicle and refine if so....
            if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
              usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

              if (usAnimSurface != INVALID_ANIMATION_SURFACE) {
                iMercScreenX = (sScreenX - aRect.iLeft);
                iMercScreenY = (-1 * (sScreenY - aRect.iBottom));

                if (!CheckVideoObjectScreenCoordinateInData(gAnimSurfaceDatabase[usAnimSurface].hVideoObject, pSoldier.value.usAniFrame, iMercScreenX, iMercScreenY)) {
                  continue;
                }
              }
            }

            // If thgis is from a gridno, use mouse pos!
            if (pSoldier.value.sGridNo == sGridNo) {
            }

            // Only break here if we're not creating a stack of these fellas
            if (uiFlags & FIND_SOLDIER_BEGINSTACK) {
              gfHandleStack = TRUE;

              // Add this one!
              gSoldierStack.ubIDs[gSoldierStack.bNum] = pSoldier.value.ubID;
              gSoldierStack.bNum++;

              // Determine if it's the current
              if (aRect.iBottom > sHeighestMercScreenY) {
                sMaxScreenMercY = aRect.iBottom;
                sHeighestMercScreenY = sMaxScreenMercY;

                gSoldierStack.bCur = gSoldierStack.bNum - 1;
              }
            }
            // Are we handling a stack right now?
            else if (gfHandleStack) {
              // Are we the selected stack?
              if (gSoldierStack.fUseGridNo) {
                fSoldierFound = FALSE;
                break;
              } else if (gSoldierStack.ubIDs[gSoldierStack.bCur] == pSoldier.value.ubID) {
                // Set it!
                ubBestMerc = pSoldier.value.ubID;

                fSoldierFound = TRUE;
                break;
              }
            } else {
              // Determine if it's the best one
              if (aRect.iBottom > sHeighestMercScreenY) {
                sMaxScreenMercY = aRect.iBottom;
                sHeighestMercScreenY = sMaxScreenMercY;

                // Set it!
                ubBestMerc = pSoldier.value.ubID;
              }

              fSoldierFound = TRUE;
              // Don't break here, find the rest!
            }
          }
        } else {
          // Otherwise, look for a bad guy by way of gridno]
          // Selective means don't give out enemy mercs if they are not visible

          ///&& !NewOKDestination( pSoldier, sGridNo, TRUE, (INT8)gsInterfaceLevel )
          if (pSoldier.value.sGridNo == sGridNo && !NewOKDestination(pSoldier, sGridNo, TRUE, gsInterfaceLevel)) {
            // Set it!
            ubBestMerc = pSoldier.value.ubID;

            fSoldierFound = TRUE;
            break;
          }
        }
      }
    }
  }

  if (fSoldierFound && ubBestMerc != NOBODY) {
    *pusSoldierIndex = ubBestMerc;

    (*pMercFlags) = GetSoldierFindFlags(ubBestMerc);

    return TRUE;
  } else {
    // If we were handling a stack, and we have not found anybody, end
    if (gfHandleStack && !(uiFlags & (FIND_SOLDIER_BEGINSTACK | FIND_SOLDIER_SELECTIVE))) {
      if (gSoldierStack.fUseGridNo) {
        if (gSoldierStack.sUseGridNoGridNo != sGridNo) {
          gfHandleStack = FALSE;
        }
      } else {
        gfHandleStack = FALSE;
      }
    }
  }
  return FALSE;
}

function CycleSoldierFindStack(usMapPos: UINT16): BOOLEAN {
  let usSoldierIndex: UINT16;
  let uiMercFlags: UINT32;

  // Have we initalized for this yet?
  if (!gfHandleStack) {
    if (FindSoldier(usMapPos, addressof(usSoldierIndex), addressof(uiMercFlags), FINDSOLDIERSAMELEVEL(gsInterfaceLevel) | FIND_SOLDIER_BEGINSTACK)) {
      gfHandleStack = TRUE;
    }
  }

  if (gfHandleStack) {
    // we are cycling now?
    if (!gSoldierStack.fUseGridNo) {
      gSoldierStack.bCur++;
    }

    gfUIForceReExamineCursorData = TRUE;

    if (gSoldierStack.bCur == gSoldierStack.bNum) {
      if (!gSoldierStack.fUseGridNo) {
        gSoldierStack.fUseGridNo = TRUE;
        gUIActionModeChangeDueToMouseOver = FALSE;
        gSoldierStack.sUseGridNoGridNo = usMapPos;
      } else {
        gSoldierStack.bCur = 0;
        gSoldierStack.fUseGridNo = FALSE;
      }
    }

    if (!gSoldierStack.fUseGridNo) {
      gusUIFullTargetID = gSoldierStack.ubIDs[gSoldierStack.bCur];
      guiUIFullTargetFlags = GetSoldierFindFlags(gusUIFullTargetID);
      guiUITargetSoldierId = gusUIFullTargetID;
      gfUIFullTargetFound = TRUE;
    } else {
      gfUIFullTargetFound = FALSE;
    }
  }

  // Return if we are in the cycle mode now...
  return gfHandleStack;
}

function SimpleFindSoldier(sGridNo: INT16, bLevel: INT8): Pointer<SOLDIERTYPE> {
  let ubID: UINT8;

  ubID = WhoIsThere2(sGridNo, bLevel);
  if (ubID == NOBODY) {
    return NULL;
  } else {
    return MercPtrs[ubID];
  }
}

function IsValidTargetMerc(ubSoldierID: UINT8): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE> = MercPtrs[ubSoldierID];

  // CHECK IF ACTIVE!
  if (!pSoldier.value.bActive) {
    return FALSE;
  }

  // CHECK IF DEAD
  if (pSoldier.value.bLife == 0) {
    // return( FALSE );
  }

  // IF BAD GUY - CHECK VISIVILITY
  if (pSoldier.value.bTeam != gbPlayerNum) {
    if (pSoldier.value.bVisible == -1 && !(gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) {
      return FALSE;
    }
  }

  return TRUE;
}

function IsGridNoInScreenRect(sGridNo: INT16, pRect: Pointer<SGPRect>): BOOLEAN {
  let iXTrav: INT32;
  let iYTrav: INT32;
  let sMapPos: INT16;

  // Start with top left corner
  iXTrav = pRect.value.iLeft;
  iYTrav = pRect.value.iTop;

  do {
    do {
      GetScreenXYGridNo(iXTrav, iYTrav, addressof(sMapPos));

      if (sMapPos == sGridNo) {
        return TRUE;
      }

      iXTrav += WORLD_TILE_X;
    } while (iXTrav < pRect.value.iRight);

    iYTrav += WORLD_TILE_Y;
    iXTrav = pRect.value.iLeft;
  } while (iYTrav < pRect.value.iBottom);

  return FALSE;
}

function GetSoldierScreenRect(pSoldier: Pointer<SOLDIERTYPE>, pRect: Pointer<SGPRect>): void {
  let sMercScreenX: INT16;
  let sMercScreenY: INT16;
  let usAnimSurface: UINT16;
  //		ETRLEObject *pTrav;
  //		UINT32 usHeight, usWidth;

  GetSoldierScreenPos(pSoldier, addressof(sMercScreenX), addressof(sMercScreenY));

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);
  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    pRect.value.iLeft = sMercScreenX;
    pRect.value.iTop = sMercScreenY;
    pRect.value.iBottom = sMercScreenY + 5;
    pRect.value.iRight = sMercScreenX + 5;

    return;
  }

  // pTrav = &(gAnimSurfaceDatabase[ usAnimSurface ].hVideoObject->pETRLEObject[ pSoldier->usAniFrame ] );
  // usHeight				= (UINT32)pTrav->usHeight;
  // usWidth					= (UINT32)pTrav->usWidth;

  pRect.value.iLeft = sMercScreenX;
  pRect.value.iTop = sMercScreenY;
  pRect.value.iBottom = sMercScreenY + pSoldier.value.sBoundingBoxHeight;
  pRect.value.iRight = sMercScreenX + pSoldier.value.sBoundingBoxWidth;
}

function GetSoldierAnimDims(pSoldier: Pointer<SOLDIERTYPE>, psHeight: Pointer<INT16>, psWidth: Pointer<INT16>): void {
  let usAnimSurface: UINT16;

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    *psHeight = 5;
    *psWidth = 5;

    return;
  }

  // OK, noodle here on what we should do... If we take each frame, it will be different slightly
  // depending on the frame and the value returned here will vary thusly. However, for the
  // uses of this function, we should be able to use just the first frame...

  if (pSoldier.value.usAniFrame >= gAnimSurfaceDatabase[usAnimSurface].hVideoObject.value.usNumberOfObjects) {
    let i: int = 0;
  }

  *psHeight = pSoldier.value.sBoundingBoxHeight;
  *psWidth = pSoldier.value.sBoundingBoxWidth;
}

function GetSoldierAnimOffsets(pSoldier: Pointer<SOLDIERTYPE>, sOffsetX: Pointer<INT16>, sOffsetY: Pointer<INT16>): void {
  let usAnimSurface: UINT16;

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    *sOffsetX = 0;
    *sOffsetY = 0;

    return;
  }

  *sOffsetX = pSoldier.value.sBoundingBoxOffsetX;
  *sOffsetY = pSoldier.value.sBoundingBoxOffsetY;
}

function GetSoldierScreenPos(pSoldier: Pointer<SOLDIERTYPE>, psScreenX: Pointer<INT16>, psScreenY: Pointer<INT16>): void {
  let sMercScreenX: INT16;
  let sMercScreenY: INT16;
  let dOffsetX: FLOAT;
  let dOffsetY: FLOAT;
  let dTempX_S: FLOAT;
  let dTempY_S: FLOAT;
  let usAnimSurface: UINT16;
  //		ETRLEObject *pTrav;

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    *psScreenX = 0;
    *psScreenY = 0;
    return;
  }

  // Get 'TRUE' merc position
  dOffsetX = pSoldier.value.dXPos - gsRenderCenterX;
  dOffsetY = pSoldier.value.dYPos - gsRenderCenterY;

  FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, addressof(dTempX_S), addressof(dTempY_S));

  // pTrav = &(gAnimSurfaceDatabase[ usAnimSurface ].hVideoObject->pETRLEObject[ pSoldier->usAniFrame ] );

  sMercScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + dTempX_S;
  sMercScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + dTempY_S;

  // Adjust starting screen coordinates
  sMercScreenX -= gsRenderWorldOffsetX;
  sMercScreenY -= gsRenderWorldOffsetY;
  sMercScreenY -= gpWorldLevelData[pSoldier.value.sGridNo].sHeight;

  // Adjust for render height
  sMercScreenY += gsRenderHeight;

  // Add to start position of dest buffer
  // sMercScreenX += pTrav->sOffsetX;
  // sMercScreenY += pTrav->sOffsetY;
  sMercScreenX += pSoldier.value.sBoundingBoxOffsetX;
  sMercScreenY += pSoldier.value.sBoundingBoxOffsetY;

  sMercScreenY -= pSoldier.value.sHeightAdjustment;

  *psScreenX = sMercScreenX;
  *psScreenY = sMercScreenY;
}

// THE TRUE SCREN RECT DOES NOT TAKE THE OFFSETS OF BUDDY INTO ACCOUNT!
function GetSoldierTRUEScreenPos(pSoldier: Pointer<SOLDIERTYPE>, psScreenX: Pointer<INT16>, psScreenY: Pointer<INT16>): void {
  let sMercScreenX: INT16;
  let sMercScreenY: INT16;
  let dOffsetX: FLOAT;
  let dOffsetY: FLOAT;
  let dTempX_S: FLOAT;
  let dTempY_S: FLOAT;
  let usAnimSurface: UINT16;

  usAnimSurface = GetSoldierAnimationSurface(pSoldier, pSoldier.value.usAnimState);

  if (usAnimSurface == INVALID_ANIMATION_SURFACE) {
    *psScreenX = 0;
    *psScreenY = 0;
    return;
  }

  // Get 'TRUE' merc position
  dOffsetX = pSoldier.value.dXPos - gsRenderCenterX;
  dOffsetY = pSoldier.value.dYPos - gsRenderCenterY;

  FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, addressof(dTempX_S), addressof(dTempY_S));

  sMercScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + dTempX_S;
  sMercScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + dTempY_S;

  // Adjust starting screen coordinates
  sMercScreenX -= gsRenderWorldOffsetX;
  sMercScreenY -= gsRenderWorldOffsetY;

  // Adjust for render height
  sMercScreenY += gsRenderHeight;
  sMercScreenY -= gpWorldLevelData[pSoldier.value.sGridNo].sHeight;

  sMercScreenY -= pSoldier.value.sHeightAdjustment;

  *psScreenX = sMercScreenX;
  *psScreenY = sMercScreenY;
}

function GridNoOnScreen(sGridNo: INT16): BOOLEAN {
  let sNewCenterWorldX: INT16;
  let sNewCenterWorldY: INT16;
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sAllowance: INT16 = 20;

  if (gsVIEWPORT_WINDOW_START_Y == 20) {
    sAllowance = 40;
  }

  ConvertGridNoToXY(sGridNo, addressof(sNewCenterWorldX), addressof(sNewCenterWorldY));

  // Get screen coordinates for current position of soldier
  GetWorldXYAbsoluteScreenXY((sNewCenterWorldX), (sNewCenterWorldY), addressof(sWorldX), addressof(sWorldY));

  // ATE: OK, here, adjust the top value so that it's a tile and a bit over, because of our mercs!
  if (sWorldX >= gsTopLeftWorldX && sWorldX <= gsBottomRightWorldX && sWorldY >= (gsTopLeftWorldY + sAllowance) && sWorldY <= (gsBottomRightWorldY + 20)) {
    return TRUE;
  }
  return FALSE;
}

function SoldierOnScreen(usID: UINT16): BOOLEAN {
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Get pointer of soldier
  pSoldier = MercPtrs[usID];

  return GridNoOnScreen(pSoldier.value.sGridNo);
}

function SoldierOnVisibleWorldTile(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  return GridNoOnVisibleWorldTile(pSoldier.value.sGridNo);
}

function SoldierLocationRelativeToScreen(sGridNo: INT16, usReasonID: UINT16, pbDirection: Pointer<INT8>, puiScrollFlags: Pointer<UINT32>): BOOLEAN {
  let sWorldX: INT16;
  let sWorldY: INT16;
  let sY: INT16;
  let sX: INT16;
  /* static */ let fCountdown: BOOLEAN = 0;
  let sScreenCenterX: INT16;
  let sScreenCenterY: INT16;
  let sDistToCenterY: INT16;
  let sDistToCenterX: INT16;

  *puiScrollFlags = 0;

  sX = CenterX(sGridNo);
  sY = CenterY(sGridNo);

  // Get screen coordinates for current position of soldier
  GetWorldXYAbsoluteScreenXY((sX / CELL_X_SIZE), (sY / CELL_Y_SIZE), addressof(sWorldX), addressof(sWorldY));

  // Find the diustance from render center to true world center
  sDistToCenterX = gsRenderCenterX - gCenterWorldX;
  sDistToCenterY = gsRenderCenterY - gCenterWorldY;

  // From render center in world coords, convert to render center in "screen" coords
  FromCellToScreenCoordinates(sDistToCenterX, sDistToCenterY, addressof(sScreenCenterX), addressof(sScreenCenterY));

  // Subtract screen center
  sScreenCenterX += gsCX;
  sScreenCenterY += gsCY;

  // Adjust for offset origin!
  sScreenCenterX += 0;
  sScreenCenterY += 10;

  // Get direction
  //*pbDirection = atan8( sScreenCenterX, sScreenCenterY, sWorldX, sWorldY );
  *pbDirection = atan8(gsRenderCenterX, gsRenderCenterY, (sX), (sY));

  // Check values!
  if (sWorldX > (sScreenCenterX + 20)) {
    (*puiScrollFlags) |= SCROLL_RIGHT;
  }
  if (sWorldX < (sScreenCenterX - 20)) {
    (*puiScrollFlags) |= SCROLL_LEFT;
  }
  if (sWorldY > (sScreenCenterY + 20)) {
    (*puiScrollFlags) |= SCROLL_DOWN;
  }
  if (sWorldY < (sScreenCenterY - 20)) {
    (*puiScrollFlags) |= SCROLL_UP;
  }

  // If we are on screen, stop
  if (sWorldX >= gsTopLeftWorldX && sWorldX <= gsBottomRightWorldX && sWorldY >= gsTopLeftWorldY && sWorldY <= (gsBottomRightWorldY + 20)) {
    // CHECK IF WE ARE DONE...
    if (fCountdown > gScrollSlideInertiaDirection[*pbDirection]) {
      fCountdown = 0;
      return FALSE;
    } else {
      fCountdown++;
    }
  }

  return TRUE;
}

function IsPointInSoldierBoundingBox(pSoldier: Pointer<SOLDIERTYPE>, sX: INT16, sY: INT16): BOOLEAN {
  let aRect: SGPRect;

  // Get Rect contained in the soldier
  GetSoldierScreenRect(pSoldier, addressof(aRect));

  if (IsPointInScreenRect(sX, sY, addressof(aRect))) {
    return TRUE;
  }

  return FALSE;
}

function FindRelativeSoldierPosition(pSoldier: Pointer<SOLDIERTYPE>, usFlags: Pointer<UINT16>, sX: INT16, sY: INT16): BOOLEAN {
  let aRect: SGPRect;
  let sRelX: INT16;
  let sRelY: INT16;
  let dRelPer: FLOAT;

  // Get Rect contained in the soldier
  GetSoldierScreenRect(pSoldier, addressof(aRect));

  if (IsPointInScreenRectWithRelative(sX, sY, addressof(aRect), addressof(sRelX), addressof(sRelY))) {
    dRelPer = sRelY / (aRect.iBottom - aRect.iTop);

    // Determine relative positions
    switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
      case ANIM_STAND:

        if (dRelPer < .2) {
          (*usFlags) = TILE_FLAG_HEAD;
          return TRUE;
        } else if (dRelPer < .6) {
          (*usFlags) = TILE_FLAG_MID;
          return TRUE;
        } else {
          (*usFlags) = TILE_FLAG_FEET;
          return TRUE;
        }
        break;

      case ANIM_CROUCH:

        if (dRelPer < .2) {
          (*usFlags) = TILE_FLAG_HEAD;
          return TRUE;
        } else if (dRelPer < .7) {
          (*usFlags) = TILE_FLAG_MID;
          return TRUE;
        } else {
          (*usFlags) = TILE_FLAG_FEET;
          return TRUE;
        }
        break;
    }
  }

  return FALSE;
}

// VERY quickly finds a soldier at gridno , ( that is visible )
function QuickFindSoldier(sGridNo: INT16): UINT8 {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE> = NULL;

  // Loop through all mercs and make go
  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    if (pSoldier != NULL) {
      if (pSoldier.value.sGridNo == sGridNo && pSoldier.value.bVisible != -1) {
        return cnt;
      }
    }
  }

  return NOBODY;
}

function GetGridNoScreenPos(sGridNo: INT16, ubLevel: UINT8, psScreenX: Pointer<INT16>, psScreenY: Pointer<INT16>): void {
  let sScreenX: INT16;
  let sScreenY: INT16;
  let dOffsetX: FLOAT;
  let dOffsetY: FLOAT;
  let dTempX_S: FLOAT;
  let dTempY_S: FLOAT;

  // Get 'TRUE' merc position
  dOffsetX = (CenterX(sGridNo) - gsRenderCenterX);
  dOffsetY = (CenterY(sGridNo) - gsRenderCenterY);

  // OK, DONT'T ASK... CONVERSION TO PROPER Y NEEDS THIS...
  dOffsetX -= CELL_Y_SIZE;

  FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, addressof(dTempX_S), addressof(dTempY_S));

  sScreenX = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + dTempX_S;
  sScreenY = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + dTempY_S;

  // Adjust starting screen coordinates
  sScreenX -= gsRenderWorldOffsetX;
  sScreenY -= gsRenderWorldOffsetY;

  sScreenY += gsRenderHeight;

  // Adjust for world height
  sScreenY -= gpWorldLevelData[sGridNo].sHeight;

  // Adjust for level height
  if (ubLevel) {
    sScreenY -= ROOF_LEVEL_HEIGHT;
  }

  *psScreenX = sScreenX;
  *psScreenY = sScreenY;
}
