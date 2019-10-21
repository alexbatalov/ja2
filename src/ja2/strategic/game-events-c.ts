STRATEGICEVENT *gpEventList = NULL;

extern UINT32 guiGameClock;
extern BOOLEAN gfTimeInterruptPause;
BOOLEAN gfPreventDeletionOfAnyEvent = FALSE;
BOOLEAN gfEventDeletionPending = FALSE;

BOOLEAN gfProcessingGameEvents = FALSE;
UINT32 guiTimeStampOfCurrentlyExecutingEvent = 0;

// Determines if there are any events that will be processed between the current global time,
// and the beginning of the next global time.
function GameEventsPending(uiAdjustment: UINT32): BOOLEAN {
  if (!gpEventList)
    return FALSE;
  if (gpEventList->uiTimeStamp <= GetWorldTotalSeconds() + uiAdjustment)
    return TRUE;
  return FALSE;
}

// returns TRUE if any events were deleted
function DeleteEventsWithDeletionPending(): BOOLEAN {
  STRATEGICEVENT *curr, *prev, *temp;
  BOOLEAN fEventDeleted = FALSE;
  // ValidateGameEvents();
  curr = gpEventList;
  prev = NULL;
  while (curr) {
    // ValidateGameEvents();
    if (curr->ubFlags & SEF_DELETION_PENDING) {
      if (prev) {
        // deleting node in middle
        prev->next = curr->next;
        temp = curr;
        curr = curr->next;
        MemFree(temp);
        fEventDeleted = TRUE;
        // ValidateGameEvents();
        continue;
      } else {
        // deleting head
        gpEventList = gpEventList->next;
        temp = curr;
        prev = NULL;
        curr = curr->next;
        MemFree(temp);
        fEventDeleted = TRUE;
        // ValidateGameEvents();
        continue;
      }
    }
    prev = curr;
    curr = curr->next;
  }
  gfEventDeletionPending = FALSE;
  return fEventDeleted;
}

function AdjustClockToEventStamp(pEvent: Pointer<STRATEGICEVENT>, puiAdjustment: Pointer<UINT32>): void {
  UINT32 uiDiff;

  uiDiff = pEvent->uiTimeStamp - guiGameClock;
  guiGameClock += uiDiff;
  *puiAdjustment -= uiDiff;

  // Calculate the day, hour, and minutes.
  guiDay = (guiGameClock / NUM_SEC_IN_DAY);
  guiHour = (guiGameClock - (guiDay * NUM_SEC_IN_DAY)) / NUM_SEC_IN_HOUR;
  guiMin = (guiGameClock - ((guiDay * NUM_SEC_IN_DAY) + (guiHour * NUM_SEC_IN_HOUR))) / NUM_SEC_IN_MIN;

  swprintf(WORLDTIMESTR, L"%s %d, %02d:%02d", gpGameClockString[STR_GAMECLOCK_DAY_NAME], guiDay, guiHour, guiMin);
}

