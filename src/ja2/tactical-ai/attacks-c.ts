namespace ja2 {

//
// CJC DG->JA2 conversion notes
//
// Still commented out:
//
// EstimateShotDamage - stuff related to legs?
// EstimateStabDamage - stuff related to armour
// EstimateThrowDamage - waiting for grenade, armour definitions
// CheckIfTossPossible - waiting for grenade definitions

// this define should go in soldier control.h

export function LoadWeaponIfNeeded(pSoldier: Pointer<SOLDIERTYPE>): void {
  let usInHand: UINT16;
  let bPayloadPocket: INT8;

  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  // if he's got a MORTAR in his hand, make sure he has a MORTARSHELL avail.
  if (usInHand == Enum225.MORTAR) {
    bPayloadPocket = FindObj(pSoldier, Enum225.MORTAR_SHELL);
    if (bPayloadPocket == NO_SLOT) {
      return; // no shells, can't fire the MORTAR
    }
  }
  // if he's got a GL in his hand, make sure he has some type of GRENADE avail.
  else if (usInHand == Enum225.GLAUNCHER) {
    bPayloadPocket = FindGLGrenade(pSoldier);
    if (bPayloadPocket == NO_SLOT) {
      return; // no grenades, can't fire the GLAUNCHER
    }
  } else if (usInHand == Enum225.TANK_CANNON) {
    bPayloadPocket = FindLaunchable(pSoldier, Enum225.TANK_CANNON);
    if (bPayloadPocket == NO_SLOT) {
      return;
    }
  } else {
    // regular hand-thrown grenade in hand, nothing to load!
    return;
  }

  // remove payload from its pocket, and add it as the hand weapon's first attachment
  pSoldier.value.inv[Enum261.HANDPOS].usAttachItem[0] = pSoldier.value.inv[bPayloadPocket].usItem;
  pSoldier.value.inv[Enum261.HANDPOS].bAttachStatus[0] = pSoldier.value.inv[bPayloadPocket].bStatus[0];

  if (TANK(pSoldier)) {
    // don't remove ammo
    return;
  }
  // if there's only one in payload pocket (only/last grenade, or any shell)
  if ((Item[pSoldier.value.inv[bPayloadPocket].usItem].ubPerPocket == 1) || (pSoldier.value.inv[bPayloadPocket].ubNumberOfObjects == 1)) {
    DeleteObj(addressof(pSoldier.value.inv[bPayloadPocket]));
  } else // multiple grenades, remove one of them
  {
    pSoldier.value.inv[bPayloadPocket].ubNumberOfObjects--;
  }
}

export function CalcBestShot(pSoldier: Pointer<SOLDIERTYPE>, pBestShot: Pointer<ATTACKTYPE>): void {
  let uiLoop: UINT32;
  let iAttackValue: INT32;
  let iThreatValue: INT32;
  let iHitRate: INT32;
  let iBestHitRate: INT32;
  let iPercentBetter: INT32;
  let iEstDamage: INT32;
  let ubRawAPCost: UINT8;
  let ubMinAPcost: UINT8;
  let ubMaxPossibleAimTime: UINT8;
  let ubAimTime: UINT8;
  let ubBestAimTime: UINT8;
  let ubChanceToHit: UINT8;
  let ubChanceToGetThrough: UINT8;
  let ubChanceToReallyHit: UINT8;
  let ubBestChanceToHit: UINT8 = 0;
  let pOpponent: Pointer<SOLDIERTYPE>;
  let ubBurstAPs: UINT8;

  ubBestChanceToHit = ubBestAimTime = ubChanceToHit = 0;

  pSoldier.value.usAttackingWeapon = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  ubBurstAPs = CalcAPsToBurst(CalcActionPoints(pSoldier), addressof(pSoldier.value.inv[Enum261.HANDPOS]));

  InitAttackType(pBestShot); // set all structure fields to defaults

  // hang a pointer into active soldier's personal opponent list
  // pbPersOL = &(pSoldier->bOppList[0]);

  // determine which attack against which target has the greatest attack value
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpponent = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pOpponent || !pOpponent.value.bLife)
      continue; // next merc

    // if this man is neutral / on the same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpponent) || (pSoldier.value.bSide == pOpponent.value.bSide))
      continue; // next merc

    // if this opponent is not currently in sight (ignore known but unseen!)
    if (pSoldier.value.bOppList[pOpponent.value.ubID] != SEEN_CURRENTLY)
      continue; // next opponent

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY && pOpponent.value.ubProfile != Enum268.SLAY)
      continue; // next opponent

    // calculate minimum action points required to shoot at this opponent
    ubMinAPcost = MinAPsToAttack(pSoldier, pOpponent.value.sGridNo, ADDTURNCOST);
    // NumMessage("MinAPcost to shoot this opponent = ",ubMinAPcost);

    // if we don't have enough APs left to shoot even a snap-shot at this guy
    if (ubMinAPcost > pSoldier.value.bActionPoints)
      continue; // next opponent

    // KeepInterfaceGoing();

    // calculate chance to get through the opponent's cover (if any)

    ubChanceToGetThrough = AISoldierToSoldierChanceToGetThrough(pSoldier, pOpponent);

    //   ubChanceToGetThrough = ChanceToGetThrough(pSoldier,pOpponent->sGridNo,NOTFAKE,ACTUAL,TESTWALLS,9999,M9PISTOL,NOT_FOR_LOS);

    // NumMessage("Chance to get through = ",ubChanceToGetThrough);

    // if we can't possibly get through all the cover
    if (ubChanceToGetThrough == 0)
      continue; // next opponent

    if ((pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) && (pSoldier.value.ubBodyType != Enum194.QUEENMONSTER)) {
      let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
      let usAnimSurface: UINT16;

      usAnimSurface = DetermineSoldierAnimationSurface(pSoldier, pSoldier.value.usUIMovementMode);
      pStructureFileRef = GetAnimationStructureRef(pSoldier.value.ubID, usAnimSurface, pSoldier.value.usUIMovementMode);

      if (pStructureFileRef) {
        let usStructureID: UINT16;
        let bDir: INT8;

        // must make sure that structure data can be added in the direction of the target
        bDir = GetDirectionToGridNoFromGridNo(pSoldier.value.sGridNo, pOpponent.value.sGridNo);

        // ATE: Only if we have a levelnode...
        if (pSoldier.value.pLevelNode != null && pSoldier.value.pLevelNode.value.pStructureData != null) {
          usStructureID = pSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
        } else {
          usStructureID = INVALID_STRUCTURE_ID;
        }

        if (!OkayToAddStructureToWorld(pSoldier.value.sGridNo, pSoldier.value.bLevel, addressof(pStructureFileRef.value.pDBStructureRef[gOneCDirection[bDir]]), usStructureID)) {
          // can't turn in that dir.... next opponent
          continue;
        }
      }
    }

    // calc next attack's minimum shooting cost (excludes readying & turning)
    ubRawAPCost = MinAPsToShootOrStab(pSoldier, pOpponent.value.sGridNo, false);

    if (pOpponent.value.sGridNo != pSoldier.value.sLastTarget) {
      // raw AP cost calculation included cost of changing target!
      ubRawAPCost -= AP_CHANGE_TARGET;
    }

    iBestHitRate = 0; // reset best hit rate to minimum

    // calculate the maximum possible aiming time

    if (TANK(pSoldier)) {
      ubMaxPossibleAimTime = pSoldier.value.bActionPoints - ubMinAPcost;

      // always burst
      if (ubMaxPossibleAimTime < ubBurstAPs) {
        // should this be a return instead?
        continue;
      }
      // bursts aren't aimed
      ubMaxPossibleAimTime = 0;
    } else {
      ubMaxPossibleAimTime = Math.min(AP_MAX_AIM_ATTACK, pSoldier.value.bActionPoints - ubMinAPcost);
    }

    // consider the various aiming times
    for (ubAimTime = AP_MIN_AIM_ATTACK; ubAimTime <= ubMaxPossibleAimTime; ubAimTime++) {
      // HandleMyMouseCursor(KEYBOARDALSO);

      // NumMessage("ubAimTime = ",ubAimTime);

      ubChanceToHit = AICalcChanceToHitGun(pSoldier, pOpponent.value.sGridNo, ubAimTime, AIM_SHOT_TORSO);
      // ExtMen[pOpponent->ubID].haveStats = TRUE;
      // NumMessage("chance to Hit = ",ubChanceToHit);

      // sprintf(tempstr,"Vs. %s, at AimTime %d, ubChanceToHit = %d",ExtMen[pOpponent->ubID].name,ubAimTime,ubChanceToHit);
      // PopMessage(tempstr);

      iHitRate = (pSoldier.value.bActionPoints * ubChanceToHit) / (ubRawAPCost + ubAimTime);
      // NumMessage("hitRate = ",iHitRate);

      // if aiming for this amount of time produces a better hit rate
      if (iHitRate > iBestHitRate) {
        iBestHitRate = iHitRate;
        ubBestAimTime = ubAimTime;
        ubBestChanceToHit = ubChanceToHit;
      }
    }

    // if we can't get any kind of hit rate at all
    if (iBestHitRate == 0)
      continue; // next opponent

    // calculate chance to REALLY hit: shoot accurately AND get past cover
    ubChanceToReallyHit = (ubBestChanceToHit * ubChanceToGetThrough) / 100;

    // if we can't REALLY hit at all
    if (ubChanceToReallyHit == 0)
      continue; // next opponent

    // really limit knife throwing so it doesn't look wrong
    if (Item[pSoldier.value.usAttackingWeapon].usItemClass == IC_THROWING_KNIFE && (ubChanceToReallyHit < 30 || (PythSpacesAway(pSoldier.value.sGridNo, pOpponent.value.sGridNo) > CalcMaxTossRange(pSoldier, Enum225.THROWING_KNIFE, false) / 2)))
      continue; // don't bother... next opponent

    // calculate this opponent's threat value (factor in my cover from him)
    iThreatValue = CalcManThreatValue(pOpponent, pSoldier.value.sGridNo, true, pSoldier);

    // estimate the damage this shot would do to this opponent
    iEstDamage = EstimateShotDamage(pSoldier, pOpponent, ubBestChanceToHit);
    // NumMessage("SHOT EstDamage = ",iEstDamage);

    // calculate the combined "attack value" for this opponent
    // highest possible value before division should be about 1.8 billion...
    // normal value before division should be about 5 million...
    iAttackValue = (iEstDamage * iBestHitRate * ubChanceToReallyHit * iThreatValue) / 1000;
    // NumMessage("SHOT AttackValue = ",iAttackValue / 1000);

    // special stuff for assassins to ignore militia more
    if (pSoldier.value.ubProfile >= Enum268.JIM && pSoldier.value.ubProfile <= Enum268.TYRONE && pOpponent.value.bTeam == MILITIA_TEAM) {
      iAttackValue /= 2;
    }

    // if we can hurt the guy, OR probably not, but at least it's our best
    // chance to actually hit him and maybe scare him, knock him down, etc.
    if ((iAttackValue > 0) || (ubChanceToReallyHit > pBestShot.value.ubChanceToReallyHit)) {
      // if there already was another viable target
      if (pBestShot.value.ubChanceToReallyHit > 0) {
        // OK, how does our chance to hit him compare to the previous best one?
        iPercentBetter = ((ubChanceToReallyHit * 100) / pBestShot.value.ubChanceToReallyHit) - 100;

        // if this chance to really hit is more than 50% worse, and the other
        // guy is conscious at all
        if ((iPercentBetter < -PERCENT_TO_IGNORE_THREAT) && (Menptr[pBestShot.value.ubOpponent].bLife >= OKLIFE))
          // then stick with the older guy as the better target
          continue;

        // if this chance to really hit between 50% worse to 50% better
        if (iPercentBetter < PERCENT_TO_IGNORE_THREAT) {
          // then the one with the higher ATTACK VALUE is the better target
          if (iAttackValue < pBestShot.value.iAttackValue)
            // the previous guy is more important since he's more dangerous
            continue; // next opponent
        }
      }

      // OOOF!  That was a lot of work!  But we've got a new best target!
      pBestShot.value.ubPossible = true;
      pBestShot.value.ubOpponent = pOpponent.value.ubID;
      pBestShot.value.ubAimTime = ubBestAimTime;
      pBestShot.value.ubChanceToReallyHit = ubChanceToReallyHit;
      pBestShot.value.sTarget = pOpponent.value.sGridNo;
      pBestShot.value.bTargetLevel = pOpponent.value.bLevel;
      pBestShot.value.iAttackValue = iAttackValue;
      pBestShot.value.ubAPCost = ubMinAPcost + ubBestAimTime;
    }
  }
}

