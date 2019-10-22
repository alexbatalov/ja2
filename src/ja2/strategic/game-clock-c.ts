//#define DEBUG_GAME_CLOCK

// is the clock pause region created currently?
let fClockMouseRegionCreated: BOOLEAN = FALSE;

let fTimeCompressHasOccured: BOOLEAN = FALSE;

// This value represents the time that the sector was loaded.  If you are in sector A9, and leave
// the game clock at that moment will get saved into the temp file associated with it.  The next time you
// enter A9, this value will contain that time.  Used for scheduling purposes.
let guiTimeCurrentSectorWasLastLoaded: UINT32 = 0;

// did we JUST finish up a game pause by the player
let gfJustFinishedAPause: BOOLEAN = FALSE;

// clock mouse region
let gClockMouseRegion: MOUSE_REGION;
let gClockScreenMaskMouseRegion: MOUSE_REGION;

const SECONDS_PER_COMPRESSION = 1; // 1/2 minute passes every 1 second of real time
const SECONDS_PER_COMPRESSION_IN_RTCOMBAT = 10;
const SECONDS_PER_COMPRESSION_IN_TBCOMBAT = 10;
const CLOCK_STRING_HEIGHT = 13;
const CLOCK_STRING_WIDTH = 66;
const CLOCK_FONT = () => COMPFONT();

// These contain all of the information about the game time, rate of time, etc.
// All of these get saved and loaded.
let giTimeCompressMode: INT32 = TIME_COMPRESS_X0;
let gubClockResolution: UINT8 = 1;
let gfGamePaused: BOOLEAN = TRUE;
let gfTimeInterrupt: BOOLEAN = FALSE;
let gfTimeInterruptPause: BOOLEAN = FALSE;
let fSuperCompression: BOOLEAN = FALSE;
let guiGameClock: UINT32 = STARTING_TIME;
let guiPreviousGameClock: UINT32 = 0; // used only for error-checking purposes
let guiGameSecondsPerRealSecond: UINT32;
let guiTimesThisSecondProcessed: UINT32 = 0;
let iPausedPopUpBox: INT32 = -1;
let guiDay: UINT32;
let guiHour: UINT32;
let guiMin: UINT32;
let gswzWorldTimeStr: UINT16[] /* [20] */;
let giTimeCompressSpeeds: INT32[] /* [NUM_TIME_COMPRESS_SPEEDS] */ = [
  0,
  1,
  5 * 60,
  30 * 60,
  60 * 60,
];
let usPausedActualWidth: UINT16;
let usPausedActualHeight: UINT16;
let guiTimeOfLastEventQuery: UINT32 = 0;
let gfLockPauseState: BOOLEAN = FALSE;
let gfPauseDueToPlayerGamePause: BOOLEAN = FALSE;
let gfResetAllPlayerKnowsEnemiesFlags: BOOLEAN = FALSE;
let gfTimeCompressionOn: BOOLEAN = FALSE;
let guiLockPauseStateLastReasonId: UINT32 = 0;
//***When adding new saved time variables, make sure you remove the appropriate amount from the paddingbytes and
//   more IMPORTANTLY, add appropriate code in Save/LoadGameClock()!
const TIME_PADDINGBYTES = 20;
let gubUnusedTimePadding: UINT8[] /* [TIME_PADDINGBYTES] */;

