HLIST hEventQueue = NULL;
HLIST hDelayEventQueue = NULL;
HLIST hDemandEventQueue = NULL;

const QUEUE_RESIZE = 20;

function InitializeEventManager(): BOOLEAN {
  // Create Queue
  hEventQueue = CreateList(QUEUE_RESIZE, sizeof(PTR));

  if (hEventQueue == NULL) {
    return FALSE;
  }

  // Create Delay Queue
  hDelayEventQueue = CreateList(QUEUE_RESIZE, sizeof(PTR));

  if (hDelayEventQueue == NULL) {
    return FALSE;
  }

  // Create Demand Queue (events on this queue are only processed when specifically
  // called for by code)
  hDemandEventQueue = CreateList(QUEUE_RESIZE, sizeof(PTR));

  if (hDemandEventQueue == NULL) {
    return FALSE;
  }

  return TRUE;
}

function ShutdownEventManager(): BOOLEAN {
  if (hEventQueue != NULL) {
    DeleteList(hEventQueue);
  }

  if (hDelayEventQueue != NULL) {
    DeleteList(hDelayEventQueue);
  }

  if (hDemandEventQueue != NULL) {
    DeleteList(hDemandEventQueue);
  }

  return TRUE;
}

function AddEvent(uiEvent: UINT32, usDelay: UINT16, pEventData: PTR, uiDataSize: UINT32, ubQueueID: UINT8): BOOLEAN {
  EVENT *pEvent;
  UINT32 uiEventSize = sizeof(EVENT);
  HLIST hQueue;

  // Allocate new event
  pEvent = MemAlloc(uiEventSize + uiDataSize);

  CHECKF(pEvent != NULL);

  // Set values
  pEvent->TimeStamp = GetJA2Clock();
  pEvent->usDelay = usDelay;
  pEvent->uiEvent = uiEvent;
  pEvent->uiFlags = 0;
  pEvent->uiDataSize = uiDataSize;
  pEvent->pData = (BYTE *)pEvent;
  pEvent->pData = pEvent->pData + uiEventSize;

  memcpy(pEvent->pData, pEventData, uiDataSize);

  // Add event to queue
  hQueue = GetQueue(ubQueueID);
  hQueue = AddtoList(hQueue, &pEvent, ListSize(hQueue));
  SetQueue(ubQueueID, hQueue);

  return TRUE;
}

function RemoveEvent(ppEvent: Pointer<Pointer<EVENT>>, uiIndex: UINT32, ubQueueID: UINT8): BOOLEAN {
  UINT32 uiQueueSize;
  HLIST hQueue;

  // Get an event from queue, if one exists
  //

  hQueue = GetQueue(ubQueueID);

  // Get Size
  uiQueueSize = ListSize(hQueue);

  if (uiQueueSize > 0) {
    // Get
    CHECKF(RemfromList(hQueue, ppEvent, uiIndex) != FALSE);
  } else {
    return FALSE;
  }

  return TRUE;
}

function PeekEvent(ppEvent: Pointer<Pointer<EVENT>>, uiIndex: UINT32, ubQueueID: UINT8): BOOLEAN {
  UINT32 uiQueueSize;
  HLIST hQueue;

  // Get an event from queue, if one exists
  //

  hQueue = GetQueue(ubQueueID);

  // Get Size
  uiQueueSize = ListSize(hQueue);

  if (uiQueueSize > 0) {
    // Get
    CHECKF(PeekList(hQueue, ppEvent, uiIndex) != FALSE);
  } else {
    return FALSE;
  }

  return TRUE;
}

function FreeEvent(pEvent: Pointer<EVENT>): BOOLEAN {
  CHECKF(pEvent != NULL);

  // Delete event
  MemFree(pEvent);

  return TRUE;
}

function EventQueueSize(ubQueueID: UINT8): UINT32 {
  UINT32 uiQueueSize;
  HLIST hQueue;

  // Get an event from queue, if one exists
  //

  hQueue = GetQueue(ubQueueID);

  // Get Size
  uiQueueSize = ListSize(hQueue);

  return uiQueueSize;
}

function GetQueue(ubQueueID: UINT8): HLIST {
  switch (ubQueueID) {
    case PRIMARY_EVENT_QUEUE:
      return hEventQueue;
      break;

    case SECONDARY_EVENT_QUEUE:
      return hDelayEventQueue;
      break;

    case DEMAND_EVENT_QUEUE:
      return hDemandEventQueue;
      break;

    default:
      Assert(FALSE);
      return 0;
      break;
  }
}

function SetQueue(ubQueueID: UINT8, hQueue: HQUEUE): void {
  switch (ubQueueID) {
    case PRIMARY_EVENT_QUEUE:
      hEventQueue = hQueue;
      break;

    case SECONDARY_EVENT_QUEUE:
      hDelayEventQueue = hQueue;
      break;

    case DEMAND_EVENT_QUEUE:
      hDemandEventQueue = hQueue;
      break;

    default:
      Assert(FALSE);
      break;
  }
}
