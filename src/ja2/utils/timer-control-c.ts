let giClockTimer: INT32 = -1;
let giTimerDiag: INT32 = 0;

let guiBaseJA2Clock: UINT32 = 0;
let guiBaseJA2NoPauseClock: UINT32 = 0;

let gfPauseClock: BOOLEAN = FALSE;

let giTimerIntervals: INT32[] /* [NUMTIMERS] */ = [
  5, // Tactical Overhead
  20, // NEXTSCROLL
  200, // Start Scroll
  200, // Animate tiles
  1000, // FPS Counter
  80, // PATH FIND COUNTER
  150, // CURSOR TIMER
  250, // RIGHT CLICK FOR MENU
  300, // LEFT
  30, // SLIDING TEXT
  200, // TARGET REFINE TIMER
  150, // CURSOR/AP FLASH
  60, // FADE MERCS OUT
  160, // PANEL SLIDE
  1000, // CLOCK UPDATE DELAY
  20, // PHYSICS UPDATE
  100, // FADE ENEMYS
  20, // STRATEGIC OVERHEAD
  40,
  500, // NON GUN TARGET REFINE TIMER
  250, // IMPROVED CURSOR FLASH
  500, // 2nd CURSOR FLASH
  400, // RADARMAP BLINK AND OVERHEAD MAP BLINK SHOUDL BE THE SAME
  400,
  10, // Music Overhead
  100, // Rubber band start delay
];

// TIMER COUNTERS
let giTimerCounters: INT32[] /* [NUMTIMERS] */;

let giTimerAirRaidQuote: INT32 = 0;
let giTimerAirRaidDiveStarted: INT32 = 0;
let giTimerAirRaidUpdate: INT32 = 0;
let giTimerCustomizable: INT32 = 0;
let giTimerTeamTurnUpdate: INT32 = 0;

let gpCustomizableTimerCallback: CUSTOMIZABLE_TIMER_CALLBACK = NULL;

// Clock Callback event ID
let gTimerID: MMRESULT;

// GLOBALS FOR CALLBACK
let gCNT: UINT32;
let gPSOLDIER: Pointer<SOLDIERTYPE>;

// GLobal for displaying time diff ( DIAG )
let guiClockDiff: UINT32 = 0;
let guiClockStart: UINT32 = 0;

function TimeProc(uID: UINT, uMsg: UINT, dwUser: DWORD, dw1: DWORD, dw2: DWORD): void {
  /* static */ let fInFunction: BOOLEAN = FALSE;
  // SOLDIERTYPE		*pSoldier;

  if (!fInFunction) {
    fInFunction = TRUE;

    guiBaseJA2NoPauseClock += BASETIMESLICE;

    if (!gfPauseClock) {
      guiBaseJA2Clock += BASETIMESLICE;

      for (gCNT = 0; gCNT < Enum386.NUMTIMERS; gCNT++) {
        UPDATECOUNTER(gCNT);
      }

      // Update some specialized countdown timers...
      UPDATETIMECOUNTER(giTimerAirRaidQuote);
      UPDATETIMECOUNTER(giTimerAirRaidDiveStarted);
      UPDATETIMECOUNTER(giTimerAirRaidUpdate);
      UPDATETIMECOUNTER(giTimerTeamTurnUpdate);

      if (gpCustomizableTimerCallback) {
        UPDATETIMECOUNTER(giTimerCustomizable);
      }

      // If mapscreen...
      if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
        // IN Mapscreen, loop through player's team.....
        for (gCNT = gTacticalStatus.Team[gbPlayerNum].bFirstID; gCNT <= gTacticalStatus.Team[gbPlayerNum].bLastID; gCNT++) {
          gPSOLDIER = MercPtrs[gCNT];
          UPDATETIMECOUNTER(gPSOLDIER.value.PortraitFlashCounter);
          UPDATETIMECOUNTER(gPSOLDIER.value.PanelAnimateCounter);
        }
      } else {
        // Set update flags for soldiers
        ////////////////////////////
        for (gCNT = 0; gCNT < guiNumMercSlots; gCNT++) {
          gPSOLDIER = MercSlots[gCNT];

          if (gPSOLDIER != NULL) {
            UPDATETIMECOUNTER(gPSOLDIER.value.UpdateCounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.DamageCounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.ReloadCounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.FlashSelCounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.BlinkSelCounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.PortraitFlashCounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.AICounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.FadeCounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.NextTileCounter);
            UPDATETIMECOUNTER(gPSOLDIER.value.PanelAnimateCounter);
          }
        }
      }
    }

    fInFunction = FALSE;
  }
}

