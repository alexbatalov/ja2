namespace ja2 {

// The HIMAGE module provides a common interface for managing image data. This module
// includes:
// - A set of data structures representing image data. Data can be 8 or 16 bpp and/or
//   compressed
// - A set of file loaders which load specific file formats into the internal data format
// - A set of blitters which blt the data to memory
// - A comprehensive automatic blitter which blits the appropriate type based on the
//   image header.

// Defines for type of file readers
export const PCX_FILE_READER = 0x1;
export const TGA_FILE_READER = 0x2;
export const STCI_FILE_READER = 0x4;
const TRLE_FILE_READER = 0x8;
export const UNKNOWN_FILE_READER = 0x200;

// Defines for buffer bit depth
export const BUFFER_8BPP = 0x1;
export const BUFFER_16BPP = 0x2;

// Defines for image charactoristics
export const IMAGE_COMPRESSED = 0x0001;
export const IMAGE_TRLECOMPRESSED = 0x0002;
export const IMAGE_PALETTE = 0x0004;
export const IMAGE_BITMAPDATA = 0x0008;
export const IMAGE_APPDATA = 0x0010;
export const IMAGE_ALLIMAGEDATA = 0x000C;
export const IMAGE_ALLDATA = 0x001C;

// Palette structure, mimics that of Win32
export interface SGPPaletteEntry {
  peRed: UINT8;
  peGreen: UINT8;
  peBlue: UINT8;
  peFlags: UINT8;
}

export function createSGPPaletteEntry(): SGPPaletteEntry {
  return {
    peRed: 0,
    peGreen: 0,
    peBlue: 0,
    peFlags: 0,
  };
}

export function createSGPPaletteEntryFrom(peRed: UINT8, peGreen: UINT8, peBlue: UINT8, peFlags: UINT8): SGPPaletteEntry {
  return {
    peRed,
    peGreen,
    peBlue,
    peFlags,
  };
}

export function copySGPPaletteEntry(destination: SGPPaletteEntry, source: SGPPaletteEntry) {
  destination.peRed = source.peRed;
  destination.peGreen = source.peGreen;
  destination.peBlue = source.peBlue;
  destination.peFlags = source.peFlags;
}

export const SGP_PALETTE_ENTRY_SIZE = 4;

export function readSGPPaletteEntry(o: SGPPaletteEntry, buffer: Buffer, offset: number = 0): number {
  o.peRed = buffer.readUInt8(offset++);
  o.peGreen = buffer.readUInt8(offset++);
  o.peBlue = buffer.readUInt8(offset++);
  o.peFlags = buffer.readUInt8(offset++);
  return offset;
}

export function writeSGPPaletteEntry(o: SGPPaletteEntry, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.peRed, offset);
  offset = buffer.writeUInt8(o.peGreen, offset);
  offset = buffer.writeUInt8(o.peBlue, offset);
  offset = buffer.writeUInt8(o.peFlags, offset);
  return offset;
}

export const AUX_FULL_TILE = 0x01;
export const AUX_ANIMATED_TILE = 0x02;
const AUX_DYNAMIC_TILE = 0x04;
const AUX_INTERACTIVE_TILE = 0x08;
const AUX_IGNORES_HEIGHT = 0x10;
const AUX_USES_LAND_Z = 0x20;

export interface AuxObjectData {
  ubWallOrientation: UINT8;
  ubNumberOfTiles: UINT8;
  usTileLocIndex: UINT16;
  ubUnused1: UINT8[] /* [3] */;
  ubCurrentFrame: UINT8;
  ubNumberOfFrames: UINT8;
  fFlags: UINT8;
  ubUnused: UINT8[] /* [6] */;
}

export function createAuxObjectData(): AuxObjectData {
  return {
    ubWallOrientation: 0,
    ubNumberOfTiles: 0,
    usTileLocIndex: 0,
    ubUnused1: createArray(3, 0),
    ubCurrentFrame: 0,
    ubNumberOfFrames: 0,
    fFlags: 0,
    ubUnused: createArray(6, 0),
  };
}

export function copyAuxObjectData(destination: AuxObjectData, source: AuxObjectData) {
  destination.ubWallOrientation = source.ubWallOrientation;
  destination.ubNumberOfTiles = source.ubNumberOfTiles;
  destination.usTileLocIndex = source.usTileLocIndex;
  copyArray(destination.ubUnused1, source.ubUnused1);
  destination.ubCurrentFrame = source.ubCurrentFrame;
  destination.ubNumberOfFrames = source.ubNumberOfFrames;
  destination.fFlags = source.fFlags;
  copyArray(destination.ubUnused, source.ubUnused);
}

export const AUX_OBJECT_DATA_SIZE = 16;

export function readAuxObjectData(o: AuxObjectData, buffer: Buffer, offset: number = 0): number {
  o.ubWallOrientation = buffer.readUInt8(offset++);
  o.ubNumberOfTiles = buffer.readUInt8(offset++);
  o.usTileLocIndex = buffer.readUInt16LE(offset); offset += 2;
  offset = readUIntArray(o.ubUnused1, buffer, offset, 1);
  o.ubCurrentFrame = buffer.readUInt8(offset++);
  o.ubNumberOfFrames = buffer.readUInt8(offset++);
  o.fFlags = buffer.readUInt8(offset++);
  offset = readUIntArray(o.ubUnused, buffer, offset, 1);
  return offset;
}

export function writeAuxObjectData(o: AuxObjectData, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeUInt8(o.ubWallOrientation, offset);
  offset = buffer.writeUInt8(o.ubNumberOfTiles, offset);
  offset = buffer.writeUInt16LE(o.usTileLocIndex, offset);
  offset = writeUIntArray(o.ubUnused1, buffer, offset, 1);
  offset = buffer.writeUInt8(o.ubCurrentFrame, offset);
  offset = buffer.writeUInt8(o.ubNumberOfFrames, offset);
  offset = buffer.writeUInt8(o.fFlags, offset);
  offset = writeUIntArray(o.ubUnused, buffer, offset, 1);
  return offset;
}

