namespace ja2 {

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
  hVSurface: SGPVSurface;
  uiIndex: UINT32;

  next: VSURFACE_NODE | null;
  prev: VSURFACE_NODE | null;
}

function createVSurfaceNode(): VSURFACE_NODE {
  return {
    hVSurface: <SGPVSurface><unknown>null,
    uiIndex: 0,
    next: null,
    prev: null,
  };
}

let gpVSurfaceHead: VSURFACE_NODE | null = null;
let gpVSurfaceTail: VSURFACE_NODE | null = null;
let guiVSurfaceIndex: UINT32 = 0;
let guiVSurfaceSize: UINT32 = 0;
let guiVSurfaceTotalAdded: UINT32 = 0;

export let giMemUsedInSurfaces: INT32;

let ghPrimary: SGPVSurface | null = null;
let ghBackBuffer: SGPVSurface | null = null;
export let ghFrameBuffer: SGPVSurface | null = null;
let ghMouseBuffer: SGPVSurface | null = null;

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface Manager functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

export function InitializeVideoSurfaceManager(): boolean {
  // Shouldn't be calling this if the video surface manager already exists.
  // Call shutdown first...
  Assert(!gpVSurfaceHead);
  Assert(!gpVSurfaceTail);
  RegisterDebugTopic(TOPIC_VIDEOSURFACE, "Video Surface Manager");
  gpVSurfaceHead = gpVSurfaceTail = null;

  giMemUsedInSurfaces = 0;

  // Create primary and backbuffer from globals
  if (!SetPrimaryVideoSurfaces()) {
    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_1, FormatString("Could not create primary surfaces"));
    return false;
  }

  return true;
}

export function ShutdownVideoSurfaceManager(): boolean {
  let curr: VSURFACE_NODE;

  DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_0, "Shutting down the Video Surface manager");

  // Delete primary viedeo surfaces
  DeletePrimaryVideoSurfaces();

  while (gpVSurfaceHead) {
    curr = gpVSurfaceHead;
    gpVSurfaceHead = gpVSurfaceHead.next;
    DeleteVideoSurface(curr.hVSurface);
  }
  gpVSurfaceHead = null;
  gpVSurfaceTail = null;
  guiVSurfaceIndex = 0;
  guiVSurfaceSize = 0;
  guiVSurfaceTotalAdded = 0;
  UnRegisterDebugTopic(TOPIC_VIDEOSURFACE, "Video Objects");
  return true;
}

export function RestoreVideoSurfaces(): boolean {
  let curr: VSURFACE_NODE | null;

  //
  // Loop through Video Surfaces and Restore
  //
  curr = gpVSurfaceTail;
  while (curr) {
    if (!RestoreVideoSurface(curr.hVSurface)) {
      return false;
    }
    curr = curr.prev;
  }
  return true;
}

export function AddStandardVideoSurface(pVSurfaceDesc: VSURFACE_DESC): UINT32 {
  let hVSurface: SGPVSurface;

  // Assertions
  Assert(pVSurfaceDesc);

  // Create video object
  hVSurface = CreateVideoSurface(pVSurfaceDesc);

  if (!hVSurface) {
    // Video Object will set error condition.
    return -1;
  }

  // Set transparency to default
  SetVideoSurfaceTransparencyColor(hVSurface, FROMRGB(0, 0, 0));

  // Set into video object list
  if (gpVSurfaceTail) {
    // Add node after tail
    gpVSurfaceTail.next = createVSurfaceNode();
    gpVSurfaceTail.next.prev = gpVSurfaceTail;
    gpVSurfaceTail.next.next = null;
    gpVSurfaceTail = gpVSurfaceTail.next;
  } else {
    // new list
    gpVSurfaceHead = createVSurfaceNode();
    gpVSurfaceHead.prev = gpVSurfaceHead.next = null;
    gpVSurfaceTail = gpVSurfaceHead;
  }
  // Set the hVSurface into the node.
  gpVSurfaceTail.hVSurface = hVSurface;
  gpVSurfaceTail.uiIndex = guiVSurfaceIndex += 2;
  Assert(guiVSurfaceIndex < 0xfffffff0); // unlikely that we will ever use 2 billion VSurfaces!
  // We would have to create about 70 VSurfaces per second for 1 year straight to achieve this...
  guiVSurfaceSize++;
  guiVSurfaceTotalAdded++;

  return gpVSurfaceTail.uiIndex;
}

export function LockVideoSurface(uiVSurface: UINT32, puiPitch: Pointer<UINT32>): Uint8ClampedArray {
  let curr: VSURFACE_NODE | null;

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
    if (curr.uiIndex == uiVSurface) {
      break;
    }
    curr = curr.next;
  }
  if (!curr) {
    return <Uint8ClampedArray><unknown>null;
  }

  //
  // Lock buffer
  //

  return LockVideoSurfaceBuffer(curr.hVSurface, puiPitch);
}

export function UnLockVideoSurface(uiVSurface: UINT32): void {
  let curr: VSURFACE_NODE | null;

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
    if (curr.uiIndex == uiVSurface) {
      break;
    }
    curr = curr.next;
  }
  if (!curr) {
    return;
  }

  //
  // unlock buffer
  //

  UnLockVideoSurfaceBuffer(curr.hVSurface);
}

export function SetVideoSurfaceTransparency(uiIndex: UINT32, TransColor: COLORVAL): boolean {
  let hVSurface: SGPVSurface;

  //
  // Get Video Surface
  //

  if ((hVSurface = GetVideoSurface(uiIndex)) === null) {
    return false;
  }

  //
  // Set transparency
  //

  SetVideoSurfaceTransparencyColor(hVSurface, TransColor);

  return true;
}

export function GetVideoSurface(uiIndex: UINT32): SGPVSurface {
  let curr: VSURFACE_NODE | null;

  if (uiIndex == PRIMARY_SURFACE) {
    return <SGPVSurface>ghPrimary;
  }

  if (uiIndex == BACKBUFFER) {
    return <SGPVSurface>ghBackBuffer;
  }

  if (uiIndex == FRAME_BUFFER) {
    return <SGPVSurface>ghFrameBuffer;
  }

  if (uiIndex == MOUSE_BUFFER) {
    return <SGPVSurface>ghMouseBuffer;
  }

  curr = gpVSurfaceHead;
  while (curr) {
    if (curr.uiIndex == uiIndex) {
      return curr.hVSurface;
    }
    curr = curr.next;
  }
  return <SGPVSurface><unknown>null;
}

