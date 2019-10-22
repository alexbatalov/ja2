let gpDoorStatus: Pointer<DOOR_STATUS> = NULL;
let gubNumDoorStatus: UINT8 = 0;

let KeyTable: KEY[] /* [NUM_KEYS] */ = [
  // Item #			Flags		Sector, Date Found
  //
  [ KEY_1, 0, 0, 0 ],
  [ KEY_2, 0, 0, 0 ],
  [ KEY_3, 0, 0, 0 ],
  [ KEY_4, 0, 0, 0 ],
  [ KEY_5, 0, 0, 0 ],
  [ KEY_6, 0, 0, 0 ],
  [ KEY_7, 0, 0, 0 ],
  [ KEY_8, 0, 0, 0 ],
  [ KEY_9, 0, 0, 0 ],
  [ KEY_10, 0, 0, 0 ],

  [ KEY_11, 0, 0, 0 ],
  [ KEY_12, 0, 0, 0 ],
  [ KEY_13, 0, 0, 0 ],
  [ KEY_14, 0, 0, 0 ],
  [ KEY_15, 0, 0, 0 ],
  [ KEY_16, 0, 0, 0 ],
  [ KEY_17, 0, 0, 0 ],
  [ KEY_18, 0, 0, 0 ],
  [ KEY_19, 0, 0, 0 ],
  [ KEY_20, 0, 0, 0 ],

  [ KEY_21, 0, 0, 0 ],
  [ KEY_22, 0, 0, 0 ],
  [ KEY_23, 0, 0, 0 ],
  [ KEY_24, 0, 0, 0 ],
  [ KEY_25, 0, 0, 0 ],
  [ KEY_26, 0, 0, 0 ],
  [ KEY_27, 0, 0, 0 ],
  [ KEY_28, 0, 0, 0 ],
  [ KEY_29, 0, 0, 0 ],
  [ KEY_30, 0, 0, 0 ],

  [ KEY_31, 0, 0, 0 ],
  [ KEY_32, 0, 0, 0 ],
];

// Current number of doors in world.
let gubNumDoors: UINT8 = 0;

// Current max number of doors.  This is only used by the editor.  When adding doors to the
// world, we may run out of space in the DoorTable, so we will allocate a new array with extra slots,
// then copy everything over again.  gubMaxDoors holds the arrays actual number of slots, even though
// the current number (gubNumDoors) will be <= to it.
let gubMaxDoors: UINT8 = 0;

let LockTable: LOCK[] /* [NUM_LOCKS] */ = [ 0 ];

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

let DoorTrapTable: DOORTRAP[] /* [NUM_DOOR_TRAPS] */ = [
  [ 0 ], // nothing
  [ DOOR_TRAP_STOPS_ACTION ], // explosion
  [ DOOR_TRAP_STOPS_ACTION | DOOR_TRAP_RECURRING ], // electric
  [ DOOR_TRAP_RECURRING ], // siren
  [ DOOR_TRAP_RECURRING | DOOR_TRAP_SILENT ], // silent alarm
  [ DOOR_TRAP_RECURRING ], // brothel siren
  [ DOOR_TRAP_STOPS_ACTION | DOOR_TRAP_RECURRING ], // super electric
];

// Dynamic array of Doors.  For general game purposes, the doors that are locked and/or trapped
// are permanently saved within the map, and are loaded and allocated when the map is loaded.  Because
// the editor allows more doors to be added, or removed, the actual size of the DoorTable may change.
let DoorTable: Pointer<DOOR> = NULL;

function LoadLockTable(): BOOLEAN {
  let uiNumBytesRead: UINT32 = 0;
  let uiBytesToRead: UINT32;
  let pFileName: Pointer<CHAR8> = "BINARYDATA\\Locks.bin";
  let hFile: HWFILE;

  // Load the Lock Table

  hFile = FileOpen(pFileName, FILE_ACCESS_READ, FALSE);
  if (!hFile) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("FAILED to LoadLockTable from file %s", pFileName));
    return FALSE;
  }

  uiBytesToRead = sizeof(LOCK) * NUM_LOCKS;
  FileRead(hFile, LockTable, uiBytesToRead, addressof(uiNumBytesRead));

  FileClose(hFile);

  if (uiNumBytesRead != uiBytesToRead) {
    return FALSE;
  }

  return TRUE;
}

function SoldierHasKey(pSoldier: Pointer<SOLDIERTYPE>, ubKeyID: UINT8): BOOLEAN {
  if (KeyExistsInKeyRing(pSoldier, ubKeyID, NULL) || KeyExistsInInventory(pSoldier, ubKeyID)) {
    return TRUE;
  }

  return FALSE;
}

function KeyExistsInKeyRing(pSoldier: Pointer<SOLDIERTYPE>, ubKeyID: UINT8, pubPos: Pointer<UINT8>): BOOLEAN {
  // returns the index into the key ring where the key can be found
  let ubLoop: UINT8;

  if (!(pSoldier.value.pKeyRing)) {
    // no key ring!
    return FALSE;
  }
  for (ubLoop = 0; ubLoop < NUM_KEYS; ubLoop++) {
    if (pSoldier.value.pKeyRing[ubLoop].ubNumber == 0) {
      continue;
    }
    if (pSoldier.value.pKeyRing[ubLoop].ubKeyID == ubKeyID || (ubKeyID == ANYKEY)) {
      // found it!
      if (pubPos) {
        pubPos.value = ubLoop;
      }
      return TRUE;
    }
  }
  // exhausted key ring
  return FALSE;
}

function KeyExistsInInventory(pSoldier: Pointer<SOLDIERTYPE>, ubKeyID: UINT8): BOOLEAN {
  let ubLoop: UINT8;

  for (ubLoop = 0; ubLoop < NUM_INV_SLOTS; ubLoop++) {
    if (Item[pSoldier.value.inv[ubLoop].usItem].usItemClass == IC_KEY) {
      if ((pSoldier.value.inv[ubLoop].ubKeyID == ubKeyID) || (ubKeyID == ANYKEY)) {
        // there's the key we want!
        return TRUE;
      }
    }
  }
  return FALSE;
}

function ValidKey(pDoor: Pointer<DOOR>, ubKeyID: UINT8): BOOLEAN {
  return pDoor.value.ubLockID == ubKeyID;
}

function DoLockDoor(pDoor: Pointer<DOOR>, ubKeyID: UINT8): BOOLEAN {
  // if the door is unlocked and this is the right key, lock the door and
  // return true, otherwise return false
  if (!(pDoor.value.fLocked) && ValidKey(pDoor, ubKeyID)) {
    pDoor.value.fLocked = TRUE;
    return TRUE;
  } else {
    return FALSE;
  }
}

function DoUnlockDoor(pDoor: Pointer<DOOR>, ubKeyID: UINT8): BOOLEAN {
  // if the door is locked and this is the right key, unlock the door and
  // return true, otherwise return false
  if ((pDoor.value.fLocked) && ValidKey(pDoor, ubKeyID)) {
    // Play lockpicking
    PlayJA2Sample((UNLOCK_DOOR_1), RATE_11025, SoundVolume(MIDVOLUME, pDoor.value.sGridNo), 1, SoundDir(pDoor.value.sGridNo));

    pDoor.value.fLocked = FALSE;
    return TRUE;
  } else {
    return FALSE;
  }
}

