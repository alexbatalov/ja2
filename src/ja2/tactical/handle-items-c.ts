namespace ja2 {

const NUM_ITEMS_LISTED = 8;
const NUM_ITEM_FLASH_SLOTS = 50;
const MIN_LOB_RANGE = 6;

let FlashItemSlots: ITEM_POOL_LOCATOR[] /* [NUM_ITEM_FLASH_SLOTS] */;
let guiNumFlashItemSlots: UINT32 = 0;

// Disgusting hacks: have to keep track of these values for accesses in callbacks
/* static */ let gpTempSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;
/* static */ let gsTempGridno: INT16;
/* static */ let bTempFrequency: INT8;

export let gpBoobyTrapSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;
let gpBoobyTrapItemPool: ITEM_POOL /* Pointer<ITEM_POOL> */;
export let gsBoobyTrapGridNo: INT16;
let gbBoobyTrapLevel: INT8;
let gfDisarmingBuriedBomb: boolean;
let gbTrapDifficulty: INT8;
let gfJustFoundBoobyTrap: boolean = false;

export function HandleCheckForBadChangeToGetThrough(pSoldier: SOLDIERTYPE, pTargetSoldier: SOLDIERTYPE | null, sTargetGridNo: INT16, bLevel: INT8): boolean {
  let fBadChangeToGetThrough: boolean = false;

  if (pTargetSoldier != null) {
    if (SoldierToSoldierBodyPartChanceToGetThrough(pSoldier, pTargetSoldier, pSoldier.bAimShotLocation) < OK_CHANCE_TO_GET_THROUGH) {
      fBadChangeToGetThrough = true;
    }
  } else {
    if (SoldierToLocationChanceToGetThrough(pSoldier, sTargetGridNo, bLevel, 0, NOBODY) < OK_CHANCE_TO_GET_THROUGH) {
      fBadChangeToGetThrough = true;
    }
  }

  if (fBadChangeToGetThrough) {
    if (gTacticalStatus.sCantGetThroughSoldierGridNo != pSoldier.sGridNo || gTacticalStatus.sCantGetThroughGridNo != sTargetGridNo || gTacticalStatus.ubCantGetThroughID != pSoldier.ubID) {
      gTacticalStatus.fCantGetThrough = false;
    }

    // Have we done this once already?
    if (!gTacticalStatus.fCantGetThrough) {
      gTacticalStatus.fCantGetThrough = true;
      gTacticalStatus.sCantGetThroughGridNo = sTargetGridNo;
      gTacticalStatus.ubCantGetThroughID = pSoldier.ubID;
      gTacticalStatus.sCantGetThroughSoldierGridNo = pSoldier.sGridNo;

      // PLay quote
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_NO_LINE_OF_FIRE);
      return false;
    } else {
      // Is this a different case?
      if (gTacticalStatus.sCantGetThroughGridNo != sTargetGridNo || gTacticalStatus.ubCantGetThroughID != pSoldier.ubID || gTacticalStatus.sCantGetThroughSoldierGridNo != pSoldier.sGridNo) {
        // PLay quote
        gTacticalStatus.sCantGetThroughGridNo = sTargetGridNo;
        gTacticalStatus.ubCantGetThroughID = pSoldier.ubID;

        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_NO_LINE_OF_FIRE);
        return false;
      }
    }
  } else {
    gTacticalStatus.fCantGetThrough = false;
  }

  return true;
}

