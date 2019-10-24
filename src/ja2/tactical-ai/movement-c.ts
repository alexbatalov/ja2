//
// CJC's DG->JA2 conversion notes
//
// LegalNPCDestination - mode hardcoded to walking; C.O. tear gas related stuff commented out
// TryToResumeMovement - C.O. EscortedMoveCanceled call
// GoAsFarAsPossibleTowards - C.O. stuff related to current animation esp first aid
// SetCivilianDestination - C.O. stuff for if we don't control the civ

function LegalNPCDestination(pSoldier: Pointer<SOLDIERTYPE>, sGridno: INT16, ubPathMode: UINT8, ubWaterOK: UINT8, fFlags: UINT8): int {
  let fSkipTilesWithMercs: BOOLEAN;

  if ((sGridno < 0) || (sGridno >= GRIDSIZE)) {
    return FALSE;
  }

  // return false if gridno on different level from merc
  if (GridNoOnVisibleWorldTile(pSoldier.value.sGridNo) && gpWorldLevelData[pSoldier.value.sGridNo].sHeight != gpWorldLevelData[sGridno].sHeight) {
    return FALSE;
  }

  // skip mercs if turnbased and adjacent AND not doing an IGNORE_PATH check (which is used almost exclusively by GoAsFarAsPossibleTowards)
  fSkipTilesWithMercs = (gfTurnBasedAI && ubPathMode != IGNORE_PATH && SpacesAway(pSoldier.value.sGridNo, sGridno) == 1);

  // if this gridno is an OK destination
  // AND the gridno is NOT in a tear-gassed tile when we have no gas mask
  // AND someone is NOT already standing there
  // AND we're NOT already standing at that gridno
  // AND the gridno hasn't been black-listed for us

  // Nov 28 98: skip people in destination tile if in turnbased
  if ((NewOKDestination(pSoldier, sGridno, fSkipTilesWithMercs, pSoldier.value.bLevel)) && (!InGas(pSoldier, sGridno)) && (sGridno != pSoldier.value.sGridNo) && (sGridno != pSoldier.value.sBlackList))
  /*
  if ( ( NewOKDestination(pSoldier, sGridno, FALSE, pSoldier->bLevel ) ) &&
                                 ( !(gpWorldLevelData[ sGridno ].ubExtFlags[0] & (MAPELEMENT_EXT_SMOKE | MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) || ( pSoldier->inv[ HEAD1POS ].usItem == GASMASK || pSoldier->inv[ HEAD2POS ].usItem == GASMASK ) ) &&
                                 ( sGridno != pSoldier->sGridNo ) &&
                                 ( sGridno != pSoldier->sBlackList ) )*/
  /*
  if ( ( NewOKDestination(pSoldier,sGridno,ALLPEOPLE, pSoldier->bLevel ) ) &&
                                 ( !(gpWorldLevelData[ sGridno ].ubExtFlags[0] & (MAPELEMENT_EXT_SMOKE | MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) || ( pSoldier->inv[ HEAD1POS ].usItem == GASMASK || pSoldier->inv[ HEAD2POS ].usItem == GASMASK ) ) &&
                                 ( sGridno != pSoldier->sGridNo ) &&
                                 ( sGridno != pSoldier->sBlackList ) )
                                 */
  {
    // if water's a problem, and gridno is in a water tile (bridges are OK)
    if (!ubWaterOK && Water(sGridno))
      return FALSE;

    // passed all checks, now try to make sure we can get there!
    switch (ubPathMode) {
      // if finding a path wasn't asked for (could have already been done,
      // for example), don't bother
      case IGNORE_PATH:
        return TRUE;

      case ENSURE_PATH:
        if (FindBestPath(pSoldier, sGridno, pSoldier.value.bLevel, Enum193.WALKING, COPYROUTE, fFlags)) {
          return (TRUE); // legal destination
        } else // got this far, but found no clear path,
        {
          // so test fails
          return FALSE;
        }
        // *** NOTE: movement mode hardcoded to WALKING !!!!!
      case ENSURE_PATH_COST:
        return PlotPath(pSoldier, sGridno, FALSE, FALSE, FALSE, Enum193.WALKING, FALSE, FALSE, 0);

      default:
        return FALSE;
    }
  } else // something failed - didn't even have to test path
    return (FALSE); // illegal destination
}

