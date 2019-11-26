namespace ja2 {

// This is the color substituted to keep a 24bpp -> 16bpp color
// from going transparent (0x0000) -- DB

const BLACK_SUBSTITUTE = 0x0001;

let gusAlphaMask: UINT16 = 0;
export let gusRedMask: UINT16 = 0;
export let gusGreenMask: UINT16 = 0;
export let gusBlueMask: UINT16 = 0;
export let gusRedShift: INT16 = 0;
export let gusBlueShift: INT16 = 0;
export let gusGreenShift: INT16 = 0;

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

function createSplitUint32(): SplitUINT32 {
  return {
    usLower: 0,
    usHigher: 0,
    uiValue: 0,
  };
}

export function CreateImage(ImageFile: string /* SGPFILENAME */, fContents: UINT16): HIMAGE {
  let hImage: HIMAGE = null;
  let Extension: string /* SGPFILENAME */;
  let ExtensionSep: string /* CHAR8[] */ = ".";
  let StrPtr: string /* STR */;
  let iFileLoader: UINT32;

  // Depending on extension of filename, use different image readers
  // Get extension
  StrPtr = strstr(ImageFile, ExtensionSep);

  if (StrPtr == null) {
    // No extension given, use default internal loader extension
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, "No extension given, using default");
    ImageFile += ".PCX";
    Extension = ".PCX";
  } else {
    Extension = StrPtr + 1;
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
  } while (false);

  // Determine if resource exists before creating image structure
  if (!FileExists(ImageFile)) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, FormatString("Resource file %s does not exist.", ImageFile));
    return null;
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
  hImage.value.ImageFile = ImageFile;
  hImage.value.iFileLoader = iFileLoader;

  if (!LoadImageData(hImage, fContents)) {
    return null;
  }

  // All is fine, image is loaded and allocated, return pointer
  return hImage;
}

export function DestroyImage(hImage: HIMAGE): boolean {
  Assert(hImage != null);

  // First delete contents
  ReleaseImageData(hImage, IMAGE_ALLDATA); // hImage->fFlags );

  // Now free structure
  MemFree(hImage);

  return true;
}

function ReleaseImageData(hImage: HIMAGE, fContents: UINT16): boolean {
  Assert(hImage != null);

  if ((fContents & IMAGE_PALETTE) && (hImage.value.fFlags & IMAGE_PALETTE)) {
    // Destroy palette
    if (hImage.value.pPalette != null) {
      MemFree(hImage.value.pPalette);
      hImage.value.pPalette = null;
    }

    if (hImage.value.pui16BPPPalette != null) {
      MemFree(hImage.value.pui16BPPPalette);
      hImage.value.pui16BPPPalette = null;
    }

    // Remove contents flag
    hImage.value.fFlags = hImage.value.fFlags ^ IMAGE_PALETTE;
  }

  if ((fContents & IMAGE_BITMAPDATA) && (hImage.value.fFlags & IMAGE_BITMAPDATA)) {
    // Destroy image data
    Assert(hImage.value.pImageData != null);
    MemFree(hImage.value.pImageData);
    hImage.value.pImageData = null;
    if (hImage.value.usNumberOfObjects > 0) {
      MemFree(hImage.value.pETRLEObject);
    }
    // Remove contents flag
    hImage.value.fFlags = hImage.value.fFlags ^ IMAGE_BITMAPDATA;
  }

  if ((fContents & IMAGE_APPDATA) && (hImage.value.fFlags & IMAGE_APPDATA)) {
    // get rid of the APP DATA
    if (hImage.value.pAppData != null) {
      MemFree(hImage.value.pAppData);
      hImage.value.fFlags &= (~IMAGE_APPDATA);
    }
  }

  return true;
}

