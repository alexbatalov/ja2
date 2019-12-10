namespace ja2 {

// ******************************************************************************
//
// Video Object SGP Module
//
// Video Objects are used to contain any imagery which requires blitting. The data
// is contained within a Direct Draw surface. Palette information is in both
// a Direct Draw Palette and a 16BPP palette structure for 8->16 BPP Blits.
// Blitting is done via Direct Draw as well as custum blitters. Regions are
// used to define local coordinates within the surface
//
// Second Revision: Dec 10, 1996, Andrew Emmons
//
// *******************************************************************************

// *******************************************************************************
// Defines
// *******************************************************************************

// This define is sent to CreateList SGP function. It dynamically re-sizes if
// the list gets larger
const DEFAULT_VIDEO_OBJECT_LIST_SIZE = 10;

const COMPRESS_TRANSPARENT = 0x80;
const COMPRESS_RUN_MASK = 0x7F;

// *******************************************************************************
// External Functions and variables
// *******************************************************************************

// *******************************************************************************
// LOCAL functions
// *******************************************************************************

// *******************************************************************************
// LOCAL global variables
// *******************************************************************************

export let gfVideoObjectsInit: boolean = false;

interface VOBJECT_NODE {
  hVObject: SGPVObject;
  uiIndex: UINT32;

  next: VOBJECT_NODE | null /* Pointer<VOBJECT_NODE> */;
  prev: VOBJECT_NODE | null /* Pointer<VOBJECT_NODE> */;
}

function createVObjectNode(): VOBJECT_NODE {
  return {
    hVObject: <SGPVObject><unknown>null,
    uiIndex: 0,
    next: null,
    prev: null,
  };
}

let gpVObjectHead: VOBJECT_NODE | null /* Pointer<VOBJECT_NODE> */ = null;
let gpVObjectTail: VOBJECT_NODE | null /* Pointer<VOBJECT_NODE> */ = null;
let guiVObjectIndex: UINT32 = 1;
let guiVObjectSize: UINT32 = 0;
let guiVObjectTotalAdded: UINT32 = 0;

// **************************************************************
//
// Video Object Manager functions
//
// **************************************************************

export function InitializeVideoObjectManager(): boolean {
  // Shouldn't be calling this if the video object manager already exists.
  // Call shutdown first...
  Assert(!gpVObjectHead);
  Assert(!gpVObjectTail);
  RegisterDebugTopic(TOPIC_VIDEOOBJECT, "Video Object Manager");
  gpVObjectHead = gpVObjectTail = null;
  gfVideoObjectsInit = true;
  return true;
}

export function ShutdownVideoObjectManager(): boolean {
  let curr: VOBJECT_NODE | null;
  while (gpVObjectHead) {
    curr = gpVObjectHead;
    gpVObjectHead = gpVObjectHead.next;
    DeleteVideoObject(curr.hVObject);
    MemFree(curr);
  }
  gpVObjectHead = null;
  gpVObjectTail = null;
  guiVObjectIndex = 1;
  guiVObjectSize = 0;
  guiVObjectTotalAdded = 0;
  UnRegisterDebugTopic(TOPIC_VIDEOOBJECT, "Video Objects");
  gfVideoObjectsInit = false;
  return true;
}

export function AddStandardVideoObject(pVObjectDesc: VOBJECT_DESC): UINT32 {
  let puiIndex: UINT32;

  let hVObject: SGPVObject;

  // Assertions
  Assert(pVObjectDesc);

  // Create video object
  hVObject = CreateVideoObject(pVObjectDesc);

  if (!hVObject) {
    // Video Object will set error condition.
    return 0;
  }

  // Set transparency to default
  SetVideoObjectTransparencyColor(hVObject, FROMRGB(0, 0, 0));

  // Set into video object list
  if (gpVObjectTail) {
    // Add node after tail
    gpVObjectTail.next = createVObjectNode();
    gpVObjectTail.next.prev = gpVObjectTail;
    gpVObjectTail.next.next = null;
    gpVObjectTail = gpVObjectTail.next;
  } else {
    // new list
    gpVObjectHead = createVObjectNode();
    gpVObjectHead.prev = gpVObjectHead.next = null;
    gpVObjectTail = gpVObjectHead;
  }
  // Set the hVObject into the node.
  gpVObjectTail.hVObject = hVObject;
  gpVObjectTail.uiIndex = guiVObjectIndex += 2;
  puiIndex = gpVObjectTail.uiIndex;
  Assert(guiVObjectIndex < 0xfffffff0); // unlikely that we will ever use 2 billion vobjects!
  // We would have to create about 70 vobjects per second for 1 year straight to achieve this...
  guiVObjectSize++;
  guiVObjectTotalAdded++;

  return puiIndex;
}

export function GetVideoObject(uiIndex: UINT32): SGPVObject {
  let curr: VOBJECT_NODE | null;

  curr = gpVObjectHead;
  while (curr) {
    if (curr.uiIndex == uiIndex) {
      return curr.hVObject;
    }
    curr = curr.next;
  }
  return <SGPVObject><unknown>null;
}

export function BltVideoObjectFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usRegionIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, pBltFx: blt_fx | null): boolean {
  let pBuffer: Uint8ClampedArray;
  let uiPitch: UINT32 = 0;
  let hSrcVObject: SGPVObject;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, createPointer(() => uiPitch, (v) => uiPitch = v));

  if (pBuffer == null) {
    return false;
  }