function AttemptToUnlockDoor(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  let ubLoop: UINT8;
  let ubKeyID: UINT8;

  for (ubLoop = 0; ubLoop < MAX_KEYS_PER_LOCK; ubLoop++) {
    ubKeyID = pDoor.value.ubLockID;
    if (KeyExistsInKeyRing(pSoldier, ubKeyID, NULL)) {
      // unlock door and move key to front of key ring!
      DoUnlockDoor(pDoor, ubKeyID);
      return TRUE;
    } else if (KeyExistsInInventory(pSoldier, ubKeyID)) {
      // unlock door!
      DoUnlockDoor(pDoor, ubKeyID);
      return TRUE;
    }
  }

  // drat, couldn't find the key
  PlayJA2Sample(KEY_FAILURE, RATE_11025, MIDVOLUME, 1, MIDDLEPAN);

  return FALSE;
}

function AttemptToLockDoor(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  let ubLoop: UINT8;
  let ubKeyID: UINT8;

  for (ubLoop = 0; ubLoop < MAX_KEYS_PER_LOCK; ubLoop++) {
    ubKeyID = pDoor.value.ubLockID;
    if (KeyExistsInKeyRing(pSoldier, ubKeyID, NULL)) {
      // lock door and move key to front of key ring!
      DoLockDoor(pDoor, ubKeyID);
      return TRUE;
    } else if (KeyExistsInInventory(pSoldier, ubKeyID)) {
      // lock door!
      DoLockDoor(pDoor, ubKeyID);
      return TRUE;
    }
  }
  // drat, couldn't find the key
  return FALSE;
}

function AttemptToCrowbarLock(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  let iResult: INT32;
  let bStress: INT8;
  let bSlot: INT8;

  bSlot = FindUsableObj(pSoldier, CROWBAR);
  if (bSlot == ITEM_NOT_FOUND) {
    // error!
    return FALSE;
  }

  // generate a noise for thumping on the door
  MakeNoise(pSoldier.value.ubID, pSoldier.value.sGridNo, pSoldier.value.bLevel, gpWorldLevelData[pSoldier.value.sGridNo].ubTerrainID, CROWBAR_DOOR_VOLUME, NOISE_DOOR_SMASHING);

  if (!pDoor.value.fLocked) {
    // auto success but no XP

    // succeeded! door can never be locked again, so remove from door list...
    RemoveDoorInfoFromTable(pDoor.value.sGridNo);
    // award experience points?

    // Play lock busted sound
    PlayJA2Sample((BREAK_LOCK), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));

    return TRUE;
  }

  if (pDoor.value.ubLockID == LOCK_UNOPENABLE) {
    // auto failure!
    return FALSE;
  }

  // possibly damage crowbar
  bStress = __min(EffectiveStrength(pSoldier), LockTable[pDoor.value.ubLockID].ubSmashDifficulty + 30);
  // reduce crowbar status by random % between 0 and 5%
  DamageObj(addressof(pSoldier.value.inv[bSlot]), PreRandom(bStress / 20));

  // did we succeed?

  if (LockTable[pDoor.value.ubLockID].ubSmashDifficulty == OPENING_NOT_POSSIBLE) {
    // do this to get 'can't do this' messages
    iResult = SkillCheck(pSoldier, OPEN_WITH_CROWBAR, (-100));
    iResult = -100;
  } else {
    iResult = SkillCheck(pSoldier, OPEN_WITH_CROWBAR, (-(LockTable[pDoor.value.ubLockID].ubSmashDifficulty - pDoor.value.bLockDamage)));
  }

  if (iResult > 0) {
    // STR GAIN (20) - Pried open a lock
    StatChange(pSoldier, STRAMT, 20, FALSE);

    // succeeded! door can never be locked again, so remove from door list...
    RemoveDoorInfoFromTable(pDoor.value.sGridNo);

    // Play lock busted sound
    PlayJA2Sample((BREAK_LOCK), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));

    return TRUE;
  } else {
    if (iResult > -10) {
      // STR GAIN - Damaged a lock by prying
      StatChange(pSoldier, STRAMT, 5, FALSE);

      // we came close... so do some damage to the lock
      pDoor.value.bLockDamage += (10 + iResult);
    } else if (iResult > -40 && pSoldier.value.sGridNo != pSoldier.value.sSkillCheckGridNo) {
      // give token point for effort :-)
      StatChange(pSoldier, STRAMT, 1, FALSE);
    }

    return FALSE;
  }
}

function AttemptToSmashDoor(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  let iResult: INT32;

  let pLock: Pointer<LOCK>;

  // generate a noise for thumping on the door
  MakeNoise(pSoldier.value.ubID, pSoldier.value.sGridNo, pSoldier.value.bLevel, gpWorldLevelData[pSoldier.value.sGridNo].ubTerrainID, SMASHING_DOOR_VOLUME, NOISE_DOOR_SMASHING);

  if (!pDoor.value.fLocked) {
    // auto success but no XP

    // succeeded! door can never be locked again, so remove from door list...
    RemoveDoorInfoFromTable(pDoor.value.sGridNo);
    // award experience points?

    // Play lock busted sound
    PlayJA2Sample((BREAK_LOCK), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));

    return TRUE;
  }

  if (pDoor.value.ubLockID == LOCK_UNOPENABLE) {
    // auto failure!
    return FALSE;
  }

  pLock = addressof(LockTable[pDoor.value.ubLockID]);

  // did we succeed?
  if (pLock.value.ubSmashDifficulty == OPENING_NOT_POSSIBLE) {
    // do this to get 'can't do this' messages
    iResult = SkillCheck(pSoldier, SMASH_DOOR_CHECK, (-100));
    iResult = -100;
  } else {
    iResult = SkillCheck(pSoldier, SMASH_DOOR_CHECK, (-(LockTable[pDoor.value.ubLockID].ubSmashDifficulty - pDoor.value.bLockDamage)));
  }
  if (iResult > 0) {
    // STR GAIN (20) - Pried open a lock
    StatChange(pSoldier, STRAMT, 20, FALSE);

    // succeeded! door can never be locked again, so remove from door list...
    RemoveDoorInfoFromTable(pDoor.value.sGridNo);
    // award experience points?

    // Play lock busted sound
    PlayJA2Sample((BREAK_LOCK), RATE_11025, SoundVolume(MIDVOLUME, pSoldier.value.sGridNo), 1, SoundDir(pSoldier.value.sGridNo));

    return TRUE;
  } else {
    if (iResult > -10) {
      // STR GAIN - Damaged a lock by prying
      StatChange(pSoldier, STRAMT, 5, FALSE);

      // we came close... so do some damage to the lock
      pDoor.value.bLockDamage += (10 + iResult);
    } else if (iResult > -40 && pSoldier.value.sGridNo != pSoldier.value.sSkillCheckGridNo) {
      // give token point for effort :-)
      StatChange(pSoldier, STRAMT, 1, FALSE);
    }
    return FALSE;
  }
}

function AttemptToPickLock(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  let iResult: INT32;
  let bReason: INT8;
  let pLock: Pointer<LOCK>;

  if (pDoor.value.ubLockID == LOCK_UNOPENABLE) {
    // auto failure!
    return FALSE;
  }

  pLock = addressof(LockTable[pDoor.value.ubLockID]);

  // look up the type of lock to see if it is electronic or not
  if (pLock.value.ubLockType == LOCK_CARD || pLock.value.ubLockType == LOCK_ELECTRONIC) {
    bReason = ELECTRONIC_LOCKPICKING_CHECK;
  } else {
    bReason = LOCKPICKING_CHECK;
  }

  // Play lockpicking
  // ATE: Moved to animation
  // PlayJA2Sample( ( (UINT8)PICKING_LOCK ), RATE_11025, SoundVolume( MIDVOLUME, pSoldier->sGridNo ), 1, SoundDir( pSoldier->sGridNo ) );

  // See if we measure up to the task.
  // The difficulty is negated here to make it a skill adjustment
  if (pLock.value.ubPickDifficulty == OPENING_NOT_POSSIBLE) {
    // do this to get 'can't do this' messages
    iResult = SkillCheck(pSoldier, bReason, (-100));
    iResult = -100;
  } else {
    iResult = SkillCheck(pSoldier, bReason, (-(pLock.value.ubPickDifficulty)));
  }
  if (iResult > 0) {
    // MECHANICAL GAIN:  Picked open a lock
    StatChange(pSoldier, MECHANAMT, (pLock.value.ubPickDifficulty / 5), FALSE);

    // DEXTERITY GAIN:  Picked open a lock
    StatChange(pSoldier, DEXTAMT, (pLock.value.ubPickDifficulty / 10), FALSE);

    // succeeded!
    pDoor.value.fLocked = FALSE;
    return TRUE;
  } else {
    // NOTE: failures are not rewarded, since you can keep trying indefinitely...

    // check for traps
    return FALSE;
  }
}

