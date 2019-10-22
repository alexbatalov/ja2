// This is the color substituted to keep a 24bpp -> 16bpp color
// from going transparent (0x0000) -- DB

const BLACK_SUBSTITUTE = 0x0001;

let gusAlphaMask: UINT16 = 0;
let gusRedMask: UINT16 = 0;
let gusGreenMask: UINT16 = 0;
let gusBlueMask: UINT16 = 0;
let gusRedShift: INT16 = 0;
let gusBlueShift: INT16 = 0;
let gusGreenShift: INT16 = 0;

// this funky union is used for fast 16-bit pixel format conversions
interface SplitUINT32 {
  /* union { */
  /*   struct { */
  usLower: UINT16;
  usHigher: UINT16;
  /*   } */
  uiValue: UINT32;
  /* } */
}

function CreateImage(ImageFile: SGPFILENAME, fContents: UINT16): HIMAGE {
  let hImage: HIMAGE = NULL;
  let Extension: SGPFILENAME;
  let ExtensionSep: CHAR8[] /* [] */ = ".";
  let StrPtr: STR;
  let iFileLoader: UINT32;

  // Depending on extension of filename, use different image readers
  // Get extension
  StrPtr = strstr(ImageFile, ExtensionSep);

  if (StrPtr == NULL) {
    // No extension given, use default internal loader extension
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, "No extension given, using default");
    strcat(ImageFile, ".PCX");
    strcpy(Extension, ".PCX");
  } else {
    strcpy(Extension, StrPtr + 1);
  }

  // Determine type from Extension
  do {
    iFileLoader = UNKNOWN_FILE_READER;

    if (_stricmp(Extension, "PCX") == 0) {
      iFileLoader = PCX_FILE_READER;
      break;
    }

    if (_stricmp(Extension, "TGA") == 0) {
      iFileLoader = TGA_FILE_READER;
      break;
    }

    if (_stricmp(Extension, "STI") == 0) {
      iFileLoader = STCI_FILE_READER;
      break;
    }
  } while (FALSE);

  // Determine if resource exists before creating image structure
  if (!FileExists(ImageFile)) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, String("Resource file %s does not exist.", ImageFile));
    return NULL;
  }

  // Create memory for image structure
  hImage = MemAlloc(sizeof(image_type));

  AssertMsg(hImage, "Failed to allocate memory for hImage in CreateImage");
  // Initialize some values
  memset(hImage, 0, sizeof(image_type));

  // hImage->fFlags = 0;
  // Set data pointers to NULL
  // hImage->pImageData = NULL;
  // hImage->pPalette   = NULL;
  // hImage->pui16BPPPalette = NULL;

  // Set filename and loader
  strcpy(hImage->ImageFile, ImageFile);
  hImage->iFileLoader = iFileLoader;

  if (!LoadImageData(hImage, fContents)) {
    return NULL;
  }

  // All is fine, image is loaded and allocated, return pointer
  return hImage;
}

function DestroyImage(hImage: HIMAGE): BOOLEAN {
  Assert(hImage != NULL);

  // First delete contents
  ReleaseImageData(hImage, IMAGE_ALLDATA); // hImage->fFlags );

  // Now free structure
  MemFree(hImage);

  return TRUE;
}

function ReleaseImageData(hImage: HIMAGE, fContents: UINT16): BOOLEAN {
  Assert(hImage != NULL);

  if ((fContents & IMAGE_PALETTE) && (hImage->fFlags & IMAGE_PALETTE)) {
    // Destroy palette
    if (hImage->pPalette != NULL) {
      MemFree(hImage->pPalette);
      hImage->pPalette = NULL;
    }

    if (hImage->pui16BPPPalette != NULL) {
      MemFree(hImage->pui16BPPPalette);
      hImage->pui16BPPPalette = NULL;
    }

    // Remove contents flag
    hImage->fFlags = hImage->fFlags ^ IMAGE_PALETTE;
  }

  if ((fContents & IMAGE_BITMAPDATA) && (hImage->fFlags & IMAGE_BITMAPDATA)) {
    // Destroy image data
    Assert(hImage->pImageData != NULL);
    MemFree(hImage->pImageData);
    hImage->pImageData = NULL;
    if (hImage->usNumberOfObjects > 0) {
      MemFree(hImage->pETRLEObject);
    }
    // Remove contents flag
    hImage->fFlags = hImage->fFlags ^ IMAGE_BITMAPDATA;
  }

  if ((fContents & IMAGE_APPDATA) && (hImage->fFlags & IMAGE_APPDATA)) {
    // get rid of the APP DATA
    if (hImage->pAppData != NULL) {
      MemFree(hImage->pAppData);
      hImage->fFlags &= (~IMAGE_APPDATA);
    }
  }

  return TRUE;
}

