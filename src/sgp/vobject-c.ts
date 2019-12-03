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

let ghVideoObjects: HLIST = null;
export let gfVideoObjectsInit: boolean = false;

interface VOBJECT_NODE {
  hVObject: HVOBJECT;
  uiIndex: UINT32;

  next: Pointer<VOBJECT_NODE>;
  prev: Pointer<VOBJECT_NODE>;
}

let gpVObjectHead: Pointer<VOBJECT_NODE> = null;
let gpVObjectTail: Pointer<VOBJECT_NODE> = null;
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
  let curr: Pointer<VOBJECT_NODE>;
  while (gpVObjectHead) {
    curr = gpVObjectHead;
    gpVObjectHead = gpVObjectHead.value.next;
    DeleteVideoObject(curr.value.hVObject);
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

function CountVideoObjectNodes(): UINT32 {
  let curr: Pointer<VOBJECT_NODE>;
  let i: UINT32 = 0;
  curr = gpVObjectHead;
  while (curr) {
    i++;
    curr = curr.value.next;
  }
  return i;
}

export function AddStandardVideoObject(pVObjectDesc: VOBJECT_DESC): UINT32 {
  let puiIndex: UINT32;

  let hVObject: HVOBJECT;

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
  if (gpVObjectHead) {
    // Add node after tail
    gpVObjectTail.value.next = MemAlloc(sizeof(VOBJECT_NODE));
    Assert(gpVObjectTail.value.next); // out of memory?
    gpVObjectTail.value.next.value.prev = gpVObjectTail;
    gpVObjectTail.value.next.value.next = null;
    gpVObjectTail = gpVObjectTail.value.next;
  } else {
    // new list
    gpVObjectHead = MemAlloc(sizeof(VOBJECT_NODE));
    Assert(gpVObjectHead); // out of memory?
    gpVObjectHead.value.prev = gpVObjectHead.value.next = null;
    gpVObjectTail = gpVObjectHead;
  }
  // Set the hVObject into the node.
  gpVObjectTail.value.hVObject = hVObject;
  gpVObjectTail.value.uiIndex = guiVObjectIndex += 2;
  puiIndex = gpVObjectTail.value.uiIndex;
  Assert(guiVObjectIndex < 0xfffffff0); // unlikely that we will ever use 2 billion vobjects!
  // We would have to create about 70 vobjects per second for 1 year straight to achieve this...
  guiVObjectSize++;
  guiVObjectTotalAdded++;

  return puiIndex;
}

function SetVideoObjectTransparency(uiIndex: UINT32, TransColor: COLORVAL): boolean {
  let hVObject: HVOBJECT;

// Get video object
  if (!(hVObject = GetVideoObject(uiIndex))) {
    return false;
  }

  // Set transparency
  SetVideoObjectTransparencyColor(hVObject, TransColor);

  return true;
}

export function GetVideoObject(uiIndex: UINT32): HVOBJECT {
  let curr: Pointer<VOBJECT_NODE>;

  curr = gpVObjectHead;
  while (curr) {
    if (curr.value.uiIndex == uiIndex) {
      return curr.value.hVObject;
    }
    curr = curr.value.next;
  }
  return <HVOBJECT><unknown>null;
}

export function BltVideoObjectFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usRegionIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, pBltFx: Pointer<blt_fx>): boolean {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let hSrcVObject: HVOBJECT;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, addressof(uiPitch));

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
  let curr: Pointer<VOBJECT_NODE>;

  curr = gpVObjectHead;
  while (curr) {
    if (curr.value.uiIndex == uiVObject) {
      // Found the node, so detach it and delete it.

      // Deallocate the memory for the video object
      DeleteVideoObject(curr.value.hVObject);

      if (curr == gpVObjectHead) {
        // Advance the head, because we are going to remove the head node.
        gpVObjectHead = gpVObjectHead.value.next;
      }
      if (curr == gpVObjectTail) {
        // Back up the tail, because we are going to remove the tail node.
        gpVObjectTail = gpVObjectTail.value.prev;
      }
      // Detach the node from the vobject list
      if (curr.value.next) {
        // Make the prev node point to the next
        curr.value.next.value.prev = curr.value.prev;
      }
      if (curr.value.prev) {
        // Make the next node point to the prev
        curr.value.prev.value.next = curr.value.next;
      }
// The node is now detached.  Now deallocate it.
      MemFree(curr);
      curr = null;
      guiVObjectSize--;
      return true;
    }
    curr = curr.value.next;
  }
  return false;
}

