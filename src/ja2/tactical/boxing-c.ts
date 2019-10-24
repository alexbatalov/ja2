let gsBoxerGridNo: INT16[] /* [NUM_BOXERS] */ = [
  11393,
  11233,
  11073,
];
let gubBoxerID: UINT8[] /* [NUM_BOXERS] */ = [
  NOBODY,
  NOBODY,
  NOBODY,
];
let gfBoxerFought: BOOLEAN[] /* [NUM_BOXERS] */ = [
  FALSE,
  FALSE,
  FALSE,
];
let gfLastBoxingMatchWonByPlayer: BOOLEAN = FALSE;
let gubBoxingMatchesWon: UINT8 = 0;
let gubBoxersRests: UINT8 = 0;
let gfBoxersResting: BOOLEAN = FALSE;

function ExitBoxing(): void {
  let ubRoom: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiLoop: UINT32;
  let ubPass: UINT8;

  // find boxers and turn them neutral again

  // first time through loop, look for AI guy, then for PC guy.... for stupid
  // oppcnt/alert status reasons
  for (ubPass = 0; ubPass < 2; ubPass++) {
    // because boxer could die, loop through all soldier ptrs
    for (uiLoop = 0; uiLoop < gTacticalStatus.Team[CIV_TEAM].bLastID; uiLoop++) {
      pSoldier = MercPtrs[uiLoop];

      if (pSoldier != NULL) {
        if ((pSoldier.value.uiStatusFlags & SOLDIER_BOXER) && InARoom(pSoldier.value.sGridNo, addressof(ubRoom)) && ubRoom == BOXING_RING) {
          if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
            if (ubPass == 0) // pass 0, only handle AI
            {
              continue;
            }
            // put guy under AI control temporarily
            pSoldier.value.uiStatusFlags |= SOLDIER_PCUNDERAICONTROL;
          } else {
            if (ubPass == 1) // pass 1, only handle PCs
            {
              continue;
            }
            // reset AI boxer to neutral
            SetSoldierNeutral(pSoldier);
            RecalculateOppCntsDueToBecomingNeutral(pSoldier);
          }
          CancelAIAction(pSoldier, TRUE);
          pSoldier.value.bAlertStatus = Enum243.STATUS_GREEN;
          pSoldier.value.bUnderFire = 0;

          // if necessary, revive boxer so he can leave ring
          if (pSoldier.value.bLife > 0 && (pSoldier.value.bLife < OKLIFE || pSoldier.value.bBreath < OKBREATH)) {
            pSoldier.value.bLife = __max(OKLIFE * 2, pSoldier.value.bLife);
            if (pSoldier.value.bBreath < 100) {
              // deduct -ve BPs to grant some BPs back (properly)
              DeductPoints(pSoldier, 0,  - ((100 - pSoldier.value.bBreath) * 100));
            }
            BeginSoldierGetup(pSoldier);
          }
        }
      }
    }
  }

  DeleteTalkingMenu();

  EndAllAITurns();

  if (CheckForEndOfCombatMode(FALSE)) {
    EndTopMessage();
    SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);

    // Lock UI until we get out of the ring
    guiPendingOverrideEvent = Enum207.LU_BEGINUILOCK;
  }
}

// in both these cases we're going to want the AI to take over and move the boxers
// out of the ring!
function EndBoxingMatch(pLoser: Pointer<SOLDIERTYPE>): void {
  if (pLoser.value.bTeam == gbPlayerNum) {
    SetBoxingState(Enum247.LOST_ROUND);
  } else {
    SetBoxingState(Enum247.WON_ROUND);
    gfLastBoxingMatchWonByPlayer = TRUE;
    gubBoxingMatchesWon++;
  }
  TriggerNPCRecord(Enum268.DARREN, 22);
}

