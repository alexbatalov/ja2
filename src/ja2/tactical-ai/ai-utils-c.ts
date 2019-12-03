namespace ja2 {

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

export function OKToAttack(pSoldier: SOLDIERTYPE, target: number): INT8 {
  // can't shoot yourself
  if (target == pSoldier.sGridNo)
    return NOSHOOT_MYSELF;

  if (WaterTooDeepForAttacks(pSoldier.sGridNo))
    return NOSHOOT_WATER;

  // make sure a weapon is in hand (FEB.8 ADDITION: tossable items are also OK)
  if (!WeaponInHand(pSoldier)) {
    return NOSHOOT_NOWEAPON;
  }

  // JUST PUT THIS IN ON JULY 13 TO TRY AND FIX OUT-OF-AMMO SITUATIONS

  if (Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN) {
    if (pSoldier.inv[Enum261.HANDPOS].usItem == Enum225.TANK_CANNON) {
      // look for another tank shell ELSEWHERE IN INVENTORY
      if (FindLaunchable(pSoldier, Enum225.TANK_CANNON) == NO_SLOT)
      // if ( !ItemHasAttachments( &(pSoldier->inv[HANDPOS]) ) )
      {
        return NOSHOOT_NOLOAD;
      }
    } else if (pSoldier.inv[Enum261.HANDPOS].ubGunShotsLeft == 0) {
      return NOSHOOT_NOAMMO;
    }
  } else if (Item[pSoldier.inv[Enum261.HANDPOS].usItem].usItemClass == IC_LAUNCHER) {
    if (FindLaunchable(pSoldier, pSoldier.inv[Enum261.HANDPOS].usItem) == NO_SLOT)
    // if ( !ItemHasAttachments( &(pSoldier->inv[HANDPOS]) ) )
    {
      return NOSHOOT_NOLOAD;
    }
  }

  return 1;
}

function ConsiderProne(pSoldier: SOLDIERTYPE): boolean {
  let sOpponentGridNo: INT16;
  let bOpponentLevel: INT8;
  let iRange: INT32;

  if (pSoldier.bAIMorale >= Enum244.MORALE_NORMAL) {
    return false;
  }
  // We don't want to go prone if there is a nearby enemy
  ClosestKnownOpponent(pSoldier, addressof(sOpponentGridNo), addressof(bOpponentLevel));
  iRange = GetRangeFromGridNoDiff(pSoldier.sGridNo, sOpponentGridNo);
  if (iRange > 10) {
    return true;
  } else {
    return false;
  }
}

export function StanceChange(pSoldier: SOLDIERTYPE, ubAttackAPCost: UINT8): UINT8 {
  // consider crouching or going prone

  if (PTR_STANDING(pSoldier)) {
    if (pSoldier.bActionPoints - ubAttackAPCost >= AP_CROUCH) {
      if ((pSoldier.bActionPoints - ubAttackAPCost >= AP_CROUCH + AP_PRONE) && IsValidStance(pSoldier, ANIM_PRONE) && ConsiderProne(pSoldier)) {
        return ANIM_PRONE;
      } else if (IsValidStance(pSoldier, ANIM_CROUCH)) {
        return ANIM_CROUCH;
      }
    }
  } else if (PTR_CROUCHED(pSoldier)) {
    if ((pSoldier.bActionPoints - ubAttackAPCost >= AP_PRONE) && IsValidStance(pSoldier, ANIM_PRONE) && ConsiderProne(pSoldier)) {
      return ANIM_PRONE;
    }
  }
  return 0;
}

export function ShootingStanceChange(pSoldier: SOLDIERTYPE, pAttack: ATTACKTYPE, bDesiredDirection: INT8): UINT8 {
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
  let uiMinimumStanceBonusPerChange: UINT32 = 20 - 3 * pAttack.ubAimTime;
  let iRange: INT32;

  bStanceNum = 0;
  uiCurrChanceOfDamage = 0;

  bAPsAfterAttack = pSoldier.bActionPoints - pAttack.ubAPCost - GetAPsToReadyWeapon(pSoldier, pSoldier.usAnimState);
  if (bAPsAfterAttack < AP_CROUCH) {
    return 0;
  }
  // Unfortunately, to get this to work, we have to fake the AI guy's
  // animation state so we get the right height values
  usRealAnimState = pSoldier.usAnimState;
  usBestAnimState = pSoldier.usAnimState;
  uiBestChanceOfDamage = 0;
  iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.sGridNo, pAttack.sTarget);

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
    bStanceDiff = Math.abs(bLoop - bStanceNum);
    if (bStanceDiff == 2 && bAPsAfterAttack < AP_CROUCH + AP_PRONE) {
      // can't consider this!
      continue;
    }

    switch (bLoop) {
      case 0:
        if (!InternalIsValidStance(pSoldier, bDesiredDirection, ANIM_STAND)) {
          continue;
        }
        pSoldier.usAnimState = Enum193.STANDING;
        break;
      case 1:
        if (!InternalIsValidStance(pSoldier, bDesiredDirection, ANIM_CROUCH)) {
          continue;
        }
        pSoldier.usAnimState = Enum193.CROUCHING;
        break;
      default:
        if (!InternalIsValidStance(pSoldier, bDesiredDirection, ANIM_PRONE)) {
          continue;
        }
        pSoldier.usAnimState = Enum193.PRONE;
        break;
    }

    uiChanceOfDamage = SoldierToLocationChanceToGetThrough(pSoldier, pAttack.sTarget, pSoldier.bTargetLevel, pSoldier.bTargetCubeLevel, pAttack.ubOpponent) * CalcChanceToHitGun(pSoldier, pAttack.sTarget, pAttack.ubAimTime, AIM_SHOT_TORSO) / 100;
    if (uiChanceOfDamage > 0) {
      uiStanceBonus = 0;
      // artificially augment "chance of damage" to reflect penalty to be shot at various stances
      switch (pSoldier.usAnimState) {
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
      usBestAnimState = pSoldier.usAnimState;
      bBestStanceDiff = bStanceDiff;
    }
  }

  pSoldier.usAnimState = usRealAnimState;

  // return 0 or the best height value to be at
  if (bBestStanceDiff == 0 || ((uiBestChanceOfDamage - uiCurrChanceOfDamage) / bBestStanceDiff) < uiMinimumStanceBonusPerChange) {
    // better off not changing our stance!
    return 0;
  } else {
    return gAnimControl[usBestAnimState].ubEndHeight;
  }
}

