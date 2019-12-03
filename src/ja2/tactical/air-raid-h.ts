namespace ja2 {

export const AIR_RAID_BEGINNING_GAME = 0x00000001;
export const AIR_RAID_CAN_RANDOMIZE_TEASE_DIVES = 0x00000002;

export interface AIR_RAID_DEFINITION {
  sSectorX: INT16;
  sSectorY: INT16;
  sSectorZ: INT16;
  bIntensity: INT8;
  uiFlags: UINT32;
  ubNumMinsFromCurrentTime: UINT8;
  ubFiller: UINT8[] /* [8] */;
}

export function createAirRaidDefinition(): AIR_RAID_DEFINITION {
  return {
    sSectorX: 0,
    sSectorY: 0,
    sSectorZ: 0,
    bIntensity: 0,
    uiFlags: 0,
    ubNumMinsFromCurrentTime: 0,
    ubFiller: createArray(8, 0),
  };
}

export function copyAirRaidDefinition(destination: AIR_RAID_DEFINITION, source: AIR_RAID_DEFINITION) {
  destination.sSectorX = source.sSectorX;
  destination.sSectorY = source.sSectorY;
  destination.sSectorZ = source.sSectorZ;
  destination.bIntensity = source.bIntensity;
  destination.uiFlags = source.uiFlags;
  destination.ubNumMinsFromCurrentTime = source.ubNumMinsFromCurrentTime;
  copyArray(destination.ubFiller, source.ubFiller);
}

export const AIR_RAID_DEFINITION_SIZE = 24;

export function readAirRaidDefinition(o: AIR_RAID_DEFINITION, buffer: Buffer, offset: number = 0): number {
  o.sSectorX = buffer.readInt16LE(offset); offset += 2;
  o.sSectorY = buffer.readInt16LE(offset); offset += 2;
  o.sSectorZ = buffer.readInt16LE(offset); offset += 2;
  o.bIntensity = buffer.readInt8(offset++);
  offset++; // padding
  o.uiFlags = buffer.readUInt32LE(offset); offset += 4;
  o.ubNumMinsFromCurrentTime = buffer.readUInt8(offset++);
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  offset += 3; // padding
  return offset;
}

export function writeAirRaidDefinition(o: AIR_RAID_DEFINITION, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt16LE(o.sSectorX, offset);
  offset = buffer.writeInt16LE(o.sSectorY, offset);
  offset = buffer.writeInt16LE(o.sSectorZ, offset);
  offset = buffer.writeInt8(o.bIntensity, offset);
  offset = writePadding(buffer, offset, 1); // padding
  offset = buffer.writeUInt32LE(o.uiFlags, offset);
  offset = buffer.writeUInt8(o.ubNumMinsFromCurrentTime, offset++);
  offset = writeUIntArray(o.ubFiller, buffer, offset, 1);
  offset = writePadding(buffer, offset, 3); // padding
  return offset;
}

export const enum Enum192 {
  AIR_RAID_TRYING_TO_START,
  AIR_RAID_START,
  AIR_RAID_LOOK_FOR_DIVE,
  AIR_RAID_BEGIN_DIVE,
  AIR_RAID_DIVING,
  AIR_RAID_END_DIVE,
  AIR_RAID_BEGIN_BOMBING,
  AIR_RAID_BOMBING,
  AIR_RAID_END_BOMBING,
  AIR_RAID_START_END,
  AIR_RAID_END,
}

}