export function HandleItem(pSoldier: SOLDIERTYPE, usGridNo: UINT16, bLevel: INT8, usHandItem: UINT16, fFromUI: boolean): INT32 {
  let pTargetSoldier: SOLDIERTYPE | null = null;
  let usSoldierIndex: UINT16;
  let sTargetGridNo: INT16;
  let sAPCost: INT16;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  let sAdjustedGridNo: INT16;
  let fDropBomb: boolean = false;
  let fAddingTurningCost: boolean = false;
  let fAddingRaiseGunCost: boolean = false;
  let pIntNode: LEVELNODE | null;
  let pStructure: STRUCTURE | null;
  let sGridNo: INT16;

  // Remove any previous actions
  pSoldier.ubPendingAction = NO_PENDING_ACTION;

  // here is where we would set a different value if the weapon mode is on
  // "attached weapon"
  pSoldier.usAttackingWeapon = usHandItem;

  // Find soldier flags depend on if it's our own merc firing or a NPC
  // if ( FindSoldier( usGridNo, &usSoldierIndex, &uiMercFlags, FIND_SOLDIER_GRIDNO )  )
  if ((usSoldierIndex = WhoIsThere2(usGridNo, bLevel)) != NO_SOLDIER) {
    pTargetSoldier = MercPtrs[usSoldierIndex];

    if (fFromUI) {
      // ATE: Check if we are targeting an interactive tile, and adjust gridno accordingly...
      pIntNode = GetCurInteractiveTileGridNoAndStructure(addressof(sGridNo), addressof(pStructure));

      if (pIntNode != null && pTargetSoldier == pSoldier) {
        // Truncate target sioldier
        pTargetSoldier = null;
      }
    }
  }

  // ATE: If in realtime, set attacker count to 0...
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Setting attack busy count to 0 due to no combat"));
    gTacticalStatus.ubAttackBusyCount = 0;
  }

  if (pTargetSoldier) {
    pTargetSoldier.bBeingAttackedCount = 0;
  }

  // Check our soldier's life for unconscious!
  if (pSoldier.bLife < OKLIFE) {
    return ITEM_HANDLE_UNCONSCIOUS;
  }

  if (HandItemWorks(pSoldier, Enum261.HANDPOS) == false) {
    return ITEM_HANDLE_BROKEN;
  }

  if (fFromUI && pSoldier.bTeam == gbPlayerNum && pTargetSoldier && (pTargetSoldier.bTeam == gbPlayerNum || pTargetSoldier.bNeutral) && pTargetSoldier.ubBodyType != Enum194.CROW && Item[usHandItem].usItemClass != IC_MEDKIT) {
    if (pSoldier.ubProfile != NO_PROFILE) {
      // nice mercs won't shoot other nice guys or neutral civilians
      if ((gMercProfiles[pSoldier.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_GOODGUY) && ((pTargetSoldier.ubProfile == NO_PROFILE && pTargetSoldier.bNeutral) || gMercProfiles[pTargetSoldier.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_GOODGUY)) {
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_REFUSING_ORDER);
        return ITEM_HANDLE_REFUSAL;
      }
      if (pTargetSoldier.ubProfile != NO_PROFILE) {
        // buddies won't shoot each other
        if (WhichBuddy(pSoldier.ubProfile, pTargetSoldier.ubProfile) != -1) {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_REFUSING_ORDER);
          return ITEM_HANDLE_REFUSAL;
        }
      }

      // any recruited rebel will refuse to fire on another rebel or neutral nameless civ
      if (pSoldier.ubCivilianGroup == Enum246.REBEL_CIV_GROUP && (pTargetSoldier.ubCivilianGroup == Enum246.REBEL_CIV_GROUP || (pTargetSoldier.bNeutral && pTargetSoldier.ubProfile == NO_PROFILE && pTargetSoldier.ubCivilianGroup == Enum246.NON_CIV_GROUP && pTargetSoldier.ubBodyType != Enum194.CROW))) {
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_REFUSING_ORDER);
        return ITEM_HANDLE_REFUSAL;
      }
    }
  }

  // Check HAND ITEM
  if (Item[usHandItem].usItemClass == IC_GUN || Item[usHandItem].usItemClass == IC_THROWING_KNIFE) {
    // WEAPONS
    if (usHandItem == Enum225.ROCKET_RIFLE || usHandItem == Enum225.AUTO_ROCKET_RIFLE) {
      // check imprint ID
      // NB not-imprinted value is NO_PROFILE
      // imprinted value is profile for mercs & NPCs and NO_PROFILE + 1 for generic dudes
      if (pSoldier.ubProfile != NO_PROFILE) {
        if (pSoldier.inv[pSoldier.ubAttackingHand].ubImprintID != pSoldier.ubProfile) {
          if (pSoldier.inv[pSoldier.ubAttackingHand].ubImprintID == NO_PROFILE) {
            // first shot using "virgin" gun... set imprint ID
            pSoldier.inv[pSoldier.ubAttackingHand].ubImprintID = pSoldier.ubProfile;

            // this could be an NPC (Krott)
            if (pSoldier.bTeam == gbPlayerNum) {
              PlayJA2Sample(Enum330.RG_ID_IMPRINTED, RATE_11025, HIGHVOLUME, 1, MIDDLE);

              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "\"%s\"", TacticalStr[Enum335.GUN_GOT_FINGERPRINT]);

              return ITEM_HANDLE_BROKEN;
            }
          } else {
            // access denied!
            if (pSoldier.bTeam == gbPlayerNum) {
              PlayJA2Sample(Enum330.RG_ID_INVALID, RATE_11025, HIGHVOLUME, 1, MIDDLE);

              // if (Random( 100 ) < (UINT32) pSoldier->bWisdom)
              //{
              //	DoMercBattleSound( pSoldier, BATTLE_SOUND_CURSE1 );
              //}
              // else
              //{
              //	TacticalCharacterDialogue( pSoldier, QUOTE_USELESS_ITEM );
              //}
            }
            return ITEM_HANDLE_BROKEN;
          }
        }
      } else {
        // guaranteed not to be controlled by the player, so no feedback required
        if (pSoldier.inv[pSoldier.ubAttackingHand].ubImprintID != (NO_PROFILE + 1)) {
          if (pSoldier.inv[pSoldier.ubAttackingHand].ubImprintID == NO_PROFILE) {
            pSoldier.inv[pSoldier.ubAttackingHand].ubImprintID = (NO_PROFILE + 1);
          } else {
            return ITEM_HANDLE_BROKEN;
          }
        }
      }
    }

    // IF we are not a throwing knife, check for ammo, reloading...
    if (Item[usHandItem].usItemClass != IC_THROWING_KNIFE) {
      // CHECK FOR AMMO!
      if (!EnoughAmmo(pSoldier, fFromUI, Enum261.HANDPOS)) {
        // ATE: Reflect that we need to reset for bursting
        pSoldier.fDoSpread = 0;
        return ITEM_HANDLE_NOAMMO;
      }

      // Check if we are reloading
      if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
        if (pSoldier.fReloading) {
          return ITEM_HANDLE_RELOADING;
        }
      }
    }

    // Get gridno - either soldier's position or the gridno
    if (pTargetSoldier != null) {
      sTargetGridNo = pTargetSoldier.sGridNo;
    } else {
      sTargetGridNo = usGridNo;
    }

    // If it's a player guy, check ChanceToGetThrough to play quote
    if (fFromUI && (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) {
      // Don't do if no spread!
      if (!pSoldier.fDoSpread) {
        if (!HandleCheckForBadChangeToGetThrough(pSoldier, pTargetSoldier, sTargetGridNo, bLevel)) {
          return ITEM_HANDLE_OK;
        }
      }
    }

    // Get AP COSTS
    // ATE: OK something funny going on here - AI seems to NEED FALSE here,
    // Our guys NEED TRUE. We shoulkd at some time make sure the AI and
    // our guys are deducting/checking in the same manner to avoid
    // these differences.
    sAPCost = CalcTotalAPsToAttack(pSoldier, sTargetGridNo, 1, pSoldier.bAimTime);

    GetAPChargeForShootOrStabWRTGunRaises(pSoldier, sTargetGridNo, 1, addressof(fAddingTurningCost), addressof(fAddingRaiseGunCost));

    // If we are standing and are asked to turn AND raise gun, ignore raise gun...
    if (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_STAND) {
      if (fAddingRaiseGunCost) {
        pSoldier.fDontChargeTurningAPs = true;
      }
    } else {
      // If raising gun, don't charge turning!
      if (fAddingTurningCost) {
        pSoldier.fDontChargeReadyAPs = true;
      }
    }

    // If this is a player guy, show message about no APS
    if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
      if ((pSoldier.ubProfile != NO_PROFILE) && (gMercProfiles[pSoldier.ubProfile].bPersonalityTrait == Enum270.PSYCHO)) {
        // psychos might possibly switch to burst if they can
        if (!pSoldier.bDoBurst && IsGunBurstCapable(pSoldier, Enum261.HANDPOS, false)) {
          // chance of firing burst if we have points... chance decreasing when ordered to do aimed shot

          // temporarily set burst to true to calculate action points
          pSoldier.bDoBurst = true;
          sAPCost = CalcTotalAPsToAttack(pSoldier, sTargetGridNo, true, 0);
          // reset burst mode to false (which is what it was at originally)
          pSoldier.bDoBurst = false;

          if (EnoughPoints(pSoldier, sAPCost, 0, false)) {
            // we have enough points to do this burst, roll the dice and see if we want to change
            if (Random(3 + pSoldier.bAimTime) == 0) {
              DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_LAUGH1);
              pSoldier.bDoBurst = true;
              pSoldier.bWeaponMode = Enum265.WM_BURST;

              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[26], pSoldier.name);
            }
          }
        }
      }

      // Deduct points if our target is different!
      // if attacking a new target (or if the specific target is uncertain)

      // DEF:  Made into an event
      //		EVENT_FireSoldierWeapon( pSoldier, sTargetGridNo );
      if (fFromUI) {
        // set the target level; if the AI calls this it will have set the level already...
        pSoldier.bTargetLevel = gsInterfaceLevel;
      }

      if (Item[usHandItem].usItemClass != IC_THROWING_KNIFE) {
        // If doing spread, set down the first gridno.....
        if (pSoldier.fDoSpread) {
          if (pSoldier.sSpreadLocations[0] != 0) {
            SendBeginFireWeaponEvent(pSoldier, pSoldier.sSpreadLocations[0]);
          } else {
            SendBeginFireWeaponEvent(pSoldier, sTargetGridNo);
          }
        } else {
          SendBeginFireWeaponEvent(pSoldier, sTargetGridNo);
        }

        // ATE: Here to make cursor go back to move after LAW shot...
        if (fFromUI && usHandItem == Enum225.ROCKET_LAUNCHER) {
          guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
        }
      } else {
        let ubDirection: UINT8;
        // Start knife throw attack

        // Get direction
        ubDirection = GetDirectionFromGridNo(sTargetGridNo, pSoldier);

        EVENT_SoldierBeginKnifeThrowAttack(pSoldier, sTargetGridNo, ubDirection);
      }

      if (fFromUI) {
        // Descrease aim by two if in real time
        if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
          // pSoldier->bShownAimTime -= 2;
          // if ( pSoldier->bShownAimTime < REFINE_AIM_1 )
          //{
          //		pSoldier->bShownAimTime = REFINE_AIM_1;
          //}
          // pSoldier->fPauseAim = TRUE;
        }

        // If in turn based - refresh aim to first level
        if (gTacticalStatus.uiFlags & TURNBASED && (gTacticalStatus.uiFlags & INCOMBAT)) {
          pSoldier.bShownAimTime = REFINE_AIM_1;

          // Locate to soldier if he's about to shoot!
          if (pSoldier.bTeam != gbPlayerNum) {
            ShowRadioLocator(pSoldier.ubID, SHOW_LOCATOR_NORMAL);
          }
        }
      }

      // OK, set UI
      SetUIBusy(pSoldier.ubID);
    } else {
      return ITEM_HANDLE_NOAPS;
    }

    return ITEM_HANDLE_OK;
  }

  // TRY PUNCHING
  if (Item[usHandItem].usItemClass == IC_PUNCH) {
    let sCnt: INT16;
    let sSpot: INT16;
    let ubGuyThere: UINT8;
    let sGotLocation: INT16 = NOWHERE;
    let fGotAdjacent: boolean = false;

    for (sCnt = 0; sCnt < Enum245.NUM_WORLD_DIRECTIONS; sCnt++) {
      sSpot = NewGridNo(pSoldier.sGridNo, DirectionInc(sCnt));

      // Make sure movement costs are OK....
      if (gubWorldMovementCosts[sSpot][sCnt][bLevel] >= TRAVELCOST_BLOCKED) {
        continue;
      }

      // Check for who is there...
      ubGuyThere = WhoIsThere2(sSpot, pSoldier.bLevel);

      if (pTargetSoldier != null && ubGuyThere == pTargetSoldier.ubID) {
        // We've got a guy here....
        // Who is the one we want......
        sGotLocation = sSpot;
        sAdjustedGridNo = pTargetSoldier.sGridNo;
        ubDirection = sCnt;
        break;
      }
    }

    if (sGotLocation == NOWHERE) {
      // See if we can get there to punch
      sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
      if (sActionGridNo != -1) {
        // OK, we've got somebody...
        sGotLocation = sActionGridNo;

        fGotAdjacent = true;
      }
    }

    // Did we get a loaction?
    if (sGotLocation != NOWHERE) {
      pSoldier.sTargetGridNo = usGridNo;

      pSoldier.usActionData = usGridNo;
      // CHECK IF WE ARE AT THIS GRIDNO NOW
      if (pSoldier.sGridNo != sGotLocation && fGotAdjacent) {
        // SEND PENDING ACTION
        pSoldier.ubPendingAction = Enum257.MERC_PUNCH;
        pSoldier.sPendingActionData2 = sAdjustedGridNo;
        pSoldier.bPendingActionData3 = ubDirection;
        pSoldier.ubPendingActionAnimCount = 0;

        // WALK UP TO DEST FIRST
        EVENT_InternalGetNewSoldierPath(pSoldier, sGotLocation, pSoldier.usUIMovementMode, false, true);
      } else {
        pSoldier.bAction = Enum289.AI_ACTION_KNIFE_STAB;
        EVENT_SoldierBeginPunchAttack(pSoldier, sAdjustedGridNo, ubDirection);
      }

      // OK, set UI
      SetUIBusy(pSoldier.ubID);

      gfResetUIMovementOptimization = true;

      return ITEM_HANDLE_OK;
    } else {
      return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
    }
  }

  // USING THE MEDKIT
  if (Item[usHandItem].usItemClass == IC_MEDKIT) {
    // ATE: AI CANNOT GO THROUGH HERE!
    let usMapPos: UINT16;
    let fHadToUseCursorPos: boolean = false;

    if (gTacticalStatus.fAutoBandageMode) {
      usMapPos = usGridNo;
    } else {
      GetMouseMapPos(addressof(usMapPos));
    }

    // See if we can get there to stab
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
    if (sActionGridNo == -1) {
      // Try another location...
      sActionGridNo = FindAdjacentGridEx(pSoldier, usMapPos, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);

      if (sActionGridNo == -1) {
        return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
      }

      if (!gTacticalStatus.fAutoBandageMode) {
        fHadToUseCursorPos = true;
      }
    }

    // Calculate AP costs...
    sAPCost = GetAPsToBeginFirstAid(pSoldier);
    sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

    if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
      // OK, set UI
      SetUIBusy(pSoldier.ubID);

      // CHECK IF WE ARE AT THIS GRIDNO NOW
      if (pSoldier.sGridNo != sActionGridNo) {
        // SEND PENDING ACTION
        pSoldier.ubPendingAction = Enum257.MERC_GIVEAID;

        if (fHadToUseCursorPos) {
          pSoldier.sPendingActionData2 = usMapPos;
        } else {
          if (pTargetSoldier != null) {
            pSoldier.sPendingActionData2 = pTargetSoldier.sGridNo;
          } else {
            pSoldier.sPendingActionData2 = usGridNo;
          }
        }
        pSoldier.bPendingActionData3 = ubDirection;
        pSoldier.ubPendingActionAnimCount = 0;

        // WALK UP TO DEST FIRST
        EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
      } else {
        EVENT_SoldierBeginFirstAid(pSoldier, sAdjustedGridNo, ubDirection);
      }

      if (fFromUI) {
        guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
      }

      return ITEM_HANDLE_OK;
    } else {
      return ITEM_HANDLE_NOAPS;
    }
  }

  if (usHandItem == Enum225.WIRECUTTERS) {
    // See if we can get there to stab
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
    if (sActionGridNo != -1) {
      // Calculate AP costs...
      sAPCost = GetAPsToCutFence(pSoldier);
      sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

      if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
        // CHECK IF WE ARE AT THIS GRIDNO NOW
        if (pSoldier.sGridNo != sActionGridNo) {
          // SEND PENDING ACTION
          pSoldier.ubPendingAction = Enum257.MERC_CUTFFENCE;
          pSoldier.sPendingActionData2 = sAdjustedGridNo;
          pSoldier.bPendingActionData3 = ubDirection;
          pSoldier.ubPendingActionAnimCount = 0;

          // WALK UP TO DEST FIRST
          EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
        } else {
          EVENT_SoldierBeginCutFence(pSoldier, sAdjustedGridNo, ubDirection);
        }

        // OK, set UI
        SetUIBusy(pSoldier.ubID);

        if (fFromUI) {
          guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
        }

        return ITEM_HANDLE_OK;
      } else {
        return ITEM_HANDLE_NOAPS;
      }
    } else {
      return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
    }
  }

  if (usHandItem == Enum225.TOOLKIT) {
    let ubMercID: UINT8;
    let fVehicle: boolean = false;
    let sVehicleGridNo: INT16 = -1;

    // For repair, check if we are over a vehicle, then get gridnot to edge of that vehicle!
    if (IsRepairableStructAtGridNo(usGridNo, addressof(ubMercID)) == 2) {
      let sNewGridNo: INT16;
      let ubDirection: UINT8;

      sNewGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.usUIMovementMode, 5, addressof(ubDirection), 0, MercPtrs[ubMercID]);

      if (sNewGridNo != NOWHERE) {
        usGridNo = sNewGridNo;

        sVehicleGridNo = MercPtrs[ubMercID].sGridNo;

        fVehicle = true;
      }
    }

    // See if we can get there to stab
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);

    if (sActionGridNo != -1) {
      // Calculate AP costs...
      sAPCost = GetAPsToBeginRepair(pSoldier);
      sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

      if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
        // CHECK IF WE ARE AT THIS GRIDNO NOW
        if (pSoldier.sGridNo != sActionGridNo) {
          // SEND PENDING ACTION
          pSoldier.ubPendingAction = Enum257.MERC_REPAIR;
          pSoldier.sPendingActionData2 = sAdjustedGridNo;

          if (fVehicle) {
            pSoldier.sPendingActionData2 = sVehicleGridNo;
          }

          pSoldier.bPendingActionData3 = ubDirection;
          pSoldier.ubPendingActionAnimCount = 0;

          // WALK UP TO DEST FIRST
          EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
        } else {
          EVENT_SoldierBeginRepair(pSoldier, sAdjustedGridNo, ubDirection);
        }

        // OK, set UI
        SetUIBusy(pSoldier.ubID);

        if (fFromUI) {
          guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
        }

        return ITEM_HANDLE_OK;
      } else {
        return ITEM_HANDLE_NOAPS;
      }
    } else {
      return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
    }
  }

  if (usHandItem == Enum225.GAS_CAN) {
    let ubMercID: UINT8;
    let sVehicleGridNo: INT16 = -1;

    // For repair, check if we are over a vehicle, then get gridnot to edge of that vehicle!
    if (IsRefuelableStructAtGridNo(usGridNo, addressof(ubMercID))) {
      let sNewGridNo: INT16;
      let ubDirection: UINT8;

      sNewGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.usUIMovementMode, 5, addressof(ubDirection), 0, MercPtrs[ubMercID]);

      if (sNewGridNo != NOWHERE) {
        usGridNo = sNewGridNo;

        sVehicleGridNo = MercPtrs[ubMercID].sGridNo;
      }
    }

    // See if we can get there to stab
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);

    if (sActionGridNo != -1) {
      // Calculate AP costs...
      sAPCost = GetAPsToRefuelVehicle(pSoldier);
      sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

      if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
        // CHECK IF WE ARE AT THIS GRIDNO NOW
        if (pSoldier.sGridNo != sActionGridNo) {
          // SEND PENDING ACTION
          pSoldier.ubPendingAction = Enum257.MERC_FUEL_VEHICLE;
          pSoldier.sPendingActionData2 = sAdjustedGridNo;

          pSoldier.sPendingActionData2 = sVehicleGridNo;
          pSoldier.bPendingActionData3 = ubDirection;
          pSoldier.ubPendingActionAnimCount = 0;

          // WALK UP TO DEST FIRST
          EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
        } else {
          EVENT_SoldierBeginRefuel(pSoldier, sAdjustedGridNo, ubDirection);
        }

        // OK, set UI
        SetUIBusy(pSoldier.ubID);

        if (fFromUI) {
          guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
        }

        return ITEM_HANDLE_OK;
      } else {
        return ITEM_HANDLE_NOAPS;
      }
    } else {
      return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
    }
  }

  if (usHandItem == Enum225.JAR) {
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);

    if (sActionGridNo != -1) {
      // Calculate AP costs...
      sAPCost = GetAPsToUseJar(pSoldier, sActionGridNo);
      sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOTs, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

      if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
        // CHECK IF WE ARE AT THIS GRIDNO NOW
        if (pSoldier.sGridNo != sActionGridNo) {
          // SEND PENDING ACTION
          pSoldier.ubPendingAction = Enum257.MERC_TAKEBLOOD;
          pSoldier.sPendingActionData2 = sAdjustedGridNo;
          pSoldier.bPendingActionData3 = ubDirection;
          pSoldier.ubPendingActionAnimCount = 0;

          // WALK UP TO DEST FIRST
          EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
        } else {
          EVENT_SoldierBeginTakeBlood(pSoldier, sAdjustedGridNo, ubDirection);
        }

        // OK, set UI
        SetUIBusy(pSoldier.ubID);

        if (fFromUI) {
          guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
        }

        return ITEM_HANDLE_OK;
      } else {
        return ITEM_HANDLE_NOAPS;
      }
    } else {
      return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
    }
  }

  if (usHandItem == Enum225.STRING_TIED_TO_TIN_CAN) {
    let pStructure: STRUCTURE;
    let pIntTile: LEVELNODE | null;

    // Get structure info for in tile!
    pIntTile = GetCurInteractiveTileGridNoAndStructure(addressof(usGridNo), addressof(pStructure));

    // We should not have null here if we are given this flag...
    if (pIntTile != null) {
      sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), false, true);

      if (sActionGridNo != -1) {
        // Calculate AP costs...
        sAPCost = AP_ATTACH_CAN;
        sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.bActionPoints);

        if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
          // CHECK IF WE ARE AT THIS GRIDNO NOW
          if (pSoldier.sGridNo != sActionGridNo) {
            // SEND PENDING ACTION
            pSoldier.ubPendingAction = Enum257.MERC_ATTACH_CAN;
            pSoldier.sPendingActionData2 = usGridNo;
            pSoldier.bPendingActionData3 = ubDirection;
            pSoldier.ubPendingActionAnimCount = 0;

            // WALK UP TO DEST FIRST
            EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
          } else {
            EVENT_SoldierBeginTakeBlood(pSoldier, usGridNo, ubDirection);
          }

          // OK, set UI
          SetUIBusy(pSoldier.ubID);

          if (fFromUI) {
            guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
          }

          return ITEM_HANDLE_OK;
        } else {
          return ITEM_HANDLE_NOAPS;
        }
      } else {
        return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
      }
    } else {
      return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
    }
  }

  // Check for remote detonator cursor....
  if (Item[usHandItem].ubCursor == REMOTECURS) {
    sAPCost = AP_USE_REMOTE;

    if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
      DeductPoints(pSoldier, sAPCost, 0);
      if (usHandItem == Enum225.XRAY_DEVICE) {
        PlayJA2Sample(Enum330.USE_X_RAY_MACHINE, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));

        ActivateXRayDevice(pSoldier);
        return ITEM_HANDLE_OK;
      } else // detonator
      {
        // Save gridno....
        pSoldier.sPendingActionData2 = usGridNo;

        EVENT_SoldierBeginUseDetonator(pSoldier);

        if (fFromUI) {
          guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
        }

        // Now start anim....
        return ITEM_HANDLE_OK;
      }
    } else {
      return ITEM_HANDLE_NOAPS;
    }
  }

  // Check for mine.. anything without a detonator.....
  if (Item[usHandItem].ubCursor == BOMBCURS) {
    fDropBomb = true;
  }

  // Check for a bomb like a mine, that uses a pressure detonator
  if (Item[usHandItem].ubCursor == INVALIDCURS) {
    // Found detonator...
    if (FindAttachment(pSoldier.inv[pSoldier.ubAttackingHand], Enum225.DETONATOR) != ITEM_NOT_FOUND || FindAttachment(pSoldier.inv[pSoldier.ubAttackingHand], Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
      fDropBomb = true;
    }
  }

  if (fDropBomb) {
    // Save gridno....
    pSoldier.sPendingActionData2 = usGridNo;

    if (pSoldier.sGridNo != usGridNo) {
      // SEND PENDING ACTION
      pSoldier.ubPendingAction = Enum257.MERC_DROPBOMB;
      pSoldier.ubPendingActionAnimCount = 0;

      // WALK UP TO DEST FIRST
      EVENT_InternalGetNewSoldierPath(pSoldier, usGridNo, pSoldier.usUIMovementMode, false, true);
    } else {
      EVENT_SoldierBeginDropBomb(pSoldier);
    }

    // OK, set UI
    SetUIBusy(pSoldier.ubID);

    if (fFromUI) {
      guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
    }

    return ITEM_HANDLE_OK;
  }

  // USING THE BLADE
  if (Item[usHandItem].usItemClass == IC_BLADE) {
    // See if we can get there to stab
    if (pSoldier.ubBodyType == Enum194.BLOODCAT) {
      sActionGridNo = FindNextToAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
    } else if (CREATURE_OR_BLOODCAT(pSoldier) && PythSpacesAway(pSoldier.sGridNo, usGridNo) > 1) {
      sActionGridNo = FindNextToAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
      if (sActionGridNo == -1) {
        sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
      }
    } else {
      sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
    }

    if (sActionGridNo != -1) {
      pSoldier.usActionData = sActionGridNo;

      // CHECK IF WE ARE AT THIS GRIDNO NOW
      if (pSoldier.sGridNo != sActionGridNo) {
        // SEND PENDING ACTION
        pSoldier.ubPendingAction = Enum257.MERC_KNIFEATTACK;
        pSoldier.sPendingActionData2 = sAdjustedGridNo;
        pSoldier.bPendingActionData3 = ubDirection;
        pSoldier.ubPendingActionAnimCount = 0;

        // WALK UP TO DEST FIRST
        EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
      } else {
        // for the benefit of the AI
        pSoldier.bAction = Enum289.AI_ACTION_KNIFE_STAB;
        EVENT_SoldierBeginBladeAttack(pSoldier, sAdjustedGridNo, ubDirection);
      }

      // OK, set UI
      SetUIBusy(pSoldier.ubID);

      if (fFromUI) {
        guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
        gfResetUIMovementOptimization = true;
      }

      return ITEM_HANDLE_OK;
    } else {
      return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
    }
  }

  if (Item[usHandItem].usItemClass == IC_TENTACLES) {
    // See if we can get there to stab
    // pSoldier->sTargetGridNo = sTargetGridNo;
    // pSoldier->sLastTarget = sTargetGridNo;
    // pSoldier->ubTargetID = WhoIsThere2( sTargetGridNo, pSoldier->bTargetLevel );

    gTacticalStatus.ubAttackBusyCount++;
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Starting swipe attack, incrementing a.b.c in HandleItems to %d", gTacticalStatus.ubAttackBusyCount));

    sAPCost = CalcTotalAPsToAttack(pSoldier, sGridNo, false, pSoldier.bAimTime);

    DeductPoints(pSoldier, sAPCost, 0);

    EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_SWIPE, 0, false);

    // FireWeapon( pSoldier, sTargetGridNo );
    pSoldier.bAction = Enum289.AI_ACTION_KNIFE_STAB;

    return ITEM_HANDLE_OK;
  }

  // THIS IS IF WE WERE FROM THE UI
  if (Item[usHandItem].usItemClass == IC_GRENADE || Item[usHandItem].usItemClass == IC_LAUNCHER || Item[usHandItem].usItemClass == IC_THROWN) {
    let sCheckGridNo: INT16;

    // Get gridno - either soldier's position or the gridno
    if (pTargetSoldier != null) {
      sTargetGridNo = pTargetSoldier.sGridNo;
    } else {
      sTargetGridNo = usGridNo;
    }

    sAPCost = MinAPsToAttack(pSoldier, sTargetGridNo, 1);

    // Check if these is room to place mortar!
    if (usHandItem == Enum225.MORTAR) {
      ubDirection = GetDirectionFromGridNo(sTargetGridNo, pSoldier);

      // Get new gridno!
      sCheckGridNo = NewGridNo(pSoldier.sGridNo, DirectionInc(ubDirection));

      if (!OKFallDirection(pSoldier, sCheckGridNo, pSoldier.bLevel, ubDirection, pSoldier.usAnimState)) {
        return ITEM_HANDLE_NOROOM;
      }

      pSoldier.fDontChargeAPsForStanceChange = true;
    } else if (usHandItem == Enum225.GLAUNCHER || usHandItem == Enum225.UNDER_GLAUNCHER) {
      GetAPChargeForShootOrStabWRTGunRaises(pSoldier, sTargetGridNo, 1, addressof(fAddingTurningCost), addressof(fAddingRaiseGunCost));

      // If we are standing and are asked to turn AND raise gun, ignore raise gun...
      if (gAnimControl[pSoldier.usAnimState].ubHeight == ANIM_STAND) {
        if (fAddingRaiseGunCost) {
          pSoldier.fDontChargeTurningAPs = true;
        }
      } else {
        // If raising gun, don't charge turning!
        if (fAddingTurningCost) {
          pSoldier.fDontChargeReadyAPs = true;
        }
      }
    }

    // If this is a player guy, show message about no APS
    if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
      pSoldier.ubAttackingHand = Enum261.HANDPOS;
      pSoldier.usAttackingWeapon = usHandItem;
      pSoldier.bTargetLevel = bLevel;

      // Look at the cursor, if toss cursor...
      if (Item[usHandItem].ubCursor == TOSSCURS) {
        pSoldier.sTargetGridNo = sTargetGridNo;
        //	pSoldier->sLastTarget = sTargetGridNo;
        pSoldier.ubTargetID = WhoIsThere2(sTargetGridNo, pSoldier.bTargetLevel);

        // Increment attack counter...
        gTacticalStatus.ubAttackBusyCount++;

        // ATE: Don't charge turning...
        pSoldier.fDontChargeTurningAPs = true;

        FireWeapon(pSoldier, sTargetGridNo);
      } else {
        SendBeginFireWeaponEvent(pSoldier, sTargetGridNo);
      }

      // OK, set UI
      SetUIBusy(pSoldier.ubID);

      return ITEM_HANDLE_OK;
    } else {
      return ITEM_HANDLE_NOAPS;
    }

    return ITEM_HANDLE_OK;
  }

  // CHECK FOR BOMB....
  if (Item[usHandItem].ubCursor == INVALIDCURS) {
    // Found detonator...
    if (FindAttachment(pSoldier.inv[usHandItem], Enum225.DETONATOR) != ITEM_NOT_FOUND || FindAttachment(pSoldier.inv[usHandItem], Enum225.REMDETONATOR)) {
      StartBombMessageBox(pSoldier, usGridNo);

      if (fFromUI) {
        guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
      }

      return ITEM_HANDLE_OK;
    }
  }

  return ITEM_HANDLE_OK;
}

export function HandleSoldierDropBomb(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  // Does this have detonator that needs info?
  if (FindAttachment(pSoldier.inv[Enum261.HANDPOS], Enum225.DETONATOR) != ITEM_NOT_FOUND || FindAttachment(pSoldier.inv[Enum261.HANDPOS], Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
    StartBombMessageBox(pSoldier, sGridNo);
  } else {
    // We have something... all we do is place...
    if (ArmBomb(pSoldier.inv[Enum261.HANDPOS], 0)) {
      // EXPLOSIVES GAIN (25):  Place a bomb, or buried and armed a mine
      StatChange(pSoldier, EXPLODEAMT, 25, FROM_SUCCESS);

      pSoldier.inv[Enum261.HANDPOS].bTrap = Math.min(10, (EffectiveExplosive(pSoldier) / 20) + (EffectiveExpLevel(pSoldier) / 3));
      pSoldier.inv[Enum261.HANDPOS].ubBombOwner = pSoldier.ubID + 2;

      // we now know there is something nasty here
      gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_PLAYER_MINE_PRESENT;

      AddItemToPool(sGridNo, pSoldier.inv[Enum261.HANDPOS], BURIED, pSoldier.bLevel, WORLD_ITEM_ARMED_BOMB, 0);
      DeleteObj(pSoldier.inv[Enum261.HANDPOS]);
    }
  }
}

export function HandleSoldierUseRemote(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  StartBombMessageBox(pSoldier, sGridNo);
}

export function SoldierHandleDropItem(pSoldier: SOLDIERTYPE): void {
  // LOOK IN PANDING DATA FOR ITEM TO DROP, AND LOCATION
  if (pSoldier.pTempObject != null) {
    if (pSoldier.bVisible != -1) {
      PlayJA2Sample(Enum330.THROW_IMPACT_2, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));
    }

    AddItemToPool(pSoldier.sGridNo, pSoldier.pTempObject, 1, pSoldier.bLevel, 0, -1);
    NotifySoldiersToLookforItems();

    MemFree(pSoldier.pTempObject);
    pSoldier.pTempObject = null;
  }
}

