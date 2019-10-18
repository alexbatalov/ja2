typedef UINT32 TIMER;

#define MAIN_TIMER_ID 1

#define MILLISECONDS(a) (a)
#define SECONDS(a) ((a) / 1000)
#define MINUTES(a) (SECOND((a)) / 60)
#define HOURS(a) (MINUTES((a)) / 60)
#define DAYS(a) (HOURS((a)) / 24)

BOOLEAN InitializeClockManager(void);
void ShutdownClockManager(void);
TIMER GetClock(void);
TIMER SetCountdownClock(UINT32 TimeToElapse);
UINT32 ClockIsTicking(TIMER uiTimer);
