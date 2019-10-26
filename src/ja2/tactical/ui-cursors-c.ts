namespace ja2 {

let gfCannotGetThrough: boolean = false;
let gfDisplayFullCountRing: boolean = false;

export function GetMouseRecalcAndShowAPFlags(puiCursorFlags: Pointer<UINT32>, pfShowAPs: Pointer<boolean>): boolean {
  let uiCursorFlags: UINT32;
  /* static */ let fDoNewTile: boolean = false;
  let fRecalc: boolean = false;
  let fShowAPs: boolean = false;

  // SET FLAGS FOR CERTAIN MOUSE MOVEMENTS
  GetCursorMovementFlags(addressof(uiCursorFlags));

  // Force if we are currently cycling guys...
  if (gfUIForceReExamineCursorData) {
    fDoNewTile = true;
    fRecalc = true;
    gfUIForceReExamineCursorData = false;
  }

  // IF CURSOR IS MOVING
  if (uiCursorFlags & MOUSE_MOVING) {
    // IF CURSOR WAS PREVIOUSLY STATIONARY, MAKE THE ADDITIONAL CHECK OF GRID POS CHANGE
    // if ( uiCursorFlags & MOUSE_MOVING_NEW_TILE )
    {
      // Reset counter
      RESETCOUNTER(Enum386.PATHFINDCOUNTER);
      fDoNewTile = true;
    }
  }

  if (uiCursorFlags & MOUSE_STATIONARY) {
    // ONLY DIPSLAY APS AFTER A DELAY
    if (COUNTERDONE(Enum386.PATHFINDCOUNTER)) {
      // Don't reset counter: One when we move again do we do this!
      fShowAPs = true;

      if (fDoNewTile) {
        fDoNewTile = false;
        fRecalc = true;
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
export function GetProperItemCursor(ubSoldierID: UINT8, ubItemIndex: UINT16, usMapPos: UINT16, fActivated: boolean): UINT8 {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiCursorFlags: UINT32;
  let fShowAPs: boolean = false;
  let fRecalc: boolean = false;
  let sTargetGridNo: INT16 = usMapPos;
  let ubCursorID: UINT8 = 0;
  let ubItemCursor: UINT8;

  pSoldier = MercPtrs[ubSoldierID];

  fRecalc = GetMouseRecalcAndShowAPFlags(addressof(uiCursorFlags), addressof(fShowAPs));

  // ATE: Update attacking weapon!
  // CC has added this attackingWeapon stuff and I need to update it constantly for
  // CTGH algorithms
  if (gTacticalStatus.ubAttackBusyCount == 0 && Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass & IC_WEAPON) {
    pSoldier.value.usAttackingWeapon = pSoldier.value.inv[Enum261.HANDPOS].usItem;
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
      if (gCurrentUIMode == Enum206.ACTION_MODE && (gTacticalStatus.uiFlags & INCOMBAT)) {
        // Alrighty, let's change the cursor!
        if (fRecalc && gfUIFullTargetFound) {
          // ATE: Check for ammo
          if (IsValidTargetMerc(gusUIFullTargetID) && EnoughAmmo(pSoldier, false, Enum261.HANDPOS)) {
            // IF it's an ememy, goto confirm action mode
            if ((guiUIFullTargetFlags & ENEMY_MERC) && (guiUIFullTargetFlags & VISIBLE_MERC) && !(guiUIFullTargetFlags & DEAD_MERC) && !gfCannotGetThrough) {
              guiPendingOverrideEvent = Enum207.A_CHANGE_TO_CONFIM_ACTION;
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

      ubCursorID = Enum210.INVALID_ACTION_UICURSOR;
      break;
  }

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (gfUIFullTargetFound) {
      PauseRT(true);
    } else {
      PauseRT(false);
    }
  }

  return ubCursorID;
}

function HandleActivatedTargetCursor(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: UINT16, fShowAPs: boolean, fRecalc: boolean, uiCursorFlags: UINT32): UINT8 {
  let switchVal: UINT8;
  let fEnoughPoints: boolean = true;
  let bFutureAim: UINT8;
  let sAPCosts: INT16;
  let usCursor: UINT16 = 0;
  let fMaxPointLimitHit: boolean = false;
  let usInHand: UINT16;

  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  if (Item[usInHand].usItemClass != IC_THROWING_KNIFE) {
    // If we are in realtime, follow!
    if ((!(gTacticalStatus.uiFlags & INCOMBAT))) {
      if ((gAnimControl[MercPtrs[gusSelectedSoldier].value.usAnimState].uiFlags & ANIM_STATIONARY)) {
        if (gUITargetShotWaiting) {
          guiPendingOverrideEvent = Enum207.CA_MERC_SHOOT;
        }
      }

      // SoldierFollowGridNo( pSoldier, usMapPos );
    }

    // Check if we are reloading
    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      if (pSoldier.value.fReloading || pSoldier.value.fPauseAim) {
        return Enum210.ACTION_TARGET_RELOADING;
      }
    }
  }

  // Determine where we are shooting / aiming
  // if ( fRecalc )
  { DetermineCursorBodyLocation(gusSelectedSoldier, true, true); }

  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, usMapPos, true, (pSoldier.value.bShownAimTime / 2));
    gfUIDisplayActionPoints = true;
    gfUIDisplayActionPointsCenter = true;

    // If we don't have any points and we are at the first refine, do nothing but warn!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
      gfUIDisplayActionPointsInvalid = true;

      fMaxPointLimitHit = true;
    } else {
      bFutureAim = (pSoldier.value.bShownAimTime + 2);

      if (bFutureAim <= REFINE_AIM_5) {
        sAPCosts = MinAPsToAttack(pSoldier, usMapPos, true) + (bFutureAim / 2);

        // Determine if we can afford!
        if (!EnoughPoints(pSoldier, sAPCosts, 0, false)) {
          fEnoughPoints = false;
        }
      }
    }
  }

  if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
    if (!pSoldier.value.fPauseAim) {
      if (COUNTERDONE(Enum386.TARGETREFINE)) {
        // Reset counter
        RESETCOUNTER(Enum386.TARGETREFINE);

        if (pSoldier.value.bDoBurst) {
          pSoldier.value.bShownAimTime = REFINE_AIM_BURST;
        } else {
          pSoldier.value.bShownAimTime++;

          if (pSoldier.value.bShownAimTime > REFINE_AIM_5) {
            pSoldier.value.bShownAimTime = REFINE_AIM_5;
          } else {
            if (pSoldier.value.bShownAimTime % 2) {
              PlayJA2Sample(Enum330.TARG_REFINE_BEEP, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
            }
          }
        }
      }
    }
  }

  if (fRecalc) {
    if (gusUIFullTargetID != NOBODY) {
      if (SoldierToSoldierBodyPartChanceToGetThrough(pSoldier, MercPtrs[gusUIFullTargetID], pSoldier.value.bAimShotLocation) < OK_CHANCE_TO_GET_THROUGH) {
        gfCannotGetThrough = true;
      } else {
        gfCannotGetThrough = false;
      }
    } else {
      if (SoldierToLocationChanceToGetThrough(pSoldier, usMapPos, gsInterfaceLevel, pSoldier.value.bTargetCubeLevel, NOBODY) < OK_CHANCE_TO_GET_THROUGH) {
        gfCannotGetThrough = true;
      } else {
        gfCannotGetThrough = false;
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
      usCursor = Enum210.ACTION_TARGETREDBURST_UICURSOR;
    } else if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
      usCursor = Enum210.RED_THROW_UICURSOR;
    } else {
      usCursor = Enum210.ACTION_TARGETRED_UICURSOR;
    }
  } else if (pSoldier.value.bDoBurst) {
    if (pSoldier.value.fDoSpread) {
      usCursor = Enum210.ACTION_TARGETREDBURST_UICURSOR;
    } else {
      usCursor = Enum210.ACTION_TARGETCONFIRMBURST_UICURSOR;
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
            usCursor = Enum210.ACTION_THROWAIMYELLOW1_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_THROWAIM1_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_THROWAIMCANT1_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_TARGETAIMYELLOW1_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_TARGETAIM1_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_TARGETAIMCANT1_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_2:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_THROWAIMYELLOW2_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_THROWAIM3_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_THROWAIMCANT2_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_TARGETAIMYELLOW2_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_TARGETAIM3_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_TARGETAIMCANT2_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_3:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_THROWAIMYELLOW3_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_THROWAIM5_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_THROWAIMCANT3_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_TARGETAIMYELLOW3_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_TARGETAIM5_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_TARGETAIMCANT3_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_4:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_THROWAIMYELLOW4_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_THROWAIM7_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_THROWAIMCANT4_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_TARGETAIMYELLOW4_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_TARGETAIM7_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_TARGETAIMCANT4_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_5:

        if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_THROWAIMFULL_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_THROWAIM9_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_THROWAIMCANT5_UICURSOR;
          }
        } else {
          if (gfDisplayFullCountRing) {
            usCursor = Enum210.ACTION_TARGETAIMFULL_UICURSOR;
          } else if (fEnoughPoints) {
            usCursor = Enum210.ACTION_TARGETAIM9_UICURSOR;
          } else {
            usCursor = Enum210.ACTION_TARGETAIMCANT5_UICURSOR;
          }
        }
        break;

      case REFINE_AIM_MID1:

        usCursor = Enum210.ACTION_TARGETAIM2_UICURSOR;
        break;

      case REFINE_AIM_MID2:

        usCursor = Enum210.ACTION_TARGETAIM4_UICURSOR;
        break;

      case REFINE_AIM_MID3:

        usCursor = Enum210.ACTION_TARGETAIM6_UICURSOR;
        break;

      case REFINE_AIM_MID4:
        usCursor = Enum210.ACTION_TARGETAIM8_UICURSOR;
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

function HandleNonActivatedTargetCursor(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: UINT16, fShowAPs: boolean, fRecalc: boolean, uiCursorFlags: UINT32): UINT8 {
  let usInHand: UINT16;

  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  if (Item[usInHand].usItemClass != IC_THROWING_KNIFE) {
    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      // DetermineCursorBodyLocation( (UINT8)gusSelectedSoldier, FALSE, fRecalc );
      DetermineCursorBodyLocation(gusSelectedSoldier, fShowAPs, fRecalc);

      if (pSoldier.value.fReloading || pSoldier.value.fPauseAim) {
        return Enum210.ACTION_TARGET_RELOADING;
      }
    }

    // Check for enough ammo...
    if (!EnoughAmmo(pSoldier, false, Enum261.HANDPOS)) {
      // Check if ANY ammo exists.....
      if (FindAmmoToReload(pSoldier, Enum261.HANDPOS, NO_SLOT) == NO_SLOT) {
        // OK, use BAD reload cursor.....
        return Enum210.BAD_RELOAD_UICURSOR;
      } else {
        // Check APs to reload...
        gsCurrentActionPoints = GetAPsToAutoReload(pSoldier);

        gfUIDisplayActionPoints = true;
        // gUIDisplayActionPointsOffX = 14;
        // gUIDisplayActionPointsOffY = 7;

        // OK, use GOOD reload cursor.....
        return Enum210.GOOD_RELOAD_UICURSOR;
      }
    }
  }

  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    DetermineCursorBodyLocation(gusSelectedSoldier, fShowAPs, fRecalc);

    gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, usMapPos, true, (pSoldier.value.bShownAimTime / 2));

    gfUIDisplayActionPoints = true;
    gfUIDisplayActionPointsCenter = true;

    if (fShowAPs) {
      if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
        gfUIDisplayActionPointsInvalid = true;
      }
    } else {
      // gfUIDisplayActionPointsBlack = TRUE;
      gfUIDisplayActionPoints = false;
    }
  }

  // if ( gTacticalStatus.uiFlags & TURNBASED && !(gTacticalStatus.uiFlags & INCOMBAT ) )
  {
    if (fRecalc) {
      if (SoldierToLocationChanceToGetThrough(pSoldier, usMapPos, gsInterfaceLevel, pSoldier.value.bTargetCubeLevel, NOBODY) < OK_CHANCE_TO_GET_THROUGH) {
        gfCannotGetThrough = true;
      } else {
        gfCannotGetThrough = false;
      }
    }

    // OK, if we begin to move, reset the cursor...
    if (uiCursorFlags & MOUSE_MOVING) {
      gfCannotGetThrough = false;
    }

    if (gfCannotGetThrough) {
      if (pSoldier.value.bDoBurst) {
        return Enum210.ACTION_NOCHANCE_BURST_UICURSOR;
      } else if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
        return Enum210.BAD_THROW_UICURSOR;
      } else {
        return Enum210.ACTION_NOCHANCE_SHOOT_UICURSOR;
      }
    }
  }

  // Determine if good range
  if (!InRange(pSoldier, usMapPos)) {
    // Flash cursor!
    // Check if we're in burst mode!
    if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
      return Enum210.FLASH_THROW_UICURSOR;
    } else if (pSoldier.value.bDoBurst) {
      // return( ACTION_FIRSTAID_RED );
      return Enum210.ACTION_FLASH_BURST_UICURSOR;
    } else {
      // return( ACTION_FIRSTAID_RED );
      return Enum210.ACTION_FLASH_SHOOT_UICURSOR;
    }
  } else {
    // Check if we're in burst mode!
    if (Item[usInHand].usItemClass == IC_THROWING_KNIFE) {
      return Enum210.GOOD_THROW_UICURSOR;
    } else if (pSoldier.value.bDoBurst) {
      // return( ACTION_FIRSTAID_RED );
      return Enum210.ACTION_TARGETBURST_UICURSOR;
    } else {
      // return( ACTION_FIRSTAID_RED );
      return Enum210.ACTION_SHOOT_UICURSOR;
    }
  }
}