export function DetermineMovementMode(pSoldier: SOLDIERTYPE, bAction: INT8): UINT16 {
  if (pSoldier.fUIMovementFast) {
    return Enum193.RUNNING;
  } else if (CREATURE_OR_BLOODCAT(pSoldier)) {
    if (pSoldier.bAlertStatus == Enum243.STATUS_GREEN) {
      return Enum193.WALKING;
    } else {
      return Enum193.RUNNING;
    }
  } else if (pSoldier.ubBodyType == Enum194.COW || pSoldier.ubBodyType == Enum194.CROW) {
    return Enum193.WALKING;
  } else {
    if ((pSoldier.fAIFlags & AI_CAUTIOUS) && (MovementMode[bAction][Urgency[pSoldier.bAlertStatus][pSoldier.bAIMorale]] == Enum193.RUNNING)) {
      return Enum193.WALKING;
    } else if (bAction == Enum289.AI_ACTION_SEEK_NOISE && pSoldier.bTeam == CIV_TEAM && !IS_MERC_BODY_TYPE(pSoldier)) {
      return Enum193.WALKING;
    } else if ((pSoldier.ubBodyType == Enum194.HATKIDCIV || pSoldier.ubBodyType == Enum194.KIDCIV) && (pSoldier.bAlertStatus == Enum243.STATUS_GREEN) && Random(10) == 0) {
      return Enum193.KID_SKIPPING;
    } else {
      return MovementMode[bAction][Urgency[pSoldier.bAlertStatus][pSoldier.bAIMorale]];
    }
  }
}

export function NewDest(pSoldier: SOLDIERTYPE, usGridNo: UINT16): void {
  // ATE: Setting sDestination? Tis does not make sense...
  // pSoldier->sDestination = usGridNo;
  let fSet: boolean = false;

  if (IS_MERC_BODY_TYPE(pSoldier) && pSoldier.bAction == Enum289.AI_ACTION_TAKE_COVER && (pSoldier.bOrders == Enum242.DEFENSIVE || pSoldier.bOrders == Enum242.CUNNINGSOLO || pSoldier.bOrders == Enum242.CUNNINGAID) && (SoldierDifficultyLevel(pSoldier) >= 2)) {
    let usMovementMode: UINT16;

    // getting real movement anim for someone who is going to take cover, not just considering
    usMovementMode = MovementMode[Enum289.AI_ACTION_TAKE_COVER][Urgency[pSoldier.bAlertStatus][pSoldier.bAIMorale]];
    if (usMovementMode != Enum193.SWATTING) {
      // really want to look at path, see how far we could get on path while swatting
      if (EnoughPoints(pSoldier, RecalculatePathCost(pSoldier, Enum193.SWATTING), 0, false) || (pSoldier.bLastAction == Enum289.AI_ACTION_TAKE_COVER && pSoldier.usUIMovementMode == Enum193.SWATTING)) {
        pSoldier.usUIMovementMode = Enum193.SWATTING;
      } else {
        pSoldier.usUIMovementMode = usMovementMode;
      }
    } else {
      pSoldier.usUIMovementMode = usMovementMode;
    }
    fSet = true;
  } else {
    if (pSoldier.bTeam == ENEMY_TEAM && pSoldier.bAlertStatus == Enum243.STATUS_RED) {
      switch (pSoldier.bAction) {
        /*
        case AI_ACTION_MOVE_TO_CLIMB:
        case AI_ACTION_RUN_AWAY:
                pSoldier->usUIMovementMode = DetermineMovementMode( pSoldier, pSoldier->bAction );
                fSet = TRUE;
                break;*/
        default:
          if (PreRandom(5 - SoldierDifficultyLevel(pSoldier)) == 0) {
            let sClosestNoise: INT16 = MostImportantNoiseHeard(pSoldier, null, null, null);
            if (sClosestNoise != NOWHERE && PythSpacesAway(pSoldier.sGridNo, sClosestNoise) < MaxDistanceVisible() + 10) {
              pSoldier.usUIMovementMode = Enum193.SWATTING;
              fSet = true;
            }
          }
          if (!fSet) {
            pSoldier.usUIMovementMode = DetermineMovementMode(pSoldier, pSoldier.bAction);
            fSet = true;
          }
          break;
      }
    } else {
      pSoldier.usUIMovementMode = DetermineMovementMode(pSoldier, pSoldier.bAction);
      fSet = true;
    }

    if (pSoldier.usUIMovementMode == Enum193.SWATTING && !IS_MERC_BODY_TYPE(pSoldier)) {
      pSoldier.usUIMovementMode = Enum193.WALKING;
    }
  }

  // EVENT_GetNewSoldierPath( pSoldier, pSoldier->sDestination, pSoldier->usUIMovementMode );
  // ATE: Using this more versitile version
  // Last paramater says whether to re-start the soldier's animation
  // This should be done if buddy was paused for fNoApstofinishMove...
  EVENT_InternalGetNewSoldierPath(pSoldier, usGridNo, pSoldier.usUIMovementMode, false, pSoldier.fNoAPToFinishMove);
}