function LoadImageData(hImage: HIMAGE, fContents: UINT16): BOOLEAN {
  let fReturnVal: BOOLEAN = FALSE;

  Assert(hImage != NULL);

  // Switch on file loader
  switch (hImage->iFileLoader) {
    case TGA_FILE_READER:

      fReturnVal = LoadTGAFileToImage(hImage, fContents);
      break;

    case PCX_FILE_READER:

      fReturnVal = LoadPCXFileToImage(hImage, fContents);
      break;

    case STCI_FILE_READER:
      fReturnVal = LoadSTCIFileToImage(hImage, fContents);
      break;

    default:

      DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, "Unknown image loader was specified.");
  }

  if (!fReturnVal) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, "Error occured while reading image data.");
  }

  return fReturnVal;
}

function CopyImageToBuffer(hImage: HIMAGE, fBufferType: UINT32, pDestBuf: Pointer<BYTE>, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: Pointer<SGPRect>): BOOLEAN {
  // Use blitter based on type of image
  Assert(hImage != NULL);

  if (hImage->ubBitDepth == 8 && fBufferType == BUFFER_8BPP) {
    // Default do here
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, "Copying 8 BPP Imagery.");
    return Copy8BPPImageTo8BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  if (hImage->ubBitDepth == 8 && fBufferType == BUFFER_16BPP) {
    // Default do here
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Copying 8 BPP Imagery to 16BPP Buffer.");
    return Copy8BPPImageTo16BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  if (hImage->ubBitDepth == 16 && fBufferType == BUFFER_16BPP) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Automatically Copying 16 BPP Imagery.");
    return Copy16BPPImageTo16BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  return FALSE;
}

function Copy8BPPImageTo8BPPBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: Pointer<SGPRect>): BOOLEAN {
  let uiSrcStart: UINT32;
  let uiDestStart: UINT32;
  let uiNumLines: UINT32;
  let uiLineSize: UINT32;
  let cnt: UINT32;
  let pDest: Pointer<UINT8>;
  let pSrc: Pointer<UINT8>;

  // Assertions
  Assert(hImage != NULL);
  Assert(hImage->p16BPPData != NULL);

  // Validations
  CHECKF(usX >= 0);
  CHECKF(usX < usDestWidth);
  CHECKF(usY >= 0);
  CHECKF(usY < usDestHeight);
  CHECKF(srcRect->iRight > srcRect->iLeft);
  CHECKF(srcRect->iBottom > srcRect->iTop);

  // Determine memcopy coordinates
  uiSrcStart = srcRect->iTop * hImage->usWidth + srcRect->iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect->iBottom - srcRect->iTop) + 1;
  uiLineSize = (srcRect->iRight - srcRect->iLeft) + 1;

  Assert(usDestWidth >= uiLineSize);
  Assert(usDestHeight >= uiNumLines);

  // Copy line by line
  pDest = pDestBuf + uiDestStart;
  pSrc = hImage->p8BPPData + uiSrcStart;

  for (cnt = 0; cnt < uiNumLines - 1; cnt++) {
    memcpy(pDest, pSrc, uiLineSize);
    pDest += usDestWidth;
    pSrc += hImage->usWidth;
  }
  // Do last line
  memcpy(pDest, pSrc, uiLineSize);

  return TRUE;
}

