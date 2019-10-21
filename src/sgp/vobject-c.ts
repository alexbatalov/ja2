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

let ghVideoObjects: HLIST = NULL;
let gfVideoObjectsInit: BOOLEAN = FALSE;

interface VOBJECT_NODE {
  hVObject: HVOBJECT;
  uiIndex: UINT32;

  next: Pointer<VOBJECT_NODE>;
  prev: Pointer<VOBJECT_NODE>;
}

let gpVObjectHead: Pointer<VOBJECT_NODE> = NULL;
let gpVObjectTail: Pointer<VOBJECT_NODE> = NULL;
let guiVObjectIndex: UINT32 = 1;
let guiVObjectSize: UINT32 = 0;
let guiVObjectTotalAdded: UINT32 = 0;

// **************************************************************
//
// Video Object Manager functions
//
// **************************************************************

function InitializeVideoObjectManager(): BOOLEAN {
  // Shouldn't be calling this if the video object manager already exists.
  // Call shutdown first...
  Assert(!gpVObjectHead);
  Assert(!gpVObjectTail);
  RegisterDebugTopic(TOPIC_VIDEOOBJECT, "Video Object Manager");
  gpVObjectHead = gpVObjectTail = NULL;
  gfVideoObjectsInit = TRUE;
  return TRUE;
}

function ShutdownVideoObjectManager(): BOOLEAN {
  let curr: Pointer<VOBJECT_NODE>;
  while (gpVObjectHead) {
    curr = gpVObjectHead;
    gpVObjectHead = gpVObjectHead->next;
    DeleteVideoObject(curr->hVObject);
    MemFree(curr);
  }
  gpVObjectHead = NULL;
  gpVObjectTail = NULL;
  guiVObjectIndex = 1;
  guiVObjectSize = 0;
  guiVObjectTotalAdded = 0;
  UnRegisterDebugTopic(TOPIC_VIDEOOBJECT, "Video Objects");
  gfVideoObjectsInit = FALSE;
  return TRUE;
}

function CountVideoObjectNodes(): UINT32 {
  let curr: Pointer<VOBJECT_NODE>;
  let i: UINT32 = 0;
  curr = gpVObjectHead;
  while (curr) {
    i++;
    curr = curr->next;
  }
  return i;
}

function AddStandardVideoObject(pVObjectDesc: Pointer<VOBJECT_DESC>, puiIndex: Pointer<UINT32>): BOOLEAN {
  let hVObject: HVOBJECT;

  // Assertions
  Assert(puiIndex);
  Assert(pVObjectDesc);

  // Create video object
  hVObject = CreateVideoObject(pVObjectDesc);

  if (!hVObject) {
    // Video Object will set error condition.
    return FALSE;
  }

  // Set transparency to default
  SetVideoObjectTransparencyColor(hVObject, FROMRGB(0, 0, 0));

  // Set into video object list
  if (gpVObjectHead) {
    // Add node after tail
    gpVObjectTail->next = (VOBJECT_NODE *)MemAlloc(sizeof(VOBJECT_NODE));
    Assert(gpVObjectTail->next); // out of memory?
    gpVObjectTail->next->prev = gpVObjectTail;
    gpVObjectTail->next->next = NULL;
    gpVObjectTail = gpVObjectTail->next;
  } else {
    // new list
    gpVObjectHead = (VOBJECT_NODE *)MemAlloc(sizeof(VOBJECT_NODE));
    Assert(gpVObjectHead); // out of memory?
    gpVObjectHead->prev = gpVObjectHead->next = NULL;
    gpVObjectTail = gpVObjectHead;
  }
  // Set the hVObject into the node.
  gpVObjectTail->hVObject = hVObject;
  gpVObjectTail->uiIndex = guiVObjectIndex += 2;
  *puiIndex = gpVObjectTail->uiIndex;
  Assert(guiVObjectIndex < 0xfffffff0); // unlikely that we will ever use 2 billion vobjects!
  // We would have to create about 70 vobjects per second for 1 year straight to achieve this...
  guiVObjectSize++;
  guiVObjectTotalAdded++;

  return TRUE;
}

function SetVideoObjectTransparency(uiIndex: UINT32, TransColor: COLORVAL): BOOLEAN {
  let hVObject: HVOBJECT;

// Get video object
  CHECKF(GetVideoObject(&hVObject, uiIndex));

  // Set transparency
  SetVideoObjectTransparencyColor(hVObject, TransColor);

  return TRUE;
}

