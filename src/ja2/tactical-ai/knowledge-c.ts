function CallAvailableEnemiesTo(sGridNo: INT16): void {
  let iLoop: INT32;
  let iLoop2: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // All enemy teams become aware of a very important "noise" coming from here!
  for (iLoop = 0; iLoop < LAST_TEAM; iLoop++) {
    // if this team is active
    if (gTacticalStatus.Team[iLoop].bTeamActive) {
      // if this team is computer-controlled, and isn't the CIVILIAN "team"
      if (!(gTacticalStatus.Team[iLoop].bHuman) && (iLoop != CIV_TEAM)) {
        // make this team (publicly) aware of the "noise"
        gsPublicNoiseGridno[iLoop] = sGridNo;
        gubPublicNoiseVolume[iLoop] = MAX_MISC_NOISE_DURATION;

        // new situation for everyone;
        iLoop2 = gTacticalStatus.Team[iLoop].bFirstID;
        for (pSoldier = MercPtrs[iLoop2]; iLoop2 <= gTacticalStatus.Team[iLoop].bLastID; iLoop2++, pSoldier++) {
          if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE) {
            SetNewSituation(pSoldier);
            WearGasMaskIfAvailable(pSoldier);
          }
        }
      }
    }
  }
}

function CallAvailableTeamEnemiesTo(sGridno: INT16, bTeam: INT8): void {
  let iLoop2: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // All enemy teams become aware of a very important "noise" coming from here!
  // if this team is active
  if (gTacticalStatus.Team[bTeam].bTeamActive) {
    // if this team is computer-controlled, and isn't the CIVILIAN "team"
    if (!(gTacticalStatus.Team[bTeam].bHuman) && (bTeam != CIV_TEAM)) {
      // make this team (publicly) aware of the "noise"
      gsPublicNoiseGridno[bTeam] = sGridno;
      gubPublicNoiseVolume[bTeam] = MAX_MISC_NOISE_DURATION;

      // new situation for everyone;
      iLoop2 = gTacticalStatus.Team[bTeam].bFirstID;
      for (pSoldier = MercPtrs[iLoop2]; iLoop2 <= gTacticalStatus.Team[bTeam].bLastID; iLoop2++, pSoldier++) {
        if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE) {
          SetNewSituation(pSoldier);
          WearGasMaskIfAvailable(pSoldier);
        }
      }
    }
  }
}

function CallAvailableKingpinMenTo(sGridNo: INT16): void {
  // like call all enemies, but only affects civgroup KINGPIN guys with
  // NO PROFILE

  let iLoop2: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // All enemy teams become aware of a very important "noise" coming from here!
  // if this team is active
  if (gTacticalStatus.Team[CIV_TEAM].bTeamActive) {
    // make this team (publicly) aware of the "noise"
    gsPublicNoiseGridno[CIV_TEAM] = sGridNo;
    gubPublicNoiseVolume[CIV_TEAM] = MAX_MISC_NOISE_DURATION;

    // new situation for everyone...

    iLoop2 = gTacticalStatus.Team[CIV_TEAM].bFirstID;
    for (pSoldier = MercPtrs[iLoop2]; iLoop2 <= gTacticalStatus.Team[CIV_TEAM].bLastID; iLoop2++, pSoldier++) {
      if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE && pSoldier.value.ubCivilianGroup == KINGPIN_CIV_GROUP && pSoldier.value.ubProfile == NO_PROFILE) {
        SetNewSituation(pSoldier);
      }
    }
  }
}

function CallEldinTo(sGridNo: INT16): void {
  // like call all enemies, but only affects Eldin
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Eldin becomes aware of a very important "noise" coming from here!
  // So long as he hasn't already heard a noise a sec ago...
  if (gTacticalStatus.Team[CIV_TEAM].bTeamActive) {
    // new situation for Eldin
    pSoldier = FindSoldierByProfileID(ELDIN, FALSE);
    if (pSoldier && pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife >= OKLIFE && (pSoldier.value.bAlertStatus == STATUS_GREEN || pSoldier.value.ubNoiseVolume < (MAX_MISC_NOISE_DURATION / 2))) {
      if (SoldierToLocationLineOfSightTest(pSoldier, sGridNo, MaxDistanceVisible(), TRUE)) {
        // sees the player now!
        TriggerNPCWithIHateYouQuote(ELDIN);
        SetNewSituation(pSoldier);
      } else {
        pSoldier.value.sNoiseGridno = sGridNo;
        pSoldier.value.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
        pSoldier.value.bAlertStatus = STATUS_RED;
        if ((pSoldier.value.bAction != AI_ACTION_GET_CLOSER) || CheckFact(FACT_MUSEUM_ALARM_WENT_OFF, 0) == FALSE) {
          CancelAIAction(pSoldier, TRUE);
          pSoldier.value.bNextAction = AI_ACTION_GET_CLOSER;
          pSoldier.value.usNextActionData = sGridNo;
          RESETTIMECOUNTER(pSoldier.value.AICounter, 100);
        }
        // otherwise let AI handle this normally
        //				SetNewSituation( pSoldier );
        // reduce any delay to minimal
      }
      SetFactTrue(FACT_MUSEUM_ALARM_WENT_OFF);
    }
  }
}