function Copy16BPPImageTo16BPPBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: Pointer<SGPRect>): BOOLEAN {
  let uiSrcStart: UINT32;
  let uiDestStart: UINT32;
  let uiNumLines: UINT32;
  let uiLineSize: UINT32;
  let cnt: UINT32;
  let pDest: Pointer<UINT16>;
  let pSrc: Pointer<UINT16>;

  Assert(hImage != NULL);
  Assert(hImage->p16BPPData != NULL);

  // Validations
  CHECKF(usX >= 0);
  CHECKF(usX < hImage->usWidth);
  CHECKF(usY >= 0);
  CHECKF(usY < hImage->usHeight);
  CHECKF(srcRect->iRight > srcRect->iLeft);
  CHECKF(srcRect->iBottom > srcRect->iTop);

  // Determine memcopy coordinates
  uiSrcStart = srcRect->iTop * hImage->usWidth + srcRect->iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect->iBottom - srcRect->iTop) + 1;
  uiLineSize = (srcRect->iRight - srcRect->iLeft) + 1;

  CHECKF(usDestWidth >= uiLineSize);
  CHECKF(usDestHeight >= uiNumLines);

  // Copy line by line
  pDest = pDestBuf + uiDestStart;
  pSrc = hImage->p16BPPData + uiSrcStart;

  for (cnt = 0; cnt < uiNumLines - 1; cnt++) {
    memcpy(pDest, pSrc, uiLineSize * 2);
    pDest += usDestWidth;
    pSrc += hImage->usWidth;
  }
  // Do last line
  memcpy(pDest, pSrc, uiLineSize * 2);

  return TRUE;
}

function Extract8BPPCompressedImageToBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>): BOOLEAN {
  return FALSE;
}

function Extract16BPPCompressedImageToBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>): BOOLEAN {
  return FALSE;
}

function Copy8BPPImageTo16BPPBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: Pointer<SGPRect>): BOOLEAN {
  let uiSrcStart: UINT32;
  let uiDestStart: UINT32;
  let uiNumLines: UINT32;
  let uiLineSize: UINT32;
  let rows: UINT32;
  let cols: UINT32;
  let pSrc: Pointer<UINT8>;
  let pSrcTemp: Pointer<UINT8>;
  let pDest: Pointer<UINT16>;
  let pDestTemp: Pointer<UINT16>;
  let p16BPPPalette: Pointer<UINT16>;

  p16BPPPalette = hImage->pui16BPPPalette;

  // Assertions
  Assert(p16BPPPalette != NULL);
  Assert(hImage != NULL);

  // Validations
  CHECKF(hImage->p16BPPData != NULL);
  CHECKF(usX >= 0);
  CHECKF(usX < usDestWidth);
  CHECKF(usY >= 0);
  CHECKF(usY < usDestHeight);
  CHECKF(srcRect->iRight > srcRect->iLeft);
  CHECKF(srcRect->iBottom > srcRect->iTop);

  // Determine memcopy coordinates
  uiSrcStart = srcRect->iTop * hImage->usWidth + srcRect->iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect->iBottom - srcRect->iTop);
  uiLineSize = (srcRect->iRight - srcRect->iLeft);

  CHECKF(usDestWidth >= uiLineSize);
  CHECKF(usDestHeight >= uiNumLines);

  // Convert to Pixel specification
  pDest = pDestBuf + uiDestStart;
  pSrc = hImage->p8BPPData + uiSrcStart;
  DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, String("Start Copying at %p", pDest));

  // For every entry, look up into 16BPP palette
  for (rows = 0; rows < uiNumLines - 1; rows++) {
    pDestTemp = pDest;
    pSrcTemp = pSrc;

    for (cols = 0; cols < uiLineSize; cols++) {
      *pDestTemp = p16BPPPalette[*pSrcTemp];
      pDestTemp++;
      pSrcTemp++;
    }

    pDest += usDestWidth;
    pSrc += hImage->usWidth;
  }
  // Do last line
  DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, String("End Copying at %p", pDest));

  return TRUE;
}