function AttemptToUntrapDoor(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  let iResult: INT32;

  // See if we measure up to the task.
  if (pDoor.value.ubTrapID == EXPLOSION) {
    iResult = SkillCheck(pSoldier, DISARM_TRAP_CHECK, (pDoor.value.ubTrapLevel * 7));
  } else {
    iResult = SkillCheck(pSoldier, DISARM_ELECTRONIC_TRAP_CHECK, (pDoor.value.ubTrapLevel * 7));
  }

  if (iResult > 0) {
    // succeeded!
    pDoor.value.ubTrapLevel = 0;
    pDoor.value.ubTrapID = NO_TRAP;
    return TRUE;
  } else {
    // trap should REALLY go off now!
    return FALSE;
  }
}

function ExamineDoorForTraps(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  // Check to see if there is a trap or not on this door
  let bDetectLevel: INT8;

  if (pDoor.value.ubTrapID == NO_TRAP) {
    // No trap!
    pDoor.value.bPerceivedTrapped = DOOR_PERCEIVED_UNTRAPPED;
  } else {
    if (pDoor.value.bPerceivedTrapped == DOOR_PERCEIVED_TRAPPED) {
      return TRUE;
    } else {
      bDetectLevel = CalcTrapDetectLevel(pSoldier, TRUE);
      if (bDetectLevel < pDoor.value.ubTrapLevel) {
        pDoor.value.bPerceivedTrapped = DOOR_PERCEIVED_UNTRAPPED;
      } else {
        pDoor.value.bPerceivedTrapped = DOOR_PERCEIVED_TRAPPED;
        return TRUE;
      }
    }
  }
  return FALSE;
}

function HasDoorTrapGoneOff(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  // Check to see if the soldier causes the trap to go off
  let bDetectLevel: INT8;

  if (pDoor.value.ubTrapID != NO_TRAP) {
    // one quick check to see if the guy sees the trap ahead of time!
    bDetectLevel = CalcTrapDetectLevel(pSoldier, FALSE);
    if (bDetectLevel < pDoor.value.ubTrapLevel) {
      // trap goes off!
      return TRUE;
    }
  }
  return FALSE;
}

function HandleDoorTrap(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): void {
  if (!(DoorTrapTable[pDoor.value.ubTrapID].fFlags & DOOR_TRAP_SILENT)) {
    switch (pDoor.value.ubTrapID) {
      case BROTHEL_SIREN:
        ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[LOCK_TRAP_HAS_GONE_OFF_STR], pDoorTrapStrings[SIREN]);
        break;
      case SUPER_ELECTRIC:
        ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[LOCK_TRAP_HAS_GONE_OFF_STR], pDoorTrapStrings[ELECTRIC]);
        break;
      default:
        ScreenMsg(MSG_FONT_YELLOW, MSG_INTERFACE, TacticalStr[LOCK_TRAP_HAS_GONE_OFF_STR], pDoorTrapStrings[pDoor.value.ubTrapID]);
        break;
    }
  }

  // set trap off
  switch (pDoor.value.ubTrapID) {
    case EXPLOSION:
      // cause damage as a regular hand grenade
      IgniteExplosion(NOBODY, CenterX(pSoldier.value.sGridNo), CenterY(pSoldier.value.sGridNo), 25, pSoldier.value.sGridNo, HAND_GRENADE, 0);
      break;

    case SIREN:
      // play siren sound effect but otherwise treat as silent alarm, calling
      // available enemies to this location
      PlayJA2Sample(KLAXON_ALARM, RATE_11025, SoundVolume(MIDVOLUME, pDoor.value.sGridNo), 5, SoundDir(pDoor.value.sGridNo));
    case SILENT_ALARM:
      // Get all available enemies running here
      CallAvailableEnemiesTo(pDoor.value.sGridNo);
      break;

    case BROTHEL_SIREN:
      PlayJA2Sample(KLAXON_ALARM, RATE_11025, SoundVolume(MIDVOLUME, pDoor.value.sGridNo), 5, SoundDir(pDoor.value.sGridNo));
      CallAvailableKingpinMenTo(pDoor.value.sGridNo);
      // no one is authorized any more!
      gMercProfiles[MADAME].bNPCData = 0;
      break;

    case ELECTRIC:
      // insert electrical sound effect here
      PlayJA2Sample(DOOR_ELECTRICITY, RATE_11025, SoundVolume(MIDVOLUME, pDoor.value.sGridNo), 1, SoundDir(pDoor.value.sGridNo));

      // Set attacker's ID
      pSoldier.value.ubAttackerID = pSoldier.value.ubID;
      // Increment  being attacked count
      pSoldier.value.bBeingAttackedCount++;
      gTacticalStatus.ubAttackBusyCount++;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Trap gone off %d", gTacticalStatus.ubAttackBusyCount));

      SoldierTakeDamage(pSoldier, 0, (10 + PreRandom(10)), ((3 + PreRandom(3) * 1000)), TAKE_DAMAGE_ELECTRICITY, NOBODY, pDoor.value.sGridNo, 0, TRUE);
      break;

    case SUPER_ELECTRIC:
      // insert electrical sound effect here
      PlayJA2Sample(DOOR_ELECTRICITY, RATE_11025, SoundVolume(MIDVOLUME, pDoor.value.sGridNo), 1, SoundDir(pDoor.value.sGridNo));

      // Set attacker's ID
      pSoldier.value.ubAttackerID = pSoldier.value.ubID;
      // Increment  being attacked count
      pSoldier.value.bBeingAttackedCount++;
      gTacticalStatus.ubAttackBusyCount++;
      DebugMsg(TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Trap gone off %d", gTacticalStatus.ubAttackBusyCount));

      SoldierTakeDamage(pSoldier, 0, (20 + PreRandom(20)), ((6 + PreRandom(6) * 1000)), TAKE_DAMAGE_ELECTRICITY, NOBODY, pDoor.value.sGridNo, 0, TRUE);
      break;

    default:
      // no trap
      break;
  }
}

