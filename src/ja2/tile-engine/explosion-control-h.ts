namespace ja2 {

export const MAX_DISTANCE_EXPLOSIVE_CAN_DESTROY_STRUCTURES = 2;

export const EXPLOSION_FLAG_USEABSPOS = 0x00000001;
export const EXPLOSION_FLAG_DISPLAYONLY = 0x00000002;

// Explosion Data
export interface EXPLOSION_PARAMS {
  uiFlags: UINT32;

  ubOwner: UINT8;
  ubTypeID: UINT8;

  usItem: UINT16;

  sX: INT16; // World X ( optional )
  sY: INT16; // World Y ( optional )
  sZ: INT16; // World Z ( optional )
  sGridNo: INT16; // World GridNo
  fLocate: boolean;
  bLevel: INT8; // World level
  ubUnsed: UINT8[] /* [1] */;
}

export function createExplosionParams(): EXPLOSION_PARAMS {
  return {
    uiFlags: 0,
    ubOwner: 0,
    ubTypeID: 0,
    usItem: 0,
    sX: 0,
    sY: 0,
    sZ: 0,
    sGridNo: 0,
    fLocate: false,
    bLevel: 0,
    ubUnsed: createArray(1, 0),
  };
}

export function resetExplosionParams(o: EXPLOSION_PARAMS) {
  o.uiFlags = 0;
  o.ubOwner = 0;
  o.ubTypeID = 0;
  o.usItem = 0;
  o.sX = 0;
  o.sY = 0;
  o.sZ = 0;
  o.sGridNo = 0;
  o.fLocate = false;
  o.bLevel = 0;
  o.ubUnsed.fill(0);
}

export function copyExplosionParams(destination: EXPLOSION_PARAMS, source: EXPLOSION_PARAMS) {
  destination.uiFlags = source.uiFlags;
  destination.ubOwner = source.ubOwner;
  destination.ubTypeID = source.ubTypeID;
  destination.usItem = source.usItem;
  destination.sX = source.sX;
  destination.sY = source.sY;
  destination.sZ = source.sZ;
  destination.sGridNo = source.sGridNo;
  destination.fLocate = source.fLocate;
  destination.bLevel = source.bLevel;
  copyArray(destination.ubUnsed, source.ubUnsed);
}

export const EXPLOSION_PARAMS_SIZE = 20;

export function readExplosionParams(o: EXPLOSION_PARAMS, buffer: Buffer, offset: number = 0): number {
  o.uiFlags = buffer.readUInt32LE(offset); offset += 4;
  o.ubOwner = buffer.readUInt8(offset++);
  o.ubTypeID = buffer.readUInt8(offset++);
  o.usItem = buffer.readUInt16LE(offset); offset += 2;
  o.sX = buffer.readInt16LE(offset); offset += 2;
  o.sY = buffer.readInt16LE(offset); offset += 2;
  o.sZ = buffer.readInt16LE(offset); offset += 2;
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.fLocate = Boolean(buffer.readUInt8(offset++));
  o.bLevel = buffer.readInt8(offset++);
  offset = readUIntArray(o.ubUnsed, buffer, offset, 1);
  offset++; // padding
  return offset;
}

export function writeExplosionParams(o: EXPLOSION_PARAMS, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiFlags, offset);
  offset = buffer.writeUInt8(o.ubOwner, offset);
  offset = buffer.writeUInt8(o.ubTypeID, offset);
  offset = buffer.writeUInt16LE(o.usItem, offset);
  offset = buffer.writeInt16LE(o.sX, offset);
  offset = buffer.writeInt16LE(o.sY, offset);
  offset = buffer.writeInt16LE(o.sZ, offset);
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeUInt8(Number(o.fLocate), offset);
  offset = buffer.writeInt8(o.bLevel, offset);
  offset = writeUIntArray(o.ubUnsed, buffer, offset, 1);
  offset = writePadding(buffer, offset, 1); // padding
  return offset;
}

