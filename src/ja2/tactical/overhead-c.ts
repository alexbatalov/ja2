namespace ja2 {

const RT_DELAY_BETWEEN_AI_HANDLING = 50;
const RT_AI_TIMESLICE = 10;

export let giRTAILastUpdateTime: INT32 = 0;
let guiAISlotToHandle: UINT32 = 0;
const HANDLE_OFF_MAP_MERC = 0xFFFF;
const RESET_HANDLE_OF_OFF_MAP_MERCS = 0xFFFF;
let guiAIAwaySlotToHandle: UINT32 = RESET_HANDLE_OF_OFF_MAP_MERCS;

const PAUSE_ALL_AI_DELAY = 1500;

let gfPauseAllAI: boolean = false;
let giPauseAllAITimer: INT32 = 0;

// GLOBALS
const START_DEMO_SCENE = 3;
const NUM_RANDOM_SCENES = 4;

export let gDebugStr: string /* INT8[128] */;

const NEW_FADE_DELAY = 60;

// ATE: GLOBALS FOR E3
export let gubCurrentScene: UINT8 = 0;
let gzLevelFilenames: string[] /* CHAR8[][50] */ = [
  "A9.dat",
  "ScotTBMines.dat",
  "LindaTBCaves.dat",
  "LindaRTDesert.dat",
  "IanRTNight.dat",
  "LindaRTCave1.dat",
  "LindaRTCave2.dat",
];

let ubLevelMoveLink: INT8[] /* [10] */ = [
  1,
  2,
  3,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
];

// Soldier List used for all soldier overhead interaction
export let Menptr: SOLDIERTYPE[] /* [TOTAL_SOLDIERS] */;
export let MercPtrs: Pointer<SOLDIERTYPE>[] /* [TOTAL_SOLDIERS] */;

export let MercSlots: Pointer<SOLDIERTYPE>[] /* [TOTAL_SOLDIERS] */;
export let guiNumMercSlots: UINT32 = 0;

let AwaySlots: Pointer<SOLDIERTYPE>[] /* [TOTAL_SOLDIERS] */;
let guiNumAwaySlots: UINT32 = 0;

// DEF: changed to have client wait for gPlayerNum assigned from host
export let gbPlayerNum: UINT8 = 0;

// Global for current selected soldier
export let gusSelectedSoldier: UINT16 = NO_SOLDIER;
export let gbShowEnemies: INT8 = false;

let gfMovingAnimation: boolean = false;

export let gzAlertStr: string[] /* CHAR8[][30] */ = [
  "GREEN",
  "YELLOW",
  "RED",
  "BLACK",
];

export let gzActionStr: string[] /* CHAR8[][30] */ = [
  "NONE",

  "RANDOM PATROL",
  "SEEK FRIEND",
  "SEEK OPPONENT",
  "TAKE COVER",
  "GET CLOSER",

  "POINT PATROL",
  "LEAVE WATER GAS",
  "SEEK NOISE",
  "ESCORTED MOVE",
  "RUN AWAY",

  "KNIFE MOVE",
  "APPROACH MERC",
  "TRACK",
  "EAT",
  "PICK UP ITEM",

  "SCHEDULE MOVE",
  "WALK",
  "RUN",
  "MOVE TO CLIMB",
  "CHG FACING",

  "CHG STANCE",
  "YELLOW ALERT",
  "RED ALERT",
  "CREATURE CALL",
  "PULL TRIGGER",

  "USE DETONATOR",
  "FIRE GUN",
  "TOSS PROJECTILE",
  "KNIFE STAB",
  "THROW KNIFE",

  "GIVE AID",
  "WAIT",
  "PENDING ACTION",
  "DROP ITEM",
  "COWER",

  "STOP COWERING",
  "OPEN/CLOSE DOOR",
  "UNLOCK DOOR",
  "LOCK DOOR",
  "LOWER GUN",

  "ABSOLUTELY NONE",
  "CLIMB ROOF",
  "END TURN",
  "EC&M",
  "TRAVERSE DOWN",
  "OFFER SURRENDER",
];

export let gzDirectionStr: string[] /* CHAR8[][30] */ = [
  "NORTHEAST",
  "EAST",
  "SOUTHEAST",
  "SOUTH",
  "SOUTHWEST",
  "WEST",
  "NORTHWEST",
  "NORTH",
];

// TEMP VALUES FOR TEAM DEAFULT POSITIONS
let bDefaultTeamRanges: UINT8[][] /* [MAXTEAMS][2] */ = [
  0,
  19, // 20  US
  20,
  51, // 32  ENEMY
  52,
  83, // 32    CREATURE
  84,
  115, // 32    REBELS ( OUR GUYS )
  116,
  MAX_NUM_SOLDIERS - 1, // 32  CIVILIANS
  MAX_NUM_SOLDIERS,
  TOTAL_SOLDIERS - 1, // PLANNING SOLDIERS
];

let bDefaultTeamColors: COLORVAL[] /* [MAXTEAMS] */ = [
  FROMRGB(255, 255, 0),
  FROMRGB(255, 0, 0),
  FROMRGB(255, 0, 255),
  FROMRGB(0, 255, 0),
  FROMRGB(255, 255, 255),
  FROMRGB(0, 0, 255),
];

export let gubWaitingForAllMercsToExitCode: UINT8 = 0;
let gbNumMercsUntilWaitingOver: INT8 = 0;
let guiWaitingForAllMercsToExitData: UINT32[] /* [3] */;
let guiWaitingForAllMercsToExitTimer: UINT32 = 0;
export let gfKillingGuysForLosingBattle: boolean = false;

function GetFreeMercSlot(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumMercSlots; uiCount++) {
    if ((MercSlots[uiCount] == null))
      return uiCount;
  }

  if (guiNumMercSlots < TOTAL_SOLDIERS)
    return guiNumMercSlots++;

  return -1;
}

function RecountMercSlots(): void {
  let iCount: INT32;

  if (guiNumMercSlots > 0) {
    // set equal to 0 as a default
    for (iCount = guiNumMercSlots - 1; (iCount >= 0); iCount--) {
      if ((MercSlots[iCount] != null)) {
        guiNumMercSlots = (iCount + 1);
        return;
      }
    }
    // no mercs found
    guiNumMercSlots = 0;
  }
}

export function AddMercSlot(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let iMercIndex: INT32;

  if ((iMercIndex = GetFreeMercSlot()) == (-1))
    return -1;

  MercSlots[iMercIndex] = pSoldier;

  return iMercIndex;
}

export function RemoveMercSlot(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  let uiCount: UINT32;

  if (pSoldier == null) {
    return false;
  }

  for (uiCount = 0; uiCount < guiNumMercSlots; uiCount++) {
    if (MercSlots[uiCount] == pSoldier) {
      MercSlots[uiCount] = null;
      RecountMercSlots();
      return true;
    }
  }

  // TOLD TO DELETE NON-EXISTANT SOLDIER
  return false;
}

function GetFreeAwaySlot(): INT32 {
  let uiCount: UINT32;

  for (uiCount = 0; uiCount < guiNumAwaySlots; uiCount++) {
    if ((AwaySlots[uiCount] == null))
      return uiCount;
  }

  if (guiNumAwaySlots < TOTAL_SOLDIERS)
    return guiNumAwaySlots++;

  return -1;
}

function RecountAwaySlots(): void {
  let iCount: INT32;

  if (guiNumAwaySlots > 0) {
    for (iCount = guiNumAwaySlots - 1; (iCount >= 0); iCount--) {
      if ((AwaySlots[iCount] != null)) {
        guiNumAwaySlots = (iCount + 1);
        return;
      }
    }
    // no mercs found
    guiNumAwaySlots = 0;
  }
}

export function AddAwaySlot(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let iAwayIndex: INT32;

  if ((iAwayIndex = GetFreeAwaySlot()) == (-1))
    return -1;

  AwaySlots[iAwayIndex] = pSoldier;

  return iAwayIndex;
}

export function RemoveAwaySlot(pSoldier: Pointer<SOLDIERTYPE>): boolean {
  let uiCount: UINT32;

  if (pSoldier == null) {
    return false;
  }

  for (uiCount = 0; uiCount < guiNumAwaySlots; uiCount++) {
    if (AwaySlots[uiCount] == pSoldier) {
      AwaySlots[uiCount] = null;
      RecountAwaySlots();
      return true;
    }
  }

  // TOLD TO DELETE NON-EXISTANT SOLDIER
  return false;
}

export function MoveSoldierFromMercToAwaySlot(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let fRet: boolean;

  fRet = RemoveMercSlot(pSoldier);
  if (!fRet) {
    return -1;
  }

  if (!(pSoldier.value.uiStatusFlags & SOLDIER_OFF_MAP)) {
    RemoveManFromTeam(pSoldier.value.bTeam);
  }

  pSoldier.value.bInSector = false;
  pSoldier.value.uiStatusFlags |= SOLDIER_OFF_MAP;
  return AddAwaySlot(pSoldier);
}

export function MoveSoldierFromAwayToMercSlot(pSoldier: Pointer<SOLDIERTYPE>): INT32 {
  let fRet: boolean;

  fRet = RemoveAwaySlot(pSoldier);
  if (!fRet) {
    return -1;
  }

  AddManToTeam(pSoldier.value.bTeam);

  pSoldier.value.bInSector = true;
  pSoldier.value.uiStatusFlags &= (~SOLDIER_OFF_MAP);
  return AddMercSlot(pSoldier);
}

export function InitTacticalEngine(): boolean {
  // Init renderer
  InitRenderParams(0);

  // Init dirty queue system
  InitializeBaseDirtyRectQueue();

  // Init Interface stuff
  InitializeTacticalInterface();

  // Init system objects
  InitializeGameVideoObjects();

  // Init palette system
  LoadPaletteData();

  if (!LoadLockTable())
    return false;

  InitInteractiveTileManagement();

  // init path code
  if (!InitPathAI()) {
    return false;
  }

  // init AI
  if (!InitAI()) {
    return false;
  }

  // Init Overhead
  if (!InitOverhead()) {
    return false;
  }

  return true;
}

export function ShutdownTacticalEngine(): void {
  DeletePaletteData();

  ShutdownStaticExternalNPCFaces();

  ShutDownPathAI();
  ShutdownInteractiveTileManagement();
  UnLoadCarPortraits();

  ShutdownNPCQuotes();
}

export function InitOverhead(): boolean {
  let cnt: UINT32;
  let cnt2: UINT8;

  memset(MercSlots, 0, sizeof(MercSlots));
  memset(AwaySlots, 0, sizeof(AwaySlots));

  // Set pointers list
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    MercPtrs[cnt] = addressof(Menptr[cnt]);
    MercPtrs[cnt].value.bActive = false;
  }

  memset(addressof(gTacticalStatus), 0, sizeof(TacticalStatusType));

  // Set team values
  for (cnt = 0; cnt < MAXTEAMS; cnt++) {
    // For now, set hard-coded values
    gTacticalStatus.Team[cnt].bFirstID = bDefaultTeamRanges[cnt][0];
    gTacticalStatus.Team[cnt].bLastID = bDefaultTeamRanges[cnt][1];
    gTacticalStatus.Team[cnt].RadarColor = bDefaultTeamColors[cnt];

    if (cnt == gbPlayerNum || cnt == PLAYER_PLAN) {
      gTacticalStatus.Team[cnt].bSide = 0;
      gTacticalStatus.Team[cnt].bHuman = true;
    } else {
      if (cnt == MILITIA_TEAM) {
        // militia guys on our side!
        gTacticalStatus.Team[cnt].bSide = 0;
      } else if (cnt == CREATURE_TEAM) {
        // creatures are on no one's side but their own
        // NB side 2 is used for hostile rebels....
        gTacticalStatus.Team[cnt].bSide = 3;
      } else {
        // hostile (enemies, or civilians; civs are potentially hostile but neutral)
        gTacticalStatus.Team[cnt].bSide = 1;
      }
      gTacticalStatus.Team[cnt].bHuman = false;
    }

    gTacticalStatus.Team[cnt].ubLastMercToRadio = NOBODY;
    gTacticalStatus.Team[cnt].bTeamActive = false;
    gTacticalStatus.Team[cnt].bAwareOfOpposition = false;

    // set team values in soldier structures for all who are on this team
    for (cnt2 = gTacticalStatus.Team[cnt].bFirstID; cnt2 <= gTacticalStatus.Team[cnt].bLastID; cnt2++) {
      MercPtrs[cnt2].value.bTeam = cnt;
    }
  }

  // Zero out merc slots!
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    MercSlots[cnt] = null;
  }

  // Set other tactical flags
  gTacticalStatus.uiFlags = TURNBASED | TRANSLUCENCY_TYPE;
  gTacticalStatus.sSlideTarget = NOWHERE;
  gTacticalStatus.uiTimeOfLastInput = GetJA2Clock();
  gTacticalStatus.uiTimeSinceDemoOn = GetJA2Clock();
  gTacticalStatus.uiCountdownToRestart = GetJA2Clock();
  gTacticalStatus.fGoingToEnterDemo = false;
  gTacticalStatus.fNOTDOLASTDEMO = false;
  gTacticalStatus.fDidGameJustStart = true;
  gTacticalStatus.ubLastRequesterTargetID = NO_PROFILE;

  for (cnt = 0; cnt < NUM_PANIC_TRIGGERS; cnt++) {
    gTacticalStatus.sPanicTriggerGridNo[cnt] = NOWHERE;
  }
  /*	for ( cnt = 0; cnt < NUM_TOPTIONS; cnt++ )
          {
                  gGameSettings.fOptions[ cnt ] = 1;
          }

          gGameSettings.fOptions[ TOPTION_RTCONFIRM ] = 0;
          gGameSettings.fOptions[ TOPTION_HIDE_BULLETS ] = 0;
  */
  gTacticalStatus.bRealtimeSpeed = MAX_REALTIME_SPEED_VAL / 2;

  gfInAirRaid = false;
  gpCustomizableTimerCallback = null;

  // Reset cursor
  gpItemPointer = null;
  gpItemPointerSoldier = null;
  memset(gbInvalidPlacementSlot, 0, sizeof(gbInvalidPlacementSlot));

  InitCivQuoteSystem();

  ZeroAnimSurfaceCounts();

  return true;
}

export function ShutdownOverhead(): boolean {
  let cnt: UINT32;

  // Delete any soldiers which have been created!
  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    if (MercPtrs[cnt] != null) {
      if (MercPtrs[cnt].value.bActive) {
        DeleteSoldier(MercPtrs[cnt]);
      }
    }
  }

  return true;
}

export function GetSoldier(ppSoldier: Pointer<Pointer<SOLDIERTYPE>>, usSoldierIndex: UINT16): boolean {
  // Check range of index given
  ppSoldier.value = null;

  if (usSoldierIndex < 0 || usSoldierIndex > TOTAL_SOLDIERS - 1) {
    // Set debug message
    return false;
  }

  // Check if a guy exists here
  // Does another soldier exist here?
  if (MercPtrs[usSoldierIndex].value.bActive) {
    // Set Existing guy
    ppSoldier.value = MercPtrs[usSoldierIndex];
    return true;
  } else {
    return false;
  }
}

function NextAIToHandle(uiCurrAISlot: UINT32): boolean {
  let cnt: UINT32;

  if (uiCurrAISlot >= guiNumMercSlots) {
    // last person to handle was an off-map merc, so now we start looping at the beginning
    // again
    cnt = 0;
  } else {
    // continue on from the last person we handled
    cnt = uiCurrAISlot + 1;
  }

  for (; cnt < guiNumMercSlots; cnt++) {
    if (MercSlots[cnt] && ((MercSlots[cnt].value.bTeam != gbPlayerNum) || (MercSlots[cnt].value.uiStatusFlags & SOLDIER_PCUNDERAICONTROL))) {
      // aha! found an AI guy!
      guiAISlotToHandle = cnt;
      return true;
    }
  }

  // set so that even if there are no off-screen mercs to handle, we will loop back to
  // the start of the array
  guiAISlotToHandle = HANDLE_OFF_MAP_MERC;

  // didn't find an AI guy to handle after the last one handled and the # of slots
  // it's time to check for an off-map merc... maybe
  if (guiNumAwaySlots > 0) {
    if ((guiAIAwaySlotToHandle + 1) >= guiNumAwaySlots) {
      // start looping from the beginning
      cnt = 0;
    } else {
      // continue on from the last person we handled
      cnt = guiAIAwaySlotToHandle + 1;
    }

    for (; cnt < guiNumAwaySlots; cnt++) {
      if (AwaySlots[cnt] && AwaySlots[cnt].value.bTeam != gbPlayerNum) {
        // aha! found an AI guy!
        guiAIAwaySlotToHandle = cnt;
        return false;
      }
    }

    // reset awayAISlotToHandle, but DON'T loop again, away slots not that important
    guiAIAwaySlotToHandle = RESET_HANDLE_OF_OFF_MAP_MERCS;
  }

  return false;
}

export function PauseAITemporarily(): void {
  gfPauseAllAI = true;
  giPauseAllAITimer = GetJA2Clock();
}

export function PauseAIUntilManuallyUnpaused(): void {
  gfPauseAllAI = true;
  giPauseAllAITimer = 0;
}

export function UnPauseAI(): void {
  // overrides any timer too
  gfPauseAllAI = false;
  giPauseAllAITimer = 0;
}

let gdRadiansForAngle: FLOAT[] /* [] */ = [
  Math.PI,
  (3 * Math.PI / 4),
  (Math.PI / 2),
  ((Math.PI) / 4),

  0,
  ((-Math.PI) / 4),
  (-Math.PI / 2),
  (-3 * Math.PI / 4),
];