function GetVideoObject(hVObject: Pointer<HVOBJECT>, uiIndex: UINT32): BOOLEAN {
  let curr: Pointer<VOBJECT_NODE>;

  curr = gpVObjectHead;
  while (curr) {
    if (curr->uiIndex == uiIndex) {
      *hVObject = curr->hVObject;
      return TRUE;
    }
    curr = curr->next;
  }
  return FALSE;
}

function BltVideoObjectFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usRegionIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, pBltFx: Pointer<blt_fx>): BOOLEAN {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let hSrcVObject: HVOBJECT;

  // Lock video surface
  pBuffer = (UINT16 *)LockVideoSurface(uiDestVSurface, &uiPitch);

  if (pBuffer == NULL) {
    return FALSE;
  }

// Get video object
  if (!GetVideoObject(&hSrcVObject, uiSrcVObject)) {
    UnLockVideoSurface(uiDestVSurface);
    return FALSE;
  }

  // Now we have the video object and surface, call the VO blitter function
  if (!BltVideoObjectToBuffer(pBuffer, uiPitch, hSrcVObject, usRegionIndex, iDestX, iDestY, fBltFlags, pBltFx)) {
    UnLockVideoSurface(uiDestVSurface);
    // VO Blitter will set debug messages for error conditions
    return FALSE;
  }

  UnLockVideoSurface(uiDestVSurface);
  return TRUE;
}

function DeleteVideoObjectFromIndex(uiVObject: UINT32): BOOLEAN {
  let curr: Pointer<VOBJECT_NODE>;

  curr = gpVObjectHead;
  while (curr) {
    if (curr->uiIndex == uiVObject) {
      // Found the node, so detach it and delete it.

      // Deallocate the memory for the video object
      DeleteVideoObject(curr->hVObject);

      if (curr == gpVObjectHead) {
        // Advance the head, because we are going to remove the head node.
        gpVObjectHead = gpVObjectHead->next;
      }
      if (curr == gpVObjectTail) {
        // Back up the tail, because we are going to remove the tail node.
        gpVObjectTail = gpVObjectTail->prev;
      }
      // Detach the node from the vobject list
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
      curr = NULL;
      guiVObjectSize--;
      return TRUE;
    }
    curr = curr->next;
  }
  return FALSE;
}

// Given an index to the dest and src vobject contained in ghVideoObjects
// Based on flags, blit accordingly
// There are two types, a BltFast and a Blt. BltFast is 10% faster, uses no
// clipping lists
function BltVideoObject(uiDestVSurface: UINT32, hSrcVObject: HVOBJECT, usRegionIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: UINT32, pBltFx: Pointer<blt_fx>): BOOLEAN {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;

  // Lock video surface
  pBuffer = (UINT16 *)LockVideoSurface(uiDestVSurface, &uiPitch);

  if (pBuffer == NULL) {
    return FALSE;
  }

  // Now we have the video object and surface, call the VO blitter function
  if (!BltVideoObjectToBuffer(pBuffer, uiPitch, hSrcVObject, usRegionIndex, iDestX, iDestY, fBltFlags, pBltFx)) {
    UnLockVideoSurface(uiDestVSurface);
    // VO Blitter will set debug messages for error conditions
    return FALSE;
  }

  UnLockVideoSurface(uiDestVSurface);
  return TRUE;
}

// *******************************************************************************
// Video Object Manipulation Functions
// *******************************************************************************