function BoxingPlayerDisqualified(pOffender: Pointer<SOLDIERTYPE>, bReason: INT8): void {
  if (bReason == Enum199.BOXER_OUT_OF_RING || bReason == Enum199.NON_BOXER_IN_RING) {
    EVENT_StopMerc(pOffender, pOffender.value.sGridNo, pOffender.value.bDirection);
  }
  SetBoxingState(Enum247.DISQUALIFIED);
  TriggerNPCRecord(Enum268.DARREN, 21);
  // ExitBoxing();
}

function TriggerEndOfBoxingRecord(pSoldier: Pointer<SOLDIERTYPE>): void {
  // unlock UI
  guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;

  if (pSoldier) {
    switch (gTacticalStatus.bBoxingState) {
      case Enum247.WON_ROUND:
        AddHistoryToPlayersLog(Enum83.HISTORY_WON_BOXING, pSoldier.value.ubProfile, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        TriggerNPCRecord(Enum268.DARREN, 23);
        break;
      case Enum247.LOST_ROUND:
        // log as lost
        AddHistoryToPlayersLog(Enum83.HISTORY_LOST_BOXING, pSoldier.value.ubProfile, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        TriggerNPCRecord(Enum268.DARREN, 24);
        break;
      case Enum247.DISQUALIFIED:
        AddHistoryToPlayersLog(Enum83.HISTORY_DISQUALIFIED_BOXING, pSoldier.value.ubProfile, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
        break;
    }
  }

  SetBoxingState(Enum247.NOT_BOXING);
}

function CountPeopleInBoxingRing(): UINT8 {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let uiLoop: UINT32;
  let ubRoom: UINT8;
  let ubTotalInRing: UINT8 = 0;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];

    if (pSoldier != NULL) {
      if (InARoom(pSoldier.value.sGridNo, addressof(ubRoom)) && ubRoom == BOXING_RING) {
        ubTotalInRing++;
      }
    }
  }

  return ubTotalInRing;
}

function CountPeopleInBoxingRingAndDoActions(): void {
  let uiLoop: UINT32;
  let ubTotalInRing: UINT8 = 0;
  let ubRoom: UINT8;
  let ubPlayersInRing: UINT8 = 0;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pInRing: Pointer<SOLDIERTYPE>[] /* [2] */ = [
    NULL,
    NULL,
  ];
  let pNonBoxingPlayer: Pointer<SOLDIERTYPE> = NULL;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];

    if (pSoldier != NULL) {
      if (InARoom(pSoldier.value.sGridNo, addressof(ubRoom)) && ubRoom == BOXING_RING) {
        if (ubTotalInRing < 2) {
          pInRing[ubTotalInRing] = pSoldier;
        }
        ubTotalInRing++;

        if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
          ubPlayersInRing++;

          if (!pNonBoxingPlayer && !(pSoldier.value.uiStatusFlags & SOLDIER_BOXER)) {
            pNonBoxingPlayer = pSoldier;
          }
        }
      }
    }
  }

  if (ubPlayersInRing > 1) {
    // boxing match just became invalid!
    if (gTacticalStatus.bBoxingState <= Enum247.PRE_BOXING) {
      BoxingPlayerDisqualified(pNonBoxingPlayer, Enum199.NON_BOXER_IN_RING);
      // set to not in boxing or it won't be handled otherwise
      SetBoxingState(Enum247.NOT_BOXING);
    } else {
      BoxingPlayerDisqualified(pNonBoxingPlayer, Enum199.NON_BOXER_IN_RING);
    }

    return;
  }

  if (gTacticalStatus.bBoxingState == Enum247.BOXING_WAITING_FOR_PLAYER) {
    if (ubTotalInRing == 1 && ubPlayersInRing == 1) {
      // time to go to pre-boxing
      SetBoxingState(Enum247.PRE_BOXING);
      PickABoxer();
    }
  } else
      // if pre-boxing, check for two people (from different teams!) in the ring
      if (gTacticalStatus.bBoxingState == Enum247.PRE_BOXING) {
    if (ubTotalInRing == 2 && ubPlayersInRing == 1) {
      // ladieees and gennleman, we have a fight!
      for (uiLoop = 0; uiLoop < 2; uiLoop++) {
        if (!(pInRing[uiLoop].value.uiStatusFlags & SOLDIER_BOXER)) {
          // set as boxer!
          pInRing[uiLoop].value.uiStatusFlags |= SOLDIER_BOXER;
        }
      }
      // start match!
      SetBoxingState(Enum247.BOXING);
      gfLastBoxingMatchWonByPlayer = FALSE;

      // give the first turn to a randomly chosen boxer
      EnterCombatMode(pInRing[Random(2)].value.bTeam);
    }
  }
  /*
  else
  {
          // check to see if the player has more than one person in the ring
          if ( ubPlayersInRing > 1 )
          {
                  // boxing match just became invalid!
                  BoxingPlayerDisqualified( pNonBoxingPlayer, NON_BOXER_IN_RING );
                  return;
          }
  }
  */
}

