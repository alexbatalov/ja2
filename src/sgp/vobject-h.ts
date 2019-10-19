// ************************************************************************************
//
// Video Object SGP Module
//
// ************************************************************************************

// This definition mimics what is found in WINDOWS.H ( for Direct Draw compatiblity )
typedef UINT32 COLORVAL;

// Defines for blitting
const VO_BLT_SRCTRANSPARENCY = 0x000000002;
const VO_BLT_DESTTRANSPARENCY = 0x000000120;
const VO_BLT_SHADOW = 0x000000200;
const VO_BLT_TRANSSHADOW = 0x000000003;
const VO_BLT_UNCOMPRESSED = 0x000004000;
const VO_BLT_CLIP = 0x000000001;
const VO_BLT_MIRROR_Y = 0x000001000; // must be the same as VS_BLT_MIRROR_Y for Wiz!!!

// Defines for HVOBJECT limits
const HVOBJECT_SHADE_TABLES = 48;

const HVOBJECT_GLOW_GREEN = 0;
const HVOBJECT_GLOW_BLUE = 1;
const HVOBJECT_GLOW_YELLOW = 2;
const HVOBJECT_GLOW_RED = 3;

// Effects structure for specialized blitting
interface blt_fx {
  uiShadowLevel: UINT32;
  ClipRect: SGPRect;
}

// Z-buffer info structure for properly assigning Z values
interface ZStripInfo {
  bInitialZChange: INT8; // difference in Z value between the leftmost and base strips
  ubFirstZStripWidth: UINT8; // # of pixels in the leftmost strip
  ubNumberOfZChanges: UINT8; // number of strips (after the first)
  pbZChange: Pointer<INT8>; // change to the Z value in each strip (after the first)
}

interface SixteenBPPObjectInfo {
  p16BPPData: Pointer<UINT16>;
  usRegionIndex: UINT16;
  ubShadeLevel: UINT8;
  usWidth: UINT16;
  usHeight: UINT16;
  sOffsetX: INT16;
  sOffsetY: INT16;
}

// This definition mimics what is found in WINDOWS.H ( for Direct Draw compatiblity )
// From RGB to COLORVAL
const FROMRGB = (r, g, b) => ((UINT32)(((UINT8)(r) | ((UINT16)(g) << 8)) | (((UINT32)(UINT8)(b)) << 16)));

// Video object creation flags
// Used in the VOBJECT_DESC structure to describe creation flags

const VOBJECT_CREATE_DEFAULT = 0x00000020; // Creates and empty object of given width, height and BPP
const VOBJECT_CREATE_FROMFILE = 0x00000040; // Creates a video object from a file ( using HIMAGE )
const VOBJECT_CREATE_FROMHIMAGE = 0x00000080; // Creates a video object from a pre-loaded hImage

// VOBJECT FLAGS
const VOBJECT_FLAG_SHADETABLE_SHARED = 0x00000100;

// This structure is a video object.
// The video object contains different data based on it's type, compressed or not
interface SGPVObject {
  fFlags: UINT32; // Special flags
  uiSizePixData: UINT32; // ETRLE data size
  pPaletteEntry: Pointer<SGPPaletteEntry>; // 8BPP Palette
  TransparentColor: COLORVAL; // Defaults to 0,0,0
  p16BPPPalette: Pointer<UINT16>; // A 16BPP palette used for 8->16 blits

  pPixData: PTR; // ETRLE pixel data
  pETRLEObject: Pointer<ETRLEObject>; // Object offset data etc
  p16BPPObject: Pointer<SixteenBPPObjectInfo>;
  pShades: Pointer<UINT16>[] /* [HVOBJECT_SHADE_TABLES] */; // Shading tables
  pShadeCurrent: Pointer<UINT16>;
  pGlow: Pointer<UINT16>; // glow highlight table
  pShade8: Pointer<UINT8>; // 8-bit shading index table
  pGlow8: Pointer<UINT8>; // 8-bit glow table
  ppZStripInfo: Pointer<Pointer<ZStripInfo>>; // Z-value strip info arrays

  usNumberOf16BPPObjects: UINT16;
  usNumberOfObjects: UINT16; // Total number of objects
  ubBitDepth: UINT8; // BPP

  // Reserved for added room and 32-byte boundaries
  bReserved: BYTE[] /* [1] */;
}

typedef SGPVObject *HVOBJECT;

// This structure describes the creation parameters for a Video Object
interface VOBJECT_DESC {
  fCreateFlags: UINT32; // Specifies creation flags like from file or not
  /* union { */
  /*   struct { */
  ImageFile: SGPFILENAME; // Filename of image data to use
  /*   } */
  /*   struct { */
  hImage: HIMAGE;
  /*   } */
  /* } */
  ubBitDepth: UINT8; // BPP, ignored if given from file
}

// **********************************************************************************
//
// Video Object Manager Functions
//
// **********************************************************************************

// Creates a list to contain video objects
BOOLEAN InitializeVideoObjectManager();

// Deletes any video object placed into list
BOOLEAN ShutdownVideoObjectManager();

// Creates and adds a video object to list
const AddVideoObject = (a, b) => AddStandardVideoObject(a, b);

BOOLEAN AddStandardVideoObject(VOBJECT_DESC *VObjectDesc, UINT32 *uiIndex);

// Removes a video object
BOOLEAN DeleteVideoObjectFromIndex(UINT32 uiVObject);

UINT16 CreateObjectPaletteTables(HVOBJECT pObj, UINT32 uiType);

// Returns a HVOBJECT for the specified index
BOOLEAN GetVideoObject(HVOBJECT *hVObject, UINT32 uiIndex);

