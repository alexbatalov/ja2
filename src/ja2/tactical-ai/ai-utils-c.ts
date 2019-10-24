//
// CJC's DG->JA2 conversion notes
//
// Commented out:
//
// InWaterOrGas - gas stuff
// RoamingRange - point patrol stuff

let Urgency: UINT8[][] /* [NUM_STATUS_STATES][NUM_MORALE_STATES] */ = [
  [ Enum292.URGENCY_LOW, Enum292.URGENCY_LOW, Enum292.URGENCY_LOW, Enum292.URGENCY_LOW, Enum292.URGENCY_LOW ], // green
  [ Enum292.URGENCY_HIGH, Enum292.URGENCY_MED, Enum292.URGENCY_MED, Enum292.URGENCY_LOW, Enum292.URGENCY_LOW ], // yellow
  [ Enum292.URGENCY_HIGH, Enum292.URGENCY_MED, Enum292.URGENCY_MED, Enum292.URGENCY_MED, Enum292.URGENCY_MED ], // red
  [ Enum292.URGENCY_HIGH, Enum292.URGENCY_HIGH, Enum292.URGENCY_HIGH, Enum292.URGENCY_MED, Enum292.URGENCY_MED ], // black
];

let MovementMode: UINT16[][] /* [LAST_MOVEMENT_ACTION + 1][NUM_URGENCY_STATES] */ = [
  [ Enum193.WALKING, Enum193.WALKING, Enum193.WALKING ], // AI_ACTION_NONE

  [ Enum193.WALKING, Enum193.WALKING, Enum193.WALKING ], // AI_ACTION_RANDOM_PATROL
  [ Enum193.WALKING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_SEEK_FRIEND
  [ Enum193.WALKING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_SEEK_OPPONENT
  [ Enum193.RUNNING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_TAKE_COVER
  [ Enum193.WALKING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_GET_CLOSER

  [ Enum193.WALKING, Enum193.WALKING, Enum193.WALKING ], // AI_ACTION_POINT_PATROL,
  [ Enum193.WALKING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_LEAVE_WATER_GAS,
  [ Enum193.WALKING, Enum193.SWATTING, Enum193.RUNNING ], // AI_ACTION_SEEK_NOISE,
  [ Enum193.RUNNING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_ESCORTED_MOVE,
  [ Enum193.WALKING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_RUN_AWAY,

  [ Enum193.RUNNING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_KNIFE_MOVE
  [ Enum193.WALKING, Enum193.WALKING, Enum193.WALKING ], // AI_ACTION_APPROACH_MERC
  [ Enum193.RUNNING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_TRACK
  [ Enum193.RUNNING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_EAT
  [ Enum193.WALKING, Enum193.RUNNING, Enum193.SWATTING ], // AI_ACTION_PICKUP_ITEM

  [ Enum193.WALKING, Enum193.WALKING, Enum193.WALKING ], // AI_ACTION_SCHEDULE_MOVE
  [ Enum193.WALKING, Enum193.WALKING, Enum193.WALKING ], // AI_ACTION_WALK
  [ Enum193.RUNNING, Enum193.RUNNING, Enum193.RUNNING ], // AI_ACTION_MOVE_TO_CLIMB
];

function OKToAttack(pSoldier: Pointer<SOLDIERTYPE>, target: int): INT8 {
  // can't shoot yourself
  if (target == pSoldier.value.sGridNo)
    return NOSHOOT_MYSELF;

  if (WaterTooDeepForAttacks(pSoldier.value.sGridNo))
    return NOSHOOT_WATER;

  // make sure a weapon is in hand (FEB.8 ADDITION: tossable items are also OK)
  if (!WeaponInHand(pSoldier)) {
    return NOSHOOT_NOWEAPON;
  }

  // JUST PUT THIS IN ON JULY 13 TO TRY AND FIX OUT-OF-AMMO SITUATIONS

  if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN) {
    if (pSoldier.value.inv[Enum261.HANDPOS].usItem == Enum225.TANK_CANNON) {
      // look for another tank shell ELSEWHERE IN INVENTORY
      if (FindLaunchable(pSoldier, Enum225.TANK_CANNON) == NO_SLOT)
      // if ( !ItemHasAttachments( &(pSoldier->inv[HANDPOS]) ) )
      {
        return NOSHOOT_NOLOAD;
      }
    } else if (pSoldier.value.inv[Enum261.HANDPOS].ubGunShotsLeft == 0) {
      return NOSHOOT_NOAMMO;
    }
  } else if (Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_LAUNCHER) {
    if (FindLaunchable(pSoldier, pSoldier.value.inv[Enum261.HANDPOS].usItem) == NO_SLOT)
    // if ( !ItemHasAttachments( &(pSoldier->inv[HANDPOS]) ) )
    {
      return NOSHOOT_NOLOAD;
    }
  }

  return TRUE;
}

function ConsiderProne(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let sOpponentGridNo: INT16;
  let bOpponentLevel: INT8;
  let iRange: INT32;

  if (pSoldier.value.bAIMorale >= Enum244.MORALE_NORMAL) {
    return FALSE;
  }
  // We don't want to go prone if there is a nearby enemy
  ClosestKnownOpponent(pSoldier, addressof(sOpponentGridNo), addressof(bOpponentLevel));
  iRange = GetRangeFromGridNoDiff(pSoldier.value.sGridNo, sOpponentGridNo);
  if (iRange > 10) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function StanceChange(pSoldier: Pointer<SOLDIERTYPE>, ubAttackAPCost: UINT8): UINT8 {
  // consider crouching or going prone

  if (PTR_STANDING()) {
    if (pSoldier.value.bActionPoints - ubAttackAPCost >= AP_CROUCH) {
      if ((pSoldier.value.bActionPoints - ubAttackAPCost >= AP_CROUCH + AP_PRONE) && IsValidStance(pSoldier, ANIM_PRONE) && ConsiderProne(pSoldier)) {
        return ANIM_PRONE;
      } else if (IsValidStance(pSoldier, ANIM_CROUCH)) {
        return ANIM_CROUCH;
      }
    }
  } else if (PTR_CROUCHED()) {
    if ((pSoldier.value.bActionPoints - ubAttackAPCost >= AP_PRONE) && IsValidStance(pSoldier, ANIM_PRONE) && ConsiderProne(pSoldier)) {
      return ANIM_PRONE;
    }
  }
  return 0;
}

function ShootingStanceChange(pSoldier: Pointer<SOLDIERTYPE>, pAttack: Pointer<ATTACKTYPE>, bDesiredDirection: INT8): UINT8 {
  // Figure out the best stance for this attack

  // We don't want to go through a lot of complex calculations here,
  // just compare the chance of the bullet hitting if we are
  // standing, crouched, or prone

  let usRealAnimState: UINT16;
  let usBestAnimState: UINT16;
  let bBestStanceDiff: INT8 = -1;
  let bLoop: INT8;
  let bStanceNum: INT8;
  let bStanceDiff: INT8;
  let bAPsAfterAttack: INT8;
  let uiChanceOfDamage: UINT32;
  let uiBestChanceOfDamage: UINT32;
  let uiCurrChanceOfDamage: UINT32;
  let uiStanceBonus: UINT32;
  let uiMinimumStanceBonusPerChange: UINT32 = 20 - 3 * pAttack.value.ubAimTime;
  let iRange: INT32;

  bStanceNum = 0;
  uiCurrChanceOfDamage = 0;

  bAPsAfterAttack = pSoldier.value.bActionPoints - pAttack.value.ubAPCost - GetAPsToReadyWeapon(pSoldier, pSoldier.value.usAnimState);
  if (bAPsAfterAttack < AP_CROUCH) {
    return 0;
  }
  // Unfortunately, to get this to work, we have to fake the AI guy's
  // animation state so we get the right height values
  usRealAnimState = pSoldier.value.usAnimState;
  usBestAnimState = pSoldier.value.usAnimState;
  uiBestChanceOfDamage = 0;
  iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, pAttack.value.sTarget);

  switch (gAnimControl[usRealAnimState].ubEndHeight) {
    // set a stance number comparable with our loop variable so we can easily compute
    // stance differences and thus AP cost
    case ANIM_STAND:
      bStanceNum = 0;
      break;
    case ANIM_CROUCH:
      bStanceNum = 1;
      break;
    case ANIM_PRONE:
      bStanceNum = 2;
      break;
  }
  for (bLoop = 0; bLoop < 3; bLoop++) {
    bStanceDiff = abs(bLoop - bStanceNum);
    if (bStanceDiff == 2 && bAPsAfterAttack < AP_CROUCH + AP_PRONE) {
      // can't consider this!
      continue;
    }

    switch (bLoop) {
      case 0:
        if (!InternalIsValidStance(pSoldier, bDesiredDirection, ANIM_STAND)) {
          continue;
        }
        pSoldier.value.usAnimState = Enum193.STANDING;
        break;
      case 1:
        if (!InternalIsValidStance(pSoldier, bDesiredDirection, ANIM_CROUCH)) {
          continue;
        }
        pSoldier.value.usAnimState = Enum193.CROUCHING;
        break;
      default:
        if (!InternalIsValidStance(pSoldier, bDesiredDirection, ANIM_PRONE)) {
          continue;
        }
        pSoldier.value.usAnimState = Enum193.PRONE;
        break;
    }

    uiChanceOfDamage = SoldierToLocationChanceToGetThrough(pSoldier, pAttack.value.sTarget, pSoldier.value.bTargetLevel, pSoldier.value.bTargetCubeLevel, pAttack.value.ubOpponent) * CalcChanceToHitGun(pSoldier, pAttack.value.sTarget, pAttack.value.ubAimTime, AIM_SHOT_TORSO) / 100;
    if (uiChanceOfDamage > 0) {
      uiStanceBonus = 0;
      // artificially augment "chance of damage" to reflect penalty to be shot at various stances
      switch (pSoldier.value.usAnimState) {
        case Enum193.CROUCHING:
          if (iRange > POINT_BLANK_RANGE + 10 * (AIM_PENALTY_TARGET_CROUCHED / 3)) {
            uiStanceBonus = AIM_BONUS_CROUCHING;
          } else if (iRange > POINT_BLANK_RANGE) {
            // reduce chance to hit with distance to the prone/immersed target
            uiStanceBonus = 3 * ((iRange - POINT_BLANK_RANGE) / CELL_X_SIZE); // penalty -3%/tile
          }
          break;
        case Enum193.PRONE:
          if (iRange <= MIN_PRONE_RANGE) {
            // HATE being prone this close!
            uiChanceOfDamage = 0;
          } else // if (iRange > POINT_BLANK_RANGE)
          {
            // reduce chance to hit with distance to the prone/immersed target
            uiStanceBonus = 3 * ((iRange - POINT_BLANK_RANGE) / CELL_X_SIZE); // penalty -3%/tile
          }
          break;
        default:
          break;
      }
      // reduce stance bonus according to how much we have to change stance to get there
      // uiStanceBonus = uiStanceBonus * (4 - bStanceDiff) / 4;
      uiChanceOfDamage += uiStanceBonus;
    }

    if (bStanceDiff == 0) {
      uiCurrChanceOfDamage = uiChanceOfDamage;
    }
    if (uiChanceOfDamage > uiBestChanceOfDamage) {
      uiBestChanceOfDamage = uiChanceOfDamage;
      usBestAnimState = pSoldier.value.usAnimState;
      bBestStanceDiff = bStanceDiff;
    }
  }

  pSoldier.value.usAnimState = usRealAnimState;

  // return 0 or the best height value to be at
  if (bBestStanceDiff == 0 || ((uiBestChanceOfDamage - uiCurrChanceOfDamage) / bBestStanceDiff) < uiMinimumStanceBonusPerChange) {
    // better off not changing our stance!
    return 0;
  } else {
    return gAnimControl[usBestAnimState].ubEndHeight;
  }
}

function DetermineMovementMode(pSoldier: Pointer<SOLDIERTYPE>, bAction: INT8): UINT16 {
  if (pSoldier.value.fUIMovementFast) {
    return Enum193.RUNNING;
  } else if (CREATURE_OR_BLOODCAT(pSoldier)) {
    if (pSoldier.value.bAlertStatus == Enum243.STATUS_GREEN) {
      return Enum193.WALKING;
    } else {
      return Enum193.RUNNING;
    }
  } else if (pSoldier.value.ubBodyType == Enum194.COW || pSoldier.value.ubBodyType == Enum194.CROW) {
    return Enum193.WALKING;
  } else {
    if ((pSoldier.value.fAIFlags & AI_CAUTIOUS) && (MovementMode[bAction][Urgency[pSoldier.value.bAlertStatus][pSoldier.value.bAIMorale]] == Enum193.RUNNING)) {
      return Enum193.WALKING;
    } else if (bAction == Enum289.AI_ACTION_SEEK_NOISE && pSoldier.value.bTeam == CIV_TEAM && !IS_MERC_BODY_TYPE(pSoldier)) {
      return Enum193.WALKING;
    } else if ((pSoldier.value.ubBodyType == Enum194.HATKIDCIV || pSoldier.value.ubBodyType == Enum194.KIDCIV) && (pSoldier.value.bAlertStatus == Enum243.STATUS_GREEN) && Random(10) == 0) {
      return Enum193.KID_SKIPPING;
    } else {
      return MovementMode[bAction][Urgency[pSoldier.value.bAlertStatus][pSoldier.value.bAIMorale]];
    }
  }
}

function NewDest(pSoldier: Pointer<SOLDIERTYPE>, usGridNo: UINT16): void {
  // ATE: Setting sDestination? Tis does not make sense...
  // pSoldier->sDestination = usGridNo;
  let fSet: BOOLEAN = FALSE;

  if (IS_MERC_BODY_TYPE(pSoldier) && pSoldier.value.bAction == Enum289.AI_ACTION_TAKE_COVER && (pSoldier.value.bOrders == Enum242.DEFENSIVE || pSoldier.value.bOrders == Enum242.CUNNINGSOLO || pSoldier.value.bOrders == Enum242.CUNNINGAID) && (SoldierDifficultyLevel(pSoldier) >= 2)) {
    let usMovementMode: UINT16;

    // getting real movement anim for someone who is going to take cover, not just considering
    usMovementMode = MovementMode[Enum289.AI_ACTION_TAKE_COVER][Urgency[pSoldier.value.bAlertStatus][pSoldier.value.bAIMorale]];
    if (usMovementMode != Enum193.SWATTING) {
      // really want to look at path, see how far we could get on path while swatting
      if (EnoughPoints(pSoldier, RecalculatePathCost(pSoldier, Enum193.SWATTING), 0, FALSE) || (pSoldier.value.bLastAction == Enum289.AI_ACTION_TAKE_COVER && pSoldier.value.usUIMovementMode == Enum193.SWATTING)) {
        pSoldier.value.usUIMovementMode = Enum193.SWATTING;
      } else {
        pSoldier.value.usUIMovementMode = usMovementMode;
      }
    } else {
      pSoldier.value.usUIMovementMode = usMovementMode;
    }
    fSet = TRUE;
  } else {
    if (pSoldier.value.bTeam == ENEMY_TEAM && pSoldier.value.bAlertStatus == Enum243.STATUS_RED) {
      switch (pSoldier.value.bAction) {
        /*
        case AI_ACTION_MOVE_TO_CLIMB:
        case AI_ACTION_RUN_AWAY:
                pSoldier->usUIMovementMode = DetermineMovementMode( pSoldier, pSoldier->bAction );
                fSet = TRUE;
                break;*/
        default:
          if (PreRandom(5 - SoldierDifficultyLevel(pSoldier)) == 0) {
            let sClosestNoise: INT16 = MostImportantNoiseHeard(pSoldier, NULL, NULL, NULL);
            if (sClosestNoise != NOWHERE && PythSpacesAway(pSoldier.value.sGridNo, sClosestNoise) < MaxDistanceVisible() + 10) {
              pSoldier.value.usUIMovementMode = Enum193.SWATTING;
              fSet = TRUE;
            }
          }
          if (!fSet) {
            pSoldier.value.usUIMovementMode = DetermineMovementMode(pSoldier, pSoldier.value.bAction);
            fSet = TRUE;
          }
          break;
      }
    } else {
      pSoldier.value.usUIMovementMode = DetermineMovementMode(pSoldier, pSoldier.value.bAction);
      fSet = TRUE;
    }

    if (pSoldier.value.usUIMovementMode == Enum193.SWATTING && !IS_MERC_BODY_TYPE(pSoldier)) {
      pSoldier.value.usUIMovementMode = Enum193.WALKING;
    }
  }

  // EVENT_GetNewSoldierPath( pSoldier, pSoldier->sDestination, pSoldier->usUIMovementMode );
  // ATE: Using this more versitile version
  // Last paramater says whether to re-start the soldier's animation
  // This should be done if buddy was paused for fNoApstofinishMove...
  EVENT_InternalGetNewSoldierPath(pSoldier, usGridNo, pSoldier.value.usUIMovementMode, FALSE, pSoldier.value.fNoAPToFinishMove);
}

function IsActionAffordable(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let bMinPointsNeeded: INT8 = 0;

  // NumMessage("AffordableAction - Guy#",pSoldier->ubID);

  switch (pSoldier.value.bAction) {
    case Enum289.AI_ACTION_NONE: // maintain current position & facing
      // no cost for doing nothing!
      break;

    case Enum289.AI_ACTION_CHANGE_FACING: // turn to face another direction
      bMinPointsNeeded = GetAPsToLook(pSoldier);
      break;

    case Enum289.AI_ACTION_RANDOM_PATROL: // move towards a particular location
    case Enum289.AI_ACTION_SEEK_FRIEND: // move towards friend in trouble
    case Enum289.AI_ACTION_SEEK_OPPONENT: // move towards a reported opponent
    case Enum289.AI_ACTION_TAKE_COVER: // run for nearest cover from threat
    case Enum289.AI_ACTION_GET_CLOSER: // move closer to a strategic location
    case Enum289.AI_ACTION_POINT_PATROL: // move towards next patrol point
    case Enum289.AI_ACTION_LEAVE_WATER_GAS: // seek nearest spot of ungassed land
    case Enum289.AI_ACTION_SEEK_NOISE: // seek most important noise heard
    case Enum289.AI_ACTION_ESCORTED_MOVE: // go where told to by escortPlayer
    case Enum289.AI_ACTION_RUN_AWAY: // run away from nearby opponent(s)
    case Enum289.AI_ACTION_APPROACH_MERC:
    case Enum289.AI_ACTION_TRACK:
    case Enum289.AI_ACTION_EAT:
    case Enum289.AI_ACTION_SCHEDULE_MOVE:
    case Enum289.AI_ACTION_WALK:
    case Enum289.AI_ACTION_MOVE_TO_CLIMB:
      // for movement, must have enough APs to move at least 1 tile's worth
      bMinPointsNeeded = MinPtsToMove(pSoldier);
      break;

    case Enum289.AI_ACTION_PICKUP_ITEM: // grab things lying on the ground
      bMinPointsNeeded = __max(MinPtsToMove(pSoldier), AP_PICKUP_ITEM);
      break;

    case Enum289.AI_ACTION_OPEN_OR_CLOSE_DOOR:
    case Enum289.AI_ACTION_UNLOCK_DOOR:
    case Enum289.AI_ACTION_LOCK_DOOR:
      bMinPointsNeeded = MinPtsToMove(pSoldier);
      break;

    case Enum289.AI_ACTION_DROP_ITEM:
      bMinPointsNeeded = AP_PICKUP_ITEM;
      break;

    case Enum289.AI_ACTION_FIRE_GUN: // shoot at nearby opponent
    case Enum289.AI_ACTION_TOSS_PROJECTILE: // throw grenade at/near opponent(s)
    case Enum289.AI_ACTION_KNIFE_MOVE: // preparing to stab adjacent opponent
    case Enum289.AI_ACTION_THROW_KNIFE:
      // only FIRE_GUN currently actually pays extra turning costs!
      bMinPointsNeeded = MinAPsToAttack(pSoldier, pSoldier.value.usActionData, ADDTURNCOST);

      break;

    case Enum289.AI_ACTION_PULL_TRIGGER: // activate an adjacent panic trigger
      bMinPointsNeeded = AP_PULL_TRIGGER;
      break;

    case Enum289.AI_ACTION_USE_DETONATOR: // grab detonator and set off bomb(s)
      bMinPointsNeeded = AP_USE_REMOTE;
      break;

    case Enum289.AI_ACTION_YELLOW_ALERT: // tell friends opponent(s) heard
    case Enum289.AI_ACTION_RED_ALERT: // tell friends opponent(s) seen
    case Enum289.AI_ACTION_CREATURE_CALL: // for now
      bMinPointsNeeded = AP_RADIO;
      break;

    case Enum289.AI_ACTION_CHANGE_STANCE: // crouch
      bMinPointsNeeded = AP_CROUCH;
      break;

    case Enum289.AI_ACTION_GIVE_AID: // help injured/dying friend
      bMinPointsNeeded = 0;
      break;

    case Enum289.AI_ACTION_CLIMB_ROOF:
      if (pSoldier.value.bLevel == 0) {
        bMinPointsNeeded = AP_CLIMBROOF;
      } else {
        bMinPointsNeeded = AP_CLIMBOFFROOF;
      }
      break;

    case Enum289.AI_ACTION_COWER:
    case Enum289.AI_ACTION_STOP_COWERING:
    case Enum289.AI_ACTION_LOWER_GUN:
    case Enum289.AI_ACTION_END_COWER_AND_MOVE:
    case Enum289.AI_ACTION_TRAVERSE_DOWN:
    case Enum289.AI_ACTION_OFFER_SURRENDER:
      bMinPointsNeeded = 0;
      break;

    default:
      break;
  }

  // check whether or not we can afford to do this action
  if (bMinPointsNeeded > pSoldier.value.bActionPoints) {
    return FALSE;
  } else {
    return TRUE;
  }
}

function RandomFriendWithin(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  let uiLoop: UINT32;
  let usMaxDist: UINT16;
  let ubFriendCount: UINT8;
  let ubFriendIDs: UINT8[] /* [MAXMERCS] */;
  let ubFriendID: UINT8;
  let usDirection: UINT16;
  let ubDirsLeft: UINT8;
  let fDirChecked: BOOLEAN[] /* [8] */;
  let fRangeRestricted: BOOLEAN = FALSE;
  let fFound: BOOLEAN = FALSE;
  let usDest: UINT16;
  let usOrigin: UINT16;
  let pFriend: Pointer<SOLDIERTYPE>;

  // obtain maximum roaming distance from soldier's origin
  usMaxDist = RoamingRange(pSoldier, addressof(usOrigin));

  // if our movement range is restricted

  // CJC: since RandomFriendWithin is only used in non-combat, ALWAYS restrict range.
  fRangeRestricted = TRUE;
  /*
  if (usMaxDist < MAX_ROAMING_RANGE)
  {
          fRangeRestricted = TRUE;
  }
  */

  // if range is restricted, make sure origin is a legal gridno!
  if (fRangeRestricted && ((usOrigin < 0) || (usOrigin >= GRIDSIZE))) {
    return FALSE;
  }

  ubFriendCount = 0;

  // build a list of the guynums of all active, eligible friendly mercs

  // go through each soldier, looking for "friends" (soldiers on same side)
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pFriend = MercSlots[uiLoop];

    // if this merc is inactive, not in sector, or dead
    if (!pFriend) {
      continue;
    }

    // skip ourselves
    if (pFriend.value.ubID == pSoldier.value.ubID) {
      continue;
    }

    // if this man not neutral, but is on my side, OR if he is neutral, but
    // so am I, then he's a "friend" for the purposes of random visitations
    if ((!pFriend.value.bNeutral && (pSoldier.value.bSide == pFriend.value.bSide)) || (pFriend.value.bNeutral && pSoldier.value.bNeutral)) {
      // if we're not already neighbors
      if (SpacesAway(pSoldier.value.sGridNo, pFriend.value.sGridNo) > 1) {
        // remember his guynum, increment friend counter
        ubFriendIDs[ubFriendCount++] = pFriend.value.ubID;
      }
    }
  }

  while (ubFriendCount && !fFound) {
    // randomly select one of the remaining friends in the list
    ubFriendID = ubFriendIDs[PreRandom(ubFriendCount)];

    // if our movement range is NOT restricted, or this friend's within range
    // use distance - 1, because there must be at least 1 tile 1 space closer
    if (!fRangeRestricted || (SpacesAway(usOrigin, Menptr[ubFriendID].sGridNo) - 1) <= usMaxDist) {
      // should be close enough, try to find a legal ->sDestination within 1 tile

      // clear dirChecked flag for all 8 directions
      for (usDirection = 0; usDirection < 8; usDirection++) {
        fDirChecked[usDirection] = FALSE;
      }

      ubDirsLeft = 8;

      // examine all 8 spots around 'ubFriendID'
      // keep looking while directions remain and a satisfactory one not found
      while ((ubDirsLeft--) && !fFound) {
        // randomly select a direction which hasn't been 'checked' yet
        do {
          usDirection = Random(8);
        } while (fDirChecked[usDirection]);

        fDirChecked[usDirection] = TRUE;

        // determine the gridno 1 tile away from current friend in this direction
        usDest = NewGridNo(Menptr[ubFriendID].sGridNo, DirectionInc((usDirection + 1)));

        // if that's out of bounds, ignore it & check next direction
        if (usDest == Menptr[ubFriendID].sGridNo) {
          continue;
        }

        // if our movement range is NOT restricted
        if (!fRangeRestricted || (SpacesAway(usOrigin, usDest) <= usMaxDist)) {
          if (LegalNPCDestination(pSoldier, usDest, ENSURE_PATH, NOWATER, 0)) {
            fFound = TRUE; // found a spot
            pSoldier.value.usActionData = usDest; // store this ->sDestination
            pSoldier.value.bPathStored = TRUE; // optimization - Ian
            break; // stop checking in other directions
          }
        }
      }
    }

    if (!fFound) {
      ubFriendCount--;

      // if we hadn't already picked the last friend currently in the list
      if (ubFriendCount != ubFriendID) {
        ubFriendIDs[ubFriendID] = ubFriendIDs[ubFriendCount];
      }
    }
  }

  return fFound;
}

function RandDestWithinRange(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  let sRandDest: INT16 = NOWHERE;
  let usOrigin: UINT16;
  let usMaxDist: UINT16;
  let ubTriesLeft: UINT8;
  let fLimited: BOOLEAN = FALSE;
  let fFound: BOOLEAN = FALSE;
  let sMaxLeft: INT16;
  let sMaxRight: INT16;
  let sMaxUp: INT16;
  let sMaxDown: INT16;
  let sXRange: INT16;
  let sYRange: INT16;
  let sXOffset: INT16;
  let sYOffset: INT16;
  let sOrigX: INT16;
  let sOrigY: INT16;
  let sX: INT16;
  let sY: INT16;
  let ubRoom: UINT8 = 0;
  let ubTempRoom: UINT8;

  sOrigX = sOrigY = -1;
  sMaxLeft = sMaxRight = sMaxUp = sMaxDown = sXRange = sYRange = -1;

  // Try to find a random ->sDestination that's no more than maxDist away from
  // the given gridno of origin

  if (gfTurnBasedAI) {
    ubTriesLeft = 10;
  } else {
    ubTriesLeft = 1;
  }

  usMaxDist = RoamingRange(pSoldier, addressof(usOrigin));

  if (pSoldier.value.bOrders <= Enum241.CLOSEPATROL && (pSoldier.value.bTeam == CIV_TEAM || pSoldier.value.ubProfile != NO_PROFILE)) {
    // any other combo uses the default of ubRoom == 0, set above
    if (!InARoom(pSoldier.value.usPatrolGrid[0], addressof(ubRoom))) {
      ubRoom = 0;
    }
  }

  // if the maxDist is truly a restriction
  if (usMaxDist < (MAXCOL - 1)) {
    fLimited = TRUE;

    // determine maximum horizontal limits
    sOrigX = usOrigin % MAXCOL;
    sOrigY = usOrigin / MAXCOL;

    sMaxLeft = min(usMaxDist, sOrigX);
    sMaxRight = min(usMaxDist, MAXCOL - (sOrigX + 1));

    // determine maximum vertical limits
    sMaxUp = min(usMaxDist, sOrigY);
    sMaxDown = min(usMaxDist, MAXROW - (sOrigY + 1));

    sXRange = sMaxLeft + sMaxRight + 1;
    sYRange = sMaxUp + sMaxDown + 1;
  }

  if (pSoldier.value.ubBodyType == Enum194.LARVAE_MONSTER) {
    // only crawl 1 tile, within our roaming range
    while ((ubTriesLeft--) && !fFound) {
      sXOffset = Random(3) - 1; // generates -1 to +1
      sYOffset = Random(3) - 1;

      if (fLimited) {
        sX = pSoldier.value.sGridNo % MAXCOL + sXOffset;
        sY = pSoldier.value.sGridNo / MAXCOL + sYOffset;
        if (sX < sOrigX - sMaxLeft || sX > sOrigX + sMaxRight) {
          continue;
        }
        if (sY < sOrigY - sMaxUp || sY > sOrigY + sMaxDown) {
          continue;
        }
        sRandDest = usOrigin + sXOffset + (MAXCOL * sYOffset);
      } else {
        sRandDest = usOrigin + sXOffset + (MAXCOL * sYOffset);
      }

      if (!LegalNPCDestination(pSoldier, sRandDest, ENSURE_PATH, NOWATER, 0)) {
        sRandDest = NOWHERE;
        continue; // try again!
      }

      // passed all the tests, ->sDestination is acceptable
      fFound = TRUE;
      pSoldier.value.bPathStored = TRUE; // optimization - Ian
    }
  } else {
    // keep rolling random ->sDestinations until one's satisfactory or retries used
    while ((ubTriesLeft--) && !fFound) {
      if (fLimited) {
        sXOffset = (Random(sXRange)) - sMaxLeft;
        sYOffset = (Random(sYRange)) - sMaxUp;

        sRandDest = usOrigin + sXOffset + (MAXCOL * sYOffset);
      } else {
        sRandDest = PreRandom(GRIDSIZE);
      }

      if (ubRoom && InARoom(sRandDest, addressof(ubTempRoom)) && ubTempRoom != ubRoom) {
        // outside of room available for patrol!
        sRandDest = NOWHERE;
        continue;
      }

      if (!LegalNPCDestination(pSoldier, sRandDest, ENSURE_PATH, NOWATER, 0)) {
        sRandDest = NOWHERE;
        continue; // try again!
      }

      // passed all the tests, ->sDestination is acceptable
      fFound = TRUE;
      pSoldier.value.bPathStored = TRUE; // optimization - Ian
    }
  }

  return (sRandDest); // defaults to NOWHERE
}

function ClosestReachableDisturbance(pSoldier: Pointer<SOLDIERTYPE>, ubUnconsciousOK: UINT8, pfChangeLevel: Pointer<BOOLEAN>): INT16 {
  let psLastLoc: Pointer<INT16>;
  let pusNoiseGridNo: Pointer<INT16>;
  let pbLastLevel: Pointer<INT8>;
  let sGridNo: INT16 = -1;
  let bLevel: INT8;
  let bClosestLevel: INT8;
  let fClimbingNecessary: BOOLEAN;
  let fClosestClimbingNecessary: BOOLEAN = FALSE;
  let iPathCost: INT32;
  let sClosestDisturbance: INT16 = NOWHERE;
  let uiLoop: UINT32;
  let closestConscious: UINT16 = NOWHERE;
  let closestUnconscious: UINT16 = NOWHERE;
  let iShortestPath: INT32 = 1000;
  let iShortestPathConscious: INT32 = 1000;
  let iShortestPathUnconscious: INT32 = 1000;
  let pubNoiseVolume: Pointer<UINT8>;
  let pbNoiseLevel: Pointer<INT8>;
  let pbPersOL: Pointer<INT8>;
  let pbPublOL: Pointer<INT8>;
  let sClimbGridNo: INT16;
  let pOpp: Pointer<SOLDIERTYPE>;

  // CJC: can't trace a path to every known disturbance!
  // for starters, try the closest one as the crow flies
  let sClosestEnemy: INT16 = NOWHERE;
  let sDistToClosestEnemy: INT16 = 1000;
  let sDistToEnemy: INT16;

  pfChangeLevel.value = FALSE;

  pubNoiseVolume = addressof(gubPublicNoiseVolume[pSoldier.value.bTeam]);
  pusNoiseGridNo = addressof(gsPublicNoiseGridno[pSoldier.value.bTeam]);
  pbNoiseLevel = addressof(gbPublicNoiseLevel[pSoldier.value.bTeam]);

  // hang pointers at start of this guy's personal and public opponent opplists
  //	pbPersOL = &pSoldier->bOppList[0];
  //	pbPublOL = &(gbPublicOpplist[pSoldier->bTeam][0]);
  //	psLastLoc = &(gsLastKnownOppLoc[pSoldier->ubID][0]);

  // look through this man's personal & public opplists for opponents known
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpp = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pOpp) {
      continue; // next merc
    }

    // if this merc is neutral/on same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpp) || (pSoldier.value.bSide == pOpp.value.bSide)) {
      continue; // next merc
    }

    pbPersOL = pSoldier.value.bOppList + pOpp.value.ubID;
    pbPublOL = gbPublicOpplist[pSoldier.value.bTeam] + pOpp.value.ubID;
    psLastLoc = gsLastKnownOppLoc[pSoldier.value.ubID] + pOpp.value.ubID;
    pbLastLevel = gbLastKnownOppLevel[pSoldier.value.ubID] + pOpp.value.ubID;

    // if this opponent is unknown personally and publicly
    if ((pbPersOL.value == NOT_HEARD_OR_SEEN) && (pbPublOL.value == NOT_HEARD_OR_SEEN)) {
      continue; // next merc
    }

    // this is possible if get here from BLACK AI in one of those rare
    // instances when we couldn't get a meaningful shot off at a guy in sight
    if ((pbPersOL.value == SEEN_CURRENTLY) && (pOpp.value.bLife >= OKLIFE)) {
      // don't allow this to return any valid values, this guy remains a
      // serious threat and the last thing we want to do is approach him!
      return NOWHERE;
    }

    // if personal knowledge is more up to date or at least equal
    if ((gubKnowledgeValue[pbPublOL.value - OLDEST_HEARD_VALUE][pbPersOL.value - OLDEST_HEARD_VALUE] > 0) || (pbPersOL.value == pbPublOL.value)) {
      // using personal knowledge, obtain opponent's "best guess" gridno
      sGridNo = psLastLoc.value;
      bLevel = pbLastLevel.value;
    } else {
      // using public knowledge, obtain opponent's "best guess" gridno
      sGridNo = gsPublicLastKnownOppLoc[pSoldier.value.bTeam][pOpp.value.ubID];
      bLevel = gbPublicLastKnownOppLevel[pSoldier.value.bTeam][pOpp.value.ubID];
    }

    // if we are standing at that gridno (!, obviously our info is old...)
    if (sGridNo == pSoldier.value.sGridNo) {
      continue; // next merc
    }

    if (sGridNo == NOWHERE) {
      // huh?
      continue;
    }

    sDistToEnemy = PythSpacesAway(pSoldier.value.sGridNo, sGridNo);
    if (sDistToEnemy < sDistToClosestEnemy)
      ;
    {
      sClosestEnemy = sGridNo;
      bClosestLevel = bLevel;
      sDistToClosestEnemy = sDistToEnemy;
    }
  }

  if (sClosestEnemy != NOWHERE) {
    iPathCost = EstimatePathCostToLocation(pSoldier, sClosestEnemy, bClosestLevel, FALSE, addressof(fClimbingNecessary), addressof(sClimbGridNo));
    // if we can get there
    if (iPathCost != 0) {
      if (fClimbingNecessary) {
        sClosestDisturbance = sClimbGridNo;
      } else {
        sClosestDisturbance = sClosestEnemy;
      }
      iShortestPath = iPathCost;
      fClosestClimbingNecessary = fClimbingNecessary;
    }
  }

  // if any "misc. noise" was also heard recently
  if (pSoldier.value.sNoiseGridno != NOWHERE && pSoldier.value.sNoiseGridno != sClosestDisturbance) {
    // test this gridno, too
    sGridNo = pSoldier.value.sNoiseGridno;
    bLevel = pSoldier.value.bNoiseLevel;

    // if we are there (at the noise gridno)
    if (sGridNo == pSoldier.value.sGridNo) {
      pSoldier.value.sNoiseGridno = NOWHERE; // wipe it out, not useful anymore
      pSoldier.value.ubNoiseVolume = 0;
    } else {
      // get the AP cost to get to the location of the noise
      iPathCost = EstimatePathCostToLocation(pSoldier, sGridNo, bLevel, FALSE, addressof(fClimbingNecessary), addressof(sClimbGridNo));
      // if we can get there
      if (iPathCost != 0) {
        if (fClimbingNecessary) {
          sClosestDisturbance = sClimbGridNo;
        } else {
          sClosestDisturbance = sGridNo;
        }
        iShortestPath = iPathCost;
        fClosestClimbingNecessary = fClimbingNecessary;
      }
    }
  }

  // if any PUBLIC "misc. noise" was also heard recently
  if (pusNoiseGridNo.value != NOWHERE && pusNoiseGridNo.value != sClosestDisturbance) {
    // test this gridno, too
    sGridNo = pusNoiseGridNo.value;
    bLevel = pbNoiseLevel.value;

    // if we are not NEAR the noise gridno...
    if (pSoldier.value.bLevel != bLevel || PythSpacesAway(pSoldier.value.sGridNo, sGridNo) >= 6 || SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, bLevel, 0, MaxDistanceVisible(), FALSE) == 0)
    // if we are NOT there (at the noise gridno)
    //	if (sGridNo != pSoldier->sGridNo)
    {
      // get the AP cost to get to the location of the noise
      iPathCost = EstimatePathCostToLocation(pSoldier, sGridNo, bLevel, FALSE, addressof(fClimbingNecessary), addressof(sClimbGridNo));
      // if we can get there
      if (iPathCost != 0) {
        if (fClimbingNecessary) {
          sClosestDisturbance = sClimbGridNo;
        } else {
          sClosestDisturbance = sGridNo;
        }
        iShortestPath = iPathCost;
        fClosestClimbingNecessary = fClimbingNecessary;
      }
    } else {
      // degrade our public noise a bit
      pusNoiseGridNo.value -= 2;
    }
  }

  pfChangeLevel.value = fClosestClimbingNecessary;
  return sClosestDisturbance;
}

function ClosestKnownOpponent(pSoldier: Pointer<SOLDIERTYPE>, psGridNo: Pointer<INT16>, pbLevel: Pointer<INT8>): INT16 {
  let psLastLoc: Pointer<INT16>;
  let sGridNo: INT16;
  let sClosestOpponent: INT16 = NOWHERE;
  let uiLoop: UINT32;
  let iRange: INT32;
  let iClosestRange: INT32 = 1500;
  let pbPersOL: Pointer<INT8>;
  let pbPublOL: Pointer<INT8>;
  let bLevel: INT8;
  let bClosestLevel: INT8;
  let pOpp: Pointer<SOLDIERTYPE>;

  bClosestLevel = -1;

  // NOTE: THIS FUNCTION ALLOWS RETURN OF UNCONSCIOUS AND UNREACHABLE OPPONENTS
  psLastLoc = addressof(gsLastKnownOppLoc[pSoldier.value.ubID][0]);

  // hang pointers at start of this guy's personal and public opponent opplists
  pbPersOL = addressof(pSoldier.value.bOppList[0]);
  pbPublOL = addressof(gbPublicOpplist[pSoldier.value.bTeam][0]);

  // look through this man's personal & public opplists for opponents known
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpp = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pOpp) {
      continue; // next merc
    }

    // if this merc is neutral/on same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpp) || (pSoldier.value.bSide == pOpp.value.bSide)) {
      continue; // next merc
    }

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY && pOpp.value.ubProfile != 64) {
      continue; // next opponent
    }

    pbPersOL = pSoldier.value.bOppList + pOpp.value.ubID;
    pbPublOL = gbPublicOpplist[pSoldier.value.bTeam] + pOpp.value.ubID;
    psLastLoc = gsLastKnownOppLoc[pSoldier.value.ubID] + pOpp.value.ubID;

    // if this opponent is unknown personally and publicly
    if ((pbPersOL.value == NOT_HEARD_OR_SEEN) && (pbPublOL.value == NOT_HEARD_OR_SEEN)) {
      continue; // next merc
    }

    // if personal knowledge is more up to date or at least equal
    if ((gubKnowledgeValue[pbPublOL.value - OLDEST_HEARD_VALUE][pbPersOL.value - OLDEST_HEARD_VALUE] > 0) || (pbPersOL.value == pbPublOL.value)) {
      // using personal knowledge, obtain opponent's "best guess" gridno
      sGridNo = gsLastKnownOppLoc[pSoldier.value.ubID][pOpp.value.ubID];
      bLevel = gbLastKnownOppLevel[pSoldier.value.ubID][pOpp.value.ubID];
    } else {
      // using public knowledge, obtain opponent's "best guess" gridno
      sGridNo = gsPublicLastKnownOppLoc[pSoldier.value.bTeam][pOpp.value.ubID];
      bLevel = gbPublicLastKnownOppLevel[pSoldier.value.bTeam][pOpp.value.ubID];
    }

    // if we are standing at that gridno(!, obviously our info is old...)
    if (sGridNo == pSoldier.value.sGridNo) {
      continue; // next merc
    }

    // this function is used only for turning towards closest opponent or changing stance
    // as such, if they AI is in a building,
    // we should ignore people who are on the roof of the same building as the AI
    if ((bLevel != pSoldier.value.bLevel) && SameBuilding(pSoldier.value.sGridNo, sGridNo)) {
      continue;
    }

    // I hope this will be good enough; otherwise we need a fractional/world-units-based 2D distance function
    // sRange = PythSpacesAway( pSoldier->sGridNo, sGridNo);
    iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, sGridNo);

    if (iRange < iClosestRange) {
      iClosestRange = iRange;
      sClosestOpponent = sGridNo;
      bClosestLevel = bLevel;
    }
  }

  if (psGridNo) {
    psGridNo.value = sClosestOpponent;
  }
  if (pbLevel) {
    pbLevel.value = bClosestLevel;
  }
  return sClosestOpponent;
}