export function ExecuteOverhead(): boolean {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sAPCost: INT16;
  let sBPCost: INT16;
  let dXPos: FLOAT;
  let dYPos: FLOAT;
  let dAngle: FLOAT;
  let fKeepMoving: boolean;
  let bShadeLevel: INT8;
  let fNoAPsForPendingAction: boolean;
  let sGridNo: INT16;
  let pStructure: Pointer<STRUCTURE>;
  let fHandleAI: boolean = false;

  // Diagnostic Stuff
  /* static */ let iTimerTest: INT32 = 0;
  /* static */ let iTimerVal: INT32 = 0;

  gfMovingAnimation = false;

  if (GetSoldier(addressof(pSoldier), gusSelectedSoldier)) {
    if (pSoldier.value.bActive) {
      if (pSoldier.value.uiStatusFlags & SOLDIER_GREEN_RAY)
        LightShowRays((pSoldier.value.dXPos / CELL_X_SIZE), (pSoldier.value.dYPos / CELL_Y_SIZE), false);
    }
  }

  if (COUNTERDONE(Enum386.TOVERHEAD)) {
    // Reset counter
    RESETCOUNTER(Enum386.TOVERHEAD);

    // Diagnostic Stuff
    iTimerVal = GetJA2Clock();
    giTimerDiag = iTimerVal - iTimerTest;
    iTimerTest = iTimerVal;

    // ANIMATED TILE STUFF
    UpdateAniTiles();

    // BOMBS!!!
    HandleExplosionQueue();

    HandleCreatureTenseQuote();

    CheckHostileOrSayQuoteList();

    if (gfPauseAllAI && giPauseAllAITimer && (iTimerVal - giPauseAllAITimer > PAUSE_ALL_AI_DELAY)) {
      // ok, stop pausing the AI!
      gfPauseAllAI = false;
    }

    if (!gfPauseAllAI) {
      // AI limiting crap
      gubAICounter = 0;
      if (!((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT))) {
        if ((iTimerVal - giRTAILastUpdateTime) > RT_DELAY_BETWEEN_AI_HANDLING) {
          giRTAILastUpdateTime = iTimerVal;
          // figure out which AI guy to handle this time around,
          // starting with the slot AFTER the current AI guy
          fHandleAI = NextAIToHandle(guiAISlotToHandle);
        }
      }
    }

    for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
      pSoldier = MercSlots[cnt];

      // Syncronize for upcoming soldier counters
      SYNCTIMECOUNTER();

      if (pSoldier != null) {
        HandlePanelFaceAnimations(pSoldier);

        // Handle damage counters
        if (pSoldier.value.fDisplayDamage) {
          if (TIMECOUNTERDONE(pSoldier.value.DamageCounter, DAMAGE_DISPLAY_DELAY)) {
            pSoldier.value.bDisplayDamageCount++;
            pSoldier.value.sDamageX += 1;
            pSoldier.value.sDamageY -= 1;

            RESETTIMECOUNTER(pSoldier.value.DamageCounter, DAMAGE_DISPLAY_DELAY);
          }

          if (pSoldier.value.bDisplayDamageCount >= 8) {
            pSoldier.value.bDisplayDamageCount = 0;
            pSoldier.value.sDamage = 0;
            pSoldier.value.fDisplayDamage = false;
          }
        }

        // Handle reload counters
        if (pSoldier.value.fReloading) {
          if (TIMECOUNTERDONE(pSoldier.value.ReloadCounter, pSoldier.value.sReloadDelay)) {
            pSoldier.value.fReloading = false;
            pSoldier.value.fPauseAim = false;
            /*
            DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("@@@@@@@ Freeing up attacker - realtime reloading") );
            FreeUpAttacker( pSoldier->ubID );
            */
          }
        }

        // Checkout fading
        if (pSoldier.value.fBeginFade) {
          if (TIMECOUNTERDONE(pSoldier.value.FadeCounter, NEW_FADE_DELAY)) {
            RESETTIMECOUNTER(pSoldier.value.FadeCounter, NEW_FADE_DELAY);

            // Fade out....
            if (pSoldier.value.fBeginFade == 1) {
              bShadeLevel = (pSoldier.value.ubFadeLevel & 0x0f);
              bShadeLevel = Math.min(bShadeLevel + 1, SHADE_MIN);

              if (bShadeLevel >= (SHADE_MIN - 3)) {
                pSoldier.value.fBeginFade = false;
                pSoldier.value.bVisible = -1;

                // Set levelnode shade level....
                if (pSoldier.value.pLevelNode) {
                  pSoldier.value.pLevelNode.value.ubShadeLevel = bShadeLevel;
                }

                // Set Anim speed accordingly!
                SetSoldierAniSpeed(pSoldier);
              }

              bShadeLevel |= (pSoldier.value.ubFadeLevel & 0x30);
              pSoldier.value.ubFadeLevel = bShadeLevel;
            } else if (pSoldier.value.fBeginFade == 2) {
              bShadeLevel = (pSoldier.value.ubFadeLevel & 0x0f);
              // ubShadeLevel =__max(ubShadeLevel-1, gpWorldLevelData[ pSoldier->sGridNo ].pLandHead->ubShadeLevel );

              bShadeLevel = bShadeLevel - 1;

              if (bShadeLevel <= 0) {
                bShadeLevel = 0;
              }

              if (bShadeLevel <= (gpWorldLevelData[pSoldier.value.sGridNo].pLandHead.value.ubShadeLevel)) {
                bShadeLevel = (gpWorldLevelData[pSoldier.value.sGridNo].pLandHead.value.ubShadeLevel);

                pSoldier.value.fBeginFade = false;
                // pSoldier->bVisible = -1;
                // pSoldier->ubFadeLevel = gpWorldLevelData[ pSoldier->sGridNo ].pLandHead->ubShadeLevel;

                // Set levelnode shade level....
                if (pSoldier.value.pLevelNode) {
                  pSoldier.value.pLevelNode.value.ubShadeLevel = bShadeLevel;
                }

                // Set Anim speed accordingly!
                SetSoldierAniSpeed(pSoldier);
              }

              bShadeLevel |= (pSoldier.value.ubFadeLevel & 0x30);
              pSoldier.value.ubFadeLevel = bShadeLevel;
            }
          }
        }

        // Check if we have a new visiblity and shade accordingly down
        if (pSoldier.value.bLastRenderVisibleValue != pSoldier.value.bVisible) {
          HandleCrowShadowVisibility(pSoldier);

          // Check for fade out....
          if (pSoldier.value.bVisible == -1 && pSoldier.value.bLastRenderVisibleValue >= 0) {
            if (pSoldier.value.sGridNo != NOWHERE) {
              pSoldier.value.ubFadeLevel = gpWorldLevelData[pSoldier.value.sGridNo].pLandHead.value.ubShadeLevel;
            } else {
              let i: number = 0;
            }
            pSoldier.value.fBeginFade = true;
            pSoldier.value.sLocationOfFadeStart = pSoldier.value.sGridNo;

            // OK, re-evaluate guy's roof marker
            HandlePlacingRoofMarker(pSoldier, pSoldier.value.sGridNo, false, false);

            pSoldier.value.bVisible = -2;
          }

          // Check for fade in.....
          if (pSoldier.value.bVisible != -1 && pSoldier.value.bLastRenderVisibleValue == -1 && pSoldier.value.bTeam != gbPlayerNum) {
            pSoldier.value.ubFadeLevel = (SHADE_MIN - 3);
            pSoldier.value.fBeginFade = 2;
            pSoldier.value.sLocationOfFadeStart = pSoldier.value.sGridNo;

            // OK, re-evaluate guy's roof marker
            HandlePlacingRoofMarker(pSoldier, pSoldier.value.sGridNo, true, false);
          }
        }
        pSoldier.value.bLastRenderVisibleValue = pSoldier.value.bVisible;

        // Handle stationary polling...
        if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_STATIONARY) || pSoldier.value.fNoAPToFinishMove) {
          // Are are stationary....
          // Were we once moving...?
          if (pSoldier.value.fSoldierWasMoving && pSoldier.value.bVisible > -1) {
            pSoldier.value.fSoldierWasMoving = false;

            HandlePlacingRoofMarker(pSoldier, pSoldier.value.sGridNo, true, false);

            if (!gGameSettings.fOptions[Enum8.TOPTION_MERC_ALWAYS_LIGHT_UP]) {
              DeleteSoldierLight(pSoldier);

              SetCheckSoldierLightFlag(pSoldier);
            }
          }
        } else {
          // We are moving....
          // Were we once stationary?
          if (!pSoldier.value.fSoldierWasMoving) {
            pSoldier.value.fSoldierWasMoving = true;

            HandlePlacingRoofMarker(pSoldier, pSoldier.value.sGridNo, false, false);
          }
        }

        // Handle animation update counters
        // ATE: Added additional check here for special value of anispeed that pauses all updates
        if (TIMECOUNTERDONE(pSoldier.value.UpdateCounter, pSoldier.value.sAniDelay) && pSoldier.value.sAniDelay != 10000)
        {
          // Check if we need to look for items
          if (pSoldier.value.uiStatusFlags & SOLDIER_LOOKFOR_ITEMS) {
            RevealRoofsAndItems(pSoldier, true, false, pSoldier.value.bLevel, false);
            pSoldier.value.uiStatusFlags &= (~SOLDIER_LOOKFOR_ITEMS);
          }

          // Check if we need to reposition light....
          if (pSoldier.value.uiStatusFlags & SOLDIER_RECHECKLIGHT) {
            PositionSoldierLight(pSoldier);
            pSoldier.value.uiStatusFlags &= (~SOLDIER_RECHECKLIGHT);
          }

          RESETTIMECOUNTER(pSoldier.value.UpdateCounter, pSoldier.value.sAniDelay);

          fNoAPsForPendingAction = false;

          // Check if we are moving and we deduct points and we have no points
          if (!((gAnimControl[pSoldier.value.usAnimState].uiFlags & (ANIM_MOVING | ANIM_SPECIALMOVE)) && pSoldier.value.fNoAPToFinishMove) && !pSoldier.value.fPauseAllAnimation) {
            if (!AdjustToNextAnimationFrame(pSoldier)) {
              continue;
            }

            if (!(gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_SPECIALMOVE)) {
              // Check if we are waiting for an opened path
              HandleNextTileWaiting(pSoldier);
            }

            // Update world data with new position, etc
            // Determine gameworld cells corrds of guy
            if (gAnimControl[pSoldier.value.usAnimState].uiFlags & (ANIM_MOVING | ANIM_SPECIALMOVE) && !(pSoldier.value.uiStatusFlags & SOLDIER_PAUSEANIMOVE)) {
              fKeepMoving = true;

              pSoldier.value.fPausedMove = false;

              // CHECK TO SEE IF WE'RE ON A MIDDLE TILE
              if (pSoldier.value.fPastXDest && pSoldier.value.fPastYDest) {
                pSoldier.value.fPastXDest = pSoldier.value.fPastYDest = false;
                // assign X/Y values back to make sure we are at the center of the tile
                // (to prevent mercs from going through corners of tiles and producing
                // structure data complaints)

                // pSoldier->dXPos = pSoldier->sDestXPos;
                // pSoldier->dYPos = pSoldier->sDestYPos;

                HandleBloodForNewGridNo(pSoldier);

                if ((gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_SPECIALMOVE) && pSoldier.value.sGridNo != pSoldier.value.sFinalDestination) {
                } else {
                  // OK, we're at the MIDDLE of a new tile...
                  HandleAtNewGridNo(pSoldier, addressof(fKeepMoving));
                }

                if (gTacticalStatus.bBoxingState != Enum247.NOT_BOXING && (gTacticalStatus.bBoxingState == Enum247.BOXING_WAITING_FOR_PLAYER || gTacticalStatus.bBoxingState == Enum247.PRE_BOXING || gTacticalStatus.bBoxingState == Enum247.BOXING)) {
                  BoxingMovementCheck(pSoldier);
                }

                // Are we at our final destination?
                if (pSoldier.value.sFinalDestination == pSoldier.value.sGridNo) {
                  // Cancel path....
                  pSoldier.value.usPathIndex = pSoldier.value.usPathDataSize = 0;

                  // Cancel reverse
                  pSoldier.value.bReverse = false;

                  // OK, if we are the selected soldier, refresh some UI stuff
                  if (pSoldier.value.ubID == gusSelectedSoldier) {
                    gfUIRefreshArrows = true;
                  }

                  // ATE: Play landing sound.....
                  if (pSoldier.value.usAnimState == Enum193.JUMP_OVER_BLOCKING_PERSON) {
                    PlaySoldierFootstepSound(pSoldier);
                  }

                  // If we are a robot, play stop sound...
                  if (pSoldier.value.uiStatusFlags & SOLDIER_ROBOT) {
                    PlaySoldierJA2Sample(pSoldier.value.ubID, Enum330.ROBOT_STOP, RATE_11025, SoundVolume(HIGHVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo), true);
                  }

                  // Update to middle if we're on destination
                  dXPos = pSoldier.value.sDestXPos;
                  dYPos = pSoldier.value.sDestYPos;
                  EVENT_SetSoldierPosition(pSoldier, dXPos, dYPos);

                  // Handle New sight
                  // HandleSight(pSoldier,SIGHT_LOOK | SIGHT_RADIO );

                  // CHECK IF WE HAVE A PENDING ANIMATION
                  if (pSoldier.value.usPendingAnimation != NO_PENDING_ANIMATION) {
                    ChangeSoldierState(pSoldier, pSoldier.value.usPendingAnimation, 0, false);
                    pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;

                    if (pSoldier.value.ubPendingDirection != NO_PENDING_DIRECTION) {
                      EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.value.ubPendingDirection);
                      pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
                    }
                  }

                  // CHECK IF WE HAVE A PENDING ACTION
                  if (pSoldier.value.ubWaitActionToDo) {
                    if (pSoldier.value.ubWaitActionToDo == 2) {
                      pSoldier.value.ubWaitActionToDo = 1;

                      if (gubWaitingForAllMercsToExitCode == Enum238.WAIT_FOR_MERCS_TO_WALKOFF_SCREEN) {
                        // ATE wanted this line here...
                        pSoldier.value.usPathIndex--;
                        AdjustSoldierPathToGoOffEdge(pSoldier, pSoldier.value.sGridNo, pSoldier.value.uiPendingActionData1);
                        continue;
                      }
                    } else if (pSoldier.value.ubWaitActionToDo == 1) {
                      pSoldier.value.ubWaitActionToDo = 0;

                      gbNumMercsUntilWaitingOver--;

                      SoldierGotoStationaryStance(pSoldier);

                      // If we are at an exit-grid, make disappear.....
                      if (gubWaitingForAllMercsToExitCode == Enum238.WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO) {
                        // Remove!
                        RemoveSoldierFromTacticalSector(pSoldier, true);
                      }
                    }
                  } else if (pSoldier.value.ubPendingAction != NO_PENDING_ACTION) {
                    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("We are inside the IF PENDING Animation with soldier #%d", pSoldier.value.ubID));

                    if (pSoldier.value.ubPendingAction == Enum257.MERC_OPENDOOR || pSoldier.value.ubPendingAction == Enum257.MERC_OPENSTRUCT) {
                      sGridNo = pSoldier.value.sPendingActionData2;
                      // usStructureID           = (UINT16)pSoldier->uiPendingActionData1;
                      // pStructure = FindStructureByID( sGridNo, usStructureID );

                      // LOOK FOR STRUCT OPENABLE
                      pStructure = FindStructure(sGridNo, STRUCTURE_OPENABLE);

                      if (pStructure == null) {
                        fKeepMoving = false;
                      } else {
                        CalcInteractiveObjectAPs(sGridNo, pStructure, addressof(sAPCost), addressof(sBPCost));

                        if (EnoughPoints(pSoldier, sAPCost, sBPCost, true)) {
                          InteractWithInteractiveObject(pSoldier, pStructure, pSoldier.value.bPendingActionData3);
                        } else {
                          fNoAPsForPendingAction = true;
                        }
                      }
                    }
                    if (pSoldier.value.ubPendingAction == Enum257.MERC_PICKUPITEM) {
                      sGridNo = pSoldier.value.sPendingActionData2;

                      if (sGridNo == pSoldier.value.sGridNo) {
                        // OK, now, if in realtime
                        if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
                          // If the two gridnos are not the same, check to see if we can
                          // now go into it
                          if (sGridNo != pSoldier.value.uiPendingActionData4) {
                            if (NewOKDestination(pSoldier, pSoldier.value.uiPendingActionData4, true, pSoldier.value.bLevel)) {
                              // GOTO NEW TILE!
                              SoldierPickupItem(pSoldier, pSoldier.value.uiPendingActionData1, pSoldier.value.uiPendingActionData4, pSoldier.value.bPendingActionData3);
                              continue;
                            }
                          }
                        }

                        // OK MORON, DOUBLE CHECK THAT THE ITEM EXISTS HERE...
                        if (pSoldier.value.uiPendingActionData1 != ITEM_PICKUP_ACTION_ALL) {
                          // if ( ItemExistsAtLocation( (INT16)( pSoldier->uiPendingActionData4 ), pSoldier->uiPendingActionData1, pSoldier->bLevel ) )
                          { PickPickupAnimation(pSoldier, pSoldier.value.uiPendingActionData1, (pSoldier.value.uiPendingActionData4), pSoldier.value.bPendingActionData3); }
                        } else {
                          PickPickupAnimation(pSoldier, pSoldier.value.uiPendingActionData1, (pSoldier.value.uiPendingActionData4), pSoldier.value.bPendingActionData3);
                        }
                      } else {
                        SoldierGotoStationaryStance(pSoldier);
                      }
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_PUNCH) {
                      // for the benefit of the AI
                      pSoldier.value.bAction = Enum289.AI_ACTION_KNIFE_STAB;

                      EVENT_SoldierBeginPunchAttack(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_TALK) {
                      PlayerSoldierStartTalking(pSoldier, pSoldier.value.uiPendingActionData1, true);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_DROPBOMB) {
                      EVENT_SoldierBeginDropBomb(pSoldier);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_STEAL) {
                      // pSoldier->bDesiredDirection = pSoldier->bPendingActionData3;
                      EVENT_SetSoldierDesiredDirection(pSoldier, pSoldier.value.bPendingActionData3);

                      EVENT_InitNewSoldierAnim(pSoldier, Enum193.STEAL_ITEM, 0, false);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_KNIFEATTACK) {
                      // for the benefit of the AI
                      pSoldier.value.bAction = Enum289.AI_ACTION_KNIFE_STAB;

                      EVENT_SoldierBeginBladeAttack(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_GIVEAID) {
                      EVENT_SoldierBeginFirstAid(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_REPAIR) {
                      EVENT_SoldierBeginRepair(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_FUEL_VEHICLE) {
                      EVENT_SoldierBeginRefuel(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_RELOADROBOT) {
                      EVENT_SoldierBeginReloadRobot(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3, pSoldier.value.uiPendingActionData1);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_TAKEBLOOD) {
                      EVENT_SoldierBeginTakeBlood(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_ATTACH_CAN) {
                      EVENT_SoldierBeginAttachCan(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_ENTER_VEHICLE) {
                      EVENT_SoldierEnterVehicle(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                      continue;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_CUTFFENCE) {
                      EVENT_SoldierBeginCutFence(pSoldier, pSoldier.value.sPendingActionData2, pSoldier.value.bPendingActionData3);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    } else if (pSoldier.value.ubPendingAction == Enum257.MERC_GIVEITEM) {
                      EVENT_SoldierBeginGiveItem(pSoldier);
                      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
                    }

                    if (fNoAPsForPendingAction) {
                      // Change status of guy to waiting
                      HaltMoveForSoldierOutOfPoints(pSoldier);
                      fKeepMoving = false;
                      pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
                      pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
                    }
                  } else {
                    // OK, ADJUST TO STANDING, WE ARE DONE
                    // DO NOTHING IF WE ARE UNCONSCIOUS
                    if (pSoldier.value.bLife >= OKLIFE) {
                      if (pSoldier.value.ubBodyType == Enum194.CROW) {
                        // If we are flying, don't stop!
                        if (pSoldier.value.sHeightAdjustment == 0) {
                          SoldierGotoStationaryStance(pSoldier);
                        }
                      } else {
                        UnSetUIBusy(pSoldier.value.ubID);

                        SoldierGotoStationaryStance(pSoldier);
                      }
                    }
                  }

                  // RESET MOVE FAST FLAG
                  if ((pSoldier.value.ubProfile == NO_PROFILE)) {
                    pSoldier.value.fUIMovementFast = false;
                  }

                  // if AI moving and waiting to process something at end of
                  // move, have them handled the very next frame
                  if (pSoldier.value.ubQuoteActionID == Enum290.QUOTE_ACTION_ID_CHECKFORDEST) {
                    pSoldier.value.fAIFlags |= AI_HANDLE_EVERY_FRAME;
                  }

                  fKeepMoving = false;
                } else if (!pSoldier.value.fNoAPToFinishMove) {
                  // Increment path....
                  pSoldier.value.usPathIndex++;

                  if (pSoldier.value.usPathIndex > pSoldier.value.usPathDataSize) {
                    pSoldier.value.usPathIndex = pSoldier.value.usPathDataSize;
                  }

                  // Are we at the end?
                  if (pSoldier.value.usPathIndex == pSoldier.value.usPathDataSize) {
                    // ATE: Pop up warning....
                    if (pSoldier.value.usPathDataSize != MAX_PATH_LIST_SIZE) {
                    }

                    // In case this is an AI person with the path-stored flag set,
                    // turn it OFF since we have exhausted our stored path
                    pSoldier.value.bPathStored = false;
                    if (pSoldier.value.sAbsoluteFinalDestination != NOWHERE) {
                      // We have not made it to our dest... but it's better to let the AI handle this itself,
                      // on the very next fram
                      pSoldier.value.fAIFlags |= AI_HANDLE_EVERY_FRAME;
                    } else {
                      // ATE: Added this to fcalilitate the fact
                      // that our final dest may now have people on it....
                      if (FindBestPath(pSoldier, pSoldier.value.sFinalDestination, pSoldier.value.bLevel, pSoldier.value.usUIMovementMode, NO_COPYROUTE, PATH_THROUGH_PEOPLE) != 0) {
                        let sNewGridNo: INT16;

                        sNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(guiPathingData[0]));

                        SetDelayedTileWaiting(pSoldier, sNewGridNo, 1);
                      }

                      // We have not made it to our dest... set flag that we are waiting....
                      if (!EVENT_InternalGetNewSoldierPath(pSoldier, pSoldier.value.sFinalDestination, pSoldier.value.usUIMovementMode, 2, false)) {
                        // ATE: To do here.... we could not get path, so we have to stop
                        SoldierGotoStationaryStance(pSoldier);
                        continue;
                      }
                    }
                  } else {
                    // OK, Now find another dest grindo....
                    if (!(gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_SPECIALMOVE)) {
                      // OK, now we want to see if we can continue to another tile...
                      if (!HandleGotoNewGridNo(pSoldier, addressof(fKeepMoving), false, pSoldier.value.usAnimState)) {
                        continue;
                      }
                    } else {
                      // Change desired direction
                      // Just change direction
                      EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], false, pSoldier.value.usAnimState);
                    }

                    if (gTacticalStatus.bBoxingState != Enum247.NOT_BOXING && (gTacticalStatus.bBoxingState == Enum247.BOXING_WAITING_FOR_PLAYER || gTacticalStatus.bBoxingState == Enum247.PRE_BOXING || gTacticalStatus.bBoxingState == Enum247.BOXING)) {
                      BoxingMovementCheck(pSoldier);
                    }
                  }
                }
              }

              if ((pSoldier.value.uiStatusFlags & SOLDIER_PAUSEANIMOVE)) {
                fKeepMoving = false;
              }

              // DO WALKING
              if (!pSoldier.value.fPausedMove && fKeepMoving) {
                // Determine deltas
                //	dDeltaX = pSoldier->sDestXPos - pSoldier->dXPos;
                // dDeltaY = pSoldier->sDestYPos - pSoldier->dYPos;

                // Determine angle
                //	dAngle = (FLOAT)atan2( dDeltaX, dDeltaY );

                dAngle = gdRadiansForAngle[pSoldier.value.bMovementDirection];

                // For walking, base it on body type!
                if (pSoldier.value.usAnimState == Enum193.WALKING) {
                  MoveMerc(pSoldier, gubAnimWalkSpeeds[pSoldier.value.ubBodyType].dMovementChange, dAngle, true);
                } else {
                  MoveMerc(pSoldier, gAnimControl[pSoldier.value.usAnimState].dMovementChange, dAngle, true);
                }
              }
            }

            // Check for direction change
            if (gAnimControl[pSoldier.value.usAnimState].uiFlags & ANIM_TURNING) {
              TurnSoldier(pSoldier);
            }
          }
        }

        if (!gfPauseAllAI && (((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) || (fHandleAI && guiAISlotToHandle == cnt) || (pSoldier.value.fAIFlags & AI_HANDLE_EVERY_FRAME) || gTacticalStatus.fAutoBandageMode)) {
          HandleSoldierAI(pSoldier);
          if (!((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT))) {
            if (GetJA2Clock() - iTimerVal > RT_AI_TIMESLICE) {
              // don't do any more AI this time!
              fHandleAI = false;
            } else {
              // we still have time to handle AI; skip to the next person
              fHandleAI = NextAIToHandle(guiAISlotToHandle);
            }
          }
        }
      }
    }

    if (guiNumAwaySlots > 0 && !gfPauseAllAI && !(gTacticalStatus.uiFlags & INCOMBAT) && guiAISlotToHandle == HANDLE_OFF_MAP_MERC && guiAIAwaySlotToHandle != RESET_HANDLE_OF_OFF_MAP_MERCS) {
      pSoldier = AwaySlots[guiAIAwaySlotToHandle];

      // Syncronize for upcoming soldier counters
      SYNCTIMECOUNTER();

      if (pSoldier != null) {
        // the ONLY thing to do with away soldiers is process their schedule if they have one
        // and there is an action for them to do (like go on-sector)
        if (pSoldier.value.fAIFlags & AI_CHECK_SCHEDULE) {
          HandleSoldierAI(pSoldier);
        }
      }
    }

    // Turn off auto bandage if we need to...
    if (gTacticalStatus.fAutoBandageMode) {
      if (!CanAutoBandage(true)) {
        SetAutoBandageComplete();
      }
    }

    // Check if we should be doing a special event once guys get to a location...
    if (gubWaitingForAllMercsToExitCode != 0) {
      // Check if we have gone past our time...
      if ((GetJA2Clock() - guiWaitingForAllMercsToExitTimer) > 2500) {
// OK, set num waiting to 0
        gbNumMercsUntilWaitingOver = 0;

        // Reset all waitng codes
        for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
          pSoldier = MercSlots[cnt];
          if (pSoldier != null) {
            pSoldier.value.ubWaitActionToDo = 0;
          }
        }
      }

      if (gbNumMercsUntilWaitingOver == 0) {
        // ATE: Unset flag to ignore sight...
        gTacticalStatus.uiFlags &= (~DISALLOW_SIGHT);

        // OK cheif, do something here....
        switch (gubWaitingForAllMercsToExitCode) {
          case Enum238.WAIT_FOR_MERCS_TO_WALKOFF_SCREEN:

            if ((gTacticalStatus.ubCurrentTeam == gbPlayerNum)) {
              guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
              HandleTacticalUI();
            }
            AllMercsHaveWalkedOffSector();
            break;

          case Enum238.WAIT_FOR_MERCS_TO_WALKON_SCREEN:

            // OK, unset UI
            if ((gTacticalStatus.ubCurrentTeam == gbPlayerNum)) {
              guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
              HandleTacticalUI();
            }
            break;

          case Enum238.WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO:

            // OK, unset UI
            if ((gTacticalStatus.ubCurrentTeam == gbPlayerNum)) {
              guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
              HandleTacticalUI();
            }
            AllMercsWalkedToExitGrid();
            break;
        }

        // ATE; Turn off tactical status flag...
        gTacticalStatus.uiFlags &= (~IGNORE_ALL_OBSTACLES);

        gubWaitingForAllMercsToExitCode = 0;
      }
    }
  }

  // reset these AI-related global variables to 0 to ensure they don't interfere with the UI
  gubNPCAPBudget = 0;
  gubNPCDistLimit = 0;

  return true;
}

function HaltGuyFromNewGridNoBecauseOfNoAPs(pSoldier: Pointer<SOLDIERTYPE>): void {
  HaltMoveForSoldierOutOfPoints(pSoldier);
  pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
  pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
  pSoldier.value.ubPendingAction = NO_PENDING_ACTION;

  UnMarkMovementReserved(pSoldier);

  // Display message if our merc...
  if (pSoldier.value.bTeam == gbPlayerNum && (gTacticalStatus.uiFlags & INCOMBAT)) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.GUY_HAS_RUN_OUT_OF_APS_STR], pSoldier.value.name);
  }

  UnSetUIBusy(pSoldier.value.ubID);

  // OK, Unset engaged in CONV, something changed...
  UnSetEngagedInConvFromPCAction(pSoldier);
}

function HandleLocateToGuyAsHeWalks(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Our guys if option set,
  if (pSoldier.value.bTeam == gbPlayerNum) {
    // IF tracking on, center on guy....
    if (gGameSettings.fOptions[Enum8.TOPTION_TRACKING_MODE]) {
      LocateSoldier(pSoldier.value.ubID, false);
    }
  } else {
    // Others if visible...
    if (pSoldier.value.bVisible != -1) {
      // ATE: If we are visible, and have not already removed roofs, goforit
      if (pSoldier.value.bLevel > 0) {
        if (!(gTacticalStatus.uiFlags & SHOW_ALL_ROOFS)) {
          gTacticalStatus.uiFlags |= SHOW_ALL_ROOFS;
          SetRenderFlags(RENDER_FLAG_FULL);
        }
      }

      LocateSoldier(pSoldier.value.ubID, false);
    }
  }
}

export function HandleGotoNewGridNo(pSoldier: Pointer<SOLDIERTYPE>, pfKeepMoving: Pointer<boolean>, fInitialMove: boolean, usAnimState: UINT16): boolean {
  let sAPCost: INT16;
  let sBPCost: INT16;
  let usNewGridNo: UINT16;
  let sOverFenceGridNo: UINT16;
  let sMineGridNo: UINT16;

  if (gTacticalStatus.uiFlags & INCOMBAT && fInitialMove) {
    HandleLocateToGuyAsHeWalks(pSoldier);
  }

  // Default to TRUE
  (pfKeepMoving.value) = true;

  // Check for good breath....
  // if ( pSoldier->bBreath < OKBREATH && !fInitialMove )
  if (pSoldier.value.bBreath < OKBREATH) {
    // OK, first check for b== 0
    // If our currentd state is moving already....( this misses the first tile, so the user
    // Sees some change in their click, but just one tile
    if (pSoldier.value.bBreath == 0) {
      // Collapse!
      pSoldier.value.bBreathCollapsed = true;
      pSoldier.value.bEndDoorOpenCode = false;

      if (fInitialMove) {
        UnSetUIBusy(pSoldier.value.ubID);
      }

      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("HandleGotoNewGridNo() Failed: Out of Breath"));
      return false;
    }

    // OK, if we are collapsed now, check for OK breath instead...
    if (pSoldier.value.bCollapsed) {
      // Collapse!
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("HandleGotoNewGridNo() Failed: Has Collapsed"));
      pSoldier.value.bBreathCollapsed = true;
      pSoldier.value.bEndDoorOpenCode = false;
      return false;
    }
  }

  usNewGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(pSoldier.value.usPathingData[pSoldier.value.usPathIndex]));

  // OK, check if this is a fence cost....
  if (gubWorldMovementCosts[usNewGridNo][pSoldier.value.usPathingData[pSoldier.value.usPathIndex]][pSoldier.value.bLevel] == TRAVELCOST_FENCE) {
    // We have been told to jump fence....

    // Do we have APs?
    sAPCost = AP_JUMPFENCE;
    sBPCost = BP_JUMPFENCE;

    if (EnoughPoints(pSoldier, sAPCost, sBPCost, false)) {
      // ATE: Check for tile being clear....
      sOverFenceGridNo = NewGridNo(usNewGridNo, DirectionInc(pSoldier.value.usPathingData[pSoldier.value.usPathIndex + 1]));

      if (HandleNextTile(pSoldier, pSoldier.value.usPathingData[pSoldier.value.usPathIndex + 1], sOverFenceGridNo, pSoldier.value.sFinalDestination)) {
        // We do, adjust path data....
        pSoldier.value.usPathIndex++;
        // We go two, because we really want to start moving towards the NEXT gridno,
        // if we have any...

        // LOCK PENDING ACTION COUNTER
        pSoldier.value.uiStatusFlags |= SOLDIER_LOCKPENDINGACTIONCOUNTER;

        SoldierGotoStationaryStance(pSoldier);

        // OK, jump!
        BeginSoldierClimbFence(pSoldier);

        pSoldier.value.fContinueMoveAfterStanceChange = 2;
      }
    } else {
      HaltGuyFromNewGridNoBecauseOfNoAPs(pSoldier);
      (pfKeepMoving.value) = false;
    }

    return false;
  } else if (InternalDoorTravelCost(pSoldier, usNewGridNo, gubWorldMovementCosts[usNewGridNo][pSoldier.value.usPathingData[pSoldier.value.usPathIndex]][pSoldier.value.bLevel], (pSoldier.value.bTeam == gbPlayerNum), null, true) == TRAVELCOST_DOOR) {
    let pStructure: Pointer<STRUCTURE>;
    let bDirection: INT8;
    let sDoorGridNo: INT16;

    // OK, if we are here, we have been told to get a pth through a door.

    // No need to check if for AI

    // No need to check for right key ( since the path checks for that? )

    // Just for now play the $&&% animation
    bDirection = pSoldier.value.usPathingData[pSoldier.value.usPathIndex];

    // OK, based on the direction, get door gridno
    if (bDirection == Enum245.NORTH || bDirection == Enum245.WEST) {
      sDoorGridNo = NewGridNo(pSoldier.value.sGridNo, DirectionInc(pSoldier.value.usPathingData[pSoldier.value.usPathIndex]));
    } else if (bDirection == Enum245.SOUTH || bDirection == Enum245.EAST) {
      sDoorGridNo = pSoldier.value.sGridNo;
    } else {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("HandleGotoNewGridNo() Failed: Open door - invalid approach direction"));

      HaltGuyFromNewGridNoBecauseOfNoAPs(pSoldier);
      pSoldier.value.bEndDoorOpenCode = false;
      (pfKeepMoving.value) = false;
      return false;
    }

    // Get door
    pStructure = FindStructure(sDoorGridNo, STRUCTURE_ANYDOOR);

    if (pStructure == null) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("HandleGotoNewGridNo() Failed: Door does not exist"));
      HaltGuyFromNewGridNoBecauseOfNoAPs(pSoldier);
      pSoldier.value.bEndDoorOpenCode = false;
      (pfKeepMoving.value) = false;
      return false;
    }

    // OK, open!
    StartInteractiveObject(sDoorGridNo, pStructure.value.usStructureID, pSoldier, bDirection);
    InteractWithInteractiveObject(pSoldier, pStructure, bDirection);

    // One needs to walk after....
    if ((pSoldier.value.bTeam != gbPlayerNum) || (gTacticalStatus.fAutoBandageMode) || (pSoldier.value.uiStatusFlags & SOLDIER_PCUNDERAICONTROL)) {
      pSoldier.value.bEndDoorOpenCode = 1;
      pSoldier.value.sEndDoorOpenCodeData = sDoorGridNo;
    }
    (pfKeepMoving.value) = false;
    return false;
  }

  // Find out how much it takes to move here!
  sAPCost = ActionPointCost(pSoldier, usNewGridNo, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], usAnimState);
  sBPCost = TerrainBreathPoints(pSoldier, usNewGridNo, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], usAnimState);

  // CHECK IF THIS TILE IS A GOOD ONE!
  if (!HandleNextTile(pSoldier, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], usNewGridNo, pSoldier.value.sFinalDestination)) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("HandleGotoNewGridNo() Failed: Tile %d Was blocked", usNewGridNo));

    // ATE: If our own guy and an initial move.. display message
    // if ( fInitialMove && pSoldier->bTeam == gbPlayerNum  )
    //{
    //	ScreenMsg( FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[ NO_PATH_FOR_MERC ], pSoldier->name );
    //}

    pSoldier.value.bEndDoorOpenCode = false;
    // GO on to next guy!
    return false;
  }

  // just check the tile we're going to walk into
  if (NearbyGroundSeemsWrong(pSoldier, usNewGridNo, false, addressof(sMineGridNo))) {
    if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
      // NearbyGroundSeemsWrong returns true with gridno NOWHERE if
      // we find something by metal detector... we should definitely stop
      // but we won't place a locator or say anything

      // IF not in combat, stop them all
      if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
        let cnt2: INT32;
        let pSoldier2: Pointer<SOLDIERTYPE>;

        cnt2 = gTacticalStatus.Team[gbPlayerNum].bLastID;

        // look for all mercs on the same team,
        for (pSoldier2 = MercPtrs[cnt2]; cnt2 >= gTacticalStatus.Team[gbPlayerNum].bFirstID; cnt2--, pSoldier2--) {
          if (pSoldier2.value.bActive) {
            EVENT_StopMerc(pSoldier2, pSoldier2.value.sGridNo, pSoldier2.value.bDirection);
          }
        }
      } else {
        EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
      }

      (pfKeepMoving.value) = false;

      if (sMineGridNo != NOWHERE) {
        LocateGridNo(sMineGridNo);
        // we reuse the boobytrap gridno variable here
        gsBoobyTrapGridNo = sMineGridNo;
        gpBoobyTrapSoldier = pSoldier;
        SetStopTimeQuoteCallback(MineSpottedDialogueCallBack);
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SUSPICIOUS_GROUND);
      }
    } else {
      if (sMineGridNo != NOWHERE) {
        EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
        (pfKeepMoving.value) = false;

        gpWorldLevelData[sMineGridNo].uiFlags |= MAPELEMENT_ENEMY_MINE_PRESENT;

        // better stop and reconsider what to do...
        SetNewSituation(pSoldier);
        ActionDone(pSoldier);
      }
    }
  }

  // ATE: Check if we have sighted anyone, if so, don't do anything else...
  // IN other words, we have stopped from sighting...
  if (pSoldier.value.fNoAPToFinishMove && !fInitialMove) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("HandleGotoNewGridNo() Failed: No APs to finish move set"));
    pSoldier.value.bEndDoorOpenCode = false;
    (pfKeepMoving.value) = false;
  } else if (pSoldier.value.usPathIndex == pSoldier.value.usPathDataSize && pSoldier.value.usPathDataSize == 0) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("HandleGotoNewGridNo() Failed: No Path"));
    pSoldier.value.bEndDoorOpenCode = false;
    (pfKeepMoving.value) = false;
  }
  // else if ( gTacticalStatus.fEnemySightingOnTheirTurn )
  //{
  // Hault guy!
  //	AdjustNoAPToFinishMove( pSoldier, TRUE );
  //	(*pfKeepMoving ) = FALSE;
  //}
  else if (EnoughPoints(pSoldier, sAPCost, 0, false)) {
    let fDontContinue: boolean = false;

    if (pSoldier.value.usPathIndex > 0) {
      // check for running into gas

      // note: this will have to use the minimum types of structures for tear/creature gas
      // since there isn't a way to retrieve the smoke effect structure
      if (gpWorldLevelData[pSoldier.value.sGridNo].ubExtFlags[pSoldier.value.bLevel] & ANY_SMOKE_EFFECT && PreRandom(5) == 0) {
        let pExplosive: Pointer<EXPLOSIVETYPE> = null;
        let bPosOfMask: INT8;

        if (pSoldier.value.inv[Enum261.HEAD1POS].usItem == Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD1POS].bStatus[0] >= GASMASK_MIN_STATUS) {
          bPosOfMask = Enum261.HEAD1POS;
        } else if (pSoldier.value.inv[Enum261.HEAD2POS].usItem == Enum225.GASMASK && pSoldier.value.inv[Enum261.HEAD2POS].bStatus[0] >= GASMASK_MIN_STATUS) {
          bPosOfMask = Enum261.HEAD2POS;
        } else {
          bPosOfMask = NO_SLOT;
        }

        if (!AM_A_ROBOT(pSoldier)) {
          if (gpWorldLevelData[pSoldier.value.sGridNo].ubExtFlags[pSoldier.value.bLevel] & MAPELEMENT_EXT_TEARGAS) {
            if (!(pSoldier.value.fHitByGasFlags & Enum264.HIT_BY_TEARGAS) && bPosOfMask == NO_SLOT) {
              // check for gas mask
              pExplosive = addressof(Explosive[Item[Enum225.TEARGAS_GRENADE].ubClassIndex]);
            }
          }
          if (gpWorldLevelData[pSoldier.value.sGridNo].ubExtFlags[pSoldier.value.bLevel] & MAPELEMENT_EXT_MUSTARDGAS) {
            if (!(pSoldier.value.fHitByGasFlags & Enum264.HIT_BY_MUSTARDGAS) && bPosOfMask == NO_SLOT) {
              pExplosive = addressof(Explosive[Item[Enum225.MUSTARD_GRENADE].ubClassIndex]);
            }
          }
        }
        if (gpWorldLevelData[pSoldier.value.sGridNo].ubExtFlags[pSoldier.value.bLevel] & MAPELEMENT_EXT_CREATUREGAS) {
          if (!(pSoldier.value.fHitByGasFlags & Enum264.HIT_BY_CREATUREGAS)) // gas mask doesn't help vs creaturegas
          {
            pExplosive = addressof(Explosive[Item[Enum225.SMALL_CREATURE_GAS].ubClassIndex]);
          }
        }
        if (pExplosive) {
          EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
          fDontContinue = true;

          DishOutGasDamage(pSoldier, pExplosive, true, false, (pExplosive.value.ubDamage + PreRandom(pExplosive.value.ubDamage)), (100 * (pExplosive.value.ubStunDamage + PreRandom((pExplosive.value.ubStunDamage / 2)))), NOBODY);
        }
      }

      if (!fDontContinue) {
        if ((pSoldier.value.bOverTerrainType == Enum315.FLAT_FLOOR || pSoldier.value.bOverTerrainType == Enum315.PAVED_ROAD) && pSoldier.value.bLevel == 0) {
          let iMarblesIndex: INT32;

          if (ItemTypeExistsAtLocation(pSoldier.value.sGridNo, Enum225.MARBLES, 0, addressof(iMarblesIndex))) {
            // Slip on marbles!
            DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
            if (pSoldier.value.bTeam == gbPlayerNum) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, Message[Enum334.STR_SLIPPED_MARBLES], pSoldier.value.name);
            }
            RemoveItemFromPool(pSoldier.value.sGridNo, iMarblesIndex, 0);
            SoldierCollapse(pSoldier);
            if (pSoldier.value.bActionPoints > 0) {
              pSoldier.value.bActionPoints -= (Random(pSoldier.value.bActionPoints) + 1);
            }
            return false;
          }
        }

        if ((pSoldier.value.bBlindedCounter > 0) && (pSoldier.value.usAnimState == Enum193.RUNNING) && (Random(5) == 0) && OKFallDirection(pSoldier, (pSoldier.value.sGridNo + DirectionInc(pSoldier.value.bDirection)), pSoldier.value.bLevel, pSoldier.value.bDirection, pSoldier.value.usAnimState)) {
          // 20% chance of falling over!
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[37], pSoldier.value.name);
          SoldierCollapse(pSoldier);
          if (pSoldier.value.bActionPoints > 0) {
            pSoldier.value.bActionPoints -= (Random(pSoldier.value.bActionPoints) + 1);
          }
          return false;
        } else if ((GetDrunkLevel(pSoldier) == DRUNK) && (Random(5) == 0) && OKFallDirection(pSoldier, (pSoldier.value.sGridNo + DirectionInc(pSoldier.value.bDirection)), pSoldier.value.bLevel, pSoldier.value.bDirection, pSoldier.value.usAnimState)) {
          // 20% chance of falling over!
          DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_CURSE1);
          ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, gzLateLocalizedString[37], pSoldier.value.name);
          SoldierCollapse(pSoldier);
          if (pSoldier.value.bActionPoints > 0) {
            pSoldier.value.bActionPoints -= (Random(pSoldier.value.bActionPoints) + 1);
          }
          return false;
        } else
            // ATE; First check for profile
            // Forgetful guy might forget his path
            if ((pSoldier.value.bTeam == gbPlayerNum) && (pSoldier.value.ubProfile != NO_PROFILE) && gMercProfiles[pSoldier.value.ubProfile].bPersonalityTrait == Enum270.FORGETFUL) {
          if (pSoldier.value.ubNumTilesMovesSinceLastForget < 255) {
            pSoldier.value.ubNumTilesMovesSinceLastForget++;
          }

          if (pSoldier.value.usPathIndex > 2 && (Random(100) == 0) && pSoldier.value.ubNumTilesMovesSinceLastForget > 200) {
            pSoldier.value.ubNumTilesMovesSinceLastForget = 0;

            TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
            EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
            if (pSoldier.value.bActionPoints > 0) {
              pSoldier.value.bActionPoints -= (Random(pSoldier.value.bActionPoints) + 1);
            }

            fDontContinue = true;

            UnSetUIBusy(pSoldier.value.ubID);
          }
        }
      }
    }

    if (!fDontContinue) {
      // Don't apply the first deduction in points...
      if (usAnimState == Enum193.CRAWLING && pSoldier.value.fTurningFromPronePosition > 1) {
      } else {
        // Adjust AP/Breathing points to move
        DeductPoints(pSoldier, sAPCost, sBPCost);
      }

      // OK, let's check for monsters....
      if (pSoldier.value.uiStatusFlags & SOLDIER_MONSTER) {
        if (!ValidCreatureTurn(pSoldier, (pSoldier.value.usPathingData[pSoldier.value.usPathIndex]))) {
          if (!pSoldier.value.bReverse) {
            pSoldier.value.bReverse = true;

            if (pSoldier.value.ubBodyType == Enum194.INFANT_MONSTER) {
              ChangeSoldierState(pSoldier, Enum193.WALK_BACKWARDS, 1, true);
            } else {
              ChangeSoldierState(pSoldier, Enum193.MONSTER_WALK_BACKWARDS, 1, true);
            }
          }
        } else {
          pSoldier.value.bReverse = false;
        }
      }

      // OK, let's check for monsters....
      if (pSoldier.value.ubBodyType == Enum194.BLOODCAT) {
        if (!ValidCreatureTurn(pSoldier, (pSoldier.value.usPathingData[pSoldier.value.usPathIndex]))) {
          if (!pSoldier.value.bReverse) {
            pSoldier.value.bReverse = true;
            ChangeSoldierState(pSoldier, Enum193.BLOODCAT_WALK_BACKWARDS, 1, true);
          }
        } else {
          pSoldier.value.bReverse = false;
        }
      }

      // Change desired direction
      EVENT_InternalSetSoldierDestination(pSoldier, pSoldier.value.usPathingData[pSoldier.value.usPathIndex], fInitialMove, usAnimState);

      // CONTINUE
      // IT'S SAVE TO GO AGAIN, REFRESH flag
      AdjustNoAPToFinishMove(pSoldier, false);
    }
  } else {
    // HALT GUY HERE
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("HandleGotoNewGridNo() Failed: No APs %d %d", sAPCost, pSoldier.value.bActionPoints));
    HaltGuyFromNewGridNoBecauseOfNoAPs(pSoldier);
    pSoldier.value.bEndDoorOpenCode = false;
    (pfKeepMoving.value) = false;
  }

  return true;
}