// Given an index to the dest and src vobject contained in ghVideoObjects
// Based on flags, blit accordingly
// There are two types, a BltFast and a Blt. BltFast is 10% faster, uses no
// clipping lists
export function BltVideoObject(uiDestVSurface: UINT32, hSrcVObject: HVOBJECT, usRegionIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, pBltFx: Pointer<blt_fx>): boolean {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, addressof(uiPitch));

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

export function CreateVideoObject(VObjectDesc: VOBJECT_DESC): HVOBJECT {
  let hVObject: HVOBJECT;
  let hImage: HIMAGE;
  let TempETRLEData: ETRLEData = createETRLEData();
  //	UINT32							count;

  // Allocate memory for video object data and initialize
  hVObject = MemAlloc(sizeof(SGPVObject));
  if (hVObject == null) {
    return false;
  }
  memset(hVObject, 0, sizeof(SGPVObject));

  // default of all members of the vobject is 0

  // Check creation options
  //	do
  //	{
  if (VObjectDesc.value.fCreateFlags & VOBJECT_CREATE_FROMFILE || VObjectDesc.value.fCreateFlags & VOBJECT_CREATE_FROMHIMAGE) {
    if (VObjectDesc.value.fCreateFlags & VOBJECT_CREATE_FROMFILE) {
      // Create himage object from file
      hImage = CreateImage(VObjectDesc.value.ImageFile, IMAGE_ALLIMAGEDATA);

      if (hImage == null) {
        MemFree(hVObject);
        DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid Image Filename given");
        return null;
      }
    } else {
      // create video object from provided hImage
      hImage = VObjectDesc.value.hImage;
      if (hImage == null) {
        MemFree(hVObject);
        DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid hImage pointer given");
        return null;
      }
    }

    // Check if returned himage is TRLE compressed - return error if not
    if (!(hImage.value.fFlags & IMAGE_TRLECOMPRESSED)) {
      MemFree(hVObject);
      DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid Image format given.");
      DestroyImage(hImage);
      return null;
    }

    // Set values from himage
    hVObject.value.ubBitDepth = hImage.value.ubBitDepth;

    // Get TRLE data
    if (!GetETRLEImageData(hImage, addressof(TempETRLEData))) {
      return false;
    }

    // Set values
    hVObject.value.usNumberOfObjects = TempETRLEData.usNumberOfObjects;
    hVObject.value.pETRLEObject = TempETRLEData.pETRLEObject;
    hVObject.value.pPixData = TempETRLEData.pPixData;
    hVObject.value.uiSizePixData = TempETRLEData.uiSizePixData;

    // Set palette from himage
    if (hImage.value.ubBitDepth == 8) {
      hVObject.value.pShade8 = ubColorTables[DEFAULT_SHADE_LEVEL];
      hVObject.value.pGlow8 = ubColorTables[0];

      SetVideoObjectPalette(hVObject, hImage.value.pPalette);
    }

    if (VObjectDesc.value.fCreateFlags & VOBJECT_CREATE_FROMFILE) {
      // Delete himage object
      DestroyImage(hImage);
    }
    //		break;
  } else {
    MemFree(hVObject);
    DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid VObject creation flags given.");
    return null;
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
function SetVideoObjectPalette(hVObject: HVOBJECT, pSrcPalette: Pointer<SGPPaletteEntry>): boolean {
  Assert(hVObject != null);
  Assert(pSrcPalette != null);

  // Create palette object if not already done so
  if (hVObject.value.pPaletteEntry == null) {
    // Create palette
    hVObject.value.pPaletteEntry = MemAlloc(sizeof(SGPPaletteEntry) * 256);
    if (hVObject.value.pPaletteEntry == null) {
      return false;
    }

    // Copy src into palette
    memcpy(hVObject.value.pPaletteEntry, pSrcPalette, sizeof(SGPPaletteEntry) * 256);
  } else {
    // Just Change entries
    memcpy(hVObject.value.pPaletteEntry, pSrcPalette, sizeof(SGPPaletteEntry) * 256);
  }

  // Delete 16BPP Palette if one exists
  if (hVObject.value.p16BPPPalette != null) {
    MemFree(hVObject.value.p16BPPPalette);
    hVObject.value.p16BPPPalette = null;
  }

  // Create 16BPP Palette
  hVObject.value.p16BPPPalette = Create16BPPPalette(pSrcPalette);
  hVObject.value.pShadeCurrent = hVObject.value.p16BPPPalette;

  //  DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_3, String("Video Object Palette change successfull" ));
  return true;
}

// Transparency needs to take RGB value and find best fit and place it into DD Surface
// colorkey value.
function SetVideoObjectTransparencyColor(hVObject: HVOBJECT, TransColor: COLORVAL): boolean {
  // Assertions
  Assert(hVObject != null);

  // Set trans color into video object
  hVObject.value.TransparentColor = TransColor;

  return true;
}

// Deletes all palettes, surfaces and region data
export function DeleteVideoObject(hVObject: HVOBJECT): boolean {
  let usLoop: UINT16;

  // Assertions
  if (hVObject == null) {
    return false;
  }

  DestroyObjectPaletteTables(hVObject);

  // Release palette
  if (hVObject.value.pPaletteEntry != null) {
    MemFree(hVObject.value.pPaletteEntry);
    //		hVObject->pPaletteEntry = NULL;
  }

  if (hVObject.value.pPixData != null) {
    MemFree(hVObject.value.pPixData);
    //		hVObject->pPixData = NULL;
  }

  if (hVObject.value.pETRLEObject != null) {
    MemFree(hVObject.value.pETRLEObject);
    //		hVObject->pETRLEObject = NULL;
  }

  if (hVObject.value.ppZStripInfo != null) {
    for (usLoop = 0; usLoop < hVObject.value.usNumberOfObjects; usLoop++) {
      if (hVObject.value.ppZStripInfo[usLoop] != null) {
        MemFree(hVObject.value.ppZStripInfo[usLoop].value.pbZChange);
        MemFree(hVObject.value.ppZStripInfo[usLoop]);
      }
    }
    MemFree(hVObject.value.ppZStripInfo);
    //		hVObject->ppZStripInfo = NULL;
  }

  if (hVObject.value.usNumberOf16BPPObjects > 0) {
    for (usLoop = 0; usLoop < hVObject.value.usNumberOf16BPPObjects; usLoop++) {
      MemFree(hVObject.value.p16BPPObject[usLoop].p16BPPData);
    }
    MemFree(hVObject.value.p16BPPObject);
  }

  // Release object
  MemFree(hVObject);

  return true;
}

/**********************************************************************************************
 CreateObjectPaletteTables

                Creates the shading tables for 8-bit brushes. One highlight table is created, based on
        the object-type, 3 brightening tables, 1 normal, and 11 darkening tables. The entries are
        created iteratively, rather than in a loop to allow hand-tweaking of the values. If you
        change the HVOBJECT_SHADE_TABLES symbol, remember to add/delete entries here, it won't
        adjust automagically.

**********************************************************************************************/

function CreateObjectPaletteTables(pObj: HVOBJECT, uiType: UINT32): UINT16 {
  let count: UINT32;

  // this creates the highlight table. Specify the glow-type when creating the tables
  // through uiType, symbols are from VOBJECT.H
  for (count = 0; count < 16; count++) {
    if ((count == 4) && (pObj.value.p16BPPPalette == pObj.value.pShades[count]))
      pObj.value.pShades[count] = null;
    else if (pObj.value.pShades[count] != null) {
      MemFree(pObj.value.pShades[count]);
      pObj.value.pShades[count] = null;
    }
  }

  switch (uiType) {
    case HVOBJECT_GLOW_GREEN: // green glow
      pObj.value.pShades[0] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 0, 255, 0, true);
      break;
    case HVOBJECT_GLOW_BLUE: // blue glow
      pObj.value.pShades[0] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 0, 0, 255, true);
      break;
    case HVOBJECT_GLOW_YELLOW: // yellow glow
      pObj.value.pShades[0] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 255, 255, 0, true);
      break;
    case HVOBJECT_GLOW_RED: // red glow
      pObj.value.pShades[0] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 255, 0, 0, true);
      break;
  }

  // these are the brightening tables, 115%-150% brighter than original
  pObj.value.pShades[1] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 293, 293, 293, false);
  pObj.value.pShades[2] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 281, 281, 281, false);
  pObj.value.pShades[3] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 268, 268, 268, false);

  // palette 4 is the non-modified palette.
  // if the standard one has already been made, we'll use it
  if (pObj.value.p16BPPPalette != null)
    pObj.value.pShades[4] = pObj.value.p16BPPPalette;
  else {
    // or create our own, and assign it to the standard one
    pObj.value.pShades[4] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 255, 255, 255, false);
    pObj.value.p16BPPPalette = pObj.value.pShades[4];
  }

  // the rest are darkening tables, right down to all-black.
  pObj.value.pShades[5] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 195, 195, 195, false);
  pObj.value.pShades[6] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 165, 165, 165, false);
  pObj.value.pShades[7] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 135, 135, 135, false);
  pObj.value.pShades[8] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 105, 105, 105, false);
  pObj.value.pShades[9] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 75, 75, 75, false);
  pObj.value.pShades[10] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 45, 45, 45, false);
  pObj.value.pShades[11] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 36, 36, 36, false);
  pObj.value.pShades[12] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 27, 27, 27, false);
  pObj.value.pShades[13] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 18, 18, 18, false);
  pObj.value.pShades[14] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 9, 9, 9, false);
  pObj.value.pShades[15] = Create16BPPPaletteShaded(pObj.value.pPaletteEntry, 0, 0, 0, false);

  // Set current shade table to neutral color
  pObj.value.pShadeCurrent = pObj.value.pShades[4];

  // check to make sure every table got a palette
  for (count = 0; (count < HVOBJECT_SHADE_TABLES) && (pObj.value.pShades[count] != null); count++)
    ;

  // return the result of the check
  return count == HVOBJECT_SHADE_TABLES;
}