function TryToResumeMovement(pSoldier: Pointer<SOLDIERTYPE>, sGridno: INT16): int {
  let ubGottaCancel: UINT8 = FALSE;
  let ubSuccess: UINT8 = FALSE;

  // have to make sure the old destination is still legal (somebody may
  // have occupied the destination gridno in the meantime!)
  if (LegalNPCDestination(pSoldier, sGridno, ENSURE_PATH, WATEROK, 0)) {
    pSoldier.value.bPathStored = TRUE; // optimization - Ian

    // make him go to it (needed to continue movement across multiple turns)
    NewDest(pSoldier, sGridno);

    ubSuccess = TRUE;

    // make sure that it worked (check that pSoldier->sDestination == pSoldier->sGridNo)
    if (pSoldier.value.sDestination == sGridno) {
      ubSuccess = TRUE;
    } else {
      // must work even for escorted civs, can't just set the flag
      CancelAIAction(pSoldier, FORCE);
    }
  } else {
    // don't black-list anything here, this situation can come up quite
    // legally if another soldier gets in the way between turns

    if (!pSoldier.value.bUnderEscort) {
      CancelAIAction(pSoldier, DONTFORCE); // no need to force this
    } else {
      // this is an escorted NPC, don't want to just completely stop
      // moving, try to find a nearby "next best" destination if possible
      pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sGridno, pSoldier.value.bAction);

      // if it's not possible to get any closer
      if (pSoldier.value.usActionData == NOWHERE) {
        ubGottaCancel = TRUE;
      } else {
        // change his desired destination to this new one
        sGridno = pSoldier.value.usActionData;

        // GoAsFar... sets pathStored TRUE only if he could go all the way

        // make him go to it (needed to continue movement across multiple turns)
        NewDest(pSoldier, sGridno);

        // make sure that it worked (check that pSoldier->sDestination == pSoldier->sGridNo)
        if (pSoldier.value.sDestination == sGridno)
          ubSuccess = TRUE;
        else
          ubGottaCancel = TRUE;
      }

      if (ubGottaCancel) {
        // can't get close, gotta abort the movement!
        CancelAIAction(pSoldier, FORCE);

        // tell the player doing the escorting that civilian has stopped
        // EscortedMoveCanceled(pSoldier,COMMUNICATE);
      }
    }
  }

  return ubSuccess;
}

function NextPatrolPoint(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  // patrol slot 0 is UNUSED, so max patrolCnt is actually only 9
  if ((pSoldier.value.bPatrolCnt < 1) || (pSoldier.value.bPatrolCnt >= MAXPATROLGRIDS)) {
    return NOWHERE;
  }

  pSoldier.value.bNextPatrolPnt++;

  // if there are no more patrol points, return back to the first one
  if (pSoldier.value.bNextPatrolPnt > pSoldier.value.bPatrolCnt)
    pSoldier.value.bNextPatrolPnt = 1; // ZERO is not used!

  return pSoldier.value.usPatrolGrid[pSoldier.value.bNextPatrolPnt];
}

function PointPatrolAI(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let sPatrolPoint: INT16;
  let bOldOrders: INT8;

  sPatrolPoint = pSoldier.value.usPatrolGrid[pSoldier.value.bNextPatrolPnt];

  // if we're already there, advance next patrol point
  if (pSoldier.value.sGridNo == sPatrolPoint || pSoldier.value.bNextPatrolPnt == 0) {
    // find next valid patrol point
    do {
      sPatrolPoint = NextPatrolPoint(pSoldier);
    } while ((sPatrolPoint != NOWHERE) && (NewOKDestination(pSoldier, sPatrolPoint, IGNOREPEOPLE, pSoldier.value.bLevel) < 1));

    // if we're back where we started, then ALL other patrol points are junk!
    if (pSoldier.value.sGridNo == sPatrolPoint) {
      // force change of orders & an abort
      sPatrolPoint = NOWHERE;
    }
  }

  // if we don't have a legal patrol point
  if (sPatrolPoint == NOWHERE) {
    // over-ride orders to something safer
    pSoldier.value.bOrders = Enum241.FARPATROL;
    return FALSE;
  }

  // make sure we can get there from here at this time, if we can't get all
  // the way there, at least do our best to get close
  if (LegalNPCDestination(pSoldier, sPatrolPoint, ENSURE_PATH, WATEROK, 0)) {
    pSoldier.value.bPathStored = TRUE; // optimization - Ian
    pSoldier.value.usActionData = sPatrolPoint;
  } else {
    // temporarily extend roaming range to infinity by changing orders, else
    // this won't work if the next patrol point is > 10 tiles away!
    bOldOrders = pSoldier.value.bOrders;
    pSoldier.value.bOrders = Enum241.ONCALL;

    pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sPatrolPoint, pSoldier.value.bAction);

    pSoldier.value.bOrders = bOldOrders;

    // if it's not possible to get any closer, that's OK, but fail this call
    if (pSoldier.value.usActionData == NOWHERE)
      return FALSE;
  }

  // passed all tests - start moving towards next patrol point

  return TRUE;
}