// JA2Gold: added
function CloseEnoughForGrenadeToss(sGridNo: INT16, sGridNo2: INT16): boolean {
  let sTempGridNo: INT16;
  let bDirection: INT8;
  let sXPos: INT16;
  let sYPos: INT16;
  let sXPos2: INT16;
  let sYPos2: INT16;
  let ubMovementCost: UINT8;

  if (sGridNo == sGridNo2) {
    // checking the same space; if there is a closed door next to location in ANY direction then forget it
    // (could be the player closed a door on us)
    for (bDirection = 0; bDirection < Enum245.NUM_WORLD_DIRECTIONS; bDirection++) {
      sTempGridNo = NewGridNo(sGridNo, DirectionInc(bDirection));
      ubMovementCost = gubWorldMovementCosts[sTempGridNo][bDirection][0];
      if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
        ubMovementCost = DoorTravelCost(null, sTempGridNo, ubMovementCost, false, null);
      }
      if (ubMovementCost >= TRAVELCOST_BLOCKED) {
        return false;
      }
    }
  } else {
    if (CardinalSpacesAway(sGridNo, sGridNo2) > 2) {
      return false;
    }

    // we are within 1 space diagonally or at most 2 horizontally or vertically,
    // so we can now do a loop safely

    sTempGridNo = sGridNo;

    sXPos = CenterX(sGridNo);
    sYPos = CenterY(sGridNo);
    sXPos2 = CenterX(sGridNo2);
    sYPos2 = CenterY(sGridNo2);
    bDirection = atan8(sXPos, sYPos, sXPos2, sYPos2);

    // For each step of the loop, we are checking for door or obstacle movement costs.  If we
    // find we're blocked, then this is no good for grenade tossing!
    do {
      sTempGridNo = NewGridNo(sTempGridNo, DirectionInc(bDirection));
      ubMovementCost = gubWorldMovementCosts[sTempGridNo][bDirection][0];
      if (IS_TRAVELCOST_DOOR(ubMovementCost)) {
        ubMovementCost = DoorTravelCost(null, sTempGridNo, ubMovementCost, false, null);
      }
      if (ubMovementCost >= TRAVELCOST_BLOCKED) {
        return false;
      }
    } while (sTempGridNo != sGridNo2);
  }

  return true;
}

