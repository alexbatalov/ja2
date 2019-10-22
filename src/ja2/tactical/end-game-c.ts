let sStatueGridNos: INT16[] /* [] */ = [
  13829,
  13830,
  13669,
  13670,
];

let gpKillerSoldier: Pointer<SOLDIERTYPE> = NULL;
let gsGridNo: INT16;
let gbLevel: INT8;

// This function checks if our statue exists in the current sector at given gridno
function DoesO3SectorStatueExistHere(sGridNo: INT16): BOOLEAN {
  let cnt: INT32;
  let ExitGrid: EXITGRID;

  // First check current sector......
  if (gWorldSectorX == 3 && gWorldSectorY == MAP_ROW_O && gbWorldSectorZ == 0) {
    // Check for exitence of and exit grid here...
    // ( if it doesn't then the change has already taken place )
    if (!GetExitGrid(13669, &ExitGrid)) {
      for (cnt = 0; cnt < 4; cnt++) {
        if (sStatueGridNos[cnt] == sGridNo) {
          return TRUE;
        }
      }
    }
  }

  return FALSE;
}

// This function changes the graphic of the statue and adds the exit grid...
function ChangeO3SectorStatue(fFromExplosion: BOOLEAN): void {
  let ExitGrid: EXITGRID;
  let usTileIndex: UINT16;
  let sX: INT16;
  let sY: INT16;

  // Remove old graphic
  ApplyMapChangesToMapTempFile(TRUE);
  // Remove it!
  // Get index for it...
  GetTileIndexFromTypeSubIndex(EIGHTOSTRUCT, (5), &usTileIndex);
  RemoveStruct(13830, usTileIndex);

  // Add new one...
  if (fFromExplosion) {
    // Use damaged peice
    GetTileIndexFromTypeSubIndex(EIGHTOSTRUCT, (7), &usTileIndex);
  } else {
    GetTileIndexFromTypeSubIndex(EIGHTOSTRUCT, (8), &usTileIndex);
    // Play sound...

    PlayJA2Sample(OPEN_STATUE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
  }
  AddStructToHead(13830, usTileIndex);

  // Add exit grid
  ExitGrid.ubGotoSectorX = 3;
  ExitGrid.ubGotoSectorY = MAP_ROW_O;
  ExitGrid.ubGotoSectorZ = 1;
  ExitGrid.usGridNo = 13037;

  AddExitGridToWorld(13669, &ExitGrid);
  gpWorldLevelData[13669].uiFlags |= MAPELEMENT_REVEALED;

  // Turn off permenant changes....
  ApplyMapChangesToMapTempFile(FALSE);

  // Re-render the world!
  gTacticalStatus.uiFlags |= NOHIDE_REDUNDENCY;
  // FOR THE NEXT RENDER LOOP, RE-EVALUATE REDUNDENT TILES
  InvalidateWorldRedundency();
  SetRenderFlags(RENDER_FLAG_FULL);

  // Redo movement costs....
  ConvertGridNoToXY(13830, &sX, &sY);

  RecompileLocalMovementCostsFromRadius(13830, 5);
}

function DeidrannaTimerCallback(): void {
  HandleDeidrannaDeath(gpKillerSoldier, gsGridNo, gbLevel);
}

function BeginHandleDeidrannaDeath(pKillerSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bLevel: INT8): void {
  gpKillerSoldier = pKillerSoldier;
  gsGridNo = sGridNo;
  gbLevel = bLevel;

  // Lock the UI.....
  gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;
  // Increment refrence count...
  giNPCReferenceCount = 1;

  gTacticalStatus.uiFlags |= IN_DEIDRANNA_ENDGAME;

  SetCustomizableTimerCallbackAndDelay(2000, DeidrannaTimerCallback, FALSE);
}

function HandleDeidrannaDeath(pKillerSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bLevel: INT8): void {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;
  let sDistVisible: INT16 = FALSE;
  let ubKillerSoldierID: UINT8 = NOBODY;

  // Start victory music here...
  SetMusicMode(MUSIC_TACTICAL_VICTORY);

  if (pKillerSoldier) {
    TacticalCharacterDialogue(pKillerSoldier, QUOTE_KILLING_DEIDRANNA);
    ubKillerSoldierID = pKillerSoldier.value.ubID;
  }

  // STEP 1 ) START ALL QUOTES GOING!
  // OK - loop through all witnesses and see if they want to say something abou this...
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
    if (cnt != ubKillerSoldierID) {
      if (OK_INSECTOR_MERC(pTeamSoldier) && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_GASSED) && !AM_AN_EPC(pTeamSoldier)) {
        if (QuoteExp_WitnessDeidrannaDeath[pTeamSoldier.value.ubProfile]) {
          // Can we see location?
          sDistVisible = DistanceVisible(pTeamSoldier, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, sGridNo, bLevel);

          if (SoldierTo3DLocationLineOfSightTest(pTeamSoldier, sGridNo, bLevel, 3, sDistVisible, TRUE)) {
            TacticalCharacterDialogue(pTeamSoldier, QUOTE_KILLING_DEIDRANNA);
          }
        }
      }
    }
  }

  // Set fact that she is dead!
  SetFactTrue(FACT_QUEEN_DEAD);

  ExecuteStrategicAIAction(STRATEGIC_AI_ACTION_QUEEN_DEAD, 0, 0);

  // AFTER LAST ONE IS DONE - PUT SPECIAL EVENT ON QUEUE TO BEGIN FADE< ETC
  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_MULTIPURPOSE, MULTIPURPOSE_SPECIAL_EVENT_DONE_KILLING_DEIDRANNA, 0, 0, 0, 0);
}

