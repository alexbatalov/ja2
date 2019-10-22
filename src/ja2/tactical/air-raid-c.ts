const SCRIPT_DELAY = 10;
const AIR_RAID_SAY_QUOTE_TIME = 3000;
const AIR_RAID_DIVE_INTERVAL = 10000;
const RAID_DELAY = 40;
const TIME_FROM_DIVE_SOUND_TO_ATTACK_DELAY = 8000;
const TIME_FROM_BOMB_SOUND_TO_ATTACK_DELAY = 3000;
const MOVE_X = 5;
const MOVE_Y = 5;
const STRAFE_DIST = 80;
const BOMB_DIST = 150;

let gfInAirRaid: BOOLEAN = FALSE;
let gfAirRaidScheduled: BOOLEAN = FALSE;
let gubAirRaidMode: UINT8;
let guiSoundSample: UINT32;
let guiRaidLastUpdate: UINT32;
let gfFadingRaidIn: BOOLEAN = FALSE;
let gfQuoteSaid: BOOLEAN = FALSE;
let gbNumDives: INT8 = 0;
let gbMaxDives: INT8 = 0;
let gfFadingRaidOut: BOOLEAN = FALSE;
let gsDiveX: INT16;
let gsDiveY: INT16;
let gsDiveTargetLocation: INT16;
let gubDiveDirection: UINT8;
let gsNumGridNosMoved: INT16;
let giNumTurnsSinceLastDive: INT32;
let giNumTurnsSinceDiveStarted: INT32;
let giNumGridNosMovedThisTurn: INT32;
let gfAirRaidHasHadTurn: BOOLEAN = FALSE;
let gubBeginTeamTurn: UINT8 = 0;
let gfHaveTBBatton: BOOLEAN = FALSE;
let gsNotLocatedYet: INT16 = FALSE;
let giNumFrames: INT32;

let gAirRaidDef: AIR_RAID_DEFINITION;

interface AIR_RAID_SAVE_STRUCT {
  fInAirRaid: BOOLEAN;
  fAirRaidScheduled: BOOLEAN;
  ubAirRaidMode: UINT8;
  uiSoundSample: UINT32;
  uiRaidLastUpdate: UINT32;
  fFadingRaidIn: BOOLEAN;
  fQuoteSaid: BOOLEAN;
  bNumDives: INT8;
  bMaxDives: INT8;
  fFadingRaidOut: BOOLEAN;
  sDiveX: INT16;
  sDiveY: INT16;
  sDiveTargetLocation: INT16;
  ubDiveDirection: UINT8;
  sNumGridNosMoved: INT16;
  iNumTurnsSinceLastDive: INT32;
  iNumTurnsSinceDiveStarted: INT32;
  iNumGridNosMovedThisTurn: INT32;
  fAirRaidHasHadTurn: BOOLEAN;
  ubBeginTeamTurn: UINT8;
  fHaveTBBatton: BOOLEAN;
  AirRaidDef: AIR_RAID_DEFINITION;
  sRaidSoldierID: INT16;

  sNotLocatedYet: INT16;
  iNumFrames: INT32;

  bLevel: INT8;
  bTeam: INT8;
  bSide: INT8;
  ubAttackerID: UINT8;
  usAttackingWeapon: UINT16;
  dXPos: FLOAT;
  dYPos: FLOAT;
  sX: INT16;
  sY: INT16;
  sGridNo: INT16;

  ubFiller: UINT8[] /* [32] */;
}

// END SERIALIZATION
let gpRaidSoldier: Pointer<SOLDIERTYPE>;

interface AIR_RAID_DIR {
  bDir1: INT8;
  bDir2: INT8;
}

interface AIR_RAID_POS {
  bX: INT8;
  bY: INT8;
}

let ubPerpDirections: AIR_RAID_DIR[] /* [] */ = [
  [ 2, 6 ],
  [ 3, 7 ],
  [ 0, 4 ],
  [ 1, 5 ],
  [ 2, 6 ],
  [ 3, 7 ],
  [ 0, 4 ],
  [ 1, 5 ],
];

let ubXYTragetInvFromDirection: AIR_RAID_POS[] /* [] */ = [
  [ 0, -1 ],
  [ 1, -1 ],
  [ 1, 0 ],
  [ 1, 1 ],
  [ 0, 1 ],
  [ -1, 1 ],
  [ -1, 0 ],
  [ -1, -1 ],
];

function ScheduleAirRaid(pAirRaidDef: Pointer<AIR_RAID_DEFINITION>): void {
  // Make sure only one is cheduled...
  if (gfAirRaidScheduled) {
    return;
  }

  // Copy definiaiotn structure into global struct....
  memcpy(&gAirRaidDef, pAirRaidDef, sizeof(AIR_RAID_DEFINITION));

  AddSameDayStrategicEvent(EVENT_BEGIN_AIR_RAID, (GetWorldMinutesInDay() + pAirRaidDef->ubNumMinsFromCurrentTime), 0);

  gfAirRaidScheduled = TRUE;
}