function InitNewGameClock(): void {
  guiGameClock = STARTING_TIME;
  guiPreviousGameClock = STARTING_TIME;
  guiDay = (guiGameClock / NUM_SEC_IN_DAY);
  guiHour = (guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR;
  guiMin = (guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN;
  swprintf(WORLDTIMESTR, L"%s %d, %02d:%02d", pDayStrings[0], guiDay, guiHour, guiMin);
  guiTimeCurrentSectorWasLastLoaded = 0;
  guiGameSecondsPerRealSecond = 0;
  gubClockResolution = 1;
  memset(gubUnusedTimePadding, 0, TIME_PADDINGBYTES);
}

function GetWorldTotalMin(): UINT32 {
  return guiGameClock / NUM_SEC_IN_MIN;
}

function GetWorldTotalSeconds(): UINT32 {
  return guiGameClock;
}

function GetWorldHour(): UINT32 {
  return guiHour;
}

function GetWorldMinutesInDay(): UINT32 {
  return (guiHour * 60) + guiMin;
}

function GetWorldDay(): UINT32 {
  return guiDay;
}

function GetWorldDayInSeconds(): UINT32 {
  return guiDay * NUM_SEC_IN_DAY;
}

function GetWorldDayInMinutes(): UINT32 {
  return (guiDay * NUM_SEC_IN_DAY) / NUM_SEC_IN_MIN;
}

function GetFutureDayInMinutes(uiDay: UINT32): UINT32 {
  return (uiDay * NUM_SEC_IN_DAY) / NUM_SEC_IN_MIN;
}

// this function returns the amount of minutes there has been from start of game to midnight of the uiDay.
function GetMidnightOfFutureDayInMinutes(uiDay: UINT32): UINT32 {
  return GetWorldTotalMin() + (uiDay * 1440) - GetWorldMinutesInDay();
}

// Not to be used too often by things other than internally
function WarpGameTime(uiAdjustment: UINT32, ubWarpCode: UINT8): void {
  let uiSaveTimeRate: UINT32;
  uiSaveTimeRate = guiGameSecondsPerRealSecond;
  guiGameSecondsPerRealSecond = uiAdjustment;
  AdvanceClock(ubWarpCode);
  guiGameSecondsPerRealSecond = uiSaveTimeRate;
}

function AdvanceClock(ubWarpCode: UINT8): void {
  let uiGameSecondsPerRealSecond: UINT32 = guiGameSecondsPerRealSecond;

  // Set value, to different things if we are in combat...
  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    if ((gTacticalStatus.uiFlags & TURNBASED)) {
      uiGameSecondsPerRealSecond = SECONDS_PER_COMPRESSION_IN_TBCOMBAT;
    } else {
      uiGameSecondsPerRealSecond = SECONDS_PER_COMPRESSION_IN_RTCOMBAT;
    }
  }

  if (ubWarpCode != WARPTIME_NO_PROCESSING_OF_EVENTS) {
    guiTimeOfLastEventQuery = guiGameClock;
    // First of all, events are posted for movements, pending attacks, equipment arrivals, etc.  This time
    // adjustment using time compression can possibly pass one or more events in a single pass.  So, this list
    // is looked at and processed in sequential order, until the uiAdjustment is fully applied.
    if (GameEventsPending(guiGameSecondsPerRealSecond)) {
      // If a special event, justifying the cancellation of time compression is reached, the adjustment
      // will be shortened to the time of that event, and will stop processing events, otherwise, all
      // of the events in the time slice will be processed.  The time is adjusted internally as events
      // are processed.
      ProcessPendingGameEvents(guiGameSecondsPerRealSecond, ubWarpCode);
    } else {
      // Adjust the game clock now.
      guiGameClock += guiGameSecondsPerRealSecond;
    }
  } else {
    guiGameClock += guiGameSecondsPerRealSecond;
  }

  if (guiGameClock < guiPreviousGameClock) {
    AssertMsg(FALSE, String("AdvanceClock: TIME FLOWING BACKWARDS!!! guiPreviousGameClock %d, now %d", guiPreviousGameClock, guiGameClock));

    // fix it if assertions are disabled
    guiGameClock = guiPreviousGameClock;
  }

  // store previous game clock value (for error-checking purposes only)
  guiPreviousGameClock = guiGameClock;

  // Calculate the day, hour, and minutes.
  guiDay = (guiGameClock / NUM_SEC_IN_DAY);
  guiHour = (guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR;
  guiMin = (guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN;

  swprintf(WORLDTIMESTR, L"%s %d, %02d:%02d", gpGameClockString[STR_GAMECLOCK_DAY_NAME], guiDay, guiHour, guiMin);

  if (gfResetAllPlayerKnowsEnemiesFlags && !gTacticalStatus.fEnemyInSector) {
    ClearAnySectorsFlashingNumberOfEnemies();

    gfResetAllPlayerKnowsEnemiesFlags = FALSE;
  }

  ForecastDayEvents();
}

function AdvanceToNextDay(): void {
  let uiDiff: INT32;
  let uiTomorrowTimeInSec: UINT32;

  uiTomorrowTimeInSec = (guiDay + 1) * NUM_SEC_IN_DAY + 8 * NUM_SEC_IN_HOUR + 15 * NUM_SEC_IN_MIN;
  uiDiff = uiTomorrowTimeInSec - guiGameClock;
  WarpGameTime(uiDiff, WARPTIME_PROCESS_EVENTS_NORMALLY);

  ForecastDayEvents();
}

// set the flag that time compress has occured
function SetFactTimeCompressHasOccured(): void {
  fTimeCompressHasOccured = TRUE;
  return;
}

// reset fact the time compress has occured
function ResetTimeCompressHasOccured(): void {
  fTimeCompressHasOccured = FALSE;
  return;
}

// has time compress occured?
function HasTimeCompressOccured(): BOOLEAN {
  return fTimeCompressHasOccured;
}

function RenderClock(sX: INT16, sY: INT16): void {
  SetFont(CLOCK_FONT);
  SetFontBackground(FONT_MCOLOR_BLACK);

  // Are we in combat?
  if (gTacticalStatus.uiFlags & INCOMBAT) {
    SetFontForeground(FONT_FCOLOR_NICERED);
  } else {
    SetFontForeground(FONT_LTGREEN);
  }

  // Erase first!
  RestoreExternBackgroundRect(sX, sY, CLOCK_STRING_WIDTH, CLOCK_STRING_HEIGHT);

  if ((gfPauseDueToPlayerGamePause == FALSE)) {
    mprintf(sX + (CLOCK_STRING_WIDTH - StringPixLength(WORLDTIMESTR, CLOCK_FONT)) / 2, sY, WORLDTIMESTR);
  } else {
    mprintf(sX + (CLOCK_STRING_WIDTH - StringPixLength(pPausedGameText[0], CLOCK_FONT)) / 2, sY, pPausedGameText[0]);
  }
}

function ToggleSuperCompression(): void {
  /* static */ let uiOldTimeCompressMode: UINT32 = 0;

  // Display message
  if (gTacticalStatus.uiFlags & INCOMBAT) {
    // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, L"Cannot toggle compression in Combat Mode."  );
    return;
  }

  fSuperCompression = (!fSuperCompression);

  if (fSuperCompression) {
    uiOldTimeCompressMode = giTimeCompressMode;
    giTimeCompressMode = TIME_SUPER_COMPRESS;
    guiGameSecondsPerRealSecond = giTimeCompressSpeeds[giTimeCompressMode] * SECONDS_PER_COMPRESSION;

    // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, L"Time compression ON."  );
  } else {
    giTimeCompressMode = uiOldTimeCompressMode;
    guiGameSecondsPerRealSecond = giTimeCompressSpeeds[giTimeCompressMode] * SECONDS_PER_COMPRESSION;

    // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, L"Time compression OFF."  );
  }
}

function DidGameJustStart(): BOOLEAN {
  if (gTacticalStatus.fDidGameJustStart)
    return TRUE;
  else
    return FALSE;
}

function StopTimeCompression(): void {
  if (gfTimeCompressionOn) {
    // change the clock resolution to no time passage, but don't actually change the compress mode (remember it)
    SetClockResolutionToCompressMode(TIME_COMPRESS_X0);
  }
}

function StartTimeCompression(): void {
  if (!gfTimeCompressionOn) {
    if (GamePaused()) {
      // first have to be allowed to unpause the game
      UnPauseGame();

      // if we couldn't, ignore this request
      if (GamePaused()) {
        return;
      }
    }

    // check that we can start compressing
    if (!AllowedToTimeCompress()) {
      // not allowed to compress time
      TellPlayerWhyHeCantCompressTime();
      return;
    }

    // if no compression mode is set, increase it first
    if (giTimeCompressMode <= TIME_COMPRESS_X1) {
      IncreaseGameTimeCompressionRate();
    }

    // change clock resolution to the current compression mode
    SetClockResolutionToCompressMode(giTimeCompressMode);

    // if it's the first time we're doing this since entering map screen (which reset the flag)
    if (!HasTimeCompressOccured()) {
      // set fact that we have compressed time during this map screen session
      SetFactTimeCompressHasOccured();

      ClearTacticalStuffDueToTimeCompression();
    }
  }
}

// returns FALSE if time isn't currently being compressed for ANY reason (various pauses, etc.)
function IsTimeBeingCompressed(): BOOLEAN {
  if (!gfTimeCompressionOn || (giTimeCompressMode == TIME_COMPRESS_X0) || gfGamePaused)
    return FALSE;
  else
    return TRUE;
}

// returns TRUE if the player currently doesn't want time to be compressing
function IsTimeCompressionOn(): BOOLEAN {
  return gfTimeCompressionOn;
}

function IncreaseGameTimeCompressionRate(): void {
  // if not already at maximum time compression rate
  if (giTimeCompressMode < TIME_COMPRESS_60MINS) {
    // check that we can
    if (!AllowedToTimeCompress()) {
      // not allowed to compress time
      TellPlayerWhyHeCantCompressTime();
      return;
    }

    giTimeCompressMode++;

    // in map screen, we wanna have to skip over x1 compression and go straight to 5x
    if ((guiCurrentScreen == MAP_SCREEN) && (giTimeCompressMode == TIME_COMPRESS_X1)) {
      giTimeCompressMode++;
    }

    SetClockResolutionToCompressMode(giTimeCompressMode);
  }
}

function DecreaseGameTimeCompressionRate(): void {
  // if not already at minimum time compression rate
  if (giTimeCompressMode > TIME_COMPRESS_X0) {
    // check that we can
    if (!AllowedToTimeCompress()) {
      // not allowed to compress time
      TellPlayerWhyHeCantCompressTime();
      return;
    }

    giTimeCompressMode--;

    // in map screen, we wanna have to skip over x1 compression and go straight to 5x
    if ((guiCurrentScreen == MAP_SCREEN) && (giTimeCompressMode == TIME_COMPRESS_X1)) {
      giTimeCompressMode--;
    }

    SetClockResolutionToCompressMode(giTimeCompressMode);
  }
}

function SetGameTimeCompressionLevel(uiCompressionRate: UINT32): void {
  Assert(uiCompressionRate < NUM_TIME_COMPRESS_SPEEDS);

  if (guiCurrentScreen == GAME_SCREEN) {
    if (uiCompressionRate != TIME_COMPRESS_X1) {
      uiCompressionRate = TIME_COMPRESS_X1;
    }
  }

  if (guiCurrentScreen == MAP_SCREEN) {
    if (uiCompressionRate == TIME_COMPRESS_X1) {
      uiCompressionRate = TIME_COMPRESS_X0;
    }
  }

  // if we're attempting time compression
  if (uiCompressionRate >= TIME_COMPRESS_5MINS) {
    // check that we can
    if (!AllowedToTimeCompress()) {
      // not allowed to compress time
      TellPlayerWhyHeCantCompressTime();
      return;
    }
  }

  giTimeCompressMode = uiCompressionRate;
  SetClockResolutionToCompressMode(giTimeCompressMode);
}

function SetClockResolutionToCompressMode(iCompressMode: INT32): void {
  guiGameSecondsPerRealSecond = giTimeCompressSpeeds[iCompressMode] * SECONDS_PER_COMPRESSION;

  // ok this is a bit confusing, but for time compression (e.g. 30x60) we want updates
  // 30x per second, but for standard unpaused time, like in tactical, we want 1x per second
  if (guiGameSecondsPerRealSecond == 0) {
    SetClockResolutionPerSecond(0);
  } else {
    SetClockResolutionPerSecond(max(1, (guiGameSecondsPerRealSecond / 60)));
  }

  // if the compress mode is X0 or X1
  if (iCompressMode <= TIME_COMPRESS_X1) {
    gfTimeCompressionOn = FALSE;
  } else {
    gfTimeCompressionOn = TRUE;

    // handle the player just starting a game
    HandleTimeCompressWithTeamJackedInAndGearedToGo();
  }

  fMapScreenBottomDirty = TRUE;
}

function SetGameHoursPerSecond(uiGameHoursPerSecond: UINT32): void {
  giTimeCompressMode = NOT_USING_TIME_COMPRESSION;
  guiGameSecondsPerRealSecond = uiGameHoursPerSecond * 3600;
  if (uiGameHoursPerSecond == 1) {
    SetClockResolutionPerSecond(60);
  } else {
    SetClockResolutionPerSecond(59);
  }
}

function SetGameMinutesPerSecond(uiGameMinutesPerSecond: UINT32): void {
  giTimeCompressMode = NOT_USING_TIME_COMPRESSION;
  guiGameSecondsPerRealSecond = uiGameMinutesPerSecond * 60;
  SetClockResolutionPerSecond(uiGameMinutesPerSecond);
}

function SetGameSecondsPerSecond(uiGameSecondsPerSecond: UINT32): void {
  giTimeCompressMode = NOT_USING_TIME_COMPRESSION;
  guiGameSecondsPerRealSecond = uiGameSecondsPerSecond;
  //	SetClockResolutionPerSecond( (UINT8)(guiGameSecondsPerRealSecond / 60) );
  if (guiGameSecondsPerRealSecond == 0) {
    SetClockResolutionPerSecond(0);
  } else {
    SetClockResolutionPerSecond(max(1, (guiGameSecondsPerRealSecond / 60)));
  }
}

// call this to prevent player from changing the time compression state via the interface

function LockPauseState(uiUniqueReasonId: UINT32): void {
  gfLockPauseState = TRUE;

  // if adding a new call, please choose a new uiUniqueReasonId, this helps track down the cause when it's left locked
  // Highest # used was 21 on Feb 15 '99.
  guiLockPauseStateLastReasonId = uiUniqueReasonId;
}

// call this to allow player to change the time compression state via the interface once again
function UnLockPauseState(): void {
  gfLockPauseState = FALSE;
}

// tells you whether the player is currently locked out from messing with the time compression state
function PauseStateLocked(): BOOLEAN {
  return gfLockPauseState;
}

function PauseGame(): void {
  // always allow pausing, even if "locked".  Locking applies only to trying to compress time, not to pausing it
  if (!gfGamePaused) {
    gfGamePaused = TRUE;
    fMapScreenBottomDirty = TRUE;
  }
}

function UnPauseGame(): void {
  // if we're paused
  if (gfGamePaused) {
    // ignore request if locked
    if (gfLockPauseState) {
      ScreenMsg(FONT_ORANGE, MSG_TESTVERSION, L"Call to UnPauseGame() while Pause State is LOCKED! AM-4");
      return;
    }

    gfGamePaused = FALSE;
    fMapScreenBottomDirty = TRUE;
  }
}

function TogglePause(): void {
  if (gfGamePaused) {
    UnPauseGame();
  } else {
    PauseGame();
  }
}

function GamePaused(): BOOLEAN {
  return gfGamePaused;
}

// ONLY APPLICABLE INSIDE EVENT CALLBACKS!
function InterruptTime(): void {
  gfTimeInterrupt = TRUE;
}

function PauseTimeForInterupt(): void {
  gfTimeInterruptPause = TRUE;
}

// USING CLOCK RESOLUTION
// Note, that changing the clock resolution doesn't effect the amount of game time that passes per
// real second, but how many times per second the clock is updated.  This rate will break up the actual
// time slices per second into smaller chunks.  This is useful for animating strategic movement under
// fast time compression, so objects don't warp around.
function SetClockResolutionToDefault(): void {
  gubClockResolution = 1;
}

// Valid range is 0 - 60 times per second.
function SetClockResolutionPerSecond(ubNumTimesPerSecond: UINT8): void {
  ubNumTimesPerSecond = (max(0, min(60, ubNumTimesPerSecond)));
  gubClockResolution = ubNumTimesPerSecond;
}

// Function for accessing the current rate
function ClockResolution(): UINT8 {
  return gubClockResolution;
}

// There are two factors that influence the flow of time in the game.
//-Speed:  The speed is the amount of game time passes per real second of time.  The higher this
//         value, the faster the game time flows.
//-Resolution:  The higher the resolution, the more often per second the clock is actually updated.
//				 This value doesn't affect how much game time passes per real second, but allows for
//				 a more accurate representation of faster time flows.
function UpdateClock(): void {
  let uiNewTime: UINT32;
  let uiThousandthsOfThisSecondProcessed: UINT32;
  let uiTimeSlice: UINT32;
  let uiNewTimeProcessed: UINT32;
  let uiAmountToAdvanceTime: UINT32;
  /* static */ let ubLastResolution: UINT8 = 1;
  /* static */ let uiLastSecondTime: UINT32 = 0;
  /* static */ let uiLastTimeProcessed: UINT32 = 0;
  // check game state for pause screen masks
  CreateDestroyScreenMaskForPauseGame();

  if (guiCurrentScreen != GAME_SCREEN && guiCurrentScreen != MAP_SCREEN && guiCurrentScreen != GAME_SCREEN)
  {
    uiLastSecondTime = GetJA2Clock();
    gfTimeInterruptPause = FALSE;
    return;
  }

  if (gfGamePaused || gfTimeInterruptPause || (gubClockResolution == 0) || !guiGameSecondsPerRealSecond || ARE_IN_FADE_IN() || gfFadeOut) {
    uiLastSecondTime = GetJA2Clock();
    gfTimeInterruptPause = FALSE;
    return;
  }

  if ((gTacticalStatus.uiFlags & TURNBASED && gTacticalStatus.uiFlags & INCOMBAT))
    return; // time is currently stopped!

  uiNewTime = GetJA2Clock();

  // Because we debug so much, breakpoints tend to break the game, and cause unnecessary headaches.
  // This line ensures that no more than 1 real-second passes between frames.  This otherwise has
  // no effect on anything else.
  uiLastSecondTime = max(uiNewTime - 1000, uiLastSecondTime);

  // 1000's of a second difference since last second.
  uiThousandthsOfThisSecondProcessed = uiNewTime - uiLastSecondTime;

  if (uiThousandthsOfThisSecondProcessed >= 1000 && gubClockResolution == 1) {
    uiLastSecondTime = uiNewTime;
    guiTimesThisSecondProcessed = uiLastTimeProcessed = 0;
    AdvanceClock(WARPTIME_PROCESS_EVENTS_NORMALLY);
  } else if (gubClockResolution > 1) {
    if (gubClockResolution != ubLastResolution) {
      // guiTimesThisSecondProcessed = guiTimesThisSecondProcessed * ubLastResolution / gubClockResolution % gubClockResolution;
      guiTimesThisSecondProcessed = guiTimesThisSecondProcessed * gubClockResolution / ubLastResolution;
      uiLastTimeProcessed = uiLastTimeProcessed * gubClockResolution / ubLastResolution;
      ubLastResolution = gubClockResolution;
    }
    uiTimeSlice = 1000000 / gubClockResolution;
    if (uiThousandthsOfThisSecondProcessed >= uiTimeSlice * (guiTimesThisSecondProcessed + 1) / 1000) {
      guiTimesThisSecondProcessed = uiThousandthsOfThisSecondProcessed * 1000 / uiTimeSlice;
      uiNewTimeProcessed = guiGameSecondsPerRealSecond * guiTimesThisSecondProcessed / gubClockResolution;

      uiNewTimeProcessed = max(uiNewTimeProcessed, uiLastTimeProcessed);

      uiAmountToAdvanceTime = uiNewTimeProcessed - uiLastTimeProcessed;

      WarpGameTime(uiNewTimeProcessed - uiLastTimeProcessed, WARPTIME_PROCESS_EVENTS_NORMALLY);
      if (uiNewTimeProcessed < guiGameSecondsPerRealSecond) {
        // Processed the same real second
        uiLastTimeProcessed = uiNewTimeProcessed;
      } else {
        // We have moved into a new real second.
        uiLastTimeProcessed = uiNewTimeProcessed % guiGameSecondsPerRealSecond;
        if (gubClockResolution > 0) {
          guiTimesThisSecondProcessed %= gubClockResolution;
        } else {
          // this branch occurs whenever an event during WarpGameTime stops time compression!
          guiTimesThisSecondProcessed = 0;
        }
        uiLastSecondTime = uiNewTime;
      }
    }
  }
}

function SaveGameClock(hFile: HWFILE, fGamePaused: BOOLEAN, fLockPauseState: BOOLEAN): BOOLEAN {
  let uiNumBytesWritten: UINT32 = 0;

  FileWrite(hFile, &giTimeCompressMode, sizeof(INT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(INT32))
    return FALSE;

  FileWrite(hFile, &gubClockResolution, sizeof(UINT8), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT8))
    return FALSE;

  FileWrite(hFile, &fGamePaused, sizeof(BOOLEAN), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(BOOLEAN))
    return FALSE;

  FileWrite(hFile, &gfTimeInterrupt, sizeof(BOOLEAN), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(BOOLEAN))
    return FALSE;

  FileWrite(hFile, &fSuperCompression, sizeof(BOOLEAN), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(BOOLEAN))
    return FALSE;

  FileWrite(hFile, &guiGameClock, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32))
    return FALSE;

  FileWrite(hFile, &guiGameSecondsPerRealSecond, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32))
    return FALSE;

  FileWrite(hFile, &ubAmbientLightLevel, sizeof(UINT8), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT8))
    return FALSE;

  FileWrite(hFile, &guiEnvTime, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32))
    return FALSE;

  FileWrite(hFile, &guiEnvDay, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32))
    return FALSE;

  FileWrite(hFile, &gubEnvLightValue, sizeof(UINT8), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT8))
    return FALSE;

  FileWrite(hFile, &guiTimeOfLastEventQuery, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32))
    return FALSE;

  FileWrite(hFile, &fLockPauseState, sizeof(BOOLEAN), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(BOOLEAN))
    return FALSE;

  FileWrite(hFile, &gfPauseDueToPlayerGamePause, sizeof(BOOLEAN), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(BOOLEAN))
    return FALSE;

  FileWrite(hFile, &gfResetAllPlayerKnowsEnemiesFlags, sizeof(BOOLEAN), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(BOOLEAN))
    return FALSE;

  FileWrite(hFile, &gfTimeCompressionOn, sizeof(BOOLEAN), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(BOOLEAN))
    return FALSE;

  FileWrite(hFile, &guiPreviousGameClock, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32))
    return FALSE;

  FileWrite(hFile, &guiLockPauseStateLastReasonId, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32))
    return FALSE;

  FileWrite(hFile, gubUnusedTimePadding, TIME_PADDINGBYTES, &uiNumBytesWritten);
  if (uiNumBytesWritten != TIME_PADDINGBYTES)
    return FALSE;
  return TRUE;
}