function DetermineCursorBodyLocation(ubSoldierID: UINT8, fDisplay: boolean, fRecalc: boolean): void {
  let usMapPos: UINT16;
  let pTargetSoldier: Pointer<SOLDIERTYPE> = null;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usFlags: UINT16;
  let sMouseX: INT16;
  let sMouseY: INT16;
  let sCellX: INT16;
  let sCellY: INT16;
  let sScreenX: INT16;
  let sScreenY: INT16;
  let fOnGuy: boolean = false;
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
    pNode = GetAnimProfileFlags(usMapPos, addressof(usFlags), addressof(pTargetSoldier), null);

    while (pNode != null) {
      if (pTargetSoldier != null) {
        // ATE: Check their stance - if prone - return!
        if (gAnimControl[pTargetSoldier.value.usAnimState].ubHeight == ANIM_PRONE) {
          return;
        }

        fOnGuy = true;

        // Check if we have a half tile profile
        if (usFlags & TILE_FLAG_NORTH_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          if (sCellY > (CELL_Y_SIZE / 2)) {
            fOnGuy = false;
          }
        }
        // Check if we have a half tile profile
        if (usFlags & TILE_FLAG_SOUTH_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          if (sCellY <= (CELL_Y_SIZE / 2)) {
            fOnGuy = false;
          }
        }
        // Check if we have a half tile profile
        if (usFlags & TILE_FLAG_WEST_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          if (sCellX > (CELL_X_SIZE / 2)) {
            fOnGuy = false;
          }
        }
        if (usFlags & TILE_FLAG_EAST_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          if (sCellX <= (CELL_X_SIZE / 2)) {
            fOnGuy = false;
          }
        }
        if (usFlags & TILE_FLAG_TOP_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          // Convert these to screen corrdinates
          FromCellToScreenCoordinates(sCellX, sCellY, addressof(sScreenX), addressof(sScreenY));

          // Check for Below...
          if (sScreenX > (WORLD_TILE_Y / 2)) {
            fOnGuy = false;
          }
        }
        if (usFlags & TILE_FLAG_BOTTOM_HALF) {
          // Check if we are in north half of tile!
          GetMouseXYWithRemainder(addressof(sMouseX), addressof(sMouseY), addressof(sCellX), addressof(sCellY));

          // Convert these to screen corrdinates
          FromCellToScreenCoordinates(sCellX, sCellY, addressof(sScreenX), addressof(sScreenY));

          // Check for Below...
          if (sScreenX <= (WORLD_TILE_Y / 2)) {
            fOnGuy = false;
          }
        }

        // Check if mouse is iin bounding box of soldier
        if (!IsPointInSoldierBoundingBox(pTargetSoldier, gusMouseXPos, gusMouseYPos)) {
          fOnGuy = false;
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
          fOnGuy = true;
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

      if (pTargetSoldier.value.ubBodyType == Enum194.CROW) {
        pSoldier.value.bAimShotLocation = AIM_SHOT_LEGS;

        wcscpy(gzLocation, TacticalStr[Enum335.CROW_HIT_LOCATION_STR]);

        gfUIBodyHitLocation = true;
        return;
      }

      if (!IS_MERC_BODY_TYPE(pTargetSoldier)) {
        return;
      }

      switch (pSoldier.value.bAimShotLocation) {
        case AIM_SHOT_HEAD:

          // If we have a knife in hand, change string
          if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_BLADE) {
            wcscpy(gzLocation, TacticalStr[Enum335.NECK_HIT_LOCATION_STR]);
          } else {
            wcscpy(gzLocation, TacticalStr[Enum335.HEAD_HIT_LOCATION_STR]);
          }
          gfUIBodyHitLocation = true;
          break;

        case AIM_SHOT_TORSO:
          wcscpy(gzLocation, TacticalStr[Enum335.TORSO_HIT_LOCATION_STR]);
          gfUIBodyHitLocation = true;
          break;

        case AIM_SHOT_LEGS:
          wcscpy(gzLocation, TacticalStr[Enum335.LEGS_HIT_LOCATION_STR]);
          gfUIBodyHitLocation = true;
          break;
      }
    }
  }
}

function HandleKnifeCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: boolean, uiCursorFlags: UINT32): UINT8 {
  let sAPCosts: INT16;
  let bFutureAim: INT8;
  let fEnoughPoints: boolean = true;

  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_MERCS);

  if (fActivated) {
    DetermineCursorBodyLocation(pSoldier.value.ubID, true, true);

    if (gfUIHandleShowMoveGrid) {
      gfUIHandleShowMoveGrid = 2;
    }

    // Calculate action points
    if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
      gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, sGridNo, true, (pSoldier.value.bShownAimTime / 2));
      gfUIDisplayActionPoints = true;
      gfUIDisplayActionPointsCenter = true;

      // If we don't have any points and we are at the first refine, do nothing but warn!
      if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
        gfUIDisplayActionPointsInvalid = true;

        if (pSoldier.value.bShownAimTime == REFINE_KNIFE_1) {
          return Enum210.KNIFE_HIT_UICURSOR;
        }
      }

      bFutureAim = (REFINE_KNIFE_2);

      sAPCosts = CalcTotalAPsToAttack(pSoldier, sGridNo, true, (bFutureAim / 2));

      // Determine if we can afford!
      if (!EnoughPoints(pSoldier, sAPCosts, 0, false)) {
        fEnoughPoints = false;
      }
    }

    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      if (!pSoldier.value.fPauseAim) {
        if (COUNTERDONE(Enum386.NONGUNTARGETREFINE)) {
          // Reset counter
          RESETCOUNTER(Enum386.NONGUNTARGETREFINE);

          if (pSoldier.value.bShownAimTime == REFINE_KNIFE_1) {
            PlayJA2Sample(Enum330.TARG_REFINE_BEEP, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
          }

          pSoldier.value.bShownAimTime = REFINE_KNIFE_2;
        }
      }
    }

    switch (pSoldier.value.bShownAimTime) {
      case REFINE_KNIFE_1:

        if (gfDisplayFullCountRing) {
          return Enum210.KNIFE_YELLOW_AIM1_UICURSOR;
        } else if (fEnoughPoints) {
          return Enum210.KNIFE_HIT_AIM1_UICURSOR;
        } else {
          return Enum210.KNIFE_NOGO_AIM1_UICURSOR;
        }
        break;

      case REFINE_KNIFE_2:

        if (gfDisplayFullCountRing) {
          return Enum210.KNIFE_YELLOW_AIM2_UICURSOR;
        } else if (fEnoughPoints) {
          return Enum210.KNIFE_HIT_AIM2_UICURSOR;
        } else {
          return Enum210.KNIFE_NOGO_AIM2_UICURSOR;
        }
        break;

      default:
        Assert(false);
        // no return value!
        return 0;
        break;
    }
  } else {
    gfUIDisplayActionPointsCenter = true;

    // CHECK IF WE ARE ON A GUY ( THAT'S NOT SELECTED )!
    if (gfUIFullTargetFound && !(guiUIFullTargetFlags & SELECTED_MERC)) {
      DetermineCursorBodyLocation(pSoldier.value.ubID, true, true);
      return Enum210.KNIFE_HIT_UICURSOR;
    } else {
      return Enum210.KNIFE_REG_UICURSOR;
    }
  }
}

function HandlePunchCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: boolean, uiCursorFlags: UINT32): UINT8 {
  let sAPCosts: INT16;
  let bFutureAim: INT8;
  let fEnoughPoints: boolean = true;

  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_MERCS);

  if (fActivated) {
    DetermineCursorBodyLocation(pSoldier.value.ubID, true, true);

    if (gfUIHandleShowMoveGrid) {
      gfUIHandleShowMoveGrid = 2;
    }

    // Calculate action points
    if (gTacticalStatus.uiFlags & TURNBASED) {
      gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, sGridNo, true, (pSoldier.value.bShownAimTime / 2));
      gfUIDisplayActionPoints = true;
      gfUIDisplayActionPointsCenter = true;

      // If we don't have any points and we are at the first refine, do nothing but warn!
      if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
        gfUIDisplayActionPointsInvalid = true;

        if (pSoldier.value.bShownAimTime == REFINE_PUNCH_1) {
          return Enum210.ACTION_PUNCH_RED;
        }
      }

      bFutureAim = (REFINE_PUNCH_2);

      sAPCosts = CalcTotalAPsToAttack(pSoldier, sGridNo, true, (bFutureAim / 2));

      // Determine if we can afford!
      if (!EnoughPoints(pSoldier, sAPCosts, 0, false)) {
        fEnoughPoints = false;
      }
    }

    if (((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT))) {
      if (!pSoldier.value.fPauseAim) {
        if (COUNTERDONE(Enum386.NONGUNTARGETREFINE)) {
          // Reset counter
          RESETCOUNTER(Enum386.NONGUNTARGETREFINE);

          if (pSoldier.value.bShownAimTime == REFINE_PUNCH_1) {
            PlayJA2Sample(Enum330.TARG_REFINE_BEEP, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);
          }

          pSoldier.value.bShownAimTime = REFINE_PUNCH_2;
        }
      }
    }

    switch (pSoldier.value.bShownAimTime) {
      case REFINE_PUNCH_1:

        if (gfDisplayFullCountRing) {
          return Enum210.ACTION_PUNCH_YELLOW_AIM1_UICURSOR;
        } else if (fEnoughPoints) {
          return Enum210.ACTION_PUNCH_RED_AIM1_UICURSOR;
        } else {
          return Enum210.ACTION_PUNCH_NOGO_AIM1_UICURSOR;
        }
        break;

      case REFINE_PUNCH_2:

        if (gfDisplayFullCountRing) {
          return Enum210.ACTION_PUNCH_YELLOW_AIM2_UICURSOR;
        } else if (fEnoughPoints) {
          return Enum210.ACTION_PUNCH_RED_AIM2_UICURSOR;
        } else {
          return Enum210.ACTION_PUNCH_NOGO_AIM2_UICURSOR;
        }
        break;

      default:
        Assert(false);
        // no return value!
        return 0;
        break;
    }
  } else {
    gfUIDisplayActionPointsCenter = true;

    // CHECK IF WE ARE ON A GUY ( THAT'S NOT SELECTED )!
    if (gfUIFullTargetFound && !(guiUIFullTargetFlags & SELECTED_MERC)) {
      DetermineCursorBodyLocation(pSoldier.value.ubID, true, true);
      return Enum210.ACTION_PUNCH_RED;
    } else {
      return Enum210.ACTION_PUNCH_GRAY;
    }
  }
}

function HandleAidCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: boolean, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_MERCSFORAID);

  if (fActivated) {
    return Enum210.ACTION_FIRSTAID_RED;
  } else {
    // CHECK IF WE ARE ON A GUY ( THAT'S NOT SELECTED )!
    if (gfUIFullTargetFound) // && !( guiUIFullTargetFlags & SELECTED_MERC ) )
    {
      return Enum210.ACTION_FIRSTAID_RED;
    } else {
      return Enum210.ACTION_FIRSTAID_GRAY;
    }
  }
}

function HandleActivatedTossCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, ubItemCursor: UINT8): UINT8 {
  return Enum210.ACTION_TOSS_UICURSOR;
}

function HandleNonActivatedTossCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fRecalc: boolean, uiCursorFlags: UINT32, ubItemCursor: UINT8): UINT8 {
  let sFinalGridNo: INT16;
  /* static */ let fBadCTGH: boolean = false;
  let fArmed: boolean = false;
  let bLevel: INT8;
  let TempObject: OBJECTTYPE;
  let bSlot: INT8;
  let pObj: Pointer<OBJECTTYPE>;
  let bAttachPos: INT8;

  // Check for enough ammo...
  if (ubItemCursor == TRAJECTORYCURS) {
    fArmed = true;

    if (!EnoughAmmo(pSoldier, false, Enum261.HANDPOS)) {
      // Check if ANY ammo exists.....
      if (FindAmmoToReload(pSoldier, Enum261.HANDPOS, NO_SLOT) == NO_SLOT) {
        // OK, use BAD reload cursor.....
        return Enum210.BAD_RELOAD_UICURSOR;
      } else {
        // Check APs to reload...
        gsCurrentActionPoints = GetAPsToAutoReload(pSoldier);

        gfUIDisplayActionPoints = true;
        // gUIDisplayActionPointsOffX = 14;
        // gUIDisplayActionPointsOffY = 7;

        // OK, use GOOD reload cursor.....
        return Enum210.GOOD_RELOAD_UICURSOR;
      }
    }
  }

  // Add APs....
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    if (ubItemCursor == TRAJECTORYCURS) {
      gsCurrentActionPoints = CalcTotalAPsToAttack(pSoldier, sGridNo, true, (pSoldier.value.bShownAimTime / 2));
    } else {
      gsCurrentActionPoints = MinAPsToThrow(pSoldier, sGridNo, true);
    }

    gfUIDisplayActionPoints = true;
    gfUIDisplayActionPointsCenter = true;

    // If we don't have any points and we are at the first refine, do nothing but warn!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
      gfUIDisplayActionPointsInvalid = true;
    }
  }

  // OK, if we begin to move, reset the cursor...
  if (uiCursorFlags & MOUSE_MOVING) {
    EndPhysicsTrajectoryUI();
  }

  gfUIHandlePhysicsTrajectory = true;

  if (fRecalc) {
    // Calculate chance to throw here.....
    if (sGridNo == pSoldier.value.sGridNo) {
      fBadCTGH = false;
    } else {
      // ATE: Find the object to use...
      memcpy(addressof(TempObject), addressof(pSoldier.value.inv[Enum261.HANDPOS]), sizeof(OBJECTTYPE));

      // Do we have a launcable?
      pObj = addressof(pSoldier.value.inv[Enum261.HANDPOS]);
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

      if (pSoldier.value.bWeaponMode == Enum265.WM_ATTACHED && FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.UNDER_GLAUNCHER) != NO_SLOT) {
        bSlot = FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.UNDER_GLAUNCHER);

        if (bSlot != NO_SLOT) {
          CreateItem(Enum225.UNDER_GLAUNCHER, pSoldier.value.inv[Enum261.HANDPOS].bAttachStatus[bSlot], addressof(TempObject));

          if (!CalculateLaunchItemChanceToGetThrough(pSoldier, addressof(TempObject), sGridNo, gsInterfaceLevel, (gsInterfaceLevel * 256), addressof(sFinalGridNo), fArmed, addressof(bLevel), true)) {
            fBadCTGH = true;
          } else {
            fBadCTGH = false;
          }
          BeginPhysicsTrajectoryUI(sFinalGridNo, bLevel, fBadCTGH);
        }
      } else {
        if (!CalculateLaunchItemChanceToGetThrough(pSoldier, addressof(TempObject), sGridNo, gsInterfaceLevel, (gsInterfaceLevel * 256), addressof(sFinalGridNo), fArmed, addressof(bLevel), true)) {
          fBadCTGH = true;
        } else {
          fBadCTGH = false;
        }
        BeginPhysicsTrajectoryUI(sFinalGridNo, bLevel, fBadCTGH);
      }
    }
  }

  if (fBadCTGH) {
    return Enum210.BAD_THROW_UICURSOR;
  }
  return Enum210.GOOD_THROW_UICURSOR;
}

function HandleWirecutterCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_WIREFENCE);

  // Are we over a cuttable fence?
  if (IsCuttableWireFenceAtGridNo(sGridNo) && pSoldier.value.bLevel == 0) {
    return Enum210.GOOD_WIRECUTTER_UICURSOR;
  }

  return Enum210.BAD_WIRECUTTER_UICURSOR;
}

function HandleRepairCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_REPAIR);

  // Are we over a cuttable fence?
  if (IsRepairableStructAtGridNo(sGridNo, null) && pSoldier.value.bLevel == 0) {
    return Enum210.GOOD_REPAIR_UICURSOR;
  }

  return Enum210.BAD_REPAIR_UICURSOR;
}

function HandleRefuelCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_REFUEL);

  // Are we over a cuttable fence?
  if (IsRefuelableStructAtGridNo(sGridNo, null) && pSoldier.value.bLevel == 0) {
    return Enum210.REFUEL_RED_UICURSOR;
  }

  return Enum210.REFUEL_GREY_UICURSOR;
}

function HandleJarCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, uiCursorFlags: UINT32): UINT8 {
  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_JAR);

  // Are we over a cuttable fence?
  if (IsCorpseAtGridNo(sGridNo, pSoldier.value.bLevel)) {
    return Enum210.GOOD_JAR_UICURSOR;
  }

  return Enum210.BAD_JAR_UICURSOR;
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
  if (pIntTile != null) {
    if (pStructure.value.fFlags & STRUCTURE_ANYDOOR) {
      return Enum210.PLACE_TINCAN_GREY_UICURSOR;
    }
  }

  return Enum210.PLACE_TINCAN_RED_UICURSOR;
}

function HandleRemoteCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: boolean, uiCursorFlags: UINT32): UINT8 {
  let fEnoughPoints: boolean = true;

  // Calculate action points
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    gsCurrentActionPoints = GetAPsToUseRemote(pSoldier);
    gfUIDisplayActionPoints = true;
    gfUIDisplayActionPointsCenter = true;

    // If we don't have any points and we are at the first refine, do nothing but warn!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
      gfUIDisplayActionPointsInvalid = true;
    }
  }

  if (fActivated) {
    return Enum210.PLACE_REMOTE_RED_UICURSOR;
  } else {
    return Enum210.PLACE_REMOTE_GREY_UICURSOR;
  }
}

function HandleBombCursor(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: UINT16, fActivated: boolean, uiCursorFlags: UINT32): UINT8 {
  let fEnoughPoints: boolean = true;

  // DRAW PATH TO GUY
  HandleUIMovementCursor(pSoldier, uiCursorFlags, sGridNo, MOVEUI_TARGET_BOMB);

  // Calculate action points
  if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
    gsCurrentActionPoints = GetTotalAPsToDropBomb(pSoldier, sGridNo);
    gfUIDisplayActionPoints = true;
    gfUIDisplayActionPointsCenter = true;

    // If we don't have any points and we are at the first refine, do nothing but warn!
    if (!EnoughPoints(pSoldier, gsCurrentActionPoints, 0, false)) {
      gfUIDisplayActionPointsInvalid = true;
    }
  }

  if (fActivated) {
    return Enum210.PLACE_BOMB_RED_UICURSOR;
  } else {
    return Enum210.PLACE_BOMB_GREY_UICURSOR;
  }
}

export function HandleEndConfirmCursor(pSoldier: Pointer<SOLDIERTYPE>): void {
  let usInHand: UINT16;
  let ubItemCursor: UINT8;

  // LOOK IN GUY'S HAND TO CHECK LOCATION
  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  ubItemCursor = GetActionModeCursor(pSoldier);

  if (ubItemCursor == TOSSCURS) {
    //	EndAimCubeUI( );
  }
}

export function HandleLeftClickCursor(pSoldier: Pointer<SOLDIERTYPE>): void {
  let usInHand: UINT16;
  let ubItemCursor: UINT8;
  let sGridNo: INT16;

  // LOOK IN GUY'S HAND TO CHECK LOCATION
  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  ubItemCursor = GetActionModeCursor(pSoldier);

  // OK, if we are i realtime.. goto directly to shoot
  if (((gTacticalStatus.uiFlags & TURNBASED) && !(gTacticalStatus.uiFlags & INCOMBAT)) && ubItemCursor != TOSSCURS && ubItemCursor != TRAJECTORYCURS) {
    // GOTO DIRECTLY TO USING ITEM
    // ( only if not burst mode.. )
    if (!pSoldier.value.bDoBurst) {
      guiPendingOverrideEvent = Enum207.CA_MERC_SHOOT;
    }
    return;
  }

  if (!GetMouseMapPos(addressof(sGridNo))) {
    return;
  }

  gfUIForceReExamineCursorData = true;

  gfDisplayFullCountRing = false;

  switch (ubItemCursor) {
    case TARGETCURS:

      if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
        pSoldier.value.bShownAimTime = REFINE_AIM_1;
        pSoldier.value.fPauseAim = false;
      } else {
        pSoldier.value.bShownAimTime = REFINE_AIM_1;
        pSoldier.value.fPauseAim = false;
      }
      // Reset counter
      RESETCOUNTER(Enum386.TARGETREFINE);
      break;

    case PUNCHCURS:

      if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
        pSoldier.value.bShownAimTime = REFINE_PUNCH_1;
        pSoldier.value.fPauseAim = false;
      } else {
        pSoldier.value.bShownAimTime = REFINE_PUNCH_1;
        pSoldier.value.fPauseAim = false;
      }
      // Reset counter
      RESETCOUNTER(Enum386.NONGUNTARGETREFINE);
      break;

    case KNIFECURS:

      if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
        pSoldier.value.bShownAimTime = REFINE_KNIFE_1;
        pSoldier.value.fPauseAim = false;
      } else {
        pSoldier.value.bShownAimTime = REFINE_KNIFE_1;
        pSoldier.value.fPauseAim = false;
      }
      // Reset counter
      RESETCOUNTER(Enum386.NONGUNTARGETREFINE);
      break;

    case TOSSCURS:

      // BeginAimCubeUI( pSoldier, sGridNo, (INT8)gsInterfaceLevel, 0, 0 );
      // break;

    default:

      // GOTO DIRECTLY TO USING ITEM
      guiPendingOverrideEvent = Enum207.CA_MERC_SHOOT;
  }
}