function BeginAirRaid(): BOOLEAN {
  let cnt: INT32;
  let fOK: BOOLEAN = FALSE;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // OK, we have been told to start.....

  // First remove scheduled flag...
  gfAirRaidScheduled = FALSE;

  /*
          if( WillAirRaidBeStopped( gAirRaidDef.sSectorX, gAirRaidDef.sSectorY ) )
          {
                  return( FALSE );
          }
  */

  // CHECK IF WE CURRENTLY HAVE THIS SECTOR OPEN....
  /*if (	gAirRaidDef.sSectorX == gWorldSectorX &&
                          gAirRaidDef.sSectorY == gWorldSectorY &&
                          gAirRaidDef.sSectorZ == gbWorldSectorZ )
  */
  // Do we have any guys in here...
  for (cnt = 0, pSoldier = MercPtrs[cnt]; cnt < 20; cnt++, pSoldier++) {
    if (pSoldier->bActive) {
      if (pSoldier->sSectorX == gAirRaidDef.sSectorX && pSoldier->sSectorY == gAirRaidDef.sSectorY && pSoldier->bSectorZ == gAirRaidDef.sSectorZ && !pSoldier->fBetweenSectors && pSoldier->bLife && pSoldier->bAssignment != IN_TRANSIT) {
        fOK = TRUE;
      }
    }
  }

  if (!fOK) {
    return FALSE;
  }

  // ( unless we are in prebattle interface, then ignore... )
  if (gfPreBattleInterfaceActive) {
    return FALSE;
  }

  ChangeSelectedMapSector(gAirRaidDef.sSectorX, gAirRaidDef.sSectorY, gAirRaidDef.sSectorZ);

  if (gAirRaidDef.sSectorX != gWorldSectorX || gAirRaidDef.sSectorY != gWorldSectorY || gAirRaidDef.sSectorZ != gbWorldSectorZ || guiCurrentScreen == MAP_SCREEN) {
    // sector not loaded
    // Set flag for handling raid....
    gubAirRaidMode = AIR_RAID_TRYING_TO_START;
    gfQuoteSaid = TRUE;
    SayQuoteFromAnyBodyInThisSector(gAirRaidDef.sSectorX, gAirRaidDef.sSectorY, gAirRaidDef.sSectorZ, QUOTE_AIR_RAID);
    SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_EXIT_MAP_SCREEN, gAirRaidDef.sSectorX, gAirRaidDef.sSectorY, gAirRaidDef.sSectorZ, 0, 0);
  } else {
    gubAirRaidMode = AIR_RAID_TRYING_TO_START;
    gfQuoteSaid = FALSE;
  }

  // Set flag for handling raid....
  gfInAirRaid = TRUE;
  giNumFrames = 0;

  guiRaidLastUpdate = GetJA2Clock();

  gbNumDives = 0;
  gfAirRaidHasHadTurn = FALSE;

  gpRaidSoldier = MercPtrs[MAX_NUM_SOLDIERS - 1];
  memset(gpRaidSoldier, 0, sizeof(SOLDIERTYPE));
  gpRaidSoldier->bLevel = 0;
  gpRaidSoldier->bTeam = 1;
  gpRaidSoldier->bSide = 1;
  gpRaidSoldier->ubID = MAX_NUM_SOLDIERS - 1;
  gpRaidSoldier->ubAttackerID = NOBODY;
  gpRaidSoldier->usAttackingWeapon = HK21E;
  gpRaidSoldier->inv[HANDPOS].usItem = HK21E;

  // Determine how many dives this one will be....
  gbMaxDives = (gAirRaidDef.bIntensity + Random(gAirRaidDef.bIntensity - 1));

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Begin Air Raid.");

  return TRUE;
}

function PickLocationNearAnyMercInSector(): INT16 {
  let ubMercsInSector: UINT8[] /* [20] */ = [ 0 ];
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;

  // Loop through all our guys and randomly say one from someone in our sector

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
    // Add guy if he's a candidate...
    if (OK_INSECTOR_MERC(pTeamSoldier)) {
      ubMercsInSector[ubNumMercs] = cnt;
      ubNumMercs++;
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    return MercPtrs[ubMercsInSector[ubChosenMerc]]->sGridNo;
  }

  return NOWHERE;
}

function PickRandomLocationAtMinSpacesAway(sGridNo: INT16, sMinValue: INT16, sRandomVar: INT16): INT16 {
  let sNewGridNo: INT16 = NOWHERE;

  let sX: INT16;
  let sY: INT16;
  let sNewX: INT16;
  let sNewY: INT16;

  sX = CenterX(sGridNo);
  sY = CenterY(sGridNo);

  while (sNewGridNo == NOWHERE) {
    sNewX = sX + sMinValue + Random(sRandomVar);
    sNewY = sY + sMinValue + Random(sRandomVar);

    if (Random(2)) {
      sNewX = -1 * sNewX;
    }

    if (Random(2)) {
      sNewY = -1 * sNewY;
    }

    // Make gridno....
    sNewGridNo = GETWORLDINDEXFROMWORLDCOORDS(sNewY, sNewX);

    // Check if visible on screen....
    if (!GridNoOnVisibleWorldTile(sNewGridNo)) {
      sNewGridNo = NOWHERE;
    }
  }

  return sNewGridNo;
}

function TryToStartRaid(): void {
  // OK, check conditions,

  // Some are:

  // Cannot be in battle ( this is handled by the fact of it begin shceduled in the first place...

  // Cannot be auto-bandaging?
  if (gTacticalStatus.fAutoBandageMode) {
    return;
  }

  // Cannot be in conversation...
  if (gTacticalStatus.uiFlags & ENGAGED_IN_CONV) {
    return;
  }

  // Cannot be traversing.....

  // Ok, go...
  gubAirRaidMode = AIR_RAID_START;
}

function AirRaidStart(): void {
  // Begin ambient sound....
  guiSoundSample = PlayJA2Sample(S_RAID_AMBIENT, RATE_11025, 0, 10000, MIDDLEPAN);

  gfFadingRaidIn = TRUE;

  // Setup start time....
  RESETTIMECOUNTER(giTimerAirRaidQuote, AIR_RAID_SAY_QUOTE_TIME);

  gubAirRaidMode = AIR_RAID_LOOK_FOR_DIVE;

  // If we are not in combat, change music mode...
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    SetMusicMode(MUSIC_TACTICAL_BATTLE);
  }
}

