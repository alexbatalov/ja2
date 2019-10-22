const NEXT_TILE_CHECK_DELAY = 700;

function SetDelayedTileWaiting(pSoldier: Pointer<SOLDIERTYPE>, sCauseGridNo: INT16, bValue: INT8): void {
  let ubPerson: UINT8;

  // Cancel AI Action
  // CancelAIAction( pSoldier, TRUE );

  pSoldier.value.fDelayedMovement = bValue;
  pSoldier.value.sDelayedMovementCauseGridNo = sCauseGridNo;

  RESETTIMECOUNTER(pSoldier.value.NextTileCounter, NEXT_TILE_CHECK_DELAY);

  // ATE: Now update realtime movement speed....
  // check if guy exists here...
  ubPerson = WhoIsThere2(sCauseGridNo, pSoldier.value.bLevel);

  // There may not be anybody there, but it's reserved by them!
  if ((gpWorldLevelData[sCauseGridNo].uiFlags & MAPELEMENT_MOVEMENT_RESERVED)) {
    ubPerson = gpWorldLevelData[sCauseGridNo].ubReservedSoldierID;
  }

  if (ubPerson != NOBODY) {
    // if they are our own team members ( both )
    if (MercPtrs[ubPerson].value.bTeam == gbPlayerNum && pSoldier.value.bTeam == gbPlayerNum) {
      // Here we have another guy.... save his stats so we can use them for
      // speed determinations....
      pSoldier.value.bOverrideMoveSpeed = ubPerson;
      pSoldier.value.fUseMoverrideMoveSpeed = TRUE;
    }
  }
}

function SetFinalTile(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, fGivenUp: BOOLEAN): void {
  // OK, If we were waiting for stuff, do it here...

  // ATE: Disabled stuff below, made obsolete by timeout...
  // if ( pSoldier->ubWaitActionToDo  )
  //{
  //	pSoldier->ubWaitActionToDo = 0;
  //	gbNumMercsUntilWaitingOver--;
  //}
  pSoldier.value.sFinalDestination = pSoldier.value.sGridNo;

  if (pSoldier.value.bTeam == gbPlayerNum && fGivenUp) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[NO_PATH_FOR_MERC], pSoldier.value.name);
  }

  EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
}

function MarkMovementReserved(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  // Check if we have one reserrved already, and free it first!
  if (pSoldier.value.sReservedMovementGridNo != NOWHERE) {
    UnMarkMovementReserved(pSoldier);
  }

  // For single-tiled mercs, set this gridno
  gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_MOVEMENT_RESERVED;

  // Save soldier's reserved ID #
  gpWorldLevelData[sGridNo].ubReservedSoldierID = pSoldier.value.ubID;

  pSoldier.value.sReservedMovementGridNo = sGridNo;
}

function UnMarkMovementReserved(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sNewGridNo: INT16;

  sNewGridNo = GETWORLDINDEXFROMWORLDCOORDS(pSoldier.value.dYPos, pSoldier.value.dXPos);

  // OK, if NOT in fence anim....
  if (pSoldier.value.usAnimState == HOPFENCE && pSoldier.value.sReservedMovementGridNo != sNewGridNo) {
    return;
  }

  // For single-tiled mercs, unset this gridno
  // See if we have one reserved!
  if (pSoldier.value.sReservedMovementGridNo != NOWHERE) {
    gpWorldLevelData[pSoldier.value.sReservedMovementGridNo].uiFlags &= (~MAPELEMENT_MOVEMENT_RESERVED);

    pSoldier.value.sReservedMovementGridNo = NOWHERE;
  }
}

