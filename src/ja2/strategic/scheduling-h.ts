// Merc scheduling actions
// NOTE:  Any modifications to this enumeration also require updating the text in EditorMercs.c used
//			 in the editor for merc schedule purposes.
export const enum Enum171 {
  SCHEDULE_ACTION_NONE,
  SCHEDULE_ACTION_LOCKDOOR,
  SCHEDULE_ACTION_UNLOCKDOOR,
  SCHEDULE_ACTION_OPENDOOR,
  SCHEDULE_ACTION_CLOSEDOOR,
  SCHEDULE_ACTION_GRIDNO,
  SCHEDULE_ACTION_LEAVESECTOR,
  SCHEDULE_ACTION_ENTERSECTOR,
  SCHEDULE_ACTION_STAYINSECTOR,
  SCHEDULE_ACTION_SLEEP,
  SCHEDULE_ACTION_WAKE,
  NUM_SCHEDULE_ACTIONS,
}

export const SCHEDULE_FLAGS_VARIANCE1 = 0x0001;
export const SCHEDULE_FLAGS_VARIANCE2 = 0x0002;
export const SCHEDULE_FLAGS_VARIANCE3 = 0x0004;
export const SCHEDULE_FLAGS_VARIANCE4 = 0x0008;
export const SCHEDULE_FLAGS_ACTIVE1 = 0x0010;
export const SCHEDULE_FLAGS_ACTIVE2 = 0x0020;
export const SCHEDULE_FLAGS_ACTIVE3 = 0x0040;
export const SCHEDULE_FLAGS_ACTIVE4 = 0x0080;
export const SCHEDULE_FLAGS_TEMPORARY = 0x0100; // for default schedules -- not saved.
export const SCHEDULE_FLAGS_SLEEP_CONVERTED = 0x0200; // converted (needs to be uncoverted before saving)
const SCHEDULE_FLAGS_NPC_SLEEPING = 0x0400; // if processing a sleep command, this flag will be set.

// combo flag for turning active flags off
export const SCHEDULE_FLAGS_ACTIVE_ALL = 0x00F0;

export const MAX_SCHEDULE_ACTIONS = 4;

export interface SCHEDULENODE {
  next: Pointer<SCHEDULENODE>;
  usTime: UINT16[] /* [MAX_SCHEDULE_ACTIONS] */; // converted to minutes 12:30PM would be 12*60 + 30 = 750
  usData1: UINT16[] /* [MAX_SCHEDULE_ACTIONS] */; // typically the gridno, but depends on the action
  usData2: UINT16[] /* [MAX_SCHEDULE_ACTIONS] */; // secondary information, not used by most actions
  ubAction: UINT8[] /* [MAX_SCHEDULE_ACTIONS] */;
  ubScheduleID: UINT8;
  ubSoldierID: UINT8;
  usFlags: UINT16;
}