function LoadGameClock(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32;

  FileRead(hFile, &giTimeCompressMode, sizeof(INT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(INT32))
    return FALSE;

  FileRead(hFile, &gubClockResolution, sizeof(UINT8), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT8))
    return FALSE;

  FileRead(hFile, &gfGamePaused, sizeof(BOOLEAN), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(BOOLEAN))
    return FALSE;

  FileRead(hFile, &gfTimeInterrupt, sizeof(BOOLEAN), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(BOOLEAN))
    return FALSE;

  FileRead(hFile, &fSuperCompression, sizeof(BOOLEAN), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(BOOLEAN))
    return FALSE;

  FileRead(hFile, &guiGameClock, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32))
    return FALSE;

  FileRead(hFile, &guiGameSecondsPerRealSecond, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32))
    return FALSE;

  FileRead(hFile, &ubAmbientLightLevel, sizeof(UINT8), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT8))
    return FALSE;

  FileRead(hFile, &guiEnvTime, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32))
    return FALSE;

  FileRead(hFile, &guiEnvDay, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32))
    return FALSE;

  FileRead(hFile, &gubEnvLightValue, sizeof(UINT8), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT8))
    return FALSE;

  FileRead(hFile, &guiTimeOfLastEventQuery, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32))
    return FALSE;

  FileRead(hFile, &gfLockPauseState, sizeof(BOOLEAN), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(BOOLEAN))
    return FALSE;

  FileRead(hFile, &gfPauseDueToPlayerGamePause, sizeof(BOOLEAN), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(BOOLEAN))
    return FALSE;

  FileRead(hFile, &gfResetAllPlayerKnowsEnemiesFlags, sizeof(BOOLEAN), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(BOOLEAN))
    return FALSE;

  FileRead(hFile, &gfTimeCompressionOn, sizeof(BOOLEAN), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(BOOLEAN))
    return FALSE;

  FileRead(hFile, &guiPreviousGameClock, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32))
    return FALSE;

  FileRead(hFile, &guiLockPauseStateLastReasonId, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32))
    return FALSE;

  FileRead(hFile, gubUnusedTimePadding, TIME_PADDINGBYTES, &uiNumBytesRead);
  if (uiNumBytesRead != TIME_PADDINGBYTES)
    return FALSE;

  // Update the game clock
  guiDay = (guiGameClock / NUM_SEC_IN_DAY);
  guiHour = (guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR;
  guiMin = (guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN;

  swprintf(WORLDTIMESTR, L"%s %d, %02d:%02d", pDayStrings[0], guiDay, guiHour, guiMin);

  if (!gfBasement && !gfCaves)
    gfDoLighting = TRUE;

  return TRUE;
}

function CreateMouseRegionForPauseOfClock(sX: INT16, sY: INT16): void {
  if (fClockMouseRegionCreated == FALSE) {
    // create a mouse region for pausing of game clock
    MSYS_DefineRegion(&gClockMouseRegion, (sX), (sY), (sX + CLOCK_REGION_WIDTH), (sY + CLOCK_REGION_HEIGHT), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, PauseOfClockBtnCallback);

    fClockMouseRegionCreated = TRUE;

    if (gfGamePaused == FALSE) {
      SetRegionFastHelpText(&gClockMouseRegion, pPausedGameText[2]);
    } else {
      SetRegionFastHelpText(&gClockMouseRegion, pPausedGameText[1]);
    }
  }
}

function RemoveMouseRegionForPauseOfClock(): void {
  // remove pause region
  if (fClockMouseRegionCreated == TRUE) {
    MSYS_RemoveRegion(&gClockMouseRegion);
    fClockMouseRegionCreated = FALSE;
  }
}

function PauseOfClockBtnCallback(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    HandlePlayerPauseUnPauseOfGame();
  }
}

