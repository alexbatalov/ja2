namespace ja2 {

export function HandleRPCDescription(): void {
  let ubMercsInSector: UINT8[] /* [20] */ = [ 0 ];
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt2: INT32;
  let fSAMSite: boolean = false;

  if (!gTacticalStatus.fCountingDownForGuideDescription) {
    return;
  }

  // ATE: postpone if we are not in tactical
  if (guiCurrentScreen != Enum26.GAME_SCREEN) {
    return;
  }

  if ((gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
    return;
  }

  // Are we a SAM site?
  if (gTacticalStatus.ubGuideDescriptionToUse == 27 || gTacticalStatus.ubGuideDescriptionToUse == 30 || gTacticalStatus.ubGuideDescriptionToUse == 32 || gTacticalStatus.ubGuideDescriptionToUse == 25 || gTacticalStatus.ubGuideDescriptionToUse == 31) {
    fSAMSite = true;
    gTacticalStatus.bGuideDescriptionCountDown = 1;
  }

  // ATE; Don't do in combat
  if ((gTacticalStatus.uiFlags & INCOMBAT) && !fSAMSite) {
    return;
  }

  // Don't do if enemy in sector
  if (NumEnemyInSector() && !fSAMSite) {
    return;
  }

  gTacticalStatus.bGuideDescriptionCountDown--;

  if (gTacticalStatus.bGuideDescriptionCountDown == 0) {
    gTacticalStatus.fCountingDownForGuideDescription = false;

    // OK, count how many rpc guys we have....
    // set up soldier ptr as first element in mercptrs list
    cnt2 = gTacticalStatus.Team[gbPlayerNum].bFirstID;

    // run through list
    for (pTeamSoldier = MercPtrs[cnt2]; cnt2 <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt2++, pTeamSoldier = MercPtrs[cnt2]) {
      // Add guy if he's a candidate...
      if (RPC_RECRUITED(pTeamSoldier)) {
        if (pTeamSoldier.bLife >= OKLIFE && pTeamSoldier.bActive && pTeamSoldier.sSectorX == gTacticalStatus.bGuideDescriptionSectorX && pTeamSoldier.sSectorY == gTacticalStatus.bGuideDescriptionSectorY && pTeamSoldier.bSectorZ == gbWorldSectorZ && !pTeamSoldier.fBetweenSectors) {
          if (pTeamSoldier.ubProfile == Enum268.IRA || pTeamSoldier.ubProfile == Enum268.MIGUEL || pTeamSoldier.ubProfile == Enum268.CARLOS || pTeamSoldier.ubProfile == Enum268.DIMITRI) {
            ubMercsInSector[ubNumMercs] = cnt2;
            ubNumMercs++;
          }
        }
      }
    }

    // If we are > 0
    if (ubNumMercs > 0) {
      ubChosenMerc = Random(ubNumMercs);

      TacticalCharacterDialogueWithSpecialEvent(MercPtrs[ubMercsInSector[ubChosenMerc]], gTacticalStatus.ubGuideDescriptionToUse, DIALOGUE_SPECIAL_EVENT_USE_ALTERNATE_FILES, 0, 0);
    }
  }
}

export function HandleTacticalEndTurn(): void {
  let cnt: UINT32;
  let pSoldier: SOLDIERTYPE;
  let uiTime: UINT32;
  /* static */ let uiTimeSinceLastStrategicUpdate: UINT32 = 0;

  // OK, Do a number of things here....
  // Every few turns......

  // Get time elasped
  uiTime = GetWorldTotalSeconds();

  if ((uiTimeSinceLastStrategicUpdate - uiTime) > 1200) {
    HandleRottingCorpses();
    // DecayTacticalMoraleModifiers();

    uiTimeSinceLastStrategicUpdate = uiTime;
  }

  DecayBombTimers();

  DecaySmokeEffects(uiTime);

  DecayLightEffects(uiTime);

  // Decay smells
  // DecaySmells();

  // Decay blood
  DecayBloodAndSmells(uiTime);

  // decay AI warning values from corpses
  DecayRottingCorpseAIWarnings();

  // Check for enemy pooling (add enemies if there happens to be more than the max in the
  // current battle.  If one or more slots have freed up, we can add them now.
  AddPossiblePendingEnemiesToBattle();

  // Loop through each active team and decay public opplist...
  // May want this done every few times too
  NonCombatDecayPublicOpplist(uiTime);
  /*
  for( cnt = 0; cnt < MAXTEAMS; cnt++ )
  {
          if ( gTacticalStatus.Team[ cnt ].bMenInSector > 0 )
          {
                  // decay team's public opplist
                  DecayPublicOpplist( (INT8)cnt );
          }
  }
*/

  // First pass:
  // Loop through our own mercs:
  //	Check things like ( even if not in our sector )
  //		1 ) All updates of breath, shock, bleeding, etc
  //    2 ) Updating First AID, etc
  //  ( If in our sector: )
  //		3 ) Update things like decayed opplist, etc

  // Second pass:
  //  Loop through all mercs in tactical engine
  //  If not a player merc ( ubTeam ) , do things like 1 , 2 , 3 above

  // First exit if we are not in realtime combat or realtime noncombat
  if (!(gTacticalStatus.uiFlags & TURNBASED) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    BeginLoggingForBleedMeToos(true);

    cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
      if (pSoldier.bActive && pSoldier.bLife > 0 && !(pSoldier.uiStatusFlags & SOLDIER_VEHICLE) && !(AM_A_ROBOT(pSoldier))) {
        // Handle everything from getting breath back, to bleeding, etc
        EVENT_BeginMercTurn(pSoldier, true, 0);

        // Handle Player services
        HandlePlayerServices(pSoldier);

        // if time is up, turn off xray
        if (pSoldier.uiXRayActivatedTime && uiTime > pSoldier.uiXRayActivatedTime + XRAY_TIME) {
          TurnOffXRayEffects(pSoldier);
        }

        // Handle stat changes if ness.
        // if ( fCheckStats )
        //{
        ////	UpdateStats( pSoldier );
        //}
      }
    }

    BeginLoggingForBleedMeToos(false);

    // OK, loop through the mercs to perform 'end turn' events on each...
    // We're looping through only mercs in tactical engine, ignoring our mercs
    // because they were done earilier...
    for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
      pSoldier = MercSlots[cnt];

      if (pSoldier != null) {
        if (pSoldier.bTeam != gbPlayerNum) {
          // Handle everything from getting breath back, to bleeding, etc
          EVENT_BeginMercTurn(pSoldier, true, 0);

          // Handle Player services
          HandlePlayerServices(pSoldier);
        }
      }
    }
  }

  HandleRPCDescription();
}

}