// Get video object
  if (!(hSrcVObject = GetVideoObject(uiSrcVObject))) {
    UnLockVideoSurface(uiDestVSurface);
    return false;
  }

  // Now we have the video object and surface, call the VO blitter function
  if (!BltVideoObjectToBuffer(pBuffer, uiPitch, hSrcVObject, usRegionIndex, iDestX, iDestY, fBltFlags, pBltFx)) {
    UnLockVideoSurface(uiDestVSurface);
    // VO Blitter will set debug messages for error conditions
    return false;
  }

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

export function DeleteVideoObjectFromIndex(uiVObject: UINT32): boolean {
  let curr: VOBJECT_NODE | null;

  curr = gpVObjectHead;
  while (curr) {
    if (curr.uiIndex == uiVObject) {
      // Found the node, so detach it and delete it.

      // Deallocate the memory for the video object
      DeleteVideoObject(curr.hVObject);

      if (curr == gpVObjectHead) {
        // Advance the head, because we are going to remove the head node.
        gpVObjectHead = gpVObjectHead.next;
      }
      if (curr == gpVObjectTail) {
        // Back up the tail, because we are going to remove the tail node.
        gpVObjectTail = gpVObjectTail.prev;
      }
      // Detach the node from the vobject list
      if (curr.next) {
        // Make the prev node point to the next
        curr.next.prev = curr.prev;
      }
      if (curr.prev) {
        // Make the next node point to the prev
        curr.prev.next = curr.next;
      }
// The node is now detached.  Now deallocate it.
      curr = null;
      guiVObjectSize--;
      return true;
    }
    curr = curr.next;
  }
  return false;
}

// Given an index to the dest and src vobject contained in ghVideoObjects
// Based on flags, blit accordingly
// There are two types, a BltFast and a Blt. BltFast is 10% faster, uses no
// clipping lists
export function BltVideoObject(uiDestVSurface: UINT32, hSrcVObject: SGPVObject, usRegionIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, pBltFx: blt_fx | null): boolean {
  let pBuffer: Uint8ClampedArray;
  let uiPitch: UINT32 = 0;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, createPointer(() => uiPitch, (v) => uiPitch = v));

  if (pBuffer == null) {
    return false;
  }

  // Now we have the video object and surface, call the VO blitter function
  if (!BltVideoObjectToBuffer(pBuffer, uiPitch, hSrcVObject, usRegionIndex, iDestX, iDestY, fBltFlags, pBltFx)) {
    UnLockVideoSurface(uiDestVSurface);
    // VO Blitter will set debug messages for error conditions
    return false;
  }

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

// *******************************************************************************
// Video Object Manipulation Functions
// *******************************************************************************