function SetPrimaryVideoSurfaces(): boolean {
  let pSurface: ImageData;

  // Delete surfaces if they exist
  DeletePrimaryVideoSurfaces();

  //
  // Get Primary surface
  //
  pSurface = GetPrimarySurfaceObject();
  if (pSurface == null) {
    return false;
  }

  ghPrimary = CreateVideoSurfaceFromDDSurface(pSurface);
  if (ghPrimary == null) {
    return false;
  }

  //
  // Get Backbuffer surface
  //

  pSurface = GetBackBufferObject();
  if (pSurface == null) {
    return false;
  }

  ghBackBuffer = CreateVideoSurfaceFromDDSurface(pSurface);
  if (ghBackBuffer == null) {
    return false;
  }

  //
  // Get mouse buffer surface
  //
  pSurface = GetMouseBufferObject();
  if (pSurface == null) {
    return false;
  }

  ghMouseBuffer = CreateVideoSurfaceFromDDSurface(pSurface);
  if (ghMouseBuffer == null) {
    return false;
  }

  //
  // Get frame buffer surface
  //

  pSurface = GetFrameBufferObject();
  if (pSurface == null) {
    return false;
  }

  ghFrameBuffer = CreateVideoSurfaceFromDDSurface(pSurface);
  if (ghFrameBuffer == null) {
    return false;
  }

  return true;
}