function ClosestSeenOpponent(pSoldier: Pointer<SOLDIERTYPE>, psGridNo: Pointer<INT16>, pbLevel: Pointer<INT8>): INT16 {
  let sGridNo: INT16;
  let sClosestOpponent: INT16 = NOWHERE;
  let uiLoop: UINT32;
  let iRange: INT32;
  let iClosestRange: INT32 = 1500;
  let pbPersOL: Pointer<INT8>;
  let bLevel: INT8;
  let bClosestLevel: INT8;
  let pOpp: Pointer<SOLDIERTYPE>;

  bClosestLevel = -1;

  // look through this man's personal & public opplists for opponents known
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpp = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pOpp) {
      continue; // next merc
    }

    // if this merc is neutral/on same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpp) || (pSoldier.value.bSide == pOpp.value.bSide)) {
      continue; // next merc
    }

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY && pOpp.value.ubProfile != 64) {
      continue; // next opponent
    }

    pbPersOL = pSoldier.value.bOppList + pOpp.value.ubID;

    // if this opponent is not seen personally
    if (pbPersOL.value != SEEN_CURRENTLY) {
      continue; // next merc
    }

    // since we're dealing with seen people, use exact gridnos
    sGridNo = pOpp.value.sGridNo;
    bLevel = pOpp.value.bLevel;

    // if we are standing at that gridno(!, obviously our info is old...)
    if (sGridNo == pSoldier.value.sGridNo) {
      continue; // next merc
    }

    // this function is used only for turning towards closest opponent or changing stance
    // as such, if they AI is in a building,
    // we should ignore people who are on the roof of the same building as the AI
    if ((bLevel != pSoldier.value.bLevel) && SameBuilding(pSoldier.value.sGridNo, sGridNo)) {
      continue;
    }

    // I hope this will be good enough; otherwise we need a fractional/world-units-based 2D distance function
    // sRange = PythSpacesAway( pSoldier->sGridNo, sGridNo);
    iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, sGridNo);

    if (iRange < iClosestRange) {
      iClosestRange = iRange;
      sClosestOpponent = sGridNo;
      bClosestLevel = bLevel;
    }
  }

  if (psGridNo) {
    psGridNo.value = sClosestOpponent;
  }
  if (pbLevel) {
    pbLevel.value = bClosestLevel;
  }
  return sClosestOpponent;
}