function LoadImageData(hImage: HIMAGE, fContents: UINT16): boolean {
  let fReturnVal: boolean = false;

  Assert(hImage != null);

  // Switch on file loader
  switch (hImage.value.iFileLoader) {
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

export function CopyImageToBuffer(hImage: HIMAGE, fBufferType: UINT32, pDestBuf: Pointer<BYTE>, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: Pointer<SGPRect>): boolean {
  // Use blitter based on type of image
  Assert(hImage != null);

  if (hImage.value.ubBitDepth == 8 && fBufferType == BUFFER_8BPP) {
    // Default do here
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, "Copying 8 BPP Imagery.");
    return Copy8BPPImageTo8BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  if (hImage.value.ubBitDepth == 8 && fBufferType == BUFFER_16BPP) {
    // Default do here
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Copying 8 BPP Imagery to 16BPP Buffer.");
    return Copy8BPPImageTo16BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  if (hImage.value.ubBitDepth == 16 && fBufferType == BUFFER_16BPP) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Automatically Copying 16 BPP Imagery.");
    return Copy16BPPImageTo16BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  return false;
}

function Copy8BPPImageTo8BPPBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: Pointer<SGPRect>): boolean {
  let uiSrcStart: UINT32;
  let uiDestStart: UINT32;
  let uiNumLines: UINT32;
  let uiLineSize: UINT32;
  let cnt: UINT32;
  let pDest: Pointer<UINT8>;
  let pSrc: Pointer<UINT8>;

  // Assertions
  Assert(hImage != null);
  Assert(hImage.value.p16BPPData != null);

  // Validations
  if (usX < 0) {
    return false;
  }
  if (usX >= usDestWidth) {
    return false;
  }
  if (usY < 0) {
    return false;
  }
  if (usY >= usDestHeight) {
    return false;
  }
  if (srcRect.value.iRight <= srcRect.value.iLeft) {
    return false;
  }
  if (srcRect.value.iBottom <= srcRect.value.iTop) {
    return false;
  }

  // Determine memcopy coordinates
  uiSrcStart = srcRect.value.iTop * hImage.value.usWidth + srcRect.value.iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect.value.iBottom - srcRect.value.iTop) + 1;
  uiLineSize = (srcRect.value.iRight - srcRect.value.iLeft) + 1;

  Assert(usDestWidth >= uiLineSize);
  Assert(usDestHeight >= uiNumLines);

  // Copy line by line
  pDest = pDestBuf + uiDestStart;
  pSrc = hImage.value.p8BPPData + uiSrcStart;

  for (cnt = 0; cnt < uiNumLines - 1; cnt++) {
    memcpy(pDest, pSrc, uiLineSize);
    pDest += usDestWidth;
    pSrc += hImage.value.usWidth;
  }
  // Do last line
  memcpy(pDest, pSrc, uiLineSize);

  return true;
}

function Copy16BPPImageTo16BPPBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: Pointer<SGPRect>): boolean {
  let uiSrcStart: UINT32;
  let uiDestStart: UINT32;
  let uiNumLines: UINT32;
  let uiLineSize: UINT32;
  let cnt: UINT32;
  let pDest: Pointer<UINT16>;
  let pSrc: Pointer<UINT16>;

  Assert(hImage != null);
  Assert(hImage.value.p16BPPData != null);

  // Validations
  if (usX < 0) {
    return false;
  }
  if (usX >= hImage.value.usWidth) {
    return false;
  }
  if (usY < 0) {
    return false;
  }
  if (usY >= hImage.value.usHeight) {
    return false;
  }
  if (srcRect.value.iRight <= srcRect.value.iLeft) {
    return false;
  }
  if (srcRect.value.iBottom <= srcRect.value.iTop) {
    return false;
  }

  // Determine memcopy coordinates
  uiSrcStart = srcRect.value.iTop * hImage.value.usWidth + srcRect.value.iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect.value.iBottom - srcRect.value.iTop) + 1;
  uiLineSize = (srcRect.value.iRight - srcRect.value.iLeft) + 1;

  if (usDestWidth < uiLineSize) {
    return false;
  }
  if (usDestHeight < uiNumLines) {
    return false;
  }

  // Copy line by line
  pDest = pDestBuf + uiDestStart;
  pSrc = hImage.value.p16BPPData + uiSrcStart;

  for (cnt = 0; cnt < uiNumLines - 1; cnt++) {
    memcpy(pDest, pSrc, uiLineSize * 2);
    pDest += usDestWidth;
    pSrc += hImage.value.usWidth;
  }
  // Do last line
  memcpy(pDest, pSrc, uiLineSize * 2);

  return true;
}

function Extract8BPPCompressedImageToBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>): boolean {
  return false;
}

function Extract16BPPCompressedImageToBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>): boolean {
  return false;
}

