// where the time string itself is rendered
const CLOCK_X = 554;
const CLOCK_Y = 459;

// the mouse region around the clock (bigger)
const CLOCK_REGION_START_X = 552;
const CLOCK_REGION_START_Y = 456;
const CLOCK_REGION_WIDTH = (620 - CLOCK_REGION_START_X);
const CLOCK_REGION_HEIGHT = (468 - CLOCK_REGION_START_Y);

const NUM_SEC_IN_DAY = 86400;
const NUM_SEC_IN_HOUR = 3600;
const NUM_SEC_IN_MIN = 60;
const ROUNDTO_MIN = 5;

const NUM_MIN_IN_DAY = 1440;
const NUM_MIN_IN_HOUR = 60;

// Kris:
// This is the plan for game time...
// Game time should be restricted to outside code.  Think of it as encapsulation.  Anyway, using these
// simple functions, you will be able to change the amount of time that passes per frame.  The gameloop will
// automatically update the clock once per cycle, regardless of the mode you are in.
// This does pose potential problems in modes such as the editor, or similar where time shouldn't pass, and
// isn't currently handled.  The best thing to do in these cases is call the PauseGame() function when entering
// such a mode, and UnPauseGame() when finished.  Everything will be restored just the way you left it.  This
// is much simpler to handle in the overall scheme of things.

// time compression defines
const enum Enum130 {
  NOT_USING_TIME_COMPRESSION = -1,
  TIME_COMPRESS_X0,
  TIME_COMPRESS_X1,
  TIME_COMPRESS_5MINS,
  TIME_COMPRESS_30MINS,
  TIME_COMPRESS_60MINS,
  TIME_SUPER_COMPRESS,
  NUM_TIME_COMPRESS_SPEEDS,
}

// dereferenced with the above enumerations to provide the actual time compression rate.
extern INT32 giTimeCompressSpeeds[NUM_TIME_COMPRESS_SPEEDS];

const STARTING_TIME = ((1 * NUM_SEC_IN_HOUR) + (0 * NUM_SEC_IN_MIN) + NUM_SEC_IN_DAY); // 1am
const FIRST_ARRIVAL_DELAY = ((6 * NUM_SEC_IN_HOUR) + (0 * NUM_SEC_IN_MIN)); // 7am ( 6hours later)

const WORLDTIMESTR = () => gswzWorldTimeStr;

// compress mode now in use
INT32 giTimeCompressMode;

const enum Enum131 {
  WARPTIME_NO_PROCESSING_OF_EVENTS,
  WARPTIME_PROCESS_EVENTS_NORMALLY,
  WARPTIME_PROCESS_TARGET_TIME_FIRST,
}

extern UINT16 gswzWorldTimeStr[20]; // Day 99, 23:55

extern UINT32 guiDay;
extern UINT32 guiHour;
extern UINT32 guiMin;

// Advanced function used by certain event callbacks.  In the case where time is warped, certain event
// need to know how much time was warped since the last query to the event list.
// This function returns that value
extern UINT32 guiTimeOfLastEventQuery;

// This value represents the time that the sector was loaded.  If you are in sector A9, and leave
// the game clock at that moment will get saved into the temp file associated with it.  The next time you
// enter A9, this value will contain that time.  Used for scheduling purposes.
extern UINT32 guiTimeCurrentSectorWasLastLoaded;

// is the current pause state due to the player?
extern BOOLEAN gfPauseDueToPlayerGamePause;

// we've just clued up a pause by the player, the tactical screen will need a full one shot refresh to remove a 2 frame update problem
extern BOOLEAN gfJustFinishedAPause;

extern BOOLEAN gfResetAllPlayerKnowsEnemiesFlags;

extern UINT32 guiLockPauseStateLastReasonId;

extern BOOLEAN gfTimeInterrupt;
