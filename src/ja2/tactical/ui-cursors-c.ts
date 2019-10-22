let gfCannotGetThrough: BOOLEAN = FALSE;
let gfDisplayFullCountRing: BOOLEAN = FALSE;

function GetMouseRecalcAndShowAPFlags(puiCursorFlags: Pointer<UINT32>, pfShowAPs: Pointer<BOOLEAN>): BOOLEAN {
  let uiCursorFlags: UINT32;
  /* static */ let fDoNewTile: BOOLEAN = FALSE;
  let fRecalc: BOOLEAN = FALSE;
  let fShowAPs: BOOLEAN = FALSE;

  // SET FLAGS FOR CERTAIN MOUSE MOVEMENTS
  GetCursorMovementFlags(addressof(uiCursorFlags));

  // Force if we are currently cycling guys...
  if (gfUIForceReExamineCursorData) {
    fDoNewTile = TRUE;
    fRecalc = TRUE;
    gfUIForceReExamineCursorData = FALSE;
  }

  // IF CURSOR IS MOVING
  if (uiCursorFlags & MOUSE_MOVING) {
    // IF CURSOR WAS PREVIOUSLY STATIONARY, MAKE THE ADDITIONAL CHECK OF GRID POS CHANGE
    // if ( uiCursorFlags & MOUSE_MOVING_NEW_TILE )
    {
      // Reset counter
      RESETCOUNTER(PATHFINDCOUNTER);
      fDoNewTile = TRUE;
    }
  }

  if (uiCursorFlags & MOUSE_STATIONARY) {
    // ONLY DIPSLAY APS AFTER A DELAY
    if (COUNTERDONE(PATHFINDCOUNTER)) {
      // Don't reset counter: One when we move again do we do this!
      fShowAPs = TRUE;

      if (fDoNewTile) {
        fDoNewTile = FALSE;
        fRecalc = TRUE;
      }
    }
  }

  if (puiCursorFlags) {
    (puiCursorFlags.value) = uiCursorFlags;
  }

  if (pfShowAPs) {
    (pfShowAPs.value) = fShowAPs;
  }

  return fRecalc;
}

// FUNCTIONS FOR CURSOR DETERMINATION!
function GetProperItemCursor(ubSoldierID: UINT8, ubItemIndex: UINT16, usMapPos: UINT16, fActivated: BOOLEAN): UINT8 {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiCursorFlags: UINT32;
  let fShowAPs: BOOLEAN = FALSE;
  let fRecalc: BOOLEAN = FALSE;
  let sTargetGridNo: INT16 = usMapPos;
  let ubCursorID: UINT8 = 0;
  let ubItemCursor: UINT8;

  pSoldier = MercPtrs[ubSoldierID];

  fRecalc = GetMouseRecalcAndShowAPFlags(addressof(uiCursorFlags), addressof(fShowAPs));

  // ATE: Update attacking weapon!
  // CC has added this attackingWeapon stuff and I need to update it constantly for
  // CTGH algorithms
  if (gTacticalStatus.ubAttackBusyCount == 0 && Item[pSoldier.value.inv[HANDPOS].usItem].usItemClass & IC_WEAPON) {
    pSoldier.value.usAttackingWeapon = pSoldier.value.inv[HANDPOS].usItem;
  }

  // Calculate target gridno!
  if (gfUIFullTargetFound) {
    sTargetGridNo = MercPtrs[gusUIFullTargetID].value.sGridNo;
  } else {
    sTargetGridNo = usMapPos;
  }

  ubItemCursor = GetActionModeCursor(pSoldier);

  switch (ubItemCursor) {
    case PUNCHCURS:

      // Determine whether gray or red!
      ubCursorID = HandlePunchCursor(pSoldier, sTargetGridNo, fActivated, uiCursorFlags);
      break;

    case KNIFECURS:

      ubCursorID = HandleKnifeCursor(pSoldier, sTargetGridNo, fActivated, uiCursorFlags);
      break;

    case AIDCURS:

      ubCursorID = HandleAidCursor(pSoldier, usMapPos, fActivated, uiCursorFlags);
      break;

    case TARGETCURS:

      // Set merc glow script
      SetMercGlowFast();

      if (fActivated) {
        ubCursorID = HandleActivatedTargetCursor(pSoldier, sTargetGridNo, fShowAPs, fRecalc, uiCursorFlags);
      } else {
        ubCursorID = HandleNonActivatedTargetCursor(pSoldier, sTargetGridNo, fShowAPs, fRecalc, uiCursorFlags);
      }

      // ATE: Only do this if we are in combat!
      if (gCurrentUIMode == ACTION_MODE && (gTacticalStatus.uiFlags & INCOMBAT)) {
        // Alrighty, let's change the cursor!
        if (fRecalc && gfUIFullTargetFound) {
          // ATE: Check for ammo
          if (IsValidTargetMerc(gusUIFullTargetID) && EnoughAmmo(pSoldier, FALSE, HANDPOS)) {
            // IF it's an ememy, goto confirm action mode
            if ((guiUIFullTargetFlags & ENEMY_MERC) && (guiUIFullTargetFlags & VISIBLE_MERC) && !(guiUIFullTargetFlags & DEAD_MERC) && !gfCannotGetThrough) {
              guiPendingOverrideEvent = A_CHANGE_TO_CONFIM_ACTION;
            }
          }
        }
      }
      break;

    case TOSSCURS:
    case TRAJECTORYCURS:

      if (fActivated) {
        if (!gfUIHandlePhysicsTrajectory) {
          ubCursorID = HandleNonActivatedTossCursor(pSoldier, sTargetGridNo, fRecalc, uiCursorFlags, ubItemCursor);
        } else {
          ubCursorID = HandleActivatedTossCursor(pSoldier, sTargetGridNo, ubItemCursor);
        }
      } else {
        ubCursorID = HandleNonActivatedTossCursor(pSoldier, sTargetGridNo, fRecalc, uiCursorFlags, ubItemCursor);
      }

      break;

    case BOMBCURS:

      ubCursorID = HandleBombCursor(pSoldier, sTargetGridNo, fActivated, uiCursorFlags);
      break;

    case REMOTECURS:

      ubCursorID = HandleRemoteCursor(pSoldier, sTargetGridNo, fActivated, uiCursorFlags);
      break;

    case WIRECUTCURS:

      ubCursorID = HandleWirecutterCursor(pSoldier, sTargetGridNo, uiCursorFlags);
      break;

    case REPAIRCURS:

      ubCursorID = HandleRepairCursor(pSoldier, sTargetGridNo, uiCursorFlags);
      break;

    case JARCURS:

      ubCursorID = HandleJarCursor(pSoldier, sTargetGridNo, uiCursorFlags);
      break;

    case TINCANCURS:

      ubCursorID = HandleTinCanCursor(pSoldier, sTargetGridNo, uiCursorFlags);
      break;

    case REFUELCURS:

      ubCursorID = HandleRefuelCursor(pSoldier, sTargetGridNo, uiCursorFlags);
      break;

    case INVALIDCURS:

      ubCursorID = INVALID_ACTION_UICURSOR;
      break;
  }

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (gfUIFullTargetFound) {
      PauseRT(TRUE);
    } else {
      PauseRT(FALSE);
    }
  }

  return ubCursorID;
}

