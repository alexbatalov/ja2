namespace ja2 {

export const SEF_PREVENT_DELETION = 0x01;
export const SEF_DELETION_PENDING = 0x02;

export interface STRATEGICEVENT {
  next: STRATEGICEVENT | null /* Pointer<STRATEGICEVENT> */;
  uiTimeStamp: UINT32;
  uiParam: UINT32;
  uiTimeOffset: UINT32;
  ubEventType: UINT8;
  ubCallbackID: UINT8;
  ubFlags: UINT8;
  bPadding: INT8[] /* [6] */;
}

export function createStrategicEvent(): STRATEGICEVENT {
  return {
    next: null,
    uiTimeStamp: 0,
    uiParam: 0,
    uiTimeOffset: 0,
    ubEventType: 0,
    ubCallbackID: 0,
    ubFlags: 0,
    bPadding: createArray(6, 0),
  }
}

export function copyStrategicEvent(destination: STRATEGICEVENT, source: STRATEGICEVENT) {
  destination.next = source.next;
  destination.uiTimeStamp = source.uiTimeStamp;
  destination.uiParam = source.uiParam;
  destination.uiTimeOffset = source.uiTimeOffset;
  destination.ubEventType = source.ubEventType;
  destination.ubCallbackID = source.ubCallbackID;
  destination.ubFlags = source.ubFlags;
  copyArray(destination.bPadding, source.bPadding);
}

export const STRATEGIC_EVENT_SIZE = 28;

export function readStrategicEvent(o: STRATEGICEVENT, buffer: Buffer, offset: number = 0): number {
  o.next = null; offset += 4; // pointer
  o.uiTimeStamp = buffer.readUInt32LE(offset); offset += 4;
  o.uiParam = buffer.readUInt32LE(offset); offset += 4;
  o.uiTimeOffset = buffer.readUInt32LE(offset); offset += 4;
  o.ubEventType = buffer.readUInt8(offset++);
  o.ubCallbackID = buffer.readUInt8(offset++);
  o.ubFlags = buffer.readUInt8(offset++);
  offset = readIntArray(o.bPadding, buffer, offset, 1);
  offset += 3; // padding
  return offset;
}

export function writeStrategicEvent(o: STRATEGICEVENT, buffer: Buffer, offset: number = 0): number {
  offset += writePadding(buffer, offset, 4); // pointer
  offset = buffer.writeUInt32LE(o.uiTimeStamp, offset);
  offset = buffer.writeUInt32LE(o.uiParam, offset);
  offset = buffer.writeUInt32LE(o.uiTimeOffset, offset);
  offset = buffer.writeUInt8(o.ubEventType, offset);
  offset = buffer.writeUInt8(o.ubCallbackID, offset);
  offset = buffer.writeUInt8(o.ubFlags, offset);
  offset = writeIntArray(o.bPadding, buffer, offset, 1);
  offset = writePadding(buffer, offset, 3); // padding
  return offset;
}

export const enum Enum133 {
  ONETIME_EVENT,
  RANGED_EVENT,
  ENDRANGED_EVENT,
  EVERYDAY_EVENT,
  PERIODIC_EVENT,
  QUEUED_EVENT,
}

}