function RandomPointPatrolAI(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let sPatrolPoint: INT16;
  let bOldOrders: INT8;
  let bPatrolIndex: INT8;
  let bCnt: INT8;

  sPatrolPoint = pSoldier.value.usPatrolGrid[pSoldier.value.bNextPatrolPnt];

  // if we're already there, advance next patrol point
  if (pSoldier.value.sGridNo == sPatrolPoint || pSoldier.value.bNextPatrolPnt == 0) {
    // find next valid patrol point
    // we keep a count of the # of times we are in here to make sure we don't get into an endless
    // loop
    bCnt = 0;
    do {
      // usPatrolGrid[0] gets used for centre of close etc patrols, so we have to add 1 to the Random #
      bPatrolIndex = PreRandom(pSoldier.value.bPatrolCnt) + 1;
      sPatrolPoint = pSoldier.value.usPatrolGrid[bPatrolIndex];
      bCnt++;
    } while ((sPatrolPoint == pSoldier.value.sGridNo) || ((sPatrolPoint != NOWHERE) && (bCnt < pSoldier.value.bPatrolCnt) && (NewOKDestination(pSoldier, sPatrolPoint, IGNOREPEOPLE, pSoldier.value.bLevel) < 1)));

    if (bCnt == pSoldier.value.bPatrolCnt) {
      // ok, we tried doing this randomly, didn't work well, so now do a linear search
      pSoldier.value.bNextPatrolPnt = 0;
      do {
        sPatrolPoint = NextPatrolPoint(pSoldier);
      } while ((sPatrolPoint != NOWHERE) && (NewOKDestination(pSoldier, sPatrolPoint, IGNOREPEOPLE, pSoldier.value.bLevel) < 1));
    }

    // do nothing this time around
    if (pSoldier.value.sGridNo == sPatrolPoint) {
      return FALSE;
    }
  }

  // if we don't have a legal patrol point
  if (sPatrolPoint == NOWHERE) {
    // over-ride orders to something safer
    pSoldier.value.bOrders = Enum241.FARPATROL;
    return FALSE;
  }

  // make sure we can get there from here at this time, if we can't get all
  // the way there, at least do our best to get close
  if (LegalNPCDestination(pSoldier, sPatrolPoint, ENSURE_PATH, WATEROK, 0)) {
    pSoldier.value.bPathStored = TRUE; // optimization - Ian
    pSoldier.value.usActionData = sPatrolPoint;
  } else {
    // temporarily extend roaming range to infinity by changing orders, else
    // this won't work if the next patrol point is > 10 tiles away!
    bOldOrders = pSoldier.value.bOrders;
    pSoldier.value.bOrders = Enum241.SEEKENEMY;

    pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sPatrolPoint, pSoldier.value.bAction);

    pSoldier.value.bOrders = bOldOrders;

    // if it's not possible to get any closer, that's OK, but fail this call
    if (pSoldier.value.usActionData == NOWHERE)
      return FALSE;
  }

  // passed all tests - start moving towards next patrol point

  return TRUE;
}