function HandleActivatedTargetCursor(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: UINT16, fShowAPs: BOOLEAN, fRecalc: BOOLEAN, uiCursorFlags: UINT32): UINT8 {
  let switchVal: UINT8;
  let fEnoughPoints: BOOLEAN = TRUE;
  let bFutureAim: UINT8;
  let sAPCosts: INT16;
  let usCursor: UINT16 = 0;
  let fMaxPointLimitHit: BOOLEAN = FALSE;
  let usInHand: UINT16;

  usInHand = pSoldier.value.inv[HANDPOS].usItem;

  if (Item[usInHand].usItemClass != IC_THROWING_KNIFE) {
    // If we are in realtime, follow!
    if ((!(gTacticalStatus.uiFlags & INCOMBAT))) {
      if ((gAnimControl[MercPtrs[gusSelectedSoldier].value.usAnimState].uiFlags & ANIM_STATIONARY)) {
        if (gUITargetShotWaiting) {
          guiPendingOverrideEvent = CA_MERC_SHOOT;
        }
      }

      // SoldierFollowGridNo( pSoldier, usMapPos );
    }

    // Check if we are reloading
    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      if (pSoldier.value.fReloading || pSoldier.value.fPauseAim) {
        return ACTION_TARGET_RELOADING;
      }
    }
  }

  // Determine where we are shooting / aiming
  // if ( fRecalc )
  { DetermineCursorBodyLocation(gusSelectedSoldier, TRUE, TRUE); }

  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, usMapPos, TRUE, (pSoldier.value.bShownAimTime / 2));
    gfUIDisplayActionPoints = TRUE;
    gfUIDisplayActionPointsCenter = TRUE;

    // If we don't have any points and we are at the first refine, do nothing but warn!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, FALSE)) {
      gfUIDisplayActionPointsInvalid = TRUE;

      fMaxPointLimitHit = TRUE;
    } else {
      bFutureAim = (pSoldier.value.bShownAimTime + 2);

      if (bFutureAim <= REFINE_AIM_5) {
        sAPCosts = MinAPsToAttack(pSoldier, usMapPos, TRUE) + (bFutureAim / 2);

        // Determine if we can afford!
        if (!EnoughPoints(pSoldier, sAPCosts, 0, FALSE)) {
          fEnoughPoints = FALSE;
        }
      }
    }
  }

  if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
    if (!pSoldier.value.fPauseAim) {
      if (COUNTERDONE(TARGETREFINE)) {
        // Reset counter
        RESETCOUNTER(TARGETREFINE);

        if (pSoldier.value.bDoBurst) {
          pSoldier.value.bShownAimTime = REFINE_AIM_BURST;
        } else {
          pSoldier.value.bShownAimTime++;

          if (pSoldier.value.bShownAimTime > REFINE_AIM_5) {
            pSoldier.value.bShownAimTime = REFINE_AIM_5;
          } else {
            if (pSoldier.value.bShownAimTime % 2) {
              PlayJA2Sample(TARG_REFINE_BEEP, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
            }
          }
        }
      }
    }
  }

  if (fRecalc) {
    if (gusUIFullTargetID != NOBODY) {
      if (SoldierToSoldierBodyPartChanceToGetThrough(pSoldier, MercPtrs[gusUIFullTargetID], pSoldier.value.bAimShotLocation) < OK_CHANCE_TO_GET_THROUGH) {
        gfCannotGetThrough = TRUE;
      } else {
        gfCannotGetThrough = FALSE;
      }
    } else {
      if (SoldierToLocationChanceToGetThrough(pSoldier, usMapPos, gsInterfaceLevel, pSoldier.value.bTargetCubeLevel, NOBODY) < OK_CHANCE_TO_GET_THROUGH) {
        gfCannotGetThrough = TRUE;
      } else {
        gfCannotGetThrough = FALSE;
      }
    }
  }

  // OK, if we begin to move, reset the cursor...
  if (uiCursorFlags & MOUSE_MOVING) {
    // gfCannotGetThrough = FALSE;
  }

  if (fMaxPointLimitHit) {
    // Check if we're in burst mode!
    if (pSoldier.value.bDoBurst) {
      usCursor = ACTION_TARGETREDBURST_UICURSOR;
    } else if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
      usCursor = RED_THROW_UICURSOR;
    } else {
      usCursor = ACTION_TARGETRED_UICURSOR;
    }
  } else if (pSoldier.value.bDoBurst) {
    if (pSoldier.value.fDoSpread) {
      usCursor = ACTION_TARGETREDBURST_UICURSOR;
    } else {
      usCursor = ACTION_TARGETCONFIRMBURST_UICURSOR;
    }
  } else {
    // IF we are in turnbased, half the shown time values
    if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
      switchVal = pSoldier.value.bShownAimTime;
    } else {
      switchVal = pSoldier.value.bShownAimTime;
    }

    switch (switchVal) {
      case REFINE_AIM_1:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_THROWAIMYELLOW1_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_THROWAIM1_UICURSOR;
          } else {
            usCursor = ACTION_THROWAIMCANT1_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_TARGETAIMYELLOW1_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_TARGETAIM1_UICURSOR;
          } else {
            usCursor = ACTION_TARGETAIMCANT1_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_2:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_THROWAIMYELLOW2_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_THROWAIM3_UICURSOR;
          } else {
            usCursor = ACTION_THROWAIMCANT2_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_TARGETAIMYELLOW2_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_TARGETAIM3_UICURSOR;
          } else {
            usCursor = ACTION_TARGETAIMCANT2_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_3:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_THROWAIMYELLOW3_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_THROWAIM5_UICURSOR;
          } else {
            usCursor = ACTION_THROWAIMCANT3_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_TARGETAIMYELLOW3_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_TARGETAIM5_UICURSOR;
          } else {
            usCursor = ACTION_TARGETAIMCANT3_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_4:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_THROWAIMYELLOW4_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_THROWAIM7_UICURSOR;
          } else {
            usCursor = ACTION_THROWAIMCANT4_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_TARGETAIMYELLOW4_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_TARGETAIM7_UICURSOR;
          } else {
            usCursor = ACTION_TARGETAIMCANT4_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_5:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_THROWAIMFULL_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_THROWAIM9_UICURSOR;
          } else {
            usCursor = ACTION_THROWAIMCANT5_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = ACTION_TARGETAIMFULL_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = ACTION_TARGETAIM9_UICURSOR;
          } else {
            usCursor = ACTION_TARGETAIMCANT5_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_MID1:

        usCursor = ACTION_TARGETAIM2_UICURSOR;
        break;

      case REFINE_AIM_MID2:

        usCursor = ACTION_TARGETAIM4_UICURSOR;
        break;

      case REFINE_AIM_MID3:

        usCursor = ACTION_TARGETAIM6_UICURSOR;
        break;

      case REFINE_AIM_MID4:
        usCursor = ACTION_TARGETAIM8_UICURSOR;
        break;
    }
  }

  if (!fMaxPointLimitHit) {
    // Remove flash flag!
    RemoveCursorFlags(gUICursors[usCursor].usFreeCursorName, CURSOR_TO_FLASH);
    RemoveCursorFlags(gUICursors[usCursor].usFreeCursorName, CURSOR_TO_PLAY_SOUND);

    if (gfCannotGetThrough) {
      SetCursorSpecialFrame(gUICursors[usCursor].usFreeCursorName, 1);
    } else {
      if (!InRange(pSoldier, usMapPos)) {
        // OK, make buddy flash!
        SetCursorFlags(gUICursors[usCursor].usFreeCursorName, CURSOR_TO_FLASH);
        SetCursorFlags(gUICursors[usCursor].usFreeCursorName, CURSOR_TO_PLAY_SOUND);
      } else {
        SetCursorSpecialFrame(gUICursors[usCursor].usFreeCursorName, 0);
      }
    }
  }
  return usCursor;
}

