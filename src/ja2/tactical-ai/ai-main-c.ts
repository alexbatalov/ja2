let gubAICounter: UINT8;

//
// Commented out/ to fix:
// lots of other stuff, I think
//

const DEADLOCK_DELAY = 15000;

//#define TESTAI

let GameOption: INT8[] /* [MAXGAMEOPTIONS] */ = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  0,
  0,
  0,
  0,
  0,
];

const AI_LIMIT_PER_UPDATE = 1;

let gfTurnBasedAI: BOOLEAN;

let gbDiff: INT8[][] /* [MAX_DIFF_PARMS][5] */ = [
  //       AI DIFFICULTY SETTING
  // WIMPY  EASY  NORMAL  TOUGH  ELITE
  [ -20, -10, 0, 10, 20 ], // DIFF_ENEMY_EQUIP_MOD
  [ -10, -5, 0, 5, 10 ], // DIFF_ENEMY_TO_HIT_MOD
  [ -2, -1, 0, 1, 2 ], // DIFF_ENEMY_INTERRUPT_MOD
  [ 50, 65, 80, 90, 95 ], // DIFF_RADIO_RED_ALERT
  [ 4, 6, 8, 10, 13 ] // DIFF_MAX_COVER_RANGE
];

function DebugAI(szOutput: STR): void {
}

function InitAI(): BOOLEAN {
  let DebugFile: Pointer<FILE>;

  // If we are not loading a saved game ( if we are, this has already been called )
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // init the panic system
    InitPanicSystem();
  }

  return TRUE;
}

function AimingGun(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  return FALSE;
}

function HandleSoldierAI(pSoldier: Pointer<SOLDIERTYPE>): void {
  let uiCurrTime: UINT32 = GetJA2Clock();

  // ATE
  // Bail if we are engaged in a NPC conversation/ and/or sequence ... or we have a pause because
  // we just saw someone... or if there are bombs on the bomb queue
  if (pSoldier.value.uiStatusFlags & SOLDIER_ENGAGEDINACTION || gTacticalStatus.fEnemySightingOnTheirTurn || (gubElementsOnExplosionQueue != 0)) {
    return;
  }

  if (gfExplosionQueueActive) {
    return;
  }

  if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
    // if we're in autobandage, or the AI control flag is set and the player has a quote record to perform, or is a boxer,
    // let AI process this merc; otherwise abort
    if (!(gTacticalStatus.fAutoBandageMode) && !(pSoldier.value.uiStatusFlags & SOLDIER_PCUNDERAICONTROL && (pSoldier.value.ubQuoteRecord != 0 || pSoldier.value.uiStatusFlags & SOLDIER_BOXER))) {
      // patch...
      if (pSoldier.value.fAIFlags & AI_HANDLE_EVERY_FRAME) {
        pSoldier.value.fAIFlags &= ~AI_HANDLE_EVERY_FRAME;
      }
      return;
    }
  }
  /*
  else
  {
          // AI is run on all PCs except the one who is selected
          if (pSoldier->uiStatusFlags & SOLDIER_PC )
          {
                  // if this soldier is "selected" then only let user give orders!
                  if ((pSoldier->ubID == gusSelectedSoldier) && !(gTacticalStatus.uiFlags & DEMOMODE))
                  {
                          return;
                  }
          }
  }
  */

  // determine what sort of AI to use
  if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) {
    gfTurnBasedAI = TRUE;
  } else {
    gfTurnBasedAI = FALSE;
  }

  // If TURN BASED and NOT NPC's turn, or realtime and not our chance to think, bail...
  if (gfTurnBasedAI) {
    if ((pSoldier.value.bTeam != OUR_TEAM) && gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
      return;
    }
    // why do we let the quote record thing be in here?  we're in turnbased the quote record doesn't matter,
    // we can't act out of turn!
    if (!(pSoldier.value.uiStatusFlags & SOLDIER_UNDERAICONTROL))
    // if ( !(pSoldier->uiStatusFlags & SOLDIER_UNDERAICONTROL) && (pSoldier->ubQuoteRecord == 0))
    {
      return;
    }

    if (pSoldier.value.bTeam != gTacticalStatus.ubCurrentTeam) {
      pSoldier.value.uiStatusFlags &= ~SOLDIER_UNDERAICONTROL;
      return;
    }
    if (pSoldier.value.bMoved) {
      // this guy doesn't get to act!
      EndAIGuysTurn(pSoldier);
      return;
    }
  } else if (!(pSoldier.value.fAIFlags & AI_HANDLE_EVERY_FRAME)) // if set to handle every frame, ignore delay!
  {
    //#ifndef AI_PROFILING
    // Time to handle guys in realtime (either combat or not )
    if (!TIMECOUNTERDONE(pSoldier.value.AICounter, pSoldier.value.uiAIDelay)) {
      // CAMFIELD, LOOK HERE!
      return;
    } else {
      // Reset counter!
      RESETTIMECOUNTER(pSoldier.value.AICounter, pSoldier.value.uiAIDelay);
      // DebugMsg( TOPIC_JA2, DBG_LEVEL_0, String( "%s waiting %d from %d", pSoldier->name, pSoldier->AICounter, uiCurrTime ) );
    }
    //#endif
  }

  if (pSoldier.value.fAIFlags & AI_HANDLE_EVERY_FRAME) // if set to handle every frame, ignore delay!
  {
    if (pSoldier.value.ubQuoteActionID != Enum290.QUOTE_ACTION_ID_TURNTOWARDSPLAYER) {
      // turn off flag!
      pSoldier.value.fAIFlags &= (~AI_HANDLE_EVERY_FRAME);
    }
  }

  // if this NPC is getting hit, abort
  if (pSoldier.value.fGettingHit) {
    return;
  }

  if (gTacticalStatus.bBoxingState == Enum247.PRE_BOXING || gTacticalStatus.bBoxingState == Enum247.BOXING || gTacticalStatus.bBoxingState == Enum247.WON_ROUND || gTacticalStatus.bBoxingState == Enum247.LOST_ROUND) {
    if (!(pSoldier.value.uiStatusFlags & SOLDIER_BOXER)) {
// do nothing!
      EndAIGuysTurn(pSoldier);
      return;
    }
  }

  // if this NPC is dying, bail
  if (pSoldier.value.bLife < OKLIFE || !pSoldier.value.bActive) {
    if (pSoldier.value.bActive && pSoldier.value.fMuzzleFlash) {
      EndMuzzleFlash(pSoldier);
    }

    EndAIGuysTurn(pSoldier);
    return;
  }

  if (pSoldier.value.fAIFlags & AI_ASLEEP) {
    if (gfTurnBasedAI && pSoldier.value.bVisible) {
      // turn off sleep flag, guy's got to be able to do stuff in turnbased
      // if he's visible
      pSoldier.value.fAIFlags &= ~AI_ASLEEP;
    } else if (!(pSoldier.value.fAIFlags & AI_CHECK_SCHEDULE)) {
// don't do anything!

      EndAIGuysTurn(pSoldier);
      return;
    }
  }

  if (pSoldier.value.bInSector == FALSE && !(pSoldier.value.fAIFlags & AI_CHECK_SCHEDULE)) {
// don't do anything!

    EndAIGuysTurn(pSoldier);
    return;
  }

  if (((pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) && !TANK(pSoldier)) || AM_A_ROBOT(pSoldier)) {
// bail out!

    EndAIGuysTurn(pSoldier);
    return;
  }

  if (pSoldier.value.bCollapsed) {
    // being handled so turn off muzzle flash
    if (pSoldier.value.fMuzzleFlash) {
      EndMuzzleFlash(pSoldier);
    }

    // stunned/collapsed!
    CancelAIAction(pSoldier, FORCE);
    EndAIGuysTurn(pSoldier);
    return;
  }

  // in the unlikely situation (Sgt Krott et al) that we have a quote trigger going on
  // during turnbased, don't do any AI
  if (pSoldier.value.ubProfile != NO_PROFILE && (pSoldier.value.ubProfile == Enum268.SERGEANT || pSoldier.value.ubProfile == Enum268.MIKE || pSoldier.value.ubProfile == Enum268.JOE) && (gTacticalStatus.uiFlags & INCOMBAT) && (gfInTalkPanel || gfWaitingForTriggerTimer || !DialogueQueueIsEmpty())) {
    return;
  }

  // ATE: Did some changes here
  // DON'T rethink if we are determined to get somewhere....
  if (pSoldier.value.bNewSituation == IS_NEW_SITUATION) {
    let fProcessNewSituation: BOOLEAN;

    // if this happens during an attack then do nothing... wait for the A.B.C.
    // to be reduced to 0 first -- CJC December 13th
    if (gTacticalStatus.ubAttackBusyCount > 0) {
      fProcessNewSituation = FALSE;
      // HACK!!
      if (pSoldier.value.bAction == Enum289.AI_ACTION_FIRE_GUN) {
        if (guiNumBullets == 0) {
          // abort attack!
          // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String(">>>>>> Attack busy count lobotomized due to new situation for %d", pSoldier->ubID ) );
          // gTacticalStatus.ubAttackBusyCount = 0;
          fProcessNewSituation = TRUE;
        }
      } else if (pSoldier.value.bAction == Enum289.AI_ACTION_TOSS_PROJECTILE) {
        if (guiNumObjectSlots == 0) {
          // abort attack!
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String(">>>>>> Attack busy count lobotomized due to new situation for %d", pSoldier.value.ubID));
          gTacticalStatus.ubAttackBusyCount = 0;
          fProcessNewSituation = TRUE;
        }
      }
    } else {
      fProcessNewSituation = TRUE;
    }

    if (fProcessNewSituation) {
      if ((pSoldier.value.uiStatusFlags & SOLDIER_UNDERAICONTROL) && pSoldier.value.ubQuoteActionID >= Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST && pSoldier.value.ubQuoteActionID <= Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH && !GridNoOnVisibleWorldTile(pSoldier.value.sGridNo)) {
        // traversing offmap, ignore new situations
      } else if (pSoldier.value.ubQuoteRecord == 0 && !gTacticalStatus.fAutoBandageMode) {
        // don't force, don't want escorted mercs reacting to new opponents, etc.
        // now we don't have AI controlled escorted mercs though - CJC
        CancelAIAction(pSoldier, FORCE);
        // zap any next action too
        if (pSoldier.value.bAction != Enum289.AI_ACTION_END_COWER_AND_MOVE) {
          pSoldier.value.bNextAction = Enum289.AI_ACTION_NONE;
        }
        DecideAlertStatus(pSoldier);
      } else {
        if (pSoldier.value.ubQuoteRecord) {
          // make sure we're not using combat AI
          pSoldier.value.bAlertStatus = Enum243.STATUS_GREEN;
        }
        pSoldier.value.bNewSituation = WAS_NEW_SITUATION;
      }
    }
  } else {
    // might have been in 'was' state; no longer so...
    pSoldier.value.bNewSituation = NOT_NEW_SITUATION;
  }

  /*********
          Start of new overall AI system
          ********/

  if (gfTurnBasedAI) {
    if ((GetJA2Clock() - gTacticalStatus.uiTimeSinceMercAIStart) > DEADLOCK_DELAY && !gfUIInDeadlock) {
      // ATE: Display message that deadlock occured...
      LiveMessage("Breaking Deadlock");

      // just abort
      EndAIDeadlock();
      if (!(pSoldier.value.uiStatusFlags & SOLDIER_UNDERAICONTROL)) {
        return;
      }
    }
  }

  if (pSoldier.value.bAction == Enum289.AI_ACTION_NONE) {
    // being handled so turn off muzzle flash
    if (pSoldier.value.fMuzzleFlash) {
      EndMuzzleFlash(pSoldier);
    }

    gubAICounter++;
    // figure out what to do!
    if (gfTurnBasedAI) {
      if (pSoldier.value.fNoAPToFinishMove) {
        // well that move must have been cancelled because we're thinking now!
        // pSoldier->fNoAPToFinishMove = FALSE;
      }
      TurnBasedHandleNPCAI(pSoldier);
    } else {
      RTHandleAI(pSoldier);
    }
  } else {
    // an old action was in progress; continue it
    if (pSoldier.value.bAction >= FIRST_MOVEMENT_ACTION && pSoldier.value.bAction <= LAST_MOVEMENT_ACTION && !pSoldier.value.fDelayedMovement) {
      if (pSoldier.value.usPathIndex == pSoldier.value.usPathDataSize) {
        if (pSoldier.value.sAbsoluteFinalDestination != NOWHERE) {
          if (!ACTING_ON_SCHEDULE(pSoldier) && SpacesAway(pSoldier.value.sGridNo, pSoldier.value.sAbsoluteFinalDestination) < 4) {
            // This is close enough... reached final destination for NPC system move
            if (pSoldier.value.sAbsoluteFinalDestination != pSoldier.value.sGridNo) {
              // update NPC records to replace our final dest with this location
              ReplaceLocationInNPCDataFromProfileID(pSoldier.value.ubProfile, pSoldier.value.sAbsoluteFinalDestination, pSoldier.value.sGridNo);
            }
            pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.sGridNo;
            // change action data so that we consider this our final destination below
            pSoldier.value.usActionData = pSoldier.value.sGridNo;
          }

          if (pSoldier.value.sAbsoluteFinalDestination == pSoldier.value.sGridNo) {
            pSoldier.value.sAbsoluteFinalDestination = NOWHERE;

            if (!ACTING_ON_SCHEDULE(pSoldier) && pSoldier.value.ubQuoteRecord && pSoldier.value.ubQuoteActionID == Enum290.QUOTE_ACTION_ID_CHECKFORDEST) {
              NPCReachedDestination(pSoldier, FALSE);
              // wait just a little bit so the queue can be processed
              pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
              pSoldier.value.usNextActionData = 500;
            } else if (pSoldier.value.ubQuoteActionID >= Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST && pSoldier.value.ubQuoteActionID <= Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH) {
              HandleAITacticalTraversal(pSoldier);
              return;
            }
          } else {
            // make sure this guy is handled next frame!
            pSoldier.value.uiStatusFlags |= AI_HANDLE_EVERY_FRAME;
          }
        }
        // for regular guys still have to check for leaving the map
        else if (pSoldier.value.ubQuoteActionID >= Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST && pSoldier.value.ubQuoteActionID <= Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH) {
          HandleAITacticalTraversal(pSoldier);
          return;
        }

// reached destination

        if (pSoldier.value.sGridNo == pSoldier.value.sFinalDestination) {
          if (pSoldier.value.bAction == Enum289.AI_ACTION_MOVE_TO_CLIMB) {
            // successfully moved to roof!

            // fake setting action to climb roof and see if we can afford this
            pSoldier.value.bAction = Enum289.AI_ACTION_CLIMB_ROOF;
            if (IsActionAffordable(pSoldier)) {
              // set action to none and next action to climb roof so we do that next
              pSoldier.value.bAction = Enum289.AI_ACTION_NONE;
              pSoldier.value.bNextAction = Enum289.AI_ACTION_CLIMB_ROOF;
            }
          }
        }

        ActionDone(pSoldier);
      }

      //*** TRICK- TAKE INTO ACCOUNT PAUSED FOR NO TIME ( FOR NOW )
      if (pSoldier.value.fNoAPToFinishMove) {
        SoldierTriesToContinueAlongPath(pSoldier);
      }
      // ATE: Let's also test if we are in any stationary animation...
      else if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_STATIONARY)) {
        // ATE: Put some ( MORE ) refinements on here....
        // If we are trying to open door, or jump fence  don't continue until done...
        if (!pSoldier.value.fContinueMoveAfterStanceChange && !pSoldier.value.bEndDoorOpenCode) {
          // ATE: just a few more.....
          // If we have ANY pending aninmation that is movement.....
          if (pSoldier.value.usPendingAnimation != NO_PENDING_ANIMATION && (gAnimControl[pSoldier.value.usPendingAnimation].uiFlags & ANIM_MOVING)) {
            // Don't do anything, we're waiting on a pending animation....
          } else {
// OK, we have a move to finish...

            SoldierTriesToContinueAlongPath(pSoldier);
          }
        }
      }
    }
  }

  /*********
          End of new overall AI system
          ********/
}