function Copy8BPPImageTo16BPPBuffer(hImage: HIMAGE, pDestBuf: Pointer<BYTE>, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: Pointer<SGPRect>): boolean {
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

  p16BPPPalette = hImage.value.pui16BPPPalette;

  // Assertions
  Assert(p16BPPPalette != null);
  Assert(hImage != null);

  // Validations
  if (hImage.value.p16BPPData == null) {
    return false;
  }
  if (usX < 0) {
    return false;
  }
  if (usX >= usDestWidth) {
    return false;
  }
  if (usY < 0) {
    return false;
  }
  if (usY >= usDestHeight) {
    return false;
  }
  if (srcRect.value.iRight <= srcRect.value.iLeft) {
    return false;
  }
  if (srcRect.value.iBottom <= srcRect.value.iTop) {
    return false;
  }

  // Determine memcopy coordinates
  uiSrcStart = srcRect.value.iTop * hImage.value.usWidth + srcRect.value.iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect.value.iBottom - srcRect.value.iTop);
  uiLineSize = (srcRect.value.iRight - srcRect.value.iLeft);

  if (usDestWidth < uiLineSize) {
    return false;
  }
  if (usDestHeight < uiNumLines) {
    return false;
  }

  // Convert to Pixel specification
  pDest = pDestBuf + uiDestStart;
  pSrc = hImage.value.p8BPPData + uiSrcStart;
  DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, FormatString("Start Copying at %p", pDest));

  // For every entry, look up into 16BPP palette
  for (rows = 0; rows < uiNumLines - 1; rows++) {
    pDestTemp = pDest;
    pSrcTemp = pSrc;

    for (cols = 0; cols < uiLineSize; cols++) {
      pDestTemp.value = p16BPPPalette[pSrcTemp.value];
      pDestTemp++;
      pSrcTemp++;
    }

    pDest += usDestWidth;
    pSrc += hImage.value.usWidth;
  }
  // Do last line
  DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, FormatString("End Copying at %p", pDest));

  return true;
}