function HandleMaryArrival(pSoldier: Pointer<SOLDIERTYPE>): void {
  let sDist: INT16;

  if (!pSoldier) {
    pSoldier = FindSoldierByProfileID(Enum268.MARY, true);
    if (!pSoldier) {
      return;
    }
  }

  if (CheckFact(Enum170.FACT_JOHN_ALIVE, 0)) {
    return;
  }
  // new requirements: player close by
  else if (PythSpacesAway(pSoldier.value.sGridNo, 8228) < 40) {
    if (ClosestPC(pSoldier, addressof(sDist)) != NOWHERE && sDist > NPC_TALK_RADIUS * 2) {
      // too far away
      return;
    }

    // Mary has arrived
    SetFactTrue(Enum170.FACT_MARY_OR_JOHN_ARRIVED);

    EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);

    TriggerNPCRecord(Enum268.MARY, 13);
  }
}

function HandleJohnArrival(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pSoldier2: Pointer<SOLDIERTYPE> = null;
  let sDist: INT16;

  if (!pSoldier) {
    pSoldier = FindSoldierByProfileID(Enum268.JOHN, true);
    if (!pSoldier) {
      return;
    }
  }

  if (PythSpacesAway(pSoldier.value.sGridNo, 8228) < 40) {
    if (ClosestPC(pSoldier, addressof(sDist)) != NOWHERE && sDist > NPC_TALK_RADIUS * 2) {
      // too far away
      return;
    }

    if (CheckFact(Enum170.FACT_MARY_ALIVE, 0)) {
      pSoldier2 = FindSoldierByProfileID(Enum268.MARY, false);
      if (pSoldier2) {
        if (PythSpacesAway(pSoldier.value.sGridNo, pSoldier2.value.sGridNo) > 8) {
          // too far away!
          return;
        }
      }
    }

    SetFactTrue(Enum170.FACT_MARY_OR_JOHN_ARRIVED);

    EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);

    // if Mary is alive/dead
    if (pSoldier2) {
      EVENT_StopMerc(pSoldier2, pSoldier2.value.sGridNo, pSoldier2.value.bDirection);
      TriggerNPCRecord(Enum268.JOHN, 13);
    } else {
      TriggerNPCRecord(Enum268.JOHN, 12);
    }
  }
}

function HandleAtNewGridNo(pSoldier: Pointer<SOLDIERTYPE>, pfKeepMoving: Pointer<boolean>): boolean {
  let sMineGridNo: INT16;
  let ubVolume: UINT8;

  // ATE; Handle bad guys, as they fade, to cancel it if
  // too long...
  // ONLY if fading IN!
  if (pSoldier.value.fBeginFade == 1) {
    if (pSoldier.value.sLocationOfFadeStart != pSoldier.value.sGridNo) {
      // Turn off
      pSoldier.value.fBeginFade = false;

      if (pSoldier.value.bLevel > 0 && gpWorldLevelData[pSoldier.value.sGridNo].pRoofHead != null) {
        pSoldier.value.ubFadeLevel = gpWorldLevelData[pSoldier.value.sGridNo].pRoofHead.value.ubShadeLevel;
      } else {
        pSoldier.value.ubFadeLevel = gpWorldLevelData[pSoldier.value.sGridNo].pLandHead.value.ubShadeLevel;
      }

      // Set levelnode shade level....
      if (pSoldier.value.pLevelNode) {
        pSoldier.value.pLevelNode.value.ubShadeLevel = pSoldier.value.ubFadeLevel;
      }
      pSoldier.value.bVisible = -1;
    }
  }

  if (gTacticalStatus.uiFlags & INCOMBAT) {
    HandleLocateToGuyAsHeWalks(pSoldier);
  }

  // Default to TRUE
  (pfKeepMoving.value) = true;

  pSoldier.value.bTilesMoved++;
  if (pSoldier.value.usAnimState == Enum193.RUNNING) {
    // count running as double
    pSoldier.value.bTilesMoved++;
  }

  // First if we are in realtime combat or noncombat
  if ((gTacticalStatus.uiFlags & REALTIME) || !(gTacticalStatus.uiFlags & INCOMBAT)) {
    // Update value for RT breath update
    pSoldier.value.ubTilesMovedPerRTBreathUpdate++;
    // Update last anim
    pSoldier.value.usLastMovementAnimPerRTBreathUpdate = pSoldier.value.usAnimState;
  }

  // Update path if showing path in RT
  if (gGameSettings.fOptions[Enum8.TOPTION_ALWAYS_SHOW_MOVEMENT_PATH]) {
    if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
      gfPlotNewMovement = true;
    }
  }

  // ATE: Put some stuff in here to not handle certain things if we are
  // trversing...
  if (gubWaitingForAllMercsToExitCode == Enum238.WAIT_FOR_MERCS_TO_WALKOFF_SCREEN || gubWaitingForAllMercsToExitCode == Enum238.WAIT_FOR_MERCS_TO_WALK_TO_GRIDNO) {
    return true;
  }

  // Check if they are out of breath
  if (CheckForBreathCollapse(pSoldier)) {
    (pfKeepMoving.value) = true;
    return false;
  }

  // see if a mine gets set off...
  if (SetOffBombsInGridNo(pSoldier.value.ubID, pSoldier.value.sGridNo, false, pSoldier.value.bLevel)) {
    (pfKeepMoving.value) = false;
    EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
    return false;
  }

  // Set "interrupt occurred" flag to false so that we will know whether *this
  // particular call* to HandleSight caused an interrupt
  gTacticalStatus.fInterruptOccurred = false;

  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    ubVolume = MovementNoise(pSoldier);
    if (ubVolume > 0) {
      MakeNoise(pSoldier.value.ubID, pSoldier.value.sGridNo, pSoldier.value.bLevel, pSoldier.value.bOverTerrainType, ubVolume, Enum236.NOISE_MOVEMENT);
      if ((pSoldier.value.uiStatusFlags & SOLDIER_PC) && (pSoldier.value.bStealthMode)) {
        PlayStealthySoldierFootstepSound(pSoldier);
      }
    }
  }

  // ATE: Make sure we don't make another interrupt...
  if (!gTacticalStatus.fInterruptOccurred) {
    // Handle New sight
    HandleSight(pSoldier, SIGHT_LOOK | SIGHT_RADIO | SIGHT_INTERRUPT);
  }

  // ATE: Check if we have sighted anyone, if so, don't do anything else...
  // IN other words, we have stopped from sighting...
  if (gTacticalStatus.fInterruptOccurred) {
    // Unset no APs value
    AdjustNoAPToFinishMove(pSoldier, true);

    (pfKeepMoving.value) = false;
    pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
    pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;

    // ATE: Cancel only if our final destination
    if (pSoldier.value.sGridNo == pSoldier.value.sFinalDestination) {
      pSoldier.value.ubPendingAction = NO_PENDING_ACTION;
    }

    // this flag is set only to halt the currently moving guy; reset it now
    gTacticalStatus.fInterruptOccurred = false;

    // ATE: Remove this if we were stopped....
    if (gTacticalStatus.fEnemySightingOnTheirTurn) {
      if (gTacticalStatus.ubEnemySightingOnTheirTurnEnemyID == pSoldier.value.ubID) {
        pSoldier.value.fPauseAllAnimation = false;
        gTacticalStatus.fEnemySightingOnTheirTurn = false;
      }
    }
  } else if (pSoldier.value.fNoAPToFinishMove) {
    (pfKeepMoving.value) = false;
  } else if (pSoldier.value.usPathIndex == pSoldier.value.usPathDataSize && pSoldier.value.usPathDataSize == 0) {
    (pfKeepMoving.value) = false;
  } else if (gTacticalStatus.fEnemySightingOnTheirTurn) {
    // Hault guy!
    AdjustNoAPToFinishMove(pSoldier, true);
    (pfKeepMoving.value) = false;
  }

  // OK, check for other stuff like mines...
  if (NearbyGroundSeemsWrong(pSoldier, pSoldier.value.sGridNo, true, addressof(sMineGridNo))) {
    if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
      // NearbyGroundSeemsWrong returns true with gridno NOWHERE if
      // we find something by metal detector... we should definitely stop
      // but we won't place a locator or say anything

      // IF not in combat, stop them all
      if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
        let cnt2: INT32;
        let pSoldier2: Pointer<SOLDIERTYPE>;

        cnt2 = gTacticalStatus.Team[gbPlayerNum].bLastID;

        // look for all mercs on the same team,
        for (pSoldier2 = MercPtrs[cnt2]; cnt2 >= gTacticalStatus.Team[gbPlayerNum].bFirstID; cnt2--, pSoldier2--) {
          if (pSoldier2.value.bActive) {
            EVENT_StopMerc(pSoldier2, pSoldier2.value.sGridNo, pSoldier2.value.bDirection);
          }
        }
      } else {
        EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
      }

      (pfKeepMoving.value) = false;

      if (sMineGridNo != NOWHERE) {
        LocateGridNo(sMineGridNo);
        // we reuse the boobytrap gridno variable here
        gsBoobyTrapGridNo = sMineGridNo;
        gpBoobyTrapSoldier = pSoldier;
        SetStopTimeQuoteCallback(MineSpottedDialogueCallBack);
        TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_SUSPICIOUS_GROUND);
      }
    } else {
      if (sMineGridNo != NOWHERE) {
        EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
        (pfKeepMoving.value) = false;

        gpWorldLevelData[sMineGridNo].uiFlags |= MAPELEMENT_ENEMY_MINE_PRESENT;

        // better stop and reconsider what to do...
        SetNewSituation(pSoldier);
        ActionDone(pSoldier);
      }
    }
  }

  HandleSystemNewAISituation(pSoldier, false);

  if (pSoldier.value.bTeam == gbPlayerNum) {
    if (pSoldier.value.ubWhatKindOfMercAmI == Enum260.MERC_TYPE__EPC) {
      // are we there yet?
      if (pSoldier.value.sSectorX == 13 && pSoldier.value.sSectorY == MAP_ROW_B && pSoldier.value.bSectorZ == 0) {
        switch (pSoldier.value.ubProfile) {
          case Enum268.SKYRIDER:
            if (PythSpacesAway(pSoldier.value.sGridNo, 8842) < 11) {
              // Skyrider has arrived!
              EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
              SetFactTrue(Enum170.FACT_SKYRIDER_CLOSE_TO_CHOPPER);
              TriggerNPCRecord(Enum268.SKYRIDER, 15);
              SetUpHelicopterForPlayer(13, MAP_ROW_B);
            }
            break;

          case Enum268.MARY:
            HandleMaryArrival(pSoldier);
            break;

          case Enum268.JOHN:
            HandleJohnArrival(pSoldier);
            break;
        }
      } else if (pSoldier.value.ubProfile == Enum268.MARIA && (pSoldier.value.sSectorX == 6 && pSoldier.value.sSectorY == MAP_ROW_C && pSoldier.value.bSectorZ == 0) && CheckFact(Enum170.FACT_MARIA_ESCORTED_AT_LEATHER_SHOP, Enum268.MARIA) == true) {
        // check that Angel is there!
        if (NPCInRoom(Enum268.ANGEL, 2)) // room 2 is leather shop
        {
          //	UnRecruitEPC( MARIA );
          TriggerNPCRecord(Enum268.ANGEL, 12);
        }
      } else if ((pSoldier.value.ubProfile == Enum268.JOEY) && (pSoldier.value.sSectorX == 8 && pSoldier.value.sSectorY == MAP_ROW_G && pSoldier.value.bSectorZ == 0)) {
        // if Joey walks near Martha then trigger Martha record 7
        if (CheckFact(Enum170.FACT_JOEY_NEAR_MARTHA, 0)) {
          EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);
          TriggerNPCRecord(Enum268.JOEY, 9);
        }
      }
    }
    // Drassen stuff for John & Mary
    else if (gubQuest[Enum169.QUEST_ESCORT_TOURISTS] == QUESTINPROGRESS && pSoldier.value.sSectorX == 13 && pSoldier.value.sSectorY == MAP_ROW_B && pSoldier.value.bSectorZ == 0) {
      if (CheckFact(Enum170.FACT_JOHN_ALIVE, 0)) {
        HandleJohnArrival(null);
      } else {
        HandleMaryArrival(null);
      }
    }
  } else if (pSoldier.value.bTeam == CIV_TEAM && pSoldier.value.ubProfile != NO_PROFILE && pSoldier.value.bNeutral) {
    switch (pSoldier.value.ubProfile) {
      case Enum268.JIM:
      case Enum268.JACK:
      case Enum268.OLAF:
      case Enum268.RAY:
      case Enum268.OLGA:
      case Enum268.TYRONE: {
        let sDesiredMercDist: INT16;

        if (ClosestPC(pSoldier, addressof(sDesiredMercDist)) != NOWHERE) {
          if (sDesiredMercDist <= NPC_TALK_RADIUS * 2) {
            // stop
            CancelAIAction(pSoldier, true);
            // aaaaaaaaaaaaaaaaaaaaatttaaaack!!!!
            AddToShouldBecomeHostileOrSayQuoteList(pSoldier.value.ubID);
            // MakeCivHostile( pSoldier, 2 );
            // TriggerNPCWithIHateYouQuote( pSoldier->ubProfile );
          }
        }
      } break;
      default:
        break;
    }
  }
  return true;
}

export function SelectNextAvailSoldier(pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let fSoldierFound: boolean = false;

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if (OK_CONTROLLABLE_MERC(pTeamSoldier)) {
      fSoldierFound = true;
      break;
    }
  }

  if (fSoldierFound) {
    SelectSoldier(cnt, false, false);
  } else {
    gusSelectedSoldier = NO_SOLDIER;
    // Change UI mode to reflact that we are selected
    guiPendingOverrideEvent = Enum207.I_ON_TERRAIN;
  }
}

export function InternalSelectSoldier(usSoldierID: UINT16, fAcknowledge: boolean, fForceReselect: boolean, fFromUI: boolean): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pOldSoldier: Pointer<SOLDIERTYPE>;

  // ARM: can't call SelectSoldier() in mapscreen, that will initialize interface panels!!!
  // ATE: Adjusted conditions a bit ( sometimes were not getting selected )
  if (guiCurrentScreen == Enum26.LAPTOP_SCREEN || guiCurrentScreen == Enum26.MAP_SCREEN) {
    return;
  }

  if (usSoldierID == NOBODY) {
    return;
  }

  // if we are in the shop keeper interface
  if (guiTacticalInterfaceFlags & INTERFACE_SHOPKEEP_INTERFACE) {
    // dont allow the player to change the selected merc
    return;
  }

  // Get guy
  pSoldier = MercPtrs[usSoldierID];

  // If we are dead, ignore
  if (!OK_CONTROLLABLE_MERC(pSoldier)) {
    return;
  }

  // Don't do it if we don't have an interrupt
  if (!OK_INTERRUPT_MERC(pSoldier)) {
    // OK, we want to display message that we can't....
    if (fFromUI) {
      ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.MERC_IS_UNAVAILABLE_STR], pSoldier.value.name);
    }
    return;
  }

  if (pSoldier.value.ubID == gusSelectedSoldier) {
    if (!fForceReselect) {
      return;
    }
  }

  // CANCEL FROM PLANNING MODE!
  if (InUIPlanMode()) {
    EndUIPlan();
  }

  // Unselect old selected guy
  if (gusSelectedSoldier != NO_SOLDIER) {
    // Get guy
    pOldSoldier = MercPtrs[gusSelectedSoldier];
    pOldSoldier.value.fShowLocator = false;
    pOldSoldier.value.fFlashLocator = false;

    // DB This used to say pSoldier... I fixed it
    if (pOldSoldier.value.bLevel == 0) {
      // ConcealWalls((INT16)(pSoldier->dXPos/CELL_X_SIZE), (INT16)(pSoldier->dYPos/CELL_Y_SIZE), REVEAL_WALLS_RADIUS);
      //	ApplyTranslucencyToWalls((INT16)(pOldSoldier->dXPos/CELL_X_SIZE), (INT16)(pOldSoldier->dYPos/CELL_Y_SIZE));
      // LightHideTrees((INT16)(pOldSoldier->dXPos/CELL_X_SIZE), (INT16)(pOldSoldier->dYPos/CELL_Y_SIZE));
    }
    // DeleteSoldierLight( pOldSoldier );

    if (pOldSoldier.value.uiStatusFlags & SOLDIER_GREEN_RAY) {
      LightHideRays((pOldSoldier.value.dXPos / CELL_X_SIZE), (pOldSoldier.value.dYPos / CELL_Y_SIZE));
      pOldSoldier.value.uiStatusFlags &= (~SOLDIER_GREEN_RAY);
    }

    UpdateForContOverPortrait(pOldSoldier, false);
  }

  gusSelectedSoldier = usSoldierID;

  // find which squad this guy is, then set selected squad to this guy
  SetCurrentSquad(pSoldier.value.bAssignment, false);

  if (pSoldier.value.bLevel == 0) {
    // RevealWalls((INT16)(pSoldier->dXPos/CELL_X_SIZE), (INT16)(pSoldier->dYPos/CELL_Y_SIZE), REVEAL_WALLS_RADIUS);
    //	CalcTranslucentWalls((INT16)(pSoldier->dXPos/CELL_X_SIZE), (INT16)(pSoldier->dYPos/CELL_Y_SIZE));
    // LightTranslucentTrees((INT16)(pSoldier->dXPos/CELL_X_SIZE), (INT16)(pSoldier->dYPos/CELL_Y_SIZE));
  }

  // SetCheckSoldierLightFlag( pSoldier );

  // Set interface to reflect new selection!
  SetCurrentTacticalPanelCurrentMerc(usSoldierID);

  // PLay ATTN SOUND
  if (fAcknowledge) {
    if (!gGameSettings.fOptions[Enum8.TOPTION_MUTE_CONFIRMATIONS])
      DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_ATTN1);
  }

  // Change UI mode to reflact that we are selected
  // NOT if we are locked inthe UI
  if (gTacticalStatus.ubCurrentTeam == OUR_TEAM && gCurrentUIMode != Enum206.LOCKUI_MODE && gCurrentUIMode != Enum206.LOCKOURTURN_UI_MODE) {
    guiPendingOverrideEvent = Enum207.M_ON_TERRAIN;
  }

  ChangeInterfaceLevel(pSoldier.value.bLevel);

  if (pSoldier.value.fMercAsleep) {
    PutMercInAwakeState(pSoldier);
  }

  // possibly say personality quote
  if ((pSoldier.value.bTeam == gbPlayerNum) && (pSoldier.value.ubProfile != NO_PROFILE && pSoldier.value.ubWhatKindOfMercAmI != Enum260.MERC_TYPE__PLAYER_CHARACTER) && !(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_PERSONALITY)) {
    switch (gMercProfiles[pSoldier.value.ubProfile].bPersonalityTrait) {
      case Enum270.PSYCHO:
        if (Random(50) == 0) {
          TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_PERSONALITY_TRAIT);
          pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_PERSONALITY;
        }
        break;
      default:
        break;
    }
  }

  UpdateForContOverPortrait(pSoldier, true);

  // Remove any interactive tiles we could be over!
  BeginCurInteractiveTileCheck(INTILE_CHECK_SELECTIVE);
}

export function SelectSoldier(usSoldierID: UINT16, fAcknowledge: boolean, fForceReselect: boolean): void {
  InternalSelectSoldier(usSoldierID, fAcknowledge, fForceReselect, false);
}

function ResetAllAnimationCache(): boolean {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Loop through all mercs and make go
  for (pSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pSoldier++, cnt++) {
    if (pSoldier != null) {
      InitAnimationCache(cnt, addressof(pSoldier.value.AnimCache));
    }
  }

  return true;
}

export function LocateSoldier(usID: UINT16, fSetLocator: boolean): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sNewCenterWorldX: INT16;
  let sNewCenterWorldY: INT16;

  // if (!bCenter && SoldierOnScreen(usID))
  // return;

  // do we need to move the screen?
  // ATE: Force this baby to locate if told to
  if (!SoldierOnScreen(usID) || fSetLocator == 10) {
    // Get pointer of soldier
    pSoldier = MercPtrs[usID];

    // Center on guy
    sNewCenterWorldX = pSoldier.value.dXPos;
    sNewCenterWorldY = pSoldier.value.dYPos;

    SetRenderCenter(sNewCenterWorldX, sNewCenterWorldY);

    // Plot new path!
    gfPlotNewMovement = true;
  }

  // do we flash the name & health bars/health string above?
  if (fSetLocator) {
    if (fSetLocator == SETLOCATOR || fSetLocator == 10) {
      ShowRadioLocator(usID, SHOW_LOCATOR_NORMAL);
    } else {
      ShowRadioLocator(usID, SHOW_LOCATOR_FAST);
    }
  }
}

export function InternalLocateGridNo(sGridNo: UINT16, fForce: boolean): void {
  let sNewCenterWorldX: INT16;
  let sNewCenterWorldY: INT16;

  ConvertGridNoToCenterCellXY(sGridNo, addressof(sNewCenterWorldX), addressof(sNewCenterWorldY));

  // FIRST CHECK IF WE ARE ON SCREEN
  if (GridNoOnScreen(sGridNo) && !fForce) {
    return;
  }

  SetRenderCenter(sNewCenterWorldX, sNewCenterWorldY);
}

export function LocateGridNo(sGridNo: UINT16): void {
  InternalLocateGridNo(sGridNo, false);
}

export function SlideTo(sGridno: INT16, usSoldierID: UINT16, usReasonID: UINT16, fSetLocator: boolean): void {
  let cnt: INT32;

  if (usSoldierID == NOBODY) {
    return;
  }

  if (fSetLocator == SETANDREMOVEPREVIOUSLOCATOR) {
    for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
      if (MercPtrs[cnt].value.bActive && MercPtrs[cnt].value.bInSector) {
        // Remove all existing locators...
        MercPtrs[cnt].value.fFlashLocator = false;
      }
    }
  }

  // Locate even if on screen
  if (fSetLocator)
    ShowRadioLocator(usSoldierID, SHOW_LOCATOR_NORMAL);

  // FIRST CHECK IF WE ARE ON SCREEN
  if (GridNoOnScreen(MercPtrs[usSoldierID].value.sGridNo)) {
    return;
  }

  // sGridNo here for DG compatibility
  gTacticalStatus.sSlideTarget = MercPtrs[usSoldierID].value.sGridNo;
  gTacticalStatus.sSlideReason = usReasonID;

  // Plot new path!
  gfPlotNewMovement = true;
}

export function SlideToLocation(usReasonID: UINT16, sDestGridNo: INT16): void {
  if (sDestGridNo == NOWHERE) {
    return;
  }

  // FIRST CHECK IF WE ARE ON SCREEN
  if (GridNoOnScreen(sDestGridNo)) {
    return;
  }

  // sGridNo here for DG compatibility
  gTacticalStatus.sSlideTarget = sDestGridNo;
  gTacticalStatus.sSlideReason = usReasonID;

  // Plot new path!
  gfPlotNewMovement = true;
}

export function RebuildAllSoldierShadeTables(): void {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // Loop through all mercs and make go
  for (pSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pSoldier++, cnt++) {
    if (pSoldier.value.bActive) {
      CreateSoldierPalettes(pSoldier);
    }
  }
}

export function HandlePlayerTeamMemberDeath(pSoldier: Pointer<SOLDIERTYPE>): void {
  let cnt: INT32;
  let iNewSelectedSoldier: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let fMissionFailed: boolean = true;
  let bBuddyIndex: INT8;

  VerifyPublicOpplistDueToDeath(pSoldier);

  ReceivingSoldierCancelServices(pSoldier);

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bLife >= OKLIFE && pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
      iNewSelectedSoldier = cnt;
      fMissionFailed = false;
      break;
    }
  }

  if (!fMissionFailed) {
    if (gTacticalStatus.fAutoBandageMode) {
      if (pSoldier.value.ubAutoBandagingMedic != NOBODY) {
        CancelAIAction(MercPtrs[pSoldier.value.ubAutoBandagingMedic], true);
      }
    }

    // see if this was the friend of a living merc
    cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;
    for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[pSoldier.value.bTeam].bLastID; cnt++, pTeamSoldier++) {
      if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bLife >= OKLIFE) {
        bBuddyIndex = WhichBuddy(pTeamSoldier.value.ubProfile, pSoldier.value.ubProfile);
        switch (bBuddyIndex) {
          case 0:
            // buddy #1 died!
            TacticalCharacterDialogue(pTeamSoldier, Enum202.QUOTE_BUDDY_ONE_KILLED);
            break;
          case 1:
            // buddy #2 died!
            TacticalCharacterDialogue(pTeamSoldier, Enum202.QUOTE_BUDDY_TWO_KILLED);
            break;
          case 2:
            // learn to like buddy died!
            TacticalCharacterDialogue(pTeamSoldier, Enum202.QUOTE_LEARNED_TO_LIKE_MERC_KILLED);
            break;
          default:
            break;
        }
      }
    }

    // handle stuff for Carmen if Slay is killed
    switch (pSoldier.value.ubProfile) {
      case Enum268.SLAY:
        pTeamSoldier = FindSoldierByProfileID(Enum268.CARMEN, false);
        if (pTeamSoldier && pTeamSoldier.value.bAttitude == Enum242.ATTACKSLAYONLY && ClosestPC(pTeamSoldier, null) != NOWHERE) {
          // Carmen now becomes friendly again
          TriggerNPCRecord(Enum268.CARMEN, 29);
        }
        break;
      case Enum268.ROBOT:
        if (CheckFact(Enum170.FACT_FIRST_ROBOT_DESTROYED, 0) == false) {
          SetFactTrue(Enum170.FACT_FIRST_ROBOT_DESTROYED);
          SetFactFalse(Enum170.FACT_ROBOT_READY);
        } else {
          SetFactTrue(Enum170.FACT_SECOND_ROBOT_DESTROYED);
        }
        break;
    }
  }

  // Make a call to handle the strategic things, such as Life Insurance, record it in history file etc.
  StrategicHandlePlayerTeamMercDeath(pSoldier);

  CheckForEndOfBattle(false);

  if (gusSelectedSoldier == pSoldier.value.ubID) {
    if (!fMissionFailed) {
      SelectSoldier(iNewSelectedSoldier, false, false);
    } else {
      gusSelectedSoldier = NO_SOLDIER;
      // Change UI mode to reflact that we are selected
      guiPendingOverrideEvent = Enum207.I_ON_TERRAIN;
    }
  }
}