export function IsActionAffordable(pSoldier: SOLDIERTYPE): boolean {
  let bMinPointsNeeded: INT8 = 0;

  // NumMessage("AffordableAction - Guy#",pSoldier->ubID);

  switch (pSoldier.bAction) {
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
      bMinPointsNeeded = Math.max(MinPtsToMove(pSoldier), AP_PICKUP_ITEM);
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
      bMinPointsNeeded = MinAPsToAttack(pSoldier, pSoldier.usActionData, ADDTURNCOST);

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
      if (pSoldier.bLevel == 0) {
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
  if (bMinPointsNeeded > pSoldier.bActionPoints) {
    return false;
  } else {
    return true;
  }
}

export function RandomFriendWithin(pSoldier: SOLDIERTYPE): boolean {
  let uiLoop: UINT32;
  let usMaxDist: UINT16;
  let ubFriendCount: UINT8;
  let ubFriendIDs: UINT8[] /* [MAXMERCS] */ = createArray(MAXMERCS, 0);
  let ubFriendID: UINT8;
  let usDirection: UINT16;
  let ubDirsLeft: UINT8;
  let fDirChecked: boolean[] /* [8] */ = createArray(8, false);
  let fRangeRestricted: boolean = false;
  let fFound: boolean = false;
  let usDest: UINT16;
  let usOrigin: UINT16;
  let pFriend: SOLDIERTYPE | null;

  // obtain maximum roaming distance from soldier's origin
  usMaxDist = RoamingRange(pSoldier, addressof(usOrigin));

  // if our movement range is restricted

  // CJC: since RandomFriendWithin is only used in non-combat, ALWAYS restrict range.
  fRangeRestricted = true;
  /*
  if (usMaxDist < MAX_ROAMING_RANGE)
  {
          fRangeRestricted = TRUE;
  }
  */

  // if range is restricted, make sure origin is a legal gridno!
  if (fRangeRestricted && ((usOrigin < 0) || (usOrigin >= GRIDSIZE))) {
    return false;
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
    if (pFriend.ubID == pSoldier.ubID) {
      continue;
    }

    // if this man not neutral, but is on my side, OR if he is neutral, but
    // so am I, then he's a "friend" for the purposes of random visitations
    if ((!pFriend.bNeutral && (pSoldier.bSide == pFriend.bSide)) || (pFriend.bNeutral && pSoldier.bNeutral)) {
      // if we're not already neighbors
      if (SpacesAway(pSoldier.sGridNo, pFriend.sGridNo) > 1) {
        // remember his guynum, increment friend counter
        ubFriendIDs[ubFriendCount++] = pFriend.ubID;
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
        fDirChecked[usDirection] = false;
      }

      ubDirsLeft = 8;

      // examine all 8 spots around 'ubFriendID'
      // keep looking while directions remain and a satisfactory one not found
      while ((ubDirsLeft--) && !fFound) {
        // randomly select a direction which hasn't been 'checked' yet
        do {
          usDirection = Random(8);
        } while (fDirChecked[usDirection]);

        fDirChecked[usDirection] = true;

        // determine the gridno 1 tile away from current friend in this direction
        usDest = NewGridNo(Menptr[ubFriendID].sGridNo, DirectionInc((usDirection + 1)));

        // if that's out of bounds, ignore it & check next direction
        if (usDest == Menptr[ubFriendID].sGridNo) {
          continue;
        }

        // if our movement range is NOT restricted
        if (!fRangeRestricted || (SpacesAway(usOrigin, usDest) <= usMaxDist)) {
          if (LegalNPCDestination(pSoldier, usDest, ENSURE_PATH, NOWATER, 0)) {
            fFound = true; // found a spot
            pSoldier.usActionData = usDest; // store this ->sDestination
            pSoldier.bPathStored = true; // optimization - Ian
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

export function RandDestWithinRange(pSoldier: SOLDIERTYPE): INT16 {
  let sRandDest: INT16 = NOWHERE;
  let usOrigin: UINT16;
  let usMaxDist: UINT16;
  let ubTriesLeft: UINT8;
  let fLimited: boolean = false;
  let fFound: boolean = false;
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

  if (pSoldier.bOrders <= Enum241.CLOSEPATROL && (pSoldier.bTeam == CIV_TEAM || pSoldier.ubProfile != NO_PROFILE)) {
    // any other combo uses the default of ubRoom == 0, set above
    if ((ubRoom = InARoom(pSoldier.usPatrolGrid[0])) === -1) {
      ubRoom = 0;
    }
  }

  // if the maxDist is truly a restriction
  if (usMaxDist < (MAXCOL - 1)) {
    fLimited = true;

    // determine maximum horizontal limits
    sOrigX = usOrigin % MAXCOL;
    sOrigY = usOrigin / MAXCOL;

    sMaxLeft = Math.min(usMaxDist, sOrigX);
    sMaxRight = Math.min(usMaxDist, MAXCOL - (sOrigX + 1));

    // determine maximum vertical limits
    sMaxUp = Math.min(usMaxDist, sOrigY);
    sMaxDown = Math.min(usMaxDist, MAXROW - (sOrigY + 1));

    sXRange = sMaxLeft + sMaxRight + 1;
    sYRange = sMaxUp + sMaxDown + 1;
  }

  if (pSoldier.ubBodyType == Enum194.LARVAE_MONSTER) {
    // only crawl 1 tile, within our roaming range
    while ((ubTriesLeft--) && !fFound) {
      sXOffset = Random(3) - 1; // generates -1 to +1
      sYOffset = Random(3) - 1;

      if (fLimited) {
        sX = pSoldier.sGridNo % MAXCOL + sXOffset;
        sY = pSoldier.sGridNo / MAXCOL + sYOffset;
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
      fFound = true;
      pSoldier.bPathStored = true; // optimization - Ian
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

      if (ubRoom && (ubTempRoom = InARoom(sRandDest) !== -1) && ubTempRoom != ubRoom) {
        // outside of room available for patrol!
        sRandDest = NOWHERE;
        continue;
      }

      if (!LegalNPCDestination(pSoldier, sRandDest, ENSURE_PATH, NOWATER, 0)) {
        sRandDest = NOWHERE;
        continue; // try again!
      }

      // passed all the tests, ->sDestination is acceptable
      fFound = true;
      pSoldier.bPathStored = true; // optimization - Ian
    }
  }

  return (sRandDest); // defaults to NOWHERE
}

export function ClosestReachableDisturbance(pSoldier: SOLDIERTYPE, ubUnconsciousOK: UINT8, pfChangeLevel: Pointer<boolean>): INT16 {
  let psLastLoc: Pointer<INT16>;
  let pusNoiseGridNo: Pointer<INT16>;
  let pbLastLevel: Pointer<INT8>;
  let sGridNo: INT16 = -1;
  let bLevel: INT8;
  let bClosestLevel: INT8;
  let fClimbingNecessary: boolean;
  let fClosestClimbingNecessary: boolean = false;
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
  let pOpp: SOLDIERTYPE;

  // CJC: can't trace a path to every known disturbance!
  // for starters, try the closest one as the crow flies
  let sClosestEnemy: INT16 = NOWHERE;
  let sDistToClosestEnemy: INT16 = 1000;
  let sDistToEnemy: INT16;

  pfChangeLevel.value = false;

  pubNoiseVolume = addressof(gubPublicNoiseVolume[pSoldier.bTeam]);
  pusNoiseGridNo = addressof(gsPublicNoiseGridno[pSoldier.bTeam]);
  pbNoiseLevel = addressof(gbPublicNoiseLevel[pSoldier.bTeam]);

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
    if (CONSIDERED_NEUTRAL(pSoldier, pOpp) || (pSoldier.bSide == pOpp.bSide)) {
      continue; // next merc
    }

    pbPersOL = pSoldier.bOppList + pOpp.ubID;
    pbPublOL = gbPublicOpplist[pSoldier.bTeam] + pOpp.ubID;
    psLastLoc = gsLastKnownOppLoc[pSoldier.ubID] + pOpp.ubID;
    pbLastLevel = gbLastKnownOppLevel[pSoldier.ubID] + pOpp.ubID;

    // if this opponent is unknown personally and publicly
    if ((pbPersOL.value == NOT_HEARD_OR_SEEN) && (pbPublOL.value == NOT_HEARD_OR_SEEN)) {
      continue; // next merc
    }

    // this is possible if get here from BLACK AI in one of those rare
    // instances when we couldn't get a meaningful shot off at a guy in sight
    if ((pbPersOL.value == SEEN_CURRENTLY) && (pOpp.bLife >= OKLIFE)) {
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
      sGridNo = gsPublicLastKnownOppLoc[pSoldier.bTeam][pOpp.ubID];
      bLevel = gbPublicLastKnownOppLevel[pSoldier.bTeam][pOpp.ubID];
    }

    // if we are standing at that gridno (!, obviously our info is old...)
    if (sGridNo == pSoldier.sGridNo) {
      continue; // next merc
    }

    if (sGridNo == NOWHERE) {
      // huh?
      continue;
    }

    sDistToEnemy = PythSpacesAway(pSoldier.sGridNo, sGridNo);
    if (sDistToEnemy < sDistToClosestEnemy)
      ;
    {
      sClosestEnemy = sGridNo;
      bClosestLevel = bLevel;
      sDistToClosestEnemy = sDistToEnemy;
    }
  }

  if (sClosestEnemy != NOWHERE) {
    iPathCost = EstimatePathCostToLocation(pSoldier, sClosestEnemy, bClosestLevel, false, addressof(fClimbingNecessary), addressof(sClimbGridNo));
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
  if (pSoldier.sNoiseGridno != NOWHERE && pSoldier.sNoiseGridno != sClosestDisturbance) {
    // test this gridno, too
    sGridNo = pSoldier.sNoiseGridno;
    bLevel = pSoldier.bNoiseLevel;

    // if we are there (at the noise gridno)
    if (sGridNo == pSoldier.sGridNo) {
      pSoldier.sNoiseGridno = NOWHERE; // wipe it out, not useful anymore
      pSoldier.ubNoiseVolume = 0;
    } else {
      // get the AP cost to get to the location of the noise
      iPathCost = EstimatePathCostToLocation(pSoldier, sGridNo, bLevel, false, addressof(fClimbingNecessary), addressof(sClimbGridNo));
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
    if (pSoldier.bLevel != bLevel || PythSpacesAway(pSoldier.sGridNo, sGridNo) >= 6 || SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, bLevel, 0, MaxDistanceVisible(), false) == 0)
    // if we are NOT there (at the noise gridno)
    //	if (sGridNo != pSoldier->sGridNo)
    {
      // get the AP cost to get to the location of the noise
      iPathCost = EstimatePathCostToLocation(pSoldier, sGridNo, bLevel, false, addressof(fClimbingNecessary), addressof(sClimbGridNo));
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

export function ClosestKnownOpponent(pSoldier: SOLDIERTYPE, psGridNo: Pointer<INT16>, pbLevel: Pointer<INT8>): INT16 {
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
  let pOpp: SOLDIERTYPE;

  bClosestLevel = -1;

  // NOTE: THIS FUNCTION ALLOWS RETURN OF UNCONSCIOUS AND UNREACHABLE OPPONENTS
  psLastLoc = addressof(gsLastKnownOppLoc[pSoldier.ubID][0]);

  // hang pointers at start of this guy's personal and public opponent opplists
  pbPersOL = addressof(pSoldier.bOppList[0]);
  pbPublOL = addressof(gbPublicOpplist[pSoldier.bTeam][0]);

  // look through this man's personal & public opplists for opponents known
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpp = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pOpp) {
      continue; // next merc
    }

    // if this merc is neutral/on same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpp) || (pSoldier.bSide == pOpp.bSide)) {
      continue; // next merc
    }

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.bAttitude == Enum242.ATTACKSLAYONLY && pOpp.ubProfile != 64) {
      continue; // next opponent
    }

    pbPersOL = pSoldier.bOppList + pOpp.ubID;
    pbPublOL = gbPublicOpplist[pSoldier.bTeam] + pOpp.ubID;
    psLastLoc = gsLastKnownOppLoc[pSoldier.ubID] + pOpp.ubID;

    // if this opponent is unknown personally and publicly
    if ((pbPersOL.value == NOT_HEARD_OR_SEEN) && (pbPublOL.value == NOT_HEARD_OR_SEEN)) {
      continue; // next merc
    }

    // if personal knowledge is more up to date or at least equal
    if ((gubKnowledgeValue[pbPublOL.value - OLDEST_HEARD_VALUE][pbPersOL.value - OLDEST_HEARD_VALUE] > 0) || (pbPersOL.value == pbPublOL.value)) {
      // using personal knowledge, obtain opponent's "best guess" gridno
      sGridNo = gsLastKnownOppLoc[pSoldier.ubID][pOpp.ubID];
      bLevel = gbLastKnownOppLevel[pSoldier.ubID][pOpp.ubID];
    } else {
      // using public knowledge, obtain opponent's "best guess" gridno
      sGridNo = gsPublicLastKnownOppLoc[pSoldier.bTeam][pOpp.ubID];
      bLevel = gbPublicLastKnownOppLevel[pSoldier.bTeam][pOpp.ubID];
    }

    // if we are standing at that gridno(!, obviously our info is old...)
    if (sGridNo == pSoldier.sGridNo) {
      continue; // next merc
    }

    // this function is used only for turning towards closest opponent or changing stance
    // as such, if they AI is in a building,
    // we should ignore people who are on the roof of the same building as the AI
    if ((bLevel != pSoldier.bLevel) && SameBuilding(pSoldier.sGridNo, sGridNo)) {
      continue;
    }

    // I hope this will be good enough; otherwise we need a fractional/world-units-based 2D distance function
    // sRange = PythSpacesAway( pSoldier->sGridNo, sGridNo);
    iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.sGridNo, sGridNo);

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

export function ClosestSeenOpponent(pSoldier: SOLDIERTYPE, psGridNo: Pointer<INT16>, pbLevel: Pointer<INT8>): INT16 {
  let sGridNo: INT16;
  let sClosestOpponent: INT16 = NOWHERE;
  let uiLoop: UINT32;
  let iRange: INT32;
  let iClosestRange: INT32 = 1500;
  let pbPersOL: Pointer<INT8>;
  let bLevel: INT8;
  let bClosestLevel: INT8;
  let pOpp: SOLDIERTYPE;

  bClosestLevel = -1;

  // look through this man's personal & public opplists for opponents known
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpp = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pOpp) {
      continue; // next merc
    }

    // if this merc is neutral/on same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpp) || (pSoldier.bSide == pOpp.bSide)) {
      continue; // next merc
    }

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.bAttitude == Enum242.ATTACKSLAYONLY && pOpp.ubProfile != 64) {
      continue; // next opponent
    }

    pbPersOL = pSoldier.bOppList + pOpp.ubID;

    // if this opponent is not seen personally
    if (pbPersOL.value != SEEN_CURRENTLY) {
      continue; // next merc
    }

    // since we're dealing with seen people, use exact gridnos
    sGridNo = pOpp.sGridNo;
    bLevel = pOpp.bLevel;

    // if we are standing at that gridno(!, obviously our info is old...)
    if (sGridNo == pSoldier.sGridNo) {
      continue; // next merc
    }

    // this function is used only for turning towards closest opponent or changing stance
    // as such, if they AI is in a building,
    // we should ignore people who are on the roof of the same building as the AI
    if ((bLevel != pSoldier.bLevel) && SameBuilding(pSoldier.sGridNo, sGridNo)) {
      continue;
    }

    // I hope this will be good enough; otherwise we need a fractional/world-units-based 2D distance function
    // sRange = PythSpacesAway( pSoldier->sGridNo, sGridNo);
    iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.sGridNo, sGridNo);

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

export function ClosestPC(pSoldier: SOLDIERTYPE, psDistance: Pointer<INT16>): INT16 {
  // used by NPCs... find the closest PC

  // NOTE: skips EPCs!

  let ubLoop: UINT8;
  let pTargetSoldier: SOLDIERTYPE;
  let sMinDist: INT16 = WORLD_MAX;
  let sDist: INT16;
  let sGridNo: INT16 = NOWHERE;

  // Loop through all mercs on player team
  ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  for (; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++) {
    pTargetSoldier = Menptr[ubLoop];

    if (!pTargetSoldier.bActive || !pTargetSoldier.bInSector) {
      continue;
    }

    // if not conscious, skip him
    if (pTargetSoldier.bLife < OKLIFE) {
      continue;
    }

    if (AM_AN_EPC(pTargetSoldier)) {
      continue;
    }

    sDist = PythSpacesAway(pSoldier.sGridNo, pTargetSoldier.sGridNo);

    // if this PC is not visible to the soldier, then add a penalty to the distance
    // so that we weight in favour of visible mercs
    if (pTargetSoldier.bTeam != pSoldier.bTeam && pSoldier.bOppList[ubLoop] != SEEN_CURRENTLY) {
      sDist += 10;
    }

    if (sDist < sMinDist) {
      sMinDist = sDist;
      sGridNo = pTargetSoldier.sGridNo;
    }
  }

  if (psDistance) {
    psDistance.value = sMinDist;
  }

  return sGridNo;
}

function FindClosestClimbPointAvailableToAI(pSoldier: SOLDIERTYPE, sStartGridNo: INT16, sDesiredGridNo: INT16, fClimbUp: boolean): INT16 {
  let sGridNo: INT16;
  let sRoamingOrigin: INT16;
  let sRoamingRange: INT16;

  if (pSoldier.uiStatusFlags & SOLDIER_PC) {
    sRoamingOrigin = pSoldier.sGridNo;
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

export function ClimbingNecessary(pSoldier: SOLDIERTYPE, sDestGridNo: INT16, bDestLevel: INT8): boolean {
  if (pSoldier.bLevel == bDestLevel) {
    if ((pSoldier.bLevel == 0) || (gubBuildingInfo[pSoldier.sGridNo] == gubBuildingInfo[sDestGridNo])) {
      return false;
    } else // different buildings!
    {
      return true;
    }
  } else {
    return true;
  }
}

export function GetInterveningClimbingLocation(pSoldier: SOLDIERTYPE, sDestGridNo: INT16, bDestLevel: INT8, pfClimbingNecessary: Pointer<boolean>): INT16 {
  if (pSoldier.bLevel == bDestLevel) {
    if ((pSoldier.bLevel == 0) || (gubBuildingInfo[pSoldier.sGridNo] == gubBuildingInfo[sDestGridNo])) {
      // on ground or same building... normal!
      pfClimbingNecessary.value = false;
      return NOWHERE;
    } else {
      // different buildings!
      // yes, pass in same gridno twice... want closest climb-down spot for building we are on!
      pfClimbingNecessary.value = true;
      return FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.sGridNo, pSoldier.sGridNo, false);
    }
  } else {
    pfClimbingNecessary.value = true;
    // different levels
    if (pSoldier.bLevel == 0) {
      // got to go UP onto building
      return FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.sGridNo, sDestGridNo, true);
    } else {
      // got to go DOWN off building
      return FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.sGridNo, pSoldier.sGridNo, false);
    }
  }
}

export function EstimatePathCostToLocation(pSoldier: SOLDIERTYPE, sDestGridNo: INT16, bDestLevel: INT8, fAddCostAfterClimbingUp: boolean, pfClimbingNecessary: Pointer<boolean>, psClimbGridNo: Pointer<INT16>): INT16 {
  let sPathCost: INT16;
  let sClimbGridNo: INT16;

  if (pSoldier.bLevel == bDestLevel) {
    if ((pSoldier.bLevel == 0) || (gubBuildingInfo[pSoldier.sGridNo] == gubBuildingInfo[sDestGridNo])) {
      // on ground or same building... normal!
      sPathCost = EstimatePlotPath(pSoldier, sDestGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, Enum193.WALKING, NOT_STEALTH, FORWARD, 0);
      pfClimbingNecessary.value = false;
      psClimbGridNo.value = NOWHERE;
    } else {
      // different buildings!
      // yes, pass in same gridno twice... want closest climb-down spot for building we are on!
      sClimbGridNo = FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.sGridNo, pSoldier.sGridNo, false);
      if (sClimbGridNo == NOWHERE) {
        sPathCost = 0;
      } else {
        sPathCost = PlotPath(pSoldier, sClimbGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, Enum193.WALKING, NOT_STEALTH, FORWARD, 0);
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
          pfClimbingNecessary.value = true;
          psClimbGridNo.value = sClimbGridNo;
        }
      }
    }
  } else {
    // different levels
    if (pSoldier.bLevel == 0) {
      // got to go UP onto building
      sClimbGridNo = FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.sGridNo, sDestGridNo, true);
    } else {
      // got to go DOWN off building
      sClimbGridNo = FindClosestClimbPointAvailableToAI(pSoldier, pSoldier.sGridNo, pSoldier.sGridNo, false);
    }

    if (sClimbGridNo == NOWHERE) {
      sPathCost = 0;
    } else {
      sPathCost = PlotPath(pSoldier, sClimbGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, Enum193.WALKING, NOT_STEALTH, FORWARD, 0);
      if (sPathCost != 0) {
        // add in the cost of climbing up or down
        if (pSoldier.bLevel == 0) {
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
        pfClimbingNecessary.value = true;
        psClimbGridNo.value = sClimbGridNo;
      }
    }
  }

  return sPathCost;
}

function GuySawEnemyThisTurnOrBefore(pSoldier: SOLDIERTYPE): boolean {
  let ubTeamLoop: UINT8;
  let ubIDLoop: UINT8;

  for (ubTeamLoop = 0; ubTeamLoop < MAXTEAMS; ubTeamLoop++) {
    if (gTacticalStatus.Team[ubTeamLoop].bSide != pSoldier.bSide) {
      // consider guys in this team, which isn't on our side
      for (ubIDLoop = gTacticalStatus.Team[ubTeamLoop].bFirstID; ubIDLoop <= gTacticalStatus.Team[ubTeamLoop].bLastID; ubIDLoop++) {
        // if this guy SAW an enemy recently...
        if (pSoldier.bOppList[ubIDLoop] >= SEEN_CURRENTLY) {
          return true;
        }
      }
    }
  }

  return false;
}

export function ClosestReachableFriendInTrouble(pSoldier: SOLDIERTYPE, pfClimbingNecessary: Pointer<boolean>): INT16 {
  let uiLoop: UINT32;
  let sPathCost: INT16;
  let sClosestFriend: INT16 = NOWHERE;
  let sShortestPath: INT16 = 1000;
  let sClimbGridNo: INT16;
  let fClimbingNecessary: boolean;
  let fClosestClimbingNecessary: boolean = false;
  let pFriend: SOLDIERTYPE;

  // civilians don't really have any "friends", so they don't bother with this
  if (PTR_CIVILIAN(pSoldier)) {
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
    if (pFriend.bNeutral || (pSoldier.bSide != pFriend.bSide)) {
      continue; // next merc
    }

    // if this "friend" is actually US
    if (pFriend.ubID == pSoldier.ubID) {
      continue; // next merc
    }

    // CJC: restrict "last one to radio" to only if that guy saw us this turn or last turn

    // if this friend is not under fire, and isn't the last one to radio
    if (!(pFriend.bUnderFire || (pFriend.ubID == gTacticalStatus.Team[pFriend.bTeam].ubLastMercToRadio && GuySawEnemyThisTurnOrBefore(pFriend)))) {
      continue; // next merc
    }

    // if we're already neighbors
    if (SpacesAway(pSoldier.sGridNo, pFriend.sGridNo) == 1) {
      continue; // next merc
    }

    // get the AP cost to go to this friend's gridno
    sPathCost = EstimatePathCostToLocation(pSoldier, pFriend.sGridNo, pFriend.bLevel, true, addressof(fClimbingNecessary), addressof(sClimbGridNo));

    // if we can get there
    if (sPathCost != 0) {
      // sprintf(tempstr,"Path cost to friend %s's location is %d",pFriend->name,pathCost);
      // PopMessage(tempstr);

      if (sPathCost < sShortestPath) {
        if (fClimbingNecessary) {
          sClosestFriend = sClimbGridNo;
        } else {
          sClosestFriend = pFriend.sGridNo;
        }

        sShortestPath = sPathCost;
        fClosestClimbingNecessary = fClimbingNecessary;
      }
    }
  }

  pfClimbingNecessary.value = fClosestClimbingNecessary;
  return sClosestFriend;
}

export function DistanceToClosestFriend(pSoldier: SOLDIERTYPE): INT16 {
  // find the distance to the closest person on the same team
  let ubLoop: UINT8;
  let pTargetSoldier: SOLDIERTYPE;
  let sMinDist: INT16 = 1000;
  let sDist: INT16;

  // Loop through all mercs on player team
  ubLoop = gTacticalStatus.Team[pSoldier.bTeam].bFirstID;

  for (; ubLoop <= gTacticalStatus.Team[pSoldier.bTeam].bLastID; ubLoop++) {
    if (ubLoop == pSoldier.ubID) {
      // same guy - continue!
      continue;
    }

    pTargetSoldier = Menptr[ubLoop];

    if (pSoldier.bActive && pSoldier.bInSector) {
      if (!pTargetSoldier.bActive || !pTargetSoldier.bInSector) {
        continue;
      }
      // if not conscious, skip him
      else if (pTargetSoldier.bLife < OKLIFE) {
        continue;
      }
    } else {
      // compare sector #s
      if ((pSoldier.sSectorX != pTargetSoldier.sSectorX) || (pSoldier.sSectorY != pTargetSoldier.sSectorY) || (pSoldier.bSectorZ != pTargetSoldier.bSectorZ)) {
        continue;
      } else if (pTargetSoldier.bLife < OKLIFE) {
        continue;
      } else {
        // well there's someone who could be near
        return 1;
      }
    }

    sDist = SpacesAway(pSoldier.sGridNo, pTargetSoldier.sGridNo);

    if (sDist < sMinDist) {
      sMinDist = sDist;
    }
  }

  return sMinDist;
}

export function InWaterGasOrSmoke(pSoldier: SOLDIERTYPE, sGridNo: INT16): boolean {
  if (WaterTooDeepForAttacks(sGridNo)) {
    return true;
  }

  // smoke
  if (gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.bLevel] & MAPELEMENT_EXT_SMOKE) {
    return true;
  }

  // tear/mustard gas
  if ((gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.bLevel] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) && (pSoldier.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK && pSoldier.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK)) {
    return true;
  }

  return false;
}

export function InGasOrSmoke(pSoldier: SOLDIERTYPE, sGridNo: INT16): boolean {
  // smoke
  if (gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.bLevel] & MAPELEMENT_EXT_SMOKE) {
    return true;
  }

  // tear/mustard gas
  if ((gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.bLevel] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) && (pSoldier.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK && pSoldier.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK)) {
    return true;
  }

  return false;
}

