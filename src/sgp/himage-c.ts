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

class _SplitUINT32 implements SplitUINT32 {
  public usLower: UINT16;
  public usHigher: UINT16;

  constructor() {
    this.usLower = 0;
    this.usHigher = 0;
  }

  get uiValue() {
    return (this.usHigher << 16) | this.usLower;
  }

  set uiValue(value) {
    this.usLower = value & 0xFFFF;
    this.usHigher = value >> 16;
  }
}

function createSplitUint32(): SplitUINT32 {
  return new _SplitUINT32();
}

export function CreateImage(ImageFile: string /* SGPFILENAME */, fContents: UINT16): ImageType {
  let hImage: ImageType;
  let Extension: string /* SGPFILENAME */;
  let ExtensionSep: string /* CHAR8[] */ = ".";
  let StrPtr: number /* STR */;
  let iFileLoader: UINT32;

  // Depending on extension of filename, use different image readers
  // Get extension
  StrPtr = ImageFile.indexOf(ExtensionSep);

  if (StrPtr == -1) {
    // No extension given, use default internal loader extension
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, "No extension given, using default");
    ImageFile += ".PCX";
    Extension = ".PCX";
  } else {
    Extension = ImageFile.substring(StrPtr + 1);
  }

  // Determine type from Extension
  do {
    iFileLoader = UNKNOWN_FILE_READER;

    if (Extension.toUpperCase() === "PCX") {
      iFileLoader = PCX_FILE_READER;
      break;
    }

    if (Extension.toUpperCase() === "TGA") {
      iFileLoader = TGA_FILE_READER;
      break;
    }

    if (Extension.toUpperCase() === "STI") {
      iFileLoader = STCI_FILE_READER;
      break;
    }
  } while (false);

  // Determine if resource exists before creating image structure
  if (!FileExists(ImageFile)) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, FormatString("Resource file %s does not exist.", ImageFile));
    return <ImageType><unknown>null;
  }

  // Create memory for image structure
  hImage = createImageType();

  // hImage->fFlags = 0;
  // Set data pointers to NULL
  // hImage->pImageData = NULL;
  // hImage->pPalette   = NULL;
  // hImage->pui16BPPPalette = NULL;

  // Set filename and loader
  hImage.ImageFile = ImageFile;
  hImage.iFileLoader = iFileLoader;

  if (!LoadImageData(hImage, fContents)) {
    return <ImageType><unknown>null;
  }

  // All is fine, image is loaded and allocated, return pointer
  return hImage;
}

export function DestroyImage(hImage: ImageType): boolean {
  Assert(hImage != null);

  // First delete contents
  ReleaseImageData(hImage, IMAGE_ALLDATA); // hImage->fFlags );

  return true;
}

function ReleaseImageData(hImage: ImageType, fContents: UINT16): boolean {
  Assert(hImage != null);

  if ((fContents & IMAGE_PALETTE) && (hImage.fFlags & IMAGE_PALETTE)) {
    // Destroy palette
    if (hImage.pPalette != null) {
      hImage.pPalette = <SGPPaletteEntry[]><unknown>null;
    }

    if (hImage.pui16BPPPalette != null) {
      hImage.pui16BPPPalette = <Uint16Array><unknown>null;
    }

    // Remove contents flag
    hImage.fFlags = hImage.fFlags ^ IMAGE_PALETTE;
  }

  if ((fContents & IMAGE_BITMAPDATA) && (hImage.fFlags & IMAGE_BITMAPDATA)) {
    // Destroy image data
    Assert(hImage.pImageData != null);
    hImage.pImageData = <Buffer><unknown>null;
    hImage.pCompressedImageData = <Buffer><unknown>null;
    hImage.p8BPPData = <Uint8Array><unknown>null;
    hImage.p16BPPData = <Uint16Array><unknown>null;
    hImage.pPixData8 = <Uint8Array><unknown>null;
    if (hImage.usNumberOfObjects > 0) {
      hImage.pETRLEObject = <ETRLEObject[]><unknown>null;
    }
    // Remove contents flag
    hImage.fFlags = hImage.fFlags ^ IMAGE_BITMAPDATA;
  }

  if ((fContents & IMAGE_APPDATA) && (hImage.fFlags & IMAGE_APPDATA)) {
    // get rid of the APP DATA
    if (hImage.pAppData != null) {
      hImage.pAppData = <Buffer><unknown>null;
      hImage.fFlags &= (~IMAGE_APPDATA);
    }
  }

  return true;
}

