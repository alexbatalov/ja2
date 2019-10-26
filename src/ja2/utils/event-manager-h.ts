namespace ja2 {

export interface EVENT {
  TimeStamp: TIMER;
  uiFlags: UINT32;
  usDelay: UINT16;
  uiEvent: UINT32;
  uiDataSize: UINT32;
  pData: Pointer<BYTE>;
}

export const PRIMARY_EVENT_QUEUE = 0;
export const SECONDARY_EVENT_QUEUE = 1;
export const DEMAND_EVENT_QUEUE = 2;

export const EVENT_EXPIRED = 0x00000002;

}