function ClosestPC(pSoldier: Pointer<SOLDIERTYPE>, psDistance: Pointer<INT16>): INT16 {
  // used by NPCs... find the closest PC

  // NOTE: skips EPCs!

  let ubLoop: UINT8;
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let sMinDist: INT16 = WORLD_MAX;
  let sDist: INT16;
  let sGridNo: INT16 = NOWHERE;

  // Loop through all mercs on player team
  ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  for (; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++) {
    pTargetSoldier = Menptr + ubLoop;

    if (!pTargetSoldier.value.bActive || !pTargetSoldier.value.bInSector) {
      continue;
    }

    // if not conscious, skip him
    if (pTargetSoldier.value.bLife < OKLIFE) {
      continue;
    }

    if (AM_AN_EPC(pTargetSoldier)) {
      continue;
    }

    sDist = PythSpacesAway(pSoldier.value.sGridNo, pTargetSoldier.value.sGridNo);

    // if this PC is not visible to the soldier, then add a penalty to the distance
    // so that we weight in favour of visible mercs
    if (pTargetSoldier.value.bTeam != pSoldier.value.bTeam && pSoldier.value.bOppList[ubLoop] != SEEN_CURRENTLY) {
      sDist += 10;
    }

    if (sDist < sMinDist) {
      sMinDist = sDist;
      sGridNo = pTargetSoldier.value.sGridNo;
    }
  }

  if (psDistance) {
    psDistance.value = sMinDist;
  }

  return sGridNo;
}