function AttemptToBlowUpLock(pSoldier: Pointer<SOLDIERTYPE>, pDoor: Pointer<DOOR>): BOOLEAN {
  let iResult: INT32;
  let bSlot: INT8 = NO_SLOT;

  bSlot = FindObj(pSoldier, SHAPED_CHARGE);
  if (bSlot == NO_SLOT) {
    return FALSE;
  }

  iResult = SkillCheck(pSoldier, PLANTING_BOMB_CHECK, 0);
  if (iResult >= -20) {
    // Do explosive graphic....
    {
      let AniParams: ANITILE_PARAMS;
      let sGridNo: INT16;
      let sX: INT16;
      let sY: INT16;
      let sZ: INT16;

      // Get gridno
      sGridNo = pDoor.value.sGridNo;

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

      strcpy(AniParams.zCachedFile, "TILECACHE\\MINIBOOM.STI");

      CreateAnimationTile(addressof(AniParams));

      PlayJA2Sample(SMALL_EXPLODE_1, RATE_11025, SoundVolume(HIGHVOLUME, sGridNo), 1, SoundDir(sGridNo));

      // Remove the explosive.....
      bSlot = FindObj(pSoldier, SHAPED_CHARGE);
      if (bSlot != NO_SLOT) {
        RemoveObjs(addressof(pSoldier.value.inv[bSlot]), 1);
        DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
      }
    }

    // Not sure if this makes sense, but the explosive is small.
    // Double the damage here as we are damaging a lock rather than a person
    pDoor.value.bLockDamage += Explosive[Item[SHAPED_CHARGE].ubClassIndex].ubDamage * 2;
    if (pDoor.value.bLockDamage > LockTable[pDoor.value.ubLockID].ubSmashDifficulty) {
      // succeeded! door can never be locked again, so remove from door list...
      RemoveDoorInfoFromTable(pDoor.value.sGridNo);
      // award experience points?
      return TRUE;
    }
  } else {
    bSlot = FindObj(pSoldier, SHAPED_CHARGE);
    if (bSlot != NO_SLOT) {
      RemoveObjs(addressof(pSoldier.value.inv[bSlot]), 1);
      DirtyMercPanelInterface(pSoldier, DIRTYLEVEL2);
    }

    // OOPS! ... BOOM!
    IgniteExplosion(NOBODY, pSoldier.value.sX, pSoldier.value.sY, (gpWorldLevelData[pSoldier.value.sGridNo].sHeight), pSoldier.value.sGridNo, SHAPED_CHARGE, 0);
  }
  return FALSE;
}

// File I/O for loading the door information from the map.  This automatically allocates
// the exact number of slots when loading.
function LoadDoorTableFromMap(hBuffer: Pointer<Pointer<INT8>>): void {
  let cnt: INT32;

  TrashDoorTable();
  LOADDATA(addressof(gubNumDoors), hBuffer.value, 1);

  gubMaxDoors = gubNumDoors;
  DoorTable = MemAlloc(sizeof(DOOR) * gubMaxDoors);

  LOADDATA(DoorTable, hBuffer.value, sizeof(DOOR) * gubMaxDoors);

  // OK, reset perceived values to nothing...
  for (cnt = 0; cnt < gubNumDoors; cnt++) {
    DoorTable[cnt].bPerceivedLocked = DOOR_PERCEIVED_UNKNOWN;
    DoorTable[cnt].bPerceivedTrapped = DOOR_PERCEIVED_UNKNOWN;
  }
}

// Saves the existing door information to the map.  Before it actually saves, it'll verify that the
// door still exists.  Otherwise, it'll ignore it.  It is possible in the editor to delete doors in
// many different ways, so I opted to put it in the saving routine.
function SaveDoorTableToMap(fp: HWFILE): void {
  let i: INT32 = 0;
  let uiBytesWritten: UINT32;

  while (i < gubNumDoors) {
    if (!OpenableAtGridNo(DoorTable[i].sGridNo))
      RemoveDoorInfoFromTable(DoorTable[i].sGridNo);
    else
      i++;
  }
  FileWrite(fp, addressof(gubNumDoors), 1, addressof(uiBytesWritten));
  FileWrite(fp, DoorTable, sizeof(DOOR) * gubNumDoors, addressof(uiBytesWritten));
}

// The editor adds locks to the world.  If the gridno already exists, then the currently existing door
// information is overwritten.
function AddDoorInfoToTable(pDoor: Pointer<DOOR>): void {
  let i: INT32;
  for (i = 0; i < gubNumDoors; i++) {
    if (DoorTable[i].sGridNo == pDoor.value.sGridNo) {
      memcpy(addressof(DoorTable[i]), pDoor, sizeof(DOOR));
      return;
    }
  }
  // no existing door found, so add a new one.
  if (gubNumDoors < gubMaxDoors) {
    memcpy(addressof(DoorTable[gubNumDoors]), pDoor, sizeof(DOOR));
    gubNumDoors++;
  } else {
    // we need to allocate more memory, so add ten more slots.
    let NewDoorTable: Pointer<DOOR>;
    gubMaxDoors += 10;
    // Allocate new table with max+10 doors.
    NewDoorTable = MemAlloc(sizeof(DOOR) * gubMaxDoors);
    // Copy contents of existing door table to new door table.
    memcpy(NewDoorTable, DoorTable, sizeof(DOOR) * gubNumDoors);
    // Deallocate the existing door table (possible to not have one).
    if (DoorTable)
      MemFree(DoorTable);
    // Assign the new door table as the existing door table
    DoorTable = NewDoorTable;
    // Add the new door info to the table.
    memcpy(addressof(DoorTable[gubNumDoors]), pDoor, sizeof(DOOR));
    gubNumDoors++;
  }
}

// When the editor removes a door from the world, this function looks for and removes accompanying door
// information.  If the entry is not the last entry, the last entry is move to it's current slot, to keep
// everything contiguous.
function RemoveDoorInfoFromTable(iMapIndex: INT32): void {
  let i: INT32;
  let iNumDoorsToCopy: INT32;
  for (i = 0; i < gubNumDoors; i++) {
    if (DoorTable[i].sGridNo == iMapIndex) {
      iNumDoorsToCopy = gubNumDoors - i - 1;
      if (iNumDoorsToCopy) {
        memmove(addressof(DoorTable[i]), addressof(DoorTable[i + 1]), sizeof(DOOR) * iNumDoorsToCopy);
      }
      gubNumDoors--;
      return;
    }
  }
}

// This is the link to see if a door exists at a gridno.
function FindDoorInfoAtGridNo(iMapIndex: INT32): Pointer<DOOR> {
  let i: INT32;
  for (i = 0; i < gubNumDoors; i++) {
    if (DoorTable[i].sGridNo == iMapIndex)
      return addressof(DoorTable[i]);
  }
  return NULL;
}

// Upon world deallocation, the door table needs to be deallocated.  Remember, this function
// resets the values, so make sure you do this before you change gubNumDoors or gubMaxDoors.
function TrashDoorTable(): void {
  if (DoorTable)
    MemFree(DoorTable);
  DoorTable = NULL;
  gubNumDoors = 0;
  gubMaxDoors = 0;
}

function UpdateDoorPerceivedValue(pDoor: Pointer<DOOR>): void {
  if (pDoor.value.fLocked) {
    pDoor.value.bPerceivedLocked = DOOR_PERCEIVED_LOCKED;
  } else if (!pDoor.value.fLocked) {
    pDoor.value.bPerceivedLocked = DOOR_PERCEIVED_UNLOCKED;
  }

  if (pDoor.value.ubTrapID != NO_TRAP) {
    pDoor.value.bPerceivedTrapped = DOOR_PERCEIVED_TRAPPED;
  } else {
    pDoor.value.bPerceivedTrapped = DOOR_PERCEIVED_UNTRAPPED;
  }
}

function SaveDoorTableToDoorTableTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): BOOLEAN {
  let uiNumBytesWritten: UINT32;
  let uiSizeToSave: UINT32 = 0;
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;

  //	return( TRUE );

  uiSizeToSave = gubNumDoors * sizeof(DOOR);

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'd' for 'Door' to the front of the map name
  //	sprintf( zMapName, "%s\\d_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_DOOR_TABLE_TEMP_FILES_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

  // if the file already exists, delete it
  if (FileExists(zMapName)) {
    // We are going to be overwriting the file
    if (!FileDelete(zMapName)) {
      return FALSE;
    }
  }

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
  if (hFile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // Save the number of doors
  FileWrite(hFile, addressof(gubNumDoors), sizeof(UINT8), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT8)) {
    FileClose(hFile);
    return FALSE;
  }

  // if there are doors to save
  if (uiSizeToSave != 0) {
    // Save the door table
    FileWrite(hFile, DoorTable, uiSizeToSave, addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != uiSizeToSave) {
      FileClose(hFile);
      return FALSE;
    }
  }

  // Set the sector flag indicating that there is a Door table temp file present
  SetSectorFlag(gWorldSectorX, gWorldSectorY, gbWorldSectorZ, SF_DOOR_TABLE_TEMP_FILES_EXISTS);

  FileClose(hFile);

  return TRUE;
}

function LoadDoorTableFromDoorTableTempFile(): BOOLEAN {
  let uiNumBytesRead: UINT32;
  let hFile: HWFILE;
  let zMapName: CHAR8[] /* [128] */;

  //	return( TRUE );

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'd' for 'Door' to the front of the map name
  //	sprintf( zMapName, "%s\\d_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_DOOR_TABLE_TEMP_FILES_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Check to see if the file exists
  if (!FileExists(zMapName)) {
    // If the file doesnt exists, its no problem.
    return TRUE;
  }

  // Get rid of the existing door table
  TrashDoorTable();

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hFile == 0) {
    // Error opening map modification file,
    return FALSE;
  }

  // Read in the number of doors
  FileRead(hFile, addressof(gubMaxDoors), sizeof(UINT8), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT8)) {
    FileClose(hFile);
    return FALSE;
  }

  gubNumDoors = gubMaxDoors;

  // if there is no doors to load
  if (gubNumDoors != 0) {
    // Allocate space for the door table
    DoorTable = MemAlloc(sizeof(DOOR) * gubMaxDoors);
    if (DoorTable == NULL) {
      FileClose(hFile);
      return FALSE;
    }

    // Read in the number of doors
    FileRead(hFile, DoorTable, sizeof(DOOR) * gubMaxDoors, addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(DOOR) * gubMaxDoors) {
      FileClose(hFile);
      return FALSE;
    }
  }

  FileClose(hFile);

  return TRUE;
}

// fOpen is True if the door is open, false if it is closed
function ModifyDoorStatus(sGridNo: INT16, fOpen: BOOLEAN, fPerceivedOpen: BOOLEAN): BOOLEAN {
  let ubCnt: UINT8;
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;

  // Set the gridno for the door

  // Find the base tile for the door structure and use that gridno
  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
  } else {
    pBaseStructure = NULL;
  }

  if (pBaseStructure == NULL) {
    return FALSE;
  }

  // if there is an array
  if (gpDoorStatus) {
    // Check to see if the user is adding an existing door
    for (ubCnt = 0; ubCnt < gubNumDoorStatus; ubCnt++) {
      // if the door is already in the array
      if (gpDoorStatus[ubCnt].sGridNo == pBaseStructure.value.sGridNo) {
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
        return TRUE;
      }
    }
  }

  // add a new door status structure

  // if there is an array
  if (gpDoorStatus) {
    // Increment the number of doors
    gubNumDoorStatus++;

    // reallocate memory to hold the new door
    gpDoorStatus = MemRealloc(gpDoorStatus, sizeof(DOOR_STATUS) * gubNumDoorStatus);
    if (gpDoorStatus == NULL)
      return FALSE;
  } else {
    // Set the initial number of doors
    gubNumDoorStatus = 1;

    gpDoorStatus = MemAlloc(sizeof(DOOR_STATUS));
    if (gpDoorStatus == NULL)
      return FALSE;
  }

  gpDoorStatus[gubNumDoorStatus - 1].sGridNo = pBaseStructure.value.sGridNo;

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
  gpWorldLevelData[pBaseStructure.value.sGridNo].ubExtFlags[0] |= MAPELEMENT_EXT_DOOR_STATUS_PRESENT;

  return TRUE;
}

function TrashDoorStatusArray(): void {
  if (gpDoorStatus) {
    MemFree(gpDoorStatus);
    gpDoorStatus = NULL;
  }

  gubNumDoorStatus = 0;
}

function IsDoorOpen(sGridNo: INT16): BOOLEAN {
  let ubCnt: UINT8;
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;

  // Find the base tile for the door structure and use that gridno
  pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
  } else {
    pBaseStructure = NULL;
  }

  if (pBaseStructure == NULL) {
    return FALSE;
  }

  // if there is an array
  if (gpDoorStatus) {
    // Check to see if the user is adding an existing door
    for (ubCnt = 0; ubCnt < gubNumDoorStatus; ubCnt++) {
      // if this is the door
      if (gpDoorStatus[ubCnt].sGridNo == pBaseStructure.value.sGridNo) {
        if (gpDoorStatus[ubCnt].ubFlags & DOOR_OPEN)
          return TRUE;
        else
          return FALSE;
      }
    }
  }

  return FALSE;
}

// Returns a doors status value, NULL if not found
function GetDoorStatus(sGridNo: INT16): Pointer<DOOR_STATUS> {
  let ubCnt: UINT8;
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;

  // if there is an array
  if (gpDoorStatus) {
    // Find the base tile for the door structure and use that gridno
    pStructure = FindStructure(sGridNo, STRUCTURE_ANYDOOR);
    if (pStructure) {
      pBaseStructure = FindBaseStructure(pStructure);
    } else {
      pBaseStructure = NULL;
    }

    if (pBaseStructure == NULL) {
      return NULL;
    }

    // Check to see if the user is adding an existing door
    for (ubCnt = 0; ubCnt < gubNumDoorStatus; ubCnt++) {
      // if this is the door
      if (gpDoorStatus[ubCnt].sGridNo == pBaseStructure.value.sGridNo) {
        return addressof(gpDoorStatus[ubCnt]);
      }
    }
  }

  return NULL;
}

function AllMercsLookForDoor(sGridNo: INT16, fUpdateValue: BOOLEAN): BOOLEAN {
  let cnt: INT32;
  let cnt2: INT32;
  let bDirs: INT8[] /* [8] */ = [
    NORTH,
    SOUTH,
    EAST,
    WEST,
    NORTHEAST,
    NORTHWEST,
    SOUTHEAST,
    SOUTHWEST,
  ];
  let pSoldier: Pointer<SOLDIERTYPE>;
  let sDistVisible: INT16;
  let pDoorStatus: Pointer<DOOR_STATUS>;
  let usNewGridNo: INT16;

  // Get door
  pDoorStatus = GetDoorStatus(sGridNo);

  if (pDoorStatus == NULL) {
    return FALSE;
  }

  // IF IT'S THE SELECTED GUY, MAKE ANOTHER SELECTED!
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // look for all mercs on the same team,
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    // ATE: Ok, lets check for some basic things here!
    if (pSoldier.value.bLife >= OKLIFE && pSoldier.value.sGridNo != NOWHERE && pSoldier.value.bActive && pSoldier.value.bInSector) {
      // is he close enough to see that gridno if he turns his head?
      sDistVisible = DistanceVisible(pSoldier, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, sGridNo, 0);

      if (PythSpacesAway(pSoldier.value.sGridNo, sGridNo) <= sDistVisible) {
        // and we can trace a line of sight to his x,y coordinates?
        // (taking into account we are definitely aware of this guy now)
        if (SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, 0, 0, sDistVisible, TRUE)) {
          // Update status...
          if (fUpdateValue) {
            InternalUpdateDoorsPerceivedValue(pDoorStatus);
          }
          return TRUE;
        }
      }

      // Now try other adjacent gridnos...
      for (cnt2 = 0; cnt2 < 8; cnt2++) {
        usNewGridNo = NewGridNo(sGridNo, DirectionInc(bDirs[cnt2]));
        sDistVisible = DistanceVisible(pSoldier, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, usNewGridNo, 0);

        if (PythSpacesAway(pSoldier.value.sGridNo, usNewGridNo) <= sDistVisible) {
          // and we can trace a line of sight to his x,y coordinates?
          // (taking into account we are definitely aware of this guy now)
          if (SoldierTo3DLocationLineOfSightTest(pSoldier, usNewGridNo, 0, 0, sDistVisible, TRUE)) {
            // Update status...
            if (fUpdateValue) {
              InternalUpdateDoorsPerceivedValue(pDoorStatus);
            }
            return TRUE;
          }
        }
      }
    }
  }

  return FALSE;
}