function InternalGoAsFarAsPossibleTowards(pSoldier: Pointer<SOLDIERTYPE>, sDesGrid: INT16, bReserveAPs: INT8, bAction: INT8, fFlags: INT8): INT16 {
  let sLoop: INT16;
  let sAPCost: INT16;
  let sTempDest: INT16;
  let sGoToGrid: INT16;
  let sOrigin: INT16;
  let usMaxDist: UINT16;
  let ubDirection: UINT8;
  let ubDirsLeft: UINT8;
  let ubDirChecked: UINT8[] /* [8] */;
  let fFound: UINT8 = FALSE;
  let bAPsLeft: INT8;
  let fPathFlags: INT8;
  let ubRoomRequired: UINT8 = 0;
  let ubTempRoom: UINT8;

  if (bReserveAPs == -1) {
    // default reserve points
    if (CREATURE_OR_BLOODCAT(pSoldier)) {
      bReserveAPs = 0;
    } else {
      bReserveAPs = MAX_AP_CARRIED;
    }
  }

  sTempDest = -1;

  // obtain maximum roaming distance from soldier's sOrigin
  usMaxDist = RoamingRange(pSoldier, addressof(sOrigin));

  if (pSoldier.value.bOrders <= Enum241.CLOSEPATROL && (pSoldier.value.bTeam == CIV_TEAM || pSoldier.value.ubProfile != NO_PROFILE)) {
    if (InARoom(pSoldier.value.usPatrolGrid[0], addressof(ubRoomRequired))) {
      // make sure this doesn't interfere with pathing for scripts
      if (pSoldier.value.sAbsoluteFinalDestination != NOWHERE) {
        ubRoomRequired = 0;
      }
    }
  }

  pSoldier.value.usUIMovementMode = DetermineMovementMode(pSoldier, bAction);
  if (pSoldier.value.usUIMovementMode == Enum193.RUNNING && fFlags & FLAG_CAUTIOUS) {
    pSoldier.value.usUIMovementMode = Enum193.WALKING;
  }

  // if soldier is ALREADY at the desired destination, quit right away
  if (sDesGrid == pSoldier.value.sGridNo) {
    return NOWHERE;
  }

  // don't try to approach go after noises or enemies actually in water
  // would be too easy to throw rocks in water, etc. & distract the AI
  if (Water(sDesGrid)) {
    return NOWHERE;
  }

  fPathFlags = 0;
  if (CREATURE_OR_BLOODCAT(pSoldier)) {
    /*
                                        if ( PythSpacesAway( pSoldier->sGridNo, sDesGrid ) <= PATH_CLOSE_RADIUS )
                                        {
                                                // then do a limited range path search and see if we can get there
                                                gubNPCDistLimit = 10;
                                                if ( !LegalNPCDestination( pSoldier, sDesGrid, ENSURE_PATH, NOWATER, fPathFlags) )
                                                {
                                                        gubNPCDistLimit = 0;
                                                        return( NOWHERE );
                                                }
                                                else
                                                {
                                                        // allow attempt to path without 'good enough' flag on
                                                        gubNPCDistLimit = 0;
                                                }
                                        }
                                        else
                                        {
                                        */
    fPathFlags = PATH_CLOSE_GOOD_ENOUGH;
    //}
  }

  // first step: try to find an OK destination at or near the desired gridno
  if (!LegalNPCDestination(pSoldier, sDesGrid, ENSURE_PATH, NOWATER, fPathFlags)) {
    if (CREATURE_OR_BLOODCAT(pSoldier)) {
      // we tried to get close, failed; abort!
      return NOWHERE;
    } else {
      // else look at the 8 nearest gridnos to sDesGrid for a valid destination

      // clear ubDirChecked flag for all 8 directions
      for (ubDirection = 0; ubDirection < 8; ubDirection++)
        ubDirChecked[ubDirection] = FALSE;

      ubDirsLeft = 8;

      // examine all 8 spots around 'sDesGrid'
      // keep looking while directions remain and a satisfactory one not found
      for (ubDirsLeft = 8; ubDirsLeft != 0; ubDirsLeft--) {
        if (fFound) {
          break;
        }
        // randomly select a direction which hasn't been 'checked' yet
        do {
          ubDirection = Random(8);
        } while (ubDirChecked[ubDirection]);

        ubDirChecked[ubDirection] = TRUE;

        // determine the gridno 1 tile away from current friend in this direction
        sTempDest = NewGridNo(sDesGrid, DirectionInc((ubDirection + 1)));

        // if that's out of bounds, ignore it & check next direction
        if (sTempDest == sDesGrid)
          continue;

        if (LegalNPCDestination(pSoldier, sTempDest, ENSURE_PATH, NOWATER, 0)) {
          fFound = TRUE; // found a spot

          break; // stop checking in other directions
        }
      }

      if (!fFound) {
        return NOWHERE;
      }

      // found a good grid #, this becomes our actual desired grid #
      sDesGrid = sTempDest;
    }
  }

  // HAVE FOUND AN OK destination AND PLOTTED A VALID BEST PATH TO IT

  sGoToGrid = pSoldier.value.sGridNo; // start back where soldier is standing now
  sAPCost = 0; // initialize path cost counter

  // we'll only go as far along the plotted route as is within our
  // permitted roaming range, and we'll stop as soon as we're down to <= 5 APs

  for (sLoop = 0; sLoop < (pSoldier.value.usPathDataSize - pSoldier.value.usPathIndex); sLoop++) {
    // what is the next gridno in the path?

    // sTempDest = NewGridNo( sGoToGrid,DirectionInc( (INT16) (pSoldier->usPathingData[sLoop] + 1) ) );
    sTempDest = NewGridNo(sGoToGrid, DirectionInc((pSoldier.value.usPathingData[sLoop])));
    // NumMessage("sTempDest = ",sTempDest);

    // this should NEVER be out of bounds
    if (sTempDest == sGoToGrid) {
      break; // quit here, sGoToGrid is where we are going
    }

    // if this takes us beyond our permitted "roaming range"
    if (SpacesAway(sOrigin, sTempDest) > usMaxDist)
      break; // quit here, sGoToGrid is where we are going

    if (ubRoomRequired) {
      if (!(InARoom(sTempDest, addressof(ubTempRoom)) && ubTempRoom == ubRoomRequired)) {
        // quit here, limited by room!
        break;
      }
    }

    if ((fFlags & FLAG_STOPSHORT) && SpacesAway(sDesGrid, sTempDest) <= STOPSHORTDIST) {
      break; // quit here, sGoToGrid is where we are going
    }

    // if this gridno is NOT a legal NPC destination
    // DONT'T test path again - that would replace the traced path! - Ian
    // NOTE: It's OK to go *THROUGH* water to try and get to the destination!
    if (!LegalNPCDestination(pSoldier, sTempDest, IGNORE_PATH, WATEROK, 0))
      break; // quit here, sGoToGrid is where we are going

    // CAN'T CALL PathCost() HERE! IT CALLS findBestPath() and overwrites
    //       pathRouteToGo !!!  Gotta calculate the cost ourselves - Ian
    //
    // ubAPsLeft = pSoldier->bActionPoints - PathCost(pSoldier,sTempDest,FALSE,FALSE,FALSE,FALSE,FALSE);

    if (gfTurnBasedAI) {
      // if we're just starting the "costing" process (first gridno)
      if (sLoop == 0) {
        /*
         // first, add any additional costs - such as intermediate animations, etc.
         switch(pSoldier->anitype[pSoldier->anim])
                {
                 // in theory, no NPC should ever be in one of these animations as
                 // things stand (they don't medic anyone), but leave it for robustness
                 case START_AID   :
                 case GIVING_AID  : sAnimCost = AP_STOP_FIRST_AID;
                        break;

                 case TWISTOMACH  :
                 case COLLAPSED   : sAnimCost = AP_GET_UP;
                        break;

                 case TWISTBACK   :
                 case UNCONSCIOUS : sAnimCost = (AP_ROLL_OVER + AP_GET_UP);
                        break;

                 default          : sAnimCost = 0;
                }

         // this is our first cost
         sAPCost += sAnimCost;
         */

        if (pSoldier.value.usUIMovementMode == Enum193.RUNNING) {
          sAPCost += AP_START_RUN_COST;
        }
      }

      // ATE: Direction here?
      sAPCost += EstimateActionPointCost(pSoldier, sTempDest, pSoldier.value.usPathingData[sLoop], pSoldier.value.usUIMovementMode, sLoop, pSoldier.value.usPathDataSize);

      bAPsLeft = pSoldier.value.bActionPoints - sAPCost;
    }

    // if after this, we have <= 5 APs remaining, that's far enough, break out
    // (the idea is to preserve APs so we can crouch or react if
    // necessary, and benefit from the carry-over next turn if not needed)
    // This routine is NOT used by any GREEN AI, so such caution is warranted!

    if (gfTurnBasedAI && (bAPsLeft < bReserveAPs))
      break;
    else {
      sGoToGrid = sTempDest; // we're OK up to here

      // if exactly 5 APs left, don't bother checking any further
      if (gfTurnBasedAI && (bAPsLeft == bReserveAPs))
        break;
    }
  }

  // if it turned out we couldn't go even 1 tile towards the desired gridno
  if (sGoToGrid == pSoldier.value.sGridNo) {
    return (NOWHERE); // then go nowhere
  } else {
    // possible optimization - stored path IS good if we're going all the way
    if (sGoToGrid == sDesGrid) {
      pSoldier.value.bPathStored = TRUE;
      pSoldier.value.sFinalDestination = sGoToGrid;
    } else if (pSoldier.value.usPathIndex == 0) {
      // we can hack this surely! -- CJC
      pSoldier.value.bPathStored = TRUE;
      pSoldier.value.sFinalDestination = sGoToGrid;
      pSoldier.value.usPathDataSize = sLoop + 1;
    }

    return sGoToGrid;
  }
}