const NOSCORE = 99;

function EndAIGuysTurn(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubID: UINT8;

  if (gfTurnBasedAI) {
    if (gTacticalStatus.uiFlags & PLAYER_TEAM_DEAD) {
      EndAITurn();
      return;
    }

    // search for any player merc to say close call quote
    for (ubID = gTacticalStatus.Team[gbPlayerNum].bFirstID; ubID <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubID++) {
      if (OK_INSECTOR_MERC(MercPtrs[ubID])) {
        if (MercPtrs[ubID].value.fCloseCall) {
          if (!gTacticalStatus.fSomeoneHit && MercPtrs[ubID].value.bNumHitsThisTurn == 0 && !(MercPtrs[ubID].value.usQuoteSaidExtFlags & SOLDIER_QUOTE_SAID_EXT_CLOSE_CALL) && Random(3) == 0) {
            // say close call quote!
            TacticalCharacterDialogue(MercPtrs[ubID], Enum202.QUOTE_CLOSE_CALL);
            MercPtrs[ubID].value.usQuoteSaidExtFlags |= SOLDIER_QUOTE_SAID_EXT_CLOSE_CALL;
          }
          MercPtrs[ubID].value.fCloseCall = FALSE;
        }
      }
    }
    gTacticalStatus.fSomeoneHit = FALSE;

    // if civ in civ group and hostile, try to change nearby guys to hostile
    if (pSoldier.value.ubCivilianGroup != Enum246.NON_CIV_GROUP && !pSoldier.value.bNeutral) {
      if (!(pSoldier.value.uiStatusFlags & SOLDIER_BOXER) || !(gTacticalStatus.bBoxingState == Enum247.PRE_BOXING || gTacticalStatus.bBoxingState == Enum247.BOXING)) {
        let ubFirstProfile: UINT8;

        ubFirstProfile = CivilianGroupMembersChangeSidesWithinProximity(pSoldier);
        if (ubFirstProfile != NO_PROFILE) {
          TriggerFriendWithHostileQuote(ubFirstProfile);
        }
      }
    }

    if (gTacticalStatus.uiFlags & SHOW_ALL_ROOFS && (gTacticalStatus.uiFlags & INCOMBAT)) {
      SetRenderFlags(RENDER_FLAG_FULL);
      gTacticalStatus.uiFlags &= (~SHOW_ALL_ROOFS);
      InvalidateWorldRedundency();
    }

    // End this NPC's control, move to next dude
    EndRadioLocator(pSoldier.value.ubID);
    pSoldier.value.uiStatusFlags &= (~SOLDIER_UNDERAICONTROL);
    pSoldier.value.fTurnInProgress = FALSE;
    pSoldier.value.bMoved = TRUE;
    pSoldier.value.bBypassToGreen = FALSE;

    // find the next AI guy
    ubID = RemoveFirstAIListEntry();
    if (ubID != NOBODY) {
      StartNPCAI(MercPtrs[ubID]);
      return;
    }

    // We are at the end, return control to next team
    DebugAI(String("Ending AI turn\n"));
    EndAITurn();
  } else {
    // realtime
  }
}

function EndAIDeadlock(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bFound: INT8 = FALSE;

  // ESCAPE ENEMY'S TURN

  // find enemy with problem and free him up...
  for (cnt = 0, pSoldier = Menptr; cnt < MAXMERCS; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector) {
      if (pSoldier.value.uiStatusFlags & SOLDIER_UNDERAICONTROL) {
        CancelAIAction(pSoldier, FORCE);

        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Number of bullets in the air is %ld", guiNumBullets));

        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("Setting attack busy count to 0 from deadlock break"));
        gTacticalStatus.ubAttackBusyCount = 0;

        EndAIGuysTurn(pSoldier);
        bFound = TRUE;
        break;
      }
    }
  }

  if (!bFound) {
    StartPlayerTeamTurn(TRUE, FALSE);
  }
}