export function HandleSoldierThrowItem(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  // Determine what to do
  let ubDirection: UINT8;

  // Set attacker to NOBODY, since it's not a combat attack
  pSoldier.ubTargetID = NOBODY;

  // Alrighty, switch based on stance!
  switch (gAnimControl[pSoldier.usAnimState].ubHeight) {
    case ANIM_STAND:

      // CHECK IF WE ARE NOT ON THE SAME GRIDNO
      if (sGridNo == pSoldier.sGridNo) {
        PickDropItemAnimation(pSoldier);
      } else {
        // CHANGE DIRECTION AT LEAST
        ubDirection = GetDirectionFromGridNo(sGridNo, pSoldier);

        SoldierGotoStationaryStance(pSoldier);

        EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
        pSoldier.fTurningUntilDone = true;

        // Draw item depending on distance from buddy
        if (GetRangeFromGridNoDiff(sGridNo, pSoldier.sGridNo) < MIN_LOB_RANGE) {
          pSoldier.usPendingAnimation = Enum193.LOB_ITEM;
        } else {
          pSoldier.usPendingAnimation = Enum193.THROW_ITEM;
        }
      }
      break;

    case ANIM_CROUCH:
    case ANIM_PRONE:

      // CHECK IF WE ARE NOT ON THE SAME GRIDNO
      if (sGridNo == pSoldier.sGridNo) {
        // OK, JUST DROP ITEM!
        if (pSoldier.pTempObject != null) {
          AddItemToPool(sGridNo, pSoldier.pTempObject, 1, pSoldier.bLevel, 0, -1);
          NotifySoldiersToLookforItems();

          MemFree(pSoldier.pTempObject);
          pSoldier.pTempObject = null;
        }
      } else {
        // OK, go from prone/crouch to stand first!
        ubDirection = GetDirectionFromGridNo(sGridNo, pSoldier);
        EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);

        ChangeSoldierState(pSoldier, Enum193.THROW_ITEM, 0, false);
      }
  }
}

export function SoldierGiveItem(pSoldier: SOLDIERTYPE, pTargetSoldier: SOLDIERTYPE, pObject: OBJECTTYPE, bInvPos: INT8): void {
  let sActionGridNo: INT16;
  let sAdjustedGridNo: INT16;
  let ubDirection: UINT8;

  // Remove any previous actions
  pSoldier.ubPendingAction = NO_PENDING_ACTION;

  // See if we can get there to stab
  sActionGridNo = FindAdjacentGridEx(pSoldier, pTargetSoldier.sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), true, false);
  if (sActionGridNo != -1) {
    // SEND PENDING ACTION
    pSoldier.ubPendingAction = Enum257.MERC_GIVEITEM;

    pSoldier.bPendingActionData5 = bInvPos;
    // Copy temp object
    pSoldier.pTempObject = createObjectType();
    copyObjectType(pSoldier.pTempObject, pObject);

    pSoldier.sPendingActionData2 = pTargetSoldier.sGridNo;
    pSoldier.bPendingActionData3 = ubDirection;
    pSoldier.uiPendingActionData4 = pTargetSoldier.ubID;
    pSoldier.ubPendingActionAnimCount = 0;

    // Set soldier as engaged!
    pSoldier.uiStatusFlags |= SOLDIER_ENGAGEDINACTION;

    // CHECK IF WE ARE AT THIS GRIDNO NOW
    if (pSoldier.sGridNo != sActionGridNo) {
      // WALK UP TO DEST FIRST
      EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
    } else {
      EVENT_SoldierBeginGiveItem(pSoldier);
      // CHANGE DIRECTION OF TARGET TO OPPOSIDE DIRECTION!
      EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    }

    // Set target as engaged!
    pTargetSoldier.uiStatusFlags |= SOLDIER_ENGAGEDINACTION;

    return;
  } else {
    return;
  }
}

export function SoldierDropItem(pSoldier: SOLDIERTYPE, pObj: OBJECTTYPE): boolean {
  pSoldier.pTempObject = createObjectType();
  if (pSoldier.pTempObject == null) {
    // OUT OF MEMORY! YIKES!
    return false;
  }
  copyObjectType(pSoldier.pTempObject, pObj);
  PickDropItemAnimation(pSoldier);
  return true;
}

export function SoldierPickupItem(pSoldier: SOLDIERTYPE, iItemIndex: INT32, sGridNo: INT16, bZLevel: INT8): void {
  let sActionGridNo: INT16;

  // Remove any previous actions
  pSoldier.ubPendingAction = NO_PENDING_ACTION;

  sActionGridNo = AdjustGridNoForItemPlacement(pSoldier, sGridNo);

  // SET PENDING ACTIONS!
  pSoldier.ubPendingAction = Enum257.MERC_PICKUPITEM;
  pSoldier.uiPendingActionData1 = iItemIndex;
  pSoldier.sPendingActionData2 = sActionGridNo;
  pSoldier.uiPendingActionData4 = sGridNo;
  pSoldier.bPendingActionData3 = bZLevel;
  pSoldier.ubPendingActionAnimCount = 0;

  // Deduct points!
  // sAPCost = GetAPsToPickupItem( pSoldier, sGridNo );
  // DeductPoints( pSoldier, sAPCost, 0 );
  SetUIBusy(pSoldier.ubID);

  // CHECK IF NOT AT SAME GRIDNO
  if (pSoldier.sGridNo != sActionGridNo) {
    if (pSoldier.bTeam == gbPlayerNum) {
      EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, true, true);

      // Say it only if we don;t have to go too far!
      if (pSoldier.usPathDataSize > 5) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);
      }
    } else {
      EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.usUIMovementMode, false, true);
    }
  } else {
    // DO ANIMATION OF PICKUP NOW!
    PickPickupAnimation(pSoldier, pSoldier.uiPendingActionData1, (pSoldier.uiPendingActionData4), pSoldier.bPendingActionData3);
  }
}

function HandleAutoPlaceFail(pSoldier: SOLDIERTYPE, iItemIndex: INT32, sGridNo: INT16): void {
  if (pSoldier.bTeam == gbPlayerNum) {
    // Place it in buddy's hand!
    if (gpItemPointer == null) {
      InternalBeginItemPointer(pSoldier, gWorldItems[iItemIndex].o, NO_SLOT);
    } else {
      // Add back to world...
      AddItemToPool(sGridNo, gWorldItems[iItemIndex].o, 1, pSoldier.bLevel, 0, -1);

      // If we are a merc, say DAMN quote....
      if (pSoldier.bTeam == gbPlayerNum) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
      }
    }
  }
}

export function SoldierGetItemFromWorld(pSoldier: SOLDIERTYPE, iItemIndex: INT32, sGridNo: INT16, bZLevel: INT8, pfSelectionList: Pointer<boolean>): void {
  let pItemPool: ITEM_POOL | null;
  let pItemPoolToDelete: ITEM_POOL | null = null;
  let Object: OBJECTTYPE = createObjectType();
  let cnt: INT32 = 0;
  let fPickup: boolean;
  let fFailedAutoPlace: boolean = false;
  let iItemIndexToDelete: INT32;
  let fShouldSayCoolQuote: boolean = false;
  let fDidSayCoolQuote: boolean = false;
  let fSaidBoobyTrapQuote: boolean = false;

  // OK. CHECK IF WE ARE DOING ALL IN THIS POOL....
  if (iItemIndex == ITEM_PICKUP_ACTION_ALL || iItemIndex == ITEM_PICKUP_SELECTION) {
    // DO all pickup!
    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPool = GetItemPool(sGridNo, pSoldier.bLevel);

    while (pItemPool) {
      if (ItemPoolOKForPickup(pSoldier, pItemPool, bZLevel)) {
        fPickup = true;

        if (iItemIndex == ITEM_PICKUP_SELECTION) {
          if (!pfSelectionList[cnt]) {
            fPickup = false;
          }
        }

        // Increment counter...
        //:ATE: Only incremrnt counter for items we can see..
        cnt++;

        if (fPickup) {
          if (ContinuePastBoobyTrap(pSoldier, sGridNo, bZLevel, pItemPool.iItemIndex, false, addressof(fSaidBoobyTrapQuote))) {
            // Make copy of item
            copyObjectType(Object, gWorldItems[pItemPool.iItemIndex].o);

            if (ItemIsCool(Object)) {
              fShouldSayCoolQuote = true;
            }

            if (Object.usItem == Enum225.SWITCH) {
              // ask about activating the switch!
              bTempFrequency = Object.bFrequency;
              gpTempSoldier = pSoldier;
              DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.ACTIVATE_SWITCH_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, SwitchMessageBoxCallBack, null);
              pItemPool = pItemPool.pNext;
            } else {
              if (!AutoPlaceObject(pSoldier, Object, true)) {
                // check to see if the object has been swapped with one in inventory
                if (Object.usItem != gWorldItems[pItemPool.iItemIndex].o.usItem || Object.ubNumberOfObjects != gWorldItems[pItemPool.iItemIndex].o.ubNumberOfObjects) {
                  // copy back because item changed, and we must make sure the item pool reflects this.
                  copyObjectType(gWorldItems[pItemPool.iItemIndex].o, Object);
                }

                pItemPoolToDelete = pItemPool;
                pItemPool = pItemPool.pNext;
                fFailedAutoPlace = true;
                // continue, to try and place ay others...
                continue;
              }
              /*
              // handle theft.. will return true if theft has failed ( if soldier was caught )
              if( pSoldier->bTeam == OUR_TEAM )
              {
                      // check to see if object was owned by another
                      if( Object.fFlags & OBJECT_OWNED_BY_CIVILIAN )
                      {
                              // owned by a civilian
                              if( HandleLoyaltyAdjustmentForRobbery( pSoldier ) == TRUE )
                              {
                                      // implememnt actual tactical reaction for theft..shoot robber, yell out, etc
                              }

                              // reset who owns object
                              Object.fFlags &= ~( OBJECT_OWNED_BY_CIVILIAN );
                      }
              }
              */

              // pItemPoolToDelete = pItemPool;
              iItemIndexToDelete = pItemPool.iItemIndex;
              pItemPool = pItemPool.pNext;
              RemoveItemFromPool(sGridNo, iItemIndexToDelete, pSoldier.bLevel);
            }
          } else {
            // boobytrap found... stop picking up things!
            break;
          }
        } else {
          pItemPool = pItemPool.pNext;
        }
      } else {
        pItemPool = pItemPool.pNext;
      }
    }

    // ATE; If here, and we failed to add any more stuff, put failed one in our cursor...
    if (pItemPoolToDelete != null && fFailedAutoPlace) {
      gfDontChargeAPsToPickup = true;
      HandleAutoPlaceFail(pSoldier, pItemPoolToDelete.iItemIndex, sGridNo);
      RemoveItemFromPool(sGridNo, pItemPoolToDelete.iItemIndex, pSoldier.bLevel);
      pItemPoolToDelete = null;
    }
  } else {
    // REMOVE ITEM FROM POOL
    if (ItemExistsAtLocation(sGridNo, iItemIndex, pSoldier.bLevel)) {
      if (ContinuePastBoobyTrap(pSoldier, sGridNo, bZLevel, iItemIndex, false, addressof(fSaidBoobyTrapQuote))) {
        // Make copy of item
        copyObjectType(Object, gWorldItems[iItemIndex].o);

        if (ItemIsCool(Object)) {
          fShouldSayCoolQuote = true;
        }

        if (Object.usItem == Enum225.SWITCH) {
          // handle switch
          bTempFrequency = Object.bFrequency;
          gpTempSoldier = pSoldier;
          DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.ACTIVATE_SWITCH_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, SwitchMessageBoxCallBack, null);
        } else {
          /*
                                                  // handle theft.. will return true if theft has failed ( if soldier was caught )
                                                  if( pSoldier->bTeam == OUR_TEAM )
                                                  {
                                                          // check to see if object was owned by another
                                                          if( Object.fFlags & OBJECT_OWNED_BY_CIVILIAN )
                                                          {
                                                                  // owned by a civilian
                                                                  if( HandleLoyaltyAdjustmentForRobbery( pSoldier ) == TRUE )
                                                                  {
                                                                          // implememnt actual tactical reaction for theft..shoot robber, yell out, etc
                                                                  }

                                                                  // reset who owns object
                                                                  Object.fFlags &= ~( OBJECT_OWNED_BY_CIVILIAN );
                                                          }
                                                  }
          */
          RemoveItemFromPool(sGridNo, iItemIndex, pSoldier.bLevel);

          if (!AutoPlaceObject(pSoldier, gWorldItems[iItemIndex].o, true)) {
            gfDontChargeAPsToPickup = true;
            HandleAutoPlaceFail(pSoldier, iItemIndex, sGridNo);
          }
        }
      }
    }
  }

  // OK, check if potentially a good candidate for cool quote
  if (fShouldSayCoolQuote && pSoldier.bTeam == gbPlayerNum) {
    // Do we have this quote..?
    if (QuoteExp_GotGunOrUsedGun[pSoldier.ubProfile] == Enum202.QUOTE_FOUND_SOMETHING_SPECIAL) {
      // Have we not said it today?
      if (!(pSoldier.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_FOUND_SOMETHING_NICE)) {
        // set flag
        pSoldier.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_FOUND_SOMETHING_NICE;

        // Say it....
        // We've found something!
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_FOUND_SOMETHING_SPECIAL);

        fDidSayCoolQuote = true;
      }
    }
  }

  // Aknowledge....
  if (pSoldier.bTeam == OUR_TEAM && !fDidSayCoolQuote && !fSaidBoobyTrapQuote) {
    DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_GOTIT);
  }

  // OK partner......look for any hidden items!
  if (pSoldier.bTeam == gbPlayerNum && LookForHiddenItems(sGridNo, pSoldier.bLevel, true, 0)) {
    // WISDOM GAIN (5):  Found a hidden object
    StatChange(pSoldier, WISDOMAMT, 5, FROM_SUCCESS);

    // We've found something!
    TacticalCharacterDialogue(pSoldier, (Enum202.QUOTE_SPOTTED_SOMETHING_ONE + Random(2)));
  }

  gpTempSoldier = pSoldier;
  gsTempGridno = sGridNo;
  SetCustomizableTimerCallbackAndDelay(1000, CheckForPickedOwnership, true);
}

export function HandleSoldierPickupItem(pSoldier: SOLDIERTYPE, iItemIndex: INT32, sGridNo: INT16, bZLevel: INT8): void {
  let pItemPool: ITEM_POOL | null;
  let usNum: UINT16;

  // Draw menu if more than one item!
  if ((pItemPool = GetItemPool(sGridNo, pSoldier.bLevel))) {
    // OK, if an enemy, go directly ( skip menu )
    if (pSoldier.bTeam != gbPlayerNum) {
      SoldierGetItemFromWorld(pSoldier, iItemIndex, sGridNo, bZLevel, null);
    } else {
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_PLAYER_MINE_PRESENT) {
        // have the computer ask us if we want to proceed

        // override the item index passed in with the one for the bomb in this
        // tile
        iItemIndex = FindWorldItemForBombInGridNo(sGridNo, pSoldier.bLevel);

        gpBoobyTrapItemPool = GetItemPoolForIndex(sGridNo, iItemIndex, pSoldier.bLevel);
        gpBoobyTrapSoldier = pSoldier;
        gsBoobyTrapGridNo = sGridNo;
        gbBoobyTrapLevel = pSoldier.bLevel;
        gfDisarmingBuriedBomb = true;
        gbTrapDifficulty = gWorldItems[iItemIndex].o.bTrap;

        DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.DISARM_TRAP_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, BoobyTrapMessageBoxCallBack, null);
      } else {
        // OK, only hidden items exist...
        if (pSoldier.bTeam == gbPlayerNum && DoesItemPoolContainAllHiddenItems(pItemPool)) {
          // He's touched them....
          if (LookForHiddenItems(sGridNo, pSoldier.bLevel, true, 0)) {
            // WISDOM GAIN (5):  Found a hidden object
            StatChange(pSoldier, WISDOMAMT, 5, FROM_SUCCESS);

            // We've found something!
            TacticalCharacterDialogue(pSoldier, (Enum202.QUOTE_SPOTTED_SOMETHING_ONE + Random(2)));
          } else {
            // Say NOTHING quote...
            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_NOTHING);
          }
        } else {
          // If only one good item exists....
          if ((usNum = GetNumOkForDisplayItemsInPool(pItemPool, bZLevel)) == 1) {
            // Find first OK item....
            while (!ItemPoolOKForDisplay(<ITEM_POOL>pItemPool, bZLevel)) {
              pItemPool = (<ITEM_POOL>pItemPool).pNext;
            }
            SoldierGetItemFromWorld(pSoldier, (<ITEM_POOL>pItemPool).iItemIndex, sGridNo, bZLevel, null);
          } else {
            if (usNum != 0) {
              // Freeze guy!
              pSoldier.fPauseAllAnimation = true;

              InitializeItemPickupMenu(pSoldier, sGridNo, pItemPool, 0, 0, bZLevel);

              guiPendingOverrideEvent = Enum207.G_GETTINGITEM;
            } else {
              DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_NOTHING);
            }
          }
        }
      }
    }
  } else {
    // Say NOTHING quote...
    DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_NOTHING);
  }
}

function AddItemGraphicToWorld(pItem: INVTYPE, sGridNo: INT16, ubLevel: UINT8): LEVELNODE {
  let usTileIndex: UINT16;
  let pNode: LEVELNODE;

  usTileIndex = GetTileGraphicForItem(pItem);

  // OK, Do stuff differently base on level!
  if (ubLevel == 0) {
    pNode = <LEVELNODE>AddStructToTail(sGridNo, usTileIndex);
    // SET FLAG FOR AN ITEM
    pNode.uiFlags |= LEVELNODE_ITEM;
  } else {
    AddOnRoofToHead(sGridNo, usTileIndex);
    // SET FLAG FOR AN ITEM
    pNode = <LEVELNODE>gpWorldLevelData[sGridNo].pOnRoofHead;
    pNode.uiFlags |= LEVELNODE_ITEM;
  }

  // DIRTY INTERFACE
  fInterfacePanelDirty = DIRTYLEVEL2;

  // DIRTY TILE
  gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REDRAW;
  SetRenderFlags(RENDER_FLAG_MARKED);

  return pNode;
}

function RemoveItemGraphicFromWorld(pItem: INVTYPE, sGridNo: INT16, ubLevel: UINT8, pLevelNode: LEVELNODE): void {
  let pNode: LEVELNODE | null;

  // OK, Do stuff differently base on level!
  // Loop through and find pointer....
  if (ubLevel == 0) {
    pNode = gpWorldLevelData[sGridNo].pStructHead;
  } else {
    pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
  }

  while (pNode != null) {
    if (pNode == pLevelNode) {
      // Found one!
      if (ubLevel == 0) {
        RemoveStructFromLevelNode(sGridNo, pNode);
      } else {
        RemoveOnRoofFromLevelNode(sGridNo, pNode);
      }

      break;
    }

    pNode = pNode.pNext;
  }

  // DIRTY INTERFACE
  fInterfacePanelDirty = DIRTYLEVEL2;

  // DIRTY TILE
  gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REDRAW;
  SetRenderFlags(RENDER_FLAG_MARKED);

  // TEMP RENDER FULL!!!
  SetRenderFlags(RENDER_FLAG_FULL);
}