// *******************************************************************
//
// Blitting Functions
//
// *******************************************************************

// High level blit function encapsolates ALL effects and BPP
function BltVideoObjectToBuffer(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, hSrcVObject: HVOBJECT, usIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: INT32, pBltFx: Pointer<blt_fx>): boolean {
  // Assertions
  Assert(pBuffer != null);

  if (hSrcVObject == null) {
    let i: number = 0;
  }

  Assert(hSrcVObject != null);

  // Check For Flags and bit depths
  switch (hSrcVObject.value.ubBitDepth) {
    case 16:

      break;

    case 8:

      // Switch based on flags given
      do {
        if (gbPixelDepth == 16) {
              if (fBltFlags & VO_BLT_SRCTRANSPARENCY) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect)))
              Blt8BPPDataTo16BPPBufferTransparentClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect));
            else
              Blt8BPPDataTo16BPPBufferTransparent(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          } else if (fBltFlags & VO_BLT_SHADOW) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect)))
              Blt8BPPDataTo16BPPBufferShadowClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect));
            else
              Blt8BPPDataTo16BPPBufferShadow(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          }
        } else if (gbPixelDepth == 8) {
          if (fBltFlags & VO_BLT_SRCTRANSPARENCY) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect)))
              Blt8BPPDataTo8BPPBufferTransparentClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect));
            else
              Blt8BPPDataTo8BPPBufferTransparent(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          } else if (fBltFlags & VO_BLT_SHADOW) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect)))
              Blt8BPPDataTo8BPPBufferShadowClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect));
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

