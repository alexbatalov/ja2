UINT32 guiStartupTime;
UINT32 guiCurrentTime;

function Clock(hWindow: HWND, uMessage: UINT, idEvent: UINT, dwTime: DWORD): void {
  guiCurrentTime = GetTickCount();
  if (guiCurrentTime < guiStartupTime) {
    // Adjust guiCurrentTime because of loopback on the timer value
    guiCurrentTime = guiCurrentTime + (0xffffffff - guiStartupTime);
  } else {
    // Adjust guiCurrentTime because of loopback on the timer value
    guiCurrentTime = guiCurrentTime - guiStartupTime;
  }
}

function InitializeClockManager(): BOOLEAN {
  // Register the start time (use WIN95 API call)
  guiCurrentTime = guiStartupTime = GetTickCount();
  SetTimer(ghWindow, MAIN_TIMER_ID, 10, (TIMERPROC)Clock);

  return TRUE;
}

function ShutdownClockManager(): void {
  // Make sure we kill the timer
  KillTimer(ghWindow, MAIN_TIMER_ID);
}

function GetClock(): TIMER {
  return guiCurrentTime;
}

function SetCountdownClock(uiTimeToElapse: UINT32): TIMER {
  return guiCurrentTime + uiTimeToElapse;
}

function ClockIsTicking(uiTimer: TIMER): UINT32 {
  if (uiTimer > guiCurrentTime) {
    // Well timer still hasn't elapsed
    return uiTimer - guiCurrentTime;
  }
  // Time's up
  return 0;
}
