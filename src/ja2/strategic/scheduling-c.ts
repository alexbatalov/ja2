namespace ja2 {

const FOURPM = 960;

// waketime is the # of minutes in the day minus the sleep time
const WAKETIME = (x: number) => (NUM_SEC_IN_DAY / NUM_SEC_IN_MIN - x);

//#define DISABLESCHEDULES

let gpScheduleList: Pointer<SCHEDULENODE> = null;
export let gubScheduleID: UINT8 = 0;

// IMPORTANT:
// This function adds a NEWLY allocated schedule to the list.  The pointer passed is totally
// separate.  So make sure that you delete the pointer if you don't need it anymore.  The editor
// uses a single static node to copy data from, hence this method.
export function CopyScheduleToList(pSchedule: Pointer<SCHEDULENODE>, pNode: Pointer<SOLDIERINITNODE>): void {
  let curr: Pointer<SCHEDULENODE>;
  curr = gpScheduleList;
  gpScheduleList = MemAlloc(sizeof(SCHEDULENODE));
  memcpy(gpScheduleList, pSchedule, sizeof(SCHEDULENODE));
  gpScheduleList.value.next = curr;
  gubScheduleID++;
  // Assign all of the links
  gpScheduleList.value.ubScheduleID = gubScheduleID;
  gpScheduleList.value.ubSoldierID = pNode.value.pSoldier.value.ubID;
  pNode.value.pDetailedPlacement.value.ubScheduleID = gubScheduleID;
  pNode.value.pSoldier.value.ubScheduleID = gubScheduleID;
  if (gubScheduleID > 40) {
    // Too much fragmentation, clean it up...
    OptimizeSchedules();
    if (gubScheduleID > 32) {
      AssertMsg(0, "TOO MANY SCHEDULES POSTED!!!");
    }
  }
}

export function GetSchedule(ubScheduleID: UINT8): Pointer<SCHEDULENODE> {
  let curr: Pointer<SCHEDULENODE>;
  curr = gpScheduleList;
  while (curr) {
    if (curr.value.ubScheduleID == ubScheduleID)
      return curr;
    curr = curr.value.next;
  }
  return null;
}

// Removes all schedules from the event list, and cleans out the list.
export function DestroyAllSchedules(): void {
  let curr: Pointer<SCHEDULENODE>;
  // First remove all of the events.
  DeleteAllStrategicEventsOfType(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE);
  // Now, delete all of the schedules.
  while (gpScheduleList) {
    curr = gpScheduleList;
    gpScheduleList = gpScheduleList.value.next;
    MemFree(curr);
  }
  gpScheduleList = null;
  gubScheduleID = 0;
}

// cleans out the schedule list without touching events, for saving & loading games
export function DestroyAllSchedulesWithoutDestroyingEvents(): void {
  let curr: Pointer<SCHEDULENODE>;

  // delete all of the schedules.
  while (gpScheduleList) {
    curr = gpScheduleList;
    gpScheduleList = gpScheduleList.value.next;
    MemFree(curr);
  }
  gpScheduleList = null;
  gubScheduleID = 0;
}

export function DeleteSchedule(ubScheduleID: UINT8): void {
  let curr: Pointer<SCHEDULENODE>;
  let temp: Pointer<SCHEDULENODE> = null;

  if (!gpScheduleList) {
    // ScreenMsg( 0, MSG_BETAVERSION, L"Attempting to delete schedule that doesn't exist -- KM : 2" );
    return;
  }

  curr = gpScheduleList;

  if (gpScheduleList.value.ubScheduleID == ubScheduleID) {
    // Deleting the head
    temp = gpScheduleList;
    gpScheduleList = gpScheduleList.value.next;
  } else
    while (curr.value.next) {
      if (curr.value.next.value.ubScheduleID == ubScheduleID) {
        temp = curr.value.next;
        curr.value.next = temp.value.next;
        break;
      }
      curr = curr.value.next;
    }
  if (temp) {
    DeleteStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, temp.value.ubScheduleID);
    MemFree(temp);
  }
}

