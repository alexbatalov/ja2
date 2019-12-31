namespace ja2 {

//#define DEBUG_GAME_CLOCK

// is the clock pause region created currently?
let fClockMouseRegionCreated: boolean = false;

let fTimeCompressHasOccured: boolean = false;

// This value represents the time that the sector was loaded.  If you are in sector A9, and leave
// the game clock at that moment will get saved into the temp file associated with it.  The next time you
// enter A9, this value will contain that time.  Used for scheduling purposes.
export let guiTimeCurrentSectorWasLastLoaded: UINT32 = 0;

// did we JUST finish up a game pause by the player
let gfJustFinishedAPause: boolean = false;

// clock mouse region
let gClockMouseRegion: MOUSE_REGION = createMouseRegion();
let gClockScreenMaskMouseRegion: MOUSE_REGION = createMouseRegion();

const SECONDS_PER_COMPRESSION = 1; // 1/2 minute passes every 1 second of real time
const SECONDS_PER_COMPRESSION_IN_RTCOMBAT = 10;
const SECONDS_PER_COMPRESSION_IN_TBCOMBAT = 10;
const CLOCK_STRING_HEIGHT = 13;
const CLOCK_STRING_WIDTH = 66;
const CLOCK_FONT = () => COMPFONT();

// These contain all of the information about the game time, rate of time, etc.
// All of these get saved and loaded.
export let giTimeCompressMode: INT32 = Enum130.TIME_COMPRESS_X0;
let gubClockResolution: UINT8 = 1;
export let gfGamePaused: boolean = true;
export let gfTimeInterrupt: boolean = false;
let gfTimeInterruptPause: boolean = false;
let fSuperCompression: boolean = false;
export let guiGameClock: UINT32 = STARTING_TIME;
let guiPreviousGameClock: UINT32 = 0; // used only for error-checking purposes
let guiGameSecondsPerRealSecond: UINT32;
let guiTimesThisSecondProcessed: UINT32 = 0;
let iPausedPopUpBox: INT32 = -1;
export let guiDay: UINT32;
export let guiHour: UINT32;
export let guiMin: UINT32;
export let gswzWorldTimeStr: string /* UINT16[20] */;
export let giTimeCompressSpeeds: INT32[] /* [NUM_TIME_COMPRESS_SPEEDS] */ = [
  0,
  1,
  5 * 60,
  30 * 60,
  60 * 60,
];
let usPausedActualWidth: UINT16;
let usPausedActualHeight: UINT16;
export let guiTimeOfLastEventQuery: UINT32 = 0;
export let gfLockPauseState: boolean = false;
export let gfPauseDueToPlayerGamePause: boolean = false;
export let gfResetAllPlayerKnowsEnemiesFlags: boolean = false;
let gfTimeCompressionOn: boolean = false;
let guiLockPauseStateLastReasonId: UINT32 = 0;
//***When adding new saved time variables, make sure you remove the appropriate amount from the paddingbytes and
//   more IMPORTANTLY, add appropriate code in Save/LoadGameClock()!
const TIME_PADDINGBYTES = 20;
let gubUnusedTimePadding: UINT8[] /* [TIME_PADDINGBYTES] */ = createArray(TIME_PADDINGBYTES, 0);

export function InitNewGameClock(): void {
  guiGameClock = STARTING_TIME;
  guiPreviousGameClock = STARTING_TIME;
  guiDay = Math.trunc(guiGameClock / NUM_SEC_IN_DAY);
  guiHour = Math.trunc((guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR);
  guiMin = Math.trunc((guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN);
  gswzWorldTimeStr = swprintf("%s %d, %s:%s", pDayStrings[0], guiDay, guiHour.toString().padStart(2, '0'), guiMin.toString().padStart(2, '0'));
  guiTimeCurrentSectorWasLastLoaded = 0;
  guiGameSecondsPerRealSecond = 0;
  gubClockResolution = 1;
  gubUnusedTimePadding.fill(0);
}

export function GetWorldTotalMin(): UINT32 {
  return guiGameClock / NUM_SEC_IN_MIN;
}

export function GetWorldTotalSeconds(): UINT32 {
  return guiGameClock;
}

export function GetWorldHour(): UINT32 {
  return guiHour;
}

export function GetWorldMinutesInDay(): UINT32 {
  return (guiHour * 60) + guiMin;
}

export function GetWorldDay(): UINT32 {
  return guiDay;
}

export function GetWorldDayInSeconds(): UINT32 {
  return guiDay * NUM_SEC_IN_DAY;
}

export function GetWorldDayInMinutes(): UINT32 {
  return Math.trunc((guiDay * NUM_SEC_IN_DAY) / NUM_SEC_IN_MIN);
}

export function GetFutureDayInMinutes(uiDay: UINT32): UINT32 {
  return Math.trunc((uiDay * NUM_SEC_IN_DAY) / NUM_SEC_IN_MIN);
}

// this function returns the amount of minutes there has been from start of game to midnight of the uiDay.
export function GetMidnightOfFutureDayInMinutes(uiDay: UINT32): UINT32 {
  return GetWorldTotalMin() + (uiDay * 1440) - GetWorldMinutesInDay();
}

// Not to be used too often by things other than internally
export function WarpGameTime(uiAdjustment: UINT32, ubWarpCode: UINT8): void {
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

  if (ubWarpCode != Enum131.WARPTIME_NO_PROCESSING_OF_EVENTS) {
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
    AssertMsg(false, FormatString("AdvanceClock: TIME FLOWING BACKWARDS!!! guiPreviousGameClock %d, now %d", guiPreviousGameClock, guiGameClock));

    // fix it if assertions are disabled
    guiGameClock = guiPreviousGameClock;
  }

  // store previous game clock value (for error-checking purposes only)
  guiPreviousGameClock = guiGameClock;

  // Calculate the day, hour, and minutes.
  guiDay = Math.trunc(guiGameClock / NUM_SEC_IN_DAY);
  guiHour = Math.trunc((guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR);
  guiMin = Math.trunc((guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN);

  gswzWorldTimeStr = swprintf("%s %d, %s:%s", gpGameClockString[Enum366.STR_GAMECLOCK_DAY_NAME], guiDay, guiHour.toString().padStart(2, '0'), guiMin.toString().padStart(2, '0'));

  if (gfResetAllPlayerKnowsEnemiesFlags && !gTacticalStatus.fEnemyInSector) {
    ClearAnySectorsFlashingNumberOfEnemies();

    gfResetAllPlayerKnowsEnemiesFlags = false;
  }

  ForecastDayEvents();
}

function AdvanceToNextDay(): void {
  let uiDiff: INT32;
  let uiTomorrowTimeInSec: UINT32;

  uiTomorrowTimeInSec = (guiDay + 1) * NUM_SEC_IN_DAY + 8 * NUM_SEC_IN_HOUR + 15 * NUM_SEC_IN_MIN;
  uiDiff = uiTomorrowTimeInSec - guiGameClock;
  WarpGameTime(uiDiff, Enum131.WARPTIME_PROCESS_EVENTS_NORMALLY);

  ForecastDayEvents();
}

// set the flag that time compress has occured
function SetFactTimeCompressHasOccured(): void {
  fTimeCompressHasOccured = true;
  return;
}

// reset fact the time compress has occured
export function ResetTimeCompressHasOccured(): void {
  fTimeCompressHasOccured = false;
  return;
}

// has time compress occured?
export function HasTimeCompressOccured(): boolean {
  return fTimeCompressHasOccured;
}

export function RenderClock(sX: INT16, sY: INT16): void {
  SetFont(CLOCK_FONT());
  SetFontBackground(FONT_MCOLOR_BLACK);

  // Are we in combat?
  if (gTacticalStatus.uiFlags & INCOMBAT) {
    SetFontForeground(FONT_FCOLOR_NICERED);
  } else {
    SetFontForeground(FONT_LTGREEN);
  }

  // Erase first!
  RestoreExternBackgroundRect(sX, sY, CLOCK_STRING_WIDTH, CLOCK_STRING_HEIGHT);

  if ((gfPauseDueToPlayerGamePause == false)) {
    mprintf(sX + Math.trunc((CLOCK_STRING_WIDTH - StringPixLength(gswzWorldTimeStr, CLOCK_FONT())) / 2), sY, gswzWorldTimeStr);
  } else {
    mprintf(sX + Math.trunc((CLOCK_STRING_WIDTH - StringPixLength(pPausedGameText[0], CLOCK_FONT())) / 2), sY, pPausedGameText[0]);
  }
}

/* static */ let ToggleSuperCompression__uiOldTimeCompressMode: UINT32 = 0;
function ToggleSuperCompression(): void {
  // Display message
  if (gTacticalStatus.uiFlags & INCOMBAT) {
    // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, L"Cannot toggle compression in Combat Mode."  );
    return;
  }

  fSuperCompression = (!fSuperCompression);

  if (fSuperCompression) {
    ToggleSuperCompression__uiOldTimeCompressMode = giTimeCompressMode;
    giTimeCompressMode = Enum130.TIME_SUPER_COMPRESS;
    guiGameSecondsPerRealSecond = giTimeCompressSpeeds[giTimeCompressMode] * SECONDS_PER_COMPRESSION;

    // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, L"Time compression ON."  );
  } else {
    giTimeCompressMode = ToggleSuperCompression__uiOldTimeCompressMode;
    guiGameSecondsPerRealSecond = giTimeCompressSpeeds[giTimeCompressMode] * SECONDS_PER_COMPRESSION;

    // ScreenMsg( MSG_FONT_YELLOW, MSG_INTERFACE, L"Time compression OFF."  );
  }
}

export function DidGameJustStart(): boolean {
  if (gTacticalStatus.fDidGameJustStart)
    return true;
  else
    return false;
}

export function StopTimeCompression(): void {
  if (gfTimeCompressionOn) {
    // change the clock resolution to no time passage, but don't actually change the compress mode (remember it)
    SetClockResolutionToCompressMode(Enum130.TIME_COMPRESS_X0);
  }
}

export function StartTimeCompression(): void {
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
    if (giTimeCompressMode <= Enum130.TIME_COMPRESS_X1) {
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
export function IsTimeBeingCompressed(): boolean {
  if (!gfTimeCompressionOn || (giTimeCompressMode == Enum130.TIME_COMPRESS_X0) || gfGamePaused)
    return false;
  else
    return true;
}

// returns TRUE if the player currently doesn't want time to be compressing
export function IsTimeCompressionOn(): boolean {
  return gfTimeCompressionOn;
}

export function IncreaseGameTimeCompressionRate(): void {
  // if not already at maximum time compression rate
  if (giTimeCompressMode < Enum130.TIME_COMPRESS_60MINS) {
    // check that we can
    if (!AllowedToTimeCompress()) {
      // not allowed to compress time
      TellPlayerWhyHeCantCompressTime();
      return;
    }

    giTimeCompressMode++;

    // in map screen, we wanna have to skip over x1 compression and go straight to 5x
    if ((guiCurrentScreen == Enum26.MAP_SCREEN) && (giTimeCompressMode == Enum130.TIME_COMPRESS_X1)) {
      giTimeCompressMode++;
    }

    SetClockResolutionToCompressMode(giTimeCompressMode);
  }
}

export function DecreaseGameTimeCompressionRate(): void {
  // if not already at minimum time compression rate
  if (giTimeCompressMode > Enum130.TIME_COMPRESS_X0) {
    // check that we can
    if (!AllowedToTimeCompress()) {
      // not allowed to compress time
      TellPlayerWhyHeCantCompressTime();
      return;
    }

    giTimeCompressMode--;

    // in map screen, we wanna have to skip over x1 compression and go straight to 5x
    if ((guiCurrentScreen == Enum26.MAP_SCREEN) && (giTimeCompressMode == Enum130.TIME_COMPRESS_X1)) {
      giTimeCompressMode--;
    }

    SetClockResolutionToCompressMode(giTimeCompressMode);
  }
}

export function SetGameTimeCompressionLevel(uiCompressionRate: UINT32): void {
  Assert(uiCompressionRate < Enum130.NUM_TIME_COMPRESS_SPEEDS);

  if (guiCurrentScreen == Enum26.GAME_SCREEN) {
    if (uiCompressionRate != Enum130.TIME_COMPRESS_X1) {
      uiCompressionRate = Enum130.TIME_COMPRESS_X1;
    }
  }

  if (guiCurrentScreen == Enum26.MAP_SCREEN) {
    if (uiCompressionRate == Enum130.TIME_COMPRESS_X1) {
      uiCompressionRate = Enum130.TIME_COMPRESS_X0;
    }
  }

  // if we're attempting time compression
  if (uiCompressionRate >= Enum130.TIME_COMPRESS_5MINS) {
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
    SetClockResolutionPerSecond(Math.max(1, Math.trunc(guiGameSecondsPerRealSecond / 60)));
  }

  // if the compress mode is X0 or X1
  if (iCompressMode <= Enum130.TIME_COMPRESS_X1) {
    gfTimeCompressionOn = false;
  } else {
    gfTimeCompressionOn = true;

    // handle the player just starting a game
    HandleTimeCompressWithTeamJackedInAndGearedToGo();
  }

  fMapScreenBottomDirty = true;
}

function SetGameHoursPerSecond(uiGameHoursPerSecond: UINT32): void {
  giTimeCompressMode = Enum130.NOT_USING_TIME_COMPRESSION;
  guiGameSecondsPerRealSecond = uiGameHoursPerSecond * 3600;
  if (uiGameHoursPerSecond == 1) {
    SetClockResolutionPerSecond(60);
  } else {
    SetClockResolutionPerSecond(59);
  }
}

function SetGameMinutesPerSecond(uiGameMinutesPerSecond: UINT32): void {
  giTimeCompressMode = Enum130.NOT_USING_TIME_COMPRESSION;
  guiGameSecondsPerRealSecond = uiGameMinutesPerSecond * 60;
  SetClockResolutionPerSecond(uiGameMinutesPerSecond);
}

function SetGameSecondsPerSecond(uiGameSecondsPerSecond: UINT32): void {
  giTimeCompressMode = Enum130.NOT_USING_TIME_COMPRESSION;
  guiGameSecondsPerRealSecond = uiGameSecondsPerSecond;
  //	SetClockResolutionPerSecond( (UINT8)(guiGameSecondsPerRealSecond / 60) );
  if (guiGameSecondsPerRealSecond == 0) {
    SetClockResolutionPerSecond(0);
  } else {
    SetClockResolutionPerSecond(Math.max(1, Math.trunc(guiGameSecondsPerRealSecond / 60)));
  }
}

// call this to prevent player from changing the time compression state via the interface

export function LockPauseState(uiUniqueReasonId: UINT32): void {
  gfLockPauseState = true;

  // if adding a new call, please choose a new uiUniqueReasonId, this helps track down the cause when it's left locked
  // Highest # used was 21 on Feb 15 '99.
  guiLockPauseStateLastReasonId = uiUniqueReasonId;
}

// call this to allow player to change the time compression state via the interface once again
export function UnLockPauseState(): void {
  gfLockPauseState = false;
}

// tells you whether the player is currently locked out from messing with the time compression state
export function PauseStateLocked(): boolean {
  return gfLockPauseState;
}

export function PauseGame(): void {
  // always allow pausing, even if "locked".  Locking applies only to trying to compress time, not to pausing it
  if (!gfGamePaused) {
    gfGamePaused = true;
    fMapScreenBottomDirty = true;
  }
}

export function UnPauseGame(): void {
  // if we're paused
  if (gfGamePaused) {
    // ignore request if locked
    if (gfLockPauseState) {
      ScreenMsg(FONT_ORANGE, MSG_TESTVERSION, "Call to UnPauseGame() while Pause State is LOCKED! AM-4");
      return;
    }

    gfGamePaused = false;
    fMapScreenBottomDirty = true;
  }
}

function TogglePause(): void {
  if (gfGamePaused) {
    UnPauseGame();
  } else {
    PauseGame();
  }
}

export function GamePaused(): boolean {
  return gfGamePaused;
}

// ONLY APPLICABLE INSIDE EVENT CALLBACKS!
export function InterruptTime(): void {
  gfTimeInterrupt = true;
}

export function PauseTimeForInterupt(): void {
  gfTimeInterruptPause = true;
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
  ubNumTimesPerSecond = (Math.max(0, Math.min(60, ubNumTimesPerSecond)));
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
/* static */ let UpdateClock__ubLastResolution: UINT8 = 1;
/* static */ let UpdateClock__uiLastSecondTime: UINT32 = 0;
/* static */ let UpdateClock__uiLastTimeProcessed: UINT32 = 0;
export function UpdateClock(): void {
  let uiNewTime: UINT32;
  let uiThousandthsOfThisSecondProcessed: UINT32;
  let uiTimeSlice: UINT32;
  let uiNewTimeProcessed: UINT32;
  let uiAmountToAdvanceTime: UINT32;
  // check game state for pause screen masks
  CreateDestroyScreenMaskForPauseGame();

  if (guiCurrentScreen != Enum26.GAME_SCREEN && guiCurrentScreen != Enum26.MAP_SCREEN && guiCurrentScreen != Enum26.GAME_SCREEN)
  {
    UpdateClock__uiLastSecondTime = GetJA2Clock();
    gfTimeInterruptPause = false;
    return;
  }

  if (gfGamePaused || gfTimeInterruptPause || (gubClockResolution == 0) || !guiGameSecondsPerRealSecond || ARE_IN_FADE_IN() || gfFadeOut) {
    UpdateClock__uiLastSecondTime = GetJA2Clock();
    gfTimeInterruptPause = false;
    return;
  }

  if ((gTacticalStatus.uiFlags & TURNBASED && gTacticalStatus.uiFlags & INCOMBAT))
    return; // time is currently stopped!

  uiNewTime = GetJA2Clock();

  // Because we debug so much, breakpoints tend to break the game, and cause unnecessary headaches.
  // This line ensures that no more than 1 real-second passes between frames.  This otherwise has
  // no effect on anything else.
  UpdateClock__uiLastSecondTime = Math.max(uiNewTime - 1000, UpdateClock__uiLastSecondTime);

  // 1000's of a second difference since last second.
  uiThousandthsOfThisSecondProcessed = uiNewTime - UpdateClock__uiLastSecondTime;

  if (uiThousandthsOfThisSecondProcessed >= 1000 && gubClockResolution == 1) {
    UpdateClock__uiLastSecondTime = uiNewTime;
    guiTimesThisSecondProcessed = UpdateClock__uiLastTimeProcessed = 0;
    AdvanceClock(Enum131.WARPTIME_PROCESS_EVENTS_NORMALLY);
  } else if (gubClockResolution > 1) {
    if (gubClockResolution != UpdateClock__ubLastResolution) {
      // guiTimesThisSecondProcessed = guiTimesThisSecondProcessed * ubLastResolution / gubClockResolution % gubClockResolution;
      guiTimesThisSecondProcessed = Math.trunc(guiTimesThisSecondProcessed * gubClockResolution / UpdateClock__ubLastResolution);
      UpdateClock__uiLastTimeProcessed = Math.trunc(UpdateClock__uiLastTimeProcessed * gubClockResolution / UpdateClock__ubLastResolution);
      UpdateClock__ubLastResolution = gubClockResolution;
    }
    uiTimeSlice = Math.trunc(1000000 / gubClockResolution);
    if (uiThousandthsOfThisSecondProcessed >= Math.trunc(uiTimeSlice * (guiTimesThisSecondProcessed + 1) / 1000)) {
      guiTimesThisSecondProcessed = Math.trunc(uiThousandthsOfThisSecondProcessed * 1000 / uiTimeSlice);
      uiNewTimeProcessed = Math.trunc(guiGameSecondsPerRealSecond * guiTimesThisSecondProcessed / gubClockResolution);

      uiNewTimeProcessed = Math.max(uiNewTimeProcessed, UpdateClock__uiLastTimeProcessed);

      uiAmountToAdvanceTime = uiNewTimeProcessed - UpdateClock__uiLastTimeProcessed;

      WarpGameTime(uiNewTimeProcessed - UpdateClock__uiLastTimeProcessed, Enum131.WARPTIME_PROCESS_EVENTS_NORMALLY);
      if (uiNewTimeProcessed < guiGameSecondsPerRealSecond) {
        // Processed the same real second
        UpdateClock__uiLastTimeProcessed = uiNewTimeProcessed;
      } else {
        // We have moved into a new real second.
        UpdateClock__uiLastTimeProcessed = uiNewTimeProcessed % guiGameSecondsPerRealSecond;
        if (gubClockResolution > 0) {
          guiTimesThisSecondProcessed %= gubClockResolution;
        } else {
          // this branch occurs whenever an event during WarpGameTime stops time compression!
          guiTimesThisSecondProcessed = 0;
        }
        UpdateClock__uiLastSecondTime = uiNewTime;
      }
    }
  }
}

export function SaveGameClock(hFile: HWFILE, fGamePaused: boolean, fLockPauseState: boolean): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let buffer: Buffer;

  buffer = Buffer.allocUnsafe(4);

  buffer.writeInt32LE(giTimeCompressMode, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4)
    return false;

  buffer.writeUInt8(gubClockResolution, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt8(Number(fGamePaused), 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt8(Number(gfTimeInterrupt), 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt8(Number(fSuperCompression), 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt32LE(guiGameClock, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4)
    return false;

  buffer.writeUInt32LE(guiGameSecondsPerRealSecond, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4)
    return false;

  buffer.writeUInt8(ubAmbientLightLevel, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt32LE(guiEnvTime, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4)
    return false;

  buffer.writeUInt32LE(guiEnvDay, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4)
    return false;

  buffer.writeUInt8(gubEnvLightValue, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt32LE(guiTimeOfLastEventQuery, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4)
    return false;

  buffer.writeUInt8(Number(fLockPauseState), 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt8(Number(gfPauseDueToPlayerGamePause), 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt8(Number(gfResetAllPlayerKnowsEnemiesFlags), 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

    buffer.writeUInt8(Number(gfTimeCompressionOn), 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1)
    return false;

  buffer.writeUInt32LE(guiPreviousGameClock, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4)
    return false;

  buffer.writeUInt32LE(guiLockPauseStateLastReasonId, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4)
    return false;

  buffer = Buffer.allocUnsafe(TIME_PADDINGBYTES);
  writeUIntArray(gubUnusedTimePadding, buffer, 0, 1);
  uiNumBytesWritten = FileWrite(hFile, buffer, TIME_PADDINGBYTES);
  if (uiNumBytesWritten != TIME_PADDINGBYTES)
    return false;
  return true;
}

export function LoadGameClock(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  buffer = Buffer.allocUnsafe(4);

  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4)
    return false;

  giTimeCompressMode = buffer.readInt32LE(0);

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  gubClockResolution = buffer.readUInt8(0);

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  gfGamePaused = Boolean(buffer.readUInt8(0));

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  gfTimeInterrupt = Boolean(buffer.readUInt8(0));

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  fSuperCompression = Boolean(buffer.readUInt8(0));

  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4)
    return false;

  guiGameClock = buffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4)
    return false;

  guiGameSecondsPerRealSecond = buffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  ubAmbientLightLevel = buffer.readUInt8(0);

  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4)
    return false;

  guiEnvTime = buffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4)
    return false;

  guiEnvDay = buffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  gubEnvLightValue = buffer.readUInt8(0);

  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4)
    return false;

  guiTimeOfLastEventQuery = buffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  gfLockPauseState = Boolean(buffer.readUInt8(0));

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  gfPauseDueToPlayerGamePause = Boolean(buffer.readUInt8(0));

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  gfResetAllPlayerKnowsEnemiesFlags = Boolean(buffer.readUInt8(0));

  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1)
    return false;

  gfTimeCompressionOn = Boolean(buffer.readUInt8(0));

  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4)
    return false;

  guiPreviousGameClock = buffer.readUInt32LE(0);

  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4)
    return false;

  guiLockPauseStateLastReasonId = buffer.readUInt32LE(0);

  buffer = Buffer.allocUnsafe(TIME_PADDINGBYTES);
  uiNumBytesRead = FileRead(hFile, buffer, TIME_PADDINGBYTES);
  if (uiNumBytesRead != TIME_PADDINGBYTES)
    return false;

  readUIntArray(gubUnusedTimePadding, buffer, 0, 1);

  // Update the game clock
  guiDay = Math.trunc(guiGameClock / NUM_SEC_IN_DAY);
  guiHour = Math.trunc((guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR);
  guiMin = Math.trunc((guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN);

  gswzWorldTimeStr = swprintf("%s %d, %s:%s", pDayStrings[0], guiDay, guiHour.toString().padStart(2, '0'), guiMin.toString().padStart(2, '0'));

  if (!gfBasement && !gfCaves)
    gfDoLighting = true;

  return true;
}

export function CreateMouseRegionForPauseOfClock(sX: INT16, sY: INT16): void {
  if (fClockMouseRegionCreated == false) {
    // create a mouse region for pausing of game clock
    MSYS_DefineRegion(gClockMouseRegion, (sX), (sY), (sX + CLOCK_REGION_WIDTH), (sY + CLOCK_REGION_HEIGHT), MSYS_PRIORITY_HIGHEST, MSYS_NO_CURSOR, MSYS_NO_CALLBACK, PauseOfClockBtnCallback);

    fClockMouseRegionCreated = true;

    if (gfGamePaused == false) {
      SetRegionFastHelpText(gClockMouseRegion, pPausedGameText[2]);
    } else {
      SetRegionFastHelpText(gClockMouseRegion, pPausedGameText[1]);
    }
  }
}

export function RemoveMouseRegionForPauseOfClock(): void {
  // remove pause region
  if (fClockMouseRegionCreated == true) {
    MSYS_RemoveRegion(gClockMouseRegion);
    fClockMouseRegionCreated = false;
  }
}

function PauseOfClockBtnCallback(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    HandlePlayerPauseUnPauseOfGame();
  }
}

export function HandlePlayerPauseUnPauseOfGame(): void {
  if (gTacticalStatus.uiFlags & ENGAGED_IN_CONV) {
    return;
  }

  // check if the game is paused BY THE PLAYER or not and reverse
  if (gfGamePaused && gfPauseDueToPlayerGamePause) {
    // If in game screen...
    if (guiCurrentScreen == Enum26.GAME_SCREEN) {
      if (giTimeCompressMode == Enum130.TIME_COMPRESS_X0) {
        giTimeCompressMode++;
      }

      // ATE: re-render
      SetRenderFlags(RENDER_FLAG_FULL);
    }

    UnPauseGame();
    PauseTime(false);
    gfIgnoreScrolling = false;
    gfPauseDueToPlayerGamePause = false;
  } else {
    // pause game
    PauseGame();
    PauseTime(true);
    gfIgnoreScrolling = true;
    gfPauseDueToPlayerGamePause = true;
  }

  return;
}

/* static */ let CreateDestroyScreenMaskForPauseGame__fCreated: boolean = false;
function CreateDestroyScreenMaskForPauseGame(): void {
  let sX: INT16 = 0;
  let sY: INT16 = 0;

  if (((fClockMouseRegionCreated == false) || (gfGamePaused == false) || (gfPauseDueToPlayerGamePause == false)) && (CreateDestroyScreenMaskForPauseGame__fCreated == true)) {
    CreateDestroyScreenMaskForPauseGame__fCreated = false;
    MSYS_RemoveRegion(gClockScreenMaskMouseRegion);
    RemoveMercPopupBoxFromIndex(iPausedPopUpBox);
    iPausedPopUpBox = -1;
    SetRenderFlags(RENDER_FLAG_FULL);
    fTeamPanelDirty = true;
    fMapPanelDirty = true;
    fMapScreenBottomDirty = true;
    gfJustFinishedAPause = true;
    MarkButtonsDirty();
    SetRenderFlags(RENDER_FLAG_FULL);
  } else if ((gfPauseDueToPlayerGamePause == true) && (CreateDestroyScreenMaskForPauseGame__fCreated == false)) {
    // create a mouse region for pausing of game clock
    MSYS_DefineRegion(gClockScreenMaskMouseRegion, 0, 0, 640, 480, MSYS_PRIORITY_HIGHEST, 0, MSYS_NO_CALLBACK, ScreenMaskForGamePauseBtnCallBack);
    CreateDestroyScreenMaskForPauseGame__fCreated = true;

    // get region x and y values
    sX = gClockMouseRegion.RegionTopLeftX;
    sY = gClockMouseRegion.RegionTopLeftY;

    // re create region on top of this
    RemoveMouseRegionForPauseOfClock();
    CreateMouseRegionForPauseOfClock(sX, sY);

    SetRegionFastHelpText(gClockMouseRegion, pPausedGameText[1]);

    fMapScreenBottomDirty = true;

    // UnMarkButtonsDirty( );

    // now create the pop up box to say the game is paused
    iPausedPopUpBox = PrepareMercPopupBox(iPausedPopUpBox, Enum324.BASIC_MERC_POPUP_BACKGROUND, Enum325.BASIC_MERC_POPUP_BORDER, pPausedGameText[0], 300, 0, 0, 0, createPointer(() => usPausedActualWidth, (v) => usPausedActualWidth = v), createPointer(() => usPausedActualHeight, (v) => usPausedActualHeight = v));
  }
}

function ScreenMaskForGamePauseBtnCallBack(pRegion: MOUSE_REGION, iReason: INT32): void {
  if (iReason & MSYS_CALLBACK_REASON_LBUTTON_UP) {
    // unpause the game
    HandlePlayerPauseUnPauseOfGame();
  }
}

export function RenderPausedGameBox(): void {
  if ((gfPauseDueToPlayerGamePause == true) && (gfGamePaused == true) && (iPausedPopUpBox != -1)) {
    RenderMercPopUpBoxFromIndex(iPausedPopUpBox, (320 - Math.trunc(usPausedActualWidth / 2)), (200 - Math.trunc(usPausedActualHeight / 2)), FRAME_BUFFER);
    InvalidateRegion((320 - Math.trunc(usPausedActualWidth / 2)), (200 - Math.trunc(usPausedActualHeight / 2)), (320 - Math.trunc(usPausedActualWidth / 2) + usPausedActualWidth), (200 - Math.trunc(usPausedActualHeight / 2) + usPausedActualHeight));
  }

  // reset we've just finished a pause by the player
  gfJustFinishedAPause = false;
}

export function DayTime(): boolean {
  // between 7AM and 9PM
  return guiHour >= 7 && guiHour < 21;
}

export function NightTime(): boolean {
  // before 7AM or after 9PM
  return guiHour < 7 || guiHour >= 21;
}

export function ClearTacticalStuffDueToTimeCompression(): void {
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

}