function InitializeJA2Clock(): BOOLEAN {
  let mmResult: MMRESULT;
  let tc: TIMECAPS;
  let cnt: INT32;

  // Init timer delays
  for (cnt = 0; cnt < Enum386.NUMTIMERS; cnt++) {
    giTimerCounters[cnt] = giTimerIntervals[cnt];
  }

  // First get timer resolutions
  mmResult = timeGetDevCaps(addressof(tc), sizeof(tc));

  if (mmResult != TIMERR_NOERROR) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Could not get timer properties");
  }

  // Set timer at lowest resolution. Could use middle of lowest/highest, we'll see how this performs first
  gTimerID = timeSetEvent(BASETIMESLICE, BASETIMESLICE, TimeProc, 0, TIME_PERIODIC);

  if (!gTimerID) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Could not create timer callback");
  }

  return TRUE;
}

function ShutdownJA2Clock(): void {
  // Make sure we kill the timer

  timeKillEvent(gTimerID);
}

function InitializeJA2TimerCallback(uiDelay: UINT32, TimerProc: LPTIMECALLBACK, uiUser: UINT32): UINT32 {
  let mmResult: MMRESULT;
  let tc: TIMECAPS;
  let TimerID: MMRESULT;

  // First get timer resolutions
  mmResult = timeGetDevCaps(addressof(tc), sizeof(tc));

  if (mmResult != TIMERR_NOERROR) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Could not get timer properties");
  }

  // Set timer at lowest resolution. Could use middle of lowest/highest, we'll see how this performs first
  TimerID = timeSetEvent(uiDelay, uiDelay, TimerProc, uiUser, TIME_PERIODIC);

  if (!TimerID) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, "Could not create timer callback");
  }

  return TimerID;
}

function RemoveJA2TimerCallback(uiTimer: UINT32): void {
  timeKillEvent(uiTimer);
}

function InitializeJA2TimerID(uiDelay: UINT32, uiCallbackID: UINT32, uiUser: UINT32): UINT32 {
  switch (uiCallbackID) {
    case Enum385.ITEM_LOCATOR_CALLBACK:

      return InitializeJA2TimerCallback(uiDelay, FlashItem, uiUser);
      break;
  }

  // invalid callback id
  Assert(FALSE);
  return 0;
}

//////////////////////////////////////////////////////////////////////////////////////////////
// TIMER CALLBACK S
//////////////////////////////////////////////////////////////////////////////////////////////
function FlashItem(uiID: UINT, uiMsg: UINT, uiUser: DWORD, uiDw1: DWORD, uiDw2: DWORD): void {
}

function PauseTime(fPaused: BOOLEAN): void {
  gfPauseClock = fPaused;
}

function SetCustomizableTimerCallbackAndDelay(iDelay: INT32, pCallback: CUSTOMIZABLE_TIMER_CALLBACK, fReplace: BOOLEAN): void {
  if (gpCustomizableTimerCallback) {
    if (!fReplace) {
      // replace callback but call the current callback first
      gpCustomizableTimerCallback();
    }
  }

  RESETTIMECOUNTER(giTimerCustomizable, iDelay);
  gpCustomizableTimerCallback = pCallback;
}

function CheckCustomizableTimer(): void {
  if (gpCustomizableTimerCallback) {
    if (TIMECOUNTERDONE(giTimerCustomizable, 0)) {
      // set the callback to a temp variable so we can reset the global variable
      // before calling the callback, so that if the callback sets up another
      // instance of the timer, we don't reset it afterwards
      let pTempCallback: CUSTOMIZABLE_TIMER_CALLBACK;

      pTempCallback = gpCustomizableTimerCallback;
      gpCustomizableTimerCallback = NULL;
      pTempCallback();
    }
  }
}

function ResetJA2ClockGlobalTimers(): void {
  let uiCurrentTime: UINT32 = GetJA2Clock();

  guiCompressionStringBaseTime = uiCurrentTime;
  giFlashHighlightedItemBaseTime = uiCurrentTime;
  giCompatibleItemBaseTime = uiCurrentTime;
  giAnimateRouteBaseTime = uiCurrentTime;
  giPotHeliPathBaseTime = uiCurrentTime;
  giClickHeliIconBaseTime = uiCurrentTime;
  giExitToTactBaseTime = uiCurrentTime;
  guiSectorLocatorBaseTime = uiCurrentTime;

  giCommonGlowBaseTime = uiCurrentTime;
  giFlashAssignBaseTime = uiCurrentTime;
  giFlashContractBaseTime = uiCurrentTime;
  guiFlashCursorBaseTime = uiCurrentTime;
  giPotCharPathBaseTime = uiCurrentTime;
}
