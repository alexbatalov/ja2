namespace ja2 {

let hEventQueue: EVENT[] = <EVENT[]><unknown>null;
let hDelayEventQueue: EVENT[] = <EVENT[]><unknown>null;
let hDemandEventQueue: EVENT[] = <EVENT[]><unknown>null;

const QUEUE_RESIZE = 20;

export function InitializeEventManager(): boolean {
  // Create Queue
  hEventQueue = [];

  // Create Delay Queue
  hDelayEventQueue = [];

  // Create Demand Queue (events on this queue are only processed when specifically
  // called for by code)
  hDemandEventQueue = [];

  return true;
}

export function ShutdownEventManager(): boolean {
  if (hEventQueue != null) {
    hEventQueue = <EVENT[]><unknown>null;
  }

  if (hDelayEventQueue != null) {
    hDelayEventQueue = <EVENT[]><unknown>null;
  }

  if (hDemandEventQueue != null) {
    hDemandEventQueue = <EVENT[]><unknown>null;
  }

  return true;
}

export function AddEvent(uiEvent: UINT32, usDelay: UINT16, pEventData: any, uiDataSize: UINT32, ubQueueID: UINT8): boolean {
  let pEvent: EVENT;
  let hQueue: EVENT[];

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
  hQueue.push(pEvent);
  SetQueue(ubQueueID, hQueue);

  return true;
}

export function RemoveEvent(uiIndex: UINT32, ubQueueID: UINT8): EVENT {
  let ppEvent: EVENT | undefined;

  let uiQueueSize: UINT32;
  let hQueue: EVENT[];

  // Get an event from queue, if one exists
  //

  hQueue = GetQueue(ubQueueID);

  // Get Size
  uiQueueSize = hQueue.length;

  if (uiQueueSize > 0) {
    // Get
    ppEvent = hQueue[uiIndex];
    hQueue.splice(uiIndex, 1);
    if (ppEvent === undefined) {
      return <EVENT><unknown>undefined;
    }
  } else {
    return <EVENT><unknown>undefined;
  }

  return ppEvent;
}

export function PeekEvent(uiIndex: UINT32, ubQueueID: UINT8): EVENT {
  let ppEvent: EVENT | undefined;

  let uiQueueSize: UINT32;
  let hQueue: EVENT[];

  // Get an event from queue, if one exists
  //

  hQueue = GetQueue(ubQueueID);

  // Get Size
  uiQueueSize = hQueue.length;

  if (uiQueueSize > 0) {
    // Get
    if ((ppEvent = hQueue[uiIndex]) === undefined) {
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
  let hQueue: EVENT[];

  // Get an event from queue, if one exists
  //

  hQueue = GetQueue(ubQueueID);

  // Get Size
  uiQueueSize = hQueue.length;

  return uiQueueSize;
}

function GetQueue(ubQueueID: UINT8): EVENT[] {
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
      break;
  }
}

function SetQueue(ubQueueID: UINT8, hQueue: EVENT[]): void {
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