// If there are any events pending, they are processed, until the time limit is reached, or
// a major event is processed (one that requires the player's attention).
function ProcessPendingGameEvents(uiAdjustment: UINT32, ubWarpCode: UINT8): void {
  STRATEGICEVENT *curr, *pEvent, *prev, *temp;
  BOOLEAN fDeleteEvent = FALSE, fDeleteQueuedEvent = FALSE;

  gfTimeInterrupt = FALSE;
  gfProcessingGameEvents = TRUE;

  // While we have events inside the time range to be updated, process them...
  curr = gpEventList;
  prev = NULL; // prev only used when warping time to target time.
  while (!gfTimeInterrupt && curr && curr->uiTimeStamp <= guiGameClock + uiAdjustment) {
    fDeleteEvent = FALSE;
    // Update the time by the difference, but ONLY if the event comes after the current time.
    // In the beginning of the game, series of events are created that are placed in the list
    // BEFORE the start time.  Those events will be processed without influencing the actual time.
    if (curr->uiTimeStamp > guiGameClock && ubWarpCode != WARPTIME_PROCESS_TARGET_TIME_FIRST) {
      AdjustClockToEventStamp(curr, &uiAdjustment);
    }
    // Process the event
    if (ubWarpCode != WARPTIME_PROCESS_TARGET_TIME_FIRST) {
      fDeleteEvent = ExecuteStrategicEvent(curr);
    } else if (curr->uiTimeStamp == guiGameClock + uiAdjustment) {
      // if we are warping to the target time to process that event first,
      if (!curr->next || curr->next->uiTimeStamp > guiGameClock + uiAdjustment) {
        // make sure that we are processing the last event for that second
        AdjustClockToEventStamp(curr, &uiAdjustment);

        fDeleteEvent = ExecuteStrategicEvent(curr);

        if (curr && prev && fDeleteQueuedEvent) {
          // The only case where we are deleting a node in the middle of the list
          prev->next = curr->next;
        }
      } else {
        // We are at the current target warp time however, there are still other events following in this time cycle.
        // We will only target the final event in this time.  NOTE:  Events are posted using a FIFO method
        prev = curr;
        curr = curr->next;
        continue;
      }
    } else {
      // We are warping time to the target time.  We haven't found the event yet,
      // so continuing will keep processing the list until we find it.  NOTE:  Events are posted using a FIFO method
      prev = curr;
      curr = curr->next;
      continue;
    }
    if (fDeleteEvent) {
      // Determine if event node is a special event requiring reposting
      switch (curr->ubEventType) {
        case RANGED_EVENT:
          AddAdvancedStrategicEvent(ENDRANGED_EVENT, curr->ubCallbackID, curr->uiTimeStamp + curr->uiTimeOffset, curr->uiParam);
          break;
        case PERIODIC_EVENT:
          pEvent = AddAdvancedStrategicEvent(PERIODIC_EVENT, curr->ubCallbackID, curr->uiTimeStamp + curr->uiTimeOffset, curr->uiParam);
          if (pEvent)
            pEvent->uiTimeOffset = curr->uiTimeOffset;
          break;
        case EVERYDAY_EVENT:
          AddAdvancedStrategicEvent(EVERYDAY_EVENT, curr->ubCallbackID, curr->uiTimeStamp + NUM_SEC_IN_DAY, curr->uiParam);
          break;
      }
      if (curr == gpEventList) {
        gpEventList = gpEventList->next;
        MemFree(curr);
        curr = gpEventList;
        prev = NULL;
        // ValidateGameEvents();
      } else {
        temp = curr;
        prev->next = curr->next;
        curr = curr->next;
        MemFree(temp);
        // ValidateGameEvents();
      }
    } else {
      prev = curr;
      curr = curr->next;
    }
  }

  gfProcessingGameEvents = FALSE;

  if (gfEventDeletionPending) {
    DeleteEventsWithDeletionPending();
  }

  if (uiAdjustment && !gfTimeInterrupt)
    guiGameClock += uiAdjustment;
}

function AddSameDayStrategicEvent(ubCallbackID: UINT8, uiMinStamp: UINT32, uiParam: UINT32): BOOLEAN {
  return AddStrategicEvent(ubCallbackID, uiMinStamp + GetWorldDayInMinutes(), uiParam);
}

function AddSameDayStrategicEventUsingSeconds(ubCallbackID: UINT8, uiSecondStamp: UINT32, uiParam: UINT32): BOOLEAN {
  return AddStrategicEventUsingSeconds(ubCallbackID, uiSecondStamp + GetWorldDayInSeconds(), uiParam);
}

function AddFutureDayStrategicEvent(ubCallbackID: UINT8, uiMinStamp: UINT32, uiParam: UINT32, uiNumDaysFromPresent: UINT32): BOOLEAN {
  UINT32 uiDay;
  uiDay = GetWorldDay();
  return AddStrategicEvent(ubCallbackID, uiMinStamp + GetFutureDayInMinutes(uiDay + uiNumDaysFromPresent), uiParam);
}

function AddFutureDayStrategicEventUsingSeconds(ubCallbackID: UINT8, uiSecondStamp: UINT32, uiParam: UINT32, uiNumDaysFromPresent: UINT32): BOOLEAN {
  UINT32 uiDay;
  uiDay = GetWorldDay();
  return AddStrategicEventUsingSeconds(ubCallbackID, uiSecondStamp + GetFutureDayInMinutes(uiDay + uiNumDaysFromPresent) * 60, uiParam);
}

