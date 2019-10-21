const SEF_PREVENT_DELETION = 0x01;
const SEF_DELETION_PENDING = 0x02;

interface STRATEGICEVENT {
  next: Pointer<STRATEGICEVENT>;
  uiTimeStamp: UINT32;
  uiParam: UINT32;
  uiTimeOffset: UINT32;
  ubEventType: UINT8;
  ubCallbackID: UINT8;
  ubFlags: UINT8;
  bPadding: INT8[] /* [6] */;
}

const enum Enum133 {
  ONETIME_EVENT,
  RANGED_EVENT,
  ENDRANGED_EVENT,
  EVERYDAY_EVENT,
  PERIODIC_EVENT,
  QUEUED_EVENT,
}