export function Create16BPPPalette(pPalette: Pointer<SGPPaletteEntry>): Pointer<UINT16> {
  let p16BPPPalette: Pointer<UINT16>;
  let r16: UINT16;
  let g16: UINT16;
  let b16: UINT16;
  let usColor: UINT16;
  let cnt: UINT32;
  let r: UINT8;
  let g: UINT8;
  let b: UINT8;

  Assert(pPalette != null);

  p16BPPPalette = MemAlloc(sizeof(UINT16) * 256);

  for (cnt = 0; cnt < 256; cnt++) {
    r = pPalette[cnt].peRed;
    g = pPalette[cnt].peGreen;
    b = pPalette[cnt].peBlue;

    if (gusRedShift < 0)
      r16 = (r >> Math.abs(gusRedShift));
    else
      r16 = (r << gusRedShift);

    if (gusGreenShift < 0)
      g16 = (g >> Math.abs(gusGreenShift));
    else
      g16 = (g << gusGreenShift);

    if (gusBlueShift < 0)
      b16 = (b >> Math.abs(gusBlueShift));
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
export function Create16BPPPaletteShaded(pPalette: SGPPaletteEntry[], rscale: UINT32, gscale: UINT32, bscale: UINT32, mono: boolean): UINT16[] {
  let p16BPPPalette: UINT16[];
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

  Assert(pPalette != null);

  p16BPPPalette = createArray(256, 0);

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

    r = Math.min(rmod, 255);
    g = Math.min(gmod, 255);
    b = Math.min(bmod, 255);

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
export function Get16BPPColor(RGBValue: UINT32): UINT16 {
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
    r16 = (r >> Math.abs(gusRedShift));
  else
    r16 = (r << gusRedShift);

  if (gusGreenShift < 0)
    g16 = (g >> Math.abs(gusGreenShift));
  else
    g16 = (g << gusGreenShift);

  if (gusBlueShift < 0)
    b16 = (b >> Math.abs(gusBlueShift));
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
export function GetRGBColor(Value16BPP: UINT16): UINT32 {
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
    r = (r16 << Math.abs(gusRedShift));
  else
    r = (r16 >> gusRedShift);

  if (gusGreenShift < 0)
    g = (g16 << Math.abs(gusGreenShift));
  else
    g = (g16 >> gusGreenShift);

  if (gusBlueShift < 0)
    b = (b16 << Math.abs(gusBlueShift));
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
    pPalEntry.value.peRed = (pOldPalette + (Index * 3)).value;
    pPalEntry.value.peGreen = (pOldPalette + (Index * 3) + 1).value;
    pPalEntry.value.peBlue = (pOldPalette + (Index * 3) + 2).value;
    pPalEntry.value.peFlags = 0;
    pPalEntry++;
  }
  return pInitEntry;
}

export function GetETRLEImageData(hImage: HIMAGE, pBuffer: Pointer<ETRLEData>): boolean {
  // Assertions
  Assert(hImage != null);
  Assert(pBuffer != null);

  // Create memory for data
  pBuffer.value.usNumberOfObjects = hImage.value.usNumberOfObjects;

  // Create buffer for objects
  pBuffer.value.pETRLEObject = MemAlloc(sizeof(ETRLEObject) * pBuffer.value.usNumberOfObjects);
  if (pBuffer.value.pETRLEObject == null) {
    return false;
  }

  // Copy into buffer
  memcpy(pBuffer.value.pETRLEObject, hImage.value.pETRLEObject, sizeof(ETRLEObject) * pBuffer.value.usNumberOfObjects);

  // Allocate memory for pixel data
  pBuffer.value.pPixData = MemAlloc(hImage.value.uiSizePixData);
  if (pBuffer.value.pPixData == null) {
    return false;
  }

  pBuffer.value.uiSizePixData = hImage.value.uiSizePixData;

  // Copy into buffer
  memcpy(pBuffer.value.pPixData, hImage.value.pPixData8, pBuffer.value.uiSizePixData);

  return true;
}

export function ConvertRGBDistribution565To555(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiLoop: UINT32;

  let Pixel: SplitUINT32 = createSplitUint32();

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // If the pixel is completely black, don't bother converting it -- DB
    if (pPixel.value != 0) {
      // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
      // right shift the blue value (at the bottom) into the LOWER word to protect it
      Pixel.usHigher = pPixel.value;
      Pixel.uiValue >>= 5;
      // get rid of the least significant bit of green
      Pixel.usHigher >>= 1;
      // now shift back into the upper word
      Pixel.uiValue <<= 5;
      // and copy back
      pPixel.value = Pixel.usHigher | gusAlphaMask;
    }
    pPixel++;
  }
}

export function ConvertRGBDistribution565To655(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiLoop: UINT32;

  let Pixel: SplitUINT32 = createSplitUint32();

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
    // right shift the blue value (at the bottom) into the LOWER word to protect it
    Pixel.usHigher = pPixel.value;
    Pixel.uiValue >>= 5;
    // get rid of the least significant bit of green
    Pixel.usHigher >>= 1;
    // shift to the right some more...
    Pixel.uiValue >>= 5;
    // so we can left-shift the red value alone to give it an extra bit
    Pixel.usHigher <<= 1;
    // now shift back and copy
    Pixel.uiValue <<= 10;
    pPixel.value = Pixel.usHigher;
    pPixel++;
  }
}

export function ConvertRGBDistribution565To556(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiLoop: UINT32;

  let Pixel: SplitUINT32 = createSplitUint32();

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
    // right shift the blue value (at the bottom) into the LOWER word to protect it
    Pixel.usHigher = pPixel.value;
    Pixel.uiValue >>= 5;
    // get rid of the least significant bit of green
    Pixel.usHigher >>= 1;
    // shift back into the upper word
    Pixel.uiValue <<= 5;
    // give blue an extra bit (blank in the least significant spot)
    Pixel.usHigher <<= 1;
    // copy back
    pPixel.value = Pixel.usHigher;
    pPixel++;
  }
}

export function ConvertRGBDistribution565ToAny(p16BPPData: Pointer<UINT16>, uiNumberOfPixels: UINT32): void {
  let pPixel: Pointer<UINT16>;
  let uiRed: UINT32;
  let uiGreen: UINT32;
  let uiBlue: UINT32;
  let uiTemp: UINT32;
  let uiLoop: UINT32;

  pPixel = p16BPPData;
  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // put the 565 RGB 16-bit value into a 32-bit RGB value
    uiRed = (pPixel.value) >> 11;
    uiGreen = (pPixel.value & 0x07E0) >> 5;
    uiBlue = (pPixel.value & 0x001F);
    uiTemp = FROMRGB(uiRed, uiGreen, uiBlue);
    // then convert the 32-bit RGB value to whatever 16 bit format is used
    pPixel.value = Get16BPPColor(uiTemp);
    pPixel++;
  }
}

}