function AirRaidLookForDive(): void {
  let fDoDive: BOOLEAN = FALSE;
  let fDoQuote: BOOLEAN = FALSE;

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (!gfQuoteSaid) {
      if (TIMECOUNTERDONE(giTimerAirRaidQuote, AIR_RAID_SAY_QUOTE_TIME)) {
        fDoQuote = TRUE;
      }
    }
  } else {
    if (giNumTurnsSinceLastDive > 1 && !gfQuoteSaid) {
      fDoQuote = TRUE;
    }
  }

  // OK, check if we should say something....
  if (fDoQuote) {
    gfQuoteSaid = TRUE;

    // Someone in group say quote...
    SayQuoteFromAnyBodyInSector(QUOTE_AIR_RAID);

    // Update timer
    RESETTIMECOUNTER(giTimerAirRaidDiveStarted, AIR_RAID_DIVE_INTERVAL);

    giNumTurnsSinceLastDive = 0;

    // Do morale hit on our guys
    HandleMoraleEvent(NULL, MORALE_AIRSTRIKE, gAirRaidDef.sSectorX, gAirRaidDef.sSectorY, gAirRaidDef.sSectorZ);
  }

  // If NOT in combat....
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    // OK, for now on, all we try to do is look for dives to make...
    if (gfQuoteSaid) {
      if (TIMECOUNTERDONE(giTimerAirRaidDiveStarted, AIR_RAID_DIVE_INTERVAL)) {
        // IN realtime, give a bit more leeway for time....
        if (Random(2)) {
          fDoDive = TRUE;
        }
      }
    }
  } else {
    // How many turns have gone by?
    if (giNumTurnsSinceLastDive > (Random(2) + 1)) {
      fDoDive = TRUE;
    }
  }

  if (fDoDive) {
    // If we are are beginning game, only to gun dives..
    if (gAirRaidDef.uiFlags & AIR_RAID_BEGINNING_GAME) {
      if (gbNumDives == 0) {
        gubAirRaidMode = AIR_RAID_BEGIN_DIVE;
      } else if (gbNumDives == 1) {
        gubAirRaidMode = AIR_RAID_BEGIN_BOMBING;
      } else {
        gubAirRaidMode = AIR_RAID_BEGIN_DIVE;
      }
    } else {
      // Randomly do dive...
      if (Random(2)) {
        gubAirRaidMode = AIR_RAID_BEGIN_DIVE;
      } else {
        gubAirRaidMode = AIR_RAID_BEGIN_BOMBING;
      }
    }
    gbNumDives++;
    return;
  } else {
    if ((gTacticalStatus.uiFlags & INCOMBAT)) {
      if (giNumGridNosMovedThisTurn == 0) {
        // Free up attacker...
        FreeUpAttacker(gpRaidSoldier->ubID);
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Tried to free up attacker AIR RAID NO DIVE, attack count now %d", gTacticalStatus.ubAttackBusyCount));
      }
    }
  }

  // End if we have made desired # of dives...
  if (gbNumDives == gbMaxDives) {
    // Air raid is over....
    gubAirRaidMode = AIR_RAID_START_END;
  }
}

function AirRaidStartEnding(): void {
  // Fade out sound.....
  gfFadingRaidOut = TRUE;
}

function BeginBombing(): void {
  let sGridNo: INT16;
  let iSoundStartDelay: UINT32;

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    // Start diving sound...
    PlayJA2Sample(S_RAID_WHISTLE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
  }

  gubAirRaidMode = AIR_RAID_BOMBING;

  // Pick location...
  gsDiveTargetLocation = PickLocationNearAnyMercInSector();

  if (gsDiveTargetLocation == NOWHERE) {
    gsDiveTargetLocation = 10234;
  }

  // Get location of aircraft....
  sGridNo = PickRandomLocationAtMinSpacesAway(gsDiveTargetLocation, 300, 200);

  // Save X, y:
  gsDiveX = CenterX(sGridNo);
  gsDiveY = CenterY(sGridNo);

  RESETTIMECOUNTER(giTimerAirRaidUpdate, RAID_DELAY);

  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    iSoundStartDelay = 0;
  } else {
    iSoundStartDelay = TIME_FROM_BOMB_SOUND_TO_ATTACK_DELAY;
  }
  RESETTIMECOUNTER(giTimerAirRaidDiveStarted, iSoundStartDelay);

  giNumTurnsSinceDiveStarted = 0;

  // Get direction....
  gubDiveDirection = GetDirectionToGridNoFromGridNo(sGridNo, gsDiveTargetLocation);

  gsNumGridNosMoved = 0;
  gsNotLocatedYet = TRUE;
}

function BeginDive(): void {
  let sGridNo: INT16;
  let iSoundStartDelay: UINT32;

  // Start diving sound...
  PlayJA2Sample(S_RAID_DIVE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);

  gubAirRaidMode = AIR_RAID_DIVING;

  // Increment attacker bust count....
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack BEGIN DIVE %d", gTacticalStatus.ubAttackBusyCount));

  // Pick location...
  gsDiveTargetLocation = PickLocationNearAnyMercInSector();

  if (gsDiveTargetLocation == NOWHERE) {
    gsDiveTargetLocation = 10234;
  }

  // Get location of aircraft....
  sGridNo = PickRandomLocationAtMinSpacesAway(gsDiveTargetLocation, 300, 200);

  // Save X, y:
  gsDiveX = CenterX(sGridNo);
  gsDiveY = CenterY(sGridNo);

  RESETTIMECOUNTER(giTimerAirRaidUpdate, RAID_DELAY);
  giNumTurnsSinceDiveStarted = 0;

  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    iSoundStartDelay = 0;
  } else {
    iSoundStartDelay = TIME_FROM_DIVE_SOUND_TO_ATTACK_DELAY;
  }
  RESETTIMECOUNTER(giTimerAirRaidDiveStarted, iSoundStartDelay);

  // Get direction....
  gubDiveDirection = GetDirectionToGridNoFromGridNo(sGridNo, gsDiveTargetLocation);

  gsNumGridNosMoved = 0;
  gsNotLocatedYet = TRUE;
}