function CreateVideoObject(VObjectDesc: Pointer<VOBJECT_DESC>): HVOBJECT {
  let hVObject: HVOBJECT;
  let hImage: HIMAGE;
  let TempETRLEData: ETRLEData;
  //	UINT32							count;

  // Allocate memory for video object data and initialize
  hVObject = MemAlloc(sizeof(SGPVObject));
  CHECKF(hVObject != NULL);
  memset(hVObject, 0, sizeof(SGPVObject));

  // default of all members of the vobject is 0

  // Check creation options
  //	do
  //	{
  if (VObjectDesc->fCreateFlags & VOBJECT_CREATE_FROMFILE || VObjectDesc->fCreateFlags & VOBJECT_CREATE_FROMHIMAGE) {
    if (VObjectDesc->fCreateFlags & VOBJECT_CREATE_FROMFILE) {
      // Create himage object from file
      hImage = CreateImage(VObjectDesc->ImageFile, IMAGE_ALLIMAGEDATA);

      if (hImage == NULL) {
        MemFree(hVObject);
        DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid Image Filename given");
        return NULL;
      }
    } else {
      // create video object from provided hImage
      hImage = VObjectDesc->hImage;
      if (hImage == NULL) {
        MemFree(hVObject);
        DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid hImage pointer given");
        return NULL;
      }
    }

    // Check if returned himage is TRLE compressed - return error if not
    if (!(hImage->fFlags & IMAGE_TRLECOMPRESSED)) {
      MemFree(hVObject);
      DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid Image format given.");
      DestroyImage(hImage);
      return NULL;
    }

    // Set values from himage
    hVObject->ubBitDepth = hImage->ubBitDepth;

    // Get TRLE data
    CHECKF(GetETRLEImageData(hImage, &TempETRLEData));

    // Set values
    hVObject->usNumberOfObjects = TempETRLEData.usNumberOfObjects;
    hVObject->pETRLEObject = TempETRLEData.pETRLEObject;
    hVObject->pPixData = TempETRLEData.pPixData;
    hVObject->uiSizePixData = TempETRLEData.uiSizePixData;

    // Set palette from himage
    if (hImage->ubBitDepth == 8) {
      hVObject->pShade8 = ubColorTables[DEFAULT_SHADE_LEVEL];
      hVObject->pGlow8 = ubColorTables[0];

      SetVideoObjectPalette(hVObject, hImage->pPalette);
    }

    if (VObjectDesc->fCreateFlags & VOBJECT_CREATE_FROMFILE) {
      // Delete himage object
      DestroyImage(hImage);
    }
    //		break;
  } else {
    MemFree(hVObject);
    DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, "Invalid VObject creation flags given.");
    return NULL;
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
function SetVideoObjectPalette(hVObject: HVOBJECT, pSrcPalette: Pointer<SGPPaletteEntry>): BOOLEAN {
  Assert(hVObject != NULL);
  Assert(pSrcPalette != NULL);

  // Create palette object if not already done so
  if (hVObject->pPaletteEntry == NULL) {
    // Create palette
    hVObject->pPaletteEntry = MemAlloc(sizeof(SGPPaletteEntry) * 256);
    CHECKF(hVObject->pPaletteEntry != NULL);

    // Copy src into palette
    memcpy(hVObject->pPaletteEntry, pSrcPalette, sizeof(SGPPaletteEntry) * 256);
  } else {
    // Just Change entries
    memcpy(hVObject->pPaletteEntry, pSrcPalette, sizeof(SGPPaletteEntry) * 256);
  }

  // Delete 16BPP Palette if one exists
  if (hVObject->p16BPPPalette != NULL) {
    MemFree(hVObject->p16BPPPalette);
    hVObject->p16BPPPalette = NULL;
  }

  // Create 16BPP Palette
  hVObject->p16BPPPalette = Create16BPPPalette(pSrcPalette);
  hVObject->pShadeCurrent = hVObject->p16BPPPalette;

  //  DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_3, String("Video Object Palette change successfull" ));
  return TRUE;
}

// Transparency needs to take RGB value and find best fit and place it into DD Surface
// colorkey value.
function SetVideoObjectTransparencyColor(hVObject: HVOBJECT, TransColor: COLORVAL): BOOLEAN {
  // Assertions
  Assert(hVObject != NULL);

  // Set trans color into video object
  hVObject->TransparentColor = TransColor;

  return TRUE;
}

// Deletes all palettes, surfaces and region data
function DeleteVideoObject(hVObject: HVOBJECT): BOOLEAN {
  let usLoop: UINT16;

  // Assertions
  CHECKF(hVObject != NULL);

  DestroyObjectPaletteTables(hVObject);

  // Release palette
  if (hVObject->pPaletteEntry != NULL) {
    MemFree(hVObject->pPaletteEntry);
    //		hVObject->pPaletteEntry = NULL;
  }

  if (hVObject->pPixData != NULL) {
    MemFree(hVObject->pPixData);
    //		hVObject->pPixData = NULL;
  }

  if (hVObject->pETRLEObject != NULL) {
    MemFree(hVObject->pETRLEObject);
    //		hVObject->pETRLEObject = NULL;
  }

  if (hVObject->ppZStripInfo != NULL) {
    for (usLoop = 0; usLoop < hVObject->usNumberOfObjects; usLoop++) {
      if (hVObject->ppZStripInfo[usLoop] != NULL) {
        MemFree(hVObject->ppZStripInfo[usLoop]->pbZChange);
        MemFree(hVObject->ppZStripInfo[usLoop]);
      }
    }
    MemFree(hVObject->ppZStripInfo);
    //		hVObject->ppZStripInfo = NULL;
  }

  if (hVObject->usNumberOf16BPPObjects > 0) {
    for (usLoop = 0; usLoop < hVObject->usNumberOf16BPPObjects; usLoop++) {
      MemFree(hVObject->p16BPPObject[usLoop].p16BPPData);
    }
    MemFree(hVObject->p16BPPObject);
  }

  // Release object
  MemFree(hVObject);

  return TRUE;
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
    if ((count == 4) && (pObj->p16BPPPalette == pObj->pShades[count]))
      pObj->pShades[count] = NULL;
    else if (pObj->pShades[count] != NULL) {
      MemFree(pObj->pShades[count]);
      pObj->pShades[count] = NULL;
    }
  }

  switch (uiType) {
    case HVOBJECT_GLOW_GREEN: // green glow
      pObj->pShades[0] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 0, 255, 0, TRUE);
      break;
    case HVOBJECT_GLOW_BLUE: // blue glow
      pObj->pShades[0] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 0, 0, 255, TRUE);
      break;
    case HVOBJECT_GLOW_YELLOW: // yellow glow
      pObj->pShades[0] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 255, 255, 0, TRUE);
      break;
    case HVOBJECT_GLOW_RED: // red glow
      pObj->pShades[0] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 255, 0, 0, TRUE);
      break;
  }

  // these are the brightening tables, 115%-150% brighter than original
  pObj->pShades[1] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 293, 293, 293, FALSE);
  pObj->pShades[2] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 281, 281, 281, FALSE);
  pObj->pShades[3] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 268, 268, 268, FALSE);

  // palette 4 is the non-modified palette.
  // if the standard one has already been made, we'll use it
  if (pObj->p16BPPPalette != NULL)
    pObj->pShades[4] = pObj->p16BPPPalette;
  else {
    // or create our own, and assign it to the standard one
    pObj->pShades[4] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 255, 255, 255, FALSE);
    pObj->p16BPPPalette = pObj->pShades[4];
  }

  // the rest are darkening tables, right down to all-black.
  pObj->pShades[5] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 195, 195, 195, FALSE);
  pObj->pShades[6] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 165, 165, 165, FALSE);
  pObj->pShades[7] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 135, 135, 135, FALSE);
  pObj->pShades[8] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 105, 105, 105, FALSE);
  pObj->pShades[9] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 75, 75, 75, FALSE);
  pObj->pShades[10] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 45, 45, 45, FALSE);
  pObj->pShades[11] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 36, 36, 36, FALSE);
  pObj->pShades[12] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 27, 27, 27, FALSE);
  pObj->pShades[13] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 18, 18, 18, FALSE);
  pObj->pShades[14] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 9, 9, 9, FALSE);
  pObj->pShades[15] = Create16BPPPaletteShaded(pObj->pPaletteEntry, 0, 0, 0, FALSE);

  // Set current shade table to neutral color
  pObj->pShadeCurrent = pObj->pShades[4];

  // check to make sure every table got a palette
  for (count = 0; (count < HVOBJECT_SHADE_TABLES) && (pObj->pShades[count] != NULL); count++)
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
function BltVideoObjectToBuffer(pBuffer: Pointer<UINT16>, uiDestPitchBYTES: UINT32, hSrcVObject: HVOBJECT, usIndex: UINT16, iDestX: INT32, iDestY: INT32, fBltFlags: INT32, pBltFx: Pointer<blt_fx>): BOOLEAN {
  // Assertions
  Assert(pBuffer != NULL);

  if (hSrcVObject == NULL) {
    let i: int = 0;
  }

  Assert(hSrcVObject != NULL);

  // Check For Flags and bit depths
  switch (hSrcVObject->ubBitDepth) {
    case 16:

      break;

    case 8:

      // Switch based on flags given
      do {
        if (gbPixelDepth == 16) {
              if (fBltFlags & VO_BLT_SRCTRANSPARENCY) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect))
              Blt8BPPDataTo16BPPBufferTransparentClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect);
            else
              Blt8BPPDataTo16BPPBufferTransparent(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          } else if (fBltFlags & VO_BLT_SHADOW) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect))
              Blt8BPPDataTo16BPPBufferShadowClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect);
            else
              Blt8BPPDataTo16BPPBufferShadow(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          }
        } else if (gbPixelDepth == 8) {
          if (fBltFlags & VO_BLT_SRCTRANSPARENCY) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect))
              Blt8BPPDataTo8BPPBufferTransparentClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect);
            else
              Blt8BPPDataTo8BPPBufferTransparent(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          } else if (fBltFlags & VO_BLT_SHADOW) {
            if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect))
              Blt8BPPDataTo8BPPBufferShadowClip(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect);
            else
              Blt8BPPDataTo8BPPBufferShadow(pBuffer, uiDestPitchBYTES, hSrcVObject, iDestX, iDestY, usIndex);
            break;
          }
        }
        // Use default blitter here
        // Blt8BPPDataTo16BPPBuffer( hDestVObject, hSrcVObject, (UINT16)iDestX, (UINT16)iDestY, (SGPRect*)&SrcRect );
      } while (FALSE);

      break;
  }

  return TRUE;
}