function PixelateVideoObjectRect(uiDestVSurface: UINT32, X1: INT32, Y1: INT32, X2: INT32, Y2: INT32): boolean {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let area: SGPRect = createSGPRect();
  let uiPattern: UINT8[][] /* [8][8] */ = [
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
  ];

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, addressof(uiPitch));

  if (pBuffer == null) {
    return false;
  }

  area.iTop = Y1;
  area.iBottom = Y2;
  area.iLeft = X1;
  area.iRight = X2;

  // Now we have the video object and surface, call the shadow function
  if (!Blt16BPPBufferPixelateRect(pBuffer, uiPitch, addressof(area), uiPattern)) {
    UnLockVideoSurface(uiDestVSurface);
    // Blit has failed if false returned
    return false;
  }

  // Mark as dirty if it's the backbuffer
  // if ( uiDestVSurface == BACKBUFFER )
  //{
  //	InvalidateBackbuffer( );
  //}

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

/**********************************************************************************************
 DestroyObjectPaletteTables

        Destroys the palette tables of a video object. All memory is deallocated, and
        the pointers set to NULL. Be careful not to try and blit this object until new
        tables are calculated, or things WILL go boom.

**********************************************************************************************/
export function DestroyObjectPaletteTables(hVObject: HVOBJECT): boolean {
  let x: UINT32;
  let f16BitPal: boolean;

  for (x = 0; x < HVOBJECT_SHADE_TABLES; x++) {
    if (!(hVObject.value.fFlags & VOBJECT_FLAG_SHADETABLE_SHARED)) {
      if (hVObject.value.pShades[x] != null) {
        if (hVObject.value.pShades[x] == hVObject.value.p16BPPPalette)
          f16BitPal = true;
        else
          f16BitPal = false;

        MemFree(hVObject.value.pShades[x]);
        hVObject.value.pShades[x] = null;

        if (f16BitPal)
          hVObject.value.p16BPPPalette = null;
      }
    }
  }

  if (hVObject.value.p16BPPPalette != null) {
    MemFree(hVObject.value.p16BPPPalette);
    hVObject.value.p16BPPPalette = null;
  }

  hVObject.value.pShadeCurrent = null;
  hVObject.value.pGlow = null;

  return true;
}