// INVENTORY POOL STUFF
export function AddItemToPool(sGridNo: INT16, pObject: OBJECTTYPE, bVisible: INT8, ubLevel: UINT8, usFlags: UINT16, bRenderZHeightAboveLevel: INT8): OBJECTTYPE | null {
  return InternalAddItemToPool(addressof(sGridNo), pObject, bVisible, ubLevel, usFlags, bRenderZHeightAboveLevel, null);
}

export function AddItemToPoolAndGetIndex(sGridNo: INT16, pObject: OBJECTTYPE, bVisible: INT8, ubLevel: UINT8, usFlags: UINT16, bRenderZHeightAboveLevel: INT8, piItemIndex: Pointer<INT32>): OBJECTTYPE | null {
  return InternalAddItemToPool(addressof(sGridNo), pObject, bVisible, ubLevel, usFlags, bRenderZHeightAboveLevel, piItemIndex);
}

export function InternalAddItemToPool(psGridNo: Pointer<INT16>, pObject: OBJECTTYPE, bVisible: INT8, ubLevel: UINT8, usFlags: UINT16, bRenderZHeightAboveLevel: INT8, piItemIndex: Pointer<INT32>): OBJECTTYPE | null {
  let pItemPool: ITEM_POOL | null;
  let pItemPoolTemp: ITEM_POOL | null;
  let iWorldItem: INT32;
  let pStructure: STRUCTURE | null;
  let pBase: STRUCTURE;
  let sDesiredLevel: INT16;
  let sNewGridNo: INT16 = psGridNo.value;
  let pNode: LEVELNODE;
  let fForceOnGround: boolean = false;
  let fObjectInOpenable: boolean = false;
  let bTerrainID: INT8;

  Assert(pObject.ubNumberOfObjects <= MAX_OBJECTS_PER_SLOT);

  // ATE: Check if the gridno is OK
  if ((psGridNo.value) == NOWHERE) {
    // Display warning.....
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Error: Item %d was given invalid grid location %d for item pool. Please Report.", pObject.usItem, (psGridNo.value));

    (psGridNo.value) = sNewGridNo = gMapInformation.sCenterGridNo;

    // return( NULL );
  }

  // CHECK IF THIS ITEM IS IN DEEP WATER....
  // IF SO, CHECK IF IT SINKS...
  // IF SO, DONT'T ADD!
  bTerrainID = GetTerrainType(psGridNo.value);

  if (bTerrainID == Enum315.DEEP_WATER || bTerrainID == Enum315.LOW_WATER || bTerrainID == Enum315.MED_WATER) {
    if (Item[pObject.usItem].fFlags & ITEM_SINKS) {
      return null;
    }
  }

  // First things first - look at where we are to place the items, and
  // set some flags appropriately

  // On a structure?
  // Locations on roofs without a roof is not possible, so
  // we convert the onroof intention to ground.
  if (ubLevel && !FlatRoofAboveGridNo(psGridNo.value)) {
    ubLevel = 0;
  }

  if (bRenderZHeightAboveLevel == -1) {
    fForceOnGround = true;
    bRenderZHeightAboveLevel = 0;
  }

  // Check structure database
  if (gpWorldLevelData[psGridNo.value].pStructureHead && (pObject.usItem != Enum225.OWNERSHIP) && (pObject.usItem != Enum225.ACTION_ITEM)) {
    // Something is here, check obstruction in future
    sDesiredLevel = ubLevel ? STRUCTURE_ON_ROOF : STRUCTURE_ON_GROUND;
    pStructure = FindStructure(psGridNo.value, STRUCTURE_BLOCKSMOVES);
    while (pStructure) {
      if (!(pStructure.fFlags & (STRUCTURE_PERSON | STRUCTURE_CORPSE)) && pStructure.sCubeOffset == sDesiredLevel) {
        // If we are going into a raised struct AND we have above level set to -1
        if (StructureBottomLevel(pStructure) != 1 && fForceOnGround) {
          break;
        }

        // Adjust the item's gridno to the base of struct.....
        pBase = <STRUCTURE>FindBaseStructure(pStructure);

        // Get LEVELNODE for struct and remove!
        sNewGridNo = pBase.sGridNo;

        // Check for openable flag....
        if (pStructure.fFlags & STRUCTURE_OPENABLE) {
          // ATE: Set a flag here - we need to know later that we're in an openable...
          fObjectInOpenable = true;

          // Something of note is here....
          // SOME sort of structure is here.... set render flag to off
          usFlags |= WORLD_ITEM_DONTRENDER;

          // Openable.. check if it's closed, if so, set visiblity...
          if (!(pStructure.fFlags & STRUCTURE_OPEN)) {
            // -2 means - don't reveal!
            bVisible = -2;
          }

          bRenderZHeightAboveLevel = CONVERT_INDEX_TO_PIXELS(StructureHeight(pStructure));
          break;
        }
        // Else can we place an item on top?
        else if (pStructure.fFlags & (STRUCTURE_GENERIC)) {
          let ubLevel0: UINT8;
          let ubLevel1: UINT8;
          let ubLevel2: UINT8;
          let ubLevel3: UINT8;

          // If we are going into a raised struct AND we have above level set to -1
          if (StructureBottomLevel(pStructure) != 1 && fForceOnGround) {
            break;
          }

          // Find most dence area...
          if (StructureDensity(pStructure, addressof(ubLevel0), addressof(ubLevel1), addressof(ubLevel2), addressof(ubLevel3))) {
            if (ubLevel3 == 0 && ubLevel2 == 0 && ubLevel1 == 0 && ubLevel0 == 0) {
              bRenderZHeightAboveLevel = 0;
            } else if (ubLevel3 >= ubLevel0 && ubLevel3 >= ubLevel2 && ubLevel3 >= ubLevel1) {
              bRenderZHeightAboveLevel = CONVERT_INDEX_TO_PIXELS(4);
            } else if (ubLevel2 >= ubLevel0 && ubLevel2 >= ubLevel1 && ubLevel2 >= ubLevel3) {
              bRenderZHeightAboveLevel = CONVERT_INDEX_TO_PIXELS(3);
            } else if (ubLevel1 >= ubLevel0 && ubLevel1 >= ubLevel2 && ubLevel1 >= ubLevel3) {
              bRenderZHeightAboveLevel = CONVERT_INDEX_TO_PIXELS(2);
            } else if (ubLevel0 >= ubLevel1 && ubLevel0 >= ubLevel2 && ubLevel0 >= ubLevel3) {
              bRenderZHeightAboveLevel = CONVERT_INDEX_TO_PIXELS(1);
            }
          }

          // Set flag indicating it has an item on top!
          pStructure.fFlags |= STRUCTURE_HASITEMONTOP;
          break;
        }
      }

      pStructure = FindNextStructure(pStructure, STRUCTURE_BLOCKSMOVES);
    }
  }

  if (pObject.usItem == Enum225.SWITCH && !fObjectInOpenable) {
    if (bVisible != -2) {
      // switch items which are not hidden inside objects should be considered buried
      bVisible = BURIED;
      // and they are pressure-triggered unless there is a switch structure there
      if (FindStructure(psGridNo.value, STRUCTURE_SWITCH) != null) {
        pObject.bDetonatorType = Enum224.BOMB_SWITCH;
      } else {
        pObject.bDetonatorType = Enum224.BOMB_PRESSURE;
      }
    } else {
      // else they are manually controlled
      pObject.bDetonatorType = Enum224.BOMB_SWITCH;
    }
  } else if (pObject.usItem == Enum225.ACTION_ITEM) {
    switch (pObject.bActionValue) {
      case Enum191.ACTION_ITEM_SMALL_PIT:
      case Enum191.ACTION_ITEM_LARGE_PIT:
        // mark as known about by civs and creatures
        gpWorldLevelData[sNewGridNo].uiFlags |= MAPELEMENT_ENEMY_MINE_PRESENT;
        break;
      default:
        break;
    }
  }

  if (psGridNo.value != sNewGridNo) {
    psGridNo.value = sNewGridNo;
  }

  // First add the item to the global list.  This is so the game can keep track
  // of where the items are, for file i/o, etc.
  iWorldItem = AddItemToWorld(psGridNo.value, pObject, ubLevel, usFlags, bRenderZHeightAboveLevel, bVisible);

  // Check for and existing pool on the object layer
  if ((pItemPool = GetItemPool(psGridNo.value, ubLevel))) {
    // Add to exitsing pool
    // Add graphic
    pNode = AddItemGraphicToWorld(Item[pObject.usItem], psGridNo.value, ubLevel);

    // Set pool head value in levelnode
    pNode.pItemPool = pItemPool;

    // Add New Node
    pItemPoolTemp = pItemPool;
    // Create new pool
    pItemPool = createItemPool();

    // Set Next to NULL
    pItemPool.pNext = null;
    // Set Item index
    pItemPool.iItemIndex = iWorldItem;
    // Get a link back!
    pItemPool.pLevelNode = pNode;

    if (pItemPoolTemp) {
      // Get last item in list
      while (pItemPoolTemp.pNext != null)
        pItemPoolTemp = pItemPoolTemp.pNext;

      // Set Next of previous
      pItemPoolTemp.pNext = pItemPool;
    }
    // Set Previous of new one
    pItemPool.pPrev = pItemPoolTemp;
  } else {
    pNode = AddItemGraphicToWorld(Item[pObject.usItem], psGridNo.value, ubLevel);

    // Create new pool
    pItemPool = createItemPool();

    pNode.pItemPool = pItemPool;

    // Set prev to NULL
    pItemPool.pPrev = null;
    // Set next to NULL
    pItemPool.pNext = null;
    // Set Item index
    pItemPool.iItemIndex = iWorldItem;
    // Get a link back!
    pItemPool.pLevelNode = pNode;

    // Set flag to indicate item pool presence
    gpWorldLevelData[psGridNo.value].uiFlags |= MAPELEMENT_ITEMPOOL_PRESENT;
  }

  // Set visible!
  pItemPool.bVisible = bVisible;

  // If bbisible is true, render makered world
  if (bVisible == 1 && GridNoOnScreen((psGridNo.value))) {
    // gpWorldLevelData[*psGridNo].uiFlags|=MAPELEMENT_REDRAW;
    // SetRenderFlags(RENDER_FLAG_MARKED);
    SetRenderFlags(RENDER_FLAG_FULL);
  }

  // Set flahs timer
  pItemPool.bFlashColor = 0;
  pItemPool.sGridNo = psGridNo.value;
  pItemPool.ubLevel = ubLevel;
  pItemPool.usFlags = usFlags;
  pItemPool.bVisible = bVisible;
  pItemPool.bRenderZHeightAboveLevel = bRenderZHeightAboveLevel;

  // ATE: Get head of pool again....
  if ((pItemPool = GetItemPool(psGridNo.value, ubLevel))) {
    AdjustItemPoolVisibility(pItemPool);
  }

  if (piItemIndex) {
    piItemIndex.value = iWorldItem;
  }

  return gWorldItems[iWorldItem].o;
}

function ItemExistsAtLocation(sGridNo: INT16, iItemIndex: INT32, ubLevel: UINT8): boolean {
  let pItemPool: ITEM_POOL | null;
  let pItemPoolTemp: ITEM_POOL | null;
  let fItemFound: boolean = false;

  // Check for an existing pool on the object layer
  if ((pItemPool = GetItemPool(sGridNo, ubLevel))) {
    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != null) {
      if (pItemPoolTemp.iItemIndex == iItemIndex) {
        return true;
      }
      pItemPoolTemp = pItemPoolTemp.pNext;
    }
  }

  return false;
}

export function ItemTypeExistsAtLocation(sGridNo: INT16, usItem: UINT16, ubLevel: UINT8, piItemIndex: Pointer<INT32>): boolean {
  let pItemPool: ITEM_POOL | null;
  let pItemPoolTemp: ITEM_POOL | null;
  let fItemFound: boolean = false;

  // Check for an existing pool on the object layer
  if ((pItemPool = GetItemPool(sGridNo, ubLevel))) {
    // LOOP THROUGH LIST TO FIND ITEM WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != null) {
      if (gWorldItems[pItemPoolTemp.iItemIndex].o.usItem == usItem) {
        if (piItemIndex) {
          piItemIndex.value = pItemPoolTemp.iItemIndex;
        }
        return true;
      }
      pItemPoolTemp = pItemPoolTemp.pNext;
    }
  }

  return false;
}

function GetItemOfClassTypeInPool(sGridNo: INT16, uiItemClass: UINT32, ubLevel: UINT8): INT32 {
  let pItemPool: ITEM_POOL | null;
  let pItemPoolTemp: ITEM_POOL | null;
  let fItemFound: boolean = false;

  // Check for an existing pool on the object layer
  if ((pItemPool = GetItemPool(sGridNo, ubLevel))) {
    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != null) {
      if (Item[gWorldItems[pItemPoolTemp.iItemIndex].o.usItem].usItemClass & uiItemClass) {
        return pItemPoolTemp.iItemIndex;
      }
      pItemPoolTemp = pItemPoolTemp.pNext;
    }
  }

  return -1;
}

function GetItemPoolForIndex(sGridNo: INT16, iItemIndex: INT32, ubLevel: UINT8): ITEM_POOL | null {
  let pItemPool: ITEM_POOL | null;
  let pItemPoolTemp: ITEM_POOL | null;
  let fItemFound: boolean = false;

  // Check for an existing pool on the object layer
  if ((pItemPool = GetItemPool(sGridNo, ubLevel))) {
    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != null) {
      if (pItemPoolTemp.iItemIndex == iItemIndex) {
        return pItemPoolTemp;
      }
      pItemPoolTemp = pItemPoolTemp.pNext;
    }
  }

  return null;
}

export function DoesItemPoolContainAnyHiddenItems(pItemPool: ITEM_POOL | null): boolean {
  // LOOP THROUGH LIST TO FIND NODE WE WANT
  while (pItemPool != null) {
    if (gWorldItems[pItemPool.iItemIndex].bVisible == HIDDEN_ITEM) {
      return true;
    }

    pItemPool = pItemPool.pNext;
  }

  return false;
}

function DoesItemPoolContainAllHiddenItems(pItemPool: ITEM_POOL | null): boolean {
  // LOOP THROUGH LIST TO FIND NODE WE WANT
  while (pItemPool != null) {
    if (gWorldItems[pItemPool.iItemIndex].bVisible != HIDDEN_ITEM) {
      return false;
    }

    pItemPool = pItemPool.pNext;
  }

  return true;
}

function LookForHiddenItems(sGridNo: INT16, ubLevel: INT8, fSetLocator: boolean, bZLevel: INT8): boolean {
  let pItemPool: ITEM_POOL | null = null;
  let pHeadItemPool: ITEM_POOL | null = null;
  let fFound: boolean = false;

  if ((pItemPool = GetItemPool(sGridNo, ubLevel))) {
    pHeadItemPool = pItemPool;

    // LOOP THROUGH LIST TO FIND NODE WE WANT
    while (pItemPool != null) {
      if (gWorldItems[pItemPool.iItemIndex].bVisible == HIDDEN_ITEM && gWorldItems[pItemPool.iItemIndex].o.usItem != Enum225.OWNERSHIP) {
        fFound = true;

        gWorldItems[pItemPool.iItemIndex].bVisible = INVISIBLE;
      }

      pItemPool = pItemPool.pNext;
    }
  }

  // If found, set item pool visibility...
  if (fFound) {
    SetItemPoolVisibilityOn(<ITEM_POOL>pHeadItemPool, INVISIBLE, fSetLocator);
  }

  return fFound;
}

export function GetZLevelOfItemPoolGivenStructure(sGridNo: INT16, ubLevel: UINT8, pStructure: STRUCTURE | null): INT8 {
  let pItemPool: ITEM_POOL | null;

  if (pStructure == null) {
    return 0;
  }

  // OK, check if this struct contains items....
  if ((pItemPool = GetItemPool(sGridNo, ubLevel))) {
    return GetLargestZLevelOfItemPool(pItemPool);
  }
  return 0;
}

export function GetLargestZLevelOfItemPool(pItemPool: ITEM_POOL | null): INT8 {
  // OK, loop through pools and get any height != 0........
  while (pItemPool != null) {
    if (pItemPool.bRenderZHeightAboveLevel > 0) {
      return pItemPool.bRenderZHeightAboveLevel;
    }

    pItemPool = pItemPool.pNext;
  }

  return 0;
}

function DoesItemPoolContainAllItemsOfHigherZLevel(pItemPool: ITEM_POOL | null): boolean {
  // LOOP THROUGH LIST TO FIND NODE WE WANT
  while (pItemPool != null) {
    if (pItemPool.bRenderZHeightAboveLevel == 0) {
      return false;
    }

    pItemPool = pItemPool.pNext;
  }

  return true;
}

function DoesItemPoolContainAllItemsOfZeroZLevel(pItemPool: ITEM_POOL | null): boolean {
  // LOOP THROUGH LIST TO FIND NODE WE WANT
  while (pItemPool != null) {
    if (pItemPool.bRenderZHeightAboveLevel != 0) {
      return false;
    }

    pItemPool = pItemPool.pNext;
  }

  return true;
}

function RemoveItemPool(sGridNo: INT16, ubLevel: UINT8): void {
  let pItemPool: ITEM_POOL | null;

  // Check for and existing pool on the object layer
  while ((pItemPool = GetItemPool(sGridNo, ubLevel))) {
    RemoveItemFromPool(sGridNo, pItemPool.iItemIndex, ubLevel);
  }
}

export function RemoveAllUnburiedItems(sGridNo: INT16, ubLevel: UINT8): void {
  let pItemPool: ITEM_POOL | null;

  // Check for and existing pool on the object layer
  pItemPool = GetItemPool(sGridNo, ubLevel);

  while (pItemPool) {
    if (gWorldItems[pItemPool.iItemIndex].bVisible == BURIED) {
      pItemPool = pItemPool.pNext;
    } else {
      RemoveItemFromPool(sGridNo, pItemPool.iItemIndex, ubLevel);
      // get new start pointer
      pItemPool = GetItemPool(sGridNo, ubLevel);
    }
  }
}

function LoopLevelNodeForShowThroughFlag(pNode: LEVELNODE | null, sGridNo: INT16, ubLevel: UINT8): void {
  while (pNode != null) {
    if (pNode.uiFlags & LEVELNODE_ITEM) {
      if (ubLevel == 0) {
        // If we are in a room....
        // if ( IsRoofPresentAtGridno( sGridNo ) || gfCaves || gfBasement )
        { pNode.uiFlags |= LEVELNODE_SHOW_THROUGH; }
      } else {
        pNode.uiFlags |= LEVELNODE_SHOW_THROUGH;
      }

      if (gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS]) {
        pNode.uiFlags |= LEVELNODE_DYNAMIC;
      }
    }
    pNode = pNode.pNext;
  }
}

function HandleItemObscuredFlag(sGridNo: INT16, ubLevel: UINT8): void {
  let pNode: LEVELNODE | null;

  if (ubLevel == 0) {
    pNode = gpWorldLevelData[sGridNo].pStructHead;
    LoopLevelNodeForShowThroughFlag(pNode, sGridNo, ubLevel);
  } else {
    pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
    LoopLevelNodeForShowThroughFlag(pNode, sGridNo, ubLevel);
  }
}

