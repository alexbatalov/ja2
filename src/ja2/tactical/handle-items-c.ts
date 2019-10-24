const NUM_ITEMS_LISTED = 8;
const NUM_ITEM_FLASH_SLOTS = 50;
const MIN_LOB_RANGE = 6;

let FlashItemSlots: ITEM_POOL_LOCATOR[] /* [NUM_ITEM_FLASH_SLOTS] */;
let guiNumFlashItemSlots: UINT32 = 0;

// Disgusting hacks: have to keep track of these values for accesses in callbacks
/* static */ let gpTempSoldier: Pointer<SOLDIERTYPE>;
/* static */ let gsTempGridno: INT16;
/* static */ let bTempFrequency: INT8;

let gpBoobyTrapSoldier: Pointer<SOLDIERTYPE>;
let gpBoobyTrapItemPool: Pointer<ITEM_POOL>;
let gsBoobyTrapGridNo: INT16;
let gbBoobyTrapLevel: INT8;
let gfDisarmingBuriedBomb: BOOLEAN;
let gbTrapDifficulty: INT8;
let gfJustFoundBoobyTrap: BOOLEAN = FALSE;

function HandleCheckForBadChangeToGetThrough(pSoldier: Pointer<SOLDIERTYPE>, pTargetSoldier: Pointer<SOLDIERTYPE>, sTargetGridNo: INT16, bLevel: INT8): BOOLEAN {
  let fBadChangeToGetThrough: BOOLEAN = FALSE;

  if (pTargetSoldier != NULL) {
    if (SoldierToSoldierBodyPartChanceToGetThrough(pSoldier, pTargetSoldier, pSoldier.value.bAimShotLocation) < OK_CHANCE_TO_GET_THROUGH) {
      fBadChangeToGetThrough = TRUE;
    }
  } else {
    if (SoldierToLocationChanceToGetThrough(pSoldier, sTargetGridNo, bLevel, 0, NOBODY) < OK_CHANCE_TO_GET_THROUGH) {
      fBadChangeToGetThrough = TRUE;
    }
  }

  if (fBadChangeToGetThrough) {
    if (gTacticalStatus.sCantGetThroughSoldierGridNo != pSoldier.value.sGridNo || gTacticalStatus.sCantGetThroughGridNo != sTargetGridNo || gTacticalStatus.ubCantGetThroughID != pSoldier.value.ubID) {
      gTacticalStatus.fCantGetThrough = FALSE;
    }

    // Have we done this once already?
    if (!gTacticalStatus.fCantGetThrough) {
      gTacticalStatus.fCantGetThrough = TRUE;
      gTacticalStatus.sCantGetThroughGridNo = sTargetGridNo;
      gTacticalStatus.ubCantGetThroughID = pSoldier.value.ubID;
      gTacticalStatus.sCantGetThroughSoldierGridNo = pSoldier.value.sGridNo;

      // PLay quote
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_NO_LINE_OF_FIRE);
      return FALSE;
    } else {
      // Is this a different case?
      if (gTacticalStatus.sCantGetThroughGridNo != sTargetGridNo || gTacticalStatus.ubCantGetThroughID != pSoldier.value.ubID || gTacticalStatus.sCantGetThroughSoldierGridNo != pSoldier.value.sGridNo) {
        // PLay quote
        gTacticalStatus.sCantGetThroughGridNo = sTargetGridNo;
        gTacticalStatus.ubCantGetThroughID = pSoldier.value.ubID;

        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_NO_LINE_OF_FIRE);
        return FALSE;
      }
    }
  } else {
    gTacticalStatus.fCantGetThrough = FALSE;
  }

  return TRUE;
}