export function SetObjectShade(pObj: HVOBJECT, uiShade: UINT32): UINT16 {
  Assert(pObj != null);
  Assert(uiShade >= 0);
  Assert(uiShade < HVOBJECT_SHADE_TABLES);

  if (pObj.value.pShades[uiShade] == null) {
    DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, FormatString("Attempt to set shade level to NULL table"));
    return false;
  }

  pObj.value.pShadeCurrent = pObj.value.pShades[uiShade];
  return true;
}

export function SetObjectHandleShade(uiHandle: UINT32, uiShade: UINT32): UINT16 {
  let hObj: HVOBJECT;

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
export function GetETRLEPixelValue(pDest: Pointer<UINT8>, hVObject: HVOBJECT, usETRLEIndex: UINT16, usX: UINT16, usY: UINT16): boolean {
  let pCurrent: Pointer<UINT8>;
  let usLoopX: UINT16 = 0;
  let usLoopY: UINT16 = 0;
  let ubRunLength: UINT16;
  let pETRLEObject: Pointer<ETRLEObject>;

  // Do a bunch of checks
  if (hVObject == null) {
    return false;
  }
  if (usETRLEIndex >= hVObject.value.usNumberOfObjects) {
    return false;
  }

  pETRLEObject = addressof(hVObject.value.pETRLEObject[usETRLEIndex]);

  if (usX >= pETRLEObject.value.usWidth) {
    return false;
  }
  if (usY >= pETRLEObject.value.usHeight) {
    return false;
  }

  // Assuming everything's okay, go ahead and look...
  pCurrent = addressof((hVObject.value.pPixData)[pETRLEObject.value.uiDataOffset]);

  // Skip past all uninteresting scanlines
  while (usLoopY < usY) {
    while (pCurrent.value != 0) {
      if (pCurrent.value & COMPRESS_TRANSPARENT) {
        pCurrent++;
      } else {
        pCurrent += pCurrent.value & COMPRESS_RUN_MASK;
      }
    }
    usLoopY++;
  }

  // Now look in this scanline for the appropriate byte
  do {
    ubRunLength = pCurrent.value & COMPRESS_RUN_MASK;

    if (pCurrent.value & COMPRESS_TRANSPARENT) {
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
        pDest.value = pCurrent.value;
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

export function GetVideoObjectETRLEProperties(hVObject: HVOBJECT, pETRLEObject: Pointer<ETRLEObject>, usIndex: UINT16): boolean {
  if (usIndex < 0) {
    return false;
  }
  if (usIndex >= hVObject.value.usNumberOfObjects) {
    return false;
  }

  memcpy(pETRLEObject, addressof(hVObject.value.pETRLEObject[usIndex]), sizeof(ETRLEObject));

  return true;
}

export function GetVideoObjectETRLESubregionProperties(uiVideoObject: UINT32, usIndex: UINT16): { usWidth: UINT16, usHeight: UINT16 } {
  let hVObject: HVOBJECT;
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
  let hVObject: HVOBJECT;

// Get video object
  if (!(hVObject = GetVideoObject(uiVideoObject))) {
    return false;
  }

  if (!GetVideoObjectETRLEProperties(hVObject, pETRLEObject, usIndex)) {
    return false;
  }

  return true;
}

function SetVideoObjectPalette8BPP(uiVideoObject: INT32, pPal8: Pointer<SGPPaletteEntry>): boolean {
  let hVObject: HVOBJECT;

// Get video object
  if (!(hVObject = GetVideoObject(uiVideoObject))) {
    return false;
  }

  return SetVideoObjectPalette(hVObject, pPal8);
}

function GetVideoObjectPalette16BPP(uiVideoObject: INT32, ppPal16: Pointer<Pointer<UINT16>>): boolean {
  let hVObject: HVOBJECT;

// Get video object
  if (!(hVObject = GetVideoObject(uiVideoObject))) {
    return false;
  }

  ppPal16.value = hVObject.value.p16BPPPalette;

  return true;
}

function CopyVideoObjectPalette16BPP(uiVideoObject: INT32, ppPal16: Pointer<UINT16>): boolean {
  let hVObject: HVOBJECT;

// Get video object
  if (!(hVObject = GetVideoObject(uiVideoObject))) {
    return false;
  }

  memcpy(ppPal16, hVObject.value.p16BPPPalette, 256 * 2);

  return true;
}

function CheckFor16BPPRegion(hVObject: HVOBJECT, usRegionIndex: UINT16, ubShadeLevel: UINT8, pusIndex: Pointer<UINT16>): boolean {
  let usLoop: UINT16;
  let p16BPPObject: Pointer<SixteenBPPObjectInfo>;

  if (hVObject.value.usNumberOf16BPPObjects > 0) {
    for (usLoop = 0; usLoop < hVObject.value.usNumberOf16BPPObjects; usLoop++) {
      p16BPPObject = addressof(hVObject.value.p16BPPObject[usLoop]);
      if (p16BPPObject.value.usRegionIndex == usRegionIndex && p16BPPObject.value.ubShadeLevel == ubShadeLevel) {
        if (pusIndex != null) {
          pusIndex.value = usLoop;
        }
        return true;
      }
    }
  }
  return false;
}

function ConvertVObjectRegionTo16BPP(hVObject: HVOBJECT, usRegionIndex: UINT16, ubShadeLevel: UINT8): boolean {
  let p16BPPObject: Pointer<SixteenBPPObjectInfo>;
  let pInput: Pointer<UINT8>;
  let pOutput: Pointer<UINT8>;
  let p16BPPPalette: Pointer<UINT16>;
  let uiDataLoop: UINT32;
  let uiDataLength: UINT32;
  let ubRunLoop: UINT8;
  // UINT8					ubRunLength;
  let bData: INT8;
  let uiLen: UINT32;

  // check for existing 16BPP region and then allocate memory
  if (usRegionIndex >= hVObject.value.usNumberOfObjects || ubShadeLevel >= HVOBJECT_SHADE_TABLES) {
    return false;
  }
  if (CheckFor16BPPRegion(hVObject, usRegionIndex, ubShadeLevel, null) == true) {
    // it already exists; no need to do anything!
    return true;
  }

  if (hVObject.value.usNumberOf16BPPObjects > 0) {
    // have to reallocate memory
    hVObject.value.p16BPPObject = MemRealloc(hVObject.value.p16BPPObject, sizeof(SixteenBPPObjectInfo) * (hVObject.value.usNumberOf16BPPObjects + 1));
  } else {
    // allocate memory for the first 16BPPObject
    hVObject.value.p16BPPObject = MemAlloc(sizeof(SixteenBPPObjectInfo));
  }
  if (hVObject.value.p16BPPObject == null) {
    hVObject.value.usNumberOf16BPPObjects = 0;
    return false;
  }

  // the new object is the last one in the array
  p16BPPObject = addressof(hVObject.value.p16BPPObject[hVObject.value.usNumberOf16BPPObjects]);

  // need twice as much memory because of going from 8 to 16 bits
  p16BPPObject.value.p16BPPData = MemAlloc(hVObject.value.pETRLEObject[usRegionIndex].uiDataLength * 2);
  if (p16BPPObject.value.p16BPPData == null) {
    return false;
  }

  p16BPPObject.value.usRegionIndex = usRegionIndex;
  p16BPPObject.value.ubShadeLevel = ubShadeLevel;
  p16BPPObject.value.usHeight = hVObject.value.pETRLEObject[usRegionIndex].usHeight;
  p16BPPObject.value.usWidth = hVObject.value.pETRLEObject[usRegionIndex].usWidth;
  p16BPPObject.value.sOffsetX = hVObject.value.pETRLEObject[usRegionIndex].sOffsetX;
  p16BPPObject.value.sOffsetY = hVObject.value.pETRLEObject[usRegionIndex].sOffsetY;

  // get the palette
  p16BPPPalette = hVObject.value.pShades[ubShadeLevel];
  pInput = hVObject.value.pPixData + hVObject.value.pETRLEObject[usRegionIndex].uiDataOffset;

  uiDataLength = hVObject.value.pETRLEObject[usRegionIndex].uiDataLength;

  // now actually do the conversion

  uiLen = 0;
  pOutput = p16BPPObject.value.p16BPPData;
  for (uiDataLoop = 0; uiDataLoop < uiDataLength; uiDataLoop++) {
    bData = pInput.value;
    if (bData & 0x80) {
      // transparent
      pOutput.value = pInput.value;
      pOutput++;
      pInput++;
      // uiDataLoop++;
      uiLen += (bData & 0x7f);
    } else if (bData > 0) {
      // nontransparent
      pOutput.value = pInput.value;
      pOutput++;
      pInput++;
      // uiDataLoop++;
      for (ubRunLoop = 0; ubRunLoop < bData; ubRunLoop++) {
        (pOutput).value = p16BPPPalette[pInput.value];
        pOutput++;
        pOutput++;
        pInput++;
        uiDataLoop++;
      }
      uiLen += bData;
    } else {
      // eol
      pOutput.value = pInput.value;
      pOutput++;
      pInput++;
      // uiDataLoop++;
      if (uiLen != p16BPPObject.value.usWidth)
        DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_1, FormatString("Actual pixel width different from header width"));
      uiLen = 0;
    }

    // copy the run-length byte
    /*	*pOutput = *pInput;
            pOutput++;
            if (((*pInput) & COMPRESS_TRANSPARENT) == 0 && *pInput > 0)
            {
                    // non-transparent run; deal with the pixel data
                    ubRunLoop = 0;
                    ubRunLength = ((*pInput) & COMPRESS_RUN_LIMIT);
                    // skip to the next input byte
                    pInput++;
                    for (ubRunLoop = 0; ubRunLoop < ubRunLength; ubRunLoop++)
                    {
                            *((UINT16 *)pOutput) = p16BPPPalette[*pInput];
                            // advance two bytes in output, one in input
                            pOutput++;
                            pOutput++;
                            pInput++;
                            uiDataLoop++;
                    }
            }
            else
            {
                    // transparent run or end of scanline; skip to the next input byte
                    pInput++;
            } */
  }
  hVObject.value.usNumberOf16BPPObjects++;
  return true;
}

export function BltVideoObjectOutlineFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usIndex: UINT16, iDestX: INT32, iDestY: INT32, s16BPPColor: INT16, fDoOutline: boolean): boolean {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let hSrcVObject: HVOBJECT;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, addressof(uiPitch));

  if (pBuffer == null) {
    return false;
  }

// Get video object
  if (!(hSrcVObject = GetVideoObject(uiSrcVObject))) {
    return false;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect))) {
    Blt8BPPDataTo16BPPBufferOutlineClip(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline, addressof(ClippingRect));
  } else {
    Blt8BPPDataTo16BPPBufferOutline(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

export function BltVideoObjectOutline(uiDestVSurface: UINT32, hSrcVObject: HVOBJECT, usIndex: UINT16, iDestX: INT32, iDestY: INT32, s16BPPColor: INT16, fDoOutline: boolean): boolean {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, addressof(uiPitch));

  if (pBuffer == null) {
    return false;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect))) {
    Blt8BPPDataTo16BPPBufferOutlineClip(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline, addressof(ClippingRect));
  } else {
    Blt8BPPDataTo16BPPBufferOutline(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

export function BltVideoObjectOutlineShadowFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usIndex: UINT16, iDestX: INT32, iDestY: INT32): boolean {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let hSrcVObject: HVOBJECT;

  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, addressof(uiPitch));

  if (pBuffer == null) {
    return false;
  }

// Get video object
  if (!(hSrcVObject = GetVideoObject(uiSrcVObject))) {
    return false;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect))) {
    Blt8BPPDataTo16BPPBufferOutlineShadowClip(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect));
  } else {
    Blt8BPPDataTo16BPPBufferOutlineShadow(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

function BltVideoObjectOutlineShadow(uiDestVSurface: UINT32, hSrcVObject: HVOBJECT, usIndex: UINT16, iDestX: INT32, iDestY: INT32): boolean {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  // Lock video surface
  pBuffer = LockVideoSurface(uiDestVSurface, addressof(uiPitch));

  if (pBuffer == null) {
    return false;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect))) {
    Blt8BPPDataTo16BPPBufferOutlineShadowClip(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, addressof(ClippingRect));
  } else {
    Blt8BPPDataTo16BPPBufferOutlineShadow(pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return true;
}

}