function GoAsFarAsPossibleTowards(pSoldier: Pointer<SOLDIERTYPE>, sDesGrid: INT16, bAction: INT8): INT16 {
  return InternalGoAsFarAsPossibleTowards(pSoldier, sDesGrid, -1, bAction, 0);
}

function SoldierTriesToContinueAlongPath(pSoldier: Pointer<SOLDIERTYPE>): void {
  let usNewGridNo: INT16;
  let bAPCost: INT16;

  // turn off the flag now that we're going to do something about it...
  // ATE: USed to be redundent, now if called befroe NewDest can cause some side efects...
  // AdjustNoAPToFinishMove( pSoldier, FALSE );

  if (pSoldier.value.bNewSituation == IS_NEW_SITUATION) {
    CancelAIAction(pSoldier, DONTFORCE);
    return;
  }

  if (pSoldier.value.usActionData >= NOWHERE) {
    CancelAIAction(pSoldier, DONTFORCE);
    return;
  }

  if (!NewOKDestination(pSoldier, pSoldier.value.usActionData, TRUE, pSoldier.value.bLevel)) {
    CancelAIAction(pSoldier, DONTFORCE);
    return;
  }

  if (IsActionAffordable(pSoldier)) {
    if (pSoldier.value.bActionInProgress == FALSE) {
      // start a move that didn't even get started before...
      // hope this works...
      NPCDoesAct(pSoldier);

      // perform the chosen action
      pSoldier.value.bActionInProgress = ExecuteAction(pSoldier); // if started, mark us as busy
    } else {
      // otherwise we shouldn't have to do anything(?)
    }
  } else {
    CancelAIAction(pSoldier, DONTFORCE);
  }

  usNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(pSoldier.value.usPathingData[pSoldier.value.usPathIndex]));

  // Find out how much it takes to move here!
  bAPCost = EstimateActionPointCost(pSoldier, usNewGridNo, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], pSoldier.value.usUIMovementMode, pSoldier.value.usPathIndex, pSoldier.value.usPathDataSize);

  if (pSoldier.value.bActionPoints >= bAPCost) {
    // seems to have enough points...
    NewDest(pSoldier, usNewGridNo);
    // maybe we didn't actually start the action last turn...
    pSoldier.value.bActionInProgress = TRUE;
  } else {
    CancelAIAction(pSoldier, DONTFORCE);
  }
}