function MoveDiveAirplane(dAngle: FLOAT): void {
  let dDeltaPos: FLOAT;

  // Find delta Movement for X pos
  dDeltaPos = MOVE_X * sin(dAngle);

  // Find new position
  gsDiveX = (gsDiveX + dDeltaPos);

  // Find delta Movement for Y pos
  dDeltaPos = MOVE_X * cos(dAngle);

  // Find new pos
  gsDiveY = (gsDiveY + dDeltaPos);
}

function DoDive(): void {
  let sRange: INT16;
  let sGridNo: INT16;
  let sOldGridNo: INT16;

  let sTargetX: INT16;
  let sTargetY: INT16;
  let sStrafeX: INT16;
  let sStrafeY: INT16;
  let dDeltaX: FLOAT;
  let dDeltaY: FLOAT;
  let dAngle: FLOAT;
  let dDeltaXPos: FLOAT;
  let dDeltaYPos: FLOAT;
  let sX: INT16;
  let sY: INT16;

  // Delay for a specific perion of time to allow sound to Q up...
  if (TIMECOUNTERDONE(giTimerAirRaidDiveStarted, 0)) {
    // OK, rancomly decide to not do this dive...
    if (gAirRaidDef.uiFlags & AIR_RAID_CAN_RANDOMIZE_TEASE_DIVES) {
      if (Random(10) == 0) {
        // Finish....
        gubAirRaidMode = AIR_RAID_END_DIVE;
        return;
      }
    }

    if (gsNotLocatedYet && !(gTacticalStatus.uiFlags & INCOMBAT)) {
      gsNotLocatedYet = FALSE;
      LocateGridNo(gsDiveTargetLocation);
    }

    sOldGridNo = GETWORLDINDEXFROMWORLDCOORDS(gsDiveY, gsDiveX);

    // Dive until we are a certain range to target....
    sRange = PythSpacesAway(sOldGridNo, gsDiveTargetLocation);

    // If sRange
    if (sRange < 3) {
      // Finish....
      gubAirRaidMode = AIR_RAID_END_DIVE;
      return;
    }

    if (TIMECOUNTERDONE(giTimerAirRaidUpdate, RAID_DELAY)) {
      RESETTIMECOUNTER(giTimerAirRaidUpdate, RAID_DELAY);

      // Move Towards target....
      sTargetX = CenterX(gsDiveTargetLocation);
      sTargetY = CenterY(gsDiveTargetLocation);

      // Determine deltas
      dDeltaX = (sTargetX - gsDiveX);
      dDeltaY = (sTargetY - gsDiveY);

      // Determine angle
      dAngle = atan2(dDeltaX, dDeltaY);

      MoveDiveAirplane(dAngle);

      gpRaidSoldier->dXPos = gsDiveX;
      gpRaidSoldier->sX = gsDiveX;
      gpRaidSoldier->dYPos = gsDiveY;
      gpRaidSoldier->sY = gsDiveY;

      // Figure gridno....
      sGridNo = GETWORLDINDEXFROMWORLDCOORDS(gsDiveY, gsDiveX);
      gpRaidSoldier->sGridNo = sGridNo;

      if (sOldGridNo != sGridNo) {
        gsNumGridNosMoved++;

        giNumGridNosMovedThisTurn++;

        // OK, shoot bullets....
        // Get positions of guns...

        // Get target.....
        dDeltaXPos = STRAFE_DIST * sin(dAngle);
        sStrafeX = (gsDiveX + dDeltaXPos);

        // Find delta Movement for Y pos
        dDeltaYPos = STRAFE_DIST * cos(dAngle);
        sStrafeY = (gsDiveY + dDeltaYPos);

        if ((gTacticalStatus.uiFlags & INCOMBAT)) {
          LocateGridNo(sGridNo);
        }

        if (GridNoOnVisibleWorldTile((GETWORLDINDEXFROMWORLDCOORDS(sStrafeY, sStrafeX)))) {
          // if ( gsNotLocatedYet && !( gTacticalStatus.uiFlags & INCOMBAT ) )
          //	{
          //	gsNotLocatedYet = FALSE;
          //		LocateGridNo( sGridNo );
          //	}

          // if ( ( gTacticalStatus.uiFlags & INCOMBAT ) )
          {
            // Increase attacker busy...
            // gTacticalStatus.ubAttackBusyCount++;
            // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack AIR RAID ( fire gun ), attack count now %d", gTacticalStatus.ubAttackBusyCount) );

            // INcrement bullet fired...
            gpRaidSoldier->bBulletsLeft++;
          }

          // For now use first position....

          gpRaidSoldier->ubTargetID = NOBODY;
          FireBulletGivenTarget(gpRaidSoldier, sStrafeX, sStrafeY, 0, gpRaidSoldier->usAttackingWeapon, 10, FALSE, FALSE);
        }

        // Do second one.... ( ll )
        sX = (gsDiveX + (sin(dAngle + (PI / 2)) * 40));
        sY = (gsDiveY + (cos(dAngle + (PI / 2)) * 40));

        gpRaidSoldier->dXPos = sX;
        gpRaidSoldier->sX = sX;
        gpRaidSoldier->dYPos = sY;
        gpRaidSoldier->sY = sY;
        gpRaidSoldier->sGridNo = GETWORLDINDEXFROMWORLDCOORDS(sY, sX);

        // Get target.....
        sStrafeX = (sX + dDeltaXPos);

        // Find delta Movement for Y pos
        sStrafeY = (sY + dDeltaYPos);

        if (GridNoOnVisibleWorldTile((GETWORLDINDEXFROMWORLDCOORDS(sStrafeY, sStrafeX)))) {
          // if ( ( gTacticalStatus.uiFlags & INCOMBAT ) )
          {
            // Increase attacker busy...
            // gTacticalStatus.ubAttackBusyCount++;
            // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack AIR RAID ( second one ), attack count now %d", gTacticalStatus.ubAttackBusyCount) );

            // INcrement bullet fired...
            gpRaidSoldier->bBulletsLeft++;
          }

          // For now use first position....
          FireBulletGivenTarget(gpRaidSoldier, sStrafeX, sStrafeY, 0, gpRaidSoldier->usAttackingWeapon, 10, FALSE, FALSE);
        }
      }

      if (giNumGridNosMovedThisTurn >= 6) {
        if ((gTacticalStatus.uiFlags & INCOMBAT)) {
          // Free up attacker...
          FreeUpAttacker(gpRaidSoldier->ubID);
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Tried to free up attacker AIR RAID DIVE DONE FOR THIS TURN, attack count now %d", gTacticalStatus.ubAttackBusyCount));
        }
      }
    }
  }
}

