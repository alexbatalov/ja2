///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface SGP Module
//
///////////////////////////////////////////////////////////////////////////////////////////////////

//
// Defines for special video object handles given to blit function
//

const PRIMARY_SURFACE = 0xFFFFFFF0;
const BACKBUFFER = 0xFFFFFFF1;
const FRAME_BUFFER = 0xFFFFFFF2;
const MOUSE_BUFFER = 0xFFFFFFF3;

//
// Defines for blitting
//

const VS_BLT_COLORFILL = 0x000000020;
const VS_BLT_USECOLORKEY = 0x000000002;
const VS_BLT_USEDESTCOLORKEY = 0x000000200;
const VS_BLT_FAST = 0x000000004;
const VS_BLT_CLIPPED = 0x000000008;
const VS_BLT_SRCREGION = 0x000000010;
const VS_BLT_DESTREGION = 0x000000080;
const VS_BLT_SRCSUBRECT = 0x000000040;
const VS_BLT_COLORFILLRECT = 0x000000100;
const VS_BLT_MIRROR_Y = 0x000001000;

//
// Effects structure for specialized blitting
//

interface blt_vs_fx {
  ColorFill: COLORVAL; // Used for fill effect
  SrcRect: SGPRect; // Given SRC subrect instead of srcregion
  FillRect: SGPRect; // Given SRC subrect instead of srcregion
  DestRegion: UINT16; // Given a DEST region for dest positions within the VO
}

//
// Video Surface Flags
// Used to describe the memory usage of a video Surface
//

const VSURFACE_DEFAULT_MEM_USAGE = 0x00000001; // Default mem usage is same as DD, try video and then try system. Will usually work
const VSURFACE_VIDEO_MEM_USAGE = 0x00000002; // Will force surface into video memory and will fail if it can't
const VSURFACE_SYSTEM_MEM_USAGE = 0x00000004; // Will force surface into system memory and will fail if it can't
const VSURFACE_RESERVED_SURFACE = 0x00000100; // Reserved for special purposes, like a primary surface

//
// Video Surface creation flags
// Used in the VSurface_DESC structure to describe creation flags
//

const VSURFACE_CREATE_DEFAULT = 0x00000020; // Creates and empty Surface of given width, height and BPP
const VSURFACE_CREATE_FROMFILE = 0x00000040; // Creates a video Surface from a file ( using HIMAGE )

//
// The following structure is used to define a region of the video Surface
// These regions are stored via a HLIST
//

interface VSURFACE_REGION {
  RegionCoords: SGPRect; // Rectangle describing coordinates of region
  Origin: SGPPoint; // Origin used for hot spots, etc
  ubHitMask: UINT8; // Byte flags for hit detection
}

//
// This structure is a video Surface. Contains a HLIST of regions
//

interface SGPVSurface {
  usHeight: UINT16; // Height of Video Surface
  usWidth: UINT16; // Width of Video Surface
  ubBitDepth: UINT8; // BPP ALWAYS 16!
  pSurfaceData: PTR; // A void pointer, but for this implementation, is really a lpDirectDrawSurface;
  pSurfaceData1: PTR; // Direct Draw One Interface
  pSavedSurfaceData1: PTR; // A void pointer, but for this implementation, is really a lpDirectDrawSurface;
                           // pSavedSurfaceData is used to hold all video memory Surfaces so that they my be restored
  pSavedSurfaceData: PTR; // A void pointer, but for this implementation, is really a lpDirectDrawSurface;
                          // pSavedSurfaceData is used to hold all video memory Surfaces so that they my be restored
  fFlags: UINT32; // Used to describe memory usage, etc
  pPalette: PTR; // A void pointer, but for this implementation a DDPalette
  p16BPPPalette: Pointer<UINT16>; // A 16BPP palette used for 8->16 blits
  TransparentColor: COLORVAL; // Defaults to 0,0,0
  pClipper: PTR; // A void pointer encapsolated as a clipper Surface
  RegionList: HLIST; // A List of regions within the video Surface
}

