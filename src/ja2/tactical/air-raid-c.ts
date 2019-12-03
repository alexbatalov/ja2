namespace ja2 {

const SCRIPT_DELAY = 10;
const AIR_RAID_SAY_QUOTE_TIME = 3000;
const AIR_RAID_DIVE_INTERVAL = 10000;
const RAID_DELAY = 40;
const TIME_FROM_DIVE_SOUND_TO_ATTACK_DELAY = 8000;
const TIME_FROM_BOMB_SOUND_TO_ATTACK_DELAY = 3000;
const MOVE_X = 5;
const MOVE_Y = 5;
const STRAFE_DIST = 80;
const BOMB_DIST = 150;

export let gfInAirRaid: boolean = false;
let gfAirRaidScheduled: boolean = false;
let gubAirRaidMode: UINT8;
let guiSoundSample: UINT32;
let guiRaidLastUpdate: UINT32;
let gfFadingRaidIn: boolean = false;
let gfQuoteSaid: boolean = false;
let gbNumDives: INT8 = 0;
let gbMaxDives: INT8 = 0;
let gfFadingRaidOut: boolean = false;
let gsDiveX: INT16;
let gsDiveY: INT16;
let gsDiveTargetLocation: INT16;
let gubDiveDirection: UINT8;
let gsNumGridNosMoved: INT16;
let giNumTurnsSinceLastDive: INT32;
let giNumTurnsSinceDiveStarted: INT32;
let giNumGridNosMovedThisTurn: INT32;
let gfAirRaidHasHadTurn: boolean = false;
let gubBeginTeamTurn: UINT8 = 0;
let gfHaveTBBatton: boolean = false;
let gsNotLocatedYet: boolean /* INT16 */ = false;
let giNumFrames: INT32;

let gAirRaidDef: AIR_RAID_DEFINITION = createAirRaidDefinition();

interface AIR_RAID_SAVE_STRUCT {
  fInAirRaid: boolean;
  fAirRaidScheduled: boolean;
  ubAirRaidMode: UINT8;
  uiSoundSample: UINT32;
  uiRaidLastUpdate: UINT32;
  fFadingRaidIn: boolean;
  fQuoteSaid: boolean;
  bNumDives: INT8;
  bMaxDives: INT8;
  fFadingRaidOut: boolean;
  sDiveX: INT16;
  sDiveY: INT16;
  sDiveTargetLocation: INT16;
  ubDiveDirection: UINT8;
  sNumGridNosMoved: INT16;
  iNumTurnsSinceLastDive: INT32;
  iNumTurnsSinceDiveStarted: INT32;
  iNumGridNosMovedThisTurn: INT32;
  fAirRaidHasHadTurn: boolean;
  ubBeginTeamTurn: UINT8;
  fHaveTBBatton: boolean;
  AirRaidDef: AIR_RAID_DEFINITION;
  sRaidSoldierID: INT16;

  sNotLocatedYet: boolean /* INT16 */;
  iNumFrames: INT32;

  bLevel: INT8;
  bTeam: INT8;
  bSide: INT8;
  ubAttackerID: UINT8;
  usAttackingWeapon: UINT16;
  dXPos: FLOAT;
  dYPos: FLOAT;
  sX: INT16;
  sY: INT16;
  sGridNo: INT16;

  ubFiller: UINT8[] /* [32] */;
}

function createAirRaidSaveStruct(): AIR_RAID_SAVE_STRUCT {
  return {
    fInAirRaid: false,
    fAirRaidScheduled: false,
    ubAirRaidMode: 0,
    uiSoundSample: 0,
    uiRaidLastUpdate: 0,
    fFadingRaidIn: false,
    fQuoteSaid: false,
    bNumDives: 0,
    bMaxDives: 0,
    fFadingRaidOut: false,
    sDiveX: 0,
    sDiveY: 0,
    sDiveTargetLocation: 0,
    ubDiveDirection: 0,
    sNumGridNosMoved: 0,
    iNumTurnsSinceLastDive: 0,
    iNumTurnsSinceDiveStarted: 0,
    iNumGridNosMovedThisTurn: 0,
    fAirRaidHasHadTurn: false,
    ubBeginTeamTurn: 0,
    fHaveTBBatton: false,
    AirRaidDef: createAirRaidDefinition(),
    sRaidSoldierID: 0,
    sNotLocatedYet: false,
    iNumFrames: 0,
    bLevel: 0,
    bTeam: 0,
    bSide: 0,
    ubAttackerID: 0,
    usAttackingWeapon: 0,
    dXPos: 0,
    dYPos: 0,
    sX: 0,
    sY: 0,
    sGridNo: 0,
    ubFiller: createArray(32, 0),
  };
}

const AIR_RAID_SAVE_STRUCT_SIZE = 132;

function readAirRaidSaveStruct(o: AIR_RAID_SAVE_STRUCT, buffer: Buffer, offset: number = 0): number {
  o.fInAirRaid = Boolean(buffer.readUInt8(offset++));
  o.fAirRaidScheduled = Boolean(buffer.readUInt8(offset++));
  o.ubAirRaidMode = buffer.readUInt8(offset++);
  offset++; // padding
  o.uiSoundSample = buffer.readUInt32LE(offset); offset += 4;
  o.uiRaidLastUpdate = buffer.readUInt32LE(offset); offset += 4;
  o.fFadingRaidIn = Boolean(buffer.readUInt8(offset++));
  o.fQuoteSaid = Boolean(buffer.readUInt8(offset++));
  o.bNumDives = buffer.readInt8(offset++);
  o.bMaxDives = buffer.readInt8(offset++);
  o.fFadingRaidOut = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.sDiveX = buffer.readInt16LE(offset); offset += 2;
  o.sDiveY = buffer.readInt16LE(offset); offset += 2;
  o.sDiveTargetLocation = buffer.readInt16LE(offset); offset += 2;
  o.ubDiveDirection = buffer.readUInt8(offset++);
  offset++; // padding
  o.sNumGridNosMoved = buffer.readInt16LE(offset); offset += 2;
  o.iNumTurnsSinceLastDive = buffer.readInt32LE(offset); offset += 4;
  o.iNumTurnsSinceDiveStarted = buffer.readInt32LE(offset); offset += 4;
  o.iNumGridNosMovedThisTurn = buffer.readInt32LE(offset); offset += 4;
  o.fAirRaidHasHadTurn = Boolean(buffer.readUInt8(offset++));
  o.ubBeginTeamTurn = buffer.readUInt8(offset++);
  o.fHaveTBBatton = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  offset = readAirRaidDefinition(o.AirRaidDef, buffer, offset);
  o.sRaidSoldierID = buffer.readInt16LE(offset); offset += 2;
  o.sNotLocatedYet = Boolean(buffer.readUInt16LE(offset)); offset += 2;
  o.iNumFrames = buffer.readInt32LE(offset); offset += 4;
  o.bLevel = buffer.readInt8(offset++);
  o.bTeam = buffer.readInt8(offset++);
  o.bSide = buffer.readInt8(offset++);
  o.ubAttackerID = buffer.readUInt8(offset++);
  o.usAttackingWeapon = buffer.readUInt16LE(offset); offset += 2;
  offset += 2; // padding
  o.dXPos = buffer.readFloatLE(offset); offset += 4;
  o.dYPos = buffer.readFloatLE(offset); offset += 4;
  o.sX = buffer.readInt16LE(offset); offset += 2;
  o.sY = buffer.readInt16LE(offset); offset += 2;
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  offset += 2; // padding
  return offset;
}

function writeAirRaidSaveStruct(o: AIR_RAID_SAVE_STRUCT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fInAirRaid), offset);
  offset = buffer.writeUInt8(Number(o.fAirRaidScheduled), offset);
  offset = buffer.writeUInt8(o.ubAirRaidMode, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiSoundSample, offset);
  offset = buffer.writeUInt32LE(o.uiRaidLastUpdate, offset);
  offset = buffer.writeUInt8(Number(o.fFadingRaidIn), offset);
  offset = buffer.writeUInt8(Number(o.fQuoteSaid), offset);
  offset = buffer.writeInt8(o.bNumDives, offset);
  offset = buffer.writeInt8(o.bMaxDives, offset);
  offset = buffer.writeUInt8(Number(o.fFadingRaidOut), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sDiveX, offset);
  offset = buffer.writeInt16LE(o.sDiveY, offset);
  offset = buffer.writeInt16LE(o.sDiveTargetLocation, offset);
  offset = buffer.writeUInt8(o.ubDiveDirection, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt16LE(o.sNumGridNosMoved, offset);
  offset = buffer.writeInt32LE(o.iNumTurnsSinceLastDive, offset);
  offset = buffer.writeInt32LE(o.iNumTurnsSinceDiveStarted, offset);
  offset = buffer.writeInt32LE(o.iNumGridNosMovedThisTurn, offset);
  offset = buffer.writeUInt8(Number(o.fAirRaidHasHadTurn), offset);
  offset = buffer.writeUInt8(o.ubBeginTeamTurn, offset);
  offset = buffer.writeUInt8(Number(o.fHaveTBBatton), offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = writeAirRaidDefinition(o.AirRaidDef, buffer, offset);
  offset = buffer.writeInt16LE(o.sRaidSoldierID, offset);
  offset = buffer.writeUInt16LE(Number(o.sNotLocatedYet), offset);
  offset = buffer.writeInt32LE(o.iNumFrames, offset);
  offset = buffer.writeInt8(o.bLevel, offset);
  offset = buffer.writeInt8(o.bTeam, offset);
  offset = buffer.writeInt8(o.bSide, offset);
  offset = buffer.writeUInt8(o.ubAttackerID, offset);
  offset = buffer.writeUInt16LE(o.usAttackingWeapon, offset);
  offset = writePadding(buffer, offset, 2); // padding
  offset = buffer.writeFloatLE(o.dXPos, offset);
  offset = buffer.writeFloatLE(o.dYPos, offset);
  offset = buffer.writeInt16LE(o.sX, offset);
  offset = buffer.writeInt16LE(o.sY, offset);
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = writeUIntArray(o.ubFiller, buffer, offset, 1);
  offset = writePadding(buffer, offset, 2); // padding
  return offset;
}

// END SERIALIZATION
let gpRaidSoldier: SOLDIERTYPE /* Pointer<SOLDIERTYPE> */;

interface AIR_RAID_DIR {
  bDir1: INT8;
  bDir2: INT8;
}

function createAirRaidDirFrom(bDir1: INT8, bDir2: INT8): AIR_RAID_DIR {
  return {
    bDir1,
    bDir2,
  };
}

interface AIR_RAID_POS {
  bX: INT8;
  bY: INT8;
}

function createAirRaidPosFrom(bX: INT8, bY: INT8): AIR_RAID_POS {
  return {
    bX,
    bY,
  };
}

let ubPerpDirections: AIR_RAID_DIR[] /* [] */ = [
  createAirRaidDirFrom(2, 6),
  createAirRaidDirFrom(3, 7),
  createAirRaidDirFrom(0, 4),
  createAirRaidDirFrom(1, 5),
  createAirRaidDirFrom(2, 6),
  createAirRaidDirFrom(3, 7),
  createAirRaidDirFrom(0, 4),
  createAirRaidDirFrom(1, 5),
];

let ubXYTragetInvFromDirection: AIR_RAID_POS[] /* [] */ = [
  createAirRaidPosFrom(0, -1),
  createAirRaidPosFrom(1, -1),
  createAirRaidPosFrom(1, 0),
  createAirRaidPosFrom(1, 1),
  createAirRaidPosFrom(0, 1),
  createAirRaidPosFrom(-1, 1),
  createAirRaidPosFrom(-1, 0),
  createAirRaidPosFrom(-1, -1),
];

function ScheduleAirRaid(pAirRaidDef: AIR_RAID_DEFINITION): void {
  // Make sure only one is cheduled...
  if (gfAirRaidScheduled) {
    return;
  }

  // Copy definiaiotn structure into global struct....
  copyAirRaidDefinition(gAirRaidDef, pAirRaidDef);

  AddSameDayStrategicEvent(Enum132.EVENT_BEGIN_AIR_RAID, (GetWorldMinutesInDay() + pAirRaidDef.ubNumMinsFromCurrentTime), 0);

  gfAirRaidScheduled = true;
}

export function BeginAirRaid(): boolean {
  let cnt: INT32;
  let fOK: boolean = false;
  let pSoldier: SOLDIERTYPE;

  // OK, we have been told to start.....

  // First remove scheduled flag...
  gfAirRaidScheduled = false;

  /*
          if( WillAirRaidBeStopped( gAirRaidDef.sSectorX, gAirRaidDef.sSectorY ) )
          {
                  return( FALSE );
          }
  */

  // CHECK IF WE CURRENTLY HAVE THIS SECTOR OPEN....
  /*if (	gAirRaidDef.sSectorX == gWorldSectorX &&
                          gAirRaidDef.sSectorY == gWorldSectorY &&
                          gAirRaidDef.sSectorZ == gbWorldSectorZ )
  */
  // Do we have any guys in here...
  for (cnt = 0, pSoldier = MercPtrs[cnt]; cnt < 20; cnt++, pSoldier = MercPtrs[cnt]) {
    if (pSoldier.bActive) {
      if (pSoldier.sSectorX == gAirRaidDef.sSectorX && pSoldier.sSectorY == gAirRaidDef.sSectorY && pSoldier.bSectorZ == gAirRaidDef.sSectorZ && !pSoldier.fBetweenSectors && pSoldier.bLife && pSoldier.bAssignment != Enum117.IN_TRANSIT) {
        fOK = true;
      }
    }
  }

  if (!fOK) {
    return false;
  }

  // ( unless we are in prebattle interface, then ignore... )
  if (gfPreBattleInterfaceActive) {
    return false;
  }

  ChangeSelectedMapSector(gAirRaidDef.sSectorX, gAirRaidDef.sSectorY, gAirRaidDef.sSectorZ);

  if (gAirRaidDef.sSectorX != gWorldSectorX || gAirRaidDef.sSectorY != gWorldSectorY || gAirRaidDef.sSectorZ != gbWorldSectorZ || guiCurrentScreen == Enum26.MAP_SCREEN) {
    // sector not loaded
    // Set flag for handling raid....
    gubAirRaidMode = Enum192.AIR_RAID_TRYING_TO_START;
    gfQuoteSaid = true;
    SayQuoteFromAnyBodyInThisSector(gAirRaidDef.sSectorX, gAirRaidDef.sSectorY, gAirRaidDef.sSectorZ, Enum202.QUOTE_AIR_RAID);
    SpecialCharacterDialogueEvent(DIALOGUE_SPECIAL_EVENT_EXIT_MAP_SCREEN, gAirRaidDef.sSectorX, gAirRaidDef.sSectorY, gAirRaidDef.sSectorZ, 0, 0);
  } else {
    gubAirRaidMode = Enum192.AIR_RAID_TRYING_TO_START;
    gfQuoteSaid = false;
  }

  // Set flag for handling raid....
  gfInAirRaid = true;
  giNumFrames = 0;

  guiRaidLastUpdate = GetJA2Clock();

  gbNumDives = 0;
  gfAirRaidHasHadTurn = false;

  gpRaidSoldier = MercPtrs[MAX_NUM_SOLDIERS - 1];
  resetSoldierType(gpRaidSoldier);
  gpRaidSoldier.bLevel = 0;
  gpRaidSoldier.bTeam = 1;
  gpRaidSoldier.bSide = 1;
  gpRaidSoldier.ubID = MAX_NUM_SOLDIERS - 1;
  gpRaidSoldier.ubAttackerID = NOBODY;
  gpRaidSoldier.usAttackingWeapon = Enum225.HK21E;
  gpRaidSoldier.inv[Enum261.HANDPOS].usItem = Enum225.HK21E;

  // Determine how many dives this one will be....
  gbMaxDives = (gAirRaidDef.bIntensity + Random(gAirRaidDef.bIntensity - 1));

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Begin Air Raid.");

  return true;
}

function PickLocationNearAnyMercInSector(): INT16 {
  let ubMercsInSector: UINT8[] /* [20] */ = createArray(20, 0);
  let ubNumMercs: UINT8 = 0;
  let ubChosenMerc: UINT8;
  let pTeamSoldier: SOLDIERTYPE;
  let cnt: INT32;

  // Loop through all our guys and randomly say one from someone in our sector

  // set up soldier ptr as first element in mercptrs list
  cnt = gTacticalStatus.Team[gbPlayerNum].bFirstID;

  // run through list
  for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[gbPlayerNum].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
    // Add guy if he's a candidate...
    if (OK_INSECTOR_MERC(pTeamSoldier)) {
      ubMercsInSector[ubNumMercs] = cnt;
      ubNumMercs++;
    }
  }

  // If we are > 0
  if (ubNumMercs > 0) {
    ubChosenMerc = Random(ubNumMercs);

    return MercPtrs[ubMercsInSector[ubChosenMerc]].sGridNo;
  }

  return NOWHERE;
}