function Create16BPPPalette(pPalette: Pointer<SGPPaletteEntry>): Pointer<UINT16> {
  let p16BPPPalette: Pointer<UINT16>;
  let r16: UINT16;
  let g16: UINT16;
  let b16: UINT16;
  let usColor: UINT16;
  let cnt: UINT32;
  let r: UINT8;
  let g: UINT8;
  let b: UINT8;

  Assert(pPalette != NULL);

  p16BPPPalette = MemAlloc(sizeof(UINT16) * 256);

  for (cnt = 0; cnt < 256; cnt++) {
    r = pPalette[cnt].peRed;
    g = pPalette[cnt].peGreen;
    b = pPalette[cnt].peBlue;

    if (gusRedShift < 0)
      r16 = (r >> abs(gusRedShift));
    else
      r16 = (r << gusRedShift);

    if (gusGreenShift < 0)
      g16 = (g >> abs(gusGreenShift));
    else
      g16 = (g << gusGreenShift);

    if (gusBlueShift < 0)
      b16 = (b >> abs(gusBlueShift));
    else
      b16 = (b << gusBlueShift);

    usColor = (r16 & gusRedMask) | (g16 & gusGreenMask) | (b16 & gusBlueMask);

    if (usColor == 0) {
      if ((r + g + b) != 0)
        usColor = BLACK_SUBSTITUTE | gusAlphaMask;
    } else
      usColor |= gusAlphaMask;

    p16BPPPalette[cnt] = usColor;
  }

  return p16BPPPalette;
}

/**********************************************************************************************
 Create16BPPPaletteShaded

        Creates an 8 bit to 16 bit palette table, and modifies the colors as it builds.

        Parameters:
                rscale, gscale, bscale:
                                Color mode: Percentages (255=100%) of color to translate into destination palette.
                                Mono mode:  Color for monochrome palette.
                mono:
                                TRUE or FALSE to create a monochrome palette. In mono mode, Luminance values for
                                colors are calculated, and the RGB color is shaded according to each pixel's brightness.

        This can be used in several ways:

        1) To "brighten" a palette, pass down RGB values that are higher than 100% ( > 255) for all
                        three. mono=FALSE.
        2) To "darken" a palette, do the same with less than 100% ( < 255) values. mono=FALSE.

        3) To create a "glow" palette, select mono=TRUE, and pass the color in the RGB parameters.

        4) For gamma correction, pass in weighted values for each color.

**********************************************************************************************/
function Create16BPPPaletteShaded(pPalette: Pointer<SGPPaletteEntry>, rscale: UINT32, gscale: UINT32, bscale: UINT32, mono: BOOLEAN): Pointer<UINT16> {
  let p16BPPPalette: Pointer<UINT16>;
  let r16: UINT16;
  let g16: UINT16;
  let b16: UINT16;
  let usColor: UINT16;
  let cnt: UINT32;
  let lumin: UINT32;
  let rmod: UINT32;
  let gmod: UINT32;
  let bmod: UINT32;
  let r: UINT8;
  let g: UINT8;
  let b: UINT8;

  Assert(pPalette != NULL);

  p16BPPPalette = MemAlloc(sizeof(UINT16) * 256);

  for (cnt = 0; cnt < 256; cnt++) {
    if (mono) {
      lumin = (pPalette[cnt].peRed * 299 / 1000) + (pPalette[cnt].peGreen * 587 / 1000) + (pPalette[cnt].peBlue * 114 / 1000);
      rmod = (rscale * lumin) / 256;
      gmod = (gscale * lumin) / 256;
      bmod = (bscale * lumin) / 256;
    } else {
      rmod = (rscale * pPalette[cnt].peRed / 256);
      gmod = (gscale * pPalette[cnt].peGreen / 256);
      bmod = (bscale * pPalette[cnt].peBlue / 256);
    }

    r = __min(rmod, 255);
    g = __min(gmod, 255);
    b = __min(bmod, 255);

    if (gusRedShift < 0)
      r16 = (r >> (-gusRedShift));
    else
      r16 = (r << gusRedShift);

    if (gusGreenShift < 0)
      g16 = (g >> (-gusGreenShift));
    else
      g16 = (g << gusGreenShift);

    if (gusBlueShift < 0)
      b16 = (b >> (-gusBlueShift));
    else
      b16 = (b << gusBlueShift);

    // Prevent creation of pure black color
    usColor = (r16 & gusRedMask) | (g16 & gusGreenMask) | (b16 & gusBlueMask);

    if (usColor == 0) {
      if ((r + g + b) != 0)
        usColor = BLACK_SUBSTITUTE | gusAlphaMask;
    } else
      usColor |= gusAlphaMask;

    p16BPPPalette[cnt] = usColor;
  }
  return p16BPPPalette;
}