function LoadImageData(hImage: ImageType, fContents: UINT16): boolean {
  let fReturnVal: boolean = false;

  Assert(hImage != null);

  // Switch on file loader
  switch (hImage.iFileLoader) {
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

export function CopyImageToBuffer(hImage: ImageType, fBufferType: UINT32, pDestBuf: Uint8Array, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: SGPRect): boolean {
  // Use blitter based on type of image
  Assert(hImage != null);

  if (hImage.ubBitDepth == 8 && fBufferType == BUFFER_8BPP) {
    // Default do here
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_2, "Copying 8 BPP Imagery.");
    return Copy8BPPImageTo8BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  if (hImage.ubBitDepth == 8 && fBufferType == BUFFER_16BPP) {
    // Default do here
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Copying 8 BPP Imagery to 16BPP Buffer.");
    return Copy8BPPImageTo16BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  if (hImage.ubBitDepth == 16 && fBufferType == BUFFER_16BPP) {
    DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, "Automatically Copying 16 BPP Imagery.");
    return Copy16BPPImageTo16BPPBuffer(hImage, pDestBuf, usDestWidth, usDestHeight, usX, usY, srcRect);
  }

  return false;
}

function Copy8BPPImageTo8BPPBuffer(hImage: ImageType, pDestBuf: Uint8Array, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: SGPRect): boolean {
  let uiSrcStart: UINT32;
  let uiDestStart: UINT32;
  let uiNumLines: UINT32;
  let uiLineSize: UINT32;
  let cnt: UINT32;
  let pDest: UINT8;
  let pSrc: UINT8;

  // Assertions
  Assert(hImage != null);
  Assert(hImage.p16BPPData != null);

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
  if (srcRect.iRight <= srcRect.iLeft) {
    return false;
  }
  if (srcRect.iBottom <= srcRect.iTop) {
    return false;
  }

  // Determine memcopy coordinates
  uiSrcStart = srcRect.iTop * hImage.usWidth + srcRect.iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect.iBottom - srcRect.iTop) + 1;
  uiLineSize = (srcRect.iRight - srcRect.iLeft) + 1;

  Assert(usDestWidth >= uiLineSize);
  Assert(usDestHeight >= uiNumLines);

  // Copy line by line
  pDest = uiDestStart;
  pSrc = uiSrcStart;

  for (cnt = 0; cnt < uiNumLines; cnt++) {
    for (let i = 0; i < uiLineSize; i++) {
      pDestBuf[pDest + i] = hImage.p8BPPData[pSrc + i];
    }
    pDest += usDestWidth;
    pSrc += hImage.usWidth;
  }

  return true;
}

function Copy16BPPImageTo16BPPBuffer(hImage: ImageType, pDestBuf: Uint8Array, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: SGPRect): boolean {
  let uiSrcStart: UINT32;
  let uiDestStart: UINT32;
  let uiNumLines: UINT32;
  let uiLineSize: UINT32;
  let cnt: UINT32;
  let pDest: UINT16;
  let pSrc: UINT16;

  Assert(hImage != null);
  Assert(hImage.p16BPPData != null);

  // Validations
  if (usX < 0) {
    return false;
  }
  if (usX >= hImage.usWidth) {
    return false;
  }
  if (usY < 0) {
    return false;
  }
  if (usY >= hImage.usHeight) {
    return false;
  }
  if (srcRect.iRight <= srcRect.iLeft) {
    return false;
  }
  if (srcRect.iBottom <= srcRect.iTop) {
    return false;
  }

  // Determine memcopy coordinates
  uiSrcStart = srcRect.iTop * hImage.usWidth + srcRect.iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect.iBottom - srcRect.iTop) + 1;
  uiLineSize = (srcRect.iRight - srcRect.iLeft) + 1;

  if (usDestWidth < uiLineSize) {
    return false;
  }
  if (usDestHeight < uiNumLines) {
    return false;
  }

  // Copy line by line
  pDest = uiDestStart;
  pSrc = uiSrcStart;

  for (cnt = 0; cnt < uiNumLines; cnt++) {
    for (let i = 0; i < uiLineSize * 2; i++) {
      pDestBuf[pDest + i] = hImage.p16BPPData[pSrc + i];
    }
    pDest += usDestWidth;
    pSrc += hImage.usWidth;
  }

  return true;
}