function HandleNonActivatedTargetCursor(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: UINT16, fShowAPs: BOOLEAN, fRecalc: BOOLEAN, uiCursorFlags: UINT32): UINT8 {
  let usInHand: UINT16;

  usInHand = pSoldier.value.inv[HANDPOS].usItem;

  if (Item[usInHand].usItemClass != IC_THROWING_KNIFE) {
    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      // DetermineCursorBodyLocation( (UINT8)gusSelectedSoldier, FALSE, fRecalc );
      DetermineCursorBodyLocation(gusSelectedSoldier, fShowAPs, fRecalc);

      if (pSoldier.value.fReloading || pSoldier.value.fPauseAim) {
        return ACTION_TARGET_RELOADING;
      }
    }

    // Check for enough ammo...
    if (!EnoughAmmo(pSoldier, FALSE, HANDPOS)) {
      // Check if ANY ammo exists.....
      if (FindAmmoToReload(pSoldier, HANDPOS, NO_SLOT) == NO_SLOT) {
        // OK, use BAD reload cursor.....
        return BAD_RELOAD_UICURSOR;
      } else {
        // Check APs to reload...
        gsCurrentActionPoints = GetAPsToAutoReload(pSoldier);

        gfUIDisplayActionPoints = TRUE;
        // gUIDisplayActionPointsOffX = 14;
        // gUIDisplayActionPointsOffY = 7;

        // OK, use GOOD reload cursor.....
        return GOOD_RELOAD_UICURSOR;
      }
    }
  }

  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    DetermineCursorBodyLocation(gusSelectedSoldier, fShowAPs, fRecalc);

    gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, usMapPos, TRUE, (pSoldier.value.bShownAimTime / 2));

    gfUIDisplayActionPoints = TRUE;
    gfUIDisplayActionPointsCenter = TRUE;

    if (fShowAPs) {
      if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, FALSE)) {
        gfUIDisplayActionPointsInvalid = TRUE;
      }
    } else {
      // gfUIDisplayActionPointsBlack = TRUE;
      gfUIDisplayActionPoints = FALSE;
    }
  }

  // if ( gTacticalStatus.uiFlags & TURNBASED && !(gTacticalStatus.uiFlags & INCOMBAT ) )
  {
    if (fRecalc) {
      if (SoldierToLocationChanceToGetThrough(pSoldier, usMapPos, gsInterfaceLevel, pSoldier.value.bTargetCubeLevel, NOBODY) < OK_CHANCE_TO_GET_THROUGH) {
        gfCannotGetThrough = TRUE;
      } else {
        gfCannotGetThrough = FALSE;
      }
    }

    // OK, if we begin to move, reset the cursor...
    if (uiCursorFlags & MOUSE_MOVING) {
      gfCannotGetThrough = FALSE;
    }

    if (gfCannotGetThrough) {
      if (pSoldier.value.bDoBurst) {
        return ACTION_NOCHANCE_BURST_UICURSOR;
      } else if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
        return BAD_THROW_UICURSOR;
      } else {
        return ACTION_NOCHANCE_SHOOT_UICURSOR;
      }
    }
  }

  // Determine if good range
  if (!InRange(pSoldier, usMapPos)) {
    // Flash cursor!
    // Check if we're in burst mode!
    if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
      return FLASH_THROW_UICURSOR;
    } else if (pSoldier.value.bDoBurst) {
      // return( ACTION_FIRSTAID_RED );
      return ACTION_FLASH_BURST_UICURSOR;
    } else {
      // return( ACTION_FIRSTAID_RED );
      return ACTION_FLASH_SHOOT_UICURSOR;
    }
  } else {
    // Check if we're in burst mode!
    if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
      return GOOD_THROW_UICURSOR;
    } else if (pSoldier.value.bDoBurst) {
      // return( ACTION_FIRSTAID_RED );
      return ACTION_TARGETBURST_UICURSOR;
    } else {
      // return( ACTION_FIRSTAID_RED );
      return ACTION_SHOOT_UICURSOR;
    }
  }
}