function MercLooksForDoors(pSoldier: Pointer<SOLDIERTYPE>, fUpdateValue: BOOLEAN): BOOLEAN {
  let cnt: INT32;
  let cnt2: INT32;
  let sDistVisible: INT16;
  let sGridNo: INT16;
  let pDoorStatus: Pointer<DOOR_STATUS>;
  let bDirs: INT8[] /* [8] */ = [
    NORTH,
    SOUTH,
    EAST,
    WEST,
    NORTHEAST,
    NORTHWEST,
    SOUTHEAST,
    SOUTHWEST,
  ];
  let usNewGridNo: INT16;

  // Loop through all corpses....
  for (cnt = 0; cnt < gubNumDoorStatus; cnt++) {
    pDoorStatus = addressof(gpDoorStatus[cnt]);

    if (!InternalIsPerceivedDifferentThanReality(pDoorStatus)) {
      continue;
    }

    sGridNo = pDoorStatus.value.sGridNo;

    // is he close enough to see that gridno if he turns his head?
    sDistVisible = DistanceVisible(pSoldier, DIRECTION_IRRELEVANT, DIRECTION_IRRELEVANT, sGridNo, 0);

    if (PythSpacesAway(pSoldier.value.sGridNo, sGridNo) <= sDistVisible) {
      // and we can trace a line of sight to his x,y coordinates?
      // (taking into account we are definitely aware of this guy now)
      if (SoldierTo3DLocationLineOfSightTest(pSoldier, sGridNo, 0, 0, sDistVisible, TRUE)) {
        // OK, here... update perceived value....
        if (fUpdateValue) {
          InternalUpdateDoorsPerceivedValue(pDoorStatus);

          // Update graphic....
          InternalUpdateDoorGraphicFromStatus(pDoorStatus, TRUE, TRUE);
        }
        return TRUE;
      }
    }

    // Now try other adjacent gridnos...
    for (cnt2 = 0; cnt2 < 8; cnt2++) {
      usNewGridNo = NewGridNo(sGridNo, DirectionInc(bDirs[cnt2]));

      if (PythSpacesAway(pSoldier.value.sGridNo, usNewGridNo) <= sDistVisible) {
        // and we can trace a line of sight to his x,y coordinates?
        // (taking into account we are definitely aware of this guy now)
        if (SoldierTo3DLocationLineOfSightTest(pSoldier, usNewGridNo, 0, 0, sDistVisible, TRUE)) {
          // Update status...
          if (fUpdateValue) {
            InternalUpdateDoorsPerceivedValue(pDoorStatus);

            // Update graphic....
            InternalUpdateDoorGraphicFromStatus(pDoorStatus, TRUE, TRUE);
          }
          return TRUE;
        }
      }
    }
  }

  return FALSE;
}

function SyncronizeDoorStatusToStructureData(pDoorStatus: Pointer<DOOR_STATUS>): void {
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let pNode: Pointer<LEVELNODE>;
  let sBaseGridNo: INT16 = NOWHERE;

  // First look for a door structure here...
  pStructure = FindStructure(pDoorStatus.value.sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
    sBaseGridNo = pBaseStructure.value.sGridNo;
  } else {
    pBaseStructure = NULL;
  }

  if (pBaseStructure == NULL) {
    return;
  }

  pNode = FindLevelNodeBasedOnStructure(sBaseGridNo, pBaseStructure);
  if (!pNode) {
    return;
  }

  // ATE: OK let me explain something here:
  // One of the purposes of this function is to MAKE sure the door status MATCHES
  // the struct data value - if not - change ( REGARDLESS of perceived being used or not... )
  //
  // Check for opened...
  if (pDoorStatus.value.ubFlags & DOOR_OPEN) {
    // IF closed.....
    if (!(pStructure.value.fFlags & STRUCTURE_OPEN)) {
      // Swap!
      SwapStructureForPartner(sBaseGridNo, pBaseStructure);
      RecompileLocalMovementCosts(sBaseGridNo);
    }
  } else {
    if ((pStructure.value.fFlags & STRUCTURE_OPEN)) {
      // Swap!
      SwapStructureForPartner(sBaseGridNo, pBaseStructure);
      RecompileLocalMovementCosts(sBaseGridNo);
    }
  }
}

function UpdateDoorGraphicsFromStatus(fUsePerceivedStatus: BOOLEAN, fDirty: BOOLEAN): void {
  let cnt: INT32;
  let pDoorStatus: Pointer<DOOR_STATUS>;

  for (cnt = 0; cnt < gubNumDoorStatus; cnt++) {
    pDoorStatus = addressof(gpDoorStatus[cnt]);

    // ATE: Make sure door status flag and struct info are syncronized....
    SyncronizeDoorStatusToStructureData(pDoorStatus);

    InternalUpdateDoorGraphicFromStatus(pDoorStatus, fUsePerceivedStatus, fDirty);
  }
}