export function HandleNPCTeamMemberDeath(pSoldierOld: Pointer<SOLDIERTYPE>): void {
  let pKiller: Pointer<SOLDIERTYPE> = null;
  let bVisible: boolean;

  pSoldierOld.value.uiStatusFlags |= SOLDIER_DEAD;
  bVisible = pSoldierOld.value.bVisible;

  VerifyPublicOpplistDueToDeath(pSoldierOld);

  if (pSoldierOld.value.ubProfile != NO_PROFILE) {
    // mark as dead!
    gMercProfiles[pSoldierOld.value.ubProfile].bMercStatus = MERC_IS_DEAD;
    //
    gMercProfiles[pSoldierOld.value.ubProfile].bLife = 0;

    if (!(pSoldierOld.value.uiStatusFlags & SOLDIER_VEHICLE) && !TANK(pSoldierOld)) {
      if (pSoldierOld.value.ubAttackerID != NOBODY) {
        pKiller = MercPtrs[pSoldierOld.value.ubAttackerID];
      }
      if (pKiller && pKiller.value.bTeam == OUR_TEAM) {
        AddHistoryToPlayersLog(Enum83.HISTORY_MERC_KILLED_CHARACTER, pSoldierOld.value.ubProfile, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
      } else {
        AddHistoryToPlayersLog(Enum83.HISTORY_NPC_KILLED, pSoldierOld.value.ubProfile, GetWorldTotalMin(), gWorldSectorX, gWorldSectorY);
      }
    }
  }

  if (pSoldierOld.value.bTeam == CIV_TEAM) {
    let pOther: Pointer<SOLDIERTYPE>;

    // ATE: Added string to player
    if (bVisible != -1 && pSoldierOld.value.ubProfile != NO_PROFILE) {
      ScreenMsg(FONT_RED, MSG_INTERFACE, pMercDeadString[0], pSoldierOld.value.name);
    }

    switch (pSoldierOld.value.ubProfile) {
      case Enum268.BRENDA:
        SetFactTrue(Enum170.FACT_BRENDA_DEAD);
        {
          pOther = FindSoldierByProfileID(Enum268.HANS, false);
          if (pOther && pOther.value.bLife >= OKLIFE && pOther.value.bNeutral && (SpacesAway(pSoldierOld.value.sGridNo, pOther.value.sGridNo) <= 12)) {
            TriggerNPCRecord(Enum268.HANS, 10);
          }
        }
        break;
      case Enum268.PABLO:
        AddFutureDayStrategicEvent(Enum132.EVENT_SECOND_AIRPORT_ATTENDANT_ARRIVED, 480 + Random(60), 0, 1);
        break;
      case Enum268.ROBOT:
        if (CheckFact(Enum170.FACT_FIRST_ROBOT_DESTROYED, 0) == false) {
          SetFactTrue(Enum170.FACT_FIRST_ROBOT_DESTROYED);
        } else {
          SetFactTrue(Enum170.FACT_SECOND_ROBOT_DESTROYED);
        }
        break;
      case Enum268.DRUGGIST:
      case Enum268.SLAY:
      case Enum268.ANNIE:
      case Enum268.CHRIS:
      case Enum268.TIFFANY:
      case Enum268.T_REX:
        MakeRemainingTerroristsTougher();
        if (pSoldierOld.value.ubProfile == Enum268.DRUGGIST) {
          pOther = FindSoldierByProfileID(Enum268.MANNY, 0);
          if (pOther && pOther.value.bActive && pOther.value.bInSector && pOther.value.bLife >= OKLIFE) {
            // try to make sure he isn't cowering etc
            pOther.value.sNoiseGridno = NOWHERE;
            pOther.value.bAlertStatus = Enum243.STATUS_GREEN;
            TriggerNPCRecord(Enum268.MANNY, 10);
          }
        }
        break;
      case Enum268.JIM:
      case Enum268.JACK:
      case Enum268.OLAF:
      case Enum268.RAY:
      case Enum268.OLGA:
      case Enum268.TYRONE:
        MakeRemainingAssassinsTougher();
        break;

      case Enum268.ELDIN:
        // the security guard...  Results in an extra loyalty penalty for Balime (in addition to civilian murder)

        /* Delayed loyalty effects elimininated.  Sep.12/98.  ARM
                                        // create the event value, for town BALIME
                                        uiLoyaltyValue = BuildLoyaltyEventValue( BALIME, LOYALTY_PENALTY_ELDIN_KILLED, FALSE );
                                        // post the event, 30 minute delay
                                        AddStrategicEvent( EVENT_TOWN_LOYALTY_UPDATE, GetWorldTotalMin() + 30, uiLoyaltyValue );
        */
        DecrementTownLoyalty(Enum135.BALIME, LOYALTY_PENALTY_ELDIN_KILLED);
        break;
      case Enum268.JOEY:
        // check to see if Martha can see this
        pOther = FindSoldierByProfileID(Enum268.MARTHA, false);
        if (pOther && (PythSpacesAway(pOther.value.sGridNo, pSoldierOld.value.sGridNo) < 10 || SoldierToSoldierLineOfSightTest(pOther, pSoldierOld, MaxDistanceVisible(), true) != 0)) {
          // Martha has a heart attack and croaks
          TriggerNPCRecord(Enum268.MARTHA, 17);

          /* Delayed loyalty effects elimininated.  Sep.12/98.  ARM
                                                  // create the event value, for town CAMBRIA
                                                  uiLoyaltyValue = BuildLoyaltyEventValue( CAMBRIA, LOYALTY_PENALTY_MARTHA_HEART_ATTACK, FALSE );
                                                  // post the event, 30 minute delay
                                                  AddStrategicEvent( EVENT_TOWN_LOYALTY_UPDATE, GetWorldTotalMin() + 30, uiLoyaltyValue );
          */
          DecrementTownLoyalty(Enum135.CAMBRIA, LOYALTY_PENALTY_MARTHA_HEART_ATTACK);
        } else // Martha doesn't see it.  She lives, but Joey is found a day or so later anyways
        {
          /*
                                                  // create the event value, for town CAMBRIA
                                                  uiLoyaltyValue = BuildLoyaltyEventValue( CAMBRIA, LOYALTY_PENALTY_JOEY_KILLED, FALSE );
                                                  // post the event, 30 minute delay
                                                  AddStrategicEvent( EVENT_TOWN_LOYALTY_UPDATE, GetWorldTotalMin() + ( ( 12 + Random(13)) * 60 ), uiLoyaltyValue );
          */
          DecrementTownLoyalty(Enum135.CAMBRIA, LOYALTY_PENALTY_JOEY_KILLED);
        }
        break;
      case Enum268.DYNAMO:
        // check to see if dynamo quest is on
        if (gubQuest[Enum169.QUEST_FREE_DYNAMO] == QUESTINPROGRESS) {
          EndQuest(Enum169.QUEST_FREE_DYNAMO, pSoldierOld.value.sSectorX, pSoldierOld.value.sSectorY);
        }
        break;
      case Enum268.KINGPIN:
        // check to see if Kingpin money quest is on
        if (gubQuest[Enum169.QUEST_KINGPIN_MONEY] == QUESTINPROGRESS) {
          EndQuest(Enum169.QUEST_KINGPIN_MONEY, pSoldierOld.value.sSectorX, pSoldierOld.value.sSectorY);
          HandleNPCDoAction(Enum268.KINGPIN, Enum213.NPC_ACTION_GRANT_EXPERIENCE_3, 0);
        }
        SetFactTrue(Enum170.FACT_KINGPIN_DEAD);
        ExecuteStrategicAIAction(Enum173.STRATEGIC_AI_ACTION_KINGPIN_DEAD, 0, 0);
        break;
      case Enum268.DOREEN:
        // Doreen's dead
        if (CheckFact(Enum170.FACT_DOREEN_HAD_CHANGE_OF_HEART, 0)) {
          // tsk tsk, player killed her after getting her to reconsider, lose the bonus for sparing her
          DecrementTownLoyalty(Enum135.DRASSEN, LOYALTY_BONUS_CHILDREN_FREED_DOREEN_SPARED);
        } // then get the points for freeing the kids though killing her
        IncrementTownLoyalty(Enum135.DRASSEN, LOYALTY_BONUS_CHILDREN_FREED_DOREEN_KILLED);
        // set the fact true so we have a universal check for whether the kids can go
        SetFactTrue(Enum170.FACT_DOREEN_HAD_CHANGE_OF_HEART);
        EndQuest(Enum169.QUEST_FREE_CHILDREN, gWorldSectorX, gWorldSectorY);
        if (CheckFact(Enum170.FACT_KIDS_ARE_FREE, 0) == false) {
          HandleNPCDoAction(Enum268.DOREEN, Enum213.NPC_ACTION_FREE_KIDS, 0);
        }
        break;
    }

    // Are we looking at the queen?
    if (pSoldierOld.value.ubProfile == Enum268.QUEEN) {
      if (pSoldierOld.value.ubAttackerID != NOBODY) {
        pKiller = MercPtrs[pSoldierOld.value.ubAttackerID];
      }

      BeginHandleDeidrannaDeath(pKiller, pSoldierOld.value.sGridNo, pSoldierOld.value.bLevel);
    }

    // crows/cows are on the civilian team, but none of the following applies to them
    if ((pSoldierOld.value.ubBodyType != Enum194.CROW) && (pSoldierOld.value.ubBodyType != Enum194.COW)) {
      // If the civilian's killer is known
      if (pSoldierOld.value.ubAttackerID != NOBODY) {
        // handle death of civilian..and if it was intentional
        HandleMurderOfCivilian(pSoldierOld, pSoldierOld.value.fIntendedTarget);
      }
    }
  } else if (pSoldierOld.value.bTeam == MILITIA_TEAM) {
    let bMilitiaRank: INT8;

    bMilitiaRank = SoldierClassToMilitiaRank(pSoldierOld.value.ubSoldierClass);

    if (bMilitiaRank != -1) {
      // remove this militia from the strategic records
      StrategicRemoveMilitiaFromSector(gWorldSectorX, gWorldSectorY, bMilitiaRank, 1);
    }

    // If the militia's killer is known
    if (pSoldierOld.value.ubAttackerID != NOBODY) {
      // also treat this as murder - but player will never be blamed for militia death he didn't cause
      HandleMurderOfCivilian(pSoldierOld, pSoldierOld.value.fIntendedTarget);
    }

    HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_NATIVE_KILLED, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
  } else // enemies and creatures... should any of this stuff not be called if a creature dies?
  {
    if (pSoldierOld.value.ubBodyType == Enum194.QUEENMONSTER) {
      let pKiller: Pointer<SOLDIERTYPE> = null;

      if (pSoldierOld.value.ubAttackerID != NOBODY) {
        pKiller = MercPtrs[pSoldierOld.value.ubAttackerID];

        BeginHandleQueenBitchDeath(pKiller, pSoldierOld.value.sGridNo, pSoldierOld.value.bLevel);
      }
    }

    if (pSoldierOld.value.bTeam == ENEMY_TEAM) {
      gTacticalStatus.ubArmyGuysKilled++;
      TrackEnemiesKilled(Enum189.ENEMY_KILLED_IN_TACTICAL, pSoldierOld.value.ubSoldierClass);
    }
    // If enemy guy was killed by the player, give morale boost to player's team!
    if (pSoldierOld.value.ubAttackerID != NOBODY && MercPtrs[pSoldierOld.value.ubAttackerID].value.bTeam == gbPlayerNum) {
      HandleMoraleEvent(MercPtrs[pSoldierOld.value.ubAttackerID], Enum234.MORALE_KILLED_ENEMY, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    }

    HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_ENEMY_KILLED, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

    CheckForAlertWhenEnemyDies(pSoldierOld);

    if (gTacticalStatus.ubTheChosenOne == pSoldierOld.value.ubID) {
      // reset the chosen one!
      gTacticalStatus.ubTheChosenOne = NOBODY;
    }

    if (pSoldierOld.value.ubProfile == Enum268.QUEEN) {
      HandleMoraleEvent(null, Enum234.MORALE_DEIDRANNA_KILLED, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      MaximizeLoyaltyForDeidrannaKilled();
    } else if (pSoldierOld.value.ubBodyType == Enum194.QUEENMONSTER) {
      HandleMoraleEvent(null, Enum234.MORALE_MONSTER_QUEEN_KILLED, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      IncrementTownLoyaltyEverywhere(LOYALTY_BONUS_KILL_QUEEN_MONSTER);

      // Grant experience gain.....
      HandleNPCDoAction(0, Enum213.NPC_ACTION_GRANT_EXPERIENCE_5, 0);
    }
  }

  // killing crows/cows is not worth any experience!
  if ((pSoldierOld.value.ubBodyType != Enum194.CROW) && (pSoldierOld.value.ubBodyType != Enum194.COW) && pSoldierOld.value.ubLastDamageReason != TAKE_DAMAGE_BLOODLOSS) {
    let ubAssister: UINT8;

    // if it was a kill by a player's merc
    if (pSoldierOld.value.ubAttackerID != NOBODY && MercPtrs[pSoldierOld.value.ubAttackerID].value.bTeam == gbPlayerNum) {
      // EXPERIENCE CLASS GAIN:  Earned a kill
      StatChange(MercPtrs[pSoldierOld.value.ubAttackerID], EXPERAMT, (10 * pSoldierOld.value.bExpLevel), false);
    }

    // JA2 Gold: if previous and current attackers are the same, the next-to-previous attacker gets the assist
    if (pSoldierOld.value.ubPreviousAttackerID == pSoldierOld.value.ubAttackerID) {
      ubAssister = pSoldierOld.value.ubNextToPreviousAttackerID;
    } else {
      ubAssister = pSoldierOld.value.ubPreviousAttackerID;
    }

    // if it was assisted by a player's merc
    if (ubAssister != NOBODY && MercPtrs[ubAssister].value.bTeam == gbPlayerNum) {
      // EXPERIENCE CLASS GAIN:  Earned an assist
      StatChange(MercPtrs[ubAssister], EXPERAMT, (5 * pSoldierOld.value.bExpLevel), false);
    }
  }

  if (pSoldierOld.value.ubAttackerID != NOBODY && MercPtrs[pSoldierOld.value.ubAttackerID].value.bTeam == MILITIA_TEAM) {
    MercPtrs[pSoldierOld.value.ubAttackerID].value.ubMilitiaKills++;
  }

  // if the NPC is a dealer, add the dealers items to the ground
  AddDeadArmsDealerItemsToWorld(pSoldierOld.value.ubProfile);

  // The queen AI layer must process the event by subtracting forces, etc.
  ProcessQueenCmdImplicationsOfDeath(pSoldierOld);

  // OK, check for existence of any more badguys!
  CheckForEndOfBattle(false);
}

function LastActiveTeamMember(ubTeam: UINT8): UINT8 {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  cnt = gTacticalStatus.Team[ubTeam].bLastID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt >= gTacticalStatus.Team[ubTeam].bFirstID; cnt--, pSoldier--) {
    if (pSoldier.value.bActive) {
      return cnt;
    }
  }

  return gTacticalStatus.Team[ubTeam].bLastID;
}

export function CheckForPotentialAddToBattleIncrement(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Check if we are a threat!
  if (!pSoldier.value.bNeutral && (pSoldier.value.bSide != gbPlayerNum)) {
    // if ( FindObjClass( pSoldier, IC_WEAPON ) != NO_SLOT )
    // We need to exclude cases where a kid is not neutral anymore, but is defenceless!
    if (pSoldier.value.bTeam == CIV_TEAM) {
      // maybe increment num enemy attacked
      switch (pSoldier.value.ubCivilianGroup) {
        case Enum246.REBEL_CIV_GROUP:
        case Enum246.KINGPIN_CIV_GROUP:
        case Enum246.HICKS_CIV_GROUP:
          if (FindObjClass(pSoldier, IC_WEAPON) != NO_SLOT) {
            gTacticalStatus.bNumFoughtInBattle[pSoldier.value.bTeam]++;
          }
          break;
        default:
          // nope!
          break;
      }
    } else {
      // Increment num enemy attacked
      gTacticalStatus.bNumFoughtInBattle[pSoldier.value.bTeam]++;
    }
  }
}

// internal function for turning neutral to FALSE
export function SetSoldierNonNeutral(pSoldier: Pointer<SOLDIERTYPE>): void {
  pSoldier.value.bNeutral = false;

  if (gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) {
    // Special code for strategic implications
    CalculateNonPersistantPBIInfo();
  }
}

// internal function for turning neutral to TRUE
export function SetSoldierNeutral(pSoldier: Pointer<SOLDIERTYPE>): void {
  pSoldier.value.bNeutral = true;

  if (gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) {
    // Special code for strategic implications
    // search through civ team looking for non-neutral civilian!
    if (!HostileCiviliansPresent()) {
      CalculateNonPersistantPBIInfo();
    }
  }
}
export function MakeCivHostile(pSoldier: Pointer<SOLDIERTYPE>, bNewSide: INT8): void {
  if (pSoldier.value.ubBodyType == Enum194.COW) {
    return;
  }

  // override passed-in value; default is hostile to player, allied to army
  bNewSide = 1;

  switch (pSoldier.value.ubProfile) {
    case Enum268.IRA:
    case Enum268.DIMITRI:
    case Enum268.MIGUEL:
    case Enum268.CARLOS:
    case Enum268.MADLAB:
    case Enum268.DYNAMO:
    case Enum268.SHANK:
      // rebels and rebel sympathizers become hostile to player and enemy
      bNewSide = 2;
      break;
    case Enum268.MARIA:
    case Enum268.ANGEL:
      if (gubQuest[Enum169.QUEST_RESCUE_MARIA] == QUESTINPROGRESS || gubQuest[Enum169.QUEST_RESCUE_MARIA] == QUESTDONE) {
        bNewSide = 2;
      }
      break;
    default:
      switch (pSoldier.value.ubCivilianGroup) {
        case Enum246.REBEL_CIV_GROUP:
          bNewSide = 2;
          break;
        default:
          break;
      }
      break;
  }

  if (!pSoldier.value.bNeutral && bNewSide == pSoldier.value.bSide) {
    // already hostile!
    return;
  }

  if (pSoldier.value.ubProfile == Enum268.CONRAD || pSoldier.value.ubProfile == Enum268.GENERAL) {
    // change to enemy team
    SetSoldierNonNeutral(pSoldier);
    pSoldier.value.bSide = bNewSide;
    pSoldier = ChangeSoldierTeam(pSoldier, ENEMY_TEAM);
  } else {
    if (pSoldier.value.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP) {
      // if Maria is in the sector and escorted, set fact that the escape has
      // been noticed
      if (gubQuest[Enum169.QUEST_RESCUE_MARIA] == QUESTINPROGRESS && gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) {
        let pMaria: Pointer<SOLDIERTYPE> = FindSoldierByProfileID(Enum268.MARIA, false);
        if (pMaria && pMaria.value.bActive && pMaria.value.bInSector) {
          SetFactTrue(Enum170.FACT_MARIA_ESCAPE_NOTICED);
        }
      }
    }
    if (pSoldier.value.ubProfile == Enum268.BILLY) {
      // change orders
      pSoldier.value.bOrders = Enum241.FARPATROL;
    }
    if (bNewSide != -1) {
      pSoldier.value.bSide = bNewSide;
    }
    if (pSoldier.value.bNeutral) {
      SetSoldierNonNeutral(pSoldier);
      RecalculateOppCntsDueToNoLongerNeutral(pSoldier);
    }
  }

  // If we are already in combat...
  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    CheckForPotentialAddToBattleIncrement(pSoldier);
  }
}

export function CivilianGroupMembersChangeSidesWithinProximity(pAttacked: Pointer<SOLDIERTYPE>): UINT8 {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubFirstProfile: UINT8 = NO_PROFILE;
  let cnt: UINT8;

  if (pAttacked.value.ubCivilianGroup == Enum246.NON_CIV_GROUP) {
    return pAttacked.value.ubProfile;
  }

  cnt = gTacticalStatus.Team[CIV_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[CIV_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife && pSoldier.value.bNeutral) {
      if (pSoldier.value.ubCivilianGroup == pAttacked.value.ubCivilianGroup && pSoldier.value.ubBodyType != Enum194.COW) {
        // if in LOS of this guy's attacker
        if ((pAttacked.value.ubAttackerID != NOBODY && pSoldier.value.bOppList[pAttacked.value.ubAttackerID] == SEEN_CURRENTLY) || (PythSpacesAway(pSoldier.value.sGridNo, pAttacked.value.sGridNo) < MaxDistanceVisible()) || (pAttacked.value.ubAttackerID != NOBODY && PythSpacesAway(pSoldier.value.sGridNo, MercPtrs[pAttacked.value.ubAttackerID].value.sGridNo) < MaxDistanceVisible())) {
          MakeCivHostile(pSoldier, 2);
          if (pSoldier.value.bOppCnt > 0) {
            AddToShouldBecomeHostileOrSayQuoteList(pSoldier.value.ubID);
          }

          if (pSoldier.value.ubProfile != NO_PROFILE && pSoldier.value.bOppCnt > 0 && (ubFirstProfile == NO_PROFILE || Random(2))) {
            ubFirstProfile = pSoldier.value.ubProfile;
          }
        }
      }
    }
  }

  return ubFirstProfile;
}

export function CivilianGroupMemberChangesSides(pAttacked: Pointer<SOLDIERTYPE>): Pointer<SOLDIERTYPE> {
  let pNew: Pointer<SOLDIERTYPE>;
  let pNewAttacked: Pointer<SOLDIERTYPE> = pAttacked;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: UINT8;
  let ubFirstProfile: UINT8 = NO_PROFILE;

  if (pAttacked.value.ubCivilianGroup == Enum246.NON_CIV_GROUP) {
    // abort
    return pNewAttacked;
  }

  // remove anyone (rebels) on our team and put them back in the civ team
  cnt = gTacticalStatus.Team[OUR_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[OUR_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife) {
      if (pSoldier.value.ubCivilianGroup == pAttacked.value.ubCivilianGroup) {
        // should become hostile
        if (pSoldier.value.ubProfile != NO_PROFILE && (ubFirstProfile == NO_PROFILE || Random(2))) {
          ubFirstProfile = pSoldier.value.ubProfile;
        }

        pNew = ChangeSoldierTeam(pSoldier, CIV_TEAM);
        if (pSoldier == pAttacked) {
          pNewAttacked = pNew;
        }
      }
    }
  }

  // now change sides for anyone on the civ team within proximity
  if (ubFirstProfile == NO_PROFILE) {
    // get first profile value
    ubFirstProfile = CivilianGroupMembersChangeSidesWithinProximity(pNewAttacked);
  } else {
    // just call
    CivilianGroupMembersChangeSidesWithinProximity(pNewAttacked);
  }

  /*
          if ( ubFirstProfile != NO_PROFILE )
          {
                  TriggerFriendWithHostileQuote( ubFirstProfile );
          }
  */

  if (gTacticalStatus.fCivGroupHostile[pNewAttacked.value.ubCivilianGroup] == CIV_GROUP_NEUTRAL) {
    // if the civilian group turning hostile is the Rebels
    if (pAttacked.value.ubCivilianGroup == Enum246.REBEL_CIV_GROUP) {
      // we haven't already reduced the loyalty back when we first set the flag to BECOME hostile
      ReduceLoyaltyForRebelsBetrayed();
    }

    AddStrategicEvent(Enum132.EVENT_MAKE_CIV_GROUP_HOSTILE_ON_NEXT_SECTOR_ENTRANCE, GetWorldTotalMin() + 300, pNewAttacked.value.ubCivilianGroup);
    gTacticalStatus.fCivGroupHostile[pNewAttacked.value.ubCivilianGroup] = CIV_GROUP_WILL_EVENTUALLY_BECOME_HOSTILE;
  }

  return pNewAttacked;
}

export function CivilianGroupChangesSides(ubCivilianGroup: UINT8): void {
  // change civ group side due to external event (wall blowing up)
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubFirstProfile: UINT8 = NO_PROFILE;

  gTacticalStatus.fCivGroupHostile[ubCivilianGroup] = CIV_GROUP_HOSTILE;

  // now change sides for anyone on the civ team
  cnt = gTacticalStatus.Team[CIV_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[CIV_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife && pSoldier.value.bNeutral) {
      if (pSoldier.value.ubCivilianGroup == ubCivilianGroup && pSoldier.value.ubBodyType != Enum194.COW) {
        MakeCivHostile(pSoldier, 2);
        if (pSoldier.value.bOppCnt > 0) {
          AddToShouldBecomeHostileOrSayQuoteList(pSoldier.value.ubID);
        }
        /*
        if ( (pSoldier->ubProfile != NO_PROFILE) && (pSoldier->bOppCnt > 0) && ( ubFirstProfile == NO_PROFILE || Random( 2 ) ) )
        {
                ubFirstProfile = pSoldier->ubProfile;
        }
        */
      }
    }
  }

  /*
  if ( ubFirstProfile != NO_PROFILE )
  {
          TriggerFriendWithHostileQuote( ubFirstProfile );
  }
  */
}

function HickCowAttacked(pNastyGuy: Pointer<SOLDIERTYPE>, pTarget: Pointer<SOLDIERTYPE>): void {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // now change sides for anyone on the civ team
  cnt = gTacticalStatus.Team[CIV_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[CIV_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife && pSoldier.value.bNeutral && pSoldier.value.ubCivilianGroup == Enum246.HICKS_CIV_GROUP) {
      if (SoldierToSoldierLineOfSightTest(pSoldier, pNastyGuy, MaxDistanceVisible(), true)) {
        CivilianGroupMemberChangesSides(pSoldier);
        break;
      }
    }
  }
}

function MilitiaChangesSides(): void {
  // make all the militia change sides

  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (gTacticalStatus.Team[MILITIA_TEAM].bMenInSector == 0) {
    return;
  }

  // remove anyone (rebels) on our team and put them back in the civ team
  cnt = gTacticalStatus.Team[MILITIA_TEAM].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife) {
      MakeCivHostile(pSoldier, 2);
      RecalculateOppCntsDueToNoLongerNeutral(pSoldier);
    }
  }
}

/*
void MakePotentiallyHostileCivGroupsHostile( void )
{
        UINT8		ubLoop;

        // loop through all civ groups that might become hostile and set them
        // to hostile
        for ( ubLoop = REBEL_CIV_GROUP; ubLoop < NUM_CIV_GROUPS; ubLoop++ )
        {
                if (gTacticalStatus.fCivGroupHostile[ ubLoop ] == CIV_GROUP_WILL_BECOME_HOSTILE)
                {
                        gTacticalStatus.fCivGroupHostile[ ubLoop ] = CIV_GROUP_HOSTILE;
                }
        }
}
*/

function NumActiveAndConsciousTeamMembers(ubTeam: UINT8): INT8 {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let ubCount: UINT8 = 0;

  cnt = gTacticalStatus.Team[ubTeam].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[ubTeam].bLastID; cnt++, pSoldier++) {
    if (OK_CONTROLLABLE_MERC(pSoldier)) {
      ubCount++;
    }
  }

  return ubCount;
}

export function FindNextActiveAndAliveMerc(pSoldier: Pointer<SOLDIERTYPE>, fGoodForLessOKLife: boolean, fOnlyRegularMercs: boolean): UINT8 {
  let bLastTeamID: UINT8;
  let cnt: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  cnt = pSoldier.value.ubID + 1;
  bLastTeamID = gTacticalStatus.Team[pSoldier.value.bTeam].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pTeamSoldier++) {
    if (fOnlyRegularMercs) {
      if (pTeamSoldier.value.bActive && (AM_AN_EPC(pTeamSoldier) || AM_A_ROBOT(pTeamSoldier))) {
        continue;
      }
    }

    if (fGoodForLessOKLife) {
      if (pTeamSoldier.value.bLife > 0 && pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bTeam == gbPlayerNum && pTeamSoldier.value.bAssignment < Enum117.ON_DUTY && OK_INTERRUPT_MERC(pTeamSoldier) && pSoldier.value.bAssignment == pTeamSoldier.value.bAssignment) {
        return cnt;
      }
    } else {
      if (OK_CONTROLLABLE_MERC(pTeamSoldier) && OK_INTERRUPT_MERC(pTeamSoldier) && pSoldier.value.bAssignment == pTeamSoldier.value.bAssignment) {
        return cnt;
      }
    }
  }

  // none found,
  // Now loop back
  cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;
  bLastTeamID = pSoldier.value.ubID;

  for (pTeamSoldier = MercPtrs[cnt]; cnt <= bLastTeamID; cnt++, pTeamSoldier++) {
    if (fOnlyRegularMercs) {
      if (pTeamSoldier.value.bActive && (AM_AN_EPC(pTeamSoldier) || AM_A_ROBOT(pTeamSoldier))) {
        continue;
      }
    }

    if (fGoodForLessOKLife) {
      if (pTeamSoldier.value.bLife > 0 && pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bTeam == gbPlayerNum && pTeamSoldier.value.bAssignment < Enum117.ON_DUTY && OK_INTERRUPT_MERC(pTeamSoldier) && pSoldier.value.bAssignment == pTeamSoldier.value.bAssignment) {
        return cnt;
      }
    } else {
      if (OK_CONTROLLABLE_MERC(pTeamSoldier) && OK_INTERRUPT_MERC(pTeamSoldier) && pSoldier.value.bAssignment == pTeamSoldier.value.bAssignment) {
        return cnt;
      }
    }
  }

  // IF we are here, keep as we always were!
  return pSoldier.value.ubID;
}

export function FindNextActiveSquad(pSoldier: Pointer<SOLDIERTYPE>): Pointer<SOLDIERTYPE> {
  let cnt: INT32;
  let cnt2: INT32;

  for (cnt = pSoldier.value.bAssignment + 1; cnt < Enum275.NUMBER_OF_SQUADS; cnt++) {
    for (cnt2 = 0; cnt2 < NUMBER_OF_SOLDIERS_PER_SQUAD; cnt2++) {
      if (Squad[cnt][cnt2] != null && Squad[cnt][cnt2].value.bInSector && OK_INTERRUPT_MERC(Squad[cnt][cnt2]) && OK_CONTROLLABLE_MERC(Squad[cnt][cnt2]) && !(Squad[cnt][cnt2].value.uiStatusFlags & SOLDIER_VEHICLE)) {
        return Squad[cnt][cnt2];
      }
    }
  }

  // none found,
  // Now loop back
  for (cnt = 0; cnt <= pSoldier.value.bAssignment; cnt++) {
    for (cnt2 = 0; cnt2 < NUMBER_OF_SOLDIERS_PER_SQUAD; cnt2++) {
      if (Squad[cnt][cnt2] != null && Squad[cnt][cnt2].value.bInSector && OK_INTERRUPT_MERC(Squad[cnt][cnt2]) && OK_CONTROLLABLE_MERC(Squad[cnt][cnt2]) && !(Squad[cnt][cnt2].value.uiStatusFlags & SOLDIER_VEHICLE)) {
        return Squad[cnt][cnt2];
      }
    }
  }

  // IF we are here, keep as we always were!
  return pSoldier;
}

export function FindPrevActiveAndAliveMerc(pSoldier: Pointer<SOLDIERTYPE>, fGoodForLessOKLife: boolean, fOnlyRegularMercs: boolean): UINT8 {
  let bLastTeamID: UINT8;
  let cnt: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  // loop back
  bLastTeamID = gTacticalStatus.Team[pSoldier.value.bTeam].bFirstID;
  cnt = pSoldier.value.ubID - 1;

  for (pTeamSoldier = MercPtrs[cnt]; cnt >= bLastTeamID; cnt--, pTeamSoldier--) {
    if (fOnlyRegularMercs) {
      if (AM_AN_EPC(pTeamSoldier) || AM_A_ROBOT(pTeamSoldier)) {
        continue;
      }
    }

    if (fGoodForLessOKLife) {
      // Check for bLife > 0
      if (pTeamSoldier.value.bLife > 0 && pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bTeam == gbPlayerNum && pTeamSoldier.value.bAssignment < Enum117.ON_DUTY && OK_INTERRUPT_MERC(pTeamSoldier) && pSoldier.value.bAssignment == pTeamSoldier.value.bAssignment) {
        return cnt;
      }
    } else {
      if (OK_CONTROLLABLE_MERC(pTeamSoldier) && OK_INTERRUPT_MERC(pTeamSoldier) && pSoldier.value.bAssignment == pTeamSoldier.value.bAssignment) {
        return cnt;
      }
    }
  }

  bLastTeamID = pSoldier.value.ubID;
  cnt = gTacticalStatus.Team[pSoldier.value.bTeam].bLastID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt >= bLastTeamID; cnt--, pTeamSoldier--) {
    if (fOnlyRegularMercs) {
      if (AM_AN_EPC(pTeamSoldier) || AM_A_ROBOT(pTeamSoldier)) {
        continue;
      }
    }

    if (fGoodForLessOKLife) {
      if (pTeamSoldier.value.bLife > 0 && pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bTeam == gbPlayerNum && pTeamSoldier.value.bAssignment < Enum117.ON_DUTY && OK_INTERRUPT_MERC(pTeamSoldier) && pSoldier.value.bAssignment == pTeamSoldier.value.bAssignment) {
        return cnt;
      }
    } else {
      if (OK_CONTROLLABLE_MERC(pTeamSoldier) && OK_INTERRUPT_MERC(pTeamSoldier) && pSoldier.value.bAssignment == pTeamSoldier.value.bAssignment) {
        return cnt;
      }
    }
  }

  // none found,
  // IF we are here, keep as we always were!
  return pSoldier.value.ubID;
}