function CalcBestThrow(pSoldier: Pointer<SOLDIERTYPE>, pBestThrow: Pointer<ATTACKTYPE>): void {
  // September 9, 1998: added code for LAWs (CJC)
  let ubLoop: UINT8;
  let ubLoop2: UINT8;
  let iAttackValue: INT32;
  let iHitRate: INT32;
  let iThreatValue: INT32;
  let iTotalThreatValue: INT32;
  let iOppThreatValue: INT32[] /* [MAXMERCS] */;
  let sGridNo: INT16;
  let sEndGridNo: INT16;
  let sFriendTile: INT16[] /* [MAXMERCS] */;
  let sOpponentTile: INT16[] /* [MAXMERCS] */;
  let bFriendLevel: INT8[] /* [MAXMERCS] */;
  let bOpponentLevel: INT8[] /* [MAXMERCS] */;
  let iEstDamage: INT32;
  let ubFriendCnt: UINT8 = 0;
  let ubOpponentCnt: UINT8 = 0;
  let ubOpponentID: UINT8[] /* [MAXMERCS] */;
  let ubRawAPCost: UINT8;
  let ubMinAPcost: UINT8;
  let ubMaxPossibleAimTime: UINT8;
  let ubChanceToHit: UINT8;
  let ubChanceToGetThrough: UINT8;
  let ubChanceToReallyHit: UINT8;
  let uiPenalty: UINT32;
  let ubSearchRange: UINT8;
  let usOppDist: UINT16;
  let fFriendsNearby: boolean;
  let usInHand: UINT16;
  let usGrenade: UINT16;
  let ubOppsInRange: UINT8;
  let ubOppsAdjacent: UINT8;
  let fSkipLocation: boolean;
  let bPayloadPocket: INT8;
  let bMaxLeft: INT8;
  let bMaxRight: INT8;
  let bMaxUp: INT8;
  let bMaxDown: INT8;
  let bXOffset: INT8;
  let bYOffset: INT8;
  let bPersOL: INT8;
  let bPublOL: INT8;
  let pOpponent: Pointer<SOLDIERTYPE>;
  let pFriend: Pointer<SOLDIERTYPE>;
  /* static */ let sExcludeTile: INT16[] /* [100] */; // This array is for storing tiles that we have
  let ubNumExcludedTiles: UINT8 = 0; // already considered, to prevent duplication of effort
  let iTossRange: INT32;
  let ubSafetyMargin: UINT8 = 0;
  let ubDiff: UINT8;
  let bEndLevel: INT8;

  usInHand = pSoldier.value.inv[Enum261.HANDPOS].usItem;
  usGrenade = NOTHING;

  if (EXPLOSIVE_GUN(usInHand)) {
    iTossRange = Weapon[usInHand].usRange / CELL_X_SIZE;
  } else {
    iTossRange = CalcMaxTossRange(pSoldier, usInHand, true);
  }

  // if he's got a MORTAR in his hand, make sure he has a MORTARSHELL avail.
  if (usInHand == Enum225.MORTAR) {
    bPayloadPocket = FindObj(pSoldier, Enum225.MORTAR_SHELL);
    if (bPayloadPocket == NO_SLOT) {
      return; // no shells, can't fire the MORTAR
    }
    ubSafetyMargin = Explosive[Item[Enum225.MORTAR_SHELL].ubClassIndex].ubRadius;
  }
  // if he's got a GL in his hand, make sure he has some type of GRENADE avail.
  else if (usInHand == Enum225.GLAUNCHER) {
    // use up pocket 2 first, they get left as drop items
    bPayloadPocket = FindGLGrenade(pSoldier);
    if (bPayloadPocket == NO_SLOT) {
      return; // no grenades, can't fire the GLAUNCHER
    }
    ubSafetyMargin = Explosive[Item[pSoldier.value.inv[bPayloadPocket].usItem].ubClassIndex].ubRadius;
    usGrenade = pSoldier.value.inv[bPayloadPocket].usItem;
  } else if (usInHand == Enum225.ROCKET_LAUNCHER) {
    // put in hand
    bPayloadPocket = Enum261.HANDPOS;
    // as C1
    ubSafetyMargin = Explosive[Item[Enum225.C1].ubClassIndex].ubRadius;
  } else if (usInHand == Enum225.TANK_CANNON) {
    bPayloadPocket = FindObj(pSoldier, Enum225.TANK_SHELL);
    if (bPayloadPocket == NO_SLOT) {
      return; // no grenades, can't fire the GLAUNCHER
    }
    ubSafetyMargin = Explosive[Item[Enum225.TANK_SHELL].ubClassIndex].ubRadius;
  } else {
    // else it's a plain old grenade, now in his hand
    bPayloadPocket = Enum261.HANDPOS;
    ubSafetyMargin = Explosive[Item[pSoldier.value.inv[bPayloadPocket].usItem].ubClassIndex].ubRadius;
    usGrenade = pSoldier.value.inv[bPayloadPocket].usItem;

    if (usGrenade == Enum225.BREAK_LIGHT) {
      // JA2Gold: light isn't as nasty as explosives
      ubSafetyMargin /= 2;
    }
  }

  ubDiff = SoldierDifficultyLevel(pSoldier);

  // make a list of tiles one's friends are positioned in
  for (ubLoop = 0; ubLoop < guiNumMercSlots; ubLoop++) {
    pFriend = MercSlots[ubLoop];

    if (!pFriend) {
      continue; // next soldier
    }

    if (pFriend.value.bLife == 0) {
      continue;
    }

    /*
    // if this soldier is inactive, at base, on assignment, or dead
    if (!Menptr[ubLoop].bActive || !Menptr[ubLoop].bInSector || !Menptr[ubLoop].bLife)
            continue;          // next soldier
    */

    // if this man is neutral / NOT on the same side, he's not a friend
    if (pFriend.value.bNeutral || (pSoldier.value.bSide != pFriend.value.bSide)) {
      continue; // next soldier
    }

    // active friend, remember where he is so that we DON'T blow him up!
    // this includes US, since we don't want to blow OURSELVES up either
    sFriendTile[ubFriendCnt] = pFriend.value.sGridNo;
    bFriendLevel[ubFriendCnt] = pFriend.value.bLevel;
    ubFriendCnt++;
  }

  // NumMessage("ubFriendCnt = ",ubFriendCnt);

  // make a list of tiles one's CURRENTLY SEEN opponents are positioned in
  for (ubLoop = 0; ubLoop < guiNumMercSlots; ubLoop++) {
    pOpponent = MercSlots[ubLoop];

    if (!pOpponent) {
      // inactive or not in sector
      continue; // next soldier
    }

    if (!pOpponent.value.bLife) {
      continue; // next soldier
    }

    /*
    // if this soldier is inactive, at base, on assignment, or dead
    if (!pOpponent->bActive || !pOpponent->bInSector || !pOpponent->bLife)
            continue;          // next soldier
    */

    // if this man is neutral / on the same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpponent) || (pSoldier.value.bSide == pOpponent.value.bSide)) {
      continue; // next soldier
    }

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY && pOpponent.value.ubProfile != 64) {
      continue; // next opponent
    }

    bPersOL = pSoldier.value.bOppList[pOpponent.value.ubID];

    if ((usInHand == Enum225.MORTAR) || (usInHand == Enum225.GLAUNCHER)) {
      bPublOL = gbPublicOpplist[pSoldier.value.bTeam][pOpponent.value.ubID];
      // allow long range firing, where target doesn't PERSONALLY see opponent
      if ((bPersOL != SEEN_CURRENTLY) && (bPublOL != SEEN_CURRENTLY)) {
        continue; // next soldier
      }
      // active KNOWN opponent, remember where he is so that we DO blow him up!
      sOpponentTile[ubOpponentCnt] = pOpponent.value.sGridNo;
      bOpponentLevel[ubOpponentCnt] = pOpponent.value.bLevel;
    } else {
      /*
      if (bPersOL != SEEN_CURRENTLY && bPersOL != SEEN_LAST_TURN)     // if not in sight right now
      {
              continue;          // next soldier
      }
      */
      if (bPersOL == SEEN_CURRENTLY) {
        // active KNOWN opponent, remember where he is so that we DO blow him up!
        sOpponentTile[ubOpponentCnt] = pOpponent.value.sGridNo;
        bOpponentLevel[ubOpponentCnt] = pOpponent.value.bLevel;
      } else if (bPersOL == SEEN_LAST_TURN) {
        // cheat; only allow throw if person is REALLY within 2 tiles of where last seen

        // JA2Gold: UB checks were screwed up
        /*
        if ( pOpponent->sGridNo == gsLastKnownOppLoc[ pSoldier->ubID ][ pOpponent->ubID ] )
        {
                continue;
        }
        else */
        if (!CloseEnoughForGrenadeToss(pOpponent.value.sGridNo, gsLastKnownOppLoc[pSoldier.value.ubID][pOpponent.value.ubID])) {
          continue;
        }

        sOpponentTile[ubOpponentCnt] = gsLastKnownOppLoc[pSoldier.value.ubID][pOpponent.value.ubID];
        bOpponentLevel[ubOpponentCnt] = gbLastKnownOppLevel[pSoldier.value.ubID][pOpponent.value.ubID];

        // JA2Gold: commented out
        /*
        if ( SpacesAway( pOpponent->sGridNo, gsLastKnownOppLoc[ pSoldier->ubID ][ pOpponent->ubID ] ) > 2 )
        {
                continue;
        }
        sOpponentTile[ubOpponentCnt] = gsLastKnownOppLoc[ pSoldier->ubID ][ pOpponent->ubID ];
        bOpponentLevel[ubOpponentCnt] = gbLastKnownOppLevel[ pSoldier->ubID ][ pOpponent->ubID ];
        */
      } else if (bPersOL == HEARD_LAST_TURN) {
        // cheat; only allow throw if person is REALLY within 2 tiles of where last seen

        // screen out some ppl who have thrown
        if (PreRandom(3) == 0) {
          continue;
        }

        // Weird detail: if the opponent is in the same location then they may have closed a door on us.
        // In which case, don't throw!

        // JA2Gold: UB checks were screwed up
        /*
        if ( pOpponent->sGridNo == gsLastKnownOppLoc[ pSoldier->ubID ][ pOpponent->ubID ] )
        {
                continue;
        }
        else
        */
        if (!CloseEnoughForGrenadeToss(pOpponent.value.sGridNo, gsLastKnownOppLoc[pSoldier.value.ubID][pOpponent.value.ubID])) {
          continue;
        }
        if (usGrenade != Enum225.BREAK_LIGHT && !pSoldier.value.bUnderFire && pSoldier.value.bShock == 0) {
          continue;
        }
        sOpponentTile[ubOpponentCnt] = gsLastKnownOppLoc[pSoldier.value.ubID][pOpponent.value.ubID];
        bOpponentLevel[ubOpponentCnt] = gbLastKnownOppLevel[pSoldier.value.ubID][pOpponent.value.ubID];
      } else {
        continue;
      }
    }

    // also remember who he is (which soldier #)
    ubOpponentID[ubOpponentCnt] = pOpponent.value.ubID;

    // remember how relatively dangerous this opponent is (ignore my cover)
    iOppThreatValue[ubOpponentCnt] = CalcManThreatValue(pOpponent, pSoldier.value.sGridNo, false, pSoldier);

    ubOpponentCnt++;
  }

  // NumMessage("ubOpponentCnt = ",ubOpponentCnt);

  // this is try to minimize enemies wasting their (limited) toss attacks, with the exception of break lights
  if (usGrenade != Enum225.BREAK_LIGHT) {
    switch (ubDiff) {
      case 0:
      case 1:
        // they won't use them until they have 2+ opponents as long as half life left
        if ((ubOpponentCnt < 2) && (pSoldier.value.bLife > (pSoldier.value.bLifeMax / 2))) {
          return;
        }
        break;
      case 2:
        // they won't use them until they have 2+ opponents as long as 3/4 life left
        if ((ubOpponentCnt < 2) && (pSoldier.value.bLife > (pSoldier.value.bLifeMax / 4) * 3)) {
          return;
        }
        break;
        break;
      default:
        break;
    }
  }

  InitAttackType(pBestThrow); // set all structure fields to defaults

  // look at the squares near each known opponent and try to find the one
  // place where a tossed projectile would do the most harm to the opponents
  // while avoiding one's friends
  for (ubLoop = 0; ubLoop < ubOpponentCnt; ubLoop++) {
    // NumMessage("Checking Guy#",ubOpponentID[ubLoop]);

    // search all tiles within 2 squares of this opponent
    ubSearchRange = MAX_TOSS_SEARCH_DIST;

    // determine maximum horizontal limits
    // bMaxLeft  = min(ubSearchRange,(sOpponentTile[ubLoop] % MAXCOL));
    bMaxLeft = ubSearchRange;
    // NumMessage("bMaxLeft = ",bMaxLeft);
    // bMaxRight = min(ubSearchRange,MAXCOL - ((sOpponentTile[ubLoop] % MAXCOL) + 1));
    bMaxRight = ubSearchRange;
    // NumMessage("bMaxRight = ",bMaxRight);

    // determine maximum vertical limits
    bMaxUp = ubSearchRange;
    // NumMessage("bMaxUp = ",bMaxUp);
    bMaxDown = ubSearchRange;
    // NumMessage("bMaxDown = ",bMaxDown);

    // evaluate every tile for its opponent-damaging potential
    for (bYOffset = -bMaxUp; bYOffset <= bMaxDown; bYOffset++) {
      for (bXOffset = -bMaxLeft; bXOffset <= bMaxRight; bXOffset++) {
        // HandleMyMouseCursor(KEYBOARDALSO);

        // calculate the next potential gridno near this opponent
        sGridNo = sOpponentTile[ubLoop] + bXOffset + (MAXCOL * bYOffset);
        // NumMessage("Testing gridno #",sGridNo);

        // this shouldn't ever happen
        if ((sGridNo < 0) || (sGridNo >= GRIDSIZE)) {
          continue;
        }

        if (PythSpacesAway(pSoldier.value.sGridNo, sGridNo) > iTossRange) {
          // can't throw there!
          return;
        }

        // if considering a gas/smoke grenade, check to see if there is such stuff already there!
        if (usGrenade) {
          switch (usGrenade) {
            case Enum225.SMOKE_GRENADE:
            case Enum225.GL_SMOKE_GRENADE:
              // skip smoke
              if (gpWorldLevelData[sGridNo].ubExtFlags[bOpponentLevel[ubLoop]] & MAPELEMENT_EXT_SMOKE) {
                continue;
              }
              break;
            case Enum225.TEARGAS_GRENADE:
              // skip tear and mustard gas
              if (gpWorldLevelData[sGridNo].ubExtFlags[bOpponentLevel[ubLoop]] & (MAPELEMENT_EXT_TEARGAS | MAPELEMENT_EXT_MUSTARDGAS)) {
                continue;
              }
              break;
            case Enum225.MUSTARD_GRENADE:
              // skip mustard gas
              if (gpWorldLevelData[sGridNo].ubExtFlags[bOpponentLevel[ubLoop]] & MAPELEMENT_EXT_MUSTARDGAS) {
                continue;
              }
              break;
            default:
              break;
          }
        }

        fSkipLocation = false;
        // Check to see if we have considered this tile before:
        for (ubLoop2 = 0; ubLoop2 < ubNumExcludedTiles; ubLoop2++) {
          if (sExcludeTile[ubLoop2] == sGridNo) {
            // already checked!
            fSkipLocation = true;
            break;
          }
        }
        if (fSkipLocation) {
          continue;
        }

        // calculate minimum action points required to throw at this gridno
        ubMinAPcost = MinAPsToAttack(pSoldier, sGridNo, ADDTURNCOST);
        // NumMessage("MinAPcost to throw at this gridno = ",ubMinAPcost);

        // if we don't have enough APs left to throw even without aiming
        if (ubMinAPcost > pSoldier.value.bActionPoints)
          continue; // next gridno

        // check whether there are any friends standing near this gridno
        fFriendsNearby = false;

        for (ubLoop2 = 0; ubLoop2 < ubFriendCnt; ubLoop2++) {
          if ((bFriendLevel[ubLoop2] == bOpponentLevel[ubLoop]) && (PythSpacesAway(sFriendTile[ubLoop2], sGridNo) <= ubSafetyMargin)) {
            // NumMessage("Friend too close: at gridno",sFriendTile[ubLoop2]);
            fFriendsNearby = true;
            break; // don't bother checking any other friends
          }
        }

        if (fFriendsNearby)
          continue; // this location is no good, move along now

        // Well this place shows some promise, evaluate its "damage potential"
        iTotalThreatValue = 0;
        ubOppsInRange = 0;
        ubOppsAdjacent = 0;
        // skip this location unless it's right on top of an enemy or
        // adjacent to more than 1
        fSkipLocation = true;

        for (ubLoop2 = 0; ubLoop2 < ubOpponentCnt; ubLoop2++) {
          usOppDist = PythSpacesAway(sOpponentTile[ubLoop2], sGridNo);

          // if this opponent is close enough to the target gridno
          if (usOppDist <= 3) {
            // start with this opponents base threat value
            iThreatValue = iOppThreatValue[ubLoop2];

            // estimate how much damage this tossed item would do to him
            iEstDamage = EstimateThrowDamage(pSoldier, bPayloadPocket, MercPtrs[ubOpponentID[ubLoop2]], sGridNo);
            // NumMessage("THROW EstDamage = ",iEstDamage);

            if (usOppDist) {
              // reduce the estimated damage for his distance from gridno
              // use 100% at range 0, 80% at range 1, and 60% at range 2, etc.
              iEstDamage = (iEstDamage * (100 - (20 * usOppDist))) / 100;
              // NumMessage("THROW reduced usEstDamage = ",usEstDamage);
            } else {
              // throwing right on top of someone... always consider this
              fSkipLocation = false;
            }

            // add the product of his threat value & damage caused to total
            iTotalThreatValue += (iThreatValue * iEstDamage);

            // only count opponents still standing worth shooting at (in range)
            if (Menptr[ubOpponentID[ubLoop2]].bLife >= OKLIFE) {
              ubOppsInRange++;
              if (usOppDist < 2) {
                ubOppsAdjacent++;
                if (ubOppsAdjacent > 1 || usGrenade == Enum225.BREAK_LIGHT) {
                  fSkipLocation = false;
                  // add to exclusion list so we don't consider it again
                }
              }
            }
          }
        }

        // JA2Gold
        if (gGameOptions.ubDifficultyLevel == Enum9.DIF_LEVEL_EASY) {
          if (fSkipLocation) {
            continue;
          }
        } else {
          if (ubOppsInRange == 0) {
            continue;
          }

          // Only use it if we are in a surface sector ( basement will be hard enough, plus more chances of mercs being clumped together )
          else if (gbWorldSectorZ > 0 && fSkipLocation) {
            continue;
          }
        }

        // JA2Gold change to >=
        if (ubOppsAdjacent >= 1 && ubNumExcludedTiles < 100) {
          // add to exclusion list so we don't calculate for this location twice
          sExcludeTile[ubNumExcludedTiles] = sGridNo;
          ubNumExcludedTiles++;
        }

        // calculate chance to get through any cover to this gridno
        // ubChanceToGetThrough = ChanceToGetThrough(pSoldier,sGridNo,NOTFAKE,ACTUAL,TESTWALLS,9999,M9PISTOL,NOT_FOR_LOS);

        if (EXPLOSIVE_GUN(usInHand)) {
          ubChanceToGetThrough = AISoldierToLocationChanceToGetThrough(pSoldier, sGridNo, bOpponentLevel[ubLoop], 0);
          if (ubChanceToGetThrough == 0) {
            continue; // next gridno
          }
        } else {
          ubChanceToGetThrough = 100 * CalculateLaunchItemChanceToGetThrough(pSoldier, addressof(pSoldier.value.inv[Enum261.HANDPOS]), sGridNo, bOpponentLevel[ubLoop], 0, addressof(sEndGridNo), true, addressof(bEndLevel), false); // NumMessage("Chance to get through = ",ubChanceToGetThrough);
          // if we can't possibly get through all the cover
          if (ubChanceToGetThrough == 0) {
            if (bEndLevel == bOpponentLevel[ubLoop] && ubSafetyMargin > 1) {
              // rate "chance of hitting" according to how far away this is from the target
              // but keeping in mind that we don't want to hit far, subtract 1 from the radius here
              // to penalize being far from the target
              uiPenalty = 100 * PythSpacesAway(sGridNo, sEndGridNo) / (ubSafetyMargin - 1);
              if (uiPenalty < 100) {
                ubChanceToGetThrough = 100 - uiPenalty;
              } else {
                continue;
              }
            } else {
              continue;
            }
          }
        }

        // NumMessage("Total Threat Value = ",iTotalThreatValue);
        // NumMessage("Opps in Range = ",ubOppsInRange);

        // this is try to minimize enemies wasting their (few) mortar shells or LAWs
        // they won't use them on less than 2 targets as long as half life left
        if ((usInHand == Enum225.MORTAR || usInHand == Enum225.ROCKET_LAUNCHER) && (ubOppsInRange < 2) && (pSoldier.value.bLife > (pSoldier.value.bLifeMax / 2))) {
          continue; // next gridno
        }

        // calculate the maximum possible aiming time
        ubMaxPossibleAimTime = Math.min(AP_MAX_AIM_ATTACK, pSoldier.value.bActionPoints - ubMinAPcost);
        // NumMessage("Max Possible Aim Time = ",ubMaxPossibleAimTime);

        // calc next attack's minimum AP cost (excludes readying & turning)

        // since grenades & shells are far too valuable to waste, ALWAYS
        // aim for the longest time possible!

        if (EXPLOSIVE_GUN(usInHand)) {
          ubRawAPCost = MinAPsToShootOrStab(pSoldier, sGridNo, false);
          ubChanceToHit = AICalcChanceToHitGun(pSoldier, sGridNo, ubMaxPossibleAimTime, AIM_SHOT_TORSO);
        } else {
          // NB grenade launcher is NOT a direct fire weapon!
          ubRawAPCost = MinAPsToThrow(pSoldier, sGridNo, false);
          ubChanceToHit = CalcThrownChanceToHit(pSoldier, sGridNo, ubMaxPossibleAimTime, AIM_SHOT_TORSO);
        }

        // mortars are inherently quite inaccurate, don't get proximity bonus
        // rockets can go right past people too so...
        if (usInHand != Enum225.MORTAR && EXPLOSIVE_GUN(usInHand)) {
          // special 50% to Hit bonus: this reflects that even if a tossed item
          // misses by a bit, it's still likely to affect the intended target(s)
          ubChanceToHit += (ubChanceToHit / 2);

          // still can't let it go over 100% chance, though
          if (ubChanceToHit > 100) {
            ubChanceToHit = 100;
          }
        }

        iHitRate = (pSoldier.value.bActionPoints * ubChanceToHit) / (ubRawAPCost + ubMaxPossibleAimTime);
        // NumMessage("iHitRate = ",iHitRate);

        // calculate chance to REALLY hit: throw accurately AND get past cover
        ubChanceToReallyHit = (ubChanceToHit * ubChanceToGetThrough) / 100;

        // if we can't REALLY hit at all
        if (ubChanceToReallyHit == 0)
          continue; // next gridno

        // calculate the combined "attack value" for this opponent
        // maximum possible attack value here should be about 140 million
        // typical attack value here should be about 500 thousand
        iAttackValue = (iHitRate * ubChanceToReallyHit * iTotalThreatValue) / 1000;
        // NumMessage("THROW AttackValue = ",iAttackValue / 1000);

        // unlike SHOOTing and STABbing, find strictly the highest attackValue
        if (iAttackValue > pBestThrow.value.iAttackValue) {
          // OOOF!  That was a lot of work!  But we've got a new best target!
          pBestThrow.value.ubPossible = true;
          pBestThrow.value.ubOpponent = ubOpponentID[ubLoop];
          pBestThrow.value.ubAimTime = ubMaxPossibleAimTime;
          pBestThrow.value.ubChanceToReallyHit = ubChanceToReallyHit;
          pBestThrow.value.sTarget = sGridNo;
          pBestThrow.value.iAttackValue = iAttackValue;
          pBestThrow.value.ubAPCost = ubMinAPcost + ubMaxPossibleAimTime;
          pBestThrow.value.bTargetLevel = bOpponentLevel[ubLoop];

          // sprintf(tempstr,"new best THROW AttackValue = %d at grid #%d",iAttackValue/100000,gridno);
          // PopMessage(tempstr);
        }
      }
    }
  }

  // this is try to minimize enemies wasting their (limited) toss attacks:
  switch (ubDiff) {
    case 0:
    case 1:
      // don't use unless have a 70% chance to hit
      if (pBestThrow.value.ubChanceToReallyHit < 70) {
        pBestThrow.value.ubPossible = false;
      }
      break;
    case 2:
      // don't use unless have a 50% chance to hit
      if (pBestThrow.value.ubChanceToReallyHit < 50) {
        pBestThrow.value.ubPossible = false;
      }
      break;
    default:
      break;
  }
}

