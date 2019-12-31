namespace ja2 {

const FOURPM = 960;

// waketime is the # of minutes in the day minus the sleep time
const WAKETIME = (x: number) => (Math.trunc(NUM_SEC_IN_DAY / NUM_SEC_IN_MIN) - x);

//#define DISABLESCHEDULES

let gpScheduleList: SCHEDULENODE | null = null;
export let gubScheduleID: UINT8 = 0;

// IMPORTANT:
// This function adds a NEWLY allocated schedule to the list.  The pointer passed is totally
// separate.  So make sure that you delete the pointer if you don't need it anymore.  The editor
// uses a single static node to copy data from, hence this method.
export function CopyScheduleToList(pSchedule: SCHEDULENODE, pNode: SOLDIERINITNODE): void {
  let curr: SCHEDULENODE | null;
  curr = gpScheduleList;
  gpScheduleList = createScheduleNode();
  copyScheduleNode(gpScheduleList, pSchedule);
  gpScheduleList.next = curr;
  gubScheduleID++;
  // Assign all of the links
  gpScheduleList.ubScheduleID = gubScheduleID;
  gpScheduleList.ubSoldierID = (<SOLDIERTYPE>pNode.pSoldier).ubID;
  (<SOLDIERCREATE_STRUCT>pNode.pDetailedPlacement).ubScheduleID = gubScheduleID;
  (<SOLDIERTYPE>pNode.pSoldier).ubScheduleID = gubScheduleID;
  if (gubScheduleID > 40) {
    // Too much fragmentation, clean it up...
    OptimizeSchedules();
    if (gubScheduleID > 32) {
      AssertMsg(0, "TOO MANY SCHEDULES POSTED!!!");
    }
  }
}

export function GetSchedule(ubScheduleID: UINT8): SCHEDULENODE | null {
  let curr: SCHEDULENODE | null;
  curr = gpScheduleList;
  while (curr) {
    if (curr.ubScheduleID == ubScheduleID)
      return curr;
    curr = curr.next;
  }
  return null;
}

// Removes all schedules from the event list, and cleans out the list.
export function DestroyAllSchedules(): void {
  let curr: SCHEDULENODE;
  // First remove all of the events.
  DeleteAllStrategicEventsOfType(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE);
  // Now, delete all of the schedules.
  while (gpScheduleList) {
    curr = gpScheduleList;
    gpScheduleList = gpScheduleList.next;
  }
  gpScheduleList = null;
  gubScheduleID = 0;
}

// cleans out the schedule list without touching events, for saving & loading games
export function DestroyAllSchedulesWithoutDestroyingEvents(): void {
  let curr: SCHEDULENODE;

  // delete all of the schedules.
  while (gpScheduleList) {
    curr = gpScheduleList;
    gpScheduleList = gpScheduleList.next;
  }
  gpScheduleList = null;
  gubScheduleID = 0;
}

export function DeleteSchedule(ubScheduleID: UINT8): void {
  let curr: SCHEDULENODE | null;
  let temp: SCHEDULENODE | null = null;

  if (!gpScheduleList) {
    // ScreenMsg( 0, MSG_BETAVERSION, L"Attempting to delete schedule that doesn't exist -- KM : 2" );
    return;
  }

  curr = gpScheduleList;

  if (gpScheduleList.ubScheduleID == ubScheduleID) {
    // Deleting the head
    temp = gpScheduleList;
    gpScheduleList = gpScheduleList.next;
  } else
    while (curr.next) {
      if (curr.next.ubScheduleID == ubScheduleID) {
        temp = curr.next;
        curr.next = temp.next;
        break;
      }
      curr = curr.next;
    }
  if (temp) {
    DeleteStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, temp.ubScheduleID);
  }
}

export function ProcessTacticalSchedule(ubScheduleID: UINT8): void {
  let pSchedule: SCHEDULENODE | null;
  let pSoldier: SOLDIERTYPE;
  let iScheduleIndex: INT32 = 0;
  let fAutoProcess: boolean;

  // Attempt to locate the schedule.
  pSchedule = GetSchedule(ubScheduleID);
  if (!pSchedule) {
    return;
  }
  // Attempt to access the soldier involved
  if (pSchedule.ubSoldierID >= TOTAL_SOLDIERS) {
    return;
  }

  // Validate the existance of the soldier.
  pSoldier = MercPtrs[pSchedule.ubSoldierID];
  if (pSoldier.bLife < OKLIFE) {
    // dead or dying!
    return;
  }

  if (!pSoldier.bActive) {
  }

  // Okay, now we have good pointers to the soldier and the schedule.
  // Now, determine which time in this schedule that we are processing.
  fAutoProcess = false;
  if (guiCurrentScreen != Enum26.GAME_SCREEN) {
    fAutoProcess = true;
  } else {
    for (iScheduleIndex = 0; iScheduleIndex < MAX_SCHEDULE_ACTIONS; iScheduleIndex++) {
      if (pSchedule.usTime[iScheduleIndex] == GetWorldMinutesInDay()) {
        break;
      }
    }
    if (iScheduleIndex == MAX_SCHEDULE_ACTIONS) {
      fAutoProcess = true;
    }
  }
  if (fAutoProcess) {
    let uiStartTime: UINT32;
    let uiEndTime: UINT32;
    // Grab the last time the eventlist was queued.  This will tell us how much time has passed since that moment,
    // and how long we need to auto process this schedule.
    uiStartTime = Math.trunc(guiTimeOfLastEventQuery / 60) % NUM_MIN_IN_DAY;
    uiEndTime = GetWorldMinutesInDay();
    if (uiStartTime != uiEndTime) {
      PrepareScheduleForAutoProcessing(pSchedule, uiStartTime, uiEndTime);
    }
  } else {
    // turn off all active-schedule flags before setting
    // the one that should be active!
    pSchedule.usFlags &= ~SCHEDULE_FLAGS_ACTIVE_ALL;

    switch (iScheduleIndex) {
      case 0:
        pSchedule.usFlags |= SCHEDULE_FLAGS_ACTIVE1;
        break;
      case 1:
        pSchedule.usFlags |= SCHEDULE_FLAGS_ACTIVE2;
        break;
      case 2:
        pSchedule.usFlags |= SCHEDULE_FLAGS_ACTIVE3;
        break;
      case 3:
        pSchedule.usFlags |= SCHEDULE_FLAGS_ACTIVE4;
        break;
    }
    pSoldier.fAIFlags |= AI_CHECK_SCHEDULE;
    pSoldier.bAIScheduleProgress = 0;
  }
}