function DeletePrimaryVideoSurfaces(): void {
  //
  // If globals are not null, delete them
  //

  if (ghPrimary != null) {
    DeleteVideoSurface(ghPrimary);
    ghPrimary = null;
  }

  if (ghBackBuffer != null) {
    DeleteVideoSurface(ghBackBuffer);
    ghBackBuffer = null;
  }

  if (ghFrameBuffer != null) {
    DeleteVideoSurface(ghFrameBuffer);
    ghFrameBuffer = null;
  }

  if (ghMouseBuffer != null) {
    DeleteVideoSurface(ghMouseBuffer);
    ghMouseBuffer = null;
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

export function BltVideoSurface(uiDestVSurface: UINT32, uiSrcVSurface: UINT32, usRegionIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, pBltFx: blt_vs_fx | null): boolean {
  let hDestVSurface: SGPVSurface;
  let hSrcVSurface: SGPVSurface;

  if ((hDestVSurface = GetVideoSurface(uiDestVSurface)) === null) {
    return false;
  }
  if ((hSrcVSurface = GetVideoSurface(uiSrcVSurface)) === null) {
    return false;
  }
  if (!BltVideoSurfaceToVideoSurface(hDestVSurface, hSrcVSurface, usRegionIndex, iDestX, iDestY, fBltFlags, pBltFx)) {
    // VO Blitter will set debug messages for error conditions
    return false;
  }
  return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Fills an rectangular area with a specified color value.
//
///////////////////////////////////////////////////////////////////////////////////////////////////

export function ColorFillVideoSurfaceArea(uiDestVSurface: UINT32, iDestX1: INT32, iDestY1: INT32, iDestX2: INT32, iDestY2: INT32, Color16BPP: UINT16): boolean {
  let BltFx: blt_vs_fx = createBltVsFx();
  let hDestVSurface: SGPVSurface;
  let Clip: SGPRect = createSGPRect();

  if ((hDestVSurface = GetVideoSurface(uiDestVSurface)) === null) {
    return false;
  }

  BltFx.ColorFill = Color16BPP;
  BltFx.DestRegion = 0;

  //
  // Clip fill region coords
  //

  GetClippingRect(Clip);

  if (iDestX1 < Clip.iLeft)
    iDestX1 = Clip.iLeft;

  if (iDestX1 > Clip.iRight)
    return false;

  if (iDestX2 > Clip.iRight)
    iDestX2 = Clip.iRight;

  if (iDestX2 < Clip.iLeft)
    return false;

  if (iDestY1 < Clip.iTop)
    iDestY1 = Clip.iTop;

  if (iDestY1 > Clip.iBottom)
    return false;

  if (iDestY2 > Clip.iBottom)
    iDestY2 = Clip.iBottom;

  if (iDestY2 < Clip.iTop)
    return false;

  if ((iDestX2 <= iDestX1) || (iDestY2 <= iDestY1))
    return false;

  BltFx.SrcRect.iLeft = BltFx.FillRect.iLeft = iDestX1;
  BltFx.SrcRect.iTop = BltFx.FillRect.iTop = iDestY1;
  BltFx.SrcRect.iRight = BltFx.FillRect.iRight = iDestX2;
  BltFx.SrcRect.iBottom = BltFx.FillRect.iBottom = iDestY2;

  return FillSurfaceRect(hDestVSurface, BltFx);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Fills an rectangular area with a specified image value.
//
///////////////////////////////////////////////////////////////////////////////////////////////////

export function ImageFillVideoSurfaceArea(uiDestVSurface: UINT32, iDestX1: INT32, iDestY1: INT32, iDestX2: INT32, iDestY2: INT32, BkgrndImg: SGPVObject, Index: UINT16, Ox: INT16, Oy: INT16): boolean {
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
  let pTrav: ETRLEObject;
  let NewClip: SGPRect = createSGPRect();
  let OldClip: SGPRect = createSGPRect();

  pTrav = BkgrndImg.pETRLEObject[Index];
  ph = (pTrav.usHeight + pTrav.sOffsetY);
  pw = (pTrav.usWidth + pTrav.sOffsetX);

  ah = (iDestY2 - iDestY1);
  aw = (iDestX2 - iDestX1);

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
    return false;

  //
  // Clip fill region coords
  //

  GetClippingRect(OldClip);

  NewClip.iLeft = iDestX1;
  NewClip.iTop = iDestY1;
  NewClip.iRight = iDestX2;
  NewClip.iBottom = iDestY2;

  if (NewClip.iLeft < OldClip.iLeft)
    NewClip.iLeft = OldClip.iLeft;

  if (NewClip.iLeft > OldClip.iRight)
    return false;

  if (NewClip.iRight > OldClip.iRight)
    NewClip.iRight = OldClip.iRight;

  if (NewClip.iRight < OldClip.iLeft)
    return false;

  if (NewClip.iTop < OldClip.iTop)
    NewClip.iTop = OldClip.iTop;

  if (NewClip.iTop > OldClip.iBottom)
    return false;

  if (NewClip.iBottom > OldClip.iBottom)
    NewClip.iBottom = OldClip.iBottom;

  if (NewClip.iBottom < OldClip.iTop)
    return false;

  if ((NewClip.iRight <= NewClip.iLeft) || (NewClip.iBottom <= NewClip.iTop))
    return false;

  SetClippingRect(NewClip);

  yc = iDestY1;
  for (h = 0; h < hblits; h++) {
    xc = iDestX1;
    for (w = 0; w < wblits; w++) {
      BltVideoObject(uiDestVSurface, BkgrndImg, Index, xc + Ox, yc + Oy, VO_BLT_SRCTRANSPARENCY, null);
      xc += pw;
    }
    yc += ph;
  }

  SetClippingRect(OldClip);
  return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Video Surface Manipulation Functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

export function CreateVideoSurface(VSurfaceDesc: VSURFACE_DESC): SGPVSurface {
  let hVSurface: SGPVSurface;
  let hImage: ImageType | null = null;
  let tempRect: SGPRect = createSGPRect();
  let usHeight: UINT16;
  let usWidth: UINT16;
  let ubBitDepth: UINT8;
  let fMemUsage: UINT32;

  //#ifdef JA2
  let uiRBitMask: UINT32;
  let uiGBitMask: UINT32;
  let uiBBitMask: UINT32;
  //#endif

  //
  // The description structure contains memory usage flag
  //
  fMemUsage = VSurfaceDesc.fCreateFlags;

  //
  // Check creation options
  //

  do {
    //
    // Check if creating from file
    //

    if (VSurfaceDesc.fCreateFlags & VSURFACE_CREATE_FROMFILE) {
      //
      // Create himage object from file
      //

      hImage = CreateImage(VSurfaceDesc.ImageFile, IMAGE_ALLIMAGEDATA);

      if (hImage == null) {
        DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, "Invalid Image Filename given");
        return <SGPVSurface><unknown>null;
      }

      //
      // Set values from himage
      //
      usHeight = hImage.usHeight;
      usWidth = hImage.usWidth;
      ubBitDepth = hImage.ubBitDepth;
      break;
    }

    //
    // If here, no special options given,
    // Set values from given description structure
    //

    usHeight = VSurfaceDesc.usHeight;
    usWidth = VSurfaceDesc.usWidth;
    ubBitDepth = VSurfaceDesc.ubBitDepth;
  } while (false);

  //
  // Assertions
  //

  Assert(usHeight > 0);
  Assert(usWidth > 0);

  //
  // Allocate memory for Video Surface data and initialize
  //

  hVSurface = createSGPVSurface();
  hVSurface.usHeight = usHeight;
  hVSurface.usWidth = usWidth;
  hVSurface.ubBitDepth = ubBitDepth;
  hVSurface.pSurfaceData1 = <Uint8ClampedArray><unknown>null;
  hVSurface.pSurfaceData = new Uint8ClampedArray(usHeight * usWidth * (ubBitDepth === 16 ? 4 : 1));
  hVSurface.pSavedSurfaceData1 = <Uint8ClampedArray><unknown>null;
  hVSurface.pSavedSurfaceData = <Uint8ClampedArray><unknown>null;
  hVSurface.pPalette = <SGPPaletteEntry[]><unknown>null;
  hVSurface.p16BPPPalette = <Uint16Array><unknown>null;
  hVSurface.TransparentColor = FROMRGB(0, 0, 0);
  hVSurface.fFlags = 0;
  hVSurface.pClipper = null;

  hVSurface.pSavedSurfaceData1 = <Uint8ClampedArray><unknown>null;
  hVSurface.pSavedSurfaceData = new Uint8ClampedArray(usHeight * usWidth * (ubBitDepth === 16 ? 4 : 1));

  //
  // Initialize surface with hImage , if given
  //

  if (VSurfaceDesc.fCreateFlags & VSURFACE_CREATE_FROMFILE) {
    Assert(hImage);
    tempRect.iLeft = 0;
    tempRect.iTop = 0;
    tempRect.iRight = hImage.usWidth - 1;
    tempRect.iBottom = hImage.usHeight - 1;
    SetVideoSurfaceDataFromHImage(hVSurface, hImage, 0, 0, tempRect);

    //
    // Set palette from himage
    //

    if (hImage.ubBitDepth == 8) {
      SetVideoSurfacePalette(hVSurface, hImage.pPalette);
    }

    //
    // Delete himage object
    //

    DestroyImage(hImage);
  }

  //
  // All is well
  //

  hVSurface.usHeight = usHeight;
  hVSurface.usWidth = usWidth;
  hVSurface.ubBitDepth = ubBitDepth;

  giMemUsedInSurfaces += (hVSurface.usHeight * hVSurface.usWidth * (hVSurface.ubBitDepth / 8));

  DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_3, FormatString("Success in Creating Video Surface"));

  return hVSurface;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Called when surface is lost, for the most part called by utility functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

function RestoreVideoSurface(hVSurface: SGPVSurface): boolean {
  Assert(hVSurface != null);

  hVSurface.pSurfaceData.set(hVSurface.pSavedSurfaceData);

  return true;
}

// Lock must be followed by release
// Pitch MUST be used for all width calculations ( Pitch is in bytes )
// The time between Locking and unlocking must be minimal
function LockVideoSurfaceBuffer(hVSurface: SGPVSurface, pPitch: Pointer<UINT32>): Uint8ClampedArray {
  Assert(hVSurface != null);
  Assert(pPitch != null);

  pPitch.value = hVSurface.usWidth * (hVSurface.ubBitDepth === 16 ? 4 : 1);

  return hVSurface.pSurfaceData;
}

function UnLockVideoSurfaceBuffer(hVSurface: SGPVSurface): void {
  Assert(hVSurface != null);

  // Copy contents if surface is in video
  if (hVSurface.fFlags & VSURFACE_VIDEO_MEM_USAGE && !(hVSurface.fFlags & VSURFACE_RESERVED_SURFACE)) {
    UpdateBackupSurface(hVSurface);
  }
}

// Given an HIMAGE object, blit imagery into existing Video Surface. Can be from 8->16 BPP
function SetVideoSurfaceDataFromHImage(hVSurface: SGPVSurface, hImage: ImageType, usX: UINT16, usY: UINT16, pSrcRect: SGPRect): boolean {
  let pDest: Uint8ClampedArray;
  let fBufferBPP: UINT32 = 0;
  let uiPitch: UINT32 = 0;
  let usEffectiveWidth: UINT16;
  let aRect: SGPRect = createSGPRect();

  // Assertions
  Assert(hVSurface != null);
  Assert(hImage != null);

  // Get Size of hImage and determine if it can fit
  if (hImage.usWidth < hVSurface.usWidth) {
    return false;
  }
  if (hImage.usHeight < hVSurface.usHeight) {
    return false;
  }

  // Check BPP and see if they are the same
  if (hImage.ubBitDepth != hVSurface.ubBitDepth) {
    // They are not the same, but we can go from 8->16 without much cost
    if (hImage.ubBitDepth == 8 && hVSurface.ubBitDepth == 16) {
      fBufferBPP = BUFFER_16BPP;
    }
  } else {
    // Set buffer BPP
    switch (hImage.ubBitDepth) {
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
  pDest = LockVideoSurfaceBuffer(hVSurface, createPointer(() => uiPitch, (v) => uiPitch = v));

  // Effective width ( in PIXELS ) is Pitch ( in bytes ) converted to pitch ( IN PIXELS )
  usEffectiveWidth = (uiPitch / (hVSurface.ubBitDepth / 8));

  if (pDest == null) {
    return false;
  }

  // Blit Surface
  // If rect is NULL, use entrie image size
  if (pSrcRect == null) {
    aRect.iLeft = 0;
    aRect.iTop = 0;
    aRect.iRight = hImage.usWidth;
    aRect.iBottom = hImage.usHeight;
  } else {
    aRect.iLeft = pSrcRect.iLeft;
    aRect.iTop = pSrcRect.iTop;
    aRect.iRight = pSrcRect.iRight;
    aRect.iBottom = pSrcRect.iBottom;
  }

  // This HIMAGE function will transparently copy buffer
  if (!CopyImageToBuffer(hImage, fBufferBPP, pDest, usEffectiveWidth, hVSurface.usHeight, usX, usY, aRect)) {
    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Error Occured Copying HIMAGE to HVSURFACE"));
    UnLockVideoSurfaceBuffer(hVSurface);
    return false;
  }

  // All is OK
  UnLockVideoSurfaceBuffer(hVSurface);

  return true;
}

// Palette setting is expensive, need to set both DDPalette and create 16BPP palette
export function SetVideoSurfacePalette(hVSurface: SGPVSurface, pSrcPalette: SGPPaletteEntry[]): boolean {
  Assert(hVSurface != null);

  // Create palette object if not already done so
  if (hVSurface.pPalette == null) {
    hVSurface.pPalette = createArrayFrom(256, createSGPPaletteEntry);
    copyObjectArray(hVSurface.pPalette, pSrcPalette, copySGPPaletteEntry);

    // Set into surface
    // DDSetSurfacePalette( (LPDIRECTDRAWSURFACE2)hVSurface->pSurfaceData, (LPDIRECTDRAWPALETTE)hVSurface->pPalette );
  } else {
    // Just Change entries
    copyObjectArray(hVSurface.pPalette, pSrcPalette, copySGPPaletteEntry);
  }

  // Delete 16BPP Palette if one exists
  if (hVSurface.p16BPPPalette != null) {
    hVSurface.p16BPPPalette = <Uint16Array><unknown>null;
  }

  // Create 16BPP Palette
  hVSurface.p16BPPPalette = Create16BPPPalette(pSrcPalette);

  DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_3, FormatString("Video Surface Palette change successfull"));
  return true;
}

// Transparency needs to take RGB value and find best fit and place it into DD Surface
// colorkey value.
function SetVideoSurfaceTransparencyColor(hVSurface: SGPVSurface, TransColor: COLORVAL): boolean {
  // Assertions
  Assert(hVSurface != null);

  // Set trans color into Video Surface
  hVSurface.TransparentColor = TransColor;

  return true;
}

export function GetVSurfacePaletteEntries(hVSurface: SGPVSurface, pPalette: SGPPaletteEntry[]): boolean {
  if (hVSurface.pPalette == null) {
    return false;
  }

  copyObjectArray(pPalette, hVSurface.pPalette, copySGPPaletteEntry);

  return true;
}

export function DeleteVideoSurfaceFromIndex(uiIndex: UINT32): boolean {
  let curr: VSURFACE_NODE | null;

  curr = gpVSurfaceHead;
  while (curr) {
    if (curr.uiIndex == uiIndex) {
      // Found the node, so detach it and delete it.

      // Deallocate the memory for the video surface
      DeleteVideoSurface(curr.hVSurface);

      if (curr == gpVSurfaceHead) {
        // Advance the head, because we are going to remove the head node.
        gpVSurfaceHead = gpVSurfaceHead.next;
      }
      if (curr == gpVSurfaceTail) {
        // Back up the tail, because we are going to remove the tail node.
        gpVSurfaceTail = gpVSurfaceTail.prev;
      }
      // Detach the node from the vsurface list
      if (curr.next) {
        // Make the prev node point to the next
        curr.next.prev = curr.prev;
      }
      if (curr.prev) {
        // Make the next node point to the prev
        curr.prev.next = curr.next;
      }
      // The node is now detached.  Now deallocate it.

      guiVSurfaceSize--;
      return true;
    }
    curr = curr.next;
  }
  return false;
}

// Deletes all palettes, surfaces and region data
export function DeleteVideoSurface(hVSurface: SGPVSurface): boolean {
  // Assertions
  if (hVSurface == null) {
    return false;
  }

  // Release palette
  if (hVSurface.pPalette != null) {
    hVSurface.pPalette = <SGPPaletteEntry[]><unknown>null;
  }

  // if ( hVSurface->pClipper != NULL )
  //{
  // Release Clipper
  //	DDReleaseClipper( (LPDIRECTDRAWCLIPPER)hVSurface->pClipper );
  //}

  // Release surface
  if (hVSurface.pSurfaceData != null) {
    hVSurface.pSurfaceData = <Uint8ClampedArray><unknown>null;
    hVSurface.pSurfaceData1 = <Uint8ClampedArray><unknown>null;
  }

  // Release backup surface
  if (hVSurface.pSavedSurfaceData != null) {
    hVSurface.pSavedSurfaceData = <Uint8ClampedArray><unknown>null;
    hVSurface.pSavedSurfaceData1 = <Uint8ClampedArray><unknown>null;
  }

  // If there is a 16bpp palette, free it
  if (hVSurface.p16BPPPalette != null) {
    hVSurface.p16BPPPalette = <Uint16Array><unknown>null;
  }

  giMemUsedInSurfaces -= (hVSurface.usHeight * hVSurface.usWidth * (hVSurface.ubBitDepth / 8));

  return true;
}

// ********************************************************
//
// Region manipulation functions
//
// ********************************************************

function GetVSurfaceRect(hVSurface: SGPVSurface, pRect: RECT): boolean {
  Assert(hVSurface != null);
  Assert(pRect != null);

  pRect.left = 0;
  pRect.top = 0;
  pRect.right = hVSurface.usWidth;
  pRect.bottom = hVSurface.usHeight;

  return true;
}

// *******************************************************************
//
// Blitting Functions
//
// *******************************************************************

// Blt  will use DD Blt or BltFast depending on flags.
// Will drop down into user-defined blitter if 8->16 BPP blitting is being done

export function BltVideoSurfaceToVideoSurface(hDestVSurface: SGPVSurface, hSrcVSurface: SGPVSurface, usIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: INT32, pBltFx: blt_vs_fx | null): boolean {
  let aRegion: VSURFACE_REGION = createVSurfaceRegion();
  let SrcRect: RECT = createRect();
  let DestRect: RECT = createRect();
  let pSrcSurface8: Uint8ClampedArray;
  let pDestSurface8: Uint8ClampedArray;
  let pDestSurface16: Uint8ClampedArray;
  let pSrcSurface16: Uint8ClampedArray;
  let uiSrcPitch: UINT32 = 0;
  let uiDestPitch: UINT32 = 0;
  let uiWidth: UINT32;
  let uiHeight: UINT32;

  // Assertions
  Assert(hDestVSurface != null);

  // Check that both region and subrect are not given
  if ((fBltFlags & VS_BLT_SRCREGION) && (fBltFlags & VS_BLT_SRCSUBRECT)) {
    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Inconsistant blit flags given"));
    return false;
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
    // Use SUBRECT if specified
    if (fBltFlags & VS_BLT_SRCSUBRECT) {
      let aSubRect: SGPRect = createSGPRect();

      if (pBltFx == null) {
        return false;
      }

      aSubRect = pBltFx.SrcRect;

      SrcRect.top = aSubRect.iTop;
      SrcRect.left = aSubRect.iLeft;
      SrcRect.bottom = aSubRect.iBottom;
      SrcRect.right = aSubRect.iRight;

      break;
    }

    // Here, use default, which is entire Video Surface
    // Check Sizes, SRC size MUST be <= DEST size
    if (hDestVSurface.usHeight < hSrcVSurface.usHeight) {
      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Incompatible height size given in Video Surface blit"));
      return false;
    }
    if (hDestVSurface.usWidth < hSrcVSurface.usWidth) {
      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Incompatible height size given in Video Surface blit"));
      return false;
    }

    SrcRect.top = 0;
    SrcRect.left = 0;
    SrcRect.bottom = hSrcVSurface.usHeight;
    SrcRect.right = hSrcVSurface.usWidth;
  } while (false);

  // Once here, assert valid Src
  Assert(hSrcVSurface != null);

  // clipping -- added by DB
  GetVSurfaceRect(hDestVSurface, DestRect);
  uiWidth = SrcRect.right - SrcRect.left;
  uiHeight = SrcRect.bottom - SrcRect.top;

  // check for position entirely off the screen
  if (iDestX >= DestRect.right)
    return false;
  if (iDestY >= DestRect.bottom)
    return false;
  if ((iDestX + uiWidth) < DestRect.left)
    return false;
  if ((iDestY + uiHeight) < DestRect.top)
    return false;

  // DB The mirroring stuff has to do it's own clipping because
  // it needs to invert some of the numbers
  if (!(fBltFlags & VS_BLT_MIRROR_Y)) {
    if ((iDestX + uiWidth) >= DestRect.right) {
      SrcRect.right -= ((iDestX + uiWidth) - DestRect.right);
      uiWidth -= ((iDestX + uiWidth) - DestRect.right);
    }
    if ((iDestY + uiHeight) >= DestRect.bottom) {
      SrcRect.bottom -= ((iDestY + uiHeight) - DestRect.bottom);
      uiHeight -= ((iDestY + uiHeight) - DestRect.bottom);
    }
    if (iDestX < DestRect.left) {
      SrcRect.left += (DestRect.left - iDestX);
      uiWidth -= (DestRect.left - iDestX);
      iDestX = DestRect.left;
    }
    if (iDestY < DestRect.top) {
      SrcRect.top += (DestRect.top - iDestY);
      uiHeight -= (DestRect.top - iDestY);
      iDestY = DestRect.top;
    }
  }

  // Send dest position, rectangle, etc to DD bltfast function
  // First check BPP values for compatibility
  if (hDestVSurface.ubBitDepth == 16 && hSrcVSurface.ubBitDepth == 16) {
    if (fBltFlags & VS_BLT_MIRROR_Y) {
      if ((pSrcSurface16 = LockVideoSurfaceBuffer(hSrcVSurface, createPointer(() => uiSrcPitch, (v) => uiSrcPitch = v))) == null) {
        DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Failed on lock of 16BPP surface for blitting"));
        return false;
      }

      if ((pDestSurface16 = LockVideoSurfaceBuffer(hDestVSurface, createPointer(() => uiDestPitch, (v) => uiDestPitch = v))) == null) {
        UnLockVideoSurfaceBuffer(hSrcVSurface);
        DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Failed on lock of 16BPP dest surface for blitting"));
        return false;
      }

      Blt16BPPTo16BPPMirror(pDestSurface16, uiDestPitch, pSrcSurface16, uiSrcPitch, iDestX, iDestY, SrcRect.left, SrcRect.top, uiWidth, uiHeight);
      UnLockVideoSurfaceBuffer(hSrcVSurface);
      UnLockVideoSurfaceBuffer(hDestVSurface);
      return true;
    }
// For testing with non-DDraw blitting, uncomment to test -- DB

    if (!BltVSurfaceUsingDD(hDestVSurface, hSrcVSurface, fBltFlags, iDestX, iDestY, SrcRect)) {
      return false;
    }
  } else if (hDestVSurface.ubBitDepth == 8 && hSrcVSurface.ubBitDepth == 8) {
    if ((pSrcSurface8 = LockVideoSurfaceBuffer(hSrcVSurface, createPointer(() => uiSrcPitch, (v) => uiSrcPitch = v))) == null) {
      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Failed on lock of 8BPP surface for blitting"));
      return false;
    }

    if ((pDestSurface8 = LockVideoSurfaceBuffer(hDestVSurface, createPointer(() => uiDestPitch, (v) => uiDestPitch = v))) == null) {
      UnLockVideoSurfaceBuffer(hSrcVSurface);
      DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Failed on lock of 8BPP dest surface for blitting"));
      return false;
    }

    // Blt8BPPDataTo8BPPBuffer( UINT8 *pBuffer, UINT32 uiDestPitchBYTES, HVOBJECT hSrcVObject, INT32 iX, INT32 iY, UINT16 usIndex );
    Blt8BPPTo8BPP(pDestSurface8, uiDestPitch, pSrcSurface8, uiSrcPitch, iDestX, iDestY, SrcRect.left, SrcRect.top, uiWidth, uiHeight);
    UnLockVideoSurfaceBuffer(hSrcVSurface);
    UnLockVideoSurfaceBuffer(hDestVSurface);
    return true;
  } else {
    DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_2, FormatString("Incompatible BPP values with src and dest Video Surfaces for blitting"));
    return false;
  }

  return true;
}

// ******************************************************************************************
//
// UTILITY FUNCTIONS
//
// ******************************************************************************************

// Blt to backup buffer
function UpdateBackupSurface(hVSurface: SGPVSurface): boolean {
  let aRect: RECT = createRect();

  // Assertions
  Assert(hVSurface != null);

  // Validations
  if (hVSurface.pSavedSurfaceData == null) {
    return false;
  }

  aRect.top = 0;
  aRect.left = 0;
  aRect.bottom = hVSurface.usHeight;
  aRect.right = hVSurface.usWidth;

  // Copy all contents into backup buffer
  hVSurface.pSavedSurfaceData.set(hVSurface.pSurfaceData);

  return true;
}

// *****************************************************************************
//
// Private DirectDraw manipulation functions
//
// *****************************************************************************

export function GetVideoSurfaceDDSurface(hVSurface: HVSURFACE): Uint8ClampedArray {
  Assert(hVSurface != null);

  return hVSurface.value.pSurfaceData;
}

function CreateVideoSurfaceFromDDSurface(lpDDSurface: ImageData): SGPVSurface {
  // Create Video Surface
  let hVSurface: SGPVSurface;
  let SGPPalette: SGPPaletteEntry[] /* [256] */ = createArrayFrom(256, createSGPPaletteEntry);

  // Allocate Video Surface struct
  hVSurface = createSGPVSurface();

  // Set values based on DD Surface given
  hVSurface.usHeight = lpDDSurface.height;
  hVSurface.usWidth = lpDDSurface.width;
  hVSurface.ubBitDepth = 16;
  hVSurface.pSurfaceData = lpDDSurface.data;
  hVSurface.pSurfaceData1 = <Uint8ClampedArray><unknown>null;
  hVSurface.pSavedSurfaceData = <Uint8ClampedArray><unknown>null;
  hVSurface.fFlags = 0;

  // Set meory flags
  hVSurface.fFlags |= VSURFACE_SYSTEM_MEM_USAGE;

  // All is well
  DbgMessage(TOPIC_VIDEOSURFACE, DBG_LEVEL_0, FormatString("Success in Creating Video Surface from DD Surface"));

  return hVSurface;
}

// UTILITY FUNCTIONS FOR BLITTING

function ClipReleatedSrcAndDestRectangles(hDestVSurface: SGPVSurface, hSrcVSurface: SGPVSurface, DestRect: RECT, SrcRect: RECT): boolean {
  Assert(hDestVSurface != null);
  Assert(hSrcVSurface != null);

  // Check for invalid start positions and clip by ignoring blit
  if (DestRect.left >= hDestVSurface.usWidth || DestRect.top >= hDestVSurface.usHeight) {
    return false;
  }

  if (SrcRect.left >= hSrcVSurface.usWidth || SrcRect.top >= hSrcVSurface.usHeight) {
    return false;
  }

  // For overruns
  // Clip destination rectangles
  if (DestRect.right > hDestVSurface.usWidth) {
    // Both have to be modified or by default streching occurs
    DestRect.right = hDestVSurface.usWidth;
    SrcRect.right = SrcRect.left + (DestRect.right - DestRect.left);
  }
  if (DestRect.bottom > hDestVSurface.usHeight) {
    // Both have to be modified or by default streching occurs
    DestRect.bottom = hDestVSurface.usHeight;
    SrcRect.bottom = SrcRect.top + (DestRect.bottom - DestRect.top);
  }

  // Clip src rectangles
  if (SrcRect.right > hSrcVSurface.usWidth) {
    // Both have to be modified or by default streching occurs
    SrcRect.right = hSrcVSurface.usWidth;
    DestRect.right = DestRect.left + (SrcRect.right - SrcRect.left);
  }
  if (SrcRect.bottom > hSrcVSurface.usHeight) {
    // Both have to be modified or by default streching occurs
    SrcRect.bottom = hSrcVSurface.usHeight;
    DestRect.bottom = DestRect.top + (SrcRect.bottom - SrcRect.top);
  }

  // For underruns
  // Clip destination rectangles
  if (DestRect.left < 0) {
    // Both have to be modified or by default streching occurs
    DestRect.left = 0;
    SrcRect.left = SrcRect.right - (DestRect.right - DestRect.left);
  }
  if (DestRect.top < 0) {
    // Both have to be modified or by default streching occurs
    DestRect.top = 0;
    SrcRect.top = SrcRect.bottom - (DestRect.bottom - DestRect.top);
  }

  // Clip src rectangles
  if (SrcRect.left < 0) {
    // Both have to be modified or by default streching occurs
    SrcRect.left = 0;
    DestRect.left = DestRect.right - (SrcRect.right - SrcRect.left);
  }
  if (SrcRect.top < 0) {
    // Both have to be modified or by default streching occurs
    SrcRect.top = 0;
    DestRect.top = DestRect.bottom - (SrcRect.bottom - SrcRect.top);
  }

  return true;
}

function FillSurface(hDestVSurface: SGPVSurface, pBltFx: blt_vs_fx | null): boolean {
  Assert(hDestVSurface != null);
  if (pBltFx == null) {
    return false;
  }

  let color = GetRGBColor(pBltFx.ColorFill);
  let pSurfaceData = hDestVSurface.pSurfaceData;

  let width = hDestVSurface.usWidth;
  let height = hDestVSurface.usHeight;

  let i = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pSurfaceData[i++] = SGPGetRValue(color);
      pSurfaceData[i++] = SGPGetGValue(color);
      pSurfaceData[i++] = SGPGetBValue(color);
      pSurfaceData[i++] = 0xFF;
    }
  }

  if (hDestVSurface.fFlags & VSURFACE_VIDEO_MEM_USAGE && !(hDestVSurface.fFlags & VSURFACE_RESERVED_SURFACE)) {
    UpdateBackupSurface(hDestVSurface);
  }

  return true;
}

function FillSurfaceRect(hDestVSurface: SGPVSurface, pBltFx: blt_vs_fx | null): boolean {
  Assert(hDestVSurface != null);
  if (pBltFx == null) {
    return false;
  }

  let rgb = GetRGBColor(pBltFx.ColorFill);
  let r = SGPGetRValue(rgb);
  let g = SGPGetGValue(rgb);
  let b = SGPGetBValue(rgb);
  let pSurfaceData = hDestVSurface.pSurfaceData;

  let left = pBltFx.FillRect.iLeft;
  let top = pBltFx.FillRect.iTop;
  let right = pBltFx.FillRect.iRight;
  let bottom = pBltFx.FillRect.iBottom;

  let i = top * hDestVSurface.usWidth * 4 + left * 4;
  let lineSkip = hDestVSurface.usWidth * 4 - (right - left) * 4;

  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      pSurfaceData[i++] = r;
      pSurfaceData[i++] = g;
      pSurfaceData[i++] = b;
      pSurfaceData[i++] = 0xFF;
    }
    i += lineSkip;
  }

  if (hDestVSurface.fFlags & VSURFACE_VIDEO_MEM_USAGE && !(hDestVSurface.fFlags & VSURFACE_RESERVED_SURFACE)) {
    UpdateBackupSurface(hDestVSurface);
  }

  return true;
}

