namespace ja2 {

let guiStartupTime: UINT32;
let guiCurrentTime: UINT32;
let timerId: NodeJS.Timeout;

export function GetTickCount(): number {
  return Date.now();
}

function Clock(): void {
  guiCurrentTime = GetTickCount();
  if (guiCurrentTime < guiStartupTime) {
    // Adjust guiCurrentTime because of loopback on the timer value
    guiCurrentTime = guiCurrentTime + (0xffffffff - guiStartupTime);
  } else {
    // Adjust guiCurrentTime because of loopback on the timer value
    guiCurrentTime = guiCurrentTime - guiStartupTime;
  }
}

export function InitializeClockManager(): boolean {
  // Register the start time (use WIN95 API call)
  guiCurrentTime = guiStartupTime = GetTickCount();
  timerId = setInterval(Clock, 10);

  return true;
}

export function ShutdownClockManager(): void {
  // Make sure we kill the timer
  clearInterval(timerId);
}

export function GetClock(): TIMER {
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

}
