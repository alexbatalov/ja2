namespace ja2 {

// ************************************************************************************
//
// Video Object SGP Module
//
// ************************************************************************************

// This definition mimics what is found in WINDOWS.H ( for Direct Draw compatiblity )
export type COLORVAL = UINT32;

// Defines for blitting
export const VO_BLT_SRCTRANSPARENCY = 0x000000002;
const VO_BLT_DESTTRANSPARENCY = 0x000000120;
export const VO_BLT_SHADOW = 0x000000200;
const VO_BLT_TRANSSHADOW = 0x000000003;
const VO_BLT_UNCOMPRESSED = 0x000004000;
const VO_BLT_CLIP = 0x000000001;
const VO_BLT_MIRROR_Y = 0x000001000; // must be the same as VS_BLT_MIRROR_Y for Wiz!!!

// Defines for HVOBJECT limits
export const HVOBJECT_SHADE_TABLES = 48;

export const HVOBJECT_GLOW_GREEN = 0;
export const HVOBJECT_GLOW_BLUE = 1;
export const HVOBJECT_GLOW_YELLOW = 2;
export const HVOBJECT_GLOW_RED = 3;

// Effects structure for specialized blitting
export interface blt_fx {
  uiShadowLevel: UINT32;
  ClipRect: SGPRect;
}

// Z-buffer info structure for properly assigning Z values
export interface ZStripInfo {
  bInitialZChange: INT8; // difference in Z value between the leftmost and base strips
  ubFirstZStripWidth: UINT8; // # of pixels in the leftmost strip
  ubNumberOfZChanges: UINT8; // number of strips (after the first)
  pbZChange: Int8Array /* Pointer<INT8> */; // change to the Z value in each strip (after the first)
}

export function createZStripInfo(): ZStripInfo {
  return {
    bInitialZChange: 0,
    ubFirstZStripWidth: 0,
    ubNumberOfZChanges: 0,
    pbZChange: <Int8Array><unknown>null,
  };
}

export interface SixteenBPPObjectInfo {
  p16BPPData: Uint16Array /* Pointer<UINT16> */;
  usRegionIndex: UINT16;
  ubShadeLevel: UINT8;
  usWidth: UINT16;
  usHeight: UINT16;
  sOffsetX: INT16;
  sOffsetY: INT16;
}

export function createSixteenBPPObjectInfo(): SixteenBPPObjectInfo {
  return {
    p16BPPData: <Uint16Array><unknown>null,
    usRegionIndex: 0,
    ubShadeLevel: 0,
    usWidth: 0,
    usHeight: 0,
    sOffsetX: 0,
    sOffsetY: 0,
  };
}

// This definition mimics what is found in WINDOWS.H ( for Direct Draw compatiblity )
// From RGB to COLORVAL
export const FROMRGB = (r: number, g: number, b: number) => ((((r) | ((g) << 8)) | (((b)) << 16)));

// Video object creation flags
// Used in the VOBJECT_DESC structure to describe creation flags

const VOBJECT_CREATE_DEFAULT = 0x00000020; // Creates and empty object of given width, height and BPP
export const VOBJECT_CREATE_FROMFILE = 0x00000040; // Creates a video object from a file ( using HIMAGE )
export const VOBJECT_CREATE_FROMHIMAGE = 0x00000080; // Creates a video object from a pre-loaded hImage

// VOBJECT FLAGS
export const VOBJECT_FLAG_SHADETABLE_SHARED = 0x00000100;

// This structure is a video object.
// The video object contains different data based on it's type, compressed or not
export interface SGPVObject {
  fFlags: UINT32; // Special flags
  uiSizePixData: UINT32; // ETRLE data size
  pPaletteEntry: SGPPaletteEntry[] /* Pointer<SGPPaletteEntry> */; // 8BPP Palette
  TransparentColor: COLORVAL; // Defaults to 0,0,0
  p16BPPPalette: Uint16Array /* Pointer<UINT16> */; // A 16BPP palette used for 8->16 blits

  pPixData: Uint8Array /* PTR */; // ETRLE pixel data
  pETRLEObject: ETRLEObject[] /* Pointer<ETRLEObject> */; // Object offset data etc
  p16BPPObject: SixteenBPPObjectInfo[] /* Pointer<SixteenBPPObjectInfo> */;
  pShades: Uint16Array[] /* Pointer<UINT16>[HVOBJECT_SHADE_TABLES] */; // Shading tables
  pShadeCurrent: Uint16Array /* Pointer<UINT16> */;
  pGlow: Uint16Array /* Pointer<UINT16> */; // glow highlight table
  pShade8: Uint8Array /* Pointer<UINT8> */; // 8-bit shading index table
  pGlow8: Uint8Array /* Pointer<UINT8> */; // 8-bit glow table
  ppZStripInfo: ZStripInfo[] /* Pointer<Pointer<ZStripInfo>> */; // Z-value strip info arrays

  usNumberOf16BPPObjects: UINT16;
  usNumberOfObjects: UINT16; // Total number of objects
  ubBitDepth: UINT8; // BPP

  // Reserved for added room and 32-byte boundaries
  bReserved: BYTE[] /* [1] */;
}

export function createSGPVObject(): SGPVObject {
  return {
    fFlags: 0,
    uiSizePixData: 0,
    pPaletteEntry: <SGPPaletteEntry[]><unknown>null,
    TransparentColor: 0,
    p16BPPPalette: <Uint16Array><unknown>null,
    pPixData: <Buffer><unknown>null,
    pETRLEObject: <ETRLEObject[]><unknown>null,
    p16BPPObject: <SixteenBPPObjectInfo[]><unknown>null,
    pShades: <Uint16Array[]><unknown>null,
    pShadeCurrent: <Uint16Array><unknown>null,
    pGlow: <Uint16Array><unknown>null,
    pShade8: <Uint8Array><unknown>null,
    pGlow8: <Uint8Array><unknown>null,
    ppZStripInfo: <ZStripInfo[]><unknown>null,
    usNumberOf16BPPObjects: 0,
    usNumberOfObjects: 0,
    ubBitDepth: 0,
    bReserved: createArray(1, 0),
  };
}

export type HVOBJECT = Pointer<SGPVObject>;

// This structure describes the creation parameters for a Video Object
export interface VOBJECT_DESC {
  fCreateFlags: UINT32; // Specifies creation flags like from file or not
  /* union { */
  /*   struct { */
  ImageFile: string /* SGPFILENAME */; // Filename of image data to use
  /*   } */
  /*   struct { */
  hImage: ImageType;
  /*   } */
  /* } */
  ubBitDepth: UINT8; // BPP, ignored if given from file
}

export function createVObjectDesc(): VOBJECT_DESC {
  return {
    fCreateFlags: 0,
    ImageFile: "",
    hImage: <ImageType><unknown>null,
    ubBitDepth: 0,
  };
}

// **********************************************************************************
//
// Video Object Manager Functions
//
// **********************************************************************************

// Creates and adds a video object to list
export const AddVideoObject = (a: VOBJECT_DESC) => AddStandardVideoObject(a);

// **********************************************************************************
//
// Video Object manipulation functions
//
// **********************************************************************************

// ****************************************************************************
//
// Macros
//
// ****************************************************************************

const VideoObjectsInitialized = () => (gfVideoObjectsInit);

// ****************************************************************************
//
// Blt Functions
//
// ****************************************************************************

// These blitting functions more-or less encapsolate all of the functionality of DirectDraw
// Blitting, giving an API layer for portability.

}
