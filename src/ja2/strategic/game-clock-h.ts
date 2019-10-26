namespace ja2 {

// where the time string itself is rendered
export const CLOCK_X = 554;
export const CLOCK_Y = 459;

// the mouse region around the clock (bigger)
export const CLOCK_REGION_START_X = 552;
export const CLOCK_REGION_START_Y = 456;
export const CLOCK_REGION_WIDTH = (620 - CLOCK_REGION_START_X);
export const CLOCK_REGION_HEIGHT = (468 - CLOCK_REGION_START_Y);

export const NUM_SEC_IN_DAY = 86400;
export const NUM_SEC_IN_HOUR = 3600;
export const NUM_SEC_IN_MIN = 60;
const ROUNDTO_MIN = 5;

export const NUM_MIN_IN_DAY = 1440;
export const NUM_MIN_IN_HOUR = 60;

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
export const enum Enum130 {
  NOT_USING_TIME_COMPRESSION = -1,
  TIME_COMPRESS_X0,
  TIME_COMPRESS_X1,
  TIME_COMPRESS_5MINS,
  TIME_COMPRESS_30MINS,
  TIME_COMPRESS_60MINS,
  TIME_SUPER_COMPRESS,
  NUM_TIME_COMPRESS_SPEEDS,
}

export const STARTING_TIME = ((1 * NUM_SEC_IN_HOUR) + (0 * NUM_SEC_IN_MIN) + NUM_SEC_IN_DAY); // 1am
export const FIRST_ARRIVAL_DELAY = ((6 * NUM_SEC_IN_HOUR) + (0 * NUM_SEC_IN_MIN)); // 7am ( 6hours later)

export const WORLDTIMESTR = () => gswzWorldTimeStr;

export const enum Enum131 {
  WARPTIME_NO_PROCESSING_OF_EVENTS,
  WARPTIME_PROCESS_EVENTS_NORMALLY,
  WARPTIME_PROCESS_TARGET_TIME_FIRST,
}

}