function DoBombing(): void {
  let sRange: INT16;
  let sGridNo: INT16;
  let sOldGridNo: INT16;
  let sBombGridNo: INT16;

  let sTargetX: INT16;
  let sTargetY: INT16;
  let usItem: UINT16;
  let sStrafeX: INT16;
  let sStrafeY: INT16;
  let dDeltaX: FLOAT;
  let dDeltaY: FLOAT;
  let dAngle: FLOAT;
  let dDeltaXPos: FLOAT;
  let dDeltaYPos: FLOAT;
  let fLocate: BOOLEAN = FALSE;

  // Delay for a specific perion of time to allow sound to Q up...
  if (TIMECOUNTERDONE(giTimerAirRaidDiveStarted, 0)) {
    // OK, rancomly decide to not do this dive...
    if (gAirRaidDef.uiFlags & AIR_RAID_CAN_RANDOMIZE_TEASE_DIVES) {
      if (Random(10) == 0) {
        // Finish....
        gubAirRaidMode = AIR_RAID_END_BOMBING;
        return;
      }
    }

    if (gsNotLocatedYet && !(gTacticalStatus.uiFlags & INCOMBAT)) {
      gsNotLocatedYet = FALSE;
      LocateGridNo(gsDiveTargetLocation);
    }

    sOldGridNo = GETWORLDINDEXFROMWORLDCOORDS(gsDiveY, gsDiveX);

    // Dive until we are a certain range to target....
    sRange = PythSpacesAway(sOldGridNo, gsDiveTargetLocation);

    // If sRange
    if (sRange < 3) {
      // Finish....
      gubAirRaidMode = AIR_RAID_END_BOMBING;
      return;
    }

    if (TIMECOUNTERDONE(giTimerAirRaidUpdate, RAID_DELAY)) {
      RESETTIMECOUNTER(giTimerAirRaidUpdate, RAID_DELAY);

      // Move Towards target....
      sTargetX = CenterX(gsDiveTargetLocation);
      sTargetY = CenterY(gsDiveTargetLocation);

      // Determine deltas
      dDeltaX = (sTargetX - gsDiveX);
      dDeltaY = (sTargetY - gsDiveY);

      // Determine angle
      dAngle = atan2(dDeltaX, dDeltaY);

      MoveDiveAirplane(dAngle);

      gpRaidSoldier->dXPos = gsDiveX;
      gpRaidSoldier->sX = gsDiveX;
      gpRaidSoldier->dYPos = gsDiveY;
      gpRaidSoldier->sY = gsDiveY;

      // Figure gridno....
      sGridNo = GETWORLDINDEXFROMWORLDCOORDS(gsDiveY, gsDiveX);
      gpRaidSoldier->sGridNo = sGridNo;

      if (sOldGridNo != sGridNo) {
        // Every once and a while, drop bomb....
        gsNumGridNosMoved++;

        giNumGridNosMovedThisTurn++;

        if ((gsNumGridNosMoved % 4) == 0) {
          // Get target.....
          dDeltaXPos = BOMB_DIST * sin(dAngle);
          sStrafeX = (gsDiveX + dDeltaXPos);

          // Find delta Movement for Y pos
          dDeltaYPos = BOMB_DIST * cos(dAngle);
          sStrafeY = (gsDiveY + dDeltaYPos);

          if (GridNoOnVisibleWorldTile((GETWORLDINDEXFROMWORLDCOORDS(sStrafeY, sStrafeX)))) {
            // if ( gsNotLocatedYet && !( gTacticalStatus.uiFlags & INCOMBAT ) )
            //{
            //	gsNotLocatedYet = FALSE;
            //	LocateGridNo( sGridNo );
            //}

            if (Random(2)) {
              usItem = HAND_GRENADE;
            } else {
              usItem = RDX;
            }

            // Pick random gridno....
            sBombGridNo = PickRandomLocationAtMinSpacesAway((GETWORLDINDEXFROMWORLDCOORDS(sStrafeY, sStrafeX)), 40, 40);

            if ((gTacticalStatus.uiFlags & INCOMBAT)) {
              fLocate = TRUE;
              // Increase attacker busy...
              gTacticalStatus.ubAttackBusyCount++;
              DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack AIR RAID ( bombs away ), attack count now %d", gTacticalStatus.ubAttackBusyCount));
            }

            // Drop bombs...
            InternalIgniteExplosion(NOBODY, CenterX(sBombGridNo), CenterY(sBombGridNo), 0, sBombGridNo, usItem, fLocate, IsRoofPresentAtGridno(sBombGridNo));
          }
        }

        if (giNumGridNosMovedThisTurn >= 6) {
          if ((gTacticalStatus.uiFlags & INCOMBAT)) {
            // Free up attacker...
            FreeUpAttacker(gpRaidSoldier->ubID);
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Tried to free up attacker AIR RAID BOMB ATTACK DONE FOR THIS TURN, attack count now %d", gTacticalStatus.ubAttackBusyCount));
          }
        }
      }
    }
  }
}