function TileIsClear(pSoldier: Pointer<SOLDIERTYPE>, bDirection: INT8, sGridNo: INT16, bLevel: INT8): INT8 {
  let ubPerson: UINT8;
  let sTempDestGridNo: INT16;
  let sNewGridNo: INT16;
  let fSwapInDoor: BOOLEAN = FALSE;

  if (sGridNo == NOWHERE) {
    return MOVE_TILE_CLEAR;
  }

  ubPerson = WhoIsThere2(sGridNo, bLevel);

  if (ubPerson != NO_SOLDIER) {
    // If this us?
    if (ubPerson != pSoldier.value.ubID) {
      // OK, set flag indicating we are blocked by a merc....
      if (pSoldier.value.bTeam != gbPlayerNum) // CJC: shouldn't this be in all cases???
      // if ( 0 )
      {
        pSoldier.value.fBlockedByAnotherMerc = TRUE;
        // Set direction we were trying to goto
        pSoldier.value.bBlockedByAnotherMercDirection = bDirection;

        // Are we only temporarily blocked?
        // Check if our final destination is = our gridno
        if ((MercPtrs[ubPerson].value.sFinalDestination == MercPtrs[ubPerson].value.sGridNo)) {
          return MOVE_TILE_STATIONARY_BLOCKED;
        } else {
          // OK, if buddy who is blocking us is trying to move too...
          // And we are in opposite directions...
          if (MercPtrs[ubPerson].value.fBlockedByAnotherMerc && MercPtrs[ubPerson].value.bBlockedByAnotherMercDirection == gOppositeDirection[bDirection]) {
            // OK, try and get a path around buddy....
            // We have to temporarily make buddy stopped...
            sTempDestGridNo = MercPtrs[ubPerson].value.sFinalDestination;
            MercPtrs[ubPerson].value.sFinalDestination = MercPtrs[ubPerson].value.sGridNo;

            if (PlotPath(pSoldier, pSoldier.value.sFinalDestination, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints)) {
              pSoldier.value.bPathStored = FALSE;
              // OK, make guy go here...
              EVENT_GetNewSoldierPath(pSoldier, pSoldier.value.sFinalDestination, pSoldier.value.usUIMovementMode);
              // Restore final dest....
              MercPtrs[ubPerson].value.sFinalDestination = sTempDestGridNo;
              pSoldier.value.fBlockedByAnotherMerc = FALSE;

              // Is the next tile blocked too?
              sNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(guiPathingData[0]));

              return TileIsClear(pSoldier, guiPathingData[0], sNewGridNo, pSoldier.value.bLevel);
            } else {
              // Not for multi-tiled things...
              if (!(pSoldier.value.uiStatusFlags & SOLDIER_MULTITILE)) {
                // Is the next movement cost for a door?
                if (DoorTravelCost(pSoldier, sGridNo, gubWorldMovementCosts[sGridNo][bDirection][pSoldier.value.bLevel], (pSoldier.value.bTeam == gbPlayerNum), NULL) == TRAVELCOST_DOOR) {
                  fSwapInDoor = TRUE;
                }

                // If we are to swap and we're near a door, open door first and then close it...?

                // Swap now!
                MercPtrs[ubPerson].value.fBlockedByAnotherMerc = FALSE;

                // Restore final dest....
                MercPtrs[ubPerson].value.sFinalDestination = sTempDestGridNo;

                // Swap merc positions.....
                SwapMercPositions(pSoldier, MercPtrs[ubPerson]);

                // With these two guys swapped, they should try and continue on their way....
                // Start them both again along their way...
                EVENT_GetNewSoldierPath(pSoldier, pSoldier.value.sFinalDestination, pSoldier.value.usUIMovementMode);
                EVENT_GetNewSoldierPath(MercPtrs[ubPerson], MercPtrs[ubPerson].value.sFinalDestination, MercPtrs[ubPerson].value.usUIMovementMode);
              }
            }
          }
          return MOVE_TILE_TEMP_BLOCKED;
        }
      } else {
        // return( MOVE_TILE_STATIONARY_BLOCKED );
        // ATE: OK, put some smartshere...
        // If we are waiting for more than a few times, change to stationary...
        if (MercPtrs[ubPerson].value.fDelayedMovement >= 105) {
          // Set to special 'I want to walk through people' value
          pSoldier.value.fDelayedMovement = 150;

          return MOVE_TILE_STATIONARY_BLOCKED;
        }
        if (MercPtrs[ubPerson].value.sGridNo == MercPtrs[ubPerson].value.sFinalDestination) {
          return MOVE_TILE_STATIONARY_BLOCKED;
        }
        return MOVE_TILE_TEMP_BLOCKED;
      }
    }
  }

  if ((gpWorldLevelData[sGridNo].uiFlags & MAPELEMENT_MOVEMENT_RESERVED)) {
    if (gpWorldLevelData[sGridNo].ubReservedSoldierID != pSoldier.value.ubID) {
      return MOVE_TILE_TEMP_BLOCKED;
    }
  }

  // Are we clear of structs?
  if (!NewOKDestination(pSoldier, sGridNo, FALSE, pSoldier.value.bLevel)) {
    // ATE: Fence cost is an exclusiuon here....
    if (gubWorldMovementCosts[sGridNo][bDirection][pSoldier.value.bLevel] != TRAVELCOST_FENCE) {
      // ATE: HIdden structs - we do something here... reveal it!
      if (gubWorldMovementCosts[sGridNo][bDirection][pSoldier.value.bLevel] == TRAVELCOST_HIDDENOBSTACLE) {
        gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REVEALED;
        gpWorldLevelData[sGridNo].uiFlags |= MAPELEMENT_REDRAW;
        SetRenderFlags(RENDER_FLAG_MARKED);
        RecompileLocalMovementCosts(sGridNo);
      }

      // Unset flag for blocked by soldier...
      pSoldier.value.fBlockedByAnotherMerc = FALSE;
      return MOVE_TILE_STATIONARY_BLOCKED;
    } else {
    }
  }

  // Unset flag for blocked by soldier...
  pSoldier.value.fBlockedByAnotherMerc = FALSE;

  return MOVE_TILE_CLEAR;
}