function AddAdvancedStrategicEvent(ubEventType: UINT8, ubCallbackID: UINT8, uiTimeStamp: UINT32, uiParam: UINT32): Pointer<STRATEGICEVENT> {
  STRATEGICEVENT *pNode, *pNewNode, *pPrevNode;

  if (gfProcessingGameEvents && uiTimeStamp <= guiTimeStampOfCurrentlyExecutingEvent) {
    // Prevents infinite loops of posting events that are the same time or earlier than the event
// currently being processed.
    return NULL;
  }

  pNewNode = MemAlloc(sizeof(STRATEGICEVENT));
  Assert(pNewNode);
  memset(pNewNode, 0, sizeof(STRATEGICEVENT));
  pNewNode->ubCallbackID = ubCallbackID;
  pNewNode->uiParam = uiParam;
  pNewNode->ubEventType = ubEventType;
  pNewNode->uiTimeStamp = uiTimeStamp;
  pNewNode->uiTimeOffset = 0;

  // Search list for a place to insert
  pNode = gpEventList;

  // If it's the first head, do this!
  if (!pNode) {
    gpEventList = pNewNode;
    pNewNode->next = NULL;
  } else {
    pPrevNode = NULL;
    while (pNode) {
      if (uiTimeStamp < pNode->uiTimeStamp) {
        break;
      }
      pPrevNode = pNode;
      pNode = pNode->next;
    }

    // If we are at the end, set at the end!
    if (!pNode) {
      pPrevNode->next = pNewNode;
      pNewNode->next = NULL;
    } else {
      // We have a previous node here
      // Insert IN FRONT!
      if (pPrevNode) {
        pNewNode->next = pPrevNode->next;
        pPrevNode->next = pNewNode;
      } else {
        // It's the head
        pNewNode->next = gpEventList;
        gpEventList = pNewNode;
      }
    }
  }

  return pNewNode;
}

function AddStrategicEvent(ubCallbackID: UINT8, uiMinStamp: UINT32, uiParam: UINT32): BOOLEAN {
  if (AddAdvancedStrategicEvent(ONETIME_EVENT, ubCallbackID, uiMinStamp * 60, uiParam))
    return TRUE;
  return FALSE;
}

function AddStrategicEventUsingSeconds(ubCallbackID: UINT8, uiSecondStamp: UINT32, uiParam: UINT32): BOOLEAN {
  if (AddAdvancedStrategicEvent(ONETIME_EVENT, ubCallbackID, uiSecondStamp, uiParam))
    return TRUE;
  return FALSE;
}

function AddRangedStrategicEvent(ubCallbackID: UINT8, uiStartMin: UINT32, uiLengthMin: UINT32, uiParam: UINT32): BOOLEAN {
  STRATEGICEVENT *pEvent;
  pEvent = AddAdvancedStrategicEvent(RANGED_EVENT, ubCallbackID, uiStartMin * 60, uiParam);
  if (pEvent) {
    pEvent->uiTimeOffset = uiLengthMin * 60;
    return TRUE;
  }
  return FALSE;
}

function AddSameDayRangedStrategicEvent(ubCallbackID: UINT8, uiStartMin: UINT32, uiLengthMin: UINT32, uiParam: UINT32): BOOLEAN {
  return AddRangedStrategicEvent(ubCallbackID, uiStartMin + GetWorldDayInMinutes(), uiLengthMin, uiParam);
}

function AddFutureDayRangedStrategicEvent(ubCallbackID: UINT8, uiStartMin: UINT32, uiLengthMin: UINT32, uiParam: UINT32, uiNumDaysFromPresent: UINT32): BOOLEAN {
  return AddRangedStrategicEvent(ubCallbackID, uiStartMin + GetFutureDayInMinutes(GetWorldDay() + uiNumDaysFromPresent), uiLengthMin, uiParam);
}

function AddRangedStrategicEventUsingSeconds(ubCallbackID: UINT8, uiStartSeconds: UINT32, uiLengthSeconds: UINT32, uiParam: UINT32): BOOLEAN {
  STRATEGICEVENT *pEvent;
  pEvent = AddAdvancedStrategicEvent(RANGED_EVENT, ubCallbackID, uiStartSeconds, uiParam);
  if (pEvent) {
    pEvent->uiTimeOffset = uiLengthSeconds;
    return TRUE;
  }
  return FALSE;
}

function AddSameDayRangedStrategicEventUsingSeconds(ubCallbackID: UINT8, uiStartSeconds: UINT32, uiLengthSeconds: UINT32, uiParam: UINT32): BOOLEAN {
  return AddRangedStrategicEventUsingSeconds(ubCallbackID, uiStartSeconds + GetWorldDayInSeconds(), uiLengthSeconds, uiParam);
}

function AddFutureDayRangedStrategicEventUsingSeconds(ubCallbackID: UINT8, uiStartSeconds: UINT32, uiLengthSeconds: UINT32, uiParam: UINT32, uiNumDaysFromPresent: UINT32): BOOLEAN {
  return AddRangedStrategicEventUsingSeconds(ubCallbackID, uiStartSeconds + GetFutureDayInMinutes(GetWorldDay() + uiNumDaysFromPresent) * 60, uiLengthSeconds, uiParam);
}