// Convert from RGB to 16 bit value
function Get16BPPColor(RGBValue: UINT32): UINT16 {
  let r16: UINT16;
  let g16: UINT16;
  let b16: UINT16;
  let usColor: UINT16;
  let r: UINT8;
  let g: UINT8;
  let b: UINT8;

  r = SGPGetRValue(RGBValue);
  g = SGPGetGValue(RGBValue);
  b = SGPGetBValue(RGBValue);

  if (gusRedShift < 0)
    r16 = (r >> abs(gusRedShift));
  else
    r16 = (r << gusRedShift);

  if (gusGreenShift < 0)
    g16 = (g >> abs(gusGreenShift));
  else
    g16 = (g << gusGreenShift);

  if (gusBlueShift < 0)
    b16 = (b >> abs(gusBlueShift));
  else
    b16 = (b << gusBlueShift);

  usColor = (r16 & gusRedMask) | (g16 & gusGreenMask) | (b16 & gusBlueMask);

  // if our color worked out to absolute black, and the original wasn't
  // absolute black, convert it to a VERY dark grey to avoid transparency
  // problems

  if (usColor == 0) {
    if (RGBValue != 0)
      usColor = BLACK_SUBSTITUTE | gusAlphaMask;
  } else
    usColor |= gusAlphaMask;

  return usColor;
}

// Convert from 16 BPP to RGBvalue
function GetRGBColor(Value16BPP: UINT16): UINT32 {
  let r16: UINT16;
  let g16: UINT16;
  let b16: UINT16;
  let r: UINT32;
  let g: UINT32;
  let b: UINT32;
  let val: UINT32;

  r16 = Value16BPP & gusRedMask;
  g16 = Value16BPP & gusGreenMask;
  b16 = Value16BPP & gusBlueMask;

  if (gusRedShift < 0)
    r = (r16 << abs(gusRedShift));
  else
    r = (r16 >> gusRedShift);

  if (gusGreenShift < 0)
    g = (g16 << abs(gusGreenShift));
  else
    g = (g16 >> gusGreenShift);

  if (gusBlueShift < 0)
    b = (b16 << abs(gusBlueShift));
  else
    b = (b16 >> gusBlueShift);

  r &= 0x000000ff;
  g &= 0x000000ff;
  b &= 0x000000ff;

  val = FROMRGB(r, g, b);

  return val;
}

//*****************************************************************************
//
// ConvertToPaletteEntry
//
// Parameter List : Converts from RGB to SGPPaletteEntry
//
// Return Value  pointer to the SGPPaletteEntry
//
// Modification History :
// Dec 15th 1996 -> modified for use by Wizardry
//
//*****************************************************************************

function ConvertRGBToPaletteEntry(sbStart: UINT8, sbEnd: UINT8, pOldPalette: Pointer<UINT8>): Pointer<SGPPaletteEntry> {
  let Index: UINT16;
  let pPalEntry: Pointer<SGPPaletteEntry>;
  let pInitEntry: Pointer<SGPPaletteEntry>;

  pPalEntry = MemAlloc(sizeof(SGPPaletteEntry) * 256);
  pInitEntry = pPalEntry;
  DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_0, "Converting RGB palette to SGPPaletteEntry");
  for (Index = 0; Index <= (sbEnd - sbStart); Index++) {
    pPalEntry->peRed = *(pOldPalette + (Index * 3));
    pPalEntry->peGreen = *(pOldPalette + (Index * 3) + 1);
    pPalEntry->peBlue = *(pOldPalette + (Index * 3) + 2);
    pPalEntry->peFlags = 0;
    pPalEntry++;
  }
  return pInitEntry;
}

