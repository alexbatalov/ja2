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

export interface RelTileLoc {
  bTileOffsetX: INT8;
  bTileOffsetY: INT8;
} // relative tile location

// TRLE subimage structure, mirroring that of ST(C)I
export interface ETRLEObject {
  uiDataOffset: UINT32;
  uiDataLength: UINT32;
  sOffsetX: INT16;
  sOffsetY: INT16;
  usHeight: UINT16;
  usWidth: UINT16;
}

export interface ETRLEData {
  pPixData: PTR;
  uiSizePixData: UINT32;
  pETRLEObject: Pointer<ETRLEObject>;
  usNumberOfObjects: UINT16;
}

// Image header structure
export interface image_type {
  usWidth: UINT16;
  usHeight: UINT16;
  ubBitDepth: UINT8;
  fFlags: UINT16;
  ImageFile: SGPFILENAME;
  iFileLoader: UINT32;
  pPalette: Pointer<SGPPaletteEntry>;
  pui16BPPPalette: Pointer<UINT16>;
  pAppData: Pointer<UINT8>;
  uiAppDataSize: UINT32;
  /* union { */
  /*   struct { */
  pImageData: PTR;
  /*   } */
  /*   struct { */
  pCompressedImageData: PTR;
  /*   } */
  /*   struct { */
  p8BPPData: Pointer<UINT8>;
  /*   } */
  /*   struct { */
  p16BPPData: Pointer<UINT16>;
  /*   } */
  /*   struct { */
  pPixData8: Pointer<UINT8>;
  uiSizePixData: UINT32;
  pETRLEObject: Pointer<ETRLEObject>;
  usNumberOfObjects: UINT16;
  /*   } */
  /* } */
}

export type HIMAGE = Pointer<image_type>;

export const SGPGetRValue = (rgb) => ((rgb));
export const SGPGetBValue = (rgb) => (((rgb) >> 16));
export const SGPGetGValue = (rgb) => ((((rgb)) >> 8));

// *****************************************************************************
//
// Function prototypes
//
// *****************************************************************************

// The following blitters are used by the function above as well as clients

// UTILITY FUNCTIONS