export function SetItemPoolVisibilityOn(pItemPool: ITEM_POOL, bAllGreaterThan: INT8, fSetLocator: boolean): boolean {
  let pItemPoolTemp: ITEM_POOL | null;
  let fAtLeastModified: boolean = false;
  let fDeleted: boolean = false;
  let bVisibleValue: INT8;
  // OBJECTTYPE *pObj;

  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != null) {
    bVisibleValue = gWorldItems[pItemPoolTemp.iItemIndex].bVisible;

    // Update each item...
    if (bVisibleValue != VISIBLE) {
      if (gWorldItems[pItemPoolTemp.iItemIndex].o.usItem == Enum225.ACTION_ITEM) {
        // NEVER MAKE VISIBLE!
        pItemPoolTemp = pItemPoolTemp.pNext;
        continue;
      }

      // If we have reached a visible value we should not modify, ignore...
      if (bVisibleValue >= bAllGreaterThan && gWorldItems[pItemPoolTemp.iItemIndex].o.usItem != Enum225.OWNERSHIP) {
        // Update the world value
        gWorldItems[pItemPoolTemp.iItemIndex].bVisible = VISIBLE;

        fAtLeastModified = true;
      }

      /*
      if ( gWorldItems[ pItemPoolTemp->iItemIndex ].o.usItem == ACTION_ITEM )
      {
              pObj = &(gWorldItems[ pItemPoolTemp->iItemIndex ].o);
              switch( pObj->bActionValue )
              {
                      case ACTION_ITEM_SMALL_PIT:
                      case ACTION_ITEM_LARGE_PIT:
                              if (pObj->bDetonatorType == 0)
                              {
                                      // randomly set to active or destroy the item!
                                      if (Random( 100 ) < 65)
                                      {
                                              ArmBomb( pObj, 0 ); // will be set to pressure type so freq is irrelevant
                                              gWorldItems[ pItemPoolTemp->iItemIndex ].usFlags |= WORLD_ITEM_ARMED_BOMB;
                                              AddBombToWorld( pItemPoolTemp->iItemIndex );
                                      }
                                      else
                                      {
                                              // get pointer to the next element NOW
                                              pItemPoolTemp	= pItemPoolTemp->pNext;
                                              // set flag so we don't traverse an additional time
                                              fDeleted = TRUE;
                                              // remove item from pool
                                              RemoveItemFromPool( pItemPool->sGridNo, pItemPool->iItemIndex, pItemPool->ubLevel );
                                      }
                              }
                              break;
                      default:
                              break;
              }
      }
      */

      if (fDeleted) {
        // don't get the 'next' pointer because we did so above

        // reset fDeleted to false so we don't skip moving through the list more than once
        fDeleted = false;
      } else {
        pItemPoolTemp = pItemPoolTemp.pNext;
      }
    } else {
      pItemPoolTemp = pItemPoolTemp.pNext;
    }
  }

  // If we didn;t find any that should be modified..
  if (!fAtLeastModified) {
    return false;
  }

  // Update global pool bVisible to true ( if at least one is visible... )
  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != null) {
    pItemPoolTemp.bVisible = VISIBLE;

    pItemPoolTemp = pItemPoolTemp.pNext;
  }

  // Handle obscured flag...
  HandleItemObscuredFlag(pItemPool.sGridNo, pItemPool.ubLevel);

  if (fSetLocator) {
    SetItemPoolLocator(pItemPool);
  }

  return true;
}

export function SetItemPoolVisibilityHidden(pItemPool: ITEM_POOL): void {
  let pItemPoolTemp: ITEM_POOL | null;

  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != null) {
    // Update the world value
    gWorldItems[pItemPoolTemp.iItemIndex].bVisible = HIDDEN_IN_OBJECT;
    pItemPoolTemp.bVisible = HIDDEN_IN_OBJECT;

    pItemPoolTemp = pItemPoolTemp.pNext;
  }
}

// This determines the overall initial visibility of the pool...
// IF ANY are set to VISIBLE, MODIFY
function AdjustItemPoolVisibility(pItemPool: ITEM_POOL): void {
  let pItemPoolTemp: ITEM_POOL | null;
  let fAtLeastModified: boolean = false;

  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != null) {
    // DEFAULT ITEM POOL TO INVISIBLE....
    pItemPoolTemp.bVisible = INVISIBLE;

    // Update each item...
    // If we have reached a visible value we should not modify, ignore...
    if (gWorldItems[pItemPoolTemp.iItemIndex].bVisible == VISIBLE) {
      fAtLeastModified = true;
    }

    pItemPoolTemp = pItemPoolTemp.pNext;
  }

  // Handle obscured flag...
  HandleItemObscuredFlag(pItemPool.sGridNo, pItemPool.ubLevel);

  // If we didn;t find any that should be modified..
  if (!fAtLeastModified) {
    return;
  }

  // Update global pool bVisible to true ( if at least one is visible... )
  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != null) {
    pItemPoolTemp.bVisible = VISIBLE;

    pItemPoolTemp = pItemPoolTemp.pNext;
  }

  // Handle obscured flag...
  HandleItemObscuredFlag(pItemPool.sGridNo, pItemPool.ubLevel);
}

export function RemoveItemFromPool(sGridNo: INT16, iItemIndex: INT32, ubLevel: UINT8): boolean {
  let pItemPool: ITEM_POOL | null;
  let pItemPoolTemp: ITEM_POOL | null;
  let fItemFound: boolean = false;
  let pObject: LEVELNODE | null;

  // Check for and existing pool on the object layer
  if ((pItemPool = GetItemPool(sGridNo, ubLevel))) {
    // REMOVE FROM LIST

    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != null) {
      if (pItemPoolTemp.iItemIndex == iItemIndex) {
        fItemFound = true;
        break;
      }
      pItemPoolTemp = pItemPoolTemp.pNext;
    }

    if (!fItemFound) {
      // COULDNOT FIND ITEM? MAYBE SOMEBODY GOT IT BEFORE WE GOT THERE!
      return false;
    }

    Assert(pItemPoolTemp);

    // REMOVE GRAPHIC
    RemoveItemGraphicFromWorld(Item[gWorldItems[iItemIndex].o.usItem], sGridNo, ubLevel, pItemPoolTemp.pLevelNode);

    // IF WE ARE LOCATIONG STILL, KILL LOCATOR!
    if (pItemPoolTemp.bFlashColor != 0) {
      // REMOVE TIMER!
      RemoveFlashItemSlot(pItemPoolTemp);
    }

    // REMOVE PREV
    if (pItemPoolTemp.pPrev != null) {
      pItemPoolTemp.pPrev.pNext = pItemPoolTemp.pNext;
    }

    // REMOVE NEXT
    if (pItemPoolTemp.pNext != null) {
      pItemPoolTemp.pNext.pPrev = pItemPoolTemp.pPrev;
    }

    // IF THIS NODE WAS THE HEAD, SET ANOTHER AS HEAD AT THIS GRIDNO
    if (pItemPoolTemp.pPrev == null) {
      // WE'RE HEAD
      if (ubLevel == 0) {
        pObject = gpWorldLevelData[sGridNo].pStructHead;
      } else {
        pObject = gpWorldLevelData[sGridNo].pOnRoofHead;
      }

      fItemFound = false;
      // LOOP THORUGH OBJECT LAYER
      while (pObject != null) {
        if (pObject.uiFlags & LEVELNODE_ITEM) {
          // ADJUST TO NEXT GUY FOR HEAD
          pObject.pItemPool = <ITEM_POOL>pItemPoolTemp.pNext;
          fItemFound = true;
        }
        pObject = pObject.pNext;
      }

      if (!fItemFound) {
        // THIS WAS THE LAST ITEM IN THE POOL!
        gpWorldLevelData[sGridNo].uiFlags &= ~(MAPELEMENT_ITEMPOOL_PRESENT);
      }
    }

    // Find any structure with flag set as having items on top.. if this one did...
    if (pItemPoolTemp.bRenderZHeightAboveLevel > 0) {
      let pStructure: STRUCTURE | null;
      let pTempPool: ITEM_POOL | null;

      // Check if an item pool exists here....
      if ((pTempPool = GetItemPool(pItemPoolTemp.sGridNo, pItemPoolTemp.ubLevel)) === null) {
        pStructure = FindStructure(pItemPoolTemp.sGridNo, STRUCTURE_HASITEMONTOP);

        if (pStructure != null) {
          // Remove...
          pStructure.fFlags &= (~STRUCTURE_HASITEMONTOP);

          // Re-adjust interactive tile...
          BeginCurInteractiveTileCheck(INTILE_CHECK_SELECTIVE);
        }
      }
    }

    AdjustItemPoolVisibility(pItemPoolTemp);

    // DELETE
    MemFree(pItemPoolTemp);

    RemoveItemFromWorld(iItemIndex);

    return true;
  }

  return false;
}

export function MoveItemPools(sStartPos: INT16, sEndPos: INT16): boolean {
  // note, only works between locations on the ground
  let pItemPool: ITEM_POOL | null;
  let TempWorldItem: WORLDITEM = createWorldItem();

  // While there is an existing pool
  while ((pItemPool = GetItemPool(sStartPos, 0))) {
    copyWorldItem(TempWorldItem, gWorldItems[pItemPool.iItemIndex]);
    RemoveItemFromPool(sStartPos, pItemPool.iItemIndex, 0);
    AddItemToPool(sEndPos, TempWorldItem.o, -1, TempWorldItem.ubLevel, TempWorldItem.usFlags, TempWorldItem.bRenderZHeightAboveLevel);
  }
  return true;
}

export function GetItemPool(usMapPos: UINT16, ubLevel: UINT8): ITEM_POOL | null {
  let pItemPool: ITEM_POOL | null;

  let pObject: LEVELNODE | null;

  if (ubLevel == 0) {
    pObject = gpWorldLevelData[usMapPos].pStructHead;
  } else {
    pObject = gpWorldLevelData[usMapPos].pOnRoofHead;
  }

  // LOOP THORUGH OBJECT LAYER
  while (pObject != null) {
    if (pObject.uiFlags & LEVELNODE_ITEM) {
      pItemPool = pObject.pItemPool;

      // DEF added the check because pObject->pItemPool was NULL which was causing problems
      if (pItemPool)
        return pItemPool;
      else
        return null;
    }

    pObject = pObject.pNext;
  }

  return null;
}

export function NotifySoldiersToLookforItems(): void {
  let cnt: UINT32;
  let pSoldier: SOLDIERTYPE;

  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    if (pSoldier != null) {
      pSoldier.uiStatusFlags |= SOLDIER_LOOKFOR_ITEMS;
    }
  }
}

export function AllSoldiersLookforItems(fShowLocators: boolean): void {
  let cnt: UINT32;
  let pSoldier: SOLDIERTYPE;

  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    if (pSoldier != null) {
      RevealRoofsAndItems(pSoldier, true, fShowLocators, pSoldier.bLevel, false);
    }
  }
}

function GetNumOkForDisplayItemsInPool(pItemPool: ITEM_POOL | null, bZLevel: INT8): INT16 {
  let cnt: INT32;

  // Determine total #
  cnt = 0;
  while (pItemPool != null) {
    if (ItemPoolOKForDisplay(pItemPool, bZLevel)) {
      cnt++;
    }

    pItemPool = pItemPool.pNext;
  }

  return cnt;
}

export function AnyItemsVisibleOnLevel(pItemPool: ITEM_POOL | null, bZLevel: INT8): boolean {
  if ((gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
    return true;
  }

  // Determine total #
  while (pItemPool != null) {
    if (pItemPool.bRenderZHeightAboveLevel == bZLevel) {
      if (gWorldItems[pItemPool.iItemIndex].bVisible == VISIBLE) {
        return true;
      }
    }

    pItemPool = pItemPool.pNext;
  }

  return false;
}

export function ItemPoolOKForDisplay(pItemPool: ITEM_POOL, bZLevel: INT8): boolean {
  if (gTacticalStatus.uiFlags & SHOW_ALL_ITEMS) {
    return true;
  }

  // Setup some conditions!
  if (gWorldItems[pItemPool.iItemIndex].bVisible != VISIBLE) {
    return false;
  }

  // If -1, it means find all
  if (pItemPool.bRenderZHeightAboveLevel != bZLevel && bZLevel != -1) {
    return false;
  }

  return true;
}

function ItemPoolOKForPickup(pSoldier: SOLDIERTYPE, pItemPool: ITEM_POOL, bZLevel: INT8): boolean {
  if (gTacticalStatus.uiFlags & SHOW_ALL_ITEMS) {
    return true;
  }

  if (pSoldier.bTeam == gbPlayerNum) {
    // Setup some conditions!
    if (gWorldItems[pItemPool.iItemIndex].bVisible != VISIBLE) {
      return false;
    }
  }

  // If -1, it means find all
  if (pItemPool.bRenderZHeightAboveLevel != bZLevel && bZLevel != -1) {
    return false;
  }

  return true;
}

export function DrawItemPoolList(pItemPool: ITEM_POOL | null, sGridNo: INT16, bCommand: UINT8, bZLevel: INT8, sXPos: INT16, sYPos: INT16): boolean {
  let sY: INT16;
  let pItem: INVTYPE;
  let pTempItemPool: ITEM_POOL | null;
  let pStr: string /* INT16[100] */;
  let cnt: INT16 = 0;
  let sHeight: INT16 = 0;
  let sLargeLineWidth: INT16 = 0;
  let sLineWidth: INT16;
  let fRecalcNumListed: boolean = false;
  let fSelectionDone: boolean = false;

  let gbCurrentItemSel: INT8 = 0;
  let bNumItemsListed: INT8 = 0;
  let sFontX: INT16;
  let sFontY: INT16;
  let sLargestLineWidth: INT16 = 30;
  let bCurStart: INT8 = 0;
  let fDoBack: boolean;

  // Take a look at each guy in current sqaud and check for compatible ammo...

  // Determine how many there are
  // MOVE HEAD TO CURRENT START
  cnt = 0;
  pTempItemPool = pItemPool;
  while (pTempItemPool != null) {
    if (cnt == bCurStart) {
      break;
    }

    // ATE: Put some conditions on this....
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      cnt++;
    }

    pTempItemPool = pTempItemPool.pNext;
  }

  cnt = bCurStart;
  fDoBack = false;
  while (pTempItemPool != null) {
    // IF WE HAVE MORE THAN THE SET AMOUNT, QUIT NOW!
    if (cnt == (bCurStart + NUM_ITEMS_LISTED)) {
      cnt++;
      fDoBack = true;
      break;
    }

    // ATE: Put some conditions on this....
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      cnt++;
    }

    sHeight += GetFontHeight(SMALLFONT1()) - 2;

    pTempItemPool = pTempItemPool.pNext;
  }

  pTempItemPool = pItemPool;
  while (pTempItemPool != null) {
    // ATE: Put some conditions on this....
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), gWorldItems[pTempItemPool.iItemIndex].o, false);
    }

    pTempItemPool = pTempItemPool.pNext;
  }

  // IF COUNT IS ALREADY > MAX, ADD A PREV...
  if (bCurStart >= NUM_ITEMS_LISTED) {
    cnt++;
  }

  bNumItemsListed = cnt;

  // RENDER LIST!
  // Determine max length
  pTempItemPool = pItemPool;
  while (pTempItemPool != null) {
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      // GET ITEM
      pItem = Item[gWorldItems[pTempItemPool.iItemIndex].o.usItem];
      // Set string
      if (gWorldItems[pTempItemPool.iItemIndex].o.ubNumberOfObjects > 1) {
        pStr = swprintf("%s (%d)", ShortItemNames[gWorldItems[pTempItemPool.iItemIndex].o.usItem], gWorldItems[pTempItemPool.iItemIndex].o.ubNumberOfObjects);
      } else {
        pStr = swprintf("%s", ShortItemNames[gWorldItems[pTempItemPool.iItemIndex].o.usItem]);
      }

      // Get Width
      sLineWidth = StringPixLength(pStr, SMALLFONT1());

      if (sLineWidth > sLargeLineWidth) {
        sLargeLineWidth = sLineWidth;
      }
      sLargestLineWidth = sLargeLineWidth;
    }
    pTempItemPool = pTempItemPool.pNext;
  }

  // Determine where our mouse is!
  if (sXPos > (640 - sLargestLineWidth)) {
    sFontX = sXPos - sLargestLineWidth;
  } else {
    sFontX = sXPos + 15;
  }
  sFontY = sYPos;

  // Move up if over interface....
  if ((sFontY + sHeight) > 340) {
    sFontY = 340 - sHeight;
  }

  // Detertime vertiacal center
  sFontY -= (sHeight / 2);

  SetFont(SMALLFONT1());
  SetFontBackground(FONT_MCOLOR_BLACK);
  SetFontForeground(FONT_MCOLOR_DKGRAY);

  // MOVE HEAD TO CURRENT START
  cnt = 0;
  while (pItemPool != null) {
    if (cnt == bCurStart) {
      break;
    }

    if (ItemPoolOKForDisplay(pItemPool, bZLevel)) {
      cnt++;
    }

    pItemPool = pItemPool.pNext;
  }

  // START DISPLAY LOOP
  cnt = bCurStart;
  sY = sFontY;

  // ADD PREV TO THIS LIST!
  if (bCurStart >= NUM_ITEMS_LISTED) {
    // Set string
    if (cnt == gbCurrentItemSel) {
      SetFontForeground(FONT_MCOLOR_LTGRAY);
    } else {
      SetFontForeground(FONT_MCOLOR_DKGRAY);
    }
    pStr = TacticalStr[Enum335.ITEMPOOL_POPUP_PREV_STR];
    gprintfdirty(sFontX, sY, pStr);
    mprintf(sFontX, sY, pStr);
    sY += GetFontHeight(SMALLFONT1()) - 2;
    cnt++;
  }

  while (pItemPool != null) {
    if (bCommand == ITEMLIST_HANDLE) {
      if (cnt == gbCurrentItemSel) {
        SetFontForeground(FONT_MCOLOR_LTGRAY);
      } else {
        SetFontForeground(FONT_MCOLOR_DKGRAY);
      }
    }

    if (ItemPoolOKForDisplay(pItemPool, bZLevel)) {
      // GET ITEM
      pItem = Item[gWorldItems[pItemPool.iItemIndex].o.usItem];
      // Set string

      if (gWorldItems[pItemPool.iItemIndex].o.ubNumberOfObjects > 1) {
        pStr = swprintf("%s (%d)", ShortItemNames[gWorldItems[pItemPool.iItemIndex].o.usItem], gWorldItems[pItemPool.iItemIndex].o.ubNumberOfObjects);
      } else {
        pStr = swprintf("%s", ShortItemNames[gWorldItems[pItemPool.iItemIndex].o.usItem]);
      }

      gprintfdirty(sFontX, sY, pStr);
      mprintf(sFontX, sY, pStr);

      sY += GetFontHeight(SMALLFONT1()) - 2;
      cnt++;
    }
    pItemPool = pItemPool.pNext;

    if (fDoBack) {
      if (cnt == (bNumItemsListed - 1)) {
        break;
      }
    }
  }
  if (fDoBack) {
    if (cnt == (bNumItemsListed - 1)) {
      // Set string
      if (cnt == gbCurrentItemSel) {
        SetFontForeground(FONT_MCOLOR_LTGRAY);
      } else {
        SetFontForeground(FONT_MCOLOR_DKGRAY);
      }
      pStr = TacticalStr[Enum335.ITEMPOOL_POPUP_MORE_STR];
      gprintfdirty(sFontX, sY, pStr);
      mprintf(sFontX, sY, pStr);
    }
  }

  return fSelectionDone;
}