export function CreateVideoObject(VObjectDesc: VOBJECT_DESC): SGPVObject {
  let hVObject: SGPVObject;
  let hImage: ImageType;
  let TempETRLEData: ETRLEData = createETRLEData();
  //	UINT32							count;

  // Allocate memory for video object data and initialize
  hVObject = createSGPVObject();

  // default of all members of the vobject is 0

  // Check creation options
  //	do
  //	{
  if (VObjectDesc.fCreateFlags & VOBJECT_CREATE_FROMFILE || VObjectDesc.fCreateFlags & VOBJECT_CREATE_FROMHIMAGE) {
    if (VObjectDesc.fCreateFlags & VOBJECT_CREATE_FROMFILE) {
      // Create himage object from file
      hImage = CreateImage(VObjectDesc.ImageFile, IMAGE_ALLIMAGEDATA);

      if (hImage == null) {
        DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid Image Filename given");
        return <SGPVObject><unknown>null;
      }
    } else {
      // create video object from provided hImage
      hImage = VObjectDesc.hImage;
      if (hImage == null) {
        DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid hImage pointer given");
        return <SGPVObject><unknown>null;
      }
    }

    // Check if returned himage is TRLE compressed - return error if not
    if (!(hImage.fFlags & IMAGE_TRLECOMPRESSED)) {
      DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid Image format given.");
      DestroyImage(hImage);
      return <SGPVObject><unknown>null;
    }

    // Set values from himage
    hVObject.ubBitDepth = hImage.ubBitDepth;

    // Get TRLE data
    if (!GetETRLEImageData(hImage, TempETRLEData)) {
      return <SGPVObject><unknown>null;
    }

    // Set values
    hVObject.usNumberOfObjects = TempETRLEData.usNumberOfObjects;
    hVObject.pETRLEObject = TempETRLEData.pETRLEObject;
    hVObject.pPixData = TempETRLEData.pPixData;
    hVObject.uiSizePixData = TempETRLEData.uiSizePixData;

    // Set palette from himage
    if (hImage.ubBitDepth == 8) {
      hVObject.pShade8 = ubColorTables[DEFAULT_SHADE_LEVEL];
      hVObject.pGlow8 = ubColorTables[0];

      SetVideoObjectPalette(hVObject, hImage.pPalette);
    }

    if (VObjectDesc.fCreateFlags & VOBJECT_CREATE_FROMFILE) {
      // Delete himage object
      DestroyImage(hImage);
    }
    //		break;
  } else {
    MemFree(hVObject);
    DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid VObject creation flags given.");
    return <SGPVObject><unknown>null;
  }

  // If here, no special options given, use structure given in paraneters
  // TO DO:

  //	}
  //	while( FALSE );

  // All is well
  //  DbgMessage( TOPIC_VIDEOOBJECT, DBG_LEVEL_3, String("Success in Creating Video Object" ) );

  return hVObject;
}

// Palette setting is expensive, need to set both DDPalette and create 16BPP palette
function SetVideoObjectPalette(hVObject: SGPVObject, pSrcPalette: SGPPaletteEntry[]): boolean {
  Assert(hVObject != null);
  Assert(pSrcPalette != null);

  // Create palette object if not already done so
  if (hVObject.pPaletteEntry == null) {
    // Create palette
    hVObject.pPaletteEntry = createArrayFrom(256, createSGPPaletteEntry);

    // Copy src into palette
    copyObjectArray(hVObject.pPaletteEntry, pSrcPalette, copySGPPaletteEntry);
  } else {
    // Just Change entries
    copyObjectArray(hVObject.pPaletteEntry, pSrcPalette, copySGPPaletteEntry);
  }

  // Delete 16BPP Palette if one exists
  if (hVObject.p16BPPPalette != null) {
    hVObject.p16BPPPalette = <Uint16Array><unknown>null;
  }

  // Create 16BPP Palette
  hVObject.p16BPPPalette = Create16BPPPalette(pSrcPalette);
  hVObject.pShadeCurrent = hVObject.p16BPPPalette;

  //  DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_3, String("Video Object Palette change successfull" ));
  return true;
}

// Transparency needs to take RGB value and find best fit and place it into DD Surface
// colorkey value.
function SetVideoObjectTransparencyColor(hVObject: SGPVObject, TransColor: COLORVAL): boolean {
  // Assertions
  Assert(hVObject != null);

  // Set trans color into video object
  hVObject.TransparentColor = TransColor;

  return true;
}