// Called before leaving the editor, or saving the map.  This recalculates
// all of the schedule IDs from scratch and adjusts the effected structures accordingly.
export function OptimizeSchedules(): void {
  let pSchedule: SCHEDULENODE | null;
  let pNode: SOLDIERINITNODE | null;
  let ubOldScheduleID: UINT8;
  gubScheduleID = 0;
  pSchedule = gpScheduleList;
  while (pSchedule) {
    gubScheduleID++;
    ubOldScheduleID = pSchedule.ubScheduleID;
    if (ubOldScheduleID != gubScheduleID) {
      // The schedule ID has changed, so change all links accordingly.
      pSchedule.ubScheduleID = gubScheduleID;
      pNode = gSoldierInitHead;
      while (pNode) {
        if (pNode.pDetailedPlacement && pNode.pDetailedPlacement.ubScheduleID == ubOldScheduleID) {
          // Temporarily add 100 to the ID number to ensure that it doesn't get used again later.
          // We will remove it immediately after this loop is complete.
          pNode.pDetailedPlacement.ubScheduleID = gubScheduleID + 100;
          if (pNode.pSoldier) {
            pNode.pSoldier.ubScheduleID = gubScheduleID;
          }
          break;
        }
        pNode = pNode.next;
      }
    }
    pSchedule = pSchedule.next;
  }
  // Remove the +100 IDs.
  pNode = gSoldierInitHead;
  while (pNode) {
    if (pNode.pDetailedPlacement && pNode.pDetailedPlacement.ubScheduleID > 100) {
      pNode.pDetailedPlacement.ubScheduleID -= 100;
    }
    pNode = pNode.next;
  }
}

// Called when transferring from the game to the editor.
export function PrepareSchedulesForEditorEntry(): void {
  let curr: SCHEDULENODE | null;
  let prev: SCHEDULENODE | null;
  let temp: SCHEDULENODE;

  // Delete all schedule events.  The editor will automatically warp all civilians to their starting locations.
  DeleteAllStrategicEventsOfType(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE);

  // Now, delete all of the temporary schedules.
  curr = gpScheduleList;
  prev = null;
  while (curr) {
    if (curr.usFlags & SCHEDULE_FLAGS_TEMPORARY) {
      if (prev)
        prev.next = curr.next;
      else
        gpScheduleList = (<SCHEDULENODE>gpScheduleList).next;
      MercPtrs[curr.ubSoldierID].ubScheduleID = 0;
      temp = curr;
      curr = curr.next;
      gubScheduleID--;
    } else {
      if (curr.usFlags & SCHEDULE_FLAGS_SLEEP_CONVERTED) {
        // uncovert it!
        let i: INT32;
        for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
          // if( i
        }
      }
      prev = curr;
      curr = curr.next;
    }
  }
}

// Called when leaving the editor to enter the game.  This posts all of the events that apply.
export function PrepareSchedulesForEditorExit(): void {
  PostSchedules();
}

export function LoadSchedules(buffer: Buffer, offset: number): number {
  let pSchedule: SCHEDULENODE | null = null;
  let temp: SCHEDULENODE = createScheduleNode();
  let ubNum: UINT8;

  // delete all the schedules we might have loaded (though we shouldn't have any loaded!!)
  if (gpScheduleList) {
    DestroyAllSchedules();
  }

  ubNum = buffer.readUInt8(offset++);
  gubScheduleID = 1;
  while (ubNum) {
    offset = readScheduleNode(temp, buffer, offset);

    if (pSchedule) {
      pSchedule.next = createScheduleNode();
      Assert(pSchedule.next);
      pSchedule = pSchedule.next;
      copyScheduleNode(pSchedule, temp);
    } else {
      gpScheduleList = createScheduleNode();
      Assert(gpScheduleList);
      copyScheduleNode(gpScheduleList, temp);
      pSchedule = gpScheduleList;
    }
    pSchedule.ubScheduleID = gubScheduleID;
    pSchedule.ubSoldierID = NO_SOLDIER;
    pSchedule.next = null;
    gubScheduleID++;
    ubNum--;
  }
  // Schedules are posted when the soldier is added...

  return offset;
}