export function ProcessTacticalSchedule(ubScheduleID: UINT8): void {
  let pSchedule: Pointer<SCHEDULENODE>;
  let pSoldier: Pointer<SOLDIERTYPE>;
  let iScheduleIndex: INT32 = 0;
  let fAutoProcess: boolean;

  // Attempt to locate the schedule.
  pSchedule = GetSchedule(ubScheduleID);
  if (!pSchedule) {
    return;
  }
  // Attempt to access the soldier involved
  if (pSchedule.value.ubSoldierID >= TOTAL_SOLDIERS) {
    return;
  }

  // Validate the existance of the soldier.
  pSoldier = MercPtrs[pSchedule.value.ubSoldierID];
  if (pSoldier.value.bLife < OKLIFE) {
    // dead or dying!
    return;
  }

  if (!pSoldier.value.bActive) {
  }

  // Okay, now we have good pointers to the soldier and the schedule.
  // Now, determine which time in this schedule that we are processing.
  fAutoProcess = false;
  if (guiCurrentScreen != Enum26.GAME_SCREEN) {
    fAutoProcess = true;
  } else {
    for (iScheduleIndex = 0; iScheduleIndex < MAX_SCHEDULE_ACTIONS; iScheduleIndex++) {
      if (pSchedule.value.usTime[iScheduleIndex] == GetWorldMinutesInDay()) {
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
    uiStartTime = (guiTimeOfLastEventQuery / 60) % NUM_MIN_IN_DAY;
    uiEndTime = GetWorldMinutesInDay();
    if (uiStartTime != uiEndTime) {
      PrepareScheduleForAutoProcessing(pSchedule, uiStartTime, uiEndTime);
    }
  } else {
    // turn off all active-schedule flags before setting
    // the one that should be active!
    pSchedule.value.usFlags &= ~SCHEDULE_FLAGS_ACTIVE_ALL;

    switch (iScheduleIndex) {
      case 0:
        pSchedule.value.usFlags |= SCHEDULE_FLAGS_ACTIVE1;
        break;
      case 1:
        pSchedule.value.usFlags |= SCHEDULE_FLAGS_ACTIVE2;
        break;
      case 2:
        pSchedule.value.usFlags |= SCHEDULE_FLAGS_ACTIVE3;
        break;
      case 3:
        pSchedule.value.usFlags |= SCHEDULE_FLAGS_ACTIVE4;
        break;
    }
    pSoldier.value.fAIFlags |= AI_CHECK_SCHEDULE;
    pSoldier.value.bAIScheduleProgress = 0;
  }
}

// Called before leaving the editor, or saving the map.  This recalculates
// all of the schedule IDs from scratch and adjusts the effected structures accordingly.
export function OptimizeSchedules(): void {
  let pSchedule: Pointer<SCHEDULENODE>;
  let pNode: Pointer<SOLDIERINITNODE>;
  let ubOldScheduleID: UINT8;
  gubScheduleID = 0;
  pSchedule = gpScheduleList;
  while (pSchedule) {
    gubScheduleID++;
    ubOldScheduleID = pSchedule.value.ubScheduleID;
    if (ubOldScheduleID != gubScheduleID) {
      // The schedule ID has changed, so change all links accordingly.
      pSchedule.value.ubScheduleID = gubScheduleID;
      pNode = gSoldierInitHead;
      while (pNode) {
        if (pNode.value.pDetailedPlacement && pNode.value.pDetailedPlacement.value.ubScheduleID == ubOldScheduleID) {
          // Temporarily add 100 to the ID number to ensure that it doesn't get used again later.
          // We will remove it immediately after this loop is complete.
          pNode.value.pDetailedPlacement.value.ubScheduleID = gubScheduleID + 100;
          if (pNode.value.pSoldier) {
            pNode.value.pSoldier.value.ubScheduleID = gubScheduleID;
          }
          break;
        }
        pNode = pNode.value.next;
      }
    }
    pSchedule = pSchedule.value.next;
  }
  // Remove the +100 IDs.
  pNode = gSoldierInitHead;
  while (pNode) {
    if (pNode.value.pDetailedPlacement && pNode.value.pDetailedPlacement.value.ubScheduleID > 100) {
      pNode.value.pDetailedPlacement.value.ubScheduleID -= 100;
    }
    pNode = pNode.value.next;
  }
}

// Called when transferring from the game to the editor.
export function PrepareSchedulesForEditorEntry(): void {
  let curr: Pointer<SCHEDULENODE>;
  let prev: Pointer<SCHEDULENODE>;
  let temp: Pointer<SCHEDULENODE>;

  // Delete all schedule events.  The editor will automatically warp all civilians to their starting locations.
  DeleteAllStrategicEventsOfType(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE);

  // Now, delete all of the temporary schedules.
  curr = gpScheduleList;
  prev = null;
  while (curr) {
    if (curr.value.usFlags & SCHEDULE_FLAGS_TEMPORARY) {
      if (prev)
        prev.value.next = curr.value.next;
      else
        gpScheduleList = gpScheduleList.value.next;
      MercPtrs[curr.value.ubSoldierID].value.ubScheduleID = 0;
      temp = curr;
      curr = curr.value.next;
      MemFree(temp);
      gubScheduleID--;
    } else {
      if (curr.value.usFlags & SCHEDULE_FLAGS_SLEEP_CONVERTED) {
        // uncovert it!
        let i: INT32;
        for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
          // if( i
        }
      }
      prev = curr;
      curr = curr.value.next;
    }
  }
}

// Called when leaving the editor to enter the game.  This posts all of the events that apply.
export function PrepareSchedulesForEditorExit(): void {
  PostSchedules();
}

export function LoadSchedules(hBuffer: Pointer<Pointer<INT8>>): void {
  let pSchedule: Pointer<SCHEDULENODE> = null;
  let temp: SCHEDULENODE = createScheduleNode();
  let ubNum: UINT8;

  // delete all the schedules we might have loaded (though we shouldn't have any loaded!!)
  if (gpScheduleList) {
    DestroyAllSchedules();
  }

  LOADDATA(addressof(ubNum), hBuffer.value, sizeof(UINT8));
  gubScheduleID = 1;
  while (ubNum) {
    LOADDATA(addressof(temp), hBuffer.value, sizeof(SCHEDULENODE));

    if (gpScheduleList) {
      pSchedule.value.next = MemAlloc(sizeof(SCHEDULENODE));
      Assert(pSchedule.value.next);
      pSchedule = pSchedule.value.next;
      memcpy(pSchedule, addressof(temp), sizeof(SCHEDULENODE));
    } else {
      gpScheduleList = MemAlloc(sizeof(SCHEDULENODE));
      Assert(gpScheduleList);
      memcpy(gpScheduleList, addressof(temp), sizeof(SCHEDULENODE));
      pSchedule = gpScheduleList;
    }
    pSchedule.value.ubScheduleID = gubScheduleID;
    pSchedule.value.ubSoldierID = NO_SOLDIER;
    pSchedule.value.next = null;
    gubScheduleID++;
    ubNum--;
  }
  // Schedules are posted when the soldier is added...
}

export function LoadSchedulesFromSave(hFile: HWFILE): boolean {
  let pSchedule: Pointer<SCHEDULENODE> = null;
  let temp: SCHEDULENODE = createScheduleNode();
  let ubNum: UINT8;
  let ubRealNum: UINT32;

  let uiNumBytesRead: UINT32;
  let uiNumBytesToRead: UINT32;

  // LOADDATA( &ubNum, *hBuffer, sizeof( UINT8 ) );
  uiNumBytesToRead = sizeof(UINT8);
  FileRead(hFile, addressof(ubNum), uiNumBytesToRead, addressof(uiNumBytesRead));
  if (uiNumBytesRead != uiNumBytesToRead) {
    FileClose(hFile);
    return false;
  }

  // Hack problem with schedules getting misaligned.
  ubRealNum = gfSchedulesHosed ? ubNum + 256 : ubNum;

  gubScheduleID = 1;
  while (ubRealNum) {
    uiNumBytesToRead = sizeof(SCHEDULENODE);
    FileRead(hFile, addressof(temp), uiNumBytesToRead, addressof(uiNumBytesRead));
    if (uiNumBytesRead != uiNumBytesToRead) {
      FileClose(hFile);
      return false;
    }
    // LOADDATA( &temp, *hBuffer, sizeof( SCHEDULENODE ) );

    if (gpScheduleList) {
      pSchedule.value.next = MemAlloc(sizeof(SCHEDULENODE));
      Assert(pSchedule.value.next);
      pSchedule = pSchedule.value.next;
      memcpy(pSchedule, addressof(temp), sizeof(SCHEDULENODE));
    } else {
      gpScheduleList = MemAlloc(sizeof(SCHEDULENODE));
      Assert(gpScheduleList);
      memcpy(gpScheduleList, addressof(temp), sizeof(SCHEDULENODE));
      pSchedule = gpScheduleList;
    }

    // should be unnecessary here, then we can toast reconnect schedule
    /*
    pSchedule->ubScheduleID = gubScheduleID;
    pSchedule->ubSoldierID = NO_SOLDIER;
    */

    pSchedule.value.next = null;
    gubScheduleID++;
    ubRealNum--;
  }
  // Schedules are posted when the soldier is added...
  return true;
}

// used to fix a bug in the editor where the schedules were reversed.  Because only
// some maps were effected, this feature was required.
export function ReverseSchedules(): void {
  let pReverseHead: Pointer<SCHEDULENODE>;
  let pPrevReverseHead: Pointer<SCHEDULENODE>;
  let pPrevScheduleHead: Pointer<SCHEDULENODE>;
  let ubOppositeID: UINT8 = gubScheduleID;
  // First, remove any gaps which would mess up the reverse ID assignment by optimizing
  // the schedules.
  OptimizeSchedules();
  pReverseHead = null;
  while (gpScheduleList) {
    // reverse the ID
    gpScheduleList.value.ubScheduleID = ubOppositeID;
    ubOppositeID--;
    // detach current schedule head from list and advance it
    pPrevScheduleHead = gpScheduleList;
    gpScheduleList = gpScheduleList.value.next;
    // get previous reversed list head (even if null)
    pPrevReverseHead = pReverseHead;
    // Assign the previous schedule head to the reverse head
    pReverseHead = pPrevScheduleHead;
    // Point the next to the previous reverse head.
    pReverseHead.value.next = pPrevReverseHead;
  }
  // Now assign the schedule list to the reverse head.
  gpScheduleList = pReverseHead;
}

// Another debug feature.
export function ClearAllSchedules(): void {
  let pNode: Pointer<SOLDIERINITNODE>;
  DestroyAllSchedules();
  pNode = gSoldierInitHead;
  while (pNode) {
    if (pNode.value.pDetailedPlacement && pNode.value.pDetailedPlacement.value.ubScheduleID) {
      pNode.value.pDetailedPlacement.value.ubScheduleID = 0;
      if (pNode.value.pSoldier) {
        pNode.value.pSoldier.value.ubScheduleID = 0;
      }
    }
    pNode = pNode.value.next;
  }
}

export function SaveSchedules(hFile: HWFILE): boolean {
  let curr: Pointer<SCHEDULENODE>;
  let uiBytesWritten: UINT32;
  let ubNum: UINT8;
  let ubNumFucker: UINT8;
  let iNum: INT32;
  // Now, count the number of schedules in the list
  iNum = 0;
  curr = gpScheduleList;
  while (curr) {
    // skip all default schedules
    if (!(curr.value.usFlags & SCHEDULE_FLAGS_TEMPORARY)) {
      iNum++;
    }
    curr = curr.value.next;
  }
  ubNum = ((iNum >= 32) ? 32 : iNum);

  FileWrite(hFile, addressof(ubNum), sizeof(UINT8), addressof(uiBytesWritten));
  if (uiBytesWritten != sizeof(UINT8)) {
    return false;
  }
  // Now, save each schedule
  curr = gpScheduleList;
  ubNumFucker = 0;
  while (curr) {
    // skip all default schedules
    if (!(curr.value.usFlags & SCHEDULE_FLAGS_TEMPORARY)) {
      ubNumFucker++;
      if (ubNumFucker > ubNum) {
        return true;
      }
      FileWrite(hFile, curr, sizeof(SCHEDULENODE), addressof(uiBytesWritten));
      if (uiBytesWritten != sizeof(SCHEDULENODE)) {
        return false;
      }
    }
    curr = curr.value.next;
  }
  return true;
}

// Each schedule has upto four parts to it, so sort them chronologically.
// Happily, the fields with no times actually are the highest.
export function SortSchedule(pSchedule: Pointer<SCHEDULENODE>): boolean {
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
      if (pSchedule.value.usTime[i] < usTime) {
        usTime = pSchedule.value.usTime[i];
        iBestIndex = i;
      }
    }
    if (iBestIndex != index) {
      // we will swap the best index with the current index.
      fSorted = true;
      usTime = pSchedule.value.usTime[index];
      usData1 = pSchedule.value.usData1[index];
      usData2 = pSchedule.value.usData2[index];
      ubAction = pSchedule.value.ubAction[index];
      pSchedule.value.usTime[index] = pSchedule.value.usTime[iBestIndex];
      pSchedule.value.usData1[index] = pSchedule.value.usData1[iBestIndex];
      pSchedule.value.usData2[index] = pSchedule.value.usData2[iBestIndex];
      pSchedule.value.ubAction[index] = pSchedule.value.ubAction[iBestIndex];
      pSchedule.value.usTime[iBestIndex] = usTime;
      pSchedule.value.usData1[iBestIndex] = usData1;
      pSchedule.value.usData2[iBestIndex] = usData2;
      pSchedule.value.ubAction[iBestIndex] = ubAction;
    }
    index++;
  }
  return fSorted;
}