function HandleItem(pSoldier: Pointer<SOLDIERTYPE>, usGridNo: UINT16, bLevel: INT8, usHandItem: UINT16, fFromUI: BOOLEAN): INT32 {
  let pTargetSoldier: Pointer<SOLDIERTYPE> = NULL;
  let usSoldierIndex: UINT16;
  let sTargetGridNo: INT16;
  let sAPCost: INT16;
  let sActionGridNo: INT16;
  let ubDirection: UINT8;
  let sAdjustedGridNo: INT16;
  let fDropBomb: BOOLEAN = FALSE;
  let fAddingTurningCost: BOOLEAN = FALSE;
  let fAddingRaiseGunCost: BOOLEAN = FALSE;
  let pIntNode: Pointer<LEVELNODE>;
  let pStructure: Pointer<STRUCTURE>;
  let sGridNo: INT16;

  // Remove any previous actions
  pSoldier.value.ubPendingAction = NO_PENDING_ACTION;

  // here is where we would set a different value if the weapon mode is on
  // "attached weapon"
  pSoldier.value.usAttackingWeapon = usHandItem;

  // Find soldier flags depend on if it's our own merc firing or a NPC
  // if ( FindSoldier( usGridNo, &usSoldierIndex, &uiMercFlags, FIND_SOLDIER_GRIDNO )  )
  if ((usSoldierIndex = WhoIsThere2(usGridNo, bLevel)) != NO_SOLDIER) {
    pTargetSoldier = MercPtrs[usSoldierIndex];

    if (fFromUI) {
      // ATE: Check if we are targeting an interactive tile, and adjust gridno accordingly...
      pIntNode = GetCurInteractiveTileGridNoAndStructure(addressof(sGridNo), addressof(pStructure));

      if (pIntNode != NULL && pTargetSoldier == pSoldier) {
        // Truncate target sioldier
        pTargetSoldier = NULL;
      }
    }
  }

  // ATE: If in realtime, set attacker count to 0...
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Setting attack busy count to 0 due to no combat"));
    gTacticalStatus.ubAttackBusyCount = 0;
  }

  if (pTargetSoldier) {
    pTargetSoldier.value.bBeingAttackedCount = 0;
  }

  // Check our soldier's life for unconscious!
  if (pSoldier.value.bLife < OKLIFE) {
    return ITEM_HANDLE_UNCONSCIOUS;
  }

  if (HandItemWorks(pSoldier, Enum261.HANDPOS) == FALSE) {
    return ITEM_HANDLE_BROKEN;
  }

  if (fFromUI && pSoldier.value.bTeam == gbPlayerNum && pTargetSoldier && (pTargetSoldier.value.bTeam == gbPlayerNum || pTargetSoldier.value.bNeutral) && pTargetSoldier.value.ubBodyType != Enum194.CROW && Item[usHandItem].usItemClass != IC_MEDKIT) {
    if (pSoldier.value.ubProfile != NO_PROFILE) {
      // nice mercs won't shoot other nice guys or neutral civilians
      if ((gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_GOODGUY) && ((pTargetSoldier.value.ubProfile == NO_PROFILE && pTargetSoldier.value.bNeutral) || gMercProfiles[pTargetSoldier.value.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_GOODGUY)) {
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_REFUSING_ORDER);
        return ITEM_HANDLE_REFUSAL;
      }
      if (pTargetSoldier.value.ubProfile != NO_PROFILE) {
        // buddies won't shoot each other
        if (WhichBuddy(pSoldier.value.ubProfile, pTargetSoldier.value.ubProfile) != -1) {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_REFUSING_ORDER);
          return ITEM_HANDLE_REFUSAL;
        }
      }

      // any recruited rebel will refuse to fire on another rebel or neutral nameless civ
      if (pSoldier.value.ubCivilianGroup == Enum246.REBEL_CIV_GROUP && (pTargetSoldier.value.ubCivilianGroup == Enum246.REBEL_CIV_GROUP || (pTargetSoldier.value.bNeutral && pTargetSoldier.value.ubProfile == NO_PROFILE && pTargetSoldier.value.ubCivilianGroup == Enum246.NON_CIV_GROUP && pTargetSoldier.value.ubBodyType != Enum194.CROW))) {
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
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubImprintID != pSoldier.value.ubProfile) {
          if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubImprintID == NO_PROFILE) {
            // first shot using "virgin" gun... set imprint ID
            pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubImprintID = pSoldier.value.ubProfile;

            // this could be an NPC (Krott)
            if (pSoldier.value.bTeam == gbPlayerNum) {
              PlayJA2Sample(Enum330.RG_ID_IMPRINTED, RATE_11025, HIGHVOLUME, 1, MIDDLE);

              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, "\"%s\"", TacticalStr[Enum335.GUN_GOT_FINGERPRINT]);

              return ITEM_HANDLE_BROKEN;
            }
          } else {
            // access denied!
            if (pSoldier.value.bTeam == gbPlayerNum) {
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
        if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubImprintID != (NO_PROFILE + 1)) {
          if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubImprintID == NO_PROFILE) {
            pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubImprintID = (NO_PROFILE + 1);
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
        pSoldier.value.fDoSpread = FALSE;
        return ITEM_HANDLE_NOAMMO;
      }

      // Check if we are reloading
      if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
        if (pSoldier.value.fReloading) {
          return ITEM_HANDLE_RELOADING;
        }
      }
    }

    // Get gridno - either soldier's position or the gridno
    if (pTargetSoldier != NULL) {
      sTargetGridNo = pTargetSoldier.value.sGridNo;
    } else {
      sTargetGridNo = usGridNo;
    }

    // If it's a player guy, check ChanceToGetThrough to play quote
    if (fFromUI && (gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) {
      // Don't do if no spread!
      if (!pSoldier.value.fDoSpread) {
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
    sAPCost = CalcTotalAPsToAttack(pSoldier, sTargetGridNo, TRUE, pSoldier.value.bAimTime);

    GetAPChargeForShootOrStabWRTGunRaises(pSoldier, sTargetGridNo, TRUE, addressof(fAddingTurningCost), addressof(fAddingRaiseGunCost));

    // If we are standing and are asked to turn AND raise gun, ignore raise gun...
    if (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND) {
      if (fAddingRaiseGunCost) {
        pSoldier.value.fDontChargeTurningAPs = TRUE;
      }
    } else {
      // If raising gun, don't charge turning!
      if (fAddingTurningCost) {
        pSoldier.value.fDontChargeReadyAPs = TRUE;
      }
    }

    // If this is a player guy, show message about no APS
    if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
      if ((pSoldier.value.ubProfile != NO_PROFILE) && (gMercProfiles[pSoldier.value.ubProfile].bPersonalityTrait == Enum270.PSYCHO)) {
        // psychos might possibly switch to burst if they can
        if (!pSoldier.value.bDoBurst && IsGunBurstCapable(pSoldier, Enum261.HANDPOS, FALSE)) {
          // chance of firing burst if we have points... chance decreasing when ordered to do aimed shot

          // temporarily set burst to true to calculate action points
          pSoldier.value.bDoBurst = TRUE;
          sAPCost = CalcTotalAPsToAttack(pSoldier, sTargetGridNo, TRUE, 0);
          // reset burst mode to false (which is what it was at originally)
          pSoldier.value.bDoBurst = FALSE;

          if (EnoughPoints(pSoldier, sAPCost, 0, FALSE)) {
            // we have enough points to do this burst, roll the dice and see if we want to change
            if (Random(3 + pSoldier.value.bAimTime) == 0) {
              DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_LAUGH1);
              pSoldier.value.bDoBurst = TRUE;
              pSoldier.value.bWeaponMode = Enum265.WM_BURST;

              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[26], pSoldier.value.name);
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
        pSoldier.value.bTargetLevel = gsInterfaceLevel;
      }

      if (Item[usHandItem].usItemClass != IC_THROWING_KNIFE) {
        // If doing spread, set down the first gridno.....
        if (pSoldier.value.fDoSpread) {
          if (pSoldier.value.sSpreadLocations[0] != 0) {
            SendBeginFireWeaponEvent(pSoldier, pSoldier.value.sSpreadLocations[0]);
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
          pSoldier.value.bShownAimTime = REFINE_AIM_1;

          // Locate to soldier if he's about to shoot!
          if (pSoldier.value.bTeam != gbPlayerNum) {
            ShowRadioLocator(pSoldier.value.ubID, SHOW_LOCATOR_NORMAL);
          }
        }
      }

      // OK, set UI
      SetUIBusy(pSoldier.value.ubID);
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
    let fGotAdjacent: BOOLEAN = FALSE;

    for (sCnt = 0; sCnt < Enum245.NUM_WORLD_DIRECTIONS; sCnt++) {
      sSpot = NewGridNo(pSoldier.value.sGridNo, DirectionInc(sCnt));

      // Make sure movement costs are OK....
      if (gubWorldMovementCosts[sSpot][sCnt][bLevel] >= TRAVELCOST_BLOCKED) {
        continue;
      }

      // Check for who is there...
      ubGuyThere = WhoIsThere2(sSpot, pSoldier.value.bLevel);

      if (pTargetSoldier != NULL && ubGuyThere == pTargetSoldier.value.ubID) {
        // We've got a guy here....
        // Who is the one we want......
        sGotLocation = sSpot;
        sAdjustedGridNo = pTargetSoldier.value.sGridNo;
        ubDirection = sCnt;
        break;
      }
    }

    if (sGotLocation == NOWHERE) {
      // See if we can get there to punch
      sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
      if (sActionGridNo != -1) {
        // OK, we've got somebody...
        sGotLocation = sActionGridNo;

        fGotAdjacent = TRUE;
      }
    }

    // Did we get a loaction?
    if (sGotLocation != NOWHERE) {
      pSoldier.value.sTargetGridNo = usGridNo;

      pSoldier.value.usActionData = usGridNo;
      // CHECK IF WE ARE AT THIS GRIDNO NOW
      if (pSoldier.value.sGridNo != sGotLocation && fGotAdjacent) {
        // SEND PENDING ACTION
        pSoldier.value.ubPendingAction = Enum257.MERC_PUNCH;
        pSoldier.value.sPendingActionData2 = sAdjustedGridNo;
        pSoldier.value.bPendingActionData3 = ubDirection;
        pSoldier.value.ubPendingActionAnimCount = 0;

        // WALK UP TO DEST FIRST
        EVENT_InternalGetNewSoldierPath(pSoldier, sGotLocation, pSoldier.value.usUIMovementMode, FALSE, TRUE);
      } else {
        pSoldier.value.bAction = Enum289.AI_ACTION_KNIFE_STAB;
        EVENT_SoldierBeginPunchAttack(pSoldier, sAdjustedGridNo, ubDirection);
      }

      // OK, set UI
      SetUIBusy(pSoldier.value.ubID);

      gfResetUIMovementOptimization = TRUE;

      return ITEM_HANDLE_OK;
    } else {
      return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
    }
  }

  // USING THE MEDKIT
  if (Item[usHandItem].usItemClass == IC_MEDKIT) {
    // ATE: AI CANNOT GO THROUGH HERE!
    let usMapPos: UINT16;
    let fHadToUseCursorPos: BOOLEAN = FALSE;

    if (gTacticalStatus.fAutoBandageMode) {
      usMapPos = usGridNo;
    } else {
      GetMouseMapPos(addressof(usMapPos));
    }

    // See if we can get there to stab
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
    if (sActionGridNo == -1) {
      // Try another location...
      sActionGridNo = FindAdjacentGridEx(pSoldier, usMapPos, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);

      if (sActionGridNo == -1) {
        return ITEM_HANDLE_CANNOT_GETTO_LOCATION;
      }

      if (!gTacticalStatus.fAutoBandageMode) {
        fHadToUseCursorPos = TRUE;
      }
    }

    // Calculate AP costs...
    sAPCost = GetAPsToBeginFirstAid(pSoldier);
    sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, FALSE, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

    if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
      // OK, set UI
      SetUIBusy(pSoldier.value.ubID);

      // CHECK IF WE ARE AT THIS GRIDNO NOW
      if (pSoldier.value.sGridNo != sActionGridNo) {
        // SEND PENDING ACTION
        pSoldier.value.ubPendingAction = Enum257.MERC_GIVEAID;

        if (fHadToUseCursorPos) {
          pSoldier.value.sPendingActionData2 = usMapPos;
        } else {
          if (pTargetSoldier != NULL) {
            pSoldier.value.sPendingActionData2 = pTargetSoldier.value.sGridNo;
          } else {
            pSoldier.value.sPendingActionData2 = usGridNo;
          }
        }
        pSoldier.value.bPendingActionData3 = ubDirection;
        pSoldier.value.ubPendingActionAnimCount = 0;

        // WALK UP TO DEST FIRST
        EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
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
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
    if (sActionGridNo != -1) {
      // Calculate AP costs...
      sAPCost = GetAPsToCutFence(pSoldier);
      sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, FALSE, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

      if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
        // CHECK IF WE ARE AT THIS GRIDNO NOW
        if (pSoldier.value.sGridNo != sActionGridNo) {
          // SEND PENDING ACTION
          pSoldier.value.ubPendingAction = Enum257.MERC_CUTFFENCE;
          pSoldier.value.sPendingActionData2 = sAdjustedGridNo;
          pSoldier.value.bPendingActionData3 = ubDirection;
          pSoldier.value.ubPendingActionAnimCount = 0;

          // WALK UP TO DEST FIRST
          EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
        } else {
          EVENT_SoldierBeginCutFence(pSoldier, sAdjustedGridNo, ubDirection);
        }

        // OK, set UI
        SetUIBusy(pSoldier.value.ubID);

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
    let fVehicle: BOOLEAN = FALSE;
    let sVehicleGridNo: INT16 = -1;

    // For repair, check if we are over a vehicle, then get gridnot to edge of that vehicle!
    if (IsRepairableStructAtGridNo(usGridNo, addressof(ubMercID)) == 2) {
      let sNewGridNo: INT16;
      let ubDirection: UINT8;

      sNewGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.value.usUIMovementMode, 5, addressof(ubDirection), 0, MercPtrs[ubMercID]);

      if (sNewGridNo != NOWHERE) {
        usGridNo = sNewGridNo;

        sVehicleGridNo = MercPtrs[ubMercID].value.sGridNo;

        fVehicle = TRUE;
      }
    }

    // See if we can get there to stab
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);

    if (sActionGridNo != -1) {
      // Calculate AP costs...
      sAPCost = GetAPsToBeginRepair(pSoldier);
      sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, FALSE, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

      if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
        // CHECK IF WE ARE AT THIS GRIDNO NOW
        if (pSoldier.value.sGridNo != sActionGridNo) {
          // SEND PENDING ACTION
          pSoldier.value.ubPendingAction = Enum257.MERC_REPAIR;
          pSoldier.value.sPendingActionData2 = sAdjustedGridNo;

          if (fVehicle) {
            pSoldier.value.sPendingActionData2 = sVehicleGridNo;
          }

          pSoldier.value.bPendingActionData3 = ubDirection;
          pSoldier.value.ubPendingActionAnimCount = 0;

          // WALK UP TO DEST FIRST
          EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
        } else {
          EVENT_SoldierBeginRepair(pSoldier, sAdjustedGridNo, ubDirection);
        }

        // OK, set UI
        SetUIBusy(pSoldier.value.ubID);

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

      sNewGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, pSoldier.value.usUIMovementMode, 5, addressof(ubDirection), 0, MercPtrs[ubMercID]);

      if (sNewGridNo != NOWHERE) {
        usGridNo = sNewGridNo;

        sVehicleGridNo = MercPtrs[ubMercID].value.sGridNo;
      }
    }

    // See if we can get there to stab
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);

    if (sActionGridNo != -1) {
      // Calculate AP costs...
      sAPCost = GetAPsToRefuelVehicle(pSoldier);
      sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, FALSE, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

      if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
        // CHECK IF WE ARE AT THIS GRIDNO NOW
        if (pSoldier.value.sGridNo != sActionGridNo) {
          // SEND PENDING ACTION
          pSoldier.value.ubPendingAction = Enum257.MERC_FUEL_VEHICLE;
          pSoldier.value.sPendingActionData2 = sAdjustedGridNo;

          pSoldier.value.sPendingActionData2 = sVehicleGridNo;
          pSoldier.value.bPendingActionData3 = ubDirection;
          pSoldier.value.ubPendingActionAnimCount = 0;

          // WALK UP TO DEST FIRST
          EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
        } else {
          EVENT_SoldierBeginRefuel(pSoldier, sAdjustedGridNo, ubDirection);
        }

        // OK, set UI
        SetUIBusy(pSoldier.value.ubID);

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
    sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);

    if (sActionGridNo != -1) {
      // Calculate AP costs...
      sAPCost = GetAPsToUseJar(pSoldier, sActionGridNo);
      sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, FALSE, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

      if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
        // CHECK IF WE ARE AT THIS GRIDNO NOW
        if (pSoldier.value.sGridNo != sActionGridNo) {
          // SEND PENDING ACTION
          pSoldier.value.ubPendingAction = Enum257.MERC_TAKEBLOOD;
          pSoldier.value.sPendingActionData2 = sAdjustedGridNo;
          pSoldier.value.bPendingActionData3 = ubDirection;
          pSoldier.value.ubPendingActionAnimCount = 0;

          // WALK UP TO DEST FIRST
          EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
        } else {
          EVENT_SoldierBeginTakeBlood(pSoldier, sAdjustedGridNo, ubDirection);
        }

        // OK, set UI
        SetUIBusy(pSoldier.value.ubID);

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
    let pStructure: Pointer<STRUCTURE>;
    let pIntTile: Pointer<LEVELNODE>;

    // Get structure info for in tile!
    pIntTile = GetCurInteractiveTileGridNoAndStructure(addressof(usGridNo), addressof(pStructure));

    // We should not have null here if we are given this flag...
    if (pIntTile != NULL) {
      sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), FALSE, TRUE);

      if (sActionGridNo != -1) {
        // Calculate AP costs...
        sAPCost = AP_ATTACH_CAN;
        sAPCost += PlotPath(pSoldier, sActionGridNo, NO_COPYROUTE, FALSE, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

        if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
          // CHECK IF WE ARE AT THIS GRIDNO NOW
          if (pSoldier.value.sGridNo != sActionGridNo) {
            // SEND PENDING ACTION
            pSoldier.value.ubPendingAction = Enum257.MERC_ATTACH_CAN;
            pSoldier.value.sPendingActionData2 = usGridNo;
            pSoldier.value.bPendingActionData3 = ubDirection;
            pSoldier.value.ubPendingActionAnimCount = 0;

            // WALK UP TO DEST FIRST
            EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
          } else {
            EVENT_SoldierBeginTakeBlood(pSoldier, usGridNo, ubDirection);
          }

          // OK, set UI
          SetUIBusy(pSoldier.value.ubID);

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
        PlayJA2Sample(Enum330.USE_X_RAY_MACHINE, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));

        ActivateXRayDevice(pSoldier);
        return ITEM_HANDLE_OK;
      } else // detonator
      {
        // Save gridno....
        pSoldier.value.sPendingActionData2 = usGridNo;

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
    fDropBomb = TRUE;
  }

  // Check for a bomb like a mine, that uses a pressure detonator
  if (Item[usHandItem].ubCursor == INVALIDCURS) {
    // Found detonator...
    if (FindAttachment(addressof(pSoldier.value.inv[pSoldier.value.ubAttackingHand]), Enum225.DETONATOR) != ITEM_NOT_FOUND || FindAttachment(addressof(pSoldier.value.inv[pSoldier.value.ubAttackingHand]), Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
      fDropBomb = TRUE;
    }
  }

  if (fDropBomb) {
    // Save gridno....
    pSoldier.value.sPendingActionData2 = usGridNo;

    if (pSoldier.value.sGridNo != usGridNo) {
      // SEND PENDING ACTION
      pSoldier.value.ubPendingAction = Enum257.MERC_DROPBOMB;
      pSoldier.value.ubPendingActionAnimCount = 0;

      // WALK UP TO DEST FIRST
      EVENT_InternalGetNewSoldierPath(pSoldier, usGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
    } else {
      EVENT_SoldierBeginDropBomb(pSoldier);
    }

    // OK, set UI
    SetUIBusy(pSoldier.value.ubID);

    if (fFromUI) {
      guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
    }

    return ITEM_HANDLE_OK;
  }

  // USING THE BLADE
  if (Item[usHandItem].usItemClass == IC_BLADE) {
    // See if we can get there to stab
    if (pSoldier.value.ubBodyType == Enum194.BLOODCAT) {
      sActionGridNo = FindNextToAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
    } else if (CREATURE_OR_BLOODCAT(pSoldier) && PythSpacesAway(pSoldier.value.sGridNo, usGridNo) > 1) {
      sActionGridNo = FindNextToAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
      if (sActionGridNo == -1) {
        sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
      }
    } else {
      sActionGridNo = FindAdjacentGridEx(pSoldier, usGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
    }

    if (sActionGridNo != -1) {
      pSoldier.value.usActionData = sActionGridNo;

      // CHECK IF WE ARE AT THIS GRIDNO NOW
      if (pSoldier.value.sGridNo != sActionGridNo) {
        // SEND PENDING ACTION
        pSoldier.value.ubPendingAction = Enum257.MERC_KNIFEATTACK;
        pSoldier.value.sPendingActionData2 = sAdjustedGridNo;
        pSoldier.value.bPendingActionData3 = ubDirection;
        pSoldier.value.ubPendingActionAnimCount = 0;

        // WALK UP TO DEST FIRST
        EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
      } else {
        // for the benefit of the AI
        pSoldier.value.bAction = Enum289.AI_ACTION_KNIFE_STAB;
        EVENT_SoldierBeginBladeAttack(pSoldier, sAdjustedGridNo, ubDirection);
      }

      // OK, set UI
      SetUIBusy(pSoldier.value.ubID);

      if (fFromUI) {
        guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
        gfResetUIMovementOptimization = TRUE;
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
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting swipe attack, incrementing a.b.c in HandleItems to %d", gTacticalStatus.ubAttackBusyCount));

    sAPCost = CalcTotalAPsToAttack(pSoldier, sGridNo, FALSE, pSoldier.value.bAimTime);

    DeductPoints(pSoldier, sAPCost, 0);

    EVENT_InitNewSoldierAnim(pSoldier, Enum193.QUEEN_SWIPE, 0, FALSE);

    // FireWeapon( pSoldier, sTargetGridNo );
    pSoldier.value.bAction = Enum289.AI_ACTION_KNIFE_STAB;

    return ITEM_HANDLE_OK;
  }

  // THIS IS IF WE WERE FROM THE UI
  if (Item[usHandItem].usItemClass == IC_GRENADE || Item[usHandItem].usItemClass == IC_LAUNCHER || Item[usHandItem].usItemClass == IC_THROWN) {
    let sCheckGridNo: INT16;

    // Get gridno - either soldier's position or the gridno
    if (pTargetSoldier != NULL) {
      sTargetGridNo = pTargetSoldier.value.sGridNo;
    } else {
      sTargetGridNo = usGridNo;
    }

    sAPCost = MinAPsToAttack(pSoldier, sTargetGridNo, TRUE);

    // Check if these is room to place mortar!
    if (usHandItem == Enum225.MORTAR) {
      ubDirection = GetDirectionFromGridNo(sTargetGridNo, pSoldier);

      // Get new gridno!
      sCheckGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(ubDirection));

      if (!OKFallDirection(pSoldier, sCheckGridNo, pSoldier.value.bLevel, ubDirection, pSoldier.value.usAnimState)) {
        return ITEM_HANDLE_NOROOM;
      }

      pSoldier.value.fDontChargeAPsForStanceChange = TRUE;
    } else if (usHandItem == Enum225.GLAUNCHER || usHandItem == Enum225.UNDER_GLAUNCHER) {
      GetAPChargeForShootOrStabWRTGunRaises(pSoldier, sTargetGridNo, TRUE, addressof(fAddingTurningCost), addressof(fAddingRaiseGunCost));

      // If we are standing and are asked to turn AND raise gun, ignore raise gun...
      if (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND) {
        if (fAddingRaiseGunCost) {
          pSoldier.value.fDontChargeTurningAPs = TRUE;
        }
      } else {
        // If raising gun, don't charge turning!
        if (fAddingTurningCost) {
          pSoldier.value.fDontChargeReadyAPs = TRUE;
        }
      }
    }

    // If this is a player guy, show message about no APS
    if (EnoughPoints(pSoldier, sAPCost, 0, fFromUI)) {
      pSoldier.value.ubAttackingHand = Enum261.HANDPOS;
      pSoldier.value.usAttackingWeapon = usHandItem;
      pSoldier.value.bTargetLevel = bLevel;

      // Look at the cursor, if toss cursor...
      if (Item[usHandItem].ubCursor == TOSSCURS) {
        pSoldier.value.sTargetGridNo = sTargetGridNo;
        //	pSoldier->sLastTarget = sTargetGridNo;
        pSoldier.value.ubTargetID = WhoIsThere2(sTargetGridNo, pSoldier.value.bTargetLevel);

        // Increment attack counter...
        gTacticalStatus.ubAttackBusyCount++;

        // ATE: Don't charge turning...
        pSoldier.value.fDontChargeTurningAPs = TRUE;

        FireWeapon(pSoldier, sTargetGridNo);
      } else {
        SendBeginFireWeaponEvent(pSoldier, sTargetGridNo);
      }

      // OK, set UI
      SetUIBusy(pSoldier.value.ubID);

      return ITEM_HANDLE_OK;
    } else {
      return ITEM_HANDLE_NOAPS;
    }

    return ITEM_HANDLE_OK;
  }

  // CHECK FOR BOMB....
  if (Item[usHandItem].ubCursor == INVALIDCURS) {
    // Found detonator...
    if (FindAttachment(addressof(pSoldier.value.inv[usHandItem]), Enum225.DETONATOR) != ITEM_NOT_FOUND || FindAttachment(addressof(pSoldier.value.inv[usHandItem]), Enum225.REMDETONATOR)) {
      StartBombMessageBox(pSoldier, usGridNo);

      if (fFromUI) {
        guiPendingOverrideEvent = Enum207.A_CHANGE_TO_MOVE;
      }

      return ITEM_HANDLE_OK;
    }
  }

  return ITEM_HANDLE_OK;
}

function HandleSoldierDropBomb(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  // Does this have detonator that needs info?
  if (FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.DETONATOR) != ITEM_NOT_FOUND || FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
    StartBombMessageBox(pSoldier, sGridNo);
  } else {
    // We have something... all we do is place...
    if (ArmBomb(addressof(pSoldier.value.inv[Enum261.HANDPOS]), 0)) {
      // EXPLOSIVES GAIN (25):  Place a bomb, or buried and armed a mine
      StatChange(pSoldier, EXPLODEAMT, 25, FALSE);

      pSoldier.value.inv[Enum261.HANDPOS].bTrap = __min(10, (EffectiveExplosive(pSoldier) / 20) + (EffectiveExpLevel(pSoldier) / 3));
      pSoldier.value.inv[Enum261.HANDPOS].ubBombOwner = pSoldier.value.ubID + 2;

      // we now know there is something nasty here
      gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_PLAYER_MINE_PRESENT;

      AddItemToPool(sGridNo, addressof(pSoldier.value.inv[Enum261.HANDPOS]), BURIED, pSoldier.value.bLevel, WORLD_ITEM_ARMED_BOMB, 0);
      DeleteObj(addressof(pSoldier.value.inv[Enum261.HANDPOS]));
    }
  }
}

function HandleSoldierUseRemote(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  StartBombMessageBox(pSoldier, sGridNo);
}

function SoldierHandleDropItem(pSoldier: Pointer<SOLDIERTYPE>): void {
  // LOOK IN PANDING DATA FOR ITEM TO DROP, AND LOCATION
  if (pSoldier.value.pTempObject != NULL) {
    if (pSoldier.value.bVisible != -1) {
      PlayJA2Sample(Enum330.THROW_IMPACT_2, RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));
    }

    AddItemToPool(pSoldier.value.sGridNo, pSoldier.value.pTempObject, 1, pSoldier.value.bLevel, 0, -1);
    NotifySoldiersToLookforItems();

    MemFree(pSoldier.value.pTempObject);
    pSoldier.value.pTempObject = NULL;
  }
}

function HandleSoldierThrowItem(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  // Determine what to do
  let ubDirection: UINT8;

  // Set attacker to NOBODY, since it's not a combat attack
  pSoldier.value.ubTargetID = NOBODY;

  // Alrighty, switch based on stance!
  switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
    case ANIM_STAND:

      // CHECK IF WE ARE NOT ON THE SAME GRIDNO
      if (sGridNo == pSoldier.value.sGridNo) {
        PickDropItemAnimation(pSoldier);
      } else {
        // CHANGE DIRECTION AT LEAST
        ubDirection = GetDirectionFromGridNo(sGridNo, pSoldier);

        SoldierGotoStationaryStance(pSoldier);

        EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
        pSoldier.value.fTurningUntilDone = TRUE;

        // Draw item depending on distance from buddy
        if (GetRangeFromGridNoDiff(sGridNo, pSoldier.value.sGridNo) < MIN_LOB_RANGE) {
          pSoldier.value.usPendingAnimation = Enum193.LOB_ITEM;
        } else {
          pSoldier.value.usPendingAnimation = Enum193.THROW_ITEM;
        }
      }
      break;

    case ANIM_CROUCH:
    case ANIM_PRONE:

      // CHECK IF WE ARE NOT ON THE SAME GRIDNO
      if (sGridNo == pSoldier.value.sGridNo) {
        // OK, JUST DROP ITEM!
        if (pSoldier.value.pTempObject != NULL) {
          AddItemToPool(sGridNo, pSoldier.value.pTempObject, 1, pSoldier.value.bLevel, 0, -1);
          NotifySoldiersToLookforItems();

          MemFree(pSoldier.value.pTempObject);
          pSoldier.value.pTempObject = NULL;
        }
      } else {
        // OK, go from prone/crouch to stand first!
        ubDirection = GetDirectionFromGridNo(sGridNo, pSoldier);
        EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);

        ChangeSoldierState(pSoldier, Enum193.THROW_ITEM, 0, FALSE);
      }
  }
}

function SoldierGiveItem(pSoldier: Pointer<SOLDIERTYPE>, pTargetSoldier: Pointer<SOLDIERTYPE>, pObject: Pointer<OBJECTTYPE>, bInvPos: INT8): void {
  let sActionGridNo: INT16;
  let sAdjustedGridNo: INT16;
  let ubDirection: UINT8;

  // Remove any previous actions
  pSoldier.value.ubPendingAction = NO_PENDING_ACTION;

  // See if we can get there to stab
  sActionGridNo = FindAdjacentGridEx(pSoldier, pTargetSoldier.value.sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), TRUE, FALSE);
  if (sActionGridNo != -1) {
    // SEND PENDING ACTION
    pSoldier.value.ubPendingAction = Enum257.MERC_GIVEITEM;

    pSoldier.value.bPendingActionData5 = bInvPos;
    // Copy temp object
    pSoldier.value.pTempObject = MemAlloc(sizeof(OBJECTTYPE));
    memcpy(pSoldier.value.pTempObject, pObject, sizeof(OBJECTTYPE));

    pSoldier.value.sPendingActionData2 = pTargetSoldier.value.sGridNo;
    pSoldier.value.bPendingActionData3 = ubDirection;
    pSoldier.value.uiPendingActionData4 = pTargetSoldier.value.ubID;
    pSoldier.value.ubPendingActionAnimCount = 0;

    // Set soldier as engaged!
    pSoldier.value.uiStatusFlags |= SOLDIER_ENGAGEDINACTION;

    // CHECK IF WE ARE AT THIS GRIDNO NOW
    if (pSoldier.value.sGridNo != sActionGridNo) {
      // WALK UP TO DEST FIRST
      EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
    } else {
      EVENT_SoldierBeginGiveItem(pSoldier);
      // CHANGE DIRECTION OF TARGET TO OPPOSIDE DIRECTION!
      EVENT_SetSoldierDesiredDirection(pSoldier, ubDirection);
    }

    // Set target as engaged!
    pTargetSoldier.value.uiStatusFlags |= SOLDIER_ENGAGEDINACTION;

    return;
  } else {
    return;
  }
}

function SoldierDropItem(pSoldier: Pointer<SOLDIERTYPE>, pObj: Pointer<OBJECTTYPE>): BOOLEAN {
  pSoldier.value.pTempObject = MemAlloc(sizeof(OBJECTTYPE));
  if (pSoldier.value.pTempObject == NULL) {
    // OUT OF MEMORY! YIKES!
    return FALSE;
  }
  memcpy(pSoldier.value.pTempObject, pObj, sizeof(OBJECTTYPE));
  PickDropItemAnimation(pSoldier);
  return TRUE;
}

function SoldierPickupItem(pSoldier: Pointer<SOLDIERTYPE>, iItemIndex: INT32, sGridNo: INT16, bZLevel: INT8): void {
  let sActionGridNo: INT16;

  // Remove any previous actions
  pSoldier.value.ubPendingAction = NO_PENDING_ACTION;

  sActionGridNo = AdjustGridNoForItemPlacement(pSoldier, sGridNo);

  // SET PENDING ACTIONS!
  pSoldier.value.ubPendingAction = Enum257.MERC_PICKUPITEM;
  pSoldier.value.uiPendingActionData1 = iItemIndex;
  pSoldier.value.sPendingActionData2 = sActionGridNo;
  pSoldier.value.uiPendingActionData4 = sGridNo;
  pSoldier.value.bPendingActionData3 = bZLevel;
  pSoldier.value.ubPendingActionAnimCount = 0;

  // Deduct points!
  // sAPCost = GetAPsToPickupItem( pSoldier, sGridNo );
  // DeductPoints( pSoldier, sAPCost, 0 );
  SetUIBusy(pSoldier.value.ubID);

  // CHECK IF NOT AT SAME GRIDNO
  if (pSoldier.value.sGridNo != sActionGridNo) {
    if (pSoldier.value.bTeam == gbPlayerNum) {
      EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, TRUE, TRUE);

      // Say it only if we don;t have to go too far!
      if (pSoldier.value.usPathDataSize > 5) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);
      }
    } else {
      EVENT_InternalGetNewSoldierPath(pSoldier, sActionGridNo, pSoldier.value.usUIMovementMode, FALSE, TRUE);
    }
  } else {
    // DO ANIMATION OF PICKUP NOW!
    PickPickupAnimation(pSoldier, pSoldier.value.uiPendingActionData1, (pSoldier.value.uiPendingActionData4), pSoldier.value.bPendingActionData3);
  }
}

