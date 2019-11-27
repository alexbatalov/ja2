namespace ja2 {

let gpDoorStatus: DOOR_STATUS[] /* Pointer<DOOR_STATUS> */ = <DOOR_STATUS[]><unknown>null;
let gubNumDoorStatus: UINT8 = 0;

export let KeyTable: KEY[] /* [NUM_KEYS] */ = [
  // Item #			Flags		Sector, Date Found
  //
  createKeyFrom(Enum225.KEY_1, 0, 0, 0),
  createKeyFrom(Enum225.KEY_2, 0, 0, 0),
  createKeyFrom(Enum225.KEY_3, 0, 0, 0),
  createKeyFrom(Enum225.KEY_4, 0, 0, 0),
  createKeyFrom(Enum225.KEY_5, 0, 0, 0),
  createKeyFrom(Enum225.KEY_6, 0, 0, 0),
  createKeyFrom(Enum225.KEY_7, 0, 0, 0),
  createKeyFrom(Enum225.KEY_8, 0, 0, 0),
  createKeyFrom(Enum225.KEY_9, 0, 0, 0),
  createKeyFrom(Enum225.KEY_10, 0, 0, 0),

  createKeyFrom(Enum225.KEY_11, 0, 0, 0),
  createKeyFrom(Enum225.KEY_12, 0, 0, 0),
  createKeyFrom(Enum225.KEY_13, 0, 0, 0),
  createKeyFrom(Enum225.KEY_14, 0, 0, 0),
  createKeyFrom(Enum225.KEY_15, 0, 0, 0),
  createKeyFrom(Enum225.KEY_16, 0, 0, 0),
  createKeyFrom(Enum225.KEY_17, 0, 0, 0),
  createKeyFrom(Enum225.KEY_18, 0, 0, 0),
  createKeyFrom(Enum225.KEY_19, 0, 0, 0),
  createKeyFrom(Enum225.KEY_20, 0, 0, 0),

  createKeyFrom(Enum225.KEY_21, 0, 0, 0),
  createKeyFrom(Enum225.KEY_22, 0, 0, 0),
  createKeyFrom(Enum225.KEY_23, 0, 0, 0),
  createKeyFrom(Enum225.KEY_24, 0, 0, 0),
  createKeyFrom(Enum225.KEY_25, 0, 0, 0),
  createKeyFrom(Enum225.KEY_26, 0, 0, 0),
  createKeyFrom(Enum225.KEY_27, 0, 0, 0),
  createKeyFrom(Enum225.KEY_28, 0, 0, 0),
  createKeyFrom(Enum225.KEY_29, 0, 0, 0),
  createKeyFrom(Enum225.KEY_30, 0, 0, 0),

  createKeyFrom(Enum225.KEY_31, 0, 0, 0),
  createKeyFrom(Enum225.KEY_32, 0, 0, 0),
];

KeyTable = KeyTable.concat(createArrayFrom(NUM_KEYS - KeyTable.length, createKey));

// Current number of doors in world.
export let gubNumDoors: UINT8 = 0;

// Current max number of doors.  This is only used by the editor.  When adding doors to the
// world, we may run out of space in the DoorTable, so we will allocate a new array with extra slots,
// then copy everything over again.  gubMaxDoors holds the arrays actual number of slots, even though
// the current number (gubNumDoors) will be <= to it.
let gubMaxDoors: UINT8 = 0;

export let LockTable: LOCK[] /* [NUM_LOCKS] */ = createArrayFrom(NUM_LOCKS, createLock);

/*
LOCK LockTable[NUM_LOCKS] =
{
        // Keys that will open the lock				Lock type			Pick diff			Smash diff
        { { NO_KEY, NO_KEY, NO_KEY, NO_KEY},	LOCK_REGULAR,					0,						0},
        { { 0,			NO_KEY, NO_KEY, NO_KEY},	LOCK_REGULAR,				-25,					-25},
        { { 1,			NO_KEY, NO_KEY, NO_KEY},	LOCK_REGULAR,				-60,					-55},
        { { 2,			NO_KEY, NO_KEY, NO_KEY},	LOCK_REGULAR,				-75,					-80},
        { { 3,			NO_KEY, NO_KEY, NO_KEY},	LOCK_REGULAR,				-35,					-45},
        { { 4,			NO_KEY, NO_KEY, NO_KEY},	LOCK_REGULAR,				-45,					-60},
        { { 5,			NO_KEY, NO_KEY, NO_KEY},	LOCK_REGULAR,				-65,					-90},
        { { 6,			NO_KEY, NO_KEY, NO_KEY},	LOCK_PADLOCK,				-60,					-70},
        { { 7,			NO_KEY, NO_KEY, NO_KEY},	LOCK_ELECTRONIC,		-50,					-60},
        { { 8,			NO_KEY, NO_KEY, NO_KEY},	LOCK_ELECTRONIC,		-75,					-80},
        { { 9,			NO_KEY, NO_KEY, NO_KEY},	LOCK_CARD,					-50,					-40},
        { { 10,			NO_KEY, NO_KEY, NO_KEY},	LOCK_CARD,					-85,					-80},
        { { 11,			NO_KEY, NO_KEY, NO_KEY},	LOCK_REGULAR,				-50,					-50}
};
*/

export let DoorTrapTable: DOORTRAP[] /* [NUM_DOOR_TRAPS] */ = [
  createDoorTrapFrom(0), // nothing
  createDoorTrapFrom(DOOR_TRAP_STOPS_ACTION), // explosion
  createDoorTrapFrom(DOOR_TRAP_STOPS_ACTION | DOOR_TRAP_RECURRING), // electric
  createDoorTrapFrom(DOOR_TRAP_RECURRING), // siren
  createDoorTrapFrom(DOOR_TRAP_RECURRING | DOOR_TRAP_SILENT), // silent alarm
  createDoorTrapFrom(DOOR_TRAP_RECURRING), // brothel siren
  createDoorTrapFrom(DOOR_TRAP_STOPS_ACTION | DOOR_TRAP_RECURRING), // super electric
];

// Dynamic array of Doors.  For general game purposes, the doors that are locked and/or trapped
// are permanently saved within the map, and are loaded and allocated when the map is loaded.  Because
// the editor allows more doors to be added, or removed, the actual size of the DoorTable may change.
export let DoorTable: DOOR[] /* Pointer<DOOR> */ = <DOOR[]><unknown>null;

export function LoadLockTable(): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let uiBytesToRead: UINT32;
  let pFileName: string /* Pointer<CHAR8> */ = "BINARYDATA\\Locks.bin";
  let hFile: HWFILE;
  let buffer: Buffer;

  // Load the Lock Table

  hFile = FileOpen(pFileName, FILE_ACCESS_READ, false);
  if (!hFile) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("FAILED to LoadLockTable from file %s", pFileName));
    return false;
  }

  uiBytesToRead = LOCK_SIZE * NUM_LOCKS;
  buffer = Buffer.allocUnsafe(uiBytesToRead);
  uiNumBytesRead = FileRead(hFile, buffer, uiBytesToRead);

  FileClose(hFile);

  if (uiNumBytesRead != uiBytesToRead) {
    return false;
  }

  readObjectArray(LockTable, buffer, 0, readLock);

  return true;
}

export function SoldierHasKey(pSoldier: SOLDIERTYPE, ubKeyID: UINT8): boolean {
  if (KeyExistsInKeyRing(pSoldier, ubKeyID, null) || KeyExistsInInventory(pSoldier, ubKeyID)) {
    return true;
  }

  return false;
}

export function KeyExistsInKeyRing(pSoldier: SOLDIERTYPE, ubKeyID: UINT8, pubPos: Pointer<UINT8>): boolean {
  // returns the index into the key ring where the key can be found
  let ubLoop: UINT8;

  if (!(pSoldier.pKeyRing)) {
    // no key ring!
    return false;
  }
  for (ubLoop = 0; ubLoop < NUM_KEYS; ubLoop++) {
    if (pSoldier.pKeyRing[ubLoop].ubNumber == 0) {
      continue;
    }
    if (pSoldier.pKeyRing[ubLoop].ubKeyID == ubKeyID || (ubKeyID == ANYKEY)) {
      // found it!
      if (pubPos) {
        pubPos.value = ubLoop;
      }
      return true;
    }
  }
  // exhausted key ring
  return false;
}