export function InWaterOrGas(pSoldier: SOLDIERTYPE, sGridNo: INT16): boolean {
  if (WaterTooDeepForAttacks(sGridNo)) {
    return true;
  }

  // tear/mustard gas
  if ((gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.bLevel] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) && (pSoldier.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK && pSoldier.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK)) {
    return true;
  }

  return false;
}

export function InGas(pSoldier: SOLDIERTYPE, sGridNo: INT16): boolean {
  // tear/mustard gas
  if ((gpWorldLevelData[sGridNo].ubExtFlags[pSoldier.bLevel] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) && (pSoldier.inv[Enum261.HEAD1POS].usItem != Enum225.GASMASK && pSoldier.inv[Enum261.HEAD2POS].usItem != Enum225.GASMASK)) {
    return true;
  }

  return false;
}

export function WearGasMaskIfAvailable(pSoldier: SOLDIERTYPE): boolean {
  let bSlot: INT8;
  let bNewSlot: INT8;

  bSlot = FindObj(pSoldier, Enum225.GASMASK);
  if (bSlot == NO_SLOT) {
    return false;
  }
  if (bSlot == Enum261.HEAD1POS || bSlot == Enum261.HEAD2POS) {
    return false;
  }
  if (pSoldier.inv[Enum261.HEAD1POS].usItem == NOTHING) {
    bNewSlot = Enum261.HEAD1POS;
  } else if (pSoldier.inv[Enum261.HEAD2POS].usItem == NOTHING) {
    bNewSlot = Enum261.HEAD2POS;
  } else {
    // screw it, going in position 1 anyhow
    bNewSlot = Enum261.HEAD1POS;
  }

  RearrangePocket(pSoldier, bSlot, bNewSlot, FOREVER);
  return true;
}