export function BltVSurfaceUsingDD(hDestVSurface: SGPVSurface, hSrcVSurface: SGPVSurface, fBltFlags: UINT32, iDestX: INT32, iDestY: INT32, SrcRect: RECT): boolean {
  let DestRect: RECT = createRect();

  // Blit using the correct blitter
  if (fBltFlags & VS_BLT_FAST) {
    // Validations
    if (iDestX < 0) {
      return false;
    }
    if (iDestY < 0) {
      return false;
    }

    let destSurfaceData = hDestVSurface.pSurfaceData;
    let srcSurfaceData = hSrcVSurface.pSurfaceData;

    let left = SrcRect.left;
    let top = SrcRect.top;
    let right = SrcRect.right;
    let bottom = SrcRect.bottom;

    let destIndex = hDestVSurface.usWidth * iDestY * 4 + iDestX * 4;
    let destLineSkip = hDestVSurface.usWidth * 4 - (right - left) * 4;

    let srcIndex = hSrcVSurface.usWidth * top * 4 + left * 4;
    let srcLineSkip = hSrcVSurface.usWidth * 4 - (right - left) * 4;

    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        destSurfaceData[destIndex++] = srcSurfaceData[srcIndex++]
        destSurfaceData[destIndex++] = srcSurfaceData[srcIndex++]
        destSurfaceData[destIndex++] = srcSurfaceData[srcIndex++]
        destSurfaceData[destIndex++] = srcSurfaceData[srcIndex++]
      }

      destIndex += destLineSkip;
      srcIndex += srcLineSkip;
    }
  } else {
    // Normal, specialized blit for clipping, etc

    // Setup dest rectangle
    DestRect.top = iDestY;
    DestRect.left = iDestX;
    DestRect.bottom = iDestY + (SrcRect.bottom - SrcRect.top);
    DestRect.right = iDestX + (SrcRect.right - SrcRect.left);

    // Do Clipping of rectangles
    if (!ClipReleatedSrcAndDestRectangles(hDestVSurface, hSrcVSurface, DestRect, SrcRect)) {
      // Returns false because dest start is > dest size
      return true;
    }

    // Check values for 0 size
    if (DestRect.top == DestRect.bottom || DestRect.right == DestRect.left) {
      return true;
    }

    // Check for -ve values

    DDBltSurface(hDestVSurface, DestRect, hSrcVSurface, SrcRect, fBltFlags);
  }

  // Update backup surface with new data
  if (hDestVSurface.fFlags & VSURFACE_VIDEO_MEM_USAGE && !(hDestVSurface.fFlags & VSURFACE_RESERVED_SURFACE)) {
    UpdateBackupSurface(hDestVSurface);
  }

  return true;
}

