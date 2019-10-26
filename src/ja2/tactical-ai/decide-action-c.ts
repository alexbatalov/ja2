namespace ja2 {

// global status time counters to determine what takes the most time

const CENTER_OF_RING = 11237;

function DoneScheduleAction(pSoldier: Pointer<SOLDIERTYPE>): void {
  pSoldier.value.fAIFlags &= (~AI_CHECK_SCHEDULE);
  pSoldier.value.bAIScheduleProgress = 0;
  PostNextSchedule(pSoldier);
}

function DecideActionSchedule(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let pSchedule: Pointer<SCHEDULENODE>;
  let iScheduleIndex: INT32;
  let ubScheduleAction: UINT8;
  let usGridNo1: UINT16;
  let usGridNo2: UINT16;
  let sX: INT16;
  let sY: INT16;
  let bDirection: INT8;
  let pStructure: Pointer<STRUCTURE>;
  let fDoUseDoor: boolean;
  let pDoorStatus: Pointer<DOOR_STATUS>;

  pSchedule = GetSchedule(pSoldier.value.ubScheduleID);
  if (!pSchedule) {
    return Enum289.AI_ACTION_NONE;
  }

  if (pSchedule.value.usFlags & SCHEDULE_FLAGS_ACTIVE1) {
    iScheduleIndex = 0;
  } else if (pSchedule.value.usFlags & SCHEDULE_FLAGS_ACTIVE2) {
    iScheduleIndex = 1;
  } else if (pSchedule.value.usFlags & SCHEDULE_FLAGS_ACTIVE3) {
    iScheduleIndex = 2;
  } else if (pSchedule.value.usFlags & SCHEDULE_FLAGS_ACTIVE4) {
    iScheduleIndex = 3;
  } else {
    // error!
    return Enum289.AI_ACTION_NONE;
  }

  ubScheduleAction = pSchedule.value.ubAction[iScheduleIndex];
  usGridNo1 = pSchedule.value.usData1[iScheduleIndex];
  usGridNo2 = pSchedule.value.usData2[iScheduleIndex];

  // assume soldier is awake unless the action is a sleep
  pSoldier.value.fAIFlags &= ~(AI_ASLEEP);

  switch (ubScheduleAction) {
    case Enum171.SCHEDULE_ACTION_LOCKDOOR:
      // Uses first gridno for locking door, then second to move to after door is locked.
      // It is possible that the second gridno will border the edge of the map, meaning that
      // the individual will walk off of the map.
      // If this is a "merchant", make sure that nobody occupies the building/room.

      switch (pSoldier.value.bAIScheduleProgress) {
        case 0: // move to gridno specified
          if (pSoldier.value.sGridNo == usGridNo1) {
            pSoldier.value.bAIScheduleProgress++;
            // fall through
          } else {
            pSoldier.value.usActionData = usGridNo1;
            pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
            return Enum289.AI_ACTION_SCHEDULE_MOVE;
          }
          // fall through
        case 1:
          // start the door open: find the door...
          usGridNo1 = FindDoorAtGridNoOrAdjacent(usGridNo1);

          if (usGridNo1 == NOWHERE) {
            // do nothing right now!
            return Enum289.AI_ACTION_NONE;
          }

          pDoorStatus = GetDoorStatus(usGridNo1);
          if (pDoorStatus && pDoorStatus.value.ubFlags & DOOR_BUSY) {
            // do nothing right now!
            return Enum289.AI_ACTION_NONE;
          }

          pStructure = FindStructure(usGridNo1, STRUCTURE_ANYDOOR);
          if (pStructure == null) {
            fDoUseDoor = false;
          } else {
            // action-specific tests to not handle the door
            fDoUseDoor = true;

            if (pStructure.value.fFlags & STRUCTURE_OPEN) {
              // not only do we have to lock the door but
              // close it too!
              pSoldier.value.fAIFlags |= AI_LOCK_DOOR_INCLUDES_CLOSE;
            } else {
              let pDoor: Pointer<DOOR>;

              pDoor = FindDoorInfoAtGridNo(usGridNo1);
              if (pDoor) {
                if (pDoor.value.fLocked) {
                  // door already locked!
                  fDoUseDoor = false;
                } else {
                  pDoor.value.fLocked = true;
                }
              } else {
                ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Schedule involved locked door at %d but there's no lock there!", usGridNo1);
                fDoUseDoor = false;
              }
            }
          }

          if (fDoUseDoor) {
            pSoldier.value.usActionData = usGridNo1;
            return Enum289.AI_ACTION_LOCK_DOOR;
          }

          // the door is already in the desired state, or it doesn't exist!
          pSoldier.value.bAIScheduleProgress++;
          // fall through

        case 2:
          if (pSoldier.value.sGridNo == usGridNo2 || pSoldier.value.sGridNo == NOWHERE) {
            // NOWHERE indicates we were supposed to go off map and have done so
            DoneScheduleAction(pSoldier);

            if (pSoldier.value.sGridNo != NOWHERE) {
              pSoldier.value.usPatrolGrid[0] = pSoldier.value.sGridNo;
            }
          } else {
            if (GridNoOnEdgeOfMap(usGridNo2, addressof(bDirection))) {
              // told to go to edge of map, so go off at that point!
              pSoldier.value.ubQuoteActionID = GetTraversalQuoteActionID(bDirection);
            }
            pSoldier.value.usActionData = usGridNo2;
            pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
            return Enum289.AI_ACTION_SCHEDULE_MOVE;
          }
          break;
      }
      break;

    case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
    case Enum171.SCHEDULE_ACTION_OPENDOOR:
    case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
      // Uses first gridno for opening/closing/unlocking door, then second to move to after door is opened.
      // It is possible that the second gridno will border the edge of the map, meaning that
      // the individual will walk off of the map.
      switch (pSoldier.value.bAIScheduleProgress) {
        case 0: // move to gridno specified
          if (pSoldier.value.sGridNo == usGridNo1) {
            pSoldier.value.bAIScheduleProgress++;
            // fall through
          } else {
            pSoldier.value.usActionData = usGridNo1;
            pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
            return Enum289.AI_ACTION_SCHEDULE_MOVE;
          }
          // fall through
        case 1:
          // start the door open: find the door...
          usGridNo1 = FindDoorAtGridNoOrAdjacent(usGridNo1);

          if (usGridNo1 == NOWHERE) {
            // do nothing right now!
            return Enum289.AI_ACTION_NONE;
          }

          pDoorStatus = GetDoorStatus(usGridNo1);
          if (pDoorStatus && pDoorStatus.value.ubFlags & DOOR_BUSY) {
            // do nothing right now!
            return Enum289.AI_ACTION_NONE;
          }

          pStructure = FindStructure(usGridNo1, STRUCTURE_ANYDOOR);
          if (pStructure == null) {
            fDoUseDoor = false;
          } else {
            fDoUseDoor = true;

            // action-specific tests to not handle the door
            switch (ubScheduleAction) {
              case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
                if (pStructure.value.fFlags & STRUCTURE_OPEN) {
                  // door is already open!
                  fDoUseDoor = false;
                } else {
                  // set the door to unlocked
                  let pDoor: Pointer<DOOR>;

                  pDoor = FindDoorInfoAtGridNo(usGridNo1);
                  if (pDoor) {
                    if (pDoor.value.fLocked) {
                      pDoor.value.fLocked = false;
                    } else {
                      // door already unlocked!
                      fDoUseDoor = false;
                    }
                  } else {
                    // WTF?  Warning time!
                    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Schedule involved locked door at %d but there's no lock there!", usGridNo1);
                    fDoUseDoor = false;
                  }
                }
                break;
              case Enum171.SCHEDULE_ACTION_OPENDOOR:
                if (pStructure.value.fFlags & STRUCTURE_OPEN) {
                  // door is already open!
                  fDoUseDoor = false;
                }
                break;
              case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
                if (!(pStructure.value.fFlags & STRUCTURE_OPEN)) {
                  // door is already closed!
                  fDoUseDoor = false;
                }
                break;
              default:
                break;
            }
          }

          if (fDoUseDoor) {
            pSoldier.value.usActionData = usGridNo1;
            if (ubScheduleAction == Enum171.SCHEDULE_ACTION_UNLOCKDOOR) {
              return Enum289.AI_ACTION_UNLOCK_DOOR;
            } else {
              return Enum289.AI_ACTION_OPEN_OR_CLOSE_DOOR;
            }
          }

          // the door is already in the desired state, or it doesn't exist!
          pSoldier.value.bAIScheduleProgress++;
          // fall through

        case 2:
          if (pSoldier.value.sGridNo == usGridNo2 || pSoldier.value.sGridNo == NOWHERE) {
            // NOWHERE indicates we were supposed to go off map and have done so
            DoneScheduleAction(pSoldier);
            if (pSoldier.value.sGridNo != NOWHERE) {
              pSoldier.value.usPatrolGrid[0] = pSoldier.value.sGridNo;
            }
          } else {
            if (GridNoOnEdgeOfMap(usGridNo2, addressof(bDirection))) {
              // told to go to edge of map, so go off at that point!
              pSoldier.value.ubQuoteActionID = GetTraversalQuoteActionID(bDirection);
            }
            pSoldier.value.usActionData = usGridNo2;
            pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
            return Enum289.AI_ACTION_SCHEDULE_MOVE;
          }
          break;
      }
      break;

    case Enum171.SCHEDULE_ACTION_GRIDNO:
      // Only uses the first gridno
      if (pSoldier.value.sGridNo == usGridNo1) {
        // done!
        DoneScheduleAction(pSoldier);
        if (pSoldier.value.sGridNo != NOWHERE) {
          pSoldier.value.usPatrolGrid[0] = pSoldier.value.sGridNo;
        }
      } else {
        // move!
        pSoldier.value.usActionData = usGridNo1;
        pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
        return Enum289.AI_ACTION_SCHEDULE_MOVE;
      }
      break;
    case Enum171.SCHEDULE_ACTION_LEAVESECTOR:
      // Doesn't use any gridno data
      switch (pSoldier.value.bAIScheduleProgress) {
        case 0: // start the action

          pSoldier.value.usActionData = FindNearestEdgePoint(pSoldier.value.sGridNo);

          if (pSoldier.value.usActionData == NOWHERE) {
            DoneScheduleAction(pSoldier);
            return Enum289.AI_ACTION_NONE;
          }

          if (pSoldier.value.sGridNo == pSoldier.value.usActionData) {
            // time to go off the map
            pSoldier.value.bAIScheduleProgress++;
          } else {
            // move!
            pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
            return Enum289.AI_ACTION_SCHEDULE_MOVE;
          }

          // fall through

        case 1: // near edge

          pSoldier.value.usActionData = FindNearbyPointOnEdgeOfMap(pSoldier, addressof(bDirection));
          if (pSoldier.value.usActionData == NOWHERE) {
            // what the heck??
            // ABORT!
            DoneScheduleAction(pSoldier);
          } else {
            pSoldier.value.ubQuoteActionID = GetTraversalQuoteActionID(bDirection);
            pSoldier.value.bAIScheduleProgress++;
            pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
            return Enum289.AI_ACTION_SCHEDULE_MOVE;
          }
          break;

        case 2: // should now be done!
          DoneScheduleAction(pSoldier);
          break;

        default:
          break;
      }
      break;

    case Enum171.SCHEDULE_ACTION_ENTERSECTOR:
      if (pSoldier.value.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags & PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR) {
        // ignore.
        DoneScheduleAction(pSoldier);
        break;
      }
      switch (pSoldier.value.bAIScheduleProgress) {
        case 0:
          sX = CenterX(pSoldier.value.sOffWorldGridNo);
          sY = CenterY(pSoldier.value.sOffWorldGridNo);
          EVENT_SetSoldierPosition(pSoldier, sX, sY);
          pSoldier.value.bInSector = true;
          MoveSoldierFromAwayToMercSlot(pSoldier);
          pSoldier.value.usActionData = usGridNo1;
          pSoldier.value.bAIScheduleProgress++;
          pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
          return Enum289.AI_ACTION_SCHEDULE_MOVE;
        case 1:
          if (pSoldier.value.sGridNo == usGridNo1) {
            DoneScheduleAction(pSoldier);
            if (pSoldier.value.sGridNo != NOWHERE) {
              pSoldier.value.usPatrolGrid[0] = pSoldier.value.sGridNo;
            }
          } else {
            pSoldier.value.usActionData = usGridNo1;
            pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
            return Enum289.AI_ACTION_SCHEDULE_MOVE;
          }
          break;
      }
      break;

    case Enum171.SCHEDULE_ACTION_WAKE:
      // Go to this position
      if (pSoldier.value.sGridNo == pSoldier.value.sInitialGridNo) {
        // th-th-th-that's it!
        DoneScheduleAction(pSoldier);
        pSoldier.value.usPatrolGrid[0] = pSoldier.value.sGridNo;
      } else {
        pSoldier.value.usActionData = pSoldier.value.sInitialGridNo;
        pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
        return Enum289.AI_ACTION_SCHEDULE_MOVE;
      }
      break;

    case Enum171.SCHEDULE_ACTION_SLEEP:
      // Go to this position
      if (pSoldier.value.sGridNo == usGridNo1) {
        // Sleep
        pSoldier.value.fAIFlags |= AI_ASLEEP;
        DoneScheduleAction(pSoldier);
        if (pSoldier.value.sGridNo != NOWHERE) {
          pSoldier.value.usPatrolGrid[0] = pSoldier.value.sGridNo;
        }
      } else {
        pSoldier.value.usActionData = usGridNo1;
        pSoldier.value.sAbsoluteFinalDestination = pSoldier.value.usActionData;
        return Enum289.AI_ACTION_SCHEDULE_MOVE;
      }
      break;
  }

  return Enum289.AI_ACTION_NONE;
}

function DecideActionBoxerEnteringRing(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let ubRoom: UINT8;
  let sDesiredMercLoc: INT16;
  let ubDesiredMercDir: UINT8;

  // boxer, should move into ring!
  if (InARoom(pSoldier.value.sGridNo, addressof(ubRoom))) {
    if (ubRoom == BOXING_RING) {
      // look towards nearest player
      sDesiredMercLoc = ClosestPC(pSoldier, null);
      if (sDesiredMercLoc != NOWHERE) {
        // see if we are facing this person
        ubDesiredMercDir = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(sDesiredMercLoc), CenterY(sDesiredMercLoc));

        // if not already facing in that direction,
        if (pSoldier.value.bDirection != ubDesiredMercDir && InternalIsValidStance(pSoldier, ubDesiredMercDir, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
          pSoldier.value.usActionData = ubDesiredMercDir;

          return Enum289.AI_ACTION_CHANGE_FACING;
        }
      }
      return Enum289.AI_ACTION_ABSOLUTELY_NONE;
    } else {
      // move to starting spot
      pSoldier.value.usActionData = FindClosestBoxingRingSpot(pSoldier, true);
      return Enum289.AI_ACTION_GET_CLOSER;
    }
  }

  return Enum289.AI_ACTION_ABSOLUTELY_NONE;
}

function DecideActionNamedNPC(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let sDesiredMercLoc: INT16;
  let ubDesiredMercDir: UINT8;
  let ubDesiredMerc: UINT8;
  let sDesiredMercDist: INT16;

  // if a quote record has been set and we're not doing movement, then
  // it means we have to wait until someone is nearby and then see
  // to do...

  // is this person close enough to trigger event?
  if (pSoldier.value.ubQuoteRecord && pSoldier.value.ubQuoteActionID == Enum290.QUOTE_ACTION_ID_TURNTOWARDSPLAYER) {
    sDesiredMercLoc = ClosestPC(pSoldier, addressof(sDesiredMercDist));
    if (sDesiredMercLoc != NOWHERE) {
      if (sDesiredMercDist <= NPC_TALK_RADIUS * 2) {
        pSoldier.value.ubQuoteRecord = 0;
        // see if this triggers a conversation/NPC record
        PCsNearNPC(pSoldier.value.ubProfile);
        // clear "handle every frame" flag
        pSoldier.value.fAIFlags &= (~AI_HANDLE_EVERY_FRAME);
        return Enum289.AI_ACTION_ABSOLUTELY_NONE;
      }

      // see if we are facing this person
      ubDesiredMercDir = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(sDesiredMercLoc), CenterY(sDesiredMercLoc));

      // if not already facing in that direction,
      if (pSoldier.value.bDirection != ubDesiredMercDir && InternalIsValidStance(pSoldier, ubDesiredMercDir, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
        pSoldier.value.usActionData = ubDesiredMercDir;

        return Enum289.AI_ACTION_CHANGE_FACING;
      }
    }

    // do nothing; we're looking at the PC or the NPC is far away
    return Enum289.AI_ACTION_ABSOLUTELY_NONE;
  } else {
    ///////////////
    // CHECK TO SEE IF WE WANT TO GO UP TO PERSON AND SAY SOMETHING
    ///////////////
    pSoldier.value.usActionData = NPCConsiderInitiatingConv(pSoldier, addressof(ubDesiredMerc));
    if (pSoldier.value.usActionData != NOWHERE) {
      return Enum289.AI_ACTION_APPROACH_MERC;
    }
  }

  switch (pSoldier.value.ubProfile) {
    case Enum268.JIM:
    case Enum268.JACK:
    case Enum268.OLAF:
    case Enum268.RAY:
    case Enum268.OLGA:
    case Enum268.TYRONE:
      sDesiredMercLoc = ClosestPC(pSoldier, addressof(sDesiredMercDist));
      if (sDesiredMercLoc != NOWHERE) {
        if (sDesiredMercDist <= NPC_TALK_RADIUS * 2) {
          AddToShouldBecomeHostileOrSayQuoteList(pSoldier.value.ubID);
          // now wait a bit!
          pSoldier.value.usActionData = 5000;
          return Enum289.AI_ACTION_WAIT;
        } else {
          pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sDesiredMercLoc, Enum289.AI_ACTION_APPROACH_MERC);
          if (pSoldier.value.usActionData != NOWHERE) {
            return Enum289.AI_ACTION_APPROACH_MERC;
          }
        }
      }
      break;
    default:
      break;
  }

  return Enum289.AI_ACTION_NONE;
}

