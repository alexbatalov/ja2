interface EVENT {
  TimeStamp: TIMER;
  uiFlags: UINT32;
  usDelay: UINT16;
  uiEvent: UINT32;
  uiDataSize: UINT32;
  pData: Pointer<BYTE>;
}

const PRIMARY_EVENT_QUEUE = 0;
const SECONDARY_EVENT_QUEUE = 1;
const DEMAND_EVENT_QUEUE = 2;

const EVENT_EXPIRED = 0x00000002;
