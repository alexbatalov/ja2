namespace ja2 {

export function CallAvailableEnemiesTo(sGridNo: INT16): void {
  let iLoop: INT32;
  let iLoop2: INT32;
  let pSoldier: SOLDIERTYPE;

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
        for (pSoldier = MercPtrs[iLoop2]; iLoop2 <= gTacticalStatus.Team[iLoop].bLastID; iLoop2++, pSoldier = MercPtrs[iLoop2]) {
          if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE) {
            SetNewSituation(pSoldier);
            WearGasMaskIfAvailable(pSoldier);
          }
        }
      }
    }
  }
}

export function CallAvailableTeamEnemiesTo(sGridno: INT16, bTeam: INT8): void {
  let iLoop2: INT32;
  let pSoldier: SOLDIERTYPE;

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
      for (pSoldier = MercPtrs[iLoop2]; iLoop2 <= gTacticalStatus.Team[bTeam].bLastID; iLoop2++, pSoldier = MercPtrs[iLoop2]) {
        if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE) {
          SetNewSituation(pSoldier);
          WearGasMaskIfAvailable(pSoldier);
        }
      }
    }
  }
}

export function CallAvailableKingpinMenTo(sGridNo: INT16): void {
  // like call all enemies, but only affects civgroup KINGPIN guys with
  // NO PROFILE

  let iLoop2: INT32;
  let pSoldier: SOLDIERTYPE;

  // All enemy teams become aware of a very important "noise" coming from here!
  // if this team is active
  if (gTacticalStatus.Team[CIV_TEAM].bTeamActive) {
    // make this team (publicly) aware of the "noise"
    gsPublicNoiseGridno[CIV_TEAM] = sGridNo;
    gubPublicNoiseVolume[CIV_TEAM] = MAX_MISC_NOISE_DURATION;

    // new situation for everyone...

    iLoop2 = gTacticalStatus.Team[CIV_TEAM].bFirstID;
    for (pSoldier = MercPtrs[iLoop2]; iLoop2 <= gTacticalStatus.Team[CIV_TEAM].bLastID; iLoop2++, pSoldier = MercPtrs[iLoop2]) {
      if (pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE && pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP && pSoldier.ubProfile == NO_PROFILE) {
        SetNewSituation(pSoldier);
      }
    }
  }
}

export function CallEldinTo(sGridNo: INT16): void {
  // like call all enemies, but only affects Eldin
  let pSoldier: SOLDIERTYPE | null;

  // Eldin becomes aware of a very important "noise" coming from here!
  // So long as he hasn't already heard a noise a sec ago...
  if (gTacticalStatus.Team[CIV_TEAM].bTeamActive) {
    // new situation for Eldin
    pSoldier = FindSoldierByProfileID(Enum268.ELDIN, false);
    if (pSoldier && pSoldier.bActive && pSoldier.bInSector && pSoldier.bLife >= OKLIFE && (pSoldier.bAlertStatus == Enum243.STATUS_GREEN || pSoldier.ubNoiseVolume < (MAX_MISC_NOISE_DURATION / 2))) {
      if (SoldierToLocationLineOfSightTest(pSoldier, sGridNo, MaxDistanceVisible(), true)) {
        // sees the player now!
        TriggerNPCWithIHateYouQuote(Enum268.ELDIN);
        SetNewSituation(pSoldier);
      } else {
        pSoldier.sNoiseGridno = sGridNo;
        pSoldier.ubNoiseVolume = MAX_MISC_NOISE_DURATION;
        pSoldier.bAlertStatus = Enum243.STATUS_RED;
        if ((pSoldier.bAction != Enum289.AI_ACTION_GET_CLOSER) || CheckFact(Enum170.FACT_MUSEUM_ALARM_WENT_OFF, 0) == false) {
          CancelAIAction(pSoldier, 1);
          pSoldier.bNextAction = Enum289.AI_ACTION_GET_CLOSER;
          pSoldier.usNextActionData = sGridNo;
          pSoldier.AICounter = RESETTIMECOUNTER(100);
        }
        // otherwise let AI handle this normally
        //				SetNewSituation( pSoldier );
        // reduce any delay to minimal
      }
      SetFactTrue(Enum170.FACT_MUSEUM_ALARM_WENT_OFF);
    }
  }
}