function HandleAutoPlaceFail(pSoldier: Pointer<SOLDIERTYPE>, iItemIndex: INT32, sGridNo: INT16): void {
  if (pSoldier.value.bTeam == gbPlayerNum) {
    // Place it in buddy's hand!
    if (gpItemPointer == NULL) {
      InternalBeginItemPointer(pSoldier, addressof(gWorldItems[iItemIndex].o), NO_SLOT);
    } else {
      // Add back to world...
      AddItemToPool(sGridNo, addressof(gWorldItems[iItemIndex].o), 1, pSoldier.value.bLevel, 0, -1);

      // If we are a merc, say DAMN quote....
      if (pSoldier.value.bTeam == gbPlayerNum) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
      }
    }
  }
}

function SoldierGetItemFromWorld(pSoldier: Pointer<SOLDIERTYPE>, iItemIndex: INT32, sGridNo: INT16, bZLevel: INT8, pfSelectionList: Pointer<BOOLEAN>): void {
  let pItemPool: Pointer<ITEM_POOL>;
  let pItemPoolToDelete: Pointer<ITEM_POOL> = NULL;
  let Object: OBJECTTYPE;
  let cnt: INT32 = 0;
  let fPickup: BOOLEAN;
  let fFailedAutoPlace: BOOLEAN = FALSE;
  let iItemIndexToDelete: INT32;
  let fShouldSayCoolQuote: BOOLEAN = FALSE;
  let fDidSayCoolQuote: BOOLEAN = FALSE;
  let fSaidBoobyTrapQuote: BOOLEAN = FALSE;

  // OK. CHECK IF WE ARE DOING ALL IN THIS POOL....
  if (iItemIndex == ITEM_PICKUP_ACTION_ALL || iItemIndex == ITEM_PICKUP_SELECTION) {
    // DO all pickup!
    // LOOP THROUGH LIST TO FIND NODE WE WANT
    GetItemPool(sGridNo, addressof(pItemPool), pSoldier.value.bLevel);

    while (pItemPool) {
      if (ItemPoolOKForPickup(pSoldier, pItemPool, bZLevel)) {
        fPickup = TRUE;

        if (iItemIndex == ITEM_PICKUP_SELECTION) {
          if (!pfSelectionList[cnt]) {
            fPickup = FALSE;
          }
        }

        // Increment counter...
        //:ATE: Only incremrnt counter for items we can see..
        cnt++;

        if (fPickup) {
          if (ContinuePastBoobyTrap(pSoldier, sGridNo, bZLevel, pItemPool.value.iItemIndex, FALSE, addressof(fSaidBoobyTrapQuote))) {
            // Make copy of item
            memcpy(addressof(Object), addressof(gWorldItems[pItemPool.value.iItemIndex].o), sizeof(OBJECTTYPE));

            if (ItemIsCool(addressof(Object))) {
              fShouldSayCoolQuote = TRUE;
            }

            if (Object.usItem == Enum225.SWITCH) {
              // ask about activating the switch!
              bTempFrequency = Object.bFrequency;
              gpTempSoldier = pSoldier;
              DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.ACTIVATE_SWITCH_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, SwitchMessageBoxCallBack, NULL);
              pItemPool = pItemPool.value.pNext;
            } else {
              if (!AutoPlaceObject(pSoldier, addressof(Object), TRUE)) {
                // check to see if the object has been swapped with one in inventory
                if (Object.usItem != gWorldItems[pItemPool.value.iItemIndex].o.usItem || Object.ubNumberOfObjects != gWorldItems[pItemPool.value.iItemIndex].o.ubNumberOfObjects) {
                  // copy back because item changed, and we must make sure the item pool reflects this.
                  memcpy(addressof(gWorldItems[pItemPool.value.iItemIndex].o), addressof(Object), sizeof(OBJECTTYPE));
                }

                pItemPoolToDelete = pItemPool;
                pItemPool = pItemPool.value.pNext;
                fFailedAutoPlace = TRUE;
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
              iItemIndexToDelete = pItemPool.value.iItemIndex;
              pItemPool = pItemPool.value.pNext;
              RemoveItemFromPool(sGridNo, iItemIndexToDelete, pSoldier.value.bLevel);
            }
          } else {
            // boobytrap found... stop picking up things!
            break;
          }
        } else {
          pItemPool = pItemPool.value.pNext;
        }
      } else {
        pItemPool = pItemPool.value.pNext;
      }
    }

    // ATE; If here, and we failed to add any more stuff, put failed one in our cursor...
    if (pItemPoolToDelete != NULL && fFailedAutoPlace) {
      gfDontChargeAPsToPickup = TRUE;
      HandleAutoPlaceFail(pSoldier, pItemPoolToDelete.value.iItemIndex, sGridNo);
      RemoveItemFromPool(sGridNo, pItemPoolToDelete.value.iItemIndex, pSoldier.value.bLevel);
      pItemPoolToDelete = NULL;
    }
  } else {
    // REMOVE ITEM FROM POOL
    if (ItemExistsAtLocation(sGridNo, iItemIndex, pSoldier.value.bLevel)) {
      if (ContinuePastBoobyTrap(pSoldier, sGridNo, bZLevel, iItemIndex, FALSE, addressof(fSaidBoobyTrapQuote))) {
        // Make copy of item
        memcpy(addressof(Object), addressof(gWorldItems[iItemIndex].o), sizeof(OBJECTTYPE));

        if (ItemIsCool(addressof(Object))) {
          fShouldSayCoolQuote = TRUE;
        }

        if (Object.usItem == Enum225.SWITCH) {
          // handle switch
          bTempFrequency = Object.bFrequency;
          gpTempSoldier = pSoldier;
          DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.ACTIVATE_SWITCH_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, SwitchMessageBoxCallBack, NULL);
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
          RemoveItemFromPool(sGridNo, iItemIndex, pSoldier.value.bLevel);

          if (!AutoPlaceObject(pSoldier, addressof(gWorldItems[iItemIndex].o), TRUE)) {
            gfDontChargeAPsToPickup = TRUE;
            HandleAutoPlaceFail(pSoldier, iItemIndex, sGridNo);
          }
        }
      }
    }
  }

  // OK, check if potentially a good candidate for cool quote
  if (fShouldSayCoolQuote && pSoldier.value.bTeam == gbPlayerNum) {
    // Do we have this quote..?
    if (QuoteExp_GotGunOrUsedGun[pSoldier.value.ubProfile] == Enum202.QUOTE_FOUND_SOMETHING_SPECIAL) {
      // Have we not said it today?
      if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_FOUND_SOMETHING_NICE)) {
        // set flag
        pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_FOUND_SOMETHING_NICE;

        // Say it....
        // We've found something!
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_FOUND_SOMETHING_SPECIAL);

        fDidSayCoolQuote = TRUE;
      }
    }
  }

  // Aknowledge....
  if (pSoldier.value.bTeam == OUR_TEAM && !fDidSayCoolQuote && !fSaidBoobyTrapQuote) {
    DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_GOTIT);
  }

  // OK partner......look for any hidden items!
  if (pSoldier.value.bTeam == gbPlayerNum && LookForHiddenItems(sGridNo, pSoldier.value.bLevel, TRUE, 0)) {
    // WISDOM GAIN (5):  Found a hidden object
    StatChange(pSoldier, WISDOMAMT, 5, FALSE);

    // We've found something!
    TacticalCharacterDialogue(pSoldier, (Enum202.QUOTE_SPOTTED_SOMETHING_ONE + Random(2)));
  }

  gpTempSoldier = pSoldier;
  gsTempGridno = sGridNo;
  SetCustomizableTimerCallbackAndDelay(1000, CheckForPickedOwnership, TRUE);
}