function DecideActionGreen(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iChance: INT32;
  let iSneaky: INT32 = 10;
  let bInWater: INT8;
  let bInGas: INT8;

  let fCivilian: boolean = (PTR_CIVILIAN() && (pSoldier.value.ubCivilianGroup == Enum246.NON_CIV_GROUP || pSoldier.value.bNeutral || (pSoldier.value.ubBodyType >= Enum194.FATCIV && pSoldier.value.ubBodyType <= Enum194.CRIPPLECIV)));
  let fCivilianOrMilitia: boolean = PTR_CIV_OR_MILITIA();

  gubNPCPathCount = 0;

  if (gTacticalStatus.bBoxingState != Enum247.NOT_BOXING) {
    if (pSoldier.value.uiStatusFlags & SOLDIER_BOXER) {
      if (gTacticalStatus.bBoxingState == Enum247.PRE_BOXING) {
        return DecideActionBoxerEnteringRing(pSoldier);
      } else {
        let ubRoom: UINT8;
        let ubLoop: UINT8;

        // boxer... but since in status green, it's time to leave the ring!
        if (InARoom(pSoldier.value.sGridNo, addressof(ubRoom))) {
          if (ubRoom == BOXING_RING) {
            for (ubLoop = 0; ubLoop < NUM_BOXERS; ubLoop++) {
              if (pSoldier.value.ubID == gubBoxerID[ubLoop]) {
                // we should go back where we started
                pSoldier.value.usActionData = gsBoxerGridNo[ubLoop];
                return Enum289.AI_ACTION_GET_CLOSER;
              }
            }
            pSoldier.value.usActionData = FindClosestBoxingRingSpot(pSoldier, false);
            return Enum289.AI_ACTION_GET_CLOSER;
          } else {
            // done!
            pSoldier.value.uiStatusFlags &= ~(SOLDIER_BOXER);
            if (pSoldier.value.bTeam == gbPlayerNum) {
              pSoldier.value.uiStatusFlags &= (~SOLDIER_PCUNDERAICONTROL);
              TriggerEndOfBoxingRecord(pSoldier);
            } else if (CountPeopleInBoxingRing() == 0) {
              // Probably disqualified by jumping out of ring; the player
              // character then didn't trigger the end of boxing record
              // (and we know from the if statement above that we're
              // still in a boxing state of some sort...)
              TriggerEndOfBoxingRecord(null);
            }
          }
        }

        return Enum289.AI_ACTION_ABSOLUTELY_NONE;
      }
    }
    // else if ( (gTacticalStatus.bBoxingState == PRE_BOXING || gTacticalStatus.bBoxingState == BOXING) && ( PythSpacesAway( pSoldier->sGridNo, CENTER_OF_RING ) <= MaxDistanceVisible() ) )
    else if (PythSpacesAway(pSoldier.value.sGridNo, CENTER_OF_RING) <= MaxDistanceVisible()) {
      let ubRingDir: UINT8;
      // face ring!

      ubRingDir = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(CENTER_OF_RING), CenterY(CENTER_OF_RING));
      if (gfTurnBasedAI || GetAPsToLook(pSoldier) <= pSoldier.value.bActionPoints) {
        if (pSoldier.value.bDirection != ubRingDir) {
          pSoldier.value.usActionData = ubRingDir;
          return Enum289.AI_ACTION_CHANGE_FACING;
        }
      }
      return Enum289.AI_ACTION_NONE;
    }
  }

  if (TANK(pSoldier)) {
    return Enum289.AI_ACTION_NONE;
  }

  bInWater = Water(pSoldier.value.sGridNo);

  // check if standing in tear gas without a gas mask on, or in smoke
  bInGas = InGasOrSmoke(pSoldier, pSoldier.value.sGridNo);

  // if real-time, and not in the way, do nothing 90% of the time (for GUARDS!)
  // unless in water (could've started there), then we better swim to shore!

  if (fCivilian) {
    // special stuff for civs

    if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
      // everything's peaceful again, stop cowering!!
      pSoldier.value.usActionData = ANIM_STAND;
      return Enum289.AI_ACTION_STOP_COWERING;
    }

    if (!gfTurnBasedAI) {
      // ******************
      // REAL TIME NPC CODE
      // ******************
      if (pSoldier.value.fAIFlags & AI_CHECK_SCHEDULE) {
        pSoldier.value.bAction = DecideActionSchedule(pSoldier);
        if (pSoldier.value.bAction != Enum289.AI_ACTION_NONE) {
          return pSoldier.value.bAction;
        }
      }

      if (pSoldier.value.ubProfile != NO_PROFILE) {
        pSoldier.value.bAction = DecideActionNamedNPC(pSoldier);
        if (pSoldier.value.bAction != Enum289.AI_ACTION_NONE) {
          return pSoldier.value.bAction;
        }
        // can we act again? not for a minute since we were last spoken to/triggered a record
        if (pSoldier.value.uiTimeSinceLastSpoke && (GetJA2Clock() < pSoldier.value.uiTimeSinceLastSpoke + 60000)) {
          return Enum289.AI_ACTION_NONE;
        }
        // turn off counter so we don't check it again
        pSoldier.value.uiTimeSinceLastSpoke = 0;
      }
    }

    // if not in the way, do nothing most of the time
    // unless in water (could've started there), then we better swim to shore!

    if (!(bInWater) && PreRandom(5)) {
      // don't do nuttin!
      return Enum289.AI_ACTION_NONE;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // POINT PATROL: move towards next point unless getting a bit winded
  ////////////////////////////////////////////////////////////////////////////

  // this takes priority over water/gas checks, so that point patrol WILL work
  // from island to island, and through gas covered areas, too
  if ((pSoldier.value.bOrders == Enum241.POINTPATROL) && (pSoldier.value.bBreath >= 75)) {
    if (PointPatrolAI(pSoldier)) {
      if (!gfTurnBasedAI) {
        // wait after this...
        pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
        pSoldier.value.usNextActionData = RealtimeDelay(pSoldier);
      }
      return Enum289.AI_ACTION_POINT_PATROL;
    } else {
      // Reset path count to avoid dedlok
      gubNPCPathCount = 0;
    }
  }

  if ((pSoldier.value.bOrders == Enum241.RNDPTPATROL) && (pSoldier.value.bBreath >= 75)) {
    if (RandomPointPatrolAI(pSoldier)) {
      if (!gfTurnBasedAI) {
        // wait after this...
        pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
        pSoldier.value.usNextActionData = RealtimeDelay(pSoldier);
      }
      return Enum289.AI_ACTION_POINT_PATROL;
    } else {
      // Reset path count to avoid dedlok
      gubNPCPathCount = 0;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // WHEN LEFT IN WATER OR GAS, GO TO NEAREST REACHABLE SPOT OF UNGASSED LAND
  ////////////////////////////////////////////////////////////////////////////

  if (bInWater || bInGas) {
    pSoldier.value.usActionData = FindNearestUngassedLand(pSoldier);

    if (pSoldier.value.usActionData != NOWHERE) {
      return Enum289.AI_ACTION_LEAVE_WATER_GAS;
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // REST IF RUNNING OUT OF BREATH
  ////////////////////////////////////////////////////////////////////////

  // if our breath is running a bit low, and we're not in the way or in water
  if ((pSoldier.value.bBreath < 75) && !bInWater) {
    // take a breather for gods sake!
    // for realtime, AI will use a standard wait set outside of here
    pSoldier.value.usActionData = NOWHERE;
    return Enum289.AI_ACTION_NONE;
  }

  ////////////////////////////////////////////////////////////////////////////
  // RANDOM PATROL:  determine % chance to start a new patrol route
  ////////////////////////////////////////////////////////////////////////////

  if (!gubNPCPathCount) // try to limit pathing in Green AI
  {
    iChance = 25 + pSoldier.value.bBypassToGreen;

    // set base chance according to orders
    switch (pSoldier.value.bOrders) {
      case Enum241.STATIONARY:
        iChance += -20;
        break;
      case Enum241.ONGUARD:
        iChance += -15;
        break;
      case Enum241.ONCALL:
        break;
      case Enum241.CLOSEPATROL:
        iChance += +15;
        break;
      case Enum241.RNDPTPATROL:
      case Enum241.POINTPATROL:
        iChance = 0;
        break;
      /*
      if ( !gfTurnBasedAI )
                                                                                             {
                                                                                                     // realtime deadlock... increase chance!
                                                                                                     iChance = 110;// more than 100 in case person is defensive
                                                                                             }
                                                                                             else if ( pSoldier->bInitialActionPoints < pSoldier->bActionPoints ) // could be less because of carried-over points
                                                                                             {
                                                                                                     // CJC: allow pt patrol guys to do a random move in case
                                                                                                     // of a deadlock provided they haven't done anything yet this turn
                                                                                                     iChance=   0;
                                                                                             }
                                                                                             break;
                                                                                             */
      case Enum241.FARPATROL:
        iChance += +25;
        break;
      case Enum241.SEEKENEMY:
        iChance += -10;
        break;
    }

    // modify chance of patrol (and whether it's a sneaky one) by attitude
    switch (pSoldier.value.bAttitude) {
      case Enum242.DEFENSIVE:
        iChance += -10;
        break;
      case Enum242.BRAVESOLO:
        iChance += 5;
        break;
      case Enum242.BRAVEAID:
        break;
      case Enum242.CUNNINGSOLO:
        iChance += 5;
        iSneaky += 10;
        break;
      case Enum242.CUNNINGAID:
        iSneaky += 5;
        break;
      case Enum242.AGGRESSIVE:
        iChance += 10;
        iSneaky += -5;
        break;
      case Enum242.ATTACKSLAYONLY:
        iChance += 10;
        iSneaky += -5;
        break;
    }

    // reduce chance for any injury, less likely to wander around when hurt
    iChance -= (pSoldier.value.bLifeMax - pSoldier.value.bLife);

    // reduce chance if breath is down, less likely to wander around when tired
    iChance -= (100 - pSoldier.value.bBreath);

    // if we're in water with land miles (> 25 tiles) away,
    // OR if we roll under the chance calculated
    if (bInWater || (PreRandom(100) < iChance)) {
      pSoldier.value.usActionData = RandDestWithinRange(pSoldier);

      if (pSoldier.value.usActionData != NOWHERE) {
        pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, pSoldier.value.usActionData, Enum289.AI_ACTION_RANDOM_PATROL);
      }

      if (pSoldier.value.usActionData != NOWHERE) {
        if (!gfTurnBasedAI) {
          // wait after this...
          pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
          pSoldier.value.usNextActionData = RealtimeDelay(pSoldier);
        }
        return Enum289.AI_ACTION_RANDOM_PATROL;
      }
    }
  }

  if (!gubNPCPathCount) // try to limit pathing in Green AI
  {
    ////////////////////////////////////////////////////////////////////////////
    // SEEK FRIEND: determine %chance for man to pay a friendly visit
    ////////////////////////////////////////////////////////////////////////////

    iChance = 25 + pSoldier.value.bBypassToGreen;

    // set base chance and maximum seeking distance according to orders
    switch (pSoldier.value.bOrders) {
      case Enum241.STATIONARY:
        iChance += -20;
        break;
      case Enum241.ONGUARD:
        iChance += -15;
        break;
      case Enum241.ONCALL:
        break;
      case Enum241.CLOSEPATROL:
        iChance += +10;
        break;
      case Enum241.RNDPTPATROL:
      case Enum241.POINTPATROL:
        iChance = -10;
        break;
      case Enum241.FARPATROL:
        iChance += +20;
        break;
      case Enum241.SEEKENEMY:
        iChance += -10;
        break;
    }

    // modify for attitude
    switch (pSoldier.value.bAttitude) {
      case Enum242.DEFENSIVE:
        break;
      case Enum242.BRAVESOLO:
        iChance /= 2;
        break; // loners
      case Enum242.BRAVEAID:
        iChance += 10;
        break; // friendly
      case Enum242.CUNNINGSOLO:
        iChance /= 2;
        break; // loners
      case Enum242.CUNNINGAID:
        iChance += 10;
        break; // friendly
      case Enum242.AGGRESSIVE:
        break;
      case Enum242.ATTACKSLAYONLY:
        break;
    }

    // reduce chance for any injury, less likely to wander around when hurt
    iChance -= (pSoldier.value.bLifeMax - pSoldier.value.bLife);

    // reduce chance if breath is down
    iChance -= (100 - pSoldier.value.bBreath); // very likely to wait when exhausted

    if (PreRandom(100) < iChance) {
      if (RandomFriendWithin(pSoldier)) {
        if (pSoldier.value.usActionData == GoAsFarAsPossibleTowards(pSoldier, pSoldier.value.usActionData, Enum289.AI_ACTION_SEEK_FRIEND)) {
          if (fCivilianOrMilitia && !gfTurnBasedAI) {
            // pause at the end of the walk!
            pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
            pSoldier.value.usNextActionData = REALTIME_CIV_AI_DELAY();
          }

          return Enum289.AI_ACTION_SEEK_FRIEND;
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // LOOK AROUND: determine %chance for man to turn in place
  ////////////////////////////////////////////////////////////////////////////

  if (!gfTurnBasedAI || GetAPsToLook(pSoldier) <= pSoldier.value.bActionPoints) {
    // avoid 2 consecutive random turns in a row
    if (pSoldier.value.bLastAction != Enum289.AI_ACTION_CHANGE_FACING) {
      iChance = 25 + pSoldier.value.bBypassToGreen;

      // set base chance according to orders
      if (pSoldier.value.bOrders == Enum241.STATIONARY)
        iChance += 25;

      if (pSoldier.value.bOrders == Enum241.ONGUARD)
        iChance += 20;

      if (pSoldier.value.bAttitude == Enum242.DEFENSIVE)
        iChance += 25;

      if (PreRandom(100) < iChance) {
        // roll random directions (stored in actionData) until different from current
        do {
          // if man has a LEGAL dominant facing, and isn't facing it, he will turn
          // back towards that facing 50% of the time here (normally just enemies)
          if ((pSoldier.value.bDominantDir >= 0) && (pSoldier.value.bDominantDir <= 8) && (pSoldier.value.bDirection != pSoldier.value.bDominantDir) && PreRandom(2)) {
            pSoldier.value.usActionData = pSoldier.value.bDominantDir;
          } else {
            pSoldier.value.usActionData = PreRandom(8);
          }
        } while (pSoldier.value.usActionData == pSoldier.value.bDirection);

        if (InternalIsValidStance(pSoldier, pSoldier.value.usActionData, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
          if (!gfTurnBasedAI) {
            // wait after this...
            pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
            pSoldier.value.usNextActionData = RealtimeDelay(pSoldier);
          }

          return Enum289.AI_ACTION_CHANGE_FACING;
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // NONE:
  ////////////////////////////////////////////////////////////////////////////

  // by default, if everything else fails, just stands in place without turning
  // for realtime, regular AI guys will use a standard wait set outside of here
  pSoldier.value.usActionData = NOWHERE;
  return Enum289.AI_ACTION_NONE;
}

function DecideActionYellow(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iDummy: INT32;
  let ubNoiseDir: UINT8;
  let sNoiseGridNo: INT16;
  let iNoiseValue: INT32;
  let iChance: INT32;
  let iSneaky: INT32;
  let sClosestFriend: INT16;
  let fCivilian: boolean = (PTR_CIVILIAN() && (pSoldier.value.ubCivilianGroup == Enum246.NON_CIV_GROUP || pSoldier.value.bNeutral || (pSoldier.value.ubBodyType >= Enum194.FATCIV && pSoldier.value.ubBodyType <= Enum194.CRIPPLECIV)));
  let fClimb: boolean;
  let fReachable: boolean;

  if (fCivilian) {
    if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
      // everything's peaceful again, stop cowering!!
      pSoldier.value.usActionData = ANIM_STAND;
      return Enum289.AI_ACTION_STOP_COWERING;
    }
    if (!gfTurnBasedAI) {
      // ******************
      // REAL TIME NPC CODE
      // ******************
      if (pSoldier.value.ubProfile != NO_PROFILE) {
        pSoldier.value.bAction = DecideActionNamedNPC(pSoldier);
        if (pSoldier.value.bAction != Enum289.AI_ACTION_NONE) {
          return pSoldier.value.bAction;
        }
      }
    }
  }

  // determine the most important noise heard, and its relative value
  sNoiseGridNo = MostImportantNoiseHeard(pSoldier, addressof(iNoiseValue), addressof(fClimb), addressof(fReachable));
  // NumMessage("iNoiseValue = ",iNoiseValue);

  if (sNoiseGridNo == NOWHERE) {
    // then we have no business being under YELLOW status any more!

    return Enum289.AI_ACTION_NONE;
  }

  ////////////////////////////////////////////////////////////////////////////
  // LOOK AROUND TOWARD NOISE: determine %chance for man to turn towards noise
  ////////////////////////////////////////////////////////////////////////////

  // determine direction from this soldier in which the noise lies
  ubNoiseDir = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(sNoiseGridNo), CenterY(sNoiseGridNo));

  // if soldier is not already facing in that direction,
  // and the noise source is close enough that it could possibly be seen
  if (!gfTurnBasedAI || GetAPsToLook(pSoldier) <= pSoldier.value.bActionPoints) {
    if ((pSoldier.value.bDirection != ubNoiseDir) && PythSpacesAway(pSoldier.value.sGridNo, sNoiseGridNo) <= MaxDistanceVisible()) {
      // set base chance according to orders
      if ((pSoldier.value.bOrders == Enum241.STATIONARY) || (pSoldier.value.bOrders == Enum241.ONGUARD))
        iChance = 60;
      else // all other orders
        iChance = 35;

      if (pSoldier.value.bAttitude == Enum242.DEFENSIVE)
        iChance += 15;

      if (PreRandom(100) < iChance && InternalIsValidStance(pSoldier, ubNoiseDir, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
        pSoldier.value.usActionData = ubNoiseDir;

        return Enum289.AI_ACTION_CHANGE_FACING;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // RADIO YELLOW ALERT: determine %chance to call others and report noise
  ////////////////////////////////////////////////////////////////////////////

  // if we have the action points remaining to RADIO
  // (we never want NPCs to choose to radio if they would have to wait a turn)
  if (!fCivilian && (pSoldier.value.bActionPoints >= AP_RADIO) && (gTacticalStatus.Team[pSoldier.value.bTeam].bMenInSector > 1)) {
    // base chance depends on how much new info we have to radio to the others
    iChance = 5 * WhatIKnowThatPublicDont(pSoldier, false); // use 5 * for YELLOW alert

    // if I actually know something they don't and I ain't swimming (deep water)
    if (iChance && !DeepWater(pSoldier.value.sGridNo)) {
      // CJC: this addition allows for varying difficulty levels for soldier types
      iChance += gbDiff[DIFF_RADIO_RED_ALERT][SoldierDifficultyLevel(pSoldier)] / 2;

      // Alex: this addition replaces the sectorValue/2 in original JA
      // iChance += gsDiff[DIFF_RADIO_RED_ALERT][GameOption[ENEMYDIFFICULTY]] / 2;

      // modify base chance according to orders
      switch (pSoldier.value.bOrders) {
        case Enum241.STATIONARY:
          iChance += 20;
          break;
        case Enum241.ONGUARD:
          iChance += 15;
          break;
        case Enum241.ONCALL:
          iChance += 10;
          break;
        case Enum241.CLOSEPATROL:
          break;
        case Enum241.RNDPTPATROL:
        case Enum241.POINTPATROL:
          break;
        case Enum241.FARPATROL:
          iChance += -10;
          break;
        case Enum241.SEEKENEMY:
          iChance += -20;
          break;
      }

      // modify base chance according to attitude
      switch (pSoldier.value.bAttitude) {
        case Enum242.DEFENSIVE:
          iChance += 20;
          break;
        case Enum242.BRAVESOLO:
          iChance += -10;
          break;
        case Enum242.BRAVEAID:
          break;
        case Enum242.CUNNINGSOLO:
          iChance += -5;
          break;
        case Enum242.CUNNINGAID:
          break;
        case Enum242.AGGRESSIVE:
          iChance += -20;
          break;
        case Enum242.ATTACKSLAYONLY:
          iChance = 0;
          break;
      }

      if (PreRandom(100) < iChance) {
        return Enum289.AI_ACTION_YELLOW_ALERT;
      }
    }
  }

  if (TANK(pSoldier)) {
    return Enum289.AI_ACTION_NONE;
  }

  ////////////////////////////////////////////////////////////////////////
  // REST IF RUNNING OUT OF BREATH
  ////////////////////////////////////////////////////////////////////////

  // if our breath is running a bit low, and we're not in water
  if ((pSoldier.value.bBreath < 25) && !MercInWater(pSoldier)) {
    // take a breather for gods sake!
    pSoldier.value.usActionData = NOWHERE;
    return Enum289.AI_ACTION_NONE;
  }

  if (!(pSoldier.value.bTeam == CIV_TEAM && pSoldier.value.ubProfile != NO_PROFILE && pSoldier.value.ubProfile != Enum268.ELDIN)) {
    // IF WE ARE MILITIA/CIV IN REALTIME, CLOSE TO NOISE, AND CAN SEE THE SPOT WHERE THE NOISE CAME FROM, FORGET IT
    if (fReachable && !fClimb && !gfTurnBasedAI && (pSoldier.value.bTeam == MILITIA_TEAM || pSoldier.value.bTeam == CIV_TEAM) && PythSpacesAway(pSoldier.value.sGridNo, sNoiseGridNo) < 5) {
      if (SoldierTo3DLocationLineOfSightTest(pSoldier, sNoiseGridNo, pSoldier.value.bLevel, 0, 6, true)) {
        // set reachable to false so we don't investigate
        fReachable = false;
        // forget about noise
        pSoldier.value.sNoiseGridno = NOWHERE;
        pSoldier.value.ubNoiseVolume = 0;
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // SEEK NOISE
    ////////////////////////////////////////////////////////////////////////////

    if (fReachable) {
      // remember that noise value is negative, and closer to 0 => more important!
      iChance = 95 + (iNoiseValue / 3);
      iSneaky = 30;

      // increase

      // set base chance according to orders
      switch (pSoldier.value.bOrders) {
        case Enum241.STATIONARY:
          iChance += -20;
          break;
        case Enum241.ONGUARD:
          iChance += -15;
          break;
        case Enum241.ONCALL:
          break;
        case Enum241.CLOSEPATROL:
          iChance += -10;
          break;
        case Enum241.RNDPTPATROL:
        case Enum241.POINTPATROL:
          break;
        case Enum241.FARPATROL:
          iChance += 10;
          break;
        case Enum241.SEEKENEMY:
          iChance += 25;
          break;
      }

      // modify chance of patrol (and whether it's a sneaky one) by attitude
      switch (pSoldier.value.bAttitude) {
        case Enum242.DEFENSIVE:
          iChance += -10;
          iSneaky += 15;
          break;
        case Enum242.BRAVESOLO:
          iChance += 10;
          break;
        case Enum242.BRAVEAID:
          iChance += 5;
          break;
        case Enum242.CUNNINGSOLO:
          iChance += 5;
          iSneaky += 30;
          break;
        case Enum242.CUNNINGAID:
          iSneaky += 30;
          break;
        case Enum242.AGGRESSIVE:
          iChance += 20;
          iSneaky += -10;
          break;
        case Enum242.ATTACKSLAYONLY:
          iChance += 20;
          iSneaky += -10;
          break;
      }

      // reduce chance if breath is down, less likely to wander around when tired
      iChance -= (100 - pSoldier.value.bBreath);

      if (PreRandom(100) < iChance) {
        pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sNoiseGridNo, Enum289.AI_ACTION_SEEK_NOISE);

        if (pSoldier.value.usActionData != NOWHERE) {
          if (fClimb && pSoldier.value.usActionData == sNoiseGridNo) {
            // need to climb AND have enough APs to get there this turn
            return Enum289.AI_ACTION_MOVE_TO_CLIMB;
          }

          return Enum289.AI_ACTION_SEEK_NOISE;
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // SEEK FRIEND WHO LAST RADIOED IN TO REPORT NOISE
    ////////////////////////////////////////////////////////////////////////////

    sClosestFriend = ClosestReachableFriendInTrouble(pSoldier, addressof(fClimb));

    // if there is a friend alive & reachable who last radioed in
    if (sClosestFriend != NOWHERE) {
      // there a chance enemy soldier choose to go "help" his friend
      iChance = 50 - SpacesAway(pSoldier.value.sGridNo, sClosestFriend);
      iSneaky = 10;

      // set base chance according to orders
      switch (pSoldier.value.bOrders) {
        case Enum241.STATIONARY:
          iChance += -20;
          break;
        case Enum241.ONGUARD:
          iChance += -15;
          break;
        case Enum241.ONCALL:
          iChance += 20;
          break;
        case Enum241.CLOSEPATROL:
          iChance += -10;
          break;
        case Enum241.RNDPTPATROL:
        case Enum241.POINTPATROL:
          iChance += -10;
          break;
        case Enum241.FARPATROL:
          break;
        case Enum241.SEEKENEMY:
          iChance += 10;
          break;
      }

      // modify chance of patrol (and whether it's a sneaky one) by attitude
      switch (pSoldier.value.bAttitude) {
        case Enum242.DEFENSIVE:
          iChance += -10;
          iSneaky += 15;
          break;
        case Enum242.BRAVESOLO:
          break;
        case Enum242.BRAVEAID:
          iChance += 20;
          iSneaky += -10;
          break;
        case Enum242.CUNNINGSOLO:
          iSneaky += 30;
          break;
        case Enum242.CUNNINGAID:
          iChance += 20;
          iSneaky += 20;
          break;
        case Enum242.AGGRESSIVE:
          iChance += -20;
          iSneaky += -20;
          break;
        case Enum242.ATTACKSLAYONLY:
          iChance += -20;
          iSneaky += -20;
          break;
      }

      // reduce chance if breath is down, less likely to wander around when tired
      iChance -= (100 - pSoldier.value.bBreath);

      if (PreRandom(100) < iChance) {
        pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sClosestFriend, Enum289.AI_ACTION_SEEK_FRIEND);

        if (pSoldier.value.usActionData != NOWHERE) {
          if (fClimb && pSoldier.value.usActionData == sClosestFriend) {
            // need to climb AND have enough APs to get there this turn
            return Enum289.AI_ACTION_MOVE_TO_CLIMB;
          }

          return Enum289.AI_ACTION_SEEK_FRIEND;
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // TAKE BEST NEARBY COVER FROM THE NOISE GENERATING GRIDNO
    ////////////////////////////////////////////////////////////////////////////

    if (!SkipCoverCheck && gfTurnBasedAI) // only do in turnbased
    {
      // remember that noise value is negative, and closer to 0 => more important!
      iChance = 25;
      iSneaky = 30;

      // set base chance according to orders
      switch (pSoldier.value.bOrders) {
        case Enum241.STATIONARY:
          iChance += 20;
          break;
        case Enum241.ONGUARD:
          iChance += 15;
          break;
        case Enum241.ONCALL:
          break;
        case Enum241.CLOSEPATROL:
          iChance += 10;
          break;
        case Enum241.RNDPTPATROL:
        case Enum241.POINTPATROL:
          break;
        case Enum241.FARPATROL:
          iChance += -5;
          break;
        case Enum241.SEEKENEMY:
          iChance += -20;
          break;
      }

      // modify chance (and whether it's sneaky) by attitude
      switch (pSoldier.value.bAttitude) {
        case Enum242.DEFENSIVE:
          iChance += 10;
          iSneaky += 15;
          break;
        case Enum242.BRAVESOLO:
          iChance += -15;
          iSneaky += -20;
          break;
        case Enum242.BRAVEAID:
          iChance += -20;
          iSneaky += -20;
          break;
        case Enum242.CUNNINGSOLO:
          iChance += 20;
          iSneaky += 30;
          break;
        case Enum242.CUNNINGAID:
          iChance += 15;
          iSneaky += 30;
          break;
        case Enum242.AGGRESSIVE:
          iChance += -10;
          iSneaky += -10;
          break;
        case Enum242.ATTACKSLAYONLY:
          iChance += -10;
          iSneaky += -10;
          break;
      }

      // reduce chance if breath is down, less likely to wander around when tired
      iChance -= (100 - pSoldier.value.bBreath);

      if (PreRandom(100) < iChance) {
        pSoldier.value.bAIMorale = CalcMorale(pSoldier);
        pSoldier.value.usActionData = FindBestNearbyCover(pSoldier, pSoldier.value.bAIMorale, addressof(iDummy));

        if (pSoldier.value.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_TAKE_COVER;
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // SWITCH TO GREEN: determine if soldier acts as if nothing at all was wrong
  ////////////////////////////////////////////////////////////////////////////
  if (PreRandom(100) < 50) {
    // Skip YELLOW until new situation, 15% extra chance to do GREEN actions
    pSoldier.value.bBypassToGreen = 15;
    return DecideActionGreen(pSoldier);
  }

  ////////////////////////////////////////////////////////////////////////////
  // CROUCH IF NOT CROUCHING ALREADY
  ////////////////////////////////////////////////////////////////////////////

  // if not in water and not already crouched, try to crouch down first
  if (!fCivilian && !PTR_CROUCHED() && IsValidStance(pSoldier, ANIM_CROUCH)) {
    if (!gfTurnBasedAI || GetAPsToChangeStance(pSoldier, ANIM_CROUCH) <= pSoldier.value.bActionPoints) {
      pSoldier.value.usActionData = ANIM_CROUCH;
      return Enum289.AI_ACTION_CHANGE_STANCE;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // DO NOTHING: Not enough points left to move, so save them for next turn
  ////////////////////////////////////////////////////////////////////////////

  // by default, if everything else fails, just stands in place without turning
  pSoldier.value.usActionData = NOWHERE;
  return Enum289.AI_ACTION_NONE;
}

export function DecideActionRed(pSoldier: Pointer<SOLDIERTYPE>, ubUnconsciousOK: UINT8): INT8 {
  let bActionReturned: INT8;
  let iDummy: INT32;
  let iChance: INT16;
  let sClosestOpponent: INT16;
  let sClosestFriend: INT16;
  let sClosestDisturbance: INT16;
  let sDistVisible: INT16;
  let sCheckGridNo: INT16;
  let ubCanMove: UINT8;
  let ubOpponentDir: UINT8;
  let bInWater: INT8;
  let bInDeepWater: INT8;
  let bInGas: INT8;
  let bSeekPts: INT8 = 0;
  let bHelpPts: INT8 = 0;
  let bHidePts: INT8 = 0;
  let bWatchPts: INT8 = 0;
  let bHighestWatchLoc: INT8;
  let BestThrow: ATTACKTYPE;
  let fClimb: boolean;
  let fCivilian: boolean = (PTR_CIVILIAN() && (pSoldier.value.ubCivilianGroup == Enum246.NON_CIV_GROUP || (pSoldier.value.bNeutral && gTacticalStatus.fCivGroupHostile[pSoldier.value.ubCivilianGroup] == CIV_GROUP_NEUTRAL) || (pSoldier.value.ubBodyType >= Enum194.FATCIV && pSoldier.value.ubBodyType <= Enum194.CRIPPLECIV)));

  // if we have absolutely no action points, we can't do a thing under RED!
  if (!pSoldier.value.bActionPoints) {
    pSoldier.value.usActionData = NOWHERE;
    return Enum289.AI_ACTION_NONE;
  }

  // can this guy move to any of the neighbouring squares ? (sets TRUE/FALSE)
  ubCanMove = (pSoldier.value.bActionPoints >= MinPtsToMove(pSoldier));

  // if we're an alerted enemy, and there are panic bombs or a trigger around
  if ((!PTR_CIVILIAN() || pSoldier.value.ubProfile == Enum268.WARDEN) && ((gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition || (pSoldier.value.ubID == gTacticalStatus.ubTheChosenOne) || (pSoldier.value.ubProfile == Enum268.WARDEN)) && (gTacticalStatus.fPanicFlags & (PANIC_BOMBS_HERE | PANIC_TRIGGERS_HERE)))) {
    if (pSoldier.value.ubProfile == Enum268.WARDEN && gTacticalStatus.ubTheChosenOne == NOBODY) {
      PossiblyMakeThisEnemyChosenOne(pSoldier);
    }

    // do some special panic AI decision making
    bActionReturned = PanicAI(pSoldier, ubCanMove);

    // if we decided on an action while in there, we're done
    if (bActionReturned != -1)
      return bActionReturned;
  }

  if (pSoldier.value.ubProfile != NO_PROFILE) {
    if ((pSoldier.value.ubProfile == Enum268.QUEEN || pSoldier.value.ubProfile == Enum268.JOE) && ubCanMove) {
      if (gWorldSectorX == 3 && gWorldSectorY == MAP_ROW_P && gbWorldSectorZ == 0 && !gfUseAlternateQueenPosition) {
        bActionReturned = HeadForTheStairCase(pSoldier);
        if (bActionReturned != Enum289.AI_ACTION_NONE) {
          return bActionReturned;
        }
      }
    }
  }

  // determine if we happen to be in water (in which case we're in BIG trouble!)
  bInWater = Water(pSoldier.value.sGridNo);
  bInDeepWater = Water(pSoldier.value.sGridNo);

  // check if standing in tear gas without a gas mask on
  bInGas = InGasOrSmoke(pSoldier, pSoldier.value.sGridNo);

  ////////////////////////////////////////////////////////////////////////////
  // WHEN LEFT IN GAS, WEAR GAS MASK IF AVAILABLE AND NOT WORN
  ////////////////////////////////////////////////////////////////////////////

  if (!bInGas && (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y)) {
    // only chance if we happen to be caught with our gas mask off
    if (PreRandom(10) == 0 && WearGasMaskIfAvailable(pSoldier)) {
      // reevaluate
      bInGas = InGasOrSmoke(pSoldier, pSoldier.value.sGridNo);
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // WHEN IN GAS, GO TO NEAREST REACHABLE SPOT OF UNGASSED LAND
  ////////////////////////////////////////////////////////////////////////////

  if (bInGas && ubCanMove) {
    pSoldier.value.usActionData = FindNearestUngassedLand(pSoldier);

    if (pSoldier.value.usActionData != NOWHERE) {
      return Enum289.AI_ACTION_LEAVE_WATER_GAS;
    }
  }

  if (fCivilian && !(pSoldier.value.ubBodyType == Enum194.COW || pSoldier.value.ubBodyType == Enum194.CRIPPLECIV)) {
    if (FindAIUsableObjClass(pSoldier, IC_WEAPON) == ITEM_NOT_FOUND) {
      // cower in fear!!
      if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
        if (gfTurnBasedAI || gTacticalStatus.fEnemyInSector) // battle!
        {
          // in battle!
          if (pSoldier.value.bLastAction == Enum289.AI_ACTION_COWER) {
            // do nothing
            pSoldier.value.usActionData = NOWHERE;
            return Enum289.AI_ACTION_NONE;
          } else {
            // set up next action to run away
            pSoldier.value.usNextActionData = FindSpotMaxDistFromOpponents(pSoldier);
            if (pSoldier.value.usNextActionData != NOWHERE) {
              pSoldier.value.bNextAction = Enum289.AI_ACTION_RUN_AWAY;
              pSoldier.value.usActionData = ANIM_STAND;
              return Enum289.AI_ACTION_STOP_COWERING;
            } else {
              return Enum289.AI_ACTION_NONE;
            }
          }
        } else {
          if (pSoldier.value.bNewSituation == NOT_NEW_SITUATION) {
            // stop cowering, not in battle, timer expired
            // we have to turn off whatever is necessary to stop status red...
            pSoldier.value.bAlertStatus = Enum243.STATUS_GREEN;
            return Enum289.AI_ACTION_STOP_COWERING;
          } else {
            return Enum289.AI_ACTION_NONE;
          }
        }
      } else {
        if (gfTurnBasedAI || gTacticalStatus.fEnemyInSector) {
          // battle - cower!!!
          pSoldier.value.usActionData = ANIM_CROUCH;
          return Enum289.AI_ACTION_COWER;
        } else // not in battle, cower for a certain length of time
        {
          pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
          pSoldier.value.usNextActionData = REALTIME_CIV_AI_DELAY();
          pSoldier.value.usActionData = ANIM_CROUCH;
          return Enum289.AI_ACTION_COWER;
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // WHEN IN THE LIGHT, GET OUT OF THERE!
  ////////////////////////////////////////////////////////////////////////////
  if (ubCanMove && InLightAtNight(pSoldier.value.sGridNo, pSoldier.value.bLevel) && pSoldier.value.bOrders != Enum241.STATIONARY) {
    pSoldier.value.usActionData = FindNearbyDarkerSpot(pSoldier);
    if (pSoldier.value.usActionData != NOWHERE) {
      // move as if leaving water or gas
      return Enum289.AI_ACTION_LEAVE_WATER_GAS;
    }
  }

  if (fCivilian && !(pSoldier.value.ubBodyType == Enum194.COW || pSoldier.value.ubBodyType == Enum194.CRIPPLECIV)) {
    if (FindAIUsableObjClass(pSoldier, IC_WEAPON) == ITEM_NOT_FOUND) {
      // cower in fear!!
      if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
        if (gfTurnBasedAI || gTacticalStatus.fEnemyInSector) // battle!
        {
          // in battle!
          if (pSoldier.value.bLastAction == Enum289.AI_ACTION_COWER) {
            // do nothing
            pSoldier.value.usActionData = NOWHERE;
            return Enum289.AI_ACTION_NONE;
          } else {
            // set up next action to run away
            pSoldier.value.usNextActionData = FindSpotMaxDistFromOpponents(pSoldier);
            if (pSoldier.value.usNextActionData != NOWHERE) {
              pSoldier.value.bNextAction = Enum289.AI_ACTION_RUN_AWAY;
              pSoldier.value.usActionData = ANIM_STAND;
              return Enum289.AI_ACTION_STOP_COWERING;
            } else {
              return Enum289.AI_ACTION_NONE;
            }
          }
        } else {
          if (pSoldier.value.bNewSituation == NOT_NEW_SITUATION) {
            // stop cowering, not in battle, timer expired
            // we have to turn off whatever is necessary to stop status red...
            pSoldier.value.bAlertStatus = Enum243.STATUS_GREEN;
            return Enum289.AI_ACTION_STOP_COWERING;
          } else {
            return Enum289.AI_ACTION_NONE;
          }
        }
      } else {
        if (gfTurnBasedAI || gTacticalStatus.fEnemyInSector) {
          // battle - cower!!!
          pSoldier.value.usActionData = ANIM_CROUCH;
          return Enum289.AI_ACTION_COWER;
        } else // not in battle, cower for a certain length of time
        {
          pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
          pSoldier.value.usNextActionData = REALTIME_CIV_AI_DELAY();
          pSoldier.value.usActionData = ANIM_CROUCH;
          return Enum289.AI_ACTION_COWER;
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // IF POSSIBLE, FIRE LONG RANGE WEAPONS AT TARGETS REPORTED BY RADIO
  ////////////////////////////////////////////////////////////////////////

  // can't do this in realtime, because the player could be shooting a gun or whatever at the same time!
  if (gfTurnBasedAI && !fCivilian && !bInWater && !bInGas && !(pSoldier.value.uiStatusFlags & SOLDIER_BOXER) && (CanNPCAttack(pSoldier) == true)) {
    BestThrow.ubPossible = false; // by default, assume Throwing isn't possible

    CheckIfTossPossible(pSoldier, addressof(BestThrow));

    if (BestThrow.ubPossible) {
      // if firing mortar make sure we have room
      if (pSoldier.value.inv[BestThrow.bWeaponIn].usItem == Enum225.MORTAR) {
        ubOpponentDir = GetDirectionFromGridNo(BestThrow.sTarget, pSoldier);

        // Get new gridno!
        sCheckGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(ubOpponentDir));

        if (!OKFallDirection(pSoldier, sCheckGridNo, pSoldier.value.bLevel, ubOpponentDir, pSoldier.value.usAnimState)) {
          // can't fire!
          BestThrow.ubPossible = false;

          // try behind us, see if there's room to move back
          sCheckGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(gOppositeDirection[ubOpponentDir]));
          if (OKFallDirection(pSoldier, sCheckGridNo, pSoldier.value.bLevel, gOppositeDirection[ubOpponentDir], pSoldier.value.usAnimState)) {
            pSoldier.value.usActionData = sCheckGridNo;

            return Enum289.AI_ACTION_GET_CLOSER;
          }
        }
      }

      // then do it!  The functions have already made sure that we have a
      // pair of worthy opponents, etc., so we're not just wasting our time

      // if necessary, swap the usItem from holster into the hand position
      if (BestThrow.bWeaponIn != Enum261.HANDPOS)
        RearrangePocket(pSoldier, Enum261.HANDPOS, BestThrow.bWeaponIn, FOREVER);

      pSoldier.value.usActionData = BestThrow.sTarget;
      pSoldier.value.bAimTime = BestThrow.ubAimTime;

      return Enum289.AI_ACTION_TOSS_PROJECTILE;
    } else // toss/throw/launch not possible
    {
      // if this dude has a longe-range weapon on him (longer than normal
      // sight range), and there's at least one other team-mate around, and
      // spotters haven't already been called for, then DO SO!

      if ((CalcMaxTossRange(pSoldier, pSoldier.value.inv[BestThrow.bWeaponIn].usItem, true) > MaxDistanceVisible()) && (gTacticalStatus.Team[pSoldier.value.bTeam].bMenInSector > 1) && (gTacticalStatus.ubSpottersCalledForBy == NOBODY)) {
        // then call for spotters!  Uses up the rest of his turn (whatever
        // that may be), but from now on, BLACK AI NPC may radio sightings!
        gTacticalStatus.ubSpottersCalledForBy = pSoldier.value.ubID;
        pSoldier.value.bActionPoints = 0;

        pSoldier.value.usActionData = NOWHERE;
        return Enum289.AI_ACTION_NONE;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // CROUCH & REST IF RUNNING OUT OF BREATH
  ////////////////////////////////////////////////////////////////////////

  // if our breath is running a bit low, and we're not in water or under fire
  if ((pSoldier.value.bBreath < 25) && !bInWater && !pSoldier.value.bUnderFire) {
    // if not already crouched, try to crouch down first
    if (!fCivilian && !PTR_CROUCHED() && IsValidStance(pSoldier, ANIM_CROUCH)) {
      if (!gfTurnBasedAI || GetAPsToChangeStance(pSoldier, ANIM_CROUCH) <= pSoldier.value.bActionPoints) {
        pSoldier.value.usActionData = ANIM_CROUCH;

        return Enum289.AI_ACTION_CHANGE_STANCE;
      }
    }

    pSoldier.value.usActionData = NOWHERE;
    return Enum289.AI_ACTION_NONE;
  }

  // calculate our morale
  pSoldier.value.bAIMorale = CalcMorale(pSoldier);

  // if a guy is feeling REALLY discouraged, he may continue to run like hell
  if ((pSoldier.value.bAIMorale == Enum244.MORALE_HOPELESS) && ubCanMove) {
    ////////////////////////////////////////////////////////////////////////
    // RUN AWAY TO SPOT FARTHEST FROM KNOWN THREATS (ONLY IF MORALE HOPELESS)
    ////////////////////////////////////////////////////////////////////////

    // look for best place to RUN AWAY to (farthest from the closest threat)
    pSoldier.value.usActionData = FindSpotMaxDistFromOpponents(pSoldier);

    if (pSoldier.value.usActionData != NOWHERE) {
      return Enum289.AI_ACTION_RUN_AWAY;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // RADIO RED ALERT: determine %chance to call others and report contact
  ////////////////////////////////////////////////////////////////////////////

  // if we're a computer merc, and we have the action points remaining to RADIO
  // (we never want NPCs to choose to radio if they would have to wait a turn)
  if (!fCivilian && (pSoldier.value.bActionPoints >= AP_RADIO) && (gTacticalStatus.Team[pSoldier.value.bTeam].bMenInSector > 1)) {
    // if there hasn't been an initial RED ALERT yet in this sector
    if (!(gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition) || NeedToRadioAboutPanicTrigger())
      // since I'm at STATUS RED, I obviously know we're being invaded!
      iChance = gbDiff[DIFF_RADIO_RED_ALERT][SoldierDifficultyLevel(pSoldier)];
    else // subsequent radioing (only to update enemy positions, request help)
      // base chance depends on how much new info we have to radio to the others
      iChance = 10 * WhatIKnowThatPublicDont(pSoldier, false); // use 10 * for RED alert

    // if I actually know something they don't and I ain't swimming (deep water)
    if (iChance && !bInDeepWater) {
      // modify base chance according to orders
      switch (pSoldier.value.bOrders) {
        case Enum241.STATIONARY:
          iChance += 20;
          break;
        case Enum241.ONGUARD:
          iChance += 15;
          break;
        case Enum241.ONCALL:
          iChance += 10;
          break;
        case Enum241.CLOSEPATROL:
          break;
        case Enum241.RNDPTPATROL:
        case Enum241.POINTPATROL:
          iChance += -5;
          break;
        case Enum241.FARPATROL:
          iChance += -10;
          break;
        case Enum241.SEEKENEMY:
          iChance += -20;
          break;
      }

      // modify base chance according to attitude
      switch (pSoldier.value.bAttitude) {
        case Enum242.DEFENSIVE:
          iChance += 20;
          break;
        case Enum242.BRAVESOLO:
          iChance += -10;
          break;
        case Enum242.BRAVEAID:
          break;
        case Enum242.CUNNINGSOLO:
          iChance += -5;
          break;
        case Enum242.CUNNINGAID:
          break;
        case Enum242.AGGRESSIVE:
          iChance += -20;
          break;
        case Enum242.ATTACKSLAYONLY:
          iChance = 0;
      }

      if ((gTacticalStatus.fPanicFlags & PANIC_TRIGGERS_HERE) && !gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition) {
        // ignore morale (which could be really high
      } else {
        // modify base chance according to morale
        switch (pSoldier.value.bAIMorale) {
          case Enum244.MORALE_HOPELESS:
            iChance *= 3;
            break;
          case Enum244.MORALE_WORRIED:
            iChance *= 2;
            break;
          case Enum244.MORALE_NORMAL:
            break;
          case Enum244.MORALE_CONFIDENT:
            iChance /= 2;
            break;
          case Enum244.MORALE_FEARLESS:
            iChance /= 3;
            break;
        }
      }

      if (PreRandom(100) < iChance) {
        return Enum289.AI_ACTION_RED_ALERT;
      }
    }
  }

  if (!TANK(pSoldier)) {
    ////////////////////////////////////////////////////////////////////////////
    // MAIN RED AI: Decide soldier's preference between SEEKING,HELPING & HIDING
    ////////////////////////////////////////////////////////////////////////////

    // if we can move at least 1 square's worth
    // and have more APs than we want to reserve
    if (ubCanMove && pSoldier.value.bActionPoints > MAX_AP_CARRIED && !fCivilian) {
      if (fCivilian) {
        // only interested in hiding out...
        bSeekPts = -99;
        bHelpPts = -99;
        bHidePts = +1;
      } else {
        // calculate initial points for watch based on highest watch loc

        bWatchPts = GetHighestWatchedLocPoints(pSoldier.value.ubID);
        if (bWatchPts <= 0) {
          // no watching
          bWatchPts = -99;
        }

        // modify RED movement tendencies according to morale
        switch (pSoldier.value.bAIMorale) {
          case Enum244.MORALE_HOPELESS:
            bSeekPts = -99;
            bHelpPts = -99;
            bHidePts = +1;
            bWatchPts = -99;
            break;
          case Enum244.MORALE_WORRIED:
            bSeekPts += -1;
            bHelpPts += 0;
            bHidePts += +1;
            bWatchPts += 1;
            break;
          case Enum244.MORALE_NORMAL:
            bSeekPts += 0;
            bHelpPts += 0;
            bHidePts += 0;
            bWatchPts += 0;
            break;
          case Enum244.MORALE_CONFIDENT:
            bSeekPts += +1;
            bHelpPts += 0;
            bHidePts += -1;
            bWatchPts += 0;
            break;
          case Enum244.MORALE_FEARLESS:
            bSeekPts += +1;
            bHelpPts += 0;
            bHidePts = -1;
            bWatchPts += 0;
            break;
        }

        // modify tendencies according to orders
        switch (pSoldier.value.bOrders) {
          case Enum241.STATIONARY:
            bSeekPts += -1;
            bHelpPts += -1;
            bHidePts += +1;
            bWatchPts += +1;
            break;
          case Enum241.ONGUARD:
            bSeekPts += -1;
            bHelpPts += 0;
            bHidePts += +1;
            bWatchPts += +1;
            break;
          case Enum241.CLOSEPATROL:
            bSeekPts += 0;
            bHelpPts += 0;
            bHidePts += 0;
            bWatchPts += 0;
            break;
          case Enum241.RNDPTPATROL:
            bSeekPts += 0;
            bHelpPts += 0;
            bHidePts += 0;
            bWatchPts += 0;
            break;
          case Enum241.POINTPATROL:
            bSeekPts += 0;
            bHelpPts += 0;
            bHidePts += 0;
            bWatchPts += 0;
            break;
          case Enum241.FARPATROL:
            bSeekPts += 0;
            bHelpPts += 0;
            bHidePts += 0;
            bWatchPts += 0;
            break;
          case Enum241.ONCALL:
            bSeekPts += 0;
            bHelpPts += +1;
            bHidePts += -1;
            bWatchPts += 0;
            break;
          case Enum241.SEEKENEMY:
            bSeekPts += +1;
            bHelpPts += 0;
            bHidePts += -1;
            bWatchPts += -1;
            break;
        }

        // modify tendencies according to attitude
        switch (pSoldier.value.bAttitude) {
          case Enum242.DEFENSIVE:
            bSeekPts += -1;
            bHelpPts += 0;
            bHidePts += +1;
            bWatchPts += +1;
            break;
          case Enum242.BRAVESOLO:
            bSeekPts += +1;
            bHelpPts += -1;
            bHidePts += -1;
            bWatchPts += -1;
            break;
          case Enum242.BRAVEAID:
            bSeekPts += +1;
            bHelpPts += +1;
            bHidePts += -1;
            bWatchPts += -1;
            break;
          case Enum242.CUNNINGSOLO:
            bSeekPts += 0;
            bHelpPts += -1;
            bHidePts += +1;
            bWatchPts += 0;
            break;
          case Enum242.CUNNINGAID:
            bSeekPts += 0;
            bHelpPts += +1;
            bHidePts += +1;
            bWatchPts += 0;
            break;
          case Enum242.AGGRESSIVE:
            bSeekPts += +1;
            bHelpPts += 0;
            bHidePts += -1;
            bWatchPts += 0;
            break;
          case Enum242.ATTACKSLAYONLY:
            bSeekPts += +1;
            bHelpPts += 0;
            bHidePts += -1;
            bWatchPts += 0;
            break;
        }
      }

      if (!gfTurnBasedAI) {
        // don't search for cover
        bHidePts = -99;
      }

      // while one of the three main RED REACTIONS remains viable
      while ((bSeekPts > -90) || (bHelpPts > -90) || (bHidePts > -90)) {
        // if SEEKING is possible and at least as desirable as helping or hiding
        if ((bSeekPts > -90) && (bSeekPts >= bHelpPts) && (bSeekPts >= bHidePts) && (bSeekPts >= bWatchPts)) {
          // get the location of the closest reachable opponent
          sClosestDisturbance = ClosestReachableDisturbance(pSoldier, ubUnconsciousOK, addressof(fClimb));

          // if there is an opponent reachable
          if (sClosestDisturbance != NOWHERE) {
            //////////////////////////////////////////////////////////////////////
            // SEEK CLOSEST DISTURBANCE: GO DIRECTLY TOWARDS CLOSEST KNOWN OPPONENT
            //////////////////////////////////////////////////////////////////////

            // try to move towards him
            pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sClosestDisturbance, Enum289.AI_ACTION_SEEK_OPPONENT);

            if (pSoldier.value.usActionData != NOWHERE) {
              // Check for a trap
              if (!ArmySeesOpponents()) {
                if (GetNearestRottingCorpseAIWarning(pSoldier.value.usActionData) > 0) {
                  // abort! abort!
                  pSoldier.value.usActionData = NOWHERE;
                }
              }
            }

            // if it's possible
            if (pSoldier.value.usActionData != NOWHERE) {
              if (fClimb && pSoldier.value.usActionData == sClosestDisturbance) {
                return Enum289.AI_ACTION_MOVE_TO_CLIMB;
              }

              // if we're a cautious sort,

              // let's be a bit cautious about going right up to a location without enough APs to shoot
              switch (pSoldier.value.bAttitude) {
                case Enum242.DEFENSIVE:
                case Enum242.CUNNINGSOLO:
                case Enum242.CUNNINGAID:
                  if (PythSpacesAway(pSoldier.value.usActionData, sClosestDisturbance) < 5 || LocationToLocationLineOfSightTest(pSoldier.value.usActionData, pSoldier.value.bLevel, sClosestDisturbance, pSoldier.value.bLevel, MaxDistanceVisible(), true)) {
                    // reserve APs for a possible crouch plus a shot
                    pSoldier.value.usActionData = InternalGoAsFarAsPossibleTowards(pSoldier, sClosestDisturbance, (MinAPsToAttack(pSoldier, sClosestDisturbance, ADDTURNCOST) + AP_CROUCH), Enum289.AI_ACTION_SEEK_OPPONENT, FLAG_CAUTIOUS);
                    if (pSoldier.value.usActionData != NOWHERE) {
                      pSoldier.value.fAIFlags |= AI_CAUTIOUS;
                      pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
                      return Enum289.AI_ACTION_SEEK_OPPONENT;
                    }
                  } else {
                    return Enum289.AI_ACTION_SEEK_OPPONENT;
                  }
                  break;
                default:
                  return Enum289.AI_ACTION_SEEK_OPPONENT;
              }
            }
          }

          // mark SEEKING as impossible for next time through while loop
          bSeekPts = -99;
        }

        // if WATCHING is possible and at least as desirable as anything else
        if ((bWatchPts > -90) && (bWatchPts >= bSeekPts) && (bWatchPts >= bHelpPts) && (bWatchPts >= bHidePts)) {
          // take a look at our highest watch point... if it's still visible, turn to face it and then wait
          bHighestWatchLoc = GetHighestVisibleWatchedLoc(pSoldier.value.ubID);
          // sDistVisible =  DistanceVisible( pSoldier, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, gsWatchedLoc[ pSoldier->ubID ][ bHighestWatchLoc ], gbWatchedLocLevel[ pSoldier->ubID ][ bHighestWatchLoc ] );
          if (bHighestWatchLoc != -1) {
            // see if we need turn to face that location
            ubOpponentDir = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(gsWatchedLoc[pSoldier.value.ubID][bHighestWatchLoc]), CenterY(gsWatchedLoc[pSoldier.value.ubID][bHighestWatchLoc]));

            // if soldier is not already facing in that direction,
            // and the opponent is close enough that he could possibly be seen
            if (pSoldier.value.bDirection != ubOpponentDir && InternalIsValidStance(pSoldier, ubOpponentDir, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
              // turn
              pSoldier.value.usActionData = ubOpponentDir;
              pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
              return Enum289.AI_ACTION_CHANGE_FACING;
            } else {
              // consider at least crouching
              if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND && InternalIsValidStance(pSoldier, ubOpponentDir, ANIM_CROUCH)) {
                pSoldier.value.usActionData = ANIM_CROUCH;
                pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
                return Enum289.AI_ACTION_CHANGE_STANCE;
              } else if (gAnimControl[pSoldier.value.usAnimState].ubHeight != ANIM_PRONE) {
                // maybe go prone
                if (PreRandom(2) == 0 && InternalIsValidStance(pSoldier, ubOpponentDir, ANIM_PRONE)) {
                  pSoldier.value.usActionData = ANIM_PRONE;
                  pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
                  return Enum289.AI_ACTION_CHANGE_STANCE;
                }
                // end turn
                return Enum289.AI_ACTION_END_TURN;
              }
            }
          }
          bWatchPts = -99;
        }

        // if HELPING is possible and at least as desirable as seeking or hiding
        if ((bHelpPts > -90) && (bHelpPts >= bSeekPts) && (bHelpPts >= bHidePts) && (bHelpPts >= bWatchPts)) {
          sClosestFriend = ClosestReachableFriendInTrouble(pSoldier, addressof(fClimb));

          if (sClosestFriend != NOWHERE) {
            //////////////////////////////////////////////////////////////////////
            // GO DIRECTLY TOWARDS CLOSEST FRIEND UNDER FIRE OR WHO LAST RADIOED
            //////////////////////////////////////////////////////////////////////
            pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sClosestFriend, Enum289.AI_ACTION_SEEK_OPPONENT);

            if (pSoldier.value.usActionData != NOWHERE) {
              if (fClimb && pSoldier.value.usActionData == sClosestFriend) {
                return Enum289.AI_ACTION_MOVE_TO_CLIMB;
              }
              return Enum289.AI_ACTION_SEEK_FRIEND;
            }
          }

          // mark SEEKING as impossible for next time through while loop

          bHelpPts = -99;
        }

        // if HIDING is possible and at least as desirable as seeking or helping
        if ((bHidePts > -90) && (bHidePts >= bSeekPts) && (bHidePts >= bHelpPts) && (bHidePts >= bWatchPts)) {
          sClosestOpponent = ClosestKnownOpponent(pSoldier, null, null);
          // if an opponent is known (not necessarily reachable or conscious)
          if (!SkipCoverCheck && sClosestOpponent != NOWHERE) {
            //////////////////////////////////////////////////////////////////////
            // TAKE BEST NEARBY COVER FROM ALL KNOWN OPPONENTS
            //////////////////////////////////////////////////////////////////////

            pSoldier.value.usActionData = FindBestNearbyCover(pSoldier, pSoldier.value.bAIMorale, addressof(iDummy));

            // let's be a bit cautious about going right up to a location without enough APs to shoot
            if (pSoldier.value.usActionData != NOWHERE) {
              sClosestDisturbance = ClosestReachableDisturbance(pSoldier, ubUnconsciousOK, addressof(fClimb));
              if (sClosestDisturbance != NOWHERE && (SpacesAway(pSoldier.value.usActionData, sClosestDisturbance) < 5 || SpacesAway(pSoldier.value.usActionData, sClosestDisturbance) + 5 < SpacesAway(pSoldier.value.sGridNo, sClosestDisturbance))) {
                // either moving significantly closer or into very close range
                // ensure will we have enough APs for a possible crouch plus a shot
                if (InternalGoAsFarAsPossibleTowards(pSoldier, pSoldier.value.usActionData, (MinAPsToAttack(pSoldier, sClosestOpponent, ADDTURNCOST) + AP_CROUCH), Enum289.AI_ACTION_TAKE_COVER, 0) == pSoldier.value.usActionData) {
                  return Enum289.AI_ACTION_TAKE_COVER;
                }
              } else {
                return Enum289.AI_ACTION_TAKE_COVER;
              }
            }
          }

          // mark HIDING as impossible for next time through while loop

          bHidePts = -99;
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // NOTHING USEFUL POSSIBLE!  IF NPC IS CURRENTLY UNDER FIRE, TRY TO RUN AWAY
    ////////////////////////////////////////////////////////////////////////////

    // if we're currently under fire (presumably, attacker is hidden)
    if (pSoldier.value.bUnderFire || fCivilian) {
      // only try to run if we've actually been hit recently & noticably so
      // otherwise, presumably our current cover is pretty good & sufficient
      if (pSoldier.value.bShock > 0 || fCivilian) {
        // look for best place to RUN AWAY to (farthest from the closest threat)
        pSoldier.value.usActionData = FindSpotMaxDistFromOpponents(pSoldier);

        if (pSoldier.value.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_RUN_AWAY;
        }
      }

      ////////////////////////////////////////////////////////////////////////////
      // UNDER FIRE, DON'T WANNA/CAN'T RUN AWAY, SO CROUCH
      ////////////////////////////////////////////////////////////////////////////

      // if not in water and not already crouched
      if (!fCivilian) {
        if (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND && IsValidStance(pSoldier, ANIM_CROUCH)) {
          if (!gfTurnBasedAI || GetAPsToChangeStance(pSoldier, ANIM_CROUCH) <= pSoldier.value.bActionPoints) {
            pSoldier.value.usActionData = ANIM_CROUCH;
            return Enum289.AI_ACTION_CHANGE_STANCE;
          }
        } else if (gAnimControl[pSoldier.value.usAnimState].ubHeight != ANIM_PRONE) {
          // maybe go prone
          if (PreRandom(2) == 0 && IsValidStance(pSoldier, ANIM_PRONE)) {
            pSoldier.value.usActionData = ANIM_PRONE;
            return Enum289.AI_ACTION_CHANGE_STANCE;
          }
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // LOOK AROUND TOWARD CLOSEST KNOWN OPPONENT, IF KNOWN
  ////////////////////////////////////////////////////////////////////////////

  if (!gfTurnBasedAI || GetAPsToLook(pSoldier) <= pSoldier.value.bActionPoints) {
    // determine the location of the known closest opponent
    // (don't care if he's conscious, don't care if he's reachable at all)
    sClosestOpponent = ClosestKnownOpponent(pSoldier, null, null);

    if (sClosestOpponent != NOWHERE) {
      // determine direction from this soldier to the closest opponent
      ubOpponentDir = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(sClosestOpponent), CenterY(sClosestOpponent));

      // if soldier is not already facing in that direction,
      // and the opponent is close enough that he could possibly be seen
      // note, have to change this to use the level returned from ClosestKnownOpponent
      sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sClosestOpponent, 0);

      if ((pSoldier.value.bDirection != ubOpponentDir) && (PythSpacesAway(pSoldier.value.sGridNo, sClosestOpponent) <= sDistVisible)) {
        // set base chance according to orders
        if ((pSoldier.value.bOrders == Enum241.STATIONARY) || (pSoldier.value.bOrders == Enum241.ONGUARD))
          iChance = 50;
        else // all other orders
          iChance = 25;

        if (pSoldier.value.bAttitude == Enum242.DEFENSIVE)
          iChance += 25;

        if (TANK(pSoldier)) {
          iChance += 50;
        }

        if (PreRandom(100) < iChance && InternalIsValidStance(pSoldier, ubOpponentDir, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
          pSoldier.value.usActionData = ubOpponentDir;

          return Enum289.AI_ACTION_CHANGE_FACING;
        }
      }
    }
  }

  if (TANK(pSoldier)) {
    // try turning in a random direction as we still can't see anyone.
    if (!gfTurnBasedAI || GetAPsToLook(pSoldier) <= pSoldier.value.bActionPoints) {
      sClosestDisturbance = MostImportantNoiseHeard(pSoldier, null, null, null);
      if (sClosestDisturbance != NOWHERE) {
        ubOpponentDir = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(sClosestDisturbance), CenterY(sClosestDisturbance));
        if (pSoldier.value.bDirection == ubOpponentDir) {
          ubOpponentDir = PreRandom(Enum245.NUM_WORLD_DIRECTIONS);
        }
      } else {
        ubOpponentDir = PreRandom(Enum245.NUM_WORLD_DIRECTIONS);
      }

      if ((pSoldier.value.bDirection != ubOpponentDir)) {
        if ((pSoldier.value.bActionPoints == pSoldier.value.bInitialActionPoints || PreRandom(100) < 60) && InternalIsValidStance(pSoldier, ubOpponentDir, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
          pSoldier.value.usActionData = ubOpponentDir;

          // limit turning a bit... if the last thing we did was also a turn, add a 60% chance of this being our last turn
          if (pSoldier.value.bLastAction == Enum289.AI_ACTION_CHANGE_FACING && PreRandom(100) < 60) {
            if (gfTurnBasedAI) {
              pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
            } else {
              pSoldier.value.bNextAction = Enum289.AI_ACTION_WAIT;
              pSoldier.value.usNextActionData = REALTIME_AI_DELAY();
            }
          }

          return Enum289.AI_ACTION_CHANGE_FACING;
        }
      }
    }

    // that's it for tanks
    return Enum289.AI_ACTION_NONE;
  }

  ////////////////////////////////////////////////////////////////////////////
  // LEAVE THE SECTOR
  ////////////////////////////////////////////////////////////////////////////

  // NOT IMPLEMENTED

  ////////////////////////////////////////////////////////////////////////////
  // PICKUP A NEARBY ITEM THAT'S USEFUL
  ////////////////////////////////////////////////////////////////////////////

  if (ubCanMove && !pSoldier.value.bNeutral && (gfTurnBasedAI || pSoldier.value.bTeam == ENEMY_TEAM)) {
    pSoldier.value.bAction = SearchForItems(pSoldier, Enum293.SEARCH_GENERAL_ITEMS, pSoldier.value.inv[Enum261.HANDPOS].usItem);

    if (pSoldier.value.bAction != Enum289.AI_ACTION_NONE) {
      return pSoldier.value.bAction;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // SEEK CLOSEST FRIENDLY MEDIC
  ////////////////////////////////////////////////////////////////////////////

  // NOT IMPLEMENTED

  ////////////////////////////////////////////////////////////////////////////
  // GIVE FIRST AID TO A NEARBY INJURED/DYING FRIEND
  ////////////////////////////////////////////////////////////////////////////
  // - must be BRAVEAID or CUNNINGAID (medic) ?

  // NOT IMPLEMENTED

  /* JULY 29, 1996 - Decided that this was a bad idea, after watching a civilian
     start a random patrol while 2 steps away from a hidden armed opponent...*/

  ////////////////////////////////////////////////////////////////////////////
  // SWITCH TO GREEN: soldier does ordinary regular patrol, seeks friends
  ////////////////////////////////////////////////////////////////////////////

  // if not in combat or under fire, and we COULD have moved, just chose not to
  if ((pSoldier.value.bAlertStatus != Enum243.STATUS_BLACK) && !pSoldier.value.bUnderFire && ubCanMove && (!gfTurnBasedAI || pSoldier.value.bActionPoints >= pSoldier.value.bInitialActionPoints) && (ClosestReachableDisturbance(pSoldier, true, addressof(fClimb)) == NOWHERE)) {
    // addition:  if soldier is bleeding then reduce bleeding and do nothing
    if (pSoldier.value.bBleeding > MIN_BLEEDING_THRESHOLD) {
      // reduce bleeding by 1 point per AP (in RT, APs will get recalculated so it's okay)
      pSoldier.value.bBleeding = Math.max(0, pSoldier.value.bBleeding - pSoldier.value.bActionPoints);
      return (Enum289.AI_ACTION_NONE); // will end-turn/wait depending on whether we're in TB or realtime
    }

    // Skip RED until new situation/next turn, 30% extra chance to do GREEN actions
    pSoldier.value.bBypassToGreen = 30;
    return DecideActionGreen(pSoldier);
  }

  ////////////////////////////////////////////////////////////////////////////
  // CROUCH IF NOT CROUCHING ALREADY
  ////////////////////////////////////////////////////////////////////////////

  // if not in water and not already crouched, try to crouch down first
  if (!fCivilian && !bInWater && (gAnimControl[pSoldier.value.usAnimState].ubHeight == ANIM_STAND) && IsValidStance(pSoldier, ANIM_CROUCH)) {
    sClosestOpponent = ClosestKnownOpponent(pSoldier, null, null);

    if ((sClosestOpponent != NOWHERE && PythSpacesAway(pSoldier.value.sGridNo, sClosestOpponent) < (MaxDistanceVisible() * 3) / 2) || PreRandom(4) == 0) {
      if (!gfTurnBasedAI || GetAPsToChangeStance(pSoldier, ANIM_CROUCH) <= pSoldier.value.bActionPoints) {
        pSoldier.value.usActionData = ANIM_CROUCH;
        return Enum289.AI_ACTION_CHANGE_STANCE;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // IF UNDER FIRE, FACE THE MOST IMPORTANT NOISE WE KNOW AND GO PRONE
  ////////////////////////////////////////////////////////////////////////////

  if (!fCivilian && pSoldier.value.bUnderFire && pSoldier.value.bActionPoints >= (pSoldier.value.bInitialActionPoints - GetAPsToLook(pSoldier)) && IsValidStance(pSoldier, ANIM_PRONE)) {
    sClosestDisturbance = MostImportantNoiseHeard(pSoldier, null, null, null);
    if (sClosestDisturbance != NOWHERE) {
      ubOpponentDir = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(sClosestDisturbance), CenterY(sClosestDisturbance));
      if (pSoldier.value.bDirection != ubOpponentDir) {
        if (!gfTurnBasedAI || GetAPsToLook(pSoldier) <= pSoldier.value.bActionPoints) {
          pSoldier.value.usActionData = ubOpponentDir;
          return Enum289.AI_ACTION_CHANGE_FACING;
        }
      } else if ((!gfTurnBasedAI || GetAPsToChangeStance(pSoldier, ANIM_PRONE) <= pSoldier.value.bActionPoints) && InternalIsValidStance(pSoldier, ubOpponentDir, ANIM_PRONE)) {
        // go prone, end turn
        pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
        pSoldier.value.usActionData = ANIM_PRONE;
        return Enum289.AI_ACTION_CHANGE_STANCE;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // DO NOTHING: Not enough points left to move, so save them for next turn
  ////////////////////////////////////////////////////////////////////////////

  pSoldier.value.usActionData = NOWHERE;
  return Enum289.AI_ACTION_NONE;
}

function DecideActionBlack(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let iCoverPercentBetter: INT32;
  let iOffense: INT32;
  let iDefense: INT32;
  let iChance: INT32;
  let sClosestOpponent: INT16;
  let sBestCover: INT16 = NOWHERE;
  let sClosestDisturbance: INT16;
  let ubMinAPCost: UINT8;
  let ubCanMove: UINT8;
  let bInWater: INT8;
  let bInDeepWater: INT8;
  let bInGas: INT8;
  let bDirection: INT8;
  let ubBestAttackAction: UINT8 = Enum289.AI_ACTION_NONE;
  let bCanAttack: INT8;
  let bActionReturned: INT8;
  let bWeaponIn: INT8;
  let fTryPunching: boolean = false;

  let BestShot: ATTACKTYPE;
  let BestThrow: ATTACKTYPE;
  let BestStab: ATTACKTYPE;
  let BestAttack: ATTACKTYPE;
  let fCivilian: boolean = (PTR_CIVILIAN() && (pSoldier.value.ubCivilianGroup == Enum246.NON_CIV_GROUP || pSoldier.value.bNeutral || (pSoldier.value.ubBodyType >= Enum194.FATCIV && pSoldier.value.ubBodyType <= Enum194.CRIPPLECIV)));
  let ubBestStance: UINT8;
  let ubStanceCost: UINT8;
  let fChangeStanceFirst: boolean; // before firing
  let fClimb: boolean;
  let ubBurstAPs: UINT8;
  let ubOpponentDir: UINT8;
  let sCheckGridNo: INT16;

  let fAllowCoverCheck: boolean = false;

  // if we have absolutely no action points, we can't do a thing under BLACK!
  if (!pSoldier.value.bActionPoints) {
    pSoldier.value.usActionData = NOWHERE;
    return Enum289.AI_ACTION_NONE;
  }

  // can this guy move to any of the neighbouring squares ? (sets TRUE/FALSE)
  ubCanMove = (pSoldier.value.bActionPoints >= MinPtsToMove(pSoldier));

  if ((pSoldier.value.bTeam == ENEMY_TEAM || pSoldier.value.ubProfile == Enum268.WARDEN) && (gTacticalStatus.fPanicFlags & PANIC_TRIGGERS_HERE) && (gTacticalStatus.ubTheChosenOne == NOBODY)) {
    let bPanicTrigger: INT8;

    bPanicTrigger = ClosestPanicTrigger(pSoldier);
    // if it's an alarm trigger and team is alerted, ignore it
    if (!(gTacticalStatus.bPanicTriggerIsAlarm[bPanicTrigger] && gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition) && PythSpacesAway(pSoldier.value.sGridNo, gTacticalStatus.sPanicTriggerGridNo[bPanicTrigger]) < 10) {
      PossiblyMakeThisEnemyChosenOne(pSoldier);
    }
  }

  // if this soldier is the "Chosen One" (enemies only)
  if (pSoldier.value.ubID == gTacticalStatus.ubTheChosenOne) {
    // do some special panic AI decision making
    bActionReturned = PanicAI(pSoldier, ubCanMove);

    // if we decided on an action while in there, we're done
    if (bActionReturned != -1)
      return bActionReturned;
  }

  if (pSoldier.value.ubProfile != NO_PROFILE) {
    // if they see enemies, the Queen will keep going to the staircase, but Joe will fight
    if ((pSoldier.value.ubProfile == Enum268.QUEEN) && ubCanMove) {
      if (gWorldSectorX == 3 && gWorldSectorY == MAP_ROW_P && gbWorldSectorZ == 0 && !gfUseAlternateQueenPosition) {
        bActionReturned = HeadForTheStairCase(pSoldier);
        if (bActionReturned != Enum289.AI_ACTION_NONE) {
          return bActionReturned;
        }
      }
    }
  }

  if (pSoldier.value.uiStatusFlags & SOLDIER_BOXER) {
    if (gTacticalStatus.bBoxingState == Enum247.PRE_BOXING) {
      return DecideActionBoxerEnteringRing(pSoldier);
    } else if (gTacticalStatus.bBoxingState == Enum247.BOXING) {
      bInWater = false;
      bInDeepWater = false;
      bInGas = false;

      // calculate our morale
      pSoldier.value.bAIMorale = CalcMorale(pSoldier);
      // and continue on...
    } else //????
    {
      return Enum289.AI_ACTION_NONE;
    }
  } else {
    // determine if we happen to be in water (in which case we're in BIG trouble!)
    bInWater = Water(pSoldier.value.sGridNo);
    bInDeepWater = WaterTooDeepForAttacks(pSoldier.value.sGridNo);

    // check if standing in tear gas without a gas mask on
    bInGas = InGasOrSmoke(pSoldier, pSoldier.value.sGridNo);

    // calculate our morale
    pSoldier.value.bAIMorale = CalcMorale(pSoldier);

    ////////////////////////////////////////////////////////////////////////////
    // WHEN LEFT IN GAS, WEAR GAS MASK IF AVAILABLE AND NOT WORN
    ////////////////////////////////////////////////////////////////////////////

    if (!bInGas && (gWorldSectorX == TIXA_SECTOR_X && gWorldSectorY == TIXA_SECTOR_Y)) {
      // only chance if we happen to be caught with our gas mask off
      if (PreRandom(10) == 0 && WearGasMaskIfAvailable(pSoldier)) {
        bInGas = false;
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // IF GASSED, OR REALLY TIRED (ON THE VERGE OF COLLAPSING), TRY TO RUN AWAY
    ////////////////////////////////////////////////////////////////////////////

    // if we're desperately short on breath (it's OK if we're in water, though!)
    if (bInGas || (pSoldier.value.bBreath < 5)) {
      // if soldier has enough APs left to move at least 1 square's worth
      if (ubCanMove) {
        // look for best place to RUN AWAY to (farthest from the closest threat)
        pSoldier.value.usActionData = FindSpotMaxDistFromOpponents(pSoldier);

        if (pSoldier.value.usActionData != NOWHERE) {
          return Enum289.AI_ACTION_RUN_AWAY;
        }
      }

      // REALLY tired, can't get away, force soldier's morale to hopeless state
      pSoldier.value.bAIMorale = Enum244.MORALE_HOPELESS;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // STUCK IN WATER OR GAS, NO COVER, GO TO NEAREST SPOT OF UNGASSED LAND
  ////////////////////////////////////////////////////////////////////////////

  // if soldier in water/gas has enough APs left to move at least 1 square
  if ((bInDeepWater || bInGas) && ubCanMove) {
    pSoldier.value.usActionData = FindNearestUngassedLand(pSoldier);

    if (pSoldier.value.usActionData != NOWHERE) {
      return Enum289.AI_ACTION_LEAVE_WATER_GAS;
    }

    // couldn't find ANY land within 25 tiles(!), this should never happen...

    // look for best place to RUN AWAY to (farthest from the closest threat)
    pSoldier.value.usActionData = FindSpotMaxDistFromOpponents(pSoldier);

    if (pSoldier.value.usActionData != NOWHERE) {
      return Enum289.AI_ACTION_RUN_AWAY;
    }

    // GIVE UP ON LIFE!  MERCS MUST HAVE JUST CORNERED A HELPLESS ENEMY IN A
    // GAS FILLED ROOM (OR IN WATER MORE THAN 25 TILES FROM NEAREST LAND...)
    pSoldier.value.bAIMorale = Enum244.MORALE_HOPELESS;
  }

  // offer surrender?

  if (pSoldier.value.bTeam == ENEMY_TEAM && pSoldier.value.bVisible == true && !(gTacticalStatus.fEnemyFlags & ENEMY_OFFERED_SURRENDER) && pSoldier.value.bLife >= pSoldier.value.bLifeMax / 2) {
    if (gTacticalStatus.Team[MILITIA_TEAM].bMenInSector == 0 && NumPCsInSector() < 4 && gTacticalStatus.Team[ENEMY_TEAM].bMenInSector >= NumPCsInSector() * 3) {
      // if( GetWorldDay() > STARTDAY_ALLOW_PLAYER_CAPTURE_FOR_RESCUE && !( gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE ) )
      {
        if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED || (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTDONE && gubQuest[Enum169.QUEST_INTERROGATION] == QUESTNOTSTARTED)) {
          gTacticalStatus.fEnemyFlags |= ENEMY_OFFERED_SURRENDER;
          return Enum289.AI_ACTION_OFFER_SURRENDER;
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // SOLDIER CAN ATTACK IF NOT IN WATER/GAS AND NOT DOING SOMETHING TOO FUNKY
  ////////////////////////////////////////////////////////////////////////////

  // NPCs in water/tear gas without masks are not permitted to shoot/stab/throw
  if ((pSoldier.value.bActionPoints < 2) || bInDeepWater || bInGas || pSoldier.value.bRTPCombat == RTP_COMBAT_REFRAIN) {
    bCanAttack = false;
  } else if (pSoldier.value.uiStatusFlags & SOLDIER_BOXER) {
    bCanAttack = true;
    fTryPunching = true;
  } else {
    do {
      bCanAttack = CanNPCAttack(pSoldier);
      if (bCanAttack != true) {
        if (fCivilian) {
          if ((bCanAttack == NOSHOOT_NOWEAPON) && !(pSoldier.value.uiStatusFlags & SOLDIER_BOXER) && pSoldier.value.ubBodyType != Enum194.COW && pSoldier.value.ubBodyType != Enum194.CRIPPLECIV) {
            // cower in fear!!
            if (pSoldier.value.uiStatusFlags & SOLDIER_COWERING) {
              if (pSoldier.value.bLastAction == Enum289.AI_ACTION_COWER) {
                // do nothing
                pSoldier.value.usActionData = NOWHERE;
                return Enum289.AI_ACTION_NONE;
              } else {
                // set up next action to run away
                pSoldier.value.usNextActionData = FindSpotMaxDistFromOpponents(pSoldier);
                if (pSoldier.value.usNextActionData != NOWHERE) {
                  pSoldier.value.bNextAction = Enum289.AI_ACTION_RUN_AWAY;
                  pSoldier.value.usActionData = ANIM_STAND;
                  return Enum289.AI_ACTION_STOP_COWERING;
                } else {
                  return Enum289.AI_ACTION_NONE;
                }
              }
            } else {
              // cower!!!
              pSoldier.value.usActionData = ANIM_CROUCH;
              return Enum289.AI_ACTION_COWER;
            }
          }
        } else if (bCanAttack == NOSHOOT_NOAMMO && ubCanMove && !pSoldier.value.bNeutral) {
          // try to find more ammo
          pSoldier.value.bAction = SearchForItems(pSoldier, Enum293.SEARCH_AMMO, pSoldier.value.inv[Enum261.HANDPOS].usItem);

          if (pSoldier.value.bAction == Enum289.AI_ACTION_NONE) {
            // the current weapon appears is useless right now!
            // (since we got a return code of noammo, we know the hand usItem
            // is our gun)
            pSoldier.value.inv[Enum261.HANDPOS].fFlags |= OBJECT_AI_UNUSABLE;
            // move the gun into another pocket...
            AutoPlaceObject(pSoldier, addressof(pSoldier.value.inv[Enum261.HANDPOS]), false);
          } else {
            return pSoldier.value.bAction;
          }
        } else {
          bCanAttack = false;
        }
      }
    } while (bCanAttack != true && bCanAttack != false);

    if (!bCanAttack) {
      if (pSoldier.value.bAIMorale > Enum244.MORALE_WORRIED) {
        pSoldier.value.bAIMorale = Enum244.MORALE_WORRIED;
      }

      if (!fCivilian) {
        // can always attack with HTH as a last resort
        bCanAttack = true;
        fTryPunching = true;
      }
    }
  }

  // if we don't have a gun, look around for a weapon!
  if (FindAIUsableObjClass(pSoldier, IC_GUN) == ITEM_NOT_FOUND && ubCanMove && !pSoldier.value.bNeutral) {
    // look around for a gun...
    pSoldier.value.bAction = SearchForItems(pSoldier, Enum293.SEARCH_WEAPONS, pSoldier.value.inv[Enum261.HANDPOS].usItem);
    if (pSoldier.value.bAction != Enum289.AI_ACTION_NONE) {
      return pSoldier.value.bAction;
    }
  }

  BestShot.ubPossible = false; // by default, assume Shooting isn't possible
  BestThrow.ubPossible = false; // by default, assume Throwing isn't possible
  BestStab.ubPossible = false; // by default, assume Stabbing isn't possible

  BestAttack.ubChanceToReallyHit = 0;

  // if we are able attack
  if (bCanAttack) {
    pSoldier.value.bAimShotLocation = AIM_SHOT_RANDOM;

    //////////////////////////////////////////////////////////////////////////
    // FIRE A GUN AT AN OPPONENT
    //////////////////////////////////////////////////////////////////////////

    bWeaponIn = FindAIUsableObjClass(pSoldier, IC_GUN);

    if (bWeaponIn != NO_SLOT) {
      BestShot.bWeaponIn = bWeaponIn;
      // if it's in another pocket, swap it into his hand temporarily
      if (bWeaponIn != Enum261.HANDPOS) {
        RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, TEMPORARILY);
      }

      // now it better be a gun, or the guy can't shoot (but has other attack(s))
      if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN && pSoldier.value.inv[Enum261.HANDPOS].bGunStatus >= USABLE) {
        // get the minimum cost to attack the same target with this gun
        ubMinAPCost = MinAPsToAttack(pSoldier, pSoldier.value.sLastTarget, DONTADDTURNCOST);

        // if we have enough action points to shoot with this gun
        if (pSoldier.value.bActionPoints >= ubMinAPCost) {
          // look around for a worthy target (which sets BestShot.ubPossible)
          CalcBestShot(pSoldier, addressof(BestShot));

          if (pSoldier.value.bTeam == gbPlayerNum && pSoldier.value.bRTPCombat == RTP_COMBAT_CONSERVE) {
            if (BestShot.ubChanceToReallyHit < 30) {
              // skip firing, our chance isn't good enough
              BestShot.ubPossible = false;
            }
          }

          if (BestShot.ubPossible) {
            // if the selected opponent is not a threat (unconscious & !serviced)
            // (usually, this means all the guys we see are unconscious, but, on
            //  rare occasions, we may not be able to shoot a healthy guy, too)
            if ((Menptr[BestShot.ubOpponent].bLife < OKLIFE) && !Menptr[BestShot.ubOpponent].bService) {
              // if our attitude is NOT aggressive
              if (pSoldier.value.bAttitude != Enum242.AGGRESSIVE || BestShot.ubChanceToReallyHit < 60) {
                // get the location of the closest CONSCIOUS reachable opponent
                sClosestDisturbance = ClosestReachableDisturbance(pSoldier, false, addressof(fClimb));

                // if we found one
                if (sClosestDisturbance != NOWHERE) {
                  // don't bother checking GRENADES/KNIVES, he can't have conscious targets
                  // then make decision as if at alert status RED, but make sure
                  // we don't try to SEEK OPPONENT the unconscious guy!
                  return DecideActionRed(pSoldier, false);
                }
                // else kill the guy, he could be the last opponent alive in this sector
              }
              // else aggressive guys will ALWAYS finish off unconscious opponents
            }

            // now we KNOW FOR SURE that we will do something (shoot, at least)
            NPCDoesAct(pSoldier);
          }
        }

        // if it was in his holster, swap it back into his holster for now
        if (bWeaponIn != Enum261.HANDPOS) {
          RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, TEMPORARILY);
        }
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // THROW A TOSSABLE ITEM AT OPPONENT(S)
    // 	- HTH: THIS NOW INCLUDES FIRING THE GRENADE LAUNCHAR AND MORTAR!
    //////////////////////////////////////////////////////////////////////////

    // this looks for throwables, and sets BestThrow.ubPossible if it can be done
    // if ( !gfHiddenInterrupt )
    {
      CheckIfTossPossible(pSoldier, addressof(BestThrow));

      if (BestThrow.ubPossible) {
        if (pSoldier.value.inv[BestThrow.bWeaponIn].usItem == Enum225.MORTAR) {
          ubOpponentDir = GetDirectionFromGridNo(BestThrow.sTarget, pSoldier);

          // Get new gridno!
          sCheckGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(ubOpponentDir));

          if (!OKFallDirection(pSoldier, sCheckGridNo, pSoldier.value.bLevel, ubOpponentDir, pSoldier.value.usAnimState)) {
            // can't fire!
            BestThrow.ubPossible = false;

            // try behind us, see if there's room to move back
            sCheckGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(gOppositeDirection[ubOpponentDir]));
            if (OKFallDirection(pSoldier, sCheckGridNo, pSoldier.value.bLevel, gOppositeDirection[ubOpponentDir], pSoldier.value.usAnimState)) {
              pSoldier.value.usActionData = sCheckGridNo;

              return Enum289.AI_ACTION_GET_CLOSER;
            }
          }
        }

        if (BestThrow.ubPossible) {
          // now we KNOW FOR SURE that we will do something (throw, at least)
          NPCDoesAct(pSoldier);
        }
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // GO STAB AN OPPONENT WITH A KNIFE
    //////////////////////////////////////////////////////////////////////////

    // if soldier has a knife in his hand
    bWeaponIn = FindAIUsableObjClass(pSoldier, (IC_BLADE | IC_THROWING_KNIFE));

    // if the soldier does have a usable knife somewhere
    if (bWeaponIn != NO_SLOT) {
      BestStab.bWeaponIn = bWeaponIn;
      // if it's in his holster, swap it into his hand temporarily
      if (bWeaponIn != Enum261.HANDPOS) {
        RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, TEMPORARILY);
      }

      // get the minimum cost to attack with this knife
      ubMinAPCost = MinAPsToAttack(pSoldier, pSoldier.value.sLastTarget, DONTADDTURNCOST);

      // if we can afford the minimum AP cost to stab with/throw this knife weapon
      if (pSoldier.value.bActionPoints >= ubMinAPCost) {
        // NB throwing knife in hand now
        if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass & IC_THROWING_KNIFE) {
          // throwing knife code works like shooting

          // look around for a worthy target (which sets BestStab.ubPossible)
          CalcBestShot(pSoldier, addressof(BestStab));

          if (BestStab.ubPossible) {
            // if the selected opponent is not a threat (unconscious & !serviced)
            // (usually, this means all the guys we see are unconscious, but, on
            //  rare occasions, we may not be able to shoot a healthy guy, too)
            if ((Menptr[BestStab.ubOpponent].bLife < OKLIFE) && !Menptr[BestStab.ubOpponent].bService) {
              // don't throw a knife at him.
              BestStab.ubPossible = false;
            }

            // now we KNOW FOR SURE that we will do something (shoot, at least)
            NPCDoesAct(pSoldier);
          }
        } else {
          // sprintf(tempstr,"%s - ubMinAPCost = %d",pSoldier->name,ubMinAPCost);
          // PopMessage(tempstr);
          // then look around for a worthy target (which sets BestStab.ubPossible)
          CalcBestStab(pSoldier, addressof(BestStab), true);

          if (BestStab.ubPossible) {
            // now we KNOW FOR SURE that we will do something (stab, at least)
            NPCDoesAct(pSoldier);
          }
        }
      }

      // if it was in his holster, swap it back into his holster for now
      if (bWeaponIn != Enum261.HANDPOS) {
        RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, TEMPORARILY);
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // CHOOSE THE BEST TYPE OF ATTACK OUT OF THOSE FOUND TO BE POSSIBLE
    //////////////////////////////////////////////////////////////////////////
    if (BestShot.ubPossible) {
      BestAttack.iAttackValue = BestShot.iAttackValue;
      ubBestAttackAction = Enum289.AI_ACTION_FIRE_GUN;
    } else {
      BestAttack.iAttackValue = 0;
    }
    if (BestStab.ubPossible && ((BestStab.iAttackValue > BestAttack.iAttackValue) || (ubBestAttackAction == Enum289.AI_ACTION_NONE))) {
      BestAttack.iAttackValue = BestStab.iAttackValue;
      if (Item[pSoldier.value.inv[BestStab.bWeaponIn].usItem].usItemClass & IC_THROWING_KNIFE) {
        ubBestAttackAction = Enum289.AI_ACTION_THROW_KNIFE;
      } else {
        ubBestAttackAction = Enum289.AI_ACTION_KNIFE_MOVE;
      }
    }
    if (BestThrow.ubPossible && ((BestThrow.iAttackValue > BestAttack.iAttackValue) || (ubBestAttackAction == Enum289.AI_ACTION_NONE))) {
      ubBestAttackAction = Enum289.AI_ACTION_TOSS_PROJECTILE;
    }

    if ((ubBestAttackAction == Enum289.AI_ACTION_NONE) && fTryPunching) {
      // nothing (else) to attack with so let's try hand-to-hand
      bWeaponIn = FindObjWithin(pSoldier, NOTHING, Enum261.HANDPOS, Enum261.SMALLPOCK8POS);

      if (bWeaponIn != NO_SLOT) {
        BestStab.bWeaponIn = bWeaponIn;
        // if it's in his holster, swap it into his hand temporarily
        if (bWeaponIn != Enum261.HANDPOS) {
          RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, TEMPORARILY);
        }

        // get the minimum cost to attack by HTH
        ubMinAPCost = MinAPsToAttack(pSoldier, pSoldier.value.sLastTarget, DONTADDTURNCOST);

        // if we can afford the minimum AP cost to use HTH combat
        if (pSoldier.value.bActionPoints >= ubMinAPCost) {
          // then look around for a worthy target (which sets BestStab.ubPossible)
          CalcBestStab(pSoldier, addressof(BestStab), false);

          if (BestStab.ubPossible) {
            // now we KNOW FOR SURE that we will do something (stab, at least)
            NPCDoesAct(pSoldier);
            ubBestAttackAction = Enum289.AI_ACTION_KNIFE_MOVE;
          }
        }

        // if it was in his holster, swap it back into his holster for now
        if (bWeaponIn != Enum261.HANDPOS) {
          RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, TEMPORARILY);
        }
      }
    }

    // copy the information on the best action selected into BestAttack struct
    switch (ubBestAttackAction) {
      case Enum289.AI_ACTION_FIRE_GUN:
        memcpy(addressof(BestAttack), addressof(BestShot), sizeof(BestAttack));
        break;

      case Enum289.AI_ACTION_TOSS_PROJECTILE:
        memcpy(addressof(BestAttack), addressof(BestThrow), sizeof(BestAttack));
        break;

      case Enum289.AI_ACTION_THROW_KNIFE:
      case Enum289.AI_ACTION_KNIFE_MOVE:
        memcpy(addressof(BestAttack), addressof(BestStab), sizeof(BestAttack));
        break;

      default:
        // set to empty
        memset(addressof(BestAttack), 0, sizeof(BestAttack));
        break;
    }
  }

  // NB a desire of 4 or more is only achievable by brave/aggressive guys with high morale
  if (pSoldier.value.bActionPoints == pSoldier.value.bInitialActionPoints && ubBestAttackAction == Enum289.AI_ACTION_FIRE_GUN && (pSoldier.value.bShock == 0) && (pSoldier.value.bLife >= pSoldier.value.bLifeMax / 2) && BestAttack.ubChanceToReallyHit < 30 && (PythSpacesAway(pSoldier.value.sGridNo, BestAttack.sTarget) > Weapon[pSoldier.value.inv[BestAttack.bWeaponIn].usItem].usRange / CELL_X_SIZE) && RangeChangeDesire(pSoldier) >= 4) {
    // okay, really got to wonder about this... could taking cover be an option?
    if (ubCanMove && pSoldier.value.bOrders != Enum241.STATIONARY && !gfHiddenInterrupt && !(pSoldier.value.uiStatusFlags & SOLDIER_BOXER)) {
      // make militia a bit more cautious
      if (((pSoldier.value.bTeam == MILITIA_TEAM) && (PreRandom(20) > BestAttack.ubChanceToReallyHit)) || ((pSoldier.value.bTeam != MILITIA_TEAM) && (PreRandom(40) > BestAttack.ubChanceToReallyHit))) {
        // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, L"AI %d allowing cover check, chance to hit is only %d, at range %d", BestAttack.ubChanceToReallyHit, PythSpacesAway( pSoldier->sGridNo, BestAttack.sTarget ) );
        // maybe taking cover would be better!
        fAllowCoverCheck = true;
        if (PreRandom(10) > BestAttack.ubChanceToReallyHit) {
          // screw the attack!
          ubBestAttackAction = Enum289.AI_ACTION_NONE;
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // LOOK FOR SOME KIND OF COVER BETTER THAN WHAT WE HAVE NOW
  ////////////////////////////////////////////////////////////////////////////

  // if soldier has enough APs left to move at least 1 square's worth,
  // and either he can't attack any more, or his attack did wound someone
  if ((ubCanMove && !SkipCoverCheck && !gfHiddenInterrupt && ((ubBestAttackAction == Enum289.AI_ACTION_NONE) || pSoldier.value.bLastAttackHit) && (pSoldier.value.bTeam != gbPlayerNum || pSoldier.value.fAIFlags & AI_RTP_OPTION_CAN_SEEK_COVER) && !(pSoldier.value.uiStatusFlags & SOLDIER_BOXER)) || fAllowCoverCheck) {
    sBestCover = FindBestNearbyCover(pSoldier, pSoldier.value.bAIMorale, addressof(iCoverPercentBetter));
  }

  //////////////////////////////////////////////////////////////////////////
  // IF NECESSARY, DECIDE BETWEEN ATTACKING AND DEFENDING (TAKING COVER)
  //////////////////////////////////////////////////////////////////////////

  // if both are possible
  if ((ubBestAttackAction != Enum289.AI_ACTION_NONE) && (sBestCover != NOWHERE)) {
    // gotta compare their merits and select the more desirable option
    iOffense = BestAttack.ubChanceToReallyHit;
    iDefense = iCoverPercentBetter;

    // based on how we feel about the situation, decide whether to attack first
    switch (pSoldier.value.bAIMorale) {
      case Enum244.MORALE_FEARLESS:
        iOffense += iOffense / 2; // increase 50%
        break;

      case Enum244.MORALE_CONFIDENT:
        iOffense += iOffense / 4; // increase 25%
        break;

      case Enum244.MORALE_NORMAL:
        break;

      case Enum244.MORALE_WORRIED:
        iDefense += iDefense / 4; // increase 25%
        break;

      case Enum244.MORALE_HOPELESS:
        iDefense += iDefense / 2; // increase 50%
        break;
    }

    // smart guys more likely to try to stay alive, dolts more likely to shoot!
    if (pSoldier.value.bWisdom >= 80)
      iDefense += 10;
    else if (pSoldier.value.bWisdom < 50)
      iDefense -= 10;

    // some orders are more offensive, others more defensive
    if (pSoldier.value.bOrders == Enum241.SEEKENEMY)
      iOffense += 10;
    else if ((pSoldier.value.bOrders == Enum241.STATIONARY) || (pSoldier.value.bOrders == Enum241.ONGUARD))
      iDefense += 10;

    switch (pSoldier.value.bAttitude) {
      case Enum242.DEFENSIVE:
        iDefense += 20;
        break;
      case Enum242.BRAVESOLO:
        iDefense -= 10;
        break;
      case Enum242.BRAVEAID:
        iDefense -= 10;
        break;
      case Enum242.CUNNINGSOLO:
        iDefense += 10;
        break;
      case Enum242.CUNNINGAID:
        iDefense += 10;
        break;
      case Enum242.AGGRESSIVE:
        iOffense += 20;
        break;
      case Enum242.ATTACKSLAYONLY:
        iOffense += 30;
        break;
    }

    // if his defensive instincts win out, forget all about the attack
    if (iDefense > iOffense)
      ubBestAttackAction = Enum289.AI_ACTION_NONE;
  }

  // if attack is still desirable (meaning it's also preferred to taking cover)
  if (ubBestAttackAction != Enum289.AI_ACTION_NONE) {
    // if we wanted to be REALLY mean, we could look at chance to hit and decide whether
    // to shoot at the head...

    fChangeStanceFirst = false;

    // default settings
    pSoldier.value.bAimTime = BestAttack.ubAimTime;
    pSoldier.value.bDoBurst = 0;

    if (ubBestAttackAction == Enum289.AI_ACTION_FIRE_GUN) {
      // Do we need to change stance?  NB We'll have to ready our gun again
      if (!TANK(pSoldier) && (pSoldier.value.bActionPoints - (BestAttack.ubAPCost - BestAttack.ubAimTime)) >= (AP_CROUCH + GetAPsToReadyWeapon(pSoldier, pSoldier.value.usAnimState))) {
        // since the AI considers shooting chance from standing primarily, if we are not
        // standing we should always consider a stance change
        if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_STAND) {
          iChance = 100;
        } else {
          iChance = 50;
          switch (pSoldier.value.bAttitude) {
            case Enum242.DEFENSIVE:
              iChance += 20;
              break;
            case Enum242.BRAVESOLO:
              iChance -= 10;
              break;
            case Enum242.BRAVEAID:
              iChance -= 10;
              break;
            case Enum242.CUNNINGSOLO:
              iChance += 10;
              break;
            case Enum242.CUNNINGAID:
              iChance += 10;
              break;
            case Enum242.AGGRESSIVE:
              iChance -= 20;
              break;
            case Enum242.ATTACKSLAYONLY:
              iChance -= 30;
              break;
          }
        }

        if (PreRandom(100) < iChance || GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, BestAttack.sTarget) <= MIN_PRONE_RANGE) {
          // first get the direction, as we will need to pass that in to ShootingStanceChange
          bDirection = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(BestAttack.sTarget), CenterY(BestAttack.sTarget));

          ubBestStance = ShootingStanceChange(pSoldier, addressof(BestAttack), bDirection);
          if (ubBestStance != 0) {
            // change stance first!
            if (pSoldier.value.bDirection != bDirection && InternalIsValidStance(pSoldier, bDirection, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
              // we're not facing towards him, so turn first!
              pSoldier.value.usActionData = bDirection;

              return Enum289.AI_ACTION_CHANGE_FACING;
            }

            //						pSoldier->usActionData = ubBestStance;

            // attack after we change stance
            // we don't just return here because we want to check whether to
            // burst first
            fChangeStanceFirst = true;

            // account for increased AP cost
            ubStanceCost = GetAPsToChangeStance(pSoldier, ubBestStance);
            if (BestAttack.ubAPCost + ubStanceCost > pSoldier.value.bActionPoints) {
              // AP cost would balance (plus X, minus X) but aim time is reduced
              BestAttack.ubAimTime -= (BestAttack.ubAimTime - ubStanceCost);
            } else {
              BestAttack.ubAPCost += GetAPsToChangeStance(pSoldier, ubBestStance);
            }
          }
        }
      }

      //////////////////////////////////////////////////////////////////////////
      // IF ENOUGH APs TO BURST, RANDOM CHANCE OF DOING SO
      //////////////////////////////////////////////////////////////////////////

      if (IsGunBurstCapable(pSoldier, BestAttack.bWeaponIn, false) && !(Menptr[BestShot.ubOpponent].bLife < OKLIFE) && // don't burst at downed targets
          pSoldier.value.inv[BestAttack.bWeaponIn].ubGunShotsLeft > 1 && (pSoldier.value.bTeam != gbPlayerNum || pSoldier.value.bRTPCombat == RTP_COMBAT_AGGRESSIVE)) {
        ubBurstAPs = CalcAPsToBurst(CalcActionPoints(pSoldier), addressof(pSoldier.value.inv[BestAttack.bWeaponIn]));

        if (pSoldier.value.bActionPoints - (BestAttack.ubAPCost - BestAttack.ubAimTime) >= ubBurstAPs) {
          // Base chance of bursting is 25% if best shot was +0 aim, down to 8% at +4
          if (TANK(pSoldier)) {
            iChance = 100;
          } else {
            iChance = (25 / (BestAttack.ubAimTime + 1));
            switch (pSoldier.value.bAttitude) {
              case Enum242.DEFENSIVE:
                iChance += -5;
                break;
              case Enum242.BRAVESOLO:
                iChance += 5;
                break;
              case Enum242.BRAVEAID:
                iChance += 5;
                break;
              case Enum242.CUNNINGSOLO:
                iChance += 0;
                break;
              case Enum242.CUNNINGAID:
                iChance += 0;
                break;
              case Enum242.AGGRESSIVE:
                iChance += 10;
                break;
              case Enum242.ATTACKSLAYONLY:
                iChance += 30;
                break;
            }
            // increase chance based on proximity and difficulty of enemy
            if (PythSpacesAway(pSoldier.value.sGridNo, BestAttack.sTarget) < 10) {
              iChance += (10 - PythSpacesAway(pSoldier.value.sGridNo, BestAttack.sTarget)) * (1 + SoldierDifficultyLevel(pSoldier));
              if (pSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY) {
                // increase it more!
                iChance += 5 * (10 - PythSpacesAway(pSoldier.value.sGridNo, BestAttack.sTarget));
              }
            }
          }

          if (PreRandom(100) < iChance) {
            BestAttack.ubAimTime = BURSTING;
            BestAttack.ubAPCost = BestAttack.ubAPCost - BestAttack.ubAimTime + CalcAPsToBurst(CalcActionPoints(pSoldier), addressof(pSoldier.value.inv[Enum261.HANDPOS]));
            // check for spread burst possibilities
            if (pSoldier.value.bAttitude != Enum242.ATTACKSLAYONLY) {
              CalcSpreadBurst(pSoldier, BestAttack.sTarget, BestAttack.bTargetLevel);
            }
          }
        }
      }

      //////////////////////////////////////////////////////////////////////////
      // IF NOT CROUCHED & WILL STILL HAVE ENOUGH APs TO DO THIS SAME BEST
      // ATTACK AFTER A STANCE CHANGE, CONSIDER CHANGING STANCE
      //////////////////////////////////////////////////////////////////////////

      if (BestAttack.ubAimTime == BURSTING) {
        pSoldier.value.bAimTime = 0;
        pSoldier.value.bDoBurst = 1;
      }

      /*
      else // defaults already set
      {
              pSoldier->bAimTime			= BestAttack.ubAimTime;
              pSoldier->bDoBurst			= 0;
      }
      */
    } else if (ubBestAttackAction == Enum289.AI_ACTION_THROW_KNIFE) {
      if (BestAttack.bWeaponIn != Enum261.HANDPOS && gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
        // we had better make sure we lower our gun first!

        pSoldier.value.bAction = Enum289.AI_ACTION_LOWER_GUN;
        pSoldier.value.usActionData = 0;

        // queue up attack for after we lower weapon if any
        pSoldier.value.bNextAction = Enum289.AI_ACTION_THROW_KNIFE;
        pSoldier.value.usNextActionData = BestAttack.sTarget;
        pSoldier.value.bNextTargetLevel = BestAttack.bTargetLevel;
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // OTHERWISE, JUST GO AHEAD & ATTACK!
    //////////////////////////////////////////////////////////////////////////

    // swap weapon to hand if necessary
    if (BestAttack.bWeaponIn != Enum261.HANDPOS) {
      RearrangePocket(pSoldier, Enum261.HANDPOS, BestAttack.bWeaponIn, FOREVER);
    }

    if (fChangeStanceFirst) {
      // currently only for guns...
      pSoldier.value.bNextAction = Enum289.AI_ACTION_FIRE_GUN;
      pSoldier.value.usNextActionData = BestAttack.sTarget;
      pSoldier.value.bNextTargetLevel = BestAttack.bTargetLevel;
      pSoldier.value.usActionData = ubBestStance;
      return Enum289.AI_ACTION_CHANGE_STANCE;
    } else {
      pSoldier.value.usActionData = BestAttack.sTarget;
      pSoldier.value.bTargetLevel = BestAttack.bTargetLevel;

      return ubBestAttackAction;
    }
  }

  // end of tank AI
  if (TANK(pSoldier)) {
    return Enum289.AI_ACTION_NONE;
  }

  // try to make boxer close if possible
  if (pSoldier.value.uiStatusFlags & SOLDIER_BOXER) {
    if (ubCanMove) {
      sClosestOpponent = ClosestSeenOpponent(pSoldier, null, null);
      if (sClosestOpponent != NOWHERE) {
        // temporarily make boxer have orders of CLOSEPATROL rather than STATIONARY
        // so he has a good roaming range
        pSoldier.value.bOrders = Enum241.CLOSEPATROL;
        pSoldier.value.usActionData = GoAsFarAsPossibleTowards(pSoldier, sClosestOpponent, Enum289.AI_ACTION_GET_CLOSER);
        pSoldier.value.bOrders = Enum241.STATIONARY;
        if (pSoldier.value.usActionData != NOWHERE) {
          // truncate path to 1 step
          pSoldier.value.usActionData = pSoldier.value.sGridNo + DirectionInc(pSoldier.value.usPathingData[0]);
          pSoldier.value.sFinalDestination = pSoldier.value.usActionData;
          pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
          return Enum289.AI_ACTION_GET_CLOSER;
        }
      }
    }
    // otherwise do nothing
    return Enum289.AI_ACTION_NONE;
  }

  ////////////////////////////////////////////////////////////////////////////
  // IF A LOCATION WITH BETTER COVER IS AVAILABLE & REACHABLE, GO FOR IT!
  ////////////////////////////////////////////////////////////////////////////

  if (sBestCover != NOWHERE) {
    // ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_TESTVERSION, L"AI %d taking cover, morale %d, from %d to %d", pSoldier->ubID, pSoldier->bAIMorale, pSoldier->sGridNo, sBestCover );
    pSoldier.value.usActionData = sBestCover;

    return Enum289.AI_ACTION_TAKE_COVER;
  }

  ////////////////////////////////////////////////////////////////////////////
  // IF THINGS ARE REALLY HOPELESS, OR UNARMED, TRY TO RUN AWAY
  ////////////////////////////////////////////////////////////////////////////

  // if soldier has enough APs left to move at least 1 square's worth
  if (ubCanMove && (pSoldier.value.bTeam != gbPlayerNum || pSoldier.value.fAIFlags & AI_RTP_OPTION_CAN_RETREAT)) {
    if ((pSoldier.value.bAIMorale == Enum244.MORALE_HOPELESS) || !bCanAttack) {
      // look for best place to RUN AWAY to (farthest from the closest threat)
      // pSoldier->usActionData = RunAway( pSoldier );
      pSoldier.value.usActionData = FindSpotMaxDistFromOpponents(pSoldier);

      if (pSoldier.value.usActionData != NOWHERE) {
        return Enum289.AI_ACTION_RUN_AWAY;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // IF SPOTTERS HAVE BEEN CALLED FOR, AND WE HAVE SOME NEW SIGHTINGS, RADIO!
  ////////////////////////////////////////////////////////////////////////////

  // if we're a computer merc, and we have the action points remaining to RADIO
  // (we never want NPCs to choose to radio if they would have to wait a turn)
  // and we're not swimming in deep water, and somebody has called for spotters
  // and we see the location of at least 2 opponents
  if ((gTacticalStatus.ubSpottersCalledForBy != NOBODY) && (pSoldier.value.bActionPoints >= AP_RADIO) && (pSoldier.value.bOppCnt > 1) && !fCivilian && (gTacticalStatus.Team[pSoldier.value.bTeam].bMenInSector > 1) && !bInDeepWater) {
    // base chance depends on how much new info we have to radio to the others
    iChance = 25 * WhatIKnowThatPublicDont(pSoldier, true); // just count them

    // if I actually know something they don't
    if (iChance) {
      if (PreRandom(100) < iChance) {
        return Enum289.AI_ACTION_RED_ALERT;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // CROUCH IF NOT CROUCHING ALREADY
  ////////////////////////////////////////////////////////////////////////////

  // if not in water and not already crouched, try to crouch down first
  if (!gfTurnBasedAI || GetAPsToChangeStance(pSoldier, ANIM_CROUCH) <= pSoldier.value.bActionPoints) {
    if (!fCivilian && !gfHiddenInterrupt && IsValidStance(pSoldier, ANIM_CROUCH)) {
      pSoldier.value.usActionData = StanceChange(pSoldier, BestAttack.ubAPCost);
      if (pSoldier.value.usActionData != 0) {
        if (pSoldier.value.usActionData == ANIM_PRONE) {
          // we might want to turn before lying down!
          if ((!gfTurnBasedAI || GetAPsToLook(pSoldier) <= pSoldier.value.bActionPoints - GetAPsToChangeStance(pSoldier, pSoldier.value.usActionData)) && (((pSoldier.value.bAIMorale > Enum244.MORALE_HOPELESS) || ubCanMove) && !AimingGun(pSoldier))) {
            // determine the location of the known closest opponent
            // (don't care if he's conscious, don't care if he's reachable at all)

            sClosestOpponent = ClosestSeenOpponent(pSoldier, null, null);
            // if we have a closest seen opponent
            if (sClosestOpponent != NOWHERE) {
              bDirection = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(sClosestOpponent), CenterY(sClosestOpponent));

              // if we're not facing towards him
              if (pSoldier.value.bDirection != bDirection) {
                if (InternalIsValidStance(pSoldier, bDirection, pSoldier.value.usActionData)) {
                  // change direction, THEN change stance!
                  pSoldier.value.bNextAction = Enum289.AI_ACTION_CHANGE_STANCE;
                  pSoldier.value.usNextActionData = pSoldier.value.usActionData;
                  pSoldier.value.usActionData = bDirection;
                  return Enum289.AI_ACTION_CHANGE_FACING;
                } else if ((pSoldier.value.usActionData == ANIM_PRONE) && (InternalIsValidStance(pSoldier, bDirection, ANIM_CROUCH))) {
                  // we shouldn't go prone, since we can't turn to shoot
                  pSoldier.value.usActionData = ANIM_CROUCH;
                  pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
                  return Enum289.AI_ACTION_CHANGE_STANCE;
                }
              }
              // else we are facing in the right direction
            }
            // else we don't know any enemies
          }

          // we don't want to turn
        }
        pSoldier.value.bNextAction = Enum289.AI_ACTION_END_TURN;
        return Enum289.AI_ACTION_CHANGE_STANCE;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // TURN TO FACE CLOSEST KNOWN OPPONENT (IF NOT FACING THERE ALREADY)
  ////////////////////////////////////////////////////////////////////////////

  if (!gfTurnBasedAI || GetAPsToLook(pSoldier) <= pSoldier.value.bActionPoints) {
    // hopeless guys shouldn't waste their time this way, UNLESS they CAN move
    // but chose not to to get this far (which probably means they're cornered)
    // ALSO, don't bother turning if we're already aiming a gun
    if (!gfHiddenInterrupt && ((pSoldier.value.bAIMorale > Enum244.MORALE_HOPELESS) || ubCanMove) && !AimingGun(pSoldier)) {
      // determine the location of the known closest opponent
      // (don't care if he's conscious, don't care if he's reachable at all)

      sClosestOpponent = ClosestSeenOpponent(pSoldier, null, null);
      // if we have a closest reachable opponent
      if (sClosestOpponent != NOWHERE) {
        bDirection = atan8(CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), CenterX(sClosestOpponent), CenterY(sClosestOpponent));

        // if we're not facing towards him
        if (pSoldier.value.bDirection != bDirection && InternalIsValidStance(pSoldier, bDirection, gAnimControl[pSoldier.value.usAnimState].ubEndHeight)) {
          pSoldier.value.usActionData = bDirection;

          return Enum289.AI_ACTION_CHANGE_FACING;
        }
      }
    }
  }

  // if a militia has absofreaking nothing else to do, maybe they should radio in a report!

  ////////////////////////////////////////////////////////////////////////////
  // RADIO RED ALERT: determine %chance to call others and report contact
  ////////////////////////////////////////////////////////////////////////////

  if (pSoldier.value.bTeam == MILITIA_TEAM && (pSoldier.value.bActionPoints >= AP_RADIO) && (gTacticalStatus.Team[pSoldier.value.bTeam].bMenInSector > 1)) {
    // if there hasn't been an initial RED ALERT yet in this sector
    if (!(gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition) || NeedToRadioAboutPanicTrigger())
      // since I'm at STATUS RED, I obviously know we're being invaded!
      iChance = gbDiff[DIFF_RADIO_RED_ALERT][SoldierDifficultyLevel(pSoldier)];
    else // subsequent radioing (only to update enemy positions, request help)
      // base chance depends on how much new info we have to radio to the others
      iChance = 10 * WhatIKnowThatPublicDont(pSoldier, false); // use 10 * for RED alert

    // if I actually know something they don't and I ain't swimming (deep water)
    if (iChance && !bInDeepWater) {
      // modify base chance according to orders
      switch (pSoldier.value.bOrders) {
        case Enum241.STATIONARY:
          iChance += 20;
          break;
        case Enum241.ONGUARD:
          iChance += 15;
          break;
        case Enum241.ONCALL:
          iChance += 10;
          break;
        case Enum241.CLOSEPATROL:
          break;
        case Enum241.RNDPTPATROL:
        case Enum241.POINTPATROL:
          iChance += -5;
          break;
        case Enum241.FARPATROL:
          iChance += -10;
          break;
        case Enum241.SEEKENEMY:
          iChance += -20;
          break;
      }

      // modify base chance according to attitude
      switch (pSoldier.value.bAttitude) {
        case Enum242.DEFENSIVE:
          iChance += 20;
          break;
        case Enum242.BRAVESOLO:
          iChance += -10;
          break;
        case Enum242.BRAVEAID:
          break;
        case Enum242.CUNNINGSOLO:
          iChance += -5;
          break;
        case Enum242.CUNNINGAID:
          break;
        case Enum242.AGGRESSIVE:
          iChance += -20;
          break;
        case Enum242.ATTACKSLAYONLY:
          iChance = 0;
      }

      if (gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition) {
        // ignore morale (which could be really high)
      } else {
        // modify base chance according to morale
        switch (pSoldier.value.bAIMorale) {
          case Enum244.MORALE_HOPELESS:
            iChance *= 3;
            break;
          case Enum244.MORALE_WORRIED:
            iChance *= 2;
            break;
          case Enum244.MORALE_NORMAL:
            break;
          case Enum244.MORALE_CONFIDENT:
            iChance /= 2;
            break;
          case Enum244.MORALE_FEARLESS:
            iChance /= 3;
            break;
        }
      }

      // reduce chance because we're in combat
      iChance /= 2;

      if (PreRandom(100) < iChance) {
        return Enum289.AI_ACTION_RED_ALERT;
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // LEAVE THE SECTOR
  ////////////////////////////////////////////////////////////////////////////

  // NOT IMPLEMENTED

  ////////////////////////////////////////////////////////////////////////////
  // DO NOTHING: Not enough points left to move, so save them for next turn
  ////////////////////////////////////////////////////////////////////////////

  // by default, if everything else fails, just stand in place and wait
  pSoldier.value.usActionData = NOWHERE;
  return Enum289.AI_ACTION_NONE;
}

export function DecideAction(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let bAction: INT8 = Enum289.AI_ACTION_NONE;

  // turn off cautious flag
  pSoldier.value.fAIFlags &= (~AI_CAUTIOUS);

  // NumMessage("DecideAction - Guy#",pSoldier->ubID);

  // if the NPC is being "ESCORTED" (seen civilians only for now)
  if (pSoldier.value.bUnderEscort) {
    // bAction = DecideActionEscort(pSoldier);
  } else // "normal" NPC AI
  {
    // if status over-ride is set, bypass RED/YELLOW and go directly to GREEN!
    if ((pSoldier.value.bBypassToGreen) && (pSoldier.value.bAlertStatus < Enum243.STATUS_BLACK)) {
      bAction = DecideActionGreen(pSoldier);
      if (!gfTurnBasedAI) {
        // reset bypass now
        pSoldier.value.bBypassToGreen = 0;
      }
    } else {
      switch (pSoldier.value.bAlertStatus) {
        case Enum243.STATUS_GREEN:
          bAction = DecideActionGreen(pSoldier);
          break;

        case Enum243.STATUS_YELLOW:
          bAction = DecideActionYellow(pSoldier);
          break;

        case Enum243.STATUS_RED:
          bAction = DecideActionRed(pSoldier, true);
          break;

        case Enum243.STATUS_BLACK:
          bAction = DecideActionBlack(pSoldier);
          break;
      }
    }
  }

  return bAction;
}

function DecideActionEscort(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  // if he has a place to go, and isn't already there... go!
  if (pSoldier.value.usActionData != NOWHERE && (pSoldier.value.sGridNo != pSoldier.value.usActionData)) {
    return Enum289.AI_ACTION_ESCORTED_MOVE;
  } else
    return Enum289.AI_ACTION_NONE;
}

export function DecideAlertStatus(pSoldier: Pointer<SOLDIERTYPE>): void {
  let bOldStatus: INT8;
  let iDummy: INT32;
  let fClimbDummy: boolean;
  let fReachableDummy: boolean;

  // THE FOUR (4) POSSIBLE ALERT STATUSES ARE:
  // GREEN - No one seen, no suspicious noise heard, go about regular duties
  // YELLOW - Suspicious noise was heard personally or radioed in by buddy
  // RED - Either saw opponents in person, or definite contact had been radioed
  // BLACK - Currently has one or more opponents in sight

  // save the man's previous status

  if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
    CreatureDecideAlertStatus(pSoldier);
    return;
  }

  bOldStatus = pSoldier.value.bAlertStatus;

  // determine the current alert status for this category of man
  // if (!(pSoldier->uiStatusFlags & SOLDIER_PC))
  {
    if (pSoldier.value.bOppCnt > 0) // opponent(s) in sight
    {
      pSoldier.value.bAlertStatus = Enum243.STATUS_BLACK;
      CheckForChangingOrders(pSoldier);
    } else // no opponents are in sight
    {
      switch (bOldStatus) {
        case Enum243.STATUS_BLACK:
          // then drop back to RED status
          pSoldier.value.bAlertStatus = Enum243.STATUS_RED;
          break;

        case Enum243.STATUS_RED:
          // RED can never go back down below RED, only up to BLACK
          break;

        case Enum243.STATUS_YELLOW:
          // if all enemies have been RED alerted, or we're under fire
          if (!PTR_CIVILIAN() && (gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition || pSoldier.value.bUnderFire)) {
            pSoldier.value.bAlertStatus = Enum243.STATUS_RED;
          } else {
            // if we are NOT aware of any uninvestigated noises right now
            // and we are not currently in the middle of an action
            // (could still be on his way heading to investigate a noise!)
            if ((MostImportantNoiseHeard(pSoldier, addressof(iDummy), addressof(fClimbDummy), addressof(fReachableDummy)) == NOWHERE) && !pSoldier.value.bActionInProgress) {
              // then drop back to GREEN status
              pSoldier.value.bAlertStatus = Enum243.STATUS_GREEN;
              CheckForChangingOrders(pSoldier);
            }
          }
          break;

        case Enum243.STATUS_GREEN:
          // if all enemies have been RED alerted, or we're under fire
          if (!PTR_CIVILIAN() && (gTacticalStatus.Team[pSoldier.value.bTeam].bAwareOfOpposition || pSoldier.value.bUnderFire)) {
            pSoldier.value.bAlertStatus = Enum243.STATUS_RED;
          } else {
            // if we ARE aware of any uninvestigated noises right now
            if (MostImportantNoiseHeard(pSoldier, addressof(iDummy), addressof(fClimbDummy), addressof(fReachableDummy)) != NOWHERE) {
              // then move up to YELLOW status
              pSoldier.value.bAlertStatus = Enum243.STATUS_YELLOW;
            }
          }
          break;
      }
      // otherwise, RED stays RED, YELLOW stays YELLOW, GREEN stays GREEN
    }
  }

  if (gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) {
    // if the man's alert status has changed in any way
    if (pSoldier.value.bAlertStatus != bOldStatus) {
      // HERE ARE TRYING TO AVOID NPCs SHUFFLING BACK & FORTH BETWEEN RED & BLACK
      // if either status is < RED (ie. anything but RED->BLACK && BLACK->RED)
      if ((bOldStatus < Enum243.STATUS_RED) || (pSoldier.value.bAlertStatus < Enum243.STATUS_RED)) {
        // force a NEW action decision on next pass through HandleManAI()
        SetNewSituation(pSoldier);
      }

      // if this guy JUST discovered that there were opponents here for sure...
      if ((bOldStatus < Enum243.STATUS_RED) && (pSoldier.value.bAlertStatus >= Enum243.STATUS_RED)) {
        CheckForChangingOrders(pSoldier);
      }
    } else // status didn't change
    {
      // only do this stuff in TB
      // if a guy on status GREEN or YELLOW is running low on breath
      if (((pSoldier.value.bAlertStatus == Enum243.STATUS_GREEN) && (pSoldier.value.bBreath < 75)) || ((pSoldier.value.bAlertStatus == Enum243.STATUS_YELLOW) && (pSoldier.value.bBreath < 50))) {
        // as long as he's not in water (standing on a bridge is OK)
        if (!MercInWater(pSoldier)) {
          // force a NEW decision so that he can get some rest
          SetNewSituation(pSoldier);

          // current action will be canceled. if noise is no longer important
          if ((pSoldier.value.bAlertStatus == Enum243.STATUS_YELLOW) && (MostImportantNoiseHeard(pSoldier, addressof(iDummy), addressof(fClimbDummy), addressof(fReachableDummy)) == NOWHERE)) {
            // then drop back to GREEN status
            pSoldier.value.bAlertStatus = Enum243.STATUS_GREEN;
            CheckForChangingOrders(pSoldier);
          }
        }
      }
    }
  }
}

}