function StartNPCAI(pSoldier: Pointer<SOLDIERTYPE>): void {
  let fInValidSoldier: BOOLEAN = FALSE;

  // pSoldier->uiStatusFlags |= SOLDIER_UNDERAICONTROL;
  SetSoldierAsUnderAiControl(pSoldier);

  pSoldier.value.fTurnInProgress = TRUE;

  pSoldier.value.sLastTwoLocations[0] = NOWHERE;
  pSoldier.value.sLastTwoLocations[1] = NOWHERE;

  RefreshAI(pSoldier);

  gTacticalStatus.uiTimeSinceMercAIStart = GetJA2Clock();

  // important: if "fPausedAnimation" is TRUE, then we have to turn it off else
  // HandleSoldierAI() will not be called!

  if (pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE) {
    if (GetNumberInVehicle(pSoldier.value.bVehicleID) == 0) {
      fInValidSoldier = TRUE;
    }
  }

  // Locate to soldier
  // If we are not in an interrupt situation!
  if (((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) && gubOutOfTurnPersons == 0) {
    if (((pSoldier.value.bVisible != -1 && pSoldier.value.bLife) || (gTacticalStatus.uiFlags & SHOW_ALL_MERCS)) && (fInValidSoldier == FALSE)) {
      // If we are on a roof, set flag for rendering...
      if (pSoldier.value.bLevel != 0 && (gTacticalStatus.uiFlags & INCOMBAT)) {
        gTacticalStatus.uiFlags |= SHOW_ALL_ROOFS;
        SetRenderFlags(RENDER_FLAG_FULL);
        InvalidateWorldRedundency();
      }

      // ATE: Changed to show locator

      // Skip locator for green friendly militia
      if (!(pSoldier.value.bTeam == MILITIA_TEAM && pSoldier.value.bSide == 0 && pSoldier.value.bAlertStatus == Enum243.STATUS_GREEN)) {
        LocateSoldier(pSoldier.value.ubID, SETLOCATORFAST);
      }

      // try commenting this out altogether
      /*
      // so long as he's not a neutral civ or a militia friendly to the player
      if ( !(pSoldier->bNeutral || (pSoldier->bTeam == MILITIA_TEAM && pSoldier->bSide == 0) ) )
      {
              PauseAITemporarily();
      }
      */
    }

    UpdateEnemyUIBar();
  }

  // Remove deadlock message
  EndDeadlockMsg();
  DecideAlertStatus(pSoldier);
}

function DestNotSpokenFor(pSoldier: Pointer<SOLDIERTYPE>, sGridno: INT16): BOOLEAN {
  let cnt: INT32;
  let pOurTeam: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;

  // make a list of all of our team's mercs
  for (pOurTeam = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pOurTeam++) {
    if (pOurTeam.value.bActive) {
      if (pOurTeam.value.sGridNo == sGridno || pOurTeam.value.usActionData == sGridno)
        return FALSE;
    }
  }

  return (TRUE); // dest is free to go to...
}

function FindAdjacentSpotBeside(pSoldier: Pointer<SOLDIERTYPE>, sGridno: INT16): INT16 {
  let cnt: INT32;
  let mods: INT16[] /* [4] */ = [
    -1,
    -MAPWIDTH,
    1,
    MAPWIDTH,
  ];
  let sTempGridno: INT16;
  let sCheapestCost: INT16 = 500;
  let sMovementCost: INT16;
  let sCheapestDest: INT16 = NOWHERE;

  for (cnt = 0; cnt < 4; cnt++) {
    sTempGridno = sGridno + mods[cnt];
    if (!OutOfBounds(sGridno, sTempGridno)) {
      if (NewOKDestination(pSoldier, sTempGridno, PEOPLETOO, pSoldier.value.bLevel) && DestNotSpokenFor(pSoldier, sTempGridno)) {
        sMovementCost = PlotPath(pSoldier, sTempGridno, FALSE, FALSE, FALSE, Enum193.WALKING, FALSE, FALSE, 0);
        if (sMovementCost < sCheapestCost) {
          sCheapestCost = sMovementCost;
          sCheapestDest = sTempGridno;
        }
      }
    }
  }

  return sCheapestDest;
}

function GetMostThreateningOpponent(pSoldier: Pointer<SOLDIERTYPE>): UINT8 {
  let uiLoop: UINT32;
  let iThreatVal: INT32;
  let iMinThreat: INT32 = 30000;
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let ubTargetSoldier: UINT8 = NO_SOLDIER;

  // Loop through all mercs

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pTargetSoldier = MercSlots[uiLoop];

    if (!pTargetSoldier) {
      continue;
    }

    // if this soldier is on same team as me, skip him
    if (pTargetSoldier.value.bTeam == pSoldier.value.bTeam || pTargetSoldier.value.bSide == pSoldier.value.bSide) {
      continue;
    }

    // if potential opponent is dead, skip him
    if (!pTargetSoldier.value.bLife) {
      continue;
    }

    if (pSoldier.value.bOppList[pTargetSoldier.value.ubID] != SEEN_CURRENTLY)
      continue;

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY && pTargetSoldier.value.ubProfile != 64) {
      continue; // next opponent
    }

    iThreatVal = CalcManThreatValue(pTargetSoldier, pSoldier.value.sGridNo, TRUE, pSoldier);
    if (iThreatVal < iMinThreat) {
      iMinThreat = iThreatVal;
      ubTargetSoldier = pTargetSoldier.value.ubID;
    }
  }

  return ubTargetSoldier;
}

function FreeUpNPCFromPendingAction(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier) {
    if (pSoldier.value.bAction == Enum289.AI_ACTION_PENDING_ACTION || pSoldier.value.bAction == Enum289.AI_ACTION_OPEN_OR_CLOSE_DOOR || pSoldier.value.bAction == Enum289.AI_ACTION_CREATURE_CALL || pSoldier.value.bAction == Enum289.AI_ACTION_YELLOW_ALERT || pSoldier.value.bAction == Enum289.AI_ACTION_RED_ALERT || pSoldier.value.bAction == Enum289.AI_ACTION_UNLOCK_DOOR || pSoldier.value.bAction == Enum289.AI_ACTION_PULL_TRIGGER || pSoldier.value.bAction == Enum289.AI_ACTION_LOCK_DOOR) {
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        if (pSoldier.value.ubQuoteRecord == Enum213.NPC_ACTION_KYLE_GETS_MONEY) {
          // Kyle after getting money
          pSoldier.value.ubQuoteRecord = 0;
          TriggerNPCRecord(Enum268.KYLE, 11);
        } else if (pSoldier.value.usAnimState == Enum193.END_OPENSTRUCT) {
          TriggerNPCWithGivenApproach(pSoldier.value.ubProfile, Enum296.APPROACH_DONE_OPEN_STRUCTURE, TRUE);
          // TriggerNPCWithGivenApproach( pSoldier->ubProfile, APPROACH_DONE_OPEN_STRUCTURE, FALSE );
        } else if (pSoldier.value.usAnimState == Enum193.PICKUP_ITEM || pSoldier.value.usAnimState == Enum193.ADJACENT_GET_ITEM) {
          TriggerNPCWithGivenApproach(pSoldier.value.ubProfile, Enum296.APPROACH_DONE_GET_ITEM, TRUE);
        }
      }
      ActionDone(pSoldier);
    }
  }
}

function FreeUpNPCFromAttacking(ubID: UINT8): void {
  let pSoldier: Pointer<SOLDIERTYPE>;

  pSoldier = MercPtrs[ubID];
  ActionDone(pSoldier);
  pSoldier.value.bNeedToLook = TRUE;

  /*
          if (pSoldier->bActionInProgress)
          {
  #ifdef TESTAI
                  DebugMsg( TOPIC_JA2AI, DBG_LEVEL_0, String( "FreeUpNPCFromAttacking for %d", pSoldier->ubID ) );
  #endif
                  if (pSoldier->bAction == AI_ACTION_FIRE_GUN)
                  {
                          if (pSoldier->bDoBurst)
                          {
                                  if (pSoldier->bBulletsLeft == 0)
                                  {
                                          // now find the target and have them say "close call" quote if
                                          // applicable
                                          pTarget = SimpleFindSoldier( pSoldier->sTargetGridNo, pSoldier->bTargetLevel );
                                          if (pTarget && pTarget->bTeam == OUR_TEAM && pTarget->fCloseCall && pTarget->bShock == 0)
                                          {
                                                  // say close call quote!
                                                  TacticalCharacterDialogue( pTarget, QUOTE_CLOSE_CALL );
                                                  pTarget->fCloseCall = FALSE;
                                          }
                                          ActionDone(pSoldier);
                                          pSoldier->bDoBurst = FALSE;
                                  }
                          }
                          else
                          {
                                  pTarget = SimpleFindSoldier( pSoldier->sTargetGridNo, pSoldier->bTargetLevel );
                                  if (pTarget && pTarget->bTeam == OUR_TEAM && pTarget->fCloseCall && pTarget->bShock == 0)
                                  {
                                          // say close call quote!
                                          TacticalCharacterDialogue( pTarget, QUOTE_CLOSE_CALL );
                                          pTarget->fCloseCall = FALSE;
                                  }
                                  ActionDone(pSoldier);
                          }
                  }
                  else if ((pSoldier->bAction == AI_ACTION_TOSS_PROJECTILE) || (pSoldier->bAction == AI_ACTION_KNIFE_STAB))
                  {
                          ActionDone(pSoldier);
                  }
          }

          // DO WE NEED THIS???
          //pSoldier->sTarget = NOWHERE;

          // make him look in case he turns to face a new direction
          pSoldier->bNeedToLook = TRUE;

          // This is here to speed up resolution of interrupts that have already been
          // delayed while AttackingPerson was still set (causing ChangeControl to
          // bail).  Without it, an interrupt would have to wait until next ani frame!
          //if (SwitchTo > -1)
          //  ChangeControl();
          */
}

function FreeUpNPCFromLoweringGun(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier && pSoldier.value.bAction == Enum289.AI_ACTION_LOWER_GUN) {
    ActionDone(pSoldier);
  }
}

function FreeUpNPCFromTurning(pSoldier: Pointer<SOLDIERTYPE>, bLook: INT8): void {
  // if NPC is in the process of changing facing, mark him as being done!
  if ((pSoldier.value.bAction == Enum289.AI_ACTION_CHANGE_FACING) && pSoldier.value.bActionInProgress) {
    ActionDone(pSoldier);

    if (bLook) {
      // HandleSight(pSoldier,SIGHT_LOOK | SIGHT_RADIO); // no interrupt possible
    }
  }
}

function FreeUpNPCFromStanceChange(pSoldier: Pointer<SOLDIERTYPE>): void {
  // are we/were we doing something?
  if (pSoldier.value.bActionInProgress) {
    // check and see if we were changing stance
    if (pSoldier.value.bAction == Enum289.AI_ACTION_CHANGE_STANCE || pSoldier.value.bAction == Enum289.AI_ACTION_COWER || pSoldier.value.bAction == Enum289.AI_ACTION_STOP_COWERING) {
      // yes we were - are we finished?
      if (gAnimControl[pSoldier.value.usAnimState].ubHeight == pSoldier.value.usActionData) {
        // yes! Free us up to do other fun things
        ActionDone(pSoldier);
      }
    }
  }
}

function FreeUpNPCFromRoofClimb(pSoldier: Pointer<SOLDIERTYPE>): void {
  // are we/were we doing something?
  if (pSoldier.value.bActionInProgress) {
    // check and see if we were climbing
    if (pSoldier.value.bAction == Enum289.AI_ACTION_CLIMB_ROOF) {
      // yes! Free us up to do other fun things
      ActionDone(pSoldier);
    }
  }
}

function ActionDone(pSoldier: Pointer<SOLDIERTYPE>): void {
  // if an action is currently selected
  if (pSoldier.value.bAction != Enum289.AI_ACTION_NONE) {
    if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
    }

    // If doing an attack, reset attack busy count and # of bullets
    // if ( gTacticalStatus.ubAttackBusyCount )
    //{
    //	gTacticalStatus.ubAttackBusyCount = 0;
    //	DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String( "Setting attack busy count to 0 due to Action Done" ) );
    //	pSoldier->bBulletsLeft = 0;
    //}

    // cancel any turning & movement by making current settings desired ones
    pSoldier.value.sFinalDestination = pSoldier.value.sGridNo;

    if (!pSoldier.value.fNoAPToFinishMove) {
      EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
      AdjustNoAPToFinishMove(pSoldier, FALSE);
    }

    // cancel current action
    pSoldier.value.bLastAction = pSoldier.value.bAction;
    pSoldier.value.bAction = Enum289.AI_ACTION_NONE;
    pSoldier.value.usActionData = NOWHERE;
    pSoldier.value.bActionInProgress = FALSE;
    pSoldier.value.fDelayedMovement = FALSE;

    /*
                    if ( pSoldier->bLastAction == AI_ACTION_CHANGE_STANCE || pSoldier->bLastAction == AI_ACTION_COWER || pSoldier->bLastAction == AI_ACTION_STOP_COWERING )
                    {
                            SoldierGotoStationaryStance( pSoldier );
                    }
                    */

    // make sure pathStored is not left TRUE by accident.
    // This is possible if we decide on an action that we have no points for
    // (but which set pathStored).  The action is retained until next turn,
    // although NewDest isn't called.  A newSit. could cancel it before then!
    pSoldier.value.bPathStored = FALSE;
  }
}

// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////

//	O L D    D G    A I    C O D E

// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////

// GLOBALS:

let SkipCoverCheck: UINT8 = FALSE;
let Threat: THREATTYPE[] /* [MAXMERCS] */;

// threat percentage is based on the certainty of opponent knowledge:
// opplist value:        -4  -3  -2  -1 SEEN  1    2   3   4   5
let ThreatPercent: int[] /* [10] */ = [
  20,
  40,
  60,
  80,
  25,
  100,
  90,
  75,
  60,
  45,
];

function NPCDoesAct(pSoldier: Pointer<SOLDIERTYPE>): void {
  // if the action is visible and we're in a hidden turnbased mode, go to turnbased
  if (gTacticalStatus.uiFlags & TURNBASED && !(gTacticalStatus.uiFlags & INCOMBAT) && (pSoldier.value.bAction == Enum289.AI_ACTION_FIRE_GUN || pSoldier.value.bAction == Enum289.AI_ACTION_TOSS_PROJECTILE || pSoldier.value.bAction == Enum289.AI_ACTION_KNIFE_MOVE || pSoldier.value.bAction == Enum289.AI_ACTION_KNIFE_STAB || pSoldier.value.bAction == Enum289.AI_ACTION_THROW_KNIFE)) {
    DisplayHiddenTurnbased(pSoldier);
  }

  if (gfHiddenInterrupt) {
    DisplayHiddenInterrupt(pSoldier);
  }
  // StartInterruptVisually(pSoldier->ubID);
  // *** IAN deleted lots of interrupt related code here to simplify JA2	development

  // CJC Feb 18 99: make sure that soldier is not in the middle of a turn due to visual crap to make enemies
  // face and point their guns at us
  if (pSoldier.value.bDesiredDirection != pSoldier.value.bDirection) {
    pSoldier.value.bDesiredDirection = pSoldier.value.bDirection;
  }
}

function NPCDoesNothing(pSoldier: Pointer<SOLDIERTYPE>): void {
  // NPC, for whatever reason, did/could not start an action, so end his turn
  // pSoldier->moved = TRUE;

  EndAIGuysTurn(pSoldier);

  // *** IAN deleted lots of interrupt related code here to simplify JA2	development
}

function CancelAIAction(pSoldier: Pointer<SOLDIERTYPE>, ubForce: UINT8): void {
  // re-enable cover checking, something is new or something strange happened
  SkipCoverCheck = FALSE;

  // turn off new situation flag to stop this from repeating all the time!
  if (pSoldier.value.bNewSituation == IS_NEW_SITUATION) {
    pSoldier.value.bNewSituation = WAS_NEW_SITUATION;
  }

  // NPCs getting escorted do NOT react to new situations, unless forced!
  if (pSoldier.value.bUnderEscort && !ubForce)
    return;

  // turn off RED/YELLOW status "bypass to Green", to re-check all actions
  pSoldier.value.bBypassToGreen = FALSE;

  ActionDone(pSoldier);
}

/*
void ActionTimeoutExceeded(SOLDIERTYPE *pSoldier, UCHAR alreadyFreedUp)
{
 int cnt;
 UCHAR attackAction = FALSE;


#ifdef BETAVERSION
 if (ConvertedMultiSave)
  {
   // re-start real-time NPC action timer
   EnemyTimedOut = FALSE;
   EnemyTimerCnt = ENEMYWAITTOLERANCE;
   return;
  }
#endif


 // check if it's a problem with a offensive combat action
 if ((pSoldier->bAction == AI_ACTION_FIRE_GUN) ||
     (pSoldier->bAction == AI_ACTION_TOSS_PROJECTILE) ||
     (pSoldier->bAction == AI_ACTION_KNIFE_STAB))
  {
   // THESE ARE LESS SERIOUS, SINCE THEY LIKELY WON'T REPEAT THEMSELVES
   attackAction = TRUE;
  }
   // OTHERS ARE VERY SERIOUS, SINCE THEY ARE LIKELY TO REPEAT THEMSELVES


#ifdef BETAVERSION
 sprintf(tempstr,"ActionInProgress - ERROR: %s's timeout limit exceeded.  Action #%d (%d)",
                pSoldier->name,pSoldier->bAction,pSoldier->usActionData);

#ifdef RECORDNET
 fprintf(NetDebugFile,"\n%s\n\n",tempstr);
#endif

 PopMessage(tempstr);
 SaveGame(ERROR_SAVE);
#endif

#ifdef TESTVERSION
 PopMessage("FULL SOLDIER INFORMATION DUMP COMING UP, BRACE THYSELF!");
 DumpSoldierInfo(pSoldier);
#endif


 // re-start real-time NPC action timer
 EnemyTimedOut = FALSE;
 EnemyTimerCnt = ENEMYWAITTOLERANCE;

 if (attackAction)
  {
#ifdef BETAVERSION
   NameMessage(pSoldier,"will now be freed up from attacking...",2000);
#endif


   // free up ONLY players from whom we haven't received an AI_ACTION_DONE yet
   // we can all agree the action is DONE and we can continue...
   // (otherwise they'll be calling FreeUp... twice and get REAL screwed up)
   NetSend.msgType = NET_FREE_UP_ATTACK;
   NetSend.ubID  = pSoldier->ubID;

   for (cnt = 0; cnt < MAXPLAYERS; cnt++)
    {
     if ((cnt != Net.pnum) && Net.player[cnt].playerActive &&
         (Net.player[cnt].actionDone != pSoldier->ubID))
       SendNetData(cnt);
    }

   if (!alreadyFreedUp)
     FreeUpManFromAttacking(pSoldier->ubID,COMMUNICATE);
  }
 else if (pSoldier->bAction == AI_ACTION_CHANGE_FACING)
  {
#ifdef BETAVERSION
   NameMessage(pSoldier,"will now be freed up from turning...",2000);
#endif

   // force him to face in the right direction (as long as it's legal)
   if ((pSoldier->bDesiredDirection >= 1) && (pSoldier->bDesiredDirection <= 8))
     pSoldier->bDirection = pSoldier->bDesiredDirection;
   else
     pSoldier->bDesiredDirection = pSoldier->bDirection;

   // free up ONLY players from whom we haven't received an AI_ACTION_DONE yet
   // we can all agree the action is DONE and we can continue...
   // (otherwise they'll be calling FreeUp... twice and get REAL screwed up)
   NetSend.msgType    = NET_FREE_UP_TURN;
   NetSend.ubID     = pSoldier->ubID;
   NetSend.misc_UCHAR = pSoldier->bDirection;
   NetSend.answer     = pSoldier->bDesiredDirection;

   for (cnt = 0; cnt < MAXPLAYERS; cnt++)
    {
     if ((cnt != Net.pnum) && Net.player[cnt].playerActive &&
         (Net.player[cnt].actionDone != pSoldier->ubID))
       SendNetData(cnt);
    }

   if (!alreadyFreedUp)
     // this calls FreeUpManFromTurning()
     NowFacingRightWay(pSoldier,COMMUNICATE);
  }
 else
  {
#ifdef BETAVERSION
   NameMessage(pSoldier,"is having the remainder of his turn canceled...",1000);
#endif

   // cancel the remainder of the offender's turn as a penalty!
   pSoldier->bActionPoints = 0;
   NPCDoesNothing(pSoldier);
  }


 // cancel whatever the current action is, force this even for escorted NPCs
 CancelAIAction(pSoldier,FORCE);


 // reset the timeout counter for next time
 pSoldier->bActionTimeout = 0;
}
*/

function ActionInProgress(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  // if NPC has a desired destination, but isn't currently going there
  if ((pSoldier.value.sFinalDestination != NOWHERE) && (pSoldier.value.sDestination != pSoldier.value.sFinalDestination)) {
    // return success (TRUE) if we successfully resume the movement
    return TryToResumeMovement(pSoldier, pSoldier.value.sFinalDestination);
  }

  // this here should never happen, but it seems to (turns sometimes hang!)
  if ((pSoldier.value.bAction == Enum289.AI_ACTION_CHANGE_FACING) && (pSoldier.value.bDesiredDirection != pSoldier.value.usActionData)) {
    // don't try to pay any more APs for this, it was paid for once already!
    pSoldier.value.bDesiredDirection = pSoldier.value.usActionData; // turn to face direction in actionData
    return TRUE;
  }

  // needs more time to complete action
  return TRUE;
}

/*
void RestoreMarkedMines()
{
 int gridno;

 // all tiles marked with the special NPC mine cost value must be restored
 for (gridno = 0; gridno < GRIDSIZE; gridno++)
  {
   if (GridCost[gridno] == NPCMINECOST)
    {
     GridCost[gridno] = BackupGridCost[gridno];

#ifdef TESTMINEMARKING
     fprintf(NetDebugFile,"\tRestoring marked mine at gridno %d back to gridCost %d\n",gridno,BackupGridCost[gridno]);
#endif
    }
  }

 MarkedNPCMines = FALSE;
}



void MarkDetectableMines(SOLDIERTYPE *pSoldier)
{
 int gridno,detectLevel;
 GRIDINFO *gpSoldier;


 // this should happen, means we missed a clean-up cycle last time!
 if (MarkedNPCMines)
  {
#ifdef BETAVERSION
   sprintf(tempstr,"MarkDetectableMines: ERROR - mines still marked!  Guynum %d",pSoldier->ubID);

#ifdef RECORDNET
   fprintf(NetDebugFile,"\n\t%s\n\n",tempstr);
#endif

   PopMessage(tempstr);
#endif

   RestoreMarkedMines();
  }


 // make a backup of the current gridcosts
 memcpy(BackupGridCost,GridCost,sizeof(GridCost));

 // calculate what "level" of mines we are able to detect
 detectLevel = CalcMineDetectLevel(pSoldier);


 // check every tile, looking for BURIED mines only
 for (gridno = 0,gpSoldier = &Grid[0]; gridno < GRIDSIZE; gridno++,gpSoldier++)
  {
   // if there's a valid object there, and it is still "buried"
   if ((gpSoldier->object < 255) &&
       (ObjList[gpSoldier->object].visible == BURIED) &&
       (ObjList[gpSoldier->object].item == MINE))
    {
     // are we bright enough to detect it (should we get there) ?
     if (detectLevel >= ObjList[gpSoldier->object].trap)
      {
       // bingo!  Mark it as "unpassable" for the purposes of the path AI
       GridCost[gridno] = NPCMINECOST;
       MarkedNPCMines = TRUE;

#ifdef TESTMINEMARKING
       fprintf(NetDebugFile,"\tNPC %d, dtctLvl %d, marking mine at gridno %d, gridCost was %d\n",pSoldier->ubID,detectLevel,gridno,BackupGridCost[gridno]);
#endif
      }
    }
  }
}

*/