function PickRandomLocationAtMinSpacesAway(sGridNo: INT16, sMinValue: INT16, sRandomVar: INT16): INT16 {
  let sNewGridNo: INT16 = NOWHERE;

  let sX: INT16;
  let sY: INT16;
  let sNewX: INT16;
  let sNewY: INT16;

  sX = CenterX(sGridNo);
  sY = CenterY(sGridNo);

  while (sNewGridNo == NOWHERE) {
    sNewX = sX + sMinValue + Random(sRandomVar);
    sNewY = sY + sMinValue + Random(sRandomVar);

    if (Random(2)) {
      sNewX = -1 * sNewX;
    }

    if (Random(2)) {
      sNewY = -1 * sNewY;
    }

    // Make gridno....
    sNewGridNo = GETWORLDINDEXFROMWORLDCOORDS(sNewY, sNewX);

    // Check if visible on screen....
    if (!GridNoOnVisibleWorldTile(sNewGridNo)) {
      sNewGridNo = NOWHERE;
    }
  }

  return sNewGridNo;
}

function TryToStartRaid(): void {
  // OK, check conditions,

  // Some are:

  // Cannot be in battle ( this is handled by the fact of it begin shceduled in the first place...

  // Cannot be auto-bandaging?
  if (gTacticalStatus.fAutoBandageMode) {
    return;
  }

  // Cannot be in conversation...
  if (gTacticalStatus.uiFlags & ENGAGED_IN_CONV) {
    return;
  }

  // Cannot be traversing.....

  // Ok, go...
  gubAirRaidMode = Enum192.AIR_RAID_START;
}