function HandlePlayerPauseUnPauseOfGame(): void {
  if (gTacticalStatus.uiFlags & ENGAGED_IN_CONV) {
    return;
  }

  // check if the game is paused BY THE PLAYER or not and reverse
  if (gfGamePaused && gfPauseDueToPlayerGamePause) {
    // If in game screen...
    if (guiCurrentScreen == GAME_SCREEN) {
      if (giTimeCompressMode == TIME_COMPRESS_X0) {
        giTimeCompressMode++;
      }

      // ATE: re-render
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    UnPauseGame();
    PauseTime(FALSE);
    gfIgnoreScrolling = FALSE;
    gfPauseDueToPlayerGamePause = FALSE;
  } else {
    // pause game
    PauseGame();
    PauseTime(TRUE);
    gfIgnoreScrolling = TRUE;
    gfPauseDueToPlayerGamePause = TRUE;
  }

  return;
}

function CreateDestroyScreenMaskForPauseGame(): void {
  /* static */ let fCreated: BOOLEAN = FALSE;
  let sX: INT16 = 0;
  let sY: INT16 = 0;

  if (((fClockMouseRegionCreated == FALSE) || (gfGamePaused == FALSE) || (gfPauseDueToPlayerGamePause == FALSE)) && (fCreated == TRUE)) {
    fCreated = FALSE;
    MSYS_RemoveRegion(&gClockScreenMaskMouseRegion);
    RemoveMercPopupBoxFromIndex(iPausedPopUpBox);
    iPausedPopUpBox = -1;
    SetRenderFlags(RENDER_FLAG_FULL);
    fTeamPanelDirty = TRUE;
    fMapPanelDirty = TRUE;
    fMapScreenBottomDirty = TRUE;
    gfJustFinishedAPause = TRUE;
    MarkButtonsDirty();
    SetRenderFlags(RENDER_FLAG_FULL);
  } else if ((gfPauseDueToPlayerGamePause == TRUE) && (fCreated == FALSE)) {
    // create a mouse region for pausing of game clock
    MSYS_DefineRegion(&gClockScreenMaskMouseRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST, 0, MSYS_NO_CALLBACK, ScreenMaskForGamePauseBtnCallBack);
    fCreated = TRUE;

    // get region x and y values
    sX = (&gClockMouseRegion)->RegionTopLeftX;
    sY = (&gClockMouseRegion)->RegionTopLeftY;

    // re create region on top of this
    RemoveMouseRegionForPauseOfClock();
    CreateMouseRegionForPauseOfClock(sX, sY);

    SetRegionFastHelpText(&gClockMouseRegion, pPausedGameText[1]);

    fMapScreenBottomDirty = TRUE;

    // UnMarkButtonsDirty( );

    // now create the pop up box to say the game is paused
    iPausedPopUpBox = PrepareMercPopupBox(iPausedPopUpBox, BASIC_MERC_POPUP_BACKGROUND, BASIC_MERC_POPUP_BORDER, pPausedGameText[0], 300, 0, 0, 0, &usPausedActualWidth, &usPausedActualHeight);
  }
}

function ScreenMaskForGamePauseBtnCallBack(pRegion: Pointer<MOUSE_REGION>, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // unpause the game
    HandlePlayerPauseUnPauseOfGame();
  }
}