export function LoadSchedulesFromSave(hFile: HWFILE): boolean {
  let pSchedule: SCHEDULENODE | null = null;
  let temp: SCHEDULENODE = createScheduleNode();
  let ubNum: UINT8;
  let ubRealNum: UINT32;

  let uiNumBytesRead: UINT32;
  let uiNumBytesToRead: UINT32;
  let buffer: Buffer;

  // LOADDATA( &ubNum, *hBuffer, sizeof( UINT8 ) );
  buffer = Buffer.allocUnsafe(1);
  uiNumBytesToRead = 1;
  uiNumBytesRead = FileRead(hFile, buffer, uiNumBytesToRead);
  if (uiNumBytesRead != uiNumBytesToRead) {
    FileClose(hFile);
    return false;
  }

  ubNum = buffer.readUInt8(0);

  // Hack problem with schedules getting misaligned.
  ubRealNum = gfSchedulesHosed ? ubNum + 256 : ubNum;

  buffer = Buffer.allocUnsafe(SCHEDULE_NODE_SIZE);
  gubScheduleID = 1;
  while (ubRealNum) {
    uiNumBytesToRead = SCHEDULE_NODE_SIZE;
    uiNumBytesRead = FileRead(hFile, buffer, uiNumBytesToRead);
    if (uiNumBytesRead != uiNumBytesToRead) {
      FileClose(hFile);
      return false;
    }
    // LOADDATA( &temp, *hBuffer, sizeof( SCHEDULENODE ) );

    readScheduleNode(temp, buffer);

    if (pSchedule) {
      pSchedule.next = createScheduleNode();
      Assert(pSchedule.next);
      pSchedule = pSchedule.next;
      copyScheduleNode(pSchedule, temp);
    } else {
      gpScheduleList = createScheduleNode();
      Assert(gpScheduleList);
      copyScheduleNode(gpScheduleList, temp);
      pSchedule = gpScheduleList;
    }

    // should be unnecessary here, then we can toast reconnect schedule
    /*
    pSchedule->ubScheduleID = gubScheduleID;
    pSchedule->ubSoldierID = NO_SOLDIER;
    */

    pSchedule.next = null;
    gubScheduleID++;
    ubRealNum--;
  }
  // Schedules are posted when the soldier is added...
  return true;
}

// used to fix a bug in the editor where the schedules were reversed.  Because only
// some maps were effected, this feature was required.
export function ReverseSchedules(): void {
  let pReverseHead: SCHEDULENODE | null;
  let pPrevReverseHead: SCHEDULENODE | null;
  let pPrevScheduleHead: SCHEDULENODE;
  let ubOppositeID: UINT8 = gubScheduleID;
  // First, remove any gaps which would mess up the reverse ID assignment by optimizing
  // the schedules.
  OptimizeSchedules();
  pReverseHead = null;
  while (gpScheduleList) {
    // reverse the ID
    gpScheduleList.ubScheduleID = ubOppositeID;
    ubOppositeID--;
    // detach current schedule head from list and advance it
    pPrevScheduleHead = gpScheduleList;
    gpScheduleList = gpScheduleList.next;
    // get previous reversed list head (even if null)
    pPrevReverseHead = pReverseHead;
    // Assign the previous schedule head to the reverse head
    pReverseHead = pPrevScheduleHead;
    // Point the next to the previous reverse head.
    pReverseHead.next = pPrevReverseHead;
  }
  // Now assign the schedule list to the reverse head.
  gpScheduleList = pReverseHead;
}

// Another debug feature.
export function ClearAllSchedules(): void {
  let pNode: SOLDIERINITNODE | null;
  DestroyAllSchedules();
  pNode = gSoldierInitHead;
  while (pNode) {
    if (pNode.pDetailedPlacement && pNode.pDetailedPlacement.ubScheduleID) {
      pNode.pDetailedPlacement.ubScheduleID = 0;
      if (pNode.pSoldier) {
        pNode.pSoldier.ubScheduleID = 0;
      }
    }
    pNode = pNode.next;
  }
}

export function SaveSchedules(hFile: HWFILE): boolean {
  let curr: SCHEDULENODE | null;
  let uiBytesWritten: UINT32;
  let ubNum: UINT8;
  let ubNumFucker: UINT8;
  let iNum: INT32;
  let buffer: Buffer;

  // Now, count the number of schedules in the list
  iNum = 0;
  curr = gpScheduleList;
  while (curr) {
    // skip all default schedules
    if (!(curr.usFlags & SCHEDULE_FLAGS_TEMPORARY)) {
      iNum++;
    }
    curr = curr.next;
  }
  ubNum = ((iNum >= 32) ? 32 : iNum);

  buffer = Buffer.allocUnsafe(1);
  buffer.writeUInt8(ubNum, 0);
  uiBytesWritten = FileWrite(hFile, buffer, 1);
  if (uiBytesWritten != 1) {
    return false;
  }
  // Now, save each schedule
  buffer = Buffer.allocUnsafe(SCHEDULE_NODE_SIZE);
  curr = gpScheduleList;
  ubNumFucker = 0;
  while (curr) {
    // skip all default schedules
    if (!(curr.usFlags & SCHEDULE_FLAGS_TEMPORARY)) {
      ubNumFucker++;
      if (ubNumFucker > ubNum) {
        return true;
      }

      writeScheduleNode(curr, buffer);
      uiBytesWritten = FileWrite(hFile, buffer, SCHEDULE_NODE_SIZE);
      if (uiBytesWritten != SCHEDULE_NODE_SIZE) {
        return false;
      }
    }
    curr = curr.next;
  }
  return true;
}