// Deletes all palettes, surfaces and region data
export function DeleteVideoObject(hVObject: SGPVObject): boolean {
  let usLoop: UINT16;

  // Assertions
  if (hVObject == null) {
    return false;
  }

  DestroyObjectPaletteTables(hVObject);

  // Release palette
  if (hVObject.pPaletteEntry != null) {
    hVObject.pPaletteEntry = <SGPPaletteEntry[]><unknown>null;
    //		hVObject->pPaletteEntry = NULL;
  }

  if (hVObject.pPixData != null) {
    hVObject.pPixData = <Uint8Array><unknown>null;
    //		hVObject->pPixData = NULL;
  }

  if (hVObject.pETRLEObject != null) {
    hVObject.pETRLEObject = <ETRLEObject[]><unknown>null;
    //		hVObject->pETRLEObject = NULL;
  }

  if (hVObject.ppZStripInfo != null) {
    for (usLoop = 0; usLoop < hVObject.usNumberOfObjects; usLoop++) {
      if (hVObject.ppZStripInfo[usLoop] != null) {
        hVObject.ppZStripInfo[usLoop] = <ZStripInfo><unknown>null;
      }
    }
    hVObject.ppZStripInfo = <ZStripInfo[]><unknown>null;
    //		hVObject->ppZStripInfo = NULL;
  }

  if (hVObject.usNumberOf16BPPObjects > 0) {
    for (usLoop = 0; usLoop < hVObject.usNumberOf16BPPObjects; usLoop++) {
      hVObject.p16BPPObject[usLoop].p16BPPData = <Uint16Array><unknown>null;
    }
    hVObject.p16BPPObject = <SixteenBPPObjectInfo[]><unknown>null;
  }

  return true;
}

// *******************************************************************
//
// Blitting Functions
//
// *******************************************************************

// High level blit function encapsolates ALL effects and BPP
function BltVideoObjectToBuffer(pBuffer: Uint8ClampedArray, uiDestPitchBYTES: UINT32, hSrcVObject: SGPVObject, usIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: INT32, pBltFx: blt_fx | null): boolean {
  // Assertions
  Assert(pBuffer != null);

  if (hSrcVObject == null) {
    let i: number = 0;
  }

  Assert(hSrcVObject != null);

  // Check For Flags and bit depths
  switch (hSrcVObject.ubBitDepth) {
    case 16:

      break;

    case 8:

      // Switch based on flags given
      do {
        if (gbPixelDepth == 16) {
              if (fBltFlags & VO_BLT_SRCTRANSPARENCY) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, ClippingRect))
              Blt8BPPDataTo16BPPBufferTransparentClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, ClippingRect);
            else
              Blt8BPPDataTo16BPPBufferTransparent(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          } else if (fBltFlags & VO_BLT_SHADOW) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, ClippingRect))
              Blt8BPPDataTo16BPPBufferShadowClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, ClippingRect);
            else
              Blt8BPPDataTo16BPPBufferShadow(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          }
        } else if (gbPixelDepth == 8) {
          if (fBltFlags & VO_BLT_SRCTRANSPARENCY) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, ClippingRect))
              Blt8BPPDataTo8BPPBufferTransparentClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, ClippingRect);
            else
              Blt8BPPDataTo8BPPBufferTransparent(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          } else if (fBltFlags & VO_BLT_SHADOW) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, ClippingRect))
              Blt8BPPDataTo8BPPBufferShadowClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, ClippingRect);
            else
              Blt8BPPDataTo8BPPBufferShadow(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          }
        }
        // Use default blitter here
        // Blt8BPPDataTo16BPPBuffer( hDestVObject, hSrcVObject, (UINT16)iDestX, (UINT16)iDestY, (SGPRect*)&SrcRect );
      } while (false);

      break;
  }

  return true;
}

