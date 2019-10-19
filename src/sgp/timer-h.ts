type TIMER = UINT32;

const MAIN_TIMER_ID = 1;

const MILLISECONDS = (a) => (a);
const SECONDS = (a) => ((a) / 1000);
const MINUTES = (a) => (SECOND((a)) / 60);
const HOURS = (a) => (MINUTES((a)) / 60);
const DAYS = (a) => (HOURS((a)) / 24);

BOOLEAN InitializeClockManager(void);
void ShutdownClockManager(void);
TIMER GetClock(void);
TIMER SetCountdownClock(UINT32 TimeToElapse);
UINT32 ClockIsTicking(TIMER uiTimer);