function AirRaidStart(): void {
  // Begin ambient sound....
  guiSoundSample = PlayJA2Sample(Enum330.S_RAID_AMBIENT, RATE_11025, 0, 10000, MIDDLEPAN);

  gfFadingRaidIn = true;

  // Setup start time....
  giTimerAirRaidQuote = RESETTIMECOUNTER(AIR_RAID_SAY_QUOTE_TIME);

  gubAirRaidMode = Enum192.AIR_RAID_LOOK_FOR_DIVE;

  // If we are not in combat, change music mode...
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    SetMusicMode(Enum328.MUSIC_TACTICAL_BATTLE);
  }
}

function AirRaidLookForDive(): void {
  let fDoDive: boolean = false;
  let fDoQuote: boolean = false;

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    if (!gfQuoteSaid) {
      if (TIMECOUNTERDONE(giTimerAirRaidQuote, AIR_RAID_SAY_QUOTE_TIME)) {
        fDoQuote = true;
      }
    }
  } else {
    if (giNumTurnsSinceLastDive > 1 && !gfQuoteSaid) {
      fDoQuote = true;
    }
  }

  // OK, check if we should say something....
  if (fDoQuote) {
    gfQuoteSaid = true;

    // Someone in group say quote...
    SayQuoteFromAnyBodyInSector(Enum202.QUOTE_AIR_RAID);

    // Update timer
    giTimerAirRaidDiveStarted = RESETTIMECOUNTER(AIR_RAID_DIVE_INTERVAL);

    giNumTurnsSinceLastDive = 0;

    // Do morale hit on our guys
    HandleMoraleEvent(null, Enum234.MORALE_AIRSTRIKE, gAirRaidDef.sSectorX, gAirRaidDef.sSectorY, gAirRaidDef.sSectorZ);
  }

  // If NOT in combat....
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    // OK, for now on, all we try to do is look for dives to make...
    if (gfQuoteSaid) {
      if (TIMECOUNTERDONE(giTimerAirRaidDiveStarted, AIR_RAID_DIVE_INTERVAL)) {
        // IN realtime, give a bit more leeway for time....
        if (Random(2)) {
          fDoDive = true;
        }
      }
    }
  } else {
    // How many turns have gone by?
    if (giNumTurnsSinceLastDive > (Random(2) + 1)) {
      fDoDive = true;
    }
  }

  if (fDoDive) {
    // If we are are beginning game, only to gun dives..
    if (gAirRaidDef.uiFlags & AIR_RAID_BEGINNING_GAME) {
      if (gbNumDives == 0) {
        gubAirRaidMode = Enum192.AIR_RAID_BEGIN_DIVE;
      } else if (gbNumDives == 1) {
        gubAirRaidMode = Enum192.AIR_RAID_BEGIN_BOMBING;
      } else {
        gubAirRaidMode = Enum192.AIR_RAID_BEGIN_DIVE;
      }
    } else {
      // Randomly do dive...
      if (Random(2)) {
        gubAirRaidMode = Enum192.AIR_RAID_BEGIN_DIVE;
      } else {
        gubAirRaidMode = Enum192.AIR_RAID_BEGIN_BOMBING;
      }
    }
    gbNumDives++;
    return;
  } else {
    if ((gTacticalStatus.uiFlags & INCOMBAT)) {
      if (giNumGridNosMovedThisTurn == 0) {
        // Free up attacker...
        FreeUpAttacker(gpRaidSoldier.ubID);
        DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Tried to free up attacker AIR RAID NO DIVE, attack count now %d", gTacticalStatus.ubAttackBusyCount));
      }
    }
  }

  // End if we have made desired # of dives...
  if (gbNumDives == gbMaxDives) {
    // Air raid is over....
    gubAirRaidMode = Enum192.AIR_RAID_START_END;
  }
}

