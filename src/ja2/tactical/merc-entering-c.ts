const MAX_MERC_IN_HELI = 20;
const MAX_HELI_SCRIPT = 30;
const ME_SCRIPT_DELAY = 100;
const NUM_PER_HELI_RUN = 6;

const enum Enum232 {
  HELI_APPROACH,
  HELI_MOVETO,
  HELI_BEGINDROP,
  HELI_DROP,
  HELI_ENDDROP,
  HELI_MOVEAWAY,
  HELI_EXIT,
  NUM_HELI_STATES,
}

const enum Enum233 {
  HELI_REST,
  HELI_MOVE_DOWN,
  HELI_MOVE_UP,
  HELI_MOVESMALL_DOWN,
  HELI_MOVESMALL_UP,
  HELI_MOVEY,
  HELI_MOVELARGERY,
  HELI_HANDLE_DROP,
  HELI_SHOW_HELI,

  HELI_GOTO_BEGINDROP,
  HELI_GOTO_DROP,
  HELI_GOTO_EXIT,
  HELI_GOTO_MOVETO,
  HELI_GOTO_MOVEAWAY,
  HELI_DONE,
}

let ubHeliScripts: UINT8[][] /* [NUM_HELI_STATES][MAX_HELI_SCRIPT] */ = [
  // HELI_APPROACH
  [
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_GOTO_MOVETO,
  ],

  // MOVE TO
  [
    HELI_SHOW_HELI,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,

    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,

    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,

    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,

    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,

    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_MOVEY,
    HELI_GOTO_BEGINDROP,
  ],

  // HELI_BEGIN_DROP
  [
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,

    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,

    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,

    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,

    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,

    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_MOVE_DOWN,
    HELI_GOTO_DROP,
  ],

  // Heli Begin Drop
  [
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,

    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,

    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,

    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,

    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,
    HELI_MOVESMALL_UP,

    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_MOVESMALL_DOWN,
    HELI_GOTO_DROP,
  ],

  // HELI END DROP
  [
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,

    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,

    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,

    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,

    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,

    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_MOVE_UP,
    HELI_GOTO_MOVEAWAY,
  ],

  // MOVE AWAY
  [
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,

    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,

    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,

    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,

    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,

    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_MOVELARGERY,
    HELI_GOTO_EXIT,
  ],

  // HELI EXIT
  [
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,

    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_REST,
    HELI_DONE,
  ],
];

let gfHandleHeli: BOOLEAN = FALSE;
let gusHeliSeats: UINT8[] /* [MAX_MERC_IN_HELI] */;
let gbNumHeliSeatsOccupied: INT8 = 0;

let gfFirstGuyDown: BOOLEAN = FALSE;

let uiSoundSample: UINT32;
let gsGridNoSweetSpot: INT16;
let gsHeliXPos: INT16;
let gsHeliYPos: INT16;
let gdHeliZPos: FLOAT;
let gsHeliScript: INT16;
let gubHeliState: UINT8;
let guiHeliLastUpdate: UINT32;
let gbCurDrop: INT8;
let gbExitCount: INT8;
let gbHeliRound: INT8;

let fFadingHeliIn: BOOLEAN = FALSE;
let fFadingHeliOut: BOOLEAN = FALSE;

let gfIngagedInDrop: BOOLEAN = FALSE;

let gpHeli: Pointer<ANITILE>;
let gfFirstHeliRun: BOOLEAN;

function ResetHeliSeats(): void {
  gbNumHeliSeatsOccupied = 0;
}

function AddMercToHeli(ubID: UINT8): void {
  let cnt: INT32;

  if (gbNumHeliSeatsOccupied < MAX_MERC_IN_HELI) {
    // Check if it already exists!
    for (cnt = 0; cnt < gbNumHeliSeatsOccupied; cnt++) {
      if (gusHeliSeats[cnt] == ubID) {
        return;
      }
    }

    gusHeliSeats[gbNumHeliSeatsOccupied] = ubID;
    gbNumHeliSeatsOccupied++;
  }
}