function HaltMoveForSoldierOutOfPoints(pSoldier: Pointer<SOLDIERTYPE>): void {
  // If a special move, ignore this!
  if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_SPECIALMOVE)) {
    return;
  }

  // record that this merc can no longer animate and why...
  AdjustNoAPToFinishMove(pSoldier, TRUE);

  // We'll keep his action intact though...
  DebugAI(String("NO AP TO FINISH MOVE for %d (%d APs left)", pSoldier.value.ubID, pSoldier.value.bActionPoints));

  // if this dude is under AI right now, then pass the baton to someone else
  if (pSoldier.value.uiStatusFlags & SOLDIER_UNDERAICONTROL) {
    EndAIGuysTurn(pSoldier);
  }
}

function SetCivilianDestination(ubWho: UINT8, sGridno: INT16): void {
  let pSoldier: Pointer<SOLDIERTYPE>;

  pSoldier = MercPtrs[ubWho];

  /*
   // if we control the civilian
   if (PTR_OURCONTROL)
    {
  */
  // if the destination is different from what he has now
  if (pSoldier.value.usActionData != sGridno) {
    // store his new destination
    pSoldier.value.usActionData = sGridno;

    // and cancel any movement in progress that he was still engaged in
    pSoldier.value.bAction = Enum289.AI_ACTION_NONE;
    pSoldier.value.bActionInProgress = FALSE;
  }

  // only set the underEscort flag once you give him a destination
  // (that way AI can keep him appearing to act on his own until you
  // give him orders).
  //
  // Either way, once set, it should stay that way, preventing AI from
  // doing anything other than advance him towards destination.
  pSoldier.value.bUnderEscort = TRUE;

  // change orders to maximize roaming range so he can Go As Far As Possible
  pSoldier.value.bOrders = Enum241.ONCALL;
  /*
    }

   else
    {
     NetSend.msgType = NET_CIV_DEST;
     NetSend.ubID  = pSoldier->ubID;
     NetSend.gridno  = gridno;

     // only the civilian's controller needs to know this
     SendNetData(pSoldier->controller);
    }
  */
}

const RADIUS = 3;