export interface EXPLOSIONTYPE {
  Params: EXPLOSION_PARAMS;
  fAllocated: boolean;
  sCurrentFrame: INT16;
  iID: INT32;
  iLightID: INT32;
  ubUnsed: UINT8[] /* [2] */;
}

export function createExplosionType(): EXPLOSIONTYPE {
  return {
    Params: createExplosionParams(),
    fAllocated: false,
    sCurrentFrame: 0,
    iID: 0,
    iLightID: 0,
    ubUnsed: createArray(2, 0),
  };
}

export function resetExplosionType(o: EXPLOSIONTYPE) {
  resetExplosionParams(o.Params);
  o.fAllocated = false;
  o.sCurrentFrame = 0;
  o.iID = 0;
  o.iLightID = 0;
  o.ubUnsed.fill(0);
}

export const EXPLOSION_TYPE_SIZE = 36;

export function readExplosionType(o: EXPLOSIONTYPE, buffer: Buffer, offset: number = 0): number {
  offset = readExplosionParams(o.Params, buffer, offset);
  o.fAllocated = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.sCurrentFrame = buffer.readInt16LE(offset); offset += 2;
  o.iID = buffer.readInt32LE(offset); offset += 4;
  o.iLightID = buffer.readInt32LE(offset); offset += 4;
  offset = readUIntArray(o.ubUnsed, buffer, offset, 1);
  offset += 2; // padding
  return offset;
}

export function writeExplosionType(o: EXPLOSIONTYPE, buffer: Buffer, offset: number = 0): number {
  offset = writeExplosionParams(o.Params, buffer, offset);
  offset = buffer.writeUInt8(Number(o.fAllocated), offset);
  offset = writePadding(buffer, offset, 1);
  offset = buffer.writeInt16LE(o.sCurrentFrame, offset);
  offset = buffer.writeInt32LE(o.iID, offset);
  offset = buffer.writeInt32LE(o.iLightID, offset);
  offset = writeUIntArray(o.ubUnsed, buffer, offset, 1);
  offset = writePadding(buffer, offset, 2);
  return offset;
}

export const enum Enum304 {
  NO_BLAST,
  BLAST_1,
  BLAST_2,
  BLAST_3,
  STUN_BLAST,
  WATER_BLAST,
  TARGAS_EXP,
  SMOKE_EXP,
  MUSTARD_EXP,

  NUM_EXP_TYPES,
}

export interface ExplosionQueueElement {
  uiWorldBombIndex: UINT32;
  uiTimeStamp: UINT32;
  fExists: boolean /* UINT8 */;
}

export function createExplosionQueueElement(): ExplosionQueueElement {
  return {
    uiWorldBombIndex: 0,
    uiTimeStamp: 0,
    fExists: false,
  };
}

export function resetExplosionQueueElement(o: ExplosionQueueElement) {
  o.uiWorldBombIndex = 0;
  o.uiTimeStamp = 0;
  o.fExists = false;
}

export const EXPLOSION_QUEUE_ELEMENT_SIZE = 12;

export function readExplosionQueueElement(o: ExplosionQueueElement, buffer: Buffer, offset: number = 0): number {
  o.uiWorldBombIndex = buffer.readUInt32LE(offset); offset += 4;
  o.uiTimeStamp = buffer.readUInt32LE(offset); offset += 4;
  o.fExists = Boolean(buffer.readUInt8(offset++));
  offset += 3;
  return offset;
}

export function writeExplosionQueueElement(o: ExplosionQueueElement, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiWorldBombIndex, offset);
  offset = buffer.writeUInt32LE(o.uiTimeStamp, offset);
  offset = buffer.writeUInt8(Number(o.fExists), offset);
  offset = writePadding(buffer, offset, 3);
  return offset;
}

export const ERASE_SPREAD_EFFECT = 2;
export const BLOOD_SPREAD_EFFECT = 3;
export const REDO_SPREAD_EFFECT = 4;

const NUM_EXPLOSION_SLOTS = 100;

export const GASMASK_MIN_STATUS = 70;

}
