namespace ja2 {

// Smoke effect types
export const enum Enum308 {
  NO_SMOKE_EFFECT,
  NORMAL_SMOKE_EFFECT,
  TEARGAS_SMOKE_EFFECT,
  MUSTARDGAS_SMOKE_EFFECT,
  CREATURE_SMOKE_EFFECT,
}

export const SMOKE_EFFECT_INDOORS = 0x01;
export const SMOKE_EFFECT_ON_ROOF = 0x02;
export const SMOKE_EFFECT_MARK_FOR_UPDATE = 0x04;

export interface SMOKEEFFECT {
  sGridNo: INT16; // gridno at which the tear gas cloud is centered

  ubDuration: UINT8; // the number of turns gas will remain effective
  ubRadius: UINT8; // the current radius of the cloud in map tiles
  bFlags: UINT8; // 0 - outdoors (fast spread), 1 - indoors (slow)
  bAge: INT8; // the number of turns gas has been around
  fAllocated: boolean;
  bType: INT8;
  usItem: UINT16;
  ubOwner: UINT8;
  ubPadding: UINT8;
  uiTimeOfLastUpdate: UINT32;
}

export function createSmokeEffect(): SMOKEEFFECT {
  return {
    sGridNo: 0,
    ubDuration: 0,
    ubRadius: 0,
    bFlags: 0,
    bAge: 0,
    fAllocated: false,
    bType: 0,
    usItem: 0,
    ubOwner: 0,
    ubPadding: 0,
    uiTimeOfLastUpdate: 0,
  };
}

export function resetSmokeEffect(o: SMOKEEFFECT) {
  o.sGridNo = 0;
  o.ubDuration = 0;
  o.ubRadius = 0;
  o.bFlags = 0;
  o.bAge = 0;
  o.fAllocated = false;
  o.bType = 0;
  o.usItem = 0;
  o.ubOwner = 0;
  o.ubPadding = 0;
  o.uiTimeOfLastUpdate = 0;
}

export const SMOKE_EFFECT_SIZE = 16;

export function readSmokeEffect(o: SMOKEEFFECT, buffer: Buffer, offset: number = 0): number {
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubDuration = buffer.readUInt8(offset++);
  o.ubRadius = buffer.readUInt8(offset++);
  o.bFlags = buffer.readUInt8(offset++);
  o.bAge = buffer.readInt8(offset++);
  o.fAllocated = Boolean(buffer.readUInt8(offset++));
  o.bType = buffer.readInt8(offset++);
  o.usItem = buffer.readUInt16LE(offset); offset += 2;
  o.ubOwner = buffer.readUInt8(offset++);
  o.ubPadding = buffer.readUInt8(offset++);
  o.uiTimeOfLastUpdate = buffer.readUInt32LE(offset); offset += 4;
  return offset;
}

export function writeSmokeEffect(o: SMOKEEFFECT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeUInt8(o.ubDuration, offset);
  offset = buffer.writeUInt8(o.ubRadius, offset);
  offset = buffer.writeUInt8(o.bFlags, offset);
  offset = buffer.writeInt8(o.bAge, offset);
  offset = buffer.writeUInt8(Number(o.fAllocated), offset);
  offset = buffer.writeInt8(o.bType, offset);
  offset = buffer.writeUInt16LE(o.usItem, offset);
  offset = buffer.writeUInt8(o.ubOwner, offset);
  offset = buffer.writeUInt8(o.ubPadding, offset);
  offset = buffer.writeUInt32LE(o.uiTimeOfLastUpdate, offset);
  return offset;
}

}