function AirRaidStartEnding(): void {
  // Fade out sound.....
  gfFadingRaidOut = true;
}

function BeginBombing(): void {
  let sGridNo: INT16;
  let iSoundStartDelay: UINT32;

  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    // Start diving sound...
    PlayJA2Sample(Enum330.S_RAID_WHISTLE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
  }

  gubAirRaidMode = Enum192.AIR_RAID_BOMBING;

  // Pick location...
  gsDiveTargetLocation = PickLocationNearAnyMercInSector();

  if (gsDiveTargetLocation == NOWHERE) {
    gsDiveTargetLocation = 10234;
  }

  // Get location of aircraft....
  sGridNo = PickRandomLocationAtMinSpacesAway(gsDiveTargetLocation, 300, 200);

  // Save X, y:
  gsDiveX = CenterX(sGridNo);
  gsDiveY = CenterY(sGridNo);

  giTimerAirRaidUpdate = RESETTIMECOUNTER(RAID_DELAY);

  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    iSoundStartDelay = 0;
  } else {
    iSoundStartDelay = TIME_FROM_BOMB_SOUND_TO_ATTACK_DELAY;
  }
  giTimerAirRaidDiveStarted = RESETTIMECOUNTER(iSoundStartDelay);

  giNumTurnsSinceDiveStarted = 0;

  // Get direction....
  gubDiveDirection = GetDirectionToGridNoFromGridNo(sGridNo, gsDiveTargetLocation);

  gsNumGridNosMoved = 0;
  gsNotLocatedYet = true;
}

function BeginDive(): void {
  let sGridNo: INT16;
  let iSoundStartDelay: UINT32;

  // Start diving sound...
  PlayJA2Sample(Enum330.S_RAID_DIVE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);

  gubAirRaidMode = Enum192.AIR_RAID_DIVING;

  // Increment attacker bust count....
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Starting attack BEGIN DIVE %d", gTacticalStatus.ubAttackBusyCount));

  // Pick location...
  gsDiveTargetLocation = PickLocationNearAnyMercInSector();

  if (gsDiveTargetLocation == NOWHERE) {
    gsDiveTargetLocation = 10234;
  }

  // Get location of aircraft....
  sGridNo = PickRandomLocationAtMinSpacesAway(gsDiveTargetLocation, 300, 200);

  // Save X, y:
  gsDiveX = CenterX(sGridNo);
  gsDiveY = CenterY(sGridNo);

  giTimerAirRaidUpdate = RESETTIMECOUNTER(RAID_DELAY);
  giNumTurnsSinceDiveStarted = 0;

  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    iSoundStartDelay = 0;
  } else {
    iSoundStartDelay = TIME_FROM_DIVE_SOUND_TO_ATTACK_DELAY;
  }
  giTimerAirRaidDiveStarted = RESETTIMECOUNTER(iSoundStartDelay);

  // Get direction....
  gubDiveDirection = GetDirectionToGridNoFromGridNo(sGridNo, gsDiveTargetLocation);

  gsNumGridNosMoved = 0;
  gsNotLocatedYet = true;
}

function MoveDiveAirplane(dAngle: FLOAT): void {
  let dDeltaPos: FLOAT;

  // Find delta Movement for X pos
  dDeltaPos = MOVE_X * Math.sin(dAngle);

  // Find new position
  gsDiveX = (gsDiveX + dDeltaPos);

  // Find delta Movement for Y pos
  dDeltaPos = MOVE_X * Math.cos(dAngle);

  // Find new pos
  gsDiveY = (gsDiveY + dDeltaPos);
}