function KeyExistsInInventory(pSoldier: SOLDIERTYPE, ubKeyID: UINT8): boolean {
  let ubLoop: UINT8;

  for (ubLoop = 0; ubLoop < Enum261.NUM_INV_SLOTS; ubLoop++) {
    if (Item[pSoldier.inv[ubLoop].usItem].usItemClass == IC_KEY) {
      if ((pSoldier.inv[ubLoop].ubKeyID == ubKeyID) || (ubKeyID == ANYKEY)) {
        // there's the key we want!
        return true;
      }
    }
  }
  return false;
}

function ValidKey(pDoor: DOOR, ubKeyID: UINT8): boolean {
  return pDoor.ubLockID == ubKeyID;
}

function DoLockDoor(pDoor: DOOR, ubKeyID: UINT8): boolean {
  // if the door is unlocked and this is the right key, lock the door and
  // return true, otherwise return false
  if (!(pDoor.fLocked) && ValidKey(pDoor, ubKeyID)) {
    pDoor.fLocked = true;
    return true;
  } else {
    return false;
  }
}

function DoUnlockDoor(pDoor: DOOR, ubKeyID: UINT8): boolean {
  // if the door is locked and this is the right key, unlock the door and
  // return true, otherwise return false
  if ((pDoor.fLocked) && ValidKey(pDoor, ubKeyID)) {
    // Play lockpicking
    PlayJA2Sample((Enum330.UNLOCK_DOOR_1), RATE_11025, SoundVolume(MIDVOLUME, pDoor.sGridNo), 1, SoundDir(pDoor.sGridNo));

    pDoor.fLocked = false;
    return true;
  } else {
    return false;
  }
}

export function AttemptToUnlockDoor(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  let ubLoop: UINT8;
  let ubKeyID: UINT8;

  for (ubLoop = 0; ubLoop < MAX_KEYS_PER_LOCK; ubLoop++) {
    ubKeyID = pDoor.ubLockID;
    if (KeyExistsInKeyRing(pSoldier, ubKeyID, null)) {
      // unlock door and move key to front of key ring!
      DoUnlockDoor(pDoor, ubKeyID);
      return true;
    } else if (KeyExistsInInventory(pSoldier, ubKeyID)) {
      // unlock door!
      DoUnlockDoor(pDoor, ubKeyID);
      return true;
    }
  }

  // drat, couldn't find the key
  PlayJA2Sample(Enum330.KEY_FAILURE, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);

  return false;
}

export function AttemptToLockDoor(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  let ubLoop: UINT8;
  let ubKeyID: UINT8;

  for (ubLoop = 0; ubLoop < MAX_KEYS_PER_LOCK; ubLoop++) {
    ubKeyID = pDoor.ubLockID;
    if (KeyExistsInKeyRing(pSoldier, ubKeyID, null)) {
      // lock door and move key to front of key ring!
      DoLockDoor(pDoor, ubKeyID);
      return true;
    } else if (KeyExistsInInventory(pSoldier, ubKeyID)) {
      // lock door!
      DoLockDoor(pDoor, ubKeyID);
      return true;
    }
  }
  // drat, couldn't find the key
  return false;
}

export function AttemptToCrowbarLock(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  let iResult: INT32;
  let bStress: INT8;
  let bSlot: INT8;

  bSlot = FindUsableObj(pSoldier, Enum225.CROWBAR);
  if (bSlot == ITEM_NOT_FOUND) {
    // error!
    return false;
  }

  // generate a noise for thumping on the door
  MakeNoise(pSoldier.ubID, pSoldier.sGridNo, pSoldier.bLevel, gpWorldLevelData[pSoldier.sGridNo].ubTerrainID, CROWBAR_DOOR_VOLUME, Enum236.NOISE_DOOR_SMASHING);

  if (!pDoor.fLocked) {
    // auto success but no XP

    // succeeded! door can never be locked again, so remove from door list...
    RemoveDoorInfoFromTable(pDoor.sGridNo);
    // award experience points?

    // Play lock busted sound
    PlayJA2Sample((Enum330.BREAK_LOCK), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));

    return true;
  }

  if (pDoor.ubLockID == LOCK_UNOPENABLE) {
    // auto failure!
    return false;
  }

  // possibly damage crowbar
  bStress = Math.min(EffectiveStrength(pSoldier), LockTable[pDoor.ubLockID].ubSmashDifficulty + 30);
  // reduce crowbar status by random % between 0 and 5%
  DamageObj(pSoldier.inv[bSlot], PreRandom(bStress / 20));

  // did we succeed?

  if (LockTable[pDoor.ubLockID].ubSmashDifficulty == OPENING_NOT_POSSIBLE) {
    // do this to get 'can't do this' messages
    iResult = SkillCheck(pSoldier, Enum255.OPEN_WITH_CROWBAR, (-100));
    iResult = -100;
  } else {
    iResult = SkillCheck(pSoldier, Enum255.OPEN_WITH_CROWBAR, (-(LockTable[pDoor.ubLockID].ubSmashDifficulty - pDoor.bLockDamage)));
  }

  if (iResult > 0) {
    // STR GAIN (20) - Pried open a lock
    StatChange(pSoldier, STRAMT, 20, 0);

    // succeeded! door can never be locked again, so remove from door list...
    RemoveDoorInfoFromTable(pDoor.sGridNo);

    // Play lock busted sound
    PlayJA2Sample((Enum330.BREAK_LOCK), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));

    return true;
  } else {
    if (iResult > -10) {
      // STR GAIN - Damaged a lock by prying
      StatChange(pSoldier, STRAMT, 5, 0);

      // we came close... so do some damage to the lock
      pDoor.bLockDamage += (10 + iResult);
    } else if (iResult > -40 && pSoldier.sGridNo != pSoldier.sSkillCheckGridNo) {
      // give token point for effort :-)
      StatChange(pSoldier, STRAMT, 1, 0);
    }

    return false;
  }
}

export function AttemptToSmashDoor(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  let iResult: INT32;

  let pLock: LOCK;

  // generate a noise for thumping on the door
  MakeNoise(pSoldier.ubID, pSoldier.sGridNo, pSoldier.bLevel, gpWorldLevelData[pSoldier.sGridNo].ubTerrainID, SMASHING_DOOR_VOLUME, Enum236.NOISE_DOOR_SMASHING);

  if (!pDoor.fLocked) {
    // auto success but no XP

    // succeeded! door can never be locked again, so remove from door list...
    RemoveDoorInfoFromTable(pDoor.sGridNo);
    // award experience points?

    // Play lock busted sound
    PlayJA2Sample((Enum330.BREAK_LOCK), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));

    return true;
  }

  if (pDoor.ubLockID == LOCK_UNOPENABLE) {
    // auto failure!
    return false;
  }

  pLock = LockTable[pDoor.ubLockID];

  // did we succeed?
  if (pLock.ubSmashDifficulty == OPENING_NOT_POSSIBLE) {
    // do this to get 'can't do this' messages
    iResult = SkillCheck(pSoldier, Enum255.SMASH_DOOR_CHECK, (-100));
    iResult = -100;
  } else {
    iResult = SkillCheck(pSoldier, Enum255.SMASH_DOOR_CHECK, (-(LockTable[pDoor.ubLockID].ubSmashDifficulty - pDoor.bLockDamage)));
  }
  if (iResult > 0) {
    // STR GAIN (20) - Pried open a lock
    StatChange(pSoldier, STRAMT, 20, 0);

    // succeeded! door can never be locked again, so remove from door list...
    RemoveDoorInfoFromTable(pDoor.sGridNo);
    // award experience points?

    // Play lock busted sound
    PlayJA2Sample((Enum330.BREAK_LOCK), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.sGridNo), 1, SoundDir(pSoldier.sGridNo));

    return true;
  } else {
    if (iResult > -10) {
      // STR GAIN - Damaged a lock by prying
      StatChange(pSoldier, STRAMT, 5, 0);

      // we came close... so do some damage to the lock
      pDoor.bLockDamage += (10 + iResult);
    } else if (iResult > -40 && pSoldier.sGridNo != pSoldier.sSkillCheckGridNo) {
      // give token point for effort :-)
      StatChange(pSoldier, STRAMT, 1, 0);
    }
    return false;
  }
}