function CheckOnBoxers(): BOOLEAN {
  let uiLoop: UINT32;
  let ubID: UINT8;

  // repick boxer IDs every time
  if (gubBoxerID[0] == NOBODY) {
    // get boxer soldier IDs!
    for (uiLoop = 0; uiLoop < NUM_BOXERS; uiLoop++) {
      ubID = WhoIsThere2(gsBoxerGridNo[uiLoop], 0);
      if (FindObjClass(MercPtrs[ubID], IC_WEAPON) == NO_SLOT) {
        // no weapon so this guy is a boxer
        gubBoxerID[uiLoop] = ubID;
      }
    }
  }

  if (gubBoxerID[0] == NOBODY && gubBoxerID[1] == NOBODY && gubBoxerID[2] == NOBODY) {
    return FALSE;
  }

  return TRUE;
}

function BoxerExists(): BOOLEAN {
  let uiLoop: UINT32;

  for (uiLoop = 0; uiLoop < NUM_BOXERS; uiLoop++) {
    if (WhoIsThere2(gsBoxerGridNo[uiLoop], 0) != NOBODY) {
      return TRUE;
    }
  }
  return FALSE;
}

function PickABoxer(): BOOLEAN {
  let uiLoop: UINT32;
  let pBoxer: Pointer<SOLDIERTYPE>;

  for (uiLoop = 0; uiLoop < NUM_BOXERS; uiLoop++) {
    if (gubBoxerID[uiLoop] != NOBODY) {
      if (gfBoxerFought[uiLoop]) {
        // pathetic attempt to prevent multiple AI boxers
        MercPtrs[gubBoxerID[uiLoop]].value.uiStatusFlags &= ~SOLDIER_BOXER;
      } else {
        pBoxer = MercPtrs[gubBoxerID[uiLoop]];
        // pick this boxer!
        if (pBoxer.value.bActive && pBoxer.value.bInSector && pBoxer.value.bLife >= OKLIFE) {
          pBoxer.value.uiStatusFlags |= SOLDIER_BOXER;
          SetSoldierNonNeutral(pBoxer);
          RecalculateOppCntsDueToNoLongerNeutral(pBoxer);
          CancelAIAction(pBoxer, TRUE);
          RESETTIMECOUNTER(pBoxer.value.AICounter, 0);
          gfBoxerFought[uiLoop] = TRUE;
          // improve stats based on the # of rests these guys have had
          pBoxer.value.bStrength = __min(100, pBoxer.value.bStrength += gubBoxersRests * 5);
          pBoxer.value.bDexterity = __min(100, pBoxer.value.bDexterity + gubBoxersRests * 5);
          pBoxer.value.bAgility = __min(100, pBoxer.value.bAgility + gubBoxersRests * 5);
          pBoxer.value.bLifeMax = __min(100, pBoxer.value.bLifeMax + gubBoxersRests * 5);
          // give the 3rd boxer martial arts
          if ((uiLoop == NUM_BOXERS - 1) && pBoxer.value.ubBodyType == Enum194.REGMALE) {
            pBoxer.value.ubSkillTrait1 = Enum269.MARTIALARTS;
          }
          return TRUE;
        }
      }
    }
  }

  return FALSE;
}