function FindClosestClimbPointAvailableToAI(pSoldier: Pointer<SOLDIERTYPE>, sStartGridNo: INT16, sDesiredGridNo: INT16, fClimbUp: BOOLEAN): INT16 {
  let sGridNo: INT16;
  let sRoamingOrigin: INT16;
  let sRoamingRange: INT16;

  if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
    sRoamingOrigin = pSoldier.value.sGridNo;
    sRoamingRange = 99;
  } else {
    sRoamingRange = RoamingRange(pSoldier, addressof(sRoamingOrigin));
  }

  // since climbing necessary involves going an extra tile, we compare against 1 less than the roam range...
  // or add 1 to the distance to the climb point

  sGridNo = FindClosestClimbPoint(sStartGridNo, sDesiredGridNo, fClimbUp);

  if (PythSpacesAway(sRoamingOrigin, sGridNo) + 1 > sRoamingRange) {
    return NOWHERE;
  } else {
    return sGridNo;
  }
}

function ClimbingNecessary(pSoldier: Pointer<SOLDIERTYPE>, sDestGridNo: INT16, bDestLevel: INT8): BOOLEAN {
  if (pSoldier.value.bLevel == bDestLevel) {
    if ((pSoldier.value.bLevel == 0) || (gubBuildingInfo[pSoldier.value.sGridNo] == gubBuildingInfo[sDestGridNo])) {
      return FALSE;
    } else // different buildings!
    {
      return TRUE;
    }
  } else {
    return TRUE;
  }
}