function GetListMouseHotSpot(sLargestLineWidth: INT16, bNumItemsListed: INT8, sFontX: INT16, sFontY: INT16, bCurStart: INT8): INT8 {
  let cnt: INT16 = 0;
  let sTestX1: INT16;
  let sTestX2: INT16;
  let sTestY1: INT16;
  let sTestY2: INT16;
  let sLineHeight: INT16;
  let gbCurrentItemSel: INT8 = -1;
  let bListedItems: INT8;

  sLineHeight = GetFontHeight(SMALLFONT1()) - 2;

  sTestX1 = sFontX;
  sTestX2 = sFontX + sLargestLineWidth;

  bListedItems = (bNumItemsListed - bCurStart);

  if (gusMouseXPos < sTestX1 || gusMouseXPos > sTestX2) {
    gbCurrentItemSel = -1;
  } else {
    // Determine where mouse is!
    for (cnt = 0; cnt < bListedItems; cnt++) {
      sTestY1 = sFontY + (sLineHeight * cnt);
      sTestY2 = sFontY + (sLineHeight * (cnt + 1));

      if (gusMouseYPos > sTestY1 && gusMouseYPos < sTestY2) {
        gbCurrentItemSel = cnt;
        break;
      }
    }
  }

  // OFFSET START
  gbCurrentItemSel += bCurStart;

  return gbCurrentItemSel;
}

function SetItemPoolLocator(pItemPool: ITEM_POOL): void {
  pItemPool.bFlashColor = 59;

  pItemPool.uiTimerID = AddFlashItemSlot(pItemPool, null, 0);
}

function SetItemPoolLocatorWithCallback(pItemPool: ITEM_POOL, Callback: ITEM_POOL_LOCATOR_HOOK): void {
  pItemPool.bFlashColor = 59;

  pItemPool.uiTimerID = AddFlashItemSlot(pItemPool, Callback, 0);
}

/// ITEM POOL INDICATOR FUNCTIONS

function GetFreeFlashItemSlot(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumFlashItemSlots; uiCount++) {
    if ((FlashItemSlots[uiCount].fAllocated == false))
      return uiCount;
  }

  if (guiNumFlashItemSlots < NUM_ITEM_FLASH_SLOTS)
    return guiNumFlashItemSlots++;

  return -1;
}

function RecountFlashItemSlots(): void {
  let uiCount: INT32;

  for (uiCount = guiNumFlashItemSlots - 1; (uiCount >= 0); uiCount--) {
    if ((FlashItemSlots[uiCount].fAllocated)) {
      guiNumFlashItemSlots = (uiCount + 1);
      break;
    }
  }
}

function AddFlashItemSlot(pItemPool: ITEM_POOL, Callback: ITEM_POOL_LOCATOR_HOOK | null, ubFlags: UINT8): INT32 {
  let iFlashItemIndex: INT32;

  if ((iFlashItemIndex = GetFreeFlashItemSlot()) == (-1))
    return -1;

  ubFlags |= ITEM_LOCATOR_LOCKED;

  FlashItemSlots[iFlashItemIndex].pItemPool = pItemPool;

  FlashItemSlots[iFlashItemIndex].bRadioFrame = 0;
  FlashItemSlots[iFlashItemIndex].uiLastFrameUpdate = GetJA2Clock();
  FlashItemSlots[iFlashItemIndex].Callback = Callback;
  FlashItemSlots[iFlashItemIndex].fAllocated = true;
  FlashItemSlots[iFlashItemIndex].ubFlags = ubFlags;

  return iFlashItemIndex;
}

export function RemoveFlashItemSlot(pItemPool: ITEM_POOL | null): boolean {
  let uiCount: UINT32;

  if (pItemPool == null) {
    return false;
  }

  for (uiCount = 0; uiCount < guiNumFlashItemSlots; uiCount++) {
    if (FlashItemSlots[uiCount].fAllocated) {
      if (FlashItemSlots[uiCount].pItemPool == pItemPool) {
        FlashItemSlots[uiCount].fAllocated = false;

        // Check if we have a callback and call it if so!
        if (FlashItemSlots[uiCount].Callback != null) {
          FlashItemSlots[uiCount].Callback();
        }

        return true;
      }
    }
  }

  return true;
}

export function HandleFlashingItems(): void {
  let cnt: UINT32;
  let pItemPool: ITEM_POOL;
  let pObject: LEVELNODE | null;
  let pLocator: ITEM_POOL_LOCATOR;
  let fDoLocator: boolean = false;

  if (COUNTERDONE(Enum386.CYCLERENDERITEMCOLOR)) {
    RESETCOUNTER(Enum386.CYCLERENDERITEMCOLOR);

    for (cnt = 0; cnt < guiNumFlashItemSlots; cnt++) {
      pLocator = FlashItemSlots[cnt];

      if (pLocator.fAllocated) {
        fDoLocator = true;

        if ((pLocator.ubFlags & ITEM_LOCATOR_LOCKED)) {
          if (gTacticalStatus.fLockItemLocators == false) {
            // Turn off!
            pLocator.ubFlags &= (~ITEM_LOCATOR_LOCKED);
          } else {
            fDoLocator = false;
          }
        }

        if (fDoLocator) {
          pItemPool = pLocator.pItemPool;

          // Update radio locator
          {
            let uiClock: UINT32;

            uiClock = GetJA2Clock();

            // Update frame values!
            if ((uiClock - pLocator.uiLastFrameUpdate) > 80) {
              pLocator.uiLastFrameUpdate = uiClock;

              // Update frame
              pLocator.bRadioFrame++;

              if (pLocator.bRadioFrame == 5) {
                pLocator.bRadioFrame = 0;
              }
            }
          }

          // UPDATE FLASH COLOR VALUE
          pItemPool.bFlashColor--;

          if (pItemPool.ubLevel == 0) {
            pObject = gpWorldLevelData[pItemPool.sGridNo].pStructHead;
          } else {
            pObject = gpWorldLevelData[pItemPool.sGridNo].pOnRoofHead;
          }

          // LOOP THORUGH OBJECT LAYER
          while (pObject != null) {
            if (pObject.uiFlags & LEVELNODE_ITEM) {
              if (pItemPool.bFlashColor == 1) {
                // pObject->uiFlags &= (~LEVELNODE_DYNAMIC);
                // pObject->uiFlags |= ( LEVELNODE_LASTDYNAMIC  );
              } else {
                // pObject->uiFlags |= LEVELNODE_DYNAMIC;
              }
            }

            pObject = pObject.pNext;
          }

          if (pItemPool.bFlashColor == 1) {
            pItemPool.bFlashColor = 0;

            // REMOVE TIMER!
            RemoveFlashItemSlot(pItemPool);

            SetRenderFlags(RENDER_FLAG_FULL);
          }
        }
      }
    }

    RecountFlashItemSlots();
  }
}

export function RenderTopmostFlashingItems(): void {
  let cnt: UINT32;
  let pItemPool: ITEM_POOL;
  let pLocator: ITEM_POOL_LOCATOR;

  for (cnt = 0; cnt < guiNumFlashItemSlots; cnt++) {
    pLocator = FlashItemSlots[cnt];

    if (pLocator.fAllocated) {
      if (!(pLocator.ubFlags & (ITEM_LOCATOR_LOCKED))) {
        pItemPool = pLocator.pItemPool;

        // Update radio locator
        {
          let dOffsetX: FLOAT;
          let dOffsetY: FLOAT;
          let dTempX_S: FLOAT;
          let dTempY_S: FLOAT;
          let sX: INT16;
          let sY: INT16;
          let sXPos: INT16;
          let sYPos: INT16;
          let iBack: INT32;

          ({ sX, sY } = ConvertGridNoToCenterCellXY(pItemPool.sGridNo));

          dOffsetX = (sX - gsRenderCenterX);
          dOffsetY = (sY - gsRenderCenterY);

          // Calculate guy's position
          ({ dScreenX: dTempX_S, dScreenY: dTempY_S } = FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY));

          sXPos = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + dTempX_S;
          sYPos = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + dTempY_S - gpWorldLevelData[pItemPool.sGridNo].sHeight;

          // Adjust for offset position on screen
          sXPos -= gsRenderWorldOffsetX;
          sYPos -= gsRenderWorldOffsetY;
          sYPos -= pItemPool.bRenderZHeightAboveLevel;

          // Adjust for render height
          sYPos += gsRenderHeight;

          // Adjust for level height
          if (pItemPool.ubLevel) {
            sYPos -= ROOF_LEVEL_HEIGHT;
          }

          // Center circle!
          sXPos -= 20;
          sYPos -= 20;

          iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, null, sXPos, sYPos, (sXPos + 40), (sYPos + 40));
          if (iBack != -1) {
            SetBackgroundRectFilled(iBack);
          }

          BltVideoObjectFromIndex(FRAME_BUFFER, guiRADIO, pLocator.bRadioFrame, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, null);

          DrawItemPoolList(pItemPool, pItemPool.sGridNo, ITEMLIST_DISPLAY, pItemPool.bRenderZHeightAboveLevel, sXPos, sYPos);
        }
      }
    }
  }
}

export function VerifyGiveItem(pSoldier: SOLDIERTYPE, ppTargetSoldier: Pointer<Pointer<SOLDIERTYPE>>): boolean {
  let pTSoldier: SOLDIERTYPE;
  let usSoldierIndex: UINT16;
  let pObject: OBJECTTYPE | null;

  let sGridNo: INT16;
  let ubDirection: UINT8;
  let ubTargetMercID: UINT8;

  // DO SOME CHECKS IF WE CAN DO ANIMATION.....

  // Get items from pending data
  pObject = pSoldier.pTempObject;

  sGridNo = pSoldier.sPendingActionData2;
  ubDirection = pSoldier.bPendingActionData3;
  ubTargetMercID = pSoldier.uiPendingActionData4;

  usSoldierIndex = WhoIsThere2(sGridNo, pSoldier.bLevel);

  // See if our target is still available
  if (usSoldierIndex != NOBODY) {
    // Check if it's the same merc!
    if (usSoldierIndex != ubTargetMercID) {
      return false;
    }

    // Get soldier
    pTSoldier = <SOLDIERTYPE>GetSoldier(usSoldierIndex);

    // Look for item in hand....

    (ppTargetSoldier.value) = pTSoldier;

    return true;
  } else {
    if (pSoldier.pTempObject != null) {
      AddItemToPool(pSoldier.sGridNo, pSoldier.pTempObject, 1, pSoldier.bLevel, 0, -1);

      // Place it on the ground!
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.ITEM_HAS_BEEN_PLACED_ON_GROUND_STR], ShortItemNames[pSoldier.pTempObject.usItem]);

      // OK, disengage buddy
      pSoldier.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);

      if (ubTargetMercID != NOBODY) {
        MercPtrs[ubTargetMercID].uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
      }

      pSoldier.pTempObject = null;
    }
  }

  return false;
}

export function SoldierGiveItemFromAnimation(pSoldier: SOLDIERTYPE): void {
  let pTSoldier: SOLDIERTYPE;
  let bInvPos: INT8;
  let TempObject: OBJECTTYPE = createObjectType();
  let ubProfile: UINT8;

  let sGridNo: INT16;
  let ubDirection: UINT8;
  let ubTargetMercID: UINT8;
  let usItemNum: UINT16;
  let fToTargetPlayer: boolean = false;

  // Get items from pending data

  // Get objectype and delete
  copyObjectType(TempObject, <OBJECTTYPE>pSoldier.pTempObject);
  pSoldier.pTempObject = null;

  bInvPos = pSoldier.bPendingActionData5;
  usItemNum = TempObject.usItem;

  // ATE: OK, check if we have an item in the cursor from
  // this soldier and from this inv slot, if so, delete!!!!!!!
  if (gpItemPointer != null) {
    if (pSoldier.ubID == gpItemPointerSoldier.ubID) {
      if (bInvPos == gbItemPointerSrcSlot && usItemNum == gpItemPointer.usItem) {
        // Remove!!!
        EndItemPointer();
      }
    }
  }

  sGridNo = pSoldier.sPendingActionData2;
  ubDirection = pSoldier.bPendingActionData3;
  ubTargetMercID = pSoldier.uiPendingActionData4;

  // ATE: Deduct APs!
  DeductPoints(pSoldier, AP_PICKUP_ITEM, 0);

  if (VerifyGiveItem(pSoldier, addressof(pTSoldier))) {
    // DAVE! - put stuff here to bring up shopkeeper.......

    // if the user just clicked on an arms dealer
    if (IsMercADealer(pTSoldier.ubProfile)) {
      UnSetEngagedInConvFromPCAction(pSoldier);

      // if the dealer is Micky,
      /*
      if( pTSoldier->ubProfile == MICKY )
      {
              //and the items are alcohol, dont enter the shopkeeper
              if( GetArmsDealerItemTypeFromItemNumber( TempObject.usItem ) == ARMS_DEALER_ALCOHOL )
                      return;
      }
      */

      if (NPCHasUnusedRecordWithGivenApproach(pTSoldier.ubProfile, Enum296.APPROACH_BUYSELL)) {
        TriggerNPCWithGivenApproach(pTSoldier.ubProfile, Enum296.APPROACH_BUYSELL, true);
        return;
      }
      // now also check for buy/sell lines (Oct 13)
      /*
      else if ( NPCWillingToAcceptItem( pTSoldier->ubProfile, pSoldier->ubProfile, &TempObject ) )
      {
              TriggerNPCWithGivenApproach( pTSoldier->ubProfile, APPROACH_GIVINGITEM, TRUE );
              return;
      }*/
      else if (!NPCWillingToAcceptItem(pTSoldier.ubProfile, pSoldier.ubProfile, TempObject)) {
        // Enter the shopkeeper interface
        EnterShopKeeperInterfaceScreen(pTSoldier.ubProfile);

        // removed the if, because if the player picked up an item straight from the ground or money strait from the money
        // interface, the item would NOT have a bInvPos, therefore it would not get added to the dealer, and would get deleted
        //				if ( bInvPos != NO_SLOT )
        {
          // MUST send in NO_SLOT, as the SKI wille expect it to exist in inv if not....
          AddItemToPlayersOfferAreaAfterShopKeeperOpen(TempObject, NO_SLOT);

          /*
          Changed because if the player gave 1 item from a pile, the rest of the items in the piule would disappear
                                                  // OK, r	emove the item, as the SKI will give it back once done
                                                  DeleteObj( &( pSoldier->inv[ bInvPos ] ) );
          */

          if (bInvPos != NO_SLOT) {
            RemoveObjFrom(pSoldier.inv[bInvPos], TempObject.ubNumberOfObjects);
          }

          DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
        }

        return;
      }
    }

    // OK< FOR NOW HANDLE NPC's DIFFERENT!
    ubProfile = pTSoldier.ubProfile;

    // 1 ) PLayer to NPC = NPC
    // 2 ) Player to player = player;
    // 3 ) NPC to player = player;
    // 4 ) NPC TO NPC = NPC

    // Switch on target...
    // Are we a player dude.. ( target? )
    if (ubProfile < FIRST_RPC || RPC_RECRUITED(pTSoldier)) {
      fToTargetPlayer = true;
    }

    if (fToTargetPlayer) {
      // begin giving
      DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);

      // We are a merc, add!
      if (!AutoPlaceObject(pTSoldier, TempObject, true)) {
        // Erase!
        if (bInvPos != NO_SLOT) {
          DeleteObj(pSoldier.inv[bInvPos]);
          DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
        }

        AddItemToPool(pSoldier.sGridNo, TempObject, 1, pSoldier.bLevel, 0, -1);

        // We could not place it!
        // Drop it on the ground?
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.ITEM_HAS_BEEN_PLACED_ON_GROUND_STR], ShortItemNames[usItemNum]);

        // OK, disengage buddy
        pSoldier.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
        pTSoldier.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
      } else {
        // Erase!
        if (bInvPos != NO_SLOT) {
          DeleteObj(pSoldier.inv[bInvPos]);
          DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
        }

        // OK, it's given, display message!
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.ITEM_HAS_BEEN_GIVEN_TO_STR], ShortItemNames[usItemNum], pTSoldier.name);
        if (usItemNum == Enum225.MONEY) {
          // are we giving money to an NPC, to whom we owe money?
          if (pTSoldier.ubProfile != NO_PROFILE && gMercProfiles[pTSoldier.ubProfile].iBalance < 0) {
            gMercProfiles[pTSoldier.ubProfile].iBalance += TempObject.uiMoneyAmount;
            if (gMercProfiles[pTSoldier.ubProfile].iBalance >= 0) {
              // don't let the player accumulate credit (?)
              gMercProfiles[pTSoldier.ubProfile].iBalance = 0;

              // report the payment and set facts to indicate people not being owed money
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.GUY_HAS_BEEN_PAID_IN_FULL_STR], pTSoldier.name);
            } else {
              // report the payment
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.GUY_STILL_OWED_STR], pTSoldier.name, -gMercProfiles[pTSoldier.ubProfile].iBalance);
            }
          }
        }
      }
    } else {
      // Erase!
      if (bInvPos != NO_SLOT) {
        RemoveObjs(pSoldier.inv[bInvPos], TempObject.ubNumberOfObjects);
        DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
      }

      // Now intiate conv
      InitiateConversation(pTSoldier, pSoldier, Enum296.APPROACH_GIVINGITEM, TempObject);
    }
  }

  // OK, disengage buddy
  pSoldier.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
  pTSoldier.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
}

export function AdjustGridNoForItemPlacement(pSoldier: SOLDIERTYPE, sGridNo: INT16): INT16 {
  let pStructure: STRUCTURE | null;
  let sDesiredLevel: INT16;
  let sActionGridNo: INT16;
  let fStructFound: boolean = false;
  let ubDirection: UINT8;
  let sAdjustedGridNo: INT16;
  let ubTargetID: UINT8;

  sActionGridNo = sGridNo;

  // Check structure database
  if (gpWorldLevelData[sGridNo].pStructureHead) {
    // Something is here, check obstruction in future
    sDesiredLevel = pSoldier.bLevel ? STRUCTURE_ON_ROOF : STRUCTURE_ON_GROUND;
    pStructure = FindStructure(sGridNo, STRUCTURE_BLOCKSMOVES);
    while (pStructure) {
      if (!(pStructure.value.fFlags & STRUCTURE_PASSABLE) && pStructure.value.sCubeOffset == sDesiredLevel) {
        // Check for openable flag....
        // if ( pStructure->fFlags & ( STRUCTURE_OPENABLE | STRUCTURE_HASITEMONTOP ) )
        {
          fStructFound = true;
          break;
        }
      }
      pStructure = FindNextStructure(pStructure, STRUCTURE_BLOCKSMOVES);
    }
  }

  // ATE: IF a person is found, use adjacent gridno for it!
  ubTargetID = WhoIsThere2(sGridNo, pSoldier.bLevel);

  if (fStructFound || (ubTargetID != NOBODY && ubTargetID != pSoldier.ubID)) {
    // GET ADJACENT GRIDNO
    sActionGridNo = FindAdjacentGridEx(pSoldier, sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), false, false);

    if (sActionGridNo == -1) {
      sActionGridNo = sAdjustedGridNo;
    }
  }

  return sActionGridNo;
}