function TrackScent(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  // This function returns the best gridno to go to based on the scent being followed,
  // and the soldier (creature/animal)'s current direction (which is used to resolve
  // ties.
  let iXDiff: INT32;
  let iYDiff: INT32;
  let iXIncr: INT32;
  let iStart: INT32;
  let iXStart: INT32;
  let iYStart: INT32;
  let iGridNo: INT32;
  let bDir: INT8;
  let iBestGridNo: INT32 = NOWHERE;
  let ubBestDirDiff: UINT8 = 5;
  let ubBestStrength: UINT8 = 0;
  let ubDirDiff: UINT8;
  let ubStrength: UINT8;
  let ubSoughtSmell: UINT8;
  let pMapElement: Pointer<MAP_ELEMENT>;

  iStart = pSoldier.value.sGridNo;
  iXStart = iStart % WORLD_COLS;
  iYStart = iStart / WORLD_COLS;

  if (CREATURE_OR_BLOODCAT(pSoldier)) // or bloodcats
  {
    // tracking humans; search the edges of a 7x7 square for the
    // most promising tile
    ubSoughtSmell = HUMAN;
    for (iYDiff = -RADIUS; iYDiff < (RADIUS + 1); iYDiff++) {
      if (iYStart + iYDiff < 0) {
        // outside of map! might be on map further down...
        continue;
      } else if (iYStart + iYDiff > WORLD_ROWS) {
        // outside of bottom of map! abort!
        break;
      }
      if (iYDiff == -RADIUS || iYDiff == RADIUS) {
        iXIncr = 1;
      } else {
        // skip over the spots in the centre of the square
        iXIncr = RADIUS * 2;
      }
      for (iXDiff = -RADIUS; iXDiff < (RADIUS + 1); iXDiff += iXIncr) {
        iGridNo = iStart + iXDiff + iYDiff * WORLD_ROWS;
        if (abs(iGridNo % WORLD_ROWS - iXStart) > RADIUS) {
          // wrapped across map!
          continue;
        }
        if (LegalNPCDestination(pSoldier, pSoldier.value.usActionData, ENSURE_PATH, WATEROK, 0)) {
          // check this location out
          pMapElement = addressof(gpWorldLevelData[iGridNo]);
          if (pMapElement.value.ubSmellInfo && (SMELL_TYPE(pMapElement.value.ubSmellInfo) == ubSoughtSmell)) {
            ubStrength = SMELL_STRENGTH(pMapElement.value.ubSmellInfo);
            if (ubStrength > ubBestStrength) {
              iBestGridNo = iGridNo;
              ubBestStrength = ubStrength;
              bDir = atan8(iXStart, iYStart, (iXStart + iXDiff), (iYStart + iYDiff));
              // now convert it into a difference in degree between it and our current dir
              ubBestDirDiff = abs(pSoldier.value.bDirection - bDir);
              if (ubBestDirDiff > 4) // dir 0 compared with dir 6, for instance
              {
                ubBestDirDiff = 8 - ubBestDirDiff;
              }
            } else if (ubStrength == ubBestStrength) {
              if (iBestGridNo == NOWHERE) {
                // first place we've found with the same strength
                iBestGridNo = iGridNo;
                ubBestStrength = ubStrength;
              } else {
                // use directions to decide between the two
                // start by calculating direction to the new gridno
                bDir = atan8(iXStart, iYStart, (iXStart + iXDiff), (iYStart + iYDiff));
                // now convert it into a difference in degree between it and our current dir
                ubDirDiff = abs(pSoldier.value.bDirection - bDir);
                if (ubDirDiff > 4) // dir 0 compared with dir 6, for instance
                {
                  ubDirDiff = 8 - ubDirDiff;
                }
                if (ubDirDiff < ubBestDirDiff || ((ubDirDiff == ubBestDirDiff) && Random(2))) {
                  // follow this trail as its closer to the one we're following!
                  // (in the case of a tie, we tossed a coin)
                  ubBestDirDiff = ubDirDiff;
                }
              }
            }
          }
        }
      }
      // go on to next tile
    }
    // go on to next row
  } else {
    // who else can track?
  }
  if (iBestGridNo != NOWHERE) {
    pSoldier.value.usActionData = iBestGridNo;
    return iBestGridNo;
  }
  return 0;
}