export function AttemptToPickLock(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  let iResult: INT32;
  let bReason: INT8;
  let pLock: LOCK;

  if (pDoor.ubLockID == LOCK_UNOPENABLE) {
    // auto failure!
    return false;
  }

  pLock = LockTable[pDoor.ubLockID];

  // look up the type of lock to see if it is electronic or not
  if (pLock.ubLockType == LOCK_CARD || pLock.ubLockType == LOCK_ELECTRONIC) {
    bReason = Enum255.ELECTRONIC_LOCKPICKING_CHECK;
  } else {
    bReason = Enum255.LOCKPICKING_CHECK;
  }

  // Play lockpicking
  // ATE: Moved to animation
  // PlayJA2Sample( ( (UINT8)PICKING_LOCK ), RATE_11025, SoundVolume( MIDVOLUME, pSoldier->sGridNo ), 1, SoundDir( pSoldier->sGridNo ) );

  // See if we measure up to the task.
  // The difficulty is negated here to make it a skill adjustment
  if (pLock.ubPickDifficulty == OPENING_NOT_POSSIBLE) {
    // do this to get 'can't do this' messages
    iResult = SkillCheck(pSoldier, bReason, (-100));
    iResult = -100;
  } else {
    iResult = SkillCheck(pSoldier, bReason, (-(pLock.ubPickDifficulty)));
  }
  if (iResult > 0) {
    // MECHANICAL GAIN:  Picked open a lock
    StatChange(pSoldier, MECHANAMT, (pLock.ubPickDifficulty / 5), 0);

    // DEXTERITY GAIN:  Picked open a lock
    StatChange(pSoldier, DEXTAMT, (pLock.ubPickDifficulty / 10), 0);

    // succeeded!
    pDoor.fLocked = false;
    return true;
  } else {
    // NOTE: failures are not rewarded, since you can keep trying indefinitely...

    // check for traps
    return false;
  }
}

export function AttemptToUntrapDoor(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  let iResult: INT32;

  // See if we measure up to the task.
  if (pDoor.ubTrapID == Enum227.EXPLOSION) {
    iResult = SkillCheck(pSoldier, Enum255.DISARM_TRAP_CHECK, (pDoor.ubTrapLevel * 7));
  } else {
    iResult = SkillCheck(pSoldier, Enum255.DISARM_ELECTRONIC_TRAP_CHECK, (pDoor.ubTrapLevel * 7));
  }

  if (iResult > 0) {
    // succeeded!
    pDoor.ubTrapLevel = 0;
    pDoor.ubTrapID = Enum227.NO_TRAP;
    return true;
  } else {
    // trap should REALLY go off now!
    return false;
  }
}

export function ExamineDoorForTraps(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  // Check to see if there is a trap or not on this door
  let bDetectLevel: INT8;

  if (pDoor.ubTrapID == Enum227.NO_TRAP) {
    // No trap!
    pDoor.bPerceivedTrapped = DOOR_PERCEIVED_UNTRAPPED;
  } else {
    if (pDoor.bPerceivedTrapped == DOOR_PERCEIVED_TRAPPED) {
      return true;
    } else {
      bDetectLevel = CalcTrapDetectLevel(pSoldier, true);
      if (bDetectLevel < pDoor.ubTrapLevel) {
        pDoor.bPerceivedTrapped = DOOR_PERCEIVED_UNTRAPPED;
      } else {
        pDoor.bPerceivedTrapped = DOOR_PERCEIVED_TRAPPED;
        return true;
      }
    }
  }
  return false;
}

export function HasDoorTrapGoneOff(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  // Check to see if the soldier causes the trap to go off
  let bDetectLevel: INT8;

  if (pDoor.ubTrapID != Enum227.NO_TRAP) {
    // one quick check to see if the guy sees the trap ahead of time!
    bDetectLevel = CalcTrapDetectLevel(pSoldier, false);
    if (bDetectLevel < pDoor.ubTrapLevel) {
      // trap goes off!
      return true;
    }
  }
  return false;
}

export function HandleDoorTrap(pSoldier: SOLDIERTYPE, pDoor: DOOR): void {
  if (!(DoorTrapTable[pDoor.ubTrapID].fFlags & DOOR_TRAP_SILENT)) {
    switch (pDoor.ubTrapID) {
      case Enum227.BROTHEL_SIREN:
        ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.LOCK_TRAP_HAS_GONE_OFF_STR], pDoorTrapStrings[Enum227.SIREN]);
        break;
      case Enum227.SUPER_ELECTRIC:
        ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.LOCK_TRAP_HAS_GONE_OFF_STR], pDoorTrapStrings[Enum227.ELECTRIC]);
        break;
      default:
        ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[Enum335.LOCK_TRAP_HAS_GONE_OFF_STR], pDoorTrapStrings[pDoor.ubTrapID]);
        break;
    }
  }

  // set trap off
  switch (pDoor.ubTrapID) {
    case Enum227.EXPLOSION:
      // cause damage as a regular hand grenade
      IgniteExplosion(NOBODY, CenterX(pSoldier.sGridNo), CenterY(pSoldier.sGridNo), 25, pSoldier.sGridNo, Enum225.HAND_GRENADE, 0);
      break;

    case Enum227.SIREN:
      // play siren sound effect but otherwise treat as silent alarm, calling
      // available enemies to this location
      PlayJA2Sample(Enum330.KLAXON_ALARM, RATE_11025, SoundVolume(MIDVOLUME, pDoor.sGridNo), 5, SoundDir(pDoor.sGridNo));
    case Enum227.SILENT_ALARM:
      // Get all available enemies running here
      CallAvailableEnemiesTo(pDoor.sGridNo);
      break;

    case Enum227.BROTHEL_SIREN:
      PlayJA2Sample(Enum330.KLAXON_ALARM, RATE_11025, SoundVolume(MIDVOLUME, pDoor.sGridNo), 5, SoundDir(pDoor.sGridNo));
      CallAvailableKingpinMenTo(pDoor.sGridNo);
      // no one is authorized any more!
      gMercProfiles[Enum268.MADAME].bNPCData = 0;
      break;

    case Enum227.ELECTRIC:
      // insert electrical sound effect here
      PlayJA2Sample(Enum330.DOOR_ELECTRICITY, RATE_11025, SoundVolume(MIDVOLUME, pDoor.sGridNo), 1, SoundDir(pDoor.sGridNo));

      // Set attacker's ID
      pSoldier.ubAttackerID = pSoldier.ubID;
      // Increment  being attacked count
      pSoldier.bBeingAttackedCount++;
      gTacticalStatus.ubAttackBusyCount++;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Trap gone off %d", gTacticalStatus.ubAttackBusyCount));

      SoldierTakeDamage(pSoldier, 0, (10 + PreRandom(10)), ((3 + PreRandom(3) * 1000)), TAKE_DAMAGE_ELECTRICITY, NOBODY, pDoor.sGridNo, 0, true);
      break;

    case Enum227.SUPER_ELECTRIC:
      // insert electrical sound effect here
      PlayJA2Sample(Enum330.DOOR_ELECTRICITY, RATE_11025, SoundVolume(MIDVOLUME, pDoor.sGridNo), 1, SoundDir(pDoor.sGridNo));

      // Set attacker's ID
      pSoldier.ubAttackerID = pSoldier.ubID;
      // Increment  being attacked count
      pSoldier.bBeingAttackedCount++;
      gTacticalStatus.ubAttackBusyCount++;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Trap gone off %d", gTacticalStatus.ubAttackBusyCount));

      SoldierTakeDamage(pSoldier, 0, (20 + PreRandom(20)), ((6 + PreRandom(6) * 1000)), TAKE_DAMAGE_ELECTRICITY, NOBODY, pDoor.sGridNo, 0, true);
      break;

    default:
      // no trap
      break;
  }
}

