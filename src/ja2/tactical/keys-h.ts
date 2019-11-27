namespace ja2 {

export interface KEY {
  usItem: UINT16; // index in item table for key
  fFlags: UINT8; // flags...
  usSectorFound: UINT16; // where and
  usDateFound: UINT16; // when the key was found
}

export function createKey(): KEY {
  return {
    usItem: 0,
    fFlags: 0,
    usSectorFound: 0,
    usDateFound: 0,
  };
}

export function createKeyFrom(usItem: UINT16, fFlags: UINT8, usSectorFound: UINT16, usDateFound: UINT16): KEY {
  return {
    usItem,
    fFlags,
    usSectorFound,
    usDateFound,
  };
}

export const KEY_SIZE = 8;

export function readKey(o: KEY, buffer: Buffer, offset: number = 0): number {
  o.usItem = buffer.readUInt16LE(offset); offset += 2;
  o.fFlags = buffer.readUInt8(offset++);
  offset++; // padding
  o.usSectorFound = buffer.readUInt16LE(offset); offset += 2;
  o.usDateFound = buffer.readUInt16LE(offset); offset += 2;
  return offset;
}

export function writeKey(o: KEY, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt16LE(o.usItem, offset);
  offset = buffer.writeUInt8(o.fFlags, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt16LE(o.usSectorFound, offset);
  offset = buffer.writeUInt16LE(o.usDateFound, offset);
  return offset;
}

const KEY_USED = 0x01;

export const LOCK_UNOPENABLE = 255;
const NO_KEY = 255;

export const MAX_KEYS_PER_LOCK = 4;

const LOCK_REGULAR = 1;
const LOCK_PADLOCK = 2;
export const LOCK_CARD = 3;
export const LOCK_ELECTRONIC = 4;
const LOCK_SPECIAL = 5;

/*
typedef struct
{
        UINT8		ubKeyID[MAX_KEYS_PER_LOCK];
        UINT8		ubLockType;							// numeric lock type value... easier to use than flags!
        INT8		bPickSkillAdjustment;		// difficulty to pick a lock which takes this key
        INT8		bSmashSkillAdjustment;	// the strength of the lock (resistance to smashing)
} LOCK;
*/

const MAXLOCKDESCLENGTH = 40;
export interface LOCK {
  ubEditorName: string /* UINT8[MAXLOCKDESCLENGTH] */; // name to display in editor
  usKeyItem: UINT16; // key for this door uses which graphic (item #)?
  ubLockType: UINT8; // regular, padlock, electronic, etc
  ubPickDifficulty: UINT8; // difficulty to pick such a lock
  ubSmashDifficulty: UINT8; // difficulty to smash such a lock
  ubFiller: UINT8;
}

export function createLock(): LOCK {
  return {
    ubEditorName: '',
    usKeyItem: 0,
    ubLockType: 0,
    ubPickDifficulty: 0,
    ubSmashDifficulty: 0,
    ubFiller: 0,
  };
}

export const LOCK_SIZE = 46;

export function readLock(o: LOCK, buffer: Buffer, offset: number = 0): number {
  o.ubEditorName = readStringNL(buffer, 'ascii', offset, offset + MAXLOCKDESCLENGTH); offset += MAXLOCKDESCLENGTH;
  o.usKeyItem = buffer.readUInt16LE(offset); offset += 2;
  o.ubLockType = buffer.readUInt8(offset++);
  o.ubPickDifficulty = buffer.readUInt8(offset++);
  o.ubSmashDifficulty = buffer.readUInt8(offset++);
  o.ubFiller = buffer.readUInt8(offset++);
  return offset;
}

export function writeLock(o: LOCK, buffer: Buffer, offset: number = 0): number {
  offset = writeStringNL(o.ubEditorName, buffer, offset, MAXLOCKDESCLENGTH, 'ascii');
  offset = buffer.writeUInt16LE(o.usKeyItem, offset);
  offset = buffer.writeUInt8(o.ubLockType, offset);
  offset = buffer.writeUInt8(o.ubPickDifficulty, offset);
  offset = buffer.writeUInt8(o.ubSmashDifficulty, offset);
  offset = buffer.writeUInt8(o.ubFiller, offset);
  return offset;
}

// Defines below for the perceived value of the door
export const DOOR_PERCEIVED_UNKNOWN = 0;
export const DOOR_PERCEIVED_LOCKED = 1;
export const DOOR_PERCEIVED_UNLOCKED = 2;
export const DOOR_PERCEIVED_BROKEN = 3;

export const DOOR_PERCEIVED_TRAPPED = 1;
export const DOOR_PERCEIVED_UNTRAPPED = 2;

export interface DOOR {
  sGridNo: INT16;
  fLocked: boolean; // is the door locked
  ubTrapLevel: UINT8; // difficulty of finding the trap, 0-10
  ubTrapID: UINT8; // the trap type (0 is no trap)
  ubLockID: UINT8; // the lock (0 is no lock)
  bPerceivedLocked: INT8; // The perceived lock value can be different than the fLocked.
                          // Values for this include the fact that we don't know the status of
                          // the door, etc
  bPerceivedTrapped: INT8; // See above, but with respect to traps rather than locked status
  bLockDamage: INT8; // Damage to the lock
  bPadding: INT8[] /* [4] */; // extra bytes
}

export function createDoor(): DOOR {
  return {
    sGridNo: 0,
    fLocked: false,
    ubTrapLevel: 0,
    ubTrapID: 0,
    ubLockID: 0,
    bPerceivedLocked: 0,
    bPerceivedTrapped: 0,
    bLockDamage: 0,
    bPadding: createArray(4, 0),
  };
}

export function copyDoor(destination: DOOR, source: DOOR) {
  destination.sGridNo = source.sGridNo;
  destination.fLocked = source.fLocked;
  destination.ubTrapLevel = source.ubTrapLevel;
  destination.ubTrapID = source.ubTrapID;
  destination.ubLockID = source.ubLockID;
  destination.bPerceivedLocked = source.bPerceivedLocked;
  destination.bPerceivedTrapped = source.bPerceivedTrapped;
  destination.bLockDamage = source.bLockDamage;
  copyArray(destination.bPadding, source.bPadding);
}

export const DOOR_SIZE = 14;

export function readDoor(o: DOOR, buffer: Buffer, offset: number = 0): number {
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.fLocked = Boolean(buffer.readUInt8(offset++));
  o.ubTrapLevel = buffer.readUInt8(offset++);
  o.ubTrapID = buffer.readUInt8(offset++);
  o.ubLockID = buffer.readUInt8(offset++);
  o.bPerceivedLocked = buffer.readInt8(offset++);
  o.bPerceivedTrapped = buffer.readInt8(offset++);
  o.bLockDamage = buffer.readInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);
  offset++; // padding
  return offset;
}

export function writeDoor(o: DOOR, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeUInt8(Number(o.fLocked), offset);
  offset = buffer.writeUInt8(o.ubTrapLevel, offset);
  offset = buffer.writeUInt8(o.ubTrapID, offset);
  offset = buffer.writeUInt8(o.ubLockID, offset);
  offset = buffer.writeInt8(o.bPerceivedLocked, offset);
  offset = buffer.writeInt8(o.bPerceivedTrapped, offset);
  offset = buffer.writeInt8(o.bLockDamage, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);
  offset = writePadding(buffer, offset, 1); // padding
  return offset;
}

export const enum Enum227 {
  NO_TRAP = 0,
  EXPLOSION,
  ELECTRIC,
  SIREN,
  SILENT_ALARM,
  BROTHEL_SIREN,
  SUPER_ELECTRIC,
  NUM_DOOR_TRAPS,
}

export const DOOR_TRAP_STOPS_ACTION = 0x01;
export const DOOR_TRAP_RECURRING = 0x02;
export const DOOR_TRAP_SILENT = 0x04;

export interface DOORTRAP {
  fFlags: UINT8; // stops action?  recurring trap?
}

export function createDoorTrapFrom(fFlags: UINT8): DOORTRAP {
  return {
    fFlags,
  };
}

// The status of the door, either open or closed
export const DOOR_OPEN = 0x01;
export const DOOR_PERCEIVED_OPEN = 0x02;
export const DOOR_PERCEIVED_NOTSET = 0x04;
export const DOOR_BUSY = 0x08;
export const DOOR_HAS_TIN_CAN = 0x10;

export const DONTSETDOORSTATUS = undefined;

export interface DOOR_STATUS {
  sGridNo: INT16;
  ubFlags: UINT8;
}

export function createDoorStatus(): DOOR_STATUS {
  return {
    sGridNo: 0,
    ubFlags: 0,
  };
}

export const DOOR_STATUS_SIZE = 4;

export function readDoorStatus(o: DOOR_STATUS, buffer: Buffer, offset: number = 0): number {
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubFlags = buffer.readUInt8(offset++);
  offset++; // padding
  return offset;
}

export function writeDoorStatus(o: DOOR_STATUS, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeUInt8(o.ubFlags, offset);
  offset = writePadding(buffer, offset, 1); // padding
  return offset;
}

// This is the number of different types of doors we can have
// in one map at a time...

export const NUM_KEYS = 64;
export const NUM_LOCKS = 64;
export const INVALID_KEY_NUMBER = 255;

export const ANYKEY = 252;
const AUTOUNLOCK = 253;
export const OPENING_NOT_POSSIBLE = 254;

/**********************************
 * Door utils add by Kris Morness *
 **********************************/

// File I/O for loading the door information from the map.  This automatically allocates
// the exact number of slots when loading.

}
