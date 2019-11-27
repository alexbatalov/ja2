namespace ja2 {

// Light effect types
export const enum Enum305 {
  NO_LIGHT_EFFECT,
  LIGHT_FLARE_MARK_1,
}

export interface LIGHTEFFECT {
  sGridNo: INT16; // gridno at which the tear gas cloud is centered

  ubDuration: UINT8; // the number of turns will remain effective
  bRadius: UINT8; // the current radius
  bAge: INT8; // the number of turns light has been around
  fAllocated: boolean;
  bType: INT8;
  iLight: INT32;
  uiTimeOfLastUpdate: UINT32;
}

export function createLightEffect(): LIGHTEFFECT {
  return {
    sGridNo: 0,
    ubDuration: 0,
    bRadius: 0,
    bAge: 0,
    fAllocated: false,
    bType: 0,
    iLight: 0,
    uiTimeOfLastUpdate: 0,
  };
}

export function resetLightEffect(o: LIGHTEFFECT) {
  o.sGridNo = 0;
  o.ubDuration = 0;
  o.bRadius = 0;
  o.bAge = 0;
  o.fAllocated = false;
  o.bType = 0;
  o.iLight = 0;
  o.uiTimeOfLastUpdate = 0;
}

export const LIGHT_EFFECT_SIZE = 16;

export function readLightEffect(o: LIGHTEFFECT, buffer: Buffer, offset: number = 0): number {
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubDuration = buffer.readUInt8(offset++);
  o.bRadius = buffer.readUInt8(offset++);
  o.bAge = buffer.readInt8(offset++);
  o.fAllocated = Boolean(buffer.readUInt8(offset++));
  o.bType = buffer.readInt8(offset++);
  offset++; // padding
  o.iLight = buffer.readInt32LE(offset); offset += 4;
  o.uiTimeOfLastUpdate = buffer.readUInt32LE(offset); offset += 4;
  return offset;
}

export function writeLightEffect(o: LIGHTEFFECT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeUInt8(o.ubDuration, offset);
  offset = buffer.writeUInt8(o.bRadius, offset);
  offset = buffer.writeInt8(o.bAge, offset);
  offset = buffer.writeUInt8(Number(o.fAllocated), offset);
  offset = buffer.writeInt8(o.bType, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeInt32LE(o.iLight, offset);
  offset = buffer.writeUInt32LE(o.uiTimeOfLastUpdate, offset);
  return offset;
}

}