export function CalcBestStab(pSoldier: Pointer<SOLDIERTYPE>, pBestStab: Pointer<ATTACKTYPE>, fBladeAttack: boolean): void {
  let uiLoop: UINT32;
  let iAttackValue: INT32;
  let iThreatValue: INT32;
  let iHitRate: INT32;
  let iBestHitRate: INT32;
  let iPercentBetter: INT32;
  let iEstDamage: INT32;
  let fSurpriseStab: boolean;
  let ubRawAPCost: UINT8;
  let ubMinAPCost: UINT8;
  let ubMaxPossibleAimTime: UINT8;
  let ubAimTime: UINT8;
  let ubBestAimTime: UINT8;
  let ubChanceToHit: UINT8;
  let ubChanceToReallyHit: UINT8;
  let ubBestChanceToHit: UINT8 = 0;
  let pOpponent: Pointer<SOLDIERTYPE>;
  let usTrueMovementMode: UINT16;

  InitAttackType(pBestStab); // set all structure fields to defaults

  pSoldier.value.usAttackingWeapon = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  // temporarily make this guy run so we get a proper AP cost value
  // from CalcTotalAPsToAttack
  usTrueMovementMode = pSoldier.value.usUIMovementMode;
  pSoldier.value.usUIMovementMode = Enum193.RUNNING;

  // determine which attack against which target has the greatest attack value

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpponent = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pOpponent || !pOpponent.value.bLife)
      continue; // next merc

    // if this man is neutral / on the same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpponent) || (pSoldier.value.bSide == pOpponent.value.bSide))
      continue; // next merc

    // if this opponent is not currently in sight (ignore known but unseen!)
    if (pSoldier.value.bOppList[pOpponent.value.ubID] != SEEN_CURRENTLY)
      continue; // next merc

    // if this opponent is not on the same level
    if (pSoldier.value.bLevel != pOpponent.value.bLevel)
      continue; // next merc

    // Special stuff for Carmen the bounty hunter
    if (pSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY && pOpponent.value.ubProfile != 64)
      continue; // next opponent

    // calculate minimum action points required to stab at this opponent
    ubMinAPCost = CalcTotalAPsToAttack(pSoldier, pOpponent.value.sGridNo, ADDTURNCOST, 0);

    // ubMinAPCost = MinAPsToAttack(pSoldier,pOpponent->sGridNo,ADDTURNCOST);
    // NumMessage("MinAPcost to stab this opponent = ",ubMinAPCost);

    // Human: if I don't have enough APs left to get there & stab at this guy, skip 'im.
    // Monster:  I'll do an extra check later on to see if I can reach the guy this turn.

    // if 0 is returned then no path!
    if (ubMinAPCost > pSoldier.value.bActionPoints || ubMinAPCost == 0) {
      continue;
      /*
       if ( CREATURE_OR_BLOODCAT( pSoldier ) )
       {
               // hardcode ubMinAPCost so that aiming time is 0 and can start move to stab
               // at any time
         ubMinAPCost = pSoldier->bActionPoints;
       }
       else
       {
         continue;          // next merc
       }
       */
    }

    // KeepInterfaceGoing();

    // calc next attack's minimum stabbing cost (excludes movement & turning)
    // ubRawAPCost = MinAPsToShootOrStab(pSoldier,pOpponent->sGridNo, FALSE) - AP_CHANGE_TARGET;
    ubRawAPCost = MinAPsToAttack(pSoldier, pOpponent.value.sGridNo, false) - AP_CHANGE_TARGET;
    // NumMessage("ubRawAPCost to stab this opponent = ",ubRawAPCost);

    // determine if this is a surprise stab (must be next to opponent & unseen)
    fSurpriseStab = false; // assume it is not a surprise stab

    // if opponent doesn't see the attacker
    if (pOpponent.value.bOppList[pSoldier.value.ubID] != SEEN_CURRENTLY) {
      fSurpriseStab = true;

      // and he's only one space away from attacker
      if (SpacesAway(pSoldier.value.sGridNo, pOpponent.value.sGridNo) == 1) {
        fSurpriseStab = true; // we got 'im lined up where we want 'im!
      }
    }

    iBestHitRate = 0; // reset best hit rate to minimum

    // calculate the maximum possible aiming time
    ubMaxPossibleAimTime = Math.min(AP_MAX_AIM_ATTACK, pSoldier.value.bActionPoints - ubMinAPCost);
    // NumMessage("Max Possible Aim Time = ",ubMaxPossibleAimTime);

    // consider the various aiming times
    for (ubAimTime = AP_MIN_AIM_ATTACK; ubAimTime <= ubMaxPossibleAimTime; ubAimTime++) {
      // HandleMyMouseCursor(KEYBOARDALSO);

      // NumMessage("ubAimTime = ",ubAimTime);

      if (!fSurpriseStab) {
        if (fBladeAttack) {
          ubChanceToHit = CalcChanceToStab(pSoldier, pOpponent, ubAimTime);
        } else {
          ubChanceToHit = CalcChanceToPunch(pSoldier, pOpponent, ubAimTime);
        }
      } else
        ubChanceToHit = MAXCHANCETOHIT;
      // NumMessage("chance to Hit = ",ubChanceToHit);

      // sprintf(tempstr,"Vs. %s, at AimTime %d, ubChanceToHit = %d",ExtMen[pOpponent->ubID].name,ubAimTime,ubChanceToHit);
      // PopMessage(tempstr);

      iHitRate = (pSoldier.value.bActionPoints * ubChanceToHit) / (ubRawAPCost + ubAimTime);
      // NumMessage("hitRate = ",iHitRate);

      // if aiming for this amount of time produces a better hit rate
      if (iHitRate > iBestHitRate) {
        iBestHitRate = iHitRate;
        ubBestAimTime = ubAimTime;
        ubBestChanceToHit = ubChanceToHit;
      }
    }

    // if we can't get any kind of hit rate at all
    if (iBestHitRate == 0)
      continue; // next opponent

    // stabs are not affected by cover, so the chance to REALLY hit is the same
    ubChanceToReallyHit = ubBestChanceToHit;

    // calculate this opponent's threat value
    // NOTE: ignore my cover!  By the time I run beside him I won't have any!
    iThreatValue = CalcManThreatValue(pOpponent, pSoldier.value.sGridNo, false, pSoldier);

    // estimate the damage this stab would do to this opponent
    iEstDamage = EstimateStabDamage(pSoldier, pOpponent, ubBestChanceToHit, fBladeAttack);
    // NumMessage("STAB EstDamage = ", iEstDamage);

    // calculate the combined "attack value" for this opponent
    // highest possible value before division should be about 1 billion...
    // normal value before division should be about 5 million...
    iAttackValue = (iEstDamage * iBestHitRate * ubChanceToReallyHit * iThreatValue) / 1000;
    // NumMessage("STAB AttackValue = ",iAttackValue / 1000);

    // if we can hurt the guy, OR probably not, but at least it's our best
    // chance to actually hit him and maybe scare him, knock him down, etc.
    if ((iAttackValue > 0) || (ubChanceToReallyHit > pBestStab.value.ubChanceToReallyHit)) {
      // if there already was another viable target
      if (pBestStab.value.ubChanceToReallyHit > 0) {
        // OK, how does our chance to hit him compare to the previous best one?
        iPercentBetter = ((ubChanceToReallyHit * 100) / pBestStab.value.ubChanceToReallyHit) - 100;

        // if this chance to really hit is more than 50% worse, and the other
        // guy is conscious at all
        if ((iPercentBetter < -PERCENT_TO_IGNORE_THREAT) && (Menptr[pBestStab.value.ubOpponent].bLife >= OKLIFE))
          // then stick with the older guy as the better target
          continue;

        // if this chance to really hit between 50% worse to 50% better
        if (iPercentBetter < PERCENT_TO_IGNORE_THREAT) {
          // then the one with the higher ATTACK VALUE is the better target
          if (iAttackValue < pBestStab.value.iAttackValue)
            // the previous guy is more important since he's more dangerous
            continue; // next opponent
        }
      }

      // OOOF!  That was a lot of work!  But we've got a new best target!
      pBestStab.value.ubPossible = true;
      pBestStab.value.ubOpponent = pOpponent.value.ubID;
      pBestStab.value.ubAimTime = ubBestAimTime;
      pBestStab.value.ubChanceToReallyHit = ubChanceToReallyHit;
      pBestStab.value.sTarget = pOpponent.value.sGridNo;
      pBestStab.value.bTargetLevel = pOpponent.value.bLevel;
      pBestStab.value.iAttackValue = iAttackValue;
      pBestStab.value.ubAPCost = ubMinAPCost + ubBestAimTime;
    }
  }

  pSoldier.value.usUIMovementMode = usTrueMovementMode;
}