function PixelateVideoObjectRect(uiDestVSurface: UINT32, X1: INT32, Y1: INT32, X2: INT32, Y2: INT32): BOOLEAN {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let area: SGPRect;
  let uiPattern: UINT8[][] /* [8][8] */ = {
    { 0, 1, 0, 1, 0, 1, 0, 1 },
    { 1, 0, 1, 0, 1, 0, 1, 0 },
    { 0, 1, 0, 1, 0, 1, 0, 1 },
    { 1, 0, 1, 0, 1, 0, 1, 0 },
    { 0, 1, 0, 1, 0, 1, 0, 1 },
    { 1, 0, 1, 0, 1, 0, 1, 0 },
    { 0, 1, 0, 1, 0, 1, 0, 1 },
    { 1, 0, 1, 0, 1, 0, 1, 0 },
  };

  // Lock video surface
  pBuffer = (UINT16 *)LockVideoSurface(uiDestVSurface, &uiPitch);

  if (pBuffer == NULL) {
    return FALSE;
  }

  area.iTop = Y1;
  area.iBottom = Y2;
  area.iLeft = X1;
  area.iRight = X2;

  // Now we have the video object and surface, call the shadow function
  if (!Blt16BPPBufferPixelateRect(pBuffer, uiPitch, &area, uiPattern)) {
    UnLockVideoSurface(uiDestVSurface);
    // Blit has failed if false returned
    return FALSE;
  }

  // Mark as dirty if it's the backbuffer
  // if ( uiDestVSurface == BACKBUFFER )
  //{
  //	InvalidateBackbuffer( );
  //}

  UnLockVideoSurface(uiDestVSurface);
  return TRUE;
}