function CheckForPlayerTeamInMissionExit(): boolean {
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bGuysIn: UINT8 = 0;

  // End the turn of player charactors
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bLife >= OKLIFE) {
      if (pSoldier.value.fInMissionExitNode) {
        bGuysIn++;
      }
    }
  }

  if (bGuysIn == 0) {
    return false;
  }

  if (NumActiveAndConsciousTeamMembers(gbPlayerNum) == 0) {
    return false;
  }

  if (bGuysIn == NumActiveAndConsciousTeamMembers(gbPlayerNum)) {
    return true;
  }

  return false;
}

function EndTacticalDemo(): void {
  gTacticalStatus.uiFlags &= (~DEMOMODE);
  gTacticalStatus.fGoingToEnterDemo = false;
}

export function EnterTacticalDemoMode(): UINT32 {
  let ubNewScene: UINT8 = gubCurrentScene;
  let ubNumScenes: UINT8 = NUM_RANDOM_SCENES;

  gTacticalStatus.uiTimeOfLastInput = GetJA2Clock();

  // REMOVE ALL EVENTS!
  DequeAllGameEvents(false);

  // Switch into realtime/demo
  gTacticalStatus.uiFlags |= (REALTIME | DEMOMODE);
  gTacticalStatus.uiFlags &= (~TURNBASED);
  gTacticalStatus.uiFlags &= (~NPC_TEAM_DEAD);
  gTacticalStatus.uiFlags &= (~PLAYER_TEAM_DEAD);

  // Force load of guys
  SetLoadOverrideParams(true, false, null);

  // Load random level
  // Dont't do first three levels
  if (gTacticalStatus.fNOTDOLASTDEMO) {
    ubNumScenes--;
  }

  do {
    ubNewScene = START_DEMO_SCENE + Random(ubNumScenes);
  } while (ubNewScene == gubCurrentScene);

  gubCurrentScene = ubNewScene;

  // Set demo timer
  gTacticalStatus.uiTimeSinceDemoOn = GetJA2Clock();

  gfSGPInputReceived = false;

  gTacticalStatus.fGoingToEnterDemo = false;

  return Enum26.INIT_SCREEN;
}

function GetSceneFilename(): string /* Pointer<CHAR8> */ {
  return gzLevelFilenames[gubCurrentScene];
}

// NB if making changes don't forget to update NewOKDestinationAndDirection
export function NewOKDestination(pCurrSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, fPeopleToo: boolean, bLevel: INT8): INT16 {
  let bPerson: UINT8;
  let pStructure: Pointer<STRUCTURE>;
  let sDesiredLevel: INT16;
  let fOKCheckStruct: boolean;

  if (!GridNoOnVisibleWorldTile(sGridNo)) {
    return true;
  }

  if (fPeopleToo && (bPerson = WhoIsThere2(sGridNo, bLevel)) != NO_SOLDIER) {
    // we could be multitiled... if the person there is us, and the gridno is not
    // our base gridno, skip past these checks
    if (!(bPerson == pCurrSoldier.value.ubID && sGridNo != pCurrSoldier.value.sGridNo)) {
      if (pCurrSoldier.value.bTeam == gbPlayerNum) {
        if ((Menptr[bPerson].bVisible >= 0) || (gTacticalStatus.uiFlags & SHOW_ALL_MERCS))
          return (false); // if someone there it's NOT OK
      } else {
        return (false); // if someone there it's NOT OK
      }
    }
  }

  // Check structure database
  if ((pCurrSoldier.value.uiStatusFlags & SOLDIER_MULTITILE) && !(gfEstimatePath)) {
    let usAnimSurface: UINT16;
    let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
    let fOk: boolean;
    let bLoop: INT8;
    let usStructureID: UINT16 = INVALID_STRUCTURE_ID;

    // this could be kinda slow...

    // Get animation surface...
    usAnimSurface = DetermineSoldierAnimationSurface(pCurrSoldier, pCurrSoldier.value.usUIMovementMode);
    // Get structure ref...
    pStructureFileRef = GetAnimationStructureRef(pCurrSoldier.value.ubID, usAnimSurface, pCurrSoldier.value.usUIMovementMode);

    // opposite directions should be mirrors, so only check 4
    if (pStructureFileRef) {
      // if ANY direction is valid, consider moving here valid
      for (bLoop = 0; bLoop < Enum245.NUM_WORLD_DIRECTIONS; bLoop++) {
        // ATE: Only if we have a levelnode...
        if (pCurrSoldier.value.pLevelNode != null && pCurrSoldier.value.pLevelNode.value.pStructureData != null) {
          usStructureID = pCurrSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
        } else {
          usStructureID = INVALID_STRUCTURE_ID;
        }

        fOk = InternalOkayToAddStructureToWorld(sGridNo, bLevel, addressof(pStructureFileRef.value.pDBStructureRef[bLoop]), usStructureID, !fPeopleToo);
        if (fOk) {
          return true;
        }
      }
    }
    return false;
  } else {
    // quick test
    if (gpWorldLevelData[sGridNo].pStructureHead != null) {
      // Something is here, check obstruction in future
      if (bLevel == 0) {
        sDesiredLevel = STRUCTURE_ON_GROUND;
      } else {
        sDesiredLevel = STRUCTURE_ON_ROOF;
      }

      pStructure = FindStructure(sGridNo, STRUCTURE_BLOCKSMOVES);

      // ATE: If we are trying to get a path to an exit grid AND
      // we are a cave....still allow this..
      // if ( pStructure && gfPlotPathToExitGrid && pStructure->fFlags & STRUCTURE_CAVEWALL )
      if (pStructure && gfPlotPathToExitGrid) {
        pStructure = null;
      }

      while (pStructure != null) {
        if (!(pStructure.value.fFlags & STRUCTURE_PASSABLE)) {
          fOKCheckStruct = true;

          // Check if this is a multi-tile
          if ((pStructure.value.fFlags & STRUCTURE_MOBILE) && (pCurrSoldier.value.uiStatusFlags & SOLDIER_MULTITILE)) {
            // Check IDs with soldier's ID
            if (pCurrSoldier.value.pLevelNode != null && pCurrSoldier.value.pLevelNode.value.pStructureData != null && pCurrSoldier.value.pLevelNode.value.pStructureData.value.usStructureID == pStructure.value.usStructureID) {
              fOKCheckStruct = false;
            }
          }

          if (fOKCheckStruct) {
            if (pStructure.value.sCubeOffset == sDesiredLevel) {
              return false;
            }
          }
        }

        pStructure = FindNextStructure(pStructure, STRUCTURE_BLOCKSMOVES);
      }
    }
  }
  return true;
}

// NB if making changes don't forget to update NewOKDestination
function NewOKDestinationAndDirection(pCurrSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bDirection: INT8, fPeopleToo: boolean, bLevel: INT8): INT16 {
  let bPerson: UINT8;
  let pStructure: Pointer<STRUCTURE>;
  let sDesiredLevel: INT16;
  let fOKCheckStruct: boolean;

  if (fPeopleToo && (bPerson = WhoIsThere2(sGridNo, bLevel)) != NO_SOLDIER) {
    // we could be multitiled... if the person there is us, and the gridno is not
    // our base gridno, skip past these checks
    if (!(bPerson == pCurrSoldier.value.ubID && sGridNo != pCurrSoldier.value.sGridNo)) {
      if (pCurrSoldier.value.bTeam == gbPlayerNum) {
        if ((Menptr[bPerson].bVisible >= 0) || (gTacticalStatus.uiFlags & SHOW_ALL_MERCS))
          return (false); // if someone there it's NOT OK
      } else {
        return (false); // if someone there it's NOT OK
      }
    }
  }

  // Check structure database
  if ((pCurrSoldier.value.uiStatusFlags & SOLDIER_MULTITILE) && !(gfEstimatePath)) {
    let usAnimSurface: UINT16;
    let pStructureFileRef: Pointer<STRUCTURE_FILE_REF>;
    let fOk: boolean;
    let bLoop: INT8;
    let usStructureID: UINT16 = INVALID_STRUCTURE_ID;

    // this could be kinda slow...

    // Get animation surface...
    usAnimSurface = DetermineSoldierAnimationSurface(pCurrSoldier, pCurrSoldier.value.usUIMovementMode);
    // Get structure ref...
    pStructureFileRef = GetAnimationStructureRef(pCurrSoldier.value.ubID, usAnimSurface, pCurrSoldier.value.usUIMovementMode);

    if (pStructureFileRef) {
      // use the specified direction for checks
      bLoop = bDirection;

      {
        // ATE: Only if we have a levelnode...
        if (pCurrSoldier.value.pLevelNode != null && pCurrSoldier.value.pLevelNode.value.pStructureData != null) {
          usStructureID = pCurrSoldier.value.pLevelNode.value.pStructureData.value.usStructureID;
        }

        fOk = InternalOkayToAddStructureToWorld(sGridNo, pCurrSoldier.value.bLevel, addressof(pStructureFileRef.value.pDBStructureRef[gOneCDirection[bLoop]]), usStructureID, !fPeopleToo);
        if (fOk) {
          return true;
        }
      }
    }
    return false;
  } else {
    // quick test
    if (gpWorldLevelData[sGridNo].pStructureHead != null) {
      // Something is here, check obstruction in future
      if (bLevel == 0) {
        sDesiredLevel = STRUCTURE_ON_GROUND;
      } else {
        sDesiredLevel = STRUCTURE_ON_ROOF;
      }

      pStructure = FindStructure(sGridNo, STRUCTURE_BLOCKSMOVES);

      // ATE: If we are trying to get a path to an exit grid AND
      // we are a cave....still allow this..
      // if ( pStructure && gfPlotPathToExitGrid && pStructure->fFlags & STRUCTURE_CAVEWALL )
      if (pStructure && gfPlotPathToExitGrid) {
        pStructure = null;
      }

      while (pStructure != null) {
        if (!(pStructure.value.fFlags & STRUCTURE_PASSABLE)) {
          fOKCheckStruct = true;

          // Check if this is a multi-tile
          if ((pStructure.value.fFlags & STRUCTURE_MOBILE) && (pCurrSoldier.value.uiStatusFlags & SOLDIER_MULTITILE)) {
            // Check IDs with soldier's ID
            if (pCurrSoldier.value.pLevelNode != null && pCurrSoldier.value.pLevelNode.value.pStructureData != null && pCurrSoldier.value.pLevelNode.value.pStructureData.value.usStructureID == pStructure.value.usStructureID) {
              fOKCheckStruct = false;
            }
          }

          if (fOKCheckStruct) {
            if (pStructure.value.sCubeOffset == sDesiredLevel) {
              return false;
            }
          }
        }

        pStructure = FindNextStructure(pStructure, STRUCTURE_BLOCKSMOVES);
      }
    }
  }
  return true;
}

// Kris:
export function FlatRoofAboveGridNo(iMapIndex: INT32): boolean {
  let pRoof: Pointer<LEVELNODE>;
  let uiTileType: UINT32;
  pRoof = gpWorldLevelData[iMapIndex].pRoofHead;
  while (pRoof) {
    if (pRoof.value.usIndex != NO_TILE) {
      GetTileType(pRoof.value.usIndex, addressof(uiTileType));
      if (uiTileType >= Enum313.FIRSTROOF && uiTileType <= LASTROOF)
        return true;
    }
    pRoof = pRoof.value.pNext;
  }
  return false;
}

// Kris:
// ASSUMPTION:  This function assumes that we are checking on behalf of a single tiled merc.  This function
//						 should not be used for checking on behalf of multi-tiled "things".
// I wrote this function for editor use.  I don't personally care about multi-tiled stuff.  All I want
// to know is whether or not I can put a merc here.  In most cases, I won't be dealing with multi-tiled
// mercs, and the rarity doesn't justify the needs.  I just wrote this to be quick and dirty, and I don't
// expect it to perform perfectly in all situations.
export function IsLocationSittable(iMapIndex: INT32, fOnRoof: boolean): boolean {
  let pStructure: Pointer<STRUCTURE>;
  let sDesiredLevel: INT16;
  if (WhoIsThere2(iMapIndex, 0) != NO_SOLDIER)
    return false;
  // Locations on roofs without a roof is not possible, so
  // we convert the onroof intention to ground.
  if (fOnRoof && !FlatRoofAboveGridNo(iMapIndex))
    fOnRoof = false;
  // Check structure database
  if (gpWorldLevelData[iMapIndex].pStructureHead) {
    // Something is here, check obstruction in future
    sDesiredLevel = fOnRoof ? STRUCTURE_ON_ROOF : STRUCTURE_ON_GROUND;
    pStructure = FindStructure(iMapIndex, STRUCTURE_BLOCKSMOVES);
    while (pStructure) {
      if (!(pStructure.value.fFlags & STRUCTURE_PASSABLE) && pStructure.value.sCubeOffset == sDesiredLevel)
        return false;
      pStructure = FindNextStructure(pStructure, STRUCTURE_BLOCKSMOVES);
    }
  }
  return true;
}

export function IsLocationSittableExcludingPeople(iMapIndex: INT32, fOnRoof: boolean): boolean {
  let pStructure: Pointer<STRUCTURE>;
  let sDesiredLevel: INT16;

  // Locations on roofs without a roof is not possible, so
  // we convert the onroof intention to ground.
  if (fOnRoof && !FlatRoofAboveGridNo(iMapIndex))
    fOnRoof = false;
  // Check structure database
  if (gpWorldLevelData[iMapIndex].pStructureHead) {
    // Something is here, check obstruction in future
    sDesiredLevel = fOnRoof ? STRUCTURE_ON_ROOF : STRUCTURE_ON_GROUND;
    pStructure = FindStructure(iMapIndex, STRUCTURE_BLOCKSMOVES);
    while (pStructure) {
      if (!(pStructure.value.fFlags & STRUCTURE_PASSABLE) && pStructure.value.sCubeOffset == sDesiredLevel)
        return false;
      pStructure = FindNextStructure(pStructure, STRUCTURE_BLOCKSMOVES);
    }
  }
  return true;
}

export function TeamMemberNear(bTeam: INT8, sGridNo: INT16, iRange: INT32): boolean {
  let bLoop: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (bLoop = gTacticalStatus.Team[bTeam].bFirstID, pSoldier = MercPtrs[bLoop]; bLoop <= gTacticalStatus.Team[bTeam].bLastID; bLoop++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && (pSoldier.value.bLife >= OKLIFE) && !(pSoldier.value.uiStatusFlags & SOLDIER_GASSED)) {
      if (PythSpacesAway(pSoldier.value.sGridNo, sGridNo) <= iRange) {
        return true;
      }
    }
  }

  return false;
}

export function FindAdjacentGridEx(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, pubDirection: Pointer<UINT8>, psAdjustedGridNo: Pointer<INT16>, fForceToPerson: boolean, fDoor: boolean): INT16 {
  // psAdjustedGridNo gets the original gridno or the new one if updated
  // It will ONLY be updated IF we were over a merc, ( it's updated to their gridno )
  // pubDirection gets the direction to the final gridno
  // fForceToPerson: forces the grid under consideration to be the one occupiedby any target
  // in that location, because we could be passed a gridno based on the overlap of soldier's graphic
  // fDoor determines whether special door-handling code should be used (for interacting with doors)

  let sFourGrids: INT16[] /* [4] */;
  let sDistance: INT16 = 0;
  let sDirs: INT16[] /* [4] */ = [
    Enum245.NORTH,
    Enum245.EAST,
    Enum245.SOUTH,
    Enum245.WEST,
  ];
  let cnt: INT32;
  let sClosest: INT16 = NOWHERE;
  let sSpot: INT16;
  let sOkTest: INT16;
  let sCloseGridNo: INT16 = NOWHERE;
  let uiMercFlags: UINT32;
  let usSoldierIndex: UINT16;
  let ubDir: UINT8;
  let pDoor: Pointer<STRUCTURE>;
  // STRUCTURE                            *pWall;
  let ubWallOrientation: UINT8;
  let fCheckGivenGridNo: boolean = true;
  let ubTestDirection: UINT8;
  let ExitGrid: EXITGRID;

  // Set default direction
  if (pubDirection) {
    pubDirection.value = pSoldier.value.bDirection;
  }

  // CHECK IF WE WANT TO FORCE GRIDNO TO PERSON
  if (psAdjustedGridNo != null) {
    psAdjustedGridNo.value = sGridNo;
  }

  // CHECK IF IT'S THE SAME ONE AS WE'RE ON, IF SO, RETURN THAT!
  if (pSoldier.value.sGridNo == sGridNo && !FindStructure(sGridNo, (STRUCTURE_SWITCH))) {
    // OK, if we are looking for a door, it may be in the same tile as us, so find the direction we
    // have to face to get to the door, not just our initial direction...
    // If we are in the same tile as a switch, we can NEVER pull it....
    if (fDoor) {
      // This can only happen if a door was to the south to east of us!

      // Do south!
      // sSpot = NewGridNo( sGridNo, DirectionInc( SOUTH ) );

      // ATE: Added: Switch behave EXACTLY like doors
      pDoor = FindStructure(sGridNo, (STRUCTURE_ANYDOOR));

      if (pDoor != null) {
        // Get orinetation
        ubWallOrientation = pDoor.value.ubWallOrientation;

        if (ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT || ubWallOrientation == Enum314.INSIDE_TOP_LEFT) {
          // To the south!
          sSpot = NewGridNo(sGridNo, DirectionInc(Enum245.SOUTH));
          if (pubDirection) {
            (pubDirection.value) = GetDirectionFromGridNo(sSpot, pSoldier);
          }
        }

        if (ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT || ubWallOrientation == Enum314.INSIDE_TOP_RIGHT) {
          // TO the east!
          sSpot = NewGridNo(sGridNo, DirectionInc(Enum245.EAST));
          if (pubDirection) {
            (pubDirection.value) = GetDirectionFromGridNo(sSpot, pSoldier);
          }
        }
      }
    }

    // Use soldier's direction
    return sGridNo;
  }

  // Look for a door!
  if (fDoor) {
    pDoor = FindStructure(sGridNo, (STRUCTURE_ANYDOOR | STRUCTURE_SWITCH));
  } else {
    pDoor = null;
  }

  if (fForceToPerson) {
    if (FindSoldier(sGridNo, addressof(usSoldierIndex), addressof(uiMercFlags), FIND_SOLDIER_GRIDNO)) {
      sGridNo = MercPtrs[usSoldierIndex].value.sGridNo;
      if (psAdjustedGridNo != null) {
        psAdjustedGridNo.value = sGridNo;

        // Use direction to this guy!
        if (pubDirection) {
          (pubDirection.value) = GetDirectionFromGridNo(sGridNo, pSoldier);
        }
      }
    }
  }

  if ((sOkTest = NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel)) > 0) // no problem going there! nobody on it!
  {
    // OK, if we are looking to goto a switch, ignore this....
    if (pDoor) {
      if (pDoor.value.fFlags & STRUCTURE_SWITCH) {
        // Don't continuel
        fCheckGivenGridNo = false;
      }
    }

    // If there is an exit grid....
    if (GetExitGrid(sGridNo, addressof(ExitGrid))) {
      // Don't continuel
      fCheckGivenGridNo = false;
    }

    if (fCheckGivenGridNo) {
      sDistance = PlotPath(pSoldier, sGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

      if (sDistance > 0) {
        if (sDistance < sClosest) {
          sClosest = sDistance;
          sCloseGridNo = sGridNo;
        }
      }
    }
  }

  for (cnt = 0; cnt < 4; cnt++) {
    // MOVE OUT TWO DIRECTIONS
    sFourGrids[cnt] = sSpot = NewGridNo(sGridNo, DirectionInc(sDirs[cnt]));

    ubTestDirection = sDirs[cnt];

    // For switches, ALLOW them to walk through walls to reach it....
    if (pDoor && pDoor.value.fFlags & STRUCTURE_SWITCH) {
      ubTestDirection = gOppositeDirection[ubTestDirection];
    }

    if (fDoor) {
      if (gubWorldMovementCosts[sSpot][ubTestDirection][pSoldier.value.bLevel] >= TRAVELCOST_BLOCKED) {
        // obstacle or wall there!
        continue;
      }
    } else {
      // this function returns original MP cost if not a door cost
      if (DoorTravelCost(pSoldier, sSpot, gubWorldMovementCosts[sSpot][ubTestDirection][pSoldier.value.bLevel], false, null) >= TRAVELCOST_BLOCKED) {
        // obstacle or wall there!
        continue;
      }
    }

    // Eliminate some directions if we are looking at doors!
    if (pDoor != null) {
      // Get orinetation
      ubWallOrientation = pDoor.value.ubWallOrientation;

      // Refuse the south and north and west  directions if our orientation is top-right
      if (ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT || ubWallOrientation == Enum314.INSIDE_TOP_RIGHT) {
        if (sDirs[cnt] == Enum245.NORTH || sDirs[cnt] == Enum245.WEST || sDirs[cnt] == Enum245.SOUTH)
          continue;
      }

      // Refuse the north and west and east directions if our orientation is top-right
      if (ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT || ubWallOrientation == Enum314.INSIDE_TOP_LEFT) {
        if (sDirs[cnt] == Enum245.NORTH || sDirs[cnt] == Enum245.WEST || sDirs[cnt] == Enum245.EAST)
          continue;
      }
    }

    // If this spot is our soldier's gridno use that!
    if (sSpot == pSoldier.value.sGridNo) {
      // Use default diurection ) soldier's direction )

      // OK, at least get direction to face......
      // Defaults to soldier's facing dir unless we change it!
      // if ( pDoor != NULL )
      {
        // Use direction to the door!
        if (pubDirection) {
          (pubDirection.value) = GetDirectionFromGridNo(sGridNo, pSoldier);
        }
      }
      return sSpot;
    }

    // don't store path, just measure it
    ubDir = GetDirectionToGridNoFromGridNo(sSpot, sGridNo);

    if ((NewOKDestinationAndDirection(pSoldier, sSpot, ubDir, true, pSoldier.value.bLevel) > 0) && ((sDistance = PlotPath(pSoldier, sSpot, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints)) > 0)) {
      if (sDistance < sClosest) {
        sClosest = sDistance;
        sCloseGridNo = sSpot;
      }
    }
  }

  if (sClosest != NOWHERE) {
    // Take last direction and use opposite!
    // This will be usefull for ours and AI mercs

    // If our gridno is the same ( which can be if we are look at doors )
    if (sGridNo == sCloseGridNo) {
      if (pubDirection) {
        // ATE: Only if we have a valid door!
        if (pDoor) {
          switch (pDoor.value.pDBStructureRef.value.pDBStructure.value.ubWallOrientation) {
            case Enum314.OUTSIDE_TOP_LEFT:
            case Enum314.INSIDE_TOP_LEFT:

              pubDirection.value = Enum245.SOUTH;
              break;

            case Enum314.OUTSIDE_TOP_RIGHT:
            case Enum314.INSIDE_TOP_RIGHT:

              pubDirection.value = Enum245.EAST;
              break;
          }
        }
      }
    } else {
      // Calculate direction if our gridno is different....
      ubDir = GetDirectionToGridNoFromGridNo(sCloseGridNo, sGridNo);
      if (pubDirection) {
        pubDirection.value = ubDir;
      }
    }
    // if ( psAdjustedGridNo != NULL )
    //{
    //		(*psAdjustedGridNo) = sCloseGridNo;
    //}
    if (sCloseGridNo == NOWHERE) {
      return -1;
    }
    return sCloseGridNo;
  } else
    return -1;
}

export function FindNextToAdjacentGridEx(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, pubDirection: Pointer<UINT8>, psAdjustedGridNo: Pointer<INT16>, fForceToPerson: boolean, fDoor: boolean): INT16 {
  // This function works in a similar way as FindAdjacentGridEx, but looks for a location 2 tiles away

  // psAdjustedGridNo gets the original gridno or the new one if updated
  // pubDirection gets the direction to the final gridno
  // fForceToPerson: forces the grid under consideration to be the one occupiedby any target
  // in that location, because we could be passed a gridno based on the overlap of soldier's graphic
  // fDoor determines whether special door-handling code should be used (for interacting with doors)

  let sFourGrids: INT16[] /* [4] */;
  let sDistance: INT16 = 0;
  let sDirs: INT16[] /* [4] */ = [
    Enum245.NORTH,
    Enum245.EAST,
    Enum245.SOUTH,
    Enum245.WEST,
  ];
  let cnt: INT32;
  let sClosest: INT16 = WORLD_MAX;
  let sSpot: INT16;
  let sSpot2: INT16;
  let sOkTest: INT16;
  let sCloseGridNo: INT16 = NOWHERE;
  let uiMercFlags: UINT32;
  let usSoldierIndex: UINT16;
  let ubDir: UINT8;
  let pDoor: Pointer<STRUCTURE>;
  let ubWallOrientation: UINT8;
  let fCheckGivenGridNo: boolean = true;
  let ubTestDirection: UINT8;
  let ubWhoIsThere: UINT8;

  // CHECK IF WE WANT TO FORCE GRIDNO TO PERSON
  if (psAdjustedGridNo != null) {
    psAdjustedGridNo.value = sGridNo;
  }

  // CHECK IF IT'S THE SAME ONE AS WE'RE ON, IF SO, RETURN THAT!
  if (pSoldier.value.sGridNo == sGridNo) {
    pubDirection.value = pSoldier.value.bDirection;
    return sGridNo;
  }

  // Look for a door!
  if (fDoor) {
    pDoor = FindStructure(sGridNo, (STRUCTURE_ANYDOOR | STRUCTURE_SWITCH));
  } else {
    pDoor = null;
  }

  if (fForceToPerson) {
    if (FindSoldier(sGridNo, addressof(usSoldierIndex), addressof(uiMercFlags), FIND_SOLDIER_GRIDNO)) {
      sGridNo = MercPtrs[usSoldierIndex].value.sGridNo;
      if (psAdjustedGridNo != null) {
        psAdjustedGridNo.value = sGridNo;
      }
    }
  }

  if ((sOkTest = NewOKDestination(pSoldier, sGridNo, true, pSoldier.value.bLevel)) > 0) // no problem going there! nobody on it!
  {
    // OK, if we are looking to goto a switch, ignore this....
    if (pDoor) {
      if (pDoor.value.fFlags & STRUCTURE_SWITCH) {
        // Don't continuel
        fCheckGivenGridNo = false;
      }
    }

    if (fCheckGivenGridNo) {
      sDistance = PlotPath(pSoldier, sGridNo, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints);

      if (sDistance > 0) {
        if (sDistance < sClosest) {
          sClosest = sDistance;
          sCloseGridNo = sGridNo;
        }
      }
    }
  }

  for (cnt = 0; cnt < 4; cnt++) {
    // MOVE OUT TWO DIRECTIONS
    sFourGrids[cnt] = sSpot = NewGridNo(sGridNo, DirectionInc(sDirs[cnt]));

    ubTestDirection = sDirs[cnt];

    if (pDoor && pDoor.value.fFlags & STRUCTURE_SWITCH) {
      ubTestDirection = gOppositeDirection[ubTestDirection];
    }

    if (gubWorldMovementCosts[sSpot][ubTestDirection][pSoldier.value.bLevel] >= TRAVELCOST_BLOCKED) {
      // obstacle or wall there!
      continue;
    }

    ubWhoIsThere = WhoIsThere2(sSpot, pSoldier.value.bLevel);
    if (ubWhoIsThere != NOBODY && ubWhoIsThere != pSoldier.value.ubID) {
      // skip this direction b/c it's blocked by another merc!
      continue;
    }

    // Eliminate some directions if we are looking at doors!
    if (pDoor != null) {
      // Get orinetation
      ubWallOrientation = pDoor.value.ubWallOrientation;

      // Refuse the south and north and west  directions if our orientation is top-right
      if (ubWallOrientation == Enum314.OUTSIDE_TOP_RIGHT || ubWallOrientation == Enum314.INSIDE_TOP_RIGHT) {
        if (sDirs[cnt] == Enum245.NORTH || sDirs[cnt] == Enum245.WEST || sDirs[cnt] == Enum245.SOUTH)
          continue;
      }

      // Refuse the north and west and east directions if our orientation is top-right
      if (ubWallOrientation == Enum314.OUTSIDE_TOP_LEFT || ubWallOrientation == Enum314.INSIDE_TOP_LEFT) {
        if (sDirs[cnt] == Enum245.NORTH || sDirs[cnt] == Enum245.WEST || sDirs[cnt] == Enum245.EAST)
          continue;
      }
    }

    // first tile is okay, how about the second?
    sSpot2 = NewGridNo(sSpot, DirectionInc(sDirs[cnt]));
    if (gubWorldMovementCosts[sSpot2][sDirs[cnt]][pSoldier.value.bLevel] >= TRAVELCOST_BLOCKED || DoorTravelCost(pSoldier, sSpot2, gubWorldMovementCosts[sSpot2][sDirs[cnt]][pSoldier.value.bLevel], (pSoldier.value.bTeam == gbPlayerNum), null) == TRAVELCOST_DOOR) // closed door blocks!
    {
      // obstacle or wall there!
      continue;
    }

    ubWhoIsThere = WhoIsThere2(sSpot2, pSoldier.value.bLevel);
    if (ubWhoIsThere != NOBODY && ubWhoIsThere != pSoldier.value.ubID) {
      // skip this direction b/c it's blocked by another merc!
      continue;
    }

    sSpot = sSpot2;

    // If this spot is our soldier's gridno use that!
    if (sSpot == pSoldier.value.sGridNo) {
      if (pubDirection) {
        (pubDirection.value) = GetDirectionFromGridNo(sGridNo, pSoldier);
      }
      //*pubDirection = pSoldier->bDirection;
      return sSpot;
    }

    ubDir = GetDirectionToGridNoFromGridNo(sSpot, sGridNo);

    // don't store path, just measure it
    if ((NewOKDestinationAndDirection(pSoldier, sSpot, ubDir, true, pSoldier.value.bLevel) > 0) && ((sDistance = PlotPath(pSoldier, sSpot, NO_COPYROUTE, NO_PLOT, TEMPORARY, pSoldier.value.usUIMovementMode, NOT_STEALTH, FORWARD, pSoldier.value.bActionPoints)) > 0)) {
      if (sDistance < sClosest) {
        sClosest = sDistance;
        sCloseGridNo = sSpot;
      }
    }
  }

  if (sClosest != NOWHERE) {
    // Take last direction and use opposite!
    // This will be usefull for ours and AI mercs

    // If our gridno is the same ( which can be if we are look at doors )
    if (sGridNo == sCloseGridNo) {
      if (pubDirection) {
        // ATE: Only if we have a valid door!
        if (pDoor) {
          switch (pDoor.value.pDBStructureRef.value.pDBStructure.value.ubWallOrientation) {
            case Enum314.OUTSIDE_TOP_LEFT:
            case Enum314.INSIDE_TOP_LEFT:

              pubDirection.value = Enum245.SOUTH;
              break;

            case Enum314.OUTSIDE_TOP_RIGHT:
            case Enum314.INSIDE_TOP_RIGHT:

              pubDirection.value = Enum245.EAST;
              break;
          }
        }
      }
    } else {
      // Calculate direction if our gridno is different....
      ubDir = GetDirectionToGridNoFromGridNo(sCloseGridNo, sGridNo);
      if (pubDirection) {
        pubDirection.value = ubDir;
      }
    }

    if (sCloseGridNo == NOWHERE) {
      return -1;
    }
    return sCloseGridNo;
  } else
    return -1;

  /*
  if (sCloseGridNo != NOWHERE)
{
           // Take last direction and use opposite!
           // This will be usefull for ours and AI mercs

           // If our gridno is the same ( which can be if we are look at doors )
           if ( sGridNo == sCloseGridNo )
           {
                          switch( pDoor->pDBStructureRef->pDBStructure->ubWallOrientation )
                          {
                                  case OUTSIDE_TOP_LEFT:
                                  case INSIDE_TOP_LEFT:

                                   *pubDirection = SOUTH;
                                          break;

                                  case OUTSIDE_TOP_RIGHT:
                                  case INSIDE_TOP_RIGHT:

                                   *pubDirection = EAST;
                                          break;
                          }
           }
           else
           {
                          // Calculate direction if our gridno is different....
                          ubDir = (UINT8)GetDirectionToGridNoFromGridNo( sCloseGridNo, sGridNo );
                          *pubDirection = ubDir;
           }
           return( sCloseGridNo );
}
  else
          return( -1 );
  */
}