function HandleAirRaid(): void {
  let iVol: INT32;
  let uiClock: UINT32;

  // OK,
  if (gfInAirRaid) {
    // Are we in TB?
    if ((gTacticalStatus.uiFlags & INCOMBAT)) {
      // Do we have the batton?
      if (!gfHaveTBBatton) {
        // Don;t do anything else!
        return;
      }
    }

    uiClock = GetJA2Clock();

    if ((uiClock - guiRaidLastUpdate) > SCRIPT_DELAY) {
      giNumFrames++;

      guiRaidLastUpdate = uiClock;

      if (gfFadingRaidIn) {
        if (guiSoundSample != NO_SAMPLE) {
          if ((giNumFrames % 10) == 0) {
            iVol = SoundGetVolume(guiSoundSample);
            iVol = __min(HIGHVOLUME, iVol + 1);
            SoundSetVolume(guiSoundSample, iVol);
            if (iVol == HIGHVOLUME)
              gfFadingRaidIn = FALSE;
          }
        } else {
          gfFadingRaidIn = FALSE;
        }
      } else if (gfFadingRaidOut) {
        if (guiSoundSample != NO_SAMPLE) {
          if ((giNumFrames % 10) == 0) {
            iVol = SoundGetVolume(guiSoundSample);

            iVol = __max(0, iVol - 1);

            SoundSetVolume(guiSoundSample, iVol);
            if (iVol == 0) {
              gfFadingRaidOut = FALSE;

              gubAirRaidMode = AIR_RAID_END;
            }
          }
        } else {
          gfFadingRaidOut = FALSE;
          gubAirRaidMode = AIR_RAID_END;
        }
      }

      switch (gubAirRaidMode) {
        case AIR_RAID_TRYING_TO_START:

          TryToStartRaid();
          break;

        case AIR_RAID_START:

          AirRaidStart();
          break;

        case AIR_RAID_LOOK_FOR_DIVE:

          AirRaidLookForDive();
          break;

        case AIR_RAID_START_END:

          AirRaidStartEnding();
          break;

        case AIR_RAID_END:

          EndAirRaid();
          break;

        case AIR_RAID_BEGIN_DIVE:

          BeginDive();
          break;

        case AIR_RAID_DIVING:

          // If in combat, check if we have reached our max...
          if ((gTacticalStatus.uiFlags & INCOMBAT)) {
            if (giNumGridNosMovedThisTurn < 6) {
              DoDive();
            }
          } else {
            DoDive();
          }
          break;

        case AIR_RAID_END_DIVE:

          giNumTurnsSinceLastDive = 0;
          RESETTIMECOUNTER(giTimerAirRaidDiveStarted, AIR_RAID_DIVE_INTERVAL);

          if ((gTacticalStatus.uiFlags & INCOMBAT)) {
            // Free up attacker...
            FreeUpAttacker(gpRaidSoldier->ubID);
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Tried to free up attacker AIR RAID ENDING DIVE, attack count now %d", gTacticalStatus.ubAttackBusyCount));
          }

          gubAirRaidMode = AIR_RAID_LOOK_FOR_DIVE;
          break;

        case AIR_RAID_END_BOMBING:

          RESETTIMECOUNTER(giTimerAirRaidDiveStarted, AIR_RAID_DIVE_INTERVAL);
          giNumTurnsSinceLastDive = 0;

          if ((gTacticalStatus.uiFlags & INCOMBAT)) {
            // Free up attacker...
            FreeUpAttacker(gpRaidSoldier->ubID);
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Tried to free up attacker AIR RAID ENDING DIVE, attack count now %d", gTacticalStatus.ubAttackBusyCount));
          }

          gubAirRaidMode = AIR_RAID_LOOK_FOR_DIVE;
          break;

        case AIR_RAID_BEGIN_BOMBING:
          BeginBombing();
          break;

        case AIR_RAID_BOMBING:
          DoBombing();
          break;
      }
    }

    if ((gTacticalStatus.uiFlags & INCOMBAT)) {
      // Do we have the batton?
      if (gfHaveTBBatton) {
        // Are we through with attacker busy count?
        if (gTacticalStatus.ubAttackBusyCount == 0) {
          // Relinquish control....
          gfAirRaidHasHadTurn = TRUE;
          gfHaveTBBatton = FALSE;
          BeginTeamTurn(gubBeginTeamTurn);
        }
      }
    }
  }
}

function InAirRaid(): BOOLEAN {
  return gfInAirRaid;
}