// Each schedule has upto four parts to it, so sort them chronologically.
// Happily, the fields with no times actually are the highest.
export function SortSchedule(pSchedule: SCHEDULENODE): boolean {
  let index: INT32;
  let i: INT32;
  let iBestIndex: INT32;
  let usTime: UINT16;
  let usData1: UINT16;
  let usData2: UINT16;
  let ubAction: UINT8;
  let fSorted: boolean = false;

  // Use a bubblesort method (max:  3 switches).
  index = 0;
  while (index < 3) {
    usTime = 0xffff;
    iBestIndex = index;
    for (i = index; i < MAX_SCHEDULE_ACTIONS; i++) {
      if (pSchedule.usTime[i] < usTime) {
        usTime = pSchedule.usTime[i];
        iBestIndex = i;
      }
    }
    if (iBestIndex != index) {
      // we will swap the best index with the current index.
      fSorted = true;
      usTime = pSchedule.usTime[index];
      usData1 = pSchedule.usData1[index];
      usData2 = pSchedule.usData2[index];
      ubAction = pSchedule.ubAction[index];
      pSchedule.usTime[index] = pSchedule.usTime[iBestIndex];
      pSchedule.usData1[index] = pSchedule.usData1[iBestIndex];
      pSchedule.usData2[index] = pSchedule.usData2[iBestIndex];
      pSchedule.ubAction[index] = pSchedule.ubAction[iBestIndex];
      pSchedule.usTime[iBestIndex] = usTime;
      pSchedule.usData1[iBestIndex] = usData1;
      pSchedule.usData2[iBestIndex] = usData2;
      pSchedule.ubAction[iBestIndex] = ubAction;
    }
    index++;
  }
  return fSorted;
}

export function BumpAnyExistingMerc(sGridNo: INT16): boolean {
  let ubID: UINT8;
  let pSoldier: SOLDIERTYPE; // NB this is the person already in the location,
  let sNewGridNo: INT16;
  let ubDir: UINT8;
  let sCellX: INT16;
  let sCellY: INT16;

  // this is for autoprocessing schedules...
  // there could be someone in the destination location, in which case
  // we want to 'bump' them to the nearest available spot

  if (!GridNoOnVisibleWorldTile(sGridNo)) {
    return true;
  }

  ubID = WhoIsThere2(sGridNo, 0);

  if (ubID == NOBODY) {
    return true;
  }

  pSoldier = MercPtrs[ubID];

  // what if the existing merc is prone?
  sNewGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, Enum193.STANDING, 5, createPointer(() => ubDir, (v) => ubDir = v), 1, pSoldier);
  // sNewGridNo = FindGridNoFromSweetSpotExcludingSweetSpot( pSoldier, sGridNo, 10, &ubDir );

  if (sNewGridNo == NOWHERE) {
    return false;
  }

  ({ sCellX, sCellY } = ConvertGridNoToCellXY(sNewGridNo));
  EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);

  return true;
}

function AutoProcessSchedule(pSchedule: SCHEDULENODE, index: INT32): void {
  let sCellX: INT16;
  let sCellY: INT16;
  let sGridNo: INT16;
  let bDirection: INT8;
  let bDirection__Pointer = createPointer(() => bDirection, (v) => bDirection = v);
  let pSoldier: SOLDIERTYPE;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    // CJC, November 28th:  when reloading a saved game we want events posted but no events autoprocessed since
    // that could change civilian positions.  So rather than doing a bunch of checks outside of this function,
    // I thought it easier to screen them out here.
    return;
  }

  pSoldier = MercPtrs[pSchedule.ubSoldierID];

  if (pSoldier.ubProfile != NO_PROFILE) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Autoprocessing schedule action %S for %S (%d) at time %02ld:%02ld (set for %02d:%02d), data1 = %d", gszScheduleActions[pSchedule.ubAction[index]], pSoldier.name, pSoldier.ubID, GetWorldHour(), guiMin, Math.trunc(pSchedule.usTime[index] / 60), pSchedule.usTime[index] % 60, pSchedule.usData1[index]));
  } else {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Autoprocessing schedule action %S for civ (%d) at time %02ld:%02ld (set for %02d:%02d), data1 = %d", gszScheduleActions[pSchedule.ubAction[index]], pSoldier.ubID, GetWorldHour(), guiMin, Math.trunc(pSchedule.usTime[index] / 60), pSchedule.usTime[index] % 60, pSchedule.usData1[index]));
  }

  // always assume the merc is going to wake, unless the event is a sleep
  pSoldier.fAIFlags &= ~(AI_ASLEEP);

  switch (pSchedule.ubAction[index]) {
    case Enum171.SCHEDULE_ACTION_LOCKDOOR:
    case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
    case Enum171.SCHEDULE_ACTION_OPENDOOR:
    case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
      PerformActionOnDoorAdjacentToGridNo(pSchedule.ubAction[index], pSchedule.usData1[index]);
      BumpAnyExistingMerc(pSchedule.usData2[index]);
      ({ sCellX, sCellY } = ConvertGridNoToCellXY(pSchedule.usData2[index]));

      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      if (GridNoOnEdgeOfMap(pSchedule.usData2[index], bDirection__Pointer)) {
        // civ should go off map; this tells us where the civ will return
        pSoldier.sOffWorldGridNo = pSchedule.usData2[index];
        MoveSoldierFromMercToAwaySlot(pSoldier);
        pSoldier.bInSector = false;
      } else {
        // let this person patrol from here from now on
        pSoldier.usPatrolGrid[0] = pSchedule.usData2[index];
      }
      break;
    case Enum171.SCHEDULE_ACTION_GRIDNO:
      BumpAnyExistingMerc(pSchedule.usData1[index]);
      ({ sCellX, sCellY } = ConvertGridNoToCellXY(pSchedule.usData1[index]));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      // let this person patrol from here from now on
      pSoldier.usPatrolGrid[0] = pSchedule.usData1[index];
      break;
    case Enum171.SCHEDULE_ACTION_ENTERSECTOR:
      if (pSoldier.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.ubProfile].ubMiscFlags2 & PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR) {
        // never process enter if flag is set
        break;
      }
      BumpAnyExistingMerc(pSchedule.usData1[index]);
      ({ sCellX, sCellY } = ConvertGridNoToCellXY(pSchedule.usData1[index]));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      MoveSoldierFromAwayToMercSlot(pSoldier);
      pSoldier.bInSector = true;
      // let this person patrol from here from now on
      pSoldier.usPatrolGrid[0] = pSchedule.usData1[index];
      break;
    case Enum171.SCHEDULE_ACTION_WAKE:
      BumpAnyExistingMerc(pSoldier.sInitialGridNo);
      ({ sCellX, sCellY } = ConvertGridNoToCellXY(pSoldier.sInitialGridNo));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      // let this person patrol from here from now on
      pSoldier.usPatrolGrid[0] = pSoldier.sInitialGridNo;
      break;
    case Enum171.SCHEDULE_ACTION_SLEEP:
      pSoldier.fAIFlags |= AI_ASLEEP;
      // check for someone else in the location
      BumpAnyExistingMerc(pSchedule.usData1[index]);
      ({ sCellX, sCellY } = ConvertGridNoToCellXY(pSchedule.usData1[index]));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      pSoldier.usPatrolGrid[0] = pSchedule.usData1[index];
      break;
    case Enum171.SCHEDULE_ACTION_LEAVESECTOR:
      sGridNo = FindNearestEdgePoint(pSoldier.sGridNo);
      BumpAnyExistingMerc(sGridNo);
      ({ sCellX, sCellY } = ConvertGridNoToCellXY(sGridNo));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);

      sGridNo = FindNearbyPointOnEdgeOfMap(pSoldier, bDirection__Pointer);
      BumpAnyExistingMerc(sGridNo);
      ({ sCellX, sCellY } = ConvertGridNoToCellXY(sGridNo));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);

      // ok, that tells us where the civ will return
      pSoldier.sOffWorldGridNo = sGridNo;
      MoveSoldierFromMercToAwaySlot(pSoldier);
      pSoldier.bInSector = false;
      break;
  }
}