export function MostImportantNoiseHeard(pSoldier: SOLDIERTYPE, piRetValue: Pointer<INT32> | null, pfClimbingNecessary: Pointer<boolean> | null, pfReachable: Pointer<boolean> | null): INT16 {
  let uiLoop: UINT32;
  let pbPersOL: INT8;
  let pbPublOL: INT8;
  let psLastLoc: INT16;
  let psNoiseGridNo: INT16;
  let pbNoiseLevel: INT8;
  let pbLastLevel: INT8;
  let pubNoiseVolume: UINT8;
  let iDistAway: INT32;
  let iNoiseValue: INT32;
  let iBestValue: INT32 = -10000;
  let sBestGridNo: INT16 = NOWHERE;
  let bBestLevel: INT8 = 0;
  let sClimbingGridNo: INT16;
  let fClimbingNecessary: boolean = false;
  let pTemp: SOLDIERTYPE;

  pubNoiseVolume = gubPublicNoiseVolume[pSoldier.bTeam];
  psNoiseGridNo = gsPublicNoiseGridno[pSoldier.bTeam];
  pbNoiseLevel = gbPublicNoiseLevel[pSoldier.bTeam];

  psLastLoc = gsLastKnownOppLoc[pSoldier.ubID][0];

  // hang pointers at start of this guy's personal and public opponent opplists
  pbPersOL = pSoldier.bOppList[0];
  pbPublOL = gbPublicOpplist[pSoldier.bTeam][0];

  // look through this man's personal & public opplists for opponents heard
  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pTemp = MercSlots[uiLoop];

    // if this merc is inactive, at base, on assignment, or dead
    if (!pTemp || !pTemp.bLife)
      continue; // next merc

    // if this merc is neutral/on same side, he's not an opponent
    if (CONSIDERED_NEUTRAL(pSoldier, pTemp) || (pSoldier.bSide == pTemp.bSide))
      continue; // next merc

    pbPersOL = pSoldier.bOppList[pTemp.ubID];
    pbPublOL = gbPublicOpplist[pSoldier.bTeam][pTemp.ubID];
    psLastLoc = gsLastKnownOppLoc[pSoldier.ubID][pTemp.ubID];
    pbLastLevel = gbLastKnownOppLevel[pSoldier.ubID][pTemp.ubID];

    // if this guy's been personally heard within last 3 turns
    if (pbPersOL < NOT_HEARD_OR_SEEN) {
      // calculate how far this noise was, and its relative "importance"
      iDistAway = SpacesAway(pSoldier.sGridNo, psLastLoc);
      iNoiseValue = (pbPersOL) * iDistAway; // always a negative number!

      if (iNoiseValue > iBestValue) {
        iBestValue = iNoiseValue;
        sBestGridNo = psLastLoc;
        bBestLevel = pbLastLevel;
      }
    }

    // if this guy's been publicly heard within last 3 turns
    if (pbPublOL < NOT_HEARD_OR_SEEN) {
      // calculate how far this noise was, and its relative "importance"
      iDistAway = SpacesAway(pSoldier.sGridNo, gsPublicLastKnownOppLoc[pSoldier.bTeam][pTemp.ubID]);
      iNoiseValue = (pbPublOL) * iDistAway; // always a negative number!

      if (iNoiseValue > iBestValue) {
        iBestValue = iNoiseValue;
        sBestGridNo = gsPublicLastKnownOppLoc[pSoldier.bTeam][pTemp.ubID];
        bBestLevel = gbPublicLastKnownOppLevel[pSoldier.bTeam][pTemp.ubID];
      }
    }
  }

  // if any "misc. noise" was also heard recently
  if (pSoldier.sNoiseGridno != NOWHERE) {
    if (pSoldier.bNoiseLevel != pSoldier.bLevel || PythSpacesAway(pSoldier.sGridNo, pSoldier.sNoiseGridno) >= 6 || SoldierTo3DLocationLineOfSightTest(pSoldier, pSoldier.sNoiseGridno, pSoldier.bNoiseLevel, 0, MaxDistanceVisible(), false) == 0) {
      // calculate how far this noise was, and its relative "importance"
      iDistAway = SpacesAway(pSoldier.sGridNo, pSoldier.sNoiseGridno);
      iNoiseValue = ((pSoldier.ubNoiseVolume / 2) - 6) * iDistAway;

      if (iNoiseValue > iBestValue) {
        iBestValue = iNoiseValue;
        sBestGridNo = pSoldier.sNoiseGridno;
        bBestLevel = pSoldier.bNoiseLevel;
      }
    } else {
      // we are there or near
      pSoldier.sNoiseGridno = NOWHERE; // wipe it out, not useful anymore
      pSoldier.ubNoiseVolume = 0;
    }
  }

  // if any recent PUBLIC "misc. noise" is also known
  if ((pSoldier.bTeam != CIV_TEAM) || (pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP)) {
    if (psNoiseGridNo != NOWHERE) {
      // if we are NOT there (at the noise gridno)
      if (pbNoiseLevel != pSoldier.bLevel || PythSpacesAway(pSoldier.sGridNo, psNoiseGridNo) >= 6 || SoldierTo3DLocationLineOfSightTest(pSoldier, psNoiseGridNo, pbNoiseLevel, 0, MaxDistanceVisible(), false) == 0) {
        // calculate how far this noise was, and its relative "importance"
        iDistAway = SpacesAway(pSoldier.sGridNo, psNoiseGridNo);
        iNoiseValue = ((pubNoiseVolume / 2) - 6) * iDistAway;

        if (iNoiseValue > iBestValue) {
          iBestValue = iNoiseValue;
          sBestGridNo = psNoiseGridNo;
          bBestLevel = pbNoiseLevel;
        }
      }
    }
  }

  if (sBestGridNo != NOWHERE && pfReachable) {
    pfReachable.value = true;

    // make civs not walk to noises outside their room if on close patrol/onguard
    if (pSoldier.bOrders <= Enum241.CLOSEPATROL && (pSoldier.bTeam == CIV_TEAM || pSoldier.ubProfile != NO_PROFILE)) {
      let ubRoom: UINT8;
      let ubNewRoom: UINT8;

      // any other combo uses the default of ubRoom == 0, set above
      if ((ubRoom = InARoom(pSoldier.usPatrolGrid[0])) !== -1) {
        if ((ubNewRoom = InARoom(pSoldier.usPatrolGrid[0])) === -1 || ubRoom != ubNewRoom) {
          pfReachable.value = false;
        }
      }
    }

    if (pfReachable.value) {
      // if there is a climb involved then we should store the location
      // of where we have to climb to instead
      sClimbingGridNo = GetInterveningClimbingLocation(pSoldier, sBestGridNo, bBestLevel, createPointer(() => fClimbingNecessary, (v) => fClimbingNecessary = v));
      if (fClimbingNecessary) {
        if (sClimbingGridNo == NOWHERE) {
          // can't investigate!
          pfReachable.value = false;
        } else {
          sBestGridNo = sClimbingGridNo;
          fClimbingNecessary = true;
        }
      } else {
        fClimbingNecessary = false;
      }
    }
  }

  if (piRetValue) {
    piRetValue.value = iBestValue;
  }

  if (pfClimbingNecessary) {
    pfClimbingNecessary.value = fClimbingNecessary;
  }

  return sBestGridNo;
}