function HandleAirRaidEndTurn(ubTeam: UINT8): BOOLEAN {
  if (!gfInAirRaid) {
    return TRUE;
  }

  if (gfAirRaidHasHadTurn) {
    gfAirRaidHasHadTurn = FALSE;
    return TRUE;
  }

  giNumTurnsSinceLastDive++;
  giNumTurnsSinceDiveStarted++;
  giNumGridNosMovedThisTurn = 0;
  gubBeginTeamTurn = ubTeam;
  gfHaveTBBatton = TRUE;

  // ATE: Even if we have an attacker busy problem.. init to 0 now
  // gTacticalStatus.ubAttackBusyCount = 0;

  // Increment attacker bust count....
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack AIR RAID, attack count now %d", gTacticalStatus.ubAttackBusyCount));

  AddTopMessage(AIR_RAID_TURN_MESSAGE, TacticalStr[AIR_RAID_TURN_STR]);

  // OK, handle some sound effects, depending on the mode we are in...
  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    switch (gubAirRaidMode) {
      case AIR_RAID_BOMBING:

        // Start diving sound...
        PlayJA2Sample(S_RAID_TB_BOMB, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        break;

      case AIR_RAID_BEGIN_DIVE:

        PlayJA2Sample(S_RAID_TB_DIVE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        break;
    }
  }

  return FALSE;
}

function SaveAirRaidInfoToSaveGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32;
  let sAirRaidSaveStruct: AIR_RAID_SAVE_STRUCT;

  // Put all the globals into the save struct
  sAirRaidSaveStruct.fInAirRaid = gfInAirRaid;
  sAirRaidSaveStruct.fAirRaidScheduled = gfAirRaidScheduled;
  sAirRaidSaveStruct.ubAirRaidMode = gubAirRaidMode;
  sAirRaidSaveStruct.uiSoundSample = guiSoundSample;
  sAirRaidSaveStruct.uiRaidLastUpdate = guiRaidLastUpdate;
  sAirRaidSaveStruct.fFadingRaidIn = gfFadingRaidIn;
  sAirRaidSaveStruct.fQuoteSaid = gfQuoteSaid;
  sAirRaidSaveStruct.bNumDives = gbNumDives;
  sAirRaidSaveStruct.bMaxDives = gbMaxDives;
  sAirRaidSaveStruct.fFadingRaidOut = gfFadingRaidOut;
  sAirRaidSaveStruct.sDiveX = gsDiveX;
  sAirRaidSaveStruct.sDiveY = gsDiveY;
  sAirRaidSaveStruct.sDiveTargetLocation = gsDiveTargetLocation;
  sAirRaidSaveStruct.ubDiveDirection = gubDiveDirection;
  sAirRaidSaveStruct.sNumGridNosMoved = gsNumGridNosMoved;
  sAirRaidSaveStruct.iNumTurnsSinceLastDive = giNumTurnsSinceLastDive;
  sAirRaidSaveStruct.iNumTurnsSinceDiveStarted = giNumTurnsSinceDiveStarted;
  sAirRaidSaveStruct.iNumGridNosMovedThisTurn = giNumGridNosMovedThisTurn;
  sAirRaidSaveStruct.fAirRaidHasHadTurn = gfAirRaidHasHadTurn;
  sAirRaidSaveStruct.ubBeginTeamTurn = gubBeginTeamTurn;
  sAirRaidSaveStruct.fHaveTBBatton = gfHaveTBBatton;

  sAirRaidSaveStruct.sNotLocatedYet = gsNotLocatedYet;
  sAirRaidSaveStruct.iNumFrames = giNumFrames;

  if (gpRaidSoldier) {
    sAirRaidSaveStruct.bLevel = gpRaidSoldier->bLevel;
    sAirRaidSaveStruct.bTeam = gpRaidSoldier->bTeam;
    sAirRaidSaveStruct.bSide = gpRaidSoldier->bSide;
    sAirRaidSaveStruct.ubAttackerID = gpRaidSoldier->ubAttackerID;
    sAirRaidSaveStruct.usAttackingWeapon = gpRaidSoldier->usAttackingWeapon;
    sAirRaidSaveStruct.dXPos = gpRaidSoldier->dXPos;
    sAirRaidSaveStruct.dYPos = gpRaidSoldier->dYPos;
    sAirRaidSaveStruct.sX = gpRaidSoldier->sX;
    sAirRaidSaveStruct.sY = gpRaidSoldier->sY;
    sAirRaidSaveStruct.sGridNo = gpRaidSoldier->sGridNo;

    sAirRaidSaveStruct.sRaidSoldierID = MAX_NUM_SOLDIERS - 1;
    //		sAirRaidSaveStruct.sRaidSoldierID = gpRaidSoldier->ubID;
  } else
    sAirRaidSaveStruct.sRaidSoldierID = -1;

  memcpy(&sAirRaidSaveStruct.AirRaidDef, &gAirRaidDef, sizeof(AIR_RAID_DEFINITION));

  // Save the Air Raid Save Struct
  FileWrite(hFile, &sAirRaidSaveStruct, sizeof(AIR_RAID_SAVE_STRUCT), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(AIR_RAID_SAVE_STRUCT)) {
    return FALSE;
  }

  return TRUE;
}