function HandleSoldierPickupItem(pSoldier: Pointer<SOLDIERTYPE>, iItemIndex: INT32, sGridNo: INT16, bZLevel: INT8): void {
  let pItemPool: Pointer<ITEM_POOL>;
  let usNum: UINT16;

  // Draw menu if more than one item!
  if (GetItemPool(sGridNo, addressof(pItemPool), pSoldier.value.bLevel)) {
    // OK, if an enemy, go directly ( skip menu )
    if (pSoldier.value.bTeam != gbPlayerNum) {
      SoldierGetItemFromWorld(pSoldier, iItemIndex, sGridNo, bZLevel, NULL);
    } else {
      if (gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_PLAYER_MINE_PRESENT) {
        // have the computer ask us if we want to proceed

        // override the item index passed in with the one for the bomb in this
        // tile
        iItemIndex = FindWorldItemForBombInGridNo(sGridNo, pSoldier.value.bLevel);

        gpBoobyTrapItemPool = GetItemPoolForIndex(sGridNo, iItemIndex, pSoldier.value.bLevel);
        gpBoobyTrapSoldier = pSoldier;
        gsBoobyTrapGridNo = sGridNo;
        gbBoobyTrapLevel = pSoldier.value.bLevel;
        gfDisarmingBuriedBomb = TRUE;
        gbTrapDifficulty = gWorldItems[iItemIndex].o.bTrap;

        DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.DISARM_TRAP_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, BoobyTrapMessageBoxCallBack, NULL);
      } else {
        // OK, only hidden items exist...
        if (pSoldier.value.bTeam == gbPlayerNum && DoesItemPoolContainAllHiddenItems(pItemPool)) {
          // He's touched them....
          if (LookForHiddenItems(sGridNo, pSoldier.value.bLevel, TRUE, 0)) {
            // WISDOM GAIN (5):  Found a hidden object
            StatChange(pSoldier, WISDOMAMT, 5, FALSE);

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
            while (!ItemPoolOKForDisplay(pItemPool, bZLevel)) {
              pItemPool = pItemPool.value.pNext;
            }
            SoldierGetItemFromWorld(pSoldier, pItemPool.value.iItemIndex, sGridNo, bZLevel, NULL);
          } else {
            if (usNum != 0) {
              // Freeze guy!
              pSoldier.value.fPauseAllAnimation = TRUE;

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

function AddItemGraphicToWorld(pItem: Pointer<INVTYPE>, sGridNo: INT16, ubLevel: UINT8): Pointer<LEVELNODE> {
  let usTileIndex: UINT16;
  let pNode: Pointer<LEVELNODE>;

  usTileIndex = GetTileGraphicForItem(pItem);

  // OK, Do stuff differently base on level!
  if (ubLevel == 0) {
    pNode = AddStructToTail(sGridNo, usTileIndex);
    // SET FLAG FOR AN ITEM
    pNode.value.uiFlags |= LEVELNODE_ITEM;
  } else {
    AddOnRoofToHead(sGridNo, usTileIndex);
    // SET FLAG FOR AN ITEM
    pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
    pNode.value.uiFlags |= LEVELNODE_ITEM;
  }

  // DIRTY INTERFACE
  fInterfacePanelDirty = DIRTYLEVEL2;

  // DIRTY TILE
  gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REDRAW;
  SetRenderFlags(RENDER_FLAG_MARKED);

  return pNode;
}

function RemoveItemGraphicFromWorld(pItem: Pointer<INVTYPE>, sGridNo: INT16, ubLevel: UINT8, pLevelNode: Pointer<LEVELNODE>): void {
  let pNode: Pointer<LEVELNODE>;

  // OK, Do stuff differently base on level!
  // Loop through and find pointer....
  if (ubLevel == 0) {
    pNode = gpWorldLevelData[sGridNo].pStructHead;
  } else {
    pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
  }

  while (pNode != NULL) {
    if (pNode == pLevelNode) {
      // Found one!
      if (ubLevel == 0) {
        RemoveStructFromLevelNode(sGridNo, pNode);
      } else {
        RemoveOnRoofFromLevelNode(sGridNo, pNode);
      }

      break;
    }

    pNode = pNode.value.pNext;
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
function AddItemToPool(sGridNo: INT16, pObject: Pointer<OBJECTTYPE>, bVisible: INT8, ubLevel: UINT8, usFlags: UINT16, bRenderZHeightAboveLevel: INT8): Pointer<OBJECTTYPE> {
  return InternalAddItemToPool(addressof(sGridNo), pObject, bVisible, ubLevel, usFlags, bRenderZHeightAboveLevel, NULL);
}

function AddItemToPoolAndGetIndex(sGridNo: INT16, pObject: Pointer<OBJECTTYPE>, bVisible: INT8, ubLevel: UINT8, usFlags: UINT16, bRenderZHeightAboveLevel: INT8, piItemIndex: Pointer<INT32>): Pointer<OBJECTTYPE> {
  return InternalAddItemToPool(addressof(sGridNo), pObject, bVisible, ubLevel, usFlags, bRenderZHeightAboveLevel, piItemIndex);
}

function InternalAddItemToPool(psGridNo: Pointer<INT16>, pObject: Pointer<OBJECTTYPE>, bVisible: INT8, ubLevel: UINT8, usFlags: UINT16, bRenderZHeightAboveLevel: INT8, piItemIndex: Pointer<INT32>): Pointer<OBJECTTYPE> {
  let pItemPool: Pointer<ITEM_POOL>;
  let pItemPoolTemp: Pointer<ITEM_POOL>;
  let iWorldItem: INT32;
  let pStructure: Pointer<STRUCTURE>;
  let pBase: Pointer<STRUCTURE>;
  let sDesiredLevel: INT16;
  let sNewGridNo: INT16 = psGridNo.value;
  let pNode: Pointer<LEVELNODE>;
  let fForceOnGround: BOOLEAN = FALSE;
  let fObjectInOpenable: BOOLEAN = FALSE;
  let bTerrainID: INT8;

  Assert(pObject.value.ubNumberOfObjects <= MAX_OBJECTS_PER_SLOT);

  // ATE: Check if the gridno is OK
  if ((psGridNo.value) == NOWHERE) {
    // Display warning.....
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Error: Item %d was given invalid grid location %d for item pool. Please Report.", pObject.value.usItem, (psGridNo.value));

    (psGridNo.value) = sNewGridNo = gMapInformation.sCenterGridNo;

    // return( NULL );
  }

  // CHECK IF THIS ITEM IS IN DEEP WATER....
  // IF SO, CHECK IF IT SINKS...
  // IF SO, DONT'T ADD!
  bTerrainID = GetTerrainType(psGridNo.value);

  if (bTerrainID == Enum315.DEEP_WATER || bTerrainID == Enum315.LOW_WATER || bTerrainID == Enum315.MED_WATER) {
    if (Item[pObject.value.usItem].fFlags & ITEM_SINKS) {
      return NULL;
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
    fForceOnGround = TRUE;
    bRenderZHeightAboveLevel = 0;
  }

  // Check structure database
  if (gpWorldLevelData[psGridNo.value].pStructureHead && (pObject.value.usItem != Enum225.OWNERSHIP) && (pObject.value.usItem != Enum225.ACTION_ITEM)) {
    // Something is here, check obstruction in future
    sDesiredLevel = ubLevel ? STRUCTURE_ON_ROOF : STRUCTURE_ON_GROUND;
    pStructure = FindStructure(psGridNo.value, STRUCTURE_BLOCKSMOVES);
    while (pStructure) {
      if (!(pStructure.value.fFlags & (STRUCTURE_PERSON | STRUCTURE_CORPSE)) && pStructure.value.sCubeOffset == sDesiredLevel) {
        // If we are going into a raised struct AND we have above level set to -1
        if (StructureBottomLevel(pStructure) != 1 && fForceOnGround) {
          break;
        }

        // Adjust the item's gridno to the base of struct.....
        pBase = FindBaseStructure(pStructure);

        // Get LEVELNODE for struct and remove!
        sNewGridNo = pBase.value.sGridNo;

        // Check for openable flag....
        if (pStructure.value.fFlags & STRUCTURE_OPENABLE) {
          // ATE: Set a flag here - we need to know later that we're in an openable...
          fObjectInOpenable = TRUE;

          // Something of note is here....
          // SOME sort of structure is here.... set render flag to off
          usFlags |= WORLD_ITEM_DONTRENDER;

          // Openable.. check if it's closed, if so, set visiblity...
          if (!(pStructure.value.fFlags & STRUCTURE_OPEN)) {
            // -2 means - don't reveal!
            bVisible = -2;
          }

          bRenderZHeightAboveLevel = CONVERT_INDEX_TO_PIXELS(StructureHeight(pStructure));
          break;
        }
        // Else can we place an item on top?
        else if (pStructure.value.fFlags & (STRUCTURE_GENERIC)) {
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
          pStructure.value.fFlags |= STRUCTURE_HASITEMONTOP;
          break;
        }
      }

      pStructure = FindNextStructure(pStructure, STRUCTURE_BLOCKSMOVES);
    }
  }

  if (pObject.value.usItem == Enum225.SWITCH && !fObjectInOpenable) {
    if (bVisible != -2) {
      // switch items which are not hidden inside objects should be considered buried
      bVisible = BURIED;
      // and they are pressure-triggered unless there is a switch structure there
      if (FindStructure(psGridNo.value, STRUCTURE_SWITCH) != NULL) {
        pObject.value.bDetonatorType = Enum224.BOMB_SWITCH;
      } else {
        pObject.value.bDetonatorType = Enum224.BOMB_PRESSURE;
      }
    } else {
      // else they are manually controlled
      pObject.value.bDetonatorType = Enum224.BOMB_SWITCH;
    }
  } else if (pObject.value.usItem == Enum225.ACTION_ITEM) {
    switch (pObject.value.bActionValue) {
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
  if (GetItemPool(psGridNo.value, addressof(pItemPool), ubLevel)) {
    // Add to exitsing pool
    // Add graphic
    pNode = AddItemGraphicToWorld(addressof(Item[pObject.value.usItem]), psGridNo.value, ubLevel);

    // Set pool head value in levelnode
    pNode.value.pItemPool = pItemPool;

    // Add New Node
    pItemPoolTemp = pItemPool;
    // Create new pool
    pItemPool = MemAlloc(sizeof(ITEM_POOL));

    // Set Next to NULL
    pItemPool.value.pNext = NULL;
    // Set Item index
    pItemPool.value.iItemIndex = iWorldItem;
    // Get a link back!
    pItemPool.value.pLevelNode = pNode;

    if (pItemPoolTemp) {
      // Get last item in list
      while (pItemPoolTemp.value.pNext != NULL)
        pItemPoolTemp = pItemPoolTemp.value.pNext;

      // Set Next of previous
      pItemPoolTemp.value.pNext = pItemPool;
    }
    // Set Previous of new one
    pItemPool.value.pPrev = pItemPoolTemp;
  } else {
    pNode = AddItemGraphicToWorld(addressof(Item[pObject.value.usItem]), psGridNo.value, ubLevel);

    // Create new pool
    pItemPool = MemAlloc(sizeof(ITEM_POOL));

    pNode.value.pItemPool = pItemPool;

    // Set prev to NULL
    pItemPool.value.pPrev = NULL;
    // Set next to NULL
    pItemPool.value.pNext = NULL;
    // Set Item index
    pItemPool.value.iItemIndex = iWorldItem;
    // Get a link back!
    pItemPool.value.pLevelNode = pNode;

    // Set flag to indicate item pool presence
    gpWorldLevelData[psGridNo.value].uiFlags |= MAPELEMENT_ITEMPOOL_PRESENT;
  }

  // Set visible!
  pItemPool.value.bVisible = bVisible;

  // If bbisible is true, render makered world
  if (bVisible == 1 && GridNoOnScreen((psGridNo.value))) {
    // gpWorldLevelData[*psGridNo].uiFlags|=MAPELEMENT_REDRAW;
    // SetRenderFlags(RENDER_FLAG_MARKED);
    SetRenderFlags(RENDER_FLAG_FULL);
  }

  // Set flahs timer
  pItemPool.value.bFlashColor = FALSE;
  pItemPool.value.sGridNo = psGridNo.value;
  pItemPool.value.ubLevel = ubLevel;
  pItemPool.value.usFlags = usFlags;
  pItemPool.value.bVisible = bVisible;
  pItemPool.value.bRenderZHeightAboveLevel = bRenderZHeightAboveLevel;

  // ATE: Get head of pool again....
  if (GetItemPool(psGridNo.value, addressof(pItemPool), ubLevel)) {
    AdjustItemPoolVisibility(pItemPool);
  }

  if (piItemIndex) {
    piItemIndex.value = iWorldItem;
  }

  return addressof(gWorldItems[iWorldItem].o);
}

function ItemExistsAtLocation(sGridNo: INT16, iItemIndex: INT32, ubLevel: UINT8): BOOLEAN {
  let pItemPool: Pointer<ITEM_POOL>;
  let pItemPoolTemp: Pointer<ITEM_POOL>;
  let fItemFound: BOOLEAN = FALSE;

  // Check for an existing pool on the object layer
  if (GetItemPool(sGridNo, addressof(pItemPool), ubLevel)) {
    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != NULL) {
      if (pItemPoolTemp.value.iItemIndex == iItemIndex) {
        return TRUE;
      }
      pItemPoolTemp = pItemPoolTemp.value.pNext;
    }
  }

  return FALSE;
}

function ItemTypeExistsAtLocation(sGridNo: INT16, usItem: UINT16, ubLevel: UINT8, piItemIndex: Pointer<INT32>): BOOLEAN {
  let pItemPool: Pointer<ITEM_POOL>;
  let pItemPoolTemp: Pointer<ITEM_POOL>;
  let fItemFound: BOOLEAN = FALSE;

  // Check for an existing pool on the object layer
  if (GetItemPool(sGridNo, addressof(pItemPool), ubLevel)) {
    // LOOP THROUGH LIST TO FIND ITEM WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != NULL) {
      if (gWorldItems[pItemPoolTemp.value.iItemIndex].o.usItem == usItem) {
        if (piItemIndex) {
          piItemIndex.value = pItemPoolTemp.value.iItemIndex;
        }
        return TRUE;
      }
      pItemPoolTemp = pItemPoolTemp.value.pNext;
    }
  }

  return FALSE;
}

function GetItemOfClassTypeInPool(sGridNo: INT16, uiItemClass: UINT32, ubLevel: UINT8): INT32 {
  let pItemPool: Pointer<ITEM_POOL>;
  let pItemPoolTemp: Pointer<ITEM_POOL>;
  let fItemFound: BOOLEAN = FALSE;

  // Check for an existing pool on the object layer
  if (GetItemPool(sGridNo, addressof(pItemPool), ubLevel)) {
    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != NULL) {
      if (Item[gWorldItems[pItemPoolTemp.value.iItemIndex].o.usItem].usItemClass & uiItemClass) {
        return pItemPoolTemp.value.iItemIndex;
      }
      pItemPoolTemp = pItemPoolTemp.value.pNext;
    }
  }

  return -1;
}

function GetItemPoolForIndex(sGridNo: INT16, iItemIndex: INT32, ubLevel: UINT8): Pointer<ITEM_POOL> {
  let pItemPool: Pointer<ITEM_POOL>;
  let pItemPoolTemp: Pointer<ITEM_POOL>;
  let fItemFound: BOOLEAN = FALSE;

  // Check for an existing pool on the object layer
  if (GetItemPool(sGridNo, addressof(pItemPool), ubLevel)) {
    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != NULL) {
      if (pItemPoolTemp.value.iItemIndex == iItemIndex) {
        return pItemPoolTemp;
      }
      pItemPoolTemp = pItemPoolTemp.value.pNext;
    }
  }

  return NULL;
}

function DoesItemPoolContainAnyHiddenItems(pItemPool: Pointer<ITEM_POOL>): BOOLEAN {
  // LOOP THROUGH LIST TO FIND NODE WE WANT
  while (pItemPool != NULL) {
    if (gWorldItems[pItemPool.value.iItemIndex].bVisible == HIDDEN_ITEM) {
      return TRUE;
    }

    pItemPool = pItemPool.value.pNext;
  }

  return FALSE;
}

function DoesItemPoolContainAllHiddenItems(pItemPool: Pointer<ITEM_POOL>): BOOLEAN {
  // LOOP THROUGH LIST TO FIND NODE WE WANT
  while (pItemPool != NULL) {
    if (gWorldItems[pItemPool.value.iItemIndex].bVisible != HIDDEN_ITEM) {
      return FALSE;
    }

    pItemPool = pItemPool.value.pNext;
  }

  return TRUE;
}

function LookForHiddenItems(sGridNo: INT16, ubLevel: INT8, fSetLocator: BOOLEAN, bZLevel: INT8): BOOLEAN {
  let pItemPool: Pointer<ITEM_POOL> = NULL;
  let pHeadItemPool: Pointer<ITEM_POOL> = NULL;
  let fFound: BOOLEAN = FALSE;

  if (GetItemPool(sGridNo, addressof(pItemPool), ubLevel)) {
    pHeadItemPool = pItemPool;

    // LOOP THROUGH LIST TO FIND NODE WE WANT
    while (pItemPool != NULL) {
      if (gWorldItems[pItemPool.value.iItemIndex].bVisible == HIDDEN_ITEM && gWorldItems[pItemPool.value.iItemIndex].o.usItem != Enum225.OWNERSHIP) {
        fFound = TRUE;

        gWorldItems[pItemPool.value.iItemIndex].bVisible = INVISIBLE;
      }

      pItemPool = pItemPool.value.pNext;
    }
  }

  // If found, set item pool visibility...
  if (fFound) {
    SetItemPoolVisibilityOn(pHeadItemPool, INVISIBLE, fSetLocator);
  }

  return fFound;
}

function GetZLevelOfItemPoolGivenStructure(sGridNo: INT16, ubLevel: UINT8, pStructure: Pointer<STRUCTURE>): INT8 {
  let pItemPool: Pointer<ITEM_POOL>;

  if (pStructure == NULL) {
    return 0;
  }

  // OK, check if this struct contains items....
  if (GetItemPool(sGridNo, addressof(pItemPool), ubLevel) == TRUE) {
    return GetLargestZLevelOfItemPool(pItemPool);
  }
  return 0;
}

function GetLargestZLevelOfItemPool(pItemPool: Pointer<ITEM_POOL>): INT8 {
  // OK, loop through pools and get any height != 0........
  while (pItemPool != NULL) {
    if (pItemPool.value.bRenderZHeightAboveLevel > 0) {
      return pItemPool.value.bRenderZHeightAboveLevel;
    }

    pItemPool = pItemPool.value.pNext;
  }

  return 0;
}

function DoesItemPoolContainAllItemsOfHigherZLevel(pItemPool: Pointer<ITEM_POOL>): BOOLEAN {
  // LOOP THROUGH LIST TO FIND NODE WE WANT
  while (pItemPool != NULL) {
    if (pItemPool.value.bRenderZHeightAboveLevel == 0) {
      return FALSE;
    }

    pItemPool = pItemPool.value.pNext;
  }

  return TRUE;
}

function DoesItemPoolContainAllItemsOfZeroZLevel(pItemPool: Pointer<ITEM_POOL>): BOOLEAN {
  // LOOP THROUGH LIST TO FIND NODE WE WANT
  while (pItemPool != NULL) {
    if (pItemPool.value.bRenderZHeightAboveLevel != 0) {
      return FALSE;
    }

    pItemPool = pItemPool.value.pNext;
  }

  return TRUE;
}

function RemoveItemPool(sGridNo: INT16, ubLevel: UINT8): void {
  let pItemPool: Pointer<ITEM_POOL>;

  // Check for and existing pool on the object layer
  while (GetItemPool(sGridNo, addressof(pItemPool), ubLevel) == TRUE) {
    RemoveItemFromPool(sGridNo, pItemPool.value.iItemIndex, ubLevel);
  }
}

function RemoveAllUnburiedItems(sGridNo: INT16, ubLevel: UINT8): void {
  let pItemPool: Pointer<ITEM_POOL>;

  // Check for and existing pool on the object layer
  GetItemPool(sGridNo, addressof(pItemPool), ubLevel);

  while (pItemPool) {
    if (gWorldItems[pItemPool.value.iItemIndex].bVisible == BURIED) {
      pItemPool = pItemPool.value.pNext;
    } else {
      RemoveItemFromPool(sGridNo, pItemPool.value.iItemIndex, ubLevel);
      // get new start pointer
      GetItemPool(sGridNo, addressof(pItemPool), ubLevel);
    }
  }
}

function LoopLevelNodeForShowThroughFlag(pNode: Pointer<LEVELNODE>, sGridNo: INT16, ubLevel: UINT8): void {
  while (pNode != NULL) {
    if (pNode.value.uiFlags & LEVELNODE_ITEM) {
      if (ubLevel == 0) {
        // If we are in a room....
        // if ( IsRoofPresentAtGridno( sGridNo ) || gfCaves || gfBasement )
        { pNode.value.uiFlags |= LEVELNODE_SHOW_THROUGH; }
      } else {
        pNode.value.uiFlags |= LEVELNODE_SHOW_THROUGH;
      }

      if (gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS]) {
        pNode.value.uiFlags |= LEVELNODE_DYNAMIC;
      }
    }
    pNode = pNode.value.pNext;
  }
}

function HandleItemObscuredFlag(sGridNo: INT16, ubLevel: UINT8): void {
  let pNode: Pointer<LEVELNODE>;

  if (ubLevel == 0) {
    pNode = gpWorldLevelData[sGridNo].pStructHead;
    LoopLevelNodeForShowThroughFlag(pNode, sGridNo, ubLevel);
  } else {
    pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
    LoopLevelNodeForShowThroughFlag(pNode, sGridNo, ubLevel);
  }
}

function SetItemPoolVisibilityOn(pItemPool: Pointer<ITEM_POOL>, bAllGreaterThan: INT8, fSetLocator: BOOLEAN): BOOLEAN {
  let pItemPoolTemp: Pointer<ITEM_POOL>;
  let fAtLeastModified: BOOLEAN = FALSE;
  let fDeleted: BOOLEAN = FALSE;
  let bVisibleValue: INT8;
  // OBJECTTYPE *pObj;

  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != NULL) {
    bVisibleValue = gWorldItems[pItemPoolTemp.value.iItemIndex].bVisible;

    // Update each item...
    if (bVisibleValue != VISIBLE) {
      if (gWorldItems[pItemPoolTemp.value.iItemIndex].o.usItem == Enum225.ACTION_ITEM) {
        // NEVER MAKE VISIBLE!
        pItemPoolTemp = pItemPoolTemp.value.pNext;
        continue;
      }

      // If we have reached a visible value we should not modify, ignore...
      if (bVisibleValue >= bAllGreaterThan && gWorldItems[pItemPoolTemp.value.iItemIndex].o.usItem != Enum225.OWNERSHIP) {
        // Update the world value
        gWorldItems[pItemPoolTemp.value.iItemIndex].bVisible = VISIBLE;

        fAtLeastModified = TRUE;
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
        fDeleted = FALSE;
      } else {
        pItemPoolTemp = pItemPoolTemp.value.pNext;
      }
    } else {
      pItemPoolTemp = pItemPoolTemp.value.pNext;
    }
  }

  // If we didn;t find any that should be modified..
  if (!fAtLeastModified) {
    return FALSE;
  }

  // Update global pool bVisible to true ( if at least one is visible... )
  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != NULL) {
    pItemPoolTemp.value.bVisible = VISIBLE;

    pItemPoolTemp = pItemPoolTemp.value.pNext;
  }

  // Handle obscured flag...
  HandleItemObscuredFlag(pItemPool.value.sGridNo, pItemPool.value.ubLevel);

  if (fSetLocator) {
    SetItemPoolLocator(pItemPool);
  }

  return TRUE;
}

function SetItemPoolVisibilityHidden(pItemPool: Pointer<ITEM_POOL>): void {
  let pItemPoolTemp: Pointer<ITEM_POOL>;

  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != NULL) {
    // Update the world value
    gWorldItems[pItemPoolTemp.value.iItemIndex].bVisible = HIDDEN_IN_OBJECT;
    pItemPoolTemp.value.bVisible = HIDDEN_IN_OBJECT;

    pItemPoolTemp = pItemPoolTemp.value.pNext;
  }
}

// This determines the overall initial visibility of the pool...
// IF ANY are set to VISIBLE, MODIFY
function AdjustItemPoolVisibility(pItemPool: Pointer<ITEM_POOL>): void {
  let pItemPoolTemp: Pointer<ITEM_POOL>;
  let fAtLeastModified: BOOLEAN = FALSE;

  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != NULL) {
    // DEFAULT ITEM POOL TO INVISIBLE....
    pItemPoolTemp.value.bVisible = INVISIBLE;

    // Update each item...
    // If we have reached a visible value we should not modify, ignore...
    if (gWorldItems[pItemPoolTemp.value.iItemIndex].bVisible == VISIBLE) {
      fAtLeastModified = TRUE;
    }

    pItemPoolTemp = pItemPoolTemp.value.pNext;
  }

  // Handle obscured flag...
  HandleItemObscuredFlag(pItemPool.value.sGridNo, pItemPool.value.ubLevel);

  // If we didn;t find any that should be modified..
  if (!fAtLeastModified) {
    return;
  }

  // Update global pool bVisible to true ( if at least one is visible... )
  pItemPoolTemp = pItemPool;
  while (pItemPoolTemp != NULL) {
    pItemPoolTemp.value.bVisible = VISIBLE;

    pItemPoolTemp = pItemPoolTemp.value.pNext;
  }

  // Handle obscured flag...
  HandleItemObscuredFlag(pItemPool.value.sGridNo, pItemPool.value.ubLevel);
}

function RemoveItemFromPool(sGridNo: INT16, iItemIndex: INT32, ubLevel: UINT8): BOOLEAN {
  let pItemPool: Pointer<ITEM_POOL>;
  let pItemPoolTemp: Pointer<ITEM_POOL>;
  let fItemFound: BOOLEAN = FALSE;
  let pObject: Pointer<LEVELNODE>;

  // Check for and existing pool on the object layer
  if (GetItemPool(sGridNo, addressof(pItemPool), ubLevel)) {
    // REMOVE FROM LIST

    // LOOP THROUGH LIST TO FIND NODE WE WANT
    pItemPoolTemp = pItemPool;
    while (pItemPoolTemp != NULL) {
      if (pItemPoolTemp.value.iItemIndex == iItemIndex) {
        fItemFound = TRUE;
        break;
      }
      pItemPoolTemp = pItemPoolTemp.value.pNext;
    }

    if (!fItemFound) {
      // COULDNOT FIND ITEM? MAYBE SOMEBODY GOT IT BEFORE WE GOT THERE!
      return FALSE;
    }

    // REMOVE GRAPHIC
    RemoveItemGraphicFromWorld(addressof(Item[gWorldItems[iItemIndex].o.usItem]), sGridNo, ubLevel, pItemPoolTemp.value.pLevelNode);

    // IF WE ARE LOCATIONG STILL, KILL LOCATOR!
    if (pItemPoolTemp.value.bFlashColor != 0) {
      // REMOVE TIMER!
      RemoveFlashItemSlot(pItemPoolTemp);
    }

    // REMOVE PREV
    if (pItemPoolTemp.value.pPrev != NULL) {
      pItemPoolTemp.value.pPrev.value.pNext = pItemPoolTemp.value.pNext;
    }

    // REMOVE NEXT
    if (pItemPoolTemp.value.pNext != NULL) {
      pItemPoolTemp.value.pNext.value.pPrev = pItemPoolTemp.value.pPrev;
    }

    // IF THIS NODE WAS THE HEAD, SET ANOTHER AS HEAD AT THIS GRIDNO
    if (pItemPoolTemp.value.pPrev == NULL) {
      // WE'RE HEAD
      if (ubLevel == 0) {
        pObject = gpWorldLevelData[sGridNo].pStructHead;
      } else {
        pObject = gpWorldLevelData[sGridNo].pOnRoofHead;
      }

      fItemFound = FALSE;
      // LOOP THORUGH OBJECT LAYER
      while (pObject != NULL) {
        if (pObject.value.uiFlags & LEVELNODE_ITEM) {
          // ADJUST TO NEXT GUY FOR HEAD
          pObject.value.pItemPool = pItemPoolTemp.value.pNext;
          fItemFound = TRUE;
        }
        pObject = pObject.value.pNext;
      }

      if (!fItemFound) {
        // THIS WAS THE LAST ITEM IN THE POOL!
        gpWorldLevelData[sGridNo].uiFlags &= ~(MAPELEMENT_ITEMPOOL_PRESENT);
      }
    }

    // Find any structure with flag set as having items on top.. if this one did...
    if (pItemPoolTemp.value.bRenderZHeightAboveLevel > 0) {
      let pStructure: Pointer<STRUCTURE>;
      let pTempPool: Pointer<ITEM_POOL>;

      // Check if an item pool exists here....
      if (!GetItemPool(pItemPoolTemp.value.sGridNo, addressof(pTempPool), pItemPoolTemp.value.ubLevel)) {
        pStructure = FindStructure(pItemPoolTemp.value.sGridNo, STRUCTURE_HASITEMONTOP);

        if (pStructure != NULL) {
          // Remove...
          pStructure.value.fFlags &= (~STRUCTURE_HASITEMONTOP);

          // Re-adjust interactive tile...
          BeginCurInteractiveTileCheck(INTILE_CHECK_SELECTIVE);
        }
      }
    }

    AdjustItemPoolVisibility(pItemPoolTemp);

    // DELETE
    MemFree(pItemPoolTemp);

    RemoveItemFromWorld(iItemIndex);

    return TRUE;
  }

  return FALSE;
}

function MoveItemPools(sStartPos: INT16, sEndPos: INT16): BOOLEAN {
  // note, only works between locations on the ground
  let pItemPool: Pointer<ITEM_POOL>;
  let TempWorldItem: WORLDITEM;

  // While there is an existing pool
  while (GetItemPool(sStartPos, addressof(pItemPool), 0)) {
    memcpy(addressof(TempWorldItem), addressof(gWorldItems[pItemPool.value.iItemIndex]), sizeof(WORLDITEM));
    RemoveItemFromPool(sStartPos, pItemPool.value.iItemIndex, 0);
    AddItemToPool(sEndPos, addressof(TempWorldItem.o), -1, TempWorldItem.ubLevel, TempWorldItem.usFlags, TempWorldItem.bRenderZHeightAboveLevel);
  }
  return TRUE;
}

function GetItemPool(usMapPos: UINT16, ppItemPool: Pointer<Pointer<ITEM_POOL>>, ubLevel: UINT8): BOOLEAN {
  let pObject: Pointer<LEVELNODE>;

  if (ubLevel == 0) {
    pObject = gpWorldLevelData[usMapPos].pStructHead;
  } else {
    pObject = gpWorldLevelData[usMapPos].pOnRoofHead;
  }

  (ppItemPool.value) = NULL;

  // LOOP THORUGH OBJECT LAYER
  while (pObject != NULL) {
    if (pObject.value.uiFlags & LEVELNODE_ITEM) {
      (ppItemPool.value) = pObject.value.pItemPool;

      // DEF added the check because pObject->pItemPool was NULL which was causing problems
      if (ppItemPool.value)
        return TRUE;
      else
        return FALSE;
    }

    pObject = pObject.value.pNext;
  }

  return FALSE;
}

function NotifySoldiersToLookforItems(): void {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    if (pSoldier != NULL) {
      pSoldier.value.uiStatusFlags |= SOLDIER_LOOKFOR_ITEMS;
    }
  }
}

function AllSoldiersLookforItems(fShowLocators: BOOLEAN): void {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    pSoldier = MercSlots[cnt];

    if (pSoldier != NULL) {
      RevealRoofsAndItems(pSoldier, TRUE, fShowLocators, pSoldier.value.bLevel, FALSE);
    }
  }
}