function DoDive(): void {
  let sRange: INT16;
  let sGridNo: INT16;
  let sOldGridNo: INT16;

  let sTargetX: INT16;
  let sTargetY: INT16;
  let sStrafeX: INT16;
  let sStrafeY: INT16;
  let dDeltaX: FLOAT;
  let dDeltaY: FLOAT;
  let dAngle: FLOAT;
  let dDeltaXPos: FLOAT;
  let dDeltaYPos: FLOAT;
  let sX: INT16;
  let sY: INT16;

  // Delay for a specific perion of time to allow sound to Q up...
  if (TIMECOUNTERDONE(giTimerAirRaidDiveStarted, 0)) {
    // OK, rancomly decide to not do this dive...
    if (gAirRaidDef.uiFlags & AIR_RAID_CAN_RANDOMIZE_TEASE_DIVES) {
      if (Random(10) == 0) {
        // Finish....
        gubAirRaidMode = Enum192.AIR_RAID_END_DIVE;
        return;
      }
    }

    if (gsNotLocatedYet && !(gTacticalStatus.uiFlags & INCOMBAT)) {
      gsNotLocatedYet = false;
      LocateGridNo(gsDiveTargetLocation);
    }

    sOldGridNo = GETWORLDINDEXFROMWORLDCOORDS(gsDiveY, gsDiveX);

    // Dive until we are a certain range to target....
    sRange = PythSpacesAway(sOldGridNo, gsDiveTargetLocation);

    // If sRange
    if (sRange < 3) {
      // Finish....
      gubAirRaidMode = Enum192.AIR_RAID_END_DIVE;
      return;
    }

    if (TIMECOUNTERDONE(giTimerAirRaidUpdate, RAID_DELAY)) {
      giTimerAirRaidUpdate = RESETTIMECOUNTER(RAID_DELAY);

      // Move Towards target....
      sTargetX = CenterX(gsDiveTargetLocation);
      sTargetY = CenterY(gsDiveTargetLocation);

      // Determine deltas
      dDeltaX = (sTargetX - gsDiveX);
      dDeltaY = (sTargetY - gsDiveY);

      // Determine angle
      dAngle = Math.atan2(dDeltaX, dDeltaY);

      MoveDiveAirplane(dAngle);

      gpRaidSoldier.dXPos = gsDiveX;
      gpRaidSoldier.sX = gsDiveX;
      gpRaidSoldier.dYPos = gsDiveY;
      gpRaidSoldier.sY = gsDiveY;

      // Figure gridno....
      sGridNo = GETWORLDINDEXFROMWORLDCOORDS(gsDiveY, gsDiveX);
      gpRaidSoldier.sGridNo = sGridNo;

      if (sOldGridNo != sGridNo) {
        gsNumGridNosMoved++;

        giNumGridNosMovedThisTurn++;

        // OK, shoot bullets....
        // Get positions of guns...

        // Get target.....
        dDeltaXPos = STRAFE_DIST * Math.sin(dAngle);
        sStrafeX = (gsDiveX + dDeltaXPos);

        // Find delta Movement for Y pos
        dDeltaYPos = STRAFE_DIST * Math.cos(dAngle);
        sStrafeY = (gsDiveY + dDeltaYPos);

        if ((gTacticalStatus.uiFlags & INCOMBAT)) {
          LocateGridNo(sGridNo);
        }

        if (GridNoOnVisibleWorldTile((GETWORLDINDEXFROMWORLDCOORDS(sStrafeY, sStrafeX)))) {
          // if ( gsNotLocatedYet && !( gTacticalStatus.uiFlags & INCOMBAT ) )
          //	{
          //	gsNotLocatedYet = FALSE;
          //		LocateGridNo( sGridNo );
          //	}

          // if ( ( gTacticalStatus.uiFlags & INCOMBAT ) )
          {
            // Increase attacker busy...
            // gTacticalStatus.ubAttackBusyCount++;
            // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack AIR RAID ( fire gun ), attack count now %d", gTacticalStatus.ubAttackBusyCount) );

            // INcrement bullet fired...
            gpRaidSoldier.bBulletsLeft++;
          }

          // For now use first position....

          gpRaidSoldier.ubTargetID = NOBODY;
          FireBulletGivenTarget(gpRaidSoldier, sStrafeX, sStrafeY, 0, gpRaidSoldier.usAttackingWeapon, 10, false, false);
        }

        // Do second one.... ( ll )
        sX = (gsDiveX + (Math.sin(dAngle + (Math.PI / 2)) * 40));
        sY = (gsDiveY + (Math.cos(dAngle + (Math.PI / 2)) * 40));

        gpRaidSoldier.dXPos = sX;
        gpRaidSoldier.sX = sX;
        gpRaidSoldier.dYPos = sY;
        gpRaidSoldier.sY = sY;
        gpRaidSoldier.sGridNo = GETWORLDINDEXFROMWORLDCOORDS(sY, sX);

        // Get target.....
        sStrafeX = (sX + dDeltaXPos);

        // Find delta Movement for Y pos
        sStrafeY = (sY + dDeltaYPos);

        if (GridNoOnVisibleWorldTile((GETWORLDINDEXFROMWORLDCOORDS(sStrafeY, sStrafeX)))) {
          // if ( ( gTacticalStatus.uiFlags & INCOMBAT ) )
          {
            // Increase attacker busy...
            // gTacticalStatus.ubAttackBusyCount++;
            // DebugMsg( TOPIC_JA2, DBG_LEVEL_3, String("!!!!!!! Starting attack AIR RAID ( second one ), attack count now %d", gTacticalStatus.ubAttackBusyCount) );

            // INcrement bullet fired...
            gpRaidSoldier.bBulletsLeft++;
          }

          // For now use first position....
          FireBulletGivenTarget(gpRaidSoldier, sStrafeX, sStrafeY, 0, gpRaidSoldier.usAttackingWeapon, 10, false, false);
        }
      }

      if (giNumGridNosMovedThisTurn >= 6) {
        if ((gTacticalStatus.uiFlags & INCOMBAT)) {
          // Free up attacker...
          FreeUpAttacker(gpRaidSoldier.ubID);
          DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Tried to free up attacker AIR RAID DIVE DONE FOR THIS TURN, attack count now %d", gTacticalStatus.ubAttackBusyCount));
        }
      }
    }
  }
}