export function CalcTentacleAttack(pSoldier: Pointer<SOLDIERTYPE>, pBestStab: Pointer<ATTACKTYPE>): void {
  let uiLoop: UINT32;
  let iAttackValue: INT32;
  let iThreatValue: INT32;
  let iHitRate: INT32;
  let iBestHitRate: INT32;
  let iEstDamage: INT32;
  let fSurpriseStab: boolean;
  let ubRawAPCost: UINT8;
  let ubMinAPCost: UINT8;
  let ubMaxPossibleAimTime: UINT8;
  let ubAimTime: UINT8;
  let ubBestAimTime: UINT8;
  let ubChanceToHit: UINT8;
  let ubChanceToReallyHit: UINT8;
  let ubBestChanceToHit: UINT8 = 0;
  let pOpponent: Pointer<SOLDIERTYPE>;

  InitAttackType(pBestStab); // set all structure fields to defaults

  pSoldier.value.usAttackingWeapon = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  // determine which attack against which target has the greatest attack value

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pOpponent = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pOpponent || !pOpponent.value.bLife)
      continue; // next merc

    // if this man is neutral / on the same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pOpponent) || (pSoldier.value.bSide == pOpponent.value.bSide))
      continue; // next merc

    // if this opponent is not currently in sight (ignore known but unseen!)
    if (pSoldier.value.bOppList[pOpponent.value.ubID] != SEEN_CURRENTLY)
      continue; // next merc

    // if this opponent is not on the same level
    if (pSoldier.value.bLevel != pOpponent.value.bLevel)
      continue; // next merc

    // if this opponent is outside the range of our tentacles
    if (GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, pOpponent.value.sGridNo) > Weapon[Enum225.CREATURE_QUEEN_TENTACLES].usRange) {
      continue; // next merc
    }

    // calculate minimum action points required to stab at this opponent
    ubMinAPCost = CalcTotalAPsToAttack(pSoldier, pOpponent.value.sGridNo, ADDTURNCOST, 0);
    // ubMinAPCost = MinAPsToAttack(pSoldier,pOpponent->sGridNo,ADDTURNCOST);
    // NumMessage("MinAPcost to stab this opponent = ",ubMinAPCost);

    // calc next attack's minimum stabbing cost (excludes movement & turning)
    // ubRawAPCost = MinAPsToShootOrStab(pSoldier,pOpponent->sGridNo, FALSE) - AP_CHANGE_TARGET;
    ubRawAPCost = MinAPsToAttack(pSoldier, pOpponent.value.sGridNo, false) - AP_CHANGE_TARGET;
    // NumMessage("ubRawAPCost to stab this opponent = ",ubRawAPCost);

    // determine if this is a surprise stab (for tentacles, enemy must not see us, no dist limit)
    fSurpriseStab = false; // assume it is not a surprise stab

    // if opponent doesn't see the attacker
    if (pOpponent.value.bOppList[pSoldier.value.ubID] != SEEN_CURRENTLY) {
      fSurpriseStab = true; // we got 'im lined up where we want 'im!
    }

    iBestHitRate = 0; // reset best hit rate to minimum

    // calculate the maximum possible aiming time

    // ubMaxPossibleAimTime = min(AP_MAX_AIM_ATTACK,pSoldier->bActionPoints - ubMinAPCost);
    ubMaxPossibleAimTime = 0;
    // NumMessage("Max Possible Aim Time = ",ubMaxPossibleAimTime);

    // consider the various aiming times
    for (ubAimTime = AP_MIN_AIM_ATTACK; ubAimTime <= ubMaxPossibleAimTime; ubAimTime++) {
      // HandleMyMouseCursor(KEYBOARDALSO);

      // NumMessage("ubAimTime = ",ubAimTime);

      if (!fSurpriseStab) {
        ubChanceToHit = CalcChanceToStab(pSoldier, pOpponent, ubAimTime);
      } else
        ubChanceToHit = MAXCHANCETOHIT;
      // NumMessage("chance to Hit = ",ubChanceToHit);

      // sprintf(tempstr,"Vs. %s, at AimTime %d, ubChanceToHit = %d",ExtMen[pOpponent->ubID].name,ubAimTime,ubChanceToHit);
      // PopMessage(tempstr);

      iHitRate = (pSoldier.value.bActionPoints * ubChanceToHit) / (ubRawAPCost + ubAimTime);
      // NumMessage("hitRate = ",iHitRate);

      // if aiming for this amount of time produces a better hit rate
      if (iHitRate > iBestHitRate) {
        iBestHitRate = iHitRate;
        ubBestAimTime = ubAimTime;
        ubBestChanceToHit = ubChanceToHit;
      }
    }

    // if we can't get any kind of hit rate at all
    if (iBestHitRate == 0)
      continue; // next opponent

    // stabs are not affected by cover, so the chance to REALLY hit is the same
    ubChanceToReallyHit = ubBestChanceToHit;

    // calculate this opponent's threat value
    // NOTE: ignore my cover!  By the time I run beside him I won't have any!
    iThreatValue = CalcManThreatValue(pOpponent, pSoldier.value.sGridNo, false, pSoldier);

    // estimate the damage this stab would do to this opponent
    iEstDamage = EstimateStabDamage(pSoldier, pOpponent, ubBestChanceToHit, true);
    // NumMessage("STAB EstDamage = ", iEstDamage);

    // calculate the combined "attack value" for this opponent
    // highest possible value before division should be about 1 billion...
    // normal value before division should be about 5 million...
    iAttackValue = (iEstDamage * iBestHitRate * ubChanceToReallyHit * iThreatValue) / 1000;
    // NumMessage("STAB AttackValue = ",iAttackValue / 1000);

    // if we can hurt the guy, OR probably not, but at least it's our best
    // chance to actually hit him and maybe scare him, knock him down, etc.
    if (iAttackValue > 0) {
      // OOOF!  That was a lot of work!  But we've got a new best target!
      pBestStab.value.ubPossible = true;
      pBestStab.value.ubOpponent = pOpponent.value.ubID;
      pBestStab.value.ubAimTime = ubBestAimTime;
      pBestStab.value.ubChanceToReallyHit = ubChanceToReallyHit;
      pBestStab.value.sTarget = pOpponent.value.sGridNo;
      pBestStab.value.bTargetLevel = pOpponent.value.bLevel;

      // ADD this target's attack value to our TOTAL...
      pBestStab.value.iAttackValue += iAttackValue;

      pBestStab.value.ubAPCost = ubMinAPCost + ubBestAimTime;
    }
  }
}