export function HandleRightClickAdjustCursor(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: INT16): void {
  let usInHand: UINT16;
  let sAPCosts: INT16;
  let bFutureAim: INT8;
  let ubCursor: UINT8;
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let sGridNo: INT16;
  let bTargetLevel: INT8;

  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

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
          sAPCosts = CalcTotalAPsToAttack(pSoldier, usMapPos, true, (bFutureAim / 2));

          // Determine if we can afford!
          if (EnoughPoints(pSoldier, sAPCosts, 0, false)) {
            pSoldier.value.bShownAimTime += 2;
            if (pSoldier.value.bShownAimTime > REFINE_AIM_5) {
              pSoldier.value.bShownAimTime = REFINE_AIM_5;
            }
          }
          // Else - goto first level!
          else {
            if (!gfDisplayFullCountRing) {
              gfDisplayFullCountRing = true;
            } else {
              pSoldier.value.bShownAimTime = REFINE_AIM_1;
              gfDisplayFullCountRing = false;
            }
          }
        } else {
          if (!gfDisplayFullCountRing) {
            gfDisplayFullCountRing = true;
          } else {
            pSoldier.value.bShownAimTime = REFINE_AIM_1;
            gfDisplayFullCountRing = false;
          }
        }
      }
      break;

    case PUNCHCURS:

      bFutureAim = (pSoldier.value.bShownAimTime + REFINE_PUNCH_2);

      if (bFutureAim <= REFINE_PUNCH_2) {
        sAPCosts = CalcTotalAPsToAttack(pSoldier, usMapPos, true, (bFutureAim / 2));

        // Determine if we can afford!
        if (EnoughPoints(pSoldier, sAPCosts, 0, false)) {
          pSoldier.value.bShownAimTime += REFINE_PUNCH_2;

          if (pSoldier.value.bShownAimTime > REFINE_PUNCH_2) {
            pSoldier.value.bShownAimTime = REFINE_PUNCH_2;
          }
        }
        // Else - goto first level!
        else {
          if (!gfDisplayFullCountRing) {
            gfDisplayFullCountRing = true;
          } else {
            pSoldier.value.bShownAimTime = REFINE_PUNCH_1;
            gfDisplayFullCountRing = false;
          }
        }
      } else {
        if (!gfDisplayFullCountRing) {
          gfDisplayFullCountRing = true;
        } else {
          pSoldier.value.bShownAimTime = REFINE_PUNCH_1;
          gfDisplayFullCountRing = false;
        }
      }
      break;

    case KNIFECURS:

      bFutureAim = (pSoldier.value.bShownAimTime + REFINE_KNIFE_2);

      if (bFutureAim <= REFINE_KNIFE_2) {
        sAPCosts = CalcTotalAPsToAttack(pSoldier, usMapPos, true, (bFutureAim / 2));

        // Determine if we can afford!
        if (EnoughPoints(pSoldier, sAPCosts, 0, false)) {
          pSoldier.value.bShownAimTime += REFINE_KNIFE_2;

          if (pSoldier.value.bShownAimTime > REFINE_KNIFE_2) {
            pSoldier.value.bShownAimTime = REFINE_KNIFE_2;
          }
        }
        // Else - goto first level!
        else {
          if (!gfDisplayFullCountRing) {
            gfDisplayFullCountRing = true;
          } else {
            pSoldier.value.bShownAimTime = REFINE_KNIFE_1;
            gfDisplayFullCountRing = false;
          }
        }
      } else {
        if (!gfDisplayFullCountRing) {
          gfDisplayFullCountRing = true;
        } else {
          pSoldier.value.bShownAimTime = REFINE_KNIFE_1;
          gfDisplayFullCountRing = false;
        }
      }
      break;

    case TOSSCURS:

      // IncrementAimCubeUI( );
      break;

    default:

      ErasePath(true);
  }
}

export function GetActionModeCursor(pSoldier: Pointer<SOLDIERTYPE>): UINT8 {
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
  if (pSoldier.value.bWeaponMode == Enum265.WM_ATTACHED) {
    return TRAJECTORYCURS;
  }

  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  // Start off with what is in our hand
  ubCursor = Item[usInHand].ubCursor;

  // OK, check if what is in our hands has a detonator attachment...
  // Detonators can only be on invalidcurs things...
  if (ubCursor == INVALIDCURS) {
    if (FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.DETONATOR) != ITEM_NOT_FOUND) {
      ubCursor = BOMBCURS;
    } else if (FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
      ubCursor = BOMBCURS;
    }
  }

  // Now check our terrain to see if we cannot do the action now...
  if (pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
    ubCursor = INVALIDCURS;
  }

  // If we are out of breath, no cursor...
  if (pSoldier.value.bBreath < OKBREATH && pSoldier.value.bCollapsed) {
    ubCursor = INVALIDCURS;
  }

  return ubCursor;
}

// Switch on item, display appropriate feedback cursor for a click....
export function HandleUICursorRTFeedback(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubItemCursor: UINT8;

  ubItemCursor = GetActionModeCursor(pSoldier);

  switch (ubItemCursor) {
    case TARGETCURS:

      if (pSoldier.value.bDoBurst) {
        // BeginDisplayTimedCursor( ACTION_TARGETREDBURST_UICURSOR, 500 );
      } else {
        if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_THROWING_KNIFE) {
          BeginDisplayTimedCursor(Enum210.RED_THROW_UICURSOR, 500);
        } else {
          BeginDisplayTimedCursor(Enum210.ACTION_TARGETRED_UICURSOR, 500);
        }
      }
      break;

    default:

      break;
  }
}

}
