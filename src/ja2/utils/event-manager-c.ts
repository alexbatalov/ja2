namespace ja2 {

let hEventQueue: HLIST = null;
let hDelayEventQueue: HLIST = null;
let hDemandEventQueue: HLIST = null;

const QUEUE_RESIZE = 20;

export function InitializeEventManager(): boolean {
  // Create Queue
  hEventQueue = CreateList(QUEUE_RESIZE);

  if (hEventQueue == null) {
    return false;
  }

  // Create Delay Queue
  hDelayEventQueue = CreateList(QUEUE_RESIZE);

  if (hDelayEventQueue == null) {
    return false;
  }

  // Create Demand Queue (events on this queue are only processed when specifically
  // called for by code)
  hDemandEventQueue = CreateList(QUEUE_RESIZE);

  if (hDemandEventQueue == null) {
    return false;
  }

  return true;
}

export function ShutdownEventManager(): boolean {
  if (hEventQueue != null) {
    DeleteList(hEventQueue);
  }

  if (hDelayEventQueue != null) {
    DeleteList(hDelayEventQueue);
  }

  if (hDemandEventQueue != null) {
    DeleteList(hDemandEventQueue);
  }

  return true;
}

export function AddEvent(uiEvent: UINT32, usDelay: UINT16, pEventData: any, uiDataSize: UINT32, ubQueueID: UINT8): boolean {
  let pEvent: EVENT;
  let hQueue: HLIST;

  // Allocate new event
  pEvent = createEvent();;

  // Set values
  pEvent.TimeStamp = GetJA2Clock();
  pEvent.usDelay = usDelay;
  pEvent.uiEvent = uiEvent;
  pEvent.uiFlags = 0;
  pEvent.uiDataSize = uiDataSize;

  pEvent.pData = pEventData;

  // Add event to queue
  hQueue = GetQueue(ubQueueID);
  hQueue = AddtoList(hQueue, pEvent, ListSize(hQueue));
  SetQueue(ubQueueID, hQueue);

  return true;
}

export function RemoveEvent(uiIndex: UINT32, ubQueueID: UINT8): EVENT {
  let ppEvent: EVENT;

  let uiQueueSize: UINT32;
  let hQueue: HLIST;

  // Get an event from queue, if one exists
  //

  hQueue = GetQueue(ubQueueID);

  // Get Size
  uiQueueSize = ListSize(hQueue);

  if (uiQueueSize > 0) {
    // Get
    if ((ppEvent = RemfromList(hQueue, uiIndex)) === undefined) {
      return <EVENT><unknown>undefined;
    }
  } else {
    return <EVENT><unknown>undefined;
  }

  return ppEvent;
}

export function PeekEvent(uiIndex: UINT32, ubQueueID: UINT8): EVENT {
  let ppEvent: EVENT;

  let uiQueueSize: UINT32;
  let hQueue: HLIST;

  // Get an event from queue, if one exists
  //

  hQueue = GetQueue(ubQueueID);

  // Get Size
  uiQueueSize = ListSize(hQueue);

  if (uiQueueSize > 0) {
    // Get
    if ((ppEvent = PeekList(hQueue, uiIndex)) === undefined) {
      return <EVENT><unknown>undefined;
    }
  } else {
    return <EVENT><unknown>undefined;
  }

  return ppEvent;
}

export function FreeEvent(pEvent: EVENT): boolean {
  if (pEvent == null) {
    return false;
  }

  return true;
}

export function EventQueueSize(ubQueueID: UINT8): UINT32 {
  let uiQueueSize: UINT32;
  let hQueue: HLIST;

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
      Assert(false);
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
      Assert(false);
      break;
  }
}

}
