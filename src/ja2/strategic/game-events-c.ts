export let gpEventList: Pointer<STRATEGICEVENT> = null;

export let gfPreventDeletionOfAnyEvent: boolean = false;
let gfEventDeletionPending: boolean = false;

let gfProcessingGameEvents: boolean = false;
export let guiTimeStampOfCurrentlyExecutingEvent: UINT32 = 0;

// Determines if there are any events that will be processed between the current global time,
// and the beginning of the next global time.
export function GameEventsPending(uiAdjustment: UINT32): boolean {
  if (!gpEventList)
    return false;
  if (gpEventList.value.uiTimeStamp <= GetWorldTotalSeconds() + uiAdjustment)
    return true;
  return false;
}

// returns TRUE if any events were deleted
function DeleteEventsWithDeletionPending(): boolean {
  let curr: Pointer<STRATEGICEVENT>;
  let prev: Pointer<STRATEGICEVENT>;
  let temp: Pointer<STRATEGICEVENT>;
  let fEventDeleted: boolean = false;
  // ValidateGameEvents();
  curr = gpEventList;
  prev = null;
  while (curr) {
    // ValidateGameEvents();
    if (curr.value.ubFlags & SEF_DELETION_PENDING) {
      if (prev) {
        // deleting node in middle
        prev.value.next = curr.value.next;
        temp = curr;
        curr = curr.value.next;
        MemFree(temp);
        fEventDeleted = true;
        // ValidateGameEvents();
        continue;
      } else {
        // deleting head
        gpEventList = gpEventList.value.next;
        temp = curr;
        prev = null;
        curr = curr.value.next;
        MemFree(temp);
        fEventDeleted = true;
        // ValidateGameEvents();
        continue;
      }
    }
    prev = curr;
    curr = curr.value.next;
  }
  gfEventDeletionPending = false;
  return fEventDeleted;
}