function Extract8BPPCompressedImageToBuffer(hImage: ImageType, pDestBuf: Uint8Array): boolean {
  return false;
}

function Extract16BPPCompressedImageToBuffer(hImage: ImageType, pDestBuf: Uint8Array): boolean {
  return false;
}

function Copy8BPPImageTo16BPPBuffer(hImage: ImageType, pDestBuf: Uint8Array, usDestWidth: UINT16, usDestHeight: UINT16, usX: UINT16, usY: UINT16, srcRect: SGPRect): boolean {
  let uiSrcStart: UINT32;
  let uiDestStart: UINT32;
  let uiNumLines: UINT32;
  let uiLineSize: UINT32;
  let rows: UINT32;
  let cols: UINT32;
  let pSrc: UINT8;
  let pSrcTemp: UINT8;
  let pDest: UINT16;
  let pDestTemp: UINT16;
  let p16BPPPalette: Uint16Array;

  p16BPPPalette = hImage.pui16BPPPalette;

  // Assertions
  Assert(p16BPPPalette != null);
  Assert(hImage != null);

  // Validations
  if (hImage.p16BPPData == null) {
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
  if (srcRect.iRight <= srcRect.iLeft) {
    return false;
  }
  if (srcRect.iBottom <= srcRect.iTop) {
    return false;
  }

  // Determine memcopy coordinates
  uiSrcStart = srcRect.iTop * hImage.usWidth + srcRect.iLeft;
  uiDestStart = usY * usDestWidth + usX;
  uiNumLines = (srcRect.iBottom - srcRect.iTop);
  uiLineSize = (srcRect.iRight - srcRect.iLeft);

  if (usDestWidth < uiLineSize) {
    return false;
  }
  if (usDestHeight < uiNumLines) {
    return false;
  }

  // Convert to Pixel specification
  pDest = uiDestStart;
  pSrc = uiSrcStart;
  DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, FormatString("Start Copying at %p", pDest));

  // For every entry, look up into 16BPP palette
  for (rows = 0; rows < uiNumLines - 1; rows++) {
    pDestTemp = pDest;
    pSrcTemp = pSrc;

    for (cols = 0; cols < uiLineSize; cols++) {
      pDestBuf[pDestTemp] = p16BPPPalette[hImage.p8BPPData[pSrcTemp]] >> 16;
      pDestBuf[pDestTemp] = p16BPPPalette[hImage.p8BPPData[pSrcTemp]] & 0xFFFF;
      pDestTemp += 2;
      pSrcTemp++;
    }

    pDest += usDestWidth * 2;
    pSrc += hImage.usWidth;
  }
  // Do last line
  DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_3, FormatString("End Copying at %p", pDest));

  return true;
}