function MostImportantNoiseHeard(pSoldier: Pointer<SOLDIERTYPE>, piRetValue: Pointer<INT32>, pfClimbingNecessary: Pointer<BOOLEAN>, pfReachable: Pointer<BOOLEAN>): INT16 {
  let uiLoop: UINT32;
  let pbPersOL: Pointer<INT8>;
  let pbPublOL: Pointer<INT8>;
  let psLastLoc: Pointer<INT16>;
  let psNoiseGridNo: Pointer<INT16>;
  let pbNoiseLevel: Pointer<INT8>;
  let pbLastLevel: Pointer<INT8>;
  let pubNoiseVolume: Pointer<UINT8>;
  let iDistAway: INT32;
  let iNoiseValue: INT32;
  let iBestValue: INT32 = -10000;
  let sBestGridNo: INT16 = NOWHERE;
  let bBestLevel: INT8 = 0;
  let sClimbingGridNo: INT16;
  let fClimbingNecessary: BOOLEAN = FALSE;
  let pTemp: Pointer<SOLDIERTYPE>;

  pubNoiseVolume = addressof(gubPublicNoiseVolume[pSoldier.value.bTeam]);
  psNoiseGridNo = addressof(gsPublicNoiseGridno[pSoldier.value.bTeam]);
  pbNoiseLevel = addressof(gbPublicNoiseLevel[pSoldier.value.bTeam]);

  psLastLoc = gsLastKnownOppLoc[pSoldier.value.ubID];

  // hang pointers at start of this guy's personal and public opponent opplists
  pbPersOL = pSoldier.value.bOppList;
  pbPublOL = gbPublicOpplist[pSoldier.value.bTeam];

  // look through this man's personal & public opplists for opponents heard
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pTemp = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pTemp || !pTemp.value.bLife)
      continue; // next merc

    // if this merc is neutral/on same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pTemp) || (pSoldier.value.bSide == pTemp.value.bSide))
      continue; // next merc

    pbPersOL = pSoldier.value.bOppList + pTemp.value.ubID;
    pbPublOL = gbPublicOpplist[pSoldier.value.bTeam] + pTemp.value.ubID;
    psLastLoc = gsLastKnownOppLoc[pSoldier.value.ubID] + pTemp.value.ubID;
    pbLastLevel = gbLastKnownOppLevel[pSoldier.value.ubID] + pTemp.value.ubID;

    // if this guy's been personally heard within last 3 turns
    if (*pbPersOL < NOT_HEARD_OR_SEEN) {
      // calculate how far this noise was, and its relative "importance"
      iDistAway = SpacesAway(pSoldier.value.sGridNo, *psLastLoc);
      iNoiseValue = (*pbPersOL) * iDistAway; // always a negative number!

      if (iNoiseValue > iBestValue) {
        iBestValue = iNoiseValue;
        sBestGridNo = *psLastLoc;
        bBestLevel = *pbLastLevel;
      }
    }

    // if this guy's been publicly heard within last 3 turns
    if (*pbPublOL < NOT_HEARD_OR_SEEN) {
      // calculate how far this noise was, and its relative "importance"
      iDistAway = SpacesAway(pSoldier.value.sGridNo, gsPublicLastKnownOppLoc[pSoldier.value.bTeam][pTemp.value.ubID]);
      iNoiseValue = (*pbPublOL) * iDistAway; // always a negative number!

      if (iNoiseValue > iBestValue) {
        iBestValue = iNoiseValue;
        sBestGridNo = gsPublicLastKnownOppLoc[pSoldier.value.bTeam][pTemp.value.ubID];
        bBestLevel = gbPublicLastKnownOppLevel[pSoldier.value.bTeam][pTemp.value.ubID];
      }
    }
  }

  // if any "misc. noise" was also heard recently
  if (pSoldier.value.sNoiseGridno != NOWHERE) {
    if (pSoldier.value.bNoiseLevel != pSoldier.value.bLevel || PythSpacesAway(pSoldier.value.sGridNo, pSoldier.value.sNoiseGridno) >= 6 || SoldierTo3DLocationLineOfSightTest(pSoldier, pSoldier.value.sNoiseGridno, pSoldier.value.bNoiseLevel, 0, MaxDistanceVisible(), FALSE) == 0) {
      // calculate how far this noise was, and its relative "importance"
      iDistAway = SpacesAway(pSoldier.value.sGridNo, pSoldier.value.sNoiseGridno);
      iNoiseValue = ((pSoldier.value.ubNoiseVolume / 2) - 6) * iDistAway;

      if (iNoiseValue > iBestValue) {
        iBestValue = iNoiseValue;
        sBestGridNo = pSoldier.value.sNoiseGridno;
        bBestLevel = pSoldier.value.bNoiseLevel;
      }
    } else {
      // we are there or near
      pSoldier.value.sNoiseGridno = NOWHERE; // wipe it out, not useful anymore
      pSoldier.value.ubNoiseVolume = 0;
    }
  }

  // if any recent PUBLIC "misc. noise" is also known
  if ((pSoldier.value.bTeam != CIV_TEAM) || (pSoldier.value.ubCivilianGroup == KINGPIN_CIV_GROUP)) {
    if (*psNoiseGridNo != NOWHERE) {
      // if we are NOT there (at the noise gridno)
      if (*pbNoiseLevel != pSoldier.value.bLevel || PythSpacesAway(pSoldier.value.sGridNo, *psNoiseGridNo) >= 6 || SoldierTo3DLocationLineOfSightTest(pSoldier, *psNoiseGridNo, *pbNoiseLevel, 0, MaxDistanceVisible(), FALSE) == 0) {
        // calculate how far this noise was, and its relative "importance"
        iDistAway = SpacesAway(pSoldier.value.sGridNo, *psNoiseGridNo);
        iNoiseValue = ((*pubNoiseVolume / 2) - 6) * iDistAway;

        if (iNoiseValue > iBestValue) {
          iBestValue = iNoiseValue;
          sBestGridNo = *psNoiseGridNo;
          bBestLevel = *pbNoiseLevel;
        }
      }
    }
  }

  if (sBestGridNo != NOWHERE && pfReachable) {
    *pfReachable = TRUE;

    // make civs not walk to noises outside their room if on close patrol/onguard
    if (pSoldier.value.bOrders <= CLOSEPATROL && (pSoldier.value.bTeam == CIV_TEAM || pSoldier.value.ubProfile != NO_PROFILE)) {
      let ubRoom: UINT8;
      let ubNewRoom: UINT8;

      // any other combo uses the default of ubRoom == 0, set above
      if (InARoom(pSoldier.value.usPatrolGrid[0], addressof(ubRoom))) {
        if (!InARoom(pSoldier.value.usPatrolGrid[0], addressof(ubNewRoom)) || ubRoom != ubNewRoom) {
          *pfReachable = FALSE;
        }
      }
    }

    if (*pfReachable) {
      // if there is a climb involved then we should store the location
      // of where we have to climb to instead
      sClimbingGridNo = GetInterveningClimbingLocation(pSoldier, sBestGridNo, bBestLevel, addressof(fClimbingNecessary));
      if (fClimbingNecessary) {
        if (sClimbingGridNo == NOWHERE) {
          // can't investigate!
          *pfReachable = FALSE;
        } else {
          sBestGridNo = sClimbingGridNo;
          fClimbingNecessary = TRUE;
        }
      } else {
        fClimbingNecessary = FALSE;
      }
    }
  }

  if (piRetValue) {
    *piRetValue = iBestValue;
  }

  if (pfClimbingNecessary) {
    *pfClimbingNecessary = fClimbingNecessary;
  }

  return sBestGridNo;
}