function GetNumOkForDisplayItemsInPool(pItemPool: Pointer<ITEM_POOL>, bZLevel: INT8): INT16 {
  let cnt: INT32;

  // Determine total #
  cnt = 0;
  while (pItemPool != NULL) {
    if (ItemPoolOKForDisplay(pItemPool, bZLevel)) {
      cnt++;
    }

    pItemPool = pItemPool.value.pNext;
  }

  return cnt;
}

function AnyItemsVisibleOnLevel(pItemPool: Pointer<ITEM_POOL>, bZLevel: INT8): BOOLEAN {
  if ((gTacticalStatus.uiFlags & SHOW_ALL_ITEMS)) {
    return TRUE;
  }

  // Determine total #
  while (pItemPool != NULL) {
    if (pItemPool.value.bRenderZHeightAboveLevel == bZLevel) {
      if (gWorldItems[pItemPool.value.iItemIndex].bVisible == VISIBLE) {
        return TRUE;
      }
    }

    pItemPool = pItemPool.value.pNext;
  }

  return FALSE;
}

function ItemPoolOKForDisplay(pItemPool: Pointer<ITEM_POOL>, bZLevel: INT8): BOOLEAN {
  if (gTacticalStatus.uiFlags & SHOW_ALL_ITEMS) {
    return TRUE;
  }

  // Setup some conditions!
  if (gWorldItems[pItemPool.value.iItemIndex].bVisible != VISIBLE) {
    return FALSE;
  }

  // If -1, it means find all
  if (pItemPool.value.bRenderZHeightAboveLevel != bZLevel && bZLevel != -1) {
    return FALSE;
  }

  return TRUE;
}

function ItemPoolOKForPickup(pSoldier: Pointer<SOLDIERTYPE>, pItemPool: Pointer<ITEM_POOL>, bZLevel: INT8): BOOLEAN {
  if (gTacticalStatus.uiFlags & SHOW_ALL_ITEMS) {
    return TRUE;
  }

  if (pSoldier.value.bTeam == gbPlayerNum) {
    // Setup some conditions!
    if (gWorldItems[pItemPool.value.iItemIndex].bVisible != VISIBLE) {
      return FALSE;
    }
  }

  // If -1, it means find all
  if (pItemPool.value.bRenderZHeightAboveLevel != bZLevel && bZLevel != -1) {
    return FALSE;
  }

  return TRUE;
}