function RenderPausedGameBox(): void {
  if ((gfPauseDueToPlayerGamePause == TRUE) && (gfGamePaused == TRUE) && (iPausedPopUpBox != -1)) {
    RenderMercPopUpBoxFromIndex(iPausedPopUpBox, (320 - usPausedActualWidth / 2), (200 - usPausedActualHeight / 2), FRAME_BUFFER);
    InvalidateRegion((320 - usPausedActualWidth / 2), (200 - usPausedActualHeight / 2), (320 - usPausedActualWidth / 2 + usPausedActualWidth), (200 - usPausedActualHeight / 2 + usPausedActualHeight));
  }

  // reset we've just finished a pause by the player
  gfJustFinishedAPause = FALSE;
}

function DayTime(): BOOLEAN {
  // between 7AM and 9PM
  return guiHour >= 7 && guiHour < 21;
}

function NightTime(): BOOLEAN {
  // before 7AM or after 9PM
  return guiHour < 7 || guiHour >= 21;
}

function ClearTacticalStuffDueToTimeCompression(): void {
  // is this test the right thing?  ARM
  if (guiTacticalInterfaceFlags & INTERFACE_MAPSCREEN) {
    // clear tactical event queue
    ClearEventQueue();

    // clear tactical message queue
    ClearTacticalMessageQueue();

    if (gfWorldLoaded) {
      // clear tactical actions
      CencelAllActionsForTimeCompression();
    }
  }
}