function GetInterveningClimbingLocation(pSoldier: Pointer<SOLDIERTYPE>, sDestGridNo: INT16, bDestLevel: INT8, pfClimbingNecessary: Pointer<BOOLEAN>): INT16 {
  if (pSoldier.value.bLevel == bDestLevel) {
    if ((pSoldier.value.bLevel == 0) || (gubBuildingInfo[pSoldier.value.sGridNo] == gubBuildingInfo[sDestGridNo])) {
      // on ground or same building... normal!
      pfClimbingNecessary.value = FALSE;
      return NOWHERE;
    } else {
      // different buildings!
      // yes, pass in same gridno twice... want closest climb-down spot for building we are on!
      pfClimbingNecessary.value = TRUE;
      return FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.value.sGridNo, pSoldier.value.sGridNo, FALSE);
    }
  } else {
    pfClimbingNecessary.value = TRUE;
    // different levels
    if (pSoldier.value.bLevel == 0) {
      // got to go UP onto building
      return FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.value.sGridNo, sDestGridNo, TRUE);
    } else {
      // got to go DOWN off building
      return FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.value.sGridNo, pSoldier.value.sGridNo, FALSE);
    }
  }
}

function EstimatePathCostToLocation(pSoldier: Pointer<SOLDIERTYPE>, sDestGridNo: INT16, bDestLevel: INT8, fAddCostAfterClimbingUp: BOOLEAN, pfClimbingNecessary: Pointer<BOOLEAN>, psClimbGridNo: Pointer<INT16>): INT16 {
  let sPathCost: INT16;
  let sClimbGridNo: INT16;

  if (pSoldier.value.bLevel == bDestLevel) {
    if ((pSoldier.value.bLevel == 0) || (gubBuildingInfo[pSoldier.value.sGridNo] == gubBuildingInfo[sDestGridNo])) {
      // on ground or same building... normal!
      sPathCost = EstimatePlotPath(pSoldier, sDestGridNo, FALSE, FALSE, FALSE, Enum193.WALKING, FALSE, FALSE, 0);
      pfClimbingNecessary.value = FALSE;
      psClimbGridNo.value = NOWHERE;
    } else {
      // different buildings!
      // yes, pass in same gridno twice... want closest climb-down spot for building we are on!
      sClimbGridNo = FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.value.sGridNo, pSoldier.value.sGridNo, FALSE);
      if (sClimbGridNo == NOWHERE) {
        sPathCost = 0;
      } else {
        sPathCost = PlotPath(pSoldier, sClimbGridNo, FALSE, FALSE, FALSE, Enum193.WALKING, FALSE, FALSE, 0);
        if (sPathCost != 0) {
          // add in cost of climbing down
          if (fAddCostAfterClimbingUp) {
            // add in cost of later climbing up, too
            sPathCost += AP_CLIMBOFFROOF + AP_CLIMBROOF;
            // add in an estimate of getting there after climbing down
            sPathCost += (AP_MOVEMENT_FLAT + WALKCOST) * PythSpacesAway(sClimbGridNo, sDestGridNo);
          } else {
            sPathCost += AP_CLIMBOFFROOF;
            // add in an estimate of getting there after climbing down, *but not on top of roof*
            sPathCost += (AP_MOVEMENT_FLAT + WALKCOST) * PythSpacesAway(sClimbGridNo, sDestGridNo) / 2;
          }
          pfClimbingNecessary.value = TRUE;
          psClimbGridNo.value = sClimbGridNo;
        }
      }
    }
  } else {
    // different levels
    if (pSoldier.value.bLevel == 0) {
      // got to go UP onto building
      sClimbGridNo = FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.value.sGridNo, sDestGridNo, TRUE);
    } else {
      // got to go DOWN off building
      sClimbGridNo = FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.value.sGridNo, pSoldier.value.sGridNo, FALSE);
    }

    if (sClimbGridNo == NOWHERE) {
      sPathCost = 0;
    } else {
      sPathCost = PlotPath(pSoldier, sClimbGridNo, FALSE, FALSE, FALSE, Enum193.WALKING, FALSE, FALSE, 0);
      if (sPathCost != 0) {
        // add in the cost of climbing up or down
        if (pSoldier.value.bLevel == 0) {
          // must climb up
          sPathCost += AP_CLIMBROOF;
          if (fAddCostAfterClimbingUp) {
            // add to path a rough estimate of how far to go from the climb gridno to the friend
            // estimate walk cost
            sPathCost += (AP_MOVEMENT_FLAT + WALKCOST) * PythSpacesAway(sClimbGridNo, sDestGridNo);
          }
        } else {
          // must climb down
          sPathCost += AP_CLIMBOFFROOF;
          // add to path a rough estimate of how far to go from the climb gridno to the friend
          // estimate walk cost
          sPathCost += (AP_MOVEMENT_FLAT + WALKCOST) * PythSpacesAway(sClimbGridNo, sDestGridNo);
        }
        pfClimbingNecessary.value = TRUE;
        psClimbGridNo.value = sClimbGridNo;
      }
    }
  }

  return sPathCost;
}