export function FindAdjacentPunchTarget(pSoldier: Pointer<SOLDIERTYPE>, pTargetSoldier: Pointer<SOLDIERTYPE>, psAdjustedTargetGridNo: Pointer<INT16>, pubDirection: Pointer<UINT8>): INT16 {
  let cnt: INT16;
  let sSpot: INT16;
  let ubGuyThere: UINT8;

  for (cnt = 0; cnt < Enum245.NUM_WORLD_DIRECTIONS; cnt++) {
    sSpot = NewGridNo(pSoldier.value.sGridNo, DirectionInc(cnt));

    if (DoorTravelCost(pSoldier, sSpot, gubWorldMovementCosts[sSpot][cnt][pSoldier.value.bLevel], false, null) >= TRAVELCOST_BLOCKED) {
      // blocked!
      continue;
    }

    // Check for who is there...
    ubGuyThere = WhoIsThere2(sSpot, pSoldier.value.bLevel);

    if (pTargetSoldier != null && ubGuyThere == pTargetSoldier.value.ubID) {
      // We've got a guy here....
      // Who is the one we want......
      psAdjustedTargetGridNo.value = pTargetSoldier.value.sGridNo;
      pubDirection.value = cnt;
      return sSpot;
    }
  }

  return NOWHERE;
}

export function UIOKMoveDestination(pSoldier: Pointer<SOLDIERTYPE>, usMapPos: UINT16): boolean {
  let fVisible: boolean;

  // Check if a hidden tile exists but is not revealed
  if (DoesGridnoContainHiddenStruct(usMapPos, addressof(fVisible))) {
    if (!fVisible) {
      // The player thinks this is OK!
      return true;
    }
  }

  if (!NewOKDestination(pSoldier, usMapPos, false, gsInterfaceLevel)) {
    return false;
  }

  // ATE: If we are a robot, see if we are being validly controlled...
  if (pSoldier.value.uiStatusFlags & SOLDIER_ROBOT) {
    if (!CanRobotBeControlled(pSoldier)) {
      // Display message that robot cannot be controlled....
      return 2;
    }
  }

  // ATE: Experiment.. take out
  // else if ( IsRoofVisible( usMapPos ) && gsInterfaceLevel == 0 )
  //{
  //	return( FALSE );
  //}

  return true;
}

export function HandleTeamServices(ubTeamNum: UINT8): void {
  let cnt: INT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let uiPointsUsed: UINT32;
  let usSoldierIndex: UINT16;
  let usInHand: UINT16;
  let usKitPts: UINT16;
  let bSlot: INT8;
  let fDone: boolean;

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[ubTeamNum].bFirstID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[ubTeamNum].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bLife >= OKLIFE && pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
      fDone = false;
      // Check for different events!
      // FOR DOING AID
      if (pTeamSoldier.value.usAnimState == Enum193.GIVING_AID) {
        // Get medkit info
        usInHand = pTeamSoldier.value.inv[Enum261.HANDPOS].usItem;

        // Get victim pointer
        usSoldierIndex = WhoIsThere2(pTeamSoldier.value.sTargetGridNo, pTeamSoldier.value.bLevel);
        if (usSoldierIndex != NOBODY) {
          pTargetSoldier = MercPtrs[usSoldierIndex];

          if (pTargetSoldier.value.ubServiceCount) {
            usKitPts = TotalPoints(addressof(pTeamSoldier.value.inv[Enum261.HANDPOS]));

            uiPointsUsed = SoldierDressWound(pTeamSoldier, pTargetSoldier, usKitPts, usKitPts);

            // Determine if they are all banagded
            if (!pTargetSoldier.value.bBleeding && pTargetSoldier.value.bLife >= OKLIFE) {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.MERC_IS_ALL_BANDAGED_STR], pTargetSoldier.value.name);

              // Cancel all services for this guy!
              ReceivingSoldierCancelServices(pTargetSoldier);
              fDone = true;
            }

            UseKitPoints(addressof(pTeamSoldier.value.inv[Enum261.HANDPOS]), uiPointsUsed, pTeamSoldier);

            // Get new total
            usKitPts = TotalPoints(addressof(pTeamSoldier.value.inv[Enum261.HANDPOS]));

            // WHETHER OR NOT recipient is all bandaged, check if we've used them up!
            if (usKitPts <= 0) // no more bandages
            {
              if (fDone) {
                // don't swap if we're done
                bSlot = NO_SLOT;
              } else {
                bSlot = FindObj(pTeamSoldier, Enum225.FIRSTAIDKIT);
                if (bSlot == NO_SLOT) {
                  bSlot = FindObj(pTeamSoldier, Enum225.MEDICKIT);
                }
              }
              if (bSlot != NO_SLOT) {
                SwapObjs(addressof(pTeamSoldier.value.inv[Enum261.HANDPOS]), addressof(pTeamSoldier.value.inv[bSlot]));
              } else {
                ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.MERC_IS_OUT_OF_BANDAGES_STR], pTeamSoldier.value.name);
                GivingSoldierCancelServices(pTeamSoldier);

                if (!gTacticalStatus.fAutoBandageMode) {
                  DoMercBattleSound(pTeamSoldier, (Enum259.BATTLE_SOUND_CURSE1));
                }
              }
            }
          }
        }
      }
    }
  }
}

export function HandlePlayerServices(pTeamSoldier: Pointer<SOLDIERTYPE>): void {
  let pTargetSoldier: Pointer<SOLDIERTYPE>;
  let uiPointsUsed: UINT32;
  let usSoldierIndex: UINT16;
  let usInHand: UINT16;
  let usKitPts: UINT16;
  let bSlot: INT8;
  let fDone: boolean = false;

  if (pTeamSoldier.value.bLife >= OKLIFE && pTeamSoldier.value.bActive) {
    // Check for different events!
    // FOR DOING AID
    if (pTeamSoldier.value.usAnimState == Enum193.GIVING_AID) {
      // Get medkit info
      usInHand = pTeamSoldier.value.inv[Enum261.HANDPOS].usItem;

      // Get victim pointer
      usSoldierIndex = WhoIsThere2(pTeamSoldier.value.sTargetGridNo, pTeamSoldier.value.bLevel);

      if (usSoldierIndex != NOBODY) {
        pTargetSoldier = MercPtrs[usSoldierIndex];

        if (pTargetSoldier.value.ubServiceCount) {
          usKitPts = TotalPoints(addressof(pTeamSoldier.value.inv[Enum261.HANDPOS]));

          uiPointsUsed = SoldierDressWound(pTeamSoldier, pTargetSoldier, usKitPts, usKitPts);

          // Determine if they are all banagded
          if (!pTargetSoldier.value.bBleeding && pTargetSoldier.value.bLife >= OKLIFE) {
            ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.MERC_IS_ALL_BANDAGED_STR], pTargetSoldier.value.name);

            // Cancel all services for this guy!
            ReceivingSoldierCancelServices(pTargetSoldier);
            fDone = true;
          }

          UseKitPoints(addressof(pTeamSoldier.value.inv[Enum261.HANDPOS]), uiPointsUsed, pTeamSoldier);

          // Get new total
          usKitPts = TotalPoints(addressof(pTeamSoldier.value.inv[Enum261.HANDPOS]));

          // WHETHER OR NOT recipient is all bandaged, check if we've used them up!
          if (usKitPts <= 0) // no more bandages
          {
            if (fDone) {
              // don't swap if we're done
              bSlot = NO_SLOT;
            } else {
              bSlot = FindObj(pTeamSoldier, Enum225.FIRSTAIDKIT);
              if (bSlot == NO_SLOT) {
                bSlot = FindObj(pTeamSoldier, Enum225.MEDICKIT);
              }
            }

            if (bSlot != NO_SLOT) {
              SwapObjs(addressof(pTeamSoldier.value.inv[Enum261.HANDPOS]), addressof(pTeamSoldier.value.inv[bSlot]));
            } else {
              ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.MERC_IS_OUT_OF_BANDAGES_STR], pTeamSoldier.value.name);
              GivingSoldierCancelServices(pTeamSoldier);

              if (!gTacticalStatus.fAutoBandageMode) {
                DoMercBattleSound(pTeamSoldier, (Enum259.BATTLE_SOUND_CURSE1));
              }
            }
          }
        }
      }
    }
  }
}

export function CommonEnterCombatModeCode(): void {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  gTacticalStatus.uiFlags |= INCOMBAT;

  // gTacticalStatus.ubAttackBusyCount = 0;

  // Reset num enemies fought flag...
  memset(addressof(gTacticalStatus.bNumFoughtInBattle), 0, MAXTEAMS);
  gTacticalStatus.ubLastBattleSectorX = gWorldSectorX;
  gTacticalStatus.ubLastBattleSectorY = gWorldSectorY;
  gTacticalStatus.fLastBattleWon = false;
  gTacticalStatus.fItemsSeenOnAttack = false;

  // ATE: If we have an item pointer end it!
  CancelItemPointer();

  ResetInterfaceAndUI();
  ResetMultiSelection();

  // OK, loop thorugh all guys and stop them!
  // Loop through all mercs and make go
  for (pSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pSoldier++, cnt++) {
    if (pSoldier.value.bActive) {
      if (pSoldier.value.bInSector && pSoldier.value.ubBodyType != Enum194.CROW) {
        // Set some flags for quotes
        pSoldier.value.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_IN_SHIT);
        pSoldier.value.usQuoteSaidFlags &= (~SOLDIER_QUOTE_SAID_MULTIPLE_CREATURES);

        // Hault!
        EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);

        // END AI actions
        CancelAIAction(pSoldier, true);

        // turn off AI controlled flag
        pSoldier.value.uiStatusFlags &= ~SOLDIER_UNDERAICONTROL;

        // Check if this guy is an enemy....
        CheckForPotentialAddToBattleIncrement(pSoldier);

        // If guy is sleeping, wake him up!
        if (pSoldier.value.fMercAsleep == true) {
          ChangeSoldierState(pSoldier, Enum193.WKAEUP_FROM_SLEEP, 1, true);
        }

        // ATE: Refresh APs
        CalcNewActionPoints(pSoldier);

        if (pSoldier.value.ubProfile != NO_PROFILE) {
          if (pSoldier.value.bTeam == CIV_TEAM && pSoldier.value.bNeutral) {
            // only set precombat gridno if unset
            if (gMercProfiles[pSoldier.value.ubProfile].sPreCombatGridNo == 0 || gMercProfiles[pSoldier.value.ubProfile].sPreCombatGridNo == NOWHERE) {
              gMercProfiles[pSoldier.value.ubProfile].sPreCombatGridNo = pSoldier.value.sGridNo;
            }
          } else {
            gMercProfiles[pSoldier.value.ubProfile].sPreCombatGridNo = NOWHERE;
          }
        }

        if (!gTacticalStatus.fHasEnteredCombatModeSinceEntering) {
          // ATE: reset player's movement mode at the very start of
          // combat
          // if ( pSoldier->bTeam == gbPlayerNum )
          //{
          // pSoldier->usUIMovementMode = RUNNING;
          //}
        }
      }
    }
  }

  gTacticalStatus.fHasEnteredCombatModeSinceEntering = true;

  SyncStrategicTurnTimes();

  // Play tune..
  PlayJA2Sample(Enum330.ENDTURN_1, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);

  // Say quote.....

  // Change music modes
  SetMusicMode(Enum328.MUSIC_TACTICAL_BATTLE);
}

export function EnterCombatMode(ubStartingTeam: UINT8): void {
  let cnt: UINT32;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;

  if (gTacticalStatus.uiFlags & INCOMBAT) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Can't enter combat when already in combat");
    // we're already in combat!
    return;
  }

  // Alrighty, don't do this if no enemies in sector
  if (NumCapableEnemyInSector() == 0) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Can't enter combat when no capable enemies");
    // ScreenMsg( MSG_FONT_RED, MSG_DEBUG, L"Trying to init combat when no enemies around!." );
    return;
  }

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Entering combat mode");

  // ATE: Added here to guarentee we have fEnemyInSector
  // Mostly this was not getting set if:
  // 1 ) we see bloodcats ( which makes them hostile )
  // 2 ) we make civs hostile
  // only do this once they are seen.....
  if (!gTacticalStatus.fEnemyInSector) {
    SetEnemyPresence();
  }

  CommonEnterCombatModeCode();

  if (ubStartingTeam == gbPlayerNum) {
    // OK, make sure we have a selected guy
    if (MercPtrs[gusSelectedSoldier].value.bOppCnt == 0) {
      // OK, look through and find one....
      for (cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID, pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
        if (OK_CONTROLLABLE_MERC(pTeamSoldier) && pTeamSoldier.value.bOppCnt > 0) {
          SelectSoldier(pTeamSoldier.value.ubID, false, true);
        }
      }
    }

    StartPlayerTeamTurn(false, true);
  } else {
    // have to call EndTurn so that we freeze the interface etc
    EndTurn(ubStartingTeam);
  }
}

export function ExitCombatMode(): void {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Exiting combat mode");

  // Leave combat mode
  gTacticalStatus.uiFlags &= (~INCOMBAT);

  EndTopMessage();

  // OK, we have exited combat mode.....
  // Reset some flags for no aps to move, etc

  // Set virgin sector to true....
  gTacticalStatus.fVirginSector = true;

  // Loop through all mercs and make go
  for (pSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pSoldier++, cnt++) {
    if (pSoldier.value.bActive) {
      if (pSoldier.value.bInSector) {
        // Reset some flags
        if (pSoldier.value.fNoAPToFinishMove && pSoldier.value.bLife >= OKLIFE) {
          AdjustNoAPToFinishMove(pSoldier, false);
          SoldierGotoStationaryStance(pSoldier);
        }

        // Cancel pending events
        pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
        pSoldier.value.ubPendingDirection = NO_PENDING_DIRECTION;
        pSoldier.value.ubPendingAction = NO_PENDING_ACTION;

        // Reset moved flag
        pSoldier.value.bMoved = false;

        // Set final destination
        pSoldier.value.sFinalDestination = pSoldier.value.sGridNo;

        // remove AI controlled flag
        pSoldier.value.uiStatusFlags &= ~SOLDIER_UNDERAICONTROL;
      }
    }
  }

  // Change music modes
  gfForceMusicToTense = true;

  SetMusicMode(Enum328.MUSIC_TACTICAL_ENEMYPRESENT);

  BetweenTurnsVisibilityAdjustments();

  // pause the AI for a bit
  PauseAITemporarily();

  // reset muzzle flashes
  TurnOffEveryonesMuzzleFlashes();

  // zap interrupt list
  ClearIntList();

  // dirty interface
  DirtyMercPanelInterface(MercPtrs[0], DIRTYLEVEL2);

  // ATE: If we are IN_CONV - DONT'T DO THIS!
  if (!(gTacticalStatus.uiFlags & ENGAGED_IN_CONV)) {
    HandleStrategicTurnImplicationsOfExitingCombatMode();
  }

  // Make sure next opplist decay DOES happen right after we go to RT
  // since this would be the same as what would happen at the end of the turn
  gTacticalStatus.uiTimeSinceLastOpplistDecay = Math.max(0, GetWorldTotalSeconds() - TIME_BETWEEN_RT_OPPLIST_DECAYS);
  NonCombatDecayPublicOpplist(GetWorldTotalSeconds());
}

export function SetEnemyPresence(): void {
  // We have an ememy present....

  // Check if we previously had no enemys present and we are in a virgin secotr ( no enemys spotted yet )
  if (!gTacticalStatus.fEnemyInSector && gTacticalStatus.fVirginSector) {
    // If we have a guy selected, say quote!
    // For now, display ono status message
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_INTERFACE, TacticalStr[Enum335.ENEMY_IN_SECTOR_STR]);

    // Change music modes..

    // If we are just starting game, don't do this!
    if (!DidGameJustStart() && !AreInMeanwhile()) {
      SetMusicMode(Enum328.MUSIC_TACTICAL_ENEMYPRESENT);
    }

    // Say quote...
    // SayQuoteFromAnyBodyInSector( QUOTE_ENEMY_PRESENCE );

    gTacticalStatus.fEnemyInSector = true;
  }
}

function SoldierHasSeenEnemiesLastFewTurns(pTeamSoldier: Pointer<SOLDIERTYPE>): boolean {
  let cnt2: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;

  for (cnt = 0; cnt < MAXTEAMS; cnt++) {
    if (gTacticalStatus.Team[cnt].bSide != pTeamSoldier.value.bSide) {
      // check this team for possible enemies
      cnt2 = gTacticalStatus.Team[cnt].bFirstID;
      for (pSoldier = MercPtrs[cnt2]; cnt2 <= gTacticalStatus.Team[cnt].bLastID; cnt2++, pSoldier++) {
        if (pSoldier.value.bActive && pSoldier.value.bInSector && (pSoldier.value.bTeam == gbPlayerNum || pSoldier.value.bLife >= OKLIFE)) {
          if (!CONSIDERED_NEUTRAL(pTeamSoldier, pSoldier) && (pTeamSoldier.value.bSide != pSoldier.value.bSide)) {
            // Have we not seen this guy.....
            if ((pTeamSoldier.value.bOppList[cnt2] >= SEEN_CURRENTLY) && (pTeamSoldier.value.bOppList[cnt2] <= SEEN_THIS_TURN)) {
              gTacticalStatus.bConsNumTurnsNotSeen = 0;
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

function WeSeeNoOne(): boolean {
  let uiLoop: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];
    if (pSoldier != null) {
      if (pSoldier.value.bTeam == gbPlayerNum) {
        if (pSoldier.value.bOppCnt > 0) {
          return false;
        }
      }
    }
  }

  return true;
}

function NobodyAlerted(): boolean {
  let uiLoop: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];
    if (pSoldier != null) {
      if ((pSoldier.value.bTeam != gbPlayerNum) && (!pSoldier.value.bNeutral) && (pSoldier.value.bLife >= OKLIFE) && (pSoldier.value.bAlertStatus >= Enum243.STATUS_RED)) {
        return false;
      }
    }
  }

  return true;
}

function WeSawSomeoneThisTurn(): boolean {
  let uiLoop: UINT32;
  let uiLoop2: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];
    if (pSoldier != null) {
      if (pSoldier.value.bTeam == gbPlayerNum) {
        for (uiLoop2 = gTacticalStatus.Team[ENEMY_TEAM].bFirstID; uiLoop2 < TOTAL_SOLDIERS; uiLoop2++) {
          if (pSoldier.value.bOppList[uiLoop2] == SEEN_THIS_TURN) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function SayBattleSoundFromAnyBodyInSector(iBattleSnd: INT32): void {
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
    if (OK_INSECTOR_MERC(pTeamSoldier) && !AM_AN_EPC(pTeamSoldier) && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_GASSED) && !(AM_A_ROBOT(pTeamSoldier)) && !pTeamSoldier.value.fMercAsleep) {
      ubMercsInSector[ubNumMercs] = cnt;
      ubNumMercs++;
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    DoMercBattleSound(MercPtrs[ubChosenMerc], iBattleSnd);
  }
}

export function CheckForEndOfCombatMode(fIncrementTurnsNotSeen: boolean): boolean {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: UINT32 = 0;
  let fWeSeeNoOne: boolean;
  let fNobodyAlerted: boolean;
  let fSayQuote: boolean = false;
  let fWeSawSomeoneRecently: boolean = false;
  let fSomeoneSawSomeoneRecently: boolean = false;

  // We can only check for end of combat if in combat mode
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    return false;
  }

  // if we're boxing NEVER end combat mode
  if (gTacticalStatus.bBoxingState == Enum247.BOXING) {
    return false;
  }

  // First check for end of battle....
  // If there are no enemies at all in the sector
  // Battle end should take presedence!
  if (CheckForEndOfBattle(false)) {
    return true;
  }

  fWeSeeNoOne = WeSeeNoOne();
  fNobodyAlerted = NobodyAlerted();
  if (fWeSeeNoOne && fNobodyAlerted) {
    // hack!!!
    gTacticalStatus.bConsNumTurnsNotSeen = 5;
  } else {
    // we have to loop through EVERYONE to see if anyone sees a hostile... if so, stay in turnbased...

    for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
      pTeamSoldier = MercSlots[cnt];
      if (pTeamSoldier && pTeamSoldier.value.bLife >= OKLIFE && !pTeamSoldier.value.bNeutral) {
        if (SoldierHasSeenEnemiesLastFewTurns(pTeamSoldier)) {
          gTacticalStatus.bConsNumTurnsNotSeen = 0;
          fSomeoneSawSomeoneRecently = true;
          if (pTeamSoldier.value.bTeam == gbPlayerNum || (pTeamSoldier.value.bTeam == MILITIA_TEAM && pTeamSoldier.value.bSide == 0)) // or friendly militia
          {
            fWeSawSomeoneRecently = true;
            break;
          }
        }
      }
    }

    if (fSomeoneSawSomeoneRecently) {
      if (fWeSawSomeoneRecently) {
        gTacticalStatus.bConsNumTurnsWeHaventSeenButEnemyDoes = 0;
      } else {
        // start tracking this
        gTacticalStatus.bConsNumTurnsWeHaventSeenButEnemyDoes++;
      }
      return false;
    }

    // IF here, we don;t see anybody.... increment count for end check
    if (fIncrementTurnsNotSeen) {
      gTacticalStatus.bConsNumTurnsNotSeen++;
    }
  }

  gTacticalStatus.bConsNumTurnsWeHaventSeenButEnemyDoes = 0;

  // If we have reach a point where a cons. number of turns gone by....
  if (gTacticalStatus.bConsNumTurnsNotSeen > 1) {
    gTacticalStatus.bConsNumTurnsNotSeen = 0;

    // Exit mode!
    ExitCombatMode();

    if (fNobodyAlerted) {
      // if we don't see anyone currently BUT we did see someone this turn, THEN don't
      // say quote
      if (fWeSeeNoOne && WeSawSomeoneThisTurn()) {
        // don't say quote
      } else {
        fSayQuote = true;
      }
    } else {
      fSayQuote = true;
    }

    // ATE: Are there creatures here? If so, say another quote...
    if (fSayQuote && (gTacticalStatus.uiFlags & IN_CREATURE_LAIR)) {
      SayQuoteFromAnyBodyInSector(Enum202.QUOTE_WORRIED_ABOUT_CREATURE_PRESENCE);
    }
    // Are we fighting bloodcats?
    else if (NumBloodcatsInSectorNotDeadOrDying() > 0) {
    } else {
      if (fSayQuote) {
        // Double check by seeing if we have any active enemies in sector!
        if (NumEnemyInSectorNotDeadOrDying() > 0) {
          SayQuoteFromAnyBodyInSector(Enum202.QUOTE_WARNING_OUTSTANDING_ENEMY_AFTER_RT);
        }
      }
    }
    /*
                    if ( (!fWeSeeNoOne || !fNobodyAlerted) && WeSawSomeoneThisTurn() )
                    {
                            // Say quote to the effect that the battle has lulled
                            SayQuoteFromAnyBodyInSector( QUOTE_WARNING_OUTSTANDING_ENEMY_AFTER_RT );
                    }
    */

    // Begin tense music....
    gfForceMusicToTense = true;
    SetMusicMode(Enum328.MUSIC_TACTICAL_ENEMYPRESENT);

    return true;
  }

  return false;
}

function DeathNoMessageTimerCallback(): void {
  CheckAndHandleUnloadingOfCurrentWorld();
}

//!!!!
// IMPORTANT NEW NOTE:
// Whenever returning TRUE, make sure you clear gfBlitBattleSectorLocator;
export function CheckForEndOfBattle(fAnEnemyRetreated: boolean): boolean {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let fBattleWon: boolean = true;
  let fBattleLost: boolean = false;
  let cnt: INT32 = 0;
  let usAnimState: UINT16;

  if (gTacticalStatus.bBoxingState == Enum247.BOXING) {
    // no way are we going to exit boxing prematurely, thank you! :-)
    return false;
  }

  // We can only check for end of battle if in combat mode or there are enemies
  // present (they might bleed to death or run off the map!)
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (!(gTacticalStatus.fEnemyInSector)) {
      // ATE: For demo, we may be dead....

      return false;
    }
  }

  // ATE: If attack busy count.. get out...
  if ((gTacticalStatus.ubAttackBusyCount > 0)) {
    return false;
  }

  // OK, this is to releave infinate looping...becasue we can kill guys in this function
  if (gfKillingGuysForLosingBattle) {
    return false;
  }

  // Check if the battle is won!
  if (NumCapableEnemyInSector() > 0) {
    fBattleWon = false;
  }

  if (CheckForLosingEndOfBattle() == true) {
    fBattleLost = true;
  }

  // NEW (Nov 24, 98)  by Kris
  if (!gbWorldSectorZ && fBattleWon) {
    // Check to see if more enemy soldiers exist in the strategic layer
    // It is possible to have more than 20 enemies in a sector.  By failing here,
    // it gives the engine a chance to add these soldiers as reinforcements.  This
    // is naturally handled.
    if (gfPendingEnemies) {
      fBattleWon = false;
    }
  }

  if ((fBattleLost) || (fBattleWon)) {
    if (!gbWorldSectorZ) {
      SectorInfo[SECTOR(gWorldSectorX, gWorldSectorY)].bLastKnownEnemies = NumEnemiesInSector(gWorldSectorX, gWorldSectorY);
    }
  }

  // We should NEVER have a battle lost and won at the same time...

  if (fBattleLost) {
    // CJC: End AI's turn here.... first... so that UnSetUIBusy will succeed if militia win
    // battle for us
    EndAllAITurns();

    // Set enemy presence to false
    // This is safe 'cause we're about to unload the friggen sector anyway....
    gTacticalStatus.fEnemyInSector = false;

    // If here, the battle has been lost!
    UnSetUIBusy(gusSelectedSoldier);

    if (gTacticalStatus.uiFlags & INCOMBAT) {
      // Exit mode!
      ExitCombatMode();
    }

    HandleMoraleEvent(null, Enum234.MORALE_HEARD_BATTLE_LOST, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
    HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_LOST, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

    // Play death music
    SetMusicMode(Enum328.MUSIC_TACTICAL_DEATH);
    SetCustomizableTimerCallbackAndDelay(10000, DeathNoMessageTimerCallback, false);

    if (CheckFact(Enum170.FACT_FIRST_BATTLE_BEING_FOUGHT, 0)) {
      // this is our first battle... and we lost it!
      SetFactTrue(Enum170.FACT_FIRST_BATTLE_FOUGHT);
      SetFactFalse(Enum170.FACT_FIRST_BATTLE_BEING_FOUGHT);
      SetTheFirstBattleSector((gWorldSectorX + gWorldSectorY * MAP_WORLD_X));
      HandleFirstBattleEndingWhileInTown(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, false);
    }

    if (NumEnemyInSectorExceptCreatures()) {
      SetThisSectorAsEnemyControlled(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, true);
    }

    // ATE: Important! THis is delayed until music ends so we can have proper effect!
    // CheckAndHandleUnloadingOfCurrentWorld();

    // Whenever returning TRUE, make sure you clear gfBlitBattleSectorLocator;
    LogBattleResults(Enum165.LOG_DEFEAT);
    gfBlitBattleSectorLocator = false;
    return true;
  }

  // If battle won, do stuff right away!
  if (fBattleWon) {
    if (gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) // if boxing don't do any of this stuff
    {
      gTacticalStatus.fLastBattleWon = true;

      // OK, KILL any enemies that are incompacitated
      if (KillIncompacitatedEnemyInSector()) {
        return false;
      }
    }

    // If here, the battle has been won!
    // hurray! a glorious victory!

    // Set enemy presence to false
    gTacticalStatus.fEnemyInSector = false;

    // CJC: End AI's turn here.... first... so that UnSetUIBusy will succeed if militia win
    // battle for us
    EndAllAITurns();

    UnSetUIBusy(gusSelectedSoldier);

    // ATE:
    // If we ended battle in any team other than the player's
    // we need to end the UI lock using this method....
    guiPendingOverrideEvent = Enum207.LU_ENDUILOCK;
    HandleTacticalUI();

    if (gTacticalStatus.uiFlags & INCOMBAT) {
      // Exit mode!
      ExitCombatMode();
    }

    if (gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) // if boxing don't do any of this stuff
    {
      // Only do some stuff if we actually faught a battle
      if (gTacticalStatus.bNumFoughtInBattle[ENEMY_TEAM] + gTacticalStatus.bNumFoughtInBattle[CREATURE_TEAM] + gTacticalStatus.bNumFoughtInBattle[CIV_TEAM] > 0)
      // if ( gTacticalStatus.bNumEnemiesFoughtInBattle > 0 )
      {
        // Loop through all mercs and make go
        for (pTeamSoldier = MercPtrs[gTacticalStatus.Team[gbPlayerNum].bFirstID]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
          if (pTeamSoldier.value.bActive) {
            if (pTeamSoldier.value.bInSector) {
              if (pTeamSoldier.value.bTeam == gbPlayerNum) {
                gMercProfiles[pTeamSoldier.value.ubProfile].usBattlesFought++;

                // If this guy is OKLIFE & not standing, make stand....
                if (pTeamSoldier.value.bLife >= OKLIFE && !pTeamSoldier.value.bCollapsed) {
                  if (pTeamSoldier.value.bAssignment < Enum117.ON_DUTY) {
                    // Reset some quote flags....
                    pTeamSoldier.value.usQuoteSaidExtFlags &= (~SOLDIER_QUOTE_SAID_BUDDY_1_WITNESSED);
                    pTeamSoldier.value.usQuoteSaidExtFlags &= (~SOLDIER_QUOTE_SAID_BUDDY_2_WITNESSED);
                    pTeamSoldier.value.usQuoteSaidExtFlags &= (~SOLDIER_QUOTE_SAID_BUDDY_3_WITNESSED);

                    // toggle stealth mode....
                    gfUIStanceDifferent = true;
                    pTeamSoldier.value.bStealthMode = false;
                    fInterfacePanelDirty = DIRTYLEVEL2;

                    if (gAnimControl[pTeamSoldier.value.usAnimState].ubHeight != ANIM_STAND) {
                      ChangeSoldierStance(pTeamSoldier, ANIM_STAND);
                    } else {
                      // If they are aiming, end aim!
                      usAnimState = PickSoldierReadyAnimation(pTeamSoldier, true);

                      if (usAnimState != INVALID_ANIMATION) {
                        EVENT_InitNewSoldierAnim(pTeamSoldier, usAnimState, 0, false);
                      }
                    }
                  }
                }
              }
            }
          }
        }

        HandleMoraleEvent(null, Enum234.MORALE_BATTLE_WON, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
        HandleGlobalLoyaltyEvent(Enum190.GLOBAL_LOYALTY_BATTLE_WON, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

        // Change music modes
        if (gfLastMercTalkedAboutKillingID == NOBODY || (gfLastMercTalkedAboutKillingID != NOBODY && !(MercPtrs[gfLastMercTalkedAboutKillingID].value.uiStatusFlags & SOLDIER_MONSTER))) {
          SetMusicMode(Enum328.MUSIC_TACTICAL_VICTORY);

          ShouldBeginAutoBandage();
        } else if (gfLastMercTalkedAboutKillingID != NOBODY && (MercPtrs[gfLastMercTalkedAboutKillingID].value.uiStatusFlags & SOLDIER_MONSTER)) {
          ShouldBeginAutoBandage();
        }

        // Say battle end quote....

        if (fAnEnemyRetreated) {
          SayQuoteFromAnyBodyInSector(Enum202.QUOTE_ENEMY_RETREATED);
        } else {
          // OK, If we have just finished a battle with creatures........ play killed creature quote...
          //
          if (gfLastMercTalkedAboutKillingID != NOBODY && (MercPtrs[gfLastMercTalkedAboutKillingID].value.uiStatusFlags & SOLDIER_MONSTER)) {
          } else if (gfLastMercTalkedAboutKillingID != NOBODY && (MercPtrs[gfLastMercTalkedAboutKillingID].value.ubBodyType == Enum194.BLOODCAT)) {
            SayBattleSoundFromAnyBodyInSector(Enum259.BATTLE_SOUND_COOL1);
          } else {
            SayQuoteFromAnyBodyInSector(Enum202.QUOTE_SECTOR_SAFE);
          }
        }
      } else {
        // Change to nothing music...
        SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);
        ShouldBeginAutoBandage();
      }

      // Loop through all militia and restore them to peaceful status
      cnt = gTacticalStatus.Team[MILITIA_TEAM].bFirstID;
      for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; cnt++, pTeamSoldier++) {
        if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
          pTeamSoldier.value.bAlertStatus = Enum243.STATUS_GREEN;
          CheckForChangingOrders(pTeamSoldier);
          pTeamSoldier.value.sNoiseGridno = NOWHERE;
          pTeamSoldier.value.ubNoiseVolume = 0;
          pTeamSoldier.value.bNewSituation = false;
          pTeamSoldier.value.bOrders = Enum241.STATIONARY;
          if (pTeamSoldier.value.bLife >= OKLIFE) {
            pTeamSoldier.value.bBleeding = 0;
          }
        }
      }
      gTacticalStatus.Team[MILITIA_TEAM].bAwareOfOpposition = false;

      // Loop through all civs and restore them to peaceful status
      cnt = gTacticalStatus.Team[CIV_TEAM].bFirstID;
      for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[CIV_TEAM].bLastID; cnt++, pTeamSoldier++) {
        if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
          pTeamSoldier.value.bAlertStatus = Enum243.STATUS_GREEN;
          pTeamSoldier.value.sNoiseGridno = NOWHERE;
          pTeamSoldier.value.ubNoiseVolume = 0;
          pTeamSoldier.value.bNewSituation = false;
          CheckForChangingOrders(pTeamSoldier);
        }
      }
      gTacticalStatus.Team[CIV_TEAM].bAwareOfOpposition = false;
    }

    fInterfacePanelDirty = DIRTYLEVEL2;

    if (gTacticalStatus.bBoxingState == Enum247.NOT_BOXING) // if boxing don't do any of this stuff
    {
      LogBattleResults(Enum165.LOG_VICTORY);

      SetThisSectorAsPlayerControlled(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, true);
      HandleVictoryInNPCSector(gWorldSectorX, gWorldSectorY, gbWorldSectorZ);
      if (CheckFact(Enum170.FACT_FIRST_BATTLE_BEING_FOUGHT, 0)) {
        // ATE: Need to trigger record for this event .... for NPC scripting
        TriggerNPCRecord(Enum268.PACOS, 18);

        // this is our first battle... and we won!
        SetFactTrue(Enum170.FACT_FIRST_BATTLE_FOUGHT);
        SetFactTrue(Enum170.FACT_FIRST_BATTLE_WON);
        SetFactFalse(Enum170.FACT_FIRST_BATTLE_BEING_FOUGHT);
        SetTheFirstBattleSector((gWorldSectorX + gWorldSectorY * MAP_WORLD_X));
        HandleFirstBattleEndingWhileInTown(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, false);
      }
    }

    // Whenever returning TRUE, make sure you clear gfBlitBattleSectorLocator;
    gfBlitBattleSectorLocator = false;
    return true;
  }

  return false;
}