function HandleNextTile(pSoldier: Pointer<SOLDIERTYPE>, bDirection: INT8, sGridNo: INT16, sFinalDestTile: INT16): BOOLEAN {
  let bBlocked: INT8;
  let bOverTerrainType: INT16;

  // Check for blocking if in realtime
  /// if ( ( gTacticalStatus.uiFlags & REALTIME ) || !( gTacticalStatus.uiFlags & INCOMBAT ) )

  // ATE: If not on visible tile, return clear ( for path out of map )
  if (!GridNoOnVisibleWorldTile(sGridNo)) {
    return TRUE;
  }

  // If animation state is crow, iall is clear
  if (pSoldier.value.usAnimState == CROW_FLY) {
    return TRUE;
  }

  {
    bBlocked = TileIsClear(pSoldier, bDirection, sGridNo, pSoldier.value.bLevel);

    // Check if we are blocked...
    if (bBlocked != MOVE_TILE_CLEAR) {
      // Is the next gridno our destination?
      // OK: Let's check if we are NOT walking off screen
      if (sGridNo == sFinalDestTile && pSoldier.value.ubWaitActionToDo == 0 && (pSoldier.value.bTeam == gbPlayerNum || pSoldier.value.sAbsoluteFinalDestination == NOWHERE)) {
        // Yah, well too bad, stop here.
        SetFinalTile(pSoldier, pSoldier.value.sGridNo, FALSE);

        return FALSE;
      }
      // CHECK IF they are stationary
      else if (bBlocked == MOVE_TILE_STATIONARY_BLOCKED) {
        // Stationary,
        {
          let sOldFinalDest: INT16;

          // Maintain sFinalDest....
          sOldFinalDest = pSoldier.value.sFinalDestination;
          EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
          // Restore...
          pSoldier.value.sFinalDestination = sOldFinalDest;

          SetDelayedTileWaiting(pSoldier, sGridNo, 1);

          return FALSE;
        }
      } else {
        {
          let sOldFinalDest: INT16;

          // Maintain sFinalDest....
          sOldFinalDest = pSoldier.value.sFinalDestination;
          EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
          // Restore...
          pSoldier.value.sFinalDestination = sOldFinalDest;

          // Setting to two means: try and wait until this tile becomes free....
          SetDelayedTileWaiting(pSoldier, sGridNo, 100);
        }

        return FALSE;
      }
    } else {
      // Mark this tile as reserverd ( until we get there! )
      if (!((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT))) {
        MarkMovementReserved(pSoldier, sGridNo);
      }

      bOverTerrainType = GetTerrainType(sGridNo);

      // Check if we are going into water!
      if (bOverTerrainType == LOW_WATER || bOverTerrainType == MED_WATER || bOverTerrainType == DEEP_WATER) {
        // Check if we are of prone or crawl height and change stance accordingly....
        switch (gAnimControl[pSoldier.value.usAnimState].ubHeight) {
          case ANIM_PRONE:
          case ANIM_CROUCH:

            // Change height to stand
            pSoldier.value.fContinueMoveAfterStanceChange = TRUE;
            SendChangeSoldierStanceEvent(pSoldier, ANIM_STAND);
            break;
        }

        // Check animation
        // Change to walking
        if (pSoldier.value.usAnimState == RUNNING) {
          ChangeSoldierState(pSoldier, WALKING, 0, FALSE);
        }
      }
    }
  }
  return TRUE;
}