function DoneFadeInKilledQueen(): void {
  let pNPCSoldier: Pointer<SOLDIERTYPE>;

  // Locate gridno.....

  // Run NPC script
  pNPCSoldier = FindSoldierByProfileID(136, FALSE);
  if (!pNPCSoldier) {
    return;
  }

  // Converse!
  // InitiateConversation( pNPCSoldier, pSoldier, 0, 1 );
  TriggerNPCRecordImmediately(pNPCSoldier.value.ubProfile, 6);
}

function DoneFadeOutKilledQueen(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  // For one, loop through our current squad and move them over
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // Are we in this sector, On the current squad?
    if (pSoldier.value.bActive && pSoldier.value.bLife >= OKLIFE && pSoldier.value.bInSector && pSoldier.value.bAssignment == CurrentSquad()) {
      gfTacticalTraversal = TRUE;
      SetGroupSectorValue(3, MAP_ROW_P, 0, pSoldier.value.ubGroupID);

      // Set next sectore
      pSoldier.value.sSectorX = 3;
      pSoldier.value.sSectorY = MAP_ROW_P;
      pSoldier.value.bSectorZ = 0;

      // Set gridno
      pSoldier.value.ubStrategicInsertionCode = INSERTION_CODE_GRIDNO;
      pSoldier.value.usStrategicInsertionData = 5687;
      // Set direction to face....
      pSoldier.value.ubInsertionDirection = 100 + NORTHWEST;
    }
  }

  // Kill all enemies in world.....
  cnt = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[ENEMY_TEAM].bLastID; cnt++, pTeamSoldier++) {
    // Are we active and in sector.....
    if (pTeamSoldier.value.bActive) {
      // For sure for flag thet they are dead is not set
      // Check for any more badguys
      // ON THE STRAGETY LAYER KILL BAD GUYS!
      if (!pTeamSoldier.value.bNeutral && (pTeamSoldier.value.bSide != gbPlayerNum)) {
        ProcessQueenCmdImplicationsOfDeath(pSoldier);
      }
    }
  }

  // 'End' battle
  ExitCombatMode();
  gTacticalStatus.fLastBattleWon = TRUE;
  // Set enemy presence to false
  gTacticalStatus.fEnemyInSector = FALSE;

  SetMusicMode(MUSIC_TACTICAL_VICTORY);

  HandleMoraleEvent(NULL, MORALE_QUEEN_BATTLE_WON, 3, MAP_ROW_P, 0);
  HandleGlobalLoyaltyEvent(GLOBAL_LOYALTY_QUEEN_BATTLE_WON, 3, MAP_ROW_P, 0);

  SetMusicMode(MUSIC_TACTICAL_VICTORY);

  SetThisSectorAsPlayerControlled(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, TRUE);

  // ATE: Force change of level set z to 1
  gbWorldSectorZ = 1;

  // Clear out dudes.......
  SectorInfo[SEC_P3].ubNumAdmins = 0;
  SectorInfo[SEC_P3].ubNumTroops = 0;
  SectorInfo[SEC_P3].ubNumElites = 0;
  SectorInfo[SEC_P3].ubAdminsInBattle = 0;
  SectorInfo[SEC_P3].ubTroopsInBattle = 0;
  SectorInfo[SEC_P3].ubElitesInBattle = 0;

  // ATE: GEt rid of elliot in P3...
  gMercProfiles[ELLIOT].sSectorX = 1;

  ChangeNpcToDifferentSector(DEREK, 3, MAP_ROW_P, 0);
  ChangeNpcToDifferentSector(OLIVER, 3, MAP_ROW_P, 0);

  // OK, insertion data found, enter sector!
  SetCurrentWorldSector(3, MAP_ROW_P, 0);

  // OK, once down here, adjust the above map with crate info....
  gfTacticalTraversal = FALSE;
  gpTacticalTraversalGroup = NULL;
  gpTacticalTraversalChosenSoldier = NULL;

  gFadeInDoneCallback = DoneFadeInKilledQueen;

  FadeInGameScreen();
}

// Called after all player quotes are done....
function HandleDoneLastKilledQueenQuote(): void {
  gFadeOutDoneCallback = DoneFadeOutKilledQueen;

  FadeOutGameScreen();
}