function DetermineCursorBodyLocation(ubSoldierID: UINT8, fDisplay: BOOLEAN, fRecalc: BOOLEAN): void {
  let usMapPos: UINT16;
  let pTargetSoldier: Pointer<SOLDIERTYPE> = NULL;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usFlags: UINT16;
  let sMouseX: INT16;
  let sMouseY: INT16;
  let sCellX: INT16;
  let sCellY: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let fOnGuy: BOOLEAN = FALSE;
  let pNode: Pointer<LEVELNODE>;

  pSoldier = MercPtrs[ubSoldierID];

  if (gTacticalStatus.ubAttackBusyCount > 0) {
    // ATE: Return if attacker busy count > 0, this
    // helps in RT with re-setting the flag to random...
    return;
  }

  if (fRecalc) {
    // ALWAYS SET AIM LOCATION TO NOTHING
    pSoldier.value.bAimShotLocation = AIM_SHOT_RANDOM;

    if (!GetMouseMapPos(addressof(usMapPos))) {
      return;
    }

    // Determine which body part it's on
    pNode = GetAnimProfileFlags(usMapPos, addressof(usFlags), addressof(pTargetSoldier), NULL);

    while (pNode != NULL) {
      if (pTargetSoldier != NULL) {
        // ATE: Check their stance - if prone - return!
        if (gAnimControl[pTargetSoldier.value.usAnimState].ubHeight == ANIM_PRONE) {
          return;
        }

        fOnGuy = TRUE;

        // Check if we have a half tile profile
        if (usFlags & TILE_FLAG_NORTH_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          if (sCellY > (CELL_Y_SIZE / 2)) {
            fOnGuy = FALSE;
          }
        }
        // Check if we have a half tile profile
        if (usFlags & TILE_FLAG_SOUTH_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          if (sCellY <= (CELL_Y_SIZE / 2)) {
            fOnGuy = FALSE;
          }
        }
        // Check if we have a half tile profile
        if (usFlags & TILE_FLAG_WEST_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          if (sCellX > (CELL_X_SIZE / 2)) {
            fOnGuy = FALSE;
          }
        }
        if (usFlags & TILE_FLAG_EAST_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          if (sCellX <= (CELL_X_SIZE / 2)) {
            fOnGuy = FALSE;
          }
        }
        if (usFlags & TILE_FLAG_TOP_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          // Convert these to screen corrdinates
          FromCellToScreenCoordinates(sCellX, sCellY, addressof(sScreenX), addressof(sScreenY));

          // Check for Below...
          if (sScreenX > (WORLD_TILE_Y / 2)) {
            fOnGuy = FALSE;
          }
        }
        if (usFlags & TILE_FLAG_BOTTOM_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          // Convert these to screen corrdinates
          FromCellToScreenCoordinates(sCellX, sCellY, addressof(sScreenX), addressof(sScreenY));

          // Check for Below...
          if (sScreenX <= (WORLD_TILE_Y / 2)) {
            fOnGuy = FALSE;
          }
        }

        // Check if mouse is iin bounding box of soldier
        if (!IsPointInSoldierBoundingBox(pTargetSoldier, gusMouseXPos, gusMouseYPos)) {
          fOnGuy = FALSE;
        }
      }

      if (fOnGuy)
        break;

      pNode = GetAnimProfileFlags(usMapPos, addressof(usFlags), addressof(pTargetSoldier), pNode);
    }

    if (!fOnGuy) {
      // Check if we can find a soldier here
      if (gfUIFullTargetFound) {
        pTargetSoldier = MercPtrs[gusUIFullTargetID];

        if (FindRelativeSoldierPosition(pTargetSoldier, addressof(usFlags), gusMouseXPos, gusMouseYPos)) {
          fOnGuy = TRUE;
        }
      }
    }

    if (fOnGuy) {
      if (IsValidTargetMerc(pTargetSoldier.value.ubID)) {
        if (usFlags & TILE_FLAG_FEET) {
          pSoldier.value.bAimShotLocation = AIM_SHOT_LEGS;
        }
        if (usFlags & TILE_FLAG_MID) {
          pSoldier.value.bAimShotLocation = AIM_SHOT_TORSO;
        }
        if (usFlags & TILE_FLAG_HEAD) {
          pSoldier.value.bAimShotLocation = AIM_SHOT_HEAD;
        }
      }
    }
  }

  if (fDisplay && (!pSoldier.value.bDoBurst)) {
    if (gfUIFullTargetFound) {
      pTargetSoldier = MercPtrs[gusUIFullTargetID];

      if (pTargetSoldier.value.ubBodyType == CROW) {
        pSoldier.value.bAimShotLocation = AIM_SHOT_LEGS;

        wcscpy(gzLocation, TacticalStr[CROW_HIT_LOCATION_STR]);

        gfUIBodyHitLocation = TRUE;
        return;
      }

      if (!IS_MERC_BODY_TYPE(pTargetSoldier)) {
        return;
      }

      switch (pSoldier.value.bAimShotLocation) {
        case AIM_SHOT_HEAD:

          // If we have a knife in hand, change string
          if (Item[pSoldier.value.inv[HANDPOS].usItem].usItemClass == IC_BLADE) {
            wcscpy(gzLocation, TacticalStr[NECK_HIT_LOCATION_STR]);
          } else {
            wcscpy(gzLocation, TacticalStr[HEAD_HIT_LOCATION_STR]);
          }
          gfUIBodyHitLocation = TRUE;
          break;

        case AIM_SHOT_TORSO:
          wcscpy(gzLocation, TacticalStr[TORSO_HIT_LOCATION_STR]);
          gfUIBodyHitLocation = TRUE;
          break;

        case AIM_SHOT_LEGS:
          wcscpy(gzLocation, TacticalStr[LEGS_HIT_LOCATION_STR]);
          gfUIBodyHitLocation = TRUE;
          break;
      }
    }
  }
}

function HandleKnifeCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: BOOLEAN, uiCursorFlags: UINT32): UINT8 {
  let sAPCosts: INT16;
  let bFutureAim: INT8;
  let fEnoughPoints: BOOLEAN = TRUE;

  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_MERCS);

  if (fActivated) {
    DetermineCursorBodyLocation(pSoldier.value.ubID, TRUE, TRUE);

    if (gfUIHandleShowMoveGrid) {
      gfUIHandleShowMoveGrid = 2;
    }

    // Calculate action points
    if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
      gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, sGridNo, TRUE, (pSoldier.value.bShownAimTime / 2));
      gfUIDisplayActionPoints = TRUE;
      gfUIDisplayActionPointsCenter = TRUE;

      // If we don't have any points and we are at the first refine, do nothing but warn!
      if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, FALSE)) {
        gfUIDisplayActionPointsInvalid = TRUE;

        if (pSoldier.value.bShownAimTime == REFINE_KNIFE_1) {
          return KNIFE_HIT_UICURSOR;
        }
      }

      bFutureAim = (REFINE_KNIFE_2);

      sAPCosts = CalcTotalAPsToAttack(pSoldier, sGridNo, TRUE, (bFutureAim / 2));

      // Determine if we can afford!
      if (!EnoughPoints(pSoldier, sAPCosts, 0, FALSE)) {
        fEnoughPoints = FALSE;
      }
    }

    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      if (!pSoldier.value.fPauseAim) {
        if (COUNTERDONE(NONGUNTARGETREFINE)) {
          // Reset counter
          RESETCOUNTER(NONGUNTARGETREFINE);

          if (pSoldier.value.bShownAimTime == REFINE_KNIFE_1) {
            PlayJA2Sample(TARG_REFINE_BEEP, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
          }

          pSoldier.value.bShownAimTime = REFINE_KNIFE_2;
        }
      }
    }

    switch (pSoldier.value.bShownAimTime) {
      case REFINE_KNIFE_1:

        if (gfDisplayFullCountRing) {
          return KNIFE_YELLOW_AIM1_UICURSOR;
        } else if (fEnoughPoints) {
          return KNIFE_HIT_AIM1_UICURSOR;
        } else {
          return KNIFE_NOGO_AIM1_UICURSOR;
        }
        break;

      case REFINE_KNIFE_2:

        if (gfDisplayFullCountRing) {
          return KNIFE_YELLOW_AIM2_UICURSOR;
        } else if (fEnoughPoints) {
          return KNIFE_HIT_AIM2_UICURSOR;
        } else {
          return KNIFE_NOGO_AIM2_UICURSOR;
        }
        break;

      default:
        Assert(FALSE);
        // no return value!
        return 0;
        break;
    }
  } else {
    gfUIDisplayActionPointsCenter = TRUE;

    // CHECK IF WE ARE ON A GUY ( THAT'S NOT SELECTED )!
    if (gfUIFullTargetFound && !(guiUIFullTargetFlags & SELECTED_MERC)) {
      DetermineCursorBodyLocation(pSoldier.value.ubID, TRUE, TRUE);
      return KNIFE_HIT_UICURSOR;
    } else {
      return KNIFE_REG_UICURSOR;
    }
  }
}

function HandlePunchCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: BOOLEAN, uiCursorFlags: UINT32): UINT8 {
  let sAPCosts: INT16;
  let bFutureAim: INT8;
  let fEnoughPoints: BOOLEAN = TRUE;

  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_MERCS);

  if (fActivated) {
    DetermineCursorBodyLocation(pSoldier.value.ubID, TRUE, TRUE);

    if (gfUIHandleShowMoveGrid) {
      gfUIHandleShowMoveGrid = 2;
    }

    // Calculate action points
    if (gTacticalStatus.uiFlags & TURNBASED) {
      gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, sGridNo, TRUE, (pSoldier.value.bShownAimTime / 2));
      gfUIDisplayActionPoints = TRUE;
      gfUIDisplayActionPointsCenter = TRUE;

      // If we don't have any points and we are at the first refine, do nothing but warn!
      if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, FALSE)) {
        gfUIDisplayActionPointsInvalid = TRUE;

        if (pSoldier.value.bShownAimTime == REFINE_PUNCH_1) {
          return ACTION_PUNCH_RED;
        }
      }

      bFutureAim = (REFINE_PUNCH_2);

      sAPCosts = CalcTotalAPsToAttack(pSoldier, sGridNo, TRUE, (bFutureAim / 2));

      // Determine if we can afford!
      if (!EnoughPoints(pSoldier, sAPCosts, 0, FALSE)) {
        fEnoughPoints = FALSE;
      }
    }

    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      if (!pSoldier.value.fPauseAim) {
        if (COUNTERDONE(NONGUNTARGETREFINE)) {
          // Reset counter
          RESETCOUNTER(NONGUNTARGETREFINE);

          if (pSoldier.value.bShownAimTime == REFINE_PUNCH_1) {
            PlayJA2Sample(TARG_REFINE_BEEP, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
          }

          pSoldier.value.bShownAimTime = REFINE_PUNCH_2;
        }
      }
    }

    switch (pSoldier.value.bShownAimTime) {
      case REFINE_PUNCH_1:

        if (gfDisplayFullCountRing) {
          return ACTION_PUNCH_YELLOW_AIM1_UICURSOR;
        } else if (fEnoughPoints) {
          return ACTION_PUNCH_RED_AIM1_UICURSOR;
        } else {
          return ACTION_PUNCH_NOGO_AIM1_UICURSOR;
        }
        break;

      case REFINE_PUNCH_2:

        if (gfDisplayFullCountRing) {
          return ACTION_PUNCH_YELLOW_AIM2_UICURSOR;
        } else if (fEnoughPoints) {
          return ACTION_PUNCH_RED_AIM2_UICURSOR;
        } else {
          return ACTION_PUNCH_NOGO_AIM2_UICURSOR;
        }
        break;

      default:
        Assert(FALSE);
        // no return value!
        return 0;
        break;
    }
  } else {
    gfUIDisplayActionPointsCenter = TRUE;

    // CHECK IF WE ARE ON A GUY ( THAT'S NOT SELECTED )!
    if (gfUIFullTargetFound && !(guiUIFullTargetFlags & SELECTED_MERC)) {
      DetermineCursorBodyLocation(pSoldier.value.ubID, TRUE, TRUE);
      return ACTION_PUNCH_RED;
    } else {
      return ACTION_PUNCH_GRAY;
    }
  }
}

function HandleAidCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: BOOLEAN, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_MERCSFORAID);

  if (fActivated) {
    return ACTION_FIRSTAID_RED;
  } else {
    // CHECK IF WE ARE ON A GUY ( THAT'S NOT SELECTED )!
    if (gfUIFullTargetFound) // && !( guiUIFullTargetFlags & SELECTED_MERC ) )
    {
      return ACTION_FIRSTAID_RED;
    } else {
      return ACTION_FIRSTAID_GRAY;
    }
  }
}

function HandleActivatedTossCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, ubItemCursor: UINT8): UINT8 {
  return ACTION_TOSS_UICURSOR;
}

function HandleNonActivatedTossCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fRecalc: BOOLEAN, uiCursorFlags: UINT32, ubItemCursor: UINT8): UINT8 {
  let sFinalGridNo: INT16;
  /* static */ let fBadCTGH: BOOLEAN = FALSE;
  let fArmed: BOOLEAN = FALSE;
  let bLevel: INT8;
  let TempObject: OBJECTTYPE;
  let bSlot: INT8;
  let pObj: Pointer<OBJECTTYPE>;
  let bAttachPos: INT8;

  // Check for enough ammo...
  if (ubItemCursor == TRAJECTORYCURS) {
    fArmed = TRUE;

    if (!EnoughAmmo(pSoldier, FALSE, HANDPOS)) {
      // Check if ANY ammo exists.....
      if (FindAmmoToReload(pSoldier, HANDPOS, NO_SLOT) == NO_SLOT) {
        // OK, use BAD reload cursor.....
        return BAD_RELOAD_UICURSOR;
      } else {
        // Check APs to reload...
        gsCurrentActionPoints = GetAPsToAutoReload(pSoldier);

        gfUIDisplayActionPoints = TRUE;
        // gUIDisplayActionPointsOffX = 14;
        // gUIDisplayActionPointsOffY = 7;

        // OK, use GOOD reload cursor.....
        return GOOD_RELOAD_UICURSOR;
      }
    }
  }

  // Add APs....
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    if (ubItemCursor == TRAJECTORYCURS) {
      gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, sGridNo, TRUE, (pSoldier.value.bShownAimTime / 2));
    } else {
      gsCurrentActionPoints = MinAPsToThrow(pSoldier, sGridNo, TRUE);
    }

    gfUIDisplayActionPoints = TRUE;
    gfUIDisplayActionPointsCenter = TRUE;

    // If we don't have any points and we are at the first refine, do nothing but warn!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, FALSE)) {
      gfUIDisplayActionPointsInvalid = TRUE;
    }
  }

  // OK, if we begin to move, reset the cursor...
  if (uiCursorFlags & MOUSE_MOVING) {
    EndPhysicsTrajectoryUI();
  }

  gfUIHandlePhysicsTrajectory = TRUE;

  if (fRecalc) {
    // Calculate chance to throw here.....
    if (sGridNo == pSoldier.value.sGridNo) {
      fBadCTGH = FALSE;
    } else {
      // ATE: Find the object to use...
      memcpy(addressof(TempObject), addressof(pSoldier.value.inv[HANDPOS]), sizeof(OBJECTTYPE));

      // Do we have a launcable?
      pObj = addressof(pSoldier.value.inv[HANDPOS]);
      for (bAttachPos = 0; bAttachPos < MAX_ATTACHMENTS; bAttachPos++) {
        if (pObj.value.usAttachItem[bAttachPos] != NOTHING) {
          if (Item[pObj.value.usAttachItem[bAttachPos]].usItemClass & IC_EXPLOSV) {
            break;
          }
        }
      }
      if (bAttachPos != MAX_ATTACHMENTS) {
        CreateItem(pObj.value.usAttachItem[bAttachPos], pObj.value.bAttachStatus[bAttachPos], addressof(TempObject));
      }

      if (pSoldier.value.bWeaponMode == WM_ATTACHED && FindAttachment(addressof(pSoldier.value.inv[HANDPOS]), UNDER_GLAUNCHER) != NO_SLOT) {
        bSlot = FindAttachment(addressof(pSoldier.value.inv[HANDPOS]), UNDER_GLAUNCHER);

        if (bSlot != NO_SLOT) {
          CreateItem(UNDER_GLAUNCHER, pSoldier.value.inv[HANDPOS].bAttachStatus[bSlot], addressof(TempObject));

          if (!CalculateLaunchItemChanceToGetThrough(pSoldier, addressof(TempObject), sGridNo, gsInterfaceLevel, (gsInterfaceLevel * 256), addressof(sFinalGridNo), fArmed, addressof(bLevel), TRUE)) {
            fBadCTGH = TRUE;
          } else {
            fBadCTGH = FALSE;
          }
          BeginPhysicsTrajectoryUI(sFinalGridNo, bLevel, fBadCTGH);
        }
      } else {
        if (!CalculateLaunchItemChanceToGetThrough(pSoldier, addressof(TempObject), sGridNo, gsInterfaceLevel, (gsInterfaceLevel * 256), addressof(sFinalGridNo), fArmed, addressof(bLevel), TRUE)) {
          fBadCTGH = TRUE;
        } else {
          fBadCTGH = FALSE;
        }
        BeginPhysicsTrajectoryUI(sFinalGridNo, bLevel, fBadCTGH);
      }
    }
  }

  if (fBadCTGH) {
    return BAD_THROW_UICURSOR;
  }
  return GOOD_THROW_UICURSOR;
}

function HandleWirecutterCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_WIREFENCE);

  // Are we over a cuttable fence?
  if (IsCuttableWireFenceAtGridNo(sGridNo) && pSoldier.value.bLevel == 0) {
    return GOOD_WIRECUTTER_UICURSOR;
  }

  return BAD_WIRECUTTER_UICURSOR;
}

function HandleRepairCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_REPAIR);

  // Are we over a cuttable fence?
  if (IsRepairableStructAtGridNo(sGridNo, NULL) && pSoldier.value.bLevel == 0) {
    return GOOD_REPAIR_UICURSOR;
  }

  return BAD_REPAIR_UICURSOR;
}

function HandleRefuelCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_REFUEL);

  // Are we over a cuttable fence?
  if (IsRefuelableStructAtGridNo(sGridNo, NULL) && pSoldier.value.bLevel == 0) {
    return REFUEL_RED_UICURSOR;
  }

  return REFUEL_GREY_UICURSOR;
}

function HandleJarCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_JAR);

  // Are we over a cuttable fence?
  if (IsCorpseAtGridNo(sGridNo, pSoldier.value.bLevel)) {
    return GOOD_JAR_UICURSOR;
  }

  return BAD_JAR_UICURSOR;
}

function HandleTinCanCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  let pStructure: Pointer<STRUCTURE>;
  let sIntTileGridNo: INT16;
  let pIntTile: Pointer<LEVELNODE>;

  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_CAN);

  // Check if a door exists here.....
  pIntTile = GetCurInteractiveTileGridNoAndStructure(addressof(sIntTileGridNo), addressof(pStructure));

  // We should not have null here if we are given this flag...
  if (pIntTile != NULL) {
    if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
      return PLACE_TINCAN_GREY_UICURSOR;
    }
  }

  return PLACE_TINCAN_RED_UICURSOR;
}

function HandleRemoteCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: BOOLEAN, uiCursorFlags: UINT32): UINT8 {
  let fEnoughPoints: BOOLEAN = TRUE;

  // Calculate action points
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    gsCurrentActionPoints = GetAPsToUseRemote(pSoldier);
    gfUIDisplayActionPoints = TRUE;
    gfUIDisplayActionPointsCenter = TRUE;

    // If we don't have any points and we are at the first refine, do nothing but warn!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, FALSE)) {
      gfUIDisplayActionPointsInvalid = TRUE;
    }
  }

  if (fActivated) {
    return PLACE_REMOTE_RED_UICURSOR;
  } else {
    return PLACE_REMOTE_GREY_UICURSOR;
  }
}

function HandleBombCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: BOOLEAN, uiCursorFlags: UINT32): UINT8 {
  let fEnoughPoints: BOOLEAN = TRUE;

  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_BOMB);

  // Calculate action points
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    gsCurrentActionPoints = GetTotalAPsToDropBomb(pSoldier, sGridNo);
    gfUIDisplayActionPoints = TRUE;
    gfUIDisplayActionPointsCenter = TRUE;

    // If we don't have any points and we are at the first refine, do nothing but warn!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, FALSE)) {
      gfUIDisplayActionPointsInvalid = TRUE;
    }
  }

  if (fActivated) {
    return PLACE_BOMB_RED_UICURSOR;
  } else {
    return PLACE_BOMB_GREY_UICURSOR;
  }
}

function HandleEndConfirmCursor(pSoldier: Pointer<SOLDIERTYPE>): void {
  let usInHand: UINT16;
  let ubItemCursor: UINT8;

  // LOOK IN GUY'S HAND TO CHECK LOCATION
  usInHand = pSoldier.value.inv[HANDPOS].usItem;

  ubItemCursor = GetActionModeCursor(pSoldier);

  if (ubItemCursor == TOSSCURS) {
    //	EndAimCubeUI( );
  }
}

function HandleLeftClickCursor(pSoldier: Pointer<SOLDIERTYPE>): void {
  let usInHand: UINT16;
  let ubItemCursor: UINT8;
  let sGridNo: INT16;

  // LOOK IN GUY'S HAND TO CHECK LOCATION
  usInHand = pSoldier.value.inv[HANDPOS].usItem;

  ubItemCursor = GetActionModeCursor(pSoldier);

  // OK, if we are i realtime.. goto directly to shoot
  if (((gTacticalStatus.uiFlags & TURNBASED) && !(gTacticalStatus.uiFlags & INCOMBAT)) && ubItemCursor != TOSSCURS && ubItemCursor != TRAJECTORYCURS) {
    // GOTO DIRECTLY TO USING ITEM
    // ( only if not burst mode.. )
    if (!pSoldier.value.bDoBurst) {
      guiPendingOverrideEvent = CA_MERC_SHOOT;
    }
    return;
  }

  if (!GetMouseMapPos(addressof(sGridNo))) {
    return;
  }

  gfUIForceReExamineCursorData = TRUE;

  gfDisplayFullCountRing = FALSE;

  switch (ubItemCursor) {
    case TARGETCURS:

      if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
        pSoldier.value.bShownAimTime = REFINE_AIM_1;
        pSoldier.value.fPauseAim = FALSE;
      } else {
        pSoldier.value.bShownAimTime = REFINE_AIM_1;
        pSoldier.value.fPauseAim = FALSE;
      }
      // Reset counter
      RESETCOUNTER(TARGETREFINE);
      break;

    case PUNCHCURS:

      if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
        pSoldier.value.bShownAimTime = REFINE_PUNCH_1;
        pSoldier.value.fPauseAim = FALSE;
      } else {
        pSoldier.value.bShownAimTime = REFINE_PUNCH_1;
        pSoldier.value.fPauseAim = FALSE;
      }
      // Reset counter
      RESETCOUNTER(NONGUNTARGETREFINE);
      break;

    case KNIFECURS:

      if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
        pSoldier.value.bShownAimTime = REFINE_KNIFE_1;
        pSoldier.value.fPauseAim = FALSE;
      } else {
        pSoldier.value.bShownAimTime = REFINE_KNIFE_1;
        pSoldier.value.fPauseAim = FALSE;
      }
      // Reset counter
      RESETCOUNTER(NONGUNTARGETREFINE);
      break;

    case TOSSCURS:

      // BeginAimCubeUI( pSoldier, sGridNo, (INT8)gsInterfaceLevel, 0, 0 );
      // break;

    default:

      // GOTO DIRECTLY TO USING ITEM
      guiPendingOverrideEvent = CA_MERC_SHOOT;
  }
}