function AddEveryDayStrategicEvent(ubCallbackID: UINT8, uiStartMin: UINT32, uiParam: UINT32): BOOLEAN {
  if (AddAdvancedStrategicEvent(EVERYDAY_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiStartMin * 60, uiParam))
    return TRUE;
  return FALSE;
}

function AddEveryDayStrategicEventUsingSeconds(ubCallbackID: UINT8, uiStartSeconds: UINT32, uiParam: UINT32): BOOLEAN {
  if (AddAdvancedStrategicEvent(EVERYDAY_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiStartSeconds, uiParam))
    return TRUE;
  return FALSE;
}

// NEW:  Period Events
// Event will get processed automatically once every X minutes.
function AddPeriodStrategicEvent(ubCallbackID: UINT8, uiOnceEveryXMinutes: UINT32, uiParam: UINT32): BOOLEAN {
  STRATEGICEVENT *pEvent;
  pEvent = AddAdvancedStrategicEvent(PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOnceEveryXMinutes * 60, uiParam);
  if (pEvent) {
    pEvent->uiTimeOffset = uiOnceEveryXMinutes * 60;
    return TRUE;
  }
  return FALSE;
}

function AddPeriodStrategicEventUsingSeconds(ubCallbackID: UINT8, uiOnceEveryXSeconds: UINT32, uiParam: UINT32): BOOLEAN {
  STRATEGICEVENT *pEvent;
  pEvent = AddAdvancedStrategicEvent(PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOnceEveryXSeconds, uiParam);
  if (pEvent) {
    pEvent->uiTimeOffset = uiOnceEveryXSeconds;
    return TRUE;
  }
  return FALSE;
}

function AddPeriodStrategicEventWithOffset(ubCallbackID: UINT8, uiOnceEveryXMinutes: UINT32, uiOffsetFromCurrent: UINT32, uiParam: UINT32): BOOLEAN {
  STRATEGICEVENT *pEvent;
  pEvent = AddAdvancedStrategicEvent(PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOffsetFromCurrent * 60, uiParam);
  if (pEvent) {
    pEvent->uiTimeOffset = uiOnceEveryXMinutes * 60;
    return TRUE;
  }
  return FALSE;
}

function AddPeriodStrategicEventUsingSecondsWithOffset(ubCallbackID: UINT8, uiOnceEveryXSeconds: UINT32, uiOffsetFromCurrent: UINT32, uiParam: UINT32): BOOLEAN {
  STRATEGICEVENT *pEvent;
  pEvent = AddAdvancedStrategicEvent(PERIODIC_EVENT, ubCallbackID, GetWorldDayInSeconds() + uiOffsetFromCurrent, uiParam);
  if (pEvent) {
    pEvent->uiTimeOffset = uiOnceEveryXSeconds;
    return TRUE;
  }
  return FALSE;
}

function DeleteAllStrategicEventsOfType(ubCallbackID: UINT8): void {
  STRATEGICEVENT *curr, *prev, *temp;
  prev = NULL;
  curr = gpEventList;
  while (curr) {
    if (curr->ubCallbackID == ubCallbackID && !(curr->ubFlags & SEF_DELETION_PENDING)) {
      if (gfPreventDeletionOfAnyEvent) {
        curr->ubFlags |= SEF_DELETION_PENDING;
        gfEventDeletionPending = TRUE;
        prev = curr;
        curr = curr->next;
        continue;
      }
      // Detach the node
      if (prev)
        prev->next = curr->next;
      else
        gpEventList = curr->next;

      // isolate and remove curr
      temp = curr;
      curr = curr->next;
      MemFree(temp);
      // ValidateGameEvents();
    } else {
      // Advance all the nodes
      prev = curr;
      curr = curr->next;
    }
  }
}

function DeleteAllStrategicEvents(): void {
  STRATEGICEVENT *temp;
  while (gpEventList) {
    temp = gpEventList;
    gpEventList = gpEventList->next;
    MemFree(temp);
    // ValidateGameEvents();
    temp = NULL;
  }
  gpEventList = NULL;
}