function StartHelicopterRun(sGridNoSweetSpot: INT16): void {
  let sX: INT16;
  let sY: INT16;

  gsGridNoSweetSpot = sGridNoSweetSpot;

  if (gbNumHeliSeatsOccupied == 0) {
    return;
  }

  InterruptTime();
  PauseGame();
  LockPauseState(20);

  ConvertGridNoToCenterCellXY(sGridNoSweetSpot, &sX, &sY);

  gsHeliXPos = sX - (2 * CELL_X_SIZE);
  gsHeliYPos = sY - (10 * CELL_Y_SIZE);
  // gsHeliXPos					= sX - ( 3 * CELL_X_SIZE );
  // gsHeliYPos					= sY + ( 4 * CELL_Y_SIZE );
  gdHeliZPos = 0;
  gsHeliScript = 0;
  gbCurDrop = 0;
  gbExitCount = 0;
  gbHeliRound = 1;

  gubHeliState = HELI_APPROACH;
  guiHeliLastUpdate = GetJA2Clock();

  // Start sound
  uiSoundSample = PlayJA2Sample(HELI_1, RATE_11025, 0, 10000, MIDDLEPAN);
  fFadingHeliIn = TRUE;

  gfHandleHeli = TRUE;

  gfFirstGuyDown = TRUE;

  guiPendingOverrideEvent = LU_BEGINUILOCK;
}

