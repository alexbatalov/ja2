///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface SGP Module
//
// Second Revision: Dec 10, 1996, Andrew Emmons
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Defines
//
///////////////////////////////////////////////////////////////////////////////////////////////////

//
// This define is sent to CreateList SGP function. It dynamically re-sizes if
// the list gets larger
//

const DEFAULT_NUM_REGIONS = 5;
const DEFAULT_VIDEO_SURFACE_LIST_SIZE = 10;

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// LOCAL functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// LOCAL global variables
//
///////////////////////////////////////////////////////////////////////////////////////////////////

interface VSURFACE_NODE {
  hVSurface: HVSURFACE;
  uiIndex: UINT32;

  next: Pointer<VSURFACE_NODE>;
  prev: Pointer<VSURFACE_NODE>;
}

let gpVSurfaceHead: Pointer<VSURFACE_NODE> = NULL;
let gpVSurfaceTail: Pointer<VSURFACE_NODE> = NULL;
let guiVSurfaceIndex: UINT32 = 0;
let guiVSurfaceSize: UINT32 = 0;
let guiVSurfaceTotalAdded: UINT32 = 0;

let giMemUsedInSurfaces: INT32;

// OBSOLETE!!!!!!!!!
let ghVideoSurfaces: HLIST = NULL;
// OBSOLETE!!!!!!!!!

let ghPrimary: HVSURFACE = NULL;
let ghBackBuffer: HVSURFACE = NULL;
let ghFrameBuffer: HVSURFACE = NULL;
let ghMouseBuffer: HVSURFACE = NULL;

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface Manager functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function InitializeVideoSurfaceManager(): BOOLEAN {
  // Shouldn't be calling this if the video surface manager already exists.
  // Call shutdown first...
  Assert(!gpVSurfaceHead);
  Assert(!gpVSurfaceTail);
  RegisterDebugTopic(TOPIC_VIDEOSURFACE, "Video Surface Manager");
  gpVSurfaceHead = gpVSurfaceTail = NULL;

  giMemUsedInSurfaces = 0;

  // Create primary and backbuffer from globals
  if (!SetPrimaryVideoSurfaces()) {
    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_1, String("Could not create primary surfaces"));
    return FALSE;
  }

  return TRUE;
}

function ShutdownVideoSurfaceManager(): BOOLEAN {
  let curr: Pointer<VSURFACE_NODE>;

  DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_0, "Shutting down the Video Surface manager");

  // Delete primary viedeo surfaces
  DeletePrimaryVideoSurfaces();

  while (gpVSurfaceHead) {
    curr = gpVSurfaceHead;
    gpVSurfaceHead = gpVSurfaceHead->next;
    DeleteVideoSurface(curr->hVSurface);
    MemFree(curr);
  }
  gpVSurfaceHead = NULL;
  gpVSurfaceTail = NULL;
  guiVSurfaceIndex = 0;
  guiVSurfaceSize = 0;
  guiVSurfaceTotalAdded = 0;
  UnRegisterDebugTopic(TOPIC_VIDEOSURFACE, "Video Objects");
  return TRUE;
}

function RestoreVideoSurfaces(): BOOLEAN {
  let curr: Pointer<VSURFACE_NODE>;

  //
  // Loop through Video Surfaces and Restore
  //
  curr = gpVSurfaceTail;
  while (curr) {
    if (!RestoreVideoSurface(curr->hVSurface)) {
      return FALSE;
    }
    curr = curr->prev;
  }
  return TRUE;
}

function AddStandardVideoSurface(pVSurfaceDesc: Pointer<VSURFACE_DESC>, puiIndex: Pointer<UINT32>): BOOLEAN {
  let hVSurface: HVSURFACE;

  // Assertions
  Assert(puiIndex);
  Assert(pVSurfaceDesc);

  // Create video object
  hVSurface = CreateVideoSurface(pVSurfaceDesc);

  if (!hVSurface) {
    // Video Object will set error condition.
    return FALSE;
  }

  // Set transparency to default
  SetVideoSurfaceTransparencyColor(hVSurface, FROMRGB(0, 0, 0));

  // Set into video object list
  if (gpVSurfaceHead) {
    // Add node after tail
    gpVSurfaceTail->next = (VSURFACE_NODE *)MemAlloc(sizeof(VSURFACE_NODE));
    Assert(gpVSurfaceTail->next); // out of memory?
    gpVSurfaceTail->next->prev = gpVSurfaceTail;
    gpVSurfaceTail->next->next = NULL;
    gpVSurfaceTail = gpVSurfaceTail->next;
  } else {
    // new list
    gpVSurfaceHead = (VSURFACE_NODE *)MemAlloc(sizeof(VSURFACE_NODE));
    Assert(gpVSurfaceHead); // out of memory?
    gpVSurfaceHead->prev = gpVSurfaceHead->next = NULL;
    gpVSurfaceTail = gpVSurfaceHead;
  }
  // Set the hVSurface into the node.
  gpVSurfaceTail->hVSurface = hVSurface;
  gpVSurfaceTail->uiIndex = guiVSurfaceIndex += 2;
  *puiIndex = gpVSurfaceTail->uiIndex;
  Assert(guiVSurfaceIndex < 0xfffffff0); // unlikely that we will ever use 2 billion VSurfaces!
  // We would have to create about 70 VSurfaces per second for 1 year straight to achieve this...
  guiVSurfaceSize++;
  guiVSurfaceTotalAdded++;

  return TRUE;
}

function LockVideoSurface(uiVSurface: UINT32, puiPitch: Pointer<UINT32>): Pointer<BYTE> {
  let curr: Pointer<VSURFACE_NODE>;

  //
  // Check if given backbuffer or primary buffer
  //
  if (uiVSurface == PRIMARY_SURFACE) {
    return LockPrimarySurface(puiPitch);
  }

  if (uiVSurface == BACKBUFFER) {
    return LockBackBuffer(puiPitch);
  }

  if (uiVSurface == FRAME_BUFFER) {
    return LockFrameBuffer(puiPitch);
  }

  if (uiVSurface == MOUSE_BUFFER) {
    return LockMouseBuffer(puiPitch);
  }

  //
  // Otherwise, use list
  //

  curr = gpVSurfaceHead;
  while (curr) {
    if (curr->uiIndex == uiVSurface) {
      break;
    }
    curr = curr->next;
  }
  if (!curr) {
    return FALSE;
  }

  //
  // Lock buffer
  //

  return LockVideoSurfaceBuffer(curr->hVSurface, puiPitch);
}

function UnLockVideoSurface(uiVSurface: UINT32): void {
  let curr: Pointer<VSURFACE_NODE>;

  //
  // Check if given backbuffer or primary buffer
  //
  if (uiVSurface == PRIMARY_SURFACE) {
    UnlockPrimarySurface();
    return;
  }

  if (uiVSurface == BACKBUFFER) {
    UnlockBackBuffer();
    return;
  }

  if (uiVSurface == FRAME_BUFFER) {
    UnlockFrameBuffer();
    return;
  }

  if (uiVSurface == MOUSE_BUFFER) {
    UnlockMouseBuffer();
    return;
  }

  curr = gpVSurfaceHead;
  while (curr) {
    if (curr->uiIndex == uiVSurface) {
      break;
    }
    curr = curr->next;
  }
  if (!curr) {
    return;
  }

  //
  // unlock buffer
  //

  UnLockVideoSurfaceBuffer(curr->hVSurface);
}

function SetVideoSurfaceTransparency(uiIndex: UINT32, TransColor: COLORVAL): BOOLEAN {
  let hVSurface: HVSURFACE;

  //
  // Get Video Surface
  //

  CHECKF(GetVideoSurface(&hVSurface, uiIndex));

  //
  // Set transparency
  //

  SetVideoSurfaceTransparencyColor(hVSurface, TransColor);

  return TRUE;
}

function AddVideoSurfaceRegion(uiIndex: UINT32, pNewRegion: Pointer<VSURFACE_REGION>): BOOLEAN {
  let hVSurface: HVSURFACE;

  //
  // Get Video Surface
  //

  CHECKF(GetVideoSurface(&hVSurface, uiIndex));

  //
  // Add Region
  //

  CHECKF(AddVSurfaceRegion(hVSurface, pNewRegion));

  return TRUE;
}

function GetVideoSurfaceDescription(uiIndex: UINT32, usWidth: Pointer<UINT16>, usHeight: Pointer<UINT16>, ubBitDepth: Pointer<UINT8>): BOOLEAN {
  let hVSurface: HVSURFACE;

  Assert(usWidth != NULL);
  Assert(usHeight != NULL);
  Assert(ubBitDepth != NULL);

  //
  // Get Video Surface
  //

  CHECKF(GetVideoSurface(&hVSurface, uiIndex));

  *usWidth = hVSurface->usWidth;
  *usHeight = hVSurface->usHeight;
  *ubBitDepth = hVSurface->ubBitDepth;

  return TRUE;
}