/**********************************************************************************************
 DestroyObjectPaletteTables

        Destroys the palette tables of a video object. All memory is deallocated, and
        the pointers set to NULL. Be careful not to try and blit this object until new
        tables are calculated, or things WILL go boom.

**********************************************************************************************/
export function DestroyObjectPaletteTables(hVObject: SGPVObject): boolean {
  let x: UINT32;
  let f16BitPal: boolean;

  for (x = 0; x < HVOBJECT_SHADE_TABLES; x++) {
    if (!(hVObject.fFlags & VOBJECT_FLAG_SHADETABLE_SHARED)) {
      if (hVObject.pShades[x] != null) {
        if (hVObject.pShades[x] == hVObject.p16BPPPalette)
          f16BitPal = true;
        else
          f16BitPal = false;

        hVObject.pShades[x] = <Uint16Array><unknown>null;

        if (f16BitPal)
          hVObject.p16BPPPalette = <Uint16Array><unknown>null;
      }
    }
  }

  if (hVObject.p16BPPPalette != null) {
    hVObject.p16BPPPalette = <Uint16Array><unknown>null;
  }

  hVObject.pShadeCurrent = <Uint16Array><unknown>null;
  hVObject.pGlow = <Uint16Array><unknown>null;

  return true;
}

export function SetObjectShade(pObj: SGPVObject, uiShade: UINT32): boolean {
  Assert(pObj != null);
  Assert(uiShade >= 0);
  Assert(uiShade < HVOBJECT_SHADE_TABLES);

  if (pObj.pShades[uiShade] == null) {
    DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, FormatString("Attempt to set shade level to NULL table"));
    return false;
  }

  pObj.pShadeCurrent = pObj.pShades[uiShade];
  return true;
}

export function SetObjectHandleShade(uiHandle: UINT32, uiShade: UINT32): boolean {
  let hObj: SGPVObject;

  if (!(hObj = GetVideoObject(uiHandle))) {
    DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, FormatString("Invalid object handle for setting shade level"));
    return false;
  }
  return SetObjectShade(hObj, uiShade);
}

/*
UINT16 FillObjectRect(UINT32 iObj, INT32 x1, INT32 y1, INT32 x2, INT32 y2, COLORVAL color32)
{
UINT16	*pBuffer;
UINT32	uiPitch;
//HVSURFACE pSurface;

        // Lock video surface
        pBuffer = (UINT16*)LockVideoSurface(iObj, &uiPitch );
        //UnLockVideoSurface(iObj);


        if (pBuffer == NULL)
                return( FALSE );

        FillRect16BPP(pBuffer, uiPitch, x1, y1, x2, y2, Get16BPPColor(color32));

        // Mark as dirty if it's the backbuffer
        if(iObj == BACKBUFFER)
                InvalidateBackbuffer();

        UnLockVideoSurface(iObj);
}

*/

/********************************************************************************************
        GetETRLEPixelValue

        Given a VOBJECT and ETRLE image index, retrieves the value of the pixel located at the
        given image coordinates. The value returned is an 8-bit palette index
********************************************************************************************/
export function GetETRLEPixelValue(pDest: Pointer<UINT8>, hVObject: SGPVObject, usETRLEIndex: UINT16, usX: UINT16, usY: UINT16): boolean {
  let pCurrent: number;
  let usLoopX: UINT16 = 0;
  let usLoopY: UINT16 = 0;
  let ubRunLength: UINT16;
  let pETRLEObject: ETRLEObject;

  // Do a bunch of checks
  if (hVObject == null) {
    return false;
  }
  if (usETRLEIndex >= hVObject.usNumberOfObjects) {
    return false;
  }

  pETRLEObject = hVObject.pETRLEObject[usETRLEIndex];

  if (usX >= pETRLEObject.usWidth) {
    return false;
  }
  if (usY >= pETRLEObject.usHeight) {
    return false;
  }

  // Assuming everything's okay, go ahead and look...
  pCurrent = pETRLEObject.uiDataOffset;

  // Skip past all uninteresting scanlines
  let pPixData = hVObject.pPixData;
  let byte = pPixData[pCurrent];
  while (usLoopY < usY) {
    byte = pPixData[pCurrent];
    while (byte != 0) {
      if (byte & COMPRESS_TRANSPARENT) {
        pCurrent++;
      } else {
        pCurrent += byte & COMPRESS_RUN_MASK;
      }
    }
    usLoopY++;
  }

  // Now look in this scanline for the appropriate byte
  do {
    ubRunLength = byte & COMPRESS_RUN_MASK;

    if (byte & COMPRESS_TRANSPARENT) {
      if (usLoopX + ubRunLength >= usX) {
        pDest.value = 0;
        return true;
      } else {
        pCurrent++;
      }
    } else {
      if (usLoopX + ubRunLength >= usX) {
        // skip to the correct byte; skip at least 1 to get past the byte defining the run
        pCurrent += (usX - usLoopX) + 1;
        pDest.value = byte;
        return true;
      } else {
        pCurrent += ubRunLength + 1;
      }
    }
    usLoopX += ubRunLength;
  } while (usLoopX < usX);
  // huh???
  return false;
}

