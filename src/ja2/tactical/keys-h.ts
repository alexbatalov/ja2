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

extern BOOLEAN AddKeysToKeyRing(SOLDIERTYPE *pSoldier, UINT8 ubKeyID, UINT8 ubNumber);
extern BOOLEAN RemoveKeyFromKeyRing(SOLDIERTYPE *pSoldier, UINT8 ubPos, OBJECTTYPE *pObj);
extern BOOLEAN RemoveAllOfKeyFromKeyRing(SOLDIERTYPE *pSoldier, UINT8 ubPos, OBJECTTYPE *pObj);
extern BOOLEAN KeyExistsInInventory(SOLDIERTYPE *pSoldier, UINT8 ubKeyID);
extern BOOLEAN KeyExistsInKeyRing(SOLDIERTYPE *pSoldier, UINT8 ubKeyID, UINT8 *pubPos);
extern BOOLEAN SoldierHasKey(SOLDIERTYPE *pSoldier, UINT8 ubKeyID);

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

extern void LoadDoorTableFromMap(INT8 **hBuffer);
// Saves the existing door information to the map.  Before it actually saves, it'll verify that the
// door still exists.  Otherwise, it'll ignore it.  It is possible in the editor to delete doors in
// many different ways, so I opted to put it in the saving routine.
extern void SaveDoorTableToMap(HWFILE fp);
// The editor adds locks to the world.  If the gridno already exists, then the currently existing door
// information is overwritten.
extern void AddDoorInfoToTable(DOOR *pDoor);
// When the editor removes a door from the world, this function looks for and removes accompanying door
// information.  If the entry is not the last entry, the last entry is move to it's current slot, to keep
// everything contiguous.
extern void RemoveDoorInfoFromTable(INT32 iMapIndex);
// This is the link to see if a door exists at a gridno.
DOOR *FindDoorInfoAtGridNo(INT32 iMapIndex);
// Upon world deallocation, the door table needs to be deallocated.
extern void TrashDoorTable();

BOOLEAN AttemptToUnlockDoor(SOLDIERTYPE *pSoldier, DOOR *pDoor);
BOOLEAN AttemptToLockDoor(SOLDIERTYPE *pSoldier, DOOR *pDoor);
BOOLEAN AttemptToSmashDoor(SOLDIERTYPE *pSoldier, DOOR *pDoor);
BOOLEAN AttemptToPickLock(SOLDIERTYPE *pSoldier, DOOR *pDoor);
BOOLEAN AttemptToBlowUpLock(SOLDIERTYPE *pSoldier, DOOR *pDoor);
BOOLEAN AttemptToUntrapDoor(SOLDIERTYPE *pSoldier, DOOR *pDoor);
BOOLEAN ExamineDoorForTraps(SOLDIERTYPE *pSoldier, DOOR *pDoor);
BOOLEAN HasDoorTrapGoneOff(SOLDIERTYPE *pSoldier, DOOR *pDoor);
void HandleDoorTrap(SOLDIERTYPE *pSoldier, DOOR *pDoor);

// Updates the perceived value to the user of the state of the door
void UpdateDoorPerceivedValue(DOOR *pDoor);

// Saves the Door Table array to the temp file
BOOLEAN SaveDoorTableToDoorTableTempFile(INT16 sSectorX, INT16 sSectorY, INT8 bSectorZ);

// Load the door table from the temp file
BOOLEAN LoadDoorTableFromDoorTableTempFile();

//	Adds a door to the Door status array.  As the user comes across the door, they are added.
//  if the door already exists, nothing happens
// fOpen is True if the door is to be initially open, false if it is closed
// fInitiallyPercieveOpen is true if the door is to be initially open, else false
BOOLEAN ModifyDoorStatus(INT16 sGridNo, BOOLEAN fOpen, BOOLEAN fInitiallyPercieveOpen);

// Deletes the door status array
void TrashDoorStatusArray();

// Returns true if the door is open, otherwise false
BOOLEAN IsDoorOpen(INT16 sGridNo);

// Returns true if the door is perceioved as open
BOOLEAN IsDoorPerceivedOpen(INT16 sGridNo);

// Saves the Door Status array to the MapTempfile
BOOLEAN SaveDoorStatusArrayToDoorStatusTempFile(INT16 sSectorX, INT16 sSectorY, INT8 bSectorZ);

// Load the door status from the door status temp file
BOOLEAN LoadDoorStatusArrayFromDoorStatusTempFile();

// Modify the Doors open status
BOOLEAN SetDoorOpenStatus(INT16 sGridNo, BOOLEAN fOpen);

// Modify the doors perceived open status
BOOLEAN SetDoorPerceivedOpenStatus(INT16 sGridNo, BOOLEAN fPerceivedOpen);

// Save the key table to the saved game file
BOOLEAN SaveKeyTableToSaveGameFile(HWFILE hFile);

// Load the key table from the saved game file
BOOLEAN LoadKeyTableFromSaveedGameFile(HWFILE hFile);

// Returns a doors status value, NULL if not found
DOOR_STATUS *GetDoorStatus(INT16 sGridNo);

BOOLEAN UpdateDoorStatusPerceivedValue(INT16 sGridNo);

BOOLEAN AllMercsLookForDoor(INT16 sGridNo, BOOLEAN fUpdateValue);

BOOLEAN MercLooksForDoors(SOLDIERTYPE *pSoldier, BOOLEAN fUpdateValue);

void UpdateDoorGraphicsFromStatus(BOOLEAN fUsePerceivedStatus, BOOLEAN fDirty);

BOOLEAN AttemptToCrowbarLock(SOLDIERTYPE *pSoldier, DOOR *pDoor);

BOOLEAN LoadLockTable(void);

void ExamineDoorsOnEnteringSector();

void HandleDoorsChangeWhenEnteringSectorCurrentlyLoaded();

void AttachStringToDoor(INT16 sGridNo);

void DropKeysInKeyRing(SOLDIERTYPE *pSoldier, INT16 sGridNo, INT8 bLevel, INT8 bVisible, BOOLEAN fAddToDropList, INT32 iDropListSlot, BOOLEAN fUseUnLoaded);