export function CycleThroughKnownEnemies(): void {
  // static to indicate last position we were at:
  let pSoldier: Pointer<SOLDIERTYPE>;
  /* static */ let fFirstTime: boolean = true;
  /* static */ let usStartToLook: UINT16;
  let cnt: UINT32;
  let fEnemyBehindStartLook: boolean = false;
  let fEnemiesFound: boolean = false;

  if (fFirstTime) {
    fFirstTime = false;

    usStartToLook = gTacticalStatus.Team[gbPlayerNum].bLastID;
  }

  for (cnt = gTacticalStatus.Team[gbPlayerNum].bLastID, pSoldier = MercPtrs[cnt]; cnt < TOTAL_SOLDIERS; cnt++, pSoldier++) {
    // try to find first active, OK enemy
    if (pSoldier.value.bActive && pSoldier.value.bInSector && !pSoldier.value.bNeutral && (pSoldier.value.bSide != gbPlayerNum) && (pSoldier.value.bLife > 0)) {
      if (pSoldier.value.bVisible != -1) {
        fEnemiesFound = true;

        // If we are > ok start, this is the one!
        if (cnt > usStartToLook) {
          usStartToLook = cnt;

          // Locate to!
          // LocateSoldier( pSoldier->ubID, 1 );

          // ATE: Change to Slide To...
          SlideTo(0, pSoldier.value.ubID, 0, SETANDREMOVEPREVIOUSLOCATOR);
          return;
        } else {
          fEnemyBehindStartLook = true;
        }
      }
    }
  }

  if (!fEnemiesFound) {
    ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_UI_FEEDBACK, TacticalStr[Enum335.NO_ENEMIES_IN_SIGHT_STR]);
  }

  // If here, we found nobody, but there may be someone behind
  // If to, recurse!
  if (fEnemyBehindStartLook) {
    usStartToLook = gTacticalStatus.Team[gbPlayerNum].bLastID;

    CycleThroughKnownEnemies();
  }
}

export function CycleVisibleEnemies(pSrcSoldier: Pointer<SOLDIERTYPE>): void {
  // static to indicate last position we were at:
  let pSoldier: Pointer<SOLDIERTYPE>;
  let usStartToLook: UINT16;
  let cnt: UINT32;

  usStartToLook = gTacticalStatus.Team[gbPlayerNum].bLastID;

  for (cnt = gTacticalStatus.Team[gbPlayerNum].bLastID, pSoldier = MercPtrs[cnt]; cnt < TOTAL_SOLDIERS; cnt++, pSoldier++) {
    // try to find first active, OK enemy
    if (pSoldier.value.bActive && pSoldier.value.bInSector && !pSoldier.value.bNeutral && (pSoldier.value.bSide != gbPlayerNum) && (pSoldier.value.bLife > 0)) {
      if (pSrcSoldier.value.bOppList[pSoldier.value.ubID] == SEEN_CURRENTLY) {
        // If we are > ok start, this is the one!
        if (cnt > pSrcSoldier.value.ubLastEnemyCycledID) {
          pSrcSoldier.value.ubLastEnemyCycledID = cnt;

          // ATE: Change to Slide To...
          SlideTo(0, pSoldier.value.ubID, 0, SETANDREMOVEPREVIOUSLOCATOR);

          ChangeInterfaceLevel(pSoldier.value.bLevel);
          return;
        }
      }
    }
  }

  // If here.. reset to zero...
  pSrcSoldier.value.ubLastEnemyCycledID = 0;

  usStartToLook = gTacticalStatus.Team[gbPlayerNum].bLastID;
  for (cnt = gTacticalStatus.Team[gbPlayerNum].bLastID, pSoldier = MercPtrs[cnt]; cnt < TOTAL_SOLDIERS; cnt++, pSoldier++) {
    // try to find first active, OK enemy
    if (pSoldier.value.bActive && pSoldier.value.bInSector && !pSoldier.value.bNeutral && (pSoldier.value.bSide != gbPlayerNum) && (pSoldier.value.bLife > 0)) {
      if (pSrcSoldier.value.bOppList[pSoldier.value.ubID] == SEEN_CURRENTLY) {
        // If we are > ok start, this is the one!
        if (cnt > pSrcSoldier.value.ubLastEnemyCycledID) {
          pSrcSoldier.value.ubLastEnemyCycledID = cnt;

          // ATE: Change to Slide To...
          SlideTo(0, pSoldier.value.ubID, 0, SETANDREMOVEPREVIOUSLOCATOR);

          ChangeInterfaceLevel(pSoldier.value.bLevel);
          return;
        }
      }
    }
  }
}

function CountNonVehiclesOnPlayerTeam(): INT8 {
  let cnt: UINT32;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let bNumber: INT8 = 0;

  for (cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID, pSoldier = MercPtrs[cnt]; cnt <= (gTacticalStatus.Team[gbPlayerNum].bLastID); cnt++, pSoldier++) {
    if (pSoldier.value.bActive && !(pSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
      bNumber++;
    }
  }

  return bNumber;
}

export function PlayerTeamFull(): boolean {
  // last ID for the player team is 19, so long as we have at most 17 non-vehicles...
  if (CountNonVehiclesOnPlayerTeam() <= gTacticalStatus.Team[gbPlayerNum].bLastID - 2) {
    return false;
  }

  return true;
}

export function NumPCsInSector(): UINT8 {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: UINT32 = 0;
  let ubNumPlayers: UINT8 = 0;

  // Check if the battle is won!
  // Loop through all mercs and make go
  for (cnt = 0; cnt < guiNumMercSlots; cnt++) {
    if (MercSlots[cnt]) {
      pTeamSoldier = MercSlots[cnt];
      if (pTeamSoldier.value.bTeam == gbPlayerNum && pTeamSoldier.value.bLife > 0) {
        ubNumPlayers++;
      }
    }
  }

  return ubNumPlayers;
}

export function NumEnemyInSector(): UINT8 {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let ubNumEnemies: UINT8 = 0;

  // Check if the battle is won!
  // Loop through all mercs and make go
  for (pTeamSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pTeamSoldier++, cnt++) {
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bLife > 0) {
      // Checkf for any more bacguys
      if (!pTeamSoldier.value.bNeutral && (pTeamSoldier.value.bSide != 0)) {
        ubNumEnemies++;
      }
    }
  }

  return ubNumEnemies;
}

function NumEnemyInSectorExceptCreatures(): UINT8 {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let ubNumEnemies: UINT8 = 0;

  // Check if the battle is won!
  // Loop through all mercs and make go
  for (pTeamSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pTeamSoldier++, cnt++) {
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bLife > 0 && pTeamSoldier.value.bTeam != CREATURE_TEAM) {
      // Checkf for any more bacguys
      if (!pTeamSoldier.value.bNeutral && (pTeamSoldier.value.bSide != 0)) {
        ubNumEnemies++;
      }
    }
  }

  return ubNumEnemies;
}

function NumEnemyInSectorNotDeadOrDying(): UINT8 {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let ubNumEnemies: UINT8 = 0;

  // Check if the battle is won!
  // Loop through all mercs and make go
  for (pTeamSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pTeamSoldier++, cnt++) {
    // Kill those not already dead.,...
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
      // For sure for flag thet they are dead is not set
      if (!(pTeamSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
        // Also, we want to pick up unconcious guys as NOT being capable,
        // but we want to make sure we don't get those ones that are in the
        // process of dying
        if (pTeamSoldier.value.bLife >= OKLIFE) {
          // Check for any more badguys
          if (!pTeamSoldier.value.bNeutral && (pTeamSoldier.value.bSide != 0)) {
            ubNumEnemies++;
          }
        }
      }
    }
  }

  return ubNumEnemies;
}

function NumBloodcatsInSectorNotDeadOrDying(): UINT8 {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let ubNumEnemies: UINT8 = 0;

  // Check if the battle is won!
  // Loop through all mercs and make go
  for (pTeamSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pTeamSoldier++, cnt++) {
    // Kill those not already dead.,...
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
      if (pTeamSoldier.value.ubBodyType == Enum194.BLOODCAT) {
        // For sure for flag thet they are dead is not set
        if (!(pTeamSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
          // Also, we want to pick up unconcious guys as NOT being capable,
          // but we want to make sure we don't get those ones that are in the
          // process of dying
          if (pTeamSoldier.value.bLife >= OKLIFE) {
            // Check for any more badguys
            if (!pTeamSoldier.value.bNeutral && (pTeamSoldier.value.bSide != 0)) {
              ubNumEnemies++;
            }
          }
        }
      }
    }
  }

  return ubNumEnemies;
}

export function NumCapableEnemyInSector(): UINT8 {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let ubNumEnemies: UINT8 = 0;

  // Check if the battle is won!
  // Loop through all mercs and make go
  for (pTeamSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pTeamSoldier++, cnt++) {
    // Kill those not already dead.,...
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
      // For sure for flag thet they are dead is not set
      if (!(pTeamSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
        // Also, we want to pick up unconcious guys as NOT being capable,
        // but we want to make sure we don't get those ones that are in the
        // process of dying
        if (pTeamSoldier.value.bLife < OKLIFE && pTeamSoldier.value.bLife != 0) {
        } else {
          // Check for any more badguys
          if (!pTeamSoldier.value.bNeutral && (pTeamSoldier.value.bSide != 0)) {
            ubNumEnemies++;
          }
        }
      }
    }
  }

  return ubNumEnemies;
}

function CheckForLosingEndOfBattle(): boolean {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let ubNumEnemies: UINT8 = 0;
  let bNumDead: INT8 = 0;
  let bNumNotOK: INT8 = 0;
  let bNumInBattle: INT8 = 0;
  let bNumNotOKRealMercs: INT8 = 0;
  let fMadeCorpse: boolean;
  let fDoCapture: boolean = false;
  let fOnlyEPCsLeft: boolean = true;
  let fMilitiaInSector: boolean = false;

  // ATE: Check for MILITIA - we won't lose if we have some.....
  cnt = gTacticalStatus.Team[MILITIA_TEAM].bFirstID;
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; cnt++, pTeamSoldier++) {
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bSide == gbPlayerNum) {
      if (pTeamSoldier.value.bLife >= OKLIFE) {
        // We have at least one poor guy who will still fight....
        // we have not lost ( yet )!
        fMilitiaInSector = true;
      }
    }
  }

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
    // Are we active and in sector.....
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_VEHICLE)) {
      bNumInBattle++;

      if (pTeamSoldier.value.bLife == 0) {
        bNumDead++;
      } else if (pTeamSoldier.value.bLife < OKLIFE) {
        bNumNotOK++;

        if (!AM_AN_EPC(pTeamSoldier) && !AM_A_ROBOT(pTeamSoldier)) {
          bNumNotOKRealMercs++;
        }
      } else {
        if (!AM_A_ROBOT(pTeamSoldier) || !AM_AN_EPC(pTeamSoldier)) {
          fOnlyEPCsLeft = false;
        }
      }
    }
  }

  // OK< check ALL in battle, if that matches SUM of dead, incompacitated, we're done!
  if ((bNumDead + bNumNotOK) == bNumInBattle || fOnlyEPCsLeft) {
    // Are there militia in sector?
    if (fMilitiaInSector) {
      if (guiCurrentScreen != Enum26.AUTORESOLVE_SCREEN) {
        // if here, check if we should autoresolve.
        // if we have at least one guy unconscious, call below function...
        if (HandlePotentialBringUpAutoresolveToFinishBattle()) {
          // return false here as we are autoresolving...
          return false;
        }
      } else {
        return false;
      }
    }

    // Bring up box if we have ANY guy incompaciteded.....
    if (bNumDead != bNumInBattle) {
      // If we get captured...
      // Your unconscious mercs are captured!

      // Check if we should get captured....
      if (bNumNotOKRealMercs < 4 && bNumNotOKRealMercs > 1) {
        // Check if any enemies exist....
        if (gTacticalStatus.Team[ENEMY_TEAM].bMenInSector > 0) {
          // if( GetWorldDay() > STARTDAY_ALLOW_PLAYER_CAPTURE_FOR_RESCUE && !( gStrategicStatus.uiFlags & STRATEGIC_PLAYER_CAPTURED_FOR_RESCUE ))
          {
            if (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTNOTSTARTED || (gubQuest[Enum169.QUEST_HELD_IN_ALMA] == QUESTDONE && gubQuest[Enum169.QUEST_INTERROGATION] == QUESTNOTSTARTED)) {
              fDoCapture = true;
              // CJC Dec 1 2002: fix capture sequences
              BeginCaptureSquence();
            }
          }
        }
      }

      gfKillingGuysForLosingBattle = true;

      // KIll them now...
      // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
      cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

      for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
        // Are we active and in sector.....
        if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
          if (pTeamSoldier.value.bLife != 0 && pTeamSoldier.value.bLife < OKLIFE || AM_AN_EPC(pTeamSoldier) || AM_A_ROBOT(pTeamSoldier)) {
            // Captured EPCs or ROBOTS will be kiiled in capture routine....
            if (!fDoCapture) {
              // Kill!
              pTeamSoldier.value.bLife = 0;

              HandleSoldierDeath(pTeamSoldier, addressof(fMadeCorpse));

              // HandlePlayerTeamMemberDeath( pTeamSoldier );
              // Make corpse..
              // TurnSoldierIntoCorpse( pTeamSoldier, TRUE, TRUE );
            }
          }

          // ATE: if we are told to do capture....
          if (pTeamSoldier.value.bLife != 0 && fDoCapture) {
            EnemyCapturesPlayerSoldier(pTeamSoldier);

            RemoveSoldierFromTacticalSector(pTeamSoldier, true);
          }
        }
      }

      gfKillingGuysForLosingBattle = false;

      if (fDoCapture) {
        EndCaptureSequence();
        SetCustomizableTimerCallbackAndDelay(3000, CaptureTimerCallback, false);
      } else {
        SetCustomizableTimerCallbackAndDelay(10000, DeathTimerCallback, false);
      }
    }
    return true;
  }

  return false;
}

function KillIncompacitatedEnemyInSector(): boolean {
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32 = 0;
  let ubNumEnemies: UINT8 = 0;
  let fReturnVal: boolean = false;

  // Check if the battle is won!
  // Loop through all mercs and make go
  for (pTeamSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pTeamSoldier++, cnt++) {
    if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector && pTeamSoldier.value.bLife < OKLIFE && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_DEAD)) {
      // Checkf for any more bacguys
      if (!pTeamSoldier.value.bNeutral && (pTeamSoldier.value.bSide != gbPlayerNum)) {
        // KIll......
        SoldierTakeDamage(pTeamSoldier, ANIM_CROUCH, pTeamSoldier.value.bLife, 100, TAKE_DAMAGE_BLOODLOSS, NOBODY, NOWHERE, 0, true);
        fReturnVal = true;
      }
    }
  }
  return fReturnVal;
}

function AttackOnGroupWitnessed(pSoldier: Pointer<SOLDIERTYPE>, pTarget: Pointer<SOLDIERTYPE>): boolean {
  let uiSlot: UINT32;
  let pGroupMember: Pointer<SOLDIERTYPE>;

  // look for all group members... rebels could be on the civ team or ours!
  for (uiSlot = 0; uiSlot < guiNumMercSlots; uiSlot++) {
    pGroupMember = MercSlots[uiSlot];
    if (pGroupMember && (pGroupMember.value.ubCivilianGroup == pTarget.value.ubCivilianGroup) && pGroupMember != pTarget) {
      if (pGroupMember.value.bOppList[pSoldier.value.ubID] == SEEN_CURRENTLY || pGroupMember.value.bOppList[pTarget.value.ubID] == SEEN_CURRENTLY) {
        return true;
      }
      if (SpacesAway(pGroupMember.value.sGridNo, pSoldier.value.sGridNo) < 12 || SpacesAway(pGroupMember.value.sGridNo, pTarget.value.sGridNo) < 12) {
        return true;
      }
    }
  }

  return false;
}

function CalcSuppressionTolerance(pSoldier: Pointer<SOLDIERTYPE>): INT8 {
  let bTolerance: INT8;

  // Calculate basic tolerance value
  bTolerance = pSoldier.value.bExpLevel * 2;
  if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
    // give +1 for every 10% morale from 50, for a maximum bonus/penalty of 5.
    bTolerance += (pSoldier.value.bMorale - 50) / 10;
  } else {
    // give +2 for every morale category from normal, for a max change of 4
    bTolerance += (pSoldier.value.bAIMorale - Enum244.MORALE_NORMAL) * 2;
  }

  if (pSoldier.value.ubProfile != NO_PROFILE) {
    // change tolerance based on attitude
    switch (gMercProfiles[pSoldier.value.ubProfile].bAttitude) {
      case Enum271.ATT_AGGRESSIVE:
        bTolerance += 2;
        break;
      case Enum271.ATT_COWARD:
        bTolerance += -2;
        break;
      default:
        break;
    }
  } else {
    // generic NPC/civvie; change tolerance based on attitude
    switch (pSoldier.value.bAttitude) {
      case Enum242.BRAVESOLO:
      case Enum242.BRAVEAID:
        bTolerance += 2;
        break;
      case Enum242.AGGRESSIVE:
        bTolerance += 1;
        break;
      case Enum242.DEFENSIVE:
        bTolerance += -1;
        break;
      default:
        break;
    }
  }

  if (bTolerance < 0) {
    bTolerance = 0;
  }

  return bTolerance;
}

const MAX_APS_SUPPRESSED = 8;
function HandleSuppressionFire(ubTargetedMerc: UINT8, ubCausedAttacker: UINT8): void {
  let bTolerance: INT8;
  let sClosestOpponent: INT16;
  let sClosestOppLoc: INT16;
  let ubPointsLost: UINT8;
  let ubTotalPointsLost: UINT8;
  let ubNewStance: UINT8;
  let uiLoop: UINT32;
  let ubLoop2: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  for (uiLoop = 0; uiLoop < guiNumMercSlots; uiLoop++) {
    pSoldier = MercSlots[uiLoop];
    if (pSoldier && IS_MERC_BODY_TYPE(pSoldier) && pSoldier.value.bLife >= OKLIFE && pSoldier.value.ubSuppressionPoints > 0) {
      bTolerance = CalcSuppressionTolerance(pSoldier);

      // multiply by 2, add 1 and divide by 2 to round off to nearest whole number
      ubPointsLost = (((pSoldier.value.ubSuppressionPoints * 6) / (bTolerance + 6)) * 2 + 1) / 2;

      // reduce loss of APs based on stance
      // ATE: Taken out because we can possibly supress ourselves...
      // switch (gAnimControl[ pSoldier->usAnimState ].ubEndHeight)
      //{
      //	case ANIM_PRONE:
      //		ubPointsLost = ubPointsLost * 2 / 4;
      //		break;
      //	case ANIM_CROUCH:
      //		ubPointsLost = ubPointsLost * 3 / 4;
      //		break;
      //	default:
      //		break;
      //}

      // cap the # of APs we can lose
      if (ubPointsLost > MAX_APS_SUPPRESSED) {
        ubPointsLost = MAX_APS_SUPPRESSED;
      }

      ubTotalPointsLost = ubPointsLost;

      // Subtract off the APs lost before this point to find out how many points are lost now
      if (pSoldier.value.ubAPsLostToSuppression >= ubPointsLost) {
        continue;
      }

      // morale modifier
      if (ubTotalPointsLost / 2 > pSoldier.value.ubAPsLostToSuppression / 2) {
        for (ubLoop2 = 0; ubLoop2 < (ubTotalPointsLost / 2) - (pSoldier.value.ubAPsLostToSuppression / 2); ubLoop2++) {
          HandleMoraleEvent(pSoldier, Enum234.MORALE_SUPPRESSED, pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ);
        }
      }

      ubPointsLost -= pSoldier.value.ubAPsLostToSuppression;
      ubNewStance = 0;

      // merc may get to react
      if (pSoldier.value.ubSuppressionPoints >= (130 / (6 + bTolerance))) {
        // merc gets to use APs to react!
        switch (gAnimControl[pSoldier.value.usAnimState].ubEndHeight) {
          case ANIM_PRONE:
            // can't change stance below prone!
            break;
          case ANIM_CROUCH:
            if (ubTotalPointsLost >= AP_PRONE && IsValidStance(pSoldier, ANIM_PRONE)) {
              sClosestOpponent = ClosestKnownOpponent(pSoldier, addressof(sClosestOppLoc), null);
              if (sClosestOpponent == NOWHERE || SpacesAway(pSoldier.value.sGridNo, sClosestOppLoc) > 8) {
                if (ubPointsLost < AP_PRONE) {
                  // Have to give APs back so that we can change stance without
                  // losing more APs
                  pSoldier.value.bActionPoints += (AP_PRONE - ubPointsLost);
                  ubPointsLost = 0;
                } else {
                  ubPointsLost -= AP_PRONE;
                }
                ubNewStance = ANIM_PRONE;
              }
            }
            break;
          default: // standing!
            if (pSoldier.value.bOverTerrainType == Enum315.LOW_WATER || pSoldier.value.bOverTerrainType == Enum315.DEEP_WATER) {
              // can't change stance here!
              break;
            } else if (ubTotalPointsLost >= (AP_CROUCH + AP_PRONE) && (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_PRONE) && IsValidStance(pSoldier, ANIM_PRONE)) {
              sClosestOpponent = ClosestKnownOpponent(pSoldier, addressof(sClosestOppLoc), null);
              if (sClosestOpponent == NOWHERE || SpacesAway(pSoldier.value.sGridNo, sClosestOppLoc) > 8) {
                if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND) {
                  // can only crouch for now
                  ubNewStance = ANIM_CROUCH;
                } else {
                  // lie prone!
                  ubNewStance = ANIM_PRONE;
                }
              } else if (gAnimControl[pSoldier.value.usAnimState].ubEndHeight == ANIM_STAND && IsValidStance(pSoldier, ANIM_CROUCH)) {
                // crouch, at least!
                ubNewStance = ANIM_CROUCH;
              }
            } else if (ubTotalPointsLost >= AP_CROUCH && (gAnimControl[pSoldier.value.usAnimState].ubEndHeight != ANIM_CROUCH) && IsValidStance(pSoldier, ANIM_CROUCH)) {
              // crouch!
              ubNewStance = ANIM_CROUCH;
            }
            break;
        }
      }

      // Reduce action points!
      pSoldier.value.bActionPoints -= ubPointsLost;
      pSoldier.value.ubAPsLostToSuppression = ubTotalPointsLost;

      if ((pSoldier.value.uiStatusFlags & SOLDIER_PC) && (pSoldier.value.ubSuppressionPoints > 8) && (pSoldier.value.ubID == ubTargetedMerc)) {
        if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_BEING_PUMMELED)) {
          pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_BEING_PUMMELED;
          // say we're under heavy fire!

          // ATE: For some reason, we forgot #53!
          if (pSoldier.value.ubProfile != 53) {
            TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_UNDER_HEAVY_FIRE);
          }
        }
      }

      if (ubNewStance != 0) {
        // This person is going to change stance

        // This person will be busy while they crouch or go prone
        if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) {
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting suppression, on %d", pSoldier.value.ubID));

          gTacticalStatus.ubAttackBusyCount++;

          // make sure supressor ID is the same!
          pSoldier.value.ubSuppressorID = ubCausedAttacker;
        }
        pSoldier.value.fChangingStanceDueToSuppression = true;
        pSoldier.value.fDontChargeAPsForStanceChange = true;

        // AI people will have to have their actions cancelled
        if (!(pSoldier.value.uiStatusFlags & SOLDIER_PC)) {
          CancelAIAction(pSoldier, true);
          pSoldier.value.bAction = Enum289.AI_ACTION_CHANGE_STANCE;
          pSoldier.value.usActionData = ubNewStance;
          pSoldier.value.bActionInProgress = true;
        }

        // go for it!
        // ATE: Cancel any PENDING ANIMATIONS...
        pSoldier.value.usPendingAnimation = NO_PENDING_ANIMATION;
        // ATE: Turn off non-interrupt flag ( this NEEDS to be done! )
        pSoldier.value.fInNonintAnim = false;
        pSoldier.value.fRTInNonintAnim = false;

        ChangeSoldierStance(pSoldier, ubNewStance);
      }
    } // end of examining one soldier
  } // end of loop
}