export function InLightAtNight(sGridNo: INT16, bLevel: INT8): boolean {
  let ubBackgroundLightLevel: UINT8;

  // do not consider us to be "in light" if we're in an underground sector
  if (gbWorldSectorZ > 0) {
    return false;
  }

  ubBackgroundLightLevel = GetTimeOfDayAmbientLightLevel();

  if (ubBackgroundLightLevel < NORMAL_LIGHTLEVEL_DAY + 2) {
    // don't consider it nighttime, too close to daylight levels
    return false;
  }

  // could've been placed here, ignore the light
  if (InARoom(sGridNo) !== -1) {
    return false;
  }

  // NB light levels are backwards, so a lower light level means the
  // spot in question is BRIGHTER

  if (LightTrueLevel(sGridNo, bLevel) < ubBackgroundLightLevel) {
    return true;
  }

  return false;
}

export function CalcMorale(pSoldier: SOLDIERTYPE): INT8 {
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
  let pOpponent: SOLDIERTYPE;
  let pFriend: SOLDIERTYPE;

  // if army guy has NO weapons left then panic!
  if (pSoldier.bTeam == ENEMY_TEAM) {
    if (FindAIUsableObjClass(pSoldier, IC_WEAPON) == NO_SLOT) {
      return Enum244.MORALE_HOPELESS;
    }
  }

  // hang pointers to my personal opplist, my team's public opplist, and my
  // list of previously seen opponents
  pSeenOpp = addressof(gbSeenOpponents[pSoldier.ubID][0]);

  // loop through every one of my possible opponents
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpponent = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, dead, unconscious
    if (!pOpponent || (pOpponent.bLife < OKLIFE))
      continue; // next merc

    // if this merc is neutral/on same side, he's not an opponent, skip him!
    if (CONSIDERED_NEUTRAL(pSoldier, pOpponent) || (pSoldier.bSide == pOpponent.bSide))
      continue; // next merc

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.bAttitude == Enum242.ATTACKSLAYONLY && pOpponent.ubProfile != 64) {
      continue; // next opponent
    }

    pbPersOL = pSoldier.bOppList + pOpponent.ubID;
    pbPublOL = gbPublicOpplist[pSoldier.bTeam] + pOpponent.ubID;
    pSeenOpp = gbSeenOpponents[pSoldier.ubID] + pOpponent.ubID;

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

    sOppThreatValue = (iPercent * CalcManThreatValue(pOpponent, pSoldier.sGridNo, false, pSoldier)) / 100;

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
      if (!pFriend || (pFriend.bLife < OKLIFE))
        continue; // next merc

      // if this merc is not on my side, then he's NOT one of my friends

      // WE CAN'T AFFORD TO CONSIDER THE ENEMY OF MY ENEMY MY FRIEND, HERE!
      // ONLY IF WE ARE ACTUALLY OFFICIALLY CO-OPERATING TOGETHER (SAME SIDE)
      if (pFriend.bNeutral && !(pSoldier.ubCivilianGroup != Enum246.NON_CIV_GROUP && pSoldier.ubCivilianGroup == pFriend.ubCivilianGroup)) {
        continue; // next merc
      }

      if (pSoldier.bSide != pFriend.bSide)
        continue; // next merc

      // THIS TEST IS INVALID IF A COMPUTER-TEAM IS PLAYING CO-OPERATIVELY
      // WITH A NON-COMPUTER TEAM SINCE THE OPPLISTS INVOLVED ARE NOT
      // UP-TO-DATE.  THIS SITUATION IS CURRENTLY NOT POSSIBLE IN HTH/DG.

      // ALSO NOTE THAT WE COUNT US AS OUR (BEST) FRIEND FOR THESE CALCULATIONS

      // subtract HEARD_2_TURNS_AGO (which is negative) to make values start at 0 and
      // be positive otherwise
      iPercent = ThreatPercent[pFriend.bOppList[pOpponent.ubID] - OLDEST_HEARD_VALUE];

      // reduce the percentage value based on how far away they are from the enemy, if they only hear him
      if (pFriend.bOppList[pOpponent.ubID] <= HEARD_LAST_TURN) {
        iPercent -= PythSpacesAway(pSoldier.sGridNo, pFriend.sGridNo) * 2;
        if (iPercent <= 0) {
          // ignore!
          continue;
        }
      }

      sFrndThreatValue = (iPercent * CalcManThreatValue(pFriend, pOpponent.sGridNo, false, pSoldier)) / 100;

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

  switch (pSoldier.bAttitude) {
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
  if (pSoldier.ubSoldierClass == Enum262.SOLDIER_CLASS_ADMINISTRATOR) {
    bMoraleCategory += 2;
  }

  // if still full of energy
  if (pSoldier.bBreath > 75)
    bMoraleCategory++;
  else {
    // if getting a bit low on breath
    if (pSoldier.bBreath < 40)
      bMoraleCategory--;

    // if getting REALLY low on breath
    if (pSoldier.bBreath < 10)
      bMoraleCategory--;
  }

  // if still very healthy
  if (pSoldier.bLife > 75)
    bMoraleCategory++;
  else {
    // if getting a bit low on life
    if (pSoldier.bLife < 40)
      bMoraleCategory--;

    // if getting REALLY low on life
    if (pSoldier.bLife < 20)
      bMoraleCategory--;
  }

  // if soldier is currently not under fire
  if (!pSoldier.bUnderFire)
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
  if (bMoraleCategory == Enum244.MORALE_HOPELESS && (pSoldier.bAttitude == Enum242.BRAVESOLO || pSoldier.bAttitude == Enum242.BRAVEAID))
    bMoraleCategory = Enum244.MORALE_WORRIED;

  return bMoraleCategory;
}