export function BumpAnyExistingMerc(sGridNo: INT16): boolean {
  let ubID: UINT8;
  let pSoldier: Pointer<SOLDIERTYPE>; // NB this is the person already in the location,
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
  sNewGridNo = FindGridNoFromSweetSpotWithStructDataFromSoldier(pSoldier, Enum193.STANDING, 5, addressof(ubDir), 1, pSoldier);
  // sNewGridNo = FindGridNoFromSweetSpotExcludingSweetSpot( pSoldier, sGridNo, 10, &ubDir );

  if (sNewGridNo == NOWHERE) {
    return false;
  }

  ConvertGridNoToCellXY(sNewGridNo, addressof(sCellX), addressof(sCellY));
  EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);

  return true;
}

function AutoProcessSchedule(pSchedule: Pointer<SCHEDULENODE>, index: INT32): void {
  let sCellX: INT16;
  let sCellY: INT16;
  let sGridNo: INT16;
  let bDirection: INT8;
  let pSoldier: Pointer<SOLDIERTYPE>;

  if (gTacticalStatus.uiFlags & LOADING_SAVED_GAME) {
    // CJC, November 28th:  when reloading a saved game we want events posted but no events autoprocessed since
    // that could change civilian positions.  So rather than doing a bunch of checks outside of this function,
    // I thought it easier to screen them out here.
    return;
  }

  pSoldier = MercPtrs[pSchedule.value.ubSoldierID];

  if (pSoldier.value.ubProfile != NO_PROFILE) {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Autoprocessing schedule action %S for %S (%d) at time %02ld:%02ld (set for %02d:%02d), data1 = %d", gszScheduleActions[pSchedule.value.ubAction[index]], pSoldier.value.name, pSoldier.value.ubID, GetWorldHour(), guiMin, pSchedule.value.usTime[index] / 60, pSchedule.value.usTime[index] % 60, pSchedule.value.usData1[index]));
  } else {
    DebugMsg(TOPIC_JA2, DBG_LEVEL_3, FormatString("Autoprocessing schedule action %S for civ (%d) at time %02ld:%02ld (set for %02d:%02d), data1 = %d", gszScheduleActions[pSchedule.value.ubAction[index]], pSoldier.value.ubID, GetWorldHour(), guiMin, pSchedule.value.usTime[index] / 60, pSchedule.value.usTime[index] % 60, pSchedule.value.usData1[index]));
  }

  // always assume the merc is going to wake, unless the event is a sleep
  pSoldier.value.fAIFlags &= ~(AI_ASLEEP);

  switch (pSchedule.value.ubAction[index]) {
    case Enum171.SCHEDULE_ACTION_LOCKDOOR:
    case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
    case Enum171.SCHEDULE_ACTION_OPENDOOR:
    case Enum171.SCHEDULE_ACTION_CLOSEDOOR:
      PerformActionOnDoorAdjacentToGridNo(pSchedule.value.ubAction[index], pSchedule.value.usData1[index]);
      BumpAnyExistingMerc(pSchedule.value.usData2[index]);
      ConvertGridNoToCellXY(pSchedule.value.usData2[index], addressof(sCellX), addressof(sCellY));

      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      if (GridNoOnEdgeOfMap(pSchedule.value.usData2[index], addressof(bDirection))) {
        // civ should go off map; this tells us where the civ will return
        pSoldier.value.sOffWorldGridNo = pSchedule.value.usData2[index];
        MoveSoldierFromMercToAwaySlot(pSoldier);
        pSoldier.value.bInSector = false;
      } else {
        // let this person patrol from here from now on
        pSoldier.value.usPatrolGrid[0] = pSchedule.value.usData2[index];
      }
      break;
    case Enum171.SCHEDULE_ACTION_GRIDNO:
      BumpAnyExistingMerc(pSchedule.value.usData1[index]);
      ConvertGridNoToCellXY(pSchedule.value.usData1[index], addressof(sCellX), addressof(sCellY));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      // let this person patrol from here from now on
      pSoldier.value.usPatrolGrid[0] = pSchedule.value.usData1[index];
      break;
    case Enum171.SCHEDULE_ACTION_ENTERSECTOR:
      if (pSoldier.value.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags2 & PROFILE_MISC_FLAG2_DONT_ADD_TO_SECTOR) {
        // never process enter if flag is set
        break;
      }
      BumpAnyExistingMerc(pSchedule.value.usData1[index]);
      ConvertGridNoToCellXY(pSchedule.value.usData1[index], addressof(sCellX), addressof(sCellY));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      MoveSoldierFromAwayToMercSlot(pSoldier);
      pSoldier.value.bInSector = true;
      // let this person patrol from here from now on
      pSoldier.value.usPatrolGrid[0] = pSchedule.value.usData1[index];
      break;
    case Enum171.SCHEDULE_ACTION_WAKE:
      BumpAnyExistingMerc(pSoldier.value.sInitialGridNo);
      ConvertGridNoToCellXY(pSoldier.value.sInitialGridNo, addressof(sCellX), addressof(sCellY));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      // let this person patrol from here from now on
      pSoldier.value.usPatrolGrid[0] = pSoldier.value.sInitialGridNo;
      break;
    case Enum171.SCHEDULE_ACTION_SLEEP:
      pSoldier.value.fAIFlags |= AI_ASLEEP;
      // check for someone else in the location
      BumpAnyExistingMerc(pSchedule.value.usData1[index]);
      ConvertGridNoToCellXY(pSchedule.value.usData1[index], addressof(sCellX), addressof(sCellY));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);
      pSoldier.value.usPatrolGrid[0] = pSchedule.value.usData1[index];
      break;
    case Enum171.SCHEDULE_ACTION_LEAVESECTOR:
      sGridNo = FindNearestEdgePoint(pSoldier.value.sGridNo);
      BumpAnyExistingMerc(sGridNo);
      ConvertGridNoToCellXY(sGridNo, addressof(sCellX), addressof(sCellY));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);

      sGridNo = FindNearbyPointOnEdgeOfMap(pSoldier, addressof(bDirection));
      BumpAnyExistingMerc(sGridNo);
      ConvertGridNoToCellXY(sGridNo, addressof(sCellX), addressof(sCellY));
      EVENT_SetSoldierPositionForceDelete(pSoldier, sCellX, sCellY);

      // ok, that tells us where the civ will return
      pSoldier.value.sOffWorldGridNo = sGridNo;
      MoveSoldierFromMercToAwaySlot(pSoldier);
      pSoldier.value.bInSector = false;
      break;
  }
}