export function ProcessImplicationsOfPCAttack(pSoldier: Pointer<SOLDIERTYPE>, ppTarget: Pointer<Pointer<SOLDIERTYPE>>, bReason: INT8): boolean {
  let sTargetXPos: INT16;
  let sTargetYPos: INT16;
  let fEnterCombat: boolean = true;
  let pTarget: Pointer<SOLDIERTYPE> = ppTarget.value;

  if (pTarget.value.fAIFlags & AI_ASLEEP) {
    // waaaaaaaaaaaaake up!
    pTarget.value.fAIFlags &= (~AI_ASLEEP);
  }

  if (pTarget.value.ubProfile == Enum268.PABLO && CheckFact(Enum170.FACT_PLAYER_FOUND_ITEMS_MISSING, 0)) {
    SetFactTrue(Enum170.FACT_PABLO_PUNISHED_BY_PLAYER);
  }

  if (gTacticalStatus.bBoxingState == Enum247.BOXING) {
    // should have a check for "in boxing ring", no?
    if ((pSoldier.value.usAttackingWeapon != NOTHING && pSoldier.value.usAttackingWeapon != Enum225.BRASS_KNUCKLES) || !(pSoldier.value.uiStatusFlags & SOLDIER_BOXER)) {
      // someone's cheating!
      if ((Item[pSoldier.value.usAttackingWeapon].usItemClass == IC_BLADE || Item[pSoldier.value.usAttackingWeapon].usItemClass == IC_PUNCH) && (pTarget.value.uiStatusFlags & SOLDIER_BOXER)) {
        // knife or brass knuckles disqualify the player!
        BoxingPlayerDisqualified(pSoldier, Enum199.BAD_ATTACK);
      } else {
        // anything else is open war!
        // gTacticalStatus.bBoxingState = NOT_BOXING;
        SetBoxingState(Enum247.NOT_BOXING);
        // if we are attacking a boxer we should set them to neutral (temporarily) so that the rest of the civgroup code works...
        if ((pTarget.value.bTeam == CIV_TEAM) && (pTarget.value.uiStatusFlags & SOLDIER_BOXER)) {
          SetSoldierNeutral(pTarget);
        }
      }
    }
  }

  if ((pTarget.value.bTeam == MILITIA_TEAM) && (pTarget.value.bSide == gbPlayerNum)) {
    // rebel militia attacked by the player!
    MilitiaChangesSides();
  }
  // JA2 Gold: fix Slay
  else if ((pTarget.value.bTeam == CIV_TEAM && pTarget.value.bNeutral) && pTarget.value.ubProfile == Enum268.SLAY && pTarget.value.bLife >= OKLIFE && CheckFact(155, 0) == false) {
    TriggerNPCRecord(Enum268.SLAY, 1);
  } else if ((pTarget.value.bTeam == CIV_TEAM) && (pTarget.value.ubCivilianGroup == 0) && (pTarget.value.bNeutral) && !(pTarget.value.uiStatusFlags & SOLDIER_VEHICLE)) {
    if (pTarget.value.ubBodyType == Enum194.COW && gWorldSectorX == 10 && gWorldSectorY == MAP_ROW_F) {
      // hicks could get mad!!!
      HickCowAttacked(pSoldier, pTarget);
    } else if (pTarget.value.ubProfile == Enum268.PABLO && pTarget.value.bLife >= OKLIFE && CheckFact(Enum170.FACT_PABLO_PUNISHED_BY_PLAYER, 0) && !CheckFact(38, 0)) {
      TriggerNPCRecord(Enum268.PABLO, 3);
    } else {
      // regular civ attacked, turn non-neutral
      AddToShouldBecomeHostileOrSayQuoteList(pTarget.value.ubID);

      if (pTarget.value.ubProfile == NO_PROFILE || !(gMercProfiles[pTarget.value.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_TOWN_DOESNT_CARE_ABOUT_DEATH)) {
        // militia, if any, turn hostile
        MilitiaChangesSides();
      }
    }
  } else {
    if (pTarget.value.ubProfile == Enum268.CARMEN) // Carmen
    {
      // Special stuff for Carmen the bounty hunter
      if (pSoldier.value.ubProfile != Enum268.SLAY) // attacked by someone other than Slay
      {
        // change attitude
        pTarget.value.bAttitude = Enum242.AGGRESSIVE;
      }
    }

    if (pTarget.value.ubCivilianGroup && ((pTarget.value.bTeam == gbPlayerNum) || pTarget.value.bNeutral)) {
      // member of a civ group, either recruited or neutral, so should
      // change sides individually or all together

      CivilianGroupMemberChangesSides(pTarget);

      if (pTarget.value.ubProfile != NO_PROFILE && pTarget.value.bLife >= OKLIFE && pTarget.value.bVisible == true) {
        // trigger quote!
        PauseAITemporarily();
        AddToShouldBecomeHostileOrSayQuoteList(pTarget.value.ubID);
        // TriggerNPCWithIHateYouQuote( pTarget->ubProfile );
      }
    } else if (pTarget.value.ubCivilianGroup != Enum246.NON_CIV_GROUP && !(pTarget.value.uiStatusFlags & SOLDIER_BOXER)) {
      // Firing at a civ in a civ group who isn't hostile... if anyone in that civ group can see this
      // going on they should become hostile.
      CivilianGroupMembersChangeSidesWithinProximity(pTarget);
    } else if (pTarget.value.bTeam == gbPlayerNum && !(gTacticalStatus.uiFlags & INCOMBAT)) {
      // firing at one of our own guys who is not a rebel etc
      if (pTarget.value.bLife >= OKLIFE && !(pTarget.value.bCollapsed) && !AM_A_ROBOT(pTarget) && (bReason == REASON_NORMAL_ATTACK)) {
        // OK, sturn towards the prick
        // Change to fire ready animation
        ConvertGridNoToXY(pSoldier.value.sGridNo, addressof(sTargetXPos), addressof(sTargetYPos));

        pTarget.value.fDontChargeReadyAPs = true;
        // Ready weapon
        SoldierReadyWeapon(pTarget, sTargetXPos, sTargetYPos, false);

        // ATE: Depending on personality, fire back.....

        // Do we have a gun in a\hand?
        if (Item[pTarget.value.inv[Enum261.HANDPOS].usItem].usItemClass == IC_GUN) {
          // Toggle burst capable...
          if (!pTarget.value.bDoBurst) {
            if (IsGunBurstCapable(pTarget, Enum261.HANDPOS, false)) {
              ChangeWeaponMode(pTarget);
            }
          }

          // Fire back!
          HandleItem(pTarget, pSoldier.value.sGridNo, pSoldier.value.bLevel, pTarget.value.inv[Enum261.HANDPOS].usItem, false);
        }
      }

      // don't enter combat on attack on one of our own mercs
      fEnterCombat = false;
    }

    // if we've attacked a miner
    if (IsProfileAHeadMiner(pTarget.value.ubProfile)) {
      PlayerAttackedHeadMiner(pTarget.value.ubProfile);
    }
  }

  ppTarget.value = pTarget;
  return fEnterCombat;
}

function InternalReduceAttackBusyCount(ubID: UINT8, fCalledByAttacker: boolean, ubTargetID: UINT8): Pointer<SOLDIERTYPE> {
  // Strange as this may seem, this function returns a pointer to
  // the *target* in case the target has changed sides as a result
  // of being attacked
  let pSoldier: Pointer<SOLDIERTYPE>;
  let pTarget: Pointer<SOLDIERTYPE>;
  let fEnterCombat: boolean = false;

  if (ubID == NOBODY) {
    pSoldier = null;
    pTarget = null;
  } else {
    pSoldier = MercPtrs[ubID];
    if (ubTargetID != NOBODY) {
      pTarget = MercPtrs[ubTargetID];
    } else {
      pTarget = null;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String(">>Target ptr is null!"));
    }
  }

  if (fCalledByAttacker) {
    if (pSoldier && Item[pSoldier.value.inv[Enum261.HANDPOS].usItem].usItemClass & IC_GUN) {
      if (pSoldier.value.bBulletsLeft > 0) {
        return pTarget;
      }
    }
  }

  //	if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT))
  //	{

  if (gTacticalStatus.ubAttackBusyCount == 0) {
    // ATE: We have a problem here... if testversion, report error......
    // But for all means.... DON'T wrap!
    if ((gTacticalStatus.uiFlags & INCOMBAT)) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! &&&&&&& Problem with attacker busy count decrementing past 0.... preventing wrap-around."));
    }
  } else {
    gTacticalStatus.ubAttackBusyCount--;
  }

  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Ending attack, attack count now %d", gTacticalStatus.ubAttackBusyCount));
  //	}

  if (gTacticalStatus.ubAttackBusyCount > 0) {
    return pTarget;
  }

  if ((gTacticalStatus.uiFlags & TURNBASED) && (gTacticalStatus.uiFlags & INCOMBAT)) {
    // Check to see if anyone was suppressed
    if (pSoldier) {
      HandleSuppressionFire(pSoldier.value.ubTargetID, ubID);
    } else {
      HandleSuppressionFire(NOBODY, ubID);
    }

    // HandleAfterShootingGuy( pSoldier, pTarget );

    // suppression fire might cause the count to be increased, so check it again
    if (gTacticalStatus.ubAttackBusyCount > 0) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting suppression, attack count now %d", gTacticalStatus.ubAttackBusyCount));
      return pTarget;
    }
  }

  // ATE: IN MEANWHILES, we have 'combat' in realtime....
  // this is so we DON'T call freeupattacker() which will cancel
  // the AI guy's meanwhile NPC stuff.
  // OK< let's NOT do this if it was the queen attacking....
  if (AreInMeanwhile() && pSoldier != null && pSoldier.value.ubProfile != Enum268.QUEEN) {
    return pTarget;
  }

  if (pTarget) {
    // reset # of shotgun pellets hit by
    pTarget.value.bNumPelletsHitBy = 0;
    // reset flag for making "ow" sound on being shot
  }

  if (pSoldier) {
    // reset attacking hand
    pSoldier.value.ubAttackingHand = Enum261.HANDPOS;

    // if there is a valid target, and our attack was noticed
    if (pTarget && (pSoldier.value.uiStatusFlags & SOLDIER_ATTACK_NOTICED)) {
      // stuff that only applies to when we attack
      if (pTarget.value.ubBodyType != Enum194.CROW) {
        if (pSoldier.value.bTeam == gbPlayerNum) {
          fEnterCombat = ProcessImplicationsOfPCAttack(pSoldier, addressof(pTarget), REASON_NORMAL_ATTACK);
          if (!fEnterCombat) {
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, ">>Not entering combat as a result of PC attack");
          }
        }
      }

      // global

      // ATE: If we are an animal, etc, don't change to hostile...
      // ( and don't go into combat )
      if (pTarget.value.ubBodyType == Enum194.CROW) {
        // Loop through our team, make guys who can see this fly away....
        {
          let cnt: UINT32;
          let pTeamSoldier: Pointer<SOLDIERTYPE>;
          let ubTeam: UINT8;

          ubTeam = pTarget.value.bTeam;

          for (cnt = gTacticalStatus.Team[ubTeam].bFirstID, pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[ubTeam].bLastID; cnt++, pTeamSoldier++) {
            if (pTeamSoldier.value.bActive && pTeamSoldier.value.bInSector) {
              if (pTeamSoldier.value.ubBodyType == Enum194.CROW) {
                if (pTeamSoldier.value.bOppList[pSoldier.value.ubID] == SEEN_CURRENTLY) {
                  // ZEROTIMECOUNTER( pTeamSoldier->AICounter );

                  // MakeCivHostile( pTeamSoldier, 2 );

                  HandleCrowFlyAway(pTeamSoldier);
                }
              }
            }
          }
        }

        // Don't enter combat...
        fEnterCombat = false;
      }

      if (gTacticalStatus.bBoxingState == Enum247.BOXING) {
        if (pTarget && pTarget.value.bLife <= 0) {
          // someone has won!
          EndBoxingMatch(pTarget);
        }
      }

      // if soldier and target were not both players and target was not under fire before...
      if ((pSoldier.value.bTeam != gbPlayerNum || pTarget.value.bTeam != gbPlayerNum)) {
        if (pTarget.value.bOppList[pSoldier.value.ubID] != SEEN_CURRENTLY) {
          NoticeUnseenAttacker(pSoldier, pTarget, 0);
        }
        // "under fire" lasts for 2 turns
        pTarget.value.bUnderFire = 2;
      }
    } else if (pTarget) {
      // something is wrong here!
      if (!pTarget.value.bActive || !pTarget.value.bInSector) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, ">>Invalid target attacked!");
      } else if (!(pSoldier.value.uiStatusFlags & SOLDIER_ATTACK_NOTICED)) {
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, ">>Attack not noticed");
      }
    } else {
      // no target, don't enter combat
      fEnterCombat = false;
    }

    if (pSoldier.value.fSayAmmoQuotePending) {
      pSoldier.value.fSayAmmoQuotePending = false;
      TacticalCharacterDialogue(pSoldier, Enum202.QUOTE_OUT_OF_AMMO);
    }

    if (pSoldier.value.uiStatusFlags & SOLDIER_PC) {
      UnSetUIBusy(ubID);
    } else {
      FreeUpNPCFromAttacking(ubID);
    }

    if (!fEnterCombat) {
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, ">>Not to enter combat from this attack");
    }

    if (fEnterCombat && !(gTacticalStatus.uiFlags & INCOMBAT)) {
      // Go into combat!

      // If we are in a meanwhile... don't enter combat here...
      if (!AreInMeanwhile()) {
        EnterCombatMode(pSoldier.value.bTeam);
      }
    }

    pSoldier.value.uiStatusFlags &= (~SOLDIER_ATTACK_NOTICED);
  }

  if (gTacticalStatus.fKilledEnemyOnAttack) {
    // Check for death quote...
    HandleKilledQuote(MercPtrs[gTacticalStatus.ubEnemyKilledOnAttack], MercPtrs[gTacticalStatus.ubEnemyKilledOnAttackKiller], gTacticalStatus.ubEnemyKilledOnAttackLocation, gTacticalStatus.bEnemyKilledOnAttackLevel);
    gTacticalStatus.fKilledEnemyOnAttack = false;
  }

  // ATE: Check for stat changes....
  HandleAnyStatChangesAfterAttack();

  if (gTacticalStatus.fItemsSeenOnAttack && gTacticalStatus.ubCurrentTeam == gbPlayerNum) {
    gTacticalStatus.fItemsSeenOnAttack = false;

    // Display quote!
    if (!AM_AN_EPC(MercPtrs[gTacticalStatus.ubItemsSeenOnAttackSoldier])) {
      TacticalCharacterDialogueWithSpecialEvent(MercPtrs[gTacticalStatus.ubItemsSeenOnAttackSoldier], (Enum202.QUOTE_SPOTTED_SOMETHING_ONE + Random(2)), DIALOGUE_SPECIAL_EVENT_SIGNAL_ITEM_LOCATOR_START, gTacticalStatus.usItemsSeenOnAttackGridNo, 0);
    } else {
      // Turn off item lock for locators...
      gTacticalStatus.fLockItemLocators = false;
      // Slide to location!
      SlideToLocation(0, gTacticalStatus.usItemsSeenOnAttackGridNo);
    }
  }

  if (gTacticalStatus.uiFlags & CHECK_SIGHT_AT_END_OF_ATTACK) {
    let ubLoop: UINT8;
    let pSightSoldier: Pointer<SOLDIERTYPE>;

    AllTeamsLookForAll(false);

    // call fov code
    ubLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID;
    for (pSightSoldier = MercPtrs[ubLoop]; ubLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; ubLoop++, pSightSoldier++) {
      if (pSightSoldier.value.bActive && pSightSoldier.value.bInSector) {
        RevealRoofsAndItems(pSightSoldier, true, false, pSightSoldier.value.bLevel, false);
      }
    }
    gTacticalStatus.uiFlags &= ~CHECK_SIGHT_AT_END_OF_ATTACK;
  }

  DequeueAllDemandGameEvents(true);

  CheckForEndOfBattle(false);

  // if we're in realtime, turn off the attacker's muzzle flash at this point
  if (!(gTacticalStatus.uiFlags & INCOMBAT) && pSoldier) {
    EndMuzzleFlash(pSoldier);
  }

  if (pSoldier && pSoldier.value.bWeaponMode == Enum265.WM_ATTACHED) {
    // change back to single shot
    pSoldier.value.bWeaponMode = Enum265.WM_NORMAL;
  }

  // record last target
  // Check for valid target!
  if (pSoldier) {
    pSoldier.value.sLastTarget = pSoldier.value.sTargetGridNo;
  }

  return pTarget;
}

export function ReduceAttackBusyCount(ubID: UINT8, fCalledByAttacker: boolean): Pointer<SOLDIERTYPE> {
  if (ubID == NOBODY) {
    return InternalReduceAttackBusyCount(ubID, fCalledByAttacker, NOBODY);
  } else {
    return InternalReduceAttackBusyCount(ubID, fCalledByAttacker, MercPtrs[ubID].value.ubTargetID);
  }
}

export function FreeUpAttacker(ubID: UINT8): Pointer<SOLDIERTYPE> {
  // Strange as this may seem, this function returns a pointer to
  // the *target* in case the target has changed sides as a result
  // of being attacked

  return ReduceAttackBusyCount(ubID, true);
}

export function FreeUpAttackerGivenTarget(ubID: UINT8, ubTargetID: UINT8): Pointer<SOLDIERTYPE> {
  // Strange as this may seem, this function returns a pointer to
  // the *target* in case the target has changed sides as a result
  // of being attacked

  return InternalReduceAttackBusyCount(ubID, true, ubTargetID);
}

export function ReduceAttackBusyGivenTarget(ubID: UINT8, ubTargetID: UINT8): Pointer<SOLDIERTYPE> {
  // Strange as this may seem, this function returns a pointer to
  // the *target* in case the target has changed sides as a result
  // of being attacked

  return InternalReduceAttackBusyCount(ubID, false, ubTargetID);
}

function StopMercAnimation(fStop: boolean): void {
  /* static */ let bOldRealtimeSpeed: INT8;

  if (fStop) {
    if (!(gTacticalStatus.uiFlags & SLOW_ANIMATION)) {
      bOldRealtimeSpeed = gTacticalStatus.bRealtimeSpeed;
      gTacticalStatus.bRealtimeSpeed = -1;

      gTacticalStatus.uiFlags |= (SLOW_ANIMATION);

      ResetAllMercSpeeds();
    }
  } else {
    if (gTacticalStatus.uiFlags & SLOW_ANIMATION) {
      gTacticalStatus.bRealtimeSpeed = bOldRealtimeSpeed;

      gTacticalStatus.uiFlags &= (~SLOW_ANIMATION);

      ResetAllMercSpeeds();
    }
  }
}

export function ResetAllMercSpeeds(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: UINT32;

  for (cnt = 0; cnt < TOTAL_SOLDIERS; cnt++) {
    pSoldier = MercPtrs[cnt];

    if (pSoldier.value.bActive && pSoldier.value.bInSector) {
      SetSoldierAniSpeed(pSoldier);
    }
  }
}

export function SetActionToDoOnceMercsGetToLocation(ubActionCode: UINT8, bNumMercsWaiting: INT8, uiData1: UINT32, uiData2: UINT32, uiData3: UINT32): void {
  gubWaitingForAllMercsToExitCode = ubActionCode;
  gbNumMercsUntilWaitingOver = bNumMercsWaiting;
  guiWaitingForAllMercsToExitData[0] = uiData1;
  guiWaitingForAllMercsToExitData[1] = uiData2;
  guiWaitingForAllMercsToExitData[2] = uiData3;

  // Setup timer counter and report back if too long....
  guiWaitingForAllMercsToExitTimer = GetJA2Clock();

  // ATE: Set flag to ignore sight...
  gTacticalStatus.uiFlags |= (DISALLOW_SIGHT);
}

function HandleBloodForNewGridNo(pSoldier: Pointer<SOLDIERTYPE>): void {
  // Handle bleeding...
  if ((pSoldier.value.bBleeding > MIN_BLEEDING_THRESHOLD)) {
    let bBlood: INT8;

    bBlood = ((pSoldier.value.bBleeding - MIN_BLEEDING_THRESHOLD) / BLOODDIVISOR);

    if (bBlood > MAXBLOODQUANTITY) {
      bBlood = MAXBLOODQUANTITY;
    }

    // now, he shouldn't ALWAYS bleed the same amount; LOWER it perhaps. If it
    // goes less than zero, then no blood!
    bBlood -= Random(7);

    if (bBlood >= 0) {
      // this handles all soldiers' dropping blood during movement
      DropBlood(pSoldier, bBlood, pSoldier.value.bVisible);
    }
  }
}

export function CencelAllActionsForTimeCompression(): void {
  let pSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;

  for (pSoldier = Menptr, cnt = 0; cnt < TOTAL_SOLDIERS; pSoldier++, cnt++) {
    if (pSoldier.value.bActive) {
      if (pSoldier.value.bInSector) {
        // Hault!
        EVENT_StopMerc(pSoldier, pSoldier.value.sGridNo, pSoldier.value.bDirection);

        // END AI actions
        CancelAIAction(pSoldier, true);
      }
    }
  }
}

export function AddManToTeam(bTeam: INT8): void {
  // ATE: If not loading game!
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Increment men in sector number!
    if (gTacticalStatus.Team[bTeam].bMenInSector == 0) {
      gTacticalStatus.Team[bTeam].bTeamActive = true;
    }
    gTacticalStatus.Team[bTeam].bMenInSector++;
    if (bTeam == ENEMY_TEAM) {
      gTacticalStatus.bOriginalSizeOfEnemyForce++;
    }
  }
}

export function RemoveManFromTeam(bTeam: INT8): void {
  // ATE; if not loading game!
  if (!(gTacticalStatus.uiFlags & LOADING_SAVED_GAME)) {
    // Decrement men in sector number!
    gTacticalStatus.Team[bTeam].bMenInSector--;
    if (gTacticalStatus.Team[bTeam].bMenInSector == 0) {
      gTacticalStatus.Team[bTeam].bTeamActive = false;
    } else if (gTacticalStatus.Team[bTeam].bMenInSector < 0) {
      // reset!
      gTacticalStatus.Team[bTeam].bMenInSector = 0;
    }
  }
}

export function RemoveSoldierFromTacticalSector(pSoldier: Pointer<SOLDIERTYPE>, fAdjustSelected: boolean): void {
  let ubID: UINT8;
  let pNewSoldier: Pointer<SOLDIERTYPE>;

  // reset merc's opplist
  InitSoldierOppList(pSoldier);

  // Remove!
  RemoveSoldierFromGridNo(pSoldier);

  RemoveMercSlot(pSoldier);

  pSoldier.value.bInSector = false;

  // Select next avialiable guy....
  if (fAdjustSelected) {
    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      if (gusSelectedSoldier == pSoldier.value.ubID) {
        ubID = FindNextActiveAndAliveMerc(pSoldier, false, false);

        if (ubID != NOBODY && ubID != gusSelectedSoldier) {
          SelectSoldier(ubID, false, false);
        } else {
          // OK - let's look for another squad...
          pNewSoldier = FindNextActiveSquad(pSoldier);

          if (pNewSoldier != pSoldier) {
            // Good squad found!
            SelectSoldier(pNewSoldier.value.ubID, false, false);
          } else {
            // if here, make nobody
            gusSelectedSoldier = NOBODY;
          }
        }
      }
      UpdateTeamPanelAssignments();
    } else {
      gusSelectedSoldier = NOBODY;

      if (guiCurrentScreen == Enum26.GAME_SCREEN) {
        // otherwise, make sure interface is team panel...
        UpdateTeamPanelAssignments();
        SetCurrentInterfacePanel(Enum215.TEAM_PANEL);
      }
    }
  }
}

function DoneFadeOutDueToDeath(): void {
  // Quit game....
  InternalLeaveTacticalScreen(Enum26.MAINMENU_SCREEN);
  // SetPendingNewScreen( MAINMENU_SCREEN );
}

function EndBattleWithUnconsciousGuysCallback(bExitValue: UINT8): void {
  // Enter mapscreen.....
  CheckAndHandleUnloadingOfCurrentWorld();
}

export function InitializeTacticalStatusAtBattleStart(): void {
  let bLoop: INT8;
  let cnt: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  gTacticalStatus.ubArmyGuysKilled = 0;
  gTacticalStatus.bOriginalSizeOfEnemyForce = 0;

  gTacticalStatus.fPanicFlags = 0;
  gTacticalStatus.fEnemyFlags = 0;
  for (bLoop = 0; bLoop < NUM_PANIC_TRIGGERS; bLoop++) {
    gTacticalStatus.sPanicTriggerGridNo[bLoop] = NOWHERE;
    gTacticalStatus.bPanicTriggerIsAlarm[bLoop] = false;
    gTacticalStatus.ubPanicTolerance[bLoop] = 0;
  }

  for (cnt = 0; cnt < MAXTEAMS; cnt++) {
    gTacticalStatus.Team[cnt].ubLastMercToRadio = NOBODY;
    gTacticalStatus.Team[cnt].bAwareOfOpposition = false;
  }

  gTacticalStatus.ubTheChosenOne = NOBODY;

  ClearIntList();

  // make sure none of our guys have leftover shock values etc
  for (cnt = gTacticalStatus.Team[0].bFirstID; cnt <= gTacticalStatus.Team[0].bLastID; cnt++) {
    pSoldier = MercPtrs[cnt];
    pSoldier.value.bShock = 0;
    pSoldier.value.bTilesMoved = 0;
  }

  // loop through everyone; clear misc flags
  for (cnt = 0; cnt <= gTacticalStatus.Team[CIV_TEAM].bLastID; cnt++) {
    MercPtrs[cnt].value.ubMiscSoldierFlags = 0;
  }
}

function DoneFadeOutDemoCreatureLevel(): void {
  // OK, insertion data found, enter sector!
  SetCurrentWorldSector(1, 16, 0);

  FadeInGameScreen();
}

function DemoEndOKCallback(bExitCode: INT8): void {
}

function HandleEndDemoInCreatureLevel(): void {
}

function DeathTimerCallback(): void {
  if (gTacticalStatus.Team[CREATURE_TEAM].bMenInSector > gTacticalStatus.Team[ENEMY_TEAM].bMenInSector) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, LargeTacticalStr[Enum337.LARGESTR_NOONE_LEFT_CAPABLE_OF_BATTLE_AGAINST_CREATURES_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, EndBattleWithUnconsciousGuysCallback, null);
  } else {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, LargeTacticalStr[Enum337.LARGESTR_NOONE_LEFT_CAPABLE_OF_BATTLE_STR], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, EndBattleWithUnconsciousGuysCallback, null);
  }
}

export function CaptureTimerCallback(): void {
  if (gfSurrendered) {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, LargeTacticalStr[3], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, EndBattleWithUnconsciousGuysCallback, null);
  } else {
    DoMessageBox(Enum24.MSG_BOX_BASIC_STYLE, LargeTacticalStr[Enum337.LARGESTR_HAVE_BEEN_CAPTURED], Enum26.GAME_SCREEN, MSG_BOX_FLAG_OK, EndBattleWithUnconsciousGuysCallback, null);
  }
  gfSurrendered = false;
}

export function DoPOWPathChecks(): void {
  let iLoop: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  // loop through all mercs on our team and if they are POWs in sector, do POW path check and
  // put on a squad if available
  for (iLoop = gTacticalStatus.Team[gbPlayerNum].bFirstID; iLoop <= gTacticalStatus.Team[gbPlayerNum].bLastID; iLoop++) {
    pSoldier = MercPtrs[iLoop];

    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bAssignment == Enum117.ASSIGNMENT_POW) {
      // check to see if POW has been freed!
      // this will be true if a path can be made from the POW to either of 3 gridnos
      // 10492 (hallway) or 10482 (outside), or 9381 (outside)
      if (FindBestPath(pSoldier, 10492, 0, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
        // drop out of if
      } else if (FindBestPath(pSoldier, 10482, 0, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
        // drop out of if
      } else if (FindBestPath(pSoldier, 9381, 0, Enum193.WALKING, NO_COPYROUTE, PATH_THROUGH_PEOPLE)) {
        // drop out of if
      } else {
        continue;
      }
      // free! free!
      // put them on any available squad
      pSoldier.value.bNeutral = false;
      AddCharacterToAnySquad(pSoldier);
      DoMercBattleSound(pSoldier, Enum259.BATTLE_SOUND_COOL1);
    }
  }
}

export function HostileCiviliansPresent(): boolean {
  let iLoop: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (gTacticalStatus.Team[CIV_TEAM].bTeamActive == false) {
    return false;
  }

  for (iLoop = gTacticalStatus.Team[CIV_TEAM].bFirstID; iLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; iLoop++) {
    pSoldier = MercPtrs[iLoop];

    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife > 0 && !pSoldier.value.bNeutral) {
      return true;
    }
  }

  return false;
}

function HostileCiviliansWithGunsPresent(): boolean {
  let iLoop: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (gTacticalStatus.Team[CIV_TEAM].bTeamActive == false) {
    return false;
  }

  for (iLoop = gTacticalStatus.Team[CIV_TEAM].bFirstID; iLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; iLoop++) {
    pSoldier = MercPtrs[iLoop];

    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife > 0 && !pSoldier.value.bNeutral) {
      if (FindAIUsableObjClass(pSoldier, IC_WEAPON) == -1) {
        return true;
      }
    }
  }

  return false;
}

export function HostileBloodcatsPresent(): boolean {
  let iLoop: INT32;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (gTacticalStatus.Team[CREATURE_TEAM].bTeamActive == false) {
    return false;
  }

  for (iLoop = gTacticalStatus.Team[CREATURE_TEAM].bFirstID; iLoop <= gTacticalStatus.Team[CREATURE_TEAM].bLastID; iLoop++) {
    pSoldier = MercPtrs[iLoop];

    // KM : Aug 11, 1999 -- Patch fix:  Removed the check for bNeutral.  Bloodcats automatically become hostile
    //		 on site.  Because the check used to be there, it was possible to get into a 2nd battle elsewhere
    //     which is BAD BAD BAD!
    if (pSoldier.value.bActive && pSoldier.value.bInSector && pSoldier.value.bLife > 0 && pSoldier.value.ubBodyType == Enum194.BLOODCAT) {
      return true;
    }
  }

  return false;
}

function HandleCreatureTenseQuote(): void {
  let ubMercsInSector: UINT8[] /* [20] */ = [ 0 ];
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: Pointer<SOLDIERTYPE>;
  let cnt: INT32;
  let uiTime: INT32;

  // Check for quote seeing creature attacks....
  if (gubQuest[Enum169.QUEST_CREATURES] != QUESTDONE) {
    if (gTacticalStatus.uiFlags & IN_CREATURE_LAIR) {
      if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
        uiTime = GetJA2Clock();

        if ((uiTime - gTacticalStatus.uiCreatureTenseQuoteLastUpdate) > (gTacticalStatus.sCreatureTenseQuoteDelay * 1000)) {
          gTacticalStatus.uiCreatureTenseQuoteLastUpdate = uiTime;

          // set up soldier ptr as first element in mercptrs list
          cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

          // run through list
          for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier++) {
            // Add guy if he's a candidate...
            if (OK_INSECTOR_MERC(pTeamSoldier) && !AM_AN_EPC(pTeamSoldier) && !(pTeamSoldier.value.uiStatusFlags & SOLDIER_GASSED) && !(AM_A_ROBOT(pTeamSoldier)) && !pTeamSoldier.value.fMercAsleep) {
              ubMercsInSector[ubNumMercs] = cnt;
              ubNumMercs++;
            }
          }

          // If we are > 0
          if (ubNumMercs > 0) {
            ubChosenMerc = Random(ubNumMercs);

            DoCreatureTensionQuote(MercPtrs[ubMercsInSector[ubChosenMerc]]);
          }

          // Adjust delay....
          gTacticalStatus.sCreatureTenseQuoteDelay = (60 + Random(60));
        }
      }
    }
  }
}

function DoCreatureTensionQuote(pSoldier: Pointer<SOLDIERTYPE>): void {
  let iRandomQuote: INT32;
  let fCanDoQuote: boolean = true;
  let iQuoteToUse: INT32;

  // Check for playing smell quote....
  iRandomQuote = Random(3);

  switch (iRandomQuote) {
    case 0:

      iQuoteToUse = Enum202.QUOTE_SMELLED_CREATURE;
      if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_SMELLED_CREATURE)) {
        // set flag
        pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_SMELLED_CREATURE;
      } else {
        fCanDoQuote = false;
      }
      break;

    case 1:

      iQuoteToUse = Enum202.QUOTE_TRACES_OF_CREATURE_ATTACK;
      if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_SPOTTING_CREATURE_ATTACK)) {
        // set flag
        pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_SPOTTING_CREATURE_ATTACK;
      } else {
        fCanDoQuote = false;
      }
      break;

    case 2:

      iQuoteToUse = Enum202.QUOTE_WORRIED_ABOUT_CREATURE_PRESENCE;
      if (!(pSoldier.value.usQuoteSaidFlags & SOLDIER_QUOTE_SAID_WORRIED_ABOUT_CREATURES)) {
        // set flag
        pSoldier.value.usQuoteSaidFlags |= SOLDIER_QUOTE_SAID_WORRIED_ABOUT_CREATURES;
      } else {
        fCanDoQuote = false;
      }
      break;
  }

  if (fCanDoQuote) {
    TacticalCharacterDialogue(pSoldier, iQuoteToUse);
  }
}

}
