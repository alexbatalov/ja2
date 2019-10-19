// The HIMAGE module provides a common interface for managing image data. This module
// includes:
// - A set of data structures representing image data. Data can be 8 or 16 bpp and/or
//   compressed
// - A set of file loaders which load specific file formats into the internal data format
// - A set of blitters which blt the data to memory
// - A comprehensive automatic blitter which blits the appropriate type based on the
//   image header.

// Defines for type of file readers
const PCX_FILE_READER = 0x1;
const TGA_FILE_READER = 0x2;
const STCI_FILE_READER = 0x4;
const TRLE_FILE_READER = 0x8;
const UNKNOWN_FILE_READER = 0x200;

// Defines for buffer bit depth
const BUFFER_8BPP = 0x1;
const BUFFER_16BPP = 0x2;

// Defines for image charactoristics
const IMAGE_COMPRESSED = 0x0001;
const IMAGE_TRLECOMPRESSED = 0x0002;
const IMAGE_PALETTE = 0x0004;
const IMAGE_BITMAPDATA = 0x0008;
const IMAGE_APPDATA = 0x0010;
const IMAGE_ALLIMAGEDATA = 0x000C;
const IMAGE_ALLDATA = 0x001C;

// Palette structure, mimics that of Win32
interface SGPPaletteEntry {
  peRed: UINT8;
  peGreen: UINT8;
  peBlue: UINT8;
  peFlags: UINT8;
}

const AUX_FULL_TILE = 0x01;
const AUX_ANIMATED_TILE = 0x02;
const AUX_DYNAMIC_TILE = 0x04;
const AUX_INTERACTIVE_TILE = 0x08;
const AUX_IGNORES_HEIGHT = 0x10;
const AUX_USES_LAND_Z = 0x20;

interface AuxObjectData {
  ubWallOrientation: UINT8;
  ubNumberOfTiles: UINT8;
  usTileLocIndex: UINT16;
  ubUnused1: UINT8[] /* [3] */;
  ubCurrentFrame: UINT8;
  ubNumberOfFrames: UINT8;
  fFlags: UINT8;
  ubUnused: UINT8[] /* [6] */;
}

interface RelTileLoc {
  bTileOffsetX: INT8;
  bTileOffsetY: INT8;
} // relative tile location

// TRLE subimage structure, mirroring that of ST(C)I
interface ETRLEObject {
  uiDataOffset: UINT32;
  uiDataLength: UINT32;
  sOffsetX: INT16;
  sOffsetY: INT16;
  usHeight: UINT16;
  usWidth: UINT16;
}

interface ETRLEData {
  pPixData: PTR;
  uiSizePixData: UINT32;
  pETRLEObject: Pointer<ETRLEObject>;
  usNumberOfObjects: UINT16;
}

// Image header structure
interface image_type {
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

type HIMAGE = Pointer<image_type>;

const SGPGetRValue = (rgb) => ((BYTE)(rgb));
const SGPGetBValue = (rgb) => ((BYTE)((rgb) >> 16));
const SGPGetGValue = (rgb) => ((BYTE)(((UINT16)(rgb)) >> 8));

// *****************************************************************************
//
// Function prototypes
//
// *****************************************************************************

// This function will return NULL if it fails, and call SetLastError() to set
// error information
HIMAGE CreateImage(SGPFILENAME ImageFile, UINT16 fContents);

// This function destroys the HIMAGE structure as well as its contents
BOOLEAN DestroyImage(HIMAGE hImage);

// This function releases data allocated to various parts of the image based
// on the contents flags passed as a parameter.  If a contents flag is given
// and the image does not contain that data, no error is raised
BOOLEAN ReleaseImageData(HIMAGE hImage, UINT16 fContents);

// This function will attept to Load data from an existing image object's filename
// In this way, dynamic loading of image data can be done
BOOLEAN LoadImageData(HIMAGE hImage, UINT16 fContents);

// This function will run the appropriate copy function based on the type of HIMAGE object
BOOLEAN CopyImageToBuffer(HIMAGE hImage, UINT32 fBufferType, BYTE *pDestBuf, UINT16 usDestWidth, UINT16 usDestHeight, UINT16 usX, UINT16 usY, SGPRect *srcRect);

// The following blitters are used by the function above as well as clients

BOOLEAN Copy8BPPImageTo8BPPBuffer(HIMAGE hImage, BYTE *pDestBuf, UINT16 usDestWidth, UINT16 usDestHeight, UINT16 usX, UINT16 usY, SGPRect *srcRect);
BOOLEAN Copy8BPPImageTo16BPPBuffer(HIMAGE hImage, BYTE *pDestBuf, UINT16 usDestWidth, UINT16 usDestHeight, UINT16 usX, UINT16 usY, SGPRect *srcRect);
BOOLEAN Copy16BPPImageTo16BPPBuffer(HIMAGE hImage, BYTE *pDestBuf, UINT16 usDestWidth, UINT16 usDestHeight, UINT16 usX, UINT16 usY, SGPRect *srcRect);

// This function will create a buffer in memory of ETRLE data, excluding palette
BOOLEAN GetETRLEImageData(HIMAGE hImage, ETRLEData *pBuffer);

// UTILITY FUNCTIONS

// Used to create a 16BPP Palette from an 8 bit palette, found in himage.c
UINT16 *Create16BPPPaletteShaded(SGPPaletteEntry *pPalette, UINT32 rscale, UINT32 gscale, UINT32 bscale, BOOLEAN mono);
UINT16 *Create16BPPPalette(SGPPaletteEntry *pPalette);
UINT16 Get16BPPColor(UINT32 RGBValue);
UINT32 GetRGBColor(UINT16 Value16BPP);
SGPPaletteEntry *ConvertRGBToPaletteEntry(UINT8 sbStart, UINT8 sbEnd, UINT8 *pOldPalette);

extern UINT16 gusAlphaMask;
extern UINT16 gusRedMask;
extern UINT16 gusGreenMask;
extern UINT16 gusBlueMask;
extern INT16 gusRedShift;
extern INT16 gusBlueShift;
extern INT16 gusGreenShift;

// used to convert 565 RGB data into different bit-formats
void ConvertRGBDistribution565To555(UINT16 *p16BPPData, UINT32 uiNumberOfPixels);
void ConvertRGBDistribution565To655(UINT16 *p16BPPData, UINT32 uiNumberOfPixels);
void ConvertRGBDistribution565To556(UINT16 *p16BPPData, UINT32 uiNumberOfPixels);
void ConvertRGBDistribution565ToAny(UINT16 *p16BPPData, UINT32 uiNumberOfPixels);