function PostSchedule(pSoldier: Pointer<SOLDIERTYPE>): void {
  let uiStartTime: UINT32;
  let uiEndTime: UINT32;
  let i: INT32;
  let bEmpty: INT8;
  let pSchedule: Pointer<SCHEDULENODE>;
  let ubTempAction: UINT8;
  let usTemp: UINT16;

  if ((pSoldier.value.ubCivilianGroup == Enum246.KINGPIN_CIV_GROUP) && (gTacticalStatus.fCivGroupHostile[Enum246.KINGPIN_CIV_GROUP] || ((gubQuest[Enum169.QUEST_KINGPIN_MONEY] == QUESTINPROGRESS) && (CheckFact(Enum170.FACT_KINGPIN_CAN_SEND_ASSASSINS, Enum268.KINGPIN)))) && (gWorldSectorX == 5 && gWorldSectorY == MAP_ROW_C) && (pSoldier.value.ubProfile == NO_PROFILE)) {
    // no schedules for people guarding Tony's!
    return;
  }

  pSchedule = GetSchedule(pSoldier.value.ubScheduleID);
  if (!pSchedule)
    return;

  if (pSoldier.value.ubProfile != NO_PROFILE && gMercProfiles[pSoldier.value.ubProfile].ubMiscFlags3 & PROFILE_MISC_FLAG3_PERMANENT_INSERTION_CODE) {
    // don't process schedule
    return;
  }

  // if this schedule doesn't have a time associated with it, then generate a time, but only
  // if it is a sleep schedule.
  for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
    if (pSchedule.value.ubAction[i] == Enum171.SCHEDULE_ACTION_SLEEP) {
      // first make sure that this merc has a unique spot to sleep in
      SecureSleepSpot(pSoldier, pSchedule.value.usData1[i]);

      if (pSchedule.value.usTime[i] == 0xffff) {
        pSchedule.value.usTime[i] = ((21 * 60) + Random((3 * 60))); // 9PM - 11:59PM

        if (ScheduleHasMorningNonSleepEntries(pSchedule)) {
          // this guy will sleep until the next non-sleep event
        } else {
          bEmpty = GetEmptyScheduleEntry(pSchedule);
          if (bEmpty != -1) {
            // there is an empty entry for the wakeup call

            // NB the wakeup call must be ordered first! so we have to create the
            // wake action and then swap the two.
            pSchedule.value.ubAction[bEmpty] = Enum171.SCHEDULE_ACTION_WAKE;
            pSchedule.value.usTime[bEmpty] = (pSchedule.value.usTime[i] + (8 * 60)) % NUM_MIN_IN_DAY; // sleep for 8 hours

            ubTempAction = pSchedule.value.ubAction[bEmpty];
            pSchedule.value.ubAction[bEmpty] = pSchedule.value.ubAction[i];
            pSchedule.value.ubAction[i] = ubTempAction;

            usTemp = pSchedule.value.usTime[bEmpty];
            pSchedule.value.usTime[bEmpty] = pSchedule.value.usTime[i];
            pSchedule.value.usTime[i] = usTemp;

            usTemp = pSchedule.value.usData1[bEmpty];
            pSchedule.value.usData1[bEmpty] = pSchedule.value.usData1[i];
            pSchedule.value.usData1[i] = usTemp;

            usTemp = pSchedule.value.usData2[bEmpty];
            pSchedule.value.usData2[bEmpty] = pSchedule.value.usData2[i];
            pSchedule.value.usData2[i] = usTemp;
          } else {
            // no morning entries but no space for a wakeup either, will sleep till
            // next non-sleep event
          }
        }
        break; // The break is here because nobody should have more than one sleep schedule with no time specified.
      }
    }
  }

  pSchedule.value.ubSoldierID = pSoldier.value.ubID;

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