function DrawItemPoolList(pItemPool: Pointer<ITEM_POOL>, sGridNo: INT16, bCommand: UINT8, bZLevel: INT8, sXPos: INT16, sYPos: INT16): BOOLEAN {
  let sY: INT16;
  let pItem: Pointer<INVTYPE>;
  let pTempItemPool: Pointer<ITEM_POOL>;
  let pStr: INT16[] /* [100] */;
  let cnt: INT16 = 0;
  let sHeight: INT16 = 0;
  let sLargeLineWidth: INT16 = 0;
  let sLineWidth: INT16;
  let fRecalcNumListed: BOOLEAN = FALSE;
  let fSelectionDone: BOOLEAN = FALSE;

  let gbCurrentItemSel: INT8 = 0;
  let bNumItemsListed: INT8 = 0;
  let sFontX: INT16;
  let sFontY: INT16;
  let sLargestLineWidth: INT16 = 30;
  let bCurStart: INT8 = 0;
  let fDoBack: BOOLEAN;

  // Take a look at each guy in current sqaud and check for compatible ammo...

  // Determine how many there are
  // MOVE HEAD TO CURRENT START
  cnt = 0;
  pTempItemPool = pItemPool;
  while (pTempItemPool != NULL) {
    if (cnt == bCurStart) {
      break;
    }

    // ATE: Put some conditions on this....
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      cnt++;
    }

    pTempItemPool = pTempItemPool.value.pNext;
  }

  cnt = bCurStart;
  fDoBack = FALSE;
  while (pTempItemPool != NULL) {
    // IF WE HAVE MORE THAN THE SET AMOUNT, QUIT NOW!
    if (cnt == (bCurStart + NUM_ITEMS_LISTED)) {
      cnt++;
      fDoBack = TRUE;
      break;
    }

    // ATE: Put some conditions on this....
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      cnt++;
    }

    sHeight += GetFontHeight(SMALLFONT1()) - 2;

    pTempItemPool = pTempItemPool.value.pNext;
  }

  pTempItemPool = pItemPool;
  while (pTempItemPool != NULL) {
    // ATE: Put some conditions on this....
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      HandleAnyMercInSquadHasCompatibleStuff(CurrentSquad(), addressof(gWorldItems[pTempItemPool.value.iItemIndex].o), FALSE);
    }

    pTempItemPool = pTempItemPool.value.pNext;
  }

  // IF COUNT IS ALREADY > MAX, ADD A PREV...
  if (bCurStart >= NUM_ITEMS_LISTED) {
    cnt++;
  }

  bNumItemsListed = cnt;

  // RENDER LIST!
  // Determine max length
  pTempItemPool = pItemPool;
  while (pTempItemPool != NULL) {
    if (ItemPoolOKForDisplay(pTempItemPool, bZLevel)) {
      // GET ITEM
      pItem = addressof(Item[gWorldItems[pTempItemPool.value.iItemIndex].o.usItem]);
      // Set string
      if (gWorldItems[pTempItemPool.value.iItemIndex].o.ubNumberOfObjects > 1) {
        swprintf(pStr, "%s (%d)", ShortItemNames[gWorldItems[pTempItemPool.value.iItemIndex].o.usItem], gWorldItems[pTempItemPool.value.iItemIndex].o.ubNumberOfObjects);
      } else {
        swprintf(pStr, "%s", ShortItemNames[gWorldItems[pTempItemPool.value.iItemIndex].o.usItem]);
      }

      // Get Width
      sLineWidth = StringPixLength(pStr, SMALLFONT1());

      if (sLineWidth > sLargeLineWidth) {
        sLargeLineWidth = sLineWidth;
      }
      sLargestLineWidth = sLargeLineWidth;
    }
    pTempItemPool = pTempItemPool.value.pNext;
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
  while (pItemPool != NULL) {
    if (cnt == bCurStart) {
      break;
    }

    if (ItemPoolOKForDisplay(pItemPool, bZLevel)) {
      cnt++;
    }

    pItemPool = pItemPool.value.pNext;
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
    swprintf(pStr, TacticalStr[Enum335.ITEMPOOL_POPUP_PREV_STR]);
    gprintfdirty(sFontX, sY, pStr);
    mprintf(sFontX, sY, pStr);
    sY += GetFontHeight(SMALLFONT1()) - 2;
    cnt++;
  }

  while (pItemPool != NULL) {
    if (bCommand == ITEMLIST_HANDLE) {
      if (cnt == gbCurrentItemSel) {
        SetFontForeground(FONT_MCOLOR_LTGRAY);
      } else {
        SetFontForeground(FONT_MCOLOR_DKGRAY);
      }
    }

    if (ItemPoolOKForDisplay(pItemPool, bZLevel)) {
      // GET ITEM
      pItem = addressof(Item[gWorldItems[pItemPool.value.iItemIndex].o.usItem]);
      // Set string

      if (gWorldItems[pItemPool.value.iItemIndex].o.ubNumberOfObjects > 1) {
        swprintf(pStr, "%s (%d)", ShortItemNames[gWorldItems[pItemPool.value.iItemIndex].o.usItem], gWorldItems[pItemPool.value.iItemIndex].o.ubNumberOfObjects);
      } else {
        swprintf(pStr, "%s", ShortItemNames[gWorldItems[pItemPool.value.iItemIndex].o.usItem]);
      }

      gprintfdirty(sFontX, sY, pStr);
      mprintf(sFontX, sY, pStr);

      sY += GetFontHeight(SMALLFONT1()) - 2;
      cnt++;
    }
    pItemPool = pItemPool.value.pNext;

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
      swprintf(pStr, TacticalStr[Enum335.ITEMPOOL_POPUP_MORE_STR]);
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

function SetItemPoolLocator(pItemPool: Pointer<ITEM_POOL>): void {
  pItemPool.value.bFlashColor = 59;

  pItemPool.value.uiTimerID = AddFlashItemSlot(pItemPool, NULL, 0);
}

function SetItemPoolLocatorWithCallback(pItemPool: Pointer<ITEM_POOL>, Callback: ITEM_POOL_LOCATOR_HOOK): void {
  pItemPool.value.bFlashColor = 59;

  pItemPool.value.uiTimerID = AddFlashItemSlot(pItemPool, Callback, 0);
}

/// ITEM POOL INDICATOR FUNCTIONS

function GetFreeFlashItemSlot(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumFlashItemSlots; uiCount++) {
    if ((FlashItemSlots[uiCount].fAllocated == FALSE))
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

function AddFlashItemSlot(pItemPool: Pointer<ITEM_POOL>, Callback: ITEM_POOL_LOCATOR_HOOK, ubFlags: UINT8): INT32 {
  let iFlashItemIndex: INT32;

  if ((iFlashItemIndex = GetFreeFlashItemSlot()) == (-1))
    return -1;

  ubFlags |= ITEM_LOCATOR_LOCKED;

  FlashItemSlots[iFlashItemIndex].pItemPool = pItemPool;

  FlashItemSlots[iFlashItemIndex].bRadioFrame = 0;
  FlashItemSlots[iFlashItemIndex].uiLastFrameUpdate = GetJA2Clock();
  FlashItemSlots[iFlashItemIndex].Callback = Callback;
  FlashItemSlots[iFlashItemIndex].fAllocated = TRUE;
  FlashItemSlots[iFlashItemIndex].ubFlags = ubFlags;

  return iFlashItemIndex;
}

function RemoveFlashItemSlot(pItemPool: Pointer<ITEM_POOL>): BOOLEAN {
  let uiCount: UINT32;

  CHECKF(pItemPool != NULL);

  for (uiCount = 0; uiCount < guiNumFlashItemSlots; uiCount++) {
    if (FlashItemSlots[uiCount].fAllocated) {
      if (FlashItemSlots[uiCount].pItemPool == pItemPool) {
        FlashItemSlots[uiCount].fAllocated = FALSE;

        // Check if we have a callback and call it if so!
        if (FlashItemSlots[uiCount].Callback != NULL) {
          FlashItemSlots[uiCount].Callback();
        }

        return TRUE;
      }
    }
  }

  return TRUE;
}

function HandleFlashingItems(): void {
  let cnt: UINT32;
  let pItemPool: Pointer<ITEM_POOL>;
  let pObject: Pointer<LEVELNODE>;
  let pLocator: Pointer<ITEM_POOL_LOCATOR>;
  let fDoLocator: BOOLEAN = FALSE;

  if (COUNTERDONE(Enum386.CYCLERENDERITEMCOLOR)) {
    RESETCOUNTER(Enum386.CYCLERENDERITEMCOLOR);

    for (cnt = 0; cnt < guiNumFlashItemSlots; cnt++) {
      pLocator = addressof(FlashItemSlots[cnt]);

      if (pLocator.value.fAllocated) {
        fDoLocator = TRUE;

        if ((pLocator.value.ubFlags & ITEM_LOCATOR_LOCKED)) {
          if (gTacticalStatus.fLockItemLocators == FALSE) {
            // Turn off!
            pLocator.value.ubFlags &= (~ITEM_LOCATOR_LOCKED);
          } else {
            fDoLocator = FALSE;
          }
        }

        if (fDoLocator) {
          pItemPool = pLocator.value.pItemPool;

          // Update radio locator
          {
            let uiClock: UINT32;

            uiClock = GetJA2Clock();

            // Update frame values!
            if ((uiClock - pLocator.value.uiLastFrameUpdate) > 80) {
              pLocator.value.uiLastFrameUpdate = uiClock;

              // Update frame
              pLocator.value.bRadioFrame++;

              if (pLocator.value.bRadioFrame == 5) {
                pLocator.value.bRadioFrame = 0;
              }
            }
          }

          // UPDATE FLASH COLOR VALUE
          pItemPool.value.bFlashColor--;

          if (pItemPool.value.ubLevel == 0) {
            pObject = gpWorldLevelData[pItemPool.value.sGridNo].pStructHead;
          } else {
            pObject = gpWorldLevelData[pItemPool.value.sGridNo].pOnRoofHead;
          }

          // LOOP THORUGH OBJECT LAYER
          while (pObject != NULL) {
            if (pObject.value.uiFlags & LEVELNODE_ITEM) {
              if (pItemPool.value.bFlashColor == 1) {
                // pObject->uiFlags &= (~LEVELNODE_DYNAMIC);
                // pObject->uiFlags |= ( LEVELNODE_LASTDYNAMIC  );
              } else {
                // pObject->uiFlags |= LEVELNODE_DYNAMIC;
              }
            }

            pObject = pObject.value.pNext;
          }

          if (pItemPool.value.bFlashColor == 1) {
            pItemPool.value.bFlashColor = 0;

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

function RenderTopmostFlashingItems(): void {
  let cnt: UINT32;
  let pItemPool: Pointer<ITEM_POOL>;
  let pLocator: Pointer<ITEM_POOL_LOCATOR>;

  for (cnt = 0; cnt < guiNumFlashItemSlots; cnt++) {
    pLocator = addressof(FlashItemSlots[cnt]);

    if (pLocator.value.fAllocated) {
      if (!(pLocator.value.ubFlags & (ITEM_LOCATOR_LOCKED))) {
        pItemPool = pLocator.value.pItemPool;

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

          ConvertGridNoToCenterCellXY(pItemPool.value.sGridNo, addressof(sX), addressof(sY));

          dOffsetX = (sX - gsRenderCenterX);
          dOffsetY = (sY - gsRenderCenterY);

          // Calculate guy's position
          FloatFromCellToScreenCoordinates(dOffsetX, dOffsetY, addressof(dTempX_S), addressof(dTempY_S));

          sXPos = ((gsVIEWPORT_END_X - gsVIEWPORT_START_X) / 2) + dTempX_S;
          sYPos = ((gsVIEWPORT_END_Y - gsVIEWPORT_START_Y) / 2) + dTempY_S - gpWorldLevelData[pItemPool.value.sGridNo].sHeight;

          // Adjust for offset position on screen
          sXPos -= gsRenderWorldOffsetX;
          sYPos -= gsRenderWorldOffsetY;
          sYPos -= pItemPool.value.bRenderZHeightAboveLevel;

          // Adjust for render height
          sYPos += gsRenderHeight;

          // Adjust for level height
          if (pItemPool.value.ubLevel) {
            sYPos -= ROOF_LEVEL_HEIGHT;
          }

          // Center circle!
          sXPos -= 20;
          sYPos -= 20;

          iBack = RegisterBackgroundRect(BGND_FLAG_SINGLE, NULL, sXPos, sYPos, (sXPos + 40), (sYPos + 40));
          if (iBack != -1) {
            SetBackgroundRectFilled(iBack);
          }

          BltVideoObjectFromIndex(FRAME_BUFFER, guiRADIO, pLocator.value.bRadioFrame, sXPos, sYPos, VO_BLT_SRCTRANSPARENCY, NULL);

          DrawItemPoolList(pItemPool, pItemPool.value.sGridNo, ITEMLIST_DISPLAY, pItemPool.value.bRenderZHeightAboveLevel, sXPos, sYPos);
        }
      }
    }
  }
}

function VerifyGiveItem(pSoldier: Pointer<SOLDIERTYPE>, ppTargetSoldier: Pointer<Pointer<SOLDIERTYPE>>): BOOLEAN {
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let usSoldierIndex: UINT16;
  let pObject: Pointer<OBJECTTYPE>;

  let sGridNo: INT16;
  let ubDirection: UINT8;
  let ubTargetMercID: UINT8;

  // DO SOME CHECKS IF WE CAN DO ANIMATION.....

  // Get items from pending data
  pObject = pSoldier.value.pTempObject;

  sGridNo = pSoldier.value.sPendingActionData2;
  ubDirection = pSoldier.value.bPendingActionData3;
  ubTargetMercID = pSoldier.value.uiPendingActionData4;

  usSoldierIndex = WhoIsThere2(sGridNo, pSoldier.value.bLevel);

  // See if our target is still available
  if (usSoldierIndex != NOBODY) {
    // Check if it's the same merc!
    if (usSoldierIndex != ubTargetMercID) {
      return FALSE;
    }

    // Get soldier
    GetSoldier(addressof(pTSoldier), usSoldierIndex);

    // Look for item in hand....

    (ppTargetSoldier.value) = pTSoldier;

    return TRUE;
  } else {
    if (pSoldier.value.pTempObject != NULL) {
      AddItemToPool(pSoldier.value.sGridNo, pSoldier.value.pTempObject, 1, pSoldier.value.bLevel, 0, -1);

      // Place it on the ground!
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.ITEM_HAS_BEEN_PLACED_ON_GROUND_STR], ShortItemNames[pSoldier.value.pTempObject.value.usItem]);

      // OK, disengage buddy
      pSoldier.value.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);

      if (ubTargetMercID != NOBODY) {
        MercPtrs[ubTargetMercID].value.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
      }

      MemFree(pSoldier.value.pTempObject);
      pSoldier.value.pTempObject = NULL;
    }
  }

  return FALSE;
}

function SoldierGiveItemFromAnimation(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pTSoldier: Pointer<SOLDIERTYPE>;
  let bInvPos: INT8;
  let TempObject: OBJECTTYPE;
  let ubProfile: UINT8;

  let sGridNo: INT16;
  let ubDirection: UINT8;
  let ubTargetMercID: UINT8;
  let usItemNum: UINT16;
  let fToTargetPlayer: BOOLEAN = FALSE;

  // Get items from pending data

  // Get objectype and delete
  memcpy(addressof(TempObject), pSoldier.value.pTempObject, sizeof(OBJECTTYPE));
  MemFree(pSoldier.value.pTempObject);
  pSoldier.value.pTempObject = NULL;

  bInvPos = pSoldier.value.bPendingActionData5;
  usItemNum = TempObject.usItem;

  // ATE: OK, check if we have an item in the cursor from
  // this soldier and from this inv slot, if so, delete!!!!!!!
  if (gpItemPointer != NULL) {
    if (pSoldier.value.ubID == gpItemPointerSoldier.value.ubID) {
      if (bInvPos == gbItemPointerSrcSlot && usItemNum == gpItemPointer.value.usItem) {
        // Remove!!!
        EndItemPointer();
      }
    }
  }

  sGridNo = pSoldier.value.sPendingActionData2;
  ubDirection = pSoldier.value.bPendingActionData3;
  ubTargetMercID = pSoldier.value.uiPendingActionData4;

  // ATE: Deduct APs!
  DeductPoints(pSoldier, AP_PICKUP_ITEM, 0);

  if (VerifyGiveItem(pSoldier, addressof(pTSoldier))) {
    // DAVE! - put stuff here to bring up shopkeeper.......

    // if the user just clicked on an arms dealer
    if (IsMercADealer(pTSoldier.value.ubProfile)) {
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

      if (NPCHasUnusedRecordWithGivenApproach(pTSoldier.value.ubProfile, Enum296.APPROACH_BUYSELL)) {
        TriggerNPCWithGivenApproach(pTSoldier.value.ubProfile, Enum296.APPROACH_BUYSELL, TRUE);
        return;
      }
      // now also check for buy/sell lines (Oct 13)
      /*
      else if ( NPCWillingToAcceptItem( pTSoldier->ubProfile, pSoldier->ubProfile, &TempObject ) )
      {
              TriggerNPCWithGivenApproach( pTSoldier->ubProfile, APPROACH_GIVINGITEM, TRUE );
              return;
      }*/
      else if (!NPCWillingToAcceptItem(pTSoldier.value.ubProfile, pSoldier.value.ubProfile, addressof(TempObject))) {
        // Enter the shopkeeper interface
        EnterShopKeeperInterfaceScreen(pTSoldier.value.ubProfile);

        // removed the if, because if the player picked up an item straight from the ground or money strait from the money
        // interface, the item would NOT have a bInvPos, therefore it would not get added to the dealer, and would get deleted
        //				if ( bInvPos != NO_SLOT )
        {
          // MUST send in NO_SLOT, as the SKI wille expect it to exist in inv if not....
          AddItemToPlayersOfferAreaAfterShopKeeperOpen(addressof(TempObject), NO_SLOT);

          /*
          Changed because if the player gave 1 item from a pile, the rest of the items in the piule would disappear
                                                  // OK, r	emove the item, as the SKI will give it back once done
                                                  DeleteObj( &( pSoldier->inv[ bInvPos ] ) );
          */

          if (bInvPos != NO_SLOT) {
            RemoveObjFrom(addressof(pSoldier.value.inv[bInvPos]), TempObject.ubNumberOfObjects);
          }

          DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
        }

        return;
      }
    }

    // OK< FOR NOW HANDLE NPC's DIFFERENT!
    ubProfile = pTSoldier.value.ubProfile;

    // 1 ) PLayer to NPC = NPC
    // 2 ) Player to player = player;
    // 3 ) NPC to player = player;
    // 4 ) NPC TO NPC = NPC

    // Switch on target...
    // Are we a player dude.. ( target? )
    if (ubProfile < FIRST_RPC || RPC_RECRUITED(pTSoldier)) {
      fToTargetPlayer = TRUE;
    }

    if (fToTargetPlayer) {
      // begin giving
      DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);

      // We are a merc, add!
      if (!AutoPlaceObject(pTSoldier, addressof(TempObject), TRUE)) {
        // Erase!
        if (bInvPos != NO_SLOT) {
          DeleteObj(addressof(pSoldier.value.inv[bInvPos]));
          DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
        }

        AddItemToPool(pSoldier.value.sGridNo, addressof(TempObject), 1, pSoldier.value.bLevel, 0, -1);

        // We could not place it!
        // Drop it on the ground?
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.ITEM_HAS_BEEN_PLACED_ON_GROUND_STR], ShortItemNames[usItemNum]);

        // OK, disengage buddy
        pSoldier.value.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
        pTSoldier.value.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
      } else {
        // Erase!
        if (bInvPos != NO_SLOT) {
          DeleteObj(addressof(pSoldier.value.inv[bInvPos]));
          DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
        }

        // OK, it's given, display message!
        ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.ITEM_HAS_BEEN_GIVEN_TO_STR], ShortItemNames[usItemNum], pTSoldier.value.name);
        if (usItemNum == Enum225.MONEY) {
          // are we giving money to an NPC, to whom we owe money?
          if (pTSoldier.value.ubProfile != NO_PROFILE && gMercProfiles[pTSoldier.value.ubProfile].iBalance < 0) {
            gMercProfiles[pTSoldier.value.ubProfile].iBalance += TempObject.uiMoneyAmount;
            if (gMercProfiles[pTSoldier.value.ubProfile].iBalance >= 0) {
              // don't let the player accumulate credit (?)
              gMercProfiles[pTSoldier.value.ubProfile].iBalance = 0;

              // report the payment and set facts to indicate people not being owed money
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.GUY_HAS_BEEN_PAID_IN_FULL_STR], pTSoldier.value.name);
            } else {
              // report the payment
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.GUY_STILL_OWED_STR], pTSoldier.value.name, -gMercProfiles[pTSoldier.value.ubProfile].iBalance);
            }
          }
        }
      }
    } else {
      // Erase!
      if (bInvPos != NO_SLOT) {
        RemoveObjs(addressof(pSoldier.value.inv[bInvPos]), TempObject.ubNumberOfObjects);
        DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
      }

      // Now intiate conv
      InitiateConversation(pTSoldier, pSoldier, Enum296.APPROACH_GIVINGITEM, addressof(TempObject));
    }
  }

  // OK, disengage buddy
  pSoldier.value.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
  pTSoldier.value.uiStatusFlags &= (~SOLDIER_ENGAGEDINACTION);
}

