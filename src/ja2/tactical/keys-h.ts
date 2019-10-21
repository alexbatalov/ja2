interface KEY {
  usItem: UINT16; // index in item table for key
  fFlags: UINT8; // flags...
  usSectorFound: UINT16; // where and
  usDateFound: UINT16; // when the key was found
}

const KEY_USED = 0x01;

const LOCK_UNOPENABLE = 255;
const NO_KEY = 255;

const MAX_KEYS_PER_LOCK = 4;

const LOCK_REGULAR = 1;
const LOCK_PADLOCK = 2;
const LOCK_CARD = 3;
const LOCK_ELECTRONIC = 4;
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
interface LOCK {
  ubEditorName: UINT8[] /* [MAXLOCKDESCLENGTH] */; // name to display in editor
  usKeyItem: UINT16; // key for this door uses which graphic (item #)?
  ubLockType: UINT8; // regular, padlock, electronic, etc
  ubPickDifficulty: UINT8; // difficulty to pick such a lock
  ubSmashDifficulty: UINT8; // difficulty to smash such a lock
  ubFiller: UINT8;
}

// Defines below for the perceived value of the door
const DOOR_PERCEIVED_UNKNOWN = 0;
const DOOR_PERCEIVED_LOCKED = 1;
const DOOR_PERCEIVED_UNLOCKED = 2;
const DOOR_PERCEIVED_BROKEN = 3;

const DOOR_PERCEIVED_TRAPPED = 1;
const DOOR_PERCEIVED_UNTRAPPED = 2;

interface DOOR {
  sGridNo: INT16;
  fLocked: BOOLEAN; // is the door locked
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

const enum Enum227 {
  NO_TRAP = 0,
  EXPLOSION,
  ELECTRIC,
  SIREN,
  SILENT_ALARM,
  BROTHEL_SIREN,
  SUPER_ELECTRIC,
  NUM_DOOR_TRAPS,
}

const DOOR_TRAP_STOPS_ACTION = 0x01;
const DOOR_TRAP_RECURRING = 0x02;
const DOOR_TRAP_SILENT = 0x04;

interface DOORTRAP {
  fFlags: UINT8; // stops action?  recurring trap?
}

// The status of the door, either open or closed
const DOOR_OPEN = 0x01;
const DOOR_PERCEIVED_OPEN = 0x02;
const DOOR_PERCEIVED_NOTSET = 0x04;
const DOOR_BUSY = 0x08;
const DOOR_HAS_TIN_CAN = 0x10;

const DONTSETDOORSTATUS = 2;

interface DOOR_STATUS {
  sGridNo: INT16;
  ubFlags: UINT8;
}

// This is the number of different types of doors we can have
// in one map at a time...

const NUM_KEYS = 64;
const NUM_LOCKS = 64;
const INVALID_KEY_NUMBER = 255;

const ANYKEY = 252;
const AUTOUNLOCK = 253;
const OPENING_NOT_POSSIBLE = 254;

extern KEY KeyTable[NUM_KEYS];
extern LOCK LockTable[NUM_LOCKS];
extern DOORTRAP DoorTrapTable[NUM_DOOR_TRAPS];

extern STR16 sKeyDescriptionStrings[];
/**********************************
 * Door utils add by Kris Morness *
 **********************************/

// Dynamic array of Doors.  For general game purposes, the doors that are locked and/or trapped
// are permanently saved within the map, and are loaded and allocated when the map is loaded.  Because
// the editor allows more doors to be added, or removed, the actual size of the DoorTable may change.
extern DOOR *DoorTable;

// Current number of doors in world.
extern UINT8 gubNumDoors;
// Current max number of doors.  This is only used by the editor.  When adding doors to the
// world, we may run out of space in the DoorTable, so we will allocate a new array with extra slots,
// then copy everything over again.  gubMaxDoors holds the arrays actual number of slots, even though
// the current number (gubNumDoors) will be <= to it.
extern UINT8 gubMaxDoors;
// File I/O for loading the door information from the map.  This automatically allocates
// the exact number of slots when loading.