function InternalShadowVideoSurfaceRect(uiDestVSurface: UINT32, X1: INT32, Y1: INT32, X2: INT32, Y2: INT32, fLowPercentShadeTable: boolean): boolean {
  let pBuffer: Uint8ClampedArray;
  let uiPitch: UINT32 = 0;
  let area: SGPRect = createSGPRect();
  let hVSurface: SGPVSurface;

  // CLIP IT!
  // FIRST GET SURFACE

  //
  // Get Video Surface
  //
  if ((hVSurface = GetVideoSurface(uiDestVSurface)) === null) {
    return false;
  }

  if (X1 < 0)
    X1 = 0;

  if (X2 < 0)
    return false;

  if (Y2 < 0)
    return false;

  if (Y1 < 0)
    Y1 = 0;

  if (X2 >= hVSurface.usWidth)
    X2 = hVSurface.usWidth - 1;

  if (Y2 >= hVSurface.usHeight)
    Y2 = hVSurface.usHeight - 1;

  if (X1 >= hVSurface.usWidth)
    return false;

  if (Y1 >= hVSurface.usHeight)
    return false;

  if ((X2 - X1) <= 0)
    return false;

  if ((Y2 - Y1) <= 0)
    return false;

  area.iTop = Y1;
  area.iBottom = Y2;
  area.iLeft = X1;
  area.iRight = X2;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, createPointer(() => uiPitch, (v) => uiPitch = v));
  // UnLockVideoSurface( uiDestVSurface );

  if (pBuffer == null) {
    return false;
  }

  if (!fLowPercentShadeTable) {
    // Now we have the video object and surface, call the shadow function
    if (!Blt16BPPBufferShadowRect(pBuffer, uiPitch, area)) {
      // Blit has failed if false returned
      return false;
    }
  } else {
    // Now we have the video object and surface, call the shadow function
    if (!Blt16BPPBufferShadowRectAlternateTable(pBuffer, uiPitch, area)) {
      // Blit has failed if false returned
      return false;
    }
  }

  // Mark as dirty if it's the backbuffer
  // if ( uiDestVSurface == BACKBUFFER )
  //{
  //	InvalidateBackbuffer( );
  //}

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