function AdjustGridNoForItemPlacement(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): INT16 {
  let pStructure: Pointer<STRUCTURE>;
  let sDesiredLevel: INT16;
  let sActionGridNo: INT16;
  let fStructFound: BOOLEAN = FALSE;
  let ubDirection: UINT8;
  let sAdjustedGridNo: INT16;
  let ubTargetID: UINT8;

  sActionGridNo = sGridNo;

  // Check structure database
  if (gpWorldLevelData[sGridNo].pStructureHead) {
    // Something is here, check obstruction in future
    sDesiredLevel = pSoldier.value.bLevel ? STRUCTURE_ON_ROOF : STRUCTURE_ON_GROUND;
    pStructure = FindStructure(sGridNo, STRUCTURE_BLOCKSMOVES);
    while (pStructure) {
      if (!(pStructure.value.fFlags & STRUCTURE_PASSABLE) && pStructure.value.sCubeOffset == sDesiredLevel) {
        // Check for openable flag....
        // if ( pStructure->fFlags & ( STRUCTURE_OPENABLE | STRUCTURE_HASITEMONTOP ) )
        {
          fStructFound = TRUE;
          break;
        }
      }
      pStructure = FindNextStructure(pStructure, STRUCTURE_BLOCKSMOVES);
    }
  }

  // ATE: IF a person is found, use adjacent gridno for it!
  ubTargetID = WhoIsThere2(sGridNo, pSoldier.value.bLevel);

  if (fStructFound || (ubTargetID != NOBODY && ubTargetID != pSoldier.value.ubID)) {
    // GET ADJACENT GRIDNO
    sActionGridNo = FindAdjacentGridEx(pSoldier, sGridNo, addressof(ubDirection), addressof(sAdjustedGridNo), FALSE, FALSE);

    if (sActionGridNo == -1) {
      sActionGridNo = sAdjustedGridNo;
    }
  }

  return sActionGridNo;
}

function StartBombMessageBox(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  let ubRoom: UINT8;

  gpTempSoldier = pSoldier;
  gsTempGridno = sGridNo;
  if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.REMOTEBOMBTRIGGER) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_SMALL_BUTTONS, TacticalStr[Enum335.CHOOSE_BOMB_FREQUENCY_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS, BombMessageBoxCallBack, NULL);
  } else if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.REMOTETRIGGER) {
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
      if (InARoom(pSoldier.value.sGridNo, addressof(ubRoom)) && ubRoom == 4) {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_OK1);

        // Open statue
        ChangeO3SectorStatue(FALSE);
      } else {
        DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
      }
    } else {
      DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
    }
  } else if (FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.DETONATOR) != ITEM_NOT_FOUND) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_SMALL_BUTTONS, TacticalStr[Enum335.CHOOSE_TIMER_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS, BombMessageBoxCallBack, NULL);
  } else if (FindAttachment(addressof(pSoldier.value.inv[Enum261.HANDPOS]), Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_SMALL_BUTTONS, TacticalStr[Enum335.CHOOSE_REMOTE_FREQUENCY_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_FOUR_NUMBERED_BUTTONS, BombMessageBoxCallBack, NULL);
  }
}

function BombMessageBoxCallBack(ubExitValue: UINT8): void {
  if (gpTempSoldier) {
    if (gpTempSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.REMOTEBOMBTRIGGER) {
      SetOffBombsByFrequency(gpTempSoldier.value.ubID, ubExitValue);
    } else {
      let iResult: INT32;

      if (FindAttachment(addressof(gpTempSoldier.value.inv[Enum261.HANDPOS]), Enum225.REMDETONATOR) != ITEM_NOT_FOUND) {
        iResult = SkillCheck(gpTempSoldier, Enum255.PLANTING_REMOTE_BOMB_CHECK, 0);
      } else {
        iResult = SkillCheck(gpTempSoldier, Enum255.PLANTING_BOMB_CHECK, 0);
      }

      if (iResult >= 0) {
        // EXPLOSIVES GAIN (25):  Place a bomb, or buried and armed a mine
        StatChange(gpTempSoldier, EXPLODEAMT, 25, FALSE);
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
          IgniteExplosion(NOBODY, gpTempSoldier.value.sX, gpTempSoldier.value.sY, (gpWorldLevelData[gpTempSoldier.value.sGridNo].sHeight), gpTempSoldier.value.sGridNo, gpTempSoldier.value.inv[Enum261.HANDPOS].usItem, gpTempSoldier.value.bLevel);
          return;
        }
      }

      if (ArmBomb(addressof(gpTempSoldier.value.inv[Enum261.HANDPOS]), ubExitValue)) {
        gpTempSoldier.value.inv[Enum261.HANDPOS].bTrap = __min(10, (EffectiveExplosive(gpTempSoldier) / 20) + (EffectiveExpLevel(gpTempSoldier) / 3));
        // HACK IMMINENT!
        // value of 1 is stored in maps for SIDE of bomb owner... when we want to use IDs!
        // so we add 2 to all owner IDs passed through here and subtract 2 later
        gpTempSoldier.value.inv[Enum261.HANDPOS].ubBombOwner = gpTempSoldier.value.ubID + 2;
        AddItemToPool(gsTempGridno, addressof(gpTempSoldier.value.inv[Enum261.HANDPOS]), 1, gpTempSoldier.value.bLevel, WORLD_ITEM_ARMED_BOMB, 0);
        DeleteObj(addressof(gpTempSoldier.value.inv[Enum261.HANDPOS]));
      }
    }
  }
}

function HandItemWorks(pSoldier: Pointer<SOLDIERTYPE>, bSlot: INT8): BOOLEAN {
  let fItemJustBroke: BOOLEAN = FALSE;
  let fItemWorks: BOOLEAN = TRUE;
  let pObj: Pointer<OBJECTTYPE>;

  pObj = addressof(pSoldier.value.inv[bSlot]);

  // if the item can be damaged, than we must check that it's in good enough
  // shape to be usable, and doesn't break during use.
  // Exception: land mines.  You can bury them broken, they just won't blow!
  if ((Item[pObj.value.usItem].fFlags & ITEM_DAMAGEABLE) && (pObj.value.usItem != Enum225.MINE) && (Item[pObj.value.usItem].usItemClass != IC_MEDKIT) && pObj.value.usItem != Enum225.GAS_CAN) {
    // if it's still usable, check whether it breaks
    if (pObj.value.bStatus[0] >= USABLE) {
      // if a dice roll is greater than the item's status
      if ((Random(80) + 20) >= (pObj.value.bStatus[0] + 50)) {
        fItemJustBroke = TRUE;
        fItemWorks = FALSE;

        // item breaks, and becomes unusable...  so its status is reduced
        // to somewhere between 1 and the 1 less than USABLE
        pObj.value.bStatus[0] = (1 + Random(USABLE - 1));
      }
    } else // it's already unusable
    {
      fItemWorks = FALSE;
    }

    if (!fItemWorks && pSoldier.value.bTeam == gbPlayerNum) {
      // merc says "This thing doesn't work!"
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_USELESS_ITEM);
      if (fItemJustBroke) {
        DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
      }
    }
  }

  if (fItemWorks && bSlot == Enum261.HANDPOS && Item[pObj.value.usItem].usItemClass == IC_GUN) {
    // are we using two guns at once?
    if (Item[pSoldier.value.inv[Enum261.SECONDHANDPOS].usItem].usItemClass == IC_GUN && pSoldier.value.inv[Enum261.SECONDHANDPOS].bGunStatus >= USABLE && pSoldier.value.inv[Enum261.SECONDHANDPOS].ubGunShotsLeft > 0) {
      // check the second gun for breakage, and if IT breaks, return false
      return HandItemWorks(pSoldier, Enum261.SECONDHANDPOS);
    }
  }

  return fItemWorks;
}

function SetOffBoobyTrapInMapScreen(pSoldier: Pointer<SOLDIERTYPE>, pObject: Pointer<OBJECTTYPE>): void {
  let ubPtsDmg: UINT8 = 0;

  // check if trapped item is an explosive, if so then up the amount of dmg
  if ((pObject.value.usItem == Enum225.TNT) || (pObject.value.usItem == Enum225.RDX)) {
    // for explosive
    ubPtsDmg = 0;
  } else {
    // normal mini grenade dmg
    ubPtsDmg = 0;
  }

  // injure the inventory character
  SoldierTakeDamage(pSoldier, 0, ubPtsDmg, ubPtsDmg, TAKE_DAMAGE_EXPLOSION, NOBODY, NOWHERE, 0, TRUE);

  // play the sound
  PlayJA2Sample(Enum330.EXPLOSION_1, RATE_11025, BTNVOLUME, 1, MIDDLEPAN);
}

function SetOffBoobyTrap(pItemPool: Pointer<ITEM_POOL>): void {
  if (pItemPool) {
    let sX: INT16;
    let sY: INT16;
    sX = CenterX(pItemPool.value.sGridNo);
    sY = CenterY(pItemPool.value.sGridNo);
    IgniteExplosion(NOBODY, sX, sY, (gpWorldLevelData[pItemPool.value.sGridNo].sHeight + pItemPool.value.bRenderZHeightAboveLevel), pItemPool.value.sGridNo, Enum225.MINI_GRENADE, 0);
    RemoveItemFromPool(pItemPool.value.sGridNo, pItemPool.value.iItemIndex, pItemPool.value.ubLevel);
  }
}

function ContinuePastBoobyTrap(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bLevel: INT8, iItemIndex: INT32, fInStrategic: BOOLEAN, pfSaidQuote: Pointer<BOOLEAN>): BOOLEAN {
  let fBoobyTrapKnowledge: BOOLEAN;
  let bTrapDifficulty: INT8;
  let bTrapDetectLevel: INT8;
  let pObj: Pointer<OBJECTTYPE>;

  pObj = addressof(gWorldItems[iItemIndex].o);

  (pfSaidQuote.value) = FALSE;

  if (pObj.value.bTrap > 0) {
    if (pSoldier.value.bTeam == gbPlayerNum) {
      // does the player know about this item?
      fBoobyTrapKnowledge = ((pObj.value.fFlags & OBJECT_KNOWN_TO_BE_TRAPPED) > 0);

      // blue flag stuff?

      if (!fBoobyTrapKnowledge) {
        bTrapDifficulty = pObj.value.bTrap;
        bTrapDetectLevel = CalcTrapDetectLevel(pSoldier, FALSE);
        if (bTrapDetectLevel >= bTrapDifficulty) {
          // spotted the trap!
          pObj.value.fFlags |= OBJECT_KNOWN_TO_BE_TRAPPED;
          fBoobyTrapKnowledge = TRUE;

          // Make him warn us:

          // Set things up..
          gpBoobyTrapSoldier = pSoldier;
          gpBoobyTrapItemPool = GetItemPoolForIndex(sGridNo, iItemIndex, pSoldier.value.bLevel);
          gsBoobyTrapGridNo = sGridNo;
          gbBoobyTrapLevel = pSoldier.value.bLevel;
          gfDisarmingBuriedBomb = FALSE;
          gbTrapDifficulty = bTrapDifficulty;

          // And make the call for the dialogue
          SetStopTimeQuoteCallback(BoobyTrapDialogueCallBack);
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BOOBYTRAP_ITEM);

          (pfSaidQuote.value) = TRUE;

          return FALSE;
        }
      }

      gpBoobyTrapItemPool = GetItemPoolForIndex(sGridNo, iItemIndex, pSoldier.value.bLevel);
      if (fBoobyTrapKnowledge) {
        // have the computer ask us if we want to proceed
        gpBoobyTrapSoldier = pSoldier;
        gsBoobyTrapGridNo = sGridNo;
        gbBoobyTrapLevel = pSoldier.value.bLevel;
        gfDisarmingBuriedBomb = FALSE;
        gbTrapDifficulty = pObj.value.bTrap;

        if (fInStrategic) {
          DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.DISARM_BOOBYTRAP_PROMPT], Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, BoobyTrapInMapScreenMessageBoxCallBack, NULL);
        } else {
          DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.DISARM_BOOBYTRAP_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, BoobyTrapMessageBoxCallBack, NULL);
        }
      } else {
        // oops!
        SetOffBoobyTrap(gpBoobyTrapItemPool);
      }

      return FALSE;
    }
    // else, enemies etc always know about boobytraps and are not affected by them
  }

  return TRUE;
}

function BoobyTrapDialogueCallBack(): void {
  gfJustFoundBoobyTrap = TRUE;

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
    StatChange(gpBoobyTrapSoldier, WISDOMAMT, (3 * gbTrapDifficulty), FALSE);
    // EXPLOSIVES GAIN:  Detected a booby-trap
    StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (3 * gbTrapDifficulty), FALSE);
    gfJustFoundBoobyTrap = FALSE;
  }

  if (ubExitValue == MSG_BOX_RETURN_YES) {
    let iCheckResult: INT32;
    let Object: OBJECTTYPE;

    iCheckResult = SkillCheck(gpBoobyTrapSoldier, Enum255.DISARM_TRAP_CHECK, 0);

    if (iCheckResult >= 0) {
      // get the item
      memcpy(addressof(Object), addressof(gWorldItems[gpBoobyTrapItemPool.value.iItemIndex].o), sizeof(OBJECTTYPE));

      // NB owner grossness... bombs 'owned' by the enemy are stored with side value 1 in
      // the map. So if we want to detect a bomb placed by the player, owner is > 1, and
      // owner - 2 gives the ID of the character who planted it
      if (Object.ubBombOwner > 1 && (Object.ubBombOwner - 2 >= gTacticalStatus.Team[OUR_TEAM].bFirstID && Object.ubBombOwner - 2 <= gTacticalStatus.Team[OUR_TEAM].bLastID)) {
        // our own bomb! no exp
      } else {
        // disarmed a boobytrap!
        StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (6 * gbTrapDifficulty), FALSE);
        // have merc say this is good
        DoMercBattleSound(gpBoobyTrapSoldier, Enum259.BATTLE_SOUND_COOL1);
      }

      if (gfDisarmingBuriedBomb) {
        if (Object.usItem == Enum225.SWITCH) {
          // give the player a remote trigger instead
          CreateItem(Enum225.REMOTEBOMBTRIGGER, (1 + Random(9)), addressof(Object));
        } else if (Object.usItem == Enum225.ACTION_ITEM && Object.bActionValue != Enum191.ACTION_ITEM_BLOW_UP) {
          // give the player a detonator instead
          CreateItem(Enum225.DETONATOR, (1 + Random(9)), addressof(Object));
        } else {
          // switch action item to the real item type
          CreateItem(Object.usBombItem, Object.bBombStatus, addressof(Object));
        }

        // remove any blue flag graphic
        RemoveBlueFlag(gsBoobyTrapGridNo, gbBoobyTrapLevel);
      } else {
        Object.bTrap = 0;
        Object.fFlags &= ~(OBJECT_KNOWN_TO_BE_TRAPPED);
      }

      // place it in the guy's inventory/cursor
      if (AutoPlaceObject(gpBoobyTrapSoldier, addressof(Object), TRUE)) {
        // remove it from the ground
        RemoveItemFromPool(gsBoobyTrapGridNo, gpBoobyTrapItemPool.value.iItemIndex, gbBoobyTrapLevel);
      } else {
        // make sure the item in the world is untrapped
        gWorldItems[gpBoobyTrapItemPool.value.iItemIndex].o.bTrap = 0;
        gWorldItems[gpBoobyTrapItemPool.value.iItemIndex].o.fFlags &= ~(OBJECT_KNOWN_TO_BE_TRAPPED);

        // ATE; If we failed to add to inventory, put failed one in our cursor...
        gfDontChargeAPsToPickup = TRUE;
        HandleAutoPlaceFail(gpBoobyTrapSoldier, gpBoobyTrapItemPool.value.iItemIndex, gsBoobyTrapGridNo);
        RemoveItemFromPool(gsBoobyTrapGridNo, gpBoobyTrapItemPool.value.iItemIndex, gbBoobyTrapLevel);
      }
    } else {
      // oops! trap goes off
      StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (3 * gbTrapDifficulty), FROM_FAILURE);

      DoMercBattleSound(gpBoobyTrapSoldier, Enum259.BATTLE_SOUND_CURSE1);

      if (gfDisarmingBuriedBomb) {
        SetOffBombsInGridNo(gpBoobyTrapSoldier.value.ubID, gsBoobyTrapGridNo, TRUE, gbBoobyTrapLevel);
      } else {
        SetOffBoobyTrap(gpBoobyTrapItemPool);
      }
    }
  } else {
    if (gfDisarmingBuriedBomb) {
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.REMOVE_BLUE_FLAG_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, RemoveBlueFlagDialogueCallBack, NULL);
    }
    // otherwise do nothing
  }
}