function PrepareScheduleForAutoProcessing(pSchedule: Pointer<SCHEDULENODE>, uiStartTime: UINT32, uiEndTime: UINT32): void {
  let i: INT32;
  let fPostedNextEvent: boolean = false;

  if (uiStartTime > uiEndTime) {
    // The start time is later in the day than the end time, which means we'll be wrapping
    // through midnight and continuing to the end time.
    for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
      if (pSchedule.value.usTime[i] == 0xffff)
        break;
      if (pSchedule.value.usTime[i] >= uiStartTime) {
        AutoProcessSchedule(pSchedule, i);
      }
    }
    for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
      if (pSchedule.value.usTime[i] == 0xffff)
        break;
      if (pSchedule.value.usTime[i] <= uiEndTime) {
        AutoProcessSchedule(pSchedule, i);
      } else {
        // CJC: Note that end time is always passed in here as the current time so GetWorldDayInMinutes will be for the correct day
        AddStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, GetWorldDayInMinutes() + pSchedule.value.usTime[i], pSchedule.value.ubScheduleID);
        fPostedNextEvent = true;
        break;
      }
    }
  } else {
    // Much simpler:  start at the start and continue to the end.
    for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
      if (pSchedule.value.usTime[i] == 0xffff)
        break;

      if (pSchedule.value.usTime[i] >= uiStartTime && pSchedule.value.usTime[i] <= uiEndTime) {
        AutoProcessSchedule(pSchedule, i);
      } else if (pSchedule.value.usTime[i] >= uiEndTime) {
        fPostedNextEvent = true;
        AddStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, GetWorldDayInMinutes() + pSchedule.value.usTime[i], pSchedule.value.ubScheduleID);
        break;
      }
    }
  }

  if (!fPostedNextEvent) {
    // reached end of schedule, post first event for soldier in the next day
    // 0th event will be first.
    // Feb 1:  ONLY IF THERE IS A VALID EVENT TO POST WITH A VALID TIME!
    if (pSchedule.value.usTime[0] != 0xffff) {
      AddStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, GetWorldDayInMinutes() + NUM_MIN_IN_DAY + pSchedule.value.usTime[0], pSchedule.value.ubScheduleID);
    }
  }
}