function BoxerAvailable(): BOOLEAN {
  let ubLoop: UINT8;

  // No way around this, BoxerAvailable will have to go find boxer IDs if they aren't set.
  if (CheckOnBoxers() == FALSE) {
    return FALSE;
  }

  for (ubLoop = 0; ubLoop < NUM_BOXERS; ubLoop++) {
    if (gubBoxerID[ubLoop] != NOBODY && !gfBoxerFought[ubLoop]) {
      return TRUE;
    }
  }

  return FALSE;
}

// NOTE THIS IS NOW BROKEN BECAUSE NPC.C ASSUMES THAT BOXERSAVAILABLE < 3 IS A
// SEQUEL FIGHT.   Maybe we could check Kingpin's location instead!
function BoxersAvailable(): UINT8 {
  let ubLoop: UINT8;
  let ubCount: UINT8 = 0;

  for (ubLoop = 0; ubLoop < NUM_BOXERS; ubLoop++) {
    if (gubBoxerID[ubLoop] != NOBODY && !gfBoxerFought[ubLoop]) {
      ubCount++;
    }
  }

  return ubCount;
}

function AnotherFightPossible(): BOOLEAN {
  // Check that and a boxer is still available and
  // a player has at least OKLIFE + 5 life

  // and at least one fight HAS occurred
  let ubLoop: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubAvailable: UINT8;

  ubAvailable = BoxersAvailable();

  if (ubAvailable == NUM_BOXERS || ubAvailable == 0) {
    return FALSE;
  }

  // Loop through all mercs on player team
  ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  pSoldier = MercPtrs[ubLoop];
  for (; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife > (OKLIFE + 5) && !pSoldier.value.bCollapsed) {
      return TRUE;
    }
  }

  return FALSE;
}

function BoxingMovementCheck(pSoldier: Pointer<SOLDIERTYPE>): void {
  let ubRoom: UINT8;

  if (InARoom(pSoldier.value.sGridNo, addressof(ubRoom)) && ubRoom == BOXING_RING) {
    // someone moving in/into the ring
    CountPeopleInBoxingRingAndDoActions();
  } else if ((gTacticalStatus.bBoxingState == Enum247.BOXING) && (pSoldier.value.uiStatusFlags & SOLDIER_BOXER)) {
    // boxer stepped out of the ring!
    BoxingPlayerDisqualified(pSoldier, Enum199.BOXER_OUT_OF_RING);
    // add the history record here.
    AddHistoryToPlayersLog(Enum83.HISTORY_DISQUALIFIED_BOXING, pSoldier.value.ubProfile, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
    // make not a boxer any more
    pSoldier.value.uiStatusFlags &= ~(SOLDIER_BOXER);
    pSoldier.value.uiStatusFlags &= (~SOLDIER_PCUNDERAICONTROL);
  }
}

function SetBoxingState(bNewState: INT8): void {
  if (gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) {
    if (bNewState != Enum247.NOT_BOXING) {
      // pause time
      PauseGame();
    }
  } else {
    if (bNewState == Enum247.NOT_BOXING) {
      // unpause time
      UnPauseGame();

      if (BoxersAvailable() == NUM_BOXERS) {
        // set one boxer to be set as boxed so that the game will allow another
        // fight to occur
        gfBoxerFought[0] = TRUE;
      }
    }
  }
  gTacticalStatus.bBoxingState = bNewState;
}

function ClearAllBoxerFlags(): void {
  let uiSlot: UINT32;

  for (uiSlot = 0; uiSlot < guiNumMercSlots; uiSlot++) {
    if (MercSlots[uiSlot] && MercSlots[uiSlot].value.uiStatusFlags & SOLDIER_BOXER) {
      MercSlots[uiSlot].value.uiStatusFlags &= ~(SOLDIER_BOXER);
    }
  }
}