function InternalUpdateDoorGraphicFromStatus(pDoorStatus: Pointer<DOOR_STATUS>, fUsePerceivedStatus: BOOLEAN, fDirty: BOOLEAN): void {
  let pStructure: Pointer<STRUCTURE>;
  let pBaseStructure: Pointer<STRUCTURE>;
  let cnt: INT32;
  let fOpenedGraphic: BOOLEAN = FALSE;
  let pNode: Pointer<LEVELNODE>;
  let fWantToBeOpen: BOOLEAN = FALSE;
  let fDifferent: BOOLEAN = FALSE;
  let sBaseGridNo: INT16 = NOWHERE;

  // OK, look at perceived status and adjust graphic
  // First look for a door structure here...
  pStructure = FindStructure(pDoorStatus.value.sGridNo, STRUCTURE_ANYDOOR);

  if (pStructure) {
    pBaseStructure = FindBaseStructure(pStructure);
    sBaseGridNo = pBaseStructure.value.sGridNo;
  } else {
    pBaseStructure = NULL;
  }

  if (pBaseStructure == NULL) {
    return;
  }

  pNode = FindLevelNodeBasedOnStructure(sBaseGridNo, pBaseStructure);
  if (!pNode) {
    return;
  }

  // Get status we want to chenge to.....
  if (fUsePerceivedStatus) {
    if (pDoorStatus.value.ubFlags & DOOR_PERCEIVED_OPEN) {
      fWantToBeOpen = TRUE;
    }
  } else {
    if (pDoorStatus.value.ubFlags & DOOR_OPEN) {
      fWantToBeOpen = TRUE;
    }
  }

  // First look for an opened door
  // get what it is now...
  cnt = 0;
  while (gClosedDoorList[cnt] != -1) {
    // IF WE ARE A SHADOW TYPE
    if (pNode.value.usIndex == gClosedDoorList[cnt]) {
      fOpenedGraphic = TRUE;
      break;
    }
    cnt++;
  };

  // OK, we either have an opened graphic, in which case we want to switch to the closed, or a closed
  // in which case we want to switch to opened...
  // adjust o' graphic

  // OK, we now need to test these things against the true structure data
  // we may need to only adjust the graphic here....
  if (fWantToBeOpen && (pStructure.value.fFlags & STRUCTURE_OPEN)) {
    let fFound: BOOLEAN = FALSE;
    // Adjust graphic....

    // Loop through and and find opened graphic for the closed one....
    cnt = 0;
    while (gOpenDoorList[cnt] != -1) {
      // IF WE ARE A SHADOW TYPE
      if (pNode.value.usIndex == gOpenDoorList[cnt]) {
        fFound = TRUE;
        break;
      }
      cnt++;
    };

    // OK, now use opened graphic.
    if (fFound) {
      pNode.value.usIndex = gClosedDoorList[cnt];

      if (fDirty) {
        InvalidateWorldRedundency();
        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }

    return;
  }

  // If we want to be closed but structure is closed
  if (!fWantToBeOpen && !(pStructure.value.fFlags & STRUCTURE_OPEN)) {
    let fFound: BOOLEAN = FALSE;
    // Adjust graphic....

    // Loop through and and find closed graphic for the opend one....
    cnt = 0;
    while (gClosedDoorList[cnt] != -1) {
      // IF WE ARE A SHADOW TYPE
      if (pNode.value.usIndex == gClosedDoorList[cnt]) {
        fFound = TRUE;
        break;
      }
      cnt++;
    };

    // OK, now use opened graphic.
    if (fFound) {
      pNode.value.usIndex = gOpenDoorList[cnt];

      if (fDirty) {
        InvalidateWorldRedundency();
        SetRenderFlags(RENDER_FLAG_FULL);
      }
    }

    return;
  }

  if (fOpenedGraphic && !fWantToBeOpen) {
    // Close the beast!
    fDifferent = TRUE;
    pNode.value.usIndex = gOpenDoorList[cnt];
  } else if (!fOpenedGraphic && fWantToBeOpen) {
    // Find the closed door graphic and adjust....
    cnt = 0;
    while (gOpenDoorList[cnt] != -1) {
      // IF WE ARE A SHADOW TYPE
      if (pNode.value.usIndex == gOpenDoorList[cnt]) {
        // Open the beast!
        fDifferent = TRUE;
        pNode.value.usIndex = gClosedDoorList[cnt];
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

function InternalIsPerceivedDifferentThanReality(pDoorStatus: Pointer<DOOR_STATUS>): BOOLEAN {
  if ((pDoorStatus.value.ubFlags & DOOR_PERCEIVED_NOTSET)) {
    return TRUE;
  }

  // Compare flags....
  if ((pDoorStatus.value.ubFlags & DOOR_OPEN && pDoorStatus.value.ubFlags & DOOR_PERCEIVED_OPEN) || (!(pDoorStatus.value.ubFlags & DOOR_OPEN) && !(pDoorStatus.value.ubFlags & DOOR_PERCEIVED_OPEN))) {
    return FALSE;
  }

  return TRUE;
}

function InternalUpdateDoorsPerceivedValue(pDoorStatus: Pointer<DOOR_STATUS>): void {
  // OK, look at door, set perceived value the same as actual....
  if (pDoorStatus.value.ubFlags & DOOR_OPEN) {
    InternalSetDoorPerceivedOpenStatus(pDoorStatus, TRUE);
  } else {
    InternalSetDoorPerceivedOpenStatus(pDoorStatus, FALSE);
  }
}

function UpdateDoorStatusPerceivedValue(sGridNo: INT16): BOOLEAN {
  let pDoorStatus: Pointer<DOOR_STATUS> = NULL;

  pDoorStatus = GetDoorStatus(sGridNo);
  CHECKF(pDoorStatus != NULL);

  InternalUpdateDoorsPerceivedValue(pDoorStatus);

  return TRUE;
}

function IsDoorPerceivedOpen(sGridNo: INT16): BOOLEAN {
  let pDoorStatus: Pointer<DOOR_STATUS>;

  pDoorStatus = GetDoorStatus(sGridNo);

  if (pDoorStatus && pDoorStatus.value.ubFlags & DOOR_PERCEIVED_OPEN) {
    return TRUE;
  } else {
    return FALSE;
  }
}

function InternalSetDoorPerceivedOpenStatus(pDoorStatus: Pointer<DOOR_STATUS>, fPerceivedOpen: BOOLEAN): BOOLEAN {
  if (fPerceivedOpen)
    pDoorStatus.value.ubFlags |= DOOR_PERCEIVED_OPEN;
  else
    pDoorStatus.value.ubFlags &= ~DOOR_PERCEIVED_OPEN;

  // Turn off perceived not set flag....
  pDoorStatus.value.ubFlags &= ~DOOR_PERCEIVED_NOTSET;

  return TRUE;
}

function SetDoorPerceivedOpenStatus(sGridNo: INT16, fPerceivedOpen: BOOLEAN): BOOLEAN {
  let pDoorStatus: Pointer<DOOR_STATUS> = NULL;

  pDoorStatus = GetDoorStatus(sGridNo);

  CHECKF(pDoorStatus != NULL);

  return InternalSetDoorPerceivedOpenStatus(pDoorStatus, fPerceivedOpen);
}

function SetDoorOpenStatus(sGridNo: INT16, fOpen: BOOLEAN): BOOLEAN {
  let pDoorStatus: Pointer<DOOR_STATUS>;

  pDoorStatus = GetDoorStatus(sGridNo);

  if (pDoorStatus) {
    if (fOpen) {
      pDoorStatus.value.ubFlags |= DOOR_OPEN;
    } else {
      pDoorStatus.value.ubFlags &= ~DOOR_OPEN;
    }
    return TRUE;
  } else {
    return FALSE;
  }
}

function SaveDoorStatusArrayToDoorStatusTempFile(sSectorX: INT16, sSectorY: INT16, bSectorZ: INT8): BOOLEAN {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesWritten: UINT32;
  let ubCnt: UINT8;

  // Turn off any DOOR BUSY flags....
  for (ubCnt = 0; ubCnt < gubNumDoorStatus; ubCnt++) {
    gpDoorStatus[ubCnt].ubFlags &= (~DOOR_BUSY);
  }

  // Convert the current sector location into a file name
  //	GetMapFileName( sSectorX, sSectorY, bSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\ds_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_DOOR_STATUS_TEMP_FILE_EXISTS, zMapName, sSectorX, sSectorY, bSectorZ);

  // Open the file for writing, Create it if it doesnt exist
  hFile = FileOpen(zMapName, FILE_ACCESS_WRITE | FILE_OPEN_ALWAYS, FALSE);
  if (hFile == 0) {
    // Error opening map modification file
    return FALSE;
  }

  // Save the number of elements in the door array
  FileWrite(hFile, addressof(gubNumDoorStatus), sizeof(UINT8), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT8)) {
    // Error Writing size of array to disk
    FileClose(hFile);
    return FALSE;
  }

  // if there is some to save
  if (gubNumDoorStatus != 0) {
    // Save the door array
    FileWrite(hFile, gpDoorStatus, (sizeof(DOOR_STATUS) * gubNumDoorStatus), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != (sizeof(DOOR_STATUS) * gubNumDoorStatus)) {
      // Error Writing size of array to disk
      FileClose(hFile);
      return FALSE;
    }
  }

  FileClose(hFile);

  // Set the flag indicating that there is a door status array
  SetSectorFlag(sSectorX, sSectorY, bSectorZ, SF_DOOR_STATUS_TEMP_FILE_EXISTS);

  return TRUE;
}

function LoadDoorStatusArrayFromDoorStatusTempFile(): BOOLEAN {
  let zMapName: CHAR8[] /* [128] */;
  let hFile: HWFILE;
  let uiNumBytesRead: UINT32;
  let ubLoop: UINT8;

  // Convert the current sector location into a file name
  //	GetMapFileName( gWorldSectorX, gWorldSectorY, gbWorldSectorZ, zTempName, FALSE );

  // add the 'm' for 'Modifed Map' to the front of the map name
  //	sprintf( zMapName, "%s\\ds_%s", MAPS_DIR, zTempName);

  GetMapTempFileName(SF_DOOR_STATUS_TEMP_FILE_EXISTS, zMapName, gWorldSectorX, gWorldSectorY, gbWorldSectorZ);

  // Get rid of the existing door array
  TrashDoorStatusArray();

  // Open the file for reading
  hFile = FileOpen(zMapName, FILE_ACCESS_READ | FILE_OPEN_EXISTING, FALSE);
  if (hFile == 0) {
    // Error opening map modification file,
    return FALSE;
  }

  // Load the number of elements in the door status array
  FileRead(hFile, addressof(gubNumDoorStatus), sizeof(UINT8), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT8)) {
    FileClose(hFile);
    return FALSE;
  }

  if (gubNumDoorStatus == 0) {
    FileClose(hFile);
    return TRUE;
  }

  // Allocate space for the door status array
  gpDoorStatus = MemAlloc(sizeof(DOOR_STATUS) * gubNumDoorStatus);
  if (gpDoorStatus == NULL)
    AssertMsg(0, "Error Allocating memory for the gpDoorStatus");
  memset(gpDoorStatus, 0, sizeof(DOOR_STATUS) * gubNumDoorStatus);

  // Load the number of elements in the door status array
  FileRead(hFile, gpDoorStatus, (sizeof(DOOR_STATUS) * gubNumDoorStatus), addressof(uiNumBytesRead));
  if (uiNumBytesRead != (sizeof(DOOR_STATUS) * gubNumDoorStatus)) {
    FileClose(hFile);
    return FALSE;
  }

  FileClose(hFile);

  // the graphics will be updated later in the loading process.

  // set flags in map for containing a door status
  for (ubLoop = 0; ubLoop < gubNumDoorStatus; ubLoop++) {
    gpWorldLevelData[gpDoorStatus[ubLoop].sGridNo].ubExtFlags[0] |= MAPELEMENT_EXT_DOOR_STATUS_PRESENT;
  }

  UpdateDoorGraphicsFromStatus(TRUE, FALSE);

  return TRUE;
}

function SaveKeyTableToSaveGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesWritten: UINT32 = 0;

  // Save the KeyTable
  FileWrite(hFile, KeyTable, sizeof(KEY) * NUM_KEYS, addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(KEY) * NUM_KEYS) {
    return FALSE;
  }

  return TRUE;
}

function LoadKeyTableFromSaveedGameFile(hFile: HWFILE): BOOLEAN {
  let uiNumBytesRead: UINT32 = 0;

  // Load the KeyTable
  FileRead(hFile, KeyTable, sizeof(KEY) * NUM_KEYS, addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(KEY) * NUM_KEYS) {
    return FALSE;
  }

  return TRUE;
}

function ExamineDoorsOnEnteringSector(): void {
  let cnt: INT32;
  let pDoorStatus: Pointer<DOOR_STATUS>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fOK: BOOLEAN = FALSE;
  let bTownId: INT8;

  // OK, only do this if conditions are met....
  // If this is any omerta tow, don't do it...
  bTownId = GetTownIdForSector(gWorldSectorX, gWorldSectorY);

  if (bTownId == OMERTA) {
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
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[LAST_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive) {
      if (pSoldier.value.bInSector) {
        fOK = TRUE;
        break;
      }
    }
  }

  // Let's do it!
  if (fOK) {
    for (cnt = 0; cnt < gubNumDoorStatus; cnt++) {
      pDoorStatus = addressof(gpDoorStatus[cnt]);

      // Get status of door....
      if (pDoorStatus.value.ubFlags & DOOR_OPEN) {
        // If open, close!
        HandleDoorChangeFromGridNo(NULL, pDoorStatus.value.sGridNo, TRUE);
      }
    }
  }
}

function HandleDoorsChangeWhenEnteringSectorCurrentlyLoaded(): void {
  let cnt: INT32;
  let pDoorStatus: Pointer<DOOR_STATUS>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let fOK: BOOLEAN = FALSE;
  let iNumNewMercs: INT32 = 0;
  let bTownId: INT8;

  // OK, only do this if conditions are met....

  // If this is any omerta tow, don't do it...
  bTownId = GetTownIdForSector(gWorldSectorX, gWorldSectorY);

  if (bTownId == OMERTA) {
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
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[LAST_TEAM].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector) {
      fOK = TRUE;
      break;
    }
  }

  // Loop through our team now....
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;
  for (pSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pSoldier++) {
    if (pSoldier.value.bActive && pSoldier.value.bInSector && gbMercIsNewInThisSector[cnt]) {
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
      pDoorStatus = addressof(gpDoorStatus[cnt]);

      // Get status of door....
      if (pDoorStatus.value.ubFlags & DOOR_OPEN) {
        // If open, close!
        gfSetPerceivedDoorState = TRUE;

        HandleDoorChangeFromGridNo(NULL, pDoorStatus.value.sGridNo, TRUE);

        gfSetPerceivedDoorState = FALSE;

        AllMercsLookForDoor(pDoorStatus.value.sGridNo, TRUE);

        InternalUpdateDoorGraphicFromStatus(pDoorStatus, TRUE, TRUE);
      }
    }
  }
}

function DropKeysInKeyRing(pSoldier: Pointer<SOLDIERTYPE>, sGridNo: INT16, bLevel: INT8, bVisible: INT8, fAddToDropList: BOOLEAN, iDropListSlot: INT32, fUseUnLoaded: BOOLEAN): void {
  let ubLoop: UINT8;
  let ubItem: UINT8;
  let Object: OBJECTTYPE;

  if (!(pSoldier.value.pKeyRing)) {
    // no key ring!
    return;
  }
  for (ubLoop = 0; ubLoop < NUM_KEYS; ubLoop++) {
    ubItem = pSoldier.value.pKeyRing[ubLoop].ubKeyID;

    if (pSoldier.value.pKeyRing[ubLoop].ubNumber > 0) {
      CreateKeyObject(addressof(Object), pSoldier.value.pKeyRing[ubLoop].ubNumber, ubItem);

      // Zero out entry
      pSoldier.value.pKeyRing[ubLoop].ubNumber = 0;
      pSoldier.value.pKeyRing[ubLoop].ubKeyID = INVALID_KEY_NUMBER;

      if (fAddToDropList) {
        AddItemToLeaveIndex(addressof(Object), iDropListSlot);
      } else {
        if (pSoldier.value.sSectorX != gWorldSectorX || pSoldier.value.sSectorY != gWorldSectorY || pSoldier.value.bSectorZ != gbWorldSectorZ || fUseUnLoaded) {
          // Set flag for item...
          AddItemsToUnLoadedSector(pSoldier.value.sSectorX, pSoldier.value.sSectorY, pSoldier.value.bSectorZ, sGridNo, 1, addressof(Object), bLevel, WOLRD_ITEM_FIND_SWEETSPOT_FROM_GRIDNO | WORLD_ITEM_REACHABLE, 0, bVisible, FALSE);
        } else {
          // Add to pool
          AddItemToPool(sGridNo, addressof(Object), bVisible, bLevel, 0, 0);
        }
      }
    }
  }
}