function HandleHeliDrop(): void {
  let ubScriptCode: UINT8;
  let uiClock: UINT32;
  // INT16 sWorldX, sWorldY;
  let iVol: INT32;
  let cnt: INT32;
  let AniParams: ANITILE_PARAMS;

  if (gfHandleHeli) {
    if (gCurrentUIMode != LOCKUI_MODE) {
      guiPendingOverrideEvent = LU_BEGINUILOCK;
    }

    if (_KeyDown(ESC)) {
      // Loop through all mercs not yet placed
      for (cnt = gbCurDrop; cnt < gbNumHeliSeatsOccupied; cnt++) {
        // Add merc to sector
        MercPtrs[gusHeliSeats[cnt]].value.ubStrategicInsertionCode = INSERTION_CODE_NORTH;
        UpdateMercInSector(MercPtrs[gusHeliSeats[cnt]], 9, 1, 0);

        // Check for merc arrives quotes...
        HandleMercArrivesQuotes(MercPtrs[gusHeliSeats[cnt]]);

        ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, TacticalStr[MERC_HAS_ARRIVED_STR], MercPtrs[gusHeliSeats[cnt]].value.name);
      }

      // Remove heli
      DeleteAniTile(gpHeli);

      RebuildCurrentSquad();

      // Remove sound
      if (uiSoundSample != NO_SAMPLE) {
        SoundStop(uiSoundSample);
      }

      gfHandleHeli = FALSE;
      gfIgnoreScrolling = FALSE;
      gbNumHeliSeatsOccupied = 0;
      UnLockPauseState();
      UnPauseGame();

      // Select our first guy
      SelectSoldier(gusHeliSeats[0], FALSE, TRUE);

      // guiCurrentEvent = LU_ENDUILOCK;
      // gCurrentUIMode  = LOCKUI_MODE;
      guiPendingOverrideEvent = LU_ENDUILOCK;
      // UIHandleLUIEndLock( NULL );

      HandleFirstHeliDropOfGame();
      return;
    }

    gfIgnoreScrolling = TRUE;

    uiClock = GetJA2Clock();

    if ((uiClock - guiHeliLastUpdate) > ME_SCRIPT_DELAY) {
      guiHeliLastUpdate = uiClock;

      if (fFadingHeliIn) {
        if (uiSoundSample != NO_SAMPLE) {
          iVol = SoundGetVolume(uiSoundSample);
          iVol = __min(HIGHVOLUME, iVol + 5);
          SoundSetVolume(uiSoundSample, iVol);
          if (iVol == HIGHVOLUME)
            fFadingHeliIn = FALSE;
        } else {
          fFadingHeliIn = FALSE;
        }
      } else if (fFadingHeliOut) {
        if (uiSoundSample != NO_SAMPLE) {
          iVol = SoundGetVolume(uiSoundSample);

          iVol = __max(0, iVol - 5);

          SoundSetVolume(uiSoundSample, iVol);
          if (iVol == 0) {
            // Stop sound
            SoundStop(uiSoundSample);
            fFadingHeliOut = FALSE;
            gfHandleHeli = FALSE;
            gfIgnoreScrolling = FALSE;
            gbNumHeliSeatsOccupied = 0;
            guiPendingOverrideEvent = LU_ENDUILOCK;
            UnLockPauseState();
            UnPauseGame();

            RebuildCurrentSquad();

            HandleFirstHeliDropOfGame();
          }
        } else {
          fFadingHeliOut = FALSE;
          gfHandleHeli = FALSE;
          gfIgnoreScrolling = FALSE;
          gbNumHeliSeatsOccupied = 0;
          guiPendingOverrideEvent = LU_ENDUILOCK;
          UnLockPauseState();
          UnPauseGame();

          RebuildCurrentSquad();

          HandleFirstHeliDropOfGame();
        }
      }

      if (gsHeliScript == MAX_HELI_SCRIPT) {
        return;
      }

      ubScriptCode = ubHeliScripts[gubHeliState][gsHeliScript];

      // Switch on mode...
      if (gubHeliState == HELI_DROP) {
        if (!gfIngagedInDrop) {
          let bEndVal: INT8;

          bEndVal = (gbHeliRound * NUM_PER_HELI_RUN);

          if (bEndVal > gbNumHeliSeatsOccupied) {
            bEndVal = gbNumHeliSeatsOccupied;
          }

          // OK, Check if we have anybody left to send!
          if (gbCurDrop < bEndVal) {
            // sWorldX = CenterX( gsGridNoSweetSpot );
            // sWorldY = CenterY( gsGridNoSweetSpot );
            EVENT_InitNewSoldierAnim(MercPtrs[gusHeliSeats[gbCurDrop]], HELIDROP, 0, FALSE);

            // Change insertion code
            MercPtrs[gusHeliSeats[gbCurDrop]].value.ubStrategicInsertionCode = INSERTION_CODE_NORTH;

            UpdateMercInSector(MercPtrs[gusHeliSeats[gbCurDrop]], 9, 1, 0);
            // EVENT_SetSoldierPosition( MercPtrs[ gusHeliSeats[ gbCurDrop ] ], sWorldX, sWorldY );

            // IF the first guy down, set squad!
            if (gfFirstGuyDown) {
              gfFirstGuyDown = FALSE;
              SetCurrentSquad(MercPtrs[gusHeliSeats[gbCurDrop]].value.bAssignment, TRUE);
            }
            ScreenMsg(FONT_MCOLOR_WHITE, MSG_INTERFACE, TacticalStr[MERC_HAS_ARRIVED_STR], MercPtrs[gusHeliSeats[gbCurDrop]].value.name);

            gbCurDrop++;

            gfIngagedInDrop = TRUE;
          } else {
            if (gbExitCount == 0) {
              gbExitCount = 2;
            } else {
              gbExitCount--;

              if (gbExitCount == 1) {
                // Goto leave
                gsHeliScript = -1;
                gubHeliState = HELI_ENDDROP;
              }
            }
          }
        }
      }

      switch (ubScriptCode) {
        case HELI_REST:

          break;

        case HELI_MOVE_DOWN:

          gdHeliZPos -= 1;
          gpHeli.value.pLevelNode.value.sRelativeZ = gdHeliZPos;
          break;

        case HELI_MOVE_UP:

          gdHeliZPos += 1;
          gpHeli.value.pLevelNode.value.sRelativeZ = gdHeliZPos;
          break;

        case HELI_MOVESMALL_DOWN:

          gdHeliZPos -= 0.25;
          gpHeli.value.pLevelNode.value.sRelativeZ = gdHeliZPos;
          break;

        case HELI_MOVESMALL_UP:

          gdHeliZPos += 0.25;
          gpHeli.value.pLevelNode.value.sRelativeZ = gdHeliZPos;
          break;

        case HELI_MOVEY:

          gpHeli.value.sRelativeY += 4;
          break;

        case HELI_MOVELARGERY:

          gpHeli.value.sRelativeY += 6;
          break;

        case HELI_GOTO_BEGINDROP:

          gsHeliScript = -1;
          gubHeliState = HELI_BEGINDROP;
          break;

        case HELI_SHOW_HELI:

          // Start animation
          memset(&AniParams, 0, sizeof(ANITILE_PARAMS));
          AniParams.sGridNo = gsGridNoSweetSpot;
          AniParams.ubLevelID = ANI_SHADOW_LEVEL;
          AniParams.sDelay = 90;
          AniParams.sStartFrame = 0;
          AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_LOOPING;
          AniParams.sX = gsHeliXPos;
          AniParams.sY = gsHeliYPos;
          AniParams.sZ = gdHeliZPos;
          strcpy(AniParams.zCachedFile, "TILECACHE\\HELI_SH.STI");

          gpHeli = CreateAnimationTile(&AniParams);
          break;

        case HELI_GOTO_DROP:

          // Goto drop animation
          gdHeliZPos -= 0.25;
          gpHeli.value.pLevelNode.value.sRelativeZ = gdHeliZPos;
          gsHeliScript = -1;
          gubHeliState = HELI_DROP;
          break;

        case HELI_GOTO_MOVETO:

          // Goto drop animation
          gsHeliScript = -1;
          gubHeliState = HELI_MOVETO;
          break;

        case HELI_GOTO_MOVEAWAY:

          // Goto drop animation
          gsHeliScript = -1;
          gubHeliState = HELI_MOVEAWAY;
          break;

        case HELI_GOTO_EXIT:

          if (gbCurDrop < gbNumHeliSeatsOccupied) {
            // Start another run......
            let sX: INT16;
            let sY: INT16;

            ConvertGridNoToCenterCellXY(gsGridNoSweetSpot, &sX, &sY);

            gsHeliXPos = sX - (2 * CELL_X_SIZE);
            gsHeliYPos = sY - (10 * CELL_Y_SIZE);
            gdHeliZPos = 0;
            gsHeliScript = 0;
            gbExitCount = 0;
            gubHeliState = HELI_APPROACH;
            gbHeliRound++;

            // Ahh, but still delete the heli!
            DeleteAniTile(gpHeli);
            gpHeli = NULL;
          } else {
            // Goto drop animation
            gsHeliScript = -1;
            gubHeliState = HELI_EXIT;

            // Delete helicopter image!
            DeleteAniTile(gpHeli);
            gpHeli = NULL;
            gfIgnoreScrolling = FALSE;

            // Select our first guy
            SelectSoldier(gusHeliSeats[0], FALSE, TRUE);
          }
          break;

        case HELI_DONE:

          // End
          fFadingHeliOut = TRUE;
          break;
      }

      gsHeliScript++;
    }
  }
}

function BeginMercEntering(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16): void {
  ResetHeliSeats();

  AddMercToHeli(pSoldier.value.ubID);

  StartHelicopterRun(sGridNo);

  // Make sure AI does nothing.....
  PauseAIUntilManuallyUnpaused();
}

function HandleFirstHeliDropOfGame(): void {
  // Are we in the first heli drop?
  if (gfFirstHeliRun) {
    SyncStrategicTurnTimes();

    // Call people to area
    CallAvailableEnemiesTo(gsGridNoSweetSpot);

    // Say quote.....
    SayQuoteFromAnyBodyInSector(QUOTE_ENEMY_PRESENCE);

    // Start music
    SetMusicMode(MUSIC_TACTICAL_ENEMYPRESENT);

    gfFirstHeliRun = FALSE;
  }

  // Send message to turn on ai again....
  CharacterDialogueWithSpecialEvent(0, 0, 0, DIALOGUE_TACTICAL_UI, FALSE, FALSE, DIALOGUE_SPECIAL_EVENT_ENABLE_AI, 0, 0);
}