function HandleRightClickAdjustCursor(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: INT16): void {
  let usInHand: UINT16;
  let sAPCosts: INT16;
  let bFutureAim: INT8;
  let ubCursor: UINT8;
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let sGridNo: INT16;
  let bTargetLevel: INT8;

  usInHand = pSoldier.value.inv[HANDPOS].usItem;

  ubCursor = GetActionModeCursor(pSoldier);

  // 'snap' cursor to target tile....
  if (gfUIFullTargetFound) {
    usMapPos = MercPtrs[gusUIFullTargetID].value.sGridNo;
  }

  switch (ubCursor) {
    case TARGETCURS:

      // CHECK IF GUY HAS IN HAND A WEAPON
      if (pSoldier.value.bDoBurst) {
        // Do nothing!
        // pSoldier->bShownAimTime = REFINE_AIM_BURST;
      } else {
        sGridNo = usMapPos;
        bTargetLevel = gsInterfaceLevel;

        // Look for a target here...
        if (gfUIFullTargetFound) {
          // Get target soldier, if one exists
          pTSoldier = MercPtrs[gusUIFullTargetID];
          sGridNo = pTSoldier.value.sGridNo;
          bTargetLevel = pSoldier.value.bLevel;

          if (!HandleCheckForBadChangeToGetThrough(pSoldier, pTSoldier, sGridNo, bTargetLevel)) {
            return;
          }
        }

        bFutureAim = (pSoldier.value.bShownAimTime + 2);

        if (bFutureAim <= REFINE_AIM_5) {
          sAPCosts = CalcTotalAPsToAttack(pSoldier, usMapPos, TRUE, (bFutureAim / 2));

          // Determine if we can afford!
          if (EnoughPoints(pSoldier, sAPCosts, 0, FALSE)) {
            pSoldier.value.bShownAimTime += 2;
            if (pSoldier.value.bShownAimTime > REFINE_AIM_5) {
              pSoldier.value.bShownAimTime = REFINE_AIM_5;
            }
          }
          // Else - goto first level!
          else {
            if (!gfDisplayFullCountRing) {
              gfDisplayFullCountRing = TRUE;
            } else {
              pSoldier.value.bShownAimTime = REFINE_AIM_1;
              gfDisplayFullCountRing = FALSE;
            }
          }
        } else {
          if (!gfDisplayFullCountRing) {
            gfDisplayFullCountRing = TRUE;
          } else {
            pSoldier.value.bShownAimTime = REFINE_AIM_1;
            gfDisplayFullCountRing = FALSE;
          }
        }
      }
      break;

    case PUNCHCURS:

      bFutureAim = (pSoldier.value.bShownAimTime + REFINE_PUNCH_2);

      if (bFutureAim <= REFINE_PUNCH_2) {
        sAPCosts = CalcTotalAPsToAttack(pSoldier, usMapPos, TRUE, (bFutureAim / 2));

        // Determine if we can afford!
        if (EnoughPoints(pSoldier, sAPCosts, 0, FALSE)) {
          pSoldier.value.bShownAimTime += REFINE_PUNCH_2;

          if (pSoldier.value.bShownAimTime > REFINE_PUNCH_2) {
            pSoldier.value.bShownAimTime = REFINE_PUNCH_2;
          }
        }
        // Else - goto first level!
        else {
          if (!gfDisplayFullCountRing) {
            gfDisplayFullCountRing = TRUE;
          } else {
            pSoldier.value.bShownAimTime = REFINE_PUNCH_1;
            gfDisplayFullCountRing = FALSE;
          }
        }
      } else {
        if (!gfDisplayFullCountRing) {
          gfDisplayFullCountRing = TRUE;
        } else {
          pSoldier.value.bShownAimTime = REFINE_PUNCH_1;
          gfDisplayFullCountRing = FALSE;
        }
      }
      break;

    case KNIFECURS:

      bFutureAim = (pSoldier.value.bShownAimTime + REFINE_KNIFE_2);

      if (bFutureAim <= REFINE_KNIFE_2) {
        sAPCosts = CalcTotalAPsToAttack(pSoldier, usMapPos, TRUE, (bFutureAim / 2));

        // Determine if we can afford!
        if (EnoughPoints(pSoldier, sAPCosts, 0, FALSE)) {
          pSoldier.value.bShownAimTime += REFINE_KNIFE_2;

          if (pSoldier.value.bShownAimTime > REFINE_KNIFE_2) {
            pSoldier.value.bShownAimTime = REFINE_KNIFE_2;
          }
        }
        // Else - goto first level!
        else {
          if (!gfDisplayFullCountRing) {
            gfDisplayFullCountRing = TRUE;
          } else {
            pSoldier.value.bShownAimTime = REFINE_KNIFE_1;
            gfDisplayFullCountRing = FALSE;
          }
        }
      } else {
        if (!gfDisplayFullCountRing) {
          gfDisplayFullCountRing = TRUE;
        } else {
          pSoldier.value.bShownAimTime = REFINE_KNIFE_1;
          gfDisplayFullCountRing = FALSE;
        }
      }
      break;

    case TOSSCURS:

      // IncrementAimCubeUI( );
      break;

    default:

      ErasePath(TRUE);
  }
}

function GetActionModeCursor(pSoldier: Pointer<SOLDIERTYPE>): UINT8 {
  let ubCursor: UINT8;
  let usInHand: UINT16;

  // If we are an EPC, do nothing....
  // if ( ( pSoldier->uiStatusFlags & SOLDIER_VEHICLE ) )
  //{
  //	return( INVALIDCURS );
  //}

  // AN EPC is always not - attackable unless they are a robot!
  if (AM_AN_EPC(pSoldier) && !(pSoldier.value.uiStatusFlags & SOLDIER_ROBOT)) {
    return INVALIDCURS;
  }

  // ATE: if a vehicle.... same thing
  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    return INVALIDCURS;
  }

  // If we can't be controlled, returninvalid...
  if (pSoldier.value.uiStatusFlags & SOLDIER_ROBOT) {
    if (!CanRobotBeControlled(pSoldier)) {
      // Display message that robot cannot be controlled....
      return INVALIDCURS;
    }
  }

  // If we are in attach shoot mode, use toss cursor...
  if (pSoldier.value.bWeaponMode == WM_ATTACHED) {
    return TRAJECTORYCURS;
  }

  usInHand = pSoldier.value.inv[HANDPOS].usItem;

  // Start off with what is in our hand
  ubCursor = Item[usInHand].ubCursor;

  // OK, check if what is in our hands has a detonator attachment...
  // Detonators can only be on invalidcurs things...
  if (ubCursor == INVALIDCURS) {
    if (FindAttachment(addressof(pSoldier.value.inv[HANDPOS]), DETONATOR) != ITEM_NOT_FOUND) {
      ubCursor = BOMBCURS;
    } else if (FindAttachment(addressof(pSoldier.value.inv[HANDPOS]), REMDETONATOR) != ITEM_NOT_FOUND) {
      ubCursor = BOMBCURS;
    }
  }

  // Now check our terrain to see if we cannot do the action now...
  if (pSoldier.value.bOverTerrainType == DEEP_WATER) {
    ubCursor = INVALIDCURS;
  }

  // If we are out of breath, no cursor...
  if (pSoldier.value.bBreath < OKBREATH && pSoldier.value.bCollapsed) {
    ubCursor = INVALIDCURS;
  }

  return ubCursor;
}

// Switch on item, display appropriate feedback cursor for a click....
function HandleUICursorRTFeedback(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubItemCursor: UINT8;

  ubItemCursor = GetActionModeCursor(pSoldier);

  switch (ubItemCursor) {
    case TARGETCURS:

      if (pSoldier.value.bDoBurst) {
        // BeginDisplayTimedCursor( ACTION_TARGETREDBURST_UICURSOR, 500 );
      } else {
        if (Item[pSoldier.value.inv[HANDPOS].usItem].usItemClass == IC_THROWING_KNIFE) {
          BeginDisplayTimedCursor(RED_THROW_UICURSOR, 500);
        } else {
          BeginDisplayTimedCursor(ACTION_TARGETRED_UICURSOR, 500);
        }
      }
      break;

    default:

      break;
  }
}