export function AttemptToBlowUpLock(pSoldier: SOLDIERTYPE, pDoor: DOOR): boolean {
  let iResult: INT32;
  let bSlot: INT8 = NO_SLOT;

  bSlot = FindObj(pSoldier, Enum225.SHAPED_CHARGE);
  if (bSlot == NO_SLOT) {
    return false;
  }

  iResult = SkillCheck(pSoldier, Enum255.PLANTING_BOMB_CHECK, 0);
  if (iResult >= -20) {
    // Do explosive graphic....
    {
      let AniParams: ANITILE_PARAMS = createAnimatedTileParams();
      let sGridNo: INT16;
      let sX: INT16;
      let sY: INT16;
      let sZ: INT16;

      // Get gridno
      sGridNo = pDoor.sGridNo;

      // Get sX, sy;
      sX = CenterX(sGridNo);
      sY = CenterY(sGridNo);

      // Get Z position, based on orientation....
      sZ = 20;

      AniParams.sGridNo = sGridNo;
      AniParams.ubLevelID = ANI_TOPMOST_LEVEL;
      AniParams.sDelay = (100);
      AniParams.sStartFrame = 0;
      AniParams.uiFlags = ANITILE_CACHEDTILE | ANITILE_FORWARD | ANITILE_ALWAYS_TRANSLUCENT;
      AniParams.sX = sX;
      AniParams.sY = sY;
      AniParams.sZ = sZ;

      AniParams.zCachedFile = "TILECACHE\\MINIBOOM.STI";

      CreateAnimationTile(AniParams);

      PlayJA2Sample(Enum330.SMALL_EXPLODE_1, RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));

      // Remove the explosive.....
      bSlot = FindObj(pSoldier, Enum225.SHAPED_CHARGE);
      if (bSlot != NO_SLOT) {
        RemoveObjs(pSoldier.inv[bSlot], 1);
        DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
      }
    }

    // Not sure if this makes sense, but the explosive is small.
    // Double the damage here as we are damaging a lock rather than a person
    pDoor.bLockDamage += Explosive[Item[Enum225.SHAPED_CHARGE].ubClassIndex].ubDamage * 2;
    if (pDoor.bLockDamage > LockTable[pDoor.ubLockID].ubSmashDifficulty) {
      // succeeded! door can never be locked again, so remove from door list...
      RemoveDoorInfoFromTable(pDoor.sGridNo);
      // award experience points?
      return true;
    }
  } else {
    bSlot = FindObj(pSoldier, Enum225.SHAPED_CHARGE);
    if (bSlot != NO_SLOT) {
      RemoveObjs(pSoldier.inv[bSlot], 1);
      DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
    }

    // OOPS! ... BOOM!
    IgniteExplosion(NOBODY, pSoldier.sX, pSoldier.sY, (gpWorldLevelData[pSoldier.sGridNo].sHeight), pSoldier.sGridNo, Enum225.SHAPED_CHARGE, 0);
  }
  return false;
}

// File I/O for loading the door information from the map.  This automatically allocates
// the exact number of slots when loading.
export function LoadDoorTableFromMap(buffer: Buffer, offset: number): number {
  let cnt: INT32;

  TrashDoorTable();
  gubNumDoors = buffer.readUInt8(offset++);

  gubMaxDoors = gubNumDoors;
  DoorTable = createArrayFrom(gubMaxDoors, createDoor);

  offset = readObjectArray(DoorTable, buffer, offset, readDoor);

  // OK, reset perceived values to nothing...
  for (cnt = 0; cnt < gubNumDoors; cnt++) {
    DoorTable[cnt].bPerceivedLocked = DOOR_PERCEIVED_UNKNOWN;
    DoorTable[cnt].bPerceivedTrapped = DOOR_PERCEIVED_UNKNOWN;
  }

  return offset;
}

// Saves the existing door information to the map.  Before it actually saves, it'll verify that the
// door still exists.  Otherwise, it'll ignore it.  It is possible in the editor to delete doors in
// many different ways, so I opted to put it in the saving routine.
export function SaveDoorTableToMap(fp: HWFILE): void {
  let i: INT32 = 0;
  let uiBytesWritten: UINT32;
  let buffer: Buffer;

  while (i < gubNumDoors) {
    if (!OpenableAtGridNo(DoorTable[i].sGridNo))
      RemoveDoorInfoFromTable(DoorTable[i].sGridNo);
    else
      i++;
  }

  buffer = Buffer.allocUnsafe(1);
  buffer.writeUInt8(gubNumDoors, 0);
  uiBytesWritten = FileWrite(fp, buffer, 1);

  buffer = Buffer.allocUnsafe(DOOR_SIZE * gubNumDoors);
  writeObjectArray(DoorTable, buffer, 0, writeDoor);
  uiBytesWritten = FileWrite(fp, buffer, DOOR_SIZE * gubNumDoors);
}

// The editor adds locks to the world.  If the gridno already exists, then the currently existing door
// information is overwritten.
export function AddDoorInfoToTable(pDoor: DOOR): void {
  let i: INT32;
  for (i = 0; i < gubNumDoors; i++) {
    if (DoorTable[i].sGridNo == pDoor.sGridNo) {
      copyDoor(DoorTable[i], pDoor);
      return;
    }
  }
  // no existing door found, so add a new one.
  if (gubNumDoors < gubMaxDoors) {
    copyDoor(DoorTable[gubNumDoors], pDoor);
    gubNumDoors++;
  } else {
    // we need to allocate more memory, so add ten more slots.
    let NewDoorTable: DOOR[];
    gubMaxDoors += 10;
    // Allocate new table with max+10 doors.
    NewDoorTable = DoorTable.concat(createArrayFrom(10, createDoor));
    // Assign the new door table as the existing door table
    DoorTable = NewDoorTable;
    // Add the new door info to the table.
    copyDoor(DoorTable[gubNumDoors], pDoor);
    gubNumDoors++;
  }
}

// When the editor removes a door from the world, this function looks for and removes accompanying door
// information.  If the entry is not the last entry, the last entry is move to it's current slot, to keep
// everything contiguous.
export function RemoveDoorInfoFromTable(iMapIndex: INT32): void {
  let i: INT32;
  let iNumDoorsToCopy: INT32;
  for (i = 0; i < gubNumDoors; i++) {
    if (DoorTable[i].sGridNo == iMapIndex) {
      iNumDoorsToCopy = gubNumDoors - i - 1;
      if (iNumDoorsToCopy) {
        DoorTable.copyWithin(i, i + 1);
      }
      gubNumDoors--;
      return;
    }
  }
}

// This is the link to see if a door exists at a gridno.
export function FindDoorInfoAtGridNo(iMapIndex: INT32): DOOR | null {
  let i: INT32;
  for (i = 0; i < gubNumDoors; i++) {
    if (DoorTable[i].sGridNo == iMapIndex)
      return DoorTable[i];
  }
  return null;
}

// Upon world deallocation, the door table needs to be deallocated.  Remember, this function
// resets the values, so make sure you do this before you change gubNumDoors or gubMaxDoors.
export function TrashDoorTable(): void {
  DoorTable = <DOOR[]><unknown>null;
  gubNumDoors = 0;
  gubMaxDoors = 0;
}

export function UpdateDoorPerceivedValue(pDoor: DOOR): void {
  if (pDoor.fLocked) {
    pDoor.bPerceivedLocked = DOOR_PERCEIVED_LOCKED;
  } else if (!pDoor.fLocked) {
    pDoor.bPerceivedLocked = DOOR_PERCEIVED_UNLOCKED;
  }

  if (pDoor.ubTrapID != Enum227.NO_TRAP) {
    pDoor.bPerceivedTrapped = DOOR_PERCEIVED_TRAPPED;
  } else {
    pDoor.bPerceivedTrapped = DOOR_PERCEIVED_UNTRAPPED;
  }
}

export function SaveDoorTableToDoorTableTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let uiNumBytesWritten: UINT32;
  let uiSizeToSave: UINT32 = 0;
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let buffer: Buffer;

  //	return( TRUE );

  uiSizeToSave = gubNumDoors * DOOR_SIZE;

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'd' for 'Door' to the front of the map name
  //	sprintf( zMapName, "%s\\d_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_DOOR_TABLE_TEMP_FILES_EXISTS, sSectorX, sSectorY, bSectorZ);

  // if the file already exists, delete it
  if (FileExists(zMapName)) {
    // We are going to be overwriting the file
    if (!FileDelete(zMapName)) {
      return false;
    }
  }

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Save the number of doors
  buffer = Buffer.allocUnsafe(1);
  buffer.writeUInt8(gubNumDoors, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1) {
    FileClose(hFile);
    return false;
  }

  // if there are doors to save
  if (uiSizeToSave != 0) {
    // Save the door table
    buffer = Buffer.allocUnsafe(uiSizeToSave);
    writeObjectArray(DoorTable.slice(0, gubNumDoors), buffer, 0, writeDoor)
    uiNumBytesWritten = FileWrite(hFile, buffer, uiSizeToSave);
    if (uiNumBytesWritten != uiSizeToSave) {
      FileClose(hFile);
      return false;
    }
  }

  // Set the sector flag indicating that there is a Door table temp file present
  SetSectorFlag(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, SF_DOOR_TABLE_TEMP_FILES_EXISTS);

  FileClose(hFile);

  return true;
}

export function LoadDoorTableFromDoorTableTempFile(): boolean {
  let uiNumBytesRead: UINT32;
  let hFile: HWFILE;
  let zMapName: string /* CHAR8[128] */;
  let buffer: Buffer;

  //	return( TRUE );

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'd' for 'Door' to the front of the map name
  //	sprintf( zMapName, "%s\\d_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_DOOR_TABLE_TEMP_FILES_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return true;
  }

  // Get rid of the existing door table
  TrashDoorTable();

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file,
    return false;
  }

  // Read in the number of doors
  buffer = Buffer.allocUnsafe(1);
  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hFile);
    return false;
  }

  gubMaxDoors = buffer.readUInt8(0);

  gubNumDoors = gubMaxDoors;

  // if there is no doors to load
  if (gubNumDoors != 0) {
    // Allocate space for the door table
    DoorTable = createArrayFrom(gubMaxDoors, createDoor);
    if (DoorTable == null) {
      FileClose(hFile);
      return false;
    }

    // Read in the number of doors
    buffer = Buffer.allocUnsafe(DOOR_SIZE * gubMaxDoors);
    uiNumBytesRead = FileRead(hFile, buffer, DOOR_SIZE * gubMaxDoors);
    if (uiNumBytesRead != DOOR_SIZE * gubMaxDoors) {
      FileClose(hFile);
      return false;
    }

    readObjectArray(DoorTable, buffer, 0, readDoor);
  }

  FileClose(hFile);

  return true;
}

// fOpen is True if the door is open, false if it is closed
export function ModifyDoorStatus(sGridNo: INT16, fOpen: boolean | undefined, fPerceivedOpen: boolean | undefined): boolean {
  let ubCnt: UINT8;
  let pStructure: STRUCTURE | null;
  let pBaseStructure: STRUCTURE | null;

  // Set the gridno for the door

  // Find the base tile for the door structure and use that gridno
  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
  } else {
    pBaseStructure = null;
  }

  if (pBaseStructure == null) {
    return false;
  }

  // if there is an array
  if (gpDoorStatus) {
    // Check to see if the user is adding an existing door
    for (ubCnt = 0; ubCnt < gubNumDoorStatus; ubCnt++) {
      // if the door is already in the array
      if (gpDoorStatus[ubCnt].sGridNo == pBaseStructure.sGridNo) {
        // set the status
        // ATE: Don't set if set to DONTSET
        if (fPerceivedOpen != DONTSETDOORSTATUS) {
          if (fPerceivedOpen)
            gpDoorStatus[ubCnt].ubFlags |= DOOR_PERCEIVED_OPEN;
          else
            gpDoorStatus[ubCnt].ubFlags &= ~DOOR_PERCEIVED_OPEN;

          // Turn off perceived not set flag....
          gpDoorStatus[ubCnt].ubFlags &= ~DOOR_PERCEIVED_NOTSET;
        }

        if (fOpen != DONTSETDOORSTATUS) {
          if (fOpen)
            gpDoorStatus[ubCnt].ubFlags |= DOOR_OPEN;
          else
            gpDoorStatus[ubCnt].ubFlags &= ~DOOR_OPEN;
        }

        // Dont add it
        return true;
      }
    }
  }

  // add a new door status structure

  // if there is an array
  if (gpDoorStatus) {
    // Increment the number of doors
    gubNumDoorStatus++;

    // reallocate memory to hold the new door
    gpDoorStatus.push(createDoorStatus());
  }

  gpDoorStatus[gubNumDoorStatus - 1].sGridNo = pBaseStructure.sGridNo;

  // Init the flags
  gpDoorStatus[gubNumDoorStatus - 1].ubFlags = 0;

  // If the door is to be initially open
  if (fOpen)
    gpDoorStatus[gubNumDoorStatus - 1].ubFlags |= DOOR_OPEN;

  // IF A NEW DOOR, USE SAME AS ACTUAL
  if (fPerceivedOpen != DONTSETDOORSTATUS) {
    if (fOpen)
      gpDoorStatus[gubNumDoorStatus - 1].ubFlags |= DOOR_PERCEIVED_OPEN;
  } else {
    gpDoorStatus[gubNumDoorStatus - 1].ubFlags |= DOOR_PERCEIVED_NOTSET;
  }

  // flag the tile as containing a door status
  gpWorldLevelData[pBaseStructure.sGridNo].ubExtFlags[0] |= MAPELEMENT_EXT_DOOR_STATUS_PRESENT;

  return true;
}

export function TrashDoorStatusArray(): void {
  if (gpDoorStatus) {
    gpDoorStatus = <DOOR_STATUS[]><unknown>null;
  }

  gubNumDoorStatus = 0;
}

function IsDoorOpen(sGridNo: INT16): boolean {
  let ubCnt: UINT8;
  let pStructure: STRUCTURE | null;
  let pBaseStructure: STRUCTURE | null;

  // Find the base tile for the door structure and use that gridno
  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
  } else {
    pBaseStructure = null;
  }

  if (pBaseStructure == null) {
    return false;
  }

  // if there is an array
  if (gpDoorStatus) {
    // Check to see if the user is adding an existing door
    for (ubCnt = 0; ubCnt < gubNumDoorStatus; ubCnt++) {
      // if this is the door
      if (gpDoorStatus[ubCnt].sGridNo == pBaseStructure.sGridNo) {
        if (gpDoorStatus[ubCnt].ubFlags & DOOR_OPEN)
          return true;
        else
          return false;
      }
    }
  }

  return false;
}

// Returns a doors status value, NULL if not found
export function GetDoorStatus(sGridNo: INT16): DOOR_STATUS | null {
  let ubCnt: UINT8;
  let pStructure: STRUCTURE | null;
  let pBaseStructure: STRUCTURE | null;

  // if there is an array
  if (gpDoorStatus) {
    // Find the base tile for the door structure and use that gridno
    pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
    if (pStructure) {
      pBaseStructure = FindBaseStructure(pStructure);
    } else {
      pBaseStructure = null;
    }

    if (pBaseStructure == null) {
      return null;
    }

    // Check to see if the user is adding an existing door
    for (ubCnt = 0; ubCnt < gubNumDoorStatus; ubCnt++) {
      // if this is the door
      if (gpDoorStatus[ubCnt].sGridNo == pBaseStructure.sGridNo) {
        return gpDoorStatus[ubCnt];
      }
    }
  }

  return null;
}