function GuySawEnemyThisTurnOrBefore(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let ubTeamLoop: UINT8;
  let ubIDLoop: UINT8;

  for (ubTeamLoop = 0; ubTeamLoop < MAXTEAMS; ubTeamLoop++) {
    if (gTacticalStatus.Team[ubTeamLoop].bSide != pSoldier.value.bSide) {
      // consider guys in this team, which isn't on our side
      for (ubIDLoop = gTacticalStatus.Team[ubTeamLoop].bFirstID; ubIDLoop <= gTacticalStatus.Team[ubTeamLoop].bLastID; ubIDLoop++) {
        // if this guy SAW an enemy recently...
        if (pSoldier.value.bOppList[ubIDLoop] >= SEEN_CURRENTLY) {
          return TRUE;
        }
      }
    }
  }

  return FALSE;
}

function ClosestReachableFriendInTrouble(pSoldier: Pointer<SOLDIERTYPE>, pfClimbingNecessary: Pointer<BOOLEAN>): INT16 {
  let uiLoop: UINT32;
  let sPathCost: INT16;
  let sClosestFriend: INT16 = NOWHERE;
  let sShortestPath: INT16 = 1000;
  let sClimbGridNo: INT16;
  let fClimbingNecessary: BOOLEAN;
  let fClosestClimbingNecessary: BOOLEAN = FALSE;
  let pFriend: Pointer<SOLDIERTYPE>;

  // civilians don't really have any "friends", so they don't bother with this
  if (PTR_CIVILIAN()) {
    return sClosestFriend;
  }

  // consider every friend of this soldier (locations assumed to be known)
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pFriend = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pFriend) {
      continue; // next merc
    }

    // if this merc is neutral or NOT on the same side, he's not a friend
    if (pFriend.value.bNeutral || (pSoldier.value.bSide != pFriend.value.bSide)) {
      continue; // next merc
    }

    // if this "friend" is actually US
    if (pFriend.value.ubID == pSoldier.value.ubID) {
      continue; // next merc
    }

    // CJC: restrict "last one to radio" to only if that guy saw us this turn or last turn

    // if this friend is not under fire, and isn't the last one to radio
    if (!(pFriend.value.bUnderFire || (pFriend.value.ubID == gTacticalStatus.Team[pFriend.value.bTeam].ubLastMercToRadio && GuySawEnemyThisTurnOrBefore(pFriend)))) {
      continue; // next merc
    }

    // if we're already neighbors
    if (SpacesAway(pSoldier.value.sGridNo, pFriend.value.sGridNo) == 1) {
      continue; // next merc
    }

    // get the AP cost to go to this friend's gridno
    sPathCost = EstimatePathCostToLocation(pSoldier, pFriend.value.sGridNo, pFriend.value.bLevel, TRUE, addressof(fClimbingNecessary), addressof(sClimbGridNo));

    // if we can get there
    if (sPathCost != 0) {
      // sprintf(tempstr,"Path cost to friend %s's location is %d",pFriend->name,pathCost);
      // PopMessage(tempstr);

      if (sPathCost < sShortestPath) {
        if (fClimbingNecessary) {
          sClosestFriend = sClimbGridNo;
        } else {
          sClosestFriend = pFriend.value.sGridNo;
        }

        sShortestPath = sPathCost;
        fClosestClimbingNecessary = fClimbingNecessary;
      }
    }
  }

  pfClimbingNecessary.value = fClosestClimbingNecessary;
  return sClosestFriend;
}

function DistanceToClosestFriend(pSoldier: Pointer<SOLDIERTYPE>): INT16 {
  // find the distance to the closest person on the same team
  let ubLoop: UINT8;
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let sMinDist: INT16 = 1000;
  let sDist: INT16;

  // Loop through all mercs on player team
  ubLoop = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;

  for (; ubLoop <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; ubLoop++) {
    if (ubLoop == pSoldier.value.ubID) {
      // same guy - continue!
      continue;
    }

    pTargetSoldier = Menptr + ubLoop;

    if (pSoldier.value.bActive && pSoldier.value.bInSector) {
      if (!pTargetSoldier.value.bActive || !pTargetSoldier.value.bInSector) {
        continue;
      }
      // if not conscious, skip him
      else if (pTargetSoldier.value.bLife < OKLIFE) {
        continue;
      }
    } else {
      // compare sector #s
      if ((pSoldier.value.sSectorX != pTargetSoldier.value.sSectorX) || (pSoldier.value.sSectorY != pTargetSoldier.value.sSectorY) || (pSoldier.value.bSectorZ != pTargetSoldier.value.bSectorZ)) {
        continue;
      } else if (pTargetSoldier.value.bLife < OKLIFE) {
        continue;
      } else {
        // well there's someone who could be near
        return 1;
      }
    }

    sDist = SpacesAway(pSoldier.value.sGridNo, pTargetSoldier.value.sGridNo);

    if (sDist < sMinDist) {
      sMinDist = sDist;
    }
  }

  return sMinDist;
}

function InWaterGasOrSmoke(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): BOOLEAN {
  if (WaterTooDeepForAttacks(sGridNo)) {
    return TRUE;
  }

  // smoke
  if (gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.value.bLevel] & MAPELEMENT_EXT_SMOKE) {
    return TRUE;
  }

  // tear/mustard gas
  if ((gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.value.bLevel] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) && (pSoldier.value.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK)) {
    return TRUE;
  }

  return FALSE;
}

function InGasOrSmoke(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): BOOLEAN {
  // smoke
  if (gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.value.bLevel] & MAPELEMENT_EXT_SMOKE) {
    return TRUE;
  }

  // tear/mustard gas
  if ((gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.value.bLevel] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) && (pSoldier.value.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK)) {
    return TRUE;
  }

  return FALSE;
}

function InWaterOrGas(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): INT16 {
  if (WaterTooDeepForAttacks(sGridNo)) {
    return TRUE;
  }

  // tear/mustard gas
  if ((gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.value.bLevel] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) && (pSoldier.value.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK)) {
    return TRUE;
  }

  return FALSE;
}

function InGas(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): BOOLEAN {
  // tear/mustard gas
  if ((gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.value.bLevel] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) && (pSoldier.value.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK)) {
    return TRUE;
  }

  return FALSE;
}

function WearGasMaskIfAvailable(pSoldier: Pointer<SOLDIERTYPE>): BOOLEAN {
  let bSlot: INT8;
  let bNewSlot: INT8;

  bSlot = FindObj(pSoldier, Enum225.GASMASK);
  if (bSlot == NO_SLOT) {
    return FALSE;
  }
  if (bSlot == Enum261.HEAD1POS || bSlot == Enum261.HEAD2POS) {
    return FALSE;
  }
  if (pSoldier.value.inv[Enum261.HEAD1POS].usItem == NOTHING) {
    bNewSlot = Enum261.HEAD1POS;
  } else if (pSoldier.value.inv[Enum261.HEAD2POS].usItem == NOTHING) {
    bNewSlot = Enum261.HEAD2POS;
  } else {
    // screw it, going in position 1 anyhow
    bNewSlot = Enum261.HEAD1POS;
  }

  RearrangePocket(pSoldier, bSlot, bNewSlot, TRUE);
  return TRUE;
}

function InLightAtNight(sGridNo: INT16, bLevel: INT8): BOOLEAN {
  let ubBackgroundLightLevel: UINT8;

  // do not consider us to be "in light" if we're in an underground sector
  if (gbWorldSectorZ > 0) {
    return FALSE;
  }

  ubBackgroundLightLevel = GetTimeOfDayAmbientLightLevel();

  if (ubBackgroundLightLevel < NORMAL_LIGHTLEVEL_DAY + 2) {
    // don't consider it nighttime, too close to daylight levels
    return FALSE;
  }

  // could've been placed here, ignore the light
  if (InARoom(sGridNo, NULL)) {
    return FALSE;
  }

  // NB light levels are backwards, so a lower light level means the
  // spot in question is BRIGHTER

  if (LightTrueLevel(sGridNo, bLevel) < ubBackgroundLightLevel) {
    return TRUE;
  }

  return FALSE;
}