function BoobyTrapInMapScreenMessageBoxCallBack(ubExitValue: UINT8): void {
  if (gfJustFoundBoobyTrap) {
    // NOW award for finding boobytrap

    // WISDOM GAIN:  Detected a booby-trap
    StatChange(gpBoobyTrapSoldier, WISDOMAMT, (3 * gbTrapDifficulty), FALSE);
    // EXPLOSIVES GAIN:  Detected a booby-trap
    StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (3 * gbTrapDifficulty), FALSE);
    gfJustFoundBoobyTrap = FALSE;
  }

  if (ubExitValue == MSG_BOX_RETURN_YES) {
    let iCheckResult: INT32;
    let Object: OBJECTTYPE;

    iCheckResult = SkillCheck(gpBoobyTrapSoldier, Enum255.DISARM_TRAP_CHECK, 0);

    if (iCheckResult >= 0) {
      // disarmed a boobytrap!
      StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (6 * gbTrapDifficulty), FALSE);

      // have merc say this is good
      DoMercBattleSound(gpBoobyTrapSoldier, Enum259.BATTLE_SOUND_COOL1);

      // get the item
      memcpy(addressof(Object), gpItemPointer, sizeof(OBJECTTYPE));

      if (gfDisarmingBuriedBomb) {
        if (Object.usItem == Enum225.SWITCH) {
          // give the player a remote trigger instead
          CreateItem(Enum225.REMOTEBOMBTRIGGER, (1 + Random(9)), addressof(Object));
        } else if (Object.usItem == Enum225.ACTION_ITEM && Object.bActionValue != Enum191.ACTION_ITEM_BLOW_UP) {
          // give the player a detonator instead
          CreateItem(Enum225.DETONATOR, (1 + Random(9)), addressof(Object));
        } else {
          // switch action item to the real item type
          CreateItem(Object.usBombItem, Object.bBombStatus, addressof(Object));
        }
      } else {
        Object.bTrap = 0;
        Object.fFlags &= ~(OBJECT_KNOWN_TO_BE_TRAPPED);
      }

      MAPEndItemPointer();

      // place it in the guy's inventory/cursor
      if (!AutoPlaceObject(gpBoobyTrapSoldier, addressof(Object), TRUE)) {
        AutoPlaceObjectInInventoryStash(addressof(Object));
      }

      HandleButtonStatesWhileMapInventoryActive();
    } else {
      // oops! trap goes off
      StatChange(gpBoobyTrapSoldier, EXPLODEAMT, (3 * gbTrapDifficulty), FROM_FAILURE);

      DoMercBattleSound(gpBoobyTrapSoldier, Enum259.BATTLE_SOUND_CURSE1);

      if (gfDisarmingBuriedBomb) {
        SetOffBombsInGridNo(gpBoobyTrapSoldier.value.ubID, gsBoobyTrapGridNo, TRUE, gbBoobyTrapLevel);
      } else {
        SetOffBoobyTrap(gpBoobyTrapItemPool);
      }
    }
  } else {
    if (gfDisarmingBuriedBomb) {
      DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.REMOVE_BLUE_FLAG_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, RemoveBlueFlagDialogueCallBack, NULL);
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

function NearbyGroundSeemsWrong(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, fCheckAroundGridno: BOOLEAN, psProblemGridNo: Pointer<INT16>): BOOLEAN {
  let sNextGridNo: INT16;
  // BOOLEAN fWorthChecking = FALSE, fProblemExists = FALSE, fDetectedProblem = FALSE;
  let ubDetectLevel: UINT8;
  let ubDirection: UINT8;
  let pMapElement: Pointer<MAP_ELEMENT>;
  let fCheckFlag: UINT32;
  let uiWorldBombIndex: UINT32;
  let pObj: Pointer<OBJECTTYPE>;
  let fMining: BOOLEAN;
  let fFoundMetal: BOOLEAN = FALSE;
  //	ITEM_POOL *			pItemPool;
  let ubMovementCost: UINT8;

  ubDetectLevel = 0;

  if (FindObj(pSoldier, Enum225.METALDETECTOR) != NO_SLOT) {
    fMining = TRUE;
  } else {
    fMining = FALSE;

    ubDetectLevel = CalcTrapDetectLevel(pSoldier, FALSE);
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

  if (pSoldier.value.bSide == 0) {
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
      ubMovementCost = gubWorldMovementCosts[sNextGridNo][ubDirection][pSoldier.value.bLevel];
      if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
        ubMovementCost = DoorTravelCost(NULL, sNextGridNo, ubMovementCost, FALSE, NULL);
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
    pMapElement = addressof(gpWorldLevelData[sNextGridNo]);

    if (pMapElement.value.uiFlags & fCheckFlag) {
      // already know there's a mine there
      continue;
    }

    // check for boobytraps
    for (uiWorldBombIndex = 0; uiWorldBombIndex < guiNumWorldBombs; uiWorldBombIndex++) {
      if (gWorldBombs[uiWorldBombIndex].fExists && gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].sGridNo == sNextGridNo) {
        pObj = addressof(gWorldItems[gWorldBombs[uiWorldBombIndex].iItemIndex].o);
        if (pObj.value.bDetonatorType == Enum224.BOMB_PRESSURE && !(pObj.value.fFlags & OBJECT_KNOWN_TO_BE_TRAPPED) && (!(pObj.value.fFlags & OBJECT_DISABLED_BOMB))) {
          if (fMining && pObj.value.bTrap <= 10) {
            // add blue flag
            AddBlueFlag(sNextGridNo, pSoldier.value.bLevel);
            fFoundMetal = TRUE;
            break;
          } else if (ubDetectLevel >= pObj.value.bTrap) {
            if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
              // detected exposives buried nearby...
              StatChange(pSoldier, EXPLODEAMT, (pObj.value.bTrap), FALSE);

              // set item as known
              pObj.value.fFlags |= OBJECT_KNOWN_TO_BE_TRAPPED;
            }

            psProblemGridNo.value = sNextGridNo;
            return TRUE;
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
    return TRUE;
  } else {
    return FALSE;
  }
}

function MineSpottedDialogueCallBack(): void {
  let pItemPool: Pointer<ITEM_POOL>;

  // ATE: REALLY IMPORTANT - ALL CALLBACK ITEMS SHOULD UNLOCK
  gTacticalStatus.fLockItemLocators = FALSE;

  GetItemPool(gsBoobyTrapGridNo, addressof(pItemPool), gbBoobyTrapLevel);

  guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;

  // play a locator at the location of the mine
  SetItemPoolLocatorWithCallback(pItemPool, MineSpottedLocatorCallback);
}

function MineSpottedLocatorCallback(): void {
  guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;

  // now ask the player if he wants to place a blue flag.
  DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.PLACE_BLUE_FLAG_PROMPT], Enum26.GAME_SCREEN, MSG_BOX_FLAG_YESNO, MineSpottedMessageBoxCallBack, NULL);
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
  let pNode: Pointer<LEVELNODE>;

  ApplyMapChangesToMapTempFile(TRUE);
  gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_PLAYER_MINE_PRESENT;

  pNode = AddStructToTail(sGridNo, BLUEFLAG_GRAPHIC);

  if (pNode) {
    pNode.value.uiFlags |= LEVELNODE_SHOW_THROUGH;
  }

  ApplyMapChangesToMapTempFile(FALSE);
  RecompileLocalMovementCostsFromRadius(sGridNo, bLevel);
  SetRenderFlags(RENDER_FLAG_FULL);
}

function RemoveBlueFlag(sGridNo: INT16, bLevel: INT8): void {
  ApplyMapChangesToMapTempFile(TRUE);
  gpWorldLevelData[sGridNo].uiFlags &= ~(MAPELEMENT_PLAYER_MINE_PRESENT);

  if (bLevel == 0) {
    RemoveStruct(sGridNo, BLUEFLAG_GRAPHIC);
  } else {
    RemoveOnRoof(sGridNo, BLUEFLAG_GRAPHIC);
  }

  ApplyMapChangesToMapTempFile(FALSE);
  RecompileLocalMovementCostsFromRadius(sGridNo, bLevel);
  SetRenderFlags(RENDER_FLAG_FULL);
}

function MakeNPCGrumpyForMinorOffense(pSoldier: Pointer<SOLDIERTYPE>, pOffendingSoldier: Pointer<SOLDIERTYPE>): void {
  CancelAIAction(pSoldier, TRUE);

  switch (pSoldier.value.ubProfile) {
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
      gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags3 |= PROFILE_MISC_FLAG3_NPC_PISSED_OFF;
      TriggerNPCWithIHateYouQuote(pSoldier.value.ubProfile);
      break;
    default:
      // trigger NPCs with quote if available
      AddToShouldBecomeHostileOrSayQuoteList(pSoldier.value.ubID);
      break;
  }

  if (pOffendingSoldier) {
    pSoldier.value.bNextAction = Enum289.AI_ACTION_CHANGE_FACING;
    pSoldier.value.usNextActionData = atan8(pSoldier.value.sX, pSoldier.value.sY, pOffendingSoldier.value.sX, pOffendingSoldier.value.sY);
  }
}

function TestPotentialOwner(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE) {
    if (SoldierToSoldierLineOfSightTest(pSoldier, gpTempSoldier, DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, 0, gpTempSoldier.value.sGridNo, gpTempSoldier.value.bLevel), TRUE)) {
      MakeNPCGrumpyForMinorOffense(pSoldier, gpTempSoldier);
    }
  }
}

function CheckForPickedOwnership(): void {
  let pItemPool: Pointer<ITEM_POOL>;
  let ubProfile: UINT8;
  let ubCivGroup: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubLoop: UINT8;

  // LOOP THROUGH LIST TO FIND NODE WE WANT
  GetItemPool(gsTempGridno, addressof(pItemPool), gpTempSoldier.value.bLevel);

  while (pItemPool) {
    if (gWorldItems[pItemPool.value.iItemIndex].o.usItem == Enum225.OWNERSHIP) {
      if (gWorldItems[pItemPool.value.iItemIndex].o.ubOwnerProfile != NO_PROFILE) {
        ubProfile = gWorldItems[pItemPool.value.iItemIndex].o.ubOwnerProfile;
        pSoldier = FindSoldierByProfileID(ubProfile, FALSE);
        if (pSoldier) {
          TestPotentialOwner(pSoldier);
        }
      }
      if (gWorldItems[pItemPool.value.iItemIndex].o.ubOwnerCivGroup != Enum246.NON_CIV_GROUP) {
        ubCivGroup = gWorldItems[pItemPool.value.iItemIndex].o.ubOwnerCivGroup;
        if (ubCivGroup == Enum246.HICKS_CIV_GROUP && CheckFact(Enum170.FACT_HICKS_MARRIED_PLAYER_MERC, 0)) {
          // skip because hicks appeased
          pItemPool = pItemPool.value.pNext;
          continue;
        }
        for (ubLoop = gTacticalStatus.Team[CIV_TEAM].bFirstID; ubLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; ubLoop++) {
          pSoldier = MercPtrs[ubLoop];
          if (pSoldier && pSoldier.value.ubCivilianGroup == ubCivGroup) {
            TestPotentialOwner(pSoldier);
          }
        }
      }
    }
    pItemPool = pItemPool.value.pNext;
  }
}

function LoopLevelNodeForItemGlowFlag(pNode: Pointer<LEVELNODE>, sGridNo: INT16, ubLevel: UINT8, fOn: BOOLEAN): void {
  while (pNode != NULL) {
    if (pNode.value.uiFlags & LEVELNODE_ITEM) {
      if (fOn) {
        pNode.value.uiFlags |= LEVELNODE_DYNAMIC;
      } else {
        pNode.value.uiFlags &= (~LEVELNODE_DYNAMIC);
      }
    }
    pNode = pNode.value.pNext;
  }
}

function HandleItemGlowFlag(sGridNo: INT16, ubLevel: UINT8, fOn: BOOLEAN): void {
  let pNode: Pointer<LEVELNODE>;

  if (ubLevel == 0) {
    pNode = gpWorldLevelData[sGridNo].pStructHead;
    LoopLevelNodeForItemGlowFlag(pNode, sGridNo, ubLevel, fOn);
  } else {
    pNode = gpWorldLevelData[sGridNo].pOnRoofHead;
    LoopLevelNodeForItemGlowFlag(pNode, sGridNo, ubLevel, fOn);
  }
}

function ToggleItemGlow(fOn: BOOLEAN): void {
  let cnt: UINT32;

  for (cnt = 0; cnt < WORLD_MAX; cnt++) {
    HandleItemGlowFlag(cnt, 0, fOn);
    HandleItemGlowFlag(cnt, 1, fOn);
  }

  if (!fOn) {
    gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = FALSE;
  } else {
    gGameSettings.fOptions[Enum8.TOPTION_GLOW_ITEMS] = TRUE;
  }

  SetRenderFlags(RENDER_FLAG_FULL);
}

function ContinuePastBoobyTrapInMapScreen(pObject: Pointer<OBJECTTYPE>, pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let fBoobyTrapKnowledge: BOOLEAN;
  let bTrapDifficulty: INT8;
  let bTrapDetectLevel: INT8;

  if (pObject.value.bTrap > 0) {
    if (pSoldier.value.bTeam == gbPlayerNum) {
      // does the player know about this item?
      fBoobyTrapKnowledge = ((pObject.value.fFlags & OBJECT_KNOWN_TO_BE_TRAPPED) > 0);

      // blue flag stuff?

      if (!fBoobyTrapKnowledge) {
        bTrapDifficulty = pObject.value.bTrap;
        bTrapDetectLevel = CalcTrapDetectLevel(pSoldier, FALSE);
        if (bTrapDetectLevel >= bTrapDifficulty) {
          // spotted the trap!
          pObject.value.fFlags |= OBJECT_KNOWN_TO_BE_TRAPPED;
          fBoobyTrapKnowledge = TRUE;

          // Make him warn us:
          gpBoobyTrapSoldier = pSoldier;

          // And make the call for the dialogue
          SetStopTimeQuoteCallback(BoobyTrapDialogueCallBack);
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_BOOBYTRAP_ITEM);

          return FALSE;
        }
      }

      if (fBoobyTrapKnowledge) {
        // have the computer ask us if we want to proceed
        gpBoobyTrapSoldier = pSoldier;
        gbTrapDifficulty = pObject.value.bTrap;
        DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, TacticalStr[Enum335.DISARM_BOOBYTRAP_PROMPT], Enum26.MAP_SCREEN, MSG_BOX_FLAG_YESNO, BoobyTrapInMapScreenMessageBoxCallBack, NULL);
      } else {
        // oops!
        SetOffBoobyTrapInMapScreen(pSoldier, pObject);
      }

      return FALSE;
    }
    // else, enemies etc always know about boobytraps and are not affected by them
  }

  return TRUE;
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
function RefreshItemPools(pItemList: Pointer<WORLDITEM>, iNumberOfItems: INT32): void {
  ClearAllItemPools();

  RefreshWorldItemsIntoItemPools(pItemList, iNumberOfItems);
}

function FindNearestAvailableGridNoForItem(sSweetGridNo: INT16, ubRadius: INT8): INT16 {
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
  let fFound: BOOLEAN = FALSE;
  let soldier: SOLDIERTYPE;
  let ubSaveNPCAPBudget: UINT8;
  let ubSaveNPCDistLimit: UINT8;
  let fSetDirection: BOOLEAN = FALSE;

  cnt3 = 0;

  // Save AI pathing vars.  changing the distlimit restricts how
  // far away the pathing will consider.
  ubSaveNPCAPBudget = gubNPCAPBudget;
  ubSaveNPCDistLimit = gubNPCDistLimit;
  gubNPCAPBudget = 0;
  gubNPCDistLimit = ubRadius;

  // create dummy soldier, and use the pathing to determine which nearby slots are
  // reachable.
  memset(addressof(soldier), 0, sizeof(SOLDIERTYPE));
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
  FindBestPath(addressof(soldier), NOWHERE, 0, Enum193.WALKING, COPYREACHABLE, 0);

  uiLowestRange = 999999;

  for (cnt1 = sBottom; cnt1 <= sTop; cnt1++) {
    leftmost = ((sSweetGridNo + (WORLD_COLS * cnt1)) / WORLD_COLS) * WORLD_COLS;

    for (cnt2 = sLeft; cnt2 <= sRight; cnt2++) {
      sGridNo = sSweetGridNo + (WORLD_COLS * cnt1) + cnt2;
      if (sGridNo >= 0 && sGridNo < WORLD_MAX && sGridNo >= leftmost && sGridNo < (leftmost + WORLD_COLS) && gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_REACHABLE) {
        // Go on sweet stop
        if (NewOKDestination(addressof(soldier), sGridNo, TRUE, soldier.bLevel)) {
          uiRange = GetRangeInCellCoordsFromGridNoDiff(sSweetGridNo, sGridNo);

          if (uiRange < uiLowestRange) {
            sLowestGridNo = sGridNo;
            uiLowestRange = uiRange;
            fFound = TRUE;
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

function CanPlayerUseRocketRifle(pSoldier: Pointer<SOLDIERTYPE>, fDisplay: BOOLEAN): BOOLEAN {
  if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].usItem == Enum225.ROCKET_RIFLE || pSoldier.value.inv[pSoldier.value.ubAttackingHand].usItem == Enum225.AUTO_ROCKET_RIFLE) {
    // check imprint ID
    // NB not-imprinted value is NO_PROFILE
    // imprinted value is profile for mercs & NPCs and NO_PROFILE + 1 for generic dudes
    if (pSoldier.value.ubProfile != NO_PROFILE) {
      if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubImprintID != pSoldier.value.ubProfile) {
        // NOT a virgin gun...
        if (pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubImprintID != NO_PROFILE) {
          // access denied!
          if (pSoldier.value.bTeam == gbPlayerNum) {
            PlayJA2Sample(Enum330.RG_ID_INVALID, RATE_11025, HIGHVOLUME, 1, MIDDLE);

            if (fDisplay) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, "\"%s\"", TacticalStr[Enum335.GUN_NOGOOD_FINGERPRINT]);
            }
          }
          return FALSE;
        }
      }
    }
  }
  return TRUE;
}
