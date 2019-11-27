namespace ja2 {

export const MAX_AMBIENT_SOUNDS = 100;

export const AMB_TOD_DAWN = 0;
export const AMB_TOD_DAY = 1;
export const AMB_TOD_DUSK = 2;
export const AMB_TOD_NIGHT = 3;

export interface AMBIENTDATA_STRUCT {
  uiMinTime: UINT32;
  uiMaxTime: UINT32;
  ubTimeCatagory: UINT8;
  zFilename: string /* SGPFILENAME */;
  uiVol: UINT32;
}

export function createAmbientDataStruct(): AMBIENTDATA_STRUCT {
  return {
    uiMinTime: 0,
    uiMaxTime: 0,
    ubTimeCatagory: 0,
    zFilename: '',
    uiVol: 0,
  };
}

export const AMBIENT_DATA_STRUCT_SIZE = 116;

export function readAmbientDataStruct(o: AMBIENTDATA_STRUCT, buffer: Buffer, offset: number = 0): number {
  o.uiMinTime = buffer.readUInt32LE(offset); offset += 4;
  o.uiMaxTime = buffer.readUInt32LE(offset); offset += 4;
  o.ubTimeCatagory = buffer.readUInt8(offset++);
  o.zFilename = readStringNL(buffer, 'ascii', offset, SGPFILENAME_LEN); offset += SGPFILENAME_LEN;
  offset += 3; // padding
  o.uiVol = buffer.readUInt32LE(offset); offset += 4;
  return offset;
}

export function writeAmbientDataStruct(o: AMBIENTDATA_STRUCT, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt32LE(o.uiMinTime, offset);
  offset = buffer.writeUInt32LE(o.uiMaxTime, offset);
  offset = buffer.writeUInt8(o.ubTimeCatagory, offset);
  offset = writeStringNL(o.zFilename, buffer, offset, SGPFILENAME_LEN, 'ascii');
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiVol, offset);
  return offset;
}

}