/**********************************************************************************************
 DestroyObjectPaletteTables

        Destroys the palette tables of a video object. All memory is deallocated, and
        the pointers set to NULL. Be careful not to try and blit this object until new
        tables are calculated, or things WILL go boom.

**********************************************************************************************/
function DestroyObjectPaletteTables(hVObject: HVOBJECT): BOOLEAN {
  let x: UINT32;
  let f16BitPal: BOOLEAN;

  for (x = 0; x < HVOBJECT_SHADE_TABLES; x++) {
    if (!(hVObject->fFlags & VOBJECT_FLAG_SHADETABLE_SHARED)) {
      if (hVObject->pShades[x] != NULL) {
        if (hVObject->pShades[x] == hVObject->p16BPPPalette)
          f16BitPal = TRUE;
        else
          f16BitPal = FALSE;

        MemFree(hVObject->pShades[x]);
        hVObject->pShades[x] = NULL;

        if (f16BitPal)
          hVObject->p16BPPPalette = NULL;
      }
    }
  }

  if (hVObject->p16BPPPalette != NULL) {
    MemFree(hVObject->p16BPPPalette);
    hVObject->p16BPPPalette = NULL;
  }

  hVObject->pShadeCurrent = NULL;
  hVObject->pGlow = NULL;

  return TRUE;
}

function SetObjectShade(pObj: HVOBJECT, uiShade: UINT32): UINT16 {
  Assert(pObj != NULL);
  Assert(uiShade >= 0);
  Assert(uiShade < HVOBJECT_SHADE_TABLES);

  if (pObj->pShades[uiShade] == NULL) {
    DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, String("Attempt to set shade level to NULL table"));
    return FALSE;
  }

  pObj->pShadeCurrent = pObj->pShades[uiShade];
  return TRUE;
}