function NumMercsCloseTo(sGridNo: INT16, ubMaxDist: UINT8): UINT8 {
  let bNumber: INT8 = 0;
  let uiLoop: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];

    if (pSoldier && pSoldier.value.bTeam == gbPlayerNum && pSoldier.value.bLife >= OKLIFE) {
      if (PythSpacesAway(sGridNo, pSoldier.value.sGridNo) <= ubMaxDist) {
        bNumber++;
      }
    }
  }

  return bNumber;
}

function EstimateShotDamage(pSoldier: Pointer<SOLDIERTYPE>, pOpponent: Pointer<SOLDIERTYPE>, ubChanceToHit: UINT8): INT32 {
  let iRange: INT32;
  let iMaxRange: INT32;
  let iPowerLost: INT32;
  let iDamage: INT32;
  let ubBonus: UINT8;
  let iHeadProt: INT32 = 0;
  let iTorsoProt: INT32 = 0;
  let iLegProt: INT32 = 0;
  let iTotalProt: INT32;
  let bPlatePos: INT8;
  let ubAmmoType: UINT8;

  /*
          if ( pOpponent->uiStatusFlags & SOLDIER_VEHICLE )
          {
                  // only thing that can damage vehicles is HEAP rounds?
                  return( 0 );
          }
          */

  if (Item[pSoldier.value.inv[pSoldier.value.ubAttackingHand].usItem].usItemClass & IC_THROWING_KNIFE) {
    ubAmmoType = Enum286.AMMO_KNIFE;
  } else {
    ubAmmoType = pSoldier.value.inv[pSoldier.value.ubAttackingHand].ubGunAmmoType;
  }

  // calculate distance to target, obtain his gun's maximum range rating

  iRange = GetRangeInCellCoordsFromGridNoDiff(pSoldier.value.sGridNo, pOpponent.value.sGridNo);
  iMaxRange = Weapon[pSoldier.value.inv[Enum261.HANDPOS].usItem].usRange;

  // bullet loses speed and penetrating power, 50% loss per maximum range
  iPowerLost = ((50 * iRange) / iMaxRange);

  // up to 50% extra impact for making particularly accurate successful shots
  ubBonus = ubChanceToHit / 4; // /4 is really /2 and /2 again

  iDamage = (Weapon[pSoldier.value.inv[Enum261.HANDPOS].usItem].ubImpact * (100 - iPowerLost + ubBonus)) / 100;

  // NumMessage("Pre-protection damage: ",damage);

  // if opponent is wearing a helmet
  if (pOpponent.value.inv[Enum261.HELMETPOS].usItem) {
    iHeadProt += Armour[Item[pOpponent.value.inv[Enum261.HELMETPOS].usItem].ubClassIndex].ubProtection * pOpponent.value.inv[Enum261.HELMETPOS].bStatus[0] / 100;
  }

  // if opponent is wearing a protective vest
  if (ubAmmoType != Enum286.AMMO_MONSTER && ubAmmoType != Enum286.AMMO_KNIFE) {
    // monster spit and knives ignore kevlar vests
    if (pOpponent.value.inv[Enum261.VESTPOS].usItem) {
      iTorsoProt += Armour[Item[pOpponent.value.inv[Enum261.VESTPOS].usItem].ubClassIndex].ubProtection * pOpponent.value.inv[Enum261.VESTPOS].bStatus[0] / 100;
    }
  }

  // check for ceramic plates; these do affect monster spit
  bPlatePos = FindAttachment(addressof(pOpponent.value.inv[Enum261.VESTPOS]), Enum225.CERAMIC_PLATES);
  if (bPlatePos != -1) {
    iTorsoProt += Armour[Item[pOpponent.value.inv[Enum261.VESTPOS].usAttachItem[bPlatePos]].ubClassIndex].ubProtection * pOpponent.value.inv[Enum261.VESTPOS].bAttachStatus[bPlatePos] / 100;
  }

  // if opponent is wearing armoured leggings (LEGPOS)
  if (ubAmmoType != Enum286.AMMO_MONSTER && ubAmmoType != Enum286.AMMO_KNIFE) {
    // monster spit and knives ignore kevlar leggings
    if (pOpponent.value.inv[Enum261.LEGPOS].usItem) {
      iLegProt += Armour[Item[pOpponent.value.inv[Enum261.LEGPOS].usItem].ubClassIndex].ubProtection * pOpponent.value.inv[Enum261.LEGPOS].bStatus[0] / 100;
    }
  }

  // 15% of all shots are to the head, 80% are to the torso.  Calc. avg. prot.
  // NB: make AI guys shoot at head 15% of time, 5% of time at legs

  iTotalProt = ((15 * iHeadProt) + (75 * iTorsoProt) + 5 * iLegProt) / 100;
  switch (ubAmmoType) {
    case Enum286.AMMO_HP:
      iTotalProt = AMMO_ARMOUR_ADJUSTMENT_HP(iTotalProt);
      break;
    case Enum286.AMMO_AP:
      iTotalProt = AMMO_ARMOUR_ADJUSTMENT_AP(iTotalProt);
      break;
    case Enum286.AMMO_SUPER_AP:
      iTotalProt = AMMO_ARMOUR_ADJUSTMENT_SAP(iTotalProt);
      break;
    default:
      break;
  }

  iDamage -= iTotalProt;
  // NumMessage("After-protection damage: ",damage);

  if (ubAmmoType == Enum286.AMMO_HP) {
    // increase after-armour damage
    iDamage = AMMO_DAMAGE_ADJUSTMENT_HP(iDamage);
  }

  if (ubAmmoType == Enum286.AMMO_MONSTER) {
    // cheat and emphasize shots
    // iDamage = (iDamage * 15) / 10;
    switch (pSoldier.value.inv[pSoldier.value.ubAttackingHand].usItem) {
      // explosive damage is 100-200% that of the rated, so multiply by 3/2s here
      case Enum225.CREATURE_QUEEN_SPIT:
        iDamage += (3 * Explosive[Item[Enum225.LARGE_CREATURE_GAS].ubClassIndex].ubDamage * NumMercsCloseTo(pOpponent.value.sGridNo, Explosive[Item[Enum225.LARGE_CREATURE_GAS].ubClassIndex].ubRadius)) / 2;
        break;
      case Enum225.CREATURE_OLD_MALE_SPIT:
        iDamage += (3 * Explosive[Item[Enum225.SMALL_CREATURE_GAS].ubClassIndex].ubDamage * NumMercsCloseTo(pOpponent.value.sGridNo, Explosive[Item[Enum225.SMALL_CREATURE_GAS].ubClassIndex].ubRadius)) / 2;
        break;
      default:
        iDamage += (3 * Explosive[Item[Enum225.VERY_SMALL_CREATURE_GAS].ubClassIndex].ubDamage * NumMercsCloseTo(pOpponent.value.sGridNo, Explosive[Item[Enum225.VERY_SMALL_CREATURE_GAS].ubClassIndex].ubRadius)) / 2;
        break;
    }
  }

  if (iDamage < 1)
    iDamage = 1; // assume we can do at LEAST 1 pt minimum damage

  return iDamage;
}