export function AllMercsLookForDoor(sGridNo: INT16, fUpdateValue: boolean): boolean {
  let cnt: INT32;
  let cnt2: INT32;
  let bDirs: INT8[] /* [8] */ = [
    Enum245.NORTH,
    Enum245.SOUTH,
    Enum245.EAST,
    Enum245.WEST,
    Enum245.NORTHEAST,
    Enum245.NORTHWEST,
    Enum245.SOUTHEAST,
    Enum245.SOUTHWEST,
  ];
  let pSoldier: SOLDIERTYPE;
  let sDistVisible: INT16;
  let pDoorStatus: DOOR_STATUS | null;
  let usNewGridNo: INT16;

  // Get door
  pDoorStatus = GetDoorStatus(sGridNo);

  if (pDoorStatus == null) {
    return false;
  }

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    // ATE: Ok, lets check for some basic things here!
    if (pSoldier.bLife >= OKLIFE && pSoldier.sGridNo != NOWHERE && pSoldier.bActive && pSoldier.bInSector) {
      // is he close enough to see that gridno if he turns his head?
      sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sGridNo, 0);

      if (PythSpacesAway(pSoldier.sGridNo, sGridNo) <= sDistVisible) {
        // and we can trace a line of sight to his x,y coordinates?
        // (taking into account we are definitely aware of this guy now)
        if (SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, 0, 0, sDistVisible, true)) {
          // Update status...
          if (fUpdateValue) {
            InternalUpdateDoorsPerceivedValue(pDoorStatus);
          }
          return true;
        }
      }

      // Now try other adjacent gridnos...
      for (cnt2 = 0; cnt2 < 8; cnt2++) {
        usNewGridNo = NewGridNo(sGridNo, DirectionInc(bDirs[cnt2]));
        sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, usNewGridNo, 0);

        if (PythSpacesAway(pSoldier.sGridNo, usNewGridNo) <= sDistVisible) {
          // and we can trace a line of sight to his x,y coordinates?
          // (taking into account we are definitely aware of this guy now)
          if (SoldierTo3DLocationLineOfSightTest(pSoldier, usNewGridNo, 0, 0, sDistVisible, true)) {
            // Update status...
            if (fUpdateValue) {
              InternalUpdateDoorsPerceivedValue(pDoorStatus);
            }
            return true;
          }
        }
      }
    }
  }

  return false;
}

export function MercLooksForDoors(pSoldier: SOLDIERTYPE, fUpdateValue: boolean): boolean {
  let cnt: INT32;
  let cnt2: INT32;
  let sDistVisible: INT16;
  let sGridNo: INT16;
  let pDoorStatus: DOOR_STATUS;
  let bDirs: INT8[] /* [8] */ = [
    Enum245.NORTH,
    Enum245.SOUTH,
    Enum245.EAST,
    Enum245.WEST,
    Enum245.NORTHEAST,
    Enum245.NORTHWEST,
    Enum245.SOUTHEAST,
    Enum245.SOUTHWEST,
  ];
  let usNewGridNo: INT16;

  // Loop through all corpses....
  for (cnt = 0; cnt < gubNumDoorStatus; cnt++) {
    pDoorStatus = gpDoorStatus[cnt];

    if (!InternalIsPerceivedDifferentThanReality(pDoorStatus)) {
      continue;
    }

    sGridNo = pDoorStatus.sGridNo;

    // is he close enough to see that gridno if he turns his head?
    sDistVisible = DistanceVisible(pSoldier, Enum245.DIRECTION_IRRELEVANT, Enum245.DIRECTION_IRRELEVANT, sGridNo, 0);

    if (PythSpacesAway(pSoldier.sGridNo, sGridNo) <= sDistVisible) {
      // and we can trace a line of sight to his x,y coordinates?
      // (taking into account we are definitely aware of this guy now)
      if (SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, 0, 0, sDistVisible, true)) {
        // OK, here... update perceived value....
        if (fUpdateValue) {
          InternalUpdateDoorsPerceivedValue(pDoorStatus);

          // Update graphic....
          InternalUpdateDoorGraphicFromStatus(pDoorStatus, true, true);
        }
        return true;
      }
    }

    // Now try other adjacent gridnos...
    for (cnt2 = 0; cnt2 < 8; cnt2++) {
      usNewGridNo = NewGridNo(sGridNo, DirectionInc(bDirs[cnt2]));

      if (PythSpacesAway(pSoldier.sGridNo, usNewGridNo) <= sDistVisible) {
        // and we can trace a line of sight to his x,y coordinates?
        // (taking into account we are definitely aware of this guy now)
        if (SoldierTo3DLocationLineOfSightTest(pSoldier, usNewGridNo, 0, 0, sDistVisible, true)) {
          // Update status...
          if (fUpdateValue) {
            InternalUpdateDoorsPerceivedValue(pDoorStatus);

            // Update graphic....
            InternalUpdateDoorGraphicFromStatus(pDoorStatus, true, true);
          }
          return true;
        }
      }
    }
  }

  return false;
}

function SyncronizeDoorStatusToStructureData(pDoorStatus: DOOR_STATUS): void {
  let pStructure: STRUCTURE | null;
  let pBaseStructure: STRUCTURE | null;
  let pNode: LEVELNODE | null;
  let sBaseGridNo: INT16 = NOWHERE;

  // First look for a door structure here...
  pStructure = FindStructure(pDoorStatus.sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure) {
    pBaseStructure = <STRUCTURE>FindBaseStructure(pStructure);
    sBaseGridNo = pBaseStructure.sGridNo;
  } else {
    pBaseStructure = null;
  }

  if (pBaseStructure == null) {
    return;
  }

  Assert(pStructure);

  pNode = FindLevelNodeBasedOnStructure(sBaseGridNo, pBaseStructure);
  if (!pNode) {
    return;
  }

  // ATE: OK let me explain something here:
  // One of the purposes of this function is to MAKE sure the door status MATCHES
  // the struct data value - if not - change ( REGARDLESS of perceived being used or not... )
  //
  // Check for opened...
  if (pDoorStatus.ubFlags & DOOR_OPEN) {
    // IF closed.....
    if (!(pStructure.fFlags & STRUCTURE_OPEN)) {
      // Swap!
      SwapStructureForPartner(sBaseGridNo, pBaseStructure);
      RecompileLocalMovementCosts(sBaseGridNo);
    }
  } else {
    if ((pStructure.fFlags & STRUCTURE_OPEN)) {
      // Swap!
      SwapStructureForPartner(sBaseGridNo, pBaseStructure);
      RecompileLocalMovementCosts(sBaseGridNo);
    }
  }
}

export function UpdateDoorGraphicsFromStatus(fUsePerceivedStatus: boolean, fDirty: boolean): void {
  let cnt: INT32;
  let pDoorStatus: DOOR_STATUS;

  for (cnt = 0; cnt < gubNumDoorStatus; cnt++) {
    pDoorStatus = gpDoorStatus[cnt];

    // ATE: Make sure door status flag and struct info are syncronized....
    SyncronizeDoorStatusToStructureData(pDoorStatus);

    InternalUpdateDoorGraphicFromStatus(pDoorStatus, fUsePerceivedStatus, fDirty);
  }
}