export function GetVideoObjectETRLEProperties(hVObject: SGPVObject, pETRLEObject: ETRLEObject, usIndex: UINT16): boolean {
  if (usIndex < 0) {
    return false;
  }
  if (usIndex >= hVObject.usNumberOfObjects) {
    return false;
  }

  copyETRLEObject(pETRLEObject, hVObject.pETRLEObject[usIndex]);

  return true;
}

export function GetVideoObjectETRLESubregionProperties(uiVideoObject: UINT32, usIndex: UINT16): { usWidth: UINT16, usHeight: UINT16 } {
  let hVObject: SGPVObject;
  let ETRLEObject: ETRLEObject = createETRLEObject();

// Get video object
  if (!(hVObject = GetVideoObject(uiVideoObject))) {
    throw new Error('Should be unreachable');
  }

  if (!GetVideoObjectETRLEProperties(hVObject, ETRLEObject, usIndex)) {
    throw new Error('Should be unreachable');
  }

  return { usWidth: ETRLEObject.usWidth, usHeight: ETRLEObject.usHeight };
}

export function GetVideoObjectETRLEPropertiesFromIndex(uiVideoObject: UINT32, pETRLEObject: ETRLEObject, usIndex: UINT16): boolean {
  let hVObject: SGPVObject;

// Get video object
  if (!(hVObject = GetVideoObject(uiVideoObject))) {
    return false;
  }

  if (!GetVideoObjectETRLEProperties(hVObject, pETRLEObject, usIndex)) {
    return false;
  }

  return true;
}

export function BltVideoObjectOutlineFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usIndex: UINT16, iDestX: INT32, iDestY: INT32, s16BPPColor: INT16, fDoOutline: boolean): boolean {
  let pBuffer: Uint8ClampedArray;
  let uiPitch: UINT32 = 0;
  let hSrcVObject: SGPVObject;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, createPointer(() => uiPitch, (v) => uiPitch = v));

  if (pBuffer == null) {
    return false;
  }

// Get video object
  if (!(hSrcVObject = GetVideoObject(uiSrcVObject))) {
    return false;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, ClippingRect)) {
    Blt8BPPDataTo16BPPBufferOutlineClip(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline, ClippingRect);
  } else {
    Blt8BPPDataTo16BPPBufferOutline(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

export function BltVideoObjectOutline(uiDestVSurface: UINT32, hSrcVObject: SGPVObject, usIndex: UINT16, iDestX: INT32, iDestY: INT32, s16BPPColor: INT16, fDoOutline: boolean): boolean {
  let pBuffer: Uint8ClampedArray;
  let uiPitch: UINT32 = 0;
  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, createPointer(() => uiPitch, (v) => uiPitch = v));

  if (pBuffer == null) {
    return false;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, ClippingRect)) {
    Blt8BPPDataTo16BPPBufferOutlineClip(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline, ClippingRect);
  } else {
    Blt8BPPDataTo16BPPBufferOutline(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

export function BltVideoObjectOutlineShadowFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usIndex: UINT16, iDestX: INT32, iDestY: INT32): boolean {
  let pBuffer: Uint8ClampedArray;
  let uiPitch: UINT32 = 0;
  let hSrcVObject: SGPVObject;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, createPointer(() => uiPitch, (v) => uiPitch = v));

  if (pBuffer == null) {
    return false;
  }

// Get video object
  if (!(hSrcVObject = GetVideoObject(uiSrcVObject))) {
    return false;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, ClippingRect)) {
    Blt8BPPDataTo16BPPBufferOutlineShadowClip(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, ClippingRect);
  } else {
    Blt8BPPDataTo16BPPBufferOutlineShadow(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

}