function EstimateThrowDamage(pSoldier: Pointer<SOLDIERTYPE>, ubItemPos: UINT8, pOpponent: Pointer<SOLDIERTYPE>, sGridno: INT16): INT32 {
  let ubExplosiveIndex: UINT8;
  let iExplosDamage: INT32;
  let iBreathDamage: INT32;
  let iArmourAmount: INT32;
  let iDamage: INT32 = 0;
  let bSlot: INT8;

  switch (pSoldier.value.inv[ubItemPos].usItem) {
    case Enum225.GL_SMOKE_GRENADE:
    case Enum225.SMOKE_GRENADE:
      // Don't want to value throwing smoke very much.  This value is based relative
      // to the value for knocking somebody down, which was giving values that were
      // too high
      return 5;
    case Enum225.ROCKET_LAUNCHER:
      ubExplosiveIndex = Item[Enum225.C1].ubClassIndex;
      break;
    default:
      ubExplosiveIndex = Item[pSoldier.value.inv[ubItemPos].usItem].ubClassIndex;
      break;
  }

  // JA2Gold: added
  if (pSoldier.value.inv[ubItemPos].usItem == Enum225.BREAK_LIGHT) {
    return 5 * (LightTrueLevel(pOpponent.value.sGridNo, pOpponent.value.bLevel) - NORMAL_LIGHTLEVEL_DAY);
  }

  iExplosDamage = ((Explosive[ubExplosiveIndex].ubDamage) * 3) / 2;
  iBreathDamage = ((Explosive[ubExplosiveIndex].ubStunDamage) * 5) / 4;

  if (Explosive[ubExplosiveIndex].ubType == Enum287.EXPLOSV_TEARGAS || Explosive[ubExplosiveIndex].ubType == Enum287.EXPLOSV_MUSTGAS) {
    // if target gridno is outdoors (where tear gas lasts only 1-2 turns)
    if (gpWorldLevelData[sGridno].ubTerrainID != Enum315.FLAT_FLOOR)
      iBreathDamage /= 2; // reduce effective breath damage by 1/2

    bSlot = FindObj(pOpponent, Enum225.GASMASK);
    if (bSlot == Enum261.HEAD1POS || bSlot == Enum261.HEAD2POS) {
      // take condition of the gas mask into account - it could be leaking
      iBreathDamage = (iBreathDamage * (100 - pOpponent.value.inv[bSlot].bStatus[0])) / 100;
      // NumMessage("damage after GAS MASK: ",iBreathDamage);
    }
  } else if (iExplosDamage) {
    // EXPLOSION DAMAGE is spread amongst locations
    iArmourAmount = ArmourVersusExplosivesPercent(pSoldier);
    iExplosDamage -= iExplosDamage * iArmourAmount / 100;

    if (iExplosDamage < 1)
      iExplosDamage = 1;
  }

  // if this opponent is standing
  if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
    // 15 pt. flat bonus for knocking him down (for ANY type of explosion)
    iDamage += 15;
  }

  if (pOpponent.value.bBreath < OKBREATH || AM_A_ROBOT(pOpponent)) {
    // don't bother to count breath damage against people already down
    iBreathDamage = 0;
  }

  // estimate combined "damage" value considering combined health/breath damage
  iDamage += iExplosDamage + (iBreathDamage / 3);

  // approximate chance of the grenade going off (Ian's formulas are too funky)
  // then use that to reduce the expected damage because thing may not blow!
  iDamage = (iDamage * pSoldier.value.inv[ubItemPos].bStatus[0]) / 100;

  // if the target gridno is in water, grenade may not blow (guess 50% of time)
  /*
  if (TTypeList[Grid[gridno].land] >= LAKETYPE)
          iDamage /= 2;
  */

  return iDamage;
}

function EstimateStabDamage(pSoldier: Pointer<SOLDIERTYPE>, pOpponent: Pointer<SOLDIERTYPE>, ubChanceToHit: UINT8, fBladeAttack: boolean): INT32 {
  let iImpact: INT32;
  let iFluke: INT32;
  let iBonus: INT32;

  let usItem: UINT16;

  usItem = pSoldier.value.inv[Enum261.HANDPOS].usItem;

  if (fBladeAttack) {
    iImpact = Weapon[pSoldier.value.usAttackingWeapon].ubImpact;
    iImpact += EffectiveStrength(pSoldier) / 20; // 0 to 5 for strength, adjusted by damage taken
  } else {
    // NB martial artists don't get a bonus for using brass knuckles!
    if (pSoldier.value.usAttackingWeapon && !(HAS_SKILL_TRAIT(pSoldier, Enum269.MARTIALARTS))) {
      iImpact = Weapon[pSoldier.value.usAttackingWeapon].ubImpact;
    } else {
      // base HTH damage
      iImpact = 5;
    }
    iImpact += EffectiveStrength(pSoldier) / 5; // 0 to 20 for strength, adjusted by damage taken
  }

  iImpact += (pSoldier.value.bExpLevel / 2); // 0 to 4 for level

  iFluke = 0;
  iBonus = ubChanceToHit / 4; // up to 50% extra impact for accurate attacks

  iImpact = iImpact * (100 + iFluke + iBonus) / 100;

  if (!fBladeAttack) {
    // add bonuses for hand-to-hand and martial arts
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.MARTIALARTS)) {
      iImpact = iImpact * (100 + gbSkillTraitBonus[Enum269.MARTIALARTS] * NUM_SKILL_TRAITS(pSoldier, Enum269.MARTIALARTS)) / 100;
    }
    if (HAS_SKILL_TRAIT(pSoldier, Enum269.HANDTOHAND)) {
      iImpact = iImpact * (100 + gbSkillTraitBonus[Enum269.HANDTOHAND] * NUM_SKILL_TRAITS(pSoldier, Enum269.HANDTOHAND)) / 100;
    }
    // Here, if we're doing a bare-fisted attack,
    // we want to pay attention just to wounds inflicted
    iImpact = iImpact / PUNCH_REAL_DAMAGE_PORTION;
  }

  if (iImpact < 1) {
    iImpact = 1;
  }

  return iImpact;
}

function TryToReload(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let bSlot: INT8;
  let pWeapon: Pointer<WEAPONTYPE>;

  pWeapon = addressof(Weapon[pSoldier.value.inv[Enum261.HANDPOS].usItem]);
  bSlot = FindAmmo(pSoldier, pWeapon.value.ubCalibre, pWeapon.value.ubMagSize, NO_SLOT);
  if (bSlot != NO_SLOT) {
    if (ReloadGun(pSoldier, addressof(pSoldier.value.inv[Enum261.HANDPOS]), addressof(pSoldier.value.inv[bSlot]))) {
      return true;
    }
  }
  return NOSHOOT_NOAMMO;
}

/*
INT8 TryToReloadLauncher( SOLDIERTYPE * pSoldier )
{
        UINT16	usWeapon;
        INT8		bSlot;

        usWeapon = pSoldier->inv[HANDPOS].usItem;

        if ( usWeapon == TANK_CANNON )
        {
                bSlot = FindObj( pSoldier, TANK_SHELL );
        }
        else
        {
                bSlot = FindLaunchable( pSoldier, usWeapon );
        }

        if (bSlot != NO_SLOT)
        {
        }
        return( NOSHOOT_NOAMMO );
}
*/

export function CanNPCAttack(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let bCanAttack: INT8;
  let bWeaponIn: INT8;

  // NEUTRAL civilians are not allowed to attack, but those that are not
  // neutral (KILLNPC mission guynums, escorted guys) can, if they're armed
  if (PTR_CIVILIAN() && pSoldier.value.bNeutral) {
    return false;
  }

  // test if if we are able to attack (in general, not at any specific target)
  bCanAttack = OKToAttack(pSoldier, NOWHERE);

  // if soldier can't attack because he doesn't have a weapon or is out of ammo
  // or his weapon isn't loaded
  if (bCanAttack == NOSHOOT_NOAMMO) // || NOLOAD
  {
    // try to reload it
    bCanAttack = TryToReload(pSoldier);
  } else if (bCanAttack == NOSHOOT_NOWEAPON) {
    // look for another weapon
    bWeaponIn = FindAIUsableObjClass(pSoldier, IC_WEAPON);
    if (bWeaponIn != NO_SLOT) {
      RearrangePocket(pSoldier, Enum261.HANDPOS, bWeaponIn, FOREVER);
      // look for another weapon if this one is 1-handed
      if ((Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN) && !(Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].fFlags & ITEM_TWO_HANDED)) {
        // look for another pistol/SMG if available
        bWeaponIn = FindAIUsableObjClassWithin(pSoldier, IC_WEAPON, Enum261.BIGPOCK1POS, Enum261.SMALLPOCK8POS);
        if (bWeaponIn != NO_SLOT && (Item[pSoldier.value.inv[bWeaponIn].usItem].usItemClass == IC_GUN) && !(Item[pSoldier.value.inv[bWeaponIn].usItem].fFlags & ITEM_TWO_HANDED)) {
          RearrangePocket(pSoldier, Enum261.SECONDHANDPOS, bWeaponIn, FOREVER);
        }
      }
      // might need to reload
      bCanAttack = CanNPCAttack(pSoldier);
    }
  }

  return bCanAttack;
}

export function CheckIfTossPossible(pSoldier: Pointer<SOLDIERTYPE>, pBestThrow: Pointer<ATTACKTYPE>): void {
  let ubMinAPcost: UINT8;

  if (TANK(pSoldier)) {
    pBestThrow.value.bWeaponIn = FindObj(pSoldier, Enum225.TANK_CANNON);
  } else {
    pBestThrow.value.bWeaponIn = FindAIUsableObjClass(pSoldier, IC_LAUNCHER);

    if (pBestThrow.value.bWeaponIn == NO_SLOT) {
      // Consider rocket launcher/cannon
      pBestThrow.value.bWeaponIn = FindObj(pSoldier, Enum225.ROCKET_LAUNCHER);
      if (pBestThrow.value.bWeaponIn == NO_SLOT) {
        // no rocket launcher, consider grenades
        pBestThrow.value.bWeaponIn = FindThrowableGrenade(pSoldier);
      } else {
        // Have rocket launcher... maybe have grenades as well.  which one to use?
        if (pSoldier.value.bAIMorale > Enum244.MORALE_WORRIED && PreRandom(2)) {
          pBestThrow.value.bWeaponIn = FindThrowableGrenade(pSoldier);
        }
      }
    }
  }

  // if the soldier does have a tossable item somewhere
  if (pBestThrow.value.bWeaponIn != NO_SLOT) {
    // if it's in his holster, swap it into his hand temporarily
    if (pBestThrow.value.bWeaponIn != Enum261.HANDPOS) {
      RearrangePocket(pSoldier, Enum261.HANDPOS, pBestThrow.value.bWeaponIn, TEMPORARILY);
    }

    // get the minimum cost to attack with this tossable item
    ubMinAPcost = MinAPsToAttack(pSoldier, pSoldier.value.sLastTarget, DONTADDTURNCOST);

    // if we can afford the minimum AP cost to throw this tossable item
    if (pSoldier.value.bActionPoints >= ubMinAPcost) {
      // then look around for a worthy target (which sets bestThrow.ubPossible)
      CalcBestThrow(pSoldier, pBestThrow);
    }

    // if it was in his holster, swap it back into his holster for now
    if (pBestThrow.value.bWeaponIn != Enum261.HANDPOS) {
      RearrangePocket(pSoldier, Enum261.HANDPOS, pBestThrow.value.bWeaponIn, TEMPORARILY);
    }
  }
}