function AdjustClockToEventStamp(pEvent: Pointer<STRATEGICEVENT>, puiAdjustment: Pointer<UINT32>): void {
  let uiDiff: UINT32;

  uiDiff = pEvent.value.uiTimeStamp - guiGameClock;
  guiGameClock += uiDiff;
  puiAdjustment.value -= uiDiff;

  // Calculate the day, hour, and minutes.
  guiDay = (guiGameClock / NUM_SEC_IN_DAY);
  guiHour = (guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR;
  guiMin = (guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN;

  swprintf(WORLDTIMESTR(), "%s %d, %02d:%02d", gpGameClockString[Enum366.STR_GAMECLOCK_DAY_NAME], guiDay, guiHour, guiMin);
}

// If there are any events pending, they are processed, until the time limit is reached, or
// a major event is processed (one that requires the player's attention).
export function ProcessPendingGameEvents(uiAdjustment: UINT32, ubWarpCode: UINT8): void {
  let curr: Pointer<STRATEGICEVENT>;
  let pEvent: Pointer<STRATEGICEVENT>;
  let prev: Pointer<STRATEGICEVENT>;
  let temp: Pointer<STRATEGICEVENT>;
  let fDeleteEvent: boolean = false;
  let fDeleteQueuedEvent: boolean = false;

  gfTimeInterrupt = false;
  gfProcessingGameEvents = true;

  // While we have events inside the time range to be updated, process them...
  curr = gpEventList;
  prev = null; // prev only used when warping time to target time.
  while (!gfTimeInterrupt && curr && curr.value.uiTimeStamp <= guiGameClock + uiAdjustment) {
    fDeleteEvent = false;
    // Update the time by the difference, but ONLY if the event comes after the current time.
    // In the beginning of the game, series of events are created that are placed in the list
    // BEFORE the start time.  Those events will be processed without influencing the actual time.
    if (curr.value.uiTimeStamp > guiGameClock && ubWarpCode != Enum131.WARPTIME_PROCESS_TARGET_TIME_FIRST) {
      AdjustClockToEventStamp(curr, addressof(uiAdjustment));
    }
    // Process the event
    if (ubWarpCode != Enum131.WARPTIME_PROCESS_TARGET_TIME_FIRST) {
      fDeleteEvent = ExecuteStrategicEvent(curr);
    } else if (curr.value.uiTimeStamp == guiGameClock + uiAdjustment) {
      // if we are warping to the target time to process that event first,
      if (!curr.value.next || curr.value.next.value.uiTimeStamp > guiGameClock + uiAdjustment) {
        // make sure that we are processing the last event for that second
        AdjustClockToEventStamp(curr, addressof(uiAdjustment));

        fDeleteEvent = ExecuteStrategicEvent(curr);

        if (curr && prev && fDeleteQueuedEvent) {
          // The only case where we are deleting a node in the middle of the list
          prev.value.next = curr.value.next;
        }
      } else {
        // We are at the current target warp time however, there are still other events following in this time cycle.
        // We will only target the final event in this time.  NOTE:  Events are posted using a FIFO method
        prev = curr;
        curr = curr.value.next;
        continue;
      }
    } else {
      // We are warping time to the target time.  We haven't found the event yet,
      // so continuing will keep processing the list until we find it.  NOTE:  Events are posted using a FIFO method
      prev = curr;
      curr = curr.value.next;
      continue;
    }
    if (fDeleteEvent) {
      // Determine if event node is a special event requiring reposting
      switch (curr.value.ubEventType) {
        case Enum133.RANGED_EVENT:
          AddAdvancedStrategicEvent(Enum133.ENDRANGED_EVENT, curr.value.ubCallbackID, curr.value.uiTimeStamp + curr.value.uiTimeOffset, curr.value.uiParam);
          break;
        case Enum133.PERIODIC_EVENT:
          pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, curr.value.ubCallbackID, curr.value.uiTimeStamp + curr.value.uiTimeOffset, curr.value.uiParam);
          if (pEvent)
            pEvent.value.uiTimeOffset = curr.value.uiTimeOffset;
          break;
        case Enum133.EVERYDAY_EVENT:
          AddAdvancedStrategicEvent(Enum133.EVERYDAY_EVENT, curr.value.ubCallbackID, curr.value.uiTimeStamp + NUM_SEC_IN_DAY, curr.value.uiParam);
          break;
      }
      if (curr == gpEventList) {
        gpEventList = gpEventList.value.next;
        MemFree(curr);
        curr = gpEventList;
        prev = null;
        // ValidateGameEvents();
      } else {
        temp = curr;
        prev.value.next = curr.value.next;
        curr = curr.value.next;
        MemFree(temp);
        // ValidateGameEvents();
      }
    } else {
      prev = curr;
      curr = curr.value.next;
    }
  }

  gfProcessingGameEvents = false;

  if (gfEventDeletionPending) {
    DeleteEventsWithDeletionPending();
  }

  if (uiAdjustment && !gfTimeInterrupt)
    guiGameClock += uiAdjustment;
}

export function AddSameDayStrategicEvent(ubCallbackID: UINT8, uiMinStamp: UINT32, uiParam: UINT32): boolean {
  return AddStrategicEvent(ubCallbackID, uiMinStamp + GetWorldDayInMinutes(), uiParam);
}

function AddSameDayStrategicEventUsingSeconds(ubCallbackID: UINT8, uiSecondStamp: UINT32, uiParam: UINT32): boolean {
  return AddStrategicEventUsingSeconds(ubCallbackID, uiSecondStamp + GetWorldDayInSeconds(), uiParam);
}

export function AddFutureDayStrategicEvent(ubCallbackID: UINT8, uiMinStamp: UINT32, uiParam: UINT32, uiNumDaysFromPresent: UINT32): boolean {
  let uiDay: UINT32;
  uiDay = GetWorldDay();
  return AddStrategicEvent(ubCallbackID, uiMinStamp + GetFutureDayInMinutes(uiDay + uiNumDaysFromPresent), uiParam);
}

function AddFutureDayStrategicEventUsingSeconds(ubCallbackID: UINT8, uiSecondStamp: UINT32, uiParam: UINT32, uiNumDaysFromPresent: UINT32): boolean {
  let uiDay: UINT32;
  uiDay = GetWorldDay();
  return AddStrategicEventUsingSeconds(ubCallbackID, uiSecondStamp + GetFutureDayInMinutes(uiDay + uiNumDaysFromPresent) * 60, uiParam);
}

export function AddAdvancedStrategicEvent(ubEventType: UINT8, ubCallbackID: UINT8, uiTimeStamp: UINT32, uiParam: UINT32): Pointer<STRATEGICEVENT> {
  let pNode: Pointer<STRATEGICEVENT>;
  let pNewNode: Pointer<STRATEGICEVENT>;
  let pPrevNode: Pointer<STRATEGICEVENT>;

  if (gfProcessingGameEvents && uiTimeStamp <= guiTimeStampOfCurrentlyExecutingEvent) {
    // Prevents infinite loops of posting events that are the same time or earlier than the event
// currently being processed.
    return null;
  }

  pNewNode = MemAlloc(sizeof(STRATEGICEVENT));
  Assert(pNewNode);
  memset(pNewNode, 0, sizeof(STRATEGICEVENT));
  pNewNode.value.ubCallbackID = ubCallbackID;
  pNewNode.value.uiParam = uiParam;
  pNewNode.value.ubEventType = ubEventType;
  pNewNode.value.uiTimeStamp = uiTimeStamp;
  pNewNode.value.uiTimeOffset = 0;

  // Search list for a place to insert
  pNode = gpEventList;

  // If it's the first head, do this!
  if (!pNode) {
    gpEventList = pNewNode;
    pNewNode.value.next = null;
  } else {
    pPrevNode = null;
    while (pNode) {
      if (uiTimeStamp < pNode.value.uiTimeStamp) {
        break;
      }
      pPrevNode = pNode;
      pNode = pNode.value.next;
    }

    // If we are at the end, set at the end!
    if (!pNode) {
      pPrevNode.value.next = pNewNode;
      pNewNode.value.next = null;
    } else {
      // We have a previous node here
      // Insert IN FRONT!
      if (pPrevNode) {
        pNewNode.value.next = pPrevNode.value.next;
        pPrevNode.value.next = pNewNode;
      } else {
        // It's the head
        pNewNode.value.next = gpEventList;
        gpEventList = pNewNode;
      }
    }
  }

  return pNewNode;
}

export function AddStrategicEvent(ubCallbackID: UINT8, uiMinStamp: UINT32, uiParam: UINT32): boolean {
  if (AddAdvancedStrategicEvent(Enum133.ONETIME_EVENT, ubCallbackID, uiMinStamp * 60, uiParam))
    return true;
  return false;
}

export function AddStrategicEventUsingSeconds(ubCallbackID: UINT8, uiSecondStamp: UINT32, uiParam: UINT32): boolean {
  if (AddAdvancedStrategicEvent(Enum133.ONETIME_EVENT, ubCallbackID, uiSecondStamp, uiParam))
    return true;
  return false;
}

function AddRangedStrategicEvent(ubCallbackID: UINT8, uiStartMin: UINT32, uiLengthMin: UINT32, uiParam: UINT32): boolean {
  let pEvent: Pointer<STRATEGICEVENT>;
  pEvent = AddAdvancedStrategicEvent(Enum133.RANGED_EVENT, ubCallbackID, uiStartMin * 60, uiParam);
  if (pEvent) {
    pEvent.value.uiTimeOffset = uiLengthMin * 60;
    return true;
  }
  return false;
}

export function AddSameDayRangedStrategicEvent(ubCallbackID: UINT8, uiStartMin: UINT32, uiLengthMin: UINT32, uiParam: UINT32): boolean {
  return AddRangedStrategicEvent(ubCallbackID, uiStartMin + GetWorldDayInMinutes(), uiLengthMin, uiParam);
}

function AddFutureDayRangedStrategicEvent(ubCallbackID: UINT8, uiStartMin: UINT32, uiLengthMin: UINT32, uiParam: UINT32, uiNumDaysFromPresent: UINT32): boolean {
  return AddRangedStrategicEvent(ubCallbackID, uiStartMin + GetFutureDayInMinutes(GetWorldDay() + uiNumDaysFromPresent), uiLengthMin, uiParam);
}

function AddRangedStrategicEventUsingSeconds(ubCallbackID: UINT8, uiStartSeconds: UINT32, uiLengthSeconds: UINT32, uiParam: UINT32): boolean {
  let pEvent: Pointer<STRATEGICEVENT>;
  pEvent = AddAdvancedStrategicEvent(Enum133.RANGED_EVENT, ubCallbackID, uiStartSeconds, uiParam);
  if (pEvent) {
    pEvent.value.uiTimeOffset = uiLengthSeconds;
    return true;
  }
  return false;
}

function AddSameDayRangedStrategicEventUsingSeconds(ubCallbackID: UINT8, uiStartSeconds: UINT32, uiLengthSeconds: UINT32, uiParam: UINT32): boolean {
  return AddRangedStrategicEventUsingSeconds(ubCallbackID, uiStartSeconds + GetWorldDayInSeconds(), uiLengthSeconds, uiParam);
}

function AddFutureDayRangedStrategicEventUsingSeconds(ubCallbackID: UINT8, uiStartSeconds: UINT32, uiLengthSeconds: UINT32, uiParam: UINT32, uiNumDaysFromPresent: UINT32): boolean {
  return AddRangedStrategicEventUsingSeconds(ubCallbackID, uiStartSeconds + GetFutureDayInMinutes(GetWorldDay() + uiNumDaysFromPresent) * 60, uiLengthSeconds, uiParam);
}

export function AddEveryDayStrategicEvent(ubCallbackID: UINT8, uiStartMin: UINT32, uiParam: UINT32): boolean {
  if (AddAdvancedStrategicEvent(Enum133.EVERYDAY_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiStartMin * 60, uiParam))
    return true;
  return false;
}

function AddEveryDayStrategicEventUsingSeconds(ubCallbackID: UINT8, uiStartSeconds: UINT32, uiParam: UINT32): boolean {
  if (AddAdvancedStrategicEvent(Enum133.EVERYDAY_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiStartSeconds, uiParam))
    return true;
  return false;
}

// NEW:  Period Events
// Event will get processed automatically once every X minutes.
export function AddPeriodStrategicEvent(ubCallbackID: UINT8, uiOnceEveryXMinutes: UINT32, uiParam: UINT32): boolean {
  let pEvent: Pointer<STRATEGICEVENT>;
  pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOnceEveryXMinutes * 60, uiParam);
  if (pEvent) {
    pEvent.value.uiTimeOffset = uiOnceEveryXMinutes * 60;
    return true;
  }
  return false;
}