function HandleNextTileWaiting(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  // Buddy is waiting to continue his path
  let bBlocked: INT8;
  let bPathBlocked: INT8;
  let sCost: INT16;
  let sNewGridNo: INT16;
  let sCheckGridNo: INT16;
  let ubDirection: UINT8;
  let bCauseDirection: UINT8;
  let ubPerson: UINT8;
  let fFlags: UINT8 = 0;

  if (pSoldier.value.fDelayedMovement) {
    if (TIMECOUNTERDONE(pSoldier.value.NextTileCounter, NEXT_TILE_CHECK_DELAY)) {
      RESETTIMECOUNTER(pSoldier.value.NextTileCounter, NEXT_TILE_CHECK_DELAY);

      // Get direction from gridno...
      bCauseDirection = GetDirectionToGridNoFromGridNo(pSoldier.value.sGridNo, pSoldier.value.sDelayedMovementCauseGridNo);

      bBlocked = TileIsClear(pSoldier, bCauseDirection, pSoldier.value.sDelayedMovementCauseGridNo, pSoldier.value.bLevel);

      // If we are waiting for a temp blockage.... continue to wait
      if (pSoldier.value.fDelayedMovement >= 100 && bBlocked == MOVE_TILE_TEMP_BLOCKED) {
        // ATE: Increment 1
        pSoldier.value.fDelayedMovement++;

        // Are we close enough to give up? ( and are a pc )
        if (pSoldier.value.fDelayedMovement > 120) {
          // Quit...
          SetFinalTile(pSoldier, pSoldier.value.sGridNo, TRUE);
          pSoldier.value.fDelayedMovement = FALSE;
        }
        return TRUE;
      }

      // Try new path if anything but temp blockage!
      if (bBlocked != MOVE_TILE_TEMP_BLOCKED) {
        // Set to normal delay
        if (pSoldier.value.fDelayedMovement >= 100 && pSoldier.value.fDelayedMovement != 150) {
          pSoldier.value.fDelayedMovement = 1;
        }

        // Default to pathing through people
        fFlags = PATH_THROUGH_PEOPLE;

        // Now, if we are in the state where we are desparently trying to get out...
        // Use other flag
        // CJC: path-through-people includes ignoring person at dest
        /*
        if ( pSoldier->fDelayedMovement >= 150 )
        {
                fFlags = PATH_IGNORE_PERSON_AT_DEST;
        }
        */

        // Check destination first!
        if (pSoldier.value.sAbsoluteFinalDestination == pSoldier.value.sFinalDestination) {
          // on last lap of scripted move, make sure we get to final dest
          sCheckGridNo = pSoldier.value.sAbsoluteFinalDestination;
        } else if (!NewOKDestination(pSoldier, pSoldier.value.sFinalDestination, TRUE, pSoldier.value.bLevel)) {
          if (pSoldier.value.fDelayedMovement >= 150) {
            // OK, look around dest for the first one!
            sCheckGridNo = FindGridNoFromSweetSpot(pSoldier, pSoldier.value.sFinalDestination, 6, addressof(ubDirection));

            if (sCheckGridNo == NOWHERE) {
              // If this is nowhere, try harder!
              sCheckGridNo = FindGridNoFromSweetSpot(pSoldier, pSoldier.value.sFinalDestination, 16, addressof(ubDirection));
            }
          } else {
            // OK, look around dest for the first one!
            sCheckGridNo = FindGridNoFromSweetSpotThroughPeople(pSoldier, pSoldier.value.sFinalDestination, 6, addressof(ubDirection));

            if (sCheckGridNo == NOWHERE) {
              // If this is nowhere, try harder!
              sCheckGridNo = FindGridNoFromSweetSpotThroughPeople(pSoldier, pSoldier.value.sFinalDestination, 16, addressof(ubDirection));
            }
          }
        } else {
          sCheckGridNo = pSoldier.value.sFinalDestination;
        }

        // Try another path to destination
        // ATE: Allow path to exit grid!
        if (pSoldier.value.ubWaitActionToDo == 1 && gubWaitingForAllMercsToExitCode == WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO) {
          gfPlotPathToExitGrid = TRUE;
        }

        sCost = FindBestPath(pSoldier, sCheckGridNo, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, NO_COPYROUTE, fFlags);
        gfPlotPathToExitGrid = FALSE;

        // Can we get there
        if (sCost > 0) {
          // Is the next tile blocked too?
          sNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(guiPathingData[0]));

          bPathBlocked = TileIsClear(pSoldier, guiPathingData[0], sNewGridNo, pSoldier.value.bLevel);

          if (bPathBlocked == MOVE_TILE_STATIONARY_BLOCKED) {
            // Try to path around everyone except dest person

            if (pSoldier.value.ubWaitActionToDo == 1 && gubWaitingForAllMercsToExitCode == WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO) {
              gfPlotPathToExitGrid = TRUE;
            }

            sCost = FindBestPath(pSoldier, sCheckGridNo, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, NO_COPYROUTE, PATH_IGNORE_PERSON_AT_DEST);

            gfPlotPathToExitGrid = FALSE;

            // Is the next tile in this new path blocked too?
            sNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(guiPathingData[0]));

            bPathBlocked = TileIsClear(pSoldier, guiPathingData[0], sNewGridNo, pSoldier.value.bLevel);

            // now working with a path which does not go through people
            pSoldier.value.ubDelayedMovementFlags &= (~DELAYED_MOVEMENT_FLAG_PATH_THROUGH_PEOPLE);
          } else {
            // path through people worked fine
            if (pSoldier.value.fDelayedMovement < 150) {
              pSoldier.value.ubDelayedMovementFlags |= DELAYED_MOVEMENT_FLAG_PATH_THROUGH_PEOPLE;
            }
          }

          // Are we clear?
          if (bPathBlocked == MOVE_TILE_CLEAR) {
            // Go for it path!
            if (pSoldier.value.ubWaitActionToDo == 1 && gubWaitingForAllMercsToExitCode == WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO) {
              gfPlotPathToExitGrid = TRUE;
            }

            // pSoldier->fDelayedMovement = FALSE;
            // ATE: THis will get set in EENT_GetNewSoldierPath....
            pSoldier.value.usActionData = sCheckGridNo;

            pSoldier.value.bPathStored = FALSE;

            EVENT_GetNewSoldierPath(pSoldier, sCheckGridNo, pSoldier.value.usUIMovementMode);
            gfPlotPathToExitGrid = FALSE;

            return TRUE;
          }
        }

        pSoldier.value.fDelayedMovement++;

        if (pSoldier.value.fDelayedMovement == 99) {
          // Cap at 99
          pSoldier.value.fDelayedMovement = 99;
        }

        // Do we want to force a swap?
        if (pSoldier.value.fDelayedMovement == 3 && (pSoldier.value.sAbsoluteFinalDestination != NOWHERE || gTacticalStatus.fAutoBandageMode)) {
          // with person who is in the way?
          ubPerson = WhoIsThere2(pSoldier.value.sDelayedMovementCauseGridNo, pSoldier.value.bLevel);

          // if either on a mission from god, or two AI guys not on stationary...
          if (ubPerson != NOBODY && (pSoldier.value.ubQuoteRecord != 0 || (pSoldier.value.bTeam != gbPlayerNum && pSoldier.value.bOrders != STATIONARY && MercPtrs[ubPerson].value.bTeam != gbPlayerNum && MercPtrs[ubPerson].value.bOrders != STATIONARY) || (pSoldier.value.bTeam == gbPlayerNum && gTacticalStatus.fAutoBandageMode && !(MercPtrs[ubPerson].value.bTeam == CIV_TEAM && MercPtrs[ubPerson].value.bOrders == STATIONARY)))) {
            // Swap now!
            // MercPtrs[ ubPerson ]->fBlockedByAnotherMerc = FALSE;

            // Restore final dest....
            // MercPtrs[ ubPerson ]->sFinalDestination = sTempDestGridNo;

            // Swap merc positions.....
            SwapMercPositions(pSoldier, MercPtrs[ubPerson]);

            // With these two guys swapped, we should try to continue on our way....
            pSoldier.value.fDelayedMovement = FALSE;

            // We must calculate the path here so that we can give it the "through people" parameter
            if (gTacticalStatus.fAutoBandageMode && pSoldier.value.sAbsoluteFinalDestination == NOWHERE) {
              FindBestPath(pSoldier, pSoldier.value.sFinalDestination, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, COPYROUTE, PATH_THROUGH_PEOPLE);
            } else if (pSoldier.value.sAbsoluteFinalDestination != NOWHERE && !FindBestPath(pSoldier, pSoldier.value.sAbsoluteFinalDestination, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, COPYROUTE, PATH_THROUGH_PEOPLE)) {
              // check to see if we're there now!
              if (pSoldier.value.sGridNo == pSoldier.value.sAbsoluteFinalDestination) {
                NPCReachedDestination(pSoldier, FALSE);
                pSoldier.value.bNextAction = AI_ACTION_WAIT;
                pSoldier.value.usNextActionData = 500;
                return TRUE;
              }
            }
            pSoldier.value.bPathStored = TRUE;

            EVENT_GetNewSoldierPath(pSoldier, pSoldier.value.sAbsoluteFinalDestination, pSoldier.value.usUIMovementMode);
            // EVENT_GetNewSoldierPath( MercPtrs[ ubPerson ], MercPtrs[ ubPerson ]->sFinalDestination, MercPtrs[ ubPerson ]->usUIMovementMode );
          }
        }

        // Are we close enough to give up? ( and are a pc )
        if (pSoldier.value.fDelayedMovement > 20 && pSoldier.value.fDelayedMovement != 150) {
          if (PythSpacesAway(pSoldier.value.sGridNo, pSoldier.value.sFinalDestination) < 5 && pSoldier.value.bTeam == gbPlayerNum) {
            // Quit...
            SetFinalTile(pSoldier, pSoldier.value.sGridNo, FALSE);
            pSoldier.value.fDelayedMovement = FALSE;
          }
        }

        // Are we close enough to give up? ( and are a pc )
        if (pSoldier.value.fDelayedMovement > 170) {
          if (PythSpacesAway(pSoldier.value.sGridNo, pSoldier.value.sFinalDestination) < 5 && pSoldier.value.bTeam == gbPlayerNum) {
            // Quit...
            SetFinalTile(pSoldier, pSoldier.value.sGridNo, FALSE);
            pSoldier.value.fDelayedMovement = FALSE;
          }
        }
      }
    }
  }
  return TRUE;
}