type HVSURFACE = Pointer<SGPVSurface>;

//
// This structure describes the creation parameters for a Video Surface
//

interface VSURFACE_DESC {
  fCreateFlags: UINT32; // Specifies creation flags like from file or not
  ImageFile: SGPFILENAME; // Filename of image data to use
  usWidth: UINT16; // Width, ignored if given from file
  usHeight: UINT16; // Height, ignored if given from file
  ubBitDepth: UINT8; // BPP, ignored if given from file
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface Manager Functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

extern INT32 giMemUsedInSurfaces;

// Creates a list to contain video Surfaces
BOOLEAN InitializeVideoSurfaceManager();

// Deletes any video Surface placed into list
BOOLEAN ShutdownVideoSurfaceManager();

// Restores all video Surfaces in list
BOOLEAN RestoreVideoSurfaces();

// Creates and adds a video Surface to list
const AddVideoSurface = (a, b) => AddStandardVideoSurface(a, b);

BOOLEAN AddStandardVideoSurface(VSURFACE_DESC *VSurfaceDesc, UINT32 *uiIndex);

// Returns a HVSurface for the specified index
BOOLEAN GetVideoSurface(HVSURFACE *hVSurface, UINT32 uiIndex);

BYTE *LockVideoSurface(UINT32 uiVSurface, UINT32 *uiPitch);
void UnLockVideoSurface(UINT32 uiVSurface);

// Blits a video Surface to another video Surface
BOOLEAN BltVideoSurface(UINT32 uiDestVSurface, UINT32 uiSrcVSurface, UINT16 usRegionIndex, INT32 iDestX, INT32 iDestY, UINT32 fBltFlags, blt_vs_fx *pBltFx);

BOOLEAN ColorFillVideoSurfaceArea(UINT32 uiDestVSurface, INT32 iDestX1, INT32 iDestY1, INT32 iDestX2, INT32 iDestY2, UINT16 Color16BPP);

BOOLEAN ImageFillVideoSurfaceArea(UINT32 uiDestVSurface, INT32 iDestX1, INT32 iDestY1, INT32 iDestX2, INT32 iDestY2, HVOBJECT BkgrndImg, UINT16 Index, INT16 Ox, INT16 Oy);

// This function sets the global video Surfaces for primary and backbuffer
BOOLEAN SetPrimaryVideoSurfaces();

// Sets transparency
BOOLEAN SetVideoSurfaceTransparency(UINT32 uiIndex, COLORVAL TransColor);

// Adds a video Surface region
BOOLEAN AddVideoSurfaceRegion(UINT32 uiIndex, VSURFACE_REGION *pNewRegion);

// Gets width, hight, bpp information
BOOLEAN GetVideoSurfaceDescription(UINT32 uiIndex, UINT16 *usWidth, UINT16 *usHeight, UINT8 *ubBitDepth);

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface manipulation functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

// Darkens a rectangular area on a surface for menus etc.
BOOLEAN PixelateVideoSurfaceRect(UINT32 uiDestVSurface, INT32 X1, INT32 Y1, INT32 X2, INT32 Y2);

// Created from a VSurface_DESC structure. Can be from a file via HIMAGE or empty.
HVSURFACE CreateVideoSurface(VSURFACE_DESC *VSurfaceDesc);

// Gets the RGB palette entry values
BOOLEAN GetVSurfacePaletteEntries(HVSURFACE hVSurface, SGPPaletteEntry *pPalette);

BOOLEAN RestoreVideoSurface(HVSURFACE hVSurface);

// Returns a flat pointer for direct manipulation of data
BYTE *LockVideoSurfaceBuffer(HVSURFACE hVSurface, UINT32 *pPitch);

// Must be called after Locking buffer call above
void UnLockVideoSurfaceBuffer(HVSURFACE hVSurface);

// Set data from HIMAGE.
BOOLEAN SetVideoSurfaceDataFromHImage(HVSURFACE hVSurface, HIMAGE hImage, UINT16 usX, UINT16 usY, SGPRect *pSrcRect);

// Sets Transparency color into HVSurface and the underlying DD surface
BOOLEAN SetVideoSurfaceTransparencyColor(HVSURFACE hVSurface, COLORVAL TransColor);

// Sets HVSurface palette, creates if nessessary. Also sets 16BPP palette
BOOLEAN SetVideoSurfacePalette(HVSURFACE hVSurface, SGPPaletteEntry *pSrcPalette);

// Used if it's in video memory, will re-load backup copy
// BOOLEAN RestoreVideoSurface( HVSurface hVSurface );

// Deletes all data, including palettes, regions, DD Surfaces
BOOLEAN DeleteVideoSurface(HVSURFACE hVSurface);
BOOLEAN DeleteVideoSurfaceFromIndex(UINT32 uiIndex);

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Region manipulation functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

// Regions will allow creation of sections within the Surface to manipulate quickly and cleanly
// An example would be a cursor tileset
BOOLEAN AddVSurfaceRegion(HVSURFACE hVSurface, VSURFACE_REGION *pNewRegion);
BOOLEAN AddVSurfaceRegionAtIndex(HVSURFACE hVSurface, UINT16 usIndex, VSURFACE_REGION *pNewRegion);
BOOLEAN AddVSurfaceRegions(HVSURFACE hVSurface, VSURFACE_REGION **ppNewRegions, UINT16 uiNumRegions);
BOOLEAN RemoveVSurfaceRegion(HVSURFACE hVSurface, UINT16 usIndex);
BOOLEAN ClearAllVSurfaceRegions(HVSURFACE hVSurface);
BOOLEAN GetVSurfaceRegion(HVSURFACE hVSurface, UINT16 usIndex, VSURFACE_REGION *aRegion);
BOOLEAN GetNumRegions(HVSURFACE hVSurface, UINT32 *puiNumRegions);
BOOLEAN ReplaceVSurfaceRegion(HVSURFACE hVSurface, UINT16 usIndex, VSURFACE_REGION *aRegion);
BOOLEAN DeleteVideoSurfaceFromIndex(UINT32 uiIndex);

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Clipper manipulation functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

BOOLEAN SetClipList(HVSURFACE hVSurface, SGPRect *RegionData, UINT16 usNumRegions);

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Blt Functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

// These blitting functions more-or less encapsolate all of the functionality of DirectDraw
// Blitting, giving an API layer for portability.

BOOLEAN BltVideoSurfaceToVideoSurface(HVSURFACE hDestVSurface, HVSURFACE hSrcVSurface, UINT16 usIndex, INT32 iDestX, INT32 iDestY, INT32 fBltFlags, blt_vs_fx *pBltFx);

HVSURFACE GetPrimaryVideoSurface();
HVSURFACE GetBackBufferVideoSurface();

BOOLEAN ShadowVideoSurfaceRect(UINT32 uiDestVSurface, INT32 X1, INT32 Y1, INT32 X2, INT32 Y2);
BOOLEAN ShadowVideoSurfaceImage(UINT32 uiDestVSurface, HVOBJECT hImageHandle, INT32 iPosX, INT32 iPosY);

// If the Dest Rect and the source rect are not the same size, the source surface will be either
// enlraged or shunk.
BOOLEAN BltStretchVideoSurface(UINT32 uiDestVSurface, UINT32 uiSrcVSurface, INT32 iDestX, INT32 iDestY, UINT32 fBltFlags, SGPRect *SrcRect, SGPRect *DestRect);

BOOLEAN MakeVSurfaceFromVObject(UINT32 uiVObject, UINT16 usSubIndex, UINT32 *puiVSurface);

BOOLEAN ShadowVideoSurfaceRectUsingLowPercentTable(UINT32 uiDestVSurface, INT32 X1, INT32 Y1, INT32 X2, INT32 Y2);