function AddPeriodStrategicEventUsingSeconds(ubCallbackID: UINT8, uiOnceEveryXSeconds: UINT32, uiParam: UINT32): boolean {
  let pEvent: Pointer<STRATEGICEVENT>;
  pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOnceEveryXSeconds, uiParam);
  if (pEvent) {
    pEvent.value.uiTimeOffset = uiOnceEveryXSeconds;
    return true;
  }
  return false;
}

export function AddPeriodStrategicEventWithOffset(ubCallbackID: UINT8, uiOnceEveryXMinutes: UINT32, uiOffsetFromCurrent: UINT32, uiParam: UINT32): boolean {
  let pEvent: Pointer<STRATEGICEVENT>;
  pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOffsetFromCurrent * 60, uiParam);
  if (pEvent) {
    pEvent.value.uiTimeOffset = uiOnceEveryXMinutes * 60;
    return true;
  }
  return false;
}

function AddPeriodStrategicEventUsingSecondsWithOffset(ubCallbackID: UINT8, uiOnceEveryXSeconds: UINT32, uiOffsetFromCurrent: UINT32, uiParam: UINT32): boolean {
  let pEvent: Pointer<STRATEGICEVENT>;
  pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOffsetFromCurrent, uiParam);
  if (pEvent) {
    pEvent.value.uiTimeOffset = uiOnceEveryXSeconds;
    return true;
  }
  return false;
}