function TeleportSoldier(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, fForce: BOOLEAN): BOOLEAN {
  let sX: INT16;
  let sY: INT16;

  // Check dest...
  if (NewOKDestination(pSoldier, sGridNo, TRUE, 0) || fForce) {
    // TELEPORT TO THIS LOCATION!
    sX = CenterX(sGridNo);
    sY = CenterY(sGridNo);
    EVENT_SetSoldierPosition(pSoldier, sX, sY);

    pSoldier.value.sFinalDestination = sGridNo;

    // Make call to FOV to update items...
    RevealRoofsAndItems(pSoldier, TRUE, TRUE, pSoldier.value.bLevel, TRUE);

    // Handle sight!
    HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO);

    // Cancel services...
    GivingSoldierCancelServices(pSoldier);

    // Change light....
    if (pSoldier.value.bLevel == 0) {
      if (pSoldier.value.iLight != (-1))
        LightSpriteRoofStatus(pSoldier.value.iLight, FALSE);
    } else {
      if (pSoldier.value.iLight != (-1))
        LightSpriteRoofStatus(pSoldier.value.iLight, TRUE);
    }
    return TRUE;
  }

  return FALSE;
}

// Swaps 2 soldier positions...
function SwapMercPositions(pSoldier1: Pointer<SOLDIERTYPE>, pSoldier2: Pointer<SOLDIERTYPE>): void {
  let sGridNo1: INT16;
  let sGridNo2: INT16;

  // OK, save positions...
  sGridNo1 = pSoldier1.value.sGridNo;
  sGridNo2 = pSoldier2.value.sGridNo;

  // OK, remove each.....
  RemoveSoldierFromGridNo(pSoldier1);
  RemoveSoldierFromGridNo(pSoldier2);

  // OK, test OK destination for each.......
  if (NewOKDestination(pSoldier1, sGridNo2, TRUE, 0) && NewOKDestination(pSoldier2, sGridNo1, TRUE, 0)) {
    // OK, call teleport function for each.......
    TeleportSoldier(pSoldier1, sGridNo2, FALSE);
    TeleportSoldier(pSoldier2, sGridNo1, FALSE);
  } else {
    // Place back...
    TeleportSoldier(pSoldier1, sGridNo1, TRUE);
    TeleportSoldier(pSoldier2, sGridNo2, TRUE);
  }
}