function SetObjectHandleShade(uiHandle: UINT32, uiShade: UINT32): UINT16 {
  let hObj: HVOBJECT;

  if (!GetVideoObject(&hObj, uiHandle)) {
    DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_2, String("Invalid object handle for setting shade level"));
    return FALSE;
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
function GetETRLEPixelValue(pDest: Pointer<UINT8>, hVObject: HVOBJECT, usETRLEIndex: UINT16, usX: UINT16, usY: UINT16): BOOLEAN {
  let pCurrent: Pointer<UINT8>;
  let usLoopX: UINT16 = 0;
  let usLoopY: UINT16 = 0;
  let ubRunLength: UINT16;
  let pETRLEObject: Pointer<ETRLEObject>;

  // Do a bunch of checks
  CHECKF(hVObject != NULL);
  CHECKF(usETRLEIndex < hVObject->usNumberOfObjects);

  pETRLEObject = &(hVObject->pETRLEObject[usETRLEIndex]);

  CHECKF(usX < pETRLEObject->usWidth);
  CHECKF(usY < pETRLEObject->usHeight);

  // Assuming everything's okay, go ahead and look...
  pCurrent = &((UINT8 *)hVObject->pPixData)[pETRLEObject->uiDataOffset];

  // Skip past all uninteresting scanlines
  while (usLoopY < usY) {
    while (*pCurrent != 0) {
      if (*pCurrent & COMPRESS_TRANSPARENT) {
        pCurrent++;
      } else {
        pCurrent += *pCurrent & COMPRESS_RUN_MASK;
      }
    }
    usLoopY++;
  }

  // Now look in this scanline for the appropriate byte
  do {
    ubRunLength = *pCurrent & COMPRESS_RUN_MASK;

    if (*pCurrent & COMPRESS_TRANSPARENT) {
      if (usLoopX + ubRunLength >= usX) {
        *pDest = 0;
        return TRUE;
      } else {
        pCurrent++;
      }
    } else {
      if (usLoopX + ubRunLength >= usX) {
        // skip to the correct byte; skip at least 1 to get past the byte defining the run
        pCurrent += (usX - usLoopX) + 1;
        *pDest = *pCurrent;
        return TRUE;
      } else {
        pCurrent += ubRunLength + 1;
      }
    }
    usLoopX += ubRunLength;
  } while (usLoopX < usX);
  // huh???
  return FALSE;
}

function GetVideoObjectETRLEProperties(hVObject: HVOBJECT, pETRLEObject: Pointer<ETRLEObject>, usIndex: UINT16): BOOLEAN {
  CHECKF(usIndex >= 0);
  CHECKF(usIndex < hVObject->usNumberOfObjects);

  memcpy(pETRLEObject, &(hVObject->pETRLEObject[usIndex]), sizeof(ETRLEObject));

  return TRUE;
}

function GetVideoObjectETRLESubregionProperties(uiVideoObject: UINT32, usIndex: UINT16, pusWidth: Pointer<UINT16>, pusHeight: Pointer<UINT16>): BOOLEAN {
  let hVObject: HVOBJECT;
  let ETRLEObject: ETRLEObject;

// Get video object
  CHECKF(GetVideoObject(&hVObject, uiVideoObject));

  CHECKF(GetVideoObjectETRLEProperties(hVObject, &ETRLEObject, usIndex));

  *pusWidth = ETRLEObject.usWidth;
  *pusHeight = ETRLEObject.usHeight;

  return TRUE;
}

function GetVideoObjectETRLEPropertiesFromIndex(uiVideoObject: UINT32, pETRLEObject: Pointer<ETRLEObject>, usIndex: UINT16): BOOLEAN {
  let hVObject: HVOBJECT;

// Get video object
  CHECKF(GetVideoObject(&hVObject, uiVideoObject));

  CHECKF(GetVideoObjectETRLEProperties(hVObject, pETRLEObject, usIndex));

  return TRUE;
}

function SetVideoObjectPalette8BPP(uiVideoObject: INT32, pPal8: Pointer<SGPPaletteEntry>): BOOLEAN {
  let hVObject: HVOBJECT;

// Get video object
  CHECKF(GetVideoObject(&hVObject, uiVideoObject));

  return SetVideoObjectPalette(hVObject, pPal8);
}

function GetVideoObjectPalette16BPP(uiVideoObject: INT32, ppPal16: Pointer<Pointer<UINT16>>): BOOLEAN {
  let hVObject: HVOBJECT;

// Get video object
  CHECKF(GetVideoObject(&hVObject, uiVideoObject));

  *ppPal16 = hVObject->p16BPPPalette;

  return TRUE;
}

function CopyVideoObjectPalette16BPP(uiVideoObject: INT32, ppPal16: Pointer<UINT16>): BOOLEAN {
  let hVObject: HVOBJECT;

// Get video object
  CHECKF(GetVideoObject(&hVObject, uiVideoObject));

  memcpy(ppPal16, hVObject->p16BPPPalette, 256 * 2);

  return TRUE;
}

function CheckFor16BPPRegion(hVObject: HVOBJECT, usRegionIndex: UINT16, ubShadeLevel: UINT8, pusIndex: Pointer<UINT16>): BOOLEAN {
  let usLoop: UINT16;
  let p16BPPObject: Pointer<SixteenBPPObjectInfo>;

  if (hVObject->usNumberOf16BPPObjects > 0) {
    for (usLoop = 0; usLoop < hVObject->usNumberOf16BPPObjects; usLoop++) {
      p16BPPObject = &(hVObject->p16BPPObject[usLoop]);
      if (p16BPPObject->usRegionIndex == usRegionIndex && p16BPPObject->ubShadeLevel == ubShadeLevel) {
        if (pusIndex != NULL) {
          *pusIndex = usLoop;
        }
        return TRUE;
      }
    }
  }
  return FALSE;
}

function ConvertVObjectRegionTo16BPP(hVObject: HVOBJECT, usRegionIndex: UINT16, ubShadeLevel: UINT8): BOOLEAN {
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
  if (usRegionIndex >= hVObject->usNumberOfObjects || ubShadeLevel >= HVOBJECT_SHADE_TABLES) {
    return FALSE;
  }
  if (CheckFor16BPPRegion(hVObject, usRegionIndex, ubShadeLevel, NULL) == TRUE) {
    // it already exists; no need to do anything!
    return TRUE;
  }

  if (hVObject->usNumberOf16BPPObjects > 0) {
    // have to reallocate memory
    hVObject->p16BPPObject = MemRealloc(hVObject->p16BPPObject, sizeof(SixteenBPPObjectInfo) * (hVObject->usNumberOf16BPPObjects + 1));
  } else {
    // allocate memory for the first 16BPPObject
    hVObject->p16BPPObject = MemAlloc(sizeof(SixteenBPPObjectInfo));
  }
  if (hVObject->p16BPPObject == NULL) {
    hVObject->usNumberOf16BPPObjects = 0;
    return FALSE;
  }

  // the new object is the last one in the array
  p16BPPObject = &(hVObject->p16BPPObject[hVObject->usNumberOf16BPPObjects]);

  // need twice as much memory because of going from 8 to 16 bits
  p16BPPObject->p16BPPData = MemAlloc(hVObject->pETRLEObject[usRegionIndex].uiDataLength * 2);
  if (p16BPPObject->p16BPPData == NULL) {
    return FALSE;
  }

  p16BPPObject->usRegionIndex = usRegionIndex;
  p16BPPObject->ubShadeLevel = ubShadeLevel;
  p16BPPObject->usHeight = hVObject->pETRLEObject[usRegionIndex].usHeight;
  p16BPPObject->usWidth = hVObject->pETRLEObject[usRegionIndex].usWidth;
  p16BPPObject->sOffsetX = hVObject->pETRLEObject[usRegionIndex].sOffsetX;
  p16BPPObject->sOffsetY = hVObject->pETRLEObject[usRegionIndex].sOffsetY;

  // get the palette
  p16BPPPalette = hVObject->pShades[ubShadeLevel];
  pInput = (UINT8 *)hVObject->pPixData + hVObject->pETRLEObject[usRegionIndex].uiDataOffset;

  uiDataLength = hVObject->pETRLEObject[usRegionIndex].uiDataLength;

  // now actually do the conversion

  uiLen = 0;
  pOutput = (UINT8 *)p16BPPObject->p16BPPData;
  for (uiDataLoop = 0; uiDataLoop < uiDataLength; uiDataLoop++) {
    bData = *pInput;
    if (bData & 0x80) {
      // transparent
      *pOutput = *pInput;
      pOutput++;
      pInput++;
      // uiDataLoop++;
      uiLen += (UINT32)(bData & 0x7f);
    } else if (bData > 0) {
      // nontransparent
      *pOutput = *pInput;
      pOutput++;
      pInput++;
      // uiDataLoop++;
      for (ubRunLoop = 0; ubRunLoop < bData; ubRunLoop++) {
        *((UINT16 *)pOutput) = p16BPPPalette[*pInput];
        pOutput++;
        pOutput++;
        pInput++;
        uiDataLoop++;
      }
      uiLen += (UINT32)bData;
    } else {
      // eol
      *pOutput = *pInput;
      pOutput++;
      pInput++;
      // uiDataLoop++;
      if (uiLen != p16BPPObject->usWidth)
        DbgMessage(TOPIC_VIDEOOBJECT, DBG_LEVEL_1, String("Actual pixel width different from header width"));
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
  hVObject->usNumberOf16BPPObjects++;
  return TRUE;
}

function BltVideoObjectOutlineFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usIndex: UINT16, iDestX: INT32, iDestY: INT32, s16BPPColor: INT16, fDoOutline: BOOLEAN): BOOLEAN {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let hSrcVObject: HVOBJECT;

  // Lock video surface
  pBuffer = (UINT16 *)LockVideoSurface(uiDestVSurface, &uiPitch);

  if (pBuffer == NULL) {
    return FALSE;
  }

// Get video object
  CHECKF(GetVideoObject(&hSrcVObject, uiSrcVObject));

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect)) {
    Blt8BPPDataTo16BPPBufferOutlineClip((UINT16 *)pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline, &ClippingRect);
  } else {
    Blt8BPPDataTo16BPPBufferOutline((UINT16 *)pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return TRUE;
}

function BltVideoObjectOutline(uiDestVSurface: UINT32, hSrcVObject: HVOBJECT, usIndex: UINT16, iDestX: INT32, iDestY: INT32, s16BPPColor: INT16, fDoOutline: BOOLEAN): BOOLEAN {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  // Lock video surface
  pBuffer = (UINT16 *)LockVideoSurface(uiDestVSurface, &uiPitch);

  if (pBuffer == NULL) {
    return FALSE;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect)) {
    Blt8BPPDataTo16BPPBufferOutlineClip((UINT16 *)pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline, &ClippingRect);
  } else {
    Blt8BPPDataTo16BPPBufferOutline((UINT16 *)pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, s16BPPColor, fDoOutline);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return TRUE;
}

function BltVideoObjectOutlineShadowFromIndex(uiDestVSurface: UINT32, uiSrcVObject: UINT32, usIndex: UINT16, iDestX: INT32, iDestY: INT32): BOOLEAN {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  let hSrcVObject: HVOBJECT;

  // Lock video surface
  pBuffer = (UINT16 *)LockVideoSurface(uiDestVSurface, &uiPitch);

  if (pBuffer == NULL) {
    return FALSE;
  }

// Get video object
  CHECKF(GetVideoObject(&hSrcVObject, uiSrcVObject));

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect)) {
    Blt8BPPDataTo16BPPBufferOutlineShadowClip((UINT16 *)pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect);
  } else {
    Blt8BPPDataTo16BPPBufferOutlineShadow((UINT16 *)pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return TRUE;
}

function BltVideoObjectOutlineShadow(uiDestVSurface: UINT32, hSrcVObject: HVOBJECT, usIndex: UINT16, iDestX: INT32, iDestY: INT32): BOOLEAN {
  let pBuffer: Pointer<UINT16>;
  let uiPitch: UINT32;
  // Lock video surface
  pBuffer = (UINT16 *)LockVideoSurface(uiDestVSurface, &uiPitch);

  if (pBuffer == NULL) {
    return FALSE;
  }

  if (BltIsClipped(hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect)) {
    Blt8BPPDataTo16BPPBufferOutlineShadowClip((UINT16 *)pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex, &ClippingRect);
  } else {
    Blt8BPPDataTo16BPPBufferOutlineShadow((UINT16 *)pBuffer, uiPitch, hSrcVObject, iDestX, iDestY, usIndex);
  }

  // Now we have the video object and surface, call the VO blitter function

  UnLockVideoSurface(uiDestVSurface);
  return TRUE;
}