function GetVideoSurface(hVSurface: Pointer<HVSURFACE>, uiIndex: UINT32): BOOLEAN {
  let curr: Pointer<VSURFACE_NODE>;

  if (uiIndex == PRIMARY_SURFACE) {
    *hVSurface = ghPrimary;
    return TRUE;
  }

  if (uiIndex == BACKBUFFER) {
    *hVSurface = ghBackBuffer;
    return TRUE;
  }

  if (uiIndex == FRAME_BUFFER) {
    *hVSurface = ghFrameBuffer;
    return TRUE;
  }

  if (uiIndex == MOUSE_BUFFER) {
    *hVSurface = ghMouseBuffer;
    return TRUE;
  }

  curr = gpVSurfaceHead;
  while (curr) {
    if (curr->uiIndex == uiIndex) {
      *hVSurface = curr->hVSurface;
      return TRUE;
    }
    curr = curr->next;
  }
  return FALSE;
}

function SetPrimaryVideoSurfaces(): BOOLEAN {
  let pSurface: LPDIRECTDRAWSURFACE2;

  // Delete surfaces if they exist
  DeletePrimaryVideoSurfaces();

  //
  // Get Primary surface
  //
  pSurface = GetPrimarySurfaceObject();
  CHECKF(pSurface != NULL);

  ghPrimary = CreateVideoSurfaceFromDDSurface(pSurface);
  CHECKF(ghPrimary != NULL);

  //
  // Get Backbuffer surface
  //

  pSurface = GetBackBufferObject();
  CHECKF(pSurface != NULL);

  ghBackBuffer = CreateVideoSurfaceFromDDSurface(pSurface);
  CHECKF(ghBackBuffer != NULL);

  //
  // Get mouse buffer surface
  //
  pSurface = GetMouseBufferObject();
  CHECKF(pSurface != NULL);

  ghMouseBuffer = CreateVideoSurfaceFromDDSurface(pSurface);
  CHECKF(ghMouseBuffer != NULL);

  //
  // Get frame buffer surface
  //

  pSurface = GetFrameBufferObject();
  CHECKF(pSurface != NULL);

  ghFrameBuffer = CreateVideoSurfaceFromDDSurface(pSurface);
  CHECKF(ghFrameBuffer != NULL);

  return TRUE;
}