function PostSchedule(pSoldier: SOLDIERTYPE): void {
  let uiStartTime: UINT32;
  let uiEndTime: UINT32;
  let i: INT32;
  let bEmpty: INT8;
  let pSchedule: SCHEDULENODE | null;
  let ubTempAction: UINT8;
  let usTemp: UINT16;

  if ((pSoldier.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP) && (gTacticalStatus.fCivGroupHostile[Enum246.KINGPIN_CIV_GROUP] || ((gubQuest[Enum169.QUEST_KINGPIN_MONEY] == QUESTINPROGRESS) && (CheckFact(Enum170.FACT_KINGPIN_CAN_SEND_ASSASSINS, Enum268.KINGPIN)))) && (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_C) && (pSoldier.ubProfile == NO_PROFILE)) {
    // no schedules for people guarding Tony's!
    return;
  }

  pSchedule = GetSchedule(pSoldier.ubScheduleID);
  if (!pSchedule)
    return;

  if (pSoldier.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE) {
    // don't process schedule
    return;
  }

  // if this schedule doesn't have a time associated with it, then generate a time, but only
  // if it is a sleep schedule.
  for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
    if (pSchedule.ubAction[i] == Enum171.SCHEDULE_ACTION_SLEEP) {
      // first make sure that this merc has a unique spot to sleep in
      SecureSleepSpot(pSoldier, pSchedule.usData1[i]);

      if (pSchedule.usTime[i] == 0xffff) {
        pSchedule.usTime[i] = ((21 * 60) + Random((3 * 60))); // 9PM - 11:59PM

        if (ScheduleHasMorningNonSleepEntries(pSchedule)) {
          // this guy will sleep until the next non-sleep event
        } else {
          bEmpty = GetEmptyScheduleEntry(pSchedule);
          if (bEmpty != -1) {
            // there is an empty entry for the wakeup call

            // NB the wakeup call must be ordered first! so we have to create the
            // wake action and then swap the two.
            pSchedule.ubAction[bEmpty] = Enum171.SCHEDULE_ACTION_WAKE;
            pSchedule.usTime[bEmpty] = (pSchedule.usTime[i] + (8 * 60)) % NUM_MIN_IN_DAY; // sleep for 8 hours

            ubTempAction = pSchedule.ubAction[bEmpty];
            pSchedule.ubAction[bEmpty] = pSchedule.ubAction[i];
            pSchedule.ubAction[i] = ubTempAction;

            usTemp = pSchedule.usTime[bEmpty];
            pSchedule.usTime[bEmpty] = pSchedule.usTime[i];
            pSchedule.usTime[i] = usTemp;

            usTemp = pSchedule.usData1[bEmpty];
            pSchedule.usData1[bEmpty] = pSchedule.usData1[i];
            pSchedule.usData1[i] = usTemp;

            usTemp = pSchedule.usData2[bEmpty];
            pSchedule.usData2[bEmpty] = pSchedule.usData2[i];
            pSchedule.usData2[i] = usTemp;
          } else {
            // no morning entries but no space for a wakeup either, will sleep till
            // next non-sleep event
          }
        }
        break; // The break is here because nobody should have more than one sleep schedule with no time specified.
      }
    }
  }

  pSchedule.ubSoldierID = pSoldier.ubID;

  // always process previous 24 hours
  uiEndTime = GetWorldTotalMin();
  uiStartTime = uiEndTime - (NUM_MIN_IN_DAY - 1);

  /*
  //First thing we need is to get the time that the map was last loaded.  If more than 24 hours,
  //then process only 24 hours.  If less, then process all the schedules that would have happened within
  //that period of time.
  uiEndTime = GetWorldTotalMin();
  if( GetWorldTotalMin() - guiTimeCurrentSectorWasLastLoaded > NUM_MIN_IN_DAY )
  { //Process the last 24 hours
          uiStartTime = uiEndTime - (NUM_MIN_IN_DAY - 1);
  }
  else
  { //Process the time since we were last here.
          uiStartTime = guiTimeCurrentSectorWasLastLoaded;
  }
  */

  // Need a way to determine if the player has actually modified doors since this civilian was last loaded
  uiEndTime %= NUM_MIN_IN_DAY;
  uiStartTime %= NUM_MIN_IN_DAY;
  PrepareScheduleForAutoProcessing(pSchedule, uiStartTime, uiEndTime);
}