export function ShadowVideoSurfaceRect(uiDestVSurface: UINT32, X1: INT32, Y1: INT32, X2: INT32, Y2: INT32): boolean {
  return InternalShadowVideoSurfaceRect(uiDestVSurface, X1, Y1, X2, Y2, false);
}

export function ShadowVideoSurfaceRectUsingLowPercentTable(uiDestVSurface: UINT32, X1: INT32, Y1: INT32, X2: INT32, Y2: INT32): boolean {
  return InternalShadowVideoSurfaceRect(uiDestVSurface, X1, Y1, X2, Y2, true);
}

//
// BltVSurfaceUsingDDBlt will always use Direct Draw Blt,NOT BltFast
function BltVSurfaceUsingDDBlt(hDestVSurface: SGPVSurface, hSrcVSurface: SGPVSurface, fBltFlags: UINT32, iDestX: INT32, iDestY: INT32, SrcRect: RECT, DestRect: RECT): boolean {
  DDBltSurface(hDestVSurface, DestRect, hSrcVSurface, SrcRect, 0);

  // Update backup surface with new data
  if (hDestVSurface.fFlags & VSURFACE_VIDEO_MEM_USAGE && !(hDestVSurface.fFlags & VSURFACE_RESERVED_SURFACE)) {
    UpdateBackupSurface(hDestVSurface);
  }

  return true;
}