function InternalUpdateDoorGraphicFromStatus(pDoorStatus: DOOR_STATUS, fUsePerceivedStatus: boolean, fDirty: boolean): void {
  let pStructure: STRUCTURE | null;
  let pBaseStructure: STRUCTURE | null;
  let cnt: INT32;
  let fOpenedGraphic: boolean = false;
  let pNode: LEVELNODE | null;
  let fWantToBeOpen: boolean = false;
  let fDifferent: boolean = false;
  let sBaseGridNo: INT16 = NOWHERE;

  // OK, look at perceived status and adjust graphic
  // First look for a door structure here...
  pStructure = FindStructure(pDoorStatus.sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure) {
    pBaseStructure = <STRUCTURE>FindBaseStructure(pStructure);
    sBaseGridNo = pBaseStructure.sGridNo;
  } else {
    pBaseStructure = null;
  }

  if (pBaseStructure == null) {
    return;
  }

  Assert(pStructure);

  pNode = FindLevelNodeBasedOnStructure(sBaseGridNo, pBaseStructure);
  if (!pNode) {
    return;
  }

  // Get status we want to chenge to.....
  if (fUsePerceivedStatus) {
    if (pDoorStatus.ubFlags & DOOR_PERCEIVED_OPEN) {
      fWantToBeOpen = true;
    }
  } else {
    if (pDoorStatus.ubFlags & DOOR_OPEN) {
      fWantToBeOpen = true;
    }
  }

  // First look for an opened door
  // get what it is now...
  cnt = 0;
  while (gClosedDoorList[cnt] != -1) {
    // IF WE ARE A SHADOW TYPE
    if (pNode.usIndex == gClosedDoorList[cnt]) {
      fOpenedGraphic = true;
      break;
    }
    cnt++;
  };

  // OK, we either have an opened graphic, in which case we want to switch to the closed, or a closed
  // in which case we want to switch to opened...
  // adjust o' graphic

  // OK, we now need to test these things against the true structure data
  // we may need to only adjust the graphic here....
  if (fWantToBeOpen && (pStructure.fFlags & STRUCTURE_OPEN)) {
    let fFound: boolean = false;
    // Adjust graphic....

    // Loop through and and find opened graphic for the closed one....
    cnt = 0;
    while (gOpenDoorList[cnt] != -1) {
      // IF WE ARE A SHADOW TYPE
      if (pNode.usIndex == gOpenDoorList[cnt]) {
        fFound = true;
        break;
      }
      cnt++;
    };

    // OK, now use opened graphic.
    if (fFound) {
      pNode.usIndex = gClosedDoorList[cnt];

      if (fDirty) {
        InvalidateWorldRedundency();
        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }

    return;
  }

  // If we want to be closed but structure is closed
  if (!fWantToBeOpen && !(pStructure.fFlags & STRUCTURE_OPEN)) {
    let fFound: boolean = false;
    // Adjust graphic....

    // Loop through and and find closed graphic for the opend one....
    cnt = 0;
    while (gClosedDoorList[cnt] != -1) {
      // IF WE ARE A SHADOW TYPE
      if (pNode.usIndex == gClosedDoorList[cnt]) {
        fFound = true;
        break;
      }
      cnt++;
    };

    // OK, now use opened graphic.
    if (fFound) {
      pNode.usIndex = gOpenDoorList[cnt];

      if (fDirty) {
        InvalidateWorldRedundency();
        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }

    return;
  }

  if (fOpenedGraphic && !fWantToBeOpen) {
    // Close the beast!
    fDifferent = true;
    pNode.usIndex = gOpenDoorList[cnt];
  } else if (!fOpenedGraphic && fWantToBeOpen) {
    // Find the closed door graphic and adjust....
    cnt = 0;
    while (gOpenDoorList[cnt] != -1) {
      // IF WE ARE A SHADOW TYPE
      if (pNode.usIndex == gOpenDoorList[cnt]) {
        // Open the beast!
        fDifferent = true;
        pNode.usIndex = gClosedDoorList[cnt];
        break;
      }
      cnt++;
    };
  }

  if (fDifferent) {
    SwapStructureForPartner(sBaseGridNo, pBaseStructure);

    RecompileLocalMovementCosts(sBaseGridNo);

    if (fDirty) {
      InvalidateWorldRedundency();
      SetRenderFlags(RENDER_FLAG_FULL);
    }
  }
}

function InternalIsPerceivedDifferentThanReality(pDoorStatus: DOOR_STATUS): boolean {
  if ((pDoorStatus.ubFlags & DOOR_PERCEIVED_NOTSET)) {
    return true;
  }

  // Compare flags....
  if ((pDoorStatus.ubFlags & DOOR_OPEN && pDoorStatus.ubFlags & DOOR_PERCEIVED_OPEN) || (!(pDoorStatus.ubFlags & DOOR_OPEN) && !(pDoorStatus.ubFlags & DOOR_PERCEIVED_OPEN))) {
    return false;
  }

  return true;
}

function InternalUpdateDoorsPerceivedValue(pDoorStatus: DOOR_STATUS): void {
  // OK, look at door, set perceived value the same as actual....
  if (pDoorStatus.ubFlags & DOOR_OPEN) {
    InternalSetDoorPerceivedOpenStatus(pDoorStatus, true);
  } else {
    InternalSetDoorPerceivedOpenStatus(pDoorStatus, false);
  }
}

function UpdateDoorStatusPerceivedValue(sGridNo: INT16): boolean {
  let pDoorStatus: DOOR_STATUS | null = null;

  pDoorStatus = GetDoorStatus(sGridNo);
  if (pDoorStatus == null) {
    return false;
  }

  InternalUpdateDoorsPerceivedValue(pDoorStatus);

  return true;
}

function IsDoorPerceivedOpen(sGridNo: INT16): boolean {
  let pDoorStatus: DOOR_STATUS | null;

  pDoorStatus = GetDoorStatus(sGridNo);

  if (pDoorStatus && pDoorStatus.ubFlags & DOOR_PERCEIVED_OPEN) {
    return true;
  } else {
    return false;
  }
}

function InternalSetDoorPerceivedOpenStatus(pDoorStatus: DOOR_STATUS, fPerceivedOpen: boolean): boolean {
  if (fPerceivedOpen)
    pDoorStatus.ubFlags |= DOOR_PERCEIVED_OPEN;
  else
    pDoorStatus.ubFlags &= ~DOOR_PERCEIVED_OPEN;

  // Turn off perceived not set flag....
  pDoorStatus.ubFlags &= ~DOOR_PERCEIVED_NOTSET;

  return true;
}

function SetDoorPerceivedOpenStatus(sGridNo: INT16, fPerceivedOpen: boolean): boolean {
  let pDoorStatus: DOOR_STATUS | null = null;

  pDoorStatus = GetDoorStatus(sGridNo);

  if (pDoorStatus == null) {
    return false;
  }

  return InternalSetDoorPerceivedOpenStatus(pDoorStatus, fPerceivedOpen);
}

function SetDoorOpenStatus(sGridNo: INT16, fOpen: boolean): boolean {
  let pDoorStatus: DOOR_STATUS | null;

  pDoorStatus = GetDoorStatus(sGridNo);

  if (pDoorStatus) {
    if (fOpen) {
      pDoorStatus.ubFlags |= DOOR_OPEN;
    } else {
      pDoorStatus.ubFlags &= ~DOOR_OPEN;
    }
    return true;
  } else {
    return false;
  }
}

export function SaveDoorStatusArrayToDoorStatusTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): boolean {
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;
  let ubCnt: UINT8;
  let buffer: Buffer;

  // Turn off any DOOR BUSY flags....
  for (ubCnt = 0; ubCnt < gubNumDoorStatus; ubCnt++) {
    gpDoorStatus[ubCnt].ubFlags &= (~DOOR_BUSY);
  }

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\ds_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_DOOR_STATUS_TEMP_FILE_EXISTS, sSectorX, sSectorY, bSectorZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, false);
  if (hFile == 0) {
    // Error opening map modification file
    return false;
  }

  // Save the number of elements in the door array
  buffer = Buffer.allocUnsafe(1);
  buffer.writeUInt8(gubNumDoorStatus, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiNumBytesWritten != 1) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return false;
  }

  // if there is some to save
  if (gubNumDoorStatus != 0) {
    // Save the door array
    buffer = Buffer.allocUnsafe(DOOR_STATUS_SIZE);
    writeObjectArray(gpDoorStatus, buffer, 0, writeDoorStatus);
    uiNumBytesWritten = FileWrite(hFile, buffer, (DOOR_STATUS_SIZE * gubNumDoorStatus));
    if (uiNumBytesWritten != (DOOR_STATUS_SIZE * gubNumDoorStatus)) {
      // Error Writing size of array to disk
      FileClose(hFile);
      return false;
    }
  }

  FileClose(hFile);

  // Set the flag indicating that there is a door status array
  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_DOOR_STATUS_TEMP_FILE_EXISTS);

  return true;
}