function PrepareScheduleForAutoProcessing(pSchedule: SCHEDULENODE, uiStartTime: UINT32, uiEndTime: UINT32): void {
  let i: INT32;
  let fPostedNextEvent: boolean = false;

  if (uiStartTime > uiEndTime) {
    // The start time is later in the day than the end time, which means we'll be wrapping
    // through midnight and continuing to the end time.
    for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
      if (pSchedule.usTime[i] == 0xffff)
        break;
      if (pSchedule.usTime[i] >= uiStartTime) {
        AutoProcessSchedule(pSchedule, i);
      }
    }
    for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
      if (pSchedule.usTime[i] == 0xffff)
        break;
      if (pSchedule.usTime[i] <= uiEndTime) {
        AutoProcessSchedule(pSchedule, i);
      } else {
        // CJC: Note that end time is always passed in here as the current time so GetWorldDayInMinutes will be for the correct day
        AddStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, GetWorldDayInMinutes() + pSchedule.usTime[i], pSchedule.ubScheduleID);
        fPostedNextEvent = true;
        break;
      }
    }
  } else {
    // Much simpler:  start at the start and continue to the end.
    for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
      if (pSchedule.usTime[i] == 0xffff)
        break;

      if (pSchedule.usTime[i] >= uiStartTime && pSchedule.usTime[i] <= uiEndTime) {
        AutoProcessSchedule(pSchedule, i);
      } else if (pSchedule.usTime[i] >= uiEndTime) {
        fPostedNextEvent = true;
        AddStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, GetWorldDayInMinutes() + pSchedule.usTime[i], pSchedule.ubScheduleID);
        break;
      }
    }
  }

  if (!fPostedNextEvent) {
    // reached end of schedule, post first event for soldier in the next day
    // 0th event will be first.
    // Feb 1:  ONLY IF THERE IS A VALID EVENT TO POST WITH A VALID TIME!
    if (pSchedule.usTime[0] != 0xffff) {
      AddStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, GetWorldDayInMinutes() + NUM_MIN_IN_DAY + pSchedule.usTime[0], pSchedule.ubScheduleID);
    }
  }
}

// Leave at night, come back in the morning.  The time variances are a couple hours, so
// the town doesn't turn into a ghost town in 5 minutes.
function PostDefaultSchedule(pSoldier: SOLDIERTYPE): void {
  let i: INT32;
  let curr: SCHEDULENODE | null;

  if (gbWorldSectorZ) {
    // People in underground sectors don't get schedules.
    return;
  }
  // Create a new node at the head of the list.  The head will become the new schedule
  // we are about to add.
  curr = gpScheduleList;
  gpScheduleList = createScheduleNode();
  gpScheduleList.next = curr;
  gubScheduleID++;
  // Assign all of the links
  gpScheduleList.ubScheduleID = gubScheduleID;
  gpScheduleList.ubSoldierID = pSoldier.ubID;
  pSoldier.ubScheduleID = gubScheduleID;

  // Clear the data inside the schedule
  for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
    gpScheduleList.usTime[i] = 0xffff;
    gpScheduleList.usData1[i] = 0xffff;
    gpScheduleList.usData2[i] = 0xffff;
  }
  // Have the default schedule enter between 7AM and 8AM
  gpScheduleList.ubAction[0] = Enum171.SCHEDULE_ACTION_ENTERSECTOR;
  gpScheduleList.usTime[0] = (420 + Random(61));
  gpScheduleList.usData1[0] = pSoldier.sInitialGridNo;
  // Have the default schedule leave between 6PM and 8PM
  gpScheduleList.ubAction[1] = Enum171.SCHEDULE_ACTION_LEAVESECTOR;
  gpScheduleList.usTime[1] = (1080 + Random(121));
  gpScheduleList.usFlags |= SCHEDULE_FLAGS_TEMPORARY;

  if (gubScheduleID == 255) {
    // Too much fragmentation, clean it up...
    OptimizeSchedules();
    if (gubScheduleID == 255) {
      AssertMsg(0, "TOO MANY SCHEDULES POSTED!!!");
    }
  }

  PostSchedule(pSoldier);
}

export function PostSchedules(): void {
  let curr: SOLDIERINITNODE | null;
  let fDefaultSchedulesPossible: boolean = false;

  // If no way to leave the map, then don't post default schedules.
  if (gMapInformation.sNorthGridNo != -1 || gMapInformation.sEastGridNo != -1 || gMapInformation.sSouthGridNo != -1 || gMapInformation.sWestGridNo != -1) {
    fDefaultSchedulesPossible = true;
  }
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.pSoldier && curr.pSoldier.bTeam == CIV_TEAM) {
      if (curr.pDetailedPlacement && curr.pDetailedPlacement.ubScheduleID) {
        PostSchedule(curr.pSoldier);
      } else if (fDefaultSchedulesPossible) {
        // ATE: There should be a better way here...
        if (curr.pSoldier.ubBodyType != Enum194.COW && curr.pSoldier.ubBodyType != Enum194.BLOODCAT && curr.pSoldier.ubBodyType != Enum194.HUMVEE && curr.pSoldier.ubBodyType != Enum194.ELDORADO && curr.pSoldier.ubBodyType != Enum194.ICECREAMTRUCK && curr.pSoldier.ubBodyType != Enum194.JEEP) {
          PostDefaultSchedule(curr.pSoldier);
        }
      }
    }
    curr = curr.next;
  }
}