//
// This function will stretch the source image to the size of the dest rect.
//
// If the 2 images are not 16 Bpp, it returns false.
//
export function BltStretchVideoSurface(uiDestVSurface: UINT32, uiSrcVSurface: UINT32, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, SrcRect: SGPRect, DestRect: SGPRect): boolean {
  let hDestVSurface: SGPVSurface;
  let hSrcVSurface: SGPVSurface;

  if ((hDestVSurface = GetVideoSurface(uiDestVSurface)) === null) {
    return false;
  }
  if ((hSrcVSurface = GetVideoSurface(uiSrcVSurface)) === null) {
    return false;
  }

  // if the 2 images are not both 16bpp, return FALSE
  if ((hDestVSurface.ubBitDepth != 16) && (hSrcVSurface.ubBitDepth != 16))
    return false;

  if (!BltVSurfaceUsingDDBlt(hDestVSurface, hSrcVSurface, fBltFlags, iDestX, iDestY, SGPRectToRect(SrcRect), SGPRectToRect(DestRect))) {
    //
    // VO Blitter will set debug messages for error conditions
    //

    return false;
  }

  return true;
}

export function ShadowVideoSurfaceImage(uiDestVSurface: UINT32, hImageHandle: SGPVObject, iPosX: INT32, iPosY: INT32): boolean {
  // Horizontal shadow
  ShadowVideoSurfaceRect(uiDestVSurface, iPosX + 3, iPosY + hImageHandle.pETRLEObject[0].usHeight, iPosX + hImageHandle.pETRLEObject[0].usWidth, iPosY + hImageHandle.pETRLEObject[0].usHeight + 3);

  // vertical shadow
  ShadowVideoSurfaceRect(uiDestVSurface, iPosX + hImageHandle.pETRLEObject[0].usWidth, iPosY + 3, iPosX + hImageHandle.pETRLEObject[0].usWidth + 3, iPosY + hImageHandle.pETRLEObject[0].usHeight);
  return true;
}