function CalcMorale(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let iOurTotalThreat: INT32 = 0;
  let iTheirTotalThreat: INT32 = 0;
  let sOppThreatValue: INT16;
  let sFrndThreatValue: INT16;
  let sMorale: INT16;
  let iPercent: INT32;
  let bMostRecentOpplistValue: INT8;
  let bMoraleCategory: INT8;
  let pSeenOpp: Pointer<UINT8>; //,*friendOlPtr;
  let pbPersOL: Pointer<INT8>;
  let pbPublOL: Pointer<INT8>;
  let pOpponent: Pointer<SOLDIERTYPE>;
  let pFriend: Pointer<SOLDIERTYPE>;

  // if army guy has NO weapons left then panic!
  if (pSoldier.value.bTeam == ENEMY_TEAM) {
    if (FindAIUsableObjClass(pSoldier, IC_WEAPON) == NO_SLOT) {
      return Enum244.MORALE_HOPELESS;
    }
  }

  // hang pointers to my personal opplist, my team's public opplist, and my
  // list of previously seen opponents
  pSeenOpp = addressof(gbSeenOpponents[pSoldier.value.ubID][0]);

  // loop through every one of my possible opponents
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpponent = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, dead, unconscious
    if (!pOpponent || (pOpponent.value.bLife < OKLIFE))
      continue; // next merc

    // if this merc is neutral/on same side, he's not an opponent, skip him!
    if (CONSIDERED_NEUTRAL(pSoldier, pOpponent) || (pSoldier.value.bSide == pOpponent.value.bSide))
      continue; // next merc

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY && pOpponent.value.ubProfile != 64) {
      continue; // next opponent
    }

    pbPersOL = pSoldier.value.bOppList + pOpponent.value.ubID;
    pbPublOL = gbPublicOpplist[pSoldier.value.bTeam] + pOpponent.value.ubID;
    pSeenOpp = gbSeenOpponents[pSoldier.value.ubID] + pOpponent.value.ubID;

    // if this opponent is unknown to me personally AND unknown to my team, too
    if ((pbPersOL.value == NOT_HEARD_OR_SEEN) && (pbPublOL.value == NOT_HEARD_OR_SEEN)) {
      // if I have never seen him before anywhere in this sector, either
      if (!(pSeenOpp.value))
        continue; // next merc

      // have seen him in the past, so he remains something of a threat
      bMostRecentOpplistValue = 0; // uses the free slot for 0 opplist
    } else // decide which opplist is more current
    {
      // if personal knowledge is more up to date or at least equal
      if ((gubKnowledgeValue[pbPublOL.value - OLDEST_HEARD_VALUE][pbPersOL.value - OLDEST_HEARD_VALUE] > 0) || (pbPersOL.value == pbPublOL.value))
        bMostRecentOpplistValue = pbPersOL.value; // use personal
      else
        bMostRecentOpplistValue = pbPublOL.value; // use public
    }

    iPercent = ThreatPercent[bMostRecentOpplistValue - OLDEST_HEARD_VALUE];

    sOppThreatValue = (iPercent * CalcManThreatValue(pOpponent, pSoldier.value.sGridNo, FALSE, pSoldier)) / 100;

    // sprintf(tempstr,"Known opponent %s, opplist status %d, percent %d, threat = %d",
    //           ExtMen[pOpponent->ubID].name,ubMostRecentOpplistValue,ubPercent,sOppThreatValue);
    // PopMessage(tempstr);

    // ADD this to their running total threatValue (decreases my MORALE)
    iTheirTotalThreat += sOppThreatValue;
    // NumMessage("Their TOTAL threat now = ",sTheirTotalThreat);

    // NOW THE FUN PART: SINCE THIS OPPONENT IS KNOWN TO ME IN SOME WAY,
    // ANY FRIENDS OF MINE THAT KNOW ABOUT HIM BOOST MY MORALE.  SO, LET'S GO
    // THROUGH THEIR PERSONAL OPPLISTS AND CHECK WHICH OF MY FRIENDS KNOW
    // SOMETHING ABOUT HIM AND WHAT THEIR THREAT VALUE TO HIM IS.

    for (uiLoop2 = 0; uiLoop2 < guiNumMercSlots; uiLoop2++) {
      pFriend = MercSlots[uiLoop2];

      // if this merc is inactive, at base, on assignment, dead, unconscious
      if (!pFriend || (pFriend.value.bLife < OKLIFE))
        continue; // next merc

      // if this merc is not on my side, then he's NOT one of my friends

      // WE CAN'T AFFORD TO CONSIDER THE ENEMY OF MY ENEMY MY FRIEND, HERE!
      // ONLY IF WE ARE ACTUALLY OFFICIALLY CO-OPERATING TOGETHER (SAME SIDE)
      if (pFriend.value.bNeutral && !(pSoldier.value.ubCivilianGroup != Enum246.NON_CIV_GROUP && pSoldier.value.ubCivilianGroup == pFriend.value.ubCivilianGroup)) {
        continue; // next merc
      }

      if (pSoldier.value.bSide != pFriend.value.bSide)
        continue; // next merc

      // THIS TEST IS INVALID IF A COMPUTER-TEAM IS PLAYING CO-OPERATIVELY
      // WITH A NON-COMPUTER TEAM SINCE THE OPPLISTS INVOLVED ARE NOT
      // UP-TO-DATE.  THIS SITUATION IS CURRENTLY NOT POSSIBLE IN HTH/DG.

      // ALSO NOTE THAT WE COUNT US AS OUR (BEST) FRIEND FOR THESE CALCULATIONS

      // subtract HEARD_2_TURNS_AGO (which is negative) to make values start at 0 and
      // be positive otherwise
      iPercent = ThreatPercent[pFriend.value.bOppList[pOpponent.value.ubID] - OLDEST_HEARD_VALUE];

      // reduce the percentage value based on how far away they are from the enemy, if they only hear him
      if (pFriend.value.bOppList[pOpponent.value.ubID] <= HEARD_LAST_TURN) {
        iPercent -= PythSpacesAway(pSoldier.value.sGridNo, pFriend.value.sGridNo) * 2;
        if (iPercent <= 0) {
          // ignore!
          continue;
        }
      }

      sFrndThreatValue = (iPercent * CalcManThreatValue(pFriend, pOpponent.value.sGridNo, FALSE, pSoldier)) / 100;

      // sprintf(tempstr,"Known by friend %s, opplist status %d, percent %d, threat = %d",
      //         ExtMen[pFriend->ubID].name,pFriend->bOppList[pOpponent->ubID],ubPercent,sFrndThreatValue);
      // PopMessage(tempstr);

      // ADD this to our running total threatValue (increases my MORALE)
      // We multiply by sOppThreatValue to PRO-RATE this based on opponent's
      // threat value to ME personally.  Divide later by sum of them all.
      iOurTotalThreat += sOppThreatValue * sFrndThreatValue;
    }

    // this could get slow if I have a lot of friends...
    // KeepInterfaceGoing();
  }

  // if they are no threat whatsoever
  if (!iTheirTotalThreat)
    sMorale = 500; // our morale is just incredible
  else {
    // now divide sOutTotalThreat by sTheirTotalThreat to get the REAL value
    iOurTotalThreat /= iTheirTotalThreat;

    // calculate the morale (100 is even, < 100 is us losing, > 100 is good)
    sMorale = ((100 * iOurTotalThreat) / iTheirTotalThreat);
  }

  if (sMorale <= 25) // odds 1:4 or worse
    bMoraleCategory = Enum244.MORALE_HOPELESS;
  else if (sMorale <= 50) // odds between 1:4 and 1:2
    bMoraleCategory = Enum244.MORALE_WORRIED;
  else if (sMorale <= 150) // odds between 1:2 and 3:2
    bMoraleCategory = Enum244.MORALE_NORMAL;
  else if (sMorale <= 300) // odds between 3:2 and 3:1
    bMoraleCategory = Enum244.MORALE_CONFIDENT;
  else // odds better than 3:1
    bMoraleCategory = Enum244.MORALE_FEARLESS;

  switch (pSoldier.value.bAttitude) {
    case Enum242.DEFENSIVE:
      bMoraleCategory--;
      break;
    case Enum242.BRAVESOLO:
      bMoraleCategory += 2;
      break;
    case Enum242.BRAVEAID:
      bMoraleCategory += 2;
      break;
    case Enum242.CUNNINGSOLO:
      break;
    case Enum242.CUNNINGAID:
      break;
    case Enum242.AGGRESSIVE:
      bMoraleCategory++;
      break;
  }

  // make idiot administrators much more aggressive
  if (pSoldier.value.ubSoldierClass == Enum262.SOLDIER_CLASS_ADMINISTRATOR) {
    bMoraleCategory += 2;
  }

  // if still full of energy
  if (pSoldier.value.bBreath > 75)
    bMoraleCategory++;
  else {
    // if getting a bit low on breath
    if (pSoldier.value.bBreath < 40)
      bMoraleCategory--;

    // if getting REALLY low on breath
    if (pSoldier.value.bBreath < 10)
      bMoraleCategory--;
  }

  // if still very healthy
  if (pSoldier.value.bLife > 75)
    bMoraleCategory++;
  else {
    // if getting a bit low on life
    if (pSoldier.value.bLife < 40)
      bMoraleCategory--;

    // if getting REALLY low on life
    if (pSoldier.value.bLife < 20)
      bMoraleCategory--;
  }

  // if soldier is currently not under fire
  if (!pSoldier.value.bUnderFire)
    bMoraleCategory++;

  // if adjustments made it outside the allowed limits
  if (bMoraleCategory < Enum244.MORALE_HOPELESS)
    bMoraleCategory = Enum244.MORALE_HOPELESS;
  else {
    if (bMoraleCategory > Enum244.MORALE_FEARLESS)
      bMoraleCategory = Enum244.MORALE_FEARLESS;
  }

  // if only 1/4 of side left, reduce morale
  // and do this after we've capped all those other silly values
  /*
  if ( pSoldier->bTeam == ENEMY_TEAM && gTacticalStatus.Team[ ENEMY_TEAM ].bMenInSector <= gTacticalStatus.bOriginalSizeOfEnemyForce / 4 )
  {
         bMoraleCategory -= 2;
   if (bMoraleCategory < MORALE_HOPELESS)
     bMoraleCategory = MORALE_HOPELESS;
  }
  */

  // brave guys never get hopeless, at worst they get worried
  if (bMoraleCategory == Enum244.MORALE_HOPELESS && (pSoldier.value.bAttitude == Enum242.BRAVESOLO || pSoldier.value.bAttitude == Enum242.BRAVEAID))
    bMoraleCategory = Enum244.MORALE_WORRIED;

  return bMoraleCategory;
}

function CalcManThreatValue(pEnemy: Pointer<SOLDIERTYPE>, sMyGrid: INT16, ubReduceForCover: UINT8, pMe: Pointer<SOLDIERTYPE>): INT32 {
  let iThreatValue: INT32 = 0;
  let fForCreature: BOOLEAN = CREATURE_OR_BLOODCAT(pMe);

  // If man is inactive, at base, on assignment, dead, unconscious
  if (!pEnemy.value.bActive || !pEnemy.value.bInSector || !pEnemy.value.bLife) {
    // he's no threat at all, return a negative number
    iThreatValue = -999;
    return iThreatValue;
  }

  // in boxing mode, let only a boxer be considered a threat.
  if ((gTacticalStatus.bBoxingState == Enum247.BOXING) && !(pEnemy.value.uiStatusFlags & SOLDIER_BOXER)) {
    iThreatValue = -999;
    return iThreatValue;
  }

  if (fForCreature) {
    // health (1-100)
    iThreatValue += pEnemy.value.bLife;
    // bleeding (more attactive!) (1-100)
    iThreatValue += pEnemy.value.bBleeding;
    // decrease according to distance
    iThreatValue = (iThreatValue * 10) / (10 + PythSpacesAway(sMyGrid, pEnemy.value.sGridNo));
  } else {
    // ADD twice the man's level (2-20)
    iThreatValue += pEnemy.value.bExpLevel;

    // ADD man's total action points (10-35)
    iThreatValue += CalcActionPoints(pEnemy);

    // ADD 1/2 of man's current action points (4-17)
    iThreatValue += (pEnemy.value.bActionPoints / 2);

    // ADD 1/10 of man's current health (0-10)
    iThreatValue += (pEnemy.value.bLife / 10);

    if (pEnemy.value.bAssignment < Enum117.ON_DUTY) {
      // ADD 1/4 of man's protection percentage (0-25)
      iThreatValue += ArmourPercent(pEnemy) / 4;

      // ADD 1/5 of man's marksmanship skill (0-20)
      iThreatValue += (pEnemy.value.bMarksmanship / 5);

      if (Item[pEnemy.value.inv[Enum261.HANDPOS].usItem].usItemClass & IC_WEAPON) {
        // ADD the deadliness of the item(weapon) he's holding (0-50)
        iThreatValue += Weapon[pEnemy.value.inv[Enum261.HANDPOS].usItem].ubDeadliness;
      }
    }

    // SUBTRACT 1/5 of man's bleeding (0-20)
    iThreatValue -= (pEnemy.value.bBleeding / 5);

    // SUBTRACT 1/10 of man's breath deficiency (0-10)
    iThreatValue -= ((100 - pEnemy.value.bBreath) / 10);

    // SUBTRACT man's current shock value
    iThreatValue -= pEnemy.value.bShock;
  }

  // if I have a specifically defined spot where I'm at (sometime I don't!)
  if (sMyGrid != NOWHERE) {
    // ADD 10% if man's already been shooting at me
    if (pEnemy.value.sLastTarget == sMyGrid) {
      iThreatValue += (iThreatValue / 10);
    } else {
      // ADD 5% if man's already facing me
      if (pEnemy.value.bDirection == atan8(CenterX(pEnemy.value.sGridNo), CenterY(pEnemy.value.sGridNo), CenterX(sMyGrid), CenterY(sMyGrid))) {
        iThreatValue += (iThreatValue / 20);
      }
    }
  }

  // if this man is conscious
  if (pEnemy.value.bLife >= OKLIFE) {
    // and we were told to reduce threat for my cover
    if (ubReduceForCover && (sMyGrid != NOWHERE)) {
      // Reduce iThreatValue to same % as the chance HE has shoot through at ME
      // iThreatValue = (iThreatValue * ChanceToGetThrough( pEnemy, myGrid, FAKE, ACTUAL, TESTWALLS, 9999, M9PISTOL, NOT_FOR_LOS)) / 100;
      // iThreatValue = (iThreatValue * SoldierTo3DLocationChanceToGetThrough( pEnemy, myGrid, FAKE, ACTUAL, TESTWALLS, 9999, M9PISTOL, NOT_FOR_LOS)) / 100;
      iThreatValue = (iThreatValue * SoldierToLocationChanceToGetThrough(pEnemy, sMyGrid, pMe.value.bLevel, 0, pMe.value.ubID)) / 100;
    }
  } else {
    // if he's still something of a threat
    if (iThreatValue > 0) {
      // drastically reduce his threat value (divide by 5 to 18)
      iThreatValue /= (4 + (OKLIFE - pEnemy.value.bLife));
    }
  }

  // threat value of any opponent can never drop below 1
  if (iThreatValue < 1) {
    iThreatValue = 1;
  }

  // sprintf(tempstr,"%s's iThreatValue = ",pEnemy->name);
  // NumMessage(tempstr,iThreatValue);

  return iThreatValue;
}