export function WhatIKnowThatPublicDont(pSoldier: SOLDIERTYPE, ubInSightOnly: boolean /* UINT8 */): INT16 {
  let ubTotal: UINT8 = 0;
  let uiLoop: UINT32;
  let pbPersOL: INT8;
  let pbPublOL: INT8;
  let pTemp: SOLDIERTYPE;

  // if merc knows of a more important misc. noise than his team does
  if (!(CREATURE_OR_BLOODCAT(pSoldier)) && (pSoldier.ubNoiseVolume > gubPublicNoiseVolume[pSoldier.bTeam])) {
    // the difference in volume is added to the "new info" total
    ubTotal += pSoldier.ubNoiseVolume - gubPublicNoiseVolume[pSoldier.bTeam];
  }

  // hang pointers at start of this guy's personal and public opponent opplists
  pbPersOL = pSoldier.bOppList[0];
  pbPublOL = gbPublicOpplist[pSoldier.bTeam][0];

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
    if (CONSIDERED_NEUTRAL(pSoldier, pTemp) || (pSoldier.bSide == pTemp.bSide)) {
      continue; // next merc
    }

    pbPersOL = pSoldier.bOppList[pTemp.ubID];
    pbPublOL = gbPublicOpplist[pSoldier.bTeam][pTemp.ubID];

    // if we're only interested in guys currently is sight, and he's not
    if (ubInSightOnly) {
      if ((pbPersOL == SEEN_CURRENTLY) && (pbPublOL != SEEN_CURRENTLY)) {
        // just count the number of them
        ubTotal++;
      }
    } else {
      // add value of personal knowledge compared to public knowledge to total
      ubTotal += gubKnowledgeValue[pbPublOL - OLDEST_HEARD_VALUE][pbPersOL - OLDEST_HEARD_VALUE];
    }
  }

  return ubTotal;
}

}