function CanExchangePlaces(pSoldier1: Pointer<SOLDIERTYPE>, pSoldier2: Pointer<SOLDIERTYPE>, fShow: BOOLEAN): BOOLEAN {
  // NB checks outside of this function
  if (EnoughPoints(pSoldier1, AP_EXCHANGE_PLACES, 0, fShow)) {
    if (EnoughPoints(pSoldier2, AP_EXCHANGE_PLACES, 0, fShow)) {
      if ((gAnimControl[pSoldier2.value.usAnimState].uiFlags & ANIM_MOVING)) {
        return FALSE;
      }

      if ((gAnimControl[pSoldier1.value.usAnimState].uiFlags & ANIM_MOVING) && !(gTacticalStatus.uiFlags & INCOMBAT)) {
        return FALSE;
      }

      if (pSoldier2.value.bSide == 0) {
        return TRUE;
      }

      // hehe - don't allow animals to exchange places
      if (pSoldier2.value.uiStatusFlags & (SOLDIER_ANIMAL)) {
        return FALSE;
      }

      // must NOT be hostile, must NOT have stationary orders OR militia team, must be >= OKLIFE
      if (pSoldier2.value.bNeutral && pSoldier2.value.bLife >= OKLIFE && pSoldier2.value.ubCivilianGroup != HICKS_CIV_GROUP && ((pSoldier2.value.bOrders != STATIONARY || pSoldier2.value.bTeam == MILITIA_TEAM) || (pSoldier2.value.sAbsoluteFinalDestination != NOWHERE && pSoldier2.value.sAbsoluteFinalDestination != pSoldier2.value.sGridNo))) {
        return TRUE;
      }

      if (fShow) {
        if (pSoldier2.value.ubProfile == NO_PROFILE) {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[REFUSE_EXCHANGE_PLACES]);
        } else {
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, gzLateLocalizedString[3], pSoldier2.value.name);
        }
      }

      // ATE: OK, reduce this guy's next ai counter....
      pSoldier2.value.uiAIDelay = 100;

      return FALSE;
    } else {
      return FALSE;
    }
  } else {
    return FALSE;
  }
  return TRUE;
}