function StartBombMessageBox(pSoldier: SOLDIERTYPE, sGridNo: INT16): void {
  let ubRoom: UINT8;

  gpTempSoldier = pSoldier;
  gsTempGridno = sGridNo;
  if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.REMOTEBOMBTRIGGER) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_SMALL_BUTTONS, TacticalStr[Enum335.CHOOSE_BOMB_FREQUENCY_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS, BombMessageBoxCallBack, null);
  } else if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.REMOTETRIGGER) {
    // ATE ignore the commented-out code and add stuff to open the secret passage here
    /*
    switch( pSoldier->inv[HANDPOS].ubLocationID )
    {
            // check to make sure the appropriate sector is loaded
    }
    SetOffBombsByFrequency( pSoldier->ubID, pSoldier->inv[HANDPOS].bFrequency );
    */

    // PLay sound....
    PlayJA2Sample(Enum330.USE_STATUE_REMOTE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);

    // Check what sector we are in....
    if (gWorldSectorX == 3 && gWorldSectorY == MAP_ROW_O && gbWorldSectorZ == 0) {
      if ((ubRoom = InARoom(pSoldier.sGridNo)) !== -1 && ubRoom == 4) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);

        // Open statue
        ChangeO3SectorStatue(false);
      } else {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
      }
    } else {
      DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
    }
  } else if (FindAttachment(pSoldier.inv[Enum261.HANDPOS], Enum225.DETONATOR) != ITEM_NOT_FOUND) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_SMALL_BUTTONS, TacticalStr[Enum335.CHOOSE_TIMER_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS, BombMessageBoxCallBack, null);
  } else if (FindAttachment(pSoldier.inv[Enum261.HANDPOS], Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_SMALL_BUTTONS, TacticalStr[Enum335.CHOOSE_REMOTE_FREQUENCY_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS, BombMessageBoxCallBack, null);
  }
}

function BombMessageBoxCallBack(ubExitValue: UINT8): void {
  if (gpTempSoldier) {
    if (gpTempSoldier.inv[Enum261.HANDPOS].usItem == Enum225.REMOTEBOMBTRIGGER) {
      SetOffBombsByFrequency(gpTempSoldier.ubID, ubExitValue);
    } else {
      let iResult: INT32;

      if (FindAttachment(gpTempSoldier.inv[Enum261.HANDPOS], Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
        iResult = SkillCheck(gpTempSoldier, Enum255.PLANTING_REMOTE_BOMB_CHECK, 0);
      } else {
        iResult = SkillCheck(gpTempSoldier, Enum255.PLANTING_BOMB_CHECK, 0);
      }

      if (iResult >= 0) {
        // EXPLOSIVES GAIN (25):  Place a bomb, or buried and armed a mine
        StatChange(gpTempSoldier, EXPLODEAMT, 25, FROM_SUCCESS);
      } else {
        // EXPLOSIVES GAIN (10):  Failed to place a bomb, or bury and arm a mine
        StatChange(gpTempSoldier, EXPLODEAMT, 10, FROM_FAILURE);

        // oops!  How badly did we screw up?
        if (iResult >= -20) {
          // messed up the setting
          if (ubExitValue == 0) {
            ubExitValue = 1;
          } else {
            // change up/down by 1
            ubExitValue = (ubExitValue + Random(3) - 1);
          }
          // and continue
        } else {
          // OOPS! ... BOOM!
          IgniteExplosion(NOBODY, gpTempSoldier.sX, gpTempSoldier.sY, (gpWorldLevelData[gpTempSoldier.sGridNo].sHeight), gpTempSoldier.sGridNo, gpTempSoldier.inv[Enum261.HANDPOS].usItem, gpTempSoldier.bLevel);
          return;
        }
      }

      if (ArmBomb(gpTempSoldier.inv[Enum261.HANDPOS], ubExitValue)) {
        gpTempSoldier.inv[Enum261.HANDPOS].bTrap = Math.min(10, (EffectiveExplosive(gpTempSoldier) / 20) + (EffectiveExpLevel(gpTempSoldier) / 3));
        // HACK IMMINENT!
        // value of 1 is stored in maps for SIDE of bomb owner... when we want to use IDs!
        // so we add 2 to all owner IDs passed through here and subtract 2 later
        gpTempSoldier.inv[Enum261.HANDPOS].ubBombOwner = gpTempSoldier.ubID + 2;
        AddItemToPool(gsTempGridno, gpTempSoldier.inv[Enum261.HANDPOS], 1, gpTempSoldier.bLevel, WORLD_ITEM_ARMED_BOMB, 0);
        DeleteObj(gpTempSoldier.inv[Enum261.HANDPOS]);
      }
    }
  }
}

function HandItemWorks(pSoldier: SOLDIERTYPE, bSlot: INT8): boolean {
  let fItemJustBroke: boolean = false;
  let fItemWorks: boolean = true;
  let pObj: OBJECTTYPE;

  pObj = pSoldier.inv[bSlot];

  // if the item can be damaged, than we must check that it's in good enough
  // shape to be usable, and doesn't break during use.
  // Exception: land mines.  You can bury them broken, they just won't blow!
  if ((Item[pObj.usItem].fFlags & ITEM_DAMAGEABLE) && (pObj.usItem != Enum225.MINE) && (Item[pObj.usItem].usItemClass != IC_MEDKIT) && pObj.usItem != Enum225.GAS_CAN) {
    // if it's still usable, check whether it breaks
    if (pObj.bStatus[0] >= USABLE) {
      // if a dice roll is greater than the item's status
      if ((Random(80) + 20) >= (pObj.bStatus[0] + 50)) {
        fItemJustBroke = true;
        fItemWorks = false;

        // item breaks, and becomes unusable...  so its status is reduced
        // to somewhere between 1 and the 1 less than USABLE
        pObj.bStatus[0] = (1 + Random(USABLE - 1));
      }
    } else // it's already unusable
    {
      fItemWorks = false;
    }

    if (!fItemWorks && pSoldier.bTeam == gbPlayerNum) {
      // merc says "This thing doesn't work!"
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_USELESS_ITEM);
      if (fItemJustBroke) {
        DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
      }
    }
  }

  if (fItemWorks && bSlot == Enum261.HANDPOS && Item[pObj.usItem].usItemClass == IC_GUN) {
    // are we using two guns at once?
    if (Item[pSoldier.inv[Enum261.SECONDHANDPOS].usItem].usItemClass == IC_GUN && pSoldier.inv[Enum261.SECONDHANDPOS].bGunStatus >= USABLE && pSoldier.inv[Enum261.SECONDHANDPOS].ubGunShotsLeft > 0) {
      // check the second gun for breakage, and if IT breaks, return false
      return HandItemWorks(pSoldier, Enum261.SECONDHANDPOS);
    }
  }

  return fItemWorks;
}

function SetOffBoobyTrapInMapScreen(pSoldier: SOLDIERTYPE, pObject: OBJECTTYPE): void {
  let ubPtsDmg: UINT8 = 0;

  // check if trapped item is an explosive, if so then up the amount of dmg
  if ((pObject.usItem == Enum225.TNT) || (pObject.usItem == Enum225.RDX)) {
    // for explosive
    ubPtsDmg = 0;
  } else {
    // normal mini grenade dmg
    ubPtsDmg = 0;
  }

  // injure the inventory character
  SoldierTakeDamage(pSoldier, 0, ubPtsDmg, ubPtsDmg, TAKE_DAMAGE_EXPLOSION, NOBODY, NOWHERE, 0, true);

  // play the sound
  PlayJA2Sample(Enum330.EXPLOSION_1, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
}

function SetOffBoobyTrap(pItemPool: ITEM_POOL): void {
  if (pItemPool) {
    let sX: INT16;
    let sY: INT16;
    sX = CenterX(pItemPool.sGridNo);
    sY = CenterY(pItemPool.sGridNo);
    IgniteExplosion(NOBODY, sX, sY, (gpWorldLevelData[pItemPool.sGridNo].sHeight + pItemPool.bRenderZHeightAboveLevel), pItemPool.sGridNo, Enum225.MINI_GRENADE, 0);
    RemoveItemFromPool(pItemPool.sGridNo, pItemPool.iItemIndex, pItemPool.ubLevel);
  }
}

function ContinuePastBoobyTrap(pSoldier: SOLDIERTYPE, sGridNo: INT16, bLevel: INT8, iItemIndex: INT32, fInStrategic: boolean, pfSaidQuote: Pointer<boolean>): boolean {
  let fBoobyTrapKnowledge: boolean;
  let bTrapDifficulty: INT8;
  let bTrapDetectLevel: INT8;
  let pObj: OBJECTTYPE;

  pObj = gWorldItems[iItemIndex].o;

  (pfSaidQuote.value) = false;

  if (pObj.bTrap > 0) {
    if (pSoldier.bTeam == gbPlayerNum) {
      // does the player know about this item?
      fBoobyTrapKnowledge = ((pObj.fFlags & OBJECT_KNOWN_TO_BE_TRAPPED) > 0);

      // blue flag stuff?

      if (!fBoobyTrapKnowledge) {
        bTrapDifficulty = pObj.bTrap;
        bTrapDetectLevel = CalcTrapDetectLevel(pSoldier, false);
        if (bTrapDetectLevel >= bTrapDifficulty) {
          // spotted the trap!
          pObj.fFlags |= OBJECT_KNOWN_TO_BE_TRAPPED;
          fBoobyTrapKnowledge = true;

          // Make him warn us:

          // Set things up..
          gpBoobyTrapSoldier = pSoldier;
          gpBoobyTrapItemPool = GetItemPoolForIndex(sGridNo, iItemIndex, pSoldier.bLevel);
          gsBoobyTrapGridNo = sGridNo;
          gbBoobyTrapLevel = pSoldier.bLevel;
          gfDisarmingBuriedBomb = false;
          gbTrapDifficulty = bTrapDifficulty;

          // And make the call for the dialogue
          SetStopTimeQuoteCallback(BoobyTrapDialogueCallBack);
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BOOBYTRAP_ITEM);

          (pfSaidQuote.value) = true;

          return false;
        }
      }

      gpBoobyTrapItemPool = GetItemPoolForIndex(sGridNo, iItemIndex, pSoldier.bLevel);
      if (fBoobyTrapKnowledge) {
        // have the computer ask us if we want to proceed
        gpBoobyTrapSoldier = pSoldier;
        gsBoobyTrapGridNo = sGridNo;
        gbBoobyTrapLevel = pSoldier.bLevel;
        gfDisarmingBuriedBomb = false;
        gbTrapDifficulty = pObj.bTrap;

        if (fInStrategic) {
          DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.DISARM_BOOBYTRAP_PROMPT], Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, BoobyTrapInMapScreenMessageBoxCallBack, null);
        } else {
          DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.DISARM_BOOBYTRAP_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, BoobyTrapMessageBoxCallBack, null);
        }
      } else {
        // oops!
        SetOffBoobyTrap(gpBoobyTrapItemPool);
      }

      return false;
    }
    // else, enemies etc always know about boobytraps and are not affected by them
  }

  return true;
}

function BoobyTrapDialogueCallBack(): void {
  gfJustFoundBoobyTrap = true;

  // now prompt the user...
  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    DoScreenIndependantMessageBox(TacticalStr[Enum335.DISARM_BOOBYTRAP_PROMPT], MSG_BOX_FLAG_YESNO, BoobyTrapInMapScreenMessageBoxCallBack);
  } else {
    DoScreenIndependantMessageBox(TacticalStr[Enum335.DISARM_BOOBYTRAP_PROMPT], MSG_BOX_FLAG_YESNO, BoobyTrapMessageBoxCallBack);
  }
}

function BoobyTrapMessageBoxCallBack(ubExitValue: UINT8): void {
  if (gfJustFoundBoobyTrap) {
    // NOW award for finding boobytrap
    // WISDOM GAIN:  Detected a booby-trap
    StatChange(gpBoobyTrapSoldier, WISDOMAMT, (3 * gbTrapDifficulty), FROM_SUCCESS);
    // EXPLOSIVES GAIN:  Detected a booby-trap
    StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (3 * gbTrapDifficulty), FROM_SUCCESS);
    gfJustFoundBoobyTrap = false;
  }

  if (ubExitValue == MSG_BOX_RETURN_YES) {
    let iCheckResult: INT32;
    let Object: OBJECTTYPE = createObjectType();

    iCheckResult = SkillCheck(gpBoobyTrapSoldier, Enum255.DISARM_TRAP_CHECK, 0);

    if (iCheckResult >= 0) {
      // get the item
      copyObjectType(Object, gWorldItems[gpBoobyTrapItemPool.iItemIndex].o);

      // NB owner grossness... bombs 'owned' by the enemy are stored with side value 1 in
      // the map. So if we want to detect a bomb placed by the player, owner is > 1, and
      // owner - 2 gives the ID of the character who planted it
      if (Object.ubBombOwner > 1 && (Object.ubBombOwner - 2 >= gTacticalStatus.Team[OUR_TEAM].bFirstID && Object.ubBombOwner - 2 <= gTacticalStatus.Team[OUR_TEAM].bLastID)) {
        // our own bomb! no exp
      } else {
        // disarmed a boobytrap!
        StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (6 * gbTrapDifficulty), FROM_SUCCESS);
        // have merc say this is good
        DoMercBattleSound(gpBoobyTrapSoldier, Enum259.BATTLE_SOUND_COOL1);
      }

      if (gfDisarmingBuriedBomb) {
        if (Object.usItem == Enum225.SWITCH) {
          // give the player a remote trigger instead
          CreateItem(Enum225.REMOTEBOMBTRIGGER, (1 + Random(9)), Object);
        } else if (Object.usItem == Enum225.ACTION_ITEM && Object.bActionValue != Enum191.ACTION_ITEM_BLOW_UP) {
          // give the player a detonator instead
          CreateItem(Enum225.DETONATOR, (1 + Random(9)), Object);
        } else {
          // switch action item to the real item type
          CreateItem(Object.usBombItem, Object.bBombStatus, Object);
        }

        // remove any blue flag graphic
        RemoveBlueFlag(gsBoobyTrapGridNo, gbBoobyTrapLevel);
      } else {
        Object.bTrap = 0;
        Object.fFlags &= ~(OBJECT_KNOWN_TO_BE_TRAPPED);
      }

      // place it in the guy's inventory/cursor
      if (AutoPlaceObject(gpBoobyTrapSoldier, Object, true)) {
        // remove it from the ground
        RemoveItemFromPool(gsBoobyTrapGridNo, gpBoobyTrapItemPool.iItemIndex, gbBoobyTrapLevel);
      } else {
        // make sure the item in the world is untrapped
        gWorldItems[gpBoobyTrapItemPool.iItemIndex].o.bTrap = 0;
        gWorldItems[gpBoobyTrapItemPool.iItemIndex].o.fFlags &= ~(OBJECT_KNOWN_TO_BE_TRAPPED);

        // ATE; If we failed to add to inventory, put failed one in our cursor...
        gfDontChargeAPsToPickup = true;
        HandleAutoPlaceFail(gpBoobyTrapSoldier, gpBoobyTrapItemPool.iItemIndex, gsBoobyTrapGridNo);
        RemoveItemFromPool(gsBoobyTrapGridNo, gpBoobyTrapItemPool.iItemIndex, gbBoobyTrapLevel);
      }
    } else {
      // oops! trap goes off
      StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (3 * gbTrapDifficulty), FROM_FAILURE);

      DoMercBattleSound(gpBoobyTrapSoldier, Enum259.BATTLE_SOUND_CURSE1);

      if (gfDisarmingBuriedBomb) {
        SetOffBombsInGridNo(gpBoobyTrapSoldier.value.ubID, gsBoobyTrapGridNo, true, gbBoobyTrapLevel);
      } else {
        SetOffBoobyTrap(gpBoobyTrapItemPool);
      }
    }
  } else {
    if (gfDisarmingBuriedBomb) {
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.REMOVE_BLUE_FLAG_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, RemoveBlueFlagDialogueCallBack, null);
    }
    // otherwise do nothing
  }
}

function BoobyTrapInMapScreenMessageBoxCallBack(ubExitValue: UINT8): void {
  if (gfJustFoundBoobyTrap) {
    // NOW award for finding boobytrap

    // WISDOM GAIN:  Detected a booby-trap
    StatChange(gpBoobyTrapSoldier, WISDOMAMT, (3 * gbTrapDifficulty), FROM_SUCCESS);
    // EXPLOSIVES GAIN:  Detected a booby-trap
    StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (3 * gbTrapDifficulty), FROM_SUCCESS);
    gfJustFoundBoobyTrap = false;
  }

  if (ubExitValue == MSG_BOX_RETURN_YES) {
    let iCheckResult: INT32;
    let Object: OBJECTTYPE = createObjectType();

    iCheckResult = SkillCheck(gpBoobyTrapSoldier, Enum255.DISARM_TRAP_CHECK, 0);

    if (iCheckResult >= 0) {
      // disarmed a boobytrap!
      StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (6 * gbTrapDifficulty), FROM_SUCCESS);

      // have merc say this is good
      DoMercBattleSound(gpBoobyTrapSoldier, Enum259.BATTLE_SOUND_COOL1);

      // get the item
      copyObjectType(Object, gpItemPointer);

      if (gfDisarmingBuriedBomb) {
        if (Object.usItem == Enum225.SWITCH) {
          // give the player a remote trigger instead
          CreateItem(Enum225.REMOTEBOMBTRIGGER, (1 + Random(9)), Object);
        } else if (Object.usItem == Enum225.ACTION_ITEM && Object.bActionValue != Enum191.ACTION_ITEM_BLOW_UP) {
          // give the player a detonator instead
          CreateItem(Enum225.DETONATOR, (1 + Random(9)), Object);
        } else {
          // switch action item to the real item type
          CreateItem(Object.usBombItem, Object.bBombStatus, Object);
        }
      } else {
        Object.bTrap = 0;
        Object.fFlags &= ~(OBJECT_KNOWN_TO_BE_TRAPPED);
      }

      MAPEndItemPointer();

      // place it in the guy's inventory/cursor
      if (!AutoPlaceObject(gpBoobyTrapSoldier, Object, true)) {
        AutoPlaceObjectInInventoryStash(Object);
      }

      HandleButtonStatesWhileMapInventoryActive();
    } else {
      // oops! trap goes off
      StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (3 * gbTrapDifficulty), FROM_FAILURE);

      DoMercBattleSound(gpBoobyTrapSoldier, Enum259.BATTLE_SOUND_CURSE1);

      if (gfDisarmingBuriedBomb) {
        SetOffBombsInGridNo(gpBoobyTrapSoldier.value.ubID, gsBoobyTrapGridNo, true, gbBoobyTrapLevel);
      } else {
        SetOffBoobyTrap(gpBoobyTrapItemPool);
      }
    }
  } else {
    if (gfDisarmingBuriedBomb) {
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.REMOVE_BLUE_FLAG_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, RemoveBlueFlagDialogueCallBack, null);
    }
    // otherwise do nothing
  }
}

