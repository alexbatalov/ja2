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

// Creates and adds a video Surface to list
const AddVideoSurface = (a, b) => AddStandardVideoSurface(a, b);

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface manipulation functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

// Used if it's in video memory, will re-load backup copy
// BOOLEAN RestoreVideoSurface( HVSurface hVSurface );

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Region manipulation functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Clipper manipulation functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Blt Functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

// These blitting functions more-or less encapsolate all of the functionality of DirectDraw
// Blitting, giving an API layer for portability.
