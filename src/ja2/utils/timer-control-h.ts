namespace ja2 {

export type TIMECOUNTER = INT32;

// typedef void (__stdcall *JA2_TIMERPROC)( UINT32 uiID, UINT32 uiMsg, UINT32 uiUser, UINT32 uiDw1, UINT32 uiDw2 );

export type CUSTOMIZABLE_TIMER_CALLBACK = () => void;

// CALLBACK TIMER DEFINES
export const enum Enum385 {
  ITEM_LOCATOR_CALLBACK,
  NUM_TIMER_CALLBACKS,
}

// TIMER DEFINES
export const enum Enum386 {
  TOVERHEAD = 0, // Overhead time slice
  NEXTSCROLL, // Scroll Speed timer
  STARTSCROLL, // Scroll Start timer
  ANIMATETILES, // Animate tiles timer
  FPSCOUNTER, // FPS value
  PATHFINDCOUNTER, // PATH FIND COUNTER
  CURSORCOUNTER, // ANIMATED CURSOR
  RMOUSECLICK_DELAY_COUNTER, // RIGHT BUTTON CLICK DELAY
  LMOUSECLICK_DELAY_COUNTER, // LEFT	 BUTTON CLICK DELAY
  SLIDETEXT, // DAMAGE DISPLAY
  TARGETREFINE, // TARGET REFINE
  CURSORFLASH, // Cursor/AP flash
  FADE_GUY_OUT, // FADE MERCS OUT
  PANELSLIDE_UNUSED, // PANLE SLIDE
  TCLOCKUPDATE, // CLOCK UPDATE
  PHYSICSUPDATE, // PHYSICS UPDATE.
  GLOW_ENEMYS,
  STRATEGIC_OVERHEAD, // STRATEGIC OVERHEAD
  CYCLERENDERITEMCOLOR, // CYCLE COLORS
  NONGUNTARGETREFINE, // TARGET REFINE
  CURSORFLASHUPDATE, //
  INVALID_AP_HOLD, // TIME TO HOLD INVALID AP
  RADAR_MAP_BLINK, // BLINK DELAY FOR RADAR MAP
  OVERHEAD_MAP_BLINK, // OVERHEADMAP
  MUSICOVERHEAD, // MUSIC TIMER
  RUBBER_BAND_START_DELAY,
  NUMTIMERS,
}

// Base resultion of callback timer
export const BASETIMESLICE = 10;

export const GetJA2Clock = () => guiBaseJA2Clock;

// MACROS
//																CHeck if new counter < 0														 | set to 0 |										 Decrement

export const UPDATECOUNTER = (c) => ((giTimerCounters[c] - BASETIMESLICE) < 0) ? (giTimerCounters[c] = 0) : (giTimerCounters[c] -= BASETIMESLICE);
export const RESETCOUNTER = (c) => (giTimerCounters[c] = giTimerIntervals[c]);
export const COUNTERDONE = (c) => (giTimerCounters[c] == 0) ? true : false;

export const UPDATETIMECOUNTER = (c) => ((c - BASETIMESLICE) < 0) ? (c = 0) : (c -= BASETIMESLICE);
export const RESETTIMECOUNTER = (c, d) => (c = d);

export const TIMECOUNTERDONE = (c, d) => (c == 0) ? true : false;

export const SYNCTIMECOUNTER = () => {};
export const ZEROTIMECOUNTER = (c) => (c = 0);

}