function DoBombing(): void {
  let sRange: INT16;
  let sGridNo: INT16;
  let sOldGridNo: INT16;
  let sBombGridNo: INT16;

  let sTargetX: INT16;
  let sTargetY: INT16;
  let usItem: UINT16;
  let sStrafeX: INT16;
  let sStrafeY: INT16;
  let dDeltaX: FLOAT;
  let dDeltaY: FLOAT;
  let dAngle: FLOAT;
  let dDeltaXPos: FLOAT;
  let dDeltaYPos: FLOAT;
  let fLocate: boolean = false;

  // Delay for a specific perion of time to allow sound to Q up...
  if (TIMECOUNTERDONE(giTimerAirRaidDiveStarted, 0)) {
    // OK, rancomly decide to not do this dive...
    if (gAirRaidDef.uiFlags & AIR_RAID_CAN_RANDOMIZE_TEASE_DIVES) {
      if (Random(10) == 0) {
        // Finish....
        gubAirRaidMode = Enum192.AIR_RAID_END_BOMBING;
        return;
      }
    }

    if (gsNotLocatedYet && !(gTacticalStatus.uiFlags & INCOMBAT)) {
      gsNotLocatedYet = false;
      LocateGridNo(gsDiveTargetLocation);
    }

    sOldGridNo = GETWORLDINDEXFROMWORLDCOORDS(gsDiveY, gsDiveX);

    // Dive until we are a certain range to target....
    sRange = PythSpacesAway(sOldGridNo, gsDiveTargetLocation);

    // If sRange
    if (sRange < 3) {
      // Finish....
      gubAirRaidMode = Enum192.AIR_RAID_END_BOMBING;
      return;
    }

    if (TIMECOUNTERDONE(giTimerAirRaidUpdate, RAID_DELAY)) {
      giTimerAirRaidUpdate = RESETTIMECOUNTER(RAID_DELAY);

      // Move Towards target....
      sTargetX = CenterX(gsDiveTargetLocation);
      sTargetY = CenterY(gsDiveTargetLocation);

      // Determine deltas
      dDeltaX = (sTargetX - gsDiveX);
      dDeltaY = (sTargetY - gsDiveY);

      // Determine angle
      dAngle = Math.atan2(dDeltaX, dDeltaY);

      MoveDiveAirplane(dAngle);

      gpRaidSoldier.dXPos = gsDiveX;
      gpRaidSoldier.sX = gsDiveX;
      gpRaidSoldier.dYPos = gsDiveY;
      gpRaidSoldier.sY = gsDiveY;

      // Figure gridno....
      sGridNo = GETWORLDINDEXFROMWORLDCOORDS(gsDiveY, gsDiveX);
      gpRaidSoldier.sGridNo = sGridNo;

      if (sOldGridNo != sGridNo) {
        // Every once and a while, drop bomb....
        gsNumGridNosMoved++;

        giNumGridNosMovedThisTurn++;

        if ((gsNumGridNosMoved % 4) == 0) {
          // Get target.....
          dDeltaXPos = BOMB_DIST * Math.sin(dAngle);
          sStrafeX = (gsDiveX + dDeltaXPos);

          // Find delta Movement for Y pos
          dDeltaYPos = BOMB_DIST * Math.cos(dAngle);
          sStrafeY = (gsDiveY + dDeltaYPos);

          if (GridNoOnVisibleWorldTile((GETWORLDINDEXFROMWORLDCOORDS(sStrafeY, sStrafeX)))) {
            // if ( gsNotLocatedYet && !( gTacticalStatus.uiFlags & INCOMBAT ) )
            //{
            //	gsNotLocatedYet = FALSE;
            //	LocateGridNo( sGridNo );
            //}

            if (Random(2)) {
              usItem = Enum225.HAND_GRENADE;
            } else {
              usItem = Enum225.RDX;
            }

            // Pick random gridno....
            sBombGridNo = PickRandomLocationAtMinSpacesAway((GETWORLDINDEXFROMWORLDCOORDS(sStrafeY, sStrafeX)), 40, 40);

            if ((gTacticalStatus.uiFlags & INCOMBAT)) {
              fLocate = true;
              // Increase attacker busy...
              gTacticalStatus.ubAttackBusyCount++;
              DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Starting attack AIR RAID ( bombs away ), attack count now %d", gTacticalStatus.ubAttackBusyCount));
            }

            // Drop bombs...
            InternalIgniteExplosion(NOBODY, CenterX(sBombGridNo), CenterY(sBombGridNo), 0, sBombGridNo, usItem, fLocate, Number(IsRoofPresentAtGridno(sBombGridNo)));
          }
        }

        if (giNumGridNosMovedThisTurn >= 6) {
          if ((gTacticalStatus.uiFlags & INCOMBAT)) {
            // Free up attacker...
            FreeUpAttacker(gpRaidSoldier.ubID);
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Tried to free up attacker AIR RAID BOMB ATTACK DONE FOR THIS TURN, attack count now %d", gTacticalStatus.ubAttackBusyCount));
          }
        }
      }
    }
  }
}

export function HandleAirRaid(): void {
  let iVol: INT32;
  let uiClock: UINT32;

  // OK,
  if (gfInAirRaid) {
    // Are we in TB?
    if ((gTacticalStatus.uiFlags & INCOMBAT)) {
      // Do we have the batton?
      if (!gfHaveTBBatton) {
        // Don;t do anything else!
        return;
      }
    }

    uiClock = GetJA2Clock();

    if ((uiClock - guiRaidLastUpdate) > SCRIPT_DELAY) {
      giNumFrames++;

      guiRaidLastUpdate = uiClock;

      if (gfFadingRaidIn) {
        if (guiSoundSample != NO_SAMPLE) {
          if ((giNumFrames % 10) == 0) {
            iVol = SoundGetVolume(guiSoundSample);
            iVol = Math.min(HIGHVOLUME, iVol + 1);
            SoundSetVolume(guiSoundSample, iVol);
            if (iVol == HIGHVOLUME)
              gfFadingRaidIn = false;
          }
        } else {
          gfFadingRaidIn = false;
        }
      } else if (gfFadingRaidOut) {
        if (guiSoundSample != NO_SAMPLE) {
          if ((giNumFrames % 10) == 0) {
            iVol = SoundGetVolume(guiSoundSample);

            iVol = Math.max(0, iVol - 1);

            SoundSetVolume(guiSoundSample, iVol);
            if (iVol == 0) {
              gfFadingRaidOut = false;

              gubAirRaidMode = Enum192.AIR_RAID_END;
            }
          }
        } else {
          gfFadingRaidOut = false;
          gubAirRaidMode = Enum192.AIR_RAID_END;
        }
      }

      switch (gubAirRaidMode) {
        case Enum192.AIR_RAID_TRYING_TO_START:

          TryToStartRaid();
          break;

        case Enum192.AIR_RAID_START:

          AirRaidStart();
          break;

        case Enum192.AIR_RAID_LOOK_FOR_DIVE:

          AirRaidLookForDive();
          break;

        case Enum192.AIR_RAID_START_END:

          AirRaidStartEnding();
          break;

        case Enum192.AIR_RAID_END:

          EndAirRaid();
          break;

        case Enum192.AIR_RAID_BEGIN_DIVE:

          BeginDive();
          break;

        case Enum192.AIR_RAID_DIVING:

          // If in combat, check if we have reached our max...
          if ((gTacticalStatus.uiFlags & INCOMBAT)) {
            if (giNumGridNosMovedThisTurn < 6) {
              DoDive();
            }
          } else {
            DoDive();
          }
          break;

        case Enum192.AIR_RAID_END_DIVE:

          giNumTurnsSinceLastDive = 0;
          giTimerAirRaidDiveStarted = RESETTIMECOUNTER(AIR_RAID_DIVE_INTERVAL);

          if ((gTacticalStatus.uiFlags & INCOMBAT)) {
            // Free up attacker...
            FreeUpAttacker(gpRaidSoldier.ubID);
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Tried to free up attacker AIR RAID ENDING DIVE, attack count now %d", gTacticalStatus.ubAttackBusyCount));
          }

          gubAirRaidMode = Enum192.AIR_RAID_LOOK_FOR_DIVE;
          break;

        case Enum192.AIR_RAID_END_BOMBING:

          giTimerAirRaidDiveStarted = RESETTIMECOUNTER(AIR_RAID_DIVE_INTERVAL);
          giNumTurnsSinceLastDive = 0;

          if ((gTacticalStatus.uiFlags & INCOMBAT)) {
            // Free up attacker...
            FreeUpAttacker(gpRaidSoldier.ubID);
            DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Tried to free up attacker AIR RAID ENDING DIVE, attack count now %d", gTacticalStatus.ubAttackBusyCount));
          }

          gubAirRaidMode = Enum192.AIR_RAID_LOOK_FOR_DIVE;
          break;

        case Enum192.AIR_RAID_BEGIN_BOMBING:
          BeginBombing();
          break;

        case Enum192.AIR_RAID_BOMBING:
          DoBombing();
          break;
      }
    }

    if ((gTacticalStatus.uiFlags & INCOMBAT)) {
      // Do we have the batton?
      if (gfHaveTBBatton) {
        // Are we through with attacker busy count?
        if (gTacticalStatus.ubAttackBusyCount == 0) {
          // Relinquish control....
          gfAirRaidHasHadTurn = true;
          gfHaveTBBatton = false;
          BeginTeamTurn(gubBeginTeamTurn);
        }
      }
    }
  }
}