function MakeVSurfaceFromVObject(uiVObject: UINT32, usSubIndex: UINT16, puiVSurface: Pointer<UINT32>): boolean {
  let hSrcVObject: SGPVObject | null;
  let uiVSurface: UINT32;
  let hDesc: VSURFACE_DESC = createVSurfaceDesc();

  if ((hSrcVObject = GetVideoObject(uiVObject))) {
    // ATE: Memset
    hDesc.fCreateFlags = VSURFACE_CREATE_DEFAULT;
    hDesc.usWidth = hSrcVObject.pETRLEObject[usSubIndex].usWidth;
    hDesc.usHeight = hSrcVObject.pETRLEObject[usSubIndex].usHeight;
    hDesc.ubBitDepth = PIXEL_DEPTH;

    if ((uiVSurface = AddVideoSurface(hDesc)) !== -1) {
      if (BltVideoObjectFromIndex(uiVSurface, uiVObject, usSubIndex, 0, 0, VO_BLT_SRCTRANSPARENCY, null)) {
        puiVSurface.value = uiVSurface;
        return true;
      } else
        DeleteVideoSurfaceFromIndex(uiVSurface);
    }
  }

  return false;
}

function DDBltSurface(hDestVSurface: SGPVSurface, DestRect: RECT, hSrcVSurface: SGPVSurface, SrcRect: RECT, fBltFlags: UINT32): boolean {
  let destSurfaceData = hDestVSurface.pSurfaceData;
  let srcSurfaceData = hSrcVSurface.pSurfaceData;

  let left = SrcRect.left;
  let top = SrcRect.top;
  let right = SrcRect.right;
  let bottom = SrcRect.bottom;

  let destIndex = hDestVSurface.usWidth * DestRect.top * 4 + DestRect.left * 4;
  let destLineSkip = hDestVSurface.usWidth * 4 - (right - left) * 4;

  let srcIndex = hSrcVSurface.usWidth * top * 4 + left * 4;
  let srcLineSkip = hSrcVSurface.usWidth * 4 - (right - left) * 4;

  let x: number;
  let y: number;
  for (y = top; y < bottom; y++) {
    for (x = left; x < right; x++) {
      destSurfaceData[destIndex++] = srcSurfaceData[srcIndex++]
      destSurfaceData[destIndex++] = srcSurfaceData[srcIndex++]
      destSurfaceData[destIndex++] = srcSurfaceData[srcIndex++]
      destSurfaceData[destIndex++] = srcSurfaceData[srcIndex++]
    }

    destIndex += destLineSkip;
    srcIndex += srcLineSkip;
  }

  return true;
}

}
