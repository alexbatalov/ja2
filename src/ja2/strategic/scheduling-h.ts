namespace ja2 {

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
  next: SCHEDULENODE | null /* Pointer<SCHEDULENODE> */;
  usTime: UINT16[] /* [MAX_SCHEDULE_ACTIONS] */; // converted to minutes 12:30PM would be 12*60 + 30 = 750
  usData1: UINT16[] /* [MAX_SCHEDULE_ACTIONS] */; // typically the gridno, but depends on the action
  usData2: UINT16[] /* [MAX_SCHEDULE_ACTIONS] */; // secondary information, not used by most actions
  ubAction: UINT8[] /* [MAX_SCHEDULE_ACTIONS] */;
  ubScheduleID: UINT8;
  ubSoldierID: UINT8;
  usFlags: UINT16;
}

export function createScheduleNode(): SCHEDULENODE {
  return {
    next: null,
    usTime: createArray(MAX_SCHEDULE_ACTIONS, 0),
    usData1: createArray(MAX_SCHEDULE_ACTIONS, 0),
    usData2: createArray(MAX_SCHEDULE_ACTIONS, 0),
    ubAction: createArray(MAX_SCHEDULE_ACTIONS, 0),
    ubScheduleID: 0,
    ubSoldierID: 0,
    usFlags: 0,
  };
}

export function copyScheduleNode(destination: SCHEDULENODE, source: SCHEDULENODE) {
  destination.next = source.next;
  copyArray(destination.usTime, source.usTime);
  copyArray(destination.usData1, source.usData1);
  copyArray(destination.usData2, source.usData2);
  copyArray(destination.ubAction, source.ubAction);
  destination.ubScheduleID = source.ubScheduleID;
  destination.ubSoldierID = source.ubSoldierID;
  destination.usFlags = source.usFlags;
}

export const SCHEDULE_NODE_SIZE = 36;

export function readScheduleNode(o: SCHEDULENODE, buffer: Buffer, offset: number = 0): number {
  o.next = null; offset += 4; // pointer
  offset = readUIntArray(o.usTime, buffer, offset, 2);
  offset = readUIntArray(o.usData1, buffer, offset, 2);
  offset = readUIntArray(o.usData2, buffer, offset, 2);
  offset = readUIntArray(o.ubAction, buffer, offset, 1);
  o.ubScheduleID = buffer.readUInt8(offset++);
  o.ubSoldierID = buffer.readUInt8(offset++);
  o.usFlags = buffer.readUInt16LE(offset); offset+= 2;
  return offset;
}

export function writeScheduleNode(o: SCHEDULENODE, buffer: Buffer, offset: number = 0): number {
  offset = writePadding(buffer, offset, 4); // pointer
  offset = writeUIntArray(o.usTime, buffer, offset, 2);
  offset = writeUIntArray(o.usData1, buffer, offset, 2);
  offset = writeUIntArray(o.usData2, buffer, offset, 2);
  offset = writeUIntArray(o.ubAction, buffer, offset, 1);
  offset = buffer.writeUInt8(o.ubScheduleID, offset);
  offset = buffer.writeUInt8(o.ubSoldierID, offset);
  offset = buffer.writeUInt16LE(o.usFlags, offset);
  return offset;
}

}