function SwitchMessageBoxCallBack(ubExitValue: UINT8): void {
  if (ubExitValue == MSG_BOX_RETURN_YES) {
    // Message that switch is activated...
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[60]);

    SetOffBombsByFrequency(gpTempSoldier.value.ubID, bTempFrequency);
  }
}

export function NearbyGroundSeemsWrong(pSoldier: SOLDIERTYPE, sGridNo: INT16, fCheckAroundGridno: boolean, psProblemGridNo: Pointer<INT16>): boolean {
  let sNextGridNo: INT16;
  // BOOLEAN fWorthChecking = FALSE, fProblemExists = FALSE, fDetectedProblem = FALSE;
  let ubDetectLevel: UINT8;
  let ubDirection: UINT8;
  let pMapElement: MAP_ELEMENT;
  let fCheckFlag: UINT32;
  let uiWorldBombIndex: UINT32;
  let pObj: OBJECTTYPE;
  let fMining: boolean;
  let fFoundMetal: boolean = false;
  //	ITEM_POOL *			pItemPool;
  let ubMovementCost: UINT8;

  ubDetectLevel = 0;

  if (FindObj(pSoldier, Enum225.METALDETECTOR) != NO_SLOT) {
    fMining = true;
  } else {
    fMining = false;

    ubDetectLevel = CalcTrapDetectLevel(pSoldier, false);
    /*
    if (pSoldier->bStealthMode)
    {
            ubDetectLevel++;
    }
    switch (pSoldier->usAnimState)
    {
            case CRAWLING:
                    ubDetectLevel += 2;
                    break;

            case SWATTING:
                    ubDetectLevel++;
                    break;

            default:
                    break;
    }
    */
  }

  if (pSoldier.bSide == 0) {
    fCheckFlag = MAPELEMENT_PLAYER_MINE_PRESENT;
  } else {
    fCheckFlag = MAPELEMENT_ENEMY_MINE_PRESENT;
  }

  // check every tile around gridno for the presence of "nasty stuff"
  for (ubDirection = 0; ubDirection < 8; ubDirection++) {
    if (fCheckAroundGridno) {
      // get the gridno of the next spot adjacent to lastGridno in that direction
      sNextGridNo = NewGridNo(sGridNo, DirectionInc(ubDirection));

      // don't check directions that are impassable!
      ubMovementCost = gubWorldMovementCosts[sNextGridNo][ubDirection][pSoldier.bLevel];
      if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
        ubMovementCost = DoorTravelCost(null, sNextGridNo, ubMovementCost, false, null);
      }
      if (ubMovementCost >= TRAVELCOST_BLOCKED) {
        continue;
      }
    } else {
      // we should just be checking the gridno
      sNextGridNo = sGridNo;
      ubDirection = 8; // don't loop
    }

    // if this sNextGridNo isn't out of bounds... but it never can be
    pMapElement = gpWorldLevelData[sNextGridNo];

    if (pMapElement.uiFlags & fCheckFlag) {
      // already know there's a mine there
      continue;
    }

    // check for boobytraps
    for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
      if (gWorldBombs[uiWorldBombIndex].fExists && gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].sGridNo == sNextGridNo) {
        pObj = gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o;
        if (pObj.bDetonatorType == Enum224.BOMB_PRESSURE && !(pObj.fFlags & OBJECT_KNOWN_TO_BE_TRAPPED) && (!(pObj.fFlags & OBJECT_DISABLED_BOMB))) {
          if (fMining && pObj.bTrap <= 10) {
            // add blue flag
            AddBlueFlag(sNextGridNo, pSoldier.bLevel);
            fFoundMetal = true;
            break;
          } else if (ubDetectLevel >= pObj.bTrap) {
            if (pSoldier.uiStatusFlags & SOLDIER_PC) {
              // detected exposives buried nearby...
              StatChange(pSoldier, EXPLODEAMT, (pObj.bTrap), FROM_SUCCESS);

              // set item as known
              pObj.fFlags |= OBJECT_KNOWN_TO_BE_TRAPPED;
            }

            psProblemGridNo.value = sNextGridNo;
            return true;
          }
        }
      }
    }

    /*
    // also check for metal items if using a metal detector
    if (fMining)
    {
            // add blue flags where we find metallic objects hidden
            GetItemPool( sNextGridNo, &pItemPool, pSoldier->bLevel );
            while( pItemPool )
            {
                    if ( pItemPool->bVisible == BURIED || (pItemPool->bVisible != TRUE && gWorldItems[ pItemPool->iItemIndex ].o.bTrap > 0 ) )
                    {
                            pObj = &( gWorldItems[ pItemPool->iItemIndex ].o );
                            if ( pObj->usItem == ACTION_ITEM && pObj-> )
                            {
                                    switch( pObj->bActionValue )
                                    {
                                            case ACTION_ITEM_BLOW_UP:
                                            case ACTION_ITEM_LOCAL_ALARM:
                                            case ACTION_ITEM_GLOBAL_ALARM:
                                                    // add blue flag
                                                    AddBlueFlag( sNextGridNo, pSoldier->bLevel );
                                                    fFoundMetal = TRUE;
                                                    break;
                                            default:
                                                    break;

                                    }
                            }
                            else if (Item[ pObj->usItem ].fFlags & ITEM_METAL)
                            {
                                    // add blue flag
                                    AddBlueFlag( sNextGridNo, pSoldier->bLevel );
                                    fFoundMetal = TRUE;
                                    break;
                            }
                    }
                    pItemPool = pItemPool->pNext;
            }
    }
    */
  }

  psProblemGridNo.value = NOWHERE;
  if (fFoundMetal) {
    return true;
  } else {
    return false;
  }
}

export function MineSpottedDialogueCallBack(): void {
  let pItemPool: ITEM_POOL | null;

  // ATE: REALLY IMPORTANT - ALL CALLBACK ITEMS SHOULD UNLOCK
  gTacticalStatus.fLockItemLocators = false;

  pItemPool = GetItemPool(gsBoobyTrapGridNo, gbBoobyTrapLevel);

  guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;

  // play a locator at the location of the mine
  SetItemPoolLocatorWithCallback(pItemPool, MineSpottedLocatorCallback);
}

function MineSpottedLocatorCallback(): void {
  guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;

  // now ask the player if he wants to place a blue flag.
  DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.PLACE_BLUE_FLAG_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, MineSpottedMessageBoxCallBack, null);
}

function MineSpottedMessageBoxCallBack(ubExitValue: UINT8): void {
  if (ubExitValue == MSG_BOX_RETURN_YES) {
    // place a blue flag where the mine was found
    AddBlueFlag(gsBoobyTrapGridNo, gbBoobyTrapLevel);
  }
}

function RemoveBlueFlagDialogueCallBack(ubExitValue: UINT8): void {
  if (ubExitValue == MSG_BOX_RETURN_YES) {
    RemoveBlueFlag(gsBoobyTrapGridNo, gbBoobyTrapLevel);
  }
}

function AddBlueFlag(sGridNo: INT16, bLevel: INT8): void {
  let pNode: LEVELNODE | null;

  ApplyMapChangesToMapTempFile(true);
  gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_PLAYER_MINE_PRESENT;

  pNode = AddStructToTail(sGridNo, BLUEFLAG_GRAPHIC);

  if (pNode) {
    pNode.uiFlags |= LEVELNODE_SHOW_THROUGH;
  }

  ApplyMapChangesToMapTempFile(false);
  RecompileLocalMovementCostsFromRadius(sGridNo, bLevel);
  SetRenderFlags(RENDER_FLAG_FULL);
}

export function RemoveBlueFlag(sGridNo: INT16, bLevel: INT8): void {
  ApplyMapChangesToMapTempFile(true);
  gpWorldLevelData[sGridNo].uiFlags &= ~(MAPELEMENT_PLAYER_MINE_PRESENT);

  if (bLevel == 0) {
    RemoveStruct(sGridNo, BLUEFLAG_GRAPHIC);
  } else {
    RemoveOnRoof(sGridNo, BLUEFLAG_GRAPHIC);
  }

  ApplyMapChangesToMapTempFile(false);
  RecompileLocalMovementCostsFromRadius(sGridNo, bLevel);
  SetRenderFlags(RENDER_FLAG_FULL);
}

export function MakeNPCGrumpyForMinorOffense(pSoldier: SOLDIERTYPE, pOffendingSoldier: SOLDIERTYPE | null): void {
  CancelAIAction(pSoldier, true);

  switch (pSoldier.ubProfile) {
    case Enum268.FREDO:
    case Enum268.FRANZ:
    case Enum268.HERVE:
    case Enum268.PETER:
    case Enum268.ALBERTO:
    case Enum268.CARLO:
    case Enum268.MANNY:
    case Enum268.GABBY:
    case Enum268.ARNIE:
    case Enum268.HOWARD:
    case Enum268.SAM:
    case Enum268.FATHER:
    case Enum268.TINA:
    case Enum268.ARMAND:
    case Enum268.WALTER:
      gMercProfiles[pSoldier.ubProfile].ubMiscFlags3 |= PROFILE_MISC_FLAG3_NPC_PISSED_OFF;
      TriggerNPCWithIHateYouQuote(pSoldier.ubProfile);
      break;
    default:
      // trigger NPCs with quote if available
      AddToShouldBecomeHostileOrSayQuoteList(pSoldier.ubID);
      break;
  }

  if (pOffendingSoldier) {
    pSoldier.bNextAction = Enum289.AI_ACTION_CHANGE_FACING;
    pSoldier.usNextActionData = atan8(pSoldier.sX, pSoldier.sY, pOffendingSoldier.sX, pOffendingSoldier.sY);
  }
}

function TestPotentialOwner(pSoldier: SOLDIERTYPE): void {
  if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE) {
    if (SoldierToSoldierLineOfSightTest(pSoldier, gpTempSoldier, DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, 0, gpTempSoldier.sGridNo, gpTempSoldier.bLevel), true)) {
      MakeNPCGrumpyForMinorOffense(pSoldier, gpTempSoldier);
    }
  }
}

function CheckForPickedOwnership(): void {
  let pItemPool: ITEM_POOL | null;
  let ubProfile: UINT8;
  let ubCivGroup: UINT8;
  let pSoldier: SOLDIERTYPE | null;
  let ubLoop: UINT8;

  // LOOP THROUGH LIST TO FIND NODE WE WANT
  pItemPool = GetItemPool(gsTempGridno, gpTempSoldier.bLevel);

  while (pItemPool) {
    if (gWorldItems[pItemPool.iItemIndex].o.usItem == Enum225.OWNERSHIP) {
      if (gWorldItems[pItemPool.iItemIndex].o.ubOwnerProfile != NO_PROFILE) {
        ubProfile = gWorldItems[pItemPool.iItemIndex].o.ubOwnerProfile;
        pSoldier = FindSoldierByProfileID(ubProfile, false);
        if (pSoldier) {
          TestPotentialOwner(pSoldier);
        }
      }
      if (gWorldItems[pItemPool.iItemIndex].o.ubOwnerCivGroup != Enum246.NON_CIV_GROUP) {
        ubCivGroup = gWorldItems[pItemPool.iItemIndex].o.ubOwnerCivGroup;
        if (ubCivGroup == Enum246.HICKS_CIV_GROUP && CheckFact(Enum170.FACT_HICKS_MARRIED_PLAYER_MERC, 0)) {
          // skip because hicks appeased
          pItemPool = pItemPool.pNext;
          continue;
        }
        for (ubLoop = gTacticalStatus.Team[CIV_TEAM].bFirstID; ubLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; ubLoop++) {
          pSoldier = MercPtrs[ubLoop];
          if (pSoldier && pSoldier.ubCivilianGroup == ubCivGroup) {
            TestPotentialOwner(pSoldier);
          }
        }
      }
    }
    pItemPool = pItemPool.pNext;
  }
}

function LoopLevelNodeForItemGlowFlag(pNode: LEVELNODE | null, sGridNo: INT16, ubLevel: UINT8, fOn: boolean): void {
  while (pNode != null) {
    if (pNode.uiFlags & LEVELNODE_ITEM) {
      if (fOn) {
        pNode.uiFlags |= LEVELNODE_DYNAMIC;
      } else {
        pNode.uiFlags &= (~LEVELNODE_DYNAMIC);
      }
    }
    pNode = pNode.pNext;
  }
}

function HandleItemGlowFlag(sGridNo: INT16, ubLevel: UINT8, fOn: boolean): void {
  let pNode: LEVELNODE | null;

  if (ubLevel == 0) {
    pNode = gpWorldLevelData[sGridNo].pStructHead;
    LoopLevelNodeForItemGlowFlag(pNode, sGridNo, ubLevel, fOn);
  } else {
    pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
    LoopLevelNodeForItemGlowFlag(pNode, sGridNo, ubLevel, fOn);
  }
}

export function ToggleItemGlow(fOn: boolean): void {
  let cnt: UINT32;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    HandleItemGlowFlag(cnt, 0, fOn);
    HandleItemGlowFlag(cnt, 1, fOn);
  }

  if (!fOn) {
    gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = false;
  } else {
    gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = true;
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

export function ContinuePastBoobyTrapInMapScreen(pObject: OBJECTTYPE, pSoldier: SOLDIERTYPE): boolean {
  let fBoobyTrapKnowledge: boolean;
  let bTrapDifficulty: INT8;
  let bTrapDetectLevel: INT8;

  if (pObject.bTrap > 0) {
    if (pSoldier.bTeam == gbPlayerNum) {
      // does the player know about this item?
      fBoobyTrapKnowledge = ((pObject.fFlags & OBJECT_KNOWN_TO_BE_TRAPPED) > 0);

      // blue flag stuff?

      if (!fBoobyTrapKnowledge) {
        bTrapDifficulty = pObject.bTrap;
        bTrapDetectLevel = CalcTrapDetectLevel(pSoldier, false);
        if (bTrapDetectLevel >= bTrapDifficulty) {
          // spotted the trap!
          pObject.fFlags |= OBJECT_KNOWN_TO_BE_TRAPPED;
          fBoobyTrapKnowledge = true;

          // Make him warn us:
          gpBoobyTrapSoldier = pSoldier;

          // And make the call for the dialogue
          SetStopTimeQuoteCallback(BoobyTrapDialogueCallBack);
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BOOBYTRAP_ITEM);

          return false;
        }
      }

      if (fBoobyTrapKnowledge) {
        // have the computer ask us if we want to proceed
        gpBoobyTrapSoldier = pSoldier;
        gbTrapDifficulty = pObject.bTrap;
        DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.DISARM_BOOBYTRAP_PROMPT], Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, BoobyTrapInMapScreenMessageBoxCallBack, null);
      } else {
        // oops!
        SetOffBoobyTrapInMapScreen(pSoldier, pObject);
      }

      return false;
    }
    // else, enemies etc always know about boobytraps and are not affected by them
  }

  return true;
}

// Well, clears all item pools
function ClearAllItemPools(): void {
  let cnt: UINT32;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    RemoveItemPool(cnt, 0);
    RemoveItemPool(cnt, 1);
  }
}

// Refresh item pools
export function RefreshItemPools(pItemList: WORLDITEM[], iNumberOfItems: INT32): void {
  ClearAllItemPools();

  RefreshWorldItemsIntoItemPools(pItemList, iNumberOfItems);
}

export function FindNearestAvailableGridNoForItem(sSweetGridNo: INT16, ubRadius: INT8): INT16 {
  let sTop: INT16;
  let sBottom: INT16;
  let sLeft: INT16;
  let sRight: INT16;
  let cnt1: INT16;
  let cnt2: INT16;
  let cnt3: INT16;
  let sGridNo: INT16;
  let uiRange: INT32;
  let uiLowestRange: INT32 = 999999;
  let sLowestGridNo: INT16 = 0;
  let leftmost: INT32;
  let fFound: boolean = false;
  let soldier: SOLDIERTYPE = createSoldierType();
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let fSetDirection: boolean = false;

  cnt3 = 0;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  soldier.bTeam = 1;
  soldier.sGridNo = sSweetGridNo;

  sTop = ubRadius;
  sBottom = -ubRadius;
  sLeft = -ubRadius;
  sRight = ubRadius;

  // clear the mapelements of potential residue MAPELEMENT_REACHABLE flags
  // in the square region.
  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX) {
        gpWorldLevelData[sGridNo].uiFlags &= (~MAPELEMENT_REACHABLE);
      }
    }
  }

  // Now, find out which of these gridnos are reachable
  //(use the fake soldier and the pathing settings)
  FindBestPath(soldier, NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, 0);

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(soldier, sGridNo, true, soldier.bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            sLowestGridNo = sGridNo;
            uiLowestRange = uiRange;
            fFound = true;
          }
        }
      }
    }
  }
  gubNPCAPBudget = ubSaveNPCAPBudget;
  gubNPCDistLimit = ubSaveNPCDistLimit;
  if (fFound) {
    return sLowestGridNo;
  }
  return NOWHERE;
}

export function CanPlayerUseRocketRifle(pSoldier: SOLDIERTYPE, fDisplay: boolean): boolean {
  if (pSoldier.inv[pSoldier.ubAttackingHand].usItem == Enum225.ROCKET_RIFLE || pSoldier.inv[pSoldier.ubAttackingHand].usItem == Enum225.AUTO_ROCKET_RIFLE) {
    // check imprint ID
    // NB not-imprinted value is NO_PROFILE
    // imprinted value is profile for mercs & NPCs and NO_PROFILE + 1 for generic dudes
    if (pSoldier.ubProfile != NO_PROFILE) {
      if (pSoldier.inv[pSoldier.ubAttackingHand].ubImprintID != pSoldier.ubProfile) {
        // NOT a virgin gun...
        if (pSoldier.inv[pSoldier.ubAttackingHand].ubImprintID != NO_PROFILE) {
          // access denied!
          if (pSoldier.bTeam == gbPlayerNum) {
            PlayJA2Sample(Enum330.RG_ID_INVALID, RATE_11025, HIGHVOLUME, 1, MIDDLE);

            if (fDisplay) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, "\"%s\"", TacticalStr[Enum335.GUN_NOGOOD_FINGERPRINT]);
            }
          }
          return false;
        }
      }
    }
  }
  return true;
}

}