function LoadAirRaidInfoFromSaveGameFile(hFile: HWFILE): BOOLEAN {
  let sAirRaidSaveStruct: AIR_RAID_SAVE_STRUCT;
  let uiNumBytesRead: UINT32;

  // Load the number of REAL_OBJECTs in the array
  FileRead(hFile, &sAirRaidSaveStruct, sizeof(AIR_RAID_SAVE_STRUCT), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(AIR_RAID_SAVE_STRUCT)) {
    return FALSE;
  }

  // Put all the globals into the save struct
  gfInAirRaid = sAirRaidSaveStruct.fInAirRaid;
  gfAirRaidScheduled = sAirRaidSaveStruct.fAirRaidScheduled;
  gubAirRaidMode = sAirRaidSaveStruct.ubAirRaidMode;
  guiSoundSample = sAirRaidSaveStruct.uiSoundSample;
  guiRaidLastUpdate = sAirRaidSaveStruct.uiRaidLastUpdate;
  gfFadingRaidIn = sAirRaidSaveStruct.fFadingRaidIn;
  gfQuoteSaid = sAirRaidSaveStruct.fQuoteSaid;
  gbNumDives = sAirRaidSaveStruct.bNumDives;
  gbMaxDives = sAirRaidSaveStruct.bMaxDives;
  gfFadingRaidOut = sAirRaidSaveStruct.fFadingRaidOut;
  gsDiveX = sAirRaidSaveStruct.sDiveX;
  gsDiveY = sAirRaidSaveStruct.sDiveY;
  gsDiveTargetLocation = sAirRaidSaveStruct.sDiveTargetLocation;
  gubDiveDirection = sAirRaidSaveStruct.ubDiveDirection;
  gsNumGridNosMoved = sAirRaidSaveStruct.sNumGridNosMoved;
  giNumTurnsSinceLastDive = sAirRaidSaveStruct.iNumTurnsSinceLastDive;
  giNumTurnsSinceDiveStarted = sAirRaidSaveStruct.iNumTurnsSinceDiveStarted;
  giNumGridNosMovedThisTurn = sAirRaidSaveStruct.iNumGridNosMovedThisTurn;
  gfAirRaidHasHadTurn = sAirRaidSaveStruct.fAirRaidHasHadTurn;
  gubBeginTeamTurn = sAirRaidSaveStruct.ubBeginTeamTurn;
  gfHaveTBBatton = sAirRaidSaveStruct.fHaveTBBatton;

  gsNotLocatedYet = sAirRaidSaveStruct.sNotLocatedYet;
  giNumFrames = sAirRaidSaveStruct.iNumFrames;

  if (sAirRaidSaveStruct.sRaidSoldierID != -1) {
    gpRaidSoldier = &Menptr[sAirRaidSaveStruct.sRaidSoldierID];

    gpRaidSoldier->bLevel = sAirRaidSaveStruct.bLevel;
    gpRaidSoldier->bTeam = sAirRaidSaveStruct.bTeam;
    gpRaidSoldier->bSide = sAirRaidSaveStruct.bSide;
    gpRaidSoldier->ubAttackerID = sAirRaidSaveStruct.ubAttackerID;
    gpRaidSoldier->usAttackingWeapon = sAirRaidSaveStruct.usAttackingWeapon;
    gpRaidSoldier->dXPos = sAirRaidSaveStruct.dXPos;
    gpRaidSoldier->dYPos = sAirRaidSaveStruct.dYPos;
    gpRaidSoldier->sX = sAirRaidSaveStruct.sX;
    gpRaidSoldier->sY = sAirRaidSaveStruct.sY;
    gpRaidSoldier->sGridNo = sAirRaidSaveStruct.sGridNo;
  } else
    gpRaidSoldier = NULL;

  memcpy(&gAirRaidDef, &sAirRaidSaveStruct.AirRaidDef, sizeof(AIR_RAID_DEFINITION));

  return TRUE;
}

function EndAirRaid(): void {
  gfInAirRaid = FALSE;

  // Stop sound
  SoundStop(guiSoundSample);

  // Change music back...
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    SetMusicMode(MUSIC_TACTICAL_NOTHING);

    if (!gTacticalStatus.Team[ENEMY_TEAM].bTeamActive && !gTacticalStatus.Team[CREATURE_TEAM].bTeamActive) {
      let pTeamSoldier: Pointer<SOLDIERTYPE>;
      let cnt: INT32;

      // Loop through all militia and restore them to peaceful status
      cnt = gTacticalStatus.Team[MILITIA_TEAM].bFirstID;
      for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; cnt++, pTeamSoldier++) {
        if (pTeamSoldier->bActive && pTeamSoldier->bInSector) {
          pTeamSoldier->bAlertStatus = STATUS_GREEN;
        }
      }
      gTacticalStatus.Team[MILITIA_TEAM].bAwareOfOpposition = FALSE;

      cnt = gTacticalStatus.Team[CIV_TEAM].bFirstID;
      // Loop through all civs and restore them to peaceful status
      for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[CIV_TEAM].bLastID; cnt++, pTeamSoldier++) {
        if (pTeamSoldier->bActive && pTeamSoldier->bInSector) {
          pTeamSoldier->bAlertStatus = STATUS_GREEN;
        }
      }
      gTacticalStatus.Team[CIV_TEAM].bAwareOfOpposition = FALSE;
    }
  }

  // OK, look at flags...
  if (gAirRaidDef.uiFlags & AIR_RAID_BEGINNING_GAME) {
    // OK, make enemy appear in Omerta
                                                       // Talk to strategic AI for this...
                                                       // GROUP *pGroup;
                                                       // Create a patrol group originating from sector B9
                                                       // pGroup = CreateNewEnemyGroupDepartingFromSector( SEC_B9, (UINT8)(2 + Random( 2 ) + gGameOptions.ubDifficultyLevel), 0 );
                                                       // Move the patrol group north to attack Omerta
                                                       // AddWaypointToPGroup( pGroup, 9, 1 ); //A9
                                                       // Because we want them to arrive right away, we will toast the arrival event.  The information
                                                       // is already set up though.
                                                       // DeleteStrategicEvent( EVENT_GROUP_ARRIVAL, pGroup->ubGroupID );
                                                       // Simply reinsert the event, but the time is now.
                                                       // AddStrategicEvent( EVENT_GROUP_ARRIVAL, GetWorldTotalMin(), pGroup->ubGroupID );
  }

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Ending Air Raid.");
}