function DeletePrimaryVideoSurfaces(): void {
  //
  // If globals are not null, delete them
  //

  if (ghPrimary != NULL) {
    DeleteVideoSurface(ghPrimary);
    ghPrimary = NULL;
  }

  if (ghBackBuffer != NULL) {
    DeleteVideoSurface(ghBackBuffer);
    ghBackBuffer = NULL;
  }

  if (ghFrameBuffer != NULL) {
    DeleteVideoSurface(ghFrameBuffer);
    ghFrameBuffer = NULL;
  }

  if (ghMouseBuffer != NULL) {
    DeleteVideoSurface(ghMouseBuffer);
    ghMouseBuffer = NULL;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Given an index to the dest and src vobject contained in our private VSurface list
// Based on flags, blit accordingly
// There are two types, a BltFast and a Blt. BltFast is 10% faster, uses no
// clipping lists
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function BltVideoSurface(uiDestVSurface: UINT32, uiSrcVSurface: UINT32, usRegionIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, pBltFx: Pointer<blt_vs_fx>): BOOLEAN {
  let hDestVSurface: HVSURFACE;
  let hSrcVSurface: HVSURFACE;

  if (!GetVideoSurface(&hDestVSurface, uiDestVSurface)) {
    return FALSE;
  }
  if (!GetVideoSurface(&hSrcVSurface, uiSrcVSurface)) {
    return FALSE;
  }
  if (!BltVideoSurfaceToVideoSurface(hDestVSurface, hSrcVSurface, usRegionIndex, iDestX, iDestY, fBltFlags, pBltFx)) {
    // VO Blitter will set debug messages for error conditions
    return FALSE;
  }
  return TRUE;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Fills an rectangular area with a specified color value.
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function ColorFillVideoSurfaceArea(uiDestVSurface: UINT32, iDestX1: INT32, iDestY1: INT32, iDestX2: INT32, iDestY2: INT32, Color16BPP: UINT16): BOOLEAN {
  let BltFx: blt_vs_fx;
  let hDestVSurface: HVSURFACE;
  let Clip: SGPRect;

  if (!GetVideoSurface(&hDestVSurface, uiDestVSurface)) {
    return FALSE;
  }

  BltFx.ColorFill = Color16BPP;
  BltFx.DestRegion = 0;

  //
  // Clip fill region coords
  //

  GetClippingRect(&Clip);

  if (iDestX1 < Clip.iLeft)
    iDestX1 = Clip.iLeft;

  if (iDestX1 > Clip.iRight)
    return FALSE;

  if (iDestX2 > Clip.iRight)
    iDestX2 = Clip.iRight;

  if (iDestX2 < Clip.iLeft)
    return FALSE;

  if (iDestY1 < Clip.iTop)
    iDestY1 = Clip.iTop;

  if (iDestY1 > Clip.iBottom)
    return FALSE;

  if (iDestY2 > Clip.iBottom)
    iDestY2 = Clip.iBottom;

  if (iDestY2 < Clip.iTop)
    return FALSE;

  if ((iDestX2 <= iDestX1) || (iDestY2 <= iDestY1))
    return FALSE;

  BltFx.SrcRect.iLeft = BltFx.FillRect.iLeft = iDestX1;
  BltFx.SrcRect.iTop = BltFx.FillRect.iTop = iDestY1;
  BltFx.SrcRect.iRight = BltFx.FillRect.iRight = iDestX2;
  BltFx.SrcRect.iBottom = BltFx.FillRect.iBottom = iDestY2;

  return FillSurfaceRect(hDestVSurface, &BltFx);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Fills an rectangular area with a specified image value.
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function ImageFillVideoSurfaceArea(uiDestVSurface: UINT32, iDestX1: INT32, iDestY1: INT32, iDestX2: INT32, iDestY2: INT32, BkgrndImg: HVOBJECT, Index: UINT16, Ox: INT16, Oy: INT16): BOOLEAN {
  let xc: INT16;
  let yc: INT16;
  let hblits: INT16;
  let wblits: INT16;
  let aw: INT16;
  let pw: INT16;
  let ah: INT16;
  let ph: INT16;
  let w: INT16;
  let h: INT16;
  let xo: INT16;
  let yo: INT16;
  let pTrav: Pointer<ETRLEObject>;
  let NewClip: SGPRect;
  let OldClip: SGPRect;

  pTrav = &(BkgrndImg->pETRLEObject[Index]);
  ph = (INT16)(pTrav->usHeight + pTrav->sOffsetY);
  pw = (INT16)(pTrav->usWidth + pTrav->sOffsetX);

  ah = (INT16)(iDestY2 - iDestY1);
  aw = (INT16)(iDestX2 - iDestX1);

  Ox %= pw;
  Oy %= ph;

  if (Ox > 0)
    Ox -= pw;
  xo = (-Ox) % pw;

  if (Oy > 0)
    Oy -= ph;
  yo = (-Oy) % ph;

  if (Ox < 0)
    xo = (-Ox) % pw;
  else {
    xo = pw - (Ox % pw);
    Ox -= pw;
  }

  if (Oy < 0)
    yo = (-Oy) % ph;
  else {
    yo = ph - (Oy % pw);
    Oy -= ph;
  }

  hblits = ((ah + yo) / ph) + (((ah + yo) % ph) ? 1 : 0);
  wblits = ((aw + xo) / pw) + (((aw + xo) % pw) ? 1 : 0);

  if ((hblits == 0) || (wblits == 0))
    return FALSE;

  //
  // Clip fill region coords
  //

  GetClippingRect(&OldClip);

  NewClip.iLeft = iDestX1;
  NewClip.iTop = iDestY1;
  NewClip.iRight = iDestX2;
  NewClip.iBottom = iDestY2;

  if (NewClip.iLeft < OldClip.iLeft)
    NewClip.iLeft = OldClip.iLeft;

  if (NewClip.iLeft > OldClip.iRight)
    return FALSE;

  if (NewClip.iRight > OldClip.iRight)
    NewClip.iRight = OldClip.iRight;

  if (NewClip.iRight < OldClip.iLeft)
    return FALSE;

  if (NewClip.iTop < OldClip.iTop)
    NewClip.iTop = OldClip.iTop;

  if (NewClip.iTop > OldClip.iBottom)
    return FALSE;

  if (NewClip.iBottom > OldClip.iBottom)
    NewClip.iBottom = OldClip.iBottom;

  if (NewClip.iBottom < OldClip.iTop)
    return FALSE;

  if ((NewClip.iRight <= NewClip.iLeft) || (NewClip.iBottom <= NewClip.iTop))
    return FALSE;

  SetClippingRect(&NewClip);

  yc = (INT16)iDestY1;
  for (h = 0; h < hblits; h++) {
    xc = (INT16)iDestX1;
    for (w = 0; w < wblits; w++) {
      BltVideoObject(uiDestVSurface, BkgrndImg, Index, xc + Ox, yc + Oy, VO_BLT_SRCTRANSPARENCY, NULL);
      xc += pw;
    }
    yc += ph;
  }

  SetClippingRect(&OldClip);
  return TRUE;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface Manipulation Functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function CreateVideoSurface(VSurfaceDesc: Pointer<VSURFACE_DESC>): HVSURFACE {
  let lpDD2Object: LPDIRECTDRAW2;
  let SurfaceDescription: DDSURFACEDESC;
  let PixelFormat: DDPIXELFORMAT;
  let lpDDS: LPDIRECTDRAWSURFACE;
  let lpDDS2: LPDIRECTDRAWSURFACE2;
  let hVSurface: HVSURFACE;
  let hImage: HIMAGE;
  let tempRect: SGPRect;
  let usHeight: UINT16;
  let usWidth: UINT16;
  let ubBitDepth: UINT8;
  let fMemUsage: UINT32;

  //#ifdef JA2
  let uiRBitMask: UINT32;
  let uiGBitMask: UINT32;
  let uiBBitMask: UINT32;
  //#endif

  // Clear the memory
  memset(&SurfaceDescription, 0, sizeof(DDSURFACEDESC));

  //
  // Get Direct Draw Object
  //

  lpDD2Object = GetDirectDraw2Object();

  //
  // The description structure contains memory usage flag
  //
  fMemUsage = VSurfaceDesc->fCreateFlags;

  //
  // Check creation options
  //

  do {
    //
    // Check if creating from file
    //

    if (VSurfaceDesc->fCreateFlags & VSURFACE_CREATE_FROMFILE) {
      //
      // Create himage object from file
      //

      hImage = CreateImage(VSurfaceDesc->ImageFile, IMAGE_ALLIMAGEDATA);

      if (hImage == NULL) {
        DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, "Invalid Image Filename given");
        return NULL;
      }

      //
      // Set values from himage
      //
      usHeight = hImage->usHeight;
      usWidth = hImage->usWidth;
      ubBitDepth = hImage->ubBitDepth;
      break;
    }

    //
    // If here, no special options given,
    // Set values from given description structure
    //

    usHeight = VSurfaceDesc->usHeight;
    usWidth = VSurfaceDesc->usWidth;
    ubBitDepth = VSurfaceDesc->ubBitDepth;
  } while (FALSE);

  //
  // Assertions
  //

  Assert(usHeight > 0);
  Assert(usWidth > 0);

  //
  // Setup Direct Draw Description
  // First do Pixel Format
  //

  memset(&PixelFormat, 0, sizeof(PixelFormat));
  PixelFormat.dwSize = sizeof(DDPIXELFORMAT);

  switch (ubBitDepth) {
    case 8:

      PixelFormat.dwFlags = DDPF_RGB | DDPF_PALETTEINDEXED8;
      PixelFormat.dwRGBBitCount = 8;
      break;

    case 16:

      PixelFormat.dwFlags = DDPF_RGB;
      PixelFormat.dwRGBBitCount = 16;

      //
      // Get current Pixel Format from DirectDraw
      //

      // We're using pixel formats too -- DB/Wiz

      //#ifdef JA2
      CHECKF(GetPrimaryRGBDistributionMasks(&uiRBitMask, &uiGBitMask, &uiBBitMask));
      PixelFormat.dwRBitMask = uiRBitMask;
      PixelFormat.dwGBitMask = uiGBitMask;
      PixelFormat.dwBBitMask = uiBBitMask;
      //#else
      //			PixelFormat.dwRBitMask = 0xf800;
      //			PixelFormat.dwGBitMask = 0x7e0;
      //			PixelFormat.dwBBitMask = 0x1f;
      //#endif
      break;

    default:

      //
      // If Here, an invalid format was given
      //

      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, "Invalid BPP value, can only be 8 or 16.");
      return FALSE;
  }

  SurfaceDescription.dwFlags = DDSD_CAPS | DDSD_HEIGHT | DDSD_WIDTH | DDSD_PIXELFORMAT;

  //
  // Do memory description, based on specified flags
  //

  do {
    if (fMemUsage & VSURFACE_DEFAULT_MEM_USAGE) {
      SurfaceDescription.ddsCaps.dwCaps = DDSCAPS_OFFSCREENPLAIN;
      break;
    }
    if (fMemUsage & VSURFACE_VIDEO_MEM_USAGE) {
      SurfaceDescription.ddsCaps.dwCaps = DDSCAPS_OFFSCREENPLAIN;
      break;
    }

    if (fMemUsage & VSURFACE_SYSTEM_MEM_USAGE) {
      SurfaceDescription.ddsCaps.dwCaps = DDSCAPS_OFFSCREENPLAIN | DDSCAPS_SYSTEMMEMORY;
      break;
    }

    //
    // Once here, no mem flags were given, use default
    //

    SurfaceDescription.ddsCaps.dwCaps = DDSCAPS_OFFSCREENPLAIN;
  } while (FALSE);

  //
  // Set other, common structure elements
  //

  SurfaceDescription.dwSize = sizeof(DDSURFACEDESC);
  SurfaceDescription.dwWidth = usWidth;
  SurfaceDescription.dwHeight = usHeight;
  SurfaceDescription.ddpfPixelFormat = PixelFormat;

  //
  // Create Surface
  //

  DDCreateSurface(lpDD2Object, &SurfaceDescription, &lpDDS, &lpDDS2);

  //
  // Allocate memory for Video Surface data and initialize
  //

  hVSurface = MemAlloc(sizeof(SGPVSurface));
  memset(hVSurface, 0, sizeof(SGPVSurface));
  CHECKF(hVSurface != NULL);

  hVSurface->usHeight = usHeight;
  hVSurface->usWidth = usWidth;
  hVSurface->ubBitDepth = ubBitDepth;
  hVSurface->pSurfaceData1 = (PTR)lpDDS;
  hVSurface->pSurfaceData = (PTR)lpDDS2;
  hVSurface->pSavedSurfaceData1 = NULL;
  hVSurface->pSavedSurfaceData = NULL;
  hVSurface->pPalette = NULL;
  hVSurface->p16BPPPalette = NULL;
  hVSurface->TransparentColor = FROMRGB(0, 0, 0);
  hVSurface->RegionList = CreateList(DEFAULT_NUM_REGIONS, sizeof(VSURFACE_REGION));
  hVSurface->fFlags = 0;
  hVSurface->pClipper = NULL;

  //
  // Determine memory and other attributes of newly created surface
  //

  DDGetSurfaceDescription(lpDDS2, &SurfaceDescription);

  //
  // Fail if create tried for video but it's in system
  //

  if (VSurfaceDesc->fCreateFlags & VSURFACE_VIDEO_MEM_USAGE && SurfaceDescription.ddsCaps.dwCaps & DDSCAPS_SYSTEMMEMORY) {
    //
    // Return failure due to not in video
    //

    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Failed to create Video Surface in video memory"));
    DDReleaseSurface(&lpDDS, &lpDDS2);
    MemFree(hVSurface);
    return NULL;
  }

  //
  // Look for system memory
  //

  if (SurfaceDescription.ddsCaps.dwCaps & DDSCAPS_SYSTEMMEMORY) {
    hVSurface->fFlags |= VSURFACE_SYSTEM_MEM_USAGE;
  }

  //
  // Look for video memory
  //

  if (SurfaceDescription.ddsCaps.dwCaps & DDSCAPS_VIDEOMEMORY) {
    hVSurface->fFlags |= VSURFACE_VIDEO_MEM_USAGE;
  }

  //
  // If in video memory, create backup surface
  //

  if (hVSurface->fFlags & VSURFACE_VIDEO_MEM_USAGE) {
    SurfaceDescription.dwFlags = DDSD_CAPS | DDSD_HEIGHT | DDSD_WIDTH | DDSD_PIXELFORMAT;
    SurfaceDescription.ddsCaps.dwCaps = DDSCAPS_OFFSCREENPLAIN | DDSCAPS_SYSTEMMEMORY;
    SurfaceDescription.dwSize = sizeof(DDSURFACEDESC);
    SurfaceDescription.dwWidth = usWidth;
    SurfaceDescription.dwHeight = usHeight;
    SurfaceDescription.ddpfPixelFormat = PixelFormat;

    //
    // Create Surface
    //

    DDCreateSurface(lpDD2Object, &SurfaceDescription, &lpDDS, &lpDDS2);

    //
    // Save surface to backup
    //

    hVSurface->pSavedSurfaceData1 = lpDDS;
    hVSurface->pSavedSurfaceData = lpDDS2;
  }

  //
  // Initialize surface with hImage , if given
  //

  if (VSurfaceDesc->fCreateFlags & VSURFACE_CREATE_FROMFILE) {
    tempRect.iLeft = 0;
    tempRect.iTop = 0;
    tempRect.iRight = hImage->usWidth - 1;
    tempRect.iBottom = hImage->usHeight - 1;
    SetVideoSurfaceDataFromHImage(hVSurface, hImage, 0, 0, &tempRect);

    //
    // Set palette from himage
    //

    if (hImage->ubBitDepth == 8) {
      SetVideoSurfacePalette(hVSurface, hImage->pPalette);
    }

    //
    // Delete himage object
    //

    DestroyImage(hImage);
  }

  //
  // All is well
  //

  hVSurface->usHeight = usHeight;
  hVSurface->usWidth = usWidth;
  hVSurface->ubBitDepth = ubBitDepth;

  giMemUsedInSurfaces += (hVSurface->usHeight * hVSurface->usWidth * (hVSurface->ubBitDepth / 8));

  DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_3, String("Success in Creating Video Surface"));

  return hVSurface;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Called when surface is lost, for the most part called by utility functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function RestoreVideoSurface(hVSurface: HVSURFACE): BOOLEAN {
  let lpDDSurface: LPDIRECTDRAWSURFACE2;
  let lpBackupDDSurface: LPDIRECTDRAWSURFACE2;
  let aRect: RECT;

  Assert(hVSurface != NULL);

  //
  // Restore is only for VIDEO MEMORY - should check if VIDEO and QUIT if not
  //

  if (!(hVSurface->fFlags & VSURFACE_VIDEO_MEM_USAGE)) {
    //
    // No second surfaace has been allocated, return failure
    //

    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Failed to restore Video Surface surface"));
    return FALSE;
  }

  //
  // Check for valid secondary surface
  //

  if (hVSurface->pSavedSurfaceData1 == NULL) {
    //
    // No secondary surface available
    //

    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Failure in retoring- no secondary surface found"));
    return FALSE;
  }

  // Restore primary surface
  lpDDSurface = (LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData;
  DDRestoreSurface(lpDDSurface);

  // Blit backup surface data into primary
  lpBackupDDSurface = (LPDIRECTDRAWSURFACE2)hVSurface->pSavedSurfaceData;

  aRect.top = (int)0;
  aRect.left = (int)0;
  aRect.bottom = (int)hVSurface->usHeight;
  aRect.right = (int)hVSurface->usWidth;

  DDBltFastSurface((LPDIRECTDRAWSURFACE2)hVSurface->pSavedSurfaceData, 0, 0, (LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData, &aRect, DDBLTFAST_NOCOLORKEY);

  return TRUE;
}

// Lock must be followed by release
// Pitch MUST be used for all width calculations ( Pitch is in bytes )
// The time between Locking and unlocking must be minimal
function LockVideoSurfaceBuffer(hVSurface: HVSURFACE, pPitch: Pointer<UINT32>): Pointer<BYTE> {
  let SurfaceDescription: DDSURFACEDESC;

  // Assertions
  if (hVSurface == NULL) {
    let i: int = 0;
  }

  Assert(hVSurface != NULL);
  Assert(pPitch != NULL);

  DDLockSurface((LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData, NULL, &SurfaceDescription, 0, NULL);

  *pPitch = SurfaceDescription.lPitch;

  return SurfaceDescription.lpSurface;
}

function UnLockVideoSurfaceBuffer(hVSurface: HVSURFACE): void {
  Assert(hVSurface != NULL);

  DDUnlockSurface((LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData, NULL);

  // Copy contents if surface is in video
  if (hVSurface->fFlags & VSURFACE_VIDEO_MEM_USAGE && !hVSurface->fFlags & VSURFACE_RESERVED_SURFACE) {
    UpdateBackupSurface(hVSurface);
  }
}

// Given an HIMAGE object, blit imagery into existing Video Surface. Can be from 8->16 BPP
function SetVideoSurfaceDataFromHImage(hVSurface: HVSURFACE, hImage: HIMAGE, usX: UINT16, usY: UINT16, pSrcRect: Pointer<SGPRect>): BOOLEAN {
  let pDest: Pointer<BYTE>;
  let fBufferBPP: UINT32 = 0;
  let uiPitch: UINT32;
  let usEffectiveWidth: UINT16;
  let aRect: SGPRect;

  // Assertions
  Assert(hVSurface != NULL);
  Assert(hImage != NULL);

  // Get Size of hImage and determine if it can fit
  CHECKF(hImage->usWidth >= hVSurface->usWidth);
  CHECKF(hImage->usHeight >= hVSurface->usHeight);

  // Check BPP and see if they are the same
  if (hImage->ubBitDepth != hVSurface->ubBitDepth) {
    // They are not the same, but we can go from 8->16 without much cost
    if (hImage->ubBitDepth == 8 && hVSurface->ubBitDepth == 16) {
      fBufferBPP = BUFFER_16BPP;
    }
  } else {
    // Set buffer BPP
    switch (hImage->ubBitDepth) {
      case 8:

        fBufferBPP = BUFFER_8BPP;
        break;

      case 16:

        fBufferBPP = BUFFER_16BPP;
        break;
    }
  }

  Assert(fBufferBPP != 0);

  // Get surface buffer data
  pDest = LockVideoSurfaceBuffer(hVSurface, &uiPitch);

  // Effective width ( in PIXELS ) is Pitch ( in bytes ) converted to pitch ( IN PIXELS )
  usEffectiveWidth = (UINT16)(uiPitch / (hVSurface->ubBitDepth / 8));

  CHECKF(pDest != NULL);

  // Blit Surface
  // If rect is NULL, use entrie image size
  if (pSrcRect == NULL) {
    aRect.iLeft = 0;
    aRect.iTop = 0;
    aRect.iRight = hImage->usWidth;
    aRect.iBottom = hImage->usHeight;
  } else {
    aRect.iLeft = pSrcRect->iLeft;
    aRect.iTop = pSrcRect->iTop;
    aRect.iRight = pSrcRect->iRight;
    aRect.iBottom = pSrcRect->iBottom;
  }

  // This HIMAGE function will transparently copy buffer
  if (!CopyImageToBuffer(hImage, fBufferBPP, pDest, usEffectiveWidth, hVSurface->usHeight, usX, usY, &aRect)) {
    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Error Occured Copying HIMAGE to HVSURFACE"));
    UnLockVideoSurfaceBuffer(hVSurface);
    return FALSE;
  }

  // All is OK
  UnLockVideoSurfaceBuffer(hVSurface);

  return TRUE;
}

// Palette setting is expensive, need to set both DDPalette and create 16BPP palette
function SetVideoSurfacePalette(hVSurface: HVSURFACE, pSrcPalette: Pointer<SGPPaletteEntry>): BOOLEAN {
  Assert(hVSurface != NULL);

  // Create palette object if not already done so
  if (hVSurface->pPalette == NULL) {
    DDCreatePalette(GetDirectDraw2Object(), (DDPCAPS_8BIT | DDPCAPS_ALLOW256), (LPPALETTEENTRY)(&pSrcPalette[0]), &((LPDIRECTDRAWPALETTE)hVSurface->pPalette), NULL);

    // Set into surface
    // DDSetSurfacePalette( (LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData, (LPDIRECTDRAWPALETTE)hVSurface->pPalette );
  } else {
    // Just Change entries
    DDSetPaletteEntries((LPDIRECTDRAWPALETTE)hVSurface->pPalette, 0, 0, 256, (PALETTEENTRY *)pSrcPalette);
  }

  // Delete 16BPP Palette if one exists
  if (hVSurface->p16BPPPalette != NULL) {
    MemFree(hVSurface->p16BPPPalette);
    hVSurface->p16BPPPalette = NULL;
  }

  // Create 16BPP Palette
  hVSurface->p16BPPPalette = Create16BPPPalette(pSrcPalette);

  DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_3, String("Video Surface Palette change successfull"));
  return TRUE;
}

// Transparency needs to take RGB value and find best fit and place it into DD Surface
// colorkey value.
function SetVideoSurfaceTransparencyColor(hVSurface: HVSURFACE, TransColor: COLORVAL): BOOLEAN {
  let ColorKey: DDCOLORKEY;
  let fFlags: DWORD = CLR_INVALID;
  let lpDDSurface: LPDIRECTDRAWSURFACE2;

  // Assertions
  Assert(hVSurface != NULL);

  // Set trans color into Video Surface
  hVSurface->TransparentColor = TransColor;

  // Get surface pointer
  lpDDSurface = (LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData;
  CHECKF(lpDDSurface != NULL);

  // Get right pixel format, based on bit depth

  switch (hVSurface->ubBitDepth) {
    case 8:

      // Use color directly
      ColorKey.dwColorSpaceLowValue = TransColor;
      ColorKey.dwColorSpaceHighValue = TransColor;
      break;

    case 16:

      fFlags = Get16BPPColor(TransColor);

      // fFlags now contains our closest match
      ColorKey.dwColorSpaceLowValue = fFlags;
      ColorKey.dwColorSpaceHighValue = ColorKey.dwColorSpaceLowValue;
      break;
  }

  DDSetSurfaceColorKey(lpDDSurface, DDCKEY_SRCBLT, &ColorKey);

  return TRUE;
}

function GetVSurfacePaletteEntries(hVSurface: HVSURFACE, pPalette: Pointer<SGPPaletteEntry>): BOOLEAN {
  CHECKF(hVSurface->pPalette != NULL);

  DDGetPaletteEntries((LPDIRECTDRAWPALETTE)hVSurface->pPalette, 0, 0, 256, (PALETTEENTRY *)pPalette);

  return TRUE;
}

function DeleteVideoSurfaceFromIndex(uiIndex: UINT32): BOOLEAN {
  let curr: Pointer<VSURFACE_NODE>;

  curr = gpVSurfaceHead;
  while (curr) {
    if (curr->uiIndex == uiIndex) {
      // Found the node, so detach it and delete it.

      // Deallocate the memory for the video surface
      DeleteVideoSurface(curr->hVSurface);

      if (curr == gpVSurfaceHead) {
        // Advance the head, because we are going to remove the head node.
        gpVSurfaceHead = gpVSurfaceHead->next;
      }
      if (curr == gpVSurfaceTail) {
        // Back up the tail, because we are going to remove the tail node.
        gpVSurfaceTail = gpVSurfaceTail->prev;
      }
      // Detach the node from the vsurface list
      if (curr->next) {
        // Make the prev node point to the next
        curr->next->prev = curr->prev;
      }
      if (curr->prev) {
        // Make the next node point to the prev
        curr->prev->next = curr->next;
      }
      // The node is now detached.  Now deallocate it.

      MemFree(curr);
      guiVSurfaceSize--;
      return TRUE;
    }
    curr = curr->next;
  }
  return FALSE;
}

// Deletes all palettes, surfaces and region data
function DeleteVideoSurface(hVSurface: HVSURFACE): BOOLEAN {
  let lpDDSurface: LPDIRECTDRAWSURFACE2;

  // Assertions
  CHECKF(hVSurface != NULL);

  // Release palette
  if (hVSurface->pPalette != NULL) {
    DDReleasePalette((LPDIRECTDRAWPALETTE)hVSurface->pPalette);
    hVSurface->pPalette = NULL;
  }

  // if ( hVSurface->pClipper != NULL )
  //{
  // Release Clipper
  //	DDReleaseClipper( (LPDIRECTDRAWCLIPPER)hVSurface->pClipper );
  //}

  // Get surface pointer
  lpDDSurface = (LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData;

  // Release surface
  if (hVSurface->pSurfaceData1 != NULL) {
    DDReleaseSurface(&(LPDIRECTDRAWSURFACE)hVSurface->pSurfaceData1, &lpDDSurface);
  }

  // Release backup surface
  if (hVSurface->pSavedSurfaceData != NULL) {
    DDReleaseSurface(&(LPDIRECTDRAWSURFACE)hVSurface->pSavedSurfaceData1, &(LPDIRECTDRAWSURFACE2)hVSurface->pSavedSurfaceData);
  }

  // Release region data
  DeleteList(hVSurface->RegionList);

  // If there is a 16bpp palette, free it
  if (hVSurface->p16BPPPalette != NULL) {
    MemFree(hVSurface->p16BPPPalette);
    hVSurface->p16BPPPalette = NULL;
  }

  giMemUsedInSurfaces -= (hVSurface->usHeight * hVSurface->usWidth * (hVSurface->ubBitDepth / 8));

  // Release object
  MemFree(hVSurface);

  return TRUE;
}

// ********************************************************
//
// Clipper manipulation functions
//
// ********************************************************

function SetClipList(hVSurface: HVSURFACE, RegionData: Pointer<SGPRect>, usNumRegions: UINT16): BOOLEAN {
  RGNDATA *pRgnData;
  let cnt: UINT16;
  let aRect: RECT;
  let lpDD2Object: LPDIRECTDRAW2;

  // Get Direct Draw Object
  lpDD2Object = GetDirectDraw2Object();

  // Assertions
  Assert(hVSurface != NULL);
  Assert(RegionData != NULL);

  // Varifications
  CHECKF(usNumRegions > 0);

  // If Clipper already created, release
  if (hVSurface->pClipper != NULL) {
    // Release Clipper
    DDReleaseClipper((LPDIRECTDRAWCLIPPER)hVSurface->pClipper);
  }

  // Create Clipper Object
  DDCreateClipper(lpDD2Object, 0, &((LPDIRECTDRAWCLIPPER)hVSurface->pClipper));

  // Allocate region data
  pRgnData = (LPRGNDATA)MemAlloc(sizeof(RGNDATAHEADER) + (usNumRegions * sizeof(RECT)));
  CHECKF(pRgnData);

  // Setup header
  pRgnData->rdh.dwSize = sizeof(RGNDATA);
  pRgnData->rdh.iType = RDH_RECTANGLES;
  pRgnData->rdh.nCount = usNumRegions;
  pRgnData->rdh.nRgnSize = usNumRegions * sizeof(RECT);
  pRgnData->rdh.rcBound.top = 0;
  pRgnData->rdh.rcBound.left = 0;
  pRgnData->rdh.rcBound.bottom = (int)hVSurface->usHeight;
  pRgnData->rdh.rcBound.right = (int)hVSurface->usWidth;

  // Copy rectangles into region
  for (cnt = 0; cnt < usNumRegions; cnt++) {
    aRect.top = (UINT32)RegionData[cnt].iTop;
    aRect.left = (UINT32)RegionData[cnt].iLeft;
    aRect.bottom = (UINT32)RegionData[cnt].iBottom;
    aRect.right = (UINT32)RegionData[cnt].iRight;

    memcpy(pRgnData + sizeof(RGNDATAHEADER) + (cnt * sizeof(RECT)), &aRect, sizeof(RECT));
  }

  // Set items into clipper
  DDSetClipperList((LPDIRECTDRAWCLIPPER)hVSurface->pClipper, pRgnData, 0);

  // Set Clipper into Surface
  DDSetClipper((LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData, (LPDIRECTDRAWCLIPPER)hVSurface->pClipper);

  // Delete region data
  MemFree(pRgnData);

  return TRUE;
}

// ********************************************************
//
// Region manipulation functions
//
// ********************************************************

function GetNumRegions(hVSurface: HVSURFACE, puiNumRegions: Pointer<UINT32>): BOOLEAN {
  Assert(hVSurface);

  *puiNumRegions = ListSize(hVSurface->RegionList);

  return TRUE;
}

function AddVSurfaceRegion(hVSurface: HVSURFACE, pNewRegion: Pointer<VSURFACE_REGION>): BOOLEAN {
  Assert(hVSurface != NULL);
  Assert(pNewRegion != NULL);

  // Add new region to list
  hVSurface->RegionList = AddtoList(hVSurface->RegionList, pNewRegion, ListSize(hVSurface->RegionList));

  return TRUE;
}

// Add a group of regions
function AddVSurfaceRegions(hVSurface: HVSURFACE, ppNewRegions: Pointer<Pointer<VSURFACE_REGION>>, uiNumRegions: UINT16): BOOLEAN {
  let cnt: UINT16;

  Assert(hVSurface != NULL);
  Assert(ppNewRegions != NULL);

  for (cnt = 0; cnt < uiNumRegions; cnt++) {
    AddVSurfaceRegion(hVSurface, ppNewRegions[cnt]);
  }

  return TRUE;
}

function RemoveVSurfaceRegion(hVSurface: HVSURFACE, usIndex: UINT16): BOOLEAN {
  let aRegion: VSURFACE_REGION;

  Assert(hVSurface != NULL);

  return RemfromList(hVSurface->RegionList, &aRegion, usIndex);
}

function ClearAllVSurfaceRegions(hVSurface: HVSURFACE): BOOLEAN {
  let uiListSize: UINT32;
  let cnt: UINT32;

  Assert(hVSurface != NULL);

  uiListSize = ListSize(hVSurface->RegionList);

  for (cnt = uiListSize - 1; cnt >= 0; cnt--) {
    RemoveVSurfaceRegion(hVSurface, (UINT16)cnt);
  }

  return TRUE;
}

function GetVSurfaceRegion(hVSurface: HVSURFACE, usIndex: UINT16, aRegion: Pointer<VSURFACE_REGION>): BOOLEAN {
  Assert(hVSurface != NULL);

  if (!PeekList(hVSurface->RegionList, aRegion, usIndex)) {
    return FALSE;
  }

  return TRUE;
}

function GetVSurfaceRect(hVSurface: HVSURFACE, pRect: Pointer<RECT>): BOOLEAN {
  Assert(hVSurface != NULL);
  Assert(pRect != NULL);

  pRect->left = 0;
  pRect->top = 0;
  pRect->right = hVSurface->usWidth;
  pRect->bottom = hVSurface->usHeight;

  return TRUE;
}

function ReplaceVSurfaceRegion(hVSurface: HVSURFACE, usIndex: UINT16, aRegion: Pointer<VSURFACE_REGION>): BOOLEAN {
  let OldRegion: VSURFACE_REGION;

  Assert(hVSurface != NULL);

  // Validate index given
  if (!PeekList(hVSurface->RegionList, &OldRegion, usIndex)) {
    return FALSE;
  }

  // Replace information
  hVSurface->RegionList = AddtoList(hVSurface->RegionList, aRegion, usIndex);

  return TRUE;
}

function AddVSurfaceRegionAtIndex(hVSurface: HVSURFACE, usIndex: UINT16, pNewRegion: Pointer<VSURFACE_REGION>): BOOLEAN {
  Assert(hVSurface != NULL);
  Assert(pNewRegion != NULL);

  // Add new region to list
  hVSurface->RegionList = AddtoList(hVSurface->RegionList, pNewRegion, usIndex);

  return TRUE;
}

// *******************************************************************
//
// Blitting Functions
//
// *******************************************************************

// Blt  will use DD Blt or BltFast depending on flags.
// Will drop down into user-defined blitter if 8->16 BPP blitting is being done

function BltVideoSurfaceToVideoSurface(hDestVSurface: HVSURFACE, hSrcVSurface: HVSURFACE, usIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: INT32, pBltFx: Pointer<blt_vs_fx>): BOOLEAN {
  let aRegion: VSURFACE_REGION;
  let SrcRect: RECT;
  let DestRect: RECT;
  let pSrcSurface8: Pointer<UINT8>;
  let pDestSurface8: Pointer<UINT8>;
  let pDestSurface16: Pointer<UINT16>;
  let pSrcSurface16: Pointer<UINT16>;
  let uiSrcPitch: UINT32;
  let uiDestPitch: UINT32;
  let uiWidth: UINT32;
  let uiHeight: UINT32;

  // Assertions
  Assert(hDestVSurface != NULL);

  // Check that both region and subrect are not given
  if ((fBltFlags & VS_BLT_SRCREGION) && (fBltFlags & VS_BLT_SRCSUBRECT)) {
    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Inconsistant blit flags given"));
    return FALSE;
  }

  // Check for dest src options
  if (fBltFlags & VS_BLT_DESTREGION) {
    CHECKF(pBltFx != NULL);
    CHECKF(GetVSurfaceRegion(hDestVSurface, pBltFx->DestRegion, &aRegion));

    // Set starting coordinates from destination region
    iDestY = aRegion.RegionCoords.iTop;
    iDestX = aRegion.RegionCoords.iLeft;
  }

  // Check for fill, if true, fill entire region with color
  if (fBltFlags & VS_BLT_COLORFILL) {
    return FillSurface(hDestVSurface, pBltFx);
  }

  // Check for colorfill rectangle
  if (fBltFlags & VS_BLT_COLORFILLRECT) {
    return FillSurfaceRect(hDestVSurface, pBltFx);
  }

  // Check for source coordinate options - from region, specific rect or full src dimensions
  do {
    // Get Region from index, if specified
    if (fBltFlags & VS_BLT_SRCREGION) {
      CHECKF(GetVSurfaceRegion(hSrcVSurface, usIndex, &aRegion))

      SrcRect.top = (int)aRegion.RegionCoords.iTop;
      SrcRect.left = (int)aRegion.RegionCoords.iLeft;
      SrcRect.bottom = (int)aRegion.RegionCoords.iBottom;
      SrcRect.right = (int)aRegion.RegionCoords.iRight;
      break;
    }

    // Use SUBRECT if specified
    if (fBltFlags & VS_BLT_SRCSUBRECT) {
      let aSubRect: SGPRect;

      CHECKF(pBltFx != NULL);

      aSubRect = pBltFx->SrcRect;

      SrcRect.top = (int)aSubRect.iTop;
      SrcRect.left = (int)aSubRect.iLeft;
      SrcRect.bottom = (int)aSubRect.iBottom;
      SrcRect.right = (int)aSubRect.iRight;

      break;
    }

    // Here, use default, which is entire Video Surface
    // Check Sizes, SRC size MUST be <= DEST size
    if (hDestVSurface->usHeight < hSrcVSurface->usHeight) {
      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Incompatible height size given in Video Surface blit"));
      return FALSE;
    }
    if (hDestVSurface->usWidth < hSrcVSurface->usWidth) {
      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Incompatible height size given in Video Surface blit"));
      return FALSE;
    }

    SrcRect.top = (int)0;
    SrcRect.left = (int)0;
    SrcRect.bottom = (int)hSrcVSurface->usHeight;
    SrcRect.right = (int)hSrcVSurface->usWidth;
  } while (FALSE);

  // Once here, assert valid Src
  Assert(hSrcVSurface != NULL);

  // clipping -- added by DB
  GetVSurfaceRect(hDestVSurface, &DestRect);
  uiWidth = SrcRect.right - SrcRect.left;
  uiHeight = SrcRect.bottom - SrcRect.top;

  // check for position entirely off the screen
  if (iDestX >= DestRect.right)
    return FALSE;
  if (iDestY >= DestRect.bottom)
    return FALSE;
  if ((iDestX + (INT32)uiWidth) < (INT32)DestRect.left)
    return FALSE;
  if ((iDestY + (INT32)uiHeight) < (INT32)DestRect.top)
    return FALSE;

  // DB The mirroring stuff has to do it's own clipping because
  // it needs to invert some of the numbers
  if (!(fBltFlags & VS_BLT_MIRROR_Y)) {
    if ((iDestX + (INT32)uiWidth) >= (INT32)DestRect.right) {
      SrcRect.right -= ((iDestX + uiWidth) - DestRect.right);
      uiWidth -= ((iDestX + uiWidth) - DestRect.right);
    }
    if ((iDestY + (INT32)uiHeight) >= (INT32)DestRect.bottom) {
      SrcRect.bottom -= ((iDestY + uiHeight) - DestRect.bottom);
      uiHeight -= ((iDestY + uiHeight) - DestRect.bottom);
    }
    if (iDestX < DestRect.left) {
      SrcRect.left += (DestRect.left - iDestX);
      uiWidth -= (DestRect.left - iDestX);
      iDestX = DestRect.left;
    }
    if (iDestY < (INT32)DestRect.top) {
      SrcRect.top += (DestRect.top - iDestY);
      uiHeight -= (DestRect.top - iDestY);
      iDestY = DestRect.top;
    }
  }

  // Send dest position, rectangle, etc to DD bltfast function
  // First check BPP values for compatibility
  if (hDestVSurface->ubBitDepth == 16 && hSrcVSurface->ubBitDepth == 16) {
    if (fBltFlags & VS_BLT_MIRROR_Y) {
      if ((pSrcSurface16 = (UINT16 *)LockVideoSurfaceBuffer(hSrcVSurface, &uiSrcPitch)) == NULL) {
        DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Failed on lock of 16BPP surface for blitting"));
        return FALSE;
      }

      if ((pDestSurface16 = (UINT16 *)LockVideoSurfaceBuffer(hDestVSurface, &uiDestPitch)) == NULL) {
        UnLockVideoSurfaceBuffer(hSrcVSurface);
        DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Failed on lock of 16BPP dest surface for blitting"));
        return FALSE;
      }

      Blt16BPPTo16BPPMirror(pDestSurface16, uiDestPitch, pSrcSurface16, uiSrcPitch, iDestX, iDestY, SrcRect.left, SrcRect.top, uiWidth, uiHeight);
      UnLockVideoSurfaceBuffer(hSrcVSurface);
      UnLockVideoSurfaceBuffer(hDestVSurface);
      return TRUE;
    }
// For testing with non-DDraw blitting, uncomment to test -- DB

    CHECKF(BltVSurfaceUsingDD(hDestVSurface, hSrcVSurface, fBltFlags, iDestX, iDestY, &SrcRect));
  } else if (hDestVSurface->ubBitDepth == 8 && hSrcVSurface->ubBitDepth == 8) {
    if ((pSrcSurface8 = (UINT8 *)LockVideoSurfaceBuffer(hSrcVSurface, &uiSrcPitch)) == NULL) {
      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Failed on lock of 8BPP surface for blitting"));
      return FALSE;
    }

    if ((pDestSurface8 = (UINT8 *)LockVideoSurfaceBuffer(hDestVSurface, &uiDestPitch)) == NULL) {
      UnLockVideoSurfaceBuffer(hSrcVSurface);
      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Failed on lock of 8BPP dest surface for blitting"));
      return FALSE;
    }

    // Blt8BPPDataTo8BPPBuffer( UINT8 *pBuffer, UINT32 uiDestPitchBYTES, HVOBJECT hSrcVObject, INT32 iX, INT32 iY, UINT16 usIndex );
    Blt8BPPTo8BPP(pDestSurface8, uiDestPitch, pSrcSurface8, uiSrcPitch, iDestX, iDestY, SrcRect.left, SrcRect.top, uiWidth, uiHeight);
    UnLockVideoSurfaceBuffer(hSrcVSurface);
    UnLockVideoSurfaceBuffer(hDestVSurface);
    return TRUE;
  } else {
    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, String("Incompatible BPP values with src and dest Video Surfaces for blitting"));
    return FALSE;
  }

  return TRUE;
}

// ******************************************************************************************
//
// UTILITY FUNCTIONS
//
// ******************************************************************************************

// Blt to backup buffer
function UpdateBackupSurface(hVSurface: HVSURFACE): BOOLEAN {
  let aRect: RECT;

  // Assertions
  Assert(hVSurface != NULL);

  // Validations
  CHECKF(hVSurface->pSavedSurfaceData != NULL);

  aRect.top = (int)0;
  aRect.left = (int)0;
  aRect.bottom = (int)hVSurface->usHeight;
  aRect.right = (int)hVSurface->usWidth;

  // Copy all contents into backup buffer
  DDBltFastSurface((LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData, 0, 0, (LPDIRECTDRAWSURFACE2)hVSurface->pSavedSurfaceData, &aRect, DDBLTFAST_NOCOLORKEY);

  return TRUE;
}

// *****************************************************************************
//
// Private DirectDraw manipulation functions
//
// *****************************************************************************

function GetVideoSurfaceDDSurface(hVSurface: HVSURFACE): LPDIRECTDRAWSURFACE2 {
  Assert(hVSurface != NULL);

  return (LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData;
}

function GetVideoSurfaceDDSurfaceOne(hVSurface: HVSURFACE): LPDIRECTDRAWSURFACE {
  Assert(hVSurface != NULL);

  return (LPDIRECTDRAWSURFACE)hVSurface->pSurfaceData1;
}

function GetVideoSurfaceDDPalette(hVSurface: HVSURFACE): LPDIRECTDRAWPALETTE {
  Assert(hVSurface != NULL);

  return (LPDIRECTDRAWPALETTE)hVSurface->pPalette;
}

function CreateVideoSurfaceFromDDSurface(lpDDSurface: LPDIRECTDRAWSURFACE2): HVSURFACE {
  // Create Video Surface
  let PixelFormat: DDPIXELFORMAT;
  let hVSurface: HVSURFACE;
  let DDSurfaceDesc: DDSURFACEDESC;
  let pDDPalette: LPDIRECTDRAWPALETTE;
  let SGPPalette: SGPPaletteEntry[] /* [256] */;
  let ReturnCode: HRESULT;

  // Allocate Video Surface struct
  hVSurface = MemAlloc(sizeof(SGPVSurface));

  // Set values based on DD Surface given
  DDGetSurfaceDescription(lpDDSurface, &DDSurfaceDesc);
  PixelFormat = DDSurfaceDesc.ddpfPixelFormat;

  hVSurface->usHeight = (UINT16)DDSurfaceDesc.dwHeight;
  hVSurface->usWidth = (UINT16)DDSurfaceDesc.dwWidth;
  hVSurface->ubBitDepth = (UINT8)PixelFormat.dwRGBBitCount;
  hVSurface->pSurfaceData = (PTR)lpDDSurface;
  hVSurface->pSurfaceData1 = NULL;
  hVSurface->pSavedSurfaceData = NULL;
  hVSurface->RegionList = CreateList(DEFAULT_NUM_REGIONS, sizeof(VSURFACE_REGION));
  hVSurface->fFlags = 0;

  // Get and Set palette, if attached, allow to fail
  ReturnCode = IDirectDrawSurface2_GetPalette(lpDDSurface, &pDDPalette);

  if (ReturnCode == DD_OK) {
    // Set 8-bit Palette and 16 BPP palette
    hVSurface->pPalette = pDDPalette;

    // Create 16-BPP Palette
    DDGetPaletteEntries(pDDPalette, 0, 0, 256, (LPPALETTEENTRY)SGPPalette);
    hVSurface->p16BPPPalette = Create16BPPPalette(SGPPalette);
  } else {
    hVSurface->pPalette = NULL;
    hVSurface->p16BPPPalette = NULL;
  }
  // Set meory flags
  if (DDSurfaceDesc.ddsCaps.dwCaps & DDSCAPS_SYSTEMMEMORY) {
    hVSurface->fFlags |= VSURFACE_SYSTEM_MEM_USAGE;
  }

  if (DDSurfaceDesc.ddsCaps.dwCaps & DDSCAPS_VIDEOMEMORY) {
    hVSurface->fFlags |= VSURFACE_VIDEO_MEM_USAGE;
  }

  // All is well
  DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_0, String("Success in Creating Video Surface from DD Surface"));

  return hVSurface;
}

function GetPrimaryVideoSurface(): HVSURFACE {
  return ghPrimary;
}

function GetBackBufferVideoSurface(): HVSURFACE {
  return ghBackBuffer;
}

function GetFrameBufferVideoSurface(): HVSURFACE {
  return ghFrameBuffer;
}

function GetMouseBufferVideoSurface(): HVSURFACE {
  return ghMouseBuffer;
}

// UTILITY FUNCTIONS FOR BLITTING

function ClipReleatedSrcAndDestRectangles(hDestVSurface: HVSURFACE, hSrcVSurface: HVSURFACE, DestRect: Pointer<RECT>, SrcRect: Pointer<RECT>): BOOLEAN {
  Assert(hDestVSurface != NULL);
  Assert(hSrcVSurface != NULL);

  // Check for invalid start positions and clip by ignoring blit
  if (DestRect->left >= hDestVSurface->usWidth || DestRect->top >= hDestVSurface->usHeight) {
    return FALSE;
  }

  if (SrcRect->left >= hSrcVSurface->usWidth || SrcRect->top >= hSrcVSurface->usHeight) {
    return FALSE;
  }

  // For overruns
  // Clip destination rectangles
  if (DestRect->right > hDestVSurface->usWidth) {
    // Both have to be modified or by default streching occurs
    DestRect->right = hDestVSurface->usWidth;
    SrcRect->right = SrcRect->left + (DestRect->right - DestRect->left);
  }
  if (DestRect->bottom > hDestVSurface->usHeight) {
    // Both have to be modified or by default streching occurs
    DestRect->bottom = hDestVSurface->usHeight;
    SrcRect->bottom = SrcRect->top + (DestRect->bottom - DestRect->top);
  }

  // Clip src rectangles
  if (SrcRect->right > hSrcVSurface->usWidth) {
    // Both have to be modified or by default streching occurs
    SrcRect->right = hSrcVSurface->usWidth;
    DestRect->right = DestRect->left + (SrcRect->right - SrcRect->left);
  }
  if (SrcRect->bottom > hSrcVSurface->usHeight) {
    // Both have to be modified or by default streching occurs
    SrcRect->bottom = hSrcVSurface->usHeight;
    DestRect->bottom = DestRect->top + (SrcRect->bottom - SrcRect->top);
  }

  // For underruns
  // Clip destination rectangles
  if (DestRect->left < 0) {
    // Both have to be modified or by default streching occurs
    DestRect->left = 0;
    SrcRect->left = SrcRect->right - (DestRect->right - DestRect->left);
  }
  if (DestRect->top < 0) {
    // Both have to be modified or by default streching occurs
    DestRect->top = 0;
    SrcRect->top = SrcRect->bottom - (DestRect->bottom - DestRect->top);
  }

  // Clip src rectangles
  if (SrcRect->left < 0) {
    // Both have to be modified or by default streching occurs
    SrcRect->left = 0;
    DestRect->left = DestRect->right - (SrcRect->right - SrcRect->left);
  }
  if (SrcRect->top < 0) {
    // Both have to be modified or by default streching occurs
    SrcRect->top = 0;
    DestRect->top = DestRect->bottom - (SrcRect->bottom - SrcRect->top);
  }

  return TRUE;
}

function FillSurface(hDestVSurface: HVSURFACE, pBltFx: Pointer<blt_vs_fx>): BOOLEAN {
  let BlitterFX: DDBLTFX;

  Assert(hDestVSurface != NULL);
  CHECKF(pBltFx != NULL);

  BlitterFX.dwSize = sizeof(DDBLTFX);
  BlitterFX.dwFillColor = pBltFx->ColorFill;

  DDBltSurface((LPDIRECTDRAWSURFACE2)hDestVSurface->pSurfaceData, NULL, NULL, NULL, DDBLT_COLORFILL, &BlitterFX);

  if (hDestVSurface->fFlags & VSURFACE_VIDEO_MEM_USAGE && !hDestVSurface->fFlags & VSURFACE_RESERVED_SURFACE) {
    UpdateBackupSurface(hDestVSurface);
  }

  return TRUE;
}

function FillSurfaceRect(hDestVSurface: HVSURFACE, pBltFx: Pointer<blt_vs_fx>): BOOLEAN {
  let BlitterFX: DDBLTFX;

  Assert(hDestVSurface != NULL);
  CHECKF(pBltFx != NULL);

  BlitterFX.dwSize = sizeof(DDBLTFX);
  BlitterFX.dwFillColor = pBltFx->ColorFill;

  DDBltSurface((LPDIRECTDRAWSURFACE2)hDestVSurface->pSurfaceData, (LPRECT) & (pBltFx->FillRect), NULL, NULL, DDBLT_COLORFILL, &BlitterFX);

  if (hDestVSurface->fFlags & VSURFACE_VIDEO_MEM_USAGE && !hDestVSurface->fFlags & VSURFACE_RESERVED_SURFACE) {
    UpdateBackupSurface(hDestVSurface);
  }

  return TRUE;
}

function BltVSurfaceUsingDD(hDestVSurface: HVSURFACE, hSrcVSurface: HVSURFACE, fBltFlags: UINT32, iDestX: INT32, iDestY: INT32, SrcRect: Pointer<RECT>): BOOLEAN {
  let uiDDFlags: UINT32;
  let DestRect: RECT;

  // Blit using the correct blitter
  if (fBltFlags & VS_BLT_FAST) {
    // Validations
    CHECKF(iDestX >= 0);
    CHECKF(iDestY >= 0);

    // Default flags
    uiDDFlags = 0;

    // Convert flags into DD flags, ( for transparency use, etc )
    if (fBltFlags & VS_BLT_USECOLORKEY) {
      uiDDFlags |= DDBLTFAST_SRCCOLORKEY;
    }

    // Convert flags into DD flags, ( for transparency use, etc )
    if (fBltFlags & VS_BLT_USEDESTCOLORKEY) {
      uiDDFlags |= DDBLTFAST_DESTCOLORKEY;
    }

    if (uiDDFlags == 0) {
      // Default here is no colorkey
      uiDDFlags = DDBLTFAST_NOCOLORKEY;
    }

    DDBltFastSurface((LPDIRECTDRAWSURFACE2)hDestVSurface->pSurfaceData, iDestX, iDestY, (LPDIRECTDRAWSURFACE2)hSrcVSurface->pSurfaceData, SrcRect, uiDDFlags);
  } else {
    // Normal, specialized blit for clipping, etc

    // Default flags
    uiDDFlags = DDBLT_WAIT;

    // Convert flags into DD flags, ( for transparency use, etc )
    if (fBltFlags & VS_BLT_USECOLORKEY) {
      uiDDFlags |= DDBLT_KEYSRC;
    }

    // Setup dest rectangle
    DestRect.top = (int)iDestY;
    DestRect.left = (int)iDestX;
    DestRect.bottom = (int)iDestY + (SrcRect->bottom - SrcRect->top);
    DestRect.right = (int)iDestX + (SrcRect->right - SrcRect->left);

    // Do Clipping of rectangles
    if (!ClipReleatedSrcAndDestRectangles(hDestVSurface, hSrcVSurface, &DestRect, SrcRect)) {
      // Returns false because dest start is > dest size
      return TRUE;
    }

    // Check values for 0 size
    if (DestRect.top == DestRect.bottom || DestRect.right == DestRect.left) {
      return TRUE;
    }

    // Check for -ve values

    DDBltSurface((LPDIRECTDRAWSURFACE2)hDestVSurface->pSurfaceData, &DestRect, (LPDIRECTDRAWSURFACE2)hSrcVSurface->pSurfaceData, SrcRect, uiDDFlags, NULL);
  }

  // Update backup surface with new data
  if (hDestVSurface->fFlags & VSURFACE_VIDEO_MEM_USAGE && !hDestVSurface->fFlags & VSURFACE_RESERVED_SURFACE) {
    UpdateBackupSurface(hDestVSurface);
  }

  return TRUE;
}

function InternalShadowVideoSurfaceRect(uiDestVSurface: UINT32, X1: INT32, Y1: INT32, X2: INT32, Y2: INT32, fLowPercentShadeTable: BOOLEAN): BOOLEAN {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let area: SGPRect;
  let hVSurface: HVSURFACE;

  // CLIP IT!
  // FIRST GET SURFACE

  //
  // Get Video Surface
  //
  CHECKF(GetVideoSurface(&hVSurface, uiDestVSurface));

  if (X1 < 0)
    X1 = 0;

  if (X2 < 0)
    return FALSE;

  if (Y2 < 0)
    return FALSE;

  if (Y1 < 0)
    Y1 = 0;

  if (X2 >= hVSurface->usWidth)
    X2 = hVSurface->usWidth - 1;

  if (Y2 >= hVSurface->usHeight)
    Y2 = hVSurface->usHeight - 1;

  if (X1 >= hVSurface->usWidth)
    return FALSE;

  if (Y1 >= hVSurface->usHeight)
    return FALSE;

  if ((X2 - X1) <= 0)
    return FALSE;

  if ((Y2 - Y1) <= 0)
    return FALSE;

  area.iTop = Y1;
  area.iBottom = Y2;
  area.iLeft = X1;
  area.iRight = X2;

  // Lock video surface
  pBuffer = (UINT16 *)LockVideoSurface(uiDestVSurface, &uiPitch);
  // UnLockVideoSurface( uiDestVSurface );

  if (pBuffer == NULL) {
    return FALSE;
  }

  if (!fLowPercentShadeTable) {
    // Now we have the video object and surface, call the shadow function
    if (!Blt16BPPBufferShadowRect(pBuffer, uiPitch, &area)) {
      // Blit has failed if false returned
      return FALSE;
    }
  } else {
    // Now we have the video object and surface, call the shadow function
    if (!Blt16BPPBufferShadowRectAlternateTable(pBuffer, uiPitch, &area)) {
      // Blit has failed if false returned
      return FALSE;
    }
  }

  // Mark as dirty if it's the backbuffer
  // if ( uiDestVSurface == BACKBUFFER )
  //{
  //	InvalidateBackbuffer( );
  //}

  UnLockVideoSurface(uiDestVSurface);
  return TRUE;
}

function ShadowVideoSurfaceRect(uiDestVSurface: UINT32, X1: INT32, Y1: INT32, X2: INT32, Y2: INT32): BOOLEAN {
  return InternalShadowVideoSurfaceRect(uiDestVSurface, X1, Y1, X2, Y2, FALSE);
}

function ShadowVideoSurfaceRectUsingLowPercentTable(uiDestVSurface: UINT32, X1: INT32, Y1: INT32, X2: INT32, Y2: INT32): BOOLEAN {
  return InternalShadowVideoSurfaceRect(uiDestVSurface, X1, Y1, X2, Y2, TRUE);
}

//
// BltVSurfaceUsingDDBlt will always use Direct Draw Blt,NOT BltFast
function BltVSurfaceUsingDDBlt(hDestVSurface: HVSURFACE, hSrcVSurface: HVSURFACE, fBltFlags: UINT32, iDestX: INT32, iDestY: INT32, SrcRect: Pointer<RECT>, DestRect: Pointer<RECT>): BOOLEAN {
  let uiDDFlags: UINT32;

  // Default flags
  uiDDFlags = DDBLT_WAIT;

  // Convert flags into DD flags, ( for transparency use, etc )
  if (fBltFlags & VS_BLT_USECOLORKEY) {
    uiDDFlags |= DDBLT_KEYSRC;
  }

  DDBltSurface((LPDIRECTDRAWSURFACE2)hDestVSurface->pSurfaceData, DestRect, (LPDIRECTDRAWSURFACE2)hSrcVSurface->pSurfaceData, SrcRect, uiDDFlags, NULL);

  // Update backup surface with new data
  if (hDestVSurface->fFlags & VSURFACE_VIDEO_MEM_USAGE && !hDestVSurface->fFlags & VSURFACE_RESERVED_SURFACE) {
    UpdateBackupSurface(hDestVSurface);
  }

  return TRUE;
}

//
// This function will stretch the source image to the size of the dest rect.
//
// If the 2 images are not 16 Bpp, it returns false.
//
function BltStretchVideoSurface(uiDestVSurface: UINT32, uiSrcVSurface: UINT32, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, SrcRect: Pointer<SGPRect>, DestRect: Pointer<SGPRect>): BOOLEAN {
  let hDestVSurface: HVSURFACE;
  let hSrcVSurface: HVSURFACE;

  if (!GetVideoSurface(&hDestVSurface, uiDestVSurface)) {
    return FALSE;
  }
  if (!GetVideoSurface(&hSrcVSurface, uiSrcVSurface)) {
    return FALSE;
  }

  // if the 2 images are not both 16bpp, return FALSE
  if ((hDestVSurface->ubBitDepth != 16) && (hSrcVSurface->ubBitDepth != 16))
    return FALSE;

  if (!BltVSurfaceUsingDDBlt(hDestVSurface, hSrcVSurface, fBltFlags, iDestX, iDestY, (RECT *)SrcRect, (RECT *)DestRect)) {
    //
    // VO Blitter will set debug messages for error conditions
    //

    return FALSE;
  }

  return TRUE;
}

function ShadowVideoSurfaceImage(uiDestVSurface: UINT32, hImageHandle: HVOBJECT, iPosX: INT32, iPosY: INT32): BOOLEAN {
  // Horizontal shadow
  ShadowVideoSurfaceRect(uiDestVSurface, iPosX + 3, iPosY + hImageHandle->pETRLEObject->usHeight, iPosX + hImageHandle->pETRLEObject->usWidth, iPosY + hImageHandle->pETRLEObject->usHeight + 3);

  // vertical shadow
  ShadowVideoSurfaceRect(uiDestVSurface, iPosX + hImageHandle->pETRLEObject->usWidth, iPosY + 3, iPosX + hImageHandle->pETRLEObject->usWidth + 3, iPosY + hImageHandle->pETRLEObject->usHeight);
  return TRUE;
}

function MakeVSurfaceFromVObject(uiVObject: UINT32, usSubIndex: UINT16, puiVSurface: Pointer<UINT32>): BOOLEAN {
  let hSrcVObject: HVOBJECT;
  let uiVSurface: UINT32;
  let hDesc: VSURFACE_DESC;

  if (GetVideoObject(&hSrcVObject, uiVObject)) {
    // ATE: Memset
    memset(&hDesc, 0, sizeof(VSURFACE_DESC));
    hDesc.fCreateFlags = VSURFACE_CREATE_DEFAULT;
    hDesc.usWidth = hSrcVObject->pETRLEObject[usSubIndex].usWidth;
    hDesc.usHeight = hSrcVObject->pETRLEObject[usSubIndex].usHeight;
    hDesc.ubBitDepth = PIXEL_DEPTH;

    if (AddVideoSurface(&hDesc, &uiVSurface)) {
      if (BltVideoObjectFromIndex(uiVSurface, uiVObject, usSubIndex, 0, 0, VO_BLT_SRCTRANSPARENCY, NULL)) {
        *puiVSurface = uiVSurface;
        return TRUE;
      } else
        DeleteVideoSurfaceFromIndex(uiVSurface);
    }
  }

  return FALSE;
}