export function InAirRaid(): boolean {
  return gfInAirRaid;
}

export function HandleAirRaidEndTurn(ubTeam: UINT8): boolean {
  if (!gfInAirRaid) {
    return true;
  }

  if (gfAirRaidHasHadTurn) {
    gfAirRaidHasHadTurn = false;
    return true;
  }

  giNumTurnsSinceLastDive++;
  giNumTurnsSinceDiveStarted++;
  giNumGridNosMovedThisTurn = 0;
  gubBeginTeamTurn = ubTeam;
  gfHaveTBBatton = true;

  // ATE: Even if we have an attacker busy problem.. init to 0 now
  // gTacticalStatus.ubAttackBusyCount = 0;

  // Increment attacker bust count....
  gTacticalStatus.ubAttackBusyCount++;
  DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("!!!!!!! Starting attack AIR RAID, attack count now %d", gTacticalStatus.ubAttackBusyCount));

  AddTopMessage(Enum216.AIR_RAID_TURN_MESSAGE, TacticalStr[Enum335.AIR_RAID_TURN_STR]);

  // OK, handle some sound effects, depending on the mode we are in...
  if ((gTacticalStatus.uiFlags & INCOMBAT)) {
    switch (gubAirRaidMode) {
      case Enum192.AIR_RAID_BOMBING:

        // Start diving sound...
        PlayJA2Sample(Enum330.S_RAID_TB_BOMB, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        break;

      case Enum192.AIR_RAID_BEGIN_DIVE:

        PlayJA2Sample(Enum330.S_RAID_TB_DIVE, RATE_11025, HIGHVOLUME, 1, MIDDLEPAN);
        break;
    }
  }

  return false;
}

export function SaveAirRaidInfoToSaveGameFile(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32;
  let sAirRaidSaveStruct: AIR_RAID_SAVE_STRUCT = createAirRaidSaveStruct();
  let buffer: Buffer;

  // Put all the globals into the save struct
  sAirRaidSaveStruct.fInAirRaid = gfInAirRaid;
  sAirRaidSaveStruct.fAirRaidScheduled = gfAirRaidScheduled;
  sAirRaidSaveStruct.ubAirRaidMode = gubAirRaidMode;
  sAirRaidSaveStruct.uiSoundSample = guiSoundSample;
  sAirRaidSaveStruct.uiRaidLastUpdate = guiRaidLastUpdate;
  sAirRaidSaveStruct.fFadingRaidIn = gfFadingRaidIn;
  sAirRaidSaveStruct.fQuoteSaid = gfQuoteSaid;
  sAirRaidSaveStruct.bNumDives = gbNumDives;
  sAirRaidSaveStruct.bMaxDives = gbMaxDives;
  sAirRaidSaveStruct.fFadingRaidOut = gfFadingRaidOut;
  sAirRaidSaveStruct.sDiveX = gsDiveX;
  sAirRaidSaveStruct.sDiveY = gsDiveY;
  sAirRaidSaveStruct.sDiveTargetLocation = gsDiveTargetLocation;
  sAirRaidSaveStruct.ubDiveDirection = gubDiveDirection;
  sAirRaidSaveStruct.sNumGridNosMoved = gsNumGridNosMoved;
  sAirRaidSaveStruct.iNumTurnsSinceLastDive = giNumTurnsSinceLastDive;
  sAirRaidSaveStruct.iNumTurnsSinceDiveStarted = giNumTurnsSinceDiveStarted;
  sAirRaidSaveStruct.iNumGridNosMovedThisTurn = giNumGridNosMovedThisTurn;
  sAirRaidSaveStruct.fAirRaidHasHadTurn = gfAirRaidHasHadTurn;
  sAirRaidSaveStruct.ubBeginTeamTurn = gubBeginTeamTurn;
  sAirRaidSaveStruct.fHaveTBBatton = gfHaveTBBatton;

  sAirRaidSaveStruct.sNotLocatedYet = gsNotLocatedYet;
  sAirRaidSaveStruct.iNumFrames = giNumFrames;

  if (gpRaidSoldier) {
    sAirRaidSaveStruct.bLevel = gpRaidSoldier.bLevel;
    sAirRaidSaveStruct.bTeam = gpRaidSoldier.bTeam;
    sAirRaidSaveStruct.bSide = gpRaidSoldier.bSide;
    sAirRaidSaveStruct.ubAttackerID = gpRaidSoldier.ubAttackerID;
    sAirRaidSaveStruct.usAttackingWeapon = gpRaidSoldier.usAttackingWeapon;
    sAirRaidSaveStruct.dXPos = gpRaidSoldier.dXPos;
    sAirRaidSaveStruct.dYPos = gpRaidSoldier.dYPos;
    sAirRaidSaveStruct.sX = gpRaidSoldier.sX;
    sAirRaidSaveStruct.sY = gpRaidSoldier.sY;
    sAirRaidSaveStruct.sGridNo = gpRaidSoldier.sGridNo;

    sAirRaidSaveStruct.sRaidSoldierID = MAX_NUM_SOLDIERS - 1;
    //		sAirRaidSaveStruct.sRaidSoldierID = gpRaidSoldier->ubID;
  } else
    sAirRaidSaveStruct.sRaidSoldierID = -1;

  copyAirRaidDefinition(sAirRaidSaveStruct.AirRaidDef, gAirRaidDef);

  // Save the Air Raid Save Struct
  buffer = Buffer.allocUnsafe(AIR_RAID_SAVE_STRUCT_SIZE);
  writeAirRaidSaveStruct(sAirRaidSaveStruct, buffer);
  uiNumBytesWritten = FileWrite(hFile, buffer, AIR_RAID_SAVE_STRUCT_SIZE);
  if (uiNumBytesWritten != AIR_RAID_SAVE_STRUCT_SIZE) {
    return false;
  }

  return true;
}