function PerformActionOnDoorAdjacentToGridNo(ubScheduleAction: UINT8, usGridNo: UINT16): void {
  let sDoorGridNo: INT16;
  let pDoor: DOOR | null;

  sDoorGridNo = FindDoorAtGridNoOrAdjacent(usGridNo);
  if (sDoorGridNo != NOWHERE) {
    switch (ubScheduleAction) {
      case Enum171.SCHEDULE_ACTION_LOCKDOOR:
        pDoor = FindDoorInfoAtGridNo(sDoorGridNo);
        if (pDoor) {
          pDoor.fLocked = true;
        }
        // make sure it's closed as well
        ModifyDoorStatus(sDoorGridNo, false, DONTSETDOORSTATUS);
        break;
      case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
        pDoor = FindDoorInfoAtGridNo(sDoorGridNo);
        if (pDoor) {
          pDoor.fLocked = false;
        }
        break;
      case Enum171.SCHEDULE_ACTION_OPENDOOR:
        ModifyDoorStatus(sDoorGridNo, true, DONTSETDOORSTATUS);
        break;
      case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
        ModifyDoorStatus(sDoorGridNo, false, DONTSETDOORSTATUS);
        break;
    }
  }
}

// Assumes that a schedule has just been processed.  This takes the current time, and compares it to the
// schedule, and looks for the next schedule action that would get processed and posts it.
export function PostNextSchedule(pSoldier: SOLDIERTYPE): void {
  let pSchedule: SCHEDULENODE | null;
  let i: INT32;
  let iBestIndex: INT32;
  let usTime: UINT16;
  let usBestTime: UINT16;
  pSchedule = GetSchedule(pSoldier.ubScheduleID);
  if (!pSchedule) {
    // post default?
    return;
  }
  usTime = GetWorldMinutesInDay();
  usBestTime = 0xffff;
  iBestIndex = -1;
  for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
    if (pSchedule.usTime[i] == 0xffff)
      continue;
    if (pSchedule.usTime[i] == usTime)
      continue;
    if (pSchedule.usTime[i] > usTime) {
      if (pSchedule.usTime[i] - usTime < usBestTime) {
        usBestTime = pSchedule.usTime[i] - usTime;
        iBestIndex = i;
      }
    } else if ((NUM_MIN_IN_DAY - (usTime - pSchedule.usTime[i])) < usBestTime) {
      usBestTime = NUM_MIN_IN_DAY - (usTime - pSchedule.usTime[i]);
      iBestIndex = i;
    }
  }
  Assert(iBestIndex >= 0);

  AddStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, GetWorldDayInMinutes() + pSchedule.usTime[iBestIndex], pSchedule.ubScheduleID);
}

function ExtractScheduleEntryAndExitInfo(pSoldier: SOLDIERTYPE, puiEntryTime: Pointer<UINT32>, puiExitTime: Pointer<UINT32>): boolean {
  let iLoop: INT32;
  let fFoundEntryTime: boolean = false;
  let fFoundExitTime: boolean = false;
  let pSchedule: SCHEDULENODE | null;

  puiEntryTime.value = 0;
  puiExitTime.value = 0;

  pSchedule = GetSchedule(pSoldier.ubScheduleID);
  if (!pSchedule) {
    // If person had default schedule then would have been assigned and this would
    // have succeeded.
    // Hence this is an error.
    return false;
  }

  for (iLoop = 0; iLoop < MAX_SCHEDULE_ACTIONS; iLoop++) {
    if (pSchedule.ubAction[iLoop] == Enum171.SCHEDULE_ACTION_ENTERSECTOR) {
      fFoundEntryTime = true;
      puiEntryTime.value = pSchedule.usTime[iLoop];
    } else if (pSchedule.ubAction[iLoop] == Enum171.SCHEDULE_ACTION_LEAVESECTOR) {
      fFoundExitTime = true;
      puiExitTime.value = pSchedule.usTime[iLoop];
    }
  }

  if (fFoundEntryTime && fFoundExitTime) {
    return true;
  } else {
    return false;
  }
}

// This is for determining shopkeeper's opening/closing hours
export function ExtractScheduleDoorLockAndUnlockInfo(pSoldier: SOLDIERTYPE, puiOpeningTime: Pointer<UINT32>, puiClosingTime: Pointer<UINT32>): boolean {
  let iLoop: INT32;
  let fFoundOpeningTime: boolean = false;
  let fFoundClosingTime: boolean = false;
  let pSchedule: SCHEDULENODE | null;

  puiOpeningTime.value = 0;
  puiClosingTime.value = 0;

  pSchedule = GetSchedule(pSoldier.ubScheduleID);
  if (!pSchedule) {
    // If person had default schedule then would have been assigned and this would
    // have succeeded.
    // Hence this is an error.
    return false;
  }

  for (iLoop = 0; iLoop < MAX_SCHEDULE_ACTIONS; iLoop++) {
    if (pSchedule.ubAction[iLoop] == Enum171.SCHEDULE_ACTION_UNLOCKDOOR) {
      fFoundOpeningTime = true;
      puiOpeningTime.value = pSchedule.usTime[iLoop];
    } else if (pSchedule.ubAction[iLoop] == Enum171.SCHEDULE_ACTION_LOCKDOOR) {
      fFoundClosingTime = true;
      puiClosingTime.value = pSchedule.usTime[iLoop];
    }
  }

  if (fFoundOpeningTime && fFoundClosingTime) {
    return true;
  } else {
    return false;
  }
}