export function DeleteAllStrategicEventsOfType(ubCallbackID: UINT8): void {
  let curr: Pointer<STRATEGICEVENT>;
  let prev: Pointer<STRATEGICEVENT>;
  let temp: Pointer<STRATEGICEVENT>;
  prev = null;
  curr = gpEventList;
  while (curr) {
    if (curr.value.ubCallbackID == ubCallbackID && !(curr.value.ubFlags & SEF_DELETION_PENDING)) {
      if (gfPreventDeletionOfAnyEvent) {
        curr.value.ubFlags |= SEF_DELETION_PENDING;
        gfEventDeletionPending = true;
        prev = curr;
        curr = curr.value.next;
        continue;
      }
      // Detach the node
      if (prev)
        prev.value.next = curr.value.next;
      else
        gpEventList = curr.value.next;

      // isolate and remove curr
      temp = curr;
      curr = curr.value.next;
      MemFree(temp);
      // ValidateGameEvents();
    } else {
      // Advance all the nodes
      prev = curr;
      curr = curr.value.next;
    }
  }
}

export function DeleteAllStrategicEvents(): void {
  let temp: Pointer<STRATEGICEVENT>;
  while (gpEventList) {
    temp = gpEventList;
    gpEventList = gpEventList.value.next;
    MemFree(temp);
    // ValidateGameEvents();
    temp = null;
  }
  gpEventList = null;
}