export function CalcManThreatValue(pEnemy: SOLDIERTYPE, sMyGrid: INT16, ubReduceForCover: boolean, pMe: SOLDIERTYPE): INT32 {
  let iThreatValue: INT32 = 0;
  let fForCreature: boolean = CREATURE_OR_BLOODCAT(pMe);

  // If man is inactive, at base, on assignment, dead, unconscious
  if (!pEnemy.bActive || !pEnemy.bInSector || !pEnemy.bLife) {
    // he's no threat at all, return a negative number
    iThreatValue = -999;
    return iThreatValue;
  }

  // in boxing mode, let only a boxer be considered a threat.
  if ((gTacticalStatus.bBoxingState == Enum247.BOXING) && !(pEnemy.uiStatusFlags & SOLDIER_BOXER)) {
    iThreatValue = -999;
    return iThreatValue;
  }

  if (fForCreature) {
    // health (1-100)
    iThreatValue += pEnemy.bLife;
    // bleeding (more attactive!) (1-100)
    iThreatValue += pEnemy.bBleeding;
    // decrease according to distance
    iThreatValue = (iThreatValue * 10) / (10 + PythSpacesAway(sMyGrid, pEnemy.sGridNo));
  } else {
    // ADD twice the man's level (2-20)
    iThreatValue += pEnemy.bExpLevel;

    // ADD man's total action points (10-35)
    iThreatValue += CalcActionPoints(pEnemy);

    // ADD 1/2 of man's current action points (4-17)
    iThreatValue += (pEnemy.bActionPoints / 2);

    // ADD 1/10 of man's current health (0-10)
    iThreatValue += (pEnemy.bLife / 10);

    if (pEnemy.bAssignment < Enum117.ON_DUTY) {
      // ADD 1/4 of man's protection percentage (0-25)
      iThreatValue += ArmourPercent(pEnemy) / 4;

      // ADD 1/5 of man's marksmanship skill (0-20)
      iThreatValue += (pEnemy.bMarksmanship / 5);

      if (Item[pEnemy.inv[Enum261.HANDPOS].usItem].usItemClass & IC_WEAPON) {
        // ADD the deadliness of the item(weapon) he's holding (0-50)
        iThreatValue += Weapon[pEnemy.inv[Enum261.HANDPOS].usItem].ubDeadliness;
      }
    }

    // SUBTRACT 1/5 of man's bleeding (0-20)
    iThreatValue -= (pEnemy.bBleeding / 5);

    // SUBTRACT 1/10 of man's breath deficiency (0-10)
    iThreatValue -= ((100 - pEnemy.bBreath) / 10);

    // SUBTRACT man's current shock value
    iThreatValue -= pEnemy.bShock;
  }

  // if I have a specifically defined spot where I'm at (sometime I don't!)
  if (sMyGrid != NOWHERE) {
    // ADD 10% if man's already been shooting at me
    if (pEnemy.sLastTarget == sMyGrid) {
      iThreatValue += (iThreatValue / 10);
    } else {
      // ADD 5% if man's already facing me
      if (pEnemy.bDirection == atan8(CenterX(pEnemy.sGridNo), CenterY(pEnemy.sGridNo), CenterX(sMyGrid), CenterY(sMyGrid))) {
        iThreatValue += (iThreatValue / 20);
      }
    }
  }

  // if this man is conscious
  if (pEnemy.bLife >= OKLIFE) {
    // and we were told to reduce threat for my cover
    if (ubReduceForCover && (sMyGrid != NOWHERE)) {
      // Reduce iThreatValue to same % as the chance HE has shoot through at ME
      // iThreatValue = (iThreatValue * ChanceToGetThrough( pEnemy, myGrid, FAKE, ACTUAL, TESTWALLS, 9999, M9PISTOL, NOT_FOR_LOS)) / 100;
      // iThreatValue = (iThreatValue * SoldierTo3DLocationChanceToGetThrough( pEnemy, myGrid, FAKE, ACTUAL, TESTWALLS, 9999, M9PISTOL, NOT_FOR_LOS)) / 100;
      iThreatValue = (iThreatValue * SoldierToLocationChanceToGetThrough(pEnemy, sMyGrid, pMe.bLevel, 0, pMe.ubID)) / 100;
    }
  } else {
    // if he's still something of a threat
    if (iThreatValue > 0) {
      // drastically reduce his threat value (divide by 5 to 18)
      iThreatValue /= (4 + (OKLIFE - pEnemy.bLife));
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

export function RoamingRange(pSoldier: SOLDIERTYPE, pusFromGridNo: Pointer<INT16>): INT16 {
  if (CREATURE_OR_BLOODCAT(pSoldier)) {
    if (pSoldier.bAlertStatus == Enum243.STATUS_BLACK) {
      pusFromGridNo.value = pSoldier.sGridNo; // from current position!
      return MAX_ROAMING_RANGE;
    }
  }
  if (pSoldier.bOrders == Enum241.POINTPATROL || pSoldier.bOrders == Enum241.RNDPTPATROL) {
    // roam near NEXT PATROL POINT, not from where merc starts out
    pusFromGridNo.value = pSoldier.usPatrolGrid[pSoldier.bNextPatrolPnt];
  } else {
    // roam around where mercs started
    //*pusFromGridNo = pSoldier->sInitialGridNo;
    pusFromGridNo.value = pSoldier.usPatrolGrid[0];
  }

  switch (pSoldier.bOrders) {
    // JA2 GOLD: give non-NPCs a 5 tile roam range for cover in combat when being shot at
    case Enum241.STATIONARY:
      if (pSoldier.ubProfile != NO_PROFILE || (pSoldier.bAlertStatus < Enum243.STATUS_BLACK && !(pSoldier.bUnderFire))) {
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
      if (pSoldier.bAlertStatus < Enum243.STATUS_RED) {
        return 25;
      } else {
        return 50;
      }
    case Enum241.ONCALL:
      if (pSoldier.bAlertStatus < Enum243.STATUS_RED) {
        return 10;
      } else {
        return 30;
      }
    case Enum241.SEEKENEMY:
      pusFromGridNo.value = pSoldier.sGridNo; // from current position!
      return MAX_ROAMING_RANGE;
    default:
      return 0;
  }
}

export function RearrangePocket(pSoldier: SOLDIERTYPE, bPocket1: INT8, bPocket2: INT8, bPermanent: UINT8 /* boolean */): void {
  // NB there's no such thing as a temporary swap for now...
  SwapObjs(pSoldier.inv[bPocket1], pSoldier.inv[bPocket2]);
}

export function FindBetterSpotForItem(pSoldier: SOLDIERTYPE, bSlot: INT8): boolean {
  // looks for a place in the slots to put an item in a hand or armour
  // position, and moves it there.
  if (bSlot >= Enum261.BIGPOCK1POS) {
    return false;
  }
  if (pSoldier.inv[bSlot].usItem == NOTHING) {
    // well that's just fine then!
    return true;
  }

  if (Item[pSoldier.inv[bSlot].usItem].ubPerPocket == 0) {
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
    return false;
  }
  RearrangePocket(pSoldier, Enum261.HANDPOS, bSlot, FOREVER);
  return true;
}

export function GetTraversalQuoteActionID(bDirection: INT8): UINT8 {
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

export function SoldierDifficultyLevel(pSoldier: SOLDIERTYPE): UINT8 {
  let bDifficultyBase: INT8;
  let bDifficulty: INT8;

  // difficulty modifier ranges from 0 to 100
  // and we want to end up with a number between 0 and 4 (4=hardest)
  // to a base of 1, divide by 34 to get a range from 1 to 3
  bDifficultyBase = 1 + (CalcDifficultyModifier(pSoldier.ubSoldierClass) / 34);

  switch (pSoldier.ubSoldierClass) {
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
      if (pSoldier.bTeam == CREATURE_TEAM) {
        bDifficulty = bDifficultyBase + pSoldier.bLevel / 4;
      } else // civ...
      {
        bDifficulty = (bDifficultyBase + pSoldier.bLevel / 4) - 1;
      }
      break;
  }

  bDifficulty = Math.max(bDifficulty, 0);
  bDifficulty = Math.min(bDifficulty, 4);

  return bDifficulty;
}

export function ValidCreatureTurn(pCreature: SOLDIERTYPE, bNewDirection: INT8): boolean {
  let bDirChange: INT8;
  let bTempDir: INT8;
  let bLoop: INT8;
  let fFound: boolean;

  bDirChange = QuickestDirection(pCreature.bDirection, bNewDirection);

  for (bLoop = 0; bLoop < 2; bLoop++) {
    fFound = true;

    bTempDir = pCreature.bDirection;

    do {
      bTempDir += bDirChange;
      if (bTempDir < Enum245.NORTH) {
        bTempDir = Enum245.NORTHWEST;
      } else if (bTempDir > Enum245.NORTHWEST) {
        bTempDir = Enum245.NORTH;
      }
      if (!InternalIsValidStance(pCreature, bTempDir, ANIM_STAND)) {
        fFound = false;
        break;
      }
    } while (bTempDir != bNewDirection);

    if (fFound) {
      break;
    } else if (bLoop > 0) {
      // can't find a dir!
      return false;
    } else {
      // try the other direction
      bDirChange = bDirChange * -1;
    }
  }

  return true;
}

export function RangeChangeDesire(pSoldier: SOLDIERTYPE): INT32 {
  let iRangeFactorMultiplier: INT32;

  iRangeFactorMultiplier = pSoldier.bAIMorale - 1;
  switch (pSoldier.bAttitude) {
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

export function ArmySeesOpponents(): boolean {
  let cnt: INT32;
  let pSoldier: SOLDIERTYPE;

  for (cnt = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; cnt <= gTacticalStatus.Team[ENEMY_TEAM].bLastID; cnt++) {
    pSoldier = MercPtrs[cnt];

    if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE && pSoldier.bOppCnt > 0) {
      return true;
    }
  }

  return false;
}

}