function GetEarliestMorningScheduleEvent(pSchedule: SCHEDULENODE, puiTime: Pointer<UINT32>): boolean {
  let iLoop: INT32;
  let fFoundTime: boolean = false;

  puiTime.value = 100000;

  for (iLoop = 0; iLoop < MAX_SCHEDULE_ACTIONS; iLoop++) {
    if (pSchedule.usTime[iLoop] < (12 * 60) && pSchedule.usTime[iLoop] < puiTime.value) {
      puiTime.value = pSchedule.usTime[iLoop];
    }
  }

  if (puiTime.value == 100000) {
    return false;
  } else {
    return true;
  }
}

function ScheduleHasMorningNonSleepEntries(pSchedule: SCHEDULENODE): boolean {
  let bLoop: INT8;

  for (bLoop = 0; bLoop < MAX_SCHEDULE_ACTIONS; bLoop++) {
    if (pSchedule.ubAction[bLoop] != Enum171.SCHEDULE_ACTION_NONE && pSchedule.ubAction[bLoop] != Enum171.SCHEDULE_ACTION_SLEEP) {
      if (pSchedule.usTime[bLoop] < (12 * 60)) {
        return true;
      }
    }
  }
  return false;
}

function GetEmptyScheduleEntry(pSchedule: SCHEDULENODE): INT8 {
  let bLoop: INT8;

  for (bLoop = 0; bLoop < MAX_SCHEDULE_ACTIONS; bLoop++) {
    if (pSchedule.ubAction[bLoop] == Enum171.SCHEDULE_ACTION_NONE) {
      return bLoop;
    }
  }

  return -1;
}

/*
void ReconnectSchedules( void )
{
        UINT32						uiLoop;
        SOLDIERTYPE *			pSoldier;
        SCHEDULENODE *		pSchedule;

        for ( uiLoop = gTacticalStatus.Team[ CIV_TEAM ].bFirstID; uiLoop <= gTacticalStatus.Team[ CIV_TEAM ].bLastID; uiLoop++ )
        {
                pSoldier = MercPtrs[ uiLoop ];
                if ( pSoldier->bActive && pSoldier->bInSector && pSoldier->ubScheduleID != 0 )
                {
                        pSchedule = GetSchedule( pSoldier->ubScheduleID );
                        if ( pSchedule )
                        {
                                // set soldier ptr to point to this guy!
                                pSchedule->ubSoldierID = pSoldier->ubID;
                        }
                        else
                        {
                                // need default schedule!
                                //PostDefaultSchedule( pSoldier );
                        }
                }
        }
}
*/

function FindSleepSpot(pSchedule: SCHEDULENODE): UINT16 {
  let bLoop: INT8;

  for (bLoop = 0; bLoop < MAX_SCHEDULE_ACTIONS; bLoop++) {
    if (pSchedule.ubAction[bLoop] == Enum171.SCHEDULE_ACTION_SLEEP) {
      return pSchedule.usData1[bLoop];
    }
  }
  return NOWHERE;
}

function ReplaceSleepSpot(pSchedule: SCHEDULENODE, usNewSpot: UINT16): void {
  let bLoop: INT8;

  for (bLoop = 0; bLoop < MAX_SCHEDULE_ACTIONS; bLoop++) {
    if (pSchedule.ubAction[bLoop] == Enum171.SCHEDULE_ACTION_SLEEP) {
      pSchedule.usData1[bLoop] = usNewSpot;
      break;
    }
  }
}

function SecureSleepSpot(pSoldier: SOLDIERTYPE, usSleepSpot: UINT16): void {
  let pSoldier2: SOLDIERTYPE;
  let usSleepSpot2: UINT16;
  let usNewSleepSpot: UINT16;
  let uiLoop: UINT32;
  let pSchedule: SCHEDULENODE | null;
  let ubDirection: UINT8;

  // start after this soldier's ID so we don't duplicate work done in previous passes
  for (uiLoop = pSoldier.ubID + 1; uiLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; uiLoop++) {
    pSoldier2 = MercPtrs[uiLoop];
    if (pSoldier2.bActive && pSoldier2.bInSector && pSoldier2.ubScheduleID != 0) {
      pSchedule = GetSchedule(pSoldier2.ubScheduleID);
      if (pSchedule) {
        usSleepSpot2 = FindSleepSpot(pSchedule);
        if (usSleepSpot2 == usSleepSpot) {
          // conflict!
          // usNewSleepSpot = (INT16) FindGridNoFromSweetSpotWithStructData( pSoldier2, pSoldier2->usAnimState, usSleepSpot2, 3, &ubDirection, FALSE );
          usNewSleepSpot = FindGridNoFromSweetSpotExcludingSweetSpot(pSoldier2, usSleepSpot2, 3, createPointer(() => ubDirection, (v) => ubDirection = v));
          if (usNewSleepSpot != NOWHERE) {
            ReplaceSleepSpot(pSchedule, usNewSleepSpot);
          }
        }
      }
    }
  }
}

/*
void SecureSleepSpots( void )
{
        // make sure no one else has the same sleep dest as another merc, and if they do
        // move extras away!
        UINT32						uiLoop;
        SOLDIERTYPE *			pSoldier;
        SCHEDULENODE *		pSchedule;
        UINT16						usSleepSpot;

        for ( uiLoop = gTacticalStatus.Team[ CIV_TEAM ].bFirstID; uiLoop <= gTacticalStatus.Team[ CIV_TEAM ].bLastID; uiLoop++ )
        {
                pSoldier = MercPtrs[ uiLoop ];
                if ( pSoldier->bActive && pSoldier->bInSector && pSoldier->ubScheduleID != 0 )
                {
                        pSchedule = GetSchedule( pSoldier->ubScheduleID );
                        if ( pSchedule )
                        {
                                usSleepSpot = FindSleepSpot( pSchedule );
                                if ( usSleepSpot != NOWHERE )
                                {
                                        SecureSleepSpot( pSoldier, usSleepSpot );
                                }
                        }
                }
        }

}
*/

}