export function Create16BPPPalette(pPalette: SGPPaletteEntry[]): Uint16Array {
  let p16BPPPalette: Uint16Array;
  let r16: UINT16;
  let g16: UINT16;
  let b16: UINT16;
  let usColor: UINT16;
  let cnt: UINT32;
  let r: UINT8;
  let g: UINT8;
  let b: UINT8;

  Assert(pPalette != null);

  p16BPPPalette = new Uint16Array(256);

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
export function Create16BPPPaletteShaded(pPalette: SGPPaletteEntry[], rscale: UINT32, gscale: UINT32, bscale: UINT32, mono: boolean): Uint16Array {
  let p16BPPPalette: Uint16Array;
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

  p16BPPPalette = new Uint16Array(256);

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

function ConvertRGBToPaletteEntry(sbStart: UINT8, sbEnd: UINT8, pOldPalette: Uint8Array): SGPPaletteEntry[] {
  let Index: UINT16;
  let pPalEntry: SGPPaletteEntry[];
  let pInitEntry: SGPPaletteEntry[];

  pPalEntry = createArrayFrom(256, createSGPPaletteEntry);
  pInitEntry = pPalEntry;
  DbgMessage(TOPIC_HIMAGE, DBG_LEVEL_0, "Converting RGB palette to SGPPaletteEntry");
  for (Index = 0; Index <= (sbEnd - sbStart); Index++) {
    pPalEntry[Index].peRed = pOldPalette[Index * 3];
    pPalEntry[Index].peGreen = pOldPalette[Index * 3 + 1];
    pPalEntry[Index].peBlue = pOldPalette[Index * 3 + 2];
    pPalEntry[Index].peFlags = 0;
  }
  return pInitEntry;
}

export function GetETRLEImageData(hImage: ImageType, pBuffer: ETRLEData): boolean {
  // Assertions
  Assert(hImage != null);
  Assert(pBuffer != null);

  // Create memory for data
  pBuffer.usNumberOfObjects = hImage.usNumberOfObjects;

  // Create buffer for objects
  pBuffer.pETRLEObject = createArrayFrom(pBuffer.usNumberOfObjects, createETRLEObject);

  // Copy into buffer
  copyObjectArray(pBuffer.pETRLEObject, hImage.pETRLEObject, copyETRLEObject);

  // Allocate memory for pixel data
  pBuffer.pPixData = new Uint8Array(hImage.uiSizePixData);

  pBuffer.uiSizePixData = hImage.uiSizePixData;

  // Copy into buffer
  pBuffer.pPixData.set(hImage.pPixData8);

  return true;
}

export function ConvertRGBDistribution565To555(p16BPPData: Uint16Array, uiNumberOfPixels: UINT32): void {
  let pPixel: UINT16;
  let uiLoop: UINT32;

  let Pixel: SplitUINT32 = createSplitUint32();

  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    pPixel = p16BPPData[uiLoop];
    // If the pixel is completely black, don't bother converting it -- DB
    if (pPixel != 0) {
      // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
      // right shift the blue value (at the bottom) into the LOWER word to protect it
      Pixel.usHigher = pPixel;
      Pixel.uiValue >>= 5;
      // get rid of the least significant bit of green
      Pixel.usHigher >>= 1;
      // now shift back into the upper word
      Pixel.uiValue <<= 5;
      // and copy back
      p16BPPData[uiLoop] = Pixel.usHigher | gusAlphaMask;
    }
  }
}

export function ConvertRGBDistribution565To655(p16BPPData: Uint16Array, uiNumberOfPixels: UINT32): void {
  let uiLoop: UINT32;
  let Pixel: SplitUINT32 = createSplitUint32();

  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
    // right shift the blue value (at the bottom) into the LOWER word to protect it
    Pixel.usHigher = p16BPPData[uiLoop];
    Pixel.uiValue >>= 5;
    // get rid of the least significant bit of green
    Pixel.usHigher >>= 1;
    // shift to the right some more...
    Pixel.uiValue >>= 5;
    // so we can left-shift the red value alone to give it an extra bit
    Pixel.usHigher <<= 1;
    // now shift back and copy
    Pixel.uiValue <<= 10;
    p16BPPData[uiLoop] = Pixel.usHigher;
  }
}

export function ConvertRGBDistribution565To556(p16BPPData: Uint16Array, uiNumberOfPixels: UINT32): void {
  let uiLoop: UINT32;
  let Pixel: SplitUINT32 = createSplitUint32();

  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    // we put the 16 pixel bits in the UPPER word of uiPixel, so that we can
    // right shift the blue value (at the bottom) into the LOWER word to protect it
    Pixel.usHigher = p16BPPData[uiLoop];
    Pixel.uiValue >>= 5;
    // get rid of the least significant bit of green
    Pixel.usHigher >>= 1;
    // shift back into the upper word
    Pixel.uiValue <<= 5;
    // give blue an extra bit (blank in the least significant spot)
    Pixel.usHigher <<= 1;
    // copy back
    p16BPPData[uiLoop] = Pixel.usHigher;
  }
}

export function ConvertRGBDistribution565ToAny(p16BPPData: Uint16Array, uiNumberOfPixels: UINT32): void {
  let pPixel: UINT16;
  let uiRed: UINT32;
  let uiGreen: UINT32;
  let uiBlue: UINT32;
  let uiTemp: UINT32;
  let uiLoop: UINT32;

  for (uiLoop = 0; uiLoop < uiNumberOfPixels; uiLoop++) {
    pPixel = p16BPPData[uiLoop];
    // put the 565 RGB 16-bit value into a 32-bit RGB value
    uiRed = pPixel >> 11;
    uiGreen = (pPixel & 0x07E0) >> 5;
    uiBlue = pPixel & 0x001F;
    uiTemp = FROMRGB(uiRed, uiGreen, uiBlue);
    // then convert the 32-bit RGB value to whatever 16 bit format is used
    p16BPPData[uiLoop] = Get16BPPColor(uiTemp);
  }
}

}