/*
UINT16 RunAway( SOLDIERTYPE * pSoldier )
{
        // "Run away! Run away!!!"
        // This code should figure out which directions are safe for the enemy
        // to run in.  They shouldn't try to run off in directions which will
        // take them into enemy territory.  We must presume that they inform each
        // other by radio when sectors are taken by the player! :-)
        // The second wrinkle would be to look at the directions to known player
        // mercs and use that to influence the direction in which we run.

        // we can only flee in the cardinal directions (NESW) so start with an
        // alternating pattern of true/false
        INT8 bOkayDir[8] = {TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE};
        UINT8 ubLoop, ubBestDir, ubDistToEdge, ubBestDistToEdge = WORLD_COLS;
        INT32	iSector, iSectorX, iSectorY;
        INT32 iNewSectorX, iNewSectorY, iNewSector;
        INT32	iRunX, iRunY, iRunGridNo;
        SOLDIERTYPE * pOpponent;

        iSector = pSoldier->sSectorX + pSoldier->sSectorY * MAP_WORLD_X;

        // first start by scanning through opposing mercs and find out what directions are blocked.
        for (ubLoop = 0,pOpponent = Menptr; ubLoop < MAXMERCS; ubLoop++,pOpponent++)
        {
                // if this merc is inactive, at base, on assignment, or dead
                if (!pOpponent->bActive || !pOpponent->bInSector || !pOpponent->bLife)
                {
                        continue;          // next merc
                }

                // if this man is neutral / on the same side, he's not an opponent
                if (pOpponent->bNeutral || (pSoldier->bSide == pOpponent->bSide))
                {
                        continue;          // next merc
                }

                // we don't want to run in that direction!
                bOkayDir[ atan8( pSoldier->sX, pSoldier->sY, pOpponent->sX, pOpponent->sY ) ] = FALSE;
        }

        for (ubLoop = 0; ubLoop < 8; ubLoop += 2)
        {
                if (bOkayDir[ubLoop])
                {
                        // figure out sector # in that direction
                        iNewSectorX = pSoldier->sSectorX + DirXIncrementer[ubLoop];
                        iNewSectorY = pSoldier->sSectorY + DirYIncrementer[ubLoop];
                        iNewSector = iSectorX + iSectorY * MAP_WORLD_X;
                        // check movement
                        if (TravelBetweenSectorsIsBlockedFromFoot( (UINT16) iSector, (UINT16) iNewSector ) || StrategicMap[iSector].fEnemyControlled)
                        {
                                // sector inaccessible or controlled by the player; skip it!
                                continue;
                        }
                        switch( ubLoop )
                        {
                                case 0:
                                        ubDistToEdge = pSoldier->sGridNo / WORLD_COLS;
                                        break;
                                case 2:
                                        ubDistToEdge = WORLD_COLS - pSoldier->sGridNo % WORLD_COLS;
                                        break;
                                case 4:
                                        ubDistToEdge = WORLD_ROWS - pSoldier->sGridNo / WORLD_COLS;
                                        break;
                                case 6:
                                        ubDistToEdge = pSoldier->sGridNo % WORLD_COLS;
                                        break;
                        }
                        if (ubDistToEdge < ubBestDistToEdge)
                        {
                                ubBestDir = ubLoop;
                                ubBestDistToEdge = ubDistToEdge;
                        }
                }
        }
        if (ubBestDistToEdge < WORLD_COLS)
        {
                switch( ubBestDir )
                {
                        case 0:
                                iRunX = pSoldier->sX + Random( 9 ) - 4;
                                iRunY = 0;
                                if (iRunX < 0)
                                {
                                        iRunX = 0;
                                }
                                else if (iRunX >= WORLD_COLS)
                                {
                                        iRunX = WORLD_COLS - 1;
                                }
                                break;
                        case 2:
                                iRunX = WORLD_COLS;
                                iRunY = pSoldier->sY + Random( 9 ) - 4;
                                if (iRunY < 0)
                                {
                                        iRunY = 0;
                                }
                                else if (iRunY >= WORLD_COLS)
                                {
                                        iRunY = WORLD_ROWS - 1;
                                }
                                break;
                        case 4:
                                iRunX = pSoldier->sX + Random( 9 ) - 4;
                                iRunY = WORLD_ROWS;
                                if (iRunX < 0)
                                {
                                        iRunX = 0;
                                }
                                else if (iRunX >= WORLD_COLS)
                                {
                                        iRunX = WORLD_COLS - 1;
                                }
                                break;
                        case 6:
                                iRunX = 0;
                                iRunY = pSoldier->sY + Random( 9 ) - 4;
                                if (iRunY < 0)
                                {
                                        iRunY = 0;
                                }
                                else if (iRunY >= WORLD_COLS)
                                {
                                        iRunY = WORLD_ROWS - 1;
                                }
                                break;
                }
                iRunGridNo = iRunX + iRunY * WORLD_COLS;
                if (LegalNPCDestination( pSoldier, (UINT16) iRunGridNo, ENSURE_PATH, TRUE,0))
                {
                        return( (UINT16) iRunGridNo );
                }
                // otherwise we'll try again another time
        }
        return( NOWHERE );
}
*/