function CountAdjacentSpreadTargets(pSoldier: Pointer<SOLDIERTYPE>, sFirstTarget: INT16, bTargetLevel: INT8): INT8 {
  // return the number of people next to this guy for burst-spread purposes

  let bDirLoop: INT8;
  let bDir: INT8;
  let bCheckDir: INT8;
  let bTargetIndex: INT8;
  let bTargets: INT8;
  let sTarget: INT16;
  let pTarget: Pointer<SOLDIERTYPE>;
  let pTargets: Pointer<SOLDIERTYPE>[] /* [5] */ = [ null ];

  bTargetIndex = -1;
  bCheckDir = -1;

  pTargets[2] = SimpleFindSoldier(sFirstTarget, bTargetLevel);
  if (pTargets[2] == null) {
    return 0;
  }
  bTargets = 1;

  bDir = GetDirectionToGridNoFromGridNo(pSoldier.value.sGridNo, sFirstTarget);

  for (bDirLoop = 0; bDirLoop < 8; bDirLoop++) {
    if (bDir % 2) {
      // odd direction = diagonal direction
      switch (bDirLoop) {
        case 0:
          bCheckDir = (bDir + 6) % 8;
          bTargetIndex = 0;
          break;
        case 1:
          bCheckDir = (bDir + 5) % 8;
          bTargetIndex = 1;
          break;
        case 2:
          bCheckDir = (bDir + 7) % 8;
          bTargetIndex = 1;
          break;
        case 3:
          bCheckDir = (bDir + 3) % 8;
          bTargetIndex = 3;
          break;
        case 4:
          bCheckDir = (bDir + 1) % 8;
          bTargetIndex = 3;
          break;
        case 5:
          bCheckDir = (bDir + 2) % 8;
          bTargetIndex = 4;
          break;
        case 6:
          // check in front
          bCheckDir = (bDir + 4) % 8;
          bTargetIndex = 1;
          break;
        case 7:
          // check behind
          bCheckDir = (bDir) % 8;
          bTargetIndex = 3;
          break;
      }
    } else {
      // even = straight
      switch (bDirLoop) {
        case 0:
          bCheckDir = (bDir + 5) % 8;
          bTargetIndex = 1;
          break;
        case 1:
          bCheckDir = (bDir + 6) % 8;
          bTargetIndex = 1;
          break;
        case 2:
          bCheckDir = (bDir + 7) % 8;
          bTargetIndex = 1;
          break;
        case 3:
          bCheckDir = (bDir + 3) % 8;
          bTargetIndex = 3;
          break;
        case 4:
          bCheckDir = (bDir + 2) % 8;
          bTargetIndex = 3;
          break;
        case 5:
          bCheckDir = (bDir + 1) % 8;
          bTargetIndex = 3;
          break;
        case 6:
          // check in front
          bCheckDir = (bDir + 4) % 8;
          bTargetIndex = 1;
          break;
        case 7:
          // check behind
          bCheckDir = (bDir) % 8;
          bTargetIndex = 3;
          break;
      }
    }
    if (bDirLoop == 6 && bTargets > 1) {
      // we're done!  otherwise we continue and try to find people in front/behind
      break;
    } else if (pTargets[bTargetIndex] != null) {
      continue;
    }
    sTarget = sFirstTarget + DirIncrementer[bCheckDir];
    pTarget = SimpleFindSoldier(sTarget, bTargetLevel);
    if (pTarget) {
      // check to see if guy is visible
      if (pSoldier.value.bOppList[pTarget.value.ubID] == SEEN_CURRENTLY) {
        pTargets[bTargetIndex] = pTarget;
        bTargets++;
      }
    }
  }
  return bTargets - 1;
}

export function CalcSpreadBurst(pSoldier: Pointer<SOLDIERTYPE>, sFirstTarget: INT16, bTargetLevel: INT8): INT16 {
  let bDirLoop: INT8;
  let bDir: INT8;
  let bCheckDir: INT8;
  let bTargetIndex: INT8 = 0;
  let bLoop: INT8;
  let bTargets: INT8;
  let sTarget: INT16;
  let pTarget: Pointer<SOLDIERTYPE>;
  let pTargets: Pointer<SOLDIERTYPE>[] /* [5] */ = [ null ];
  let bAdjacents: INT8;
  let bOtherAdjacents: INT8;

  bCheckDir = -1;

  pTargets[2] = SimpleFindSoldier(sFirstTarget, bTargetLevel);
  if (pTargets[2] == null) {
    return sFirstTarget;
  }
  bTargets = 1;
  bAdjacents = CountAdjacentSpreadTargets(pSoldier, sFirstTarget, bTargetLevel);

  bDir = GetDirectionToGridNoFromGridNo(pSoldier.value.sGridNo, sFirstTarget);

  for (bDirLoop = 0; bDirLoop < 8; bDirLoop++) {
    if (bDir % 2) {
      // odd direction = diagonal direction
      switch (bDirLoop) {
        case 0:
          bCheckDir = (bDir + 6) % 8;
          bTargetIndex = 0;
          break;
        case 1:
          bCheckDir = (bDir + 5) % 8;
          bTargetIndex = 1;
          break;
        case 2:
          bCheckDir = (bDir + 7) % 8;
          bTargetIndex = 1;
          break;
        case 3:
          bCheckDir = (bDir + 3) % 8;
          bTargetIndex = 3;
          break;
        case 4:
          bCheckDir = (bDir + 1) % 8;
          bTargetIndex = 3;
          break;
        case 5:
          bCheckDir = (bDir + 2) % 8;
          bTargetIndex = 4;
          break;
        case 6:
          // check in front
          bCheckDir = (bDir + 4) % 8;
          bTargetIndex = 1;
          break;
        case 7:
          // check behind
          bCheckDir = (bDir) % 8;
          bTargetIndex = 3;
          break;
      }
    } else {
      // even = straight
      switch (bDirLoop) {
        case 0:
          bCheckDir = (bDir + 5) % 8;
          bTargetIndex = 1;
          break;
        case 1:
          bCheckDir = (bDir + 6) % 8;
          bTargetIndex = 1;
          break;
        case 2:
          bCheckDir = (bDir + 7) % 8;
          bTargetIndex = 1;
          break;
        case 3:
          bCheckDir = (bDir + 3) % 8;
          bTargetIndex = 3;
          break;
        case 4:
          bCheckDir = (bDir + 2) % 8;
          bTargetIndex = 3;
          break;
        case 5:
          bCheckDir = (bDir + 1) % 8;
          bTargetIndex = 3;
          break;
        case 6:
          // check in front
          bCheckDir = (bDir + 4) % 8;
          bTargetIndex = 1;
          break;
        case 7:
          // check behind
          bCheckDir = (bDir) % 8;
          bTargetIndex = 3;
          break;
      }
    }
    if (bDirLoop == 6 && bTargets > 1) {
      // we're done!  otherwise we continue and try to find people in front/behind
      break;
    } else if (pTargets[bTargetIndex] != null) {
      continue;
    }
    sTarget = sFirstTarget + DirIncrementer[bCheckDir];
    pTarget = SimpleFindSoldier(sTarget, bTargetLevel);
    if (pTarget && pSoldier.value.bOppList[pTarget.value.ubID] == SEEN_CURRENTLY) {
      bOtherAdjacents = CountAdjacentSpreadTargets(pSoldier, sTarget, bTargetLevel);
      if (bOtherAdjacents > bAdjacents) {
        // we should do a spread-burst there instead!
        return CalcSpreadBurst(pSoldier, sTarget, bTargetLevel);
      }
      pTargets[bTargetIndex] = pTarget;
      bTargets++;
    }
  }

  if (bTargets > 1) {
    // Move all the locations down in the array if necessary
    // Check the 4th position
    if (pTargets[3] == null && pTargets[4] != null) {
      pTargets[3] = pTargets[4];
      pTargets[4] = null;
    }
    // Check the first two positions; we know the 3rd value is set because
    // it's our initial target
    if (pTargets[1] == null) {
      pTargets[1] = pTargets[2];
      pTargets[2] = pTargets[3];
      pTargets[3] = pTargets[4];
      pTargets[4] = null;
    }
    if (pTargets[0] == null) {
      pTargets[0] = pTargets[1];
      pTargets[1] = pTargets[2];
      pTargets[2] = pTargets[3];
      pTargets[3] = pTargets[4];
      pTargets[4] = null;
    }
    // now 50% chance to reorganize to fire in reverse order
    if (Random(2)) {
      for (bLoop = 0; bLoop < bTargets / 2; bLoop++) {
        pTarget = pTargets[bLoop];
        pTargets[bLoop] = pTargets[bTargets - 1 - bLoop];
        pTargets[bTargets - 1 - bLoop] = pTarget;
      }
    }
    AIPickBurstLocations(pSoldier, bTargets, pTargets);
    pSoldier.value.fDoSpread = true;
  }
  return sFirstTarget;
}

export function AdvanceToFiringRange(pSoldier: Pointer<SOLDIERTYPE>, sClosestOpponent: INT16): INT16 {
  // see how far we can go down a path and still shoot

  let bAttackCost: INT8;
  let bTrueActionPoints: INT8;
  let usActionData: UINT16;

  bAttackCost = MinAPsToAttack(pSoldier, sClosestOpponent, ADDTURNCOST);

  if (bAttackCost >= pSoldier.value.bActionPoints) {
    // probably want to go as far as possible!
    // return( NOWHERE );
    return GoAsFarAsPossibleTowards(pSoldier, sClosestOpponent, Enum289.AI_ACTION_SEEK_OPPONENT);
  }

  bTrueActionPoints = pSoldier.value.bActionPoints;

  pSoldier.value.bActionPoints -= bAttackCost;

  usActionData = GoAsFarAsPossibleTowards(pSoldier, sClosestOpponent, Enum289.AI_ACTION_SEEK_OPPONENT);

  pSoldier.value.bActionPoints = bTrueActionPoints;

  return usActionData;
}

}