function TurnBasedHandleNPCAI(pSoldier: Pointer<SOLDIERTYPE>): void {
  /*
   if (Status.gamePaused)
    {
  #ifdef DEBUGBUSY
     DebugAI("HandleManAI - Skipping %d, the game is paused\n",pSoldier->ubID);
  #endif

     return;
    }
  //

   // If man is inactive/at base/dead/unconscious
   if (!pSoldier->bActive || !pSoldier->bInSector || (pSoldier->bLife < OKLIFE))
    {
  #ifdef DEBUGDECISIONS
     AINumMessage("HandleManAI - Unavailable man, skipping guy#",pSoldier->ubID);
  #endif

     NPCDoesNothing(pSoldier);
     return;
    }

   if (PTR_CIVILIAN && pSoldier->service &&
       (pSoldier->bNeutral || MedicsMissionIsEscort(pSoldier)))
    {
  #ifdef DEBUGDECISIONS
     AINumMessage("HandleManAI - Civilian is being serviced, skipping guy#",pSoldier->ubID);
  #endif

     NPCDoesNothing(pSoldier);
     return;
    }
  */

  /*
  anim = pSoldier->anitype[pSoldier->anim];

  // If man is down on the ground
  if (anim < BREATHING)
   {
    // if he lacks the breath, or APs to get up this turn (life checked above)
    // OR... (new June 13/96 Ian) he's getting first aid...
    if ((pSoldier->bBreath < OKBREATH) || (pSoldier->bActionPoints < (AP_GET_UP + AP_ROLL_OVER))
        || pSoldier->service)
     {
 #ifdef RECORDNET
      fprintf(NetDebugFile,"\tAI: %d can't get up (breath %d, AP %d), ending his turn\n",
                 pSoldier->ubID,pSoldier->bBreath,pSoldier->bActionPoints);
 #endif
 #ifdef DEBUGDECISIONS
      AINumMessage("HandleManAI - CAN'T GET UP, skipping guy #",pSoldier->ubID);
 #endif

      NPCDoesNothing(pSoldier);
      return;
     }
    else
     {
      // wait until he gets up first, only then worry about deciding his AI

 #ifdef RECORDNET
      fprintf(NetDebugFile,"\tAI: waiting for %d to GET UP (breath %d, AP %d)\n",
                 pSoldier->ubID,pSoldier->bBreath,pSoldier->bActionPoints);
 #endif

 #ifdef DEBUGBUSY
      AINumMessage("HandleManAI - About to get up, skipping guy#",pSoldier->ubID);
 #endif

      return;
     }
   }


  // if NPC's has been forced to stop by an opponent's interrupt or similar
  if (pSoldier->forcedToStop)
   {
 #ifdef DEBUGBUSY
    AINumMessage("HandleManAI - Forced to stop, skipping guy #",pSoldier->ubID);
 #endif

    return;
   }

  // if we are still in the midst in an uninterruptable animation
  if (!AnimControl[anim].interruptable)
   {
 #ifdef DEBUGBUSY
    AINumMessage("HandleManAI - uninterruptable animation, skipping guy #",pSoldier->ubID);
 #endif

    return;      // wait a while, let the animation finish first
   }

 */

  // yikes, this shouldn't occur! we should be trying to finish our move!
  // pSoldier->fNoAPToFinishMove = FALSE;

  // unless in mid-move, get an up-to-date alert status for this guy
  if (pSoldier.value.bStopped) {
    // if active team is waiting for oppChanceToDecide, that means we have NOT
    // had a chance to go through NewSelectedNPC(), so do the refresh here
    /*
    ???
    if (gTacticalStatus.team[Net.turnActive].allowOppChanceToDecide)
    {
            // if mines are still marked (this could happen if we also control the
            // active team that's potentially BEING interrupted), unmark them
            //RestoreMarkedMines();

            RefreshAI(pSoldier);
    }
    else
    {
            DecideAlertStatus(pSoldier);
    }
    */
  }

  /*
          // move this clause outside of the function...
          if (pSoldier->bNewSituation)
                  // don't force, don't want escorted mercs reacting to new opponents, etc.
                  CancelAIAction(pSoldier,DONTFORCE);

  */

  /*
  if (!pSoldier->stopped)
   {
 #ifdef DEBUGBUSY
    AINumMessage("HandleManAI - Moving, skipping guy#",pSoldier->ubID);
 #endif

    return;
   }
 */

  if ((pSoldier.value.bAction != Enum289.AI_ACTION_NONE) && pSoldier.value.bActionInProgress) {
    /*
                            if (pSoldier->bAction == AI_ACTION_RANDOM_PATROL)
                            {
                                    if (pSoldier->usPathIndex == pSoldier->usPathDataSize)
                                    //if (pSoldier->usActionData == pSoldier->sGridNo )
                                    //(IC?) if (pSoldier->bAction == AI_ACTION_RANDOM_PATROL && ( pSoldier->usPathIndex == pSoldier->usPathDataSize ) )
                                    //(old?) if (pSoldier->bAction == AI_ACTION_RANDOM_PATROL && ( pSoldier->usActionData == pSoldier->sGridNo ) )
                                    {
            #ifdef TESTAI
                                            DebugMsg( TOPIC_JA2AI, DBG_LEVEL_0, String("OPPONENT %d REACHES DEST - ACTION DONE",pSoldier->ubID ) );
            #endif
                                            ActionDone(pSoldier);
                                    }

                                    //*** TRICK- TAKE INTO ACCOUNT PAUSED FOR NO TIME ( FOR NOW )
                                    if (pSoldier->fNoAPToFinishMove)
                                    //if (pSoldier->bAction == AI_ACTION_RANDOM_PATROL && pSoldier->fNoAPToFinishMove)
                                    {
                                            // OK, we have a move to finish...

            #ifdef TESTAI
                                            DebugMsg( TOPIC_JA2AI, DBG_LEVEL_0, String("GONNA TRY TO CONTINUE PATH FOR %d", pSoldier->ubID ) );
            #endif

                                            SoldierTriesToContinueAlongPath(pSoldier);

                                            // since we just gave up on our action due to running out of points, better end our turn
                                            //EndAIGuysTurn(pSoldier);
                                    }
                            }
    */

    // if action should remain in progress
    if (ActionInProgress(pSoldier)) {
      // let it continue
      return;
    }
  }

  // if man has nothing to do
  if (pSoldier.value.bAction == Enum289.AI_ACTION_NONE) {
    // make sure this flag is turned off (it already should be!)
    pSoldier.value.bActionInProgress = FALSE;

    // Since we're NEVER going to "continue" along an old path at this point,
    // then it would be nice place to reinitialize "pathStored" flag for
    // insurance purposes.
    //
    // The "pathStored" variable controls whether it's necessary to call
    // findNewPath() after you've called NewDest(). Since the AI calls
    // findNewPath() itself, a speed gain can be obtained by avoiding
    // redundancy.
    //
    // The "normal" way for pathStored to be reset is inside
    // SetNewCourse() [which gets called after NewDest()].
    //
    // The only reason we would NEED to reinitialize it here is if I've
    // incorrectly set pathStored to TRUE in a process that doesn't end up
    // calling NewDest()
    pSoldier.value.bPathStored = FALSE;

    // decide on the next action
    if (pSoldier.value.bNextAction != Enum289.AI_ACTION_NONE) {
      // do the next thing we have to do...
      if (pSoldier.value.bNextAction == Enum289.AI_ACTION_END_COWER_AND_MOVE) {
        if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
          pSoldier.value.bAction = Enum289.AI_ACTION_STOP_COWERING;
          pSoldier.value.usActionData = ANIM_STAND;
        } else if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight < ANIM_STAND) {
          // stand up!
          pSoldier.value.bAction = Enum289.AI_ACTION_CHANGE_STANCE;
          pSoldier.value.usActionData = ANIM_STAND;
        } else {
          pSoldier.value.bAction = Enum289.AI_ACTION_NONE;
        }
        if (pSoldier.value.sGridNo == pSoldier.value.usNextActionData) {
          // no need to walk after this
          pSoldier.value.bNextAction = Enum289.AI_ACTION_NONE;
          pSoldier.value.usNextActionData = NOWHERE;
        } else {
          pSoldier.value.bNextAction = Enum289.AI_ACTION_WALK;
          // leave next-action-data as is since that's where we want to go
        }
      } else {
        pSoldier.value.bAction = pSoldier.value.bNextAction;
        pSoldier.value.usActionData = pSoldier.value.usNextActionData;
        pSoldier.value.bTargetLevel = pSoldier.value.bNextTargetLevel;
        pSoldier.value.bNextAction = Enum289.AI_ACTION_NONE;
        pSoldier.value.usNextActionData = 0;
        pSoldier.value.bNextTargetLevel = 0;
      }
      if (pSoldier.value.bAction == Enum289.AI_ACTION_PICKUP_ITEM) {
        // the item pool index was stored in the special data field
        pSoldier.value.uiPendingActionData1 = pSoldier.value.iNextActionSpecialData;
      }
    } else if (pSoldier.value.sAbsoluteFinalDestination != NOWHERE) {
      if (ACTING_ON_SCHEDULE(pSoldier)) {
        pSoldier.value.bAction = Enum289.AI_ACTION_SCHEDULE_MOVE;
      } else {
        pSoldier.value.bAction = Enum289.AI_ACTION_WALK;
      }
      pSoldier.value.usActionData = pSoldier.value.sAbsoluteFinalDestination;
    } else {
      if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
        if (CREATURE_OR_BLOODCAT(pSoldier)) {
          pSoldier.value.bAction = CreatureDecideAction(pSoldier);
        } else if (pSoldier.value.ubBodyType == Enum194.CROW) {
          pSoldier.value.bAction = CrowDecideAction(pSoldier);
        } else {
          pSoldier.value.bAction = DecideAction(pSoldier);
        }
      }
    }

    if (pSoldier.value.bAction == Enum289.AI_ACTION_ABSOLUTELY_NONE) {
      pSoldier.value.bAction = Enum289.AI_ACTION_NONE;
    }

    // if he chose to continue doing nothing
    if (pSoldier.value.bAction == Enum289.AI_ACTION_NONE) {
      NPCDoesNothing(pSoldier); // sets pSoldier->moved to TRUE
      return;
    }

    /*
    // if we somehow just caused an uninterruptable animation to occur
    // This is mainly to finish a weapon_AWAY anim that preceeds a TOSS attack
    if (!AnimControl[ pSoldier->anitype[pSoldier->anim] ].interruptable)
     {
   #ifdef DEBUGBUSY
      DebugAI( String( "Uninterruptable animation %d, skipping guy %d",pSoldier->anitype[pSoldier->anim],pSoldier->ubID ) );
   #endif

      return;      // wait a while, let the animation finish first
     }
           */

    // to get here, we MUST have an action selected, but not in progress...

    // see if we can afford to do this action
    if (IsActionAffordable(pSoldier)) {
      NPCDoesAct(pSoldier);

      // perform the chosen action
      pSoldier.value.bActionInProgress = ExecuteAction(pSoldier); // if started, mark us as busy

      if (!pSoldier.value.bActionInProgress && pSoldier.value.sAbsoluteFinalDestination != NOWHERE) {
        // turn based... abort this guy's turn
        EndAIGuysTurn(pSoldier);
      }
    } else {
      HaltMoveForSoldierOutOfPoints(pSoldier);
      return;
    }
  }
}