function WhatIKnowThatPublicDont(pSoldier: Pointer<SOLDIERTYPE>, ubInSightOnly: UINT8): INT16 {
  let ubTotal: UINT8 = 0;
  let uiLoop: UINT32;
  let pbPersOL: Pointer<INT8>;
  let pbPublOL: Pointer<INT8>;
  let pTemp: Pointer<SOLDIERTYPE>;

  // if merc knows of a more important misc. noise than his team does
  if (!(CREATURE_OR_BLOODCAT(pSoldier)) && (pSoldier.value.ubNoiseVolume > gubPublicNoiseVolume[pSoldier.value.bTeam])) {
    // the difference in volume is added to the "new info" total
    ubTotal += pSoldier.value.ubNoiseVolume - gubPublicNoiseVolume[pSoldier.value.bTeam];
  }

  // hang pointers at start of this guy's personal and public opponent opplists
  pbPersOL = addressof(pSoldier.value.bOppList[0]);
  pbPublOL = addressof(gbPublicOpplist[pSoldier.value.bTeam][0]);

  // for every opponent
  //	for (iLoop = 0; iLoop < MAXMERCS; iLoop++,pbPersOL++,pbPublOL++)
  //	{
  //	pTemp = &(Menptr[iLoop]);

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pTemp = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pTemp) {
      continue; // next merc
    }

    // if this merc is neutral/on same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pTemp) || (pSoldier.value.bSide == pTemp.value.bSide)) {
      continue; // next merc
    }

    pbPersOL = pSoldier.value.bOppList + pTemp.value.ubID;
    pbPublOL = gbPublicOpplist[pSoldier.value.bTeam] + pTemp.value.ubID;

    // if we're only interested in guys currently is sight, and he's not
    if (ubInSightOnly) {
      if ((*pbPersOL == SEEN_CURRENTLY) && (*pbPublOL != SEEN_CURRENTLY)) {
        // just count the number of them
        ubTotal++;
      }
    } else {
      // add value of personal knowledge compared to public knowledge to total
      ubTotal += gubKnowledgeValue[*pbPublOL - OLDEST_HEARD_VALUE][*pbPersOL - OLDEST_HEARD_VALUE];
    }
  }

  return ubTotal;
}