function EndQueenDeathEndgameBeginEndCimenatic(): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Start end cimimatic....
  gTacticalStatus.uiFlags |= IN_ENDGAME_SEQUENCE;

  // first thing is to loop through team and say end quote...
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // Are we in this sector, On the current squad?
    if (pSoldier.value.bActive && pSoldier.value.bLife >= OKLIFE && !AM_AN_EPC(pSoldier)) {
      TacticalCharacterDialogue(pSoldier, QUOTE_END_GAME_COMMENT);
    }
  }

  // Add queue event to proceed w/ smacker cimimatic
  SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_MULTIPURPOSE, MULTIPURPOSE_SPECIAL_EVENT_TEAM_MEMBERS_DONE_TALKING, 0, 0, 0, 0);
}

function EndQueenDeathEndgame(): void {
  // Unset flags...
  gTacticalStatus.uiFlags &= (~ENGAGED_IN_CONV);
  // Increment refrence count...
  giNPCReferenceCount = 0;

  gTacticalStatus.uiFlags &= (~IN_DEIDRANNA_ENDGAME);
}

function DoneFadeOutEndCinematic(): void {
  // DAVE PUT SMAKER STUFF HERE!!!!!!!!!!!!
  // :)
  gTacticalStatus.uiFlags &= (~IN_ENDGAME_SEQUENCE);

  // For now, just quit the freaken game...
  //	InternalLeaveTacticalScreen( MAINMENU_SCREEN );

  InternalLeaveTacticalScreen(INTRO_SCREEN);
  //	guiCurrentScreen = INTRO_SCREEN;

  SetIntroType(INTRO_ENDING);
}

// OK, end death UI - fade to smaker....
function HandleDoneLastEndGameQuote(): void {
  EndQueenDeathEndgame();

  gFadeOutDoneCallback = DoneFadeOutEndCinematic;

  FadeOutGameScreen();
}

function QueenBitchTimerCallback(): void {
  HandleQueenBitchDeath(gpKillerSoldier, gsGridNo, gbLevel);
}

function BeginHandleQueenBitchDeath(pKillerSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bLevel: INT8): void {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;

  gpKillerSoldier = pKillerSoldier;
  gsGridNo = sGridNo;
  gbLevel = bLevel;

  // Lock the UI.....
  gTacticalStatus.uiFlags |= ENGAGED_IN_CONV;
  // Increment refrence count...
  giNPCReferenceCount = 1;

  // gTacticalStatus.uiFlags |= IN_DEIDRANNA_ENDGAME;

  SetCustomizableTimerCallbackAndDelay(3000, QueenBitchTimerCallback, FALSE);

  // Kill all enemies in creature team.....
  cnt = gTacticalStatus.Team[CREATURE_TEAM].bFirstID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; cnt++, pTeamSoldier++) {
    // Are we active and ALIVE and in sector.....
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bLife > 0) {
      // For sure for flag thet they are dead is not set
      // Check for any more badguys
      // ON THE STRAGETY LAYER KILL BAD GUYS!

      // HELLO!  THESE ARE CREATURES!  THEY CAN'T BE NEUTRAL!
      // if ( !pTeamSoldier->bNeutral && (pTeamSoldier->bSide != gbPlayerNum ) )
      {
        gTacticalStatus.ubAttackBusyCount++;
        EVENT_SoldierGotHit(pTeamSoldier, 0, 10000, 0, pTeamSoldier.value.bDirection, 320, NOBODY, FIRE_WEAPON_NO_SPECIAL, pTeamSoldier.value.bAimShotLocation, 0, NOWHERE);
      }
    }
  }
}

function HandleQueenBitchDeath(pKillerSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bLevel: INT8): void {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;
  let sDistVisible: INT16 = FALSE;
  let ubKillerSoldierID: UINT8 = NOBODY;

  // Start victory music here...
  SetMusicMode(MUSIC_TACTICAL_VICTORY);

  if (pKillerSoldier) {
    TacticalCharacterDialogue(pKillerSoldier, QUOTE_KILLING_QUEEN);
    ubKillerSoldierID = pKillerSoldier.value.ubID;
  }

  // STEP 1 ) START ALL QUOTES GOING!
  // OK - loop through all witnesses and see if they want to say something abou this...
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
    if (cnt != ubKillerSoldierID) {
      if (OK_INSECTOR_MERC(pTeamSoldier) && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_GASSED) && !AM_AN_EPC(pTeamSoldier)) {
        if (QuoteExp_WitnessQueenBugDeath[pTeamSoldier.value.ubProfile]) {
          // Can we see location?
          sDistVisible = DistanceVisible(pTeamSoldier, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, sGridNo, bLevel);

          if (SoldierTo3DLocationLineOfSightTest(pTeamSoldier, sGridNo, bLevel, 3, sDistVisible, TRUE)) {
            TacticalCharacterDialogue(pTeamSoldier, QUOTE_KILLING_QUEEN);
          }
        }
      }
    }
  }

  // Set fact that she is dead!
  if (CheckFact(FACT_QUEEN_DEAD, 0)) {
    EndQueenDeathEndgameBeginEndCimenatic();
  } else {
    // Unset flags...
    gTacticalStatus.uiFlags &= (~ENGAGED_IN_CONV);
    // Increment refrence count...
    giNPCReferenceCount = 0;
  }
}