function RefreshAI(pSoldier: Pointer<SOLDIERTYPE>): void {
  // produce our own private "mine map" so we can avoid the ones we can detect
  // MarkDetectableMines(pSoldier);

  // whether last attack hit or not doesn't matter once control has been lost
  pSoldier.value.bLastAttackHit = FALSE;

  // get an up-to-date alert status for this guy
  DecideAlertStatus(pSoldier);

  if (pSoldier.value.bAlertStatus == Enum243.STATUS_YELLOW)
    SkipCoverCheck = FALSE;

  // if he's in battle or knows opponents are here
  if (gfTurnBasedAI) {
    if ((pSoldier.value.bAlertStatus == Enum243.STATUS_BLACK) || (pSoldier.value.bAlertStatus == Enum243.STATUS_RED)) {
      // always freshly rethink things at start of his turn
      pSoldier.value.bNewSituation = IS_NEW_SITUATION;
    } else {
      // make sure any paths stored during out last AI decision but not reacted
      // to (probably due to lack of APs) get re-tested by the ExecuteAction()
      // function in AI, since the ->sDestination may no longer be legal now!
      pSoldier.value.bPathStored = FALSE;

      // if not currently engaged, or even alerted
      // take a quick look around to see if any friends seem to be in trouble
      ManChecksOnFriends(pSoldier);

      // allow stationary GREEN Civilians to turn again at least 1/turn!
    }
    pSoldier.value.bLastAction = Enum289.AI_ACTION_NONE;
  }
}

function AIDecideRadioAnimation(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier.value.ubBodyType != Enum194.REGMALE && pSoldier.value.ubBodyType != Enum194.BIGMALE) {
    // no animation available
    ActionDone(pSoldier);
    return;
  }

  if (PTR_CIVILIAN() && pSoldier.value.ubCivilianGroup != Enum246.KINGPIN_CIV_GROUP) {
    // don't play anim
    ActionDone(pSoldier);
    return;
  }

  switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
    case ANIM_STAND:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.AI_RADIO, 0, FALSE);
      break;

    case ANIM_CROUCH:

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.AI_CR_RADIO, 0, FALSE);
      break;

    case ANIM_PRONE:

      ActionDone(pSoldier);
      break;
  }
}