export interface RelTileLoc {
  bTileOffsetX: INT8;
  bTileOffsetY: INT8;
} // relative tile location

export function createRelativeTileLocation(): RelTileLoc {
  return {
    bTileOffsetX: 0,
    bTileOffsetY: 0,
  };
}

export const RELATIVE_TILE_LOCATION_SIZE = 2;

export function readRelativeTileLocation(o: RelTileLoc, buffer: Buffer, offset: number = 0): number {
  o.bTileOffsetX = buffer.readInt8(offset++);
  o.bTileOffsetY = buffer.readInt8(offset++);
  return offset;
}

export function writeRelativeTileLocation(o: RelTileLoc, buffer: Buffer, offset: number = 0): number {
  offset = buffer.writeInt8(o.bTileOffsetX, offset);
  offset = buffer.writeInt8(o.bTileOffsetY, offset);
  return offset;
}

// TRLE subimage structure, mirroring that of ST(C)I
export interface ETRLEObject {
  uiDataOffset: UINT32;
  uiDataLength: UINT32;
  sOffsetX: INT16;
  sOffsetY: INT16;
  usHeight: UINT16;
  usWidth: UINT16;
}

export function createETRLEObject(): ETRLEObject {
  return {
    uiDataOffset: 0,
    uiDataLength: 0,
    sOffsetX: 0,
    sOffsetY: 0,
    usHeight: 0,
    usWidth: 0,
  };
}

export function copyETRLEObject(destination: ETRLEObject, source: ETRLEObject) {
  destination.uiDataOffset = source.uiDataOffset;
  destination.uiDataLength = source.uiDataLength;
  destination.sOffsetX = source.sOffsetX;
  destination.sOffsetY = source.sOffsetY;
  destination.usHeight = source.usHeight;
  destination.usWidth = source.usWidth;
}

export function readETRLEObject(o: ETRLEObject, buffer: Buffer, offset: number = 0): number {
  o.uiDataOffset = buffer.readUInt32LE(offset); offset += 4;
  o.uiDataLength = buffer.readUInt32LE(offset); offset += 4;
  o.sOffsetX = buffer.readInt16LE(offset); offset += 2;
  o.sOffsetY = buffer.readInt16LE(offset); offset += 2;
  o.usHeight = buffer.readUInt16LE(offset); offset += 2;
  o.usWidth = buffer.readUInt16LE(offset); offset += 2;
  return offset;
}

export interface ETRLEData {
  pPixData: Uint8Array;
  uiSizePixData: UINT32;
  pETRLEObject: ETRLEObject[] /* Pointer<ETRLEObject> */;
  usNumberOfObjects: UINT16;
}

export function createETRLEData(): ETRLEData {
  return {
    pPixData: <Uint8Array><unknown>null,
    uiSizePixData: 0,
    pETRLEObject: <ETRLEObject[]><unknown>null,
    usNumberOfObjects: 0,
  };
}

// Image header structure
export interface ImageType {
  usWidth: UINT16;
  usHeight: UINT16;
  ubBitDepth: UINT8;
  fFlags: UINT16;
  ImageFile: string /* SGPFILENAME */;
  iFileLoader: UINT32;
  pPalette: SGPPaletteEntry[] /* Pointer<SGPPaletteEntry> */;
  pui16BPPPalette: Uint16Array /* Pointer<UINT16> */;
  pAppData: Buffer /* Pointer<UINT8> */;
  uiAppDataSize: UINT32;
  /* union { */
  /*   struct { */
  pImageData: Buffer /* PTR */;
  /*   } */
  /*   struct { */
  pCompressedImageData: Buffer /* PTR */;
  /*   } */
  /*   struct { */
  p8BPPData: Uint8Array /* Pointer<UINT8> */;
  /*   } */
  /*   struct { */
  p16BPPData: Uint16Array /* Pointer<UINT16> */;
  /*   } */
  /*   struct { */
  pPixData8: Uint8Array /* Pointer<UINT8> */;
  uiSizePixData: UINT32;
  pETRLEObject: ETRLEObject[] /* Pointer<ETRLEObject> */;
  usNumberOfObjects: UINT16;
  /*   } */
  /* } */
}

export function createImageType(): ImageType {
  return {
    usWidth: 0,
    usHeight: 0,
    ubBitDepth: 0,
    fFlags: 0,
    ImageFile: '',
    iFileLoader: 0,
    pPalette: <SGPPaletteEntry[]><unknown>null,
    pui16BPPPalette: <Uint16Array><unknown>null,
    pAppData: <Buffer><unknown>null,
    uiAppDataSize: 0,
    pImageData: <Buffer><unknown>null,
    pCompressedImageData: <Buffer><unknown>null,
    p8BPPData: <Uint8Array><unknown>null,
    p16BPPData: <Uint16Array><unknown>null,
    pPixData8: <Uint8Array><unknown>null,
    uiSizePixData: 0,
    pETRLEObject: <ETRLEObject[]><unknown>null,
    usNumberOfObjects: 0,
  };
}

export type HIMAGE = Pointer<ImageType>;

export const SGPGetRValue = (rgb: number) => ((rgb));
export const SGPGetBValue = (rgb: number) => (((rgb) >> 16));
export const SGPGetGValue = (rgb: number) => ((((rgb)) >> 8));

// *****************************************************************************
//
// Function prototypes
//
// *****************************************************************************

// The following blitters are used by the function above as well as clients

// UTILITY FUNCTIONS

}