// Leave at night, come back in the morning.  The time variances are a couple hours, so
// the town doesn't turn into a ghost town in 5 minutes.
function PostDefaultSchedule(pSoldier: Pointer<SOLDIERTYPE>): void {
  let i: INT32;
  let curr: Pointer<SCHEDULENODE>;

  if (gbWorldSectorZ) {
    // People in underground sectors don't get schedules.
    return;
  }
  // Create a new node at the head of the list.  The head will become the new schedule
  // we are about to add.
  curr = gpScheduleList;
  gpScheduleList = MemAlloc(sizeof(SCHEDULENODE));
  memset(gpScheduleList, 0, sizeof(SCHEDULENODE));
  gpScheduleList.value.next = curr;
  gubScheduleID++;
  // Assign all of the links
  gpScheduleList.value.ubScheduleID = gubScheduleID;
  gpScheduleList.value.ubSoldierID = pSoldier.value.ubID;
  pSoldier.value.ubScheduleID = gubScheduleID;

  // Clear the data inside the schedule
  for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
    gpScheduleList.value.usTime[i] = 0xffff;
    gpScheduleList.value.usData1[i] = 0xffff;
    gpScheduleList.value.usData2[i] = 0xffff;
  }
  // Have the default schedule enter between 7AM and 8AM
  gpScheduleList.value.ubAction[0] = Enum171.SCHEDULE_ACTION_ENTERSECTOR;
  gpScheduleList.value.usTime[0] = (420 + Random(61));
  gpScheduleList.value.usData1[0] = pSoldier.value.sInitialGridNo;
  // Have the default schedule leave between 6PM and 8PM
  gpScheduleList.value.ubAction[1] = Enum171.SCHEDULE_ACTION_LEAVESECTOR;
  gpScheduleList.value.usTime[1] = (1080 + Random(121));
  gpScheduleList.value.usFlags |= SCHEDULE_FLAGS_TEMPORARY;

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
  let curr: Pointer<SOLDIERINITNODE>;
  let fDefaultSchedulesPossible: boolean = false;

  // If no way to leave the map, then don't post default schedules.
  if (gMapInformation.sNorthGridNo != -1 || gMapInformation.sEastGridNo != -1 || gMapInformation.sSouthGridNo != -1 || gMapInformation.sWestGridNo != -1) {
    fDefaultSchedulesPossible = true;
  }
  curr = gSoldierInitHead;
  while (curr) {
    if (curr.value.pSoldier && curr.value.pSoldier.value.bTeam == CIV_TEAM) {
      if (curr.value.pDetailedPlacement && curr.value.pDetailedPlacement.value.ubScheduleID) {
        PostSchedule(curr.value.pSoldier);
      } else if (fDefaultSchedulesPossible) {
        // ATE: There should be a better way here...
        if (curr.value.pSoldier.value.ubBodyType != Enum194.COW && curr.value.pSoldier.value.ubBodyType != Enum194.BLOODCAT && curr.value.pSoldier.value.ubBodyType != Enum194.HUMVEE && curr.value.pSoldier.value.ubBodyType != Enum194.ELDORADO && curr.value.pSoldier.value.ubBodyType != Enum194.ICECREAMTRUCK && curr.value.pSoldier.value.ubBodyType != Enum194.JEEP) {
          PostDefaultSchedule(curr.value.pSoldier);
        }
      }
    }
    curr = curr.value.next;
  }
}