// Searches for and removes the first event matching the supplied information.  There may very well be a need
// for more specific event removal, so let me know (Kris), of any support needs.  Function returns FALSE if
// no events were found or if the event wasn't deleted due to delete lock,
function DeleteStrategicEvent(ubCallbackID: UINT8, uiParam: UINT32): BOOLEAN {
  STRATEGICEVENT *curr, *prev;
  curr = gpEventList;
  prev = NULL;
  while (curr) {
    // deleting middle
    if (curr->ubCallbackID == ubCallbackID && curr->uiParam == uiParam) {
      if (!(curr->ubFlags & SEF_DELETION_PENDING)) {
        if (gfPreventDeletionOfAnyEvent) {
          curr->ubFlags |= SEF_DELETION_PENDING;
          gfEventDeletionPending = TRUE;
          return FALSE;
        }
        if (prev) {
          prev->next = curr->next;
        } else {
          gpEventList = gpEventList->next;
        }
        MemFree(curr);
        // ValidateGameEvents();
        return TRUE;
      }
    }
    prev = curr;
    curr = curr->next;
  }
  return FALSE;
}

// part of the game.sav files (not map files)
function SaveStrategicEventsToSavedGame(hFile: HWFILE): BOOLEAN {
  UINT32 uiNumBytesWritten = 0;
  STRATEGICEVENT sGameEvent;

  UINT32 uiNumGameEvents = 0;
  STRATEGICEVENT *pTempEvent = gpEventList;

  // Go through the list and determine the number of events
  while (pTempEvent) {
    pTempEvent = pTempEvent->next;
    uiNumGameEvents++;
  }

  // write the number of strategic events
  FileWrite(hFile, &uiNumGameEvents, sizeof(UINT32), &uiNumBytesWritten);
  if (uiNumBytesWritten != sizeof(UINT32)) {
    return FALSE;
  }

  // loop through all the events and save them.
  pTempEvent = gpEventList;
  while (pTempEvent) {
    // save the current structure
    memcpy(&sGameEvent, pTempEvent, sizeof(STRATEGICEVENT));

    // write the current strategic event
    FileWrite(hFile, &sGameEvent, sizeof(STRATEGICEVENT), &uiNumBytesWritten);
    if (uiNumBytesWritten != sizeof(STRATEGICEVENT)) {
      return FALSE;
    }

    pTempEvent = pTempEvent->next;
  }

  return TRUE;
}

function LoadStrategicEventsFromSavedGame(hFile: HWFILE): BOOLEAN {
  UINT32 uiNumGameEvents;
  STRATEGICEVENT sGameEvent;
  UINT32 cnt;
  UINT32 uiNumBytesRead = 0;
  STRATEGICEVENT *pTemp = NULL;

  // erase the old Game Event queue
  DeleteAllStrategicEvents();

  // Read the number of strategic events
  FileRead(hFile, &uiNumGameEvents, sizeof(UINT32), &uiNumBytesRead);
  if (uiNumBytesRead != sizeof(UINT32)) {
    return FALSE;
  }

  pTemp = NULL;

  // loop through all the events and save them.
  for (cnt = 0; cnt < uiNumGameEvents; cnt++) {
    STRATEGICEVENT *pTempEvent = NULL;

    // allocate memory for the event
    pTempEvent = MemAlloc(sizeof(STRATEGICEVENT));
    if (pTempEvent == NULL)
      return FALSE;

    // Read the current strategic event
    FileRead(hFile, &sGameEvent, sizeof(STRATEGICEVENT), &uiNumBytesRead);
    if (uiNumBytesRead != sizeof(STRATEGICEVENT)) {
      return FALSE;
    }

    memcpy(pTempEvent, &sGameEvent, sizeof(STRATEGICEVENT));

    // Add the new node to the list

    // if its the first node,
    if (cnt == 0) {
      // assign it as the head node
      gpEventList = pTempEvent;

      // assign the 'current node' to the head node
      pTemp = gpEventList;
    } else {
      // add the new node to the next field of the current node
      pTemp->next = pTempEvent;

      // advance the current node to the next node
      pTemp = pTemp->next;
    }

    // NULL out the next field ( cause there is no next field yet )
    pTempEvent->next = NULL;
  }

  return TRUE;
}

function LockStrategicEventFromDeletion(pEvent: Pointer<STRATEGICEVENT>): void {
  pEvent->ubFlags |= SEF_PREVENT_DELETION;
}

function UnlockStrategicEventFromDeletion(pEvent: Pointer<STRATEGICEVENT>): void {
  pEvent->ubFlags &= ~SEF_PREVENT_DELETION;
}

function ValidateGameEvents(): void {
  STRATEGICEVENT *curr;
  curr = gpEventList;
  while (curr) {
    curr = curr->next;
    if (curr == (STRATEGICEVENT *)0xdddddddd) {
      return;
    }
  }
}
