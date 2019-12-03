namespace ja2 {

function RTPlayerDecideAction(pSoldier: SOLDIERTYPE): INT8 {
  let bAction: INT8 = Enum289.AI_ACTION_NONE;

  if (gTacticalStatus.fAutoBandageMode) {
    bAction = DecideAutoBandage(pSoldier);
  } else {
    bAction = DecideAction(pSoldier);
  }

  return bAction;
}

function RTDecideAction(pSoldier: SOLDIERTYPE): INT8 {
  if (CREATURE_OR_BLOODCAT(pSoldier)) {
    return CreatureDecideAction(pSoldier);
  } else if (pSoldier.ubBodyType == Enum194.CROW) {
    return CrowDecideAction(pSoldier);
  } else if (pSoldier.bTeam == gbPlayerNum) {
    return RTPlayerDecideAction(pSoldier);
  } else {
    // handle traversal
    if ((pSoldier.ubProfile != NO_PROFILE) && (gMercProfiles[pSoldier.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_HANDLE_DONE_TRAVERSAL)) {
      TriggerNPCWithGivenApproach(pSoldier.ubProfile, Enum296.APPROACH_DONE_TRAVERSAL, false);
      gMercProfiles[pSoldier.ubProfile].ubMiscFlags3 &= (~PROFILE_MISC_FLAG3_HANDLE_DONE_TRAVERSAL);
      pSoldier.ubQuoteActionID = 0;
      // wait a tiny bit
      pSoldier.usActionData = 100;
      return Enum289.AI_ACTION_WAIT;
    }

    return DecideAction(pSoldier);
  }
}

export function RealtimeDelay(pSoldier: SOLDIERTYPE): UINT16 {
  if (PTR_CIV_OR_MILITIA(pSoldier) && !(pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP)) {
    return REALTIME_CIV_AI_DELAY();
  } else if (CREATURE_OR_BLOODCAT(pSoldier) && !(pSoldier.bHunting)) {
    return REALTIME_CREATURE_AI_DELAY();
  } else {
    if (pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP) {
      let ubRoom: UINT8;

      if ((ubRoom = InARoom(pSoldier.sGridNo)) !== -1 && IN_BROTHEL(ubRoom)) {
        return (REALTIME_AI_DELAY() / 3);
      }
    }

    return REALTIME_AI_DELAY();
  }
}

export function RTHandleAI(pSoldier: SOLDIERTYPE): void {
  if ((pSoldier.bAction != Enum289.AI_ACTION_NONE) && pSoldier.bActionInProgress) {
    // if action should remain in progress
    if (ActionInProgress(pSoldier)) {
      // let it continue
      return;
    }
  }

  // if man has nothing to do
  if (pSoldier.bAction == Enum289.AI_ACTION_NONE) {
    if (pSoldier.bNextAction == Enum289.AI_ACTION_NONE) {
      // make sure this flag is turned off (it already should be!)
      pSoldier.bActionInProgress = false;

      // truly nothing to do!
      RefreshAI(pSoldier);
    }

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
    pSoldier.bPathStored = false;

    // decide on the next action
    {
      if (pSoldier.bNextAction != Enum289.AI_ACTION_NONE) {
        if (pSoldier.bNextAction == Enum289.AI_ACTION_END_COWER_AND_MOVE) {
          if (pSoldier.uiStatusFlags & SOLDIER_COWERING) {
            pSoldier.bAction = Enum289.AI_ACTION_STOP_COWERING;
            pSoldier.usActionData = ANIM_STAND;
          } else if (gAnimControl[pSoldier.usAnimState].ubEndHeight < ANIM_STAND) {
            // stand up!
            pSoldier.bAction = Enum289.AI_ACTION_CHANGE_STANCE;
            pSoldier.usActionData = ANIM_STAND;
          } else {
            pSoldier.bAction = Enum289.AI_ACTION_NONE;
          }
          if (pSoldier.sGridNo == pSoldier.usNextActionData) {
            // no need to walk after this
            pSoldier.bNextAction = Enum289.AI_ACTION_NONE;
            pSoldier.usNextActionData = NOWHERE;
          } else {
            pSoldier.bNextAction = Enum289.AI_ACTION_WALK;
            // leave next-action-data as is since that's where we want to go
          }
        } else {
          // do the next thing we have to do...
          pSoldier.bAction = pSoldier.bNextAction;
          pSoldier.usActionData = pSoldier.usNextActionData;
          pSoldier.bTargetLevel = pSoldier.bNextTargetLevel;
          pSoldier.bNextAction = Enum289.AI_ACTION_NONE;
          pSoldier.usNextActionData = 0;
          pSoldier.bNextTargetLevel = 0;
        }
        if (pSoldier.bAction == Enum289.AI_ACTION_PICKUP_ITEM) {
          // the item pool index was stored in the special data field
          pSoldier.uiPendingActionData1 = pSoldier.iNextActionSpecialData;
        }
      } else if (pSoldier.sAbsoluteFinalDestination != NOWHERE) {
        if (ACTING_ON_SCHEDULE(pSoldier)) {
          pSoldier.bAction = Enum289.AI_ACTION_SCHEDULE_MOVE;
        } else {
          pSoldier.bAction = Enum289.AI_ACTION_WALK;
        }
        pSoldier.usActionData = pSoldier.sAbsoluteFinalDestination;
      } else {
        if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
          pSoldier.bAction = RTDecideAction(pSoldier);
        }
      }
    }
    // if he chose to continue doing nothing
    if (pSoldier.bAction == Enum289.AI_ACTION_NONE) {
      // do a standard wait before doing anything else!
      pSoldier.bAction = Enum289.AI_ACTION_WAIT;
      // if (PTR_CIVILIAN && pSoldier->bAlertStatus != STATUS_BLACK)
      if (PTR_CIV_OR_MILITIA(pSoldier) && !(pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP)) {
        pSoldier.usActionData = REALTIME_CIV_AI_DELAY();
      } else if (CREATURE_OR_BLOODCAT(pSoldier) && !(pSoldier.bHunting)) {
        pSoldier.usActionData = REALTIME_CREATURE_AI_DELAY();
      } else {
        pSoldier.usActionData = REALTIME_AI_DELAY();
        if (pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP) {
          let ubRoom: UINT8;

          if ((ubRoom = InARoom(pSoldier.sGridNo)) !== -1 && IN_BROTHEL(ubRoom)) {
            pSoldier.usActionData /= 3;
          }
        }
      }
    } else if (pSoldier.bAction == Enum289.AI_ACTION_ABSOLUTELY_NONE) {
      pSoldier.bAction = Enum289.AI_ACTION_NONE;
    }
  }

  // to get here, we MUST have an action selected, but not in progress...
  NPCDoesAct(pSoldier);

  // perform the chosen action
  pSoldier.bActionInProgress = ExecuteAction(pSoldier); // if started, mark us as busy
}

}