export function LoadAirRaidInfoFromSaveGameFile(hFile: HWFILE): boolean {
  let sAirRaidSaveStruct: AIR_RAID_SAVE_STRUCT = createAirRaidSaveStruct();
  let uiNumBytesRead: UINT32;
  let buffer: Buffer;

  // Load the number of REAL_OBJECTs in the array
  buffer = Buffer.allocUnsafe(AIR_RAID_SAVE_STRUCT_SIZE);
  uiNumBytesRead = FileRead(hFile, buffer, AIR_RAID_SAVE_STRUCT_SIZE);
  if (uiNumBytesRead != AIR_RAID_SAVE_STRUCT_SIZE) {
    return false;
  }

  readAirRaidSaveStruct(sAirRaidSaveStruct, buffer);

  // Put all the globals into the save struct
  gfInAirRaid = sAirRaidSaveStruct.fInAirRaid;
  gfAirRaidScheduled = sAirRaidSaveStruct.fAirRaidScheduled;
  gubAirRaidMode = sAirRaidSaveStruct.ubAirRaidMode;
  guiSoundSample = sAirRaidSaveStruct.uiSoundSample;
  guiRaidLastUpdate = sAirRaidSaveStruct.uiRaidLastUpdate;
  gfFadingRaidIn = sAirRaidSaveStruct.fFadingRaidIn;
  gfQuoteSaid = sAirRaidSaveStruct.fQuoteSaid;
  gbNumDives = sAirRaidSaveStruct.bNumDives;
  gbMaxDives = sAirRaidSaveStruct.bMaxDives;
  gfFadingRaidOut = sAirRaidSaveStruct.fFadingRaidOut;
  gsDiveX = sAirRaidSaveStruct.sDiveX;
  gsDiveY = sAirRaidSaveStruct.sDiveY;
  gsDiveTargetLocation = sAirRaidSaveStruct.sDiveTargetLocation;
  gubDiveDirection = sAirRaidSaveStruct.ubDiveDirection;
  gsNumGridNosMoved = sAirRaidSaveStruct.sNumGridNosMoved;
  giNumTurnsSinceLastDive = sAirRaidSaveStruct.iNumTurnsSinceLastDive;
  giNumTurnsSinceDiveStarted = sAirRaidSaveStruct.iNumTurnsSinceDiveStarted;
  giNumGridNosMovedThisTurn = sAirRaidSaveStruct.iNumGridNosMovedThisTurn;
  gfAirRaidHasHadTurn = sAirRaidSaveStruct.fAirRaidHasHadTurn;
  gubBeginTeamTurn = sAirRaidSaveStruct.ubBeginTeamTurn;
  gfHaveTBBatton = sAirRaidSaveStruct.fHaveTBBatton;

  gsNotLocatedYet = sAirRaidSaveStruct.sNotLocatedYet;
  giNumFrames = sAirRaidSaveStruct.iNumFrames;

  if (sAirRaidSaveStruct.sRaidSoldierID != -1) {
    gpRaidSoldier = Menptr[sAirRaidSaveStruct.sRaidSoldierID];

    gpRaidSoldier.bLevel = sAirRaidSaveStruct.bLevel;
    gpRaidSoldier.bTeam = sAirRaidSaveStruct.bTeam;
    gpRaidSoldier.bSide = sAirRaidSaveStruct.bSide;
    gpRaidSoldier.ubAttackerID = sAirRaidSaveStruct.ubAttackerID;
    gpRaidSoldier.usAttackingWeapon = sAirRaidSaveStruct.usAttackingWeapon;
    gpRaidSoldier.dXPos = sAirRaidSaveStruct.dXPos;
    gpRaidSoldier.dYPos = sAirRaidSaveStruct.dYPos;
    gpRaidSoldier.sX = sAirRaidSaveStruct.sX;
    gpRaidSoldier.sY = sAirRaidSaveStruct.sY;
    gpRaidSoldier.sGridNo = sAirRaidSaveStruct.sGridNo;
  } else
    gpRaidSoldier = <SOLDIERTYPE><unknown>null;

  copyAirRaidDefinition(gAirRaidDef, sAirRaidSaveStruct.AirRaidDef);

  return true;
}

export function EndAirRaid(): void {
  gfInAirRaid = false;

  // Stop sound
  SoundStop(guiSoundSample);

  // Change music back...
  if (!(gTacticalStatus.uiFlags & INCOMBAT)) {
    SetMusicMode(Enum328.MUSIC_TACTICAL_NOTHING);

    if (!gTacticalStatus.Team[ENEMY_TEAM].bTeamActive && !gTacticalStatus.Team[CREATURE_TEAM].bTeamActive) {
      let pTeamSoldier: SOLDIERTYPE;
      let cnt: INT32;

      // Loop through all militia and restore them to peaceful status
      cnt = gTacticalStatus.Team[MILITIA_TEAM].bFirstID;
      for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[MILITIA_TEAM].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
        if (pTeamSoldier.bActive && pTeamSoldier.bInSector) {
          pTeamSoldier.bAlertStatus = Enum243.STATUS_GREEN;
        }
      }
      gTacticalStatus.Team[MILITIA_TEAM].bAwareOfOpposition = false;

      cnt = gTacticalStatus.Team[CIV_TEAM].bFirstID;
      // Loop through all civs and restore them to peaceful status
      for (pTeamSoldier = MercPtrs[cnt]; cnt <= gTacticalStatus.Team[CIV_TEAM].bLastID; cnt++, pTeamSoldier = MercPtrs[cnt]) {
        if (pTeamSoldier.bActive && pTeamSoldier.bInSector) {
          pTeamSoldier.bAlertStatus = Enum243.STATUS_GREEN;
        }
      }
      gTacticalStatus.Team[CIV_TEAM].bAwareOfOpposition = false;
    }
  }

  // OK, look at flags...
  if (gAirRaidDef.uiFlags & AIR_RAID_BEGINNING_GAME) {
    // OK, make enemy appear in Omerta
                                                       // Talk to strategic AI for this...
                                                       // GROUP *pGroup;
                                                       // Create a patrol group originating from sector B9
                                                       // pGroup = CreateNewEnemyGroupDepartingFromSector( SEC_B9, (UINT8)(2 + Random( 2 ) + gGameOptions.ubDifficultyLevel), 0 );
                                                       // Move the patrol group north to attack Omerta
                                                       // AddWaypointToPGroup( pGroup, 9, 1 ); //A9
                                                       // Because we want them to arrive right away, we will toast the arrival event.  The information
                                                       // is already set up though.
                                                       // DeleteStrategicEvent( EVENT_GROUP_ARRIVAL, pGroup->ubGroupID );
                                                       // Simply reinsert the event, but the time is now.
                                                       // AddStrategicEvent( EVENT_GROUP_ARRIVAL, GetWorldTotalMin(), pGroup->ubGroupID );
  }

  ScreenMsg(FONT_MCOLOR_LTYELLOW, MSG_BETAVERSION, "Ending Air Raid.");
}

}