function ExecuteAction(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iRetCode: INT32;
  // NumMessage("ExecuteAction - Guy#",pSoldier->ubID);

  // in most cases, merc will change location, or may cause damage to opponents,
  // so a new cover check will be necessary.  Exceptions handled individually.
  SkipCoverCheck = FALSE;

  // reset this field, too
  pSoldier.value.bLastAttackHit = FALSE;

  DebugAI(String("%d does %s (a.d. %d) at time %ld", pSoldier.value.ubID, gzActionStr[pSoldier.value.bAction], pSoldier.value.usActionData, GetJA2Clock()));

  switch (pSoldier.value.bAction) {
    case Enum289.AI_ACTION_NONE: // maintain current position & facing
      // do nothing
      break;

    case Enum289.AI_ACTION_WAIT: // hold AI_ACTION_NONE for a specified time
      if (gfTurnBasedAI) {
        // probably an action set as a next-action in the realtime prior to combat
        // do nothing
      } else {
        RESETTIMECOUNTER(pSoldier.value.AICounter, pSoldier.value.usActionData);
        if (pSoldier.value.ubProfile != NO_PROFILE) {
          // DebugMsg( TOPIC_JA2, DBG_LEVEL_0, String( "%s waiting %d from %d", pSoldier->name, pSoldier->AICounter, GetJA2Clock() ) );
        }
      }
      ActionDone(pSoldier);
      break;

    case Enum289.AI_ACTION_CHANGE_FACING: // turn this way & that to look
      // as long as we don't see anyone new, cover won't have changed
      // if we see someone new, it will cause a new situation & remove this
      SkipCoverCheck = TRUE;

      //			pSoldier->bDesiredDirection = (UINT8) ;   // turn to face direction in actionData
      SendSoldierSetDesiredDirectionEvent(pSoldier, pSoldier.value.usActionData);
      // now we'll have to wait for the turning to finish; no need to call TurnSoldier here
      // TurnSoldier( pSoldier );
      /*
                              if (!StartTurn(pSoldier,pSoldier->usActionData,FASTTURN))
                              {
      #ifdef BETAVERSION
                                      sprintf(tempstr,"ERROR: %s tried TURN to direction %d, StartTurn failed, action %d CANCELED",
                                                      pSoldier->name,pSoldier->usActionData,pSoldier->bAction);
                                      PopMessage(tempstr);
      #endif

                                      // ZAP NPC's remaining action points so this isn't likely to repeat
                                      pSoldier->bActionPoints = 0;

                                      CancelAIAction(pSoldier,FORCE);
                                      return(FALSE);         // nothing is in progress
                              }
                              else
                              {
      #ifdef RECORDNET
                                      fprintf(NetDebugFile,"\tAI decides to turn guynum %d to dir %d\n",pSoldier->ubID,pSoldier->usActionData);
      #endif
                                      NetLookTowardsDir(pSoldier,pSoldier->usActionData);
                              }
                              */
      break;

    case Enum289.AI_ACTION_PICKUP_ITEM: // grab something!
      SoldierPickupItem(pSoldier, pSoldier.value.uiPendingActionData1, pSoldier.value.usActionData, 0);
      break;

    case Enum289.AI_ACTION_DROP_ITEM: // drop item in hand
      SoldierDropItem(pSoldier, addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      DeleteObj(addressof(pSoldier.value.inv[Enum261.HANDPOS]));
      pSoldier.value.bAction = Enum289.AI_ACTION_PENDING_ACTION;
      break;

    case Enum289.AI_ACTION_MOVE_TO_CLIMB:
      if (pSoldier.value.usActionData == pSoldier.value.sGridNo) {
        // change action to climb now and try that.
        pSoldier.value.bAction = Enum289.AI_ACTION_CLIMB_ROOF;
        if (IsActionAffordable(pSoldier)) {
          return ExecuteAction(pSoldier);
        } else {
          // no action started
          return FALSE;
        }
      }
      // fall through
    case Enum289.AI_ACTION_RANDOM_PATROL: // move towards a particular location
    case Enum289.AI_ACTION_SEEK_FRIEND: // move towards friend in trouble
    case Enum289.AI_ACTION_SEEK_OPPONENT: // move towards a reported opponent
    case Enum289.AI_ACTION_TAKE_COVER: // run for nearest cover from threat
    case Enum289.AI_ACTION_GET_CLOSER: // move closer to a strategic location

    case Enum289.AI_ACTION_POINT_PATROL: // move towards next patrol point
    case Enum289.AI_ACTION_LEAVE_WATER_GAS: // seek nearest spot of ungassed land
    case Enum289.AI_ACTION_SEEK_NOISE: // seek most important noise heard
    case Enum289.AI_ACTION_RUN_AWAY: // run away from nearby opponent(s)

    case Enum289.AI_ACTION_APPROACH_MERC: // walk up to someone to talk
    case Enum289.AI_ACTION_TRACK: // track by ground scent
    case Enum289.AI_ACTION_EAT: // monster approaching corpse
    case Enum289.AI_ACTION_SCHEDULE_MOVE:
    case Enum289.AI_ACTION_WALK:
    case Enum289.AI_ACTION_RUN:

      if (gfTurnBasedAI && pSoldier.value.bAlertStatus < Enum243.STATUS_BLACK) {
        if (pSoldier.value.sLastTwoLocations[0] == NOWHERE) {
          pSoldier.value.sLastTwoLocations[0] = pSoldier.value.sGridNo;
        } else if (pSoldier.value.sLastTwoLocations[1] == NOWHERE) {
          pSoldier.value.sLastTwoLocations[1] = pSoldier.value.sGridNo;
        }
        // check for loop
        else if (pSoldier.value.usActionData == pSoldier.value.sLastTwoLocations[1] && pSoldier.value.sGridNo == pSoldier.value.sLastTwoLocations[0]) {
          DebugAI(String("%d in movement loop, aborting turn", pSoldier.value.ubID));

          // loop found!
          ActionDone(pSoldier);
          EndAIGuysTurn(pSoldier);
        } else {
          pSoldier.value.sLastTwoLocations[0] = pSoldier.value.sLastTwoLocations[1];
          pSoldier.value.sLastTwoLocations[1] = pSoldier.value.sGridNo;
        }
      }

      // Randomly do growl...
      if (pSoldier.value.ubBodyType == Enum194.BLOODCAT) {
        if ((gTacticalStatus.uiFlags & INCOMBAT)) {
          if (Random(2) == 0) {
            PlaySoldierJA2Sample(pSoldier.value.ubID, (Enum330.BLOODCAT_GROWL_1 + Random(4)), RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo), TRUE);
          }
        }
      }

      // on YELLOW/GREEN status, NPCs keep the actions from turn to turn
      // (newSituation is intentionally NOT set in NewSelectedNPC()), so the
      // possibility exists that NOW the actionData is no longer a valid
      // NPC ->sDestination (path got blocked, someone is now standing at that
      // gridno, etc.)  So we gotta check again that the ->sDestination's legal!

      // optimization - Ian (if up-to-date path is known, do not check again)
      if (!pSoldier.value.bPathStored) {
        if ((pSoldier.value.sAbsoluteFinalDestination != NOWHERE || gTacticalStatus.fAutoBandageMode) && !(gTacticalStatus.uiFlags & INCOMBAT)) {
          // NPC system move, allow path through
          if (LegalNPCDestination(pSoldier, pSoldier.value.usActionData, ENSURE_PATH, WATEROK, PATH_THROUGH_PEOPLE)) {
            // optimization - Ian: prevent another path call in SetNewCourse()
            pSoldier.value.bPathStored = TRUE;
          }
        } else {
          if (LegalNPCDestination(pSoldier, pSoldier.value.usActionData, ENSURE_PATH, WATEROK, 0)) {
            // optimization - Ian: prevent another path call in SetNewCourse()
            pSoldier.value.bPathStored = TRUE;
          }
        }

        // if we STILL don't have a path
        if (!pSoldier.value.bPathStored) {
          // Check if we were told to move by NPC stuff
          if (pSoldier.value.sAbsoluteFinalDestination != NOWHERE && !(gTacticalStatus.uiFlags & INCOMBAT)) {
            // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_ERROR, L"AI %s failed to get path for dialogue-related move!", pSoldier->name );

            // Are we close enough?
            if (!ACTING_ON_SCHEDULE(pSoldier) && SpacesAway(pSoldier.value.sGridNo, pSoldier.value.sAbsoluteFinalDestination) < 4) {
              // This is close enough...
              ReplaceLocationInNPCDataFromProfileID(pSoldier.value.ubProfile, pSoldier.value.sAbsoluteFinalDestination, pSoldier.value.sGridNo);
              NPCGotoGridNo(pSoldier.value.ubProfile, pSoldier.value.sGridNo, (pSoldier.value.ubQuoteRecord - 1));
            } else {
              // This is important, so try taking a path through people (and bumping them aside)
              if (LegalNPCDestination(pSoldier, pSoldier.value.usActionData, ENSURE_PATH, WATEROK, PATH_THROUGH_PEOPLE)) {
                // optimization - Ian: prevent another path call in SetNewCourse()
                pSoldier.value.bPathStored = TRUE;
              } else {
                // Have buddy wait a while...
                pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
                pSoldier.value.usNextActionData = REALTIME_AI_DELAY();
              }
            }

            if (!pSoldier.value.bPathStored) {
              CancelAIAction(pSoldier, FORCE);
              return (FALSE); // nothing is in progress
            }
          } else {
            CancelAIAction(pSoldier, FORCE);
            return (FALSE); // nothing is in progress
          }
        }
      }

      // add on anything necessary to traverse off map edge
      switch (pSoldier.value.ubQuoteActionID) {
        case Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST:
          pSoldier.value.sOffWorldGridNo = pSoldier.value.usActionData;
          AdjustSoldierPathToGoOffEdge(pSoldier, pSoldier.value.usActionData, Enum245.EAST);
          break;
        case Enum290.QUOTE_ACTION_ID_TRAVERSE_SOUTH:
          pSoldier.value.sOffWorldGridNo = pSoldier.value.usActionData;
          AdjustSoldierPathToGoOffEdge(pSoldier, pSoldier.value.usActionData, Enum245.SOUTH);
          break;
        case Enum290.QUOTE_ACTION_ID_TRAVERSE_WEST:
          pSoldier.value.sOffWorldGridNo = pSoldier.value.usActionData;
          AdjustSoldierPathToGoOffEdge(pSoldier, pSoldier.value.usActionData, Enum245.WEST);
          break;
        case Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH:
          pSoldier.value.sOffWorldGridNo = pSoldier.value.usActionData;
          AdjustSoldierPathToGoOffEdge(pSoldier, pSoldier.value.usActionData, Enum245.NORTH);
          break;
        default:
          break;
      }

      NewDest(pSoldier, pSoldier.value.usActionData); // set new ->sDestination to actionData

      // make sure it worked (check that pSoldier->sDestination == pSoldier->usActionData)
      if (pSoldier.value.sFinalDestination != pSoldier.value.usActionData) {
        // temporarily black list this gridno to stop enemy from going there
        pSoldier.value.sBlackList = pSoldier.value.usActionData;

        DebugAI(String("Setting blacklist for %d to %d", pSoldier.value.ubID, pSoldier.value.sBlackList));

        CancelAIAction(pSoldier, FORCE);
        return (FALSE); // nothing is in progress
      }

      // cancel any old black-listed gridno, got a valid new ->sDestination
      pSoldier.value.sBlackList = NOWHERE;
      break;

    case Enum289.AI_ACTION_ESCORTED_MOVE: // go where told to by escortPlayer
      // since this is a delayed move, gotta make sure that it hasn't become
      // illegal since escort orders were issued (->sDestination/route blocked).
      // So treat it like a CONTINUE movement, and handle errors that way
      if (!TryToResumeMovement(pSoldier, pSoldier.value.usActionData)) {
        // don't black-list anything here, and action already got canceled
        return (FALSE); // nothing is in progress
      }

      // cancel any old black-listed gridno, got a valid new ->sDestination
      pSoldier.value.sBlackList = NOWHERE;
      break;

    case Enum289.AI_ACTION_TOSS_PROJECTILE: // throw grenade at/near opponent(s)
      LoadWeaponIfNeeded(pSoldier);
      // drop through here...

    case Enum289.AI_ACTION_KNIFE_MOVE: // preparing to stab opponent
      if (pSoldier.value.bAction == Enum289.AI_ACTION_KNIFE_MOVE) // if statement because toss falls through
      {
        pSoldier.value.usUIMovementMode = DetermineMovementMode(pSoldier, Enum289.AI_ACTION_KNIFE_MOVE);
      }

      // fall through
    case Enum289.AI_ACTION_FIRE_GUN: // shoot at nearby opponent
    case Enum289.AI_ACTION_THROW_KNIFE: // throw knife at nearby opponent
      // randomly decide whether to say civ quote
      if (pSoldier.value.bVisible != -1 && pSoldier.value.bTeam != MILITIA_TEAM) {
        // ATE: Make sure it's a person :)
        if (IS_MERC_BODY_TYPE(pSoldier) && pSoldier.value.ubProfile == NO_PROFILE) {
          // CC, ATE here - I put in some TEMP randomness...
          if (Random(50) == 0) {
            StartCivQuote(pSoldier);
          }
        }
      }

      iRetCode = HandleItem(pSoldier, pSoldier.value.usActionData, pSoldier.value.bTargetLevel, pSoldier.value.inv[Enum261.HANDPOS].usItem, FALSE);
      if (iRetCode != ITEM_HANDLE_OK) {
        if (iRetCode != ITEM_HANDLE_BROKEN) // if the item broke, this is 'legal' and doesn't need reporting
        {
          DebugAI(String("AI %d got error code %ld from HandleItem, doing action %d, has %d APs... aborting deadlock!", pSoldier.value.ubID, iRetCode, pSoldier.value.bAction, pSoldier.value.bActionPoints));
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "AI %d got error code %ld from HandleItem, doing action %d... aborting deadlock!", pSoldier.value.ubID, iRetCode, pSoldier.value.bAction);
        }
        CancelAIAction(pSoldier, FORCE);
        EndAIGuysTurn(pSoldier);
      }
      break;

    case Enum289.AI_ACTION_PULL_TRIGGER: // activate an adjacent panic trigger

      // turn to face trigger first
      if (FindStructure((pSoldier.value.sGridNo + DirectionInc(Enum245.NORTH)), STRUCTURE_SWITCH)) {
        SendSoldierSetDesiredDirectionEvent(pSoldier, Enum245.NORTH);
      } else {
        SendSoldierSetDesiredDirectionEvent(pSoldier, Enum245.WEST);
      }

      EVENT_InitNewSoldierAnim(pSoldier, Enum193.AI_PULL_SWITCH, 0, FALSE);

      DeductPoints(pSoldier, AP_PULL_TRIGGER, 0);

      // gTacticalStatus.fPanicFlags					= 0; // turn all flags off
      gTacticalStatus.ubTheChosenOne = NOBODY;
      break;

    case Enum289.AI_ACTION_USE_DETONATOR:
      // gTacticalStatus.fPanicFlags					= 0; // turn all flags off
      gTacticalStatus.ubTheChosenOne = NOBODY;
      // gTacticalStatus.sPanicTriggerGridno	= NOWHERE;

      // grab detonator and set off bomb(s)
      DeductPoints(pSoldier, AP_USE_REMOTE, BP_USE_DETONATOR); // pay for it!
      // SetOffPanicBombs(1000,COMMUNICATE);    // BOOOOOOOOOOOOOOOOOOOOM!!!!!
      SetOffPanicBombs(pSoldier.value.ubID, 0);

      // action completed immediately, cancel it right away
      pSoldier.value.usActionData = NOWHERE;
      pSoldier.value.bLastAction = pSoldier.value.bAction;
      pSoldier.value.bAction = Enum289.AI_ACTION_NONE;
      return (FALSE); // no longer in progress

      break;

    case Enum289.AI_ACTION_RED_ALERT: // tell friends opponent(s) seen
      // if a computer merc, and up to now they didn't know you're here
      if (!(pSoldier.value.uiStatusFlags & SOLDIER_PC) && (!(gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition) || ((gTacticalStatus.fPanicFlags & PANIC_TRIGGERS_HERE) && gTacticalStatus.ubTheChosenOne == NOBODY))) {
        HandleInitialRedAlert(pSoldier.value.bTeam, TRUE);
      }
      // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, L"Debug: AI radios your position!" );
      // DROP THROUGH HERE!
    case Enum289.AI_ACTION_YELLOW_ALERT: // tell friends opponent(s) heard
      // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, L"Debug: AI radios about a noise!" );
      /*
                              NetSend.msgType = NET_RADIO_SIGHTINGS;
                              NetSend.ubID  = pSoldier->ubID;

                              SendNetData(ALL_NODES);
      */
      DeductPoints(pSoldier, AP_RADIO, BP_RADIO); // pay for it!
      RadioSightings(pSoldier, EVERYBODY, pSoldier.value.bTeam); // about everybody
      // action completed immediately, cancel it right away

      // ATE: Change to an animation!
      AIDecideRadioAnimation(pSoldier);
      // return(FALSE);           // no longer in progress
      break;

    case Enum289.AI_ACTION_CREATURE_CALL: // creature calling to others
      DeductPoints(pSoldier, AP_RADIO, BP_RADIO); // pay for it!
      CreatureCall(pSoldier);
      // return( FALSE ); // no longer in progress
      break;

    case Enum289.AI_ACTION_CHANGE_STANCE: // crouch
      if (gAnimControl[pSoldier.value.usAnimState].ubHeight == pSoldier.value.usActionData) {
        // abort!
        ActionDone(pSoldier);
        return FALSE;
      }

      SkipCoverCheck = TRUE;

      SendChangeSoldierStanceEvent(pSoldier, pSoldier.value.usActionData);
      break;

    case Enum289.AI_ACTION_COWER:
      // make sure action data is set right
      if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
        // nothing to do!
        ActionDone(pSoldier);
        return FALSE;
      } else {
        pSoldier.value.usActionData = ANIM_CROUCH;
        SetSoldierCowerState(pSoldier, TRUE);
      }
      break;

    case Enum289.AI_ACTION_STOP_COWERING:
      // make sure action data is set right
      if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
        pSoldier.value.usActionData = ANIM_STAND;
        SetSoldierCowerState(pSoldier, FALSE);
      } else {
        // nothing to do!
        ActionDone(pSoldier);
        return FALSE;
      }
      break;

    case Enum289.AI_ACTION_GIVE_AID: // help injured/dying friend
      // pSoldier->usUIMovementMode = RUNNING;
      iRetCode = HandleItem(pSoldier, pSoldier.value.usActionData, 0, pSoldier.value.inv[Enum261.HANDPOS].usItem, FALSE);
      if (iRetCode != ITEM_HANDLE_OK) {
        CancelAIAction(pSoldier, FORCE);
        EndAIGuysTurn(pSoldier);
      }
      break;

    case Enum289.AI_ACTION_OPEN_OR_CLOSE_DOOR:
    case Enum289.AI_ACTION_UNLOCK_DOOR:
    case Enum289.AI_ACTION_LOCK_DOOR: {
      let pStructure: Pointer<STRUCTURE>;
      let bDirection: INT8;
      let sDoorGridNo: INT16;

      bDirection = GetDirectionFromGridNo(pSoldier.value.usActionData, pSoldier);
      if (bDirection == Enum245.EAST || bDirection == Enum245.SOUTH) {
        sDoorGridNo = pSoldier.value.sGridNo;
      } else {
        sDoorGridNo = pSoldier.value.sGridNo + DirectionInc(bDirection);
      }

      pStructure = FindStructure(sDoorGridNo, STRUCTURE_ANYDOOR);
      if (pStructure == null) {
        CancelAIAction(pSoldier, FORCE);
        EndAIGuysTurn(pSoldier);
      }

      StartInteractiveObject(sDoorGridNo, pStructure.value.usStructureID, pSoldier, bDirection);
      InteractWithInteractiveObject(pSoldier, pStructure, bDirection);
    } break;

    case Enum289.AI_ACTION_LOWER_GUN:
      // for now, just do "action done"
      ActionDone(pSoldier);
      break;

    case Enum289.AI_ACTION_CLIMB_ROOF:
      if (pSoldier.value.bLevel == 0) {
        BeginSoldierClimbUpRoof(pSoldier);
      } else {
        BeginSoldierClimbDownRoof(pSoldier);
      }
      break;

    case Enum289.AI_ACTION_END_TURN:
      ActionDone(pSoldier);
      if (gfTurnBasedAI) {
        EndAIGuysTurn(pSoldier);
      }
      return (FALSE); // nothing is in progress

    case Enum289.AI_ACTION_TRAVERSE_DOWN:
      if (gfTurnBasedAI) {
        EndAIGuysTurn(pSoldier);
      }
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        gMercProfiles[pSoldier.value.ubProfile].bSectorZ++;
        gMercProfiles[pSoldier.value.ubProfile].fUseProfileInsertionInfo = FALSE;
      }
      TacticalRemoveSoldier(pSoldier.value.ubID);
      CheckForEndOfBattle(TRUE);

      return (FALSE); // nothing is in progress

    case Enum289.AI_ACTION_OFFER_SURRENDER:
      // start the offer of surrender!
      StartCivQuote(pSoldier);
      break;

    default:
      return FALSE;
  }

  // return status indicating execution of action was properly started
  return TRUE;
}

