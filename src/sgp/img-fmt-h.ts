namespace ja2 {

// Sir-Tech's Crazy Image (STCI) file format specifications.  Each file is composed of:
// 1		ImageFileHeader, uncompressed
// *		Palette (STCI_INDEXED, size = uiNumberOfColours * PALETTE_ELEMENT_SIZE), uncompressed
// *		SubRectInfo's (usNumberOfRects > 0, size = usNumberOfSubRects * sizeof(SubRectInfo) ), uncompressed
// *		Bytes of image data, possibly compressed

export const STCI_ID_STRING = "STCI";
export const STCI_ID_LEN = 4;

export const STCI_ETRLE_COMPRESSED = 0x0020;
export const STCI_ZLIB_COMPRESSED = 0x0010;
export const STCI_INDEXED = 0x0008;
export const STCI_RGB = 0x0004;
const STCI_ALPHA = 0x0002;
const STCI_TRANSPARENT = 0x0001;

// ETRLE defines
export const COMPRESS_TRANSPARENT = 0x80;
export const COMPRESS_NON_TRANSPARENT = 0x00;
export const COMPRESS_RUN_LIMIT = 0x7F;

// NB if you're going to change the header definition:
// - make sure that everything in this header is nicely aligned
// - don't exceed the 64-byte maximum
export interface STCIHeader {
  cID: string /* UINT8[STCI_ID_LEN] */;
  uiOriginalSize: UINT32;
  uiStoredSize: UINT32; // equal to uiOriginalSize if data uncompressed
  uiTransparentValue: UINT32;
  fFlags: UINT32;
  usHeight: UINT16;
  usWidth: UINT16;
  /* union { */
  RGB: {
    uiRedMask: UINT32;
    uiGreenMask: UINT32;
    uiBlueMask: UINT32;
    uiAlphaMask: UINT32;
    ubRedDepth: UINT8;
    ubGreenDepth: UINT8;
    ubBlueDepth: UINT8;
    ubAlphaDepth: UINT8;
  };
  Indexed: {
    // For indexed files, the palette will contain 3 separate bytes for red, green, and blue
    uiNumberOfColours: UINT32;
    usNumberOfSubImages: UINT16;
    ubRedDepth: UINT8;
    ubGreenDepth: UINT8;
    ubBlueDepth: UINT8;
    cIndexedUnused: UINT8[] /* [11] */;
  };
  /* } */
  ubDepth: UINT8; // size in bits of one pixel as stored in the file
  uiAppDataSize: UINT32;
  cUnused: UINT8[] /* [15] */;
}

export function createSTCIHeader(): STCIHeader {
  return {
    cID: '',
    uiOriginalSize: 0,
    uiStoredSize: 0,
    uiTransparentValue: 0,
    fFlags: 0,
    usHeight: 0,
    usWidth: 0,
    RGB: {
      uiRedMask: 0,
      uiGreenMask: 0,
      uiBlueMask: 0,
      uiAlphaMask: 0,
      ubRedDepth: 0,
      ubGreenDepth: 0,
      ubBlueDepth: 0,
      ubAlphaDepth: 0,
    },
    Indexed: {
      uiNumberOfColours: 0,
      usNumberOfSubImages: 0,
      ubRedDepth: 0,
      ubGreenDepth: 0,
      ubBlueDepth: 0,
      cIndexedUnused: createArray(11, 0),
    },
    ubDepth: 0,
    uiAppDataSize: 0,
    cUnused: createArray(15, 0),
  };
}

export const STCI_HEADER_SIZE = 64;

export function readSTCIHeader(o: STCIHeader, buffer: Buffer, offset: number = 0): number {
  o.cID = buffer.toString('ascii', offset, offset + 4); offset += 4;
  o.uiOriginalSize = buffer.readUInt32LE(offset); offset += 4;
  o.uiStoredSize = buffer.readUInt32LE(offset); offset += 4;
  o.uiTransparentValue = buffer.readUInt32LE(offset); offset += 4;
  o.fFlags = buffer.readUInt32LE(offset); offset += 4;
  o.usHeight = buffer.readUInt16LE(offset); offset += 2;
  o.usWidth = buffer.readUInt16LE(offset); offset += 2;

  if (o.fFlags & STCI_RGB) {
    o.RGB.uiRedMask = buffer.readUInt32LE(offset); offset += 4;
    o.RGB.uiGreenMask = buffer.readUInt32LE(offset); offset += 4;
    o.RGB.uiBlueMask = buffer.readUInt32LE(offset); offset += 4;
    o.RGB.uiAlphaMask = buffer.readUInt32LE(offset); offset += 4;
    o.RGB.ubRedDepth = buffer.readUInt8(offset++);
    o.RGB.ubGreenDepth = buffer.readUInt8(offset++);
    o.RGB.ubBlueDepth = buffer.readUInt8(offset++);
    o.RGB.ubAlphaDepth = buffer.readUInt8(offset++);
  } else if (o.fFlags & STCI_INDEXED) {
    o.Indexed.uiNumberOfColours = buffer.readUInt32LE(offset); offset += 4;
    o.Indexed.usNumberOfSubImages = buffer.readUInt16LE(offset); offset += 2;
    o.Indexed.ubRedDepth = buffer.readUInt8(offset++);
    o.Indexed.ubGreenDepth = buffer.readUInt8(offset++);
    o.Indexed.ubBlueDepth = buffer.readUInt8(offset++);
    offset = readUIntArray(o.Indexed.cIndexedUnused, buffer, offset, 1);
  }

  o.ubDepth = buffer.readUInt8(offset++);
  offset += 3; // padding
  o.uiAppDataSize = buffer.readUInt32LE(offset); offset += 4;

  return offset;
}

export function writeSTCIHeader(o: STCIHeader, buffer: Buffer, offset: number = 0): number {
  offset = buffer.write(o.cID, offset, 'ascii');
  offset = buffer.writeUInt32LE(o.uiOriginalSize, offset);
  offset = buffer.writeUInt32LE(o.uiStoredSize, offset);
  offset = buffer.writeUInt32LE(o.uiTransparentValue, offset);
  offset = buffer.writeUInt32LE(o.fFlags, offset);
  offset = buffer.writeUInt16LE(o.usHeight, offset);
  offset = buffer.writeUInt16LE(o.usWidth, offset);

  if (o.fFlags & STCI_RGB) {
    offset = buffer.writeUInt32LE(o.RGB.uiRedMask, offset);
    offset = buffer.writeUInt32LE(o.RGB.uiGreenMask, offset);
    offset = buffer.writeUInt32LE(o.RGB.uiBlueMask, offset);
    offset = buffer.writeUInt32LE(o.RGB.uiAlphaMask, offset);
    offset = buffer.writeUInt8(o.RGB.ubRedDepth, offset);
    offset = buffer.writeUInt8(o.RGB.ubGreenDepth, offset);
    offset = buffer.writeUInt8(o.RGB.ubBlueDepth, offset);
    offset = buffer.writeUInt8(o.RGB.ubAlphaDepth, offset);
  } else if (o.fFlags & STCI_INDEXED) {
    offset = buffer.writeUInt32LE(o.Indexed.uiNumberOfColours, offset);
    offset = buffer.writeUInt16LE(o.Indexed.usNumberOfSubImages, offset);
    offset = buffer.writeUInt8(o.Indexed.ubRedDepth, offset);
    offset = buffer.writeUInt8(o.Indexed.ubGreenDepth, offset);
    offset = buffer.writeUInt8(o.Indexed.ubBlueDepth, offset);
    offset = writeUIntArray(o.Indexed.cIndexedUnused, buffer, offset, 1);
  }

  offset = buffer.writeUInt8(o.ubDepth, offset);
  offset = writePadding(buffer, offset, 3); // padding
  offset = buffer.writeUInt32LE(o.uiAppDataSize, offset);

  return offset;
}

export interface STCISubImage {
  uiDataOffset: UINT32;
  uiDataLength: UINT32;
  sOffsetX: INT16;
  sOffsetY: INT16;
  usHeight: UINT16;
  usWidth: UINT16;
}

export function createSTCISubImage(): STCISubImage {
  return {
    uiDataOffset: 0,
    uiDataLength: 0,
    sOffsetX: 0,
    sOffsetY: 0,
    usHeight: 0,
    usWidth: 0,
  };
}

export function copySTCISubImage(dest: STCISubImage, src: STCISubImage) {
  dest.uiDataOffset = src.uiDataOffset;
  dest.uiDataLength = src.uiDataLength;
  dest.sOffsetX = src.sOffsetX;
  dest.sOffsetY = src.sOffsetY;
  dest.usHeight = src.usHeight;
  dest.usWidth = src.usWidth;
}

export function writeSTCISubImage(o: STCISubImage, buffer: Buffer, offset: number): number {
  offset = buffer.writeUInt32LE(o.uiDataOffset, offset);
  offset = buffer.writeUInt32LE(o.uiDataLength, offset);
  offset = buffer.writeInt16LE(o.sOffsetX, offset);
  offset = buffer.writeInt16LE(o.sOffsetY, offset);
  offset = buffer.writeUInt16LE(o.usHeight, offset);
  offset = buffer.writeUInt16LE(o.usWidth, offset);
  return offset;
}

export const STCI_SUBIMAGE_SIZE = 16;

export interface STCIPaletteElement {
  ubRed: UINT8;
  ubGreen: UINT8;
  ubBlue: UINT8;
}

export function createSTCIPaletteElement(): STCIPaletteElement {
  return {
    ubRed: 0,
    ubGreen: 0,
    ubBlue: 0,
  };
}

export function writeSTCIPaletteElement(o: STCIPaletteElement, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubRed, offset);
  offset = buffer.writeUInt8(o.ubGreen, offset);
  offset = buffer.writeUInt8(o.ubBlue, offset);
  return offset;
}

export const STCI_PALETTE_ELEMENT_SIZE = 3;
const STCI_8BIT_PALETTE_SIZE = 768;

}