function RoamingRange(pSoldier: Pointer<SOLDIERTYPE>, pusFromGridNo: Pointer<INT16>): INT16 {
  if (CREATURE_OR_BLOODCAT(pSoldier)) {
    if (pSoldier.value.bAlertStatus == Enum243.STATUS_BLACK) {
      pusFromGridNo.value = pSoldier.value.sGridNo; // from current position!
      return MAX_ROAMING_RANGE;
    }
  }
  if (pSoldier.value.bOrders == Enum241.POINTPATROL || pSoldier.value.bOrders == Enum241.RNDPTPATROL) {
    // roam near NEXT PATROL POINT, not from where merc starts out
    pusFromGridNo.value = pSoldier.value.usPatrolGrid[pSoldier.value.bNextPatrolPnt];
  } else {
    // roam around where mercs started
    //*pusFromGridNo = pSoldier->sInitialGridNo;
    pusFromGridNo.value = pSoldier.value.usPatrolGrid[0];
  }

  switch (pSoldier.value.bOrders) {
    // JA2 GOLD: give non-NPCs a 5 tile roam range for cover in combat when being shot at
    case Enum241.STATIONARY:
      if (pSoldier.value.ubProfile != NO_PROFILE || (pSoldier.value.bAlertStatus < Enum243.STATUS_BLACK && !(pSoldier.value.bUnderFire))) {
        return 0;
      } else {
        return 5;
      }
    case Enum241.ONGUARD:
      return 5;
    case Enum241.CLOSEPATROL:
      return 15;
    case Enum241.RNDPTPATROL:
    case Enum241.POINTPATROL:
      return (10); // from nextPatrolGrid, not whereIWas
    case Enum241.FARPATROL:
      if (pSoldier.value.bAlertStatus < Enum243.STATUS_RED) {
        return 25;
      } else {
        return 50;
      }
    case Enum241.ONCALL:
      if (pSoldier.value.bAlertStatus < Enum243.STATUS_RED) {
        return 10;
      } else {
        return 30;
      }
    case Enum241.SEEKENEMY:
      pusFromGridNo.value = pSoldier.value.sGridNo; // from current position!
      return MAX_ROAMING_RANGE;
    default:
      return 0;
  }
}

function RearrangePocket(pSoldier: Pointer<SOLDIERTYPE>, bPocket1: INT8, bPocket2: INT8, bPermanent: UINT8): void {
  // NB there's no such thing as a temporary swap for now...
  SwapObjs(addressof(pSoldier.value.inv[bPocket1]), addressof(pSoldier.value.inv[bPocket2]));
}

function FindBetterSpotForItem(pSoldier: Pointer<SOLDIERTYPE>, bSlot: INT8): BOOLEAN {
  // looks for a place in the slots to put an item in a hand or armour
  // position, and moves it there.
  if (bSlot >= Enum261.BIGPOCK1POS) {
    return FALSE;
  }
  if (pSoldier.value.inv[bSlot].usItem == NOTHING) {
    // well that's just fine then!
    return TRUE;
  }

  if (Item[pSoldier.value.inv[bSlot].usItem].ubPerPocket == 0) {
    // then we're looking for a big pocket
    bSlot = FindEmptySlotWithin(pSoldier, Enum261.BIGPOCK1POS, Enum261.BIGPOCK4POS);
  } else {
    // try a small pocket first
    bSlot = FindEmptySlotWithin(pSoldier, Enum261.SMALLPOCK1POS, Enum261.SMALLPOCK8POS);
    if (bSlot == NO_SLOT) {
      bSlot = FindEmptySlotWithin(pSoldier, Enum261.BIGPOCK1POS, Enum261.BIGPOCK4POS);
    }
  }
  if (bSlot == NO_SLOT) {
    return FALSE;
  }
  RearrangePocket(pSoldier, Enum261.HANDPOS, bSlot, FOREVER);
  return TRUE;
}

function GetTraversalQuoteActionID(bDirection: INT8): UINT8 {
  switch (bDirection) {
    case Enum245.NORTHEAST: // east
      return Enum290.QUOTE_ACTION_ID_TRAVERSE_EAST;

    case Enum245.SOUTHEAST: // south
      return Enum290.QUOTE_ACTION_ID_TRAVERSE_SOUTH;

    case Enum245.SOUTHWEST: // west
      return Enum290.QUOTE_ACTION_ID_TRAVERSE_WEST;

    case Enum245.NORTHWEST: // north
      return Enum290.QUOTE_ACTION_ID_TRAVERSE_NORTH;

    default:
      return 0;
  }
}

function SoldierDifficultyLevel(pSoldier: Pointer<SOLDIERTYPE>): UINT8 {
  let bDifficultyBase: INT8;
  let bDifficulty: INT8;

  // difficulty modifier ranges from 0 to 100
  // and we want to end up with a number between 0 and 4 (4=hardest)
  // to a base of 1, divide by 34 to get a range from 1 to 3
  bDifficultyBase = 1 + (CalcDifficultyModifier(pSoldier.value.ubSoldierClass) / 34);

  switch (pSoldier.value.ubSoldierClass) {
    case Enum262.SOLDIER_CLASS_ADMINISTRATOR:
      bDifficulty = bDifficultyBase - 1;
      break;

    case Enum262.SOLDIER_CLASS_ARMY:
      bDifficulty = bDifficultyBase;
      break;

    case Enum262.SOLDIER_CLASS_ELITE:
      bDifficulty = bDifficultyBase + 1;
      break;

    // hard code militia;
    case Enum262.SOLDIER_CLASS_GREEN_MILITIA:
      bDifficulty = 2;
      break;

    case Enum262.SOLDIER_CLASS_REG_MILITIA:
      bDifficulty = 3;
      break;

    case Enum262.SOLDIER_CLASS_ELITE_MILITIA:
      bDifficulty = 4;
      break;

    default:
      if (pSoldier.value.bTeam == CREATURE_TEAM) {
        bDifficulty = bDifficultyBase + pSoldier.value.bLevel / 4;
      } else // civ...
      {
        bDifficulty = (bDifficultyBase + pSoldier.value.bLevel / 4) - 1;
      }
      break;
  }

  bDifficulty = __max(bDifficulty, 0);
  bDifficulty = __min(bDifficulty, 4);

  return bDifficulty;
}

function ValidCreatureTurn(pCreature: Pointer<SOLDIERTYPE>, bNewDirection: INT8): BOOLEAN {
  let bDirChange: INT8;
  let bTempDir: INT8;
  let bLoop: INT8;
  let fFound: BOOLEAN;

  bDirChange = QuickestDirection(pCreature.value.bDirection, bNewDirection);

  for (bLoop = 0; bLoop < 2; bLoop++) {
    fFound = TRUE;

    bTempDir = pCreature.value.bDirection;

    do {
      bTempDir += bDirChange;
      if (bTempDir < Enum245.NORTH) {
        bTempDir = Enum245.NORTHWEST;
      } else if (bTempDir > Enum245.NORTHWEST) {
        bTempDir = Enum245.NORTH;
      }
      if (!InternalIsValidStance(pCreature, bTempDir, ANIM_STAND)) {
        fFound = FALSE;
        break;
      }
    } while (bTempDir != bNewDirection);

    if (fFound) {
      break;
    } else if (bLoop > 0) {
      // can't find a dir!
      return FALSE;
    } else {
      // try the other direction
      bDirChange = bDirChange * -1;
    }
  }

  return TRUE;
}

function RangeChangeDesire(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let iRangeFactorMultiplier: INT32;

  iRangeFactorMultiplier = pSoldier.value.bAIMorale - 1;
  switch (pSoldier.value.bAttitude) {
    case Enum242.DEFENSIVE:
      iRangeFactorMultiplier += -1;
      break;
    case Enum242.BRAVESOLO:
      iRangeFactorMultiplier += 2;
      break;
    case Enum242.BRAVEAID:
      iRangeFactorMultiplier += 2;
      break;
    case Enum242.CUNNINGSOLO:
      iRangeFactorMultiplier += 0;
      break;
    case Enum242.CUNNINGAID:
      iRangeFactorMultiplier += 0;
      break;
    case Enum242.ATTACKSLAYONLY:
    case Enum242.AGGRESSIVE:
      iRangeFactorMultiplier += 1;
      break;
  }
  if (gTacticalStatus.bConsNumTurnsWeHaventSeenButEnemyDoes > 0) {
    iRangeFactorMultiplier += gTacticalStatus.bConsNumTurnsWeHaventSeenButEnemyDoes;
  }
  return iRangeFactorMultiplier;
}

function ArmySeesOpponents(): BOOLEAN {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (cnt = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; cnt <= gTacticalStatus.Team[ENEMY_TEAM].bLastID; cnt++) {
    pSoldier = MercPtrs[cnt];

    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE && pSoldier.value.bOppCnt > 0) {
      return TRUE;
    }
  }

  return FALSE;
}