function CheckForChangingOrders(pSoldier: Pointer<SOLDIERTYPE>): void {
  switch (pSoldier.value.bAlertStatus) {
    case Enum243.STATUS_GREEN:
      if (!CREATURE_OR_BLOODCAT(pSoldier)) {
        if (pSoldier.value.bTeam == CIV_TEAM && pSoldier.value.ubProfile != NO_PROFILE && pSoldier.value.bNeutral && gMercProfiles[pSoldier.value.ubProfile].sPreCombatGridNo != NOWHERE && pSoldier.value.ubCivilianGroup != Enum246.QUEENS_CIV_GROUP) {
          // must make them uncower first, then return to start location
          pSoldier.value.bNextAction = Enum289.AI_ACTION_END_COWER_AND_MOVE;
          pSoldier.value.usNextActionData = gMercProfiles[pSoldier.value.ubProfile].sPreCombatGridNo;
          gMercProfiles[pSoldier.value.ubProfile].sPreCombatGridNo = NOWHERE;
        } else if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
          pSoldier.value.bNextAction = Enum289.AI_ACTION_STOP_COWERING;
          pSoldier.value.usNextActionData = ANIM_STAND;
        } else {
          pSoldier.value.bNextAction = Enum289.AI_ACTION_CHANGE_STANCE;
          pSoldier.value.usNextActionData = ANIM_STAND;
        }
      }
      break;
    case Enum243.STATUS_YELLOW:
      break;
    default:
      if ((pSoldier.value.bOrders == Enum241.ONGUARD) || (pSoldier.value.bOrders == Enum241.CLOSEPATROL)) {
        // crank up ONGUARD to CLOSEPATROL, and CLOSEPATROL to FARPATROL
        pSoldier.value.bOrders++; // increase roaming range by 1 category
      } else if (pSoldier.value.bTeam == MILITIA_TEAM) {
        // go on alert!
        pSoldier.value.bOrders = Enum241.SEEKENEMY;
      } else if (CREATURE_OR_BLOODCAT(pSoldier)) {
        if (pSoldier.value.bOrders != Enum241.STATIONARY && pSoldier.value.bOrders != Enum241.ONCALL) {
          pSoldier.value.bOrders = Enum241.SEEKENEMY;
        }
      }

      if (pSoldier.value.ubProfile == Enum268.WARDEN) {
        // Tixa
        MakeClosestEnemyChosenOne();
      }
      break;
  }
}

function InitAttackType(pAttack: Pointer<ATTACKTYPE>): void {
  // initialize the given bestAttack structure fields to their default values
  pAttack.value.ubPossible = FALSE;
  pAttack.value.ubOpponent = NOBODY;
  pAttack.value.ubAimTime = 0;
  pAttack.value.ubChanceToReallyHit = 0;
  pAttack.value.sTarget = NOWHERE;
  pAttack.value.iAttackValue = 0;
  pAttack.value.ubAPCost = 0;
}

function HandleInitialRedAlert(bTeam: INT8, ubCommunicate: UINT8): void {
  /*
   if (ubCommunicate)
    {
     NetSend.msgType = NET_RED_ALERT;
     SendNetData(ALL_NODES);
    }*/

  if (gTacticalStatus.Team[bTeam].bAwareOfOpposition == FALSE) {
  }

  // if there is a stealth mission in progress here, and a panic trigger exists
  if (bTeam == ENEMY_TEAM && (gTacticalStatus.fPanicFlags & PANIC_TRIGGERS_HERE)) {
    // they're going to be aware of us now!
    MakeClosestEnemyChosenOne();
  }

  if (bTeam == ENEMY_TEAM && gWorldSectorX == 3 && gWorldSectorY == MAP_ROW_P && gbWorldSectorZ == 0) {
    // alert Queen and Joe if they are around
    let pSoldier: Pointer<SOLDIERTYPE>;

    pSoldier = FindSoldierByProfileID(Enum268.QUEEN, FALSE);
    if (pSoldier) {
      pSoldier.value.bAlertStatus = Enum243.STATUS_RED;
    }

    pSoldier = FindSoldierByProfileID(Enum268.JOE, FALSE);
    if (pSoldier) {
      pSoldier.value.bAlertStatus = Enum243.STATUS_RED;
    }
  }

  // open and close certain doors when this happens
  // AffectDoors(OPENDOORS, MapExt[Status.cur_sector].opendoors);
  // AffectDoors(CLOSEDOORS,MapExt[Status.cur_sector].closedoors);

  // remember enemies are alerted, prevent another red alert from happening
  gTacticalStatus.Team[bTeam].bAwareOfOpposition = TRUE;
}

function ManChecksOnFriends(pSoldier: Pointer<SOLDIERTYPE>): void {
  let uiLoop: UINT32;
  let pFriend: Pointer<SOLDIERTYPE>;
  let sDistVisible: INT16;

  // THIS ROUTINE SHOULD ONLY BE CALLED FOR SOLDIERS ON STATUS GREEN or YELLOW

  // go through each soldier, looking for "friends" (soldiers on same side)
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pFriend = MercSlots[uiLoop];

    if (!pFriend) {
      continue;
    }

    // if this man is neutral / NOT on my side, he's not my friend
    if (pFriend.value.bNeutral || (pSoldier.value.bSide != pFriend.value.bSide))
      continue; // next merc

    // if this merc is actually ME
    if (pFriend.value.ubID == pSoldier.value.ubID)
      continue; // next merc

    sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, pFriend.value.sGridNo, pFriend.value.bLevel);
    // if we can see far enough to see this friend
    if (PythSpacesAway(pSoldier.value.sGridNo, pFriend.value.sGridNo) <= sDistVisible) {
      // and can trace a line of sight to his x,y coordinates
      // if (1) //*** SoldierToSoldierLineOfSightTest(pSoldier,pFriend,STRAIGHT,TRUE))
      if (SoldierToSoldierLineOfSightTest(pSoldier, pFriend, sDistVisible, TRUE)) {
        // if my friend is in battle or something is clearly happening there
        if ((pFriend.value.bAlertStatus >= Enum243.STATUS_RED) || pFriend.value.bUnderFire || (pFriend.value.bLife < OKLIFE)) {
          pSoldier.value.bAlertStatus = Enum243.STATUS_RED;
          CheckForChangingOrders(pSoldier);
          SetNewSituation(pSoldier);
          break; // don't bother checking on any other friends
        } else {
          // if he seems suspicious or acts like he thought he heard something
          // and I'm still on status GREEN
          if ((pFriend.value.bAlertStatus == Enum243.STATUS_YELLOW) && (pSoldier.value.bAlertStatus < Enum243.STATUS_YELLOW)) {
            pSoldier.value.bAlertStatus = Enum243.STATUS_YELLOW; // also get suspicious
            SetNewSituation(pSoldier);
            pSoldier.value.sNoiseGridno = pFriend.value.sGridNo; // pretend FRIEND made noise
            pSoldier.value.ubNoiseVolume = 3; // remember this for 3 turns
            // keep check other friends, too, in case any are already on RED
          }
        }
      }
    }
  }
}

function SetNewSituation(pSoldier: Pointer<SOLDIERTYPE>): void {
  if (pSoldier.value.bTeam != gbPlayerNum) {
    if (pSoldier.value.ubQuoteRecord == 0 && !gTacticalStatus.fAutoBandageMode && !(pSoldier.value.bNeutral && gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
      // allow new situation to be set
      pSoldier.value.bNewSituation = IS_NEW_SITUATION;

      if (gTacticalStatus.ubAttackBusyCount != 0) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("BBBBBB bNewSituation is set for %d when ABC !=0.", pSoldier.value.ubID));
      }

      if (!(gTacticalStatus.uiFlags & INCOMBAT) || (gTacticalStatus.uiFlags & REALTIME)) {
        // reset delay if necessary!
        RESETTIMECOUNTER(pSoldier.value.AICounter, Random(1000));
      }
    }
  }
}

function HandleAITacticalTraversal(pSoldier: Pointer<SOLDIERTYPE>): void {
  HandleNPCChangesForTacticalTraversal(pSoldier);

  if (pSoldier.value.ubProfile != NO_PROFILE && NPCHasUnusedRecordWithGivenApproach(pSoldier.value.ubProfile, Enum296.APPROACH_DONE_TRAVERSAL)) {
    gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags3 |= PROFILE_MISC_FLAG3_HANDLE_DONE_TRAVERSAL;
  } else {
    pSoldier.value.ubQuoteActionID = 0;
  }

  EndAIGuysTurn(pSoldier);
  RemoveManAsTarget(pSoldier);
  if (pSoldier.value.bTeam == CIV_TEAM && pSoldier.value.fAIFlags & AI_CHECK_SCHEDULE) {
    MoveSoldierFromMercToAwaySlot(pSoldier);
    pSoldier.value.bInSector = FALSE;
  } else {
    ProcessQueenCmdImplicationsOfDeath(pSoldier);
    TacticalRemoveSoldier(pSoldier.value.ubID);
  }
  CheckForEndOfBattle(TRUE);
}
