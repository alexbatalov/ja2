namespace ja2 {

export const WORLD_ITEM_DONTRENDER = 0x0001;
export const WOLRD_ITEM_FIND_SWEETSPOT_FROM_GRIDNO = 0x0002;
export const WORLD_ITEM_ARMED_BOMB = 0x0040;
export const WORLD_ITEM_SCIFI_ONLY = 0x0080;
export const WORLD_ITEM_REALISTIC_ONLY = 0x0100;
export const WORLD_ITEM_REACHABLE = 0x0200;
export const WORLD_ITEM_GRIDNO_NOT_SET_USE_ENTRY_POINT = 0x0400;

export interface WORLDITEM {
  fExists: boolean;
  sGridNo: INT16;
  ubLevel: UINT8;
  o: OBJECTTYPE;
  usFlags: UINT16;
  bRenderZHeightAboveLevel: INT8;

  bVisible: INT8;

  // This is the chance associated with an item or a trap not-existing in the world.  The reason why
  // this is reversed (10 meaning item has 90% chance of appearing, is because the order that the map
  // is saved, we don't know if the version is older or not until after the items are loaded and added.
  // Because this value is zero in the saved maps, we can't change it to 100, hence the reversal method.
  // This check is only performed the first time a map is loaded.  Later, it is entirely skipped.
  ubNonExistChance: UINT8;
}

export function createWorldItem(): WORLDITEM {
  return {
    fExists: false,
    sGridNo: 0,
    ubLevel: 0,
    o: createObjectType(),
    usFlags: 0,
    bRenderZHeightAboveLevel: 0,

    bVisible: 0,

    ubNonExistChance: 0,
  };
}

export function resetWorldItem(o: WORLDITEM) {
  o.fExists = false;
  o.sGridNo = 0;
  o.ubLevel = 0;
  resetObjectType(o.o);
  o.usFlags = 0;
  o.bRenderZHeightAboveLevel = 0;
  o.bVisible = 0;
  o.ubNonExistChance = 0;
}

export function copyWorldItem(destination: WORLDITEM, source: WORLDITEM) {
  destination.fExists = source.fExists;
  destination.sGridNo = source.sGridNo;
  destination.ubLevel = source.ubLevel;
  copyObjectType(destination.o, source.o);
  destination.usFlags = source.usFlags;
  destination.bRenderZHeightAboveLevel = source.bRenderZHeightAboveLevel;
  destination.bVisible = source.bVisible;
  destination.ubNonExistChance = source.ubNonExistChance;
}

export const WORLD_ITEM_SIZE = 52;

export function readWorldItem(o: WORLDITEM, buffer: Buffer, offset: number = 0): number {
  o.fExists = Boolean(buffer.readUInt8(offset++));
  offset++; // padding
  o.sGridNo = buffer.readInt16LE(offset); offset += 2;
  o.ubLevel = buffer.readUInt8(offset++);
  offset += 3; // padding
  offset = readObjectType(o.o, buffer, offset);
  o.usFlags = buffer.readUInt16LE(offset); offset += 2;
  o.bRenderZHeightAboveLevel = buffer.readInt8(offset++);
  o.bVisible = buffer.readInt8(offset++);
  o.ubNonExistChance = buffer.readUInt8(offset++);
  offset += 3;
  return offset;
}

export function writeWorldItem(o: WORLDITEM, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(Number(o.fExists), offset);
  offset = writePadding(buffer, offset, 1);
  offset = buffer.writeInt16LE(o.sGridNo, offset);
  offset = buffer.writeUInt8(o.ubLevel, offset);
  offset = writePadding(buffer, offset, 3);
  offset = writeObjectType(o.o, buffer, offset);
  offset = buffer.writeUInt16LE(o.usFlags, offset);
  offset = buffer.writeInt8(o.bRenderZHeightAboveLevel, offset);
  offset = buffer.writeInt8(o.bVisible, offset);
  offset = buffer.writeUInt8(o.ubNonExistChance, offset);
  offset = writePadding(buffer, offset, 3);
  return offset;
}

export interface WORLDBOMB {
  fExists: boolean;
  iItemIndex: INT32;
}

export function createWorldBomb(): WORLDBOMB {
  return {
    fExists: false,
    iItemIndex: 0,
  };
}

}
