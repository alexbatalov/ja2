namespace ja2 {

export let gpEventList: STRATEGICEVENT | null = null;

export let gfPreventDeletionOfAnyEvent: boolean = false;
let gfEventDeletionPending: boolean = false;

let gfProcessingGameEvents: boolean = false;
export let guiTimeStampOfCurrentlyExecutingEvent: UINT32 = 0;

// Determines if there are any events that will be processed between the current global time,
// and the beginning of the next global time.
export function GameEventsPending(uiAdjustment: UINT32): boolean {
  if (!gpEventList)
    return false;
  if (gpEventList.uiTimeStamp <= GetWorldTotalSeconds() + uiAdjustment)
    return true;
  return false;
}

// returns TRUE if any events were deleted
function DeleteEventsWithDeletionPending(): boolean {
  let curr: STRATEGICEVENT | null;
  let prev: STRATEGICEVENT | null;
  let temp: STRATEGICEVENT;
  let fEventDeleted: boolean = false;
  // ValidateGameEvents();
  curr = gpEventList;
  prev = null;
  while (curr) {
    // ValidateGameEvents();
    if (curr.ubFlags & SEF_DELETION_PENDING) {
      if (prev) {
        // deleting node in middle
        prev.next = curr.next;
        temp = curr;
        curr = curr.next;
        fEventDeleted = true;
        // ValidateGameEvents();
        continue;
      } else {
        // deleting head
        gpEventList = (<STRATEGICEVENT>gpEventList).next;
        temp = curr;
        prev = null;
        curr = curr.next;
        fEventDeleted = true;
        // ValidateGameEvents();
        continue;
      }
    }
    prev = curr;
    curr = curr.next;
  }
  gfEventDeletionPending = false;
  return fEventDeleted;
}

function AdjustClockToEventStamp(pEvent: STRATEGICEVENT, uiAdjustment: UINT32): UINT32 {
  let uiDiff: UINT32;

  uiDiff = pEvent.uiTimeStamp - guiGameClock;
  guiGameClock += uiDiff;
  uiAdjustment -= uiDiff;

  // Calculate the day, hour, and minutes.
  guiDay = (guiGameClock / NUM_SEC_IN_DAY);
  guiHour = (guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR;
  guiMin = (guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN;

  gswzWorldTimeStr = swprintf("%s %d, %02d:%02d", gpGameClockString[Enum366.STR_GAMECLOCK_DAY_NAME], guiDay, guiHour, guiMin);

  return uiAdjustment;
}

// If there are any events pending, they are processed, until the time limit is reached, or
// a major event is processed (one that requires the player's attention).
export function ProcessPendingGameEvents(uiAdjustment: UINT32, ubWarpCode: UINT8): void {
  let curr: STRATEGICEVENT | null;
  let pEvent: STRATEGICEVENT | null;
  let prev: STRATEGICEVENT | null;
  let temp: STRATEGICEVENT;
  let fDeleteEvent: boolean = false;
  let fDeleteQueuedEvent: boolean = false;

  gfTimeInterrupt = false;
  gfProcessingGameEvents = true;

  // While we have events inside the time range to be updated, process them...
  curr = gpEventList;
  prev = null; // prev only used when warping time to target time.
  while (!gfTimeInterrupt && curr && curr.uiTimeStamp <= guiGameClock + uiAdjustment) {
    fDeleteEvent = false;
    // Update the time by the difference, but ONLY if the event comes after the current time.
    // In the beginning of the game, series of events are created that are placed in the list
    // BEFORE the start time.  Those events will be processed without influencing the actual time.
    if (curr.uiTimeStamp > guiGameClock && ubWarpCode != Enum131.WARPTIME_PROCESS_TARGET_TIME_FIRST) {
      uiAdjustment = AdjustClockToEventStamp(curr, uiAdjustment);
    }
    // Process the event
    if (ubWarpCode != Enum131.WARPTIME_PROCESS_TARGET_TIME_FIRST) {
      fDeleteEvent = ExecuteStrategicEvent(curr);
    } else if (curr.uiTimeStamp == guiGameClock + uiAdjustment) {
      // if we are warping to the target time to process that event first,
      if (!curr.next || curr.next.uiTimeStamp > guiGameClock + uiAdjustment) {
        // make sure that we are processing the last event for that second
        uiAdjustment = AdjustClockToEventStamp(curr, uiAdjustment);

        fDeleteEvent = ExecuteStrategicEvent(curr);

        if (curr && prev && fDeleteQueuedEvent) {
          // The only case where we are deleting a node in the middle of the list
          prev.next = curr.next;
        }
      } else {
        // We are at the current target warp time however, there are still other events following in this time cycle.
        // We will only target the final event in this time.  NOTE:  Events are posted using a FIFO method
        prev = curr;
        curr = curr.next;
        continue;
      }
    } else {
      // We are warping time to the target time.  We haven't found the event yet,
      // so continuing will keep processing the list until we find it.  NOTE:  Events are posted using a FIFO method
      prev = curr;
      curr = curr.next;
      continue;
    }
    if (fDeleteEvent) {
      // Determine if event node is a special event requiring reposting
      switch (curr.ubEventType) {
        case Enum133.RANGED_EVENT:
          AddAdvancedStrategicEvent(Enum133.ENDRANGED_EVENT, curr.ubCallbackID, curr.uiTimeStamp + curr.uiTimeOffset, curr.uiParam);
          break;
        case Enum133.PERIODIC_EVENT:
          pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, curr.ubCallbackID, curr.uiTimeStamp + curr.uiTimeOffset, curr.uiParam);
          if (pEvent)
            pEvent.uiTimeOffset = curr.uiTimeOffset;
          break;
        case Enum133.EVERYDAY_EVENT:
          AddAdvancedStrategicEvent(Enum133.EVERYDAY_EVENT, curr.ubCallbackID, curr.uiTimeStamp + NUM_SEC_IN_DAY, curr.uiParam);
          break;
      }
      if (curr == gpEventList) {
        gpEventList = gpEventList.next;
        curr = gpEventList;
        prev = null;
        // ValidateGameEvents();
      } else {
        temp = curr;
        (<STRATEGICEVENT>prev).next = curr.next;
        curr = curr.next;
        // ValidateGameEvents();
      }
    } else {
      prev = curr;
      curr = curr.next;
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

export function AddAdvancedStrategicEvent(ubEventType: UINT8, ubCallbackID: UINT8, uiTimeStamp: UINT32, uiParam: UINT32): STRATEGICEVENT | null {
  let pNode: STRATEGICEVENT | null;
  let pNewNode: STRATEGICEVENT;
  let pPrevNode: STRATEGICEVENT | null;

  if (gfProcessingGameEvents && uiTimeStamp <= guiTimeStampOfCurrentlyExecutingEvent) {
    // Prevents infinite loops of posting events that are the same time or earlier than the event
// currently being processed.
    return null;
  }

  pNewNode = createStrategicEvent();
  pNewNode.ubCallbackID = ubCallbackID;
  pNewNode.uiParam = uiParam;
  pNewNode.ubEventType = ubEventType;
  pNewNode.uiTimeStamp = uiTimeStamp;
  pNewNode.uiTimeOffset = 0;

  // Search list for a place to insert
  pNode = gpEventList;

  // If it's the first head, do this!
  if (!pNode) {
    gpEventList = pNewNode;
    pNewNode.next = null;
  } else {
    pPrevNode = null;
    while (pNode) {
      if (uiTimeStamp < pNode.uiTimeStamp) {
        break;
      }
      pPrevNode = pNode;
      pNode = pNode.next;
    }

    // If we are at the end, set at the end!
    if (!pNode) {
      (<STRATEGICEVENT>pPrevNode).next = pNewNode;
      pNewNode.next = null;
    } else {
      // We have a previous node here
      // Insert IN FRONT!
      if (pPrevNode) {
        pNewNode.next = pPrevNode.next;
        pPrevNode.next = pNewNode;
      } else {
        // It's the head
        pNewNode.next = gpEventList;
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
  let pEvent: STRATEGICEVENT | null;
  pEvent = AddAdvancedStrategicEvent(Enum133.RANGED_EVENT, ubCallbackID, uiStartMin * 60, uiParam);
  if (pEvent) {
    pEvent.uiTimeOffset = uiLengthMin * 60;
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
  let pEvent: STRATEGICEVENT | null;
  pEvent = AddAdvancedStrategicEvent(Enum133.RANGED_EVENT, ubCallbackID, uiStartSeconds, uiParam);
  if (pEvent) {
    pEvent.uiTimeOffset = uiLengthSeconds;
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
  let pEvent: STRATEGICEVENT | null;
  pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOnceEveryXMinutes * 60, uiParam);
  if (pEvent) {
    pEvent.uiTimeOffset = uiOnceEveryXMinutes * 60;
    return true;
  }
  return false;
}

function AddPeriodStrategicEventUsingSeconds(ubCallbackID: UINT8, uiOnceEveryXSeconds: UINT32, uiParam: UINT32): boolean {
  let pEvent: STRATEGICEVENT | null;
  pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOnceEveryXSeconds, uiParam);
  if (pEvent) {
    pEvent.uiTimeOffset = uiOnceEveryXSeconds;
    return true;
  }
  return false;
}

export function AddPeriodStrategicEventWithOffset(ubCallbackID: UINT8, uiOnceEveryXMinutes: UINT32, uiOffsetFromCurrent: UINT32, uiParam: UINT32): boolean {
  let pEvent: STRATEGICEVENT | null;
  pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOffsetFromCurrent * 60, uiParam);
  if (pEvent) {
    pEvent.uiTimeOffset = uiOnceEveryXMinutes * 60;
    return true;
  }
  return false;
}

function AddPeriodStrategicEventUsingSecondsWithOffset(ubCallbackID: UINT8, uiOnceEveryXSeconds: UINT32, uiOffsetFromCurrent: UINT32, uiParam: UINT32): boolean {
  let pEvent: STRATEGICEVENT | null;
  pEvent = AddAdvancedStrategicEvent(Enum133.PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOffsetFromCurrent, uiParam);
  if (pEvent) {
    pEvent.uiTimeOffset = uiOnceEveryXSeconds;
    return true;
  }
  return false;
}

export function DeleteAllStrategicEventsOfType(ubCallbackID: UINT8): void {
  let curr: STRATEGICEVENT | null;
  let prev: STRATEGICEVENT | null;
  let temp: STRATEGICEVENT;
  prev = null;
  curr = gpEventList;
  while (curr) {
    if (curr.ubCallbackID == ubCallbackID && !(curr.ubFlags & SEF_DELETION_PENDING)) {
      if (gfPreventDeletionOfAnyEvent) {
        curr.ubFlags |= SEF_DELETION_PENDING;
        gfEventDeletionPending = true;
        prev = curr;
        curr = curr.next;
        continue;
      }
      // Detach the node
      if (prev)
        prev.next = curr.next;
      else
        gpEventList = curr.next;

      // isolate and remove curr
      temp = curr;
      curr = curr.next;
      // ValidateGameEvents();
    } else {
      // Advance all the nodes
      prev = curr;
      curr = curr.next;
    }
  }
}

export function DeleteAllStrategicEvents(): void {
  let temp: STRATEGICEVENT | null;
  while (gpEventList) {
    temp = gpEventList;
    gpEventList = gpEventList.next;
    // ValidateGameEvents();
    temp = null;
  }
  gpEventList = null;
}

// Searches for and removes the first event matching the supplied information.  There may very well be a need
// for more specific event removal, so let me know (Kris), of any support needs.  Function returns FALSE if
// no events were found or if the event wasn't deleted due to delete lock,
export function DeleteStrategicEvent(ubCallbackID: UINT8, uiParam: UINT32): boolean {
  let curr: STRATEGICEVENT | null;
  let prev: STRATEGICEVENT | null;
  curr = gpEventList;
  prev = null;
  while (curr) {
    // deleting middle
    if (curr.ubCallbackID == ubCallbackID && curr.uiParam == uiParam) {
      if (!(curr.ubFlags & SEF_DELETION_PENDING)) {
        if (gfPreventDeletionOfAnyEvent) {
          curr.ubFlags |= SEF_DELETION_PENDING;
          gfEventDeletionPending = true;
          return false;
        }
        if (prev) {
          prev.next = curr.next;
        } else {
          gpEventList = (<STRATEGICEVENT>gpEventList).next;
        }
        // ValidateGameEvents();
        return true;
      }
    }
    prev = curr;
    curr = curr.next;
  }
  return false;
}

// part of the game.sav files (not map files)
export function SaveStrategicEventsToSavedGame(hFile: HWFILE): boolean {
  let uiNumBytesWritten: UINT32 = 0;
  let sGameEvent: STRATEGICEVENT = createStrategicEvent();

  let uiNumGameEvents: UINT32 = 0;
  let pTempEvent: STRATEGICEVENT | null = gpEventList;
  let buffer: Buffer;

  // Go through the list and determine the number of events
  while (pTempEvent) {
    pTempEvent = pTempEvent.next;
    uiNumGameEvents++;
  }

  // write the number of strategic events
  buffer = Buffer.allocUnsafe(4);
  buffer.writeUInt32LE(uiNumGameEvents, 0);
  uiNumBytesWritten = FileWrite(hFile, buffer, 4);
  if (uiNumBytesWritten != 4) {
    return false;
  }

  // loop through all the events and save them.
  buffer = Buffer.allocUnsafe(STRATEGIC_EVENT_SIZE);
  pTempEvent = gpEventList;
  while (pTempEvent) {
    // save the current structure
    copyStrategicEvent(sGameEvent, pTempEvent);

    // write the current strategic event
    writeStrategicEvent(sGameEvent, buffer);
    uiNumBytesWritten = FileWrite(hFile, buffer, STRATEGIC_EVENT_SIZE);
    if (uiNumBytesWritten != STRATEGIC_EVENT_SIZE) {
      return false;
    }

    pTempEvent = pTempEvent.next;
  }

  return true;
}

export function LoadStrategicEventsFromSavedGame(hFile: HWFILE): boolean {
  let uiNumGameEvents: UINT32;
  let sGameEvent: STRATEGICEVENT = createStrategicEvent();
  let cnt: UINT32;
  let uiNumBytesRead: UINT32 = 0;
  let pTemp: STRATEGICEVENT | null = null;
  let buffer: Buffer;

  // erase the old Game Event queue
  DeleteAllStrategicEvents();

  // Read the number of strategic events
  buffer = Buffer.allocUnsafe(4);
  uiNumBytesRead = FileRead(hFile, buffer, 4);
  if (uiNumBytesRead != 4) {
    return false;
  }

  uiNumGameEvents = buffer.readUInt32LE(0);

  pTemp = null;

  // loop through all the events and save them.
  buffer = Buffer.allocUnsafe(STRATEGIC_EVENT_SIZE);
  for (cnt = 0; cnt < uiNumGameEvents; cnt++) {
    let pTempEvent: STRATEGICEVENT;

    // allocate memory for the event
    pTempEvent = createStrategicEvent();

    // Read the current strategic event
    uiNumBytesRead = FileRead(hFile, buffer, STRATEGIC_EVENT_SIZE);
    if (uiNumBytesRead != STRATEGIC_EVENT_SIZE) {
      return false;
    }

    readStrategicEvent(sGameEvent, buffer);

    copyStrategicEvent(pTempEvent, sGameEvent);

    // Add the new node to the list

    // if its the first node,
    if (pTemp == null) {
      // assign it as the head node
      gpEventList = pTempEvent;

      // assign the 'current node' to the head node
      pTemp = gpEventList;
    } else {
      // add the new node to the next field of the current node
      pTemp.next = pTempEvent;

      // advance the current node to the next node
      pTemp = pTemp.next;
    }

    // NULL out the next field ( cause there is no next field yet )
    pTempEvent.next = null;
  }

  return true;
}

}