export function LoadDoorStatusArrayFromDoorStatusTempFile(): boolean {
  let zMapName: string /* CHAR8[128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let ubLoop: UINT8;
  let buffer: Buffer;

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\ds_%s", MAPS_DIR, zTempName);

  zMapName = GetMapTempFileName(SF_DOOR_STATUS_TEMP_FILE_EXISTS, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Get rid of the existing door array
  TrashDoorStatusArray();

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, false);
  if (hFile == 0) {
    // Error opening map modification file,
    return false;
  }

  // Load the number of elements in the door status array
  buffer = Buffer.allocUnsafe(1);
  uiNumBytesRead = FileRead(hFile, buffer, 1);
  if (uiNumBytesRead != 1) {
    FileClose(hFile);
    return false;
  }

  gubNumDoorStatus = buffer.readUInt8(0);

  if (gubNumDoorStatus == 0) {
    FileClose(hFile);
    return true;
  }

  // Allocate space for the door status array
  gpDoorStatus = createArrayFrom(gubNumDoorStatus, createDoorStatus);

  // Load the number of elements in the door status array
  buffer = Buffer.allocUnsafe(DOOR_STATUS_SIZE * gubNumDoorStatus);
  uiNumBytesRead = FileRead(hFile, buffer, (DOOR_STATUS_SIZE * gubNumDoorStatus));
  if (uiNumBytesRead != (DOOR_STATUS_SIZE * gubNumDoorStatus)) {
    FileClose(hFile);
    return false;
  }

  readObjectArray(gpDoorStatus, buffer, 0, readDoorStatus);

  FileClose(hFile);

  // the graphics will be updated later in the loading process.

  // set flags in map for containing a door status
  for (ubLoop = 0; ubLoop < gubNumDoorStatus; ubLoop++) {
    gpWorldLevelData[gpDoorStatus[ubLoop].sGridNo].ubExtFlags[0] |= MAPELEMENT_EXT_DOOR_STATUS_PRESENT;
  }

  UpdateDoorGraphicsFromStatus(true, false);

  return true;
}

export function SaveKeyTableToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let buffer: Buffer;

  // Save the KeyTable
  buffer = Buffer.allocUnsafe(KEY_SIZE * NUM_KEYS);
  writeObjectArray(KeyTable, buffer, 0, writeKey);
  uiNumBytesWritten = FileWrite(hFile, buffer, KEY_SIZE * NUM_KEYS);
  if (uiNumBytesWritten != KEY_SIZE * NUM_KEYS) {
    return false;
  }

  return true;
}

export function LoadKeyTableFromSaveedGameFile(hFile: HWFILE): boolean {
  let uiNumBytesRead: UINT32 = 0;
  let buffer: Buffer;

  // Load the KeyTable
  buffer = Buffer.allocUnsafe(KEY_SIZE * NUM_KEYS);
  uiNumBytesRead = FileRead(hFile, buffer, KEY_SIZE * NUM_KEYS);
  if (uiNumBytesRead != KEY_SIZE * NUM_KEYS) {
    return false;
  }

  readObjectArray(KeyTable, buffer, 0, readKey);

  return true;
}

export function ExamineDoorsOnEnteringSector(): void {
  let cnt: INT32;
  let pDoorStatus: DOOR_STATUS;
  let pSoldier: SOLDIERTYPE;
  let fOK: boolean = false;
  let bTownId: INT8;

  // OK, only do this if conditions are met....
  // If this is any omerta tow, don't do it...
  bTownId = GetTownIdForSector(gWorldSectorX, gWorldSectorY);

  if (bTownId == Enum135.OMERTA) {
    return;
  }

  // Check time...
  if ((GetWorldTotalMin() - gTacticalStatus.uiTimeSinceLastInTactical) < 30) {
    return;
  }

  // there is at least one human being in that sector.
  // check for civ
  cnt = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;
  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[LAST_TEAM].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive) {
      if (pSoldier.bInSector) {
        fOK = true;
        break;
      }
    }
  }

  // Let's do it!
  if (fOK) {
    for (cnt = 0; cnt < gubNumDoorStatus; cnt++) {
      pDoorStatus = gpDoorStatus[cnt];

      // Get status of door....
      if (pDoorStatus.ubFlags & DOOR_OPEN) {
        // If open, close!
        HandleDoorChangeFromGridNo(null, pDoorStatus.sGridNo, true);
      }
    }
  }
}

function HandleDoorsChangeWhenEnteringSectorCurrentlyLoaded(): void {
  let cnt: INT32;
  let pDoorStatus: DOOR_STATUS;
  let pSoldier: SOLDIERTYPE;
  let fOK: boolean = false;
  let iNumNewMercs: INT32 = 0;
  let bTownId: INT8;

  // OK, only do this if conditions are met....

  // If this is any omerta tow, don't do it...
  bTownId = GetTownIdForSector(gWorldSectorX, gWorldSectorY);

  if (bTownId == Enum135.OMERTA) {
    return;
  }

  // 1 ) there is at least one human being in that sector.
  // check for civ
  cnt = gTacticalStatus.Team[ENEMY_TEAM].bFirstID;

  // Check time...
  if ((GetWorldTotalMin() - gTacticalStatus.uiTimeSinceLastInTactical) < 30) {
    return;
  }

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[LAST_TEAM].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive && pSoldier.bInSector) {
      fOK = true;
      break;
    }
  }

  // Loop through our team now....
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive && pSoldier.bInSector && gbMercIsNewInThisSector[cnt]) {
      iNumNewMercs++;
    }
  }

  // ATE: Only do for newly added mercs....
  if (iNumNewMercs == 0) {
    return;
  }

  // Let's do it!
  if (fOK) {
    for (cnt = 0; cnt < gubNumDoorStatus; cnt++) {
      pDoorStatus = gpDoorStatus[cnt];

      // Get status of door....
      if (pDoorStatus.ubFlags & DOOR_OPEN) {
        // If open, close!
        gfSetPerceivedDoorState = true;

        HandleDoorChangeFromGridNo(null, pDoorStatus.sGridNo, true);

        gfSetPerceivedDoorState = false;

        AllMercsLookForDoor(pDoorStatus.sGridNo, true);

        InternalUpdateDoorGraphicFromStatus(pDoorStatus, true, true);
      }
    }
  }
}

export function DropKeysInKeyRing(pSoldier: SOLDIERTYPE, sGridNo: INT16, bLevel: INT8, bVisible: INT8, fAddToDropList: boolean, iDropListSlot: INT32, fUseUnLoaded: boolean): void {
  let ubLoop: UINT8;
  let ubItem: UINT8;
  let Object: OBJECTTYPE = createObjectType();

  if (!(pSoldier.pKeyRing)) {
    // no key ring!
    return;
  }
  for (ubLoop = 0; ubLoop < NUM_KEYS; ubLoop++) {
    ubItem = pSoldier.pKeyRing[ubLoop].ubKeyID;

    if (pSoldier.pKeyRing[ubLoop].ubNumber > 0) {
      CreateKeyObject(Object, pSoldier.pKeyRing[ubLoop].ubNumber, ubItem);

      // Zero out entry
      pSoldier.pKeyRing[ubLoop].ubNumber = 0;
      pSoldier.pKeyRing[ubLoop].ubKeyID = INVALID_KEY_NUMBER;

      if (fAddToDropList) {
        AddItemToLeaveIndex(Object, iDropListSlot);
      } else {
        if (pSoldier.sSectorX != gWorldSectorX || pSoldier.sSectorY != gWorldSectorY || pSoldier.bSectorZ != gbWorldSectorZ || fUseUnLoaded) {
          // Set flag for item...
          AddItemsToUnLoadedSector(pSoldier.sSectorX, pSoldier.sSectorY, pSoldier.bSectorZ, sGridNo, 1, [Object], bLevel, WOLRD_ITEM_FIND_SWEETSPOT_FROM_GRIDNO | WORLD_ITEM_REACHABLE, 0, bVisible, false);
        } else {
          // Add to pool
          AddItemToPool(sGridNo, Object, bVisible, bLevel, 0, 0);
        }
      }
    }
  }
}

}