function GetETRLEImageData(hImage: HIMAGE, pBuffer: Pointer<ETRLEData>): BOOLEAN {
  // Assertions
  Assert(hImage != NULL);
  Assert(pBuffer != NULL);

  // Create memory for data
  pBuffer->usNumberOfObjects = hImage->usNumberOfObjects;

  // Create buffer for objects
  pBuffer->pETRLEObject = MemAlloc(sizeof(ETRLEObject) * pBuffer->usNumberOfObjects);
  CHECKF(pBuffer->pETRLEObject != NULL);

  // Copy into buffer
  memcpy(pBuffer->pETRLEObject, hImage->pETRLEObject, sizeof(ETRLEObject) * pBuffer->usNumberOfObjects);

  // Allocate memory for pixel data
  pBuffer->pPixData = MemAlloc(hImage->uiSizePixData);
  CHECKF(pBuffer->pPixData != NULL);

  pBuffer->uiSizePixData = hImage->uiSizePixData;

  // Copy into buffer
  memcpy(pBuffer->pPixData, hImage->pPixData8, pBuffer->uiSizePixData);

  return TRUE;
}

function ConvertRGBDistribution565To555(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiLoop: UINT32;

  let Pixel: SplitUINT32;

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // If the pixel is completely black, don't bother converting it -- DB
    if (*pPixel != 0) {
      // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
      // right shift the blue value (at the bottom) into the LOWER word to protect it
      Pixel.usHigher = *pPixel;
      Pixel.uiValue >>= 5;
      // get rid of the least significant bit of green
      Pixel.usHigher >>= 1;
      // now shift back into the upper word
      Pixel.uiValue <<= 5;
      // and copy back
      *pPixel = Pixel.usHigher | gusAlphaMask;
    }
    pPixel++;
  }
}

function ConvertRGBDistribution565To655(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiLoop: UINT32;

  let Pixel: SplitUINT32;

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
    // right shift the blue value (at the bottom) into the LOWER word to protect it
    Pixel.usHigher = *pPixel;
    Pixel.uiValue >>= 5;
    // get rid of the least significant bit of green
    Pixel.usHigher >>= 1;
    // shift to the right some more...
    Pixel.uiValue >>= 5;
    // so we can left-shift the red value alone to give it an extra bit
    Pixel.usHigher <<= 1;
    // now shift back and copy
    Pixel.uiValue <<= 10;
    *pPixel = Pixel.usHigher;
    pPixel++;
  }
}

function ConvertRGBDistribution565To556(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiLoop: UINT32;

  let Pixel: SplitUINT32;

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
    // right shift the blue value (at the bottom) into the LOWER word to protect it
    Pixel.usHigher = *pPixel;
    Pixel.uiValue >>= 5;
    // get rid of the least significant bit of green
    Pixel.usHigher >>= 1;
    // shift back into the upper word
    Pixel.uiValue <<= 5;
    // give blue an extra bit (blank in the least significant spot)
    Pixel.usHigher <<= 1;
    // copy back
    *pPixel = Pixel.usHigher;
    pPixel++;
  }
}

function ConvertRGBDistribution565ToAny(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiRed: UINT32;
  let uiGreen: UINT32;
  let uiBlue: UINT32;
  let uiTemp: UINT32;
  let uiLoop: UINT32;

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // put the 565 RGB 16-bit value into a 32-bit RGB value
    uiRed = (*pPixel) >> 11;
    uiGreen = (*pPixel & 0x07E0) >> 5;
    uiBlue = (*pPixel & 0x001F);
    uiTemp = FROMRGB(uiRed, uiGreen, uiBlue);
    // then convert the 32-bit RGB value to whatever 16 bit format is used
    *pPixel = Get16BPPColor(uiTemp);
    pPixel++;
  }
}