function PerformActionOnDoorAdjacentToGridNo(ubScheduleAction: UINT8, usGridNo: UINT16): void {
  let sDoorGridNo: INT16;
  let pDoor: Pointer<DOOR>;

  sDoorGridNo = FindDoorAtGridNoOrAdjacent(usGridNo);
  if (sDoorGridNo != NOWHERE) {
    switch (ubScheduleAction) {
      case Enum171.SCHEDULE_ACTION_LOCKDOOR:
        pDoor = FindDoorInfoAtGridNo(sDoorGridNo);
        if (pDoor) {
          pDoor.value.fLocked = true;
        }
        // make sure it's closed as well
        ModifyDoorStatus(sDoorGridNo, false, DONTSETDOORSTATUS);
        break;
      case Enum171.SCHEDULE_ACTION_UNLOCKDOOR:
        pDoor = FindDoorInfoAtGridNo(sDoorGridNo);
        if (pDoor) {
          pDoor.value.fLocked = false;
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
export function PostNextSchedule(pSoldier: Pointer<SOLDIERTYPE>): void {
  let pSchedule: Pointer<SCHEDULENODE>;
  let i: INT32;
  let iBestIndex: INT32;
  let usTime: UINT16;
  let usBestTime: UINT16;
  pSchedule = GetSchedule(pSoldier.value.ubScheduleID);
  if (!pSchedule) {
    // post default?
    return;
  }
  usTime = GetWorldMinutesInDay();
  usBestTime = 0xffff;
  iBestIndex = -1;
  for (i = 0; i < MAX_SCHEDULE_ACTIONS; i++) {
    if (pSchedule.value.usTime[i] == 0xffff)
      continue;
    if (pSchedule.value.usTime[i] == usTime)
      continue;
    if (pSchedule.value.usTime[i] > usTime) {
      if (pSchedule.value.usTime[i] - usTime < usBestTime) {
        usBestTime = pSchedule.value.usTime[i] - usTime;
        iBestIndex = i;
      }
    } else if ((NUM_MIN_IN_DAY - (usTime - pSchedule.value.usTime[i])) < usBestTime) {
      usBestTime = NUM_MIN_IN_DAY - (usTime - pSchedule.value.usTime[i]);
      iBestIndex = i;
    }
  }
  Assert(iBestIndex >= 0);

  AddStrategicEvent(Enum132.EVENT_PROCESS_TACTICAL_SCHEDULE, GetWorldDayInMinutes() + pSchedule.value.usTime[iBestIndex], pSchedule.value.ubScheduleID);
}

function ExtractScheduleEntryAndExitInfo(pSoldier: Pointer<SOLDIERTYPE>, puiEntryTime: Pointer<UINT32>, puiExitTime: Pointer<UINT32>): boolean {
  let iLoop: INT32;
  let fFoundEntryTime: boolean = false;
  let fFoundExitTime: boolean = false;
  let pSchedule: Pointer<SCHEDULENODE>;

  puiEntryTime.value = 0;
  puiExitTime.value = 0;

  pSchedule = GetSchedule(pSoldier.value.ubScheduleID);
  if (!pSchedule) {
    // If person had default schedule then would have been assigned and this would
    // have succeeded.
    // Hence this is an error.
    return false;
  }

  for (iLoop = 0; iLoop < MAX_SCHEDULE_ACTIONS; iLoop++) {
    if (pSchedule.value.ubAction[iLoop] == Enum171.SCHEDULE_ACTION_ENTERSECTOR) {
      fFoundEntryTime = true;
      puiEntryTime.value = pSchedule.value.usTime[iLoop];
    } else if (pSchedule.value.ubAction[iLoop] == Enum171.SCHEDULE_ACTION_LEAVESECTOR) {
      fFoundExitTime = true;
      puiExitTime.value = pSchedule.value.usTime[iLoop];
    }
  }

  if (fFoundEntryTime && fFoundExitTime) {
    return true;
  } else {
    return false;
  }
}

// This is for determining shopkeeper's opening/closing hours
export function ExtractScheduleDoorLockAndUnlockInfo(pSoldier: Pointer<SOLDIERTYPE>, puiOpeningTime: Pointer<UINT32>, puiClosingTime: Pointer<UINT32>): boolean {
  let iLoop: INT32;
  let fFoundOpeningTime: boolean = false;
  let fFoundClosingTime: boolean = false;
  let pSchedule: Pointer<SCHEDULENODE>;

  puiOpeningTime.value = 0;
  puiClosingTime.value = 0;

  pSchedule = GetSchedule(pSoldier.value.ubScheduleID);
  if (!pSchedule) {
    // If person had default schedule then would have been assigned and this would
    // have succeeded.
    // Hence this is an error.
    return false;
  }

  for (iLoop = 0; iLoop < MAX_SCHEDULE_ACTIONS; iLoop++) {
    if (pSchedule.value.ubAction[iLoop] == Enum171.SCHEDULE_ACTION_UNLOCKDOOR) {
      fFoundOpeningTime = true;
      puiOpeningTime.value = pSchedule.value.usTime[iLoop];
    } else if (pSchedule.value.ubAction[iLoop] == Enum171.SCHEDULE_ACTION_LOCKDOOR) {
      fFoundClosingTime = true;
      puiClosingTime.value = pSchedule.value.usTime[iLoop];
    }
  }

  if (fFoundOpeningTime && fFoundClosingTime) {
    return true;
  } else {
    return false;
  }
}

function GetEarliestMorningScheduleEvent(pSchedule: Pointer<SCHEDULENODE>, puiTime: Pointer<UINT32>): boolean {
  let iLoop: INT32;
  let fFoundTime: boolean = false;

  puiTime.value = 100000;

  for (iLoop = 0; iLoop < MAX_SCHEDULE_ACTIONS; iLoop++) {
    if (pSchedule.value.usTime[iLoop] < (12 * 60) && pSchedule.value.usTime[iLoop] < puiTime.value) {
      puiTime.value = pSchedule.value.usTime[iLoop];
    }
  }

  if (puiTime.value == 100000) {
    return false;
  } else {
    return true;
  }
}

function ScheduleHasMorningNonSleepEntries(pSchedule: Pointer<SCHEDULENODE>): boolean {
  let bLoop: INT8;

  for (bLoop = 0; bLoop < MAX_SCHEDULE_ACTIONS; bLoop++) {
    if (pSchedule.value.ubAction[bLoop] != Enum171.SCHEDULE_ACTION_NONE && pSchedule.value.ubAction[bLoop] != Enum171.SCHEDULE_ACTION_SLEEP) {
      if (pSchedule.value.usTime[bLoop] < (12 * 60)) {
        return true;
      }
    }
  }
  return false;
}

function GetEmptyScheduleEntry(pSchedule: Pointer<SCHEDULENODE>): INT8 {
  let bLoop: INT8;

  for (bLoop = 0; bLoop < MAX_SCHEDULE_ACTIONS; bLoop++) {
    if (pSchedule.value.ubAction[bLoop] == Enum171.SCHEDULE_ACTION_NONE) {
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

function FindSleepSpot(pSchedule: Pointer<SCHEDULENODE>): UINT16 {
  let bLoop: INT8;

  for (bLoop = 0; bLoop < MAX_SCHEDULE_ACTIONS; bLoop++) {
    if (pSchedule.value.ubAction[bLoop] == Enum171.SCHEDULE_ACTION_SLEEP) {
      return pSchedule.value.usData1[bLoop];
    }
  }
  return NOWHERE;
}

function ReplaceSleepSpot(pSchedule: Pointer<SCHEDULENODE>, usNewSpot: UINT16): void {
  let bLoop: INT8;

  for (bLoop = 0; bLoop < MAX_SCHEDULE_ACTIONS; bLoop++) {
    if (pSchedule.value.ubAction[bLoop] == Enum171.SCHEDULE_ACTION_SLEEP) {
      pSchedule.value.usData1[bLoop] = usNewSpot;
      break;
    }
  }
}

function SecureSleepSpot(pSoldier: Pointer<SOLDIERTYPE>, usSleepSpot: UINT16): void {
  let pSoldier2: Pointer<SOLDIERTYPE>;
  let usSleepSpot2: UINT16;
  let usNewSleepSpot: UINT16;
  let uiLoop: UINT32;
  let pSchedule: Pointer<SCHEDULENODE>;
  let ubDirection: UINT8;

  // start after this soldier's ID so we don't duplicate work done in previous passes
  for (uiLoop = pSoldier.value.ubID + 1; uiLoop <= gTacticalStatus.Team[CIV_TEAM].bLastID; uiLoop++) {
    pSoldier2 = MercPtrs[uiLoop];
    if (pSoldier2.value.bActive && pSoldier2.value.bInSector && pSoldier2.value.ubScheduleID != 0) {
      pSchedule = GetSchedule(pSoldier2.value.ubScheduleID);
      if (pSchedule) {
        usSleepSpot2 = FindSleepSpot(pSchedule);
        if (usSleepSpot2 == usSleepSpot) {
          // conflict!
          // usNewSleepSpot = (INT16) FindGridNoFromSweetSpotWithStructData( pSoldier2, pSoldier2->usAnimState, usSleepSpot2, 3, &ubDirection, FALSE );
          usNewSleepSpot = FindGridNoFromSweetSpotExcludingSweetSpot(pSoldier2, usSleepSpot2, 3, addressof(ubDirection));
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