// Blits a video object to another video object
BOOLEAN BltVideoObject(UINT32 uiDestVSurface, HVOBJECT hVSrcObject, UINT16 usRegionIndex, INT32 iDestX, INT32 iDestY, UINT32 fBltFlags, blt_fx *pBltFx);

BOOLEAN BltVideoObjectFromIndex(UINT32 uiDestVSurface, UINT32 uiSrcVObject, UINT16 usRegionIndex, INT32 iDestX, INT32 iDestY, UINT32 fBltFlags, blt_fx *pBltFx);

// Sets transparency
BOOLEAN SetVideoObjectTransparency(UINT32 uiIndex, COLORVAL TransColor);

// **********************************************************************************
//
// Video Object manipulation functions
//
// **********************************************************************************

// Created from a VOBJECT_DESC structure. Can be from a file via HIMAGE or empty.
HVOBJECT CreateVideoObject(VOBJECT_DESC *VObjectDesc);

// Sets Transparency color into HVOBJECT
BOOLEAN SetVideoObjectTransparencyColor(HVOBJECT hVObject, COLORVAL TransColor);

// Sets HVOBJECT palette, creates if nessessary. Also sets 16BPP palette
BOOLEAN SetVideoObjectPalette(HVOBJECT hVObject, SGPPaletteEntry *pSrcPalette);

// Deletes all data
BOOLEAN DeleteVideoObject(HVOBJECT hVObject);

// Deletes the 16-bit palette tables
BOOLEAN DestroyObjectPaletteTables(HVOBJECT hVObject);

// Sets the current object shade table
UINT16 SetObjectShade(HVOBJECT pObj, UINT32 uiShade);

// Sets the current object shade table using a vobject handle
UINT16 SetObjectHandleShade(UINT32 uiHandle, UINT32 uiShade);

// Fills a rectangular area of an object with a color
UINT16 FillObjectRect(UINT32 iObj, INT32 x1, INT32 y1, INT32 x2, INT32 y2, COLORVAL color32);

// Retrieves an HVOBJECT pixel value
BOOLEAN GetETRLEPixelValue(UINT8 *pDest, HVOBJECT hVObject, UINT16 usETLREIndex, UINT16 usX, UINT16 usY);

// ****************************************************************************
//
// Globals
//
// ****************************************************************************
extern HLIST ghVideoObjects;

// ****************************************************************************
//
// Macros
//
// ****************************************************************************

extern BOOLEAN gfVideoObjectsInit;
const VideoObjectsInitialized = () => (gfVideoObjectsInit);

// ****************************************************************************
//
// Blt Functions
//
// ****************************************************************************

// These blitting functions more-or less encapsolate all of the functionality of DirectDraw
// Blitting, giving an API layer for portability.

BOOLEAN BltVideoObjectToBuffer(UINT16 *pBuffer, UINT32 uiDestPitchBYTES, HVOBJECT hSrcVObject, UINT16 usIndex, INT32 iDestX, INT32 iDestY, INT32 fBltFlags, blt_fx *pBltFx);

HVOBJECT GetPrimaryVideoObject();
HVOBJECT GetBackBufferVideoObject();

BOOLEAN GetVideoObjectETRLEProperties(HVOBJECT hVObject, ETRLEObject *pETRLEObject, UINT16 usIndex);
BOOLEAN GetVideoObjectETRLEPropertiesFromIndex(UINT32 uiVideoObject, ETRLEObject *pETRLEObject, UINT16 usIndex);
BOOLEAN GetVideoObjectETRLESubregionProperties(UINT32 uiVideoObject, UINT16 usIndex, UINT16 *pusWidth, UINT16 *pusHeight);

BOOLEAN SetVideoObjectPalette8BPP(INT32 uiVideoObject, SGPPaletteEntry *pPal8);
BOOLEAN SetVideoObjectPalette16BPP(INT32 uiVideoObject, UINT16 *pPal16);
BOOLEAN GetVideoObjectPalette16BPP(INT32 uiVideoObject, UINT16 **ppPal16);
BOOLEAN CopyVideoObjectPalette16BPP(INT32 uiVideoObject, UINT16 *ppPal16);

BOOLEAN ConvertVObjectRegionTo16BPP(HVOBJECT hVObject, UINT16 usRegionIndex, UINT8 ubShadeLevel);
BOOLEAN CheckFor16BPPRegion(HVOBJECT hVObject, UINT16 usRegionIndex, UINT8 ubShadeLevel, UINT16 *pusIndex);

BOOLEAN BltVideoObjectOutlineFromIndex(UINT32 uiDestVSurface, UINT32 uiSrcVObject, UINT16 usIndex, INT32 iDestX, INT32 iDestY, INT16 s16BPPColor, BOOLEAN fDoOutline);
BOOLEAN BltVideoObjectOutline(UINT32 uiDestVSurface, HVOBJECT hSrcVObject, UINT16 usIndex, INT32 iDestX, INT32 iDestY, INT16 s16BPPColor, BOOLEAN fDoOutline);
BOOLEAN BltVideoObjectOutlineShadowFromIndex(UINT32 uiDestVSurface, UINT32 uiSrcVObject, UINT16 usIndex, INT32 iDestX, INT32 iDestY);
BOOLEAN BltVideoObjectOutlineShadow(UINT32 uiDestVSurface, HVOBJECT hSrcVObject, UINT16 usIndex, INT32 iDestX, INT32 iDestY);
BOOLEAN PixelateVideoObjectRect(UINT32 uiDestVSurface, INT32 X1, INT32 Y1, INT32 X2, INT32 Y2);
