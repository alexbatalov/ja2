namespace ja2 {

export interface KEY {
  usItem: UINT16; // index in item table for key
  fFlags: UINT8; // flags...
  usSectorFound: UINT16; // where and
  usDateFound: UINT16; // when the key was found
}

export function createKeyFrom(usItem: UINT16, fFlags: UINT8, usSectorFound: UINT16, usDateFound: UINT16): KEY {
  return {
    usItem,
    fFlags,
    usSectorFound,
    usDateFound,
  };
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

export const DONTSETDOORSTATUS = 2;

export interface DOOR_STATUS {
  sGridNo: INT16;
  ubFlags: UINT8;
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
