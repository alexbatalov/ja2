namespace ja2 {

export interface PcxHeader {
  ubManufacturer: UINT8;
  ubVersion: UINT8;
  ubEncoding: UINT8;
  ubBitsPerPixel: UINT8;

  usLeft: UINT16;
  usTop: UINT16;

  usRight: UINT16;
  usBottom: UINT16;

  usHorRez: UINT16;
  usVerRez: UINT16;

  ubEgaPalette: UINT8[] /* [48] */;
  ubReserved: UINT8;
  ubColorPlanes: UINT8;
  usBytesPerLine: UINT16;
  usPaletteType: UINT16;
  ubFiller: UINT8[] /* [58] */;
}

export function createPcxHeader(): PcxHeader {
  return {
    ubManufacturer: 0,
    ubVersion: 0,
    ubEncoding: 0,
    ubBitsPerPixel: 0,
    usLeft: 0,
    usTop: 0,
    usRight: 0,
    usBottom: 0,
    usHorRez: 0,
    usVerRez: 0,
    ubEgaPalette: createArray(48, 0),
    ubReserved: 0,
    ubColorPlanes: 0,
    usBytesPerLine: 0,
    usPaletteType: 0,
    ubFiller: createArray(58, 0),
  };
}

export const PCX_HEADER_SIZE = 128;

export function readPcxHeader(o: PcxHeader, buffer: Buffer, offset: number = 0): number {
  o.ubManufacturer = buffer.readUInt8(offset++);
  o.ubVersion = buffer.readUInt8(offset++);
  o.ubEncoding = buffer.readUInt8(offset++);
  o.ubBitsPerPixel = buffer.readUInt8(offset++);
  o.usLeft = buffer.readUInt16LE(offset); offset += 2;
  o.usTop = buffer.readUInt16LE(offset); offset += 2;
  o.usRight = buffer.readUInt16LE(offset); offset += 2;
  o.usBottom = buffer.readUInt16LE(offset); offset += 2;
  o.usHorRez = buffer.readUInt16LE(offset); offset += 2;
  o.usVerRez = buffer.readUInt16LE(offset); offset += 2;
  offset = readUIntArray(o.ubEgaPalette, buffer, offset, 1);
  o.ubReserved = buffer.readUInt8(offset++);
  o.ubColorPlanes = buffer.readUInt8(offset++);
  o.usBytesPerLine = buffer.readUInt16LE(offset); offset += 2;
  o.usPaletteType = buffer.readUInt16LE(offset); offset += 2;
  offset = readUIntArray(o.ubFiller, buffer, offset, 1);
  return offset;
}

export interface PcxObject {
  pPcxBuffer: Uint8Array /* Pointer<UINT8> */;
  ubPalette: Uint8Array /* UINT8[768] */;

  usWidth: UINT16;
  usHeight: UINT16;

  uiBufferSize: UINT32;
  usPcxFlags: UINT16;
}

export function createPcxObject(): PcxObject {
  return {
    pPcxBuffer: <Uint8Array><unknown>null,
    ubPalette: <Uint8Array><unknown>null,
    usWidth: 0,
    usHeight: 0,
    uiBufferSize: 0,
    usPcxFlags: 0,
  };
}

}