// Searches for and removes the first event matching the supplied information.  There may very well be a need
// for more specific event removal, so let me know (Kris), of any support needs.  Function returns FALSE if
// no events were found or if the event wasn't deleted due to delete lock,
export function DeleteStrategicEvent(ubCallbackID: UINT8, uiParam: UINT32): boolean {
  let curr: Pointer<STRATEGICEVENT>;
  let prev: Pointer<STRATEGICEVENT>;
  curr = gpEventList;
  prev = null;
  while (curr) {
    // deleting middle
    if (curr.value.ubCallbackID == ubCallbackID && curr.value.uiParam == uiParam) {
      if (!(curr.value.ubFlags & SEF_DELETION_PENDING)) {
        if (gfPreventDeletionOfAnyEvent) {
          curr.value.ubFlags |= SEF_DELETION_PENDING;
          gfEventDeletionPending = true;
          return false;
        }
        if (prev) {
          prev.value.next = curr.value.next;
        } else {
          gpEventList = gpEventList.value.next;
        }
        MemFree(curr);
        // ValidateGameEvents();
        return true;
      }
    }
    prev = curr;
    curr = curr.value.next;
  }
  return false;
}

// part of the game.sav files (not map files)
export function SaveStrategicEventsToSavedGame(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let sGameEvent: STRATEGICEVENT;

  let uiNumGameEvents: UINT32 = 0;
  let pTempEvent: Pointer<STRATEGICEVENT> = gpEventList;

  // Go through the list and determine the number of events
  while (pTempEvent) {
    pTempEvent = pTempEvent.value.next;
    uiNumGameEvents++;
  }

  // write the number of strategic events
  FileWrite(hFile, addressof(uiNumGameEvents), sizeof(UINT32), addressof(uiNumBytesWritten));
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return false;
  }

  // loop through all the events and save them.
  pTempEvent = gpEventList;
  while (pTempEvent) {
    // save the current structure
    memcpy(addressof(sGameEvent), pTempEvent, sizeof(STRATEGICEVENT));

    // write the current strategic event
    FileWrite(hFile, addressof(sGameEvent), sizeof(STRATEGICEVENT), addressof(uiNumBytesWritten));
    if (uiNumBytesWritten != sizeof(STRATEGICEVENT)) {
      return false;
    }

    pTempEvent = pTempEvent.value.next;
  }

  return true;
}

export function LoadStrategicEventsFromSavedGame(hFile: HWFILE): boolean {
  let uiNumGameEvents: UINT32;
  let sGameEvent: STRATEGICEVENT;
  let cnt: UINT32;
  let uiNumBytesRead: UINT32 = 0;
  let pTemp: Pointer<STRATEGICEVENT> = null;

  // erase the old Game Event queue
  DeleteAllStrategicEvents();

  // Read the number of strategic events
  FileRead(hFile, addressof(uiNumGameEvents), sizeof(UINT32), addressof(uiNumBytesRead));
  if (uiNumBytesRead != sizeof(UINT32)) {
    return false;
  }

  pTemp = null;

  // loop through all the events and save them.
  for (cnt = 0; cnt < uiNumGameEvents; cnt++) {
    let pTempEvent: Pointer<STRATEGICEVENT> = null;

    // allocate memory for the event
    pTempEvent = MemAlloc(sizeof(STRATEGICEVENT));
    if (pTempEvent == null)
      return false;

    // Read the current strategic event
    FileRead(hFile, addressof(sGameEvent), sizeof(STRATEGICEVENT), addressof(uiNumBytesRead));
    if (uiNumBytesRead != sizeof(STRATEGICEVENT)) {
      return false;
    }

    memcpy(pTempEvent, addressof(sGameEvent), sizeof(STRATEGICEVENT));

    // Add the new node to the list

    // if its the first node,
    if (cnt == 0) {
      // assign it as the head node
      gpEventList = pTempEvent;

      // assign the 'current node' to the head node
      pTemp = gpEventList;
    } else {
      // add the new node to the next field of the current node
      pTemp.value.next = pTempEvent;

      // advance the current node to the next node
      pTemp = pTemp.value.next;
    }

    // NULL out the next field ( cause there is no next field yet )
    pTempEvent.value.next = null;
  }

  return true;
}

function LockStrategicEventFromDeletion(pEvent: Pointer<STRATEGICEVENT>): void {
  pEvent.value.ubFlags |= SEF_PREVENT_DELETION;
}

function UnlockStrategicEventFromDeletion(pEvent: Pointer<STRATEGICEVENT>): void {
  pEvent.value.ubFlags &= ~SEF_PREVENT_DELETION;
}

function ValidateGameEvents(): void {
  let curr: Pointer<STRATEGICEVENT>;
  curr = gpEventList;
  while (curr) {
    curr = curr.value.next;
    if (curr == 0xdddddddd) {
      return;
    }
  }
}
